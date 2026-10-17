import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planChoix } from '../scripts/ff/choisir.mjs';

const sites = ['x', 'x-b', 'x-c', 'y', '_exemple'];

test('choisir b : b devient x, x et c rangées', () => {
  const p = planChoix('x', 'b', sites);
  assert.equal(p.gagnante, 'x-b');
  assert.deepEqual(p.perdantes, ['x', 'x-c']);
  assert.deepEqual(p.destination, { x: '_pistes/x-a', 'x-c': '_pistes/x-c' });
});

test('choisir a : rien à renommer, b et c rangées', () => {
  const p = planChoix('x', 'A', sites);
  assert.equal(p.gagnante, 'x');
  assert.deepEqual(p.perdantes, ['x-b', 'x-c']);
});

test('lettre absente ou piste inexistante : erreur claire', () => {
  assert.throws(() => planChoix('x', 'z', sites), /lettre/);
  assert.throws(() => planChoix('x', 'd', sites), /n'existe pas/);
});
