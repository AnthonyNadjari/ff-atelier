// Architectures entières (src/lib/architectures.ts, docs/veille/architectures/INDEX.md, docs/GOUT.md § 0) : registre
// pur (id → coquille, ordre des sections, données requises, fiche source), `layout.architecture` du schéma
// (completerLayout : un réglage absent prend celui de l'architecture, un réglage écrit gagne), coquilles et sections
// qu'elles apportent, et un fumigène de build par architecture (sites/_exemple + FF_LOOK { layout: { architecture } }).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadArchitecturesModule, loadSchemaModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'Menuisier', tagline: 'Z', description: 'D' },
  contact: { phone: '+33612345678', phoneDisplay: '06 12 34 56 78', email: 'a@b.fr', address: { postalCode: '59000', city: 'Lille' } },
  services: [{ slug: 's', title: 'T', short: 'S' }],
  about: { story: 'S' },
};

/** Build de sites/_exemple avec un look (FF_LOOK) dans dist/<out> ; renvoie { html(page), css, rm }. */
function fumigene(look, out) {
  const astroJs = path.join(ROOT, 'node_modules', 'astro', 'astro.js');
  const outDir = `dist/${out}`;
  const res = spawnSync(process.execPath, [astroJs, 'build'], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 170_000,
    env: { ...process.env, SITE: '_exemple', FF_LOOK: JSON.stringify(look), FF_OUT: outDir },
  });
  if (res.status !== 0) {
    console.log(res.stdout);
    console.log(res.stderr);
  }
  assert.equal(res.status, 0, 'le build a echoue (voir la sortie ci-dessus)');
  const dir = path.join(ROOT, outDir);
  const astroDir = path.join(dir, '_astro');
  const cssFiles = fs.existsSync(astroDir) ? fs.readdirSync(astroDir).filter((f) => f.endsWith('.css')) : [];
  const html = (p = 'index.html') => fs.readFileSync(path.join(dir, p), 'utf8');
  const css = [...cssFiles.map((f) => fs.readFileSync(path.join(astroDir, f), 'utf8')), ...[...html().matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1])].join('\n');
  return { html, css, existe: (p) => fs.existsSync(path.join(dir, p)), rm: () => fs.rmSync(dir, { recursive: true, force: true }) };
}

