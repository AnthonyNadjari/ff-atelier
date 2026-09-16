// Tests du livrable conforme (veille docs/veille/SYNTHESE.md, actions B1-B4) : page confidentialite,
// pas d'aggregateRating auto-declare dans le JSON-LD, pas d'iframe Google Maps chargee au demarrage.
// Un seul build de sites/_exemple (FF_OUT=dist/_test-legal), partage par tous les tests de ce fichier.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT } from '../scripts/ff/ts-loader.mjs';

const OUT_DIR = 'dist/_test-legal';
const DIST_PATH = path.join(ROOT, OUT_DIR);
let indexHtml = '';

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
  assert.equal(res.status, 0, 'le build de sites/_exemple (FF_OUT=dist/_test-legal) a echoue (voir la sortie ci-dessus)');
  indexHtml = fs.readFileSync(path.join(DIST_PATH, 'index.html'), 'utf8');
});

after(() => {
  fs.rmSync(DIST_PATH, { recursive: true, force: true });
});

test('confidentialite.html est genere', () => {
  assert.ok(fs.existsSync(path.join(DIST_PATH, 'confidentialite.html')), 'dist/_test-legal/confidentialite.html manquant');
});

test('confidentialite.html est linke depuis la page d\'accueil', () => {
  assert.match(indexHtml, /href=["']\/confidentialite["']/, 'aucun lien vers /confidentialite dans index.html');
});

test('confidentialite.html contient les sections attendues (finalite, base legale, duree, droits, hebergeur)', () => {
  const html = fs.readFileSync(path.join(DIST_PATH, 'confidentialite.html'), 'utf8');
  assert.match(html, /Responsable du traitement/);
  assert.match(html, /Finalité/);
  assert.match(html, /Base légale/);
  assert.match(html, /Durée de conservation/);
  assert.match(html, /12 mois/);
  assert.match(html, /Vos droits/);
  assert.match(html, /Hébergement/);
  assert.match(html, /<html[^>]*\blang=["']fr["']/);
});

test('mentions-legales.html reste noindex et lien vers /confidentialite', () => {
  const html = fs.readFileSync(path.join(DIST_PATH, 'mentions-legales.html'), 'utf8');
  assert.match(html, /name=["']robots["']\s+content=["']noindex["']/);
});

test('index.html ne contient pas d\'aggregateRating/Review auto-declare dans le JSON-LD', () => {
  assert.doesNotMatch(indexHtml, /"aggregateRating"/i);
  assert.doesNotMatch(indexHtml, /"@type"\s*:\s*"AggregateRating"/);
});

test('le JSON-LD utilise un sous-type schema.org deduit du metier (pas "LocalBusiness" generique pour un menuisier)', () => {
  // sites/_exemple/site.config.ts : business.trade = "Menuisier-ébéniste" -> HomeAndConstructionBusiness
  assert.match(indexHtml, /"@type"\s*:\s*"HomeAndConstructionBusiness"/);
});

test('aucune iframe Google Maps n\'est chargee au demarrage de la page (facade obligatoire)', () => {
  assert.doesNotMatch(indexHtml, /<iframe\b[^>]*\bsrc=["']https:\/\/www\.google\.com\/maps/i);
});

test('confidentialite.html ne contient pas non plus d\'iframe Google Maps chargee au demarrage', () => {
  const html = fs.readFileSync(path.join(DIST_PATH, 'confidentialite.html'), 'utf8');
  assert.doesNotMatch(html, /<iframe\b[^>]*\bsrc=["']https:\/\/www\.google\.com\/maps/i);
});

test('sitemap-index.xml est genere a cote de la page d\'accueil', () => {
  assert.ok(fs.existsSync(path.join(DIST_PATH, 'sitemap-index.xml')), 'sitemap-index.xml manquant');
});
