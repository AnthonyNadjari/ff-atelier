// Disposition (scripts/ff/disposition.mjs) : fonctions pures seulement. Classement des formes à partir de boîtes
// synthétiques, linéarité, accord des formes, style maison, et la CALIBRATION du 31 oct 2026 (mesures réelles de blocs
// relevées en Chrome : dune, casabonay.com, demo-architecte, wallpaper.com ; tableau de l'en-tête). Aucun navigateur.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mesuresForme, formeDe, dispositionMode, linearite, linearitePonderee, disposition, rafraichirDisposition, estBande,
  accordFormes, accordParts, partsFormes, similariteDisposition, suiteFormes, ceQuiEstPareilDisposition, dispositionEnMots,
  styleMaison, phraseStyleMaison, estPied, SEUIL_LINEARITE, CALIBRATION_MESURES, FORMES,
} from '../scripts/ff/disposition.mjs';

const VW = 1400, VH = 900;
const ctx = { vw: VW, vh: VH, colonne: null };
const t = (x, y, w, h) => ['t', x, y, w, h];
const i = (x, y, w, h) => ['i', x, y, w, h];
const forme = (raw, c = ctx) => formeDe(mesuresForme(raw, c)).forme;

test('pile : une colonne centrée, titre, texte puis image', () => {
  assert.equal(forme({ b: [0, 0, 1400, 900], contenus: [t(350, 100, 700, 60), t(350, 200, 700, 200), i(350, 450, 700, 400)] }), 'pile');
});

test('colonnes : texte à gauche, image à droite', () => {
  assert.equal(forme({ b: [0, 0, 1400, 900], contenus: [t(100, 150, 550, 500), i(750, 100, 550, 700)] }), 'colonnes');
});

test('grille : un titre puis trois cartes côte à côte', () => {
  const cartes = [100, 550, 1000].flatMap((x) => [i(x, 200, 300, 300), t(x, 520, 300, 120)]);
  assert.equal(forme({ b: [0, 0, 1400, 900], contenus: [t(100, 60, 600, 60), ...cartes] }), 'grille');
});

test('decale : tout le contenu calé à gauche, 50 % de vide à droite', () => {
  assert.equal(forme({ b: [0, 0, 1400, 900], contenus: [t(80, 100, 600, 80), t(80, 220, 600, 300), i(80, 560, 560, 300)] }), 'decale');
});

test('decale : deux images côte à côte en quinconce', () => {
  assert.equal(forme({ b: [0, 0, 1400, 1200], contenus: [i(100, 100, 500, 600), i(700, 400, 500, 600)] }), 'decale');
});

test('chevauche : deux images qui se croisent, un texte à cheval sur une image, un débord sur le voisin', () => {
  assert.equal(forme({ b: [0, 0, 1400, 900], contenus: [i(100, 100, 600, 500), i(500, 300, 600, 500)] }), 'chevauche');
  assert.equal(forme({ b: [0, 0, 1400, 900], contenus: [i(400, 100, 900, 700), t(100, 300, 600, 120)] }), 'chevauche');
  const m = mesuresForme({ b: [0, 1000, 1400, 900], contenus: [i(200, 900, 600, 500)] }, ctx);
  assert.equal(m.debord, 100);
  assert.equal(formeDe(m).forme, 'chevauche');
});

test('plein-cadre : image de toute la largeur, 60 % de l\'écran ou plus, qui porte le h1', () => {
  assert.equal(forme({ b: [0, 0, 1400, 900], contenus: [i(0, 0, 1400, 900), t(100, 600, 800, 120)] }), 'plein-cadre');
  // la même image sans texte dessus n'est qu'une bande d'image : pile
  assert.equal(forme({ b: [0, 0, 1400, 1100], contenus: [i(0, 0, 1400, 900), t(100, 950, 800, 120)] }), 'pile');
});

test('piste, collant, colonne fixe : lus dans les drapeaux et la colonne de la page', () => {
  assert.equal(forme({ b: [0, 0, 1400, 900], contenus: [t(100, 100, 600, 60)], piste: true }), 'piste');
  assert.equal(forme({ b: [0, 0, 1400, 2700], contenus: [t(100, 100, 600, 60)], collant: 1800 }), 'collant');
  assert.equal(forme({ b: [0, 0, 1400, 2700], contenus: [t(350, 100, 700, 60)], collant: 300 }), 'pile');
  assert.equal(forme({ b: [500, 0, 900, 900], contenus: [i(500, 0, 900, 900)] }, { ...ctx, colonne: [0, 500] }), 'fixe-lateral');
  // le bloc qui porte la colonne (recouvrement horizontal) n'est pas « à côté » d'elle
  assert.equal(forme({ b: [0, 0, 1400, 900], contenus: [t(350, 100, 700, 60)] }, { ...ctx, colonne: [0, 500] }), 'pile');
});

