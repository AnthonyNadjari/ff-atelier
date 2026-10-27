// Architectures du 27 oct 2026, soir, tour 12 (veille, docs/veille/architectures/INDEX.md) : estimation-etapes (Movers,
// modèle de déménageur ; Déménagements Rigoulet, Gard ; Les Artisans du Bâtiment : le site commence par la demande
// d'estimation en étapes) et formules-comparees (Micka photographe, Le Mans ; GreenCraft : les formules nommées à prix
// côte à côte, chacune avec sa porte). Registre, mesures de donneesManquantes, schéma, modules purs
// (src/lib/estimation.ts, src/lib/formules.ts), formulaire en étapes, coquilles, pages, docs, et un fumigène de build par
// architecture sur sites/_exemple (sans questions ni formules : rien d'inventé).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadArchitecturesModule, loadSchemaModule, loadEstimationModule, loadFormulesModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const codeDe = (src) => src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const INTERDITS = /#[0-9a-fA-F]{3,8}\b|font-family|rounded-full|999px|uppercase|tracking-|[·—]|italic|eyebrow|text-shadow/;
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'Déménageur', tagline: 'Z', description: 'D' },
  contact: { phone: '+33612345678', phoneDisplay: '06 12 34 56 78', email: 'a@b.fr', address: { street: '1 rue A', postalCode: '49100', city: 'Angers' } },
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

const q = (nom, extra = {}) => ({ nom, libelle: `Question ${nom}`, ...extra });
const f = (slug, prix = '100 €', extra = {}) => ({ slug, nom: slug, prix, ...extra });

