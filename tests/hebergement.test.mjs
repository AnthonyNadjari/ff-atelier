// Tests de scripts/ff/hebergement.mjs (mode d'hébergement Cloudflare : workers par défaut, pages sur demande) et du
// mode --simuler de `ff deploy` (aucun jeton, aucun build : la config wrangler et la commande sont imprimées).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  API_BASE, MODE_PAR_DEFAUT, WRANGLER, ASSETS_IGNORE,
  lireHebergement, ecrireHebergement, choisirMode, hoteParDefaut, configWrangler, commandeWrangler, urlDansSortie,
  reqAttachWorkerDomain, reqListWorkerDomains,
} from '../scripts/ff/hebergement.mjs';
import { preparerWorkers } from '../scripts/ff/deploy.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FF = path.join(ROOT, 'scripts', 'ff.mjs');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'ff-hebergement-'));

after(() => {
  fs.rmSync(TMP, { recursive: true, force: true });
  fs.rmSync(path.join(ROOT, '.ff-tmp', '_exemple'), { recursive: true, force: true });
  fs.rmSync(path.join(ROOT, 'dist', '_exemple', '.assetsignore'), { force: true });
});

test('choisirMode : workers par défaut, le dernier déploiement sinon, le drapeau gagne', () => {
  assert.equal(MODE_PAR_DEFAUT, 'workers');
  assert.equal(choisirMode({}), 'workers');
  assert.equal(choisirMode({ existant: { mode: 'pages' } }), 'pages');
  assert.equal(choisirMode({ flags: { workers: true }, existant: { mode: 'pages' } }), 'workers');
  assert.equal(choisirMode({ flags: { pages: true } }), 'pages');
  assert.throws(() => choisirMode({ flags: { pages: true, workers: true } }), /exclusifs/);
});

test('lireHebergement / ecrireHebergement : aller-retour, fichier absent ou illisible = null', () => {
  assert.equal(lireHebergement('x', TMP), null);
  const f = ecrireHebergement('x', { mode: 'workers', projet: 'x', url: 'https://x.ff.workers.dev', date: '2026-10-22' }, TMP);
  assert.ok(fs.existsSync(f));
  assert.deepEqual(lireHebergement('x', TMP), { mode: 'workers', projet: 'x', url: 'https://x.ff.workers.dev', date: '2026-10-22' });
  fs.writeFileSync(f, '{ pas du json');
  assert.equal(lireHebergement('x', TMP), null);
  fs.writeFileSync(f, JSON.stringify({ mode: 'ftp' }));
  assert.equal(lireHebergement('x', TMP), null, 'un mode inconnu est ignoré');
});

test('hoteParDefaut : hôte du dernier déploiement, sinon <slug>.pages.dev', () => {
  assert.equal(hoteParDefaut('menuiserie', { mode: 'workers', url: 'https://menuiserie.ff.workers.dev' }), 'menuiserie.ff.workers.dev');
  assert.equal(hoteParDefaut('menuiserie', null), 'menuiserie.pages.dev');
  assert.equal(hoteParDefaut('menuiserie', { mode: 'workers', url: 'pas une url' }), 'menuiserie.pages.dev');
});

test('configWrangler : statique pur sans main ; avec Worker : main, binding ASSETS et send_email EMAIL', () => {
  const statique = configWrangler({ projet: 'menuiserie', slug: 'menuiserie' });
  assert.equal(statique.name, 'menuiserie');
  assert.equal(statique.assets.directory, '../../dist/menuiserie');
  assert.equal(statique.assets.html_handling, 'auto-trailing-slash');
  assert.equal(statique.assets.not_found_handling, '404-page');
  assert.equal(statique.main, undefined);
  assert.equal(statique.send_email, undefined);
  assert.match(statique.compatibility_date, /^\d{4}-\d{2}-\d{2}$/);

  const avec = configWrangler({ projet: 'p', slug: 'menuiserie', avecWorker: true });
  assert.equal(avec.main, '../../dist/menuiserie/_worker.js');
  assert.equal(avec.assets.binding, 'ASSETS', 'src/worker/contact.js lit env.ASSETS');
  assert.deepEqual(avec.send_email, [{ name: 'EMAIL' }], 'src/worker/contact.js lit env.EMAIL');
});

test('commandeWrangler : deploy --config en workers, pages deploy en pages, version épinglée', () => {
  assert.match(WRANGLER, /^wrangler@\d+$/);
  assert.deepEqual(commandeWrangler({ mode: 'workers', projet: 'p', slug: 's', configPath: '.ff-tmp/s/wrangler.json' }), [WRANGLER, 'deploy', '--config', '.ff-tmp/s/wrangler.json']);
  assert.deepEqual(commandeWrangler({ mode: 'pages', projet: 'p', slug: 's' }), [WRANGLER, 'pages', 'deploy', 'dist/s', '--project-name', 'p', '--branch', 'main']);
});

