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
await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000); // let pin settle fully

const result = await page.evaluate(() => new Promise((resolve) => {
  const el = document.querySelector('#hero [data-reveal="mask"]');
  const io = new IntersectionObserver((entries) => {
    resolve(entries.map((e) => ({ isIntersecting: e.isIntersecting, ratio: e.intersectionRatio, rect: e.boundingClientRect, rootBounds: e.rootBounds })));
    io.disconnect();
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  io.observe(el);
  setTimeout(() => resolve('TIMEOUT no callback in 3s'), 3000);
}));
console.log(JSON.stringify(result, null, 2));
await browser.close();
server.close();
