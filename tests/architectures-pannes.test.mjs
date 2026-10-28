// Architectures du 28 oct 2026, tour 13 (veille, docs/veille/architectures/INDEX.md) : appareils-pannes (Satisfix et
// Lavoiserie, réparateurs d'électroménager à Lyon : le site part de l'appareil en panne, puis de la panne) et
// commande-retrait (Riedoasis, maraîchage bio près de Strasbourg ; Au temps de la source, Vosges : le site est le rythme
// de la commande et ses points de retrait). Registre, mesures de donneesManquantes, schéma, modules purs
// (src/lib/appareils.ts, src/lib/retrait.ts), coquilles, pages, docs, et un fumigène de build par architecture sur
// sites/_exemple (sans appareils ni points : rien d'inventé).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadArchitecturesModule, loadSchemaModule, loadAppareilsModule, loadRetraitModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const codeDe = (src) => src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const INTERDITS = /#[0-9a-fA-F]{3,8}\b|font-family|rounded-full|999px|uppercase|tracking-|[·—]|italic|eyebrow|text-shadow/;
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'Réparateur', tagline: 'Z', description: 'D' },
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

const ap = (slug, extra = {}) => ({ slug, nom: slug, pannes: [{ nom: `Panne de ${slug}` }], ...extra });
const pt = (slug, jour = 'Jeudi', extra = {}) => ({ slug, nom: `Point ${slug}`, commune: 'Tours', jour, debut: '16:00', fin: '19:00', ...extra });

