// ff melanger (scripts/ff/melanger.mjs) : contraintes pures, tirage sans doublon, direction générée conforme au
// contrat des directions (tokens, color-scheme), enregistrement dans DIRECTIONS réversible.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  profilClient, refusPhotos, refusMouvement, refusFamille, partages, tirerMelange, construireRegistre, hashMelange,
  ligneContrat, genererDirection, insererDirection, retirerDirection, clampFluide, graissePlusProche, accentHsl,
  MAX_PARTAGES_SITE, MAX_PARTAGES_PISTES,
} from '../scripts/ff/melanger.mjs';
import { policesDuRegistre, lireAtomes, contraste, A_JUGER } from '../scripts/ff/atomes.mjs';
import { mulberry32 } from '../scripts/ff/look-data.mjs';
import { CLES_IA } from '../scripts/ff/ia.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const polices = policesDuRegistre(fs.readFileSync(path.join(ROOT, 'src/lib/fonts.ts'), 'utf8'));
const registreReel = construireRegistre(lireAtomes(path.join(ROOT, 'docs/veille/styles/atomes')), { polices, clesIa: CLES_IA });

/** Petit registre synthétique : n sites aux atomes tous tirables. */
function fauxRegistre(n = 6) {
  const entrees = [];
  const libres = [['bebas', 'karla'], ['gloock', 'hanken'], ['oswald', 'cabin'], ['bodoni', 'urbanist'], ['chivo', 'workSans'], ['ancizarSerif', 'figtree'], ['libreCaslonCondensed', 'dmMono'], ['rubik', 'rubik']];
  const traitements = ['plein-cadre', 'vignette', 'detoure', 'cadre', 'masque', 'noir-et-blanc'];
  for (let i = 0; i < n; i++) {
    entrees.push({ fichier: `s${i}.json`, atomes: {
      id: `s${i}`, version: 1, source: { url: `https://s${i}.fr/`, nom: `S${i}`, date: '2026-10-18' },
      typo: { titre: { famille: 'X', libre: libres[i % libres.length][0], graisse: 700, interlignage: 0.9, casse: 'uppercase', interlettrage: -0.02 }, texte: { famille: 'Y', libre: libres[i % libres.length][1], graisse: 400, interlignage: 1.5 }, mono: null, echelle: { h1: { telephone: 40, ordinateur: 96 }, h2: { telephone: 28, ordinateur: 48 }, texte: { telephone: 16, ordinateur: 18 } } },
      couleurs: { principal: 'clair', clair: { fond: '#ffffff', surface: A_JUGER, texte: '#1a1a1a', texte2: A_JUGER, accent: ['#c72531', '#0f2c56', '#4d7566', '#8a6500', '#702b1d', '#232e51'][i % 6], accent2: A_JUGER, bordure: A_JUGER, encre: A_JUGER }, sombre: null },
      densite: { section: { telephone: 64, ordinateur: 120 }, gouttiere: { telephone: 20, ordinateur: 40 }, conteneur: 1280, mesure: 60, rythme: 'uni' },
      formes: { rayon: i, rayonCarte: 0, rayonImage: 0, bordure: 1, ombre: 'aucune', bouton: 'plein', pilule: false, lien: 'souligne' },
      photos: { traitement: traitements[i % traitements.length], superposition: 'aucune' },
      mouvement: { regime: i % 2 ? 'vivant' : 'calme', defilement: i % 2 ? 'suit-le-defilement' : 'apparitions', ui: { duree: 0.2, courbe: 'ease' }, scene: { duree: 0.6, courbe: 'ease-out' } },
      matiere: { fond: 'uni', filets: 'aucun' }, architecture: null, premier_ecran: 'typographique',
    } });
  }
  return construireRegistre(entrees, { polices, clesIa: CLES_IA });
}

test('photos : pas de plein cadre sans une photo du client de 1 600 px', () => {
  assert.match(refusPhotos({ traitement: 'plein-cadre' }, profilClient({ photos: 4, largeurMax: 1200 })), /1 ?600/);
  assert.equal(refusPhotos({ traitement: 'plein-cadre' }, profilClient({ photos: 4, largeurMax: 2400 })), null);
  assert.equal(refusPhotos({ traitement: 'vignette' }, profilClient()), null);
});

