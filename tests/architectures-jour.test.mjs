// Architectures du 24 oct 2026 (veille, docs/veille/architectures/INDEX.md) : ardoise-du-jour (The Cheese Board
// Collective : l'accueil est l'ardoise d'aujourd'hui, le site se range par jour de la semaine) et tournee-semaine (Pizza
// P'tit Louis, Le Camion à Pizzas : l'accueil dit où est le camion, une page par commune). Registre, mesures de
// donneesManquantes, schéma, modules purs (src/lib/ardoise.ts, src/lib/tournee.ts), coquilles, sections, pages, docs, et
// un fumigène de build par architecture sur sites/_exemple (sans programme ni tournée : rien d'inventé).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadArchitecturesModule, loadSchemaModule, loadArdoiseModule, loadTourneeModule, loadHorairesModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const codeDe = (src) => src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const INTERDITS = /#[0-9a-fA-F]{3,8}\b|font-family|rounded-full|999px|uppercase|tracking-|[·—]|italic|eyebrow|text-shadow/;
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'Boulanger', tagline: 'Z', description: 'D' },
  contact: { phone: '+33612345678', phoneDisplay: '06 12 34 56 78', email: 'a@b.fr', address: { postalCode: '59000', city: 'Lille' } },
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
  test('registre ardoise-du-jour / tournee-semaine : coquilles ardoise et tournee, sections, À propos, tiroir, mesures programme et etapes', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, VARIANTES_D_ARCHITECTURE, completerLayout } = await loadArchitecturesModule();
    for (const id of ['ardoise-du-jour', 'tournee-semaine']) assert.ok(ARCHITECTURE_IDS.includes(id), id);
    const a = ARCHITECTURES['ardoise-du-jour'];
    assert.equal(a.layout.shell, 'ardoise');
    assert.deepEqual(a.layout.sections, [{ type: 'proof', variant: 'testimonials' }], 'les avis sous les ardoises (socle)');
    assert.equal(a.layout.contactDrawer, true);
    assert.equal(a.layout.pageAPropos, true);
    assert.deepEqual(a.requis.map((e) => e.mesure), ['programme', 'horaires', 'rue', 'pasUrgence']);
    assert.equal(a.sources[0].site, 'cheeseboardcollective.coop');
    const t = ARCHITECTURES['tournee-semaine'];
    assert.equal(t.layout.shell, 'tournee');
    assert.deepEqual(t.layout.sections.map((x) => `${x.type}/${x.variant}`), ['zones/tournee', 'services/carte-prix', 'proof/testimonials']);
    assert.deepEqual(t.requis.map((e) => e.mesure), ['etapes', 'pasUrgence']);
    assert.deepEqual(t.sources.map((x) => x.site), ['pizzaptitlouis.fr', 'lecamionapizzas.com']);
    assert.equal(completerLayout({ architecture: 'tournee-semaine' }).shell, 'tournee');
    for (const v of ['services/programme', 'zones/tournee']) assert.ok(VARIANTES_D_ARCHITECTURE.includes(v), v);
  });

  test('donneesManquantes : programme (jours distincts avec lignes), étapes (jour, commune, heures), urgence', async () => {
    const { donneesManquantes } = await loadArchitecturesModule();
    const prog = (jours) => ({ jours, lignes: [{ nom: 'x' }] });
    const base = { contact: { hours: [{ days: 'Mardi', hours: '8 h' }], address: { street: '1 rue A' } } };
    assert.deepEqual(donneesManquantes('ardoise-du-jour', { ...base, services: [{ programme: [prog('Mardi'), prog('Jeudi')] }, { programme: [prog('Samedi')] }] }), []);
    assert.match(donneesManquantes('ardoise-du-jour', { ...base, services: [{ programme: [prog('Mardi'), prog('mardi '), { jours: 'Jeudi', lignes: [] }] }] }).join(), /programme sur 3 jours.*\(1 aujourd’hui\)/, 'un même jour ne compte qu’une fois, une entrée sans ligne ne compte pas');
    assert.match(donneesManquantes('ardoise-du-jour', { services: [{ programme: [prog('a'), prog('b'), prog('c')] }] }).join(), /contact\.hours.*contact\.address\.street/);
    const e = (commune) => ({ jour: 'Mardi', commune, hours: '17 h' });
    assert.deepEqual(donneesManquantes('tournee-semaine', { tournee: [e('A'), e('B'), e('C')] }), []);
    assert.match(donneesManquantes('tournee-semaine', { tournee: [e('A'), e(''), { jour: 'Mardi', commune: 'C' }] }).join(), /3 étapes.*\(1 aujourd’hui\)/);
    assert.match(donneesManquantes('tournee-semaine', { tournee: [e('A'), e('B'), e('C')], contact: { emergency24h: true } }).join(), /urgence/);
  });

  test('schema : services[].programme, tousLesJours, ardoise[], tournee[], wording.tournee et programme, coquilles et variantes', async () => {
    const { defineSite, SHELLS, VARIANTS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('ardoise') && SHELLS.includes('tournee'));
    assert.ok(VARIANTS.services.includes('programme'));
    assert.ok(VARIANTS.zones.includes('tournee'));
    const vide = defineSite(minimal);
    assert.deepEqual(vide.services[0].programme, []);
    assert.deepEqual(vide.services[0].tousLesJours, []);
    assert.deepEqual(vide.ardoise, []);
    assert.deepEqual(vide.tournee, []);
    assert.equal(vide.wording.tournee, 'Où nous trouver');
    assert.equal(vide.wording.programme, 'Le programme');
    const avec = defineSite({
      ...minimal,
      layout: { architecture: 'ardoise-du-jour' },
      services: [{ slug: 's', title: 'T', short: 'S', programme: [{ jours: 'Mardi', lignes: [{ nom: 'Seigle' }] }] }],
      ardoise: [{ date: '2026-12-24', titre: 'Bûche' }],
      tournee: [{ jour: 'Mardi', commune: 'Genlis', hours: '17 h – 21 h' }],
    });
    assert.equal(avec.layout.shell, 'ardoise');
    assert.equal(avec.services[0].programme[0].lignes[0].prix, undefined, 'prix absent = absent');
    assert.equal(avec.ardoise[0].ferme, false);
    assert.deepEqual(avec.ardoise[0].lignes, []);
    assert.equal(avec.tournee[0].phone, undefined, 'téléphone du véhicule absent = repli au rendu');
    assert.throws(() => defineSite({ ...minimal, services: [{ slug: 's', title: 'T', short: 'S', programme: [{ jours: 'Mardi', lignes: [] }] }] }), /programme/, 'une entrée sans ligne est refusée');
    assert.throws(() => defineSite({ ...minimal, tournee: [{ jour: 'Mardi', hours: '17 h' }] }), /tournee/, 'la commune est obligatoire');
    assert.throws(() => defineSite({ ...minimal, ardoise: [{ date: '24/12/2026' }] }), /ardoise/);
    const schema = read('src/lib/schema.ts');
    assert.match(schema, /Jamais un programme invente/);
    assert.match(schema, /Jamais une etape, un repere ou un jour inventes/);
    assert.match(schema, /choisi DANS LE NAVIGATEUR/);
  });

  test('ardoise (module pur) : semaine par jour avec les jours de contact.hours, illisibles à part, jours couverts, exceptions à venir, date longue, lien', async () => {
    const A = await loadArdoiseModule();
    const { joursDe } = await loadHorairesModule();
    const services = [
      { slug: 'pains', title: 'Pains', programme: [{ jours: 'Mardi', lignes: [{ nom: 'Seigle' }] }, { jours: 'Mercredi et samedi', lignes: [{ nom: 'Épeautre' }], note: 'Jusqu’à épuisement' }, { jours: 'Quand il pleut', lignes: [{ nom: 'Pain de pluie' }] }] },
      { slug: 'plat', title: 'Plat', programme: [{ jours: 'Du mardi au jeudi', lignes: [{ nom: 'Quiche' }] }] },
      { slug: 'vide', title: 'Vide' },
    ];
    const { jours, illisibles } = A.programmeDeLaSemaine(services, joursDe);
    assert.equal(jours.length, 7);
    assert.equal(jours[0].jour, 'Lundi');
    assert.deepEqual(jours[0].activites, [], 'lundi : rien, jamais deviné');
    assert.deepEqual(jours[1].activites.map((a) => [a.slug, a.lignes.map((l) => l.nom)]), [['pains', ['Seigle']], ['plat', ['Quiche']]]);
    assert.deepEqual(jours[5].activites[0].notes, ['Jusqu’à épuisement']);
    assert.deepEqual(illisibles.map((x) => x.entree.jours), ['Quand il pleut'], 'des jours illisibles ne sont placés sur aucun jour');
    assert.equal(A.joursCouverts(services, joursDe), 4, 'mardi, mercredi, jeudi, samedi');
    assert.deepEqual(A.avecProgramme(services).map((s) => s.slug), ['pains', 'plat']);
    assert.equal(A.entreesDistinctes(services), 4);
    const ex = [{ date: '2026-12-25' }, { date: '2026-10-01' }, { date: '2026-10-24' }];
    assert.deepEqual(A.exceptionsAVenir(ex, '2026-10-24').map((x) => x.date), ['2026-10-24', '2026-12-25'], 'les dates passées tombent, triées');
    assert.equal(A.dateLongue('2026-10-23'), 'vendredi 23 octobre');
    assert.equal(A.dateLongue('2026-11-01'), 'dimanche 1er novembre');
    assert.deepEqual(A.lienProgramme(services, 'Le programme'), { href: '/programme', label: 'Le programme' });
    assert.equal(A.lienProgramme([{ slug: 'x', title: 'X' }], 'P'), null);
    assert.doesNotMatch(read('src/lib/ardoise.ts'), /^import /m, 'module pur : la lecture des jours est passée en paramètre');
  });

  test('tournee (module pur) : slug de commune, étapes par jour triées, communes, téléphone du véhicule, étape du moment, libellés, lien, étapes complètes', async () => {
    const T = await loadTourneeModule();
    const { joursDe } = await loadHorairesModule();
    assert.equal(T.slugCommune('Fontaines-lès-Dijon'), 'fontaines-les-dijon');
    assert.equal(T.slugCommune('Saint-Étienne du Bois'), 'saint-etienne-du-bois');
    const tournee = [
      { jour: 'Mardi', commune: 'Genlis', hours: '17 h', opens: '17:00', closes: '21:00', phone: '+33611111111', phoneDisplay: '06 11 11 11 11' },
      { jour: 'Mardi', moment: 'Midi', commune: 'Bressey', hours: '11 h', opens: '11:00', closes: '13:30' },
      { jour: 'Samedi et dimanche', commune: 'genlis', hours: '17 h', closes: '21:00' },
      { jour: 'Les jours de marché', commune: 'Auxonne', hours: '8 h' },
    ];
    const { jours, illisibles } = T.etapesParJour(tournee, joursDe);
    assert.deepEqual(jours[1].etapes.map((e) => e.commune), ['Bressey', 'Genlis'], 'triées par heure d’arrivée');
    assert.deepEqual(jours[6].etapes.map((e) => e.commune), ['genlis']);
    assert.deepEqual(illisibles.map((e) => e.commune), ['Auxonne']);
    const c = T.communesDe(tournee, joursDe);
    assert.deepEqual(c.map((x) => [x.slug, x.jours, x.etapes.length]), [['genlis', [1, 5, 6], 2], ['bressey', [1], 1], ['auxonne', [], 1]]);
    const contact = { phone: '+33600000001', phoneDisplay: '06 00 00 00 01' };
    assert.deepEqual(T.telDeLEtape(tournee[0], contact), { href: 'tel:+33611111111', affiche: '06 11 11 11 11', propre: true });
    assert.equal(T.telDeLEtape(tournee[1], contact).href, 'tel:+33600000001', 'jamais un numéro deviné');
    // Mardi (1) : à 12 h l'étape du jour ; à 22 h, tout est fini : samedi (5), dans 4 jours ; dimanche après 21 h : mardi.
    assert.deepEqual(T.etapeDuMoment(jours, 1, 12 * 60), { index: 1, decalage: 0 });
    assert.deepEqual(T.etapeDuMoment(jours, 1, 22 * 60), { index: 5, decalage: 4 });
    assert.deepEqual(T.etapeDuMoment(jours, 6, 22 * 60), { index: 1, decalage: 2 });
    assert.deepEqual(T.etapeDuMoment(jours, 4, 0), { index: 5, decalage: 1 });
    assert.equal(T.etapeDuMoment(T.etapesParJour([], joursDe).jours, 1, 0), undefined);
    const seul = T.etapesParJour([{ jour: 'Mardi', commune: 'A', hours: '8 h', closes: '09:00' }], joursDe).jours;
    assert.deepEqual(T.etapeDuMoment(seul, 1, 600), { index: 1, decalage: 7 }, 'la seule étape de la semaine est passée : la semaine prochaine');
    assert.equal(T.libelleDuMoment(0, 1), 'Aujourd’hui');
    assert.equal(T.libelleDuMoment(1, 2), 'Demain');
    assert.equal(T.libelleDuMoment(3, 5), 'Samedi');
    assert.deepEqual(T.lienTournee(tournee, 'Où nous trouver'), { href: '/tournee', label: 'Où nous trouver' });
    assert.equal(T.lienTournee([], 'x'), null);
    assert.equal(T.etapesCompletes([...tournee, { jour: 'Lundi', commune: '', hours: '8 h' }]), 4);
    assert.doesNotMatch(read('src/lib/tournee.ts'), /^import /m, 'module pur');
  });
}

