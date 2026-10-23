# Artemide — https://artemide.com/
Titre « Artemide - Home », `lang="fr"`, technologie lue : jQuery. Démontage automatique du 2026-10-23 (`ff demonter`, mesures brutes dans `artemide.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « We noticed that you are in USA! » ; vidéo plein écran (80 % de l'écran) ; bouton principal « Close » en haut au centre (923, 274 px, dans une barre fixe) ; 512 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : bannière cookies couvrant 100 % de l'écran (« USE OF COOKIES Nous utilisons les Cookies sur ce site pour … ») ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « We noticed that you are in USA! » ; pas de média plein écran (1 image(s) dans l'écran) ; bouton principal « Close » à mi-hauteur à droite (343, 549 px, dans une barre fixe) ; 467 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : bannière cookies couvrant 100 % de l'écran (« USE OF COOKIES Nous utilisons les Cookies sur ce site pour … ») ; rien ne bouge tout seul.
Nav : 14 lien(s) — Artemide home page, Novelties 2026, Design Collection, Architectural Indoor, Architectural Outdoor, INTEGRALIS® Collection, Scenarios' Library, [RÉALISATIONS], [CONFIGURATOR], [STORE LOCATOR], [SHOP], [My Area] (+2) ; boutons entre crochets. **Barre fixe en bas de l'écran (téléphone)** : J’accepte, Save and close.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.m100Container` (0,8 écran, 343 mots, 11 img) → `div` (0,8 écran, 4 mots, 31 img) → `div` « Megaron Special Edition » (1,0 écran, 33 mots, 5 img) → `div` « Ruby Red Collection » (1,0 écran, 26 mots, 7 img) → `div` « Novelties 2026 » (1,0 écran, 20 mots, 5 img) → `div` « Catalogues and Brochures » (0,9 écran, 20 mots, 5 img) → `div` « HOP Apartements & Suites » (1,0 écran, 176 mots, 3 img) → `footer#footer2` (0,7 écran, 75 mots, 0 img). Calques hors flux (fixes/absolus) : `div#amdCookieBanner` (fixed, 900 px, 82 mots), `div#uscaModal` (fixed, 900 px, 51 mots), `div.modal-backdrop` (fixed, 900 px), `div.modal-backdrop` (fixed, 900 px).
Pied de page : 19 lien(s) — Go to our WeChat page, Go to our Facebook page, Go to our X page, Go to our Instagram page, Go to our Pinterest page, Go to our Linkedin page, Go to our YouTube page, [S’abonner], [Points de vente], [Voir le site] (+9). Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Go to our Facebook page » (https://www.facebook.com/ArtemideGroup).
En 3 secondes : à juger sur `captures/artemide-d.webp` (mesuré : fond du premier écran #ffffff, 1 image(s) et 512 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Replica Pro**, 28 px / 28 px téléphone, graisse 700, interlignage 1,20 ; h2 **Replica Pro**, 34 px / 23 px téléphone, graisse 500, interlignage 1,20 ; corps **Replica Pro**, 26 px / 17 px téléphone, graisse 400, interlignage 1,50 ; boutons **artemide-icons**, 19 px / 19 px téléphone, graisse 100, interlignage 1,00 ; nav **Replica Pro Light**, 18 px / 18 px téléphone, graisse 100, interlignage 1,13.
Sources `@font-face` : auto-hébergée (artemide-icons, Replica Pro Light, Replica Pro Bold, Replica Pro) ; fichiers chargés : https://www.artemide.com/res-2084/fonts/ReplicaPro-Regular.woff2, https://www.artemide.com/res-2084/css/artemide-icons/fonts/artemide-icons.ttf?dagr0c, https://www.artemide.com/res-2084/fonts/ReplicaPro-Light.woff2. Familles en usage sur le texte visible : Replica Pro ×118, Replica Pro Light ×31, artemide-icons ×1. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #212529 (contraste 15,43:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (61 %), #000000 (17 %), #f0f0f0 (15 %), #3b3c3d (7 %) ; textes par nombre de caractères : #212529 (52 %), #ffffff (25 %), #000000 (22 %), #e3251b (0 %). Images : 29 `<img>` visibles, 0 fond(s) en image, 11 vidéo(s), `mask-image`/`clip-path` sur 19 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `color 0.3s ease` ×29, `background-color 0.3s ease` ×28, `transform 1.2s ease-in` ×25, `border 0.3s ease` ×16, `transform 0.7s ease-out` ×6, `opacity 0.8s ease` ×6, `opacity 0.3s ease` ×5, `opacity 0.15s linear` ×4, `transform 0.2s ease` ×4, `width 0.2s ease` ×4. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/artemide-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div` « HOP Apartements & Suites » (1,0 écran, 176 mots, 3 image(s)).
2. L'élément le plus animé : `span` (4 transition(s) : transform 0.2s ease ; width 0.2s ease).
3. Le bloc le plus singulier par sa structure : `div.m100Container` (seule à contenir <video>, <svg>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« Go to our Facebook page »), barre d'actions fixe en bas sur téléphone.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 28/38 ordinateur, 28/32 téléphone ; vidéo en premier écran : oui ; couche bloquante à l'arrivée : oui (bannière cookies, 100 % de l'écran) ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
