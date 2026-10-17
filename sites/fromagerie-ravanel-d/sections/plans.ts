/**
 * Plans au défilement de la piste D (tour 1, 17 oct 2026, « trop 2D ») : chaque élément `[data-plan="v"]` glisse
 * de `v` fois l'écart entre le centre de son cadre (`[data-plan-cadre]` le plus proche, sinon son parent) et le
 * centre de l'écran. v > 0 : le plan est derrière (la photo descend moins vite que la page) ; v < 0 : le plan est
 * devant (la pancarte monte un peu plus vite que la carte). Translation verticale seule, posée en transform,
 * jamais de --p ni de recalcul de mise en page : rien à repeindre, rien qui saccade sur iPhone (CLAUDE.md § Pièges).
 * Chaque image LIT toutes les positions, puis ÉCRIT ; une valeur n'est réécrite que si elle change ; les cadres
 * loin de l'écran sont ignorés. Mouvement réduit : rien n'est posé, tout reste à sa place.
 */
type Plan = { el: HTMLElement; cadre: HTMLElement; v: number; y: string; lim: number };

export function initPlans(): void {
  const racine = document.documentElement;
  if (racine.dataset.rvPlans === '1' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  racine.dataset.rvPlans = '1';
  const plans: Plan[] = [...document.querySelectorAll<HTMLElement>('[data-plan]')].map((el) => ({
    el,
    cadre: el.parentElement?.closest<HTMLElement>('[data-plan-cadre]') ?? el.parentElement ?? el,
    v: Number(el.dataset.plan) || 0,
    y: '',
    lim: 0,
  }));
  // Course permise : ce que le plan dépasse de son cadre, en haut comme en bas (une photo plus haute que sa bande) ;
  // un plan plus petit que son parent (la pancarte) glisse d'au plus 40 px. Jamais de bord vide qui se découvre.
  const mesurer = () => plans.forEach((p) => {
    const parent = p.el.parentElement;
    const ecart = parent ? p.el.offsetHeight - parent.offsetHeight : 0;
    p.lim = ecart > 0 ? ecart / 2 - 1 : 40;
  });
  mesurer();
  if (!plans.length) return;
  let raf = 0;
  const tick = () => {
    raf = 0;
    const vh = window.innerHeight || 1;
    const rects = plans.map((p) => p.cadre.getBoundingClientRect());
    plans.forEach((p, i) => {
      const r = rects[i];
      if (r.bottom < -200 || r.top > vh + 200) return;
      const brut = -(r.top + r.height / 2 - vh / 2) * p.v;
      const y = Math.max(-p.lim, Math.min(p.lim, brut)).toFixed(1);
      if (y === p.y) return;
      p.y = y;
      p.el.style.transform = `translate3d(0, ${y}px, 0)`;
    });
  };
  const demander = () => { if (!raf) raf = requestAnimationFrame(tick); };
  window.addEventListener('scroll', demander, { passive: true });
  window.addEventListener('resize', () => { mesurer(); demander(); }, { passive: true });
  tick();
}
