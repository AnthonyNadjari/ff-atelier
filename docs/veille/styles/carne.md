# CARNE — https://carnehamburguesas.com/en
Titre « CARNE – Hamburguesas », `lang="en-US"`, technologie lue : generator « WordPress 6.5.13 », WordPress, jQuery. Démontage automatique du 2026-10-19 (`ff demonter`, mesures brutes dans `carne.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; vidéo plein écran (73 % de l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 17 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; vidéo plein écran (75 % de l'écran) ; bouton principal « Mobile menu » en haut à droite (361, 20 px, dans une barre fixe, dans la nav) ; 1 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 7 lien(s) — CARNE, Home, Experience, About Us, Mauro, Carne Lab, Contact ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `main#brx-content` « Mauro » (2,3 écrans, 35 mots, 2 img) → `footer#brx-footer` « Our Social Media » (0,4 écran, 21 mots, 1 img). Calques hors flux (fixes/absolus) : `a.skip-link` (fixed, 36 px, 4 mots), `a.skip-link` (fixed, 36 px, 3 mots), `header#brx-header` (fixed, 900 px, 9 mots), `div#trp-floater-ls` (fixed, 58 px, collé en bas, 1 mots).
Pied de page : 6 lien(s) — Jobs in Argentina, Carne Academy, Carne Experience, Carne Lab, Locations, [Go back up]. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/carne-d.webp` (mesuré : fond du premier écran #f5f6f7, 2 image(s) et 17 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 : non mesuré ; corps **Dia**, 24 px / 21 px téléphone, graisse 400, interlignage 1,20 ; boutons **Dia**, 15 px / 20 px téléphone, graisse 700, interlignage 1,70, interlettrage 0.5px ; nav **Dia**, 17 px, graisse 700, interlignage 1,70.
Sources `@font-face` : auto-hébergée (Dia, Roswell, Font Awesome 6 Brands, Ionicons, revicons) ; fichiers chargés : https://carnehamburguesas.com/wp-content/uploads/2022/12/Dia-Bold.ttf, https://carnehamburguesas.com/wp-content/uploads/2022/12/RoswellFourITC.ttf, https://carnehamburguesas.com/wp-content/uploads/2022/12/Dia-Regular.ttf, https://carnehamburguesas.com/wp-content/themes/bricks/assets/fonts/fontawesome/fa-brands-400.woff2, https://carnehamburguesas.com/wp-content/themes/bricks/assets/fonts/ionicons/ionicons.woff2. Familles en usage sur le texte visible : Dia ×21, Roswell ×6. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff (premier écran #f5f6f7), texte #363636 (contraste 12,08:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (62 %), #8bc44a (15 %), #f5f6f7 (15 %), #000000 (9 %) ; textes par nombre de caractères : #363636 (39 %), #f5f5f5 (21 %), #212121 (18 %), #ffffff (14 %), #000000 (4 %). Images : 2 `<img>` visibles, 1 fond(s) en image, 1 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : GSAP (window.gsap), ScrollTrigger (window.ScrollTrigger), jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `transform 0.3s ease` ×2, `animation fadeInLeft 2s ease` ×2, `animation fadeInRight 2s ease` ×1, `opacity 1s ease` ×1, `animation fadeOutDown 1s ease` ×1. Scroll lié : ScrollTrigger oui ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : `data-animation-id` ×4. Ce qui bouge réellement à l'écran : à juger sur `captures/carne-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `main#brx-content` « Mauro » (2,3 écrans, 35 mots, 2 image(s)).
2. L'élément le plus animé : `div#brxe-kidyzm` (animation animation fadeInRight 2s ease ; attributs data-animation-id).
3. Le bloc le plus singulier par sa structure : `main#brx-content` « Mauro » (seule à contenir <video>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : rien de mesurable.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/4 ordinateur, 0/4 téléphone ; vidéo en premier écran : oui ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Verdict de la veille (19 oct 2026)

Gardé en atomes (`atomes/carne.json`) : essai `ff melanger demo-boulangerie --style carne --essai` comparé à la source ; voir la ligne de `INDEX.md`.
