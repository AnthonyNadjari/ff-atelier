# Cosme — https://www.cosmenyc.com/
Titre « Cosme », `lang="en-US"`, technologie lue : WordPress, jQuery. Démontage automatique du 2026-10-28 (`ff demonter`, mesures brutes dans `cosme.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « ABOUT » ; image plein écran (74 % de l'écran) ; bouton principal « Accessibility Widget, click to open » en bas à droite (1380, 840 px, dans une barre fixe) ; 33 mots visibles au-dessus du pli ; bannière cookies 4 % de l'écran, non bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « ABOUT » ; image plein écran (63 % de l'écran) ; bouton principal « Accessibility Widget, click to open » en bas à droite (330, 784 px, dans une barre fixe) ; 34 mots visibles au-dessus du pli ; bannière cookies 16 % de l'écran, non bloquante ; rien ne bouge tout seul.
Nav : 1 lien(s) — [Menu] ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `section.home__hero` (1,0 écran, 0 mots, 1 img) → `section#about` « ABOUT » (0,7 écran, 52 mots, 1 img) → `section#menu` « MENU » (1,6 écran, 243 mots, 2 img) → `section#gallery` « GALLERY » (1,2 écran, 45 mots, 4 img) → `section#events` « EVENTS » (0,3 écran, 84 mots, 0 img) → `section#contact` « CONTACT » (0,3 écran, 34 mots, 0 img) → `section#gift_card` « DIGITAL GIFT CARD » (0,4 écran, 178 mots, 0 img) → `section#locations` (0,2 écran, 0 mots, 10 img) → `footer.footer` (0,0 écran, 3 mots, 0 img). Calques hors flux (fixes/absolus) : `aside#cookie_cosme` (fixed, 142 px, 25 mots), `header#header` (fixed, 22 px, 2 mots), `aside#header_aside` (fixed, 900 px, 8 mots).
Pied de page : 2 lien(s) — INSTAGRAM, ACCESSABILITY STATEMENT. Téléphone cliquable : oui (1, tel:+1 315-512-4131  ). Formulaire : aucun. Horaires : oui (4 jours nommés, 4 heures, ex. « SUNDAY TO WEDNESDAY 5:00 PM TO 9:30PM THURSDAY TO SATURDAY 5 »). Portes d'action : « Menu » (), « GIFT CARD » (https://cosmenyc.com/#gift_card), « RESERVATIONS » (https://resy.com/cities/new-york-ny/venues/cosme?seats=2&date=2025-07-15), « CHECK E-GIFT CARD BALANCE » (https://www.toasttab.com/cosme-ny-35-e-21st-st/findcard), « BUY E-GIFT CARD » (https://www.toasttab.com/cosme-ny-35-e-21st-st/giftcards).
En 3 secondes : à juger sur `captures/cosme-d.webp` (mesuré : fond du premier écran #6b190f, 1 image(s) et 33 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **CoFoMedium**, 25 px / 25 px téléphone, graisse 400, interlignage 1,50, capitales ; h2 **CoFoMedium**, 25 px / 25 px téléphone, graisse 400, interlignage 1,50, capitales ; corps **CrimisonProRegular**, 21 px / 18 px téléphone, graisse 400, interlignage 1,20 ; boutons **accessibly**, 10 px / 10 px téléphone, graisse 400, interlignage 1,00 ; nav : non mesuré.
Sources `@font-face` : auto-hébergée (CoFoMedium, CoFoRegular, CrimisonProLight, CrimisonProMedium, CrimisonProRegular) ; tiers (cdn.accessibly.app) (accessibly) ; fichiers chargés : https://cosmenyc.com/wp-content/themes/cosme-theme/fonts/CoFoSansMonoMedium_b034f789cad921ba742332dc75a24a83.ttf, https://cosmenyc.com/wp-content/themes/cosme-theme/fonts/CrimsonProRegular_1028.ttf, https://cosmenyc.com/wp-content/themes/cosme-theme/fonts/CrimsonProMedium_1029.ttf, https://cosmenyc.com/wp-content/themes/cosme-theme/fonts/CrimsonProLight_1027.ttf, https://cdn.accessibly.app/accessibly/2.0.3/f8cef3fb44145ec4.woff, https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700&display=swap. Familles en usage sur le texte visible : CrimisonProRegular ×77, CoFoMedium ×54, CrimisonProMedium ×7, CrimisonProLight ×2. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #6b190f, texte #dbdbdb (contraste 8,56:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #6b190f (96 %), #dbdbdb (5 %) ; textes par nombre de caractères : #dbdbdb (99 %), #6b190f (1 %). Images : 18 `<img>` visibles, 5 fond(s) en image, 0 vidéo(s), `mask-image`/`clip-path` sur 1 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : GSAP (window.gsap), ScrollTrigger (window.ScrollTrigger), jQuery (window.jQuery), Slick (script slick.min.js). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `transform 0.4s ease` ×1, `transform 0.3s ease` ×1, `opacity 0.25s linear` ×1, `transform 0.3s ease-in-out` ×1. Scroll lié : ScrollTrigger oui ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/cosme-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `section#menu` « MENU » (1,6 écran, 243 mots, 2 image(s)).
2. L'élément le plus animé : `aside#header_aside` (1 transition(s) : transform 0.4s ease).
3. Le bloc le plus singulier par sa structure : `section#events` « EVENTS » (seule à contenir <table>, <select>, <iframe>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : téléphone cliquable, horaires sur l'accueil, portes d'action nommées (« Menu », « GIFT CARD », « RESERVATIONS », « CHECK E-GIFT CARD BALANCE », « BUY E-GIFT CARD »).
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/4 ordinateur, 0/3 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu (jugé sur les captures, veille du 28 oct 2026, tour 14)

Source : [cosmenyc.com](https://www.cosmenyc.com/), captures `captures/cosme-d.webp`, `-m.webp`, `-planche.jpg`.

- **Polices** : titres de section et lignes de la carte en CoFo Sans Mono Medium (grotesque à chasse fixe) en capitales : 25 px aux deux largeurs (interlignage 1,5), plats 15 à 16 px ; texte en Crimson Pro 21 px à l'ordinateur, 18 px au téléphone, interlignage 1,2 ; le nom est une image vectorielle géante à la verticale. Libres : Fragment Mono (titres) et Spectral (texte ; Crimson est une police « IA », écartée).
- **Couleurs** : sang-de-bœuf #6b190f sur toute la page (96 % des fonds), une seule encre gris clair #dbdbdb pour le texte, le nom, les filets et les liens. Régime : sombre (L 0,35, C 0,117).
- **Espacements** : 75 px de marge de section au téléphone, environ 64 px à l'ordinateur entre filet et titre ; bord de 15 px ; colonnes écartées de 45 px ; conteneur 1 144 px, colonne de 143 px à droite réservée au nom ; texte en trois colonnes courtes (environ 44 caractères).
- **Rayons, bordures, ombres** : angles droits ; filets fins gris clair entre les sections ; aucune ombre.
- **Photos** : salle et chef en noir et blanc, assiettes et bar en couleur ; vignettes de tailles différentes posées à côté du texte ou de la carte, sans cadre, jamais de texte dessus ; premier écran : grande photo de la salle en noir et blanc.
- **Boutons et liens** : aucun bouton plein ; « RESERVATIONS » en haut à gauche en chasse fixe ; liens soulignés (« ACCEPT COOKIES », « BUY E-GIFT CARD », « MAP ») ; menu à trois traits en haut à droite.
- **Animations** : rien n'entre, rien n'apparaît au défilement ; le nom vertical reste fixe dans la marge droite pendant que la page défile ; menu en panneau de 420 px venu de la gauche (transform 0,4 s ease) ; liens 0,1 s. Profil : `nom-en-marge` (nouveau, voir `MOUVEMENTS.md`).
- **Textures** : aucune.

## Architecture

Une seule longue page à ancres (5,3 écrans) : photo de la salle → About (texte en trois colonnes, portrait du chef en noir et blanc) → Menu (la carte entière en chasse fixe, prix collés au plat, photos d'assiettes à côté ; cocktails, sans alcool) → Galerie (photos du bar) → Événements (salle privée, texte) → Contact (courriel, presse, téléphone cliquable, adresse et lien vers la carte, horaires en deux lignes) → carte cadeau numérique → logos des autres maisons du chef → pied (Instagram, accessibilité). « RESERVATIONS » toujours visible en haut à gauche.

**Convient à** : restaurant, bar, cave à manger, traiteur au nom court, qui met sa carte entière en ligne (la chasse fixe pour les plats et les prix) et a des photos de salle passables en noir et blanc ; client « calme ».

**Geste signature** : le nom géant à la verticale, fixe dans la marge, contre lequel toute la page défile.

**Garde / refuse** : garde le sang-de-bœuf et la seule encre grise, la carte en chasse fixe, le noir et blanc de la salle ; refuse le nom en image (à faire en texte réel) et Crimson (police « IA »).
