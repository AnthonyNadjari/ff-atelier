# Buffet — https://buffet.digital/
Titre « Home | Buffet », `lang="?"`, description « Buffet is the authority on thinking differently in food and drink. We're a creative content studio based in Sydney. », technologie lue : WordPress, Next.js. Démontage automatique du 2026-10-31 (`ff demonter`, mesures brutes dans `buffet.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; image plein écran (100 % de l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 224 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; image plein écran (100 % de l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 196 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : non mesuré.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.pages__Tagline-sc-1djtok7-8` (0,0 écran, 9 mots, 0 img) → `div.pages__ProjectItemsWrapper-sc-1djtok7-13` (2,4 écrans, 104 mots, 0 img) → `div` (0,6 écran, 10 mots, 0 img). Calques hors flux (fixes/absolus) : `div.Header__Wrapper-sc-u0jyn-2` (fixed, 80 px, 8 mots), `div#splash` (fixed, 900 px), `div.Footer__Wrapper-sc-d6vyxj-6` (sticky, 383 px, collé en bas, 57 mots), `div.pages__ThumbnailItems-sc-1djtok7-10` (fixed, 900 px).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : 1 (2 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/buffet-d.webp` (mesuré : fond du premier écran #fff8ea, 33 image(s) et 224 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 : non mesuré ; corps **Avenir**, 14 px / 13 px téléphone, graisse 400, interlignage 1,53, interlettrage -0.565437px ; boutons **Synt**, 29 px / 16 px téléphone, graisse 400, interlignage 1,00, interlettrage -0.583107px ; nav : non mesuré.
Sources `@font-face` : auto-hébergée (Synt, Avenir, Druk, Bagoss) ; fichiers chargés : https://www.buffet.digital/_next/static/media/ABCSynt-Regular.89897506.woff2, https://www.buffet.digital/_next/static/media/Avenir-LT-35-Light-Regular.610fc407.ttf, https://www.buffet.digital/_next/static/media/Druk-Wide-Medium.aaead8ae.otf. Familles en usage sur le texte visible : Synt ×85, Druk ×14, Avenir ×12. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff (premier écran #fff8ea), texte #000000 (contraste 21,00:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (53 %), #fff8ea (47 %), #000000 (0 %) ; textes par nombre de caractères : #000000 (69 %), #ffffff (31 %). Images : 31 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : React (window.__NEXT_DATA__). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `opacity 0.3s ease` ×14, `animation bYfMUO 0s linear infinite` ×9, `all 0.3s ease` ×3, `animation react-reveal-925226709509755-1 0.8s ease` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 1 bloc(s) de plus d'un écran (`div.Footer__Wrapper-sc-d6vyxj-6` 3,5 écrans). Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/buffet-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.pages__ProjectItemsWrapper-sc-1djtok7-13` (2,4 écrans, 104 mots, 0 image(s)).
2. L'élément le plus animé : `div.sc-dkzDqf` (animation animation bYfMUO 0s linear infinite).
3. Le bloc le plus singulier par sa structure : `div` (seule à contenir <form>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/1 ordinateur, 0/1 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : « 150 Years of Victor Churchill » à 123 px. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
