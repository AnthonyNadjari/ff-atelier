/**
 * Vidéos des sites d'exemple (Hero.astro, Realisations.astro) : un court enregistrement muet (6 s, en
 * boucle) de l'accueil de chaque démo qui défile tout seul.
 *
 * Règles, dans l'ordre (retour du fondateur, 9 oct 2026 : « sur téléphone, les vidéos ne doivent pas
 * attendre un toucher ») :
 * - `prefers-reduced-motion: reduce` : rien ne bouge, l'image fixe reste, rien n'est téléchargé.
 * - Partout (téléphone compris) : lecture muette en ligne dès que la vidéo est visible à 50 % ; hors
 *   de l'écran, pause. `preload="none"` dans le HTML : le `src` n'est posé qu'à l'approche (moins
 *   d'un écran de distance), le téléchargement ne commence qu'à ce moment-là.
 * - Téléphone (pointeur grossier sans survol, ou écran < 768 px) : UNE seule vidéo joue à la fois, la
 *   plus visible ; les autres sont en pause (batterie, forfait).
 * - Lecture refusée (iPhone en économie d'énergie : play() rejeté) : l'image fixe reste, jamais
 *   d'image noire. La vidéo est transparente jusqu'à sa première image jouée (« playing ») ; un
 *   toucher retente la lecture.
 * - Transitions de page (`site.transitions`) : observateurs coupés avant l'échange, vignettes
 *   ré-initialisées par `onPage()` (garde `data-demo-ready`).
 */
// Performance (10 oct 2026) : rien ne démarre pendant le premier affichage. Les vidéos ne sont
// préparées qu'après « load » + un moment de calme du fil principal, et chargées à un quart d'écran
// de distance. Les images dessous sont dans DemoVideo.astro (<picture>, 4:5 sur téléphone).
export function initDemoVideos(): void {
  const demarrer = () => initDemoVideosMaintenant();
  const calme = (f: () => void) => ('requestIdleCallback' in window ? (window as any).requestIdleCallback(f, { timeout: 2500 }) : window.setTimeout(f, 1200));
  if (document.readyState === 'complete') calme(demarrer);
  else window.addEventListener('load', () => calme(demarrer), { once: true });
}

function initDemoVideosMaintenant(): void {
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video[data-demo]')).filter(
    (v) => !v.dataset.demoReady,
  );
  if (!videos.length) return;
  for (const v of videos) v.dataset.demoReady = '1';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const telephone = matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth < 768;
  // La source suit la mise en page (même seuil que le CSS de DemoVideo.astro) : 4:5 mobile sous 768 px.
  const mobile = window.innerWidth < 768;
  const ratios = new Map<HTMLVideoElement, number>();
  const cadre = (v: HTMLVideoElement) => v.closest<HTMLElement>('.ff-demo');

  const charger = (v: HTMLVideoElement) => {
    if (v.getAttribute('src')) return;
    const src = (mobile && v.dataset.srcMobile) || v.dataset.src;
    if (src) v.src = src;
  };

  // Recette unique (bug iPhone du 10 oct 2026) : play() tout de suite, sans load() ni attente de
  // canplay (iOS ne télécharge rien avant play()). La vidéo ne devient visible qu'à sa première image
  // réellement jouée (« playing ») : avant, ou si la lecture est refusée, l'image dessous reste.
  const lire = (v: HTMLVideoElement) => {
    if (v.dataset.demoRefus) return;
    charger(v);
    v.muted = true;
    v.playsInline = true;
    const p = v.play();
    if (p) p.catch((err: DOMException) => {
      // AbortError = pause() demandée avant le début de la lecture : pas un refus.
      if (err?.name === 'NotAllowedError') v.dataset.demoRefus = '1';
    });
  };

  // Desktop : toute vidéo visible à 50 % joue. Téléphone : seulement la plus visible.
  const doitJouer = (v: HTMLVideoElement) => {
    const r = ratios.get(v) ?? 0;
    if (r < 0.5) return false;
    if (!telephone) return true;
    let meilleure: HTMLVideoElement | null = null;
    let max = 0;
    for (const [autre, ra] of ratios) if (ra >= 0.5 && ra > max) { max = ra; meilleure = autre; }
    return meilleure === v;
  };

  const arbitrer = () => {
    for (const v of videos) {
      if (doitJouer(v)) { if (v.paused) lire(v); }
      else if (!v.paused) v.pause();
    }
  };

  // Approche : le src est posé à un quart d'écran de distance (aucun octet avant). Dans le carrousel
  // mobile des réalisations, l'observateur tient compte du défilement horizontal (rognage du parent).
  const approche = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) { charger(e.target as HTMLVideoElement); approche.unobserve(e.target); }
    },
    { rootMargin: '25% 25%' },
  );
  const vue = new IntersectionObserver(
    (entries) => {
      for (const e of entries) ratios.set(e.target as HTMLVideoElement, e.isIntersecting ? e.intersectionRatio : 0);
      arbitrer();
    },
    { threshold: [0, 0.25, 0.5, 0.75, 1] },
  );

  for (const v of videos) {
    approche.observe(v);
    vue.observe(v);
    v.addEventListener('playing', () => cadre(v)?.classList.add('joue'));
    // Lecture refusée : un toucher la retente (geste de l'utilisateur, accepté par iOS).
    cadre(v)?.addEventListener('click', () => {
      if (!v.dataset.demoRefus) return;
      delete v.dataset.demoRefus;
      lire(v);
    });
  }
  document.addEventListener('astro:before-swap', () => { approche.disconnect(); vue.disconnect(); }, { once: true });
}
