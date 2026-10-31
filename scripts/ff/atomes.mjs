// Atomes de style : un vrai site étudié par la veille, décomposé en morceaux INDÉPENDANTS (typographie, couleurs,
// densité, formes, photos, mouvement, matière, architecture, premier écran), chacun réutilisable seul par
// `ff melanger`. Un fichier par site : docs/veille/styles/atomes/<id>.json. Format et règles : docs/veille/styles/ATOMES.md.
//
// Pourquoi (fondateur, 18 oct 2026) : « il en faut beaucoup plus. Et je veux pas qu'on se limite à ça, faut faire
// des cross ». Appliquer « le style du site X » en entier donne autant de looks que de sites étudiés ; croiser la typo
// d'un site, les couleurs d'un autre, les photos d'un troisième donne des combinaisons quasi infinies.
//
// Ce module est PUR (aucune lecture de fichier hors `lireAtomes`) : format, validation, couleurs (contraste WCAG,
// dérivations calculées des tokens manquants), règles de compatibilité des polices. Testé par tests/atomes.test.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { IDS_PROFILS } from './mouvements.mjs';

export const A_JUGER = 'à juger';
export const DIMENSIONS = ['typo', 'couleurs', 'densite', 'formes', 'photos', 'mouvement', 'matiere', 'architecture', 'premier_ecran'];
/** Atomes qui portent des valeurs (tokens) ; architecture et premier_ecran ne portent qu'un id. */
export const DIMENSIONS_VALEURS = ['typo', 'couleurs', 'densite', 'formes', 'photos', 'mouvement', 'matiere'];

export const TRAITEMENTS_PHOTO = ['plein-cadre', 'vignette', 'detoure', 'duotone', 'noir-et-blanc', 'cadre', 'masque'];
export const SUPERPOSITIONS = ['aucune', 'voile', 'texte-sur-photo', 'chevauchement'];
export const BOUTONS = ['plein', 'contour', 'texte'];
export const OMBRES = ['aucune', 'douce', 'portee'];
export const LIENS = ['souligne', 'couleur', 'aucun'];
export const DEFILEMENTS = ['aucun', 'apparitions', 'suit-le-defilement'];
export const REGIMES = ['calme', 'vivant'];
export const FONDS_MATIERE = ['uni', 'sections-colorees', 'aplats-francs'];
export const FILETS = ['aucun', 'fins', 'grille'];
export const RYTHMES = ['uni', 'alterne'];
export const CASSES = ['none', 'uppercase', 'lowercase', 'capitalize'];

/**
 * Genre de chaque police du registre (src/lib/fonts.ts), pour les règles de rôles. « affichage » = dessinée pour
 * les grands corps (didones, grasses, condensées, manuscrites) : jamais en texte courant. Une police ajoutée au
 * registre sans genre ici est refusée en texte et acceptée en titre (alerte du validateur).
 */
export const GENRES = {
  ancizarSerif: 'serif', libreCaslonCondensed: 'serif-affichage', epundaSlab: 'slab', literata: 'serif',
  bodoni: 'serif-affichage', gelasio: 'serif', gloock: 'serif-affichage', ebGaramond: 'serif', spectral: 'serif',
  libreBodoni: 'serif-affichage', zillaSlab: 'slab', bitter: 'slab', domine: 'serif', abrilFatface: 'serif-affichage',
  yesevaOne: 'serif-affichage', gildaDisplay: 'serif-affichage', marcellus: 'serif-affichage', savate: 'manuscrite', specialGothic: 'sans', nunito: 'sans', archivo: 'sans',
  workSans: 'sans', figtree: 'sans', epilogue: 'sans', hanken: 'sans', schibsted: 'sans', redHat: 'sans',
  sora: 'sans-affichage', unbounded: 'sans-affichage', bricolage: 'sans-affichage', anybody: 'sans-affichage',
  josefin: 'sans', archivoBlack: 'sans-affichage', bebas: 'condensee', delaGothic: 'sans-affichage',
  oswald: 'condensee', cabin: 'sans', karla: 'sans', rubik: 'sans', urbanist: 'sans', chivo: 'sans-affichage',
  familjenGrotesk: 'sans', lexend: 'sans', publicSans: 'sans', alfaSlabOne: 'slab-affichage', bungee: 'sans-affichage',
  judson: 'serif', lexendZetta: 'sans-affichage', intelOneMono: 'mono', jetbrains: 'mono', spaceMono: 'mono', dmMono: 'mono', fragmentMono: 'mono',
  bigShoulders: 'condensee', azeretMono: 'mono',
  hostGrotesk: 'sans', mulish: 'sans', // 29 oct 2026, styles enduit et ocre
  barlow: 'sans', sacramento: 'manuscrite', permanentMarker: 'manuscrite', libreCaslonText: 'serif', courierPrime: 'mono', // 30 oct 2026, styles pochoir et buvard (farine : archivo, spectral)
};
const AFFICHAGE = new Set(['serif-affichage', 'sans-affichage', 'condensee', 'manuscrite', 'slab-affichage']);

