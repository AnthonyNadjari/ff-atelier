// Style construit « talus » (veille du 30 oct 2026, tour 19, volet 2a quater, source taylorhare.com, fiche
// docs/veille/styles/talus.md) : la construction relevée est codée (papier en six colonnes, phrase qui mord la photo,
// escalier de photos qui se touchent par un coin, panneau gris-bleu et rangée des trois, disque d'appel au coin, modèle de
// site entier, profil de mouvement), régime clair teinté doux.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');

test('Nav/talus : triangle au coin, téléphone en haut, disque d’appel fixé au coin bas droit qui s’ouvre', () => {
  const src = sansCommentaires(lire('src/sections/Nav/talus.astro'));
  assert.match(src, /talus-coin/);
  assert.match(src, /href=\{tel\(\)\}[^>]*data-porte="call"/, 'téléphone cliquable en haut (GOUT § 0)');
  assert.match(src, /talus-rond/);
  assert.match(src, /position: fixed; right:/);
  assert.match(src, /display: none; align-items/, 'pas de disque fixe au téléphone (il couvrait du texte)');
  assert.match(src, /@media \(min-width: 48rem\) \{ \.talus-rond \{ display: flex; \} \}/);
  assert.match(src, /transition: width 0\.9s var\(--ease-brand\)/, 'largeur en 0,9 s, mesurée sur la source');
  assert.match(src, /aria-label=\{`Appeler le/);
  assert.match(src, /@media \(hover: hover\)/, 'au toucher, le disque appelle directement');
  assert.match(src, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(src, /999px/, 'pas de pilule');
});

test('Hero/talus : photo plein cadre, nom posé dessus, h1 sans bandes, métier à ville, portes, aucun mouvement', () => {
  const src = sansCommentaires(lire('src/sections/Hero/talus.astro'));
  assert.match(src, /set:html=\{site\.business\.tagline\}/);
  assert.match(src, /talus-cadre-photo \{ min-height: 84svh; \}/, 'premier écran plein cadre, comme la source');
  assert.match(src, /absolute inset-0 h-full w-full object-cover/);
  assert.match(src, /talus-nom/, 'le nom posé sur la photo');
  assert.doesNotMatch(src, /talus-fond|box-decoration-break/, 'h1 sans bandes de fond');
  assert.match(src, /metierEtVille\(\)/);
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /hasContactDoor\(site\)/);
  assert.match(src, /\{hero && \(/, 'photo seulement si le client en a une');
  assert.doesNotMatch(src, /·|autoplay|data-split|data-parallax|data-reveal/);
});

test('Services/talus : l’escalier, chaque photo touche la précédente par un coin, une fois, rien d’inventé', () => {
  const src = sansCommentaires(lire('src/sections/Services/talus.astro'));
  assert.match(src, /title=\{site\.wording\.servicesTitle\}|set:html=\{site\.wording\.servicesTitle\}/);
  assert.match(src, /photo: \[4, 3\], texte: \[1, 2\]/);
  assert.match(src, /photo: \[2, 2\], texte: \[5, 2\]/, 'la deuxième photo finit à la colonne 3, la première commence à la 4 : coin partagé');
  assert.match(src, /photo: \[4, 2\]/);
  assert.match(src, /photo: \[1, 3\]/);
  assert.match(src, /repeat\(6, minmax\(0, 1fr\)\)/, 'six colonnes sans gouttière');
  assert.match(src, /margin-left: 0 !important/, 'la photo garde ses cases à l’ordinateur');
  assert.match(src, /position: absolute; top: 100%/, 'la légende pend sans pousser la rangée');
  assert.match(src, /s\.image \? \(/, 'aplat sans photo, jamais une icône');
  assert.match(src, /s\.priceFrom &&/);
  assert.match(src, /\/services\/\$\{s\.slug\}/);
  assert.match(src, /IntersectionObserver/);
  assert.match(src, /io\.unobserve/, 'une seule fois');
  assert.match(src, /translateX\(3rem\)/);
  assert.match(src, /\.talus-pret \.talus-marche \.talus-cadre \{ opacity: 0;/, 'état caché seulement sous la classe du script');
  assert.match(src, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(src, /<Icon\b|data-scrub|data-parallax|data-pin/);
});

test('About/talus et Proof/talus : photos du client seulement, avis dans la grande phrase, rien sans avis', () => {
  const a = sansCommentaires(lire('src/sections/About/talus.astro'));
  assert.match(a, /id="about"/);
  assert.match(a, /a\.portrait \?\? galerie\[1\]/);
  assert.match(a, /\{petite && \(/);
  const p = sansCommentaires(lire('src/sections/Proof/talus.astro'));
  assert.match(p, /\{\(avis\.length > 0 \|\| google\) && \(/);
  assert.match(p, /testimonials\.slice\(0, 2\)/);
  assert.doesNotMatch(p, /★|<Icon\b|class="[^"]*\bcard\b/);
});

test('Contact/talus : panneau gris-bleu à liens dans la phrase, sans formulaire, puis la rangée des trois', () => {
  const src = sansCommentaires(lire('src/sections/Contact/talus.astro'));
  assert.match(src, /id="contact"/);
  assert.match(src, /bg-ink text-on-ink/);
  assert.match(src, /appeler le \{site\.contact\.phoneDisplay\}/);
  assert.match(src, /site\.contact\.email \?/);
  assert.doesNotMatch(src, /ContactForm/, 'la source n’a pas de formulaire');
  assert.match(src, /adresse\?\.city &&/);
  assert.match(src, /horaires\.length > 0 &&/);
  assert.match(src, /talus-trois/);
});

test('presets/talus.json : modèle de site entier, fin de page de la source, pas de barre basse ; deuxième modèle différent', () => {
  const m = JSON.parse(lire('presets/talus.json'));
  assert.equal(m.nom, 'talus');
  assert.equal(m.look.direction, 'talus');
  assert.equal(m.look.layout.nav, 'talus');
  assert.equal(m.look.layout.hero, 'talus');
  const types = m.look.layout.sections.map((x) => `${x.type}/${x.variant}`);
  assert.deepEqual(types, ['services/talus', 'proof/talus', 'about/talus', 'contact/talus']);
  for (const t of ['zones', 'faq', 'cta']) assert.ok(!m.look.layout.sections.some((x) => x.type === t), `pas de ${t}`);
  assert.equal(m.look.layout.footer, 'minimal');
  assert.equal(m.look.layout.actionBar, false);
  const b = JSON.parse(lire('presets/talus-paysage.json'));
  assert.equal(b.look.direction, 'talus');
  assert.notEqual(b.look.layout.hero, 'talus');
});

test('direction talus : une seule grotesque libre hors liste IA, papier teinté (clair teinté doux), aucun rayon, vraie courbe', async () => {
  const css = lire('src/directions/talus/index.css');
  const { POLICES_IA } = await import('../scripts/ff/ia.mjs');
  for (const fam of [...css.matchAll(/--font-(?:display|body|mono):\s*'([^']+)'/g)].map((x) => x[1])) {
    assert.equal(fam, 'Epilogue Variable');
    assert.ok(!POLICES_IA.some((p) => fam.toLowerCase().startsWith(p)), fam);
  }
  assert.match(css, /--bg: #f3ece4;/);
  assert.match(css, /--radius-card: 0px;/);
  assert.match(css, /--ease-brand: cubic-bezier\(0\.25, 0\.1, 0\.25, 1\);/);
  const { DIRECTIONS, VARIANTS } = await import('../src/lib/schema.ts').catch(() => ({}));
  if (DIRECTIONS) {
    assert.ok(DIRECTIONS.includes('talus'));
    for (const t of ['nav', 'hero', 'services', 'about', 'proof', 'contact']) assert.ok(VARIANTS[t].includes('talus'), t);
  }
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  const atome = JSON.parse(lire('docs/veille/styles/atomes/talus.json'));
  assert.equal(regimePalette(atome.couleurs).regime, 'clair-teinte');
});

test('profil de mouvement escalier-qui-se-rejoint : calme, sans exigence, documenté, porté par l’atome', async () => {
  const { PROFILS_MOUVEMENT, refusProfil } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['escalier-qui-se-rejoint'];
  assert.ok(p);
  assert.equal(p.calme, true);
  assert.deepEqual(p.exige, {});
  assert.equal(refusProfil('escalier-qui-se-rejoint', { mouvement: 'calme', video: null, largeurMax: 0, avis: 0 }), null);
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `escalier-qui-se-rejoint`/);
  assert.equal(JSON.parse(lire('docs/veille/styles/atomes/talus.json')).mouvement.profil, 'escalier-qui-se-rejoint');
});
