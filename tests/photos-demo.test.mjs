// `ff photos-demo` (scripts/ff/photos-demo.mjs) et son contrôle dans `ff verifier` : fonctions pures de
// scripts/ff/illustrations.mjs (garde démo, choix des candidats, répartition, écriture de site.config.ts, mention
// « Photo d'illustration » sur le site construit) + estPhotoDeBanque (src/lib/credits.ts) et photosDeBanque
// (scripts/astro-credits-integration.mjs). Aucun appel réseau.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import {
  gardeDemo,
  trierCandidats,
  texteIncruste,
  repartir,
  parseServices,
  altDepuisTitre,
  ecrireConfig,
  controlerIllustration,
  imgsDeBanque,
  photosDeBanque,
} from '../scripts/ff/illustrations.mjs';
import { extractTopLevelValue } from '../scripts/ff/ts-literal.mjs';

register('../scripts/ff/ts-loader.mjs', import.meta.url);
const { estPhotoDeBanque, MENTION_ILLUSTRATION } = await import('../src/lib/credits.ts');

const cand = (o) => ({ source: 'wikimedia', id: String(Math.random()), title: 'Copper brewing kettles', width: 3000, height: 2000, licence: 'by-sa', fullUrl: `https://u/2000px-${o.id || Math.random()}.jpg`, categories: [], tags: [], ...o });

test('garde : démo par slug _… / demo-…, legal.demo: true, ou // DEMO ; refus clair sinon', () => {
  assert.equal(gardeDemo('_test-photos').ok, true);
  assert.equal(gardeDemo('demo-brasserie').ok, true);
  assert.equal(gardeDemo('brasserie-x', "// DEMO : brasserie inventée\nexport default defineSite({").ok, true);
  assert.equal(gardeDemo('brasserie-x', "export default defineSite({\n  legal: { demo: true },\n});").ok, true);
  const r = gardeDemo('chez-malo', "export default defineSite({\n  slug: 'chez-malo',\n});");
  assert.equal(r.ok, false);
  assert.match(r.raison, /pas un site de démonstration/);
});

test('trierCandidats : licences réutilisables, largeur, paysage pour le hero, pas de logo ni de texte incrusté', () => {
  const liste = [
    cand({ id: 'a', licence: 'by-nc' }),
    cand({ id: 'b', width: 1200, height: 800 }),
    cand({ id: 'c', width: 2000, height: 3000 }),
    cand({ id: 'd', title: 'Brewery logo' }),
    cand({ id: 'e', title: 'Brewery storefront signboard' }),
    cand({ id: 'f', licence: 'cc0' }),
    cand({ id: 'g', licence: 'by-sa' }),
  ];
  const hero = trierCandidats(liste, { role: 'hero' }).map((c) => c.id);
  assert.deepEqual(hero, ['f', 'g']); // cc0 devant by-sa ; portrait, petite, NC, logo et enseigne écartés
  const galerie = trierCandidats(liste, { role: 'galerie' }).map((c) => c.id);
  assert.ok(galerie.includes('b') && galerie.includes('c'), 'la galerie accepte 1 200 px et le portrait');
  assert.ok(!galerie.includes('a') && !galerie.includes('d') && !galerie.includes('e'));
  const sansF = trierCandidats(liste, { role: 'hero', exclus: new Set(['2000px-f.jpg'.replace(/^\d+px-/, '')]) }).map((c) => c.id);
  assert.deepEqual(sansF, ['g'], 'un candidat déjà pris n est pas repris');
  assert.equal(texteIncruste({ title: 'Old brewery billboard' }), true);
  assert.equal(texteIncruste({ title: 'Copper kettles' }), false);
});

test('repartir : la galerie (n - 1) en tourniquet, en commençant par la première requête', () => {
  assert.deepEqual(repartir(6, 2), [3, 2]);
  assert.deepEqual(repartir(6, 1), [5]);
  assert.deepEqual(repartir(1, 3), [0, 0, 0]);
  assert.deepEqual(repartir(4, 3), [1, 1, 1]);
});

test('parseServices et altDepuisTitre', () => {
  assert.deepEqual(parseServices('cuisines=oak kitchen; escaliers = wooden stairs'), [{ slug: 'cuisines', requete: 'oak kitchen' }, { slug: 'escaliers', requete: 'wooden stairs' }]);
  assert.deepEqual(parseServices(true), []);
  assert.equal(altDepuisTitre('File:DSC_0412 Copper_kettles — brewery.jpg', 'x'), 'Copper kettles, brewery');
  assert.equal(altDepuisTitre('IMG_2231', 'brewery copper kettles'), 'Brewery copper kettles');
});

const CONFIG = `import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: '_test-photos',
  direction: 'atelier',
  services: [
    { slug: 'cuisines', title: 'Cuisines', short: 'Une.' },
    { slug: 'escaliers', title: 'Escaliers', short: 'Deux.', description: 'Un.\\n\\nDeux.' },
  ],
  about: {
    title: 'L’atelier',
    story: 'Texte.',
  },
  // proof : uniquement les avis réels du brief
  images: { logo: { src: '/images/logo.svg', alt: 'Logo' } },
  legal: { demo: true },
});
`;

