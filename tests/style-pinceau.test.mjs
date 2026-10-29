// Style construit « pinceau » (veille du 29 oct 2026, volet 2a quater, source pickyjoe.com / Coyot Bar, fiche
// docs/veille/styles/pinceau.md) : la construction relevée est codée (premier écran, geste signature, bord brossé,
// modèle de site entier, profil de mouvement), dans le régime coloré doux.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '');

test('Hero/pinceau : enseigne empilée sur bleu nuit, métier à ville, téléphone, bord brossé, jamais de photo derrière l’enseigne', () => {
  const src = sansCommentaires(lire('src/sections/Hero/pinceau.astro'));
  assert.match(src, /set:html=\{site\.business\.tagline\}/, 'le h1 est business.tagline');
  assert.match(src, /bg-ink/, 'bande bleu nuit (token --ink)');
  assert.match(src, /metierEtVille\(\)/, 'métier et ville sous le h1 (GOUT § 0)');
  assert.match(src, /href=\{tel\(\)\}/, 'téléphone au premier écran');
  assert.doesNotMatch(src, /<Img\b/, 'la photo du lieu descend dans Services/pinceau, sur le bord brossé');
  assert.match(src, /<BordPinceau /, 'bord brossé en bas');
  assert.match(src, /pinceau-tilde/, 'tildes dessinés entre les lignes');
  assert.match(src, /prefers-reduced-motion/, 'l’enseigne ne s’allume pas en mouvement réduit');
  assert.doesNotMatch(src, /autoplay|data-split|data-parallax/, 'ni autoplay, ni montée de lignes, ni parallaxe');
});

test('BordPinceau : coup de pinceau dessiné, décoratif, éclats brossés par le moteur, tokens seulement', () => {
  const src = lire('src/components/BordPinceau.astro');
  assert.match(src, /aria-hidden="true"/);
  assert.match(src, /preserveAspectRatio="none"/, 'le bord s’étire sur toute la largeur');
  assert.match(src, /data-reveal="wipe"/, 'éclats brossés de gauche à droite');
  assert.doesNotMatch(sansCommentaires(src).replace(/d: '[^']*'/g, ''), /#[0-9a-f]{3,6}\b/i, 'aucune couleur en dur');
  const traces = [...src.matchAll(/bord: '([^']+)'/g)].map((m) => m[1]);
  assert.equal(traces.length, 3, 'trois tracés pour varier les bords voisins');
  assert.equal(new Set(traces).size, 3);
});

test('Services/pinceau : bandes pleine largeur, plaque d’horaires, carte à points de conduite, rien d’inventé', () => {
  const src = sansCommentaires(lire('src/sections/Services/pinceau.astro'));
  assert.match(src, /\['sable', 'moutarde', 'clair'\]/, 'rotation des bandes');
  assert.match(src, /var\(--fill, color-mix\(in oklab, var\(--accent\) \d+%, var\(--bg\)\)\)/, 'moutarde avec repli tiré des tokens');
  assert.match(src, /site\.services\.map/, 'une bande par service');
  assert.match(src, /horaires\.length > 0 && \(/, 'pas de plaque sans horaires');
  assert.match(src, /site\.layout\.hero === 'pinceau' \? site\.images\.hero : undefined/, 'photo du lieu seulement avec le premier écran pinceau');
  assert.match(src, /s\.lignes\.length > 0 \? 'nuit'/, 'carte sur bleu nuit seulement avec des lignes');
  assert.match(src, /\{l\.prix && /, 'prix seulement s’il est donné');
  assert.match(src, /\{s\.priceFrom && /);
  assert.match(src, /\.filter\(Boolean\)\.slice\(0, 4\)/, 'photos du service seulement, quatre au plus');
  assert.match(src, /\/services\/\$\{s\.slug\}/, 'chaque bande mène à la page du service');
  assert.match(src, /<BordPinceau /);
  assert.doesNotMatch(src, /<Icon\b/, 'pas d’icône à la place d’une photo absente');
  assert.doesNotMatch(src, /data-split|data-parallax|data-scrub/, 'les titres ne bougent pas, rien ne suit le défilement');
});

test('presets pinceau : modèle de site entier et second modèle différent', () => {
  const m = JSON.parse(lire('presets/pinceau.json'));
  assert.equal(m.nom, 'pinceau');
  assert.equal(m.look.direction, 'pinceau');
  assert.equal(m.look.layout.hero, 'pinceau');
  assert.equal(m.look.layout.sections[0].type, 'services', 'les bandes suivent le premier écran (bord terracotta)');
  assert.equal(m.look.layout.sections[0].variant, 'pinceau');
  const b = JSON.parse(lire('presets/pinceau-comptoir.json'));
  assert.equal(b.look.direction, 'pinceau');
  assert.notEqual(b.look.layout.hero, 'pinceau');
});

test('direction pinceau : polices hors liste IA, régime coloré doux, deux vives qui ne vibrent pas', async () => {
  const css = lire('src/directions/pinceau/index.css');
  const { estPoliceIa } = await import('../scripts/ff/ia.mjs');
  for (const fam of [...css.matchAll(/--font-(?:display|body|mono):\s*'([^']+)'/g)].map((x) => x[1])) {
    assert.ok(!estPoliceIa(fam), fam);
  }
  assert.match(css, /--fill: #f9c56b;/);
  assert.match(css, /--ink: #143450;/);
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  const atome = JSON.parse(lire('docs/veille/styles/atomes/pinceau.json'));
  assert.equal(regimePalette(atome.couleurs).regime, 'colore-doux');
  const { hexVersOklch } = await import('../scripts/ff/atomes.mjs');
  const terre = hexVersOklch(atome.couleurs.clair.accent), moutarde = hexVersOklch(atome.couleurs.clair.accent2);
  assert.ok(Math.abs(terre.l - moutarde.l) >= 0.1, 'B4 : clartés éloignées');
});

test('profil de mouvement bandes-au-pinceau : calme, documenté, porté par l’atome', async () => {
  const { PROFILS_MOUVEMENT, refusProfil } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['bandes-au-pinceau'];
  assert.ok(p);
  assert.equal(p.calme, true);
  assert.notEqual(p.defilement, 'suit-le-defilement');
  assert.equal(refusProfil('bandes-au-pinceau', { mouvement: 'calme', video: null, largeurMax: 0, avis: 0 }), null);
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `bandes-au-pinceau`/);
  assert.equal(JSON.parse(lire('docs/veille/styles/atomes/pinceau.json')).mouvement.profil, 'bandes-au-pinceau');
});