if (!tsImportable) {
  test('[ignoré] node ne sait pas type-stripper le TS ici', (t) => t.skip());
} else {
  test('registre appareils-pannes / commande-retrait : coquilles appareils et retrait, sources, mesures', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, completerLayout } = await loadArchitecturesModule();
    for (const id of ['appareils-pannes', 'commande-retrait']) assert.ok(ARCHITECTURE_IDS.includes(id), id);
    const a = ARCHITECTURES['appareils-pannes'];
    assert.equal(a.layout.shell, 'appareils');
    assert.equal(a.layout.contactDrawer, true);
    assert.deepEqual(a.layout.sections, [{ type: 'proof', variant: 'testimonials' }], 'les questions sont sur /appareils : le bloc à onglets tient la page');
    assert.deepEqual(a.requis.map((x) => x.mesure), ['appareils']);
    assert.equal(a.sources[0].site, 'satisfix.fr');
    assert.ok(a.sources.some((x) => x.site === 'lavoiserie.fr'));
    const r = ARCHITECTURES['commande-retrait'];
    assert.equal(r.layout.shell, 'retrait');
    assert.deepEqual(r.layout.sections.map((x) => x.type), ['proof', 'about']);
    assert.deepEqual(r.requis.map((x) => x.mesure), ['retraits', 'cloture']);
    assert.equal(r.sources[0].site, 'riedoasis.fr');
    assert.equal(completerLayout({ architecture: 'appareils-pannes' }).shell, 'appareils');
    assert.equal(completerLayout({ architecture: 'commande-retrait', shell: 'flow' }).shell, 'flow', 'un réglage du site gagne');
  });

  test('donneesManquantes : appareils avec panne (slugs uniques), points lisibles, clôture lisible', async () => {
    const { donneesManquantes } = await loadArchitecturesModule();
    assert.deepEqual(donneesManquantes('appareils-pannes', { appareils: { liste: [ap('a'), ap('b'), ap('c')] } }), []);
    const faux = [ap('a'), ap('a'), ap('c', { pannes: [] }), ap('d', { pannes: [{ nom: ' ' }] }), ap('e')];
    assert.match(donneesManquantes('appareils-pannes', { appareils: { liste: faux } }).join(), /3 appareils.*\(2 aujourd’hui\)/, 'doublon, sans panne : ne comptent pas');
    const ok = { retrait: { cloture: { jour: 'Mardi', heure: '12:00' }, points: [pt('a'), pt('b', 'vendredi')] } };
    assert.deepEqual(donneesManquantes('commande-retrait', ok), []);
    const sans = { retrait: { points: [pt('a'), pt('a'), pt('c', 'Jeudi soir'), pt('d', 'Jeudi', { fin: '19h' })] } };
    const m = donneesManquantes('commande-retrait', sans).join();
    assert.match(m, /2 points.*\(1 aujourd’hui\)/, 'doublon, jour ou heure illisibles : ne comptent pas');
    assert.match(m, /clôture/);
  });

  test('schema : appareils et retrait (optionnels, décrits), wording, coquilles ; rien par défaut', async () => {
    const { defineSite, SHELLS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('appareils') && SHELLS.includes('retrait'));
    const vide = defineSite(minimal);
    assert.equal(vide.appareils, undefined, 'aucun appareil inventé');
    assert.equal(vide.retrait, undefined, 'aucun point inventé');
    assert.equal(vide.wording.appareils, 'Les appareils');
    assert.equal(vide.wording.panne, 'Quel appareil est en panne ?');
    assert.equal(vide.wording.retrait, 'Points de retrait');
    const avec = defineSite({
      ...minimal,
      layout: { architecture: 'appareils-pannes' },
      appareils: { liste: [{ slug: 'lave-linge', nom: 'Lave-linge' }] },
      retrait: { points: [{ slug: 'a', nom: 'A', commune: 'Tours', jour: 'Jeudi', debut: '16:00', fin: '19:00' }] },
    });
    assert.equal(avec.layout.shell, 'appareils');
    assert.deepEqual(avec.appareils.liste[0].pannes, [], 'aucune panne inventée');
    assert.deepEqual(avec.appareils.marques, []);
    assert.equal(avec.appareils.forfait, undefined, 'aucun forfait inventé');
    assert.equal(avec.appareils.garantie, undefined, 'aucune garantie inventée');
    assert.equal(avec.retrait.points[0].vente, false, 'jamais de vente sur place d’office');
    assert.equal(avec.retrait.cloture, undefined, 'aucune clôture inventée');
    assert.throws(() => defineSite({ ...minimal, retrait: { points: [{ slug: 'a', nom: 'A', commune: 'T', jour: 'Jeudi', debut: '16h', fin: '19:00' }] } }), 'heure en HH:MM');
    assert.throws(() => defineSite({ ...minimal, retrait: { cloture: { jour: 'mardi midi', heure: '12:00' } } }), 'jour de la semaine');
    assert.throws(() => defineSite({ ...minimal, appareils: { liste: [{ slug: 'Lave linge', nom: 'X' }] } }), 'slug');
    const schema = read('src/lib/schema.ts');
    assert.match(schema, /Jamais une panne, une marque, un prix ou une garantie inventés\./);
    assert.match(schema, /Jamais une heure, un point ou une vente sur place inventés\./);
  });

  test('appareils (module pur) : complets, familles dans l’ordre du client, prix de famille, marques, ancres, lien', async () => {
    const A = await loadAppareilsModule();
    const x = {
      familles: [{ nom: 'Lavage', prix: '69 €' }, { nom: 'Froid', prix: '89 €' }, { nom: 'Vide' }],
      liste: [ap('frigo', { famille: 'Froid' }), ap('lave-linge', { famille: 'Lavage', prix: 'à partir de 59 €', marques: ['Miele'] }), ap('four', { famille: 'Cuisson' }), ap('robot'), ap('x', { pannes: [] })],
      marques: ['Bosch', 'AEG', 'électrolux', 'bosch '],
    };
    assert.deepEqual(A.appareilsComplets(x).map((a) => a.slug), ['frigo', 'lave-linge', 'four', 'robot']);
    const g = A.famillesDe(x);
    assert.deepEqual(g.map((f) => f.nom), ['Lavage', 'Froid', 'Cuisson', 'Autres appareils'], 'familles déclarées, puis lues, puis sans famille ; une famille vide disparaît');
    assert.equal(g[0].prix, '69 €');
    assert.equal(g[2].prix, undefined, 'jamais un prix deviné');
    assert.equal(A.prixDe(x.liste[1], x), 'à partir de 59 €');
    assert.equal(A.prixDe(x.liste[0], x), '89 €');
    assert.equal(A.prixDe(x.liste[3], x), undefined);
    assert.deepEqual(A.marquesDe(x.liste[1], x), ['Miele']);
    assert.deepEqual(A.marquesDe(x.liste[0], x), ['Bosch', 'AEG', 'électrolux', 'bosch']);
    assert.deepEqual(A.toutesLesMarques(x), ['Bosch', 'AEG', 'électrolux', 'Miele'], 'sans doublon (casse et espaces)');
    assert.deepEqual(A.marquesParLettre(['Bosch', 'AEG', 'Électrolux', 'Brandt', '3M']), [{ lettre: '0-9', marques: ['3M'] }, { lettre: 'A', marques: ['AEG'] }, { lettre: 'B', marques: ['Bosch', 'Brandt'] }, { lettre: 'E', marques: ['Électrolux'] }]);
    assert.equal(A.slugPanne('N’essore plus !'), 'n-essore-plus');
    assert.deepEqual(A.lienAppareils(x, 'Les appareils'), { href: '/appareils', label: 'Les appareils' });
    assert.equal(A.lienAppareils({ liste: [ap('a')] }, 'L'), undefined, 'un appareil ne fait pas une page');
  });

  test('retrait (module pur) : jours, heures, points par jour, phrase de la règle, prochaine clôture, libellés, lien', async () => {
    const R = await loadRetraitModule();
    assert.equal(R.indexJour('mardi'), 1);
    assert.equal(R.indexJour('Dimanche'), 6);
    assert.equal(R.indexJour('mardi midi'), undefined);
    assert.equal(R.heureLisible('12:00'), '12 h');
    assert.equal(R.heureLisible('09:30'), '9 h 30');
    const r = { cloture: { jour: 'Mardi', heure: '12:00' }, points: [pt('v', 'Vendredi'), pt('j2', 'Jeudi', { debut: '17:00' }), pt('j1', 'Jeudi', { debut: '15:00' }), pt('s', 'Samedi'), pt('x', 'Jeudi', { debut: '9h' })] };
    assert.deepEqual(R.pointsComplets(r).map((p) => p.slug), ['v', 'j2', 'j1', 's']);
    const jours = R.pointsParJour(r);
    assert.deepEqual(jours.map((d) => d.jour), ['Jeudi', 'Vendredi', 'Samedi']);
    assert.deepEqual(jours[0].points.map((p) => p.slug), ['j1', 'j2'], 'par heure d’ouverture');
    assert.equal(R.phraseDuCycle(r), 'Commandez avant le mardi à 12 h, retirez le jeudi, le vendredi ou le samedi.');
    assert.equal(R.phraseDuCycle({ points: r.points }), undefined, 'sans clôture, pas de règle');
    // Lundi 10 h : clôture demain (mardi), premier retrait jeudi (3 jours).
    const lundi = R.prochainCycle({ jour: 0, minutes: 600 }, r);
    assert.deepEqual(lundi.cloture, { decalage: 1, jour: 1, heure: '12:00' });
    assert.deepEqual(lundi.retraits.map((x) => [x.jour, x.decalage]), [[3, 3], [4, 4], [5, 5]]);
    // Mardi 11 h : clôture aujourd'hui ; mardi 13 h : mardi prochain, premier retrait le jeudi d'après.
    assert.equal(R.prochainCycle({ jour: 1, minutes: 660 }, r).cloture.decalage, 0);
    const tard = R.prochainCycle({ jour: 1, minutes: 780 }, r);
    assert.equal(tard.cloture.decalage, 7);
    assert.equal(tard.retraits[0].decalage, 9);
    // Retrait le jour même de la clôture : il compte pour la semaine suivante.
    assert.equal(R.prochainCycle({ jour: 0, minutes: 0 }, { cloture: { jour: 'Mardi', heure: '12:00' }, points: [pt('m', 'Mardi')] }).retraits[0].decalage, 8);
    assert.equal(R.prochainCycle({ jour: 0, minutes: 0 }, { points: r.points }), undefined);
    assert.equal(R.libelleDecalage(0, 1), 'aujourd’hui');
    assert.equal(R.libelleDecalage(1, 1), 'demain');
    assert.equal(R.libelleDecalage(3, 3), 'jeudi');
    assert.equal(R.libelleDecalage(9, 3), 'jeudi prochain');
    assert.deepEqual(R.lienRetrait(r, 'Points de retrait'), { href: '/retrait', label: 'Points de retrait' });
    assert.equal(R.lienRetrait({ points: [pt('a')] }, 'P'), undefined);
  });
}

