// Atomes de style (scripts/ff/atomes.mjs, docs/veille/styles/ATOMES.md) : validateur, couleurs, règles de polices,
// et le registre réel docs/veille/styles/atomes/*.json (chaque fichier valide).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  A_JUGER, validerAtomes, utilisables, controlerPolices, paletteComplete, contraste, ajusterPourContraste,
  hexVersHsl, hslVersHex, melangerCouleurs, policesDuRegistre, lireAtomes, GENRES,
} from '../scripts/ff/atomes.mjs';
import { brouillonDepuisReleve, enSecondes } from '../scripts/ff/atomes-mesurer.mjs';
import { CLES_IA } from '../scripts/ff/ia.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const polices = policesDuRegistre(fs.readFileSync(path.join(ROOT, 'src/lib/fonts.ts'), 'utf8'));
const opts = { polices, clesIa: CLES_IA };

function atomeOk() {
  return {
    id: 'essai', version: 1,
    source: { url: 'https://exemple.fr/', nom: 'Essai', date: '2026-10-18' },
    typo: { titre: { famille: 'X', libre: 'bebas', graisse: 400, interlignage: 0.9, casse: 'uppercase', interlettrage: -0.02 }, texte: { famille: 'Y', libre: 'karla', graisse: 400, interlignage: 1.5 }, mono: null, echelle: { h1: { telephone: 40, ordinateur: 96 }, h2: { telephone: 28, ordinateur: 48 }, texte: { telephone: 16, ordinateur: 18 } } },
    couleurs: { principal: 'clair', clair: { fond: '#ffffff', surface: A_JUGER, texte: '#111111', texte2: A_JUGER, accent: '#f9af26', accent2: A_JUGER, bordure: A_JUGER, encre: A_JUGER }, sombre: null },
    densite: { section: { telephone: 64, ordinateur: 120 }, gouttiere: { telephone: 20, ordinateur: 40 }, conteneur: 1280, mesure: 60, rythme: 'uni' },
    formes: { rayon: 2, rayonCarte: 0, rayonImage: 0, bordure: 1, ombre: 'aucune', bouton: 'plein', pilule: false, lien: 'souligne' },
    photos: { traitement: 'plein-cadre', superposition: 'aucune' },
    mouvement: { regime: 'calme', defilement: 'apparitions', ui: { duree: 0.2, courbe: 'ease' }, scene: { duree: 0.6, courbe: 'cubic-bezier(0.77, 0, 0.175, 1)' } },
    matiere: { fond: 'uni', filets: 'aucun' },
    architecture: null,
    premier_ecran: 'diptyque',
  };
}

test('un atome complet est valide et toutes ses dimensions mesurées sont tirables', () => {
  const r = validerAtomes(atomeOk(), opts);
  assert.deepEqual(r.erreurs, []);
  assert.equal(r.utilisables.typo, true);
  assert.equal(r.utilisables.couleurs, true);
  assert.equal(r.utilisables.architecture, false, 'architecture absente : non tirable');
});

test('« à juger » rend la dimension non tirable sans invalider le fichier', () => {
  const a = atomeOk();
  a.formes = A_JUGER;
  a.typo.echelle.h1 = A_JUGER;
  const r = validerAtomes(a, opts);
  assert.deepEqual(r.erreurs, []);
  assert.equal(r.utilisables.formes, false);
  assert.equal(r.utilisables.typo, false);
  assert.equal(r.utilisables.couleurs, true);
});

test('le validateur refuse une police IA, une police hors registre, un hex faux, une énumération inconnue', () => {
  const a = atomeOk();
  a.typo.titre.libre = 'fraunces';
  a.typo.texte.libre = 'policeImaginaire';
  a.couleurs.clair.fond = 'blanc';
  a.photos.traitement = 'polaroid';
  const e = validerAtomes(a, opts).erreurs.join('\n');
  assert.match(e, /liste IA/);
  assert.match(e, /absente du registre/);
  assert.match(e, /couleurs\.clair\.fond/);
  assert.match(e, /photos\.traitement/);
});

