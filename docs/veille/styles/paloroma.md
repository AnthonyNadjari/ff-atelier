# Paloroma — https://paloroma.com/
Titre « Paloroma », `lang="en"`, description « Clean, gentle, cruelty-free skincare for children that’s beautiful inside and out. », technologie lue : Shopify, jQuery. Démontage automatique du 2026-10-26 (`ff demonter`, mesures brutes dans `paloroma.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; pas de média plein écran (2 image(s) dans l'écran) ; bouton principal « Toggle Cart 0 » à mi-hauteur à droite (1365, 0 px, dans une barre fixe) ; 45 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; pas de média plein écran (2 image(s) dans l'écran) ; bouton principal « Toggle Cart » en haut à droite (310, 0 px, dans une barre fixe) ; 43 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 7 lien(s) — Shop, Journal, About, Contact, Press, Login, [Toggle Menu] ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.header__banner` (0,1 écran, 6 mots, 0 img) → `div#shopify-section-1563970088275` (0,9 écran, 14 mots, 4 img) → `div#shopify-section-1563974248844` (0,9 écran, 43 mots, 4 img) → `div#shopify-section-1563971433968` (2,0 écrans, 14 mots, 5 img) → `div#shopify-section-1563970613761` « The ABC Kit For pampering little ones » (1,2 écran, 127 mots, 4 img) → `div#shopify-section-1563973860510` (0,5 écran, 6 mots, 1 img) → `div#shopify-section-1563975352675` « Our Journal » (1,1 écran, 24 mots, 3 img) → `div#shopify-section-1566488730842` (0,5 écran, 30 mots, 2 img) → `footer.footer` (0,2 écran, 25 mots, 0 img). Calques hors flux (fixes/absolus) : `div.header__home-link` (absolute, 16 px), `nav.main-nav` (fixed, 900 px, 10 mots), `button.main-nav__mobile-toggle` (fixed, 53 px), `button.cart-drawer__mobile-toggle` (absolute, 1 px, 2 mots).
Pied de page : 10 lien(s) — Our story, Press, Shipping & Returns, F.A.Q.s, Privacy Policy, Terms & Conditions, Instagram, Facebook, Contact, hello@paloroma.com. Téléphone cliquable : non. Formulaire : 1 (1 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Toggle Menu » (), « Facebook » (http://www.fb.me/paloromachild).
En 3 secondes : à juger sur `captures/paloroma-d.webp` (mesuré : fond du premier écran #f8f5e9, 2 image(s) et 45 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 **Minotaur**, 30 px / 22 px téléphone, graisse 400, interlignage 1,40, interlettrage 0.4px ; corps **Minotaur**, 16 px / 12 px téléphone, graisse 400, interlignage 1,75, interlettrage 0.8px ; boutons **Arial**, 13 px / 13 px téléphone, graisse 400 ; nav **Minotaur**, 12 px / 12 px téléphone, graisse 400, interlignage 2,17, interlettrage 0.4px.
Sources `@font-face` : auto-hébergée (Minotaur, GT Eesti Display) ; fichiers chargés : https://paloroma.com/cdn/shop/t/1/assets/minotaurweb-regular.woff, https://paloroma.com/cdn/shop/t/1/assets/minotaurweb-italic.woff, https://paloroma.com/cdn/shop/t/1/assets/GT-Eesti-Display-Medium.woff2. Familles en usage sur le texte visible : Minotaur ×51, GT Eesti Display ×36, Arial ×4. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #f8f5e9, texte #ff7e30 (contraste 2,32:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #f8f5e9 (70 %), #ffffff (22 %), #d9ebff (8 %), #ff7e30 (0 %) ; textes par nombre de caractères : #ff7e30 (98 %), #000000 (2 %). Images : 19 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : GSAP (window.TweenLite), Shopify (window.Shopify). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `opacity 0.6s cubic-bezier(0.39, 0.575, 0.565, 1)` ×19, `all 0.4s cubic-bezier(0.39, 0.575, 0.565, 1)` ×13, `all 0.3s cubic-bezier(0.39, 0.575, 0.565, 1)` ×4, `transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)` ×3, `all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)` ×3, `background-color 0.4s cubic-bezier(0.39, 0.575, 0.565, 1)` ×2, `opacity 0.4s cubic-bezier(0.39, 0.575, 0.565, 1)` ×2, `height 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)` ×1, `opacity 0.8s ease` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/paloroma-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div#shopify-section-1563971433968` (2,0 écrans, 14 mots, 5 image(s)).
2. L'élément le plus animé : `div.header__banner` (1 transition(s) : transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)).
3. Le bloc le plus singulier par sa structure : `div#shopify-section-1563970613761` « The ABC Kit For pampering little ones » (seule à contenir <ol>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« Toggle Menu », « Facebook »), formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/7 ordinateur, 0/9 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu (jugé sur les captures, veille du 26 oct 2026, soir)

- **Polices** : Minotaur (serif à empattements en coin) partout, 400, titres 30 px ordinateur / 22 px téléphone, interlignage 2, espacement 0,4 px ; texte 16 / 12 px, interlignage 1,75, espacement 0,8 px. GT Eesti Display en capitales 10 px, espacement 3 px, pour les boutons. Libre : Gelasio.
- **Couleurs** : crème #f8f5e9 (fond, chroma 0,016), blanc #ffffff (bandes produits), orange #ff7e30 (tout le texte, filets, cadre de page), bleu layette #d9ebff (marge gauche, boutons, bandeau de citation), noir #000000 (rare). L'orange tient 2,3:1 sur la crème : l'usine écrit le texte en noir et garde l'orange pour les titres, filets et aplats.
- **Espacements** : page entière posée dans un cadre d'un filet orange, marge bleue à gauche (menu) ; sections de 115 px ordinateur / 60 px téléphone ; conteneur 1 290 px.
- **Formes** : angles droits, bouton plein bleu layette à filet orange, capitales espacées.
- **Photos** : portraits d'enfants sur fond uni et produits détourés en quinconce, petites illustrations au trait qui chevauchent les photos ; journal en vignettes empilées et légèrement décalées.
- **Mouvement** : fondu 0,6 s cubic-bezier(.39,.575,.565,1) des photos au chargement, survols 0,4 s ; rien au défilement.
- **Architecture** : boutique Shopify : produit + portrait au premier écran, essentiels, portraits, coffret, citation, journal, lettre, pied à colonnes.
- **Geste signature** : le cadre orange autour de toute la page, la marge bleue qui porte le menu.
