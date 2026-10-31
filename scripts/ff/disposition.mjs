// DISPOSITION de l'accueil : la FORME de chaque bloc (pas son rôle), au téléphone ET à l'ordinateur, et l'INDICE DE
// LINÉARITÉ de la page. Utilisé par `ff ressemblance` (axe « disposition » + refus au-dessus du seuil de linéarité) et par
// `ff tri` (candidats en ligne).
//
// Pourquoi (31 oct 2026, fondateur, devant le style dune repris de steuermann.haus) : « tu vois encore sur la disposition
// très linéaire, est-ce que c'est pas un peu similaire dans ce sens-là ? ». `ff ressemblance` comparait le premier écran
// (grille des rôles) et le déroulé (ORDRE des rôles des blocs) mais pas la FORME des blocs : deux sites aux ordres
// différents, tous deux en blocs pleine largeur empilés sur une colonne, passaient pour différents. L'usine ne doit pas
// être reconnaissable à une manie de mise en page.
//
// BLOCS : ceux du déroulé (scripts/ff/deroule.mjs, releverDeroule : enfants de <main>, enveloppes ouvertes, pied hors de
// <main>), relevés après avoir défilé jusqu'en bas (apparitions jouées), au téléphone 390x844 et à l'ordinateur 1400x900.
// Dans chaque bloc, `mesurerFormeBloc` (installé dans la page, window.__ffForme) relève des BOÎTES, coupées par les
// ancêtres qui rognent (overflow autre que visible) : images (img, video, canvas, svg, iframe d'au moins 1 % de l'écran ;
// fonds url() non répétés d'au moins 3 %) et textes (union des rectangles des nœuds texte directs : l'étendue réelle des
// lignes, pas la boîte du <p>). Plus trois drapeaux lus dans le CSS calculé : piste (un descendant d'au moins la moitié
// de la largeur et 100 px de haut qui défile en x de plus de 40 px, ou une file d'au moins trois cases sur une rangée
// qui dépasse de 30 % un conteneur rogné : carrousel), course collante (position sticky avec top, au moins 10 % de
// l'écran : hauteur du parent moins la sienne ; .pin-spacer de GSAP : hauteur du spacer moins celle de l'enfant) ; et,
// pour la page (`mesurerPageForme`), une colonne fixe : élément fixed ou sticky d'au moins 80 % de la hauteur d'écran,
// de 15 à 60 % de la largeur, collé au bord gauche ou droit.
//
// VOCABULAIRE (fonctions pures `mesuresForme` puis `formeDe`, dans cet ordre de priorité) :
//   fixe-lateral  le bloc défile à côté de la colonne fixe de la page (recouvrement horizontal < 20 % de sa largeur) ;
//   piste         défilement horizontal dans le bloc (overflow-x, piste aimantée, carrousel) ;
//   collant       un élément collant y reste épinglé sur au moins 0,9 écran de course ;
//   plein-cadre   une image d'au moins 90 % de la largeur et 60 % de la hauteur d'écran porte du texte (au moins la
//                 moitié d'une boîte de texte dessus) ;
//   chevauche     des boîtes se recouvrent : deux images qui se croisent (au moins 5 % de la plus petite, sans que
//                 l'une contienne l'autre), un texte à cheval sur le bord d'une image (15 à 85 % de sa surface dessus,
//                 au moins 12 px dans chaque sens), ou un contenu qui déborde du bloc de plus de 40 px (sur le voisin) ;
//   grille        au moins 30 % des rangées de contenu ont 3 colonnes ou plus (rangée = trait horizontal tous les
//                 ~8 px ; colonnes = intervalles de boîtes fusionnés à 16 px près, chacun d'au moins 10 % de la largeur
//                 du bloc et 48 px ; une image de fond qui couvre le bloc et porte du texte ne compte pas) ;
//   decale        asymétrique : le contenu du bloc laisse au moins 30 % de vide d'un côté et au plus 12 % de l'autre,
//                 ou les rangées à une colonne alternent à gauche et à droite (au moins 20 % chacune), ou deux images
//                 côte à côte sont en quinconce (hauts décalés d'au moins 25 % de la plus petite et 60 px) ;
//   colonnes      au moins 30 % des rangées de contenu ont 2 colonnes ou plus ;
//   pile          tout le reste : une colonne pleine largeur ou centrée, texte puis image.
// Le pied de page (<footer>, nom « footer »/« pied ») est relevé mais ne compte ni dans la suite ni dans la linéarité :
// presque tous les pieds sont en colonnes à l'ordinateur et masqueraient la pile au-dessus.
//
// LINÉARITÉ (0…1) = part de la hauteur de l'accueil (pied exclu) faite de BANDES, moyenne téléphone 0,5 / ordinateur 0,5
// (un seul mode s'il manque l'autre). Une bande est un bloc pleine largeur qu'on lit de haut en bas puis qu'on quitte
// par le bas : pile, colonnes, decale, plein-cadre, et chevauche quand le recouvrement reste DANS le bloc (débord < 40 px).
// Cassent la ligne : grille, piste, collant, fixe-lateral, et chevauche qui déborde sur le bloc voisin. Pourquoi pas
// « part de pile » (première idée, 31 oct 2026) : mesurée, elle donnait 0,29 au style dune (que le fondateur trouve
// linéaire : ses photos en quinconce et qui se chevauchent restent dans des bandes empilées) et 0,50 à casabonay.com,
// soit dune « moins linéaire » que 12 des 14 sites de l'usine : elle mesurait l'intérieur des bandes, pas la ligne. SIMILARITÉ DE DISPOSITION (0…1, par mode puis moyenne) = 0,5 x
// accord des suites de formes (1 − distance d'édition / plus longue ; colonnes et grille, pile et decale se remplacent
// pour 0,5) + 0,5 x recouvrement des parts de hauteur par forme (somme des minima).
//
// CALIBRATION (31 oct 2026, Chrome, accueils relevés le jour même ; figée dans CALIBRATION_MESURES plus bas et dans
// tests/disposition.test.mjs). Linéarité téléphone / ordinateur / pondérée :
//
//   usine (dist du 31 oct)                 tél.  ordi.  lin.   en ligne                         tél.  ordi.  lin.
//   _essai-lin2 (modèle dune, jetable)     1.00  1.00   1.00   steuermann.haus (source de dune)  1.00  1.00   1.00
//   fromagerie-ravanel                     1.00  1.00   1.00   apple.com/fr                      1.00  1.00   1.00
//   fromagerie-ravanel-b                   1.00  1.00   1.00   motherfuckingwebsite.com          1.00  1.00   1.00
//   lemaire-avocats                        1.00  1.00   1.00   pentagram.com                     1.00  1.00   1.00
//   demo-architecte                        1.00  0.91   0.96   sive.rs (ordi. : colonne < 50 %)  1.00   —     1.00
//   encre-noire                            1.00  0.85   0.92   bureauborsche.com                 1.00  1.00   1.00
//   veto-du-drac                           1.00  0.85   0.92   studiodumbar.com (1 écran mesuré)  1.00  1.00   1.00
//   toits-cie                              0.87  0.86   0.87   gov.uk                            1.00  0.90   0.95
//   prospect-epi-dor                       0.88  0.84   0.86   basecamp.com                      1.00  0.89   0.94
//   demo-brasserie                         1.00  0.72   0.86   are.na                            0.85  0.89   0.87
//   prospect-ballay-macon                  1.00  0.60   0.80   casabonay.com (colonne fixe)      1.00  0.00   0.50
//   chez-malo                              0.89  0.68   0.78   kinfolk.com (pistes)              0.95  0.00   0.48
//   anna-vidal (modèle casabonay)          1.00  0.00   0.50   wallpaper.com (grilles)           0.20  0.19   0.19
//   finck-fisch (mur 3D, pistes, collant)  0.57  0.43   0.50   itsnicethat.com (piste)           0.05  0.05   0.05
//   maison-aurore (scènes collantes)       0.52  0.31   0.42   locomotive.ca (0,1 écran relevé)  0.00  0.00   0.00
//
// SEUIL_LINEARITE 0.65 : au milieu de l'écart entre les dispositions non linéaires reconnues (casabonay.com et son
// modèle 0,50, le site du studio 0,50, kinfolk 0,48 et moins) et la première bande linéaire (chez-malo 0,78) ; 0,15
// au-dessus de casabonay, 0,13 sous chez-malo. Le téléphone est presque toujours en bandes (1,00 pour casabonay.com
// lui-même) : passer sous 0,65 demande environ un tiers de la hauteur de l'ordinateur hors bande. Présumés non
// linéaires et mesurés linéaires : bureauborsche.com (projets décalés, empilés), studiodumbar.com et locomotive.ca
// (un seul écran relevé : vidéo, chargement en JavaScript) ; la mesure est gardée telle quelle, pas corrigée à la main.
import { MOTS_ROLE } from './deroule.mjs';

