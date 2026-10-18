// Tests du moteur d'animation (src/scripts/motion.ts + src/styles/global.css) : chaque data-* documente
// dans l'en-tete de motion.ts est reellement gere par le code, et chaque effet ajoute par la veille
// animations.md (bloc "Nouveaux effets" de l'en-tete) a une regle explicite dans le bloc
// @media (prefers-reduced-motion: reduce) de global.css. Verifie aussi que le site _effets (vitrine de
// tous les effets, sites/_effets/) build sans erreur (FF_OUT isole la sortie, comme les autres tests).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MOTION_TS = path.join(ROOT, 'src', 'scripts', 'motion.ts');
const GLOBAL_CSS = path.join(ROOT, 'src', 'styles', 'global.css');
const ASTRO = path.join(ROOT, 'node_modules', 'astro', 'astro.js');
const TEST_OUT = 'dist/_test-effets';

const motionSrc = fs.readFileSync(MOTION_TS, 'utf8');
const cssSrc = fs.readFileSync(GLOBAL_CSS, 'utf8');

after(() => {
  const dir = path.join(ROOT, TEST_OUT);
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
});

/** L'en-tete de motion.ts est le premier commentaire de bloc /** ... *\/ du fichier. */
function headerComment(src) {
  const m = src.match(/^\/\*\*[\s\S]*?\*\//);
  assert.ok(m, 'motion.ts doit commencer par un commentaire /** ... */ documentant les data-*');
  return m[0];
}

/** Le corps = tout le fichier apres l'en-tete (la ou les data-* doivent etre reellement geres). */
function bodyAfterHeader(src) {
  const header = headerComment(src);
  return src.slice(header.length);
}

/** Le bloc @media (prefers-reduced-motion: reduce) { ... } de global.css. */
function reducedMotionBlock(css) {
  const start = css.indexOf('@media (prefers-reduced-motion: reduce)');
  assert.ok(start !== -1, "global.css doit avoir un bloc @media (prefers-reduced-motion: reduce)");
  const braceStart = css.indexOf('{', start);
  let depth = 0;
  for (let i = braceStart; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}') {
      depth--;
      if (depth === 0) return css.slice(braceStart, i + 1);
    }
  }
  throw new Error('bloc reduced-motion non ferme dans global.css');
}

const header = headerComment(motionSrc);
const body = bodyAfterHeader(motionSrc);
const reduced = reducedMotionBlock(cssSrc);

// L'en-tete separe les attributs "legacy" (avant cette tache) des "nouveaux effets" (docs/veille/
// animations.md §3) par une ligne marqueur. Seuls les nouveaux doivent avoir une regle reduced-motion
// explicite et testable ici : les legacy peuvent rester "CSS-only par construction" (rich() ne
// s'execute jamais quand prefers-reduced-motion est actif, cf. initMotion()).
const markerIndex = header.search(/Nouveaux effets/i);
assert.ok(markerIndex !== -1, `en-tete de motion.ts : marqueur "Nouveaux effets" introuvable`);
const legacyPart = header.slice(0, markerIndex);
const newPart = header.slice(markerIndex);

const attrPattern = /data-[a-z][a-z-]*/g;
const legacyAttrs = [...new Set(legacyPart.match(attrPattern) ?? [])];
const newAttrsRaw = [...new Set(newPart.match(attrPattern) ?? [])];
// Un attribut deja legacy (ex: data-split, reutilise par data-split="chars") ne compte pas deux fois.
const newAttrs = newAttrsRaw.filter((a) => !legacyAttrs.includes(a));

test('en-tete de motion.ts : au moins 13 nouveaux effets documentes (docs/veille/animations.md §3)', () => {
  assert.ok(newAttrs.length >= 13, `attendu >= 13 nouveaux data-*, trouve ${newAttrs.length} : ${newAttrs.join(', ')}`);
});

test('chaque data-* legacy documente en tete est gere dans le corps de motion.ts ou dans global.css', () => {
  const missing = legacyAttrs.filter((attr) => !body.includes(attr) && !cssSrc.includes(attr));
  assert.deepEqual(missing, [], `attributs legacy documentes mais introuvables dans le code : ${missing.join(', ')}`);
});

test('chaque nouveau data-* est gere dans le corps de motion.ts ou dans global.css (grep)', () => {
  const missing = newAttrs.filter((attr) => !body.includes(attr) && !cssSrc.includes(attr));
  assert.deepEqual(missing, [], `nouveaux attributs documentes mais introuvables dans le code : ${missing.join(', ')}`);
});

