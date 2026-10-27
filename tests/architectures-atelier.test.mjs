// Architectures du 26 oct 2026, soir (veille, docs/veille/architectures/INDEX.md) : grille-urgence (Serrure Ouest : le
// site d'un métier d'urgence est sa grille de prix publiée, « Quelle est votre situation ? » en onglets, le prix du
// créneau de l'heure, une page par situation) et atelier-par-colis (La Cordonnerie Alpine, AGH : deux chemins vers
// l'atelier, venir ou envoyer, le voyage du colis en piste horizontale, /envoyer). Registre, mesures de
// donneesManquantes, schéma, modules purs (src/lib/tarifs.ts, src/lib/colis.ts), coquilles, pages, docs, et un fumigène
// de build par architecture sur sites/_exemple (sans grille ni envoi : rien d'inventé).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadArchitecturesModule, loadSchemaModule, loadTarifsModule, loadColisModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const codeDe = (src) => src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const INTERDITS = /#[0-9a-fA-F]{3,8}\b|font-family|rounded-full|999px|uppercase|tracking-|[·—]|italic|eyebrow|text-shadow/;
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'Serrurier', tagline: 'Z', description: 'D' },
  contact: { phone: '+33612345678', phoneDisplay: '06 12 34 56 78', email: 'a@b.fr', address: { street: '1 rue A', postalCode: '69003', city: 'Lyon' } },
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
  test('registre grille-urgence / atelier-par-colis : coquilles grille et colis, sources, mesures', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, completerLayout } = await loadArchitecturesModule();
    for (const id of ['grille-urgence', 'atelier-par-colis']) assert.ok(ARCHITECTURE_IDS.includes(id), id);
    const g = ARCHITECTURES['grille-urgence'];
    assert.equal(g.layout.shell, 'grille');
    assert.equal(g.layout.actionBar, true, 'métier d’urgence : la barre d’appel au téléphone');
    assert.deepEqual(g.layout.sections, [{ type: 'proof', variant: 'testimonials' }]);
    assert.deepEqual(g.requis.map((e) => e.mesure), ['situations', 'urgence']);
    assert.equal(g.sources[0].site, 'serrure-ouest.com');
    const c = ARCHITECTURES['atelier-par-colis'];
    assert.equal(c.layout.shell, 'colis');
    assert.equal(c.layout.servicePage, 'porte', 'une page par prestation, avec ses lignes à prix');
    assert.deepEqual(c.layout.sections.map((s) => `${s.type}/${s.variant}`), ['services/carte-prix', 'faq/accordion', 'about/story', 'proof/testimonials']);
    assert.deepEqual(c.requis.map((e) => e.mesure), ['envoi', 'lignesPrix', 'rue', 'pasUrgence']);
    assert.equal(c.sources[0].site, 'lacordonneriealpine.fr');
    assert.equal(completerLayout({ architecture: 'grille-urgence' }).shell, 'grille');
    assert.equal(completerLayout({ architecture: 'atelier-par-colis', shell: 'flow' }).shell, 'flow', 'un réglage du site gagne');
  });

  test('donneesManquantes : situations à prix, urgence (24 h ou délai), étapes du colis, lignes à prix, rue', async () => {
    const { donneesManquantes } = await loadArchitecturesModule();
    const sit = (...prix) => ({ prix });
    assert.deepEqual(donneesManquantes('grille-urgence', { tarifs: { situations: [sit('90 €'), sit('', '150 €')], delai: '20 min' } }), []);
    assert.deepEqual(donneesManquantes('grille-urgence', { tarifs: { situations: [sit('90 €'), sit('170 €')] }, contact: { emergency24h: true } }), []);
    assert.match(donneesManquantes('grille-urgence', { tarifs: { situations: [sit('90 €'), sit('', ' ')], delai: 'x' } }).join(), /2 situations.*\(1 aujourd’hui\)/, 'une situation sans prix ne compte pas');
    assert.match(donneesManquantes('grille-urgence', { tarifs: { situations: [sit('1 €'), sit('2 €')] } }).join(), /appelle vite/);
    const etape = (ou = 'Chez vous', titre = 'Vous écrivez') => ({ ou, titre });
    const base = { services: [{ lignes: [{}] }], contact: { address: { street: '8 av. A' } } };
    assert.deepEqual(donneesManquantes('atelier-par-colis', { ...base, envoi: { etapes: [etape(), etape(), etape()] } }), []);
    assert.match(donneesManquantes('atelier-par-colis', { ...base, envoi: { etapes: [etape(), etape(), etape('', 'x')] } }).join(), /3 étapes.*\(2 aujourd’hui\)/);
    assert.match(donneesManquantes('atelier-par-colis', { envoi: { etapes: [etape(), etape(), etape()] }, contact: { emergency24h: true } }).join(), /services\[\]\.lignes[\s\S]*street[\s\S]*urgence/);
  });

  test('schema : tarifs, envoi, wording, coquilles ; rien par défaut', async () => {
    const { defineSite, SHELLS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('grille') && SHELLS.includes('colis'));
    const vide = defineSite(minimal);
    assert.equal(vide.tarifs, undefined, 'aucune grille inventée');
    assert.equal(vide.envoi, undefined, 'aucun envoi inventé');
    assert.equal(vide.wording.tarifs, 'Les tarifs');
    assert.equal(vide.wording.situation, 'Quelle est votre situation ?');
    assert.equal(vide.wording.envoi, 'Envoyer par colis');
    const avec = defineSite({
      ...minimal,
      layout: { architecture: 'grille-urgence' },
      tarifs: { creneaux: [{ nom: 'Journée', heures: '8 h – 18 h', de: '08:00', a: '18:00' }], situations: [{ slug: 'porte-claquee', nom: 'Porte claquée', prix: ['90 €'] }] },
      envoi: { etapes: [{ ou: 'Chez vous', titre: 'Vous écrivez' }] },
    });
    assert.equal(avec.layout.shell, 'grille');
    assert.equal(avec.tarifs.creneaux[0].jours, 'tous');
    assert.deepEqual(avec.tarifs.situations[0].compris, []);
    assert.deepEqual(avec.tarifs.secteurs, []);
    assert.equal(avec.tarifs.delai, undefined);
    assert.deepEqual(avec.envoi.retour, []);
    assert.equal(avec.envoi.delai, undefined);
    assert.throws(() => defineSite({ ...minimal, tarifs: { creneaux: [{ nom: 'Nuit', heures: 'x', de: '22h', a: '02:00' }] } }), /tarifs/);
    assert.throws(() => defineSite({ ...minimal, tarifs: { situations: [{ slug: 'Porte Claquée', nom: 'x' }] } }), /tarifs/);
    const schema = read('src/lib/schema.ts');
    assert.match(schema, /Jamais un prix, un delai ou un creneau inventes/);
    assert.match(schema, /Jamais un delai, un frais ou une etape inventes/);
  });

  test('tarifs (module pur) : situations complètes, créneau de l’heure (minuit franchi, semaine, week-end), prix alignés, « dès … », lien', async () => {
    const T = await loadTarifsModule();
    assert.equal(T.minutesDe('08:30'), 510);
    assert.ok(Number.isNaN(T.minutesDe('8h')));
    const creneaux = [
      { nom: 'Journée', de: '08:00', a: '18:00', jours: 'semaine' },
      { nom: 'Soirée', de: '18:00', a: '22:00' },
      { nom: 'Nuit', de: '22:00', a: '02:00' },
      { nom: 'Week-end', de: '08:00', a: '18:00', jours: 'week-end' },
    ];
    assert.equal(T.creneauDuMoment(creneaux, { jour: 0, minutes: 9 * 60 }), 0, 'lundi 9 h : journée');
    assert.equal(T.creneauDuMoment(creneaux, { jour: 5, minutes: 9 * 60 }), 3, 'samedi 9 h : week-end');
    assert.equal(T.creneauDuMoment(creneaux, { jour: 2, minutes: 19 * 60 }), 1);
    assert.equal(T.creneauDuMoment(creneaux, { jour: 2, minutes: 23 * 60 }), 2, 'avant minuit');
    assert.equal(T.creneauDuMoment(creneaux, { jour: 3, minutes: 60 }), 2, 'après minuit : le créneau de la veille');
    assert.equal(T.creneauDuMoment(creneaux, { jour: 3, minutes: 3 * 60 }), -1, 'hors créneau : rien de marqué');
    assert.equal(T.creneauDuMoment([{ nom: 'Nuit', de: '22:00', a: '02:00', jours: 'week-end' }], { jour: 0, minutes: 60 }), 0, 'lundi 1 h : nuit commencée dimanche');
    const situations = [{ slug: 'a', nom: 'A', prix: ['90 €', '', '210 €'] }, { slug: 'b', nom: 'B', prix: [' '] }, { slug: 'c', nom: 'C' }];
    assert.deepEqual(T.situationsCompletes({ situations }).map((s) => s.slug), ['a']);
    assert.deepEqual(T.situationsCompletes(undefined), []);
    assert.deepEqual(T.prixDes(situations[0], [1, 2, 3, 4]), ['90 €', '', '210 €', '']);
    assert.deepEqual(T.prixDes({ prix: ['50 €'] }, []), ['50 €'], 'sans créneau : une colonne');
    assert.equal(T.prixLePlusBas(['150 €', '90 €', 'sur devis', '1 200 €']), 'dès 90 €');
    assert.equal(T.prixLePlusBas(['sur devis', '']), undefined, 'rien de lisible : rien n’est inventé');
    assert.deepEqual(T.lienTarifs({ situations }, 'Les tarifs'), { href: '/tarifs', label: 'Les tarifs' });
    assert.equal(T.lienTarifs({ situations: [{ slug: 'b', nom: 'B', prix: [] }] }, 'x'), undefined);
  });

  test('colis (module pur) : étapes complètes, piste dès 3, adresse d’envoi, lien', async () => {
    const C = await loadColisModule();
    const e = { etapes: [{ ou: 'Chez vous', titre: 'Vous écrivez' }, { ou: 'À la poste', titre: 'Vous envoyez' }, { ou: '', titre: 'x' }, { ou: 'À l’atelier', titre: 'Nous réparons' }] };
    assert.equal(C.etapesCompletes(e).length, 3);
    assert.equal(C.pisteDEnvoi(e), true);
    assert.equal(C.pisteDEnvoi({ etapes: e.etapes.slice(0, 3) }), false, 'deux étapes complètes : pas de piste');
    assert.equal(C.pisteDEnvoi(undefined), false);
    assert.deepEqual(C.adresseDEnvoi(undefined, 'Atelier', '8 avenue A, 73200 Albertville'), ['Atelier', '8 avenue A', '73200 Albertville']);
    assert.deepEqual(C.adresseDEnvoi({ adresse: 'BP 12\n73201 Albertville cedex' }, 'Atelier', 'x'), ['Atelier', 'BP 12', '73201 Albertville cedex']);
    assert.deepEqual(C.lienEnvoi(e, 'Envoyer par colis'), { href: '/envoyer', label: 'Envoyer par colis' });
    assert.equal(C.lienEnvoi({ etapes: [] }, 'x'), undefined);
  });
}