export const FORMES = ['pile', 'colonnes', 'grille', 'decale', 'chevauche', 'plein-cadre', 'piste', 'collant', 'fixe-lateral'];
export const MOTS_FORME = {
  pile: 'pile', colonnes: 'colonnes', grille: 'grille', decale: 'décalé', chevauche: 'chevauchement', 'plein-cadre': 'plein cadre',
  piste: 'piste', collant: 'collant', 'fixe-lateral': 'colonne fixe',
};
export const POIDS_MODES = { m: 0.5, d: 0.5 };

/* ---------- CALIBRATION ----------
 * Remplie le 31 oct 2026 : voir le tableau CALIBRATION_MESURES et le commentaire au-dessus de SEUIL_LINEARITE.
 */
// (tableau et seuil plus bas, après les fonctions pures, pour pouvoir y lire les mesures.)

/* ---------- relevé dans la page (installé par installerMesureForme ; aucune référence extérieure) ---------- */

export function mesurerFormeBloc(racine) {
  const vw = innerWidth, vh = innerHeight, sx = scrollX, sy = scrollY;
  // Découpe : un bloc de plus de 1,5 écran dont les enfants (au moins la moitié de sa largeur, 40 px de haut) sont
  // EMPILÉS (chacun commence sous le précédent) est mesuré enfant par enfant (sites en <div> sans <section>) ; une
  // enveloppe à un seul enfant est traversée. Jamais à travers un élément collant, fixe ou qui défile en x.
  const decouper = (el, prof) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (prof >= 5 || r.height <= 1.5 * vh || /sticky|fixed/.test(cs.position) || /(auto|scroll)/.test(cs.overflowX) || (typeof el.className === 'string' && /pin-spacer/.test(el.className))) return [el];
    const kids = [...el.children].filter((k) => { const q = k.getBoundingClientRect(); return q.height >= 40 && q.width >= 0.5 * r.width && getComputedStyle(k).display !== 'none'; });
    if (kids.some((k) => /sticky|fixed/.test(getComputedStyle(k).position))) return [el];
    if (kids.length === 1) return decouper(kids[0], prof + 1);
    if (kids.length < 2) return [el];
    const rs = kids.map((k) => k.getBoundingClientRect());
    for (let i = 1; i < rs.length; i++) if (rs[i].top < rs[i - 1].bottom - 20) return [el];
    return kids.flatMap((k) => decouper(k, prof + 1));
  };
  const parts = decouper(racine, 0);
  if (parts.length > 1 || parts[0] !== racine) return { sous: parts.slice(0, 40).map((p) => mesurer(p)) };
  return mesurer(racine);
  function mesurer(el) {
  const clips = new Map();
  const RECT_INF = [-1e9, -1e9, 1e9, 1e9];
  const inter = (a, b) => [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.min(a[2], b[2]), Math.min(a[3], b[3])];
  const clipDe = (p) => {
    if (!p || p === document.documentElement || p === document.body) return RECT_INF;
    if (clips.has(p)) return clips.get(p);
    const cs = getComputedStyle(p);
    let c = clipDe(p.parentElement);
    const ox = cs.overflowX !== 'visible', oy = cs.overflowY !== 'visible';
    if (ox || oy) {
      const r = p.getBoundingClientRect();
      c = inter(c, [ox ? r.left + sx : -1e9, oy ? r.top + sy : -1e9, ox ? r.right + sx : 1e9, oy ? r.bottom + sy : 1e9]);
    }
    if (cs.position === 'fixed') c = RECT_INF;
    clips.set(p, c);
    return c;
  };
  const visibleRect = (e, r) => {
    const a = inter([r.left + sx, r.top + sy, r.right + sx, r.bottom + sy], clipDe(e.parentElement));
    return a[2] - a[0] >= 1 && a[3] - a[1] >= 1 ? [Math.round(a[0]), Math.round(a[1]), Math.round(a[2] - a[0]), Math.round(a[3] - a[1])] : null;
  };
  const vis = (e) => (e.checkVisibility ? e.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : true);
  const contenus = [];
  let piste = false, collant = 0;
  const tous = [el, ...el.querySelectorAll('*')];
  for (const e of tous) {
    if (contenus.length >= 600) break;
    const tag = e.tagName.toLowerCase();
    if (/^(script|style|template|noscript|source|br|track|path|g|use|defs|symbol|circle|rect|line|polyline|polygon|ellipse|text|tspan|mask|clippath|lineargradient|radialgradient|stop|filter)$/.test(tag)) continue;
    if (tag !== 'svg' && e.closest('svg')) continue;
    const cs = getComputedStyle(e);
    if (cs.display === 'none') continue;
    // piste
    if (!piste && e.clientWidth >= vw * 0.5 && e.clientHeight >= 100) {
      if (/(auto|scroll)/.test(cs.overflowX) && e.scrollWidth > e.clientWidth + 40) piste = true;
      else if (/(hidden|clip)/.test(cs.overflowX) && e.scrollWidth > e.clientWidth + 40) {
        const cr = e.getBoundingClientRect();
        const enfants = (n) => [...n.children].map((c) => c.getBoundingClientRect()).filter((r) => r.width >= 100 && r.height >= 60);
        for (const n of [e, ...e.children, ...[...e.children].flatMap((c) => [...c.children])]) {
          const rs = enfants(n);
          if (rs.length < 3) continue;
          const t0 = rs[0].top;
          const rang = rs.filter((r) => Math.abs(r.top - t0) < 20);
          if (rang.length >= 3 && Math.max(...rang.map((r) => r.right)) - Math.min(...rang.map((r) => r.left)) >= cr.width * 1.3) { piste = true; break; }
        }
      }
    }
    // collant
    if (cs.position === 'sticky' && cs.top !== 'auto' && e.parentElement) {
      const r = e.getBoundingClientRect();
      if (r.width * r.height >= 0.1 * vw * vh) collant = Math.max(collant, e.parentElement.getBoundingClientRect().height - r.height);
    }
    if (typeof e.className === 'string' && /\bpin-spacer\b/.test(e.className) && e.firstElementChild) {
      collant = Math.max(collant, e.getBoundingClientRect().height - e.firstElementChild.getBoundingClientRect().height);
    }
    if (!vis(e)) continue;
    // images
    if (/^(img|video|canvas|svg|iframe)$/.test(tag)) {
      const r = e.getBoundingClientRect();
      if (r.width * r.height >= 0.01 * vw * vh) { const v = visibleRect(e, r); if (v) contenus.push(['i', ...v]); }
      continue;
    }
    if (/url\(/.test(cs.backgroundImage) && !/data:image/.test(cs.backgroundImage)) {
      const tuile = /repeat/.test(cs.backgroundRepeat) && !/no-repeat/.test(cs.backgroundRepeat) && !/cover|contain/.test(cs.backgroundSize);
      const r = e.getBoundingClientRect();
      if (!tuile && r.width * r.height >= 0.03 * vw * vh) { const v = visibleRect(e, r); if (v) contenus.push(['i', ...v]); }
    }
    // textes : union des nœuds texte directs
    let u = null;
    for (const n of e.childNodes) {
      if (n.nodeType !== 3 || n.textContent.trim().length < 2) continue;
      const rg = document.createRange();
      rg.selectNodeContents(n);
      const r = rg.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      u = u ? { left: Math.min(u.left, r.left), top: Math.min(u.top, r.top), right: Math.max(u.right, r.right), bottom: Math.max(u.bottom, r.bottom) } : { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
    }
    if (u) { const v = visibleRect(e, u); if (v) contenus.push(['t', ...v]); }
  }
  const r = el.getBoundingClientRect();
  return { b: [Math.round(r.left + sx), Math.round(r.top + sy), Math.round(r.width), Math.round(r.height)], contenus, piste, collant: Math.round(collant) };
  }
}

export function mesurerPageForme() {
  const vw = innerWidth, vh = innerHeight;
  let colonne = null;
  for (const e of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(e);
    if (cs.position !== 'fixed' && !(cs.position === 'sticky' && cs.top !== 'auto')) continue;
    if (e.checkVisibility && !e.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
    const r = e.getBoundingClientRect();
    if (r.height < 0.8 * vh || r.width < 0.15 * vw || r.width > 0.6 * vw || r.left < -2 || r.right > vw + 2) continue;
    if (!(r.left <= 0.03 * vw || r.right >= 0.97 * vw)) continue;
    if ((e.innerText || '').trim().length < 10 && !e.querySelector('a, img')) continue;
    if (!colonne || r.width * r.height > colonne[1] * colonne[2]) colonne = [Math.round(r.left + scrollX), Math.round(r.width), Math.round(r.height)];
  }
  return { colonne: colonne ? [colonne[0], colonne[1]] : null };
}

/** Installe les deux relevés dans la page : releverDeroule (deroule.mjs) les appelle s'ils sont là. */
export async function installerMesureForme(page) {
  await page.evaluate(`window.__ffForme = ${mesurerFormeBloc.toString()}; window.__ffPageForme = ${mesurerPageForme.toString()};`);
}

/* ---------- fonctions pures ---------- */

const aire = (r) => r[2] * r[3];
const interAire = (a, b) => Math.max(0, Math.min(a[0] + a[2], b[0] + b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[1] + a[3], b[1] + b[3]) - Math.max(a[1], b[1]));
const interDims = (a, b) => [Math.min(a[0] + a[2], b[0] + b[2]) - Math.max(a[0], b[0]), Math.min(a[1] + a[3], b[1] + b[3]) - Math.max(a[1], b[1])];
const r2 = (x) => Math.round(x * 100) / 100;

/**
 * Pure : mesures de forme d'un bloc à partir de ses boîtes. raw = { b:[x,y,w,h], contenus:[['i'|'t',x,y,w,h]…], piste,
 * collant (px) } ; ctx = { vw, vh, colonne:[x,w]|null }. Rend des nombres compacts (gardés au registre, reclassables).
 */
export function mesuresForme(raw, ctx) {
  const { vw, vh } = ctx;
  const b = raw.b;
  const items = (raw.contenus || []).map(([k, x, y, w, h]) => ({ k, r: [x, y, w, h] }));
  const imgs = items.filter((i) => i.k === 'i'), txts = items.filter((i) => i.k === 't');
  // plein cadre : grande image qui porte du texte
  const grandes = imgs.filter((i) => i.r[2] >= 0.9 * vw && i.r[3] >= 0.6 * vh);
  const surGrande = txts.filter((t) => grandes.some((g) => interAire(t.r, g.r) >= 0.5 * aire(t.r))).length;
  const pleinCadre = grandes.length > 0 && surGrande > 0;
  // fonds : image qui couvre le bloc en largeur et porte du texte : hors des rangées
  const fond = (i) => i.k === 'i' && i.r[2] >= 0.9 * b[2] && txts.some((t) => interAire(t.r, i.r) >= 0.5 * aire(t.r));
  const rangeables = items.filter((i) => !fond(i));
  // rangées
  const pas = Math.max(8, b[3] / 300);
  const minCol = Math.max(48, 0.1 * b[2]);
  let n1 = 0, n2 = 0, n3 = 0, gauche = 0, droite = 0;
  for (let y = b[1] + pas / 2; y < b[1] + b[3]; y += pas) {
    const iv = rangeables.filter((i) => y >= i.r[1] && y < i.r[1] + i.r[3]).map((i) => [i.r[0], i.r[0] + i.r[2]]).sort((p, q) => p[0] - q[0]);
    if (!iv.length) continue;
    const f = [];
    for (const [a, z] of iv) { const d = f[f.length - 1]; if (d && a <= d[1] + 16) d[1] = Math.max(d[1], z); else f.push([a, z]); }
    const cols = f.filter(([a, z]) => z - a >= minCol);
    const k = cols.length || 1;
    if (k >= 3) n3++; else if (k === 2) n2++; else {
      n1++;
      const [a, z] = cols[0] || f.reduce((m, x) => (x[1] - x[0] > m[1] - m[0] ? x : m), f[0]);
      const c = ((a + z) / 2 - b[0]) / b[2];
      if (c < 0.38) gauche++; else if (c > 0.62) droite++;
    }
  }
  const n = n1 + n2 + n3;
  const k3 = n ? n3 / n : 0, k2 = n ? n2 / n : 0;
  // asymétrie du contenu entier
  let asym = 0;
  if (rangeables.length) {
    const minx = Math.max(b[0], Math.min(...rangeables.map((i) => i.r[0]))), maxx = Math.min(b[0] + b[2], Math.max(...rangeables.map((i) => i.r[0] + i.r[2])));
    const g = (minx - b[0]) / b[2], d = (b[0] + b[2] - maxx) / b[2];
    if (Math.max(g, d) >= 0.3 && Math.min(g, d) <= 0.12) asym = r2(Math.max(g, d));
  }
  const zigzag = n1 >= 4 && gauche / n >= 0.2 && droite / n >= 0.2;
  // quinconce : deux images côte à côte, hauts décalés
  const hautes = imgs.filter((i) => i.r[3] >= 100 && i.r[2] >= 80);
  let quinconce = 0;
  for (let i = 0; i < hautes.length; i++) for (let j = i + 1; j < hautes.length; j++) {
    const p = hautes[i].r, q = hautes[j].r;
    const [dx, dy] = interDims(p, q);
    if (dx > 4 || dy < 0.3 * Math.min(p[3], q[3])) continue; // pas côte à côte
    if (Math.abs(p[1] - q[1]) >= Math.max(60, 0.25 * Math.min(p[3], q[3]))) quinconce++;
  }
  // chevauchements
  let chevImg = 0, chevTxt = 0, debord = 0;
  for (let i = 0; i < imgs.length; i++) for (let j = i + 1; j < imgs.length; j++) {
    const p = imgs[i].r, q = imgs[j].r, a = interAire(p, q), m = Math.min(aire(p), aire(q));
    if (m > 0 && a >= 0.05 * m && a < 0.9 * m) chevImg++;
  }
  for (const t of txts) {
    if (t.r[3] < 20) continue;
    for (const i of imgs) {
      const a = interAire(t.r, i.r), [dx, dy] = interDims(t.r, i.r);
      if (a >= 0.15 * aire(t.r) && a <= 0.85 * aire(t.r) && dx >= 12 && dy >= 12) { chevTxt++; break; }
    }
  }
  for (const i of items) {
    if (i.k === 'i' && (i.r[2] < 60 || i.r[3] < 60)) continue;
    debord = Math.max(debord, b[1] - i.r[1], i.r[1] + i.r[3] - (b[1] + b[3]));
  }
  const fixe = Boolean(ctx.colonne && Math.max(0, Math.min(b[0] + b[2], ctx.colonne[0] + ctx.colonne[1]) - Math.max(b[0], ctx.colonne[0])) < 0.2 * b[2]);
  return {
    k3: r2(k3), k2: r2(k2), asym, zigzag, quinconce, chevImg, chevTxt, debord: Math.max(0, Math.round(debord)),
    pleinCadre, piste: Boolean(raw.piste), collant: r2((raw.collant || 0) / vh), fixe,
  };
}

/** Pure : la forme d'un bloc à partir de ses mesures (ordre de priorité de l'en-tête) ; rend { forme, raison }. */
export function formeDe(m) {
  if (m.fixe) return { forme: 'fixe-lateral', raison: 'à côté de la colonne fixe' };
  if (m.piste) return { forme: 'piste', raison: 'défile en x' };
  if (m.collant >= 0.9) return { forme: 'collant', raison: `collant sur ${m.collant} écran` };
  if (m.pleinCadre) return { forme: 'plein-cadre', raison: 'texte sur une image plein cadre' };
  if (m.chevImg || m.chevTxt || m.debord >= 40) return { forme: 'chevauche', raison: m.chevImg ? `${m.chevImg} images qui se croisent` : m.chevTxt ? 'texte à cheval sur une image' : `déborde de ${m.debord} px` };
  if (m.k3 >= 0.3) return { forme: 'grille', raison: `${Math.round(m.k3 * 100)} % des rangées à 3 colonnes ou plus` };
  if (m.asym || m.zigzag || m.quinconce) return { forme: 'decale', raison: m.quinconce ? 'images en quinconce' : m.zigzag ? 'rangées alternées gauche/droite' : `vide de ${Math.round(m.asym * 100)} % d'un côté` };
  if (m.k2 + m.k3 >= 0.3) return { forme: 'colonnes', raison: `${Math.round((m.k2 + m.k3) * 100)} % des rangées à 2 colonnes` };
  return { forme: 'pile', raison: 'une colonne' };
}

const PIED = /\b(footer|pied|contentinfo|site-footer)\b/i;
/** Pure : un bloc relevé est-il le pied de page ? */
export const estPied = (b) => b.tag === 'footer' || PIED.test(`${b.id || ''} ${b.cls || ''}`) || b.role === 'pied';

/**
 * Pure : disposition d'un mode à partir d'un relevé de déroulé (releverDeroule avec window.__ffForme installé : chaque
 * bloc porte `forme` brut, la page porte `pageForme`). Rend { vw, vh, blocs:[{forme, h, pied, mes, raison}], linearite }.
 */
export function dispositionMode(rel) {
  const { vw, vh } = rel;
  const ctx = { vw, vh, colonne: rel.pageForme?.colonne || null };
  const blocs = (rel.blocs || []).filter((b) => b.forme).flatMap((b) => (b.forme.sous ? b.forme.sous : [b.forme]).map((raw) => {
    const mes = mesuresForme(raw, ctx);
    const f = formeDe(mes);
    return { forme: f.forme, raison: f.raison, h: r2(raw.b[3] / vh), pied: estPied(b), mes };
  })).filter((b) => b.h > 0);
  return { vw, vh, blocs, linearite: linearite(blocs) };
}

export const FORMES_BANDE = ['pile', 'colonnes', 'decale', 'plein-cadre'];
/** Pure : le bloc est-il une bande (lu de haut en bas, quitté par le bas) ? Un chevauchement interne en est une. */
export const estBande = (b) => FORMES_BANDE.includes(b.forme) || (b.forme === 'chevauche' && (b.mes?.debord ?? 0) < 40);

/** Pure : part (0…1) de la hauteur (pied exclu) faite de bandes ; null sans bloc. */
export function linearite(blocs = []) {
  const c = blocs.filter((b) => !b.pied);
  const tot = c.reduce((s, b) => s + (b.h || 0), 0);
  return tot > 0 ? r2(c.filter(estBande).reduce((s, b) => s + b.h, 0) / tot) : null;
}

/** Pure : linéarité pondérée des modes présents (téléphone 0,5, ordinateur 0,5). */
export function linearitePonderee(modes = {}) {
  let s = 0, p = 0;
  for (const [k, w] of Object.entries(POIDS_MODES)) if (modes[k]?.linearite != null) { s += w * modes[k].linearite; p += w; }
  return p ? r2(s / p) : null;
}

/** Pure : empreinte de disposition { version, m, d, linearite } depuis les relevés des deux modes. */
export function disposition({ m = null, d = null } = {}) {
  const out = { version: 1 };
  if (m) out.m = dispositionMode(m);
  if (d) out.d = dispositionMode(d);
  out.linearite = linearitePonderee(out);
  return out;
}

/** Pure : reclasse une disposition du registre avec les règles du jour (mesures gardées, sans Chrome). */
export function rafraichirDisposition(disp) {
  if (!disp) return disp;
  const out = { ...disp };
  for (const k of ['m', 'd']) if (disp[k]?.blocs) {
    const blocs = disp[k].blocs.map((b) => (b.mes ? { ...b, ...formeDe(b.mes) } : b));
    out[k] = { ...disp[k], blocs, linearite: linearite(blocs) };
  }
  out.linearite = linearitePonderee(out);
  return out;
}

/** Pure : suite des formes d'un mode (pied exclu). */
export const suiteFormes = (mode) => (mode?.blocs || []).filter((b) => !b.pied).map((b) => b.forme);

/** Pure : parts de hauteur par forme d'un mode (pied exclu), somme 1. */
export function partsFormes(mode) {
  const c = (mode?.blocs || []).filter((b) => !b.pied);
  const tot = c.reduce((s, b) => s + (b.h || 0), 0);
  const out = {};
  if (!tot) return out;
  for (const b of c) out[b.forme] = (out[b.forme] || 0) + b.h / tot;
  return out;
}

const VOISINES = new Set(['colonnes|grille', 'grille|colonnes', 'pile|decale', 'decale|pile']);
const coutF = (x, y) => (x === y ? 0 : VOISINES.has(`${x}|${y}`) ? 0.5 : 1);
/** Pure : accord (0…1) de deux suites de formes = 1 − distance d'édition / longueur de la plus longue. */
export function accordFormes(a = [], b = []) {
  const L = Math.max(a.length, b.length);
  if (!L) return 1;
  const D = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + coutF(a[i - 1], b[j - 1]));
  return Math.round((1 - D[a.length][b.length] / L) * 1000) / 1000;
}

/** Pure : recouvrement (0…1) des parts de hauteur par forme. */
export function accordParts(p = {}, q = {}) {
  let s = 0;
  for (const f of new Set([...Object.keys(p), ...Object.keys(q)])) s += Math.min(p[f] || 0, q[f] || 0);
  return Math.round(s * 1000) / 1000;
}

/** Pure : similarité de disposition (0…1) de deux empreintes de disposition ; null si aucun mode commun. */
export function similariteDisposition(a, b) {
  const v = [];
  for (const k of ['m', 'd']) {
    const p = a?.[k], q = b?.[k];
    if (!p?.blocs?.length || !q?.blocs?.length) continue;
    v.push(0.5 * accordFormes(suiteFormes(p), suiteFormes(q)) + 0.5 * accordParts(partsFormes(p), partsFormes(q)));
  }
  return v.length ? Math.round(v.reduce((s, x) => s + x, 0) / v.length * 1000) / 1000 : null;
}

/** Pure : « pile, pile, colonnes, pile… » (mode donné, pied exclu, 8 formes au plus). */
export function suiteEnMotsFormes(mode, max = 8) {
  const s = suiteFormes(mode).map((f) => MOTS_FORME[f] || f);
  return s.length > max ? `${s.slice(0, max).join(', ')}…` : s.join(', ');
}

const pc = (x) => `${Math.round((x || 0) * 100)} %`;
/** Pure : ce qui est pareil dans la disposition, en mots. */
export function ceQuiEstPareilDisposition(a, b) {
  const out = [];
  if (a?.linearite != null && b?.linearite != null && a.linearite >= 0.6 && b.linearite >= 0.6) out.push(`les deux empilent (${pc(a.linearite)} et ${pc(b.linearite)} de la hauteur en bandes)`);
  for (const k of ['d', 'm']) {
    const p = suiteFormes(a?.[k]), q = suiteFormes(b?.[k]);
    if (p.length && q.length && accordFormes(p, q) >= 0.7) { out.push(`même suite ${k === 'd' ? 'à l\'ordinateur' : 'au téléphone'} : ${suiteEnMotsFormes(a[k], 6)}`); break; }
  }
  return out.join(' ; ') || 'rien de saillant';
}

/** Pure : ligne « disposition » d'un site pour l'affichage. */
export function dispositionEnMots(disp) {
  if (!disp) return 'disposition non mesurée';
  return `linéarité ${disp.linearite == null ? '?' : disp.linearite.toFixed(2)} ; ordinateur : ${suiteEnMotsFormes(disp.d) || '—'} ; téléphone : ${suiteEnMotsFormes(disp.m) || '—'}`;
}

/**
 * Pure : le style maison d'un registre (empreintes avec disposition) : linéarité moyenne, part des sites au-dessus du
 * seuil, et la forme la plus fréquente par la hauteur (moyenne des parts de chaque site, modes pondérés).
 */
export function styleMaison(registre, seuil = SEUIL_LINEARITE) {
  const avec = registre.filter((e) => e.disposition?.linearite != null);
  if (!avec.length) return null;
  const parts = {};
  for (const e of avec) {
    let p = 0;
    const acc = {};
    for (const [k, w] of Object.entries(POIDS_MODES)) if (e.disposition[k]?.blocs?.length) { p += w; for (const [f, v] of Object.entries(partsFormes(e.disposition[k]))) acc[f] = (acc[f] || 0) + w * v; }
    for (const [f, v] of Object.entries(acc)) parts[f] = (parts[f] || 0) + v / (p || 1) / avec.length;
  }
  const [forme, part] = Object.entries(parts).sort((x, y) => y[1] - x[1])[0] || ['pile', 0];
  const lin = avec.map((e) => e.disposition.linearite);
  return {
    n: avec.length,
    linearite: r2(lin.reduce((s, x) => s + x, 0) / lin.length),
    auDessus: avec.filter((e) => e.disposition.linearite > seuil).map((e) => e.slug || e.url),
    partAuDessus: r2(avec.filter((e) => e.disposition.linearite > seuil).length / avec.length),
    forme, part: r2(part),
    parts: Object.fromEntries(Object.entries(parts).sort((x, y) => y[1] - x[1]).map(([f, v]) => [f, r2(v)])),
  };
}

/** Pure : la phrase du style maison. */
export function phraseStyleMaison(s, seuil = SEUIL_LINEARITE) {
  if (!s) return 'style maison : aucune disposition mesurée au registre.';
  const verbe = { pile: 'empile', colonnes: 'met en colonnes', grille: 'quadrille', decale: 'décale', chevauche: 'superpose', 'plein-cadre': 'met en plein cadre', piste: 'fait défiler en piste', collant: 'épingle', 'fixe-lateral': 'fixe une colonne' }[s.forme] || s.forme;
  return `l'usine empile : ${pc(s.linearite)} de la hauteur des accueils en bandes empilées (linéarité moyenne ${s.linearite.toFixed(2)} sur ${s.n} sites), ${pc(s.partAuDessus)} des sites au-dessus du seuil ${seuil} ; forme la plus fréquente : ${MOTS_FORME[s.forme] || s.forme} (l'usine ${verbe}, ${pc(s.part)} de la hauteur).`;
}

/* ---------- CALIBRATION (tableau de l'en-tête : [téléphone, ordinateur] ; null = non mesuré) ---------- */
export const CALIBRATION_MESURES = {
  lineaires: {
    '_essai-lin2 (dune)': [1, 1], 'steuermann.haus': [1, 1], 'fromagerie-ravanel': [1, 1], 'lemaire-avocats': [1, 1],
    'demo-architecte': [1, 0.91], 'encre-noire': [1, 0.85], 'veto-du-drac': [1, 0.85], 'toits-cie': [0.87, 0.86],
    'prospect-epi-dor': [0.88, 0.84], 'demo-brasserie': [1, 0.72], 'prospect-ballay-macon': [1, 0.6], 'chez-malo': [0.89, 0.68],
    'apple.com/fr': [1, 1], 'motherfuckingwebsite.com': [1, 1], 'pentagram.com': [1, 1], 'gov.uk': [1, 0.9], 'basecamp.com': [1, 0.89],
    'sive.rs': [1, null], 'are.na': [0.85, 0.89],
  },
  nonLineaires: {
    'casabonay.com': [1, 0], 'anna-vidal (casabonay)': [1, 0], 'finck-fisch': [0.57, 0.43], 'kinfolk.com': [0.95, 0],
    'maison-aurore': [0.52, 0.31], 'wallpaper.com': [0.2, 0.19], 'itsnicethat.com': [0.05, 0.05],
  },
};
export const SEUIL_LINEARITE = 0.65;
