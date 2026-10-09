# Audit SEO — finckfisch.vercel.app (8 octobre 2026)

Audit en lecture seule (curl sur le site en ligne + lecture de `sites/finck-fisch/` et `src/`). Aucun navigateur, aucune mesure Lighthouse/CrUX : les remarques de vitesse sont tirées du HTML servi. Les compétences claude-seo n'ont pas été lancées (elles déclenchent plusieurs agents en parallèle) ; leur grille a été suivie à la main.

**Note globale estimée : 52/100** (estimation de l'auditeur, pas un score d'outil). Base technique saine, mais le site ne peut pas être indexé correctement tant que le canonical pointe vers un domaine qui n'existe pas, et les données de contact sont des valeurs de test.

## 1. Constat principal : le site se renvoie vers un domaine inexistant

`sites/finck-fisch/domain.txt` contient `finckfisch.fr`, que `astro.config.mjs` (l. 84) utilise comme `site`. Résultat sur toutes les pages servies par vercel.app :

- `<link rel="canonical" href="https://finckfisch.fr/...">`
- `og:url` et `og:image` en `https://finckfisch.fr/...` (image cassée au partage : lien, WhatsApp, LinkedIn)
- `robots.txt` : `Sitemap: https://finckfisch.fr/sitemap-index.xml`
- `sitemap-0.xml` : 7 URL en `finckfisch.fr`
- `llms.txt` : liens en `finckfisch.fr`
- JSON-LD `url` et `image` en `finckfisch.fr`

Or `finckfisch.fr` ne résout pas (NXDOMAIN au 8 oct.). Google déclare donc comme version de référence une URL inaccessible : au mieux il ignore le canonical, au pire il n'indexe rien. Le sitemap serait rejeté dans une Search Console ouverte sur vercel.app (URL hors propriété).

Deux options :
- **A (recommandée si le domaine est acheté sous 2 semaines)** : ne rien soumettre, acheter le domaine, brancher sur Vercel, et tout redevient cohérent sans toucher au code.
- **B (si l'achat traîne)** : remplacer temporairement `domain.txt` par `finckfisch.vercel.app`, redéployer, et repasser à `finckfisch.fr` le jour de l'achat (Vercel redirigera ensuite le .vercel.app en 308 si on le configure). Inconvénient : il faudra une migration de domaine dans Google plus tard. Avec un site de 5 pages indexables, c'est sans gravité.

## 2. Pages : titres, descriptions, titres de section

| Page | `<title>` | Description | H1 |
|---|---|---|---|
| `/` | Finck & Fisch \| Studio de sites pour artisans à Paris (54 c.) | 160 c., **coupée en plein mot** (« jamais d’un mod ») | « Votre métier mérite mieux qu’un template. » |
| `/services/site-vitrine` | Création de site vitrine à Paris — Finck & Fisch | 71 c. (le `short`) | Création de site vitrine |
| `/services/refonte` | Refonte de site existant à Paris — … | 81 c. | Refonte de site existant |
| `/services/identite-visuelle` | Signature e-mail et identité visuelle légère à Paris — … | 74 c. | idem titre |
| `/services/visibilite-locale` | Fiche Google et visibilité locale à Paris — … | 71 c. | idem titre |
| `/mentions-legales`, `/confidentialite`, 404 | ok | noindex (bien) | ok |

Problèmes :
1. **« à Paris » partout** alors que le studio vend « toute la France, à distance » et que l'adresse 75000 Paris est un placeholder (commentaire en tête de `site.config.ts`). Le titre est déduit de `business.trade` + `contact.address.city` (`Base.astro` l. 38). Il cible « Paris », ville la plus concurrentielle de France, avec une adresse fausse.
2. **Description d'accueil tronquée** : `Base.astro` l. 39 fait `slice(0, 160)` sur `business.description`. `site.seo.description` est vide.
3. **H1 de l'accueil sans mot-clé** : « Votre métier mérite mieux qu’un template. » ne contient ni « site », ni « artisan », ni « vitrine ». Garder la phrase (c'est la marque) mais faire porter le mot-clé ailleurs : titre, description, premier paragraphe et un H2.
4. **H2 en double sur chaque page** : « Dites-nous ce que vous faites. » et « Parlons de votre projet » (tiroir de contact) apparaissent sur toutes les pages, y compris légales. Peu grave, mais le tiroir pourrait utiliser un `<p>` stylé ou un `<h2>` seulement dans le dialog ouvert.
5. **Pages services minces** : ~330 mots, dont le texte commun. La page `/services/site-vitrine` est celle qui doit ranker sur « création site vitrine artisan » et elle ne mentionne ni le prix (1 200 € / 1 800 €), ni le délai de 72 h, ni le mot « artisan » dans son titre.
6. Le mot « prix » n'apparaît nulle part sur l'accueil (on lit « Combien ça coûte » et « Dès 1 200 € ») : la requête « site internet artisan prix » n'a pas de page qui lui répond franchement.

