// `ff tuiles <slug> [--dest dossier] [--nom prefixe] [--ecrans 3] [--n 4] [--mobile-seul|--desktop-seul]`
// Capture l'accueil d'un site DÉJÀ CONSTRUIT (dist/<slug>, en-têtes de _headers appliqués comme
// `ff captures`) sur N écrans de haut, puis le découpe en tuiles webp :
//   mobile  390x844 @3  -> 900 px de large  -> <nom>-t-m0.webp … <nom>-t-m3.webp (+ -600.webp)
//   desktop 1440x900 @2 -> 1600 px de large -> <nom>-t-d0.webp … <nom>-t-d3.webp
// Usage : démos défilantes (ex. galerie du site du studio). Une seule image très haute animée en
// `transform` est floue sur iOS (texture GPU plafonnée) : des tuiles de ~1500 px de haut au plus,
// empilées, restent nettes. Sortie par défaut : .ff-tmp/tuiles/<slug>/ (jamais commité).
// Né de sites/finck-fisch (oct. 2026, script de session) ; découpe pure testée dans tests/tuiles.test.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'node:http';
import { ROOT, DIST_DIR, resolveSlug, ok, fail, warn, info, parseArgs } from './util.mjs';
import { loadHeadersRules, headersForPath } from './headers-file.mjs';

export const MODES_TUILES = {
  m: { vw: 390, vh: 844, dpr: 3, mobile: true, largeur: 900 },
  d: { vw: 1440, vh: 900, dpr: 2, mobile: false, largeur: 1600 },
};
/** Au-delà, une tuile animée redevient floue sur iPhone (limite de texture GPU constatée). */
export const HAUTEUR_TUILE_MAX = 1500;

/** Découpe pure : hauteur d'image -> n bandes de hauteur égale (le reste < n px est abandonné, comme l'original). */
export function decouperTuiles(hauteur, n) {
  if (!(n >= 1) || !(hauteur >= n)) throw new Error(`decouperTuiles : hauteur ${hauteur} trop petite pour ${n} tuiles`);
  const h = Math.floor(hauteur / n);
  return Array.from({ length: n }, (_, i) => ({ top: i * h, height: h }));
}

/** Hauteur finale (px) de l'image redimensionnée à `largeur`, pour une capture de `hauteurCss` px CSS à `vw` de large. */
export function hauteurSortie(mode, hauteurCss) {
  return Math.round((hauteurCss * mode.dpr) * (mode.largeur / (mode.vw * mode.dpr)));
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon' };

function servir(root) {
  const regles = loadHeadersRules(root);
  return createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let f = path.join(root, pathname);
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = fs.existsSync(path.join(f, 'index.html')) || !fs.existsSync(`${f}.html`) ? path.join(f, 'index.html') : `${f}.html`;
    if (!fs.existsSync(f) && fs.existsSync(`${f}.html`)) f = `${f}.html`;
    const entetes = Object.fromEntries(headersForPath(regles, pathname));
    if (!fs.existsSync(f)) { res.writeHead(404, entetes); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] ?? 'application/octet-stream', ...entetes });
    fs.createReadStream(f).pipe(res);
  });
}

export async function cmdTuiles(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const distDir = path.join(DIST_DIR, slug);
  if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    fail(`dist/${slug}/index.html absent : lance d'abord \`ff build ${slug}\`.`);
    process.exit(1);
  }
  const dest = path.resolve(ROOT, flags.dest || path.join('.ff-tmp', 'tuiles', slug));
  const nom = flags.nom || slug;
  const ecrans = Number(flags.ecrans) || 3;
  const n = Number(flags.n) || 4;
  const modes = Object.entries(MODES_TUILES).filter(([k]) => !(flags['mobile-seul'] && k === 'd') && !(flags['desktop-seul'] && k === 'm'));
  fs.mkdirSync(dest, { recursive: true });

  const { chromium } = await import('playwright-core');
  const sharp = (await import('sharp')).default;
  const srv = servir(distDir);
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const navigateur = await chromium.launch({ channel: process.env.FF_CHROMIUM ? undefined : 'chrome', headless: true });
  try {
    for (const [k, M] of modes) {
      const ctx = await navigateur.newContext({ viewport: { width: M.vw, height: M.vh }, deviceScaleFactor: M.dpr, isMobile: M.mobile, hasTouch: M.mobile, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:${srv.address().port}/`, { waitUntil: 'networkidle', timeout: 60_000 }).catch(() => {});
      await page.evaluate(() => document.fonts?.ready);
      const H = Math.round(M.vh * ecrans);
      // Défile pour déclencher les reveals et le chargement paresseux, puis remonte.
      for (let y = 0; y <= H; y += 200) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(100); }
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(1200);
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      const buf = await page.screenshot({ clip: { x: 0, y: 0, width: M.vw, height: Math.min(H, total) }, fullPage: true });
      await ctx.close();
      const img = await sharp(buf).resize(M.largeur).png().toBuffer();
      const { height } = await sharp(img).metadata();
      const bandes = decouperTuiles(height, n);
      if (bandes[0].height > HAUTEUR_TUILE_MAX) warn(`${k} : tuiles de ${bandes[0].height} px (> ${HAUTEUR_TUILE_MAX}) : floues sur iOS si animées — augmente --n.`);
      let ko = 0;
      for (const [i, b] of bandes.entries()) {
        const out = path.join(dest, `${nom}-t-${k}${i}.webp`);
        await sharp(img).extract({ left: 0, top: b.top, width: M.largeur, height: b.height }).webp({ quality: 88 }).toFile(out);
        ko += fs.statSync(out).size / 1024;
        // Mobile : aussi la tuile de 600 px (-600.webp), celle que prend un téléphone affiché à 150-300 px
        // (DemoVideo, srcset) ; faite à la main avec sharp à chaque recapture jusqu'au 14 oct 2026.
        if (k === 'm') await sharp(out).resize({ width: 600 }).webp({ quality: 78 }).toFile(path.join(dest, `${nom}-t-${k}${i}-600.webp`));
      }
      ok(`${slug} ${k === 'm' ? 'mobile' : 'desktop'} : ${M.largeur}x${bandes[0].height * n} en ${n} tuiles, ${Math.round(ko)} Ko`);
    }
  } finally {
    await navigateur.close();
    srv.close();
  }
  info(`Tuiles dans ${path.relative(ROOT, dest) || dest}`);
}
