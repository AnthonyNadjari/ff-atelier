// Sert chaque dist/<slug> sur un port distinct (a partir de 8001) pour comparer les sites.
// Usage : ff servir [slug ...]
import { createServer } from 'node:http';
import { readdirSync, existsSync, readFileSync, statSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHeadersRules, headersForPath } from './ff/headers-file.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST = join(ROOT, 'dist');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.mp4': 'video/mp4' };

if (!existsSync(DIST)) { console.error('Aucun site construit. Lance `ff tous` ou `ff build <slug>` d abord.'); process.exit(1); }
const wanted = process.argv.slice(2).filter((a) => !/[\\/]/.test(a));
const sites = readdirSync(DIST).filter((d) => statSync(join(DIST, d)).isDirectory() && !d.startsWith('_test') && !d.startsWith('_vignette') && (!wanted.length || wanted.includes(d)));
if (!sites.length) { console.error('Aucun site correspondant dans dist/.'); process.exit(1); }

function serve(slug, port) {
  const root = join(DIST, slug);
  const notFoundPath = join(root, '404.html');
  const server = createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let f = join(root, pathname);
    if (existsSync(f) && statSync(f).isDirectory()) f = existsSync(join(f, 'index.html')) || !existsSync(`${f}.html`) ? join(f, 'index.html') : `${f}.html`; // /audit + /audit/merci : audit.html a cote du dossier audit/ (pages sur mesure)
    if (!existsSync(f) && existsSync(f + '.html')) f = f + '.html';
    // Applique dist/<slug>/_headers (CSP comprise) comme Cloudflare Pages le ferait en prod — utile
    // pour tester la CSP en local avant deploiement (voir scripts/ff/headers-file.mjs), et pour que
    // `ff sante http://localhost:PORT` voie le vrai Cache-Control de /_astro/*.
    const headerLines = headersForPath(loadHeadersRules(root), pathname);
    if (!existsSync(f)) {
      // Chemin inconnu : Cloudflare Pages sert 404.html avec un vrai statut 404 (pas 200) — voir
      // tests/sante.test.mjs, dont le petit serveur local reproduit deja ce comportement, et
      // docs/veille/repetition-generale.md (friction #3 : `ff sante http://localhost:PORT` voyait un
      // faux `/404 repond 200`).
      const headers = { 'Content-Type': 'text/html; charset=utf-8', ...Object.fromEntries(headerLines) };
      if (existsSync(notFoundPath)) { res.writeHead(404, headers); return res.end(readFileSync(notFoundPath)); }
      res.writeHead(404, headers);
      return res.end('404');
    }
    // Cloudflare Pages repond aussi 404 sur /404 lui-meme (c'est LA page 404, pas une page normale a 200).
    const statut = pathname === '/404' ? 404 : 200;
    res.writeHead(statut, { 'Content-Type': types[extname(f)] ?? 'application/octet-stream', ...Object.fromEntries(headerLines) });
    res.end(readFileSync(f));
  });
  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') serve(slug, port + 1);
    else { console.error(`${slug} : ${e.message}`); }
  });
  server.listen(port, () => console.log(`  http://localhost:${port}  ${slug}`));
}

console.log('Sites servis (Ctrl+C pour arreter) :');
let port = 8001;
for (const slug of sites) serve(slug, port++);
