// Style construit « pochoir » (veille du 30 oct 2026, tour 19, volet 2a quater, source haven-annecy.fr, fiche
// docs/veille/styles/pochoir.md) : la construction relevée est codée (nom en lettres remplies de photos, panneau terre cuite,
// offres en mots géants pâles barrés de leurs heures écrites, bandes de photos qui sortent des bords, pied à filets
// verticaux, modèle de site entier, profil de mouvement), régime clair teinté doux.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');

test('Hero/pochoir : nom rempli des photos du client (version moyenne), repli plein, h1, métier à ville, téléphone et porte', () => {
  const src = sansCommentaires(lire('src/sections/Hero/pochoir.astro'));
  assert.match(src, /background-clip: text/);
  assert.match(src, /site\.proof\.gallery/, 'photos du client seulement');
  assert.match(src, /imageFilename\(dir, name, w, max, 'webp'\)/, 'jamais l’originale dans les lettres');
  assert.match(src, /sans-photo/, 'sans photo, le nom en terre cuite pleine');
  assert.match(src, /aria-hidden="true"/, 'le nom géant est décoratif');
  assert.match(src, /Photos d’illustration dans les lettres/, 'mention visible des photos de démo');
  assert.match(src, /set:html=\{site\.business\.tagline\}/);
  assert.match(src, /metierEtVille\(\)/);
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /actions\(\)\.find\(\(a\) => a\.kind !== 'call'\)/);
  assert.doesNotMatch(src, /·/);
});

test('Services/pochoir : mot géant décoratif hors du texte, heures écrites qui se découvrent, bandes de photos, rien d’inventé', () => {
  const src = sansCommentaires(lire('src/sections/Services/pochoir.astro'));
  assert.match(src, /id="services"/);
  assert.match(src, /data-mot=\{s\.title\} aria-hidden="true"/, 'mot écrit par le CSS (pas mesuré comme texte par axe)');
  assert.match(src, /content: attr\(data-mot\)/);
  assert.match(src, /class="sr-only">\{s\.title\}<\/h2>/, 'le nom de l’offre est un vrai h2');
  assert.match(src, /<div class="pochoir-heures"><p class="m-0" data-reveal="wipe">\{s\.short\}<\/p><\/div>/, 'inclinaison sur le parent, révélation sur l’enfant');
  assert.match(src, /\{bande\.length >= 3 && \(/, 'pas de bande sans trois photos');
  assert.match(src, /\/services\/\$\{s\.slug\}/);
  assert.doesNotMatch(src, /<Icon\b|data-scrub|data-parallax|data-pin/);
});

test('About, Proof, Contact pochoir : panneau terre cuite, note et avis, phrase écrite sur filet et trois colonnes', () => {
  const about = sansCommentaires(lire('src/sections/About/pochoir.astro'));
  assert.match(about, /id="about"/);
  assert.match(about, /bg-accent text-on-accent/);
  assert.match(about, /\{titre && /);
  const proof = sansCommentaires(lire('src/sections/Proof/pochoir.astro'));
  assert.match(proof, /\{\(avis\.length > 0 \|\| google\) && \(/);
  assert.doesNotMatch(proof, /★|<Icon\b/);
  const contact = sansCommentaires(lire('src/sections/Contact/pochoir.astro'));
  assert.match(contact, /id="contact"/);
  assert.match(contact, /data-reveal="wipe"/);
  assert.match(contact, /\{horaires\.length > 0 && \(/);
  assert.doesNotMatch(contact, /ContactForm/, 'pas de formulaire générique : la source finit sur ses trois colonnes');
  assert.match(contact, /href=\{tel\(\)\}/);
});

test('presets pochoir : modèle de site entier, pas de barre basse ; second modèle différent', () => {
  const m = JSON.parse(lire('presets/pochoir.json'));
  assert.equal(m.nom, 'pochoir');
  assert.equal(m.look.direction, 'pochoir');
  assert.equal(m.look.layout.hero, 'pochoir');
  assert.deepEqual(m.look.layout.sections.map((x) => `${x.type}/${x.variant}`), ['about/pochoir', 'services/pochoir', 'proof/pochoir', 'contact/pochoir']);
  for (const t of ['zones', 'faq', 'cta']) assert.ok(!m.look.layout.sections.some((x) => x.type === t), `pas de ${t}`);
  assert.equal(m.look.layout.actionBar, false);
  const b = JSON.parse(lire('presets/pochoir-salon.json'));
  assert.equal(b.look.direction, 'pochoir');
  assert.notDeepEqual(b.look.layout.sections, m.look.layout.sections);
});

test('direction pochoir : Barlow et Sacramento hors liste IA, rose teinté (clair teinté doux), pas de pilule, courbe réelle', async () => {
  const css = lire('src/directions/pochoir/index.css');
  const { POLICES_IA } = await import('../scripts/ff/ia.mjs');
  for (const fam of [...css.matchAll(/--font-(?:display|body|mono|script):\s*'([^']+)'/g)].map((x) => x[1])) {
    assert.ok(['Barlow', 'Sacramento'].includes(fam), fam);
    assert.ok(!POLICES_IA.some((p) => fam.toLowerCase().startsWith(p)), fam);
  }
  assert.match(css, /--radius: 4px;/);
  assert.doesNotMatch(css, /999px|9999px/);
  assert.match(css, /--ease-brand: cubic-bezier\(/);
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  assert.equal(regimePalette(JSON.parse(lire('docs/veille/styles/atomes/pochoir.json')).couleurs).regime, 'clair-teinte');
});

test('profil heures-ecrites-a-la-main : calme, sans exigence, documenté, porté par l’atome', async () => {
  const { PROFILS_MOUVEMENT, refusProfil } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['heures-ecrites-a-la-main'];
  assert.ok(p);
  assert.equal(p.calme, true);
  assert.deepEqual(p.exige, {});
  assert.equal(refusProfil('heures-ecrites-a-la-main', { mouvement: 'calme', video: null, largeurMax: 0, avis: 0 }), null);
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `heures-ecrites-a-la-main`/);
  assert.equal(JSON.parse(lire('docs/veille/styles/atomes/pochoir.json')).mouvement.profil, 'heures-ecrites-a-la-main');
});
