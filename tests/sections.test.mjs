// Tests des sections (src/sections/<Type>/<variante>.astro) contre le registre VARIANTS
// (src/lib/schema.ts) : couverture complete, pas d'orphelin, regles de docs/CONVENTIONS.md.
// Tout est decouvert dynamiquement depuis le systeme de fichiers : aucun compte code en dur,
// pour rester valide au fur et a mesure que d'autres agents ajoutent des variantes.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { loadSchemaModule, cleanTmp, ROOT } from '../scripts/ff/ts-loader.mjs';

const SECTIONS_DIR = path.join(ROOT, 'src', 'sections');
const { VARIANTS } = await loadSchemaModule();

after(() => cleanTmp());

/** Dossiers reels de src/sections/, ex: ["About", "Contact", ...] */
function listSectionTypeFolders() {
  return fs
    .readdirSync(SECTIONS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

/** Map type (kebab/lowercase de VARIANTS) -> dossier reel (case-insensitive), ou undefined. */
function findFolderForType(type) {
  return listSectionTypeFolders().find((f) => f.toLowerCase() === type.toLowerCase());
}

/** Retire les commentaires HTML/JS d'un fichier .astro avant d'y chercher un motif interdit. */
function stripComments(src) {
  return src
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((line) => (line.trim().startsWith('//') ? '' : line))
    .join('\n');
}

function listAstroFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.astro'))
    .map((d) => d.name);
}

test('chaque variante listee dans VARIANTS a un fichier src/sections/<Type>/<variante>.astro', () => {
  const missing = [];
  for (const [type, variants] of Object.entries(VARIANTS)) {
    const folder = findFolderForType(type);
    if (!folder) {
      missing.push(`dossier introuvable pour le type "${type}" (attendu, insensible a la casse)`);
      continue;
    }
    const files = new Set(listAstroFiles(path.join(SECTIONS_DIR, folder)).map((f) => f.toLowerCase()));
    for (const variant of variants) {
      if (!files.has(`${variant.toLowerCase()}.astro`)) {
        missing.push(`src/sections/${folder}/${variant}.astro manquant (type "${type}")`);
      }
    }
  }
  assert.deepEqual(missing, [], `Variantes sans fichier :\n${missing.join('\n')}`);
});

test('aucun fichier .astro orphelin dans src/sections (non liste dans VARIANTS)', () => {
  const orphans = [];
  for (const folder of listSectionTypeFolders()) {
    const type = Object.keys(VARIANTS).find((t) => t.toLowerCase() === folder.toLowerCase());
    const declaredVariants = type ? new Set(VARIANTS[type].map((v) => v.toLowerCase())) : new Set();
    for (const file of listAstroFiles(path.join(SECTIONS_DIR, folder))) {
      const variant = file.replace(/\.astro$/, '');
      if (!type || !declaredVariants.has(variant.toLowerCase())) {
        orphans.push(`src/sections/${folder}/${file} (type "${folder}" ${type ? `variante "${variant}" absente de VARIANTS.${type}` : 'absent de VARIANTS'})`);
      }
    }
  }
  assert.deepEqual(orphans, [], `Fichiers orphelins :\n${orphans.join('\n')}`);
});

// Un test par fichier .astro reellement present : plus lisible dans la sortie `node --test`,
// et chaque section a sa propre assertion independante des autres.
const allSectionFiles = [];
for (const folder of listSectionTypeFolders()) {
  for (const file of listAstroFiles(path.join(SECTIONS_DIR, folder))) {
    allSectionFiles.push({ folder, file, full: path.join(SECTIONS_DIR, folder, file) });
  }
}

for (const { folder, file, full } of allSectionFiles) {
  test(`src/sections/${folder}/${file} respecte les conventions (tokens, id, import)`, () => {
    const raw = fs.readFileSync(full, 'utf8');
    const cleaned = stripComments(raw);

    assert.match(raw, /from\s+['"]@\/lib\/site['"]/, `doit importer depuis '@/lib/site'`);

    const hexMatches = cleaned.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
    assert.deepEqual(hexMatches, [], `couleur hexadecimale en dur trouvee : ${hexMatches.join(', ')} (utiliser les tokens)`);

    assert.doesNotMatch(cleaned, /font-family\s*:/i, `"font-family:" en dur trouve (utiliser font-display/font-body/font-mono)`);

    // docs/CONVENTIONS.md liste explicitement les id requis : "id = services, about, proof, zones,
    // process, faq, contact" — hero/nav/footer sont geres a part (hero id="hero", nav sans id, footer
    // est une balise <footer>), et "cta" en est absent : aucun lien n'ancre vers #cta (le bouton devis
    // pointe toujours vers #contact), donc les 3 variantes Cta/*.astro n'en portent pas. On suit la loi
    // documentee plutot que d'inventer une regle "cta doit avoir un id" que le code ne respecte pas.
    const excluded = ['hero', 'nav', 'footer', 'cta'];
    if (!excluded.includes(folder.toLowerCase())) {
      const idRe = new RegExp(`id=["']${folder.toLowerCase()}["']`);
      assert.match(raw, idRe, `section racine doit porter id="${folder.toLowerCase()}"`);
    }
  });
}
