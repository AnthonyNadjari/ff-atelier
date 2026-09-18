// `ff logo <slug> <fichier.png|jpg> [--seuil 205] [--sombre]` : prepare le logo d'un client (ou le
// notre) a partir d'un fichier plat — typiquement un export de generateur ou de charte, encre noire
// sur fond creme, SANS transparence.
//
// Deux problemes a regler d'un coup :
//   1. le fond. Un logo pose sur son carre creme salit toutes les compositions (on voit le carre).
//      On recalcule donc la transparence depuis la LUMINOSITE : plus un pixel est sombre, plus il
//      est opaque. Le fond clair disparait, l'encre reste, les bords restent doux (pas de
//      decoupe en escalier comme avec une couleur-cle).
//   2. la couleur. Un logo noir est invisible sur une direction sombre. On sort donc deux fichiers :
//      <nom>.png (encre d'origine, pour les fonds clairs) et <nom>-clair.png (meme forme en blanc,
//      pour les fonds sombres). Les deux sont detoures et rognes au plus juste.
//
// Sortie dans sites/<slug>/public/images/. Le fichier source n'est jamais modifie.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, resolveSlug, ok, fail, info, parseArgs } from './util.mjs';

/** Alpha depuis la luminosite : blanc pur -> 0, encre -> 255, avec un seuil et une rampe douce. */
async function detourer(sharp, fichier, seuil) {
  const { data, info: meta } = await sharp(fichier).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = meta;
  const px = width * height;
  const alpha = Buffer.alloc(px);
  const encre = Buffer.alloc(px * 3);
  for (let i = 0; i < px; i += 1) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    // Rampe entre seuil et seuil-70 : au-dessus du seuil c'est du fond, en dessous c'est de l'encre.
    const a = lum >= seuil ? 0 : lum <= seuil - 70 ? 255 : Math.round(((seuil - lum) / 70) * 255);
    alpha[i] = a;
    encre[i * 3] = r;
    encre[i * 3 + 1] = g;
    encre[i * 3 + 2] = b;
  }
  return { width, height, alpha, encre };
}

export async function cmdLogo(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const source = positional[1];
  if (!source) {
    fail('Usage : ff logo <slug> <fichier.png|jpg> [--seuil 205] [--nom logo]');
    process.exit(1);
  }
  const abs = path.resolve(source);
  if (!fs.existsSync(abs)) {
    fail(`Fichier introuvable : ${abs}`);
    process.exit(1);
  }
  const seuil = flags.seuil !== undefined ? Number(flags.seuil) : 205;
  const nom = flags.nom ? String(flags.nom) : 'logo';

  let sharp;
  try {
    ({ default: sharp } = await import('sharp'));
  } catch (e) {
    fail(`sharp indisponible : ${e.message}`);
    process.exit(1);
  }

  const sortie = path.join(ROOT, 'sites', slug, 'public', 'images');
  fs.mkdirSync(sortie, { recursive: true });
  const { width, height, alpha, encre } = await detourer(sharp, abs, seuil);

  // On fabrique directement deux buffers RGBA : pas de composite (sharp refuse une composition
  // raw de meme taille sur certaines versions), donc pas de surprise de dimensions.
  const rgbaEncre = Buffer.alloc(width * height * 4);
  const rgbaClair = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    rgbaEncre[i * 4] = encre[i * 3];
    rgbaEncre[i * 4 + 1] = encre[i * 3 + 1];
    rgbaEncre[i * 4 + 2] = encre[i * 3 + 2];
    rgbaEncre[i * 4 + 3] = alpha[i];
    rgbaClair[i * 4] = 255;
    rgbaClair[i * 4 + 1] = 255;
    rgbaClair[i * 4 + 2] = 255;
    rgbaClair[i * 4 + 3] = alpha[i];
  }
  const raw = { raw: { width, height, channels: 4 } };
  const versionEncre = await sharp(rgbaEncre, raw).trim().png().toBuffer();
  const versionClaire = await sharp(rgbaClair, raw).trim().png().toBuffer();

  const fEncre = path.join(sortie, `${nom}.png`);
  const fClair = path.join(sortie, `${nom}-clair.png`);
  await sharp(versionEncre).toFile(fEncre);
  await sharp(versionClaire).toFile(fClair);
  const m = await sharp(fEncre).metadata();

  ok(`${nom}.png et ${nom}-clair.png ecrits dans ${path.relative(ROOT, sortie)} (${m.width}x${m.height}, fond transparent).`);
  info('Fond clair : <img src="/images/' + nom + '.png">   Fond sombre : /images/' + nom + '-clair.png');
  info('Si le detourage mange le trait ou laisse un halo, rejoue avec --seuil (plus bas = plus severe).');
}
