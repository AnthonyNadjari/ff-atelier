// Architectures du 31 oct 2026, tour 21 (veille, docs/veille/architectures/INDEX.md) : sessions-places (MAP Moto-Auto-Pédagogie :
// le site d'une auto-école est son guichet des sessions datées à places comptées) et forfaits-atelier (Garage de la Route
// Nationale, Garage de la République : le site d'un garage est son comptoir de forfaits, « ce prix comprend », prix par gabarit).
// Registre, mesures de donneesManquantes, schéma, modules purs (src/lib/sessions.ts, src/lib/forfaits.ts), coquilles, pages, nav,
// modèle de navigation « comptoir de forfaits » de ff ressemblance, docs, et un fumigène de build sur sites/_exemple (sans
// données : rien d'inventé).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadArchitecturesModule, loadSchemaModule, loadSessionsModule, loadForfaitsModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';
import { modeleNavigation, MODELES } from '../scripts/ff/deroule.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const codeDe = (src) => src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const INTERDITS = /#[0-9a-fA-F]{3,8}\b|font-family|rounded-full|999px|uppercase|tracking-|[·—]|italic|eyebrow|text-shadow/;
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'Auto-école', tagline: 'Z', description: 'D' },
  contact: { phone: '+33612345678', phoneDisplay: '06 12 34 56 78', email: 'a@b.fr', address: { postalCode: '74000', city: 'Annecy' } },
  services: [{ slug: 's', title: 'T', short: 'S' }],
  about: { story: 'S' },
};
const fo = (slug, extra = {}) => ({ slug, nom: slug.toUpperCase(), ...extra });
const formations = [
  fo('b', { categorie: 'Voiture', prix: '980 €' }),
  fo('b78', { categorie: 'voiture', sessions: [{ debut: '2099-12-16', places: 4 }, { debut: '2099-11-25', places: 1 }, { debut: '2000-01-01' }] }),
  fo('code', { categorie: 'Code', sessions: [{ debut: '2099-11-03', fin: '2099-11-05', places: 0 }] }),
  fo('libre'),
  fo('b', { nom: 'doublon' }),
  { slug: '', nom: 'sans slug' },
];
const fa = (slug, extra = {}) => ({ slug, nom: slug.toUpperCase(), ...extra });
const forfaits = [
  fa('vidange', { famille: 'Entretien', prix: '99 €', tarifs: [{ gabarit: 'Citadine', prix: '99 €' }, { gabarit: 'Berline', prix: '119 €' }], rendezVous: 'sans' }),
  fa('distribution', { famille: 'entretien', prix: '399 €', rendezVous: 'sur' }),
  fa('lavage', { famille: 'Soins', tarifs: [{ gabarit: 'Citadine', prix: '25 €' }] }),
  fa('plaquettes', { famille: 'Freinage', prix: '59 €', rendezVous: 'sans' }),
  fa('sansprix'),
  fa('vidange', { prix: '1 €' }),
];

