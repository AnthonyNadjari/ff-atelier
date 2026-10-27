// `ff melanger <slug> [--typo <id>] [--couleurs <id>] [--photos <id>] [--mouvement <id>] [--formes <id>]
//   [--densite <id>] [--matiere <id>] [--architecture <id>] [--premier-ecran <famille>] [--style <id>]
//   [--hasard] [--graine <n>] [--n 3] [--essai] [--simuler] [--video client|animer|banque]`
//
// CROISE les atomes de style des vrais sites étudiés (docs/veille/styles/atomes/<id>.json, format :
// docs/veille/styles/ATOMES.md) : la typographie d'un site, les couleurs d'un autre, les photos d'un troisième…
// Chaque atome non imposé est tiré parmi le registre sous CONTRAINTES (fonctions pures ci-dessous, testées par
// tests/melanger.test.mjs) : contraste AA calculé, rôles de polices cohérents, photos compatibles avec celles du
// client, mouvement « calme » si l'aiguillage le dit, famille de premier écran et architecture libres (ni celles des
// pistes sœurs ni celles des 4 derniers sites), et JAMAIS deux fois la même combinaison (registre
// docs/empreintes/melanges.json : un mélange qui partage plus de 3 atomes avec un site existant est refusé).
// GARDE DE BEAUTÉ (18 oct 2026, L'Épi d'Or d « juste un peu moche ») : un mélange lisible mais laid est refusé aussi
// (fond vif, capitales condensées sur fond coloré, aplats vifs concurrents, vibration, trop de teintes, photos sombres
// nues sur blanc froid ; règles en OKLCH, docs/veille/styles/ATOMES.md § Garde de beauté). Le mouvement tire un PROFIL
// (docs/veille/styles/MOUVEMENTS.md) : fond vidéo seulement avec une vraie vidéo ou --video animer|banque prévu.
//
// Sortie (un mélange appliqué à <slug>) : une direction générée src/directions/m-<hash>/ (index.css : tous les tokens ;
// meta.ts : les atomes et leurs sources), enregistrée dans DIRECTIONS (src/lib/schema.ts) ; sites/<slug>/look.json
// (direction, polices, accent, motion, tone) ; la ligne « Style : mélange <…> » à recopier dans le contrat.
// --n 3 : trois mélanges qui ne partagent pas plus de 2 atomes entre eux (les trois pistes d'un client), de régimes de
// palette différents (RÉGIMES DE PALETTE ci-dessous) ; avec --essai, appliqués à trois copies jetables
// sites/_essai-melange-<k> (direction, architecture et famille de premier écran quand l'usine sait les rendre)
// construites, contrôlées puis capturées côte à côte (captures/planches/<slug>-melanges.jpg), copies et directions
// d'essai supprimées à la fin. Architectures : seulement celles du registre de l'usine (src/lib/architectures.ts, lu au
// tirage, jamais modifié ici) dont la coquille existe et dont le client a les données.
//
// Pourquoi (fondateur, 18 oct 2026) : « il en faut beaucoup plus. Et je veux pas qu'on se limite à ça, faut faire des
// cross ».
import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'node:http';
import { ROOT, SITES_DIR, DIST_DIR, FF_CURRENT, ok, fail, info, warn, parseArgs, siteExists, runAstro } from './util.mjs';
import { mulberry32, seedFromString } from './look-data.mjs';
import {
  A_JUGER, DIMENSIONS, DIMENSIONS_VALEURS, DOSSIER_ATOMES, lireAtomes, validerAtomes, controlerPolices, paletteComplete,
  policesDuRegistre, contraste, hexVersHsl, hslVersHex, estSombre, hexVersOklch, ecartTeinte, GENRES,
} from './atomes.mjs';
import { PROFILS_MOUVEMENT, refusProfil, profilsTropProches, consignesProfil } from './mouvements.mjs';
import { CLES_IA } from './ia.mjs';
import { famillesConnues, familleDuContrat, famillesInterdites } from './contrat.mjs';

export const REGISTRE_MELANGES = path.join(ROOT, 'docs', 'empreintes', 'melanges.json');
export const MAX_PARTAGES_SITE = 3; // un mélange qui partage plus de 3 atomes avec un site existant est refusé
export const MAX_PARTAGES_PISTES = 2; // trois pistes d'un client ne partagent pas plus de 2 atomes deux à deux
export const LARGEUR_PLEIN_CADRE = 1600; // « plein cadre » demande au moins une photo du client de 1 600 px
const MARQUEUR_DIRECTIONS = '  // ff melanger : directions générées';
const TOUS_ATOMES = DIMENSIONS; // typo … matiere, architecture, premier_ecran

/* =====================================================================
   CONTRAINTES (pures)
   ===================================================================== */

/**
 * Le client tel que les contraintes le lisent. `tonPhotos` = { clarte (L* médiane, 0-100), chaleur (R - B médian) } de
 * ses photos, ou null ; `video` = 'client' (sa vraie vidéo) | 'animer' (ff animer prévu) | 'banque' (ff video prévu,
 * jamais présentée comme la sienne) | null.
 */
export function profilClient({ photos = 0, largeurMax = 0, mouvement = null, avis = 0, urgence = false, tonPhotos = null, video = null } = {}) {
  return { photos, largeurMax, mouvement, avis, urgence, tonPhotos, video };
}

/** Pure : l'atome photos convient-il aux photos du client ? Renvoie la raison du refus, ou null. */
export function refusPhotos(photos, client) {
  if (!photos) return null;
  if (photos.traitement === 'plein-cadre' && client.largeurMax < LARGEUR_PLEIN_CADRE) {
    return `plein cadre sans photo du client de ${LARGEUR_PLEIN_CADRE} px (la plus large : ${client.largeurMax || 0} px)`;
  }
  return null;
}

/** Pure : l'atome mouvement convient-il à l'aiguillage ? (« calme » : régime calme, rien ne suit le défilement). */
export function refusMouvement(mouvement, client) {
  if (!mouvement) return null;
  if (client.mouvement === 'calme') {
    if (mouvement.regime !== 'calme') return `client « calme » : mouvement ${mouvement.regime}`;
    if (mouvement.defilement === 'suit-le-defilement') return 'client « calme » : un élément suit le défilement';
  }
  // Profil (docs/veille/styles/MOUVEMENTS.md) : fond vidéo seulement avec une vraie vidéo ou ff animer / ff video
  // prévu, séquence avec une vidéo ou une photo de 1 920 px, compteur avec un vrai chiffre.
  if (mouvement.profil && mouvement.profil !== A_JUGER) return refusProfil(mouvement.profil, client);
  return null;
}

/**
 * Données qu'une famille de premier écran demande (colonne « Quand » de premiers-ecrans.md) : sans elles, la famille
 * n'est pas tirée. Famille absente de cette table = aucune exigence.
 */
export const EXIGENCES_FAMILLES = {
  'carte-sur-photo': (c) => c.largeurMax >= LARGEUR_PLEIN_CADRE || 'une photo forte et large (1 600 px)',
  diptyque: (c) => c.photos >= 1 || 'au moins une photo (portrait ou verticale)',
  mosaique: (c) => c.photos >= 8 || '8 photos ou plus',
  'bande-defilante': (c) => c.photos >= 6 || 'des produits nombreux en photo (6 et plus)',
  'video-ou-sequence': (c) => c.photos >= 6 || 'une vidéo ou une série de photos du même geste',
  'preuve-d-abord': (c) => c.avis >= 50 || '50 avis et plus',
  'numero-geant': (c) => c.urgence || 'un métier d\'urgence',
};
export function refusFamille(famille, client) {
  const f = EXIGENCES_FAMILLES[famille];
  if (!f) return null;
  const r = f(client);
  return r === true ? null : `${famille} demande ${r}`;
}

/** Pure : combien d'atomes deux mélanges partagent (même source pour la même dimension). */
export function partages(a, b) {
  return TOUS_ATOMES.filter((d) => a[d] != null && b[d] != null && a[d] === b[d]).length;
}

/* ---------- GARDE DE BEAUTÉ (pure ; règles et raisons : docs/veille/styles/ATOMES.md § Garde de beauté) ----------
   Née de L'Épi d'Or d (m-cca519, 18 oct 2026 : « juste un peu moche ») : jaune d'or plein sur toute la page, Bebas
   Neue en capitales, encre brune, boutons rouge-orangé, vert en second accent. Chaque couleur était lisible (AA), le
   tout était laid. Les seuils sont en OKLCH (chroma perçue, pas la saturation HSL) et calés sur les palettes mesurées
   du registre : tous les fonds de vrais sites sont sous 0,04 de chroma, sauf celui de Café Binocle (0,14). */
export const BEAUTE = {
  FOND_VIF_CLAIR: 0.08, // chroma d'un fond clair (L ≥ 0,5) au-delà de laquelle c'est un aplat vif, plus un neutre teinté
  FOND_VIF_SOMBRE: 0.13, // fond sombre : bleu nuit, vert bouteille passent (≤ 0,09 mesurés), un bleu électrique non
  FOND_TEINTE: 0.045, // au-delà d'un neutre teinté (kraft, crème) : le fond « a une couleur »
  VIF: 0.12, // une couleur d'aplat (bouton, second accent) « vive »
  ACTIVE: 0.04, // une couleur qui compte comme teinte active (sinon : un neutre)
  MAX_VIVES: 2, // aplats vifs concurrents au plus (fond, surface, bouton, second accent)
  MAX_TEINTES: 3, // familles de teintes actives au plus sur la page (60-30-10 : trois rôles)
  GROUPE_TEINTE: 30, // deux teintes à moins de 30° sont une même famille (analogues)
  VIBRATION_DL: 0.1, // deux vives de même clarté (ΔL < 0,1) et de teintes éloignées vibrent à leur frontière (Albers)
  VIBRATION_DH: 40,
};
const okl = (hex) => hexVersOklch(hex);
const estHex = (v) => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);
/** Pure : le fond est-il un aplat vif (chroma élevée pour sa clarté) ? */
export function fondVif(hex) {
  const o = okl(hex);
  return o.c >= (o.l >= 0.5 ? BEAUTE.FOND_VIF_CLAIR : BEAUTE.FOND_VIF_SOMBRE);
}

/**
 * Pure : la palette d'un atome couleurs tient-elle en grand ? (Règles qui ne dépendent que des couleurs : appliquées
 * dès la lecture du registre.) Renvoie la liste des raisons de refus.
 */
export function refusPalette(couleurs) {
  const r = [];
  const p = couleurs?.[couleurs?.principal];
  if (!p || !estHex(p.fond)) return r;
  const fond = okl(p.fond);
  // B1 : aplat vif en fond de page. La direction générée peint --bg sous TOUTE la page : la couleur dominante (60 %)
  // doit être un neutre, éventuellement teinté ; la couleur vive se garde aux petites surfaces (10 %).
  if (fondVif(p.fond)) r.push(`fond de page vif ${p.fond} (chroma OKLCH ${fond.c.toFixed(2)} ≥ ${fond.l >= 0.5 ? BEAUTE.FOND_VIF_CLAIR : BEAUTE.FOND_VIF_SOMBRE}) : un aplat saturé sur toute la page fatigue l'œil et écrase les photos`);
  // B3 : aplats vifs concurrents (fond, surface, bouton = accent mesuré, second accent).
  const roles = [['fond', p.fond], ['surface', p.surface], ['bouton', p.accent], ['second accent', p.accent2]].filter(([, v]) => estHex(v));
  const vives = roles.filter(([k, v]) => (k === 'fond' || k === 'surface' ? fondVif(v) : okl(v).c >= BEAUTE.VIF)).map(([k, v]) => ({ k, v, o: okl(v) }));
  if (vives.length > BEAUTE.MAX_VIVES) r.push(`${vives.length} aplats vifs concurrents (${vives.map((x) => `${x.k} ${x.v}`).join(', ')}) : ${BEAUTE.MAX_VIVES} au plus, le reste en neutres`);
  else if (vives.length > 1 && vives.some((x) => x.k === 'fond' || x.k === 'surface')) r.push(`fond vif et ${vives.filter((x) => x.k !== 'fond' && x.k !== 'surface').map((x) => x.k).join(', ')} vif : deux couleurs fortes se disputent la page`);
  // B4 : vibration. Deux vives de même clarté et de teintes éloignées vibrent à leur frontière (Albers, « Interaction
  // of Color ») : un bouton rouge-orangé contre un vert de même valeur.
  for (let i = 0; i < vives.length; i++) for (let j = i + 1; j < vives.length; j++) {
    const a = vives[i], b = vives[j];
    if (Math.abs(a.o.l - b.o.l) < BEAUTE.VIBRATION_DL && ecartTeinte(a.o.h, b.o.h) >= BEAUTE.VIBRATION_DH) r.push(`${a.k} ${a.v} et ${b.k} ${b.v} vibrent (même clarté, ΔL ${Math.abs(a.o.l - b.o.l).toFixed(2)}, teintes à ${Math.round(ecartTeinte(a.o.h, b.o.h))}°)`);
  }
  // B5 : nombre de teintes actives. Au-delà de trois familles de teintes (fond, texte, accents, encre), la page n'a
  // plus de dominante (règle 60-30-10 ; Itten, contraste de quantité).
  const actives = Object.values(p).filter(estHex).map(okl).filter((o) => o.c >= BEAUTE.ACTIVE);
  const familles = [];
  for (const o of actives) if (!familles.some((h) => ecartTeinte(h, o.h) < BEAUTE.GROUPE_TEINTE)) familles.push(o.h);
  if (familles.length > BEAUTE.MAX_TEINTES) r.push(`${familles.length} familles de teintes actives (${familles.map((h) => `${Math.round(h)}°`).join(', ')}) : ${BEAUTE.MAX_TEINTES} au plus`);
  return r;
}

