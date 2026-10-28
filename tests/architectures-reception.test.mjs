// Architectures du 28 oct 2026, tour 14 (veille, docs/veille/architectures/INDEX.md) : salles-capacites (Domaine de la
// Touche, Orne ; Domaine de la Chanterelle, Lille : le site d'un lieu de réception part du nombre d'invités) et
// annonces-biens (Royal Immo, Toulon ; Giboire, Rennes : le site d'une agence immobilière de quartier est sa vitrine).
// Registre, mesures de donneesManquantes, schéma, modules purs (src/lib/salles.ts, src/lib/biens.ts), coquilles, pages,
// docs, et un fumigène de build par architecture sur sites/_exemple (sans salles ni biens : rien d'inventé).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadArchitecturesModule, loadSchemaModule, loadSallesModule, loadBiensModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const codeDe = (src) => src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const INTERDITS = /#[0-9a-fA-F]{3,8}\b|font-family|rounded-full|999px|uppercase|tracking-|[·—]|italic|eyebrow|text-shadow/;
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'Lieu de réception', tagline: 'Z', description: 'D' },
  contact: { phone: '+33612345678', phoneDisplay: '06 12 34 56 78', email: 'a@b.fr', address: { street: '1 rue A', postalCode: '61000', city: 'Alençon' } },
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

const sa = (slug, capacites = { assis: 50 }, extra = {}) => ({ slug, nom: `Salle ${slug}`, capacites, ...extra });
const bi = (slug, projet = 'vente', extra = {}) => ({ slug, titre: `Bien ${slug}`, projet, commune: 'Toulon', prix: 100000, ...extra });

