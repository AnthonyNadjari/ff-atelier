// Style construit « bouteille » (veille du 29 oct 2026, volet 2a quater, source restaurantzimmerl.at, fiche
// docs/veille/styles/bouteille.md) : la construction relevée est bien codée (salle avec le nom, h1 sous la photo, scènes de
// photos décalées surplombées par le titre géant, modèle de site entier, profil de mouvement), régime sombre.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '');

test('Hero/bouteille : nom seul sur la photo de salle, h1 + métier à ville + téléphone dessous, distinctions réelles seulement', () => {
  const src = sansCommentaires(lire('src/sections/Hero/bouteille.astro'));
  assert.match(src, /\{site\.business\.name\}/, 'le nom du commerce sur la photo');
  assert.match(src, /\{hero && \(/, 'pas de photo inventée : sans photo, le nom sur un bandeau encre');
  assert.match(src, /<h1[^>]*set:html=\{site\.business\.tagline\}/, 'h1 sous la photo');
  assert.match(src, /ligneMetier\(\) \|\| metierEtVille\(\)/, 'métier et ville (GOUT § 0)');
  assert.match(src, /href=\{tel\(\)\}/, 'téléphone au premier écran');
  assert.match(src, /site\.business\.certifications/, 'distinctions = certifications du client');
  assert.match(src, /google \? \[/, 'note Google seulement si elle existe');
  assert.match(src, /distinctions\.length > 0 && \(/, 'ligne absente sans distinction');
  assert.match(src, /prefers-reduced-motion: no-preference/, 'entrée coupée sous « réduire les animations »');
  assert.match(src, /data-motion='none'/, 'entrée coupée en motion none');
  assert.match(src, /@keyframes bt-enseigne \{ from \{ letter-spacing: 0\.34em/, 'enseigne qui se resserre');
  assert.doesNotMatch(src, /autoplay|setInterval/, 'rien ne tourne tout seul (diaporama de la source non repris)');
});

test('Services/bouteille : titre géant en surplomb (parallaxe), deuxième photo seulement si fournie, sans photo = liste', () => {
  const src = sansCommentaires(lire('src/sections/Services/bouteille.astro'));
  assert.match(src, /site\.services\.filter\(\(s\) => s\.image\)/, 'scène seulement avec une photo du service');
  assert.match(src, /site\.services\.filter\(\(s\) => !s\.image\)/, 'les autres en liste filetée');
  assert.match(src, /s\.images\?\.\[0\]/, 'deuxième photo = services[].images[0]');
  assert.match(src, /bt-titre-geant[^>]*data-parallax="0\.5"/, 'le titre glisse sur le coin de la photo');
  assert.match(src, /bt-rail/, 'rail à points de la scène B');
  assert.match(src, /grid-template-columns: repeat\(14,/, 'grille de 14 colonnes, marges comprises');
  assert.match(src, /\{s\.priceFrom && /, 'prix seulement s’il est donné');
  assert.match(src, /\/services\/\$\{s\.slug\}/, 'chaque scène mène à sa page');
  assert.match(src, /calc\(88vw \/ \(var\(--n\)/, 'le mot géant tient dans l’écran du téléphone');
  assert.doesNotMatch(src, /<Icon\b/, 'pas d’icône à la place d’une photo absente');
});

test('presets/bouteille.json : site entier (direction, hero, geste, nav, pied) ; bouteille-cave différent', () => {
  const m = JSON.parse(lire('presets/bouteille.json'));
  assert.equal(m.look.direction, 'bouteille');
  assert.equal(m.look.layout.hero, 'bouteille');
  assert.equal(m.look.layout.sections[0].type, 'services', 'les scènes juste après le premier écran');
  assert.equal(m.look.layout.sections[0].variant, 'bouteille');
  assert.equal(m.look.motion, 'rich', 'la parallaxe du titre demande rich');
  assert.equal(m.look.layout.sections.at(-1).type, 'contact', 'plaque du contact en dernier, comme la source');
  const b = JSON.parse(lire('presets/bouteille-cave.json'));
  assert.equal(b.look.direction, 'bouteille');
  assert.notEqual(b.look.layout.hero, 'bouteille');
});

test('direction bouteille : sombre (color-scheme dark), polices hors liste IA, vert bouteille et cuivre, rien d’italique', () => {
  const css = lire('src/directions/bouteille/index.css');
  assert.match(css, /color-scheme: dark;/);
  assert.match(css, /--bg: #1f2d2d;/);
  assert.match(css, /--accent-h: 27;/);
  for (const fam of [...css.matchAll(/--font-(?:display|body|mono):\s*'([^']+)'/g)].map((x) => x[1])) {
    assert.doesNotMatch(fam, /Inter|Cormorant|Instrument|Playfair|Fraunces|Space Grotesk|DM |Outfit|Jakarta|Syne|Newsreader|Lora|Crimson|IBM Plex|Geist|Source Serif|Manrope/, fam);
  }
  assert.match(css, /h1 em,[\s\S]*?font-style: normal/, 'emphase droite (GOUT § 2)');
  assert.doesNotMatch(css, /999px|9999px/, 'pas de pilule');
});

test('profil enseigne-qui-se-resserre : codé, vivant, tenable sur iPhone (translation seule), documenté', async () => {
  const { PROFILS_MOUVEMENT } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['enseigne-qui-se-resserre'];
  assert.ok(p);
  assert.equal(p.entree, 'enseigne');
  assert.equal(p.apparition, 'titre-en-surplomb');
  assert.deepEqual(p.exige, {});
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `enseigne-qui-se-resserre`/);
  const atome = JSON.parse(lire('docs/veille/styles/atomes/bouteille.json'));
  assert.equal(atome.mouvement.profil, 'enseigne-qui-se-resserre');
  assert.equal(atome.couleurs.principal, 'sombre');
});
