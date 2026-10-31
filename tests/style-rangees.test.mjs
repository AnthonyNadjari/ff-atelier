// Style construit « rangees » (veille du 31 oct 2026, tour 21, volet 2a quater, source officecommun.com, fiche
// docs/veille/styles/rangees.md) : la construction relevée est codée (barre nue, deux courts paragraphes en colonne
// étroite sans titre géant, une rangée par réalisation : « nom, lieu » en petit puis une piste bord à bord de photos à
// hauteur constante et de largeurs variées tirée à la main, son fil ; avis en rangée de cases ; contact à filets), modèle
// de site entier, profil de mouvement, clair neutre.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');
const { rangeesDuSite, gabaritsDeRangee, prestationsCitees, photoDeLaPrestation, RAPPORTS, MOTIFS } = await import(
  pathToFileURL(path.join(ROOT, 'src/lib/rangees.ts')).href
);

const photo = (n, extra = {}) => ({ src: `/images/${n}.webp`, alt: n, ...extra });
const base = {
  realisations: [],
  services: [
    { slug: 'cuisines', title: 'Cuisines en chêne', short: 'Dessinées pour votre pièce.', image: photo('cuisine') },
    { slug: 'escaliers', title: 'Escaliers', short: 'Droits ou tournants.' },
  ],
  proof: { gallery: [photo('g1', { kind: 'Cuisine' }), photo('g2', { kind: 'Escalier' }), photo('g3', { kind: 'Porte' }), photo('cuisine', { kind: 'Cuisine' })] },
};

test('rangeesDuSite : une rangée par réalisation (titre, lieu, photos, page) avant tout le reste', () => {
  const r = rangeesDuSite({
    ...base,
    realisations: [
      { slug: 'cuisine-annecy', title: 'Cuisine en chêne', place: 'Annecy-le-Vieux', kind: 'Cuisine', photos: [photo('a'), photo('b')] },
      { slug: 'escalier', title: 'Escalier suspendu', kind: 'Escalier', photos: [photo('c')] },
    ],
  });
  assert.deepEqual(r.map((x) => x.titre), ['Cuisine en chêne', 'Escalier suspendu']);
  assert.equal(r[0].detail, 'Annecy-le-Vieux', 'le lieu en gris');
  assert.equal(r[1].detail, 'Escalier', 'sans lieu, le type');
  assert.equal(r[0].href, '/realisations/cuisine-annecy');
  assert.deepEqual(r[0].photos.map((p) => p.src), ['/images/a.webp', '/images/b.webp']);
});

test('rangeesDuSite : sans réalisation, une rangée par prestation (sa photo puis la galerie dont le type la nomme, sans doublon)', () => {
  const r = rangeesDuSite(base);
  assert.deepEqual(r.map((x) => x.href), ['/services/cuisines', '/services/escaliers']);
  assert.deepEqual(r[0].photos.map((p) => p.src), ['/images/cuisine.webp', '/images/g1.webp']);
  assert.deepEqual(r[1].photos.map((p) => p.src), ['/images/g2.webp']);
  assert.equal(r[0].detail, 'Dessinées pour votre pièce.');
  assert.equal(photoDeLaPrestation('Porte', base.services[0]), false);
  assert.equal(photoDeLaPrestation(undefined, base.services[0]), false);
});

test('rangeesDuSite : sans prestation, la galerie par type ; sans rien, aucune rangée', () => {
  const r = rangeesDuSite({ ...base, services: [] });
  assert.deepEqual(r.map((x) => x.titre), ['Cuisine', 'Escalier', 'Porte']);
  assert.equal(r[0].href, undefined, 'pas de page inventée');
  assert.deepEqual(rangeesDuSite({ realisations: [], services: [], proof: { gallery: [] } }), []);
});

test('gabaritsDeRangee : la grande vaut deux carrées et l’écart, le motif change d’une rangée à l’autre, le format réel compte', () => {
  assert.ok(Math.abs(RAPPORTS.grande - 2 * RAPPORTS.carree) < 1e-9, '16:9 = deux 8:9');
  assert.ok(RAPPORTS.etroite < RAPPORTS.carree);
  const six = Array(6).fill(undefined);
  const a = gabaritsDeRangee(six, 0);
  const b = gabaritsDeRangee(six, 1);
  assert.notDeepEqual(a, b, 'deux rangées voisines n’ont pas le même motif');
  assert.equal(new Set(a).size, 3, 'trois largeurs dans une rangée');
  for (const m of MOTIFS) assert.ok(m.includes('grande') && m.includes('carree') && m.includes('etroite'));
  assert.equal(gabaritsDeRangee([0.66], 0)[0], 'etroite', 'une photo debout n’est jamais grande');
  assert.equal(gabaritsDeRangee([1.5, 2.4], 2)[1], 'grande', 'un panorama n’est jamais étroit');
});

