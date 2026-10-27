# Hôtel Particulier Montmartre — https://www.hotelparticulier.com/
Titre « Hôtel Particulier Montmartre », `lang="fr"`, description « Avec ses 5 suites, son restaurant glamour et un bar à cocktails, l'Hôtel Particulier est une expérience singulière au cœur de la Ville Lumière. », technologie lue : jQuery. Démontage automatique du 2026-10-27 (`ff demonter`, mesures brutes dans `hotelparticulier.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; fond en image plein écran (94 % de l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 18 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; fond en image plein écran (93 % de l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 21 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 8 lien(s) — ACCUEIL, HÔTEL, RESTAURANT, BAR, ÉVÉNEMENTS, BOUTIQUE, CARTE CADEAU, CONTACT ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div#appallin-header-container` (0,1 écran, 10 mots, 0 img) → `div#headsec` (1,0 écran, 15 mots, 0 img) → `div.appallin-universal-section` « BIENVENUE DANS NOTRE MAISON PARTICULIÈRE » (0,9 écran, 75 mots, 0 img) → `div.appdrag-palette-background-color-light-primary-color` (0,4 écran, 36 mots, 1 img) → `div.appdrag-palette-background-color-light-primary-color` « RESTAURANT » (1,0 écran, 84 mots, 0 img) → `div.lazy-img` « NOS SUITES » (0,6 écran, 12 mots, 0 img) → `div#ui-id-194` « NOTRE QUARTIER » (0,4 écran, 54 mots, 0 img) → `div.appallin-universal-section` (0,9 écran, 4 mots, 0 img) → `div.lazy-img` (0,4 écran, 4 mots, 0 img) → `div#appallin-footer-container` (0,4 écran, 39 mots, 3 img). Calques hors flux (fixes/absolus) : `div#lightbox-target` (fixed, 30 px), `textarea` (absolute, 46 px).
Pied de page : aucun pied de page lu. Téléphone cliquable : oui (3, tel:+33153418140). Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « CARTE CADEAU » (voucher.html), « RÉSERVER » (reservation.html), « RÉSERVER UNE TABLE » (reservation.html), « FACEBOOK » (https://www.facebook.com/hotelparticuliermontmartre).
En 3 secondes : à juger sur `captures/hotelparticulier-d.webp` (mesuré : fond du premier écran #000000, 3 image(s) et 18 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 **GothamMedium**, 38 px / 28 px téléphone, graisse 700, interlignage 1,43, capitales ; corps **Roboto**, 14 px / 14 px téléphone, graisse 300, interlignage 1,50, interlettrage 2px ; boutons : non mesuré ; nav : non mesuré.
Sources `@font-face` : tiers (1e64.net) (GothamLight, GothamBook, GothamMedium, GothamBold, quicksand) ; fichiers chargés : https://1e64.net/lw-hpm-48dbc2/fonts/7fb9ca03-a3e0-4bf5-ae8f-c55e3d066b91.woff2. Familles en usage sur le texte visible : Roboto ×39, GothamMedium ×13, open sans ×1, Open Sans ×1, Raleway ×1. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff (premier écran #000000), texte #333333 (contraste 12,63:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (64 %), #000000 (20 %), #dfbeb7 (15 %), #e0e0e0 (0 %) ; textes par nombre de caractères : #ffffff (51 %), #424242 (38 %), #dfbeb7 (8 %), #000000 (2 %), #212121 (1 %). Images : 2 `<img>` visibles, 12 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `background-image 0.3s linear` ×10, `background-color 0.15s ease-in` ×5, `color 0.15s ease-in` ×5, `border-color 0.15s ease-in` ×5, `opacity 0.3s linear` ×4, `opacity 0.4s ease-in-out` ×3, `all 0.5s ease-in-out` ×2, `opacity 0.5s ease-in-out` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/hotelparticulier-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div#headsec` (1,0 écran, 15 mots, 0 image(s)).
2. L'élément le plus animé : `span.appdrag-button` (3 transition(s) : background-color 0.15s ease-in ; color 0.15s ease-in).
3. Le bloc le plus singulier par sa structure : `div#headsec` (contient <table>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : téléphone cliquable, portes d'action nommées (« CARTE CADEAU », « RÉSERVER », « RÉSERVER UNE TABLE », « FACEBOOK »).
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/0 ordinateur, 0/0 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
