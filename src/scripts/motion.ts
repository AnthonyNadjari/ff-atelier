/**
 * Runtime d'animation, pilote par attributs data-* (voir global.css).
 * - motion="none"   : rien ne s'execute.
 * - motion="subtle" : reveal au scroll, compteurs, marquee. Zero dependance.
 * - motion="rich"   : + GSAP (charge a la demande) pour parallax, split text, magnetic, tilt,
 *                     scrub (data-scrub), pin (data-pin), defilement horizontal (data-horizontal),
 *                     remplissage de texte (data-text-fill), image au survol (data-hover-img),
 *                     rideau d'entree (.ff-curtain), + script.ts de la direction s'il existe.
 *
 * Attributs geres (legacy, avant la veille animations.md) : data-reveal, data-stagger, data-counter,
 * data-marquee, data-draw, data-parallax, data-magnetic, data-tilt, data-scrub, data-pin,
 * data-pin-step, data-horizontal, data-text-fill, data-split, data-hover-img, data-nav.
 *
 * --- Nouveaux effets (docs/veille/animations.md §3, 13 effets + 2 bonus) ---
 * data-sticky-stack     subtle (CSS pur, z-index croissant) + rich (assombrit la carte precedente au scroll)
 * data-stack            rich   cartes qui s'empilent en scrollant (scale/y decroissants)
 * data-split="chars"    rich   variante caractere par caractere de data-split (mots = defaut)
 * data-scramble         subtle (vanilla) / rich (GSAP ScrambleTextPlugin) : texte qui se decode
 * data-spotlight        subtle halo lumineux qui suit le curseur (pointer:fine, @property --x/--y)
 * data-tilt-glare       rich   reflet lumineux sur data-tilt qui suit le curseur
 * data-flip-card        subtle carte 3D qui se retourne (survol desktop, clic/tap mobile), aria-pressed
 * data-compare          subtle slider avant/apres (input range + clip-path, clavier)
 * data-parallax-depth   rich   parallax multi-couches sur les enfants [data-depth]
 * data-trail            rich   trainee de N images au survol (pointer:fine)
 * data-marquee-velocity subtle vitesse du marquee modulee par la velocite de scroll
 * data-blur-scrub       rich   flou qui se dissipe au scroll (data-scrub avec blur=N, ou seul)
 * data-counter-flip     subtle variante "digit flip" de data-counter
 * data-count-bar        subtle barre qui se remplit au scroll, a cote de data-counter
 * data-scroll-progress  subtle barre de progression de lecture (CSS scroll-timeline + repli JS)
 *
 * --- Nouveaux effets (docs/veille/animations.md §3, lignes 1,2,3,12,16,18,19,21,24,25) + 2 bonus CSS ---
 * data-smooth (sur <html>)   rich   scroll fluide Lenis, pose par Base.astro depuis site.smoothScroll ;
 *                                   synchronise avec ScrollTrigger, respecte reduced-motion et les ancres
 * data-hover-distort="/x.webp" rich distorsion WebGL (OGL) de l'image au survol, pointer:fine ; repli =
 *                                   comportement data-hover-img si WebGL indisponible
 * data-draw-svg[="scrub"]    rich   trace les <path>/<line>/... d'un <svg> inline (GSAP DrawSVGPlugin),
 *                                   au scroll (defaut, une fois) ou en scrub continu (valeur "scrub")
 * data-accordion[="single"]  rich   GSAP Flip sur un groupe de <details> : hauteur et repositionnement
 *                                   des elements voisins animes en douceur a l'ouverture/fermeture
 * data-drag-grid             rich   grille .drag-track glissable (GSAP Draggable + InertiaPlugin),
 *                                   defilement horizontal infini par enroulement, tactile
 * data-lottie="/anim/x.lottie" rich lecteur dotLottie (canvas), charge a la demande ; repli
 *                                   data-lottie-fallback="/img/x.webp" ou texte si le fichier est absent
 * data-confetti               toute confettis (canvas-confetti) au succes d'un formulaire, ecoute
 *                                   l'evenement `ff:form-success` (ContactForm.astro), charge a la demande
 * data-duotone                CSS   filtre SVG (#ff-duotone, defini une fois dans Base.astro) + degrade
 *                                   mix-blend-mode:color pour unifier des photos client heterogenes
 * data-grain                  CSS   grain de bruit (feTurbulence) en overlay, generalisation du motif
 *                                   deja utilise par la direction atelier
 * data-border-beam            CSS   bordure conique tournante (@property --border-beam-angle)
 * data-reveal-native           CSS  variante de data-reveal via animation-timeline:view() (@supports),
 *                                   repli automatique sur le meme IntersectionObserver que data-reveal
 *
 * --- Sequence d'images "page produit" (effet Apple, docs/ANIMATIONS.md) ---
 * data-frames="/anim/x/"      rich   sequence d'images (WebP) dessinee sur un <canvas data-frames-canvas>
 *                                   au fil du scroll (frameSequences(), voir aussi `ff sequence` et
 *                                   `ff animer`, scripts/ff/sequence.mjs et animer.mjs). Sous-attributs :
 *                                   data-frames-count (nombre de frames), data-frames-ext ("webp" par
 *                                   defaut), data-frames-pad (chiffres du nom de fichier, 4 par defaut,
 *                                   ex. 0001.webp), data-frames-mobile="/anim/x-mobile/" (dossier plus
 *                                   leger, <= 767px), data-frames-poster="/anim/x/0001.webp" (affiche
 *                                   instantanement, avant tout prechargement). A poser avec data-pin sur
 *                                   le meme element pour l'effet d'epinglage ; [data-pin-step] a
 *                                   l'interieur s'active avec la meme progression. Hors motion="rich" ou
 *                                   prefers-reduced-motion : seul le poster (repli <img> cree en JS,
 *                                   aucune frame prechargee) reste visible.
 */
