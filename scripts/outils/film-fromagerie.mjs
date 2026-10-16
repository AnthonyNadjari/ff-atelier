import { createServer } from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { chromium } from 'playwright-core'; import { createRequire } from 'node:module';
const sharp = createRequire(import.meta.url)('sharp');
const root = 'C:/Users/nadja/ff-atelier/dist/fromagerie-ravanel';
const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const srv = createServer((q, s) => { let f = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); if (!fs.existsSync(f)) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); s.end(fs.readFileSync(f)); }).listen(0);
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const vues = [];
const snap = async (lab) => { const buf = await p.screenshot(); vues.push(await sharp(buf).resize(195).composite([{ input: Buffer.from(`<svg width="195" height="30"><rect width="195" height="18" fill="#ff0"/><text x="3" y="13" font-size="11" font-family="Arial">${lab}</text></svg>`), top: 0, left: 0 }]).png().toBuffer()); };
await p.goto(`http://localhost:${srv.address().port}/`);
for (const t of [100, 300, 600, 1000, 1600]) { await p.waitForTimeout(t === 100 ? 100 : 300); await snap(`hero ${t} ms`); }
await p.evaluate(() => document.querySelector('#age').scrollIntoView({ block: 'start' }));
for (const t of [200, 500, 900, 1500]) { await p.waitForTimeout(t === 200 ? 200 : 350); await snap(`beaufort ${t} ms`); }
await p.evaluate(() => { const bd = document.querySelector('[data-age-bande]'); bd.scrollIntoView({ block: 'center' }); });
await p.waitForTimeout(1500);
for (const f of [0.25, 0.5, 0.75, 1, 2]) { await p.evaluate((x) => { const bd = document.querySelector('[data-age-bande]'); bd.scrollLeft = bd.firstElementChild.offsetWidth * x; }, f); await p.waitForTimeout(250); await snap(`glisse ${f}`); }
const cols = 7, w = 199, h = Math.round(195 * 844 / 390) + 4;
await sharp({ create: { width: cols * w, height: Math.ceil(vues.length / cols) * h, channels: 3, background: '#777' } }).composite(vues.map((input, i) => ({ input, left: (i % cols) * w, top: Math.floor(i / cols) * h }))).jpeg({ quality: 75 }).toFile('captures/planches/fromagerie-ravanel-film.jpg');
await b.close(); srv.close(); console.log('ok', vues.length);
