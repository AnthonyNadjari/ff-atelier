// Contrôle de ressemblance par la mise en page (scripts/ff/ressemblance.mjs) : fonctions pures seulement,
// sur des empreintes FIXES relevées le 17 oct 2026 vers 19 h (avant la reprise des prospects) : les quatre
// premiers écrans téléphone jugés « très similaires » par le fondateur, et quatre premiers écrans d'une autre
// mise en page ; puis le DÉROULÉ (blocs en HTML fixe, suites et sites relevés le 17 oct 2026 vers 20 h). Aucun navigateur.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { raster, grille, recouvrement, colonnesTexte, mesures, empreinteMode, accordGrille, accordMesures, similarite, distance, ceQuiEstPareil, verdict, pairesTropProches, grilleTexte, lignesDeroule, SEUIL_RESSEMBLANCE, SEUIL_DEROULE, COLS, ROWS } from '../scripts/ff/ressemblance.mjs';
import { traitsBloc, classerBloc, compterPages, modeleNavigation, alignerSuites, accordSuites, accordSite, similariteDeroule, sousSuiteCommune, suiteDeRoles, ceQuiEstPareilDeroule, suiteEnMots, empreinteDeroule, rafraichirDeroule } from '../scripts/ff/deroule.mjs';

const ROLE = { '.': '', I: 'image', C: 'carte', N: 'nav', B: 'barre-bas', t: 'texte', a: 'actions', T: 'telephone', H: 'titre' };
const g = (s) => s.trim().split(/\s+/).join('').split('').map((x) => ROLE[x]);
const mes = (o) => ({ partImage: 0, positionH1: 'haut', h1SurImage: false, tailleH1: 0.1, colonnesTexte: 1, barreBas: false, boutonsBarre: 0, carte: false, carteSurImage: false, telSousH1: false, ...o });
const carteSurPhoto = { positionH1: 'milieu', h1SurImage: true, barreBas: true, boutonsBarre: 3, carte: true, carteSurImage: true, telSousH1: true };

// Téléphone 390x844, grilles 8x12 lues ligne par ligne (I image, C carte, N nav, B barre basse, t texte,
// a actions, T téléphone, H h1, . vide).
const TEL = {
  'prospect-epi-dor': { grille: g('NNNNNNNN IIIIIIII IIIIIIII IIIIIIII IIIIIIII IIIIIIII CHHHHHHC tttttttC CCCCCCCC CTTTTCCC CttttttC BaaaBBBB'), mesures: mes({ ...carteSurPhoto, partImage: 0.49 }) },
  'prospect-ballay-macon': { grille: g('NNNNNNNN IIIIIIII IIIIIIII IIIIIIII IIIIIIII IIIIIIII CHHHHHHC CttttttC CTTTTTCC CttttttC CCCCCCCC BaaaaaBB'), mesures: mes({ ...carteSurPhoto, partImage: 0.46 }) },
  'prospect-a-coeur-bois': { grille: g('NNNNNNNN ..IIIIII ..IIIIII ....IIII ....IIII ....IIII CHHHHHHC CHHHHHHC CttttttC CtttttCC CCCCCCCC BBBBBBBB'), mesures: mes({ ...carteSurPhoto, partImage: 0.39 }) },
  'fromagerie-ravanel-d': { grille: g('NNNNNNNN IIIIIIII IIIIIIII IIIIIIII IIIIIttI HHHHHHCC CHHHHHtC tttttttC CTTTTTCC tttttttC CaaaaCCC BaaaBBBB'), mesures: mes({ ...carteSurPhoto, partImage: 0.61, boutonsBarre: 2 }) },
  'fromagerie-ravanel': { grille: g('NNNNNNNN .HHHHHH. HHHHHHHH ........ tttttttt .tttttt. .tttttt. .TTTT... .ttt.... .IIIIII. .IIIIII. .IIIIII.'), mesures: mes({ partImage: 0.18, tailleH1: 0.175, telSousH1: true }) },
  'fromagerie-ravanel-b': { grille: g('NNNNNNNN .HHHHHH. HHHHHHHH .tttttt. ttttttt. .TTTT... .TTTT... ........ ........ ........ ........ ........'), mesures: mes({ tailleH1: 0.17, telSousH1: true }) },
  'fromagerie-ravanel-c': { grille: g('.HHHHHH. .HHHHHH. tttttttt ........ .tttttt. .aaaaaaa ........ .tttttt. ........ .tttttt. ........ BBBBBBBB'), mesures: mes({ tailleH1: 0.112, colonnesTexte: 2, barreBas: true, boutonsBarre: 3 }) },
  'finck-fisch': { grille: g('NNNNNNNN ........ .HHHHHH. HHHHHHHH .tttttt. .tttttt. .aaaaaa. ........ .tttttt. ........ ........ ........'), mesures: mes({ tailleH1: 0.092 }) },
};
const PAREILS = ['prospect-epi-dor', 'prospect-ballay-macon', 'prospect-a-coeur-bois', 'fromagerie-ravanel-d'];
const AUTRES = ['fromagerie-ravanel', 'fromagerie-ravanel-b', 'fromagerie-ravanel-c', 'finck-fisch'];

