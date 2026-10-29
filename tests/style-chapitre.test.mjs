// Style construit « chapitre » (veille du 29 oct 2026, tour 18, volet 2a quater, source 23gradicoffee.com, fiche
// docs/veille/styles/chapitre.md) : la construction relevée est codée (règle de chapitre numérotée, nom de bord à bord,
// produit posé sur son nom, questions en rangées, pied-contact, modèle de site entier, profil de mouvement), régime sombre.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '');

test('Chapitre (règle) : numéro lu dans le layout, sur trois chiffres, filet qui se trace, tokens seuls', () => {
  const src = sansCommentaires(lire('src/components/Chapitre.astro'));
  assert.match(src, /site\.layout\.sections\.filter\(\(s\) => s\.variant === 'chapitre'\)/, 'numéro = place parmi les sections chapitre');
  assert.match(src, /padStart\(3, '0'\)/);
  assert.match(src, /data-reveal="wipe"/);
  assert.doesNotMatch(src, /#[0-9a-f]{3,6}\b/i);
});

test('Hero/chapitre : le nom en h1 de bord à bord qui monte une fois, métier et ville, téléphone, photo posée seulement si donnée', () => {
  const src = sansCommentaires(lire('src/sections/Hero/chapitre.astro'));
  assert.match(src, /<h1 class="chapitre-nom-cadre overflow-hidden">/);
  assert.match(src, /site\.business\.trade,\s*site\.contact\.address\.city/, 'métier et ville sous le nom (GOUT § 0)');
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /\{hero && \(/);
  assert.match(src, /chapitre-monte 1s cubic-bezier\(0\.25, 1, 0\.5, 1\)/, 'montée mesurée sur la source');
  assert.match(src, /prefers-reduced-motion/);
  assert.doesNotMatch(src, /autoplay|<video/, 'jamais de vidéo en fond');
});

test('Hero/chapitre (reprise) : photo du lieu en plein cadre sous voile, nom ajusté à toute la largeur, emblème, phrase centrée dessous', () => {
  const src = sansCommentaires(lire('src/sections/Hero/chapitre.astro'));
  assert.match(src, /class="ch-cadre relative isolate flex flex-1/, 'la photo prend le reste de l’écran, de bord à bord');
  assert.match(src, /class="ch-voile absolute inset-0"/);
  assert.match(src, /sizes=\{HERO_SIZES\.chapitre\}/);
  assert.match(lire('src/lib/images.ts'), /chapitre: '100vw'/, 'plein cadre : la photo est servie à la largeur de l’écran');
  assert.match(src, /data-ch-ligne/);
  assert.match(src, /data-ch-mot/);
  assert.match(src, /document\.fonts\?\.ready/, 'ajusté au pixel une fois les polices chargées');
  assert.match(src, /matchMedia\('\(max-width: 47\.99rem\)'\)/, 'téléphone : un mot par ligne, chacun à la largeur');
  assert.match(src, /ch-embleme/);
  assert.match(src, /chapitre-pose 20s/, 'lent mouvement CSS de la photo');
  assert.match(src, /\.chapitre-nom, \.ch-lieu \{ animation: none; \}/, 'rien ne bouge en mouvement réduit');
  // L'ordre de construction qui sépare ce premier écran des « titre sur photo » : nom, photo, puis phrase.
  const iNom = src.indexOf('<h1'), iPhoto = src.indexOf('ch-cadre'), iPhrase = src.indexOf('chapitre-h1 font-mono');
  assert.ok(iNom < iPhoto && iPhoto < iPhrase, 'nom au-dessus de la photo, phrase dessous');
});

test('Filigrane : courbes de niveau au trait en SVG inline, couleur token, sans grain ni halo, derrière about, services et faq', () => {
  const src = sansCommentaires(lire('src/components/Filigrane.astro'));
  assert.match(src, /stroke="currentColor"/);
  assert.match(src, /color: var\(--fg\); opacity: var\(--filigrane, 0\.09\)/);
  assert.match(src, /aria-hidden="true"/);
  assert.doesNotMatch(src, /feTurbulence|radial-gradient|blur\(/, 'ni grain ni halo (GOUT § 1)');
  assert.doesNotMatch(src, /#[0-9a-f]{3,6}\b/i);
  for (const f of ['About', 'Services', 'Faq']) {
    const sec = lire(`src/sections/${f}/chapitre.astro`);
    assert.match(sec, /<Filigrane graine=\{\d\} \/>/, f);
    assert.match(sec, /relative isolate overflow-hidden/, `${f} : le filigrane reste derrière le contenu`);
  }
});

test('About/chapitre : la rangée de photos décalées devient une piste au doigt au téléphone, grande', () => {
  const src = sansCommentaires(lire('src/sections/About/chapitre.astro'));
  assert.match(src, /class="ch-rangee -mx-4 mt-16 flex snap-x snap-mandatory/);
  assert.match(src, /md:grid md:grid-cols-3/);
  assert.match(src, /\.ch-rangee-case \{ width: 80vw; \}/);
  assert.match(src, /tabindex="0"/, 'piste défilable au clavier (axe scrollable-region-focusable)');
});

test('Services/chapitre : objet en profondeur (posé bas, ombre réelle, second plan), produit détouré du client s’il existe, jamais incliné', () => {
  const src = sansCommentaires(lire('src/sections/Services/chapitre.astro'));
  assert.match(src, /site\.produits\.find\(\(p\) => p\.detoure && p\.slug === slug\)/);
  assert.match(src, /ch-objet-detoure/);
  assert.match(src, /drop-shadow\(/);
  assert.match(src, /ch-objet-plan/);
  assert.match(src, /transform: translateY\(12%\)/);
  assert.doesNotMatch(src, /rotate\(/, 'photo rectangulaire inclinée = polaroid (GOUT § 2)');
});

test('Services/chapitre : produit posé sur son nom géant, piste scroll-snap native, flèches et liste à points, rien d’inventé', () => {
  const src = sansCommentaires(lire('src/sections/Services/chapitre.astro'));
  assert.match(src, /snap-x snap-mandatory overflow-x-auto/);
  assert.match(src, /ch-nom-geant/);
  assert.match(src, /\) : s\.image && \(/);
  assert.match(src, /\{s\.priceFrom && /);
  assert.match(src, /\/services\/\$\{s\.slug\}/);
  assert.match(src, /data-ch-prec/);
  assert.match(src, /data-ch-point/);
  assert.match(src, /prefers-reduced-motion: reduce\)'\)\.matches/, 'saut sans glissé en mouvement réduit');
  assert.match(src, /onPage\(/);
});

test('About, Faq, Proof chapitre et pied-contact : données seulement', () => {
  const about = sansCommentaires(lire('src/sections/About/chapitre.astro'));
  assert.match(about, /<Chapitre type="about"/);
  assert.match(about, /valeurs\.length > 0 && \(/);
  assert.match(about, /rangee\.length >= 2 && \(/);
  const faq = sansCommentaires(lire('src/sections/Faq/chapitre.astro'));
  assert.match(faq, /site\.faq\.length > 0 && \(/);
  assert.match(faq, /FAQPage/);
  const proof = sansCommentaires(lire('src/sections/Proof/chapitre.astro'));
  assert.match(proof, /const rien = !google && avis\.length === 0;/);
  const pied = sansCommentaires(lire('src/sections/Footer/chapitre.astro'));
  assert.match(pied, /<footer /);
  assert.match(pied, /href=\{tel\(\)\}/);
  assert.match(pied, /\/mentions-legales/);
  assert.match(pied, /\/services\/\$\{s\.slug\}/, 'les pages des prestations depuis le pied');
  assert.match(pied, /href="\/#contact"/, 'la porte Devis ouvre le tiroir');
  const nav = sansCommentaires(lire('src/sections/Nav/chapitre.astro'));
  assert.match(nav, /href=\{tel\(\)\}/);
});

test('presets/chapitre.json : modèle de site entier fidèle (chapitres 001 à 004, pied-contact en tiroir, sans fin d’usine)', () => {
  const m = JSON.parse(lire('presets/chapitre.json'));
  assert.equal(m.nom, 'chapitre');
  assert.equal(m.look.direction, 'chapitre');
  assert.equal(m.look.layout.hero, 'chapitre');
  assert.equal(m.look.layout.nav, 'chapitre');
  assert.equal(m.look.layout.footer, 'chapitre');
  assert.equal(m.look.layout.contactDrawer, true);
  assert.deepEqual(m.look.layout.sections.map((s) => `${s.type}/${s.variant}`), ['about/chapitre', 'services/chapitre', 'faq/chapitre', 'proof/chapitre']);
});

test('direction chapitre : polices hors liste IA, sombre (color-scheme dark), rayon 0', async () => {
  const css = lire('src/directions/chapitre/index.css');
  const { estPoliceIa } = await import('../scripts/ff/ia.mjs');
  for (const fam of [...css.matchAll(/--font-(?:display|body|mono):\s*'([^']+)'/g)].map((x) => x[1])) assert.ok(!estPoliceIa(fam), fam);
  assert.match(css, /color-scheme: dark;/);
  assert.match(css, /--bg: #133250;/);
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  assert.equal(regimePalette(JSON.parse(lire('docs/veille/styles/atomes/chapitre.json')).couleurs).regime, 'sombre');
});

test('profil de mouvement chapitre-qui-s-ouvre : calme, documenté, distinct de filet-qui-se-trace', async () => {
  const { PROFILS_MOUVEMENT, profilsTropProches } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['chapitre-qui-s-ouvre'];
  assert.ok(p);
  assert.equal(p.calme, true);
  assert.equal(profilsTropProches('chapitre-qui-s-ouvre', 'filet-qui-se-trace'), null);
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `chapitre-qui-s-ouvre`/);
  assert.equal(JSON.parse(lire('docs/veille/styles/atomes/chapitre.json')).mouvement.profil, 'chapitre-qui-s-ouvre');
});
