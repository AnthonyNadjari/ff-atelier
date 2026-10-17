// `ff ressemblance [<slug> …] [--seuil 0.65] [--tous] [--registre]`
// Contrôle de diversité par la MISE EN PAGE du premier écran, contre TOUS les sites du registre.
// --tous : recalcule les empreintes de tous les sites construits (hors _*) et liste les paires trop proches.
// --registre : sans Chrome ni build, compare les empreintes déjà versionnées dans docs/empreintes/.
//
// Empreinte d'un site construit (Chrome, dist/<slug> servi en local, 1 500 ms d'attente : entrées jouées),
// au téléphone 390x844 puis à l'ordinateur 1400x900. Dans le premier écran seulement, boîtes coupées à
// l'écran de huit rôles : titre (h1), image (img/picture/video/canvas >= 2 % de l'écran, éléments à
// background-image url() >= 15 %, les 8 plus grandes), telephone (a[href^="tel:"] le plus grand hors nav et
// barre basse), actions (liens/boutons > 36 px de haut hors nav et barre basse), barre-bas (fixed/sticky collé
// en bas), nav (header/nav du haut), carte (plus petit ancêtre commun du h1 et du téléphone, ou de la plus
// grande action, qui a un fond ou une ombre visible), texte (paragraphes). Puis une grille 8x12 : chaque case
// prend le rôle qui y occupe le plus de surface, rôles peints du fond vers le devant (image, carte, nav,
// barre-bas, texte, actions, telephone, titre : la carte posée sur la photo cache la photo, le h1 dans la
// carte cache la carte), « vide » sinon. Plus des mesures : part de l'écran en image, position du h1
// (haut/milieu/bas), h1 sur l'image (> 30 % de sa surface), taille du h1 / largeur, colonnes de texte, barre
// basse (et son nombre de boutons), carte, numéro sous le h1. Les dessins (svg >= 2 % de l'écran) comptent
// comme image : l'ardoise sans son dessin de meule ressemblait à l'escalier.
//
// Ressemblance = 0,7 x accord des grilles + 0,3 x accord des mesures. Grilles : part des cases de même rôle,
// sans compter les cases vides des deux côtés, une case retrouvée une ligne plus haut ou plus bas comptant
// moitié. Mesures : position du h1, puis h1 sur l'image, image > 50 %, barre basse, carte (une présence
// partagée compte 1, une absence partagée 0,5). Échec si ressemblance > seuil au téléphone OU à l'ordinateur
// avec au moins un autre site du registre docs/empreintes/<slug>.json (versionné : la veille et les autres
// postes comparent sans reconstruire). Planche : captures/planches/<slug>-ressemblance.jpg (captures locales
// captures/empreintes/<slug>-m.jpg ; à défaut, la grille dessinée).
//
// Pourquoi (17 oct 2026) : prospect-epi-dor, prospect-ballay-macon, prospect-a-coeur-bois et
// fromagerie-ravanel-d avaient le MÊME premier écran au téléphone (photo, carte crème posée dessus avec
// « Métier à Ville », étoiles, numéro en grand, horaires, barre de trois boutons) ; le fondateur l'a vu en une
// seconde, `ff pistes` disait « différents » (il comparait polices, couleurs et une image floue en gris).
//
// CALIBRATION (17 oct 2026 vers 19 h, dist de ce moment, avant la reprise des prospects ; empreintes figées
// dans tests/ressemblance.test.mjs). Ressemblance au TÉLÉPHONE :
//
//                 epi  ballay   acb  rav-d   rav  rav-b  rav-c    ff
//   epi             —    0.89  0.75   0.83  0.14   0.09   0.21  0.13
//   ballay       0.89       —  0.78   0.86  0.16   0.09   0.20  0.15
//   acb          0.75    0.78     —   0.70  0.13   0.09   0.24  0.16
//   rav-d        0.83    0.86  0.70      —  0.15   0.08   0.20  0.15
//   rav          0.14    0.16  0.13   0.15     —   0.55   0.44  0.54
//   rav-b        0.09    0.09  0.09   0.08  0.55      —   0.37  0.57
//   rav-c        0.21    0.20  0.24   0.20  0.44   0.37      —  0.40
//   ff           0.13    0.15  0.16   0.15  0.54   0.57   0.40     —
//
//   epi = prospect-epi-dor, ballay = prospect-ballay-macon, acb = prospect-a-coeur-bois, rav-d =
//   fromagerie-ravanel-d (les quatre « très similaires » du fondateur) ; rav = fromagerie-ravanel (ardoise
//   sombre typographique), rav-b (escalier), rav-c (calendrier), ff = finck-fisch (mur 3D).
//   Paires du fondateur : 0.70 à 0.89. Autres paires : 0.57 au plus. À l'ordinateur, les autres restent
//   sous 0.54. SEUIL 0.65 : au milieu de l'écart 0.57 – 0.70, 0.05 sous la paire du fondateur la plus faible
//   et 0.08 au-dessus de la paire différente la plus proche. 0.72 (première idée) laissait passer acb/rav-d.
//   Sur les 35 sites construits ce jour-là, 0.65 signale 53 paires sur 595 (téléphone ou ordinateur) : la
//   famille « photo plein écran, h1 blanc dessus » (chez-malo, studio-ambre, forge-delacroix, encre-noire,
//   maison-aurore, demo-coiffure…) est réellement une seule mise en page.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { ROOT, DIST_DIR, resolveSlug, ok, fail, info, warn, parseArgs, listSites } from './util.mjs';
import { servir } from './film.mjs';

