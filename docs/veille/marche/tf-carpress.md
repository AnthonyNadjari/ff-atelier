# CarPress (ThemeForest) (https://demo.proteusthemes.com/carpress/)
Titre « CarPress - The Mechanic WordPress Theme Demo », `lang="en-US"`, description « CarPress is a ProteusThemes WordPress theme for mechanic companies… », technologie lue : WordPress, Contact Form 7, WooCommerce. Thème de ProteusThemes, 3 000 ventes environ, 199 $. Démontage à la main du 2026-10-23 : **mesuré sur le code, pas sur capture** (HTML récupéré par `curl`, aucun navigateur) ; l'ordre du premier écran est celui du HTML.

## Squelette
Premier écran (ordre du HTML) : lien téléphone en tête « **Tap here to call us** (1800-123-456) » ; logo ; nav (accueil en 3 versions, services, boutique, tarifs, galeries, blog, à propos, équipe, contact, « Make an Appointment ») ; carrousel de 3 photos plein cadre (réparation, vieille voiture, mécanicien) avec 3 accroches « Repairing cars since 1966 »… en faux latin. **Aucun h1.**
Ordre : **« Opening Time » : horaires jour par jour, pause de midi comprise** → 3 encarts (« Huge sale on all tires », « Get a free repair quote », « Send us a photo of a problem », « Contact » avec téléphone et adresse) → présentation du thème → 3 services (inspection, diagnostic, performance) → **formulaire « Get a free repair quote » avec un champ « Attach photo »** → 2 témoignages → équipe de 6 personnes nommées par rôle avec photo → galerie de 10 photos → 5 logos factices → widgets de blog (Facebook, articles, commentaires).
Structure : environ 35 pages (services, tarifs, galeries, boutique, équipe, prise de rendez-vous). Téléphone cliquable : 1 lien `tel:`, en tête. Formulaire : oui, sur l'accueil.

## Typographie
Lue dans le HTML : Open Sans et Roboto (Google Fonts).

## Couleur et matière
Non mesurée. 28 `<img>` : 3 photos de carrousel en 1 920 px, photos de services, 6 portraits de banque d'images (« photodune »), galerie, logos factices.

## Mouvement
Carrousel du haut ; non mesuré à l'écran.

## Le geste signature
Le **devis sur photo** : le client envoie la photo de sa panne avec sa demande.

## Ce qu'on garde / ce qu'on refuse
Garde : téléphone en tout premier élément, horaires de la semaine juste sous le premier écran, devis sur photo, page de tarifs, prise de rendez-vous dans la nav.
Refuse : aucun h1, faux latin, carrousel en premier écran, logos factices, widgets de blog sur l'accueil.

## Verdict marché (veille du 23 oct 2026, tour 5)
Source : ThemeForest, recherche « handyman » triée par ventes (https://themeforest.net/search/handyman?sort=sales) : rangs 1 à 3 déjà étudiés (BuildPress, Constructo, Renovate), rang 4 Exponent (thème d'entreprise générique, écarté), **rang 5 CarPress**. La recherche « plumber » triée par ventes ne rend que des thèmes déjà étudiés ou dont la démo refuse les requêtes sans navigateur (TheBuilt, Renovation de ProgressionStudios, Spectrum : 403 ou défi Cloudflare). Page lue par WebFetch (`curl` reçoit un 403 sur ThemeForest). URL lue : https://demo.proteusthemes.com/carpress/ (HTML 83 Ko, premier octet 1,2 s depuis le proxy ; images datées de 2013 et 2014 dans les chemins).

**Un artisan paierait-il 1 200 € pour ça ?** Pour le dessin, non (vieux, faux latin, pas de titre). Pour trois idées, oui : le téléphone en tout premier, les horaires tout de suite, et le devis où l'on joint la photo de la panne.

**Leviers vus** : Photos réelles : non (démonstration et banque d'images). Premier écran : « Tap here to call us », carrousel, horaires juste dessous. Preuves : 2 témoignages, équipe de 6 en photo, 5 logos factices. Structure : environ 35 pages, page tarifs, formulaire de devis sur l'accueil. Appels : téléphone (en tête), « Make an Appointment », « Get a free repair quote » (×2), « Read More » par service. Vitesse : HTML 83 Ko, premier octet 1,2 s. Mobile : balise viewport présente ; rendu non mesuré.
