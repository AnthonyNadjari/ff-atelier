// Style entier `experimentalcc` (veille 2a quater, 29 oct 2026 : « un style, c'est une construction, pas une peinture »).
// Source experimentalcocktailclub.com, fiche docs/veille/styles/experimentalcc.md § Construction. Ici : la direction, le hero
// portrait-exclusion (socle docs/GOUT.md § 0, nom en texte réel en exclusion, collant, posé en mouvement réduit), les fiches par
// adresse (revendeurs par secteur, sinon lieux, sinon rien ; rien d'inventé), le modèle de site entier, et deux fumigènes de
// build sur _exemple (sans photo : le nom seul ; sans revendeur ni lieu : aucune fiche).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadSchemaModule, cleanTmp, ROOT } from '../scripts/ff/ts-loader.mjs';
import { varianteCompatible } from '../scripts/ff/composer.mjs';
import { analyserDirection, CLES_IA } from '../scripts/ff/ia.mjs';
import { listPresets } from '../scripts/ff/modele.mjs';

const { VARIANTS, DIRECTIONS, HEROS_DE_FAMILLE } = await loadSchemaModule();
after(() => cleanTmp());

const lire = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf8');
/** Sans commentaires : on teste le code, pas sa doc. */
const code = (...p) => lire(...p).replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');

