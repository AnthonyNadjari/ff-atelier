# Herman Miller — https://www.hermanmiller.com/
Titre « Welcome | Herman Miller », `lang="en"`, description « Choose your Herman Miller experience: shop modern design for your home, or plan and specify for workplaces. », technologie lue : jQuery. Démontage automatique du 2026-10-22 (`ff demonter`, mesures brutes dans `hermanmiller.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « Welcome to Herman Miller » ; image plein écran (100 % de l'écran) ; bouton principal « Online Store » à mi-hauteur à gauche (318, 490 px) ; 76 mots visibles au-dessus du pli ; bannière cookies 9 % de l'écran, non bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « Welcome to Herman Miller » ; image plein écran (100 % de l'écran) ; bouton principal « Online Store » en haut au centre (143, 256 px) ; 76 mots visibles au-dessus du pli ; bannière cookies 31 % de l'écran, non bloquante ; rien ne bouge tout seul.
Nav : non mesuré. **Barre fixe en bas de l'écran (téléphone)** : Cookies Settings, Accept All Cookies. Barre fixe en bas (ordinateur) : Cookies Settings, Accept All Cookies.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.choices` « Shop for home » (0,4 écran, 31 mots, 0 img) → `div.splash__wordmark` (0,2 écran, 0 mots, 1 img) → `footer.site-footer` (0,1 écran, 33 mots, 1 img). Calques hors flux (fixes/absolus) : `picture.splash__bg` (absolute, 900 px), `div.splash__scrim` (absolute, 900 px), `h1.visually-hidden` (absolute, 1 px, 4 mots).
Pied de page : 9 lien(s) — United States, Privacy Notice, Cookie Notice, Do Not Sell My Personal Information, Terms, Accessibility, Legal, CA Supply Chains Act, Sitemap. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/hermanmiller-d.webp` (mesuré : fond du premier écran #252525, 2 image(s) et 76 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Soehne**, 32 px / 32 px téléphone, graisse 700 ; h2 **Soehne**, 48 px / 28 px téléphone, graisse 700, interlignage 1,10, interlettrage -0.4778px ; corps **Meta**, 13 px / 13 px téléphone, graisse 400, interlignage 1,50 ; boutons **Soehne**, 16 px / 13 px téléphone, graisse 600, interlignage 1,20, interlettrage 0.16px ; nav : non mesuré.
Sources `@font-face` : auto-hébergée (Soehne) ; fichiers chargés : https://www.hermanmiller.com/welcome/assets/soehne-halbfett.woff2, https://www.hermanmiller.com/welcome/assets/soehne-kraftig.woff2. Familles en usage sur le texte visible : Soehne ×18, Meta ×3. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #252525, texte #ffffff (contraste 15,33:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #252525 (98 %), #fafafa (1 %), #e22d00 (0 %) ; textes par nombre de caractères : #ffffff (83 %), #acacac (12 %), #252525 (5 %). Images : 2 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s), `mask-image`/`clip-path` sur 1 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : aucune détectée (window.* et noms de scripts). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `background-color 0.12s ease` ×2, `color 0.12s ease` ×2. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/hermanmiller-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.choices` « Shop for home » (0,4 écran, 31 mots, 0 image(s)).
2. L'élément le plus animé : `a#welcome-choice-retail` (2 transition(s) : background-color 0.12s ease ; color 0.12s ease).
3. Le bloc le plus singulier par sa structure : aucune section ne contient de balise rare (table, details, canvas, video, svg, form, dl…).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : barre d'actions fixe en bas sur téléphone.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/4 ordinateur, 0/4 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
