// Style casabonay (docs/veille/styles/casabonay.md § Construction, 29 oct 2026) : la construction d'un vrai site codée en
// entier : direction `casabonay`, hero/mur-de-photos (+ coquille split), modèle presets/casabonay.json. Ici :
// enregistrement partout, socle de docs/GOUT.md § 0, aucun signe IA, le rythme du mur (une haute pour deux larges, côté
// alterné), le modèle qui pose tout d'un coup, et la paire anna-vidal / borie-des-chenes refaite d'après ce style.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { loadSchemaModule, cleanTmp, ROOT } from '../scripts/ff/ts-loader.mjs';
import { varianteCompatible } from '../scripts/ff/composer.mjs';
import { CLES_IA, analyserDirection } from '../scripts/ff/ia.mjs';
import { appliquerModele, modeleEntier, phraseModele } from '../scripts/ff/melanger.mjs';
import { readPreset, exigenceHero } from '../scripts/ff/modele.mjs';
import { profilClient } from '../scripts/ff/melanger.mjs';

const { VARIANTS, DIRECTIONS, HEROS_DE_FAMILLE } = await loadSchemaModule();
after(() => cleanTmp());

const lire = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const code = (rel) => lire(rel).replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');

test('casabonay : direction et hero enregistrés (DIRECTIONS, VARIANTS, HEROS_DE_FAMILLE, HERO_SIZES, docs, fiche avec Construction)', () => {
  assert.ok(DIRECTIONS.includes('casabonay'));
  assert.ok(VARIANTS.hero.includes('mur-de-photos'));
  assert.ok(HEROS_DE_FAMILLE.includes('mur-de-photos'), 'jamais tiré au moins-utilisé par ff composer (demande 4 photos)');
  assert.match(lire('src/lib/images.ts'), /'mur-de-photos': '\(min-width: 64rem\) 38vw, 100vw'/);
  const doc = lire('docs/DIRECTIONS.md');
  assert.match(doc, /\| \*\*casabonay\*\* \|/);
  assert.match(doc, /\| `mur-de-photos` \|/);
  assert.match(lire('docs/veille/styles/casabonay.md'), /## Construction/, 'une fiche sans « Construction » n’est pas une fiche');
  assert.match(lire('src/directions/casabonay/meta.ts'), /source: "https:\/\/casabonay\.com\/"/);
  assert.match(lire('docs/veille/styles/INDEX.md'), /\| casabonay \| \[casabonay\.com\]/);
});

test('direction casabonay : Urbanist (hors liste IA), sable, outremer, rouge AA, angles droits, aucune ombre, pas d’italique', () => {
  const css = lire('src/directions/casabonay/index.css');
  assert.match(css, /@import '@fontsource-variable\/urbanist'/);
  assert.ok(!CLES_IA.includes('urbanist'));
  assert.deepEqual(analyserDirection(css).echecs, []);
  assert.match(css, /--bg: #f3e2ca;/);
  assert.match(css, /--muted: #0000b2;/, 'la majorité du texte de la source est outremer');
  assert.match(css, /--accent-2: #d40000;/, 'rouge assombri : le blanc passe AA (le rouge pur de la source était à 4,0)');
  assert.match(css, /--radius: 0px;/);
  assert.match(css, /--shadow-card: none;/);
  assert.match(css, /h1 em,\n\[data-direction='casabonay'\] h2 em \{ font-style: normal;/);
});

test('hero/mur-de-photos : socle (h1, métier et ville, téléphone), aucun signe IA, une haute pour deux larges, 8 photos au plus, rien n’entre', () => {
  const src = code('src/sections/Hero/mur-de-photos.astro');
  assert.match(src, /<h1[^>]*set:html=\{site\.business\.tagline\}/);
  assert.match(src, /metierEtVille\(\)/);
  assert.ok(src.indexOf('<h1') < src.indexOf('metierEtVille()'));
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /site\.contact\.phoneDisplay/);
  assert.doesNotMatch(src, /uppercase|tracking-|(?<![-\w])italic\b|rounded-full|999px|radius-pill|data-grain|eyebrow/);
  assert.doesNotMatch(src, /[·—]/);
  assert.doesNotMatch(src, /<img\b/, 'photos par <Img>');
  assert.doesNotMatch(src, /font-family\s*:|#[0-9a-f]{3,8}\b/i, 'tokens seulement');
  assert.doesNotMatch(src, /data-reveal|data-stagger|data-split|data-parallax/, 'rien n’entre ni n’apparaît (profil fondu-sobre)');
  assert.match(src, /\[site\.images\.hero, \.\.\.site\.proof\.gallery, site\.about\.portrait, \.\.\.site\.services\.map\(\(x\) => x\.image\)\]/, 'couverture, galerie, portrait, une photo par activité');
  assert.match(src, /\.slice\(0, 8\)/, '8 photos au plus (budget images-home)');
  assert.doesNotMatch(src, /photosDuSite|\.images\b.*flatMap/, 'jamais la grille propre d’une page');
  assert.match(src, /const mur = n >= 4/);
  assert.match(src, /i % 3 === 0 \? \(Math\.floor\(i \/ 3\) % 2 \? 'mur-haute mur-droite' : 'mur-haute'\) : 'mur-large'/, 'une haute pour deux larges, le côté alterne');
  assert.match(src, /grid-auto-flow: dense/);
  assert.match(src, /\.mur-deux \.mur-haute \{ aspect-ratio: auto; grid-row: span 2;/);
  assert.match(src, /gap: 7px/, '7 px de fond entre les photos à l’ordinateur');
  assert.match(src, /gap: 5px/, '5 px au téléphone');
  assert.match(src, /\.mur-haute \{ aspect-ratio: 3 \/ 4; \}/);
});

test('hero/mur-de-photos demande 4 photos (composer, ff modele), comme la mosaïque', () => {
  const quatre = { images: { hero: { src: '/h.webp' } }, proof: { gallery: [{ src: '/a' }, { src: '/b' }, { src: '/c' }] }, services: [] };
  assert.equal(varianteCompatible('hero', 'mur-de-photos', quatre), true);
  assert.equal(varianteCompatible('hero', 'mur-de-photos', { images: { hero: { src: '/h.webp' } }, proof: { gallery: [] }, services: [] }), false);
  assert.equal(exigenceHero('mur-de-photos', profilClient({ photosSite: 4 })), null);
  assert.ok(exigenceHero('mur-de-photos', profilClient({ photosSite: 2 })));
});

test('presets/casabonay.json : modèle de site entier (nommé comme sa direction), coquille split, hero mur-de-photos, tiroir, pages porte', () => {
  const p = readPreset('casabonay');
  assert.equal(p.nom, 'casabonay');
  assert.equal(p.look.direction, 'casabonay');
  assert.equal(p.look.layout.shell, 'split');
  assert.equal(p.look.layout.hero, 'mur-de-photos');
  assert.equal(p.look.layout.contactDrawer, true);
  assert.equal(p.look.layout.servicePage, 'porte');
  assert.equal(p.look.motion, 'subtle');
  assert.equal(p.look.typography, undefined, 'les polices viennent de la direction');
  // ff melanger --style casabonay : le modèle passe par-dessus les atomes.
  const m = modeleEntier('casabonay', readPreset);
  assert.deepEqual(m, p);
  const look = appliquerModele({ direction: 'm-abc', typography: { display: 'bebas', body: 'karla' }, layout: { hero: 'mosaique' } }, m);
  assert.equal(look.direction, 'casabonay');
  assert.equal(look.layout.hero, 'mur-de-photos');
  assert.equal(look.typography, undefined);
  assert.equal(phraseModele('casabonay', m), 'modèle de site entier presets/casabonay.json appliqué : hero mur-de-photos, 2 sections, coquille split');
});

test('anna-vidal (démo) refaite d’après Casa Bonay : direction, coquille split, mur de photos, manifeste seul sous le mur, tiroir, pages porte', () => {
  const cfg = lire('sites/anna-vidal/site.config.ts');
  assert.match(cfg, /^\/\/ DEMO/);
  assert.match(cfg, /direction: 'casabonay'/);
  assert.match(cfg, /shell: 'split'/);
  assert.match(cfg, /hero: 'mur-de-photos'/);
  assert.match(cfg, /contactDrawer: true/);
  assert.match(cfg, /servicePage: 'porte'/);
  assert.equal((cfg.match(/\{ type: /g) || []).length, 1, 'un seul bloc sous le mur : le manifeste (déroulé héros, manifeste, pied)');
  assert.equal((cfg.match(/galerie-\d\.webp/g) || []).length, 6, 'les six photos de la galerie déclarées (proof.gallery) pour le mur');
  assert.deepEqual(fs.readdirSync(path.join(ROOT, 'sites', 'anna-vidal', 'sections')), ['Manifeste.astro'], 'les blocs de l’ancien accueil-menu sont retirés');
});
