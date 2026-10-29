// Fonctions pures de `ff photos-demo` (scripts/ff/photos-demo.mjs) et de son contrôle dans `ff verifier` :
// garde « démo seulement », tri des candidats (licence, largeur, paysage pour le premier écran, pas de logo ni
// de texte incrusté quand les métadonnées le disent), répartition des photos entre les requêtes, écriture de
// site.config.ts (images.hero, images.illustration, proof.gallery, services[].image) et contrôle de la mention
// « Photo d’illustration » sur le site construit. Aucune dépendance lourde : importé aussi par verifier.mjs.
// Tests : tests/photos-demo.test.mjs.
import { estSiteDemo } from './garde-donnees.mjs';
import { licenceOk, estPhotoPlausible, scoreMeta } from './photos.mjs';
import { extractTopLevelValue, setTopLevelValue, findValueEnd, toTs, stripComments } from './ts-literal.mjs';
import { photosDeBanque } from '../astro-credits-integration.mjs';

export { estSiteDemo, photosDeBanque };

/** Largeur minimale de la source : le premier écran (hero) demande 1 600 px, le reste 1 200 px. */
export const MIN_LARGEUR = { hero: 1600, galerie: 1200, service: 1200 };
/** Ratio de recadrage par rôle (même recadrage focal que `ff photos --nom`). */
export const RATIO = { hero: 3 / 2, galerie: 4 / 3, service: 4 / 3 };
/** Le premier écran exige une photo en paysage franc (largeur / hauteur). */
export const RATIO_PAYSAGE_MIN = 1.25;

// Mots qui, dans le titre ou les catégories, trahissent du texte dans l'image (en plus de MOTS_EXCLUS de photos.mjs).
const RE_TEXTE = /(^|[^a-z])(signboard|billboard|banner|placard|inscription|slogan|caption|quote|headline|brochure|leaflet|flyer|price list|neon sign|storefront sign|logo|logotype|wordmark|trademark|brand)([^a-z]|$)/i;

/** Pure : la garde. Renvoie { ok, raison } ; refus clair hors démo. */
export function gardeDemo(slug, configSrc = '') {
  if (estSiteDemo(slug, configSrc)) return { ok: true, raison: '' };
  return {
    ok: false,
    raison: `sites/${slug} n'est pas un site de démonstration (ni legal.demo: true, ni slug _…/demo-…, ni « // DEMO » en tête de site.config.ts). ` +
      'Une photo de banque n\'est jamais présentée comme celle d\'un client (.claude/skills/site-final/aiguillage.md) : demander ses vraies photos (ff refonte, guide photo) ou passer par `ff photos` sur décision datée du fondateur.',
  };
}

/** Pure : vrai si les métadonnées laissent penser à du texte incrusté (enseigne, affiche, logo…). */
export function texteIncruste(cand) {
  const texte = [cand.title, cand.description, ...(cand.tags || []), ...(cand.categories || [])].filter(Boolean).join(' | ');
  return RE_TEXTE.test(texte);
}

/**
 * Pure : candidats exploitables pour un rôle (hero | galerie | service), du meilleur au moins bon.
 * Licence réutilisable (CC0, PDM, BY, BY-SA), photo plausible (pas de logo, dessin, carte, scan…), pas de texte
 * incrusté détectable, largeur ≥ MIN_LARGEUR[role], paysage franc pour le hero, jamais un id déjà pris.
 */
export function trierCandidats(cands, { role = 'galerie', exclus = new Set(), minLargeur } = {}) {
  const min = minLargeur ?? MIN_LARGEUR[role] ?? 1200;
  const ratioCible = RATIO[role] || 0;
  return cands
    .filter((c) => !exclus.has(cleCandidat(c)))
    .filter((c) => licenceOk(c.licence) && !['unsplash', 'pexels'].includes(c.licence))
    .filter((c) => estPhotoPlausible(c) && !texteIncruste(c))
    .filter((c) => (Number(c.width) || 0) >= min)
    .filter((c) => role !== 'hero' || (Number(c.width) || 0) / (Number(c.height) || 1) >= RATIO_PAYSAGE_MIN)
    .map((c) => ({ ...c, score: scoreMeta(c, { ratioCible, minLargeur: min }) }))
    .sort((a, b) => b.score - a.score);
}

