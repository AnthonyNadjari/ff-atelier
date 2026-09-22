// Tests de l'attribution photo visible (docs/veille/redaction-images.md §2) :
//  1. parseCredits()/entriesRequiringAttribution() (src/lib/credits.ts, module pur).
//  2. creditsHasEntries()/siteHasCredits() (scripts/astro-credits-integration.mjs, condition de
//     la route injectee) et evaluerCreditsAffiches() (scripts/ff/verifier.mjs, nouveau controle
//     du bloc legal) — fonctions pures, aucun acces disque ni build.
//  3. Deux vrais builds partages par tous les tests de ce fichier : forge-delacroix (CREDITS.md
//     avec CC BY et CC BY-SA -> attribution obligatoire) et _exemple (aucun CREDITS.md -> pas de
//     page, pas de lien, pas d'echec).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, loadCreditsModule, cleanTmp, canImportTs } from '../scripts/ff/ts-loader.mjs';
import { creditsHasEntries, siteHasCredits } from '../scripts/astro-credits-integration.mjs';
import { evaluerCreditsAffiches } from '../scripts/ff/verifier.mjs';

const tsImportable = await canImportTs();
after(() => cleanTmp());

// ---------- 1. parseCredits() / entriesRequiringAttribution() ----------

if (!tsImportable) {
  test('[ignoré] node ne sait pas type-stripper le TS ici', (t) => t.skip());
} else {
  test('parseCredits : bloc complet CC BY-SA (recadre) -> tous les champs, attribution non nulle', async () => {
    const { parseCredits } = await loadCreditsModule();
    const md = [
      '# Crédits',
      '',
      '## raw/hero.jpg -> public/images/hero.webp (via ff images)',
      '- Titre : Vintage smith\'s workshop - 0158',
      '- Auteur : Jorge Royan',
      '- Source : Wikimedia Commons — https://commons.wikimedia.org/wiki/File:Vintage.jpg',
      '- Licence : CC BY-SA 3.0 — CC BY-SA — attribution obligatoire (https://creativecommons.org/licenses/by-sa/3.0)',
      '- Attribution a afficher (obligatoire) : « Photo : Jorge Royan, CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Vintage.jpg » — a poser a la livraison.',
      '- Recadrage : 3:2 (sharp.strategy.attention) — adaptation, la photo recadree reste sous BY-SA',
      '- Date : 2026-09-20',
    ].join('\n');
    const entries = parseCredits(md);
    assert.equal(entries.length, 1);
    const e = entries[0];
    assert.equal(e.target, 'raw/hero.jpg -> public/images/hero.webp (via ff images)');
    assert.equal(e.title, "Vintage smith's workshop - 0158");
    assert.equal(e.author, 'Jorge Royan');
    assert.equal(e.authorUrl, null);
    assert.equal(e.sourceUrl, 'https://commons.wikimedia.org/wiki/File:Vintage.jpg');
    assert.equal(e.licenceLabel, 'CC BY-SA 3.0');
    assert.equal(e.licenceUrl, 'https://creativecommons.org/licenses/by-sa/3.0');
    assert.equal(e.attribution, 'Photo : Jorge Royan, CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Vintage.jpg');
    assert.equal(e.cropped, true);
  });

  test('parseCredits : CC0/domaine public sans ligne "Attribution a afficher" -> attribution null', async () => {
    const { parseCredits, requiresAttribution } = await loadCreditsModule();
    const md = [
      '## raw/galerie-1.jpg -> public/images/galerie-1.webp (via ff images)',
      '- Titre : Wrought iron gate',
      '- Auteur : FF-11',
      '- Source : Wikimedia Commons — https://commons.wikimedia.org/wiki/File:X.jpg',
      '- Licence : CC0 — CC0 1.0 (domaine public, aucune attribution requise) (http://creativecommons.org/publicdomain/zero/1.0/deed.en)',
      '- Recadrage : 4:3 (sharp.strategy.attention) — adaptation',
      '- Date : 2026-09-20',
    ].join('\n');
    const [e] = parseCredits(md);
    assert.equal(e.attribution, null);
    assert.equal(requiresAttribution(e), false);
    assert.equal(e.licenceLabel, 'CC0');
  });

  test('parseCredits : Createur (bloc video) avec URL entre parentheses -> author + authorUrl', async () => {
    const { parseCredits } = await loadCreditsModule();
    const md = '## public/videos/hero (Jane Doe)\n- Createur : Jane Doe (https://pexels.com/@jane)\n- Source : Pexels Videos — https://pexels.com/video/1\n- Licence : Pexels License (https://www.pexels.com/license/) — usage commercial libre, sans attribution obligatoire\n- Date : 2026-09-20';
    const [e] = parseCredits(md);
    assert.equal(e.author, 'Jane Doe');
    assert.equal(e.authorUrl, 'https://pexels.com/@jane');
    assert.equal(e.attribution, null);
  });

  test('parseCredits : plusieurs blocs -> une entree par bloc, dans l\'ordre', async () => {
    const { parseCredits } = await loadCreditsModule();
    const md = '# Crédits\n\n## a\n- Auteur : X\n\n## b\n- Auteur : Y\n\n## c\n- Auteur : Z\n';
    const entries = parseCredits(md);
    assert.deepEqual(entries.map((e) => e.target), ['a', 'b', 'c']);
    assert.deepEqual(entries.map((e) => e.author), ['X', 'Y', 'Z']);
  });

  test('parseCredits : entree vide/absente -> tableau vide, ne leve jamais', async () => {
    const { parseCredits } = await loadCreditsModule();
    assert.deepEqual(parseCredits(''), []);
    assert.deepEqual(parseCredits('# Crédits\n\nAucune photo tierce pour ce site.\n'), []);
  });

  test('entriesRequiringAttribution : filtre exactement les entrees avec une attribution', async () => {
    const { parseCredits, entriesRequiringAttribution } = await loadCreditsModule();
    const md = [
      '## a', '- Auteur : X', '- Licence : CC0 (http://creativecommons.org/publicdomain/zero/1.0/)',
      '', '## b', '- Auteur : Y',
      '- Attribution a afficher (obligatoire) : « Photo : Y, CC BY 2.0, https://x » — a poser.',
    ].join('\n');
    const entries = parseCredits(md);
    const filtered = entriesRequiringAttribution(entries);
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0].target, 'b');
  });

  test('parseCredits sur le vrai CREDITS.md de forge-delacroix : 4 entrees BY/BY-SA, 2 CC0/PD sans attribution', async () => {
    const { parseCredits, entriesRequiringAttribution } = await loadCreditsModule();
    const md = fs.readFileSync(path.join(ROOT, 'sites', 'forge-delacroix', 'CREDITS.md'), 'utf8');
    const entries = parseCredits(md);
    assert.equal(entries.length, 6, 'hero + galerie-1..5');
    const withAttribution = entriesRequiringAttribution(entries);
    assert.equal(withAttribution.length, 4, 'hero (BY-SA), galerie-3/4/5 (BY) exigent une attribution ; galerie-1 (CC0)/galerie-2 (PD) non');
    assert.ok(withAttribution.some((e) => e.author === 'Jorge Royan'));
    assert.ok(!withAttribution.some((e) => e.author === 'FF-11'), 'galerie-1 (CC0) ne doit pas exiger d\'attribution');
    assert.ok(!withAttribution.some((e) => e.author === 'Tangopaso'), 'galerie-2 (domaine public) ne doit pas exiger d\'attribution');
  });
}

