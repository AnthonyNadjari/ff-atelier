// `ff perf <slug> [--lighthouse] [--build]` : budget de performance SANS navigateur (rapide, pensable
// en pre-commit) — lit dist/<slug> (le construit d'abord seulement s'il est absent, ou si `--build`),
// somme les octets bruts par categorie (html, css, js-initial, js-lazy, fonts, images-home) et compare
// a perf-budget.json (racine du repo, un seul budget partage par tous les sites). Sort en erreur (1) si
// une categorie depasse son budget, avec le detail des fichiers en cause. `--lighthouse` enchaine
// ensuite un audit Lighthouse complet (score + LCP reel, plus lent) via scripts/ff/lighthouse.mjs.
// Voir docs/veille/performance.md §6.3/§7 action 6.
import fs from 'node:fs';
import path from 'node:path';
import { DIST_DIR, ROOT, resolveSlug, runAstro, ok, fail, warn, info, c, parseArgs } from './util.mjs';
import { runLighthouse } from './lighthouse.mjs';

function readBudget() {
  const p = path.join(ROOT, 'perf-budget.json');
  if (!fs.existsSync(p)) {
    fail(`perf-budget.json introuvable a la racine du repo (${p}).`);
    return null;
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function listFilesRec(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFilesRec(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

/** Resout une URL trouvee dans du HTML/CSS (absolue "/images/x.avif" ou relative "./x.woff2") en
 * chemin de fichier sur disque, depuis `baseDir` pour les URLs relatives. Ignore les data:/http(s):. */
function resolveUrl(urlRaw, distDir, baseDir) {
  const url = urlRaw.trim().replace(/^['"]|['"]$/g, '').split('?')[0].split('#')[0];
  if (!url || url.startsWith('data:') || /^https?:\/\//.test(url)) return null;
  const abs = url.startsWith('/') ? path.join(distDir, decodeURIComponent(url)) : path.join(baseDir, decodeURIComponent(url));
  return abs;
}

function sizeOf(absPath) {
  try {
    const st = fs.statSync(absPath);
    return st.isFile() ? st.size : 0;
  } catch {
    return 0;
  }
}

function extractAttr(tag, name) {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, 'i'));
  return m ? m[1] : null;
}

function srcsetUrls(srcset) {
  return srcset.split(',').map((part) => part.trim().split(/\s+/)[0]).filter(Boolean);
}

/** Scripts <script type="module" src="..."> charges directement par le HTML (chemin critique). */
function scriptTagUrls(html) {
  const out = new Set();
  const re = /<script\b[^>]*\ssrc=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html))) out.add(m[1]);
  return out;
}

/** Feuilles <link rel="stylesheet" href="..."> chargees directement par le HTML. */
function stylesheetTagUrls(html) {
  const out = new Set();
  const re = /<link\b[^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const tag = m[0];
    if (!/\brel\s*=\s*["']stylesheet["']/i.test(tag)) continue;
    const href = extractAttr(tag, 'href');
    if (href) out.add(href);
  }
  return out;
}

/** Images reellement referencees par le HTML : <img src>/<img srcset> + <link as="image"> (preload). */
function imageTagUrls(html) {
  const out = new Set();
  const imgRe = /<img\b[^>]*>/gi;
  let m;
  while ((m = imgRe.exec(html))) {
    const tag = m[0];
    const src = extractAttr(tag, 'src');
    if (src) out.add(src);
    const srcset = extractAttr(tag, 'srcset');
    if (srcset) for (const u of srcsetUrls(srcset)) out.add(u);
  }
  const sourceRe = /<source\b[^>]*>/gi;
  while ((m = sourceRe.exec(html))) {
    const srcset = extractAttr(m[0], 'srcset');
    if (srcset) for (const u of srcsetUrls(srcset)) out.add(u);
  }
  const linkRe = /<link\b[^>]*>/gi;
  while ((m = linkRe.exec(html))) {
    const tag = m[0];
    if (!/\bas\s*=\s*["']image["']/i.test(tag)) continue;
    const href = extractAttr(tag, 'href');
    if (href) out.add(href);
    const imagesrcset = extractAttr(tag, 'imagesrcset');
    if (imagesrcset) for (const u of srcsetUrls(imagesrcset)) out.add(u);
  }
  return out;
}

/** Fichiers .woff2 references par des @font-face dans un CSS. */
function fontUrlsInCss(css) {
  const out = new Set();
  const re = /url\(\s*([^)]+?\.woff2?)\s*\)/gi;
  let m;
  while ((m = re.exec(css))) out.add(m[1]);
  return out;
}

/**
 * Mesure les categories du budget sur un build existant (dist/<slug>). Renvoie
 * { categorie: { bytes, files: [{ url, bytes }] } }. Ne lance jamais de navigateur.
 */
function mesurer(distDir) {
  const indexPath = path.join(distDir, 'index.html');
  const html = fs.readFileSync(indexPath, 'utf8');
  const astroDir = path.join(distDir, '_astro');

  const result = {
    html: { bytes: sizeOf(indexPath), files: [{ url: 'index.html', bytes: sizeOf(indexPath) }] },
    css: { bytes: 0, files: [] },
    'js-initial': { bytes: 0, files: [] },
    'js-lazy': { bytes: 0, files: [] },
    fonts: { bytes: 0, files: [] },
    'images-home': { bytes: 0, files: [] },
  };

  // CSS charge directement par index.html.
  const cssUrls = stylesheetTagUrls(html);
  const cssTexts = [];
  for (const url of cssUrls) {
    const abs = resolveUrl(url, distDir, distDir);
    if (!abs) continue;
    const bytes = sizeOf(abs);
    result.css.files.push({ url, bytes });
    result.css.bytes += bytes;
    if (fs.existsSync(abs)) cssTexts.push({ text: fs.readFileSync(abs, 'utf8'), dir: path.dirname(abs) });
  }

  // JS initial : <script type="module" src="..."> present dans index.html (chemin critique).
  const jsInitialUrls = scriptTagUrls(html);
  for (const url of jsInitialUrls) {
    const abs = resolveUrl(url, distDir, distDir);
    if (!abs) continue;
    const bytes = sizeOf(abs);
    result['js-initial'].files.push({ url, bytes });
    result['js-initial'].bytes += bytes;
  }

  // JS paresseux : tout le reste de _astro/*.js (jamais reference directement par index.html —
  // charge uniquement par des import() dynamiques a l'usage, voir src/scripts/motion.ts).
  const jsInitialAbs = new Set([...jsInitialUrls].map((u) => resolveUrl(u, distDir, distDir)));
  for (const f of listFilesRec(astroDir)) {
    if (!f.toLowerCase().endsWith('.js')) continue;
    if (jsInitialAbs.has(f)) continue;
    const bytes = sizeOf(f);
    result['js-lazy'].files.push({ url: path.relative(distDir, f).replace(/\\/g, '/'), bytes });
    result['js-lazy'].bytes += bytes;
  }

  // Polices : .woff2 references par @font-face dans le CSS reellement charge (pas tout node_modules).
  const seenFonts = new Set();
  for (const { text, dir } of cssTexts) {
    for (const url of fontUrlsInCss(text)) {
      const abs = resolveUrl(url, distDir, dir);
      if (!abs || seenFonts.has(abs)) continue;
      // Seuls les sous-ensembles latin (et latin-ext) sont telecharges par un navigateur francais
      // (unicode-range) : les autres subsets presents dans le CSS ne coutent rien a l'utilisateur.
      if (/-(cyrillic|cyrillic-ext|greek|greek-ext|vietnamese|hebrew|arabic|devanagari|thai|symbols|math)-/.test(abs)) continue;
      seenFonts.add(abs);
      const bytes = sizeOf(abs);
      result.fonts.files.push({ url, bytes });
      result.fonts.bytes += bytes;
    }
  }

  // Images referencees par la page d'accueil (dedupliquees : un srcset repete le meme fichier).
  const seenImages = new Set();
  for (const url of imageTagUrls(html)) {
    const abs = resolveUrl(url, distDir, distDir);
    if (!abs || seenImages.has(abs)) continue;
    seenImages.add(abs);
    const bytes = sizeOf(abs);
    result['images-home'].files.push({ url, bytes });
    result['images-home'].bytes += bytes;
  }

  return result;
}

function ligne(cat, mesure, budget) {
  const kbUsed = mesure.bytes / 1024;
  const kbMax = budget.maxKB;
  const passe = kbUsed <= kbMax || cat === 'js-lazy';
  const mark = cat === 'js-lazy' ? c.dim('i') : passe ? c.green('✓') : c.red('✗');
  const used = `${kbUsed.toFixed(1)} Ko`.padStart(10);
  const max = `${kbMax} Ko`.padStart(8);
  return `  ${mark} ${cat.padEnd(14)} ${used} / ${max}  (${mesure.files.length} fichier${mesure.files.length > 1 ? 's' : ''})`;
}

export async function cmdPerf(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const budget = readBudget();
  if (!budget) {
    process.exit(1);
  }

  const distDir = path.join(DIST_DIR, slug);
  const indexExists = fs.existsSync(path.join(distDir, 'index.html'));
  if (!indexExists || flags.build) {
    info(`Construction de ${c.bold(slug)}...`);
    const status = runAstro('build', slug);
    if (status !== 0) {
      fail('Le build a echoue — budget perf annule.');
      process.exit(1);
    }
  } else {
    info(`Build existant reutilise (dist/${slug}) — passe ${c.cyan('--build')} pour reconstruire.`);
  }

  const mesures = mesurer(distDir);

  info('');
  info(`Budget de performance de ${c.bold(slug)} (perf-budget.json, tailles brutes) :`);
  info('');

  let echec = false;
  for (const cat of Object.keys(budget)) {
    const mesure = mesures[cat] ?? { bytes: 0, files: [] };
    info(ligne(cat, mesure, budget[cat]));
    // js-lazy : somme de tous les chunks emis, meme jamais importes par ce site (verification sans
    // navigateur) : informatif, jamais bloquant. Les chunks reellement charges se voient dans Lighthouse.
    if (cat === 'js-lazy') continue;
    if (mesure.bytes / 1024 > budget[cat].maxKB) {
      echec = true;
      const pires = [...mesure.files].sort((a, b) => b.bytes - a.bytes).slice(0, 5);
      for (const f of pires) info(`      ${c.dim(f.url)} ${c.dim(`(${(f.bytes / 1024).toFixed(1)} Ko)`)}`);
    }
  }
  info('');

  fs.mkdirSync(path.join(ROOT, 'captures'), { recursive: true });
  const outPath = path.join(ROOT, 'captures', `${slug}-perf.json`);
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        slug,
        generatedAt: new Date().toISOString(),
        budget,
        mesures: Object.fromEntries(Object.entries(mesures).map(([k, v]) => [k, { bytes: v.bytes, files: v.files }])),
      },
      null,
      2,
    ),
  );
  ok(`Resultats ecrits dans ${c.cyan(path.relative(ROOT, outPath))}`);

  if (echec) fail('Au moins une categorie depasse son budget.');
  else ok('Toutes les categories sont dans le budget.');

  let lighthouseOk = true;
  if (flags.lighthouse) {
    info('');
    info(c.bold('Audit Lighthouse (--lighthouse) :'));
    lighthouseOk = await runLighthouse(slug, { seuil: Number(flags.seuil) || 90, mobileOnly: Boolean(flags.mobile) });
  }

  process.exit(!echec && lighthouseOk ? 0 : 1);
}
