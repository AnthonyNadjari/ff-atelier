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
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listHtmlFiles(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) out.push(full);
  }
  return out;
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

/** Non-bloquant : og:image absent alors qu'une image OG est configuree (public/og.webp ou images.og). */
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

  const warnings = [];
  warnImagesSansDimension(files, distDir, warnings);
  warnOgImageManquant(slug, files, distDir, warnings);

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
