# NerdWallet — https://aboutlife.com/
Titre « NerdWallet: Finance smarter », `lang="en"`, description « NerdWallet makes it easy to find the right financial product for you. Our Nerds do all the research so you don’t have to. », technologie lue : WordPress, Astro, Tailwind. Démontage automatique du 2026-10-23 (`ff demonter`, mesures brutes dans `aboutlife.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « Smart financial decisions start with NerdWallet » ; pas de média plein écran (17 image(s) dans l'écran) ; bouton principal « Start voice input » à mi-hauteur au centre (646, 337 px) ; 109 mots visibles au-dessus du pli ; bannière cookies 6 % de l'écran, non bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « Smart financial decisions start with NerdWallet » ; pas de média plein écran (9 image(s) dans l'écran) ; bouton principal « Start voice input » à mi-hauteur à droite (282, 302 px) ; 95 mots visibles au-dessus du pli ; bannière cookies 26 % de l'écran, non bloquante ; rien ne bouge tout seul.
Nav : 4 lien(s) — Skip to content, NerdWallet Home Page, [SIGN IN], [SIGN UP] ; boutons entre crochets. **Barre fixe en bas de l'écran (téléphone)** : Privacy policy, Manage preferences, CONTINUE.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.compass-v3` (0,1 écran, 19 mots, 4 img) → `main` « Smart financial decisions start with Ne… » (6,1 écrans, 1235 mots, 72 img) → `div.compass-v3` (1,9 écran, 448 mots, 11 img).
Pied de page : 30 lien(s) — LEARN MORE ABOUT THE APP, Download iOS app, Download Android app, Company, Leadership, Careers, Corporate impact, Diversity & Inclusion, Editorial guidelines, Star rating methodologies (+20). Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Insurance Compare car insurance quotes i » (https://www.nerdwallet.com/insurance/auto/car-insurance).
En 3 secondes : à juger sur `captures/aboutlife-d.webp` (mesuré : fond du premier écran #006642, 17 image(s) et 109 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Gotham**, 52 px / 30 px téléphone, graisse 700, interlignage 1,10, interlettrage -0.52px ; h2 **Gotham**, 40 px / 28 px téléphone, graisse 500, interlignage 1,20, interlettrage -0.8px ; corps **Gotham**, 12 px / 12 px téléphone, graisse 400, interlignage 1,33, interlettrage 0.08px ; boutons **Gotham**, 16 px / 16 px téléphone, graisse 400, interlignage 1,50 ; nav **Gotham**, 16 px / 16 px téléphone, graisse 400, interlignage 1,50, interlettrage 0.08px.
Sources `@font-face` : tiers (www.nerdwallet.com) (Chronicle Display, Gotham) ; fichiers chargés : https://www.nerdwallet.com/cdn/fonts/Gotham-Book--critical.fdbad282be.woff2, https://www.nerdwallet.com/cdn/fonts/Gotham-Medium--critical.ee5c613487.woff2, https://www.nerdwallet.com/cdn/fonts/Gotham-Bold--critical.dcf83fb890.woff2, https://www.nerdwallet.com/cdn/fonts/Gotham-Book--full.a4076b3a82.woff2, https://www.nerdwallet.com/cdn/fonts/Gotham-Ultra--critical.c4f630febe.woff2. Familles en usage sur le texte visible : Gotham ×240, GothamDisplay ×25. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff (premier écran #006642), texte #000000 (contraste 21,00:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (62 %), #fff7ea (14 %), #000000 (10 %), #effcf8 (8 %), #006642 (4 %) ; textes par nombre de caractères : #ffffff (39 %), #000000 (34 %), #3d4045 (10 %), #64666a (9 %), #008254 (6 %). Images : 61 `<img>` visibles, 1 fond(s) en image, 0 vidéo(s), `mask-image`/`clip-path` sur 46 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : aucune détectée (window.* et noms de scripts). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `color 0.3s cubic-bezier(0.4, 0, 0.2, 1)` ×88, `all 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)` ×63, `transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)` ×29, `width 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)` ×21, `height 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)` ×21, `opacity 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)` ×21, `color 0.15s cubic-bezier(0.4, 0, 0.2, 1)` ×19, `animation fadeInElement 0.6s ease-in-out` ×14, `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` ×10, `color 0.2s linear` ×9. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/aboutlife-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `main` « Smart financial decisions start with Ne… » (6,1 écrans, 1235 mots, 72 image(s)).
2. L'élément le plus animé : `svg.hp-fade-element` (animation animation fadeInElement 0.6s ease-in-out ; 1 transition(s) : transform 0.6s ease-in-out).
3. Le bloc le plus singulier par sa structure : `div.compass-v3` (seule à contenir <form>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« Insurance Compare car insurance quotes i »), barre d'actions fixe en bas sur téléphone.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/23 ordinateur, 0/22 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
