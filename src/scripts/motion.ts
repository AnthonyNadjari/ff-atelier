/**
 * Runtime d'animation, pilote par attributs data-* (voir global.css).
 * - motion="none"   : rien ne s'execute.
 * - motion="subtle" : reveal au scroll, compteurs, marquee. Zero dependance.
 * - motion="rich"   : + GSAP (charge a la demande) pour parallax, split text, magnetic, tilt,
 *                     scrub (data-scrub), pin (data-pin), defilement horizontal (data-horizontal),
 *                     remplissage de texte (data-text-fill), image au survol (data-hover-img),
 *                     rideau d'entree (.ff-curtain), + script.ts de la direction s'il existe.
 */
export function initMotion() {
  const root = document.documentElement;
  const motion = root.dataset.motion ?? 'subtle';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (motion === 'none' || reduced) {
    document.querySelectorAll<HTMLElement>('[data-reveal],[data-stagger]').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  reveal();
  counters();
  marquee();
  navScroll();
  drawLines();

  if (motion === 'rich') {
    curtain();
    splitText();
    hoverImages();
    rich().catch(() => {});
    directionScript(root.dataset.direction);
  }
}

/** Rideau d'entree : .ff-curtain (pose par Base.astro) se retire, puis le hero se revele. */
function curtain() {
  const el = document.querySelector<HTMLElement>('.ff-curtain');
  if (!el) return;
  requestAnimationFrame(() => {
    el.classList.add('is-open');
    setTimeout(() => el.remove(), 1400);
  });
}

/** data-draw : un trait (hr, span) dont scaleX passe de 0 a 1 quand il entre a l'ecran. */
function drawLines() {
  const els = document.querySelectorAll<HTMLElement>('[data-draw]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-drawn'); io.unobserve(e.target); }
  }, { threshold: 0.4 });
  els.forEach((el) => io.observe(el));
}

/** data-hover-img="/images/x.webp" : une image flotte pres du curseur pendant le survol (pointer fin). */
function hoverImages() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const items = document.querySelectorAll<HTMLElement>('[data-hover-img]');
  if (!items.length) return;
  const img = document.createElement('img');
  img.className = 'ff-hover-img';
  img.alt = '';
  document.body.append(img);
  let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
  const loop = () => {
    tx += (x - tx) * 0.15;
    ty += (y - ty) * 0.15;
    img.style.transform = `translate(${tx + 24}px, ${ty - 120}px) rotate(${(x - tx) * 0.05}deg)`;
    raf = requestAnimationFrame(loop);
  };
  items.forEach((el) => {
    el.addEventListener('mouseenter', () => { img.src = el.dataset.hoverImg!; img.classList.add('is-on'); cancelAnimationFrame(raf); loop(); });
    el.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; });
    el.addEventListener('mouseleave', () => { img.classList.remove('is-on'); cancelAnimationFrame(raf); });
  });
}

/* ---------- subtle ---------- */
function reveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal],[data-stagger]');
  els.forEach((el) => {
    const d = el.dataset.revealDelay;
    if (d) el.style.setProperty('--reveal-delay', `${d}ms`);
    if (el.hasAttribute('data-stagger')) {
      const step = Number(el.dataset.stagger || 90);
      Array.from(el.children).forEach((c, i) => (c as HTMLElement).style.setProperty('--reveal-delay', `${i * step}ms`));
    }
  });
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );
  els.forEach((el) => io.observe(el));
}

function counters() {
  const els = document.querySelectorAll<HTMLElement>('[data-counter]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target as HTMLElement;
      io.unobserve(el);
      const end = Number(el.dataset.counter);
      const suffix = el.dataset.suffix ?? '';
      const dur = 1400;
      let t0: number | undefined;
      const tick = (t: number) => {
        t0 ??= t;
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(eased * end) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  });
  els.forEach((el) => io.observe(el));
}

function marquee() {
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((el) => {
    const track = el.querySelector<HTMLElement>('.marquee-track');
    if (!track) return;
    track.append(...Array.from(track.children).map((c) => c.cloneNode(true)));
    const speed = el.dataset.marquee;
    if (speed) el.style.setProperty('--marquee-speed', speed);
  });
}

/** Nav : classe .is-scrolled apres 40px, .is-hidden quand on descend (variantes qui le veulent). */
function navScroll() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;
  let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    if (nav.dataset.nav === 'hide-on-scroll') nav.classList.toggle('is-hidden', y > last && y > 200);
    last = y;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- rich ---------- */
