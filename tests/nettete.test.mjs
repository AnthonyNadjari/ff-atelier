// Tests de la fonction pure de calcul ratio/verdict de `ff nettete` (scripts/ff/nettete.mjs) : aucun
// navigateur, aucun fichier — uniquement verdictAgrandissement (images/frames/video) et
// verdictPoidsFrame (poids moyen d'une frame de sequence data-frames). Nee du cas forge-delacroix
// (sequence "Le geste" : 48 images 1280x720 a 5 Ko/image, etirees sur un canvas plein ecran DPR 2,
// jamais detecte car aucun outil ne mesurait la nettete).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verdictAgrandissement, verdictPoidsFrame, symboleVerdict } from '../scripts/ff/nettete.mjs';

test('verdictAgrandissement : image nette (ratio <= 1) -> ok', () => {
  // affichee 640px x dpr 2 = 1280px de besoin, source 1280px pile -> ratio 1.0
  const r = verdictAgrandissement({ displayPx: 640, dpr: 2, naturalPx: 1280 });
  assert.equal(r.ratio, 1);
  assert.equal(r.verdict, 'ok');
});

test('verdictAgrandissement : ratio entre 1,0 et 1,25 -> limite (avertissement)', () => {
  // besoin 1280px, source 1100px -> ratio ~1.164
  const r = verdictAgrandissement({ displayPx: 640, dpr: 2, naturalPx: 1100 });
  assert.ok(r.ratio > 1 && r.ratio <= 1.25, `ratio attendu entre 1 et 1.25, obtenu ${r.ratio}`);
  assert.equal(r.verdict, 'limite');
});

test('verdictAgrandissement : ratio > 1,25 -> floue (le cas forge-delacroix)', () => {
  // canvas plein ecran 1280px de large affiche a DPR 2 = 2560px de besoin, source reelle 1280px large
  // (les 48 frames de la sequence "Le geste") -> ratio 2.0, tres au-dessus du seuil de 1.25.
  const r = verdictAgrandissement({ displayPx: 1280, dpr: 2, naturalPx: 1280 });
  assert.equal(r.ratio, 2);
  assert.equal(r.verdict, 'floue');
  assert.equal(symboleVerdict(r.verdict), '✗');
});

test('verdictAgrandissement : source deux fois plus grande que necessaire -> surdimensionnee (gaspillage)', () => {
  // besoin 640px (affichee 320 x dpr 2), source 1400px -> ratio 0.457 (net) mais 1400 > 2 x 640
  const r = verdictAgrandissement({ displayPx: 320, dpr: 2, naturalPx: 1400 });
  assert.ok(r.ratio < 1, 'une image surdimensionnee reste nette (ratio < 1)');
  assert.equal(r.verdict, 'surdimensionnee');
  assert.equal(symboleVerdict(r.verdict), '⚠');
});

test('verdictAgrandissement : juste sous le seuil de gaspillage (naturalPx == 2x besoin) -> ok', () => {
  const r = verdictAgrandissement({ displayPx: 320, dpr: 2, naturalPx: 1280 }); // besoin 640, source 1280 = 2x pile
  assert.equal(r.verdict, 'ok');
});

test('verdictAgrandissement : mesures manquantes/nulles -> inconnu, jamais un faux ✗', () => {
  assert.equal(verdictAgrandissement({ displayPx: 0, dpr: 2, naturalPx: 800 }).verdict, 'inconnu');
  assert.equal(verdictAgrandissement({ displayPx: 400, dpr: 2, naturalPx: 0 }).verdict, 'inconnu');
  assert.equal(verdictAgrandissement({ displayPx: 400, dpr: 0, naturalPx: 800 }).verdict, 'inconnu');
});

test('verdictAgrandissement : seuils personnalisables (seuilFloue/seuilSurdimensionnement)', () => {
  const r = verdictAgrandissement({ displayPx: 500, dpr: 1, naturalPx: 450, seuilFloue: 1.05 });
  assert.equal(r.verdict, 'floue'); // ratio 1.111 > 1.05 personnalise, alors que < 1.25 par defaut
});

test('verdictPoidsFrame : frame >= 1280px et < 15 Ko -> destructrice (le cas forge-delacroix, 5 Ko/image)', () => {
  assert.equal(verdictPoidsFrame({ naturalPx: 1280, avgBytes: 5 * 1024 }), 'destructrice');
  assert.equal(symboleVerdict('destructrice'), '✗');
});

test('verdictPoidsFrame : entre 15 et 30 Ko -> legere (avertissement)', () => {
  assert.equal(verdictPoidsFrame({ naturalPx: 1600, avgBytes: 20 * 1024 }), 'legere');
  assert.equal(symboleVerdict('legere'), '⚠');
});

test('verdictPoidsFrame : >= 30 Ko -> ok', () => {
  assert.equal(verdictPoidsFrame({ naturalPx: 1280, avgBytes: 40 * 1024 }), 'ok');
});

test('verdictPoidsFrame : sous le seuil de largeur (< 1280px) -> ok quel que soit le poids (seuil non pertinent)', () => {
  assert.equal(verdictPoidsFrame({ naturalPx: 800, avgBytes: 1 * 1024 }), 'ok');
});

test('verdictPoidsFrame : poids non mesure (0/absent) -> inconnu, jamais un faux ✗', () => {
  assert.equal(verdictPoidsFrame({ naturalPx: 1600, avgBytes: 0 }), 'inconnu');
  assert.equal(verdictPoidsFrame({ naturalPx: 1600, avgBytes: undefined }), 'inconnu');
});

test('symboleVerdict : mappe chaque verdict a un symbole ✓/⚠/✗ correct', () => {
  assert.equal(symboleVerdict('ok'), '✓');
  assert.equal(symboleVerdict('floue'), '✗');
  assert.equal(symboleVerdict('destructrice'), '✗');
  assert.equal(symboleVerdict('limite'), '⚠');
  assert.equal(symboleVerdict('surdimensionnee'), '⚠');
  assert.equal(symboleVerdict('legere'), '⚠');
  assert.equal(symboleVerdict('inconnu'), '⚠');
});
