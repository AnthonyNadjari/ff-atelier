// Style construit « cartouche » (veille du 30 oct 2026, tour 19, volet 2a quater, source hotel-gilbert.at, fiche
// docs/veille/styles/cartouche.md) : la construction relevée est codée (en-tête de papeterie au nom géant, tampon d'un vrai
// label, cartouches à filet posés à cheval sur les photos, papier quadrillé, bande cobalt et pied en cases, modèle de site
// entier, profil de mouvement), régime coloré doux.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');

test('Hero/cartouche : nom géant en h1 avec métier et ville, téléphone, tampon seulement avec un vrai label', () => {
  const src = sansCommentaires(lire('src/sections/Hero/cartouche.astro'));
  assert.match(src, /<h1 class="cartouche-nom/);
  assert.match(src, /metierEtVille\(\)/);
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /site\.business\.certifications\?\.\[0\]/, 'le tampon vient d’une certification du client');
  assert.match(src, /\{tampon && /, 'sans label, pas de tampon');
  assert.match(src, /\{hero && \(/);
  assert.match(src, /set:html=\{site\.business\.tagline\}/);
  assert.doesNotMatch(src, /#[0-9a-f]{3,6}\b/i, 'tokens seulement');
});

test('Services/cartouche : une photo par service et son cartouche, lien encadré vers sa page, se pose une fois, rien d’inventé', () => {
  const src = sansCommentaires(lire('src/sections/Services/cartouche.astro'));
  assert.match(src, /id="services"/);
  assert.match(src, /\{s\.image && \(/, 'photo seulement si le service en a une');
  assert.match(src, /\{s\.priceFrom && /);
  assert.match(src, /\/services\/\$\{s\.slug\}/);
  assert.match(src, /data-cartouche/);
  assert.match(src, /prefers-reduced-motion: reduce/);
  assert.match(src, /io\.unobserve/, 'une seule fois');
  assert.match(src, /\.cartouche-attend \{ opacity: 0/, 'l’état caché n’existe que sous la classe posée par le script');
  assert.match(src, /transform: translate\(-50%, 50%\)/, 'le lien mord le filet du bas');
  assert.doesNotMatch(src, /<Icon\b|data-scrub|data-parallax/);
});

test('About, Proof et Contact cartouche : texte centré, papier quadrillé en tokens, pied en cases, chaque bloc sans donnée disparaît', () => {
  const about = sansCommentaires(lire('src/sections/About/cartouche.astro'));
  assert.match(about, /id="about"/);
  assert.match(about, /\{portrait && \(/);
  const proof = sansCommentaires(lire('src/sections/Proof/cartouche.astro'));
  assert.match(proof, /\{\(avis\.length > 0 \|\| google\) && \(/);
  assert.match(proof, /color-mix\(in srgb, var\(--line\) 18%, transparent\)/, 'quadrillage en tokens');
  assert.doesNotMatch(proof, /★|<Icon\b/);
  const contact = sansCommentaires(lire('src/sections/Contact/cartouche.astro'));
  assert.match(contact, /id="contact"/);
  assert.match(contact, /background: var\(--ink\)/, 'bande cobalt');
  assert.match(contact, /horaires\.length > 0 \?/);
  assert.match(contact, /cartouche-cases/, 'pied en grille de cases');
  assert.match(contact, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.doesNotMatch(contact, /ContactForm/, 'pas de formulaire, comme la source');
});

test('presets/cartouche.json : modèle de site entier dans l’ordre de la source, pas de barre basse ; deuxième modèle différent', () => {
  const m = JSON.parse(lire('presets/cartouche.json'));
  assert.equal(m.look.direction, 'cartouche');
  assert.equal(m.look.layout.hero, 'cartouche');
  assert.deepEqual(m.look.layout.sections.map((x) => `${x.type}/${x.variant}`), ['about/cartouche', 'services/cartouche', 'proof/cartouche', 'contact/cartouche']);
  assert.equal(m.look.layout.actionBar, false);
  const b = JSON.parse(lire('presets/cartouche-fleuriste.json'));
  assert.equal(b.look.direction, 'cartouche');
  assert.notEqual(b.look.layout.hero, 'cartouche');
});

test('direction cartouche : trois polices libres hors liste IA, un seul cobalt (coloré doux), courbe réelle, pas d’italique', async () => {
  const css = lire('src/directions/cartouche/index.css');
  const { POLICES_IA } = await import('../scripts/ff/ia.mjs');
  const fams = [...css.matchAll(/--font-(?:display|body|mono):\s*'([^']+)'/g)].map((x) => x[1]);
  assert.deepEqual(fams, ['Gloock', 'Courier Prime', 'Oswald Variable']);
  for (const fam of fams) assert.ok(!POLICES_IA.some((p) => fam.toLowerCase().startsWith(p)), fam);
  assert.match(css, /--ease-brand: cubic-bezier\(0\.4, 0, 0\.2, 1\)/);
  assert.doesNotMatch(sansCommentaires(css), /font-style: italic/);
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  assert.equal(regimePalette(JSON.parse(lire('docs/veille/styles/atomes/cartouche.json')).couleurs).regime, 'colore-doux');
});

test('profil cartouche-qui-se-pose : calme, sans exigence, documenté, porté par l’atome', async () => {
  const { PROFILS_MOUVEMENT, refusProfil } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['cartouche-qui-se-pose'];
  assert.ok(p);
  assert.equal(p.calme, true);
  assert.deepEqual(p.exige, {});
  assert.equal(refusProfil('cartouche-qui-se-pose', { mouvement: 'calme', video: null, largeurMax: 0, avis: 0 }), null);
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `cartouche-qui-se-pose`/);
  assert.equal(JSON.parse(lire('docs/veille/styles/atomes/cartouche.json')).mouvement.profil, 'cartouche-qui-se-pose');
});
