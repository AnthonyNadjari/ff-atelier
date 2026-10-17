// `ff refonte <url> [slug] [--max-pages 25] [--sans-photos]`
// REFONTE d'un site existant : beaucoup d'artisans ont déjà un site, vieux ou faible ; ses textes et ses photos
// sont à lui et servent de matière (« comme ça on s'emmerde pas avec les photos », fondateur, 17 oct 2026).
//
// Sans navigateur (fetch Node, User-Agent honnête « FinckFisch-refonte/1.0 », robots.txt respecté, une requête
// toutes les 500 ms, pages du même domaine seulement) :
//   1. explore le site : sitemap.xml (et ses sous-sitemaps) s'il existe, sinon les liens internes depuis l'accueil,
//      jamais plus de --max-pages pages HTML (défaut 25) ;
//   2. lit chaque page : URL, titre, h1, texte principal (sans menu ni pied), images (src, srcset : la plus
//      grande variante, alt, dimensions déclarées) ;
//   3. extrait (fonctions PURES, tests/refonte.test.mjs) : nom, téléphones, e-mails, adresse, horaires écrits,
//      services, années, réseaux, avis affichés (texte + nom tels quels), mentions légales (SIRET, TVA, RCS…) ;
//   4. télécharge au plus 40 photos utiles dans sites/<slug>/raw/ + raw/SOURCES.md (logos, icônes < 300 px et
//      banques d'images écartés ; photos < 1 200 px de large signalées) ;
//   5. écrit sites/<slug>/brief.md au format de docs/BRIEF.md, chaque information suivie de sa page, le reste en
//      « ? à demander », et les textes du site actuel en annexe (la skill réécrit, elle n'invente pas) ;
//   6. écrit sites/<slug>/redirects.json (format lu par `ff vercel`) : ancienne URL -> nouvelle page ;
//   7. crée le site (`ff nouveau <slug>`) s'il n'existe pas ;
//   8. affiche un résumé et la suite (`/site-final <slug>`).
//
// Sécurité : rien de téléchargé n'est exécuté ni interprété (le HTML est lu comme du texte par expressions
// régulières, le JSON-LD par JSON.parse) ; une image n'est écrite que si ses premiers octets sont ceux d'un
// JPEG/PNG/WebP/AVIF/GIF, avec l'extension tirée de ces octets ; aucune page HTML n'est écrite sur le disque.
// Un fichier déjà présent (brief rempli à la main, redirects.json, photo) n'est jamais écrasé.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { ROOT, SITES_DIR, ok, fail, warn, info, c, parseArgs, slugify } from './util.mjs';

export const USER_AGENT = 'FinckFisch-refonte/1.0';
export const DELAI_MS = 500;
export const MAX_PAGES_DEFAUT = 25;
export const MAX_PHOTOS = 40;
export const COTE_MIN_PX = 300;
export const LARGEUR_PLEIN_CADRE = 1200;
const TIMEOUT_MS = 20_000;
const MAX_OCTETS_PAGE = 5 * 1024 * 1024;
const MAX_OCTETS_IMAGE = 20 * 1024 * 1024;
const MAX_URLS_SITEMAP = 3000;
const A_DEMANDER = '? à demander';

// ---------------------------------------------------------------------------------------------
// Fonctions pures : URL, robots.txt, sitemap
// ---------------------------------------------------------------------------------------------

/** URL http(s) normalisée, sinon erreur lisible. */
export function validerUrl(texte) {
  let u;
  try {
    u = new URL(String(texte || '').trim());
  } catch {
    throw new Error(`URL illisible : « ${texte} ». Attendu : https://exemple.fr`);
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error(`URL refusée (${u.protocol}) : seuls http et https sont acceptés.`);
  u.hash = '';
  return u.href;
}

const hoteNu = (h) => String(h || '').toLowerCase().replace(/^www\./, '');

/** Même site : même hôte, au « www. » près. */
export function memeDomaine(a, b) {
  try {
    return hoteNu(new URL(a).hostname) === hoteNu(new URL(b).hostname);
  } catch {
    return false;
  }
}

/** Slug par défaut tiré du nom de domaine : « https://www.boulangerielepidor.fr » -> « boulangerielepidor ». */
export function slugDepuisUrl(url) {
  const hote = hoteNu(new URL(validerUrl(url)).hostname);
  let labels = hote.split('.').filter(Boolean);
  if (labels.length > 1) labels = labels.slice(0, -1);
  if (labels.length > 1 && ['co', 'com', 'org', 'net', 'asso', 'gouv'].includes(labels[labels.length - 1])) labels = labels.slice(0, -1);
  const s = slugify(labels.join('-'));
  return s === 'sans-titre' ? 'refonte' : s;
}

/** Clé de dédoublonnage d'une URL de page : hôte sans www, chemin sans « / » final, requête gardée. */
export function cleUrl(url) {
  const u = new URL(url);
  const chemin = u.pathname.replace(/\/+$/, '') || '/';
  return `${hoteNu(u.hostname)}${chemin}${u.search}`;
}

const EXT_NON_HTML = /\.(pdf|jpe?g|png|gif|webp|avif|svg|ico|bmp|tiff?|heic|zip|rar|7z|gz|docx?|xlsx?|pptx?|odt|ods|mp4|webm|mov|avi|mp3|wav|ogg|ics|vcf|xml|json|css|js|txt|woff2?|ttf|eot|exe|msi|dmg|apk)$/i;

/** Pure : lien vers un document (pdf…) ou une ressource, pas une page. */
export function estRessource(url) {
  try {
    return EXT_NON_HTML.test(new URL(url).pathname);
  } catch {
    return true;
  }
}

/**
 * Pure : règles de robots.txt qui s'appliquent à notre robot (groupe « FinckFisch-refonte » s'il existe, sinon
 * tous les groupes « * » fusionnés, comme le veut la RFC 9309) + les sitemaps annoncés.
 */
export function lireRobots(texte, agent = 'finckfisch-refonte') {
  const groupes = [];
  const sitemaps = [];
  let courant = null;
  let dernierEtaitAgent = false;
  for (const brute of String(texte || '').split(/\r?\n/)) {
    const ligne = brute.replace(/#.*$/, '').trim();
    if (!ligne) continue;
    const m = /^([a-z-]+)\s*:\s*(.*)$/i.exec(ligne);
    if (!m) continue;
    const cle = m[1].toLowerCase();
    const val = m[2].trim();
    if (cle === 'sitemap') {
      if (val) sitemaps.push(val);
      continue;
    }
    if (cle === 'user-agent') {
      if (!dernierEtaitAgent || !courant) {
        courant = { agents: [], regles: [] };
        groupes.push(courant);
      }
      courant.agents.push(val.toLowerCase());
      dernierEtaitAgent = true;
      continue;
    }
    dernierEtaitAgent = false;
    if (!courant) continue;
    if (cle === 'allow' || cle === 'disallow') courant.regles.push({ type: cle, chemin: val });
  }
  const a = agent.toLowerCase();
  const propres = groupes.filter((g) => g.agents.some((x) => x !== '*' && (a.includes(x) || x.includes('finckfisch'))));
  const choisis = propres.length ? propres : groupes.filter((g) => g.agents.includes('*'));
  return { regles: choisis.flatMap((g) => g.regles), sitemaps };
}

function motifRobots(chemin) {
  const finAncree = chemin.endsWith('$');
  const corps = (finAncree ? chemin.slice(0, -1) : chemin).split('*').map((p) => p.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*');
  return new RegExp(`^${corps}${finAncree ? '$' : ''}`);
}

/** Pure : le chemin (avec sa requête) est-il permis ? Règle la plus longue gagnante, égalité = permis. */
export function robotsAutorise(regles, chemin) {
  let meilleure = null;
  for (const r of regles || []) {
    if (!r.chemin) continue; // « Disallow: » vide = tout permis
    if (!motifRobots(r.chemin).test(chemin)) continue;
    const longueur = r.chemin.length;
    if (!meilleure || longueur > meilleure.longueur || (longueur === meilleure.longueur && r.type === 'allow')) meilleure = { type: r.type, longueur };
  }
  return !meilleure || meilleure.type === 'allow';
}

/** Pure : <loc> d'un sitemap ; `index` = vrai pour un index de sitemaps. */
export function lireSitemap(xml) {
  const texte = String(xml || '');
  const locs = [...texte.matchAll(/<loc>\s*(?:<!\[CDATA\[)?\s*([^<\]]+?)\s*(?:\]\]>)?\s*<\/loc>/gi)].map((m) => decoderEntites(m[1].trim()));
  return { index: /<sitemapindex\b/i.test(texte), locs };
}

// ---------------------------------------------------------------------------------------------
// Fonctions pures : lecture HTML (sans parseur, sans exécution)
// ---------------------------------------------------------------------------------------------

const ENTITES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '', thinsp: ' ', ensp: ' ', emsp: ' ', zwnj: '', zwj: '',
  eacute: 'é', egrave: 'è', ecirc: 'ê', euml: 'ë', agrave: 'à', aacute: 'á', acirc: 'â', auml: 'ä', ccedil: 'ç', icirc: 'î', iuml: 'ï',
  ocirc: 'ô', ouml: 'ö', ugrave: 'ù', ucirc: 'û', uuml: 'ü', yuml: 'ÿ', oelig: 'œ', aelig: 'æ', ntilde: 'ñ', oacute: 'ó', iacute: 'í', uacute: 'ú',
  Eacute: 'É', Egrave: 'È', Ecirc: 'Ê', Euml: 'Ë', Agrave: 'À', Acirc: 'Â', Ccedil: 'Ç', Icirc: 'Î', Iuml: 'Ï', Ocirc: 'Ô', Ugrave: 'Ù', Ucirc: 'Û', OElig: 'Œ', AElig: 'Æ',
  laquo: '«', raquo: '»', lsquo: '‘', rsquo: '’', sbquo: '‚', ldquo: '“', rdquo: '”', bdquo: '„', hellip: '…', ndash: '–', mdash: '—',
  euro: '€', copy: '©', reg: '®', trade: '™', deg: '°', middot: '·', bull: '•', times: '×', sup2: '²', sup3: '³', frac12: '½', ordm: 'º', ordf: 'ª',
};

/** Pure : entités HTML nommées courantes et numériques -> caractères. */
export function decoderEntites(s) {
  return String(s ?? '').replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (m, e) => {
    if (e[0] === '#') {
      const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      try {
        return n ? String.fromCodePoint(n) : m;
      } catch {
        return m;
      }
    }
    return ENTITES[e] ?? ENTITES[e.toLowerCase()] ?? m;
  });
}

