// Heros de famille de premier écran (.claude/skills/site-final/premiers-ecrans.md) : carte-sur-photo, mosaique,
// editorial, numero-geant, preuve-d-abord, plan-et-lieu. Né du 29 oct 2026 (« c'est monotone, sans photo, toujours la
// même disposition ») : ff melanger tirait une famille sur treize mais n'en rendait que trois. Ici : le socle de
// docs/GOUT.md § 0 dans chaque variante, l'absence des signes IA, les données qu'elles exigent (HERO_DE_FAMILLE,
// varianteCompatible) et deux fumigènes de build sur _exemple.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadSchemaModule, cleanTmp, ROOT } from '../scripts/ff/ts-loader.mjs';
import { profilClient, donneesDuSite, heroDeFamille, layoutEssai, HERO_DE_FAMILLE, refusFamille } from '../scripts/ff/melanger.mjs';
import { varianteCompatible } from '../scripts/ff/composer.mjs';
import { parseSchemaConstants } from '../scripts/ff/look-data.mjs';

const { VARIANTS, HEROS_DE_FAMILLE } = await loadSchemaModule();
after(() => cleanTmp());

const lire = (v) => fs.readFileSync(path.join(ROOT, 'src', 'sections', 'Hero', `${v}.astro`), 'utf8');
/** Sans commentaires (frontmatter /** *\/, JSX {/* *\/}, HTML <!-- -->) : on teste le code, pas sa doc. */
const code = (v) => lire(v).replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');

test('les six heros de famille sont enregistrés (VARIANTS.hero, HEROS_DE_FAMILLE, HERO_SIZES, docs/DIRECTIONS.md)', () => {
  assert.deepEqual([...HEROS_DE_FAMILLE].sort(), ['carte-sur-photo', 'editorial', 'mosaique', 'numero-geant', 'plan-et-lieu', 'preuve-d-abord']);
  const images = fs.readFileSync(path.join(ROOT, 'src', 'lib', 'images.ts'), 'utf8');
  const doc = fs.readFileSync(path.join(ROOT, 'docs', 'DIRECTIONS.md'), 'utf8');
  for (const v of HEROS_DE_FAMILLE) {
    assert.ok(VARIANTS.hero.includes(v), `${v} dans VARIANTS.hero`);
    assert.ok(fs.existsSync(path.join(ROOT, 'src', 'sections', 'Hero', `${v}.astro`)), `${v}.astro`);
    assert.match(images, new RegExp(`'?${v}'?: '`), `HERO_SIZES['${v}'] (même sizes que le préchargement de Base.astro)`);
    assert.match(doc, new RegExp(`\\| \`${v}\` \\|`), `ligne ${v} dans docs/DIRECTIONS.md`);
  }
  assert.deepEqual(parseSchemaConstants().HEROS_DE_FAMILLE, [...HEROS_DE_FAMILLE], 'parseSchemaConstants lit la même liste');
});

