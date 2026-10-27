/**
 * Registre des sections : src/sections/<Type>/<variante>.astro
 * Le nom de fichier est la variante en kebab-case (ex: form-split.astro).
 */
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

import { customSections, sectionModules } from 'virtual:ff-look';

// Seules les variantes que CE site rend sont importees (scripts/vite-ff-look.mjs, composantsDuSite) : Astro met dans
// la feuille de chaque page le CSS de tout module atteignable, meme par un glob paresseux ; globber tout src/sections
// livrait ~50 Ko de styles de sections jamais rendues sur chaque page de chaque site (26 oct 2026). Repli (layout
// illisible) : tout src/sections, comme avant.
// Aucun import.meta.glob ici : meme dans une branche morte, il mettrait tout src/sections dans le graphe.
const files: Record<string, { default: AstroComponentFactory }> = Object.fromEntries(
  Object.entries(sectionModules as Record<string, AstroComponentFactory>).map(([k, c]) => [`/src/sections/${k}.astro`, { default: c }]),
);

const registry = new Map<string, AstroComponentFactory>();
for (const [path, mod] of Object.entries(files)) {
  const m = path.match(/\/src\/sections\/([^/]+)\/([^/]+)\.astro$/);
  if (!m) continue;
  registry.set(`${m[1].toLowerCase()}/${m[2].toLowerCase()}`, mod.default);
}
// Sections propres au site courant (sites/<slug>/sections/<Nom>.astro), resolues au build par
// scripts/vite-ff-look.mjs : `custom/<nom>` dans le layout. Les autres sites ne sont jamais compiles.
for (const [name, component] of Object.entries(customSections as Record<string, AstroComponentFactory>)) {
  registry.set(`custom/${name}`, component);
}

export function getSection(type: string, variant: string): AstroComponentFactory {
  const c = registry.get(`${type.toLowerCase()}/${variant.toLowerCase()}`);
  if (!c) {
    const available = [...registry.keys()].filter((k) => k.startsWith(type.toLowerCase() + '/')).join(', ');
    throw new Error(`Section ${type}/${variant} introuvable. Disponibles : ${available || '(aucune)'} (seules les variantes du layout de ce site sont compilees : scripts/vite-ff-look.mjs, composantsDuSite ; une variante demandee par une page doit y etre ajoutee)`);
  }
  return c;
}

export const sectionsDisponibles = () => [...registry.keys()].sort();

/** Resout `custom/<nom>` ou une variante partagee pour un type donne. */
export function resolveSection(type: string, variant: string): AstroComponentFactory {
  return variant.startsWith('custom/') ? getSection('custom', variant.slice(7)) : getSection(type, variant);
}