if (!tsImportable) {
  test('[ignoré] node ne sait pas type-stripper le TS ici', (t) => t.skip());
} else {
  test('registre estimation-etapes / formules-comparees : coquilles estimation et formules, sources, mesures', async () => {
    const { ARCHITECTURES, ARCHITECTURE_IDS, completerLayout } = await loadArchitecturesModule();
    for (const id of ['estimation-etapes', 'formules-comparees']) assert.ok(ARCHITECTURE_IDS.includes(id), id);
    const e = ARCHITECTURES['estimation-etapes'];
    assert.equal(e.layout.shell, 'estimation');
    assert.equal(e.layout.servicePage, 'fiche');
    assert.equal(e.layout.contactDrawer, false, 'la demande est en haut : pas de tiroir');
    assert.deepEqual(e.layout.sections, [{ type: 'proof', variant: 'testimonials' }, { type: 'services', variant: 'liste-a-filets' }]);
    assert.deepEqual(e.requis.map((x) => x.mesure), ['estimation', 'services', 'pasUrgence']);
    assert.equal(e.sources[0].site, 'movers.framer.media');
    assert.ok(e.sources.some((x) => x.site === 'demenagement-rigoulet.com'));
    const fo = ARCHITECTURES['formules-comparees'];
    assert.equal(fo.layout.shell, 'formules');
    assert.equal(fo.layout.contactDrawer, true);
    assert.deepEqual(fo.layout.sections.map((x) => x.type), ['proof', 'about', 'faq']);
    assert.deepEqual(fo.requis.map((x) => x.mesure), ['formules', 'pasUrgence']);
    assert.equal(fo.sources[0].site, 'micka-photographe.fr');
    assert.equal(completerLayout({ architecture: 'estimation-etapes' }).shell, 'estimation');
    assert.equal(completerLayout({ architecture: 'formules-comparees', shell: 'flow' }).shell, 'flow', 'un réglage du site gagne');
  });

  test('donneesManquantes : questions valides (choix à deux réponses, noms uniques), formules à prix, services, urgence', async () => {
    const { donneesManquantes } = await loadArchitecturesModule();
    const deux = { services: [{}, {}] };
    assert.deepEqual(donneesManquantes('estimation-etapes', { ...deux, estimation: { questions: [q('a'), q('b', { type: 'choix', choix: ['Oui', 'Non'] })] } }), []);
    const faux = [q('a'), q('a'), q('c', { type: 'choix', choix: ['Seul'] }), { nom: 'd', libelle: ' ' }];
    assert.match(donneesManquantes('estimation-etapes', { ...deux, estimation: { questions: faux } }).join(), /2 questions.*\(1 aujourd’hui\)/, 'doublon, choix sans deux réponses, sans libellé : ne comptent pas');
    assert.match(donneesManquantes('estimation-etapes', { services: [{}], estimation: { questions: [q('a'), q('b')] }, contact: { emergency24h: true } }).join(), /2 prestations[\s\S]*urgence/);
    assert.deepEqual(donneesManquantes('formules-comparees', { formules: { liste: [f('a'), f('b')] } }), []);
    assert.match(donneesManquantes('formules-comparees', { formules: { liste: [f('a'), f('a'), f('c', ' ')] } }).join(), /2 formules.*\(1 aujourd’hui\)/, 'slug en double, sans prix : ne comptent pas');
  });

  test('schema : estimation et formules (optionnels, décrits), wording, coquilles ; rien par défaut', async () => {
    const { defineSite, SHELLS } = await loadSchemaModule();
    assert.ok(SHELLS.includes('estimation') && SHELLS.includes('formules'));
    const vide = defineSite(minimal);
    assert.equal(vide.estimation, undefined, 'aucune question inventée');
    assert.equal(vide.formules, undefined, 'aucune formule inventée');
    assert.equal(vide.wording.estimation, 'Demander une estimation');
    assert.equal(vide.wording.formules, 'Les formules');
    assert.equal(vide.wording.disponibilite, 'Vérifier la disponibilité');
    const avec = defineSite({
      ...minimal,
      layout: { architecture: 'estimation-etapes' },
      estimation: { questions: [{ nom: 'depart', libelle: 'Ville de départ' }] },
      formules: { liste: [{ slug: 'a', nom: 'A', prix: '150 €' }] },
    });
    assert.equal(avec.layout.shell, 'estimation');
    assert.equal(avec.estimation.questions[0].type, 'texte');
    assert.equal(avec.estimation.questions[0].obligatoire, false, 'aucune réponse exigée par défaut');
    assert.equal(avec.estimation.promesse, undefined, 'aucune promesse inventée');
    assert.deepEqual(avec.estimation.apres, []);
    assert.equal(avec.formules.liste[0].conseillee, false, 'jamais « la plus demandée » d’office');
    assert.equal(avec.formules.liste[0].prixAutre, undefined);
    assert.deepEqual(avec.formules.liste[0].inclus, []);
    assert.throws(() => defineSite({ ...minimal, estimation: { questions: [{ nom: 'Ville départ', libelle: 'X' }] } }), 'clé en slug');
    assert.throws(() => defineSite({ ...minimal, formules: { liste: [{ slug: 'a', nom: 'A' }] } }), 'prix obligatoire');
    const schema = read('src/lib/schema.ts');
    assert.match(schema, /Jamais une question, une promesse ou un délai inventés\./);
    assert.match(schema, /Jamais un prix, un contenu ou une « plus demandée » inventés\./);
  });

  test('estimation (module pur) : questions valides, étapes, lien, projet lu dans l’URL, lignes de la demande', async () => {
    const E = await loadEstimationModule();
    const e = { questions: [q('depart'), q('logement', { type: 'choix', choix: ['Studio', 'Maison'] }), q('volume', { type: 'nombre', unite: 'm³' }), q('x', { type: 'choix', choix: ['Seul'] })] };
    assert.deepEqual(E.questionsValides(e).map((x) => x.nom), ['depart', 'logement', 'volume']);
    assert.deepEqual(E.etapesDe(e, 3), [{ n: 1, cle: 'projet' }, { n: 2, cle: 'questions' }, { n: 3, cle: 'coordonnees' }]);
    assert.deepEqual(E.etapesDe(e, 1), [{ n: 1, cle: 'questions' }, { n: 2, cle: 'coordonnees' }], 'une seule prestation : pas d’étape projet');
    assert.deepEqual(E.etapesDe(undefined, 1), [{ n: 1, cle: 'coordonnees' }]);
    assert.deepEqual(E.lienEstimation(e, 'Demander'), { href: '/estimation', label: 'Demander' });
    assert.equal(E.lienEstimation({ questions: [q('a')] }, 'D'), undefined, 'une question ne fait pas une page');
    assert.equal(E.projetDe('?projet=maison', ['maison', 'bureaux']), 'maison');
    assert.equal(E.projetDe('?projet=chateau', ['maison']), undefined, 'jamais une prestation inconnue');
    assert.deepEqual(E.lignesDeDemande({ 'q-depart': ' Rennes ', 'q-volume': '30', 'q-logement': '' }, E.questionsValides(e)), ['Question depart : Rennes', 'Question volume : 30 m³']);
  });

  test('formules (module pur) : formules complètes, reprises dépliées sans boucle, comparaison, lien, formule lue dans l’URL', async () => {
    const F = await loadFormulesModule();
    const liste = [f('a', '150 €', { inclus: ['Une heure', 'Galerie'] }), f('b', '290 €', { reprend: 'a', inclus: ['Groupe'] }), f('c', '490 €', { reprend: 'b', inclus: ['Soirée', 'Galerie'] }), f('d', ''), f('a', '1 €')];
    const ok = F.formulesCompletes({ liste });
    assert.deepEqual(ok.map((x) => x.slug), ['a', 'b', 'c'], 'sans prix ou slug en double : écartées');
    assert.equal(F.reprise(ok[2], ok).slug, 'b');
    assert.equal(F.reprise({ slug: 'z', nom: 'z', prix: '1', reprend: 'z' }, ok), undefined, 'une formule ne se reprend pas elle-même');
    assert.deepEqual(F.inclusDeplies(ok[2], ok), ['Soirée', 'Galerie', 'Groupe', 'Une heure']);
    const boucle = [f('x', '1', { reprend: 'y', inclus: ['X'] }), f('y', '2', { reprend: 'x', inclus: ['Y'] })];
    assert.deepEqual(F.inclusDeplies(boucle[0], boucle), ['X', 'Y'], 'une boucle de reprises s’arrête');
    const lignes = F.lignesComparees(ok);
    assert.deepEqual(lignes.map((l) => l.element), ['Une heure', 'Galerie', 'Groupe', 'Soirée']);
    assert.deepEqual(lignes[2].dans, [false, true, true]);
    assert.deepEqual(F.lienFormules({ liste }, 'Les formules'), { href: '/formules', label: 'Les formules' });
    assert.equal(F.lienFormules({ liste: [f('a')] }, 'L'), undefined);
    assert.equal(F.formuleDe('?formule=b', ['a', 'b']), 'b');
    assert.equal(F.formuleDe('?formule=q', ['a']), undefined);
  });
}

