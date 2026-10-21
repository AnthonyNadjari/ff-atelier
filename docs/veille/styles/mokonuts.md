# Mokonuts | Locomal | Mokochaya — https://mokonuts.com/
Titre « Mokonuts | Mokoloco | Mokochaya », `lang="en"`, description « Bienvenue dans notre famille de restaurants. », technologie lue : Next.js, Tailwind. Démontage automatique du 2026-10-21 (`ff demonter`, mesures brutes dans `mokonuts.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; pas de média plein écran (0 image(s) dans l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 28 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; pas de média plein écran (0 image(s) dans l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 28 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : non mesuré.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.w-full` (0,3 écran, 28 mots, 0 img).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Déjeuner (Sur Réservation Uniquement) MO » (https://mokonuts.com/fr/mokonuts), « Dîner (Sur Réservation & Sans Réservatio » (https://mokoloco.co/fr/locomal).
En 3 secondes : à juger sur `captures/mokonuts-d.webp` (mesuré : fond du premier écran #fffdf6, 0 image(s) et 28 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 : non mesuré ; corps **IM Fell DW Pica**, 24 px / 20 px téléphone, graisse 400, interlignage 1,20 ; boutons : non mesuré ; nav : non mesuré.
Sources `@font-face` : auto-hébergée (IM Fell DW Pica) ; locale (IM Fell DW Pica Fallback) ; fichiers chargés : https://www.mokonuts.com/_next/static/media/55b096e4b6884221-s.p.woff2. Familles en usage sur le texte visible : IM Fell DW Pica ×8. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #fffdf6, texte #020817 (contraste 19,66:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #fffdf6 (100 %) ; textes par nombre de caractères : #c52a13 (47 %), #699b8d (30 %), #000000 (23 %). Images : 0 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : aucune détectée (window.* et noms de scripts). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.2s ease` ×3. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/mokonuts-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.w-full` (0,3 écran, 28 mots, 0 image(s)).
2. L'élément le plus animé : `a.page-link-hover` (1 transition(s) : all 0.2s ease).
3. Le bloc le plus singulier par sa structure : aucune section ne contient de balise rare (table, details, canvas, video, svg, form, dl…).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« Déjeuner (Sur Réservation Uniquement) MO », « Dîner (Sur Réservation & Sans Réservatio »).
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/0 ordinateur, 0/0 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
