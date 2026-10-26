# Landrace — https://www.landracebakery.com/
Titre « Landrace », `lang="en"`, description « Landrace is a bakery, shop and (Upstairs) restaurant specialising in sourdough bread from stoneground UK grains. », technologie lue : jQuery. Démontage automatique du 2026-10-26 (`ff demonter`, mesures brutes dans `landrace.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « Landrace is a bakery, (Upstairs) restaurant & flour mill restoring a regional community of speciality grains & beautifu… » ; pas de média plein écran (2 image(s) dans l'écran) ; bouton principal « Booking Terms & Conditions » en bas à droite (806, 715 px) ; 110 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « Landrace is a bakery, (Upstairs) restaurant & flour mill restoring a regional community of speciality grains & beautifu… » ; pas de média plein écran (2 image(s) dans l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 38 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : non mesuré.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.column` « Landrace is a bakery, (Upstairs) restau… » (4,2 écrans, 21 mots, 0 img) → `div.column` (4,2 écrans, 307 mots, 2 img). Calques hors flux (fixes/absolus) : `div.row` (fixed, 56 px, 4 mots).
Pied de page : aucun pied de page lu. Téléphone cliquable : oui (6, tel:01225424722). Formulaire : 1 (3 champ(s) dans le premier). Horaires : oui (6 jours nommés, 22 heures, ex. « Monday 5:00pm - 9:30pm → Tuesday - Thursday 5:00p »). Portes d'action : « Booking Terms & Conditions » (), « orders@landrace.co.uk » (mailto:orders@landrace.co.uk), « Sample food menu → » (https://www.figma.com/proto/PyV9NBaKBcIbeJ2wskQtIU/Landrace?page-id=39%3A164&node-id=39%3A444&viewpo).
En 3 secondes : à juger sur `captures/landrace-d.webp` (mesuré : fond du premier écran #ffffff, 2 image(s) et 110 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **PitchSans**, 41 px / 26 px téléphone, graisse 500, interlignage 1,20 ; h2 : non mesuré ; corps **PitchSans**, 16 px / 16 px téléphone, graisse 400, interlignage 1,50 ; boutons **PitchSans**, 16 px / 16 px téléphone, graisse 400, interlignage 1,50 ; nav : non mesuré.
Sources `@font-face` : auto-hébergée (PitchSans, Roboto) ; fichiers chargés : https://landrace.co.uk/css/pitch-sans-web-regular.woff2, https://landrace.co.uk/css/pitch-sans-web-semibold.woff2, https://landrace.co.uk/static/bd8539cfb11a56ae196894e1e6d787f1b85a4547/cdn/assets/roboto-latin-400-normal.b009a76ad6afe4ebd301.woff2, https://landrace.co.uk/static/bd8539cfb11a56ae196894e1e6d787f1b85a4547/cdn/assets/roboto-all-400-normal.c5d001fa922fa66a147f.woff. Familles en usage sur le texte visible : PitchSans ×50, Roboto ×1. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #fff5eb (premier écran #ffffff), texte #000000 (contraste 19,51:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #fff5eb (88 %), #ffffff (11 %), #000000 (1 %), #324654 (0 %) ; textes par nombre de caractères : #000000 (99 %), #ffffff (1 %), #e85c41 (0 %). Images : 3 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : aucune détectée (window.* et noms de scripts). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.23s ease-in-out` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/landrace-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.column` « Landrace is a bakery, (Upstairs) restau… » (4,2 écrans, 21 mots, 0 image(s)).
2. L'élément le plus animé : `input#mc-embedded-subscribe` (1 transition(s) : all 0.23s ease-in-out).
3. Le bloc le plus singulier par sa structure : `div.column` (seule à contenir <iframe>, <form>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : téléphone cliquable, horaires sur l'accueil, portes d'action nommées (« Booking Terms & Conditions », « orders@landrace.co.uk », « Sample food menu → »), formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/2 ordinateur, 0/2 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu (jugé sur les captures, veille du 26 oct 2026, soir)

- **Polices** : PitchSans (Klim, chasse fixe façon machine à écrire) seule. h1 : une phrase de présentation, 500, 41 px ordinateur / 26 px téléphone, interlignage 1,2, casse normale. Intertitres (h4) en capitales 600 à 24 px, filet noir de 1 px dessous. Texte 400 à 16 px, interlignage 1,5. Libre : Fragment Mono.
- **Couleurs** : crème rosé #fff5eb (fond de la colonne d'information, chroma 0,017), blanc #ffffff (colonne de la phrase), noir #000000 (texte, filets, barre de navigation), ardoise #324654 (bouton de réservation), rouge #e85c41 (pastilles Michelin seulement).
- **Espacements** : deux colonnes pleine largeur ; la phrase collante à gauche (marges 270 / 108 px), les blocs d'horaires à droite séparés de 56 px ; colonne de texte de 490 px, 50 caractères par ligne.
- **Formes** : angles droits, filets fins, bouton S'inscrire noir à 4 px, liens soulignés partout (courriels, téléphones).
- **Photos** : aucune sur l'accueil (carte Google, deux pastilles).
- **Mouvement** : aucun, sauf le survol du bouton (0,23 s ease-in-out).
- **Architecture** : une seule page en deux colonnes : présentation à gauche ; horaires du restaurant, de la boulangerie, de la pizzeria et du moulin, adresse et carte, réservations, menus, lettre à droite. Le contact est partout (téléphone et courriel par maison).
- **Geste signature** : la phrase du métier en très grand, en chasse fixe, qui reste à gauche pendant qu'on lit les horaires.
- **Garde / refuse** : garde la crème, la chasse fixe, les horaires d'abord ; refuse l'absence de photo comme modèle (GOUT § 0).
