// Tests des fonctions pures de `ff demonter` (scripts/ff/demonter.mjs) : nom depuis l'URL, couleurs,
// contraste, pilule, polices IA, sources de polices, candidats de geste signature, rendu de la fiche depuis
// un JSON de mesures fixe. Aucun navigateur.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validerUrl, nomDepuisUrl, rgbVersHex, contraste, classerCouleurs, estPilule, familleCourte, policesIa, sourcePolice,
  candidatsSignature, rendreFiche, raisonBlocage, finirMesures, elementsQuiBougent, nomAffiche, NON_MESURE, VUES,
} from '../scripts/ff/demonter.mjs';

/** JSON de mesures fixe, dans la forme écrite par la commande (après finirMesures). */
const MESURES = {
  outil: 'ff demonter', version: 1, url: 'https://delice.ca/', nom: 'delice', nomAffiche: 'Délice', date: '2026-10-17',
  identite: { title: 'Délice | Restaurant', lang: 'fr', description: 'Pizzeria depuis 1970', technologies: ['WordPress', 'Swup'] },
  d: {
    vue: { vw: 1440, vh: 900, mobile: false },
    premierEcran: {
      h1: 'Pizza Délice depuis 1970', mots: 42, images: 2, mediaPleinEcran: null,
      boutonPrincipal: { texte: 'Réserver', x: 800, y: 860, cx: 0.6, cy: 0.97, fixe: true, dansNav: false },
      coucheBloquante: { couverture: 0.62, texte: 'Nous utilisons des cookies', selecteur: 'div#cookies', cookie: true },
      cookie: { couverture: 0.62, texte: 'Nous utilisons des cookies', selecteur: 'div#cookies' },
    },
    typographie: {
      h1: { famille: '"Filson Soft", sans-serif', taille: 18, graisse: '500', interlignage: 1.2, italique: false, transform: 'uppercase', interlettrage: '1px' },
      h2: { famille: '"Ivy Mode", serif', taille: 48, graisse: '600', interlignage: 1, italique: false, transform: 'none', interlettrage: 'normal' },
      p: { famille: '"Filson Soft", sans-serif', taille: 16, graisse: '400', interlignage: 1.5, italique: false, transform: 'none', interlettrage: 'normal' },
      bouton: { famille: 'Inter, sans-serif', taille: 14, graisse: '500', interlignage: 1, italique: false, transform: 'none', interlettrage: 'normal' },
      nav: null,
      fontFaces: [{ famille: 'Ivy Mode', url: 'https://delice.ca/fonts/ivy.woff2', source: 'auto-hébergée' }, { famille: 'Inter', url: 'https://fonts.gstatic.com/s/inter.woff2', source: 'Google Fonts' }],
      fontFacesNonLisibles: [], fichiersPolices: [], famillesVisibles: [{ famille: 'Filson Soft', n: 120 }, { famille: 'Ivy Mode', n: 14 }],
    },
    couleurs: { fond: '#de2b2b', texte: '#f8efdc', contraste: 4.09, fonds: [{ hex: '#de2b2b', n: 1, poids: 1000, part: 0.7 }, { hex: '#7c2627', n: 3, poids: 300, part: 0.2 }], textes: [{ hex: '#f8efdc', n: 50, poids: 900, part: 0.9 }], nbImages: 12, nbVideos: 0, nbFondsImage: 3, masques: 61 },
    mouvement: {
      bibliotheques: [{ nom: 'Lenis', preuve: 'window.Lenis' }, { nom: 'Swup', preuve: 'script swup.js' }], scrollTrigger: false, animationTimeline: 0,
      stickyLongs: [{ selecteur: 'section.c-chapitre', ecrans: 3.2 }],
      courbes: [{ valeur: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)', n: 25 }, { valeur: 'clip-path 0.4s ease', n: 4 }],
      attributs: [{ nom: 'data-module-parallax', n: 12 }],
      plusAnime: { selecteur: 'div.c-hero_canvas', score: 7, animations: ['animation flotte 12s ease-in-out infinite'], transitions: ['transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'] },
    },
    structure: {
      conteneur: 'div.o-page',
      sections: [
        { selecteur: 'header.c-header', hauteur: 156, ecrans: 0.2, mots: 12, images: 1, balisesRares: ['svg'] },
        { selecteur: 'section#hero', hauteur: 1200, ecrans: 1.3, mots: 40, images: 3, balisesRares: ['canvas', 'svg'] },
        { selecteur: 'section.c-horaires', hauteur: 2900, ecrans: 3.2, mots: 220, images: 0, balisesRares: ['table', 'details'] },
      ],
      nav: { selecteur: 'header.c-header', hauteur: 156, position: 'fixed', liens: [{ texte: 'Les menus', href: '/menus', bouton: false }, { texte: 'Réserver', href: '/reserver', bouton: true }] },
      pied: { selecteur: 'footer', liens: [{ texte: 'Carrières', href: '/carrieres', bouton: false }] },
      telephone: { n: 2, href: 'tel:+14188370000' },
      formulaires: { n: 1, champs: 4 },
      horaires: { trouve: true, extrait: 'Lundi 11 h à 22 h' },
      portes: [{ texte: 'Réserver', href: '/reserver' }, { texte: 'Carte cadeau', href: '/cadeau' }],
      barreBas: null,
    },
    signes: { pilules: { boutons: 8, pilules: 2, exemples: ['Réserver'] }, ans: [{ texte: 'Depuis 1970', taille: 64, selecteur: 'p.c-chiffre' }], policesIa: ['Inter'] },
  },
  m: {
    vue: { vw: 390, vh: 844, mobile: true },
    premierEcran: { h1: 'Pizza Délice depuis 1970', mots: 20, images: 1, mediaPleinEcran: { type: 'image', couverture: 0.8, selecteur: 'img.hero' }, boutonPrincipal: null, coucheBloquante: null, cookie: null },
    typographie: { h1: { famille: '"Filson Soft", sans-serif', taille: 16 }, h2: { famille: '"Ivy Mode", serif', taille: 32 }, p: { famille: '"Filson Soft", sans-serif', taille: 15 }, bouton: { taille: 14 }, nav: null },
    structure: { barreBas: { selecteur: 'div.c-barre', hauteur: 64, liens: [{ texte: 'Venir au Délice', href: 'https://maps' }, { texte: 'Réserver', href: '/reserver' }, { texte: 'Commander', href: '/commander' }, { texte: 'Carte cadeau', href: '/cadeau' }] } },
    signes: { pilules: { boutons: 6, pilules: 0, exemples: [] }, ans: [], policesIa: [] },
  },
};

test('validerUrl : http(s) seulement', () => {
  assert.equal(validerUrl('https://delice.ca'), 'https://delice.ca/');
  assert.throws(() => validerUrl('ftp://delice.ca'), /refusée/);
  assert.throws(() => validerUrl('file:///etc/passwd'), /refusée/);
  assert.throws(() => validerUrl('delice.ca'), /illisible/);
});

test('nomDepuisUrl : hôte sans www ni tld, sous-domaines gardés, co.uk réduit', () => {
  assert.equal(nomDepuisUrl('https://www.delice.ca/'), 'delice');
  assert.equal(nomDepuisUrl('https://pizza-amici.nl/menu'), 'pizza-amici');
  assert.equal(nomDepuisUrl('https://shop.theirnibs.co.uk'), 'shop-theirnibs');
  assert.equal(nomDepuisUrl('https://www.latabledejoakim.fr'), 'latabledejoakim');
  assert.equal(nomDepuisUrl('http://localhost:4321'), 'localhost');
});

test('rgbVersHex : rgb, rgba opaque, transparent -> null', () => {
  assert.equal(rgbVersHex('rgb(222, 43, 43)'), '#de2b2b');
  assert.equal(rgbVersHex('rgba(248, 239, 220, 0.9)'), '#f8efdc');
  assert.equal(rgbVersHex('rgba(0, 0, 0, 0)'), null);
  assert.equal(rgbVersHex('transparent'), null);
  assert.equal(rgbVersHex('#DE2B2B'), '#de2b2b');
});

test('contraste : noir/blanc 21, même couleur 1, hex manquant -> null', () => {
  assert.equal(contraste('#000000', '#ffffff'), 21);
  assert.equal(contraste('#ffffff', '#ffffff'), 1);
  assert.equal(contraste('#de2b2b', '#f8efdc'), 4.09);
  assert.equal(contraste(null, '#ffffff'), null);
});

test('classerCouleurs : fusion par hex, tri par poids, part du total, transparent écarté', () => {
  const r = classerCouleurs([
    { hex: '#FFFFFF', n: 1, poids: 100 }, { hex: '#ffffff', n: 2, poids: 300 }, { hex: null, n: 9, poids: 9999 },
    { hex: '#000000', n: 1, poids: 500 }, { hex: '#ff0000', n: 1, poids: 100 },
  ], 2);
  assert.deepEqual(r.map((c) => c.hex), ['#000000', '#ffffff']);
  assert.equal(r[1].n, 3);
  assert.equal(r[0].part, 0.5);
  assert.deepEqual(classerCouleurs([]), []);
  assert.deepEqual(classerCouleurs(undefined), []);
});

test('estPilule : rayon >= hauteur/2 sur un élément plus large que haut', () => {
  assert.equal(estPilule({ rayon: 999, hauteur: 48, largeur: 160 }), true);
  assert.equal(estPilule({ rayon: 24, hauteur: 48, largeur: 160 }), true);
  assert.equal(estPilule({ rayon: 8, hauteur: 48, largeur: 160 }), false);
  assert.equal(estPilule({ rayon: 999, hauteur: 48, largeur: 48 }), false, 'un rond n\'est pas une pilule');
  assert.equal(estPilule({ rayon: 999, hauteur: 0 }), false);
});

test('familleCourte et policesIa : première famille sans guillemets, liste IA de ia.mjs', () => {
  assert.equal(familleCourte('"Ivy Mode", Georgia, serif'), 'Ivy Mode');
  assert.equal(familleCourte("'Filson Soft'"), 'Filson Soft');
  assert.deepEqual(policesIa(['"Ivy Mode", serif', 'Inter, sans-serif', 'inter', '"Playfair Display", serif', '"Filson Soft"']), ['Inter', 'Playfair Display']);
  assert.deepEqual(policesIa([]), []);
});

test('sourcePolice : Google, Adobe, auto-hébergée, tiers', () => {
  assert.equal(sourcePolice('https://fonts.gstatic.com/s/inter/v12/a.woff2', 'delice.ca'), 'Google Fonts');
  assert.equal(sourcePolice('https://use.typekit.net/af/x.woff2', 'delice.ca'), 'Adobe Fonts');
  assert.equal(sourcePolice('/wp-content/themes/delice/fonts/ivy.woff2', 'www.delice.ca'), 'auto-hébergée');
  assert.equal(sourcePolice('https://cdn.delice.ca/fonts/ivy.woff2', 'www.delice.ca'), 'auto-hébergée');
  assert.equal(sourcePolice('https://cdn.shopify.com/fonts/x.woff2', 'coutumes.com'), 'tiers (cdn.shopify.com)');
});

test('raisonBlocage : 403, page de défi, page vide, page normale', () => {
  assert.match(raisonBlocage({ statut: 403, title: '', texte: '' }), /403/);
  assert.match(raisonBlocage({ statut: 200, title: 'Just a moment...', texte: '' }), /défi/);
  assert.match(raisonBlocage({ statut: 200, title: '', texte: ' ' }), /vide/);
  assert.equal(raisonBlocage({ statut: 200, title: 'Délice', texte: 'Pizza depuis 1970 à Lévis' }), null);
});

test('candidatsSignature : section la plus haute, élément le plus animé, bloc aux balises uniques', () => {
  const c = candidatsSignature(MESURES);
  assert.equal(c.length, 3);
  assert.match(c[0], /section\.c-horaires.*3,2 écrans.*220 mots/);
  assert.match(c[1], /div\.c-hero_canvas.*flotte 12s/);
  assert.match(c[2], /section\.c-horaires.*seule à contenir <table>, <details>/);
  const vide = candidatsSignature({ d: {} });
  assert.equal(vide.length, 3);
  assert.ok(vide.every((l) => l.includes(NON_MESURE)));
});

test('rendreFiche : titres de section identiques aux fiches manuelles, mesures présentes, rien d\'inventé', () => {
  const md = rendreFiche(MESURES);
  const titres = md.split('\n').filter((l) => l.startsWith('#'));
  assert.deepEqual(titres, [
    '# Délice — https://delice.ca/', '## Squelette', '## Typographie', '## Couleur et matière', '## Mouvement', '## Le geste signature', "## Ce qu'on garde / ce qu'on refuse",
  ]);
  assert.match(md, /h1 « Pizza Délice depuis 1970 »/);
  assert.match(md, /42 mots visibles au-dessus du pli/);
  assert.match(md, /bannière cookies couvrant 62 % de l'écran/);
  assert.match(md, /bouton principal « Réserver » en bas au centre/);
  assert.match(md, /\*\*Barre fixe en bas de l'écran \(téléphone\)\*\* : Venir au Délice, Réserver, Commander, Carte cadeau/);
  assert.match(md, /`header\.c-header` \(0,2 écran, 12 mots, 1 img\) → `section#hero`/);
  assert.match(md, /h2 \*\*Ivy Mode\*\*, 48 px \/ 32 px téléphone, graisse 600, interlignage 1/);
  assert.match(md, /auto-hébergée \(Ivy Mode\) ; Google Fonts \(Inter\)/);
  assert.match(md, /Fond du corps #de2b2b, texte #f8efdc \(contraste 4,09:1\)/);
  assert.match(md, /#de2b2b \(70 %\), #7c2627 \(20 %\)/);
  assert.match(md, /Lenis \(window\.Lenis\), Swup \(script swup\.js\)/);
  assert.match(md, /`transform 0\.6s cubic-bezier\(0\.23, 1, 0\.32, 1\)` ×25/);
  assert.match(md, /`position: sticky` sur 1 bloc\(s\) de plus d'un écran \(`section\.c-chapitre` 3,2 écrans\)/);
  assert.match(md, /À remplir après lecture des captures/);
  assert.match(md, /polices « IA » : Inter/);
  assert.match(md, /boutons pilule : 2\/8 ordinateur, 0\/6 téléphone/);
  assert.match(md, /« X ans » mis en scène : « Depuis 1970 » à 64 px/);
  assert.match(md, /Téléphone cliquable : oui \(2, tel:\+14188370000\)/);
  assert.match(md, /Portes d'action : « Réserver » \(\/reserver\), « Carte cadeau » \(\/cadeau\)/);
  // Ce qui demande un œil est marqué « à juger », jamais rempli.
  assert.ok((md.match(/à juger/g) || []).length >= 4);
});

test('rendreFiche : mesures absentes -> « non mesuré », jamais une valeur inventée', () => {
  const md = rendreFiche({ url: 'https://x.fr/', nom: 'x', date: '2026-10-17', identite: {}, d: {}, m: {} });
  assert.match(md, /^# x — https:\/\/x\.fr\/$/m);
  assert.ok(md.includes(NON_MESURE));
  assert.match(md, /Premier écran \(ordinateur 1440x900\) : non mesuré\./);
  assert.match(md, /titres h1 : non mesuré/);
  assert.match(md, /Bibliothèques : aucune détectée/);
  assert.doesNotMatch(md, /undefined|NaN|\[object/);
});

test('finirMesures : classe les couleurs, calcule le contraste, repère les polices IA et les sources', () => {
  const brut = {
    couleurs: { fond: '#ffffff', texte: '#111111', fondsBruts: [{ hex: '#ffffff', n: 1, poids: 10 }], textesBruts: [{ hex: '#111111', n: 4, poids: 80 }] },
    typographie: { h1: { famille: 'Inter, sans-serif' }, famillesVisibles: [{ famille: 'Lora', n: 3 }], fontFaces: [{ famille: 'Inter', url: 'https://fonts.gstatic.com/x.woff2' }, { famille: 'Lora', url: '' }] },
    signes: { pilules: { boutons: 1, pilules: 0 } },
  };
  const f = finirMesures(brut, 'x.fr');
  assert.equal(f.couleurs.contraste, 18.88);
  assert.deepEqual(f.couleurs.fonds.map((c) => c.hex), ['#ffffff']);
  assert.deepEqual(f.signes.policesIa, ['Inter', 'Lora']);
  assert.equal(f.signes.pilules.boutons, 1);
  assert.deepEqual(f.typographie.fontFaces.map((x) => x.source), ['Google Fonts', 'locale']);
  assert.equal(finirMesures(null), null);
});

test('VUES : 1440x900 ordinateur puis 390x844 téléphone', () => {
  assert.deepEqual(Object.keys(VUES), ['d', 'm']);
  assert.equal(VUES.d.vw, 1440);
  assert.equal(VUES.m.vh, 844);
  assert.ok(VUES.m.mobile);
});

test('nomAffiche : og:site_name, sinon segment court du titre hors « Accueil », sinon le nom de fichier', () => {
  assert.equal(nomAffiche({ siteName: 'Délice', title: 'Accueil - Délice' }, 'delice'), 'Délice');
  assert.equal(nomAffiche({ title: 'Accueil - Délice' }, 'delice'), 'Délice');
  assert.equal(nomAffiche({ title: 'Coutumes | Bijoux pour homme en argent' }, 'coutumes'), 'Coutumes');
  assert.equal(nomAffiche({ title: 'Home' }, 'x'), 'x');
  assert.equal(nomAffiche({}, 'x'), 'x');
});

test('elementsQuiBougent : seuls les éléments dont la clé change, sans leurs descendants, dédoublonnés', () => {
  const avant = [{ i: 1, chemin: 'div.marquee', cle: 'a|0|0|100', parent: 0 }, { i: 2, chemin: 'span', cle: 'b|0|0|50', parent: 1 }, { i: 3, chemin: 'p', cle: 'c|0|0|10', parent: 0 }, { i: 4, chemin: 'img.hero', cle: 'd|0|0|10', parent: 0 }, { i: 5, chemin: 'img.hero', cle: 'e|0|0|10', parent: 0 }];
  const apres = [{ i: 1, chemin: 'div.marquee', cle: 'a|-20|0|100', parent: 0 }, { i: 2, chemin: 'span', cle: 'b|-20|0|50', parent: 1 }, { i: 3, chemin: 'p', cle: 'c|0|0|10', parent: 0 }, { i: 4, chemin: 'img.hero', cle: 'd|1|0|10', parent: 0 }, { i: 5, chemin: 'img.hero', cle: 'e|1|0|10', parent: 0 }];
  const r = elementsQuiBougent(avant, apres);
  assert.equal(r.n, 3);
  assert.deepEqual(r.exemples, ['div.marquee', 'img.hero']);
  assert.deepEqual(elementsQuiBougent([], []), { n: 0, exemples: [] });
});
