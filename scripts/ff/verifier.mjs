// `ff verifier [slug] [--lighthouse] [--sans-a11y] [--sans-build] [--bavard]` (alias `check`) : build + checklist SEO/contenu sur
// dist/<slug>/**/*.html, puis audit d'accessibilite axe (scripts/ff/a11y.mjs, toutes les pages, desktop
// + mobile ; bloquant sur une violation critical/serious ; `--sans-a11y` pour le sauter, ex. sans Chrome). `--lighthouse` ajoute en fin de parcours un audit Lighthouse complet
// (scripts/ff/lighthouse.mjs) — non lance par defaut car lent (plusieurs pages x desktop/mobile).
import fs from 'node:fs';
import path from 'node:path';
import { DIST_DIR, SITES_DIR, resolveSlug, runAstro, ok, fail, warn, info, c, parseArgs } from './util.mjs';
import { runLighthouse } from './lighthouse.mjs';
import { runA11y } from './a11y.mjs';
import { garderDonneesTest, estSiteDemo } from './garde-donnees.mjs';
import { analyserHtml as analyserTypo } from './typo.mjs';
import { analyserSite as analyserIa } from './ia.mjs';

const FORBIDDEN = [
  { label: 'lorem', re: /lorem/i },
  { label: '+500', re: /\+500/ },
  // Promesse creuse (« 100 % satisfaits », « 100 % garanti ») seulement : « 100 % Santé » (dispositif
  // officiel, dentistes, opticiens) et « remboursé à 100 % » sont des faits (audit du 14 oct 2026).
  { label: '100 % (promesse)', re: /100\s?%\s*(?:de\s+(?:nos\s+)?clients|satisf|garanti|naturel|qualit|fiable|s[ée]rieux)/i },
  { label: 'Prenom Nom', re: /pr[ée]nom nom/i },
  { label: '06 00 00 00 00', re: /06\s?00\s?00\s?00\s?00/ },
];

// Toujours actifs, quel que soit le slug (contrairement a FORBIDDEN qui varie pour _exemple) :
// artefacts de bug plutot que de contenu de substitution.
const ALWAYS_FORBIDDEN = [
  { label: '"undefined" affiche', re: /\bundefined\b/ },
  { label: '"NaN" affiche', re: /\bNaN\b/ },
  { label: '"[object Object]" affiche', re: /\[object Object\]/ },
  // `&nbsp;` n'est decode que dans les champs rendus via set:html (tagline, ctaTitle) ; partout
  // ailleurs (description, faq, services...) Astro l'echappe et le visiteur lit « &nbsp; » en toutes
  // lettres (vu sur 3 sites le 20 sept 2026). Le texte visible etant deja depouille de ses balises
  // ici, l'entite echappee apparait telle quelle : `&amp;nbsp;`. Ecrire le caractere U+00A0 a la place.
  { label: '"&nbsp;" affiche en clair (ecrire le caractere insecable U+00A0)', re: /&amp;nbsp;/ },
];

function listHtmlFiles(dir) {
  return listFilesWithExt(dir, '.html');
}

function listFilesWithExt(dir, ext) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFilesWithExt(full, ext));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(ext)) out.push(full);
  }
  return out;
}

// Mot-cles metier -> sous-type schema.org, copie allegee (a jour manuellement) de
// schemaTypeForTrade() dans src/lib/site.ts : verifier.mjs tourne en Node pur (pas d'Astro/Vite),
// donc ne peut pas importer site.ts (import.meta.glob y echoue hors contexte Vite). On ne verifie
// ici que "un mot-cle connu existe-t-il dans le metier", pas le type exact attendu.
const TRADE_KEYWORDS = [
  'plombier', 'chauffag', 'electricien', 'couvreur', 'zingueur', 'serrurier', 'coiffeu', 'barbier',
  'institut', 'spa', 'restaurant', 'bouillabaisse', 'boulanger', 'patissier', 'patisserie', 'garage',
  'mecanicien', 'avocat', 'dentiste', 'veterinaire', 'osteopathe', 'kinesitherap', 'kine',
  'photographe', 'paysagiste', 'menuisier', 'ebeniste', 'ferronn', 'architecte', 'fleuriste',
  'chambres d', 'chambre d', 'auto-ecole', 'auto ecole', 'tatou', 'coach', 'yoga', 'traiteur',
  'brasserie', 'immobil', 'macon', 'informatique',
];

function stripDiacritics(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/** Lit business.trade dans sites/<slug>/site.config.ts (regex, pas d'import TS). */
function readTradeFromConfig(slug) {
  const configPath = path.join(SITES_DIR, slug, 'site.config.ts');
  if (!fs.existsSync(configPath)) return '';
  const src = fs.readFileSync(configPath, 'utf8');
  const m = src.match(/trade\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/);
  return m ? m[2] : '';
}

function checkPresence(files, distDir, re, label, checks) {
  const missing = [];
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    if (!re.test(html)) missing.push(path.relative(distDir, file));
  }
  if (missing.length > 0) checks.push({ pass: false, label: `${label} manquant dans : ${missing.join(', ')}` });
  else checks.push({ pass: true, label: `${label} present partout` });
}

function checkOffenders(files, distDir, re, label, checks) {
  const offenders = [];
  for (const file of files) {
    // Texte visible seulement : on retire <style>, <script> et les attributs, sinon "100 %" matche width:100%.
    const html = fs.readFileSync(file, 'utf8')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ');
    if (re.test(html)) offenders.push(path.relative(distDir, file));
  }
  if (offenders.length > 0) checks.push({ pass: false, label: `${label} trouve dans : ${offenders.join(', ')}` });
  else checks.push({ pass: true, label: `Pas de ${label}` });
}

function checkExactlyOneH1(files, distDir, checks) {
  const offenders = [];
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const count = (html.match(/<h1[\s>]/gi) || []).length;
    if (count !== 1) offenders.push(`${path.relative(distDir, file)} (${count})`);
  }
  if (offenders.length > 0) checks.push({ pass: false, label: `Un seul <h1> attendu par page, trouve : ${offenders.join(', ')}` });
  else checks.push({ pass: true, label: 'Exactement un <h1> par page' });
}

