// Style construit « dune » (veille du 30 oct 2026, tour 19, volet 2a quater, source steuermann.haus, fiche
// docs/veille/styles/dune.md) : la construction relevée est codée (photo lavée, les deux ailes au bord de l'écran, titre et
// texte en deux colonnes, paires de photos lavée / naturelle qui se chevauchent, hôte en médaillon, fin sur la photo lavée,
// modèle de site entier, profil de mouvement), régime clair teinté doux.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');

test('Hero/dune : photo lavée, titre en deux colonnes, métier à ville, téléphone, ailes seulement avec deux services à photo', () => {
  const src = sansCommentaires(lire('src/sections/Hero/dune.astro'));
  assert.match(src, /set:html=\{site\.business\.tagline\}/);
  assert.match(src, /metierEtVille\(\)/, 'métier et ville (GOUT § 0)');
  assert.match(src, /href=\{tel\(\)\}/, 'téléphone au premier écran');
  assert.match(src, /\{hero && \(/, 'photo seulement si le client en a une');
  assert.match(src, /dune-lavis/, 'la photo est lavée');
  assert.match(src, /site\.services\.filter\(\(s\) => s\.image\)\.slice\(0, 2\)/, 'ailes = deux services à photo');
  assert.match(src, /\{ailes\.length === 2 && \(/, 'sans deux services à photo, pas d’ailes');
  assert.match(src, /position: fixed/, 'ailes fixes au bord de l’écran');
  assert.match(src, /:focus-visible/, 'le clavier ouvre aussi l’aile');
  assert.match(src, /\.dune-aile \{ top: 68svh; \}/, 'au téléphone, sous la photo du premier écran');
  assert.match(src, /calc\(100% - 4vw\)/, 'à l’ordinateur, une lisière de 4vw de la photo');
  assert.match(src, /writing-mode: vertical-rl/, 'au téléphone, nom à la verticale');
  assert.match(src, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(src, /<script|autoplay|data-reveal|data-parallax/, 'CSS seul, rien au défilement');
  assert.doesNotMatch(src, /·/, 'pas de point médian');
});

test('About/dune et Services/dune : paires lavée / naturelle qui se chevauchent, photos du client seulement, rien d’inventé', () => {
  const about = sansCommentaires(lire('src/sections/About/dune.astro'));
  assert.match(about, /id="about"/);
  assert.match(about, /a\.portrait, \.\.\.site\.proof\.gallery/, 'photos du client seulement');
  assert.match(about, /\{avant && \(/, 'sans photo, pas de paire');
  assert.match(about, /dune-paire-arriere dune-lavis/);
  assert.match(about, /text-indent/, 'première ligne rentrée comme la source');
  const svc = sansCommentaires(lire('src/sections/Services/dune.astro'));
  assert.match(svc, /id="services"/);
  assert.match(svc, /title=|set:html=\{site\.wording\.servicesTitle\}/);
  assert.match(svc, /s\.images\[0\]/, 'la photo lavée vient d’abord des photos du service');
  assert.match(svc, /\{s\.priceFrom && /, 'prix seulement s’il est donné');
  assert.match(svc, /\/services\/\$\{s\.slug\}/, 'chaque service mène à sa page');
  assert.match(svc, /dune-paire-droite/, 'quinconce');
  assert.doesNotMatch(svc, /<Icon\b/);
  assert.doesNotMatch(about + svc, /aspect-\[\d\/5\]/, 'pas de « x/5 » lu comme une note');
});

test('Proof/dune : avis recopiés en deux colonnes, rien sans avis, ni carte ni étoile', () => {
  const src = sansCommentaires(lire('src/sections/Proof/dune.astro'));
  assert.match(src, /id="proof"/);
  assert.match(src, /\{\(avis\.length > 0 \|\| google\) && \(/);
  assert.match(src, /testimonials\.slice\(0, 3\)/);
  assert.doesNotMatch(src, /<Icon\b|★|class="[^"]*\bcard\b/);
});

test('Contact/dune : l’hôte, venir avec la carte grise, fin sur la photo lavée, pas de formulaire, chaque bloc sans donnée disparaît', () => {
  const src = sansCommentaires(lire('src/sections/Contact/dune.astro'));
  assert.match(src, /id="contact"/);
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /\{portrait && \(/);
  assert.match(src, /\{adresse && \(/);
  assert.match(src, /\{site\.contact\.mapsUrl && /, 'plan seulement si le lien est donné');
  assert.match(src, /site\.about\.team\[0\]/, 'la signature de l’hôte vient de l’équipe du client');
  assert.match(src, /\{carte && /, 'carte seulement avec coordonnées et fournisseur osm');
  assert.doesNotMatch(src, /ContactForm/, 'fin de la source : pas de formulaire');
  assert.match(src, /dune-fin dune-lavis/);
  assert.doesNotMatch(src, /bg-ink|<Icon\b/, 'ni bandeau sombre ni icône');
});

test('presets/dune.json : modèle de site entier, fin de la source, pas de barre basse ; deuxième modèle différent', () => {
  const m = JSON.parse(lire('presets/dune.json'));
  assert.equal(m.nom, 'dune');
  assert.equal(m.look.direction, 'dune');
  assert.equal(m.look.layout.hero, 'dune');
  assert.deepEqual(m.look.layout.sections.map((x) => `${x.type}/${x.variant}`), ['about/dune', 'services/dune', 'proof/dune', 'contact/dune']);
  for (const t of ['zones', 'faq', 'cta']) assert.ok(!m.look.layout.sections.some((x) => x.type === t), `pas de ${t}`);
  assert.equal(m.look.layout.actionBar, false);
  const b = JSON.parse(lire('presets/dune-soins.json'));
  assert.equal(b.look.direction, 'dune');
  assert.notEqual(b.look.layout.hero, 'dune');
});

test('direction dune : une grotesque libre hors liste IA, blanc chaud (clair teinté doux), lavis en tokens, courbe réelle', async () => {
  const css = lire('src/directions/dune/index.css');
  const { POLICES_IA } = await import('../scripts/ff/ia.mjs');
  for (const fam of [...css.matchAll(/--font-(?:display|body|mono):\s*'([^']+)'/g)].map((x) => x[1])) {
    assert.equal(fam, 'Hanken Grotesk Variable');
    assert.ok(!POLICES_IA.some((p) => fam.toLowerCase().startsWith(p)), fam);
  }
  assert.match(css, /--lavis-ciel: #[0-9a-f]{6};/);
  assert.match(css, /--ease-brand: cubic-bezier\(/);
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  const atome = JSON.parse(lire('docs/veille/styles/atomes/dune.json'));
  assert.equal(regimePalette(atome.couleurs).regime, 'clair-teinte');
});

test('profil de mouvement aile-qui-s-entrouvre : calme, sans exigence, documenté, porté par l’atome', async () => {
  const { PROFILS_MOUVEMENT, refusProfil } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['aile-qui-s-entrouvre'];
  assert.ok(p);
  assert.equal(p.calme, true);
  assert.deepEqual(p.exige, {});
  assert.equal(refusProfil('aile-qui-s-entrouvre', { mouvement: 'calme', video: null, largeurMax: 0, avis: 0 }), null);
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `aile-qui-s-entrouvre`/);
  assert.equal(JSON.parse(lire('docs/veille/styles/atomes/dune.json')).mouvement.profil, 'aile-qui-s-entrouvre');
});
