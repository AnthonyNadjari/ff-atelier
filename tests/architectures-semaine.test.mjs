// Architectures du 27 oct 2026, tour 11 (veille, docs/veille/architectures/INDEX.md) : planning-semaine (Danse Germain
// Blanchet, Rouen, et Ell'Zi-Danse, Saintes : le site d'une école est son planning, un onglet par jour, le jour même
// ouvert, un filtre par discipline, le cours d'essai) et catalogue-location (Location Service, Mulhouse, et Deslandes
// Motoculture : le site d'un loueur est son parc, prix par durée, particulier TTC ou pro HT, caution, le bon créneau).
// Registre, mesures de donneesManquantes, schéma, modules purs (src/lib/planning.ts, src/lib/location.ts), coquilles,
// pages, docs, et un fumigène de build par architecture sur sites/_exemple (sans planning ni parc : rien d'inventé).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadArchitecturesModule, loadSchemaModule, loadPlanningModule, loadLocationModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const codeDe = (src) => src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const INTERDITS = /#[0-9a-fA-F]{3,8}\b|font-family|rounded-full|999px|uppercase|tracking-|[·—]|italic|eyebrow|text-shadow/;
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'École de danse', tagline: 'Z', description: 'D' },
  contact: { phone: '+33612345678', phoneDisplay: '06 12 34 56 78', email: 'a@b.fr', address: { street: '1 rue A', postalCode: '49100', city: 'Angers' } },
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

const cours = (jour, debut, fin, nom = 'Salsa', service) => ({ jour, debut, fin, nom, ...(service ? { service } : {}) });

