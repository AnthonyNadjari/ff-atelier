/**
 * Runtime d'animation, pilote par attributs data-* (voir global.css).
 * - motion="none"   : rien ne s'execute.
 * - motion="subtle" : reveal au scroll, compteurs, marquee. Zero dependance.
 * - motion="rich"   : + GSAP (charge a la demande) pour parallax, split text, magnetic, tilt,
 *                     + script.ts de la direction s'il existe.
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

  if (motion === 'rich') {
    splitText();
    rich().catch(() => {});
    directionScript(root.dataset.direction);
  }
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
  const needs = document.querySelector('[data-parallax],[data-magnetic],[data-tilt],[data-pin]');
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
