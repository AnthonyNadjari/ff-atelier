import { test } from 'node:test';
import assert from 'node:assert/strict';
import { etapes, tableau } from '../scripts/ff/prevol.mjs';

test('étapes : ordre complet, puis sans navigateur, puis sans build', () => {
  const noms = etapes('x').map((e) => e.nom);
  assert.deepEqual(noms, ['contrat', 'aiguillage', 'build', 'verifier', 'audit-motion', 'nettete', 'ressemblance', 'detect', 'perf']);
  const sans = etapes('x', { navigateur: false });
  assert.ok(!sans.some((e) => e.navigateur));
  assert.ok(sans.find((e) => e.nom === 'verifier').args.includes('--sans-a11y'));
  assert.ok(!etapes('x', { build: false }).some((e) => e.nom === 'build'));
  assert.equal(etapes('x').find((e) => e.nom === 'build').verrou, true);
});

test('tableau : une ligne par étape, ✓ ou ✗, détail du premier échec', () => {
  const t = tableau([{ etape: 'x · build', ok: true, duree: '12', detail: '' }, { etape: 'x · verifier', ok: false, duree: '3', detail: 'Ancre interne sans cible' }]);
  assert.match(t, /^✓ x · build\s+12s$/m);
  assert.match(t, /^✗ x · verifier\s+3s\s+Ancre interne sans cible$/m);
});
