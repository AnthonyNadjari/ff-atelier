/**
 * Bande horizontale de page entière (coquilles `panneaux` et `carnet`, architectures panneaux-tranche et
 * carnet-horizontal ; docs/veille/architectures/studio-rhe.md, gingko.md). Le défilement VERTICAL natif de la page
 * fait glisser une piste vers la gauche : jamais de défilement simulé (la molette, le clavier, la barre de défilement
 * et l'accessibilité restent ceux du navigateur).
 *
 * Structure attendue :
 *   [data-bande]              conteneur ; reçoit .is-bande quand le mode horizontal est actif, et sa hauteur
 *                             (course horizontale + hauteur de la vue) en style ;
 *     [data-bande-vue]        enfant collant (position: sticky; top: 0; 100svh ; overflow: clip) ;
 *       [data-bande-piste]    la piste (flex, panneaux côte à côte), translatée en X ;
 *   [data-bande-progres]      (optionnel, n'importe où) : reçoit « 42 % » (tranche de Studio RHE).
 *
 * Mode horizontal seulement à partir de 64 rem ET sans `prefers-reduced-motion` : sinon (téléphone, mouvement
 * réduit, pas de script) la coquille reste une page verticale ordinaire, c'est son CSS par défaut.
 * Une seule propriété animée, `transform: translate3d` (une simple translation : docs CLAUDE.md, pièges iPhone), mise
 * à jour au plus une fois par image (rAF). Mesures sur l'enfant collant (`vue.clientHeight`), pas `innerHeight`.
 * Le focus clavier sur un lien hors de l'écran fait défiler la page jusqu'à son panneau ; une ancre (#contact…)
 * qui vise un élément de la piste y mène de même.
 */

export function initBande(): void {
  document.querySelectorAll<HTMLElement>('[data-bande]').forEach((root) => {
    if (root.dataset.bandePrete) return;
    root.dataset.bandePrete = '1';
    const vue = root.querySelector<HTMLElement>('[data-bande-vue]');
    const piste = root.querySelector<HTMLElement>('[data-bande-piste]');
    if (!vue || !piste) return;
    const progres = document.querySelectorAll<HTMLElement>('[data-bande-progres]');
    const mq = window.matchMedia('(min-width: 64rem) and (prefers-reduced-motion: no-preference)');
    let course = 0;
    let haut = 0;
    let attente = 0;

    const poser = () => {
      attente = 0;
      if (!root.classList.contains('is-bande')) return;
      const y = window.scrollY - haut;
      const p = course > 0 ? Math.min(1, Math.max(0, y / course)) : 0;
      piste.style.transform = `translate3d(${(-p * course).toFixed(1)}px, 0, 0)`;
      const t = `${Math.round(p * 100)} %`;
      progres.forEach((el) => { if (el.textContent !== t) el.textContent = t; });
    };
    const demander = () => { if (!attente) attente = requestAnimationFrame(poser); };

    const mesurer = () => {
      if (!mq.matches) {
        root.classList.remove('is-bande');
        root.style.removeProperty('block-size');
        piste.style.removeProperty('transform');
        progres.forEach((el) => { el.textContent = ''; });
        return;
      }
      root.classList.add('is-bande');
      course = Math.max(0, piste.scrollWidth - vue.clientWidth);
      root.style.blockSize = `${course + vue.clientHeight}px`;
      haut = root.getBoundingClientRect().top + window.scrollY;
      poser();
    };

    /** Fait défiler la page pour amener `el` (dans la piste) à l'écran. */
    const allerA = (el: Element) => {
      if (!root.classList.contains('is-bande') || !piste.contains(el)) return false;
      const gauche = (el as HTMLElement).getBoundingClientRect().left - piste.getBoundingClientRect().left;
      const x = Math.min(course, Math.max(0, gauche - vue.clientWidth * 0.15));
      window.scrollTo({ top: haut + x, behavior: 'auto' });
      return true;
    };

    piste.addEventListener('focusin', (e) => {
      const el = e.target as HTMLElement;
      const r = el.getBoundingClientRect();
      if (r.left < 0 || r.right > vue.clientWidth) allerA(el);
    });
    const suivreAncre = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const cible = id ? document.getElementById(id) : null;
      if (cible) allerA(cible);
    };
    window.addEventListener('hashchange', suivreAncre);
    window.addEventListener('scroll', demander, { passive: true });
    window.addEventListener('resize', () => requestAnimationFrame(mesurer));
    mq.addEventListener('change', mesurer);
    // Les images chargées après coup changent la largeur de la piste : on remesure.
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => requestAnimationFrame(mesurer));
      Array.from(piste.children).forEach((c) => ro.observe(c));
    }
    mesurer();
    if (location.hash) requestAnimationFrame(suivreAncre);
  });
}