test('fixtures : 96 cases chacune', () => {
  for (const e of Object.values(TEL)) assert.equal(e.grille.length, COLS * ROWS);
});

test('calibration : les quatre premiers écrans du fondateur sont similaires deux à deux', () => {
  for (let i = 0; i < PAREILS.length; i++) for (let j = i + 1; j < PAREILS.length; j++) {
    const s = similarite(TEL[PAREILS[i]], TEL[PAREILS[j]]);
    assert.ok(s > SEUIL_RESSEMBLANCE, `${PAREILS[i]} / ${PAREILS[j]} : ${s}`);
  }
});

test('calibration : les autres mises en page restent sous le seuil, entre elles et contre les quatre', () => {
  const tous = [...PAREILS, ...AUTRES];
  for (let i = 0; i < tous.length; i++) for (let j = i + 1; j < tous.length; j++) {
    if (PAREILS.includes(tous[i]) && PAREILS.includes(tous[j])) continue;
    const s = similarite(TEL[tous[i]], TEL[tous[j]]);
    assert.ok(s < SEUIL_RESSEMBLANCE, `${tous[i]} / ${tous[j]} : ${s}`);
  }
});

test('distance = 1 − ressemblance ; symétrique ; grilles incomparables -> null', () => {
  const a = TEL['prospect-epi-dor'], b = TEL['finck-fisch'];
  assert.equal(distance(a, b), Math.round((1 - similarite(a, b)) * 1000) / 1000);
  assert.equal(similarite(a, b), similarite(b, a));
  assert.equal(similarite(a, { grille: [], mesures: a.mesures }), null);
  assert.equal(distance(a, { grille: [], mesures: a.mesures }), null);
});

test('accord des grilles : vide contre vide ne compte pas, décalage d\'une ligne = moitié', () => {
  const vide = new Array(96).fill('');
  const haut = [...vide]; haut[0] = 'titre';
  const bas = [...vide]; bas[8] = 'titre';
  assert.equal(accordGrille({ grille: haut }, { grille: haut }), 1);
  // deux cases occupées (une de chaque côté), chacune retrouve son rôle une ligne plus loin : 0,5 + 0,5 sur 2
  assert.equal(accordGrille({ grille: haut }, { grille: bas }), 0.5);
  const loin = [...vide]; loin[40] = 'titre';
  assert.equal(accordGrille({ grille: haut }, { grille: loin }), 0);
  assert.equal(accordGrille({ grille: vide }, { grille: vide }), 1);
});

test('accord des mesures : partager une absence compte moitié', () => {
  assert.equal(accordMesures(mes({ ...carteSurPhoto, partImage: 0.6 }), mes({ ...carteSurPhoto, partImage: 0.6 })), 1);
  assert.equal(accordMesures(mes({}), mes({})), (1 + 4 * 0.5) / 5);
  assert.equal(accordMesures(mes({ positionH1: 'bas' }), mes({ positionH1: 'haut', barreBas: true })), (0 + 3 * 0.5) / 5);
});

test('grille : peinture du fond vers le devant (le h1 dans la carte, la carte sur la photo)', () => {
  const roles = { image: [[0, 0, 390, 844]], carte: [[0, 422, 390, 422]], titre: [[0, 422, 390, 70]] };
  const gr = grille(roles, 390, 844);
  assert.equal(gr[0], 'image');
  assert.equal(gr[6 * 8], 'titre');
  assert.equal(gr[11 * 8], 'carte');
  assert.equal(grille({}, 390, 844).every((x) => x === ''), true);
  assert.equal(raster({ titre: [[0, 0, 390, 844]] }, 390, 844).every((x) => x === 'titre'), true);
});

test('recouvrement et colonnes de texte', () => {
  assert.equal(recouvrement([0, 0, 100, 100], [[0, 0, 50, 100]]), 0.5);
  assert.equal(recouvrement([0, 0, 100, 100], []), 0);
  assert.equal(colonnesTexte([[0, 100, 600, 200], [700, 100, 600, 200]], 1400, 900), 2);
  assert.equal(colonnesTexte([[0, 100, 600, 200], [0, 400, 600, 200]], 1400, 900), 1);
  assert.equal(colonnesTexte([[0, 100, 600, 200], [620, 100, 50, 200]], 1400, 900), 1);
});

