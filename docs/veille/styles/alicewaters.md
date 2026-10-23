# The Edible Schoolyard Project — https://alicewaters.com/
Titre « The Edible Schoolyard Project | », `lang="en"`, technologie lue : generator « Drupal 7 (http://drupal.org) », Drupal, jQuery. Démontage automatique du 2026-10-23 (`ff demonter`, mesures brutes dans `alicewaters.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; image plein écran (86 % de l'écran) ; bouton principal « DONATE » en haut à droite (1187, 43 px, dans une barre fixe, dans la nav) ; 10 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; pas de média plein écran (3 image(s) dans l'écran) ; bouton principal « DONATE » en haut au centre (192, 38 px) ; 1 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 4 lien(s) — ABOUT US, TRAINING, STORIES & EVENTS, [DONATE] ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div#block-system-main` (4,5 écrans, 23 mots, 7 img) → `div#footer` (0,3 écran, 28 mots, 4 img). Calques hors flux (fixes/absolus) : `div#header` (fixed, 122 px, 10 mots).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : 1 (6 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/alicewaters-d.webp` (mesuré : fond du premier écran #fcecb9, 2 image(s) et 10 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 : non mesuré ; corps **Muli**, 12 px / 12 px téléphone, graisse 400, interlignage 1,33 ; boutons **Arial**, 18 px / 18 px téléphone, graisse 600, capitales ; nav **Muli**, 14 px, graisse 900, interlignage 1,25, capitales, interlettrage 1.25px.
Sources `@font-face` : feuilles d'origine croisée non lisibles (fonts.googleapis.com) ; fichiers chargés : https://fonts.googleapis.com/css?family=Maitree:200,300,400,500,600,700|Oswald:300,400,500,600,700|Muli:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i|Taviraj:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&subset=latin-ext. Familles en usage sur le texte visible : Muli ×19, Maitree ×2. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff (premier écran #fcecb9), texte #323232 (contraste 12,82:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (39 %), #f2f2ef (32 %), #fcecb9 (30 %), #f16b2b (0 %), #f26b2c (0 %) ; textes par nombre de caractères : #000000 (36 %), #323232 (31 %), #962061 (22 %), #ffffff (8 %), #142a00 (4 %). Images : 8 `<img>` visibles, 1 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.2s ease-in-out` ×20, `all 0.3s ease` ×7, `transform 0.4s ease` ×1, `-webkit-transform 0.4s ease` ×1, `height 0.3s ease` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/alicewaters-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div#block-system-main` (4,5 écrans, 23 mots, 7 image(s)).
2. L'élément le plus animé : `div#mm-0` (2 transition(s) : transform 0.4s ease ; -webkit-transform 0.4s ease).
3. Le bloc le plus singulier par sa structure : `div#block-system-main` (seule à contenir <form>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/3 ordinateur, 0/3 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
