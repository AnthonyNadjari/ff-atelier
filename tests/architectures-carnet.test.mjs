// Architectures du 29 oct 2026, tour 18 (veille, docs/veille/architectures/INDEX.md) : carnet-interventions (Monsieur Boris,
// serrurier à Nîmes ; L'Atelier Bois Acier, Amiens : le site d'un artisan qui intervient chez les gens est son carnet de bord
// daté et situé) et rayon-trajet (Colson Elec, Bellevigny ; Concept Froid Centre, Suèvres : le site d'un artisan qui se déplace
// part de « vient-il jusque chez moi, et en combien de temps ? »). Deux mécanismes qui ne sont PAS des onglets : le temps (un
// carnet du plus récent au plus ancien, rangé par mois) et l'espace (un schéma des temps de trajet autour de la base).
// Registre, mesures de donneesManquantes, schéma, modules purs (src/lib/journal.ts, src/lib/trajet.ts), coquilles, pages, nav,
// modèles de navigation de ff ressemblance (journal daté, plan ou schéma), docs, et un fumigène de build par architecture sur
// sites/_exemple (sans interventions ni trajet : rien d'inventé).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadArchitecturesModule, loadSchemaModule, loadJournalModule, loadTrajetModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';
import { modeleNavigation, MODELES } from '../scripts/ff/deroule.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const codeDe = (src) => src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const INTERDITS = /#[0-9a-fA-F]{3,8}\b|font-family|rounded-full|999px|uppercase|tracking-|[·—]|italic|eyebrow|text-shadow/;
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'Maçon', tagline: 'Z', description: 'D' },
  contact: { phone: '+33612345678', phoneDisplay: '06 12 34 56 78', email: 'a@b.fr', address: { street: '1 rue A', postalCode: '57000', city: 'Metz' } },
  services: [{ slug: 's', title: 'T', short: 'S' }],
  about: { story: 'S' },
};

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
  return { html: (p = 'index.html') => fs.readFileSync(path.join(dir, p), 'utf8'), existe: (p) => fs.existsSync(path.join(dir, p)), rm: () => fs.rmSync(dir, { recursive: true, force: true }) };
}

const iv = (slug, date, lieu = 'Sablon', titre = 'Seuil recalé') => ({ slug, date, lieu, titre });
const communes = [
  { slug: 'a', nom: 'Aubière', minutes: 35, direction: 'nord' },
  { slug: 'b', nom: 'Billom', minutes: 12, direction: 'nord' },
  { slug: 'c', nom: 'Champeix', minutes: 18 },
  { slug: 'd', nom: 'Saint-Flour', minutes: 65, direction: 'sud-ouest' },
];