if (!tsImportable) {
  test('[ignoré] node ne sait pas type-stripper le TS ici', (t) => t.skip());
} else {
  test('registre : sessions-places (coquille sessions) et forfaits-atelier (coquille forfaits), sources, mesures', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, completerLayout } = await loadArchitecturesModule();
    for (const [id, shell, sources, mesures] of [['sessions-places', 'sessions', ['moto-auto-ecole.com'], ['formations', 'sessions']], ['forfaits-atelier', 'forfaits', ['garagedelaroutenationale.fr', 'garagedelarepublique38.fr'], ['forfaits']]]) {
      assert.ok(ARCHITECTURE_IDS.includes(id));
      const a = ARCHITECTURES[id];
      assert.equal(a.layout.shell, shell);
      assert.equal(a.layout.footer, 'liens');
      assert.deepEqual(a.layout.sections, [], 'la coquille rend tout');
      assert.deepEqual(a.requis.map((x) => x.mesure), mesures);
      assert.deepEqual(a.sources.map((x) => x.site), sources);
      assert.equal(completerLayout({ architecture: id }).shell, shell);
    }
  });

  test('donneesManquantes : formations, sessions à venir, forfaits à prix ; photos', async () => {
    const { donneesManquantes, photosDuClient } = await loadArchitecturesModule();
    assert.deepEqual(donneesManquantes('sessions-places', { formations: { liste: formations } }), []);
    const m = donneesManquantes('sessions-places', { formations: { liste: [fo('a'), fo('b', { sessions: [{ debut: '2000-01-01' }] })] } }).join(' | ');
    assert.match(m, /3 formations.*\(2 aujourd’hui\)/);
    assert.match(m, /2 sessions.*\(0 aujourd’hui\)/, 'une session passée ne compte pas');
    assert.deepEqual(donneesManquantes('forfaits-atelier', { forfaits: { liste: forfaits } }), []);
    assert.match(donneesManquantes('forfaits-atelier', { forfaits: { liste: forfaits.slice(1, 5) } }).join(), /4 forfaits.*\(3 aujourd’hui\)/, 'sans prix ou doublon écartés');
    assert.equal(photosDuClient({ formations: { liste: [{ photo: {} }] }, forfaits: { liste: [{ photo: {} }, {}] } }), 2);
  });

  test('schéma : formations et forfaits (optionnels, décrits), wording, coquilles ; rien par défaut', async () => {
    const { defineSite, SHELLS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('sessions') && SHELLS.includes('forfaits'));
    const vide = defineSite(minimal);
    assert.equal(vide.formations, undefined, 'aucune formation inventée');
    assert.equal(vide.forfaits, undefined, 'aucun forfait inventé');
    assert.equal(vide.wording.formations, 'Les formations');
    assert.equal(vide.wording.forfaits, 'Nos forfaits');
    const s = defineSite({ ...minimal, layout: { architecture: 'sessions-places' }, formations: { liste: [{ slug: 'a', nom: 'A', sessions: [{ debut: '2099-01-02' }] }] } });
    assert.equal(s.layout.shell, 'sessions');
    assert.equal(s.formations.liste[0].prix, undefined, 'aucun prix inventé');
    assert.equal(s.formations.liste[0].sessions[0].places, undefined, 'aucune place inventée');
    assert.throws(() => defineSite({ ...minimal, formations: { liste: [{ slug: 'a', nom: 'A', sessions: [{ debut: '2 janvier' }] }] } }), 'date AAAA-MM-JJ');
    const f = defineSite({ ...minimal, layout: { architecture: 'forfaits-atelier' }, forfaits: { liste: [{ slug: 'v', nom: 'V', prix: '9 €' }] } });
    assert.equal(f.layout.shell, 'forfaits');
    assert.equal(f.forfaits.pret, undefined, 'aucun véhicule de prêt promis');
    assert.equal(f.forfaits.liste[0].rendezVous, undefined);
    assert.throws(() => defineSite({ ...minimal, forfaits: { liste: [{ slug: 'v', nom: 'V', rendezVous: 'peut-être' }] } }));
    const src = read('src/lib/schema.ts');
    assert.match(src, /Jamais une formation, une date, un prix ou un nombre de places inventés\./);
    assert.match(src, /Jamais un prix, une pièce comprise, un gabarit ou un véhicule de prêt inventés\./);
  });

  test('sessions (module pur) : complètes, à venir triées, places en mots, dates, catégories, lien', async () => {
    const S = await loadSessionsModule();
    assert.deepEqual(S.formationsCompletes(formations).map((f) => f.slug), ['b', 'b78', 'code', 'libre']);
    const v = S.sessionsAVenir(formations, '2050-01-01');
    assert.deepEqual(v.map((x) => [x.formation.slug, x.session.debut]), [['code', '2099-11-03'], ['b78', '2099-11-25'], ['b78', '2099-12-16']], 'passée retirée, du plus proche au plus loin');
    assert.equal(S.sessionsAVenir(formations, '2099-11-04')[0].formation.slug, 'code', 'une session en cours reste jusqu’à son dernier jour');
    assert.deepEqual(S.sessionsDe(formations[1], '2050-01-01').map((x) => x.debut), ['2099-11-25', '2099-12-16']);
    assert.equal(S.placesEnMots(0), 'Complet');
    assert.equal(S.placesEnMots(1), 'Plus qu’une place');
    assert.equal(S.placesEnMots(4), '4 places');
    assert.equal(S.placesEnMots(undefined), '', 'absent = rien, jamais deviné');
    assert.equal(S.dateDeSession({ debut: '2026-11-25' }).court, 'mer. 25 nov.');
    assert.equal(S.dateDeSession({ debut: '2026-11-25' }).long, 'mercredi 25 novembre 2026');
    assert.equal(S.dateDeSession({ debut: '2026-11-03', fin: '2026-11-05' }).court, 'du 3 au 5 nov.');
    assert.equal(S.dateDeSession({ debut: '2026-06-30', fin: '2026-07-02' }).court, 'du 30 juin au 2 juil.');
    assert.equal(S.dateDeSession({ debut: '2026-11-01' }).long, 'dimanche 1er novembre 2026');
    assert.deepEqual(S.parCategorie(formations).map((g) => [g.categorie, g.formations.map((f) => f.slug)]), [['Voiture', ['b', 'b78']], ['Code', ['code']], ['Autres formations', ['libre']]]);
    assert.deepEqual(S.lienFormations(formations, 'Les formations'), { href: '/formations', label: 'Les formations' });
    assert.equal(S.lienFormations(formations.slice(0, 2), 'F'), undefined);
  });

  test('forfaits (module pur) : complets, gabarits utilisés, prix par gabarit, files, autres, lien', async () => {
    const F = await loadForfaitsModule();
    assert.deepEqual(F.forfaitsComplets(forfaits).map((f) => f.slug), ['vidange', 'distribution', 'lavage', 'plaquettes']);
    assert.deepEqual(F.gabaritsUtilises(['Citadine', 'Berline', 'Monospace', 'citadine'], forfaits), ['Citadine', 'Berline'], 'un gabarit sans prix disparaît');
    assert.equal(F.prixPour(forfaits[0], 'Berline'), '119 €');
    assert.equal(F.prixPour(forfaits[0], 'Monospace'), '99 €', 'gabarit non cité : le prix unique');
    assert.equal(F.prixPour(forfaits[2], 'Berline'), '', 'aucun prix : rien, jamais deviné');
    const r = F.parRendezVous(forfaits);
    assert.deepEqual([r.sans.map((f) => f.slug), r.sur.map((f) => f.slug), r.autres.map((f) => f.slug)], [['vidange', 'plaquettes'], ['distribution'], ['lavage']]);
    assert.deepEqual(F.autresForfaits(forfaits, 'vidange').map((f) => f.slug), ['distribution', 'lavage', 'plaquettes'], 'même famille d’abord');
    assert.deepEqual(F.lienForfaits(forfaits, 'Nos forfaits'), { href: '/forfaits', label: 'Nos forfaits' });
    assert.equal(F.lienForfaits(forfaits.slice(1, 5), 'F'), undefined);
  });
}