for (const v of ['carte-sur-photo', 'mosaique', 'editorial', 'numero-geant', 'preuve-d-abord', 'plan-et-lieu']) {
  test(`hero/${v} : socle (h1 de l'accroche, métier et ville, téléphone cliquable) et aucun signe IA`, () => {
    const src = code(v);
    assert.match(src, /<h1[^>]*set:html=\{site\.business\.tagline\}/, 'h1 = business.tagline');
    assert.match(src, /metierEtVille\(\)/, 'métier et ville juste sous le h1 (jamais un surtitre au-dessus)');
    assert.ok(src.indexOf('<h1') < src.indexOf('metierEtVille()'), 'la ligne métier vient après le h1');
    assert.doesNotMatch(src, /hero-metier/, 'pas de surtitre métier au-dessus du h1 (GOUT § 2)');
    assert.match(src, /href=\{tel\(\)\}/, 'lien tel: visible au premier écran');
    assert.match(src, /site\.contact\.phoneDisplay/);
    assert.doesNotMatch(src, /uppercase|tracking-|(?<![-\w])italic\b|rounded-full|999px|radius-pill|data-grain|eyebrow/, 'ni capitales espacées, ni italique, ni pilule, ni grain');
    assert.doesNotMatch(src, /[·—]/, 'ni point médian ni tiret cadratin');
    assert.doesNotMatch(src, /<img\b/, 'photos par <Img> (manifeste, AVIF/WebP)');
    assert.doesNotMatch(src, /font-family\s*:|#[0-9a-f]{3,8}\b/i, 'tokens seulement');
    assert.doesNotMatch(src, /class="(?:[^"]*\s)?card\s[^"]*bg-ink/, '.card est restylée par les directions : jamais sur un fond encre');
    assert.doesNotMatch(src, /\+\s*\d+\s*clients|100\s*%|satisfaits/, 'aucun chiffre inventé');
    // Une photo animée par data-parallax déborde de son cadre (sinon le fond apparaît en haut quand elle glisse).
    for (const m of src.matchAll(/<Img [^>]*data-parallax[^>]*>/g)) assert.match(m[0], /-top-\[8%\] h-\[116%\]/, `${v} : image parallaxe plus haute que son cadre`);
  });
}

test('hero/mosaique : grilles écrites pour 4, 5 et 6 photos, couverture d’abord, rangée simple en dessous de 4', () => {
  const src = code('mosaique');
  assert.match(src, /const grille = n >= 4/);
  for (const k of [4, 5, 6]) assert.match(src, new RegExp(`\\.mos-n${k} \\{ grid-template-areas:`), `grille n${k}`);
  assert.match(src, /site\.images\.hero \? \[site\.images\.hero\] : \[\]\), \.\.\.photosDuSite\(\)\]\.slice\(0, 6\)/);
  assert.match(src, /mos-rangee/);
});