/** Clé de dédoublonnage : même fichier vu par Openverse (via Wikimedia) et par Wikimedia directement. */
export function cleCandidat(c) {
  const fichier = String(c.fullUrl || '').split('/').pop().replace(/^\d+px-/, '');
  return fichier || `${c.source}:${c.id}`;
}

/**
 * Pure : combien de photos de galerie prendre par requête. n = total (hero compris) ; la première requête donne
 * le hero, la galerie (n - 1) est répartie en tourniquet en commençant par la première requête.
 * repartir(6, 2) -> [3, 2] ; repartir(1, 3) -> [0, 0, 0].
 */
export function repartir(n, nRequetes) {
  const parts = new Array(Math.max(1, nRequetes)).fill(0);
  for (let i = 0; i < Math.max(0, n - 1); i++) parts[i % parts.length]++;
  return parts;
}

/** Pure : `--services "slug=requête;slug2=requête"` -> [{ slug, requete }] (slugs inconnus signalés par l'appelant). */
export function parseServices(valeur) {
  if (!valeur || valeur === true) return [];
  return String(valeur)
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const i = s.indexOf('=');
      return i === -1 ? null : { slug: s.slice(0, i).trim(), requete: s.slice(i + 1).trim() };
    })
    .filter((x) => x && x.slug && x.requete);
}

