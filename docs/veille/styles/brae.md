# Brae — https://braerestaurant.com/
Titre « Brae », `lang="en"`, description « Led by chef Dan Hunter, Brae is a restaurant, organic farm and boutique accommodation nestled in a hillside in the Otways hinterland. », technologie lue : jQuery. Démontage automatique du 2026-10-26 (`ff demonter`, mesures brutes dans `brae.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « Brae » ; vidéo plein écran (89 % de l'écran) ; bouton principal « Subscribe » à mi-hauteur à droite (1180, 498 px, dans une barre fixe) ; 153 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « Brae » ; vidéo plein écran (95 % de l'écran) ; bouton principal « Reservations » en bas à gauche (20, 789 px) ; 83 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 9 lien(s) — Dine, Stay, Farm, Shop, Home, Seasonal Notes, Getting here, Contact, Reservations ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div#header-bar` (0,1 écran, 10 mots, 0 img) → `section.stagger` (0,9 écran, 8 mots, 1 img) → `section.padding-t_med` « Brae \’brā\ n. — A hillside; a gentle s… » (1,2 écran, 123 mots, 1 img) → `section.layout_ti` (0,8 écran, 37 mots, 1 img) → `section.stagger` « Brae encompasses 20 acres of productive… » (0,7 écran, 17 mots, 1 img) → `section.padding-t_med` (1,3 écran, 63 mots, 1 img) → `section.layout_ti` (0,8 écran, 83 mots, 1 img) → `section.stagger` « Brae is located in Victoria’s Otways hi… » (0,6 écran, 19 mots, 1 img). Calques hors flux (fixes/absolus) : `div.header__container` (sticky, 100 px, 11 mots), `footer.footer` (fixed, 725 px, 131 mots).
Pied de page : 10 lien(s) — See map, +61 3 5236 2226, Email, Privacy Policy, Terms & Conditions, Sustainability Statement, Join our team, Instagram, Designed by Studio Round, Built by New Territory. Téléphone cliquable : oui (1, tel:+61 3 5236 2226). Formulaire : 1 (5 champ(s) dans le premier). Horaires : oui (4 jours nommés, 7 heures, ex. « a, Vic. See map +61 3 5236 2226 Email HOURS Dinner Thursday 17:00 – 22:00 Lunch… »). Portes d'action : « Reservations » (https://braerestaurant.com/reservations), « Learn about our menu » (/dine).
En 3 secondes : à juger sur `captures/brae-d.webp` (mesuré : fond du premier écran #fffef3, 0 image(s) et 153 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Stanley**, 16 px / 16 px téléphone, graisse 400, interlignage 1,40 ; h2 **Stanley**, 20 px / 20 px téléphone, graisse 400, interlignage 1,40 ; corps **Stanley**, 20 px / 12 px téléphone, graisse 400, interlignage 1,40 ; boutons **Stanley**, 15 px / 16 px téléphone, graisse 400, interlignage 1,00 ; nav **Stanley**, 15 px / 12 px téléphone, graisse 400, interlignage 1,40.
Sources `@font-face` : inline (data:) (swiper-icons) ; auto-hébergée (Stanley, Apercu) ; fichiers chargés : https://braerestaurant.com/assets/fonts/Stanley-Regular.woff2, https://braerestaurant.com/assets/fonts/Apercu.woff2. Familles en usage sur le texte visible : Stanley ×46, Apercu ×5. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #fffef3, texte #000000 (contraste 20,72:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #fffef3 (70 %), #000000 (21 %), #68724d (8 %) ; textes par nombre de caractères : #000000 (63 %), #ffffff (38 %). Images : 5 `<img>` visibles, 0 fond(s) en image, 2 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : GSAP (window.gsap), ScrollTrigger (window.ScrollTrigger), Swiper (window.Swiper), jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.3s ease` ×25, `animation fadeIn 0.25s ease-in` ×10, `all 0.2s ease` ×1, `all 0.5s ease` ×1, `all 0.23s ease-in-out` ×1. Scroll lié : ScrollTrigger oui ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 1 bloc(s) de plus d'un écran (`div.header__container` 7,2 écrans). Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/brae-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `section.padding-t_med` (1,3 écran, 63 mots, 1 image(s)).
2. L'élément le plus animé : `a.header__icon` (animation animation fadeIn 0.25s ease-in).
3. Le bloc le plus singulier par sa structure : `section.stagger` (seule à contenir <svg>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : téléphone cliquable, horaires sur l'accueil, portes d'action nommées (« Reservations », « Learn about our menu »), formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/1 ordinateur, 0/3 téléphone ; vidéo en premier écran : oui ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu (jugé sur les captures, veille du 26 oct 2026, soir)

- **Polices** : Stanley (Optimo, serif de livre) partout, 400, 16 à 20 px, jamais en gras ni en grand ; Apercu en capitales 10 px pour les mentions. Le seul grand texte est le logo dessiné posé sur la vidéo. Libre : Spectral.
- **Couleurs** : blanc crème #fffef3 (fond, chroma 0,014), noir #000000 (texte, bandes sous les photos sombres), vert olive #68724d (bandeau d'annonce et pied plein), blanc pour le texte sur photo.
- **Espacements** : sections très hautes (243 à 258 px de marge), texte en colonne étroite (45 caractères) décalée à droite, photos dans les marges.
- **Formes** : aucun bouton ; liens soulignés ; angles droits.
- **Photos** : vidéo du domaine plein écran ; photos verticales et horizontales décalées en grille éditoriale ; deux bandes plein cadre sombres avec une phrase blanche.
- **Mouvement** : chaque photo glisse à sa propre vitesse (0,096 à 0,122 px par px à l'ordinateur, 0,07 à 0,09 au téléphone ; départ décalé de 116 à 177 px), GSAP ScrollTrigger ; survols 0,3 s ease. Profil nouveau `photos-a-plusieurs-vitesses` (MOUVEMENTS.md).
- **Architecture** : une page d'accueil en chapitres (manger, dormir, ferme, boutique) ; chacun : texte court, lien, deux photos ; pied olive à colonnes avec horaires, adresse, lettre.
- **Geste signature** : les photos qui ne glissent jamais ensemble.
