// `ff verifier [slug] [--lighthouse]` (alias `check`) : build + checklist SEO/contenu sur
// dist/<slug>/**/*.html. `--lighthouse` ajoute en fin de parcours un audit Lighthouse complet
// (scripts/ff/lighthouse.mjs) — non lance par defaut car lent (plusieurs pages x desktop/mobile).
import fs from 'node:fs';
import path from 'node:path';
import { DIST_DIR, SITES_DIR, resolveSlug, runAstro, ok, fail, warn, info, c, parseArgs } from './util.mjs';
import { runLighthouse } from './lighthouse.mjs';

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
function checkGrilleImagesRatioCoherente(files, distDir, checks) {
  const listRe = /<(ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  const imgRe = /<img\b[^>]*>/gi;
  const widthRe = /\bwidth\s*=\s*["']?(\d+)["']?/i;
  const heightRe = /\bheight\s*=\s*["']?(\d+)["']?/i;
  const offenders = [];
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = listRe.exec(html))) {
      const imgs = m[2].match(imgRe) || [];
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
function warnMoinsDeDeuxPolices(distDir, warnings) {
  const cssFiles = listFilesWithExt(distDir, '.css');
  const families = new Set();
  const declRe = /(?:--font-(?:display|body|mono)|(?<!-)font-family)\s*:\s*([^;]+);/gi;
  for (const file of cssFiles) {
    const css = fs.readFileSync(file, 'utf8');
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
  const cssFiles = listFilesWithExt(distDir, '.css');
  const found = cssFiles.some((f) => /text-underline-offset/i.test(fs.readFileSync(f, 'utf8')));
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
      // Texte visible seulement (comme checkOffenders) : le CSS inline de Tailwind contient
      // `--tw-shadow-alpha:100%` et `text-size-adjust:100%`, qui matchaient "100 %" a tort.
      const html = fs.readFileSync(file, 'utf8')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, ' ');
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

  const warnings = [];
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

  warnImagesSansDimension(files, distDir, warnings);
  warnOgImageManquant(slug, files, distDir, warnings);
  warnBlocSurMesure(slug, warnings);
  checkImagesReferencees(files, distDir, checks);
  warnSchemaTypeGenerique(slug, files, distDir, warnings);
  warnFormulaireTropLong(files, distDir, warnings);
  warnMentionsLegalesSansSiret(distDir, warnings);
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

  printReport(checks, warnings);
  const checklistOk = !checks.some((x) => !x.pass);

  let lighthouseOk = true;
  if (flags.lighthouse) {
    info('');
    info(c.bold('Audit Lighthouse (--lighthouse) :'));
    lighthouseOk = await runLighthouse(slug, { seuil: Number(flags.seuil) || 90, mobileOnly: Boolean(flags.mobile) });
  }

  process.exit(checklistOk && lighthouseOk ? 0 : 1);
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
