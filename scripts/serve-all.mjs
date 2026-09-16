// Sert chaque dist/<slug> sur un port distinct (8001, 8002, ...) pour comparer les demos.
import { createServer } from 'node:http';
import { readdirSync, existsSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.mp4': 'video/mp4' };
const sites = readdirSync('dist').filter((d) => statSync(join('dist', d)).isDirectory());
sites.forEach((slug, i) => {
  const root = join('dist', slug);
  const port = 8001 + i;
  createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let f = join(root, p);
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
    if (!existsSync(f) && existsSync(f + '.html')) f = f + '.html';
    if (!existsSync(f)) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': types[extname(f)] ?? 'application/octet-stream' });
    res.end(readFileSync(f));
  }).listen(port, () => console.log(`http://localhost:${port}  ${slug}`));
});