/** Pure : texte alternatif lisible depuis le titre de la source (« File:DSC_0412 Copper_kettles.jpg » -> « Copper kettles »). */
export function altDepuisTitre(titre, repli) {
  const t = String(titre || '')
    .replace(/^file:/i, '')
    .replace(/\.(jpe?g|png|tiff?|webp)$/i, '')
    .replace(/[_]+/g, ' ')
    .replace(/\b(IMG|DSC|DSCF|DSCN|P|PXL)[ _-]?\d{3,}\b/gi, ' ')
    .replace(/\(\s*\d+\s*\)/g, ' ')
    .replace(/\s*—\s*/g, ', ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  const propre = t.length >= 4 && /[a-zà-ÿ]{3}/i.test(t) ? t : String(repli || '').trim();
  return propre.charAt(0).toUpperCase() + propre.slice(1, 140);
}

/** Insère `key: value` au niveau racine de defineSite APRÈS la valeur complète de `afterKey` (pas après sa première ligne). */
function insererApres(text, key, value, afterKey) {
  const marker = `\n  ${afterKey}:`;
  const idx = stripComments(text).indexOf(marker);
  if (idx === -1) return setTopLevelValue(text, key, value);
  let fin = findValueEnd(text, idx + marker.length);
  if (text[fin] === ',') fin++;
  return text.slice(0, fin) + `\n  ${key}: ${toTs(value, 1)},` + text.slice(fin);
}

/**
 * Pure : écrit les photos dans le texte de site.config.ts.
 *  - images : { ...existant, hero, illustration: true } (logo, og, vidéo gardés) ;
 *  - proof.gallery : les photos de galerie remplacent l'ancienne galerie de banque (celles du client, absentes de
 *    `banque`, sont gardées devant) ; proof créé après `about` (ou `services`) s'il manque ;
 *  - services[slug].image.
 * Refuse (throw) une clé existante illisible (valeur non littérale) plutôt que de l'écraser.
 */
export function ecrireConfig(text, { hero, galerie = [], services = [], banque = [] } = {}) {
  let out = text;
  const lire = (cle) => {
    const brut = new RegExp(`\\n  ${cle}:`).test(stripComments(out));
    const v = extractTopLevelValue(out, cle);
    if (brut && v === undefined) throw new Error(`site.config.ts : la clé « ${cle} » n'est pas un littéral lisible, écriture refusée (la modifier à la main).`);
    return v;
  };

  const images = { ...(lire('images') || {}) };
  if (hero) images.hero = { src: hero.src, alt: hero.alt };
  images.illustration = true;
  out = setTopLevelValue(out, 'images', images);

  if (galerie.length) {
    const deBanque = new Set(banque);
    const estBanque = (src) => deBanque.has(String(src).replace(/\.[a-z0-9]+$/i, ''));
    const proof = lire('proof');
    const gardees = (proof?.gallery || []).filter((g) => !estBanque(g.src));
    const gallery = [...gardees, ...galerie.map((g) => ({ src: g.src, alt: g.alt }))];
    if (proof) out = setTopLevelValue(out, 'proof', { ...proof, gallery });
    else out = insererApres(out, 'proof', { gallery }, /\n  about:/.test(stripComments(out)) ? 'about' : 'services');
  }

  if (services.length) {
    const liste = lire('services');
    if (!Array.isArray(liste)) throw new Error('site.config.ts : pas de tableau services, impossible de poser services[].image.');
    const parSlug = new Map(services.map((s) => [s.slug, s]));
    const inconnus = services.filter((s) => !liste.some((x) => x.slug === s.slug)).map((s) => s.slug);
    if (inconnus.length) throw new Error(`services inconnus dans site.config.ts : ${inconnus.join(', ')}`);
    out = setTopLevelValue(out, 'services', liste.map((s) => (parSlug.has(s.slug) ? { ...s, image: { src: parSlug.get(s.slug).src, alt: parSlug.get(s.slug).alt } } : s)));
  }
  return out;
}

// ---- Contrôle de `ff verifier` ----

/** Pure : `<img>` d'une page dont la source est une photo de banque (stems = photosDeBanque()). */
export function imgsDeBanque(html, stems) {
  if (!stems.length) return 0;
  let n = 0;
  for (const m of String(html).matchAll(/<img\b[^>]*>/gi)) {
    const src = /\ssrc=["']([^"']+)["']/i.exec(m[0])?.[1] || '';
    const sans = src.split(/[?#]/)[0].replace(/\.[a-z0-9]+$/i, '');
    if (stems.includes(sans) || stems.includes(sans.replace(/-\d{3,4}$/, ''))) n++;
  }
  return n;
}

/** Pure : nombre de mentions « Photo d'illustration » posées par <Img>. */
export function mentionsIllustration(html) {
  return (String(html).match(/<span[^>]*\bdata-illustration\b[^>]*>/gi) || []).length;
}

/**
 * Pure : checks { pass, label } au format de `ff verifier`.
 *  - site NON démo : ni images.illustration, ni mention posée dans dist/ ;
 *  - démo qui affiche une photo de banque : images.illustration obligatoire, et autant de mentions que de photos
 *    de banque sur chaque page.
 * `pages` = [{ chemin, html }] (dist/<slug>), `stems` = photosDeBanque(CREDITS.md).
 */
export function controlerIllustration({ demo, illustration, stems = [], pages = [] }) {
  const checks = [];
  const avecMention = pages.filter((p) => mentionsIllustration(p.html) > 0).map((p) => p.chemin);
  if (!demo) {
    if (illustration || avecMention.length) {
      checks.push({ pass: false, label: `Mention « Photo d’illustration » sur un site qui n'est PAS une démo${avecMention.length ? ` (${avecMention.slice(0, 3).join(', ')})` : ''} : retirer images.illustration et les photos de banque, ou marquer le site comme démo (legal.demo) s'il en est une` });
    }
    return checks;
  }
  const pagesBanque = pages.filter((p) => p.chemin !== 'credits.html' && p.chemin !== 'credits/index.html').map((p) => ({ chemin: p.chemin, n: imgsDeBanque(p.html, stems), m: mentionsIllustration(p.html) })).filter((p) => p.n > 0);
  if (!pagesBanque.length) {
    if (illustration) checks.push({ pass: true, label: 'Démo : images.illustration posé, aucune photo de banque affichée' });
    return checks;
  }
  if (!illustration) {
    checks.push({ pass: false, label: `Démo avec photos de banque (CREDITS.md) affichées sans la mention « Photo d’illustration » (${pagesBanque.slice(0, 3).map((p) => p.chemin).join(', ')}) : images.illustration: true dans site.config.ts (ff photos-demo le pose)` });
    return checks;
  }
  const manquantes = pagesBanque.filter((p) => p.m < p.n);
  checks.push(manquantes.length
    ? { pass: false, label: `Photo de banque sans mention « Photo d’illustration » dans : ${manquantes.slice(0, 4).map((p) => `${p.chemin} (${p.m}/${p.n})`).join(', ')} : l'image ne passe pas par <Img> (src/components/Img.astro)` }
    : { pass: true, label: `Démo : chaque photo de banque porte la mention « Photo d’illustration » (${pagesBanque.reduce((s, p) => s + p.n, 0)} sur ${pagesBanque.length} page(s))` });
  return checks;
}
