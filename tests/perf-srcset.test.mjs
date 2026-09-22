// Tests de la regle "un srcset ne coute qu'UN fichier" de `ff perf` (scripts/ff/perf.mjs) : le
// candidat compte dans images-home est celui que le telephone de reference (390 px CSS @3x, comme le
// viewport mobile de `ff nettete`) choisit d'apres `sizes` — et non plus « le plus grand <= 800w »,
// qui sous-estimait ce qu'un mobile moderne telecharge vraiment (100vw @3x = 1 170 px -> candidat 1200).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluerSizes, srcsetUrls, MOBILE_REFERENCE } from '../scripts/ff/perf.mjs';

const SRCSET = '/images/h-480.avif 480w, /images/h-800.avif 800w, /images/h-1200.avif 1200w, /images/h-1600.avif 1600w, /images/h.avif 2400w';

test('MOBILE_REFERENCE : 390 px @3x, aligne sur le viewport mobile de ff nettete', () => {
  assert.deepEqual(MOBILE_REFERENCE, { width: 390, dpr: 3 });
});

test('evaluerSizes : vw/px/rem, conditions min-width evaluees a la largeur donnee, repli final', () => {
  assert.equal(evaluerSizes('100vw'), 390);
  assert.equal(evaluerSizes('96px'), 96);
  assert.equal(evaluerSizes('40rem'), 640);
  assert.equal(evaluerSizes('(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'), 390);
  assert.equal(evaluerSizes('(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw', 700), 350);
  assert.equal(evaluerSizes('(min-width: 1280px) 592px, (min-width: 1024px) 50vw, 100vw', 1400), 592);
  assert.equal(evaluerSizes('(max-width: 640px) 50vw, 20vw', 390), 195);
  assert.equal(evaluerSizes(null), 390, 'sans sizes, le navigateur suppose 100vw');
  assert.equal(evaluerSizes(''), 390);
});

test('srcsetUrls : 100vw sur le mobile de reference -> candidat 1200 (besoin 1 170 px)', () => {
  assert.deepEqual(srcsetUrls(SRCSET, '100vw'), ['/images/h-1200.avif']);
  assert.deepEqual(srcsetUrls(SRCSET, undefined), ['/images/h-1200.avif']);
});

test('srcsetUrls : grille 2 colonnes en mobile (50vw) -> 585 px -> candidat 800 ; vignette 96px -> 480', () => {
  assert.deepEqual(srcsetUrls(SRCSET, '(min-width: 768px) 25vw, 50vw'), ['/images/h-800.avif']);
  assert.deepEqual(srcsetUrls(SRCSET, '96px'), ['/images/h-480.avif']);
});

test('srcsetUrls : besoin au-dela du plus grand candidat -> le plus grand', () => {
  assert.deepEqual(srcsetUrls('/a-480.avif 480w, /a.avif 800w', '100vw'), ['/a.avif']);
});

test('srcsetUrls : srcset en descripteurs x ou sans descripteur -> premier candidat', () => {
  assert.deepEqual(srcsetUrls('/a.webp 1x, /b.webp 2x', '100vw'), ['/a.webp']);
  assert.deepEqual(srcsetUrls('/seul.webp', '100vw'), ['/seul.webp']);
  assert.deepEqual(srcsetUrls('', '100vw'), []);
});

test('perf : le routeur de page est budgete explicitement, et seulement pour les sites en transitions', async () => {
  const { budgetEffectif } = await import('../scripts/ff/perf.mjs');
  const base = { maxKB: 40 };
  assert.equal(budgetEffectif('js-initial', base, { transitions: false }).maxKB, 40);
  assert.equal(budgetEffectif('js-initial', base, { transitions: true }).maxKB, 56);
  assert.match(budgetEffectif('js-initial', base, { transitions: true }).note, /routeur/);
  // Les autres categories ne beneficient d'aucune tolerance.
  assert.equal(budgetEffectif('css', { maxKB: 120 }, { transitions: true }).maxKB, 120);
});
