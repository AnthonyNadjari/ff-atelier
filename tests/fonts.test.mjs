// Tests du catalogue de polices (src/lib/fonts.ts) : chaque package fontsource importe existe
// reellement dans node_modules, et chaque entree a un role reconnu.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSchemaModule, cleanTmp, ROOT, TMP_DIR } from '../scripts/ff/ts-loader.mjs';

after(() => cleanTmp());

const fontsSrc = fs.readFileSync(path.join(ROOT, 'src', 'lib', 'fonts.ts'), 'utf8');

test("chaque package pkg '@fontsource...' de fonts.ts existe dans node_modules", () => {
  const imports = [...fontsSrc.matchAll(/pkg:\s*['"](@fontsource[^'"]+)['"]/g)].map((m) => m[1]);
  assert.ok(imports.length > 0, 'aucun package @fontsource trouve — le regex a-t-il change de forme dans fonts.ts ?');
  const missing = imports.filter((spec) => !fs.existsSync(path.join(ROOT, 'node_modules', spec)));
  assert.deepEqual(missing, [], `Packages importes par fonts.ts mais absents de node_modules : ${missing.join(', ')}`);
});

// loadSchemaModule() copie aussi src/lib/fonts.ts (dependance de schema.ts) sous tests/.tmp/lib/fonts.ts
// avec ses imports relatifs corriges ; on l'importe directement de la pour verifier FONTS/FONT_NAMES.
async function loadFontsModule() {
  await loadSchemaModule();
  const { pathToFileURL } = await import('node:url');
  const p = path.join(TMP_DIR, 'lib', 'fonts.ts');
  return import(pathToFileURL(p).href);
}

test('chaque entree de FONTS a un role parmi display|body|both|mono', async () => {
  const { FONTS } = await loadFontsModule();
  const allowed = new Set(['display', 'body', 'both', 'mono']);
  const bad = Object.entries(FONTS).filter(([, f]) => !allowed.has(f.role));
  assert.deepEqual(bad.map(([k]) => k), [], `Roles invalides : ${bad.map(([k, f]) => `${k}=${f.role}`).join(', ')}`);
  assert.ok(Object.keys(FONTS).length > 0);
});

test('FONT_NAMES contient exactement les cles de FONTS', async () => {
  const { FONTS, FONT_NAMES } = await loadFontsModule();
  assert.deepEqual([...FONT_NAMES].sort(), Object.keys(FONTS).sort());
});
