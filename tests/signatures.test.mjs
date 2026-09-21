// ff signatures : l'empreinte de composition ignore le texte et les valeurs, mais distingue la structure.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { empreinte, analyser } from '../scripts/ff/signatures.mjs';

const A = `---\nconst x = 1;\n---\n<section class="section-y grid" data-reveal><h2>Bonjour</h2><ul data-stagger="90"><li>a</li></ul></section>`;
const B = `---\nconst y = 2;\n---\n<section class="section-y grid" data-reveal><h2>Autre texte</h2><ul data-stagger="60"><li>b</li></ul></section>`;
const C = `---\n---\n<section class="section-y flex" data-reveal><h2>Bonjour</h2><ol data-stagger="90"><li>a</li></ol></section>`;

test('signatures : meme structure, texte different -> meme empreinte', () => {
  assert.equal(empreinte(A).hash, empreinte(B).hash);
});
test('signatures : structure differente -> empreinte differente', () => {
  assert.notEqual(empreinte(A).hash, empreinte(C).hash);
});
test('signatures : le depot ne contient ni composition copiee ni reserve violee', () => {
  const r = analyser();
  assert.deepEqual(r.doublons.map((g) => g.map((b) => b.slug + '/' + b.fichier)), [], 'compositions identiques entre sites');
  assert.deepEqual(r.violations, [], 'reserves violees');
});
