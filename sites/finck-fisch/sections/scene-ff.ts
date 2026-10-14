/**
 * Moteur des scènes au défilement (11 oct 2026, essais validés par le fondateur : « le début avec
 * les téléphones, c'est TOP, ça ajoute du volume »). Aucune bibliothèque, un seul rAF par image.
 *
 * - `[data-scene]` reçoit `--p` (0 → 1). Scène collante (premier enfant en position: sticky) : de son
 *   haut au ras du haut de l'écran jusqu'à sa fin ; la course est mesurée sur l'enfant collant (100svh),
 *   pas sur innerHeight, qui bouge quand la barre de Safari se replie. Scène non collante : rien, sauf
 *   avec `data-scene-libre` (de son entrée en bas à sa sortie en haut).
 *   `data-scene-dx` : pose aussi `--dx` (px), la longueur à faire glisser d'une piste horizontale
 *   (`[data-piste]` à l'intérieur) pour qu'elle défile en entier pendant la scène.
 * - `data-etapes="-0.3,0.35,0.7"` (12 oct 2026) : la scène reçoit aussi `data-etape` = nombre de seuils
 *   franchis par l'avancée (non bornée : un seuil négatif tombe avant que la scène ne colle). Le CSS
 *   joue alors des transitions EN TEMPS sur transform/opacity, gérées par le compositeur : bien plus
 *   fluide sur iPhone qu'un mouvement recalculé à chaque image de défilement (Safari défile hors du
 *   fil principal, une animation calée sur --p y suit le doigt avec du retard et saccade). Retour
 *   fondateur sur Avant/après et Trois jours : « ça bugue un peu », « pas fluide ».
 * - `[data-couv]` (carrousel horizontal) : chaque enfant reçoit `--d` (-1 → 1, distance au centre de
 *   l'écran, en largeurs de carte) et `--ad` (sa valeur absolue, plafonnée à 1). Marche pour une piste
 *   qu'on fait glisser au doigt (scrollLeft) comme pour une piste poussée par `--dx` (translation).
 *
 * Fluidité (12 oct 2026, « encore des lags quand on scrolle ») : chaque image LIT d'abord (positions
 * des scènes, scrollLeft des carrousels), puis ÉCRIT les variables. Avant, lecture et écriture
 * alternaient par scène : un recalcul complet de la page forcé plusieurs fois par image. Les mesures
 * fixes (hauteurs, stickiness, largeur des pistes, place des cartes dans leur piste) sont prises une
 * fois, puis au redimensionnement ; la position des cartes se calcule à partir d'elles (pas de
 * getBoundingClientRect par carte et par image) ; une variable n'est réécrite que si elle a changé ;
 * les scènes loin de l'écran sont ignorées.
 *
 * « Réduire les animations » : rien n'est posé, le CSS retombe sur ses valeurs par défaut (état final,
 * lisible). Idempotent par page : plusieurs sections peuvent l'appeler, une seule boucle tourne.
 */
const REDUIT = '(prefers-reduced-motion: reduce)';

type Scene = { el: HTMLElement; course: number; haut: number; piste: HTMLElement | null; dx: number; p: number; pTxt: string; seuils: number[]; etape: number; suivi: boolean };
type Carte = { el: HTMLElement; centre: number; largeur: number; d: string };
type Couv = { el: HTMLElement; scene: Scene | null; base: number; cartes: Carte[] };