/** Police de titre condensée (genre `condensee` de GENRES, ou « Condensed » dans la clé). */
const condensee = (cle) => GENRES[cle] === 'condensee' || /condensed/i.test(cle || '');

/**
 * Pure : la GARDE DE BEAUTÉ d'un mélange (contenus des atomes + client) : ce qu'un mélange lisible peut encore avoir
 * de laid. Renvoie la liste des raisons de refus. (L'accord titre/texte en conflit est refusé plus tôt, dans
 * controlerPolices d'atomes.mjs, B6.)
 */
export function refusBeaute(atomes, client = profilClient()) {
  const r = [];
  const t = atomes.typo, c = atomes.couleurs, ph = atomes.photos, f = atomes.formes, mt = atomes.matiere;
  const p = c && c !== A_JUGER ? c[c.principal] : null;
  if (p) r.push(...refusPalette(c));
  // B2 : capitales condensées sur fond coloré. Une condensée en capitales est une voix d'affiche ; posée sur un fond
  // qui a une couleur (au-delà du neutre teinté), la page devient une affiche de foire. Sur blanc ou crème (Coutumes,
  // Pizza Amici), elle garde sa tenue.
  if (t && t !== A_JUGER && p && estHex(p.fond) && t.titre?.casse === 'uppercase' && condensee(t.titre.libre) && okl(p.fond).c >= BEAUTE.FOND_TEINTE) {
    r.push(`capitales condensées (${t.titre.libre}) sur un fond coloré ${p.fond} (chroma ${okl(p.fond).c.toFixed(2)} ≥ ${BEAUTE.FOND_TEINTE}) : effet affiche`);
  }
  // B7 : photos sombres et chaudes posées nues sur un blanc froid. Le contraste simultané les assombrit encore (des
  // trous dans la page) ; un passe-partout, un fond chaud, le plein cadre ou le noir et blanc les tiennent. Vignettes
  // sans ombre ni filet seulement : le masque, le cadre et le plein cadre passent.
  const ton = client.tonPhotos;
  if (ton && p && estHex(p.fond) && ph && ph !== A_JUGER && ph.traitement === 'vignette' && ton.clarte < 55 && ton.chaleur > 15) {
    const o = okl(p.fond);
    const sansAppui = (!f || f === A_JUGER || f.ombre === 'aucune') && (!mt || mt === A_JUGER || mt.filets === 'aucun');
    if (o.l >= 0.97 && o.c < 0.015 && sansAppui) r.push(`photos sombres et chaudes (L* ${Math.round(ton.clarte)}) en vignettes nues sur un blanc froid ${p.fond} : il leur faut un cadre, un fond chaud ou le plein cadre`);
  }
  return r;
}

/**
 * Pure : règles de compatibilité ENTRE atomes, apprises en regardant des mélanges (docs/veille/styles/ATOMES.md
 * § Règles apprises). `atomes` = { typo, couleurs, … } (contenus, pas ids). Renvoie la liste des raisons de refus.
 */
export function refusCroises(atomes, client = profilClient()) {
  const r = [...refusBeaute(atomes, client)];
  const t = atomes.typo, c = atomes.couleurs, d = atomes.densite;
  // A PRIORI (pas encore vu sur un essai) : titre maigre (≤ 300) sur un contraste texte/fond faible, le trait disparaît.
  if (t && c) {
    const pal = c[c.principal];
    if (pal && (t.titre?.graisse ?? 400) <= 300 && contraste(pal.texte, pal.fond) < 7) r.push(`titre en ${t.titre.graisse} sur un contraste de ${contraste(pal.texte, pal.fond).toFixed(1)}:1 (< 7)`);
  }
  // A PRIORI (pas encore vu sur un essai) : très grand titre (≥ 140 px à l'ordinateur) dans une page serrée (marge de
  // section < 64 px) : le titre écrase tout.
  if (t && d && d !== A_JUGER && typeof t.echelle?.h1 === 'object' && t.echelle.h1.ordinateur >= 140 && d.section?.ordinateur < 64) r.push('très grand titre dans une page serrée');
  return r;
}

/* ---------- RÉGIMES DE PALETTE (pur ; docs/veille/styles/ATOMES.md § Régimes de palette) ----------
   Né de l'essai du 21 oct 2026 (`ff melanger prospect-epi-dor --n 3 --essai`) : les trois pistes tiraient trois
   palettes blanc / gris / noir. La garde de beauté écarte le vif en fond (à raison) et la plupart des palettes du
   registre sont des neutres clairs : tirées au hasard, trois pistes sœurs se ressemblent. On ne relâche PAS la garde :
   on cherche la couleur là où elle la permet (surface, bloc d'encre, accents, fond sombre, fond teinté) et on exige que
   les pistes sœurs ne tombent pas dans le même RÉGIME. Mesures en OKLCH, comme la garde. */
export const REGIMES_PALETTE = {
  'clair-neutre': 'clair neutre', // fond blanc ou gris sans teinte perçue
  'clair-teinte': 'clair teinté doux', // crème, ivoire, kraft, sauge pâle : le fond a une teinte, sous le seuil « coloré »
  sombre: 'sombre', // fond sombre (noir, bleu nuit, brun)
  'colore-doux': 'coloré doux', // la couleur tient une grande surface DANS les règles : fond modéré, surface ou bloc d'encre colorés, deux accents assumés
};
export const DIVERSITE = {
  FOND_SOMBRE_L: 0.5, // clarté OKLCH du fond sous laquelle la page est sombre
  FOND_TEINTE_MIN: 0.012, // chroma du fond à partir de laquelle sa teinte se voit (crème, kraft) ; en dessous : neutre
  SURFACE_COLOREE: 0.03, // une surface (cartes, bandes) colorée à partir de cette chroma
  ENCRE_COLOREE: 0.04, // un bloc d'encre (pied, bandeau) coloré à partir de cette chroma
  ECART_FOND_L: 0.04, // pistes sœurs : clartés de fond à 0,04 au moins (jamais deux fonds de clarté proche)
  ECART_ACCENT: 45, // pistes sœurs : teintes d'accent à 45° au moins (deux accents neutres sont trop proches)
  BESOIN_PART: 0.5, // un régime sous la moitié de sa part égale des palettes tirables est un besoin de collecte
  BESOIN_MIN: 3, // et jamais moins de 3 palettes par régime
};

/**
 * Pure : le régime d'une palette (atome couleurs, palette principale) et ce qui le fixe. Renvoie
 * { regime, fond: {l,c,h}, teinte (teinte d'accent en degrés, null = accents neutres), raison } ou null.
 */
export function regimePalette(couleurs) {
  const p = couleurs?.[couleurs?.principal];
  if (!p || !estHex(p.fond)) return null;
  const fond = okl(p.fond);
  const o = (v) => (estHex(v) ? okl(v) : null);
  const accents = [p.accent, p.accent2].map(o).filter((x) => x && x.c >= BEAUTE.ACTIVE).sort((a, b) => b.c - a.c);
  const autres = [p.surface, p.encre, p.fond].map(o).filter((x) => x && x.c >= BEAUTE.ACTIVE).sort((a, b) => b.c - a.c);
  const teinte = accents[0]?.h ?? autres[0]?.h ?? null;
  const out = (regime, raison) => ({ regime, fond, teinte, raison });
  if (fond.l < DIVERSITE.FOND_SOMBRE_L) return out('sombre', `fond ${p.fond} de clarté ${fond.l.toFixed(2)}`);
  const surf = o(p.surface), encre = o(p.encre);
  const vives = [p.accent, p.accent2].map(o).filter((x) => x && x.c >= BEAUTE.VIF);
  if (fond.c >= BEAUTE.FOND_TEINTE) return out('colore-doux', `fond ${p.fond} coloré (chroma ${fond.c.toFixed(3)}, sous la garde)`);
  if (surf && surf.c >= DIVERSITE.SURFACE_COLOREE) return out('colore-doux', `surface ${p.surface} colorée (chroma ${surf.c.toFixed(3)})`);
  if (encre && encre.c >= DIVERSITE.ENCRE_COLOREE) return out('colore-doux', `bloc d'encre ${p.encre} coloré (chroma ${encre.c.toFixed(3)})`);
  if (vives.length === 2 && ecartTeinte(vives[0].h, vives[1].h) >= BEAUTE.GROUPE_TEINTE) return out('colore-doux', `deux accents vifs assumés ${p.accent} et ${p.accent2}`);
  if (fond.c >= DIVERSITE.FOND_TEINTE_MIN) return out('clair-teinte', `fond ${p.fond} teinté (chroma ${fond.c.toFixed(3)})`);
  return out('clair-neutre', `fond ${p.fond} neutre (chroma ${fond.c.toFixed(3)})`);
}

/**
 * Pure : interlignage du titre d'un mélange, à partir de celui mesuré sur la source (nombre, sinon 1,05) et de sa casse.
 * Règle apprise (essai du 18 oct 2026, mélange m-061ddd) : l'interlignage de 0,78 mesuré sur salo, appliqué à Oswald (la
 * police libre qui la remplace), faisait se chevaucher les lignes du titre : la police de remplacement n'a pas les
 * métriques de l'originale. Règle apprise (essai du 23 oct 2026, style her) : en capitales, 1,0 ne suffit pas non plus
 * en français : les accents des capitales (È, À, É) touchent la ligne du dessus (« DEUXIÈME » sous « MATIN, ET UNE »).
 * Règle apprise (essai du 25 oct 2026, style androuet, m-f5804d) : 1,5 relevé sur la source (où le h1 est une ligne de
 * 16 px et les vrais titres sont des h2) ouvrait un trou entre les trois lignes du h1 de 40 px : plafond 1,3.
 * Plancher 1,1 en capitales, 1 sinon ; plafond 1,3.
 */
export function interlignageTitre(mesure, casse) {
  const lh = typeof mesure === 'number' ? mesure : 1.05;
  return casse === 'uppercase' ? borne(lh, 1.1, 1.3) : borne(lh, 1, 1.3);
}

/**
 * Pure : casse du titre d'un mélange. Règle apprise (essai du 24 oct 2026, `ff melanger demo-boulangerie --style blenheim
 * --essai`, mélange m-198731) : la casse `capitalize` mesurée sur un site anglais (une majuscule à chaque mot, « title
 * case ») donnait « Le Pain Du Matin, Et Une Deuxième Fournée » : en français, un titre ne prend la majuscule qu'au
 * premier mot et aux noms propres. `capitalize` devient `none` ; les capitales (`uppercase`) restent.
 */
export function casseTitre(casse) {
  if (!casse || casse === A_JUGER || casse === 'capitalize') return 'none';
  return casse;
}

/**
 * Pure : casse du h1 d'un mélange. Règle apprise (essais du 26 oct 2026, `ff melanger demo-boulangerie --style <id> --essai`,
 * styles thepalomar m-d5bbb3, cafedeflore m-92c906, bobbobricard m-317021, lesdeuxmagots m-a76889) : les capitales mesurées
 * sur ces sites habillent des titres de un à trois mots (« RESERVATIONS & WALK-INS », « LES DEUX MAGOTS ») ; posées sur le
 * h1 français d'une phrase (métier, ville, GOUT § 0), elles le cassaient en quatre à six lignes à l'ordinateur (plafond :
 * deux ou trois, GOUT § 8) même avec l'interlettrage resserré. Le h1 repasse en casse normale ; les h2 et h3, étiquettes
 * courtes, gardent les capitales du style.
 */
export function casseH1(casse) {
  return casse === 'uppercase' ? 'none' : casseTitre(casse);
}

/** Rapport minimal entre un h2 et le texte courant (quarte, 4:3) ; plafond du h2 par rapport au h1. */
export const H2_SUR_TEXTE = 1.33;
export const H2_SUR_H1 = 0.75;

