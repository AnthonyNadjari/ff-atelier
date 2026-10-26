# Loom Rugs — https://www.loomrugs.com.au/
Titre « Loom Rugs », `lang="en"`, description « A beautiful rug is the heart of a beautiful room. We make and source beautiful rugs. », technologie lue : Webflow, jQuery. Démontage automatique du 2026-10-26 (`ff demonter`, mesures brutes dans `loomrugs.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « A beautiful rug is the heart of a beautiful room. » ; image plein écran (100 % de l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 5 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « A beautiful rug is the heart of a beautiful room. » ; image plein écran (100 % de l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 0 mots visibles au-dessus du pli ; aucune couche bloquante ; bouge tout seul sans défilement : 1 élément(s) (`div.swiper-lazy-preloader`).
Nav : 6 lien(s) — Collections, Custom, home, About, Trade, Contact ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.swiper-component` (1,0 écran, 0 mots, 4 img) → `header.section_content-cta` « A beautiful rug is the heart of a beaut… » (0,7 écran, 18 mots, 0 img) → `header.section_video` « Loom rugs are crafted with integrity an… » (0,8 écran, 8 mots, 1 img) → `header.section_content-cta` « We encourage and support the continual … » (0,8 écran, 17 mots, 0 img) → `section.section_new-products` « New Products » (0,9 écran, 2 mots, 7 img) → `header.section_banner-cta` « Define your style » (0,7 écran, 7 mots, 1 img) → `section.section_instagram` « Instagram » (0,8 écran, 1 mots, 0 img) → `section.section_subscribe` (0,4 écran, 2 mots, 0 img) → `section.section_sponsoring` (0,4 écran, 11 mots, 2 img) → `footer.footer_component` (0,1 écran, 19 mots, 0 img). Calques hors flux (fixes/absolus) : `div#nav` (absolute, 72 px, 5 mots).
Pied de page : 9 lien(s) — Loom Rugs, Alter, Webunder, Info, Trade, #loomlove, Rug Care & Warranty, Privacy Policy, T&Cs. Téléphone cliquable : non. Formulaire : 1 (2 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/loomrugs-d.webp` (mesuré : fond du premier écran #d6cfc4, 4 image(s) et 5 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Matter**, 48 px / 36 px téléphone, graisse 400, interlignage 1,20 ; h2 **Matter**, 48 px / 36 px téléphone, graisse 400, interlignage 1,20 ; corps : non mesuré ; boutons **Matter**, 24 px / 24 px téléphone, graisse 400, interlignage 1,50 ; nav **Matter**, 24 px / 24 px téléphone, graisse 400, interlignage 1,50.
Sources `@font-face` : inline (data:) (webflow-icons) ; tiers (cdn.prod.website-files.com) (Matter) ; fichiers chargés : https://cdn.prod.website-files.com/6756aedf00a29c84accfdb3c/6756b271624f3c74098b3373_Matter-Regular.woff2. Familles en usage sur le texte visible : Matter ×30. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #d6cfc4, texte #3e2323 (contraste 9,24:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #d6cfc4 (100 %), #d7cfc3 (0 %), #000000 (0 %) ; textes par nombre de caractères : #3e2323 (80 %), #ffffff (20 %). Images : 14 `<img>` visibles, 0 fond(s) en image, 1 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery), Webflow (window.Webflow), Swiper (script swiper.min.mjs). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.3s ease` ×30, `opacity 2s ease` ×4, `all 0.2s ease` ×2, `transform 2s ease` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : `data-animation` ×2. Ce qui bouge réellement à l'écran : à juger sur `captures/loomrugs-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.swiper-component` (1,0 écran, 0 mots, 4 image(s)).
2. L'élément le plus animé : `div#nav` (1 transition(s) : all 0.2s ease ; attributs data-animation).
3. Le bloc le plus singulier par sa structure : `header.section_video` « Loom rugs are crafted with integrity an… » (seule à contenir <video>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/5 ordinateur, 0/5 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu (jugé sur les captures, veille du 26 oct 2026, soir)

- **Polices** : Matter (grotesque douce) à une seule graisse, 400 : titres 48 px ordinateur / 36 px téléphone, liens et boutons 24 px. Libre : Hanken Grotesk.
- **Couleurs** : grège #d6cfc4 du haut en bas (chroma 0,017), brun-prune #3e2323 (texte, filets, boutons à contour), blanc sur les photos. Toute la couleur vient des laines.
- **Espacements** : sections de 270 px ordinateur, colonne de 768 px décalée à droite, gouttière 48 px.
- **Formes** : angles droits, boutons à contour de 1 px, liens soulignés.
- **Photos** : laines teintes et tapis empilés plein cadre avec une phrase blanche ; tapis détourés sur le grège en carrousel ; troupeau au premier écran.
- **Mouvement** : rien au défilement ; fondus de 2 s ease entre les vues du diaporama (non repris : rien ne tourne seul, GOUT § 4) ; survols 0,3 s.
- **Architecture** : paysage, phrase, laines, engagement, nouveautés en carrousel, sur-mesure, Instagram, lettre, labels.
- **Geste signature** : un seul fond grège sans aucune rupture, les tapis font la couleur.
