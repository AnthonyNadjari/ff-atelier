import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pistesParDefaut, lignesMouvement, motsCles, jaccard, analyserSources, luminance, profilDepuisFichiers, axesPartages, comparer, distanceGris } from '../scripts/ff/pistes.mjs';

const contratA = `## Contrat
- PREMIER ÉCRAN : x
- MOUVEMENT (ce qu'on voit) :
  1. Entrée : le nom de la boutique s'écrit à la craie, lettre après lettre, puis un trait jaune le souligne.
  2. Rythme au défilement : chaque ligne d'ardoise s'écrit de gauche à droite en 180 ms.
  3. Feu d'artifice : toucher un fromage l'entoure d'un cercle de craie et écrit sa ferme.
  4. Image qui bouge : la part de beaufort se détache de la meule.
  Courbes : SEC = linéaire ; LENT = main.
- REFUSÉ : rideau.
- FIN : non relu = pas fini.`;
const contratB = contratA.replace("le nom de la boutique s'écrit à la craie, lettre après lettre, puis un trait jaune le souligne", "les marches de l'escalier apparaissent l'une après l'autre en descendant, la lumière baisse")
  .replace("chaque ligne d'ardoise s'écrit de gauche à droite en 180 ms", 'les meules se posent sur les planches l\'une après l\'autre avec un léger rebond')
  .replace("toucher un fromage l'entoure d'un cercle de craie et écrit sa ferme", 'on fait glisser la meule de beaufort d\'une planche à l\'autre, 12, 18, 24 mois');

const look = (o) => ({ direction: 'nuit', motion: 'rich', typography: { display: 'savate', body: 'specialGothic' }, nav: 'custom/nav', hero: 'custom/hero', footer: 'custom/pied', shell: 'flow', sections: [{ type: 'custom', variant: 'ardoise' }, { type: 'custom', variant: 'reserver' }], ...o });
const css = '--bg: #0b1220;\n--accent-h: 48;';
const cssClair = '--bg: #fdfcf9;\n--accent-h: 48;';
const srcDoigt = '<ul data-ardoise>\n<script>el.addEventListener("pointerdown", f)</script>';
const srcDefil = '<section style="view-timeline: --x block">\n<style>.a{animation-timeline: --x}</style>';

test('pistes par défaut : slug puis -b, -c existants', () => {
  assert.deepEqual(pistesParDefaut('x', ['x', 'x-b', 'x-d', 'y']), ['x', 'x-b', 'x-d']);
  assert.deepEqual(pistesParDefaut('z', ['x']), []);
});

test('lignes MOUVEMENT du contrat', () => {
  const l = lignesMouvement(contratA);
  assert.match(l.entree, /^le nom de la boutique/);
  assert.match(l.apparition, /^chaque ligne/);
  assert.match(l.geste, /^toucher un fromage/);
  assert.match(l.image, /^la part de beaufort/);
  assert.ok(!l.image.includes('Courbes'));
  assert.deepEqual(lignesMouvement('rien'), {});
});

test('mots-clés et Jaccard', () => {
  const a = motsCles("le nom de la boutique s'écrit à la craie"), b = motsCles('la craie écrit le nom');
  assert.ok(a.has('craie') && !a.has('la'));
  assert.ok(jaccard(a, b) > 0.5);
  assert.equal(jaccard(new Set(), new Set()), 0);
});

test('sources : déclencheurs et attributs', () => {
  const d = analyserSources(srcDoigt);
  assert.deepEqual([...d.declencheurs], ['doigt']);
  const s = analyserSources(srcDefil + ' <div data-reveal="clip" data-pin>');
  assert.ok(s.declencheurs.has('defilement') && s.declencheurs.has('arrivee'));
  assert.ok(s.reveals.has('clip') && s.reveals.has('pin') && s.defilement.has('pin'));
});

test('luminance', () => {
  assert.ok(luminance('#0b1220') < 0.1 && luminance('#fdfcf9') > 0.9);
  assert.equal(luminance('hsl(1 2% 3%)'), null);
});

test('deux pistes identiques partagent tout ; verdict échec', () => {
  const p = profilDepuisFichiers({ slug: 'a', look: look(), contrat: contratA, sources: srcDoigt, dirCss: css, html: '<h1>Ravanel</h1>' });
  const q = { ...profilDepuisFichiers({ slug: 'b', look: look(), contrat: contratA, sources: srcDoigt, dirCss: css, html: '<h1>Ravanel</h1>' }) };
  assert.deepEqual(axesPartages(p, q), ['squelette', 'couleur', 'typographie', 'rythme', 'geste', 'entree', 'apparition']);
  assert.ok(comparer([p, q]).echec);
});

test('deux pistes différentes : aucun axe, verdict ok', () => {
  const p = profilDepuisFichiers({ slug: 'a', look: look(), contrat: contratA, sources: srcDoigt, dirCss: css, html: '<h1>A</h1>' });
  const q = profilDepuisFichiers({ slug: 'b', look: look({ direction: 'pierre', typography: { display: 'libreCaslonCondensed', body: 'archivo' }, nav: 'custom/porte', hero: 'custom/rue', sections: [{ type: 'custom', variant: 'cave' }, { type: 'custom', variant: 'etagere' }, { type: 'custom', variant: 'reserver' }, { type: 'custom', variant: 'venir' }] }), contrat: contratB, sources: srcDefil + srcDoigt, dirCss: cssClair, html: '<h1>B</h1>' });
  const r = comparer([p, q], { 'a|b': 0.3 });
  assert.deepEqual(r.paires[0].partages, []);
  assert.equal(r.echec, false);
});

test('même entrée par le film seul : échec', () => {
  const p = profilDepuisFichiers({ slug: 'a', look: look(), contrat: contratA, sources: srcDoigt, dirCss: css, html: '' });
  const q = profilDepuisFichiers({ slug: 'b', look: look({ direction: 'pierre', typography: { display: 'archivoBlack', body: 'archivo' }, hero: 'custom/x', sections: [] }), contrat: contratB, sources: srcDefil, dirCss: cssClair, html: '' });
  assert.ok(axesPartages(p, q, 0.02).includes('entree'));
  assert.ok(!axesPartages(p, q, 0.2).includes('entree'));
});

test('h1 révélé par lignes des deux côtés = même entrée (moteur)', () => {
  const html = '<h1 data-split="lines">X</h1>';
  const p = profilDepuisFichiers({ slug: 'a', look: look(), contrat: '', sources: '', dirCss: css, html });
  const q = profilDepuisFichiers({ slug: 'b', look: look({ direction: 'encre', typography: { display: 'archivoBlack' } }), contrat: '', sources: '', dirCss: cssClair, html });
  assert.ok(axesPartages(p, q).includes('entree'));
});

test('distance de gris', () => {
  assert.equal(distanceGris([0, 0], [255, 255]), 1);
  assert.equal(distanceGris([10, 20], [10, 20]), 0);
  assert.equal(distanceGris([1], [1, 2]), null);
});
