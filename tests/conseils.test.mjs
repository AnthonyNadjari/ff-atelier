// Rubrique conseils (premier levier du marché, veille du 17 oct 2026, docs/veille/marche/CE-QUI-VEND.md) :
// src/lib/conseils.ts (module pur re-exporté par src/lib/site.ts), schéma site.conseils (défaut []),
// src/pages/conseils/[...index].astro + [slug].astro (générées seulement s'il y a un article), lien
// « Conseils » dans navLinks(), BlogPosting dans src/lib/jsonld.ts. Fumigène : un site jetable copié de
// _exemple avec deux articles, construit dans un dossier isolé puis supprimé.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadConseilsModule, loadSchemaModule, loadJsonLdModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'Menuisier', tagline: 'Z', description: 'D' },
  contact: { phone: '+33600000000', phoneDisplay: '06 00 00 00 00', email: 'a@b.fr', address: { postalCode: '59000', city: 'Lille' } },
  services: [{ slug: 's', title: 'T', short: 'S' }],
  about: { story: 'S' },
};
const article = { slug: 'huiler-le-chene', title: 'Huiler le chêne', date: '2026-03-01', summary: 'Deux couches fines.', body: 'Un.\n\nDeux.' };

if (!tsImportable) {
  test('[ignoré] node ne sait pas type-stripper le TS ici', (t) => t.skip());
} else {
  test('conseilsTries : du plus récent au plus ancien, sans muter l’entrée', async () => {
    const { conseilsTries } = await loadConseilsModule();
    const entree = [{ date: '2026-03-01' }, { date: '2026-10-17' }, { date: '2025-12-31' }];
    assert.deepEqual(conseilsTries(entree).map((c) => c.date), ['2026-10-17', '2026-03-01', '2025-12-31']);
    assert.equal(entree[0].date, '2026-03-01');
  });

  test('dateConseil : « 1er mars 2026 », « 17 octobre 2026 », insécables, texte inconnu rendu tel quel', async () => {
    const { dateConseil } = await loadConseilsModule();
    assert.equal(dateConseil('2026-03-01'), '1er mars 2026');
    assert.equal(dateConseil('2026-10-17'), '17 octobre 2026');
    assert.equal(dateConseil('2026-08-09'), '9 août 2026');
    assert.equal(dateConseil('mars 2026'), 'mars 2026');
  });

  test('lienConseils : un lien /conseils seulement s’il y a un article', async () => {
    const { lienConseils } = await loadConseilsModule();
    assert.equal(lienConseils([], 'Conseils'), null);
    assert.deepEqual(lienConseils([article], 'Le carnet'), { href: '/conseils', label: 'Le carnet' });
  });

  test('schéma : conseils par défaut [] ; date AAAA-MM-JJ et slug en minuscules exigés ; libellé par défaut « Conseils »', async () => {
    const { siteSchema } = await loadSchemaModule();
    const vide = siteSchema.parse(minimal);
    assert.deepEqual(vide.conseils, []);
    assert.equal(vide.wording.conseils, 'Conseils');
    assert.equal(siteSchema.parse({ ...minimal, conseils: [article] }).conseils[0].title, 'Huiler le chêne');
    assert.throws(() => siteSchema.parse({ ...minimal, conseils: [{ ...article, date: '01/03/2026' }] }));
    assert.throws(() => siteSchema.parse({ ...minimal, conseils: [{ ...article, slug: 'Huiler Le Chêne' }] }));
  });

  test('conseilLd : BlogPosting avec date, auteur = l’entreprise, image seulement si fournie', async () => {
    const { siteSchema } = await loadSchemaModule();
    const { conseilLd } = await loadJsonLdModule();
    const s = siteSchema.parse({ ...minimal, conseils: [article] });
    const ld = conseilLd(s, s.conseils[0], 'https://x.fr/conseils/huiler-le-chene');
    assert.equal(ld['@type'], 'BlogPosting');
    assert.equal(ld.datePublished, '2026-03-01');
    assert.equal(ld.author.name, 'X');
    assert.equal('image' in ld, false);
    assert.equal(conseilLd(s, s.conseils[0], 'u', 'https://x.fr/i.webp').image, 'https://x.fr/i.webp');
  });
}