test('coquille appareils : h1, métier à ville, tel:, note ; onglets par famille sans script cachés ; pannes vers leur ancre ; marques, étapes, communes et appel dans le bloc ; tokens', () => {
  const code = codeDe(read('src/shells/appareils.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\} class="ap-tel/);
  assert.match(code, /<section id="appareils" class="ap-bloc"/);
  assert.match(code, /role="tablist" aria-label="Familles d’appareils" data-ap-onglets hidden/, 'onglets cachés tant que le script n’a pas tourné');
  assert.match(code, /href=\{`\/appareils\/\$\{x\.slug\}#\$\{slugPanne\(p\.nom\)\}`\}/);
  assert.match(code, /<div id="contact" class="ap-appel">/);
  assert.match(code, /site\.zones\.cities/);
  assert.match(code, /onPage\(/);
  assert.match(code, /<Footer \/>/);
  assert.match(code, /sections\.map\(/);
  assert.doesNotMatch(code, INTERDITS);
});

test('coquille retrait : h1, tel:, note ; la règle sans script, la prochaine clôture dans le navigateur ; façons, histoire, points par jour, appel ; tokens', () => {
  const code = codeDe(read('src/shells/retrait.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\} class="rt-tel/);
  assert.match(code, /<p class="rt-regle font-display">\{phrase\}<\/p>/);
  assert.match(code, /data-rt-prochain hidden/);
  assert.match(code, /prochainCycle\(maintenant\(new Date\(\)\)/);
  assert.ok(code.indexOf('id="semaine"') < code.indexOf('id="acheter"') && code.indexOf('id="acheter"') < code.indexOf('avant.map(') && code.indexOf('avant.map(') < code.indexOf('id="points"'), 'semaine, façons, histoire, points');
  assert.match(code, /role="tablist" aria-label="Jours de retrait" data-rt-onglets hidden/);
  assert.match(code, /\{p\.vente && <p class="rt-vente">/);
  assert.match(code, /<div id="contact" class="container-ff rt-appel">/);
  assert.match(code, /<Footer \/>/);
  assert.match(code, /sections\.map\(\(\{ Component, type \}, i\) => type !== 'about' && \(/, 'l’histoire est rendue plus haut, entre les façons et les points');
  assert.doesNotMatch(code, INTERDITS);
});

test('pages /appareils, /appareils/<slug>, /retrait, /retrait/<slug> : générées seulement avec leurs données ; ancres des pannes ; questions ; nav', () => {
  const ai = read('src/pages/appareils/[...index].astro');
  assert.match(ai, /lienAppareils\(site\.appareils, site\.wording\.appareils\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(ai, /site\.faq\.map/);
  const as = read('src/pages/appareils/[slug].astro');
  assert.match(as, /appareilsComplets\(site\.appareils\)\.map\(\(x\) => \(\{ params: \{ slug: x\.slug \}/);
  assert.match(as, /<li id=\{slugPanne\(p\.nom\)\} class="pa-panne">/);
  assert.match(as, /href=\{tel\(\)\}/);
  const ri = read('src/pages/retrait/[...index].astro');
  assert.match(ri, /lienRetrait\(site\.retrait, site\.wording\.retrait\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(ri, /site\.faq\.map/);
  const rs = read('src/pages/retrait/[slug].astro');
  assert.match(rs, /pointsComplets\(site\.retrait\)\.map\(\(p\) => \(\{ params: \{ slug: p\.slug \}/);
  for (const p of ['src/pages/appareils/[...index].astro', 'src/pages/appareils/[slug].astro', 'src/pages/retrait/[...index].astro', 'src/pages/retrait/[slug].astro']) assert.doesNotMatch(codeDe(read(p)), INTERDITS, p);
  const s = read('src/lib/site.ts');
  assert.match(s, /lienAppareils\(s\.appareils, s\.wording\.appareils\)/);
  assert.match(s, /lienRetrait\(s\.retrait, s\.wording\.retrait\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadAppareilsModule\(\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadRetraitModule\(\)/);
  assert.match(read('scripts/ff/composer.mjs'), /'appareils', 'retrait'[,\]]/);
});

test('docs : DIRECTIONS (coquilles appareils et retrait), INDEX (codées), fiches, CLAUDE.md', () => {
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /^\| `appareils` \| \*\*Architecture `appareils-pannes`\*\*/m);
  assert.match(d, /^\| `retrait` \| \*\*Architecture `commande-retrait`\*\*/m);
  const idx = read('docs/veille/architectures/INDEX.md');
  assert.match(idx, /^\| \[appareils-pannes\]\(appareils-pannes\.md\) \|.*\| oui \(28 oct\) \|$/m);
  assert.match(idx, /^\| \[commande-retrait\]\(commande-retrait\.md\) \|.*\| oui \(28 oct\) \|$/m);
  for (const fiche of ['appareils-pannes', 'commande-retrait']) {
    const t = read(`docs/veille/architectures/${fiche}.md`);
    assert.match(t, /## Codée dans l'usine \(28 oct 2026\)/);
    assert.match(t, /\]\(https:\/\//, 'sources citées en lien');
    assert.ok(fs.existsSync(path.join(ROOT, `docs/veille/architectures/${fiche}-essai.jpg`)), `${fiche}-essai.jpg`);
  }
  assert.match(read('CLAUDE.md'), /`appareils` \(optionnel, architecture `appareils-pannes`/);
});

test('fumigène : architecture appareils-pannes (FF_LOOK) sur _exemple (sans appareils) rend l’en-tête et l’appel, pas de bloc ni de /appareils', { timeout: 180_000 }, () => {
  const fx = fumigene({ layout: { architecture: 'appareils-pannes' } }, '_test-archi-appareils-fum');
  try {
    const html = fx.html();
    assert.match(html, /data-shell="appareils"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="ap-tel/);
    assert.doesNotMatch(html, /id="appareils"|data-ap-onglets/, 'aucun appareil inventé');
    assert.match(html, /<section id="contact"/);
    assert.equal(fx.existe('appareils.html') || fx.existe('appareils/index.html'), false);
  } finally {
    fx.rm();
  }
});

test('fumigène : architecture commande-retrait (FF_LOOK) sur _exemple (sans points) rend l’en-tête et l’appel, pas de règle ni de /retrait', { timeout: 180_000 }, () => {
  const fx = fumigene({ layout: { architecture: 'commande-retrait' } }, '_test-archi-retrait-fum');
  try {
    const html = fx.html();
    assert.match(html, /data-shell="retrait"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="rt-tel/);
    assert.doesNotMatch(html, /id="semaine"|data-rt-onglets|Commandez avant/, 'aucune clôture ni point inventés');
    assert.match(html, /id="contact"/);
    assert.equal(fx.existe('retrait.html') || fx.existe('retrait/index.html'), false);
  } finally {
    fx.rm();
  }
});
