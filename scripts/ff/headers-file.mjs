// Lecteur minimal du fichier `_headers` genere par astro.config.mjs (integration `ff-headers`,
// format Cloudflare Pages : https://developers.cloudflare.com/pages/configuration/headers/).
// Sert a APPLIQUER ces regles dans les serveurs statiques locaux du repo (scripts/captures.mjs,
// scripts/serve-all.mjs) : sans ca, une capture/visite locale ne voit jamais la CSP reelle
// (Cloudflare seul l'applique en production) — ce qui rendrait un `console error` de CSP invisible
// avant le premier vrai deploiement. Ne gere QUE les motifs produits par ce repo (`/*`, `/*.ext`,
// `/prefixe/*`, chemin exact) : pas un moteur de glob general, juste ce que Cloudflare Pages
// documente et que `astro.config.mjs` genere reellement.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Parse le texte d'un fichier `_headers` en regles { pattern, headers: [[nom, valeur], ...] }. */
export function parseHeadersFile(text) {
  const rules = [];
  let current = null;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (!line.trim()) { current = null; continue; }
    if (!line.startsWith(' ') && !line.startsWith('\t')) {
      current = { pattern: line.trim(), headers: [] };
      rules.push(current);
      continue;
    }
    if (!current) continue; // ligne indentee orpheline (fichier malforme) : ignoree
    const i = line.indexOf(':');
    if (i === -1) continue;
    current.headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]);
  }
  return rules;
}

/** Un motif `_headers` (voir en-tete du fichier) correspond-il a ce chemin ? */
function patternMatches(pattern, pathname) {
  if (pattern === '/*') return true;
  if (pattern.endsWith('/*')) return pathname.startsWith(pattern.slice(0, -1));
  if (pattern.startsWith('/*.')) return pathname.endsWith(pattern.slice(1));
  return pattern === pathname;
}

/** En-tetes fusionnes (derniere regle correspondante gagne pour un meme nom, comme Cloudflare Pages) pour un chemin. */
export function headersForPath(rules, pathname) {
  const merged = new Map();
  for (const rule of rules) {
    if (!patternMatches(rule.pattern, pathname)) continue;
    for (const [name, value] of rule.headers) merged.set(name, value);
  }
  return merged;
}

/** Charge et parse dist/<slug>/_headers ; renvoie [] si absent (site construit avant cette fonctionnalite, ou hors astro.config.mjs). */
export function loadHeadersRules(distDir) {
  const p = join(distDir, '_headers');
  if (!existsSync(p)) return [];
  return parseHeadersFile(readFileSync(p, 'utf8'));
}
