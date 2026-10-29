// Style construit « enduit » (veille du 29 oct 2026, volet 2a quater, source bcgbuildingdesign.com.au, fiche
// docs/veille/styles/enduit.md) : la construction relevée est codée (premier écran, présentation au nom géant, index à photo
// centrale, avis entre deux photos, pied crème au nom géant, modèle de site entier, profil de mouvement), régime clair teinté doux.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');

test('Hero/enduit : photo plein cadre, phrase en bas à gauche, métier à ville, téléphone, aucun mouvement', () => {
  const src = sansCommentaires(lire('src/sections/Hero/enduit.astro'));
  assert.match(src, /set:html=\{site\.business\.tagline\}/, 'la phrase est business.tagline');
  assert.match(src, /items-end/, 'phrase posée en bas');
  assert.match(src, /metierEtVille\(\)/, 'métier et ville sous la phrase (GOUT § 0)');
  assert.match(src, /href=\{tel\(\)\}/, 'téléphone au premier écran');
  assert.match(src, /\{hero && \(/, 'photo seulement si le client en a une (sinon aplat brun)');
  assert.match(src, /bg-ink/);
  assert.doesNotMatch(src, /·/, 'pas de point médian (signe IA)');
  assert.doesNotMatch(src, /autoplay|data-split|data-parallax|data-reveal/, 'immobile');
});

test('About/enduit : phrase centrée à côté de sa photo, bande brune, nom géant qui monte une fois, rien d’inventé', () => {
  const src = sansCommentaires(lire('src/sections/About/enduit.astro'));
  assert.match(src, /id="about"/);
  assert.match(src, /a\.portrait \?\? galerie\[0\]/, 'photo du client seulement');
  assert.match(src, /\{photo && \(/);
  assert.match(src, /bg-ink text-on-ink/, 'bande brune');
  assert.match(src, /data-nom-tranches/);
  assert.match(src, /sr-only">\{nom\}/, 'le nom reste lisible par les lecteurs d’écran');
  assert.match(src, /prefers-reduced-motion: reduce/, 'nom posé d’emblée en mouvement réduit');
  assert.match(src, /\.enduit-pret \.enduit-tranche > span \{ transform: translateY\(105%\)/, 'l’état caché n’existe que sous la classe posée par le script');
  assert.match(src, /io\.disconnect\(\)/, 'une seule fois');
  assert.match(src, /onPage\(/);
  assert.doesNotMatch(src, /aspect-\[\d\/5\]/, 'pas de « 4/5 » dans le HTML (lu comme une note par ff ressemblance)');
});

test('Services/enduit : index à photo centrale, survol et clavier, pile au téléphone, titres partagés, rien d’inventé', () => {
  const src = sansCommentaires(lire('src/sections/Services/enduit.astro'));
  assert.match(src, /title=\{site\.wording\.servicesTitle\}/);
  assert.match(src, /metierEtVille\(\)/);
  assert.match(src, /site\.services/);
  assert.match(src, /services\.filter\(\(s\) => s\.image\)/, 'photo du milieu seulement pour les services qui en ont une');
  assert.match(src, /\{avecPhoto\.length > 0 && \(/, 'sans photo, la liste seule');
  assert.match(src, /pointerenter/);
  assert.match(src, /focusin/, 'le clavier active aussi la ligne');
  assert.match(src, /md:hidden/, 'au téléphone, chaque ligne sous sa photo');
  assert.match(src, /s\.priceFrom \?\? 'Voir'/, 'prix seulement s’il est donné');
  assert.match(src, /\/services\/\$\{s\.slug\}/, 'chaque ligne mène à sa page');
  assert.match(src, /s\.featured && s\.image && s\.description/, 'bloc approche seulement avec la prestation phare complète');
  assert.match(src, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(src, /<Icon\b/, 'pas d’icône à la place d’une photo');
  assert.doesNotMatch(src, /data-scrub|data-parallax|data-pin/, 'rien ne suit le défilement');
});

test('Proof/enduit : un avis à la fois entre deux photos, piste native focusable, rien sans avis', () => {
  const src = sansCommentaires(lire('src/sections/Proof/enduit.astro'));
  assert.match(src, /id="proof"/);
  assert.match(src, /\{\(avis\.length > 0 \|\| google\) && \(/);
  assert.match(src, /site\.proof\.testimonials\.slice\(0, 3\)/);
  assert.match(src, /snap-x snap-mandatory overflow-x-auto/);
  assert.match(src, /tabindex="0"/, 'zone qui défile atteignable au clavier');
  assert.match(src, /data-avis-pas="-1"/);
  assert.doesNotMatch(src, /<Icon\b|★|class="[^"]*\bcard\b/, 'ni icône, ni étoile, ni carte');
});

test('Contact/enduit : la page finit sur le crème, colonnes, formulaire à plat, nom géant brun, chaque ligne sans donnée disparaît', () => {
  const src = sansCommentaires(lire('src/sections/Contact/enduit.astro'));
  assert.match(src, /id="contact"/);
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /\{horaires\.length > 0 && \(/);
  assert.match(src, /\{adresse && /);
  assert.match(src, /\{formulaire && \(/);
  assert.match(src, /\{reseaux\.length > 0 && \(/);
  assert.match(src, /enduit-nom-pied/);
  assert.doesNotMatch(src, /bg-ink|<Icon\b/, 'aucun bandeau sombre, aucune icône');
});

test('presets/enduit.json : modèle de site entier, fin de page de la source, pas de barre basse ; deuxième modèle différent', () => {
  const m = JSON.parse(lire('presets/enduit.json'));
  assert.equal(m.nom, 'enduit');
  assert.equal(m.look.direction, 'enduit');
  assert.equal(m.look.layout.hero, 'enduit');
  assert.equal(m.look.layout.nav, 'minimal', 'la porte Appeler en haut');
  const types = m.look.layout.sections.map((x) => `${x.type}/${x.variant}`);
  assert.deepEqual(types, ['about/enduit', 'services/enduit', 'proof/enduit', 'contact/enduit']);
  for (const t of ['zones', 'faq', 'cta']) assert.ok(!m.look.layout.sections.some((x) => x.type === t), `pas de ${t} : la source n’en a pas`);
  assert.equal(m.look.layout.actionBar, false);
  const b = JSON.parse(lire('presets/enduit-chantier.json'));
  assert.equal(b.look.direction, 'enduit');
  assert.notEqual(b.look.layout.hero, 'enduit');
});

test('direction enduit : une seule grotesque libre hors liste IA, crème teinté (clair teinté doux), rayon presque nul', async () => {
  const css = lire('src/directions/enduit/index.css');
  const { POLICES_IA } = await import('../scripts/ff/ia.mjs');
  for (const fam of [...css.matchAll(/--font-(?:display|body|mono):\s*'([^']+)'/g)].map((x) => x[1])) {
    assert.equal(fam, 'Host Grotesk Variable');
    assert.ok(!POLICES_IA.some((p) => fam.toLowerCase().startsWith(p)), fam);
  }
  assert.match(css, /--bg: #f3ede4;/);
  assert.match(css, /--radius-card: 0px;/);
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  const atome = JSON.parse(lire('docs/veille/styles/atomes/enduit.json'));
  assert.equal(regimePalette(atome.couleurs).regime, 'clair-teinte');
});

test('profil de mouvement index-qui-change-la-photo : calme, sans exigence, documenté, porté par l’atome', async () => {
  const { PROFILS_MOUVEMENT, refusProfil } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['index-qui-change-la-photo'];
  assert.ok(p);
  assert.equal(p.calme, true);
  assert.deepEqual(p.exige, {});
  assert.equal(refusProfil('index-qui-change-la-photo', { mouvement: 'calme', video: null, largeurMax: 0, avis: 0 }), null);
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `index-qui-change-la-photo`/);
  assert.equal(JSON.parse(lire('docs/veille/styles/atomes/enduit.json')).mouvement.profil, 'index-qui-change-la-photo');
});
