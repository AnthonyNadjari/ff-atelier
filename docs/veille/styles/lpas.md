# LPAS Architecture — https://lpas.com/
Titre « LPAS - Architecture and Interiors », `lang="en"`, description « Clear Process. Creative Results. Human-centered. Always Curious. At LPAS, we design with people at the center and purpose at every turn. », technologie lue : WordPress, Swup. Démontage automatique du 2026-10-26 (`ff demonter`, mesures brutes dans `lpas.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « We’re a process driven architecture and interior design studio » ; vidéo plein écran (100 % de l'écran) ; bouton principal « Explore page » à mi-hauteur à droite (1171, 454 px, dans une barre fixe) ; 47 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : calque couvrant 100 % de l'écran (« L isten P lan A nalyze S hape ») ; bouge tout seul sans défilement : 3 élément(s) (`div.preloader__section`, `div.globalLatestOverview__imageContainer`).
Téléphone (390x844) : h1 « We’re a process driven architecture and interior design studio » ; vidéo plein écran (100 % de l'écran) ; bouton principal « Menu » en haut à droite (276, 35 px, dans une barre fixe, dans la nav) ; 22 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : calque couvrant 100 % de l'écran (« L isten P lan A nalyze S hape ») ; bouge tout seul sans défilement : 2 élément(s) (`div.preloader__section`).
Nav : 0 lien(s) — aucun ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `main#swup` « We’re a process driven architecture and… » (8,6 écrans, 565 mots, 18 img) → `footer#swupFooter` « Sacramento » (1,8 écran, 66 mots, 2 img). Calques hors flux (fixes/absolus) : `p#swup-announcer` (absolute, 1 px).
Pied de page : 29 lien(s) — Housing, Interiors, Higher Education, Civic, Commercial, Portfolio, Site logo and link to homepage, [Housing], [Interiors], [Higher Education] (+19). Téléphone cliquable : oui (4, tel:916-443-0335). Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Menu » (), « Facebook » (https://www.facebook.com/LPAS-Architecture-Design-200127570010089).
En 3 secondes : à juger sur `captures/lpas-d.webp` (mesuré : fond du premier écran #ffffff, 5 image(s) et 47 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Aeonik**, 75 px / 46 px téléphone, graisse 400, interlignage 1,00 ; h2 **Aeonik**, 56 px / 44 px téléphone, graisse 400, interlignage 1,10 ; corps **Aeonik**, 14 px / 14 px téléphone, graisse 400, interlignage 1,35 ; boutons **Aeonik**, 16 px / 16 px téléphone, graisse 400, interlignage 1,35 ; nav **Aeonik**, 16 px / 16 px téléphone, graisse 400, interlignage 1,35.
Sources `@font-face` : auto-hébergée (Aeonik) ; fichiers chargés : https://lpas.com/wp-content/themes/lpas/dist/assets/aeonik-regular-DSAxWCt1.woff, https://lpas.com/wp-content/themes/lpas/dist/assets/aeonik-semibold-B5O2lxMW.woff. Familles en usage sur le texte visible : Aeonik ×113. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #000000 (contraste 21,00:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (78 %), #262626 (13 %), #e3c1aa (2 %), #707569 (2 %), #c9d3df (2 %) ; textes par nombre de caractères : #747474 (60 %), #111111 (18 %), #ffffff (16 %), #262626 (5 %), #a3a3a3 (1 %). Images : 12 `<img>` visibles, 0 fond(s) en image, 1 vidéo(s), `mask-image`/`clip-path` sur 9 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : Swup (window.swup), Lenis (script lenisSmooth-BjXMsNId.js). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.3s cubic-bezier(0, 0, 0.13, 0.99)` ×27, `all 0.3s ease` ×18, `color 0.3s ease` ×17, `width 0.3s cubic-bezier(0, 0, 0.13, 0.99)` ×10, `border-radius 0.3s cubic-bezier(0, 0, 0.13, 0.99)` ×10, `all 1.2s cubic-bezier(0.14, 0.83, 0.4, 1)` ×6, `padding-left 0.3s cubic-bezier(0, 0, 0.13, 0.99)` ×6, `color 0.3s cubic-bezier(0, 0, 0.13, 0.99)` ×5, `border-color 0.3s cubic-bezier(0, 0, 0.13, 0.99)` ×5, `background 0.2s ease` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 1 bloc(s) de plus d'un écran (`div.navigationFooter__bottomSection` 1,8 écran). Attributs de mouvement : `data-swup-animation` ×11, `data-imageanimate` ×6. Ce qui bouge réellement à l'écran : à juger sur `captures/lpas-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `main#swup` « We’re a process driven architecture and… » (8,6 écrans, 565 mots, 18 image(s)).
2. L'élément le plus animé : `img.image` (1 transition(s) : all 1.2s cubic-bezier(0.14, 0.83, 0.4, 1) ; attributs data-imageanimate).
3. Le bloc le plus singulier par sa structure : `main#swup` « We’re a process driven architecture and… » (seule à contenir <video>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : téléphone cliquable, portes d'action nommées (« Menu », « Facebook »).
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/26 ordinateur, 0/26 téléphone ; vidéo en premier écran : oui ; couche bloquante à l'arrivée : oui (calque, 100 % de l'écran) ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