export function initMotion() {
  const root = document.documentElement;
  const motion = root.dataset.motion ?? 'subtle';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // data-frames : le poster doit s'afficher quel que soit le palier de motion (voir frameSequences()),
  // donc appele avant le repli anticipe ci-dessous.
  frameSequences(motion, reduced);
  if (motion === 'none' || reduced) {
    document.querySelectorAll<HTMLElement>('[data-reveal],[data-stagger],[data-reveal-native]').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // splitText d'abord : il pose data-reveal sur les titres, que reveal() doit ensuite observer.
  if (motion === 'rich') splitText();
  reveal();
  revealNative();
  counters();
  counterFlip();
  countBars();
  marquee();
  navScroll();
  drawLines();
  stickyStack();
  spotlight();
  flipCards();
  compareSliders();
  scrollProgress();
  confettiOnSuccess();
  if (motion === 'subtle') scrambleSubtle();

  if (motion === 'rich') {
    curtain();
    hoverImages();
    trailImages();
    rich().catch(() => {});
    smoothScroll().catch(() => {});
    hoverDistort().catch(() => {});
    drawSvg().catch(() => {});
    accordionFlip().catch(() => {});
    dragGrid().catch(() => {});
    lottiePlayers().catch(() => {});
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

/** data-trail="/images/x.webp" : pool de N images qui suivent le curseur avec decalage temporel (rich, pointer fin). */
function trailImages() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const items = document.querySelectorAll<HTMLElement>('[data-trail]');
  if (!items.length) return;
  const N = 5;
  const pool = Array.from({ length: N }, () => {
    const img = document.createElement('img');
    img.className = 'ff-trail-img';
    img.alt = '';
    document.body.append(img);
    return img;
  });
  const timers = new Map<HTMLImageElement, ReturnType<typeof setTimeout>>();
  let i = 0;
  let active = false;
  items.forEach((el) => {
    el.addEventListener('mouseenter', () => (active = true));
    el.addEventListener('mouseleave', () => (active = false));
    el.addEventListener('mousemove', (e) => {
      if (!active) return;
      const img = pool[i++ % N];
      img.src = el.dataset.trail || '';
      img.style.transform = `translate(${e.clientX + 20}px, ${e.clientY - 100}px) rotate(${((i % N) - N / 2) * 3}deg)`;
      img.classList.add('is-on');
      clearTimeout(timers.get(img));
      timers.set(img, setTimeout(() => img.classList.remove('is-on'), 450));
    });
  });
}

/**
 * data-frames="/anim/x/" (+ [data-frames-canvas] a l'interieur) : sequence d'images dessinee au fil du
 * scroll, effet "page produit" (Apple/luxe). Sous-attributs : data-frames-count (obligatoire),
 * data-frames-ext ("webp" par defaut), data-frames-pad (4 par defaut, 0001.webp...),
 * data-frames-mobile="/anim/x-mobile/" (dossier plus leger, <= 767px), data-frames-poster (repli
 * instantane). Poster dessine sans attendre ; le prechargement des frames suivantes ne demarre jamais
 * avant l'evenement `load` de la fenetre, et seulement quand la section entre a moins d'une hauteur
 * d'ecran (IntersectionObserver), par priorite premiere/derniere/milieu puis le reste dans l'ordre. Hors
 * motion="rich" ou prefers-reduced-motion : aucune frame n'est prechargee, seul le poster (repli <img>
 * cree en JS, classe .ff-frames-fallback) reste visible, [data-frames-canvas] est masque. Le scrub
 * (progression -> frame) reutilise la longueur de data-pin si le meme element le porte (cas d'usage
 * recommande : section epinglee).
 */
function frameSequences(motion: string, reduced: boolean) {
  const sections = document.querySelectorAll<HTMLElement>('[data-frames]');
  if (!sections.length) return;
  const richMotion = motion === 'rich';
  sections.forEach((el) => {
    const canvas = el.querySelector<HTMLCanvasElement>('[data-frames-canvas]');
    const pad = Number(el.getAttribute('data-frames-pad')) || 4;
    const ext = el.getAttribute('data-frames-ext') || 'webp';
    const base = el.getAttribute('data-frames') || '';
    const poster = el.getAttribute('data-frames-poster') || `${base}${'1'.padStart(pad, '0')}.${ext}`;
    if (!richMotion || reduced || !canvas) {
      if (canvas) canvas.hidden = true;
      if (!el.dataset.framesFallbackDone) {
        el.dataset.framesFallbackDone = '1';
        const img = document.createElement('img');
        img.className = 'ff-frames-fallback';
        img.alt = '';
        img.src = poster;
        el.prepend(img);
      }
      return;
    }
    setupFrameSequence(el, canvas, poster, { base, pad, ext }).catch(() => {});
  });
}

/** Ordre de prechargement d'une sequence data-frames (index 1..count) : premiere, derniere, milieu, puis le reste dans l'ordre. */
function framesLoadOrder(count: number): number[] {
  const order: number[] = [];
  const seen = new Set<number>();
  const push = (i: number) => {
    if (i >= 1 && i <= count && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  push(1);
  push(count);
  push(Math.round((1 + count) / 2));
  for (let i = 1; i <= count; i++) push(i);
  return order;
}

/** Dessine `img` en cover-fit dans un canvas de cw x ch pixels reels (deja multiplies par le DPR). */
function drawFramesCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cw: number, ch: number) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;
  const ir = iw / ih;
  const cr = cw / ch;
  let sx = 0,
    sy = 0,
    sw = iw,
    sh = ih;
  if (ir > cr) {
    sw = ih * cr;
    sx = (iw - sw) / 2;
  } else {
    sh = iw / cr;
    sy = (ih - sh) / 2;
  }
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
}

/** Redimensionne le canvas au format d'affichage reel, DPR plafonne a 2 ; renvoie la taille en pixels. */
function sizeFramesCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect.width * dpr));
  const h = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  return { w, h };
}

