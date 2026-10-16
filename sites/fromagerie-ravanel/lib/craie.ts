/**
 * La craie de la piste A « L'ardoise » (Fromagerie Ravanel). Pas le moteur : un geste propre à ce site.
 *
 * Deux régimes (direction.md, MOUVEMENT) :
 * - SEC : une ligne d'ardoise s'écrit de gauche à droite en 180 ms, linéaire, comme un trait de craie
 *   rapide ; les lignes d'un même bloc partent à 70 ms d'écart. Ça sert à LIRE : rien n'attend.
 * - LENT : ce que la main dessine (le nom en haut, le cercle autour d'un fromage, la meule) se trace en
 *   0,6 à 1,4 s, courbe de main qui accélère puis ralentit. Ça sert à MONTRER le geste de Claire.
 *
 * Sans JavaScript, ou avec « réduire les animations » : tout est écrit d'avance (la classe `craie` n'est
 * jamais posée, voir le script en ligne de Nav.astro).
 */

export const PAS_LIGNE = 70;

export function animer(): boolean {
  return document.documentElement.classList.contains('craie');
}

/** Écrit tout de suite les lignes `[data-ecrit]` de `racine`, l'une après l'autre. */
export function ecrireLignes(racine: ParentNode, depart = 0): number {
  const lignes = Array.from(racine.querySelectorAll<HTMLElement>('[data-ecrit]')).filter((l) => !l.closest('[hidden]'));
  lignes.forEach((l, i) => {
    l.style.transitionDelay = `${depart + i * PAS_LIGNE}ms`;
    l.classList.add('ecrit');
  });
  return depart + lignes.length * PAS_LIGNE;
}

/** Efface une ligne (coup de chiffon, 120 ms) puis la réécrit avec le nouveau texte. */
export function reecrire(el: HTMLElement, texte: string) {
  if (!animer()) { el.textContent = texte; return; }
  el.style.transitionDelay = '0ms';
  el.classList.add('efface');
  window.setTimeout(() => {
    el.textContent = texte;
    el.classList.remove('efface', 'ecrit');
    void el.offsetWidth;
    el.classList.add('ecrit');
  }, 130);
}

/** Les blocs `[data-craie]` s'écrivent quand ils entrent à l'écran. */
export function observerBlocs() {
  const blocs = document.querySelectorAll<HTMLElement>('[data-craie]');
  if (!animer()) return;
  // Dessins à la craie des blocs : cachés jusqu'à l'entrée du bloc, puis tracés à la main (régime lent).
  blocs.forEach((b) => b.querySelectorAll<SVGGeometryElement>('[data-trace]').forEach((p) => {
    const L = Number(p.getAttribute('pathLength')) || p.getTotalLength();
    p.style.strokeDasharray = `${L} ${L}`;
    p.style.strokeDashoffset = `${L}`;
  }));
  const io = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const traits = e.target.querySelectorAll<SVGGeometryElement>('[data-trace]');
        traits.forEach((p, i) => tracer(p, 820, i * 90));
        ecrireLignes(e.target, traits.length ? 260 : 0);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
  );
  blocs.forEach((b) => io.observe(b));
}

/** Tracé de craie : un trait SVG (path) qui se dessine. `duree` en ms. */
export function tracer(path: SVGGeometryElement, duree: number, delai = 0) {
  const L = Number(path.getAttribute('pathLength')) || path.getTotalLength();
  path.style.strokeDasharray = `${L} ${L}`;
  if (!animer()) { path.style.strokeDashoffset = '0'; return; }
  path.style.transition = 'none';
  path.style.strokeDashoffset = `${L}`;
  void path.getBoundingClientRect();
  path.style.transition = `stroke-dashoffset ${duree}ms var(--ease-main) ${delai}ms`;
  path.style.strokeDashoffset = '0';
}

/** Un cercle de craie fait à la main autour d'une boîte w × h : une boucle qui ne se referme pas tout à fait. */
export function cercleMain(w: number, h: number, graine: number): string {
  const r = (n: number) => {
    const x = Math.sin(graine * 12.9898 + n * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const cx = w / 2, cy = h / 2, rx = w / 2 - 4, ry = h / 2 - 4;
  const pts: string[] = [];
  const tours = 1.12;
  const n = 28;
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * tours * Math.PI * 2 - 2.3;
    const k = 1 + (r(i) - 0.5) * 0.06 + (i / n) * 0.05;
    pts.push(`${(cx + Math.cos(t) * rx * k).toFixed(1)},${(cy + Math.sin(t) * ry * k).toFixed(1)}`);
  }
  // Courbe lissée (Catmull-Rom vers Bézier) : un trait de main, pas un polygone.
  const p = pts.map((s) => s.split(',').map(Number));
  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}
