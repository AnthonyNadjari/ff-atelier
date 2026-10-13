/**
 * Typographie française appliquée au BUILD, sur le HTML final (13 oct 2026).
 *
 * Pourquoi : `ff typo --corriger` réécrit les sources, mais une bonne part du texte affiché n'y est pas
 * écrit en toutes lettres : numéro de téléphone saisi « 06 12 34 56 78 », horaires « 7 h 30 – 18 h »,
 * gabarits partagés, frontmatter des sections sur mesure, expressions Astro. Au rodage du 13 oct 2026,
 * un seul site neuf sortait 104 fautes dures pour deux champs. Ici, chaque page construite passe par le
 * même noyau pur que `ff typo` (`corrigerTexte`, scripts/ff/typo.mjs), qui ne touche jamais une balise,
 * un attribut, une entité, une URL ou un e-mail. Les blocs non textuels (script, JSON-LD, style, code,
 * pre, svg, template...), les commentaires et le doctype sont mis de côté avant et remis tels quels.
 *
 * `ff typo` reste le contrôle : il lit dist/, donc il voit le résultat de cette passe.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { corrigerTexte } from './ff/typo.mjs';

const OPAQUES = /<(script|style|code|pre|kbd|samp|svg|noscript|template|textarea)\b[\s\S]*?<\/\1\s*>|<!--[\s\S]*?-->|<!doctype[^>]*>/gi;

/** Corrige le texte visible d'une page HTML complète. Pure, testée (tests/typo.test.mjs). */
export function composerHtml(html) {
  let out = '';
  let dernier = 0;
  for (const m of String(html).matchAll(OPAQUES)) {
    out += corrigerTexte(html.slice(dernier, m.index)) + m[0];
    dernier = m.index + m[0].length;
  }
  return out + corrigerTexte(html.slice(dernier));
}

function htmlFiles(dir) {
  const out = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (f.endsWith('.html')) out.push(p);
  }
  return out;
}

export function typoIntegration() {
  return {
    name: 'ff-typo',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        let n = 0;
        for (const file of htmlFiles(fileURLToPath(dir))) {
          const html = readFileSync(file, 'utf8');
          const next = composerHtml(html);
          if (next !== html) { writeFileSync(file, next); n++; }
        }
        if (n) logger.info(`ff-typo : typographie française appliquée à ${n} page(s)`);
      },
    },
  };
}
