// Architectures du 29 oct 2026 (veille, docs/veille/architectures/INDEX.md) : garde-especes (Clinique vétérinaire Les Quais,
// Saumur ; Clinique vétérinaire Saint-Max : le site d'une clinique vétérinaire part de « qui appeler maintenant ? ») et
// honoraires-domaines (Cabinet Marilyne Faltot, Forbach ; Judisis, Pontoise : le site d'un cabinet d'avocat dit combien et
// comment ça commence).
// Registre, mesures de donneesManquantes, schéma, modules purs (src/lib/garde.ts, src/lib/honoraires.ts), coquilles,
// pages, nav, docs, et un fumigène de build par architecture sur sites/_exemple (sans garde ni honoraires : rien d'inventé).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadArchitecturesModule, loadSchemaModule, loadGardeModule, loadHonorairesModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const codeDe = (src) => src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const INTERDITS = /#[0-9a-fA-F]{3,8}\b|font-family|rounded-full|999px|uppercase|tracking-|[·—]|italic|eyebrow|text-shadow/;
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'Clinique vétérinaire', tagline: 'Z', description: 'D' },
  contact: { phone: '+33612345678', phoneDisplay: '06 12 34 56 78', email: 'a@b.fr', address: { street: '1 rue A', postalCode: '49400', city: 'Saumur' } },
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

const contact = { phone: '+33612345678', phoneDisplay: '06 12 34 56 78' };

