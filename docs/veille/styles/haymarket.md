# Haymarket — https://haymarket.com/
Titre « Home - Haymarket », `lang="en-US"`, technologie lue : WordPress, jQuery. Démontage automatique du 2026-10-23 (`ff demonter`, mesures brutes dans `haymarket.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « Our People » ; vidéo plein écran (90 % de l'écran) ; bouton principal « All Locations » en haut à droite (1189, 62 px, dans une barre fixe, dans la nav) ; 12 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « Our People » ; pas de média plein écran (5 image(s) dans l'écran) ; bouton principal « All Locations » en haut à droite (206, 10 px, dans une barre fixe) ; 27 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 6 lien(s) — About Us, Impact, Our Brands, Global News, Careers, Contact Us ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div` (0,9 écran, 0 mots, 2 img) → `section#our_team` « Our People » (0,8 écran, 27 mots, 3 img) → `a` (0,4 écran, 0 mots, 0 img) → `div.container` (0,1 écran, 3 mots, 0 img) → `section#our_glabal_presence` « Our Global Presence » (1,1 écran, 12 mots, 1 img) → `section#global_news` « Global News » (0,1 écran, 2 mots, 0 img) → `div#global_news` « US: Innovation & collaboration: Obesity… » (0,6 écran, 33 mots, 0 img) → `footer` (0,3 écran, 12 mots, 5 img).
Pied de page : 4 lien(s) — Haymarket, B Corp Certification, Global Supplier Code of Conduct, Cookies Settings. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/haymarket-d.webp` (mesuré : fond du premier écran #ffffff, 6 image(s) et 12 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Epilogue**, 27 px / 28 px téléphone, graisse 700 ; h2 **Epilogue**, 32 px / 32 px téléphone, graisse 300, interlignage 1,20 ; corps **Epilogue**, 18 px / 20 px téléphone, graisse 400, interlignage 1,39 ; boutons **Epilogue**, 16 px / 16 px téléphone, graisse 400, interlignage 1,50 ; nav **Epilogue**, 17 px, graisse 500, interlignage 1,00.
Sources `@font-face` : auto-hébergée (mobmenu). Familles en usage sur le texte visible : Epilogue ×35. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #000000 (contraste 21,00:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (82 %), #0516aa (12 %), #261655 (6 %), #fe0031 (0 %), #000000 (0 %) ; textes par nombre de caractères : #ffffff (54 %), #261656 (26 %), #000000 (8 %), #0516aa (8 %), #161677 (5 %). Images : 7 `<img>` visibles, 5 fond(s) en image, 1 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : Swiper (window.Swiper), jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.5s ease` ×27, `all 0.4s ease-in-out` ×6, `all 0.4s ease` ×3, `color 0.15s ease-in-out` ×1, `background-color 0.15s ease-in-out` ×1, `border-color 0.15s ease-in-out` ×1, `box-shadow 0.15s ease-in-out` ×1, `all 0.3s ease` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/haymarket-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `section#our_glabal_presence` « Our Global Presence » (1,1 écran, 12 mots, 1 image(s)).
2. L'élément le plus animé : `button.btn` (4 transition(s) : color 0.15s ease-in-out ; background-color 0.15s ease-in-out).
3. Le bloc le plus singulier par sa structure : `div` (seule à contenir <video>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : rien de mesurable.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/3 ordinateur, 0/11 téléphone ; vidéo en premier écran : oui ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
