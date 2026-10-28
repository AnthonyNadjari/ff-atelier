// Architectures du 28 oct 2026, tour 15 (veille, docs/veille/architectures/INDEX.md) : revendeurs-secteurs (Brasserie des
// Garrigues, Sommières ; Brasserie Bendorf, Strasbourg : le site d'un producteur vendu chez d'autres répond à « où en
// trouver près de chez moi ? ») et profils-patients (Ostéopathes à Lyon Préfecture ; Margot Debayle, Annecy : le site d'un
// cabinet de santé part du patient, « vous consultez pour »).
// Registre, mesures de donneesManquantes, schéma, modules purs (src/lib/revendeurs.ts, src/lib/profils.ts), coquilles,
// pages, nav, docs, et un fumigène de build par architecture sur sites/_exemple (sans revendeurs ni profils : rien d'inventé).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadArchitecturesModule, loadSchemaModule, loadRevendeursModule, loadProfilsModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const codeDe = (src) => src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const INTERDITS = /#[0-9a-fA-F]{3,8}\b|font-family|rounded-full|999px|uppercase|tracking-|[·—]|italic|eyebrow|text-shadow/;
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'Brasserie artisanale', tagline: 'Z', description: 'D' },
  contact: { phone: '+33612345678', phoneDisplay: '06 12 34 56 78', email: 'a@b.fr', address: { street: '1 rue A', postalCode: '30250', city: 'Sommières' } },
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

const rv = (nom, commune, secteur = 'Gard', extra = {}) => ({ nom, commune, secteur, ...extra });
const pr = (slug, motifs = ['Mal de dos'], extra = {}) => ({ slug, nom: `Profil ${slug}`, motifs, ...extra });

