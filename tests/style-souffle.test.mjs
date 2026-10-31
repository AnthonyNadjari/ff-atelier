// Style construit « souffle » (veille du 30 oct 2026, tour 19, volet 2a quater, source tavolini.com, fiche
// docs/veille/styles/souffle.md) : la construction relevée est codée (photo de l'objet et texte à gauche, texte sous la photo
// au téléphone, séries verticales légendées, preuve sur le sapin, lettre sur la menthe, plaque menthe dans la bande sapin,
// bandeau menthe, modèle de site entier), régime sombre.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');
const SECTIONS = ['Hero', 'Services', 'Proof', 'About', 'Contact', 'Footer'];

test('Hero/souffle : photo puis texte sur le sapin au téléphone, texte posé à gauche à l’ordinateur, deux portes, métier à la ville', () => {
  const src = sansCommentaires(lire('src/sections/Hero/souffle.astro'));
  assert.match(src, /\{hero && \(/);
  assert.match(src, /md:col-span-7 md:col-start-6/, 'à l’ordinateur, la pièce en grand à droite du texte');
  assert.match(src, /aspect-ratio: 1 \/ 1/, 'au téléphone, la pièce entière en carré, puis le texte');
  assert.match(src, /set:html=\{site\.business\.tagline\}/);
  assert.match(src, /metierEtVille\(\)/);
  assert.match(src, /hasContactDoor\(site\)/, 'Devis seulement s’il y a une porte de contact, sinon Appeler');
  assert.doesNotMatch(src, /data-split|data-parallax|autoplay|@keyframes/, 'immobile, comme la source');
});

test('Services/souffle : séries en photos verticales légendées, liens vers les pages, approche au survol avec pointeur fin', () => {
  const src = sansCommentaires(lire('src/sections/Services/souffle.astro'));
  assert.match(src, /id="services"/);
  assert.match(src, /class="sr-only" title=\{site\.wording\.servicesTitle\}/, 'titre dit aux lecteurs d’écran, pas affiché (comme la source)');
  assert.match(src, /aspect-ratio: 3 \/ 4/);
  assert.match(src, /\{s\.image \? \(/, 'sans photo, une case de couleur au nom, jamais une photo de banque');
  assert.match(src, /\{s\.priceFrom && /);
  assert.match(src, /@media \(any-pointer: fine\) and \(prefers-reduced-motion: no-preference\)/);
  assert.match(src, /scale\(1\.045\)/);
  assert.doesNotMatch(src, /<script|data-scrub|data-pin/);
});

test('Proof/souffle : logos seulement avec image, avis recopiés, rien sans preuve', () => {
  const src = sansCommentaires(lire('src/sections/Proof/souffle.astro'));
  assert.match(src, /id="proof"/);
  assert.match(src, /logos\.filter\(\(l\) => l\.image\)/);
  assert.match(src, /\{\(logos\.length > 0 \|\| avis\.length > 0 \|\| google\) && \(/);
  assert.doesNotMatch(src, /★|<Icon\b/);
});

test('About/souffle : la lettre sur la menthe, photo du client seulement', () => {
  const src = sansCommentaires(lire('src/sections/About/souffle.astro'));
  assert.match(src, /id="about"/);
  assert.match(src, /\{photo && \(/);
  assert.match(src, /var\(--menthe\)/);
});

test('Contact/souffle : plaque menthe dans la bande sapin, bandeau menthe au formulaire, chaque ligne sans donnée disparaît', () => {
  const src = sansCommentaires(lire('src/sections/Contact/souffle.astro'));
  assert.match(src, /id="contact"/);
  assert.match(src, /href=\{tel\(\)\}/);
  assert.doesNotMatch(src, /ContactForm/, 'bandeau court, sans formulaire générique');
  assert.match(src, /site\.wording\.devis/, 'la porte Devis en titre du bandeau');
  assert.match(src, /\{photo && \(/);
  assert.match(src, /\{site\.contact\.email && /);
});

test('Footer/souffle : pied allégé, sans horaires en tableau ni icônes', () => {
  const src = sansCommentaires(lire('src/sections/Footer/souffle.astro'));
  assert.match(src, /bg-ink text-on-ink/);
  assert.match(src, /\/mentions-legales/);
  assert.doesNotMatch(src, /Horaires|<Icon\b|hours/);
});

test('sections souffle : tokens seulement, ni pilule, ni tiret cadratin, ni point médian', () => {
  for (const t of SECTIONS) {
    const src = sansCommentaires(lire(`src/sections/${t}/souffle.astro`));
    assert.doesNotMatch(src, /#[0-9a-f]{3,6}\b(?![^<]*\})/i, `${t} : couleur en dur`);
    assert.doesNotMatch(src, /rounded-full|999px|·|—/, t);
  }
});

test('presets/souffle.json : modèle de site entier, fin de page de la source, pas de barre basse ; deuxième modèle différent', () => {
  const m = JSON.parse(lire('presets/souffle.json'));
  assert.equal(m.nom, 'souffle');
  assert.equal(m.look.direction, 'souffle');
  assert.equal(m.look.layout.hero, 'souffle');
  assert.equal(m.look.layout.nav, 'split', 'nom centré, porte Appeler');
  assert.deepEqual(m.look.layout.sections.map((x) => `${x.type}/${x.variant}`), ['services/souffle', 'proof/souffle', 'about/souffle', 'contact/souffle']);
  for (const t of ['zones', 'faq', 'cta']) assert.ok(!m.look.layout.sections.some((x) => x.type === t), `pas de ${t}`);
  assert.equal(m.look.layout.actionBar, false);
  assert.equal(m.look.layout.footer, 'souffle', 'pied sapin allégé');
  const b = JSON.parse(lire('presets/souffle-ebeniste.json'));
  assert.equal(b.look.direction, 'souffle');
  assert.notEqual(b.look.layout.hero, 'souffle');
});

test('direction souffle : EB Garamond (pour Cormorant) et Karla hors liste IA, sapin (sombre), courbe vraie', async () => {
  const css = lire('src/directions/souffle/index.css');
  const { POLICES_IA } = await import('../scripts/ff/ia.mjs');
  for (const fam of [...css.matchAll(/--font-(?:display|body|mono):\s*'([^']+)'/g)].map((x) => x[1])) {
    assert.ok(['EB Garamond Variable', 'Karla Variable'].includes(fam), fam);
    assert.ok(!POLICES_IA.some((p) => fam.toLowerCase().startsWith(p)), fam);
  }
  assert.match(css, /--bg: #12372c;/);
  assert.match(css, /--menthe: #ebfff4;/);
  assert.match(css, /--ease-brand: cubic-bezier\(/);
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  const atome = JSON.parse(lire('docs/veille/styles/atomes/souffle.json'));
  assert.equal(regimePalette(atome.couleurs).regime, 'sombre');
  assert.equal(atome.mouvement.profil, 'photo-qui-s-approche');
});
