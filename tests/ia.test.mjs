// Tests de `ff ia` (scripts/ff/ia.mjs) : les signes « fait par une IA » doivent être repérés, et rien
// d'autre (6 oct 2026, docs/veille/signes-ia.md).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyserHtml, analyserDirection, analyserTypographie, estPoliceIa, texteVisible } from '../scripts/ff/ia.mjs';

test('tiret cadratin et point médian dans le texte visible : échec', () => {
  const r = analyserHtml('<title>Maison Roux — Boulangerie</title><p>Pain · Viennoiseries</p>');
  assert.deepEqual(r.echecs.map((e) => e.regle).sort(), ['point-median', 'tiret-cadratin']);
});

test('les commentaires, scripts, styles et attributs ne comptent pas', () => {
  const html = '<!-- a — b --><script>const x = "a — b · c";</script><style>/* — */</style><p data-x="a — b" aria-label="a · b">Texte propre.</p>';
  assert.equal(analyserHtml(html).echecs.length, 0);
  assert.equal(texteVisible(html).trim(), 'Texte propre.');
});

test('le tiret demi-cadratin des intervalles (9 h – 18 h) reste permis', () => {
  assert.equal(analyserHtml('<p>Lundi – vendredi, 9 h – 18 h</p>').echecs.length, 0);
});

test('coches façon tarif et capitales espacées : alertes, pas échecs', () => {
  const r = analyserHtml('<svg><path d="M20 6 9 17l-5-5"/></svg><p class="text-xs uppercase tracking-[0.2em]">Label</p>');
  assert.equal(r.echecs.length, 0);
  assert.deepEqual(r.alertes.map((a) => a.regle).sort(), ['capitales-espacees', 'coches']);
});

test('direction : polices IA, titre en italique (échecs), pilule (alerte)', () => {
  const css = `@import '@fontsource-variable/cormorant';
[data-direction='x'] { --font-display: 'Cormorant Variable', serif; --font-body: 'Karla Variable', sans-serif; --radius: 999px; }
[data-direction='x'] h1 em { font-style: italic; }`;
  const r = analyserDirection(css);
  assert.deepEqual(r.echecs.map((e) => e.regle).sort(), ['polices-ia', 'titre-italique']);
  assert.deepEqual(r.alertes.map((a) => a.regle), ['boutons-pilule']);
});

test('direction saine : rien', () => {
  const css = `@import '@fontsource-variable/bodoni-moda';
[data-direction='x'] { --font-display: 'Bodoni Moda Variable', serif; --font-body: 'Hanken Grotesk Variable', sans-serif; --radius: 3px; }
[data-direction='x'] h1 em { font-style: normal; }`;
  const r = analyserDirection(css);
  assert.equal(r.echecs.length + r.alertes.length, 0);
});

test('typographie forcée par un site', () => {
  assert.equal(analyserTypographie("typography: { display: 'playfair', body: 'hanken' },").echecs.length, 1);
  assert.equal(analyserTypographie("typography: { display: 'bodoni', body: 'hanken' },").echecs.length, 0);
});

test('reconnaissance des noms de polices', () => {
  for (const n of ['cormorant', 'Instrument Sans Variable', 'space-grotesk', 'playfair-display', 'dm-sans']) assert.ok(estPoliceIa(n), n);
  for (const n of ['bodoni-moda', 'hanken-grotesk', 'Karla Variable', 'literata', 'archivo']) assert.ok(!estPoliceIa(n), n);
});

test('effets interdits par GOÛT (grain, spotlight, aurora) : alerte', () => {
  const r = analyserHtml('<section data-grain><div data-spotlight></div><canvas data-shader="aurora"></canvas></section>');
  assert.deepEqual(r.alertes.map((a) => a.regle), ['effets-interdits']);
  assert.equal(r.alertes[0].n, 3);
});

test('numérotation décorative 01 02 03 : alerte à partir de trois', () => {
  assert.deepEqual(analyserHtml('<p>01</p><p>02</p><p>03</p><p>Devis</p>').alertes.map((a) => a.regle), ['numerotation-decorative']);
  assert.equal(analyserHtml('<p>01</p><p>02</p>').alertes.length, 0);
  assert.equal(analyserHtml('<p>Ouvert de 09 h à 19 h, le 05 et le 06</p>').alertes.length, 0);
});

test('effets interdits : le CSS en ligne du moteur ne compte pas', () => {
  assert.equal(analyserHtml('<style>[data-grain]:after{opacity:.3}[data-spotlight]{}</style><p>Fromages</p>').alertes.length, 0);
});

test('titres de section révélés par lignes : échec au-delà de deux', () => {
  const h = '<h1 data-split="lines">A</h1>' + '<h2 data-split="lines">B</h2>'.repeat(3);
  assert.ok(analyserHtml(h).echecs.some((e) => e.regle === 'split-titres'));
  assert.ok(!analyserHtml('<h1 data-split>A</h1><h2 data-split>B</h2><h2>C</h2>').echecs.some((e) => e.regle === 'split-titres'));
});

test('rideau, photo d’illustration, titres tous à point final : alertes', () => {
  const r = analyserHtml('<div class="ff-curtain"></div><p>Une cave (photo d’illustration).</p><h1>Ici, les fromages s’affinent sous la boutique.</h1><h2>La cave est sous la boutique.</h2><h2>Deux choses se réservent ici.</h2><h2>Pour réserver, appelez la boutique.</h2>');
  const regles = r.alertes.map((a) => a.regle);
  assert.ok(regles.includes('rideau') && regles.includes('photo-illustration') && regles.includes('titres-point'), regles.join(','));
});

test('titres-étiquettes variés : pas d’alerte titres-point', () => {
  const r = analyserHtml('<h1>Fromagerie Ravanel</h1><h2>L’ardoise</h2><h2>Beaufort 24 mois</h2><h2>Où nous trouver le mardi ?</h2>');
  assert.ok(!r.alertes.some((a) => a.regle === 'titres-point'));
});

test('surtitre eyebrow juste au-dessus du h1 : échec', () => {
  assert.ok(analyserHtml('<p class="eyebrow mt-8">Fromager à Annecy</p><h1>Ravanel</h1>').echecs.some((e) => e.regle === 'surtitre-h1'));
  assert.ok(!analyserHtml('<h1>Ravanel</h1><p class="eyebrow">Horaires</p><h2>Semaine</h2>').echecs.some((e) => e.regle === 'surtitre-h1'));
});
