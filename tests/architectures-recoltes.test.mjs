// Architectures du 30 oct 2026, tour 19 (veille, docs/veille/architectures/INDEX.md) : calendrier-recoltes (Cueillette de
// Compans ; Le Jardin de l'Avenir, Angers : le site d'une ferme est son année, « en ce moment » et le calendrier des récoltes)
// et nuancier-matieres (Menuiserie Pipault, Yonne ; Boud'bOis : le site d'un artisan d'une matière se choisit par la matière,
// le mur d'échantillons et l'échelle du client). Deux mécanismes qui ne sont PAS des onglets : l'année en tableau de douze
// mois, et le nuancier avec son échelle en barres. Registre, mesures de donneesManquantes, schéma, modules purs
// (src/lib/recoltes.ts, src/lib/matieres.ts), coquilles, pages, nav, modèles de navigation de ff ressemblance (calendrier
// annuel, nuancier), docs, et un fumigène de build par architecture sur sites/_exemple (sans récoltes ni matières : rien
// d'inventé).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadArchitecturesModule, loadSchemaModule, loadRecoltesModule, loadMatieresModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';
import { modeleNavigation, MODELES } from '../scripts/ff/deroule.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const codeDe = (src) => src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const INTERDITS = /#[0-9a-fA-F]{3,8}\b|font-family|rounded-full|999px|uppercase|tracking-|[·—]|italic|eyebrow|text-shadow/;
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'Maraîcher', tagline: 'Z', description: 'D' },
  contact: { phone: '+33612345678', phoneDisplay: '06 12 34 56 78', email: 'a@b.fr', address: { street: '1 rue A', postalCode: '45000', city: 'Orléans' } },
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

const pr = (slug, mois, famille = 'Légumes', nom = slug) => ({ slug, nom, famille, mois });
const six = [pr('a', [6, 7]), pr('b', [7, 8]), pr('c', [9]), pr('d', [10, 11], 'Fruits'), pr('e', [5], 'Fleurs'), pr('f', [1, 12])];
const mat = (slug, extra = {}) => ({ slug, nom: slug.toUpperCase(), ...extra });