test('sources : module pur, re-export, pages conditionnelles, lien de nav inséré avant Contact', () => {
  assert.doesNotMatch(read('src/lib/conseils.ts'), /^import (?!type )/m, 'module pur : aucun import runtime');
  assert.match(read('src/lib/site.ts'), /export \{ conseilsTries, dateConseil, lienConseils \} from '\.\/conseils'/);
  assert.match(read('src/lib/site.ts'), /lienConseils\(s\.conseils \?\? \[\], s\.wording\.conseils\)/);
  assert.match(read('src/pages/conseils/[...index].astro'), /site\.conseils\.length > 0 \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  const page = read('src/pages/conseils/[slug].astro');
  assert.match(page, /conseilLd\(site, conseil, pageUrl, imageUrl\)/);
  assert.match(page, /<time datetime=\{conseil\.date\}>/);
  assert.doesNotMatch(page, /class="eyebrow/, 'pas de surtitre au-dessus du h1 (docs/GOUT.md § 2)');
  const describe = read('src/lib/schema.ts').match(/conseils: z\s*\n\s*\.array\(conseil\)[\s\S]*?\.describe\(\s*"([^"]+)"/)[1];
  assert.match(describe, /jamais un article rédigé sans elle/);
});

test('fumigène : un site avec deux articles produit /conseils, deux pages, le lien de nav, le sitemap et le BlogPosting', { timeout: 180_000 }, () => {
  const slug = '_test-conseils-tmp';
  const siteDir = path.join(ROOT, 'sites', slug);
  const outDir = 'dist/_test-conseils-tmp';
  fs.rmSync(siteDir, { recursive: true, force: true });
  fs.cpSync(path.join(ROOT, 'sites', '_exemple'), siteDir, { recursive: true });
  try {
    const cfgPath = path.join(siteDir, 'site.config.ts');
    const cfg = fs.readFileSync(cfgPath, 'utf8');
    const ajout = `  conseils: [
    { slug: 'huiler-le-chene', title: 'Huiler le chêne', date: '2026-03-01', summary: 'Deux couches fines.', body: 'Un.\\n\\nDeux.' },
    { slug: 'choisir-son-bois', title: 'Choisir son bois', date: '2026-10-17', summary: 'Ce qui change à l’usage.', body: 'Trois.' },
  ],
  wording: {`;
    assert.match(cfg, /\n  wording: \{/, '_exemple doit garder un bloc wording');
    fs.writeFileSync(cfgPath, cfg.replace(/slug: '_exemple'/, `slug: '${slug}'`).replace(/\n  wording: \{/, `\n${ajout}`));
    const res = spawnSync(process.execPath, [path.join(ROOT, 'node_modules', 'astro', 'astro.js'), 'build'], {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: 170_000,
      env: { ...process.env, SITE: slug, FF_OUT: outDir },
    });
    if (res.status !== 0) {
      console.log(res.stdout);
      console.log(res.stderr);
    }
    assert.equal(res.status, 0, 'le build a echoue (voir la sortie ci-dessus)');
    const out = path.join(ROOT, outDir);
    const liste = fs.readFileSync(path.join(out, 'conseils.html'), 'utf8');
    assert.ok(liste.indexOf('Choisir son bois') < liste.indexOf('Huiler le chêne'), 'le plus récent en premier');
    assert.match(liste, /<time datetime="2026-03-01"[^>]*>1er mars 2026<\/time>/);
    const page = fs.readFileSync(path.join(out, 'conseils', 'huiler-le-chene.html'), 'utf8');
    assert.match(page, /"@type":"BlogPosting"/);
    assert.match(page, /<p>Un\.<\/p>\s*<p>Deux\.<\/p>/);
    assert.match(fs.readFileSync(path.join(out, 'index.html'), 'utf8'), /href="\/conseils"/);
    const sitemap = fs.readFileSync(path.join(out, 'sitemap-0.xml'), 'utf8');
    assert.match(sitemap, /\/conseils<\/loc>/);
    assert.match(sitemap, /\/conseils\/choisir-son-bois<\/loc>/);
  } finally {
    fs.rmSync(siteDir, { recursive: true, force: true });
    fs.rmSync(path.join(ROOT, outDir), { recursive: true, force: true });
  }
});
