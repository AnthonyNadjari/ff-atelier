// Test de warnEyebrowTropLong (scripts/ff/verifier.mjs) : avertissement quand un `.eyebrow` du
// HTML livre depasse 40 caracteres (illisible en petites capitales espacees, meme seuil que la
// regle "all-caps-body" de l'audit impeccable, correction du 18 septembre 2026). Fixtures HTML
// ecrites dans un dossier temporaire, sans build Astro (rapide, comme tests/headers.test.mjs
// partie 1).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { warnEyebrowTropLong } from '../scripts/ff/verifier.mjs';

function writeFixture(name, html) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ff-verifier-eyebrow-'));
  const file = path.join(dir, name);
  fs.writeFileSync(file, html, 'utf8');
  return { dir, file };
}

test('warnEyebrowTropLong : avertit sur un eyebrow de plus de 40 caracteres', () => {
  const html = `<!doctype html><html><body>
    <p class="eyebrow">Boulangerie-pâtisserie · Croix-Rousse, Lyon · depuis 1987</p>
  </body></html>`;
  const { dir, file } = writeFixture('index.html', html);
  const warnings = [];
  warnEyebrowTropLong([file], dir, warnings);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /plus de 40 caracteres/);
  assert.match(warnings[0], /Boulangerie-pâtisserie/);
});

test('warnEyebrowTropLong : silencieux sous 40 caracteres', () => {
  const html = `<!doctype html><html><body>
    <p class="eyebrow">Boulangerie-pâtisserie · Lyon</p>
  </body></html>`;
  const { dir, file } = writeFixture('index.html', html);
  const warnings = [];
  warnEyebrowTropLong([file], dir, warnings);
  assert.equal(warnings.length, 0);
});

test('warnEyebrowTropLong : span.eyebrow aussi couvert, balises internes ignorees dans le compte', () => {
  const html = `<!doctype html><html><body>
    <span class="eyebrow flex items-center gap-3"><i aria-hidden="true"></i>Un eyebrow correct</span>
  </body></html>`;
  const { dir, file } = writeFixture('index.html', html);
  const warnings = [];
  warnEyebrowTropLong([file], dir, warnings);
  assert.equal(warnings.length, 0);
});

test('warnEyebrowTropLong : ignore le texte hors classe "eyebrow"', () => {
  const html = `<!doctype html><html><body>
    <p class="text-muted">Un texte de plus de quarante caracteres qui ne doit pas etre signale ici</p>
  </body></html>`;
  const { dir, file } = writeFixture('index.html', html);
  const warnings = [];
  warnEyebrowTropLong([file], dir, warnings);
  assert.equal(warnings.length, 0);
});
