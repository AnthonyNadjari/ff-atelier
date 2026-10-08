/**
 * Integration Astro `ff-icones` : pack d'icones genere a partir de sites/<slug>/public/favicon.svg
 * (voir scripts/placeholders.mjs pour le monogramme cree quand le site n'en a pas) :
 *   - favicon.ico          32x32 (PNG-in-ICO), repli des navigateurs/outils qui ignorent le SVG ;
 *   - apple-touch-icon.png 180x180, fond OPAQUE = `--bg` de la direction (iOS ignore la transparence
 *                          et remplit en noir), pictogramme centre avec ~12 % de marge ;
 *   - icon-192.png / icon-512.png (transparents) + site.webmanifest (nom, icones, couleurs, display: browser).
 * Un fichier deja fourni par le site dans sites/<slug>/public/ n'est JAMAIS ecrase (Astro l'a copie
 * dans dist/, on le laisse). Les fonctions pures (couleur, manifeste, ICO) sont dans scripts/ff/icones.mjs.
 *
 * Build : `astro:build:done` ecrit les fichiers dans dist/<slug>. Dev (studio) : un middleware sert
 * les memes fichiers generes a la volee, pour que les <link> de Base.astro ne tombent pas en 404.
 * CSP : le manifeste est couvert par `default-src 'self'` (scripts/ff/csp.mjs), rien a ouvrir.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveLook } from './vite-ff-look.mjs';
import { FICHIERS_ICONES, MARGE_APPLE, directionBg, parseBusinessName, construireManifest, pngVersIco } from './ff/icones.mjs';

const TYPES = {
  'favicon.ico': 'image/x-icon',
  'apple-touch-icon.png': 'image/png',
  'icon-192.png': 'image/png',
  'icon-512.png': 'image/png',
  'site.webmanifest': 'application/manifest+json',
};

/** Rasterise le SVG en carre `taille` x `taille` (densite calculee pour ne jamais agrandir un bitmap). */
async function rasteriser(sharp, svg, taille) {
  const meta = await sharp(svg).metadata();
  const cote = Math.max(meta.width || taille, meta.height || taille);
  const density = Math.min(2400, Math.max(72, Math.ceil((72 * taille) / cote)));
  return sharp(svg, { density })
    .resize(taille, taille, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

/** Genere un fichier du pack (Buffer) ; `ctx` = { svg, couleur, nom }. */
async function generer(fichier, { svg, couleur, nom }) {
  const { default: sharp } = await import('sharp');
  if (fichier === 'favicon.ico') return pngVersIco([{ taille: 32, png: await rasteriser(sharp, svg, 32) }]);
  if (fichier === 'icon-192.png') return rasteriser(sharp, svg, 192);
  if (fichier === 'icon-512.png') return rasteriser(sharp, svg, 512);
  if (fichier === 'apple-touch-icon.png') {
    const taille = 180;
    const interieur = Math.round(taille * (1 - 2 * MARGE_APPLE));
    const picto = await rasteriser(sharp, svg, interieur);
    return sharp({ create: { width: taille, height: taille, channels: 4, background: couleur } })
      .composite([{ input: picto, gravity: 'center' }])
      .flatten({ background: couleur })
      .png()
      .toBuffer();
  }
  if (fichier === 'site.webmanifest') return Buffer.from(`${JSON.stringify(construireManifest({ nom, couleur }), null, 2)}\n`);
  throw new Error(`Icone inconnue : ${fichier}`);
}

export function iconsIntegration({ root, slug, ffLook = '' }) {
  const publicDir = resolve(root, 'sites', slug, 'public');
  const contexte = () => {
    const svgPath = resolve(publicDir, 'favicon.svg');
    if (!existsSync(svgPath)) return null;
    const cfg = resolve(root, 'sites', slug, 'site.config.ts');
    const nom = existsSync(cfg) ? parseBusinessName(readFileSync(cfg, 'utf8')) : '';
    const couleur = directionBg(root, resolveLook({ root, slug, ffLook }).direction);
    return { svg: readFileSync(svgPath), couleur, nom: nom || slug };
  };
  const fourni = (f) => existsSync(resolve(publicDir, f));

  return {
    name: 'ff-icones',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use(async (req, res, next) => {
          const f = (req.url || '').split('?')[0].replace(/^\//, '');
          if (!FICHIERS_ICONES.includes(f) || fourni(f)) return next();
          const ctx = contexte();
          if (!ctx) return next();
          try {
            const buf = await generer(f, ctx);
            res.setHeader('Content-Type', TYPES[f]);
            res.end(buf);
          } catch (e) {
            next(e);
          }
        });
      },
      'astro:build:done': async ({ dir, logger }) => {
        const ctx = contexte();
        if (!ctx) {
          logger.info('pas de favicon.svg : pack d\'icones non genere');
          return;
        }
        const out = fileURLToPath(dir);
        const ecrits = [];
        for (const f of FICHIERS_ICONES) {
          if (fourni(f)) continue; // fourni par le site : deja copie par Astro, jamais ecrase
          writeFileSync(join(out, f), await generer(f, ctx));
          ecrits.push(f);
        }
        if (ecrits.length) logger.info(`icones generees (fond ${ctx.couleur}) : ${ecrits.join(', ')}`);
      },
    },
  };
}