export const SEUIL_RESSEMBLANCE = 0.65;
export const COLS = 8, ROWS = 12;
export const ROLES = ['image', 'carte', 'nav', 'barre-bas', 'texte', 'actions', 'telephone', 'titre'];
export const MODES = { m: { vw: 390, vh: 844, mobile: true, nom: 'téléphone' }, d: { vw: 1400, vh: 900, mobile: false, nom: 'ordinateur' } };
export const REGISTRE = path.join(ROOT, 'docs', 'empreintes');
const CAPTURES = path.join(ROOT, 'captures', 'empreintes');
const POIDS_GRILLE = 0.7;
const ATTENTE = 1500;
const SOUS = 8; // échantillons par case et par côté

/* ---------- relevé dans la page (sérialisé par playwright : aucune référence extérieure) ---------- */

export function releverPremierEcran() {
  const vw = innerWidth, vh = innerHeight, aire = vw * vh;
  const couper = (r) => {
    const x = Math.max(0, r.left), y = Math.max(0, r.top), x2 = Math.min(vw, r.right), y2 = Math.min(vh, r.bottom);
    return x2 - x >= 1 && y2 - y >= 1 ? [Math.round(x), Math.round(y), Math.round(x2 - x), Math.round(y2 - y)] : null;
  };
  const visible = (el) => (el.checkVisibility ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : true);
  const boite = (el) => (el && visible(el) ? couper(el.getBoundingClientRect()) : null);
  const surf = (b) => (b ? b[2] * b[3] : 0);
  const opaciteCumulee = (el) => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity) || 0; return o; };
  const transparent = (c) => !c || c === 'transparent' || /rgba\([^)]*,\s*0(\.0+)?\)$/.test(c);

  // nav du haut : header/nav/[role=banner] qui commence en haut et reste bas.
  const navs = [...document.querySelectorAll('header, nav, [role="banner"]')].map((e) => ({ e, b: boite(e) }))
    .filter(({ b }) => b && b[1] < vh * 0.1 && b[3] < vh * 0.3 && b[2] > vw * 0.3);
  navs.sort((p, q) => surf(q.b) - surf(p.b));
  const nav = navs[0] || null;

  // barre basse : fixed/sticky, collée au bas de l'écran, large, pas trop haute.
  const tous = [...document.querySelectorAll('body *')];
  let barre = null;
  for (const e of tous) {
    const cs = getComputedStyle(e);
    if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
    const b = boite(e);
    if (!b || b[1] + b[3] < vh - 4 || b[1] < vh * 0.6 || b[3] < 30 || b[2] < vw * 0.5) continue;
    if (!barre || surf(b) > surf(barre.b)) barre = { e, b };
  }
  const dansNavOuBarre = (el) => (nav && nav.e.contains(el)) || (barre && barre.e.contains(el)) || Boolean(el.closest('header, nav'));
  const boutonsBarre = barre ? [...barre.e.querySelectorAll('a, button')].filter((x) => { const b = boite(x); return b && b[2] >= 30 && b[3] >= 24; }).length : 0;

  const h1El = [...document.querySelectorAll('h1')].find((e) => boite(e)) || null;
  const titre = boite(h1El);

  // images
  const images = [];
  for (const e of document.querySelectorAll('img, picture, video, canvas, svg')) {
    if (e.tagName.toLowerCase() === 'svg' && e.parentElement?.closest('svg')) continue;
    const b = boite(e);
    if (b && surf(b) >= 0.02 * aire && opaciteCumulee(e) >= 0.35) images.push(b);
  }
  for (const e of tous) {
    if (e === document.body) continue;
    const cs = getComputedStyle(e);
    if (!/url\(/.test(cs.backgroundImage)) continue;
    const tuile = /repeat/.test(cs.backgroundRepeat) && !/no-repeat/.test(cs.backgroundRepeat) && !/cover|contain/.test(cs.backgroundSize);
    const b = boite(e);
    if (!tuile && b && surf(b) >= 0.15 * aire && opaciteCumulee(e) >= 0.35) images.push(b);
  }
  images.sort((p, q) => surf(q) - surf(p));

  // téléphone et actions
  const tels = [...document.querySelectorAll('a[href^="tel:"]')].filter((e) => !dansNavOuBarre(e)).map((e) => ({ e, b: boite(e) })).filter((x) => x.b);
  tels.sort((p, q) => surf(q.b) - surf(p.b));
  const tel = tels[0] || null;
  const actions = [...document.querySelectorAll('a, button, [role="button"], input[type="submit"]')]
    .filter((e) => e !== tel?.e && !dansNavOuBarre(e))
    .map((e) => ({ e, b: boite(e) })).filter((x) => x.b && x.b[3] > 36);

  // carte : plus petit ancêtre commun du h1 et du téléphone (sinon de la plus grande action) qui se voit.
  const fondPage = (() => { for (const e of [document.body, document.documentElement]) { const c = getComputedStyle(e).backgroundColor; if (!transparent(c)) return c; } return 'rgb(255, 255, 255)'; })();
  let carte = null;
  const autre = tel?.e || [...actions].sort((p, q) => surf(q.b) - surf(p.b))[0]?.e;
  if (h1El && autre) {
    let lca = h1El;
    while (lca && !lca.contains(autre)) lca = lca.parentElement;
    for (let e = lca; e && e !== document.body && e !== document.documentElement; e = e.parentElement) {
      const b = boite(e);
      if (!b) continue;
      if (surf(b) >= 0.85 * aire) break;
      const cs = getComputedStyle(e);
      const fond = !transparent(cs.backgroundColor) && cs.backgroundColor !== fondPage;
      const ombre = cs.boxShadow && cs.boxShadow !== 'none';
      const flou = cs.backdropFilter && cs.backdropFilter !== 'none';
      if (fond || ombre || flou) { carte = b; break; }
    }
  }

  const textes = [...document.querySelectorAll('p')].filter((e) => !dansNavOuBarre(e) && e.textContent.trim()).map(boite).filter(Boolean);
  const blocsTexte = [...document.querySelectorAll('p, h1, h2, h3, li, blockquote, dd, dt, address, figcaption')]
    .filter((e) => !dansNavOuBarre(e) && e.textContent.trim().length >= 2 && !e.querySelector('p, h1, h2, h3, li'))
    .map(boite).filter(Boolean);

  return {
    vw, vh, scrollY: Math.round(scrollY),
    roles: {
      titre: titre ? [titre] : [],
      image: images.slice(0, 8),
      telephone: tel ? [tel.b] : [],
      actions: actions.map((x) => x.b),
      'barre-bas': barre ? [barre.b] : [],
      nav: nav ? [nav.b] : [],
      carte: carte ? [carte] : [],
      texte: textes,
    },
    blocsTexte,
    h1Px: h1El ? parseFloat(getComputedStyle(h1El).fontSize) : null,
    h1Texte: h1El ? h1El.textContent.replace(/\s+/g, ' ').trim().slice(0, 80) : null,
    boutonsBarre,
  };
}