const estAJuger = (v) => v === A_JUGER || v === undefined || v === null;
const estNombre = (v) => typeof v === 'number' && Number.isFinite(v);
const HEX = /^#[0-9a-f]{6}$/i;

/* ---------- couleurs (WCAG 2.x, calcul pur) ---------- */

export function hexVersRgb(hex) {
  let h = String(hex).trim().replace(/^#/, '');
  if (h.length === 3) h = [...h].map((x) => x + x).join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) throw new Error(`couleur hex invalide : ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
export const rgbVersHex = (rgb) => '#' + rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const lin = (v) => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
export function luminanceHex(hex) {
  const [r, g, b] = hexVersRgb(hex);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
/** Rapport de contraste WCAG entre deux couleurs hex (1 à 21). */
export function contraste(a, b) {
  const [l1, l2] = [luminanceHex(a), luminanceHex(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
/** Mélange linéaire en sRGB : t = 0 → a, t = 1 → b. */
export function melangerCouleurs(a, b, t) {
  const A = hexVersRgb(a), B = hexVersRgb(b);
  return rgbVersHex(A.map((v, i) => v + (B[i] - v) * t));
}
export function hexVersHsl(hex) {
  const [r, g, b] = hexVersRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}
export function hslVersHex({ h, s, l }) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return rgbVersHex([f(0) * 255, f(8) * 255, f(4) * 255]);
}
export const estSombre = (hex) => luminanceHex(hex) < 0.18;

/**
 * OKLCH (Björn Ottosson, 2020 ; CSS Color 4) d'une couleur hex : { l (0-1), c (chroma, 0 à ~0,37), h (degrés) }.
 * Espace perceptuellement uniforme : une même chroma « se voit » autant quelle que soit la teinte, ce que HSL ne
 * garantit pas (le jaune HSL 100 % paraît bien plus vif que le bleu HSL 100 %). Sert à la garde de beauté de
 * `ff melanger` (docs/veille/styles/ATOMES.md § Garde de beauté).
 */
export function hexVersOklch(hex) {
  const [r, g, b] = hexVersRgb(hex).map(lin);
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
  let h = (Math.atan2(B, A) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: L, c: Math.hypot(A, B), h };
}
/** Écart de teinte (degrés, 0 à 180) entre deux angles OKLCH. */
export const ecartTeinte = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

/**
 * Pousse la luminosité de `hex` (même teinte, même saturation) jusqu'à `cible` de contraste sur `fond` :
 * plus sombre sur fond clair, plus claire sur fond sombre. Renvoie { hex, ajuste, de, a } ; null si impossible.
 */
export function ajusterPourContraste(hex, fond, cible = 4.5) {
  if (contraste(hex, fond) >= cible) return { hex, ajuste: false };
  const hsl = hexVersHsl(hex);
  const sens = estSombre(fond) ? 1 : -1;
  for (let l = hsl.l; l >= 0 && l <= 100; l += sens) {
    const c = hslVersHex({ ...hsl, l });
    if (contraste(c, fond) >= cible) return { hex: c, ajuste: true, de: hsl.l, a: l };
  }
  return null;
}

/* ---------- validation d'un fichier d'atomes ---------- */

const champ = (erreurs, ok, msg) => { if (!ok) erreurs.push(msg); };

function validerTypo(t, { polices = {}, clesIa = [] }, e, a) {
  for (const role of ['titre', 'texte']) {
    const r = t[role];
    if (!r || typeof r !== 'object') { e.push(`typo.${role} absent`); continue; }
    champ(e, typeof r.famille === 'string' && r.famille, `typo.${role}.famille : la police mesurée sur le site (nom)`);
    if (!estAJuger(r.libre)) {
      if (clesIa.includes(r.libre)) e.push(`typo.${role}.libre « ${r.libre} » est une police de la liste IA (CLES_IA, scripts/ff/ia.mjs)`);
      else if (Object.keys(polices).length && !polices[r.libre]) e.push(`typo.${role}.libre « ${r.libre} » absente du registre src/lib/fonts.ts`);
    }
    if (!estAJuger(r.graisse)) champ(e, estNombre(r.graisse) && r.graisse >= 100 && r.graisse <= 900, `typo.${role}.graisse : 100 à 900`);
    if (!estAJuger(r.interlignage)) champ(e, estNombre(r.interlignage) && r.interlignage > 0.5 && r.interlignage < 3, `typo.${role}.interlignage : rapport (ex. 1.1)`);
  }
  if (t.titre && !estAJuger(t.titre.casse)) champ(e, CASSES.includes(t.titre.casse), `typo.titre.casse : ${CASSES.join(' | ')}`);
  if (t.titre && !estAJuger(t.titre.interlettrage)) champ(e, estNombre(t.titre.interlettrage) && Math.abs(t.titre.interlettrage) < 0.3, 'typo.titre.interlettrage : en em (ex. -0.02)');
  if (t.mono && !estAJuger(t.mono) && !estAJuger(t.mono.libre)) {
    if (clesIa.includes(t.mono.libre)) e.push(`typo.mono.libre « ${t.mono.libre} » est une police de la liste IA`);
    else if (Object.keys(polices).length && !polices[t.mono.libre]) e.push(`typo.mono.libre « ${t.mono.libre} » absente du registre`);
  }
  const ech = t.echelle;
  if (!ech || typeof ech !== 'object') e.push('typo.echelle absente (h1/h2/texte, téléphone et ordinateur, en px)');
  else for (const k of ['h1', 'h2', 'texte']) {
    const v = ech[k];
    if (estAJuger(v)) { if (k !== 'h2') a.push(`typo.echelle.${k} à juger : atome typo inutilisable`); continue; }
    champ(e, estNombre(v.telephone) && estNombre(v.ordinateur) && v.telephone > 6 && v.ordinateur > 6, `typo.echelle.${k} : { telephone, ordinateur } en px`);
  }
}

function validerPalette(p, nom, e) {
  if (!p || typeof p !== 'object') { e.push(`couleurs.${nom} absente`); return; }
  for (const k of ['fond', 'surface', 'texte', 'texte2', 'accent', 'accent2', 'bordure', 'encre']) {
    const v = p[k];
    if (estAJuger(v)) { if (['fond', 'texte', 'accent'].includes(k)) e.push(`couleurs.${nom}.${k} requis (hex mesuré)`); continue; }
    champ(e, HEX.test(v), `couleurs.${nom}.${k} : hex #rrggbb (reçu ${v})`);
  }
}

