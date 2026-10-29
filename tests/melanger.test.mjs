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
      couleurs: { principal: 'clair', clair: { fond: ['#ffffff', '#f0ece0', '#e4e4e4', '#f6efe4', '#dcdcdc', '#ebe6dd'][i % 6], surface: A_JUGER, texte: '#1a1a1a', texte2: A_JUGER, accent: ['#c72531', '#0f2c56', '#4d7566', '#8a6500', '#702b1d', '#232e51'][i % 6], accent2: A_JUGER, bordure: A_JUGER, encre: A_JUGER }, sombre: null },
      densite: { section: { telephone: 64, ordinateur: 120 }, gouttiere: { telephone: 20, ordinateur: 40 }, conteneur: 1280, mesure: 60, rythme: 'uni' },
      formes: { rayon: i, rayonCarte: 0, rayonImage: 0, bordure: 1, ombre: 'aucune', bouton: 'plein', pilule: false, lien: 'souligne' },
      photos: { traitement: traitements[i % traitements.length], superposition: 'aucune' },
      mouvement: { profil: ['fondu-sobre', 'chapitres-epingles', 'glisse-a-la-main', 'piste-horizontale', 'plans-au-chargement', 'parallaxe-et-aimant'][i % 6], regime: i % 2 ? 'vivant' : 'calme', defilement: i % 2 ? 'suit-le-defilement' : 'apparitions', ui: { duree: 0.2, courbe: 'ease' }, scene: { duree: 0.6, courbe: 'ease-out' } },
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

test('direction générée : la chasse fixe n’est chargée que si le site source en a une (sinon pile système)', () => {
  const sources = Object.fromEntries(Object.values(registreReel.parId).map((a) => [a.id, a.source.url]));
  const base = { couleurs: 'framer-lintel', densite: 'coutumes', formes: 'monarque', photos: 'meyers', mouvement: 'meyers', matiere: 'cafebinocle' };
  const gen = (typo) => {
    const ids = { typo, ...base };
    const atomes = Object.fromEntries(Object.entries(ids).map(([d, id]) => [d, registreReel.parId[id][d]]));
    return genererDirection('m-abc124', { atomes, ids, sources, polices, date: '2026-10-17' }).css;
  };
  const sansMono = Object.values(registreReel.parId).find((a) => a.typo && a.typo !== 'à juger' && !a.typo.mono && registreReel.reserves.typo.includes(a.id));
  assert.ok(sansMono, 'un atome typo sans chasse fixe dans le registre');
  const css = gen(sansMono.id);
  assert.doesNotMatch(css, /jetbrains/i, 'aucune police mono importée d’office');
  assert.match(css, /--font-mono: ui-monospace, monospace;/);
  const avecMono = Object.values(registreReel.parId).find((a) => a.typo && a.typo !== 'à juger' && a.typo.mono?.libre && registreReel.reserves.typo.includes(a.id));
  if (avecMono) assert.ok(gen(avecMono.id).includes(`@import '${polices[avecMono.typo.mono.libre].pkg}';`), 'la chasse fixe mesurée reste chargée');
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

test('arguments : « --matiere <id> » est un atome imposé, pas le drapeau booléen de ff vitrine', async () => {
  const { normaliserArgs } = await import('../scripts/ff/melanger.mjs');
  const { parseArgs } = await import('../scripts/ff/util.mjs');
  const { positional, flags } = parseArgs(normaliserArgs(['site-x', '--typo', 'coutumes', '--matiere', 'meyers', '--n', '3']));
  assert.deepEqual(positional, ['site-x']);
  assert.equal(flags.matiere, 'meyers');
  assert.equal(flags.typo, 'coutumes');
  assert.deepEqual(normaliserArgs(['s', '--matiere', '--essai']), ['s', '--matiere', '--essai'], 'sans valeur : inchangé');
});

test('direction générée : un lien dans un paragraphe est toujours souligné (WCAG 1.4.1, axe link-in-text-block)', () => {
  const sources = Object.fromEntries(Object.values(registreReel.parId).map((a) => [a.id, a.source.url]));
  for (const id of registreReel.reserves.formes) {
    const ids = { typo: registreReel.reserves.typo[0], couleurs: registreReel.reserves.couleurs[0], densite: registreReel.reserves.densite[0], formes: id, photos: registreReel.reserves.photos[0], mouvement: registreReel.reserves.mouvement[0], matiere: registreReel.reserves.matiere[0] };
    const atomes = Object.fromEntries(Object.entries(ids).map(([d, x]) => [d, registreReel.parId[x][d]]));
    const css = genererDirection('m-abc125', { atomes, ids, sources, polices, date: '2026-10-17' }).css;
    const regle = /:where\(main p a:not\(\.btn\)\) \{([^}]*)\}/.exec(css)?.[1] ?? '';
    assert.doesNotMatch(css, /\] main p a:not/, `formes ${id} : la règle des liens ne doit pas battre une classe de coquille (:where)`);
    assert.match(regle, /text-decoration: underline/, `formes ${id} : lien souligné`);
  }
});

