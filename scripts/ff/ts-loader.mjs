// Charge du TypeScript (src/lib/*.ts) sans passer par un build Astro — utilise par `ff matrice`
// (scripts/ff/matrice.mjs) pour lire DIRECTIONS/VARIANTS/DIVIDERS/SCALES/TONES et le contenu reel
// de sites/_exemple/site.config.ts, et par tests/*.test.mjs pour les memes raisons.
// Node 22 sait "type-stripper" du TS simple (pas d'enum, pas de decorateurs) sans flag ni
// transpilation, mais la resolution ESM standard exige une extension explicite sur les specifiers
// relatifs — ce que src/lib/*.ts (ecrit pour le bundler Astro/Vite) omet, et l'alias '@/lib/...'
// n'existe que dans tsconfig.json/astro, pas pour node. On copie donc les fichiers necessaires dans
// <racine>/.ff-tmp/ en reecrivant imports relatifs (+extension) et alias (chemin relatif), puis on
// les importe normalement. Si un jour node ne sait plus lire un .ts directement (flag retire...),
// les appelants de canImportTs() peuvent retomber sur une extraction regex du texte source.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '..', '..');
// Prefixe par le pid : `node --test tests/` lance chaque fichier de test dans son propre processus,
// en parallele ; un dossier temporaire partage provoquerait des courses (l'un supprime pendant que
// l'autre lit/ecrit). Chaque processus a donc son propre TMP_DIR, nettoye par son propre cleanTmp().
export const TMP_DIR = path.join(ROOT, '.ff-tmp', `ts-loader-${process.pid}`);

/** Ajoute ".ts" aux specifiers relatifs sans extension dans un import/export. */
function addTsExtensions(src) {
  return src.replace(/((?:from|import)\s+)(['"])(\.\.?\/[^'"]+)\2/g, (m, kw, q, spec) => {
    if (/\.[a-zA-Z0-9]+$/.test(spec)) return m;
    return `${kw}${q}${spec}.ts${q}`;
  });
}

/**
 * Verifie que node peut importer un .ts directement (type-stripping actif, syntaxe simple).
 * Renvoie true/false ; ne lance jamais.
 */
export async function canImportTs() {
  try {
    await import(pathToFileURL(path.join(ROOT, 'src', 'lib', 'fonts.ts')).href);
    return true;
  } catch {
    return false;
  }
}

/**
 * Copie src/lib/schema.ts + src/lib/fonts.ts dans TMP_DIR/lib/ avec imports relatifs corriges,
 * puis les importe. Renvoie le module schema (DIRECTIONS, VARIANTS, MOTION, DIVIDERS, SCALES,
 * TONES, siteSchema, defineSite...).
 */
export async function loadSchemaModule() {
  const libDir = path.join(TMP_DIR, 'lib');
  fs.mkdirSync(libDir, { recursive: true });
  for (const name of ['schema.ts', 'fonts.ts']) {
    const src = fs.readFileSync(path.join(ROOT, 'src', 'lib', name), 'utf8');
    fs.writeFileSync(path.join(libDir, name), addTsExtensions(src));
  }
  const url = pathToFileURL(path.join(libDir, 'schema.ts')).href;
  return import(url);
}

/**
 * Copie sites/<slug>/site.config.ts dans TMP_DIR/sites/<slug>/, en remplacant l'alias
 * '@/lib/schema' par un chemin relatif vers la copie de schema.ts prepare par loadSchemaModule(),
 * puis l'importe. Renvoie le module (export default = objet Site deja valide par defineSite).
 */
export async function loadSiteConfigModule(slug) {
  await loadSchemaModule(); // assure que TMP_DIR/lib/schema.ts existe
  const srcPath = path.join(ROOT, 'sites', slug, 'site.config.ts');
  const destDir = path.join(TMP_DIR, 'sites', slug);
  fs.mkdirSync(destDir, { recursive: true });
  let src = fs.readFileSync(srcPath, 'utf8');
  src = src.replace(/(['"])@\/lib\/schema\1/g, `'../../lib/schema.ts'`);
  const destPath = path.join(destDir, 'site.config.ts');
  fs.writeFileSync(destPath, src);
  const url = pathToFileURL(destPath).href;
  return import(url);
}

/**
 * Copie src/lib/schemaType.ts (module pur, aucune dependance) dans TMP_DIR/lib/ et l'importe.
 * Renvoie { schemaTypeForTrade } — re-exporte par src/lib/site.ts mais teste ici isolement, car
 * site.ts ne s'importe pas dans Node nu (import.meta.glob n'existe que sous Vite).
 */
export async function loadSchemaTypeModule() {
  const libDir = path.join(TMP_DIR, 'lib');
  fs.mkdirSync(libDir, { recursive: true });
  const src = fs.readFileSync(path.join(ROOT, 'src', 'lib', 'schemaType.ts'), 'utf8');
  fs.writeFileSync(path.join(libDir, 'schemaType.ts'), addTsExtensions(src));
  const url = pathToFileURL(path.join(libDir, 'schemaType.ts')).href;
  return import(url);
}

export function cleanTmp() {
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
}