test('mouvement : client « calme » = régime calme et rien qui suit le défilement', () => {
  const calme = profilClient({ mouvement: 'calme' });
  assert.ok(refusMouvement({ regime: 'vivant', defilement: 'apparitions' }, calme));
  assert.ok(refusMouvement({ regime: 'calme', defilement: 'suit-le-defilement' }, calme));
  assert.equal(refusMouvement({ regime: 'calme', defilement: 'apparitions' }, calme), null);
  assert.equal(refusMouvement({ regime: 'vivant', defilement: 'suit-le-defilement' }, profilClient({ mouvement: 'vivant' })), null);
});

test('familles de premier écran : leurs données sont exigées', () => {
  assert.ok(refusFamille('mosaique', profilClient({ photos: 3 })));
  assert.equal(refusFamille('mosaique', profilClient({ photos: 9 })), null);
  assert.ok(refusFamille('preuve-d-abord', profilClient({ avis: 12 })));
  assert.equal(refusFamille('typographique', profilClient()), null);
});

test('partages compte les atomes communs, dimension par dimension', () => {
  const a = { typo: 'x', couleurs: 'y', densite: 'z', formes: 'w', photos: 'p', mouvement: 'm', matiere: 'q', premier_ecran: 'diptyque', architecture: null };
  assert.equal(partages(a, { ...a }), 8, 'architecture nulle des deux côtés ne compte pas');
  assert.equal(partages(a, { ...a, typo: 'autre', couleurs: 'autre' }), 6);
});

test('tirage : jamais plus de 3 atomes partagés avec un site existant', () => {
  const reg = fauxRegistre(6);
  const rng = mulberry32(7);
  const existants = [];
  for (let k = 0; k < 12; k++) {
    const r = tirerMelange({ registre: reg, existants, familles: ['typographique', 'outil', 'editorial'], rng });
    assert.equal(r.erreur, undefined, r.erreur);
    for (const e of existants) assert.ok(partages(r.atomes, e.atomes) <= MAX_PARTAGES_SITE);
    existants.push({ slug: `site${k}`, atomes: r.atomes });
  }
});

test('tirage de 3 pistes : 2 atomes partagés au plus, familles différentes', () => {
  const reg = fauxRegistre(6);
  const rng = mulberry32(3);
  const soeurs = [];
  for (let k = 0; k < 3; k++) {
    const r = tirerMelange({ registre: reg, soeurs, familles: ['typographique', 'outil', 'editorial', 'diptyque'], rng });
    assert.equal(r.erreur, undefined, r.erreur);
    for (const s of soeurs) {
      assert.ok(partages(r.atomes, s) <= MAX_PARTAGES_PISTES, `${partages(r.atomes, s)} atomes partagés`);
      assert.notEqual(r.atomes.premier_ecran, s.premier_ecran);
    }
    soeurs.push(r.atomes);
  }
});

test('tirage : imposés respectés, contraintes client appliquées, refus explicites', () => {
  const reg = fauxRegistre(6);
  const r = tirerMelange({ registre: reg, imposes: { typo: 's2', couleurs: 's4' }, client: profilClient({ mouvement: 'calme', largeurMax: 800 }), familles: ['outil'], rng: mulberry32(1) });
  assert.equal(r.atomes.typo, 's2');
  assert.equal(r.atomes.couleurs, 's4');
  assert.notEqual(reg.parId[r.atomes.photos].photos.traitement, 'plein-cadre');
  assert.equal(reg.parId[r.atomes.mouvement].mouvement.regime, 'calme');
  assert.match(tirerMelange({ registre: reg, imposes: { typo: 'inconnu' }, rng: mulberry32(1) }).erreur, /inconnu/);
  assert.match(tirerMelange({ registre: reg, imposes: { photos: 's0' }, client: profilClient({ largeurMax: 0 }), rng: mulberry32(1) }).erreur, /plein cadre/);
});

test('tirage : la paire de polices d\'une direction existante est refusée', () => {
  const reg = fauxRegistre(2);
  reg.pairesPrises = new Set(['bebas|karla']);
  const r = tirerMelange({ registre: reg, imposes: { typo: 's0' }, rng: mulberry32(1), essaisMax: 20 });
  assert.ok(r.erreur);
});

test('hash stable et ligne de contrat lisible', () => {
  const m = { typo: 'coutumes', couleurs: 'meyers', densite: 'monarque', formes: 'framer-lintel', photos: 'paputmenorca', mouvement: 'meyers', matiere: 'coutumes', premier_ecran: 'typographique', architecture: null };
  assert.match(hashMelange(m), /^m-[0-9a-f]{6}$/);
  assert.equal(hashMelange(m), hashMelange({ ...m }));
  assert.notEqual(hashMelange(m), hashMelange({ ...m, typo: 'meyers' }));
  const l = ligneContrat(m);
  assert.match(l, /^Style : mélange <typo:coutumes · couleurs:meyers/);
  assert.match(l, /PREMIER ÉCRAN — famille : typographique/);
});