function checkNoEmptyAnchor(files, distDir, checks) {
  checkOffenders(files, distDir, /<a\b[^>]*\bhref=(["'])#\1[^>]*>/i, '<a href="#"> vide', checks);
}

/** Honeypot : un <form> present doit contenir un champ piege a bots (input cache, tabindex="-1"). */
function checkHoneypot(files, distDir, checks) {
  const offenders = [];
  const formRe = /<form\b[^>]*>[\s\S]*?<\/form>/gi;
  const honeypotRe = /<input\b[^>]*\btabindex=["']-1["'][^>]*>/i;
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const forms = html.match(formRe) || [];
    for (const form of forms) {
      if (!honeypotRe.test(form)) {
        offenders.push(path.relative(distDir, file));
        break;
      }
    }
  }
  if (offenders.length > 0) checks.push({ pass: false, label: `Formulaire sans champ honeypot (piege a bots) dans : ${offenders.join(', ')}` });
  else checks.push({ pass: true, label: 'Honeypot present sur les formulaires (ou aucun formulaire)' });
}

/** Non-bloquant : <img> sans width/height ni loading (CLS potentiel). */
function warnImagesSansDimension(files, distDir, warnings) {
  const imgTagRe = /<img\b[^>]*>/gi;
  const offenders = new Set();
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const tags = html.match(imgTagRe) || [];
    for (const tag of tags) {
      const hasWidth = /\bwidth\s*=/i.test(tag);
      const hasHeight = /\bheight\s*=/i.test(tag);
      const hasLoading = /\bloading\s*=/i.test(tag);
      if (!((hasWidth && hasHeight) || hasLoading)) offenders.add(path.relative(distDir, file));
    }
  }
  if (offenders.size > 0) {
    warnings.push(`<img> sans width+height ni loading (risque de CLS) dans : ${[...offenders].join(', ')}`);
  }
}

/** JSON-LD sans aggregateRating/Review auto-declare (Google sanctionne les avis self-serving). */
function checkNoAggregateRating(files, distDir, checks) {
  checkOffenders(files, distDir, /"aggregateRating"|"@type"\s*:\s*"AggregateRating"/i, 'aggregateRating dans le JSON-LD', checks);
}

/** Avertit si @type reste le "LocalBusiness" generique alors que le metier a un mot-cle connu. */
function warnSchemaTypeGenerique(slug, files, distDir, warnings) {
  const trade = readTradeFromConfig(slug);
  if (!trade) return;
  const normalized = stripDiacritics(trade);
  const matched = TRADE_KEYWORDS.some((kw) => normalized.includes(kw));
  if (!matched) return;
  const offenders = [];
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    if (/"@type"\s*:\s*"LocalBusiness"/.test(html)) offenders.push(path.relative(distDir, file));
  }
  if (offenders.length > 0) {
    warnings.push(`@type JSON-LD reste "LocalBusiness" generique alors que le metier ("${trade}") a un sous-type connu (business.schemaType ou schemaTypeForTrade) dans : ${offenders.join(', ')}`);
  }
}

/** Retire un bloc `<div ...marqueur...>...</div>` en comptant les div imbriquees (contrairement a un
 * `[\s\S]*?<\/div>` non gourmand, qui s'arrete au tout premier </div> imbrique et laisse le reste). */
function stripBalancedDiv(html, marker) {
  const openRe = new RegExp(`<div\\b[^>]*${marker}[^>]*>`, 'i');
  const m = openRe.exec(html);
  if (!m) return html;
  const start = m.index;
  const tagRe = /<div\b[^>]*>|<\/div>/gi;
  tagRe.lastIndex = start + m[0].length;
  let depth = 1;
  let end = html.length;
  let match;
  while ((match = tagRe.exec(html))) {
    depth += match[0].toLowerCase().startsWith('</div') ? -1 : 1;
    if (depth === 0) {
      end = match.index + match[0].length;
      break;
    }
  }
  return html.slice(0, start) + html.slice(end);
}

/** tel: cliquable attendu tres tot dans le corps de la page d'accueil (premier ecran). */
function checkTelPremierEcran(distDir, checks) {
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    checks.push({ pass: false, label: 'index.html introuvable pour verifier le tel: du premier ecran' });
    return;
  }
  const html = fs.readFileSync(indexPath, 'utf8');
  const bodyIdx = html.search(/<body[^>]*>/i);
  const start = bodyIdx === -1 ? 0 : html.indexOf('>', bodyIdx) + 1;
  // On mesure la distance vue par un VISITEUR, pas le nombre d'octets : on retire d'abord les blocs
  // techniques que le moteur d'animation pose en tete de <body> et qui n'affichent rien (definition
  // de filtre SVG pour data-duotone, rideau de transition de page) ET toutes les icones SVG inline,
  // qui pesent ~400 caracteres chacune sans afficher un mot. Sans ca, un site parfaitement correct
  // echouait pour un <filter> invisible (finck-fisch) ou pour une icone de nav de plus (chez-malo,
  // 18 sept 2026) — on mesurait des octets, pas la distance reellement parcourue par l'oeil.
  // Meme raisonnement pour le panneau plein ecran de Nav/burger.astro (`data-burger-panel`,
  // `aria-hidden="true"` par defaut) : il precede le hero dans le HTML mais reste invisible tant
  // qu'on n'a pas clique sur le bouton — sans le retirer, tout site en nav "burger" avec un telephone
  // present dans le panneau ET dans le hero echouait a cause du panneau seul. Et pour les
  // `<script>...</script>` inline (ex. le petit script d'ouverture/fermeture du burger juste apres
  // son `<header>`) : du code, jamais un mot affiche, mais des centaines de caracteres minifies
  // (essai-dryrun, 20 sept 2026, hero "marquee" avec bouton tel: legitime a l'ecran, repousse au-dela
  // de 1500 caracteres par le panneau ET son script avant qu'on les retire tous les deux). Une fois
  // panneau et script retires, un hero complet (eyebrow + h1 + sous-titre + bouton tel:) sous un
  // header a nom+bouton fixe atteint encore ~1800 caracteres bruts avec les classes Tailwind
  // (verbeuses par construction) : marge portee de 1500 a 2200 pour ne plus dependre du nombre exact
  // de mots du sous-titre d'un site donne.
  const BUDGET = 2200;
  const corps = stripBalancedDiv(
    html
      .slice(start)
      .replace(/<svg[\s\S]*?<\/svg>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<div class="ff-curtain[^"]*"[^>]*>[\s\S]*?<\/div>/i, ''),
    'data-burger-panel',
  );
  const slice = corps.slice(0, BUDGET);
  if (/href=["']tel:/i.test(slice)) checks.push({ pass: true, label: `Lien tel: present dans les ${BUDGET} premiers caracteres du corps de index.html` });
  else checks.push({ pass: false, label: `Aucun lien tel: dans les ${BUDGET} premiers caracteres du corps de index.html` });
}

/** Formulaire de contact reduit : ≤ 5 champs (honeypot exclu). */
function warnFormulaireTropLong(files, distDir, warnings) {
  const offenders = [];
  const formRe = /<form\b[^>]*>[\s\S]*?<\/form>/gi;
  const fieldRe = /<(input|select|textarea)\b[^>]*>/gi;
  const honeypotRe = /\btabindex=["']-1["']/i;
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const forms = html.match(formRe) || [];
    for (const form of forms) {
      const fields = (form.match(fieldRe) || []).filter((f) => !honeypotRe.test(f));
      if (fields.length > 5) {
        offenders.push(`${path.relative(distDir, file)} (${fields.length} champs)`);
      }
    }
  }
  if (offenders.length > 0) warnings.push(`Formulaire de contact avec plus de 5 champs (hors honeypot) : ${offenders.join(', ')}`);
}

/** Aucune iframe Google Maps chargee au premier affichage : doit passer par la facade (Carte.astro). */
function checkPasIframeGoogleAuChargement(files, distDir, checks) {
  checkOffenders(files, distDir, /<iframe\b[^>]*\bsrc=["']https:\/\/www\.google\.com\/maps/i, 'iframe Google Maps chargee au demarrage (doit passer par la facade)', checks);
}

/** confidentialite.html existe et est linkee depuis la page d'accueil. */
function checkConfidentialite(distDir, checks) {
  const confPath = path.join(distDir, 'confidentialite.html');
  if (!fs.existsSync(confPath)) {
    checks.push({ pass: false, label: 'confidentialite.html absent de dist/' });
    return;
  }
  checks.push({ pass: true, label: 'confidentialite.html present' });
  const indexPath = path.join(distDir, 'index.html');
  const html = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf8') : '';
  if (/href=["']\/confidentialite["']/i.test(html)) {
    checks.push({ pass: true, label: 'confidentialite.html linke depuis index.html' });
  } else {
    checks.push({ pass: false, label: 'confidentialite.html non linke depuis index.html' });
  }
}

/**
 * Attribution photo obligatoire (CC BY / CC BY-SA, `ff photos`) affichee sur le site livre : si
 * sites/<slug>/CREDITS.md contient au moins une ligne "attribution obligatoire", la page /credits
 * doit exister dans dist/ ET etre linkee depuis index.html — sinon l'attribution legalement due
 * n'est visible que dans un fichier Markdown interne au studio, jamais du visiteur (voir
 * docs/veille/redaction-images.md §2, src/pages-optional/credits.astro,
 * scripts/astro-credits-integration.mjs). Fonction pure separee de la lecture disque pour le test
 * (tests/credits.test.mjs) : aucune de ces trois entrees n'implique un acces au systeme de fichiers.
 */
export function evaluerCreditsAffiches({ creditsMd, distHasCreditsPage, indexHtml }) {
  const requiert = /attribution obligatoire/i.test(creditsMd || '');
  if (!requiert) return []; // pas de CREDITS.md, ou aucune licence de ce site n'exige d'attribution
  if (!distHasCreditsPage) {
    return [{
      pass: false,
      label: "CREDITS.md exige une attribution obligatoire mais dist/credits.html (ou credits/index.html) est absent : page /credits manquante au build",
    }];
  }
  const checks = [{ pass: true, label: 'Page /credits presente (CREDITS.md exige une attribution obligatoire)' }];
  checks.push(/href=["']\/credits["']/i.test(indexHtml || '')
    ? { pass: true, label: '/credits linkee depuis index.html' }
    : { pass: false, label: "CREDITS.md exige une attribution obligatoire mais aucun lien vers /credits dans index.html" });
  return checks;
}

/** Wrapper disque de evaluerCreditsAffiches() : lit sites/<slug>/CREDITS.md et dist/<slug>/{credits.html|credits/index.html, index.html}. */
function checkCreditsAffiches(slug, distDir, checks) {
  const creditsPath = path.join(SITES_DIR, slug, 'CREDITS.md');
  const creditsMd = fs.existsSync(creditsPath) ? fs.readFileSync(creditsPath, 'utf8') : '';
  const distHasCreditsPage = fs.existsSync(path.join(distDir, 'credits.html')) || fs.existsSync(path.join(distDir, 'credits', 'index.html'));
  const indexPath = path.join(distDir, 'index.html');
  const indexHtml = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf8') : '';
  checks.push(...evaluerCreditsAffiches({ creditsMd, distHasCreditsPage, indexHtml }));
}

/**
 * Données de test et mentions légales vides (scripts/ff/garde-donnees.mjs, même garde que `ff deploy`
 * et `ff vercel`) : téléphone 06 00 00 00 00 sous toutes ses formes (tel:/wa.me compris), code postal
 * 75000, mentions légales sans SIRET/RCS/RM ni avis « en cours de création ». Bloquant, sauf site de
 * démonstration (slug `_…`/`demo-…` ou en-tête DEMO de site.config.ts) : avertissements.
 * Remplace l'ancien simple avertissement « pas de SIRET ».
 */
function checkDonneesTest(slug, distDir, checks, warnings) {
  const r = garderDonneesTest({ slug, distDir, sitesDir: SITES_DIR });
  checks.push(...r.checks);
  warnings.push(...r.warnings);
}

/** <html lang="fr"> attendu sur chaque page (site francophone). */
function checkHtmlLangFr(files, distDir, checks) {
  checkPresence(files, distDir, /<html[^>]*\blang=["']fr["']/i, '<html lang="fr">', checks);
}

/** Non-bloquant : font-display: swap attendu quelque part dans le CSS livre (evite le texte invisible au chargement). */
function warnFontDisplaySwap(distDir, warnings) {
  const cssFiles = listFilesWithExt(distDir, '.css');
  const htmlFiles = listHtmlFiles(distDir);
  const re = /font-display\s*:\s*swap/i;
  const found = cssFiles.some((f) => re.test(fs.readFileSync(f, 'utf8'))) || htmlFiles.some((f) => re.test(fs.readFileSync(f, 'utf8')));
  if (!found) warnings.push('font-display: swap absent du CSS livre');
}

/**
 * Typographie française (`ff typo`) et signes « fait par une IA » (`ff ia`) dans la définition de fait
 * (13 oct 2026) : les deux existaient mais restaient des commandes à part, et 151 fautes dures
 * s'étaient accumulées sur les sites sans que `ff verifier` le dise. Les règles dures de la typo et
 * les échecs d'`ff ia` bloquent ; le reste est signalé. La page /credits est exclue de la typo : elle
 * recopie les titres d'œuvres tels que leurs auteurs les ont écrits (souvent en anglais).
 */
function checkTypographieEtIa(slug, files, distDir, checks, warnings) {
  const durs = new Map();
  for (const f of files) {
    const page = path.relative(distDir, f).split(path.sep).join('/');
    if (page === 'credits.html') continue;
    for (const inf of analyserTypo(fs.readFileSync(f, 'utf8'))) {
      if (!inf.dur) continue;
      const d = durs.get(inf.id) || { libelle: inf.libelle, extrait: inf.extrait, n: 0 };
      d.n += inf.n;
      durs.set(inf.id, d);
    }
  }
  if (durs.size === 0) checks.push({ pass: true, label: 'Typographie française conforme (ff typo)' });
  else for (const d of durs.values()) checks.push({ pass: false, label: `Typo : ${d.libelle} (${d.n}), ex. « ${d.extrait} » — ff typo ${slug} --corriger` });
  const ia = analyserIa(slug);
  if (!ia.echecs.length) checks.push({ pass: true, label: 'Aucun signe « fait par une IA » bloquant (ff ia)' });
  for (const e of ia.echecs) checks.push({ pass: false, label: `Signe IA : ${e.regle} (${e.n})${e.exemples ? ', ex. ' + e.exemples[0] : ''}` });
  for (const a of ia.alertes) warnings.push(`Signe IA à surveiller : ${a.regle} (${a.n})`);
}

/** sitemap-index.xml genere par @astrojs/sitemap. */
function checkSitemapIndex(distDir, checks) {
  const p = path.join(distDir, 'sitemap-index.xml');
  checks.push(fs.existsSync(p)
    ? { pass: true, label: 'sitemap-index.xml present' }
    : { pass: false, label: 'sitemap-index.xml absent de dist/' });
}

/** Non-bloquant : og:image absent alors qu'une image OG est configuree (public/og.webp ou images.og). */
/** Chaque URL /images/... ou /anim/... referencee (src, srcset, preload) doit exister dans dist : sinon 404 silencieux. */
function checkImagesReferencees(files, distDir, checks) {
  const missing = new Set();
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    for (const m of html.matchAll(/\/(?:images|anim|videos)\/[^\s"',)]+/g)) {
      const url = m[0].split('?')[0];
      if (!fs.existsSync(path.join(distDir, url))) missing.add(url);
    }
  }
  if (missing.size > 0) checks.push({ pass: false, label: `Fichiers references introuvables (404) : ${[...missing].slice(0, 5).join(', ')}${missing.size > 5 ? ` (+${missing.size - 5})` : ''}` });
  else checks.push({ pass: true, label: 'Toutes les images/videos referencees existent' });
}

function warnBlocSurMesure(slug, warnings) {
  // Regle du processus : chaque site livre contient au moins une section ecrite pour lui seul.
  if (slug.startsWith('_') || slug.startsWith('demo-')) return;
  const dir = path.join(SITES_DIR, slug, 'sections');
  const has = fs.existsSync(dir) && fs.readdirSync(dir).some((f) => f.endsWith('.astro'));
  if (!has) warnings.push(`Aucun bloc sur mesure (sites/${slug}/sections/*.astro) : chaque site livre doit en avoir un, voir /nouveau-site etape 7`);
}

function warnOgImageManquant(slug, files, distDir, warnings) {
  const ogWebp = path.join(SITES_DIR, slug, 'public', 'og.webp');
  const configPath = path.join(SITES_DIR, slug, 'site.config.ts');
  let hasImagesOg = false;
  if (fs.existsSync(configPath)) {
    const cfg = fs.readFileSync(configPath, 'utf8');
    hasImagesOg = /\bog\s*:\s*['"][^'"]+['"]/.test(cfg);
  }
  if (!fs.existsSync(ogWebp) && !hasImagesOg) return; // rien de configure : rien a verifier
  const offenders = [];
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    if (!/property=["']og:image["']/i.test(html)) offenders.push(path.relative(distDir, file));
  }
  if (offenders.length > 0) {
    warnings.push(`og:image configure (public/og.webp ou images.og) mais absent du <head> dans : ${offenders.join(', ')}`);
  }
}

/* =====================================================================
   RENDU — checks issus de docs/veille/rendu.md §7 (checklist 40 points).
   Bloc ajoute le 16 septembre 2026, separe des checks SEO/contenu ci-dessus.
   Trois points de la checklist etaient deja couverts avant ce bloc par des
   checks plus anciens (pas dupliques ici, juste rappeles) :
     - #1 <img> sans width/height ni loading -> warnImagesSansDimension (deja au-dessus)
     - #38 lien <a href="#"> vide -> checkNoEmptyAnchor (deja au-dessus)
     - #10 font-display: swap absent -> warnFontDisplaySwap (deja au-dessus)
   ===================================================================== */

/** Rendu : une grille <ul>/<ol> d'au moins 3 <img> ne doit pas melanger les ratios (un seul
 * aspect-ratio par grille, docs/veille/rendu.md §4.1/§7 point 18). Heuristique : ratio intrinseque
 * width/height (pose par <Img>, voir src/components/Img.astro), pas le ratio rendu par object-fit —
 * tolerance large (>15%) pour ne pas signaler de faux positifs sur un simple arrondi de sharp. */
export function checkGrilleImagesRatioCoherente(files, distDir, checks) {
  const listRe = /<(ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  const imgRe = /<img\b[^>]*>/gi;
  const widthRe = /\bwidth\s*=\s*["']?(\d+)["']?/i;
  const heightRe = /\bheight\s*=\s*["']?(\d+)["']?/i;
  const offenders = [];
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    listRe.lastIndex = 0; // regex /g partagée : sans remise à zéro, le fichier suivant était lu en décalé
    let m;
    while ((m = listRe.exec(html))) {
      // Une image recadrée par object-fit (cover/contain) s'affiche au ratio de son cadre, pas au sien :
      // seule une image affichée à son ratio propre peut casser l'alignement d'une grille.
      const imgs = (m[2].match(imgRe) || []).filter((tag) => !/\bobject-(?:cover|contain)\b/.test(tag));
      if (imgs.length < 3) continue;
      const ratios = [];
      for (const tag of imgs) {
        const w = widthRe.exec(tag)?.[1];
        const h = heightRe.exec(tag)?.[1];
        if (w && h && Number(h) > 0) ratios.push(Number(w) / Number(h));
      }
      if (ratios.length < 3) continue; // pas assez d'images avec width/height connus pour juger
      const min = Math.min(...ratios);
      const max = Math.max(...ratios);
      if ((max - min) / min > 0.15) {
        offenders.push(path.relative(distDir, file));
        break;
      }
    }
  }
  if (offenders.length > 0) {
    checks.push({ pass: false, label: `Grille d'images (<ul>/<ol> avec >= 3 <img>) avec des ratios incoherents dans : ${offenders.join(', ')}` });
  } else {
    checks.push({ pass: true, label: "Grilles d'images : ratio coherent (ou pas de grille de 3+ <img> a comparer)" });
  }
}

/** Rendu : un bloc de texte long (<p> de plus de 400 caracteres) devrait etre contraint en largeur
 * (classe `measure` ou `max-w-prose`, docs/veille/rendu.md §1.4/§2.1 point 3) pour rester lisible
 * (45-75 caracteres par ligne). Non bloquant : le gabarit peut deja limiter la largeur via un parent. */
function warnBlocTexteSansMesure(files, distDir, warnings) {
  const pRe = /<p\b([^>]*)>([\s\S]*?)<\/p>/gi;
  const offenders = new Set();
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = pRe.exec(html))) {
      const [, attrs, inner] = m;
      const text = inner.replace(/<[^>]+>/g, '').trim();
      if (text.length <= 400) continue;
      const hasMeasure = /\bclass\s*=\s*["'][^"']*\b(measure|max-w-prose)\b/i.test(attrs);
      if (!hasMeasure) offenders.add(path.relative(distDir, file));
    }
  }
  if (offenders.size > 0) {
    warnings.push(`<p> de plus de 400 caracteres sans classe "measure"/"max-w-prose" (largeur de lecture non contrainte) dans : ${[...offenders].join(', ')}`);
  }
}

/** Rendu : au moins 2 familles de police distinctes attendues (display + corps) dans le CSS livre,
 * sinon la direction n'a probablement pas charge de police display (docs/veille/rendu.md §7 point 9). */
/** CSS livre : fichiers .css ET blocs <style> des pages (inlineStylesheets: 'always' met tout en ligne,
 * et les controles qui ne lisaient que les .css voyaient « 0 police » / « pas de soulignement » a tort). */
function cssLivre(distDir) {
  const morceaux = listFilesWithExt(distDir, '.css').map((f) => fs.readFileSync(f, 'utf8'));
  for (const f of listHtmlFiles(distDir)) {
    for (const m of fs.readFileSync(f, 'utf8').matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) morceaux.push(m[1]);
  }
  return morceaux;
}

function warnMoinsDeDeuxPolices(distDir, warnings) {
  const cssFiles = cssLivre(distDir);
  const families = new Set();
  const declRe = /(?:--font-(?:display|body|mono)|(?<!-)font-family)\s*:\s*([^;]+);/gi;
  for (const css of cssFiles) {
    let m;
    while ((m = declRe.exec(css))) {
      const first = m[1].split(',')[0].trim().replace(/^['"]|['"]$/g, '');
      if (first && !/^var\(/i.test(first)) families.add(first.toLowerCase());
    }
  }
  if (families.size < 2) {
    warnings.push(`Moins de 2 familles de police distinctes trouvees dans le CSS livre (${families.size}) : direction probablement sans police display chargee`);
  }
}

/** Rendu : `text-underline-offset` attendu quelque part dans le CSS livre (docs/veille/rendu.md §5.7 /
 * §7 point 32) — sinon les liens gardent le soulignement brut du navigateur, colle au texte. */
function warnUnderlineOffsetAbsent(distDir, warnings) {
  const found = cssLivre(distDir).some((css) => /text-underline-offset/i.test(css));
  if (!found) warnings.push('text-underline-offset absent du CSS livre (soulignement de lien brut, colle au texte)');
}

/* =====================================================================
   TEXTES — redaction (docs/REDACTION.md, docs/veille/redaction-images.md §1.4/§3.1).
   Bloc ajoute le 17 septembre 2026 : scanne le texte visible de chaque page (memes strips
   que checkOffenders : <style>/<script>/balises retires) pour les superlatifs et promesses
   interdites, le tutoiement, et les seuils de longueur hero/paragraphe.
   ===================================================================== */

function texteVisible(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ');
}

// Echec : mots/formules interdits par docs/REDACTION.md §1 (superlatifs sans preuve, garanties de
// resultat) — case-insensitive, accents geres par une classe de caracteres [ée] plutot qu'un
// stripDiacritics global (le texte visible doit rester lisible dans le message d'erreur).
const TEXTES_INTERDITS = [
  { label: '"meilleur"', re: /\bmeilleur(?:e|s|es)?\b/i },
  { label: '"leader"', re: /\bleaders?\b/i },
  { label: '"n°1"/"numéro 1"', re: /n°\s?1\b|num[ée]ro\s?1\b/i },
  { label: '"garantie de résultat"', re: /garantie\s+de\s+r[ée]sultat/i },
  { label: '"satisfaction garantie"', re: /satisfaction\s+garantie/i },
  { label: '"100 % satisfait"', re: /100\s?%\s*satisfaite?s?/i },
];

// Avertissement : mots a surveiller par docs/REDACTION.md §1, pas necessairement fautifs (ex. "unique"
// peut etre legitime dans "pièce unique"), d'ou un simple warn plutot qu'un fail.
const TEXTES_A_SURVEILLER = [
  { label: '"unique"', re: /\buniques?\b/i },
  { label: '"révolutionnaire"', re: /r[ée]volutionnaires?/i },
  { label: '"le plus"', re: /\ble plus\b/i },
];

function checkMotsInterditsTextes(files, distDir, checks) {
  for (const item of TEXTES_INTERDITS) {
    const offenders = [];
    for (const file of files) {
      const texte = texteVisible(fs.readFileSync(file, 'utf8'));
      if (item.re.test(texte)) offenders.push(path.relative(distDir, file));
    }
    if (offenders.length > 0) {
      checks.push({ pass: false, label: `Mot/formule interdit ${item.label} (docs/REDACTION.md §1) trouve dans : ${offenders.join(', ')}` });
    } else {
      checks.push({ pass: true, label: `Pas de ${item.label}` });
    }
  }
}

function warnMotsASurveillerTextes(files, distDir, warnings) {
  for (const item of TEXTES_A_SURVEILLER) {
    const offenders = [];
    for (const file of files) {
      const texte = texteVisible(fs.readFileSync(file, 'utf8'));
      if (item.re.test(texte)) offenders.push(path.relative(distDir, file));
    }
    if (offenders.length > 0) {
      warnings.push(`Mot a surveiller ${item.label} (docs/REDACTION.md §1) trouve dans : ${offenders.join(', ')}`);
    }
  }
}

/** Tutoiement possible ("tu"/"ton"/"tes") alors que le vouvoiement est la regle (docs/REDACTION.md §2). */
function warnTutoiementTextes(files, distDir, warnings) {
  const re = /\b(?:tu|ton|tes)\b/i;
  const offenders = [];
  for (const file of files) {
    const texte = texteVisible(fs.readFileSync(file, 'utf8'));
    if (re.test(texte)) offenders.push(path.relative(distDir, file));
  }
  if (offenders.length > 0) {
    warnings.push(`Tutoiement possible ("tu"/"ton"/"tes", vouvoiement attendu, docs/REDACTION.md §2) dans : ${offenders.join(', ')}`);
  }
}

/** <h1> de plus de 14 mots (docs/REDACTION.md §5, test du titre de hero). */
function warnHeroTropLongTextes(files, distDir, warnings) {
  const h1Re = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i;
  const offenders = [];
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const m = h1Re.exec(html);
    if (!m) continue;
    const texte = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const mots = texte.split(' ').filter(Boolean);
    if (mots.length > 14) offenders.push(`${path.relative(distDir, file)} (${mots.length} mots)`);
  }
  if (offenders.length > 0) {
    warnings.push(`<h1> de plus de 14 mots (docs/REDACTION.md §5) : ${offenders.join(', ')}`);
  }
}

/** <p> de plus de 120 mots (docs/REDACTION.md §6, longueurs cibles). */
function warnParagrapheTropLongTextes(files, distDir, warnings) {
  const pRe = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  const offenders = new Set();
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = pRe.exec(html))) {
      const texte = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const mots = texte.split(' ').filter(Boolean);
      if (mots.length > 120) offenders.add(path.relative(distDir, file));
    }
  }
  if (offenders.size > 0) {
    warnings.push(`<p> de plus de 120 mots (docs/REDACTION.md §6) dans : ${[...offenders].join(', ')}`);
  }
}

/** Eyebrow (classe "eyebrow", src/styles/global.css @utility eyebrow) de plus de 40 caracteres :
 * meme seuil que la regle "all-caps-body" de l'audit impeccable (docs/veille, correction du
 * 18 septembre 2026) — un eyebrow long en petites capitales espacees devient illisible. Non
 * bloquant : certains eyebrows composent dynamiquement trade/ville/annee, un depassement ponctuel
 * ne doit pas casser le build, juste etre signale pour raccourcir a la source (site.config.ts ou
 * la section qui le compose). */
export function warnEyebrowTropLong(files, distDir, warnings) {
  const eyebrowRe = /<(p|span|div)\b[^>]*\bclass\s*=\s*["'][^"']*\beyebrow\b[^"']*["'][^>]*>([\s\S]*?)<\/\1>/gi;
  const offenders = [];
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = eyebrowRe.exec(html))) {
      const texte = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (texte.length > 40) offenders.push(`${path.relative(distDir, file)} (${texte.length} car. : "${texte}")`);
    }
  }
  if (offenders.length > 0) {
    warnings.push(`Eyebrow de plus de 40 caracteres (illisible en petites capitales) : ${offenders.join(' ; ')}`);
  }
}

/** Texte en majuscules (classe Tailwind "uppercase" explicite, hors "eyebrow" deja verifie
 * ci-dessus) de plus de 40 caracteres : heuristique statique sur le HTML livre, ne voit pas
 * l'uppercase herite de --heading-transform (direction) ni les bandes data-marquee (courts
 * libelles concatenes par le moteur, faux positif connu de l'audit impeccable, docs/veille) —
 * seulement la classe "uppercase" posee explicitement dans le markup. Non bloquant. */
export function warnMajusculesHorsEyebrow(files, distDir, warnings) {
  const upperRe = /<(p|span|div|li|dt|dd|h1|h2|h3|h4)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  const offenders = [];
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = upperRe.exec(html))) {
      const openTagAttrs = m[2];
      const classMatch = /\bclass\s*=\s*["']([^"']*)["']/.exec(openTagAttrs);
      const cls = classMatch ? classMatch[1] : '';
      if (!/\buppercase\b/.test(cls) || /\beyebrow\b/.test(cls)) continue;
      if (/\bmarquee-track\b/.test(cls) || /\bdata-marquee\b/.test(openTagAttrs)) continue; // ticker : faux positif connu
      const texte = m[3].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (texte.length > 40) offenders.push(`${path.relative(distDir, file)} (${texte.length} car. : "${texte.slice(0, 60)}")`);
    }
  }
  if (offenders.length > 0) {
    warnings.push(`Texte en majuscules (classe "uppercase") de plus de 40 caracteres hors eyebrow : ${offenders.join(' ; ')}`);
  }
}

/* ---------------------------------------------------------------------
   RYTHME — tells « ecrit par une machine » (docs/REDACTION.md §14).
   Six avertissements, jamais un echec : ce sont des indices de style, pas des fautes. Un site
   peut legitimement declencher l'un d'eux (une page de tarifs n'a pas de phrase parlee, un
   glossaire aligne des phrases de meme longueur) — c'est au relecteur de trancher. Tous
   travaillent sur le contenu de <main> (nav, pied de page et mentions legales exclus : leurs
   libelles courts et leurs numeros de telephone faussent chaque mesure).
   --------------------------------------------------------------------- */

const MOT_FR = "[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ'’-]*";

/** Contenu visible de <main> (a defaut : page entiere), espaces normalises. */
function texteMain(html) {
  const m = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html);
  return texteVisible(m ? m[1] : html).replace(/\s+/g, ' ').trim();
}

/** Phrases du texte visible de <main>, hors fragments de moins de 3 mots (libelles, puces). */
function phrasesMain(html) {
  return texteMain(html)
    .split(/(?<=[.!?…])\s+/)
    .map((p) => p.trim())
    .filter((p) => p.split(/\s+/).filter(Boolean).length >= 3);
}

function nbMots(phrase) {
  return phrase.split(/\s+/).filter(Boolean).length;
}

/** Paragraphes de prose de <main> : contenu texte des <p> d'au moins 12 mots. */
function paragraphesMain(html) {
  const m = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html);
  const zone = m ? m[1] : html;
  const out = [];
  for (const p of zone.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    const texte = p[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (nbMots(texte) >= 12) out.push(texte);
  }
  return out;
}

/** Trois phrases consecutives de longueur proche dans un meme paragraphe, ou page entiere dont
 * toutes les phrases font la meme longueur (docs/REDACTION.md §14 R1). */
export function warnRythmeUniforme(files, distDir, warnings) {
  const binaires = [];
  const plates = [];
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const rel = path.relative(distDir, file);

    for (const para of paragraphesMain(html)) {
      const longueurs = para
        .split(/(?<=[.!?…])\s+/)
        .map((s) => nbMots(s.trim()))
        .filter((n) => n >= 3);
      for (let i = 0; i + 2 < longueurs.length; i += 1) {
        const trio = longueurs.slice(i, i + 3);
        if (Math.min(...trio) >= 9 && Math.max(...trio) - Math.min(...trio) <= 2) {
          binaires.push(`${rel} (${trio.join('/')} mots : "${para.slice(0, 70)}…")`);
          break;
        }
      }
    }

    const longueurs = phrasesMain(html).map(nbMots).filter((n) => n >= 6);
    if (longueurs.length >= 8) {
      const moy = longueurs.reduce((a, b) => a + b, 0) / longueurs.length;
      const sd = Math.sqrt(longueurs.reduce((a, b) => a + (b - moy) ** 2, 0) / longueurs.length);
      if (moy > 0 && sd / moy < 0.28) {
        plates.push(`${rel} (${longueurs.length} phrases, moyenne ${moy.toFixed(1)} mots, ecart-type ${sd.toFixed(1)})`);
      }
    }
  }
  if (binaires.length > 0) {
    warnings.push(`Rythme binaire : trois phrases consecutives de longueur proche (docs/REDACTION.md §14 R1) dans ${binaires.join(' ; ')}`);
  }
  if (plates.length > 0) {
    warnings.push(`Rythme plat : toutes les phrases de la page font a peu pres la meme longueur (docs/REDACTION.md §14 R1) dans ${plates.join(' ; ')}`);
  }
}

/** Densite de tirets cadratins (docs/REDACTION.md §6bis et §14 R2) : au-dela d'un tiret long pour
 * 500 caracteres visibles, c'est la signature la plus reconnaissable du texte genere. */
export function warnTiretsCadratins(files, distDir, warnings) {
  const offenders = [];
  for (const file of files) {
    const texte = texteMain(fs.readFileSync(file, 'utf8'));
    const tirets = (texte.match(/[—–]/g) || []).length;
    if (tirets >= 2 && texte.length / tirets < 500) {
      offenders.push(`${path.relative(distDir, file)} (${tirets} tirets pour ${texte.length} car.)`);
    }
  }
  if (offenders.length > 0) {
    warnings.push(`Tirets cadratins en rafale (1 pour moins de 500 car., docs/REDACTION.md §14 R2) dans : ${offenders.join(', ')}`);
  }
}

/** Mots-valises et formules creuses (docs/REDACTION.md §14 R3) : pas interdits en soi — un client
 * peut employer « savoir-faire » lui-meme — mais chacun doit etre remplace par le fait concret du
 * brief quand il ne sert qu'a meubler. */
const MOTS_VALISES = [
  { label: '"savoir-faire"', re: /savoir[- ]faire/i },
  { label: '"passion"/"passionné"', re: /passionn[ée]|\bpassion\b/i },
  { label: '"au cœur de"', re: /au c(?:œ|oe)ur d(?:e|u|es)\b/i },
  { label: '"point d\'honneur"', re: /point d[’']honneur/i },
  { label: '"depuis toujours"', re: /depuis toujours/i },
  { label: '"expertise"', re: /\bexpertises?\b/i },
  { label: '"à votre écoute"', re: /[àa] votre [ée]coute/i },
  { label: '"dans les règles de l\'art"', re: /r[èe]gles de l[’']art/i },
  { label: '"clé en main"', re: /cl[ée] en main/i },
  { label: '"haut de gamme"', re: /haut de gamme/i },
  { label: '"notre ADN"', re: /notre ADN\b/i },
  { label: '"univers"', re: /\bunivers\b/i },
  // 14 oct 2026 : « sur mesure » sur un site sur deux, il ne dit rien du métier (rayé du site du studio).
  { label: '"sur mesure"', re: /sur[- ]mesure/i },
];

export function warnMotsValises(files, distDir, warnings) {
  for (const item of MOTS_VALISES) {
    const offenders = [];
    for (const file of files) {
      if (item.re.test(texteMain(fs.readFileSync(file, 'utf8')))) offenders.push(path.relative(distDir, file));
    }
    if (offenders.length > 0) {
      warnings.push(`Mot-valise ${item.label} (docs/REDACTION.md §14 R3) dans : ${offenders.join(', ')}`);
    }
  }
}

/** Enumerations ternaires « A, B et C » en serie (docs/REDACTION.md §14 R4) : le triplet est le
 * patron de phrase le plus reconnaissable d'un texte genere. Seuil a 4 par page. */
export function warnEnumerationsTernaires(files, distDir, warnings) {
  const re = new RegExp(`${MOT_FR}, ${MOT_FR}(?:, ${MOT_FR})* (?:et|ou) ${MOT_FR}`, 'g');
  const offenders = [];
  for (const file of files) {
    const trouves = texteMain(fs.readFileSync(file, 'utf8')).match(re) || [];
    if (trouves.length >= 4) {
      offenders.push(`${path.relative(distDir, file)} (${trouves.length} : "${trouves.slice(0, 2).join('", "')}"…)`);
    }
  }
  if (offenders.length > 0) {
    warnings.push(`Enumerations ternaires en serie (docs/REDACTION.md §14 R4) dans : ${offenders.join(' ; ')}`);
  }
}

/** Aucune phrase parlee sur l'accueil (docs/REDACTION.md §14 R5) : un Francais qui ecrit lui-meme
 * commence tot ou tard une phrase par « Et », « Mais » ou « Alors ». Zero sur toute une page
 * d'accueil est un indice de texte lisse par une machine. */
export function warnAucunePhraseParlee(files, distDir, warnings) {
  const accueil = files.find((f) => path.basename(f) === 'index.html' && path.dirname(f) === distDir);
  if (!accueil) return;
  const phrases = phrasesMain(fs.readFileSync(accueil, 'utf8'));
  if (phrases.length < 10) return;
  const parlees = phrases.filter((p) => /^(Et|Mais|Alors|Bref|Pourtant|D[’']ailleurs|Sauf)\b/.test(p));
  if (parlees.length === 0) {
    warnings.push(`Aucune phrase de l'accueil ne commence par « Et »/« Mais »/« Alors » sur ${phrases.length} phrases (docs/REDACTION.md §14 R5) : texte sans oral`);
  }
}

/** Page de service sans aucun chiffre (docs/REDACTION.md §14 R6) : prix, delai, dimension, norme,
 * annee — un artisan qui decrit son travail donne au moins un nombre. Le pied de page et ses
 * numeros de telephone sont exclus (mesure faite dans <main>). */
export function warnPageServiceSansChiffre(files, distDir, warnings) {
  const offenders = [];
  for (const file of files) {
    const rel = path.relative(distDir, file).replace(/\\/g, '/');
    if (!rel.startsWith('services/')) continue;
    if (!/\d/.test(texteMain(fs.readFileSync(file, 'utf8')))) offenders.push(rel);
  }
  if (offenders.length > 0) {
    warnings.push(`Page de service sans aucun chiffre (prix, delai, norme, dimension — docs/REDACTION.md §14 R6) : ${offenders.join(', ')}`);
  }
}

/** Reponses de FAQ qui commencent toutes pareil (docs/REDACTION.md §14 R7) : trois « Oui, … » ou
 * plus sur une meme page trahissent un gabarit de reponse, pas quelqu'un qui repond. */
export function warnFaqReponsesUniformes(files, distDir, warnings) {
  const offenders = [];
  for (const file of files) {
    const oui = phrasesMain(fs.readFileSync(file, 'utf8')).filter((p) => /^Oui[,.]/.test(p)).length;
    if (oui >= 3) offenders.push(`${path.relative(distDir, file)} (${oui})`);
  }
  if (offenders.length > 0) {
    warnings.push(`Reponses de FAQ commencant toutes par « Oui, » (docs/REDACTION.md §14 R7) dans : ${offenders.join(', ')}`);
  }
}

/* =====================================================================
   VISIBILITE IA — moteurs de reponse (ChatGPT via Bing, Perplexity, AI Overviews).
   Verifie que le site buildé reste lisible et citable par les robots de recherche IA :
   robots.txt explicite + sitemap absolu, llms.txt, JSON-LD FAQPage/Service quand le contenu
   correspondant est affiché. Les sources : src/pages/robots.txt.ts, src/pages/llms.txt.ts,
   src/lib/jsonld.ts — ces checks sont le filet de sécurité si l'un régresse.
   ===================================================================== */

/** robots.txt présent, bots de recherche IA explicitement autorisés (bloquant). Sitemap absolu
 * exigé seulement si un domaine est connu (local sans domain.txt : ligne omise par construction). */
function checkRobotsTxtIA(slug, distDir, checks, warnings) {
  const p = path.join(distDir, 'robots.txt');
  if (!fs.existsSync(p)) {
    checks.push({ pass: false, label: 'robots.txt absent de dist/' });
    return;
  }
  const txt = fs.readFileSync(p, 'utf8');
  checks.push(/User-agent:\s*OAI-SearchBot/i.test(txt)
    ? { pass: true, label: 'robots.txt : bots de recherche IA explicitement autorisés (OAI-SearchBot, PerplexityBot...)' }
    : { pass: false, label: 'robots.txt sans autorisation explicite des bots de recherche IA' });
  const aUnDomaine = fs.existsSync(path.join(SITES_DIR, slug, 'domain.txt'));
  if (aUnDomaine && !/^Sitemap:\s*https?:\/\//m.test(txt)) {
    warnings.push('robots.txt : Sitemap absent ou relatif alors que le site a un domaine (URL absolue exigée par la spec)');
  }
}

/** llms.txt présent (synthèse Markdown pour LLM, src/pages/llms.txt.ts). */
function checkLlmsTxt(distDir, checks) {
  checks.push(fs.existsSync(path.join(distDir, 'llms.txt'))
    ? { pass: true, label: 'llms.txt présent (synthèse Markdown du site pour les LLM)' }
    : { pass: false, label: 'llms.txt absent de dist/ (endpoint src/pages/llms.txt.ts cassé ?)' });
}

/** FAQPage JSON-LD attendu sur l'accueil si une section FAQ y est affichée (id="faq" visible). */
function checkFaqJsonLd(distDir, checks) {
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) return;
  const html = fs.readFileSync(indexPath, 'utf8');
  const sectionFaqVisible = /\bid=["']faq["']/i.test(html);
  const aFaqPageLd = /"@type"\s*:\s*"FAQPage"/.test(html);
  if (sectionFaqVisible && !aFaqPageLd) {
    checks.push({ pass: false, label: 'Section FAQ affichée sur index.html mais JSON-LD FAQPage absent (les moteurs IA ne verront pas les Q/R structurées)' });
  } else {
    checks.push({ pass: true, label: aFaqPageLd ? 'JSON-LD FAQPage présent sur index.html' : 'Pas de section FAQ affichée : JSON-LD FAQPage non requis' });
  }
}

/** JSON-LD Service attendu sur chaque page /services/* (contenu Service affiché). */
function checkServiceJsonLd(files, distDir, checks) {
  const servicePages = files.filter((f) => /[\\/]services[\\/][^\\/]+\.html$/i.test(f));
  if (servicePages.length === 0) {
    checks.push({ pass: true, label: 'Pas de page service : JSON-LD Service non requis' });
    return;
  }
  const offenders = [];
  for (const file of servicePages) {
    const html = fs.readFileSync(file, 'utf8');
    if (!/"@type"\s*:\s*"Service"/.test(html)) offenders.push(path.relative(distDir, file));
  }
  if (offenders.length > 0) checks.push({ pass: false, label: `JSON-LD Service absent des pages service : ${offenders.join(', ')}` });
  else checks.push({ pass: true, label: `JSON-LD Service présent sur les ${servicePages.length} page(s) service` });
}

/** Non-bloquant : clé IndexNow absente du build alors que le site a un domaine (créée par ff deploy). */
function warnIndexNowKeyAbsente(slug, distDir, warnings) {
  const aUnDomaine = fs.existsSync(path.join(SITES_DIR, slug, 'domain.txt'));
  if (!aUnDomaine) return;
  const aUneCle = fs.readdirSync(distDir).some((f) => /^indexnow-[0-9a-f]{32}\.txt$/.test(f));
  if (!aUneCle) warnings.push(`Clé IndexNow absente de dist/ : lance \`ff deploy ${slug}\` (crée la clé et soumet à Bing) ou \`ff indexnow ${slug}\` après mise en ligne`);
}

export async function cmdVerifier(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  info(`Verification de ${c.bold(slug)}`);
  info('');

  // `--sans-build` : controle le dist/ deja construit (relance rapide apres une correction de texte
  // faite sans toucher au code). Sinon build silencieux : la sortie de Vite ne s'affiche qu'en cas d'echec.
  const dejaConstruit = fs.existsSync(path.join(DIST_DIR, slug, 'index.html'));
  const buildStatus = flags['sans-build'] && dejaConstruit ? 0 : runAstro('build', slug, [], {}, { silencieux: !flags.bavard });
  const checks = [];
  if (buildStatus !== 0) {
    checks.push({ pass: false, label: 'Build (voir la sortie ci-dessus pour le detail)' });
    printReport(checks);
    process.exit(1);
  }
  checks.push({ pass: true, label: 'Build reussi' });

  const distDir = path.join(DIST_DIR, slug);
  const files = listHtmlFiles(distDir);
  if (files.length === 0) {
    checks.push({ pass: false, label: `Aucun fichier .html trouve dans dist/${slug}` });
    printReport(checks);
    process.exit(1);
  }

  const activeForbidden = slug === '_exemple' ? FORBIDDEN : [...FORBIDDEN, { label: 'exemple.fr', re: /exemple\.fr/i }];
  // Site de démonstration : téléphone et e-mail fictifs attendus, en avertissement comme dans la garde
  // de `ff deploy` (avant : `ff verifier` échouait sur une démo que `ff deploy` acceptait).
  // Pas les gabarits `_…` (un `_test-*` simule un vrai client : ses données de test doivent bloquer).
  const demo = !slug.startsWith('_') && estSiteDemo(slug, fs.existsSync(path.join(SITES_DIR, slug, 'site.config.ts')) ? fs.readFileSync(path.join(SITES_DIR, slug, 'site.config.ts'), 'utf8') : '');
  const fictifsDemo = new Set(['06 00 00 00 00', 'exemple.fr']);
  const avertDemo = [];
  for (const forbid of [...activeForbidden, ...ALWAYS_FORBIDDEN]) {
    const offenders = [];
    for (const file of files) {
      // Texte visible seulement (comme checkOffenders) : le CSS inline de Tailwind contient
      // `--tw-shadow-alpha:100%` et `text-size-adjust:100%`, qui matchaient "100 %" a tort.
      const html = fs.readFileSync(file, 'utf8')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, ' ');
      if (forbid.re.test(html)) offenders.push(path.relative(distDir, file));
    }
    if (offenders.length > 0 && demo && fictifsDemo.has(forbid.label)) {
      avertDemo.push(`Texte de substitution "${forbid.label}" dans : ${offenders.join(', ')} (site de démonstration : non bloquant)`);
    } else if (offenders.length > 0) {
      checks.push({ pass: false, label: `Texte de substitution "${forbid.label}" trouve dans : ${offenders.join(', ')}` });
    } else {
      checks.push({ pass: true, label: `Pas de "${forbid.label}"` });
    }
  }

  // <img> sans alt
  const imgTagRe = /<img\b[^>]*>/gi;
  const altRe = /\balt(\s*=|\s|\/|>)/i; // alt="..." ou alt vide rendu sans valeur (attribut seul)
  const missingAlt = new Set();
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const tags = html.match(imgTagRe) || [];
    for (const tag of tags) {
      if (!altRe.test(tag)) missingAlt.add(path.relative(distDir, file));
    }
  }
  if (missingAlt.size > 0) checks.push({ pass: false, label: `<img> sans alt dans : ${[...missingAlt].join(', ')}` });
  else checks.push({ pass: true, label: 'alt present sur toutes les images' });

  checkPresence(files, distDir, /<title>[^<]+<\/title>/i, '<title>', checks);
  checkPresence(files, distDir, /<link[^>]*rel=["']canonical["']/i, 'canonical', checks);
  checkPresence(files, distDir, /<script[^>]*type=["']application\/ld\+json["']/i, 'ld+json', checks);
  checkExactlyOneH1(files, distDir, checks);
  checkNoEmptyAnchor(files, distDir, checks);
  checkHoneypot(files, distDir, checks);
  checkNoAggregateRating(files, distDir, checks);
  checkTelPremierEcran(distDir, checks);
  checkPasIframeGoogleAuChargement(files, distDir, checks);
  checkConfidentialite(distDir, checks);
  checkCreditsAffiches(slug, distDir, checks);
  checkHtmlLangFr(files, distDir, checks);
  checkSitemapIndex(distDir, checks);

  const warnings = [...avertDemo];
  // --- Visibilité IA (moteurs de réponse) ---
  checkRobotsTxtIA(slug, distDir, checks, warnings);
  checkLlmsTxt(distDir, checks);
  checkFaqJsonLd(distDir, checks);
  checkServiceJsonLd(files, distDir, checks);
  warnIndexNowKeyAbsente(slug, distDir, warnings);

  // --- Rendu (docs/veille/rendu.md §7) ---
  checkGrilleImagesRatioCoherente(files, distDir, checks);

  // --- Textes (docs/REDACTION.md) ---
  checkMotsInterditsTextes(files, distDir, checks);
  checkTypographieEtIa(slug, files, distDir, checks, warnings);

  warnImagesSansDimension(files, distDir, warnings);
  warnOgImageManquant(slug, files, distDir, warnings);
  warnBlocSurMesure(slug, warnings);
  checkImagesReferencees(files, distDir, checks);
  warnSchemaTypeGenerique(slug, files, distDir, warnings);
  warnFormulaireTropLong(files, distDir, warnings);
  checkDonneesTest(slug, distDir, checks, warnings);
  warnFontDisplaySwap(distDir, warnings);
  // --- Rendu (docs/veille/rendu.md §7), suite : warnings ---
  warnBlocTexteSansMesure(files, distDir, warnings);
  warnMoinsDeDeuxPolices(distDir, warnings);
  warnUnderlineOffsetAbsent(distDir, warnings);
  // --- Textes (docs/REDACTION.md), suite : warnings ---
  warnMotsASurveillerTextes(files, distDir, warnings);
  warnTutoiementTextes(files, distDir, warnings);
  warnHeroTropLongTextes(files, distDir, warnings);
  warnParagrapheTropLongTextes(files, distDir, warnings);
  warnEyebrowTropLong(files, distDir, warnings);
  warnMajusculesHorsEyebrow(files, distDir, warnings);
  // --- Textes, rythme (docs/REDACTION.md §14) : tells « ecrit par une machine », jamais bloquants ---
  warnRythmeUniforme(files, distDir, warnings);
  warnTiretsCadratins(files, distDir, warnings);
  warnMotsValises(files, distDir, warnings);
  warnEnumerationsTernaires(files, distDir, warnings);
  warnAucunePhraseParlee(files, distDir, warnings);
  warnPageServiceSansChiffre(files, distDir, warnings);
  warnFaqReponsesUniformes(files, distDir, warnings);

  printReport(checks, warnings);
  const checklistOk = !checks.some((x) => !x.pass);

  let a11yOk = true;
  if (!flags['sans-a11y']) {
    info(c.bold('Accessibilite (axe, WCAG 2.2 AA) :'));
    try {
      a11yOk = await runA11y([slug]);
    } catch (e) {
      // Chrome absent ou injoignable : on le dit, sans masquer la checklist (relancer `ff a11y <slug>`).
      a11yOk = false;
      fail(`Audit d'accessibilite impossible : ${String(e.message || e).split(/\r?\n/)[0]} (--sans-a11y pour le sauter)`);
    }
  }

  let lighthouseOk = true;
  if (flags.lighthouse) {
    info('');
    info(c.bold('Audit Lighthouse (--lighthouse) :'));
    lighthouseOk = await runLighthouse(slug, { seuil: Number(flags.seuil) || 90, mobileOnly: Boolean(flags.mobile) });
  }

  process.exit(checklistOk && a11yOk && lighthouseOk ? 0 : 1);
}

function printReport(checks, warnings = []) {
  info('');
  for (const chk of checks) {
    if (chk.pass) ok(chk.label);
    else fail(chk.label);
  }
  if (warnings.length > 0) {
    info('');
    for (const w of warnings) warn(w);
  }
  info('');
}
