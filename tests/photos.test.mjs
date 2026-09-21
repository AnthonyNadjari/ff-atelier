// Fonctions pures de `ff photos` (scripts/ff/photos.mjs) : normalisation des licences (jamais NC/ND),
// filtre "photo plausible" (logos, dessins, schemas, restrictions Wikimedia), score sur metadonnees
// (licence > resolution > ratio), cadre de recadrage, et nettete par variance du laplacien
// (une image unie ou floue doit passer sous SEUIL_NETTETE, une image nette au-dessus).
// Aucun appel reseau : les sources Openverse/Wikimedia ne sont pas exercees ici.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {
  licenceOk,
  normaliserLicenceOpenverse,
  normaliserLicenceWikimedia,
  estPhotoPlausible,
  parseRatio,
  cadreCible,
  scoreMeta,
  nettete,
  scoreNettete,
  SEUIL_NETTETE,
  traduire,
} from '../scripts/ff/photos.mjs';

test('licences : CC0 / domaine public / BY / BY-SA acceptees, NC et ND refusees', () => {
  assert.equal(normaliserLicenceOpenverse('by'), 'by');
  assert.equal(normaliserLicenceOpenverse('by-sa'), 'by-sa');
  assert.equal(normaliserLicenceOpenverse('cc0'), 'cc0');
  assert.equal(normaliserLicenceOpenverse('pdm'), 'pdm');
  assert.equal(normaliserLicenceOpenverse('by-nc'), '');
  assert.equal(normaliserLicenceOpenverse('by-nd'), '');
  assert.equal(normaliserLicenceOpenverse('by-nc-sa'), '');
  assert.equal(normaliserLicenceWikimedia('CC BY-SA 4.0'), 'by-sa');
  assert.equal(normaliserLicenceWikimedia('CC BY 2.0'), 'by');
  assert.equal(normaliserLicenceWikimedia('CC0'), 'cc0');
  assert.equal(normaliserLicenceWikimedia('Public domain'), 'pdm');
  assert.equal(normaliserLicenceWikimedia('CC BY-NC 2.0'), '');
  assert.equal(normaliserLicenceWikimedia('CC BY-ND 4.0'), '');
  assert.equal(normaliserLicenceWikimedia('GFDL'), '');
  assert.equal(normaliserLicenceWikimedia(''), '');
  assert.ok(licenceOk('unsplash') && licenceOk('pexels') && !licenceOk('by-nc') && !licenceOk(''));
});

test('estPhotoPlausible : refuse logos, dessins, schemas, categories Wikimedia non photo, restrictions', () => {
  const base = { title: 'Blacksmith at work', tags: ['forge', 'hammer'], categories: ['Blacksmithing'], mime: 'image/jpeg' };
  assert.ok(estPhotoPlausible(base));
  assert.ok(!estPhotoPlausible({ ...base, title: 'Company logo' }));
  assert.ok(!estPhotoPlausible({ ...base, tags: ['vector', 'clipart'] }));
  assert.ok(!estPhotoPlausible({ ...base, categories: ['Diagrams of forges'] }));
  assert.ok(!estPhotoPlausible({ ...base, categories: ['Animated GIF files'] }));
  assert.ok(!estPhotoPlausible({ ...base, categorie: 'illustration' }));
  assert.ok(!estPhotoPlausible({ ...base, categorie: 'digitized_artwork' }));
  assert.ok(estPhotoPlausible({ ...base, categorie: 'photograph' }));
  assert.ok(!estPhotoPlausible({ ...base, restrictions: 'trademarked' }));
  assert.ok(!estPhotoPlausible({ ...base, restrictions: 'personality' }));
  assert.ok(!estPhotoPlausible({ ...base, mime: 'image/gif' }));
  // "text" seul est exclu, mais "textile" ne doit pas l'etre (frontiere de mot).
  assert.ok(estPhotoPlausible({ ...base, tags: ['textile', 'weaving'] }));
});

test('parseRatio / cadreCible : plus grand cadre au ratio, plafonne en largeur', () => {
  assert.equal(parseRatio('3:2'), 1.5);
  assert.equal(parseRatio('16/9'), 16 / 9);
  assert.equal(parseRatio(''), 0);
  assert.ok(Number.isNaN(parseRatio('abc')));
  // Source 4000x3000 (4:3), cible 3:2 : la hauteur limite -> 4000 -> plafond 1600 x 1067.
  assert.deepEqual(cadreCible(4000, 3000, 1.5, 1600), { width: 1600, height: 1067 });
  // Source 1600x1000 (deja plus large que 3:2) : largeur bornee par 1000*1.5 = 1500.
  assert.deepEqual(cadreCible(1600, 1000, 1.5, 1600), { width: 1500, height: 1000 });
  // Sans ratio : on ne recadre pas, on reduit.
  assert.deepEqual(cadreCible(3200, 2000, 0, 1600), { width: 1600, height: 1000 });
});

test('scoreMeta : licence la plus permissive > resolution > ratio adapte', () => {
  const opts = { ratioCible: 1.5, minLargeur: 1600 };
  const cc0 = scoreMeta({ licence: 'cc0', width: 2400, height: 1600 }, opts);
  const by = scoreMeta({ licence: 'by', width: 2400, height: 1600 }, opts);
  const bysa = scoreMeta({ licence: 'by-sa', width: 2400, height: 1600 }, opts);
  assert.ok(cc0 > by && by > bysa, `${cc0} > ${by} > ${bysa}`);
  const grand = scoreMeta({ licence: 'by', width: 6400, height: 4267 }, opts);
  assert.ok(grand > by, 'plus de resolution = plus de points');
  const portrait = scoreMeta({ licence: 'by', width: 1600, height: 2400 }, opts);
  const paysage = scoreMeta({ licence: 'by', width: 2400, height: 1600 }, opts);
  assert.ok(paysage > portrait, 'un portrait pour un slot paysage est penalise');
  const petit = scoreMeta({ licence: 'cc0', width: 800, height: 533 }, opts);
  assert.ok(petit < cc0, 'sous la largeur minimale, pas de points de resolution');
});

test('nettete : image unie ou floue sous le seuil, image texturee nette au-dessus', async () => {
  const uni = await sharp({ create: { width: 640, height: 480, channels: 3, background: { r: 120, g: 90, b: 60 } } }).png().toBuffer();
  assert.ok((await nettete(uni)) < SEUIL_NETTETE, 'image unie = floue');
  // Damier fin : contours nets partout -> variance elevee.
  const w = 640;
  const h = 480;
  const raw = Buffer.alloc(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) raw[y * w + x] = ((x >> 3) + (y >> 3)) % 2 ? 230 : 25;
  const damier = await sharp(raw, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();
  const vNet = await nettete(damier);
  assert.ok(vNet > SEUIL_NETTETE, `damier net : ${vNet}`);
  const vFlou = await nettete(await sharp(damier).blur(6).png().toBuffer());
  assert.ok(vFlou < vNet, 'le flou baisse la nettete');
  assert.equal(scoreNettete(SEUIL_NETTETE - 1), 0);
  assert.ok(scoreNettete(300) >= 29);
});

test('traduire : mots metier FR -> EN, reste inchange', () => {
  assert.deepEqual(traduire('ferronnier atelier'), { requeteEn: 'blacksmith ironwork forge atelier', touche: true });
  assert.deepEqual(traduire('sourdough oven'), { requeteEn: 'sourdough oven', touche: false });
});