test('clampFluide, graisse disponible, accent recalé après arrondi', () => {
  assert.equal(clampFluide(40, 96), 'clamp(2.5rem, 1.2rem + 5.333vw, 6rem)');
  assert.equal(clampFluide(16, 16), '1rem');
  assert.match(clampFluide(24, 16), /^clamp\(1rem, /, 'un téléphone plus grand que l\'ordinateur reste un clamp valide');
  assert.equal(graissePlusProche(900, { variable: { wght: { min: '200', max: '700' } } }), 700);
  assert.equal(graissePlusProche(700, { weights: [400] }), 400, 'police statique : pas de faux gras');
  const a = accentHsl('#8a6500', ['#f4f3e6']);
  assert.ok(contraste(a.hex, '#f4f3e6') >= 4.5);
});

test('direction générée : tous les tokens du contrat, color-scheme si sombre, aucune police IA, règles appliquées', () => {
  const ids = { typo: 'pizza-amici', couleurs: 'framer-lintel', densite: 'coutumes', formes: 'monarque', photos: 'meyers', mouvement: 'meyers', matiere: 'cafebinocle' };
  const atomes = Object.fromEntries(Object.entries(ids).map(([d, id]) => [d, registreReel.parId[id][d]]));
  const sources = Object.fromEntries(Object.values(registreReel.parId).map((a) => [a.id, a.source.url]));
  const g = genererDirection('m-abc123', { atomes, ids, sources, polices, date: '2026-10-18' });
  for (const t of ['--bg', '--bg-2', '--surface', '--fg', '--muted', '--line', '--accent', '--accent-2', '--on-accent', '--ink', '--on-ink', '--font-display', '--font-body', '--font-mono', '--radius', '--radius-card', '--shadow-card', '--shadow-lift']) {
    assert.match(g.css, new RegExp(`\\n  ${t}:`), `token ${t}`);
  }
  assert.match(g.css, /color-scheme: dark/, 'palette sombre de framer-lintel');
  assert.match(g.css, /--radius: 6px/, 'pilule de monarque rendue à 6 px');
  assert.match(g.css, /box-shadow: 0 0 0 clamp/, 'photos en cadre (meyers)');
  assert.doesNotMatch(g.css, /feTurbulence|radial-gradient/, 'ni grain ni halo');
  const lh = Number(/:is\(h1, \.text-display-xl, \.text-display-lg\) \{ line-height: ([\d.]+)/.exec(g.css)[1]);
  assert.ok(lh >= 0.9, `interlignage du titre ${lh} (plancher 0,9 appris à l'essai)`);
  const corps = /body \{ font-size: (clamp\([^;]+\)|[\d.]+rem)/.exec(g.css)[1];
  assert.match(corps, /^clamp\(1rem|^1rem/, 'texte courant à 16 px au moins au téléphone');
  for (const cle of CLES_IA) assert.doesNotMatch(g.css, new RegExp(`fontsource(-variable)?/${cle}\\b`, 'i'));
  assert.match(g.meta, /melange: true/);
  assert.match(g.meta, /nom: 'm-abc123'/);
});

test('DIRECTIONS : insertion idempotente et retrait propre', () => {
  const schema = "export const DIRECTIONS = [\n  'atelier', // a\n  'brut', // b\n] as const;\nexport type Direction = 1;\n";
  const un = insererDirection(schema, 'm-abc123', 'essai');
  assert.match(un, /\n  'm-abc123', \/\/ essai\n\] as const;/);
  assert.equal(insererDirection(un, 'm-abc123'), un);
  const deux = insererDirection(un, 'm-def456');
  assert.equal(retirerDirection(retirerDirection(deux, 'm-abc123'), 'm-def456'), schema);
});

test('le registre réel permet au moins trois mélanges distincts pour un client sans photo', () => {
  const rng = mulberry32(11);
  const soeurs = [];
  for (let k = 0; k < 3; k++) {
    const r = tirerMelange({ registre: registreReel, soeurs, familles: ['typographique', 'outil', 'editorial', 'objet-du-metier'], client: profilClient(), rng });
    assert.equal(r.erreur, undefined, r.erreur);
    soeurs.push(r.atomes);
  }
});
