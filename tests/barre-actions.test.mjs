// Barre d'actions collée en bas sur téléphone (layout.actionBar → src/components/BarreActions.astro,
// rendue par Base.astro) : vérifications de source — portes de actions() (2 à 4), safe-area, visible
// seulement sous 48 rem, body qui réserve la hauteur, repli sans JS (toujours visible), script onPage
// + IntersectionObserver sur le pied de page, tokens uniquement, aucune pilule.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from '../scripts/ff/ts-loader.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

test('BarreActions.astro : 2 à 3 portes de actions(), safe-area, < 48 rem, hauteur réservée, tokens', () => {
  const src = read('src/components/BarreActions.astro');
  assert.match(src, /import \{ actions \} from '@\/lib\/site'/);
  assert.match(src, /actions\(\)\.slice\(0, 3\)/, 'au plus 3 portes');
  assert.match(src, /portes\.length >= 2 &&/, 'au moins 2 portes, sinon rien');
  assert.match(src, /aria-label="Actions rapides"/);
  assert.match(src, /padding-bottom: env\(safe-area-inset-bottom, 0px\)/);
  assert.match(src, /@media \(min-width: 48rem\) \{ \.ff-barre-actions \{ display: none; \} \}/, 'cachée dès 768 px');
  assert.match(src, /body:has\(\[data-barre-actions\]\) \{ padding-bottom: calc\(/, 'le body réserve la hauteur de la barre');
  assert.match(src, /@layer components/, 'style global sous @layer components (docs/CONVENTIONS.md § CSS global)');
  assert.match(src, /IntersectionObserver/);
  assert.match(src, /document\.querySelector\('footer'\)/);
  assert.match(src, /onPage\(/);
  assert.match(src, /prefers-reduced-motion: reduce/);
  const style = src.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
  assert.doesNotMatch(style, /#[0-9a-fA-F]{3,8}\b/, 'couleur en dur');
  assert.doesNotMatch(style, /font-family/, 'police en dur');
  assert.doesNotMatch(style, /999px|border-radius: 9|rounded-full/, 'pas de pilule');
  for (const token of ['var(--line)', 'var(--surface)', 'var(--fg)', 'var(--accent)', 'var(--on-accent)', 'var(--motion-ui)', 'var(--ease-out)']) {
    assert.ok(style.includes(token), `token attendu : ${token}`);
  }
  // Sans JS : la classe is-hidden n'est posée que par le script, la barre est visible par défaut.
  assert.doesNotMatch(src, /class:list=\{\[['"]ff-barre-actions['"], ['"]is-hidden/);
  assert.doesNotMatch(src, /<nav class="ff-barre-actions is-hidden/);
});

test('Base.astro : BarreActions rendue seulement si layout.actionBar', () => {
  const src = read('src/layouts/Base.astro');
  assert.match(src, /import BarreActions from '@\/components\/BarreActions\.astro'/);
  assert.match(src, /\{site\.layout\.actionBar && site\.layout\.nav !== 'dock' && <BarreActions \/>\}/, "rendue si actionBar, jamais avec nav 'dock'");
});

test('sites/_exemple exerce layout.actionBar', () => {
  assert.match(read('sites/_exemple/site.config.ts'), /actionBar: true/);
});
