import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prises, TEMPS_ENTREE, TEMPS_GESTE } from '../scripts/ff/film.mjs';

test('prises : entrée + section par défaut', () => {
  const p = prises();
  assert.equal(p.length, TEMPS_ENTREE.length + 2);
  assert.equal(p[0].label, 'entrée 0 ms');
  assert.deepEqual(p.slice(-2).map((x) => x.type), ['section', 'section']);
});

test('prises : geste, toucher et glisser ajoutent leurs vues', () => {
  const p = prises({ geste: '#age', toucher: '[data-fro]', glisser: '[data-bande]' });
  assert.equal(p.filter((x) => x.type === 'geste').length, TEMPS_GESTE.length);
  assert.equal(p.filter((x) => x.type === 'toucher').length, TEMPS_GESTE.length);
  assert.deepEqual(p.filter((x) => x.type === 'glisser').map((x) => x.f), [0.25, 0.5, 0.75, 1]);
  assert.ok(p.find((x) => x.type === 'toucher').sel === '[data-fro]');
});
