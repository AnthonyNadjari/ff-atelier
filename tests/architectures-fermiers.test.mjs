// Architecture du 31 oct 2026 (veille, docs/veille/architectures/INDEX.md) : mur-producteurs (Le Comboire Paysan, Échirolles ;
// Dose Épicerie, Nort-sur-Erdre : le site d'un magasin de producteurs est le mur de ses producteurs, la colonne du magasin collée
// à côté). Registre, mesure de donneesManquantes, schéma, module pur (src/lib/producteurs.ts), coquille (colonne collée, pas
// d'onglets), pages, nav, modèle de navigation « annuaire de fiches » de ff ressemblance, docs, et un fumigène de build sur
// sites/_exemple (sans producteurs : rien d'inventé).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadArchitecturesModule, loadSchemaModule, loadProducteursModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';
import { modeleNavigation, MODELES } from '../scripts/ff/deroule.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const codeDe = (src) => src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const INTERDITS = /#[0-9a-fA-F]{3,8}\b|font-family|rounded-full|999px|uppercase|tracking-|[·—]|italic|eyebrow|text-shadow/;
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'Magasin de producteurs', tagline: 'Z', description: 'D' },
  contact: { phone: '+33612345678', phoneDisplay: '06 12 34 56 78', email: 'a@b.fr', address: { street: '1 rue A', postalCode: '38500', city: 'Voiron' } },
  services: [{ slug: 's', title: 'T', short: 'S' }],
  about: { story: 'S' },
};
const pr = (slug, extra = {}) => ({ slug, nom: slug.toUpperCase(), commune: 'C', ...extra });
const liste = [pr('a', { km: 30, rayon: 'Fromages' }), pr('b', { km: 4, rayon: 'Légumes' }), pr('c', { rayon: 'fromages' }), pr('d', { km: 12.5 }), pr('a', { km: 1 }), { slug: 'e', nom: 'E', commune: ' ' }];

