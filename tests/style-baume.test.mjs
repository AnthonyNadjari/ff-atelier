// Style construit « baume » (veille du 30 oct 2026, tour 19, volet 2a quater, source fiziopont.hu, Webflow showcase, fiche
// docs/veille/styles/baume.md) : la construction relevée est codée (photo dans son cadre devant une plaque sauge, nom en
// deux couleurs qui défile, cartes photo sur rose poudré, étapes en cartes qui se rebattent, praticien devant sa plaque
// pêche, avis en piste, lieu sur menthe et appel final, pied anthracite, modèle de site entier, profil de mouvement),
// régime clair teinté doux.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');

test('Hero/baume : h1, métier à ville, portes, photo dans son cadre devant la plaque sauge, nom qui défile', () => {
  const src = sansCommentaires(lire('src/sections/Hero/baume.astro'));
  assert.match(src, /set:html=\{site\.business\.tagline\}/);
  assert.match(src, /metierEtVille\(\)/);
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /baume-plaque/);
  assert.match(src, /translate\(2\.5rem, -2\.5rem\)/, 'plaque décalée vers la droite et le haut');
  assert.match(src, /box-shadow: var\(--shadow-lift\)/, 'ombre réelle');
  assert.match(src, /\{hero && <Img/);
  assert.match(src, /data-marquee="45s"/);
  assert.match(src, /marquee-track/);
  assert.match(src, /aria-hidden="true"/);
  assert.match(src, /baume-depart/, 'l’état de départ n’existe que sous la classe posée par le script');
  assert.match(src, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(src, /·|autoplay|data-split/);
});

test('Process/baume : la pile de cartes, par seuils dans les deux sens, jamais calée image par image, rien sans étapes', () => {
  const src = sansCommentaires(lire('src/sections/Process/baume.astro'));
  assert.match(src, /\{etapes\.length > 0 && \(/);
  assert.match(src, /site\.process/);
  assert.match(src, /Étape \{i \+ 1\} sur \{etapes\.length\}/, 'l’ordre en petit, pas de chiffre géant décoratif');
  assert.match(src, /position: sticky/);
  assert.match(src, /rootMargin: '-50% 0px -50% 0px'/);
  assert.match(src, /poser\(Math\.max\(0, k - 1\)\)/, 'la carte repart quand on remonte');
  assert.match(src, /\.baume-pret \.baume-carte \{/, 'pile seulement avec le script');
  assert.match(src, /transition: transform var\(--motion-duration\) var\(--ease-brand\)/);
  assert.match(src, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(src, /data-scrub|data-pin|scroll-timeline|animation-timeline/, 'rien de calé sur le défilement');
});

test('Services, About, Proof, Contact, Footer baume : photos du client seulement, jamais de plaque vide, rien sans avis', () => {
  const s = sansCommentaires(lire('src/sections/Services/baume.astro'));
  assert.match(s, /\{s\.image && <Img/);
  assert.match(s, /\/services\/\$\{s\.slug\}/);
  assert.doesNotMatch(s, /<Icon\b/, 'pas d’icône à la place d’une photo');
  const a = sansCommentaires(lire('src/sections/About/baume.astro'));
  assert.match(a, /a\.team\.filter\(\(m\) => m\.photo\)/);
  assert.match(a, /baume-plaque-peche/);
  const p = sansCommentaires(lire('src/sections/Proof/baume.astro'));
  assert.match(p, /\{\(avis\.length > 0 \|\| google\) && \(/);
  assert.match(p, /snap-x snap-mandatory[^"]*overflow-x-auto/);
  assert.match(p, /tabindex="0"/);
  assert.doesNotMatch(p, /★|autoplay|setInterval/);
  const c = sansCommentaires(lire('src/sections/Contact/baume.astro'));
  assert.match(c, /id="contact"/);
  assert.match(c, /\{adresse && \(/);
  assert.match(c, /\{horaires\.length > 0 && \(/);
  assert.doesNotMatch(c, /ContactForm/, 'la source n’a pas de formulaire');
  const f = sansCommentaires(lire('src/sections/Footer/baume.astro'));
  assert.match(f, /bg-ink text-on-ink/);
  assert.match(f, /baume-pied-b/);
  assert.match(f, /site\.legal\.demo/);
});

test('presets/baume.json : modèle de site entier, pied de la source, pas de barre basse ; deuxième modèle différent', () => {
  const m = JSON.parse(lire('presets/baume.json'));
  assert.equal(m.nom, 'baume');
  assert.equal(m.look.direction, 'baume');
  assert.equal(m.look.layout.hero, 'baume');
  const types = m.look.layout.sections.map((x) => `${x.type}/${x.variant}`);
  assert.deepEqual(types, ['services/baume', 'process/baume', 'about/baume', 'proof/baume', 'contact/baume', 'faq/accordion']);
  for (const t of ['zones', 'cta']) assert.ok(!m.look.layout.sections.some((x) => x.type === t), `pas de ${t}`);
  assert.equal(m.look.layout.footer, 'baume');
  assert.equal(m.look.layout.actionBar, false);
  const b = JSON.parse(lire('presets/baume-cabinet.json'));
  assert.equal(b.look.direction, 'baume');
  assert.notEqual(b.look.layout.hero, 'baume');
});

test('direction baume : géométrique libre hors liste IA, blanc rosé (clair teinté doux), pas de pilule, vraie courbe', async () => {
  const css = lire('src/directions/baume/index.css');
  const { POLICES_IA } = await import('../scripts/ff/ia.mjs');
  for (const fam of [...css.matchAll(/'([A-Z][^']+ Variable)'/g)].map((x) => x[1])) {
    assert.ok(['Red Hat Display Variable', 'Josefin Sans Variable'].includes(fam), fam);
    assert.ok(!POLICES_IA.some((p) => fam.toLowerCase().startsWith(p)), fam);
  }
  assert.match(css, /--bg: #fbf2ec;/);
  assert.match(css, /--radius: 8px;/);
  assert.doesNotMatch(css, /999px/);
  assert.match(css, /--ease-brand: cubic-bezier\(0\.22, 1\.2, 0\.36, 1\);/);
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  const atome = JSON.parse(lire('docs/veille/styles/atomes/baume.json'));
  assert.equal(regimePalette(atome.couleurs).regime, 'clair-teinte');
});

test('profil de mouvement cartes-qui-se-rebattent : vivant, refusé à un client calme, documenté, porté par l’atome', async () => {
  const { PROFILS_MOUVEMENT, refusProfil } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['cartes-qui-se-rebattent'];
  assert.ok(p);
  assert.equal(p.calme, false);
  assert.deepEqual(p.exige, {});
  assert.match(refusProfil('cartes-qui-se-rebattent', { mouvement: 'calme', video: null, largeurMax: 0, avis: 0 }), /calme/);
  assert.equal(refusProfil('cartes-qui-se-rebattent', { mouvement: 'vivant', video: null, largeurMax: 0, avis: 0 }), null);
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `cartes-qui-se-rebattent`/);
  assert.equal(JSON.parse(lire('docs/veille/styles/atomes/baume.json')).mouvement.profil, 'cartes-qui-se-rebattent');
});