if (!tsImportable) {
  test('[ignoré] node ne sait pas type-stripper le TS ici', (t) => t.skip());
} else {
  test('registre calendrier-recoltes / nuancier-matieres : coquilles recoltes et matieres, sources, mesures, pied liens', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, completerLayout } = await loadArchitecturesModule();
    for (const id of ['calendrier-recoltes', 'nuancier-matieres']) assert.ok(ARCHITECTURE_IDS.includes(id), id);
    const r = ARCHITECTURES['calendrier-recoltes'];
    assert.equal(r.layout.shell, 'recoltes');
    assert.equal(r.layout.footer, 'liens');
    assert.deepEqual(r.layout.sections.map((x) => x.type), ['proof'], 'pas de fin de page d’usine (questions sur /calendrier)');
    assert.deepEqual(r.requis.map((x) => x.mesure), ['recoltes', 'pasUrgence']);
    assert.equal(r.sources[0].site, 'cueillettedecompans.fr');
    assert.ok(r.sources.some((x) => x.site === 'jardindelavenir.fr'));
    const m = ARCHITECTURES['nuancier-matieres'];
    assert.equal(m.layout.shell, 'matieres');
    assert.deepEqual(m.layout.sections.map((x) => x.type), ['proof']);
    assert.deepEqual(m.requis.map((x) => x.mesure), ['matieres']);
    assert.equal(m.sources[0].site, 'menuiserie-pipault-89.com');
    assert.ok(m.sources.some((x) => x.site === 'boudbois.fr'));
    assert.equal(completerLayout({ architecture: 'nuancier-matieres' }).shell, 'matieres');
    assert.equal(completerLayout({ architecture: 'calendrier-recoltes', shell: 'flow' }).shell, 'flow', 'un réglage du site gagne');
  });

  test('donneesManquantes : produits avec un mois valide (sans doublon), matières avec photo ; photos du client', async () => {
    const { donneesManquantes, photosDuClient } = await loadArchitecturesModule();
    assert.deepEqual(donneesManquantes('calendrier-recoltes', { recoltes: { produits: six } }), []);
    const m = donneesManquantes('calendrier-recoltes', { recoltes: { produits: [...six.slice(0, 4), pr('a', [3]), pr('x', [13]), pr('y', []), pr('z', [4], ' ')] } }).join(' | ');
    assert.match(m, /6 produits.*\(4 aujourd’hui\)/, 'un doublon, un mois 13, aucun mois, une famille vide ne comptent pas');
    assert.match(donneesManquantes('calendrier-recoltes', { recoltes: { produits: six }, contact: { emergency24h: true } }).join(), /urgence/);
    const quatre = ['a', 'b', 'c', 'd'].map((s) => mat(s, { photo: {} }));
    assert.deepEqual(donneesManquantes('nuancier-matieres', { matieres: { liste: quatre } }), []);
    assert.match(donneesManquantes('nuancier-matieres', { matieres: { liste: [...quatre.slice(0, 3), mat('e')] } }).join(), /4 matières.*\(3 aujourd’hui\)/, 'une matière sans photo n’a pas de pastille');
    assert.equal(photosDuClient({ recoltes: { produits: [{ photo: {} }, {}] }, matieres: { liste: [{ photo: {} }] } }), 2);
  });

  test('schema : recoltes et matieres (optionnels, décrits), wording, coquilles ; rien par défaut', async () => {
    const { defineSite, SHELLS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('recoltes') && SHELLS.includes('matieres'));
    const vide = defineSite(minimal);
    assert.equal(vide.recoltes, undefined, 'aucune récolte inventée');
    assert.equal(vide.matieres, undefined, 'aucune matière inventée');
    assert.equal(vide.wording.calendrier, 'Calendrier des récoltes');
    assert.equal(vide.wording.matieres, 'Nos matières');
    const avec = defineSite({ ...minimal, layout: { architecture: 'calendrier-recoltes' }, recoltes: { produits: [pr('a', [6])] }, matieres: { liste: [mat('chene')] } });
    assert.equal(avec.layout.shell, 'recoltes');
    assert.equal(avec.recoltes.produits[0].prix, undefined, 'aucun prix inventé');
    assert.equal(avec.recoltes.repondeur, undefined, 'aucun répondeur inventé');
    assert.equal(avec.matieres.liste[0].valeur, undefined, 'aucune valeur inventée');
    assert.deepEqual(avec.matieres.liste[0].caracteristiques, []);
    assert.deepEqual(avec.matieres.liste[0].usages, []);
    assert.throws(() => defineSite({ ...minimal, recoltes: { produits: [pr('a', [13])] } }), 'mois de 1 à 12');
    assert.throws(() => defineSite({ ...minimal, recoltes: { produits: [pr('a', [])] } }), 'au moins un mois');
    const schema = read('src/lib/schema.ts');
    assert.match(schema, /Jamais un produit, un mois de récolte ou un prix inventés\./);
    assert.match(schema, /Jamais une matière, une valeur, une caractéristique ou un prix inventés\./);
  });

  test('recoltes (module pur) : complets, familles, du mois, plages (hiver d’un tenant), période en mots, en même temps, lien', async () => {
    const R = await loadRecoltesModule();
    assert.deepEqual(R.produitsComplets([...six, pr('a', [2]), pr('x', [0, 13])]).map((p) => p.slug), ['a', 'b', 'c', 'd', 'e', 'f']);
    assert.deepEqual(R.produitsComplets([pr('a', [9, 7, 7, 8])])[0].mois, [7, 8, 9], 'mois triés et dédoublonnés');
    assert.deepEqual(R.famillesDe(six), ['Légumes', 'Fruits', 'Fleurs']);
    assert.deepEqual(R.duMois(six, 7).map((g) => [g.famille, g.produits.map((p) => p.slug)]), [['Légumes', ['a', 'b']]]);
    assert.deepEqual(R.duMois(six, 4), []);
    assert.deepEqual(R.plages([1, 2, 11, 12]), [[11, 12, 1, 2]], 'l’hiver d’un seul tenant');
    assert.deepEqual(R.plages([3, 4, 5, 9, 10]), [[3, 4, 5], [9, 10]]);
    assert.equal(R.periodeLisible([6, 7, 8, 9, 10]), 'de juin à octobre');
    assert.equal(R.periodeLisible([5, 9, 10]), 'en mai, puis de septembre à octobre');
    assert.equal(R.periodeLisible([1, 2, 3, 10, 11, 12]), 'd’octobre à mars');
    assert.equal(R.periodeLisible([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), 'toute l’année');
    assert.deepEqual(R.enMemeTemps(six, 'a').map((p) => p.slug), ['b']);
    assert.equal(R.lienCalendrier(six.slice(0, 3), 'C'), undefined, 'trois produits ne font pas une page');
    assert.deepEqual(R.lienCalendrier(six, 'Calendrier'), { href: '/calendrier', label: 'Calendrier' });
  });

  test('matieres (module pur) : complètes, nuancier (photo), échelle (valeur seulement, triée, part), usages, colonnes, voisines, lien', async () => {
    const M = await loadMatieresModule();
    const l = [
      mat('chene', { photo: {}, valeur: 40, usages: ['Parquet', 'Meuble'], caracteristiques: [{ nom: 'Grain', valeur: 'moyen' }, { nom: 'Densité', valeur: '0,71' }] }),
      mat('douglas', { photo: {}, valeur: 16, usages: ['parquet', 'Bardage'], caracteristiques: [{ nom: 'Densite', valeur: '0,53' }] }),
      mat('noyer', { valeur: 35, usages: ['Meuble'], caracteristiques: [{ nom: 'Grain', valeur: 'fin' }, { nom: 'Odeur', valeur: 'douce' }] }),
      mat('if', { photo: {} }),
      mat('chene', { valeur: 99 }),
    ];
    assert.deepEqual(M.matieresCompletes(l).map((m) => m.slug), ['chene', 'douglas', 'noyer', 'if']);
    assert.deepEqual(M.nuancier(l).map((m) => m.slug), ['chene', 'douglas', 'if']);
    const e = M.surEchelle(l);
    assert.deepEqual(e.map((x) => x.matiere.slug), ['douglas', 'noyer', 'chene'], 'l’if sans valeur n’est jamais placé');
    assert.equal(e.at(-1).part, 100);
    assert.equal(e[0].part, 40);
    assert.deepEqual(M.parUsage(l).map((u) => [u.usage, u.matieres.map((m) => m.slug)]), [['Parquet', ['chene', 'douglas']], ['Meuble', ['chene', 'noyer']], ['Bardage', ['douglas']]], 'usages sans doublon de casse');
    assert.deepEqual(M.colonnes(l), ['Grain', 'Densité'], 'les caractéristiques partagées par deux matières, sans accent ni casse');
    assert.equal(M.valeurDe(l[1], 'Densité'), '0,53');
    assert.deepEqual(Object.fromEntries(Object.entries(M.voisinesSurEchelle(l, 'noyer')).map(([k, v]) => [k, v?.slug])), { dessous: 'douglas', dessus: 'chene' });
    assert.deepEqual(M.lienMatieres(l, 'Nos matières'), { href: '/matieres', label: 'Nos matières' });
    assert.equal(M.lienMatieres(l.slice(0, 2), 'N'), undefined);
  });
}

