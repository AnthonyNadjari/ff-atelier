// Test de la comparaison pixel-a-pixel de regression visuelle (scripts/ff/compare-images.mjs,
// utilisee par `ff captures --comparer`/`--figer`, voir scripts/captures.mjs et docs/PROCESS.md).
// Genere deux PNG synthetiques avec sharp (deja une dependance du repo, meme outil que
// scripts/ff/images.mjs et tests/images.test.mjs) : un carre uni, une variante identique, une
// variante avec un bloc de pixels changes, et une variante de dimensions differentes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { comparePngBuffers, SEUIL_DIFF_PERCENT } from '../scripts/ff/compare-images.mjs';

const WIDTH = 40;
const HEIGHT = 40;

/** Buffer RGBA uni (couleur donnee), avec un bloc `taille x taille` d'une autre couleur au coin (0,0) si demande. */
function pngUni({ r, g, b }, bloc = 0, blocCouleur = { r: 255, g: 0, b: 0 }) {
  const data = Buffer.alloc(WIDTH * HEIGHT * 4);
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const o = (y * WIDTH + x) * 4;
      const dansLeBloc = x < bloc && y < bloc;
      const c = dansLeBloc ? blocCouleur : { r, g, b };
      data[o] = c.r; data[o + 1] = c.g; data[o + 2] = c.b; data[o + 3] = 255;
    }
  }
  return sharp(data, { raw: { width: WIDTH, height: HEIGHT, channels: 4 } }).png().toBuffer();
}

test('comparePngBuffers : deux images identiques -> 0 pixel different, pas au-dessus du seuil', async () => {
  const a = await pngUni({ r: 30, g: 120, b: 200 });
  const b = await pngUni({ r: 30, g: 120, b: 200 });
  const res = await comparePngBuffers(a, b);
  assert.equal(res.comparable, true);
  assert.equal(res.diffCount, 0);
  assert.equal(res.diffPercent, 0);
  assert.ok(res.diffPercent <= SEUIL_DIFF_PERCENT);
});

test('comparePngBuffers : bloc de pixels changes au-dessus du seuil -> diffPngBuffer produit', async () => {
  const a = await pngUni({ r: 30, g: 120, b: 200 });
  // Bloc 10x10 sur 1600 pixels = 100/1600 = 6.25 % > 0.5 % de seuil.
  const b = await pngUni({ r: 30, g: 120, b: 200 }, 10);
  const res = await comparePngBuffers(a, b);
  assert.equal(res.comparable, true);
  assert.equal(res.diffCount, 100);
  assert.ok(res.diffPercent > SEUIL_DIFF_PERCENT, `diffPercent ${res.diffPercent} devrait depasser ${SEUIL_DIFF_PERCENT}`);
  assert.ok(Buffer.isBuffer(res.diffPngBuffer) && res.diffPngBuffer.length > 0);
  // L'image de diff doit elle-meme decoder comme un PNG valide des memes dimensions.
  const diffDecoded = await sharp(res.diffPngBuffer).metadata();
  assert.equal(diffDecoded.width, WIDTH);
  assert.equal(diffDecoded.height, HEIGHT);
});

test('comparePngBuffers : un tout petit ecart (bruit d\'encodage) reste sous le seuil', async () => {
  const a = await pngUni({ r: 30, g: 120, b: 200 });
  // Un seul pixel change sur 1600 = 0.0625 % < 0.5 %.
  const b = await pngUni({ r: 30, g: 120, b: 200 }, 1);
  const res = await comparePngBuffers(a, b);
  assert.equal(res.comparable, true);
  assert.equal(res.diffCount, 1);
  assert.ok(res.diffPercent < SEUIL_DIFF_PERCENT);
});

test('comparePngBuffers : dimensions differentes -> non comparable (pas d\'exception)', async () => {
  const a = await pngUni({ r: 30, g: 120, b: 200 });
  const b = await sharp(Buffer.alloc(20 * 20 * 4, 0), { raw: { width: 20, height: 20, channels: 4 } }).png().toBuffer();
  const res = await comparePngBuffers(a, b);
  assert.equal(res.comparable, false);
  assert.equal(res.width, WIDTH);
  assert.equal(res.widthB, 20);
});
