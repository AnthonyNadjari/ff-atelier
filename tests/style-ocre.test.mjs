// Style construit « ocre » (veille du 29 oct 2026, volet 2a quater, source lrnce.com, fiche docs/veille/styles/ocre.md) : la
// construction relevée est codée (diptyque bord à bord, lettre, prestations en diptyques, avis centrés, invitation centrée,
// pied à la bande rouille qui défile et aux colonnes filetées, modèle de site entier, profil de mouvement), régime coloré doux.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');

test('Hero/ocre : diptyque bord à bord, une photo au téléphone, ligne du titre dessous avec métier à ville et téléphone', () => {
  const src = sansCommentaires(lire('src/sections/Hero/ocre.astro'));
  assert.match(src, /set:html=\{site\.business\.tagline\}/);
  assert.match(src, /metierEtVille\(\)/);
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /md:grid-cols-2/, 'deux photos côte à côte à l’ordinateur');
  assert.match(src, /i > 0 && 'hidden md:block'/, 'une seule photo au téléphone');
  assert.match(src, /site\.proof\.gallery\.find\(\(g\) => g\.src !== hero\?\.src\)/, 'la seconde photo vient de la galerie du client');
  assert.match(src, /border-y border-line/, 'la ligne du titre entre deux filets');
  assert.doesNotMatch(src, /autoplay|data-split|data-parallax|data-reveal/, 'immobile');
});

test('About/ocre : la lettre, photo collée au bord, serif de grand corps, lettre d’abord au téléphone', () => {
  const src = sansCommentaires(lire('src/sections/About/ocre.astro'));
  assert.match(src, /id="about"/);
  assert.match(src, /paragraphs\(a\.story\)/);
  assert.match(src, /order-1[^"]*md:order-2/, 'la lettre avant sa photo au téléphone');
  assert.match(src, /\{photo && \(/);
  assert.match(src, /font-display/);
});

test('Services/ocre : diptyques légendés, moitié vide pour le dernier seul, titres partagés, rien d’inventé', () => {
  const src = sansCommentaires(lire('src/sections/Services/ocre.astro'));
  assert.match(src, /title=\{site\.wording\.servicesTitle\}/);
  assert.match(src, /metierEtVille\(\)/);
  assert.match(src, /i \+= 2/, 'deux par deux');
  assert.match(src, /md:grid-cols-2/);
  assert.match(src, /aspect-\[3\/4\]/, 'photos verticales');
  assert.match(src, /\{seul && \(/, 'moitié vide pour un service seul en fin de liste');
  assert.match(src, /\{s\.priceFrom && /, 'prix seulement s’il est donné');
  assert.match(src, /\/services\/\$\{s\.slug\}/);
  assert.doesNotMatch(src, /<Icon\b/, 'pas d’icône à la place d’une photo');
  assert.doesNotMatch(src, /aspect-\[\d\/5\]/, 'pas de « 4/5 » dans le HTML (lu comme une note par ff ressemblance)');
  assert.doesNotMatch(src, /data-reveal|data-scrub|data-parallax/, 'immobile');
});

test('Proof/ocre : grande photo de la galerie puis avis centrés en serif, rien sans donnée', () => {
  const src = sansCommentaires(lire('src/sections/Proof/ocre.astro'));
  assert.match(src, /id="proof"/);
  assert.match(src, /site\.proof\.testimonials\.slice\(0, 2\)/);
  assert.match(src, /\{\(preuve \|\| large\) && \(/);
  assert.match(src, /text-center/);
  assert.doesNotMatch(src, /<Icon\b|★|class="[^"]*\bcard\b/, 'ni icône, ni étoile, ni carte');
});

test('Contact/ocre et Footer/ocre : invitation centrée, bande rouille au nom qui défile (décorative), colonnes filetées', () => {
  const c = sansCommentaires(lire('src/sections/Contact/ocre.astro'));
  assert.match(c, /id="contact"/);
  assert.match(c, /href=\{tel\(\)\}/);
  assert.match(c, /\{formulaire && \(/);
  const f = sansCommentaires(lire('src/sections/Footer/ocre.astro'));
  assert.match(f, /<footer class="pied-ocre/);
  assert.match(f, /bg-ink text-on-ink" data-marquee="40s" aria-hidden="true"/, 'bande rouille décorative qui défile en 40 s');
  assert.match(f, /class="marquee-track ocre-nom font-body"/);
  assert.match(f, /\/services\/\$\{s\.slug\}/, 'les pages des prestations');
  assert.match(f, /\{\(adresse \|\| horaires\.length > 0\) && \(/);
  assert.match(f, /\{reseaux\.length > 0 && \(/);
  assert.match(f, /\/mentions-legales/);
  assert.match(f, /site\.legal\.demo && /);
  assert.doesNotMatch(f, /<Icon\b/);
});

test('presets/ocre.json : modèle de site entier, fin de page de la source, pas de barre basse ; deuxième modèle différent', () => {
  const m = JSON.parse(lire('presets/ocre.json'));
  assert.equal(m.nom, 'ocre');
  assert.equal(m.look.direction, 'ocre');
  assert.equal(m.look.layout.hero, 'ocre');
  assert.equal(m.look.layout.footer, 'ocre');
  assert.deepEqual(m.look.layout.sections.map((x) => `${x.type}/${x.variant}`), ['about/ocre', 'services/ocre', 'proof/ocre', 'contact/ocre']);
  assert.equal(m.look.layout.actionBar, false);
  const b = JSON.parse(lire('presets/ocre-boutique.json'));
  assert.equal(b.look.direction, 'ocre');
  assert.notEqual(b.look.layout.hero, 'ocre');
  assert.notEqual(b.look.layout.footer, 'ocre', 'pied différent entre les deux modèles de la direction');
  assert.equal(JSON.parse(lire('presets/enduit-chantier.json')).look.layout.footer, 'ocre', 'le pied ocre sert aussi un autre modèle');
});

test('direction ocre : polices libres hors liste IA, sable et bloc d’encre rouille (coloré doux), rayon 0', async () => {
  const css = lire('src/directions/ocre/index.css');
  const { POLICES_IA } = await import('../scripts/ff/ia.mjs');
  for (const fam of [...css.matchAll(/--font-(?:display|body|mono):\s*'([^']+)'/g)].map((x) => x[1])) {
    assert.ok(!POLICES_IA.some((p) => fam.toLowerCase().startsWith(p)), fam);
  }
  assert.match(css, /--font-display: 'Gelasio Variable'/);
  assert.match(css, /--font-body: 'Mulish Variable'/);
  assert.match(css, /--bg: #eee3d4;/);
  assert.match(css, /--radius-card: 0px;/);
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  assert.equal(regimePalette(JSON.parse(lire('docs/veille/styles/atomes/ocre.json')).couleurs).regime, 'colore-doux');
});

test('profil de mouvement nom-qui-defile-au-pied : documenté, porté par l’atome, refusé à un client calme', async () => {
  const { PROFILS_MOUVEMENT, refusProfil } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['nom-qui-defile-au-pied'];
  assert.ok(p);
  assert.equal(p.calme, false, 'une chose bouge seule');
  assert.deepEqual(p.exige, {});
  assert.ok(refusProfil('nom-qui-defile-au-pied', { mouvement: 'calme' }));
  assert.equal(refusProfil('nom-qui-defile-au-pied', {}), null);
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `nom-qui-defile-au-pied`/);
  assert.equal(JSON.parse(lire('docs/veille/styles/atomes/ocre.json')).mouvement.profil, 'nom-qui-defile-au-pied');
});
