// `ff apercu-rapide` (scripts/ff/apercu-rapide.mjs) : mise en page pure de l'image unique (premier écran en grand à
// gauche, pages entières coupées en colonnes à droite) et choix des pages de --pages. Sans navigateur.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { disposerApercuRapide, choisirPages, MAX_COLONNES, LARGEUR_COLONNE, MARGE, ENTETE } from '../scripts/ff/apercu-rapide.mjs';

const PREMIER = { w: 780, h: 1688 }; // 390x844 @2x

test('premier écran à gauche, en entier, sous l en-tête', () => {
  const d = disposerApercuRapide({ premier: PREMIER, pages: [] });
  assert.deepEqual(d.premier, { left: MARGE, top: ENTETE });
  assert.equal(d.height, ENTETE + PREMIER.h + MARGE);
  assert.equal(d.width, MARGE + PREMIER.w + MARGE);
});

test('page entière : réduite à la largeur de colonne de son appareil, coupée en tranches de la hauteur du premier écran', () => {
  // Accueil téléphone de 390 x 5 000 px -> 300 px de large, 3 846 px de haut -> 3 tranches.
  const d = disposerApercuRapide({ premier: PREMIER, pages: [{ w: 390, h: 5000, appareil: 'telephone', libelle: 'Accueil' }] });
  const b = d.blocs[0];
  assert.equal(b.largeur, LARGEUR_COLONNE.telephone);
  assert.equal(b.hauteurReduite, Math.round(5000 * 300 / 390));
  assert.equal(b.tranches.length, 3);
  assert.deepEqual(b.tranches.map((t) => t.haut), [0, 1688, 3376]);
  assert.equal(b.tranches[2].hauteur, b.hauteurReduite - 3376);
  assert.ok(b.left > PREMIER.w + MARGE, 'à droite du premier écran');
  for (const t of b.tranches) assert.ok(t.top + t.hauteur <= d.height - MARGE + 1, 'aucune tranche ne dépasse');
  assert.ok(b.tranches.at(-1).left + b.largeur <= d.width, 'l image contient la dernière tranche');
});

test('page très longue : la colonne rétrécit pour tenir en MAX_COLONNES tranches ; les blocs ne se chevauchent pas', () => {
  const d = disposerApercuRapide({
    premier: PREMIER,
    pages: [
      { w: 390, h: 30000, appareil: 'telephone', libelle: 'Accueil, téléphone' },
      { w: 1400, h: 9000, appareil: 'ordinateur', libelle: 'Accueil, ordinateur' },
    ],
  });
  const [tel, ordi] = d.blocs;
  assert.equal(tel.tranches.length, MAX_COLONNES);
  assert.ok(tel.largeur < LARGEUR_COLONNE.telephone);
  assert.ok(tel.hauteurReduite <= MAX_COLONNES * PREMIER.h);
  assert.equal(ordi.largeur, LARGEUR_COLONNE.ordinateur);
  const finTel = tel.tranches.at(-1).left + tel.largeur;
  assert.ok(ordi.left >= finTel + MARGE, 'marge entre deux pages');
  assert.ok(ordi.tranches.at(-1).left + ordi.largeur <= d.width);
});

test('choisirPages : première page de service, puis une page de contenu (préférée), jamais légale ni 404', () => {
  const chemins = ['index.html', '404.html', 'mentions-legales.html', 'confidentialite.html', 'credits.html', 'services/escaliers/index.html', 'services/cuisines/index.html', 'zones/lille.html', 'contact.html'];
  assert.deepEqual(choisirPages(chemins), ['/services/cuisines', '/contact']);
  assert.deepEqual(choisirPages(chemins, ['/', '/services/escaliers/', '/services/cuisines']), ['/services/escaliers', '/contact'], 'ordre des liens de l accueil');
  assert.deepEqual(choisirPages(['index.html', 'services/a.html', 'mentions-legales.html']), ['/services/a']);
  assert.deepEqual(choisirPages(['index.html', 'mentions-legales.html', 'zones/lille/index.html']), ['/zones/lille']);
});
