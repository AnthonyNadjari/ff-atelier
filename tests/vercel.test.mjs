// `ff vercel` (scripts/ff/vercel.mjs) : conversion _headers (format Cloudflare) -> vercel.json, lecture
// des identifiants ; et découpe en tuiles de `ff tuiles` (scripts/ff/tuiles.mjs). Fonctions pures.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { headersVersVercel, motifVersSourceVercel, lireIdsVercel, ecrireConfigVercel, VERCELIGNORE } from '../scripts/ff/vercel.mjs';
import { decouperTuiles, hauteurSortie, MODES_TUILES, HAUTEUR_TUILE_MAX } from '../scripts/ff/tuiles.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const HEADERS = [
  '/_astro/*',
  '  Cache-Control: public, max-age=31536000, immutable',
  '',
  '/*.html',
  '  Cache-Control: public, max-age=0, must-revalidate',
  '',
  '/*',
  '  X-Content-Type-Options: nosniff',
  "  Content-Security-Policy: default-src 'self'; img-src 'self' data:",
  '',
].join('\n');

test('motifVersSourceVercel : * -> :path*', () => {
  assert.equal(motifVersSourceVercel('/*'), '/:path*');
  assert.equal(motifVersSourceVercel('/_astro/*'), '/_astro/:path*');
  assert.equal(motifVersSourceVercel('/*.html'), '/:path*.html');
  assert.equal(motifVersSourceVercel('/robots.txt'), '/robots.txt');
});

test('headersVersVercel : cleanUrls toujours vrai, en-têtes convertis, valeurs avec « : » intactes', () => {
  const v = headersVersVercel(HEADERS);
  assert.equal(v.cleanUrls, true);
  assert.equal(v.redirects, undefined);
  assert.deepEqual(v.headers.map((h) => h.source), ['/_astro/:path*', '/:path*.html', '/:path*']);
  assert.deepEqual(v.headers[0].headers, [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]);
  assert.deepEqual(v.headers[2].headers[1], { key: 'Content-Security-Policy', value: "default-src 'self'; img-src 'self' data:" });
});

test('headersVersVercel : redirections (objet redirects.json ou tableau) reprises telles quelles', () => {
  const r = [{ source: '/services/:slug*', destination: '/audit', statusCode: 301 }];
  assert.deepEqual(headersVersVercel(HEADERS, { redirects: r }).redirects, r);
  assert.deepEqual(headersVersVercel('', r), { cleanUrls: true, headers: [], redirects: r });
});

test('lireIdsVercel : env complet, sinon sites/<slug>/vercel-projet.json, sinon null', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ff-vercel-'));
  try {
    const env = { VERCEL_ORG_ID: 'team_a', VERCEL_PROJECT_ID: 'prj_b' };
    assert.deepEqual(lireIdsVercel('x', { env: (k) => env[k], sitesDir: tmp }), { orgId: 'team_a', projectId: 'prj_b', source: 'environnement' });
    assert.equal(lireIdsVercel('x', { env: () => '', sitesDir: tmp }), null);
    fs.mkdirSync(path.join(tmp, 'x'));
    fs.writeFileSync(path.join(tmp, 'x', 'vercel-projet.json'), JSON.stringify({ orgId: 'team_c', projectId: 'prj_d' }));
    // Une seule des deux variables d'environnement : on ne mélange pas, le fichier gagne.
    assert.equal(lireIdsVercel('x', { env: (k) => (k === 'VERCEL_ORG_ID' ? 'team_a' : ''), sitesDir: tmp }).projectId, 'prj_d');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('ecrireConfigVercel : vercel.json + .vercelignore (qui exclut _headers et .env)', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ff-vercel-'));
  try {
    const dist = path.join(tmp, 'dist');
    fs.mkdirSync(dist);
    fs.writeFileSync(path.join(dist, '_headers'), HEADERS);
    fs.mkdirSync(path.join(tmp, 'sites', 's'), { recursive: true });
    fs.writeFileSync(path.join(tmp, 'sites', 's', 'redirects.json'), JSON.stringify({ redirects: [{ source: '/a', destination: '/b', statusCode: 301 }] }));
    ecrireConfigVercel(dist, 's', path.join(tmp, 'sites'));
    const v = JSON.parse(fs.readFileSync(path.join(dist, 'vercel.json'), 'utf8'));
    assert.equal(v.cleanUrls, true);
    assert.equal(v.headers.length, 3);
    assert.equal(v.redirects[0].destination, '/b');
    assert.equal(fs.readFileSync(path.join(dist, '.vercelignore'), 'utf8'), VERCELIGNORE);
    assert.match(VERCELIGNORE, /^_headers$/m);
    assert.match(VERCELIGNORE, /^\.env/m);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('decouperTuiles : bandes égales, contiguës, reste abandonné', () => {
  assert.deepEqual(decouperTuiles(4003, 4), [
    { top: 0, height: 1000 }, { top: 1000, height: 1000 }, { top: 2000, height: 1000 }, { top: 3000, height: 1000 },
  ]);
  assert.throws(() => decouperTuiles(3, 4));
});

test('tuiles par défaut (3 écrans, 4 tuiles) : sous la limite de texture iOS en mobile et desktop', () => {
  for (const M of Object.values(MODES_TUILES)) {
    const h = hauteurSortie(M, M.vh * 3);
    assert.ok(decouperTuiles(h, 4)[0].height <= HAUTEUR_TUILE_MAX, `${M.vw}px : tuile de ${h / 4} px`);
  }
  assert.equal(hauteurSortie(MODES_TUILES.d, 900 * 3), 3000);
});

test('ff aide documente vercel et tuiles', () => {
  const res = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'ff.mjs'), 'aide'], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(res.status, 0);
  assert.match(res.stdout, /vercel <slug>/);
  assert.match(res.stdout, /cleanUrls/);
  assert.match(res.stdout, /tuiles <slug>/);
});