/** Met en place le canvas d'une section data-frames : poster immediat, prechargement paresseux (jamais avant `load`), scrub GSAP ScrollTrigger. */
async function setupFrameSequence(el: HTMLElement, canvas: HTMLCanvasElement, poster: string, opts: { base: string; pad: number; ext: string }) {
  const count = Math.max(1, Number(el.getAttribute('data-frames-count')) || 1);
  const mobileBase = el.getAttribute('data-frames-mobile');
  const isMobile = Boolean(mobileBase) && window.matchMedia('(max-width: 47.9375rem)').matches;
  const base = isMobile && mobileBase ? mobileBase : opts.base;
  const framePath = (i: number) => `${base}${String(i).padStart(opts.pad, '0')}.${opts.ext}`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let { w: cw, h: ch } = sizeFramesCanvas(canvas);

  const images: HTMLImageElement[] = [];
  let currentIndex = 0;

  const drawIndex = (i: number) => {
    const img = images[i];
    if (img && img.complete && img.naturalWidth) {
      drawFramesCover(ctx, img, cw, ch);
      currentIndex = i;
    }
  };

  // Poster immediat, sans attendre le prechargement des frames.
  const posterImg = new Image();
  posterImg.decoding = 'async';
  posterImg.onload = () => {
    if (!currentIndex) drawFramesCover(ctx, posterImg, cw, ch);
  };
  posterImg.src = poster;

  // Prechargement paresseux : jamais avant `load`, demarre quand la section entre a < 1 hauteur d'ecran.
  const beginPreload = () => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.disconnect();
          framesLoadOrder(count).forEach((i) => {
            const img = new Image();
            img.decoding = 'async';
            img.onload = () => {
              if (i === 1 && !currentIndex) drawIndex(1);
            };
            img.src = framePath(i);
            images[i] = img;
          });
        }
      },
      { rootMargin: '100% 0px 100% 0px', threshold: 0 },
    );
    io.observe(el);
  };
  if (document.readyState === 'complete') beginPreload();
  else window.addEventListener('load', beginPreload, { once: true });

  window.addEventListener(
    'resize',
    () => {
      const s = sizeFramesCanvas(canvas);
      cw = s.w;
      ch = s.h;
      if (currentIndex) drawIndex(currentIndex);
    },
    { passive: true },
  );

  // Scrub au scroll (touche = defilement natif, ScrollTrigger le gere deja) : progress -> frame, rAF-throttle.
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);
  const len = Number(el.dataset.pin || 100);
  let pendingProgress = 0;
  let raf = 0;
  const render = () => {
    raf = 0;
    const frame0 = Math.round(pendingProgress * (count - 1));
    drawIndex(Math.min(count, Math.max(1, frame0 + 1)));
  };
  ScrollTrigger.create({
    trigger: el,
    start: 'top top',
    end: `+=${len}%`,
    scrub: true,
    onUpdate: (st) => {
      pendingProgress = st.progress;
      if (!raf) raf = requestAnimationFrame(render);
    },
  });
}

