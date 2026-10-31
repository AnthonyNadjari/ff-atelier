// Style construit « etabli » (veille du 31 oct 2026, tour 20, volet 2a quater, source agronomywork.shop, fiche
// docs/veille/styles/etabli.md) : la construction relevée est codée (premier écran = la fiche de l'objet phare sur trois
// tiers, fiche collée à côté des photos de côté alterné, escalier des questions qui se range au milieu de la gamme, nom géant
// sur la photo de fin, vignettes de toutes les pièces), modèle de site entier, profil de mouvement, régime clair neutre.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');

test('src/lib/etabli.ts : fiches = produits puis services, rien de deviné, objet phare = première fiche à photo', async () => {
  const { fichesEtabli, ficheEnTete, vuesDeFiche, volees } = await import('../src/lib/etabli.ts');
  const photo = { src: '/images/a.webp', alt: 'a' };
  const site = {
    produits: [
      { slug: 'sans-photo-de-trop', nom: 'Pliant', photo, detoure: true, formats: ['Corne'], photos: [{ src: '/images/b.webp', alt: 'b' }, photo] },
      { slug: 'chef', nom: 'Chef', photo: { src: '/images/c.webp', alt: 'c' }, detoure: false, formats: [], photos: [], prix: '160 €' },
    ],
    services: [
      { slug: 'affutage', title: 'Affûtage', short: 'Phrase.', images: [] },
      { slug: '_cache', title: 'Caché', short: 'x', images: [] },
    ],
  };
  const f = fichesEtabli(site);
  assert.deepEqual(f.map((x) => x.href), ['/produits/sans-photo-de-trop', '/produits/chef', '/services/affutage']);
  assert.equal(f[0].prix, undefined, 'pas de prix inventé');
  assert.equal(f[1].prix, '160 €');
  assert.equal(f[2].photo, undefined, 'pas de photo inventée');
  assert.equal(f[2].genre, 'service');
  assert.equal(ficheEnTete(f), f[0]);
  assert.equal(ficheEnTete([f[2]]), undefined);
  assert.deepEqual(vuesDeFiche(f[0]).map((v) => v.src), ['/images/a.webp', '/images/b.webp'], 'sans doublon');
  assert.deepEqual(volees([1, 2, 3, 4, 5, 6, 7], 5), [[1, 2, 3, 4, 5], [6, 7]]);
});

