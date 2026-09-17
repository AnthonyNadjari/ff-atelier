// `ff images <slug>` : convertit sites/<slug>/raw/*.{jpg,jpeg,png,webp} en AVIF+WebP multi-largeurs
// dans public/images/, et ecrit sites/<slug>/images.json (manifeste lu par src/components/Img.astro).
// `ff images <slug> --depuis-public` : meme traitement, mais les sources sont les .webp deja presents
// dans public/images/ (sites sans dossier raw/, ex: demos generees avant ce pipeline).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { SITES_DIR, resolveSlug, parseArgs, ok, fail, warn, info, c } from './util.mjs';

const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
// Largeurs cibles (docs/veille/rendu.md §4.3) : pas ~x1.5-2 entre paliers.
const WIDTHS = [480, 800, 1200, 1600];

/** Traite une image source (chemin ou Buffer) : ecrit AVIF+WebP pour chaque largeur utile, renseigne le manifeste. */
async function processImage(srcInput, name, outDir, manifest) {
  const buf = Buffer.isBuffer(srcInput) ? srcInput : fs.readFileSync(srcInput);
  const meta = await sharp(buf).metadata();
  const origWidth = meta.width || WIDTHS[WIDTHS.length - 1];
  const origHeight = meta.height || origWidth;
  const ratio = +(origWidth / origHeight).toFixed(4);

  let candidates = WIDTHS.filter((w) => w <= origWidth);
  if (candidates.length === 0) candidates = [origWidth];
  const maxW = Math.max(...candidates);

  const generated = [];
  for (const w of candidates) {
    const suffix = w === maxW ? '' : `-${w}`;
    const webpOut = path.join(outDir, `${name}${suffix}.webp`);
    const avifOut = path.join(outDir, `${name}${suffix}.avif`);
    await sharp(buf).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(webpOut);
    await sharp(buf).resize({ width: w, withoutEnlargement: true }).avif({ quality: 60 }).toFile(avifOut);
    generated.push(`/images/${name}${suffix}.webp`, `/images/${name}${suffix}.avif`);
  }

  // LQIP : 16px de large, floute par la petite taille elle-meme, encode en data URI.
  const lqipBuf = await sharp(buf).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
  const lqip = `data:image/webp;base64,${lqipBuf.toString('base64')}`;

  manifest[name] = { widths: candidates.sort((a, b) => a - b), formats: ['avif', 'webp'], ratio, lqip };
  return generated;
}

export async function cmdImages(args) {
  const { positional, flags } = parseArgs(args);
  const depuisPublic = !!flags['depuis-public'];
  const slug = resolveSlug(positional[0]);
  const outDir = path.join(SITES_DIR, slug, 'public', 'images');
  const manifestPath = path.join(SITES_DIR, slug, 'images.json');
  const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};

  fs.mkdirSync(outDir, { recursive: true });

  const generated = [];

  if (depuisPublic) {
    if (!fs.existsSync(outDir)) {
      fail(`sites/${slug}/public/images introuvable.`);
      process.exit(1);
    }
    // Sources = .webp deja presents, hors variantes deja generees par ce script (suffixe -<largeur>).
    const widthSuffix = new RegExp(`-(?:${WIDTHS.join('|')})\\.webp$`, 'i');
    const files = fs
      .readdirSync(outDir)
      .filter((f) => /\.webp$/i.test(f) && !widthSuffix.test(f))
      .sort();
    if (files.length === 0) {
      warn(`Aucune image .webp source dans sites/${slug}/public/images/ (hors variantes deja generees).`);
      return;
    }
    for (const file of files) {
      const name = path.parse(file).name;
      const srcPath = path.join(outDir, file);
      const buf = fs.readFileSync(srcPath); // lu avant ecriture : evite d'ecraser le fichier pendant qu'on le lit
      generated.push(...(await processImage(buf, name, outDir, manifest)));
    }
  } else {
    const rawDir = path.join(SITES_DIR, slug, 'raw');
    if (!fs.existsSync(rawDir)) {
      fail(`sites/${slug}/raw introuvable. Depose les photos originales dedans d'abord (ou utilise --depuis-public).`);
      process.exit(1);
    }
    const files = fs
      .readdirSync(rawDir)
      .filter((f) => EXTS.has(path.extname(f).toLowerCase()))
      .sort();
    if (files.length === 0) {
      warn(`Aucune image (jpg/jpeg/png/webp) dans sites/${slug}/raw/. Les fichiers .heic ne sont pas geres, convertis-les d'abord en jpg.`);
      return;
    }
    for (const file of files) {
      const srcPath = path.join(rawDir, file);
      const name = path.parse(file).name;
      generated.push(...(await processImage(srcPath, name, outDir, manifest)));
    }
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

  info('');
  if (generated.length === 0) {
    ok('Toutes les images sont deja a jour.');
  } else {
    ok(`${generated.length} fichier(s) genere(s) dans sites/${slug}/public/images/ (AVIF+WebP, largeurs ${WIDTHS.join('/')}) :`);
    for (const p of generated) info(`  ${c.cyan(p)}`);
    info('');
    info(`Manifeste ecrit : sites/${slug}/images.json (lu par <Img> au build, voir src/components/Img.astro).`);
    info("A coller dans site.config.ts (ex: images.hero.src, services[].image.src, about.portrait.src...) : le chemin /images/<nom>.webp habituel reste valide.");
  }
}
