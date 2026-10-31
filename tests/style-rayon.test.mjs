// Style construit « rayon » (veille du 31 oct 2026, tour 20, volet 2a quater, source blankinside.co.uk, fiche
// docs/veille/styles/rayon.md) : la construction relevée est codée (bandeau d'encre à bords pointillés et nom au centre,
// onglets soulignés, la gamme en étagères qu'on fait glisser au doigt, titres de rayons au feutre et flèche dessinée,
// étiquettes à contour, avis dans des cases, fin en trois tampons), modèle de site entier, profil de mouvement, coloré doux (bloc d'encre indigo).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');
const { rayonsDuSite, selectionDuSite, slugRayon } = await import(pathToFileURL(path.join(ROOT, 'src/lib/rayon.ts')).href);

const photo = (n) => ({ src: `/images/${n}.webp`, alt: n });
const base = {
  wording: { produits: 'La gamme', servicesTitle: 'Nos <em>rayons</em>' },
  produits: [
    { slug: 'comte', nom: 'Comté', categorie: 'Pâtes pressées', photo: photo('comte'), detoure: false, formats: ['24 mois'], prix: '29 € le kg' },
    { slug: 'crottin', nom: 'Crottin', categorie: 'Chèvres', photo: photo('crottin'), detoure: true, formats: [] },
    { slug: 'morbier', nom: 'Morbier', categorie: 'Pâtes pressées', photo: photo('morbier'), detoure: false, formats: [] },
    { slug: 'beurre', nom: 'Beurre', photo: photo('beurre'), detoure: false, formats: [] },
  ],
  services: [{ slug: 'plateaux', title: 'Plateaux', short: 'x', priceFrom: 'dès 8 €', image: photo('plateau') }],
};

test('rayonsDuSite : une famille de produits par rayon dans l’ordre, sans famille dans « La gamme », prestations en dernier', () => {
  const r = rayonsDuSite(base);
  assert.deepEqual(r.map((x) => x.titre), ['Pâtes pressées', 'Chèvres', 'La gamme', 'Nos rayons']);
  assert.deepEqual(r[0].articles.map((a) => a.href), ['/produits/comte', '/produits/morbier']);
  assert.equal(r[0].articles[0].format, '24 mois');
  assert.equal(r[0].articles[0].prix, '29 € le kg');
  assert.equal(r[1].articles[0].detoure, true);
  assert.equal(r[2].articles[0].etiquette, undefined, 'pas de famille inventée');
  assert.equal(r[3].prestations, true);
  assert.equal(r[3].articles[0].href, '/services/plateaux');
  assert.equal(r[3].articles[0].prix, 'dès 8 €');
  assert.equal(slugRayon('Pâtes molles et bleus'), 'pates-molles-et-bleus');
  assert.deepEqual(rayonsDuSite({ ...base, produits: [], services: [] }), [], 'rien sans donnée');
});

test('selectionDuSite : tour à tour dans chaque rayon de produits, n au plus ; sinon les prestations', () => {
  const r = rayonsDuSite(base);
  assert.deepEqual(selectionDuSite(r, 10).map((a) => a.cle), ['p-comte', 'p-crottin', 'p-beurre', 'p-morbier']);
  assert.equal(selectionDuSite(r, 2).length, 2);
  const sansProduit = rayonsDuSite({ ...base, produits: [] });
  assert.deepEqual(selectionDuSite(sansProduit).map((a) => a.cle), ['s-plateaux']);
});

