// `ff film <slug> [--geste <sélecteur>] [--glisser <sélecteur>] [--toucher <sélecteur>] [--mobile-seul|--desktop-seul]`
// Filme le MOUVEMENT d'un site déjà construit, image par image, sans script à écrire par site :
//   - l'entrée du premier écran : téléphone (390x844) à 0, 150, 400, 800, 1 500 et 2 400 ms, puis ordinateur
//     (1400x900) aux mêmes instants ;
//   - la première section sous le hero amenée à l'écran, à +250 et +900 ms (l'apparition au défilement) ;
//   - le geste signature, si on lui dit où : `--geste "#age"` amène la section à l'écran et photographie à +200,
//     +600, +1 200 ms ; `--toucher "[data-fro]"` touche le premier élément trouvé puis photographie aux mêmes
//     instants ; `--glisser "[data-age-bande]"` fait glisser l'élément à 25, 50, 75 et 100 % de sa largeur.
// Sortie : captures/planches/<slug>-film.jpg (téléphone) et <slug>-film-d.jpg (ordinateur), comme avant.
//
// Pourquoi (17 oct 2026) : /site-final demandait d'adapter un script playwright par site pour filmer ; les
// constructeurs oubliaient, ou filmaient le téléphone seulement (la meule de la piste A était finie avant le nom
// sur ordinateur, vu par le relecteur, pas par le constructeur). Le film est l'unique preuve du mouvement.
import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { ROOT, DIST_DIR, resolveSlug, ok, fail, info, parseArgs } from './util.mjs';
import { loadHeadersRules, headersForPath } from './headers-file.mjs';

export const TEMPS_ENTREE = [0, 150, 400, 800, 1500, 2400];
export const TEMPS_GESTE = [200, 600, 1200];
const MODES = { m: { vw: 390, vh: 844, mobile: true, larg: 180, cols: 6 }, d: { vw: 1400, vh: 900, mobile: false, larg: 350, cols: 4 } };

