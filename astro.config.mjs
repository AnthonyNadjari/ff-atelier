// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { FontaineTransform } from 'fontaine';
import { ffLookPlugin } from './scripts/vite-ff-look.mjs';
import { imagesIntegration } from './scripts/astro-images-integration.mjs';
import { creditsIntegration } from './scripts/astro-credits-integration.mjs';
import { iconsIntegration } from './scripts/astro-icons-integration.mjs';
import { typoIntegration } from './scripts/astro-typo-integration.mjs';
import { sitePagesIntegration, siteNoindexRoutes } from './scripts/astro-site-pages-integration.mjs';
import { readSiteSecurityConfig, buildSecurityHeaderLines } from './scripts/ff/csp.mjs';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
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

// Config securite (CSP, Turnstile, provider de formulaire, carte) : lue par regex dans
// site.config.ts (scripts/ff/csp.mjs, meme motif que verifier.mjs/dev-build-preview.mjs — pas
// d'import TS hors contexte Vite). Sert a construire une CSP par site (docs/DEPLOIEMENT.md § Securite).
const configFile = resolve(siteDir, 'site.config.ts');
const securityConfig = readSiteSecurityConfig(existsSync(configFile) ? readFileSync(configFile, 'utf8') : '');
// data-lottie n'est pas dans site.config.ts mais dans les sections sur mesure du site : on le
// cherche la, pour n'ouvrir la CSP au CDN du moteur WASM que sur les sites qui s'en servent.
const sectionsDir = resolve(siteDir, 'sections');
securityConfig.usesLottie = existsSync(sectionsDir)
  && readdirSync(sectionsDir).some((f) => f.endsWith('.astro') && /data-lottie/.test(readFileSync(resolve(sectionsDir, f), 'utf8')));

/**
 * FF_LOOK : JSON d'un look (memes cles que look.json) injecte par `ff propositions` / `ff matrice`
 * sans toucher au dossier du site. FF_OUT : dossier de sortie alternatif (ex: dist/_prop-<slug>-1).
 */
const ffLook = process.env.FF_LOOK || '';
if (ffLook) JSON.parse(ffLook); // echoue tot si invalide
const outDir = process.env.FF_OUT || `dist/${slug}`;
const noindexSitePages = siteNoindexRoutes(process.cwd(), slug);

/**
 * Cloudflare Pages lit un fichier `_headers` a la racine du dossier deploye : cache long et immuable
 * sur les fichiers empreintes (/_astro/*), pas de cache sur le HTML, en-tetes de securite de base.
 */
const headersIntegration = {
  name: 'ff-headers',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const { writeFileSync } = await import('node:fs');
      const { fileURLToPath } = await import('node:url');
      const { join } = await import('node:path');
      const out = fileURLToPath(dir);
      writeFileSync(join(out, '_headers'), [
        '/_astro/*', '  Cache-Control: public, max-age=31536000, immutable', '',
        '/images/*', '  Cache-Control: public, max-age=2592000', '',
        '/*.html', '  Cache-Control: public, max-age=0, must-revalidate', '',
        '/*',
        '  X-Content-Type-Options: nosniff',
        '  Referrer-Policy: strict-origin-when-cross-origin',
        '  X-Frame-Options: SAMEORIGIN',
        ...buildSecurityHeaderLines(securityConfig),
        '',
      ].join('\n'));
    },
  },
};

export default defineConfig({
  site: domain ? `https://${domain}` : `https://${slug}.pages.dev`,
  publicDir: `sites/${slug}/public`,
  outDir,
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  integrations: [
    // /credits est noindex (page utilitaire, voir src/pages-optional/credits.astro) : jamais dans
    // le sitemap, meme quand la route est injectee (docs/veille/redaction-images.md §2).
    // Pages sur mesure noindex (sites/<slug>/pages, ex. /audit/merci) : hors sitemap aussi.
    sitemap({ filter: (page) => !/\/credits\/?$/.test(page) && !noindexSitePages.some((r) => new URL(page).pathname.replace(/\/$/, '') === r) }),
    // Pages sur mesure du site (sites/<slug>/pages/**/*.astro), voir scripts/astro-site-pages-integration.mjs.
    sitePagesIntegration({ root: process.cwd(), slug }),
    headersIntegration,
    imagesIntegration({ root: process.cwd(), slug }),
    creditsIntegration({ root: process.cwd(), slug }),
    // favicon.ico, apple-touch-icon, icon-192/512, site.webmanifest depuis public/favicon.svg (scripts/astro-icons-integration.mjs).
    iconsIntegration({ root: process.cwd(), slug, ffLook }),
    // Typographie française sur le HTML final (insécables, guillemets, apostrophes), en dernier : voir
    // scripts/astro-typo-integration.mjs. `ff typo` contrôle le résultat.
    typoIntegration(),
  ],
  vite: {
    plugins: [
      // Direction + polices resolues au build (voir scripts/vite-ff-look.mjs) : une seule direction dans le graphe.
      ffLookPlugin({ root: process.cwd(), slug, ffLook }),
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