if (!tsImportable) {
  test('[ignoré] node ne sait pas type-stripper le TS ici', (t) => t.skip());
} else {
  test('registre planning-semaine / catalogue-location : coquilles planning et location, sources, mesures', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, completerLayout } = await loadArchitecturesModule();
    for (const id of ['planning-semaine', 'catalogue-location']) assert.ok(ARCHITECTURE_IDS.includes(id), id);
    const p = ARCHITECTURES['planning-semaine'];
    assert.equal(p.layout.shell, 'planning');
    assert.equal(p.layout.servicePage, 'porte', 'une page par discipline, ses lignes à prix et ses créneaux');
    assert.equal(p.layout.footer, 'minimal');
    assert.deepEqual(p.layout.sections, [{ type: 'proof', variant: 'testimonials' }]);
    assert.deepEqual(p.requis.map((e) => e.mesure), ['planning', 'rue', 'pasUrgence']);
    assert.equal(p.sources[0].site, 'centre-danse-rouen.com');
    const l = ARCHITECTURES['catalogue-location'];
    assert.equal(l.layout.shell, 'location');
    assert.equal(l.layout.footer, 'minimal');
    assert.deepEqual(l.layout.sections, [{ type: 'proof', variant: 'testimonials' }]);
    assert.deepEqual(l.requis.map((e) => e.mesure), ['materiels', 'rue', 'horaires']);
    assert.equal(l.sources[0].site, 'locationservice.fr');
    assert.equal(completerLayout({ architecture: 'planning-semaine' }).shell, 'planning');
    assert.equal(completerLayout({ architecture: 'catalogue-location', shell: 'flow' }).shell, 'flow', 'un réglage du site gagne');
  });

  test('donneesManquantes : cours valides (jour, heures, nom), matériels à prix, rue, horaires', async () => {
    const { donneesManquantes } = await loadArchitecturesModule();
    const rue = { contact: { address: { street: '8 rue A' }, hours: [{ days: 'Lundi', hours: '8 h – 12 h' }] } };
    const six = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'].map((j) => cours(j, '18:00', '19:00'));
    assert.deepEqual(donneesManquantes('planning-semaine', { ...rue, planning: { cours: six } }), []);
    const faux = [...six.slice(0, 4), cours('lundi', '19:00', '18:00'), cours('funday', '18:00', '19:00'), cours('mardi', '25:00', '26:00'), { ...cours('mardi', '18:00', '19:00'), nom: ' ' }];
    assert.match(donneesManquantes('planning-semaine', { ...rue, planning: { cours: faux } }).join(), /6 cours.*\(4 aujourd’hui\)/, 'fin avant début, jour inconnu, heure impossible, sans nom : ne comptent pas');
    assert.match(donneesManquantes('planning-semaine', { planning: { cours: six }, contact: { emergency24h: true } }).join(), /street[\s\S]*urgence/);
    const m = (slug, prix) => ({ slug, nom: slug, prix });
    const parc = { durees: ['Journée', 'Semaine'], materiels: ['a', 'b', 'c', 'd', 'e', 'f'].map((x) => m(x, ['29 €', ''])) };
    assert.deepEqual(donneesManquantes('catalogue-location', { ...rue, location: parc }), []);
    assert.match(donneesManquantes('catalogue-location', { ...rue, location: { ...parc, materiels: [...parc.materiels.slice(0, 5), m('g', ['', ''])] } }).join(), /6 matériels.*\(5 aujourd’hui\)/, 'sans aucun prix, pas au parc');
    assert.match(donneesManquantes('catalogue-location', { ...rue, location: { materiels: parc.materiels } }).join(), /\(0 aujourd’hui\)/, 'sans durées, aucun prix ne se lit');
    assert.match(donneesManquantes('catalogue-location', { location: parc }).join(), /street[\s\S]*contact\.hours/);
  });

  test('schema : planning et location (optionnels, décrits), wording, coquilles ; rien par défaut', async () => {
    const { defineSite, SHELLS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('planning') && SHELLS.includes('location'));
    const vide = defineSite(minimal);
    assert.equal(vide.planning, undefined, 'aucun planning inventé');
    assert.equal(vide.location, undefined, 'aucun parc inventé');
    assert.equal(vide.wording.planning, 'Le planning');
    assert.equal(vide.wording.essai, 'Cours d’essai');
    assert.equal(vide.wording.materiel, 'Le matériel');
    assert.equal(vide.wording.chercher, 'Chercher un outil');
    const avec = defineSite({
      ...minimal,
      layout: { architecture: 'planning-semaine' },
      planning: { cours: [cours('lundi', '18:10', '19:10', 'Rock', 's')] },
      location: { durees: ['Journée'], materiels: [{ slug: 'b', nom: 'Bétonnière', prix: ['29 €'] }] },
    });
    assert.equal(avec.layout.shell, 'planning');
    assert.equal(avec.planning.cours[0].prof, undefined, 'aucun professeur inventé');
    assert.equal(avec.planning.essai, undefined);
    assert.deepEqual(avec.location.materiels[0].prixPro, [], 'aucun prix pro inventé');
    assert.equal(avec.location.materiels[0].caution, undefined);
    assert.deepEqual(avec.location.creneaux, []);
    assert.throws(() => defineSite({ ...minimal, planning: { cours: [{ ...cours('lundi', '18h', '19h') }] } }), 'heures HH:MM seulement');
    assert.throws(() => defineSite({ ...minimal, planning: { cours: [cours('lun', '18:00', '19:00')] } }), 'jour en toutes lettres');
    const schema = read('src/lib/schema.ts');
    assert.match(schema, /Jamais un cours, une heure ou un prix inventes\./);
    assert.match(schema, /Jamais un prix, une caution ou une disponibilite inventes\./);
  });

  test('planning (module pur) : cours valides, jours rangés, disciplines, durées, heures, créneaux d’un service, lien', async () => {
    const P = await loadPlanningModule();
    const p = {
      cours: [
        cours('mardi', '19:30', '20:30', 'Rock', 'rock'),
        cours('lundi', '20:15', '21:15', 'Salsa', 'salsa'),
        cours('lundi', '18:10', '19:10', 'Rock', 'rock'),
        cours('Mardi', '18:00', '19:30', 'Modern’jazz'),
        cours('jeudi', '19:00', '18:00', 'Faux'),
        cours('samedi', '10:00', '10:45', 'Éveil', 'enfants'),
        cours('samedi', '11:00', '12:00', 'Initiation', 'enfants'),
      ],
    };
    assert.equal(P.coursValides(p).length, 6, 'la fin avant le début ne compte pas');
    const j = P.joursDuPlanning(p);
    assert.deepEqual(j.map((x) => x.jour), ['lundi', 'mardi', 'samedi'], 'du lundi au dimanche, jours vides sautés');
    assert.deepEqual(j[0].cours.map((x) => x.debut), ['18:10', '20:15'], 'rangés par heure');
    assert.equal(j[1].label, 'Mardi');
    assert.equal(j[2].index, 5);
    assert.deepEqual(P.disciplines(P.coursValides(p), { rock: 'Rock et danses de salon' }).map((d) => [d.cle, d.label, d.n]), [['rock', 'Rock et danses de salon', 2], ['salsa', 'Salsa', 1], ['modern’jazz', 'Modern’jazz', 1], ['enfants', 'Éveil', 2]]);
    assert.equal(P.dureeDuCours({ debut: '18:00', fin: '19:30' }), '1 h 30');
    assert.equal(P.dureeDuCours({ debut: '10:00', fin: '10:45' }), '45 min');
    assert.equal(P.dureeDuCours({ debut: '18:10', fin: '19:10' }), '1 h');
    assert.equal(P.dureeDuCours({ debut: '19:00', fin: '18:00' }), '');
    assert.equal(P.heureLisible('18:10'), '18 h 10');
    assert.equal(P.heureLisible('09:00'), '9 h');
    assert.deepEqual(P.coursDuService(p, 'enfants').map((x) => [x.jour, x.cours.length]), [['samedi', 2]]);
    assert.deepEqual(P.coursDuService(p, 'inconnu'), []);
    assert.equal(P.indexDuJour('Dimanche'), 6);
    assert.equal(P.indexDuJour('lun'), -1);
    assert.deepEqual(P.lienPlanning(p, 'Le planning'), { href: '/planning', label: 'Le planning' });
    assert.equal(P.lienPlanning({ cours: p.cours.slice(0, 3) }, 'x'), undefined, 'moins de 6 cours : pas de page');
    assert.equal(P.lienPlanning({ cours: Array.from({ length: 6 }, () => cours('lundi', '18:00', '19:00')) }, 'x'), undefined, 'un seul jour : pas de page');
    assert.equal(P.lienPlanning(undefined, 'x'), undefined);
  });

  test('location (module pur) : matériels à prix, catégories, prix par durée, prix pro, lien', async () => {
    const L = await loadLocationModule();
    const l = {
      durees: ['Demi-journée', 'Journée', 'Semaine'],
      materiels: [
        { slug: 'betonniere', nom: 'Bétonnière', categorie: 'Béton', prix: ['20 €', '29 €', '145 €'], prixPro: ['', '24 €', ''] },
        { slug: 'tondeuse', nom: 'Tondeuse', categorie: 'Jardin', prix: ['', '38 €', ''] },
        { slug: 'remorque', nom: 'Remorque', prix: ['25 €'] },
        { slug: 'sans-prix', nom: 'Sans prix', categorie: 'Béton', prix: ['', '', ''] },
        { slug: 'hors-durees', nom: 'Hors durées', prix: ['', '', '', '99 €'] },
        { slug: 'piqueur', nom: 'Piqueur', categorie: 'Béton', prix: ['40 €'] },
      ],
    };
    const c = L.materielsComplets(l);
    assert.deepEqual(c.map((m) => m.slug), ['betonniere', 'tondeuse', 'remorque', 'piqueur'], 'sans prix, ou un prix hors des durées : pas au parc');
    assert.deepEqual(L.materielsComplets({ materiels: l.materiels }), [], 'sans durées, rien');
    assert.deepEqual(L.categoriesDe(c).map((g) => [g.nom, g.materiels.map((m) => m.slug)]), [['Béton', ['betonniere', 'piqueur']], ['Jardin', ['tondeuse']], [L.SANS_CATEGORIE, ['remorque']]]);
    assert.deepEqual(L.prixDuMateriel(l.materiels[0], l.durees), [{ duree: 'Demi-journée', prix: '20 €' }, { duree: 'Journée', prix: '29 €', pro: '24 €' }, { duree: 'Semaine', prix: '145 €' }]);
    assert.deepEqual(L.prixDuMateriel(l.materiels[1], l.durees), [{ duree: 'Journée', prix: '38 €' }]);
    assert.deepEqual(L.premierPrix(l.materiels[1], l.durees), { duree: 'Journée', prix: '38 €' });
    assert.equal(L.aPrixPro(l), true);
    assert.equal(L.aPrixPro({ ...l, materiels: l.materiels.slice(1) }), false);
    assert.deepEqual(L.lienMateriel(l, 'Le matériel'), { href: '/materiel', label: 'Le matériel' });
    assert.equal(L.lienMateriel({ ...l, materiels: l.materiels.slice(0, 3) }, 'x'), undefined, 'moins de 4 matériels : pas de page');
  });
}

