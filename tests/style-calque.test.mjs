// Style construit « calque » (veille du 29 oct 2026, tour 18, volet 2a quater, source tekt.com.au, fiche
// docs/veille/styles/calque.md) : la construction relevée est codée (barre et listes en cellules de plan à repères d'angle,
// premier écran, geste signature, formulaire en grille de cellules, modèle de site entier, profil de mouvement).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '');

test('cellules.css : filet et quatre carrés d’angle en tokens, dans @layer components (les utilitaires gardent position)', () => {
  const css = lire('src/styles/cellules.css');
  assert.match(css, /@layer components \{/);
  assert.equal((css.match(/linear-gradient\(var\(--line\), var\(--line\)\) (top|bottom) (left|right)/g) || []).length, 4, 'quatre repères');
  assert.doesNotMatch(sansCommentaires(css), /#[0-9a-f]{3,6}\b/i, 'aucune couleur en dur');
  assert.match(css, /\.ff-cellules > \.ff-cellule \+ \.ff-cellule \{ margin-top: -1px; \}/, 'filets partagés');
});

test('Nav/calque : rangée de cellules, téléphone cliquable sur téléphone ET ordinateur, menu en cellules', () => {
  const src = sansCommentaires(lire('src/sections/Nav/calque.astro'));
  assert.match(src, /import '@\/styles\/cellules\.css'/);
  assert.ok((src.match(/href=\{tel\(\)\}/g) || []).length >= 2, 'téléphone dans la barre (ordinateur) et Appeler (téléphone)');
  assert.match(src, /data-menu-toggle/);
  assert.match(src, /onPage\(/);
  assert.match(src, /site\.layout\.hero === 'calque'/, 'pas d’espace réservé sous la barre quand le premier écran est calque');
});

test('Hero/calque : h1 au-dessus de la photo, métier à ville, prestations en cellules, porte Devis fixe, rien d’inventé', () => {
  const src = sansCommentaires(lire('src/sections/Hero/calque.astro'));
  assert.match(src, /set:html=\{site\.business\.tagline\}/);
  assert.match(src, /metierEtVille\(\)/);
  assert.match(src, /<Prestations \/>/, 'les prestations en cellules');
  assert.match(src, /\{hero && \(/, 'pas de photo sans images.hero');
  assert.match(src, /calque-porte fixed/, 'porte fixée en bas à gauche');
  assert.match(src, /safe-area-inset-bottom/, 'au-dessus de la barre de Safari');
  assert.doesNotMatch(src, /autoplay|data-split|data-parallax/);
  const comp = sansCommentaires(lire('src/components/CellulesPrestations.astro'));
  assert.match(comp, /site\.services\.slice\(0, 5\)/);
  assert.match(comp, /\/services\/\$\{s\.slug\}/);
});

test('Services/calque : cellules numérotées, une ouverte à la fois (details name natif), photo seulement si donnée', () => {
  const src = sansCommentaires(lire('src/sections/Services/calque.astro'));
  assert.match(src, /<details class="ff-cellule calque-etape" name="calque-services" open=\{i === 0\}>/);
  assert.match(src, /padStart\(2, '0'\)/, 'numéros 01, 02…');
  assert.match(src, /\{s\.image && \(/);
  assert.match(src, /\{s\.priceFrom && /);
  assert.match(src, /\/services\/\$\{s\.slug\}/);
  assert.match(src, /calque-fondu 0\.5s linear/, 'photo en fondu 0,5 s linéaire (mesuré sur la source)');
  assert.match(src, /prefers-reduced-motion/);
  assert.doesNotMatch(src, /<Icon\b|data-reveal/);
});

test('About, Proof, Contact calque : cellules, données seulement', () => {
  const about = sansCommentaires(lire('src/sections/About/calque.astro'));
  assert.match(about, /site\.about\.values\.map|valeurs\.map/);
  assert.match(about, /villes\.length > 0 && \(/, 'pas de rangée sans commune');
  const proof = sansCommentaires(lire('src/sections/Proof/calque.astro'));
  assert.match(proof, /const rien = photos\.length === 0 && !google && avis\.length === 0;/);
  assert.match(proof, /data-calque-serie/);
  assert.match(proof, /aria-pressed/);
  const contact = sansCommentaires(lire('src/sections/Contact/calque.astro'));
  assert.match(contact, /id="contact"/);
  assert.match(contact, /site\.form\.provider !== 'none'/);
  assert.match(contact, /href=\{tel\(\)\}/);
});

test('presets/calque.json : modèle de site entier fidèle à la source (pas de fin d’usine)', () => {
  const m = JSON.parse(lire('presets/calque.json'));
  assert.equal(m.nom, 'calque');
  assert.equal(m.look.direction, 'calque');
  assert.equal(m.look.layout.nav, 'calque');
  assert.equal(m.look.layout.hero, 'calque');
  assert.deepEqual(m.look.layout.sections.map((s) => `${s.type}/${s.variant}`), ['about/calque', 'services/calque', 'proof/calque', 'contact/calque']);
  assert.equal(m.look.layout.footer, 'liens', 'pied clair sur le fond de la page');
  assert.equal(m.look.layout.actionBar, false);
});

test('direction calque : polices hors liste IA, fond bleu de plan (clair teinté doux), rayon 0', async () => {
  const css = lire('src/directions/calque/index.css');
  const { estPoliceIa } = await import('../scripts/ff/ia.mjs');
  for (const fam of [...css.matchAll(/--font-(?:display|body|mono):\s*'([^']+)'/g)].map((x) => x[1])) assert.ok(!estPoliceIa(fam), fam);
  assert.match(css, /--bg: #e3ecf2;/);
  assert.match(css, /--radius-card: 0px;/);
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  assert.equal(regimePalette(JSON.parse(lire('docs/veille/styles/atomes/calque.json')).couleurs).regime, 'clair-teinte');
});

test('profil de mouvement cellules-qui-s-ouvrent : calme, sans défilement, documenté', async () => {
  const { PROFILS_MOUVEMENT, refusProfil } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['cellules-qui-s-ouvrent'];
  assert.ok(p);
  assert.equal(p.calme, true);
  assert.equal(p.defilement, 'aucun');
  assert.equal(refusProfil('cellules-qui-s-ouvrent', { mouvement: 'calme', video: null, largeurMax: 0, avis: 0 }), null);
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `cellules-qui-s-ouvrent`/);
  assert.equal(JSON.parse(lire('docs/veille/styles/atomes/calque.json')).mouvement.profil, 'cellules-qui-s-ouvrent');
});