/* ---------- fonctions pures ---------- */

const dans = (b, x, y) => x >= b[0] && x < b[0] + b[2] && y >= b[1] && y < b[1] + b[3];

/** Pure : rôle visible en chaque point d'échantillonnage (peinture du fond vers le devant). */
export function raster(roles, vw, vh, cols = COLS, rows = ROWS, sous = SOUS) {
  const nx = cols * sous, ny = rows * sous;
  const out = new Array(nx * ny).fill('');
  for (const role of ROLES) for (const b of roles?.[role] || []) {
    const i0 = Math.max(0, Math.floor(b[0] / vw * nx - 0.5)), i1 = Math.min(nx - 1, Math.ceil((b[0] + b[2]) / vw * nx));
    const j0 = Math.max(0, Math.floor(b[1] / vh * ny - 0.5)), j1 = Math.min(ny - 1, Math.ceil((b[1] + b[3]) / vh * ny));
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) if (dans(b, (i + 0.5) * vw / nx, (j + 0.5) * vh / ny)) out[j * nx + i] = role;
  }
  return out;
}

/** Pure : grille cols x rows (ligne par ligne) du rôle dominant de chaque case, '' = vide. */
export function grille(roles, vw, vh, cols = COLS, rows = ROWS) {
  const r = raster(roles, vw, vh, cols, rows, SOUS);
  const nx = cols * SOUS;
  const g = [];
  for (let cj = 0; cj < rows; cj++) for (let ci = 0; ci < cols; ci++) {
    const n = {};
    for (let j = 0; j < SOUS; j++) for (let i = 0; i < SOUS; i++) { const v = r[(cj * SOUS + j) * nx + ci * SOUS + i]; n[v] = (n[v] || 0) + 1; }
    let best = '', max = -1;
    for (const [k, v] of Object.entries(n)) if (v > max || (v === max && k !== '')) { best = k; max = v; }
    g.push(best);
  }
  return g;
}

