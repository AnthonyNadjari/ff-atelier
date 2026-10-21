# En construction — https://monbazillac.com/
Titre « En construction », `lang="?"`, description « site en construction », technologie lue : aucune reconnue. Démontage automatique du 2026-10-21 (`ff demonter`, mesures brutes dans `monbazillac.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « Ici prochainement... » ; pas de média plein écran (5 image(s) dans l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 109 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « Ici prochainement... » ; pas de média plein écran (5 image(s) dans l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 109 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : non mesuré.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div#header` (0,1 écran, 0 mots, 1 img) → `div#container` « Ici prochainement... » (0,8 écran, 108 mots, 1 img).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/monbazillac-d.webp` (mesuré : fond du premier écran #ffffff, 5 image(s) et 109 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Trebuchet MS**, 16 px / 16 px téléphone, graisse 700 ; h2 **Trebuchet MS**, 16 px / 17 px téléphone, graisse 700 ; corps **Trebuchet MS**, 11 px / 11 px téléphone, graisse 400 ; boutons : non mesuré ; nav : non mesuré.
Sources `@font-face` : feuilles d'origine croisée non lisibles (). Familles en usage sur le texte visible : Trebuchet MS ×35. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #000000 (contraste 21,00:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (100 %) ; textes par nombre de caractères : #0000ee (45 %), #4c4c4c (27 %), #0068b1 (13 %), #000000 (8 %), #666666 (8 %). Images : 1 `<img>` visibles, 3 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : aucune détectée (window.* et noms de scripts). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : aucune. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/monbazillac-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div#container` « Ici prochainement... » (0,8 écran, 108 mots, 1 image(s)).
2. L'élément le plus animé : non mesuré (aucune animation ni transition CSS lue).
3. Le bloc le plus singulier par sa structure : `div#container` « Ici prochainement... » (seule à contenir <ol>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : rien de mesurable.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/0 ordinateur, 0/0 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
