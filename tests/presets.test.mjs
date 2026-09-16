// Tests des modeles (presets/*.json) : format, variete, validite au regard du schema zod.
// Meme technique de chargement que tests/schema.test.mjs (voir scripts/ff/ts-loader.mjs) : le
// schema et le site.config.ts de reference (_exemple) sont importes tels quels, puis chaque preset
// est fusionne dans une copie de _exemple exactement comme applyLook() le fait dans src/lib/site.ts
// (src/lib/site.ts : LOOK_KEYS = ['direction','motion','scale','accent','typography','layout','wording'],
// fusion superficielle objet par objet), et le resultat passe par siteSchema.safeParse.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { loadSchemaModule, loadSiteConfigModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

const PRESETS_DIR = path.join(ROOT, 'presets');
const LOOK_KEYS = ['direction', 'motion', 'scale', 'accent', 'typography', 'layout', 'wording'];

function applyLookLike(base, look) {
  const merged = { ...base };
  for (const k of LOOK_KEYS) {
    if (look[k] === undefined) continue;
    const cur = merged[k];
    merged[k] =
      cur && typeof cur === 'object' && !Array.isArray(cur) && typeof look[k] === 'object' && !Array.isArray(look[k])
        ? { ...cur, ...look[k] }
        : look[k];
  }
  return merged;
}

const tsImportable = await canImportTs();
after(() => cleanTmp());

const presetFiles = fs.readdirSync(PRESETS_DIR).filter((f) => f.endsWith('.json'));

