/**
 * data-shader : fond WebGL en fragment shader (OGL, deja en dependance pour data-hover-distort),
 * charge paresseusement par motion.ts (`import('./shader')`) seulement si un [data-shader] est
 * present dans le DOM et que motion="rich" sans prefers-reduced-motion. Ce module n'est JAMAIS dans
 * le chunk initial (js-initial) : il embarque les shaders et l'import d'ogl.
 *
 * Presets (data-shader="mesh" | "silk" | "aurora" | "grain-gradient") : fonds lents (periodes
 * 20-40 s), peu contrastes, aux couleurs de la direction. Convention 20 (matiere) pour les heros
 * sans photo ; convention 16 : compte comme le seul feu d'artifice de la page.
 *
 * Couleurs : UNIQUEMENT les tokens --bg, --bg-2, --accent, --accent-2, --fg de la direction, lus
 * par getComputedStyle sur une sonde (`color: var(--x)`) — le navigateur resout hsl()/hex/calc()
 * en rgb(), jamais une couleur en dur ici. Options : data-shader-speed="0.5" (defaut 1),
 * data-shader-pointer="1" (derive tres douce vers le pointeur, pointer:fine uniquement).
 *
 * Budget : demarre a l'entree dans l'ecran (IntersectionObserver), en pause hors ecran et onglet
 * cache (visibilitychange), devicePixelRatio plafonne a 1.5 et largeur du tampon plafonnee a
 * 1280 px. Replis (WebGL absent, contexte perdu `webglcontextlost`, couleur illisible) : le degrade
 * CSS statique pose par motion.ts (shaderFallback) — jamais de canvas vide.
 */

type Rgb = [number, number, number];
type Fallback = (el: HTMLElement) => void;

const MAX_DPR = 1.5;
const MAX_WIDTH = 1280;
const MIN_FRAME_MS = 1000 / 30 - 2;
const TOKENS = ['--bg', '--bg-2', '--accent', '--accent-2', '--fg'] as const;

const VERTEX = `
attribute vec2 uv; attribute vec2 position;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

/* Bruit de valeur + fbm (GLSL ES 1.0, sans texture), commun aux presets. */
const COMMON = `
precision mediump float;
uniform float uTime; uniform vec2 uRes; uniform vec2 uPointer; uniform float uPointerAmt;
uniform vec3 uBg; uniform vec3 uBg2; uniform vec3 uAccent; uniform vec3 uAccent2; uniform vec3 uFg;
varying vec2 vUv;
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + vec2(17.0, 9.0); a *= 0.5; }
  return v;
}
vec2 aspect(vec2 uv) { return vec2(uv.x * uRes.x / uRes.y, uv.y); }
float grain(float amp) { return (hash(gl_FragCoord.xy + fract(uTime * 0.37) * 100.0) - 0.5) * amp; }
`;

const PRESETS: Record<string, string> = {
  /* Degrade maille : 4 taches douces (bg-2, accent, accent-2, bg-2) qui derivent lentement. */
  mesh: `${COMMON}
void main() {
  float t = uTime; float ar = uRes.x / uRes.y;
  vec2 p = aspect(vUv) + (uPointer - 0.5) * uPointerAmt * 0.08;
  vec2 c1 = vec2((0.28 + 0.16 * sin(t * 0.21)) * ar, 0.62 + 0.14 * cos(t * 0.17));
  vec2 c2 = vec2((0.74 + 0.14 * cos(t * 0.13 + 1.7)) * ar, 0.36 + 0.16 * sin(t * 0.19 + 0.6));
  vec2 c3 = vec2((0.52 + 0.18 * sin(t * 0.11 + 3.1)) * ar, 0.82 + 0.10 * cos(t * 0.23 + 2.2));
  vec2 c4 = vec2((0.20 + 0.14 * cos(t * 0.16 + 4.0)) * ar, 0.18 + 0.14 * sin(t * 0.14 + 1.2));
  float w1 = exp(-dot(p - c1, p - c1) * 3.2);
  float w2 = exp(-dot(p - c2, p - c2) * 3.6);
  float w3 = exp(-dot(p - c3, p - c3) * 4.2);
  float w4 = exp(-dot(p - c4, p - c4) * 3.0);
  vec3 col = uBg;
  col = mix(col, uBg2, w1);
  col = mix(col, mix(uBg, uAccent, 0.42), w2 * 0.85);
  col = mix(col, mix(uBg, uAccent2, 0.38), w3 * 0.75);
  col = mix(col, uBg2, w4 * 0.9);
  col += grain(0.02);
  gl_FragColor = vec4(col, 1.0);
}`,
  /* Nappes lentes facon soie/fumee : fbm a domaine deforme (bg -> bg-2, voile d'accent). */
  silk: `${COMMON}