if (!tsImportable) {
  test('[ignoré] node ne sait pas type-stripper le TS ici', (t) => t.skip());
} else {
  test('registre mur-producteurs : coquille producteurs, sources, mesures, pied liens', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, completerLayout } = await loadArchitecturesModule();
    assert.ok(ARCHITECTURE_IDS.includes('mur-producteurs'));
    const a = ARCHITECTURES['mur-producteurs'];
    assert.equal(a.layout.shell, 'producteurs');
    assert.equal(a.layout.footer, 'liens');
    assert.deepEqual(a.layout.sections.map((x) => x.type), ['proof'], 'pas de fin de page d’usine (questions sur /producteurs)');
    assert.deepEqual(a.requis.map((x) => x.mesure), ['producteurs', 'pasUrgence']);
    assert.equal(a.sources[0].site, 'comboirepaysan.fr');
    assert.ok(a.sources.some((x) => x.site === 'dose-epicerie.com'));
    assert.equal(completerLayout({ architecture: 'mur-producteurs' }).shell, 'producteurs');
  });

  test('donneesManquantes : producteurs avec slug, nom et commune, sans doublon ; photos du client', async () => {
    const { donneesManquantes, photosDuClient } = await loadArchitecturesModule();
    assert.deepEqual(donneesManquantes('mur-producteurs', { producteurs: { liste: liste.slice(0, 4) } }), []);
    assert.match(donneesManquantes('mur-producteurs', { producteurs: { liste: [...liste.slice(0, 3), pr('a'), { slug: 'z', nom: 'Z', commune: ' ' }] } }).join(), /4 producteurs.*\(3 aujourd’hui\)/);
    assert.match(donneesManquantes('mur-producteurs', { producteurs: { liste: liste.slice(0, 4) }, contact: { emergency24h: true } }).join(), /urgence/);
    assert.equal(photosDuClient({ producteurs: { liste: [{ photo: {} }, {}] } }), 1);
  });

  test('schema : producteurs (optionnel, décrit), wording, coquille ; rien par défaut', async () => {
    const { defineSite, SHELLS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('producteurs'));
    const vide = defineSite(minimal);
    assert.equal(vide.producteurs, undefined, 'aucun producteur inventé');
    assert.equal(vide.wording.producteurs, 'Nos producteurs');
    const avec = defineSite({ ...minimal, layout: { architecture: 'mur-producteurs' }, producteurs: { liste: [pr('a')] } });
    assert.equal(avec.layout.shell, 'producteurs');
    const p = avec.producteurs.liste[0];
    assert.equal(p.km, undefined, 'aucune distance inventée');
    assert.equal(p.depuis, undefined);
    assert.deepEqual(p.labels, [], 'aucun label supposé');
    assert.deepEqual(p.produits, []);
    assert.throws(() => defineSite({ ...minimal, producteurs: { liste: [pr('a', { km: -3 })] } }), 'distance positive');
    assert.match(read('src/lib/schema.ts'), /Jamais un producteur, une distance, un label ou une année inventés\./);
  });

  test('producteurs (module pur) : complets, par distance, qui fait quoi, distance en mots, plus loin, voisins, lien', async () => {
    const P = await loadProducteursModule();
    assert.deepEqual(P.producteursComplets(liste).map((p) => p.slug), ['a', 'b', 'c', 'd'], 'doublon et commune vide écartés');
    assert.deepEqual(P.parDistance(liste).map((p) => p.slug), ['b', 'd', 'a', 'c'], 'sans distance en dernier');
    assert.deepEqual(P.quiFaitQuoi(liste).map((r) => [r.rayon, r.producteurs.map((p) => p.slug)]), [['Fromages', ['a', 'c']], ['Légumes', ['b']]], 'rayons sans doublon de casse, sans rayon hors index');
    assert.equal(P.distanceLisible(12.5), 'à 12,5 km');
    assert.equal(P.distanceLisible(undefined), '');
    assert.equal(P.plusLoin(liste), 30);
    assert.equal(P.plusLoin([pr('x')]), undefined, 'jamais estimé');
    assert.deepEqual(P.voisins(liste, 'a').map((p) => p.slug), ['c', 'd', 'b'], 'même rayon, puis les plus proches en distance');
    assert.deepEqual(P.lienProducteurs(liste, 'Nos producteurs'), { href: '/producteurs', label: 'Nos producteurs' });
    assert.equal(P.lienProducteurs(liste.slice(0, 3), 'N'), undefined, 'trois producteurs ne font pas une page');
  });
}

