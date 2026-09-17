/**
 * Integration Astro `ff-images` : apres le build, reecrit dans chaque HTML les <img src="/images/x.webp">
 * simples (sections sur mesure, anciens composants) en <picture> avec sources AVIF + WebP par largeur,
 * width/height (anti-CLS) et decoding async, a partir du manifeste sites/<slug>/images.json produit par
 * `ff images`. Les <img> qui portent deja un srcset ou sont dans un <picture> sont laisses tels quels.
 */
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function htmlFiles(dir) {
  const out = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (f.endsWith('.html')) out.push(p);
  }
  return out;
}

export function rewriteImages(html, manifest, { defaultSizes = '100vw' } = {}) {
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
      const widths = entry.widths;
      const sizes = (attrs.match(/\bsizes="([^"]+)"/i) || [])[1] || defaultSizes;
      // La plus grande largeur est ecrite sans suffixe par `ff images` (alias <name>.<fmt>).
      const maxW = Math.max(...widths);
      const srcset = (fmt) => widths.map((w) => `/images/${name}${w === maxW ? '' : `-${w}`}.${fmt} ${w}w`).join(', ');
      let imgAttrs = attrs.replace(/\bsizes="[^"]*"/i, '').trim();
      if (!/\bwidth=/.test(imgAttrs) && entry.ratio) {
        const w = Math.max(...widths);
        imgAttrs += ` width="${w}" height="${Math.round(w / entry.ratio)}"`;
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
