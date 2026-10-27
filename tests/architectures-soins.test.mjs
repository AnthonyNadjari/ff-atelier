// Architectures du 27 oct 2026 (veille, docs/veille/architectures/INDEX.md) : carte-des-soins (Institut La Douce Heure :
// le site d'un institut est sa carte, chaque soin « 40min | 45€ » et sa porte ; l'usine la range par le temps qu'on a,
// « Combien de temps avez-vous ? » en onglets) et avant-apres (Assise Autrement, La Petite Remise, atelier.b : l'accueil
// est le mur des pièces transformées, un curseur avant / après par pièce qu'on tire à la main, rangées par type).
// Registre, mesures de donneesManquantes, schéma, modules purs (src/lib/soins.ts, src/lib/avantapres.ts), coquilles,
// composant Comparer, docs, et un fumigène de build par architecture sur sites/_exemple (sans durée ni photo avant :
// rien d'inventé).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadArchitecturesModule, loadSchemaModule, loadSoinsModule, loadAvantApresModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const codeDe = (src) => src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const INTERDITS = /#[0-9a-fA-F]{3,8}\b|font-family|rounded-full|999px|uppercase|tracking-|[·—]|italic|eyebrow|text-shadow/;
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'Institut de beauté', tagline: 'Z', description: 'D' },
  contact: { phone: '+33612345678', phoneDisplay: '06 12 34 56 78', email: 'a@b.fr', address: { street: '1 rue A', postalCode: '44000', city: 'Nantes' } },
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
  test('registre carte-des-soins / avant-apres : coquilles soins et avant-apres, sources, mesures', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, completerLayout, COQUILLES_A_INDEX_REALISATIONS } = await loadArchitecturesModule();
    for (const id of ['carte-des-soins', 'avant-apres']) assert.ok(ARCHITECTURE_IDS.includes(id), id);
    const s = ARCHITECTURES['carte-des-soins'];
    assert.equal(s.layout.shell, 'soins');
    assert.equal(s.layout.actionBar, true, 'Réserver et le bon cadeau en bas au téléphone');
    assert.deepEqual(s.layout.sections.map((x) => `${x.type}/${x.variant}`), ['services/carte-prix', 'proof/testimonials']);
    assert.deepEqual(s.requis.map((e) => e.mesure), ['soins', 'rue', 'pasUrgence']);
    assert.equal(s.sources[0].site, 'institutladouceheure.fr');
    const a = ARCHITECTURES['avant-apres'];
    assert.equal(a.layout.shell, 'avant-apres');
    assert.equal(a.layout.pageAPropos, true, 'l’histoire a sa page, comme « Mon Histoire » de la source');
    assert.deepEqual(a.layout.sections, [{ type: 'proof', variant: 'testimonials' }]);
    assert.deepEqual(a.requis.map((e) => e.mesure), ['avantApres', 'rue']);
    assert.equal(a.sources[0].site, 'assiseautrement.fr');
    assert.ok(COQUILLES_A_INDEX_REALISATIONS.includes('avant-apres'), 'toutes les pièces sur /realisations');
    assert.equal(completerLayout({ architecture: 'carte-des-soins' }).shell, 'soins');
    assert.equal(completerLayout({ architecture: 'avant-apres', shell: 'flow' }).shell, 'flow', 'un réglage du site gagne');
  });

  test('donneesManquantes : soins datés (durée lisible), pièces avant et après, rue, pas l’urgence', async () => {
    const { donneesManquantes } = await loadArchitecturesModule();
    const rue = { contact: { address: { street: '8 route A' } } };
    const l = (duree) => ({ duree });
    assert.deepEqual(donneesManquantes('carte-des-soins', { ...rue, services: [{ lignes: [l('40 min'), l('1 h 15')] }, { lignes: [l('15min'), l('1h')] }] }), []);
    assert.match(donneesManquantes('carte-des-soins', { ...rue, services: [{ lignes: [l('40 min'), l('1 h 15'), l('selon'), l('0 min'), {}] }] }).join(), /4 soins.*\(2 aujourd’hui\)/, 'une durée illisible ou nulle ne compte pas');
    assert.match(donneesManquantes('carte-des-soins', { services: [{ lignes: [l('1h'), l('1h'), l('1h'), l('1h')] }], contact: { emergency24h: true } }).join(), /street[\s\S]*urgence/);
    const p = (avant = [1], photos = [1]) => ({ avant, photos });
    assert.deepEqual(donneesManquantes('avant-apres', { ...rue, realisations: [p(), p(), p()] }), []);
    assert.match(donneesManquantes('avant-apres', { ...rue, realisations: [p(), p(), p([])] }).join(), /3 pièces.*\(2 aujourd’hui\)/, 'sans photo avant, pas de curseur');
    assert.match(donneesManquantes('avant-apres', { realisations: [p(), p(), p()] }).join(), /street/);
  });

  test('schema : lignes[].duree, realisations[].avant, wording, coquilles ; rien par défaut', async () => {
    const { defineSite, SHELLS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('soins') && SHELLS.includes('avant-apres'));
    const vide = defineSite(minimal);
    assert.equal(vide.wording.temps, 'Combien de temps avez-vous ?');
    assert.match(vide.wording.photoDevis, /photo/);
    const avec = defineSite({
      ...minimal,
      layout: { architecture: 'avant-apres' },
      services: [{ slug: 'v', title: 'Visage', short: 'S', lignes: [{ nom: 'Éclat', prix: '45 €', duree: '40 min' }, { nom: 'Sans durée', prix: '9 €' }] }],
      realisations: [{ slug: 'club', title: 'Un club', photos: [{ src: '/images/a.webp', alt: 'Après' }] }],
    });
    assert.equal(avec.layout.shell, 'avant-apres');
    assert.equal(avec.services[0].lignes[0].duree, '40 min');
    assert.equal(avec.services[0].lignes[1].duree, undefined, 'aucune durée inventée');
    assert.deepEqual(avec.realisations[0].avant, [], 'aucune photo avant inventée');
    const schema = read('src/lib/schema.ts');
    assert.match(schema, /jamais devinee\."\),/);
    assert.match(schema, /jamais une photo d'une autre piece/);
  });

  test('soins (module pur) : durées lues, soins datés, tranches (deux au moins), ordre par durée', async () => {
    const S = await loadSoinsModule();
    assert.equal(S.minutesDeDuree('1 h 15'), 75);
    assert.equal(S.minutesDeDuree('1h15'), 75);
    assert.equal(S.minutesDeDuree('1h15min'), 75);
    assert.equal(S.minutesDeDuree('1 h'), 60);
    assert.equal(S.minutesDeDuree('40 min'), 40);
    assert.equal(S.minutesDeDuree('90 minutes'), 90);
    assert.equal(S.minutesDeDuree('15mn'), 15);
    assert.ok(Number.isNaN(S.minutesDeDuree('selon la zone')));
    assert.ok(Number.isNaN(S.minutesDeDuree(undefined)));
    const familles = [
      { slug: 'visage', title: 'Visage', lignes: [{ nom: 'Fraîcheur', duree: '1 h 15', prix: '82 €' }, { nom: 'Éclat', duree: '40 min' }, { nom: 'Gym', duree: '25 min' }] },
      { slug: 'instants', title: 'Instants', lignes: [{ nom: 'Crâne', duree: '15 min' }, { nom: 'Sans', prix: '9 €' }, { nom: 'Zéro', duree: '0 min' }] },
    ];
    const d = S.soinsDates(familles);
    assert.deepEqual(d.map((x) => x.nom), ['Fraîcheur', 'Éclat', 'Gym', 'Crâne']);
    assert.equal(d[3].famille, 'Instants');
    assert.equal(d[3].slug, 'instants');
    const t = S.tranches(d);
    assert.deepEqual(t.map((x) => x.id), ['court', 'moyen', 'long']);
    assert.deepEqual(t[0].soins.map((x) => x.nom), ['Crâne', 'Gym'], 'du plus court au plus long');
    assert.deepEqual(S.tranches(S.soinsDates([{ slug: 'a', title: 'A', lignes: [{ nom: 'x', duree: '30 min' }, { nom: 'y', duree: '20 min' }] }])).length, 0, 'une seule tranche : pas d’onglets');
    assert.deepEqual(S.tranches(S.soinsDates([{ slug: 'a', title: 'A', lignes: [{ nom: 'x', duree: '30 min' }, { nom: 'y', duree: '31 min' }] }])).map((x) => x.id), ['court', 'moyen'], '30 min est court, 31 min moyen');
  });

  test('avantapres (module pur) : pièces à deux photos, paire du curseur, types, groupes', async () => {
    const A = await loadAvantApresModule();
    const ph = (s) => ({ src: `/images/${s}.webp`, alt: s });
    const r = [
      { slug: 'a', title: 'A', kind: 'Fauteuil', avant: [ph('a0')], photos: [ph('a1'), ph('a2')] },
      { slug: 'b', title: 'B', kind: 'Chaise', avant: [], photos: [ph('b1')] },
      { slug: 'c', title: 'C', kind: 'Chaise', avant: [ph('c0')], photos: [ph('c1')] },
      { slug: 'd', title: 'D', avant: [ph('d0')], photos: [ph('d1')] },
    ];
    const p = A.piecesAvantApres(r);
    assert.deepEqual(p.map((x) => x.slug), ['a', 'c', 'd']);
    assert.deepEqual(A.piecesAvantApres(undefined), []);
    assert.deepEqual(A.paireDe(r[0]), { avant: ph('a0'), apres: ph('a1') });
    assert.equal(A.paireDe(r[1]), undefined);
    assert.deepEqual(A.typesDePieces(p), ['Fauteuil', 'Chaise']);
    assert.deepEqual(A.typesDePieces([r[0]]), [], 'un seul type : pas d’onglets');
    assert.deepEqual(A.groupesDePieces(p).map((g) => [g.type, g.pieces.map((x) => x.slug)]), [['Fauteuil', ['a']], ['Chaise', ['c']], ['Autres pièces', ['d']]]);
    assert.deepEqual(A.groupesDePieces([r[0]]).map((g) => g.type), [undefined], 'un seul groupe, sans nom');
    assert.deepEqual(A.groupesDePieces([]), []);
  });
}

test('coquille soins : h1, métier à ville, Réserver, tel:, bon cadeau ; onglets de durée (script, sans script tout) ; institut ; tokens', () => {
  const code = codeDe(read('src/shells/soins.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /site\.contact\.bookingUrl/);
  assert.match(code, /site\.contact\.giftCardUrl/);
  assert.match(code, /href=\{tel\(\)\} class="so-tel/);
  assert.match(code, /<section id="choisir"[^>]*aria-labelledby="so-question"/);
  assert.match(code, /tranchesDeSoins\(soinsDates\(site\.services\)\)/);
  assert.match(code, /data-so-onglets/);
  assert.match(code, /setAttribute\('role', 'tablist'\)/);
  assert.match(code, /setAttribute\('role', 'tabpanel'\)/);
  assert.match(code, /<section id="institut" class="so-institut/);
  assert.match(code, /onPage\(/);
  assert.match(code, /<Footer \/>/);
  assert.match(code, /sections\.map\(/);
  assert.doesNotMatch(code, INTERDITS);
});

test('coquille avant-apres : h1, tel:, porte photo ; mur en curseurs, onglets par type ; atelier ; tokens', () => {
  const code = codeDe(read('src/shells/avant-apres.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\} class="aa-tel/);
  assert.match(code, /whatsapp\(\) \?\? mailto\(\)/);
  assert.match(code, /<section id="avant-apres" class="aa-mur/);
  assert.match(code, /<Comparer avant=\{paire\.avant\} apres=\{paire\.apres\}/);
  assert.match(code, /groupesDePieces\(pieces\)/);
  assert.match(code, /setAttribute\('role', 'tablist'\)/);
  assert.match(code, /href="\/realisations"/);
  assert.match(code, /<section id="atelier" class="aa-atelier/);
  assert.doesNotMatch(code, /href="#contact"/, 'le tiroir de contact intercepte #contact');
  assert.match(code, /onPage\(/);
  assert.match(code, /<Footer \/>/);
  assert.match(code, /sections\.map\(/);
  assert.doesNotMatch(code, INTERDITS);
});

test('Comparer : curseur natif accessible, tiré au doigt, rien d’automatique ; page de la pièce ; durée dans la carte', () => {
  const c = codeDe(read('src/components/Comparer.astro'));
  assert.match(c, /type="range"[^>]*aria-label=/);
  assert.match(c, /touch-action: pan-y/);
  assert.match(c, /addEventListener\('pointerdown'/);
  assert.doesNotMatch(c, /setInterval|requestAnimationFrame|autoplay/, 'rien ne bouge tout seul');
  assert.doesNotMatch(c, INTERDITS);
  const page = read('src/pages/realisations/[slug].astro');
  assert.match(page, /const paire = paireDe\(r\)/);
  assert.match(page, /<Comparer avant=\{paire\.avant\}/);
  assert.match(read('src/sections/Services/carte-prix.astro'), /\{l\.duree && /);
  assert.match(read('src/components/ServicePorte.astro'), /\{l\.duree && /);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadSoinsModule\(\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadAvantApresModule\(\)/);
  assert.match(read('scripts/ff/composer.mjs'), /'soins', 'avant-apres'[,\]]/);
});

test('docs : DIRECTIONS (coquilles soins et avant-apres), INDEX (codées), fiches, CLAUDE.md', () => {
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /^\| `soins` \| \*\*Architecture `carte-des-soins`\*\*/m);
  assert.match(d, /^\| `avant-apres` \| \*\*Architecture `avant-apres`\*\*/m);
  const idx = read('docs/veille/architectures/INDEX.md');
  assert.match(idx, /^\| \[carte-des-soins\]\(carte-des-soins\.md\) \|.*\| oui \(27 oct\)/m);
  assert.match(idx, /^\| \[avant-apres\]\(avant-apres\.md\) \|.*\| oui \(27 oct\)/m);
  for (const f of ['carte-des-soins', 'avant-apres']) assert.match(read(`docs/veille/architectures/${f}.md`), /## Codée dans l'usine \(27 oct 2026\)/);
  assert.ok(fs.existsSync(path.join(ROOT, 'docs/veille/architectures/assise-autrement-demontage.md')));
  assert.ok(fs.existsSync(path.join(ROOT, 'docs/veille/architectures/la-douce-heure-demontage.md')));
  assert.match(read('CLAUDE.md'), /`services\[\]\.lignes\[\]\.duree` \(architecture `carte-des-soins`/);
});

test('fumigène : architecture carte-des-soins (FF_LOOK) sur _exemple (sans durée) rend l’en-tête et l’institut, pas d’onglets de durée', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'carte-des-soins' } }, '_test-archi-soins-fum');
  try {
    const html = f.html();
    assert.match(html, /data-shell="soins"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="so-tel/);
    assert.doesNotMatch(html, /id="choisir"|data-so-onglets/, 'aucune durée inventée');
    assert.match(html, /<section id="institut" class="so-institut/);
  } finally {
    f.rm();
  }
});

test('fumigène : architecture avant-apres (FF_LOOK) sur _exemple (sans photo avant) rend l’en-tête et l’atelier, pas de mur', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'avant-apres' } }, '_test-archi-avap-fum');
  try {
    const html = f.html();
    assert.match(html, /data-shell="avant-apres"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="aa-tel/);
    assert.doesNotMatch(html, /id="avant-apres"|data-cmp/, 'aucune photo avant inventée');
    assert.match(html, /<section id="atelier" class="aa-atelier/);
  } finally {
    f.rm();
  }
});
