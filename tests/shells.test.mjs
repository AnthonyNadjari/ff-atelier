// Tests des coquilles (src/shells/<name>.astro) contre SHELLS (src/lib/schema.ts) : couverture
// complete (pas d'orphelin des deux cotes), contrat minimal de chaque fichier (Hero, Footer,
// sections.map), et fumigene de build : chaque coquille doit produire un site qui build sans erreur
// sur sites/_exemple (SITE=_exemple, FF_LOOK force layout.shell, FF_OUT isole la sortie).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadSchemaModule, cleanTmp, ROOT } from '../scripts/ff/ts-loader.mjs';

const SHELLS_DIR = path.join(ROOT, 'src', 'shells');
const { SHELLS } = await loadSchemaModule();

after(() => cleanTmp());

function listShellFiles() {
  if (!fs.existsSync(SHELLS_DIR)) return [];
  return fs
    .readdirSync(SHELLS_DIR, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.astro'))
    .map((d) => path.basename(d.name, '.astro'));
}

test('chaque entree de SHELLS a un fichier src/shells/<name>.astro', () => {
  for (const name of SHELLS) {
    const p = path.join(SHELLS_DIR, `${name}.astro`);
    assert.ok(fs.existsSync(p), `src/shells/${name}.astro manquant pour SHELLS "${name}"`);
  }
});

test('chaque fichier src/shells/*.astro correspond a une entree de SHELLS (pas d\'orphelin)', () => {
  for (const name of listShellFiles()) {
    assert.ok(SHELLS.includes(name), `src/shells/${name}.astro n'a pas d'entree correspondante dans SHELLS`);
  }
});

// La coquille "index" (site-index, le menu EST la page) est la seule qui ne rend pas <Hero /> : le
// hero y est reduit a une ligne d'identite rendue par la coquille elle-meme (voir son en-tete).
const SANS_HERO = ['index', 'carte', 'index-projets', 'lieu-fixe', 'panneaux', 'carnet', 'livre', 'cartes-agenda'];

test('chaque coquille rend <Hero />, <Footer /> et mappe sections', () => {
  for (const name of SHELLS) {
    const p = path.join(SHELLS_DIR, `${name}.astro`);
    if (!fs.existsSync(p)) continue; // deja signale par le test precedent
    const src = fs.readFileSync(p, 'utf8');
    if (!SANS_HERO.includes(name)) assert.match(src, /<Hero\s*\/>/, `src/shells/${name}.astro ne rend pas <Hero />`);
    assert.match(src, /<Footer\s*\/>/, `src/shells/${name}.astro ne rend pas <Footer />`);
    assert.match(src, /sections\.map\(|entries\.map\(/, `src/shells/${name}.astro ne mappe pas "sections"`);
  }
});

test("coquille index : ligne d'identite (h1 + tel:), entrees <details>/<summary> avec aria-expanded, liens reels, hover-img, onPage", () => {
  const src = fs.readFileSync(path.join(SHELLS_DIR, 'index.astro'), 'utf8');
  assert.match(src, /<h1[\s>]/, "la ligne d'identite porte le h1 (le hero n'est pas rendu)");
  assert.match(src, /href=\{tel\(\)\}/, "telephone dans la ligne d'identite");
  assert.match(src, /<details[^>]*name=/, 'entrees en <details> natifs (une seule ouverte a la fois via name)');
  assert.match(src, /<summary[^>]*aria-expanded=/, 'summary avec aria-expanded');
  assert.match(src, /href=\{p\.href\}/, 'entrees de page en liens reels');
  assert.match(src, /data-hover-img=/, 'image revelee au survol via data-hover-img');
  assert.match(src, /prefers-reduced-motion/, 'transitions coupees en reduced-motion');
  assert.match(src, /onPage\(/, 'script inline rearme via onPage()');
  assert.doesNotMatch(src, /<Nav\s*\/>/, 'aucune <nav> separee : les entrees sont la navigation');
  assert.doesNotMatch(src.replace(/\/\*[\s\S]*?\*\//g, ''), /#[0-9a-fA-F]{3,8}/, 'tokens uniquement');
});

for (const name of SHELLS) {
  test(`fumigene de build : shell "${name}" (sites/_exemple)`, { timeout: 120_000 }, () => {
    const astroJs = path.join(ROOT, 'node_modules', 'astro', 'astro.js');
    const outDir = `dist/_test-shell-${name}`;
    const look = JSON.stringify({ layout: { shell: name } });
    const res = spawnSync(process.execPath, [astroJs, 'build'], {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: 120_000,
      env: { ...process.env, SITE: '_exemple', FF_LOOK: look, FF_OUT: outDir },
    });
    if (res.status !== 0) {
      console.log(res.stdout);
      console.log(res.stderr);
    }
    fs.rmSync(path.join(ROOT, outDir), { recursive: true, force: true });
    assert.equal(res.status, 0, `le build a echoue pour le shell "${name}" (voir la sortie ci-dessus)`);
  });
}