export function initScenes(): void {
  const racine = document.documentElement;
  if (racine.dataset.scenes === '1' || matchMedia(REDUIT).matches) return;
  racine.dataset.scenes = '1';

  const scenes: Scene[] = [...document.querySelectorAll<HTMLElement>('[data-scene]')].map((el) => ({
    el,
    course: 0,
    haut: 0,
    piste: el.hasAttribute('data-scene-dx') ? el.querySelector<HTMLElement>('[data-piste]') : null,
    dx: -1,
    p: 0,
    pTxt: '',
    seuils: (el.dataset.etapes ?? '').split(',').filter(Boolean).map(Number),
    etape: -1,
    suivi: el.hasAttribute('data-scene-suivi'),
  }));
  const couvs: Couv[] = [...document.querySelectorAll<HTMLElement>('[data-couv]')].map((el) => ({
    el,
    scene: scenes.find((s) => s.piste === el) ?? null,
    base: 0,
    cartes: [...el.children].map((k) => ({ el: k as HTMLElement, centre: 0, largeur: 1, d: '' })),
  }));
  if (!scenes.length && !couvs.length) return;
  racine.classList.add('ff-scenes');

  let vh = 0;
  let vw = 0;
  let raf = 0;
  let aMesurer = true;

  // Mesures fixes : une fois, puis au redimensionnement (et quand des tuiles chargées changent une taille).
  const mesurer = () => {
    aMesurer = false;
    vh = window.innerHeight;
    vw = racine.clientWidth;
    for (const s of scenes) {
      const colle = s.el.firstElementChild as HTMLElement | null;
      const v = colle && getComputedStyle(colle).position === 'sticky' ? colle.offsetHeight : 0;
      s.haut = s.el.offsetHeight;
      s.course = v && s.haut > v * 1.2 ? s.haut - v : 0;
      if (s.piste) s.dx = Math.max(0, s.piste.offsetWidth - vw);
    }
    for (const c of couvs) {
      // Place des cartes dans la piste, indépendante de la translation et du défilement en cours.
      const rp = c.el.getBoundingClientRect();
      const tx = c.scene ? -c.scene.p * Math.max(0, c.scene.dx) : 0;
      c.base = rp.left - tx;
      for (const k of c.cartes) {
        const r = k.el.getBoundingClientRect();
        k.largeur = r.width || 1;
        k.centre = r.left - rp.left + c.el.scrollLeft + r.width / 2;
      }
    }
    for (const s of scenes) if (s.piste) s.el.style.setProperty('--dx', `${s.dx}px`);
  };

  const maj = () => {
    raf = 0;
    if (aMesurer) mesurer();
    // 1. Lectures (une seule mise en page, avant toute écriture).
    const hauts = scenes.map((s) => s.el.getBoundingClientRect().top);
    const defile = couvs.map((c) => c.el.scrollLeft);
    // 2. Écritures.
    scenes.forEach((s, i) => {
      const top = hauts[i];
      // Scène non collante (ex. Réalisations sur téléphone, simple carrousel) : rien à écrire. --p est
      // héritée par tout le contenu de la scène ; la reposer à chaque image recalculait les styles de
      // toutes ses cartes pour rien (mesuré le 12 oct 2026).
      if (!s.course && !s.el.hasAttribute('data-scene-libre')) return;
      if (!s.seuils.length && (top > vh * 2 || top + s.haut < -vh)) return;
      const brut = s.course ? -top / s.course : (vh - top) / (vh + s.haut);
      if (s.seuils.length) {
        const n = s.seuils.filter((x) => brut >= x).length;
        if (n !== s.etape) { s.etape = n; s.el.dataset.etape = String(n); }
        // `data-scene-suivi` (14 oct 2026, Avant/après) : la scène à étapes reçoit AUSSI --p, pour un
        // mouvement simple qui suit le doigt (le rideau) en plus des étapes jouées en temps.
        if (!s.suivi) return;
      }
      s.p = Math.min(1, Math.max(0, brut));
      const txt = s.p.toFixed(4);
      if (txt !== s.pTxt) { s.pTxt = txt; s.el.style.setProperty('--p', txt); }
    });
    couvs.forEach((c, i) => {
      const tx = c.scene ? -c.scene.p * c.scene.dx : 0;
      for (const k of c.cartes) {
        const x = c.base + tx + k.centre - defile[i];
        if (x < -vw || x > vw * 2) continue;
        const d = Math.max(-1.5, Math.min(1.5, (x - vw / 2) / k.largeur));
        const txt = d.toFixed(3);
        if (txt === k.d) continue;
        k.d = txt;
        k.el.style.setProperty('--d', txt);
        k.el.style.setProperty('--ad', Math.min(1, Math.abs(d)).toFixed(3));
      }
    });
  };
  const relancer = () => { if (!raf) raf = requestAnimationFrame(maj); };
  const remesurer = () => { aMesurer = true; relancer(); };

  addEventListener('scroll', relancer, { passive: true });
  addEventListener('resize', remesurer);
  for (const c of couvs) c.el.addEventListener('scroll', relancer, { passive: true });
  const ro = 'ResizeObserver' in window ? new ResizeObserver(remesurer) : null;
  scenes.forEach((s) => { ro?.observe(s.el); if (s.piste) ro?.observe(s.piste); });
  maj();

  document.addEventListener('astro:before-swap', () => {
    removeEventListener('scroll', relancer);
    removeEventListener('resize', remesurer);
    ro?.disconnect();
    delete racine.dataset.scenes;
    racine.classList.remove('ff-scenes');
  }, { once: true });
}
