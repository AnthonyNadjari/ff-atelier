// Captures pleine page de chaque site construit (desktop + mobile) + erreurs console.
// Usage : node scripts/captures.mjs [slug ...] [--comparer] [--figer]   (par defaut : tous les dist/*)
// Sortie : captures/<slug>-desktop.png, captures/<slug>-mobile.png
//
// --comparer : compare chaque capture fraiche a captures/base/<slug>-<label>.png (regression
//   visuelle, voir scripts/ff/compare-images.mjs) — > 0.5 % de pixels differents -> avertissement
//   (pas un echec : une evolution visuelle voulue ne doit pas casser la CI, `--figer` sert a
//   valider le nouveau visuel comme reference) + ecrit une image de diff dans captures/diff/.
//   Base absente pour un site -> juste signale, rien a comparer (premier passage).
// --figer : copie les captures fraichement prises dans captures/base/ (nouvelle reference).
//   captures/base/ n'est jamais commite (voir .gitignore, `captures/` entier est ignore) : chaque
//   poste de travail/CI a sa propre reference locale, a regenerer avec --figer apres un changement
//   visuel volontaire.
//
// Un vrai probleme (erreur console, exception JS, requete en echec, debordement horizontal) fait
// toujours echouer le process (exit 1), y compris avec --comparer : la regression visuelle est un
// avertissement en plus des checks existants, jamais un remplacement.
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readdirSync, existsSync, readFileSync, writeFileSync, statSync, mkdirSync, cpSync } from 'node:fs';
import { join, extname } from 'node:path';
import { comparePngBuffers, SEUIL_DIFF_PERCENT } from './ff/compare-images.mjs';
import { loadHeadersRules, headersForPath } from './ff/headers-file.mjs';

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.mp4': 'video/mp4' };
const rawArgs = process.argv.slice(2);
const comparer = rawArgs.includes('--comparer');
const figer = rawArgs.includes('--figer');
const wanted = rawArgs.filter((a) => !a.startsWith('--'));
const sites = readdirSync('dist').filter((d) => statSync(join('dist', d)).isDirectory() && (!wanted.length || wanted.includes(d)));
if (!sites.length) { console.error('Aucun site construit dans dist/. Lance `npm run ff -- tous` d abord.'); process.exit(1); }
mkdirSync('captures', { recursive: true });
if (comparer) mkdirSync('captures/diff', { recursive: true });
if (figer) mkdirSync('captures/base', { recursive: true });