/**
 * Pure : taille du h2 d'un mélange (px, par appareil), tenue entre le texte et le h1. Règle apprise (26 oct 2026, soir) :
 * - `ff melanger demo-boulangerie --style handsomebrook --essai` (m-bc0514) : h2 mesuré égal au h1 (97 px, Krana Fat) ;
 *   le h1 du premier écran, plafonné par la coquille (cadre : 5,5 rem), sortait plus PETIT que « LA BOULANGERIE » :
 *   un h2 plus grand que le h1 est un signe IA (GOUT § 2) et la page n'a plus d'entrée.
 * - `ff melanger _exemple --n 3 --hasard --essai` (m-cdbbd5 typo eastfork, m-d11c9b typo ennismore) : h2 mesurés à 16-18 px
 *   (étiquettes de section sur la source) pour un texte de 16 : « L'atelier », « Nos services » se lisaient comme du texte,
 *   les sections n'avaient plus de titre.
 * Le h2 est borné entre 1,33 fois le texte et 0,75 fois le h1 (le plancher gagne si les deux se croisent).
 */
export function echelleH2(h1, h2, corps) {
  const plancher = corps * H2_SUR_TEXTE;
  const plafond = Math.max(h1 * H2_SUR_H1, plancher);
  return Math.round(borne(h2, plancher, plafond) * 10) / 10;
}

/**
 * Pure : interlettrage du titre d'un mélange (em). Règle apprise (essais du 24 oct 2026, styles hiut, lyles et wolseley,
 * mélanges m-b9c2ba, m-a6a142, m-c479f2) : des capitales espacées à 0,10-0,15 em, mesurées sur des titres de deux ou
 * trois mots (un nom de produit, « RESTAURANTS »), appliquées à un h1 français d'une phrase (métier, ville, GOUT § 0),
 * le cassaient en cinq ou six lignes et le rendaient illisible d'un coup d'œil. L'espacement des capitales se resserre
 * quand le corps grandit (un titre se compose plus serré qu'une étiquette) : plafond 0,06 em en capitales. En casse
 * normale, l'interlettrage mesuré est gardé entre -0,04 et 0,02 em.
 */
export function interlettrageTitre(mesure, casse) {
  const t = typeof mesure === 'number' ? mesure : -0.01;
  return casse === 'uppercase' ? borne(t, 0, 0.06) : borne(t, -0.04, 0.02);
}

/** Pure : écart entre deux teintes d'accent (null = accents neutres : deux neutres sont à 0°, un neutre et une teinte à 180°). */
export function ecartAccent(a, b) {
  if (a == null && b == null) return 0;
  if (a == null || b == null) return 180;
  return ecartTeinte(a, b);
}

/**
 * Niveaux d'exigence de la diversité entre pistes sœurs, du plus strict au plus lâche : le tirage ne descend d'un niveau
 * que si le registre ne permet pas le précédent, et le dit. L'écart de clarté des fonds ne se relâche jamais.
 */
export const NIVEAUX_DIVERSITE = [
  { regime: true, accent: true, nom: 'régimes différents, accents éloignés' },
  { regime: true, accent: false, nom: 'régimes différents, accent proche d\'une piste sœur (registre trop pauvre)' },
  { regime: false, accent: true, nom: 'régime répété (registre trop pauvre), accents éloignés' },
  { regime: false, accent: false, nom: 'régime et accent répétés (registre trop pauvre)' },
];

/**
 * Pure : la palette `couleurs` peut-elle être celle d'une piste dont les sœurs ont les palettes `soeurs` (atomes
 * couleurs déjà tirés), au niveau `niveau` de NIVEAUX_DIVERSITE ? Renvoie la raison du refus, ou null.
 */
export function refusDiversite(couleurs, soeurs, niveau = NIVEAUX_DIVERSITE[0]) {
  const a = regimePalette(couleurs);
  if (!a) return null;
  for (const s of soeurs) {
    const b = regimePalette(s);
    if (!b) continue;
    const dl = Math.abs(a.fond.l - b.fond.l);
    if (dl < DIVERSITE.ECART_FOND_L) return `fond de clarté proche d'une piste sœur (ΔL ${dl.toFixed(2)} < ${DIVERSITE.ECART_FOND_L})`;
    if (niveau?.regime && a.regime === b.regime) return `même régime qu'une piste sœur (${REGIMES_PALETTE[a.regime]})`;
    const da = ecartAccent(a.teinte, b.teinte);
    if (niveau?.accent && da < DIVERSITE.ECART_ACCENT) return `accent proche d'une piste sœur (${Math.round(da)}° < ${DIVERSITE.ECART_ACCENT}°)`;
  }
  return null;
}

/** Pure : nombre de palettes tirables par régime (registre construit), chaque régime présent (0 compris). */
export function compterRegimes(registre) {
  const n = Object.fromEntries(Object.keys(REGIMES_PALETTE).map((r) => [r, 0]));
  for (const id of registre.reserves.couleurs) {
    const r = regimePalette(registre.parId[id].couleurs);
    if (r) n[r.regime]++;
  }
  return n;
}

/**
 * Pure : besoins de collecte d'après le compte par régime (un régime sous la moitié de sa part égale, et sous 3, est un
 * besoin). Renvoie [{ regime, n, voulu, phrase }].
 */
export function besoinsRegimes(comptes) {
  const total = Object.values(comptes).reduce((a, b) => a + b, 0);
  const voulu = Math.max(DIVERSITE.BESOIN_MIN, Math.ceil((total / Object.keys(comptes).length) * DIVERSITE.BESOIN_PART));
  return Object.entries(comptes).filter(([, n]) => n < voulu).map(([regime, n]) => ({
    regime, n, voulu,
    phrase: `la collecte doit ramener des palettes ${REGIMES_PALETTE[regime]} (${n} tirable${n > 1 ? 's' : ''} sur ${total}, ${voulu} au moins)`,
  }));
}

const DEBUT_BESOINS = '<!-- ff melanger : besoins de collecte (bloc réécrit à chaque tirage, ne pas éditer) -->';
const FIN_BESOINS = '<!-- /ff melanger -->';
const echapper = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/**
 * Pure : le journal de veille avec le bloc « besoins de collecte » à jour, juste sous l'introduction (avant la première
 * entrée datée). Sans besoin, le bloc est retiré. Idempotent.
 */
