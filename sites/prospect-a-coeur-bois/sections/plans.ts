/**
 * Plans au défilement (direction.md, MOUVEMENT 4) : chaque `[data-plan="v"]` glisse de `v` fois l'écart entre le
 * centre de son cadre (`[data-plan-cadre]` le plus proche) et le centre de l'écran, borné à ±`data-plan-max` px
 * (défaut 36). v > 0 : plan du fond (descend moins vite que la page) ; v < 0 : plan de devant. Translation
 * verticale seule, posée sur l'élément qui bouge (jamais une variable sur un parent : CLAUDE.md § Pièges). Lit
 * toutes les positions puis écrit ; n'écrit que ce qui change ; ignore ce qui est loin de l'écran. Mouvement
 * réduit : rien ne bouge.
 */
type Plan = { el: HTMLElement; cadre: HTMLElement; v: number; max: number; y: string };

export function initPlans(): void {
  const racine = document.documentElement;
  if (racine.dataset.acbPlans === '1' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  racine.dataset.acbPlans = '1';
  const plans: Plan[] = [...document.querySelectorAll<HTMLElement>('[data-plan]')].map((el) => ({
    el,
    cadre: el.closest<HTMLElement>('[data-plan-cadre]') ?? el.parentElement ?? el,
    v: Number(el.dataset.plan) || 0,
    max: Number(el.dataset.planMax) || 36,
    y: '',
  }));
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
      const y = Math.max(-p.max, Math.min(p.max, brut)).toFixed(1);
      if (y === p.y) return;
      p.y = y;
      p.el.style.transform = `translate3d(0, ${y}px, 0)`;
    });
  };
  const demander = () => { if (!raf) raf = requestAnimationFrame(tick); };
  window.addEventListener('scroll', demander, { passive: true });
  window.addEventListener('resize', demander, { passive: true });
  tick();
}
