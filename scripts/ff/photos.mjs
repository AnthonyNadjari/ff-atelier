// `ff photos <slug> "<requete>"` : cherche des photos libres de droit, ecrit une feuille de contact
// HTML pour choisir, puis copie les images retenues dans le site et consigne l'attribution dans
// CREDITS.md.
//
// Quatre sources :
//   - unsplash / pexels   : avec cle dans .env (UNSPLASH_ACCESS_KEY / PEXELS_API_KEY), licences maison
//                           sans attribution obligatoire.
//   - openverse           : SANS cle (api.openverse.org, acces anonyme : 20 requetes/min, 200/jour),
//                           index Creative Commons (Flickr, Rawpixel, Wikimedia, StockSnap...).
//   - wikimedia           : SANS cle (commons.wikimedia.org, API MediaWiki), originaux souvent > 4000 px.
//   Choix automatique : Unsplash/Pexels si une cle existe, sinon Openverse puis Wikimedia en repli
//   quand Openverse ne rend pas assez de candidats exploitables.
//
// Filtre commun aux sources sans cle : licence CC0 / domaine public / CC BY / CC BY-SA uniquement
// (jamais NC ni ND), largeur >= --min-largeur (1600 par defaut), pas de logo/dessin/schema/carte
// (categories Wikimedia, tags Openverse, mots du titre), pas de restriction "marque"/"droit a l'image".
//
// Deux facons de choisir :
//   --choisir 1,3   : a la main, apres avoir regarde .ff-tmp/photos/apercu.html.
//   --auto N        : sans intervention, les N meilleures selon un score : licence la plus permissive,
//                     resolution, ratio adapte au slot (--ratio), nettete (variance du laplacien via
//                     sharp sur une miniature 512 px, image floue rejetee), et absence de texte
//                     incruste quand les metadonnees le laissent deviner (posters, panneaux, memes...
//                     — heuristique par mots-cles uniquement, pas d'OCR).
//
// Deux destinations :
//   sans --nom      : public/images/photo-<n>.webp (+ -800.webp), comportement historique.
//   --nom hero      : raw/hero.jpg (ou raw/hero-1.jpg, -2... si plusieurs), recadre au --ratio via
//                     sharp.strategy.attention (meme recadrage focal que `ff nettoyer-photos`), puis
//                     `ff images <slug>` produit les AVIF/WebP multi-largeurs et le manifeste.
//
// Usage :
//   ff photos <slug> "<requete>" [--source unsplash|pexels|openverse|wikimedia] [--n 8]
//            [--orientation landscape|portrait|squarish] [--choisir 1,3]
//            [--auto N] [--nom hero] [--ratio 3:2|4:3|16:9|1:1] [--min-largeur 1600] [--largeur 2400]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {
  SITES_DIR,
  resolveSlug,
  parseArgs,
  envKey,
  appendCredits,
  slugify,
  ok,
  fail,
  warn,
  info,
  c,
} from './util.mjs';

// ---- 1. Table FR -> EN, 40 metiers (docs/veille/ressources.md §1 : la recherche en francais est
// faible sur ces bibliotheques, l'anglais generique donne de bien meilleurs resultats). ----
const METIERS_FR_EN = {
  plombier: 'plumber pipes',
  plomberie: 'plumber pipes workshop',
  electricien: 'electrician wiring',
  electricite: 'electrician wiring tools',
  menuisier: 'carpenter woodworking workshop',
  menuiserie: 'carpentry woodworking workshop',
  ebeniste: 'cabinetmaker fine woodworking',
  boulanger: 'baker kneading dough bakery',
  boulangerie: 'bakery bread shop',
  patissier: 'pastry chef cakes bakery',
  patisserie: 'pastry shop cakes',
  coiffeur: 'hair salon barber',
  coiffure: 'hair salon barber shop',
  barbier: 'barber shop',
  macon: 'mason bricklayer construction site',
  maconnerie: 'mason bricklayer construction site',
  peintre: 'house painter painting wall',
  peinture: 'house painter painting',
  serrurier: 'locksmith key lock',
  vitrier: 'glazier glass window',
  couvreur: 'roofer roof tiles',
  couverture: 'roofer roof tiles',
  chauffagiste: 'heating engineer boiler',
  garagiste: 'car mechanic garage workshop',
  garage: 'car mechanic garage workshop',
  mecanicien: 'car mechanic workshop',
  fleuriste: 'florist flower shop',
  boucher: 'butcher shop meat',
  boucherie: 'butcher shop meat',
  charcutier: 'delicatessen charcuterie shop',
  traiteur: 'catering caterer food',
  restaurateur: 'restaurant chef kitchen',
  restaurant: 'restaurant kitchen chef',
  architecte: 'architect blueprint office',
  avocat: 'lawyer office law books',
  notaire: 'notary office law',
  comptable: 'accountant office finance',
  veterinaire: 'veterinarian vet clinic animal',
  dentiste: 'dentist dental clinic',
  osteopathe: 'osteopath physiotherapy clinic',
  masseur: 'massage therapist spa',
  esthetique: 'beauty salon spa treatment',
  paysagiste: 'landscaper gardening',
  jardinier: 'gardener garden tools',
  ferronnier: 'blacksmith ironwork forge',
  tapissier: 'upholsterer upholstery fabric',
  ceramiste: 'ceramist pottery workshop',
  tatoueur: 'tattoo artist studio',
  photographe: 'photographer camera studio',
  demenageur: 'mover moving truck boxes',
  antenniste: 'tv aerial installer roof antenna',
  vigneron: 'winemaker vineyard wine',
  apiculteur: 'beekeeper bee hive honey',
};

