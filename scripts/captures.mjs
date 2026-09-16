// Captures pleine page de chaque site construit (desktop + mobile) + erreurs console.
// Usage : node scripts/captures.mjs [slug ...]   (par defaut : tous les dist/*)
// Sortie : captures/<slug>-desktop.png, captures/<slug>-mobile.png
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readdirSync, existsSync, readFileSync, statSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.mp4': 'video/mp4' };
const wanted = process.argv.slice(2);
const sites = readdirSync('dist').filter((d) => statSync(join('dist', d)).isDirectory() && (!wanted.length || wanted.includes(d)));
if (!sites.length) { console.error('Aucun site construit dans dist/. Lance `npm run ff -- tous` d abord.'); process.exit(1); }
mkdirSync('captures', { recursive: true });

let current = sites[0];
const server = createServer((req, res) => {
  const root = join('dist', current);
  let f = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f) && existsSync(f + '.html')) f = f + '.html';
  if (!existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[extname(f)] ?? 'application/octet-stream' });
  res.end(readFileSync(f));
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const problems = [];
for (const slug of sites) {
  current = slug;
  for (const [label, viewport] of [['desktop', { width: 1400, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    page.on('console', (m) => { if (m.type() === 'error') problems.push(`${slug} ${label}: console ${m.text()}`); });
    page.on('pageerror', (e) => problems.push(`${slug} ${label}: exception ${e.message}`));
    page.on('requestfailed', (r) => problems.push(`${slug} ${label}: 404/echec ${r.url()}`));
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
    // Fait defiler pour declencher les reveals, puis remonte.
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 600) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(80); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1200);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (overflow) problems.push(`${slug} ${label}: debordement horizontal`);
    await page.screenshot({ path: `captures/${slug}-${label}.png`, fullPage: true });
    await page.close();
    console.log(`  ok  captures/${slug}-${label}.png`);
  }
}
await browser.close();
server.close();
if (problems.length) { console.log('\nProblemes :'); problems.forEach((p) => console.log('  ! ' + p)); }
else console.log('\nAucune erreur console, aucun debordement.');