/** Pure : la liste des prises (label + action) d'un mode, selon les options. */
export function prises({ geste, toucher, glisser } = {}) {
  const p = TEMPS_ENTREE.map((t) => ({ label: `entrée ${t} ms`, type: 'attente', t }));
  p.push({ label: 'section +250 ms', type: 'section', t: 250 }, { label: 'section +900 ms', type: 'section', t: 900 });
  if (geste) for (const t of TEMPS_GESTE) p.push({ label: `geste +${t} ms`, type: 'geste', sel: geste, t });
  if (toucher) for (const t of TEMPS_GESTE) p.push({ label: `touché +${t} ms`, type: 'toucher', sel: toucher, t });
  if (glisser) for (const f of [0.25, 0.5, 0.75, 1]) p.push({ label: `glissé ${Math.round(f * 100)} %`, type: 'glisser', sel: glisser, f });
  return p;
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json', '.mp4': 'video/mp4', '.webm': 'video/webm' };
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

const SECTION_SOUS_HERO = () => {
  const blocs = [...document.querySelectorAll('main > *, main > * > section')].filter((e) => e.getBoundingClientRect().height > 80);
  const cible = blocs.find((e) => e.getBoundingClientRect().top > window.innerHeight * 0.6) || blocs[1];
  cible?.scrollIntoView({ block: 'start' });
};

async function filmerMode(browser, sharp, url, mode, options, slug) {
  const { vw, vh, mobile, larg, cols } = MODES[mode];
  const page = await browser.newPage({ viewport: { width: vw, height: vh }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  const vues = [];
  const snap = async (label) => {
    const png = await page.screenshot().catch(() => page.screenshot());
    vues.push(await sharp(png).resize(larg).composite([{ input: Buffer.from(`<svg width="${larg}" height="16"><rect width="${larg}" height="16" fill="#ff0"/><text x="3" y="12" font-size="10" font-family="Arial">${slug} ${mode === 'm' ? 'tél.' : 'ordi.'} · ${label}</text></svg>`), top: 0, left: 0 }]).png().toBuffer());
  };
  try {
    const t0 = Date.now();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    let sectionFaite = false;
    for (const p of prises(options)) {
      if (p.type === 'attente') { const r = p.t - (Date.now() - t0); if (r > 0) await page.waitForTimeout(r); await snap(p.label); continue; }
      if (p.type === 'section') { if (!sectionFaite) { await page.evaluate(SECTION_SOUS_HERO); sectionFaite = true; await page.waitForTimeout(p.t); } else await page.waitForTimeout(p.t - 250); await snap(p.label); continue; }
      if (p.type === 'geste' || p.type === 'toucher') {
        if (p.t === TEMPS_GESTE[0]) {
          await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'center' }), p.sel);
          await page.waitForTimeout(700);
          if (p.type === 'toucher') { const el = page.locator(p.sel).first(); if (mobile) await el.tap({ timeout: 3000 }).catch(() => el.click({ timeout: 3000 })); else await el.click({ timeout: 3000 }); }
          await page.waitForTimeout(p.t);
        } else await page.waitForTimeout(p.t - TEMPS_GESTE[TEMPS_GESTE.indexOf(p.t) - 1]);
        await snap(p.label); continue;
      }
      if (p.type === 'glisser') {
        if (p.f === 0.25) { await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'center' }), p.sel); await page.waitForTimeout(700); }
        await page.evaluate(({ sel, f }) => { const el = document.querySelector(sel); if (!el) return; const l = el.scrollWidth - el.clientWidth; if (l > 0) el.scrollLeft = l * f; else { const r = el.getBoundingClientRect(); el.dispatchEvent(new PointerEvent('pointerdown', { clientX: r.left + 10, clientY: r.top + r.height / 2, bubbles: true })); el.dispatchEvent(new PointerEvent('pointermove', { clientX: r.left + r.width * f, clientY: r.top + r.height / 2, bubbles: true })); el.dispatchEvent(new PointerEvent('pointerup', { clientX: r.left + r.width * f, clientY: r.top + r.height / 2, bubbles: true })); } }, { sel: p.sel, f: p.f });
        await page.waitForTimeout(300); await snap(p.label);
      }
    }
  } finally {
    await page.close();
  }
  const w = larg + 4, h = Math.round(larg * vh / vw) + 4;
  const sortie = path.join(ROOT, 'captures', 'planches', `${slug}-film${mode === 'd' ? '-d' : ''}.jpg`);
  await sharp({ create: { width: cols * w, height: Math.ceil(vues.length / cols) * h, channels: 3, background: '#777' } }).composite(vues.map((input, i) => ({ input, left: (i % cols) * w, top: Math.floor(i / cols) * h }))).jpeg({ quality: 78 }).toFile(sortie);
  return { sortie, n: vues.length };
}

export async function cmdFilm(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const distDir = path.join(DIST_DIR, slug);
  if (!fs.existsSync(path.join(distDir, 'index.html'))) { fail(`dist/${slug}/index.html absent : lance d'abord \`ff build ${slug}\`.`); process.exit(1); }
  const options = { geste: flags.geste, toucher: flags.toucher, glisser: flags.glisser };
  const modes = Object.keys(MODES).filter((m) => !(flags['mobile-seul'] && m === 'd') && !(flags['desktop-seul'] && m === 'm'));
  const require = createRequire(import.meta.url);
  const { chromium } = require('playwright-core');
  const sharp = require('sharp');
  fs.mkdirSync(path.join(ROOT, 'captures', 'planches'), { recursive: true });
  const srv = servir(distDir);
  await new Promise((r) => srv.listen(0, r));
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const m of modes) {
      const r = await filmerMode(browser, sharp, `http://127.0.0.1:${srv.address().port}/`, m, options, slug);
      ok(`${m === 'm' ? 'téléphone' : 'ordinateur'} : ${r.n} vues -> ${path.relative(ROOT, r.sortie)}`);
    }
  } finally {
    await browser.close();
    srv.close();
  }
  info('À regarder (outil Read) : l\'entrée se fait-elle sur une chose du métier, aux deux formats ? La section apparaît-elle à +250 ms ? Le geste répond-il ?');
}