test('mesures d\'un relevé : h1 sur l\'image au milieu, carte, numéro sous le h1, barre à 3 boutons', () => {
  const rel = { vw: 390, vh: 844, h1Px: 39, boutonsBarre: 3, blocsTexte: [[16, 300, 358, 80]], roles: {
    image: [[0, 0, 390, 500]], carte: [[16, 300, 358, 400]], titre: [[32, 320, 326, 80]], telephone: [[32, 420, 260, 40]],
    'barre-bas': [[0, 790, 390, 54]], nav: [[0, 0, 390, 56]], actions: [], texte: [] } };
  const m = mesures(rel);
  assert.equal(m.positionH1, 'milieu');
  assert.equal(m.h1SurImage, true);
  assert.equal(m.carte, true);
  assert.equal(m.carteSurImage, true);
  assert.equal(m.telSousH1, true);
  assert.equal(m.barreBas, true);
  assert.equal(m.boutonsBarre, 3);
  assert.equal(m.tailleH1, 0.1);
  assert.equal(m.colonnesTexte, 1);
  assert.ok(m.partImage > 0.55 && m.partImage < 0.62, String(m.partImage));
  assert.equal(empreinteMode(rel).grille.length, 96);
  const sans = mesures({ vw: 390, vh: 844, roles: {}, blocsTexte: [] });
  assert.deepEqual([sans.positionH1, sans.h1SurImage, sans.carte, sans.barreBas, sans.partImage], [null, false, false, false, 0]);
});

test('ce qui est pareil : le motif du fondateur en mots', () => {
  const t = ceQuiEstPareil(TEL['prospect-epi-dor'], TEL['prospect-ballay-macon']);
  assert.match(t, /^h1 sur l'image au milieu, carte posée sur l'image, numéro sous le h1, barre basse à 3 boutons, \d+ % de la grille au même rôle$/);
  assert.match(ceQuiEstPareil(TEL['prospect-epi-dor'], TEL['fromagerie-ravanel-d']), /barre basse, /);
  assert.match(ceQuiEstPareil(TEL['fromagerie-ravanel-b'], TEL['finck-fisch']), /^h1 en haut hors de l'image, pas d'image/);
});

