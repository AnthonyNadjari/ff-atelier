// `ff relecture` : assemblage pur des prompts des relecteurs de /site-final.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assemblerPrompt, tableauVariete } from '../scripts/ff/relecture.mjs';

test('assemblerPrompt : slug, barème, grille et variété remplacés, en-tête retiré', () => {
  const brut = '# Titre interne\n\nNote au parent.\n\n---\n\nSite <slug>, encore <slug>.\n[SORTIE DE ff variete]\n[CONTENU DE relecteurs/bareme.md]\n[CONTENU DE relecteurs/grille.md]';
  const p = assemblerPrompt(brut, { slug: 'fromagerie-x', bareme: 'BAREME', grille: 'GRILLE', variete: 'VARIETE' });
  assert.ok(!p.includes('<slug>') && !p.includes('[CONTENU') && !p.includes('Note au parent'));
  assert.ok(p.includes('Site fromagerie-x, encore fromagerie-x.') && p.includes('BAREME') && p.includes('GRILLE') && p.includes('VARIETE'));
});

test('tableauVariete : une ligne par site, sections type:variante', () => {
  const t = tableauVariete([{ slug: 'a', direction: 'terre', nav: 'bar', hero: 'split', footer: 'minimal', sections: [{ type: 'faq', variant: 'accordion' }] }]);
  assert.match(t, /^slug/);
  assert.match(t, /faq:accordion/);
});