/** Pure : attributs d'une balise ouvrante (`<img src="a" alt='b'>`) -> objet, noms en minuscules, valeurs décodées. */
export function attributs(balise) {
  const out = {};
  const interieur = String(balise || '').replace(/^<\s*[a-z0-9-]+/i, '').replace(/\/?>$/, '');
  for (const m of interieur.matchAll(/([^\s=/>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>"']+)))?/g)) {
    const nom = m[1].toLowerCase();
    if (nom in out) continue;
    out[nom] = decoderEntites(m[2] ?? m[3] ?? m[4] ?? '');
  }
  return out;
}

/** Pure : retire les éléments <tag>…</tag> (non imbriqués du même nom) et leur contenu. */
export function retirerBlocs(html, tags) {
  let h = String(html || '');
  for (const t of tags) h = h.replace(new RegExp(`<${t}\\b[^>]*>[\\s\\S]*?<\\/${t}\\s*>`, 'gi'), '\n').replace(new RegExp(`<${t}\\b[^>]*\\/>`, 'gi'), '');
  return h;
}

const BLOCS = 'p|div|section|article|header|footer|main|aside|nav|li|ul|ol|dl|dt|dd|tr|table|thead|tbody|tfoot|blockquote|figure|figcaption|address|form|fieldset|label|option|select|button|details|summary|center|pre';
const INLINE_COLLES = 'b|strong|em|i|u|s|sup|sub|small|mark|abbr|font|q';

/**
 * Pure : HTML -> lignes de texte [{ t, h }] (h = niveau de titre 1-6, 0 sinon). Les blocs coupent les lignes, les
 * cellules de tableau sont jointes par une espace (« Mardi 6h45 - 13h »), les entités sont décodées.
 */
export function lignesDe(html) {
  let h = String(html || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(br|hr)\b[^>]*>/gi, '\n')
    .replace(/<h([1-6])\b[^>]*>/gi, '\n\u0001$1')
    .replace(/<\/h[1-6]\s*>/gi, '\n')
    .replace(new RegExp(`<\\/?(?:${BLOCS})\\b[^>]*>`, 'gi'), '\n')
    .replace(/<\/?(?:td|th)\b[^>]*>/gi, ' ')
    .replace(new RegExp(`<\\/?(?:${INLINE_COLLES})\\b[^>]*>`, 'gi'), '')
    .replace(/<[^>]*>/g, ' ');
  h = decoderEntites(h);
  const out = [];
  for (const brute of h.split('\n')) {
    let niveau = 0;
    let t = brute;
    const m = /^\s*\u0001([1-6])/.exec(t);
    if (m) {
      niveau = Number(m[1]);
      t = t.replace(/\u0001[1-6]/, '');
    }
    t = t.replace(/\u0001[1-6]/g, '').replace(/[\s  ]+/g, ' ').trim();
    if (!t) continue;
    if (out.length && out[out.length - 1].t === t) continue;
    out.push({ t, h: niveau });
  }
  return out;
}

const texteSimple = (html) => lignesDe(html).map((l) => l.t).join(' ').trim();

const LIGNE_COOKIES = /cookie|consentement|rgpd.*accept|accepter.*(tout|traceurs)|tout refuser|paramétrer (mes|les) choix/i;

/** Pure : zone principale d'une page : <main> s'il existe, sinon le corps sans nav, en-tête de menu ni pied. */
export function zonePrincipale(corps) {
  const sansDecor = retirerBlocs(corps, ['noscript', 'form']);
  const main = /<main\b[^>]*>([\s\S]*?)<\/main\s*>/i.exec(sansDecor)?.[1];
  let zone = main && texteSimple(main).length > 0 ? main : sansDecor;
  zone = retirerBlocs(zone, ['nav', 'footer']);
  // Un <header> qui contient un menu est un bandeau de navigation ; un <header> d'article (avec un h1) reste.
  zone = zone.replace(/<header\b[^>]*>([\s\S]*?)<\/header\s*>/gi, (bloc, dedans) => (/<h1\b/i.test(dedans) && !/<(ul|nav)\b/i.test(dedans) ? bloc : '\n'));
  zone = zone.replace(/<(div|section|aside)\b[^>]*(?:id|class|role)\s*=\s*["'][^"']*(?:cookie|consent|gdpr|rgpd|navigation|menu|breadcrumb|fil-d-ariane)[^"']*["'][^>]*>[\s\S]*?<\/\1\s*>/gi, '\n');
  return lignesDe(zone).filter((l) => !LIGNE_COOKIES.test(l.t));
}

/** Pure : srcset -> la plus grande variante (descripteur w, sinon x, sinon la dernière). */
export function plusGrandeVariante(srcset, base) {
  const s = String(srcset || '');
  const candidats = [];
  let i = 0;
  while (i < s.length) {
    while (i < s.length && /[\s,]/.test(s[i])) i++;
    let j = i;
    while (j < s.length && !/\s/.test(s[j])) j++;
    let url = s.slice(i, j);
    let desc = '';
    if (url.endsWith(',')) {
      url = url.replace(/,+$/, '');
    } else {
      let k = j;
      while (k < s.length && s[k] !== ',') k++;
      desc = s.slice(j, k).trim();
      j = k + 1;
    }
    i = j;
    if (!url) continue;
    const w = /(\d+(?:\.\d+)?)w\b/.exec(desc);
    const x = /(\d+(?:\.\d+)?)x\b/.exec(desc);
    candidats.push({ url, w: w ? Number(w[1]) : null, x: x ? Number(x[1]) : w ? null : 1, ordre: candidats.length });
  }
  if (!candidats.length) return null;
  const parW = candidats.filter((c) => c.w !== null);
  const choisi = parW.length ? parW.sort((a, b) => b.w - a.w)[0] : candidats.sort((a, b) => b.x - a.x || b.ordre - a.ordre)[0];
  let absolue;
  try {
    absolue = base ? new URL(choisi.url, base).href : choisi.url;
  } catch {
    return null;
  }
  return { url: absolue, largeur: choisi.w };
}

/**
 * Pure : URL d'image -> URL de l'original quand la plateforme le permet sans deviner : Next.js
 * (`/_next/image?url=…`), Wix (`…/media/x.jpg/v1/fill/w_300…` -> `…/media/x.jpg`), Squarespace (`?format=300w`).
 */
export function urlOriginale(url) {
  let u;
  try {
    u = new URL(url);
  } catch {
    return url;
  }
  if (/\/_next\/image\/?$/.test(u.pathname) && u.searchParams.get('url')) {
    try {
      return new URL(u.searchParams.get('url'), u.origin).href;
    } catch {
      return url;
    }
  }
  if (/(^|\.)wixstatic\.com$/.test(u.hostname)) {
    const m = /^(\/media\/[^/]+\.(?:jpe?g|png|webp))\/v1\//i.exec(u.pathname);
    if (m) return `${u.origin}${m[1]}`;
  }
  if (/squarespace-cdn\.com$/.test(u.hostname) && u.searchParams.has('format')) {
    u.searchParams.set('format', '2500w');
    return u.href;
  }
  return u.href;
}

const IMG_FICHIER = /\.(jpe?g|png|webp|avif|gif)(\?|$)/i;

/** Pure : images d'un fragment HTML (img, source de picture, lien vers une image, fond en style en ligne). */
export function lireImages(html, base) {
  const out = [];
  const absolue = (v) => {
    if (!v || /^(data|blob|javascript):/i.test(v.trim())) return null;
    try {
      return new URL(v.trim(), base).href;
    } catch {
      return null;
    }
  };
  const pousser = (o) => {
    if (o.url) out.push({ ...o, url: urlOriginale(o.url) });
  };
  for (const m of String(html || '').matchAll(/<img\b[^>]*>/gi)) {
    const a = attributs(m[0]);
    const srcset = a['data-srcset'] || a['data-lazy-srcset'] || a.srcset;
    const variante = srcset ? plusGrandeVariante(srcset, base) : null;
    const src = absolue(a['data-src'] || a['data-lazy-src'] || a['data-original'] || a['data-full'] || a.src);
    const choix = variante?.url || src;
    const indices = `${a.class || ''} ${a.id || ''}`.trim();
    pousser({
      url: choix ? absolue(choix) : null,
      alt: (a.alt || a.title || '').trim(),
      largeur: variante?.largeur || Number(a.width) || null,
      hauteur: variante?.largeur ? null : Number(a.height) || null,
      origine: variante ? 'srcset' : 'img',
      indices,
    });
  }
  for (const m of String(html || '').matchAll(/<source\b[^>]*>/gi)) {
    const a = attributs(m[0]);
    const srcset = a['data-srcset'] || a.srcset;
    if (!srcset || (a.type && !/^image\//i.test(a.type))) continue;
    const v = plusGrandeVariante(srcset, base);
    if (v) pousser({ url: v.url, alt: '', largeur: v.largeur, hauteur: null, origine: 'srcset', indices: '' });
  }
  for (const m of String(html || '').matchAll(/<a\b[^>]*>/gi)) {
    const a = attributs(m[0]);
    const href = absolue(a.href);
    if (href && IMG_FICHIER.test(new URL(href).pathname + new URL(href).search)) pousser({ url: href, alt: (a.title || '').trim(), largeur: null, hauteur: null, origine: 'lien', indices: a.class || '' });
  }
  for (const m of String(html || '').matchAll(/background(?:-image)?\s*:\s*[^;"']*url\(\s*(?:&quot;|["'])?([^"')&]+)(?:&quot;|["'])?\s*\)/gi)) {
    pousser({ url: absolue(decoderEntites(m[1])), alt: '', largeur: null, hauteur: null, origine: 'fond', indices: '' });
  }
  return out;
}

export const BANQUES = /pexels|unsplash|shutterstock|freepik|istock(photo)?|adobestock|stock\.adobe|ftcdn\.net|depositphotos|123rf|gettyimages|dreamstime|pixabay|stocksy|alamy/i;
const LOGO_ICONE = /logo|icon|icone|picto|favicon|sprite|badge|partenaire|partner|sponsor|avatar|placeholder|spinner|loader|loading|emoji|drapeau|flag-|arrow|fleche|bouton|social|facebook|instagram|whatsapp|linkedin|youtube|tripadvisor|trustpilot|pagesjaunes|google-?review|paiement|payment|paypal|mastercard|visa\b|qualibat|rge\b|label/i;
const TRACEUR = /facebook\.com\/tr|google-analytics|googletagmanager|doubleclick|pixel\.|\/pixel\b|stats\.|matomo|piwik|hotjar|gravatar\.com|maps\.googleapis|maps\.gstatic|recaptcha/i;

/** Pure : faut-il télécharger cette image ? { garder, raison }. Les dimensions réelles sont revérifiées après. */
export function filtrerImage(img) {
  const url = String(img?.url || '');
  let u;
  try {
    u = new URL(url);
  } catch {
    return { garder: false, raison: 'URL illisible' };
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return { garder: false, raison: 'pas http(s)' };
  if (BANQUES.test(url)) return { garder: false, raison: "banque d'images" };
  if (TRACEUR.test(url)) return { garder: false, raison: 'traceur ou service tiers' };
  if (/\.(svg|ico|bmp)(\?|$)/i.test(u.pathname)) return { garder: false, raison: 'logo ou icône (vectoriel)' };
  if (LOGO_ICONE.test(`${decodeURIComponent(u.pathname)} ${img.alt || ''} ${img.indices || ''}`)) return { garder: false, raison: 'logo ou icône' };
  const cote = Math.max(Number(img.largeur) || 0, Number(img.hauteur) || 0);
  if (cote && cote < 100 && img.origine !== 'srcset') return { garder: false, raison: `icône < ${COTE_MIN_PX} px` };
  return { garder: true, raison: '' };
}

/** Pure : logo de l'entreprise (img dont src/alt/classe dit « logo », hors partenaires), pour le brief § 8. */
export function trouverLogo(images) {
  return (images || []).find((i) => /logo/i.test(`${i.url} ${i.alt} ${i.indices}`) && !/partenaire|partner|sponsor|label|qualibat|rge/i.test(`${i.url} ${i.alt}`)) || null;
}

/** Pure : liens d'un fragment HTML -> [{ href, texte }] absolus. */
export function lireLiens(html, base) {
  const out = [];
  for (const m of String(html || '').matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi)) {
    const a = attributs(`<a ${m[1]}>`);
    if (!a.href) continue;
    let href;
    try {
      href = new URL(a.href.trim(), base).href;
    } catch {
      continue;
    }
    out.push({ href, texte: texteSimple(m[2]).slice(0, 120) });
  }
  return out;
}

/** Pure : e-mail protégé par Cloudflare (`data-cfemail` / `#hex` de /cdn-cgi/l/email-protection). */
export function decoderCfEmail(hex) {
  const h = String(hex || '').trim();
  if (!/^[0-9a-f]{4,}$/i.test(h) || h.length % 2) return null;
  const cle = parseInt(h.slice(0, 2), 16);
  let s = '';
  for (let i = 2; i < h.length; i += 2) s += String.fromCharCode(parseInt(h.slice(i, i + 2), 16) ^ cle);
  return /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(s) ? s : null;
}

function aplatirJsonLd(j) {
  if (!j || typeof j !== 'object') return [];
  if (Array.isArray(j)) return j.flatMap(aplatirJsonLd);
  const out = [j];
  if (Array.isArray(j['@graph'])) out.push(...j['@graph'].flatMap(aplatirJsonLd));
  for (const cle of ['review', 'reviews', 'mainEntity', 'itemListElement']) if (j[cle] && typeof j[cle] === 'object') out.push(...aplatirJsonLd(j[cle]));
  return out;
}

function lireMetas(html) {
  const out = {};
  for (const m of String(html || '').matchAll(/<meta\b[^>]*>/gi)) {
    const a = attributs(m[0]);
    const cle = (a.property || a.name || a.itemprop || '').toLowerCase();
    if (cle && a.content !== undefined && !(cle in out)) out[cle] = a.content.trim();
  }
  return out;
}

/** Pure : bloc équilibré <tag …>…</tag> qui commence à `debut` (balise ouvrante comprise). */
function blocEquilibre(html, debut, tag) {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
  re.lastIndex = debut;
  let prof = 0;
  let m;
  while ((m = re.exec(html))) {
    if (m[1]) prof--;
    else if (!m[0].endsWith('/>')) prof++;
    if (prof === 0) return html.slice(debut, m.index + m[0].length);
    if (re.lastIndex - debut > 20000) break;
  }
  return html.slice(debut, debut + 4000);
}

const AUTEUR_INDICE = /<(cite|strong|b|h[3-6])\b[^>]*>([\s\S]*?)<\/\1>|<[a-z]+\b[^>]*class\s*=\s*["'][^"']*(?:author|auteur|name|nom|client)[^"']*["'][^>]*>([\s\S]*?)<\/[a-z]+>/i;

/** Pure : avis affichés sur la page (JSON-LD Review, blocs « testimonial/témoignage/review/avis », blockquote + cite). */
export function extraireAvisHtml(html, jsonld = []) {
  const avis = [];
  const pousser = (auteur, texte) => {
    const t = String(texte || '').replace(/\s+/g, ' ').trim();
    const a = String(auteur || '').replace(/\s+/g, ' ').replace(/^[-–—\s]+/, '').trim();
    if (t.length < 25 || t.length > 1500) return;
    if (avis.some((x) => x.texte === t)) return;
    avis.push({ auteur: a || null, texte: t });
  };
  for (const j of jsonld) {
    const type = [].concat(j['@type'] || []).join(' ');
    if (/\bReview\b/.test(type) && j.reviewBody) pousser(typeof j.author === 'string' ? j.author : j.author?.name, j.reviewBody);
  }
  const h = String(html || '');
  const re = /<(div|li|article|blockquote|figure|section)\b[^>]*(?:class|id)\s*=\s*["'][^"']*(?:testimonial|temoignage|témoignage|review|avis-client|avis_client|\bavis\b)[^"']*["'][^>]*>/gi;
  const blocs = [];
  for (const m of h.matchAll(re)) blocs.push({ debut: m.index, tag: m[1].toLowerCase(), html: blocEquilibre(h, m.index, m[1]) });
  for (const m of h.matchAll(/<blockquote\b[^>]*>/gi)) if (!blocs.some((b) => b.debut === m.index)) blocs.push({ debut: m.index, tag: 'blockquote', html: blocEquilibre(h, m.index, 'blockquote') });
  // Le plus intérieur seulement : un conteneur « avis » qui contient d'autres blocs n'est pas un avis.
  const feuilles = blocs.filter((b) => !blocs.some((o) => o !== b && o.debut > b.debut && o.debut < b.debut + b.html.length));
  for (const b of feuilles) {
    const ind = AUTEUR_INDICE.exec(b.html.slice(b.html.indexOf('>') + 1));
    let auteur = ind ? texteSimple(ind[2] ?? ind[3] ?? '') : '';
    const lignes = lignesDe(b.html).map((l) => l.t);
    if (!auteur) {
      const courte = lignes.find((l) => l.length <= 40 && l.split(' ').length <= 5 && !/[.!?…]$/.test(l) && /\p{Lu}/u.test(l[0] || ''));
      if (courte && lignes.length > 1) auteur = courte;
    }
    const texte = lignes.filter((l) => l !== auteur && !/^[★☆*\d\s,./]+$/.test(l) && !/^(lire la suite|voir plus|en savoir plus)$/i.test(l)).join(' ');
    if (auteur.length > 60) auteur = '';
    pousser(auteur, texte);
  }
  return avis.slice(0, 15);
}

const HEBERGEUR = /^(?:\d+[.)]?\s*)?h[ée]berg(?:eur|ement)\b|\bh[ée]berg[ée]e? (?:par|chez)\b/i;

/**
 * Pure : retire le bloc « Hébergement » des mentions légales (téléphone, adresse, SIRET de l'hébergeur, pas du
 * client) : de la ligne qui l'annonce jusqu'au titre suivant, 10 lignes au plus.
 */
export function sansHebergeur(lignes) {
  const out = [];
  let reste = 0;
  for (const l of lignes) {
    if (HEBERGEUR.test(l.t) && l.t.length < 120) {
      reste = 10;
      continue;
    }
    if (reste > 0) {
      if (l.h > 0) reste = 0;
      else {
        reste--;
        continue;
      }
    }
    out.push(l);
  }
  return out;
}

/** Pure : titre de page découpé en morceaux (« A propos - Horaires | L'Epi d'Or » -> 2 morceaux). */
export function segmentsTitre(titre) {
  const t = String(titre || '').trim();
  const forts = t.split(/\s+[|–—·•»:]\s+/).map((s) => s.trim()).filter(Boolean);
  return forts.length > 1 ? forts : t.split(/\s+-\s+/).map((s) => s.trim()).filter(Boolean);
}

/** Pure : tout ce qu'une page apprend, sans réseau. */
export function lirePage(html, url) {
  const brut = String(html || '').replace(/<!--[\s\S]*?-->/g, '');
  const jsonld = [...brut.matchAll(/<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script\s*>/gi)].flatMap((m) => {
    try {
      return aplatirJsonLd(JSON.parse(m[1].trim()));
    } catch {
      return [];
    }
  });
  const metas = lireMetas(brut);
  const titre = texteSimple(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i.exec(brut)?.[1] || '');
  const corpsBrut = /<body\b[^>]*>([\s\S]*)<\/body\s*>/i.exec(brut)?.[1] ?? brut;
  let corps = retirerBlocs(corpsBrut, ['script', 'style', 'template', 'svg', 'iframe', 'object']);
  const cfemails = [...corps.matchAll(/data-cfemail\s*=\s*["']([0-9a-f]+)["']|\/cdn-cgi\/l\/email-protection#([0-9a-f]+)/gi)].map((m) => decoderCfEmail(m[1] || m[2])).filter(Boolean);
  // « [email protected] » de Cloudflare -> l'adresse en clair, pour que l'annexe se lise.
  corps = corps.replace(/<([a-z]+)\b[^>]*data-cfemail\s*=\s*["']([0-9a-f]+)["'][^>]*>[\s\S]*?<\/\1\s*>/gi, (m, _t, hex) => decoderCfEmail(hex) || m);
  const images = lireImages(corps, url);
  if (metas['og:image']) {
    try {
      // og:image qui pointe sur la page elle-même (erreur fréquente) : pas une image.
      if (cleUrl(new URL(metas['og:image'], url).href) === cleUrl(url)) throw new Error('og:image = page');
      images.push({ url: urlOriginale(new URL(metas['og:image'], url).href), alt: metas['og:image:alt'] || '', largeur: Number(metas['og:image:width']) || null, hauteur: Number(metas['og:image:height']) || null, origine: 'og', indices: '' });
    } catch {
      /* og:image illisible */
    }
  }
  const liens = lireLiens(corps, url);
  const toutes = sansHebergeur(lignesDe(retirerBlocs(corps, ['noscript']))).map((l) => l.t);
  const principal = zonePrincipale(corps);
  const h1 = principal.find((l) => l.h === 1)?.t || lignesDe(corps).find((l) => l.h === 1)?.t || '';
  const mots = principal.reduce((n, l) => n + l.t.split(/\s+/).filter(Boolean).length, 0);
  const generateur = metas.generator || (/\/_next\/static\//.test(brut) ? 'Next.js' : /wp-content\//.test(brut) ? 'WordPress' : /wixstatic\.com/.test(brut) ? 'Wix' : /squarespace/.test(brut) ? 'Squarespace' : /jimdo/i.test(brut) ? 'Jimdo' : '');
  const coquilleJs = /<div\b[^>]*id\s*=\s*["'](?:__next|root|app|__nuxt)["']/i.test(brut) || /\bng-app\b|data-reactroot/i.test(brut);
  return {
    url,
    titre,
    h1,
    description: metas.description || metas['og:description'] || '',
    siteName: metas['og:site_name'] || '',
    lang: /<html\b[^>]*\blang\s*=\s*["']?([a-z-]+)/i.exec(brut)?.[1] || '',
    generateur,
    coquilleJs,
    jsonld,
    principal,
    toutes,
    mots,
    // Coquille d'application JavaScript : presque aucun texte ET un conteneur React/Next/Vue ou un « Chargement… ».
    videJs: mots < 20 && (coquilleJs || principal.some((l) => /^(chargement|loading|veuillez activer javascript|enable javascript)/i.test(l.t))),
    liens,
    cfemails,
    images,
    avis: extraireAvisHtml(corps, jsonld),
  };
}

// ---------------------------------------------------------------------------------------------
// Fonctions pures : extraction des informations (sur des lignes de texte ou des liens)
// ---------------------------------------------------------------------------------------------

/** Pure : « 0238883051 », « +33 2 38 88 30 51 », « 02.38.88.30.51 » -> « 02 38 88 30 51 ». */
export function normaliserTelephone(brut) {
  let d = String(brut || '').replace(/[^\d+]/g, '');
  if (d.startsWith('+33')) d = `0${d.slice(3)}`;
  else if (d.startsWith('0033')) d = `0${d.slice(4)}`;
  d = d.replace(/^00?(?=[1-9]\d{8}$)/, '0');
  if (!/^0[1-9]\d{8}$/.test(d)) return null;
  return d.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}

const RE_TEL = /(?<![\d+])(?:(?:\+|00)\s?33\s?(?:\(0\)\s?)?|0)[1-9](?:[\s.\- ]?\d{2}){4}(?!\d)/g;

/** Pure : téléphones français des lignes (et des liens tel:), les plus fréquents d'abord ; fax signalés. */
export function extraireTelephones(lignes, hrefs = []) {
  const vus = new Map();
  const noter = (num, fax, poids) => {
    const n = normaliserTelephone(num);
    if (!n) return;
    const e = vus.get(n) || { valeur: n, n: 0, fax: true };
    e.n += poids;
    e.fax = e.fax && fax;
    vus.set(n, e);
  };
  for (const h of hrefs) if (/^tel:/i.test(h)) noter(decodeURIComponent(h.slice(4)), false, 3);
  for (const l of lignes) for (const m of String(l).matchAll(RE_TEL)) noter(m[0], /fax|t[ée]l[ée]copie/i.test(String(l).slice(Math.max(0, m.index - 20), m.index)), 1);
  return [...vus.values()].sort((a, b) => Number(a.fax) - Number(b.fax) || b.n - a.n).map(({ valeur, fax }) => ({ valeur, fax }));
}

const EMAIL_EXCLU = /\.(png|jpe?g|gif|webp|svg|avif)$|@(example|exemple|domain|domaine|sentry|wixpress|test)\.|^(votre|nom|name|email|e-mail|prenom|user|exemple|example)@/i;

/** Pure : e-mails affichés (texte, mailto:, protection Cloudflare), dédoublonnés, en minuscules. */
export function extraireEmails(lignes, hrefs = [], cfemails = []) {
  const out = [];
  const pousser = (e) => {
    const v = String(e || '').trim().replace(/[.,;:)]+$/, '').toLowerCase();
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(v) || EMAIL_EXCLU.test(v) || out.includes(v)) return;
    out.push(v);
  };
  for (const h of hrefs) if (/^mailto:/i.test(h)) pousser(decodeURIComponent(h.slice(7).split('?')[0]));
  cfemails.forEach(pousser);
  for (const l of lignes) for (const m of String(l).matchAll(/[a-z0-9._%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}/gi)) pousser(m[0]);
  return out;
}

// Insensible à la casse mot par mot (« Rue », « RUE ») sans drapeau i : la ville, elle, doit commencer par une majuscule.
const ci = (mot) => mot.replace(/[.]/g, '\\.').replace(/\p{Ll}/gu, (ch) => `[${ch}${ch.toUpperCase()}]`);
const VOIE = ['rue', 'avenue', 'av.', 'bd', 'boulevard', 'place', 'pl.', 'chemin', 'ch.', 'route', 'rte', 'allée', 'allee', 'impasse', 'imp.', 'quai', 'cours', 'faubourg', 'fbg', 'square', 'lieu-dit', 'lieudit', 'zone', 'za', 'zi', 'zac', 'parc', 'rond-point', 'passage', 'voie', 'sentier', 'résidence', 'residence', 'hameau', 'montée', 'montee', 'promenade', 'esplanade', 'clos', 'cité', 'cite', 'domaine', 'lotissement'].map(ci).join('|');
const RE_ADRESSE = new RegExp(
  `(?:((?:\\d{1,4}\\s?(?:bis|ter|b|t)?\\s?,?\\s+)?(?:${VOIE})(?![\\p{L}])[^,\\n\\d]{2,60}?)\\s*[,\\-–\\n]?\\s*)?(?<!\\d)((?:0[1-9]|[1-8]\\d|9[0-5]|97|98)\\d{3})(?!\\d)\\s*[,\\-–]?\\s*([\\p{Lu}][\\p{L}'’\\- ]{1,40}?(?:\\s+(?:Cedex|CEDEX)(?:\\s\\d+)?)?)(?=\\s*(?:[,.\\n(]|$|France|FRANCE|Tél|TÉL|Tel|TEL|\\d))`,
  'gu',
);

/** Pure : adresses « [n° rue], code postal ville » d'un texte (lignes jointes), les plus complètes et fréquentes d'abord. */
export function extraireAdresses(lignes) {
  const texte = (Array.isArray(lignes) ? lignes : [lignes]).join('\n');
  const vus = new Map();
  for (const m of texte.matchAll(RE_ADRESSE)) {
    const rue = m[1] ? m[1].replace(/\s+/g, ' ').replace(/[\s,]+$/, '').trim() : null;
    const ville = m[3].replace(/\s+/g, ' ').replace(/[\s\-]+$/, '').trim();
    if (/^(euros?|ans|km|habitants|clients|visiteurs|exemplaires|pi[eè]ces|produits)$/i.test(ville)) continue;
    if (/^(?:France|Tél|Tel)$/i.test(ville)) continue;
    const cle = `${m[2]} ${ville.toLowerCase()}`;
    const e = vus.get(cle) || { rue: null, codePostal: m[2], ville, n: 0 };
    e.n++;
    if (rue && (!e.rue || rue.length > e.rue.length)) e.rue = rue;
    vus.set(cle, e);
  }
  return [...vus.values()].sort((a, b) => Number(Boolean(b.rue)) - Number(Boolean(a.rue)) || b.n - a.n).map(({ rue, codePostal, ville }) => ({ rue, codePostal, ville }));
}

const JOUR = /\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|jours? f[ée]ri[ée]s|lun\.?|mar\.|mer\.|jeu\.|ven\.|sam\.|dim\.)(?=[\s.:\-–,/à]|$)/i;
const HEURE = /\b\d{1,2}\s?(?:h|H|:)\s?(?:\d{2})?(?!\d)|ferm[ée]|ouvert|non[- ]stop|24\s?h/i;

/** Pure : lignes d'horaires telles qu'écrites (« Mardi 6h45 - 13h00 »), un jour seul suivi de ses heures est joint. */
export function extraireHoraires(lignes) {
  const L = lignes.map(String);
  const out = [];
  for (let i = 0; i < L.length; i++) {
    const l = L[i];
    if (l.length > 140 || !JOUR.test(l)) continue;
    let ligne = l;
    if (!HEURE.test(l)) {
      // « Mardi » puis « 6h45 - 13h00 » sur les lignes suivantes (cellules en blocs).
      const suite = [];
      for (let k = i + 1; k < Math.min(L.length, i + 4) && !JOUR.test(L[k]) && HEURE.test(L[k]) && L[k].length < 60; k++) suite.push(L[k]);
      if (!suite.length) continue;
      ligne = `${l} ${suite.join(' ')}`;
    }
    if (!out.includes(ligne)) out.push(ligne);
  }
  return out.slice(0, 16);
}

/** Pure : années et durées écrites (« depuis 1998 », « fondée en 2005 », « plus de 20 ans d'expérience »). */
export function extraireAnnees(lignes) {
  const out = [];
  const motifs = [
    /\b(?:depuis|dès)\s+(?:l['’]an(?:née)?\s+)?((?:19|20)\d{2})\b/i,
    /\b(?:fond[ée]e?s?|cr[ée]{2}e?s?|[ée]tablie?s?|ouverte?s?|reprise?s?|install[ée]e?s?|n[ée]e?s?|lanc[ée]e?s?)\s+(?:en|depuis)\s+((?:19|20)\d{2})\b/i,
    /\b(?:création|fondation|ouverture|reprise|naissance)\s+(?:en\s+|:\s*)?((?:19|20)\d{2})\b/i,
    /\ben\s+((?:19|20)\d{2})\s*,?\s+(?:\p{L}+\s+){0,5}(?:fonde|crée|créé|ouvre|ouvert|reprend|repris|s['’]install|lance|démarre)/iu,
    /\b(?:depuis\s+(?:plus\s+de\s+)?|plus\s+de\s+)(\d{1,3})\s+ans\b/i,
    /\b(\d{1,3})\s+ans\s+d['’](?:expérience|existence|savoir-faire)/i,
  ];
  for (const l of lignes) {
    if (/©|copyright|tous droits/i.test(l)) continue;
    for (const phrase of String(l).split(/(?<=[.!?])\s+/)) {
      for (const re of motifs) {
        const m = re.exec(phrase);
        if (!m) continue;
        const n = Number(m[1]);
        const annee = n >= 1800 ? n : null;
        if (annee && annee > new Date().getFullYear()) continue;
        const texte = phrase.trim().slice(0, 220);
        if (!out.some((o) => o.phrase === texte)) out.push({ phrase: texte, annee, duree: annee ? null : n });
        break;
      }
    }
  }
  return out.slice(0, 8);
}

const RESEAUX = [
  ['facebook', /^https?:\/\/(?:[a-z-]+\.)?(?:facebook|fb)\.com\//i],
  ['instagram', /^https?:\/\/(?:www\.)?instagram\.com\//i],
  ['linkedin', /^https?:\/\/(?:[a-z]+\.)?linkedin\.com\/(?:company|school)\//i],
  // Profil d'une personne : le gérant, ou le développeur du site (Épi d'Or, 17 oct 2026) ; jamais pris pour la page de l'entreprise.
  ['linkedinPersonnel', /^https?:\/\/(?:[a-z]+\.)?linkedin\.com\/in\//i],
  ['tiktok', /^https?:\/\/(?:www\.)?tiktok\.com\/@/i],
  ['youtube', /^https?:\/\/(?:www\.)?youtube\.com\/(?:@|c\/|channel\/|user\/)/i],
  ['pinterest', /^https?:\/\/(?:[a-z]+\.)?pinterest\.[a-z.]+\/(?!pin\/)/i],
];
const PARTAGE = /sharer|\/share|share\.php|intent\/|dialog\/|\/tr\?|plugins\/|\/hashtag\/|\/p\/|\/reel\/|\/watch\?|\/embed/i;

/** Pure : réseaux sociaux de l'entreprise (profils, pas les boutons « partager »), le premier lien par réseau. */
export function extraireReseaux(hrefs) {
  const out = {};
  for (const h of hrefs) {
    for (const [nom, re] of RESEAUX) {
      if (out[nom] || !re.test(h) || PARTAGE.test(h)) continue;
      const u = new URL(h);
      const garderRequete = /profile\.php/.test(u.pathname);
      out[nom] = `${u.origin}${u.pathname}${garderRequete ? u.search : ''}`;
    }
  }
  return out;
}

/** Pure : algorithme de Luhn (clé de contrôle du SIREN/SIRET). */
export function luhn(chiffres) {
  const d = String(chiffres).replace(/\D/g, '');
  let somme = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    somme += n;
  }
  return d.length > 0 && somme % 10 === 0;
}

/** Pure : mentions légales lisibles dans un texte : SIRET, SIREN, RCS, TVA, forme juridique, directeur de publication. */
export function extraireLegal(lignes, { pageMentions = false } = {}) {
  const t = lignes.join('\n');
  const out = {};
  const siret = /SIRET\s*(?:n°|no|num[ée]ro|:)?\s*:?\s*((?:\d[\s. ]?){13}\d)(?!\d)/i.exec(t);
  if (siret) {
    const d = siret[1].replace(/\D/g, '');
    out.siret = { valeur: `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`, valide: luhn(d) || d.startsWith('356000000') };
  }
  const siren = /SIREN\s*(?:n°|no|:)?\s*:?\s*((?:\d[\s. ]?){8}\d)(?!\d)/i.exec(t);
  if (siren) {
    const d = siren[1].replace(/\D/g, '');
    out.siren = { valeur: `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`, valide: luhn(d) };
  }
  const rcs = /\bR\.?C\.?S\.?\s*:?\s+(?:de\s+|d['’])?([\p{Lu}][\p{L}\- ]{1,30}?)\s+((?:[AB]\s+)?(?:\d[\s. ]?){8}\d)(?!\d)/u.exec(t);
  if (rcs) out.rcs = `RCS ${rcs[1].trim()} ${rcs[2].replace(/[\s. ]+/g, ' ').trim()}`;
  const rm = /\b(?:R\.?M\.?|r[ée]pertoire des m[ée]tiers)\b[^\n]{0,40}?((?:\d[\s. ]?){8}\d)(?!\d)/i.exec(t);
  if (rm) out.rm = rm[0].replace(/\s+/g, ' ').trim();
  const tva = /\bFR\s?[0-9A-Z]{2}\s?\d{3}\s?\d{3}\s?\d{3}\b/.exec(t);
  if (tva) out.tva = tva[0].replace(/\s+/g, '');
  const dir = /(?:directeur|directrice|responsable)\s+(?:de\s+(?:la\s+)?)?publication\s*(?:est\s+)?:?\s*(?:M\.|Mme|Monsieur|Madame)?\s*([\p{L}'’\- .]{3,60}?)\s*(?:[,.\n(]|$)/iu.exec(t);
  if (dir && !/^(est|du site|:)$/i.test(dir[1].trim())) out.directeur = dir[1].trim();
  if (pageMentions) {
    const forme = /\b(SASU|SAS|SARL|EURL|SNC|SCOP|EIRL|SCI|entreprise individuelle|auto-?entrepreneur|micro-?entreprise)\b/i.exec(t);
    if (forme) out.forme = forme[1];
    const raison = /(?:^|\n)\s*(?:raison sociale|d[ée]nomination(?: sociale)?|nom de l['’]entreprise|soci[ée]t[ée]|nom)\s*:\s*([^\n]{2,80})/i.exec(t);
    if (raison) out.raison = raison[1].trim();
    const capital = /capital(?: social)?\s*(?:de\s*)?:?\s*([\d\s.,]+\s?(?:€|euros))/i.exec(t);
    if (capital) out.capital = capital[1].replace(/\s+/g, ' ').trim();
  }
  return out;
}

/** Pure : type d'une ancienne page d'après son chemin (et son titre). */
export function classerPage(url, titre = '') {
  const p = decodeURIComponent(new URL(url).pathname).toLowerCase().replace(/\.(html?|php|aspx?)$/, '').replace(/\/+$/, '') || '/';
  const t = String(titre).toLowerCase();
  const dernier = p.split('/').pop() || '';
  if (p === '/' || /^\/(index|accueil|home|fr|fr\/accueil)$/.test(p)) return 'accueil';
  if (/mentions|legal|l[ée]gales|cgu|cgv|conditions-g/.test(p)) return 'mentions';
  if (/confidentialit|privacy|rgpd|donnees-personnelles|cookies/.test(p)) return 'confidentialite';
  if (/(^|-)(contact|contactez-nous|nous-contacter|nous-joindre|nous-trouver|nous-ecrire|acces|plan-d-acces|devis|rendez-vous|rdv)($|-)/.test(dernier)) return 'contact';
  if (/(^|-)(avis|temoignages?|testimonials?|livre-d-or|reviews?)($|-)/.test(dernier)) return 'avis';
  if (/a-propos|qui-sommes|about|histoire|equipe|l-entreprise|presentation|notre-maison|l-atelier|le-salon/.test(dernier)) return 'apropos';
  if (/galerie|realisations?|(^|-)photos?($|-)|portfolio|chantiers?|references/.test(dernier)) return 'galerie';
  if (/\/(blog|actualites?|actus?|news|conseils|articles?|journal)(\/|$)/.test(p)) return 'blog';
  if (/faq|questions/.test(dernier)) return 'faq';
  if (/plan-du-site|sitemap|recrutement|emploi|jobs?|carrieres?|tarifs?|login|connexion|compte|panier|cart|search|recherche/.test(dernier)) return 'autre';
  const profondeur = p.split('/').filter(Boolean).length;
  if (profondeur <= 2 && (/^\/(services?|prestations?|nos-services|nos-prestations|savoir-faire|activites?|metiers?|expertises?|travaux|specialites?|boutique|produits?|carte|menu)(\/|$)/.test(p) || /services?|prestations?/.test(t))) return 'service';
  if (profondeur === 1) return 'service';
  // /plomberie/debouchage : sous-page d'une page de service.
  if (profondeur === 2 && classerPage(`https://x.invalid/${p.split('/')[1]}`) === 'service') return 'service';
  return 'autre';
}


/** Pure : slug de service « proche » de l'ancienne URL (dernier segment) ou du titre. */
export function slugService(url, titre = '') {
  const dernier = decodeURIComponent(new URL(url).pathname).replace(/\.(html?|php|aspx?)$/i, '').replace(/\/+$/, '').split('/').pop();
  const s = slugify(dernier || segmentsTitre(titre)[0]);
  return s.slice(0, 50).replace(/-+$/, '') || 'service';
}

const LIBELLE_VIDE = /^(en savoir plus|savoir plus|voir( plus| tout)?|lire la suite|découvrir|d[ée]couvrez|plus|ici|cliquez ici|suite|>+|→|»|\+)$/i;

/** Pure : libellés des liens internes qui pointent vers chaque page (le menu du client nomme ses pages). */
export function libellesDesLiens(pages) {
  const m = new Map();
  for (const p of pages) {
    for (const l of p.liens || []) {
      const t = String(l.texte || '').trim();
      if (t.length < 2 || t.length > 60 || LIBELLE_VIDE.test(t)) continue;
      let k;
      try {
        k = cleUrl(l.href.split('#')[0]);
        if (k === cleUrl(p.url)) continue; // lien vers soi-même (« # », ancre) : ne nomme pas la page
      } catch {
        continue;
      }
      if (!m.has(k)) m.set(k, new Map());
      m.get(k).set(t, (m.get(k).get(t) || 0) + 1);
    }
  }
  return new Map([...m].map(([k, compte]) => [k, [...compte].sort((a, b) => b[1] - a[1])[0][0]]));
}

/**
 * Pure : services = pages « service » lues, dans l'ordre d'exploration. Titre : le h1, sinon le libellé du lien qui y
 * mène (le menu), sinon le titre de la page s'il n'est pas celui de l'accueil (application à page unique).
 */
export function extraireServices(pages, nom = '') {
  const out = [];
  const nomBas = String(nom).toLowerCase();
  const accueil = pages.find((p) => classerPage(p.url) === 'accueil');
  const libelles = libellesDesLiens(pages);
  for (const p of pages) {
    if (classerPage(p.url, p.titre) !== 'service') continue;
    const titreGenerique = accueil && p !== accueil && p.titre === accueil.titre;
    const morceaux = titreGenerique ? [] : segmentsTitre(p.titre).filter((s) => s.toLowerCase() !== nomBas);
    const h1 = p.h1 && p.h1.toLowerCase() !== nomBas && !(accueil && p !== accueil && p.h1 === accueil.h1) ? p.h1 : '';
    const titre = h1 || libelles.get(cleUrl(p.url)) || morceaux[0] || '';
    if (!titre || out.some((s) => s.titre.toLowerCase() === titre.toLowerCase())) continue;
    const prix = (p.principal || []).map((l) => l.t).filter((l) => /\d\s?€|€\s?\d/.test(l) && l.length < 160).slice(0, 3);
    const description = p.description && !(accueil && p !== accueil && p.description === accueil.description) ? p.description : '';
    out.push({ titre, slug: slugService(p.url, titre), source: p.url, description, prix });
  }
  return out;
}

/** Pure : nom de l'entreprise : JSON-LD, sinon og:site_name, sinon segment de titre le plus fréquent, sinon logo. */
export function extraireNom(pages) {
  for (const p of pages) {
    const j = p.jsonld?.find((x) => /LocalBusiness|Organization|Store|Bakery|Restaurant|HomeAndConstructionBusiness|ProfessionalService|Plumber|Electrician|HairSalon|BeautySalon|Dentist|Physician|AutoRepair/.test([].concat(x['@type'] || []).join(' ')) && typeof x.name === 'string');
    if (j) return { valeur: j.name.trim(), source: p.url, comment: 'données structurées' };
  }
  const sansAccent = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, "'").toLowerCase().trim();
  const compter = (valeurs) => {
    const m = new Map();
    for (const { v, url } of valeurs) {
      const k = sansAccent(v);
      const e = m.get(k) || { valeur: v, source: url, n: 0 };
      e.n++;
      m.set(k, e);
    }
    return [...m.values()].sort((a, b) => b.n - a.n);
  };
  const sn = compter(pages.filter((p) => p.siteName).map((p) => ({ v: p.siteName.trim(), url: p.url })));
  if (sn.length) return { valeur: sn[0].valeur, source: sn[0].source, comment: 'og:site_name' };
  const segs = compter(pages.flatMap((p) => segmentsTitre(p.titre).filter((s) => s.length > 1 && s.length < 60).map((v) => ({ v, url: p.url }))));
  if (segs.length && (segs[0].n >= 2 || pages.length === 1)) return { valeur: segs[0].valeur, source: segs[0].source, comment: 'titre des pages' };
  return null;
}

/** Pure : phrases d'un ensemble de lignes qui répondent à un motif, avec la page source. */
function phrasesAvec(pages, re, { max = 3, longueur = 260, champ = 'toutes' } = {}) {
  const out = [];
  for (const p of pages) {
    for (const l of p[champ] || []) {
      const t = typeof l === 'string' ? l : l.t;
      if (t.length > longueur || !re.test(t) || out.some((o) => o.texte === t)) continue;
      out.push({ texte: t, source: p.url });
      if (out.length >= max) return out;
    }
  }
  return out;
}

const CERTIFS = /\b(RGE|Qualibat|Qualit['’]?EnR|QualiPV|QualiPAC|Qualifelec|Handibat|Eco ?Artisan|Artisan d['’]art|Ma[iî]tre artisan|Meilleur ouvrier de France|M\.?O\.?F\.?|Compagnons? du devoir|Label Rouge|Boulanger de France|Artisan boulanger|Ma[iî]tre restaurateur|Fait maison|Garantie décennale)\b/i;
const PLATEFORMES = {
  reservation: /zenchef|thefork|lafourchette|planity|calendly|doctolib|resy\.com|booksy|treatwell|kiute|guestonline|sevenrooms|simplybook|maiia|rdv360|mapetiteresa|bookingkit|reservio/i,
  commande: /ubereats|deliveroo|just-?eat|clickandcollect|click-and-collect|zelty|obypay|sumupstore|commander|\border\b|commande-en-ligne/i,
  cadeau: /bon-?cadeau|carte-?cadeau|giftcard|gift-card|wonderbox|smartbox/i,
  google: /google\.[a-z.]+\/maps|maps\.google\.|goo\.gl\/maps|maps\.app\.goo\.gl|g\.page\//i,
};

/** Pure : toutes les informations du site à partir des pages lues. */
export function extraireTout(pages, { urlsConnues = [] } = {}) {
  const sourceDe = (re) => pages.find((p) => p.toutes.some((l) => re.test(l)))?.url || pages[0]?.url;
  const tousHrefs = pages.flatMap((p) => p.liens.map((l) => l.href));
  const hrefSource = (h) => pages.find((p) => p.liens.some((l) => l.href === h))?.url;

  const nom = extraireNom(pages);
  const accueil = pages.find((p) => classerPage(p.url) === 'accueil') || pages[0];
  const metier = accueil ? segmentsTitre(accueil.titre).find((s) => s && (!nom || s.toLowerCase() !== nom.valeur.toLowerCase())) : null;

  const telephones = extraireTelephones(pages.flatMap((p) => p.toutes), tousHrefs).map((t) => {
    const chiffres = t.valeur.replace(/\D/g, '');
    const src = pages.find((p) => p.liens.some((l) => /^tel:/i.test(l.href) && l.href.replace(/\D/g, '').endsWith(chiffres.slice(1))) || p.toutes.some((l) => l.replace(/\D/g, '').includes(chiffres.slice(1))))?.url;
    return { ...t, source: src };
  });
  const emails = extraireEmails(pages.flatMap((p) => p.toutes), tousHrefs, pages.flatMap((p) => p.cfemails)).map((e) => ({
    valeur: e,
    source: pages.find((p) => p.cfemails.includes(e) || p.liens.some((l) => l.href.toLowerCase().includes(e)) || p.toutes.some((l) => l.toLowerCase().includes(e)))?.url,
  }));
  const adresses = extraireAdresses(pages.flatMap((p) => p.toutes)).map((a) => ({ ...a, source: sourceDe(new RegExp(a.codePostal)) }));

  let horaires = { lignes: [], source: null };
  for (const p of pages) {
    const h = extraireHoraires(p.toutes);
    if (h.length > horaires.lignes.length) horaires = { lignes: h, source: p.url };
  }
  const annees = [];
  for (const p of pages) for (const a of extraireAnnees(p.toutes)) if (!annees.some((x) => x.phrase === a.phrase)) annees.push({ ...a, source: p.url });

  const reseauxBruts = extraireReseaux(tousHrefs);
  const reseaux = Object.fromEntries(Object.entries(reseauxBruts).map(([k, v]) => [k, { url: v, source: hrefSource(tousHrefs.find((h) => h.startsWith(v))) }]));

  const avis = [];
  for (const p of pages) for (const a of p.avis) if (!avis.some((x) => x.texte === a.texte)) avis.push({ ...a, source: p.url });
  const notesAffichees = phrasesAvec(pages, /\b\d[,.]\d\s*\/\s*5\b|\b\d+\s+avis\b/i, { max: 2, longueur: 120 });

  const legal = {};
  for (const p of [...pages].sort((a, b) => Number(classerPage(b.url) === 'mentions') - Number(classerPage(a.url) === 'mentions'))) {
    const l = extraireLegal(p.toutes, { pageMentions: classerPage(p.url) === 'mentions' });
    for (const [k, v] of Object.entries(l)) if (!legal[k]) legal[k] = { valeur: v, source: p.url };
  }

  const liensPlateforme = (re) => {
    const h = tousHrefs.find((x) => re.test(x) && !memeDomaine(x, pages[0]?.url || 'https://x.invalid'));
    return h ? { url: h, source: hrefSource(h) } : null;
  };
  const whatsapp = tousHrefs.map((h) => /wa\.me\/(\d{8,15})|whatsapp\.com\/send\?phone=(\d{8,15})/i.exec(h)).find(Boolean);

  const imagesToutes = pages.flatMap((p) => p.images.map((i) => ({ ...i, page: p.url })));
  const logo = trouverLogo(imagesToutes);

  return {
    nom,
    metier: metier ? { valeur: metier, source: accueil.url } : null,
    telephones,
    emails,
    adresses,
    horaires,
    annees,
    reseaux,
    whatsapp: whatsapp ? { valeur: whatsapp[1] || whatsapp[2], source: hrefSource(whatsapp.input) } : null,
    avis: avis.slice(0, 15),
    notesAffichees,
    legal,
    services: extraireServices(pages, nom?.valeur),
    certifications: phrasesAvec(pages, CERTIFS, { max: 4, longueur: 200 }),
    decennale: phrasesAvec(pages, /d[ée]cennale/i, { max: 1, longueur: 300 })[0] || null,
    zone: phrasesAvec(pages, /\b(intervenons|intervient|interviens|intervention|d[ée]pla[cç]ons|se d[ée]place|rayon de \d+\s?km|alentours|environs|secteur de)\b/i, { max: 3, longueur: 260, champ: 'principalTexte' }),
    urgence: phrasesAvec(pages, /24\s?h\s?\/\s?24|24\s?\/\s?7|7\s?j\s?\/\s?7|urgence/i, { max: 2, longueur: 200 }),
    realisePar: phrasesAvec(pages, /\b(r[ée]alis[ée]|con[cç]u|cr[ée]{2}|d[ée]velopp[ée]|propuls[ée])\w*\s+(?:par|avec)\b/i, { max: 1, longueur: 120 })[0] || null,
    google: liensPlateforme(PLATEFORMES.google),
    reservation: liensPlateforme(PLATEFORMES.reservation),
    commande: liensPlateforme(PLATEFORMES.commande),
    cadeau: liensPlateforme(PLATEFORMES.cadeau),
    documents: [...new Set(tousHrefs.filter((h) => /\.pdf(\?|$)/i.test(h)))].slice(0, 10).map((h) => ({ url: h, source: hrefSource(h) })),
    logo: logo ? { url: logo.url, source: logo.page } : null,
    generateur: pages.find((p) => p.generateur)?.generateur || '',
    urlsConnues: urlsConnues.length,
  };
}

// ---------------------------------------------------------------------------------------------
// Fonctions pures : redirections, nommage des photos, rendu du brief et de SOURCES.md
// ---------------------------------------------------------------------------------------------

/** Pure : nouvelle page qui remplace une ancienne URL (règle simple de la refonte). */
export function destinationPour(url, titre = '', servicesParUrl = {}) {
  const service = servicesParUrl[cleUrl(url)];
  if (service) return `/services/${service}`;
  const type = classerPage(url, titre);
  if (type === 'accueil') return '/';
  if (type === 'contact') return '/#contact';
  if (type === 'mentions') return '/mentions-legales';
  if (type === 'confidentialite') return '/confidentialite';
  return '/';
}

const SOURCE_SURE = /^\/[A-Za-z0-9\-._~/%]*$/;

/**
 * Pure : plan de redirections au format de `ff vercel` (`{ redirects: [{ source, destination, statusCode }] }`).
 * Une URL qui ne change pas (même chemin) ou porte une requête (`?page_id=`, illisible par `source`) n'entre pas ;
 * une collection de 5 pages ou plus qui partent toutes vers l'accueil devient une seule règle `/<parent>/:path*`.
 */
export function planRedirections(urls, { titres = {}, servicesParUrl = {}, origine = '' } = {}) {
  const exactes = [];
  const ignorees = [];
  const vus = new Set();
  for (const url of urls) {
    let u;
    try {
      u = new URL(url);
    } catch {
      continue;
    }
    if (u.search) {
      ignorees.push(url);
      continue;
    }
    const source = u.pathname;
    if (source === '/' || vus.has(source)) continue;
    if (!SOURCE_SURE.test(source)) {
      ignorees.push(url);
      continue;
    }
    vus.add(source);
    const destination = destinationPour(url, titres[cleUrl(url)] || '', servicesParUrl);
    if (destination.replace(/\/+$/, '') === source.replace(/\/+$/, '')) continue;
    exactes.push({ source, destination, statusCode: 301 });
  }
  // Collections : /boutique/produits/<x> (≥ 5) -> une règle.
  const parParent = new Map();
  for (const r of exactes) {
    const segs = r.source.replace(/\/+$/, '').split('/').filter(Boolean);
    if (segs.length < 2) continue;
    const parent = `/${segs.slice(0, -1).join('/')}`;
    if (!parParent.has(parent)) parParent.set(parent, []);
    parParent.get(parent).push(r);
  }
  const regroupees = new Set();
  const motifs = [];
  for (const [parent, rs] of parParent) {
    if (rs.length < 5 || !rs.every((r) => r.destination === '/')) continue;
    rs.forEach((r) => regroupees.add(r));
    motifs.push({ source: `${parent}/:path*`, destination: '/', statusCode: 301 });
  }
  const redirects = [...exactes.filter((r) => !regroupees.has(r)), ...motifs];
  return { origine, redirects, ignorees };
}

/** Pure : ordre d'exploration : accueil, pages clés (contact, à propos, services, mentions, avis), puis par profondeur. */
export function ordonnerUrls(urls) {
  const enfants = new Map();
  for (const u of urls) {
    const segs = new URL(u).pathname.split('/').filter(Boolean);
    const parent = segs.slice(0, -1).join('/');
    enfants.set(parent, (enfants.get(parent) || 0) + 1);
  }
  const rang = { accueil: 0, contact: 1, apropos: 1, service: 2, mentions: 3, avis: 3, galerie: 3, faq: 4, blog: 6, confidentialite: 7, autre: 5 };
  return urls
    .map((u, i) => {
      const segs = new URL(u).pathname.split('/').filter(Boolean);
      const parent = segs.slice(0, -1).join('/');
      const collection = segs.length >= 2 && (enfants.get(parent) || 0) > 8;
      return { u, i, r: (collection ? 20 : rang[classerPage(u)] ?? 5) + segs.length * 0.5 };
    })
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map((x) => x.u);
}

/** Pure : nom de fichier lisible pour une photo (nom d'origine s'il dit quelque chose, sinon page + numéro). */
export function nomFichierPhoto(url, page, ext, pris = new Set()) {
  let base = '';
  try {
    base = decodeURIComponent(new URL(url).pathname.split('/').pop() || '').replace(/\.[a-z0-9]{2,5}$/i, '');
  } catch {
    /* nom illisible */
  }
  base = base.replace(/-\d{2,4}x\d{2,4}$/, '').replace(/@\dx$/, '');
  let s = slugify(base);
  const parlant = s !== 'sans-titre' && s.length <= 40 && /[a-z]{3,}/.test(s) && !/^[0-9a-f]{8,}|[0-9a-f]{12,}/.test(s.replace(/-/g, '')) && !/^(img|image|photo|dsc|dscn|p|pict|wp|screenshot)[-_]?\d*$/.test(s);
  if (!parlant) {
    const segs = page ? new URL(page).pathname.split('/').filter(Boolean) : [];
    s = slugify(segs.pop() || 'accueil');
  }
  let nom = `${s}.${ext}`;
  if (pris.has(nom) || !parlant) {
    for (let n = 1; ; n++) {
      const cand = `${s}-${String(n).padStart(2, '0')}.${ext}`;
      if (!pris.has(cand)) {
        nom = cand;
        break;
      }
    }
  }
  pris.add(nom);
  return nom;
}

/** Pure : type d'image d'après ses premiers octets (jamais d'après l'URL ou l'en-tête). */
export function typeImage(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  if (buf.toString('ascii', 4, 8) === 'ftyp' && /avif|avis/.test(buf.toString('ascii', 8, 12))) return 'avif';
  if (buf.toString('ascii', 0, 4) === 'GIF8') return 'gif';
  return null;
}

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
export const dateFr = (d) => `${d.getDate() === 1 ? '1er' : d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`;

const AVERTISSEMENT_AVIS = `> **⚠️ Avertissement légal — à lire avant de remplir cette section.**
> Inventer un avis, un auteur, une note ou un chiffre de satisfaction est une **pratique commerciale
> trompeuse** au sens de l'article **L121-2 du Code de la consommation** (faux avis, témoignage fictif,
> statistique inventée). C'est illégal, sanctionné, et **strictement interdit sur ce projet**, sans
> exception, même "en attendant les vrais avis" ou "à titre d'exemple".
>
> Chaque avis publié doit avoir une origine vérifiable : un vrai client, un vrai texte, une vraie source
> (capture Google, e-mail, SMS...). Pas d'avis = pas de section avis sur le site, purement et simplement.`;

const QUESTIONS_FAQ = [
  ['Parking et accès', 'où se garer, comment entrer, étage, ascenseur, accès handicapé'],
  ['Délais habituels', "entre le premier contact et l'intervention, durée moyenne d'un chantier"],
  ['Devis payant ou non', 'visite gratuite ? déplacement facturé ? déduit si commande ?'],
  ['Paiement', 'acompte et son montant, moyens acceptés : CB, virement, chèque, espèces, en plusieurs fois'],
  ["Zone d'intervention exacte", 'communes, rayon en km, frais au-delà'],
  ['Allergies, matériaux, contraintes propres au métier', 'allergènes, produits sans ammoniaque, bois certifié, bruit, poussière, animaux'],
  ["Horaires d'urgence ou week-end", 'dépannage le soir, le dimanche, majoration'],
  ['Que faire avant la venue', "préparer la pièce, dégager l'accès, apporter quoi au rendez-vous"],
];

const guill = (s) => `« ${String(s).trim()} »`;
const avecSource = (valeur, source) => (valeur ? `${valeur}${source ? ` (${source})` : ''}` : A_DEMANDER);

/** Pure : brief au format de docs/BRIEF.md, prérempli depuis le site actuel. */
export function rendreBrief(d) {
  const x = d.extraction;
  const L = [];
  const p = (...lignes) => L.push(...lignes);
  const adr = x.adresses[0];
  const nom = x.nom?.valeur || d.hote;

  p(`> **REFONTE de ${d.url}, lu le ${d.dateTexte} : textes et photos du site actuel du client ; à valider avec lui.**`);
  p('> Brief prérempli par `ff refonte` (lecture automatique sans navigateur) : chaque information est suivie de la page');
  p("> où elle a été lue ; « ? à demander » = rien trouvé. Les textes et les photos sont au client : demander son accord pour");
  p("> les reprendre. Les textes du site actuel sont en annexe, à réécrire avec lui, jamais recopiés tels quels.");
  p('', `# Brief client — ${nom}`, '');
  p('Sources :');
  p(`- Site actuel : ${d.url}${x.generateur ? ` (fait avec ${x.generateur})` : ''} ; ${d.pages.length} page(s) lue(s) sur ${Math.max(d.urlsConnues, d.pages.length)} connue(s)${d.depuisSitemap ? ' (sitemap)' : ' (liens internes)'} :`);
  for (const pg of d.pages) p(`  - ${pg.url}${pg.videJs ? ' (presque aucun texte sans navigateur)' : ''}`);
  if (d.jsSeul) p(`- **Contenu chargé en JavaScript** : ${d.pagesVides.length} page(s) sans texte lisible sans navigateur. Ce qui manque ci-dessous est peut-être sur le site : le vérifier dans un navigateur (\`ff demonter ${d.url}\`).`);
  p('', '---', '', '## 1. Identité', '');
  const nomsVus = [x.nom ? `${x.nom.valeur} (${x.nom.source}, ${x.nom.comment})` : null, x.legal.raison ? `raison sociale : ${x.legal.raison.valeur} (${x.legal.raison.source})` : null].filter(Boolean);
  p(`- **Nom de l'entreprise :** ${nomsVus.length ? nomsVus.join(' ; ') : A_DEMANDER}`);
  p(`- **Métier affiché** (ex. "Plombier-chauffagiste") : ${x.metier ? `${guill(x.metier.valeur)} (titre de l'accueil, ${x.metier.source}) ; à confirmer` : A_DEMANDER}`);
  p(`- **Forme juridique** (EURL, SASU, auto-entrepreneur...) : ${x.legal.forme ? avecSource(x.legal.forme.valeur, x.legal.forme.source) : A_DEMANDER}${x.legal.capital ? ` ; capital ${x.legal.capital.valeur}` : ''}`);
  const siret = x.legal.siret ? `${x.legal.siret.valeur.valeur}${x.legal.siret.valeur.valide ? '' : ' (clé de contrôle fausse : à vérifier sur annuaire-entreprises.data.gouv.fr)'} (${x.legal.siret.source})` : x.legal.siren ? `SIREN ${x.legal.siren.valeur.valeur} (${x.legal.siren.source}) ; SIRET complet : ${A_DEMANDER}` : A_DEMANDER;
  p(`- **SIRET :** ${siret}${x.legal.rcs ? ` ; ${x.legal.rcs.valeur} (${x.legal.rcs.source})` : ''}${x.legal.rm ? ` ; ${x.legal.rm.valeur} (${x.legal.rm.source})` : ''}`);
  p(`- **N° TVA intracommunautaire** (si assujetti) : ${x.legal.tva ? avecSource(x.legal.tva.valeur, x.legal.tva.source) : A_DEMANDER}`);
  const annees = x.annees.filter((a) => a.annee);
  p(`- **Depuis quand ?** (année de création, affichée seulement si fournie) : ${annees.length ? annees.map((a) => `${guill(a.phrase)} (${a.source})`).join(' ; ') + ' ; à confirmer' : A_DEMANDER}`);
  p(`- **Assurance décennale** (compagnie + n° de police) : ${x.decennale ? `${guill(x.decennale.texte)} (${x.decennale.source}) ; compagnie et n° : ${A_DEMANDER}` : A_DEMANDER}`);
  p(`- **Certifications / labels** (RGE, Qualibat, Artisan d'art...) : ${x.certifications.length ? x.certifications.map((c) => `${guill(c.texte)} (${c.source})`).join(' ; ') + ' ; justificatifs à demander' : A_DEMANDER}`);
  p(`- **Responsable de publication** (nom du gérant — obligatoire pour les mentions légales) : ${x.legal.directeur ? `${x.legal.directeur.valeur} (${x.legal.directeur.source}) ; à confirmer` : A_DEMANDER}`);

  p('', '## 2. Contact', '');
  const tels = x.telephones.filter((t) => !t.fax);
  const faxes = x.telephones.filter((t) => t.fax);
  p(`- **Téléphone** (format affiché, ex. 06 12 34 56 78) : ${tels.length ? tels.map((t) => avecSource(t.valeur, t.source)).join(' ; ') : A_DEMANDER}${faxes.length ? ` ; fax : ${faxes.map((t) => t.valeur).join(', ')}` : ''}`);
  p(`- **WhatsApp** (si différent, numéro international sans le +) : ${x.whatsapp ? avecSource(x.whatsapp.valeur, x.whatsapp.source) : A_DEMANDER}`);
  p(`- **E-mail :** ${x.emails.length ? x.emails.map((e) => avecSource(e.valeur, e.source)).join(' ; ') : A_DEMANDER}`);
  p(`- **Adresse** — rue : ${adr?.rue ? avecSource(adr.rue, adr.source) : A_DEMANDER}`);
  p(`  code postal : ${adr ? adr.codePostal : A_DEMANDER}`);
  p(`  ville : ${adr ? adr.ville : A_DEMANDER}`);
  if (x.adresses.length > 1) p(`  autres adresses lues : ${x.adresses.slice(1, 4).map((a) => [a.rue, a.codePostal, a.ville].filter(Boolean).join(' ')).join(' ; ')}`);
  if (x.horaires.lignes.length) {
    p(`- **Horaires** (jour(s) → créneau, une ligne par plage) : tels qu'écrits sur ${x.horaires.source}, à confirmer :`);
    for (const h of x.horaires.lignes) p(`  - ${h}`);
  } else p(`- **Horaires** (jour(s) → créneau, une ligne par plage) : ${A_DEMANDER}`);
  p(`- **Urgence 24/7 ?** (oui/non — n'active le direction \`signal\` que si oui et que le métier s'y prête) : ${x.urgence.length ? `${x.urgence.map((u) => `${guill(u.texte)} (${u.source})`).join(' ; ')} ; à confirmer` : A_DEMANDER}`);
  p(`- **Lien fiche Google** (Google Maps / Google Business) : ${x.google ? avecSource(x.google.url, `lien sur ${x.google.source}`) : A_DEMANDER}`);
  p(`- **Lien de réservation en ligne** (Zenchef, TheFork, Planity, son propre outil… → bouton « Réserver ») : ${x.reservation ? avecSource(x.reservation.url, x.reservation.source) : 'aucun trouvé sur le site ; ' + A_DEMANDER}`);
  p(`- **Lien de commande / click & collect** (→ bouton « Commander ») : ${x.commande ? avecSource(x.commande.url, x.commande.source) : 'aucun trouvé sur le site ; ' + A_DEMANDER}`);
  p(`- **Lien de bon cadeau en ligne** (→ bouton « Bon cadeau ») : ${x.cadeau ? avecSource(x.cadeau.url, x.cadeau.source) : 'aucun trouvé sur le site ; ' + A_DEMANDER}`);
  p('', '> Ces trois liens ne s\'inventent pas : sans lien dans le brief, le bouton n\'existe pas sur le site', '> (`contact.bookingUrl` / `orderUrl` / `giftCardUrl` restent absents).');
  const notes = x.notesAffichees.length ? ` ; son site affiche : ${x.notesAffichees.map((n) => `${guill(n.texte)} (${n.source})`).join(' ; ')}, à ne pas recopier` : '';
  p(`- **Note Google actuelle** (sur 5) : ${A_DEMANDER} (à relever sur la fiche Google le jour du brief${notes})`);
  p(`- **Nombre d'avis Google actuel** : ${A_DEMANDER}`);
  p('', "> La note et le nombre d'avis doivent être recopiés tels quels depuis la fiche Google au moment du", "> brief — jamais arrondis à la hausse, jamais estimés. Si le client n'a pas encore de fiche Google,", '> laisse vide : la section "avis Google" du site ne s\'affichera pas.');

  p('', "## 3. Zone d'intervention", '');
  p(`- **Villes couvertes** (liste) : ${x.zone.length ? `${x.zone.map((z) => `${guill(z.texte)} (${z.source})`).join(' ; ')} ; liste à demander` : A_DEMANDER}`);
  p(`- **Rayon d'intervention** (en km, si pertinent) : ${A_DEMANDER}`);
  p(`- **Libellé court** (ex. "Métropole lilloise", si plus parlant qu'une liste de villes) : ${A_DEMANDER}`);

  p('', '## 4. Services (3 à 6)', '');
  if (!x.services.length) p(`Aucune page de service lue sur le site actuel : ${A_DEMANDER}. Titres de sections de l'accueil, à trier : ${d.titresAccueil.length ? d.titresAccueil.map(guill).join(', ') : 'aucun'}.`);
  else p(`Pages de service du site actuel (le slug sert aux redirections de \`redirects.json\` : garder le même dans \`site.config.ts\`, ou corriger les deux).${x.services.length > 6 ? ` ${x.services.length} pages : les 6 premières ci-dessous, les autres : ${x.services.slice(6).map((s) => s.titre).join(', ')}.` : ''}`);
  x.services.slice(0, 6).forEach((s, i) => {
    p('', `### Service ${i + 1}`);
    p(`- **Titre :** ${s.titre} (${s.source}) ; slug \`${s.slug}\``);
    p(`- **Ce que c'est, en une phrase** (pour la carte) : ${A_DEMANDER}${s.description ? ` ; description de la page : ${guill(s.description)}` : ''} ; texte de la page en annexe`);
    p(`- **Points forts** (2-4 puces courtes) : ${A_DEMANDER}`);
    p(`- **Prix "à partir de"** (uniquement si le client veut afficher un prix) : ${s.prix.length ? `affiché sur la page : ${s.prix.map(guill).join(' ; ')} ; à confirmer` : A_DEMANDER}`);
    p(`- **Service phare ?** (mis en avant sur la page d'accueil : oui/non) : ${A_DEMANDER}`);
  });

  p('', "## 5. Histoire de l'entreprise", '');
  const apropos = d.pages.filter((pg) => classerPage(pg.url) === 'apropos').map((pg) => pg.url);
  const voirAnnexe = apropos.length ? ` ; texte de ${apropos.join(', ')} en annexe` : '';
  p(`- **Qui ?** (fondateur·rice, parcours en une phrase) : ${A_DEMANDER}${voirAnnexe}`);
  p(`- **Depuis quand, pourquoi ?** (le déclic, la raison de se lancer) : ${x.annees.length ? `${x.annees.map((a) => `${guill(a.phrase)} (${a.source})`).join(' ; ')} ; ` : ''}${A_DEMANDER}`);
  p(`- **Équipe** (prénoms + rôle, si plusieurs personnes) : ${A_DEMANDER}${voirAnnexe}`);
  p(`- **Un ou deux jalons marquants** (année + fait, ex. "2015 — ouverture de l'atelier") : ${A_DEMANDER}`);

  p('', '## 6. Valeurs / ce qui les différencie', '');
  p(`- **3 choses qui les distinguent de la concurrence** (une phrase chacune) : ${A_DEMANDER} (ce que dit le site actuel : annexe)`);

  p('', '## 7. Avis clients réels', '', AVERTISSEMENT_AVIS, '');
  if (x.avis.length) {
    p(`Avis affichés sur le site actuel, recopiés tels quels le ${d.dateTexte}. Leur origine (Google, e-mail…) n'est pas prouvée par le site : la vérifier avec le client avant toute publication.`, '');
    for (const a of x.avis) {
      p(`- **Auteur** (prénom + initiale, comme affiché sur la source) : ${a.auteur || `${A_DEMANDER} (aucun nom affiché)`}`);
      p(`  - **Texte de l'avis** (copier tel quel, ne pas reformuler) : ${guill(a.texte)}`);
      p(`  - **Source** : affiché sur son site (${a.source}) ; origine d'avant : ${A_DEMANDER}`);
      p('  - **Ville du client** (si connue) : ?', '  - **Date** (si connue) : ?');
    }
  } else {
    p(`Aucun avis lisible sur le site actuel${d.jsSeul ? ' (peut-être chargés en JavaScript)' : ''}. Avis Google : ${A_DEMANDER}.`);
  }

  p('', '## 8. Photos disponibles', '');
  p("**Des photos sur le site ?** (aiguille la skill, voir `.claude/skills/site-final/aiguillage.md`)", '');
  const assez = d.photos.length >= 6;
  p(`- [${assez ? 'x' : ' '}] Oui, et j'en ai`);
  p("- [ ] Oui, mais je n'en ai pas encore → qui les fait : [ ] lui, au téléphone avec le guide photo  [ ] nous, sur place");
  p(`- [${assez ? ' ' : 'x'}] Peu ou pas, ça me va`);
  p('', `(Coché par \`ff refonte\` : ${d.photos.length} photo(s) utile(s) reprise(s) du site actuel ; seuil : 6. À confirmer avec le client.)`, '');
  p("Coche ce qui existe réellement chez le client (rien de tout ça ne se fabrique) :", '');
  p(`- [${x.logo ? 'x' : ' '}] Logo (fichier vectoriel ou haute résolution)${x.logo ? ` : ${x.logo.url} sur ${x.logo.source}, non téléchargé ; à demander en vectoriel` : ''}`);
  p('- [ ] Portrait / photo de l\'artisan ou de l\'équipe : à repérer dans `raw/` ; ' + A_DEMANDER);
  p(`- [${d.photos.length ? 'x' : ' '}] Photos de chantiers / réalisations${d.photos.length ? ` : ${d.photos.length} dans \`raw/\`, à trier (ce qu'on y voit n'est pas lu par la machine)` : ''}`);
  p('- [ ] Photos avant/après');
  p(`- [${d.photos.length ? ' ' : 'x'}] Aucune photo disponible`);
  p('', `**Lien vers les photos** (Drive, Dropbox, WeTransfer...) : ${d.photos.length ? '`raw/` (URL d\'origine, page, alt et dimensions dans `raw/SOURCES.md`) ; originaux en meilleure qualité : ' + A_DEMANDER : A_DEMANDER}`);
  const petites = d.photos.filter((ph) => ph.petite);
  if (petites.length) p('', `Trop petites pour le plein cadre (moins de ${LARGEUR_PLEIN_CADRE} px de large) : ${petites.map((ph) => `\`${ph.fichier}\` (${ph.largeur} px)`).join(', ')}. Bonnes pour une vignette, pas pour un premier écran.`);
  if (d.photos.length) {
    p('', '| Fichier | Alt sur son site | Dimensions | Page |', '|---|---|---|---|');
    for (const ph of d.photos) p(`| \`${ph.fichier}\` | ${ph.alt ? ph.alt.replace(/\|/g, '/') : '(aucun)'} | ${ph.largeur} × ${ph.hauteur} | ${ph.page} |`);
  }
  p('', '**Pour chaque photo de réalisation**, demander : lieu, type de travaux / de pièce, mesure, client (initiales, **avec son accord**) : ' + A_DEMANDER);
  p('', '> Les champs image de `site.config.ts` restent vides tant que les fichiers ne sont pas déposés dans', '> `sites/<slug>/public/images/`. Pas de photo de banque d\'images, pas de placeholder.');

  p('', '## 9. Réseaux sociaux', '');
  const r = (k) => (x.reseaux[k] ? avecSource(x.reseaux[k].url, x.reseaux[k].source) : A_DEMANDER);
  p(`- **Instagram** (URL complète) : ${r('instagram')}`);
  p(`- **Facebook** (URL complète) : ${r('facebook')}`);
  p(`- **LinkedIn** (URL complète) : ${r('linkedin')}`);
  p(`- **TikTok** (URL complète) : ${r('tiktok')}`);
  for (const k of ['youtube', 'pinterest']) if (x.reseaux[k]) p(`- ${k === 'youtube' ? 'YouTube' : 'Pinterest'} : ${r(k)}`);
  if (x.reseaux.linkedinPersonnel) p(`- Profil LinkedIn d'une personne lié depuis son site : ${r('linkedinPersonnel')} (le gérant ou le développeur du site ? à demander ; pas la page de l'entreprise)`);

  p('', '## 10. Questions fréquentes (la logistique, posée pendant l\'appel)', '');
  const faq = d.pages.filter((pg) => classerPage(pg.url) === 'faq').map((pg) => pg.url);
  if (faq.length) p(`Le site actuel a une page de questions (${faq.join(', ')}) : texte en annexe, réponses à faire confirmer.`, '');
  QUESTIONS_FAQ.forEach(([q, detail], i) => {
    p(`${i + 1}. **${q}** (${detail}) :`, `   - Réponse du client, telle quelle : ${A_DEMANDER}`, '   - Si pas de réponse : ne rien inventer.');
  });
  p('', 'Autres questions qui reviennent tout le temps (avec la réponse habituelle) :', '', '- **Q :**', '  **R :**');
  p('', '### 10bis. Conseils (facultatif)', '');
  const blog = d.pages.filter((pg) => classerPage(pg.url) === 'blog');
  p(blog.length ? `Articles déjà publiés sur son site (texte en annexe, à reprendre seulement avec son accord) : ${blog.map((b) => `${b.h1 || b.titre} (${b.url})`).join(' ; ')}` : `- Conseil 1 : ${A_DEMANDER}`);
  if (x.documents.length) p('', `Documents liés sur le site actuel : ${x.documents.map((doc) => `${doc.url} (sur ${doc.source})`).join(' ; ')}`);

  p('', '## 11. Domaine et mise en ligne', '');
  p(`- **Domaine : le client en a déjà un ?** [x] oui, lequel et chez quel registrar (OVH, Ionos, Gandi…) : ${d.hote} ; registrar : ${A_DEMANDER}`);
  p(`  Anciennes URL : \`redirects.json\` (${d.nbRedirections} redirection(s)) les renvoie vers les nouvelles pages, pour garder son référencement Google.${x.realisePar ? ` Pied de page du site actuel : ${guill(x.realisePar.texte)} (${x.realisePar.source}) : demander qui tient le site avant de proposer de le remplacer.` : ''}`);
  p(`- **Date limite / contrainte de délai** : ${A_DEMANDER}`);

  p('', '## 12. Ressenti du client — pour choisir la direction visuelle', '');
  p('- **Ambiance** (règle le mouvement, voir `aiguillage.md`) : [ ] plutôt calme, posé  [ ] plutôt vivant, qui bouge', '  [ ] je ne sais pas, montrez-moi');
  p('- **3 adjectifs utilisés par le client pour décrire ce qu\'il veut** (ses mots, pas les nôtres) :');
  p('- **Sites concurrents qu\'il aime** (URL + ce qu\'il aime) :');
  p('- **Sites concurrents qu\'il n\'aime pas** (URL + pourquoi) :');
  p('- **Qu\'est-ce qu\'on pourrait filmer chez vous en 5 secondes ?** :');
  p('- **Quand un client hésite, qu\'est-ce qui le rassure ?** :');
  p(`- **Remarques libres :** refonte de son site actuel (${d.url}).`);

  p('', '---', '', '## Choix atelier — rempli par nous, pas par le client', '');
  for (const champ of ['Direction', 'Motion** (none / subtle / rich)', 'Typographie** (`typography.display` / `typography.body`, si surcharge de la paire de la direction)', 'Échelle** (`scale` : compact / normal / display)', 'Nav', 'Hero', 'Sections et variantes** (dans l\'ordre)', 'Tone** (`layout.tone` : flat / alternate)', 'Séparateur** (`layout.divider` : none / wave / diagonal / curve / rule / zigzag)', 'Footer', 'Libellés** (`wording.devis` et les autres si le défaut ne convient pas au métier)', 'Pages villes** (`seo.cityPages` : oui seulement si 4+ services et une vraie liste de villes)', 'Justification en une phrase** (pourquoi cette direction pour ce métier/client)']) {
    p(champ.includes('**') ? `- **${champ} :` : `- **${champ} :**`);
  }

  p('', '---', '', '## Annexe — Textes du site actuel', '');
  p(`Recopiés tels quels le ${d.dateTexte}, page par page, sans menu ni pied de page (titres en gras). C'est la matière de la réécriture (\`/site-final\`) : on garde les faits, on réécrit les phrases, on ne recopie jamais un texte creux et on n'ajoute rien que le client n'ait dit.`);
  for (const pg of d.pages) {
    p('', `### ${pg.h1 || pg.titre || pg.url}`, '', `${pg.url}${pg.titre ? ` ; titre : ${guill(pg.titre)}` : ''}`);
    if (pg.description) p(`Description : ${guill(pg.description)}`);
    p('');
    if (classerPage(pg.url) === 'confidentialite') {
      p('(politique de confidentialité : non recopiée, le nouveau site a la sienne, générée selon son formulaire)', '');
      continue;
    }
    let n = 0;
    let coupe = false;
    for (const l of pg.principal) {
      if (n > 12000) {
        coupe = true;
        break;
      }
      n += l.t.length;
      p(l.h ? `**${l.t}**` : l.t, '');
    }
    if (!pg.principal.length) p('(aucun texte lisible sans navigateur)', '');
    if (coupe) p('(… coupé : page trop longue)', '');
  }
  return `${L.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

/** Pure : raw/SOURCES.md. */
export function rendreSources(photos, { url, dateTexte, ecartees = {} }) {
  const L = ['# Sources des photos (ff refonte)', '', `Téléchargées le ${dateTexte} depuis le site actuel du client, ${url} (plus grande variante servie par le site). Elles sont au client : demander son accord avant de les publier.`, ''];
  L.push('| Fichier | URL d\'origine | Page | Alt | Dimensions | Note |', '|---|---|---|---|---|---|');
  for (const ph of photos) L.push(`| \`${ph.fichier}\` | ${ph.url} | ${ph.page} | ${ph.alt ? ph.alt.replace(/\|/g, '/') : ''} | ${ph.largeur} × ${ph.hauteur} | ${ph.petite ? `trop petite pour le plein cadre (< ${LARGEUR_PLEIN_CADRE} px de large)` : ''} |`);
  const ec = Object.entries(ecartees);
  if (ec.length) L.push('', `Écartées : ${ec.map(([raison, n]) => `${n} ${raison}`).join(', ')}.`);
  return `${L.join('\n')}\n`;
}

// ---------------------------------------------------------------------------------------------
// Réseau (une requête toutes les 500 ms, User-Agent honnête)
// ---------------------------------------------------------------------------------------------

let dernierAppel = 0;
async function tour() {
  const attente = dernierAppel + DELAI_MS - Date.now();
  if (attente > 0) await new Promise((r) => setTimeout(r, attente));
  dernierAppel = Date.now();
}

async function lireCorps(res, max) {
  const lecteur = res.body?.getReader?.();
  if (!lecteur) return Buffer.from(await res.arrayBuffer());
  const morceaux = [];
  let total = 0;
  for (;;) {
    const { done, value } = await lecteur.read();
    if (done) break;
    total += value.length;
    if (total > max) {
      await lecteur.cancel();
      throw new Error(`trop lourd (> ${Math.round(max / 1024 / 1024)} Mo)`);
    }
    morceaux.push(value);
  }
  return Buffer.concat(morceaux.map((m) => Buffer.from(m)));
}

async function obtenir(url, { accept = 'text/html,application/xhtml+xml', max = MAX_OCTETS_PAGE } = {}) {
  await tour();
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: accept, 'Accept-Language': 'fr-FR,fr;q=0.9' }, redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT_MS) });
  const type = res.headers.get('content-type') || '';
  const corps = res.ok ? await lireCorps(res, max) : Buffer.alloc(0);
  if (!res.ok) await res.body?.cancel?.().catch(() => {});
  return { statut: res.status, url: res.url || url, type, corps };
}

function decoderTexte(buf, type) {
  let cs = /charset=["']?([\w-]+)/i.exec(type)?.[1];
  if (!cs) cs = /<meta[^>]+charset\s*=\s*["']?([\w-]+)/i.exec(buf.subarray(0, 4096).toString('latin1'))?.[1];
  try {
    return new TextDecoder(cs || 'utf-8').decode(buf);
  } catch {
    return new TextDecoder('utf-8').decode(buf);
  }
}

// ---------------------------------------------------------------------------------------------
// Commande
// ---------------------------------------------------------------------------------------------

function sortir(msg) {
  fail(msg);
  process.exit(1);
}

export async function cmdRefonte(args) {
  const t0 = Date.now();
  const { positional, flags } = parseArgs(args);
  if (!positional[0]) sortir('Usage : ff refonte <url> [slug] [--max-pages 25] [--sans-photos]');
  let depart;
  try {
    depart = validerUrl(/^[a-z][a-z0-9+.-]*:/i.test(positional[0]) ? positional[0] : `https://${positional[0]}`);
  } catch (e) {
    sortir(e.message);
  }
  const slug = positional[1] || slugDepuisUrl(depart);
  if (!/^[a-z0-9-]+$/.test(slug)) sortir(`Slug invalide : « ${slug} » (minuscules, chiffres, tirets).`);
  const maxPages = Math.max(1, Math.min(200, Number.parseInt(flags['max-pages'] ?? MAX_PAGES_DEFAUT, 10) || MAX_PAGES_DEFAUT));
  const hote = new URL(depart).hostname;
  info(c.bold(`ff refonte : ${depart} -> sites/${slug} (au plus ${maxPages} pages, sans navigateur)`));

  // 1. robots.txt
  let robots = { regles: [], sitemaps: [] };
  try {
    const r = await obtenir(new URL('/robots.txt', depart).href, { accept: 'text/plain', max: 512 * 1024 });
    if (r.statut === 200) robots = lireRobots(decoderTexte(r.corps, r.type));
  } catch (e) {
    sortir(`Site injoignable (${hote}) : ${e.cause?.code || e.message}. Vérifie l'adresse ou réessaie plus tard.`);
  }
  const permis = (u) => {
    const x = new URL(u);
    return robotsAutorise(robots.regles, `${x.pathname}${x.search}`);
  };
  if (!permis(depart)) sortir(`robots.txt de ${hote} interdit l'exploration de ${new URL(depart).pathname} : on n'y va pas. Demande les textes et photos au client.`);

  // 2. Accueil
  const pages = [];
  const vues = new Set();
  const lire = async (url) => {
    const r = await obtenir(url);
    if (r.statut === 429 || r.statut === 503) throw Object.assign(new Error(`le site demande de ralentir (HTTP ${r.statut})`), { arret: true });
    if (r.statut >= 400) return { erreur: `HTTP ${r.statut}` };
    if (!memeDomaine(r.url, depart)) return { erreur: `redirigée hors du site (${new URL(r.url).hostname})` };
    if (!/html|xml\+xhtml/i.test(r.type)) return { erreur: `pas une page (${r.type.split(';')[0] || 'type inconnu'})` };
    return { page: lirePage(decoderTexte(r.corps, r.type), r.url) };
  };
  let accueil;
  try {
    accueil = await lire(depart);
  } catch (e) {
    sortir(`Site injoignable (${hote}) : ${e.cause?.code || e.message}.`);
  }
  if (accueil.erreur) sortir(`L'accueil de ${hote} ne répond pas comme une page (${accueil.erreur}) : site en panne ou qui refuse les robots. Rien n'a été créé.`);
  pages.push(accueil.page);
  vues.add(cleUrl(accueil.page.url));
  vues.add(cleUrl(depart));

  // 3. Sitemaps (robots.txt, puis /sitemap.xml, puis /sitemap_index.xml)
  const urlsSitemap = [];
  const aLire = [...new Set([...robots.sitemaps, new URL('/sitemap.xml', depart).href])].filter((s) => memeDomaine(s, depart));
  const sitemapsLus = new Set();
  let essaiIndex = false;
  while (aLire.length && sitemapsLus.size < 12 && urlsSitemap.length < MAX_URLS_SITEMAP) {
    const s = aLire.shift();
    if (sitemapsLus.has(s) || /\.gz$/i.test(s)) continue;
    sitemapsLus.add(s);
    try {
      const r = await obtenir(s, { accept: 'application/xml,text/xml', max: 10 * 1024 * 1024 });
      if (r.statut !== 200) {
        if (!essaiIndex && !urlsSitemap.length) {
          essaiIndex = true;
          aLire.push(new URL('/sitemap_index.xml', depart).href);
        }
        continue;
      }
      const { index, locs } = lireSitemap(decoderTexte(r.corps, r.type));
      if (index) aLire.push(...locs.filter((l) => memeDomaine(l, depart)));
      else urlsSitemap.push(...locs.filter((l) => memeDomaine(l, depart) && !estRessource(l)));
    } catch {
      /* sitemap illisible : on passe aux liens */
    }
  }
  const depuisSitemap = urlsSitemap.length > 0;
  const liensDe = (pg) => pg.liens.map((l) => l.href).filter((h) => /^https?:/i.test(h) && memeDomaine(h, depart) && !estRessource(h)).map((h) => h.split('#')[0]);
  let file = ordonnerUrls([...new Set(depuisSitemap ? urlsSitemap : liensDe(accueil.page))]);
  const connues = new Set([...file, accueil.page.url].map(cleUrl));
  const toutesConnues = [accueil.page.url, ...file];

  // 4. Pages
  const erreurs = [];
  let arret = null;
  while (file.length && pages.length < maxPages) {
    const url = file.shift();
    const k = cleUrl(url);
    if (vues.has(k)) continue;
    vues.add(k);
    if (!permis(url)) {
      erreurs.push(`${url} : interdite par robots.txt`);
      continue;
    }
    try {
      const r = await lire(url);
      if (r.erreur) {
        erreurs.push(`${url} : ${r.erreur}`);
        continue;
      }
      if (vues.has(cleUrl(r.page.url)) && cleUrl(r.page.url) !== k) continue;
      vues.add(cleUrl(r.page.url));
      pages.push(r.page);
      process.stdout.write(c.dim(`  page ${pages.length}/${maxPages} ${r.page.url}\n`));
      if (!depuisSitemap) {
        const nouvelles = liensDe(r.page).filter((h) => !connues.has(cleUrl(h)));
        nouvelles.forEach((h) => {
          connues.add(cleUrl(h));
          toutesConnues.push(h);
        });
        file = ordonnerUrls([...file, ...nouvelles]);
      }
    } catch (e) {
      if (e.arret) {
        arret = e.message;
        break;
      }
      erreurs.push(`${url} : ${e.cause?.code || e.message}`);
    }
  }

  // 5. Extraction
  const extraction = extraireTout(pages.map((pg) => ({ ...pg, principalTexte: pg.principal.map((l) => l.t) })), { urlsConnues: toutesConnues });
  const pagesVides = pages.filter((pg) => pg.videJs);
  const jsSeul = pagesVides.some((pg) => pg === pages[0]) || pagesVides.length * 2 >= pages.length;

  // 6. Site (ff nouveau s'il n'existe pas) : seulement maintenant que le site a répondu.
  const dossier = path.join(SITES_DIR, slug);
  if (!fs.existsSync(path.join(dossier, 'site.config.ts'))) {
    const n = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'ff.mjs'), 'nouveau', slug], { cwd: ROOT, encoding: 'utf8' });
    if (n.status !== 0) sortir(`ff nouveau ${slug} a échoué :\n${n.stdout}${n.stderr}`);
    ok(`sites/${slug} créé (ff nouveau).`);
  }
  const rawDir = path.join(dossier, 'raw');
  fs.mkdirSync(rawDir, { recursive: true });

  // 7. Photos
  const photos = [];
  const ecartees = {};
  const ecarter = (raison) => (ecartees[raison] = (ecartees[raison] || 0) + 1);
  if (!flags['sans-photos']) {
    let sharp = null;
    try {
      sharp = (await import('sharp')).default;
    } catch {
      warn('sharp introuvable : dimensions des photos non vérifiées.');
    }
    const candidates = [];
    const vuesImg = new Set();
    for (const pg of pages) {
      for (const img of pg.images) {
        const k = img.url.split('#')[0];
        if (vuesImg.has(k)) continue;
        vuesImg.add(k);
        const f = filtrerImage(img);
        if (!f.garder) ecarter(f.raison);
        else candidates.push({ ...img, page: pg.url });
      }
    }
    const pris = new Set(fs.readdirSync(rawDir));
    const empreintes = new Set();
    let essais = 0;
    for (const img of candidates) {
      if (photos.length >= MAX_PHOTOS || essais >= MAX_PHOTOS * 2) break;
      if (memeDomaine(img.url, depart) && !permis(img.url)) {
        ecarter('interdite par robots.txt');
        continue;
      }
      essais++;
      try {
        const r = await obtenir(img.url, { accept: 'image/avif,image/webp,image/jpeg,image/png,image/*;q=0.8', max: MAX_OCTETS_IMAGE });
        if (r.statut !== 200) {
          ecarter('introuvable');
          continue;
        }
        const ext = typeImage(r.corps);
        if (!ext) {
          ecarter('pas une photo (svg, html…)');
          continue;
        }
        const empreinte = crypto.createHash('sha1').update(r.corps).digest('hex');
        if (empreintes.has(empreinte)) {
          ecarter('doublon');
          continue;
        }
        let largeur = null;
        let hauteur = null;
        if (sharp) {
          try {
            const m = await sharp(r.corps).metadata();
            const tourne = (m.orientation || 1) >= 5;
            largeur = tourne ? m.height : m.width;
            hauteur = tourne ? m.width : m.height;
          } catch {
            ecarter('image illisible');
            continue;
          }
          if (Math.max(largeur, hauteur) < COTE_MIN_PX) {
            ecarter(`icône < ${COTE_MIN_PX} px`);
            continue;
          }
        }
        empreintes.add(empreinte);
        const fichier = nomFichierPhoto(r.url || img.url, img.page, ext, pris);
        fs.writeFileSync(path.join(rawDir, fichier), r.corps, { flag: 'wx' });
        photos.push({ fichier, url: img.url, page: img.page, alt: img.alt, largeur, hauteur, petite: Boolean(largeur && largeur < LARGEUR_PLEIN_CADRE) });
      } catch (e) {
        ecarter(`erreur réseau (${e.cause?.code || e.name})`);
      }
    }
  }

  // 8. Écritures (jamais par-dessus un travail fait à la main)
  const date = new Date();
  const dateTexte = dateFr(date);
  const servicesParUrl = Object.fromEntries(extraction.services.map((s) => [cleUrl(s.source), s.slug]));
  const titres = Object.fromEntries(pages.map((pg) => [cleUrl(pg.url), pg.titre]));
  const origine = `ff refonte ${depart} le ${date.toISOString().slice(0, 10)}`;
  const plan = planRedirections(toutesConnues, { titres, servicesParUrl, origine });
  const ecrireSansEcraser = (nomFichier, texte, estANous) => {
    const p = path.join(dossier, nomFichier);
    if (fs.existsSync(p) && !estANous(fs.readFileSync(p, 'utf8'))) {
      const alt = nomFichier.replace(/(\.[a-z]+)$/, '-refonte$1');
      fs.writeFileSync(path.join(dossier, alt), texte);
      warn(`${path.relative(ROOT, p)} existe déjà (pas de ff refonte) : écrit dans ${alt}, à fusionner à la main.`);
      return alt;
    }
    fs.writeFileSync(p, texte);
    return nomFichier;
  };
  const gabarit = fs.existsSync(path.join(ROOT, 'docs', 'BRIEF.md')) ? fs.readFileSync(path.join(ROOT, 'docs', 'BRIEF.md'), 'utf8') : '';
  const brief = rendreBrief({
    url: depart, hote: hoteNu(hote), dateTexte, pages, extraction, photos, jsSeul, pagesVides, depuisSitemap,
    urlsConnues: toutesConnues.length, nbRedirections: plan.redirects.length,
    titresAccueil: pages[0].principal.filter((l) => l.h >= 2 && l.h <= 3).map((l) => l.t).slice(0, 12),
  });
  const briefEcrit = ecrireSansEcraser('brief.md', brief, (t) => t === gabarit || t.startsWith('> **REFONTE de'));
  const redirEcrit = ecrireSansEcraser('redirects.json', `${JSON.stringify({ origine, redirects: plan.redirects }, null, 2)}\n`, (t) => /"origine":\s*"ff refonte/.test(t));
  if (photos.length || Object.keys(ecartees).length) ecrireSansEcraser(path.join('raw', 'SOURCES.md'), rendreSources(photos, { url: depart, dateTexte, ecartees }), (t) => t.startsWith('# Sources des photos (ff refonte)'));

  // 9. Résumé
  const s = Math.round((Date.now() - t0) / 1000);
  info('');
  ok(`${pages.length} page(s) lue(s) sur ${toutesConnues.length} connue(s) (${depuisSitemap ? 'sitemap' : 'liens internes'}), en ${s} s.`);
  if (arret) warn(`Exploration arrêtée : ${arret}.`);
  if (erreurs.length) warn(`${erreurs.length} page(s) non lue(s) : ${erreurs.slice(0, 3).join(' ; ')}${erreurs.length > 3 ? ' …' : ''}`);
  if (jsSeul) warn(`Contenu chargé en JavaScript : ${pagesVides.length} page(s) sur ${pages.length} presque vides sans navigateur (${pagesVides.slice(0, 3).map((p) => new URL(p.url).pathname).join(', ')}). Pour les voir : node scripts/ff.mjs demonter ${depart} --slug ${slug}`);
  const petites = photos.filter((p) => p.petite).length;
  if (!flags['sans-photos']) ok(`${photos.length} photo(s) gardée(s) dans sites/${slug}/raw/ (dont ${petites} trop petite(s) pour le plein cadre, < ${LARGEUR_PLEIN_CADRE} px) ; écartées : ${Object.entries(ecartees).map(([r, n]) => `${n} ${r}`).join(', ') || 'aucune'}.`);
  ok(`sites/${slug}/${briefEcrit} ; sites/${slug}/${redirEcrit} (${plan.redirects.length} redirection(s)${plan.ignorees.length ? `, ${plan.ignorees.length} URL à requête non redirigées` : ''}).`);
  const x = extraction;
  const manque = [
    !x.nom && 'nom', !x.telephones.length && 'téléphone', !x.emails.length && 'e-mail', !x.adresses.length && 'adresse',
    !x.horaires.lignes.length && 'horaires', !x.services.length && 'services', !x.legal.siret && 'SIRET', !x.avis.length && 'avis',
    !Object.keys(x.reseaux).length && 'réseaux', photos.length < 6 && 'photos (moins de 6)',
  ].filter(Boolean);
  const trouve = [
    x.nom && `nom « ${x.nom.valeur} »`, x.telephones[0] && x.telephones[0].valeur, x.emails[0]?.valeur, x.adresses[0] && `${x.adresses[0].codePostal} ${x.adresses[0].ville}`,
    x.horaires.lignes.length && `${x.horaires.lignes.length} ligne(s) d'horaires`, x.services.length && `${x.services.length} service(s)`, x.legal.siret && `SIRET ${x.legal.siret.valeur.valeur}`,
    x.avis.length && `${x.avis.length} avis`, Object.keys(x.reseaux).length && Object.keys(x.reseaux).join('/'),
  ].filter(Boolean);
  info(`  Trouvé : ${trouve.join(', ') || 'rien'}.`);
  if (manque.length) warn(`Manque (« ? à demander » dans le brief) : ${manque.join(', ')}.`);
  info('');
  info(c.bold('Suite :'));
  info(`  1. Relire sites/${slug}/brief.md avec le client : son accord pour reprendre ses textes et ses photos, et ce qui manque.`);
  info(`  2. ${c.cyan(`/site-final ${slug}`)} (Claude Code) : lit l'annexe « Textes du site actuel » et réécrit.`);
  info(`  3. Au déploiement, garder les slugs de services de redirects.json dans site.config.ts.`);
}
