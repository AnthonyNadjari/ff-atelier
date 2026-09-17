// `ff lighthouse [slug] [--mobile] [--seuil 90]` : audite un site construit avec Lighthouse
// (performance/accessibilite/bonnes pratiques/SEO), desktop + mobile par defaut, sur trois pages
// (accueil, une page service, mentions legales). Ecrit captures/<slug>-lighthouse.json, sort en 1
// si une categorie de la page d'accueil est sous le seuil (desktop ou mobile).
// Voir docs/veille/SYNTHESE.md action B6, docs/veille/seo-conversion.md § 1.6 (seuils Core Web
// Vitals) et docs/PROCESS.md § definition de fait. Reutilise le serveur statique ephemere de
// scripts/captures.mjs (meme table de types MIME).
import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'node:http';
import { DIST_DIR, ROOT, resolveSlug, runAstro, ok, fail, warn, info, c, parseArgs } from './util.mjs';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2',
  '.xml': 'application/xml', '.txt': 'text/plain', '.mp4': 'video/mp4', '.json': 'application/json',
};

function startStaticServer(distDir) {
  const server = createServer((req, res) => {
    let f = path.join(distDir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f) && fs.existsSync(`${f}.html`)) f = `${f}.html`;
    if (!fs.existsSync(f)) {
      res.writeHead(404);
      res.end();
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] ?? 'application/octet-stream' });
    res.end(fs.readFileSync(f));
  }).listen(0);
  return server;
}

/** Accueil + une page service (la premiere trouvee) + mentions legales, seulement si presentes. */
function choisirPages(distDir) {
  const pages = [{ label: 'accueil', urlPath: '/' }];
  const servicesDir = path.join(distDir, 'services');
  if (fs.existsSync(servicesDir)) {
    const first = fs.readdirSync(servicesDir).filter((f) => f.endsWith('.html')).sort()[0];
    if (first) pages.push({ label: `services/${first.replace(/\.html$/, '')}`, urlPath: `/services/${first.replace(/\.html$/, '')}` });
  }
  if (fs.existsSync(path.join(distDir, 'mentions-legales.html'))) {
    pages.push({ label: 'mentions-legales', urlPath: '/mentions-legales' });
  }
  return pages;
}

function scoresDe(lhr) {
  const pct = (id) => {
    const cat = lhr.categories[id];
    return cat && typeof cat.score === 'number' ? Math.round(cat.score * 100) : null;
  };
  return { performance: pct('performance'), accessibility: pct('accessibility'), bestPractices: pct('best-practices'), seo: pct('seo') };
}

function ligneTable(label, formFactor, scores, seuil) {
  const cell = (v) => {
    if (v === null) return c.dim('  - ');
    const s = String(v).padStart(3);
    return v < seuil ? c.red(s) : c.green(s);
  };
  return `  ${label.padEnd(22)} ${formFactor.padEnd(8)} perf ${cell(scores.performance)}  a11y ${cell(scores.accessibility)}  best-practices ${cell(scores.bestPractices)}  seo ${cell(scores.seo)}`;
}

/**
 * Coeur reutilisable (par `ff lighthouse` et par `ff verifier --lighthouse`) : construit le site,
 * lance les audits, ecrit captures/<slug>-lighthouse.json. Renvoie true si la page d'accueil est
 * >= seuil sur toutes les categories (desktop et mobile), false sinon. Ne fait jamais
 * process.exit() — c'est aux appelants (cmdLighthouse pour le CLI direct, cmdVerifier pour
 * `--lighthouse`) de decider quoi faire du resultat.
 */
export async function runLighthouse(slug, { seuil = 90, mobileOnly = false } = {}) {
  const formFactors = mobileOnly ? ['mobile'] : ['desktop', 'mobile'];

  let lighthouse, launch, desktopConfig;
  try {
    ({ default: lighthouse } = await import('lighthouse'));
    ({ launch } = await import('chrome-launcher'));
    ({ default: desktopConfig } = await import('lighthouse/core/config/desktop-config.js'));
  } catch (err) {
    fail("`lighthouse`/`chrome-launcher` introuvables. Installe-les : npm install --save-dev lighthouse");
    info(String(err?.message ?? err));
    return false;
  }

  info(`Construction de ${c.bold(slug)}...`);
  const buildStatus = runAstro('build', slug);
  if (buildStatus !== 0) {
    fail('Le build a echoue — audit Lighthouse annule.');
    return false;
  }

  const distDir = path.join(DIST_DIR, slug);
  const pages = choisirPages(distDir);
  const server = startStaticServer(distDir);
  const port = server.address().port;

  const chrome = await launch({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
    chromePath: process.env.CHROME_PATH || undefined,
  });

  info('');
  info(`Audit Lighthouse de ${c.bold(slug)} (seuil ${seuil}, ${formFactors.join(' + ')}) :`);
  info('');

  const results = { slug, seuil, generatedAt: new Date().toISOString(), pages: [] };
  let echecSeuilIndex = false;

  try {
    for (const page of pages) {
      const url = `http://localhost:${port}${page.urlPath}`;
      const entry = { label: page.label, path: page.urlPath };
      for (const formFactor of formFactors) {
        const flagsLh = { port: chrome.port, onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], logLevel: 'silent' };
        const config = formFactor === 'desktop' ? desktopConfig : undefined; // undefined = config par defaut (mobile)
        let runnerResult;
        try {
          runnerResult = await lighthouse(url, flagsLh, config);
        } catch (err) {
          warn(`Echec Lighthouse sur ${page.label} (${formFactor}) : ${err?.message ?? err}`);
          continue;
        }
        const scores = scoresDe(runnerResult.lhr);
        entry[formFactor] = scores;
        info(ligneTable(page.label, formFactor, scores, seuil));
        if (page.label === 'accueil') {
          const sousLeSeuil = Object.values(scores).some((v) => v !== null && v < seuil);
          if (sousLeSeuil) echecSeuilIndex = true;
        }
      }
      results.pages.push(entry);
    }
  } finally {
    await chrome.kill();
    server.close();
  }

  fs.mkdirSync(path.join(ROOT, 'captures'), { recursive: true });
  const outPath = path.join(ROOT, 'captures', `${slug}-lighthouse.json`);
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  info('');
  ok(`Resultats ecrits dans ${c.cyan(path.relative(ROOT, outPath))}`);

  if (echecSeuilIndex) {
    fail(`Au moins une categorie de la page d'accueil est sous le seuil (${seuil}).`);
    return false;
  }
  ok(`Page d'accueil ≥ ${seuil} sur toutes les categories mesurees.`);
  return true;
}

/** CLI direct : `ff lighthouse [slug] [--mobile] [--seuil 90]`. */
export async function cmdLighthouse(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const seuil = Number(flags.seuil) || 90;
  const success = await runLighthouse(slug, { seuil, mobileOnly: Boolean(flags.mobile) });
  process.exit(success ? 0 : 1);
}