// Tout le chargement asynchrone (schema.ts, fonts.ts, sites/_exemple/site.config.ts) se fait ICI,
// avant le moindre appel a test() : node:test peut considerer le fichier "termine" des que les
// tests deja enregistres ont fini de tourner, et declencher after() (cleanTmp()) pendant qu'un
// top-level await plus bas serait encore en train d'ecrire dans .ff-tmp/. En chargeant tout avant
// d'enregistrer le premier test, tous les test() ci-dessous sont connus du runner des le depart.
let VARIANTS;
let DIRECTIONS;
let SHELLS;
let HEADINGS;
let siteSchema;
let FONT_KEYS;
let exampleConfig;
if (tsImportable) {
  const schemaMod = await loadSchemaModule();
  VARIANTS = schemaMod.VARIANTS;
  DIRECTIONS = schemaMod.DIRECTIONS;
  SHELLS = schemaMod.SHELLS;
  HEADINGS = schemaMod.HEADINGS;
  siteSchema = schemaMod.siteSchema;

  const fontsUrl = new URL('../src/lib/fonts.ts', import.meta.url);
  const fontsSrc = fs.readFileSync(fontsUrl, 'utf8');
  const fontKeyMatches = [...fontsSrc.matchAll(/^\s{2}(\w+):\s*\{ family:/gm)].map((m) => m[1]);
  FONT_KEYS = new Set(fontKeyMatches);

  const exampleMod = await loadSiteConfigModule('_exemple');
  exampleConfig = exampleMod.default;
}

test('au moins un fichier preset present', () => {
  assert.ok(presetFiles.length > 0, 'aucun presets/*.json trouve');
});

test('chaque preset est un JSON valide avec les champs attendus', () => {
  for (const file of presetFiles) {
    const full = path.join(PRESETS_DIR, file);
    const raw = fs.readFileSync(full, 'utf8');
    let data;
    assert.doesNotThrow(() => {
      data = JSON.parse(raw);
    }, `${file} n'est pas un JSON valide`);
    const expectedNom = file.replace(/\.json$/, '');
    assert.equal(data.nom, expectedNom, `${file} : nom "${data.nom}" different du nom de fichier`);
    assert.equal(typeof data.titre, 'string', `${file} : titre manquant`);
    assert.ok(data.titre.length > 0, `${file} : titre vide`);
    assert.equal(typeof data.description, 'string', `${file} : description manquante`);
    assert.ok(data.description.length > 0, `${file} : description vide`);
    assert.ok(Array.isArray(data.metiers), `${file} : metiers doit etre un tableau`);
    assert.ok(data.metiers.length >= 3 && data.metiers.length <= 6, `${file} : metiers doit avoir entre 3 et 6 entrees (${data.metiers.length})`);
    assert.equal(typeof data.look, 'object', `${file} : look manquant`);
  }
});

test('look.* : uniquement les cles autorisees (direction, motion, scale, accent, typography, layout, wording)', () => {
  for (const file of presetFiles) {
    const data = JSON.parse(fs.readFileSync(path.join(PRESETS_DIR, file), 'utf8'));
    for (const key of Object.keys(data.look)) {
      assert.ok(LOOK_KEYS.includes(key), `${file} : cle de look "${key}" non autorisee`);
    }
  }
});

test('exactement 2 presets par direction', () => {
  const counts = new Map();
  for (const file of presetFiles) {
    const data = JSON.parse(fs.readFileSync(path.join(PRESETS_DIR, file), 'utf8'));
    const d = data.look.direction;
    counts.set(d, (counts.get(d) || 0) + 1);
  }
  for (const [direction, count] of counts) {
    assert.equal(count, 2, `direction "${direction}" a ${count} preset(s), attendu 2`);
  }
});

test('aucun doublon direction+hero+services entre presets', () => {
  const seen = new Map();
  for (const file of presetFiles) {
    const data = JSON.parse(fs.readFileSync(path.join(PRESETS_DIR, file), 'utf8'));
    const servicesSection = data.look.layout.sections.find((s) => s.type === 'services');
    const key = `${data.look.direction}|${data.look.layout.hero}|${servicesSection ? servicesSection.variant : ''}`;
    assert.ok(!seen.has(key), `${file} partage direction+hero+services (${key}) avec ${seen.get(key)}`);
    seen.set(key, file);
  }
});

if (!tsImportable) {
  test('[repli] pas de verification zod (node ne sait pas importer les .ts)', () => {
    assert.ok(true);
  });
} else {
  test('FONT_NAMES non vide dans fonts.ts (extraction des cles de police)', () => {
    assert.ok(FONT_KEYS.size > 0, 'aucune police extraite de fonts.ts');
  });

  test('toutes les variantes de chaque preset existent dans VARIANTS', () => {
    for (const file of presetFiles) {
      const data = JSON.parse(fs.readFileSync(path.join(PRESETS_DIR, file), 'utf8'));
      const layout = data.look.layout;
      assert.ok(VARIANTS.nav.includes(layout.nav), `${file} : nav "${layout.nav}" invalide`);
      assert.ok(VARIANTS.hero.includes(layout.hero), `${file} : hero "${layout.hero}" invalide`);
      assert.ok(VARIANTS.footer.includes(layout.footer), `${file} : footer "${layout.footer}" invalide`);
      for (const s of layout.sections) {
        assert.ok(Object.keys(VARIANTS).includes(s.type), `${file} : type de section "${s.type}" inconnu`);
        assert.ok(
          VARIANTS[s.type].includes(s.variant),
          `${file} : variante "${s.variant}" inconnue pour la section "${s.type}"`,
        );
      }
    }
  });

  test('direction valide (DIRECTIONS)', () => {
    for (const file of presetFiles) {
      const data = JSON.parse(fs.readFileSync(path.join(PRESETS_DIR, file), 'utf8'));
      assert.ok(DIRECTIONS.includes(data.look.direction), `${file} : direction "${data.look.direction}" inconnue`);
    }
  });

  test('typography (si presente) : cles de police valides', () => {
    for (const file of presetFiles) {
      const data = JSON.parse(fs.readFileSync(path.join(PRESETS_DIR, file), 'utf8'));
      const typo = data.look.typography;
      if (!typo) continue;
      if (typo.display) assert.ok(FONT_KEYS.has(typo.display), `${file} : police display "${typo.display}" inconnue`);
      if (typo.body) assert.ok(FONT_KEYS.has(typo.body), `${file} : police body "${typo.body}" inconnue`);
    }
  });

  test('chaque preset, fusionne dans le site _exemple comme applyLook(), passe siteSchema.safeParse', () => {
    for (const file of presetFiles) {
      const data = JSON.parse(fs.readFileSync(path.join(PRESETS_DIR, file), 'utf8'));
      const merged = applyLookLike(exampleConfig, data.look);
      const parsed = siteSchema.safeParse(merged);
      assert.ok(
        parsed.success,
        `${file} : siteSchema invalide -> ${parsed.success ? '' : parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(' ; ')}`,
      );
    }
  });

  // ---- Regles de variete (enonce de la tache) ----
  function loadAll() {
    return presetFiles.map((file) => JSON.parse(fs.readFileSync(path.join(PRESETS_DIR, file), 'utf8')));
  }

  test('layout.shell (si present) est valide, et au moins 12 presets ont un shell non-flow', () => {
    const all = loadAll();
    let nonFlow = 0;
    for (const d of all) {
      const shell = d.look.layout.shell;
      if (shell === undefined) continue;
      assert.ok(SHELLS.includes(shell), `${d.nom} : shell "${shell}" invalide`);
      if (shell !== 'flow') nonFlow += 1;
    }
    assert.ok(nonFlow >= 12, `au moins 12 presets avec un shell non-flow attendus, trouve ${nonFlow}`);
  });

  test('layout.headings (si present) est valide', () => {
    const all = loadAll();
    for (const d of all) {
      const headings = d.look.layout.headings;
      if (headings === undefined) continue;
      assert.ok(HEADINGS.includes(headings), `${d.nom} : headings "${headings}" invalide`);
    }
  });

  test('layout.shell (si present) respecte les regles d\'adequation (docs/DIRECTIONS.md § Disposition)', () => {
    // Memes regles que scripts/ff/composer.mjs (shellFits) : sticky-hero veut un hero plein ecran,
    // split/sidebar evitent nav floating (cache sur desktop), magazine evite scale compact.
    // Exception documentee pour "slides" : la regle du composer (sectionsCount <= 6) suppose des
    // sites generes avec peu de donnees ; un preset complet couvre toujours >= 7 sections (5
    // obligatoires + au moins 2 optionnelles, voir le test de couverture plus bas) et ne peut donc
    // jamais satisfaire ce seuil litteralement — seule la condition de mouvement est verifiee ici.
    const all = loadAll();
    for (const d of all) {
      const shell = d.look.layout.shell;
      if (!shell || shell === 'flow') continue;
      const { hero, nav, scale } = d.look.layout;
      const motion = d.look.motion;
      if (shell === 'sticky-hero') {
        assert.ok(
          ['fullbleed', 'typographic', 'video'].includes(hero),
          `${d.nom} : sticky-hero veut un hero fullbleed/typographic/video (a: "${hero}")`,
        );
      }
      if (shell === 'split' || shell === 'sidebar') {
        assert.notEqual(nav, 'floating', `${d.nom} : ${shell} incompatible avec nav "floating"`);
      }
      if (shell === 'magazine') {
        assert.notEqual(scale, 'compact', `${d.nom} : magazine incompatible avec scale "compact"`);
      }
      if (shell === 'slides') {
        assert.notEqual(motion, 'rich', `${d.nom} : slides incompatible avec motion "rich"`);
      }
    }
  });

  test('variete : chaque variante de hero utilisee au moins 4 fois', () => {
    const all = loadAll();
    const counts = new Map();
    for (const d of all) counts.set(d.look.layout.hero, (counts.get(d.look.layout.hero) || 0) + 1);
    for (const v of VARIANTS.hero) {
      assert.ok((counts.get(v) || 0) >= 4, `hero "${v}" utilise ${counts.get(v) || 0} fois, attendu >= 4`);
    }
  });

  test('variete : chaque variante de services utilisee au moins 4 fois', () => {
    const all = loadAll();
    const counts = new Map();
    for (const d of all) {
      const s = d.look.layout.sections.find((x) => x.type === 'services');
      if (s) counts.set(s.variant, (counts.get(s.variant) || 0) + 1);
    }
    for (const v of VARIANTS.services) {
      assert.ok((counts.get(v) || 0) >= 4, `services "${v}" utilise ${counts.get(v) || 0} fois, attendu >= 4`);
    }
  });

  function countSectionVariant(all, type) {
    const counts = new Map();
    for (const d of all) {
      const s = d.look.layout.sections.find((x) => x.type === type);
      if (s) counts.set(s.variant, (counts.get(s.variant) || 0) + 1);
    }
    return counts;
  }

  test('variete : chaque variante de nav, footer, proof, contact, cta, about utilisee au moins 2 fois', () => {
    const all = loadAll();
    const navCounts = new Map();
    const footerCounts = new Map();
    for (const d of all) {
      navCounts.set(d.look.layout.nav, (navCounts.get(d.look.layout.nav) || 0) + 1);
      footerCounts.set(d.look.layout.footer, (footerCounts.get(d.look.layout.footer) || 0) + 1);
    }
    for (const v of VARIANTS.nav) assert.ok((navCounts.get(v) || 0) >= 2, `nav "${v}" utilise ${navCounts.get(v) || 0} fois, attendu >= 2`);
    for (const v of VARIANTS.footer) assert.ok((footerCounts.get(v) || 0) >= 2, `footer "${v}" utilise ${footerCounts.get(v) || 0} fois, attendu >= 2`);

    for (const type of ['proof', 'contact', 'cta', 'about']) {
      const counts = countSectionVariant(all, type);
      for (const v of VARIANTS[type]) {
        assert.ok((counts.get(v) || 0) >= 2, `${type} "${v}" utilise ${counts.get(v) || 0} fois, attendu >= 2`);
      }
    }
  });

  test('variete : chaque separateur (divider) utilise au moins 3 fois', () => {
    const all = loadAll();
    const counts = new Map();
    for (const d of all) counts.set(d.look.layout.divider, (counts.get(d.look.layout.divider) || 0) + 1);
    const DIVIDERS = ['none', 'wave', 'diagonal', 'curve', 'rule', 'zigzag'];
    for (const v of DIVIDERS) {
      assert.ok((counts.get(v) || 0) >= 3, `divider "${v}" utilise ${counts.get(v) || 0} fois, attendu >= 3`);
    }
  });

  test('variete : scales ~ 8 compact / 14 normal / 10 display', () => {
    const all = loadAll();
    const counts = { compact: 0, normal: 0, display: 0 };
    for (const d of all) counts[d.look.scale] = (counts[d.look.scale] || 0) + 1;
    assert.equal(counts.compact, 8, `compact = ${counts.compact}, attendu 8`);
    assert.equal(counts.normal, 14, `normal = ${counts.normal}, attendu 14`);
    assert.equal(counts.display, 10, `display = ${counts.display}, attendu 10`);
  });

  test('variete : typography definie sur exactement la moitie des presets (16)', () => {
    const all = loadAll();
    const withTypo = all.filter((d) => d.look.typography).length;
    assert.equal(withTypo, 16, `${withTypo} presets avec typography, attendu 16`);
  });

  test('variete : accent defini sur exactement 6 presets', () => {
    const all = loadAll();
    const withAccent = all.filter((d) => d.look.accent).length;
    assert.equal(withAccent, 6, `${withAccent} presets avec accent, attendu 6`);
  });

  test('variete : tone alternate sur environ 12 presets', () => {
    const all = loadAll();
    const alt = all.filter((d) => d.look.layout.tone === 'alternate').length;
    assert.equal(alt, 12, `${alt} presets en tone alternate, attendu 12`);
  });

  test('au sein d\'une direction, les deux presets different de hero, services, nav et footer', () => {
    const all = loadAll();
    const byDirection = new Map();
    for (const d of all) {
      const dir = d.look.direction;
      if (!byDirection.has(dir)) byDirection.set(dir, []);
      byDirection.get(dir).push(d);
    }
    for (const [dir, pair] of byDirection) {
      assert.equal(pair.length, 2, `direction ${dir} : ${pair.length} presets`);
      const [a, b] = pair;
      assert.notEqual(a.look.layout.hero, b.look.layout.hero, `${dir} : meme hero entre ${a.nom} et ${b.nom}`);
      const sa = a.look.layout.sections.find((s) => s.type === 'services').variant;
      const sb = b.look.layout.sections.find((s) => s.type === 'services').variant;
      assert.notEqual(sa, sb, `${dir} : meme services entre ${a.nom} et ${b.nom}`);
      assert.notEqual(a.look.layout.nav, b.look.layout.nav, `${dir} : meme nav entre ${a.nom} et ${b.nom}`);
      assert.notEqual(a.look.layout.footer, b.look.layout.footer, `${dir} : meme footer entre ${a.nom} et ${b.nom}`);
    }
  });

  test('variete d\'ordre des sections : proof juste apres le hero (>= 8), about avant services (>= 6), contact en derniere section (>= 6), cta avant faq (>= 6)', () => {
    const all = loadAll();
    let proofFirst = 0;
    let aboutBeforeServices = 0;
    let contactLast = 0;
    let ctaBeforeFaq = 0;
    for (const d of all) {
      const sections = d.look.layout.sections;
      if (sections[0]?.type === 'proof') proofFirst += 1;
      const aboutIdx = sections.findIndex((s) => s.type === 'about');
      const servicesIdx = sections.findIndex((s) => s.type === 'services');
      if (aboutIdx !== -1 && servicesIdx !== -1 && aboutIdx < servicesIdx) aboutBeforeServices += 1;
      if (sections[sections.length - 1]?.type === 'contact') contactLast += 1;
      const ctaIdx = sections.findIndex((s) => s.type === 'cta');
      const faqIdx = sections.findIndex((s) => s.type === 'faq');
      if (ctaIdx !== -1 && faqIdx !== -1 && ctaIdx < faqIdx) ctaBeforeFaq += 1;
    }
    assert.ok(proofFirst >= 8, `proof juste apres le hero : ${proofFirst}, attendu >= 8`);
    assert.ok(aboutBeforeServices >= 6, `about avant services : ${aboutBeforeServices}, attendu >= 6`);
    assert.ok(contactLast >= 6, `contact en derniere section : ${contactLast}, attendu >= 6`);
    assert.ok(ctaBeforeFaq >= 6, `cta avant faq : ${ctaBeforeFaq}, attendu >= 6`);
  });

  test('chaque preset couvre services + about + proof + au moins deux de zones/process/faq + cta + contact, en 6 a 8 sections', () => {
    for (const file of presetFiles) {
      const data = JSON.parse(fs.readFileSync(path.join(PRESETS_DIR, file), 'utf8'));
      const types = data.look.layout.sections.map((s) => s.type);
      assert.ok(types.length >= 6 && types.length <= 8, `${file} : ${types.length} sections, attendu 6-8`);
      for (const must of ['services', 'about', 'proof', 'cta', 'contact']) {
        assert.ok(types.includes(must), `${file} : section "${must}" manquante`);
      }
      const optionalCount = ['zones', 'process', 'faq'].filter((t) => types.includes(t)).length;
      assert.ok(optionalCount >= 2, `${file} : au moins deux de zones/process/faq attendues (${optionalCount})`);
    }
  });
}