/** Pure : part (0…1) de la surface d'un ensemble de boîtes, mesurée sur la trame. */
function couverture(boites, vw, vh) {
  if (!boites?.length) return 0;
  const r = raster({ image: boites }, vw, vh);
  return r.filter(Boolean).length / r.length;
}

/** Pure : part (0…1) de la boîte b qui tombe sur l'union des boîtes. */
export function recouvrement(b, boites) {
  if (!b || !boites?.length) return 0;
  const n = 16;
  let dedans = 0;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const x = b[0] + (i + 0.5) * b[2] / n, y = b[1] + (j + 0.5) * b[3] / n;
    if (boites.some((c) => dans(c, x, y))) dedans++;
  }
  return dedans / (n * n);
}

/** Pure : nombre de colonnes de texte (blocs côte à côte, chacun >= 15 % de la largeur). */
export function colonnesTexte(blocs, vw, vh) {
  let max = 0;
  for (let k = 0; k < 96; k++) {
    const y = (k + 0.5) * vh / 96;
    const iv = (blocs || []).filter((b) => y >= b[1] && y < b[1] + b[3]).map((b) => [b[0], b[0] + b[2]]).sort((p, q) => p[0] - q[0]);
    const fusion = [];
    for (const [a, z] of iv) { const d = fusion[fusion.length - 1]; if (d && a <= d[1] + 8) d[1] = Math.max(d[1], z); else fusion.push([a, z]); }
    max = Math.max(max, fusion.filter(([a, z]) => z - a >= 0.15 * vw).length);
  }
  return max;
}

/** Pure : mesures d'un relevé. */
export function mesures(rel) {
  const { vw, vh, roles } = rel;
  const h1 = roles.titre?.[0] || null, tel = roles.telephone?.[0] || null;
  const partImage = couverture(roles.image, vw, vh);
  const cy = h1 ? (h1[1] + h1[3] / 2) / vh : null;
  return {
    partImage: Math.round(partImage * 100) / 100,
    positionH1: cy == null ? null : cy < 0.36 ? 'haut' : cy < 0.64 ? 'milieu' : 'bas',
    h1SurImage: h1 ? recouvrement(h1, roles.image) > 0.3 : false,
    tailleH1: rel.h1Px && vw ? Math.round(rel.h1Px / vw * 1000) / 1000 : null,
    colonnesTexte: colonnesTexte(rel.blocsTexte, vw, vh),
    barreBas: (roles['barre-bas'] || []).length > 0,
    boutonsBarre: (roles['barre-bas'] || []).length ? rel.boutonsBarre || 0 : 0,
    carte: (roles.carte || []).length > 0,
    carteSurImage: (roles.carte || []).length > 0 && recouvrement(roles.carte[0], roles.image) > 0.1,
    telSousH1: Boolean(h1 && tel && tel[1] >= h1[1] + h1[3] - 4 && tel[0] < h1[0] + h1[2] && tel[0] + tel[2] > h1[0]),
  };
}

