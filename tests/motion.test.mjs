// Tests du moteur d'animation (src/scripts/motion.ts + src/styles/global.css) : chaque data-* documente
// dans l'en-tete de motion.ts est reellement gere par le code, et chaque effet ajoute par la veille
// animations.md (bloc "Nouveaux effets" de l'en-tete) a une regle explicite dans le bloc
// @media (prefers-reduced-motion: reduce) de global.css. Verifie aussi que le site _effets (vitrine de
// tous les effets, sites/_effets/) build sans erreur (FF_OUT isole la sortie, comme les autres tests).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MOTION_TS = path.join(ROOT, 'src', 'scripts', 'motion.ts');
const GLOBAL_CSS = path.join(ROOT, 'src', 'styles', 'global.css');
const ASTRO = path.join(ROOT, 'node_modules', 'astro', 'astro.js');
const TEST_OUT = 'dist/_test-effets';

const motionSrc = fs.readFileSync(MOTION_TS, 'utf8');
const cssSrc = fs.readFileSync(GLOBAL_CSS, 'utf8');

after(() => {
  const dir = path.join(ROOT, TEST_OUT);
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
});

/** L'en-tete de motion.ts est le premier commentaire de bloc /** ... *\/ du fichier. */
function headerComment(src) {
  const m = src.match(/^\/\*\*[\s\S]*?\*\//);
  assert.ok(m, 'motion.ts doit commencer par un commentaire /** ... */ documentant les data-*');
  return m[0];
}

/** Le corps = tout le fichier apres l'en-tete (la ou les data-* doivent etre reellement geres). */
function bodyAfterHeader(src) {
  const header = headerComment(src);
  return src.slice(header.length);
}

/** Le bloc @media (prefers-reduced-motion: reduce) { ... } de global.css. */
function reducedMotionBlock(css) {
  const start = css.indexOf('@media (prefers-reduced-motion: reduce)');
  assert.ok(start !== -1, "global.css doit avoir un bloc @media (prefers-reduced-motion: reduce)");
  const braceStart = css.indexOf('{', start);
  let depth = 0;
  for (let i = braceStart; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}') {
      depth--;
      if (depth === 0) return css.slice(braceStart, i + 1);
    }
  }
  throw new Error('bloc reduced-motion non ferme dans global.css');
}

const header = headerComment(motionSrc);
const body = bodyAfterHeader(motionSrc);
const reduced = reducedMotionBlock(cssSrc);

// L'en-tete separe les attributs "legacy" (avant cette tache) des "nouveaux effets" (docs/veille/
// animations.md §3) par une ligne marqueur. Seuls les nouveaux doivent avoir une regle reduced-motion
// explicite et testable ici : les legacy peuvent rester "CSS-only par construction" (rich() ne
// s'execute jamais quand prefers-reduced-motion est actif, cf. initMotion()).
const markerIndex = header.search(/Nouveaux effets/i);
assert.ok(markerIndex !== -1, `en-tete de motion.ts : marqueur "Nouveaux effets" introuvable`);
const legacyPart = header.slice(0, markerIndex);
const newPart = header.slice(markerIndex);

const attrPattern = /data-[a-z][a-z-]*/g;
const legacyAttrs = [...new Set(legacyPart.match(attrPattern) ?? [])];
const newAttrsRaw = [...new Set(newPart.match(attrPattern) ?? [])];
// Un attribut deja legacy (ex: data-split, reutilise par data-split="chars") ne compte pas deux fois.
const newAttrs = newAttrsRaw.filter((a) => !legacyAttrs.includes(a));

test('en-tete de motion.ts : au moins 13 nouveaux effets documentes (docs/veille/animations.md §3)', () => {
  assert.ok(newAttrs.length >= 13, `attendu >= 13 nouveaux data-*, trouve ${newAttrs.length} : ${newAttrs.join(', ')}`);
});

test('chaque data-* legacy documente en tete est gere dans le corps de motion.ts ou dans global.css', () => {
  const missing = legacyAttrs.filter((attr) => !body.includes(attr) && !cssSrc.includes(attr));
  assert.deepEqual(missing, [], `attributs legacy documentes mais introuvables dans le code : ${missing.join(', ')}`);
});

test('chaque nouveau data-* est gere dans le corps de motion.ts ou dans global.css (grep)', () => {
  const missing = newAttrs.filter((attr) => !body.includes(attr) && !cssSrc.includes(attr));
  assert.deepEqual(missing, [], `nouveaux attributs documentes mais introuvables dans le code : ${missing.join(', ')}`);
});

test('chaque nouveau data-* a une regle explicite dans le bloc reduced-motion de global.css', () => {
  const missing = newAttrs.filter((attr) => !reduced.includes(attr));
  assert.deepEqual(missing, [], `nouveaux attributs sans regle @media (prefers-reduced-motion: reduce) : ${missing.join(', ')}`);
});