/**
 * Valide un fichier d'atomes. `polices` = { cle: { role } } (src/lib/fonts.ts), `clesIa` = CLES_IA.
 * Renvoie { erreurs, alertes, utilisables } ; `utilisables[dim]` dit si l'atome peut être tiré par ff melanger.
 */
export function validerAtomes(atomes, opts = {}) {
  const e = [], a = [];
  if (!atomes || typeof atomes !== 'object') return { erreurs: ['fichier vide ou non JSON'], alertes: [], utilisables: {} };
  champ(e, typeof atomes.id === 'string' && /^[a-z0-9-]+$/.test(atomes.id), 'id : minuscules, chiffres, tirets');
  const s = atomes.source;
  if (!s || typeof s !== 'object') e.push('source absente : { url, nom, fiche, date }');
  else {
    champ(e, /^https?:\/\//.test(s.url || ''), 'source.url : adresse du site étudié');
    champ(e, typeof s.nom === 'string' && s.nom, 'source.nom');
    champ(e, /^\d{4}-\d{2}-\d{2}$/.test(s.date || ''), 'source.date : AAAA-MM-JJ');
  }
  const t = atomes.typo;
  if (!estAJuger(t)) validerTypo(t, opts, e, a);
  const c = atomes.couleurs;
  if (!estAJuger(c) && estAJuger(c.principal)) a.push('couleurs.principal à juger : atome couleurs inutilisable (choisir la palette dans couleurs.releve)');
  else if (!estAJuger(c)) {
    champ(e, ['clair', 'sombre'].includes(c.principal), 'couleurs.principal : clair | sombre');
    if (c.clair) validerPalette(c.clair, 'clair', e);
    if (c.sombre) validerPalette(c.sombre, 'sombre', e);
    if (c.principal && !c[c.principal]) e.push(`couleurs.${c.principal} absente alors que principal = ${c.principal}`);
  }
  const d = atomes.densite;
  if (!estAJuger(d)) {
    for (const k of ['section', 'gouttiere']) if (!estAJuger(d[k])) champ(e, estNombre(d[k]?.telephone) && estNombre(d[k]?.ordinateur), `densite.${k} : { telephone, ordinateur } en px`);
    if (!estAJuger(d.conteneur)) champ(e, estNombre(d.conteneur) && d.conteneur >= 600, 'densite.conteneur : largeur max du contenu en px');
    if (!estAJuger(d.mesure)) champ(e, estNombre(d.mesure) && d.mesure >= 25 && d.mesure <= 140, 'densite.mesure : caractères par ligne du texte courant');
    if (!estAJuger(d.rythme)) champ(e, RYTHMES.includes(d.rythme), `densite.rythme : ${RYTHMES.join(' | ')}`);
  }
  const f = atomes.formes;
  if (!estAJuger(f)) {
    for (const k of ['rayon', 'rayonCarte', 'rayonImage', 'bordure']) if (!estAJuger(f[k])) champ(e, estNombre(f[k]) && f[k] >= 0, `formes.${k} : px`);
    if (!estAJuger(f.ombre)) champ(e, OMBRES.includes(f.ombre), `formes.ombre : ${OMBRES.join(' | ')}`);
    if (!estAJuger(f.bouton)) champ(e, BOUTONS.includes(f.bouton), `formes.bouton : ${BOUTONS.join(' | ')}`);
    if (!estAJuger(f.lien)) champ(e, LIENS.includes(f.lien), `formes.lien : ${LIENS.join(' | ')}`);
    if (f.pilule === true) a.push('formes.pilule : boutons pilule mesurés (signe IA, GOUT § 2) : ff melanger les rend à 6 px (cartes à 8 px au plus)');
  }
  const p = atomes.photos;
  if (!estAJuger(p)) {
    if (!estAJuger(p.traitement)) champ(e, TRAITEMENTS_PHOTO.includes(p.traitement), `photos.traitement : ${TRAITEMENTS_PHOTO.join(' | ')}`);
    if (!estAJuger(p.superposition)) champ(e, SUPERPOSITIONS.includes(p.superposition), `photos.superposition : ${SUPERPOSITIONS.join(' | ')}`);
  }
  const m = atomes.mouvement;
  if (!estAJuger(m)) {
    if (!estAJuger(m.regime)) champ(e, REGIMES.includes(m.regime), `mouvement.regime : ${REGIMES.join(' | ')}`);
    if (!estAJuger(m.defilement)) champ(e, DEFILEMENTS.includes(m.defilement), `mouvement.defilement : ${DEFILEMENTS.join(' | ')}`);
    if (!estAJuger(m.profil)) champ(e, IDS_PROFILS.includes(m.profil), `mouvement.profil : un id de docs/veille/styles/MOUVEMENTS.md (${IDS_PROFILS.join(', ')})`);
    else a.push('mouvement.profil à juger : atome mouvement inutilisable (choisir le profil dans MOUVEMENTS.md)');
    for (const k of ['ui', 'scene']) {
      if (estAJuger(m[k])) continue;
      champ(e, estNombre(m[k].duree) && m[k].duree > 0 && m[k].duree <= 3, `mouvement.${k}.duree : secondes`);
      champ(e, typeof m[k].courbe === 'string' && /^(cubic-bezier\([^)]+\)|ease(-in|-out|-in-out)?|linear)$/.test(m[k].courbe.replace(/\s+/g, '')), `mouvement.${k}.courbe : cubic-bezier(…) ou mot-clé CSS`);
    }
  }
  const x = atomes.matiere;
  if (!estAJuger(x)) {
    if (!estAJuger(x.fond)) champ(e, FONDS_MATIERE.includes(x.fond), `matiere.fond : ${FONDS_MATIERE.join(' | ')}`);
    if (!estAJuger(x.filets)) champ(e, FILETS.includes(x.filets), `matiere.filets : ${FILETS.join(' | ')}`);
  }
  if (!estAJuger(atomes.architecture)) champ(e, /^[a-z0-9-]+$/.test(atomes.architecture), 'architecture : id de docs/veille/architectures/INDEX.md');
  if (!estAJuger(atomes.premier_ecran)) champ(e, /^[a-z0-9-]+$/.test(atomes.premier_ecran), 'premier_ecran : id de famille (premiers-ecrans.md)');
  return { erreurs: e, alertes: a, utilisables: e.length ? {} : utilisables(atomes) };
}

