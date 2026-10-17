// Tests des fonctions pures de `ff refonte` (scripts/ff/refonte.mjs) sur des pages HTML fixes : aucun accès réseau.
// Téléphones, e-mails (dont protection Cloudflare), adresse, horaires, années, réseaux, avis, mentions légales,
// plus grande variante de srcset, filtre des banques d'images, robots.txt, sitemap, plan de redirections, brief.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validerUrl, slugDepuisUrl, memeDomaine, cleUrl, lireRobots, robotsAutorise, lireSitemap, decoderEntites, lignesDe, zonePrincipale,
  plusGrandeVariante, urlOriginale, lireImages, filtrerImage, trouverLogo, decoderCfEmail, extraireAvisHtml, lirePage,
  normaliserTelephone, extraireTelephones, extraireEmails, extraireAdresses, extraireHoraires, extraireAnnees, extraireReseaux,
  luhn, extraireLegal, classerPage, slugService, extraireServices, extraireNom, extraireTout, destinationPour, planRedirections,
  ordonnerUrls, nomFichierPhoto, typeImage, rendreBrief, rendreSources, dateFr, estRessource, segmentsTitre, sansHebergeur,
} from '../scripts/ff/refonte.mjs';
import { lireReponses } from '../scripts/ff/aiguillage.mjs';

const BASE = 'https://www.plomberie-martin.fr';

// Encode « contact@plomberie-martin.fr » comme le fait Cloudflare (clé 0x42).
const CF = (() => {
  const cle = 0x42;
  return cle.toString(16) + [...'contact@plomberie-martin.fr'].map((ch) => (ch.charCodeAt(0) ^ cle).toString(16).padStart(2, '0')).join('');
})();

