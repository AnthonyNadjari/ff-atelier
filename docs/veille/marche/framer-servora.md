# Servora (Framer) (https://servora.framer.ai/)
Titre « SERVORA, Handyman & Local Home Services » (tiret du titre remplacé par une virgule), `lang="en"`, description « Reliable local professionals for repairs, maintenance, and home improvement. Get your free quote today. », technologie lue : Framer. Modèle gratuit de NEXTLVL, publié le 15 oct 2026. Démontage à la main du 2026-10-23 : **mesuré sur le code, pas sur capture** (HTML récupéré par `curl`, aucun navigateur) ; l'ordre du premier écran est celui du HTML, les versions téléphone, tablette et ordinateur sont toutes dans le HTML (textes répétés).

## Squelette
Premier écran (ordre du HTML) : bandeau « Reliable help for every home project. Get your free quote today » ; nav (Home, Services, About, Projects, Reviews, Blog, bouton « Get a Free Quote ») ; photo d'un artisan qui coupe du bois ; accroche « Local experts. Quality work. » ; h1 « We fix it. You relax. » ; boutons « Get a Free Quote » et « Explore Services » ; **« 4.9/5 Rated by 500+ Homeowners »** ; 4 cases de réassurance (500+ projets, 4.9/5, 10+ ans, « Licensed & Insured »).
Ordre : 6 services, **chacun avec un prix « From $85 » et une durée « 1–3 hours »** → pourquoi nous → « Four steps. Zero stress. » (demande, devis, créneau, intervention) → 3 projets récents → **comparateur avant / après à glisser** → zone servie (6 communes, « Same-week appointments », « Check Your Area ») → 4 chiffres → à propos → équipe de 4 personnes nommées par rôle (fondateur, technicien, plombier, électricien) → 3 témoignages → « Your home is in good hands » (4.9) → 3 promesses dont « Quality Guarantee » → FAQ → 3 articles → appel final (« Get Your Free Quote », « Call Our Team ») → formulaire de devis (20 champs).
Structure : 16 pages (une par service, une par projet, à propos, avis, blog, contact). Téléphone cliquable : 2 liens `tel:` (appel final et pied), **aucun avant le h1**. Formulaire : oui, sur l'accueil (en bas).

## Typographie
Lue dans le HTML : Inter (129 déclarations), Archivo (45). Inter est sur la liste des polices « IA » de docs/GOUT.md.

## Couleur et matière
Non mesurée. 54 `<img>` : photos de démonstration (artisan, chantier, vue aérienne, niveau à bulle), portraits d'équipe.

## Mouvement
Sous-titres écrits lettre par lettre (chaque lettre dans sa balise), comparateur avant / après au glisser ; non mesuré à l'écran.

## Le geste signature
Le **comparateur avant / après à glisser** (« Drag the handle to compare before and after »).

## Ce qu'on garde / ce qu'on refuse
Garde : prix et durée sous chaque service, note + nombre de clients juste sous les boutons, parcours en 4 étapes, avant / après, équipe nommée par rôle, zone avec « rendez-vous dans la semaine ».
Refuse : téléphone absent du haut de page, sous-titres en lettres séparées (illisibles pour un lecteur d'écran), Inter, chiffres de démonstration présentés comme vrais.

## Verdict marché (veille du 23 oct 2026, tour 5)
Source : Framer Marketplace, catégorie Home Services (https://www.framer.com/marketplace/templates/categories/home-services/), tri par défaut « Trending » (`trendingSort: popular` lu dans le HTML), **rang 1** (PlumFix, rang 1 au tour 4, est passé rang 3) ; page https://www.framer.com/marketplace/templates/servora/, gratuit, aucun chiffre de vente affiché. URL lue : https://servora.framer.ai/ (HTML 1 054 Ko, premier octet 0,5 s depuis le proxy).

**Un artisan paierait-il 1 200 € pour ça ?** Pour le plan, oui : prix d'entrée et durée par service, note sous les boutons, avant / après, équipe ; c'est le modèle le plus vendeur du tour. Pour un artisan français, non en l'état : pas de numéro en haut, pas de ville, et des chiffres qu'il faudrait avoir pour de vrai.

**Leviers vus** : Photos réelles : non (démonstration). Premier écran : h1 promesse, « Get a Free Quote », note 4.9/5 et 500+ clients, 10+ ans, « Licensed & Insured » ; pas de téléphone, pas de ville. Preuves : témoignages, équipe nommée, garantie de qualité, chiffres. Structure : 16 pages, FAQ et formulaire de devis sur l'accueil. Appels : « Get a Free Quote » (plusieurs, versions comprises), « Explore Services », « Check Your Area », « Call Our Team » (en bas). Vitesse : HTML 1 054 Ko. Mobile : version téléphone présente dans le HTML ; rendu non mesuré.
