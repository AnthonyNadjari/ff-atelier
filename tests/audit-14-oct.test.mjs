// Correctifs de l'audit de l'usine du 14 oct 2026 : arguments de la CLI, grille d'images du vérifieur,
// garde des données du modèle _exemple, lecture de `ff variete`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from '../scripts/ff/util.mjs';
import { checkGrilleImagesRatioCoherente, analyserReglesEmpruntees } from '../scripts/ff/verifier.mjs';
import { controlerDonneesTest } from '../scripts/ff/garde-donnees.mjs';
import { effectiveLook } from '../scripts/ff/look-data.mjs';

test('parseArgs : un drapeau booléen n’avale pas le slug qui le suit', () => {
  assert.deepEqual(parseArgs(['--corriger', 'mon-site']), { positional: ['mon-site'], flags: { corriger: true } });
  assert.deepEqual(parseArgs(['--sans-build', 'mon-site']).positional, ['mon-site']);
  assert.deepEqual(parseArgs(['mon-site', '--n', '4']).flags, { n: '4' });
  assert.deepEqual(parseArgs(['--dest=x', 'a']), { positional: ['a'], flags: { dest: 'x' } });
});

test('parseArgs : --duotone ne prend que deux couleurs', () => {
  assert.deepEqual(parseArgs(['--duotone', 'mon-site']), { positional: ['mon-site'], flags: { duotone: true } });
  assert.equal(parseArgs(['s', '--duotone', '#111,#eee']).flags.duotone, '#111,#eee');
});

function grille(html) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ff-grille-'));
  const f = path.join(dir, 'index.html');
  fs.writeFileSync(f, html);
  const checks = [];
  checkGrilleImagesRatioCoherente([f], dir, checks);
  return checks[0].pass;
}

test('grille d’images : une photo recadrée (object-cover) ne casse pas la grille', () => {
  const li = (w, h, cls = '') => `<li><img class="${cls}" width="${w}" height="${h}" alt=""></li>`;
  assert.equal(grille(`<ul>${li(800, 600)}${li(800, 600)}${li(600, 900)}</ul>`), false);
  assert.equal(grille(`<ul>${li(800, 600, 'object-cover')}${li(800, 600, 'object-cover')}${li(600, 900, 'h-full object-cover')}</ul>`), true);
});

test('garde : e-mail et adresse du modèle _exemple repérés', () => {
  const r = controlerDonneesTest([{ chemin: 'index.html', html: '<a href="mailto:contact@exemple.fr">contact@exemple.fr</a>' }]);
  assert.ok(r.some((x) => !x.pass && /_exemple/.test(x.label)));
  const r2 = controlerDonneesTest([{ chemin: 'index.html', html: '<p>12 rue de l’Épeule, 59100 Roubaix</p>' }]);
  assert.ok(r2.some((x) => !x.pass && /_exemple/.test(x.label)));
});

test('variete : les sections écrites par ff figer (virgule finale, label) sont lues', () => {
  const look = effectiveLook('dentaire-morvan');
  assert.ok(look.sections.length >= 5);
  assert.ok(look.sections.some((s) => s.type === 'services'));
});

test('règles empruntées : transition all, 100vh seul, user-scalable, Défilez, flèches', () => {
  const r = analyserReglesEmpruntees({ css: '.a{transition:all .3s}.b{height:100vh}', pages: [{ chemin: 'index.html', html: '<meta content="user-scalable=no"><p>Défilez</p><a>Voir →</a><a>Lire →</a><a>Appeler →</a>' }] });
  assert.equal(r.length, 5, r.join(' | '));
  assert.deepEqual(analyserReglesEmpruntees({ css: '.a{transition:opacity .3s}.b{height:100svh}', pages: [{ chemin: 'index.html', html: '<p>Bonjour</p>' }] }), []);
});
