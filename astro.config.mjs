// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Un seul projet Astro, N sites. Le site courant vient de :
 *   1. la variable d'environnement SITE (posee par scripts/ff.mjs)
 *   2. sinon le fichier .ff-current
 *   3. sinon "_exemple"
 */
const slug =
  process.env.SITE ||
  (existsSync('.ff-current') ? readFileSync('.ff-current', 'utf8').trim() : '') ||
  '_exemple';

const siteDir = resolve('sites', slug);
if (!existsSync(siteDir)) {
  throw new Error(`Site introuvable : sites/${slug}. Lance \`npm run ff -- nouveau ${slug}\` d'abord.`);
}

// Domaine (pour sitemap, canonical, OG) : lu dans sites/<slug>/domain.txt si present.
const domainFile = resolve(siteDir, 'domain.txt');
const domain = existsSync(domainFile) ? readFileSync(domainFile, 'utf8').trim() : '';

export default defineConfig({
  site: domain ? `https://${domain}` : `https://${slug}.pages.dev`,
  publicDir: `sites/${slug}/public`,
  outDir: `dist/${slug}`,
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    define: { 'import.meta.env.SITE': JSON.stringify(slug) },
  },
});
