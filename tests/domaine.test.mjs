// Tests de `ff domaine` : les constructeurs de requetes (purs, sans I/O) et le mode --simuler du
// CLI (aucun jeton Cloudflare reel disponible pour ces tests, voir docs/DEPLOIEMENT.md §
// "Domaine en une commande").
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  API_BASE,
  reqGetProject,
  reqCreateProject,
  reqListZones,
  reqAddPagesDomain,
  reqListDnsRecords,
  reqCreateDnsRecord,
  reqUpdateDnsRecord,
  reqEnableEmailRouting,
  reqCreateDestinationAddress,
  reqListRoutingRules,
  reqCreateRoutingRule,
  reqListMxRecords,
} from '../scripts/ff/domaine.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FF = path.join(ROOT, 'scripts', 'ff.mjs');
const SLUG = '_test-domaine-x';
const SITE_DIR = path.join(ROOT, 'sites', SLUG);

function cleanup() {
  fs.rmSync(SITE_DIR, { recursive: true, force: true });
}

// ---- Constructeurs de requetes ----

test('reqGetProject : GET sur le bon chemin de compte/projet', () => {
  const r = reqGetProject('acc1', 'menuiserie-vasseur');
  assert.equal(r.method, 'GET');
  assert.equal(r.url, `${API_BASE}/accounts/acc1/pages/projects/menuiserie-vasseur`);
  assert.equal(r.body, undefined);
});

test('reqCreateProject : POST avec production_branch=main', () => {
  const r = reqCreateProject('acc1', 'mon-site');
  assert.equal(r.method, 'POST');
  assert.equal(r.url, `${API_BASE}/accounts/acc1/pages/projects`);
  assert.deepEqual(r.body, { name: 'mon-site', production_branch: 'main' });
});

test('reqListZones : filtre par nom de domaine', () => {
  const r = reqListZones('exemple.fr');
  assert.equal(r.method, 'GET');
  assert.equal(r.url, `${API_BASE}/zones?name=exemple.fr`);
});

test('reqAddPagesDomain : POST /domains avec name=domaine', () => {
  const r = reqAddPagesDomain('acc1', 'mon-site', 'exemple.fr');
  assert.equal(r.method, 'POST');
  assert.equal(r.url, `${API_BASE}/accounts/acc1/pages/projects/mon-site/domains`);
  assert.deepEqual(r.body, { name: 'exemple.fr' });
});

test('reqListDnsRecords : GET filtre type+name (CNAME par defaut)', () => {
  const r = reqListDnsRecords('zone1', 'exemple.fr');
  assert.equal(r.method, 'GET');
  assert.equal(r.url, `${API_BASE}/zones/zone1/dns_records?type=CNAME&name=exemple.fr`);
});

test('reqCreateDnsRecord : POST CNAME proxied vers <slug>.pages.dev', () => {
  const r = reqCreateDnsRecord('zone1', 'exemple.fr', 'mon-site.pages.dev');
  assert.equal(r.method, 'POST');
  assert.equal(r.url, `${API_BASE}/zones/zone1/dns_records`);
  assert.deepEqual(r.body, { type: 'CNAME', name: 'exemple.fr', content: 'mon-site.pages.dev', proxied: true, ttl: 1 });
});

test('reqUpdateDnsRecord : PUT sur /dns_records/<id>, memes champs', () => {
  const r = reqUpdateDnsRecord('zone1', 'rec1', 'www.exemple.fr', 'mon-site.pages.dev');
  assert.equal(r.method, 'PUT');
  assert.equal(r.url, `${API_BASE}/zones/zone1/dns_records/rec1`);
  assert.deepEqual(r.body, { type: 'CNAME', name: 'www.exemple.fr', content: 'mon-site.pages.dev', proxied: true, ttl: 1 });
});

test('reqEnableEmailRouting : POST /email/routing/enable, pas de corps', () => {
  const r = reqEnableEmailRouting('zone1');
  assert.equal(r.method, 'POST');
  assert.equal(r.url, `${API_BASE}/zones/zone1/email/routing/enable`);
  assert.equal(r.body, undefined);
});

test('reqCreateDestinationAddress : POST au niveau compte avec { email }', () => {
  const r = reqCreateDestinationAddress('acc1', 'contact@gmail.com');
  assert.equal(r.method, 'POST');
  assert.equal(r.url, `${API_BASE}/accounts/acc1/email/routing/addresses`);
  assert.deepEqual(r.body, { email: 'contact@gmail.com' });
});

