// Architectures du 25 oct 2026 (veille, docs/veille/architectures/INDEX.md) : artistes-residents (Mystery Tattoo Club :
// la maison se choisit par ses artistes, un bloc et une page par artiste, filtre par style) et calendrier-fetes (Touchard
// Fleurs : la prochaine fête d'abord, sa date limite de commande, la livraison, une page par fête). Registre, mesures de
// donneesManquantes, schéma, modules purs (src/lib/artistes.ts, src/lib/fetes.ts), coquilles, composants, pages, docs, et
// un fumigène de build par architecture sur sites/_exemple (sans artiste ni fête : rien d'inventé).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadArchitecturesModule, loadSchemaModule, loadArtistesModule, loadFetesModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const codeDe = (src) => src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const INTERDITS = /#[0-9a-fA-F]{3,8}\b|font-family|rounded-full|999px|uppercase|tracking-|[·—]|italic|eyebrow|text-shadow/;
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'Fleuriste', tagline: 'Z', description: 'D' },
  contact: { phone: '+33612345678', phoneDisplay: '06 12 34 56 78', email: 'a@b.fr', address: { postalCode: '59000', city: 'Lille' } },
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
  test('registre artistes-residents / calendrier-fetes : coquilles artistes et fetes, avis, À propos, tiroir, mesures artistes et fetes', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, completerLayout } = await loadArchitecturesModule();
    for (const id of ['artistes-residents', 'calendrier-fetes']) assert.ok(ARCHITECTURE_IDS.includes(id), id);
    const a = ARCHITECTURES['artistes-residents'];
    assert.equal(a.layout.shell, 'artistes');
    assert.deepEqual(a.layout.sections, [{ type: 'proof', variant: 'testimonials' }], 'les avis (socle)');
    assert.equal(a.layout.contactDrawer, true);
    assert.equal(a.layout.pageAPropos, true);
    assert.deepEqual(a.requis.map((e) => e.mesure), ['artistes', 'rue', 'pasUrgence']);
    assert.equal(a.sources[0].site, 'mysterytattooclub.com');
    const f = ARCHITECTURES['calendrier-fetes'];
    assert.equal(f.layout.shell, 'fetes');
    assert.deepEqual(f.requis.map((e) => e.mesure), ['fetes', 'services', 'pasUrgence']);
    assert.equal(f.sources[0].site, 'fleuriste-lemans.fr');
    assert.equal(completerLayout({ architecture: 'calendrier-fetes' }).shell, 'fetes');
    assert.equal(completerLayout({ architecture: 'artistes-residents', shell: 'flow' }).shell, 'flow', 'un réglage du site gagne');
  });

  test('donneesManquantes : artistes (photo et style), fêtes (dates et lignes), occasions, urgence ; photos des artistes comptées', async () => {
    const { donneesManquantes, photosDuClient } = await loadArchitecturesModule();
    const art = (o = {}) => ({ photo: { src: '/a.webp' }, styles: ['Japonais'], ...o });
    const base = { contact: { address: { street: '1 rue A' } } };
    assert.deepEqual(donneesManquantes('artistes-residents', { ...base, artistes: [art(), art(), art()] }), []);
    assert.match(donneesManquantes('artistes-residents', { ...base, artistes: [art(), art({ photo: undefined }), art({ styles: [' '] }), art({ photo: undefined, photos: [{}] })] }).join(), /3 artistes.*\(2 aujourd’hui\)/, 'sans photo ou sans style ne compte pas ; les travaux tiennent lieu de photo');
    assert.match(donneesManquantes('artistes-residents', { artistes: [art(), art(), art()] }).join(), /contact\.address\.street/);
    const fete = (du, au, n = 1) => ({ du, au, lignes: Array.from({ length: n }, () => ({ nom: 'x' })) });
    const occ = [{}, {}];
    assert.deepEqual(donneesManquantes('calendrier-fetes', { services: occ, fetes: [fete('2026-10-20', '2026-11-01'), fete('2026-12-01', '2026-12-24')] }), []);
    assert.match(donneesManquantes('calendrier-fetes', { services: occ, fetes: [fete('2026-10-20', '2026-11-01'), fete('2026-12-24', '2026-12-01'), fete('2027-02-10', '2027-02-14', 0)] }).join(), /2 fêtes.*\(1 aujourd’hui\)/, 'dates à l’envers et fête sans ligne ne comptent pas');
    assert.match(donneesManquantes('calendrier-fetes', { services: [{}], fetes: [fete('2026-10-20', '2026-11-01'), fete('2026-12-01', '2026-12-24')], contact: { emergency24h: true } }).join(), /2 occasions[\s\S]*urgence/);
    assert.equal(photosDuClient({ artistes: [{ photo: {}, photos: [{}, {}] }], fetes: [{ photo: {} }, {}] }), 4);
  });

  test('schema : artistes[], fetes[], livraison, wording.artistes et fetes, coquilles', async () => {
    const { defineSite, SHELLS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('artistes') && SHELLS.includes('fetes'));
    const vide = defineSite(minimal);
    assert.deepEqual(vide.artistes, []);
    assert.deepEqual(vide.fetes, []);
    assert.equal(vide.livraison, undefined, 'aucune livraison inventée');
    assert.equal(vide.wording.artistes, 'Les artistes');
    assert.equal(vide.wording.fetes, 'Les fêtes');
    const avec = defineSite({
      ...minimal,
      layout: { architecture: 'artistes-residents' },
      artistes: [{ slug: 'lena', nom: 'Léna' }],
      fetes: [{ slug: 'toussaint', nom: 'Toussaint', du: '2026-10-20', au: '2026-11-01' }],
      livraison: { heureLimite: '13:00' },
    });
    assert.equal(avec.layout.shell, 'artistes');
    assert.deepEqual(avec.artistes[0].styles, []);
    assert.deepEqual(avec.artistes[0].photos, []);
    assert.equal(avec.artistes[0].email, undefined, 'e-mail absent = repli au rendu, jamais deviné');
    assert.deepEqual(avec.fetes[0].lignes, []);
    assert.equal(avec.fetes[0].commanderAvant, undefined);
    assert.throws(() => defineSite({ ...minimal, artistes: [{ slug: 'Léna', nom: 'Léna' }] }), /artistes/, 'slug en minuscules');
    assert.throws(() => defineSite({ ...minimal, fetes: [{ slug: 'x', nom: 'X', du: '20/10/2026', au: '2026-11-01' }] }), /fetes/);
    assert.throws(() => defineSite({ ...minimal, livraison: { heureLimite: '13 h' } }), /livraison/);
    const schema = read('src/lib/schema.ts');
    assert.match(schema, /Jamais un artiste, un style ou une photo inventes/);
    assert.match(schema, /Jamais une fete, une date ou un prix inventes/);
    assert.match(schema, /choisie DANS LE NAVIGATEUR/);
  });

  test('artistes (module pur) : styles distincts et comptés, artistes d’un style, autres, portes (repli e-mail), résidents et invités, lien, complets', async () => {
    const A = await loadArtistesModule();
    assert.equal(A.slugStyle('Néo-trad'), 'neo-trad');
    assert.equal(A.slugStyle(' Old school '), 'old-school');
    const artistes = [
      { slug: 'lena', nom: 'Léna', styles: ['Japonais', 'Néo-trad', 'japonais'], photo: {}, email: 'lena@x.fr', instagram: 'https://instagram.com/l', rdvUrl: 'https://rdv/l' },
      { slug: 'marco', nom: 'Marco', styles: ['Old school', 'Japonais '] },
      { slug: 'yuki', nom: 'Yuki', styles: ['Tebori'], photos: [{}], periode: 'du 3 au 15 novembre' },
    ];
    assert.deepEqual(A.stylesDe(artistes).map((s) => [s.nom, s.slug, s.n]), [['Japonais', 'japonais', 2], ['Néo-trad', 'neo-trad', 1], ['Old school', 'old-school', 1], ['Tebori', 'tebori', 1]], 'un style répété chez la même personne ne compte qu’une fois');
    assert.deepEqual(A.artistesDuStyle(artistes, 'japonais').map((a) => a.slug), ['lena', 'marco']);
    assert.deepEqual(A.autresArtistes(artistes, 'lena').map((a) => a.slug), ['marco', 'yuki']);
    const p = A.contactsDeLArtiste(artistes[0], { email: 'salon@x.fr' });
    assert.deepEqual(p.map((x) => [x.type, x.propre]), [['rdv', true], ['email', true], ['instagram', true]]);
    assert.match(p[1].href, /^mailto:lena@x\.fr\?subject=/);
    const repli = A.contactsDeLArtiste(artistes[1], { email: 'salon@x.fr' });
    assert.deepEqual(repli.map((x) => [x.type, x.propre]), [['email', false]], 'repli sur l’e-mail du salon, rien d’autre de deviné');
    assert.deepEqual(A.contactsDeLArtiste(artistes[1], {}), []);
    const { residents, invites } = A.residentsEtInvites(artistes);
    assert.deepEqual([residents.map((a) => a.slug), invites.map((a) => a.slug)], [['lena', 'marco'], ['yuki']]);
    assert.deepEqual(A.lienArtistes(artistes, 'Les artistes'), { href: '/artistes', label: 'Les artistes' });
    assert.equal(A.lienArtistes([], 'x'), null);
    assert.equal(A.artistesComplets(artistes), 2, 'Marco sans photo ne compte pas');
    assert.equal(A.enumerer(['a', 'b', 'c']), 'a, b et c');
    assert.doesNotMatch(read('src/lib/artistes.ts'), /^import /m, 'module pur');
  });

  test('fetes (module pur) : à venir triées, fête du moment, état de la commande, dates, heures, livraison du moment, libellés, lien, complètes', async () => {
    const F = await loadFetesModule();
    const fetes = [
      { slug: 'noel', nom: 'Noël', du: '2026-12-01', au: '2026-12-24', commanderAvant: '2026-12-20', lignes: [{}] },
      { slug: 'toussaint', nom: 'Toussaint', du: '2026-10-20', au: '2026-11-01', commanderAvant: '2026-10-30', lignes: [{}] },
      { slug: 'passee', nom: 'Rentrée', du: '2026-09-01', au: '2026-09-05', lignes: [{}] },
    ];
    assert.deepEqual(F.fetesAVenir(fetes, '2026-10-25').map((f) => f.slug), ['toussaint', 'noel'], 'les passées tombent, triées par début');
    assert.deepEqual(F.fetesAVenir(fetes, '2026-11-01').map((f) => f.slug), ['toussaint', 'noel'], 'le jour de la fête compte encore');
    const av = F.fetesAVenir(fetes, '2026-10-25');
    assert.deepEqual(F.feteDuMoment(av, '2026-10-25'), { index: 0, enCours: true, joursAvant: 0 });
    assert.deepEqual(F.feteDuMoment(av, '2026-11-02'), { index: 1, enCours: false, joursAvant: 29 });
    assert.deepEqual(F.feteDuMoment(av, '2026-11-30'), { index: 1, enCours: false, joursAvant: 1 });
    assert.equal(F.feteDuMoment(av, '2027-01-01'), undefined);
    assert.equal(F.etatCommande(fetes[1], '2026-10-30'), 'ouverte', 'la date limite est comprise');
    assert.equal(F.etatCommande(fetes[1], '2026-10-31'), 'close');
    assert.equal(F.etatCommande(fetes[2], '2026-09-01'), undefined, 'sans date limite, rien n’est dit');
    assert.equal(F.joursEntre('2026-10-25', '2026-11-01'), 7);
    assert.equal(F.dateFete('2026-11-01'), '1er novembre');
    assert.equal(F.periodeFete('2026-10-20', '2026-11-01'), 'du 20 octobre au 1er novembre');
    assert.equal(F.periodeFete('2027-02-14', '2027-02-14'), 'le 14 février');
    assert.equal(F.formatHeure('13:00'), '13 h');
    assert.equal(F.formatHeure('08:30'), '8 h 30');
    assert.equal(F.livraisonDuMoment('13:00', 12 * 60 + 59), 'aujourdhui');
    assert.equal(F.livraisonDuMoment('13:00', 13 * 60), 'suivant');
    assert.equal(F.livraisonDuMoment(undefined, 0), undefined);
    assert.equal(F.libelleDuMoment({ enCours: true, joursAvant: 0 }), 'En ce moment');
    assert.equal(F.libelleDuMoment({ enCours: false, joursAvant: 1 }), 'Demain');
    assert.equal(F.libelleDuMoment({ enCours: false, joursAvant: 12 }), 'Dans 12 jours');
    assert.deepEqual(F.lienFetes(fetes, 'Les fêtes', '2026-10-25'), { href: '/fetes', label: 'Les fêtes' });
    assert.equal(F.lienFetes(fetes, 'x', '2027-01-01'), null, 'aucune fête à venir = aucun lien');
    assert.equal(F.fetesCompletes([...fetes, { du: '2026-12-24', au: '2026-12-01', lignes: [{}] }, { du: '2026-12-01', au: '2026-12-02' }]), 3);
    assert.doesNotMatch(read('src/lib/fetes.ts'), /^import /m, 'module pur');
  });
}

