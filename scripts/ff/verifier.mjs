// `ff verifier [slug]` (alias `check`) : build + checklist SEO/contenu sur dist/<slug>/**/*.html.
import fs from 'node:fs';
import path from 'node:path';
import { DIST_DIR, SITES_DIR, resolveSlug, runAstro, ok, fail, warn, info, c } from './util.mjs';

const FORBIDDEN = [
  { label: 'lorem', re: /lorem/i },
  { label: '+500', re: /\+500/ },
  { label: '100 %', re: /100\s?%/ },
  { label: 'Prenom Nom', re: /pr[ée]nom nom/i },
  { label: '06 00 00 00 00', re: /06\s?00\s?00\s?00\s?00/ },
];

// Toujours actifs, quel que soit le slug (contrairement a FORBIDDEN qui varie pour _exemple) :
// artefacts de bug plutot que de contenu de substitution.
const ALWAYS_FORBIDDEN = [
  { label: '"undefined" affiche', re: /\bundefined\b/ },
  { label: '"NaN" affiche', re: /\bNaN\b/ },
  { label: '"[object Object]" affiche', re: /\[object Object\]/ },
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
    const html = fs.readFileSync(file, 'utf8');
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
  const slice = html.slice(start, start + 1500);
  if (/href=["']tel:/i.test(slice)) checks.push({ pass: true, label: 'Lien tel: present dans les 1500 premiers caracteres du corps de index.html' });
  else checks.push({ pass: false, label: 'Aucun lien tel: dans les 1500 premiers caracteres du corps de index.html' });
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

/** Mentions legales : SIRET present, ou a defaut un avertissement (donnee optionnelle au brief). */
function warnMentionsLegalesSansSiret(distDir, warnings) {
  const p = path.join(distDir, 'mentions-legales.html');
  if (!fs.existsSync(p)) return; // deja signale ailleurs si la page manque totalement
  const html = fs.readFileSync(p, 'utf8');
  if (!/SIRET/i.test(html)) warnings.push('mentions-legales.html ne mentionne pas de SIRET (business.siret absent du brief ?)');
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

/** sitemap-index.xml genere par @astrojs/sitemap. */
function checkSitemapIndex(distDir, checks) {
  const p = path.join(distDir, 'sitemap-index.xml');
  checks.push(fs.existsSync(p)
    ? { pass: true, label: 'sitemap-index.xml present' }
    : { pass: false, label: 'sitemap-index.xml absent de dist/' });
}

/** Non-bloquant : og:image absent alors qu'une image OG est configuree (public/og.webp ou images.og). */
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

export function cmdVerifier(args) {
  const slug = resolveSlug(args[0]);
  info(`Verification de ${c.bold(slug)}`);
  info('');

  const buildStatus = runAstro('build', slug);
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
  for (const forbid of [...activeForbidden, ...ALWAYS_FORBIDDEN]) {
    const offenders = [];
    for (const file of files) {
      const html = fs.readFileSync(file, 'utf8');
      if (forbid.re.test(html)) offenders.push(path.relative(distDir, file));
    }
    if (offenders.length > 0) {
      checks.push({ pass: false, label: `Texte de substitution "${forbid.label}" trouve dans : ${offenders.join(', ')}` });
    } else {
      checks.push({ pass: true, label: `Pas de "${forbid.label}"` });
    }
  }

  // <img> sans alt
  const imgTagRe = /<img\b[^>]*>/gi;
  const altRe = /\balt\s*=/i;
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
  checkHtmlLangFr(files, distDir, checks);
  checkSitemapIndex(distDir, checks);

  const warnings = [];
  warnImagesSansDimension(files, distDir, warnings);
  warnOgImageManquant(slug, files, distDir, warnings);
  warnBlocSurMesure(slug, warnings);
  warnSchemaTypeGenerique(slug, files, distDir, warnings);
  warnFormulaireTropLong(files, distDir, warnings);
  warnMentionsLegalesSansSiret(distDir, warnings);
  warnFontDisplaySwap(distDir, warnings);

  printReport(checks, warnings);
  process.exit(checks.some((x) => !x.pass) ? 1 : 0);
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