test('verdict : un site contre tout le registre, nomme le plus proche et ce qui est pareil', () => {
  const reg = Object.entries(TEL).map(([slug, m]) => ({ slug, m, d: m }));
  const v = verdict(reg.find((e) => e.slug === 'prospect-epi-dor'), reg);
  assert.equal(v.echec, true);
  assert.equal(v.proches[0].slug, 'prospect-ballay-macon');
  assert.ok(v.proches.every((p) => p.slug !== 'prospect-epi-dor'));
  assert.match(v.proches[0].pareil[0], /^téléphone : h1 sur l'image/);
  assert.deepEqual(v.proches.filter((p) => p.trop).map((p) => p.slug).sort(), ['fromagerie-ravanel-d', 'prospect-a-coeur-bois', 'prospect-ballay-macon']);
  assert.equal(verdict(reg.find((e) => e.slug === 'fromagerie-ravanel-c'), reg).echec, false);
  // ressemblance à l'ordinateur seulement : échoue aussi, et le dit
  const x = verdict({ slug: 'x', m: TEL['finck-fisch'], d: TEL['prospect-epi-dor'] }, [{ slug: 'y', m: TEL['fromagerie-ravanel-c'], d: TEL['prospect-ballay-macon'] }]);
  assert.equal(x.echec, true);
  assert.deepEqual(x.proches[0].pareil.map((p) => p.split(' : ')[0]), ['ordinateur']);
  assert.equal(verdict(reg[0], reg, 0.99).echec, false);
});

test('paires trop proches du registre : exactement les six paires du fondateur', () => {
  const reg = Object.entries(TEL).map(([slug, m]) => ({ slug, m, d: m }));
  const p = pairesTropProches(reg);
  assert.equal(p.length, 6);
  assert.ok(p.every((x) => PAREILS.includes(x.a) && PAREILS.includes(x.b)));
});

test('grille en texte', () => {
  const t = grilleTexte(TEL['finck-fisch'].grille).split('\n');
  assert.equal(t[0], 'NNNNNNNN');
  assert.equal(t.length, 12);
});

/* ---------- déroulé de la page entière et empreinte de site (scripts/ff/deroule.mjs) ---------- */

// Blocs en HTML fixe : un par rôle, avec les traits de mise en page que relève Chrome (hauteur en écrans, part
// d'image, images d'au moins 60x60, images sur une rangée).
const BLOCS = {
  heros: { html: '<section id="hero" class="dev"><h1>Boulangerie à Orléans</h1><img src="a.jpg"><a href="tel:+33238000000">02 38 00 00 00</a></section>', index: 0, hEcrans: 0.94, partImage: 0.47 },
  preuve: { html: '<section id="avs"><h2>4,6 sur Google</h2><blockquote>Le meilleur pain.</blockquote><blockquote>Accueil parfait.</blockquote><span aria-label="5 étoiles">★★★★★</span></section>', hEcrans: 0.6 },
  offres: { html: '<section id="prestations"><h2>Nos prestations</h2><article><h3>Pains</h3><p>Dès 1,20 €</p></article><article><h3>Gâteaux</h3><p>Dès 3 €</p></article><article><h3>Pièces montées</h3></article></section>', hEcrans: 2.3, partImage: 0.24 },
  realisations: { html: '<section class="grille"><h2>Le mur</h2>' + '<img src="x.jpg">'.repeat(6) + '</section>', hEcrans: 1.1, partImage: 0.6, nImages: 6, rangee: 2 },
  apropos: { html: '<section id="alain"><h2>Alain Ballay</h2><img src="portrait.jpg"><p>' + 'Maçon depuis trente ans, il travaille seul. '.repeat(12) + '</p></section>', hEcrans: 1.15, partImage: 0.19, nImages: 1 },
  questions: { html: '<section><h2>Avant d’appeler</h2>' + '<details><summary>Combien de temps ?</summary><p>Trois jours.</p></details>'.repeat(4) + '</section>', hEcrans: 0.7 },
  contact: { html: '<section id="ecrire"><h2>Un projet ?</h2><form><input name="nom"><input type="email" name="mail"><textarea name="msg"></textarea><button type="submit">Envoyer</button></form></section>', hEcrans: 1.2 },
  lieu: { html: '<section id="vnr"><h2>Où nous trouver</h2><iframe src="https://www.openstreetmap.org/export/embed.html"></iframe><p>59 rue Maurice Dubois, 45000 Orléans</p><p>Lundi 7h–19h, mardi 7h–19h, samedi 7h–13h</p></section>', hEcrans: 1.2 },
  outil: { html: '<section class="sim"><h2>Combien de parts ?</h2><input type="range" min="2" max="20"><output>8</output></section>', hEcrans: 1.1 },
  texte: { html: '<section><h2>Notre méthode</h2><p>' + 'Une phrase de texte courant, sans image, qui se lit longuement. '.repeat(50) + '</p></section>', hEcrans: 3, partImage: 0 },
  appel: { html: '<section id="cta-final"><h2>On en parle ?</h2><a href="tel:+33600000000">06 00 00 00 00</a></section>', hEcrans: 0.5 },
  pied: { html: '<footer class="pdb"><p>Ballay Maçonnerie</p><a href="/mentions-legales">Mentions</a></footer>', tag: 'footer', hEcrans: 0.9 },
  autre: { html: '<section class="intermede"><div></div></section>', hEcrans: 0.3, partImage: 1 },
};

test('déroulé : classement de blocs HTML fixes, un par rôle, avec les raisons', () => {
  for (const [role, b] of Object.entries(BLOCS)) {
    const id = (b.html.match(/id="([^"]*)"/) || [])[1] || '';
    const cls = (b.html.match(/class="([^"]*)"/) || [])[1] || '';
    const c = classerBloc({ tag: b.tag || 'section', id, cls, traits: traitsBloc(b.html), hEcrans: b.hEcrans, partImage: b.partImage ?? 0, nImages: b.nImages ?? 0, rangee: b.rangee ?? 0 }, { index: b.index ?? 3 });
    assert.equal(c.role, role, `${role} classé ${c.role} (${c.raisons.join(', ')})`);
    if (role !== 'autre') assert.ok(c.raisons.length > 0, role);
  }
  // le bloc qui porte le h1 hors de la première place reste un héros ; un id abrégé se lit par le titre
  assert.equal(classerBloc({ tag: 'section', traits: traitsBloc('<section><h1>Titre</h1></section>') }, { index: 2 }).role, 'heros');
  assert.equal(classerBloc({ tag: 'section', id: 'qst', traits: traitsBloc('<section><h2>On nous demande souvent</h2></section>') }, { index: 4 }).role, 'questions');
  assert.deepEqual(classerBloc({ tag: 'section', traits: traitsBloc(BLOCS.autre.html), partImage: 1, hEcrans: 0.3 }, { index: 3 }).raisons, ['bandeau photo']);
});

test('déroulé : traits lus dans le HTML (balises, titres, horaires, adresse, étoiles)', () => {
  const t = traitsBloc(BLOCS.lieu.html + BLOCS.preuve.html + '<dl><dt>Faut-il réserver ?</dt><dd>Non.</dd><dt>Horaires</dt></dl><svg><text>★★★</text></svg>');
  assert.equal(t.carte, 1);
  assert.equal(t.iframe, 1);
  assert.equal(t.jours, 3);
  assert.ok(t.heures >= 3);
  assert.equal(t.adresse, true);
  assert.equal(t.blockquote, 2);
  assert.ok(t.etoiles >= 2, String(t.etoiles)); // « 4,6 sur … » non (sur Google), « 5 étoiles » + ★ ; le svg est ignoré
  assert.equal(t.dt, 1); // seuls les <dt> en question comptent
  assert.deepEqual(t.titres.map((x) => x.niv), [2, 2]);
  const f = traitsBloc(BLOCS.contact.html);
  assert.deepEqual([f.form, f.champs, f.boutons], [1, 3, 0]);
  assert.equal(traitsBloc('').texte, 0);
});

test('déroulé : pages de dist/ (légal, 404, merci hors contenu)', () => {
  assert.deepEqual(compterPages(['index.html', '404.html', 'mentions-legales.html', 'confidentialite.html', 'services/pains.html', 'services/fetes.html', 'credits.html', 'audit/merci.html', 'audit.html']), { html: 8, contenu: 3 });
  assert.deepEqual(compterPages(['index.html', 'mentions-legales.html']), { html: 2, contenu: 0 });
  assert.deepEqual(compterPages(['index.html', 'a\\b.html']), { html: 2, contenu: 1 });
});

test('déroulé : modèle de navigation', () => {
  assert.equal(modeleNavigation({ pagesLiees: 5, pagesContenu: 5, ecrans: 7.7 }), 'plusieurs pages');
  assert.equal(modeleNavigation({ pagesLiees: 0, navAncres: 4, pagesContenu: 0, ecrans: 7 }), 'longue page à ancres');
  assert.equal(modeleNavigation({ pagesLiees: 1, pagesContenu: 1, ecrans: 10 }), 'longue page à ancres');
  assert.equal(modeleNavigation({ pagesLiees: 4, pagesContenu: 4, ecrans: 1.1 }), 'accueil-menu sans défilement');
  // accueil-index (anna-vidal, borie-des-chenes) : la liste des pages est dans le corps, pas dans le menu
  assert.equal(modeleNavigation({ pagesLiees: 0, pagesCorps: 5, pagesContenu: 5, ecrans: 1.2 }), 'accueil-menu sans défilement');
  assert.equal(modeleNavigation({ pagesLiees: 0, pagesCorps: 5, pagesContenu: 5, ecrans: 8 }), 'longue page à ancres');
  assert.equal(modeleNavigation({ horizontal: true, pagesLiees: 5, pagesContenu: 5 }), 'défilement horizontal');
  assert.equal(modeleNavigation({ partOnglets: 0.7, ecrans: 2 }), 'onglets');
  // liens vers des pages qui n'existent pas dans dist/ : pas « plusieurs pages »
  assert.equal(modeleNavigation({ pagesLiees: 4, pagesContenu: 0, ecrans: 7 }), 'longue page à ancres');
});

test('déroulé : distance d\'édition, voisins à moitié, alignement', () => {
  const a = ['heros', 'preuve', 'offres', 'lieu', 'pied'];
  assert.equal(accordSuites(a, a), 1);
  assert.equal(alignerSuites(a, ['heros', 'preuve', 'offres', 'contact', 'pied']).distance, 0.5); // lieu ~ contact
  assert.equal(alignerSuites(a, ['heros', 'offres', 'lieu', 'pied']).distance, 1);
  assert.equal(accordSuites(['heros', 'pied'], ['heros', 'outil', 'texte', 'pied']), 0.5);
  assert.equal(accordSuites([], []), 1);
  const { paires } = alignerSuites(['heros', 'preuve', 'pied'], ['heros', 'pied']);
  assert.deepEqual(paires, [['heros', 'heros'], ['preuve', null], ['pied', 'pied']]);
  assert.deepEqual(sousSuiteCommune(['heros', 'preuve', 'offres', 'pied'], ['heros', 'offres', 'preuve', 'pied']).length, 3);
  assert.equal(suiteDeRoles([{ role: 'heros', hEcrans: 1 }, { role: 'autre', hEcrans: 0.3 }, { role: 'autre', hEcrans: 1.2 }, { role: 'pied' }]).join(','), 'heros,autre,pied');
});

test('déroulé : accord du site (modèle et pages pèsent 1, longueur et image 0,5 ; pages hors jeu quand les deux ont le socle)', () => {
  const p = { modele: 'plusieurs pages', pagesContenu: 5, ecrans: 8, partImage: 0.2 };
  assert.equal(accordSite(p, p), 1);
  assert.equal(accordSite(p, { ...p, modele: 'longue page à ancres', pagesContenu: 0 }), Math.round(1 / 3 * 1000) / 1000);
  assert.equal(accordSite(p, { ...p, ecrans: 4 }), Math.round((1 + 0.5 * 0.5 + 0.5) / 2 * 1000) / 1000);
  assert.equal(accordSite(p, null), 0);
  // 31 oct 2026 : deux sites à 4 pages de contenu ou plus (le socle) ne s'accordent plus par ce seul fait
  assert.equal(accordSite(p, { ...p, pagesContenu: 9, ecrans: 4 }), Math.round((1 + 0.5 * 0.5 + 0.5) / 2 * 1000) / 1000);
  const petit = { ...p, pagesContenu: 2 };
  assert.equal(accordSite(petit, petit), 1, 'sous 4 pages, le critère compte toujours');
  assert.equal(accordSite(petit, { ...petit, modele: 'longue page à ancres' }), Math.round(2 / 3 * 1000) / 1000);
  assert.equal(similariteDeroule({ roles: [] }, { roles: ['heros'] }), null);
});

// Suites et sites relevés le 17 oct 2026 vers 20 h (dist de ce moment), au téléphone.
const site = (o) => ({ pagesHtml: 1, navPages: 0, navAncres: 0, piedPages: 0, pagesLiees: 0, partOnglets: 0, horizontal: false, ...o });
const DER = {
  'prospect-epi-dor': { roles: ['heros', 'preuve', 'offres', 'realisations', 'apropos', 'lieu', 'pied'], site: site({ pagesHtml: 8, pagesContenu: 5, navPages: 5, navAncres: 1, pagesLiees: 5, ecrans: 7.7, partImage: 0.2, modele: 'plusieurs pages' }) },
  'prospect-ballay-macon': { roles: ['heros', 'preuve', 'realisations', 'offres', 'apropos', 'contact', 'pied'], site: site({ pagesHtml: 9, pagesContenu: 6, navPages: 6, navAncres: 3, piedPages: 6, pagesLiees: 6, ecrans: 8, partImage: 0.22, modele: 'plusieurs pages' }) },
  'prospect-a-coeur-bois': { roles: ['heros', 'offres', 'preuve', 'apropos', 'lieu', 'pied'], site: site({ pagesHtml: 8, pagesContenu: 5, navPages: 5, navAncres: 3, piedPages: 5, pagesLiees: 5, ecrans: 7.7, partImage: 0.16, modele: 'plusieurs pages' }) },
  'fromagerie-ravanel-d': { roles: ['heros', 'offres', 'apropos', 'questions', 'lieu', 'pied'], site: site({ pagesHtml: 9, pagesContenu: 5, navAncres: 4, piedPages: 5, pagesLiees: 5, ecrans: 6.5, partImage: 0.08, modele: 'plusieurs pages' }) },
  'fromagerie-ravanel': { roles: ['heros', 'offres', 'contact', 'questions', 'lieu', 'pied'], site: site({ pagesHtml: 3, pagesContenu: 0, navAncres: 3, ecrans: 6.6, partImage: 0.11, modele: 'longue page à ancres' }) },
  'fromagerie-ravanel-b': { roles: ['heros', 'offres', 'outil', 'offres', 'questions', 'lieu', 'pied'], site: site({ pagesHtml: 4, pagesContenu: 0, navAncres: 4, ecrans: 7.4, partImage: 0, modele: 'longue page à ancres' }) },
  'fromagerie-ravanel-c': { roles: ['heros', 'contact', 'offres', 'questions', 'lieu', 'pied'], site: site({ pagesHtml: 4, pagesContenu: 0, navAncres: 5, piedPages: 4, pagesLiees: 4, ecrans: 7.1, partImage: 0.02, partOnglets: 0.12, modele: 'longue page à ancres' }) },
  'finck-fisch': { roles: ['heros', 'preuve', 'realisations', 'realisations', 'realisations', 'apropos', 'offres', 'autre', 'questions', 'appel', 'pied'], site: site({ pagesHtml: 6, pagesContenu: 1, navPages: 1, navAncres: 2, pagesLiees: 1, ecrans: 10.4, partImage: 0.39, modele: 'longue page à ancres' }) },
};
const PISTES_RAVANEL = ['fromagerie-ravanel', 'fromagerie-ravanel-b', 'fromagerie-ravanel-c'];

test('calibration du déroulé : les quatre sites du fondateur sont semblables deux à deux', () => {
  for (let i = 0; i < PAREILS.length; i++) for (let j = i + 1; j < PAREILS.length; j++) {
    const s = similariteDeroule(DER[PAREILS[i]], DER[PAREILS[j]]);
    assert.ok(s > SEUIL_DEROULE, `${PAREILS[i]} / ${PAREILS[j]} : ${s}`);
  }
});

test('calibration du déroulé : ardoise, escalier, semaine et finck-fisch restent sous le seuil contre les quatre', () => {
  for (const a of PAREILS) for (const b of AUTRES) {
    const s = similariteDeroule(DER[a], DER[b]);
    assert.ok(s < SEUIL_DEROULE, `${a} / ${b} : ${s}`);
  }
  for (const b of PISTES_RAVANEL) assert.ok(similariteDeroule(DER['finck-fisch'], DER[b]) < SEUIL_DEROULE, b);
  // vrai et voulu : les trois pistes Ravanel ont entre elles le même déroulé (même contenu, même ordre, une page)
  for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) assert.ok(similariteDeroule(DER[PISTES_RAVANEL[i]], DER[PISTES_RAVANEL[j]]) > SEUIL_DEROULE);
  // rav-d est plus près de l'ardoise par la seule suite, mais la navigation le range avec les prospects
  assert.ok(accordSuites(DER['fromagerie-ravanel-d'].roles, DER['fromagerie-ravanel'].roles) > accordSuites(DER['fromagerie-ravanel-d'].roles, DER['prospect-epi-dor'].roles));
  assert.ok(similariteDeroule(DER['fromagerie-ravanel-d'], DER['prospect-epi-dor']) > similariteDeroule(DER['fromagerie-ravanel-d'], DER['fromagerie-ravanel']));
});

