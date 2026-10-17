// Redirections d'un site (sites/<slug>/redirects.json, format Vercel `{ redirects: [{ source, destination,
// statusCode }] }`, écrit à la main ou par `ff refonte`) → fichier `_redirects` de Cloudflare Pages, écrit au
// build à côté de `_headers` (astro.config.mjs, intégration ff-headers). `ff vercel` lit toujours redirects.json
// directement (vercel.json) ; le `_redirects` sert aux sites clients, qui sont sur Cloudflare.
//
// Pourquoi (17 oct 2026) : `ff refonte` remplace le vieux site d'un client ; sans redirections, ses anciennes
// adresses connues de Google tombent en 404 et il perd son référencement. Seul `ff vercel` les appliquait.
import fs from 'node:fs';
import path from 'node:path';

/** Pur : motif Vercel (`/a/:slug*`, `/b/:id`) → motif Cloudflare (`/a/*`, `/b/:id`) et destination adaptée. */
export function versCloudflare({ source, destination, statusCode, permanent }) {
  if (!source || !destination) return null;
  const code = statusCode || (permanent === false ? 302 : 301);
  // `:param*` (zéro ou plusieurs segments) → splat `*`, rappelé par `:splat` dans la destination.
  const m = /:([A-Za-z_]\w*)\*$/.exec(source);
  let src = source;
  let dest = destination;
  if (m) {
    src = source.slice(0, m.index) + '*';
    dest = destination.replace(new RegExp(`:${m[1]}\\*?`, 'g'), ':splat');
  }
  if (/[()[\]?+]/.test(src)) return null; // expression régulière Vercel : pas d'équivalent sûr
  return `${src} ${dest} ${code}`;
}

/** Pur : contenu de redirects.json (objet ou tableau) → texte `_redirects` (une règle par ligne). */
export function redirectsCloudflare(json) {
  const liste = Array.isArray(json) ? json : (json?.redirects ?? []);
  const lignes = liste.map(versCloudflare).filter(Boolean);
  return lignes.length ? `# Généré au build depuis sites/<slug>/redirects.json (scripts/ff/redirections.mjs)\n${lignes.join('\n')}\n` : '';
}

/** Écrit `<outDir>/_redirects` si le site a des redirections. Renvoie le nombre de règles écrites. */
export function ecrireRedirectsCloudflare(siteDir, outDir) {
  const p = path.join(siteDir, 'redirects.json');
  if (!fs.existsSync(p)) return 0;
  const texte = redirectsCloudflare(JSON.parse(fs.readFileSync(p, 'utf8')));
  if (!texte) return 0;
  fs.writeFileSync(path.join(outDir, '_redirects'), texte);
  return texte.split('\n').filter((l) => l && !l.startsWith('#')).length;
}