test('importsDePolice : une police statique n’importe que ses graisses servies ; variable ou sans metadata, le paquet', async () => {
  const { importsDePolice } = await import('../scripts/ff/melanger.mjs');
  const meta = { weights: [200, 300, 400, 500, 600, 700, 800] };
  assert.deepEqual(importsDePolice('@fontsource/spectral/latin.css', [400, 500, 600, 700, 700], meta), [
    '@fontsource/spectral/latin-400.css', '@fontsource/spectral/latin-500.css', '@fontsource/spectral/latin-600.css', '@fontsource/spectral/latin-700.css',
  ]);
  assert.deepEqual(importsDePolice('@fontsource/bebas-neue/latin.css', [700], { weights: [400] }), ['@fontsource/bebas-neue/latin-400.css'], 'ramenée à la graisse disponible');
  assert.deepEqual(importsDePolice('@fontsource-variable/urbanist', [400, 700], meta), ['@fontsource-variable/urbanist']);
  assert.deepEqual(importsDePolice('@fontsource/spectral/latin.css', [400], undefined), ['@fontsource/spectral/latin.css']);
});

test('courbeCubique : --ease-brand toujours en cubic-bezier (mot-clé mesuré traduit, ease-in refusé)', async () => {
  const { courbeCubique } = await import('../scripts/ff/melanger.mjs');
  assert.equal(courbeCubique('ease'), 'cubic-bezier(0.25, 0.1, 0.25, 1)');
  assert.equal(courbeCubique('cubic-bezier(0.165, 0.84, 0.44, 1)'), 'cubic-bezier(0.165, 0.84, 0.44, 1)');
  assert.equal(courbeCubique('ease-in'), courbeCubique('ease-out'));
  assert.match(courbeCubique('à juger'), /^cubic-bezier\(/);
});

/* ---------- Garde de beauté (18 oct 2026, L'Épi d'Or d « juste un peu moche ») ---------- */

test('OKLCH : blanc neutre, jaune d’or de Café Binocle très chromatique', async () => {
  const { hexVersOklch, ecartTeinte } = await import('../scripts/ff/atomes.mjs');
  const blanc = hexVersOklch('#ffffff');
  assert.ok(Math.abs(blanc.l - 1) < 0.001 && blanc.c < 0.001);
  const or = hexVersOklch('#ffe26e');
  assert.ok(or.c > 0.13 && or.c < 0.15, `chroma ${or.c}`);
  assert.ok(Math.abs(or.h - 95) < 3, `teinte ${or.h}`);
  assert.equal(ecartTeinte(350, 10), 20);
});

const pal = (p) => ({ principal: 'clair', clair: { fond: '#fdfdfd', surface: A_JUGER, texte: '#1a1a1a', texte2: A_JUGER, accent: '#8a6500', accent2: A_JUGER, bordure: A_JUGER, encre: A_JUGER, ...p }, sombre: null });

test('beauté B1 : un aplat vif en fond de page est refusé, un neutre teinté (kraft, crème) passe', async () => {
  const { refusPalette } = await import('../scripts/ff/melanger.mjs');
  assert.match(refusPalette(pal({ fond: '#ffe26e', texte: '#594b3c' })).join(), /fond de page vif/);
  assert.deepEqual(refusPalette(pal({ fond: '#d6ceb4', texte: '#291d1a' })), [], 'kraft de Meyers');
  assert.deepEqual(refusPalette(pal({ fond: '#0f2c56', texte: '#f2ede9', accent: '#e3af04' })), [], 'bleu nuit profond en fond sombre');
});

test('beauté B3/B4 : trois aplats vifs concurrents refusés ; deux vives de même clarté et de teintes éloignées vibrent', async () => {
  const { refusPalette } = await import('../scripts/ff/melanger.mjs');
  assert.match(refusPalette(pal({ fond: '#ffe26e', accent: '#ef5b34', accent2: '#00a881' })).join(), /3 aplats vifs/);
  assert.match(refusPalette(pal({ accent: '#ef5b34', accent2: '#00a881' })).join(), /vibrent/, 'rouge-orangé et vert de même valeur');
  assert.deepEqual(refusPalette(pal({ accent: '#e3af04', accent2: '#c72531' })), [], 'or et rouge de Pizza Amici : clartés éloignées');
});

test('beauté B5 : plus de trois familles de teintes actives refusées', async () => {
  const { refusPalette } = await import('../scripts/ff/melanger.mjs');
  assert.match(refusPalette(pal({ texte: '#0f2c56', accent: '#8a6500', accent2: '#702b1d', encre: '#0a4635', surface: '#e9d8f2' })).join(), /familles de teintes/);
});

test('beauté B2 : capitales condensées sur fond coloré refusées, sur blanc acceptées', async () => {
  const { refusBeaute } = await import('../scripts/ff/melanger.mjs');
  const typo = { titre: { libre: 'bebas', casse: 'uppercase' }, texte: { libre: 'spectral' } };
  assert.match(refusBeaute({ typo, couleurs: pal({ fond: '#f2e3b8', texte: '#3a2a1a' }) }).join(), /capitales condensées/);
  assert.deepEqual(refusBeaute({ typo, couleurs: pal({}) }), []);
  assert.deepEqual(refusBeaute({ typo: { ...typo, titre: { libre: 'bebas', casse: 'none' } }, couleurs: pal({ fond: '#f2e3b8', texte: '#3a2a1a' }) }), [], 'casse normale');
});

test('beauté B6 : accord de polices en conflit (deux serifs, deux sans de texte différentes)', async () => {
  const { controlerPolices } = await import('../scripts/ff/atomes.mjs');
  const t = (titre, texte) => controlerPolices({ titre: { libre: titre }, texte: { libre: texte } }, { polices, clesIa: CLES_IA });
  assert.match(t('ebGaramond', 'spectral').join(), /conflit/);
  assert.match(t('karla', 'hanken').join(), /conflit/);
  assert.deepEqual(t('rubik', 'rubik'), [], 'une seule famille');
  assert.deepEqual(t('bodoni', 'urbanist'), [], 'didone + sans : contraste');
  assert.deepEqual(t('archivoBlack', 'specialGothic'), [], 'sans d’affichage + sans de texte');
});

test('beauté B7 : photos sombres et chaudes en vignettes nues sur blanc froid refusées', async () => {
  const { refusBeaute } = await import('../scripts/ff/melanger.mjs');
  const sombres = profilClient({ tonPhotos: { clarte: 48, chaleur: 30 } });
  const at = { couleurs: pal({}), photos: { traitement: 'vignette' }, formes: { ombre: 'aucune' }, matiere: { filets: 'aucun' } };
  assert.match(refusBeaute(at, sombres).join(), /vignettes nues/);
  assert.deepEqual(refusBeaute({ ...at, photos: { traitement: 'cadre' } }, sombres), []);
  assert.deepEqual(refusBeaute({ ...at, couleurs: pal({ fond: '#f2ede9' }) }, sombres), [], 'fond chaud');
  assert.deepEqual(refusBeaute(at, profilClient({ tonPhotos: { clarte: 70, chaleur: 5 } })), [], 'photos claires');
});

test('Épi d’Or : m-cca519 (version d, « un peu moche ») refusé, m-e7e9e8 (b) et m-751d7c (c) validés passent', async () => {
  const { refusBeaute } = await import('../scripts/ff/melanger.mjs');
  const sites = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/empreintes/melanges.json'), 'utf8')).sites;
  // Photos réelles de la boulangerie (raw/ de prospect-epi-dor-*) : L* médiane 48, chaudes (R - B ≈ 30).
  const client = profilClient({ photos: 10, largeurMax: 2000, tonPhotos: { clarte: 48, chaleur: 30 } });
  const verdict = (slug) => {
    const ids = sites[slug].atomes;
    return refusBeaute(Object.fromEntries(['typo', 'couleurs', 'densite', 'formes', 'photos', 'mouvement', 'matiere'].map((d) => [d, registreReel.parId[ids[d]][d]])), client);
  };
  const d = verdict('prospect-epi-dor-d');
  assert.equal(sites['prospect-epi-dor-d'].direction, 'm-cca519');
  for (const motif of [/fond de page vif/, /capitales condensées/, /aplats vifs/]) assert.ok(d.some((r) => motif.test(r)), `${motif} : ${d.join(' | ')}`);
  assert.equal(sites['prospect-epi-dor-b'].direction, 'm-e7e9e8');
  assert.deepEqual(verdict('prospect-epi-dor-b'), []);
  assert.equal(sites['prospect-epi-dor-c'].direction, 'm-751d7c');
  assert.deepEqual(verdict('prospect-epi-dor-c'), []);
});

test('registre réel : la palette jaune d’or de Café Binocle est écartée par la garde, avec sa raison', () => {
  assert.ok(!registreReel.reserves.couleurs.includes('cafebinocle'));
  assert.ok(registreReel.rejets.some((r) => /cafebinocle couleurs \(garde de beauté\)/.test(r)));
});

/* ---------- Profils de mouvement (docs/veille/styles/MOUVEMENTS.md) ---------- */

test('profils : 12 et plus (le catalogue grandit à chaque veille), tous documentés dans MOUVEMENTS.md, chaque atome du registre nomme un profil connu', async () => {
  const { PROFILS_MOUVEMENT, IDS_PROFILS } = await import('../scripts/ff/mouvements.mjs');
  assert.ok(IDS_PROFILS.length >= 12, `${IDS_PROFILS.length} profils`);
  const doc = fs.readFileSync(path.join(ROOT, 'docs/veille/styles/MOUVEMENTS.md'), 'utf8');
  for (const id of IDS_PROFILS) {
    assert.match(doc, new RegExp(`### \`${id}\``), `${id} documenté`);
    const p = PROFILS_MOUVEMENT[id];
    for (const k of ['entree', 'apparition', 'survol', 'fond', 'regime', 'defilement', 'poids', 'motion']) assert.ok(p[k], `${id}.${k}`);
    assert.ok(p.attributs.length, `${id} : attributs du moteur`);
  }
  for (const id of registreReel.reserves.mouvement) assert.ok(IDS_PROFILS.includes(registreReel.parId[id].mouvement.profil), id);
  const tirables = new Set(registreReel.reserves.mouvement.map((id) => registreReel.parId[id].mouvement.profil));
  assert.ok(tirables.size >= 12, `${tirables.size} profils tirables`);
});

test('profils : fond vidéo seulement avec une vraie vidéo ou ff animer / ff video prévu ; calme ; séquence ; chiffre', async () => {
  const { refusProfil, consignesProfil } = await import('../scripts/ff/mouvements.mjs');
  assert.match(refusProfil('video-de-fond', profilClient()), /vidéo/);
  for (const v of ['client', 'animer', 'banque']) assert.equal(refusProfil('video-de-fond', profilClient({ video: v })), null, v);
  assert.match(refusProfil('chapitres-epingles', profilClient({ mouvement: 'calme' })), /calme/);
  assert.equal(refusProfil('photo-qui-respire', profilClient({ mouvement: 'calme' })), null);
  assert.match(refusProfil('sequence-au-defilement', profilClient({ largeurMax: 1600 })), /1 920/);
  assert.equal(refusProfil('sequence-au-defilement', profilClient({ largeurMax: 2400 })), null, 'ff sequence-photo');
  assert.match(refusProfil('chiffres-qui-comptent', profilClient()), /chiffre/);
  assert.equal(refusProfil('chiffres-qui-comptent', profilClient({ avis: 120 })), null, 'le nombre d’avis Google est un vrai chiffre');
  const c = consignesProfil('video-de-fond', { video: 'banque' }).join('\n');
  assert.match(c, /poster obligatoire/);
  assert.match(c, /économie d'énergie/);
  assert.match(c, /jamais présentée comme celle du client/);
  assert.match(consignesProfil('video-de-fond', { video: 'animer' }).join('\n'), /data-ia="1"/);
});

test('profils : deux pistes sœurs ne partagent ni l’entrée ni l’apparition (GOUT § 4)', async () => {
  const { profilsTropProches } = await import('../scripts/ff/mouvements.mjs');
  assert.match(profilsTropProches('fondu-sobre', 'plans-au-chargement'), /apparition/);
  assert.equal(profilsTropProches('glisse-a-la-main', 'photo-qui-respire'), null, '« aucune » ne compte pas');
  const rng = mulberry32(5);
  const soeurs = [];
  for (let k = 0; k < 3; k++) {
    const r = tirerMelange({ registre: registreReel, soeurs, familles: ['typographique', 'outil', 'editorial', 'objet-du-metier'], client: profilClient({ photos: 10, largeurMax: 2000 }), rng });
    assert.equal(r.erreur, undefined, r.erreur);
    for (const s of soeurs) assert.equal(profilsTropProches(registreReel.parId[r.atomes.mouvement].mouvement.profil, registreReel.parId[s.mouvement].mouvement.profil), null);
    soeurs.push(r.atomes);
  }
});

test('tirage : la garde de beauté et un fond vidéo sans vidéo sont refusés, avec la raison la plus fréquente', () => {
  const r = tirerMelange({ registre: registreReel, imposes: { mouvement: 'lesaintgeorges' }, client: profilClient(), rng: mulberry32(2) });
  assert.match(r.erreur, /vidéo/);
  const ok = tirerMelange({ registre: registreReel, imposes: { mouvement: 'lesaintgeorges' }, client: profilClient({ video: 'client' }), familles: ['typographique'], rng: mulberry32(2) });
  assert.equal(ok.erreur, undefined, ok.erreur);
});

test('client : origine de la vidéo (jamais une vidéo de banque comptée comme la sienne) et ton des photos', async () => {
  const { origineVideo, tonDeMoyennes, tonMedian } = await import('../scripts/ff/melanger.mjs');
  assert.equal(origineVideo({}), null);
  assert.equal(origineVideo({ videosRaw: true }), 'client');
  assert.equal(origineVideo({ videosPub: true, credits: '## public/videos/hero (Jane)\n- Source : Pexels Videos — https://pexels.com/video/1' }), 'banque');
  assert.equal(origineVideo({ videosPub: true, credits: '## animation\n- ff animer, fal.ai' }), 'animer');
  assert.equal(origineVideo({ declaree: 'animer' }), 'animer');
  const t = tonDeMoyennes([137, 114, 88]);
  assert.ok(Math.abs(t.clarte - 50) < 2 && t.chaleur === 49);
  assert.deepEqual(tonMedian([{ clarte: 40, chaleur: 10 }, { clarte: 50, chaleur: 30 }, { clarte: 60, chaleur: 20 }]), { clarte: 50, chaleur: 20 });
  assert.equal(tonMedian([]), null);
});

/* ---------- Diversité des pistes sœurs (essai du 21 oct 2026 : trois palettes blanc / gris / noir) ---------- */

const palR = (p) => ({ principal: p.fond && /^#[0-3]/.test(p.fond) ? 'sombre' : 'clair', clair: p, sombre: p });

test('régimes : neutre, teinté, sombre, coloré doux (fond modéré, surface, bloc d’encre, deux accents assumés)', async () => {
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  assert.equal(regimePalette(palR({ fond: '#ffffff', accent: '#c72531' })).regime, 'clair-neutre');
  assert.equal(regimePalette(palR({ fond: '#f4ecdc', accent: '#c72531' })).regime, 'clair-teinte');
  assert.equal(regimePalette(palR({ fond: '#14161c', accent: '#d9a441' })).regime, 'sombre');
  assert.equal(regimePalette(palR({ fond: '#dcecc8', accent: '#2f5d3a' })).regime, 'colore-doux', 'fond sauge, sous la garde B1');
  assert.equal(regimePalette(palR({ fond: '#ffffff', surface: '#c0deee', accent: '#c72531' })).regime, 'colore-doux');
  assert.equal(regimePalette(palR({ fond: '#ffffff', encre: '#1e305e', accent: '#c72531' })).regime, 'colore-doux');
  assert.equal(regimePalette(palR({ fond: '#ffffff', accent: '#000aa0', accent2: '#ffc600' })).regime, 'colore-doux');
  assert.equal(regimePalette(palR({ fond: '#ffffff', accent: '#000000' })).teinte, null, 'accent noir : pas de teinte');
  // Registre réel.
  const r = (id) => regimePalette(registreReel.parId[id].couleurs).regime;
  assert.equal(r('artek'), 'clair-neutre'); // bonpoint, l'exemple d'origine, a été retiré du registre le 22 oct au soir
  assert.equal(r('meyers'), 'clair-teinte');
  assert.equal(r('standardhotels'), 'sombre');
  assert.equal(r('pizza-amici'), 'colore-doux');
});

test('diversité : même régime, fond de clarté proche, accent proche refusés ; niveaux relâchés dans l’ordre', async () => {
  const { refusDiversite, NIVEAUX_DIVERSITE } = await import('../scripts/ff/melanger.mjs');
  const blanc = palR({ fond: '#ffffff', accent: '#c72531' });
  assert.match(refusDiversite(palR({ fond: '#fdfdfd', accent: '#0f2c56' }), [blanc]), /clarté proche/);
  assert.match(refusDiversite(palR({ fond: '#e8e8e8', accent: '#0f2c56' }), [blanc]), /même régime/);
  assert.equal(refusDiversite(palR({ fond: '#e8e8e8', accent: '#0f2c56' }), [blanc], NIVEAUX_DIVERSITE[2]), null, 'régime répété permis au niveau 3');
  assert.match(refusDiversite(palR({ fond: '#14161c', accent: '#d2362f' }), [blanc]), /accent proche/);
  assert.equal(refusDiversite(palR({ fond: '#14161c', accent: '#d2362f' }), [blanc], NIVEAUX_DIVERSITE[1]), null);
  assert.equal(refusDiversite(palR({ fond: '#14161c', accent: '#d9a441' }), [blanc]), null);
  // La clarté des fonds ne se relâche à aucun niveau.
  for (const n of NIVEAUX_DIVERSITE) assert.match(refusDiversite(palR({ fond: '#fefefe', accent: '#0f2c56' }), [blanc], n), /clarté proche/);
  // Deux accents neutres (noirs) sont trop proches.
  assert.match(refusDiversite(palR({ fond: '#14161c', accent: '#ffffff' }), [palR({ fond: '#ffffff', accent: '#000000' })]), /accent proche/);
});

test('registre réel : trois pistes sœurs = trois régimes, fonds éloignés, accents éloignés, garde de beauté intacte', async () => {
  const { regimePalette, refusPalette, NIVEAUX_DIVERSITE, DIVERSITE } = await import('../scripts/ff/melanger.mjs');
  const { ecartTeinte } = await import('../scripts/ff/atomes.mjs');
  // Comme L'Épi d'Or : photos sombres et chaudes, assez larges, client « vivant ».
  const client = profilClient({ photos: 10, largeurMax: 4000, avis: 162, tonPhotos: { clarte: 48, chaleur: 38 } });
  for (const graine of [1, 7, 218700777]) {
    const rng = mulberry32(graine);
    const soeurs = [];
    for (let k = 0; k < 3; k++) {
      const r = tirerMelange({ registre: registreReel, soeurs, familles: ['typographique', 'objet-du-metier', 'carte-sur-photo', 'plan-et-lieu'], client, rng });
      assert.equal(r.erreur, undefined, r.erreur);
      if (k) assert.equal(r.diversite, NIVEAUX_DIVERSITE[0].nom, `graine ${graine}, piste ${k + 1}`);
      soeurs.push(r.atomes);
    }
    const regs = soeurs.map((s) => regimePalette(registreReel.parId[s.couleurs].couleurs));
    assert.equal(new Set(regs.map((x) => x.regime)).size, 3, `régimes ${regs.map((x) => x.regime)}`);
    for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) {
      assert.ok(Math.abs(regs[i].fond.l - regs[j].fond.l) >= DIVERSITE.ECART_FOND_L);
      if (regs[i].teinte != null && regs[j].teinte != null) assert.ok(ecartTeinte(regs[i].teinte, regs[j].teinte) >= DIVERSITE.ECART_ACCENT);
    }
    for (const s of soeurs) assert.deepEqual(refusPalette(registreReel.parId[s.couleurs].couleurs), []);
  }
});

test('tirage : les régimes sont tirés à parts égales (les neutres clairs, majoritaires au registre, ne dominent plus)', async () => {
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  const rng = mulberry32(5);
  const n = {};
  for (let k = 0; k < 120; k++) {
    const r = tirerMelange({ registre: registreReel, familles: ['typographique'], client: profilClient({ photos: 10, largeurMax: 4000 }), rng });
    assert.equal(r.erreur, undefined, r.erreur);
    const g = regimePalette(registreReel.parId[r.atomes.couleurs].couleurs).regime;
    n[g] = (n[g] || 0) + 1;
  }
  assert.ok((n['clair-neutre'] || 0) < 60, `neutres clairs : ${n['clair-neutre']} sur 120`);
  assert.equal(Object.keys(n).length, 4, JSON.stringify(n));
});

test('registre pauvre (tout neutre clair) : le tirage relâche le régime sans échouer, et le dit', () => {
  const reg = fauxRegistre(6);
  // Fonds gris sans teinte, de clartés éloignées : un seul régime au registre.
  ['#ffffff', '#ececec', '#dcdcdc', '#cfcfcf', '#f6f6f6', '#e4e4e4'].forEach((fond, i) => { reg.parId[`s${i}`].couleurs.clair.fond = fond; });
  const rng = mulberry32(3);
  const soeurs = [], niveaux = [];
  for (let k = 0; k < 3; k++) {
    const r = tirerMelange({ registre: reg, soeurs, familles: ['typographique', 'outil', 'editorial'], rng });
    assert.equal(r.erreur, undefined, r.erreur);
    soeurs.push(r.atomes); niveaux.push(r.diversite);
  }
  assert.equal(niveaux[0], null);
  assert.match(niveaux[1], /régime répété/);
});

test('régimes : compte du registre, besoins de collecte, bloc du journal de veille idempotent', async () => {
  const { compterRegimes, besoinsRegimes, noterBesoinsJournal } = await import('../scripts/ff/melanger.mjs');
  const c = compterRegimes(registreReel);
  assert.equal(Object.values(c).reduce((a, b) => a + b, 0), registreReel.reserves.couleurs.length);
  const b = besoinsRegimes({ 'clair-neutre': 40, 'clair-teinte': 10, sombre: 0, 'colore-doux': 9 });
  assert.deepEqual(b.map((x) => x.regime), ['sombre']);
  assert.match(b[0].phrase, /la collecte doit ramener des palettes sombre/);
  const journal = '# Journal de veille\n\nIntro.\n\n## 19 oct 2026, tour 4\n\nFait.\n';
  const j1 = noterBesoinsJournal(journal, [b[0].phrase], '2026-10-21');
  assert.ok(j1.indexOf('palettes sombre') < j1.indexOf('## 19 oct'));
  assert.equal(noterBesoinsJournal(j1, [b[0].phrase], '2026-10-21'), j1, 'idempotent');
  assert.equal(noterBesoinsJournal(j1, [], '2026-10-22'), journal, 'sans besoin, le bloc part');
});

test('architectures : seulement celles que l’usine sait construire ; --architecture non codée = erreur claire', async () => {
  const { architecturesImplementees, architecturesTirables, refusArchitectureImposee } = await import('../scripts/ff/melanger.mjs');
  const parId = { a: { layout: { shell: 'carte' } }, b: { layout: { shell: 'panneaux' } }, c: { layout: { shell: 'flow' } } };
  const { implementees, incompletes } = architecturesImplementees({ ids: ['a', 'b', 'c'], parId, coquilles: ['carte', 'flow'] });
  assert.deepEqual(implementees, ['a', 'c']);
  assert.match(incompletes[0].raison, /panneaux absente/);
  const t = architecturesTirables({ implementees, interdites: new Map([['a', 'piste sœur x-b']]), manquantes: (id) => (id === 'c' ? ['15 réalisations'] : []) });
  assert.deepEqual(t.libres, []);
  assert.deepEqual(t.ecartees.map((e) => e.id), ['a', 'c']);
  assert.equal(refusArchitectureImposee('a', implementees), null);
  assert.match(refusArchitectureImposee('panneaux-tranche', implementees, ['panneaux-tranche']), /non implémentée.*« à coder »/);
  assert.match(refusArchitectureImposee('zzz', implementees, []), /id inconnu/);
  // Registre réel de l'usine : chaque architecture implémentée a sa coquille.
  const { loadArchitecturesModule, cleanTmp } = await import('../scripts/ff/ts-loader.mjs');
  try {
    const A = await loadArchitecturesModule();
    const coquilles = fs.readdirSync(path.join(ROOT, 'src/shells')).map((f) => f.replace(/\.astro$/, ''));
    const r = architecturesImplementees({ ids: [...A.ARCHITECTURE_IDS], parId: A.ARCHITECTURES, coquilles });
    for (const id of r.implementees) assert.ok(fs.existsSync(path.join(ROOT, 'src/shells', `${A.ARCHITECTURES[id].layout.shell}.astro`)));
    assert.ok(r.implementees.length >= 4);
  } finally { cleanTmp(); }
});

test('tirage : l’architecture vient de la liste donnée, jamais deux fois entre pistes sœurs ; plus rien = « à choisir »', () => {
  const reg = fauxRegistre(6);
  const rng = mulberry32(3);
  const soeurs = [];
  for (let k = 0; k < 3; k++) {
    const r = tirerMelange({ registre: reg, soeurs, familles: ['typographique', 'outil', 'editorial'], architectures: ['carte-de-visite', 'accueil-portes'], rng });
    assert.equal(r.erreur, undefined, r.erreur);
    soeurs.push(r.atomes);
  }
  assert.deepEqual(soeurs.slice(0, 2).map((s) => s.architecture).sort(), ['accueil-portes', 'carte-de-visite']);
  assert.equal(soeurs[2].architecture, null);
});

test('essai : layout de la copie = architecture complète + hero de la famille si l’usine sait le rendre', async () => {
  const { layoutEssai, verifierCopie } = await import('../scripts/ff/melanger.mjs');
  const archi = { layout: { shell: 'flow', nav: 'split', hero: 'stacked', footer: 'columns', sections: [{ type: 'services', variant: 'portes' }], contactDrawer: true } };
  const a = layoutEssai({ architecture: 'accueil-portes', archi, famille: 'typographique' });
  assert.equal(a.layout.architecture, 'accueil-portes');
  assert.equal(a.layout.shell, 'flow');
  assert.deepEqual(a.layout.sections, [{ type: 'services', variant: 'portes' }]);
  assert.equal(a.layout.hero, 'typographic', 'la famille prime sur le hero de l’architecture');
  const carte = layoutEssai({ architecture: 'carte-de-visite', archi: { layout: { shell: 'carte', hero: 'fullbleed', sections: [] } }, famille: 'diptyque', heroRendu: (s) => s !== 'carte' });
  assert.equal(carte.layout.hero, 'fullbleed');
  assert.equal(carte.hero, null);
  assert.match(carte.notes.join(' '), /dessine son propre premier écran/);
  const sans = layoutEssai({ famille: 'mosaique', shellSite: 'flow' });
  assert.deepEqual(sans.layout, {});
  assert.match(sans.notes.join(' '), /déroulé du site gardé.*pas de hero partagé/);
  assert.equal(layoutEssai({ famille: 'video-ou-sequence' }).hero, null, 'pas de hero vidéo sans vraie vidéo');
  assert.equal(layoutEssai({ famille: 'video-ou-sequence', client: profilClient({ video: 'client' }) }).hero, 'video');
  assert.deepEqual(verifierCopie('<html lang="fr" data-direction="m-1" data-shell="carte">', { direction: 'm-1', shell: 'carte' }), []);
  assert.equal(verifierCopie('<html data-direction="atelier" data-shell="flow">', { direction: 'm-1', shell: 'carte' }).length, 2);
});

test('--n 3 refait toutes les pistes : les prises des anciennes pistes sœurs se libèrent, pas celles des sites récents', async () => {
  const { retirerPistesSoeurs } = await import('../scripts/ff/melanger.mjs');
  const m = new Map([['lieu-fixe', 'piste sœur prospect-epi-dor-b'], ['index-projets', 'site récent prospect-a-coeur-bois']]);
  assert.deepEqual([...retirerPistesSoeurs(m).keys()], ['index-projets']);
});

test('interlignage du titre : plancher 1,1 en capitales (accents français), 1 sinon, plafond 1,5', async () => {
  const { interlignageTitre } = await import('../scripts/ff/melanger.mjs');
  assert.equal(interlignageTitre(1.0, 'uppercase'), 1.1, 'her, essai du 23 oct 2026 : « DEUXIÈME » touchait la ligne du dessus');
  assert.equal(interlignageTitre(0.78, 'uppercase'), 1.1, 'salo, essai du 18 oct 2026');
  assert.equal(interlignageTitre(0.89, 'none'), 1);
  assert.equal(interlignageTitre(1.3, 'uppercase'), 1.3);
  assert.equal(interlignageTitre(2, 'none'), 1.3);
  assert.equal(interlignageTitre(1.5, 'none'), 1.3, 'androuet, essai du 25 oct 2026 : trou entre les lignes du h1');
  assert.equal(interlignageTitre('à juger', 'none'), 1.05);
});

test('casse du titre : jamais la casse de titre anglaise en français (blenheim, essai du 24 oct 2026)', async () => {
  const { casseTitre } = await import('../scripts/ff/melanger.mjs');
  assert.equal(casseTitre('capitalize'), 'none', '« Le Pain Du Matin, Et Une Deuxième Fournée »');
  assert.equal(casseTitre('uppercase'), 'uppercase');
  assert.equal(casseTitre('à juger'), 'none');
  assert.equal(casseTitre(undefined), 'none');
});

test('interlettrage du titre : capitales plafonnées à 0,06 em (hiut, lyles, wolseley, essais du 24 oct 2026)', async () => {
  const { interlettrageTitre } = await import('../scripts/ff/melanger.mjs');
  assert.equal(interlettrageTitre(0.15, 'uppercase'), 0.06, 'hiut : h1 cassé en six lignes');
  assert.equal(interlettrageTitre(0.04, 'uppercase'), 0.04);
  assert.equal(interlettrageTitre(-0.02, 'uppercase'), 0);
  assert.equal(interlettrageTitre(-0.03, 'none'), -0.03);
  assert.equal(interlettrageTitre(0.1, 'none'), 0.02);
  assert.equal(interlettrageTitre('à juger', 'none'), -0.01);
});

test('casse du h1 : un style en capitales garde ses h2 en capitales, le h1 d\'une phrase repasse en casse normale (essais du 26 oct 2026)', async () => {
  const { casseH1, genererDirection } = await import('../scripts/ff/melanger.mjs');
  assert.equal(casseH1('uppercase'), 'none', 'thepalomar : h1 en six lignes de capitales larges');
  assert.equal(casseH1('none'), 'none');
  assert.equal(casseH1('capitalize'), 'none');
  assert.equal(typeof genererDirection, 'function');
});

test('échelle du h2 : jamais plus grand que le h1 ni lu comme du texte (essais du 26 oct 2026, soir)', async () => {
  const { echelleH2 } = await import('../scripts/ff/melanger.mjs');
  // handsomebrook (m-bc0514) : h2 = h1 = 96,8 px à l'ordinateur, 48 au téléphone.
  assert.equal(echelleH2(96.8, 96.8, 23.6), 72.6, 'handsomebrook ordinateur : ramené à 0,75 h1');
  assert.equal(echelleH2(48, 48, 18), 36, 'handsomebrook téléphone');
  // eastfork (m-cdbbd5) et ennismore (m-d11c9b) : h2 de 16 à 18 px pour un texte de 16.
  assert.equal(echelleH2(38, 18, 16), 21.3, 'eastfork : relevé à 1,33 fois le texte');
  assert.equal(echelleH2(120, 16, 16), 21.3, 'ennismore');
  // Un h2 déjà dans la plage reste tel quel ; si h1 et texte se croisent, le plancher gagne.
  assert.equal(echelleH2(96, 40, 16), 40);
  assert.equal(echelleH2(22, 30, 18), 23.9);
});

test('familles rendues (29 oct 2026) : chaque famille dont le client a les données pose son hero dans le layout', async () => {
  const { layoutEssai, heroDeFamille, HERO_DE_FAMILLE } = await import('../scripts/ff/melanger.mjs');
  const riche = profilClient({ photos: 10, largeurMax: 2400, couverture: true, photosSite: 8, avis: 120, temoignages: 3, horaires: 4, adresse: true, urgence: true });
  const attendu = { 'carte-sur-photo': 'carte-sur-photo', mosaique: 'mosaique', editorial: 'editorial', 'numero-geant': 'numero-geant', 'preuve-d-abord': 'preuve-d-abord', 'plan-et-lieu': 'plan-et-lieu', typographique: 'typographic', diptyque: 'split' };
  for (const [famille, hero] of Object.entries(attendu)) {
    assert.equal(layoutEssai({ famille, client: riche }).layout.hero, hero, famille);
    assert.equal(heroDeFamille({ famille, client: riche }).hero, hero, famille);
  }
  assert.ok(Object.keys(HERO_DE_FAMILLE).length >= 9, 'neuf familles sur treize ont un hero partagé');
  const pauvre = profilClient({ photos: 2, largeurMax: 1200 });
  for (const f of ['carte-sur-photo', 'mosaique', 'numero-geant', 'preuve-d-abord', 'plan-et-lieu']) {
    const r = layoutEssai({ famille: f, client: pauvre });
    assert.equal(r.hero, null, `${f} sans ses données`);
    assert.match(r.notes.join(' '), /avec les données du client/);
  }
});