/* ---------- subtle ---------- */
function reveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal],[data-stagger]');
  els.forEach((el) => {
    const d = el.dataset.revealDelay;
    if (d) el.style.setProperty('--reveal-delay', `${d}ms`);
    if (el.hasAttribute('data-stagger')) {
      // Delai total plafonne a 600 ms (docs/CONVENTIONS.md regle 16) : sur une longue liste (20 vignettes),
      // le pas se resserre au lieu de faire attendre le dernier element pendant deux secondes.
      const n = el.children.length;
      const step = Math.min(Number(el.dataset.stagger || 90), n > 1 ? 600 / (n - 1) : 600);
      Array.from(el.children).forEach((c, i) => (c as HTMLElement).style.setProperty('--reveal-delay', `${Math.round(i * step)}ms`));
    }
  });
  const onEnter = (io: IntersectionObserver) => (entries: IntersectionObserverEntry[]) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    }
  };
  const io = new IntersectionObserver((en) => onEnter(io)(en), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  // Variantes decoupees (clip/wipe/mask) : la zone rognee ne compte pas comme visible, le ratio ne
  // depasse jamais ~0,5 % : on les observe a seuil 0 (un pixel visible suffit) avec une marge basse.
  const ioClip = new IntersectionObserver((en) => onEnter(ioClip)(en), { threshold: 0, rootMargin: '0px 0px -12% 0px' });
  els.forEach((el) => {
    const v = el.dataset.reveal;
    (v === 'clip' || v === 'wipe' || v === 'mask' ? ioClip : io).observe(el);
  });
}

/** data-reveal-native : repli IO identique a reveal(), seulement si animation-timeline:view() n'est pas supporte (sinon global.css @supports suffit). */
function revealNative() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal-native]');
  if (!els.length) return;
  if (typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline', 'view()')) return; // CSS pur suffit (voir global.css)
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

/** data-confetti : confettis (canvas-confetti, charge a la demande) au succes d'un formulaire (evenement ff:form-success, voir ContactForm.astro). */
function confettiOnSuccess() {
  if (!document.querySelector('[data-confetti]')) return;
  document.addEventListener('ff:form-success', async () => {
    const { default: confetti } = await import('canvas-confetti');
    confetti({ particleCount: 120, spread: 70, startVelocity: 38, origin: { y: 0.7 } });
  });
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

/** data-counter-flip="128" : variante "digit flip" du compteur, chaque chiffre est un <span> anime en translateY. */
function counterFlip() {
  const els = document.querySelectorAll<HTMLElement>('[data-counter-flip]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target as HTMLElement;
      io.unobserve(el);
      const end = String(el.dataset.counterFlip ?? '');
      const suffix = el.dataset.suffix ?? '';
      el.innerHTML = '';
      Array.from(end).forEach((ch, i) => {
        const wrap = document.createElement('span');
        wrap.className = 'flip-digit';
        const inner = document.createElement('span');
        inner.className = 'flip-digit-inner';
        inner.textContent = ch;
        wrap.append(inner);
        wrap.style.setProperty('--i-delay', `${i * 80}ms`);
        el.append(wrap);
      });
      if (suffix) el.append(document.createTextNode(suffix));
      requestAnimationFrame(() => el.classList.add('is-flipped'));
    }
  });
  els.forEach((el) => io.observe(el));
}

