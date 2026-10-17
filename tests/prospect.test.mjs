// legal.prospect : démo privée pour un vrai commerce (17 oct 2026) : noindex partout, robots.txt fermé.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const lire = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

test('schéma : legal.prospect existe, faux par défaut, décrit', () => {
  assert.match(lire('src/lib/schema.ts'), /prospect: z\.boolean\(\)\.default\(false\)\.describe\(/);
});

test('Base.astro : noindex sur tout le site quand legal.prospect', () => {
  assert.match(lire('src/layouts/Base.astro'), /\(noindex \|\| site\.legal\.prospect\) && <meta name="robots" content="noindex, nofollow, noarchive" \/>/);
});

test('robots.txt : Disallow: / quand legal.prospect', () => {
  const src = lire('src/pages/robots.txt.ts');
  assert.match(src, /if \(site\.legal\.prospect\)/);
  assert.match(src, /Disallow: \//);
});
