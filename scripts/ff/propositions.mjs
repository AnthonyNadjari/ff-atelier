// `ff propositions <slug> [--n 3] [--graine N] [--metier "..."]` : genere N looks distincts pour le
// meme contenu (direction + hero differents a chaque fois), les build, les capture (desktop+mobile)
// et produit une feuille de contact HTML autonome dans propositions/<slug>/index.html.
// `ff propositions <slug> --appliquer <i>` : applique la proposition i comme look.json du site.
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, statSync } from 'node:fs';
import path from 'node:path';
import { createServer } from 'node:http';
import { chromium } from 'playwright-core';
import { ROOT, SITES_DIR, DIST_DIR, siteExists, parseArgs, runAstro, ok, fail, info, c } from './util.mjs';
import { pickLook } from './composer.mjs';
import { readConfigParts } from './look-data.mjs';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.mp4': 'video/mp4',
};

function startServer() {
  let root = null;
  const server = createServer((req, res) => {
    if (!root) {
      res.writeHead(503);
      res.end();
      return;
    }
    let f = path.join(root, decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (existsSync(f) && statSync(f).isDirectory()) f = existsSync(path.join(f, 'index.html')) || !existsSync(`${f}.html`) ? path.join(f, 'index.html') : `${f}.html`; // /audit + /audit/merci : audit.html a cote du dossier audit/ (pages sur mesure)
    if (!existsSync(f) && existsSync(f + '.html')) f = f + '.html';
    if (!existsSync(f)) {
      res.writeHead(404);
      res.end();
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] ?? 'application/octet-stream' });
    res.end(readFileSync(f));
  }).listen(0);
  return {
    server,
    setRoot: (r) => {
      root = r;
    },
    port: server.address().port,
  };
}

/** Capture desktop + mobile pleine page (fait defiler pour declencher les reveals, comme scripts/captures.mjs). */
async function captureBoth(browser, port, outBase) {
  const shots = {};
  const views = [
    ['desktop', { width: 1400, height: 900 }],
    ['mobile', { width: 390, height: 844 }],
  ];
  for (const [label, viewport] of views) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 600) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(80);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    const file = `${outBase}-${label}.png`;
    await page.screenshot({ path: file, fullPage: true });
    shots[label] = path.basename(file);
    await page.close();
  }
  return shots;
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c2) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c2]);
}