/** data-count-bar="82" : barre .bar-fill qui se remplit (largeur en %) quand l'element entre a l'ecran. */
function countBars() {
  const els = document.querySelectorAll<HTMLElement>('[data-count-bar]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target as HTMLElement;
      io.unobserve(el);
      const pct = Math.max(0, Math.min(100, Number(el.dataset.countBar) || 0));
      requestAnimationFrame(() => el.style.setProperty('--bar', `${pct}%`));
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

  // data-marquee-velocity="30" : le meme element porte data-marquee ; la vitesse (duree de base en s)
  // est modulee par la velocite de scroll (plus on defile vite, plus la bande accelere).
  const velocityEls = document.querySelectorAll<HTMLElement>('[data-marquee-velocity]');
  if (!velocityEls.length) return;
  let lastY = window.scrollY;
  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const y = window.scrollY;
      const dy = Math.min(Math.abs(y - lastY), 120);
      lastY = y;
      velocityEls.forEach((el) => {
        const base = Number(el.dataset.marqueeVelocity) || 30;
        const factor = Math.max(0.3, 1 - dy / 60);
        el.style.setProperty('--marquee-speed', `${(base * factor).toFixed(1)}s`);
      });
      raf = 0;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/** data-scramble (ms optionnel) : le texte final se "decode" depuis des caracteres aleatoires (subtle, vanilla, ~15 lignes). */
function scrambleSubtle() {
  const els = document.querySelectorAll<HTMLElement>('[data-scramble]');
  if (!els.length) return;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target as HTMLElement;
      io.unobserve(el);
      const final = el.textContent ?? '';
      const dur = Number(el.dataset.scramble) || 900;
      const totalFrames = Math.round(dur / 40);
      let frame = 0;
      const id = setInterval(() => {
        frame++;
        el.textContent = final
          .split('')
          .map((c, i) => (c === ' ' ? ' ' : frame / totalFrames > i / final.length ? c : chars[(Math.random() * chars.length) | 0]))
          .join('');
        if (frame >= totalFrames) {
          el.textContent = final;
          clearInterval(id);
        }
      }, 40);
    }
  }, { threshold: 0.6 });
  els.forEach((el) => io.observe(el));
}

/** data-sticky-stack : enfants en position: sticky, z-index croissant (CSS + JS minime, zero dependance). */
function stickyStack() {
  document.querySelectorAll<HTMLElement>('[data-sticky-stack]').forEach((el) => {
    Array.from(el.children).forEach((c, i) => {
      (c as HTMLElement).style.zIndex = String(i + 1);
    });
  });
}

/** data-spotlight : halo radial qui suit le curseur (--x/--y, @property dans global.css), pointer fin seulement. */
function spotlight() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const els = document.querySelectorAll<HTMLElement>('[data-spotlight]');
  if (!els.length) return;
  let raf = 0;
  let cx = 0, cy = 0;
  let target: HTMLElement | null = null;
  const apply = () => {
    if (target) {
      target.style.setProperty('--x', `${cx}px`);
      target.style.setProperty('--y', `${cy}px`);
    }
    raf = 0;
  };
  els.forEach((el) => {
    el.addEventListener(
      'pointermove',
      (e) => {
        const r = el.getBoundingClientRect();
        cx = e.clientX - r.left;
        cy = e.clientY - r.top;
        target = el;
        el.classList.add('is-spot-on');
        if (!raf) raf = requestAnimationFrame(apply);
      },
      { passive: true },
    );
    el.addEventListener('pointerleave', () => el.classList.remove('is-spot-on'));
  });
}

/** data-flip-card : carte 3D (CSS, .flip-inner/.flip-front/.flip-back) ; hover desktop, clic/tap + clavier pour mobile. */
function flipCards() {
  document.querySelectorAll<HTMLElement>('[data-flip-card]').forEach((el) => {
    if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    el.setAttribute('aria-pressed', 'false');
    const toggle = () => el.setAttribute('aria-pressed', String(el.classList.toggle('is-flipped')));
    el.addEventListener('click', toggle);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}

/** data-compare : slider avant/apres, <input type="range"> natif (accessible clavier) + clip-path sur .compare-after. */
function compareSliders() {
  document.querySelectorAll<HTMLElement>('[data-compare]').forEach((el) => {
    const input = el.querySelector<HTMLInputElement>('input[type="range"]');
    if (!input) return;
    const update = () => el.style.setProperty('--compare-pos', `${input.value}%`);
    input.addEventListener('input', update);
    update();
  });
}

/** data-scroll-progress : barre fixee en haut, remplie par CSS scroll-timeline si supporte, sinon repli JS throttle en rAF. */
function scrollProgress() {
  const el = document.querySelector<HTMLElement>('[data-scroll-progress]');
  if (!el) return;
  if (typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline', 'scroll(root)')) return; // CSS pur suffit (voir global.css)
  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      el.style.transform = `scaleX(${p})`;
      raf = 0;
    });
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
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
    // data-split (defaut, "words") : decoupe mot par mot. data-split="chars" : caractere par caractere.
    const chars = el.dataset.split === 'chars';
    const cls = chars ? 'split-char' : 'split-word';
    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const units = chars ? (node.textContent ?? '').split('') : (node.textContent ?? '').split(/(\s+)/);
        const frag = document.createDocumentFragment();
        units.forEach((w) => {
          if (!w) return;
          if (!chars && /^\s+$/.test(w)) return frag.append(document.createTextNode(' '));
          const outer = document.createElement('span');
          outer.className = cls;
          const inner = document.createElement('span');
          inner.textContent = w === ' ' ? ' ' : w;
          outer.append(inner);
          frag.append(outer);
        });
        node.parentNode?.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(walk);
      }
    };
    walk(el);
    el.querySelectorAll<HTMLElement>(`.${cls} > span`).forEach((s, i) => s.style.setProperty('--i-delay', `${i * (chars ? 18 : 45)}ms`));
    if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'none');
  });
}