if (!tsImportable) {
  test('[ignoré] node ne sait pas type-stripper le TS ici', (t) => t.skip());
} else {
  test('registre garde-especes / honoraires-domaines : coquilles garde et honoraires, sources, mesures', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, completerLayout } = await loadArchitecturesModule();
    for (const id of ['garde-especes', 'honoraires-domaines']) assert.ok(ARCHITECTURE_IDS.includes(id), id);
    const g = ARCHITECTURES['garde-especes'];
    assert.equal(g.layout.shell, 'garde');
    assert.equal(g.layout.contactDrawer, true);
    assert.deepEqual(g.layout.sections.map((x) => x.type), ['proof', 'faq']);
    assert.deepEqual(g.requis.map((x) => x.mesure), ['garde', 'especes']);
    assert.equal(g.sources[0].site, 'clinique-les-quais.fr');
    assert.ok(g.sources.some((x) => x.site === 'vetosaintmax.fr'));
    const h = ARCHITECTURES['honoraires-domaines'];
    assert.equal(h.layout.shell, 'honoraires');
    assert.deepEqual(h.layout.sections.map((x) => x.type), ['about', 'faq']);
    assert.deepEqual(h.requis.map((x) => x.mesure), ['honoraires', 'lignesPrix']);
    assert.equal(h.sources[0].site, 'faltot-avocat.fr');
    assert.ok(h.sources.some((x) => x.site === 'judisis.fr'));
    assert.equal(completerLayout({ architecture: 'garde-especes' }).shell, 'garde');
    assert.equal(completerLayout({ architecture: 'honoraires-domaines', shell: 'flow' }).shell, 'flow', 'un réglage du site gagne');
  });

  test('donneesManquantes : garde lisible, espèces sans doublon, honoraires à prix, domaines à procédures', async () => {
    const { donneesManquantes } = await loadArchitecturesModule();
    const esp = [{ slug: 'chiens', nom: 'Chiens' }, { slug: 'chats', nom: 'Chats' }];
    assert.deepEqual(donneesManquantes('garde-especes', { garde: { etapes: [{ titre: 'Gardez votre calme' }] }, especes: esp }), []);
    assert.deepEqual(donneesManquantes('garde-especes', { garde: { telephone: '+33200000000', telephoneAffiche: '02 00 00 00 00' }, especes: esp }), [], 'un numéro de garde propre suffit');
    const m = donneesManquantes('garde-especes', { garde: { etapes: [{ titre: ' ' }] }, especes: [esp[0], esp[0], { slug: 'x', nom: ' ' }] }).join(' | ');
    assert.match(m, /conduite à tenir.*\(0 aujourd’hui\)/);
    assert.match(m, /2 espèces.*\(1 aujourd’hui\)/, 'doublon et espèce sans nom ne comptent pas');
    const services = [{ lignes: [{ nom: 'Divorce' }] }, { lignes: [{ nom: 'Rupture' }] }];
    assert.deepEqual(donneesManquantes('honoraires-domaines', { honoraires: { consultation: { prix: '200 € TTC' } }, services }), []);
    assert.deepEqual(donneesManquantes('honoraires-domaines', { honoraires: { modes: [{ nom: 'Au temps passé', prix: '250 € HT de l’heure' }] }, services }), []);
    const mh = donneesManquantes('honoraires-domaines', { honoraires: { consultation: { duree: '40 min' }, modes: [{ nom: 'Au forfait' }] }, services: [services[0]] }).join(' | ');
    assert.match(mh, /un prix dit par le cabinet.*\(0 aujourd’hui\)/, 'une durée seule ou un mode sans prix ne disent pas un prix');
    assert.match(mh, /2 domaines.*\(1 aujourd’hui\)/);
  });

  test('schema : garde, especes, honoraires (optionnels, décrits), wording, coquilles ; rien par défaut', async () => {
    const { defineSite, SHELLS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('garde') && SHELLS.includes('honoraires'));
    const vide = defineSite(minimal);
    assert.equal(vide.garde, undefined, 'aucune garde inventée');
    assert.deepEqual(vide.especes, [], 'aucune espèce inventée');
    assert.equal(vide.honoraires, undefined, 'aucun honoraire inventé');
    assert.equal(vide.wording.urgences, 'Urgences');
    assert.equal(vide.wording.especes, 'Les animaux');
    assert.equal(vide.wording.honoraires, 'Honoraires');
    assert.equal(vide.wording.domaines, 'Domaines d’intervention');
    const avec = defineSite({
      ...minimal,
      layout: { architecture: 'garde-especes' },
      garde: {},
      especes: [{ slug: 'chiens', nom: 'Chiens' }],
      honoraires: { modes: [{ nom: 'Au forfait' }] },
    });
    assert.equal(avec.layout.shell, 'garde');
    assert.deepEqual(avec.garde.etapes, [], 'aucune conduite à tenir inventée');
    assert.deepEqual(avec.garde.signes, [], 'aucun signe inventé');
    assert.equal(avec.garde.telephone, undefined, 'aucun numéro de garde inventé');
    assert.deepEqual(avec.especes[0].soins, []);
    assert.deepEqual(avec.especes[0].conseils, []);
    assert.equal(avec.honoraires.consultation, undefined, 'aucune consultation inventée');
    assert.equal(avec.honoraires.modes[0].prix, undefined, 'aucun taux inventé');
    assert.deepEqual(avec.honoraires.priseEnCharge, [], 'aucune prise en charge inventée');
    assert.equal(avec.honoraires.mediateur, undefined);
    assert.throws(() => defineSite({ ...minimal, especes: [{ slug: 'Chiens', nom: 'C' }] }), 'slug en minuscules');
    const schema = read('src/lib/schema.ts');
    assert.match(schema, /Jamais un numéro, un signe ou une organisation inventés\./);
    assert.match(schema, /Jamais une espèce, un soin ou un conseil inventés\./);
    assert.match(schema, /Jamais un prix, un taux, une durée ou une prise en charge inventés\./);
  });

  test('garde (module pur) : espèces complètes, temps, signes, numéro de garde et du moment, liens', async () => {
    const G = await loadGardeModule();
    assert.deepEqual(G.especesCompletes([{ slug: 'chiens', nom: 'Chiens' }, { slug: 'chiens', nom: 'Doublon' }, { slug: 'nac', nom: ' ' }, { slug: 'chats', nom: 'Chats' }]).map((e) => e.slug), ['chiens', 'chats']);
    const g = { etapes: [{ titre: 'Calme' }, { titre: ' ' }], signes: [' Respire mal ', ''], telephone: '+33 2 00 00 00 00', telephoneAffiche: '02 00 00 00 00' };
    assert.deepEqual(G.etapesGarde(g).map((e) => e.titre), ['Calme']);
    assert.deepEqual(G.signesGarde(g), ['Respire mal']);
    assert.deepEqual(G.numeroDeGarde(g, contact), { href: 'tel:+33200000000', affiche: '02 00 00 00 00', garde: true });
    assert.deepEqual(G.numeroDeGarde({ telephone: '+33612345678', telephoneAffiche: '06 12 34 56 78' }, contact).garde, false, 'le même numéro n’est pas une garde propre');
    assert.deepEqual(G.numeroDeGarde({ telephone: '+33200000000' }, contact).affiche, '06 12 34 56 78', 'sans affichage, la clinique');
    assert.equal(G.numeroDuMoment(true, g, contact).affiche, '06 12 34 56 78', 'ouvert : la clinique');
    assert.equal(G.numeroDuMoment(false, g, contact).affiche, '02 00 00 00 00', 'fermé : la garde');
    assert.equal(G.gardeLisible(undefined), false);
    assert.equal(G.gardeLisible({ etapes: [{ titre: ' ' }] }), false);
    assert.equal(G.gardeLisible(g), true);
    assert.deepEqual(G.lienEspeces([{ slug: 'a', nom: 'A' }, { slug: 'b', nom: 'B' }], 'Les animaux'), { href: '/animaux', label: 'Les animaux' });
    assert.equal(G.lienEspeces([{ slug: 'a', nom: 'A' }], 'L'), undefined, 'une espèce ne fait pas une page');
    assert.deepEqual(G.lienUrgences(g, 'Urgences'), { href: '/urgences', label: 'Urgences' });
    assert.equal(G.lienUrgences({}, 'Urgences'), undefined);
  });

  test('honoraires (module pur) : premiers pas, modes, domaines à prix, résumé, lisibles, lien', async () => {
    const H = await loadHonorairesModule();
    const h = { decouverte: { duree: '15 min', prix: 'Gratuit' }, consultation: { titre: 'Rendez-vous', duree: '40 min', prix: '200 € TTC' }, modes: [{ nom: 'Au forfait' }, { nom: ' ' }] };
    assert.deepEqual(H.premiersPas(h).map((p) => [p.cle, p.titre]), [['decouverte', 'Premier appel'], ['consultation', 'Rendez-vous']]);
    assert.deepEqual(H.premiersPas({ decouverte: { texte: 'sans prix ni durée' } }), [], 'rien de deviné');
    assert.deepEqual(H.modesComplets(h).map((m) => m.nom), ['Au forfait']);
    assert.equal(H.resumePas(h.consultation), '40 min, 200 € TTC');
    assert.deepEqual(H.domainesAPrix([{ slug: 'a', title: 'A', lignes: [{ nom: 'X', prix: '1 €' }] }, { slug: 'b', title: 'B', lignes: [{ nom: 'Y' }] }]).map((d) => d.slug), ['a']);
    assert.equal(H.honorairesLisibles(h), true);
    assert.equal(H.honorairesLisibles({ modes: [{ nom: 'Au forfait' }] }), false, 'un mode sans prix ne dit pas un prix');
    assert.deepEqual(H.lienHonoraires(h, 'Honoraires'), { href: '/nos-honoraires', label: 'Honoraires' });
    assert.equal(H.lienHonoraires(undefined, 'H'), undefined);
    assert.deepEqual(H.lienHonoraires({ modes: [{ nom: 'A' }, { nom: 'B' }] }, 'H'), { href: '/nos-honoraires', label: 'H' }, 'deux façons de fixer l’honoraire font une page');
  });
}