/** Pure : empreinte d'un mode à partir du relevé de la page. */
export function empreinteMode(rel) {
  return { vw: rel.vw, vh: rel.vh, h1Texte: rel.h1Texte ?? null, roles: rel.roles, grille: grille(rel.roles, rel.vw, rel.vh), mesures: mesures(rel) };
}

// Présences comparées : partager une chose qu'on voit (une carte, une barre basse) compte 1 ; partager une
// absence ne compte que 0,5 (deux pages sans barre basse ne se ressemblent pas pour autant).
const PRESENCES = [(m) => m.h1SurImage, (m) => m.partImage > 0.5, (m) => m.barreBas, (m) => m.carte];

/** Pure : accord des mesures (0…1) : h1 sur l'image, position du h1, image > 50 %, barre basse, carte. */
export function accordMesures(p, q) {
  let s = p.positionH1 && p.positionH1 === q.positionH1 ? 1 : 0;
  for (const f of PRESENCES) if (Boolean(f(p)) === Boolean(f(q))) s += f(p) ? 1 : 0.5;
  return s / (PRESENCES.length + 1);
}

/**
 * Pure : accord des grilles (0…1). Les cases vides des deux côtés ne comptent pas (une page aérée n'en
 * ressemble pas une autre par son vide) ; une case dont le rôle est dans la case du dessus ou du dessous de
 * l'autre compte pour moitié (le même bloc décalé d'une ligne reste le même bloc).
 */
export function accordGrille(a, b, cols = COLS) {
  const g = a?.grille, h = b?.grille;
  if (!g?.length || g.length !== h?.length) return 0;
  const voisin = (x, y, i) => x && [i - cols, i + cols].some((j) => j >= 0 && j < y.length && y[j] === x);
  let s = 0, n = 0;
  for (let i = 0; i < g.length; i++) {
    if (!g[i] && !h[i]) continue;
    n++;
    if (g[i] === h[i]) s++;
    else if (voisin(g[i], h, i) || voisin(h[i], g, i)) s += 0.5;
  }
  return n ? s / n : 1;
}

/** Pure : ressemblance (0…1) de deux empreintes d'un même mode. */
export function similarite(a, b) {
  if (!a?.grille?.length || a.grille.length !== b?.grille?.length) return null;
  return Math.round((POIDS_GRILLE * accordGrille(a, b) + (1 - POIDS_GRILLE) * accordMesures(a.mesures, b.mesures)) * 1000) / 1000;
}

/** Pure : distance de mise en page = 1 − ressemblance. */
export function distance(a, b) {
  const s = similarite(a, b);
  return s == null ? null : Math.round((1 - s) * 1000) / 1000;
}

const OU = { haut: 'en haut', milieu: 'au milieu', bas: 'en bas' };
/** Pure : ce qui est pareil entre deux empreintes d'un mode, en mots. */
export function ceQuiEstPareil(a, b) {
  const p = a.mesures, q = b.mesures, out = [];
  if (p.h1SurImage && q.h1SurImage) out.push(`h1 sur l'image${p.positionH1 === q.positionH1 && p.positionH1 ? ' ' + OU[p.positionH1] : ''}`);
  else if (p.positionH1 && p.positionH1 === q.positionH1) out.push(`h1 ${OU[p.positionH1]}${!p.h1SurImage && !q.h1SurImage ? ' hors de l\'image' : ''}`);
  if (p.carte && q.carte) out.push(p.carteSurImage && q.carteSurImage ? 'carte posée sur l\'image' : 'carte posée');
  if (p.telSousH1 && q.telSousH1) out.push('numéro sous le h1');
  if (p.barreBas && q.barreBas) out.push(p.boutonsBarre === q.boutonsBarre && p.boutonsBarre ? `barre basse à ${p.boutonsBarre} bouton${p.boutonsBarre > 1 ? 's' : ''}` : 'barre basse');
  if (p.partImage > 0.5 && q.partImage > 0.5) out.push('image sur plus de la moitié de l\'écran');
  else if (p.partImage < 0.05 && q.partImage < 0.05) out.push('pas d\'image');
  if (p.colonnesTexte >= 2 && p.colonnesTexte === q.colonnesTexte) out.push(`${p.colonnesTexte} colonnes de texte`);
  out.push(`${Math.round(accordGrille(a, b) * 100)} % de la grille au même rôle`);
  return out.join(', ');
}