export function noterBesoinsJournal(texte, besoins, date) {
  const t = texte.replace(new RegExp(`${echapper(DEBUT_BESOINS)}[\\s\\S]*?${echapper(FIN_BESOINS)}\\n*`), '');
  if (!besoins.length) return t;
  const bloc = `${DEBUT_BESOINS}\n**Besoins de collecte** (relevés par \`ff melanger\` le ${date} ; volet 2a quater de \`/veille\`) :\n${besoins.map((b) => `- ${b}`).join('\n')}\n${FIN_BESOINS}\n\n`;
  const i = t.search(/^## /m);
  return i < 0 ? `${t.trimEnd()}\n\n${bloc}` : t.slice(0, i) + bloc + t.slice(i);
}

/* ---------- ARCHITECTURES ET PREMIER ÉCRAN QUE L'USINE SAIT CONSTRUIRE (pur) ----------
   Essai du 21 oct 2026 : le mélange tirait des architectures du registre de VEILLE (panneaux-tranche,
   cartes-empilees-agenda, livre-ecrans…) que l'usine ne sait pas construire ; l'essai gardait alors le déroulé du site
   et les trois pistes se ressemblaient. On ne tire plus que le registre de l'USINE (src/lib/architectures.ts : layout +
   coquille), et l'essai applique l'architecture et la famille de premier écran sur les copies. */

/** Pure : architectures du registre de l'usine dont la coquille existe (src/shells/<shell>.astro). */
export function architecturesImplementees({ ids = [], parId = {}, coquilles = [] } = {}) {
  const implementees = [], incompletes = [];
  for (const id of ids) {
    const shell = parId[id]?.layout?.shell;
    if (shell && coquilles.includes(shell)) implementees.push(id);
    else incompletes.push({ id, raison: `coquille ${shell ?? '?'} absente de src/shells/` });
  }
  return { implementees, incompletes };
}

/**
 * Pure : architectures tirables pour un client : implémentées, pas prises (`interdites` : Map id → raison, 4 derniers
 * sites et pistes du contrat) et dont il a les données (`manquantes(id)` : phrases de donneesManquantes).
 */
export function architecturesTirables({ implementees = [], interdites = new Map(), manquantes = () => [] } = {}) {
  const libres = [], ecartees = [];
  for (const id of implementees) {
    if (interdites.has(id)) { ecartees.push({ id, raison: `prise (${interdites.get(id)})` }); continue; }
    const m = manquantes(id);
    if (m.length) { ecartees.push({ id, raison: `données absentes : ${m.join(' ; ')}` }); continue; }
    libres.push(id);
  }
  return { libres, ecartees };
}

/** Pure : interdits (Map id → raison, famillesInterdites de contrat.mjs) sans ceux des pistes sœurs (qu'on retire). */
export function retirerPistesSoeurs(interdites) {
  return new Map([...interdites].filter(([, raison]) => !/^piste sœur /.test(raison)));
}

/** Pure : erreur claire pour une `--architecture` que l'usine ne sait pas construire, ou null. */
export function refusArchitectureImposee(id, implementees = [], veille = []) {
  if (implementees.includes(id)) return null;
  const aVeille = veille.includes(id);
  return `--architecture ${id} : architecture non implémentée dans l'usine (src/lib/architectures.ts sait construire : ${implementees.join(', ') || 'aucune'})${aVeille ? ` ; ${id} est au registre de veille (docs/veille/architectures/INDEX.md) mais reste « à coder » : registre, coquille et preuve d'abord` : ' ; id inconnu'}`;
}

/**
 * Familles de premier écran que l'usine sait rendre avec une variante de hero partagée (src/sections/Hero/) ; les
 * autres (carte-sur-photo, mosaique, editorial…) se font en section sur mesure par l'agent : l'essai garde alors le
 * premier écran du site (ou celui de l'architecture) et le dit.
 */
export const HERO_DE_FAMILLE = {
  typographique: () => 'typographic',
  diptyque: () => 'split',
  'video-ou-sequence': (c) => (c.video ? 'video' : null), // sans vraie vidéo, le hero video se rend en fullbleed
};

/**
 * Pure : le `layout` à poser dans le look.json d'une copie d'essai. Avec une architecture : `architecture` et tous ses
 * réglages (comme completerLayout de src/lib/architectures.ts : écrits en clair pour que le plugin virtual:ff-look
 * charge les bonnes variantes) ; puis le hero de la famille si l'usine sait la rendre et que la coquille rend un hero
 * (`heroRendu(shell)`). Renvoie { layout, shell, hero, notes }.
 */
export function layoutEssai({ architecture = null, archi = null, famille = null, client = profilClient(), shellSite = 'flow', heroRendu = () => true } = {}) {
  const layout = {}, notes = [];
  if (architecture && archi) {
    for (const [k, v] of Object.entries(archi.layout)) layout[k] = Array.isArray(v) ? v.map((x) => ({ ...x })) : v;
    layout.architecture = architecture;
    notes.push(`architecture ${architecture} (coquille ${archi.layout.shell})`);
  } else notes.push('architecture : aucune, déroulé du site gardé');
  const shell = archi ? archi.layout.shell : shellSite;
  const hero = famille ? HERO_DE_FAMILLE[famille]?.(client) ?? null : null;
  let applique = null;
  if (famille && !hero) notes.push(`premier écran ${famille} : pas de hero partagé pour cette famille, celui ${archi ? 'de l\'architecture' : 'du site'} est gardé`);
  else if (famille && !heroRendu(shell)) notes.push(`premier écran ${famille} : la coquille ${shell} dessine son propre premier écran`);
  else if (hero) { layout.hero = applique = hero; notes.push(`premier écran ${famille} (hero ${hero})`); }
  return { layout, shell, hero: applique, notes };
}

/** Pure : la copie construite porte-t-elle le mélange (direction) et la coquille voulus ? Renvoie les écarts. */
export function verifierCopie(html, { direction, shell }) {
  const attr = (k) => new RegExp(`\\bdata-${k}="([^"]*)"`).exec(html || '')?.[1] ?? null;
  const out = [];
  if (attr('direction') !== direction) out.push(`direction ${attr('direction') ?? 'absente'} au lieu de ${direction} (look.json ignoré ?)`);
  if (shell && attr('shell') !== shell) out.push(`coquille ${attr('shell') ?? 'absente'} au lieu de ${shell}`);
  return out;
}

/* =====================================================================
   REGISTRE DES ATOMES (pur sur des entrées déjà lues)
   ===================================================================== */

/**
 * Pure : à partir des fichiers lus ({ fichier, atomes }), le registre utilisable : `parId` (atomes valides) et
 * `reserves[dim]` = ids tirables pour cette dimension (atome mesuré, valide, et qui passe ses propres contraintes :
 * polices cohérentes, palette lisible). `rejets` dit pourquoi un fichier ou un atome est écarté.
 */
export function construireRegistre(entrees, { polices = {}, clesIa = CLES_IA } = {}) {
  const parId = {}, reserves = Object.fromEntries(TOUS_ATOMES.map((d) => [d, []])), rejets = [];
  for (const { fichier, atomes, erreurJson } of entrees) {
    if (erreurJson) { rejets.push(`${fichier} : JSON illisible (${erreurJson})`); continue; }
    const v = validerAtomes(atomes, { polices, clesIa });
    if (v.erreurs.length) { rejets.push(`${fichier} : ${v.erreurs.join(' ; ')}`); continue; }
    parId[atomes.id] = atomes;
    for (const dim of TOUS_ATOMES) {
      if (!v.utilisables[dim]) continue;
      if (dim === 'typo') {
        const p = controlerPolices(atomes.typo, { polices, clesIa });
        if (p.length) { rejets.push(`${atomes.id} typo : ${p.join(' ; ')}`); continue; }
      }
      if (dim === 'couleurs') {
        const p = paletteComplete(atomes.couleurs[atomes.couleurs.principal]);
        if (p.refus.length) { rejets.push(`${atomes.id} couleurs : ${p.refus.join(' ; ')}`); continue; }
        const b = refusPalette(atomes.couleurs);
        if (b.length) { rejets.push(`${atomes.id} couleurs (garde de beauté) : ${b.join(' ; ')}`); continue; }
      }
      reserves[dim].push(atomes.id);
    }
  }
  return { parId, reserves, rejets };
}

/* =====================================================================
   TIRAGE (pur, graine déterministe)
   ===================================================================== */

/**
 * Pure : tire un élément pondéré (poids = 1 / (1 + usages)) : les atomes peu utilisés sortent plus souvent. `groupe`
 * (facultatif) range les candidats en groupes tirés à parts égales (régimes de palette : sinon les neutres clairs, les
 * plus nombreux du registre, sortiraient presque toujours).
 */
function tirerPondere(candidats, usages, rng, groupe = null) {
  const taille = new Map();
  if (groupe) for (const c of candidats) taille.set(groupe(c), (taille.get(groupe(c)) || 0) + 1);
  const poids = candidats.map((c) => (1 / (1 + (usages.get(c) || 0))) / (groupe ? taille.get(groupe(c)) : 1));
  let x = rng() * poids.reduce((a, b) => a + b, 0);
  for (let i = 0; i < candidats.length; i++) { x -= poids[i]; if (x <= 0) return candidats[i]; }
  return candidats[candidats.length - 1];
}

/**
 * Pure : tire UN mélange. `imposes` = { dim: id } (pour architecture : l'id d'architecture ; premier_ecran : la
 * famille). `existants` = [{ slug, atomes }] (registre), `soeurs` = mélanges déjà tirés pour les pistes du même
 * client (≤ 2 atomes partagés, palettes de régimes différents : refusDiversite), `familles` / `architectures` = ids
 * libres (déjà filtrés des interdits ; architectures : seulement celles que l'usine sait construire et dont le client a
 * les données). Une architecture déjà prise par une piste sœur n'est pas retirée : s'il n'en reste aucune, la piste
 * n'en a pas (null, « à choisir »).
 * Renvoie { atomes, essais, diversite (nom du niveau de NIVEAUX_DIVERSITE tenu, ou null sans sœur) } ou { erreur }.
 */
export function tirerMelange({ registre, imposes = {}, client = profilClient(), existants = [], soeurs = [], familles = [], architectures = [], rng, essaisMax = 400 }) {
  const { parId, reserves } = registre;
  const usages = new Map();
  for (const e of existants) for (const d of TOUS_ATOMES) if (e.atomes?.[d]) usages.set(e.atomes[d], (usages.get(e.atomes[d]) || 0) + 1);
  const candidats = {};
  const refusDe = {};
  for (const dim of DIMENSIONS_VALEURS) {
    if (imposes[dim]) {
      if (!reserves[dim].includes(imposes[dim])) return { erreur: `--${dim} ${imposes[dim]} : atome absent ou inutilisable (ff atomes)` };
      candidats[dim] = [imposes[dim]];
    } else candidats[dim] = reserves[dim];
    // Contraintes propres au client.
    candidats[dim] = candidats[dim].filter((id) => {
      const raison = dim === 'photos' ? refusPhotos(parId[id].photos, client) : dim === 'mouvement' ? refusMouvement(parId[id].mouvement, client) : null;
      if (raison) (refusDe[dim] ||= []).push(`${id} : ${raison}`);
      return !raison;
    });
    if (!candidats[dim].length) return { erreur: `aucun atome ${dim} possible${refusDe[dim] ? ` (${refusDe[dim].join(' ; ')})` : ''}${imposes[dim] ? '' : ' : enrichir le registre (veille, 2a quater)'}` };
  }
  // Familles de premier écran : celles des atomes (sources) d'abord, puis le tableau ; toujours libres et compatibles.
  const famillesOk = (imposes.premier_ecran ? [imposes.premier_ecran] : familles).filter((f) => !refusFamille(f, client));
  if (imposes.premier_ecran && !famillesOk.length) return { erreur: `--premier-ecran ${imposes.premier_ecran} : ${refusFamille(imposes.premier_ecran, client) || 'déjà prise'}` };
  const archisOk = imposes.architecture ? [imposes.architecture] : architectures.filter((a) => !soeurs.some((s) => s.architecture === a));
  const regimeDe = (id) => regimePalette(parId[id].couleurs)?.regime ?? '?';
  // Diversité de palette entre pistes sœurs (régime, clarté du fond, teinte d'accent), du niveau le plus strict au
  // plus lâche. Couleurs imposées : rien à diversifier (le studio a choisi).
  const palettesSoeurs = soeurs.map((s) => parId[s.couleurs]?.couleurs).filter(Boolean);
  const niveaux = palettesSoeurs.length && !imposes.couleurs ? NIVEAUX_DIVERSITE : [null];
  const raisons = new Map(); // pourquoi les tirages échouent : dit à l'humain ce qui bloque
  const noter = (x) => raisons.set(x, (raisons.get(x) || 0) + 1);
  let tentes = 0;
  for (const niveau of niveaux) {
    const couleursOk = niveau ? candidats.couleurs.filter((id) => !refusDiversite(parId[id].couleurs, palettesSoeurs, niveau)) : candidats.couleurs;
    if (!couleursOk.length) { noter(`palettes : aucune ne tient « ${niveau.nom} »`); continue; }
    tentes++;
    for (let essai = 1; essai <= essaisMax; essai++) {
      const m = {};
      for (const dim of DIMENSIONS_VALEURS) m[dim] = dim === 'couleurs' ? tirerPondere(couleursOk, usages, rng, regimeDe) : tirerPondere(candidats[dim], usages, rng);
      m.premier_ecran = famillesOk.length ? famillesOk[Math.floor(rng() * famillesOk.length)] : null;
      m.architecture = archisOk.length ? archisOk[Math.floor(rng() * archisOk.length)] : null;
      const croises = refusCroises(Object.fromEntries(DIMENSIONS_VALEURS.map((d) => [d, parId[m[d]][d]])), client);
      if (croises.length) { noter(croises[0]); continue; }
      // Polices : la paire (titre, texte) ne doit pas être celle d'une direction existante (tests/directions.test.mjs).
      if (registre.pairesPrises?.has(`${parId[m.typo].typo.titre.libre}|${parId[m.typo].typo.texte.libre}`)) continue;
      if (existants.some((e) => partages(m, e.atomes) > MAX_PARTAGES_SITE)) continue;
      if (soeurs.some((s) => partages(m, s) > MAX_PARTAGES_PISTES || (s.premier_ecran && s.premier_ecran === m.premier_ecran) || (s.architecture && s.architecture === m.architecture))) continue;
      // Deux pistes d'un client ne bougent jamais pareil (GOUT § 4) : ni même entrée du premier écran, ni même apparition
      // au défilement (profils de docs/veille/styles/MOUVEMENTS.md).
      const profil = parId[m.mouvement].mouvement.profil;
      const proche = soeurs.map((s) => profilsTropProches(profil, parId[s.mouvement]?.mouvement?.profil)).find(Boolean);
      if (proche) { noter(`piste sœur : ${proche}`); continue; }
      return { atomes: m, essais: essai, diversite: niveau?.nom ?? null };
    }
  }
  const freq = [...raisons.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([x, n]) => `${x} (${n} fois)`);
  return { erreur: `aucune combinaison neuve en ${essaisMax * Math.max(1, tentes)} tirages (imposés trop nombreux, ou registre trop petit : ${Object.entries(candidats).map(([d, c]) => `${d} ${c.length}`).join(', ')})${freq.length ? ` ; refus les plus fréquents : ${freq.join(' ; ')}` : ''}` };
}

/** Pure : identifiant stable d'un mélange (m- + 6 hex), à partir de ses atomes. */
export function hashMelange(m) {
  return 'm-' + seedFromString(TOUS_ATOMES.map((d) => `${d}:${m[d] ?? '-'}`).join('|')).toString(16).padStart(8, '0').slice(0, 6);
}

/** Pure : la ligne à recopier dans le contrat (direction.md). */
export function ligneContrat(m) {
  const part = (d, lib) => `${lib}:${m[d] ?? 'à choisir'}`;
  return `Style : mélange <${[part('typo', 'typo'), part('couleurs', 'couleurs'), part('densite', 'densite'), part('formes', 'formes'), part('photos', 'photos'), part('mouvement', 'mouvement'), part('matiere', 'matiere')].join(' · ')}> · Architecture : ${m.architecture ?? 'à choisir (aucune de l’usine ne convient)'} · PREMIER ÉCRAN — famille : ${m.premier_ecran ?? 'à choisir'}`;
}

/* =====================================================================
   DIRECTION GÉNÉRÉE (pure)
   ===================================================================== */

const r1 = (x) => Math.round(x * 1000) / 1000;
const rem = (px) => `${r1(px / 16)}rem`;
/** Pure : clamp() fluide entre 390 px (téléphone) et 1 440 px (ordinateur). */
export function clampFluide(tel, ord, vwMin = 390, vwMax = 1440) {
  const [a, b] = tel <= ord ? [tel, ord] : [ord, tel];
  if (Math.abs(ord - tel) < 0.5) return rem(ord);
  const pente = (ord - tel) / (vwMax - vwMin);
  const base = tel - pente * vwMin;
  return `clamp(${rem(a)}, ${rem(base)} + ${r1(pente * 100)}vw, ${rem(b)})`;
}
/** Pure : graisse disponible la plus proche (metadata.json de fontsource : { weights, variable }). */
export function graissePlusProche(g, meta) {
  if (!meta) return g;
  if (meta.variable?.wght) return Math.max(Number(meta.variable.wght.min), Math.min(Number(meta.variable.wght.max), g));
  const w = (meta.weights || [400]).map(Number);
  return w.sort((a, b) => Math.abs(a - g) - Math.abs(b - g))[0];
}
/** Pure : h/s/l arrondis d'un accent, recalés pour que l'arrondi ne fasse pas retomber le contraste sous 4,5. */
export function accentHsl(hex, fonds) {
  const hsl = hexVersHsl(hex);
  const sens = estSombre(fonds[0]) ? 1 : -1;
  for (let i = 0; i < 20; i++) {
    const c = hslVersHex(hsl);
    if (fonds.every((f) => contraste(c, f) >= 4.5)) return { ...hsl, hex: c };
    hsl.l += sens;
  }
  return { ...hsl, hex: hslVersHex(hsl) };
}

const borne = (x, a, b) => Math.max(a, Math.min(b, x));
const OMBRES_CSS = {
  aucune: ['none', '0 24px 48px -28px rgb(0 0 0 / 0.35)'],
  douce: ['0 1px 0 rgb(0 0 0 / 0.04), 0 18px 40px -24px rgb(0 0 0 / 0.28)', '0 32px 64px -24px rgb(0 0 0 / 0.38)'],
  portee: ['0 2px 0 rgb(0 0 0 / 0.08), 0 28px 56px -22px rgb(0 0 0 / 0.42)', '0 44px 80px -26px rgb(0 0 0 / 0.5)'],
};

/**
 * Pure : le CSS et le meta.ts de la direction générée. `atomes` = { dim: contenu }, `ids` = { dim: id },
 * `sources` = { id: url }, `polices` = registre { cle: { family, pkg } }, `metaPolices` = { cle: metadata.json }.
 * Règles appliquées ici (documentées dans ATOMES.md) : texte courant ≥ 16 px au téléphone ; mesure 45-75 caractères ;
 * interlignage serré (< 0,95) seulement en capitales ; boutons pilule mesurés rendus à 6 px (signe IA, GOUT § 2) ;
 * aucun grain, halo ni reflet (GOUT § 2).
 */
/**
 * Pure : les fichiers CSS à importer pour une police. Une police statique de fontsource (`@fontsource/<x>/latin.css`)
 * déclare TOUTES ses graisses : on n'importe que celles servies (ramenées aux graisses disponibles), sinon le budget
 * « fonts » de perf-budget.json saute (L'Épi d'Or D, Spectral : 16 fichiers, 300 Ko, 17 oct 2026). Police variable
 * ou sans metadata : le paquet tel quel (un fichier par plage d'écriture).
 */
export function importsDePolice(pkg, graisses, meta) {
  const m = /^(@fontsource\/[^/]+)\/latin\.css$/.exec(pkg || '');
  if (!m || !meta?.weights?.length) return [pkg];
  const ws = [...new Set(graisses.map((g) => graissePlusProche(g, meta)))].sort((x, y) => x - y);
  return ws.map((w) => `${m[1]}/latin-${w}.css`);
}

/**
 * Pure : une courbe mesurée en mot-clé (« ease », « ease-out »…) écrite en cubic-bezier. --ease-brand doit être un
 * cubic-bezier (tests/motion.test.mjs) ; Café Binocle mesure « ease » (L'Épi d'Or B, 17 oct 2026). « ease-in » sur une
 * entrée est refusé (GOUT § 8) : rendu en ease-out.
 */
export function courbeCubique(c) {
  const mots = { ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)', 'ease-out': 'cubic-bezier(0, 0, 0.58, 1)', 'ease-in-out': 'cubic-bezier(0.42, 0, 0.58, 1)', linear: 'cubic-bezier(0, 0, 1, 1)', 'ease-in': 'cubic-bezier(0, 0, 0.58, 1)' };
  const k = String(c ?? '').trim().toLowerCase();
  if (/^cubic-bezier\(/.test(k)) return k;
  return mots[k] ?? mots['ease-out'];
}

export function genererDirection(nom, { atomes, ids, sources, polices, metaPolices = {}, date }) {
  const t = atomes.typo, c = atomes.couleurs, d = atomes.densite, f = atomes.formes, ph = atomes.photos, mv = atomes.mouvement, mt = atomes.matiere;
  const pal = paletteComplete(c[c.principal]);
  const k = pal.tokens;
  const acc = accentHsl(k.accent, [k.bg, k.bg2, k.surface]);
  const P = (cle) => polices[cle];
  const titre = P(t.titre.libre), texte = P(t.texte.libre), mono = t.mono?.libre ? P(t.mono.libre) : null;
  // Pas de chasse fixe mesurée sur le site source : aucune police chargée, la pile système suffit (les rares usages
  // de --font-mono sont des numéros d'étape). Avant le 17 oct 2026, JetBrains Mono était importée d'office : 5 Ko de
  // @font-face inutiles dans chaque page, et L'Épi d'Or B passait au-dessus du budget html de perf-budget.json.
  const gTitre = graissePlusProche(t.titre.graisse ?? 400, metaPolices[t.titre.libre]);
  const gTexte = graissePlusProche(t.texte.graisse ?? 400, metaPolices[t.texte.libre]);
  const casse = casseTitre(t.titre.casse);
  const lhTitre = interlignageTitre(t.titre.interlignage, casse);
  const lhTexte = borne(typeof t.texte.interlignage === 'number' ? t.texte.interlignage : 1.55, 1.4, 1.8);
  const track = interlettrageTitre(t.titre.interlettrage, casse);
  const e = t.echelle;
  const h1 = e.h1, h2m = e.h2 && e.h2 !== A_JUGER ? e.h2 : { telephone: h1.telephone * 0.6, ordinateur: h1.ordinateur * 0.5 };
  const corps = { telephone: Math.max(16, e.texte.telephone), ordinateur: borne(e.texte.ordinateur, 16, 24) };
  // Règle apprise (26 oct 2026, soir) : le h2 reste entre le texte et le h1 (echelleH2).
  const h2 = { telephone: echelleH2(h1.telephone, h2m.telephone, corps.telephone), ordinateur: echelleH2(h1.ordinateur, h2m.ordinateur, corps.ordinateur) };
  const lg = { telephone: (h1.telephone + h2.telephone) / 2, ordinateur: Math.sqrt(h1.ordinateur * h2.ordinateur) };
  // Règle apprise (même essai) : --scale-sm sert aux titres des cartes (h3, trois colonnes). Dérivé d'un h2 de 96 px
  // (pizza-amici), il coupait « BIBLIOTHÈQ-UES » en plein mot : plafonné à 24 px au téléphone, 30 px à l'ordinateur.
  const sm = { telephone: borne(Math.max(corps.telephone * 1.2, h2.telephone * 0.62), 18, 24), ordinateur: borne(Math.max(corps.ordinateur * 1.25, h2.ordinateur * 0.5), 20, 30) };
  const pilule = f.pilule === true;
  const rayon = pilule ? 6 : borne(f.rayon, 0, 24);
  const rayonCarte = pilule ? Math.min(8, borne(f.rayonCarte, 0, 24)) : borne(f.rayonCarte, 0, 24);
  const rayonImage = typeof f.rayonImage === 'number' ? borne(f.rayonImage, 0, 24) : rayonCarte;
  const [ombreCarte, ombreLift] = OMBRES_CSS[f.ombre] || OMBRES_CSS.aucune;
  const section = { telephone: borne(d.section.telephone, 40, 160), ordinateur: borne(d.section.ordinateur, 56, 224) };
  const conteneur = borne(typeof d.conteneur === 'number' ? d.conteneur : 1216, 960, 1440);
  const mesure = borne(typeof d.mesure === 'number' ? d.mesure : 66, 45, 75);
  const ui = borne(mv.ui.duree, 0.12, 0.4), scene = borne(mv.scene.duree, 0.4, 1);
  const sel = `[data-direction='${nom}']`;
  const bordure = borne(typeof f.bordure === 'number' ? f.bordure : 1, 1, 3);
  const L = [];
  const liste = DIMENSIONS_VALEURS.map((dim) => `   ${dim} : ${ids[dim]} (${sources[ids[dim]]})`).join('\n');
  L.push(`/* Direction ${nom.toUpperCase()} : MÉLANGE d'atomes de vrais sites, généré par \`ff melanger\` le ${date}.`);
  L.push(`   Ne pas éditer à la main : regénérer (\`ff melanger <slug> --typo … --couleurs …\`). Format : docs/veille/styles/ATOMES.md.`);
  L.push(liste);
  if (pal.ajustements.length) L.push(`   Dérivé par calcul (contraste AA) : ${pal.ajustements.join(' ; ')}.`);
  L.push('*/');
  // Graisses servies : le titre à sa graisse ; le texte à la sienne et 700 (gras). Un 500 ou un 600 demandé (boutons)
  // prend la graisse chargée la plus proche (règle de correspondance CSS), jamais un faux gras.
  const imports = titre.pkg === texte.pkg
    ? importsDePolice(titre.pkg, [gTitre, gTexte, 700], metaPolices[t.titre.libre])
    : [...importsDePolice(titre.pkg, [gTitre], metaPolices[t.titre.libre]), ...importsDePolice(texte.pkg, [gTexte, 700], metaPolices[t.texte.libre])];
  for (const i of imports) L.push(`@import '${i}';`);
  if (mono) L.push(`@import '${mono.pkg}';`);
  L.push('');
  L.push(`${sel} {`);
  L.push(`  --accent-h: ${acc.h};`, `  --accent-s: ${acc.s}%;`, `  --accent-l: ${acc.l}%;`, '');
  L.push(`  --bg: ${k.bg};`, `  --bg-2: ${k.bg2};`, `  --surface: ${k.surface};`, `  --fg: ${k.fg};`, `  --muted: ${k.muted};`, `  --line: ${k.line};`);
  L.push('  --accent: hsl(var(--accent-h) var(--accent-s) var(--accent-l));', `  --accent-2: ${k.accent2};`, `  --on-accent: ${k.onAccent};`, `  --ink: ${k.ink};`, `  --on-ink: ${k.onInk};`);
  L.push(`  /* Aplat de marque (boutons pleins, sélection) : la couleur mesurée sur ${ids.couleurs}. */`, `  --fill: ${k.fill};`, `  --on-fill: ${k.onFill};`, '');
  L.push(`  --font-display: ${titre.family};`, `  --font-body: ${texte.family};`, `  --font-mono: ${mono ? mono.family : 'ui-monospace, monospace'};`);
  L.push(`  --display-weight: ${gTitre};`, `  --body-weight: ${gTexte};`, `  --display-tracking: ${r1(track)}em;`, `  --heading-transform: ${casse};`);
  L.push(`  --radius: ${rayon}px;`, `  --radius-card: ${rayonCarte}px;`, `  --shadow-card: ${ombreCarte};`, `  --shadow-lift: ${ombreLift};`);
  L.push(`  --container: ${rem(conteneur)};`, `  /* ${mesure} caractères réels par ligne (1ch ≈ 1,25 caractère, voir global.css). */`, `  --measure: ${Math.round(mesure / 1.25)}ch;`);
  L.push(`  --motion-ui: ${ui}s;`, `  --motion-duration: ${scene}s;`, `  --ease-brand: ${courbeCubique(mv.scene.courbe)};`);
  if (k.sombre) L.push('  color-scheme: dark;');
  L.push('}', '');
  L.push(`/* Échelle typographique mesurée sur ${ids.typo} (h1, h2, texte ; téléphone 390 px → ordinateur 1 440 px) et marge de section de ${ids.densite}. */`);
  L.push(`${sel}[data-scale] {`);
  L.push(`  --scale-xl: ${clampFluide(h1.telephone, h1.ordinateur)};`, `  --scale-lg: ${clampFluide(lg.telephone, lg.ordinateur)};`, `  --scale-md: ${clampFluide(h2.telephone, h2.ordinateur)};`, `  --scale-sm: ${clampFluide(sm.telephone, sm.ordinateur)};`);
  L.push(`  --section-y: ${clampFluide(section.telephone, section.ordinateur)};`);
  L.push('}', '');
  L.push(`${sel} body { font-size: ${clampFluide(corps.telephone, corps.ordinateur)}; line-height: ${lhTexte}; }`);
  L.push(`${sel} :is(h1, .text-display-xl, .text-display-lg) { line-height: ${lhTitre}; }`);
  if (casseH1(casse) !== casse) L.push(`${sel} :is(h1, .text-display-xl) { text-transform: ${casseH1(casse)}; letter-spacing: ${r1(interlettrageTitre(t.titre.interlettrage, casseH1(casse)))}em; }`);
  L.push(`${sel} :is(h2, .text-display-md) { line-height: ${r1(Math.max(lhTitre, casse === 'uppercase' ? 0.9 : 1.02))}; }`);
  L.push(`${sel} ::selection { background: var(--fill); color: var(--on-fill); }`);
  // Règle apprise (essai, m-394c01) : l'emphase des titres en accent ASSOMBRI pour l'AA (or #e3af04 → #745902) donnait
  // un olive boueux. Un titre est du grand texte (WCAG : 3:1) : on prend la première couleur mesurée qui tient 3:1
  // sur le fond (aplat, accent 2), l'accent lisible en dernier recours.
  const emphase = [k.fill, k.accent2].find((x) => contraste(x, k.bg) >= 3 && contraste(x, k.bg2) >= 3) || k.accent;
  L.push(`${sel} :is(h1, h2) em { font-style: normal; color: ${emphase}; }`, '');
  // Boutons et liens (formes).
  const casseBouton = f.casseBouton && f.casseBouton !== A_JUGER ? f.casseBouton : 'none';
  L.push(`/* Boutons (${ids.formes}) : ${f.bouton}${pilule ? ', pilule mesurée rendue à 6 px (signe IA, GOUT § 2)' : ''}. */`);
  L.push(`${sel} .btn { border-radius: var(--radius); text-transform: ${casseBouton}; letter-spacing: ${casseBouton === 'uppercase' ? '0.04em' : '0'}; font-weight: 600; transition: background-color var(--motion-ui) var(--ease-out), color var(--motion-ui) var(--ease-out), border-color var(--motion-ui) var(--ease-out); }`);
  if (f.bouton === 'contour') {
    L.push(`${sel} .btn-primary { background: transparent; color: var(--fg); border: ${bordure}px solid var(--fg); }`);
    L.push(`${sel} .btn-primary:hover { background: var(--fg); color: var(--bg); }`);
  } else if (f.bouton === 'texte') {
    L.push(`${sel} .btn-primary { background: transparent; color: var(--fg); border: 0; border-bottom: 2px solid var(--fill); border-radius: 0; padding-inline: 0; }`);
    L.push(`${sel} .btn-primary:hover { border-bottom-color: var(--fg); }`);
  } else {
    L.push(`${sel} .btn-primary { background: var(--fill); color: var(--on-fill); border: 1px solid var(--fill); }`);
    L.push(`${sel} .btn-primary:hover { background: var(--fg); color: var(--bg); border-color: var(--fg); }`);
  }
  L.push(`${sel} .btn-ghost { background: transparent; color: var(--fg); border: ${bordure}px solid var(--line); }`);
  L.push(`${sel} .btn-ghost:hover { border-color: var(--fg); }`);
  if (f.lien === 'souligne') L.push(`${sel} main p a:not(.btn) { color: inherit; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.2em; }`);
  // Lien « couleur » : la couleur d'accent ET un soulignement fin (épaissi au survol). Sans soulignement, un lien dans un
  // paragraphe ne se distinguait que par la couleur : axe « link-in-text-block » (sérieux) sur les pages légales de
  // L'Épi d'Or B et C, 17 oct 2026 (WCAG 1.4.1).
  else L.push(`${sel} main p a:not(.btn) { color: var(--accent); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.2em; }`, `${sel} main p a:not(.btn):hover { text-decoration-thickness: 2px; }`);
  const bordCarte = f.ombre === 'aucune' || (typeof f.bordure === 'number' && f.bordure > 0) || mt.filets === 'grille';
  L.push(`${sel} .card { background: var(--surface); border-radius: var(--radius-card); box-shadow: var(--shadow-card);${bordCarte ? ' border: 1px solid var(--line);' : ''} }`);
  L.push(`${sel} .rule { border-top: 1px solid var(--line); }`, '');
  // Photos.
  L.push(`/* Photos (${ids.photos}) : ${ph.traitement}. */`);
  const img = `${sel} main :is(img, video):not([src$=".svg"])`;
  L.push(`${img} { border-radius: ${rayonImage}px; }`);
  if (ph.traitement === 'noir-et-blanc' || ph.traitement === 'duotone') L.push(`${img} { filter: grayscale(1) contrast(1.06); }`);
  if (ph.traitement === 'cadre') L.push(`${img} { box-shadow: 0 0 0 clamp(6px, 1vw, 12px) var(--surface), 0 0 0 calc(clamp(6px, 1vw, 12px) + 1px) var(--line); }`);
  if (ph.traitement === 'masque') L.push(`${img} { clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px); border-radius: 0; }`);
  L.push('');
  // Matière.
  L.push(`/* Matière (${ids.matiere}) : fond ${mt.fond}, filets ${mt.filets}. Ni grain, ni halo, ni reflet (GOUT § 2). */`);
  if (mt.filets === 'fins') L.push(`${sel} main section + section { border-top: 1px solid var(--line); }`);
  if (mt.filets === 'grille') L.push(`${sel} main section + section { border-top: ${bordure}px solid var(--line); }`, `${sel} .card { box-shadow: none; }`);
  L.push('');
  const css = L.join('\n');
  const ambiance = `Mélange : typo ${ids.typo}, couleurs ${ids.couleurs}, densité ${ids.densite}, formes ${ids.formes}, photos ${ids.photos}, mouvement ${ids.mouvement}, matière ${ids.matiere}.`;
  const meta = [
    `// Direction générée par \`ff melanger\` le ${date} : ne pas éditer à la main (voir index.css et docs/veille/styles/ATOMES.md).`,
    'export default {',
    `  nom: '${nom}',`,
    `  ambiance: ${JSON.stringify(ambiance)},`,
    '  metiers: [],',
    `  motionParDefaut: '${PROFILS_MOUVEMENT[mv.profil]?.motion ?? (mv.defilement === 'suit-le-defilement' ? 'rich' : 'subtle')}',`,
    `  // Profil de mouvement (docs/veille/styles/MOUVEMENTS.md) : entrée, apparition, survol, fond, et ses attributs.`,
    `  profilMouvement: ${JSON.stringify(mv.profil && PROFILS_MOUVEMENT[mv.profil] ? { id: mv.profil, attributs: PROFILS_MOUVEMENT[mv.profil].attributs } : null)},`,
    '  eviter: [],',
    '  // Une direction de mélange appartient au site qui l\'a tirée : ff composer ne la propose jamais à un autre.',
    '  melange: true,',
    `  atomes: ${JSON.stringify(Object.fromEntries(TOUS_ATOMES.map((dd) => [dd, ids[dd] ?? null])))},`,
    `  sources: ${JSON.stringify(Object.fromEntries(DIMENSIONS_VALEURS.map((dd) => [ids[dd], sources[ids[dd]]])))},`,
    '};',
    '',
  ].join('\n');
  return { css, meta, palette: pal, accent: acc, tone: mt.fond === 'sections-colorees' || mt.fond === 'aplats-francs' || d.rythme === 'alterne' ? 'alternate' : 'flat' };
}

/* =====================================================================
   schema.ts : enregistrement dans DIRECTIONS (pur sur le texte)
   ===================================================================== */

/** Pure : ajoute `'nom', // commentaire` à la fin de DIRECTIONS (après le marqueur des mélanges). Idempotent. */
export function insererDirection(schema, nom, commentaire = '') {
  if (new RegExp(`^\\s*'${nom}',`, 'm').test(schema)) return schema;
  const re = /(export const DIRECTIONS = \[[\s\S]*?)(\n\] as const;)/;
  const m = re.exec(schema);
  if (!m) throw new Error('bloc DIRECTIONS introuvable dans src/lib/schema.ts');
  let corps = m[1];
  if (!corps.includes(MARQUEUR_DIRECTIONS)) corps += `\n${MARQUEUR_DIRECTIONS} (src/directions/m-<hash>/), une par site ; écrites et retirées par la commande.`;
  corps += `\n  '${nom}',${commentaire ? ` // ${commentaire}` : ''}`;
  return schema.replace(re, `${corps}$2`);
}
/** Pure : retire la ligne `'nom',` de DIRECTIONS (et le marqueur s'il ne reste aucun mélange). */
export function retirerDirection(schema, nom) {
  let s = schema.replace(new RegExp(`\\n\\s*'${nom}',[^\\n]*`), '');
  if (!/^\s*'m-[0-9a-f]{6}',/m.test(s)) s = s.replace(new RegExp(`\\n${MARQUEUR_DIRECTIONS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\\n]*`), '');
  return s;
}

/* =====================================================================
   E/S : registre, client, application, essai
   ===================================================================== */

export function lireMelanges(fichier = REGISTRE_MELANGES) {
  try { return JSON.parse(fs.readFileSync(fichier, 'utf8')); } catch { return { outil: 'ff melanger', note: 'site -> atomes utilisés ; une combinaison qui partage plus de 3 atomes avec un site est refusée', sites: {} }; }
}

function chargerRegistre() {
  const polices = policesDuRegistre(fs.readFileSync(path.join(ROOT, 'src/lib/fonts.ts'), 'utf8'));
  const registre = construireRegistre(lireAtomes(path.join(ROOT, DOSSIER_ATOMES)), { polices, clesIa: CLES_IA });
  // Paires de polices des directions existantes (hors mélanges) : un mélange ne reprend jamais la paire d'une direction.
  registre.pairesPrises = new Set();
  const familleVersCle = Object.fromEntries(Object.entries(polices).map(([cle, p]) => [p.family.match(/'([^']+)'/)?.[1], cle]));
  const dirDir = path.join(ROOT, 'src', 'directions');
  for (const dn of fs.readdirSync(dirDir)) {
    const css = path.join(dirDir, dn, 'index.css');
    if (!fs.existsSync(css) || dn.startsWith('m-')) continue;
    const txt = fs.readFileSync(css, 'utf8');
    const fam = (v) => familleVersCle[/--font-(?:display|body):\s*'([^']+)'/.exec(v)?.[1]];
    const d = fam((/--font-display:[^;]+/.exec(txt) || [''])[0]), b = fam((/--font-body:[^;]+/.exec(txt) || [''])[0]);
    if (d && b) registre.pairesPrises.add(`${d}|${b}`);
  }
  return { registre, polices };
}

function metaPolicesDe(polices, cles) {
  const out = {};
  for (const cle of cles) {
    const p = polices[cle];
    if (!p) continue;
    const f = path.join(ROOT, 'node_modules', ...p.pkg.replace(/\/latin(-\d+)?\.css$/, '').split('/'), 'metadata.json');
    try { out[cle] = JSON.parse(fs.readFileSync(f, 'utf8')); } catch { /* police sans metadata : graisse telle quelle */ }
  }
  return out;
}

/** Pure : clarté L* (0-100) et chaleur (R - B) d'une moyenne de canaux RVB (0-255). */
export function tonDeMoyennes([r, g, b]) {
  const lin = (v) => { const x = v / 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
  const y = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return { clarte: y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y, chaleur: r - b };
}
/** Pure : ton médian d'une liste de tons, ou null. */
export function tonMedian(tons) {
  if (!tons.length) return null;
  const med = (xs) => { const t = [...xs].sort((a, b) => a - b); return t[Math.floor(t.length / 2)]; };
  return { clarte: med(tons.map((t) => t.clarte)), chaleur: med(tons.map((t) => t.chaleur)) };
}
/**
 * Pure : d'où vient la vidéo du client. Une vidéo dans raw/ est la sienne ; dans public/videos/, c'est une vidéo de
 * banque si CREDITS.md la crédite à Pexels (ff video), une photo animée s'il cite ff animer / fal.ai. `declaree`
 * (--video client|animer|banque) dit ce qui est prévu et prime. Renvoie 'client' | 'animer' | 'banque' | null.
 */
export function origineVideo({ videosRaw = false, videosPub = false, credits = '', declaree = null } = {}) {
  if (['client', 'animer', 'banque'].includes(declaree)) return declaree;
  if (videosRaw) return 'client';
  if (videosPub) {
    if (/ff animer|fal\.ai/i.test(credits)) return 'animer';
    if (/public\/videos[^\n]*\n[^#]*Pexels/i.test(credits) || /Pexels Videos/i.test(credits)) return 'banque';
    return 'client';
  }
  return null;
}

/** Le client vu par les contraintes : photos (hors banque), plus grande largeur (images.json), aiguillage, avis. */
async function lireClient(slug, videoDeclaree = null) {
  const dir = path.join(SITES_DIR, slug);
  const { photosClient, aiguillageDuSite } = await import('./aiguillage.mjs');
  const photos = photosClient(dir);
  let largeurMax = 0;
  const manifeste = path.join(dir, 'images.json');
  if (fs.existsSync(manifeste)) {
    try { for (const e of Object.values(JSON.parse(fs.readFileSync(manifeste, 'utf8')))) largeurMax = Math.max(largeurMax, ...(e.widths || [0])); } catch { /* manifeste illisible */ }
  }
  const raw = path.join(dir, 'raw');
  const tons = [];
  if (fs.existsSync(raw)) {
    const sharp = (await import('sharp')).default;
    for (const f of fs.readdirSync(raw).filter((x) => /\.(jpe?g|png|webp|avif|tiff?)$/i.test(x))) {
      try {
        const img = sharp(path.join(raw, f));
        const m = await img.metadata();
        largeurMax = Math.max(largeurMax, m.width || 0);
        // Ton des photos (garde de beauté B7) : clarté L* et chaleur (R - B) moyennes d'une vignette de 64 px.
        if (tons.length < 16) { const st = await sharp(path.join(raw, f)).resize(64, 64, { fit: 'inside' }).stats(); tons.push(tonDeMoyennes(st.channels.map((c) => c.mean))); }
      } catch { /* fichier illisible */ }
    }
  }
  const credits = fs.existsSync(path.join(dir, 'CREDITS.md')) ? fs.readFileSync(path.join(dir, 'CREDITS.md'), 'utf8') : '';
  const videosRaw = fs.existsSync(raw) && fs.readdirSync(raw).some((x) => /\.(mp4|mov|m4v|webm)$/i.test(x));
  const videosPub = fs.existsSync(path.join(dir, 'public', 'videos')) && fs.readdirSync(path.join(dir, 'public', 'videos')).some((x) => /\.(mp4|webm)$/i.test(x));
  const cfg = fs.existsSync(path.join(dir, 'site.config.ts')) ? fs.readFileSync(path.join(dir, 'site.config.ts'), 'utf8') : '';
  const avis = Number(/google:\s*\{[^}]*count:\s*(\d+)/.exec(cfg)?.[1] || 0);
  const urgence = /emergency24h:\s*true/.test(cfg);
  const video = origineVideo({ videosRaw, videosPub, credits, declaree: videoDeclaree });
  return profilClient({ photos: photos.length, largeurMax, mouvement: aiguillageDuSite(slug)?.decision?.mouvement ?? null, avis, urgence, tonPhotos: tonMedian(tons), video });
}

/** Familles et architectures prises : contrats (direction.md) et registre des mélanges, avec leur date. */
function prisesDesSites(melanges) {
  const out = [];
  for (const d of fs.readdirSync(SITES_DIR, { withFileTypes: true })) {
    if (!d.isDirectory() || d.name.startsWith('_')) continue;
    const p = path.join(SITES_DIR, d.name, 'direction.md');
    const m = melanges.sites[d.name];
    const contrat = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
    const famille = familleDuContrat(contrat) || m?.atomes?.premier_ecran || null;
    const architecture = /Architecture\s*:\s*`?([a-z0-9-]+)`?/i.exec(contrat)?.[1] || m?.atomes?.architecture || null;
    const date = fs.existsSync(p) ? fs.statSync(p).mtimeMs : m?.date ? Date.parse(m.date) : 0;
    if (famille || architecture) out.push({ slug: d.name, famille, architecture, date });
  }
  return out;
}

/** Ids du registre de VEILLE (docs/veille/architectures/INDEX.md) : fiches lues, codées dans l'usine ou non. */
function architecturesDeVeille() {
  const idx = path.join(ROOT, 'docs', 'veille', 'architectures', 'INDEX.md');
  if (!fs.existsSync(idx)) return [];
  return [...fs.readFileSync(idx, 'utf8').matchAll(/^\| `([a-z0-9-]+)` \|/gm)].map((m) => m[1]);
}

/**
 * Le registre de l'USINE (src/lib/architectures.ts), lu au moment du tirage (il grandit pendant que d'autres agents
 * codent des architectures ; il n'est jamais modifié ici), et le site du client tel que defineSite le rend (pour
 * donneesManquantes). Renvoie { ids, parId, implementees, incompletes, manquantes(id), site, erreur }.
 */
async function architecturesUsine(slug) {
  const T = await import('./ts-loader.mjs');
  const coquilles = fs.readdirSync(path.join(ROOT, 'src', 'shells')).filter((f) => f.endsWith('.astro')).map((f) => f.replace(/\.astro$/, ''));
  try {
    const A = await T.loadArchitecturesModule();
    let site = null, erreur = null;
    try { site = (await T.loadSiteConfigModule(slug)).default; } catch (err) { erreur = err.message.split('\n')[0]; }
    const ids = [...A.ARCHITECTURE_IDS];
    const { implementees, incompletes } = architecturesImplementees({ ids, parId: A.ARCHITECTURES, coquilles });
    return { ids, parId: A.ARCHITECTURES, implementees, incompletes, site, erreur, manquantes: (id) => (site ? A.donneesManquantes(id, site) : []) };
  } catch (err) {
    return { ids: [], parId: {}, implementees: [], incompletes: [], site: null, erreur: `registre illisible : ${err.message.split('\n')[0]}`, manquantes: () => [] };
  } finally { T.cleanTmp(); }
}

/** Libres pour `slug` : familles / architectures hors pistes sœurs et 4 derniers sites (même règle que ff contrat). */
function libres(slug, melanges, usine, toutesLesPistes = false) {
  const prises = prisesDesSites(melanges);
  const famMd = path.join(ROOT, '.claude', 'skills', 'site-final', 'premiers-ecrans.md');
  const toutes = fs.existsSync(famMd) ? famillesConnues(fs.readFileSync(famMd, 'utf8')) : [];
  // --n 3 retire TOUTES les pistes du client : les anciennes pistes sœurs (<slug>-b, -c…) sont celles qu'on refait, leurs
  // familles et architectures ne sont plus prises (la règle entre pistes sœurs s'applique aux nouveaux tirages).
  const filtrer = (m) => (toutesLesPistes ? retirerPistesSoeurs(m) : m);
  const interditesF = filtrer(famillesInterdites(slug, prises.map((p) => ({ slug: p.slug, famille: p.famille, date: p.date }))));
  const interditesA = filtrer(famillesInterdites(slug, prises.map((p) => ({ slug: p.slug, famille: p.architecture, date: p.date }))));
  const archis = architecturesTirables({ implementees: usine.implementees, interdites: interditesA, manquantes: usine.manquantes });
  return {
    familles: toutes.filter((f) => !interditesF.has(f)),
    architectures: archis.libres, archisEcartees: archis.ecartees,
    interditesF, interditesA,
  };
}

/** La coquille rend-elle `layout.hero` ? (Les coquilles d'architecture qui dessinent leur propre premier écran, non.) */
function heroRendu(shell) {
  const f = path.join(ROOT, 'src', 'shells', `${shell}.astro`);
  return fs.existsSync(f) && /<Hero\b/.test(fs.readFileSync(f, 'utf8'));
}

function ecrireDirection(nom, gen, commentaire) {
  const dir = path.join(ROOT, 'src', 'directions', nom);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.css'), gen.css);
  fs.writeFileSync(path.join(dir, 'meta.ts'), gen.meta);
  const schemaP = path.join(ROOT, 'src', 'lib', 'schema.ts');
  fs.writeFileSync(schemaP, insererDirection(fs.readFileSync(schemaP, 'utf8'), nom, commentaire));
}
function supprimerDirection(nom) {
  fs.rmSync(path.join(ROOT, 'src', 'directions', nom), { recursive: true, force: true });
  const schemaP = path.join(ROOT, 'src', 'lib', 'schema.ts');
  fs.writeFileSync(schemaP, retirerDirection(fs.readFileSync(schemaP, 'utf8'), nom));
}

/** look.json du site : direction, polices, accent, motion, tone ; le reste du look existant est gardé. */
function ecrireLook(slug, nom, gen, typo, motion, layoutEnPlus = {}) {
  const p = path.join(SITES_DIR, slug, 'look.json');
  let look = {};
  try { look = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { /* pas de look.json */ }
  look.direction = nom;
  // Polices et accent écrits aussi dans le look : une surcharge typography/accent du site.config ne doit pas
  // défaire le mélange (vite-ff-look et applyLook fusionnent ces clés).
  look.typography = { display: typo.titre.libre, body: typo.texte.libre };
  look.accent = { h: gen.accent.h, s: gen.accent.s, l: gen.accent.l };
  look.motion = motion;
  look.layout = { ...(look.layout || {}), ...layoutEnPlus, tone: gen.tone };
  fs.writeFileSync(p, JSON.stringify(look, null, 2) + '\n');
}

/** Prépare un mélange tiré : contenus, sources, direction générée. */
function preparer(m, registre, polices) {
  const { parId } = registre;
  const atomes = Object.fromEntries(DIMENSIONS_VALEURS.map((d) => [d, parId[m[d]][d]]));
  const sources = Object.fromEntries(Object.values(parId).map((a) => [a.id, a.source.url]));
  const nom = hashMelange(m);
  const cles = [atomes.typo.titre.libre, atomes.typo.texte.libre, atomes.typo.mono?.libre].filter(Boolean);
  const gen = genererDirection(nom, { atomes, ids: m, sources, polices, metaPolices: metaPolicesDe(polices, cles), date: new Date().toISOString().slice(0, 10) });
  return { nom, atomes, gen };
}

function motionPour(atomes, client) {
  if (client.mouvement === 'calme') return 'subtle';
  const p = PROFILS_MOUVEMENT[atomes.mouvement.profil];
  if (p) return p.motion;
  return atomes.mouvement.defilement === 'suit-le-defilement' ? 'rich' : 'subtle';
}

function decrire(m, prep, k, client = {}, diversite = null) {
  info(`${k ? `Mélange ${k}` : 'Mélange'} : ${prep.nom}`);
  const reg = regimePalette(prep.atomes.couleurs);
  for (const d of DIMENSIONS_VALEURS) info(`  ${d.padEnd(10)} ${m[d]}${d === 'couleurs' && reg ? `   régime ${REGIMES_PALETTE[reg.regime]} (${reg.raison})` : ''}`);
  if (diversite) info(`  ${'palette'.padEnd(10)} pistes sœurs : ${diversite}`);
  info(`  ${'1er écran'.padEnd(10)} ${m.premier_ecran ?? 'à choisir'}   architecture ${m.architecture ?? 'à choisir (aucune architecture de l\'usine ne convient)'}`);
  for (const a of prep.gen.palette.ajustements) info(`  calculé : ${a}`);
  const ph = prep.atomes.photos;
  if (ph.traitement === 'duotone') info(`  à faire : ff nettoyer-photos <slug> --duotone ${prep.gen.palette.tokens.fg},${prep.gen.palette.tokens.bg}`);
  if (ph.traitement === 'detoure') info('  photos détourées : sujet sur fond uni (ff nettoyer-photos recadre ; le détourage se demande au client ou se fait à la main)');
  for (const c of consignesProfil(prep.atomes.mouvement.profil, client)) info(`  ${c}`);
  info(`  ${ligneContrat(m)}`);
}

/* ---------- essai : copies jetables, build, captures côte à côte ---------- */

const VERROU = path.join(ROOT, '.ff-tmp', 'build.lock');
async function avecVerrou(fn) {
  const t0 = Date.now();
  while (fs.existsSync(VERROU)) {
    if (Date.now() - t0 > 10 * 60 * 1000) { warn('verrou de build présent depuis 10 min : on passe outre'); break; }
    await new Promise((r) => setTimeout(r, 2000));
  }
  fs.mkdirSync(path.dirname(VERROU), { recursive: true });
  fs.writeFileSync(VERROU, String(process.pid));
  try { return await fn(); } finally { fs.rmSync(VERROU, { force: true }); }
}

function servir(root) {
  const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json', '.ico': 'image/x-icon' };
  return createServer((req, res) => {
    let f = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f) && fs.existsSync(`${f}.html`)) f = `${f}.html`;
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] ?? 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
}

async function capturer(navigateur, slug) {
  const srv = servir(path.join(DIST_DIR, slug));
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const out = {};
  try {
    for (const [k, vue, hauteur] of [['d', { width: 1400, height: 900 }, 1800], ['m', { width: 390, height: 844 }, 1688]]) {
      const ctx = await navigateur.newContext({ viewport: vue, deviceScaleFactor: 1, isMobile: k === 'm', hasTouch: k === 'm', reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:${srv.address().port}/`, { waitUntil: 'load', timeout: 60_000 });
      const h = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < h; y += 500) { await page.evaluate((yy) => scrollTo(0, yy), y); await page.waitForTimeout(60); }
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(900);
      out[k] = await page.screenshot({ fullPage: true, clip: { x: 0, y: 0, width: vue.width, height: Math.min(hauteur, h) } });
      await ctx.close();
    }
  } finally { srv.close(); }
  return out;
}

async function planche(colonnes, sortie) {
  const sharp = (await import('sharp')).default;
  const L = 640, marge = 16, entete = 88;
  const parts = [];
  let hauteurMax = 0;
  for (const [i, col] of colonnes.entries()) {
    const d = await sharp(col.d).resize({ width: L }).png().toBuffer();
    const dm = await sharp(d).metadata();
    const m = await sharp(col.m).resize({ width: Math.round(L / 2) - 8 }).png().toBuffer();
    const mm = await sharp(m).metadata();
    const x = i * (L + marge);
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const svg = Buffer.from(`<svg width="${L}" height="${entete}"><rect width="100%" height="100%" fill="#fff"/><text x="6" y="22" font-size="16" font-family="Arial" font-weight="bold">${esc(col.titre)}</text><text x="6" y="44" font-size="12" font-family="Arial">${esc(col.ligne1)}</text><text x="6" y="62" font-size="12" font-family="Arial">${esc(col.ligne2)}</text><text x="6" y="80" font-size="12" font-family="Arial">${esc(col.ligne3 ?? '')}</text></svg>`);
    parts.push({ input: svg, left: x, top: 0 });
    parts.push({ input: d, left: x, top: entete });
    parts.push({ input: m, left: x, top: entete + dm.height + 8 });
    hauteurMax = Math.max(hauteurMax, entete + dm.height + 8 + mm.height);
  }
  fs.mkdirSync(path.dirname(sortie), { recursive: true });
  await sharp({ create: { width: colonnes.length * (L + marge), height: hauteurMax, channels: 3, background: '#9a9a9a' } }).composite(parts).jpeg({ quality: 78 }).toFile(sortie);
}

function copierSite(source, copie) {
  const de = path.join(SITES_DIR, source), vers = path.join(SITES_DIR, copie);
  fs.rmSync(vers, { recursive: true, force: true });
  fs.cpSync(de, vers, { recursive: true, filter: (p) => !/[\\/](raw|node_modules)([\\/]|$)/.test(p) });
  const cfg = path.join(vers, 'site.config.ts');
  fs.writeFileSync(cfg, fs.readFileSync(cfg, 'utf8').replace(/slug:\s*'[^']*'/, `slug: '${copie}'`));
}

/* ---------- commande ---------- */

const DRAPEAUX = { typo: 'typo', couleurs: 'couleurs', densite: 'densite', formes: 'formes', photos: 'photos', mouvement: 'mouvement', matiere: 'matiere', architecture: 'architecture', 'premier-ecran': 'premier_ecran' };

/**
 * Pure : « --matiere <id> » devient « --matiere=<id> ». `matiere` est un drapeau booléen pour `ff vitrine`
 * (DRAPEAUX_BOOLEENS de util.mjs) : sans ceci, parseArgs le lisait `true` et l'id passait en argument libre, si bien que
 * l'atome matière imposé était RETIRÉ au hasard (17 oct 2026, L'Épi d'Or B, C, D : trois matières changées en silence,
 * alors que `--n 3` imprime justement « --matiere <id> » dans les lignes à lancer).
 */
export function normaliserArgs(args) {
  const out = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--matiere' && args[i + 1] !== undefined && !args[i + 1].startsWith('--')) out.push(`--matiere=${args[++i]}`);
    else out.push(args[i]);
  }
  return out;
}

export async function cmdMelanger(args) {
  const { positional, flags } = parseArgs(normaliserArgs(args));
  const slug = positional[0];
  if (!slug || !siteExists(slug)) { fail('ff melanger <slug> [--typo id] [--couleurs id] … [--hasard] [--n 3] [--essai]'); process.exit(1); }
  const { registre, polices } = chargerRegistre();
  for (const r of registre.rejets) warn(`registre : ${r}`);
  const imposes = {};
  if (flags.style) for (const d of DIMENSIONS_VALEURS) if (registre.reserves[d].includes(flags.style)) imposes[d] = flags.style;
  for (const [fl, dim] of Object.entries(DRAPEAUX)) if (typeof flags[fl] === 'string') imposes[dim] = flags[fl];
  // --architecture <id de site> : l'architecture de l'atome de ce site.
  if (imposes.architecture && registre.parId[imposes.architecture]?.architecture) imposes.architecture = registre.parId[imposes.architecture].architecture;
  // Architectures : seulement celles que l'usine sait construire (src/lib/architectures.ts, lu maintenant).
  const usine = await architecturesUsine(slug);
  if (usine.erreur) warn(`architectures : ${usine.erreur}${usine.site ? '' : ' (données du client non vérifiées)'}`);
  if (imposes.architecture) {
    const refus = refusArchitectureImposee(imposes.architecture, usine.implementees, architecturesDeVeille());
    if (refus) { fail(refus); process.exit(1); }
    const manque = usine.manquantes(imposes.architecture);
    if (manque.length) warn(`--architecture ${imposes.architecture} : données du client absentes (${manque.join(' ; ')}) : elle tournera à vide`);
  }
  const n = Math.max(1, Number(flags.n) || 1);
  const melanges = lireMelanges();
  const graine = flags.graine != null ? Number(flags.graine) : flags.hasard ? (Date.now() ^ (Math.random() * 2 ** 31)) >>> 0 : seedFromString(`${slug}|${Object.keys(melanges.sites).length}`);
  const rng = mulberry32(graine);
  if (flags.video && !['client', 'animer', 'banque'].includes(flags.video)) { fail('--video client|animer|banque'); process.exit(1); }
  const client = await lireClient(slug, typeof flags.video === 'string' ? flags.video : null);
  const { familles, architectures, archisEcartees, interditesF } = libres(slug, melanges, usine, n > 1);
  const existants = Object.entries(melanges.sites).filter(([s]) => s !== slug).map(([s, v]) => ({ slug: s, atomes: v.atomes }));
  info(`Client ${slug} : ${client.photos} photo(s), la plus large ${client.largeurMax || 0} px${client.tonPhotos ? ` (L* ${Math.round(client.tonPhotos.clarte)}, chaleur ${Math.round(client.tonPhotos.chaleur)})` : ''}, vidéo ${client.video ?? 'aucune'}, mouvement ${client.mouvement ?? 'non tranché'}, ${client.avis} avis${client.urgence ? ', urgence' : ''}.`);
  info(`Registre : ${Object.keys(registre.parId).length} sites, tirables ${DIMENSIONS_VALEURS.map((d) => `${d} ${registre.reserves[d].length}`).join(', ')} ; graine ${graine}.`);
  if (interditesF.size) info(`Familles de premier écran prises : ${[...interditesF.entries()].map(([f, r]) => `${f} (${r})`).join(', ')}.`);
  const aCoder = architecturesDeVeille().filter((a) => !usine.ids.includes(a));
  info(`Architectures de l'usine : ${usine.implementees.length} implémentée(s) (${usine.implementees.join(', ') || 'aucune'}) ; tirables pour ${slug} : ${architectures.join(', ') || 'aucune'}.`);
  for (const e of archisEcartees) info(`  écartée : ${e.id}, ${e.raison}`);
  for (const e of usine.incompletes) info(`  incomplète : ${e.id}, ${e.raison}`);
  if (aCoder.length) info(`  au registre de veille, pas encore codées (jamais tirées) : ${aCoder.join(', ')}.`);
  // Régimes de palette : compte du registre et besoins de collecte.
  const comptes = compterRegimes(registre);
  info(`Palettes tirables par régime : ${Object.entries(comptes).map(([r, c]) => `${REGIMES_PALETTE[r]} ${c}`).join(', ')}.`);
  const besoins = besoinsRegimes(comptes).map((b) => b.phrase);
  const tires = [], diversites = [];
  for (let k = 0; k < n; k++) {
    const r = tirerMelange({ registre, imposes, client, existants, soeurs: tires, familles, architectures, rng });
    if (r.erreur) { fail(r.erreur); process.exit(1); }
    tires.push(r.atomes);
    diversites.push(r.diversite);
  }
  const preps = tires.map((m) => preparer(m, registre, polices));
  tires.forEach((m, i) => decrire(m, preps[i], n > 1 ? i + 1 : 0, client, diversites[i]));
  // Pistes sœurs qui n'ont pas pu tenir trois régimes différents : le registre manque de ce qu'il leur fallait.
  const regimesTires = new Set(preps.map((p) => regimePalette(p.atomes.couleurs)?.regime));
  if (diversites.some((d) => d && d !== NIVEAUX_DIVERSITE[0].nom)) {
    const absents = Object.keys(REGIMES_PALETTE).filter((r) => !regimesTires.has(r));
    besoins.push(`pistes de ${slug} (${n}) : diversité de palette relâchée (${diversites.filter(Boolean).filter((d) => d !== NIVEAUX_DIVERSITE[0].nom).join(' ; ')}) ; la collecte doit ramener des palettes ${absents.map((r) => REGIMES_PALETTE[r]).join(', ') || 'de régimes variés'} compatibles avec ce client`);
  }
  for (const b of besoins) warn(`besoin : ${b}`);
  if (flags.simuler) { info('--simuler : rien n\'est écrit.'); return; }
  const journal = path.join(ROOT, 'docs', 'veille', 'journal.md');
  if (fs.existsSync(journal)) {
    const avant = fs.readFileSync(journal, 'utf8');
    const apres = noterBesoinsJournal(avant, besoins, new Date().toISOString().slice(0, 10));
    if (apres !== avant) { fs.writeFileSync(journal, apres); info(`besoins de collecte notés en tête de ${path.relative(ROOT, journal)}.`); }
  }

  if (flags.essai) {
    // Nommées d'après le style essayé (27 oct 2026) : deux essais lancés ensemble ne s'écrasent plus.
    const etiquette = typeof flags.style === 'string' ? String(flags.style).replace(/[^a-z0-9-]/gi, '').toLowerCase() : '';
    const copies = tires.map((_, i) => `_essai-${etiquette || 'melange'}-${i + 1}`);
    // runAstro écrit .ff-current : on rend le site courant d'avant (il ne doit pas pointer vers une copie supprimée).
    const courant = fs.existsSync(FF_CURRENT) ? fs.readFileSync(FF_CURRENT, 'utf8') : null;
    const colonnes = [];
    const { lancerChrome } = await import('./atomes-mesurer.mjs');
    // Architecture et famille de premier écran appliquées aux copies (layout du look.json), si l'usine sait les rendre.
    const essais = tires.map((m) => layoutEssai({ architecture: m.architecture, archi: usine.parId[m.architecture], famille: m.premier_ecran, client, shellSite: usine.site?.layout?.shell ?? 'flow', heroRendu }));
    try {
      for (const [i, m] of tires.entries()) {
        const p = preps[i];
        copierSite(slug, copies[i]);
        ecrireDirection(p.nom, p.gen, `essai ${copies[i]}`);
        ecrireLook(copies[i], p.nom, p.gen, p.atomes.typo, motionPour(p.atomes, client), essais[i].layout);
        const st = await avecVerrou(async () => runAstro('build', copies[i], [], {}, { silencieux: true }));
        if (st !== 0) throw new Error(`build de ${copies[i]} en échec (${essais[i].notes.join(' ; ')})`);
        const html = path.join(DIST_DIR, copies[i], 'index.html');
        const ecarts = verifierCopie(fs.existsSync(html) ? fs.readFileSync(html, 'utf8') : '', { direction: p.nom, shell: essais[i].shell });
        if (ecarts.length) throw new Error(`${copies[i]} construit sans le mélange voulu : ${ecarts.join(' ; ')}`);
        ok(`${copies[i]} construit (${p.nom} ; ${essais[i].notes.join(' ; ')})`);
      }
      const nav = await lancerChrome();
      try {
        for (const [i, m] of tires.entries()) {
          const shots = await capturer(nav, copies[i]);
          const reg = regimePalette(preps[i].atomes.couleurs);
          colonnes.push({ ...shots, titre: `${i + 1}. ${preps[i].nom}  ·  1er écran ${m.premier_ecran ?? '?'}${essais[i].hero ? '' : ' (non appliqué)'}`, ligne1: `typo ${m.typo}, couleurs ${m.couleurs} (${reg ? REGIMES_PALETTE[reg.regime] : '?'}), densité ${m.densite}, formes ${m.formes}`, ligne2: `photos ${m.photos}, mouvement ${m.mouvement}, matière ${m.matiere}`, ligne3: `architecture ${m.architecture ?? 'aucune (déroulé du site)'}${m.architecture ? ` (coquille ${essais[i].shell})` : ''}` });
        }
      } finally { await nav.close(); }
      const sortie = path.join(ROOT, 'captures', 'planches', `${slug.replace(/^_/, '')}${etiquette ? `-${etiquette}` : ''}-melanges.jpg`);
      await planche(colonnes, sortie);
      ok(`planche : ${path.relative(ROOT, sortie)} (à regarder)`);
    } finally {
      // Les copies et leurs directions sont jetables : rien ne reste, sauf la planche.
      for (const [i, p] of preps.entries()) {
        supprimerDirection(p.nom);
        fs.rmSync(path.join(SITES_DIR, copies[i]), { recursive: true, force: true });
        fs.rmSync(path.join(DIST_DIR, copies[i]), { recursive: true, force: true });
      }
      if (courant != null) fs.writeFileSync(FF_CURRENT, courant); else fs.rmSync(FF_CURRENT, { force: true });
      info(`copies ${copies.join(', ')} et directions d'essai supprimées.`);
    }
    return;
  }
  if (n > 1) {
    info('Trois pistes : appliquer chaque mélange à sa piste en imposant tous ses atomes, par exemple :');
    tires.forEach((m, i) => info(`  node scripts/ff.mjs melanger ${i ? `${slug}-${String.fromCharCode(97 + i)}` : slug} ${DIMENSIONS_VALEURS.map((d) => `--${d} ${m[d]}`).join(' ')}${m.premier_ecran ? ` --premier-ecran ${m.premier_ecran}` : ''}${m.architecture ? ` --architecture ${m.architecture}` : ''}`));
    return;
  }
  // Application à <slug> : direction générée + look.json + registre.
  const m = tires[0], p = preps[0];
  const ancien = melanges.sites[slug]?.direction;
  if (ancien && ancien !== p.nom && !Object.entries(melanges.sites).some(([s, v]) => s !== slug && v.direction === ancien)) supprimerDirection(ancien);
  ecrireDirection(p.nom, p.gen, `mélange de ${slug}`);
  ecrireLook(slug, p.nom, p.gen, p.atomes.typo, motionPour(p.atomes, client));
  if (!slug.startsWith('_')) {
    melanges.sites[slug] = { direction: p.nom, atomes: m, date: new Date().toISOString().slice(0, 10) };
    fs.mkdirSync(path.dirname(REGISTRE_MELANGES), { recursive: true });
    fs.writeFileSync(REGISTRE_MELANGES, JSON.stringify(melanges, null, 1) + '\n');
  }
  ok(`src/directions/${p.nom}/ écrite et enregistrée dans DIRECTIONS ; sites/${slug}/look.json mis à jour${slug.startsWith('_') ? '' : ' ; docs/empreintes/melanges.json'}.`);
  info(`À recopier dans sites/${slug}/direction.md :\n  ${ligneContrat(m)}`);
}