test('une image de fond qui couvre le bloc et porte du texte ne fait pas de colonne', () => {
  const m = mesuresForme({ b: [0, 0, 1400, 600], contenus: [i(0, 0, 1400, 600), t(100, 100, 400, 100), t(900, 100, 400, 100)] }, ctx);
  assert.equal(m.k2, 1);
  assert.equal(m.k3, 0);
});

test('linéarité : part de la hauteur en bandes, pied exclu ; chevauchement interne = bande, débord = non', () => {
  const b = (forme, h, extra = {}) => ({ forme, h, pied: false, mes: { debord: 0 }, ...extra });
  assert.equal(linearite([b('pile', 1), b('colonnes', 1), b('grille', 2), b('pile', 5, { pied: true })]), 0.5);
  assert.equal(estBande(b('chevauche', 1)), true);
  assert.equal(estBande(b('chevauche', 1, { mes: { debord: 120 } })), false);
  for (const f of ['grille', 'piste', 'collant', 'fixe-lateral']) assert.equal(estBande(b(f, 1)), false, f);
  assert.equal(linearite([]), null);
  assert.equal(linearitePonderee({ m: { linearite: 1 }, d: { linearite: 0 } }), 0.5);
  assert.equal(linearitePonderee({ m: { linearite: 0.8 } }), 0.8);
});

test('pied de page reconnu par la balise ou le nom', () => {
  assert.ok(estPied({ tag: 'footer' }));
  assert.ok(estPied({ tag: 'div', cls: 'site-footer dark' }));
  assert.ok(!estPied({ tag: 'section', id: 'avis' }));
});

test('dispositionMode : un bloc découpé (sous) donne autant de formes que d\'enfants ; disposition() pondère', () => {
  const rel = { vw: VW, vh: VH, pageForme: { colonne: null }, blocs: [
    { tag: 'div', h: 1800, forme: { sous: [{ b: [0, 0, 1400, 900], contenus: [t(350, 100, 700, 60)] }, { b: [0, 900, 1400, 900], contenus: [t(100, 1000, 550, 500), i(750, 950, 550, 700)] }] } },
    { tag: 'footer', h: 300, forme: { b: [0, 1800, 1400, 300], contenus: [t(100, 1850, 300, 40), t(500, 1850, 300, 40), t(900, 1850, 300, 40)] } },
  ] };
  const m = dispositionMode(rel);
  assert.deepEqual(m.blocs.map((b) => b.forme), ['pile', 'colonnes', 'grille']);
  assert.equal(m.blocs[2].pied, true);
  assert.equal(m.linearite, 1);
  const d = disposition({ m: rel, d: rel });
  assert.equal(d.linearite, 1);
  assert.deepEqual(suiteFormes(d.d), ['pile', 'colonnes']);
});

test('accord des formes : identique 1, voisines (colonnes/grille, pile/décalé) comptent moitié', () => {
  assert.equal(accordFormes(['pile', 'colonnes'], ['pile', 'colonnes']), 1);
  assert.equal(accordFormes(['pile', 'colonnes'], ['pile', 'grille']), 0.75);
  assert.equal(accordFormes(['pile'], ['piste']), 0);
  assert.equal(accordFormes([], []), 1);
  assert.equal(accordParts({ pile: 0.5, grille: 0.5 }, { pile: 1 }), 0.5);
});

// Blocs réels (ordinateur 1400x900, mesures compactes relevées le 31 oct 2026).
const z = { k3: 0, k2: 0, asym: 0, zigzag: false, quinconce: 0, chevImg: 0, chevTxt: 0, debord: 0, pleinCadre: false, piste: false, collant: 0, fixe: false };
const reel = (liste) => ({ blocs: liste.map(([h, mes]) => ({ h, pied: false, mes: { ...z, ...mes } })) });
const DUNE_D = reel([[1.1, { k2: 0.89, chevImg: 2, chevTxt: 2, pleinCadre: true }], [1.18, { k2: 0.05, chevImg: 1 }], [0.22, { k2: 0.23, debord: 3 }], [0.56, { chevImg: 1 }], [0.56, { chevImg: 1 }], [0.56, { chevImg: 1 }], [0.59, { chevImg: 1 }], [1.49, { pleinCadre: true }]]);
const CASABONAY_D = reel([[4.06, { quinconce: 4, fixe: true }]]);
const ARCHITECTE_D = reel([[1.05, { k2: 0.53 }], [0.98, { k2: 0.13 }], [1, { asym: 0.43 }], [0.53, { k2: 0.65, asym: 0.39 }], [0.59, { k3: 0.33, k2: 0.22 }], [0.83, {}], [0.44, { k2: 0.18 }], [1.21, {}]]);
const WALLPAPER_D = reel([[0.39, {}], [1.21, { k3: 0.32 }], [0.46, {}], [0.29, {}], [0.98, { k3: 0.9 }], [0.46, {}], [0.9, { k3: 0.77, k2: 0.09 }], [0.63, { k3: 0.87 }]]);
const tel = reel([[3, {}]]);