/** Pure : verdict d'une empreinte de site contre le registre (liste d'empreintes de sites). */
export function verdict(cible, registre, seuil = SEUIL_RESSEMBLANCE) {
  const proches = [];
  for (const e of registre) {
    if (e.slug === cible.slug) continue;
    const m = cible.m && e.m ? similarite(cible.m, e.m) : null;
    const d = cible.d && e.d ? similarite(cible.d, e.d) : null;
    const max = Math.max(m ?? 0, d ?? 0);
    const trop = (m ?? 0) > seuil || (d ?? 0) > seuil;
    const pareil = trop ? [m > seuil ? `téléphone : ${ceQuiEstPareil(cible.m, e.m)}` : null, d > seuil ? `ordinateur : ${ceQuiEstPareil(cible.d, e.d)}` : null].filter(Boolean) : [];
    proches.push({ slug: e.slug, m, d, max, trop, pareil });
  }
  proches.sort((x, y) => y.max - x.max || (y.m ?? 0) - (x.m ?? 0));
  return { slug: cible.slug, seuil, proches, echec: proches.some((p) => p.trop) };
}

/** Pure : toutes les paires trop proches d'un registre. */
export function pairesTropProches(registre, seuil = SEUIL_RESSEMBLANCE) {
  const out = [];
  for (let i = 0; i < registre.length; i++) for (let j = i + 1; j < registre.length; j++) {
    const a = registre[i], b = registre[j];
    const m = a.m && b.m ? similarite(a.m, b.m) : null, d = a.d && b.d ? similarite(a.d, b.d) : null;
    if ((m ?? 0) > seuil || (d ?? 0) > seuil) out.push({ a: a.slug, b: b.slug, m, d, pareil: ceQuiEstPareil((m ?? 0) > seuil ? a.m : a.d, (m ?? 0) > seuil ? b.m : b.d) });
  }
  return out.sort((x, y) => Math.max(y.m ?? 0, y.d ?? 0) - Math.max(x.m ?? 0, x.d ?? 0));
}

/** Pure : la grille en texte (une lettre par rôle), pour lire une empreinte d'un coup d'œil. */
const LETTRE = { '': '.', image: 'I', carte: 'C', nav: 'N', 'barre-bas': 'B', texte: 't', actions: 'a', telephone: 'T', titre: 'H' };
export function grilleTexte(g, cols = COLS) {
  const lignes = [];
  for (let i = 0; i < g.length; i += cols) lignes.push(g.slice(i, i + cols).map((x) => LETTRE[x] ?? '?').join(''));
  return lignes.join('\n');
}

/* ---------- registre ---------- */

export function lireRegistre(dir = REGISTRE) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => { try { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { return null; } }).filter((e) => e?.slug && !e.slug.startsWith('_'));
}

function ecrireEmpreinte(e) {
  fs.mkdirSync(REGISTRE, { recursive: true });
  fs.writeFileSync(path.join(REGISTRE, `${e.slug}.json`), JSON.stringify(e, null, 1) + '\n');
}

/* ---------- navigateur ---------- */

async function lancerChrome(chromium) {
  for (let essai = 1; ; essai++) {
    try { return await chromium.launch({ channel: process.env.FF_CHROMIUM ? undefined : 'chrome', headless: true }); }
    catch (e) {
      if (essai >= 3) throw e;
      warn(`Chrome n'a pas démarré (${e.message.split('\n')[0]}) : nouvel essai dans 30 s.`);
      await new Promise((r) => setTimeout(r, 30_000));
    }
  }
}

