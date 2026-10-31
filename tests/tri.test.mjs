// `ff tri` (scripts/ff/tri.mjs) : fonctions pures seulement (clé d'URL, liste, comparaison, classement par nouveauté,
// refus durs, garde du lot, registre compact). Empreintes synthétiques ; aucun navigateur ni réseau.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleUrl, lireListe, comparer, ressemblances, trier, ligneTableau, compacter, peintureCompacte } from '../scripts/ff/tri.mjs';
import { SEUIL_LINEARITE } from '../scripts/ff/disposition.mjs';

const ROLE = { '.': '', I: 'image', N: 'nav', t: 'texte', a: 'actions', H: 'titre' };
const g = (s) => s.trim().split(/\s+/).join('').split('').map((x) => ROLE[x]);
const mes = (o = {}) => ({ partImage: 0, positionH1: 'haut', h1SurImage: false, tailleH1: 0.1, colonnesTexte: 1, barreBas: false, boutonsBarre: 0, carte: false, carteSurImage: false, telSousH1: false, ...o });
const PHOTO = { grille: g('NNNNNNNN IIIIIIII IIIIIIII IIIIIIII IHHHHHHI IHHHHHHI ItttttI IIIIIIII IIIIIIII IIIIIIII IIIIIIII IIIIIIII'.replace('ItttttI', 'IttttttI')), mesures: mes({ partImage: 0.8, positionH1: 'milieu', h1SurImage: true }) };
const TEXTE = { grille: g('NNNNNNNN ........ .HHHHHH. .HHHHHH. .tttttt. .tttttt. .aaaa... ........ ........ ........ ........ ........'), mesures: mes({ tailleH1: 0.12 }) };
const COLONNE = { grille: g('HHH.IIII HHH.IIII ttt.IIII ttt.IIII aaa.IIII ...IIIII ...IIIII ...IIIII ...IIIII ...IIIII ...IIIII ...IIIII'), mesures: mes({ partImage: 0.55, positionH1: 'haut' }) };
const bloc = (forme, h = 1) => ({ forme, h, pied: false, mes: { debord: 0 } });
const dispo = (formesD, lin) => ({ version: 1, m: { blocs: formesD.map((f) => bloc(f)) }, d: { blocs: formesD.map((f) => bloc(f)) }, linearite: lin });
const deroule = (roles, modele = 'longue page à ancres') => ({ roles, site: { modele, pagesContenu: 0, ecrans: 6, partImage: 0.3 } });
const emp = (m, d, roles, formes, lin) => ({ m, d, deroule: deroule(roles), disposition: dispo(formes, lin) });

const USINE = [
  { nom: 'usine-photo', ...emp(PHOTO, PHOTO, ['heros', 'preuve', 'offres', 'apropos', 'contact', 'pied'], ['plein-cadre', 'pile', 'colonnes', 'pile'], 0.9) },
];
USINE[0].deroule.site = { modele: 'plusieurs pages', pagesContenu: 5, ecrans: 12, partImage: 0.8 };

test('cleUrl : hôte sans www, sans barre finale, requête ni ancre ; refuse ce qui n\'est pas http(s)', () => {
  assert.equal(cleUrl('https://www.Exemple.fr/'), 'exemple.fr');
  assert.equal(cleUrl('https://exemple.fr/maison/index.html?x=1#a'), 'exemple.fr/maison');
  assert.throws(() => cleUrl('ftp://exemple.fr'));
});

test('lireListe : commentaires, lignes vides, schéma ajouté, doublons retirés', () => {
  assert.deepEqual(lireListe('# veille\nhttps://a.fr\n\nb.com  # sans schéma\nhttps://www.a.fr/\n'), ['https://a.fr', 'https://b.com']);
});

test('comparer : nouveauté = 1 − plus forte ressemblance, tous axes ; sans référence = 1', () => {
  const c = emp(TEXTE, TEXTE, ['heros', 'outil', 'pied'], ['piste', 'grille'], 0.2);
  const r = comparer(c, USINE);
  const s = ressemblances(c, USINE[0]);
  const max = Math.max(...Object.values(s).filter((x) => x != null));
  assert.equal(r.nouveaute, Math.round((1 - max) * 1000) / 1000);
  assert.equal(r.proche.nom, 'usine-photo');
  assert.ok(r.proche.pareil.length > 0);
  assert.deepEqual(comparer(c, []), { nouveaute: 1, proche: null });
});