/** Pure : quelles dimensions d'un fichier (déjà valide) ff melanger peut tirer. Un champ requis « à juger » = non. */
export function utilisables(x) {
  const t = x.typo, c = x.couleurs, d = x.densite, f = x.formes, p = x.photos, m = x.mouvement, mt = x.matiere;
  const pal = !estAJuger(c) && !estAJuger(c.principal) && c[c.principal];
  return {
    typo: !estAJuger(t) && !estAJuger(t.titre?.libre) && !estAJuger(t.texte?.libre) && !estAJuger(t.echelle?.h1) && !estAJuger(t.echelle?.texte),
    couleurs: Boolean(pal && HEX.test(pal.fond || '') && HEX.test(pal.texte || '') && HEX.test(pal.accent || '')),
    densite: !estAJuger(d) && !estAJuger(d.section) && !estAJuger(d.gouttiere) && !estAJuger(d.conteneur),
    formes: !estAJuger(f) && !estAJuger(f.rayon) && !estAJuger(f.rayonCarte) && !estAJuger(f.bouton) && !estAJuger(f.ombre),
    photos: !estAJuger(p) && !estAJuger(p.traitement),
    mouvement: !estAJuger(m) && !estAJuger(m.ui) && !estAJuger(m.scene) && !estAJuger(m.defilement) && !estAJuger(m.regime) && !estAJuger(m.profil),
    matiere: !estAJuger(mt) && !estAJuger(mt.fond) && !estAJuger(mt.filets),
    architecture: !estAJuger(x.architecture),
    premier_ecran: !estAJuger(x.premier_ecran),
  };
}