test('chaque nouveau data-* a une regle explicite dans le bloc reduced-motion de global.css', () => {
  const missing = newAttrs.filter((attr) => !reduced.includes(attr));
  assert.deepEqual(missing, [], `nouveaux attributs sans regle @media (prefers-reduced-motion: reduce) : ${missing.join(', ')}`);
});

// data-shader : le module frere src/scripts/shader.ts (OGL + fragment shaders) ne doit jamais entrer dans
// le chunk initial (import() seulement), et motion.ts doit poser le repli (degrade statique) sans
// l'importer quand reduced/subtle/none. Le generique ci-dessus verifie deja que data-shader,
// data-shader-speed et data-shader-pointer sont cites dans le corps et dans le bloc reduced-motion.
const SHADER_TS = path.join(ROOT, 'src', 'scripts', 'shader.ts');
const shaderSrc = fs.readFileSync(SHADER_TS, 'utf8');

test('data-shader : shader.ts charge paresseusement, jamais importe statiquement par motion.ts', () => {
  assert.match(body, /import\('\.\/shader'\)/, "motion.ts doit charger ./shader via import() dynamique");
  assert.doesNotMatch(body, /^import .*['"]\.\/shader['"]/m, 'motion.ts ne doit pas importer ./shader statiquement');
  assert.match(shaderSrc, /await import\('ogl'\)/, 'shader.ts doit importer ogl a la demande');
  assert.doesNotMatch(body, /^import .*['"]ogl['"]/m, 'motion.ts ne doit pas importer ogl statiquement');
});

test('data-shader : quatre presets, options speed/pointer, pause et replis presents dans shader.ts', () => {
  for (const preset of ['mesh', 'silk', 'aurora', 'grain-gradient']) {
    const key = preset.includes('-') ? `'${preset}'` : preset;
    const needle = key + ': `${COMMON}';
    assert.ok(shaderSrc.includes(needle), `preset ${preset} manquant dans PRESETS (attendu ${JSON.stringify(needle)})`);
    assert.ok(body.includes(`${preset}:`) || body.includes(`'${preset}':`), `repli CSS SHADER_FALLBACK.${preset} manquant dans motion.ts`);
  }
  for (const needle of ['shaderSpeed', 'shaderPointer', 'IntersectionObserver', 'visibilitychange', 'webglcontextlost', 'MAX_DPR = 1.5', 'MAX_WIDTH = 1280', "matchMedia('(pointer: fine)')"]) {
    assert.ok(shaderSrc.includes(needle), `shader.ts : "${needle}" introuvable`);
  }
  // Couleurs : uniquement les cinq tokens, lus via getComputedStyle — aucune couleur en dur (hex/rgb) dans le module.
  assert.ok(shaderSrc.includes("['--bg', '--bg-2', '--accent', '--accent-2', '--fg']"), 'shader.ts : liste TOKENS attendue');
  assert.ok(shaderSrc.includes('getComputedStyle'), 'shader.ts : lecture des tokens via getComputedStyle');
  assert.doesNotMatch(shaderSrc, /#[0-9a-fA-F]{3,8}/, 'shader.ts : aucune couleur hex en dur');
});

test('data-shader : le repli (subtle/none/reduced) est pose AVANT la sortie anticipee de initMotion()', () => {
  const init = body.slice(body.indexOf('export function initMotion()'));
  const callIdx = init.indexOf('shaderBackgrounds(motion, reduced)');
  const guardIdx = init.indexOf("if (motion === 'none' || reduced)");
  assert.ok(callIdx !== -1 && guardIdx !== -1 && callIdx < guardIdx, 'shaderBackgrounds() doit etre appele avant la garde none/reduced');
  assert.match(body, /if \(motion !== 'rich' \|\| reduced\) \{\s*els\.forEach\(shaderFallback\)/, 'shaderBackgrounds() doit poser shaderFallback hors rich/reduced sans import()');
});

// --- docs/veille/animations-2.md (20 sept 2026) : deux regimes de duree, reveal sobre, split par lignes, scrub 1 ---

test('tokens : --motion-ui, --ease-out, --ease-in-out, --ease-brand definis dans global.css et --ease-brand par direction', () => {
  for (const token of ['--motion-ui:', '--ease-out:', '--ease-in-out:', '--ease-brand:']) {
    assert.ok(cssSrc.includes(token), `global.css : ${token} manquant`);
  }
  const dirs = fs.readdirSync(path.join(ROOT, 'src', 'directions'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  assert.ok(dirs.length >= 8);
  for (const d of dirs) {
    const css = fs.readFileSync(path.join(ROOT, 'src', 'directions', d, 'index.css'), 'utf8');
    assert.match(css, /--ease-brand:\s*cubic-bezier\(/, `direction ${d} : --ease-brand manquant`);
    const dur = /--motion-duration:\s*([\d.]+)s/.exec(css);
    if (dur) assert.ok(Number(dur[1]) <= 1, `direction ${d} : --motion-duration ${dur[1]}s > 1 s (plafond R1)`);
  }
});

/** Blocs CSS { selecteur, corps } d'une feuille (sans les @media imbriques, suffisant pour .btn/:hover). */
function cssBlocks(css) {
  const blocks = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) blocks.push({ selector: m[1].trim(), body: m[2] });
  return blocks;
}

test('aucun :hover / .btn ne transitionne sur --motion-duration (global.css + directions) : regime --motion-ui', () => {
  const files = [GLOBAL_CSS, ...fs.readdirSync(path.join(ROOT, 'src', 'directions')).map((d) => path.join(ROOT, 'src', 'directions', d, 'index.css')).filter((f) => fs.existsSync(f))];
  const offenders = [];
  for (const f of files) {
    for (const { selector, body } of cssBlocks(fs.readFileSync(f, 'utf8'))) {
      if (!/:hover|\.btn\b|:focus/.test(selector)) continue;
      if (/transition[^;]*--motion-duration/.test(body)) offenders.push(`${path.relative(ROOT, f)} — ${selector}`);
    }
  }
  assert.deepEqual(offenders, [], `survols/boutons encore sur --motion-duration :\n${offenders.join('\n')}`);
});

test('data-reveal par defaut = opacite seule (aucun translateY dans la regle de base), data-reveal="up" = 12 px', () => {
  const base = /\[data-motion\]:not\(\[data-motion='none'\]\) \[data-reveal\],\s*\[data-motion\]:not\(\[data-motion='none'\]\) \[data-stagger\] > \* \{([^}]*)\}/.exec(cssSrc);
  assert.ok(base, 'regle de base [data-reveal] introuvable');
  assert.doesNotMatch(base[1], /transform:\s*translate/, 'la regle de base ne doit plus deplacer');
  assert.match(base[1], /opacity 0\.5s var\(--ease-out\)/, 'opacite en 0,5 s sur --ease-out');
  assert.match(cssSrc, /\[data-reveal='up'\] \{ transform: translateY\(12px\); \}/);
  assert.match(body, /el\.dataset\.stagger \|\| 60/, 'stagger par defaut 60 ms');
  assert.match(body, /Math\.min\(400, Number\(d\)/, 'data-reveal-delay plafonne a 400 ms');
});

test('data-split="lines" : SplitText charge a la demande, --ease-brand lu en CustomEase, reduced-motion = texte visible', () => {
  assert.match(body, /import\('gsap\/SplitText'\)/, 'SplitText doit etre importe dynamiquement');
  assert.doesNotMatch(body, /^import .*gsap\/SplitText/m, 'jamais en import statique');
  assert.ok(fs.existsSync(path.join(ROOT, 'node_modules', 'gsap', 'SplitText.js')), 'SplitText.js absent du paquet gsap installe');
  assert.match(body, /mask: 'lines'/);
  assert.match(body, /autoSplit: true/, 're-split au resize');
  assert.match(body, /cssEase\('--ease-brand'\)/);
  // reduced : initMotion() sort avant splitLines() et pose data-split-state="static" ; global.css rend le titre visible.
  const init = body.slice(body.indexOf('export function initMotion()'), body.indexOf('function curtain()'));
  const guard = init.indexOf("if (motion === 'none' || reduced)");
  const lines = init.indexOf('splitLines()');
  assert.ok(guard !== -1 && lines !== -1 && guard < lines, 'splitLines() doit venir apres la garde none/reduced');
  assert.match(init.slice(guard, init.indexOf('return;', guard)), /data-split="lines"/, 'la garde reduced doit marquer les data-split="lines" comme statiques');
  assert.match(reduced, /\[data-split='lines'\] \{ visibility: visible !important; \}/);
  assert.match(reduced, /\.split-line \{ transform: none !important; \}/);
});

test('scroll lie : scrub 1 par defaut (data-scrub, pin, horizontal, text-fill), lerp de frame pour data-frames', () => {
  assert.doesNotMatch(body, /scrub: (true|0\.[5-8])\b/, 'plus aucun scrub true/0,5/0,6/0,8 en dur');
  assert.match(body, /scrubLag\(el, 1\)/);
  assert.match(body, /el\.dataset\.framesLerp\) \|\| 0\.12/, 'data-frames-lerp defaut 0,12');
  assert.match(body, /function pinLength/);
  assert.match(body, /steps \* 100 \+ 100/, 'data-pin implicite = 100 % par etape + 100 %');
});

test('sites/_effets existe et declare motion: "rich" (vitrine des effets)', () => {
  const cfg = fs.readFileSync(path.join(ROOT, 'sites', '_effets', 'site.config.ts'), 'utf8');
  assert.match(cfg, /motion:\s*'rich'/, "sites/_effets/site.config.ts doit avoir motion: 'rich'");
  assert.match(cfg, /type:\s*'custom',\s*variant:\s*'effets'/, "sites/_effets doit utiliser la section custom 'effets' comme seule section");
});

test(
  'le site _effets build sans erreur (SITE=_effets, FF_OUT isole)',
  { timeout: 120 * 1000 },
  () => {
    const res = spawnSync(process.execPath, [ASTRO, 'build'], {
      cwd: ROOT,
      encoding: 'utf8',
      env: { ...process.env, SITE: '_effets', FF_OUT: TEST_OUT },
    });
    if (res.status !== 0) {
      console.log(res.stdout);
      console.log(res.stderr);
    }
    assert.equal(res.status, 0, '`astro build` a echoue pour sites/_effets (voir la sortie ci-dessus)');
    assert.ok(fs.existsSync(path.join(ROOT, TEST_OUT, 'index.html')), `${TEST_OUT}/index.html manquant apres le build`);
  },
);

// Profils de mouvement (docs/veille/styles/MOUVEMENTS.md, 18 oct 2026) : fond video, photo qui respire, entree par plans.
test('data-video-fond : poster obligatoire, pas d’autoplay HTML, lecture a l’ecran seulement, pause, rien sous none/reduced', () => {
  const fn = body.slice(body.indexOf('function videoFonds'), body.indexOf('function derives'));
  assert.ok(fn.length > 200, 'videoFonds() dans motion.ts');
  assert.match(fn, /getAttribute\('poster'\)/, 'poster verifie');
  assert.match(fn, /sans-poster/, 'sans poster : la video ne joue pas');
  assert.match(fn, /removeAttribute\('autoplay'\)/);
  assert.match(fn, /motion === 'none' \|\| reduced/);
  assert.match(fn, /IntersectionObserver/);
  assert.match(fn, /visibilitychange/);
  assert.match(fn, /\.catch\(/, 'play() rejete (iPhone en economie d’energie) : poster + bouton');
  assert.match(fn, /boutonPause/);
  const init = body.slice(body.indexOf('export function initMotion'), body.indexOf("if (motion === 'none' || reduced) {"));
  assert.match(init, /videoFonds\(motion, reduced\)/, 'appele avant le repli anticipe');
});

test('Hero video : data-video-fond, sans autoplay, poster obligatoire (heroVideoPoster ou hero), sinon pas de video', () => {
  const hero = fs.readFileSync(path.join(ROOT, 'src', 'sections', 'Hero', 'video.astro'), 'utf8');
  assert.match(hero, /data-video-fond/);
  assert.doesNotMatch(hero, /<video[^>]*\sautoplay/);
  assert.match(hero, /const poster = site\.images\.heroVideoPoster \?\? hero\?\.src;/);
  assert.match(hero, /const video = poster \? site\.images\.heroVideo : undefined;/);
  assert.match(hero, /poster=\{poster\}/);
  const schema = fs.readFileSync(path.join(ROOT, 'src', 'lib', 'schema.ts'), 'utf8');
  assert.match(schema, /heroVideoPoster: z\.string\(\)\.optional\(\)\.describe\(/);
});

test('data-derive et data-entree="plans" : CSS seul, deux regimes, pause hors ecran, coupes sous reduced-motion', () => {
  assert.match(cssSrc, /\[data-derive\]\.is-derive-on:not\(\.is-derive-pause\) img \{ animation-play-state: running; \}/);
  assert.match(cssSrc, /@keyframes ff-derive/);
  assert.match(cssSrc, /\[data-plan='fond'\] \{ animation: ff-plan-fond 1\.6s/, 'regime lent');
  assert.match(cssSrc, /\[data-plan='texte'\] \{ animation: ff-plan-texte 0\.2s/, 'regime sec');
  assert.match(cssSrc, /:not\(\[data-entree-jouee\]\)/, 'pas rejouee a chaque navigation');
  assert.match(body, /entreeJouee/);
  assert.match(reduced, /\[data-entree\] \[data-plan\] \{ animation: none !important;/);
  assert.match(reduced, /\[data-derive\] img \{ animation: none !important;/);
  assert.match(cssSrc, /\.ff-pause \{[^}]*width: 2\.75rem; height: 2\.75rem;/, 'cible de 44 px');
  assert.match(cssSrc, /--ease-ressort: linear\(/);
});
