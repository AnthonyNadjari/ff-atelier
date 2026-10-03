// `src/styles/craft.css` — le « plancher de soin » : etats de focus, champs de formulaire, cible
// tactile, impression. Ces regles ne sont PAS dans une couche Tailwind : elles battent donc les
// classes utilitaires, ce qui est voulu pour le focus et dangereux pour le reste. Ces tests
// verrouillent les deux pieges deja payes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/craft.css', import.meta.url), 'utf8');

test('craft : les regles de cible tactile ne rallument jamais un element masque', () => {
  // Un lien `class="hidden sm:inline"` doit rester cache sous 640 px. Sans `:not(.hidden)`, le
  // `display: inline-flex` de ces blocs gagnait et le telephone de la nav s'affichait, ecrase a
  // 44 px et tronque (site F&F, 3 oct 2026 — et c'etait vrai pour les vingt sites).
  const selecteurs = css.match(/:is\(header\[data-nav\][^{]*\{/g) || [];
  assert.ok(selecteurs.length >= 2, 'les deux blocs de cible tactile doivent exister');
  for (const sel of selecteurs) {
    assert.match(sel, /:not\(\.hidden\)/, `selecteur sans garde .hidden : ${sel.slice(0, 90)}`);
  }
});

test('craft : le focus clavier n’est jamais supprime sans remplacement', () => {
  // `outline: none` n'est tolere que sur `:focus:not(:focus-visible)` (la souris), jamais sur le
  // focus clavier : c'est la faute d'accessibilite la plus courante du web.
  const blocsSansOutline = [...css.matchAll(/([^{}]+)\{[^{}]*outline:\s*(?:none|0)[^{}]*\}/g)];
  for (const [, selecteur] of blocsSansOutline) {
    assert.match(
      selecteur,
      /:focus:not\(:focus-visible\)|@media print/,
      `outline: none hors du focus souris : ${selecteur.trim().slice(0, 80)}`,
    );
  }
});

test('craft : aucune couleur en dur, tokens uniquement (regle dure n°1)', () => {
  // Les commentaires ont le droit de citer une valeur ; le CSS livre, non.
  const sansCommentaires = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const enDur = sansCommentaires.match(/#[0-9a-fA-F]{3,8}\b|\brgb\(|\bhsl\(/g) || [];
  assert.deepEqual(enDur, [], `couleurs en dur dans craft.css : ${enDur.join(', ')}`);
});