test('coquille producteurs : h1, métier, téléphone ; colonne collée à l’ordinateur ; mur en grille ; qui fait quoi ; tokens', () => {
  const code = codeDe(read('src/shells/producteurs.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\} class="pr-tel/);
  assert.match(code, /quiFaitQuoi\(tous\)/);
  assert.match(code, /position: sticky; inset-block-start: 72px/, 'la colonne du magasin collée sous la barre');
  assert.match(code, /block-size: calc\(100vh - 72px\)/);
  assert.match(code, /\.pr-grille \{ grid-template-columns: repeat\(3, minmax\(0, 1fr\)\); \}/);
  assert.ok(code.indexOf('id="hero"') < code.indexOf('id="producteurs"') && code.indexOf('id="producteurs"') < code.indexOf('sections.map(') && code.indexOf('sections.map(') < code.indexOf('id="contact"'), 'colonne, mur, sections, venir');
  assert.doesNotMatch(code, /role="tab"|id="services"|id="faq"/, 'pas d’onglets ni de fin de page d’usine');
  assert.match(code, /<Footer \/>/);
  assert.doesNotMatch(code, INTERDITS);
});

test('pages /producteurs et /producteurs/<slug> : générées seulement avec leurs données ; questions ; nav ; composer', () => {
  assert.match(read('src/pages/producteurs/[...index].astro'), /lienProducteurs\(site\.producteurs\?\.liste, site\.wording\.producteurs\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(read('src/pages/producteurs/[slug].astro'), /producteursComplets\(site\.producteurs\?\.liste\)\.map\(\(x\) => \(\{ params: \{ slug: x\.slug \}/);
  assert.match(read('src/pages/producteurs/[...index].astro'), /site\.faq\.length > 0 && \(/);
  for (const p of ['src/pages/producteurs/[...index].astro', 'src/pages/producteurs/[slug].astro']) assert.doesNotMatch(codeDe(read(p)), INTERDITS, p);
  const s = read('src/lib/site.ts');
  assert.match(s, /lienProducteurs\(s\.producteurs\?\.liste, s\.wording\.producteurs\)/);
  assert.match(s, /s\.layout\.shell === 'producteurs'/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadProducteursModule\(\)/);
  assert.match(read('scripts/ff/composer.mjs'), /'producteurs'[,\]]/);
});

test('ff ressemblance : modèle de navigation « annuaire de fiches »', () => {
  assert.ok(MODELES.includes('annuaire de fiches'));
  assert.equal(modeleNavigation({ annuaire: true, pagesLiees: 3, pagesContenu: 9, ecrans: 5 }), 'annuaire de fiches');
  assert.equal(modeleNavigation({ annuaire: false, pagesLiees: 3, pagesContenu: 9, ecrans: 5 }), 'plusieurs pages');
  assert.equal(modeleNavigation({ nuancier: true, annuaire: true }), 'nuancier', 'les modèles d’avant restent prioritaires');
  const d = read('scripts/ff/deroule.mjs');
  assert.match(d, /rs\.length >= 6 && rs\.some/, 'six fiches au moins, deux sur une rangée');
  assert.match(d, /m\[1\] === 'services'/, 'les pages de services ne font pas un annuaire');
});

test('docs : DIRECTIONS (coquille), INDEX (codée), fiche et captures, CLAUDE.md', () => {
  assert.match(read('docs/DIRECTIONS.md'), /^\| `producteurs` \| \*\*Architecture `mur-producteurs`\*\*/m);
  assert.match(read('docs/veille/architectures/INDEX.md'), /^\| \[mur-producteurs\]\(mur-producteurs\.md\) \|.*\| oui \(31 oct\) \|$/m);
  const t = read('docs/veille/architectures/mur-producteurs.md');
  assert.match(t, /## Codée dans l'usine \(31 oct 2026\)/);
  assert.match(t, /\]\(https:\/\//, 'sources citées en lien');
  for (const c of ['source', 'essai']) assert.ok(fs.existsSync(path.join(ROOT, `docs/veille/architectures/captures/mur-producteurs-${c}.jpg`)), c);
  assert.match(read('CLAUDE.md'), /`producteurs` \(optionnel, architecture `mur-producteurs`/);
});

test('fumigène : architecture mur-producteurs (FF_LOOK) sur _exemple (sans producteurs) rend le h1, l’appel et venir, pas de mur ni de /producteurs', { timeout: 180_000 }, () => {
  const astroJs = path.join(ROOT, 'node_modules', 'astro', 'astro.js');
  const outDir = 'dist/_test-archi-producteurs-fum';
  const res = spawnSync(process.execPath, [astroJs, 'build'], { cwd: ROOT, encoding: 'utf8', timeout: 170_000, env: { ...process.env, SITE: '_exemple', FF_LOOK: JSON.stringify({ layout: { architecture: 'mur-producteurs' } }), FF_OUT: outDir } });
  if (res.status !== 0) console.log(res.stdout, res.stderr);
  assert.equal(res.status, 0, 'le build a echoue');
  const dir = path.join(ROOT, outDir);
  try {
    const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
    assert.match(html, /data-shell="producteurs"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="pr-tel/);
    assert.match(html, /id="contact"/);
    assert.doesNotMatch(html, /id="producteurs"|Qui fait quoi/, 'aucun producteur inventé');
    assert.equal(fs.existsSync(path.join(dir, 'producteurs.html')) || fs.existsSync(path.join(dir, 'producteurs/index.html')), false);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
