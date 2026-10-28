# Monmouth Coffee Company — https://monmouthcoffee.co.uk/
Titre « Home - Monmouth Coffee Company », `lang="en-GB"`, technologie lue : WordPress, jQuery. Démontage automatique du 2026-10-28 (`ff demonter`, mesures brutes dans `monmouth.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; image plein écran (67 % de l'écran) ; bouton principal « × » en bas à droite (1300, 712 px, dans une barre fixe) ; 57 mots visibles au-dessus du pli ; bannière cookies 17 % de l'écran, non bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; pas de média plein écran (3 image(s) dans l'écran) ; bouton principal « × » en bas à droite (328, 604 px, dans une barre fixe) ; 188 mots visibles au-dessus du pli ; bannière cookies 24 % de l'écran, non bloquante ; bouge tout seul sans défilement : 1 élément(s) (`iframe#launcher`).
Nav : 5 lien(s) — BUY COFFEE, BUY SUPPLIES, OUR SHOPS, ABOUT US, & THE REST ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `main#main` « ABOUT US » (3,3 écrans, 430 mots, 8 img) → `footer.site-footer` « MONMOUTH COFFEE COMPANY » (0,7 écran, 57 mots, 0 img). Calques hors flux (fixes/absolus) : `a.skip-link` (absolute, 1 px, 3 mots), `div#a11y-speak-assertive` (absolute, 1 px), `div#a11y-speak-polite` (absolute, 1 px), `div.widget_shopping_cart_live_region` (absolute, 1 px).
Pied de page : 10 lien(s) — FAQs, Shipping & Returns, Subscription Information, Careers, Wholesale, Terms and Conditions, Privacy Policy, 020 7232 3010, beans@monmouthcoffee.co.uk, @monmouthcoffee. Téléphone cliquable : oui (1, tel:+442072323010). Formulaire : 1 (2 champ(s) dans le premier). Horaires : oui (4 jours nommés, 8 heures, ex. « Monday to Saturday 8am to 7pm Closed Sunday Card payments o »). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/monmouth-d.webp` (mesuré : fond du premier écran #ffffff, 3 image(s) et 57 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 **FrescoSans Std**, 16 px / 16 px téléphone, graisse 300, interlignage 1,63, capitales, interlettrage 0.8px ; corps **FrescoSans Pro**, 20 px / 16 px téléphone, graisse 300, interlignage 1,50 ; boutons **FrescoSans Pro**, 16 px / 16 px téléphone, graisse 300, interlignage 1,63, italique ; nav **FrescoSans Pro**, 16 px / 16 px téléphone, graisse 300, interlignage 1,63.
Sources `@font-face` : auto-hébergée (star, WooCommerce, FontAwesomeSATT, FrescoSans Std, FrescoSans Pro, gform-icons-theme) ; fichiers chargés : https://www.monmouthcoffee.co.uk/wp-content/themes/monmouth-coffee/assets/static/FrescoSansPro-Light.woff2, https://www.monmouthcoffee.co.uk/wp-content/themes/monmouth-coffee/assets/static/FrescoSansStd-SemiBold.woff2, https://www.monmouthcoffee.co.uk/wp-content/themes/monmouth-coffee/assets/static/FrescoSansPro-LightItalic.woff2. Familles en usage sur le texte visible : FrescoSans Pro ×45, FrescoSans Std ×42. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #1a1a1a (contraste 17,40:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (85 %), #f0f0f0 (15 %), #595959 (0 %) ; textes par nombre de caractères : #1a1a1a (100 %), #d9d9d9 (0 %). Images : 9 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s), `mask-image`/`clip-path` sur 6 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `color 0.2s cubic-bezier(0.165, 0.84, 0.44, 1)` ×10, `background-color 0.2s cubic-bezier(0.165, 0.84, 0.44, 1)` ×10, `border-color 0.2s cubic-bezier(0.165, 0.84, 0.44, 1)` ×10, `box-shadow 0.2s cubic-bezier(0.165, 0.84, 0.44, 1)` ×10, `transform 0.2s cubic-bezier(0.165, 0.84, 0.44, 1)` ×10, `color 0.3s ease` ×2, `text-decoration 0.3s ease` ×2, `transform 0.5s ease` ×1, `opacity 0.25s cubic-bezier(0.645, 0.045, 0.355, 1)` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/monmouth-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `main#main` « ABOUT US » (3,3 écrans, 430 mots, 8 image(s)).
2. L'élément le plus animé : `div.product-slider__button` (5 transition(s) : color 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) ; background-color 0.2s cubic-bezier(0.165, 0.84, 0.44, 1)).
3. Le bloc le plus singulier par sa structure : `footer.site-footer` « MONMOUTH COFFEE COMPANY » (seule à contenir <form>, <iframe>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : téléphone cliquable, horaires sur l'accueil, formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/8 ordinateur, 0/8 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
