// Tests du bloc « Textes / rythme » de scripts/ff/verifier.mjs (docs/REDACTION.md §14) : les sept
// avertissements qui reperent les tells d'un texte ecrit par une machine en francais. Tous sont des
// warnings, jamais des echecs — ces tests verifient donc qu'ils remplissent bien le tableau
// `warnings` et qu'ils restent silencieux sur un texte ecrit normalement.
// Fixtures HTML ecrites dans un dossier temporaire, sans build Astro (meme approche que
// tests/verifier-eyebrow.test.mjs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  warnRythmeUniforme,
  warnTiretsCadratins,
  warnMotsValises,
  warnEnumerationsTernaires,
  warnAucunePhraseParlee,
  warnPageServiceSansChiffre,
  warnFaqReponsesUniformes,
} from '../scripts/ff/verifier.mjs';

/** Ecrit une page dans un dist/ temporaire et renvoie { dir, file }. `name` peut contenir un
 * sous-dossier ("services/coupe.html"). */
function page(name, corpsMain) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ff-verifier-textes-'));
  const file = path.join(dir, name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(
    file,
    `<!doctype html><html lang="fr"><body><nav><a href="tel:+33600000000">06 00 00 00 00</a></nav>` +
      `<main id="main">${corpsMain}</main>` +
      `<footer><p>06 00 00 00 00 — 4 impasse des Forges, 31200 Toulouse</p></footer></body></html>`,
    'utf8',
  );
  return { dir, file };
}

// --- R1 : rythme binaire / rythme plat ---

test('warnRythmeUniforme : avertit sur trois phrases consecutives de longueur proche', () => {
  const { dir, file } = page(
    'index.html',
    `<p>Nous posons des portails en acier sur toute la metropole. Nous dessinons chaque piece avec le client qui commande. Nous livrons ensuite la piece finie sur le chantier prevu.</p>`,
  );
  const warnings = [];
  warnRythmeUniforme([file], dir, warnings);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /Rythme binaire/);
});

test('warnRythmeUniforme : silencieux quand les longueurs varient', () => {
  const { dir, file } = page(
    'index.html',
    `<p>Nous posons des portails en acier sur toute la metropole de Toulouse et alentour. On est deux. Le dessin passe par vous avant de partir au feu, puis la piece est montee sur place en une matinee.</p>`,
  );
  const warnings = [];
  warnRythmeUniforme([file], dir, warnings);
  assert.deepEqual(warnings, []);
});

test('warnRythmeUniforme : avertit sur une page dont toutes les phrases font la meme longueur', () => {
  const phrase = 'Le fer est chauffe puis martele dans notre atelier toulousain chaque matin.';
  const { dir, file } = page('index.html', `<p>${phrase}</p>`.repeat(9));
  const warnings = [];
  warnRythmeUniforme([file], dir, warnings);
  assert.ok(warnings.some((w) => /Rythme plat/.test(w)), warnings.join(' | '));
});

// --- R2 : tirets cadratins ---

test('warnTiretsCadratins : avertit au-dela d\'un tiret long pour 500 caracteres', () => {
  const { dir, file } = page('index.html', `<p>Le fer — chauffe au charbon — repart en piece — montee sur place.</p>`);
  const warnings = [];
  warnTiretsCadratins([file], dir, warnings);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /Tirets cadratins/);
});

test('warnTiretsCadratins : un tiret isole ne declenche rien', () => {
  const { dir, file } = page('index.html', `<p>Le fer est chauffe au charbon — puis martele.</p>`);
  const warnings = [];
  warnTiretsCadratins([file], dir, warnings);
  assert.deepEqual(warnings, []);
});

// --- R3 : mots-valises ---

test('warnMotsValises : repere "savoir-faire" et "au coeur de"', () => {
  const { dir, file } = page('index.html', `<p>Un savoir-faire transmis, au coeur de la Croix-Rousse.</p>`);
  const warnings = [];
  warnMotsValises([file], dir, warnings);
  assert.equal(warnings.length, 2);
  assert.ok(warnings.some((w) => /savoir-faire/.test(w)));
  assert.ok(warnings.some((w) => /cœur|coeur/.test(w)));
});

test('warnMotsValises : silencieux sur un texte concret', () => {
  const { dir, file } = page('index.html', `<p>Le levain travaille douze heures, la fournee sort a 6h30.</p>`);
  const warnings = [];
  warnMotsValises([file], dir, warnings);
  assert.deepEqual(warnings, []);
});

