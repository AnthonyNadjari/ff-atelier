// Tests des directions (src/directions/<nom>/) : contrat de src/directions/README.md et
// src/styles/global.css (bloc de tokens du :root). Decouverte dynamique depuis le systeme de
// fichiers — aucun compte de directions code en dur (d'autres agents en ajoutent en parallele).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { loadSchemaModule, cleanTmp, ROOT } from '../scripts/ff/ts-loader.mjs';

const DIRECTIONS_DIR = path.join(ROOT, 'src', 'directions');
const { DIRECTIONS } = await loadSchemaModule();

after(() => cleanTmp());

const REQUIRED_TOKENS = [
  '--bg', '--bg-2', '--surface', '--fg', '--muted', '--line',
  '--accent', '--accent-2', '--on-accent', '--ink', '--on-ink',
  '--font-display', '--font-body', '--font-mono',
  '--radius', '--radius-card', '--shadow-card', '--shadow-lift',
];

/** Dossiers de src/directions/ qui contiennent un index.css (le README.md n'en est pas un). */
function listDirectionFolders() {
  return fs
    .readdirSync(DIRECTIONS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => fs.existsSync(path.join(DIRECTIONS_DIR, name, 'index.css')));
}

/** Extrait le bloc principal `[data-direction='<name>'] { ... }` (le tout premier : celui des tokens). */
function extractTokenBlock(css, name) {
  const re = new RegExp(`\\[data-direction=(['"])${name}\\1\\]\\s*\\{([\\s\\S]*?)\\n\\}`);
  const m = css.match(re);
  return m ? m[2] : null;
}

function tokenValue(block, token) {
  const re = new RegExp(`${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*([^;]+);`);
  const m = block.match(re);
  return m ? m[1].trim() : undefined;
}

/** Parse grossierement une couleur hex ou hsl() en luminance ~0..1. Renvoie null si non parsable. */
function roughLuminance(value) {
  if (!value) return null;
  const hex = value.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = [...h].map((c) => c + c).join('');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }
  const hsl = value.match(/^hsl\(\s*[\d.]+\s+[\d.]+%\s+([\d.]+)%\s*\)$/i);
  if (hsl) return parseFloat(hsl[1]) / 100;
  return null; // ex: hsl(var(--x) ...), non parsable ici — on l'ignore plutot que de supposer.
}

const folders = listDirectionFolders();

test('chaque direction de DIRECTIONS (schema.ts) a un dossier src/directions/<nom>/', () => {
  const missing = DIRECTIONS.filter((name) => !folders.includes(name));
  assert.deepEqual(missing, [], `Directions listees dans DIRECTIONS mais sans dossier (agents en cours ?) : ${missing.join(', ')}`);
});

test('chaque dossier src/directions/<nom>/index.css est liste dans DIRECTIONS (schema.ts)', () => {
  const missing = folders.filter((name) => !DIRECTIONS.includes(name));
  assert.deepEqual(missing, [], `Dossiers presents mais absents de DIRECTIONS dans src/lib/schema.ts : ${missing.join(', ')}`);
});

for (const name of folders) {
  test(`src/directions/${name} : meta.ts existe et exporte nom = "${name}"`, () => {
    const metaPath = path.join(DIRECTIONS_DIR, name, 'meta.ts');
    assert.ok(fs.existsSync(metaPath), `meta.ts manquant`);
    const src = fs.readFileSync(metaPath, 'utf8');
    assert.match(src, new RegExp(`nom\\s*:\\s*['"]${name}['"]`), `meta.ts devrait exporter nom: '${name}'`);
  });

  test(`src/directions/${name}/index.css definit tous les tokens requis sous [data-direction='${name}']`, () => {
    const css = fs.readFileSync(path.join(DIRECTIONS_DIR, name, 'index.css'), 'utf8');
    const block = extractTokenBlock(css, name);
    assert.ok(block, `bloc [data-direction='${name}'] { ... } introuvable`);
    const missing = REQUIRED_TOKENS.filter((t) => tokenValue(block, t) === undefined);
    assert.deepEqual(missing, [], `Tokens manquants dans ${name}/index.css : ${missing.join(', ')}`);
  });

  test(`src/directions/${name}/index.css : contraste --bg / color-scheme coherent`, () => {
    const css = fs.readFileSync(path.join(DIRECTIONS_DIR, name, 'index.css'), 'utf8');
    const block = extractTokenBlock(css, name);
    if (!block) return; // deja signale par le test precedent
    const isDark = /color-scheme\s*:\s*dark/.test(css);
    const bg = tokenValue(block, '--bg');
    const lum = roughLuminance(bg);
    if (lum === null) return; // valeur non parsable (variable, gradient...) : on ne suppose rien
    if (isDark) assert.ok(lum < 0.5, `color-scheme: dark presente mais --bg (${bg}) est claire (luminance ${lum.toFixed(2)})`);
    else assert.ok(lum > 0.5, `pas de color-scheme: dark mais --bg (${bg}) est sombre (luminance ${lum.toFixed(2)})`);
  });
}

test('deux directions ne partagent jamais la meme paire (--font-display, --font-body)', () => {
  const pairs = new Map();
  for (const name of folders) {
    const css = fs.readFileSync(path.join(DIRECTIONS_DIR, name, 'index.css'), 'utf8');
    const block = extractTokenBlock(css, name);
    if (!block) continue;
    const display = tokenValue(block, '--font-display');
    const body = tokenValue(block, '--font-body');
    if (!display || !body) continue;
    const key = `${display} | ${body}`;
    if (!pairs.has(key)) pairs.set(key, []);
    pairs.get(key).push(name);
  }
  const dupes = [...pairs.entries()].filter(([, names]) => names.length > 1);
  assert.deepEqual(dupes, [], `Paires de polices dupliquees : ${dupes.map(([k, names]) => `${names.join('+')} => ${k}`).join(' ; ')}`);
});