if (!tsImportable) {
  test('[ignoré] node ne sait pas type-stripper le TS ici', (t) => t.skip());
} else {
  test('registre : chaque architecture a sa coquille dans SHELLS, ses variantes dans VARIANTS, une fiche source qui existe', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS } = await loadArchitecturesModule();
    const { SHELLS, VARIANTS } = await loadSchemaModule();
    assert.deepEqual(Object.keys(ARCHITECTURES).sort(), [...ARCHITECTURE_IDS].sort(), 'ids du registre = ARCHITECTURE_IDS');
    for (const [id, a] of Object.entries(ARCHITECTURES)) {
      assert.equal(a.id, id);
      assert.ok(SHELLS.includes(a.layout.shell), `${id} : coquille ${a.layout.shell} absente de SHELLS`);
      assert.ok(fs.existsSync(path.join(ROOT, 'src', 'shells', `${a.layout.shell}.astro`)), `${id} : src/shells/${a.layout.shell}.astro`);
      assert.ok(VARIANTS.nav.includes(a.layout.nav), `${id} : nav ${a.layout.nav}`);
      assert.ok(VARIANTS.hero.includes(a.layout.hero), `${id} : hero ${a.layout.hero}`);
      assert.ok(VARIANTS.footer.includes(a.layout.footer), `${id} : footer ${a.layout.footer}`);
      for (const s of a.layout.sections) assert.ok(VARIANTS[s.type]?.includes(s.variant), `${id} : section ${s.type}/${s.variant} absente de VARIANTS`);
      assert.ok(a.sources.length >= 1, `${id} : au moins une fiche source`);
      for (const src of a.sources) assert.ok(fs.existsSync(path.join(ROOT, src.fiche)), `${id} : fiche ${src.fiche} introuvable`);
      assert.ok(a.requis.length >= 1, `${id} : données requises`);
      assert.ok(a.modele.length > 20 && a.convientA.length > 20);
      assert.doesNotMatch(JSON.stringify(a), /[·—]/, `${id} : ni point médian ni tiret cadratin`);
    }
  });

  test('completerLayout : un réglage absent prend celui de l’architecture, un réglage écrit gagne, sans architecture rien ne change', async () => {
    const { completerLayout, ARCHITECTURES } = await loadArchitecturesModule();
    const a = ARCHITECTURES['carte-de-visite'];
    const plein = completerLayout({ architecture: 'carte-de-visite' });
    assert.equal(plein.shell, a.layout.shell);
    assert.deepEqual(plein.sections, a.layout.sections);
    assert.equal(plein.contactDrawer, true);
    const ecrit = completerLayout({ architecture: 'carte-de-visite', footer: 'big-name', contactDrawer: false });
    assert.equal(ecrit.footer, 'big-name', 'réglage écrit conservé');
    assert.equal(ecrit.contactDrawer, false, 'false écrit conservé (pas seulement les valeurs vraies)');
    assert.equal(ecrit.shell, 'carte');
    assert.deepEqual(completerLayout({ nav: 'bar' }), { nav: 'bar' });
    assert.equal(completerLayout(undefined), undefined);
    // copie : modifier le résultat ne touche pas le registre
    plein.sections.push({ type: 'faq', variant: 'accordion' });
    assert.equal(ARCHITECTURES['carte-de-visite'].layout.sections.length, a.layout.sections.length);
  });

  test('schema : layout.architecture optionnel, décrit, appliqué par defineSite ; id inconnu refusé', async () => {
    const { defineSite, siteSchema } = await loadSchemaModule();
    const sans = defineSite(minimal);
    assert.equal(sans.layout.architecture, undefined);
    assert.equal(sans.layout.shell, 'flow', 'sans architecture : défauts du schéma');
    const carte = defineSite({ ...minimal, layout: { architecture: 'carte-de-visite' } });
    assert.equal(carte.layout.shell, 'carte');
    assert.deepEqual(carte.layout.sections, []);
    assert.equal(carte.layout.contactDrawer, true);
    assert.equal(carte.layout.footer, 'minimal');
    const garde = defineSite({ ...minimal, layout: { architecture: 'carte-de-visite', sections: [{ type: 'faq', variant: 'accordion' }] } });
    assert.deepEqual(garde.layout.sections, [{ type: 'faq', variant: 'accordion' }], 'les sections écrites gagnent');
    assert.throws(() => defineSite({ ...minimal, layout: { architecture: 'inconnue' } }), /architecture/);
    assert.ok(siteSchema.shape.layout, 'layout présent');
  });

  test('donneesManquantes : rien ne manque quand le site a les données, sinon des phrases ; urgence refusée', async () => {
    const { donneesManquantes, photosDuClient } = await loadArchitecturesModule();
    const img = { src: '/images/a.webp', alt: 'A' };
    assert.equal(photosDuClient({ images: { hero: img }, proof: { gallery: [img, img] } }), 3);
    assert.deepEqual(donneesManquantes('carte-de-visite', { images: { hero: img }, services: [{}, {}] }), []);
    const sansPhoto = donneesManquantes('carte-de-visite', { services: [{}] });
    assert.equal(sansPhoto.length, 1);
    assert.match(sansPhoto[0], /photo/);
    assert.match(donneesManquantes('carte-de-visite', { images: { hero: img }, services: Array(8).fill({}) }).join(), /6 au plus/);
    assert.match(donneesManquantes('carte-de-visite', { images: { hero: img }, services: [{}], contact: { emergency24h: true } }).join(), /urgence/);
    assert.deepEqual(donneesManquantes('nope', {}), ['architecture inconnue : nope']);
  });

  test('avisDeCarte : la note ET les avis recopiés courts (socle GOUT § 0), jamais tronqués, au plus n', async () => {
    const { avisDeCarte } = await loadArchitecturesModule();
    const court = { text: 'Très bon accueil.', author: 'Sylvia D.', source: 'Google' };
    const long = { text: 'x'.repeat(200), author: 'Long', source: 'Google' };
    const r = avisDeCarte({ google: { rating: 4.6, count: 162 }, testimonials: [long, court, court, court] });
    assert.equal(r.note, '4,6');
    assert.deepEqual(r.avis.map((a) => a.author), ['Sylvia D.', 'Sylvia D.'], 'le long est écarté, pas coupé ; deux au plus');
    assert.deepEqual(avisDeCarte({ testimonials: [court] }), { note: undefined, avis: [court] });
    assert.deepEqual(avisDeCarte(undefined), { note: undefined, avis: [] });
  });
}