test('hero/preuve-d-abord : avis jamais coupés ni réécrits, note seulement si proof.google', () => {
  const src = code('preuve-d-abord');
  assert.match(src, /\[\.\.\.site\.proof\.testimonials\]\.sort\(\(a, b\) => a\.text\.length - b\.text\.length\)\.slice\(0, 2\)/);
  assert.match(src, /\{t\.text\}/);
  assert.doesNotMatch(src, /t\.text\.slice|line-clamp/, 'un avis se lit en entier');
  assert.match(src, /\{google && \(/);
  assert.match(src, /via \{t\.source\}/, 'chaque avis dit son origine');
});

test('hero/plan-et-lieu : horaires du jour, adresse, itinéraire et accès seulement s’ils existent', () => {
  const src = code('plan-et-lieu');
  assert.match(src, /<HorairesDuJour/);
  assert.match(src, /site\.contact\.acces/);
  assert.match(src, /\{acces\.length > 0 && \(/);
  assert.match(src, /\{site\.contact\.mapsUrl && /, 'pas de lien Itinéraire sans mapsUrl');
  assert.match(src, /<Carte \/>/, 'carte sans traceur quand il n’y a pas de photo du lieu');
});

test('schéma : contact.acces (mode, détail) vide par défaut', async () => {
  const { siteSchema } = await loadSchemaModule();
  const c = siteSchema.shape.contact.parse({ phone: '+33', phoneDisplay: '0', address: { postalCode: '59100', city: 'Roubaix' } });
  assert.deepEqual(c.acces, []);
  const src = fs.readFileSync(path.join(ROOT, 'src', 'lib', 'schema.ts'), 'utf8');
  assert.match(src, /acces: z\s*\.array\(z\.object\(\{ mode: z\.string\(\)\.describe/);
});

test('HERO_DE_FAMILLE : une famille n’est rendue que si le client a les données de sa variante', () => {
  const vide = profilClient();
  for (const f of ['carte-sur-photo', 'mosaique', 'numero-geant', 'preuve-d-abord', 'plan-et-lieu']) assert.equal(HERO_DE_FAMILLE[f](vide), null, `${f} sans données`);
  assert.equal(HERO_DE_FAMILLE.editorial(vide), 'editorial', 'editorial se replie sans photo');
  assert.equal(HERO_DE_FAMILLE['carte-sur-photo'](profilClient({ couverture: true, largeurMax: 1200 })), null, 'photo trop petite');
  assert.equal(HERO_DE_FAMILLE['carte-sur-photo'](profilClient({ couverture: true, largeurMax: 2400 })), 'carte-sur-photo');
  assert.equal(HERO_DE_FAMILLE['carte-sur-photo'](profilClient({ couverture: false, largeurMax: 2400 })), null, 'photo pas déclarée en images.hero');
  assert.equal(HERO_DE_FAMILLE.mosaique(profilClient({ photosSite: 3 })), null);
  assert.equal(HERO_DE_FAMILLE.mosaique(profilClient({ photosSite: 4 })), 'mosaique');
  assert.equal(HERO_DE_FAMILLE['numero-geant'](profilClient({ urgence: true })), 'numero-geant');
  assert.equal(HERO_DE_FAMILLE['preuve-d-abord'](profilClient({ avis: 80, temoignages: 1 })), null, 'deux avis écrits');
  assert.equal(HERO_DE_FAMILLE['preuve-d-abord'](profilClient({ avis: 80, temoignages: 2 })), 'preuve-d-abord');
  assert.equal(HERO_DE_FAMILLE['plan-et-lieu'](profilClient({ adresse: true, horaires: 0 })), null);
  assert.equal(HERO_DE_FAMILLE['plan-et-lieu'](profilClient({ adresse: true, horaires: 2 })), 'plan-et-lieu');
  assert.equal(HERO_DE_FAMILLE['bande-defilante'], undefined, 'hero/marquee fait défiler des mots, pas des images');
  assert.ok(refusFamille('plan-et-lieu', vide), 'la famille plan-et-lieu n’est pas tirée sans adresse ni horaires');
  assert.equal(refusFamille('plan-et-lieu', profilClient({ adresse: true, horaires: 1 })), null);
  for (const h of Object.values(HERO_DE_FAMILLE).map((f) => f(profilClient({ couverture: true, largeurMax: 4000, photosSite: 9, urgence: true, avis: 90, temoignages: 3, adresse: true, horaires: 3, video: 'client' })))) {
    assert.ok(VARIANTS.hero.includes(h), `${h} est une variante enregistrée`);
  }
});

test('donneesDuSite : photos déclarées sans doublon, avis, horaires, adresse, urgence', () => {
  const site = {
    images: { hero: { src: '/h.webp' } },
    about: { portrait: { src: '/p.webp' }, espaces: [] },
    proof: { google: { count: 37 }, testimonials: [{}, {}], gallery: [{ src: '/g1.webp' }, { src: '/h.webp' }] },
    realisations: [{ photos: [{ src: '/r.webp' }] }],
    services: [{ image: { src: '/s.webp' }, images: [] }, {}],
    contact: { hours: [{}, {}], address: { street: '12 rue', city: 'Roubaix' }, emergency24h: false },
  };
  assert.deepEqual(donneesDuSite(site), { couverture: true, photosSite: 5, temoignages: 2, horaires: 2, adresse: true, avis: 37 });
  assert.deepEqual(donneesDuSite(null), {});
  assert.equal(donneesDuSite({ contact: { emergency24h: true } }).urgence, true);
});

test('heroDeFamille / layoutEssai : hero écrit quand rendable, la raison sinon', () => {
  const riche = profilClient({ photosSite: 6, avis: 50, temoignages: 2 });
  assert.equal(heroDeFamille({ famille: 'mosaique', client: riche }).hero, 'mosaique');
  assert.match(heroDeFamille({ famille: 'mosaique', client: profilClient() }).note, /avec les données du client/);
  assert.match(heroDeFamille({ famille: 'outil', client: riche }).note, /pas de hero partagé pour cette famille, celui du site/);
  assert.match(heroDeFamille({ famille: 'mosaique', client: riche, shell: 'carte', heroRendu: (s) => s !== 'carte' }).note, /dessine son propre premier écran/);
  assert.deepEqual(heroDeFamille({}), { hero: null, note: null });
  assert.equal(layoutEssai({ famille: 'preuve-d-abord', client: riche }).layout.hero, 'preuve-d-abord');
});

test('composer : les heros de famille demandent leurs données et ne sont jamais tirés au moins-utilisé', () => {
  const vide = { services: [{}], contact: {} };
  for (const h of ['carte-sur-photo', 'mosaique', 'numero-geant', 'preuve-d-abord', 'plan-et-lieu']) assert.equal(varianteCompatible('hero', h, vide), false, h);
  const plein = {
    images: { hero: { src: '/h.webp' } },
    proof: { google: { rating: 4.8 }, testimonials: [{}, {}], gallery: [{ src: '/a.webp' }, { src: '/b.webp' }, { src: '/c.webp' }] },
    services: [{ image: { src: '/s.webp' } }],
    contact: { emergency24h: true, address: { street: '1 rue' }, hours: [{}] },
  };
  for (const h of HEROS_DE_FAMILLE) assert.equal(varianteCompatible('hero', h, plein), true, h);
  const composer = fs.readFileSync(path.join(ROOT, 'scripts', 'ff', 'composer.mjs'), 'utf8');
  assert.match(composer, /!HEROS_DE_FAMILLE\.includes\(h\) && varianteCompatible\('hero', h, cfg\)/);
});

/** Construit _exemple avec un hero (FF_LOOK) et rend le HTML de l'accueil (dossier de sortie supprimé ensuite). */
function construire(hero) {
  const outDir = `dist/_test-hero-${hero}`;
  const res = spawnSync(process.execPath, [path.join(ROOT, 'node_modules', 'astro', 'astro.js'), 'build'], {
    cwd: ROOT, encoding: 'utf8', timeout: 170_000,
    env: { ...process.env, SITE: '_exemple', FF_LOOK: JSON.stringify({ layout: { hero } }), FF_OUT: outDir },
  });
  if (res.status !== 0) { console.log(res.stdout); console.log(res.stderr); }
  assert.equal(res.status, 0, 'le build a échoué (voir la sortie ci-dessus)');
  const html = fs.readFileSync(path.join(ROOT, outDir, 'index.html'), 'utf8');
  fs.rmSync(path.join(ROOT, outDir), { recursive: true, force: true });
  return html.match(/<section id="hero"[\s\S]*?<\/section>/)?.[0] ?? '';
}

test('fumigène : _exemple en preuve-d-abord rend la note, les deux avis entiers et le téléphone', { timeout: 180_000 }, () => {
  const s = construire('preuve-d-abord');
  assert.ok(s, 'section hero absente');
  assert.match(s, /<h1[^>]*hero-titre/);
  assert.match(s, /href="tel:\+33600000000"/);
  assert.match(s, /4,9/);
  assert.match(s, /37\savis sur Google/);
  assert.equal((s.match(/<figure[^>]*pda-carte/g) || []).length, 2, 'deux avis');
  assert.match(s, /Escalier en chêne posé en une journée\. Le résultat est superbe\./, 'avis recopié tel quel');
  assert.match(s, /Menuisier-ébéniste à Roubaix et alentours\./);
});

test('fumigène : _exemple en mosaique (4 réalisations, pas de couverture) rend la grille à 4 et la case du titre', { timeout: 180_000 }, () => {
  const s = construire('mosaique');
  assert.match(s, /mos-grille mos-n4/);
  assert.equal((s.match(/<figure[^>]*mos-photo/g) || []).length, 4);
  assert.match(s, /grid-area: ?t/);
  assert.match(s, /href="tel:\+33600000000"/);
});
