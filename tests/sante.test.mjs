// Tests de `ff sante` (scripts/ff/sante.mjs) : construit sites/_exemple (FF_OUT=dist/_test-sante),
// le sert sur un port ephemere avec un petit serveur qui imite le comportement Cloudflare Pages
// pertinent pour les checks (404.html servi avec un vrai statut 404, en-tetes de dist/_test-sante/
// _headers appliques — voir astro.config.mjs, integration `ff-headers`), puis appelle directement
// runSante() (fonction exportee, memes checks que `ff sante <url>` en CLI) contre
// http://localhost:<port>. La cible etant localhost, TLS/RDAP/DNS sont ignores par runSante lui-meme
// (voir sante.mjs) : ce test ne couvre donc que les checks HTTP/HTML.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from '../scripts/ff/ts-loader.mjs';
import { runSante } from '../scripts/ff/sante.mjs';

const OUT_DIR = 'dist/_test-sante';
const DIST_PATH = path.join(ROOT, OUT_DIR);

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2',
  '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json',
};

/** Parse dist/_test-sante/_headers (format Cloudflare Pages : bloc "pattern\n  Header: valeur\n...",
 * blocs separes par une ligne vide) en une liste de { match(pathname), headers }. */
function parseHeadersFile(distDir) {
  const p = path.join(distDir, '_headers');
  if (!fs.existsSync(p)) return [];
  const blocs = fs.readFileSync(p, 'utf8').split(/\r?\n\r?\n/).filter((b) => b.trim());
  return blocs.map((bloc) => {
    const lignes = bloc.split(/\r?\n/).filter((l) => l.trim());
    const pattern = lignes[0].trim();
    const headers = {};
    for (const l of lignes.slice(1)) {
      const i = l.indexOf(':');
      if (i === -1) continue;
      headers[l.slice(0, i).trim().toLowerCase()] = l.slice(i + 1).trim();
    }
    let match;
    if (pattern === '/*') match = () => true;
    else if (pattern.endsWith('/*')) { const prefix = pattern.slice(0, -1); match = (p2) => p2.startsWith(prefix); }
    else if (pattern.startsWith('/*.')) { const ext = pattern.slice(2); match = (p2) => p2.endsWith(ext); }
    else match = (p2) => p2 === pattern;
    return { match, headers };
  });
}

let server;
let port;

before(() => {
  const astroJs = path.join(ROOT, 'node_modules', 'astro', 'astro.js');
  const res = spawnSync(process.execPath, [astroJs, 'build'], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 120_000,
    env: { ...process.env, SITE: '_exemple', FF_OUT: OUT_DIR },
  });
  if (res.status !== 0) {
    console.log(res.stdout);
    console.log(res.stderr);
  }
  assert.equal(res.status, 0, 'le build de sites/_exemple (FF_OUT=dist/_test-sante) a echoue (voir la sortie ci-dessus)');

  const regles = parseHeadersFile(DIST_PATH);
  const notFoundPath = path.join(DIST_PATH, '404.html');

  server = createServer((req, res2) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let f = path.join(DIST_PATH, pathname);
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f) && fs.existsSync(`${f}.html`)) f = `${f}.html`;

    const headersPour = (p2) => {
      const h = {};
      for (const regle of regles) if (regle.match(p2)) Object.assign(h, regle.headers);
      return h;
    };

    if (!fs.existsSync(f)) {
      const h = { 'Content-Type': 'text/html; charset=utf-8', ...headersPour('/404.html') };
      if (fs.existsSync(notFoundPath)) {
        res2.writeHead(404, h);
        res2.end(fs.readFileSync(notFoundPath));
      } else {
        res2.writeHead(404);
        res2.end();
      }
      return;
    }
    // Cloudflare Pages repond 404 sur /404 lui-meme (pas seulement sur les routes inconnues) :
    // c'est la page 404, pas une page "normale" a 200.
    const statut = pathname === '/404' ? 404 : 200;
    const h = { 'Content-Type': MIME[path.extname(f)] ?? 'application/octet-stream', ...headersPour(pathname) };
    res2.writeHead(statut, h);
    res2.end(fs.readFileSync(f));
  }).listen(0);
  port = server.address().port;
});

after(() => {
  server?.close();
  fs.rmSync(DIST_PATH, { recursive: true, force: true });
});

test('ff sante : les checks attendus passent sur un build local servi en http', { timeout: 60_000 }, async () => {
  const { checks, warnings } = await runSante(`http://localhost:${port}`, { slug: '_exemple' });

  assert.ok(Array.isArray(checks) && checks.length > 0, 'runSante devrait renvoyer des checks');
  assert.ok(Array.isArray(warnings), 'runSante devrait renvoyer un tableau warnings (meme vide)');

  const parLabel = (re) => checks.find((c) => re.test(c.label));

  for (const re of [/^\/ repond 200/, /sitemap-index\.xml repond 200/, /<title> present/, /JSON-LD present/]) {
    const chk = parLabel(re);
    assert.ok(chk, `aucun check ne correspond a ${re} — checks : ${JSON.stringify(checks, null, 2)}`);
    assert.equal(chk.pass, true, `check attendu en ✓ mais en ✗ : "${chk.label}"`);
  }

  const chk404 = parLabel(/Page \/404 repond bien 404/);
  assert.ok(chk404, `le check /404 est absent — checks : ${JSON.stringify(checks, null, 2)}`);
  assert.equal(chk404.pass, true, `le check /404 devrait passer : "${chk404.label}"`);

  // Cible locale : TLS/RDAP/DNS annonces comme ignores, jamais tentes.
  assert.ok(
    warnings.some((w) => /localhost.*TLS.*RDAP.*DNS|TLS.*RDAP.*DNS.*ignor/i.test(w)),
    `un avertissement devrait signaler que TLS/RDAP/DNS sont ignores en local — warnings : ${JSON.stringify(warnings)}`,
  );
});
