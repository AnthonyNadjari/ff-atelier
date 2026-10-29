// Style construit « lin » (veille du 29 oct 2026, volet 2a quater, source fraher.co, fiche docs/veille/styles/lin.md) :
// la construction relevée est bien codée (premier écran, geste signature, modèle de site entier, profil de mouvement).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '');

test('Hero/lin : phrase seule centrée, métier à ville, bande photo pleine largeur, film au clic sans autoplay', () => {
  const src = sansCommentaires(lire('src/sections/Hero/lin.astro'));
  assert.match(src, /set:html=\{site\.business\.tagline\}/, 'la phrase est business.tagline');
  assert.match(src, /text-center/, 'phrase centrée');
  assert.match(src, /metierEtVille\(\)/, 'métier et ville sous la phrase (GOUT § 0)');
  assert.match(src, /href=\{tel\(\)\}/, 'téléphone au premier écran');
  assert.match(src, /\{poster && \(/, 'pas de bande sans photo ni poster');
  assert.match(src, /lin-bande/, 'bande photo');
  assert.doesNotMatch(src, /autoplay/, 'jamais d’autoplay');
  assert.match(src, /preload="none"/, 'la vidéo ne se charge qu’au clic');
  assert.match(src, /data-film-lancer/, 'lien « Voir le film »');
  assert.match(src, /onPage\(/, 'script dans onPage (transitions de page)');
  assert.doesNotMatch(src, /data-reveal|data-split|data-parallax/, 'page immobile (profil film-au-clic)');
});

test('Services/lin : un panneau pleine largeur par service, papier / sable / sauge, photo optionnelle, rien d’inventé', () => {
  const src = sansCommentaires(lire('src/sections/Services/lin.astro'));
  assert.match(src, /\['papier', 'sable', 'sauge'\]/, 'trois tons de panneau');
  assert.match(src, /site\.services\.map/, 'un panneau par service');
  assert.match(src, /\{s\.image && \(/, 'photo seulement si le service en a une');
  assert.match(src, /\{s\.priceFrom && /, 'prix seulement s’il est donné');
  assert.match(src, /color-mix\(in oklab, var\(--accent\) \d+%, var\(--bg\)\)/, 'sauge tirée des tokens');
  assert.match(src, /\/services\/\$\{s\.slug\}/, 'chaque panneau mène à la page du service');
  assert.doesNotMatch(src, /<Icon\b/, 'pas d’icône à la place d’une photo absente');
  assert.doesNotMatch(src, /data-reveal|data-stagger="/, 'aucune apparition (la source est immobile)');
});

test('presets/lin.json : modèle de site entier, direction, hero et geste du style ; deuxième modèle différent', () => {
  const m = JSON.parse(lire('presets/lin.json'));
  assert.equal(m.nom, 'lin');
  assert.equal(m.look.direction, 'lin');
  assert.equal(m.look.layout.hero, 'lin');
  assert.ok(m.look.layout.sections.some((s) => s.type === 'services' && s.variant === 'lin'), 'services/lin');
  assert.equal(m.look.layout.nav, 'minimal', 'nav qui porte la porte Appeler');
  const b = JSON.parse(lire('presets/lin-atelier.json'));
  assert.equal(b.look.direction, 'lin');
  assert.notEqual(b.look.layout.hero, 'lin');
});

test('direction lin : polices hors de la liste IA, papier teinté (clair teinté doux), rayon 0', async () => {
  const css = lire('src/directions/lin/index.css');
  const { POLICES_IA } = await import('../scripts/ff/ia.mjs').catch(() => ({}));
  for (const fam of [...css.matchAll(/--font-(?:display|body|mono):\s*'([^']+)'/g)].map((x) => x[1])) {
    assert.doesNotMatch(fam, /Inter|Cormorant|Instrument|Playfair|Fraunces|Space Grotesk|DM |Outfit|Jakarta|Syne|Newsreader|Lora|Crimson|IBM Plex|Geist|Source Serif|Manrope/, fam);
    if (Array.isArray(POLICES_IA)) assert.ok(!POLICES_IA.some((p) => fam.toLowerCase().startsWith(p)), fam);
  }
  assert.match(css, /--bg: #f3f1e7;/);
  assert.match(css, /--radius-card: 0px;/);
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  const atome = JSON.parse(lire('docs/veille/styles/atomes/lin.json'));
  assert.equal(regimePalette(atome.couleurs).regime, 'clair-teinte');
});

test('profil de mouvement film-au-clic : calme, sans exigence de vidéo, documenté', async () => {
  const { PROFILS_MOUVEMENT, refusProfil } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['film-au-clic'];
  assert.ok(p, 'profil présent');
  assert.equal(p.calme, true);
  assert.equal(p.defilement, 'aucun');
  assert.deepEqual(p.exige, {});
  assert.equal(refusProfil('film-au-clic', { mouvement: 'calme', video: null, largeurMax: 0, avis: 0 }), null);
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `film-au-clic`/);
  assert.equal(JSON.parse(lire('docs/veille/styles/atomes/lin.json')).mouvement.profil, 'film-au-clic');
});