/** Empreintes (téléphone + ordinateur) de sites construits, un seul Chrome, une page à la fois. */
export async function calculerEmpreintes(slugs, { ecrire = true } = {}) {
  const require = createRequire(import.meta.url);
  const { chromium } = require('playwright-core');
  const sharp = require('sharp');
  fs.mkdirSync(CAPTURES, { recursive: true });
  const browser = await lancerChrome(chromium);
  const out = [];
  try {
    for (const slug of slugs) {
      if (!fs.existsSync(path.join(DIST_DIR, slug, 'index.html'))) { warn(`${slug} : dist absent (build en cours ?), sauté.`); continue; }
      const srv = servir(path.join(DIST_DIR, slug));
      await new Promise((r) => srv.listen(0, '127.0.0.1', r));
      const e = { slug, date: new Date().toISOString().slice(0, 10), version: 1 };
      try {
        for (const [k, M] of Object.entries(MODES)) {
          const ctx = await browser.newContext({ viewport: { width: M.vw, height: M.vh }, isMobile: M.mobile, hasTouch: M.mobile, deviceScaleFactor: 1 });
          const page = await ctx.newPage();
          try {
            await page.goto(`http://127.0.0.1:${srv.address().port}/`, { waitUntil: 'load', timeout: 60_000 }).catch(() => {});
            await page.waitForTimeout(ATTENTE);
            const rel = await page.evaluate(releverPremierEcran);
            e[k] = empreinteMode(rel);
            const png = await page.screenshot().catch(() => page.screenshot());
            await sharp(png).jpeg({ quality: 72 }).toFile(path.join(CAPTURES, `${slug}-${k}.jpg`));
          } finally {
            await ctx.close();
          }
        }
      } finally {
        srv.close();
      }
      if (ecrire) ecrireEmpreinte(e);
      out.push(e);
    }
  } finally {
    await browser.close();
  }
  return out;
}

/** Distances de mise en page (1 − la plus forte ressemblance, téléphone ou ordinateur) entre sites construits,
 *  clé « a|b » dans l'ordre donné ; utilisé par `ff pistes` pour l'axe « entrée ». Écrit aussi le registre. */
export async function distancesMiseEnPage(slugs) {
  const e = await calculerEmpreintes(slugs);
  const out = {};
  for (let i = 0; i < e.length; i++) for (let j = i + 1; j < e.length; j++) {
    const s = Math.max(similarite(e[i].m, e[j].m) ?? 0, similarite(e[i].d, e[j].d) ?? 0);
    out[`${e[i].slug}|${e[j].slug}`] = Math.round((1 - s) * 1000) / 1000;
  }
  return out;
}

/* ---------- planche ---------- */

const COULEUR = { '': '#f4f4f4', image: '#7a9cc6', carte: '#e9d8a6', nav: '#555', 'barre-bas': '#333', texte: '#bbb', actions: '#e07a5f', telephone: '#c0392b', titre: '#111' };
function schema(g, larg, haut) {
  const cw = larg / COLS, ch = haut / ROWS;
  const rects = g.map((r, i) => `<rect x="${(i % COLS) * cw}" y="${Math.floor(i / COLS) * ch}" width="${cw}" height="${ch}" fill="${COULEUR[r] ?? '#f0f'}" stroke="#fff" stroke-width="1"/>`).join('');
  return Buffer.from(`<svg width="${larg}" height="${haut}" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`);
}

async function planche(cible, proches, sharp) {
  const L = 260, H = Math.round(L * 844 / 390), E = 22;
  const colonne = async (slug, empreinte, label) => {
    const cap = path.join(CAPTURES, `${slug}-m.jpg`);
    const fond = fs.existsSync(cap) ? await sharp(cap).resize(L, H, { fit: 'cover', position: 'top' }).png().toBuffer() : await sharp(schema(empreinte.grille, L, H)).png().toBuffer();
    const eti = Buffer.from(`<svg width="${L}" height="${E}"><rect width="${L}" height="${E}" fill="#ff0"/><text x="4" y="15" font-size="12" font-family="Arial">${label.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text></svg>`);
    return sharp({ create: { width: L, height: H + E, channels: 3, background: '#fff' } }).composite([{ input: eti, top: 0, left: 0 }, { input: fond, top: E, left: 0 }]).png().toBuffer();
  };
  const cols = [await colonne(cible.slug, cible.m, `${cible.slug} (ce site)`)];
  for (const p of proches.slice(0, 3)) cols.push(await colonne(p.slug, p.empreinte.m, `${p.slug} · tél. ${p.m?.toFixed(2) ?? '?'} · ordi. ${p.d?.toFixed(2) ?? '?'}`));
  fs.mkdirSync(path.join(ROOT, 'captures', 'planches'), { recursive: true });
  const sortie = path.join(ROOT, 'captures', 'planches', `${cible.slug}-ressemblance.jpg`);
  await sharp({ create: { width: cols.length * (L + 6), height: H + E, channels: 3, background: '#777' } }).composite(cols.map((input, i) => ({ input, left: i * (L + 6), top: 0 }))).jpeg({ quality: 78 }).toFile(sortie);
  return path.relative(ROOT, sortie);
}

