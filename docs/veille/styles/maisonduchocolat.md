# Maison du chocolat — https://maison-du-chocolat.com/
Titre « Maison du chocolat - L'éternel plaisir des délices chocolatés », `lang="fr-FR"`, description « Faire le bon choix de chocolat n'est pas si simple. Comment faire le bon choix de qualité ? Plusieurs détails sont importants, le taux de sucre et de cacao,... », technologie lue : WordPress, jQuery. Démontage automatique du 2026-10-31 (`ff demonter`, mesures brutes dans `maisonduchocolat.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « L’autre goût du cacao » ; fond en image plein écran (100 % de l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 18 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « L’autre goût du cacao » ; pas de média plein écran (2 image(s) dans l'écran) ; bouton principal « Toggle navigation » en haut à gauche (15, 8 px, dans la nav) ; 7 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 4 lien(s) — Types de chocolats, Ingrédients de pâtisserie, Ustensiles, Blog ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.full-height` « L’autre goût du cacao » (1,0 écran, 7 mots, 0 img) → `div.group2` « Le chocolat sous toutes ses formes » (0,7 écran, 106 mots, 2 img) → `div.wp-container-core-group-is-layout-edd41694` « Gourmandises et petits délices chocolat… » (0,1 écran, 9 mots, 0 img) → `div.wp-block-columns` « Gâteau au chocolat » (0,7 écran, 9 mots, 3 img) → `div.wp-container-core-group-is-layout-edd41694` « Le chocolat dans tous ses états, de tou… » (0,3 écran, 61 mots, 1 img) → `div.wp-block-columns` « Le chocolat noir » (0,9 écran, 43 mots, 3 img) → `div.wp-container-core-group-is-layout-e2fc2210` « Le chocolat à déguster » (1,1 écran, 112 mots, 2 img) → `div.wp-block-columns` « Le chocolat à pâtisser » (0,7 écran, 85 mots, 3 img) → `footer.container-fluid` (0,5 écran, 83 mots, 0 img) → `p.text-center` (0,0 écran, 3 mots, 0 img). Calques hors flux (fixes/absolus) : `div.main-navigation` (absolute, 148 px, 8 mots).
Pied de page : 0 lien(s) — aucun. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/maisonduchocolat-d.webp` (mesuré : fond du premier écran #ffffff, 2 image(s) et 18 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Amiri**, 70 px / 30 px téléphone, graisse 700, interlignage 1,20 ; h2 **Amiri**, 40 px / 25 px téléphone, graisse 500, interlignage 1,20 ; corps **DM Sans**, 15 px / 15 px téléphone, graisse 400, interlignage 1,67 ; boutons : non mesuré ; nav **DM Sans**, 17 px, graisse 400, interlignage 1,47.
Sources `@font-face` : auto-hébergée (bootstrap-icons) ; fichiers chargés : https://www.maison-du-chocolat.com/wp-content/themes/factory-templates-4/css/fonts/bootstrap-icons.woff2?2820a3852bdb9a5832199cc61cec4e65, https://fonts.googleapis.com/, https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;700&display=swap. Familles en usage sur le texte visible : DM Sans ×36, Amiri ×15. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #696969 (contraste 5,49:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (77 %), #fff7f3 (9 %), #000000 (8 %), #f8f7f7 (7 %) ; textes par nombre de caractères : #696969 (74 %), #000000 (14 %), #8f8f8f (6 %), #ffffff (4 %), #e0ad92 (2 %). Images : 15 `<img>` visibles, 2 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.6s ease` ×3, `all 0.5s ease` ×3, `animation fadeInUp 0s ease` ×2, `animation fadeIn 0s ease` ×2, `top 0.4s ease` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/maisonduchocolat-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.wp-container-core-group-is-layout-e2fc2210` « Le chocolat à déguster » (1,1 écran, 112 mots, 2 image(s)).
2. L'élément le plus animé : `div.wp-block-column` (animation animation fadeInUp 0s ease).
3. Le bloc le plus singulier par sa structure : aucune section ne contient de balise rare (table, details, canvas, video, svg, form, dl…).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : rien de mesurable.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : DM Sans ; boutons pilule : 0/0 ordinateur, 0/1 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
