# Integrated Podiatry Clinic — https://integratedpodiatry.com.au/
Titre « Home - Integrated Podiatry Clinic », `lang="en-AU"`, technologie lue : generator « WordPress 7.1.3 », WordPress, jQuery. Démontage automatique du 2026-10-19 (`ff demonter`, mesures brutes dans `podiatry.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; fond en image plein écran (100 % de l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 6 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; fond en image plein écran (100 % de l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 6 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : non mesuré.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `section.home-main-intro` « Put your feet in good hands » (1,0 écran, 6 mots, 0 img) → `section#secondary-intro` (1,0 écran, 22 mots, 0 img) → `div#content-block` « INTEGRATED PODIATRY ARE » (1,8 écran, 150 mots, 2 img) → `section#content-block--final` « YOUR FEET ARE WITH YOU FOR THE LONG HAUL » (1,0 écran, 60 mots, 0 img). Calques hors flux (fixes/absolus) : `footer#colophon` (absolute, 48 px, collé en bas, 6 mots).
Pied de page : 2 lien(s) — FACEBOOK, INSTAGRAM. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « FACEBOOK » (https://www.facebook.com/IntegratedPodiatryClinic?_rdr=p).
En 3 secondes : à juger sur `captures/podiatry-d.webp` (mesuré : fond du premier écran #ebecec, 1 image(s) et 6 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Roboto**, 16 px / 16 px téléphone, graisse 400, interlignage 1,35 ; h2 **Roboto**, 13 px / 11 px téléphone, graisse 700, interlignage 1,35, capitales, interlettrage 1.28px ; corps **GTSpectra**, 23 px / 16 px téléphone, graisse 400, interlignage 1,35 ; boutons : non mesuré ; nav **Roboto**, 16 px / 16 px téléphone, graisse 400, interlignage 1,35.
Sources `@font-face` : auto-hébergée (GTSpectra) ; fichiers chargés : https://integratedpodiatry.com.au/wp-content/themes/sixheads/fonts/gt-sectra-display-regular-webfont.woff2, https://fonts.googleapis.com/, https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap. Familles en usage sur le texte visible : GTSpectra ×8, Roboto ×6. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ebecec, texte #505759 (contraste 6,23:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ebecec (100 %) ; textes par nombre de caractères : #505759 (98 %), #eaebeb (2 %). Images : 2 `<img>` visibles, 2 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `animation fadeIn 1s ease` ×6, `all 0.5s ease` ×2. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/podiatry-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div#content-block` « INTEGRATED PODIATRY ARE » (1,8 écran, 150 mots, 2 image(s)).
2. L'élément le plus animé : `section#secondary-intro` (animation animation fadeIn 1s ease).
3. Le bloc le plus singulier par sa structure : `section.home-main-intro` « Put your feet in good hands » (contient <svg>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« FACEBOOK »).
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/0 ordinateur, 0/0 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Verdict de la veille (19 oct 2026)

Gardé en atomes (`atomes/podiatry.json`) : essai `ff melanger demo-boulangerie --style podiatry --essai` comparé à la source ; voir la ligne de `INDEX.md`.