void main() {
  float t = uTime * 0.12;
  vec2 p = aspect(vUv) + (uPointer - 0.5) * uPointerAmt * 0.06;
  vec2 q = vec2(fbm(p * 1.6 + vec2(t * 0.35, -t * 0.2)), fbm(p * 1.6 + vec2(-t * 0.25, t * 0.3) + 5.2));
  float n = fbm(p * 1.3 + 2.5 * q + vec2(t * 0.1, 0.0));
  float veil = fbm(p * 2.4 - q * 1.5 + t * 0.15);
  vec3 col = mix(uBg, uBg2, smoothstep(0.3, 0.8, n));
  col = mix(col, mix(uBg, uAccent, 0.3), smoothstep(0.55, 0.9, veil) * 0.6);
  col = mix(col, mix(uBg, uAccent2, 0.25), smoothstep(0.6, 0.95, n * veil * 1.7) * 0.5);
  col += grain(0.015);
  gl_FragColor = vec4(col, 1.0);
}`,
  /* Aurore : rideaux verticaux de lumiere (accent, accent-2) tres attenues sur bg -> bg-2. */
  aurora: `${COMMON}
void main() {
  float t = uTime * 0.1;
  vec2 p = aspect(vUv); p.x += (uPointer.x - 0.5) * uPointerAmt * 0.1;
  float env = smoothstep(0.08, 0.5, vUv.y) * smoothstep(1.05, 0.55, vUv.y);
  float a = fbm(vec2(p.x * 1.6 + t * 0.6, vUv.y * 0.7 - t * 0.35));
  float b = fbm(vec2(p.x * 2.2 - t * 0.45 + 3.7, vUv.y * 0.9 + t * 0.25));
  float c1 = smoothstep(0.42, 0.8, a) * env;
  float c2 = smoothstep(0.5, 0.85, b) * env;
  vec3 col = mix(uBg, uBg2, vUv.y * 0.7);
  col = mix(col, mix(uBg, uAccent, 0.5), c1 * 0.6);
  col = mix(col, mix(uBg, uAccent2, 0.45), c2 * 0.5);
  col += grain(0.02);
  gl_FragColor = vec4(col, 1.0);
}`,
  /* Degrade oblique qui respire a peine + grain de film anime : le plus proche d'un fond fixe. */
  'grain-gradient': `${COMMON}
void main() {
  float t = uTime * 0.08;
  float ang = 1.1 + 0.15 * sin(t);
  vec2 dir = vec2(cos(ang), sin(ang));
  float g = dot(vUv - 0.5, dir) + 0.5 + 0.06 * sin(t * 1.3 + vUv.x * 3.0) + (uPointer.y - 0.5) * uPointerAmt * 0.05;
  vec3 col = mix(uBg, uBg2, smoothstep(0.0, 0.7, g));
  col = mix(col, mix(uBg, uAccent, 0.32), smoothstep(0.55, 1.08, g));
  col = mix(col, uFg, 0.012 * (1.0 - g));
  col += grain(0.06);
  gl_FragColor = vec4(col, 1.0);
}`,
};

/** Lit un token couleur via une sonde `color: var(--x)` : le navigateur rend toujours rgb()/rgba(). */
function readToken(el: HTMLElement, token: string): Rgb | null {
  const probe = document.createElement('span');
  probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;color:var(${token})`;
  el.append(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  const m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/.exec(value);
  if (m) return [Number(m[1]) / 255, Number(m[2]) / 255, Number(m[3]) / 255];
  const s = /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(value);
  if (s) return [Number(s[1]), Number(s[2]), Number(s[3])];
  return null;
}

function readPalette(el: HTMLElement): Record<(typeof TOKENS)[number], Rgb> | null {
  const out = {} as Record<(typeof TOKENS)[number], Rgb>;
  for (const token of TOKENS) {
    const rgb = readToken(el, token);
    if (!rgb) return null;
    out[token] = rgb;
  }
  return out;
}

