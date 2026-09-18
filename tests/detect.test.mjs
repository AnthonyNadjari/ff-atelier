// `ff detect` : l'analyse de la sortie d'Impeccable regroupe, compte, ignore les faux positifs connus
// et met les regles dures en tete. On ne lance pas npx ici (reseau) : on teste le parseur seul.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyserSortie } from '../scripts/ff/detect.mjs';

const SORTIE = `
C:\\x\\dist\\demo\\index.html
  [low-contrast] 3.4:1 (need 4.5:1) — text #f2f1ee on #b67135
    → Text does not meet WCAG AA contrast requirements.
  [low-contrast] 3.4:1 (need 4.5:1) — text #f2f1ee on #b67135
  [cramped-padding] <div> "card": children flush against border+bg on all sides (no inset)
  [all-caps-body] text-transform: uppercase on 58 chars of body text
  [tight-leading] line-height 1.05x (need >=1.3)

4 anti-patterns found.
`;

test('detect : regroupe et compte, regles dures en tete, faux positifs ignores', () => {
  const lignes = analyserSortie(SORTIE);
  assert.deepEqual(lignes.map((l) => [l.regle, l.n]), [
    ['low-contrast', 2],
    ['all-caps-body', 1],
  ]);
  assert.match(lignes[0].message, /#b67135/);
});

test('detect : --tout garde cramped-padding et tight-leading', () => {
  const regles = analyserSortie(SORTIE, { tout: true }).map((l) => l.regle);
  assert.ok(regles.includes('cramped-padding'));
  assert.ok(regles.includes('tight-leading'));
});

test('detect : sortie vide -> aucune ligne', () => {
  assert.deepEqual(analyserSortie('0 anti-patterns found.\n'), []);
});