if (!tsImportable) {
  test('[ignoré] node ne sait pas type-stripper le TS ici', (t) => t.skip());
} else {
  test('registre salles-capacites / annonces-biens : coquilles salles et biens, sources, mesures', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, completerLayout } = await loadArchitecturesModule();
    for (const id of ['salles-capacites', 'annonces-biens']) assert.ok(ARCHITECTURE_IDS.includes(id), id);
    const s = ARCHITECTURES['salles-capacites'];
    assert.equal(s.layout.shell, 'salles');
    assert.equal(s.layout.contactDrawer, true);
    assert.deepEqual(s.layout.sections.map((x) => x.type), ['about', 'proof']);
    assert.deepEqual(s.requis.map((x) => x.mesure), ['salles']);
    assert.equal(s.sources[0].site, 'domainedelatouche.fr');
    assert.ok(s.sources.some((x) => x.site === 'domainedelachanterelle.fr'));
    const b = ARCHITECTURES['annonces-biens'];
    assert.equal(b.layout.shell, 'biens');
    assert.deepEqual(b.layout.sections.map((x) => x.type), ['about', 'proof']);
    assert.deepEqual(b.requis.map((x) => x.mesure), ['biens']);
    assert.equal(b.sources[0].site, 'royal-immo.fr');
    assert.equal(completerLayout({ architecture: 'salles-capacites' }).shell, 'salles');
    assert.equal(completerLayout({ architecture: 'annonces-biens', shell: 'flow' }).shell, 'flow', 'un réglage du site gagne');
  });

  test('donneesManquantes : salles avec une capacité (slugs uniques), biens à projet, commune et prix', async () => {
    const { donneesManquantes } = await loadArchitecturesModule();
    assert.deepEqual(donneesManquantes('salles-capacites', { salles: { liste: [sa('a'), sa('b', { cocktail: 80 })] } }), []);
    const faux = [sa('a'), sa('a'), sa('c', {}), sa('d', { assis: 0 })];
    assert.match(donneesManquantes('salles-capacites', { salles: { liste: faux } }).join(), /2 salles.*\(1 aujourd’hui\)/, 'doublon, sans capacité : ne comptent pas');
    assert.deepEqual(donneesManquantes('annonces-biens', { biens: { liste: [bi('a'), bi('b', 'location'), bi('c')] } }), []);
    const mauvais = [bi('a'), bi('a'), bi('c', 'viager'), bi('d', 'vente', { prix: 0 }), bi('e', 'vente', { commune: ' ' })];
    assert.match(donneesManquantes('annonces-biens', { biens: { liste: mauvais } }).join(), /3 biens.*\(1 aujourd’hui\)/);
  });

  test('schema : salles et biens (optionnels, décrits), wording, coquilles ; rien par défaut', async () => {
    const { defineSite, SHELLS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('salles') && SHELLS.includes('biens'));
    const vide = defineSite(minimal);
    assert.equal(vide.salles, undefined, 'aucune salle inventée');
    assert.equal(vide.biens, undefined, 'aucun bien inventé');
    assert.equal(vide.wording.salles, 'Les salles');
    assert.equal(vide.wording.invites, 'Combien serez-vous ?');
    assert.equal(vide.wording.biens, 'Nos biens');
    assert.equal(vide.wording.estimer, 'Faire estimer votre bien');
    const avec = defineSite({
      ...minimal,
      layout: { architecture: 'salles-capacites' },
      salles: { liste: [{ slug: 'grande', nom: 'Grande' }] },
      biens: { liste: [{ slug: 'a', titre: 'A', projet: 'vente', commune: 'Toulon', prix: 1 }] },
    });
    assert.equal(avec.layout.shell, 'salles');
    assert.deepEqual(avec.salles.liste[0].capacites, {}, 'aucune capacité inventée');
    assert.equal(avec.salles.liste[0].exterieur, false);
    assert.equal(avec.salles.couchages, undefined);
    assert.equal(avec.salles.traiteur, undefined, 'jamais « traiteur libre » deviné');
    assert.equal(avec.biens.liste[0].exclusivite, false, 'jamais d’exclusivité d’office');
    assert.equal(avec.biens.liste[0].dpe, undefined, 'aucune classe énergie inventée');
    assert.equal(avec.biens.honoraires, undefined);
    assert.throws(() => defineSite({ ...minimal, biens: { liste: [{ slug: 'a', titre: 'A', projet: 'viager', commune: 'T', prix: 1 }] } }), 'projet vente ou location');
    assert.throws(() => defineSite({ ...minimal, biens: { liste: [{ slug: 'a', titre: 'A', projet: 'vente', commune: 'T', prix: 1, dpe: 'H' }] } }), 'classe A à G');
    assert.throws(() => defineSite({ ...minimal, salles: { liste: [{ slug: 'a', nom: 'A', capacites: { assis: 12.5 } }] } }), 'capacité entière');
    const schema = read('src/lib/schema.ts');
    assert.match(schema, /Jamais une capacité, une surface ou un équipement inventés\./);
    assert.match(schema, /Jamais un prix, une surface, une classe énergie ou une exclusivité inventés\./);
  });

  test('salles (module pur) : complètes, configurations, phrases, salles qui conviennent, lien', async () => {
    const S = await loadSallesModule();
    const x = { liste: [sa('g', { assis: 150, cocktail: 250 }), sa('p', { assis: 50, cocktail: 80 }), sa('grange', { cocktail: 120, theatre: 90 }), sa('vide', {}), sa('g')] };
    assert.deepEqual(S.sallesCompletes(x).map((s) => s.slug), ['g', 'p', 'grange']);
    assert.deepEqual(S.configurationsDe(x).map((c) => c.cle), ['assis', 'cocktail', 'theatre'], 'dans l’ordre fixe, seulement celles données');
    assert.equal(S.capaciteMax(x.liste[0]), 250);
    assert.equal(S.phraseCapacites(x.liste[0]), '150 assis, 250 en cocktail');
    assert.equal(S.phraseCapacites(sa('k', { cocktail: 1200 })), '1 200 en cocktail');
    assert.deepEqual(S.sallesPour(100, 'cocktail', x).map((s) => s.slug), ['g', 'grange']);
    assert.deepEqual(S.sallesPour(60, 'assis', x).map((s) => s.slug), ['g']);
    assert.deepEqual(S.sallesPour(0, 'assis', x), []);
    assert.equal(S.phraseReponse(120, 'assis', x), '1 salle pour 120 personnes assises.');
    assert.equal(S.phraseReponse(100, 'cocktail', x), '2 salles pour 100 personnes en cocktail.');
    assert.equal(S.phraseReponse(400, 'cocktail', x), 'Aucune salle pour 400 personnes en cocktail.');
    assert.deepEqual(S.lienSalles(x, 'Les salles'), { href: '/salles', label: 'Les salles' });
    assert.equal(S.lienSalles({ liste: [sa('a')] }, 'L'), undefined, 'une salle ne fait pas une page');
  });

  test('biens (module pur) : complets, projets, types, prix, résumé, échelle, mentions manquantes, lien', async () => {
    const B = await loadBiensModule();
    const x = { liste: [bi('l1', 'location', { prix: 590 }), bi('v1', 'vente', { type: 'Maison' }), bi('v2', 'vente', { type: 'maison' }), bi('v3', 'vente', { type: 'Garage' }), bi('x', 'viager'), bi('v1')] };
    assert.deepEqual(B.biensComplets(x).map((b) => b.slug), ['l1', 'v1', 'v2', 'v3']);
    assert.deepEqual(B.projetsDe(x).map((p) => [p.titre, p.biens.length]), [['Acheter', 3], ['Louer', 1]], 'Acheter d’abord');
    assert.deepEqual(B.typesDe(B.projetsDe(x)[0].biens), ['Maison', 'Garage'], 'sans doublon de casse');
    assert.equal(B.prixLisible({ prix: 235000, projet: 'vente' }), '235 000 €');
    assert.equal(B.prixLisible({ prix: 590, projet: 'location' }), '590 € par mois');
    assert.equal(B.resume({ surface: 49, pieces: 2, chambres: 1 }), '49 m², 2 pièces, 1 chambre');
    assert.equal(B.resume({}), '');
    const e = B.echelle('D');
    assert.equal(e.length, 7);
    assert.deepEqual(e.filter((l) => l.actif).map((l) => l.lettre), ['D']);
    assert.deepEqual(B.echelle(undefined).filter((l) => l.actif), []);
    assert.deepEqual(B.mentionsManquantes(bi('a')), ['classe énergie (DPE)', 'qui paie les honoraires']);
    assert.deepEqual(B.mentionsManquantes(bi('b', 'location', { dpe: 'C' })), ['surface habitable']);
    assert.deepEqual(B.mentionsManquantes(bi('c', 'vente', { dpe: 'B', honoraires: 'À la charge du vendeur' })), []);
    assert.deepEqual(B.lienBiens(x, 'Nos biens'), { href: '/biens', label: 'Nos biens' });
    assert.equal(B.lienBiens({ liste: [bi('a'), bi('b')] }, 'N'), undefined, 'deux biens ne font pas une page');
  });
}

