// Style construit « travee » (veille du 31 oct 2026, tour 20, volet 2a quater, source driessenarchitectuur.nl, fiche
// docs/veille/styles/travee.md) : la construction relevée est codée (la travée du premier écran, piste horizontale native au
// doigt et au clavier ; texte d'ouverture rentré ; index des métiers à filets ; réalisations en quinconce dans une piste ;
// l'avis sur la plaque verte ; la fin noire), modèle de site entier, profil de mouvement, régime clair neutre.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');

// Une piste qui suit le doigt : défilement horizontal natif aimanté, jamais de défilement vertical détourné.
function pisteNative(css, sel) {
  const bloc = css.match(new RegExp(`\\${sel} \\{([^}]*)\\}`))?.[1] ?? '';
  assert.match(bloc, /overflow-x: auto/, `${sel} : overflow-x natif`);
  assert.match(bloc, /scroll-snap-type: x mandatory/, `${sel} : aimantée`);
  assert.match(bloc, /touch-action: pan-x pan-y/, `${sel} : le doigt et le défilement vertical passent`);
  assert.match(bloc, /overscroll-behavior-x: contain/, `${sel} : pas de retour arrière du navigateur`);
}

test('Hero/travee : en-tête puis la bande des travées, piste native au doigt et au clavier, métier à ville, téléphone', () => {
  const src = sansCommentaires(lire('src/sections/Hero/travee.astro'));
  assert.match(src, /set:html=\{site\.business\.tagline\}/);
  assert.match(src, /metierEtVille\(\)/, 'métier et ville (GOUT § 0)');
  assert.match(src, /href=\{tel\(\)\}/, 'téléphone au premier écran');
  assert.match(src, /site\.services\.filter\(\(s\) => s\.image\)/, 'les vues : les photos des services');
  assert.match(src, /lien: `\/services\/\$\{s\.slug\}`/, 'chaque vue de service mène à sa page');
  assert.match(src, /tabindex=\{piste \? 0 : undefined\}/, 'clavier : la piste prend le focus');
  assert.match(src, /data-travee-sans-script hidden/, 'les flèches n’existent qu’avec le script');
  pisteNative(src, '.travee-bande');
  assert.match(src, /<div class="contents" data-travee/, 'en-tête et bande : deux blocs de premier niveau');
  assert.match(src, /flex: 0 0 84vw/, 'au téléphone, la travée suivante dépasse du bord');
  assert.match(src, /\{v\.legende && v\.lien && /, 'plaque de la travée seulement pour un service');
  assert.doesNotMatch(src, /radial-gradient|autoplay|setInterval|data-parallax|data-pin|data-horizontal|wheel/, 'rien ne tourne tout seul, aucun défilement détourné');
  assert.match(src, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(src, /·|—/, 'ni point médian ni tiret cadratin');
});

test('src/scripts/travee.ts : confort seulement (flèches, compte, légende, vue du moment), idempotent, mouvement réduit respecté', () => {
  const src = sansCommentaires(lire('src/scripts/travee.ts'));
  assert.match(src, /dataset\.traveePret/, 'idempotent');
  assert.match(src, /prefers-reduced-motion: reduce/);
  assert.match(src, /behavior: doux \? 'smooth' : 'auto'/);
  assert.match(src, /\{ passive: true \}/, 'écouteur de défilement passif');
  assert.match(src, /requestAnimationFrame/);
  assert.match(src, /classList\.toggle\('is-ici'/);
  assert.doesNotMatch(src, /preventDefault|addEventListener\('wheel'|addEventListener\('touchmove'|setInterval|setTimeout/, 'jamais de défilement intercepté ni d’autoplay');
  for (const f of ['Hero', 'Proof']) assert.match(lire(`src/sections/${f}/travee.astro`), /onPage\(initTravees\)/, `${f} passe par onPage`);
});

test('About/travee : texte d’ouverture rentré à la première ligne, rien sans histoire, pas de numérotation', () => {
  const src = sansCommentaires(lire('src/sections/About/travee.astro'));
  assert.match(src, /id="about"/);
  assert.match(src, /\{ouverture && \(/, 'sans histoire, pas de section');
  assert.match(src, /text-indent: 36%/);
  assert.match(src, /\{vignette && \(/, 'vignette seulement avec un portrait du client');
  assert.match(src, /\{hote && /);
  assert.doesNotMatch(src, />\s*1\.\d\s*<|<sup/, 'la numérotation « 1.0 » de la source est refusée');
});

test('Services/travee : index des métiers à filets, chaque ligne vers sa page, prix seulement s’il est donné, sans numéros', () => {
  const src = sansCommentaires(lire('src/sections/Services/travee.astro'));
  assert.match(src, /id="services"/);
  assert.match(src, /title=\{site\.wording\.servicesTitle\}/);
  assert.match(src, /href=\{`\/services\/\$\{s\.slug\}`\}/);
  assert.match(src, /\{s\.priceFrom && /);
  assert.match(src, /border-top: 1px solid var\(--line\)/);
  assert.match(src, /@media \(hover: hover\) and \(pointer: fine\)/, 'le survol qui bouge est réservé à la souris');
  assert.doesNotMatch(src, /String\(i \+ 1\)|padStart|<Icon\b/, 'ni numéros ni icônes');
});

test('Proof/travee : réalisations en quinconce dans une piste native, l’avis sur la plaque verte, rien d’inventé', () => {
  const src = sansCommentaires(lire('src/sections/Proof/travee.astro'));
  assert.match(src, /id="realisations"/);
  assert.match(src, /id="proof"/);
  pisteNative(src, '.travee-piste');
  pisteNative(src, '.travee-avis-piste');
  assert.match(src, /\{piste\.length >= 3 && \(/, 'trois réalisations au moins, sinon pas de piste');
  assert.match(src, /site\.realisations\.length > 0/, 'les réalisations du client d’abord');
  assert.match(src, /COQUILLES_A_INDEX_REALISATIONS/, 'lien seulement quand la page existe');
  assert.match(src, /\['t-grande', 't-carree', 't-haute', 't-large'\]/, 'quatre gabarits en quinconce');
  assert.match(src, /\{p\.type && /);
  assert.match(src, /\{p\.lieu && /);
  assert.match(src, /\{\(avis\.length > 0 \|\| google\) && \(/, 'sans avis ni note, pas de plaque');
  assert.match(src, /background: var\(--vert\)/, 'la plaque verte de la direction');
  assert.match(src, /tabindex="0"/, 'clavier');
  assert.doesNotMatch(src, /★|<Icon\b|aggregateRating/);
});

test('Contact/travee : la fin noire, portes par intention, pas de formulaire, chaque ligne disparaît sans sa donnée', () => {
  const src = sansCommentaires(lire('src/sections/Contact/travee.astro'));
  assert.match(src, /id="contact"/);
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /\{ecrire && /);
  assert.match(src, /\{rdv && /);
  assert.match(src, /\{adresse && \(/);
  assert.match(src, /\{horaires\.length > 0 && \(/);
  assert.match(src, /\{photo && \(/, 'photo seulement si le client en a une');
  assert.match(src, /background: var\(--ink\)/);
  assert.doesNotMatch(src, /ContactForm/, 'fin de la source : pas de formulaire');
});

test('enregistrement : VARIANTS, DIRECTIONS, HERO_SIZES, docs/DIRECTIONS.md', () => {
  const schema = lire('src/lib/schema.ts');
  assert.match(schema, /\n {2}'travee', \/\//, 'DIRECTIONS');
  for (const t of ['hero', 'services', 'about', 'proof', 'contact']) {
    const ligne = schema.match(new RegExp(`\\n  ${t}: \\[([^\\]]*)\\]`))?.[1] ?? '';
    assert.match(ligne, /'travee'/, `VARIANTS.${t}`);
  }
  assert.match(lire('src/lib/images.ts'), /\n {2}travee: '100vw'/);
  const doc = lire('docs/DIRECTIONS.md');
  assert.match(doc, /\| \*\*travee\*\* \|/);
  assert.equal((doc.match(/^\| `travee` \|/gm) || []).length, 5, 'une ligne par variante');
});

test('presets/travee.json : modèle de site entier, fin de la source, pas de barre basse ; deuxième modèle différent', () => {
  const m = JSON.parse(lire('presets/travee.json'));
  assert.equal(m.nom, 'travee');
  assert.equal(m.look.direction, 'travee');
  assert.equal(m.look.layout.hero, 'travee');
  assert.deepEqual(m.look.layout.sections.map((x) => `${x.type}/${x.variant}`), ['about/travee', 'services/travee', 'proof/travee', 'contact/travee']);
  for (const t of ['zones', 'faq', 'cta']) assert.ok(!m.look.layout.sections.some((x) => x.type === t), `pas de ${t}`);
  assert.equal(m.look.layout.actionBar, false);
  assert.equal(m.look.layout.nav, 'floating', 'barre blanche flottante de la source, téléphone dedans');
  const b = JSON.parse(lire('presets/travee-menuisier.json'));
  assert.equal(b.look.direction, 'travee');
  assert.notEqual(b.look.layout.hero, 'travee');
  assert.notEqual(b.look.layout.nav, m.look.layout.nav);
  assert.notEqual(b.look.layout.footer, m.look.layout.footer);
});

test('direction travee : polices libres hors liste IA, angles droits, vert assombri lisible, régime clair neutre', async () => {
  const css = lire('src/directions/travee/index.css');
  const { POLICES_IA } = await import('../scripts/ff/ia.mjs');
  const familles = [...css.matchAll(/--font-(?:display|body|mono):\s*'([^']+)'/g)].map((x) => x[1]);
  assert.deepEqual([...new Set(familles)], ['Anybody Variable', 'Archivo Variable']);
  for (const fam of familles) assert.ok(!POLICES_IA.some((p) => fam.toLowerCase().replace(/ /g, '-').startsWith(p)), fam);
  assert.match(css, /--radius: 0px;/);
  assert.match(css, /--vert: #56724e;/, 'vert assombri : 5,4:1 sous du texte blanc');
  assert.doesNotMatch(css, /999px|9999px/, 'pas de pilule');
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  const atome = JSON.parse(lire('docs/veille/styles/atomes/travee.json'));
  assert.equal(regimePalette(atome.couleurs).regime, 'clair-neutre');
});

test('profil de mouvement travee-au-doigt : calme, sans exigence, documenté, porté par l’atome', async () => {
  const { PROFILS_MOUVEMENT, refusProfil } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['travee-au-doigt'];
  assert.ok(p);
  assert.equal(p.calme, true);
  assert.equal(p.defilement, 'aucun');
  assert.deepEqual(p.exige, {});
  assert.equal(refusProfil('travee-au-doigt', { mouvement: 'calme', video: null, largeurMax: 0, avis: 0 }), null);
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `travee-au-doigt`/);
  assert.equal(JSON.parse(lire('docs/veille/styles/atomes/travee.json')).mouvement.profil, 'travee-au-doigt');
});
