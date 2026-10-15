// `ff planche <slug> [--crans 3] [--n 24] [--debut 0] [--mobile-seul|--desktop-seul] [--dest dossier]`
// Planche-contact du DÉFILEMENT À LA MOLETTE d'un site déjà construit (dist/<slug>, en-têtes de
// _headers appliqués) : une vignette tous les `crans` coups de molette (100 px chacun), assemblées en
// grille, ordinateur (1400x900) puis téléphone (390x844, glissé au doigt). Le numéro de pixel défilé est
// écrit sur chaque vignette.
//
// Pourquoi : une capture fixe ne voit pas un défilement cassé. Le 13 oct 2026, la séquence d'images de
// la forge ne s'animait qu'à la fin de son épinglage ; `ff captures` et `ff audit-motion` disaient
// « rien de cassé ». Un œil sur la planche l'aurait vu en dix secondes. Règle de docs/GOUT.md § 3 :
// « filmer à la molette avant de dire rien de cassé ». Script de session jusqu'au 15 oct 2026.
//
// Sortie : captures/planches/<slug>-d-<debut>.jpg et <slug>-m-<debut>.jpg (dossier local, jamais commité).
// La planche est faite pour être REGARDÉE (outil Read) par l'agent qui relit, pas analysée par un script.
import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'node:http';
import { ROOT, DIST_DIR, resolveSlug, ok, fail, info, parseArgs } from './util.mjs';
import { loadHeadersRules, headersForPath } from './headers-file.mjs';

export const MODES_PLANCHE = {
  d: { vw: 1400, vh: 900, dpr: 1, mobile: false, largeurVignette: 350 },
  m: { vw: 390, vh: 844, dpr: 1, mobile: true, largeurVignette: 180 },
};

/** Disposition pure : n vignettes de (l x h) en `cols` colonnes, marge de 4 px -> positions et taille de la planche. */
export function disposerVignettes(n, largeur, hauteur, cols = 4, marge = 4) {
  const rows = Math.ceil(n / cols);
  const positions = Array.from({ length: n }, (_, i) => ({ left: (i % cols) * (largeur + marge), top: Math.floor(i / cols) * (hauteur + marge) }));
  return { positions, width: cols * (largeur + marge), height: rows * (hauteur + marge) };
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon' };

function servir(root) {
  const regles = loadHeadersRules(root);
  return createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let f = path.join(root, pathname);
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f) && fs.existsSync(`${f}.html`)) f = `${f}.html`;
    const entetes = Object.fromEntries(headersForPath(regles, pathname));
    if (!fs.existsSync(f)) { res.writeHead(404, entetes); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] ?? 'application/octet-stream', ...entetes });
    fs.createReadStream(f).pipe(res);
  });
}

export async function cmdPlanche(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const distDir = path.join(DIST_DIR, slug);
  if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    fail(`dist/${slug}/index.html absent : lance d'abord \`ff build ${slug}\`.`);
    process.exit(1);
  }
  const crans = Number(flags.crans) || 3;
  const n = Number(flags.n) || 24;
  const debut = Number(flags.debut) || 0;
  const dest = path.resolve(ROOT, flags.dest || path.join('captures', 'planches'));
  const modes = Object.entries(MODES_PLANCHE).filter(([k]) => !(flags['mobile-seul'] && k === 'd') && !(flags['desktop-seul'] && k === 'm'));
  fs.mkdirSync(dest, { recursive: true });

  const { chromium } = await import('playwright-core');
  const sharp = (await import('sharp')).default;
  const srv = servir(distDir);
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const navigateur = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-blink-features=AutomationControlled'] });
  try {
    for (const [k, M] of modes) {
      const ctx = await navigateur.newContext({ viewport: { width: M.vw, height: M.vh }, deviceScaleFactor: M.dpr, isMobile: M.mobile, hasTouch: M.mobile });
      const page = await ctx.newPage();
      await page.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => false }));
      const erreurs = [];
      page.on('pageerror', (e) => erreurs.push(e.message));
      await page.goto(`http://127.0.0.1:${srv.address().port}/`, { waitUntil: 'load', timeout: 60_000 }).catch(() => {});
      await page.waitForTimeout(1500);
      await page.mouse.move(M.vw / 2, M.vh / 2);
      // Téléphone : pas de molette ; on glisse de `cran` px avec le doigt (scrollBy, comme un geste court).
      const cran = async () => {
        if (M.mobile) await page.evaluate(() => scrollBy(0, 100));
        else await page.mouse.wheel(0, 100);
        await page.waitForTimeout(30);
      };
      for (let i = 0; i < debut; i++) await cran();
      const hv = Math.round(M.largeurVignette * M.vh / M.vw);
      const vignettes = [];
      for (let i = 0; i < n; i++) {
        await page.waitForTimeout(250);
        const y = await page.evaluate(() => Math.round(scrollY));
        const buf = await page.screenshot();
        const etiquette = Buffer.from(`<svg width="${M.largeurVignette}" height="${hv}"><rect width="64" height="18" fill="#ff0"/><text x="4" y="14" font-size="13" font-family="Arial">${y}</text></svg>`);
        vignettes.push(await sharp(buf).resize(M.largeurVignette).composite([{ input: etiquette, top: 0, left: 0 }]).png().toBuffer());
        for (let c = 0; c < crans; c++) await cran();
      }
      const cols = M.mobile ? 8 : 4;
      const { positions, width, height } = disposerVignettes(n, M.largeurVignette, hv, cols);
      const sortie = path.join(dest, `${slug}-${k}-${debut}.jpg`);
      await sharp({ create: { width, height, channels: 3, background: '#888' } })
        .composite(vignettes.map((input, i) => ({ input, ...positions[i] })))
        .jpeg({ quality: 72 }).toFile(sortie);
      await ctx.close();
      ok(`${slug} ${M.mobile ? 'téléphone' : 'ordinateur'} : ${n} vignettes tous les ${crans * 100} px -> ${path.relative(ROOT, sortie)}`);
      if (erreurs.length) info(`  erreurs JS pendant le défilement : ${erreurs.slice(0, 3).join(' | ')}`);
    }
  } finally {
    await navigateur.close();
    srv.close();
  }
}
