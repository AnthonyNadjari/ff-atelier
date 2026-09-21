// `ff sequence-photo <slug> <image> [--nom geste] [--n 48] [--largeur 1920] [--qualite 82]
//                    [--zoom 1.22] [--derive 0.06] [--chaleur 0.18] [--sombre 0.25]`
//
// Fabrique une sequence d'images pour `data-frames` (docs/ANIMATIONS.md) a partir d'UNE photo
// fixe : un mouvement de camera lent (zoom + derive, « Ken Burns »), avec en option un rechauffement
// progressif des couleurs et un assombrissement des bords — le rendu « la forge s'embrase » de
// sites/forge-delacroix, mais propre.
//
// Pourquoi ce script existe : la premiere sequence de la forge avait ete produite a la main en
// 1280x720 a 5 Ko par image — compression destructrice, puis etiree sur un canvas plein ecran a
// DPR 2 : « l'image est floue » (fondateur, 20 sept 2026). Regles fixees ici, pour ne plus y revenir :
//   - largeur 1920 par defaut (canvas 1400 css x DPR 2 = 2800 px reels ; 1920 est le compromis
//     poids/nettete, le canvas cover-fit fait le reste), 1080 pour la variante mobile ;
//   - qualite WebP 82 : ~40-70 Ko par image en 1920 sur une photo, jamais sous 15 Ko
//     (`ff nettete` le verifie) ; 48 images ~ 2,5 Mo desktop, chargees paresseusement apres `load` ;
//   - le mouvement est calcule en pixels sur l'original, jamais en agrandissant : la photo doit donc
//     faire au moins `largeur x zoom` de large, sinon on avertit et on plafonne le zoom.
// Une VRAIE video du client reste mieux (`ff sequence`) ; ceci sert quand il n'y a qu'une photo.
// Marquage : ce n'est pas une image generee par IA (pas de `data-ia`), c'est la photo du client
// recadree image par image.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, resolveSlug, ok, fail, warn, info, parseArgs } from './util.mjs';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Cadre (left, top, width, height) de la frame i/n : zoom progressif + derive laterale, sur l'original. */
export function cadreFrame(i, n, { width, height, zoom, derive }) {
  const t = n > 1 ? easeInOut(i / (n - 1)) : 1;
  const z = 1 + (zoom - 1) * t;
  const w = Math.round(width / z);
  const h = Math.round(height / z);
  // Derive : le centre glisse de -derive/2 a +derive/2 de la largeur disponible, en douceur.
  const jeuX = width - w;
  const jeuY = height - h;
  const cx = width / 2 + (t - 0.5) * derive * width;
  const left = clamp(Math.round(cx - w / 2), 0, Math.max(0, jeuX));
  const top = clamp(Math.round(height / 2 - h / 2 + (t - 0.5) * derive * 0.4 * height), 0, Math.max(0, jeuY));
  return { left, top, width: w, height: h };
}

export async function cmdSequencePhoto(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const source = positional[1];
  if (!source) {
    fail('Usage : ff sequence-photo <slug> <image> [--nom geste] [--n 48] [--largeur 1920] [--qualite 82] [--zoom 1.22] [--derive 0.06] [--chaleur 0.18] [--sombre 0.25]');
    process.exit(1);
  }
  const abs = path.isAbsolute(source) ? source : path.resolve(source);
  if (!fs.existsSync(abs)) {
    fail(`Image introuvable : ${abs}`);
    process.exit(1);
  }
  const nom = String(flags.nom || 'sequence').replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  const n = Number(flags.n || 48);
  const largeur = Number(flags.largeur || 1920);
  const largeurMobile = Number(flags['largeur-mobile'] || 1080);
  const qualite = Number(flags.qualite || 82);
  let zoom = Number(flags.zoom || 1.22);
  const derive = Number(flags.derive || 0.06);
  const chaleur = Number(flags.chaleur ?? 0.18);
  const sombre = Number(flags.sombre ?? 0.25);

  let sharp;
  try {
    ({ default: sharp } = await import('sharp'));
  } catch (e) {
    fail(`sharp indisponible : ${e.message}`);
    process.exit(1);
  }
  const meta = await sharp(abs).metadata();
  const { width, height } = meta;
  if (!width || !height) {
    fail('Image illisible (pas de dimensions).');
    process.exit(1);
  }
  if (width < largeur * zoom) {
    const zoomMax = Math.max(1, width / largeur);
    warn(`Photo de ${width} px de large : pour ${largeur} px de sortie, le zoom est plafonne a ${zoomMax.toFixed(2)} (demande ${zoom}). Une photo plus grande donnerait plus de mouvement.`);
    zoom = zoomMax;
  }

  const outDir = path.join(ROOT, 'sites', slug, 'public', 'anim', nom);
  const outMobile = path.join(ROOT, 'sites', slug, 'public', 'anim', `${nom}-mobile`);
  for (const d of [outDir, outMobile]) {
    fs.rmSync(d, { recursive: true, force: true });
    fs.mkdirSync(d, { recursive: true });
  }

  // Pipeline par frame : recadrage sur l'original (jamais d'agrandissement), rechauffement
  // progressif (multiplication canal par canal, tres douce), vignette sombre progressive.
  let totalDesktop = 0;
  for (let i = 0; i < n; i++) {
    const t = n > 1 ? i / (n - 1) : 1;
    const cadre = cadreFrame(i, n, { width, height, zoom, derive });
    const k = 1 + chaleur * t;
    let img = sharp(abs).extract(cadre);
    if (chaleur > 0) img = img.linear([k, 1 + (chaleur * 0.35) * t, 1 - (chaleur * 0.45) * t], [0, 0, 0]);
    if (sombre > 0) {
      // Vignette : degrade radial noir en SVG, opacite croissante — un seul composite, pas de boucle pixel.
      const svg = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${cadre.width}" height="${cadre.height}"><defs><radialGradient id="g" cx="50%" cy="55%" r="72%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="${(sombre * t).toFixed(3)}"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
      );
      img = img.composite([{ input: svg, blend: 'over' }]);
    }
    const name = `${String(i + 1).padStart(4, '0')}.webp`;
    const buf = await img.toBuffer();
    const d = await sharp(buf).resize(largeur, null, { withoutEnlargement: true }).webp({ quality: qualite }).toBuffer();
    fs.writeFileSync(path.join(outDir, name), d);
    totalDesktop += d.length;
    await sharp(buf).resize(largeurMobile, null, { withoutEnlargement: true }).webp({ quality: Math.max(60, qualite - 6) }).toFile(path.join(outMobile, name));
  }

  const moyKo = Math.round(totalDesktop / n / 1024);
  ok(`${n} images -> sites/${slug}/public/anim/${nom}/ (${(totalDesktop / 1024 / 1024).toFixed(2)} Mo desktop, ${moyKo} Ko/image) + ${nom}-mobile/.`);
  if (moyKo < 15) warn('Moins de 15 Ko par image : compression destructrice, monte --qualite ou verifie la source.');
  info('A coller dans la section (voir docs/ANIMATIONS.md § data-frames) :');
  info(`data-frames="/anim/${nom}/" data-frames-count="${n}" data-frames-ext="webp" data-frames-pad="4" data-frames-mobile="/anim/${nom}-mobile/" data-frames-poster="/anim/${nom}/0001.webp" data-pin="220"`);
}