function writeContactSheet(slug, outDir, propositions) {
  const cols = propositions
    .map(({ i, result, shots }) => {
      const { direction, look } = result;
      const fonts = `${look.typography.display} / ${look.typography.body}`;
      return `
      <section class="col">
        <h2>Proposition ${i}</h2>
        <p class="meta"><strong>${escapeHtml(direction)}</strong> — polices ${escapeHtml(fonts)} — hero ${escapeHtml(look.layout.hero)}</p>
        <div class="shots">
          <img src="${escapeHtml(shots.desktop)}" alt="Proposition ${i}, version bureau" class="desktop" loading="lazy">
          <img src="${escapeHtml(shots.mobile)}" alt="Proposition ${i}, version mobile" class="mobile" loading="lazy">
        </div>
        <details>
          <summary>JSON du look</summary>
          <pre>${escapeHtml(JSON.stringify(look, null, 2))}</pre>
        </details>
      </section>`;
    })
    .join('\n');

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Propositions — ${escapeHtml(slug)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 32px 24px 64px; font-family: system-ui, -apple-system, Segoe UI, sans-serif; background: #f4f3f0; color: #1a1a1a; }
  h1 { font-size: 22px; margin: 0 0 24px; }
  .grid { display: grid; grid-template-columns: repeat(${Math.max(1, propositions.length)}, minmax(300px, 1fr)); gap: 24px; align-items: start; }
  .col { background: #fff; border: 1px solid #ddd; border-radius: 10px; padding: 16px; }
  .col h2 { margin: 0 0 6px; font-size: 17px; }
  .meta { margin: 0 0 12px; font-size: 13px; color: #555; }
  .shots { display: flex; gap: 8px; align-items: flex-start; }
  .shots img { max-width: 100%; border: 1px solid #ccc; border-radius: 4px; display: block; }
  .shots .desktop { width: 68%; }
  .shots .mobile { width: 30%; }
  details { margin-top: 12px; }
  summary { cursor: pointer; font-size: 13px; color: #555; }
  pre { font-size: 11px; overflow-x: auto; background: #f7f7f5; padding: 8px; border-radius: 6px; }
  @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
</style>
</head>
<body>
  <h1>Propositions de look — ${escapeHtml(slug)}</h1>
  <div class="grid">${cols}</div>
</body>
</html>
`;
  const indexPath = path.join(outDir, 'index.html');
  writeFileSync(indexPath, html);
  return indexPath;
}

/**
 * Remet dans un look propose les sections sur mesure du site (`{ type: 'custom' }`) a leur rang
 * d'origine. Le look remplace `layout.sections` en entier : le bloc signature du client, obligatoire,
 * disparaissait des trois propositions (rodage du 13 oct 2026). Pure, testee.
 */
export function garderSurMesure(sectionsLook, sectionsSite = []) {
  const out = [...sectionsLook];
  sectionsSite.forEach((s, rang) => {
    if (s && s.type === 'custom') out.splice(Math.min(rang, out.length), 0, s);
  });
  return out;
}

export async function cmdPropositions(args) {
  const { positional, flags } = parseArgs(args);
  const slug = positional[0];
  if (!slug) {
    fail('Usage : ff propositions <slug> [--n 3] [--graine N] [--metier "..."]  |  ff propositions <slug> --appliquer <i>');
    process.exit(1);
  }
  if (!siteExists(slug)) {
    fail(`Site introuvable : sites/${slug}. Lance \`ff nouveau ${slug}\` d'abord.`);
    process.exit(1);
  }

  const outDir = path.join(ROOT, 'propositions', slug);

  if (flags.appliquer !== undefined) {
    const i = Number(flags.appliquer);
    const src = path.join(outDir, `look-${i}.json`);
    if (!existsSync(src)) {
      fail(`Introuvable : propositions/${slug}/look-${i}.json. Lance d'abord \`ff propositions ${slug}\`.`);
      process.exit(1);
    }
    const dest = path.join(SITES_DIR, slug, 'look.json');
    writeFileSync(dest, readFileSync(src, 'utf8'));
    ok(`Proposition ${i} appliquée : sites/${slug}/look.json`);
    process.exit(0);
  }

  const n = flags.n !== undefined ? Math.max(1, Math.trunc(Number(flags.n)) || 1) : 3;
  const grBase = flags.graine !== undefined ? Number(flags.graine) : 1;

  mkdirSync(outDir, { recursive: true });

  const { server, setRoot, port } = startServer();
  const browser = await chromium.launch({ channel: process.env.FF_CHROMIUM ? undefined : 'chrome', headless: true });

  const usedDirections = [];
  const usedHeroes = [];
  const usedShells = [];
  const sectionsSite = (readConfigParts(slug)?.layout?.sections) || [];
  const propositions = [];
  let failed = false;

  try {
    for (let i = 1; i <= n; i++) {
      const seed = grBase + i * 101;
      let result;
      try {
        result = pickLook(slug, { metier: flags.metier, graine: seed, excludeDirections: usedDirections, excludeHeroes: usedHeroes, excludeShells: usedShells });
        result.look.layout.sections = garderSurMesure(result.look.layout.sections, sectionsSite);
      } catch (e) {
        fail(e.message);
        failed = true;
        break;
      }
      usedDirections.push(result.direction);
      usedHeroes.push(result.look.layout.hero);
      usedShells.push(result.look.layout.shell);

      writeFileSync(path.join(outDir, `look-${i}.json`), JSON.stringify(result.look, null, 2) + '\n');

      // Le look passe par FF_LOOK et la sortie par FF_OUT : le dossier du site n'est jamais modifie,
      // un build interrompu ne laisse aucune trace.
      const propDistDir = path.join(DIST_DIR, `_prop-${slug}-${i}`);
      rmSync(propDistDir, { recursive: true, force: true });
      const buildStatus = runAstro('build', slug, [], {
        FF_LOOK: JSON.stringify(result.look),
        FF_OUT: path.relative(ROOT, propDistDir).split(path.sep).join('/'),
      });
      if (buildStatus !== 0) {
        fail(`Build échoué pour la proposition ${i}.`);
        failed = true;
        break;
      }

      setRoot(propDistDir);
      const shots = await captureBoth(browser, port, path.join(outDir, `prop-${i}`));
      // Le build de la proposition ne sert qu'aux captures : 2 Mo par proposition laisses dans dist/.
      rmSync(propDistDir, { recursive: true, force: true });

      propositions.push({ i, result, shots });
      ok(`Proposition ${i} : ${result.direction} / ${result.look.layout.hero}`);
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (failed) process.exit(1);

  const indexPath = writeContactSheet(slug, outDir, propositions);
  info('');
  ok(`Feuille de contact : ${c.cyan(path.relative(ROOT, indexPath))}`);
  process.exit(0);
}