test('sources : module pur, re-exporté par site.ts, appliqué par schema.ts et par le look (applyLook), chargé par ts-loader', () => {
  const lib = read('src/lib/architectures.ts');
  assert.doesNotMatch(lib, /^import (?!type )/m, 'module pur : aucun import runtime');
  assert.match(read('src/lib/site.ts'), /export \{ ARCHITECTURES, ARCHITECTURE_IDS, architecture, donneesManquantes, photosDuClient, nombreDeRealisations \} from '\.\/architectures'/);
  assert.match(read('src/lib/site.ts'), /completerLayout\(lookLayout\)/, 'un look qui choisit une architecture en apporte les réglages');
  const schema = read('src/lib/schema.ts');
  assert.match(schema, /architecture: z\s*\n\s*\.enum\(ARCHITECTURE_IDS\)\s*\n\s*\.optional\(\)\s*\n\s*\.describe\(/);
  assert.match(schema, /completerLayout\(input\.layout/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /'schema\.ts', 'fonts\.ts', 'architectures\.ts'/);
  assert.match(read('scripts/ff/composer.mjs'), /COQUILLES_D_ARCHITECTURE = \[[^\]]*'carte'/, 'composer ne tire jamais une coquille d’architecture au hasard');
  assert.match(read('.claude/skills/site-final/SKILL.md'), /l'architecture se choisit dans src\/lib\/architectures\.ts \(layout\.architecture\)/);
});

test('coquille carte : un écran, h1 + métier à ville, tel: dans le panneau id="contact", salut avec repli sans script, tokens seulement', () => {
  const src = read('src/shells/carte.astro');
  assert.match(src, /<h1[\s>]/);
  assert.match(src, /metierEtVille\(\)/);
  assert.match(src, /<section id="contact"[^>]*carte-panneau/);
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /data-salut>Bonjour</, 'sans script : « Bonjour »');
  assert.match(src, /onPage\(/);
  assert.match(src, /HorairesDuJour/);
  assert.match(src, /avisDeCarte\(site\.proof\)/, 'la note ET les avis recopiés (socle), même quand la note existe');
  assert.match(src, /<blockquote/);
  assert.match(src, /\/services\/\$\{s\.slug\}/, 'les pages des services sont listées (socle : plusieurs pages)');
  assert.match(src, /sections\.map\(/);
  assert.doesNotMatch(src, /<Hero\s*\/>|<Nav\s*\/>/, 'la carte remplace hero et nav');
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  assert.doesNotMatch(code, /#[0-9a-fA-F]{3,8}\b/, 'tokens uniquement');
  assert.doesNotMatch(code, /rounded-full|999px|radius-pill|uppercase|tracking-/, 'ni pilule ni capitales espacées');
  assert.doesNotMatch(code, /[·—]/);
  assert.doesNotMatch(code, /animation:|@keyframes/, 'pas de sceau qui tourne');
});

test('docs : DIRECTIONS (coquille carte), INDEX des architectures', () => {
  assert.match(read('docs/DIRECTIONS.md'), /\| `carte` \| \*\*Architecture `carte-de-visite`\*\*/);
});

test('fumigène : architecture carte-de-visite (FF_LOOK) rend la carte, le panneau, les pages, sans nav ni sections', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'carte-de-visite' } }, '_test-archi-carte');
  try {
    const html = f.html();
    assert.match(html, /<section id="hero" class="carte-hero/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /Menuisier-ébéniste à Roubaix/);
    const panneau = html.match(/<section id="contact"[\s\S]*?<\/section>/)?.[0];
    assert.ok(panneau, 'panneau id="contact"');
    assert.match(panneau, /href="tel:\+33600000000"/);
    // La note (et les avis recopiés courts) ont leur propre plan depuis le 17 oct 2026 (avisDeCarte, socle GOUT § 0).
    assert.match(html, /<section class="carte-avis[^"]*"[^>]*aria-label="Avis"[\s\S]*?4,9 sur 5, 37 avis Google/);
    assert.match(html, /<section id="services" class="carte-pages[\s\S]*?href="\/services\/cuisines"/);
    assert.match(html, /data-salut[^>]*>Bonjour</);
    assert.match(html, /<dialog id="contact-tiroir"/, 'tiroir de contact posé par l’architecture');
    assert.doesNotMatch(html, /id="faq"|class="[^"]*form-split/, 'aucune section empilée');
    assert.ok(f.existe('services/cuisines.html'), 'les pages service restent générées');
  } finally {
    f.rm();
  }
});

// ---- accueil-portes (Maisons de Bricourt + Cabalar) ----

if (tsImportable) {
  test('schema accueil-portes : services[].images, faq[].service, layout.servicePage (fiche par défaut), portes dans VARIANTS', async () => {
    const { defineSite, VARIANTS } = await loadSchemaModule();
    assert.ok(VARIANTS.services.includes('portes'));
    const sans = defineSite(minimal);
    assert.equal(sans.layout.servicePage, 'fiche');
    assert.deepEqual(sans.services[0].images, [], 'aucune photo devinée');
    const img = { src: '/images/a.webp', alt: 'A' };
    const avec = defineSite({
      ...minimal,
      layout: { architecture: 'accueil-portes' },
      services: [{ slug: 's', title: 'T', short: 'S', images: [img, img] }],
      faq: [{ q: 'Q ?', a: 'R.', service: 's' }],
    });
    assert.equal(avec.layout.servicePage, 'porte');
    assert.equal(avec.layout.shell, 'flow');
    assert.deepEqual(avec.layout.sections.map((x) => `${x.type}/${x.variant}`), ['services/portes', 'proof/google']);
    assert.equal(avec.services[0].images.length, 2);
    assert.equal(avec.faq[0].service, 's');
    assert.throws(() => defineSite({ ...minimal, layout: { servicePage: 'autre' } }));
  });

  test('donneesManquantes accueil-portes : 3 à 6 activités, une photo par porte', async () => {
    const { donneesManquantes } = await loadArchitecturesModule();
    const img = { src: '/images/a.webp', alt: 'A' };
    assert.deepEqual(donneesManquantes('accueil-portes', { services: [{ image: img }, { image: img }, { image: img }] }), []);
    const r = donneesManquantes('accueil-portes', { services: [{ image: img }, {}] });
    assert.equal(r.length, 2, 'trop peu d’activités et de photos');
    assert.match(r.join(), /3 à 6 activités/);
    assert.match(r.join(), /une photo par porte/);
  });
}

test('services/portes : toute la tuile est un lien, photo alternée, aplat bg-2, sans photo = aplat seul, tokens seulement', () => {
  const src = read('src/sections/Services/portes.astro');
  assert.match(src, /<section id="services"/);
  assert.match(src, /const Tag = lien \? 'a' : 'div'/);
  assert.match(src, /href=\{lien \? `\/services\/\$\{s\.slug\}` : undefined\}/);
  assert.match(src, /bg-bg-2/);
  assert.match(src, /i % 2 === 1/);
  assert.match(src, /s\.image \? 'md:col-span-5' : 'md:col-span-12'/);
  assert.match(src, /prefers-reduced-motion/);
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(code, /#[0-9a-fA-F]{3,8}\b|rounded-full|uppercase|tracking-|[·—]/);
  assert.match(read('scripts/ff/composer.mjs'), /case 'services\/portes':\n\s*return imagesServices;/);
});

test('page service « porte » : ServicePorte (photo, h1, labels, grilles de photos, questions de la page, adresse) choisie par layout.servicePage', () => {
  const page = read('src/pages/services/[slug].astro');
  assert.match(page, /site\.layout\.servicePage === 'porte' \? \(/);
  assert.match(page, /<ServicePorte service=\{service\} \/>/);
  const src = read('src/components/ServicePorte.astro');
  assert.match(src, /<h1[\s>]/);
  assert.match(src, /service\.images\.slice\(0, 2\)/);
  assert.match(src, /service\.images\.slice\(2, 6\)/);
  assert.match(src, /site\.faq\.filter\(\(f\) => f\.service === service\.slug\)/);
  assert.match(src, /business\.certifications/);
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /fullAddress\(\)/);
  assert.match(src, /<details/);
  assert.doesNotMatch(src.replace(/\/\*[\s\S]*?\*\//g, ''), /#[0-9a-fA-F]{3,8}\b|rounded-full|uppercase|[·—]/);
});

test('navLinks : en gabarit « porte », une entrée par page d’activité ; pied columns sans « //# » et id="contact" sans section contact', () => {
  assert.match(read('src/lib/site.ts'), /s\.layout\.servicePage === 'porte' && s\.servicePages/);
  const pied = read('src/sections/Footer/columns.astro');
  assert.doesNotMatch(pied, /href=\{`\/\$\{l\.href\}`\}/, 'navLinks rend déjà des liens absolus : « //#services » était une URL vers un autre hôte');
  assert.match(pied, /id=\{sansSectionContact \? 'contact' : undefined\}/);
});

test('docs : DIRECTIONS (services/portes, layout.servicePage)', () => {
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /\| `portes` \| \*\*Architecture `accueil-portes`\*\*/);
  assert.match(d, /\| `layout\.servicePage: 'porte'` \|/);
});

test('fumigène : architecture accueil-portes (FF_LOOK) rend les portes liées, la nav des activités, la page d’activité', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'accueil-portes' } }, '_test-archi-portes');
  try {
    const html = f.html();
    const portes = html.match(/<section id="services"[\s\S]*?<\/section>/)?.[0];
    assert.ok(portes, 'section portes');
    assert.equal((portes.match(/<a href="\/services\/[a-z-]+"[^>]*class="porte /g) || []).length, 3, 'une tuile-lien par activité');
    assert.match(html, /<section id="proof"/, 'avis Google après les portes');
    assert.ok(html.indexOf('id="services"') < html.indexOf('id="proof"'));
    assert.doesNotMatch(html, /href="\/\/#/, 'aucun lien « //# »');
    assert.match(html, /<div id="contact">/, 'colonne Contact du pied = cible de « /#contact »');
    const nav = html.match(/<header[\s\S]*?<\/header>/)?.[0] ?? '';
    assert.match(nav, /href="\/services\/escaliers"/, 'la nav nomme les pages d’activité');
    const page = f.html('services/cuisines.html');
    assert.match(page, /<h1[^>]*>Cuisines sur mesure<\/h1>/);
    assert.match(page, /Qualibat/);
    assert.match(page, /12 rue de l’Épeule, 59100 Roubaix/);
    assert.match(page, /href="\/services\/escaliers"/, 'autres activités');
  } finally {
    f.rm();
  }
});

// ---- index-projets (Mathilde De Chiara + House of Honey) ----

if (tsImportable) {
  test('schema index-projets : realisations[] (photos ≥ 1, champs décrits), layout.pageAPropos, coquille dans SHELLS', async () => {
    const { defineSite, SHELLS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('index-projets'));
    const sans = defineSite(minimal);
    assert.deepEqual(sans.realisations, []);
    assert.equal(sans.layout.pageAPropos, false);
    const img = { src: '/images/a.webp', alt: 'A' };
    const avec = defineSite({
      ...minimal,
      layout: { architecture: 'index-projets' },
      realisations: [{ slug: 'maison-croix', title: 'Maison de ville', place: 'Croix', kind: 'Cuisine', photos: [img, img] }],
    });
    assert.equal(avec.layout.shell, 'index-projets');
    assert.equal(avec.layout.pageAPropos, true);
    assert.deepEqual(avec.layout.sections, [], 'aucune section empilée');
    assert.equal(avec.realisations[0].year, undefined, 'absent reste absent');
    assert.throws(() => defineSite({ ...minimal, realisations: [{ slug: 'x', title: 'X', photos: [] }] }), 'au moins une photo');
    assert.throws(() => defineSite({ ...minimal, realisations: [{ slug: 'X Y', title: 'X', photos: [img] }] }), 'slug en minuscules');
  });

  test('donneesManquantes index-projets : 15 réalisations au moins, 3 à 5 types ; realisations[] d’abord, sinon la galerie', async () => {
    const { donneesManquantes, nombreDeRealisations } = await loadArchitecturesModule();
    const r = (kind) => ({ kind, photos: [{}] });
    const quinze = [...Array(5).fill(r('Cuisine')), ...Array(5).fill(r('Escalier')), ...Array(5).fill(r('Dressing'))];
    assert.deepEqual(donneesManquantes('index-projets', { realisations: quinze }), []);
    assert.equal(nombreDeRealisations({ realisations: [], proof: { gallery: [{}, {}] } }), 2);
    const quatre = donneesManquantes('index-projets', { proof: { gallery: [{ kind: 'Cuisine' }, { kind: 'Escalier' }, { kind: 'Cuisine' }, {}] } });
    assert.match(quatre.join(), /15 réalisations au moins.*\(4 aujourd’hui\)/);
    assert.match(quatre.join(), /3 à 5 types.*\(2 aujourd’hui\)/);
  });
}

test('coquille index-projets : h1, métier à ville, tel:, réglages en radios + :has() sans JS, liens réels vers les pages, tokens seulement', () => {
  const src = read('src/shells/index-projets.astro');
  assert.match(src, /<h1[\s>]/);
  assert.match(src, /metierEtVille\(\)/);
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /id="contact"/, 'cible de « /#contact » sans script');
  assert.match(src, /name="projets-type" id="pk-0" value="" checked/);
  assert.match(src, /name="projets-vue" id="vue-defile" value="defile" checked/);
  assert.match(src, /\.projets:has\(#vue-grille:checked\) \.projets-liste/);
  assert.match(src, /\.projets:has\(#pk-12:checked\) \.projet:not\(\[data-kind="12"\]\)/, '12 règles de filtre');
  assert.match(src, /href: `\/realisations\/\$\{r\.slug\}`/);
  assert.match(src, /site\.proof\.gallery\.map/, 'repli sur la galerie');
  assert.match(src, /href="\/a-propos"/);
  assert.match(src, /<legend>/);
  assert.match(src, /input:focus-visible \+ label/);
  assert.match(src, /prefers-reduced-motion/);
  assert.match(src, /class="outil-reglages" role="group"/);
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(code, /<script/, 'réglages sans JavaScript');
  assert.doesNotMatch(code, /#[0-9a-fA-F]{3,8}\b(?!:checked)|rounded-full|uppercase|tracking-|[·—]|italic/);
  assert.doesNotMatch(code, /<Hero\s*\/>|<Nav\s*\/>/);
});

test('pages : /realisations/<slug> (série de photos à ancres, une page par réalisation) et /a-propos (si pageAPropos), navLinks', () => {
  const r = read('src/pages/realisations/[slug].astro');
  assert.match(r, /site\.realisations\.map\(\(r, i\) => \(\{ params: \{ slug: r\.slug \}/);
  assert.match(r, /id=\{`photo-\$\{i \+ 1\}`\}/);
  assert.match(r, /<h1[\s>]/);
  assert.match(r, /href=\{tel\(\)\}/);
  const a = read('src/pages/a-propos/[...index].astro');
  assert.match(a, /return site\.layout\.pageAPropos \? \[\{ params: \{ index: undefined \} \}\] : \[\];/);
  assert.match(a, /<h1[\s>]/);
  assert.match(a, /metierEtVille\(\)/);
  assert.match(read('src/lib/site.ts'), /if \(s\.layout\.pageAPropos\) \{/);
  assert.match(read('scripts/ff/composer.mjs'), /COQUILLES_D_ARCHITECTURE = \[[^\]]*'index-projets'/);
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /\| `index-projets` \| \*\*Architecture `index-projets`\*\*/);
  assert.match(d, /\| `layout\.pageAPropos: true` \|/);
});

test('fumigène : architecture index-projets (FF_LOOK) rend l’index réglable, la page À propos, sans section empilée', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'index-projets' } }, '_test-archi-projets');
  try {
    const html = f.html();
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /<section id="realisations"/);
    assert.equal((html.match(/name="projets-type"/g) || []).length, 4, 'Tout + 3 types de la galerie de _exemple');
    assert.equal((html.match(/name="projets-vue"/g) || []).length, 2);
    assert.equal((html.match(/class="projet"/g) || []).length, 4);
    assert.match(html, /4 réalisations/);
    assert.match(html, /href="\/a-propos"/);
    assert.doesNotMatch(html, /<section id="proof"/);
    assert.match(f.css, /:has\(#vue-grille:checked\)/);
    assert.ok(f.existe('a-propos.html') || f.existe('a-propos/index.html'), 'page À propos générée');
  } finally {
    f.rm();
  }
});

// ---- lieu-fixe (Le Petit Bleu) ----

if (tsImportable) {
  test('schema lieu-fixe : services[].lignes (nom, prix et détail optionnels), carte-prix dans VARIANTS, coquille dans SHELLS', async () => {
    const { defineSite, VARIANTS, SHELLS } = await loadSchemaModule();
    assert.ok(VARIANTS.services.includes('carte-prix'));
    assert.ok(SHELLS.includes('lieu-fixe'));
    assert.deepEqual(defineSite(minimal).services[0].lignes, []);
    const avec = defineSite({
      ...minimal,
      layout: { architecture: 'lieu-fixe' },
      services: [{ slug: 'crepes', title: 'Crêpes', short: 'S', lignes: [{ nom: 'Beurre sucre', prix: '4,50 €' }, { nom: 'Du moment' }] }],
    });
    assert.equal(avec.layout.shell, 'lieu-fixe');
    assert.equal(avec.layout.servicePage, 'porte');
    assert.equal(avec.services[0].lignes[1].prix, undefined, 'une ligne sans prix reste sans prix');
    assert.deepEqual(avec.layout.sections.map((x) => `${x.type}/${x.variant}`), ['services/carte-prix', 'proof/testimonials', 'about/story']);
  });

  test('donneesManquantes lieu-fixe : rue, horaires, photo, lignes à prix', async () => {
    const { donneesManquantes } = await loadArchitecturesModule();
    const plein = { images: { hero: {} }, services: [{ lignes: [{}] }], contact: { hours: [{}], address: { street: '1 rue X' } } };
    assert.deepEqual(donneesManquantes('lieu-fixe', plein), []);
    const vide = donneesManquantes('lieu-fixe', { services: [{}], contact: { hours: [], address: {} } });
    assert.equal(vide.length, 4);
    assert.match(vide.join(), /adresse où l'on vient/);
    assert.match(vide.join(), /services\[\]\.lignes/);
  });
}

test('coquille lieu-fixe : lieu sticky à droite (id="contact"), carte d’accueil (h1, métier à ville, portes), état du jour, tokens seulement', () => {
  const src = read('src/shells/lieu-fixe.astro');
  assert.match(src, /<h1[^>]*set:html=\{site\.business\.tagline\}/);
  assert.match(src, /metierEtVille\(\)/);
  assert.match(src, /portes\.map\(\(a, i\) => <li><Porte/);
  assert.match(src, /<section id="contact" class="lf-lieu"/);
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /<HorairesDuJour \/>/);
  assert.match(src, /position: sticky;/);
  assert.match(src, /grid-column: 2;/);
  assert.match(src, /<div class="lg:hidden"><Nav \/><\/div>/);
  assert.match(src, /heroSizesFor\(site\.layout\.hero\)/, 'même sizes que le préchargement de Base.astro');
  assert.match(src, /sections\.map\(/);
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(code, /#[0-9a-fA-F]{3,8}\b|rounded-full|uppercase|tracking-|[·—]|data-marquee/, 'ni couleur en dur, ni pilule, ni bande défilante');
});

test('services/carte-prix : <details> natifs, lignes à pointillés, repli sur les bullets, sans script ; ServicePorte affiche les lignes', () => {
  const src = read('src/sections/Services/carte-prix.astro');
  assert.match(src, /<section id="services"/);
  assert.match(src, /<details class="carte-rubrique[^"]*" open=\{i === 0\}>/);
  assert.match(src, /s\.lignes\.length > 0 \?/);
  assert.match(src, /\{l\.prix && <span class="carte-points/);
  assert.match(src, /s\.bullets\.length > 0/);
  assert.match(src, /border-bottom: 2px dotted var\(--color-line\)/);
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(code, /<script|#[0-9a-fA-F]{3,8}\b|uppercase|tracking-|[·—]/);
  assert.match(read('src/components/ServicePorte.astro'), /service\.lignes\.map/);
  assert.match(read('scripts/ff/composer.mjs'), /case 'services\/carte-prix':/);
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /\| `lieu-fixe` \| \*\*Architecture `lieu-fixe`\*\*/);
  assert.match(d, /\| `carte-prix` \| \*\*La carte ou les tarifs en accordéons\*\*/);
});

test('fumigène : architecture lieu-fixe (FF_LOOK) rend l’accueil, le lieu fixe, la carte, sans hero partagé', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'lieu-fixe' } }, '_test-archi-lieu');
  try {
    const html = f.html();
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /<section id="hero" class="lf-accueil/);
    const lieu = html.match(/<section id="contact" class="lf-lieu[\s\S]*?<\/section>/)?.[0];
    assert.ok(lieu, 'lieu id="contact"');
    assert.match(lieu, /data-horaires-jour=/);
    assert.match(lieu, /12 rue de l’Épeule, 59100 Roubaix/);
    assert.match(lieu, /href="tel:\+33600000000"/);
    assert.ok(html.indexOf('lf-accueil') < html.indexOf('lf-lieu') && html.indexOf('lf-lieu') < html.indexOf('carte-rubrique'), 'accueil, lieu, puis la carte');
    assert.equal((html.match(/<details class="carte-rubrique/g) || []).length, 3);
    assert.match(f.css, /position:sticky/);
    const page = f.html('services/cuisines.html');
    assert.match(page, /<h1[^>]*>Cuisines sur mesure<\/h1>/, 'page de rubrique en gabarit porte');
  } finally {
    f.rm();
  }
});