test('EtagereRayon : piste au doigt sans autoplay, vedette, arrivée sous la classe du script, mouvement réduit', () => {
  const src = sansCommentaires(lire('src/components/EtagereRayon.astro'));
  assert.match(src, /overflow-x: auto/);
  assert.match(src, /scroll-snap-type: x proximity/);
  assert.match(src, /tabindex="0"/, 'piste atteignable au clavier');
  assert.match(src, /ra-plus/, 'le rond « + »');
  assert.match(src, /rayon-etiquette ra-marque/, 'étiquette de la grande case');
  assert.match(src, /cubic-bezier\(0, 0, 0\.3, 1\)/, 'courbe mesurée de la source');
  assert.match(src, /:global\(\.ra-attente\) \.ra-article \{ opacity: 0/);
  assert.match(src, /prefers-reduced-motion: reduce/);
  assert.match(src, /IntersectionObserver/);
  assert.match(src, /\(hover: hover\) and \(pointer: fine\)/);
  assert.doesNotMatch(src, /setInterval|autoplay|data-marquee/, 'rien ne tourne tout seul');
});

test('Nav/rayon et Hero/rayon : bandeau fixe, téléphone en haut, métier à la ville, onglets, première étagère', () => {
  const nav = sansCommentaires(lire('src/sections/Nav/rayon.astro'));
  assert.match(nav, /Commander par téléphone/);
  assert.match(nav, /href=\{tel\(\)\}/);
  assert.match(nav, /radial-gradient/, 'bords pointillés');
  assert.match(nav, /position: sticky/);
  assert.doesNotMatch(nav, /data-marquee|animation:/, 'le bandeau ne défile pas');
  const hero = sansCommentaires(lire('src/sections/Hero/rayon.astro'));
  assert.match(hero, /set:html=\{site\.business\.tagline\}/);
  assert.match(hero, /metierEtVille\(\)/);
  assert.match(hero, /href=\{tel\(\)\}/);
  assert.match(hero, /\{nbProduits > 0 && \(/, 'onglets seulement avec des produits');
  assert.match(hero, /href="\/produits"/);
  assert.match(hero, /<EtagereRayon articles=\{selection\}/);
  assert.ok(hero.indexOf('<EtagereRayon') < hero.indexOf('<h1'), 'la boutique d’abord, le h1 sous l’étagère');
});

test('Services/rayon : titre et métier à la ville, index en étiquettes, titres au feutre et flèche, vedette un rayon sur deux', () => {
  const src = sansCommentaires(lire('src/sections/Services/rayon.astro'));
  assert.match(src, /id="services"/);
  assert.match(src, /title=\{site\.wording\.servicesTitle\}/);
  assert.match(src, /metierEtVille\(\)/);
  assert.match(src, /class="rayon-etiquette"/);
  assert.match(src, /ra-feutre/);
  assert.match(src, /ra-fleche-dessinee/);
  assert.match(src, /vedette=\{i % 2 === 1\}/);
  const css = lire('src/directions/rayon/index.css');
  assert.match(css, /\[data-direction='rayon'\] \.ra-feutre \{ font-family: var\(--font-feutre\); \}/, 'le feutre seulement pour les titres de rayons');
});

test('Proof, About, Contact rayon : rien d’inventé, chaque bloc disparaît sans sa donnée, pas de formulaire', () => {
  const proof = sansCommentaires(lire('src/sections/Proof/rayon.astro'));
  assert.match(proof, /\{\(avis\.length > 0 \|\| google\) && \(/);
  assert.doesNotMatch(proof, /★|<Icon\b/);
  const about = sansCommentaires(lire('src/sections/About/rayon.astro'));
  assert.match(about, /id="about"/);
  assert.match(about, /\{a\.portrait && \(/);
  assert.match(about, /\{signature && /);
  const contact = sansCommentaires(lire('src/sections/Contact/rayon.astro'));
  assert.match(contact, /id="contact"/);
  assert.match(contact, /href=\{tel\(\)\}/);
  assert.match(contact, /\{adresse && \(/);
  assert.match(contact, /\{c\.orderUrl && /);
  assert.doesNotMatch(contact, /ContactForm|<form/);
});

test('presets/rayon.json : modèle de site entier sans communes, questions ni barre basse ; second modèle différent', () => {
  const m = JSON.parse(lire('presets/rayon.json'));
  assert.equal(m.nom, 'rayon');
  assert.equal(m.look.direction, 'rayon');
  assert.equal(m.look.layout.nav, 'rayon');
  assert.equal(m.look.layout.hero, 'rayon');
  assert.deepEqual(m.look.layout.sections.map((x) => `${x.type}/${x.variant}`), ['about/rayon', 'proof/rayon', 'services/rayon', 'contact/rayon']);
  for (const t of ['zones', 'faq', 'cta']) assert.ok(!m.look.layout.sections.some((x) => x.type === t), `pas de ${t}`);
  assert.equal(m.look.layout.actionBar, false);
  const b = JSON.parse(lire('presets/rayon-fromager.json'));
  assert.equal(b.look.direction, 'rayon');
  assert.notEqual(b.look.layout.hero, 'rayon');
  assert.notEqual(b.look.layout.nav, 'rayon');
});

test('direction rayon : Public Sans et Permanent Marker hors liste IA, pas de pilule, ombre dure, coloré doux', async () => {
  const css = lire('src/directions/rayon/index.css');
  const { POLICES_IA, estPoliceIa } = await import('../scripts/ff/ia.mjs');
  for (const fam of [...css.matchAll(/--font-(?:display|body|mono|feutre):\s*'([^']+)'/g)].map((x) => x[1])) {
    assert.ok(['Public Sans Variable', 'Permanent Marker'].includes(fam), fam);
    assert.ok(!estPoliceIa(fam) && !POLICES_IA.some((p) => fam.toLowerCase().startsWith(p)), fam);
  }
  assert.match(css, /--radius: 6px;/);
  assert.doesNotMatch(css, /999px|text-transform: uppercase/);
  assert.match(css, /--rayon-ombre: 2px 2px 0 var\(--fg\);/);
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  const atome = JSON.parse(lire('docs/veille/styles/atomes/rayon.json'));
  assert.equal(regimePalette(atome.couleurs).regime, 'colore-doux', 'le bloc d’encre indigo (bandeau) compte coloré doux');
});

test('profil de mouvement etagere-qui-se-remplit : calme, sans exigence, documenté, porté par l’atome', async () => {
  const { PROFILS_MOUVEMENT, refusProfil } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['etagere-qui-se-remplit'];
  assert.ok(p);
  assert.equal(p.calme, true);
  assert.deepEqual(p.exige, {});
  assert.equal(refusProfil('etagere-qui-se-remplit', { mouvement: 'calme', video: null, largeurMax: 0, avis: 0 }), null);
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `etagere-qui-se-remplit`/);
  assert.equal(JSON.parse(lire('docs/veille/styles/atomes/rayon.json')).mouvement.profil, 'etagere-qui-se-remplit');
});