test('déroulé : ce qui est pareil, en mots', () => {
  const t = ceQuiEstPareilDeroule(DER['prospect-epi-dor'], DER['prospect-ballay-macon']);
  assert.equal(t, 'même ordre : héros, avis, réalisations, à propos, pied de page ; même navigation : menu vers des pages et ancres ; 5 et 6 pages de contenu ; même longueur (7,7 et 8 écrans)');
  assert.match(ceQuiEstPareilDeroule(DER['fromagerie-ravanel'], DER['fromagerie-ravanel-c']), /^même ordre : héros, (services|contact), questions, lieu\/horaires, pied de page ; même navigation à ancres ; même longueur \(6,6 et 7,1 écrans\)$/);
  assert.equal(ceQuiEstPareilDeroule({ roles: ['heros'], site: {} }, { roles: ['pied'], site: {} }), 'rien de saillant');
  assert.equal(suiteEnMots(['heros', 'preuve', 'pied']), 'héros › avis › pied de page');
});

test('verdict et paires : le déroulé refuse seul, et le dit', () => {
  const reg = Object.keys(TEL).map((slug) => ({ slug, m: TEL[slug], d: TEL[slug], deroule: DER[slug] }));
  const v = verdict(reg.find((e) => e.slug === 'fromagerie-ravanel'), reg);
  assert.equal(v.echec, true);
  const proches = v.proches.filter((p) => p.trop);
  assert.deepEqual(proches.map((p) => p.slug).sort(), ['fromagerie-ravanel-b', 'fromagerie-ravanel-c']);
  assert.ok(proches.every((p) => p.tropDeroule && !p.tropEcran));
  assert.match(proches[0].pareil[0], /^déroulé : même ordre : héros, services/);
  // premier écran ET déroulé : epi / ballay
  const w = verdict(reg[0], reg);
  const ballay = w.proches.find((p) => p.slug === 'prospect-ballay-macon');
  assert.ok(ballay.tropEcran && ballay.tropDeroule && ballay.deroule > 0.8);
  assert.deepEqual(ballay.pareil.map((x) => x.split(' : ')[0]), ['téléphone', 'ordinateur', 'déroulé']);
  assert.equal(verdict(reg.find((e) => e.slug === 'finck-fisch'), reg).echec, false);
  // sans empreinte de déroulé (registre ancien) : premier écran seul, comme avant
  assert.equal(verdict({ slug: 'x', m: TEL['finck-fisch'], d: TEL['finck-fisch'] }, reg).proches.every((p) => p.deroule == null), true);
  const paires = pairesTropProches(reg);
  assert.equal(paires.filter((p) => p.tropEcran).length, 6);
  assert.equal(paires.filter((p) => p.tropDeroule).length, 9); // les 6 du fondateur + les 3 paires de pistes Ravanel
  assert.ok(paires.filter((p) => p.tropDeroule && !p.tropEcran).every((p) => PISTES_RAVANEL.includes(p.a) && PISTES_RAVANEL.includes(p.b)));
  assert.match(paires.find((p) => p.a === 'prospect-epi-dor' && p.b === 'prospect-ballay-macon').pareil, / \| déroulé : même ordre/);
});

