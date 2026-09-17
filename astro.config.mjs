// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { FontaineTransform } from 'fontaine';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Un seul projet Astro, N sites. Le site courant vient de :
 *   1. la variable d'environnement SITE (posee par scripts/ff.mjs)
 *   2. sinon le fichier .ff-current
 *   3. sinon "_exemple"
 */
let slug = process.env.SITE || '';
if (!slug && existsSync('.ff-current')) {
  const current = readFileSync('.ff-current', 'utf8').trim();
  if (current && existsSync(resolve('sites', current))) slug = current;
  else if (current) console.warn(`.ff-current pointe vers sites/${current} qui n'existe plus : repli sur _exemple.`);
}
slug ||= '_exemple';

const siteDir = resolve('sites', slug);
if (!existsSync(siteDir)) {
  throw new Error(`Site introuvable : sites/${slug}. Lance \`npm run ff -- nouveau ${slug}\` d'abord.`);
}

// Domaine (pour sitemap, canonical, OG) : lu dans sites/<slug>/domain.txt si present.
const domainFile = resolve(siteDir, 'domain.txt');
const domain = existsSync(domainFile) ? readFileSync(domainFile, 'utf8').trim() : '';

/**
 * FF_LOOK : JSON d'un look (memes cles que look.json) injecte par `ff propositions` / `ff matrice`
 * sans toucher au dossier du site. FF_OUT : dossier de sortie alternatif (ex: dist/_prop-<slug>-1).
 */
const ffLook = process.env.FF_LOOK || '';
if (ffLook) JSON.parse(ffLook); // echoue tot si invalide
const outDir = process.env.FF_OUT || `dist/${slug}`;

export default defineConfig({
  site: domain ? `https://${domain}` : `https://${slug}.pages.dev`,
  publicDir: `sites/${slug}/public`,
  outDir,
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  integrations: [sitemap()],
  vite: {
    plugins: [
      tailwindcss(),
      // Fontaine (docs/veille/rendu.md §5.1) : genere automatiquement, pour chaque famille
      // @fontsource-variable/* chargee dynamiquement (src/lib/fonts.ts), un @font-face de
      // repli metric-adjusted (size-adjust/ascent-override/descent-override/line-gap-override)
      // pour reduire le CLS au remplacement police-web -> police systeme. L'API experimentale
      // Astro Fonts (docs.astro.build/en/reference/experimental-flags/fonts) a ete ecartee :
      // elle exige de declarer chaque famille statiquement dans astro.config (contraire au
      // chargement a la demande de FONTS ici, ~90 familles) et ne documente pas font-display.
      FontaineTransform.vite({ fallbacks: ['Georgia', 'Arial'] }),
    ],
    define: { 'import.meta.env.SITE': JSON.stringify(slug), 'import.meta.env.FF_LOOK': JSON.stringify(ffLook) },
  },
});