test('rôles de polices : jamais une police d\'affichage en texte courant, jamais deux serif d\'affichage', () => {
  assert.deepEqual(controlerPolices({ titre: { libre: 'bebas' }, texte: { libre: 'karla' } }, opts), []);
  assert.match(controlerPolices({ titre: { libre: 'bodoni' }, texte: { libre: 'libreBodoni' } }, opts).join(), /affichage/);
  assert.match(controlerPolices({ titre: { libre: 'karla' }, texte: { libre: 'bebas' } }, opts).join(), /texte/);
  assert.match(controlerPolices({ titre: { libre: 'fraunces' }, texte: { libre: 'karla' } }, opts).join(), /IA|registre/);
  // Une chasse fixe en texte courant est permise (La Table de Joakim, Pizza Amici l'ont mesurée).
  assert.deepEqual(controlerPolices({ titre: { libre: 'oswald' }, texte: { libre: 'intelOneMono' } }, opts), []);
});

test('chaque police du registre a un genre (sinon refusée en texte)', () => {
  const sansGenre = Object.keys(polices).filter((k) => !GENRES[k]);
  assert.deepEqual(sansGenre, []);
});

test('couleurs : contraste WCAG, mélange, aller-retour hsl', () => {
  assert.equal(Math.round(contraste('#000000', '#ffffff')), 21);
  assert.equal(contraste('#777777', '#777777'), 1);
  assert.equal(melangerCouleurs('#000000', '#ffffff', 0.5), '#808080');
  const c = '#4c181a';
  const back = hslVersHex(hexVersHsl(c));
  assert.ok(contraste(c, back) < 1.1, `${c} → ${back}`);
});

test('ajusterPourContraste assombrit sur fond clair et éclaircit sur fond sombre, même teinte', () => {
  const clair = ajusterPourContraste('#f9af26', '#ffffff', 4.5);
  assert.ok(clair.ajuste && contraste(clair.hex, '#ffffff') >= 4.5);
  assert.ok(Math.abs(hexVersHsl(clair.hex).h - hexVersHsl('#f9af26').h) <= 2);
  const sombre = ajusterPourContraste('#4d2a8a', '#0b0c0e', 4.5);
  assert.ok(contraste(sombre.hex, '#0b0c0e') >= 4.5);
  assert.equal(ajusterPourContraste('#111111', '#ffffff').ajuste, false);
});

test('paletteComplete : tous les textes tiennent l\'AA, l\'aplat garde la couleur mesurée', () => {
  const p = paletteComplete({ fond: '#f4f3e6', texte: '#0a4635', accent: '#ffc62d', accent2: '#e54d3a', encre: '#0a4635' });
  assert.deepEqual(p.refus, []);
  const k = p.tokens;
  for (const [x, nom] of [[k.fg, 'texte'], [k.muted, 'texte secondaire'], [k.accent, 'accent']]) {
    for (const f of [k.bg, k.bg2, k.surface]) assert.ok(contraste(x, f) >= 4.5, `${nom} ${x} sur ${f}`);
  }
  assert.equal(k.fill, '#ffc62d', 'le jaune mesuré reste l\'aplat des boutons');
  assert.ok(contraste(k.onFill, k.fill) >= 4.5);
  assert.ok(contraste(k.onAccent, k.accent) >= 4.5);
  assert.ok(contraste(k.onInk, k.ink) >= 4.5);
  assert.ok(p.ajustements.some((a) => /accent/.test(a)), 'l\'ajustement est noté');
});

test('paletteComplete refuse un texte illisible sur son fond', () => {
  assert.ok(paletteComplete({ fond: '#ffffff', texte: '#cccccc', accent: '#000000' }).refus.length);
});