function stripAccents(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Traduit une requete FR -> EN mot par mot via METIERS_FR_EN ; laisse les mots inconnus tels quels. */
export function traduire(requete) {
  const mots = String(requete).trim().split(/\s+/);
  let touche = false;
  const out = mots.map((mot) => {
    const cle = stripAccents(mot).toLowerCase().replace(/[^a-z0-9]/g, '');
    if (METIERS_FR_EN[cle]) {
      touche = true;
      return METIERS_FR_EN[cle];
    }
    return mot;
  });
  return { requeteEn: out.join(' '), touche };
}

const SOURCES = ['unsplash', 'pexels', 'openverse', 'wikimedia'];
const SOURCES_A_CLE = { unsplash: 'UNSPLASH_ACCESS_KEY', pexels: 'PEXELS_API_KEY' };
const ORIENTATIONS = new Set(['landscape', 'portrait', 'squarish']);
const UA = 'ff-atelier/1.0 (https://finckfisch.fr ; photos libres pour sites vitrines d artisans) node';

// Delai entre deux appels a une meme API (Openverse anonyme : 20/min -> 3,2 s ; Wikimedia : politesse).
const DELAI_MS = { openverse: 3200, wikimedia: 1000, unsplash: 0, pexels: 0 };
const dernierAppel = {};
function dormir(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
/** fetch JSON avec User-Agent, espacement par source et gestion du 429 (attend Retry-After, 60 s par defaut, une seule fois). */
async function fetchJsonPoli(source, url, init = {}) {
  const attente = (dernierAppel[source] || 0) + (DELAI_MS[source] || 0) - Date.now();
  if (attente > 0) await dormir(attente);
  const headers = { 'User-Agent': UA, Accept: 'application/json', ...(init.headers || {}) };
  for (let essai = 0; essai < 2; essai++) {
    dernierAppel[source] = Date.now();
    const res = await fetch(url, { ...init, headers });
    if (res.status === 429 && essai === 0) {
      const retry = Number(res.headers.get('retry-after')) || 60;
      warn(`${source} : quota atteint (429), attente ${retry} s avant une nouvelle tentative...`);
      await dormir(retry * 1000);
      continue;
    }
    if (!res.ok) throw new Error(`${source} a repondu ${res.status} (${res.statusText}).`);
    return res.json();
  }
  throw new Error(`${source} : quota toujours atteint apres attente.`);
}

function keyInstructions(source) {
  if (source === 'unsplash') {
    return '  UNSPLASH_ACCESS_KEY=...  (https://unsplash.com/developers -> "New Application", cle "Access Key")';
  }
  return '  PEXELS_API_KEY=...       (https://www.pexels.com/api/ -> creer un compte, cle fournie immediatement)';
}

function failNoKey(requested) {
  fail(`Aucune cle API pour la source demandee (--source ${requested}).`);
  info('');
  info('Ajoute la cle dans .env (copie .env.example a la racine) :');
  info(keyInstructions(requested));
  info('');
  info('Ou utilise une source sans cle : --source openverse ou --source wikimedia (choisies automatiquement sans --source).');
  process.exit(1);
}

// ---- 2. Licences ----
// Codes normalises : cc0, pdm (domaine public), by, by-sa ; unsplash, pexels (licences maison).
// Score : plus c'est permissif, plus c'est haut. NC/ND -> jamais retenu (usage commercial du client,
// recadrage = adaptation).
const LICENCES_OK = new Set(['cc0', 'pdm', 'by', 'by-sa', 'unsplash', 'pexels']);
const SCORE_LICENCE = { cc0: 30, pdm: 30, unsplash: 30, pexels: 30, by: 20, 'by-sa': 12 };
const LICENCE_LABEL = {
  cc0: 'CC0 1.0 (domaine public, aucune attribution requise)',
  pdm: 'Domaine public (Public Domain Mark, aucune attribution requise)',
  by: 'CC BY — attribution obligatoire (auteur, licence, lien source)',
  'by-sa': 'CC BY-SA — attribution obligatoire + la photo recadree reste sous BY-SA',
  unsplash: 'Unsplash License (https://unsplash.com/license) — usage commercial libre, attribution non requise en usage direct',
  pexels: 'Pexels License (https://www.pexels.com/license/) — usage commercial libre, sans attribution obligatoire',
};

/** true si la licence normalisee autorise l'usage commercial avec adaptation. */
export function licenceOk(code) {
  return LICENCES_OK.has(String(code || '').toLowerCase());
}

/** Openverse : `license` (by, by-sa, cc0, pdm, by-nc...) -> code normalise ou ''. */
export function normaliserLicenceOpenverse(license) {
  const l = String(license || '').toLowerCase();
  return licenceOk(l) ? l : '';
}

/** Wikimedia : LicenseShortName ("CC BY-SA 4.0", "CC0", "Public domain", "CC BY-NC 2.0"...) -> code normalise ou ''. */
export function normaliserLicenceWikimedia(shortName, { copyrighted } = {}) {
  const s = String(shortName || '').trim().toLowerCase();
  if (!s) return '';
  if (/\bnc\b|\bnd\b/.test(s)) return '';
  if (/^cc0\b|^cc-zero|^cc zero/.test(s)) return 'cc0';
  if (/public domain|^pd\b|^pd-|no restrictions|domaine public/.test(s) || String(copyrighted).toLowerCase() === 'false') return 'pdm';
  if (/^cc[ -]by[ -]sa\b/.test(s)) return 'by-sa';
  if (/^cc[ -]by\b/.test(s)) return 'by';
  return '';
}

// ---- 3. Photo plausible ? (exclut logos, dessins, schemas, cartes, scans, posters, captures...) ----
const MOTS_EXCLUS = [
  'logo', 'logos', 'clipart', 'clip art', 'drawing', 'drawings', 'illustration', 'illustrations', 'vector', 'svg',
  'diagram', 'diagrams', 'schematic', 'map', 'maps', 'icon', 'icons', 'screenshot', 'screenshots', 'poster', 'posters',
  'sign', 'signs', 'signage', 'meme', 'chart', 'charts', 'cartoon', 'cartoons', 'painting', 'paintings', 'engraving',
  'engravings', 'lithograph', 'lithographs', 'postcard', 'postcards', 'scan', 'scans', 'scanned', 'sheet music',
  'coat of arms', 'coats of arms', 'flag', 'flags', 'stamp', 'stamps', 'banknote', 'banknotes', 'advertisement',
  'advertisements', 'animated', 'gif', 'artwork', 'artworks', 'sculpture', 'sculptures', 'text', 'infographic',
  'render', 'rendering', '3d model', 'dpla', 'museum', 'museums', 'museo', 'musee', 'musée', 'exhibit', 'exhibition',
  'exhibits', 'display', 'catalog', 'catalogue', 'book', 'books', 'manuscript', 'manuscripts', 'letter', 'letters',
  'document', 'documents', 'correspondence', 'page', 'pages', 'archive', 'archives', 'plan', 'plans', 'blueprint',
  'label', 'labels', 'menu', 'certificate', 'newspaper', 'magazine', 'cover', 'typography', 'lettering', 'watermark',
];
const RE_EXCLUS = new RegExp(`(^|[^a-z])(${MOTS_EXCLUS.map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})([^a-z]|$)`, 'i');

/**
 * Vrai si rien, dans le titre, les tags, les categories, la categorie Openverse ou les restrictions
 * Wikimedia, ne laisse penser que ce n'est pas une photo exploitable (logo, dessin, texte incruste,
 * marque deposee, droit a l'image). Heuristique par mots-cles : pas d'analyse d'image.
 */
export function estPhotoPlausible(cand) {
  if (cand.categorie && cand.categorie !== 'photograph') return false; // Openverse : digitized_artwork / illustration
  if (/trademark|personality|insignia/i.test(cand.restrictions || '')) return false;
  if (cand.mime && !/^image\/(jpeg|png|webp|tiff)$/i.test(cand.mime)) return false;
  const texte = [cand.title, ...(cand.tags || []), ...(cand.categories || [])].join(' | ');
  return !RE_EXCLUS.test(texte);
}

// ---- 4. Ratio / recadrage ----
export function parseRatio(s) {
  if (!s) return 0;
  const m = String(s).trim().match(/^(\d+(?:\.\d+)?)\s*[:/x]\s*(\d+(?:\.\d+)?)$/);
  if (m) return Number(m[1]) / Number(m[2]);
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

/** Plus grand cadre de ratio `ratio` contenu dans (w, h), plafonne a `largeurMax` de large. */
export function cadreCible(w, h, ratio, largeurMax = 1600) {
  if (!ratio) {
    const cw = Math.min(w, largeurMax);
    return { width: cw, height: Math.round((h * cw) / w) };
  }
  let cw = Math.min(w, Math.floor(h * ratio));
  cw = Math.min(cw, largeurMax);
  return { width: cw, height: Math.round(cw / ratio) };
}

// ---- 5. Score ----
export const SEUIL_NETTETE = 20; // variance du laplacien (miniature 512 px, gris) sous laquelle l'image est rejetee comme floue.
//  Calibrage 20 sept 2026 : photo Flickr nette 246, la meme floutee de 2 px 40, de 4 px 8,6 ;
//  placeholders `ff placeholders` (degrades) 2,8-4,1 ; premiere sequence de la forge (floue) 3,1.

/** Score sur les metadonnees seules (avant tout telechargement) : licence + resolution + ratio. */
export function scoreMeta(cand, { ratioCible = 0, minLargeur = 1600 } = {}) {
  let s = SCORE_LICENCE[cand.licence] || 0;
  const w = Number(cand.width) || 0;
  const h = Number(cand.height) || 0;
  if (w >= minLargeur) s += Math.min(20, 8 + 6 * Math.log2(w / minLargeur)); // 1600 -> 8, 3200 -> 14, 6400 -> 20
  if (ratioCible && w && h) {
    const ecart = Math.abs(Math.log(w / h / ratioCible));
    s += Math.max(-10, 20 - 40 * ecart); // ratio exact 20, 3:2 vs 4:3 (~0,12) 15, portrait pour un slot paysage -> -10
  }
  return Math.round(s * 10) / 10;
}

/** Variance du laplacien (miniature 512 px, gris). Plus c'est haut, plus c'est net. */
export async function nettete(input) {
  const { data } = await sharp(input)
    .rotate()
    .resize({ width: 512, withoutEnlargement: true })
    .greyscale()
    .convolve({ width: 3, height: 3, kernel: [0, 1, 0, 1, -4, 1, 0, 1, 0], scale: 1, offset: 128 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  let sum = 0;
  let sum2 = 0;
  const n = data.length;
  for (let i = 0; i < n; i++) {
    const v = data[i] - 128;
    sum += v;
    sum2 += v * v;
  }
  const mean = sum / n;
  return sum2 / n - mean * mean;
}

/** Contribution de la nettete au score : 0 sous le seuil, jusqu'a 30 vers 300. */
export function scoreNettete(v) {
  if (v < SEUIL_NETTETE) return 0;
  return Math.round(Math.min(30, ((v - SEUIL_NETTETE) / 280) * 30) * 10) / 10;
}

// ---- 6. Sources ----
async function chercherUnsplash({ requeteEn, n, orientation }) {
  const key = envKey('UNSPLASH_ACCESS_KEY');
  const params = new URLSearchParams({ query: requeteEn, per_page: String(n), client_id: key });
  if (orientation) params.set('orientation', orientation);
  const data = await fetchJsonPoli('unsplash', `https://api.unsplash.com/search/photos?${params.toString()}`);
  return (data.results || []).map((r) => ({
    source: 'unsplash',
    id: r.id,
    title: r.alt_description || r.description || '',
    photographer: r.user?.name || 'inconnu',
    photographerUrl: r.user?.links?.html || '',
    pageUrl: r.links?.html || '',
    thumbUrl: r.urls?.small || r.urls?.thumb,
    fullUrl: r.urls?.full || r.urls?.regular,
    downloadLocation: r.links?.download_location,
    width: r.width,
    height: r.height,
    licence: 'unsplash',
    licenceUrl: 'https://unsplash.com/license',
    tags: (r.tags || []).map((t) => t.title).filter(Boolean),
  }));
}

async function chercherPexels({ requeteEn, n, orientation }) {
  const key = envKey('PEXELS_API_KEY');
  const params = new URLSearchParams({ query: requeteEn, per_page: String(n) });
  if (orientation) params.set('orientation', orientation === 'squarish' ? 'square' : orientation);
  const data = await fetchJsonPoli('pexels', `https://api.pexels.com/v1/search?${params.toString()}`, { headers: { Authorization: key } });
  return (data.photos || []).map((p) => ({
    source: 'pexels',
    id: p.id,
    title: p.alt || '',
    photographer: p.photographer || 'inconnu',
    photographerUrl: p.photographer_url || '',
    pageUrl: p.url || '',
    thumbUrl: p.src?.medium,
    fullUrl: p.src?.large2x || p.src?.original,
    downloadLocation: undefined,
    width: p.width,
    height: p.height,
    licence: 'pexels',
    licenceUrl: 'https://www.pexels.com/license/',
    tags: [],
  }));
}

/**
 * Openverse (https://api.openverse.org/v1/images/), anonyme. `license_type=commercial` exclut deja NC ;
 * ND est refiltre par licenceOk. Pas de `size`/`category` cote API (trop restrictifs : ils vident les
 * resultats Flickr, qui n'ont pas de categorie) — le tri se fait ici. Le champ `url` (fichier chez le
 * fournisseur) sert pour la vignette ET le fichier final : l'endpoint /thumbnail/ de l'API compte dans
 * le quota, pas les fichiers Flickr/Rawpixel.
 */
async function chercherOpenverse({ requeteEn, n, orientation }) {
  const params = new URLSearchParams({
    q: requeteEn.slice(0, 200),
    license_type: 'commercial',
    page_size: String(Math.min(50, Math.max(n, 20))),
    mature: 'false',
  });
  if (orientation === 'landscape') params.set('aspect_ratio', 'wide');
  else if (orientation === 'portrait') params.set('aspect_ratio', 'tall');
  else if (orientation === 'squarish') params.set('aspect_ratio', 'square');
  const data = await fetchJsonPoli('openverse', `https://api.openverse.org/v1/images/?${params.toString()}`);
  // Flickr (`_b.jpg`), Rawpixel (`editor_1024`) et StockSnap (`960w`) ne servent qu'un derive reduit via
  // `url`, quelle que soit la largeur annoncee : on ramene width/height a ce que l'on pourra vraiment
  // telecharger (seuls les fichiers heberges sur Wikimedia arrivent en pleine resolution).
  const PLAFOND = { flickr: 1024, rawpixel: 1024, stocksnap: 960 };
  const largeurReelle = (r) => (PLAFOND[r.provider] && r.width > PLAFOND[r.provider] ? PLAFOND[r.provider] : r.width);
  return (data.results || []).map((r) => ({
    source: 'openverse',
    fournisseur: r.provider || r.source || '',
    id: r.id,
    title: r.title || '',
    photographer: r.creator || 'inconnu',
    photographerUrl: r.creator_url || '',
    pageUrl: r.foreign_landing_url || r.detail_url || '',
    thumbUrl: r.url,
    fullUrl: r.url,
    width: largeurReelle(r),
    height: r.width ? Math.round((r.height * largeurReelle(r)) / r.width) : r.height,
    licence: normaliserLicenceOpenverse(r.license),
    licenceVersion: r.license_version || '',
    licenceUrl: r.license_url || '',
    categorie: r.category || '',
    tags: (r.tags || []).map((t) => t.name).filter(Boolean),
    attribution: r.attribution || '',
  }));
}

/**
 * Wikimedia Commons (API MediaWiki, sans cle). Recherche CirrusSearch dans l'espace Fichier avec
 * `filetype:bitmap filew:>N` (largeur minimale filtree cote serveur), imageinfo avec extmetadata
 * (licence, auteur, categories, restrictions) et une vignette 2000 px rendue par Wikimedia (evite de
 * telecharger des originaux de 20 Mo).
 */
async function chercherWikimedia({ requeteEn, n, minLargeur }) {
  const gsrsearch = `filetype:bitmap -filemime:image/gif filew:>${Math.max(0, minLargeur - 1)} ${requeteEn}`;
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch,
    gsrnamespace: '6',
    gsrlimit: String(Math.min(50, Math.max(n, 20))),
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata|mime',
    iiurlwidth: '2000',
    iiextmetadatafilter: 'LicenseShortName|LicenseUrl|Artist|Credit|Categories|Restrictions|Copyrighted|ImageDescription|ObjectName|AttributionRequired',
  });
  const data = await fetchJsonPoli('wikimedia', `https://commons.wikimedia.org/w/api.php?${params.toString()}`);
  const pages = Object.values(data.query?.pages || {}).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  return pages
    .map((p) => {
      const ii = p.imageinfo?.[0];
      if (!ii) return null;
      const em = ii.extmetadata || {};
      const html = (v) => String(v?.value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      const titre = String(p.title || '').replace(/^File:/, '');
      const thumb2000 = ii.thumburl || ii.url;
      return {
        source: 'wikimedia',
        fournisseur: 'wikimedia_commons',
        id: String(p.pageid),
        title: html(em.ObjectName) || titre.replace(/\.[a-z0-9]+$/i, ''),
        description: html(em.ImageDescription).slice(0, 200),
        photographer: html(em.Artist) || html(em.Credit) || 'inconnu',
        photographerUrl: '',
        pageUrl: ii.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`,
        thumbUrl: thumb2000.replace(/\/2000px-/, '/640px-'),
        fullUrl: thumb2000,
        width: ii.width,
        height: ii.height,
        mime: ii.mime,
        licence: normaliserLicenceWikimedia(em.LicenseShortName?.value, { copyrighted: em.Copyrighted?.value }),
        licenceLabelSource: html(em.LicenseShortName),
        licenceUrl: html(em.LicenseUrl),
        categories: html(em.Categories).split('|').map((s) => s.trim()).filter(Boolean),
        restrictions: html(em.Restrictions),
        tags: [],
      };
    })
    .filter(Boolean);
}

async function telecharger(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Telechargement echoue (${res.status}).`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (!/^image\//i.test(res.headers.get('content-type') || '')) throw new Error('Le serveur n a pas renvoye une image.');
  return buf;
}

// ---- 7. Feuille de contact ----
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>'"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&apos;', '"': '&quot;' }[ch]));
}

function ecrireApercu(tmpDir, candidats, fichiers, { retenus = new Set(), suffixe = '' } = {}) {
  const cartes = candidats
    .map((cand, i) => {
      const fichier = fichiers[i];
      const score = cand.score !== undefined ? ` — score ${cand.score}` : '';
      const net = cand.nettete !== undefined ? ` — nettete ${Math.round(cand.nettete)}` : '';
      return `
      <figure class="${retenus.has(cand.index) ? 'retenu' : ''}">
        <img src="${escapeHtml(fichier)}" alt="Candidat ${cand.index}" loading="lazy" />
        <figcaption>
          <strong>#${cand.index}</strong> — ${escapeHtml(cand.source)}${cand.fournisseur ? ` (${escapeHtml(cand.fournisseur)})` : ''}${score}${net}<br/>
          ${escapeHtml(cand.title || '')}<br/>
          ${escapeHtml(cand.photographer)} — ${escapeHtml(cand.licence)} — ${cand.width}×${cand.height}<br/>
          <a href="${escapeHtml(cand.pageUrl)}" target="_blank" rel="noopener">voir la page source</a>
        </figcaption>
      </figure>`;
    })
    .join('\n');
  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>Apercu photos</title>
<style>
  body { font-family: system-ui, sans-serif; background: #111; color: #eee; margin: 0; padding: 2rem; }
  h1 { font-weight: 600; }
  .grille { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem; }
  figure { margin: 0; background: #1c1c1c; border-radius: 8px; overflow: hidden; border: 2px solid transparent; }
  figure.retenu { border-color: #7dd3fc; }
  img { width: 100%; height: 160px; object-fit: cover; display: block; }
  figcaption { padding: 0.75rem; font-size: 0.85rem; line-height: 1.4; }
  a { color: #7dd3fc; }
</style>
</head>
<body>
  <h1>Feuille de contact — photos</h1>
  <p>Choisis les index a garder, puis relance : <code>ff photos ... --choisir 1,3</code> (ou <code>--auto N</code> pour laisser le score choisir ; les retenus sont encadres).</p>
  <div class="grille">
    ${cartes}
  </div>
</body>
</html>`;
  fs.writeFileSync(path.join(tmpDir, suffixe ? `apercu-${suffixe}.html` : 'apercu.html'), html);
}

/**
 * Planche PNG (apercu.png) : les memes vignettes en grille de 4 colonnes, numero en surimpression —
 * pour juger d'un coup d'oeil (ou la faire lire a un agent) sans ouvrir le HTML.
 */
async function ecrireAperçuPng(tmpDir, candidats, fichiers, retenus = new Set(), suffixe = '') {
  const W = 320;
  const H = 213;
  const COLS = 4;
  const entrees = candidats.filter((cand) => fichiers[cand.index - 1]);
  if (entrees.length === 0) return;
  const rows = Math.ceil(entrees.length / COLS);
  const composites = [];
  for (let i = 0; i < entrees.length; i++) {
    const cand = entrees[i];
    const x = (i % COLS) * W;
    const y = Math.floor(i / COLS) * H;
    try {
      const vignette = await sharp(path.join(tmpDir, fichiers[cand.index - 1])).resize({ width: W, height: H, fit: 'cover' }).toBuffer();
      composites.push({ input: vignette, left: x, top: y });
      const bord = retenus.has(cand.index) ? '<rect x="2" y="2" width="316" height="209" fill="none" stroke="#7dd3fc" stroke-width="4"/>' : '';
      const etiquette = `<svg width="${W}" height="${H}"><rect x="0" y="0" width="64" height="30" fill="#000" fill-opacity="0.7"/><text x="8" y="22" font-family="sans-serif" font-size="20" font-weight="700" fill="#fff">#${cand.index}</text>${bord}</svg>`;
      composites.push({ input: Buffer.from(etiquette), left: x, top: y });
    } catch {
      /* vignette illisible : case vide */
    }
  }
  await sharp({ create: { width: W * COLS, height: H * rows, channels: 3, background: '#111111' } })
    .composite(composites)
    .png()
    .toFile(path.join(tmpDir, suffixe ? `apercu-${suffixe}.png` : 'apercu.png'));
}

function prochainNumeroPhoto(outDir) {
  if (!fs.existsSync(outDir)) return 1;
  let max = 0;
  for (const f of fs.readdirSync(outDir)) {
    const m = f.match(/^photo-(\d+)\.webp$/);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max + 1;
}

// ---- 8. Credits ----
/**
 * Un seul bloc par fichier cible dans CREDITS.md : si l'on repose une photo au meme endroit
 * (raw/hero.jpg re-choisi a la main apres un --auto decevant), l'ancien bloc est retire avant
 * d'ajouter le nouveau — sinon le manifeste garderait un credit pour une image qui n'est plus la.
 */
function poserCredits(slug, block) {
  const dest = path.join(SITES_DIR, slug, 'CREDITS.md');
  const entete = String(block).trim().split('\n')[0]; // "## <cible>"
  if (fs.existsSync(dest) && entete.startsWith('## ')) {
    const texte = fs.readFileSync(dest, 'utf8');
    const debut = texte.indexOf(`\n${entete}\n`);
    if (debut !== -1) {
      const suite = texte.indexOf('\n## ', debut + 1);
      const sans = texte.slice(0, debut) + (suite === -1 ? '\n' : texte.slice(suite));
      fs.writeFileSync(dest, sans.replace(/\n{3,}/g, '\n\n'));
    }
  }
  appendCredits(slug, block);
}

function nomSource(cand) {
  if (cand.source === 'unsplash') return 'Unsplash';
  if (cand.source === 'pexels') return 'Pexels';
  if (cand.source === 'openverse') return `Openverse (${cand.fournisseur || 'fournisseur inconnu'})`;
  return 'Wikimedia Commons';
}

function blocCredits(cand, cible, { ratio, dateDuJour }) {
  const licenceTexte = cand.licenceLabelSource
    ? `${cand.licenceLabelSource} — ${LICENCE_LABEL[cand.licence] || cand.licence}`
    : cand.licenceVersion
      ? `${cand.licence.toUpperCase()} ${cand.licenceVersion} — ${LICENCE_LABEL[cand.licence] || cand.licence}`
      : LICENCE_LABEL[cand.licence] || cand.licence;
  const lignes = [
    `## ${cible}`,
    cand.title ? `- Titre : ${cand.title}` : null,
    `- Auteur : ${cand.photographer}${cand.photographerUrl ? ` (${cand.photographerUrl})` : ''}`,
    `- Source : ${nomSource(cand)} — ${cand.pageUrl}`,
    `- Licence : ${licenceTexte}${cand.licenceUrl ? ` (${cand.licenceUrl})` : ''}`,
  ];
  if (cand.licence === 'by' || cand.licence === 'by-sa') {
    const version = cand.licenceLabelSource || `${cand.licence.toUpperCase()}${cand.licenceVersion ? ` ${cand.licenceVersion}` : ''}`;
    lignes.push(
      `- Attribution a afficher (obligatoire) : « Photo : ${cand.photographer}, ${version.replace(/^cc\s?/i, 'CC ')}, ${cand.pageUrl} »` +
        ` — le schema n a pas de champ credits : a poser dans les mentions legales ou le pied de page a la livraison.`,
    );
  }
  if (ratio) lignes.push(`- Recadrage : ${ratio} (sharp.strategy.attention) — adaptation${cand.licence === 'by-sa' ? ', la photo recadree reste sous BY-SA' : ''}`);
  lignes.push(`- Date : ${dateDuJour}`);
  return lignes.filter(Boolean).join('\n');
}

// ---- 9. Commande ----
export async function cmdPhotos(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const requete = positional[1];
  const USAGE =
    'Usage : ff photos <slug> "<requete>" [--source unsplash|pexels|openverse|wikimedia] [--n 8] [--orientation landscape|portrait|squarish] [--choisir 1,3] [--auto N] [--nom hero] [--ratio 3:2] [--min-largeur 1600] [--largeur 2400]';
  if (!requete) {
    fail(USAGE);
    process.exit(1);
  }

  const orientation = flags.orientation ? String(flags.orientation) : '';
  if (orientation && !ORIENTATIONS.has(orientation)) {
    fail(`--orientation invalide : "${orientation}". Attendu : landscape, portrait ou squarish.`);
    process.exit(1);
  }

  const auto = flags.auto !== undefined ? Number(flags.auto) : 0;
  if (!Number.isInteger(auto) || auto < 0) {
    fail('--auto attend un entier positif (nombre de photos a retenir).');
    process.exit(1);
  }

  const n = flags.n !== undefined ? Number(flags.n) : auto ? 20 : 8;
  if (!Number.isFinite(n) || n < 0) {
    fail('--n doit etre un nombre positif ou nul.');
    process.exit(1);
  }

  const ratio = parseRatio(flags.ratio);
  if (Number.isNaN(ratio)) {
    fail(`--ratio invalide : "${flags.ratio}". Attendu : 3:2, 4:3, 16:9, 1:1...`);
    process.exit(1);
  }
  const minLargeur = flags['min-largeur'] !== undefined ? Number(flags['min-largeur']) : 1600;
  const largeurMax = flags.largeur !== undefined ? Number(flags.largeur) : 2400; // ff images genere jusqu'a 2400 px : on garde ce que la source offre
  const nom = flags.nom ? String(flags.nom).replace(/[^a-z0-9-]/gi, '-') : '';

  const sourceFlag = flags.source ? String(flags.source) : '';
  if (sourceFlag && !SOURCES.includes(sourceFlag)) {
    fail(`--source invalide : "${sourceFlag}". Attendu : ${SOURCES.join(', ')}.`);
    process.exit(1);
  }

  // Sources actives : celle demandee, sinon celles a cle, sinon Openverse (+ Wikimedia en repli).
  let sourcesActives;
  let wikimediaEnRepli = false;
  if (sourceFlag) {
    if (SOURCES_A_CLE[sourceFlag] && !envKey(SOURCES_A_CLE[sourceFlag])) failNoKey(sourceFlag);
    sourcesActives = [sourceFlag];
  } else {
    sourcesActives = Object.keys(SOURCES_A_CLE).filter((s) => envKey(SOURCES_A_CLE[s]));
    if (sourcesActives.length === 0) {
      sourcesActives = ['openverse'];
      wikimediaEnRepli = true;
      info(c.dim('Aucune cle Unsplash/Pexels dans .env : sources sans cle (Openverse, puis Wikimedia Commons en repli).'));
    }
  }

  const { requeteEn, touche } = traduire(requete);
  info(`Requete : "${requete}" -> "${requeteEn}"${touche ? '' : ' (aucun mot metier reconnu, recherche telle quelle)'}`);

  if (n === 0) {
    info('--n 0 : recherche ignoree (verification du chemin de code uniquement).');
    return;
  }

  const tmpDir = path.join(SITES_DIR, slug, '.ff-tmp', 'photos');
  fs.mkdirSync(tmpDir, { recursive: true });
  const suffixe = slugify(requete).slice(0, 40); // un jeu de fichiers par requete : plusieurs recherches puis plusieurs --choisir
  const cachePath = path.join(tmpDir, `candidats-${suffixe}.json`);

  // --choisir juste apres une recherche : on reprend les candidats de cette recherche (memes index)
  // sans refaire d'appel API — economise le quota Openverse, et garantit que l'index choisi sur la
  // feuille de contact est bien celui qu'on copie.
  if (flags.choisir && !auto && fs.existsSync(cachePath)) {
    try {
      const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      if (cache.requete === requete && (cache.sourceFlag || '') === sourceFlag && cache.minLargeur === minLargeur) {
        info(c.dim(`Candidats repris de la derniere recherche (${cache.candidats.length}, .ff-tmp/photos/candidats-${suffixe}.json).`));
        await poser(cache.candidats.filter((cand) => String(flags.choisir).split(',').map((s) => Number(s.trim())).includes(cand.index)), new Map());
        return;
      }
    } catch {
      /* cache illisible : on refait la recherche */
    }
  }

  const besoin = auto ? Math.max(auto * 3, 6) : n;
  const filtrer = (liste, source) => {
    const avant = liste.length;
    const gardes = liste.filter((cand) => licenceOk(cand.licence) && estPhotoPlausible(cand) && (Number(cand.width) || 0) >= minLargeur);
    if (avant > gardes.length) info(c.dim(`  ${source} : ${avant} resultat(s), ${gardes.length} apres filtre licence/largeur>=${minLargeur}/photo plausible`));
    return gardes;
  };

  // Openverse et Wikimedia exigent tous les mots (ET) : une requete de six mots rend souvent zero
  // resultat. On relance en retirant le dernier mot, jusqu'a trois mots, tant qu'on manque de
  // candidats — au plus `maxEssais` appels par source (quota Openverse anonyme : 200/jour).
  const chercherAvecRepli = async (source, fn, maxEssais) => {
    const mots = requeteEn.split(/\s+/).filter(Boolean);
    let trouves = [];
    for (let essai = 0, k = mots.length; essai < maxEssais && k >= Math.min(3, mots.length); essai++, k--) {
      const q = mots.slice(0, k).join(' ');
      const resultats = await fn({ requeteEn: q, n, orientation, minLargeur });
      const gardes = SOURCES_A_CLE[source] ? resultats : filtrer(resultats, `${source} "${q}"`);
      for (const cand of gardes) if (!trouves.some((t) => t.id === cand.id)) trouves.push(cand);
      if (trouves.length >= besoin) break;
    }
    return trouves;
  };

  let candidats = [];
  for (const source of sourcesActives) {
    try {
      const fn = { unsplash: chercherUnsplash, pexels: chercherPexels, openverse: chercherOpenverse, wikimedia: chercherWikimedia }[source];
      candidats.push(...(await chercherAvecRepli(source, fn, SOURCES_A_CLE[source] ? 1 : source === 'openverse' ? 2 : 3)));
    } catch (e) {
      warn(`Recherche ${source} echouee : ${e.message}`);
    }
  }
  if (wikimediaEnRepli && candidats.length < besoin) {
    info(c.dim(`  Openverse : ${candidats.length} candidat(s) exploitable(s) (< ${besoin}), repli Wikimedia Commons.`));
    try {
      candidats.push(...(await chercherAvecRepli('wikimedia', chercherWikimedia, 3)));
    } catch (e) {
      warn(`Recherche wikimedia echouee : ${e.message}`);
    }
  }

  // Doublons (meme fichier propose par Openverse via Wikimedia et par Wikimedia directement).
  const vus = new Set();
  candidats = candidats.filter((cand) => {
    const cle = `${cand.source}:${cand.id}`;
    const nomFichier = String(cand.fullUrl || '').split('/').pop().replace(/^\d+px-/, '');
    if (vus.has(cle) || (nomFichier && vus.has(`f:${nomFichier}`))) return false;
    vus.add(cle);
    if (nomFichier) vus.add(`f:${nomFichier}`);
    return true;
  });

  if (candidats.length === 0) {
    fail('Aucun resultat exploitable (verifie la requete — en anglais precis pour Openverse/Wikimedia —, la cle API, la connexion, ou baisse --min-largeur).');
    process.exit(1);
  }

  // Score sur metadonnees, tri (toujours, pour que les index de --choisir soient les memes qu'en --auto), index.
  for (const cand of candidats) cand.score = scoreMeta(cand, { ratioCible: ratio, minLargeur });
  candidats.sort((a, b) => b.score - a.score);
  candidats = candidats.slice(0, Math.max(n, auto * 4));
  candidats.forEach((cand, i) => { cand.index = i + 1; });

  // Telechargements : en mode --auto, on prend les fichiers complets des meilleurs (nettete + dimensions
  // reelles) ; sinon seulement les vignettes pour la feuille de contact.
  const fichiers = new Array(candidats.length).fill('');
  const complets = new Map(); // index -> Buffer
  const retenus = [];
  if (auto) {
    const aEvaluer = candidats.slice(0, Math.min(candidats.length, Math.max(auto * 3, 6)));
    for (const cand of aEvaluer) {
      try {
        const buf = await telecharger(cand.fullUrl);
        const meta = await sharp(buf).metadata();
        const w = meta.orientation >= 5 ? meta.height : meta.width;
        const h = meta.orientation >= 5 ? meta.width : meta.height;
        cand.widthReelle = w;
        cand.heightReelle = h;
        if (w < minLargeur) {
          cand.rejet = `fichier reel ${w}px < ${minLargeur}px`;
        } else {
          cand.nettete = await nettete(buf);
          if (cand.nettete < SEUIL_NETTETE) cand.rejet = `floue (nettete ${cand.nettete.toFixed(1)} < ${SEUIL_NETTETE})`;
          else cand.score = Math.round((scoreMeta({ ...cand, width: w, height: h }, { ratioCible: ratio, minLargeur }) + scoreNettete(cand.nettete)) * 10) / 10;
        }
        complets.set(cand.index, buf);
        const nomFichier = `${String(cand.index).padStart(2, '0')}-${cand.source}-${cand.id}.jpg`;
        await sharp(buf).rotate().resize({ width: 480, withoutEnlargement: true }).jpeg({ quality: 75 }).toFile(path.join(tmpDir, nomFichier));
        fichiers[cand.index - 1] = nomFichier;
      } catch (e) {
        cand.rejet = `telechargement : ${e.message}`;
      }
    }
    const classes = aEvaluer.filter((cand) => !cand.rejet).sort((a, b) => b.score - a.score);
    retenus.push(...classes.slice(0, auto));
    if (retenus.length < auto) warn(`Seulement ${retenus.length} photo(s) exploitable(s) sur ${aEvaluer.length} evaluee(s) (demande : ${auto}).`);
  }
  for (const cand of candidats) {
    if (fichiers[cand.index - 1]) continue;
    const nomFichier = `${String(cand.index).padStart(2, '0')}-${cand.source}-${cand.id}.jpg`;
    try {
      const buf = await telecharger(cand.thumbUrl);
      await sharp(buf).rotate().resize({ width: 480, withoutEnlargement: true }).jpeg({ quality: 75 }).toFile(path.join(tmpDir, nomFichier));
      fichiers[cand.index - 1] = nomFichier;
    } catch (e) {
      warn(`Vignette #${cand.index} non telechargee : ${e.message}`);
    }
  }
  ecrireApercu(tmpDir, candidats, fichiers, { retenus: new Set(retenus.map((r) => r.index)), suffixe });
  await ecrireAperçuPng(tmpDir, candidats, fichiers, new Set(retenus.map((r) => r.index)), suffixe);
  fs.writeFileSync(cachePath, JSON.stringify({ requete, sourceFlag, minLargeur, ratio, candidats, fichiers }, null, 1));

  info('');
  ok(`${candidats.length} candidat(s). Feuille de contact : sites/${slug}/.ff-tmp/photos/apercu-${suffixe}.html (+ .png)`);
  for (const cand of candidats) {
    const etat = cand.rejet ? c.yellow(`rejete : ${cand.rejet}`) : cand.nettete !== undefined ? c.dim(`nettete ${Math.round(cand.nettete)}`) : '';
    info(`  ${c.cyan(`#${cand.index}`)} ${cand.source.padEnd(9)} ${String(cand.score).padStart(5)} ${cand.licence.padEnd(5)} ${cand.width}x${cand.height} ${cand.photographer.slice(0, 24).padEnd(24)} ${cand.pageUrl} ${etat}`);
  }

  // Selection : --auto (retenus) ou --choisir (index).
  let choisis = [];
  if (auto) {
    choisis = retenus;
    if (choisis.length === 0) {
      fail('Aucune photo retenue automatiquement (toutes rejetees). Regarde la feuille de contact ou change la requete.');
      process.exit(1);
    }
  } else if (flags.choisir) {
    const indexChoisis = String(flags.choisir)
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n2) => Number.isInteger(n2));
    if (indexChoisis.length === 0) {
      fail(`--choisir invalide : "${flags.choisir}". Attendu une liste d'index separes par des virgules, ex: 1,3.`);
      process.exit(1);
    }
    for (const idx of indexChoisis) {
      const cand = candidats.find((c2) => c2.index === idx);
      if (!cand) warn(`Index ${idx} introuvable parmi les candidats affiches ci-dessus, ignore.`);
      else choisis.push(cand);
    }
  } else {
    info('');
    info(`Pour copier des photos dans le site : ${c.cyan(`ff photos ${slug} "${requete}" --choisir 1,3`)} (ou ${c.cyan('--auto 1 --nom hero --ratio 3:2')})`);
    return;
  }

  await poser(choisis, complets);

  /** Copie les candidats choisis dans le site (raw/<nom>.jpg recadre, ou public/images/photo-<n>.webp) et credite. */
  async function poser(choisis, complets) {
    const dateDuJour = new Date().toISOString().slice(0, 10);
    const ratioTexte = flags.ratio ? String(flags.ratio) : '';
    info('');

    if (nom) {
      // Destination raw/<nom>[-i].jpg, recadre au ratio, puis `ff images`.
      const rawDir = path.join(SITES_DIR, slug, 'raw');
      fs.mkdirSync(rawDir, { recursive: true });
      for (let i = 0; i < choisis.length; i++) {
        const cand = choisis[i];
        const base = choisis.length === 1 ? nom : `${nom}-${i + 1}`;
        try {
          const buf = complets.get(cand.index) || (await telecharger(cand.fullUrl));
          const meta = await sharp(buf).rotate().metadata();
          if (meta.width < minLargeur) warn(`#${cand.index} : fichier telecharge de ${meta.width} px seulement (< ${minLargeur}) — la source ne sert pas l'original, prefere un autre candidat.`);
          const cadre = cadreCible(meta.width, meta.height, ratio, largeurMax);
          const out = path.join(rawDir, `${base}.jpg`);
          await sharp(buf)
            .rotate()
            .resize({ width: cadre.width, height: cadre.height, fit: 'cover', position: sharp.strategy.attention, withoutEnlargement: true })
            .jpeg({ quality: 90, mozjpeg: true })
            .toFile(out);
          await declencherUnsplash(cand);
          poserCredits(slug, blocCredits(cand, `raw/${base}.jpg -> public/images/${base}.webp (via ff images)`, { ratio: ratioTexte, dateDuJour }));
          ok(`#${cand.index} -> raw/${base}.jpg (${cadre.width}x${cadre.height}), credite dans CREDITS.md`);
        } catch (e) {
          fail(`#${cand.index} : echec (${e.message})`);
        }
      }
      info('');
      info(`Puis : ${c.cyan(`node scripts/ff.mjs images ${slug}`)} (AVIF/WebP multi-largeurs + images.json), et /images/${nom}${choisis.length > 1 ? '-1' : ''}.webp dans site.config.ts.`);
      return;
    }

    // Comportement historique : public/images/photo-<n>.webp (+ -800.webp).
    const outDir = path.join(SITES_DIR, slug, 'public', 'images');
    fs.mkdirSync(outDir, { recursive: true });
    let prochain = prochainNumeroPhoto(outDir);
    for (const cand of choisis) {
      try {
        const buf = complets.get(cand.index) || (await telecharger(cand.fullUrl));
        const num = prochain++;
        const out1600 = path.join(outDir, `photo-${num}.webp`);
        const out800 = path.join(outDir, `photo-${num}-800.webp`);
        let pipeline = sharp(buf).rotate();
        if (ratio) {
          const meta = await pipeline.metadata();
          const cadre = cadreCible(meta.width, meta.height, ratio, largeurMax);
          pipeline = pipeline.resize({ width: cadre.width, height: cadre.height, fit: 'cover', position: sharp.strategy.attention, withoutEnlargement: true });
        }
        const recadre = await pipeline.toBuffer();
        await sharp(recadre).resize({ width: largeurMax, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out1600);
        await sharp(recadre).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out800);
        await declencherUnsplash(cand);
        poserCredits(slug, blocCredits(cand, `public/images/photo-${num}.webp`, { ratio: ratioTexte, dateDuJour }));
        ok(`#${cand.index} -> public/images/photo-${num}.webp (+ -800.webp), credite dans CREDITS.md`);
      } catch (e) {
        fail(`#${cand.index} : echec (${e.message})`);
      }
    }
  }
}

/** Unsplash exige de "declencher" download_location a chaque utilisation d'une photo (CGU API). */
async function declencherUnsplash(cand) {
  if (cand.source !== 'unsplash' || !cand.downloadLocation) return;
  try {
    const u = new URL(cand.downloadLocation);
    u.searchParams.set('client_id', envKey('UNSPLASH_ACCESS_KEY'));
    await fetch(u.toString());
  } catch (e) {
    warn(`Declenchement download_location Unsplash echoue pour #${cand.index} : ${e.message}`);
  }
}