test('calibration (blocs réels) : dune et demo-architecte linéaires, casabonay.com et wallpaper.com non', () => {
  const lin = (d) => rafraichirDisposition({ m: tel, d }).linearite;
  assert.deepEqual(rafraichirDisposition({ d: DUNE_D }).d.blocs.map((b) => b.forme), ['plein-cadre', 'chevauche', 'pile', 'chevauche', 'chevauche', 'chevauche', 'chevauche', 'plein-cadre']);
  assert.equal(lin(DUNE_D), 1);
  assert.equal(lin(CASABONAY_D), 0.5);
  assert.ok(lin(ARCHITECTE_D) > SEUIL_LINEARITE, `architecte ${lin(ARCHITECTE_D)}`);
  // wallpaper.com : grilles aux deux tailles (téléphone 0,20 relevé) ; ici les huit premiers blocs de l'ordinateur seuls
  const wp = rafraichirDisposition({ d: WALLPAPER_D }).linearite;
  assert.ok(wp < SEUIL_LINEARITE, `wallpaper ${wp}`);
  assert.ok(lin(CASABONAY_D) < SEUIL_LINEARITE);
});

test('calibration (tableau de l\'en-tête) : le seuil sépare les linéaires des non linéaires, avec de la marge', () => {
  const p = ([m, d]) => linearitePonderee({ m: m == null ? null : { linearite: m }, d: d == null ? null : { linearite: d } });
  const lin = Object.entries(CALIBRATION_MESURES.lineaires).map(([k, v]) => [k, p(v)]);
  const non = Object.entries(CALIBRATION_MESURES.nonLineaires).map(([k, v]) => [k, p(v)]);
  for (const [k, v] of lin) assert.ok(v > SEUIL_LINEARITE + 0.1, `${k} ${v}`);
  for (const [k, v] of non) assert.ok(v < SEUIL_LINEARITE - 0.1, `${k} ${v}`);
  assert.equal(p(CALIBRATION_MESURES.lineaires['_essai-lin2 (dune)']), 1);
});

test('similarité de disposition : deux piles = 1 ; pile contre colonne fixe = faible ; sans mode commun = null', () => {
  const a = { m: tel, d: rafraichirDisposition({ d: ARCHITECTE_D }).d };
  const b = { m: tel, d: rafraichirDisposition({ d: CASABONAY_D }).d };
  assert.equal(similariteDisposition({ m: tel }, { m: tel }), 1);
  assert.ok(similariteDisposition(a, b) < 0.6);
  assert.equal(similariteDisposition({ m: tel }, { d: tel }), null);
  assert.equal(similariteDisposition(a, b), similariteDisposition(b, a));
});

test('en mots : ce qui est pareil, la ligne d\'un site, le style maison', () => {
  const p = rafraichirDisposition({ m: tel, d: rafraichirDisposition({ d: DUNE_D }).d });
  assert.match(ceQuiEstPareilDisposition(p, p), /les deux empilent/);
  assert.match(dispositionEnMots(p), /^linéarité 1\.00 ; ordinateur : plein cadre, chevauchement/);
  assert.equal(dispositionEnMots(null), 'disposition non mesurée');
  const reg = [{ slug: 'a', disposition: p }, { slug: 'b', disposition: rafraichirDisposition({ m: tel, d: CASABONAY_D }) }, { slug: 'c' }];
  const s = styleMaison(reg);
  assert.equal(s.n, 2);
  assert.equal(s.linearite, 0.75);
  assert.deepEqual(s.auDessus, ['a']);
  assert.equal(s.partAuDessus, 0.5);
  assert.match(phraseStyleMaison(s), /^l'usine empile : 75 % de la hauteur des accueils en bandes/);
  assert.equal(styleMaison([{ slug: 'x' }]), null);
});

test('vocabulaire : neuf formes, toutes classables', () => {
  assert.equal(FORMES.length, 9);
  assert.equal(partsFormes({ blocs: [] }).pile, undefined);
});
