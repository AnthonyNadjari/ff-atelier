// `ff matrice [--rapide]` : construit une matrice de sites jetables (sites/_test-matrice-N) qui
// couvre, en un minimum de builds, chaque direction, chaque hero, chaque variante de section, chaque
// divider/scale/tone au moins une fois. `--rapide` : un seul build par direction (layout par defaut de
// _exemple, sans faire varier le reste) — utile pour verifier vite que les 16+ directions compilent.
// Rien n'est code en dur : les combinaisons sont derivees de DIRECTIONS/VARIANTS/DIVIDERS/SCALES/TONES
// (src/lib/schema.ts), decouvertes au moment de l'execution, donc valables au fur et a mesure que
// d'autres agents ajoutent des directions/variantes.
import fs from 'node:fs';
import path from 'node:path';
import { SITES_DIR, DIST_DIR, ROOT, runAstro, ok, fail, info, c, parseArgs, readFFCurrent, writeFFCurrent } from './util.mjs';
import { loadSchemaModule, loadSiteConfigModule, cleanTmp } from './ts-loader.mjs';

const PREFIX = '_test-matrice-';
// Types de section qui vivent dans layout.sections (tableau {type, variant}) — cf. src/lib/schema.ts.
const SECTION_ARRAY_TYPES = ['services', 'about', 'proof', 'zones', 'process', 'faq', 'cta', 'contact'];

function cycle(arr, i) {
  return arr[i % arr.length];
}

/** Supprime tout site/dist _test-matrice-* residuel (run precedent interrompu). */
function sweepLeftovers() {
  for (const dir of [SITES_DIR, DIST_DIR]) {
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (name.startsWith(PREFIX)) fs.rmSync(path.join(dir, name), { recursive: true, force: true });
    }
  }
}

function buildCombos({ rapide, schema }) {
  const { DIRECTIONS, VARIANTS, DIVIDERS, SCALES, TONES } = schema;
  if (rapide) {
    return DIRECTIONS.map((direction, i) => ({ label: direction, overrides: { direction } }));
  }

  const domains = [DIRECTIONS, VARIANTS.nav, VARIANTS.hero, VARIANTS.footer, DIVIDERS, SCALES, TONES, ...SECTION_ARRAY_TYPES.map((t) => VARIANTS[t])];
  const n = Math.max(...domains.map((d) => d.length));

  const combos = [];
  for (let i = 0; i < n; i++) {
    const sections = SECTION_ARRAY_TYPES.map((type) => ({ type, variant: cycle(VARIANTS[type], i) }));
    const overrides = {
      direction: cycle(DIRECTIONS, i),
      layout: {
        nav: cycle(VARIANTS.nav, i),
        hero: cycle(VARIANTS.hero, i),
        footer: cycle(VARIANTS.footer, i),
        divider: cycle(DIVIDERS, i),
        tone: cycle(TONES, i),
        sections,
      },
      scale: cycle(SCALES, i),
    };
    combos.push({
      label: `${overrides.direction} / ${overrides.layout.hero}`,
      overrides,
    });
  }
  return combos;
}

/** sites/_test-matrice-<i>/ : copie de _exemple (moins raw/domain.txt) + site.config.ts genere. */
function writeComboSite(slug, baseSite, overrides) {
  const srcDir = path.join(SITES_DIR, '_exemple');
  const destDir = path.join(SITES_DIR, slug);
  fs.cpSync(srcDir, destDir, {
    recursive: true,
    filter: (src) => {
      const rel = path.relative(srcDir, src);
      if (rel === '') return true;
      if (rel === 'raw' || rel.startsWith(`raw${path.sep}`)) return false;
      if (rel === 'domain.txt') return false;
      return true;
    },
  });

  const merged = {
    ...baseSite,
    ...overrides,
    slug,
    layout: overrides.layout ? { ...baseSite.layout, ...overrides.layout } : baseSite.layout,
  };
  // JSON.stringify : tous les champs de `merged` viennent d'un objet deja valide (sortie de
  // defineSite sur _exemple), donc aucune cle optionnelle n'est absente — on n'entre pas dans le
  // defaut de schema.ts documente dans tests/schema.test.mjs (z.object().default({}) qui ne
  // s'applique pas quand la cle est totalement absente).
  const body = JSON.stringify(merged, null, 2);
  const content = `// Genere par \`ff matrice\` — jetable, ne pas editer a la main.\nimport { defineSite } from '@/lib/schema';\n\nexport default defineSite(${body});\n`;
  fs.writeFileSync(path.join(destDir, 'site.config.ts'), content);
}

export async function cmdMatrice(args) {
  const { flags } = parseArgs(args);
  const rapide = Boolean(flags.rapide);

  const schema = await loadSchemaModule();
  const baseMod = await loadSiteConfigModule('_exemple');
  cleanTmp();
  const baseSite = baseMod.default;

  const combos = buildCombos({ rapide, schema });
  info(c.bold(`ff matrice${rapide ? ' --rapide' : ''} : ${combos.length} build(s)`));
  info('');

  const previousCurrent = readFFCurrent();
  sweepLeftovers();

  const results = [];
  try {
    for (let i = 0; i < combos.length; i++) {
      const { label, overrides } = combos[i];
      const slug = `${PREFIX}${i}`;
      info(c.dim(`— build ${i + 1}/${combos.length} (${label})...`));
      // Le look passe par FF_LOOK (jamais de site temporaire), la sortie par FF_OUT.
      const look = {
        ...overrides,
        layout: overrides.layout ? { ...baseSite.layout, ...overrides.layout } : undefined,
      };
      if (!look.layout) delete look.layout;
      let status = 1;
      try {
        status = runAstro('build', '_exemple', [], { FF_LOOK: JSON.stringify(look), FF_OUT: `dist/${slug}` });
      } finally {
        fs.rmSync(path.join(DIST_DIR, slug), { recursive: true, force: true });
      }
      results.push({ slug, label, status });
    }
  } finally {
    if (previousCurrent) writeFFCurrent(previousCurrent);
    else if (fs.existsSync(path.join(ROOT, '.ff-current'))) fs.rmSync(path.join(ROOT, '.ff-current'));
  }

  info('');
  info(c.bold('Resume :'));
  const width = Math.max(...results.map((r) => r.label.length), 20) + 2;
  for (const r of results) {
    const line = `${r.slug.padEnd(PREFIX.length + 3)} ${r.label.padEnd(width)}`;
    if (r.status === 0) ok(`${line}ok`);
    else fail(`${line}erreur (code ${r.status})`);
  }

  const nbErr = results.filter((r) => r.status !== 0).length;
  info('');
  if (nbErr > 0) {
    fail(`${nbErr} combinaison(s) en erreur sur ${results.length}.`);
    process.exit(1);
  } else {
    ok(`Les ${results.length} combinaison(s) ont ete construites avec succes.`);
  }
}
