// `ff kit` — les fonctions PURES de scripts/ff/kit.mjs (sans navigateur ni fichier) : table des
// categories Google, description <= 750 caracteres coupee en fin de phrase, URL avec UTM, reperage
// des donnees de test, typographie des textes repris du site. Le rendu PDF/PNG se verifie a l'oeil
// sur les apercus (voir l'en-tete de kit.mjs), pas ici.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  categoriesGbp,
  assemblerDescription,
  decouperPhrases,
  texteBrut,
  typo,
  urlAvecUtm,
  urlDuSite,
  donneesDeTest,
  numeroNational,
  cheminQr,
  choisirServices,
  zoneLisible,
  DESCRIPTION_MAX,
} from '../scripts/ff/kit.mjs';
import { FINE, NBSP } from '../scripts/ff/typo.mjs';

/* ---------- Categories Google ---------- */

test('categories : metier compose -> principale + secondaires, dans l’ordre de la table', () => {
  assert.deepEqual(categoriesGbp('Plombier-chauffagiste'), { principale: 'Plombier', secondaires: ['Chauffagiste'], deplacement: true });
  assert.deepEqual(categoriesGbp('Boulanger-pâtissier').secondaires, ['Pâtisserie']);
  assert.equal(categoriesGbp('Boulangerie-pâtisserie').principale, 'Boulangerie');
  assert.deepEqual(categoriesGbp('Menuisier-ébéniste'), { principale: 'Menuisier', secondaires: ['Ébéniste'], deplacement: null });
  assert.deepEqual(categoriesGbp('Institut de beauté et spa').secondaires, ['Spa']);
});

test('categories : le specifique passe avant le generique', () => {
  assert.equal(categoriesGbp('Architecte d’intérieur').principale, 'Architecte d’intérieur');
  assert.deepEqual(categoriesGbp('Architecte d’intérieur').secondaires, [], 'pas de « Architecte » en double');
  assert.equal(categoriesGbp('Architecte DPLG').principale, 'Architecte');
  assert.equal(categoriesGbp('Restaurant de poissons et bouillabaisse').principale, 'Restaurant de fruits de mer');
  assert.deepEqual(categoriesGbp('Restaurant de poissons et bouillabaisse').secondaires, ['Restaurant']);
  assert.equal(categoriesGbp('Barbier').principale, 'Barbier');
  assert.equal(categoriesGbp('Photographe de mariage et de famille').secondaires[0], 'Photographe de mariage');
});

test('categories : accents, apostrophes et casse indifferents', () => {
  assert.equal(categoriesGbp('ÉLECTRICIEN').principale, 'Électricien');
  assert.equal(categoriesGbp("Chambres d'hôtes").principale, 'Chambre d’hôtes');
  assert.equal(categoriesGbp('Auto-école').principale, 'Auto-école');
  assert.equal(categoriesGbp('Vétérinaire').deplacement, false);
});

test('categories : repli sur schemaType, sinon null (jamais une categorie devinee)', () => {
  assert.equal(categoriesGbp('Cabinet Martin', 'LegalService').principale, 'Avocat');
  assert.equal(categoriesGbp('Vitrine du moteur d’animation'), null);
  assert.equal(categoriesGbp('Vitrine du moteur d’animation', 'SchemaInconnu'), null);
  assert.equal(categoriesGbp(''), null);
});

test('categories : « web » ne matche pas un mot qui le contient', () => {
  assert.equal(categoriesGbp('Studio de sites pour artisans').principale, 'Concepteur de sites Web');
  assert.equal(categoriesGbp('Webinaires en ligne'), null);
});

/* ---------- Description ---------- */

test('description : phrases entieres, dans l’ordre, typographie francaise appliquee', () => {
  const d = assemblerDescription(['Plombier à Nantes. Une urgence? On vient.']);
  assert.equal(d, `Plombier à Nantes. Une urgence${FINE}? On vient.`);
});

test('description : coupe en fin de phrase sous la limite, jamais au milieu', () => {
  const phrase = 'Une phrase de quarante caractères pile. '; // 40 avec l'espace
  const texte = phrase.repeat(30);
  const d = assemblerDescription([texte]);
  assert.ok(d.length <= DESCRIPTION_MAX, `longueur ${d.length}`);
  assert.ok(d.endsWith('pile.'));
  assert.equal(d.split('pile.').length - 1, 18, '18 phrases de 40 = 719 caracteres, la 19e depasserait');
});

test('description : deux sources (paragraphes, puis histoire), lignes vides fusionnees', () => {
  const d = assemblerDescription(['Premier paragraphe.\n\nDeuxième paragraphe.', 'Histoire du lieu.']);
  assert.equal(d, 'Premier paragraphe. Deuxième paragraphe. Histoire du lieu.');
});

test('description : ni lien, ni e-mail, ni numero de telephone', () => {
  const d = assemblerDescription(['Bonjour. Voir https://exemple.fr pour plus. Écrivez à a@b.fr. Appelez le 06 12 34 56 78. Fin.']);
  assert.equal(d, 'Bonjour. Fin.');
});

test('description : une premiere phrase trop longue est coupee au dernier mot entier + …', () => {
  const longue = `${'mot '.repeat(300)}fin.`;
  const d = assemblerDescription([longue], 50);
  assert.ok(d.length <= 50);
  assert.ok(d.endsWith('mot…'));
});

test('description : vide si aucun texte (le champ reste absent, pas de placeholder)', () => {
  assert.equal(assemblerDescription([]), '');
  assert.equal(assemblerDescription(['']), '');
});

