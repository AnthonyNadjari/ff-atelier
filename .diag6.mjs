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
await page.waitForTimeout(2000);

const chain = await page.evaluate(() => {
  const el = document.querySelector('#hero [data-reveal="mask"]');
  const out = [];
  let node = el;
  while (node) {
    const cs = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    out.push({
      tag: node.tagName,
      cls: node.className,
      overflow: cs.overflow, overflowX: cs.overflowX, overflowY: cs.overflowY,
      position: cs.position, transform: cs.transform, clipPath: cs.clipPath,
      display: cs.display, contain: cs.contain, willChange: cs.willChange,
      rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
    });
    node = node.parentElement;
  }
  return out;
});
console.log(JSON.stringify(chain, null, 2));
await browser.close();
server.close();
