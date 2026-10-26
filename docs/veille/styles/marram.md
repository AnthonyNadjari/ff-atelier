# Marram Montauk — https://marrammontauk.com/
Titre « Marram Montauk | Luxury Beachfront Hotel in Montauk, NY », `lang="en"`, description « Experience an intimate, oceanfront boutique resort in the heart of Montauk. Luxury, unique stays, and curated experiences await. », technologie lue : Webflow, jQuery. Démontage automatique du 2026-10-26 (`ff demonter`, mesures brutes dans `marram.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « A TRULY UNIQUE OCEANFRONT EXPERIENCE » ; vidéo plein écran (100 % de l'écran) ; bouton principal « RESERVE » en haut à droite (1131, 40 px, dans une barre fixe) ; 28 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « A TRULY UNIQUE OCEANFRONT EXPERIENCE » ; vidéo plein écran (100 % de l'écran) ; bouton principal « PLAN YOUR TRIP Dates • 2 guests • Promo » en bas au centre (64, 724 px) ; 20 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 8 lien(s) — MARRAM, STAY, DINE, LOCATION, GATHER, OFFERS, EXPERIENCES, [RESERVE] ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `section.section_home-hero` (1,2 écran, 15 mots, 1 img) → `section.section_home-intro` « A TRULY UNIQUE OCEANFRONT EXPERIENCE » (1,7 écran, 34 mots, 3 img) → `section.section_home-experiences` « EXPERIENCES » (1,1 écran, 50 mots, 5 img) → `section.section_home-rooms` « GUEST ROOMS AT MARRAM » (1,3 écran, 38 mots, 4 img) → `section.section_fullbleed` (0,4 écran, 1 mots, 1 img) → `section.section_river-left` « RELAX AND RECONNECT » (0,9 écran, 49 mots, 2 img) → `section.section_river-right` « A TASTE OF MONTAUK » (0,9 écran, 35 mots, 2 img) → `section.section_home-tabs` « EXPLORE MARRAM » (1,2 écran, 45 mots, 1 img) → `section.section_fullbleed` (0,4 écran, 1 mots, 1 img) → `section.section_home-offers` « SPECIAL OFFERS » (0,9 écran, 137 mots, 4 img) → `section.section_home-gatherings` « HOST MEMORABLE EVENTS IN MONTAUK » (1,0 écran, 26 mots, 1 img) → `section.section_fullbleed` (0,4 écran, 3 mots, 1 img) → `section.section_home-instagram` « FOLLOW US ON INSTAGRAM » (1,6 écran, 24 mots, 7 img) → `footer.footer` (0,4 écran, 22 mots, 1 img). Calques hors flux (fixes/absolus) : `div.navbar_component` (fixed, 144 px, 8 mots).
Pied de page : 10 lien(s) — hello@marrammontauk.com, EVENTS, OFFERS, CONTACT, FAQ, SURFLINE CAM, GALLERY, PRIVACY, PARTNERSHIPS, PRESS. Téléphone cliquable : non. Formulaire : 1 (3 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « RESERVE » (/stay).
En 3 secondes : à juger sur `captures/marram-d.webp` (mesuré : fond du premier écran #faf2ec, 3 image(s) et 28 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Styreneaweb**, 40 px / 24 px téléphone, graisse 500, interlignage 1,25, capitales ; h2 **Styreneaweb**, 40 px / 24 px téléphone, graisse 500, interlignage 1,25, capitales ; corps **Heldanetextweb**, 22 px / 20 px téléphone, graisse 400, interlignage 1,80 ; boutons **Styreneaweb**, 14 px / 16 px téléphone, graisse 500, interlignage 1,45, capitales, interlettrage 1.4px ; nav **Styreneaweb**, 14 px, graisse 500, interlignage 1,50, capitales, interlettrage 0.7px.
Sources `@font-face` : inline (data:) (webflow-icons) ; tiers (cdn.prod.website-files.com) (Styreneaweb, Heldanetextweb) ; fichiers chargés : https://cdn.prod.website-files.com/679787af7a72b88c026eaa32/679788b030c6ec4f4038d67e_HeldaneTextWeb-Regular.otf, https://cdn.prod.website-files.com/679787af7a72b88c026eaa32/679788b191863d03e8fba869_StyreneAWeb-Medium.ttf, https://cdn.prod.website-files.com/679787af7a72b88c026eaa32/679788b0c3979a7b4026e70b_HeldaneTextWeb-RegularItalic.otf, https://cdn.prod.website-files.com/679787af7a72b88c026eaa32/679788b0616b56118591d96b_HeldaneTextWeb-Bold.otf, https://fonts.googleapis.com/, https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap. Familles en usage sur le texte visible : Styreneaweb ×60, Heldanetextweb ×25. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #faf2ec, texte #654b37 (contraste 7,26:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #faf2ec (86 %), #d1765d (5 %), #354341 (4 %), #000000 (3 %), #8a7c70 (2 %) ; textes par nombre de caractères : #faf2ec (49 %), #654b37 (37 %), #d1765d (9 %), #ddcfc8 (5 %), #000000 (1 %). Images : 30 `<img>` visibles, 4 fond(s) en image, 3 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : GSAP (window.gsap), ScrollTrigger (window.ScrollTrigger), Swiper (window.Swiper), jQuery (window.jQuery), Webflow (window.Webflow), Lenis (script 653b82ecf87f552a98ac66b9_lenis-master-offbrand.02.). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `text-decoration-color 0.3s ease-in-out` ×22, `all 0.3s ease-in-out` ×13, `opacity 0.3s ease-in-out` ×7, `color 0.3s ease-in-out` ×6, `opacity 0.5s ease-in-out` ×4, `transform 0.3s ease-in-out` ×3, `all 0.2s ease-in-out` ×3, `padding 0.25s ease-out` ×1, `transform 0.1s ease-out` ×1, `transform 6s linear` ×1. Scroll lié : ScrollTrigger oui ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : `data-parallax` ×5, `data-animation` ×1. Ce qui bouge réellement à l'écran : à juger sur `captures/marram-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `section.section_home-intro` « A TRULY UNIQUE OCEANFRONT EXPERIENCE » (1,7 écran, 34 mots, 3 image(s)).
2. L'élément le plus animé : `div.navbar_component` (1 transition(s) : transform 0.3s ease-in-out ; attributs data-animation).
3. Le bloc le plus singulier par sa structure : `section.section_home-instagram` « FOLLOW US ON INSTAGRAM » (seule à contenir <form>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« RESERVE »), formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/17 ordinateur, 0/14 téléphone ; vidéo en premier écran : oui ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu (jugé sur les captures, veille du 26 oct 2026, soir)

- **Polices** : Styrene A 500 en capitales (24 à 40 px pour les titres, jusqu'à 190 px pour les mots posés sur les photos) ; Heldane Text 20 à 22 px, interlignage 1,8, pour le texte. Libres : Epilogue et Literata.
- **Couleurs** : sable rosé #faf2ec (fond, chroma 0,012), brun #654b37 (texte), terre cuite #d1765d (boutons, titres, bandes pleines), vert-de-gris #354341 (pied), taupe #8a7c70 (texte secondaire), #ddcfc8 (filets).
- **Espacements** : sections de 264 px ordinateur / 99 px téléphone, colonne de 800 px.
- **Formes** : angles droits, boutons pleins terre cuite en capitales espacées, filets de 2 px, liens soulignés dont le trait change de couleur au survol.
- **Photos** : vidéos et photos plein cadre traversées par un mot géant crème ; chambres, plage et assiettes en quinconce qui débordent des bandes terre cuite.
- **Mouvement** : défilement amorti (Lenis), photos en parallaxe à trois vitesses dans un même bloc (rapport 1 : 1,5 : 2), survols 0,3 s ease-in-out. Profil `photos-a-plusieurs-vitesses`.
- **Architecture** : hôtel : vidéo, présentation, chambres, expériences, offres, espaces, lettre ; barre de réservation fixe en bas (dates, voyageurs).
- **Garde / refuse** : refuse la fenêtre d'offre et la bulle de discussion posées sur tout le défilement.
