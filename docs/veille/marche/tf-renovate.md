# Renovate (ThemeForest) — https://quanticalabs.com/wp_themes/renovate/
Titre « Renovate – Construction WordPress Theme », `lang="en-US"`, technologie lue : WordPress 6.1, WPBakery Page Builder, Slider Revolution 6.6, WooCommerce 7.6, reCAPTCHA ; démo de l'éditeur QuanticaLabs. Démontage à la main du 2026-10-19 : **mesuré sur le code, pas sur capture** (HTML récupéré par `curl`, aucun navigateur) ; l'ordre du premier écran est celui du HTML.

## Squelette
Premier écran (ordre du HTML) : barre haute « +149 75 23 222 35 » (lien `tel:`), e-mail, « Mon - Fri: 08.00 - 17.00 », panier ; nav à sous-menus (Home, Services, Projects, Our team, Pages, Blog, **Cost calculator**, Shop, Contact) ; carrousel de trois diapositives (« Home improvements and remodeling » avec « over 15 years experience », « Professional tiling and painting services », « Your most affordable contractors »), chacune avec un bouton « Buy this theme ». **Aucun h1** dans la page.
Ordre : bandeau « Cost of renovation — Use our form to estimate the initial cost of renovation or installation » + « Request a quote » → 3 services avec photo → 4 projets récents (peinture, jardin, intérieur, solaire) → « About us » (15 ans d'expérience, matériaux, standards ; onglets offre / garantie / services en faux latin) → « Why choose Renovate » (« Founded by Kevin Smith back in 2000 ») → 3 témoignages identiques → 12 logos « We work with » → pied (téléphone, adresse, e-mail).
Structure : plusieurs pages (6 services, 8 projets, équipe, blog, boutique, calculateur, contact). Téléphone cliquable : 1 lien `tel:` en barre haute. Formulaire : aucun sur l'accueil (recherche seulement). Horaires : en barre haute.
**Calculateur** (page `/cost-calculator/`, lue dans le HTML) : surface en pieds carrés, murs, sols, portes, fenêtres → coût total estimé, puis nom, e-mail, téléphone pour recevoir le devis.

## Typographie
Lue dans le HTML : Raleway 300/400 (Google Fonts). Hors liste « IA ».

## Couleur et matière
Non mesurée. 25 `<img>` : photos de banque de démonstration (`image_01…07`), 12 logos de partenaires fictifs.

## Mouvement
Slider Revolution en premier écran. Rien d'autre de lu.

## Le geste signature
**Le calculateur de coût** : une estimation en cinq champs avant de laisser ses coordonnées. C'est la porte « devis » transformée en outil.

## Ce qu'on garde / ce qu'on refuse
Garde : l'idée d'une estimation en ligne qui donne un ordre de prix avant le contact, horaires et téléphone en barre haute, projets récents sur l'accueil.
Refuse : aucun h1, trois messages qui tournent, textes en faux latin, témoignage copié trois fois, boutique WooCommerce chargée pour un couvreur.

## Verdict marché (veille du 19 oct 2026, tour 4)
Source : ThemeForest, recherche « local business » triée par ventes : les 10 premiers sont des annuaires (ListingPro 33,2 k ventes, MyListing…) ou des thèmes d'entreprise, aucun pour un artisan ; recherche « roofing » triée par ventes (https://themeforest.net/search/roofing?sort=sales), **rang 1 : Renovate, 6,1 k ventes, 79 $** (lue par WebFetch ; `curl` reçoit un 403 sur la page d'aperçu, démo trouvée sur le site de l'éditeur). URL lue : https://quanticalabs.com/wp_themes/renovate/ (HTML 129 Ko, premier octet 0,5 s depuis le proxy).

**Un artisan paierait-il 1 200 € pour ça ?** Pour le calculateur, peut-être : c'est le seul des 36 sites qui calcule une estimation à partir des mesures du client avant l'appel. Pour le reste, non : pas de h1, des textes de remplissage, des preuves recopiées.

**Leviers vus** : Photos réelles : non (démonstration). Premier écran : téléphone, e-mail et horaires en barre haute, carrousel de trois messages, « over 15 years experience » ; pas de h1. Preuves : années, 12 logos, 3 témoignages (fictifs). Structure : plusieurs pages, une par service et par projet. Appels : « Request a quote » vers le calculateur, « View all services », « View project » (×4). Vitesse : HTML 129 Ko. Mobile : non mesuré.