function splitText() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = '1';
    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = (node.textContent ?? '').split(/(\s+)/);
        const frag = document.createDocumentFragment();
        words.forEach((w) => {
          if (!w) return;
          if (/^\s+$/.test(w)) return frag.append(document.createTextNode(' '));
          const outer = document.createElement('span');
          outer.className = 'split-word';
          const inner = document.createElement('span');
          inner.textContent = w;
          outer.append(inner);
          frag.append(outer);
        });
        node.parentNode?.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(walk);
      }
    };
    walk(el);
    el.querySelectorAll<HTMLElement>('.split-word > span').forEach((s, i) => s.style.setProperty('--i-delay', `${i * 45}ms`));
    if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'none');
  });
}

async function rich() {
  const needs = document.querySelector('[data-parallax],[data-magnetic],[data-tilt],[data-pin],[data-scrub],[data-horizontal],[data-text-fill]');
  if (!needs) return;
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax || 0.2);
    gsap.fromTo(
      el,
      { yPercent: -amount * 40 },
      { yPercent: amount * 40, ease: 'none', scrollTrigger: { trigger: el.parentElement ?? el, scrub: true, start: 'top bottom', end: 'bottom top' } },
    );
  });

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic || 0.3);
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength, duration: 0.4, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' }));
  });

  // data-scrub="scale=1.15,rotate=4,x=-20,y=10,opacity=0.3" : de cet etat vers l'etat normal, pilote par le scroll
  document.querySelectorAll<HTMLElement>('[data-scrub]').forEach((el) => {
    const from: Record<string, number> = {};
    (el.dataset.scrub || '').split(',').forEach((pair) => { const [k, v] = pair.split('='); if (k && v) from[k.trim()] = Number(v); });
    if (from.x !== undefined) { from.xPercent = from.x; delete from.x; }
    if (from.y !== undefined) { from.yPercent = from.y; delete from.y; }
    gsap.from(el, { ...from, ease: 'none', scrollTrigger: { trigger: el, scrub: 0.6, start: 'top 95%', end: 'bottom 20%' } });
  });

  // data-text-fill : le texte se remplit au fil du scroll, mot par mot
  document.querySelectorAll<HTMLElement>('[data-text-fill]').forEach((el) => {
    if (!el.dataset.splitDone) {
      const words = (el.textContent || '').split(/\s+/).filter(Boolean);
      el.innerHTML = words.map((w) => `<span class="fill-word">${w}</span>`).join(' ');
      el.dataset.splitDone = '1';
    }
    gsap.to(el.querySelectorAll('.fill-word'), { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: el, scrub: 0.8, start: 'top 80%', end: 'bottom 45%' } });
  });

  // data-pin="120" : epingle pendant N % de hauteur d'ecran ; ses [data-pin-step] s'activent tour a tour
  document.querySelectorAll<HTMLElement>('[data-pin]').forEach((el) => {
    const steps = el.querySelectorAll<HTMLElement>('[data-pin-step]');
    const len = Number(el.dataset.pin || 100);
    ScrollTrigger.create({
      trigger: el, start: 'top top', end: `+=${len}%`, pin: true, scrub: true,
      onUpdate: (st) => { const i = Math.min(steps.length - 1, Math.floor(st.progress * steps.length)); steps.forEach((s, k) => s.classList.toggle('is-active', k === i)); },
    });
    steps[0]?.classList.add('is-active');
  });

  // data-horizontal : la piste .h-track defile horizontalement pendant que la page defile verticalement (desktop)
  document.querySelectorAll<HTMLElement>('[data-horizontal]').forEach((el) => {
    const track = el.querySelector<HTMLElement>('.h-track');
    if (!track || !window.matchMedia('(min-width: 64rem)').matches) return;
    const dist = () => track.scrollWidth - el.clientWidth;
    gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.5, invalidateOnRefresh: true } });
  });

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    const max = Number(el.dataset.tilt || 8);
    el.style.transformStyle = 'preserve-3d';
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, { rotateY: px * max, rotateX: -py * max, transformPerspective: 900, duration: 0.5, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' }));
  });
}

async function directionScript(direction?: string) {
  if (!direction) return;
  const scripts = import.meta.glob<{ default: (root: HTMLElement) => void }>('/src/directions/*/script.ts');
  const key = `/src/directions/${direction}/script.ts`;
  const loader = scripts[key];
  if (!loader) return;
  const mod = await loader();
  mod.default(document.documentElement);
}
