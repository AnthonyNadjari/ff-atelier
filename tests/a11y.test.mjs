// Tests des fonctions pures de `ff a11y` (scripts/ff/a11y.mjs) : resume des violations axe, fusion
// par regle sur plusieurs pages/viewports, verdict bloquant (critical/serious), chemins des pages.
// Aucun navigateur : les entrees imitent la forme des `violations` renvoyees par axe-core.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { resumerViolations, fusionnerResultats, estBloquante, cheminsPages, TAGS } from '../scripts/ff/a11y.mjs';

const violation = (id, impact, n = 1) => ({
  id,
  impact,
  help: `aide ${id}`,
  helpUrl: `https://dequeuniversity.com/rules/axe/${id}`,
  nodes: Array.from({ length: n }, (_, i) => ({ target: [`.el-${i}`], html: `<div class="el-${i}">\n   texte</div>` })),
});

test('TAGS : WCAG 2.0 A/AA, 2.1 AA, 2.2 AA', () => {
  assert.deepEqual(TAGS, ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']);
});

test('estBloquante : critical et serious bloquent, moderate et minor non', () => {
  assert.equal(estBloquante({ impact: 'critical' }), true);
  assert.equal(estBloquante({ impact: 'serious' }), true);
  assert.equal(estBloquante({ impact: 'moderate' }), false);
  assert.equal(estBloquante({ impact: 'minor' }), false);
  assert.equal(estBloquante(undefined), false);
});

test('resumerViolations : premier noeud, extrait compacte, tri par gravite', () => {
  const r = resumerViolations([violation('region', 'moderate'), violation('color-contrast', 'serious', 3), violation('image-alt', 'critical')]);
  assert.deepEqual(r.map((v) => v.id), ['image-alt', 'color-contrast', 'region']);
  const cc = r[1];
  assert.equal(cc.nombre, 3);
  assert.equal(cc.selecteur, '.el-0');
  assert.equal(cc.extrait, '<div class="el-0"> texte</div>');
});

test('resumerViolations : cible dans un iframe/shadow DOM (tableau imbrique) -> selecteur joint', () => {
  const v = { id: 'x', impact: 'minor', nodes: [{ target: [['iframe', '.dedans']], html: '' }] };
  assert.equal(resumerViolations([v])[0].selecteur, 'iframe .dedans');
});

test('fusionnerResultats : regroupe par regle, cumule les noeuds, liste les pages ; bloquant si une regle grave', () => {
  const { regles, bloquant } = fusionnerResultats([
    { page: '/', viewport: 'desktop', violations: resumerViolations([violation('region', 'moderate', 2)]) },
    { page: '/', viewport: 'mobile', violations: resumerViolations([violation('region', 'moderate', 1), violation('color-contrast', 'serious', 4)]) },
  ]);
  assert.deepEqual(regles.map((r) => r.id), ['color-contrast', 'region']);
  assert.equal(regles[1].nombre, 3);
  assert.deepEqual(regles[1].pages, ['/ (desktop)', '/ (mobile)']);
  assert.equal(bloquant, true);
  assert.equal(fusionnerResultats([{ page: '/', viewport: 'desktop', violations: resumerViolations([violation('region', 'minor')]) }]).bloquant, false);
  assert.deepEqual(fusionnerResultats([]), { regles: [], bloquant: false });
});

test('cheminsPages : index.html -> /, build format file -> /x, accueil en premier', () => {
  const p = cheminsPages(['mentions-legales.html', 'index.html', path.join('services', 'fuite.html'), '404.html', 'robots.txt']);
  assert.deepEqual(p, ['/', '/404', '/mentions-legales', '/services/fuite']);
});
