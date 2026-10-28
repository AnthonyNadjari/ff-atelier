# Buvette — https://buvette.com/
Titre « Buvette », `lang="en-US"`, description « Buvette is part bar, part restaurant, part cafe, open from sunlight to candlelight. Enjoy good food and drinks all day. Walk in any time of the day to enjoy en… », technologie lue : Squarespace, jQuery. Démontage automatique du 2026-10-28 (`ff demonter`, mesures brutes dans `buvette.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; image plein écran (100 % de l'écran) ; bouton principal « Explore your accessibility options » en bas à droite (1372, 828 px, dans une barre fixe) ; 55 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; image plein écran (100 % de l'écran) ; bouton principal « Explore your accessibility options » en bas à droite (322, 772 px, dans une barre fixe) ; 51 mots visibles au-dessus du pli ; aucune couche bloquante ; bouge tout seul sans défilement : 9 élément(s) (`a`, `div.title-nav-wrapper`, `div#yui_3_17_2_1_1793196681602_541`, `div#yui_3_17_2_1_1793196681602_562`, `div#yui_3_17_2_1_1793196681602_426`).
Nav : 1 lien(s) — BUVETTE ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `section#content-wrapper` « Buvette: dedicated to the enjoyment of … » (4,1 écrans, 138 mots, 19 img) → `footer#footer` (0,8 écran, 73 mots, 1 img). Calques hors flux (fixes/absolus) : `a.audioeye-skip-link` (absolute, 1 px, 4 mots), `div#ae_enabled_site` (absolute, 1 px, 45 mots), `header#header` (absolute, 60 px, 6 mots).
Pied de page : 6 lien(s) — TOP, Careers, Contact us, Accessibility, ABCeats, Privacy. Téléphone cliquable : non. Formulaire : aucun. Horaires : oui (6 jours nommés, 12 heures, ex. « Sunday - Wednesday 8am to 9pm Thursday - Saturday 8am to 10 »). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/buvette-d.webp` (mesuré : fond du premier écran #ffffff, 2 image(s) et 55 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 : non mesuré ; corps **livory**, 17 px / 17 px téléphone, graisse 400, interlignage 1,80, interlettrage 0.255px ; boutons **livory**, 19 px / 15 px téléphone, graisse 400, interlignage 1,00, interlettrage 0.255px ; nav **livory**, 19 px / 15 px téléphone, graisse 400, interlignage 1,00, interlettrage 0.255px.
Sources `@font-face` : tiers (file.squarespace-cdn.com) (PT Serif) ; Adobe Fonts (livory, proxima-nova, mrs-eaves-roman-small-caps, futura-pt, mrs-eaves) ; fichiers chargés : https://use.typekit.net/ik/XWbZffYTUfGiX4WQvtwzD453iSmTsZGn95qW_akqv6JfeTwffFHN4UJLFRbh52jhWD9aZ2mRjhBKw2wu5QZ8Fe9ujcmcFeBqjyGMJ6ZC-WZzS1qK2YgkdayTdAIldcNhjPJ-dW4DOAmyicmDOW4zdAB0OWFljAUCOAFySYwKfAZuiYmkjPu3ifJ4dW4DOAmyicmDH6qJ38MbMg6IJMJ7fbRI9gMMeMS6MKG4fwFbIMMj2KMfH6qJUmMbMg6sJMJ7fbRKHyMgeMw6MKG4fHvgIMIjgfMfH6qJK3IbMs6YJMJ7fbRRHyMgeMX6MKG4fJ3gIMIjIPMfH6GJzltgIMJjgfMfH6qJ6m9bMU6YJMJ7fbKfmsM2egI6MKGHfwQpMsMIeMb6MKGHfwWpMsMIeMS6MTMgzTOFDbj.js, https://use.typekit.net/af/10c018/00000000000000007735b2f9/31/l?subset_id=2&fvd=n4&v=3, https://use.typekit.net/af/8b225b/00000000000000007735d6c0/31/l?subset_id=2&fvd=n4&v=3, https://use.typekit.net/af/6707aa/00000000000000007735d6b5/31/l?subset_id=2&fvd=i4&v=3, https://use.typekit.net/af/af2452/00000000000000007735b300/31/l?subset_id=2&fvd=n7&v=3, https://use.typekit.net/af/b91827/00000000000000007735d6c3/31/l?subset_id=2&fvd=n7&v=3. Familles en usage sur le texte visible : livory ×26, josefin sans ×12, mrs-eaves-roman-small-caps ×6. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #831518 (premier écran #ffffff), texte #1a577d (contraste 1,30:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (55 %), #831518 (45 %), #000000 (0 %) ; textes par nombre de caractères : #1a577d (62 %), #ffffff (26 %), #010c13 (10 %), #960808 (2 %), #4d0505 (1 %). Images : 20 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s), `mask-image`/`clip-path` sur 6 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `opacity 0.2s ease` ×3, `background-color 0.1s linear` ×2, `border-color 0.1s linear` ×2, `opacity 0.3s linear` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : `data-animation-role` ×6, `data-modulename` ×1. Ce qui bouge réellement à l'écran : à juger sur `captures/buvette-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `section#content-wrapper` « Buvette: dedicated to the enjoyment of … » (4,1 écrans, 138 mots, 19 image(s)).
2. L'élément le plus animé : `p` (attributs data-modulename).
3. Le bloc le plus singulier par sa structure : aucune section ne contient de balise rare (table, details, canvas, video, svg, form, dl…).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : horaires sur l'accueil.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/5 ordinateur, 0/6 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