if (!tsImportable) {
  test('[ignoré] node ne sait pas type-stripper le TS ici', (t) => t.skip());
} else {
  test('registre carnet-interventions / rayon-trajet : coquilles interventions et trajet, sources, mesures, pied liens', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, completerLayout } = await loadArchitecturesModule();
    for (const id of ['carnet-interventions', 'rayon-trajet']) assert.ok(ARCHITECTURE_IDS.includes(id), id);
    const c = ARCHITECTURES['carnet-interventions'];
    assert.equal(c.layout.shell, 'interventions');
    assert.equal(c.layout.footer, 'liens', 'pied sur le fond de la page, avec les pages des services');
    assert.deepEqual(c.layout.sections.map((x) => x.type), ['proof'], 'pas de fin de page d’usine (questions sur /carnet)');
    assert.deepEqual(c.requis.map((x) => x.mesure), ['interventions']);
    assert.equal(c.sources[0].site, 'serrurier-nimes30.fr');
    assert.ok(c.sources.some((x) => x.site === 'atelier-bois-acier.fr'));
    const r = ARCHITECTURES['rayon-trajet'];
    assert.equal(r.layout.shell, 'trajet');
    assert.equal(r.layout.footer, 'liens');
    assert.deepEqual(r.layout.sections.map((x) => x.type), ['proof']);
    assert.deepEqual(r.requis.map((x) => x.mesure), ['trajet', 'directionsTrajet']);
    assert.equal(r.sources[0].site, 'colson-elec.fr');
    assert.ok(r.sources.some((x) => x.site === 'conceptfroid.fr'));
    assert.equal(completerLayout({ architecture: 'rayon-trajet' }).shell, 'trajet');
    assert.equal(completerLayout({ architecture: 'carnet-interventions', shell: 'flow' }).shell, 'flow', 'un réglage du site gagne');
  });

  test('donneesManquantes : interventions datées (vraie date, sans doublon), communes à temps, directions', async () => {
    const { donneesManquantes, photosDuClient } = await loadArchitecturesModule();
    const quatre = [iv('a', '2026-10-01'), iv('b', '2026-10-02'), iv('c', '2026-09-30'), iv('d', '2026-08-01')];
    assert.deepEqual(donneesManquantes('carnet-interventions', { interventions: quatre }), []);
    const m = donneesManquantes('carnet-interventions', { interventions: [iv('a', '2026-02-30'), iv('b', '2026-10-01'), iv('b', '2026-10-02'), iv('c', '2026-10-03', ' '), iv('d', '1er oct.')] }).join(' | ');
    assert.match(m, /4 interventions.*\(1 aujourd’hui\)/, 'un 30 février, un doublon, un lieu vide, une date en mots ne comptent pas');
    assert.equal(photosDuClient({ interventions: [{ photo: {} }, {}] }), 1, 'la photo d’une intervention est une photo du client');
    assert.deepEqual(donneesManquantes('rayon-trajet', { trajet: { communes: [...communes, { slug: 'e', nom: 'E', minutes: 40, direction: 'est' }] } }), []);
    const t = donneesManquantes('rayon-trajet', { trajet: { communes: [{ slug: 'a', nom: 'A', minutes: 0, direction: 'nord' }, ...communes.slice(1)] } }).join(' | ');
    assert.match(t, /4 communes.*\(3 aujourd’hui\)/, 'un temps nul ne compte pas');
    assert.match(t, /3 communes au moins avec leur direction.*\(2 aujourd’hui\)/, 'une commune sans direction n’est pas sur le schéma');
  });

  test('schema : interventions et trajet (optionnels, décrits), wording, coquilles ; rien par défaut', async () => {
    const { defineSite, SHELLS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('interventions') && SHELLS.includes('trajet'));
    const vide = defineSite(minimal);
    assert.deepEqual(vide.interventions, [], 'aucune intervention inventée');
    assert.equal(vide.trajet, undefined, 'aucun trajet inventé');
    assert.equal(vide.wording.carnet, 'Le carnet');
    assert.equal(vide.wording.trajet, 'Temps de trajet');
    const avec = defineSite({ ...minimal, layout: { architecture: 'carnet-interventions' }, interventions: [iv('a', '2026-10-01')], trajet: { communes: [{ slug: 'b', nom: 'B', minutes: 10 }] } });
    assert.equal(avec.layout.shell, 'interventions');
    assert.deepEqual(avec.interventions[0].etapes, [], 'aucune étape inventée');
    assert.equal(avec.interventions[0].duree, undefined, 'aucune durée inventée');
    assert.equal(avec.interventions[0].prix, undefined, 'aucun prix inventé');
    assert.equal(avec.trajet.communes[0].direction, undefined, 'aucune direction inventée');
    assert.equal(avec.trajet.communes[0].km, undefined, 'aucune distance inventée');
    assert.throws(() => defineSite({ ...minimal, interventions: [iv('a', '1 octobre')] }), 'date AAAA-MM-JJ');
    assert.throws(() => defineSite({ ...minimal, trajet: { communes: [{ slug: 'b', nom: 'B', minutes: 10, direction: 'nord-nord-est' }] } }), 'huit directions');
    const schema = read('src/lib/schema.ts');
    assert.match(schema, /Jamais une intervention, une date, un lieu, une durée ou un prix inventés\./);
    assert.match(schema, /Jamais un temps, une distance ou une direction inventés\./);
  });

  test('journal (module pur) : complètes et triées, par mois, lieux, dates, il y a, voisines, lien', async () => {
    const J = await loadJournalModule();
    const l = [iv('a', '2026-09-10', 'Woippy'), iv('b', '2026-10-21', 'Sablon'), iv('c', '2026-10-03', 'Sablon'), iv('b', '2026-10-22'), iv('x', '2026-02-29'), iv('d', '2026-10-21', 'Queuleu')];
    assert.deepEqual(J.interventionsCompletes(l).map((x) => x.slug), ['b', 'd', 'c', 'a'], 'plus récente d’abord, à date égale l’ordre du client ; 29 février 2026 refusé');
    assert.equal(J.dateValide('2028-02-29'), true);
    assert.deepEqual(J.parMois(l).map((m) => [m.libelle, m.interventions.length]), [['octobre 2026', 3], ['septembre 2026', 1]]);
    assert.deepEqual(J.lieuxDuCarnet(l).map((x) => [x.lieu, x.n]), [['Sablon', 2], ['Queuleu', 1], ['Woippy', 1]]);
    assert.equal(J.slugLieu('Montigny-lès-Metz'), 'montigny-les-metz');
    assert.equal(J.dateLongue('2026-10-01'), '1er octobre 2026');
    const now = new Date(2026, 9, 29, 15);
    assert.equal(J.ilYA('2026-10-29', now), 'aujourd’hui');
    assert.equal(J.ilYA('2026-10-28', now), 'hier');
    assert.equal(J.ilYA('2026-10-26', now), 'il y a 3 jours');
    assert.equal(J.ilYA('2026-10-01', now), 'il y a 4 semaines');
    assert.equal(J.ilYA('2026-11-02', now), '', 'une date à venir ne dit rien');
    assert.deepEqual(Object.fromEntries(Object.entries(J.voisines(l, 'd')).map(([k, v]) => [k, v.slug])), { plusRecente: 'b', plusAncienne: 'c' });
    assert.equal(J.lienCarnet(l.slice(0, 2), 'Le carnet'), undefined, 'deux interventions ne font pas une page');
    assert.deepEqual(J.lienCarnet(l, 'Le carnet'), { href: '/carnet', label: 'Le carnet' });
  });

  test('trajet (module pur) : complètes et triées, durées, cercles, placement par direction seulement, côté des étiquettes, recherche, voisines, lien', async () => {
    const T = await loadTrajetModule();
    assert.deepEqual(T.communesCompletes([...communes, { slug: 'b', nom: 'Doublon', minutes: 5 }, { slug: 'z', nom: 'Z', minutes: -1 }]).map((c) => c.slug), ['b', 'c', 'a', 'd']);
    assert.equal(T.dureeLisible(25), '25 min');
    assert.equal(T.dureeLisible(60), '1 h');
    assert.equal(T.dureeLisible(65), '1 h 05');
    assert.deepEqual(T.anneaux(communes), [15, 30, 45, 60, 90]);
    assert.deepEqual(T.anneaux([{ minutes: 12 }]), [15, 30], 'au moins deux cercles');
    const p = T.placer(communes);
    assert.deepEqual(p.map((x) => x.commune.slug), ['b', 'a', 'd'], 'Champeix sans direction n’est pas placée');
    const b = p.find((x) => x.commune.slug === 'b');
    const a = p.find((x) => x.commune.slug === 'a');
    assert.ok(b.y < 50 && a.y < b.y, 'nord en haut, la plus loin plus haut');
    assert.ok(b.x < 50 && a.x > 50, 'deux communes au nord s’écartent de part et d’autre');
    assert.ok(p.find((x) => x.commune.slug === 'd').x < 50, 'sud-ouest à gauche');
    assert.ok(p.every((x) => x.cote === 'droite' || x.cote === 'gauche'));
    assert.equal(T.rayonSchema(90, 90), 46);
    assert.ok(T.rayonSchema(12, 90) > (12 / 90) * 46, 'racine : les communes proches ne s’entassent pas');
    assert.equal(T.chercher(communes, 'st flour')?.slug, 'd', '« st » = « saint »');
    assert.equal(T.chercher(communes, 'CHAMP')?.slug, 'c', 'début de nom unique');
    assert.equal(T.chercher(communes, 'Paris'), undefined);
    assert.equal(T.chercher(communes, 'a'), undefined, 'une lettre ne suffit pas');
    assert.deepEqual(T.voisinesDe(communes, 'c').map((x) => x.slug), ['b']);
    assert.deepEqual(T.lienTrajet(communes, 'Temps de trajet'), { href: '/trajet', label: 'Temps de trajet' });
    assert.equal(T.lienTrajet(communes.slice(0, 2), 'T'), undefined);
  });
}

