// Style frenchette (docs/veille/styles/frenchette.md § Construction, 29 oct 2026) : la construction d'un vrai site codée
// en entier dans l'usine : direction `frenchette`, hero/panneaux-biais, services/panneaux-biais, modèle presets/frenchette.json.
// Ici : enregistrement partout, socle de docs/GOUT.md § 0, aucun signe IA, la coupe en biais (clip-path) des deux côtés,
// le modèle pose tout d'un coup, et un fumigène de build sur _exemple.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadSchemaModule, cleanTmp, ROOT } from '../scripts/ff/ts-loader.mjs';
import { varianteCompatible } from '../scripts/ff/composer.mjs';
import { CLES_IA, analyserDirection } from '../scripts/ff/ia.mjs';

const { VARIANTS, DIRECTIONS, HEROS_DE_FAMILLE } = await loadSchemaModule();
after(() => cleanTmp());

const lire = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
/** Sans commentaires : on teste le code, pas sa doc. */
const code = (rel) => lire(rel).replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');

test('frenchette : direction, hero et services enregistrés (DIRECTIONS, VARIANTS, HEROS_DE_FAMILLE, HERO_SIZES, docs, fiche)', () => {
  assert.ok(DIRECTIONS.includes('frenchette'));
  assert.ok(VARIANTS.hero.includes('panneaux-biais'));
  assert.ok(VARIANTS.services.includes('panneaux-biais'));
  // Posé par son modèle, jamais tiré au moins-utilisé par ff composer : soit listé dans HEROS_DE_FAMILLE, soit refusé sans photo.
  assert.ok(HEROS_DE_FAMILLE.includes('panneaux-biais') || !varianteCompatible('hero', 'panneaux-biais', {}));
  assert.match(lire('src/lib/images.ts'), /'panneaux-biais': '100vw'/);
  const doc = lire('docs/DIRECTIONS.md');
  assert.match(doc, /\| \*\*frenchette\*\* \|/);
  assert.equal((doc.match(/\| `panneaux-biais` \|/g) || []).length, 2, 'une ligne hero, une ligne services');
  assert.match(lire('docs/veille/styles/frenchette.md'), /## Construction/, 'une fiche sans « Construction » n’est pas une fiche');
  assert.match(lire('src/directions/frenchette/meta.ts'), /source: "https:\/\/www\.frenchettenyc\.com\/"/);
});

test('direction frenchette : Josefin Sans (hors liste IA), contours, angles droits, aucune ombre, pas d’italique', () => {
  const css = lire('src/directions/frenchette/index.css');
  assert.match(css, /@import '@fontsource-variable\/josefin-sans'/);
  assert.ok(!CLES_IA.includes('josefin'));
  assert.deepEqual(analyserDirection(css).echecs, []);
  assert.deepEqual(analyserDirection(css).alertes, []);
  assert.match(css, /--radius: 0px;/);
  assert.match(css, /--shadow-card: none;/);
  assert.match(css, /--heading-transform: uppercase;/);
  assert.match(css, /\.btn \{[^}]*border: 2px solid var\(--fg\)/);
  assert.doesNotMatch(css, /font-style:\s*italic/);
  assert.doesNotMatch(css, /999px/);
  // Mesure de la source : interlettrage faible, jamais des capitales espacées.
  for (const m of css.matchAll(/letter-spacing:\s*([\d.]+)em/g)) assert.ok(parseFloat(m[1]) <= 0.02, `letter-spacing ${m[1]}em`);
});

test('hero/panneaux-biais : socle (h1, métier et ville, téléphone cliquable), panneau coupé en biais, aucun signe IA', () => {
  const src = code('src/sections/Hero/panneaux-biais.astro');
  assert.match(src, /<h1[^>]*set:html=\{site\.business\.tagline\}/);
  assert.match(src, /metierEtVille\(\)/);
  assert.ok(src.indexOf('<h1') < src.indexOf('metierEtVille()'), 'la ligne métier vient après le h1');
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /site\.contact\.phoneDisplay/);
  assert.match(src, /\{since && <p[^>]*>Depuis \{since\}<\/p>\}/, 'ancienneté en texte, seulement si le brief la donne');
  assert.match(src, /HERO_SIZES\['panneaux-biais'\]/);
  assert.match(src, /clip-path: polygon\(8% 0, 100% 0, 100% 100%, 0 100%\)/, 'bord gauche penché de 8 % (ordinateur, panneau à droite)');
  assert.match(src, /clip-path: polygon\(0 0, 100% 0, 100% calc\(100% - 2\.75rem\), 0 100%\)/, 'bas penché qui mord sur la photo (téléphone, panneau d’abord comme la source)');
  assert.ok(src.indexOf('pb-panneau') < src.indexOf('pb-photo'), 'le panneau précède la photo');
  assert.match(src, /right: calc\(var\(--pb-panneau\) \* 0\.92\)/, 'ordinateur : la photo s’arrête à la coupe, pas une carte posée sur la photo');
  assert.match(src, /hero \? 'bg-bg-2' : 'bg-ink'/, 'sans photo : fond encre, rien d’inventé');
  assert.doesNotMatch(src, /uppercase|tracking-|(?<![-\w])italic\b|rounded-full|999px|radius-pill|data-grain|eyebrow/);
  assert.doesNotMatch(src, /[·—]/);
  assert.doesNotMatch(src, /<img\b/);
  assert.doesNotMatch(src, /font-family\s*:|#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(src, /data-parallax|data-marquee|data-frames|autoplay/, 'rien ne bouge tout seul');
  assert.equal(varianteCompatible('hero', 'panneaux-biais', { services: [{}], contact: {} }), false);
  assert.equal(varianteCompatible('hero', 'panneaux-biais', { images: { hero: { src: '/h.webp' } } }), true);
});

test('services/panneaux-biais : un panneau par activité, côté et biais alternés, sans photo un aplat seul', () => {
  const src = code('src/sections/Services/panneaux-biais.astro');
  assert.match(src, /id="services"/);
  assert.match(src, /title=\{site\.wording\.servicesTitle\}/);
  assert.match(src, /metierEtVille\(\)/);
  assert.match(src, /site\.services\.map\(\(s, i\)/);
  assert.match(src, /i % 2 === 1 && 'sv-pb-droite'/, 'le côté alterne');
  assert.match(src, /!s\.image && 'sv-pb-sans'/);
  assert.match(src, /\{s\.image && \(/, 'aucune photo inventée');
  assert.match(src, /\.sv-pb-panneau \{[\s\S]*?clip-path: polygon\(0 0, 100% 0, 92% 100%, 0 100%\)/);
  assert.match(src, /\.sv-pb-droite \.sv-pb-panneau \{[^}]*clip-path: polygon\(0 0, 100% 0, 100% 100%, 8% 100%\)/, 'le sens de la coupe s’inverse à droite');
  assert.match(src, /href=\{`\/services\/\$\{s\.slug\}`\}/);
  assert.match(src, /\{s\.priceFrom && /);
  assert.doesNotMatch(src, /uppercase|tracking-|rounded-full|999px|eyebrow|lucide-check|data-parallax/);
  assert.doesNotMatch(src, /[·—]/);
  assert.doesNotMatch(src, /<img\b/);
  assert.equal(varianteCompatible('services', 'panneaux-biais', { services: [{ image: { src: '/a.webp' } }, {}] }), true);
  assert.equal(varianteCompatible('services', 'panneaux-biais', { services: [{}, {}] }), false);
});

test('presets/frenchette.json : modèle de site entier (direction, hero, ordre des blocs, mouvement calme, barre basse)', () => {
  const p = JSON.parse(lire('presets/frenchette.json'));
  assert.equal(p.nom, 'frenchette');
  assert.equal(p.look.direction, 'frenchette');
  assert.equal(p.look.layout.hero, 'panneaux-biais');
  assert.equal(p.look.motion, 'subtle');
  assert.equal(p.look.layout.actionBar, true, 'téléphone en barre basse au téléphone');
  assert.equal(p.look.layout.tone, 'flat');
  const types = p.look.layout.sections.map((s) => `${s.type}/${s.variant}`);
  assert.deepEqual(types.slice(0, 3), ['about/story', 'cta/band', 'services/panneaux-biais'], 'le mot d’accueil, le bandeau noir Réserver puis les panneaux, comme la source');
  assert.ok(!types.some((t) => t.startsWith('contact/')) && p.look.layout.contactDrawer === true, 'pas de bloc contact sur l’accueil : la demande en tiroir, comme la page de portes de la source');
  assert.equal(p.look.layout.footer, 'columns', 'pied à liens vers les pages (navigation « plusieurs pages », comme la source)');
  assert.ok(!p.look.typography, 'la police est celle de la direction');
});

/** Construit _exemple avec un look (FF_LOOK) et rend le HTML de l'accueil (dossier de sortie supprimé ensuite). */
function construire(look, nom) {
  const outDir = `dist/_test-frenchette-${nom}`;
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

test('fumigène : _exemple avec le modèle frenchette (sans photo) rend le panneau sur encre, les trois aplats et le téléphone', { timeout: 180_000 }, () => {
  const look = JSON.parse(lire('presets/frenchette.json')).look;
  const html = construire(look, 'modele');
  assert.match(html, /data-direction="frenchette"/);
  const hero = html.match(/<section id="hero"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(hero, /<h1[^>]*hero-titre/);
  assert.match(hero, /href="tel:\+33600000000"/);
  assert.match(hero, /bg-ink/, 'sans images.hero : panneau sur encre');
  assert.match(hero, /Menuisier-ébéniste à Roubaix et alentours\./);
  assert.match(hero, /Depuis 2009/);
  const services = html.match(/<section id="services"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.equal((services.match(/<article[^>]*sv-pb-bloc/g) || []).length, 3, 'un panneau par activité');
  assert.equal((services.match(/sv-pb-sans/g) || []).length >= 3, true, 'sans photo : aplats seuls');
  assert.match(services, /href="\/services\/cuisines"/);
  assert.match(html, /data-barre-actions/, 'barre basse');
  assert.doesNotMatch(html, /Josefin Sans Variable.*italic/);
});