test('coquille salles : h1, tel:, note, visite ; un bloc : outil sans script lisible, onglets des salles cachés, sur place et appel ; tokens', () => {
  const code = codeDe(read('src/shells/salles.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\} class="sl-tel/);
  assert.match(code, /<section id="salles" class="sl-bloc"/);
  assert.match(code, /<div class="sl-choix" data-sl-choix hidden>/, 'le champ n’apparaît qu’avec le script');
  assert.match(code, /<table class="sl-tableau tabular-nums" data-sl-tableau>/, 'le tableau se lit sans script');
  assert.match(code, /aria-pressed=\{i === 0 \? 'true' : 'false'\} data-sl-conf=/);
  assert.match(code, /role="tablist" aria-label="Les salles" data-sl-onglets hidden/);
  assert.match(code, /aria-live="polite"/);
  assert.match(code, /sallesPour\(n, c, donnees\)/);
  assert.ok(code.indexOf('id="invites"') < code.indexOf('data-sl-onglets') && code.indexOf('data-sl-onglets') < code.indexOf('id="lieu"') && code.indexOf('id="lieu"') < code.indexOf('avant.map('), 'outil, salles, sur place, histoire');
  assert.match(code, /<div id="contact" class="container-ff sl-appel">/);
  assert.match(code, /onPage\(/);
  assert.match(code, /<Footer \/>/);
  assert.match(code, /sections\.map\(\(\{ Component, type \}, i\) => type !== 'about' && \(/);
  assert.doesNotMatch(code, INTERDITS);
});

test('coquille biens : h1, tel:, note ; vitrine Acheter / Louer en onglets cachés sans script ; estimer et contact ; mentions signalées ; tokens', () => {
  const code = codeDe(read('src/shells/biens.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\} class="bn-tel/);
  assert.match(code, /<section id="biens" class="bn-vitrine"/);
  assert.match(code, /role="tablist" aria-label="Votre projet" data-bn-onglets hidden/);
  assert.match(code, /\{x\.dpe && <span class="bn-dpe">Classe énergie \{x\.dpe\}<\/span>\}/);
  assert.match(code, /\{x\.exclusivite && <span class="bn-exclu">Exclusivité<\/span>\}/);
  assert.match(code, /<div id="contact" class="container-ff bn-estimer-in">/);
  assert.ok(code.indexOf('id="biens"') < code.indexOf('id="estimer"'), 'vitrine puis estimation');
  assert.match(code, /mentionsManquantes\(x\)/);
  assert.match(code, /console\.warn/);
  assert.match(code, /<Footer \/>/);
  assert.match(code, /sections\.map\(/);
  assert.doesNotMatch(code, INTERDITS);
});

test('pages /salles, /salles/<slug>, /biens, /biens/<slug>, /honoraires : générées seulement avec leurs données ; nav', () => {
  const si = read('src/pages/salles/[...index].astro');
  assert.match(si, /lienSalles\(site\.salles, site\.wording\.salles\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(si, /site\.faq\.map/);
  assert.match(read('src/pages/salles/[slug].astro'), /sallesCompletes\(site\.salles\)\.map\(\(s\) => \(\{ params: \{ slug: s\.slug \}/);
  const bx = read('src/pages/biens/[...index].astro');
  assert.match(bx, /lienBiens\(site\.biens, site\.wording\.biens\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  const bs = read('src/pages/biens/[slug].astro');
  assert.match(bs, /biensComplets\(site\.biens\)\.map\(\(x\) => \(\{ params: \{ slug: x\.slug \}/);
  assert.match(bs, /echelleDpe\(x\.dpe\)/);
  assert.match(bs, /\{x\.honoraires && <p class="pb-muted">\{x\.honoraires\}<\/p>\}/);
  assert.match(read('src/pages/honoraires/[...index].astro'), /h && \(h\.lignes\.length > 0 \|\| h\.note\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  for (const p of ['src/pages/salles/[...index].astro', 'src/pages/salles/[slug].astro', 'src/pages/biens/[...index].astro', 'src/pages/biens/[slug].astro', 'src/pages/honoraires/[...index].astro']) assert.doesNotMatch(codeDe(read(p)), INTERDITS, p);
  const s = read('src/lib/site.ts');
  assert.match(s, /lienSalles\(s\.salles, s\.wording\.salles\)/);
  assert.match(s, /lienBiens\(s\.biens, s\.wording\.biens\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadSallesModule\(\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadBiensModule\(\)/);
  assert.match(read('scripts/ff/composer.mjs'), /'salles', 'biens'[,\]]/);
});

test('docs : DIRECTIONS (coquilles salles et biens), INDEX (codées), fiches, CLAUDE.md', () => {
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /^\| `salles` \| \*\*Architecture `salles-capacites`\*\*/m);
  assert.match(d, /^\| `biens` \| \*\*Architecture `annonces-biens`\*\*/m);
  const idx = read('docs/veille/architectures/INDEX.md');
  assert.match(idx, /^\| \[salles-capacites\]\(salles-capacites\.md\) \|.*\| oui \(28 oct\) \|$/m);
  assert.match(idx, /^\| \[annonces-biens\]\(annonces-biens\.md\) \|.*\| oui \(28 oct\) \|$/m);
  for (const fiche of ['salles-capacites', 'annonces-biens']) {
    const t = read(`docs/veille/architectures/${fiche}.md`);
    assert.match(t, /## Codée dans l'usine \(28 oct 2026\)/);
    assert.match(t, /\]\(https:\/\//, 'sources citées en lien');
    assert.ok(fs.existsSync(path.join(ROOT, `docs/veille/architectures/${fiche}-essai.jpg`)), `${fiche}-essai.jpg`);
  }
  assert.match(read('CLAUDE.md'), /`salles` \(optionnel, architecture `salles-capacites`/);
});

test('fumigène : architecture salles-capacites (FF_LOOK) sur _exemple (sans salles) rend l’en-tête et l’appel, pas d’outil ni de /salles', { timeout: 180_000 }, () => {
  const fx = fumigene({ layout: { architecture: 'salles-capacites' } }, '_test-archi-salles-fum');
  try {
    const html = fx.html();
    assert.match(html, /data-shell="salles"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="sl-tel/);
    assert.doesNotMatch(html, /id="invites"|data-sl-onglets|data-sl-tableau/, 'aucune salle inventée');
    assert.match(html, /id="contact"/);
    assert.equal(fx.existe('salles.html') || fx.existe('salles/index.html'), false);
  } finally {
    fx.rm();
  }
});

test('fumigène : architecture annonces-biens (FF_LOOK) sur _exemple (sans biens) rend l’en-tête et l’estimation, pas de vitrine ni de /biens', { timeout: 180_000 }, () => {
  const fx = fumigene({ layout: { architecture: 'annonces-biens' } }, '_test-archi-biens-fum');
  try {
    const html = fx.html();
    assert.match(html, /data-shell="biens"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="bn-tel/);
    assert.doesNotMatch(html, /id="biens"|data-bn-onglets|Classe énergie/, 'aucun bien inventé');
    assert.match(html, /id="contact"/);
    assert.equal(fx.existe('biens.html') || fx.existe('biens/index.html') || fx.existe('honoraires.html'), false);
  } finally {
    fx.rm();
  }
});