test('coquille interventions : h1, métier, téléphone, dernière intervention ; carnet par mois, mois collé ; lieux ; contact ; tokens', () => {
  const code = codeDe(read('src/shells/interventions.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\} class="iv-tel/);
  assert.match(code, /data-iv-ilya=\{derniere\.date\}/, '« il y a » calculé dans le navigateur');
  assert.match(code, /parMois\(toutes\.slice\(0, SUR_L_ACCUEIL\)\)/);
  assert.match(code, /<time datetime=\{x\.date\}/);
  assert.match(code, /\.iv-mois-t \{ position: sticky;/, 'le mois collé pendant qu’on lit');
  assert.ok(code.indexOf('id="hero"') < code.indexOf('id="carnet"') && code.indexOf('id="carnet"') < code.indexOf('id="zones"') && code.indexOf('id="zones"') < code.indexOf('sections.map(') && code.indexOf('sections.map(') < code.indexOf('id="contact"'), 'héros, carnet, lieux, sections, contact');
  assert.doesNotMatch(code, /id="services"|id="faq"/, 'pas de fin de page d’usine sur l’accueil');
  assert.match(code, /onPage\(/);
  assert.match(code, /<Footer \/>/);
  assert.doesNotMatch(code, INTERDITS);
});

test('coquille trajet : h1, téléphone, question sans formulaire ; schéma (cercles SVG, communes en HTML posées), tableau, ailleurs ; tokens', () => {
  const code = codeDe(read('src/shells/trajet.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /role="search"[^>]*data-tj-form hidden/, 'la question n’apparaît qu’avec le script');
  assert.doesNotMatch(code, /<form\b/, 'rien n’est envoyé : pas de formulaire');
  assert.match(code, /chercher\(communes, saisie\.value\)/);
  assert.match(code, /placerCommunes\(communes\)/);
  assert.match(code, /style=\{`left: \$\{p\.x\}%; top: \$\{p\.y\}%`\}/);
  assert.match(code, /<table class="tj-table">/);
  assert.match(code, /Schéma des temps, pas une carte/);
  assert.ok(code.indexOf('id="hero"') < code.indexOf('id="territoire"') && code.indexOf('id="territoire"') < code.indexOf('sections.map(') && code.indexOf('sections.map(') < code.indexOf('id="contact"'), 'héros, territoire, sections, base');
  assert.doesNotMatch(code, /id="services"|id="faq"/);
  assert.match(code, /onPage\(/);
  assert.match(code, /<Footer \/>/);
  assert.doesNotMatch(code, INTERDITS);
});

test('pages /carnet, /carnet/<slug>, /trajet, /trajet/<slug> : générées seulement avec leurs données ; questions ; nav', () => {
  assert.match(read('src/pages/carnet/[...index].astro'), /lienCarnet\(site\.interventions, site\.wording\.carnet\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(read('src/pages/carnet/[slug].astro'), /interventionsCompletes\(site\.interventions\)\.map\(\(x\) => \(\{ params: \{ slug: x\.slug \}/);
  assert.match(read('src/pages/carnet/[slug].astro'), /voisinesDuCarnet\(site\.interventions, x\.slug\)/);
  assert.match(read('src/pages/trajet/[...index].astro'), /lienTrajet\(site\.trajet\?\.communes, site\.wording\.trajet\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(read('src/pages/trajet/[slug].astro'), /communesCompletes\(site\.trajet\?\.communes\)\.map\(\(c\) => \(\{ params: \{ slug: c\.slug \}/);
  for (const p of ['src/pages/carnet/[...index].astro', 'src/pages/trajet/[...index].astro']) assert.match(read(p), /site\.faq\.length > 0 && \(/, `${p} : les questions`);
  for (const p of ['src/pages/carnet/[...index].astro', 'src/pages/carnet/[slug].astro', 'src/pages/trajet/[...index].astro', 'src/pages/trajet/[slug].astro']) assert.doesNotMatch(codeDe(read(p)), INTERDITS, p);
  const s = read('src/lib/site.ts');
  assert.match(s, /lienCarnet\(s\.interventions, s\.wording\.carnet\)/);
  assert.match(s, /lienTrajet\(s\.trajet\?\.communes, s\.wording\.trajet\)/);
  assert.match(s, /s\.layout\.shell === 'interventions' \|\| s\.layout\.shell === 'trajet'/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadJournalModule\(\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadTrajetModule\(\)/);
  assert.match(read('scripts/ff/composer.mjs'), /'interventions', 'trajet'[,\]]/);
});

test('ff ressemblance : modèles de navigation « journal daté » et « plan ou schéma » (le temps et l’espace se mesurent)', () => {
  assert.ok(MODELES.includes('journal daté') && MODELES.includes('plan ou schéma'));
  assert.equal(modeleNavigation({ partJournal: 0.5, pagesLiees: 5, pagesContenu: 5, ecrans: 8 }), 'journal daté');
  assert.equal(modeleNavigation({ partJournal: 0.2, pagesLiees: 5, pagesContenu: 5, ecrans: 8 }), 'plusieurs pages', 'un petit fil daté ne fait pas un journal');
  assert.equal(modeleNavigation({ plan: true, pagesLiees: 1, pagesContenu: 9, ecrans: 5 }), 'plan ou schéma');
  assert.equal(modeleNavigation({ partOnglets: 0.7, partJournal: 0.6 }), 'onglets', 'les onglets restent prioritaires');
  const d = read('scripts/ff/deroule.mjs');
  assert.match(d, /ds\.every\(\(d, i\) => i === 0 \|\| d <= ds\[i - 1\]\)/, 'du plus récent au plus ancien : un agenda ne compte pas');
});

test('docs : DIRECTIONS (coquilles), INDEX (codées), fiches et captures, CLAUDE.md', () => {
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /^\| `interventions` \| \*\*Architecture `carnet-interventions`\*\*/m);
  assert.match(d, /^\| `trajet` \| \*\*Architecture `rayon-trajet`\*\*/m);
  const idx = read('docs/veille/architectures/INDEX.md');
  assert.match(idx, /^\| \[carnet-interventions\]\(carnet-interventions\.md\) \|.*\| oui \(29 oct\) \|$/m);
  assert.match(idx, /^\| \[rayon-trajet\]\(rayon-trajet\.md\) \|.*\| oui \(29 oct\) \|$/m);
  for (const fiche of ['carnet-interventions', 'rayon-trajet']) {
    const t = read(`docs/veille/architectures/${fiche}.md`);
    assert.match(t, /## Codée dans l'usine \(29 oct 2026\)/);
    assert.match(t, /\]\(https:\/\//, 'sources citées en lien');
    for (const c of ['source', 'essai']) assert.ok(fs.existsSync(path.join(ROOT, `docs/veille/architectures/captures/${fiche}-${c}.jpg`)), `${fiche}-${c}.jpg`);
  }
  assert.match(read('CLAUDE.md'), /`interventions` \(défaut `\[\]`, architecture `carnet-interventions`/);
  assert.match(read('CLAUDE.md'), /`trajet` \(optionnel,\s+architecture `rayon-trajet`/);
});

test('fumigène : architecture carnet-interventions (FF_LOOK) sur _exemple (sans interventions) rend le h1, l’appel et le contact, pas de carnet ni de /carnet', { timeout: 180_000 }, () => {
  const fx = fumigene({ layout: { architecture: 'carnet-interventions' } }, '_test-archi-carnet-fum');
  try {
    const html = fx.html();
    assert.match(html, /data-shell="interventions"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="iv-tel/);
    assert.match(html, /id="contact"/);
    assert.doesNotMatch(html, /id="carnet"|Dernière intervention/, 'aucune intervention inventée');
    assert.equal(fx.existe('carnet.html') || fx.existe('carnet/index.html'), false);
  } finally {
    fx.rm();
  }
});

test('fumigène : architecture rayon-trajet (FF_LOOK) sur _exemple (sans trajet) rend le h1, le téléphone et la base, pas de schéma ni de /trajet', { timeout: 180_000 }, () => {
  const fx = fumigene({ layout: { architecture: 'rayon-trajet' } }, '_test-archi-trajet-fum');
  try {
    const html = fx.html();
    assert.match(html, /data-shell="trajet"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="tj-tel/);
    assert.match(html, /id="contact"/);
    assert.doesNotMatch(html, /id="territoire"|data-tj-question/, 'aucun temps de trajet inventé');
    assert.equal(fx.existe('trajet.html') || fx.existe('trajet/index.html'), false);
  } finally {
    fx.rm();
  }
});