test('Hero/etabli et FicheEtabli : titre, métier à ville, téléphone, fiche sans panier, objet collé au téléphone', () => {
  const hero = sansCommentaires(lire('src/sections/Hero/etabli.astro'));
  assert.match(hero, /id="hero"/);
  assert.match(hero, /set:html=\{site\.business\.tagline\}/);
  assert.match(hero, /metierEtVille\(\)/, 'métier et ville (GOUT § 0)');
  assert.match(hero, /href=\{tel\(\)\}/, 'téléphone au premier écran même sans fiche');
  assert.match(hero, /ficheEnTete\(fiches\)/);
  assert.match(hero, /\{google && \(/, 'note Google seulement si elle existe');
  assert.match(hero, /position: sticky/, 'au téléphone, l’objet colle sous la barre');
  assert.match(hero, /repeat\(3, minmax\(0, 1fr\)\)/, 'trois tiers à l’ordinateur');
  assert.match(hero, /prefers-reduced-motion: no-preference/, 'entrée seulement sans mouvement réduit');
  const fiche = sansCommentaires(lire('src/components/FicheEtabli.astro'));
  assert.match(fiche, /\{fiche\.prix && /, 'prix seulement s’il est donné');
  assert.match(fiche, /etabli-prix/, 'prix encadré');
  assert.match(fiche, /\{fiche\.formats\.length > 0 && \(/);
  assert.match(fiche, /site\.contact\.orderUrl/, 'Commander seulement avec le lien du client');
  assert.match(fiche, /href=\{tel\(\)\}/, 'sinon Appeler');
  assert.match(fiche, /porte === 'forte' && \(commande/, 'bouton plein seulement pour la porte forte');
  assert.match(hero, /porte="forte"/, 'la seule porte forte est au premier écran');
  assert.match(fiche, /onPage\(/, 'script enveloppé dans onPage');
  assert.doesNotMatch(fiche, /panier|Ajouter au panier|paiement/i, 'aucun panier ni paiement');
  assert.doesNotMatch(hero + fiche, /·|—/, 'ni point médian ni tiret cadratin');
});

test('Services/etabli et RangEtabli : fiche collée, côtés alternés, escalier au milieu sans section faq', () => {
  const svc = sansCommentaires(lire('src/sections/Services/etabli.astro'));
  assert.match(svc, /id="services"/);
  assert.match(svc, /i % 2 === 0/, 'côtés alternés');
  assert.match(svc, /!site\.layout\.sections\.some\(\(x\) => x\.type === 'faq'\)/, 'escalier seulement sans section faq');
  assert.match(svc, /<EscalierEtabli \/>/);
  assert.match(svc, /rangs\.slice\(2\)/, 'au-delà de deux rangées, rang serré');
  assert.match(svc, /scroll-snap-type: x mandatory/, 'piste au doigt au téléphone');
  assert.doesNotMatch(svc, /btn-primary/, 'aucune barre pleine sous les pièces');
  assert.match(svc, /display: contents/, 'les deux moitiés et l’escalier sont des blocs de la page');
  const rang = sansCommentaires(lire('src/components/RangEtabli.astro'));
  assert.match(rang, /\.etabli-rang-colle \{ position: sticky;/, 'la fiche colle à l’ordinateur');
  assert.match(rang, /\{ambiance && \(/, 'photo d’ambiance seulement si la pièce en a une');
  assert.match(rang, /fiche-a-droite/);
});

test('Faq/etabli : l’escalier collant, piste au téléphone, JSON-LD, rien sans question', () => {
  const faq = sansCommentaires(lire('src/sections/Faq/etabli.astro'));
  assert.match(faq, /id="faq"/);
  assert.match(faq, /\{site\.faq\.length > 0 && \(/);
  const esc = sansCommentaires(lire('src/components/EscalierEtabli.astro'));
  assert.match(esc, /calc\(var\(--i\) \* var\(--marche\)/, 'une marche par question');
  assert.match(esc, /\.etabli-colle \{ position: sticky;/);
  assert.match(esc, /scroll-snap-type: x mandatory/, 'piste au doigt au téléphone');
  assert.match(esc, /FAQPage/);
  assert.match(esc, /\{q\.photo && \(/, 'photo seulement si la galerie en a une de ce rang');
  assert.doesNotMatch(esc, /autoplay|setInterval/, 'rien ne défile tout seul');
});

test('Proof, Contact, Nav etabli : avis seulement s’il y en a, nom géant, pas de formulaire, téléphone en haut', () => {
  const proof = sansCommentaires(lire('src/sections/Proof/etabli.astro'));
  assert.match(proof, /id="proof"/);
  assert.match(proof, /\{\(avis\.length > 0 \|\| google\) && \(/);
  assert.match(proof, /tabindex="0"/, 'piste atteignable au clavier');
  assert.match(proof, /var\(--matiere/, 'les avis sur l’aplat de matière');
  assert.doesNotMatch(proof, /★|<Icon\b/);
  const contact = sansCommentaires(lire('src/sections/Contact/etabli.astro'));
  assert.match(contact, /id="contact"/);
  assert.match(contact, /etabli-enseigne-nom font-display/, 'le nom géant');
  assert.match(lire('src/directions/etabli/index.css'), /\.etabli-enseigne-nom \{ font-family: var\(--font-enseigne\)/);
  assert.match(contact, /href=\{tel\(\)\}/);
  assert.match(contact, /\{site\.contact\.orderUrl && /);
  assert.doesNotMatch(contact, /ContactForm|<form/, 'fin de la source : pas de formulaire');
  assert.doesNotMatch(contact, /btn-primary/, 'le numéro en lien, pas une seconde porte forte');
  const nav = sansCommentaires(lire('src/sections/Nav/etabli.astro'));
  assert.match(nav, /href=\{tel\(\)\}/, 'téléphone cliquable en haut');
  assert.match(nav, /lienProduits\(/, 'liens vers des pages');
});

test('presets etabli : modèle de site entier sans communes, bandeau, formulaire ni barre basse ; second modèle différent', () => {
  const m = JSON.parse(lire('presets/etabli.json'));
  assert.equal(m.nom, 'etabli');
  assert.equal(m.look.direction, 'etabli');
  assert.equal(m.look.layout.hero, 'etabli');
  assert.equal(m.look.layout.nav, 'etabli');
  assert.deepEqual(m.look.layout.sections.map((x) => `${x.type}/${x.variant}`), ['proof/etabli', 'services/etabli', 'contact/etabli'], 'avis haut (socle)');
  assert.equal(m.look.layout.actionBar, false);
  const b = JSON.parse(lire('presets/etabli-coutelier.json'));
  assert.equal(b.look.direction, 'etabli');
  assert.ok(b.look.layout.sections.some((x) => x.type === 'faq' && x.variant === 'etabli'));
  assert.notEqual(b.look.layout.hero, 'etabli');
  assert.notDeepEqual(b.look.layout.sections, m.look.layout.sections);
});

test('direction etabli : polices libres hors liste IA, tokens, bleu lisible, régime clair neutre', async () => {
  const css = lire('src/directions/etabli/index.css');
  const { POLICES_IA } = await import('../scripts/ff/ia.mjs');
  for (const fam of [...css.matchAll(/--font-(?:display|body|mono|enseigne):\s*'([^']+)'/g)].map((x) => x[1])) {
    assert.ok(!POLICES_IA.some((p) => fam.toLowerCase().replace(/ /g, '-').startsWith(p)), fam);
  }
  assert.match(css, /--pierre: #[0-9a-f]{6};/);
  assert.match(css, /--accent: #5b3a24;/, 'couleur d’action tirée du métier (noyer), plus de bleu de boutique de mode');
  assert.match(css, /--matiere: #[0-9a-f]{6};/, 'le grand aplat de matière');
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  const atome = JSON.parse(lire('docs/veille/styles/atomes/etabli.json'));
  assert.equal(regimePalette(atome.couleurs).regime, 'clair-neutre');
  assert.equal(atome.premier_ecran, 'objet-du-metier');
});

test('profil de mouvement fiche-collee-a-l-objet : calme, sans exigence, documenté, porté par l’atome', async () => {
  const { PROFILS_MOUVEMENT, refusProfil } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['fiche-collee-a-l-objet'];
  assert.ok(p);
  assert.equal(p.calme, true);
  assert.deepEqual(p.exige, {});
  assert.equal(refusProfil('fiche-collee-a-l-objet', { mouvement: 'calme', video: null, largeurMax: 0, avis: 0 }), null);
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `fiche-collee-a-l-objet`/);
  assert.equal(JSON.parse(lire('docs/veille/styles/atomes/etabli.json')).mouvement.profil, 'fiche-collee-a-l-objet');
});