test('coquille planning : h1, métier à ville, tel:, cours d’essai ; onglets par jour (jour même, colonnes à l’ordinateur), filtre ; essai et école dans le bloc ; tokens', () => {
  const code = codeDe(read('src/shells/planning.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\} class="pl-tel/);
  assert.match(code, /href="#essai" class="pl-essai-porte"/);
  assert.match(code, /<section id="planning" class="pl-semaine"[^>]*data-pl>/);
  assert.match(code, /joursDuPlanning\(p\)/);
  assert.match(code, /data-pl-onglets/);
  assert.match(code, /setAttribute\('role', 'tablist'\)/);
  assert.match(code, /setAttribute\('role', 'tabpanel'\)/);
  assert.match(code, /maintenant\(new Date\(\)\)/, 'le jour même, fuseau Europe/Paris');
  assert.match(code, /matchMedia\('\(min-width: 64rem\)'\)/, 'à l’ordinateur, les jours en colonnes');
  assert.match(code, /repeat\(var\(--pl-n\), minmax\(0, 1fr\)\)/);
  assert.match(code, /data-pl-filtre hidden/, 'le filtre n’existe qu’avec le script');
  assert.match(code, /aria-pressed/);
  // Le premier cours et l'école sont DANS le bloc qui porte les onglets (le planning tient la page : ff ressemblance).
  const bloc = code.slice(code.indexOf('<section id="planning"'), code.indexOf('{sections.map('));
  assert.match(bloc, /<section id="essai"/);
  assert.match(bloc, /<section id="ecole"/);
  assert.match(code, /href="\/planning"/);
  assert.match(code, /onPage\(/);
  assert.match(code, /<Footer \/>/);
  assert.match(code, /sections\.map\(/);
  assert.doesNotMatch(code, INTERDITS);
});

test('coquille location : h1, tel:, recherche (role=search vers /materiel), bascule TTC / HT sans script, onglets par catégorie, créneaux et magasin dans le bloc ; tokens', () => {
  const code = codeDe(read('src/shells/location.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\} class="lo-tel/);
  assert.match(code, /<form class="lo-cherche" role="search" action="\/materiel" method="get"/);
  assert.match(code, /<section id="parc" class="lo-parc"/);
  assert.match(code, /type="radio" name="lo-client" id="lo-pro"/);
  assert.match(code, /\.lo-parc:has\(#lo-pro:checked\)/, 'la bascule en CSS seul');
  assert.match(code, /categoriesDeMateriel\(materiels\)/);
  assert.match(code, /setAttribute\('role', 'tablist'\)/);
  assert.match(code, /prixDuMateriel\(m, durees\)/);
  assert.match(code, /href=\{`\/materiel\/\$\{m\.slug\}`\}/);
  const bloc = code.slice(code.indexOf('<section id="parc"'), code.indexOf('{sections.map('));
  assert.match(bloc, /<section id="creneaux"/);
  assert.match(bloc, /<section id="magasin"/);
  assert.match(code, /<HorairesDuJour \/>/);
  assert.match(code, /onPage\(/);
  assert.match(code, /<Footer \/>/);
  assert.match(code, /sections\.map\(/);
  assert.doesNotMatch(code, INTERDITS);
});

test('pages /planning, /materiel, /materiel/<slug> : générées seulement avec leurs données ; créneaux sur la page de discipline ; nav ; verifier', () => {
  const pl = read('src/pages/planning/[...index].astro');
  assert.match(pl, /lienPlanning\(site\.planning, site\.wording\.planning\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(pl, /<CreneauxDuCours \/>/);
  const ma = read('src/pages/materiel/[...index].astro');
  assert.match(ma, /lienMateriel\(site\.location, site\.wording\.materiel\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(ma, /<table class="ma-table">/);
  assert.match(ma, /URLSearchParams\(location\.search\)\.get\('q'\)/, 'la recherche sans script arrive ici');
  const fiche = read('src/pages/materiel/[slug].astro');
  assert.match(fiche, /materielsComplets\(site\.location\)\.map\(\(m\) => \(\{ params: \{ slug: m\.slug \}/);
  assert.match(fiche, /<h1[\s>]/);
  assert.match(fiche, /href=\{tel\(\)\}/);
  const cr = codeDe(read('src/components/CreneauxDuCours.astro'));
  assert.match(cr, /coursDuService\(site\.planning, service\)/);
  assert.doesNotMatch(cr, INTERDITS);
  for (const f of ['src/pages/planning/[...index].astro', 'src/pages/materiel/[...index].astro', 'src/pages/materiel/[slug].astro']) assert.doesNotMatch(codeDe(read(f)), INTERDITS, f);
  const svc = read('src/pages/services/[slug].astro');
  assert.match(svc, /coursDuService\(site\.planning, service\.slug\)/);
  assert.match(svc, /<CreneauxDuCours service=\{service\.slug\}/);
  const s = read('src/lib/site.ts');
  assert.match(s, /lienPlanning\(s\.planning, s\.wording\.planning\)/);
  assert.match(s, /lienMateriel\(s\.location, s\.wording\.materiel\)/);
  assert.match(s, /s\.layout\.shell !== 'planning'/, 'la nav de l’école garde « Le planning » seul');
  assert.match(read('src/pages/404.astro'), /hasContactDoor\(site\) && <p class="mt-6"><a href="\/#contact"/, 'pas d’ancre #contact sans porte');
  assert.match(read('scripts/ff/verifier.mjs'), /role=\["'\]search\["'\]/, 'un formulaire de recherche n’a pas de piège à bots');
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadPlanningModule\(\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadLocationModule\(\)/);
  assert.match(read('scripts/ff/composer.mjs'), /'planning', 'location'[,\]]/);
});

test('docs : DIRECTIONS (coquilles planning et location), INDEX (codées), fiches, CLAUDE.md', () => {
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /^\| `planning` \| \*\*Architecture `planning-semaine`\*\*/m);
  assert.match(d, /^\| `location` \| \*\*Architecture `catalogue-location`\*\*/m);
  const idx = read('docs/veille/architectures/INDEX.md');
  assert.match(idx, /^\| \[planning-semaine\]\(planning-semaine\.md\) \|.*\| oui \(27 oct\) \|$/m);
  assert.match(idx, /^\| \[catalogue-location\]\(catalogue-location\.md\) \|.*\| oui \(27 oct\) \|$/m);
  for (const f of ['planning-semaine', 'catalogue-location']) {
    const fiche = read(`docs/veille/architectures/${f}.md`);
    assert.match(fiche, /## Codée dans l'usine \(27 oct 2026\)/);
    assert.match(fiche, /\]\(https:\/\//, 'sources citées en lien');
  }
  assert.match(read('CLAUDE.md'), /`planning` \(optionnel, architecture `planning-semaine`/);
});

test('fumigène : architecture planning-semaine (FF_LOOK) sur _exemple (sans planning) rend l’en-tête et l’école, pas de semaine ni de /planning', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'planning-semaine' } }, '_test-archi-planning-fum');
  try {
    const html = f.html();
    assert.match(html, /data-shell="planning"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="pl-tel/);
    assert.doesNotMatch(html, /id="planning"|data-pl-onglets|href="#essai"/, 'aucun cours inventé');
    assert.match(html, /<section id="ecole"/);
    assert.equal(f.existe('planning.html') || f.existe('planning/index.html'), false);
  } finally {
    f.rm();
  }
});

test('fumigène : architecture catalogue-location (FF_LOOK) sur _exemple (sans parc) rend l’en-tête et le magasin, pas de parc ni de /materiel', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'catalogue-location' } }, '_test-archi-location-fum');
  try {
    const html = f.html();
    assert.match(html, /data-shell="location"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="lo-tel/);
    assert.doesNotMatch(html, /id="parc"|role="search"|name="lo-client"/, 'aucun matériel inventé');
    assert.match(html, /<section id="magasin"/);
    assert.equal(f.existe('materiel.html') || f.existe('materiel/index.html'), false);
  } finally {
    f.rm();
  }
});
