// Architecture du 31 oct 2026 (veille, docs/veille/architectures/INDEX.md) : tableau-departs (Taxi Annecy ; VTC Rousseau, Les
// Houches : le site d'un taxi est son tableau des départs, collé à côté de la page, et l'heure de prise en charge). Registre,
// mesure de donneesManquantes, schéma, module pur (src/lib/departs.ts), coquille (tableau collé, outil sans formulaire, avis en
// piste, aucune horloge), pages, nav, modèle de navigation « tableau des départs » de ff ressemblance, docs, et un fumigène de
// build sur sites/_exemple (sans trajets : rien d'inventé).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadArchitecturesModule, loadSchemaModule, loadDepartsModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';
import { modeleNavigation, MODELES } from '../scripts/ff/deroule.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const codeDe = (src) => src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const INTERDITS = /#[0-9a-fA-F]{3,8}\b|font-family|rounded-full|999px|uppercase|tracking-|[·—]|italic|eyebrow|text-shadow/;
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'Taxi', tagline: 'Z', description: 'D' },
  contact: { phone: '+33612345678', phoneDisplay: '06 12 34 56 78', email: 'a@b.fr', address: { postalCode: '74000', city: 'Annecy' } },
  services: [{ slug: 's', title: 'T', short: 'S' }],
  about: { story: 'S' },
};
const tr = (slug, minutes, extra = {}) => ({ slug, destination: slug.toUpperCase(), minutes, ...extra });
const trajets = [tr('gva', 40, { type: 'Aéroports', prix: '120 €', avance: 120 }), tr('gare', 10, { type: 'Gares' }), tr('lys', 95, { type: 'aéroports' }), tr('clusaz', 40), tr('gva', 5), tr('x', 0), tr('y', 12.5)];

