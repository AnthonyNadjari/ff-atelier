// Architectures du 26 oct 2026 (veille, docs/veille/architectures/INDEX.md) : outil-calendrier (Coquelicots : tout
// l'accueil mène au calendrier des nuits libres, lu au build, et à la demande de dates) et parcours-atelier (Turning
// Earth : le site est une échelle, « Où en êtes-vous ? » en onglets, une page par barreau). Registre, mesures de
// donneesManquantes, schéma, modules purs (src/lib/sejour.ts, src/lib/parcours.ts), coquilles, composant, pages, docs, et
// un fumigène de build par architecture sur sites/_exemple (sans calendrier ni parcours : rien d'inventé).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadArchitecturesModule, loadSchemaModule, loadSejourModule, loadParcoursModule, loadActionsModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const codeDe = (src) => src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const INTERDITS = /#[0-9a-fA-F]{3,8}\b|font-family|rounded-full|999px|uppercase|tracking-|[·—]|italic|eyebrow|text-shadow/;
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'Gîte', tagline: 'Z', description: 'D' },
  contact: { phone: '+33612345678', phoneDisplay: '06 12 34 56 78', email: 'a@b.fr', address: { street: '1 rue A', postalCode: '24220', city: 'Saint-Cyprien' } },
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

if (!tsImportable) {
  test('[ignoré] node ne sait pas type-stripper le TS ici', (t) => t.skip());
} else {
  test('registre outil-calendrier / parcours-atelier : coquilles calendrier et parcours, sources, mesures', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, completerLayout } = await loadArchitecturesModule();
    for (const id of ['outil-calendrier', 'parcours-atelier']) assert.ok(ARCHITECTURE_IDS.includes(id), id);
    const c = ARCHITECTURES['outil-calendrier'];
    assert.equal(c.layout.shell, 'calendrier');
    assert.deepEqual(c.layout.sections, [{ type: 'proof', variant: 'testimonials' }], 'les avis avant l’outil (socle)');
    assert.deepEqual(c.requis.map((e) => e.mesure), ['calendrier', 'services', 'pasUrgence']);
    assert.equal(c.sources[0].site, 'coquelicots.nl');
    const p = ARCHITECTURES['parcours-atelier'];
    assert.equal(p.layout.shell, 'parcours');
    assert.equal(p.layout.footer, 'minimal');
    assert.deepEqual(p.layout.sections, [], 'les avis sont rendus par la coquille, sous leur barreau');
    assert.equal(p.layout.contactDrawer, true);
    assert.deepEqual(p.requis.map((e) => e.mesure), ['parcours', 'rue', 'pasUrgence']);
    assert.equal(p.sources[0].site, 'turningearth.uk');
    assert.equal(completerLayout({ architecture: 'parcours-atelier' }).shell, 'parcours');
    assert.equal(completerLayout({ architecture: 'outil-calendrier', shell: 'flow' }).shell, 'flow', 'un réglage du site gagne');
  });

  test('donneesManquantes : calendrier (périodes ou iCal), logements, barreaux avec formules ; photos des barreaux comptées', async () => {
    const { donneesManquantes, photosDuClient } = await loadArchitecturesModule();
    const logements = [{}, {}];
    assert.deepEqual(donneesManquantes('outil-calendrier', { services: logements, disponibilites: { occupe: [{}] } }), []);
    assert.deepEqual(donneesManquantes('outil-calendrier', { services: logements, disponibilites: { occupe: [], ics: 'https://x/a.ics' } }), []);
    assert.match(donneesManquantes('outil-calendrier', { services: logements, disponibilites: { occupe: [] } }).join(), /un calendrier.*\(0 aujourd’hui\)/, 'sans période ni iCal, aucun calendrier');
    assert.match(donneesManquantes('outil-calendrier', { services: [{}, {}, {}, {}, {}], disponibilites: { occupe: [{}] } }).join(), /1 à 4 logements/);
    const b = (n = 1) => ({ formules: Array.from({ length: n }, () => ({ nom: 'x' })) });
    const rue = { contact: { address: { street: '8 rue A' } } };
    assert.deepEqual(donneesManquantes('parcours-atelier', { ...rue, parcours: [b(), b()] }), []);
    assert.match(donneesManquantes('parcours-atelier', { ...rue, parcours: [b(), b(0)] }).join(), /2 barreaux.*\(1 aujourd’hui\)/, 'un barreau sans formule ne compte pas');
    assert.match(donneesManquantes('parcours-atelier', { parcours: [b(), b()], contact: { emergency24h: true } }).join(), /contact\.address\.street[\s\S]*urgence/);
    assert.equal(photosDuClient({ parcours: [{ photo: {} }, {}] }), 1);
  });

  test('schema : disponibilites, parcours[], testimonials[].barreau, wording, coquilles ; rien par défaut', async () => {
    const { defineSite, SHELLS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('calendrier') && SHELLS.includes('parcours'));
    const vide = defineSite(minimal);
    assert.equal(vide.disponibilites, undefined, 'aucun calendrier inventé');
    assert.deepEqual(vide.parcours, []);
    assert.equal(vide.wording.disponibilites, 'Les dates libres');
    assert.equal(vide.wording.parcours, 'Où en êtes-vous ?');
    const avec = defineSite({
      ...minimal,
      layout: { architecture: 'outil-calendrier' },
      disponibilites: { occupe: [{ du: '2026-11-14', au: '2026-11-16' }] },
      parcours: [{ slug: 'decouvrir', niveau: 'Je découvre', titre: 'Initiation' }],
      proof: { testimonials: [{ author: 'A', text: 'T', source: 'Google', barreau: 'decouvrir' }] },
    });
    assert.equal(avec.layout.shell, 'calendrier');
    assert.equal(avec.disponibilites.mois, 12);
    assert.deepEqual(avec.disponibilites.tarifs, []);
    assert.equal(avec.disponibilites.ics, undefined);
    assert.deepEqual(avec.parcours[0].formules, []);
    assert.deepEqual(avec.parcours[0].nonCompris, []);
    assert.equal(avec.proof.testimonials[0].barreau, 'decouvrir');
    assert.throws(() => defineSite({ ...minimal, disponibilites: { occupe: [{ du: '14/11/2026', au: '2026-11-16' }] } }), /disponibilites/);
    assert.throws(() => defineSite({ ...minimal, disponibilites: { ics: 'pas une url' } }), /disponibilites/);
    assert.throws(() => defineSite({ ...minimal, parcours: [{ slug: 'Découvrir', niveau: 'x', titre: 'y' }] }), /parcours/);
    const schema = read('src/lib/schema.ts');
    assert.match(schema, /Jamais une disponibilite inventee/);
    assert.match(schema, /Jamais une formule, un prix ou une date inventes/);
    assert.match(schema, /lue AU BUILD/);
  });

  test('sejour (module pur) : nuits prises (départ exclu), séjour libre, départ max, fusion, à venir, mois du lundi, iCal, libellés, lien', async () => {
    const S = await loadSejourModule();
    const occ = [{ du: '2026-11-14', au: '2026-11-16' }];
    assert.equal(S.ajouterJours('2026-10-31', 1), '2026-11-01');
    assert.equal(S.ajouterJours('2026-12-31', 1), '2027-01-01');
    assert.equal(S.nuitsEntre('2026-11-10', '2026-11-14'), 4);
    assert.equal(S.nuitPrise(occ, '2026-11-14'), true);
    assert.equal(S.nuitPrise(occ, '2026-11-15'), true);
    assert.equal(S.nuitPrise(occ, '2026-11-16'), false, 'le jour du départ est libre pour une arrivée');
    assert.equal(S.sejourLibre(occ, '2026-11-10', '2026-11-14'), true, 'on part le jour où d’autres arrivent');
    assert.equal(S.sejourLibre(occ, '2026-11-10', '2026-11-15'), false);
    assert.equal(S.sejourLibre(occ, '2026-11-16', '2026-11-20'), true);
    assert.equal(S.sejourLibre(occ, '2026-11-12', '2026-11-12'), false, 'zéro nuit');
    assert.equal(S.departMax(occ, '2026-11-10', '2027-01-01'), '2026-11-14');
    assert.equal(S.departMax(occ, '2026-11-16', '2027-01-01'), '2027-01-01');
    assert.deepEqual(S.fusionnerPeriodes([{ du: '2026-11-14', au: '2026-11-16' }, { du: '2026-11-01', au: '2026-11-03' }, { du: '2026-11-16', au: '2026-11-18', libelle: 'x' }, { du: '2026-11-20', au: '2026-11-19' }, { du: 'demain', au: '2026-11-19' }]), [{ du: '2026-11-01', au: '2026-11-03' }, { du: '2026-11-14', au: '2026-11-18', libelle: 'x' }], 'contiguës fusionnées, à l’envers et illisibles écartées');
    assert.deepEqual(S.periodesAVenir([{ du: '2026-10-20', au: '2026-10-26' }, { du: '2026-10-24', au: '2026-10-27' }], '2026-10-26'), [{ du: '2026-10-24', au: '2026-10-27' }], 'une période dont le départ est aujourd’hui est passée');
    const [nov, dec] = S.moisDuCalendrier('2026-11-26', 2);
    assert.equal(nov.nom, 'Novembre 2026');
    assert.equal(nov.cle, '2026-11');
    assert.deepEqual(nov.semaines[0], [null, null, null, null, null, null, '2026-11-01'], 'le 1er novembre 2026 est un dimanche');
    assert.ok(nov.semaines.every((s) => s.length === 7));
    assert.deepEqual(dec.semaines[0].slice(0, 2), [null, '2026-12-01']);
    assert.equal(S.moisDuCalendrier('2026-12-05', 2)[1].nom, 'Janvier 2027');
    const ics = 'BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nDTSTART;VALUE=DATE:20261114\r\nDTEND;VALUE=DATE:20261116\r\nSUMMARY:Réservé\r\nEND:VEVENT\r\nBEGIN:VEVENT\r\nDTSTART:20261201T150000Z\r\nDTEND:20261205T100000Z\r\nEND:VEVENT\r\nBEGIN:VEVENT\r\nDTSTART;VALUE=DATE:20261220\r\nSTATUS:CANCELLED\r\nEND:VEVENT\r\nBEGIN:VEVENT\r\nDTSTART;VALUE=DATE:2026\r\n 1224\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n';
    assert.deepEqual(S.lireIcs(ics), [{ du: '2026-11-14', au: '2026-11-16' }, { du: '2026-12-01', au: '2026-12-05' }, { du: '2026-12-24', au: '2026-12-25' }], 'dates seules et dates-heures, annulé écarté, ligne repliée, sans fin = une nuit');
    assert.equal(S.dateSejour('2026-11-01'), 'dimanche 1er novembre');
    assert.equal(S.libelleSejour('2026-11-10', '2026-11-14'), 'du mardi 10 au samedi 14 novembre, 4 nuits');
    assert.equal(S.libelleSejour('2026-10-31', '2026-11-01'), 'du samedi 31 octobre au dimanche 1er novembre, 1 nuit');
    assert.equal(S.nuitsLibres(occ, '2026-11-10', '2026-11-20'), 8);
    assert.equal(S.calendrierConnu(undefined, false), false);
    assert.equal(S.calendrierConnu({ occupe: [], ics: 'https://x' }, false), false, 'iCal illisible = calendrier inconnu');
    assert.equal(S.calendrierConnu({ occupe: [], ics: 'https://x' }, true), true);
    assert.deepEqual(S.lienDisponibilites({ occupe: [{}] }, 'Les dates libres'), { href: '/disponibilites', label: 'Les dates libres' });
    assert.equal(S.lienDisponibilites({ occupe: [] }, 'x'), null);
    assert.equal(S.JOURS_COURTS[0].long, 'lundi');
    assert.doesNotMatch(read('src/lib/sejour.ts'), /^import /m, 'module pur');
  });

  test('parcours (module pur) : barreaux complets, voisins, « dès … », liens de nav, avis rangés par barreau', async () => {
    const P = await loadParcoursModule();
    const ech = [
      { slug: 'decouvrir', niveau: 'Je découvre', titre: 'Initiation', formules: [{ nom: 'a', prix: '65 €' }, { nom: 'b', prix: '120 €' }] },
      { slug: 'apprendre', niveau: 'J’apprends', titre: 'Cours', formules: [{ nom: 'c', prix: '1 290 €' }, { nom: 'd', prix: 'sur devis' }] },
      { slug: 'pratiquer', niveau: 'Je pratique', titre: 'Adhésion', formules: [] },
    ];
    assert.equal(P.barreauxComplets(ech), 2);
    assert.deepEqual(Object.fromEntries(Object.entries(P.voisins(ech, 'apprendre')).map(([k, v]) => [k, v?.slug])), { precedent: 'decouvrir', suivant: 'pratiquer' });
    assert.equal(P.voisins(ech, 'decouvrir').precedent, undefined);
    assert.equal(P.voisins(ech, 'pratiquer').suivant, undefined);
    assert.deepEqual(P.voisins(ech, 'x'), {});
    assert.equal(P.prixDepuis(ech[0].formules), 'dès 65 €');
    assert.equal(P.prixDepuis(ech[1].formules), 'dès 1 290 €', 'les espaces de milliers comptent');
    assert.equal(P.prixDepuis([{ nom: 'x', prix: 'sur devis' }, { nom: 'y' }]), undefined, 'aucun prix lisible, rien de calculé');
    assert.equal(P.prixDepuis([{ nom: 'x', prix: '95 € / mois' }, { nom: 'y', prix: '160 €' }]), 'dès 95 €');
    assert.deepEqual(P.liensParcours(ech), [{ href: '/parcours/decouvrir', label: 'Initiation' }, { href: '/parcours/apprendre', label: 'Cours' }, { href: '/parcours/pratiquer', label: 'Adhésion' }]);
    assert.equal(P.liensParcours([...ech, ...ech]).length, 4, 'au plus quatre');
    assert.deepEqual(P.liensParcours([]), []);
    const avis = [{ t: 1, barreau: 'decouvrir' }, { t: 2 }, { t: 3, barreau: 'inconnu' }, { t: 4, barreau: 'pratiquer' }];
    assert.deepEqual(P.avisDuBarreau(avis, 'decouvrir').map((a) => a.t), [1]);
    assert.deepEqual(P.avisGeneraux(avis, ech).map((a) => a.t), [2, 3], 'un barreau inconnu ne cache pas l’avis');
    assert.doesNotMatch(read('src/lib/parcours.ts'), /^import /m, 'module pur');
  });

  test('actions : sans bookingUrl, Réserver saute à l’outil de l’accueil ; un lien de réservation du client gagne', async () => {
    const { actions } = await loadActionsModule();
    const base = { contact: { phone: '+33600000001' }, layout: { sections: [] }, wording: {} };
    assert.equal(actions(base).some((a) => a.kind === 'booking'), false, 'sans calendrier, pas de porte Réserver');
    const r = actions({ ...base, disponibilites: { occupe: [] } }).find((a) => a.kind === 'booking');
    assert.deepEqual([r.href, r.external], ['/#disponibilites', false]);
    const ext = actions({ ...base, contact: { ...base.contact, bookingUrl: 'https://resa.example/x' }, disponibilites: {} }).find((a) => a.kind === 'booking');
    assert.deepEqual([ext.href, ext.external], ['https://resa.example/x', true]);
  });
}