// ---------- 2. creditsHasEntries() / siteHasCredits() / evaluerCreditsAffiches() ----------

test('creditsHasEntries : vrai avec au moins un bloc "## ", faux sinon', () => {
  assert.equal(creditsHasEntries(''), false);
  assert.equal(creditsHasEntries(undefined), false);
  assert.equal(creditsHasEntries('# Crédits\n\nAucune photo tierce.\n'), false);
  assert.equal(creditsHasEntries('# Crédits\n\n## raw/hero.jpg\n- Auteur : X\n'), true);
});

test('siteHasCredits : vrai pour forge-delacroix, faux pour _exemple (pas de CREDITS.md)', () => {
  assert.equal(siteHasCredits(ROOT, 'forge-delacroix'), true);
  assert.equal(siteHasCredits(ROOT, '_exemple'), false);
});

test('evaluerCreditsAffiches : pas de CREDITS.md -> rien a verifier (tableau vide)', () => {
  assert.deepEqual(evaluerCreditsAffiches({ creditsMd: '', distHasCreditsPage: false, indexHtml: '' }), []);
});

test('evaluerCreditsAffiches : CREDITS.md sans licence a attribution obligatoire (CC0 seul) -> rien a verifier', () => {
  const creditsMd = '## a\n- Auteur : X\n- Licence : CC0 (domaine public, aucune attribution requise)\n';
  assert.deepEqual(evaluerCreditsAffiches({ creditsMd, distHasCreditsPage: false, indexHtml: '' }), []);
});

// Reprend la formulation reelle de scripts/ff/photos.mjs (LICENCE_LABEL.by) : c'est la ligne
// "Licence :" qui porte la phrase "attribution obligatoire", pas la ligne "Attribution a afficher".
const CREDITS_MD_BY = [
  '## a',
  '- Auteur : X',
  '- Licence : CC BY 2.0 — CC BY — attribution obligatoire (auteur, licence, lien source) (https://creativecommons.org/licenses/by/2.0)',
  '- Attribution a afficher (obligatoire) : « Photo : X, CC BY 2.0, https://x »',
].join('\n');

test('evaluerCreditsAffiches : attribution obligatoire mais page /credits absente du build -> echec unique', () => {
  const res = evaluerCreditsAffiches({ creditsMd: CREDITS_MD_BY, distHasCreditsPage: false, indexHtml: '<html></html>' });
  assert.equal(res.length, 1);
  assert.equal(res[0].pass, false);
  assert.match(res[0].label, /page \/credits manquante/);
});

