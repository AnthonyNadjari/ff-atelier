// Test de la filiere images (rendu.md §4, scripts/ff/images.mjs + src/components/Img.astro) :
// copie sites/_exemple vers un slug jetable, depose une image de test dans public/images/, genere
// le manifeste avec `ff images <slug> --depuis-public`, verifie sa forme (widths/formats/ratio/lqip)
// et les fichiers AVIF/WebP generes, puis construit le site et verifie que le HTML contient bien un
// <picture> AVIF+WebP avec width/height pour l'image hero. Nettoie sites/<slug> et dist/<slug> ensuite.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';
import { ROOT } from '../scripts/ff/ts-loader.mjs';
import { WIDTHS } from '../scripts/ff/images.mjs';

const SLUG = '_test-images-x';
const SITE_DIR = path.join(ROOT, 'sites', SLUG);
const DIST_DIR = path.join(ROOT, 'dist', SLUG);
const FF = path.join(ROOT, 'scripts', 'ff.mjs');
const IMAGES_DIR = path.join(SITE_DIR, 'public', 'images');
const MANIFEST_PATH = path.join(SITE_DIR, 'images.json');

let manifest = {};
let indexHtml = '';

function cleanup() {
  fs.rmSync(SITE_DIR, { recursive: true, force: true });
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}

before(async () => {
  cleanup();
  fs.cpSync(path.join(ROOT, 'sites', '_exemple'), SITE_DIR, { recursive: true });

  const configPath = path.join(SITE_DIR, 'site.config.ts');
  let config = fs.readFileSync(configPath, 'utf8');
  config = config.replace(/slug:\s*'_exemple'/, `slug: '${SLUG}'`);
  assert.match(config, new RegExp(`slug:\\s*'${SLUG}'`), 'le remplacement du slug a echoue');
  config = config.replace('images: {}', "images: { hero: { src: '/images/hero.webp', alt: 'Photo de test' } }");
  assert.match(config, /images:\s*\{\s*hero:/, "le remplacement de `images: {}` a echoue (site.config.ts de _exemple a-t-il change de forme ?)");
  fs.writeFileSync(configPath, config);

  // Image source de test : 800x600, assez grande pour produire plusieurs largeurs (480/800).
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  const buf = await sharp({ create: { width: 800, height: 600, channels: 3, background: { r: 90, g: 60, b: 160 } } })
    .webp({ quality: 80 })
    .toBuffer();
  fs.writeFileSync(path.join(IMAGES_DIR, 'hero.webp'), buf);

  const imagesRes = spawnSync(process.execPath, [FF, 'images', SLUG, '--depuis-public'], { cwd: ROOT, encoding: 'utf8', timeout: 60_000 });
  if (imagesRes.status !== 0) {
    console.log(imagesRes.stdout);
    console.log(imagesRes.stderr);
  }
  assert.equal(imagesRes.status, 0, `\`ff images ${SLUG} --depuis-public\` a echoue (voir la sortie ci-dessus)`);
  assert.ok(fs.existsSync(MANIFEST_PATH), `sites/${SLUG}/images.json non cree`);
  manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

  const buildRes = spawnSync(process.execPath, [FF, 'build', SLUG], { cwd: ROOT, encoding: 'utf8', timeout: 120_000 });
  if (buildRes.status !== 0) {
    console.log(buildRes.stdout);
    console.log(buildRes.stderr);
  }
  assert.equal(buildRes.status, 0, `\`ff build ${SLUG}\` a echoue (voir la sortie ci-dessus)`);
  indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');
});

after(cleanup);

test('WIDTHS : paliers 480 -> 2400 (les deux derniers couvrent les ecrans @2x en desktop, audit nettete du 20 sept 2026)', () => {
  assert.deepEqual(WIDTHS, [480, 800, 1200, 1600, 2000, 2400]);
});

test('le manifeste contient une entree "hero" avec widths/formats/ratio/lqip', () => {
  assert.ok(manifest.hero, 'entree "hero" absente du manifeste');
  const { widths, formats, ratio, lqip } = manifest.hero;
  assert.ok(Array.isArray(widths) && widths.length > 0, 'widths doit etre un tableau non vide');
  assert.ok(widths.every((w) => Number.isInteger(w) && w > 0), 'chaque largeur doit etre un entier positif');
  assert.deepEqual([...formats].sort(), ['avif', 'webp'], 'formats doit contenir exactement avif et webp');
  assert.ok(typeof ratio === 'number' && ratio > 0, 'ratio doit etre un nombre positif');
  assert.match(lqip, /^data:image\/webp;base64,/, 'lqip doit etre un data URI webp');
});

test('les largeurs generees ne depassent jamais 800 (largeur de la source de test) et incluent 480', () => {
  assert.ok(manifest.hero.widths.includes(480), `widths (${manifest.hero.widths}) devrait inclure 480`);
  assert.ok(manifest.hero.widths.every((w) => w <= 800), `widths (${manifest.hero.widths}) ne devrait pas depasser la largeur source (800, withoutEnlargement)`);
});

test('AVIF et WebP sont ecrits sur disque pour chaque largeur, plus hero.webp/hero.avif (alias sans suffixe)', () => {
  const maxW = Math.max(...manifest.hero.widths);
  for (const w of manifest.hero.widths) {
    const suffix = w === maxW ? '' : `-${w}`;
    assert.ok(fs.existsSync(path.join(IMAGES_DIR, `hero${suffix}.webp`)), `hero${suffix}.webp manquant`);
    assert.ok(fs.existsSync(path.join(IMAGES_DIR, `hero${suffix}.avif`)), `hero${suffix}.avif manquant`);
  }
});

test('le HTML construit contient un <picture> avec une source AVIF et un <img> avec width/height', () => {
  assert.match(indexHtml, /<picture>/, 'aucun <picture> trouve dans dist/_test-images-x/index.html');
  assert.match(indexHtml, /<source type="image\/avif"[^>]*srcset="[^"]*hero[^"]*\.avif[^"]*"/, "aucune <source type=\"image/avif\"> pour hero.* trouvee");
  assert.match(indexHtml, /<source type="image\/webp"[^>]*srcset="[^"]*hero[^"]*\.webp[^"]*"/, "aucune <source type=\"image/webp\"> pour hero.* trouvee");
  const imgMatch = indexHtml.match(/<img[^>]*src="\/images\/hero\.webp"[^>]*>/);
  assert.ok(imgMatch, '<img src="/images/hero.webp"> introuvable');
  assert.match(imgMatch[0], /\bwidth="\d+"/, 'width manquant sur le <img> hero');
  assert.match(imgMatch[0], /\bheight="\d+"/, 'height manquant sur le <img> hero');
});