/* ---------- règles de compatibilité (pures) ---------- */

/**
 * Rôles de polices : le texte courant n'est jamais une police d'affichage (didone, grasse, condensée, manuscrite),
 * donc jamais deux serif d'affichage ni deux manuscrites ; jamais deux polices différentes du même genre (accord en
 * conflit) ; aucune police de la liste IA ; police du registre.
 * `polices` = { cle: { role } }. Renvoie la liste des raisons de refus (vide = cohérent).
 */
export function controlerPolices(typo, { polices = {}, clesIa = [] } = {}) {
  const r = [];
  const titre = typo?.titre?.libre, texte = typo?.texte?.libre, mono = typo?.mono?.libre;
  for (const [role, cle] of [['titre', titre], ['texte', texte], ['mono', mono]]) {
    if (!cle || cle === A_JUGER) continue;
    if (clesIa.includes(cle)) r.push(`${role} : ${cle} est une police IA`);
    else if (!polices[cle]) r.push(`${role} : ${cle} absente du registre`);
  }
  const gTitre = GENRES[titre], gTexte = GENRES[texte];
  if (texte && polices[texte] && polices[texte].role === 'display') r.push(`texte : ${texte} est une police de titre (role display)`);
  if (gTexte && AFFICHAGE.has(gTexte)) r.push(`texte : ${texte} est une police d'affichage (${gTexte})`);
  if (texte && !gTexte) r.push(`texte : ${texte} sans genre connu (GENRES, scripts/ff/atomes.mjs)`);
  if (gTitre === 'manuscrite' && gTexte === 'manuscrite') r.push('deux manuscrites');
  if (gTitre === 'serif-affichage' && gTexte === 'serif-affichage') r.push('deux serif d\'affichage');
  if (mono && GENRES[mono] && GENRES[mono] !== 'mono') r.push(`mono : ${mono} n'est pas une chasse fixe`);
  // Accord par contraste, jamais par conflit (Bringhurst, « The Elements of Typographic Style » § 6.5 ; Butterick,
  // « Practical Typography », Font pairing) : deux polices DIFFÉRENTES du même genre (deux serifs, deux sans de
  // texte, deux slabs, deux chasses fixes) se ressemblent assez pour avoir l'air d'une erreur, pas assez pour faire
  // un contraste. Une seule famille (titre = texte) ou deux genres nettement différents.
  if (titre && texte && titre !== texte && gTitre && gTexte) {
    const famille = (g) => (/^serif|^slab/.test(g) ? 'serif' : g === 'sans' ? 'sans' : g === 'mono' ? 'mono' : g);
    if (famille(gTitre) === famille(gTexte) && ['serif', 'sans', 'mono'].includes(famille(gTitre))) r.push(`accord en conflit : ${titre} et ${texte} sont deux ${famille(gTitre) === 'serif' ? 'serifs' : famille(gTitre) === 'sans' ? 'sans de texte' : 'chasses fixes'} différentes (une seule famille, ou deux genres nettement différents)`);
  }
  // Règle apprise (essai du 23 oct 2026, `ff melanger demo-boulangerie --n 3 --hasard --essai`, mélange m-c94c90, typo
  // loewe) : un h1 mesuré à peine plus grand que le texte (18 px pour 14, et le texte de l'usine ne descend jamais sous
  // 16 px) donne un titre qui ne se voit plus au téléphone : le métier et la ville du h1 (GOUT § 0) disparaissent dans
  // le texte. Le h1 doit faire au moins 1,2 fois le texte au téléphone.
  const e = typo?.echelle;
  if (typeof e?.h1?.telephone === 'number' && typeof e?.texte?.telephone === 'number') {
    const corps = Math.max(16, e.texte.telephone);
    if (e.h1.telephone < corps * TITRE_DOMINE) r.push(`titre qui ne domine pas : h1 ${e.h1.telephone} px pour un texte de ${corps} px au téléphone (${TITRE_DOMINE} fois au moins)`);
  }
  return r;
}

