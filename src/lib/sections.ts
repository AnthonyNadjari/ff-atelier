/**
 * Registre des sections : src/sections/<Type>/<variante>.astro
 * Le nom de fichier est la variante en kebab-case (ex: form-split.astro).
 */
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

const files = import.meta.glob<{ default: AstroComponentFactory }>('/src/sections/*/*.astro', { eager: true });

const registry = new Map<string, AstroComponentFactory>();
for (const [path, mod] of Object.entries(files)) {
  const m = path.match(/\/src\/sections\/([^/]+)\/([^/]+)\.astro$/);
  if (!m) continue;
  registry.set(`${m[1].toLowerCase()}/${m[2].toLowerCase()}`, mod.default);
}

export function getSection(type: string, variant: string): AstroComponentFactory {
  const c = registry.get(`${type.toLowerCase()}/${variant.toLowerCase()}`);
  if (!c) {
    const available = [...registry.keys()].filter((k) => k.startsWith(type.toLowerCase() + '/')).join(', ');
    throw new Error(`Section ${type}/${variant} introuvable. Disponibles : ${available || '(aucune)'}`);
  }
  return c;
}

export const sectionsDisponibles = () => [...registry.keys()].sort();
