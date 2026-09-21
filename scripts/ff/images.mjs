// `ff images <slug>` : convertit sites/<slug>/raw/*.{jpg,jpeg,png,webp} en AVIF+WebP multi-largeurs
// dans public/images/, et ecrit sites/<slug>/images.json (manifeste lu par src/components/Img.astro).
// `ff images <slug> --depuis-public` : meme traitement, mais les sources sont les .webp deja presents
// dans public/images/ (sites sans dossier raw/, ex: demos generees avant ce pipeline).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { SITES_DIR, resolveSlug, parseArgs, ok, fail, warn, info, c } from './util.mjs';

const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
// Largeurs cibles (docs/veille/rendu.md §4.3), pas ~x1.5 entre paliers. Les deux dernieres couvrent
// les ecrans DPR 2 en desktop (un hero pleine largeur sur un 13" @2x demande ~2 600-2 900 px) et ne
// sont produites que si la source les permet (`withoutEnlargement` : jamais d'agrandissement, une
// photo de 1 800 px s'arrete a 1 600 + son alias). Audit du 20 sept 2026 (`ff nettete`) : plafonnees
// a 1 600, nos images etaient etirees x1,75 sur un MacBook.
export const WIDTHS = [480, 800, 1200, 1600, 2000, 2400];
// Qualites de base. Si une largeur >= 1280 px sort sous 15 Ko (compression destructrice, seuil de
// `ff nettete`), on reencode une fois avec la qualite relevee : une image de cette taille qui pese
// moins de 15 Ko a perdu son detail (cas de la sequence "Le geste" de forge-delacroix).
const QUALITE = { avif: 60, webp: 80 };
const QUALITE_RELEVEE = { avif: 72, webp: 88 };
const POIDS_MIN_OCTETS = 15 * 1024;
const LARGEUR_POIDS_MIN = 1280;

/** Encode `buf` en `fmt` a la largeur `w` ; releve la qualite si le resultat est suspectement leger. */
async function encoder(buf, w, fmt, outPath) {
  const encode = (quality) => {
    const pipeline = sharp(buf).resize({ width: w, withoutEnlargement: true });
    return (fmt === 'avif' ? pipeline.avif({ quality }) : pipeline.webp({ quality })).toBuffer();
  };
  let out = await encode(QUALITE[fmt]);
  let releve = false;
  if (w >= LARGEUR_POIDS_MIN && out.length < POIDS_MIN_OCTETS) {
    out = await encode(QUALITE_RELEVEE[fmt]);
    releve = true;
  }
  fs.writeFileSync(outPath, out);
  return { bytes: out.length, releve };
}

/** Traite une image source (chemin ou Buffer) : ecrit AVIF+WebP pour chaque largeur utile, renseigne le manifeste. */
export async function processImage(srcInput, name, outDir, manifest) {
  const buf = Buffer.isBuffer(srcInput) ? srcInput : fs.readFileSync(srcInput);
  const meta = await sharp(buf).metadata();
  const origWidth = meta.width || WIDTHS[WIDTHS.length - 1];
  const origHeight = meta.height || origWidth;
  const ratio = +(origWidth / origHeight).toFixed(4);

  let candidates = WIDTHS.filter((w) => w <= origWidth);
  if (candidates.length === 0) candidates = [origWidth];
  const maxW = Math.max(...candidates);

  const generated = [];
  const releves = [];
  for (const w of candidates) {
    const suffix = w === maxW ? '' : `-${w}`;
    for (const fmt of ['webp', 'avif']) {
      const outPath = path.join(outDir, `${name}${suffix}.${fmt}`);
      const { releve } = await encoder(buf, w, fmt, outPath);
      if (releve) releves.push(`${name}${suffix}.${fmt}`);
      generated.push(`/images/${name}${suffix}.${fmt}`);
    }
  }
  if (releves.length) warn(`${name} : qualite relevee (< 15 Ko a >= 1280 px) pour ${releves.join(', ')}.`);

  // LQIP : 16px de large, floute par la petite taille elle-meme, encode en data URI.
  const lqipBuf = await sharp(buf).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
  const lqip = `data:image/webp;base64,${lqipBuf.toString('base64')}`;

  // `widths` liste les largeurs REELLEMENT ecrites (jamais une largeur > source) : c'est ce que
  // l'integration ff-images et <Img> mettent dans le srcset, donc ce que le navigateur peut charger.
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
    ok(`${generated.length} fichier(s) genere(s) dans sites/${slug}/public/images/ (AVIF+WebP, largeurs ${WIDTHS.join('/')} selon la source) :`);
    for (const p of generated) info(`  ${c.cyan(p)}`);
    info('');
    info(`Manifeste ecrit : sites/${slug}/images.json (lu par <Img> au build, voir src/components/Img.astro).`);
    info("A coller dans site.config.ts (ex: images.hero.src, services[].image.src, about.portrait.src...) : le chemin /images/<nom>.webp habituel reste valide.");
    info("Une source de moins de 2 400 px de large n'aura pas les grands paliers : un hero pleine largeur net sur un ecran @2x demande une photo d'au moins 2 400 px.");
  }
}