/** Rapport minimal h1 / texte au téléphone (règle apprise du 23 oct 2026, voir controlerPolices). */
export const TITRE_DOMINE = 1.2;

/**
 * Palette complète des tokens de l'usine à partir d'une palette d'atome (fond, texte, accent mesurés ; le reste
 * mesuré ou DÉRIVÉ par calcul, jamais choisi au goût). Contrôle AA : texte/fond et texte secondaire/fond ≥ 4,5,
 * accent/fond ≥ 4,5 (l'accent sert de couleur de texte dans les sections : sur-titres, liens), texte sur accent
 * ≥ 4,5, bloc encre ≥ 4,5. Ce qui manque est ajusté en luminosité (même teinte) et noté dans `ajustements`.
 * Renvoie { tokens, ajustements, refus } ; refus non vide = palette inutilisable (texte illisible sur son fond).
 */
export function paletteComplete(p) {
  const refus = [], ajustements = [];
  const fond = p.fond, texte = p.texte;
  if (contraste(texte, fond) < 4.5) refus.push(`texte ${texte} sur fond ${fond} : ${contraste(texte, fond).toFixed(2)}:1 < 4,5`);
  const sombre = estSombre(fond);
  const surface = HEX.test(p.surface || '') ? p.surface : melangerCouleurs(fond, sombre ? texte : '#ffffff', sombre ? 0.05 : 0.5);
  const bg2 = surface.toLowerCase() !== fond.toLowerCase() ? surface : melangerCouleurs(fond, texte, 0.04);
  // Le texte principal se pose aussi sur la surface (cartes, bandes) : une palette sombre relevée avec une surface blanche
  // et un texte blanc donnait des sections entières invisibles (cafeomnia, demo-brasserie, 29 oct 2026).
  if (contraste(texte, surface) < 4.5) refus.push(`texte ${texte} sur surface ${surface} : ${contraste(texte, surface).toFixed(2)}:1 < 4,5`);
  // Chaque couleur de texte doit tenir sur les trois fonds où les sections la posent (fond, fond alterné, surface).
  const fonds = [fond, bg2, surface];
  const tenir = (couleur, nom) => {
    let c = couleur;
    for (const f of fonds) {
      if (contraste(c, f) >= 4.5) continue;
      const adj = ajusterPourContraste(c, f, 4.5);
      if (!adj) { refus.push(`${nom} ${couleur} illisible sur ${f}`); return c; }
      c = adj.hex;
    }
    return c;
  };
  const muted0 = HEX.test(p.texte2 || '') ? p.texte2 : melangerCouleurs(texte, fond, 0.3);
  const muted = tenir(muted0, 'texte secondaire');
  if (muted !== muted0) ajustements.push(`texte secondaire ${muted0} → ${muted} (AA sur les fonds)`);
  const line = HEX.test(p.bordure || '') ? p.bordure : melangerCouleurs(fond, texte, 0.16);
  let accent2 = HEX.test(p.accent2 || '') ? p.accent2 : null;
  const accent = tenir(p.accent, 'accent');
  if (accent !== p.accent) {
    ajustements.push(`accent ${p.accent} → ${accent} pour le texte (AA sur les fonds) ; la couleur mesurée reste en accent 2 (aplats, survols)`);
    accent2 = accent2 || p.accent;
  }
  // Aplat (boutons pleins, sélection) : la couleur MESURÉE, même quand elle a dû être assombrie pour servir de texte.
  // Le jaune de Paput reste jaune sur les boutons ; le texte d'accent est l'ocre lisible.
  const fill = p.accent;
  accent2 ||= hslVersHex({ ...hexVersHsl(accent), l: Math.max(0, Math.min(100, hexVersHsl(accent).l + (sombre ? 10 : -10))) });
  // Texte posé sur un aplat : une couleur de la palette (texte ou fond) si elle tient 4,5:1, sinon blanc ou noir.
  const parContraste = (couleur, liste) => [...liste].sort((x, y) => contraste(y, couleur) - contraste(x, couleur));
  const choisirSur = (couleur) => parContraste(couleur, [texte, fond]).find((x) => contraste(x, couleur) >= 4.5) || parContraste(couleur, ['#ffffff', '#111111'])[0];
  const onAccent = choisirSur(accent);
  const onFill = choisirSur(fill);
  if (contraste(onFill, fill) < 4.5) refus.push(`aucun texte lisible sur l'aplat ${fill}`);
  if (contraste(onAccent, accent) < 4.5) refus.push(`aucun texte lisible sur l'accent ${accent}`);
  let ink, onInk;
  if (HEX.test(p.encre || '') && Math.abs(luminanceHex(p.encre) - luminanceHex(fond)) > 0.3) { ink = p.encre; onInk = choisirSur(ink); }
  else if (sombre) { ink = melangerCouleurs(fond, '#000000', 0.5); onInk = texte; }
  else { ink = texte; onInk = fond; }
  if (contraste(onInk, ink) < 4.5) refus.push(`bloc encre ${ink} sans texte lisible`);
  return {
    tokens: { bg: fond, bg2, surface, fg: texte, muted, line, accent, accent2, onAccent, fill, onFill, ink, onInk, sombre },
    ajustements,
    refus,
  };
}

/* ---------- lecture du registre ---------- */

export const DOSSIER_ATOMES = path.join('docs', 'veille', 'styles', 'atomes');

/** Lit tous les fichiers d'atomes d'un dossier. Renvoie [{ fichier, atomes, erreurJson }]. */
export function lireAtomes(dossier) {
  if (!fs.existsSync(dossier)) return [];
  return fs.readdirSync(dossier).filter((f) => f.endsWith('.json')).sort().map((f) => {
    try { return { fichier: f, atomes: JSON.parse(fs.readFileSync(path.join(dossier, f), 'utf8')) }; }
    catch (err) { return { fichier: f, atomes: null, erreurJson: err.message }; }
  });
}

/** Catalogue des polices tel que les règles le lisent : { cle: { role, family, pkg } } depuis le texte de fonts.ts. */
export function policesDuRegistre(texteFonts) {
  const out = {};
  const re = /^\s*(\w+):\s*\{\s*family:\s*"([^"]+)",\s*pkg:\s*'([^']+)',\s*role:\s*'([^']+)'/gm;
  for (const m of texteFonts.matchAll(re)) out[m[1]] = { family: m[2], pkg: m[3], role: m[4] };
  return out;
}
