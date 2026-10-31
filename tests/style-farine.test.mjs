// Style construit « farine » (veille du 30 oct 2026, tour 19, volet 2a quater, source impastofornoantico.com, fiche
// docs/veille/styles/farine.md) : la construction relevée est codée (noms géants traversés par une photo en noir et blanc,
// bande brune, photos en quinconce, phrase éclatée sur une photo, double bande des noms, avis à côté d'une grande photo,
// pied brun au nom très large, modèle de site entier, profil de mouvement), régime clair teinté doux.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');

test('Hero/farine : noms des prestations géants, photo du client au milieu, copie claire découpée au cadre, h1, téléphone', () => {
  const src = sansCommentaires(lire('src/sections/Hero/farine.astro'));
  assert.match(src, /site\.services\.slice\(0, 3\)\.map\(\(s\) => s\.title\)/, 'les mots sont les titres des services');
  assert.match(src, /\{hero && \(/, 'photo seulement si le client en a une');
  assert.match(src, /farine-mots-clair" aria-hidden="true"/, 'la copie claire est décorative');
  assert.match(src, /clip-path: inset\(/, 'découpée au cadre de la photo');
  assert.match(src, /container-type: inline-size/);
  assert.match(src, /grayscale\(1\)/, 'photo en noir et blanc');
  assert.match(src, /set:html=\{site\.business\.tagline\}/);
  assert.match(src, /<h1/);
  assert.match(src, /metierEtVille\(\)/, 'métier et ville sous la phrase (GOUT § 0)');
  assert.match(src, /href=\{tel\(\)\}/, 'téléphone au premier écran');
  assert.match(src, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(src, /aria-label=\{mots/, 'pas d’aria-label sur un <p> (axe aria-prohibited-attr)');
  assert.doesNotMatch(src, /·/, 'pas de point médian');
});

test('Services/farine : titre centré, quinconce lié aux pages, phrase éclatée, deux bandes contraires, rien d’inventé', () => {
  const src = sansCommentaires(lire('src/sections/Services/farine.astro'));
  assert.match(src, /id="services"/);
  assert.match(src, /title=\{site\.wording\.servicesTitle\}|set:html=\{site\.wording\.servicesTitle\}/);
  assert.match(src, /\/services\/\$\{s\.slug\}/, 'chaque photo mène à sa page');
  assert.match(src, /\{s\.image && \(/, 'pas de photo inventée');
  assert.match(src, /\{s\.priceFrom && /, 'prix seulement s’il est donné');
  assert.match(src, /data-marquee="48s"/);
  assert.match(src, /data-marquee-sens=\{b === 1 \? 'inverse' : undefined\}/);
  assert.match(src, /farine-bandes[^"]*" aria-hidden="true"/, 'bandes décoratives');
  assert.match(src, /\{morceaux\.length > 0 && large && \(/, 'phrase éclatée seulement avec about.title et une seconde photo');
  assert.doesNotMatch(src, /<Icon\b/);
  assert.doesNotMatch(src, /data-scrub|data-parallax|data-pin/, 'rien ne suit le défilement');
});

test('About, Proof, Contact farine : bande brune, avis et photo, pied brun au nom très large, chaque bloc sans donnée disparaît', () => {
  const about = sansCommentaires(lire('src/sections/About/farine.astro'));
  assert.match(about, /id="about"/);
  assert.match(about, /bg-ink text-on-ink/);
  assert.match(about, /a\.portrait \?\? galerie\[0\]/);
  assert.match(about, /\{photo && \(/);
  const proof = sansCommentaires(lire('src/sections/Proof/farine.astro'));
  assert.match(proof, /\{\(avis\.length > 0 \|\| google\) && \(/);
  assert.match(proof, /\{photo && \(/);
  assert.doesNotMatch(proof, /★|<Icon\b|class="[^"]*\bcard\b/);
  const contact = sansCommentaires(lire('src/sections/Contact/farine.astro'));
  assert.match(contact, /id="contact"/);
  assert.match(contact, /bg-ink text-on-ink/);
  assert.match(contact, /href=\{tel\(\)\}/);
  assert.match(contact, /\{horaires\.length > 0 && \(/);
  assert.doesNotMatch(contact, /ContactForm/, 'pas de formulaire générique : la source finit sur ses coordonnées');
  assert.match(contact, /font-stretch: 125%; font-weight: 800/, 'nom très large et gras');
  assert.match(lire('src/sections/Services/farine.astro'), /hyphens: none/, 'pas de césure dans la phrase éclatée');
  assert.match(lire('src/sections/Services/farine.astro'), /enPlus\.map/, 'le mur continue avec les photos libres de la galerie');
});

test('presets farine : modèle de site entier, fin de page brune, pas de barre basse ; second modèle différent', () => {
  const m = JSON.parse(lire('presets/farine.json'));
  assert.equal(m.nom, 'farine');
  assert.equal(m.look.direction, 'farine');
  assert.equal(m.look.layout.hero, 'farine');
  assert.equal(m.look.layout.nav, 'bar');
  assert.equal(m.look.layout.servicePage, 'porte', 'une page par pain, nommée dans la barre (la source : Products)');
  assert.deepEqual(m.look.layout.sections.map((x) => `${x.type}/${x.variant}`), ['about/farine', 'services/farine', 'proof/farine', 'contact/farine']);
  for (const t of ['zones', 'faq', 'cta']) assert.ok(!m.look.layout.sections.some((x) => x.type === t), `pas de ${t}`);
  assert.equal(m.look.layout.footer, 'bande');
  assert.equal(m.look.layout.actionBar, false);
  const b = JSON.parse(lire('presets/farine-fournee.json'));
  assert.equal(b.look.direction, 'farine');
  assert.notEqual(b.look.layout.hero, 'farine');
});

test('direction farine : Archivo à chasse variable et Spectral, hors liste IA, crème teinté, courbe réelle, enregistrée', async () => {
  const css = lire('src/directions/farine/index.css');
  const { POLICES_IA } = await import('../scripts/ff/ia.mjs');
  for (const fam of [...css.matchAll(/--font-(?:display|body|mono):\s*'([^']+)'/g)].map((x) => x[1])) {
    assert.ok(['Archivo Variable', 'Spectral'].includes(fam), fam);
    assert.ok(!POLICES_IA.some((p) => fam.toLowerCase().startsWith(p)), fam);
  }
  assert.match(css, /@import '@fontsource-variable\/archivo\/wdth\.css'/, 'axe de chasse chargé');
  assert.match(css, /--ease-brand: cubic-bezier\(/, 'une vraie courbe, jamais « ease »');
  assert.match(css, /--radius-card: 0px;/);
  const schema = lire('src/lib/schema.ts');
  assert.match(schema, /\n  'farine', \/\//);
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  const atome = JSON.parse(lire('docs/veille/styles/atomes/farine.json'));
  assert.equal(regimePalette(atome.couleurs).regime, 'clair-teinte');
});

test('profil de mouvement mots-sous-la-photo : calme, sans exigence, documenté, porté par l’atome', async () => {
  const { PROFILS_MOUVEMENT, refusProfil } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['mots-sous-la-photo'];
  assert.ok(p);
  assert.equal(p.calme, true);
  assert.deepEqual(p.exige, {});
  assert.equal(refusProfil('mots-sous-la-photo', { mouvement: 'calme', video: null, largeurMax: 0, avis: 0 }), null);
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `mots-sous-la-photo`/);
  assert.equal(JSON.parse(lire('docs/veille/styles/atomes/farine.json')).mouvement.profil, 'mots-sous-la-photo');
});
