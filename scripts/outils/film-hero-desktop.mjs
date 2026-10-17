// node scripts/outils/film-hero-desktop.mjs <slug> : le premier écran ORDINATEUR (1400x900) image par image à
// 0, 200, 350, 700, 1100, 1600, 2400 ms, assemblé dans captures/planches/<slug>-film-d.jpg. Sert à vérifier
// qu'une entrée pensée pour le téléphone tient aussi sur l'écran du fondateur (relecture DA du 17 oct 2026 :
// la meule de la fromagerie était finie avant que le nom commence).
import { createServer } from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { chromium } from 'playwright-core'; import { createRequire } from 'node:module';
const sharp = createRequire(import.meta.url)('sharp');
const slug = process.argv[2]; if (!slug) { console.error('slug ?'); process.exit(1); }
const root = path.resolve('dist', slug);
const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg' };
const srv = createServer((q, s) => { let f = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); if (!fs.existsSync(f)) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); s.end(fs.readFileSync(f)); }).listen(0);
const b = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  const temps = [0, 200, 350, 700, 1100, 1600, 2400]; const vues = [];
  const t0 = Date.now(); await p.goto(`http://127.0.0.1:${srv.address().port}/`, { waitUntil: 'domcontentloaded' });
  for (const t of temps) { const r = t - (Date.now() - t0); if (r > 0) await p.waitForTimeout(r); const buf = await p.screenshot().catch(() => p.screenshot()); vues.push(await sharp(buf).resize(466).composite([{ input: Buffer.from(`<svg width="466" height="18"><rect width="466" height="18" fill="#ff0"/><text x="3" y="13" font-size="11" font-family="Arial">${slug} ordinateur · ${t} ms</text></svg>`), top: 0, left: 0 }]).png().toBuffer()); }
  const w = 470, h = Math.round(466 * 900 / 1400) + 4, cols = 4;
  fs.mkdirSync('captures/planches', { recursive: true });
  await sharp({ create: { width: cols * w, height: Math.ceil(vues.length / cols) * h, channels: 3, background: '#777' } }).composite(vues.map((input, i) => ({ input, left: (i % cols) * w, top: Math.floor(i / cols) * h }))).jpeg({ quality: 78 }).toFile(`captures/planches/${slug}-film-d.jpg`);
  console.log(`ok captures/planches/${slug}-film-d.jpg`);
} finally { await b.close(); srv.close(); }
