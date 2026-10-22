# Perimeter Books — https://www.perimeterbooks.com/
Titre « Home – Perimeter Books », `lang="en"`, description « Perimeter is a specialised bookstore, award-winning publisher, distribution house and platform for various art publishing endeavours in Melbourne, Australia. », technologie lue : Shopify, jQuery. Démontage automatique du 2026-10-22 (`ff demonter`, mesures brutes dans `perimeter.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; pas de média plein écran (8 image(s) dans l'écran) ; bouton principal « Categories↓ » en haut au centre (460, 26 px, dans la nav) ; 162 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; pas de média plein écran (6 image(s) dans l'écran) ; bouton principal « Search » en haut au centre (201, 65 px, dans la nav) ; 92 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 9 lien(s) — All Titles, [Categories↓], [Publishers↓], [Activities↓], Perimeter Editions, About, [Submit], Log in, Cart ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div#shopify-section-header` (0,2 écran, 121 mots, 0 img) → `div#shopify-section-featured-collections` (1,4 écran, 220 mots, 24 img) → `div#shopify-section-71615637-f206-401a-8755-4b896fc62834` « Same Page Art Book Fair 2026 | Exhibito… » (0,6 écran, 62 mots, 1 img) → `div#shopify-section-1550967075176` « PROGRAM » (1,1 écran, 104 mots, 3 img) → `div#shopify-section-collection_BRi6aA` « 15 YEARS OF PERIMETER POSTERS » (0,5 écran, 132 mots, 10 img) → `div#shopify-section-1585375189450` « PERIMETER EDITIONS » (1,5 écran, 190 mots, 24 img) → `div#shopify-section-custom_content_tHqtiP` (0,5 écran, 46 mots, 8 img) → `div#shopify-section-footer` (0,4 écran, 32 mots, 0 img). Calques hors flux (fixes/absolus) : `a.in-page-link` (absolute, 1 px, 3 mots), `div#slideshow-info` (absolute, 1 px, collé en bas, 15 mots).
Pied de page : 9 lien(s) — Contact, Shipping Info, Privacy Policy, FAQs & Returns, Instagram, Facebook, Pinterest, YouTube, SUBSCRIBE HERE. Téléphone cliquable : non. Formulaire : 2 (1 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Spector Books » (/collections/vendors?q=Spector Books), « Same Page Art Book Fair 2026 » (/blogs/program/same-page-art-book-fair-2026), « PRE-ORDER: Ken Whisson and John Foubiste » (/collections/perimeter-editions/products/ken-whisson-and-john-foubister-going-back-in), « Perimeter Books Typo Tee » (/products/perimeter-books-typo-tee), « Perimeter WHAT IS BOOK Cap » (/products/pre-order-perimeter-what-is-book-cap), « Perimeter Books Long-Sleeve Tee » (/products/perimeter-books-long-sleeve-tee), « Facebook » (https://www.facebook.com/perimeterbooks/).
En 3 secondes : à juger sur `captures/perimeter-d.webp` (mesuré : fond du premier écran #ffffff, 8 image(s) et 162 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **lausanne**, 20 px / 18 px téléphone, graisse 300, interlignage 1,20, capitales, interlettrage 2px ; h2 **lausanne**, 26 px / 20 px téléphone, graisse 300, interlignage 1,20 ; corps **lausanne**, 20 px / 17 px téléphone, graisse 300, interlignage 1,50 ; boutons **lausanne**, 18 px / 16 px téléphone, graisse 300, interlignage 1,50 ; nav **lausanne**, 18 px / 18 px téléphone, graisse 300, interlignage 1,50.
Sources `@font-face` : auto-hébergée (Merriweather, lausanne) ; fichiers chargés : https://www.perimeterbooks.com/cdn/shop/t/15/assets/Lausanne-300.woff2?v=134533164273981598811772685218. Familles en usage sur le texte visible : lausanne ×203. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #222222 (contraste 15,91:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (100 %) ; textes par nombre de caractères : #222222 (97 %), #000000 (3 %). Images : 70 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery), Shopify (window.Shopify). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.35s cubic-bezier(0.29, 0.63, 0.44, 1)` ×2, `height 0.0012s ease` ×1, `all 0.45s cubic-bezier(0.29, 0.63, 0.44, 1)` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/perimeter-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div#shopify-section-1585375189450` « PERIMETER EDITIONS » (1,5 écran, 190 mots, 24 image(s)).
2. L'élément le plus animé : `header.site-header` (1 transition(s) : height 0.0012s ease).
3. Le bloc le plus singulier par sa structure : `div#shopify-section-header` (seule à contenir <svg>, <form>, <select>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« Spector Books », « Same Page Art Book Fair 2026 », « PRE-ORDER: Ken Whisson and John Foubiste », « Perimeter Books Typo Tee », « Perimeter WHAT IS BOOK Cap », « Perimeter Books Long-Sleeve Tee », « Facebook »), formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/11 ordinateur, 0/9 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
