/**
 * Moteur des scènes au défilement (11 oct 2026, essais validés par le fondateur : « le début avec
 * les téléphones, c'est TOP, ça ajoute du volume »). Aucune bibliothèque, un seul rAF par image.
 *
 * - `[data-scene]` reçoit `--p` (0 → 1). Bloc plus haut que l'écran (scène collante) : de son haut au
 *   ras du haut de l'écran jusqu'à sa fin. Sinon : de son entrée en bas à sa sortie en haut.
 *   `data-scene-dx` : pose aussi `--dx` (px), la longueur à faire glisser d'une piste horizontale
 *   (`[data-piste]` à l'intérieur) pour qu'elle défile en entier pendant la scène.
 * - `[data-couv]` (carrousel horizontal) : chaque enfant reçoit `--d` (-1 → 1, distance au centre de
 *   l'écran, en largeurs de carte) et `--ad` (sa valeur absolue, plafonnée à 1). Marche pour une piste
 *   qu'on fait glisser au doigt comme pour une piste poussée par `--dx`.
 *
 * « Réduire les animations » : rien n'est posé, le CSS retombe sur ses valeurs par défaut (état final,
 * lisible). Idempotent par page : plusieurs sections peuvent l'appeler, une seule boucle tourne.
 */
const REDUIT = '(prefers-reduced-motion: reduce)';

export function initScenes(): void {
  const racine = document.documentElement;
  if (racine.dataset.scenes === '1' || matchMedia(REDUIT).matches) return;
  racine.dataset.scenes = '1';

  const scenes = [...document.querySelectorAll<HTMLElement>('[data-scene]')];
  const couvs = [...document.querySelectorAll<HTMLElement>('[data-couv]')];
  if (!scenes.length && !couvs.length) return;
  racine.classList.add('ff-scenes');
  let raf = 0;

  const maj = () => {
    raf = 0;
    const vh = window.innerHeight;
    const vw = racine.clientWidth;
    for (const s of scenes) {
      const r = s.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) continue;
      const p = r.height > vh * 1.2 ? -r.top / (r.height - vh) : (vh - r.top) / (vh + r.height);
      s.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(4));
      if (s.hasAttribute('data-scene-dx')) {
        const piste = s.querySelector<HTMLElement>('[data-piste]');
        if (piste) s.style.setProperty('--dx', `${Math.max(0, piste.offsetWidth - vw)}px`);
      }
    }
    for (const c of couvs) {
      const rc = c.getBoundingClientRect();
      if (rc.bottom < 0 || rc.top > vh) continue;
      const centre = vw / 2;
      for (const k of c.children as HTMLCollectionOf<HTMLElement>) {
        const r = k.getBoundingClientRect();
        const d = Math.max(-1.5, Math.min(1.5, (r.left + r.width / 2 - centre) / r.width));
        k.style.setProperty('--d', d.toFixed(3));
        k.style.setProperty('--ad', Math.min(1, Math.abs(d)).toFixed(3));
      }
    }
  };
  const relancer = () => { if (!raf) raf = requestAnimationFrame(maj); };
  addEventListener('scroll', relancer, { passive: true });
  addEventListener('resize', relancer);
  for (const c of couvs) c.addEventListener('scroll', relancer, { passive: true });
  // Les tuiles des démos changent la largeur des pistes en se chargeant.
  const ro = 'ResizeObserver' in window ? new ResizeObserver(relancer) : null;
  scenes.forEach((s) => ro?.observe(s));
  maj();

  document.addEventListener('astro:before-swap', () => {
    removeEventListener('scroll', relancer);
    removeEventListener('resize', relancer);
    ro?.disconnect();
    delete racine.dataset.scenes;
    racine.classList.remove('ff-scenes');
  }, { once: true });
}