// --- R4 : enumerations ternaires ---

test('warnEnumerationsTernaires : avertit a partir de quatre triplets sur une page', () => {
  const { dir, file } = page(
    'index.html',
    `<p>Portails, rampes et escaliers. Acier, bronze ou laiton. Toulouse, Blagnac et Balma. Marteau, enclume et presse.</p>`,
  );
  const warnings = [];
  warnEnumerationsTernaires([file], dir, warnings);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /Enumerations ternaires/);
});

test('warnEnumerationsTernaires : trois triplets restent sous le seuil', () => {
  const { dir, file } = page('index.html', `<p>Portails, rampes et escaliers. Acier, bronze ou laiton. Toulouse, Blagnac et Balma.</p>`);
  const warnings = [];
  warnEnumerationsTernaires([file], dir, warnings);
  assert.deepEqual(warnings, []);
});

// --- R5 : aucune phrase parlee sur l'accueil ---

test('warnAucunePhraseParlee : avertit quand aucune phrase ne commence par Et/Mais/Alors', () => {
  const phrases = Array.from({ length: 12 }, (_, i) => `<p>La piece numero ${i} est montee sur place.</p>`).join('');
  const { dir, file } = page('index.html', phrases);
  const warnings = [];
  warnAucunePhraseParlee([file], dir, warnings);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /sans oral/);
});

test('warnAucunePhraseParlee : une seule phrase parlee suffit a taire l\'avertissement', () => {
  const phrases = Array.from({ length: 12 }, (_, i) => `<p>La piece numero ${i} est montee sur place.</p>`).join('');
  const { dir, file } = page('index.html', `${phrases}<p>Mais un portail motorise demande un passage du electricien.</p>`);
  const warnings = [];
  warnAucunePhraseParlee([file], dir, warnings);
  assert.deepEqual(warnings, []);
});

test('warnAucunePhraseParlee : ignore une page qui n\'est pas l\'accueil', () => {
  const phrases = Array.from({ length: 12 }, (_, i) => `<p>La piece numero ${i} est montee sur place.</p>`).join('');
  const { dir, file } = page('services/portails.html', phrases);
  const warnings = [];
  warnAucunePhraseParlee([file], dir, warnings);
  assert.deepEqual(warnings, []);
});

// --- R6 : page de service sans chiffre ---

test('warnPageServiceSansChiffre : avertit sur une page service sans aucun chiffre', () => {
  const { dir, file } = page('services/coupe.html', `<p>La coupe se fait au ciseau puis a la tondeuse.</p>`);
  const warnings = [];
  warnPageServiceSansChiffre([file], dir, warnings);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /sans aucun chiffre/);
});

test('warnPageServiceSansChiffre : un prix dans <main> suffit, le telephone du pied de page ne compte pas', () => {
  const { dir, file } = page('services/coupe.html', `<p>La coupe se fait au ciseau, 28 euros.</p>`);
  const warnings = [];
  warnPageServiceSansChiffre([file], dir, warnings);
  assert.deepEqual(warnings, []);
});

test('warnPageServiceSansChiffre : l\'accueil n\'est pas concerne', () => {
  const { dir, file } = page('index.html', `<p>La coupe se fait au ciseau puis a la tondeuse.</p>`);
  const warnings = [];
  warnPageServiceSansChiffre([file], dir, warnings);
  assert.deepEqual(warnings, []);
});

// --- R7 : reponses de FAQ uniformes ---

test('warnFaqReponsesUniformes : avertit a partir de trois reponses commencant par "Oui,"', () => {
  const { dir, file } = page(
    'index.html',
    `<p>Oui, le samedi sans rendez-vous.</p><p>Oui, les enfants sont recus.</p><p>Oui, la reservation se fait en ligne.</p>`,
  );
  const warnings = [];
  warnFaqReponsesUniformes([file], dir, warnings);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /« Oui, »/);
});

test('warnFaqReponsesUniformes : deux "Oui," restent sous le seuil', () => {
  const { dir, file } = page('index.html', `<p>Oui, le samedi sans rendez-vous.</p><p>Oui, les enfants sont recus.</p>`);
  const warnings = [];
  warnFaqReponsesUniformes([file], dir, warnings);
  assert.deepEqual(warnings, []);
});