test('coquille ardoise : h1, métier à ville, tel:, note ; ardoises (horaires id="contact", programme du jour, rendez-vous), annonces, repli, tokens', () => {
  const code = codeDe(read('src/shells/ardoise.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\}/);
  assert.match(code, /site\.proof\.google/);
  assert.match(code, /<section id="contact" class="ar-tableau/, 'sans section contact, /#contact a une cible sans script');
  assert.match(code, /<HorairesDuJour/);
  assert.match(code, /<ArdoiseDuJour mode="jour"/);
  assert.match(code, /agendaAVenir\(site\.agenda\)\[0\]/);
  assert.match(code, /conseilsTries\(site\.conseils\)\.slice\(0, 3\)/);
  assert.match(code, /href="\/programme"/);
  assert.match(code, /donneesManquantes\('ardoise-du-jour', site\)/);
  assert.match(code, /<Footer \/>/);
  assert.doesNotMatch(code, /<Hero\s*\/>/);
  assert.doesNotMatch(code, INTERDITS);
});

test('coquille tournee : h1, métier à ville, tel:, note ; étape du moment (id="contact") ; photo ; repli sans tournée ; tokens', () => {
  const code = codeDe(read('src/shells/tournee.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\}/);
  assert.match(code, /site\.proof\.google/);
  assert.match(code, /<section id="contact" class="tr-panneau/);
  assert.match(code, /<EtapeDuJour \/>/);
  assert.match(code, /donneesManquantes\('tournee-semaine', site\)/);
  assert.doesNotMatch(code, /<Hero\s*\/>/);
  assert.doesNotMatch(code, INTERDITS);
  assert.match(read('scripts/ff/composer.mjs'), /COQUILLES_D_ARCHITECTURE = \[[^\]]*'ardoise', 'tournee'/);
});

test('« aujourd’hui » choisi dans le navigateur : la semaine entière rendue au build, maintenant() côté client, jamais au build', () => {
  for (const f of ['src/components/ArdoiseDuJour.astro', 'src/components/EtapeDuJour.astro']) {
    const src = read(f);
    const [front, reste] = src.split(/^---$/m).slice(1);
    assert.doesNotMatch(codeDe(front), /maintenant\(|new Date\(/, `${f} : aucun jour choisi au build`);
    assert.match(reste, /<script>[\s\S]*import \{ maintenant \} from '@\/lib\/horaires';[\s\S]*maintenant\((new Date\(\)|now)\)/, `${f} : le jour vient du navigateur`);
    assert.match(reste, /\.hidden = /, `${f} : les autres jours sont cachés par le script, pas au build`);
    assert.doesNotMatch(codeDe(src), INTERDITS);
  }
  const ard = codeDe(read('src/components/ArdoiseDuJour.astro'));
  assert.match(ard, /programmeDeLaSemaine\(services, joursDe\)/);
  assert.match(ard, /Pas de programme particulier ce jour-là\./, 'un jour sans entrée le dit, sans rien inventer');
  assert.match(ard, /data-ard-date=\{x\.date\}/);
  assert.match(ard, /setAttribute\('aria-current', 'date'\)/, 'mode semaine : le jour courant marqué');
  const ed = codeDe(read('src/components/EtapeDuJour.astro'));
  assert.match(ed, /etapeDuMoment\(jours, jour, minutes\)/);
  assert.match(ed, /telDeLEtape\(e, site\.contact\)/);
  assert.match(ed, /href=\{`\/tournee\/\$\{slugCommune\(e\.commune\)\}`\}/);
});

test('sections services/programme et zones/tournee : lisent site, rien sans donnée, tel: du véhicule, jour courant marqué, tokens ; composer', () => {
  const pg = codeDe(read('src/sections/Services/programme.astro'));
  assert.match(pg, /\{services\.length > 0 && \(/);
  assert.match(pg, /<section id="services"/);
  assert.match(pg, /<ArdoiseDuJour mode="semaine"/);
  const tn = codeDe(read('src/sections/Zones/tournee.astro'));
  assert.match(tn, /\{lignes\.length > 0 && \(/);
  assert.match(tn, /<section id="zones"/);
  assert.match(tn, /telDeLEtape\(e, site\.contact\)/);
  assert.match(tn, /setAttribute\('aria-current', 'date'\)/);
  for (const c of [pg, tn]) assert.doesNotMatch(c, INTERDITS);
  const comp = read('scripts/ff/composer.mjs');
  assert.match(comp, /case 'services\/programme':/);
  assert.match(comp, /case 'zones\/tournee':/);
});

test('pages /programme, /tournee, /tournee/<commune> : générées seulement avec leurs données ; JSON-LD par commune ; programme sur la page d’activité ; nav', () => {
  assert.match(read('src/pages/programme/[...index].astro'), /avecProgramme\(site\.services\)\.length > 0 \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(read('src/pages/tournee/[...index].astro'), /site\.tournee\.length > 0 \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  const c = read('src/pages/tournee/[commune].astro');
  assert.match(c, /communesDe\(site\.tournee, joursDe\)\.map\(\(c\) => \(\{ params: \{ commune: c\.slug \}/);
  assert.match(c, /tourneeLd\(site, c\.commune, c\.etapes, pageUrl, \{ tel: telTest \}\)/);
  assert.match(c, /<h1 class="text-display-lg">\{metier\} à \{c\.commune\}<\/h1>/, 'h1 « métier à commune » (référencement local)');
  const ld = read('src/lib/jsonld.ts');
  assert.match(ld, /export function tourneeLd\(/);
  assert.match(ld, /\.\.\.\(!test\.tel \? \{ telephone: tel \} : \{\}\)/, 'jamais un téléphone de test envoyé');
  assert.doesNotMatch(ld.slice(ld.indexOf('export function tourneeLd')), /aggregateRating/);
  assert.match(read('src/pages/services/[slug].astro'), /service\.programme\.length > 0 && <section/);
  const s = read('src/lib/site.ts');
  assert.match(s, /lienTournee\(s\.tournee \?\? \[\], s\.wording\.tournee\)/);
  assert.match(s, /lienProgramme\(s\.services, s\.wording\.programme\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadArdoiseModule\(\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadTourneeModule\(\)/);
});

test('docs : DIRECTIONS (coquilles ardoise et tournee, services/programme, zones/tournee), INDEX (codée), fiches, CLAUDE.md', () => {
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /^\| `ardoise` \| \*\*Architecture `ardoise-du-jour`\*\*/m);
  assert.match(d, /^\| `tournee` \| \*\*Architecture `tournee-semaine`\*\*/m);
  assert.match(d, /^\| `programme` \| \*\*Le programme de la semaine\*\*/m);
  assert.match(d, /^\| `tournee` \| \*\*La semaine de tournée\*\*/m);
  const idx = read('docs/veille/architectures/INDEX.md');
  assert.match(idx, /^\| \[ardoise-du-jour\]\(ardoise-du-jour\.md\) \|.*\| oui \(24 oct\)/m);
  assert.match(idx, /^\| \[tournee-semaine\]\(tournee-semaine\.md\) \|.*\| oui \(24 oct\)/m);
  for (const f of ['ardoise-du-jour', 'tournee-semaine']) assert.match(read(`docs/veille/architectures/${f}.md`), /## Codée dans l'usine \(24 oct 2026\)/);
  assert.match(read('CLAUDE.md'), /`tournee` \(défaut `\[\]`, architecture/);
});

test('fumigène : architecture ardoise-du-jour (FF_LOOK) sur _exemple (sans programme) rend les horaires, ni programme ni page /programme', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'ardoise-du-jour' } }, '_test-archi-ardoise-fum');
  try {
    const html = f.html();
    assert.match(html, /data-shell="ardoise"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /<section id="contact" class="ar-tableau[\s\S]*?href="tel:\+33600000000"/);
    assert.doesNotMatch(html, /data-ardoise=|id="programme"|href="\/programme"/, 'aucun programme inventé');
    assert.ok(!f.existe('programme.html') && !f.existe('programme/index.html'));
    assert.ok(f.existe('services/cuisines.html'));
    assert.ok(f.existe('a-propos.html') || f.existe('a-propos/index.html'));
  } finally {
    f.rm();
  }
});

test('fumigène : architecture tournee-semaine (FF_LOOK) sur _exemple (sans tournée) rend le numéro seul, ni étape ni page /tournee', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'tournee-semaine' } }, '_test-archi-tournee-fum');
  try {
    const html = f.html();
    assert.match(html, /data-shell="tournee"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /<section id="contact" class="tr-panneau[\s\S]*?href="tel:\+33600000000"/);
    assert.doesNotMatch(html, /data-etape-du-jour|href="\/tournee/, 'aucune étape inventée');
    assert.ok(!f.existe('tournee.html') && !f.existe('tournee'));
  } finally {
    f.rm();
  }
});