const ACCUEIL = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>Plomberie Martin | Plombier chauffagiste à Tours</title>
<meta name="description" content="Plombier à Tours depuis 1998.">
<meta property="og:site_name" content="Plomberie Martin">
<meta property="og:image" content="${BASE}/img/og.jpg">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Review","author":{"@type":"Person","name":"Paul R."},"reviewBody":"Intervention rapide un dimanche, travail propre et prix annoncé respecté."}</script>
<style>.x{color:red}</style></head>
<body>
<div class="cookie-banner"><p>Nous utilisons des cookies. Accepter</p></div>
<header><a href="/"><img src="/img/logo-martin.png" alt="Plomberie Martin logo" width="200" height="60"></a>
<nav><ul><li><a href="/">Accueil</a></li><li><a href="/plomberie">Plomberie</a></li><li><a href="/contact">Contact</a></li></ul></nav></header>
<main>
<h1>Votre plombier à Tours</h1>
<p>Entreprise familiale fondée en 1998, nous intervenons à Tours et dans un rayon de 30 km.</p>
<p>Plus de 25 ans d&rsquo;expérience &amp; un service d&#x27;urgence 7j/7.</p>
<h2>Nos services</h2>
<picture><source type="image/webp" srcset="/img/chantier-800.webp 800w, /img/chantier-1600.webp 1600w"><img src="/img/chantier-800.jpg" srcset="/img/chantier-400.jpg 400w, /img/chantier-1600.jpg 1600w, /img/chantier-800.jpg 800w" alt="Salle de bain rénovée"></picture>
<img src="https://images.pexels.com/photos/123/plumber.jpg" alt="plombier">
<img data-src="/wp-content/uploads/douche.jpg" src="data:image/gif;base64,R0lGOD" alt="Douche à l'italienne">
<img src="/img/icone-tel.png" width="32" height="32" alt="">
<a href="/img/galerie/cuisine.jpg" title="Cuisine"><img src="/img/galerie/cuisine-150x150.jpg" width="150" height="150" alt="Cuisine"></a>
<div class="testimonial"><p>« Très bon travail, ponctuel et soigneux, je recommande. »</p><cite>Marie C.</cite></div>
<div class="testimonial"><p>Devis clair et chantier rendu propre, merci encore à toute l'équipe.</p><strong>Jean-Pierre</strong></div>
<table><tr><td>Lundi</td><td>8h00 - 12h00 / 14h00 - 18h00</td></tr><tr><td>Samedi</td><td>9h - 12h</td></tr><tr><td>Dimanche</td><td>Fermé</td></tr></table>
</main>
<footer><p>12 bis rue des Lilas, 37000 Tours</p><p>Tél. : <a href="tel:+33247000001">02 47 00 00 01</a> - Fax : 02 47 00 00 09</p>
<p><a href="/cdn-cgi/l/email-protection#${CF}"><span class="__cf_email__" data-cfemail="${CF}">[email&#160;protected]</span></a></p>
<a href="https://www.facebook.com/plomberiemartin">Facebook</a> <a href="https://www.facebook.com/sharer/sharer.php?u=x">Partager</a>
<a href="https://www.instagram.com/plomberie.martin/?hl=fr">Instagram</a>
<a href="https://www.google.com/maps/place/Plomberie+Martin">Nous trouver</a>
<a href="/mentions-legales">Mentions légales</a><p>Site réalisé par Agence Web 37</p></footer>
<script>document.write('x')</script>
</body></html>`;

const MENTIONS = `<html><head><title>Mentions légales | Plomberie Martin</title></head><body><main>
<h1>Mentions légales</h1><p>Raison sociale : Plomberie Martin SARL</p><p>SARL au capital de 5 000 €</p>
<p>SIRET : 732 829 320 00074</p><p>RCS Tours B 732 829 320</p><p>TVA intracommunautaire : FR 40 732829320</p>
<p>Directeur de la publication :</p><p>Jean Martin</p>
<h2>2. Hébergement</h2><p>Hébergeur : IONOS SARL</p><p>7 place de la Gare, 57200 Sarreguemines, France</p><p>Tél. : 09 70 80 89 11</p><p>RCS Sarreguemines B 431 303 775</p><h2>3. Propriété intellectuelle</h2><p>Textes et photos : Plomberie Martin.</p></main></body></html>`;

const SERVICE = `<html><head><title>Débouchage de canalisation - Plomberie Martin</title><meta name="description" content="Débouchage à Tours."></head>
<body><main><h1>Débouchage de canalisations</h1><p>Débouchage à partir de 89 € TTC.</p></main></body></html>`;

const pages = () => [lirePage(ACCUEIL, `${BASE}/`), lirePage(SERVICE, `${BASE}/plomberie/debouchage`), lirePage(MENTIONS, `${BASE}/mentions-legales`)];

test('validerUrl / slugDepuisUrl / memeDomaine / cleUrl', () => {
  assert.equal(validerUrl('https://www.boulangerielepidor.fr/#x'), 'https://www.boulangerielepidor.fr/');
  assert.throws(() => validerUrl('file:///etc/passwd'), /refusée/);
  assert.equal(slugDepuisUrl('https://www.boulangerielepidor.fr'), 'boulangerielepidor');
  assert.equal(slugDepuisUrl('https://plomberie-martin.co.uk/x'), 'plomberie-martin');
  assert.ok(memeDomaine('https://exemple.fr/a', 'https://www.exemple.fr/'));
  assert.ok(!memeDomaine('https://exemple.fr/a', 'https://autre.fr/'));
  assert.equal(cleUrl('https://www.exemple.fr/contact/'), cleUrl('https://exemple.fr/contact'));
  assert.ok(estRessource('https://x.fr/carte.pdf') && !estRessource('https://x.fr/carte'));
});

test('robots.txt : groupes « * » fusionnés, règle la plus longue, Allow prioritaire à égalité, sitemaps', () => {
  const r = lireRobots('# *\nUser-agent: *\nAllow: /\n\nUser-agent: *\nDisallow: /admin\nDisallow: /*.php$\nAllow: /admin/public\n\nUser-agent: GPTBot\nDisallow: /\nSitemap: https://x.fr/sitemap.xml');
  assert.deepEqual(r.sitemaps, ['https://x.fr/sitemap.xml']);
  assert.ok(robotsAutorise(r.regles, '/a-propos'));
  assert.ok(!robotsAutorise(r.regles, '/admin/compte'));
  assert.ok(robotsAutorise(r.regles, '/admin/public/x'));
  assert.ok(!robotsAutorise(r.regles, '/index.php'));
  assert.ok(robotsAutorise(r.regles, '/index.php?x=1'));
  const nous = lireRobots('User-agent: *\nDisallow:\n\nUser-agent: FinckFisch-refonte\nDisallow: /');
  assert.ok(!robotsAutorise(nous.regles, '/'), 'un groupe à notre nom prime sur « * »');
  assert.ok(robotsAutorise(lireRobots('User-agent: *\nDisallow:').regles, '/tout'));
});

test('sitemap : index et urlset, CDATA et entités', () => {
  assert.deepEqual(lireSitemap('<sitemapindex><sitemap><loc>https://x.fr/sitemap-0.xml</loc></sitemap></sitemapindex>'), { index: true, locs: ['https://x.fr/sitemap-0.xml'] });
  assert.deepEqual(lireSitemap('<urlset><url><loc><![CDATA[https://x.fr/a?b=1&amp;c=2]]></loc></url><url><loc> https://x.fr/ </loc></url></urlset>').locs, ['https://x.fr/a?b=1&c=2', 'https://x.fr/']);
});

test('texte : entités, blocs, cellules jointes, titres marqués, zone principale sans nav/pied/cookies', () => {
  assert.equal(decoderEntites('L&#x27;&Eacute;pi d&rsquo;Or &amp; Cie&nbsp;!'), 'L\'Épi d’Or & Cie !');
  const l = lignesDe('<h2>Titre</h2><p>Un <strong>mot</strong> fort</p><table><tr><td>Lundi</td><td>8h</td></tr></table>');
  assert.deepEqual(l, [{ t: 'Titre', h: 2 }, { t: 'Un mot fort', h: 0 }, { t: 'Lundi 8h', h: 0 }]);
  const z = zonePrincipale('<div class="cookie">Accepter les cookies</div><nav>Menu</nav><p>Texte</p><footer>Pied</footer>').map((x) => x.t);
  assert.deepEqual(z, ['Texte']);
  const p = lirePage(ACCUEIL, `${BASE}/`);
  assert.equal(p.titre, 'Plomberie Martin | Plombier chauffagiste à Tours');
  assert.equal(p.h1, 'Votre plombier à Tours');
  assert.ok(!p.principal.some((x) => /Accueil|cookies|Lilas|document\.write/.test(x.t)), 'ni menu, ni bandeau, ni pied, ni script');
  assert.ok(p.toutes.some((x) => /rue des Lilas/.test(x)), 'le pied reste lu pour les coordonnées');
  assert.ok(p.mots > 40);
  // Page courte mais statique : pas une coquille JavaScript ; « Chargement... » dans #__next : si.
  assert.equal(lirePage(SERVICE, `${BASE}/plomberie/debouchage`).videJs, false);
  assert.equal(lirePage('<html><body><div id="__next"><p>Chargement...</p></div></body></html>', `${BASE}/`).videJs, true);
});

test('srcset : la plus grande variante (w, puis x), URL avec virgules, URL originale des plateformes', () => {
  assert.equal(plusGrandeVariante('/a-400.jpg 400w, /a-1600.jpg 1600w, /a-800.jpg 800w', BASE).url, `${BASE}/a-1600.jpg`);
  assert.equal(plusGrandeVariante('/a.jpg 1x, /a@2x.jpg 2x', BASE).url, `${BASE}/a@2x.jpg`);
  assert.equal(plusGrandeVariante('https://res.cloudinary.com/x/w_400,h_300/a.jpg 400w, https://res.cloudinary.com/x/w_1200,h_900/a.jpg 1200w').url, 'https://res.cloudinary.com/x/w_1200,h_900/a.jpg');
  assert.equal(plusGrandeVariante('', BASE), null);
  assert.equal(urlOriginale(`${BASE}/_next/image?url=%2Fimg%2Ffacade.jpg&w=3840&q=75`), `${BASE}/img/facade.jpg`);
  assert.equal(urlOriginale('https://static.wixstatic.com/media/abc_123~mv2.jpg/v1/fill/w_300,h_200/abc.jpg'), 'https://static.wixstatic.com/media/abc_123~mv2.jpg');
  assert.match(urlOriginale('https://images.squarespace-cdn.com/content/x.jpg?format=300w'), /format=2500w/);
});

test('images : img/srcset/source/lien/data-src lus, banques et icônes écartées, logo repéré', () => {
  const imgs = lireImages(ACCUEIL, `${BASE}/`);
  const urls = imgs.map((i) => i.url);
  assert.ok(urls.includes(`${BASE}/img/chantier-1600.jpg`), 'img srcset : 1600w');
  assert.ok(urls.includes(`${BASE}/img/chantier-1600.webp`), 'source de picture');
  assert.ok(urls.includes(`${BASE}/wp-content/uploads/douche.jpg`), 'data-src plutôt que le gif transparent');
  assert.ok(urls.includes(`${BASE}/img/galerie/cuisine.jpg`), "lien vers l'image en grand");
  const garde = (u) => filtrerImage(imgs.find((i) => i.url === u)).garder;
  assert.equal(garde('https://images.pexels.com/photos/123/plumber.jpg'), false);
  assert.equal(filtrerImage({ url: 'https://images.pexels.com/photos/1/a.jpg' }).raison, "banque d'images");
  for (const u of ['https://images.unsplash.com/photo-1', 'https://image.shutterstock.com/a.jpg', 'https://img.freepik.com/a.jpg', 'https://media.istockphoto.com/a.jpg', 'https://t4.ftcdn.net/jpg/a.jpg', 'https://stock.adobe.com/a.jpg']) {
    assert.equal(filtrerImage({ url: u }).garder, false, u);
  }
  assert.equal(garde(`${BASE}/img/icone-tel.png`), false);
  assert.equal(garde(`${BASE}/img/logo-martin.png`), false);
  assert.equal(filtrerImage({ url: `${BASE}/img/partenaires/qualibat.jpg` }).garder, false);
  assert.equal(filtrerImage({ url: `${BASE}/img/a.svg` }).garder, false);
  assert.equal(garde(`${BASE}/img/chantier-1600.jpg`), true);
  assert.equal(trouverLogo(imgs).url, `${BASE}/img/logo-martin.png`);
});

test('téléphones français : formats, tel:, +33, fax signalé, pas de SIRET pris pour un numéro', () => {
  assert.equal(normaliserTelephone('+33 (0)2 47 00 00 01'), '02 47 00 00 01');
  assert.equal(normaliserTelephone('0033247000001'), '02 47 00 00 01');
  assert.equal(normaliserTelephone('06.12.34.56.78'), '06 12 34 56 78');
  assert.equal(normaliserTelephone('12345'), null);
  const t = extraireTelephones(['Tél. : 02 47 00 00 01 - Fax : 02 47 00 00 09', 'Portable 06-12-34-56-78', 'SIRET 73282932000074', 'Mobile 0612345678'], ['tel:+33247000001']);
  assert.deepEqual(t.map((x) => x.valeur), ['02 47 00 00 01', '06 12 34 56 78', '02 47 00 00 09']);
  assert.equal(t.find((x) => x.valeur === '02 47 00 00 09').fax, true);
});

test('e-mails : texte, mailto, Cloudflare ; images et exemples écartés', () => {
  assert.equal(decoderCfEmail(CF), 'contact@plomberie-martin.fr');
  assert.equal(decoderCfEmail('zz'), null);
  assert.ok(lirePage(ACCUEIL, `${BASE}/`).toutes.includes('contact@plomberie-martin.fr'), '« [email protected] » remplacé par l’adresse dans le texte');
  assert.deepEqual(sansHebergeur([{ t: 'Hébergeur : OVH', h: 0 }, { t: '2 rue Kellermann 59100 Roubaix', h: 0 }, { t: 'Crédits', h: 2 }, { t: 'Photos : nous', h: 0 }]).map((l) => l.t), ['Crédits', 'Photos : nous']);
  const e = extraireEmails(['Écrivez à Devis@Plomberie-Martin.fr.', 'logo@2x.png', 'votre@email.com', 'nom@exemple.fr'], ['mailto:contact@plomberie-martin.fr?subject=Devis'], [decoderCfEmail(CF)]);
  assert.deepEqual(e, ['contact@plomberie-martin.fr', 'devis@plomberie-martin.fr']);
});

test('adresse : rue + code postal + ville, sur deux lignes, majuscules, pas de faux code postal', () => {
  assert.deepEqual(extraireAdresses(['59 rue Maurice Dubois, 45000', 'Orléans, France'])[0], { rue: '59 rue Maurice Dubois', codePostal: '45000', ville: 'Orléans' });
  assert.deepEqual(extraireAdresses(['12 bis Avenue de la Gare 69003 LYON'])[0], { rue: '12 bis Avenue de la Gare', codePostal: '69003', ville: 'LYON' });
  assert.deepEqual(extraireAdresses(['ZA des Granges, 37250 Montbazon Cedex'])[0], { rue: 'ZA des Granges', codePostal: '37250', ville: 'Montbazon Cedex' });
  assert.deepEqual(extraireAdresses(['Une ville de 45000 habitants', 'Budget 15000 Euros', 'SIRET 73282932000074']), []);
  assert.deepEqual(extraireAdresses(['Basés à 37000 Tours.'])[0], { rue: null, codePostal: '37000', ville: 'Tours' });
});

test('horaires : lignes telles qu’écrites, jour seul joint à ses heures, prose écartée', () => {
  assert.deepEqual(extraireHoraires(['Lundi 8h00 - 12h00 / 14h00 - 18h00', 'Mardi', '6h45 - 13h00', 'Dimanche Fermé', 'Du mardi au samedi de 7 h à 19 h 30', 'Le mardi, nous aimons le pain bien cuit et la vie.']), [
    'Lundi 8h00 - 12h00 / 14h00 - 18h00', 'Mardi 6h45 - 13h00', 'Dimanche Fermé', 'Du mardi au samedi de 7 h à 19 h 30',
  ]);
  assert.deepEqual(extraireHoraires(['Marché de Noël']), []);
});

test('années et durées : depuis, fondé en, ans d’expérience ; copyright ignoré', () => {
  const a = extraireAnnees(['Entreprise familiale fondée en 1998, nous intervenons à Tours.', 'Boulangerie ouverte depuis 2005.', 'Plus de 25 ans d’expérience.', '© 2024 Tous droits réservés', 'En 2012, Paul reprend la boutique.']);
  assert.deepEqual(a.map((x) => x.annee ?? `${x.duree} ans`), [1998, 2005, '25 ans', 2012]);
  assert.match(a[0].phrase, /^Entreprise familiale fondée en 1998/);
});

test('réseaux : profils gardés, partages écartés, requête retirée', () => {
  const r = extraireReseaux(['https://www.facebook.com/sharer/sharer.php?u=x', 'https://www.facebook.com/plomberiemartin', 'https://www.instagram.com/plomberie.martin/?hl=fr', 'https://www.instagram.com/p/abc/', 'https://fr.linkedin.com/company/martin', 'https://www.tiktok.com/@martin', 'https://www.facebook.com/profile.php?id=123', 'https://www.linkedin.com/in/developpeur-du-site/']);
  assert.deepEqual(r, { facebook: 'https://www.facebook.com/plomberiemartin', instagram: 'https://www.instagram.com/plomberie.martin/', linkedin: 'https://fr.linkedin.com/company/martin', tiktok: 'https://www.tiktok.com/@martin', linkedinPersonnel: 'https://www.linkedin.com/in/developpeur-du-site/' });
});

test('avis affichés : JSON-LD et blocs testimonial, texte et nom tels quels, conteneur ignoré', () => {
  const p = lirePage(ACCUEIL, `${BASE}/`);
  assert.deepEqual(p.avis, [
    { auteur: 'Paul R.', texte: 'Intervention rapide un dimanche, travail propre et prix annoncé respecté.' },
    { auteur: 'Marie C.', texte: '« Très bon travail, ponctuel et soigneux, je recommande. »' },
    { auteur: 'Jean-Pierre', texte: "Devis clair et chantier rendu propre, merci encore à toute l'équipe." },
  ]);
  const imbrique = extraireAvisHtml('<section class="avis"><div class="avis-client"><p>Un accueil adorable et des croissants parfaits.</p><p>Léa</p></div></section>');
  assert.deepEqual(imbrique, [{ auteur: 'Léa', texte: 'Un accueil adorable et des croissants parfaits.' }]);
});

test('mentions légales : SIRET (Luhn), RCS, TVA, forme, raison sociale, directeur sur la ligne suivante', () => {
  assert.ok(luhn('73282932000074') && !luhn('73282932000075'));
  const l = extraireLegal(lirePage(MENTIONS, `${BASE}/mentions-legales`).toutes, { pageMentions: true });
  assert.deepEqual(l.siret, { valeur: '732 829 320 00074', valide: true });
  assert.equal(l.rcs, 'RCS Tours B 732 829 320');
  assert.equal(l.tva, 'FR40732829320');
  assert.equal(l.forme, 'SARL');
  assert.equal(l.raison, 'Plomberie Martin SARL');
  assert.equal(l.directeur, 'Jean Martin');
  assert.equal(extraireLegal(['SIRET : 123 456 789 00012']).siret.valide, false);
  assert.equal(extraireLegal(['Le directeur de la publication est M. Paul Durand.']).directeur, 'Paul Durand');
});

test('classerPage / slugService / services', () => {
  const cas = {
    '/': 'accueil', '/accueil': 'accueil', '/contact': 'contact', '/contactez-nous.html': 'contact', '/nos-succes': 'service',
    '/mentions-legales': 'mentions', '/politique-de-confidentialite': 'confidentialite', '/a-propos': 'apropos', '/avis': 'avis',
    '/galerie-photos': 'galerie', '/blog/mon-article': 'blog', '/plomberie': 'service', '/services/chauffage': 'service',
    '/boutique/produits': 'service', '/boutique/produits/pavlova': 'autre', '/boutique/photos': 'galerie',
  };
  for (const [chemin, type] of Object.entries(cas)) assert.equal(classerPage(`${BASE}${chemin}`), type, chemin);
  assert.equal(slugService(`${BASE}/prestations/Rénovation-Salle-de-Bain.html`), 'renovation-salle-de-bain');
  const s = extraireServices(pages(), 'Plomberie Martin');
  assert.deepEqual(s.map((x) => [x.titre, x.slug, x.prix]), [['Débouchage de canalisations', 'debouchage', ['Débouchage à partir de 89 € TTC.']]]);
  assert.deepEqual(segmentsTitre("L'Épi d'Or | Boulangerie - Pâtisserie Artisanale"), ["L'Épi d'Or", 'Boulangerie - Pâtisserie Artisanale']);
  assert.deepEqual(segmentsTitre('Plombier - Tours'), ['Plombier', 'Tours']);
});

test('services d’une application à page unique : même titre partout -> libellé du lien du menu, sinon rien', () => {
  const titre = "<title>L'Épi d'Or | Boulangerie - Pâtisserie Artisanale</title><meta name=\"description\" content=\"Boulangerie à Orléans\">";
  const accueil = lirePage(`<html><head>${titre}</head><body><div id="__next">Chargement...</div><footer><a href="#">Version 3.0.0</a><a href="/boutique/pieces-montees">Pièces montées</a><a href="/boutique/pieces-montees">En savoir plus</a></footer></body></html>`, 'https://www.epi.fr/');
  const pm = lirePage(`<html><head>${titre}</head><body><div id="__next">Chargement...</div><a href="#">Version 3.0.0</a></body></html>`, 'https://www.epi.fr/boutique/pieces-montees');
  const produits = lirePage(`<html><head>${titre}</head><body><div id="__next">Chargement...</div><a href="#">Version 3.0.0</a></body></html>`, 'https://www.epi.fr/boutique/produits');
  const s = extraireServices([accueil, pm, produits], "L'Épi d'Or");
  assert.deepEqual(s.map((x) => [x.titre, x.slug, x.description]), [['Pièces montées', 'pieces-montees', '']]);
  assert.equal(extraireTout([accueil]).metier.valeur, 'Boulangerie - Pâtisserie Artisanale');
});

test('extraireTout : nom, métier, contacts, horaires, réseaux, avis, légal, réalisé par, fiche Google', () => {
  const x = extraireTout(pages());
  assert.deepEqual(x.nom, { valeur: 'Plomberie Martin', source: `${BASE}/`, comment: 'og:site_name' });
  assert.equal(x.metier.valeur, 'Plombier chauffagiste à Tours');
  assert.deepEqual(x.telephones.map((t) => [t.valeur, t.fax, t.source]), [['02 47 00 00 01', false, `${BASE}/`], ['02 47 00 00 09', true, `${BASE}/`]]);
  assert.deepEqual(x.emails, [{ valeur: 'contact@plomberie-martin.fr', source: `${BASE}/` }]);
  assert.deepEqual(x.adresses[0], { rue: '12 bis rue des Lilas', codePostal: '37000', ville: 'Tours', source: `${BASE}/` });
  assert.deepEqual(x.horaires.lignes, ['Lundi 8h00 - 12h00 / 14h00 - 18h00', 'Samedi 9h - 12h', 'Dimanche Fermé']);
  assert.equal(x.reseaux.instagram.url, 'https://www.instagram.com/plomberie.martin/');
  assert.equal(x.avis.length, 3);
  assert.equal(x.legal.siret.valeur.valeur, '732 829 320 00074');
  assert.equal(x.legal.siret.source, `${BASE}/mentions-legales`);
  assert.equal(x.realisePar.texte, 'Site réalisé par Agence Web 37');
  assert.equal(x.google.url, 'https://www.google.com/maps/place/Plomberie+Martin');
  assert.ok(x.annees.some((a) => a.annee === 1998));
  assert.ok(x.urgence.length >= 1);
  // Le bloc « Hébergement » des mentions est celui de l'hébergeur : ni son téléphone, ni son adresse, ni son RCS.
  assert.ok(!x.telephones.some((t) => t.valeur === '09 70 80 89 11'));
  assert.ok(!x.adresses.some((a) => a.codePostal === '57200'));
  assert.equal(x.legal.rcs.valeur, 'RCS Tours B 732 829 320');
  assert.equal(extraireNom([lirePage('<title>Atelier Lune | Boulangerie</title>', 'https://a.fr/'), lirePage('<title>Contact | Atelier Lune</title>', 'https://a.fr/contact')]).valeur, 'Atelier Lune');
});

test('plan de redirections : format ff vercel, règles simples, collections regroupées, rien qui boucle', () => {
  const urls = [`${BASE}/`, `${BASE}/contact`, `${BASE}/mentions-legales`, `${BASE}/politique-de-confidentialite`, `${BASE}/a-propos`, `${BASE}/plomberie/debouchage`, `${BASE}/chauffage`, `${BASE}/?page_id=3`, ...[1, 2, 3, 4, 5, 6].map((n) => `${BASE}/actualites/article-${n}`)];
  const plan = planRedirections(urls, { servicesParUrl: { [cleUrl(`${BASE}/plomberie/debouchage`)]: 'debouchage' }, origine: 'ff refonte test' });
  assert.deepEqual(plan.redirects, [
    { source: '/contact', destination: '/#contact', statusCode: 301 },
    { source: '/politique-de-confidentialite', destination: '/confidentialite', statusCode: 301 },
    { source: '/a-propos', destination: '/', statusCode: 301 },
    { source: '/plomberie/debouchage', destination: '/services/debouchage', statusCode: 301 },
    { source: '/chauffage', destination: '/', statusCode: 301 },
    { source: '/actualites/:path*', destination: '/', statusCode: 301 },
  ]);
  assert.deepEqual(plan.ignorees, [`${BASE}/?page_id=3`]);
  assert.equal(destinationPour(`${BASE}/mentions-legales.html`), '/mentions-legales');
  for (const r of plan.redirects) assert.ok(r.source.startsWith('/') && r.destination.startsWith('/') && r.statusCode === 301);
});

test('ordre d’exploration : accueil, pages clés, puis profondeur, collections en dernier', () => {
  const produits = Array.from({ length: 10 }, (_, i) => `${BASE}/boutique/produits/p${i}`);
  const o = ordonnerUrls([...produits, `${BASE}/politique-de-confidentialite`, `${BASE}/boutique/produits`, `${BASE}/contact`, `${BASE}/`, `${BASE}/a-propos`]);
  assert.deepEqual(o.slice(0, 4), [`${BASE}/`, `${BASE}/contact`, `${BASE}/a-propos`, `${BASE}/boutique/produits`]);
  assert.equal(o.indexOf(`${BASE}/politique-de-confidentialite`) < o.indexOf(produits[0]), true);
});

test('photos : nom lisible ou page + numéro, type par les octets, jamais par l’URL', () => {
  const pris = new Set();
  assert.equal(nomFichierPhoto(`${BASE}/img/facade.jpg`, `${BASE}/a-propos`, 'jpg', pris), 'facade.jpg');
  assert.equal(nomFichierPhoto(`${BASE}/img/facade.jpg?v=2`, `${BASE}/a-propos`, 'jpg', pris), 'facade-01.jpg');
  assert.equal(nomFichierPhoto(`${BASE}/api/images/8ce2f7af-7ced-4b8f-93a1-4e59fcb156ac`, `${BASE}/boutique/galerie-photo`, 'jpg', pris), 'galerie-photo-01.jpg');
  assert.equal(nomFichierPhoto(`${BASE}/uploads/IMG_2041.JPG`, `${BASE}/`, 'jpg', pris), 'accueil-01.jpg');
  assert.equal(nomFichierPhoto(`${BASE}/uploads/cuisine-chene-1024x768.jpg`, `${BASE}/`, 'webp', pris), 'cuisine-chene.webp');
  assert.equal(typeImage(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0])), 'jpg');
  assert.equal(typeImage(Buffer.from('RIFF\0\0\0\0WEBPVP8 ')), 'webp');
  assert.equal(typeImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg">')), null);
  assert.equal(typeImage(Buffer.from('<!doctype html><html>')), null);
});

test('rendu du brief : en-tête REFONTE, sources, « ? à demander », aiguillage, annexe ; lu par ff aiguillage', () => {
  const p = pages();
  const extraction = extraireTout(p);
  const photos = Array.from({ length: 6 }, (_, i) => ({ fichier: `accueil-0${i + 1}.jpg`, url: `${BASE}/img/${i}.jpg`, page: `${BASE}/`, alt: i ? '' : 'Salle de bain', largeur: i ? 1600 : 800, hauteur: 1200, petite: i === 0 }));
  const d = { url: `${BASE}/`, hote: 'plomberie-martin.fr', dateTexte: dateFr(new Date(2026, 9, 17)), pages: p, extraction, photos, jsSeul: false, pagesVides: [], depuisSitemap: true, urlsConnues: 12, nbRedirections: 4, titresAccueil: ['Nos services'] };
  const b = rendreBrief(d);
  assert.ok(b.startsWith(`> **REFONTE de ${BASE}/, lu le 17 octobre 2026 : textes et photos du site actuel du client ; à valider avec lui.**`));
  for (const titre of ['## 1. Identité', '## 2. Contact', "## 3. Zone d'intervention", '## 4. Services (3 à 6)', "## 5. Histoire de l'entreprise", '## 7. Avis clients réels', '## 8. Photos disponibles', '## 9. Réseaux sociaux', '## 10. Questions fréquentes', '## 11. Domaine et mise en ligne', '## 12. Ressenti du client', '## Choix atelier', '## Annexe — Textes du site actuel']) {
    assert.ok(b.includes(titre), titre);
  }
  assert.match(b, /\*\*Téléphone\*\* \(format affiché, ex\. 06 12 34 56 78\) : 02 47 00 00 01 \(https:\/\/www\.plomberie-martin\.fr\/\) ; fax : 02 47 00 00 09/);
  assert.match(b, /\*\*SIRET :\*\* 732 829 320 00074 \(https:\/\/www\.plomberie-martin\.fr\/mentions-legales\)/);
  assert.match(b, /\*\*Note Google actuelle\*\* \(sur 5\) : \? à demander/);
  assert.match(b, /\*\*Texte de l'avis\*\* \(copier tel quel, ne pas reformuler\) : « Intervention rapide un dimanche/);
  assert.match(b, /\*\*TikTok\*\* \(URL complète\) : \? à demander/);
  assert.match(b, /- \[x\] Oui, et j'en ai/);
  assert.match(b, /Trop petites pour le plein cadre.*`accueil-01\.jpg` \(800 px\)/);
  assert.match(b, /### Votre plombier à Tours[\s\S]*fondée en 1998[\s\S]*\*\*Nos services\*\*/);
  assert.match(b, /slug `debouchage`/);
  assert.equal(lireReponses(b).souhait, 'avec-photo');
  assert.equal(lireReponses(b).cases.logo, true);
  // Moins de 6 photos -> « Peu ou pas ».
  const peu = rendreBrief({ ...d, photos: photos.slice(0, 2) });
  assert.match(peu, /- \[x\] Peu ou pas, ça me va/);
  assert.equal(lireReponses(peu).souhait, 'peu');
  // Rien trouvé -> « ? à demander », jamais de valeur inventée.
  const vide = rendreBrief({ ...d, pages: [lirePage('<html><body><div id="__next">Chargement...</div></body></html>', `${BASE}/`)], extraction: extraireTout([lirePage('<html></html>', `${BASE}/`)]), photos: [], jsSeul: true, pagesVides: [{}] });
  assert.match(vide, /\*\*E-mail :\*\* \? à demander/);
  assert.match(vide, /\*\*Adresse\*\* — rue : \? à demander/);
  assert.match(vide, /Contenu chargé en JavaScript/);
  assert.ok(!/undefined|null|NaN/.test(vide), 'aucune valeur technique dans le brief');
  assert.ok(!/undefined|null|NaN/.test(b));
});

test('SOURCES.md : fichier, URL, page, alt, dimensions, trop petite signalée', () => {
  const s = rendreSources([{ fichier: 'facade.jpg', url: `${BASE}/img/facade.jpg`, page: `${BASE}/a-propos`, alt: 'Façade', largeur: 800, hauteur: 600, petite: true }], { url: BASE, dateTexte: '17 octobre 2026', ecartees: { "banque d'images": 2 } });
  assert.match(s, /^# Sources des photos \(ff refonte\)/);
  assert.match(s, /\| `facade\.jpg` \| https:\/\/www\.plomberie-martin\.fr\/img\/facade\.jpg \| https:\/\/www\.plomberie-martin\.fr\/a-propos \| Façade \| 800 × 600 \| trop petite/);
  assert.match(s, /Écartées : 2 banque d'images\./);
});
