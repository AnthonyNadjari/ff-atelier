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
 *   d'image noire. Le poster (ou l'image posée sous la vidéo dans le hero) n'est masqué que par une
 *   vraie image jouée (événement « playing ») ; un toucher retente la lecture.
 * - Transitions de page (`site.transitions`) : observateurs coupés avant l'échange, vignettes
 *   ré-initialisées par `onPage()` (garde `data-demo-ready`).
 */
// Performance (10 oct 2026, Lighthouse mobile 92 -> objectif 95) : rien ne démarre pendant le premier
// affichage. Les posters du HTML sont en 700 px (légers, téléphone) ; sur grand écran, la version 1400
// remplace le poster une fois la page chargée. Les vidéos ne sont préparées qu'après « load » + un
// moment de calme du fil principal, et chargées à un quart d'écran de distance, pas un écran entier.
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
  // Grand écran : poster 1400 px (le HTML porte la version 700 px), mouvement réduit compris.
  if (!(matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth < 768)) for (const v of videos) if (v.dataset.posterHd) v.poster = v.dataset.posterHd;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const telephone = matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth < 768;
  const ratios = new Map<HTMLVideoElement, number>();

  const charger = (v: HTMLVideoElement) => {
    if (!v.src && v.dataset.src) v.src = v.dataset.src;
  };

  // play() avant que les données soient là peut montrer du noir : on attend canplay.
  const lire = (v: HTMLVideoElement) => {
    if (v.dataset.demoRefus) return;
    charger(v);
    const go = () => v.play().catch(() => { v.dataset.demoRefus = '1'; });
    if (v.readyState >= 3) { go(); return; }
    if (v.dataset.demoAttente) return;
    v.dataset.demoAttente = '1';
    v.addEventListener('canplay', () => { delete v.dataset.demoAttente; if (doitJouer(v)) go(); }, { once: true });
    v.load();
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
      if (doitJouer(v)) lire(v);
      else if (!v.paused) v.pause();
    }
  };

  // Approche : le src est posé à un quart d'écran de distance (aucun octet avant).
  const approche = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) { charger(e.target as HTMLVideoElement); approche.unobserve(e.target); }
    },
    { rootMargin: '25% 0px' },
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
    // Lecture refusée : un toucher la retente (geste de l'utilisateur, accepté par iOS).
    v.addEventListener('click', () => {
      if (!v.dataset.demoRefus) return;
      delete v.dataset.demoRefus;
      lire(v);
    });
  }
  document.addEventListener('astro:before-swap', () => { approche.disconnect(); vue.disconnect(); }, { once: true });
}
