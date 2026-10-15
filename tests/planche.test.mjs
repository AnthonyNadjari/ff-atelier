// `ff planche` : disposition pure des vignettes (le reste demande un navigateur).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { disposerVignettes, MODES_PLANCHE } from '../scripts/ff/planche.mjs';

test('disposerVignettes : grille de 4 colonnes, marge de 4 px', () => {
  const d = disposerVignettes(6, 350, 225, 4);
  assert.equal(d.positions.length, 6);
  assert.deepEqual(d.positions[0], { left: 0, top: 0 });
  assert.deepEqual(d.positions[4], { left: 0, top: 229 });
  assert.equal(d.width, 4 * 354);
  assert.equal(d.height, 2 * 229);
});

test('modes : ordinateur 1400x900 et téléphone 390x844', () => {
  assert.equal(MODES_PLANCHE.d.vw, 1400);
  assert.equal(MODES_PLANCHE.m.vh, 844);
  assert.ok(MODES_PLANCHE.m.mobile);
});