/* ---------- commande ---------- */

const construits = () => listSites({ excludeUnderscore: true }).filter((s) => fs.existsSync(path.join(DIST_DIR, s, 'index.html')));

export async function cmdRessemblance(args) {
  const { positional, flags } = parseArgs(args);
  const seuil = flags.seuil != null && flags.seuil !== true ? Number(flags.seuil) : SEUIL_RESSEMBLANCE;
  const existants = new Set(listSites());
  const registre = lireRegistre().filter((e) => existants.has(e.slug));
  let nouvelles;
  if (flags.registre) {
    // Sans Chrome ni build : les empreintes versionnées suffisent (veille en ligne, autre poste).
    const voulus = flags.tous ? registre.map((e) => e.slug) : (positional.length ? positional : [undefined]).map((s) => resolveSlug(s));
    nouvelles = voulus.map((s) => registre.find((e) => e.slug === s)).filter(Boolean);
    const manquants = voulus.filter((s) => !nouvelles.some((e) => e.slug === s));
    if (manquants.length) { fail(`pas d'empreinte dans docs/empreintes/ pour ${manquants.join(', ')} : lancer \`ff ressemblance <slug>\` sur un poste avec Chrome.`); process.exit(1); }
    info(`Registre seul (sans Chrome) : ${registre.length} empreintes.`);
  } else {
    const slugs = flags.tous ? construits() : (positional.length ? positional : [undefined]).map((s) => resolveSlug(s));
    const absents = slugs.filter((s) => !fs.existsSync(path.join(DIST_DIR, s, 'index.html')));
    if (absents.length) { fail(`dist absent pour ${absents.join(', ')} : lance d'abord \`ff build <slug>\`.`); process.exit(1); }
    info(`Empreinte du premier écran (téléphone puis ordinateur) : ${slugs.length} site(s)…`);
    nouvelles = await calculerEmpreintes(slugs);
  }
  const parSlug = new Map(registre.map((e) => [e.slug, e]));
  for (const e of nouvelles) parSlug.set(e.slug, e);
  const tout = [...parSlug.values()];
  const require = createRequire(import.meta.url);
  const sharp = require('sharp');
  let echec = false;

  if (flags.tous) {
    const paires = pairesTropProches(tout, seuil);
    info(`Registre : ${tout.length} sites (docs/empreintes/), seuil ${seuil}.`);
    for (const p of paires) fail(`${p.a} / ${p.b} : tél. ${p.m?.toFixed(2)} · ordi. ${p.d?.toFixed(2)} — ${p.pareil}`);
    if (paires.length) { echec = true; fail(`${paires.length} paire(s) de sites trop proches par la mise en page du premier écran.`); }
    else ok('Aucune paire de sites ne dépasse le seuil.');
  } else {
    for (const e of nouvelles) {
      const v = verdict(e, tout, seuil);
      info(`\n${e.slug} — h1 « ${e.m.h1Texte ?? '?'} »\n${grilleTexte(e.m.grille).split('\n').map((l) => '  ' + l).join('\n')}`);
      for (const p of [...v.proches.filter((x) => x.trop), ...v.proches.filter((x) => !x.trop).slice(0, 3)]) (p.trop ? fail : ok)(`${p.slug.padEnd(26)} tél. ${p.m?.toFixed(2) ?? '—'} · ordi. ${p.d?.toFixed(2) ?? '—'}${p.trop ? '  ' + p.pareil.join(' | ') : ''}`);
      // Planche au téléphone : les trois plus proches AU TÉLÉPHONE (ce que voit le fondateur sur son écran).
      const plan = await planche(e, [...v.proches].sort((x, y) => (y.m ?? 0) - (x.m ?? 0)).map((p) => ({ ...p, empreinte: parSlug.get(p.slug) })), sharp);
      info(`Planche : ${plan} (ce site à gauche, les trois plus proches au téléphone à droite).`);
      if (v.echec) { echec = true; fail(`${e.slug} ressemble trop à ${v.proches.filter((p) => p.trop).map((p) => p.slug).join(', ')} (seuil ${seuil}) : réinventer le premier écran (SKILL.md § 1bis).`); }
      else ok(`${e.slug} : aucun site du registre au-dessus de ${seuil}.`);
    }
  }
  if (echec) process.exitCode = 1;
}