test('prestationsCitees : « A, B et C », liens vers les pages de service', () => {
  const c = prestationsCitees([{ slug: 'a', title: 'Cuisines' }, { slug: 'b', title: 'Escaliers' }, { slug: 'c', title: 'Portes <em>anciennes</em>' }]);
  assert.equal(c.map((x) => x.texte + x.sep).join(''), 'Cuisines, Escaliers et Portes anciennes');
  assert.equal(c[2].href, '/services/c');
  assert.deepEqual(prestationsCitees([]), []);
});

test('RangeeDePhotos et le script : hauteur constante, largeurs variées, tirée à la main, fil, jamais d’autoplay ni d’aimant', () => {
  const src = sansCommentaires(lire('src/components/RangeeDePhotos.astro'));
  assert.match(src, /height: var\(--rg-h/);
  assert.match(src, /aspect-ratio: var\(--ar/);
  assert.match(src, /gabaritsDeRangee\(rapports, index\)/);
  assert.match(src, /overflow-x: auto/);
  assert.match(src, /cursor: grab/);
  assert.match(src, /tabindex="0"/, 'piste atteignable au clavier');
  assert.match(src, /data-rangee-fil/);
  assert.doesNotMatch(src, /scroll-snap-type/, 'la rangée s’arrête où on la lâche');
  assert.match(src, /flex: var\(--ar, 1\.7778\) 0 auto/, 'une rangée courte s’élargit jusqu’au bord droit, à hauteur égale');
  assert.match(src, /prefers-reduced-motion: reduce/);
  const js = sansCommentaires(lire('src/scripts/rangees.ts'));
  assert.match(js, /pointerType !== 'mouse'/, 'le tirage à la souris seulement, le doigt reste natif');
  assert.match(js, /--rg-part/);
  assert.match(js, /--rg-pos/);
  assert.match(js, /requestAnimationFrame/);
  assert.match(js, /img\.loading = 'eager'/, 'chargement anticipé des rangées proches de l’écran');
  assert.doesNotMatch(js, /setInterval|autoplay|wheel/, 'rien ne tourne tout seul, la molette n’est jamais détournée');
});

test('Nav/rangees et Hero/rangees : téléphone en haut, pas de photo ni de titre géant, métier à la ville, prestations en liens, portes', () => {
  const nav = sansCommentaires(lire('src/sections/Nav/rangees.astro'));
  assert.match(nav, /href=\{tel\(\)\}/);
  assert.match(nav, />Contact</);
  assert.doesNotMatch(nav, /position: sticky/, 'la barre s’en va avec la page');
  const hero = sansCommentaires(lire('src/sections/Hero/rangees.astro'));
  assert.match(hero, /set:html=\{site\.business\.tagline\}/);
  assert.match(hero, /metierEtVille\(\)/);
  assert.match(hero, /depuis \$\{site\.business\.since\}/);
  assert.match(hero, /prestationsCitees\(/);
  assert.match(hero, /href=\{tel\(\)\}/);
  assert.match(hero, /actions\(\)/, 'une porte par intention');
  assert.doesNotMatch(hero, /<Img\b|images\.hero/, 'pas de photo au premier écran');
  const h1 = /\.rg-h1 \{[^}]*font-size: clamp\(([\d.]+)rem, [^,]+, ([\d.]+)rem\)/.exec(hero);
  assert.ok(h1 && Number(h1[2]) <= 2, 'h1 en grand corps, jamais géant');
});

test('Services, Proof, About, Contact rangees : rien d’inventé, pas de point médian, chaque bloc disparaît sans sa donnée', () => {
  const services = sansCommentaires(lire('src/sections/Services/rangees.astro'));
  assert.match(services, /id="services"/);
  assert.match(services, /rangeesDuSite\(site\)/);
  assert.match(services, /<RangeeDePhotos /);
  assert.match(services, /\{rangees\.length > 0 && \(/);
  assert.match(services, /i === rangAvis && avisIci && /, 'les avis en troisième rangée quand le site n’a pas de section proof');
  assert.match(services, /atelierIci && /, 'l’atelier en dernière rangée quand le site n’a pas de section about');
  const proof = sansCommentaires(lire('src/components/AvisEnRangee.astro'));
  assert.match(proof, /\{\(avis\.length > 0 \|\| google\) && \(/);
  assert.match(proof, /data-rangee-piste/);
  assert.doesNotMatch(proof, /★|<Icon\b/);
  assert.match(lire('src/sections/Proof/rangees.astro'), /<AvisEnRangee niveau="h2" \/>/);
  const about = sansCommentaires(lire('src/components/AtelierEnRangee.astro'));
  assert.match(about, /\{photos\.length > 0 && \(/);
  assert.match(lire('src/sections/About/rangees.astro'), /id="about"/);
  const contact = sansCommentaires(lire('src/sections/Contact/rangees.astro'));
  assert.match(contact, /id="contact"/);
  assert.match(contact, /href=\{tel\(\)\}/);
  assert.match(contact, /\{c\.email && /);
  assert.match(contact, /<ContactForm /);
  for (const f of ['Nav', 'Hero', 'Services', 'Proof', 'About', 'Contact']) {
    assert.doesNotMatch(lire(`src/sections/${f}/rangees.astro`).replace(/\/\*[\s\S]*?\*\//g, ''), /·|—/, `${f} : ni point médian ni tiret cadratin`);
  }
});

test('presets/rangees.json : modèle de site entier sans bandeau d’appel, questions ni barre basse ; second modèle différent', () => {
  const m = JSON.parse(lire('presets/rangees.json'));
  assert.equal(m.nom, 'rangees');
  assert.equal(m.look.direction, 'rangees');
  assert.equal(m.look.layout.nav, 'rangees');
  assert.equal(m.look.layout.hero, 'rangees');
  assert.deepEqual(m.look.layout.sections.map((x) => `${x.type}/${x.variant}`), ['services/rangees'], 'l’accueil est l’index, comme la source');
  assert.equal(m.look.layout.contactDrawer, true, 'le contact est la vue « Contact » de la source, en tiroir');
  assert.equal(m.look.layout.actionBar, false);
  const b = JSON.parse(lire('presets/rangees-menuisier.json'));
  assert.equal(b.look.direction, 'rangees');
  assert.notEqual(b.look.layout.hero, 'rangees');
  assert.notEqual(b.look.layout.nav, 'rangees');
});

test('direction rangees : Onest hors liste IA, angles droits, aucune ombre, clair neutre, gris lisible', async () => {
  const css = lire('src/directions/rangees/index.css');
  const { POLICES_IA, estPoliceIa } = await import('../scripts/ff/ia.mjs');
  for (const fam of [...css.matchAll(/--font-(?:display|body|mono):\s*'([^']+)'/g)].map((x) => x[1])) {
    assert.equal(fam, 'Onest Variable');
    assert.ok(!estPoliceIa(fam) && !POLICES_IA.some((p) => fam.toLowerCase().startsWith(p)), fam);
  }
  assert.match(css, /--radius: 0px;/);
  assert.match(css, /--shadow-card: none;/);
  assert.doesNotMatch(css, /999px|text-transform: uppercase/);
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  const atome = JSON.parse(lire('docs/veille/styles/atomes/rangees.json'));
  assert.equal(regimePalette(atome.couleurs).regime, 'clair-neutre');
  assert.match(css, /--muted: #6b6b6b;/, 'le gris de la source (3,4:1) ramené à l’AA');
});

test('profil de mouvement rangee-tiree-a-la-main : calme, sans exigence, documenté, porté par l’atome', async () => {
  const { PROFILS_MOUVEMENT, refusProfil } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['rangee-tiree-a-la-main'];
  assert.ok(p);
  assert.equal(p.calme, true);
  assert.equal(p.defilement, 'aucun');
  assert.deepEqual(p.exige, {});
  assert.equal(refusProfil('rangee-tiree-a-la-main', { mouvement: 'calme', video: null, largeurMax: 0, avis: 0 }), null);
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `rangee-tiree-a-la-main`/);
  assert.equal(JSON.parse(lire('docs/veille/styles/atomes/rangees.json')).mouvement.profil, 'rangee-tiree-a-la-main');
});