test('evaluerCreditsAffiches : page presente mais aucun lien dans index.html -> 1 succes + 1 echec', () => {
  const res = evaluerCreditsAffiches({ creditsMd: CREDITS_MD_BY, distHasCreditsPage: true, indexHtml: '<html><body>rien ici</body></html>' });
  assert.equal(res.length, 2);
  assert.equal(res[0].pass, true);
  assert.equal(res[1].pass, false);
  assert.match(res[1].label, /aucun lien vers \/credits/);
});

test('evaluerCreditsAffiches : page presente et linkee -> 2 succes', () => {
  const res = evaluerCreditsAffiches({ creditsMd: CREDITS_MD_BY, distHasCreditsPage: true, indexHtml: '<a href="/credits">Crédits photos</a>' });
  assert.equal(res.length, 2);
  assert.ok(res.every((c) => c.pass));
});

// ---------- 3. Vrais builds : forge-delacroix (CREDITS.md) et _exemple (sans CREDITS.md) ----------

const FD_OUT = 'dist/_test-credits-fd';
const FD_DIST = path.join(ROOT, FD_OUT);
const EX_OUT = 'dist/_test-credits-ex';
const EX_DIST = path.join(ROOT, EX_OUT);
let fdIndexHtml = '';
let exIndexHtml = '';

function build(slug, outDir) {
  const astroJs = path.join(ROOT, 'node_modules', 'astro', 'astro.js');
  const res = spawnSync(process.execPath, [astroJs, 'build'], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 120_000,
    env: { ...process.env, SITE: slug, FF_OUT: outDir },
  });
  if (res.status !== 0) {
    console.log(res.stdout);
    console.log(res.stderr);
  }
  assert.equal(res.status, 0, `le build de sites/${slug} (FF_OUT=${outDir}) a echoue (voir la sortie ci-dessus)`);
}

before(() => {
  // Un seul build a la fois (jamais en parallele) : forge-delacroix, puis _exemple.
  build('forge-delacroix', FD_OUT);
  fdIndexHtml = fs.readFileSync(path.join(FD_DIST, 'index.html'), 'utf8');
  build('_exemple', EX_OUT);
  exIndexHtml = fs.readFileSync(path.join(EX_DIST, 'index.html'), 'utf8');
});

after(() => {
  fs.rmSync(FD_DIST, { recursive: true, force: true });
  fs.rmSync(EX_DIST, { recursive: true, force: true });
});

test('forge-delacroix : dist/credits.html est genere (CREDITS.md a des entrees CC BY/CC BY-SA)', () => {
  assert.ok(fs.existsSync(path.join(FD_DIST, 'credits.html')), 'dist/_test-credits-fd/credits.html manquant');
});

test('forge-delacroix : credits.html est noindex et liste les 4 photos a attribution obligatoire (pas les CC0/PD)', () => {
  const html = fs.readFileSync(path.join(FD_DIST, 'credits.html'), 'utf8');
  assert.match(html, /name=["']robots["']\s+content=["']noindex["']/);
  assert.match(html, /Jorge Royan/);
  assert.match(html, /Mbzt/);
  assert.match(html, /dalbera/);
  assert.match(html, /Dguendel/);
  assert.doesNotMatch(html, /FF-11/, 'galerie-1 (CC0) ne doit pas apparaitre sur /credits');
  assert.doesNotMatch(html, /Tangopaso/, 'galerie-2 (domaine public) ne doit pas apparaitre sur /credits');
});

test('forge-delacroix : index.html lie vers /credits ("Crédits photos" dans le pied de page)', () => {
  assert.match(fdIndexHtml, /href=["']\/credits["']/);
  assert.match(fdIndexHtml, /Crédits photos/);
});

test('forge-delacroix : /credits absente du sitemap (noindex)', () => {
  const sitemapIndex = fs.readFileSync(path.join(FD_DIST, 'sitemap-index.xml'), 'utf8');
  const m = sitemapIndex.match(/<loc>[^<]*\/(sitemap-\d+\.xml)<\/loc>/);
  assert.ok(m, 'aucun sitemap-N.xml reference dans sitemap-index.xml');
  const sitemap = fs.readFileSync(path.join(FD_DIST, m[1]), 'utf8');
  assert.doesNotMatch(sitemap, /\/credits/);
});

test('_exemple : pas de CREDITS.md -> pas de credits.html, pas de credits/index.html', () => {
  assert.ok(!fs.existsSync(path.join(EX_DIST, 'credits.html')));
  assert.ok(!fs.existsSync(path.join(EX_DIST, 'credits', 'index.html')));
});

test('_exemple : index.html ne lie pas vers /credits', () => {
  assert.doesNotMatch(exIndexHtml, /href=["']\/credits["']/);
});
