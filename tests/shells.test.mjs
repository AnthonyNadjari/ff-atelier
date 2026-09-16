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

test('chaque coquille rend <Hero />, <Footer /> et mappe sections', () => {
  for (const name of SHELLS) {
    const p = path.join(SHELLS_DIR, `${name}.astro`);
    if (!fs.existsSync(p)) continue; // deja signale par le test precedent
    const src = fs.readFileSync(p, 'utf8');
    assert.match(src, /<Hero\s*\/>/, `src/shells/${name}.astro ne rend pas <Hero />`);
    assert.match(src, /<Footer\s*\/>/, `src/shells/${name}.astro ne rend pas <Footer />`);
    assert.match(src, /sections\.map\(/, `src/shells/${name}.astro ne mappe pas "sections"`);
  }
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
