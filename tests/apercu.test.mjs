// `ff apercu` (scripts/ff/apercu.mjs) : l'aperçu du meilleur d'un tour de veille (fondateur, 27 oct 2026). Fonctions pures
// (lecture des entrées, disposition, coupe du texte) et place de l'étape dans la skill /veille.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { lireEntree, disposerApercu, couperLignes, LARGEUR_COLONNE, MARGE, ENTETE, LEGENDE } from '../scripts/ff/apercu.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');

test('lireEntree : « Libellé=chemin », le premier = sépare ; refuse le reste', () => {
  assert.deepEqual(lireEntree('Source : a.fr=captures/a-m.webp'), { libelle: 'Source : a.fr', chemin: 'captures/a-m.webp' });
  assert.deepEqual(lireEntree('Usine=dossier/x=y.png'), { libelle: 'Usine', chemin: 'dossier/x=y.png' });
  assert.equal(lireEntree('sans-egal.png'), null);
  assert.equal(lireEntree('=x.png'), null);
  assert.equal(lireEntree('Libellé='), null);
});

test('disposerApercu : colonnes de même largeur sous l’en-tête et la légende', () => {
  const d = disposerApercu(3, 1000);
  assert.deepEqual(d.colonnes.map((c) => c.left), [MARGE, MARGE + LARGEUR_COLONNE + MARGE, MARGE + 2 * (LARGEUR_COLONNE + MARGE)]);
  assert.ok(d.colonnes.every((c) => c.top === ENTETE + LEGENDE));
  assert.equal(d.width, MARGE + 3 * (LARGEUR_COLONNE + MARGE));
  assert.equal(d.height, ENTETE + LEGENDE + 1000 + MARGE);
});

test('couperLignes : coupe aux espaces, deux lignes au plus, points de suspension', () => {
  assert.deepEqual(couperLignes('un deux trois', 8), ['un deux', 'trois']);
  assert.deepEqual(couperLignes('', 10), []);
  const l = couperLignes('a b c d e f g h i j', 3, 2);
  assert.equal(l.length, 2);
  assert.match(l[1], /…$/);
});

test('skill /veille : étape « aperçu du meilleur » avant le journal, commande déclarée, aide', () => {
  const skill = fs.readFileSync(path.join(ROOT, '.claude/skills/veille/SKILL.md'), 'utf8');
  const i = skill.indexOf("## 4 bis. L'aperçu du meilleur");
  assert.ok(i > 0 && i < skill.indexOf('## 5. Journal et sauvegarde'));
  assert.match(skill, /node scripts\/ff\.mjs apercu/);
  assert.match(skill, /SendUserFile/);
  assert.match(fs.readFileSync(path.join(ROOT, 'scripts/ff.mjs'), 'utf8'), /apercu: cmdApercu/);
  assert.match(fs.readFileSync(path.join(ROOT, 'scripts/ff/aide.mjs'), 'utf8'), /'apercu --titre/);
});
