# Saint James — https://saintjames.com/
Titre « Home | Saint James », `lang="en"`, technologie lue : Next.js, Tailwind. Démontage automatique du 2026-10-25 (`ff demonter`, mesures brutes dans `saintjames.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; image plein écran (79 % de l'écran) ; bouton principal « EN » en haut à droite (1061, 80 px, dans une barre fixe) ; 55 mots visibles au-dessus du pli ; aucune couche bloquante ; bouge tout seul sans défilement : 6 élément(s) (`button#headlessui-popover-button-1`, `section.relative`, `div.flex-1`, `main.relative`, `button.slick-arrow`, `div.slick-list`).
Téléphone (390x844) : h1 absent ; pas de média plein écran (20 image(s) dans l'écran) ; bouton principal « Open main menu » en haut à gauche (16, 38 px, dans une barre fixe) ; 35 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 20 lien(s) — NEW ARRIVALS, [NEW ARRIVALS], OCTOBER SALE, [OCTOBER SALE], DINNERWARE, [DINNERWARE], CUP & MUG, [CUP & MUG], SERVING DISHES, [SERVING DISHES], KIDS TABLEWARE, [KIDS TABLEWARE] (+8) ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.lg:container` (0,8 écran, 31 mots, 15 img) → `div.slick-product` « New Releases » (0,5 écran, 221 mots, 16 img) → `ul.flex` (0,5 écran, 16 mots, 6 img) → `div.h-[360px]` (0,8 écran, 0 mots, 1 img) → `div.slick-product` « Featured Collection » (0,5 écran, 83 mots, 6 img) → `div.flex` « Saint James Collection » (0,5 écran, 52 mots, 2 img) → `div.h-[360px]` (0,8 écran, 0 mots, 1 img) → `footer` (0,3 écran, 20 mots, 0 img). Calques hors flux (fixes/absolus) : `div.sticky` (sticky, 187 px, 28 mots).
Pied de page : 6 lien(s) — Store & Refund Policy, Shipping Policy, Privacy Policy, Terms of Service, Instagram, Talk to Us. Téléphone cliquable : non. Formulaire : 1 (1 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « GIFT » (/store).
En 3 secondes : à juger sur `captures/saintjames-d.webp` (mesuré : fond du premier écran #ffffff, 18 image(s) et 55 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 **Open Sans**, 24 px / 24 px téléphone, graisse 400, interlignage 1,33 ; corps **Open Sans**, 16 px / 16 px téléphone, graisse 400, interlignage 1,50 ; boutons **Open Sans**, 16 px / 16 px téléphone, graisse 400, interlignage 1,50 ; nav **Open Sans**, 12 px, graisse 400, interlignage 1,67.
Sources `@font-face` : auto-hébergée (slick, Didot, Myriad, Avenir) ; Google Fonts (Inter, Open Sans) ; fichiers chargés : https://fonts.gstatic.com/s/opensans/v44/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-mu0SC55I.woff2, https://saintjames.com/_next/static/media/avenir.2f962edf.otf, https://saintjames.com/_next/static/media/slick.653a4cbb.woff, https://saintjames.com/_next/static/media/didot.bd4447eb.ttf, https://fonts.googleapis.com/. Familles en usage sur le texte visible : Open Sans ×101, Didot ×12, Avenir ×6. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #000000 (contraste 21,00:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (98 %), #4f5b34 (2 %), #efefef (0 %) ; textes par nombre de caractères : #6b737b (74 %), #929aa0 (10 %), #ffffff (10 %), #6b7280 (3 %), #4f5b34 (2 %). Images : 48 `<img>` visibles, 4 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : React (window.__NEXT_DATA__). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.5s cubic-bezier(0.4, 0, 0.2, 1)` ×22, `all 0.2s cubic-bezier(0, 0, 0.2, 1)` ×12, `color 0.2s cubic-bezier(0.4, 0, 0.2, 1)` ×2, `color 0.15s cubic-bezier(0.4, 0, 0.2, 1)` ×2. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 1 bloc(s) de plus d'un écran (`div.sticky` 5,1 écrans). Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/saintjames-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.lg:container` (0,8 écran, 31 mots, 15 image(s)).
2. L'élément le plus animé : `section.relative` (1 transition(s) : color 0.2s cubic-bezier(0.4, 0, 0.2, 1)).
3. Le bloc le plus singulier par sa structure : `footer` (seule à contenir <svg>, <select>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« GIFT »), formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/40 ordinateur, 0/26 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
