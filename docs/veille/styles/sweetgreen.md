# sweetgreen — https://www.sweetgreen.com/
Titre « sweetgreen | Inspiring healthier communities », `lang="en-US"`, description « healthy salads, hearty wraps, grain bowls, and warm plates made in-house from scratch, using whole produce delivered that morning. », technologie lue : aucune reconnue. Démontage automatique du 2026-10-20 (`ff demonter`, mesures brutes dans `sweetgreen.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « sweetgreen » ; image plein écran (87 % de l'écran) ; bouton principal « ORDER NOW » en bas à gauche (40, 835 px) ; 115 mots visibles au-dessus du pli ; bannière cookies 9 % de l'écran, non bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « sweetgreen » ; image plein écran (88 % de l'écran) ; bouton principal « ORDER NOW » en bas à gauche (16, 755 px) ; 107 mots visibles au-dessus du pli ; bannière cookies 40 % de l'écran, non bloquante ; rien ne bouge tout seul.
Nav : 8 lien(s) — OUR MENU, OUR MISSION, FUNDRAISING, sweetgreen, OUTPOST, CATERING, LOCATIONS, [ORDER] ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.usable-net-wrapper` (0,0 écran, 2 mots, 0 img) → `main#main` « KALE CAESAR » (3,8 écrans, 345 mots, 27 img) → `footer.site-footer` « JOIN OUR NEWSLETTER » (0,6 écran, 90 mots, 3 img). Calques hors flux (fixes/absolus) : `a.skipnav` (fixed, 29 px, 3 mots), `header.site-header` (sticky, 72 px, 9 mots).
Pied de page : 26 lien(s) — [→], iOS, Android, Careers, Investor Relations, Locations, Press, sweetgreen app, The Hex Bowl, Instagram (+16). Téléphone cliquable : non. Formulaire : 1 (1 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « OUR MENU » (/menu), « ORDER » (https://order.sweetgreen.com), « ORDER NOW » (https://order.sweetgreen.com/menu?category=featured), « Order now → » (https://order.sweetgreen.com), « Facebook » (http://facebook.com/sweetgreen), « Gift Cards » (https://order.sweetgreen.com/gift).
En 3 secondes : à juger sur `captures/sweetgreen-d.webp` (mesuré : fond du premier écran #f4f3e7, 3 image(s) et 115 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **SweetSansText**, 16 px / 16 px téléphone, graisse 400, interlignage 1,00 ; h2 **SweetSansText**, 24 px / 20 px téléphone, graisse 400, interlignage 1,20, capitales, interlettrage 0.72px ; corps **SweetSansText**, 18 px / 16 px téléphone, graisse 400, interlignage 1,25 ; boutons **SweetSansText**, 16 px / 16 px téléphone, graisse 400, interlignage 1,00, capitales ; nav **SweetSansText**, 16 px / 16 px téléphone, graisse 400, interlignage 1,00, capitales.
Sources `@font-face` : auto-hébergée (SweetSans, SweetSansText, Grenette) ; fichiers chargés : https://www.sweetgreen.com/static/fonts/Grenette-Light-Pro.woff2, https://www.sweetgreen.com/static/fonts/SweetSans-Regular.woff2, https://www.sweetgreen.com/static/fonts/SweetSansText-Regular.woff2, https://www.sweetgreen.com/static/fonts/Grenette-Regular-Pro.woff2, https://www.sweetgreen.com/static/fonts/SweetSansText-Bold.woff2. Familles en usage sur le texte visible : SweetSansText ×100, SweetSans ×6, SweetSansText-Regular ×4, Grenette ×3, SweetSansText-Bold ×2. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #f4f3e7, texte #0e150e (contraste 16,62:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #f4f3e7 (67 %), #d8e5d6 (18 %), #e8dcc6 (13 %), #ffffff (1 %), #e6ff55 (0 %) ; textes par nombre de caractères : #0e150e (94 %), #f4f3e7 (4 %), #00473c (1 %), #8c8c82 (0 %), #e6ff55 (0 %). Images : 14 `<img>` visibles, 2 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : aucune détectée (window.* et noms de scripts). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `color 0.3s ease-in-out` ×48, `transform 0.3s ease-in-out` ×11, `all 0.3s ease-in-out` ×7, `opacity 0.25s ease-in-out` ×5, `color 0.24s ease-in-out` ×3, `outline-color 0.24s ease-in-out` ×3, `background-color 0.24s ease-in-out` ×3, `border-color 0.24s ease` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 1 bloc(s) de plus d'un écran (`header.site-header` 4,6 écrans). Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/sweetgreen-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `main#main` « KALE CAESAR » (3,8 écrans, 345 mots, 27 image(s)).
2. L'élément le plus animé : `button.btn` (2 transition(s) : color 0.24s ease-in-out ; outline-color 0.24s ease-in-out).
3. Le bloc le plus singulier par sa structure : `main#main` « KALE CAESAR » (seule à contenir <svg>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« OUR MENU », « ORDER », « ORDER NOW », « Order now → », « Facebook », « Gift Cards »), formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 7/15 ordinateur, 6/16 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