test('direction experimentalcc : enregistrée, noire, Spectral + Karla hors liste IA, terre cuite en encre, angles droits, documentée', () => {
  assert.ok(DIRECTIONS.includes('experimentalcc'));
  const css = lire('src', 'directions', 'experimentalcc', 'index.css');
  assert.match(css, /--bg: #000000;/, 'noir pur : seul fond sur lequel l’exclusion tient');
  assert.match(css, /--ink: #7d3c2c;/, 'la bande terre cuite relevée (#954935, assombrie pour le contraste AA du texte à 70 %)');
  assert.match(css, /--font-display: 'Spectral'/);
  assert.match(css, /--font-body: 'Karla Variable'/);
  assert.match(css, /--radius: 0px;/);
  assert.match(css, /color-scheme: dark;/);
  assert.match(css, /h1 em,\s*\n\[data-direction='experimentalcc'\] h2 em \{ font-style: normal/, 'pas d’emphase en italique (GOUT § 2)');
  assert.doesNotMatch(css, /999px/, 'pas de pilule');
  const ia = analyserDirection(css);
  assert.deepEqual(ia.echecs, [], `signes IA : ${JSON.stringify(ia.echecs)}`);
  assert.ok(!CLES_IA.includes('spectral') && !CLES_IA.includes('karla'));
  assert.match(lire('src', 'directions', 'experimentalcc', 'meta.ts'), /nom: 'experimentalcc'/);
  assert.match(lire('src', 'directions', 'experimentalcc', 'meta.ts'), /experimentalcocktailclub\.com/, 'source citée');
  assert.match(lire('docs', 'DIRECTIONS.md'), /\| \*\*experimentalcc\*\* \|/);
  assert.match(lire('docs', 'veille', 'styles', 'experimentalcc.md'), /\n## Construction/, 'une fiche sans « Construction » n’est pas une fiche');
});

test('hero/portrait-exclusion : enregistré hors des familles, socle, nom en texte réel en exclusion, collant, posé en mouvement réduit', () => {
  assert.ok(VARIANTS.hero.includes('portrait-exclusion'));
  assert.ok(!HEROS_DE_FAMILLE.includes('portrait-exclusion'), 'un hero de style entier, pas une famille de premiers-ecrans.md');
  assert.match(lire('src', 'lib', 'images.ts'), /'portrait-exclusion': '/, 'HERO_SIZES (préchargement LCP de Base.astro)');
  assert.match(lire('docs', 'DIRECTIONS.md'), /\| `portrait-exclusion` \|/);
  const src = code('src', 'sections', 'Hero', 'portrait-exclusion.astro');
  assert.match(src, /<h1[^>]*set:html=\{site\.business\.tagline\}/, 'h1 = business.tagline (le chapô)');
  assert.match(src, /metierEtVille\(\)/);
  assert.ok(src.indexOf('<h1') < src.indexOf('metierEtVille()'), 'métier et ville sous le h1, jamais en surtitre');
  assert.match(src, /href=\{tel\(\)\}/, 'téléphone cliquable au premier écran');
  assert.match(src, /site\.contact\.phoneDisplay/);
  assert.ok(src.indexOf('href={tel()}') < src.indexOf('<figure'), 'le téléphone avant le portrait : visible sans défiler au téléphone');
  assert.match(src, /\{site\.business\.name\}/, 'le nom en texte réel, jamais une image');
  assert.match(src, /mix-blend-mode: exclusion;/);
  assert.match(src, /position: sticky;/, 'le nom colle dans l’écran (profil nom-en-exclusion)');
  assert.match(src, /<p class="pe-nom font-display" data-parallax="0\.6">/, 'la dérive lente par le moteur');
  assert.match(src, /prefers-reduced-motion: reduce[\s\S]*transform: none !important/, 'posé en mouvement réduit');
  assert.match(src, /\{hero && \(/, 'le portrait seulement avec images.hero');
  assert.match(src, /hero-pe:not\(\.pe-avec-portrait\) \.pe-nom \{ position: static;[^}]*mix-blend-mode: normal/, 'sans photo : nom posé, sans exclusion');
  assert.match(src, /paragraphs\(site\.business\.description\)\[0\]/, 'l’ouverture = premier paragraphe de la description');
  assert.doesNotMatch(src, /uppercase|tracking-|(?<![-\w])italic\b|rounded-full|999px|radius-pill|data-grain|eyebrow|data-split/, 'ni capitales espacées, ni italique, ni pilule, ni grain, ni titre révélé (rien n’entre au chargement)');
  assert.doesNotMatch(src, /[·—]/);
  assert.doesNotMatch(src, /<img\b/, 'photos par <Img>');
  assert.doesNotMatch(src, /font-family\s*:|#[0-9a-f]{3,8}\b/i, 'tokens seulement');
  assert.equal(varianteCompatible('hero', 'portrait-exclusion', {}), false, 'composer : jamais sans photo');
  assert.equal(varianteCompatible('hero', 'portrait-exclusion', { images: { hero: { src: '/h.webp' } } }), true);
});

test('zones/fiches : revendeurs par secteur, sinon lieux, sinon rien ; photo, téléphone, marques et porte seulement si donnés', () => {
  assert.ok(VARIANTS.zones.includes('fiches'));
  assert.match(lire('docs', 'DIRECTIONS.md'), /\| `fiches` \|/);
  const src = code('src', 'sections', 'Zones', 'fiches.astro');
  assert.match(src, /id="zones"/);
  assert.match(src, /const secteurs = secteursDe\(site\.revendeurs\);/);
  assert.match(src, /const lieux = secteurs\.length > 0 \? \[\] : site\.lieux;/, 'les lieux seulement sans revendeur');
  assert.match(src, /\{\(secteurs\.length > 0 \|\| lieux\.length > 0\) && \(/, 'aucune donnée = rien');
  assert.match(src, /\{r\.photo && \(/);
  assert.match(src, /\{r\.telephone && /);
  assert.match(src, /\{r\.pression && <span class="fi-marque">À la pression<\/span>\}/);
  assert.match(src, /\{r\.consigne && <span class="fi-marque">Reprend la consigne<\/span>\}/);
  assert.match(src, /r\.lien \? \([\s\S]*\) : pageSecteurs \? \([\s\S]*\) : null/, 'porte : site du revendeur, sinon page du secteur, sinon rien');
  assert.match(src, /telDuLieu\(l, site\.contact\)/, 'lieu : téléphone du lieu, repli sur le numéro principal, jamais deviné');
  assert.doesNotMatch(src, /uppercase|tracking-\[|rounded-full|#[0-9a-f]{3,8}\b|font-family\s*:/i);
  assert.doesNotMatch(src, /\+\s*\d+\s*clients|100\s*% satisf|satisfaits/);
  assert.match(src, /repeat\(3, minmax\(0, 1fr\)\)/, 'trois colonnes à l’ordinateur (la source)');
  // Schéma : les deux champs optionnels des fiches, décrits, jamais remplis d'office.
  const schema = lire('src', 'lib', 'schema.ts');
  assert.match(schema, /telephone: z\.string\(\)\.optional\(\)\.describe\('Téléphone du revendeur/);
  assert.match(schema, /photo: img\.optional\(\)\.describe\('Photo du revendeur/);
  // Nav : avec des revendeurs, la page /ou-trouver reste et l'ancre #zones (doublon) part.
  assert.match(lire('src', 'lib', 'site.ts'), /x\.type === 'zones' && x\.variant === 'fiches'/);
});

test('modèle presets/experimentalcc.json : site entier (direction, hero, ordre des sections, mouvement rich), listé par ff modeles', () => {
  const p = JSON.parse(lire('presets', 'experimentalcc.json'));
  assert.equal(p.look.direction, 'experimentalcc');
  assert.equal(p.look.motion, 'rich');
  assert.equal(p.look.layout.hero, 'portrait-exclusion');
  assert.deepEqual(p.look.layout.sections.map((s) => `${s.type}/${s.variant}`), ['zones/fiches', 'proof/gallery', 'about/story', 'services/list', 'faq/accordion', 'cta/band', 'contact/simple']);
  assert.equal(p.look.layout.sections.filter((s) => s.type === 'cta').length, 1, 'une seule bande encre (terre cuite) par page');
  assert.ok(!p.look.typography && !p.look.accent, 'le style vient de la direction, pas d’une surcharge');
  const noms = listPresets().map((x) => x.nom);
  assert.ok(noms.includes('experimentalcc') && noms.includes('experimentalcc-adresses'));
  assert.match(lire('docs', 'veille', 'styles', 'INDEX.md'), /\| experimentalcc \|[^\n]*`experimentalcc`/, 'INDEX : colonne Direction = la direction codée');
});

/** Construit _exemple avec un look (FF_LOOK) et rend le HTML de l'accueil (dossier de sortie supprimé ensuite). */
function construire(nom, look) {
  const outDir = `dist/_test-experimentalcc-${nom}`;
  const res = spawnSync(process.execPath, [path.join(ROOT, 'node_modules', 'astro', 'astro.js'), 'build'], {
    cwd: ROOT, encoding: 'utf8', timeout: 170_000,
    env: { ...process.env, SITE: '_exemple', FF_LOOK: JSON.stringify(look), FF_OUT: outDir },
  });
  if (res.status !== 0) { console.log(res.stdout); console.log(res.stderr); }
  assert.equal(res.status, 0, 'le build a échoué (voir la sortie ci-dessus)');
  const html = fs.readFileSync(path.join(ROOT, outDir, 'index.html'), 'utf8');
  fs.rmSync(path.join(ROOT, outDir), { recursive: true, force: true });
  return html;
}

test('fumigène : _exemple (sans photo de couverture, sans revendeur ni lieu) en experimentalcc rend le nom seul et aucune fiche', { timeout: 180_000 }, () => {
  const preset = JSON.parse(lire('presets', 'experimentalcc.json'));
  const html = construire('modele', preset.look);
  assert.match(html, /data-direction="experimentalcc"/);
  const hero = html.match(/<section id="hero"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.ok(hero, 'section hero absente');
  assert.doesNotMatch(hero, /pe-avec-portrait/, 'pas de portrait sans images.hero');
  assert.doesNotMatch(hero, /<figure/);
  assert.match(hero, /<h1[^>]*hero-titre/);
  assert.match(hero, /href="tel:\+33600000000"/);
  assert.match(hero, /class="pe-nom font-display" data-parallax="0\.6"[^>]*>Menuiserie Vasseur</, 'le nom en texte réel');
  assert.match(hero, /Menuisier-ébéniste à Roubaix et alentours\./);
  assert.doesNotMatch(html, /id="zones"/, 'aucune fiche sans revendeur ni lieu');
});