test('ecrireConfig : images.hero + illustration (logo gardé), proof.gallery créé APRÈS about, services[].image', () => {
  const out = ecrireConfig(CONFIG, {
    hero: { src: '/images/hero.webp', alt: 'Cuves' },
    galerie: [{ src: '/images/galerie-1.webp', alt: 'Bouteilles' }],
    services: [{ slug: 'escaliers', src: '/images/service-escaliers.webp', alt: 'Escalier' }],
  });
  const images = extractTopLevelValue(out, 'images');
  assert.deepEqual(images, { logo: { src: '/images/logo.svg', alt: 'Logo' }, hero: { src: '/images/hero.webp', alt: 'Cuves' }, illustration: true });
  assert.deepEqual(extractTopLevelValue(out, 'proof'), { gallery: [{ src: '/images/galerie-1.webp', alt: 'Bouteilles' }] });
  assert.deepEqual(extractTopLevelValue(out, 'about'), { title: 'L’atelier', story: 'Texte.' }, 'about intact');
  const services = extractTopLevelValue(out, 'services');
  assert.equal(services[0].image, undefined);
  assert.deepEqual(services[1].image, { src: '/images/service-escaliers.webp', alt: 'Escalier' });
  assert.equal(services[1].description, 'Un.\n\nDeux.', 'paragraphes gardés, chaîne toujours valide');
  assert.ok(out.indexOf('proof:') > out.indexOf('about:'));
  // Relancé : la galerie de banque est remplacée, une photo du client est gardée devant.
  const avecClient = out.replace("gallery: [", "gallery: [\n      { src: '/images/chantier.webp', alt: 'Chantier du client' },");
  const encore = ecrireConfig(avecClient, { hero: { src: '/images/hero.webp', alt: 'Cuves' }, galerie: [{ src: '/images/galerie-1.webp', alt: 'Neuve' }], banque: ['/images/galerie-1', '/images/hero'] });
  assert.deepEqual(extractTopLevelValue(encore, 'proof').gallery.map((g) => g.alt), ['Chantier du client', 'Neuve']);
  new Function(encore.replace(/^import .*$/m, '').replace('export default defineSite(', 'return (')); // reste du JS valide
});

test('ecrireConfig : service inconnu ou clé illisible -> refus, rien d écrasé', () => {
  assert.throws(() => ecrireConfig(CONFIG, { services: [{ slug: 'toitures', src: '/x', alt: 'x' }] }), /services inconnus/);
  assert.throws(() => ecrireConfig(CONFIG.replace("images: { logo: { src: '/images/logo.svg', alt: 'Logo' } },", 'images: IMAGES,'), { hero: { src: '/x', alt: 'x' } }), /pas un littéral lisible/);
});

test('photosDeBanque / estPhotoDeBanque : cibles public/images de CREDITS.md, suffixe de largeur ignoré', () => {
  const md = '# Crédits\n\n## raw/hero.jpg -> public/images/hero.webp (via ff images)\n- Auteur : X\n\n## public/images/photo-3.webp\n- Auteur : Y\n\n## public/videos/hero.mp4\n';
  const stems = photosDeBanque(md);
  assert.deepEqual(stems, ['/images/hero', '/images/photo-3']);
  assert.equal(estPhotoDeBanque('/images/hero.webp', stems), true);
  assert.equal(estPhotoDeBanque('/images/hero-800.avif', stems), true);
  assert.equal(estPhotoDeBanque('/images/atelier.webp', stems), false);
  assert.equal(MENTION_ILLUSTRATION, 'Photo d’illustration');
});

test('controlerIllustration : non démo marquée = échec ; démo sans marquage = échec ; chaque photo marquée = ok', () => {
  const stems = ['/images/hero', '/images/galerie-1'];
  const marque = '<span class="ff-illustration" data-illustration>Photo d’illustration</span>';
  const page = (m) => `<picture><img src="/images/hero.webp" alt=""></picture>${m ? marque : ''}<img src="/images/galerie-1.webp" alt="">${m ? marque : ''}`;
  assert.equal(imgsDeBanque(page(false), stems), 2);

  const nonDemo = controlerIllustration({ demo: false, illustration: true, stems, pages: [] });
  assert.equal(nonDemo[0].pass, false);
  assert.match(nonDemo[0].label, /PAS une démo/);
  assert.equal(controlerIllustration({ demo: false, illustration: false, stems, pages: [{ chemin: 'index.html', html: page(true) }] })[0].pass, false);
  assert.deepEqual(controlerIllustration({ demo: false, illustration: false, stems: [], pages: [{ chemin: 'index.html', html: '<img src="/images/a.webp">' }] }), []);

  const sans = controlerIllustration({ demo: true, illustration: false, stems, pages: [{ chemin: 'index.html', html: page(false) }] });
  assert.equal(sans[0].pass, false);
  assert.match(sans[0].label, /sans la mention/);
  const partiel = controlerIllustration({ demo: true, illustration: true, stems, pages: [{ chemin: 'index.html', html: `<img src="/images/hero.webp">${marque}<img src="/images/galerie-1.webp">` }] });
  assert.equal(partiel[0].pass, false);
  const okk = controlerIllustration({ demo: true, illustration: true, stems, pages: [{ chemin: 'index.html', html: page(true) }, { chemin: 'credits.html', html: '<img src="/images/hero.webp">' }] });
  assert.equal(okk[0].pass, true);
});

test('ff ia : la mention posée par <Img> (data-illustration) n est pas un signe IA ; écrite à la main, si', async () => {
  const { analyserHtml } = await import('../scripts/ff/ia.mjs');
  const regles = (html) => analyserHtml(html).alertes.map((a) => a.regle);
  assert.ok(!regles('<main><span class="ff-illustration" data-illustration>Photo d’illustration</span></main>').includes('photo-illustration'));
  assert.ok(regles('<main><p>Photo d’illustration</p></main>').includes('photo-illustration'));
});
