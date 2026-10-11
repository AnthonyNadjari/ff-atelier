/**
 * Moteur de mouvement du site du studio (plan-site-ff.html v2, § 4 « Règles communes »).
 *
 * - S1 (monogramme + titre du hero) n'est PAS ici : CSS pur dans Hero.astro, au premier rendu.
 * - Tout le reste passe par gsap.matchMedia, trois branches :
 *     (prefers-reduced-motion: reduce)          état final immédiat, aucun Lenis, aucun indice ;
 *     (hover: none) or (pointer: coarse)         version tactile : défilement natif, révélations simples ;
 *     sinon (desktop)                            Lenis à la molette + S2 complet.
 * - Lenis : molette seulement (smoothWheel, lerp 0,1), jamais au doigt (syncTouch: false), coupé en
 *   mouvement réduit. Comme le moteur de la factory, il n'est pas créé sous automate
 *   (navigator.webdriver) : les audits défilent par sauts.
 * - GSAP et Lenis sont chargés à la demande (import()), jamais dans le JS initial.
 * - Sans JavaScript : tout est déjà dans l'état final (les états de départ ne sont posés que par ce
 *   module, via html.ff-anime et les classes « pilote » des sections).
 *
 * Transitions de page (ClientRouter) : appelé par onPage() à chaque page ; le contexte matchMedia, les
 * observateurs et la classe crème de <html> (qui persiste d'une page à l'autre) sont nettoyés avant
 * l'échange de page.
 */

const REDUIT = '(prefers-reduced-motion: reduce)';
const DESKTOP = '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)';

export function initMotionFF(): void {
  const html = document.documentElement;
  const reduit = matchMedia(REDUIT).matches;
  const nettoyages: (() => void)[] = [];
  document.addEventListener('astro:before-swap', () => { nettoyages.forEach((f) => f()); html.classList.remove('ff-creme'); }, { once: true });

  // « Le reste, sobre » : titres de section au masque et images en clip-path, une fois, à 90 % du bas
  // de l'écran. IntersectionObserver + transitions CSS (aucune bibliothèque).
  if (!reduit && 'IntersectionObserver' in window) {
    const cibles = [...document.querySelectorAll<HTMLElement>('[data-ff-titre], [data-ff-image]')];
    if (cibles.length) {
      html.classList.add('ff-anime');
      const io = new IntersectionObserver((entrees) => {
        for (const e of entrees) if (e.isIntersecting) { e.target.classList.add('est-vu'); io.unobserve(e.target); }
      }, { rootMargin: '0px 0px -10% 0px' });
      cibles.forEach((c) => io.observe(c));
      nettoyages.push(() => io.disconnect());
    }
  }

  // GSAP ne sert plus qu'au défilement doux (Lenis) sur ordinateur : les scènes (Réalisations,
  // Avant/après, Trois jours) passent par scene-ff.ts depuis le 11 oct 2026.
  if (!matchMedia(DESKTOP).matches) return;
  // GSAP n'est utile qu'au défilement : chargé après l'événement load, au premier temps libre, pour ne
  // pas disputer le fil principal à la première peinture (mesuré : 0,6 s de script pendant le LCP mobile).
  apresChargement().then(charger).then(({ gsap, ScrollTrigger, Lenis }) => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    nettoyages.push(() => mm.revert());

    // S4 (bascule encre/crème sur la section Audit) retirée le 10 oct 2026 : retour fondateur, le
    // passage noir, blanc, noir au défilement gênait. La page reste sombre de bout en bout.

    mm.add(DESKTOP, () => {
      if (navigator.webdriver || !Lenis) return;
      const lenis = new Lenis({ autoRaf: false, smoothWheel: true, syncTouch: false, lerp: 0.1, anchors: { offset: -80 } });
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      return () => { gsap.ticker.remove(tick); gsap.ticker.lagSmoothing(500, 33); lenis.destroy(); };
    });
  }).catch(() => {});
}

function apresChargement(): Promise<void> {
  return new Promise((ok) => {
    const libre = () => ('requestIdleCallback' in window ? requestIdleCallback(() => ok(), { timeout: 1500 }) : setTimeout(ok, 200));
    if (document.readyState === 'complete') libre();
    else addEventListener('load', libre, { once: true });
  });
}

async function charger() {
  const [{ gsap }, { ScrollTrigger }, lenisMod] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    matchMedia(DESKTOP).matches ? import('lenis') : Promise.resolve(null),
  ]);
  return { gsap, ScrollTrigger, Lenis: lenisMod?.default ?? null };
}