if (!tsImportable) {
  test('[ignoré] node ne sait pas type-stripper le TS ici', (t) => t.skip());
} else {
  test('registre tableau-departs : coquille departs, sources, mesure, aucune section d’usine', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, completerLayout } = await loadArchitecturesModule();
    assert.ok(ARCHITECTURE_IDS.includes('tableau-departs'));
    const a = ARCHITECTURES['tableau-departs'];
    assert.equal(a.layout.shell, 'departs');
    assert.equal(a.layout.footer, 'liens');
    assert.deepEqual(a.layout.sections, [], 'la coquille rend tableau, outil, avis et demande');
    assert.deepEqual(a.requis.map((x) => x.mesure), ['departs']);
    assert.equal(a.sources[0].site, 'taxi-annecy.fr');
    assert.ok(a.sources.some((x) => x.site === 'taxichamonix.fr'));
    assert.equal(completerLayout({ architecture: 'tableau-departs' }).shell, 'departs');
  });

  test('donneesManquantes : trajets avec slug, destination et durée entière, sans doublon ; photos', async () => {
    const { donneesManquantes, photosDuClient } = await loadArchitecturesModule();
    assert.deepEqual(donneesManquantes('tableau-departs', { departs: { trajets: trajets.slice(0, 4) } }), []);
    assert.match(donneesManquantes('tableau-departs', { departs: { trajets: [...trajets.slice(0, 3), ...trajets.slice(4)] } }).join(), /4 trajets.*\(3 aujourd’hui\)/, 'doublon, durée nulle ou non entière écartés');
    assert.equal(photosDuClient({ departs: { trajets: [{ photo: {} }, {}] } }), 1);
  });

  test('schema : departs (optionnel, décrit), wording, coquille ; rien par défaut', async () => {
    const { defineSite, SHELLS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('departs'));
    const vide = defineSite(minimal);
    assert.equal(vide.departs, undefined, 'aucun trajet inventé');
    assert.equal(vide.wording.trajets, 'Les trajets');
    const avec = defineSite({ ...minimal, layout: { architecture: 'tableau-departs' }, departs: { depuis: 'Annecy', trajets: [tr('a', 30)] } });
    assert.equal(avec.layout.shell, 'departs');
    assert.equal(avec.departs.marge, undefined, 'aucune marge inventée');
    assert.equal(avec.departs.trajets[0].prix, undefined, 'aucun prix inventé');
    assert.equal(avec.departs.trajets[0].avance, undefined);
    assert.throws(() => defineSite({ ...minimal, departs: { depuis: 'A', trajets: [tr('a', 0)] } }), 'durée positive');
    assert.match(read('src/lib/schema.ts'), /Jamais une destination, une distance, une durée ou un prix inventés\./);
  });

  test('departs (module pur) : complets, groupes par genre, durée en mots, prix, prise en charge, autres trajets, lien', async () => {
    const D = await loadDepartsModule();
    assert.deepEqual(D.trajetsComplets(trajets).map((t) => t.slug), ['gva', 'gare', 'lys', 'clusaz']);
    assert.deepEqual(D.groupesParType(trajets).map((g) => [g.type, g.trajets.map((t) => t.slug)]), [['Aéroports', ['gva', 'lys']], ['Gares', ['gare']], ['Autres trajets', ['clusaz']]]);
    assert.equal(D.dureeDuTrajet(40), '40 min');
    assert.equal(D.dureeDuTrajet(100), '1 h 40');
    assert.equal(D.dureeDuTrajet(60), '1 h');
    assert.equal(D.dureeDuTrajet(65), '1 h 05');
    assert.equal(D.avecPrix(trajets), true);
    assert.equal(D.avecPrix([tr('a', 3)]), false);
    assert.deepEqual(D.priseEnCharge('07:00', { minutes: 40, avance: 120 }, 30), { heure: '03:50', veille: false }, 'vol à 7 h, deux heures avant, 40 min de route, 30 min de marge');
    assert.deepEqual(D.priseEnCharge('01:00', { minutes: 40, avance: 120 }, 30), { heure: '21:50', veille: true });
    assert.equal(D.priseEnCharge('07:00', { minutes: 40 }, 30), undefined, 'sans avance, pas d’heure');
    assert.equal(D.priseEnCharge('07:00', { minutes: 40, avance: 120 }, undefined), undefined, 'sans marge, pas d’heure');
    assert.equal(D.priseEnCharge('25:00', { minutes: 40, avance: 120 }, 30), undefined);
    assert.deepEqual(D.autresTrajets(trajets, 'gva').map((t) => t.slug), ['lys', 'gare', 'clusaz'], 'même genre d’abord');
    assert.deepEqual(D.lienTrajets(trajets, 'Les trajets'), { href: '/trajets', label: 'Les trajets' });
    assert.equal(D.lienTrajets(trajets.slice(0, 3), 'T'), undefined);
  });
}

