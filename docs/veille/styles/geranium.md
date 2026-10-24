# Geranium — https://www.geranium.dk/
Titre « Geranium », `lang="en"`, description « Restaurant, Private dining & Conference », technologie lue : jQuery. Démontage automatique du 2026-10-24 (`ff demonter`, mesures brutes dans `geranium.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; pas de média plein écran (4 image(s) dans l'écran) ; bouton principal « Gift card » en haut à droite (1203, 0 px, dans une barre fixe) ; 82 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; pas de média plein écran (2 image(s) dans l'écran) ; bouton principal « Gift card » en bas à gauche (10, 791 px, dans une barre fixe) ; 105 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : non mesuré.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.w100` (0,4 écran, 0 mots, 0 img) → `div.vh60` « Welcome to Geranium » (0,6 écran, 77 mots, 0 img) → `div.social` (0,2 écran, 4 mots, 0 img) → `div.vh80` « Dinner in the canopy » (0,8 écran, 70 mots, 0 img) → `div.instagram` (0,2 écran, 8 mots, 0 img) → `div.pos-rel` « Menu » (1,0 écran, 67 mots, 0 img) → `div.social` (0,2 écran, 0 mots, 0 img) → `div.vh85` (0,9 écran, 182 mots, 0 img) → `div.social` (0,2 écran, 0 mots, 0 img) → `div.vh100` « Fireplace Table » (1,0 écran, 107 mots, 0 img) → `div.social` (0,2 écran, 7 mots, 0 img) → `div.vh100` « Press Inquiries & Careers » (1,0 écran, 118 mots, 0 img). Calques hors flux (fixes/absolus) : `button#nav-toggle` (fixed, 54 px), `a#gift` (fixed, 52 px, 2 mots), `a#booking` (fixed, 38 px, 3 mots), `img#lp-teaseBtn-asiyncr21e2Z2G3D87wiadonfke` (fixed, 1 px, collé en bas).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : aucun. Horaires : oui (5 jours nommés, 8 heures, ex. « Tuesday to Friday 9:00 - 15:00 at +45 6996 0020 (the offic »). Portes d'action : « Reservations » (/en/reservations), « Menu Lunch & Dinner » (/en/menu), « Facebook » (https://www.facebook.com/restaurantgeranium), « Visit Geranium on Facebook » (https://www.facebook.com/restaurantgeranium), « Click here to book a table via SevenRoom » (https://www.sevenrooms.com/explore/geranium/reservations/create/search/?lang=en), « Book a table » (#ft-open), « contact our Booking Team » (/en/reservations), « Gift card » (#).
En 3 secondes : à juger sur `captures/geranium-d.webp` (mesuré : fond du premier écran #ffffff, 4 image(s) et 82 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 **TrajanProRegular**, 22 px / 22 px téléphone, graisse 400, interlignage 1,18, interlettrage 2.2px ; corps **Muli**, 13 px / 13 px téléphone, graisse 400, interlignage 1,54, interlettrage 0.4px ; boutons **Arial**, 13 px / 13 px téléphone, graisse 400 ; nav : non mesuré.
Sources `@font-face` : auto-hébergée (TrajanProRegular) ; fichiers chargés : https://fonts.gstatic.com/s/muli/v34/7Auwp_0qiz-afTLGLQ.woff2, https://www.geranium.dk/Fonts/trajanpro-regular-webfont.woff, https://fonts.googleapis.com/css?family=Muli:300italic,300,400,400italic. Familles en usage sur le texte visible : Muli ×74, TrajanProRegular ×18. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #636363 (contraste 6,01:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (91 %), #f2f2f2 (4 %), #e5e5e5 (3 %), #f5f5f5 (1 %), #dddddd (1 %) ; textes par nombre de caractères : #636363 (94 %), #9ead5a (3 %), #686a6a (2 %), #303131 (2 %). Images : 0 `<img>` visibles, 15 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.6s ease` ×52, `all 0.8s ease` ×32, `all 0.3s ease` ×18, `filter 0.2s ease` ×4, `background 0.4s ease` ×2, `all 0.4s ease` ×1, `background-color 0.4s ease` ×1, `fill 0.2s ease` ×1, `background 0.2s ease` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/geranium-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.pos-rel` « Menu » (1,0 écran, 67 mots, 0 image(s)).
2. L'élément le plus animé : `div.grid` (1 transition(s) : all 0.6s ease).
3. Le bloc le plus singulier par sa structure : `div.vh100` « Press Inquiries & Careers » (seule à contenir <table>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : horaires sur l'accueil, portes d'action nommées (« Reservations », « Menu Lunch & Dinner », « Facebook », « Visit Geranium on Facebook », « Click here to book a table via SevenRoom », « Book a table », « contact our Booking Team », « Gift card »).
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/3 ordinateur, 0/3 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