test('decouperPhrases : balises retirees, abreviation suivie d’une minuscule non coupee', () => {
  assert.deepEqual(decouperPhrases('Le pain du matin, <em>pétri avant l’aube.</em> Ouvert le dimanche.'), [
    'Le pain du matin, pétri avant l’aube.',
    'Ouvert le dimanche.',
  ]);
  assert.deepEqual(decouperPhrases('Env. trois jours de délai.'), ['Env. trois jours de délai.']);
});

/* ---------- Typographie des textes repris ---------- */

test('typo : HTML retire, espaces francaises posees, apostrophe courbe', () => {
  assert.equal(texteBrut('Ça fuit ? <em>On décroche.</em>'), 'Ça fuit ? On décroche.');
  assert.equal(typo('Ça fuit ? <em>On décroche.</em>'), `Ça fuit${FINE}? On décroche.`);
  assert.equal(typo("Horaires: l'atelier"), `Horaires${NBSP}: l’atelier`);
  assert.equal(typo('Un "vrai" levain'), `Un «${FINE}vrai${FINE}» levain`);
});

/* ---------- URL et UTM ---------- */

test('urlDuSite : domaine nu, avec schema ou barre finale -> https + barre finale', () => {
  assert.equal(urlDuSite('finckfisch.fr'), 'https://finckfisch.fr/');
  assert.equal(urlDuSite('https://finckfisch.fr/'), 'https://finckfisch.fr/');
  assert.equal(urlDuSite(' http://exemple.fr// '), 'https://exemple.fr/');
  assert.equal(urlDuSite(''), '');
  assert.equal(urlDuSite(undefined), '');
});

test('urlAvecUtm : parametres ajoutes, requete et ancre existantes gardees', () => {
  assert.equal(urlAvecUtm('https://finckfisch.fr/', { source: 'qr', medium: 'print' }), 'https://finckfisch.fr/?utm_source=qr&utm_medium=print');
  assert.equal(urlAvecUtm('https://a.fr/page?x=1#contact', { source: 'qr' }), 'https://a.fr/page?x=1&utm_source=qr#contact');
  assert.equal(urlAvecUtm('https://a.fr/?utm_source=old', { source: 'qr' }), 'https://a.fr/?utm_source=qr', 'remplace, ne double pas');
  assert.equal(urlAvecUtm('https://a.fr/', { source: 'qr', campaign: '' }), 'https://a.fr/?utm_source=qr', 'valeur vide ignoree');
});

/* ---------- Donnees de test ---------- */

test('donneesDeTest : numero 0X 00 00 00 00, 75000 et exemple.fr reperes', () => {
  const alertes = donneesDeTest({ contact: { phone: '+33600000000', phoneDisplay: '06 00 00 00 00', email: 'contact@exemple.fr', address: { postalCode: '75000', city: 'Paris' } } });
  assert.equal(alertes.length, 3);
  assert.match(alertes[0], /06 00 00 00 00/);
  assert.match(alertes[1], /75000/);
  assert.match(alertes[2], /exemple\.fr/);
});

test('donneesDeTest : un vrai numero et un vrai code postal ne declenchent rien', () => {
  assert.deepEqual(donneesDeTest({ contact: { phone: '+33639981402', email: 'jean@dubois-plomberie.fr', address: { postalCode: '44000', city: 'Nantes' } } }), []);
  assert.deepEqual(donneesDeTest({ contact: { phone: '0612345678' } }).length, 1, 'le numero d’exemple classique est signale');
  assert.deepEqual(donneesDeTest({}), []);
});

test('numeroNational : +33, 0033 et 0 donnent le meme numero', () => {
  assert.equal(numeroNational('+33 6 39 98 14 02'), '0639981402');
  assert.equal(numeroNational('0033639981402'), '0639981402');
  assert.equal(numeroNational('06.39.98.14.02'), '0639981402');
  assert.equal(numeroNational('+44 20 7946 0958'), '');
});

/* ---------- Divers ---------- */

test('cheminQr : un carre par module sombre, decale de la zone de silence', () => {
  const modules = { size: 2, get: (y, x) => (x + y) % 2 === 0 };
  const { taille, d } = cheminQr(modules, 2);
  assert.equal(taille, 6);
  assert.equal(d, 'M2 2h1v1h-1zM3 3h1v1h-1z');
});

test('choisirServices : mis en avant d’abord, trois au plus', () => {
  const s = [{ slug: 'a' }, { slug: 'b', featured: true }, { slug: 'c' }, { slug: 'd', featured: true }];
  assert.deepEqual(choisirServices(s).map((x) => x.slug), ['b', 'd', 'a']);
  assert.deepEqual(choisirServices([]), []);
});

test('zoneLisible : adresse pour un commerce qui recoit, zone pour un metier qui se deplace', () => {
  const adresse = { street: '19 rue Sylvabelle', postalCode: '13006', city: 'Marseille' };
  assert.equal(zoneLisible({ business: { trade: 'Boulangerie' }, contact: { address: adresse }, zones: { label: 'Le Camas' } }), '19 rue Sylvabelle, 13006 Marseille');
  assert.equal(zoneLisible({ business: { trade: 'Plombier' }, contact: { address: adresse }, zones: { label: 'Nantes et périphérie' } }), 'Nantes et périphérie');
  assert.equal(zoneLisible({ business: { trade: 'Plombier' }, contact: { address: { city: 'Nantes' } }, zones: { cities: ['Rezé', 'Vertou'] } }), 'Rezé, Vertou');
  assert.equal(zoneLisible({ business: { trade: 'Plombier' }, contact: { address: { city: 'Nantes' } }, zones: {} }), 'Nantes');
});