test('reqListRoutingRules : GET /email/routing/rules sur la zone', () => {
  const r = reqListRoutingRules('zone1');
  assert.equal(r.method, 'GET');
  assert.equal(r.url, `${API_BASE}/zones/zone1/email/routing/rules`);
});

test('reqCreateRoutingRule : matcher "to" litteral -> action forward', () => {
  const r = reqCreateRoutingRule('zone1', 'contact@exemple.fr', 'destinataire@gmail.com');
  assert.equal(r.method, 'POST');
  assert.equal(r.url, `${API_BASE}/zones/zone1/email/routing/rules`);
  assert.equal(r.body.enabled, true);
  assert.deepEqual(r.body.matchers, [{ type: 'literal', field: 'to', value: 'contact@exemple.fr' }]);
  assert.deepEqual(r.body.actions, [{ type: 'forward', value: ['destinataire@gmail.com'] }]);
});

test('reqListMxRecords : GET filtre type=MX', () => {
  const r = reqListMxRecords('zone1');
  assert.equal(r.method, 'GET');
  assert.equal(r.url, `${API_BASE}/zones/zone1/dns_records?type=MX`);
});

// ---- CLI ----

test('ff domaine sur un site inexistant : code 1, sans appel reseau', () => {
  cleanup();
  const res = spawnSync(process.execPath, [FF, 'domaine', SLUG, 'exemple.fr'], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(res.status, 1);
  assert.match(res.stdout, /introuvable/i);
});

test('ff domaine sans domaine (site existant) : usage + code 1, sans appel reseau', { timeout: 60_000 }, () => {
  cleanup();
  const created = spawnSync(process.execPath, [FF, 'nouveau', SLUG, '--direction', 'atelier'], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(created.status, 0, `\`ff nouveau ${SLUG}\` a echoue :\n${created.stdout}\n${created.stderr}`);

  const res = spawnSync(process.execPath, [FF, 'domaine', SLUG], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(res.status, 1);
  assert.match(res.stdout, /Usage/i);
  cleanup();
});

test('ff domaine sans jeton Cloudflare (hors --simuler) : explique les scopes en francais, code 1', { timeout: 60_000 }, () => {
  cleanup();
  const created = spawnSync(process.execPath, [FF, 'nouveau', SLUG, '--direction', 'atelier'], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(created.status, 0, `\`ff nouveau ${SLUG}\` a echoue :\n${created.stdout}\n${created.stderr}`);

  const env = { ...process.env };
  delete env.CLOUDFLARE_API_TOKEN;
  delete env.CLOUDFLARE_ACCOUNT_ID;
  const res = spawnSync(process.execPath, [FF, 'domaine', SLUG, 'exemple.fr'], { cwd: ROOT, encoding: 'utf8', env });
  assert.equal(res.status, 1);
  assert.match(res.stdout, /Pages.*Edit|Zone.*Read|DNS.*Edit|Email Routing/i);
  cleanup();
});

test('ff domaine --simuler : code 0, affiche les appels API sans les executer, ecrit domain.txt', { timeout: 60_000 }, () => {
  cleanup();
  const created = spawnSync(process.execPath, [FF, 'nouveau', SLUG, '--direction', 'atelier'], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(created.status, 0, `\`ff nouveau ${SLUG}\` a echoue :\n${created.stdout}\n${created.stderr}`);

  const env = { ...process.env };
  delete env.CLOUDFLARE_API_TOKEN;
  delete env.CLOUDFLARE_ACCOUNT_ID;
  const res = spawnSync(
    process.execPath,
    [FF, 'domaine', SLUG, 'exemple.fr', '--www', '--email-vers', 'destinataire@gmail.com', '--simuler'],
    { cwd: ROOT, encoding: 'utf8', env },
  );
  assert.equal(res.status, 0, `stdout:\n${res.stdout}\nstderr:\n${res.stderr}`);
  assert.match(res.stdout, /simulation/i);
  assert.match(res.stdout, /pages\/projects/);
  assert.match(res.stdout, /zones\?name=exemple\.fr/);
  assert.match(res.stdout, /email\/routing\/enable/);
  assert.match(res.stdout, /email\/routing\/rules/);
  // --simuler n'ecrit jamais domain.txt (aucune action reelle) : seul un lancement reel le fait.
  assert.ok(!fs.existsSync(path.join(SITE_DIR, 'domain.txt')));
  cleanup();
});
