// Style construit « bouteille » (veille du 29 oct 2026, volet 2a quater, source restaurantzimmerl.at, fiche
// docs/veille/styles/bouteille.md) : la construction relevée est bien codée (salle avec le nom, h1 sous la photo, scènes de
// photos décalées surplombées par le titre géant, modèle de site entier, profil de mouvement), régime sombre.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '');

test('Hero/bouteille : nom seul sur la photo de salle, h1 + métier à ville + téléphone dessous, distinctions réelles seulement', () => {
  const src = sansCommentaires(lire('src/sections/Hero/bouteille.astro'));
  assert.match(src, /\{site\.business\.name\}/, 'le nom du commerce sur la photo');
  assert.match(src, /\{hero && \(/, 'pas de photo inventée : sans photo, le nom sur un bandeau encre');
  assert.match(src, /<h1[^>]*set:html=\{site\.business\.tagline\}/, 'h1 sous la photo');
  assert.match(src, /ligneMetier\(\) \|\| metierEtVille\(\)/, 'métier et ville (GOUT § 0)');
  assert.match(src, /href=\{tel\(\)\}/, 'téléphone au premier écran');
  assert.match(src, /<div class="bt-tete[^"]*">\s*<p class="bt-appel"><a href=\{tel\(\)\}/, 'le numéro en première ligne sous la photo (premier écran du téléphone, sans barre basse)');
  assert.match(src, /site\.business\.certifications/, 'distinctions = certifications du client');
  assert.match(src, /google \? \[/, 'note Google seulement si elle existe');
  assert.match(src, /\(distinctions\.length > 0 \|\| logos\.length > 0\) && \(/, 'ligne absente sans distinction ni logo');
  assert.match(src, /prefers-reduced-motion: no-preference/, 'entrée coupée sous « réduire les animations »');
  assert.match(src, /data-motion='none'/, 'entrée coupée en motion none');
  assert.match(src, /@keyframes bt-enseigne \{ from \{ letter-spacing: 0\.34em/, 'enseigne qui se resserre');
  assert.doesNotMatch(src, /autoplay|setInterval/, 'rien ne tourne tout seul (diaporama de la source non repris)');
  // Seconde reprise : la salle tient l'écran, voile sous le nom, emblèmes, deux plans, pas de parallaxe débordante.
  assert.match(src, /\.bt-salle \{ min-height: 86svh; \}/, 'la salle tient l’écran à l’ordinateur');
  assert.match(src, /\.bt-tete \{ position: relative; z-index: 2; margin-top: -24svh; \}/, 'téléphone et emblèmes montés sur le bas de la salle');
  assert.match(src, /radial-gradient\(ellipse 95% 34% at 50% 50%, color-mix\(in srgb, var\(--ink\) 78%/, 'voile dense sous le nom au téléphone');
  assert.match(src, /site\.proof\.logos\.filter\(\(l\) => l\.image\)/, 'logos du client d’abord');
  assert.match(src, /bt-embleme-a[^}]*border-block: 1px solid var\(--accent\)/, 'emblème entre deux filets');
  assert.doesNotMatch(src, /data-parallax/, 'la photo de salle a la hauteur qu’on voit');
  assert.match(src, /calc\(84vw \/ \(var\(--m\) \* 0\.8\)\)/, 'le nom tient sur ses mots, jamais coupé');
});

test('About/bouteille : portrait noir et blanc devant un cadre décalé ; sans portrait, texte centré ; rien d’inventé', () => {
  const src = sansCommentaires(lire('src/sections/About/bouteille.astro'));
  assert.match(src, /const portrait = a\.portrait;/);
  assert.match(src, /\{portrait && \(/, 'portrait seulement s’il est fourni');
  assert.match(src, /ba-cadre/, 'cadre au filet décalé derrière le portrait');
  assert.match(src, /grayscale\(1\)/, 'noir et blanc comme la source');
  assert.match(src, /ba-sans-portrait/, 'disposition sans portrait');
  assert.match(src, /const \[ouverture, \.\.\.suite\] = paragraphs\(a\.story\)/, 'phrase d’ouverture = premier paragraphe du client');
  assert.match(src, /\{ouverture && \(/, 'sans histoire, pas de section');
  assert.match(src, /var\(--accent\)/);
  assert.doesNotMatch(src, /#[0-9a-f]{3,6}\b/i, 'tokens seulement');
});

test('Proof/bouteille : bande de photos qui sort des deux bords, avis et note réels, pas de section vide', () => {
  const src = sansCommentaires(lire('src/sections/Proof/bouteille.astro'));
  assert.match(src, /id="proof"/);
  assert.match(src, /const bande = site\.proof\.gallery\.slice\(0, 6\)/);
  assert.match(src, /\{bande\.length > 0 && \(/, 'pas de photo, pas de bande');
  assert.match(src, /const aDuContenu = bande\.length > 0 \|\| avis\.length > 0 \|\| !!google;/);
  assert.match(src, /\.bp-cadre \{ overflow: hidden; scroll-snap-type: none; display: flex; justify-content: center; \}/, 'plus large que l’écran et centrée : coupée des deux côtés');
  assert.match(src, /bp-haute/, 'hauteurs alternées');
  assert.match(src, /tabindex="0" role="region"/, 'bande défilable au clavier au téléphone');
  assert.doesNotMatch(src, /#[0-9a-f]{3,6}\b/i, 'tokens seulement');
});

test('Services/bouteille : titre géant en surplomb (parallaxe), deuxième photo seulement si fournie, sans photo = liste', () => {
  const src = sansCommentaires(lire('src/sections/Services/bouteille.astro'));
  assert.match(src, /site\.services\.filter\(\(s\) => s\.image\)/, 'scène seulement avec une photo du service');
  assert.match(src, /site\.services\.filter\(\(s\) => !s\.image\)/, 'les autres en liste filetée');
  assert.match(src, /bt-titre-geant[^>]*data-parallax="0\.5"/, 'le titre glisse sur le coin de la photo');
  assert.match(src, /bt-rail/, 'rail à points de la scène B');
  assert.match(src, /grid-template-columns: repeat\(14,/, 'grille de 14 colonnes, marges comprises');
  assert.match(src, /\{s\.priceFrom && /, 'prix seulement s’il est donné');
  assert.match(src, /\/services\/\$\{s\.slug\}/, 'chaque scène mène à sa page');
  assert.match(src, /calc\(88vw \/ \(var\(--n\)/, 'le mot géant tient dans l’écran du téléphone');
  assert.doesNotMatch(src, /<Icon\b/, 'pas d’icône à la place d’une photo absente');
  // Le chiffre géant (seconde reprise) : l'année d'ouverture seulement, jamais une statistique ni un chiffre calculé.
  assert.match(src, /const chiffre = site\.business\.since \? \{ grand: String\(site\.business\.since\), suite: 'ouverture' \} : undefined;/, 'année d’ouverture telle quelle, sinon rien');
  assert.doesNotMatch(src, /google\.count/, 'le nombre d’avis n’est jamais mis en scène comme un chiffre du lieu');
  // Profondeur : la verticale chevauche la photo principale et sort à droite ; repli sur une photo libre de la galerie.
  assert.match(src, /\.bt-scene-a \.bt-photo-1 \{ grid-column: 3 \/ 12; \}/);
  assert.match(src, /\.bt-scene-a \.bt-photo-2 \{ grid-row: 1 \/ span 3; grid-column: 11 \/ 15;[^}]*margin-right: -6vw;[^}]*z-index: 3;/, 'verticale sur le bord de la principale, hors de l’écran');
  assert.match(src, /s\.images\?\.\[0\] \?\? \(i % 2 === 0 \? libres\.shift\(\) : undefined\)/, 'deuxième photo : celle du service, sinon une photo de galerie non montrée');
  assert.match(src, /!dejaVues\.has\(g\.src\)/, 'jamais deux fois la même photo dans les scènes');
  assert.match(src, /i === 0 && chiffre \?/, 'scène du chiffre seulement avec sa donnée, après la première scène');
  assert.match(src, /\.bt-rail \{ position: absolute;/, 'rail visible au téléphone aussi');
  assert.match(src, /margin-top: clamp\(8rem, 16vw, 15rem\)/, 'les vides de la source entre scènes');
  assert.match(src, /<div id="services"/, 'enveloppe : chaque scène est une section sœur');
});

test('Contact/bouteille : plaque au monogramme, coordonnées et horaires réels, formulaire replié', () => {
  const src = sansCommentaires(lire('src/sections/Contact/bouteille.astro'));
  assert.match(src, /id="contact"/);
  assert.match(src, /bc-monogramme/, 'monogramme à cheval sur le bord');
  assert.match(src, /background: var\(--bg-2\)/, 'plaque un ton plus clair (token)');
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /\{horaires\.length > 0 && \(/);
  assert.match(src, /\{adresse && \(/);
  assert.match(src, /<details/, 'formulaire replié');
});

test('presets/bouteille.json : site entier (direction, hero, geste, nav, pied) ; bouteille-cave différent', () => {
  const m = JSON.parse(lire('presets/bouteille.json'));
  assert.equal(m.look.direction, 'bouteille');
  assert.equal(m.look.layout.hero, 'bouteille');
  // Reprise tour 18 : le chef (about/portrait) puis les scènes, comme la source (bloc 4 puis « 23 GÄNGE »).
  assert.deepEqual(m.look.layout.sections.map((x) => `${x.type}/${x.variant}`), ['about/bouteille', 'services/bouteille', 'proof/bouteille', 'contact/bouteille']);
  assert.equal(m.look.motion, 'rich', 'la parallaxe du titre demande rich');
  assert.equal(m.look.layout.sections.at(-1).type, 'contact', 'plaque du contact en dernier, comme la source');
  // Reprise du 29 oct 2026 (tour 18, juge neuf) : la plaque au monogramme, pas la fin d'usine.
  assert.equal(m.look.layout.sections.at(-1).variant, 'bouteille');
  for (const t of ['zones', 'faq', 'cta']) assert.ok(!m.look.layout.sections.some((x) => x.type === t), `pas de ${t} : la source n’en a pas`);
  assert.equal(m.look.layout.actionBar, false, 'pas de barre basse : le téléphone est sous la photo de salle');
  assert.equal(m.look.layout.footer, 'liens', 'pied sur le même fond que la page, comme la source');
  const b = JSON.parse(lire('presets/bouteille-cave.json'));
  assert.equal(b.look.direction, 'bouteille');
  assert.notEqual(b.look.layout.hero, 'bouteille');
});

test('direction bouteille : sombre (color-scheme dark), polices hors liste IA, vert bouteille et cuivre, rien d’italique', () => {
  const css = lire('src/directions/bouteille/index.css');
  assert.match(css, /color-scheme: dark;/);
  assert.match(css, /--bg: #1f2d2d;/);
  assert.match(css, /--accent-h: 27;/);
  for (const fam of [...css.matchAll(/--font-(?:display|body|mono):\s*'([^']+)'/g)].map((x) => x[1])) {
    assert.doesNotMatch(fam, /Inter|Cormorant|Instrument|Playfair|Fraunces|Space Grotesk|DM |Outfit|Jakarta|Syne|Newsreader|Lora|Crimson|IBM Plex|Geist|Source Serif|Manrope/, fam);
  }
  assert.match(css, /h1 em,[\s\S]*?font-style: normal/, 'emphase droite (GOUT § 2)');
  assert.doesNotMatch(css, /999px|9999px/, 'pas de pilule');
});

test('profil enseigne-qui-se-resserre : codé, vivant, tenable sur iPhone (translation seule), documenté', async () => {
  const { PROFILS_MOUVEMENT } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['enseigne-qui-se-resserre'];
  assert.ok(p);
  assert.equal(p.entree, 'enseigne');
  assert.equal(p.apparition, 'titre-en-surplomb');
  assert.deepEqual(p.exige, {});
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `enseigne-qui-se-resserre`/);
  const atome = JSON.parse(lire('docs/veille/styles/atomes/bouteille.json'));
  assert.equal(atome.mouvement.profil, 'enseigne-qui-se-resserre');
  assert.equal(atome.couleurs.principal, 'sombre');
});

test('VARIANTS : about/bouteille et proof/bouteille enregistrées et documentées', async () => {
  const schema = lire('src/lib/schema.ts');
  assert.match(schema, /\n  about: \[[^\]]*'bouteille'/);
  assert.match(schema, /\n  proof: \[[^\]]*'bouteille'/);
  const doc = lire('docs/DIRECTIONS.md');
  assert.match(doc, /### `about`[\s\S]*?\| `bouteille` \|[\s\S]*?### `proof`[\s\S]*?\| `bouteille` \|[\s\S]*?### `zones`/);
});
