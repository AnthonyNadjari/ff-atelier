// Rangées du style `rangees` (src/components/RangeeDePhotos.astro, Proof/rangees ; profil de mouvement
// « rangee-tiree-a-la-main », docs/veille/styles/MOUVEMENTS.md). Armé par les composants avec onPage(armerRangees) (idempotent : une rangée déjà armée est sautée) : chaque [data-rangee] a une
// piste [data-rangee-piste] et, s'il y en a un, un fil [data-rangee-fil].
// Les rangées : tirées à la souris (au doigt, le navigateur s'en charge), le fil qui suit la position, les photos qui
// apparaissent une fois chargées. Aucune boucle, aucun minuteur : tout répond à la main.
function armerTirage() {
  const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll<HTMLElement>('[data-rangee]').forEach((rangee) => {
    const piste = rangee.querySelector<HTMLElement>('[data-rangee-piste]');
    const fil = rangee.querySelector<HTMLElement>('[data-rangee-fil]');
    if (!piste || rangee.dataset.rangeePrete) return;
    rangee.dataset.rangeePrete = '1';
    const boite = fil?.parentElement ?? null;

    // Le fil : part visible (largeur du trait) et position (décalage), calculés au défilement, une fois par image.
    let attendu = false;
    const maj = () => {
      attendu = false;
      if (!fil || !boite) return;
      const total = piste.scrollWidth;
      const vue = piste.clientWidth;
      const deborde = total > vue + 4;
      boite.hidden = !deborde;
      if (!deborde) return;
      const part = vue / total;
      const max = total - vue;
      const pos = max > 0 ? (piste.scrollLeft / max) * (1 / part - 1) : 0;
      fil.style.setProperty('--rg-part', part.toFixed(4));
      fil.style.setProperty('--rg-pos', pos.toFixed(4));
    };
    const demander = () => { if (!attendu) { attendu = true; requestAnimationFrame(maj); } };
    piste.addEventListener('scroll', demander, { passive: true });
    addEventListener('resize', demander);
    maj();

    // Tirer à la souris : on attrape la rangée, on la tire ; au-delà de 4 px, c'est un tirage et le clic est annulé.
    let depart = 0;
    let gauche = 0;
    let tire = false;
    let enCours = false;
    piste.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      enCours = true;
      tire = false;
      depart = e.clientX;
      gauche = piste.scrollLeft;
    });
    addEventListener('pointermove', (e) => {
      if (!enCours) return;
      const dx = e.clientX - depart;
      if (!tire && Math.abs(dx) > 4) { tire = true; piste.classList.add('rg-tire'); }
      if (tire) { piste.scrollLeft = gauche - dx; e.preventDefault(); }
    });
    addEventListener('pointerup', () => {
      if (!enCours) return;
      enCours = false;
      requestAnimationFrame(() => piste.classList.remove('rg-tire'));
    });
    piste.addEventListener('click', (e) => { if (tire) { e.preventDefault(); e.stopPropagation(); tire = false; } }, true);

    // Les photos : invisibles jusqu'à leur chargement (0,4 s), seulement avec le script et hors mouvement réduit.
    if (calme) return;
    // Seules les photos chargées tout de suite (la première rangée) attendent : une photo paresseuse garde son aperçu flou
    // (LQIP de <Img>) jusqu'à son chargement, jamais un trou blanc dans une capture ou sur un réseau lent.
    const imgs = [...rangee.querySelectorAll<HTMLImageElement>('.rg-cadre img')].filter((i) => i.loading !== 'lazy');
    const pas = imgs.filter((i) => !i.complete);
    if (pas.length === 0) return;
    for (const i of imgs) if (i.complete) i.classList.add('rg-chargee');
    rangee.classList.add('rg-attente');
    for (const i of pas) {
      const fini = () => i.classList.add('rg-chargee');
      i.addEventListener('load', fini, { once: true });
      i.addEventListener('error', fini, { once: true });
    }
  });
}

// Chargement anticipé (reprise du 31 oct 2026 : des vignettes restaient sur leur aperçu flou) : une rangée qui approche de
// l'écran (à moins d'un écran et demi) charge toutes ses photos, celles qui sont encore hors champ à droite comprises ;
// puis, dès que la page est chargée, le reste de l'index se charge (aucune vignette ne reste sur son aperçu flou). Le
// premier écran n'attend jamais : seules les photos de la première rangée sont prioritaires.
function armerChargement() {
  const pistes = [...document.querySelectorAll<HTMLElement>('[data-rangee-piste]')];
  const charger = (piste: Element) => {
    for (const img of piste.querySelectorAll<HTMLImageElement>('img[loading="lazy"]')) {
      img.loading = 'eager';
      // Décodée d'avance (decode()) : une vignette hors champ n'est plus peinte sur son aperçu flou quand elle arrive.
      img.decode?.().catch(() => {});
    }
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entrees) => {
      for (const e of entrees) if (e.isIntersecting) { charger(e.target); io.unobserve(e.target); }
    }, { rootMargin: '150% 0px 150% 0px' });
    pistes.forEach((p) => io.observe(p));
  }
  const tout = () => pistes.forEach(charger);
  if (document.readyState === 'complete') tout();
  else addEventListener('load', tout, { once: true });
}

/** Tout ce que les rangées d'une page demandent : à appeler par onPage() (src/scripts/page.ts). */
export function armerRangees() {
  armerTirage();
  armerChargement();
}
