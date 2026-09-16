import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const root = join('dist', 'anna-vidal');
const server = createServer((req, res) => {
  let f = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f) && existsSync(f + '.html')) f = f + '.html';
  if (!existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[extname(f)] ?? 'application/octet-stream' });
  res.end(readFileSync(f));
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
page.on('console', (m) => console.log('CONSOLE:', m.text()));
await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });

await page.evaluate(() => {
  const wrap = document.querySelector('#hero [data-reveal="mask"]');
  window.__log = [];
  const mo = new MutationObserver(() => window.__log.push({ t: performance.now(), cls: wrap.className }));
  mo.observe(wrap, { attributes: true, attributeFilter: ['class'] });
  window.__wrap = wrap;
});

for (const wait of [50, 150, 300, 600, 1000, 2000]) {
  await page.waitForTimeout(wait);
  const snap = await page.evaluate(() => ({
    cls: window.__wrap.className,
    rect: window.__wrap.getBoundingClientRect(),
    log: window.__log,
  }));
  console.log(wait, JSON.stringify(snap));
}

await browser.close();
server.close();
