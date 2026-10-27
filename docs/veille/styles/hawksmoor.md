# hawksmoor — https://hawksmoor.co.uk/
Titre non mesuré, `lang="fr-FR"`, technologie lue : aucune reconnue. Démontage automatique du 2026-10-27 (`ff demonter`, mesures brutes dans `hawksmoor.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « Ce domaine est déjà enregistré » ; pas de média plein écran (4 image(s) dans l'écran) ; bouton principal « Administrer ce domaine » en haut à gauche (144, 234 px) ; 58 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « Ce domaine est déjà enregistré » ; pas de média plein écran (2 image(s) dans l'écran) ; bouton principal « Administrer ce domaine » en haut au centre (24, 256 px) ; 53 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 0 lien(s) — aucun ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.header-wrapper` (0,1 écran, 0 mots, 1 img) → `div.bg-g6` « Ce domaine est déjà enregistré » (0,3 écran, 29 mots, 0 img) → `div` (0,1 écran, 5 mots, 0 img) → `div.content-cards-container` « Votre projet entre de bonnes mains avec… » (0,9 écran, 80 mots, 3 img) → `div.content-cards-container` « Trouvez le domaine parfait pour votre p… » (0,9 écran, 63 mots, 0 img) → `div.advice-container` « Administrez votre domaine avec IONOS » (0,5 écran, 40 mots, 0 img).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : 1 (1 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/hawksmoor-d.webp` (mesuré : fond du premier écran #f6f7f8, 4 image(s) et 58 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Overpass Bold**, 28 px / 24 px téléphone, graisse 400, interlignage 1,14 ; h2 **Overpass Regular**, 44 px / 36 px téléphone, graisse 400, interlignage 1,09 ; corps : non mesuré ; boutons **Open Sans Bold**, 16 px / 16 px téléphone, graisse 400, interlignage 1,50 ; nav **Open Sans Regular**, 16 px / 16 px téléphone, graisse 400, interlignage 1,00.
Sources `@font-face` : auto-hébergée (icon-font-next, icon-font-linear) ; tiers (cors.uicdn.net) (Open Sans Regular, Open Sans Light, Open Sans Semi Bold, Open Sans Extra Bold, Open Sans Bold, Overpass Extra Bold, Overpass Light, Overpass Bold, Overpass Regular, Beon) ; fichiers chargés : https://cors.uicdn.net/fonts/overpass-bold-subset.woff2, https://cors.uicdn.net/fonts/opensans-regular-subset.woff2, https://cors.uicdn.net/fonts/opensans-bold-subset.woff2, https://cors.uicdn.net/fonts/overpass-regular-subset.woff2, https://cors.uicdn.net/fonts/opensans-semibold-subset.woff2. Familles en usage sur le texte visible : Open Sans Regular ×14, Open Sans Bold ×7, Overpass Bold ×6, Open Sans Semi Bold ×4, Overpass Regular ×3. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff (premier écran #f6f7f8), texte #465a75 (contraste 7,05:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (77 %), #f6f7f8 (21 %), #003d8f (2 %), #0b9dcc (0 %) ; textes par nombre de caractères : #465a75 (66 %), #001b41 (19 %), #0b9dcc (7 %), #718095 (4 %), #003d8f (3 %). Images : 4 `<img>` visibles, 1 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : aucune détectée (window.* et noms de scripts). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `color 0.1s ease-out` ×7, `background-color 0.1s ease-out` ×7, `border-color 0.1s ease-out` ×7, `all 0.6s cubic-bezier(0.87, -0.41, 0.19, 1.44)` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : `data-animate` ×1, `data-cursor` ×1. Ce qui bouge réellement à l'écran : à juger sur `captures/hawksmoor-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.content-cards-container` « Trouvez le domaine parfait pour votre p… » (0,9 écran, 63 mots, 0 image(s)).
2. L'élément le plus animé : `label.form-label` (1 transition(s) : all 0.6s cubic-bezier(0.87, -0.41, 0.19, 1.44) ; attributs data-animate, data-cursor).
3. Le bloc le plus singulier par sa structure : `div` (seule à contenir <form>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/2 ordinateur, 0/2 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
