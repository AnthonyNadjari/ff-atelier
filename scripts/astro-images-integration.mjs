/**
 * Integration Astro `ff-images` : apres le build, reecrit dans chaque HTML les <img src="/images/x.webp">
 * simples (sections sur mesure, anciens composants) en <picture> avec sources AVIF + WebP par largeur,
 * width/height (anti-CLS) et decoding async, a partir du manifeste sites/<slug>/images.json produit par
 * `ff images`. Les <img> qui portent deja un srcset ou sont dans un <picture> sont laisses tels quels.
 *
 * `sizes` : c'est lui qui decide quel candidat du srcset le navigateur telecharge (largeur affichee x
 * DPR). Un `sizes` faux, c'est une image floue (trop petit) ou lourde (trop grand), quelle que soit la
 * richesse du srcset. Regle :
 *   1. un attribut `sizes` deja pose sur le <img> est conserve tel quel — c'est LA facon pour une
 *      section sur mesure de dire sa vraie largeur d'affichage (voir docs/CONVENTIONS.md) ;
 *   2. sinon, un <img> du premier ecran (`fetchpriority="high"` ou `loading="eager"`) est traite comme
 *      un hero pleine largeur : `100vw` ;
 *   3. sinon, on suppose une image de grille (3 colonnes en desktop, 2 en tablette, 1 en mobile) :
 *      SIZES_GRILLE. Deviner plus finement depuis les classes/parents est trop fragile — pose `sizes`.
 * Le dernier palier mobile est toujours `100vw` : sur un telephone @3x (390 px), 100vw = 1 170 px,
 * le navigateur prend alors le candidat 1200 — c'est la regle que `ff perf` compte (scripts/ff/perf.mjs).
 */
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SIZES_PLEINE_LARGEUR = '100vw';
export const SIZES_GRILLE = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw';

function htmlFiles(dir) {
  const out = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (f.endsWith('.html')) out.push(p);
  }
  return out;
}

/** `sizes` retenu pour un <img> (attrs = ses attributs bruts) : explicite > premier ecran > grille. */
export function sizesFor(attrs, { defaultSizes = SIZES_GRILLE, heroSizes = SIZES_PLEINE_LARGEUR } = {}) {
  const explicit = (attrs.match(/\bsizes="([^"]+)"/i) || [])[1];
  if (explicit) return explicit.trim();
  if (/\bfetchpriority="high"/i.test(attrs) || /\bloading="eager"/i.test(attrs)) return heroSizes;
  return defaultSizes;
}

export function rewriteImages(html, manifest, options = {}) {
  let count = 0;
  // Segments deja dans un <picture> : on ne les touche pas.
  const parts = html.split(/(<picture[\s\S]*?<\/picture>)/i);
  const out = parts.map((part, i) => {
    if (i % 2 === 1) return part;
    return part.replace(/<img\b([^>]*?)\/?>/gi, (tag, attrs) => {
      if (/\bsrcset=/i.test(attrs) || /\bdata-ff-img\b/.test(attrs)) return tag;
      const m = attrs.match(/\bsrc="\/images\/([^"/]+)\.(webp|avif|jpe?g|png)"/i);
      if (!m) return tag;
      const name = m[1];
      const entry = manifest[name];
      if (!entry || !entry.widths?.length) return tag;
      // Toutes les largeurs du manifeste, triees : le navigateur choisit le plus petit candidat >= besoin.
      const widths = [...entry.widths].sort((a, b) => a - b);
      const sizes = sizesFor(attrs, options);
      // La plus grande largeur est ecrite sans suffixe par `ff images` (alias <name>.<fmt>).
      const maxW = Math.max(...widths);
      const srcset = (fmt) => widths.map((w) => `/images/${name}${w === maxW ? '' : `-${w}`}.${fmt} ${w}w`).join(', ');
      let imgAttrs = attrs.replace(/\bsizes="[^"]*"/i, '').replace(/\s{2,}/g, ' ').trim();
      if (!/\bwidth=/.test(imgAttrs) && entry.ratio) {
        imgAttrs += ` width="${maxW}" height="${Math.round(maxW / entry.ratio)}"`;
      }
      if (!/\bdecoding=/.test(imgAttrs)) imgAttrs += ' decoding="async"';
      const hasAvif = (entry.formats || []).includes('avif');
      count++;
      return (
        '<picture>' +
        (hasAvif ? `<source type="image/avif" srcset="${srcset('avif')}" sizes="${sizes}">` : '') +
        `<source type="image/webp" srcset="${srcset('webp')}" sizes="${sizes}">` +
        `<img ${imgAttrs}>` +
        '</picture>'
      );
    });
  });
  return { html: out.join(''), count };
}

export function imagesIntegration({ root, slug }) {
  return {
    name: 'ff-images',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const manifestPath = resolve(root, 'sites', slug, 'images.json');
        if (!existsSync(manifestPath)) return;
        const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
        const outDir = fileURLToPath(dir);
        let total = 0;
        for (const file of htmlFiles(outDir)) {
          const html = readFileSync(file, 'utf8');
          const { html: next, count } = rewriteImages(html, manifest);
          if (count) { writeFileSync(file, next); total += count; }
        }
        if (total) logger.info(`ff-images : ${total} <img> reecrites en <picture> (AVIF + WebP)`);
      },
    },
  };
}