test('coquille grille : h1, métier à ville, tel:, délai, note ; situations en tuiles devenues onglets ; créneau de l’heure ; grille complète ; atelier id="contact" ; tokens', () => {
  const code = codeDe(read('src/shells/grille.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\} class="gr-appel/);
  assert.match(code, /t\?\.delai/);
  assert.match(code, /google\.count/);
  assert.match(code, /id="situations"[^>]*aria-labelledby="gr-question"/);
  assert.match(code, /data-gr-onglets/);
  assert.match(code, /setAttribute\('role', 'tablist'\)/);
  assert.match(code, /setAttribute\('role', 'tabpanel'\)/);
  assert.match(code, /creneauDuMoment\(creneaux/);
  assert.match(code, /timeZone: 'Europe\/Paris'/);
  assert.match(code, /data-gr-moment hidden/, 'sans script, aucun créneau marqué');
  assert.match(code, /<table class="gr-table">/);
  assert.match(code, /<th scope="row">/);
  assert.match(code, /t!\.secteurs\.map/);
  assert.match(code, /<section id="contact" class="gr-atelier/);
  assert.match(code, /onPage\(/);
  assert.match(code, /<Footer \/>/);
  assert.match(code, /sections\.map\(/);
  assert.doesNotMatch(code, INTERDITS);
});

test('coquille colis : deux chemins, h1, métier à ville, état, tel:, note ; piste horizontale manuelle (scroll-snap, focus, flèches) ; atelier id="contact" ; tokens', () => {
  const code = codeDe(read('src/shells/colis.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /aria-label="Deux façons de faire réparer"/);
  assert.match(code, /href="#atelier"/);
  assert.match(code, /href="#envoi"/);
  assert.doesNotMatch(code, /href="#contact"/, 'le tiroir de contact intercepte #contact : les portes vont à #atelier');
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /e\?\.etat/);
  assert.match(code, /href=\{tel\(\)\} class="co-tel/);
  assert.match(code, /id="envoi" class="co-piste"[^>]*tabindex="0"/);
  assert.match(code, /scroll-snap-type: x mandatory/);
  assert.match(code, /overflow-x: auto/);
  assert.doesNotMatch(code, /addEventListener\('wheel'/, 'jamais la molette détournée');
  assert.match(code, /data-co-fleches hidden/);
  assert.match(code, /adresseDEnvoi\(/);
  assert.match(code, /e!\.retour\.map/);
  assert.match(code, /<section id="contact" class="co-atelier/);
  assert.match(code, /id="atelier"/);
  assert.match(code, /onPage\(/);
  assert.match(code, /<Footer \/>/);
  assert.match(code, /sections\.map\(/);
  assert.doesNotMatch(code, INTERDITS);
});

test('pages /tarifs, /tarifs/<slug>, /envoyer : générées seulement avec leurs données ; JSON-LD ; nav', () => {
  assert.match(read('src/pages/tarifs/[...index].astro'), /lienTarifs\(site\.tarifs, site\.wording\.tarifs\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(read('src/pages/envoyer/[...index].astro'), /lienEnvoi\(site\.envoi, site\.wording\.envoi\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  const p = read('src/pages/tarifs/[slug].astro');
  assert.match(p, /situationsCompletes\(site\.tarifs\)\.map\(\(s\) => \(\{ params: \{ slug: s\.slug \}/);
  assert.match(p, /situationLd\(site, s, pageUrl\)/);
  for (const f of ['src/pages/tarifs/[slug].astro', 'src/pages/tarifs/[...index].astro', 'src/pages/envoyer/[...index].astro']) {
    assert.equal((codeDe(read(f)).match(/<h1[\s>]/g) || []).length, 1, f);
    assert.doesNotMatch(codeDe(read(f)), INTERDITS, f);
  }
  const ld = read('src/lib/jsonld.ts');
  assert.match(ld, /export function situationLd\(/);
  assert.doesNotMatch(ld.slice(ld.indexOf('export function situationLd')), /aggregateRating/);
  const s = read('src/lib/site.ts');
  assert.match(s, /lienTarifs\(s\.tarifs, s\.wording\.tarifs\)/);
  assert.match(s, /lienEnvoi\(s\.envoi, s\.wording\.envoi\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadTarifsModule\(\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadColisModule\(\)/);
  assert.match(read('scripts/ff/composer.mjs'), /'grille', 'colis'[,\]]/);
});

test('docs : DIRECTIONS (coquilles grille et colis), INDEX (codées), fiches, CLAUDE.md', () => {
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /^\| `grille` \| \*\*Architecture `grille-urgence`\*\*/m);
  assert.match(d, /^\| `colis` \| \*\*Architecture `atelier-par-colis`\*\*/m);
  const idx = read('docs/veille/architectures/INDEX.md');
  assert.match(idx, /^\| \[grille-urgence\]\(grille-urgence\.md\) \|.*\| oui \(26 oct, soir\)/m);
  assert.match(idx, /^\| \[atelier-par-colis\]\(atelier-par-colis\.md\) \|.*\| oui \(26 oct, soir\)/m);
  for (const f of ['grille-urgence', 'atelier-par-colis']) assert.match(read(`docs/veille/architectures/${f}.md`), /## Codée dans l'usine \(26 oct 2026\)/);
  assert.ok(fs.existsSync(path.join(ROOT, 'docs/veille/architectures/serrure-ouest-demontage.md')));
  assert.ok(fs.existsSync(path.join(ROOT, 'docs/veille/architectures/cordonnerie-alpine-demontage.md')));
  assert.match(read('CLAUDE.md'), /`tarifs` \(optionnel, architecture `grille-urgence`/);
  assert.match(read('CLAUDE.md'), /`envoi` \(optionnel, architecture `atelier-par-colis`/);
});

test('fumigène : architecture grille-urgence (FF_LOOK) sur _exemple (sans grille) rend l’en-tête et l’atelier, ni situation ni page /tarifs', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'grille-urgence' } }, '_test-archi-grille-fum');
  try {
    const html = f.html();
    assert.match(html, /data-shell="grille"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="gr-appel/);
    assert.doesNotMatch(html, /id="situations"|data-gr-onglets|href="\/tarifs/, 'aucun prix inventé');
    assert.match(html, /<section id="contact" class="gr-atelier/);
    assert.ok(!f.existe('tarifs.html') && !f.existe('tarifs'));
  } finally {
    f.rm();
  }
});

test('fumigène : architecture atelier-par-colis (FF_LOOK) sur _exemple (sans envoi) rend la porte Venir et l’atelier, ni piste ni page /envoyer', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'atelier-par-colis' } }, '_test-archi-colis-fum');
  try {
    const html = f.html();
    assert.match(html, /data-shell="colis"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="#atelier"/);
    assert.doesNotMatch(html, /id="envoi"|data-co-piste|href="\/envoyer"/, 'aucun envoi inventé');
    assert.match(html, /<section id="contact" class="co-atelier[\s\S]*?href="tel:\+33600000000"/);
    assert.ok(!f.existe('envoyer.html') && !f.existe('envoyer'));
  } finally {
    f.rm();
  }
});