test('brouillon depuis un relevé : seules les valeurs mesurées sont remplies', () => {
  const rel = { typo: { h1: { famille: 'Plaak', taille: 172.8, graisse: 700, interlignage: 0.8, casse: 'none', interlettrage: -0.02, italique: false }, h2: null, texte: { famille: 'Exposure', taille: 12, graisse: 400, interlignage: 1.3 }, elementsMono: 0 }, couleurs: { fondPage: '#ffffff', fonds: [{ hex: '#ffffff', part: 0.6 }], textes: [{ hex: '#000000', part: 0.9 }] }, densite: { marges: { mediane: 104 }, conteneur: 907, gouttiereBord: 40, ecartColonnes: 12, mesure: 70, fondsSections: [] }, formes: { boutons: { n: 2, rayon: 2, pilules: 0, pleins: 2, bordure: 1, casse: 'none' }, liens: { n: 4, souligne: 4 }, cartes: { n: 0 } }, photos: { rayon: 0, rapports: [{ valeur: '4:5' }] }, mouvement: { transitions: [{ valeur: '0.15s ease', n: 3 }, { valeur: '0.6s cubic-bezier(0.77, 0, 0.175, 1)', n: 2 }], bibliotheques: [] }, matiere: { filets: 0 } };
  const b = brouillonDepuisReleve({ id: 'x', url: 'https://x.fr', nom: 'X', date: '2026-10-18', d: rel, m: { ...rel, typo: { ...rel.typo, h1: { ...rel.typo.h1, taille: 89.7 }, texte: { ...rel.typo.texte, taille: 12 } }, densite: { ...rel.densite, marges: { mediane: 46 }, gouttiereBord: 24 } } });
  assert.deepEqual(b.typo.echelle.h1, { telephone: 89.7, ordinateur: 172.8 });
  assert.equal(b.typo.titre.libre, A_JUGER, 'la police libre est un jugement');
  assert.equal(b.typo.echelle.h2, A_JUGER);
  assert.equal(b.premier_ecran, A_JUGER);
  assert.equal(b.formes.lien, 'souligne');
  assert.deepEqual(b.mouvement.scene, { duree: 0.6, courbe: 'cubic-bezier(0.77, 0, 0.175, 1)' });
  assert.equal(b.formes.ombre, A_JUGER, 'aucune carte mesurée');
  assert.equal(enSecondes('300ms'), 0.3);
});

test('brouillon depuis un relevé : une mesure hors des bornes du registre reste « à juger »', () => {
  const rel = { typo: {}, couleurs: {}, densite: { marges: { mediane: 80 }, conteneur: 580, gouttiereBord: 20, mesure: 174, fondsSections: [] }, formes: {}, photos: {}, mouvement: {}, matiere: {} };
  const b = brouillonDepuisReleve({ id: 'x', url: 'https://x.fr', nom: 'X', date: '2026-10-27', d: rel, m: rel });
  assert.equal(b.densite.mesure, A_JUGER, '174 caractères : relevé sur des noms de produits');
  assert.equal(b.densite.conteneur, A_JUGER, '580 px : relevé sur une piste de carrousel');
  assert.deepEqual(validerAtomes(b, opts).erreurs, []);
});

test('registre réel : chaque fichier de docs/veille/styles/atomes/ est valide et sourcé', () => {
  const entrees = lireAtomes(path.join(ROOT, 'docs/veille/styles/atomes'));
  assert.ok(entrees.length >= 8, `${entrees.length} fichiers d'atomes (amorce : 8 à 10 au moins)`);
  for (const { fichier, atomes, erreurJson } of entrees) {
    assert.equal(erreurJson, undefined, fichier);
    assert.deepEqual(validerAtomes(atomes, opts).erreurs, [], fichier);
    assert.equal(`${atomes.id}.json`, fichier, 'le nom du fichier est l\'id');
    if (atomes.source.fiche) assert.ok(fs.existsSync(path.join(ROOT, atomes.source.fiche)), `${fichier} : fiche ${atomes.source.fiche} introuvable`);
    assert.ok(Object.values(utilisables(atomes)).some(Boolean), `${fichier} : rien de tirable`);
  }
});

test('typo : un titre qui ne domine pas le texte au téléphone est refusé (essai du 23 oct 2026, loewe)', async () => {
  const { controlerPolices } = await import('../scripts/ff/atomes.mjs');
  const typo = (h1, texte) => ({ titre: { libre: 'hanken' }, texte: { libre: 'hanken' }, echelle: { h1: { telephone: h1, ordinateur: 40 }, texte: { telephone: texte, ordinateur: 16 } } });
  const polices = { hanken: { role: 'body' } };
  assert.match(controlerPolices(typo(18, 14), { polices }).join(), /ne domine pas/, 'loewe : 18 px pour un texte porté à 16');
  assert.match(controlerPolices(typo(30, 30), { polices }).join(), /ne domine pas/);
  assert.equal(controlerPolices(typo(28, 20), { polices }).filter((x) => /domine/.test(x)).length, 0, 'maaemo : 28 pour 20');
  assert.equal(controlerPolices(typo('à juger', 16), { polices }).filter((x) => /domine/.test(x)).length, 0);
});
