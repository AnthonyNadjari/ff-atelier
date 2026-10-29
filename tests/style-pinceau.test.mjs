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

test('Hero/pinceau : enseigne empilée sur bleu nuit, métier à ville, téléphone, bord brossé, photo plein cadre sous l’enseigne au téléphone', () => {
  const src = sansCommentaires(lire('src/sections/Hero/pinceau.astro'));
  assert.match(src, /set:html=\{site\.business\.tagline\}/, 'le h1 est business.tagline');
  assert.match(src, /bg-ink/, 'bande bleu nuit (token --ink)');
  assert.match(src, /metierEtVille\(\)/, 'métier et ville sous le h1 (GOUT § 0)');
  assert.match(src, /href=\{tel\(\)\}/, 'téléphone au premier écran');
  // Reprise du 29 oct 2026 (tour 18) : la photo plein cadre derrière l'enseigne, comme la source au téléphone ;
  // à l'ordinateur l'aplat seul (la photo descend sur le bord brossé de Services/pinceau).
  assert.match(src, /const photo = site\.images\.hero;/, 'la photo du lieu, seulement si le client en a une');
  assert.match(src, /\{photo && \(\s*<figure class="pinceau-photo[^"]*md:hidden/, 'photo plein cadre sous l’enseigne, au téléphone seulement');
  assert.equal((src.match(/<BordPinceau /g) || []).length, 3, 'la photo tenue entre deux bords brossés, plus le bord terracotta');
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
  assert.match(src, /pb-lieu relative hidden[^"]*md:block/, 'au téléphone la photo est déjà derrière l’enseigne : pas de doublon');
  assert.match(src, /s\.lignes\.length > 0 \? 'nuit'/, 'carte sur bleu nuit seulement avec des lignes');
  assert.match(src, /\{l\.prix && /, 'prix seulement s’il est donné');
  assert.match(src, /\{s\.priceFrom && /);
  assert.match(src, /\.filter\(Boolean\)\.slice\(0, 4\)/, 'photos du service seulement, quatre au plus');
  assert.match(src, /\/services\/\$\{s\.slug\}/, 'chaque bande mène à la page du service');
  assert.match(src, /<BordPinceau /);
  assert.doesNotMatch(src, /<Icon\b/, 'pas d’icône à la place d’une photo absente');
  assert.doesNotMatch(src, /data-split|data-parallax|data-scrub/, 'les titres ne bougent pas, rien ne suit le défilement');
});

test('Proof/pinceau : bande moutarde aux bords brossés, mosaïque et avis du client seulement, rien = pas de bande', () => {
  const src = sansCommentaires(lire('src/sections/Proof/pinceau.astro'));
  assert.match(src, /id="proof"/);
  assert.match(src, /site\.proof\.gallery\.slice\(0, 8\)/, 'huit photos au plus, celles du client');
  assert.match(src, /site\.proof\.testimonials\.slice\(0, 3\)/, 'trois avis recopiés au plus');
  assert.match(src, /const rien = !google && photos\.length === 0 && avis\.length === 0;/);
  assert.match(src, /\{!rien && \(/, 'sans preuve, pas de bande');
  assert.match(src, /<BordPinceau [^>]*avant="var\(--bg\)"/, 'bord brossé à l’entrée');
  assert.match(src, /<BordPinceau couleur="var\(--bg\)"/, 'bord brossé à la sortie');
  assert.doesNotMatch(src, /<Icon\b|★/, 'ni icône ni étoiles dessinées');
});

test('Contact/pinceau : bande bleu nuit, enseigne, téléphone en grand, horaires, formulaire replié, données seulement', () => {
  const src = sansCommentaires(lire('src/sections/Contact/pinceau.astro'));
  assert.match(src, /id="contact"/, 'la porte Devis (/#contact) arrive ici');
  assert.match(src, /bg-ink/);
  assert.match(src, /<BordPinceau /);
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /\{adresse && \(/, 'adresse seulement si elle existe');
  assert.match(src, /\{horaires\.length > 0 && \(/);
  assert.match(src, /site\.form\.provider !== 'none'/, 'formulaire seulement s’il existe');
  assert.match(src, /<details/, 'formulaire replié, pas en tête');
});

test('presets pinceau : modèle de site entier et second modèle différent', () => {
  const m = JSON.parse(lire('presets/pinceau.json'));
  // Reprise du 29 oct 2026 (tour 18, juge neuf) : la fin de page suit la source, pas la fin d'usine.
  const types = m.look.layout.sections.map((x) => `${x.type}/${x.variant}`);
  assert.deepEqual(types, ['services/pinceau', 'proof/pinceau', 'about/portrait', 'contact/pinceau']);
  for (const t of ['zones', 'faq', 'cta']) assert.ok(!m.look.layout.sections.some((x) => x.type === t), `pas de ${t} : la source n’en a pas`);
  assert.equal(m.look.layout.actionBar, false, 'pas de barre basse à 3 boutons : le téléphone est dans la ligne du haut');
  assert.equal(m.look.layout.footer, 'minimal', 'pas de pied en colonnes sombre');
  assert.equal(m.look.layout.servicePage, 'porte', 'la nav nomme chaque offre et mène à sa page, comme la barre de la source');
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
