// Architectures entières (src/lib/architectures.ts, docs/veille/architectures/INDEX.md, docs/GOUT.md § 0) : registre
// pur (id → coquille, ordre des sections, données requises, fiche source), `layout.architecture` du schéma
// (completerLayout : un réglage absent prend celui de l'architecture, un réglage écrit gagne), coquilles et sections
// qu'elles apportent, et un fumigène de build par architecture (sites/_exemple + FF_LOOK { layout: { architecture } }).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadArchitecturesModule, loadSchemaModule, loadAgendaModule, loadProduitsModule, loadCouleurModule, loadLieuxModule, loadSortiesModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

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
  // D'autres variantes à photos (services/panneaux-biais…) partagent ce `return` : des `case` peuvent s'intercaler.
  assert.match(read('scripts/ff/composer.mjs'), /case 'services\/portes':\n(\s*case '[^']+':\n)*\s*return imagesServices;/);
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
  assert.match(r, /id=\{`photo-\$\{i \+ 1 \+ \(paire \? 1 : 0\)\}`\}/, 'ancres #photo-1… ; avec un curseur avant / après (architecture avant-apres), il prend la première');
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
  assert.match(src, /\{\(l\.prix \|\| l\.duree\) && <span class="carte-points/);
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

// ---- 21 oct 2026 : panneaux-tranche (Studio RHE), livre-ecrans (Du Pain et des Idées), cartes-empilees-agenda
// (De Groene Afslag), carnet-horizontal (Gingko) : les quatre architectures les plus éloignées des quatre premières. ----

const NOUVELLES = { 'panneaux-tranche': 'panneaux', 'livre-ecrans': 'livre', 'cartes-empilees-agenda': 'cartes-agenda', 'carnet-horizontal': 'carnet' };
const codeDe = (src) => src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

if (tsImportable) {
  test('registre : les quatre nouvelles architectures, leur coquille, leurs variantes d’architecture, l’index des réalisations', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, VARIANTES_D_ARCHITECTURE, COQUILLES_A_INDEX_REALISATIONS, completerLayout } = await loadArchitecturesModule();
    for (const [id, shell] of Object.entries(NOUVELLES)) {
      assert.ok(ARCHITECTURE_IDS.includes(id), id);
      assert.equal(ARCHITECTURES[id].layout.shell, shell);
      assert.equal(completerLayout({ architecture: id }).shell, shell);
      assert.equal(ARCHITECTURES[id].requis.at(-1).mesure, 'pasUrgence', `${id} : jamais l’urgence`);
    }
    assert.deepEqual(ARCHITECTURES['livre-ecrans'].layout.sections.map((s) => `${s.type}/${s.variant}`), ['about/ecran-texte-photo', 'proof/citations', 'services/liste-a-filets', 'contact/ecran']);
    assert.equal(ARCHITECTURES['livre-ecrans'].layout.servicePage, 'livre');
    assert.deepEqual(ARCHITECTURES['cartes-empilees-agenda'].layout.sections.map((s) => `${s.type}/${s.variant}`), ['services/cartes-empilees', 'proof/testimonials']);
    assert.deepEqual(ARCHITECTURES['panneaux-tranche'].layout.sections, []);
    assert.equal(ARCHITECTURES['panneaux-tranche'].layout.pageAPropos, true);
    for (const v of ['services/cartes-empilees', 'services/liste-a-filets', 'about/ecran-texte-photo', 'proof/citations', 'contact/ecran']) assert.ok(VARIANTES_D_ARCHITECTURE.includes(v), v);
    assert.deepEqual([...COQUILLES_A_INDEX_REALISATIONS], ['panneaux', 'carnet', 'avant-apres']);
  });

  test('schema : agenda[] et partenaires[] (défaut vide, décrits), wording.agenda, servicePage « livre », coquilles et variantes', async () => {
    const { defineSite, SHELLS, VARIANTS } = await loadSchemaModule();
    for (const shell of Object.values(NOUVELLES)) assert.ok(SHELLS.includes(shell), shell);
    assert.ok(VARIANTS.services.includes('cartes-empilees') && VARIANTS.services.includes('liste-a-filets'));
    assert.ok(VARIANTS.about.includes('ecran-texte-photo') && VARIANTS.proof.includes('citations') && VARIANTS.contact.includes('ecran'));
    const vide = defineSite(minimal);
    assert.deepEqual(vide.agenda, []);
    assert.deepEqual(vide.partenaires, []);
    assert.equal(vide.wording.agenda, 'Agenda');
    const plein = defineSite({
      ...minimal,
      layout: { architecture: 'livre-ecrans' },
      agenda: [{ date: '2030-05-02', titre: 'Stage', categorie: 'Stage', heure: '9 h – 12 h' }],
      partenaires: [{ metier: 'Ferronnier', nom: 'Forges du Nord' }],
    });
    assert.equal(plein.layout.servicePage, 'livre');
    assert.equal(plein.agenda[0].titre, 'Stage');
    assert.throws(() => defineSite({ ...minimal, agenda: [{ date: '2 mai', titre: 'X' }] }), /agenda/);
    assert.throws(() => defineSite({ ...minimal, partenaires: [{ nom: 'X' }] }), /partenaires/);
    const schema = read('src/lib/schema.ts');
    assert.match(schema, /agenda: z\s*\n\s*\.array\(/);
    assert.match(schema, /Jamais un rendez-vous invente/);
    assert.match(schema, /Noms donnes par le client, jamais devines/);
  });

  test('agenda (module pur) : à venir seulement, du plus proche au plus lointain ; date en carte ; catégories ; lien de nav', async () => {
    const { agendaAVenir, dateAgenda, categoriesAgenda, lienAgenda, isoDuJour } = await loadAgendaModule();
    const a = [{ date: '2026-12-05', categorie: 'Marché' }, { date: '2026-10-01' }, { date: '2026-11-07', categorie: 'Stage' }, { date: '2026-11-21', categorie: 'Stage ' }];
    assert.deepEqual(agendaAVenir(a, '2026-10-21').map((r) => r.date), ['2026-11-07', '2026-11-21', '2026-12-05'], 'passé retiré, trié');
    assert.equal(a[0].date, '2026-12-05', 'entrée non mutée');
    assert.equal(agendaAVenir(a, '2026-11-07')[0].date, '2026-11-07', 'le jour même reste');
    const d = dateAgenda('2026-11-07');
    assert.equal(d.jour, '7');
    assert.equal(d.mois, 'nov.');
    assert.equal(d.long, 'samedi 7 novembre 2026');
    assert.equal(dateAgenda('2026-12-01').long, 'mardi 1er décembre 2026');
    assert.deepEqual(categoriesAgenda(a), ['Marché', 'Stage']);
    assert.deepEqual(lienAgenda(a, 'Agenda', '2026-10-21'), { href: '/agenda', label: 'Agenda' });
    assert.equal(lienAgenda(a, 'Agenda', '2027-01-01'), null, 'tout passé : ni page ni lien');
    assert.equal(isoDuJour(new Date('2026-10-21T23:30:00Z')), '2026-10-22', 'fuseau de Paris');
    assert.doesNotMatch(read('src/lib/agenda.ts'), /^import (?!type )/m, 'module pur');
  });

  test('donneesManquantes : nouvelles mesures (histoire, agenda) et exigences des quatre architectures', async () => {
    const { donneesManquantes } = await loadArchitecturesModule();
    const photo = { src: '/p.webp', alt: 'p' };
    const reals = Array.from({ length: 7 }, () => ({ kind: 'Cuisine', photos: [photo, photo] }));
    assert.deepEqual(donneesManquantes('panneaux-tranche', { realisations: reals, contact: {} }), []);
    assert.equal(donneesManquantes('panneaux-tranche', { realisations: reals.slice(0, 3), contact: {} }).length, 2, '3 réalisations, 6 photos');
    assert.deepEqual(donneesManquantes('carnet-horizontal', { realisations: reals }), []);
    const histoire = 'Un.\n\nDeux.\n\nTrois.';
    assert.deepEqual(donneesManquantes('livre-ecrans', { about: { story: histoire }, realisations: reals }), []);
    assert.match(donneesManquantes('livre-ecrans', { about: { story: 'Un seul.' }, realisations: reals }).join(), /histoire.*\(1 aujourd’hui\)/);
    const services = [{}, {}, {}];
    const agenda = [{ date: '2030-01-01' }, { date: '2030-01-02' }, { date: '2030-01-03' }];
    assert.deepEqual(donneesManquantes('cartes-empilees-agenda', { services, agenda }), []);
    assert.match(donneesManquantes('cartes-empilees-agenda', { services, agenda: [] }).join(), /rendez-vous datés/);
    for (const id of Object.keys(NOUVELLES)) {
      const m = donneesManquantes(id, { services, agenda, realisations: reals, about: { story: histoire }, contact: { emergency24h: true } });
      assert.ok(m.some((x) => /urgence/.test(x)), `${id} refuse l’urgence`);
    }
  });
}

test('bande horizontale (src/scripts/bande.ts) : défilement natif, une translation, 64 rem et mouvement non réduit, focus et ancres', () => {
  const src = read('src/scripts/bande.ts');
  assert.match(src, /export function initBande\(\)/);
  assert.match(src, /matchMedia\('\(min-width: 64rem\) and \(prefers-reduced-motion: no-preference\)'\)/);
  assert.match(src, /translate3d\(/);
  assert.match(src, /requestAnimationFrame\(poser\)/, 'au plus une mise à jour par image');
  assert.match(src, /vue\.clientHeight/, 'course mesurée sur l’enfant collant, pas innerHeight');
  assert.doesNotMatch(codeDe(src), /innerHeight/);
  assert.doesNotMatch(src, /addEventListener\('wheel'|preventDefault|overflow\s*=\s*'hidden'/, 'jamais de défilement simulé');
  assert.match(src, /addEventListener\('focusin'/);
  assert.match(src, /addEventListener\('hashchange'/);
  assert.match(src, /\[data-bande-progres\]/);
  for (const shell of ['panneaux', 'carnet']) {
    const s = read(`src/shells/${shell}.astro`);
    assert.match(s, /data-bande>/);
    assert.match(s, /data-bande-vue/);
    assert.match(s, /data-bande-piste/);
    assert.match(s, /onPage\(initBande\)/);
    assert.match(s, /overflow: clip/, `${shell} : vue en clip, pas hidden`);
    assert.match(s, /display: contents/, `${shell} : sans bande, chaque panneau est un bloc de la page`);
  }
});

test('coquilles panneaux, carnet, livre, cartes-agenda : socle (h1, métier à ville, tel:, avis), tokens seulement, sans signe IA', () => {
  for (const shell of Object.values(NOUVELLES)) {
    const code = codeDe(read(`src/shells/${shell}.astro`));
    assert.equal((code.match(/<h1[\s>]/g) || []).length, 1, `${shell} : un h1`);
    assert.match(code, /metierEtVille\(\)|site\.business\.trade/, `${shell} : métier et ville au premier écran`);
    assert.match(code, /href=\{tel\(\)\}/, `${shell} : téléphone cliquable`);
    assert.match(code, /site\.proof\.google/, `${shell} : note Google en haut`);
    assert.match(code, /sections\.map\(/, `${shell} : sections du layout rendues`);
    assert.match(code, /<Footer \/>/);
    assert.doesNotMatch(code, /#[0-9a-fA-F]{3,8}\b/, `${shell} : tokens uniquement`);
    assert.doesNotMatch(code, /rounded-full|999px|radius-pill|uppercase|tracking-|[·—]|italic|data-marquee/, `${shell} : ni pilule, ni capitales espacées, ni italique`);
  }
  const p = read('src/shells/panneaux.astro');
  assert.match(p, /data-bande-progres/, 'tranche : progression');
  assert.match(p, /pn-tranche/);
  assert.match(p, /scroll-snap-type: x mandatory/, 'téléphone : les réalisations glissent au doigt');
  assert.match(p, /href="\/realisations"/);
  assert.match(p, /<div class="lg:hidden"><Nav \/><\/div>/);
  const c = read('src/shells/carnet.astro');
  assert.match(c, /site\.partenaires\.map/);
  assert.match(c, /id=\{idSi\('contact'\)\}/, 'contact en bout de bande, sans doubler l’id d’une section');
  assert.match(c, /<div class="lg:hidden"><Nav \/><\/div>/);
  const l = read('src/shells/livre.astro');
  assert.match(l, /lv-planche/);
  assert.match(l, /<Nav \/>/);
  const k = read('src/shells/cartes-agenda.astro');
  assert.match(k, /<ProchainsRendezVous \/>/);
  assert.match(k, /href="\/agenda"/);
  assert.match(k, /\{i === iServices && <ProchainsRendezVous \/>\}/, 'les rendez-vous juste après les activités');
  assert.match(read('scripts/ff/composer.mjs'), /COQUILLES_D_ARCHITECTURE = \[[^\]]*'panneaux', 'carnet', 'livre', 'cartes-agenda'/);
});

test('sections d’architecture : un écran = un bloc (enveloppe <div id> + <section>), collage natif, repli sans donnée, tokens', () => {
  const cartes = read('src/sections/Services/cartes-empilees.astro');
  assert.match(cartes, /<div id="services" class="ce-pile/);
  assert.match(cartes, /<section class:list=\{\['ce-carte/);
  assert.match(cartes, /position: sticky;/);
  assert.match(cartes, /@media \(min-width: 48rem\) and \(min-height: 40rem\)/, 'collage seulement quand une carte tient dans l’écran');
  assert.match(cartes, /var\(--color-accent\)/);
  const eb = read('src/sections/About/ecran-texte-photo.astro');
  assert.match(eb, /<div id="about" class="eb">/);
  assert.match(eb, /kind: 'planche'/);
  assert.match(eb, /photosDuSite\(\)/);
  const pc = read('src/sections/Proof/citations.astro');
  assert.match(pc, /\{!rien && \(/, 'sans avis ni note : rien');
  assert.match(pc, /<blockquote/);
  assert.match(read('src/sections/Services/liste-a-filets.astro'), /href=\{`\/services\/\$\{s\.slug\}`\}/);
  const ce = read('src/sections/Contact/ecran.astro');
  assert.match(ce, /<section id="contact"/);
  assert.match(ce, /<details class="ce-ecrire/);
  for (const f of ['Services/cartes-empilees', 'Services/liste-a-filets', 'About/ecran-texte-photo', 'Proof/citations', 'Contact/ecran']) {
    assert.doesNotMatch(codeDe(read(`src/sections/${f}.astro`)), /#[0-9a-fA-F]{3,8}\b|rounded-full|uppercase|tracking-|italic|<script/, f);
  }
  const rv = read('src/components/ProchainsRendezVous.astro');
  assert.match(rv, /agendaAVenir\(site\.agenda\)/);
  assert.match(rv, /<RendezVous r=\{r\} \/>/);
  assert.match(read('src/components/RendezVous.astro'), /<time datetime=\{r\.date\}>/);
  assert.match(read('scripts/ff/composer.mjs'), /case 'services\/cartes-empilees':\s*\n\s*return cfg\.layout\?\.architecture === 'cartes-empilees-agenda'/);
  assert.match(read('scripts/ff/deroule.mjs'), /\.\.\.els\]\)\)/, 'ff ressemblance voit une file horizontale sous une enveloppe ouverte');
});

test('pages : /agenda (à venir, filtres :has()), /realisations (coquilles panneaux et carnet), gabarit de service « livre », nav', () => {
  const ag = read('src/pages/agenda/[...index].astro');
  assert.match(ag, /agendaAVenir\(site\.agenda\)\.length > 0 \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(ag, /\.ag:has\(#ag-1:checked\) \.ag-item:not\(\[data-cat="1"\]\)/);
  assert.match(ag, /<RendezVous r=\{r\} niveau="h2" \/>/);
  const ri = read('src/pages/realisations/[...index].astro');
  assert.match(ri, /COQUILLES_A_INDEX_REALISATIONS/);
  assert.match(ri, /\.ri:has\(#ri-1:checked\)/);
  assert.match(read('src/pages/realisations/[slug].astro'), /href=\{retour\}/);
  assert.match(read('src/pages/services/[slug].astro'), /site\.layout\.servicePage === 'livre' \? \(\s*\n\s*<main id="main"><ServiceLivre service=\{service\} \/>/);
  const sl = read('src/components/ServiceLivre.astro');
  assert.match(sl, /getSection\('contact', 'ecran'\)/, 'chaque page se ferme sur le même écran de contact');
  assert.match(sl, /<h1 /);
  const s = read('src/lib/site.ts');
  assert.match(s, /lienAgenda\(s\.agenda \?\? \[\], s\.wording\.agenda\)/);
  assert.match(s, /COQUILLES_A_INDEX_REALISATIONS\.includes\(s\.layout\.shell\)/);
  assert.match(s, /export const photosDuSite =/);
});

test('docs : DIRECTIONS (4 coquilles, 5 variantes), INDEX (colonne Implémentée), CONVENTIONS (bande horizontale)', () => {
  const d = read('docs/DIRECTIONS.md');
  for (const [id, shell] of Object.entries(NOUVELLES)) assert.match(d, new RegExp(`\\| \`${shell}\` \\| \\*\\*Architecture \`${id}\`\\*\\*`));
  for (const v of ['cartes-empilees', 'liste-a-filets', 'ecran-texte-photo', 'citations', 'ecran']) assert.match(d, new RegExp(`\\| \`${v}\` \\| \\*\\*Architecture`));
  const idx = read('docs/veille/architectures/INDEX.md');
  assert.match(idx, /\| Coût usine \| Implémentée \|/);
  for (const id of Object.keys(NOUVELLES)) assert.match(idx, new RegExp(`^\\| \`${id}\` \\|.*\\| oui, coquille`, 'm'));
  assert.match(read('docs/CONVENTIONS.md'), /\*\*Bande horizontale de page entiere \(`panneaux`, `carnet`\)\.\*\*/);
});

for (const [id, shell] of Object.entries(NOUVELLES)) {
  test(`fumigène : architecture ${id} (FF_LOOK) rend la coquille ${shell}, un h1, le téléphone, les pages`, { timeout: 180_000 }, () => {
    const f = fumigene({ layout: { architecture: id } }, `_test-archi-${shell}`);
    try {
      const html = f.html();
      assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
      assert.match(html, /Menuisier-ébéniste/);
      assert.match(html, /href="tel:\+33600000000"/);
      assert.match(html, new RegExp(`data-shell="${shell}"`));
      assert.ok(f.existe('services/cuisines.html'), 'pages des activités');
      if (shell === 'panneaux' || shell === 'carnet') {
        assert.match(html, /data-bande-piste/);
        assert.match(html, /<dialog id="contact-tiroir"/, 'tiroir de contact');
      }
      if (shell === 'panneaux') {
        assert.match(html, /data-bande-progres/);
        assert.ok(f.existe('a-propos.html') || f.existe('a-propos/index.html'), 'page À propos');
      }
      if (shell === 'carnet') assert.match(html, /id="contact" class="cn-chap cn-contact/);
      if (shell === 'livre') {
        const [a, p, s, c] = ['id="about"', 'id="proof"', 'id="services"', 'id="contact"'].map((x) => html.indexOf(x));
        assert.ok(a > 0 && a < p && p < s && s < c, 'ordre du livre : histoire, avis, activités, contact');
        assert.match(html, /class="eb-ecran/);
        const page = f.html('services/cuisines.html');
        assert.match(page, /class="sl"/, 'gabarit de page livre');
        assert.match(page, /<section id="contact" class="ce-ecran/);
      }
      if (shell === 'cartes-agenda') {
        assert.match(html, /class="ce-carte/);
        assert.doesNotMatch(html, /id="agenda"/, '_exemple n’a aucun rendez-vous : pas de bloc');
        assert.ok(!f.existe('agenda.html') && !f.existe('agenda/index.html'), 'ni page /agenda');
        assert.match(f.css, /position:sticky/);
      }
    } finally {
      f.rm();
    }
  });
}

// ---- 22 oct 2026 : gamme-vitrine (Agrumea Farm) : catalogue d'abord, l'accueil d'un écran est la gamme. ----

if (tsImportable) {
  test('registre gamme-vitrine : coquille vitrine, aucune section, page À propos et tiroir, mesure « produits » 6 à 20', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, completerLayout, donneesManquantes } = await loadArchitecturesModule();
    assert.ok(ARCHITECTURE_IDS.includes('gamme-vitrine'));
    const a = ARCHITECTURES['gamme-vitrine'];
    assert.equal(a.layout.shell, 'vitrine');
    assert.deepEqual(a.layout.sections, []);
    assert.equal(a.layout.pageAPropos, true);
    assert.equal(a.layout.contactDrawer, true);
    assert.equal(completerLayout({ architecture: 'gamme-vitrine' }).shell, 'vitrine');
    assert.deepEqual(a.requis.map((e) => e.mesure), ['produits', 'pasUrgence']);
    const photo = { src: '/p.webp', alt: 'p' };
    const six = Array.from({ length: 6 }, () => ({ photo }));
    assert.deepEqual(donneesManquantes('gamme-vitrine', { produits: six }), []);
    assert.match(donneesManquantes('gamme-vitrine', { produits: six.slice(0, 2) }).join(), /6 à 20 produits.*\(2 aujourd’hui\)/);
    assert.match(donneesManquantes('gamme-vitrine', { produits: Array(21).fill({ photo }) }).join(), /\(21 aujourd’hui\)/);
    assert.match(donneesManquantes('gamme-vitrine', {}).join(), /\(0 aujourd’hui\)/, 'sans produits[] : la coquille le dit, rien n’est inventé');
    assert.match(donneesManquantes('gamme-vitrine', { produits: six, contact: { emergency24h: true } }).join(), /urgence/);
  });

  test('schema : produits[] (slug, nom, photo obligatoires ; le reste absent reste absent), wording.produits, coquille vitrine', async () => {
    const { defineSite, SHELLS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('vitrine'));
    const vide = defineSite(minimal);
    assert.deepEqual(vide.produits, []);
    assert.equal(vide.wording.produits, 'Produits');
    const photo = { src: '/images/confiture.webp', alt: 'Pot de confiture d’abricot' };
    const avec = defineSite({
      ...minimal,
      layout: { architecture: 'gamme-vitrine' },
      produits: [{ slug: 'abricot', nom: 'Confiture d’abricot', photo, formats: ['250 g', '1 kg'], prix: '6,50 €' }, { slug: 'pesto', nom: 'Pesto', photo }],
    });
    assert.equal(avec.layout.shell, 'vitrine');
    assert.equal(avec.produits[0].formats.length, 2);
    assert.equal(avec.produits[1].prix, undefined, 'prix absent = absent');
    assert.equal(avec.produits[1].composition, undefined);
    assert.deepEqual(avec.produits[1].photos, []);
    assert.throws(() => defineSite({ ...minimal, produits: [{ slug: 'x', nom: 'X' }] }), /produits/, 'la photo détourée est obligatoire');
    assert.throws(() => defineSite({ ...minimal, produits: [{ slug: 'X Y', nom: 'X', photo }] }), /produits/, 'slug en minuscules');
    const schema = read('src/lib/schema.ts');
    assert.match(schema, /produits: z\s*\n\s*\.array\(/);
    assert.match(schema, /Jamais un produit invente/);
  });

  test('produits (module pur) : familles dans l’ordre, les autres produits en boucle, lien de nav, prix en offre JSON-LD', async () => {
    const { categoriesProduits, autresProduits, lienProduits, prixEnOffre } = await loadProduitsModule();
    const ps = [{ slug: 'a', categorie: 'Confitures' }, { slug: 'b' }, { slug: 'c', categorie: 'Pestos' }, { slug: 'd', categorie: 'Confitures ' }, { slug: 'e' }];
    assert.deepEqual(categoriesProduits(ps), ['Confitures', 'Pestos']);
    assert.deepEqual(autresProduits(ps, 'c', 3).map((p) => p.slug), ['d', 'e', 'a'], 'les suivants d’abord, puis le début');
    assert.deepEqual(autresProduits(ps, 'e', 10).map((p) => p.slug), ['a', 'b', 'c', 'd']);
    assert.deepEqual(autresProduits([{ slug: 'seul' }], 'seul'), [], 'un seul produit : pas d’autres');
    assert.deepEqual(lienProduits(ps, 'La gamme'), { href: '/produits', label: 'La gamme' });
    assert.equal(lienProduits([], 'Produits'), null);
    assert.deepEqual(prixEnOffre('6,50 €'), { '@type': 'Offer', price: '6.50', priceCurrency: 'EUR' });
    assert.deepEqual(prixEnOffre('12 EUR'), { '@type': 'Offer', price: '12', priceCurrency: 'EUR' });
    assert.deepEqual(prixEnOffre('à partir de 4 €'), { '@type': 'Offer', description: 'à partir de 4 €' }, 'un prix en texte reste une description');
    assert.equal(prixEnOffre(undefined), undefined, 'sans prix : pas d’offre');
    assert.equal(prixEnOffre('  '), undefined);
    assert.doesNotMatch(read('src/lib/produits.ts'), /^import (?!type )/m, 'module pur');
  });
}

test('coquille vitrine : piste manuelle (scroll-snap, jamais la molette), pivot piloté par la piste avec repli, menu <dialog>, socle, repli sans produit, tokens', () => {
  const src = read('src/shells/vitrine.astro');
  const code = codeDe(src);
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 2, 'un h1 dans chaque branche (gamme / sommaire), jamais les deux rendus');
  assert.match(code, /produits\.length > 0 \? \(/);
  assert.match(code, /ligneMetier\(\)/);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\}/);
  assert.match(code, /site\.proof\.google/);
  assert.match(code, /href=\{`\/produits\/\$\{p\.slug\}`\}/, 'chaque produit mène à sa page');
  assert.match(code, /href="\/produits"/);
  assert.match(code, /scroll-snap-type: x mandatory/);
  assert.match(code, /animation-timeline: view\(inline\)/, 'le pivot suit la piste');
  assert.match(code, /@supports \(animation-timeline: view\(\)\)/, 'avec repli');
  assert.match(code, /prefers-reduced-motion/);
  assert.match(code, /<dialog id="vt-menu"/);
  assert.match(code, /showModal\(\)/);
  assert.match(code, /onPage\(/);
  assert.match(code, /donneesManquantes\('gamme-vitrine', site\)/, 'sans produit : message au build');
  assert.match(code, /vt-sommaire/);
  assert.match(code, /sections\.map\(/);
  assert.match(code, /<Footer \/>/);
  assert.doesNotMatch(code, /<Hero\s*\/>|<Nav\s*\/>/, 'la vitrine remplace hero et nav');
  assert.doesNotMatch(code, /addEventListener\('wheel'|'wheel'|scrollTo\(/, 'jamais la molette détournée ni de défilement simulé (le preventDefault du lien Contact vers le tiroir est permis)');
  assert.doesNotMatch(code, /#[0-9a-fA-F]{3,8}\b/, 'tokens uniquement');
  assert.doesNotMatch(code, /rounded-full|999px|radius-pill|uppercase|tracking-|[·—]|italic|data-marquee|eyebrow/, 'ni pilule, ni capitales espacées, ni eyebrow');
  assert.match(read('scripts/ff/composer.mjs'), /COQUILLES_D_ARCHITECTURE = \[[^\]]*'vitrine'/);
});

test('pages /produits et /produits/<slug> : liste par famille, titre géant sous le produit, fiche à filets, pastilles rondes, piste aimantée, JSON-LD Product sans prix si absent, nav', () => {
  const liste = read('src/pages/produits/[...index].astro');
  assert.match(liste, /site\.produits\.length > 0 \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(liste, /categoriesProduits\(produits\)/);
  assert.match(liste, /familles\.length >= 2/);
  assert.match(liste, /<h1[\s>]/);
  const fiche = read('src/pages/produits/[slug].astro');
  assert.match(fiche, /site\.produits\.map\(\(p\) => \(\{ params: \{ slug: p\.slug \}/);
  assert.match(fiche, /<h1 class="pf-h1/);
  assert.match(fiche, /grid-area: 1 \/ 1/, 'le produit et le titre sur la même cellule : le produit devant les lettres');
  assert.match(fiche, /border-radius: 50%/, 'pastilles rondes');
  assert.match(fiche, /scroll-snap-type: x mandatory/);
  assert.match(fiche, /role="region" aria-label=\{`\$\{p\.nom\} en photos`\} tabindex="0"/, 'piste accessible au clavier');
  assert.match(fiche, /produitLd\(site, p, pageUrl/);
  assert.match(fiche, /prixEnOffre\(p\.prix\)/);
  assert.match(fiche, /autresProduits\(site\.produits, p\.slug, 4\)/);
  assert.match(fiche, /\]\.filter\(Boolean\)/, 'une colonne absente n’existe pas');
  for (const f of [liste, fiche]) assert.doesNotMatch(codeDe(f), /#[0-9a-fA-F]{3,8}\b|rounded-full|999px|uppercase|tracking-|[·—]|italic|eyebrow/, 'signes IA de la source non repris');
  const ld = read('src/lib/jsonld.ts');
  assert.match(ld, /export function produitLd\(/);
  assert.match(ld, /'@type': 'Product'/);
  assert.match(ld, /\.\.\.\(offre \? \{ offers: offre \} : \{\}\)/, 'pas d’offre sans prix');
  const s = read('src/lib/site.ts');
  assert.match(s, /lienProduits\(s\.produits \?\? \[\], s\.wording\.produits\)/);
  assert.match(s, /s\.produits\.flatMap\(\(p\) => \[p\.photo, \.\.\.p\.photos\]\)/, 'les photos des produits comptent parmi celles du site');
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadProduitsModule\(\)/);
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /\| `vitrine` \| \*\*Architecture `gamme-vitrine`\*\*/);
  assert.match(read('docs/veille/architectures/INDEX.md'), /^\| `gamme-vitrine` \|.*\| oui, coquille `vitrine`/m);
  assert.match(read('docs/CONVENTIONS.md'), /\*\*Piste manuelle \(`vitrine`, fiche produit\)\.\*\*/);
});

// ---- 22 oct 2026 : cadre-couleur (Meyers) et scenes-epinglees (TAB Kitchen & Bakery) : le cadre de couleur fixe avec une
// couleur par activité (services[].couleur, src/lib/couleur.ts), et la scène épinglée des espaces du lieu (about.espaces). ----

if (tsImportable) {
  test('registre cadre-couleur / scenes-epinglees : coquilles cadre et scenes, sections, variantes d’architecture, jamais l’urgence', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, VARIANTES_D_ARCHITECTURE, completerLayout } = await loadArchitecturesModule();
    for (const id of ['cadre-couleur', 'scenes-epinglees']) {
      assert.ok(ARCHITECTURE_IDS.includes(id), id);
      assert.equal(ARCHITECTURES[id].requis.at(-1).mesure, 'pasUrgence', `${id} : jamais l’urgence`);
    }
    const cadre = ARCHITECTURES['cadre-couleur'];
    assert.equal(cadre.layout.shell, 'cadre');
    assert.equal(completerLayout({ architecture: 'cadre-couleur' }).shell, 'cadre');
    assert.deepEqual(cadre.layout.sections.map((s) => `${s.type}/${s.variant}`), ['about/story', 'services/cartes-couleur', 'proof/testimonials']);
    assert.equal(cadre.layout.servicePage, 'porte', 'une page par activité, coiffée de sa couleur');
    assert.equal(cadre.layout.contactDrawer, true, 'pas de section contact sur l’accueil : le tiroir');
    assert.deepEqual(cadre.requis.map((r) => r.mesure), ['photos', 'services', 'pasUrgence']);
    assert.equal(cadre.requis[1].min, 2);
    assert.equal(cadre.requis[1].max, 6);
    const scenes = ARCHITECTURES['scenes-epinglees'];
    assert.equal(scenes.layout.shell, 'scenes');
    assert.deepEqual(scenes.layout.sections.map((s) => `${s.type}/${s.variant}`), ['about/espaces', 'about/equipe-cartes', 'proof/testimonials', 'contact/simple']);
    assert.deepEqual(scenes.requis.map((r) => `${r.mesure}:${r.min ?? ''}`), ['espaces:3', 'photos:3', 'pasUrgence:']);
    for (const v of ['about/espaces', 'about/equipe-cartes', 'services/cartes-couleur']) assert.ok(VARIANTES_D_ARCHITECTURE.includes(v), v);
    assert.match(read('scripts/ff/composer.mjs'), /case 'services\/cartes-couleur':\s*\n\s*return cfg\.layout\?\.architecture === 'cadre-couleur' \|\| services\.some/, 'composer : avec l’architecture, ou dès qu’une activité a sa couleur');
  });

  test('schema : services[].couleur et about.espaces[] (hex ou oklch validés, défaut absent / vide, décrits), coquilles et variantes', async () => {
    const { defineSite, SHELLS, VARIANTS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('cadre') && SHELLS.includes('scenes'));
    assert.ok(VARIANTS.services.includes('cartes-couleur'));
    assert.ok(VARIANTS.about.includes('espaces') && VARIANTS.about.includes('equipe-cartes'));
    const vide = defineSite(minimal);
    assert.equal(vide.services[0].couleur, undefined, 'aucune couleur devinée');
    assert.deepEqual(vide.about.espaces, []);
    const photo = { src: '/images/a.webp', alt: 'A' };
    const plein = defineSite({
      ...minimal,
      layout: { architecture: 'scenes-epinglees' },
      services: [{ slug: 'a', title: 'A', short: 'S', couleur: '#7a4a3a' }, { slug: 'b', title: 'B', short: 'S', couleur: 'oklch(0.72 0.1 95)' }],
      about: { story: 'S', espaces: [{ nom: 'La salle', phrase: 'P.', photo, couleur: 'oklch(80% 0.08 85)' }, { nom: 'La terrasse', phrase: 'P.' }] },
    });
    assert.equal(plein.layout.shell, 'scenes');
    assert.equal(plein.services[1].couleur, 'oklch(0.72 0.1 95)');
    assert.equal(plein.about.espaces[1].photo, undefined, 'un espace sans photo reste sans photo');
    assert.throws(() => defineSite({ ...minimal, services: [{ slug: 'a', title: 'A', short: 'S', couleur: 'rouge' }] }), /couleur/);
    assert.throws(() => defineSite({ ...minimal, services: [{ slug: 'a', title: 'A', short: 'S', couleur: '#abc' }] }), /couleur/, 'hex court refusé');
    assert.throws(() => defineSite({ ...minimal, about: { story: 'S', espaces: [{ nom: 'X' }] } }), /espaces/, 'la phrase est obligatoire');
    const schema = read('src/lib/schema.ts');
    assert.match(schema, /Jamais un espace invente/);
    assert.match(schema, /couleur: couleur\s*\n\s*\.optional\(\)/);
  });

  test('couleur (module pur) : hex et oklch lus, encre choisie par contraste, fond creusé jusqu’à 4,5:1, rien sans couleur', async () => {
    const C = await loadCouleurModule();
    const { ratio } = await import('../scripts/ff/couleur.mjs');
    assert.deepEqual(C.parseCouleur('#ff0000'), [255, 0, 0]);
    assert.deepEqual(C.parseCouleur('oklch(1 0 0)'), [255, 255, 255]);
    assert.equal(C.parseCouleur('rouge'), null);
    assert.equal(C.parseCouleur(undefined), null);
    assert.equal(C.styleTeinte(undefined), undefined, 'sans couleur : les tokens de la direction');
    const sombre = C.teinteLisible('#4b5a3f');
    assert.equal(sombre.claire, true, 'encre claire sur un vert sombre');
    assert.equal(sombre.ajuste, false);
    assert.ok(sombre.contraste >= C.CONTRASTE_TEXTE);
    const clair = C.teinteLisible('oklch(0.9 0.05 90)');
    assert.equal(clair.claire, false, 'encre sombre sur un jaune pâle');
    const moyen = C.teinteLisible('oklch(0.58 0.07 40)');
    assert.equal(moyen.ajuste, true, 'un brun moyen ne porte ni le blanc ni le noir à 4,5:1 : le fond est creusé');
    assert.match(moyen.fond, /^oklch\(0\.\d+ 0\.07\d* \d+\)$/, 'même teinte et même chroma, clarté creusée');
    assert.ok(moyen.contraste >= C.CONTRASTE_TEXTE);
    // contre-vérification avec les formules de scripts/ff/couleur.mjs
    const fondRgb = C.parseCouleur(moyen.fond);
    const encreRgb = C.parseCouleur(moyen.encre);
    assert.ok(ratio(fondRgb, encreRgb) >= 4.5, `contraste mesuré ${ratio(fondRgb, encreRgb).toFixed(2)}`);
    assert.match(C.styleTeinte('#4b5a3f'), /^--teinte: #4b5a3f; --teinte-encre: oklch\(0\.985 0\.008 \d+\);$/);
    assert.doesNotMatch(read('src/lib/couleur.ts'), /^import /m, 'module pur');
  });

  test('donneesManquantes : mesure espaces (about.espaces), photos des espaces comptées, cadre-couleur 2 à 6 activités', async () => {
    const { donneesManquantes, photosDuClient } = await loadArchitecturesModule();
    const photo = { src: '/p.webp', alt: 'p' };
    const espaces = [{ photo }, { photo }, { photo }];
    assert.equal(photosDuClient({ about: { espaces } }), 3);
    assert.deepEqual(donneesManquantes('scenes-epinglees', { about: { espaces }, contact: {} }), []);
    const peu = donneesManquantes('scenes-epinglees', { about: { espaces: [{ photo }] } });
    assert.equal(peu.length, 2, 'un espace, une photo');
    assert.match(peu[0], /3 espaces du lieu au moins.*\(1 aujourd’hui\)/);
    assert.deepEqual(donneesManquantes('cadre-couleur', { images: { hero: photo }, services: [{}, {}] }), []);
    assert.match(donneesManquantes('cadre-couleur', { images: { hero: photo }, services: [{}] }).join(), /2 à 6 activités/);
    assert.match(donneesManquantes('cadre-couleur', { images: { hero: photo }, services: [{}, {}], contact: { emergency24h: true } }).join(), /urgence/);
  });
}

test('coquille cadre : cadre fixe (fond du body, marges, nav rentrée), premier écran collé, feuille à une ombre, pied en flux, socle, tokens', () => {
  const src = read('src/shells/cadre.astro');
  const code = codeDe(src);
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\}/);
  assert.match(code, /site\.proof\.google/);
  assert.match(code, /sections\.map\(/);
  assert.match(code, /<Footer \/>/);
  assert.doesNotMatch(code, /<Hero\s*\/>/, 'la coquille fait son premier écran');
  assert.match(src, /\[data-shell='cadre'\] body \{ background: var\(--cadre-couleur\); \}/, 'le cadre est le fond du corps de page');
  assert.match(src, /--cadre-couleur: color-mix\(in oklab, var\(--color-accent\) 12%, var\(--color-bg-2\)\)/, 'fond 2 à peine teinté, jamais un aplat vif (B1)');
  assert.match(src, /header\[data-nav\] \{ inset-inline: var\(--cadre\); inset-block-start: var\(--cadre\)/, 'la nav rentre dans le cadre');
  assert.match(src, /\.cadre-fond \{ position: sticky; inset-block-start: var\(--cadre\)/);
  assert.match(src, /\.cadre-corps > \.cadre-fond \+ \* \{[^}]*box-shadow: var\(--shadow-lift\)/, 'une seule ombre, sous la première feuille');
  assert.match(src, /\.cadre-pied \{ position: relative/, 'pied en flux (un pied collé en bas se retrouvait en haut des captures)');
  assert.match(src, /@media \(min-width: 48rem\) \{\s*\[data-shell='cadre'\] \{ --cadre: 1\.5rem; \}/, '24 px dès 48 rem, 16 px au téléphone');
  assert.match(src, /prefers-reduced-motion/);
  assert.doesNotMatch(code, /#[0-9a-fA-F]{3,8}\b|rounded-full|999px|radius-pill|uppercase|tracking-|[·—]|italic|data-marquee/);
  assert.match(read('scripts/ff/composer.mjs'), /COQUILLES_D_ARCHITECTURE = \[[^\]]*'cadre', 'scenes'/);
  assert.match(read('tests/shells.test.mjs'), /SANS_HERO = \[[^\]]*'cadre', 'scenes'/);
});

test('services/cartes-couleur : une couleur par activité (styleTeinte, data-theme), sinon la même teinte douce, toute la carte est le lien', () => {
  const src = read('src/sections/Services/cartes-couleur.astro');
  assert.match(src, /<section id="services"/);
  assert.match(src, /import \{ styleTeinte \} from '@\/lib\/couleur'/);
  assert.match(src, /const teinte = styleTeinte\(s\.couleur\)/);
  assert.match(src, /teinte \? 'cc-t-client' : 'cc-t-pale'/, 'sans couleur : la même teinte pour toutes (B5)');
  assert.match(src, /data-theme=\{teinte \? 'service' : undefined\}/);
  assert.match(src, /\.cc-t-client \{ background: var\(--teinte\); color: var\(--teinte-encre\); \}/);
  assert.match(src, /href=\{lien \? `\/services\/\$\{s\.slug\}` : undefined\}/);
  assert.doesNotMatch(codeDe(src), /#[0-9a-fA-F]{3,8}\b|rounded-full|uppercase|tracking-|italic|<script/);
  // la page de l'activité est coiffée de sa couleur (gabarits fiche et porte)
  const page = read('src/pages/services/[slug].astro');
  assert.match(page, /data-theme=\{teinte \? 'service' : undefined\} style=\{teinte\}/);
  assert.match(page, /\.service-fiche\[data-theme='service'\] \{ border-block-start: 0\.75rem solid var\(--teinte\); \}/);
  const porte = read('src/components/ServicePorte.astro');
  assert.match(porte, /data-theme=\{teinte \? 'service' : undefined\} style=\{teinte\}/);
  assert.match(porte, /\{teinte && <div class="porte-couleur" aria-hidden="true"><\/div>\}/);
});

test('coquille scenes : barre fine fixe (nom, métier à ville, tel:, menu), scène d’ouverture sur aplat d’encre, slides nommées, socle, tokens', () => {
  const src = read('src/shells/scenes.astro');
  const code = codeDe(src);
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\}/);
  assert.match(code, /site\.proof\.google/);
  assert.match(code, /sections\.map\(/);
  assert.match(code, /<Footer \/>/);
  assert.doesNotMatch(code, /<Hero\s*\/>|<Nav\s*\/>/, 'barre et ouverture rendues par la coquille');
  assert.match(code, /<header class="sc-barre/);
  assert.match(code, /<details class="sc-menu">/);
  assert.match(code, /<section id="hero" class="slide sc-ouverture bg-ink text-on-ink"/);
  assert.match(code, /class:list=\{\['slide', `slide-\$\{type\}`\]\}/, 'ff ressemblance classe le bloc par le nom de l’enveloppe');
  assert.match(src, /scroll-snap-type: y proximity/);
  assert.match(src, /prefers-reduced-motion: reduce\) \{ \[data-shell='scenes'\] \{ scroll-snap-type: none; \}/);
  assert.doesNotMatch(code, /#[0-9a-fA-F]{3,8}\b|rounded-full|999px|radius-pill|uppercase|tracking-|[·—]|italic|data-marquee/);
});

test('about/espaces : scène épinglée à ÉTAPES (data-pin sur la scène, data-pin-step par panneau), repli empilé, couleur par espace, rien sans espace', () => {
  const src = read('src/sections/About/espaces.astro');
  assert.match(src, /\{n > 0 && \(/, 'sans espace : rien');
  assert.match(src, /<section id="about" class="es"/);
  assert.match(src, /<div class="es-scene" data-pin=\{100 \* Math\.max\(1, n - 1\)\}>/, 'la scène est épinglée, pas la section (le bloc garde son id) ; un écran par espace au-delà du premier');
  assert.match(src, /data-pin-step/);
  assert.match(src, /const teinte = styleTeinte\(e\.couleur\)/);
  assert.match(src, /\.es-t-client \{ background: var\(--teinte\); color: var\(--teinte-encre\); \}/);
  assert.match(src, /transition: opacity 0\.5s var\(--ease-in-out\), transform 0\.5s var\(--ease-in-out\)/, 'transitions en temps, jamais un calage image par image');
  assert.match(src, /\.es-panneau\.is-active ~ \.es-panneau \{ transform: translateX\(6%\); \}/, 'les panneaux se poussent');
  assert.match(src, /\.es-scene:not\(:has\(\.is-active\)\) \.es-panneau:first-child \{ opacity: 1/, 'sans script : le premier panneau');
  assert.match(src, /@media \(prefers-reduced-motion: no-preference\)/, 'épinglage seulement sans mouvement réduit : sinon panneaux empilés');
  assert.doesNotMatch(src, /--p\b|data-scrub|data-frames/, 'étapes, pas de progression continue (iPhone)');
  assert.doesNotMatch(codeDe(src), /#[0-9a-fA-F]{3,8}\b|rounded-full|uppercase|tracking-|italic|<script/);
});

test('about/equipe-cartes : id equipe (about est pris par les espaces), cartes de about.team qui arrivent de côté, file au doigt accessible, rien sans équipe', () => {
  const src = read('src/sections/About/equipe-cartes.astro');
  assert.match(src, /\{equipe\.length > 0 && \(/);
  assert.match(src, /<section id="equipe"/);
  assert.match(src, /<div class="eq-vue" tabindex="0" role="region"/, 'région défilable accessible au clavier (axe)');
  assert.match(src, /<ul class="eq-file" data-stagger="110">/);
  assert.match(src, /\.eq-file:not\(\.is-visible\) > \.eq-carte \{ transform: translateX\(48px\); \}/, 'entrée de côté');
  assert.match(src, /scroll-snap-type: x proximity/);
  assert.match(src, /prefers-reduced-motion/);
  assert.doesNotMatch(codeDe(src), /#[0-9a-fA-F]{3,8}\b|rounded-full|uppercase|tracking-|italic|<script/, 'ni pilule, ni rond');
  const c = read('scripts/ff/composer.mjs');
  assert.match(c, /case 'about\/espaces':\s*\n\s*return cfg\.layout\?\.architecture === 'scenes-epinglees'/);
  assert.match(c, /case 'about\/equipe-cartes':/);
  assert.match(read('src/lib/site.ts'), /\.\.\.s\.about\.espaces\.map\(\(e\) => e\.photo\)/, 'les photos des espaces comptent parmi celles du site');
});

test('docs : DIRECTIONS (cadre, scenes, cartes-couleur, espaces, equipe-cartes), INDEX (Implémentée), CONVENTIONS, ANIMATIONS, journal', () => {
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /\| `cadre` \| \*\*Architecture `cadre-couleur`\*\*/);
  assert.match(d, /\| `scenes` \| \*\*Architecture `scenes-epinglees`\*\*/);
  for (const v of ['cartes-couleur', 'espaces', 'equipe-cartes']) assert.match(d, new RegExp(`\\| \`${v}\` \\| \\*\\*`));
  const idx = read('docs/veille/architectures/INDEX.md');
  assert.match(idx, /^\| `cadre-couleur` \|.*\| oui, coquille `cadre`/m);
  assert.match(idx, /^\| `scenes-epinglees` \|.*\| oui, coquille `scenes`/m);
  assert.match(read('docs/CONVENTIONS.md'), /`cartes-agenda`, `vitrine`, `cadre`, `scenes` ne se prennent qu'avec leur architecture/);
  assert.match(read('docs/ANIMATIONS.md'), /about\/espaces/);
  assert.match(read('docs/veille/journal.md'), /22 oct 2026 : architectures `cadre-couleur`/);
});

test('fumigène : architecture cadre-couleur (FF_LOOK) rend le cadre, le premier écran collé, les cartes de couleur, le tiroir, les pages porte', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'cadre-couleur' } }, '_test-archi-cadre');
  try {
    const html = f.html();
    assert.match(html, /data-shell="cadre"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /<section id="hero" class="cadre-fond/);
    assert.match(html, /href="tel:\+33600000000"/);
    assert.match(html, /4,9 sur 5, 37 avis Google/, 'note Google au premier écran (ff-typo rend l’insécable en caractère)');
    assert.equal((html.match(/class="cc-carte rounded-card cc-t-pale"/g) || []).length, 3, '_exemple n’a pas de couleur : la même teinte douce sur les 3 cartes');
    assert.doesNotMatch(html, /data-theme="service"/);
    const [a, s, p] = ['id="about"', 'id="services"', 'id="proof"'].map((x) => html.indexOf(x));
    assert.ok(a > 0 && a < s && s < p, 'ordre : histoire, activités, avis');
    assert.match(html, /<dialog id="contact-tiroir"/);
    assert.match(f.css, /\[data-shell=cadre\] body\{background:var\(--cadre-couleur\)\}/);
    assert.match(f.html('services/cuisines.html'), /class="porte-page/, 'gabarit porte');
  } finally {
    f.rm();
  }
});

test('fumigène : architecture scenes-epinglees (FF_LOOK) sur _exemple (sans espace ni équipe) rend la barre, l’ouverture, les slides nommées, pas de scène', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'scenes-epinglees' } }, '_test-archi-scenes');
  try {
    const html = f.html();
    assert.match(html, /data-shell="scenes"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /<header class="sc-barre[\s\S]*?href="tel:\+33600000000"/);
    assert.match(html, /<section id="hero" class="slide sc-ouverture/);
    assert.match(html, /class="slide slide-about"/);
    assert.doesNotMatch(html, /data-pin=|id="equipe"/, '_exemple n’a ni espace ni équipe : rien n’est inventé');
    assert.match(html, /<section id="proof"/);
    assert.match(html, /<section id="contact"/);
    assert.ok(f.existe('services/cuisines.html'));
  } finally {
    f.rm();
  }
});

test('fumigène : architecture gamme-vitrine (FF_LOOK) sur _exemple (sans produit) rend le sommaire, pas de page produit, le menu plein écran', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'gamme-vitrine' } }, '_test-archi-vitrine');
  try {
    const html = f.html();
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /data-shell="vitrine"/);
    assert.match(html, /class="vt vt-sommaire/, '_exemple n’a aucun produit : le sommaire, jamais une page vide');
    assert.doesNotMatch(html, /class="vt-produit"/);
    assert.match(html, /<header class="vt-barre[\s\S]*?href="tel:\+33600000000"/, 'téléphone dans la barre fixe');
    assert.match(html, /<dialog id="vt-menu"[\s\S]*?Menuisier-ébéniste à Roubaix/, 'métier et ville dans le menu');
    assert.match(html, /4,9[\s ]sur 5, 37[\s ]avis Google/, 'note Google en une ligne (ff-typo pose l’insécable)');
    assert.match(html, /<dialog id="contact-tiroir"/, 'tiroir de contact');
    assert.doesNotMatch(html, /href="\/produits"/, 'pas de lien Produits sans produit');
    assert.ok(!f.existe('produits.html') && !f.existe('produits/index.html'), 'ni page /produits');
    assert.ok(f.existe('a-propos.html') || f.existe('a-propos/index.html'), 'page À propos');
    assert.ok(f.existe('services/cuisines.html'), 'pages des activités');
  } finally {
    f.rm();
  }
});

// ---- 23 oct 2026 : pages-adresses (Ten Belles) et saisons-sorties (Bureau des guides de La Grave) : les deux fiches du
// 19 oct restées « à coder ». Le site se range par adresse (lieux[], /adresses/<slug>, pros) ou par saison
// (services[].saison, sorties[], /sorties/<slug>, /pour/<public>). ----

if (tsImportable) {
  test('registre pages-adresses / saisons-sorties : coquilles adresses et saisons, aucune section, À propos, tiroir, mesures lieux, saisons, sorties', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, VARIANTES_D_ARCHITECTURE, completerLayout } = await loadArchitecturesModule();
    for (const id of ['pages-adresses', 'saisons-sorties']) assert.ok(ARCHITECTURE_IDS.includes(id), id);
    const a = ARCHITECTURES['pages-adresses'];
    assert.equal(a.layout.shell, 'adresses');
    assert.deepEqual(a.layout.sections, []);
    assert.equal(a.layout.footer, 'columns', 'le pied répète les adresses');
    assert.equal(a.layout.contactDrawer, true);
    assert.equal(a.layout.pageAPropos, true);
    assert.deepEqual(a.requis.map((e) => e.mesure), ['lieux', 'pasUrgence']);
    const s = ARCHITECTURES['saisons-sorties'];
    assert.equal(s.layout.shell, 'saisons');
    assert.deepEqual(s.layout.sections, []);
    assert.equal(s.layout.contactDrawer, true);
    assert.equal(s.layout.pageAPropos, true);
    assert.deepEqual(s.requis.map((e) => e.mesure), ['saisons', 'sorties', 'pasUrgence']);
    assert.equal(completerLayout({ architecture: 'saisons-sorties' }).shell, 'saisons');
    for (const v of ['zones/adresses', 'services/saisons']) assert.ok(VARIANTES_D_ARCHITECTURE.includes(v), v);
  });

  test('donneesManquantes : lieux (rue ET horaires), saisons (2 activités chacune), sorties (période), photos des lieux et des sorties', async () => {
    const { donneesManquantes, photosDuClient } = await loadArchitecturesModule();
    const h = [{ days: 'Lundi', hours: '8 h' }];
    const lieu = (street) => ({ address: { street, postalCode: '69002', city: 'Lyon' }, hours: h });
    assert.deepEqual(donneesManquantes('pages-adresses', { lieux: [lieu('1 rue A'), lieu('2 rue B')] }), []);
    assert.match(donneesManquantes('pages-adresses', { lieux: [lieu('1 rue A'), lieu(undefined)] }).join(), /2 adresses.*\(1 aujourd’hui\)/, 'un lieu sans rue ne compte pas');
    assert.match(donneesManquantes('pages-adresses', { lieux: [lieu('1 rue A'), { address: { street: '2 rue B' }, hours: [] }] }).join(), /\(1 aujourd’hui\)/, 'un lieu sans horaires ne compte pas');
    assert.match(donneesManquantes('pages-adresses', {}).join(), /\(0 aujourd’hui\)/);
    assert.match(donneesManquantes('pages-adresses', { lieux: [lieu('a'), lieu('b')], contact: { emergency24h: true } }).join(), /urgence/);
    const services = [{ saison: 'Été' }, { saison: 'Été' }, { saison: 'Hiver' }, { saison: 'Hiver ' }];
    const sorties = Array.from({ length: 4 }, () => ({ periode: 'De juin à septembre' }));
    assert.deepEqual(donneesManquantes('saisons-sorties', { services, sorties }), []);
    assert.match(donneesManquantes('saisons-sorties', { services: services.slice(0, 3), sorties }).join(), /2 saisons.*\(1 aujourd’hui\)/, 'une saison d’une seule activité ne compte pas');
    assert.match(donneesManquantes('saisons-sorties', { services, sorties: sorties.slice(0, 2) }).join(), /4 sorties.*\(2 aujourd’hui\)/);
    assert.match(donneesManquantes('saisons-sorties', { services: [{}, {}], sorties }).join(), /\(0 aujourd’hui\)/, 'sans saison : rien n’est deviné');
    const p = { src: '/x.webp', alt: 'x' };
    assert.equal(photosDuClient({ lieux: [{ photo: p, photos: [p, p] }], sorties: [{ photo: p }, {}] }), 4);
  });

  test('schema : lieux[], pros, sorties[], services[].saison (défauts vides ou absents, décrits), form.dates, wording.lieux et wording.pros, coquilles et variantes', async () => {
    const { defineSite, SHELLS, VARIANTS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('adresses') && SHELLS.includes('saisons'));
    assert.ok(VARIANTS.zones.includes('adresses'));
    assert.ok(VARIANTS.services.includes('saisons'));
    const vide = defineSite(minimal);
    assert.deepEqual(vide.lieux, []);
    assert.deepEqual(vide.sorties, []);
    assert.equal(vide.pros, undefined);
    assert.equal(vide.services[0].saison, undefined);
    assert.equal(vide.form.dates, undefined);
    assert.equal(vide.wording.lieux, 'Nos adresses');
    assert.equal(vide.wording.pros, 'Professionnels');
    const avec = defineSite({
      ...minimal,
      layout: { architecture: 'pages-adresses' },
      lieux: [{ slug: 'gare', nom: 'La gare', address: { postalCode: '69002', city: 'Lyon' }, hours: [{ days: 'Lundi', hours: '8 h à 12 h', opens: '08:00', closes: '12:00' }] }],
      pros: { titre: 'Restaurants', texte: 'Livraison le matin.' },
      services: [{ slug: 's', title: 'T', short: 'S', saison: 'Été' }],
      sorties: [{ slug: 'lac', service: 's', titre: 'Le lac', resume: 'Une journée.', periode: 'Juillet' }],
    });
    assert.equal(avec.layout.shell, 'adresses');
    assert.equal(avec.lieux[0].phone, undefined, 'téléphone du lieu absent = absent (repli au rendu)');
    assert.deepEqual(avec.lieux[0].regles, []);
    assert.deepEqual(avec.pros.offres, []);
    assert.equal(avec.services[0].saison, 'Été');
    assert.equal(avec.sorties[0].prix, undefined, 'prix absent = absent');
    assert.equal(avec.sorties[0].enAvant, false);
    assert.deepEqual(avec.sorties[0].programme, []);
    assert.throws(() => defineSite({ ...minimal, sorties: [{ slug: 'x', titre: 'X', resume: 'R' }] }), /sorties/, 'la période est obligatoire');
    assert.throws(() => defineSite({ ...minimal, lieux: [{ slug: 'X Y', nom: 'X', address: { postalCode: '1', city: 'C' } }] }), /lieux/);
    const schema = read('src/lib/schema.ts');
    assert.match(schema, /Jamais une adresse inventee/);
    assert.match(schema, /Jamais une sortie, une periode ou un prix inventes/);
    assert.match(schema, /hours: z\.array\(ligneHoraire\)\.default\(\[\]\),/, 'contact.hours et lieux[].hours partagent la même ligne');
  });

  test('lieux (module pur) : téléphone du lieu avec repli, adresse, autres lieux, nav (deux noms ou « Nos adresses »), pros, lieux complets', async () => {
    const { telDuLieu, adresseDuLieu, autresLieux, liensLieux, lienPros, lieuxComplets } = await loadLieuxModule();
    const contact = { phone: '+33611111111', phoneDisplay: '06 11 11 11 11' };
    assert.deepEqual(telDuLieu({ phone: '+33622222222', phoneDisplay: '06 22 22 22 22' }, contact), { href: 'tel:+33622222222', affiche: '06 22 22 22 22', propre: true });
    assert.deepEqual(telDuLieu({}, contact), { href: 'tel:+33611111111', affiche: '06 11 11 11 11', propre: false }, 'jamais un numéro deviné');
    assert.equal(telDuLieu({ phone: '+33622222222' }, contact).affiche, '+33622222222');
    assert.equal(adresseDuLieu({ address: { street: '8 rue Mercière', postalCode: '69002', city: 'Lyon' } }), '8 rue Mercière, 69002 Lyon');
    assert.equal(adresseDuLieu({ address: { postalCode: '69002', city: 'Lyon' } }), '69002 Lyon');
    const ls = [{ slug: 'a', nom: 'A' }, { slug: 'b', nom: 'B' }, { slug: 'c', nom: 'C' }];
    assert.deepEqual(autresLieux(ls, 'b').map((l) => l.slug), ['a', 'c']);
    assert.deepEqual(liensLieux(ls.slice(0, 2), 'Nos adresses'), [{ href: '/adresses/a', label: 'A' }, { href: '/adresses/b', label: 'B' }]);
    assert.deepEqual(liensLieux(ls, 'Nos boutiques'), [{ href: '/adresses', label: 'Nos boutiques' }]);
    assert.deepEqual(liensLieux([], 'x'), []);
    assert.deepEqual(lienPros({ titre: 't' }, 'Pros'), { href: '/professionnels', label: 'Pros' });
    assert.equal(lienPros(undefined, 'Pros'), null);
    assert.equal(lieuxComplets([{ address: { street: 'r' }, hours: [1] }, { address: {}, hours: [1] }, { address: { street: 'r' }, hours: [] }]), 1);
    assert.doesNotMatch(read('src/lib/lieux.ts'), /^import (?!type )/m, 'module pur');
  });

  test('sorties (module pur) : saisons dans l’ordre, groupes dès deux saisons (Toute l’année seulement si besoin), sorties d’une activité, niveaux, en avant, publics, nav', async () => {
    const { slugTexte, saisonsDe, groupesParSaison, saisonsCompletes, sortiesDuService, niveauxDe, sortiesEnAvant, publicsDe, liensSaisons, TOUTE_L_ANNEE } = await loadSortiesModule();
    assert.equal(slugTexte('Été'), 'ete');
    assert.equal(slugTexte('Scolaires et centres'), 'scolaires-et-centres');
    const sv = [{ slug: 'rando', saison: 'Été' }, { slug: 'raq', saison: 'Hiver' }, { slug: 'via', saison: 'Été ' }, { slug: 'cours' }];
    assert.deepEqual(saisonsDe(sv), ['Été', 'Hiver']);
    const g = groupesParSaison(sv);
    assert.deepEqual(g.map((x) => [x.saison, x.slug, x.services.map((s) => s.slug)]), [['Été', 'ete', ['rando', 'via']], ['Hiver', 'hiver', ['raq']], [TOUTE_L_ANNEE, 'toute-l-annee', ['cours']]]);
    assert.deepEqual(groupesParSaison([{ slug: 'a', saison: 'Été' }, { slug: 'b' }]), [], 'une seule saison : rien ne change');
    assert.deepEqual(groupesParSaison(sv.slice(0, 3)).map((x) => x.saison), ['Été', 'Hiver'], 'pas de « Toute l’année » sans activité sans saison');
    assert.equal(saisonsCompletes(sv), 1);
    assert.deepEqual(liensSaisons(sv), [{ href: '/#saison-ete', label: 'Été' }, { href: '/#saison-hiver', label: 'Hiver' }]);
    const so = [
      { slug: 'a', service: 'rando', niveau: 'Découverte', enAvant: true, public: ['Familles'] },
      { slug: 'b', service: 'rando', niveau: 'Confirmé', public: ['Familles', 'Scolaires'] },
      { slug: 'c', service: 'raq', niveau: 'Découverte ', enAvant: true, public: ['Familles '] },
      { slug: 'd' },
    ];
    assert.deepEqual(sortiesDuService(so, 'rando').map((x) => x.slug), ['a', 'b']);
    assert.deepEqual(niveauxDe(so), ['Découverte', 'Confirmé']);
    assert.deepEqual(sortiesEnAvant(so).map((x) => x.slug), ['a', 'c']);
    assert.deepEqual(sortiesEnAvant(so, 1).map((x) => x.slug), ['a']);
    assert.deepEqual(publicsDe(so), [{ public: 'Familles', slug: 'familles', n: 3 }], 'une page par public de trois sorties ou plus');
    assert.deepEqual(publicsDe(so, 1).map((p) => p.public), ['Familles', 'Scolaires']);
    assert.doesNotMatch(read('src/lib/sorties.ts'), /^import (?!type )/m, 'module pur');
  });
}

test('coquille adresses : intro (h1, métier à ville, tel:, note), une section par lieu (tel: du lieu, état du jour), bandeau pros, repli sans lieu, tokens', () => {
  const code = codeDe(read('src/shells/adresses.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\}/);
  assert.match(code, /site\.proof\.google/);
  assert.match(code, /lieux\.map\(\(l, i\) => \{/);
  assert.match(code, /<section id=\{i === 0 \? 'adresses' : undefined\} class:list=\{\['adr-lieu'/, 'une section par lieu');
  assert.match(code, /telDuLieu\(l, site\.contact\)/);
  assert.match(code, /<HorairesDuJour hours=\{l\.hours\}/);
  assert.match(code, /href=\{`\/adresses\/\$\{l\.slug\}`\}/);
  assert.match(code, /href="\/professionnels"/);
  assert.match(code, /donneesManquantes\('pages-adresses', site\)/, 'sans lieu : message au build');
  assert.match(code, /<Footer \/>/);
  assert.doesNotMatch(code, /<Hero\s*\/>/);
  assert.doesNotMatch(code, /#[0-9a-fA-F]{3,8}\b/, 'tokens uniquement');
  assert.doesNotMatch(code, /font-family|rounded-full|999px|uppercase|tracking-|[·—]|italic|eyebrow/);
  assert.match(read('scripts/ff/composer.mjs'), /COQUILLES_D_ARCHITECTURE = \[[^\]]*'adresses', 'saisons'/);
});

test('coquille saisons : en tête h1, métier à ville, diplômes, tel:, note, par public ; une section par saison (id saison-<slug>) ; à la une ; id contact ; repli ; tokens', () => {
  const code = codeDe(read('src/shells/saisons.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /business\.certifications/);
  assert.match(code, /href=\{tel\(\)\}/);
  assert.match(code, /site\.proof\.google/);
  assert.match(code, /<div id="contact" class="ss-cote">/, 'sans section contact, /#contact a une cible sans script');
  assert.match(code, /href=\{`\/pour\/\$\{p\.slug\}`\}/);
  assert.match(code, /groupesParSaison\(site\.services\)/);
  assert.match(code, /id=\{g\.saison \? `saison-\$\{g\.slug\}` : 'services'\}/);
  assert.match(code, /<CarteSortie sortie=\{x\}/);
  assert.match(code, /donneesManquantes\('saisons-sorties', site\)/);
  assert.doesNotMatch(code, /overflow-x: auto/, 'jamais la file horizontale (essai refusé : déroulé à 0,86 de prospect-epi-dor-c)');
  assert.doesNotMatch(code, /#[0-9a-fA-F]{3,8}\b/);
  assert.doesNotMatch(code, /font-family|rounded-full|999px|uppercase|tracking-|[·—]|italic|eyebrow|text-shadow/);
});

test('sections zones/adresses et services/saisons : lisent site, rien sans donnée, tel: du lieu, ancres de saison, cartes de sortie, tokens', () => {
  const ad = codeDe(read('src/sections/Zones/adresses.astro'));
  assert.match(ad, /\{lieux\.length > 0 && \(/, 'aucun lieu = rien');
  assert.match(ad, /<section id="zones"/);
  assert.match(ad, /telDuLieu\(l, site\.contact\)/);
  assert.match(ad, /<HorairesDuJour hours=\{l\.hours\}/);
  const sa = codeDe(read('src/sections/Services/saisons.astro'));
  assert.match(sa, /<section id="services"/);
  assert.match(sa, /id=\{g\.slug \? `saison-\$\{g\.slug\}` : undefined\}/);
  assert.match(sa, /sortiesEnAvant\(site\.sorties, 3\)/);
  assert.match(sa, /publicsDe\(site\.sorties\)/);
  for (const c of [ad, sa]) assert.doesNotMatch(c, /#[0-9a-fA-F]{3,8}\b|font-family|rounded-full|uppercase|tracking-|[·—]|italic|eyebrow/);
  const carte = codeDe(read('src/components/CarteSortie.astro'));
  assert.match(carte, /x\.duree \? \{ k: 'Durée'/, 'repères en mots, absents s’ils manquent');
  assert.match(carte, /const reserver = x\.lien \?\? '\/#contact'/);
  const filtre = codeDe(read('src/components/SortiesFiltrables.astro'));
  assert.match(filtre, /niveaux\.length >= 2 && \(/);
  assert.match(filtre, /\.sf:has\(\[data-sf="1"\]:checked\) \.sf-item:not\(\[data-niveau="1"\]\)/, 'filtre sans script');
  assert.doesNotMatch(filtre, /<script/);
  const comp = read('scripts/ff/composer.mjs');
  assert.match(comp, /case 'zones\/adresses':/);
  assert.match(comp, /case 'services\/saisons':/);
});

test('pages /adresses, /adresses/<slug>, /professionnels, /sorties/<slug>, /pour/<public> : générées seulement avec leurs données ; JSON-LD par lieu ; nav ; formulaire', () => {
  const lieu = read('src/pages/adresses/[slug].astro');
  assert.match(lieu, /site\.lieux\.map\(\(l\) => \(\{ params: \{ slug: l\.slug \}/);
  assert.match(lieu, /lieuLd\(site, l, pageUrl/);
  assert.match(lieu, /<Horaires hours=\{l\.hours\} \/>/);
  assert.match(lieu, /telDuLieu\(l, site\.contact\)/);
  assert.match(read('src/pages/adresses/[...index].astro'), /site\.lieux\.length > 0 \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(read('src/pages/adresses/[...index].astro'), /<section id="ecrire"/);
  assert.match(read('src/pages/professionnels/[...index].astro'), /site\.pros \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  const so = read('src/pages/sorties/[slug].astro');
  assert.match(so, /site\.sorties\.map\(\(x\) => \(\{ params: \{ slug: x\.slug \}/);
  assert.match(so, /<details class="so-bloc"/, 'programme, inclus, à prévoir en <details> natifs');
  assert.match(so, /\]\.filter\(Boolean\)/, 'un bloc absent n’existe pas');
  assert.match(read('src/pages/pour/[public].astro'), /publicsDe\(site\.sorties\)\.map/);
  assert.match(read('src/pages/services/[slug].astro'), /sortiesDuService\(site\.sorties, service\.slug\)/);
  const ld = read('src/lib/jsonld.ts');
  assert.match(ld, /export function lieuLd\(/);
  assert.match(ld, /openingHoursSpecification\(lieu\.hours\)/);
  assert.match(ld, /\.\.\.\(!test\.tel \? \{ telephone/, 'jamais de téléphone de test envoyé');
  const s = read('src/lib/site.ts');
  assert.match(s, /liensLieux\(s\.lieux \?\? \[\], s\.wording\.lieux\)/);
  assert.match(s, /lienPros\(s\.pros, s\.wording\.pros\)/);
  assert.match(s, /s\.layout\.shell === 'saisons' \|\|/);
  const form = read('src/components/ContactForm.astro');
  assert.match(form, /const avecDates = f\.dates === true;/, 'sixième champ seulement sur demande');
  assert.match(form, /<optgroup label="Sorties">/);
  assert.match(read('src/worker/contact.js'), /Dates souhaitées : \$\{dates\}/);
  for (const f of ['src/components/Horaires.astro', 'src/components/HorairesDuJour.astro']) assert.match(read(f), /const lignes = hours \?\? site\.contact\.hours;/, `${f} : horaires d’un lieu`);
  assert.match(read('src/sections/Footer/columns.astro'), /site\.lieux\.length > 0 \? \(/, 'le pied répète les adresses');
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadLieuxModule\(\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadSortiesModule\(\)/);
});

test('docs : DIRECTIONS (coquilles adresses et saisons, zones/adresses, services/saisons), INDEX (colonne codée), fiches, CLAUDE.md', () => {
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /^\| `adresses` \| \*\*Architecture `pages-adresses`\*\*/m);
  assert.match(d, /^\| `saisons` \| \*\*Architecture `saisons-sorties`\*\*/m);
  assert.match(d, /^\| `adresses` \| \*\*Bandeau des adresses\*\*/m);
  assert.match(d, /^\| `saisons` \| \*\*Les activités rangées par saison\*\*/m);
  const idx = read('docs/veille/architectures/INDEX.md');
  assert.match(idx, /\| codée \|/);
  assert.match(idx, /^\| \[pages-adresses\]\(pages-adresses\.md\) \|.*\| oui \(23 oct\)/m);
  assert.match(idx, /^\| \[saisons-sorties\]\(saisons-sorties\.md\) \|.*\| oui \(23 oct\)/m);
  for (const f of ['pages-adresses', 'saisons-sorties']) assert.match(read(`docs/veille/architectures/${f}.md`), /## Codée dans l'usine \(23 oct 2026\)/);
  assert.match(read('CLAUDE.md'), /`lieux` \(défaut `\[\]`\)/);
});

test('fumigène : architecture pages-adresses (FF_LOOK) sur _exemple (sans lieu) rend l’intro et la photo, ni page d’adresse ni page pros', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'pages-adresses' } }, '_test-archi-adresses-fum');
  try {
    const html = f.html();
    assert.match(html, /data-shell="adresses"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /class="adr-intro"[\s\S]*?href="tel:\+33600000000"/);
    assert.match(html, /adr-photo-seule/, 'sans lieu : la photo seule, aucun lieu inventé');
    assert.doesNotMatch(html, /href="\/adresses/);
    assert.doesNotMatch(html, /href="\/professionnels"/);
    assert.ok(!f.existe('adresses.html') && !f.existe('adresses/index.html'), 'ni page /adresses');
    assert.ok(!f.existe('professionnels.html'), 'ni page pros');
    assert.ok(f.existe('a-propos.html') || f.existe('a-propos/index.html'));
    assert.ok(f.existe('services/cuisines.html'));
  } finally {
    f.rm();
  }
});

test('fumigène : architecture saisons-sorties (FF_LOOK) sur _exemple (sans saison ni sortie) rend une colonne unique, ni page de sortie ni page par public', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'saisons-sorties' } }, '_test-archi-saisons-fum');
  try {
    const html = f.html();
    assert.match(html, /data-shell="saisons"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /<div id="contact" class="ss-cote[\s\S]*?href="tel:\+33600000000"/);
    assert.match(html, /<section id="services" class="ss-saison/, 'sans saison : une seule colonne');
    assert.doesNotMatch(html, /id="saison-|class="ss-portes"|class="container-ff ss-une"/, 'ni saison ni sortie inventée');
    assert.doesNotMatch(html, /name="dates"/);
    assert.ok(!f.existe('sorties') && !f.existe('pour'), 'ni page de sortie ni page par public');
    assert.ok(f.existe('services/cuisines.html'));
  } finally {
    f.rm();
  }
});
