// Contrôle de ressemblance par la mise en page (scripts/ff/ressemblance.mjs) : fonctions pures seulement,
// sur des empreintes FIXES relevées le 17 oct 2026 vers 19 h (avant la reprise des prospects) : les quatre
// premiers écrans téléphone jugés « très similaires » par le fondateur, et quatre premiers écrans d'une autre
// mise en page. Aucun navigateur.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { raster, grille, recouvrement, colonnesTexte, mesures, empreinteMode, accordGrille, accordMesures, similarite, distance, ceQuiEstPareil, verdict, pairesTropProches, grilleTexte, SEUIL_RESSEMBLANCE, COLS, ROWS } from '../scripts/ff/ressemblance.mjs';

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