if (!tsImportable) {
  test('[ignoré] node ne sait pas type-stripper le TS ici', (t) => t.skip());
} else {
  test('registre revendeurs-secteurs / profils-patients : coquilles revendeurs et profils, sources, mesures', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, completerLayout } = await loadArchitecturesModule();
    for (const id of ['revendeurs-secteurs', 'profils-patients']) assert.ok(ARCHITECTURE_IDS.includes(id), id);
    const r = ARCHITECTURES['revendeurs-secteurs'];
    assert.equal(r.layout.shell, 'revendeurs');
    assert.equal(r.layout.contactDrawer, true);
    assert.deepEqual(r.layout.sections.map((x) => x.type), ['about', 'proof']);
    assert.deepEqual(r.requis.map((x) => x.mesure), ['revendeurs']);
    assert.equal(r.sources[0].site, 'brasseriedesgarrigues.fr');
    assert.ok(r.sources.some((x) => x.site === 'brasserie-bendorf.fr'));
    const p = ARCHITECTURES['profils-patients'];
    assert.equal(p.layout.shell, 'profils');
    assert.deepEqual(p.layout.sections.map((x) => x.type), ['proof', 'faq'], 'avis puis questions, comme à Lyon');
    assert.deepEqual(p.requis.map((x) => x.mesure), ['profils', 'pasUrgence']);
    assert.equal(p.sources[0].site, 'osteopathe-lyon.fr');
    assert.ok(p.sources.some((x) => x.site === 'osteopathe-annecy.fr'));
    assert.equal(completerLayout({ architecture: 'revendeurs-secteurs' }).shell, 'revendeurs');
    assert.equal(completerLayout({ architecture: 'profils-patients', shell: 'flow' }).shell, 'flow', 'un réglage du site gagne');
  });

  test('donneesManquantes : revendeurs avec commune et secteur (sans doublon), profils avec motifs, pas l’urgence', async () => {
    const { donneesManquantes } = await loadArchitecturesModule();
    const six = ['a', 'b', 'c', 'd', 'e', 'f'].map((n) => rv(`Cave ${n}`, 'Nîmes'));
    assert.deepEqual(donneesManquantes('revendeurs-secteurs', { revendeurs: { liste: six } }), []);
    const faux = [rv('A', 'Nîmes'), rv('a ', 'nimes'), rv('B', ''), rv('C', 'Uzès', ' '), rv('D', 'Uzès')];
    assert.match(donneesManquantes('revendeurs-secteurs', { revendeurs: { liste: faux } }).join(), /6 revendeurs.*\(2 aujourd’hui\)/, 'doublon de casse et d’accent, sans commune, sans secteur : ne comptent pas');
    assert.deepEqual(donneesManquantes('profils-patients', { profils: { liste: [pr('a'), pr('b'), pr('c')] } }), []);
    assert.match(donneesManquantes('profils-patients', { profils: { liste: [pr('a'), pr('a'), pr('c', [' '])] } }).join(), /3 profils.*\(1 aujourd’hui\)/);
    assert.match(donneesManquantes('profils-patients', { profils: { liste: [pr('a'), pr('b'), pr('c')] }, contact: { emergency24h: true } }).join(), /urgence/);
  });

  test('schema : revendeurs et profils (optionnels, décrits), wording, coquilles ; rien par défaut', async () => {
    const { defineSite, SHELLS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('revendeurs') && SHELLS.includes('profils'));
    const vide = defineSite(minimal);
    assert.equal(vide.revendeurs, undefined, 'aucun revendeur inventé');
    assert.equal(vide.profils, undefined, 'aucun profil inventé');
    assert.equal(vide.wording.revendeurs, 'Points de vente');
    assert.equal(vide.wording.trouver, 'Où nous trouver\u202f?');
    assert.equal(vide.wording.profils, 'Pour qui\u202f?');
    assert.equal(vide.wording.consulter, 'Vous consultez pour');
    const avec = defineSite({
      ...minimal,
      layout: { architecture: 'revendeurs-secteurs' },
      revendeurs: { liste: [{ nom: 'Cave', commune: 'Nîmes', secteur: 'Gard' }] },
      profils: { liste: [{ slug: 'bebe', nom: 'Nourrisson' }], praticiens: [{ slug: 'e', nom: 'E' }] },
    });
    assert.equal(avec.layout.shell, 'revendeurs');
    assert.equal(avec.revendeurs.liste[0].pression, false, 'jamais « à la pression » d’office');
    assert.equal(avec.revendeurs.liste[0].consigne, false, 'jamais « reprend la consigne » d’office');
    assert.equal(avec.revendeurs.surPlace, undefined);
    assert.deepEqual(avec.profils.liste[0].motifs, [], 'aucun motif inventé');
    assert.equal(avec.profils.prix, undefined, 'aucun prix inventé');
    assert.equal(avec.profils.remboursement, undefined, 'aucun remboursement inventé');
    assert.deepEqual(avec.profils.praticiens[0].specialites, []);
    assert.throws(() => defineSite({ ...minimal, profils: { liste: [{ slug: 'Bébé', nom: 'N' }] } }), 'slug en minuscules');
    assert.throws(() => defineSite({ ...minimal, revendeurs: { liste: [{ nom: 'C', commune: 'N' }] } }), 'secteur obligatoire');
    const schema = read('src/lib/schema.ts');
    assert.match(schema, /Jamais un revendeur, une pression ou une consigne inventés\./);
    assert.match(schema, /Jamais un motif, un prix, une durée, une spécialité ou un remboursement inventés\./);
  });

  test('revendeurs (module pur) : complets, secteurs dans l’ordre, communes de A à Z, genres, phrase, filtre, lien', async () => {
    const R = await loadRevendeursModule();
    const x = { liste: [rv('Cave A', 'Uzès'), rv('Bar B', 'Montpellier', 'Hérault', { type: 'Bar' }), rv('Épicerie C', 'Alès', 'Gard', { type: 'Épicerie' }), rv('Cave D', 'Uzès', 'gard', { type: 'Caviste' }), rv('cave a', 'Uzes'), rv('Bar E', 'Lunel', 'Hérault', { type: 'bar' })] };
    assert.deepEqual(R.revendeursComplets(x).map((r) => r.nom), ['Cave A', 'Bar B', 'Épicerie C', 'Cave D', 'Bar E'], 'doublon nom + commune (casse, accents) écarté');
    const s = R.secteursDe(x);
    assert.deepEqual(s.map((y) => [y.slug, y.nom, y.revendeurs.length]), [['gard', 'Gard', 3], ['herault', 'Hérault', 2]], 'ordre du client, « gard » rejoint « Gard »');
    assert.deepEqual(s[0].communes.map((c) => [c.nom, c.revendeurs.length]), [['Alès', 1], ['Uzès', 2]], 'communes de A à Z');
    assert.equal(R.slugSecteur('Strasbourg et Eurométropole'), 'strasbourg-et-eurometropole');
    assert.deepEqual(R.typesDe(x), ['Bar', 'Épicerie', 'Caviste'], 'sans doublon de casse');
    assert.equal(R.phraseSecteur(s[0]), '3 adresses dans 2 communes');
    assert.equal(R.phraseSecteur({ revendeurs: [1], communes: [1] }), '1 adresse dans 1 commune');
    assert.deepEqual(R.pourType(s[1].revendeurs, 'BAR').map((r) => r.nom), ['Bar B', 'Bar E']);
    assert.equal(R.pourType(s[1].revendeurs, '').length, 2, 'aucun genre = tous');
    assert.equal(R.lienRevendeurs(x, 'Points de vente'), undefined, '5 revendeurs ne font pas une page');
    assert.deepEqual(R.lienRevendeurs({ liste: [...x.liste, rv('F', 'Nîmes')] }, 'Points de vente'), { href: '/ou-trouver', label: 'Points de vente' });
  });

  test('profils (module pur) : complets, praticiens, praticiens d’un profil, résumé, lien', async () => {
    const P = await loadProfilsModule();
    const x = {
      liste: [pr('bebe', ['Coliques'], { praticiens: ['e'], duree: '30 min' }), pr('sport', ['Entorse'], { praticiens: ['r', 'inconnu'], prix: '70 €' }), pr('vide', []), pr('bebe')],
      praticiens: [{ slug: 'e', nom: 'Emeline' }, { slug: 'r', nom: 'Rémi' }, { slug: 'e', nom: 'Doublon' }, { slug: 'x', nom: ' ' }],
      duree: '45 min',
      prix: '60 €',
    };
    assert.deepEqual(P.profilsComplets(x).map((p) => p.slug), ['bebe', 'sport']);
    assert.deepEqual(P.praticiensComplets(x).map((p) => p.nom), ['Emeline', 'Rémi']);
    assert.deepEqual(P.praticiensDe(x.liste[1], x).map((p) => p.slug), ['r'], 'un slug inconnu ne fait pas un nom');
    assert.equal(P.resumeProfil(x.liste[0], x), '30 min, 60 €', 'durée du profil, prix du cabinet');
    assert.equal(P.resumeProfil(x.liste[1], x), '45 min, 70 €');
    assert.equal(P.resumeProfil(pr('z'), {}), '', 'rien deviné');
    assert.deepEqual(P.lienProfils(x, 'Pour qui ?'), { href: '/consulter', label: 'Pour qui ?' });
    assert.equal(P.lienProfils({ liste: [pr('a')] }, 'P'), undefined, 'un profil ne fait pas une page');
  });
}