test('coquille calendrier : h1, métier à ville, tel:, note ; la bande des deux semaines ; l’outil id="disponibilites" ; logements ; tokens', () => {
  const code = codeDe(read('src/shells/calendrier.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\}/);
  assert.match(code, /site\.proof\.google/);
  assert.match(code, /<section id="disponibilites" class="ca-outil/);
  assert.match(code, /<Disponibilites mois=\{2\}/);
  assert.match(code, /\{periodes && \(/, 'pas de bande sans calendrier connu');
  assert.match(code, /\.ca-bande \{ order: -1;/, 'l’outil au-dessus du h1 au téléphone');
  assert.match(code, /<section id="services" class="container-ff ca-logements"/);
  assert.match(code, /donneesManquantes\('outil-calendrier', site\)/);
  assert.doesNotMatch(code, /<Hero\s*\/>/);
  assert.doesNotMatch(code, INTERDITS);
  assert.match(read('scripts/ff/composer.mjs'), /COQUILLES_D_ARCHITECTURE = \[[^\]]*'calendrier', 'parcours'/);
});

test('coquille parcours : h1, métier à ville, tel:, note ; onglets posés par le script au-dessus des barreaux ; avis par barreau ; adresse id="contact" ; tokens', () => {
  const code = codeDe(read('src/shells/parcours.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\}/);
  assert.match(code, /site\.proof\.google/);
  assert.match(code, /<section id="parcours" class="pa-echelle"/);
  assert.match(code, /data-pa-onglets hidden/, 'sans script : pas de rangée, l’échelle entière');
  assert.match(code, /setAttribute\('role', 'tablist'\)/);
  assert.match(code, /setAttribute\('role', 'tabpanel'\)/);
  assert.match(code, /<article id=\{`barreau-\$\{b\.slug\}`\}/, 'un bloc par barreau');
  assert.match(code, /avisDuBarreau\(avis, b\.slug\)/);
  assert.match(code, /\{f\.prix && <span class="pa-prix/, 'pas de prix inventé');
  assert.match(code, /<section id="contact" class="pa-adresse/);
  assert.match(code, /donneesManquantes\('parcours-atelier', site\)/);
  assert.doesNotMatch(code, /<Hero\s*\/>/);
  assert.doesNotMatch(code, INTERDITS);
});

test('outil des disponibilités : calendrier lu au build (liste + iCal), lisible sans script, choix des dates dans le navigateur, demande par le formulaire existant', () => {
  const src = read('src/components/Disponibilites.astro');
  const [front, reste] = src.split(/^---$/m).slice(1);
  const f = codeDe(front);
  assert.match(f, /await periodesIcs\(d\.ics\)/);
  assert.match(f, /calendrierConnu\(d, ics !== null\)/, 'iCal illisible = pas de calendrier');
  assert.match(f, /fusionnerPeriodes\(\[\.\.\.d\.occupe, \.\.\.\(ics \?\? \[\]\)\]\)/);
  assert.doesNotMatch(f, /new Date\(\)/, 'aucun jour choisi au build en dehors de isoDuJour');
  assert.match(reste, /<table class="dc-mois"/);
  assert.match(reste, /<span class="sr-only">, nuit prise<\/span>/, 'la nuit prise est dite, pas seulement barrée');
  assert.match(reste, /<ContactForm compact sejour idPrefix=\{idPrefix\} \/>/);
  assert.match(reste, /<script>[\s\S]*onPage\(/);
  assert.match(reste, /setAttribute\('aria-pressed'/);
  assert.match(reste, /sejourLibre\(periodes, arr, j\)/);
  assert.doesNotMatch(codeDe(src), INTERDITS);
  const ics = read('src/lib/ics-build.ts');
  assert.match(ics, /\^https:/, 'https seulement');
  assert.match(ics, /setTimeout\(\(\) => ctrl\.abort\(\), 8000\)/);
  assert.match(ics, /BEGIN:VCALENDAR/);
  const form = read('src/components/ContactForm.astro');
  assert.match(form, /name="arrivee" type="date"/);
  assert.match(form, /name="depart" type="date"/);
  assert.match(form, /data\.arrivee && `Arrivée : \$\{data\.arrivee\}`/);
});

test('pages /disponibilites et /parcours/<slug> : générées seulement avec leurs données ; JSON-LD ; nav', () => {
  assert.match(read('src/pages/disponibilites/[...index].astro'), /lienDisponibilites\(site\.disponibilites, site\.wording\.disponibilites\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  const p = read('src/pages/parcours/[slug].astro');
  assert.match(p, /site\.parcours\.map\(\(b\) => \(\{ params: \{ slug: b\.slug \}/);
  assert.match(p, /barreauLd\(site, b, pageUrl\)/);
  assert.equal((codeDe(p).match(/<h1[\s>]/g) || []).length, 1);
  assert.doesNotMatch(codeDe(p), INTERDITS);
  const ld = read('src/lib/jsonld.ts');
  assert.match(ld, /export function barreauLd\(/);
  assert.doesNotMatch(ld.slice(ld.indexOf('export function barreauLd')), /aggregateRating/);
  const s = read('src/lib/site.ts');
  assert.match(s, /lienDisponibilites\(s\.disponibilites, s\.wording\.disponibilites\)/);
  assert.match(s, /liensParcours\(s\.parcours \?\? \[\]\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadSejourModule\(\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadParcoursModule\(\)/);
});

test('docs : DIRECTIONS (coquilles calendrier et parcours), INDEX (codées), fiches, CLAUDE.md', () => {
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /^\| `calendrier` \| \*\*Architecture `outil-calendrier`\*\*/m);
  assert.match(d, /^\| `parcours` \| \*\*Architecture `parcours-atelier`\*\*/m);
  const idx = read('docs/veille/architectures/INDEX.md');
  assert.match(idx, /^\| `outil-calendrier` \|.*\| oui, coquille `calendrier`/m);
  assert.match(idx, /^\| \[parcours-atelier\]\(parcours-atelier\.md\) \|.*\| oui \(26 oct\)/m);
  assert.match(idx, /\*\*Faites \(26 oct 2026\)/);
  assert.match(read('docs/veille/architectures/coquelicots.md'), /## Codée dans l'usine \(26 oct 2026\)/);
  assert.match(read('docs/veille/architectures/parcours-atelier.md'), /## Codée dans l'usine \(26 oct 2026\)/);
  assert.ok(fs.existsSync(path.join(ROOT, 'docs/veille/architectures/turning-earth-demontage.md')));
  assert.match(read('CLAUDE.md'), /`disponibilites` \(optionnel, architecture `outil-calendrier`/);
});

test('fumigène : architecture outil-calendrier (FF_LOOK) sur _exemple (sans calendrier) rend l’accueil sans outil ni page /disponibilites', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'outil-calendrier' } }, '_test-archi-calendrier-fum');
  try {
    const html = f.html();
    assert.match(html, /data-shell="calendrier"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000"/);
    assert.doesNotMatch(html, /id="disponibilites"|data-dispo=|href="\/disponibilites"|class="ca-bande-jours/, 'aucun calendrier inventé');
    assert.match(html, /<section id="services" class="container-ff ca-logements/);
    assert.ok(!f.existe('disponibilites.html') && !f.existe('disponibilites'));
  } finally {
    f.rm();
  }
});

test('fumigène : architecture parcours-atelier (FF_LOOK) sur _exemple (sans parcours) rend l’adresse, ni échelle ni page /parcours', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'parcours-atelier' } }, '_test-archi-parcours-fum');
  try {
    const html = f.html();
    assert.match(html, /data-shell="parcours"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /<section id="contact" class="pa-adresse[\s\S]*?href="tel:\+33600000000"/);
    assert.doesNotMatch(html, /id="parcours"|data-pa-onglets|href="\/parcours\//, 'aucun barreau inventé');
    assert.match(html, /id="avis"/, 'les avis du client, sans barreau, restent');
    assert.ok(!f.existe('parcours'));
  } finally {
    f.rm();
  }
});
