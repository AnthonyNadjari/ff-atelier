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

// Regles de craft.css : selecteur, corps et pile des blocs englobants (@media, @layer...).
function regles(source) {
  const s = source.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = [];
  const pile = [];
  let debut = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === ';') debut = i + 1;
    else if (s[i] === '{') {
      const tete = s.slice(debut, i).trim();
      if (!tete.startsWith('@')) out.push({ selecteur: tete, corps: s.slice(i + 1, s.indexOf('}', i)), parents: [...pile] });
      pile.push(tete);
      debut = i + 1;
    } else if (s[i] === '}') {
      pile.pop();
      debut = i + 1;
    }
  }
  return out;
}

test('craft : la regle des boutons icone ne vise plus tous les liens et boutons a aria-label (test reel du 17 oct 2026)', () => {
  // Hors couche, `button[aria-label]` / `a[aria-label]` battaient `md:hidden` (bouton menu visible sur
  // ordinateur) et la classe d'un bloc sur mesure (numero du macon sous son icone, +/- colle a gauche).
  const viseAria = (sel) => /\[aria-label\]/.test(sel.replace(/:not\(\[aria-label\]\)/g, ''));
  const visees = regles(css).filter((r) => viseAria(r.selecteur));
  assert.ok(visees.length >= 2, 'les regles des boutons icone doivent exister');
  for (const r of visees) {
    assert.ok(r.parents.some((p) => /^@layer\s+components\b/.test(p)), `regle aria-label hors de @layer components : ${r.selecteur.slice(0, 90)}`);
    // Specificite nulle : chaque [aria-label] est a l'interieur d'un :where(...).
    const horsWhere = r.selecteur.replace(/:where\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\)/g, '');
    assert.doesNotMatch(horsWhere, /\[aria-label\]/, `[aria-label] hors de :where() : ${r.selecteur.slice(0, 90)}`);
    // La mise en page (inline-flex, retour a la ligne) reste dans les composants partages.
    if (/display:\s*inline-flex|flex-wrap/.test(r.corps)) {
      assert.match(r.selecteur, /^:where\(header\[data-nav\]/, `inline-flex sur des boutons a aria-label hors des composants partages : ${r.selecteur.slice(0, 90)}`);
    }
  }
});