## 3. JSON-LD

Accueil : un seul nœud `LocalBusiness`. Pages services : `LocalBusiness` + `Service`.

Problèmes :
- **`LocalBusiness` avec adresse 75000 Paris et téléphone `+33600000000`** : données fausses balisées. Google rapproche ces données de la fiche Google et des annuaires ; un NAP faux est pire qu'absent.
- **Type inadapté** : un studio sans local qui reçoit du public n'est pas un `LocalBusiness` au sens de Google (qui attend une adresse visitable). Mieux : `ProfessionalService` (sous-type de LocalBusiness, accepté sans adresse de rue) ou `Organization` + `Service`. Si l'adresse doit rester privée, ne mettre que `addressLocality`/`addressRegion`/`addressCountry` réels, ou pas d'`address` du tout, et déclarer `areaServed: { "@type": "Country", "name": "France" }`.
- **`areaServed: []`** sur l'accueil (vide, car `zones.cities` est vide) et **`areaServed: City Paris`** sur les services (repli de `src/lib/jsonld.ts` l. 82-85 sur la ville de l'adresse) : contradictoire avec « toute la France ».
- **`description` du JSON-LD = description tronquée**.
- **Pas d'`Offer` chiffrée** : `services[].priceFrom` n'est pas renseigné, donc `src/lib/jsonld.ts` l. 86 n'émet rien. Et même renseigné, il émet `Offer.description` (texte) au lieu de `price` + `priceCurrency`. Les prix 1 200 € et 1 800 € sont réels et affichés : ils peuvent aller en `offers` (`"price": "1200", "priceCurrency": "EUR"`).
- **FAQ visible mais sans `FAQPage`** : les 5 questions sont dans `sections/Offre.astro` (H3 « Les questions qu’on nous pose ») ; `index.astro` l. 23 n'émet `FAQPage` que pour une section de type `faq`. Google n'affiche plus les FAQ en résultat enrichi pour ce type de site depuis 2023, mais le balisage reste utile pour les moteurs IA. Gain modeste.
- **Pas de `WebSite`** ni d'`Organization` avec `logo` : utile pour le nom de site et le logo dans les résultats Google.
- `sameAs: []` : à remplir quand des profils existeront (fiche Google, LinkedIn, Instagram). Ne rien inventer.
- Interdits rappelés : **pas d'`aggregateRating`, pas de `review`**, pas de nombre de clients.

Exemple de nœud cible pour l'accueil (à adapter au domaine réel, valeurs réelles uniquement) :

```json
{
  "@type": "ProfessionalService",
  "@id": "https://finckfisch.fr/#studio",
  "name": "Finck & Fisch",
  "description": "Studio de création de sites vitrines pour artisans, commerces et indépendants. Site livré en 72 heures, à partir de 1 200 €, payé une fois.",
  "url": "https://finckfisch.fr/",
  "logo": "https://finckfisch.fr/logo.png",
  "email": "contact@finckfisch.fr",
  "telephone": "<vrai numéro>",
  "areaServed": { "@type": "Country", "name": "France" },
  "priceRange": "1200 € – 1800 €",
  "makesOffer": [
    { "@type": "Offer", "name": "Site vitrine Essentiel", "price": "1200", "priceCurrency": "EUR" },
    { "@type": "Offer", "name": "Site vitrine Complet", "price": "1800", "priceCurrency": "EUR" }
  ]
}
```

