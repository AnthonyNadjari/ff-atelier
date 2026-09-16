// `ff vignettes [nom ...] [--forcer]` : genere presets/vignettes/<nom>.webp pour chaque modele
// (capture 1280x800 du haut de page de sites/_exemple avec ce look). Sans argument, traite tous
// les presets/*.json. Ignore un preset dont la vignette est deja plus recente que son .json, sauf
// avec --forcer. Une capture qui echoue est signalee et n'empeche pas les autres.
import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'node:http';
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { ROOT, DIST_DIR, parseArgs, runAstro, readFFCurrent, writeFFCurrent, FF_CURRENT, ok, fail, warn, info, c } from './util.mjs';

export const PRESETS_DIR = path.join(ROOT, 'presets');
export const VIGNETTES_DIR = path.join(PRESETS_DIR, 'vignettes');

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
};

function listPresetNames() {
  if (!fs.existsSync(PRESETS_DIR)) return [];
  return fs
    .readdirSync(PRESETS_DIR, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.json'))
    .map((d) => path.basename(d.name, '.json'))
    .sort();
}

function readPreset(nom) {
  const p = path.join(PRESETS_DIR, `${nom}.json`);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function startServer() {
  let root = null;
  const server = createServer((req, res) => {
    if (!root) {
      res.writeHead(503);
      res.end();
      return;
    }
    let f = path.join(root, decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f = f + '.html';
    if (!fs.existsSync(f)) {
      res.writeHead(404);
      res.end();
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] ?? 'application/octet-stream' });
    res.end(fs.readFileSync(f));
  }).listen(0);
  return {
    server,
    setRoot: (r) => {
      root = r;
    },
    port: server.address().port,
  };
}

function needsBuild(nom, forcer) {
  const jsonPath = path.join(PRESETS_DIR, `${nom}.json`);
  const webpPath = path.join(VIGNETTES_DIR, `${nom}.webp`);
  if (forcer) return true;
  if (!fs.existsSync(webpPath)) return true;
  return fs.statSync(webpPath).mtimeMs < fs.statSync(jsonPath).mtimeMs;
}

function printTable(results) {
  info('');
  if (results.length === 0) {
    info('Rien a faire.');
    return;
  }
  const width = Math.max(...results.map((r) => r.nom.length), 4) + 2;
  info(c.bold('nom'.padEnd(width) + 'statut'));
  for (const r of results) {
    if (r.status.startsWith('ok')) ok(`${r.nom.padEnd(width)}${r.status}`);
    else if (r.status.startsWith('erreur')) fail(`${r.nom.padEnd(width)}${r.status}`);
    else info(`  ${r.nom.padEnd(width)}${r.status}`);
  }
}

export async function cmdVignettes(args) {
  const { positional, flags } = parseArgs(args);
  const forcer = Boolean(flags.forcer);
  const all = listPresetNames();

  if (all.length === 0) {
    warn('Aucun preset dans presets/*.json.');
    return;
  }

  const noms = positional.length ? positional : all;
  const missing = noms.filter((n) => !all.includes(n));
  if (missing.length) {
    fail(`Preset(s) introuvable(s) : ${missing.join(', ')}`);
    process.exit(1);
  }

  fs.mkdirSync(VIGNETTES_DIR, { recursive: true });

  const toBuild = new Set(noms.filter((n) => needsBuild(n, forcer)));
  const results = [];

  if (toBuild.size === 0) {
    for (const nom of noms) results.push({ nom, status: 'ignore (a jour)' });
    printTable(results);
    return;
  }

  const { server, setRoot, port } = startServer();
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch (e) {
    server.close();
    fail(`Impossible de lancer Chrome : ${e.message}`);
    process.exit(1);
  }

  // Les builds passent par runAstro (SITE=_exemple) qui ecrit .ff-current a chaque appel :
  // on restaure le site courant d'avant a la fin pour ne pas perturber `ff dev` / `ff studio`.
  const previousCurrent = readFFCurrent();

  for (const nom of noms) {
    if (!toBuild.has(nom)) {
      results.push({ nom, status: 'ignore (a jour)' });
      continue;
    }

    info(c.dim(`— vignette ${nom}...`));
    const outDirName = `_vignette-${nom}`;
    const outDir = path.join(DIST_DIR, outDirName);
    fs.rmSync(outDir, { recursive: true, force: true });
    let page;
    try {
      const preset = readPreset(nom);
      if (!preset || !preset.look) throw new Error('preset invalide (champ "look" manquant)');

      const status = runAstro('build', '_exemple', [], {
        FF_LOOK: JSON.stringify(preset.look),
        FF_OUT: `dist/${outDirName}`,
      });
      if (status !== 0) throw new Error(`build echoue (code ${status})`);

      setRoot(outDir);
      page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
      await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(800);
      const png = await page.screenshot();

      const webpPath = path.join(VIGNETTES_DIR, `${nom}.webp`);
      await sharp(png).resize({ width: 640 }).webp({ quality: 70 }).toFile(webpPath);
      const size = fs.statSync(webpPath).size;
      results.push({ nom, status: `ok (${Math.round(size / 1024)} Ko)` });
    } catch (e) {
      results.push({ nom, status: `erreur : ${e.message}` });
    } finally {
      if (page) await page.close().catch(() => {});
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  }

  await browser.close();
  server.close();

  if (previousCurrent) writeFFCurrent(previousCurrent);
  else fs.rmSync(FF_CURRENT, { force: true });

  printTable(results);

  const nbErr = results.filter((r) => r.status.startsWith('erreur')).length;
  info('');
  if (nbErr > 0) {
    fail(`${nbErr} vignette(s) en erreur sur ${results.length}.`);
    process.exit(1);
  } else {
    const nbOk = results.filter((r) => r.status.startsWith('ok')).length;
    ok(`${nbOk} vignette(s) generee(s), ${results.length - nbOk} ignoree(s) (a jour).`);
  }
}
