// Pack d'icones d'un site (favicon.ico, apple-touch-icon.png, icon-192/512.png, site.webmanifest) :
// fonctions PURES partagees par scripts/astro-icons-integration.mjs (generation au build + service en
// dev) et scripts/vite-ff-look.mjs (exporte `themeColor` et `icons` au module virtuel `virtual:ff-look`,
// lus par src/layouts/Base.astro). Testees dans tests/icones.test.mjs.
//
// La couleur de fond vient du token `--bg` de la direction (premier bloc
// `[data-direction='<nom>'] { ... }` de src/directions/<nom>/index.css) : une seule source de verite,
// jamais une copie a tenir a jour dans meta.ts. tests/icones.test.mjs verifie que chaque direction
// declare un `--bg` hexadecimal lisible ici.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** Fichiers produits, dans l'ordre de generation. Un fichier deja present dans sites/<slug>/public/ n'est jamais ecrase. */
export const FICHIERS_ICONES = ['favicon.ico', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'site.webmanifest'];

/** Marge autour du pictogramme sur l'apple-touch-icon (iOS ignore la transparence et arrondit les coins). */
export const MARGE_APPLE = 0.12;

/** Valeur de `--bg` du bloc de tokens d'une direction (hex normalise en minuscules, 6 chiffres) ; null si absente ou non hex. */
export function parseDirectionBg(cssText, direction) {
  const re = new RegExp(`\\[data-direction=(['"])${direction}\\1\\]\\s*\\{([\\s\\S]*?)\\n\\}`);
  const bloc = (cssText || '').match(re);
  if (!bloc) return null;
  const m = bloc[2].match(/(?:^|[\s;{])--bg\s*:\s*(#[0-9a-fA-F]{3}|#[0-9a-fA-F]{6})\s*;/);
  if (!m) return null;
  let h = m[1].slice(1).toLowerCase();
  if (h.length === 3) h = [...h].map((x) => x + x).join('');
  return `#${h}`;
}

/** `--bg` de src/directions/<direction>/index.css, repli #ffffff si illisible (jamais d'echec de build pour une icone). */
export function directionBg(root, direction) {
  const p = resolve(root, 'src', 'directions', direction, 'index.css');
  if (!existsSync(p)) return '#ffffff';
  return parseDirectionBg(readFileSync(p, 'utf8'), direction) ?? '#ffffff';
}

/** Nom commercial lu par regex dans site.config.ts (`business: { name: '...' }`), sans import TS. */
export function parseBusinessName(configText) {
  const m = (configText || '').match(/\bbusiness\s*:\s*\{[\s\S]*?\bname\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/);
  return m ? m[2].replace(/\\(.)/g, '$1') : '';
}

/** Nom court (ecran d'accueil, ~15 caracteres visibles) : le nom entier s'il tient, sinon son premier mot. */
export function nomCourt(nom) {
  const n = (nom || '').trim();
  if (n.length <= 15) return n;
  return n.split(/\s+/)[0];
}

/** Contenu de site.webmanifest (display: browser — un site vitrine, pas une appli). */
export function construireManifest({ nom, couleur }) {
  return {
    name: nom,
    short_name: nomCourt(nom),
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    theme_color: couleur,
    background_color: couleur,
    display: 'browser',
    start_url: '/',
  };
}

/** Emballe des PNG dans un conteneur ICO (PNG-in-ICO, accepte par tous les navigateurs actuels). `images` = [{ taille, png: Buffer }]. */
export function pngVersIco(images) {
  const entete = Buffer.alloc(6);
  entete.writeUInt16LE(0, 0); // reserve
  entete.writeUInt16LE(1, 2); // type 1 = icone
  entete.writeUInt16LE(images.length, 4);
  const entrees = [];
  let offset = 6 + 16 * images.length;
  for (const { taille, png } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(taille >= 256 ? 0 : taille, 0);
    e.writeUInt8(taille >= 256 ? 0 : taille, 1);
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserve
    e.writeUInt16LE(1, 4); // plans
    e.writeUInt16LE(32, 6); // bits par pixel
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    entrees.push(e);
  }
  return Buffer.concat([entete, ...entrees, ...images.map((i) => i.png)]);
}

/**
 * Quelles balises <link> Base.astro peut poser : un fichier est disponible s'il est fourni par le site
 * (sites/<slug>/public/) ou generable (favicon.svg present). Sans favicon.svg ni fichier fourni : rien.
 */
export function iconesDisponibles(root, slug) {
  const pub = resolve(root, 'sites', slug, 'public');
  const svg = existsSync(resolve(pub, 'favicon.svg'));
  const dispo = (f) => svg || existsSync(resolve(pub, f));
  return {
    svg,
    ico: dispo('favicon.ico'),
    apple: dispo('apple-touch-icon.png'),
    manifest: dispo('site.webmanifest'),
  };
}
