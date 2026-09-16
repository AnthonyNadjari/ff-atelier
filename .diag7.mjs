import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const root = join('dist', 'forge-delacroix');
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
await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 600) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(80); }
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1200);

const info = await page.evaluate(() => {
  const el = document.querySelector('#pieces [data-reveal="mask"]');
  const cs = el ? getComputedStyle(el) : null;
  return { cls: el?.className, clip: cs?.clipPath, opacity: cs?.opacity };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
server.close();
