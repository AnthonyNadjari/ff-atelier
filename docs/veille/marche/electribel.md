# Electribel — https://electribel.fr/
Titre « Électricien Strasbourg – Dépannage & Installation | Electribel », `lang="fr"`, description « Électricien à Strasbourg : dépannage, installation, mise aux normes, tableau électrique et bornes de recharge. Intervention rapide dans tout le Bas-Rhin. Devis… », technologie lue : aucune reconnue. Démontage automatique du 2026-10-28 (`ff demonter`, mesures brutes dans `electribel.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « Électricien Strasbourg » ; pas de média plein écran (1 image(s) dans l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 5 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : calque couvrant 100 % de l'écran (« ÉLECTRICITÉ GÉNÉRALE • DEPUIS 1993 ») ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « Chargement interrompu » ; pas de média plein écran (0 image(s) dans l'écran) ; bouton principal « RAFRAÎCHIR LA PAGE » à mi-hauteur au centre (85, 452 px) ; 18 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : non mesuré.
Sections de premier niveau : non mesuré. Calques hors flux (fixes/absolus) : `div#eb-loader` (fixed, 900 px, 5 mots).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/electribel-d.webp` (mesuré : fond du premier écran #050505, 1 image(s) et 5 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 : non mesuré ; corps **Inter**, 11 px / 16 px téléphone, graisse 400, interlignage 1,50, capitales, interlettrage 2.31px ; boutons : non mesuré ; nav : non mesuré.
Sources `@font-face` : auto-hébergée (Inter, Space Grotesk, JetBrains Mono) ; fichiers chargés : https://electribel.fr/fonts/inter-latin.woff2, https://electribel.fr/fonts/jetbrains-mono-latin.woff2, https://electribel.fr/fonts/space-grotesk-latin.woff2. Familles en usage sur le texte visible : Inter ×2. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #050505, texte #ffffff (contraste 20,38:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #050505 (100 %) ; textes par nombre de caractères : #ffffff (97 %), #5eeaff (3 %). Images : 1 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : aucune détectée (window.* et noms de scripts). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)` ×1, `animation eb-logo-in 0.9s cubic-bezier(0.22, 1, 0.36, 1)` ×1, `animation eb-glow 1.1s ease-out` ×1, `animation eb-tag-in 0.7s cubic-bezier(0.22, 1, 0.36, 1)` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/electribel-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : non mesuré.
2. L'élément le plus animé : `img.eb-l-logo` (animation animation eb-logo-in 0.9s cubic-bezier(0.22, 1, 0.36, 1)).
3. Le bloc le plus singulier par sa structure : non mesuré.

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : rien de mesurable.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : Inter ; boutons pilule : 0/0 ordinateur, 0/1 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : oui (calque, 100 % de l'écran) ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Verdict marché (veille du 28 oct 2026, tour 13)
Source : classés sur Google, métier tiré **électricien / domotique**, ville tirée **Strasbourg** (même tirage). Recherche étendue « électricien Strasbourg » : AlloVoisins, StarOfService, PagesJaunes (annuaires), **rang 4 electribel.fr** (entreprise familiale, installée à Furdenheim, à 15 km). URL lue : https://electribel.fr/ (HTML 7 Ko : application JavaScript, tout le contenu vient du script ; premier octet 0,47 s, indicatif). **`ff demonter` n'a capturé que l'écran de chargement** (logo sur fond noir à l'ordinateur, « Chargement interrompu » au téléphone : cause non établie ; avec un agent iPhone et 12 s d'attente la page se dessine) ; les mesures de la fiche ci-dessus portent donc sur l'écran de chargement. Capture téléphone refaite à la main (Chromium, 390x844, agent iPhone, `load` + 12 s : `captures/electribel-m-charge.png`, regardée) et texte lu dans le DOM rendu.

**Un artisan paierait-il 1 200 € pour ça ?** Oui pour le premier écran, le plus complet du tour en leviers ; non pour l'image. Au téléphone sans défiler : bouton rouge « URGENCE 24/7 » dans la barre haute, pastille « Entreprise locale en Alsace », h1 « Électricien Strasbourg », trois lignes (« Électricien local en Alsace depuis 1993 », « Intervention rapide • Sans sous-traitance », « Devis gratuit • Prix annoncés avant travaux »), « PRENDRE RDV », **le numéro écrit et cliquable**, **« 4,9/5 · 30 avis Google »**, puis quatre compteurs (« +30 ans », « +1 000 projets », « +1 000 clients », « 10 ans validité décennale ») et une barre basse Appeler / Devis gratuit. Plus bas : logos de clients (Sodexo, Bouygues Telecom, Nespresso…), six prestations, des engagements chiffrés (« Rappel sous 1h ouvrée », « intervention sous 24 h ouvrées »), habilitation, décennale, RGE Qualibat, un dossier de présentation en PDF, trois réalisations nommées et situées (une boucherie à Schiltigheim), communes, avis Google datés (« il y a 2 semaines »), FAQ, horaires, WhatsApp, formulaire. Défauts : **photos de banque ou générées** (lumière bleue identique sur les six prestations, aucune de l'équipe) ; **« 30 avis » au premier écran, « 35 avis » plus bas** ; écran de chargement plein écran puis bannière de consentement sur 40 % du téléphone ; tout le texte n'existe qu'avec JavaScript ; Inter, tirets cadratins, emoji drapeau.

**Leviers vus** : Photos réelles : non. Premier écran : urgence, métier + ville, depuis 1993, devis gratuit, prix annoncés, rendez-vous, numéro, note et nombre d'avis, barre basse. Preuves : avis, années, volumes, logos, RGE, décennale (numéro de police en pied), réalisations situées. Structure : une cinquantaine de pages lues dans le DOM rendu : une par prestation (6, « …-strasbourg »), une page urgence, **26 pages de communes** (« /electricien-obernai »…), réalisations, prise de rendez-vous (`/booking`), diagnostic, espace architectes, recrutement, blog. Appels : urgence, rendez-vous, appeler (6 `tel:`), devis, WhatsApp, diagnostic. Vitesse : HTML 7 Ko mais rien sans script, écran de chargement. Mobile : barre basse, urgence en haut.