// data-shader : le module frere src/scripts/shader.ts (OGL + fragment shaders) ne doit jamais entrer dans
// le chunk initial (import() seulement), et motion.ts doit poser le repli (degrade statique) sans
// l'importer quand reduced/subtle/none. Le generique ci-dessus verifie deja que data-shader,
// data-shader-speed et data-shader-pointer sont cites dans le corps et dans le bloc reduced-motion.
const SHADER_TS = path.join(ROOT, 'src', 'scripts', 'shader.ts');
const shaderSrc = fs.readFileSync(SHADER_TS, 'utf8');

test('data-shader : shader.ts charge paresseusement, jamais importe statiquement par motion.ts', () => {
  assert.match(body, /import\('\.\/shader'\)/, "motion.ts doit charger ./shader via import() dynamique");
  assert.doesNotMatch(body, /^import .*['"]\.\/shader['"]/m, 'motion.ts ne doit pas importer ./shader statiquement');
  assert.match(shaderSrc, /await import\('ogl'\)/, 'shader.ts doit importer ogl a la demande');
  assert.doesNotMatch(body, /^import .*['"]ogl['"]/m, 'motion.ts ne doit pas importer ogl statiquement');
});

test('data-shader : quatre presets, options speed/pointer, pause et replis presents dans shader.ts', () => {
  for (const preset of ['mesh', 'silk', 'aurora', 'grain-gradient']) {
    const key = preset.includes('-') ? `'${preset}'` : preset;
    const needle = key + ': `${COMMON}';
    assert.ok(shaderSrc.includes(needle), `preset ${preset} manquant dans PRESETS (attendu ${JSON.stringify(needle)})`);
    assert.ok(body.includes(`${preset}:`) || body.includes(`'${preset}':`), `repli CSS SHADER_FALLBACK.${preset} manquant dans motion.ts`);
  }
  for (const needle of ['shaderSpeed', 'shaderPointer', 'IntersectionObserver', 'visibilitychange', 'webglcontextlost', 'MAX_DPR = 1.5', 'MAX_WIDTH = 1280', "matchMedia('(pointer: fine)')"]) {
    assert.ok(shaderSrc.includes(needle), `shader.ts : "${needle}" introuvable`);
  }
  // Couleurs : uniquement les cinq tokens, lus via getComputedStyle — aucune couleur en dur (hex/rgb) dans le module.
  assert.ok(shaderSrc.includes("['--bg', '--bg-2', '--accent', '--accent-2', '--fg']"), 'shader.ts : liste TOKENS attendue');
  assert.ok(shaderSrc.includes('getComputedStyle'), 'shader.ts : lecture des tokens via getComputedStyle');
  assert.doesNotMatch(shaderSrc, /#[0-9a-fA-F]{3,8}/, 'shader.ts : aucune couleur hex en dur');
});

test('data-shader : le repli (subtle/none/reduced) est pose AVANT la sortie anticipee de initMotion()', () => {
  const init = body.slice(body.indexOf('export function initMotion()'));
  const callIdx = init.indexOf('shaderBackgrounds(motion, reduced)');
  const guardIdx = init.indexOf("if (motion === 'none' || reduced)");
  assert.ok(callIdx !== -1 && guardIdx !== -1 && callIdx < guardIdx, 'shaderBackgrounds() doit etre appele avant la garde none/reduced');
  assert.match(body, /if \(motion !== 'rich' \|\| reduced\) \{\s*els\.forEach\(shaderFallback\)/, 'shaderBackgrounds() doit poser shaderFallback hors rich/reduced sans import()');
});

test('sites/_effets existe et declare motion: "rich" (vitrine des effets)', () => {
  const cfg = fs.readFileSync(path.join(ROOT, 'sites', '_effets', 'site.config.ts'), 'utf8');
  assert.match(cfg, /motion:\s*'rich'/, "sites/_effets/site.config.ts doit avoir motion: 'rich'");
  assert.match(cfg, /type:\s*'custom',\s*variant:\s*'effets'/, "sites/_effets doit utiliser la section custom 'effets' comme seule section");
});

test(
  'le site _effets build sans erreur (SITE=_effets, FF_OUT isole)',
  { timeout: 120 * 1000 },
  () => {
    const res = spawnSync(process.execPath, [ASTRO, 'build'], {
      cwd: ROOT,
      encoding: 'utf8',
      env: { ...process.env, SITE: '_effets', FF_OUT: TEST_OUT },
    });
    if (res.status !== 0) {
      console.log(res.stdout);
      console.log(res.stderr);
    }
    assert.equal(res.status, 0, '`astro build` a echoue pour sites/_effets (voir la sortie ci-dessus)');
    assert.ok(fs.existsSync(path.join(ROOT, TEST_OUT, 'index.html')), `${TEST_OUT}/index.html manquant apres le build`);
  },
);
