// `ff images <slug>` : convertit sites/<slug>/raw/*.{jpg,jpeg,png,webp} en .webp dans public/images/.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { SITES_DIR, resolveSlug, ok, fail, warn, info, c } from './util.mjs';

const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

export async function cmdImages(args) {
  const slug = resolveSlug(args[0]);
  const rawDir = path.join(SITES_DIR, slug, 'raw');
  const outDir = path.join(SITES_DIR, slug, 'public', 'images');

  if (!fs.existsSync(rawDir)) {
    fail(`sites/${slug}/raw introuvable. Depose les photos originales dedans d'abord.`);
    process.exit(1);
  }
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs
    .readdirSync(rawDir)
    .filter((f) => EXTS.has(path.extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) {
    warn(`Aucune image (jpg/jpeg/png/webp) dans sites/${slug}/raw/. Les fichiers .heic ne sont pas geres, convertis-les d'abord en jpg.`);
    return;
  }

  const generated = [];
  for (const file of files) {
    const srcPath = path.join(rawDir, file);
    const name = path.parse(file).name;
    const srcStat = fs.statSync(srcPath);
    const targets = [
      { suffix: '', width: 1600, out: path.join(outDir, `${name}.webp`) },
      { suffix: '-800', width: 800, out: path.join(outDir, `${name}-800.webp`) },
    ];
    for (const t of targets) {
      if (fs.existsSync(t.out) && fs.statSync(t.out).mtimeMs >= srcStat.mtimeMs) {
        continue; // deja a jour
      }
      await sharp(srcPath)
        .resize({ width: t.width, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(t.out);
      generated.push(`/images/${name}${t.suffix}.webp`);
    }
  }

  info('');
  if (generated.length === 0) {
    ok('Toutes les images sont deja a jour.');
  } else {
    ok(`${generated.length} fichier(s) genere(s) dans sites/${slug}/public/images/ :`);
    for (const p of generated) info(`  ${c.cyan(p)}`);
    info('');
    info("A coller dans site.config.ts (ex: images.hero.src, services[].image.src, about.portrait.src...).");
  }
}