test('urlDansSortie : trouve l’URL workers.dev ou pages.dev, null sinon', () => {
  assert.equal(urlDansSortie('Deployed p triggers (1.2 sec)\n  https://p.finck-fisch.workers.dev\nCurrent Version ID: x'), 'https://p.finck-fisch.workers.dev');
  assert.equal(urlDansSortie('✨ Deployment complete! Take a peek over at https://abc123.p.pages.dev'), 'https://abc123.p.pages.dev');
  assert.equal(urlDansSortie('rien'), null);
});

test('reqAttachWorkerDomain / reqListWorkerDomains : PUT idempotent sur workers/domains, GET filtré', () => {
  const put = reqAttachWorkerDomain('acc1', { zoneId: 'z1', hostname: 'exemple.fr', service: 'exemple' });
  assert.equal(put.method, 'PUT');
  assert.equal(put.url, `${API_BASE}/accounts/acc1/workers/domains`);
  assert.deepEqual(put.body, { zone_id: 'z1', hostname: 'exemple.fr', service: 'exemple', environment: 'production' });
  const get = reqListWorkerDomains('acc1', { zoneId: 'z1', hostname: 'exemple.fr' });
  assert.equal(get.method, 'GET');
  assert.equal(get.url, `${API_BASE}/accounts/acc1/workers/domains?zone_id=z1&hostname=exemple.fr`);
  assert.equal(reqListWorkerDomains('acc1').url, `${API_BASE}/accounts/acc1/workers/domains`);
});

test('preparerWorkers : écrit .ff-tmp/<slug>/wrangler.json et dist/<slug>/.assetsignore (le Worker n’est pas servi)', () => {
  const distDir = path.join(TMP, 'dist-x');
  fs.mkdirSync(distDir, { recursive: true });
  fs.writeFileSync(path.join(distDir, '_worker.js'), 'export default {}');
  const { cfg, configPath, avecWorker } = preparerWorkers({ slug: '_test-hebergement-x', projet: 'p', distDir });
  assert.equal(avecWorker, true);
  assert.equal(cfg.main, '../../dist/_test-hebergement-x/_worker.js');
  assert.equal(configPath, '.ff-tmp/_test-hebergement-x/wrangler.json');
  assert.ok(fs.existsSync(path.join(ROOT, configPath)));
  const ignore = fs.readFileSync(path.join(distDir, '.assetsignore'), 'utf8').split('\n').filter(Boolean);
  assert.deepEqual(ignore, ASSETS_IGNORE);
  assert.ok(ignore.includes('_worker.js'));
  fs.rmSync(path.join(ROOT, '.ff-tmp', '_test-hebergement-x'), { recursive: true, force: true });
});

test('ff deploy --simuler : sans jeton ni build, imprime le mode workers, la config et la commande', () => {
  const r = spawnSync(process.execPath, [FF, 'deploy', '_exemple', '--simuler'], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /mode workers/);
  assert.match(r.stdout, /\.ff-tmp\/_exemple\/wrangler\.json/);
  assert.match(r.stdout, new RegExp(`npx -y ${WRANGLER} deploy --config`));
  assert.match(r.stdout, /hebergement\.json/);
  const p = spawnSync(process.execPath, [FF, 'deploy', '_exemple', '--simuler', '--pages'], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(p.status, 0, p.stderr);
  assert.match(p.stdout, /mode pages/);
  assert.match(p.stdout, /pages deploy dist\/_exemple --project-name _exemple/);
});

test('ff domaine --simuler : mode workers par défaut (domaine attaché au Worker, aucun CNAME)', () => {
  const r = spawnSync(process.execPath, [FF, 'domaine', '_exemple', 'exemple-simule.fr', '--simuler', '--www'], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /mode workers/);
  assert.match(r.stdout, /workers\/domains/);
  assert.doesNotMatch(r.stdout, /dns_records/, 'en workers, Cloudflare pose le DNS lui-même');
  assert.match(r.stdout, /www\.exemple-simule\.fr/);
  assert.ok(!fs.existsSync(path.join(ROOT, 'sites', '_exemple', 'domain.txt')), 'la simulation n’écrit pas domain.txt');
});

test('ff liste, etatEnLigne : domaine ou URL du déploiement, mode et date, « livre » si dans sites-en-ligne.json', async () => {
  const { etatEnLigne } = await import('../scripts/ff/liste.mjs');
  const sitesDir = path.join(TMP, 'sites');
  fs.mkdirSync(path.join(sitesDir, 'a'), { recursive: true });
  assert.equal(etatEnLigne('a', { sitesDir }), '');
  ecrireHebergement('a', { mode: 'workers', projet: 'a', url: 'https://a.ff.workers.dev', date: '2026-10-22' }, sitesDir);
  assert.equal(etatEnLigne('a', { sitesDir }), 'a.ff.workers.dev · workers 2026-10-22');
  fs.writeFileSync(path.join(sitesDir, 'a', 'domain.txt'), 'exemple.fr\n');
  assert.equal(etatEnLigne('a', { sitesDir, livres: ['a'] }), 'exemple.fr · workers 2026-10-22 · livre');
});