test('coquille sessions : h1, téléphone ; billet qui déborde ; billets en piste ; places ; sessions passées retirées ; tokens', () => {
  const code = codeDe(read('src/shells/sessions.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\} class="se-tel/);
  assert.match(code, /sessionsAVenir\(formations\)/);
  assert.match(code, /placesEnMots\(s\.places\)/);
  assert.match(code, /<time datetime=\{s\.debut\}/);
  assert.match(code, /data-se-fin=/, 'la session passée tombe dans le navigateur');
  assert.match(code, /\.se-prochaine \{ position: absolute;[^}]*inset-block-end: -4\.5rem/, 'le billet déborde du premier écran');
  assert.match(code, /\.se-grille \{ display: grid; grid-auto-flow: column;[^}]*scroll-snap-type: x mandatory/);
  assert.ok(code.indexOf('id="hero"') < code.indexOf('id="sessions"') && code.indexOf('id="sessions"') < code.indexOf('id="formations"') && code.indexOf('id="formations"') < code.indexOf('id="avis"') && code.indexOf('id="avis"') < code.indexOf('id="contact"'));
  assert.doesNotMatch(code, /Acheter|panier|role="tab"|id="services"|id="faq"/, 'aucun paiement, aucun bloc d’usine');
  assert.match(code, /<Footer \/>/);
  assert.doesNotMatch(code, INTERDITS);
});

test('coquille forfaits : h1, téléphone ; « Votre voiture ? » ; tickets « Ce prix comprend » ; barre collée ; deux files ; tokens', () => {
  const code = codeDe(read('src/shells/forfaits.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\} class="fa-tel/);
  assert.match(code, /<legend class="fa-legende">Votre voiture&nbsp;\?<\/legend>/);
  assert.match(code, /type="radio" name="fa-gabarit"/);
  assert.match(code, /Ce prix comprend/);
  assert.match(code, /\.fa-entete \{ position: sticky; inset-block-start: 72px;/, 'la barre du comptoir reste collée');
  assert.match(code, /\.fa-pg \{ position: relative;/, 'l’étiquette masquée reste dans la piste (sinon la page déborde au téléphone)');
  assert.match(code, /forfaitsParRendezVous\(forfaits\)/);
  assert.ok(code.indexOf('id="hero"') < code.indexOf('id="forfaits"') && code.indexOf('id="forfaits"') < code.indexOf('id="venir"') && code.indexOf('id="venir"') < code.indexOf('id="avis"') && code.indexOf('id="avis"') < code.indexOf('id="contact"'));
  assert.doesNotMatch(code, /role="tab"|id="services"|id="faq"/);
  assert.match(code, /<Footer \/>/);
  assert.doesNotMatch(code, INTERDITS);
});

test('pages /formations, /forfaits et leurs fiches : générées seulement avec leurs données ; questions ; nav ; composer', () => {
  assert.match(read('src/pages/formations/[...index].astro'), /lienFormations\(site\.formations\?\.liste, site\.wording\.formations\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(read('src/pages/formations/[slug].astro'), /formationsCompletes\(site\.formations\?\.liste\)\.map\(\(f\) => \(\{ params: \{ slug: f\.slug \}/);
  assert.match(read('src/pages/forfaits/[...index].astro'), /lienForfaits\(site\.forfaits\?\.liste, site\.wording\.forfaits\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(read('src/pages/forfaits/[slug].astro'), /forfaitsComplets\(site\.forfaits\?\.liste\)\.map\(\(f\) => \(\{ params: \{ slug: f\.slug \}/);
  for (const p of ['src/pages/formations/[...index].astro', 'src/pages/forfaits/[...index].astro']) assert.match(read(p), /site\.faq\.length > 0 && \(/, p);
  for (const p of ['src/pages/formations/[...index].astro', 'src/pages/formations/[slug].astro', 'src/pages/forfaits/[...index].astro', 'src/pages/forfaits/[slug].astro']) assert.doesNotMatch(codeDe(read(p)), INTERDITS, p);
  const s = read('src/lib/site.ts');
  assert.match(s, /lienFormations\(s\.formations\?\.liste, s\.wording\.formations\)/);
  assert.match(s, /lienForfaits\(s\.forfaits\?\.liste, s\.wording\.forfaits\)/);
  assert.match(s, /s\.layout\.shell === 'sessions' \|\| s\.layout\.shell === 'forfaits'/);
  const l = read('scripts/ff/ts-loader.mjs');
  assert.match(l, /export async function loadSessionsModule\(\)/);
  assert.match(l, /export async function loadForfaitsModule\(\)/);
  assert.match(read('scripts/ff/composer.mjs'), /'sessions', 'forfaits'[,\]]/);
});

test('ff ressemblance : modèle de navigation « comptoir de forfaits »', () => {
  assert.ok(MODELES.includes('comptoir de forfaits'));
  assert.equal(modeleNavigation({ tickets: 6, annuaire: true, pagesLiees: 3, pagesContenu: 9, ecrans: 5 }), 'comptoir de forfaits', 'avant l’annuaire');
  assert.equal(modeleNavigation({ tickets: 3, pagesLiees: 3, pagesContenu: 9, ecrans: 5 }), 'plusieurs pages', 'trois tickets ne font pas un comptoir');
  assert.equal(modeleNavigation({ partDeparts: 0.3, tickets: 6 }), 'tableau des départs', 'les modèles d’avant restent prioritaires');
  assert.match(read('scripts/ff/deroule.mjs'), /\/comprend\/i\.test\(li\.textContent/);
});

test('docs : DIRECTIONS (coquilles), INDEX (codées), fiches et captures, CLAUDE.md', () => {
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /^\| `sessions` \| \*\*Architecture `sessions-places`\*\*/m);
  assert.match(d, /^\| `forfaits` \| \*\*Architecture `forfaits-atelier`\*\*/m);
  const idx = read('docs/veille/architectures/INDEX.md');
  for (const id of ['sessions-places', 'forfaits-atelier']) {
    assert.match(idx, new RegExp(`^\\| \\[${id}\\]\\(${id}\\.md\\) \\|.*\\| oui \\(31 oct\\) \\|$`, 'm'), id);
    const t = read(`docs/veille/architectures/${id}.md`);
    assert.match(t, /## Codée dans l'usine \(31 oct 2026\)/);
    assert.match(t, /\]\(https:\/\//);
    for (const c of ['source', 'essai']) assert.ok(fs.existsSync(path.join(ROOT, `docs/veille/architectures/captures/${id}-${c}.jpg`)), `${id} ${c}`);
  }
  const c = read('CLAUDE.md');
  assert.match(c, /`formations` \(optionnel, architecture `sessions-places`/);
  assert.match(c, /`forfaits` \(optionnel, architecture `forfaits-atelier`/);
});

for (const [id, shell, absents, pages] of [['sessions-places', 'sessions', /id="sessions"|id="formations"/, 'formations'], ['forfaits-atelier', 'forfaits', /id="forfaits"|id="venir"/, 'forfaits']]) {
  test(`fumigène : architecture ${id} (FF_LOOK) sur _exemple (sans données) rend le h1, l’appel et la demande, rien d’inventé`, { timeout: 180_000 }, () => {
    const astroJs = path.join(ROOT, 'node_modules', 'astro', 'astro.js');
    const outDir = `dist/_test-archi-${shell}-fum`;
    const res = spawnSync(process.execPath, [astroJs, 'build'], { cwd: ROOT, encoding: 'utf8', timeout: 170_000, env: { ...process.env, SITE: '_exemple', FF_LOOK: JSON.stringify({ layout: { architecture: id } }), FF_OUT: outDir } });
    if (res.status !== 0) console.log(res.stdout, res.stderr);
    assert.equal(res.status, 0, 'le build a echoue');
    const dir = path.join(ROOT, outDir);
    try {
      const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
      assert.match(html, new RegExp(`data-shell="${shell}"`));
      assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
      assert.match(html, /href="tel:\+33600000000"/);
      assert.match(html, /id="contact"/);
      assert.doesNotMatch(html, absents, 'aucune donnée inventée');
      assert.equal(fs.existsSync(path.join(dir, `${pages}.html`)) || fs.existsSync(path.join(dir, `${pages}/index.html`)), false);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
}