async function rich() {
  const needs = document.querySelector(
    '[data-parallax],[data-magnetic],[data-tilt],[data-pin],[data-scrub],[data-horizontal],[data-text-fill],' +
      '[data-sticky-stack],[data-stack],[data-parallax-depth],[data-scramble],[data-blur-scrub]',
  );
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

  // data-scrub="scale=1.15,rotate=4,x=-20,y=10,opacity=0.3,blur=12" : de cet etat vers l'etat normal, pilote par le scroll.
  // data-blur-scrub="12" (seul, ou en plus de data-scrub) : raccourci pour un flou qui se dissipe au scroll.
  document.querySelectorAll<HTMLElement>('[data-scrub],[data-blur-scrub]').forEach((el) => {
    const from: Record<string, number> = {};
    (el.dataset.scrub || '').split(',').forEach((pair) => { const [k, v] = pair.split('='); if (k && v) from[k.trim()] = Number(v); });
    if (el.hasAttribute('data-blur-scrub') && from.blur === undefined) from.blur = Number(el.dataset.blurScrub) || 12;
    if (from.x !== undefined) { from.xPercent = from.x; delete from.x; }
    if (from.y !== undefined) { from.yPercent = from.y; delete from.y; }
    const tweenVars: Record<string, unknown> = { ...from, ease: 'none', scrollTrigger: { trigger: el, scrub: 0.6, start: 'top 95%', end: 'bottom 20%' } };
    if (from.blur !== undefined) {
      tweenVars.filter = `blur(${from.blur}px)`;
      delete tweenVars.blur;
    }
    gsap.from(el, tweenVars);
  });

  // data-sticky-stack (rich) : assombrit chaque carte quand la suivante arrive par-dessus (le sticky/z-index est en CSS).
  document.querySelectorAll<HTMLElement>('[data-sticky-stack]').forEach((el) => {
    const cards = Array.from(el.children) as HTMLElement[];
    cards.forEach((c, i) => {
      const next = cards[i + 1];
      if (!next) return;
      gsap.to(c, { filter: 'brightness(0.55)', ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true } });
    });
  });

  // data-stack : cartes qui s'epinglent puis se tassent (scale/y) quand la suivante arrive.
  document.querySelectorAll<HTMLElement>('[data-stack]').forEach((el) => {
    const cards = Array.from(el.children) as HTMLElement[];
    cards.forEach((c, i) => {
      ScrollTrigger.create({ trigger: c, start: 'top top', end: 'bottom top', pin: true, pinSpacing: false });
      const next = cards[i + 1];
      if (!next) return;
      gsap.to(c, { scale: 0.94, yPercent: -3, filter: 'brightness(0.85)', ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true } });
    });
  });

  // data-parallax-depth : conteneur dont les enfants [data-depth="0.2"] bougent a des vitesses differentes.
  document.querySelectorAll<HTMLElement>('[data-parallax-depth]').forEach((el) => {
    el.querySelectorAll<HTMLElement>('[data-depth]').forEach((child) => {
      const amount = Number(child.dataset.depth || 0.2);
      gsap.fromTo(
        child,
        { yPercent: -amount * 40 },
        { yPercent: amount * 40, ease: 'none', scrollTrigger: { trigger: el, scrub: true, start: 'top bottom', end: 'bottom top' } },
      );
    });
  });

  // data-scramble (rich) : ScrambleTextPlugin si l'attribut est present quelque part sur la page.
  if (document.querySelector('[data-scramble]')) {
    const { ScrambleTextPlugin } = await import('gsap/ScrambleTextPlugin');
    gsap.registerPlugin(ScrambleTextPlugin);
    document.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el) => {
      const text = el.textContent ?? '';
      const dur = (Number(el.dataset.scramble) || 900) / 1000;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => gsap.to(el, { duration: dur, scrambleText: { text, chars: 'upperAndLowerCase', speed: 0.4 } }),
      });
    });
  }

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
    // data-tilt-glare (extension) : un reflet dont le background-position suit le curseur, sur le meme handler.
    let glare: HTMLElement | null = null;
    if (el.hasAttribute('data-tilt-glare')) {
      glare = document.createElement('span');
      glare.className = 'tilt-glare';
      el.append(glare);
    }
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, { rotateY: px * max, rotateX: -py * max, transformPerspective: 900, duration: 0.5, ease: 'power2.out' });
      if (glare) glare.style.backgroundPosition = `${(px + 0.5) * 100}% ${(py + 0.5) * 100}%`;
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' }));
  });
}