test('déroulé : colonne de la planche alignée avec le plus proche', () => {
  const l = lignesDeroule(DER['prospect-a-coeur-bois'], DER['fromagerie-ravanel-d']);
  assert.deepEqual(l[0], { gauche: 'héros', droite: 'héros', etat: 'pareil' });
  assert.equal(l.length, 6);
  assert.ok(l.some((x) => x.etat !== 'pareil'));
  assert.deepEqual(lignesDeroule({ roles: ['heros', 'lieu'] }, { roles: ['heros', 'contact'] })[1], { gauche: 'lieu/horaires', droite: 'contact', etat: 'voisin' });
  assert.deepEqual(lignesDeroule({ roles: ['heros', 'outil'] }, { roles: ['heros'] })[1], { gauche: 'outil', droite: '—', etat: 'trou' });
});

test('déroulé : empreinte d\'un relevé et reclassement du registre sans Chrome', () => {
  const rel = { vw: 390, vh: 844, docH: 844 * 5, docW: 390, partOnglets: 0, horizontal: false,
    nav: { pages: ['/services/pains', '/services/fetes'], ancres: ['#avis'] }, pied: { pages: ['/services/pains'], ancres: [] },
    blocs: ['heros', 'preuve', 'questions', 'lieu', 'pied'].map((r, i) => ({ tag: BLOCS[r].tag || 'section', id: (BLOCS[r].html.match(/id="([^"]*)"/) || [])[1] || '', cls: '', aria: '', y: i * 844, h: 844, partImage: 0, nImages: 0, rangee: 0, carrousel: false, h1: r === 'heros', html: BLOCS[r].html })) };
  const e = empreinteDeroule(rel, { html: 5, contenu: 2 });
  assert.deepEqual(e.roles, ['heros', 'preuve', 'questions', 'lieu', 'pied']);
  assert.deepEqual([e.site.modele, e.site.pagesLiees, e.site.navAncres, e.site.ecrans], ['plusieurs pages', 2, 1, 5]);
  assert.equal(e.blocs[1].titre, '4,6 sur Google');
  assert.equal('html' in e.blocs[0], false); // le registre garde les traits, pas le HTML
  const vieux = { ...e, roles: [], blocs: e.blocs.map((b) => ({ ...b, role: 'autre' })), site: { ...e.site, modele: '?' } };
  const r = rafraichirDeroule(vieux);
  assert.deepEqual(r.roles, e.roles);
  assert.equal(r.site.modele, 'plusieurs pages');
});

test('disposition (31 oct 2026) : axe séparé ; refus si la linéarité dépasse le seuil ; empreinte ancienne comparée comme avant', () => {
  const bandes = { version: 1, m: { blocs: [{ forme: 'pile', h: 3, pied: false, mes: { debord: 0 } }] }, d: { blocs: [{ forme: 'colonnes', h: 3, pied: false, mes: { debord: 0 } }] }, linearite: 1 };
  const fixe = { version: 1, m: { blocs: [{ forme: 'pile', h: 3, pied: false, mes: { debord: 0 } }] }, d: { blocs: [{ forme: 'fixe-lateral', h: 3, pied: false, mes: { debord: 0 } }] }, linearite: 0.5 };
  const a = { slug: 'a', m: TEL['finck-fisch'], disposition: bandes };
  const b = { slug: 'b', m: TEL['prospect-epi-dor'], disposition: fixe };
  const ancien = { slug: 'c', m: TEL['fromagerie-ravanel'] };
  const v = verdict(a, [a, b, ancien]);
  assert.equal(v.tropLineaire, true);
  assert.equal(v.echec, true);
  assert.equal(v.linearite, 1);
  assert.equal(v.proches.find((p) => p.slug === 'c').disposition, null);
  assert.ok(v.proches.find((p) => p.slug === 'b').disposition < 1);
  const w = verdict(b, [a, b, ancien]);
  assert.equal(w.tropLineaire, false);
  assert.equal(w.echec, false);
  // sans disposition : le verdict d'avant (aucun refus de linéarité)
  const x = verdict(ancien, [a, b, ancien]);
  assert.equal(x.linearite, null);
  assert.equal(x.tropLineaire, false);
  assert.equal(x.echec, x.proches.some((p) => p.trop));
});