test('coquille revendeurs : h1, tel:, note ; secteurs en onglets cachés sans script ; filtre par genre ; sur place et pros dans le bloc ; gamme ; tokens', () => {
  const code = codeDe(read('src/shells/revendeurs.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\} class="rv-tel/);
  assert.match(code, /role="tablist" aria-label="Votre secteur" data-rv-onglets hidden/, 'les onglets n’apparaissent qu’avec le script');
  assert.match(code, /data-rv-types hidden/);
  assert.match(code, /aria-pressed="true" data-rv-type="">Tous</);
  assert.match(code, /aria-live="polite"/);
  assert.match(code, /<section id="revendeurs" class="rv-bloc/);
  assert.ok(code.indexOf('id="revendeurs"') < code.indexOf('id="sur-place"') && code.indexOf('id="sur-place"') < code.indexOf('id="contact"') && code.indexOf('id="contact"') < code.indexOf('id="gamme"') && code.indexOf('id="gamme"') < code.indexOf('avant.map('), 'revendeurs, sur place, pros, gamme, histoire');
  assert.match(code, /\{r\.pression && <span class="rv-marque">À la pression<\/span>\}/);
  assert.match(code, /\{r\.consigne && <span class="rv-marque">Reprend la consigne<\/span>\}/);
  assert.match(code, /prefers-reduced-motion/);
  assert.match(code, /onPage\(/);
  assert.match(code, /<Footer \/>/);
  assert.match(code, /sections\.map\(\(\{ Component, type \}, i\) => type !== 'about' && \(/);
  assert.doesNotMatch(code, INTERDITS);
});

test('coquille profils : bande tel: et rendez-vous, h1, métier ; profils en onglets cachés sans script ; séance, praticiens et appel dans le bloc ; venir ; tokens', () => {
  const code = codeDe(read('src/shells/profils.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /<p class="pf-portes pf-bande">\s*<a href=\{tel\(\)\} class="pf-tel/);
  assert.match(code, /site\.contact\.bookingUrl/);
  assert.match(code, /role="tablist" aria-label="Les profils" data-pf-onglets hidden/);
  assert.match(code, /role=\{profils\.length >= 2 \? 'tabpanel' : undefined\}/);
  assert.ok(code.indexOf('id="profils"') < code.indexOf('id="seance"') && code.indexOf('id="seance"') < code.indexOf('id="praticiens"') && code.indexOf('id="praticiens"') < code.indexOf('id="contact"') && code.indexOf('id="contact"') < code.indexOf('id="venir"'), 'profils, séance, praticiens, appel, venir');
  assert.match(code, /praticiensDe\(p, x\)/);
  assert.match(code, /onPage\(/);
  assert.match(code, /<Footer \/>/);
  assert.match(code, /sections\.map\(/);
  assert.doesNotMatch(code, INTERDITS);
});

test('pages /ou-trouver, /ou-trouver/<secteur>, /consulter, /consulter/<slug> : générées seulement avec leurs données ; nav ; proof vide hors nav', () => {
  const oi = read('src/pages/ou-trouver/[...index].astro');
  assert.match(oi, /lienRevendeurs\(site\.revendeurs, site\.wording\.revendeurs\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  const os = read('src/pages/ou-trouver/[slug].astro');
  assert.match(os, /secteurs\.length >= 2 \? secteurs\.map\(\(s\) => \(\{ params: \{ slug: s\.slug \}/, 'une page par secteur dès deux secteurs');
  const ci = read('src/pages/consulter/[...index].astro');
  assert.match(ci, /lienProfils\(site\.profils, site\.wording\.profils\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(ci, /site\.faq\.map/);
  const cs = read('src/pages/consulter/[slug].astro');
  assert.match(cs, /profilsComplets\(site\.profils\)\.map\(\(p\) => \(\{ params: \{ slug: p\.slug \}/);
  assert.match(cs, /faqPageLd\(p\.questions\)/);
  for (const p of ['src/pages/ou-trouver/[...index].astro', 'src/pages/ou-trouver/[slug].astro', 'src/pages/consulter/[...index].astro', 'src/pages/consulter/[slug].astro']) assert.doesNotMatch(codeDe(read(p)), INTERDITS, p);
  const s = read('src/lib/site.ts');
  assert.match(s, /lienRevendeurs\(s\.revendeurs, s\.wording\.revendeurs\)/);
  assert.match(s, /lienProfils\(s\.profils, s\.wording\.profils\)/);
  assert.match(s, /if \(iP !== -1\) links\.splice\(iP, 1\);/, 'une section proof sans preuve n’a pas de lien de nav');
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadRevendeursModule\(\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadProfilsModule\(\)/);
  assert.match(read('scripts/ff/composer.mjs'), /'revendeurs', 'profils'[,\]]/);
});

test('docs : DIRECTIONS (coquilles revendeurs et profils), INDEX (codées), fiches, CLAUDE.md', () => {
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /^\| `revendeurs` \| \*\*Architecture `revendeurs-secteurs`\*\*/m);
  assert.match(d, /^\| `profils` \| \*\*Architecture `profils-patients`\*\*/m);
  const idx = read('docs/veille/architectures/INDEX.md');
  assert.match(idx, /^\| \[revendeurs-secteurs\]\(revendeurs-secteurs\.md\) \|.*\| oui \(28 oct\) \|$/m);
  assert.match(idx, /^\| \[profils-patients\]\(profils-patients\.md\) \|.*\| oui \(28 oct\) \|$/m);
  for (const fiche of ['revendeurs-secteurs', 'profils-patients']) {
    const t = read(`docs/veille/architectures/${fiche}.md`);
    assert.match(t, /## Codée dans l'usine \(28 oct 2026\)/);
    assert.match(t, /\]\(https:\/\//, 'sources citées en lien');
    for (const c of ['source', 'essai']) assert.ok(fs.existsSync(path.join(ROOT, `docs/veille/architectures/${fiche}-${c}.jpg`)), `${fiche}-${c}.jpg`);
  }
  assert.match(read('CLAUDE.md'), /`revendeurs` \(optionnel, architecture `revendeurs-secteurs`/);
  assert.match(read('CLAUDE.md'), /`profils` \(optionnel, architecture `profils-patients`/);
});

test('fumigène : architecture revendeurs-secteurs (FF_LOOK) sur _exemple (sans revendeurs) rend l’en-tête et l’appel, pas de liste ni de /ou-trouver', { timeout: 180_000 }, () => {
  const fx = fumigene({ layout: { architecture: 'revendeurs-secteurs' } }, '_test-archi-revendeurs-fum');
  try {
    const html = fx.html();
    assert.match(html, /data-shell="revendeurs"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="rv-tel/);
    assert.doesNotMatch(html, /data-rv-onglets|data-rv-panneau|À la pression/, 'aucun revendeur inventé');
    assert.match(html, /id="contact"/);
    assert.match(html, /id="sur-place"/);
    assert.equal(fx.existe('ou-trouver.html') || fx.existe('ou-trouver/index.html'), false);
  } finally {
    fx.rm();
  }
});

test('fumigène : architecture profils-patients (FF_LOOK) sur _exemple (sans profils) rend la bande, le h1 et l’appel, pas d’onglets ni de /consulter', { timeout: 180_000 }, () => {
  const fx = fumigene({ layout: { architecture: 'profils-patients' } }, '_test-archi-profils-fum');
  try {
    const html = fx.html();
    assert.match(html, /data-shell="profils"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="pf-tel/);
    assert.doesNotMatch(html, /data-pf-onglets|data-pf-panneau|On vient pour/, 'aucun profil inventé');
    assert.match(html, /id="contact"/);
    assert.match(html, /id="venir"/);
    assert.equal(fx.existe('consulter.html') || fx.existe('consulter/index.html'), false);
  } finally {
    fx.rm();
  }
});
