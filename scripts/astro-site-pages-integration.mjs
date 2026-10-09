/**
 * Integration Astro `ff-site-pages` : pages sur mesure d'un site, `sites/<slug>/pages/**\/*.astro`,
 * injectees comme routes (meme mecanisme que /credits, scripts/astro-credits-integration.mjs). Un
 * site sans dossier `pages/` (tous sauf finck-fisch au 9 oct 2026) n'a aucune route de plus.
 *
 * Correspondance fichier -> route : `audit.astro` -> /audit, `audit/merci.astro` -> /audit/merci,
 * `x/index.astro` -> /x. Pas de parametres dynamiques (un fichier = une page). Une route qui existe
 * deja dans src/pages (/, /mentions-legales...) ne peut pas etre redefinie ici : erreur au build.
 *
 * Une page qui passe `noindex` a Base.astro est retiree du sitemap (siteNoindexRoutes, lu par le
 * filtre de @astrojs/sitemap dans astro.config.mjs) : jamais de page noindex dans le sitemap.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

/** Liste des pages du site : [{ pattern, file }]. Fonction pure sur le systeme de fichiers. */
export function sitePages(root, slug) {
  const dir = resolve(root, 'sites', slug, 'pages');
  if (!existsSync(dir)) return [];
  const out = [];
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.astro')) {
        const rel = relative(dir, p).replace(/\\/g, '/').replace(/\.astro$/, '').replace(/(^|\/)index$/, '');
        out.push({ pattern: `/${rel}`.replace(/\/$/, '') || '/', file: p });
      }
    }
  };
  walk(dir);
  return out.sort((a, b) => a.pattern.localeCompare(b.pattern));
}

/** Routes noindex (la page passe `noindex` a Base) : a exclure du sitemap. */
export function siteNoindexRoutes(root, slug) {
  return sitePages(root, slug)
    .filter(({ file }) => /<Base\b[^>]*\bnoindex\b/s.test(readFileSync(file, 'utf8')))
    .map(({ pattern }) => pattern);
}

export function sitePagesIntegration({ root, slug }) {
  return {
    name: 'ff-site-pages',
    hooks: {
      'astro:config:setup': ({ injectRoute }) => {
        for (const { pattern, file } of sitePages(root, slug)) injectRoute({ pattern, entrypoint: file });
      },
    },
  };
}