test('trier : refus durs (site, linéaire, trop proche), classement par nouveauté, garder N', () => {
  const candidats = [
    { url: 'https://refuse.fr', cle: 'refuse.fr', refus: 'réponse HTTP 403' },
    { url: 'https://lineaire.fr', cle: 'lineaire.fr', empreinte: emp(TEXTE, TEXTE, ['heros', 'outil', 'pied'], ['pile', 'pile'], 0.95) },
    { url: 'https://copie.fr', cle: 'copie.fr', empreinte: emp(PHOTO, PHOTO, ['heros', 'preuve', 'offres', 'apropos', 'contact', 'pied'], ['plein-cadre', 'grille', 'piste'], 0.3) },
    { url: 'https://neuf.fr', cle: 'neuf.fr', empreinte: emp(TEXTE, TEXTE, ['heros', 'outil', 'texte', 'pied'], ['piste', 'collant', 'grille'], 0.1) },
    { url: 'https://neuf2.fr', cle: 'neuf2.fr', empreinte: emp(COLONNE, COLONNE, ['heros', 'realisations', 'lieu', 'pied'], ['fixe-lateral'], 0.5) },
  ];
  const l = trier(candidats, USINE, { garder: 1 });
  const par = Object.fromEntries(l.map((x) => [x.cle, x]));
  assert.equal(par['refuse.fr'].verdict, 'refuser');
  assert.match(par['refuse.fr'].pourquoi, /403/);
  assert.equal(par['lineaire.fr'].verdict, 'refuser');
  assert.match(par['lineaire.fr'].pourquoi, new RegExp(`linéaire \\(0\\.95 > ${SEUIL_LINEARITE}\\)`));
  assert.equal(par['copie.fr'].verdict, 'refuser');
  assert.match(par['copie.fr'].pourquoi, /trop proche de usine-photo/);
  // un seul gardé : le plus nouveau ; l'autre non refusé passe « pas dans les 1 plus nouveaux »
  const gardes = l.filter((x) => x.verdict === 'garder');
  assert.equal(gardes.length, 1);
  assert.equal(l[0].verdict, 'garder');
  const autre = gardes[0].cle === 'neuf.fr' ? par['neuf2.fr'] : par['neuf.fr'];
  assert.ok(gardes[0].nouveaute >= autre.nouveaute);
  assert.match(autre.pourquoi, /pas dans les 1 plus nouveaux/);
  // ligne du tableau en français
  assert.match(ligneTableau(gardes[0]), /^GARDER {3}https:\/\/neuf/);
  assert.match(ligneTableau(par['refuse.fr']), /nouveauté — · linéarité —/);
});

test('trier : jamais deux gardés trop proches dans le même lot', () => {
  const a = emp(COLONNE, COLONNE, ['heros', 'realisations', 'lieu', 'pied'], ['fixe-lateral'], 0.5);
  const l = trier([{ url: 'https://a.fr', cle: 'a.fr', empreinte: a }, { url: 'https://b.fr', cle: 'b.fr', empreinte: structuredClone(a) }], USINE, { garder: 3 });
  assert.deepEqual(l.map((x) => x.verdict), ['garder', 'refuser']);
  assert.match(l[1].pourquoi, /gardé dans ce tri/);
});

test('compacter : garde ce que lisent les comparaisons, pas les boîtes', () => {
  const e = { ...emp(PHOTO, TEXTE, ['heros', 'pied'], ['pile'], 1), peinture: { h1: { famille: 'X' } } };
  e.m = { ...e.m, roles: { image: [[0, 0, 1, 1]] }, vw: 390, vh: 844 };
  const c = compacter(e);
  assert.equal(c.m.roles, undefined);
  assert.deepEqual(c.m.grille, PHOTO.grille);
  assert.deepEqual(c.deroule.roles, ['heros', 'pied']);
  assert.equal(c.disposition.linearite, 1);
  assert.equal(compacter(null), null);
  assert.equal(peintureCompacte(null), null);
  assert.equal(peintureCompacte({ typo: { h1: { famille: 'Inter', taille: 64, graisse: 700, casse: 'none' } } }).h1.famille, 'Inter');
});
