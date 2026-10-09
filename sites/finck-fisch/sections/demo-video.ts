/**
 * Vidéos des sites d'exemple (Hero.astro, Realisations.astro) : à la place d'une capture figée, un court
 * enregistrement muet (6 s, en boucle) de l'accueil de chaque démo qui défile tout seul. Le site
 * d'exemple se voit bouger, pas seulement sa première page.
 *
 * Règles, dans l'ordre :
 * - `prefers-reduced-motion: reduce` : rien ne bouge, l'image d'aperçu (poster) reste, rien n'est
 *   téléchargé.
 * - Téléphone (pointeur grossier sans survol, ou écran < 768 px) : poster seul, aucun octet de vidéo
 *   tant qu'on n'a pas touché la vignette ; un second toucher met en pause.
 * - Ailleurs : la vidéo ne se charge (`src` posé, `preload="none"` avant) et ne joue que lorsqu'elle
 *   est visible à moitié au moins ; sortie de l'écran, elle est mise en pause.
 * - Transitions de page (`site.transitions`) : observateur coupé avant l'échange, vignettes
 *   ré-initialisées par `onPage()` (garde `data-demo-ready`).
 */
export function initDemoVideos(): void {
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video[data-demo]')).filter(
    (v) => !v.dataset.demoReady,
  );
  if (!videos.length) return;
  for (const v of videos) v.dataset.demoReady = '1';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const telephone = matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth < 768;

  // play() retire le poster aussitôt : si les données ne sont pas là, Chrome montre du noir le temps
  // du chargement. On ne demande la lecture qu'une fois la première image décodable (canplay).
  const lire = (v: HTMLVideoElement) => {
    if (!v.src && v.dataset.src) v.src = v.dataset.src;
    if (v.readyState >= 3) { v.play().catch(() => {}); return; }
    if (v.dataset.demoAttente) return;
    v.dataset.demoAttente = '1';
    v.addEventListener('canplay', () => { delete v.dataset.demoAttente; if (v.dataset.demoVisible) v.play().catch(() => {}); }, { once: true });
    v.load();
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const v = e.target as HTMLVideoElement;
        const visible = e.isIntersecting && e.intersectionRatio >= 0.5;
        if (visible) v.dataset.demoVisible = '1'; else delete v.dataset.demoVisible;
        if (visible && (!telephone || v.dataset.demoLu)) lire(v);
        else if (!v.paused) v.pause();
      }
    },
    { threshold: [0, 0.5, 1] },
  );

  for (const v of videos) {
    io.observe(v);
    if (telephone) {
      v.addEventListener('click', () => {
        if (v.paused) {
          v.dataset.demoLu = '1';
          lire(v);
        } else {
          v.pause();
        }
      });
    }
  }
  document.addEventListener('astro:before-swap', () => io.disconnect(), { once: true });
}