test('coquille departs : h1, téléphone ; tableau collé à droite ; outil sans formulaire ; avis en piste ; aucune horloge ; tokens', () => {
  const code = codeDe(read('src/shells/departs.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\} class="dp-tel/);
  assert.match(code, /<table class="dp-tableau">/);
  assert.match(code, /scope="rowgroup"/);
  assert.match(code, /t\.prix \?\? 'sur devis'/, 'prix absent : sur devis, jamais deviné');
  assert.match(code, /\.dp-page > \.dp-colonne \{ grid-column: 2; grid-row: 1 \/ span 40; position: sticky; inset-block-start: 72px/);
  assert.match(code, /priseEnCharge\(h, t, cfg\.marge\)/);
  assert.match(code, /data-dp-regles/, 'sans script, la règle en mots');
  assert.doesNotMatch(code, /<form class="dp-outil/, 'l’outil n’envoie rien : pas de formulaire');
  assert.match(code, /scroll-snap-type: x mandatory/);
  assert.doesNotMatch(code, /setInterval|toLocaleTimeString/, 'aucune horloge (GOUT § 5)');
  assert.ok(code.indexOf('id="hero"') < code.indexOf('id="departs"') && code.indexOf('id="departs"') < code.indexOf('id="heure"') && code.indexOf('id="heure"') < code.indexOf('id="avis"') && code.indexOf('id="avis"') < code.indexOf('id="contact"'));
  assert.doesNotMatch(code, /role="tab"|id="services"|id="faq"/);
  assert.match(code, /<Footer \/>/);
  assert.doesNotMatch(code, INTERDITS);
});

test('pages /trajets et /trajets/<slug> : générées seulement avec leurs données ; questions ; nav ; composer', () => {
  assert.match(read('src/pages/trajets/[...index].astro'), /lienTrajets\(site\.departs\?\.trajets, site\.wording\.trajets\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(read('src/pages/trajets/[slug].astro'), /trajetsComplets\(site\.departs\?\.trajets\)\.map\(\(t\) => \(\{ params: \{ slug: t\.slug \}/);
  assert.match(read('src/pages/trajets/[...index].astro'), /site\.faq\.length > 0 && \(/);
  for (const p of ['src/pages/trajets/[...index].astro', 'src/pages/trajets/[slug].astro']) assert.doesNotMatch(codeDe(read(p)), INTERDITS, p);
  const s = read('src/lib/site.ts');
  assert.match(s, /lienTrajets\(s\.departs\?\.trajets, s\.wording\.trajets\)/);
  assert.match(s, /s\.layout\.shell === 'departs'/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadDepartsModule\(\)/);
  assert.match(read('scripts/ff/composer.mjs'), /'departs'[,\]]/);
});

test('ff ressemblance : modèle de navigation « tableau des départs »', () => {
  assert.ok(MODELES.includes('tableau des départs'));
  assert.equal(modeleNavigation({ partDeparts: 0.2, annuaire: true, pagesLiees: 3, pagesContenu: 9, ecrans: 5 }), 'tableau des départs', 'avant l’annuaire');
  assert.equal(modeleNavigation({ partDeparts: 0.05, pagesLiees: 3, pagesContenu: 9, ecrans: 5 }), 'plusieurs pages', 'un petit tableau ne fait pas un panneau');
  assert.equal(modeleNavigation({ partCalendrier: 0.3, partDeparts: 0.3 }), 'calendrier annuel', 'les modèles d’avant restent prioritaires');
  assert.match(read('scripts/ff/deroule.mjs'), /startsWith\('destination'\)\) \|\| !tetes\.some\(\(x\) => x\.startsWith\('duree'\)\)/);
});

test('docs : DIRECTIONS (coquille), INDEX (codée), fiche et captures, CLAUDE.md', () => {
  assert.match(read('docs/DIRECTIONS.md'), /^\| `departs` \| \*\*Architecture `tableau-departs`\*\*/m);
  assert.match(read('docs/veille/architectures/INDEX.md'), /^\| \[tableau-departs\]\(tableau-departs\.md\) \|.*\| oui \(31 oct\) \|$/m);
  const t = read('docs/veille/architectures/tableau-departs.md');
  assert.match(t, /## Codée dans l'usine \(31 oct 2026\)/);
  assert.match(t, /\]\(https:\/\//);
  for (const c of ['source', 'essai']) assert.ok(fs.existsSync(path.join(ROOT, `docs/veille/architectures/captures/tableau-departs-${c}.jpg`)), c);
  assert.match(read('CLAUDE.md'), /`departs`\s+\(optionnel, architecture `tableau-departs`/);
});

test('fumigène : architecture tableau-departs (FF_LOOK) sur _exemple (sans trajets) rend le h1, l’appel et la demande, pas de tableau ni de /trajets', { timeout: 180_000 }, () => {
  const astroJs = path.join(ROOT, 'node_modules', 'astro', 'astro.js');
  const outDir = 'dist/_test-archi-departs-fum';
  const res = spawnSync(process.execPath, [astroJs, 'build'], { cwd: ROOT, encoding: 'utf8', timeout: 170_000, env: { ...process.env, SITE: '_exemple', FF_LOOK: JSON.stringify({ layout: { architecture: 'tableau-departs' } }), FF_OUT: outDir } });
  if (res.status !== 0) console.log(res.stdout, res.stderr);
  assert.equal(res.status, 0, 'le build a echoue');
  const dir = path.join(ROOT, outDir);
  try {
    const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
    assert.match(html, /data-shell="departs"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="dp-tel/);
    assert.match(html, /id="contact"/);
    assert.doesNotMatch(html, /id="departs"|id="heure"/, 'aucun trajet inventé');
    assert.equal(fs.existsSync(path.join(dir, 'trajets.html')) || fs.existsSync(path.join(dir, 'trajets/index.html')), false);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
