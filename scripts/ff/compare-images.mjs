// Comparaison pixel-a-pixel de deux captures PNG (regression visuelle, voir scripts/captures.mjs
// `--comparer`/`--figer` et docs/PROCESS.md § regression visuelle). Module pur (aucun I/O), pour
// rester testable directement par tests/captures-compare.test.mjs. Utilise `sharp` (deja une
// dependance du repo, `scripts/ff/images.mjs`) plutot qu'une lib de diff dediee (pixelmatch...) :
// une seule dependance d'image suffit pour ce besoin simple (compter les pixels differents).
import sharp from 'sharp';

const TOLERANCE_PAR_CANAL = 24; // ecart RGBA tolere par canal avant de compter un pixel "different" (bruit d'encodage PNG/AVIF)

/**
 * Compare deux buffers PNG de memes dimensions. Renvoie :
 *  - { comparable: false, width, height } si les dimensions different (rien de pixel-a-pixel a dire) ;
 *  - { comparable: true, width, height, diffCount, diffRatio, diffPercent, diffPngBuffer } sinon,
 *    `diffPngBuffer` etant une image (memes dimensions) rouge sur les pixels differents et l'original
 *    attenue ailleurs, pour relire visuellement ce qui a change.
 */
export async function comparePngBuffers(bufferA, bufferB) {
  const [a, b] = await Promise.all([
    sharp(bufferA).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
    sharp(bufferB).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
  ]);
  if (a.info.width !== b.info.width || a.info.height !== b.info.height) {
    return { comparable: false, width: a.info.width, height: a.info.height, widthB: b.info.width, heightB: b.info.height };
  }

  const { width, height } = a.info;
  const total = width * height;
  const out = Buffer.alloc(total * 4);
  let diffCount = 0;

  for (let i = 0; i < total; i++) {
    const o = i * 4;
    const dr = Math.abs(a.data[o] - b.data[o]);
    const dg = Math.abs(a.data[o + 1] - b.data[o + 1]);
    const db = Math.abs(a.data[o + 2] - b.data[o + 2]);
    const da = Math.abs(a.data[o + 3] - b.data[o + 3]);
    const different = dr > TOLERANCE_PAR_CANAL || dg > TOLERANCE_PAR_CANAL || db > TOLERANCE_PAR_CANAL || da > TOLERANCE_PAR_CANAL;
    if (different) {
      diffCount++;
      out[o] = 255; out[o + 1] = 0; out[o + 2] = 0; out[o + 3] = 255; // rouge plein sur chaque pixel different
    } else {
      // Image d'origine attenuee ailleurs, pour garder le contexte visuel du diff.
      out[o] = a.data[o]; out[o + 1] = a.data[o + 1]; out[o + 2] = a.data[o + 2]; out[o + 3] = 60;
    }
  }

  const diffRatio = diffCount / total;
  const diffPngBuffer = await sharp(out, { raw: { width, height, channels: 4 } }).png().toBuffer();
  return { comparable: true, width, height, diffCount, diffRatio, diffPercent: diffRatio * 100, diffPngBuffer };
}

/** Seuil par defaut de `ff captures --comparer` (§ tache) : > 0.5 % de pixels differents -> avertissement. */
export const SEUIL_DIFF_PERCENT = 0.5;
