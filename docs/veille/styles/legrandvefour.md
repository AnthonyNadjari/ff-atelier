# Grand Vefour — https://www.legrandvefour.com/
Titre « Le Grand Véfour Paris », `lang="en-GB"`, description « Discover Le Grand Véfour, an iconic gastronomic restaurant in the heart of the Palais-Royal in Paris. Exceptional French cuisine, historic salons and a refined… », technologie lue : WordPress, jQuery. Démontage automatique du 2026-10-22 (`ff demonter`, mesures brutes dans `legrandvefour.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « Le Grand Véfour » ; image plein écran (100 % de l'écran) ; bouton principal « SKIP TO MAIN CONTENT » en haut à gauche (10, 10 px) ; 44 mots visibles au-dessus du pli ; bannière cookies 20 % de l'écran, non bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « Le Grand Véfour » ; pas de média plein écran (1 image(s) dans l'écran) ; bouton principal « SKIP TO MAIN CONTENT » en haut au centre (10, 10 px) ; 105 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : calque couvrant 100 % de l'écran («  ») ; rien ne bouge tout seul.
Nav : 4 lien(s) — [Open main menu], [RESERVATIONS], Homepage, [EN] ; boutons entre crochets. Barre fixe en bas (ordinateur) : ACCEPT ALL, REJECT ALL, MANAGE COOKIES.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.hero-multi` « Le Grand Véfour » (1,0 écran, 5 mots, 1 img) → `section#main-content` « THE MOST ANTICIPATED REVIVAL IN PARIS » (7,3 écrans, 754 mots, 9 img) → `footer.footer` « Contact us » (0,7 écran, 37 mots, 0 img). Calques hors flux (fixes/absolus) : `a.skip-to-content` (absolute, 34 px, 4 mots), `header.header` (absolute, 112 px, 2 mots), `aside#moove_gdpr_cookie_info_bar` (fixed, 181 px, collé en bas, 33 mots).
Pied de page : 14 lien(s) — [GET IN TOUCH], instagram, CONTACT, PRESS, PRIVATE EVENTS, CAREERS, GIFT CARD, PRIVACY POLICY, COOKIE POLICY, MANAGE COOKIES (+4). Téléphone cliquable : non. Formulaire : aucun. Horaires : oui (6 jours nommés, 8 heures, ex. « Monday to friday 12pm – 2pm Saturday and sunday 12pm – 2: »). Portes d'action : « RESERVATIONS » (https://www.sevenrooms.com/experiences/grandevefour), « MAKE A RESERVATION » (https://www.sevenrooms.com/experiences/grandevefour), « DISCOVER OUR MENUS » (https://legrandvefour.com/menus/), « GIFT CARD » (https://paris-society.secretbox.fr/).
En 3 secondes : à juger sur `captures/legrandvefour-d.webp` (mesuré : fond du premier écran #000000, 1 image(s) et 44 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Cormorant Infant**, 46 px / 38 px téléphone, graisse 400, interlignage 1,22 ; h2 **Cormorant Infant**, 36 px / 32 px téléphone, graisse 400, interlignage 1,28 ; corps **Cormorant Garamond**, 16 px / 16 px téléphone, graisse 400, interlignage 1,75, interlettrage 0.64px ; boutons **Cormorant Garamond**, 16 px / 16 px téléphone, graisse 400, interlignage 1,75 ; nav **Jost**, 12 px, graisse 700, interlignage 2,33, capitales, interlettrage 1.92px.
Sources `@font-face` : feuilles d'origine croisée non lisibles () ; fichiers chargés : https://fonts.googleapis.com/. Familles en usage sur le texte visible : Jost ×30, Cormorant Garamond ×28, Cormorant Infant ×13. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #e1eaf1 (premier écran #000000), texte #2a0d08 (contraste 14,87:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #e1eaf1 (60 %), #ffffff (25 %), #2a0d08 (9 %), #000000 (7 %) ; textes par nombre de caractères : #041e42 (50 %), #2a0d08 (26 %), #e1eaf1 (24 %). Images : 10 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s), `mask-image`/`clip-path` sur 2 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.25s ease` ×75, `opacity 1s ease` ×33, `transform 1s ease` ×33, `all 0.25s cubic-bezier(0.63, 0.29, 0.17, 1.345)` ×3, `all 0.3s ease` ×3, `all 0.65s ease` ×2, `bottom 0.3s cubic-bezier(0.17, 0.04, 0.03, 0.94)` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 2 bloc(s) de plus d'un écran (`div.flex-col` 1,4 écran, `div.flex-col` 1,3 écran). Attributs de mouvement : `data-autoplayspeed` ×1, `data-scrollspeed` ×1. Ce qui bouge réellement à l'écran : à juger sur `captures/legrandvefour-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `section#main-content` « THE MOST ANTICIPATED REVIVAL IN PARIS » (7,3 écrans, 754 mots, 9 image(s)).
2. L'élément le plus animé : `div.slider` (attributs data-autoplayspeed).
3. Le bloc le plus singulier par sa structure : `section#main-content` « THE MOST ANTICIPATED REVIVAL IN PARIS » (seule à contenir <dl>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : horaires sur l'accueil, portes d'action nommées (« RESERVATIONS », « MAKE A RESERVATION », « DISCOVER OUR MENUS », « GIFT CARD »).
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : Cormorant Infant, Cormorant Garamond ; boutons pilule : 0/10 ordinateur, 0/9 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