test('coquille garde : bandeau, h1, deux portes, numéro du moment ; un bloc à onglets cachés sans script (urgence puis espèces) ; venir et questions dans le bloc ; tokens', () => {
  const code = codeDe(read('src/shells/garde.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /<p class="gd-alerte bg-ink text-on-ink">/);
  assert.match(code, /<NumeroDuMoment \/>/);
  assert.match(code, /role="tablist" aria-label="Urgence ou animal" data-gd-onglets hidden/, 'les onglets n’apparaissent qu’avec le script');
  assert.match(code, /\{ id: 'urgence', nom: site\.wording\.urgences \}/, 'l’urgence en premier onglet');
  assert.match(code, /etatDuJour\(JSON\.parse\(bloc\.dataset\.gdSemaine\), new Date\(\)\)\.ouvert \? premiereEspece : iUrgence/, 'fermé : ouvert sur l’urgence');
  assert.ok(code.indexOf('id="hero"') < code.indexOf('id="clinique"') && code.indexOf('id="urgence"') < code.indexOf('id={`animal-') && code.indexOf('id={`animal-') < code.indexOf('id="contact"') && code.indexOf('id="contact"') < code.indexOf('id="faq"') && code.indexOf('id="faq"') < code.indexOf('sections.map('), 'héros, urgence, espèces, venir, questions, puis les sections');
  assert.match(code, /sections\.map\(\(\{ Component, type \}, i\) => type !== 'faq' && \(/, 'les questions sont dans le bloc');
  assert.match(code, /onPage\(/);
  assert.match(code, /<Footer \/>/);
  assert.doesNotMatch(code, INTERDITS);
  const n = codeDe(read('src/components/NumeroDuMoment.astro'));
  assert.match(n, /numeroDeGarde\(site\.garde, site\.contact\)/);
  assert.match(n, /c\.hidden = garde;/);
  assert.doesNotMatch(n, INTERDITS);
});

test('coquille honoraires : h1, métier, premier échange et rendez-vous ; domaines en onglets cachés sans script ; honoraires, cabinet, questions dans le bloc ; tokens', () => {
  const code = codeDe(read('src/shells/honoraires.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /id="premier-echange"/);
  assert.match(code, /premiersPas\(h\)/);
  assert.match(code, /href=\{tel\(\)\} class="ho-tel/);
  assert.match(code, /role="tablist" aria-label=\{site\.wording\.domaines\} data-ho-onglets hidden/);
  assert.ok(code.indexOf('id="premier-echange"') < code.indexOf('id="domaines"') && code.indexOf('id="domaines"') < code.indexOf('id="honoraires"') && code.indexOf('id="honoraires"') < code.indexOf('id="contact"') && code.indexOf('id="contact"') < code.indexOf('id="faq"') && code.indexOf('id="faq"') < code.indexOf('sections.map('), 'premier échange, domaines, honoraires, cabinet, questions, puis les sections');
  assert.match(code, /\{l\.prix \?\? 'sur devis'\}/, 'une procédure sans prix ne reçoit pas de prix deviné');
  assert.match(code, /onPage\(/);
  assert.match(code, /<Footer \/>/);
  assert.doesNotMatch(code, INTERDITS);
});

test('pages /urgences, /animaux, /animaux/<slug>, /nos-honoraires : générées seulement avec leurs données ; nav ; procédures sur la page du domaine', () => {
  assert.match(read('src/pages/urgences/[...index].astro'), /lienUrgences\(site\.garde, site\.wording\.urgences\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(read('src/pages/animaux/[...index].astro'), /lienEspeces\(site\.especes, site\.wording\.especes\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  const as = read('src/pages/animaux/[slug].astro');
  assert.match(as, /especesCompletes\(site\.especes\)\.map\(\(e\) => \(\{ params: \{ slug: e\.slug \}/);
  assert.match(as, /faqPageLd\(e\.conseils\)/);
  const nh = read('src/pages/nos-honoraires/[...index].astro');
  assert.match(nh, /lienHonoraires\(site\.honoraires, site\.wording\.honoraires\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(nh, /h\.mediateur &&/);
  for (const p of ['src/pages/urgences/[...index].astro', 'src/pages/animaux/[...index].astro', 'src/pages/animaux/[slug].astro', 'src/pages/nos-honoraires/[...index].astro']) assert.doesNotMatch(codeDe(read(p)), INTERDITS, p);
  const sp = read('src/pages/services/[slug].astro');
  assert.match(sp, /const procedures = site\.honoraires \? service\.lignes\.filter/, 'les procédures seulement pour un site qui déclare ses honoraires');
  const s = read('src/lib/site.ts');
  assert.match(s, /lienEspeces\(s\.especes, s\.wording\.especes\)/);
  assert.match(s, /lienUrgences\(s\.garde, s\.wording\.urgences\)/);
  assert.match(s, /lienHonoraires\(s\.honoraires, s\.wording\.honoraires\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadGardeModule\(\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadHonorairesModule\(\)/);
  assert.match(read('scripts/ff/composer.mjs'), /'garde', 'honoraires'[,\]]/);
});

test('docs : DIRECTIONS (coquilles garde et honoraires), INDEX (codées), fiches, CLAUDE.md', () => {
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /^\| `garde` \| \*\*Architecture `garde-especes`\*\*/m);
  assert.match(d, /^\| `honoraires` \| \*\*Architecture `honoraires-domaines`\*\*/m);
  const idx = read('docs/veille/architectures/INDEX.md');
  assert.match(idx, /^\| \[garde-especes\]\(garde-especes\.md\) \|.*\| oui \(29 oct\) \|$/m);
  assert.match(idx, /^\| \[honoraires-domaines\]\(honoraires-domaines\.md\) \|.*\| oui \(29 oct\) \|$/m);
  for (const fiche of ['garde-especes', 'honoraires-domaines']) {
    const t = read(`docs/veille/architectures/${fiche}.md`);
    assert.match(t, /## Codée dans l'usine \(29 oct 2026\)/);
    assert.match(t, /\]\(https:\/\//, 'sources citées en lien');
    for (const c of ['source', 'essai']) assert.ok(fs.existsSync(path.join(ROOT, `docs/veille/architectures/${fiche}-${c}.jpg`)), `${fiche}-${c}.jpg`);
  }
  assert.match(read('CLAUDE.md'), /`garde` et `especes` \(optionnels, architecture `garde-especes`/);
  assert.match(read('CLAUDE.md'), /`honoraires` \(optionnel, architecture `honoraires-domaines`/);
});

test('fumigène : architecture garde-especes (FF_LOOK) sur _exemple (sans garde ni espèces) rend le bandeau, le h1, les portes et venir, pas d’onglets ni de /urgences', { timeout: 180_000 }, () => {
  const fx = fumigene({ layout: { architecture: 'garde-especes' } }, '_test-archi-garde-fum');
  try {
    const html = fx.html();
    assert.match(html, /data-shell="garde"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /class="gd-alerte /);
    assert.match(html, /href="tel:\+33600000000"/);
    assert.doesNotMatch(html, /data-gd-onglets|Que faire en cas d’urgence/, 'aucune garde inventée');
    assert.match(html, /id="contact"/);
    assert.equal(fx.existe('urgences.html') || fx.existe('urgences/index.html'), false);
    assert.equal(fx.existe('animaux.html') || fx.existe('animaux/index.html'), false);
  } finally {
    fx.rm();
  }
});

test('fumigène : architecture honoraires-domaines (FF_LOOK) sur _exemple (sans honoraires) rend le h1, l’appel, les domaines, pas de prix ni de /nos-honoraires', { timeout: 180_000 }, () => {
  const fx = fumigene({ layout: { architecture: 'honoraires-domaines' } }, '_test-archi-honoraires-fum');
  try {
    const html = fx.html();
    assert.match(html, /data-shell="honoraires"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="ho-tel/);
    assert.match(html, /id="domaines"/);
    assert.doesNotMatch(html, /class="ho-pas-li|Comment sont fixés les honoraires|class="ho-ligne"/, 'aucun honoraire ni procédure inventés');
    assert.equal(fx.existe('nos-honoraires.html') || fx.existe('nos-honoraires/index.html'), false);
  } finally {
    fx.rm();
  }
});