(Vérifier les noms exacts des formules dans `sections/Offre.astro` avant de les reprendre.)

## 4. Technique

Bien :
- HTTPS, HSTS, CSP stricte, `nosniff`, pas de traceur tiers.
- 404 renvoie bien un code 404 et `noindex`. Pages légales en `noindex`.
- `lang="fr"`, `og:locale fr_FR`, viewport correct, favicon/apple-touch/manifest présents.
- 9 images, toutes avec `alt` ; image du hero préchargée en AVIF avec `srcset` ; 2 polices préchargées en woff2 auto-hébergées.
- Temps de réponse 0,2-0,5 s (CDN Vercel, `cdg1`).
- `robots.txt` ouvert, robots IA de recherche autorisés explicitement.
- HTML : ~130 Ko dont ~93 Ko de CSS en ligne. Acceptable (compressé ~20 Ko) mais à surveiller : c'est du CSS de toutes les directions/coquilles ? À vérifier ; si oui, l'élaguer réduit le premier rendu sur mobile 4G.

À corriger :
- **Canonical / sitemap / OG en domaine inexistant** (section 1).
- **Image OG** : `hero.webp` 1600×1200 (ratio 4:3, WebP, « composition abstraite, image de démonstration »). Préférer une image dédiée **1200×630 en JPG ou PNG** (le WebP n'est pas lu partout, LinkedIn notamment), avec le nom du studio et une phrase lisible. Champ : `images.og` dans `site.config.ts`, fichier dans `sites/finck-fisch/public/images/`.
- **Images de services = « image de démonstration »** (alt et contenu) : remplacer par de vraies captures des sites livrés ou de la fabrique.
- **Mentions légales : hébergeur faux** (Cloudflare affiché, site sur Vercel) et **aucun SIRET/forme juridique**. Obligation légale (LCEN art. 6) plus qu'un point SEO, mais Google et les clients regardent ces pages pour juger du sérieux. Champs : `legal.host` (défaut Cloudflare dans `src/lib/schema.ts` l. 323) et ajout des mentions d'entreprise dès l'immatriculation.
- `/services/site-vitrine/` (avec barre finale) répond 200 sans redirection : contenu dupliqué rattrapé par le canonical, sans gravité.
- Canonical de la 404 = `/404` : sans effet (page en noindex).
- `meta keywords` : ignoré par Google et Bing, sans danger, inutile.

## 5. Maillage interne

- Accueil → 4 pages services, mentions, confidentialité : correct.
- **Les « Exemples » ne renvoient vers rien** : images seules, aucun lien vers les sites en ligne. Lier chaque exemple à son site (s'il est public et que le client est d'accord) ou à une page `/realisations/<slug>` décrivant le métier, le besoin, le délai réel. C'est la meilleure preuve possible et un contenu que personne d'autre n'a.
- Pages services entre elles : pas de liens croisés (« voir aussi la refonte »).
- Pas de page « Tarifs » dédiée ni de page « Méthode/72 h » : les deux arguments uniques n'ont pas d'URL propre.

## 6. Recherche IA (GEO) et citabilité

Bien : `llms.txt` présent et propre (contact, services, FAQ), robots IA autorisés, FAQ en texte réel, réponses courtes et honnêtes (« Nous ne promettons pas de première place »).

Manques :
- `llms.txt` ne contient **ni les prix ni le délai de 72 h** : ce sont précisément les faits qu'un moteur IA cite (« combien coûte un site vitrine pour artisan »). Il contient aussi le faux téléphone et « 75000 Paris ».
- Peu de phrases autonomes citables sur l'accueil. Un paragraphe du type : « Finck & Fisch crée des sites vitrines pour artisans en 72 heures. Le site Essentiel coûte 1 200 €, le site Complet 1 800 €, payés une fois, sans abonnement. Le code et le nom de domaine appartiennent au client. » est repris tel quel par ChatGPT, Perplexity et les AI Overviews.
- Aucune mention de la marque ailleurs sur le web (annuaires, LinkedIn, Malt, articles) : les moteurs IA s'appuient sur ces mentions tierces bien plus que sur le site lui-même.
- Pas de nom des deux associés sur le site (« Deux personnes, pas une agence » sans prénoms ni photo) : signal E-E-A-T faible pour un service de confiance. Mettre les vrais prénoms, rôles et un lien LinkedIn si les associés l'acceptent.

## 7. Se positionner sur « création site vitrine artisan » et « site internet artisan prix »

Ces requêtes sont tenues par des agences nationales, des plateformes (Wix, Jimdo, Simplébo, Solocal, Hubspot-like) et des comparatifs de prix. Le site ne peut pas les gagner avec 5 pages ; il peut viser la longue traîne et les requêtes de prix.

À faire, par ordre :
1. **Page `/services/site-vitrine` réécrite pour la requête principale** : titre « Création de site vitrine pour artisan, livré en 72 h | Finck & Fisch », H1 qui contient « site vitrine » et « artisan », prix affichés, ce qui est inclus, délai, ce qui n'est pas inclus, FAQ propre à la page. Viser 600-900 mots utiles.
2. **Page `/tarifs` (ou `/prix-site-internet-artisan`)** : tableau Essentiel/Complet, ce qui fait varier un prix de site, comparaison honnête abonnement mensuel vs paiement unique sur 3 ans (calcul vérifiable, sans chiffres inventés sur les concurrents ; citer des prix publics avec la date du relevé ou rester générique).
3. **Pages par métier** (`/site-internet-plombier`, `/site-internet-boulanger`, `/site-internet-coiffeur`…) seulement quand un vrai exemple du métier existe dans la fabrique. Une page par métier avec la direction visuelle proposée et ce qu'un site de ce métier doit contenir. Pas de pages villes en série (le studio vend à distance ; le site lui-même dit « jamais d’un modèle décliné par ville »).
4. **Études de cas** `/realisations/<slug>` : métier, besoin, délai réel, captures avant/après. Uniquement des projets réels, avec accord du client.
5. **Articles guides** (3 à 5 pour commencer) répondant aux questions des prospects : « Combien coûte un site internet pour un artisan en 2026 », « Site vitrine ou fiche Google : par quoi commencer », « Abonnement ou paiement unique : le vrai coût sur trois ans », « Mentions légales d'un site d'artisan : ce qui est obligatoire ».

## 8. Une fois le domaine acheté

1. Brancher `finckfisch.fr` sur Vercel, `www` redirigé en 308 vers l'apex (ou l'inverse, un seul), et `finckfisch.vercel.app` redirigé en 308 vers le domaine (Vercel : Settings > Domains > Redirect).
2. Vérifier que `domain.txt` = `finckfisch.fr`, rebuild : canonical, sitemap, OG, llms.txt et JSON-LD deviennent cohérents automatiquement.
3. **Google Search Console** : propriété de type *Domaine* (vérification DNS TXT chez le registraire), soumettre `https://finckfisch.fr/sitemap-index.xml`, demander l'indexation de l'accueil et de `/services/site-vitrine`, surveiller « Pages » et « Améliorations » (données structurées) les 2 premières semaines.
4. **Bing Webmaster Tools** : importer la propriété depuis Search Console (1 clic), soumettre le sitemap. Bing alimente Copilot et une partie de ChatGPT Search. Le fichier IndexNow est déjà présent dans `public/` (`indexnow-2141…txt`) : vérifier que la clé correspond au domaine et pinger IndexNow à chaque déploiement.
5. **Fiche Google (Google Business Profile) pour le studio** : catégorie « Concepteur de sites Web », déclarée en **établissement de services sans adresse visible** (zone desservie : France ou régions ciblées), avec vrai téléphone, horaires, site, description, photos réelles du travail. Vérification par vidéo ou courrier : il faut une adresse réelle (domicile d'un associé possible, masquée au public). Ne jamais solliciter d'avis contre contrepartie ni en publier de faux ; demander un avis aux vrais clients après livraison.
6. **Annuaires de cohérence NAP** (mêmes nom, téléphone, site partout) : PagesJaunes, LinkedIn (page entreprise), Malt ou Codeur si pertinent, Apple Plans (Apple Business Connect), Bing Places (importable depuis Google). Puis `sameAs` dans le JSON-LD.
7. Adresse e-mail `contact@finckfisch.fr` réellement créée et testée (elle est déjà publiée partout).
8. Plausible ou Umami (champ `analytics` déjà prévu dans le schéma) pour suivre les conversions du tiroir de contact sans bandeau cookies.

## 9. Top 10 des corrections, par impact

| # | Correction | Fichier / champ | Bloqué par le domaine ? |
|---|---|---|---|
| 1 | Canonical, sitemap, OG, llms.txt pointent vers un domaine inexistant | `sites/finck-fisch/domain.txt` (option B : mettre `finckfisch.vercel.app` en attendant) | Oui, se règle seul à l'achat (option A) |
| 2 | Remplacer téléphone `+33600000000` et adresse 75000 Paris par des données réelles, ou retirer l'adresse | `site.config.ts` → `contact.phone`, `contact.phoneDisplay`, `contact.address` | Non |
| 3 | Titre et description d'accueil explicites, sans « à Paris » ni troncature | `site.config.ts` → `seo.title` (ex. « Création de site vitrine pour artisans, livré en 72 h \| Finck & Fisch »), `seo.description` (≤ 155 c., avec 1 200 € et 72 h) | Non |
| 4 | Retirer « à Paris » des titres de services | `src/pages/services/[slug].astro` (gabarit du titre) ou `seo.title` par service ; ou corriger `contact.address.city` | Non |
| 5 | JSON-LD : `ProfessionalService`, `areaServed` France, `offers` avec `price`/`priceCurrency`, `logo`, nœud `WebSite` | `site.config.ts` → `business.schemaType: 'ProfessionalService'`, `zones` ; `src/lib/jsonld.ts` l. 82-86 (repli ville → pays, Offer chiffrée) ; `src/layouts/Base.astro` l. 72-95 | Non (URL à jour après achat) |
| 6 | Enrichir `/services/site-vitrine` : titre/H1 avec « artisan », prix, 72 h, inclus/exclus, FAQ dédiée, 600 mots+ | `site.config.ts` → `services[0].title`, `description`, `bullets`, `priceFrom` | Non |
| 7 | Image OG dédiée 1200×630 JPG | `node scripts/ff.mjs og finck-fisch` (renseigne `images.og`) ou fichier manuel dans `public/images/` | Non (URL absolue correcte seulement après achat ou option B) |
| 8 | Paragraphe factuel citable (prix, délai, propriété) sur l'accueil + dans `llms.txt` | `site.config.ts` → `business.description` ; `src/pages/llms.txt.ts` (ajouter offres et délai) | Non |
| 9 | Exemples cliquables vers les sites réels ou des études de cas `/realisations/<slug>` ; prénoms des associés | `sections/Realisations.astro`, `sections/Humains.astro` | Non |
| 10 | Search Console, Bing Webmaster, IndexNow, fiche Google « Concepteur de sites Web » en zone desservie | hors code | Oui |

Annexes à traiter ensuite : mentions légales (hébergeur Vercel au lieu de Cloudflare via `legal.host`, SIRET dès l'immatriculation), `FAQPage` émis aussi pour la FAQ de `sections/Offre.astro` (`src/pages/index.astro` l. 23), H2 du tiroir de contact répété, pages `/tarifs` et pages métiers, articles guides.