test('coquille recoltes : h1, métier, téléphone ; en ce moment (douze mois dans le HTML, celui du visiteur dans le navigateur) ; calendrier en tableau ; tokens', () => {
  const code = codeDe(read('src/shells/recoltes.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\} class="rc-tel/);
  assert.match(code, /data-rc-mois=\{m\} hidden=\{m !== moisBuild\}/, 'sans script : le mois du build');
  assert.match(code, /timeZone: 'Europe\/Paris'/);
  assert.match(code, /<table class="rc-table">/);
  assert.match(code, /scope="rowgroup"/);
  assert.match(code, /<abbr title=\{MOIS\[m - 1\]\}/);
  assert.match(code, /r\.repondeur\.telephone/);
  assert.ok(code.indexOf('id="hero"') < code.indexOf('id="calendrier"') && code.indexOf('id="calendrier"') < code.indexOf('sections.map(') && code.indexOf('sections.map(') < code.indexOf('id="contact"'), 'héros, calendrier, sections, venir');
  assert.doesNotMatch(code, /role="tab"|id="services"|id="faq"/, 'pas d’onglets ni de fin de page d’usine');
  assert.match(code, /onPage\(/);
  assert.match(code, /<Footer \/>/);
  assert.doesNotMatch(code, INTERDITS);
});

test('coquille matieres : h1, téléphone ; usages en index ; nuancier en photos ; échelle à la vraie valeur ; tokens', () => {
  const code = codeDe(read('src/shells/matieres.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\} class="mt-tel/);
  assert.match(code, /matieresParUsage\(toutes\)/);
  assert.match(code, /nuancierDesMatieres\(toutes\)/);
  assert.match(code, /matieresSurEchelle\(toutes\)/);
  assert.match(code, /style=\{`inline-size: \$\{Math\.max\(part, 3\)\}%`\}/);
  assert.ok(code.indexOf('id="hero"') < code.indexOf('id="nuancier"') && code.indexOf('id="nuancier"') < code.indexOf('id="echelle"') && code.indexOf('id="echelle"') < code.indexOf('sections.map(') && code.indexOf('sections.map(') < code.indexOf('id="contact"'), 'héros, nuancier, échelle, sections, atelier');
  assert.doesNotMatch(code, /role="tab"|id="services"|id="faq"/);
  assert.match(code, /<Footer \/>/);
  assert.doesNotMatch(code, INTERDITS);
});

test('pages /calendrier, /recoltes/<slug>, /matieres, /matieres/<slug> : générées seulement avec leurs données ; questions ; nav', () => {
  assert.match(read('src/pages/calendrier/[...index].astro'), /lienCalendrier\(site\.recoltes\?\.produits, site\.wording\.calendrier\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(read('src/pages/recoltes/[slug].astro'), /produitsRecoltes\(site\.recoltes\?\.produits\)\.map\(\(p\) => \(\{ params: \{ slug: p\.slug \}/);
  assert.match(read('src/pages/matieres/[...index].astro'), /lienMatieres\(site\.matieres\?\.liste, site\.wording\.matieres\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(read('src/pages/matieres/[slug].astro'), /matieresCompletes\(site\.matieres\?\.liste\)\.map\(\(m\) => \(\{ params: \{ slug: m\.slug \}/);
  for (const p of ['src/pages/calendrier/[...index].astro', 'src/pages/matieres/[...index].astro']) assert.match(read(p), /site\.faq\.length > 0 && \(/, `${p} : les questions`);
  for (const p of ['src/pages/calendrier/[...index].astro', 'src/pages/recoltes/[slug].astro', 'src/pages/matieres/[...index].astro', 'src/pages/matieres/[slug].astro']) assert.doesNotMatch(codeDe(read(p)), INTERDITS, p);
  const s = read('src/lib/site.ts');
  assert.match(s, /lienCalendrier\(s\.recoltes\?\.produits, s\.wording\.calendrier\)/);
  assert.match(s, /lienMatieres\(s\.matieres\?\.liste, s\.wording\.matieres\)/);
  assert.match(s, /s\.layout\.shell === 'recoltes' \|\| s\.layout\.shell === 'matieres'/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadRecoltesModule\(\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadMatieresModule\(\)/);
  assert.match(read('scripts/ff/composer.mjs'), /'recoltes', 'matieres'[,\]]/);
});

test('ff ressemblance : modèles de navigation « calendrier annuel » et « nuancier »', () => {
  assert.ok(MODELES.includes('calendrier annuel') && MODELES.includes('nuancier'));
  assert.equal(modeleNavigation({ partCalendrier: 0.3, pagesLiees: 5, pagesContenu: 5, ecrans: 5 }), 'calendrier annuel');
  assert.equal(modeleNavigation({ partCalendrier: 0.1, pagesLiees: 5, pagesContenu: 5, ecrans: 5 }), 'plusieurs pages', 'un petit tableau ne fait pas l’année');
  assert.equal(modeleNavigation({ nuancier: true, pagesLiees: 5, pagesContenu: 5, ecrans: 5 }), 'nuancier');
  assert.equal(modeleNavigation({ plan: true, nuancier: true }), 'plan ou schéma', 'les modèles d’avant restent prioritaires');
  const d = read('scripts/ff/deroule.mjs');
  assert.match(d, /ths\.length >= 12/, 'douze colonnes de mois');
  assert.match(d, /memes\.length >= 4 && rangee >= 2/, 'quatre photos carrées de même taille, deux par rangée');
});

test('docs : DIRECTIONS (coquilles), INDEX (codées), fiches et captures, CLAUDE.md', () => {
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /^\| `recoltes` \| \*\*Architecture `calendrier-recoltes`\*\*/m);
  assert.match(d, /^\| `matieres` \| \*\*Architecture `nuancier-matieres`\*\*/m);
  const idx = read('docs/veille/architectures/INDEX.md');
  assert.match(idx, /^\| \[calendrier-recoltes\]\(calendrier-recoltes\.md\) \|.*\| oui \(30 oct\) \|$/m);
  assert.match(idx, /^\| \[nuancier-matieres\]\(nuancier-matieres\.md\) \|.*\| oui \(30 oct\) \|$/m);
  for (const fiche of ['calendrier-recoltes', 'nuancier-matieres']) {
    const t = read(`docs/veille/architectures/${fiche}.md`);
    assert.match(t, /## Codée dans l'usine \(30 oct 2026\)/);
    assert.match(t, /\]\(https:\/\//, 'sources citées en lien');
    for (const c of ['source', 'essai']) assert.ok(fs.existsSync(path.join(ROOT, `docs/veille/architectures/captures/${fiche}-${c}.jpg`)), `${fiche}-${c}.jpg`);
  }
  assert.match(read('CLAUDE.md'), /`recoltes` \(optionnel, architecture `calendrier-recoltes`/);
  assert.match(read('CLAUDE.md'), /`matieres` \(optionnel,\s+architecture `nuancier-matieres`/);
});

test('fumigène : architecture calendrier-recoltes (FF_LOOK) sur _exemple (sans récoltes) rend le h1, l’appel et venir, pas de calendrier ni de /calendrier', { timeout: 180_000 }, () => {
  const fx = fumigene({ layout: { architecture: 'calendrier-recoltes' } }, '_test-archi-recoltes-fum');
  try {
    const html = fx.html();
    assert.match(html, /data-shell="recoltes"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="rc-tel/);
    assert.match(html, /id="contact"/);
    assert.doesNotMatch(html, /id="calendrier"|data-rc-moment/, 'aucune récolte inventée');
    assert.equal(fx.existe('calendrier.html') || fx.existe('calendrier/index.html'), false);
  } finally {
    fx.rm();
  }
});

test('fumigène : architecture nuancier-matieres (FF_LOOK) sur _exemple (sans matières) rend le h1, le téléphone et l’atelier, pas de nuancier ni de /matieres', { timeout: 180_000 }, () => {
  const fx = fumigene({ layout: { architecture: 'nuancier-matieres' } }, '_test-archi-matieres-fum');
  try {
    const html = fx.html();
    assert.match(html, /data-shell="matieres"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="mt-tel/);
    assert.match(html, /id="contact"/);
    assert.doesNotMatch(html, /id="nuancier"|id="echelle"|id="usages"/, 'aucune matière inventée');
    assert.equal(fx.existe('matieres.html') || fx.existe('matieres/index.html'), false);
  } finally {
    fx.rm();
  }
});
