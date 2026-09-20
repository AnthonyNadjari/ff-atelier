// Tests de scripts/ff/indexnow.mjs : clé, extraction du sitemap, simulation de soumission.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ensureIndexNowKey, sitemapUrls, submitIndexNow, indexNowForSlug } from '../scripts/ff/indexnow.mjs';
import { SITES_DIR } from '../scripts/ff/util.mjs';

const TMP = path.join(SITES_DIR, '_test-indexnow');

after(() => fs.rmSync(TMP, { recursive: true, force: true }));

function makeSite() {
  fs.mkdirSync(path.join(TMP, 'public'), { recursive: true });
  fs.writeFileSync(path.join(TMP, 'site.config.ts'), '// test');
}

test('ensureIndexNowKey : crée une clé 32 hex + fichier de vérification, idempotent', () => {
  makeSite();
  const a = ensureIndexNowKey('_test-indexnow');
  assert.match(a.key, /^[0-9a-f]{32}$/);
  assert.equal(a.created, true);
  assert.equal(fs.readFileSync(path.join(TMP, 'public', a.file), 'utf8').trim(), a.key);
  const b = ensureIndexNowKey('_test-indexnow');
  assert.equal(b.key, a.key);
  assert.equal(b.created, false);
});

test('sitemapUrls : suit l\'index vers les sitemaps enfants, déduplique', () => {
  const dist = path.join(TMP, 'dist');
  fs.mkdirSync(dist, { recursive: true });
  fs.writeFileSync(
    path.join(dist, 'sitemap-index.xml'),
    '<?xml version="1.0"?><sitemapindex><sitemap><loc>https://ex.fr/sitemap-0.xml</loc></sitemap></sitemapindex>',
  );
  fs.writeFileSync(
    path.join(dist, 'sitemap-0.xml'),
    '<urlset><url><loc>https://ex.fr/</loc></url><url><loc>https://ex.fr/services/x</loc></url><url><loc>https://ex.fr/</loc></url></urlset>',
  );
  assert.deepEqual(sitemapUrls(dist), ['https://ex.fr/', 'https://ex.fr/services/x']);
  assert.deepEqual(sitemapUrls(path.join(TMP, 'absent')), []);
});

test('submitIndexNow --simuler : décrit l\'appel sans rien envoyer', async () => {
  const r = await submitIndexNow({ host: 'ex.fr', key: 'a'.repeat(32), urls: ['https://ex.fr/'], simuler: true });
  assert.equal(r.ok, true);
  assert.match(r.detail, /api\.indexnow\.org/);
  assert.match(r.detail, /indexnow-a{32}\.txt/);
});

test('indexNowForSlug : ignoré sans domaine, complet avec domaine + sitemap', async () => {
  fs.rmSync(path.join(TMP, 'domain.txt'), { force: true });
  const sansDomaine = await indexNowForSlug('_test-indexnow');
  assert.match(sansDomaine.skipped, /domaine/);

  fs.writeFileSync(path.join(TMP, 'domain.txt'), 'ex.fr\n');
  const dist = path.join(TMP, 'dist');
  fs.mkdirSync(dist, { recursive: true });
  fs.writeFileSync(path.join(dist, 'sitemap-index.xml'), '<urlset><url><loc>https://ex.fr/</loc></url></urlset>');
  const r = await indexNowForSlug('_test-indexnow', { simuler: true, distDir: dist });
  assert.equal(r.host, 'ex.fr');
  assert.equal(r.ok, true);
  assert.equal(r.count, 1);
});