let current = sites[0];
const server = createServer((req, res) => {
  const root = join('dist', current);
  const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = join(root, pathname);
  if (existsSync(f) && statSync(f).isDirectory()) f = existsSync(join(f, 'index.html')) || !existsSync(`${f}.html`) ? join(f, 'index.html') : `${f}.html`; // /audit + /audit/merci : audit.html a cote du dossier audit/ (pages sur mesure)
  if (!existsSync(f) && existsSync(f + '.html')) f = f + '.html';
  // Applique les en-tetes de dist/<slug>/_headers (astro.config.mjs, integration ff-headers, dont
  // la CSP) comme le ferait Cloudflare Pages en production : sans ca, une capture locale ne peut
  // jamais reveler une erreur console causee par la CSP (voir scripts/ff/headers-file.mjs).
  const headerLines = headersForPath(loadHeadersRules(root), pathname);
  if (!existsSync(f)) {
    res.writeHead(404, Object.fromEntries(headerLines));
    return res.end();
  }
  res.writeHead(200, { 'Content-Type': types[extname(f)] ?? 'application/octet-stream', ...Object.fromEntries(headerLines) });
  res.end(readFileSync(f));
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch({ channel: process.env.FF_CHROMIUM ? undefined : 'chrome', headless: true });
const problems = [];
const diffWarnings = [];
for (const slug of sites) {
  current = slug;
  for (const [label, viewport] of [['desktop', { width: 1400, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    // Demo privee d'un prospect sans ses photos (.gitignore : sites/prospect-*/public/images/ reste en local,
    // droits du commerce) : en CI ses images repondent 404. Ces 404-la, et seulement eux, ne sont pas une panne.
    const photosPrivees = slug.startsWith('prospect-') && !existsSync(join('sites', slug, 'public', 'images'));
    const erreursConsole = [];
    const absents = [];
    page.on('response', (r) => { if (r.status() === 404) absents.push(new URL(r.url()).pathname); });
    page.on('console', (m) => { if (m.type() === 'error') erreursConsole.push(m.text()); });
    page.on('pageerror', (e) => problems.push(`${slug} ${label}: exception ${e.message}`));
    page.on('requestfailed', (r) => problems.push(`${slug} ${label}: 404/echec ${r.url()}`));
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
    // Fait defiler pour declencher les reveals, puis remonte.
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 600) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(80); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1200);
    const seulementPhotosPrivees = photosPrivees && absents.length > 0 && absents.every((u) => u.startsWith('/images/'));
    const ignorees = erreursConsole.filter((t) => seulementPhotosPrivees && t.startsWith('Failed to load resource'));
    for (const t of erreursConsole) if (!ignorees.includes(t)) problems.push(`${slug} ${label}: console ${t}`);
    if (ignorees.length) console.log(`  -   ${slug} ${label}: ${absents.length} photo(s) privee(s) absente(s) du depot, ignorees`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (overflow) problems.push(`${slug} ${label}: debordement horizontal`);
    // Sections epinglees (data-pin / data-frames / data-horizontal, GSAP ScrollTrigger) : leur piste de
    // defilement (.pin-spacer, 400-500 vh) est une longueur de scroll, pas un visuel — dans une capture
    // pleine page elle apparaissait comme un trou de ~2 000 px de fond vide (forge-delacroix, veille
    // animations-2 § 4.2). On replie le spacer et on repose la section a sa hauteur naturelle, apres le
    // defilement (les reveals sont deja declenches) et seulement pour l'image.
    await page.addStyleTag({ content: '.pin-spacer { padding: 0 !important; height: auto !important; min-height: 0 !important; } .pin-spacer > * { position: relative !important; inset: auto !important; transform: none !important; max-width: none !important; }' });
    await page.waitForTimeout(100);
    const capturePath = `captures/${slug}-${label}.png`;
    await page.screenshot({ path: capturePath, fullPage: true });
    await page.close();
    console.log(`  ok  ${capturePath}`);

    if (comparer) {
      const basePath = `captures/base/${slug}-${label}.png`;
      if (!existsSync(basePath)) {
        console.log(`  ?   pas de reference captures/base/${slug}-${label}.png (lance --figer pour en creer une)`);
      } else {
        const result = await comparePngBuffers(readFileSync(basePath), readFileSync(capturePath));
        if (!result.comparable) {
          diffWarnings.push(`${slug} ${label}: dimensions changees (base ${result.width}x${result.height}, actuel ${result.widthB}x${result.heightB}) — comparaison pixel impossible`);
        } else if (result.diffPercent > SEUIL_DIFF_PERCENT) {
          const diffPath = `captures/diff/${slug}-${label}-diff.png`;
          writeFileSync(diffPath, result.diffPngBuffer);
          diffWarnings.push(`${slug} ${label}: ${result.diffPercent.toFixed(2)} % de pixels differents (seuil ${SEUIL_DIFF_PERCENT} %) -> ${diffPath}`);
        }
      }
    }
    if (figer) cpSync(capturePath, `captures/base/${slug}-${label}.png`);
  }
}
await browser.close();
server.close();

if (figer) console.log(`\ncaptures/base/ mis a jour (${sites.length * 2} image(s)) — nouvelle reference pour --comparer.`);
if (comparer) {
  if (diffWarnings.length) { console.log('\nRegression visuelle (avertissement, pas un echec) :'); diffWarnings.forEach((w) => console.log('  ~ ' + w)); }
  else console.log('\nAucune difference visuelle notable par rapport a captures/base/.');
}

if (problems.length) {
  console.log('\nProblemes :');
  problems.forEach((p) => console.log('  ! ' + p));
  process.exit(1);
}
console.log('\nAucune erreur console, aucun debordement.');
