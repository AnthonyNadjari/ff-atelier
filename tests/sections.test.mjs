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

// Process "horizon" (docs/veille/squelettes.md § 3b n°2) : chapitre epingle qui defile horizontalement.
test('src/sections/Process/horizon.astro : data-horizontal + .h-track, une etape par ecran, image optionnelle, repli empile', () => {
  const src = stripComments(fs.readFileSync(path.join(SECTIONS_DIR, 'Process', 'horizon.astro'), 'utf8'));
  assert.match(src, /id="process"[^>]*data-horizontal|data-horizontal[^>]*id="process"/, 'section #process porte data-horizontal');
  assert.match(src, /class="h-track/, 'piste .h-track attendue par motion.ts');
  assert.match(src, /p\.image\s*&&/, 'image affichee seulement si process[i].image existe');
  assert.match(src, /<Img\s/, 'photo via <Img> (jamais un <img> brut dans une section partagee)');
  assert.match(src, /min-width:\s*64rem/, 'mise en ligne seulement au-dela de 64rem (motion.ts ne pin jamais en dessous)');
  assert.match(src, /\[data-motion='rich'\]/, 'mise en ligne seulement en motion rich (sinon empile)');
  assert.match(src, /prefers-reduced-motion: no-preference/, 'reduced-motion = etapes empilees');
  assert.doesNotMatch(src, /data-reveal|data-stagger/, 'aucun reveal : le defilement est le geste (regle 21)');
});

// Titres figés des sections partagées (17 oct 2026, fromagerie-ravanel-d, docs/GOUT.md § 5) : chaque titre
// vient de site.wording, avec pour défaut l'ancien titre (aucun site existant ne change) ; « et alentours »
// seulement si le client se déplace (zones.cities ou zones.radiusKm, metierEtVille()/zonesDesservies()).
test('titres des sections partagées : wording.servicesTitle/processTitle/galleryTitle/beforeAfterTitle/logosTitle, défauts inchangés', async () => {
  const { siteSchema } = await loadSchemaModule();
  const w = siteSchema.shape.wording.parse({});
  assert.equal(w.servicesTitle, 'Nos services');
  assert.equal(w.processTitle, 'Notre méthode');
  assert.equal(w.galleryTitle, 'En images');
  assert.equal(w.beforeAfterTitle, 'La transformation');
  assert.equal(w.logosTitle, 'Certifications et garanties');
  assert.equal(siteSchema.shape.wording.parse({ servicesTitle: 'Au comptoir' }).servicesTitle, 'Au comptoir');
  const schemaSrc = fs.readFileSync(path.join(ROOT, 'src', 'lib', 'schema.ts'), 'utf8');
  for (const k of ['servicesTitle', 'processTitle', 'galleryTitle', 'beforeAfterTitle', 'logosTitle']) {
    assert.match(schemaSrc, new RegExp(`${k}: z\\.string\\(\\)\\.default\\([^)]*\\)\\.describe\\(`), `${k} : .default() + .describe()`);
  }
  const lire = (f) => stripComments(fs.readFileSync(path.join(SECTIONS_DIR, f), 'utf8'));
  for (const v of VARIANTS.services) {
    const src = lire(`Services/${v}.astro`);
    assert.match(src, /title=\{site\.wording\.servicesTitle\}/, `Services/${v} : titre depuis wording.servicesTitle`);
    assert.doesNotMatch(src, /title="Nos services"/, `Services/${v} : titre figé`);
    assert.doesNotMatch(src, /et alentours/, `Services/${v} : « et alentours » sans condition`);
    assert.match(src, /metierEtVille\(\)/, `Services/${v} : phrase métier + ville via metierEtVille()`);
  }
  for (const v of VARIANTS.process) assert.match(lire(`Process/${v}.astro`), /site\.wording\.processTitle/, `Process/${v}`);
  assert.match(lire('Proof/gallery.astro'), /site\.wording\.galleryTitle/);
  assert.match(lire('Proof/before-after.astro'), /site\.wording\.beforeAfterTitle/);
  assert.match(lire('Proof/logos.astro'), /site\.wording\.logosTitle/);
  assert.match(lire('Cta/card.astro'), /zonesDesservies\(\) \? ' et alentours' : ''/, 'Cta/card : « et alentours » conditionnel');
  const siteSrc = fs.readFileSync(path.join(ROOT, 'src', 'lib', 'site.ts'), 'utf8');
  assert.match(siteSrc, /zonesDesservies = \(s: Site = site\) => s\.zones\.cities\.length > 0 \|\| s\.zones\.radiusKm != null/);
  assert.match(siteSrc, /zonesDesservies\(s\) \? ' et alentours' : ''/);
});