test('formulaire en étapes (ContactForm) : projet en cases, questions du client, coordonnées, Suivant / Retour, tout visible sans script ; formule choisie', () => {
  const src = read('src/components/ContactForm.astro');
  assert.match(src, /etapes\?: boolean; projet\?: string; formule\?: string/);
  assert.match(src, /data-etapes=\{enEtapes \? String\(etapes\.length\) : undefined\}/);
  assert.match(src, /type="radio" name="service" value=\{sv\.title\} checked=\{sv\.slug === projet\} data-projet=\{sv\.slug\}/);
  assert.match(src, /name=\{`q-\$\{q\.nom\}`\}/);
  assert.match(src, /data-etape-suivant/);
  assert.match(src, /data-etape-retour/);
  assert.match(src, /<div class="ff-etape-nav" data-etape-nav hidden>/, 'Suivant et Retour cachés tant que le script n’a pas tourné');
  assert.match(src, /`Étape \$\{k \+ 1\} sur \$\{etapes\.length\}`/);
  assert.match(src, /get\('projet'\)/, '?projet= coche la prestation');
  assert.match(src, /data\.message = \[\.\.\.reponses, '', data\.message \?\? ''\]/, 'les réponses rejoignent le message pour tous les fournisseurs');
  assert.match(src, /selected=\{x\.nom === formuleChoisie\}/);
  const style = src.slice(src.lastIndexOf('<style>'));
  assert.doesNotMatch(codeDe(style), INTERDITS);
  assert.match(read('scripts/ff/verifier.mjs'), /data-etapes=/, 'un formulaire en étapes ne compte pas ses champs d’un bloc');
});

