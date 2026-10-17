// Lecture de site.config.ts par `ff variete` / `ff composer` (scripts/ff/look-data.mjs parseConfigParts,
// scripts/ff/ts-literal.mjs). Test reel du 17 oct 2026 : un commentaire « // l'atelier » (apostrophe droite)
// etait pris pour le debut d'une chaine et faussait la lecture des champs qui suivent.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseConfigParts } from '../scripts/ff/look-data.mjs';
import { stripComments, extractTopLevelValue, setTopLevelValue } from '../scripts/ff/ts-literal.mjs';

const CONFIG = `import { defineSite } from '../../src/lib/schema';
// Prospect : l'atelier de Guy, route de Rognes.
/* ancienne piste, ecartee :
  direction: 'pierre', l'avis du client */
export default defineSite({
  slug: 'x',
  business: {
    // l'atelier d'abord
    name: 'À cœur bois',
    trade: 'Menuisier', // c'est l'ébéniste
  },
  layout: {
    // l'atelier : bloc sur mesure
    nav: 'custom/Nav',
    hero: 'custom/Mur',
    sections: [{ type: 'custom', variant: 'Atelier', label: 'L’atelier' }],
  },
  // l'atelier
  direction: 'terre',
  contact: { url: 'https://exemple.fr/l-atelier' }, // une URL n'est pas un commentaire
});
`;

test("variete : un commentaire // l'atelier avant direction: 'terre' ne fausse pas la lecture", () => {
  const cfg = parseConfigParts(CONFIG);
  assert.equal(cfg.direction, 'terre', 'la direction commentee (pierre) ne doit pas etre lue');
  assert.equal(cfg.layout.nav, 'custom/Nav');
  assert.equal(cfg.layout.hero, 'custom/Mur');
  assert.deepEqual(cfg.layout.sections, [{ type: 'custom', variant: 'Atelier', label: 'L’atelier' }]);
  assert.deepEqual(cfg.business, { name: 'À cœur bois', trade: 'Menuisier' });
  assert.equal(cfg.contact.url, 'https://exemple.fr/l-atelier', '// dans une chaine reste du texte');
});

test('stripComments : commentaires retires hors des chaines, lignes et longueur gardees', () => {
  const src = "a: 'x // pas un commentaire', // l'atelier\nb: \"/* non plus */\", /* l'avis\n sur deux lignes */ c: 1";
  const out = stripComments(src);
  assert.equal(out.length, src.length);
  assert.equal(out.split('\n').length, src.split('\n').length);
  assert.match(out, /'x \/\/ pas un commentaire'/);
  assert.match(out, /"\/\* non plus \*\/"/);
  assert.doesNotMatch(out, /atelier|avis/);
});

test("setTopLevelValue : remplace un objet qui contient un commentaire // l'atelier", () => {
  const t = setTopLevelValue(CONFIG, 'layout', { nav: 'bar' });
  assert.deepEqual(extractTopLevelValue(t, 'layout'), { nav: 'bar' });
  assert.equal(extractTopLevelValue(t, 'direction'), 'terre');
});
