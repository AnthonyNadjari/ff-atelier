// Nouvelle du moment (site.annonce → src/lib/annonce.ts, src/components/Annonce.astro, src/pages/index.astro) :
// fenêtre du/au au jour civil Europe/Paris (bornes incluses, minuit de Paris et non UTC), schéma (dates AAAA-MM-JJ),
// coquilles à crans exclues et liste tenue à jour contre les sources, composant sans couleur en dur ni pilule ni
// bouton de fermeture, script rejoué par onPage, accueil qui la place en première section.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { loadAnnonceModule, loadSchemaModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = () => JSON.parse(JSON.stringify(MINIMAL));
const MINIMAL = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'Menuisier', tagline: 'Z', description: 'D' },
  contact: { phone: '+33600000000', phoneDisplay: '06 00 00 00 00', email: 'a@b.fr', address: { postalCode: '59000', city: 'Lille' } },
  services: [{ slug: 's', title: 'T', short: 'S' }],
  about: { story: 'S' },
};

if (!tsImportable) {
  test.skip('node ne peut pas importer les .ts ici : tests annonce sautés');
} else {
  test('annonceVisible : fenêtre du/au incluse, au jour civil de Paris', async () => {
    const { annonceVisible, jourCivil } = await loadAnnonceModule();
    const a = { texte: 'Fermé du 3 au 18 août', du: '2026-08-03', au: '2026-08-18' };
    assert.equal(annonceVisible(a, new Date('2026-08-02T12:00:00Z')), false, 'la veille');
    assert.equal(annonceVisible(a, new Date('2026-08-03T12:00:00Z')), true, 'premier jour');
    assert.equal(annonceVisible(a, new Date('2026-08-18T12:00:00Z')), true, 'dernier jour inclus');
    assert.equal(annonceVisible(a, new Date('2026-08-19T12:00:00Z')), false, 'le lendemain');
    // 2026-08-18 à 22:30 UTC = 19 août 00:30 à Paris (UTC+2) : déjà le lendemain pour le client.
    assert.equal(jourCivil(new Date('2026-08-18T22:30:00Z')), '2026-08-19');
    assert.equal(annonceVisible(a, new Date('2026-08-18T22:30:00Z')), false, 'minuit de Paris, pas UTC');
    assert.equal(annonceVisible({ texte: 'Les galettes sont là' }, new Date('2026-01-05T08:00:00Z')), true, 'sans dates : toujours');
    assert.equal(annonceVisible({ texte: '  ' }, new Date()), false, 'texte vide : rien');
    assert.equal(annonceVisible(undefined, new Date()), false);
    assert.equal(annonceVisible({ texte: 'x', du: '2026-12-01' }, new Date('2026-11-30T12:00:00Z')), false, 'pas encore venue');
    assert.equal(annonceVisible({ texte: 'x', au: '2026-12-01' }, new Date('2026-11-30T12:00:00Z')), true, 'seulement une fin');
  });

  test('schéma : annonce optionnelle, dates AAAA-MM-JJ, texte obligatoire', async () => {
    const { siteSchema } = await loadSchemaModule();
    const sans = siteSchema.parse(minimal());
    assert.equal(sans.annonce, undefined);
    const avec = siteSchema.parse({ ...minimal(), annonce: { texte: 'Marché de Noël le 13 décembre', lien: '/conseils/marche', du: '2026-12-01', au: '2026-12-13' } });
    assert.equal(avec.annonce.lien, '/conseils/marche');
    assert.throws(() => siteSchema.parse({ ...minimal(), annonce: { texte: 'x', au: '13/12/2026' } }), 'date hors format');
    assert.throws(() => siteSchema.parse({ ...minimal(), annonce: { texte: '' } }), 'texte vide');
    assert.throws(() => siteSchema.parse({ ...minimal(), annonce: { lien: '/x' } }), 'texte manquant');
  });

  test('coquilles à crans : la liste suit les coquilles dont la PAGE défile par crans', async () => {
    const { COQUILLES_SANS_ANNONCE, coquilleAcceptAnnonce } = await loadAnnonceModule();
    assert.equal(coquilleAcceptAnnonce('flow'), true);
    assert.equal(coquilleAcceptAnnonce('vitrine'), false);
    for (const shell of COQUILLES_SANS_ANNONCE) {
      const src = read(`src/shells/${shell}.astro`);
      assert.match(src, /scroll-snap-type/, `${shell} : déclarée à crans sans scroll-snap-type`);
    }
    // Une coquille qui enveloppe chaque section dans un écran (.slide) ne peut pas recevoir une ligne.
    for (const f of fs.readdirSync(path.join(ROOT, 'src/shells'))) {
      const shell = f.replace(/\.astro$/, '');
      const src = read(`src/shells/${f}`);
      if (/<div class(?::list)?=\{?\[?['"]slide['"]/.test(src) || /<div class="slide">/.test(src)) {
        assert.ok(COQUILLES_SANS_ANNONCE.includes(shell), `${shell} enveloppe ses sections en écrans : à ajouter à COQUILLES_SANS_ANNONCE`);
      }
    }
  });
}

test('Annonce.astro : tokens, pas de pilule ni de fermeture ni de couche, script onPage, fenêtre rejouée', () => {
  const src = read('src/components/Annonce.astro');
  assert.match(src, /import \{ annonceVisible \} from '@\/lib\/annonce'/);
  assert.match(src, /data-annonce data-du=\{a\.du\} data-au=\{a\.au\}/);
  assert.match(src, /aria-label="Nouvelle du moment"/);
  assert.match(src, /rel=\{externe \? 'noopener' : undefined\}/);
  assert.match(src, /onPage\(/);
  assert.match(src, /timeZone: 'Europe\/Paris'/);
  assert.match(src, /el\.hidden = Boolean\(\(du && jour < du\) \|\| \(au && jour > au\)\)/);
  const style = src.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
  assert.doesNotMatch(style, /#[0-9a-fA-F]{3,8}\b/, 'couleur en dur');
  assert.doesNotMatch(style, /font-family/, 'police en dur');
  assert.doesNotMatch(style, /999px|border-radius: 9|rounded-full/, 'pas de pilule');
  assert.doesNotMatch(style, /position: (fixed|sticky)/, 'une ligne dans la page, jamais par-dessus');
  assert.doesNotMatch(src, /fermer|close|dismiss/i, 'pas de bouton de fermeture : une ligne, pas une fenêtre');
  for (const token of ['var(--line)', 'var(--surface)', 'var(--fg)', 'var(--accent)']) assert.ok(style.includes(token), `token attendu : ${token}`);
});

test('index.astro : l’annonce est la première section, seulement si visible et hors coquilles à crans', () => {
  const src = read('src/pages/index.astro');
  assert.match(src, /import Annonce from '@\/components\/Annonce\.astro'/);
  assert.match(src, /annonceVisible\(site\.annonce, new Date\(\)\) && coquilleAcceptAnnonce\(site\.layout\.shell\)/);
  assert.match(src, /sections\.unshift\(\{ type: 'annonce', variant: 'ligne', Component: Annonce \}/);
});