test('coquille estimation : h1, métier à ville, tel:, note ; la demande en étapes en section propre sous l’en-tête ; dépôt et communes ; tokens', () => {
  const code = codeDe(read('src/shells/estimation.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\} class="es-tel/);
  assert.match(code, /<section id="estimation" class="es-bande"/);
  assert.match(code, /<ContactForm compact etapes=\{enEtapes\} idPrefix="estimation" \/>/);
  assert.ok(code.indexOf('id="hero"') < code.indexOf('id="estimation"') && code.indexOf('id="estimation"') < code.indexOf('id="depot"'), 'en-tête, demande, dépôt');
  assert.match(code, /<Horaires \/>/);
  assert.match(code, /href=\{`\/services\/\$\{x\.slug\}`\}/);
  assert.match(code, /<Footer \/>/);
  assert.match(code, /sections\.map\(/);
  assert.doesNotMatch(code, INTERDITS);
});

test('coquille formules : h1, tel:, note ; formules côte à côte (piste au téléphone), reprise, porte vers la page ; « la plus demandée » seulement si dite ; contact ; tokens', () => {
  const code = codeDe(read('src/shells/formules.astro'));
  assert.equal((code.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(code, /metierEtVille\(\)/);
  assert.match(code, /href=\{tel\(\)\} class="fo-tel/);
  assert.match(code, /<section id="formules" class="fo-bloc"/);
  assert.match(code, /scroll-snap-type: x mandatory/);
  assert.match(code, /repriseDeFormule\(x, formules\)/);
  assert.match(code, /\{x\.conseillee && <p class="fo-mention">La plus demandée<\/p>\}/);
  assert.match(code, /href=\{`\/formules\/\$\{x\.slug\}#demande`\}/);
  assert.match(code, /<section id="contact" class="container-ff fo-appel"/);
  assert.match(code, /<Footer \/>/);
  assert.match(code, /sections\.map\(/);
  assert.doesNotMatch(code, INTERDITS);
});

test('pages /estimation, /formules, /formules/<slug> : générées seulement avec leurs données ; porte réglée sur la prestation ; nav', () => {
  const es = read('src/pages/estimation/[...index].astro');
  assert.match(es, /lienEstimation\(site\.estimation, site\.wording\.estimation\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(es, /<ContactForm etapes /);
  assert.match(es, /href=\{tel\(\)\}/);
  const fo = read('src/pages/formules/[...index].astro');
  assert.match(fo, /lienFormules\(site\.formules, site\.wording\.formules\) \? \[\{ params: \{ index: undefined \} \}\] : \[\]/);
  assert.match(fo, /\{d \? 'Compris' : 'Non'\}/, 'la comparaison en mots, jamais en coches');
  const une = read('src/pages/formules/[slug].astro');
  assert.match(une, /formulesCompletes\(site\.formules\)\.map\(\(x\) => \(\{ params: \{ slug: x\.slug \}/);
  assert.match(une, /<section id="demande"/);
  assert.match(une, /<ContactForm compact formule=\{x\.slug\}/);
  for (const p of ['src/pages/estimation/[...index].astro', 'src/pages/formules/[...index].astro', 'src/pages/formules/[slug].astro']) assert.doesNotMatch(codeDe(read(p)), INTERDITS, p);
  const svc = read('src/pages/services/[slug].astro');
  assert.match(svc, /href=\{`\/estimation\?projet=\$\{service\.slug\}`\}/);
  const s = read('src/lib/site.ts');
  assert.match(s, /lienEstimation\(s\.estimation, s\.wording\.estimation\)/);
  assert.match(s, /lienFormules\(s\.formules, s\.wording\.formules\)/);
  assert.match(s, /s\.layout\.shell === 'estimation' && s\.servicePages/, 'la nav de la demande nomme les prestations en pages');
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadEstimationModule\(\)/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadFormulesModule\(\)/);
  assert.match(read('scripts/ff/composer.mjs'), /'estimation', 'formules'[,\]]/);
});

test('docs : DIRECTIONS (coquilles estimation et formules), INDEX (codées), fiches, CLAUDE.md', () => {
  const d = read('docs/DIRECTIONS.md');
  assert.match(d, /^\| `estimation` \| \*\*Architecture `estimation-etapes`\*\*/m);
  assert.match(d, /^\| `formules` \| \*\*Architecture `formules-comparees`\*\*/m);
  const idx = read('docs/veille/architectures/INDEX.md');
  assert.match(idx, /^\| \[estimation-etapes\]\(estimation-etapes\.md\) \|.*\| oui \(27 oct, soir\) \|$/m);
  assert.match(idx, /^\| \[formules-comparees\]\(formules-comparees\.md\) \|.*\| oui \(27 oct, soir\) \|$/m);
  for (const fiche of ['estimation-etapes', 'formules-comparees']) {
    const t = read(`docs/veille/architectures/${fiche}.md`);
    assert.match(t, /## Codée dans l'usine \(27 oct 2026, soir\)/);
    assert.match(t, /\]\(https:\/\//, 'sources citées en lien');
  }
  assert.match(read('CLAUDE.md'), /`estimation` \(optionnel, architecture `estimation-etapes`/);
});

test('fumigène : architecture estimation-etapes (FF_LOOK) sur _exemple (sans questions) rend l’en-tête, le formulaire ordinaire et le dépôt, pas d’étapes ni de /estimation', { timeout: 180_000 }, () => {
  const fx = fumigene({ layout: { architecture: 'estimation-etapes' } }, '_test-archi-estimation-fum');
  try {
    const html = fx.html();
    assert.match(html, /data-shell="estimation"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="es-tel/);
    assert.match(html, /<section id="estimation"/);
    assert.doesNotMatch(html, /data-etapes=|data-etape-suivant/, 'aucune question inventée : formulaire ordinaire');
    assert.match(html, /<section id="depot"/);
    assert.equal(fx.existe('estimation.html') || fx.existe('estimation/index.html'), false);
  } finally {
    fx.rm();
  }
});

test('fumigène : architecture formules-comparees (FF_LOOK) sur _exemple (sans formules) rend l’en-tête, pas de formules ni de /formules', { timeout: 180_000 }, () => {
  const fx = fumigene({ layout: { architecture: 'formules-comparees' } }, '_test-archi-formules-fum');
  try {
    const html = fx.html();
    assert.match(html, /data-shell="formules"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /href="tel:\+33600000000" class="fo-tel/);
    assert.doesNotMatch(html, /id="formules"|<ol class="fo-piste"|La plus demandée/, 'aucune formule inventée');
    assert.equal(fx.existe('formules.html') || fx.existe('formules/index.html'), false);
  } finally {
    fx.rm();
  }
});
