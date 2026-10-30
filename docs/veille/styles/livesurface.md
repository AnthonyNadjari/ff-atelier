# LiveSurface — https://www.livesurface.com/
Titre « LiveSurface: Photo-Real Design Mockup Software », `lang="en"`, description « The professional standard for photo-real mockups. Drag and drop onto thousands of curated surfaces. For Mac, iPad, and Apple Vision Pro. », technologie lue : Nuxt. Démontage automatique du 2026-10-30 (`ff demonter`, mesures brutes dans `livesurface.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; pas de média plein écran (0 image(s) dans l'écran) ; bouton principal « Download LiveSurface 3 for Mac » en bas à gauche (20, 670 px) ; 37 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; pas de média plein écran (0 image(s) dans l'écran) ; bouton principal « Download LiveSurface 3 for Mac » en bas au centre (20, 693 px) ; 24 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 6 lien(s) — Home, Home, Apps, Surfaces, Plans, Learn ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.p-bottom--0` (0,8 écran, 20 mots, 0 img) → `div.p-bottom--0_5` « Live View » (0,5 écran, 87 mots, 0 img) → `div.p-bottom--0_5` (1,2 écran, 0 mots, 1 img) → `div.content__container--in-grid` « Marketplace » (1,1 écran, 77 mots, 12 img) → `div.p-bottom--0_5` « Faster, Simpler » (1,6 écran, 66 mots, 1 img) → `div.p-bottom--1` « More Powerful » (1,2 écran, 451 mots, 36 img) → `div.p-bottom--1` « FAQ » (1,1 écran, 197 mots, 0 img) → `div.bg-color-component--white` « As Always » (1,1 écran, 73 mots, 21 img) → `div.bg-color-component--white` « Industry Standard » (0,8 écran, 21 mots, 0 img) → `div.bg-color-component--white` « Plans » (1,4 écran, 91 mots, 0 img) → `footer` (0,7 écran, 31 mots, 0 img). Calques hors flux (fixes/absolus) : `div#loading-wipe` (fixed, 900 px).
Pied de page : 9 lien(s) — About, Legal, Privacy, Contact, Jobs, Bug Bounty, Sell with Us, Instagram, All Surfaces. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/livesurface-d.webp` (mesuré : fond du premier écran #000000, 0 image(s) et 37 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 **Helvetica Now Display W01 Regular**, 50 px / 27 px téléphone, graisse 400, interlignage 1,25 ; corps **Helvetica Now Display W01 Regular**, 22 px / 18 px téléphone, graisse 400, interlignage 1,35 ; boutons **Helvetica Now Display W01 Regular**, 22 px / 18 px téléphone, graisse 400, interlignage 1,35 ; nav **Helvetica Now Display W01 Regular**, 22 px / 18 px téléphone, graisse 400, interlignage 1,35.
Sources `@font-face` : locale (Helvetica Now Text W01 Regular fallback, Helvetica Now Display W01 Regular fallback) ; auto-hébergée (Helvetica Now Text W01 Regular, Helvetica Now Display W01 Regular) ; inline (data:) (swiper-icons) ; fichiers chargés : https://www.livesurface.com/_nuxt/Helvetica-Now-Display-W01-Regular.CSFP1vtm.woff2, https://www.livesurface.com/_nuxt/Helvetica-Now-Text-W01-Regular.DMyIv2rO.woff2. Familles en usage sur le texte visible : Helvetica Now Text W01 Regular ×111, Helvetica Now Display W01 Regular ×79. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff (premier écran #000000), texte #000000 (contraste 21,00:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (51 %), #000000 (40 %), #ffa075 (5 %), #e3e3e3 (3 %), #999999 (0 %) ; textes par nombre de caractères : #999999 (59 %), #ffffff (24 %), #000000 (14 %), #777777 (3 %). Images : 4 `<img>` visibles, 0 fond(s) en image, 67 vidéo(s), `mask-image`/`clip-path` sur 3 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : Vue (window.__NUXT__). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `opacity 0.5s cubic-bezier(0.5, 0, 0.5, 1)` ×98, `animation bg-color-pulse 1s ease infinite` ×47, `color 0.25s ease` ×32, `width 0.25s ease` ×23, `border-radius 0.25s ease` ×23, `background-color 0.25s ease` ×23, `opacity 0.8s cubic-bezier(0.5, 0, 0.5, 1)` ×12, `border-color 0.25s ease` ×12, `opacity 0.6s cubic-bezier(0.5, 0, 0.5, 1)` ×8, `transform 0.5s cubic-bezier(0.5, 0, 0.5, 1)` ×4. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/livesurface-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.p-bottom--0_5` « Faster, Simpler » (1,6 écran, 66 mots, 1 image(s)).
2. L'élément le plus animé : `div.bg-color-asset--backgroundDarkAlpha` (animation animation bg-color-pulse 1s ease infinite).
3. Le bloc le plus singulier par sa structure : `div.bg-color-component--white` « Plans » (seule à contenir <svg>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : rien de mesurable.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 2/2 ordinateur, 2/2 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