export async function initShaders(els: Iterable<HTMLElement>, fallback: Fallback, signal?: AbortSignal) {
  const list = Array.from(els).filter((el) => PRESETS[el.dataset.shader ?? '']);
  if (!list.length) return;
  let ogl: typeof import('ogl');
  try {
    ogl = await import('ogl');
  } catch {
    list.forEach(fallback);
    return;
  }
  // Sonde WebGL sur un canvas jetable : OGL logue une erreur console quand le contexte manque, on
  // prefere un repli silencieux (le degrade CSS) a une erreur dans la console du client.
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) {
    list.forEach(fallback);
    return;
  }
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const instances: { el: HTMLElement; setVisible: (v: boolean) => void; onVisibility: () => void }[] = [];

  for (const el of list) {
    const preset = PRESETS[el.dataset.shader!];
    const palette = readPalette(el);
    if (!palette) { fallback(el); continue; }
    const speed = Math.max(0, Number(el.dataset.shaderSpeed ?? '1') || 1);
    const pointerOn = finePointer && el.dataset.shaderPointer === '1';

    const canvas = document.createElement('canvas');
    canvas.className = 'ff-shader-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    let renderer: InstanceType<typeof ogl.Renderer>;
    try {
      renderer = new ogl.Renderer({ canvas, alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
      if (!renderer.gl) throw new Error('webgl');
    } catch {
      fallback(el);
      continue;
    }
    el.prepend(canvas);
    const gl = renderer.gl;
    const program = new ogl.Program(gl, {
      vertex: VERTEX,
      fragment: preset,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: [1, 1] },
        uPointer: { value: [0.5, 0.5] },
        uPointerAmt: { value: pointerOn ? 1 : 0 },
        uBg: { value: palette['--bg'] },
        uBg2: { value: palette['--bg-2'] },
        uAccent: { value: palette['--accent'] },
        uAccent2: { value: palette['--accent-2'] },
        uFg: { value: palette['--fg'] },
      },
    });
    const mesh = new ogl.Mesh(gl, { geometry: new ogl.Triangle(gl), program });

    let visible = false;
    let raf = 0;
    let dead = false;
    let last = 0;
    let time = 0;
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      const dpr = Math.min(devicePixelRatio || 1, MAX_DPR, MAX_WIDTH / w);
      renderer.dpr = dpr;
      renderer.setSize(w, h);
      canvas.style.width = '';
      canvas.style.height = '';
      program.uniforms.uRes.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
    };
    const frame = (now: number) => {
      raf = 0;
      if (dead || !visible || document.hidden) return;
      // Plafond 30 images/s : ces fonds bougent sur 20-40 s, 60 i/s ne changerait rien a l'oeil
      // et doublerait le travail GPU (batterie sur mobile).
      if (last && now - last < MIN_FRAME_MS) { raf = requestAnimationFrame(frame); return; }
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      time += dt * speed;
      program.uniforms.uTime.value = time;
      if (pointerOn) {
        pointer.x += (pointer.tx - pointer.x) * 0.04;
        pointer.y += (pointer.ty - pointer.y) * 0.04;
        program.uniforms.uPointer.value = [pointer.x, pointer.y];
      }
      renderer.render({ scene: mesh });
      if (el.dataset.shaderState !== 'drawn') el.dataset.shaderState = 'drawn';
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (dead || raf || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const die = () => {
      dead = true;
      stop();
      canvas.remove();
      fallback(el);
    };

    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); die(); });
    if (pointerOn) {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        pointer.tx = (e.clientX - r.left) / Math.max(r.width, 1);
        pointer.ty = 1 - (e.clientY - r.top) / Math.max(r.height, 1);
      }, { passive: true });
      el.addEventListener('pointerleave', () => { pointer.tx = 0.5; pointer.ty = 0.5; });
    }
    new ResizeObserver(() => { if (!dead) resize(); }).observe(el);
    resize();
    el.dataset.shaderState = 'ready';

    const setVisible = (v: boolean) => {
      visible = v;
      if (v) start();
      else stop();
    };
    instances.push({ el, setVisible, onVisibility: () => (document.hidden ? stop() : start()) });
  }

  if (!instances.length) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const inst = instances.find((i) => i.el === e.target);
      inst?.setVisible(e.isIntersecting);
    }
  }, { threshold: 0 });
  instances.forEach((i) => io.observe(i.el));
  document.addEventListener('visibilitychange', () => instances.forEach((i) => i.onVisibility()), { signal });
}