test('coquille artistes : h1, métier à ville, tel:, note ; onglets de style posés par le script ; un bloc par artiste ; maison id="contact" ; tokens', () => {
  const code = codeDe(read('src/shells/artistes.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\}/);
  assert.match(code, /site\.proof\.google/);
  assert.match(code, /data-as-onglets hidden/, 'sans script : pas de rangée, tous les artistes');
  assert.match(code, /setAttribute\('role', 'tablist'\)/);
  assert.match(code, /<section id=\{`artiste-\$\{a\.slug\}`\}/, 'un bloc par artiste');
  assert.match(code, /contactsDeLArtiste\(a, site\.contact\)/);
  assert.match(code, /<section id="contact" class="as-maison/);
  assert.match(code, /donneesManquantes\('artistes-residents', site\)/);
  assert.doesNotMatch(code, /<Hero\s*\/>/);
  assert.doesNotMatch(code, INTERDITS);
  assert.match(read('scripts/ff/composer.mjs'), /COQUILLES_D_ARCHITECTURE = \[[^\]]*'artistes', 'fetes'/);
});

test('coquille fetes : h1, métier à ville, tel:, note ; piste des fêtes qui défile en x ; livraison ; occasions ; boutique id="contact" ; tokens', () => {
  const code = codeDe(read('src/shells/fetes.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\}/);
  assert.match(code, /site\.proof\.google/);
  assert.match(code, /<section id="fete" class="fe-fete[^"]*"[^>]*data-fm-defileur>/);
  assert.match(code, /\.fe-fete \{ overflow-x: auto;[^}]*scroll-snap-type: x mandatory/, 'défilement manuel, aimanté');
  assert.match(code, /<FeteDuMoment priorite \/>/);
  assert.match(code, /\{site\.livraison && \(/, 'pas de livraison inventée');
  assert.match(code, /<section id="services" class="container-ff fe-occasions"/);
  assert.match(code, /<section id="contact" class="fe-boutique"/);
  assert.match(code, /donneesManquantes\('calendrier-fetes', site\)/);
  assert.doesNotMatch(code, /<Hero\s*\/>/);
  assert.doesNotMatch(code, INTERDITS);
});

test('« le moment » choisi dans le navigateur : fêtes à venir et heure limite rendues au build, date et heure côté client', () => {
  for (const f of ['src/components/FeteDuMoment.astro', 'src/components/Livraison.astro']) {
    const src = read(f);
    const [front, reste] = src.split(/^---$/m).slice(1);
    assert.doesNotMatch(codeDe(front), /maintenant\(|new Date\(/, `${f} : aucun moment choisi au build`);
    assert.match(reste, /<script>[\s\S]*onPage\(/, `${f} : script de page`);
    assert.doesNotMatch(codeDe(src), INTERDITS);
  }
  const fm = codeDe(read('src/components/FeteDuMoment.astro'));
  assert.match(fm, /fetesAVenir\(site\.fetes, isoDuJour\(\)\)/);
  assert.match(fm, /feteDuMoment\(fetes, aujourdhui\)/);
  assert.match(fm, /isoDuJour\(new Date\(\)\)/);
  assert.match(fm, /setAttribute\('aria-current', 'date'\)/);
  assert.match(fm, /\{l\.prix && <span class="fm-prix/, 'pas de prix inventé');
  assert.doesNotMatch(fm, /scrollIntoView|behavior: 'smooth'/, 'la piste ne bouge pas seule');
  const lv = codeDe(read('src/components/Livraison.astro'));
  assert.match(lv, /livraisonDuMoment\(el\.dataset\.livraisonLimite, minutes\)/);
  assert.match(lv, /maintenant\(new Date\(\)\)/);
  const mur = codeDe(read('src/components/MurArtistes.astro'));
  assert.match(mur, /\.ma:has\(\[data-ma="1"\]:checked\) \.ma-item:not\(\[data-styles~="1"\]\)/, 'filtre par style sans script');
  assert.doesNotMatch(mur, INTERDITS);
});

test('pages /artistes, /artistes/<slug>, /fetes, /fetes/<slug> : générées seulement avec leurs données ; JSON-LD ; nav', () => {
  assert.match(read('src/pages/artistes/[...index].astro'), /site\.artistes\.length > 0 \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  const a = read('src/pages/artistes/[slug].astro');
  assert.match(a, /site\.artistes\.map\(\(a\) => \(\{ params: \{ slug: a\.slug \}/);
  assert.match(a, /artisteLd\(site, a, pageUrl/);
  assert.match(a, /<h1 class="af-nom font-display">\{a\.nom\}<\/h1>/);
  assert.match(read('src/pages/fetes/[...index].astro'), /fetesAVenir\(site\.fetes, isoDuJour\(\)\)\.length > 0 \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  const f = read('src/pages/fetes/[slug].astro');
  assert.match(f, /site\.fetes\.map\(\(f\) => \(\{ params: \{ slug: f\.slug \}/);
  assert.match(f, /feteLd\(site, f, pageUrl\)/);
  const ld = read('src/lib/jsonld.ts');
  assert.match(ld, /export function artisteLd\(/);
  assert.match(ld, /export function feteLd\(/);
  assert.doesNotMatch(ld.slice(ld.indexOf('export function artisteLd')), /aggregateRating/);
  const s = read('src/lib/site.ts');
  assert.match(s, /lienArtistes\(s\.artistes \?\? \[\], s\.wording\.artistes\)/);
  assert.match(s, /lienFetes\(s\.fetes \?\? \[\], s\.wording\.fetes, isoDuJour\(\)\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadArtistesModule\(\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadFetesModule\(\)/);
});

test('docs : DIRECTIONS (coquilles artistes et fetes), INDEX (codée), fiches, CLAUDE.md, journal', () => {
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /^\| `artistes` \| \*\*Architecture `artistes-residents`\*\*/m);
  assert.match(d, /^\| `fetes` \| \*\*Architecture `calendrier-fetes`\*\*/m);
  const idx = read('docs/veille/architectures/INDEX.md');
  assert.match(idx, /^\| \[artistes-residents\]\(artistes-residents\.md\) \|.*\| oui \(25 oct\)/m);
  assert.match(idx, /^\| \[calendrier-fetes\]\(calendrier-fetes\.md\) \|.*\| oui \(25 oct\)/m);
  for (const f of ['artistes-residents', 'calendrier-fetes']) assert.match(read(`docs/veille/architectures/${f}.md`), /## Codée dans l'usine \(25 oct 2026\)/);
  assert.match(read('CLAUDE.md'), /`artistes` \(défaut `\[\]`, architecture `artistes-residents`/);
  assert.match(read('docs/veille/journal.md'), /## 25 oct 2026 : architectures \(2a ter\)/);
});

test('fumigène : architecture artistes-residents (FF_LOOK) sur _exemple (sans artiste) rend la maison, ni artiste ni page /artistes', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'artistes-residents' } }, '_test-archi-artistes-fum');
  try {
    const html = f.html();
    assert.match(html, /data-shell="artistes"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /<section id="contact" class="as-maison[\s\S]*?href="tel:\+33600000000"/);
    assert.doesNotMatch(html, /data-as-onglets|id="artiste-|href="\/artistes/, 'aucun artiste inventé');
    assert.ok(!f.existe('artistes.html') && !f.existe('artistes'));
    assert.ok(f.existe('a-propos.html') || f.existe('a-propos/index.html'));
  } finally {
    f.rm();
  }
});

test('fumigène : architecture calendrier-fetes (FF_LOOK) sur _exemple (sans fête) rend les occasions et la boutique, ni piste ni page /fetes', { timeout: 180_000 }, () => {
  const f = fumigene({ layout: { architecture: 'calendrier-fetes' } }, '_test-archi-fetes-fum');
  try {
    const html = f.html();
    assert.match(html, /data-shell="fetes"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /<section id="services" class="container-ff fe-occasions/);
    assert.match(html, /<section id="contact" class="fe-boutique[\s\S]*?href="tel:\+33600000000"/);
    assert.doesNotMatch(html, /data-fete-du-moment|id="livraison"|href="\/fetes/, 'aucune fête ni livraison inventée');
    assert.ok(!f.existe('fetes.html') && !f.existe('fetes'));
  } finally {
    f.rm();
  }
});