/** data-smooth (sur <html>, pose par Base.astro depuis site.smoothScroll) : Lenis, synchronise avec ScrollTrigger. */
async function smoothScroll() {
  if (!document.documentElement.hasAttribute('data-smooth')) return;
  const { default: Lenis } = await import('lenis');
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({ autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  // Ancres internes (#id) : defilement fluide via lenis.scrollTo plutot que le saut natif.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -16 });
    });
  });
}

/** data-hover-distort="/images/x.webp" : distorsion WebGL (OGL) de l'image au survol, pointer:fine. Repli = comportement data-hover-img. */
async function hoverDistort() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const items = document.querySelectorAll<HTMLElement>('[data-hover-distort]');
  if (!items.length) return;
  const vertex = `
    attribute vec2 uv; attribute vec2 position;
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
  `;
  const fragment = `
    precision highp float;
    uniform sampler2D tMap; uniform float uTime; uniform vec2 uMouse; uniform float uStrength;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv;
      float dist = distance(uv, uMouse);
      float ripple = sin(dist * 42.0 - uTime * 5.0) * uStrength * smoothstep(0.4, 0.0, dist);
      uv += ripple;
      gl_FragColor = texture2D(tMap, uv);
    }
  `;
  for (const el of Array.from(items)) {
    try {
      const { Renderer, Camera, Transform, Mesh, Program, Triangle, Texture } = await import('ogl');
      const wrap = document.createElement('div');
      wrap.className = 'ff-distort';
      document.body.append(wrap);
      const renderer = new Renderer({ alpha: true, dpr: Math.min(devicePixelRatio, 2) });
      const gl = renderer.gl;
      wrap.append(gl.canvas);
      const camera = new Camera(gl);
      camera.position.z = 1;
      const scene = new Transform();
      const texture = new Texture(gl);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = el.dataset.hoverDistort!;
      img.onload = () => { texture.image = img; };
      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: { tMap: { value: texture }, uTime: { value: 0 }, uMouse: { value: [0.5, 0.5] }, uStrength: { value: 0 } },
      });
      const mesh = new Mesh(gl, { geometry, program });
      mesh.setParent(scene);
      let raf = 0;
      let running = false;
      const resize = () => {
        const w = 320, h = 240;
        renderer.setSize(w, h);
      };
      resize();
      const loop = (t: number) => {
        program.uniforms.uTime.value = t * 0.001;
        renderer.render({ scene, camera });
        if (running) raf = requestAnimationFrame(loop);
      };
      el.addEventListener('mouseenter', () => {
        wrap.classList.add('is-on');
        program.uniforms.uStrength.value = 0.03;
        if (!running) { running = true; raf = requestAnimationFrame(loop); }
      });
      el.addEventListener('mousemove', (e) => {
        wrap.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 140}px)`;
        program.uniforms.uMouse.value = [(e.clientX % 320) / 320, 1 - (e.clientY % 240) / 240];
      });
      el.addEventListener('mouseleave', () => {
        wrap.classList.remove('is-on');
        program.uniforms.uStrength.value = 0;
        running = false;
        cancelAnimationFrame(raf);
      });
    } catch {
      // Repli : comportement data-hover-img (image flottante simple, sans WebGL).
      const img = document.createElement('img');
      img.className = 'ff-hover-img';
      img.alt = '';
      document.body.append(img);
      let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
      const loop = () => {
        tx += (x - tx) * 0.15;
        ty += (y - ty) * 0.15;
        img.style.transform = `translate(${tx + 24}px, ${ty - 120}px)`;
        raf = requestAnimationFrame(loop);
      };
      el.addEventListener('mouseenter', () => { img.src = el.dataset.hoverDistort!; img.classList.add('is-on'); cancelAnimationFrame(raf); loop(); });
      el.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; });
      el.addEventListener('mouseleave', () => { img.classList.remove('is-on'); cancelAnimationFrame(raf); });
    }
  }
}

/** data-draw-svg[="scrub"] : trace les tracés d'un <svg> inline (GSAP DrawSVGPlugin), au scroll (once) ou en scrub. */
async function drawSvg() {
  const svgs = document.querySelectorAll<SVGSVGElement>('[data-draw-svg]');
  if (!svgs.length) return;
  const { gsap } = await import('gsap');
  const { DrawSVGPlugin } = await import('gsap/DrawSVGPlugin');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);
  svgs.forEach((svg) => {
    const paths = svg.querySelectorAll('path, line, polyline, circle, rect, ellipse');
    if (!paths.length) return;
    const scrub = svg.dataset.drawSvg === 'scrub';
    gsap.set(paths, { drawSVG: 0 });
    gsap.to(paths, {
      drawSVG: '100%',
      stagger: scrub ? 0 : 0.08,
      ease: scrub ? 'none' : 'power1.inOut',
      scrollTrigger: scrub
        ? { trigger: svg, start: 'top 90%', end: 'bottom 40%', scrub: 0.6 }
        : { trigger: svg, start: 'top 80%', once: true },
    });
  });
}

/** data-accordion[="single"] : GSAP Flip sur un groupe de <details> — hauteur et repositionnement des voisins animes. */
async function accordionFlip() {
  const groups = document.querySelectorAll<HTMLElement>('[data-accordion]');
  if (!groups.length) return;
  const { gsap } = await import('gsap');
  const { Flip } = await import('gsap/Flip');
  gsap.registerPlugin(Flip);
  groups.forEach((group) => {
    const items = Array.from(group.querySelectorAll('details'));
    if (!items.length) return;
    items.forEach((details) => {
      const summary = details.querySelector('summary');
      summary?.addEventListener('click', (e) => {
        e.preventDefault();
        const state = Flip.getState(items, { props: 'height' });
        if (group.dataset.accordion === 'single' && !details.open) {
          items.forEach((d) => { if (d !== details) d.open = false; });
        }
        details.open = !details.open;
        Flip.from(state, { duration: 0.5, ease: 'power3.inOut', absolute: true, props: 'height' });
      });
    });
  });
}

/** data-drag-grid (+ .drag-track) : grille glissable a enroulement infini (GSAP Draggable + InertiaPlugin), tactile. */
async function dragGrid() {
  const grids = document.querySelectorAll<HTMLElement>('[data-drag-grid]');
  if (!grids.length) return;
  const { gsap } = await import('gsap');
  const { Draggable } = await import('gsap/Draggable');
  const { InertiaPlugin } = await import('gsap/InertiaPlugin');
  gsap.registerPlugin(Draggable, InertiaPlugin);
  grids.forEach((grid) => {
    const track = grid.querySelector<HTMLElement>('.drag-track');
    if (!track || track.dataset.dragReady) return;
    track.dataset.dragReady = '1';
    // Duplique la piste horizontalement pour l'illusion d'enroulement infini (meme principe que marquee()).
    track.append(...Array.from(track.children).map((c) => c.cloneNode(true)));
    let half = track.scrollWidth / 2;
    const remeasure = () => (half = track.scrollWidth / 2);
    window.addEventListener('resize', remeasure, { passive: true });
    const wrapX = () => {
      const x = gsap.getProperty(track, 'x') as number;
      gsap.set(track, { x: gsap.utils.wrap(-half, 0, x) });
    };
    Draggable.create(track, { type: 'x', inertia: true, onDrag: wrapX, onThrowUpdate: wrapX });
  });
}

/** data-lottie="/anim/x.lottie" : lecteur dotLottie (canvas), charge a la demande. Repli data-lottie-fallback (image) ou texte si le fichier est absent. */
async function lottiePlayers() {
  const els = document.querySelectorAll<HTMLElement>('[data-lottie]');
  if (!els.length) return;
  const { DotLottie } = await import('@lottiefiles/dotlottie-web');
  els.forEach((el) => {
    const src = el.dataset.lottie!;
    const canvas = document.createElement('canvas');
    canvas.className = 'ff-lottie-canvas';
    canvas.width = el.clientWidth || 200;
    canvas.height = el.clientHeight || 200;
    el.append(canvas);
    const fallback = () => {
      canvas.remove();
      const fb = el.dataset.lottieFallback;
      if (fb) {
        const img = document.createElement('img');
        img.src = fb;
        img.alt = '';
        el.append(img);
      } else {
        const p = document.createElement('p');
        p.className = 'ff-lottie-fallback-text text-sm text-muted';
        p.textContent = 'Animation indisponible.';
        el.append(p);
      }
    };
    try {
      const player = new DotLottie({ canvas, src, loop: true, autoplay: true });
      player.addEventListener('loadError', fallback);
    } catch {
      fallback();
    }
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
