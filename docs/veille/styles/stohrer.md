# Stohrer — https://stohrer.fr/
Titre « Stohrer – Pâtisserie parisienne depuis 1730 », `lang="fr-FR"`, technologie lue : generator « WordPress 6.8.12 », WordPress, jQuery. Démontage automatique du 2026-10-29 (`ff demonter`, mesures brutes dans `stohrer.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; pas de média plein écran (21 image(s) dans l'écran) ; bouton principal « JE DÉCOUVRE » en bas à gauche (-796, 667 px) ; 127 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; pas de média plein écran (13 image(s) dans l'écran) ; bouton principal « JE DÉCOUVRE » à mi-hauteur à gauche (-271, 377 px) ; 22 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 20 lien(s) — Aller à la navigation, Aller au contenu, NOTRE MAISON, NOTRE SAVOIR-FAIRE, NOS BOUTIQUES, 0, Nos Pâtisseries, Commande spéciale, Accueil, Voir tout, Uncategorized, Livre (+8) ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.hp-slideshow` (0,6 écran, 6 mots, 4 img) → `div.col-full` « SÉLECTION DE LA SEMAINE » (0,6 écran, 86 mots, 15 img) → `div.col-full` (0,9 écran, 6 mots, 3 img) → `div#hp-stores` (0,5 écran, 2 mots, 1 img) → `section.storefront-product-section` « BOUTIQUE PAR MARQUE » (0,1 écran, 3 mots, 0 img) → `footer#colophon` (0,2 écran, 23 mots, 0 img). Calques hors flux (fixes/absolus) : `ul#cartslider` (fixed, 900 px, 6 mots), `div.widget_shopping_cart_live_region` (absolute, 1 px, collé en bas), `header#masthead` (fixed, 172 px, 97 mots), `div#top-promo` (fixed, 30 px, 10 mots).
Pied de page : 3 lien(s) — MODALITÉS DE LIVRAISON, CONDITIONS GÉNÉRALES DE VENTE, MENTIONS LÉGALES. Téléphone cliquable : non. Formulaire : 2 (1 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Commande spéciale » (https://stohrer.fr/commande-speciale/), « COMMANDER » (), « MODALITÉS DE LIVRAISON » (https://stohrer.fr/livraison/).
En 3 secondes : à juger sur `captures/stohrer-d.webp` (mesuré : fond du premier écran #ffffff, 21 image(s) et 127 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 **EB Garamond**, 24 px / 24 px téléphone, graisse 500, interlignage 1,21, capitales ; corps **EB Garamond**, 14 px, graisse 400, interlignage 2,08 ; boutons **Open Sans**, 19 px / 14 px téléphone, graisse 400, interlignage 0,94, capitales ; nav **EB Garamond**, 16 px / 16 px téléphone, graisse 400, interlignage 1,62.
Sources `@font-face` : auto-hébergée (Font Awesome 5 Brands, Font Awesome 5 Free, star, WooCommerce, PDFfont1, PDFfont1italic) ; inline (data:) (swiper-icons) ; fichiers chargés : https://stohrer.fr/wp-content/themes/stohrer/assets/fonts/fa-solid-900.woff2, https://fonts.googleapis.com/, https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap. Familles en usage sur le texte visible : EB Garamond ×85, Open Sans ×44. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #002e65 (contraste 13,30:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (78 %), #002e65 (16 %), #2c2d33 (5 %), #aa8f24 (1 %), #f2f2f2 (0 %) ; textes par nombre de caractères : #2c2d33 (44 %), #ffffff (25 %), #002e65 (23 %), #43454b (6 %), #aa8f24 (2 %). Images : 23 `<img>` visibles, 8 fond(s) en image, 0 vidéo(s), `mask-image`/`clip-path` sur 3 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : Swiper (window.Swiper), jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `height 0.2s ease-out` ×2, `all 0.3s ease` ×2, `all 0.2s ease-out` ×1, `opacity 0.3s ease` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/stohrer-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.col-full` (0,9 écran, 6 mots, 3 image(s)).
2. L'élément le plus animé : `div#page` (1 transition(s) : height 0.2s ease-out).
3. Le bloc le plus singulier par sa structure : `footer#colophon` (seule à contenir <form>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« Commande spéciale », « COMMANDER », « MODALITÉS DE LIVRAISON »), formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 4/5 ordinateur, 4/5 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
