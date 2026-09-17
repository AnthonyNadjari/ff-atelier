// Test du provider de formulaire 'cloudflare' (veille docs/veille/SYNTHESE.md, action B5) :
// copie sites/_exemple vers sites/_test-cf avec form.provider: 'cloudflare', construit via le CLI
// `ff build` (pour exercer l'etape post-build de scripts/ff/dev-build-preview.mjs), verifie que
// dist/_test-cf/_worker.js existe (mode avance Cloudflare Pages Functions, voir
// src/worker/contact.js) et que le formulaire porte bien data-form="cloudflare". Nettoie ensuite
// sites/_test-cf et dist/_test-cf.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT } from '../scripts/ff/ts-loader.mjs';

const SLUG = '_test-cf';
const SITE_DIR = path.join(ROOT, 'sites', SLUG);
const DIST_DIR = path.join(ROOT, 'dist', SLUG);
const FF = path.join(ROOT, 'scripts', 'ff.mjs');

let indexHtml = '';

function cleanup() {
  fs.rmSync(SITE_DIR, { recursive: true, force: true });
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}

before(() => {
  cleanup();
  fs.cpSync(path.join(ROOT, 'sites', '_exemple'), SITE_DIR, { recursive: true });

  const configPath = path.join(SITE_DIR, 'site.config.ts');
  let config = fs.readFileSync(configPath, 'utf8');
  config = config.replace(/slug:\s*'_exemple'/, `slug: '${SLUG}'`).replace(/provider:\s*'mailto'/, "provider: 'cloudflare'");
  assert.match(config, /provider:\s*'cloudflare'/, 'le remplacement du provider a echoue (site.config.ts de _exemple a-t-il change de forme ?)');
  fs.writeFileSync(configPath, config);

  const res = spawnSync(process.execPath, [FF, 'build', SLUG], { cwd: ROOT, encoding: 'utf8', timeout: 120_000 });
  if (res.status !== 0) {
    console.log(res.stdout);
    console.log(res.stderr);
  }
  assert.equal(res.status, 0, `\`ff build ${SLUG}\` a echoue (voir la sortie ci-dessus)`);
  indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');
});

after(cleanup);

test('dist/_test-cf/_worker.js est genere (mode avance Cloudflare Pages Functions)', () => {
  assert.ok(fs.existsSync(path.join(DIST_DIR, '_worker.js')), 'dist/_test-cf/_worker.js manquant');
});

test('_worker.js relaie les assets statiques et gere POST /api/contact', () => {
  const worker = fs.readFileSync(path.join(DIST_DIR, '_worker.js'), 'utf8');
  assert.match(worker, /env\.ASSETS\.fetch\(request\)/);
  assert.match(worker, /\/api\/contact/);
});

test('_worker.js a ses placeholders remplaces par les vraies coordonnees du site', () => {
  const worker = fs.readFileSync(path.join(DIST_DIR, '_worker.js'), 'utf8');
  assert.doesNotMatch(worker, /__FF_DEST_EMAIL__|__FF_FROM_EMAIL__|__FF_FROM_NAME__/, 'placeholder(s) non remplace(s) dans _worker.js');
  assert.match(worker, /contact@exemple\.fr/, "l'adresse de contact.email de _exemple devrait apparaitre comme destinataire");
});

test('le formulaire de la page d\'accueil porte data-form="cloudflare"', () => {
  assert.match(indexHtml, /<form\b[^>]*\bdata-form=["']cloudflare["']/);
});

test('la politique de confidentialite mentionne Cloudflare comme destinataire du formulaire', () => {
  const conf = fs.readFileSync(path.join(DIST_DIR, 'confidentialite.html'), 'utf8');
  assert.match(conf, /Cloudflare/);
});
