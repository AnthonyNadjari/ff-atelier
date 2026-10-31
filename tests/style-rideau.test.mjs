// Style construit « rideau » (veille du 30 oct 2026, tour 19, volet 2a quater, source holographik.space, fiche
// docs/veille/styles/rideau.md) : la construction relevée est codée (grand vide et h1 au bas, écrans pleins de photo avec
// étiquette et titre centré qui se floute en sortant, barre de raccourcis flottante, pied clair en colonnes, modèle de site
// entier, profil de mouvement), régime sombre.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');

test('Hero/rideau : vide puis h1 au bas, métier à ville, premier écran photo, barre de raccourcis vers les seuls blocs présents', () => {
  const src = sansCommentaires(lire('src/sections/Hero/rideau.astro'));
  assert.match(src, /set:html=\{site\.business\.tagline\}/);
  assert.match(src, /metierEtVille\(\)/);
  assert.match(src, /\{hero && \(/, 'photo seulement si le client en a une');
  assert.match(src, /aria-label="Raccourcis"/);
  assert.match(src, /href: tel\(\), label: 'Appeler'/, 'le téléphone dans la barre');
  assert.match(src, /types\.has\('services'\) &&/, 'un raccourci n’existe que si son bloc existe');
  assert.match(src, /text-indent/, 'première ligne rentrée comme la source');
  assert.doesNotMatch(src, /#fff\b|#000\b|rgba\(/, 'tokens seulement');
});

test('Services/rideau : un écran plein de photo par service, lien vers sa page, flou en sortant en CSS, rien d’inventé', () => {
  const src = sansCommentaires(lire('src/sections/Services/rideau.astro'));
  assert.match(src, /id="services"/);
  assert.match(src, /\/services\/\$\{s\.slug\}/);
  assert.match(src, /\{s\.image && <Img/, 'photo seulement si le service en a une');
  assert.match(src, /s\.priceFrom \?\?/, 'prix seulement s’il est donné');
  assert.match(src, /data-rideau-flou/);
  assert.match(src, /@supports \(animation-timeline: view\(\)\)/, 'sans prise en charge, titre net');
  assert.match(src, /prefers-reduced-motion: no-preference/);
  assert.match(src, /animation-range: exit 10% exit 100%/, 'seulement à la sortie');
  assert.match(src, /blur\(16px\)/, '16 px mesurés sur la source');
  assert.match(src, /:focus-visible/);
  assert.doesNotMatch(src, /<script|<Icon\b/, 'aucun script, aucune icône');
});

test('Proof/rideau : un écran par avis recopié puis par photo de la galerie, rien sans données, ni étoile ni carte', () => {
  const src = sansCommentaires(lire('src/sections/Proof/rideau.astro'));
  assert.match(src, /id="proof"/);
  assert.match(src, /\{\(avis\.length > 0 \|\| google \|\| realisations\.length > 0\) && \(/);
  assert.match(src, /testimonials\.slice\(0, 3\)/);
  assert.match(src, /!vues\.has\(g\.src\)/, 'photos de la galerie pas encore montrées');
  assert.match(src, /realisations\.map\(/, 'un écran par photo restante de la galerie');
  assert.match(src, /\{g\.alt\}/, 'légende = le texte écrit pour le client, rien d’inventé');
  assert.doesNotMatch(src, /<Icon\b|★|class="[^"]*\bcard\b/);
});

test('Contact/rideau : la page se rallume (tokens inversés), colonnes, chaque colonne sans donnée disparaît', () => {
  const src = sansCommentaires(lire('src/sections/Contact/rideau.astro'));
  assert.match(src, /id="contact"/);
  assert.match(src, /--bg: var\(--ink\)/, 'bloc clair en tokens');
  assert.match(src, /--fg: var\(--on-ink\)/);
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /\{horaires\.length > 0 && \(/);
  assert.match(src, /site\.contact\.bookingUrl \?\? tel\(\)/, 'la porte : réservation en ligne, sinon Appeler');
  assert.match(src, /\{reseaux\.length > 0 && \(/);
  assert.doesNotMatch(src, /ContactForm/, 'pas de formulaire');
  assert.match(src, /py-1\.5/, 'cibles tactiles de 24 px (axe target-size)');
});

test('presets/rideau.json : modèle de site entier, avis haut, pas de barre basse ; deuxième modèle différent', () => {
  const m = JSON.parse(lire('presets/rideau.json'));
  assert.equal(m.look.direction, 'rideau');
  assert.equal(m.look.layout.hero, 'rideau');
  assert.deepEqual(m.look.layout.sections.map((x) => `${x.type}/${x.variant}`), ['proof/rideau', 'services/rideau', 'contact/rideau']);
  assert.equal(m.look.layout.actionBar, false);
  const b = JSON.parse(lire('presets/rideau-tatouage.json'));
  assert.equal(b.look.direction, 'rideau');
  assert.notEqual(b.look.layout.hero, 'rideau');
});

test('direction rideau : polices libres hors liste IA, noir (sombre), courbe réelle', async () => {
  const css = lire('src/directions/rideau/index.css');
  const { POLICES_IA } = await import('../scripts/ff/ia.mjs');
  const fams = [...css.matchAll(/--font-(?:display|body|mono):\s*'([^']+)'/g)].map((x) => x[1]);
  assert.deepEqual([...new Set(fams)], ['Familjen Grotesk Variable', 'Fragment Mono']);
  for (const fam of fams) assert.ok(!POLICES_IA.some((p) => fam.toLowerCase().startsWith(p)), fam);
  assert.match(css, /--ease-brand: cubic-bezier\(/);
  assert.match(css, /--bg: #000000;/);
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  assert.equal(regimePalette(JSON.parse(lire('docs/veille/styles/atomes/rideau.json')).couleurs).regime, 'sombre');
});

test('profil titre-qui-se-floute-en-sortant : documenté, sans exigence, porté par l’atome, pas calme (suit le défilement)', async () => {
  const { PROFILS_MOUVEMENT } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['titre-qui-se-floute-en-sortant'];
  assert.ok(p);
  assert.equal(p.calme, false);
  assert.deepEqual(p.exige, {});
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `titre-qui-se-floute-en-sortant`/);
  assert.equal(JSON.parse(lire('docs/veille/styles/atomes/rideau.json')).mouvement.profil, 'titre-qui-se-floute-en-sortant');
});
