// Garde « données de test » avant mise en ligne (scripts/ff/garde-donnees.mjs) : utilisée par
// `ff verifier`, `ff deploy` et `ff vercel`. Fonctions pures, sans build.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { controlerDonneesTest, estSiteDemo, garderDonneesTest, RE_TEL_TEST, RE_CP_TEST } from '../scripts/ff/garde-donnees.mjs';

const ML_OK = { chemin: 'mentions-legales.html', html: '<main><p>SIRET : 123 456 789 00012</p></main>' };
const echecs = (checks) => checks.filter((c) => !c.pass).map((c) => c.label);

test('RE_TEL_TEST : 06 00 00 00 00 sous toutes ses formes', () => {
  for (const s of ['06 00 00 00 00', '0600000000', '06.00.00.00.00', '06-00-00-00-00', '+33600000000', '+33 6 00 00 00 00', '+33 (0)6 00 00 00 00', '0033600000000', 'wa.me/33600000000', 'tel:+33600000000', '06 00 00 00 00']) {
    assert.match(s, RE_TEL_TEST, s);
  }
});

test('RE_TEL_TEST : un vrai numéro ou un nombre voisin ne déclenche rien', () => {
  for (const s of ['06 39 98 50 65', '+33639985065', '0600000001', '106000000000', '06 00 00 00 001', '0,6000']) {
    assert.doesNotMatch(s, RE_TEL_TEST, s);
  }
});

test('RE_CP_TEST : 75000 comme code postal, pas comme montant', () => {
  assert.match('12 rue X, 75000 Paris', RE_CP_TEST);
  assert.doesNotMatch('75011 Paris', RE_CP_TEST);
  assert.doesNotMatch('budget 75000 €', RE_CP_TEST);
  assert.doesNotMatch('175000', RE_CP_TEST);
});

test('controlerDonneesTest : tel: dans un attribut compte, géométrie SVG et CSS non', () => {
  const pages = [
    { chemin: 'index.html', html: '<a href="tel:+33600000000">Appeler</a>' },
    { chemin: 'a.html', html: '<style>.x{opacity:0.600000000}</style><svg><path d="M0 6 0 0 0 0 0 0 0 0"/></svg>' },
    ML_OK,
  ];
  const e = echecs(controlerDonneesTest(pages));
  assert.equal(e.length, 1);
  assert.match(e[0], /Téléphone de test.*index\.html/);
  assert.doesNotMatch(e[0], /a\.html/);
});

test('controlerDonneesTest : 75000 visible ou dans le JSON-LD échoue', () => {
  const vis = echecs(controlerDonneesTest([{ chemin: 'index.html', html: '<p>1 rue X, 75000 Paris</p>' }, ML_OK]));
  assert.ok(vis.some((l) => /75000.*index\.html/.test(l)));
  const ld = echecs(controlerDonneesTest([{ chemin: 'index.html', html: '<script type="application/ld+json">{"postalCode":"75000"}</script>' }, ML_OK]));
  assert.ok(ld.some((l) => /75000/.test(l)));
});

test('controlerDonneesTest : mentions légales sans identité échouent, SIRET/RCS ou « en cours de création » passent', () => {
  const vide = { chemin: 'mentions-legales.html', html: '<main><h1>Mentions légales</h1><p>Hébergement : Cloudflare</p></main>' };
  assert.ok(echecs(controlerDonneesTest([vide])).some((l) => /Mentions légales sans identité/.test(l)));
  const enCours = { chemin: 'mentions-legales.html', html: '<p>La société X est en cours de création.</p>' };
  assert.deepEqual(echecs(controlerDonneesTest([enCours])), []);
  assert.deepEqual(echecs(controlerDonneesTest([{ chemin: 'mentions-legales.html', html: '<p>RCS Lille 123</p>' }])), []);
  assert.deepEqual(echecs(controlerDonneesTest([ML_OK])), []);
  assert.ok(echecs(controlerDonneesTest([{ chemin: 'index.html', html: '<p>x</p>' }])).some((l) => /Mentions légales absentes/.test(l)));
});

test('estSiteDemo : préfixes _ et demo-, en-tête DEMO de site.config.ts', () => {
  assert.equal(estSiteDemo('_exemple'), true);
  assert.equal(estSiteDemo('demo-boulangerie'), true);
  assert.equal(estSiteDemo('forge-delacroix', '// DEMO : client inventé\nimport x'), true);
  assert.equal(estSiteDemo('menuiserie-vasseur', "import { defineSite } from '@/lib/schema';\n"), false);
  // « DEMO » loin dans le fichier (texte d'un champ) ne suffit pas.
  assert.equal(estSiteDemo('client', `${'\n'.repeat(20)}// DEMO`), false);
});

test('garderDonneesTest : bloquant pour un client, simple avertissement pour une démo', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ff-garde-'));
  try {
    const dist = path.join(tmp, 'dist');
    const sites = path.join(tmp, 'sites');
    fs.mkdirSync(dist, { recursive: true });
    fs.writeFileSync(path.join(dist, 'index.html'), '<p>06 00 00 00 00</p>');
    fs.writeFileSync(path.join(dist, 'mentions-legales.html'), '<p>Mentions</p>');
    for (const [slug, entete] of [['client-x', '// client réel\n'], ['vitrine-y', '// DEMO : client inventé\n']]) {
      fs.mkdirSync(path.join(sites, slug), { recursive: true });
      fs.writeFileSync(path.join(sites, slug, 'site.config.ts'), entete);
    }
    const client = garderDonneesTest({ slug: 'client-x', distDir: dist, sitesDir: sites });
    assert.equal(client.ok, false);
    assert.equal(client.demo, false);
    assert.equal(echecs(client.checks).length, 2);
    const demo = garderDonneesTest({ slug: 'vitrine-y', distDir: dist, sitesDir: sites });
    assert.equal(demo.ok, true);
    assert.equal(demo.demo, true);
    assert.deepEqual(echecs(demo.checks), []);
    assert.equal(demo.warnings.length, 2);
    assert.ok(demo.warnings.every((w) => /non bloquant/.test(w)));
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
