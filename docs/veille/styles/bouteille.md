# Restaurant Zimmerl — https://www.restaurantzimmerl.at/
Titre « Home | Restaurant Zimmerl », `lang="de"`, technologie lue : generator « Concrete CMS », jQuery. Démontage automatique du 2026-10-29 (`ff demonter`, mesures brutes dans `bouteille.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; fond en image plein écran (89 % de l'écran) ; bouton principal « Reservieren » en haut à droite (1125, 38 px) ; 3 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « DAS ZUHAUSE FÜR GROSSE KULINARISCHE MOMENTE » ; pas de média plein écran (9 image(s) dans l'écran) ; bouton principal « Reservieren » en haut à droite (210, 27 px) ; 40 mots visibles au-dessus du pli ; aucune couche bloquante ; bouge tout seul sans défilement : 7 élément(s) (`div`).
Nav : non mesuré.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div#teaser` (0,9 écran, 3 mots, 2 img) → `div#content` (6,1 écrans, 353 mots, 66 img) → `div#footer` (0,1 écran, 11 mots, 1 img) → `div.spacer` (0,1 écran, 0 mots, 0 img).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : 1 (0 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Reservieren » (https://widget.tablein.com/de/widget/zimmerl-0?widget=5798).
En 3 secondes : à juger sur `captures/bouteille-d.webp` (mesuré : fond du premier écran #1f2d2d, 3 image(s) et 3 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Valky**, 47 px / 30 px téléphone, graisse 400, capitales ; h2 **Nord**, 18 px / 16 px téléphone, graisse 300 ; corps **Judson**, 18 px / 16 px téléphone, graisse 400 ; boutons **Nord**, 12 px / 12 px téléphone, graisse 300, interlignage 1,43, interlettrage 1px ; nav : non mesuré.
Sources `@font-face` : auto-hébergée (Glyphicons Halflings, Valky, Nord, Judson, fontello) ; fichiers chargés : https://use.typekit.net/hlh1zpv.css, https://www.restaurantzimmerl.at/application/themes/zimmerl/icons/fontello.woff2?22392238, https://www.restaurantzimmerl.at/application/themes/zimmerl/fonts/NORD-Regular.woff2, https://www.restaurantzimmerl.at/application/themes/zimmerl/fonts/NORD-Light.woff2, https://www.restaurantzimmerl.at/application/themes/zimmerl/fonts/Judson-Regular.woff2, https://www.restaurantzimmerl.at/application/themes/zimmerl/fonts/valkyregular-webfont.woff2. Familles en usage sur le texte visible : Judson ×22, Nord ×16, Valky ×9. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #1f2d2d, texte #ffffff (contraste 14,27:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #1f2d2d (93 %), #223b3b (7 %), #3b5843 (0 %), #d39969 (0 %) ; textes par nombre de caractères : #ffffff (83 %), #d39969 (17 %). Images : 69 `<img>` visibles, 3 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : GSAP (window.gsap), ScrollTrigger (window.ScrollTrigger), jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)` ×11, `animation kenburnsDown 1s ease-out` ×2. Scroll lié : ScrollTrigger oui ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/bouteille-planche.jpg`.

## Le geste signature
Les grands « chiffres du lieu » posés à cheval sur le coin d'une photo : « 23 » en capitales évasées cuivre de 150 px, « GÄNGE »
à 47 px sur sa ligne de base, le tout surplombant le coin haut gauche d'une photo 3:2 qui commence 60 px sous la ligne de base des
lettres ; à droite une deuxième photo verticale, plus haute et partie plus tôt, sort de l'écran. Deuxième scène (« 5 TISCHE ») :
une seule photo large jusqu'au bord droit, et dans la marge gauche un rail vertical cuivre d'1 px ponctué de points (un gros en
haut, deux petits). Au défilement (GSAP), les chiffres glissent par rapport à la photo. Codé dans l'usine : `services/bouteille`
(le premier mot du titre de la prestation en géant, la suite en petit ; le chiffre géant = l'année d'ouverture du client, seul
chiffre du lieu qui tienne comme geste ; jamais un chiffre inventé ni une statistique).

## Construction
Relevé sur les captures 1 440 x 900 (molette tous les 800 px) et 390 x 844, 29 oct 2026. De haut en bas :
1. **Salle (premier écran)** : photo de la salle plein cadre, 89 % de l'écran à l'ordinateur (800 px sur 900), 60 % au téléphone,
   diaporama Ken Burns vers le bas. Posé dessus, seul : le NOM en capitales évasées cuivre (Valky) de 110 px, centré (largeur
   55 % de l'écran), un point cuivre dessous ; flèches du diaporama aux bords. Barre : monogramme rond filet cuivre à gauche,
   langue et bouton « Reservieren » (plaque verte #3b5843, texte cuivre en capitales très larges, rayon 4 px) à droite.
   Rien d'autre sur la photo : ni h1, ni phrase.
2. **Distinctions** : six logos cuivre (Michelin, Gault&Millau…) en une rangée centrée de 700 px, 120 px sous la photo.
3. **Ouverture** : h1 centré en capitales cuivre 47 px sur deux lignes (le h1 vit SOUS la photo), puis un paragraphe centré
   de 3 lignes (Judson 18 px, blanc), 700 px de large. 90 px de vide de part et d'autre.
4. **Le chef** : portrait noir et blanc 316 x 470 px en colonnes 3-5 sur 12, texte en colonnes 7-10 : une phrase d'ouverture en
   capitales larges cuivre (Nord 18 px) puis le texte courant. Rien ne se chevauche.
5. **« 23 GÄNGE »** (geste signature) : grille décalée, chiffre en colonne 1-3 qui déborde sur la photo principale (colonnes
   3-9, 3:2, 720 x 480) ; deuxième photo verticale colonnes 10-12 qui sort à droite et commence 90 px plus haut ; texte (2
   paragraphes + bouton « Menü ») sous la photo principale, colonnes 3-7.
6. **« 5 TISCHE »** : chiffre sur le coin d'une photo de 1 210 px qui va de la colonne 2 au bord droit ; rail cuivre vertical
   à trois points dans la marge gauche, sur toute la hauteur de la photo ; sous elle, deux bandes de photo décalées de 60 px
   (apparition en volets, non reprise : GOUT § 2).
7. **Le lieu** : texte seul, colonnes 4-8 (sous-titre cuivre en capitales larges, titre gras, deux paragraphes).
8. **Produit** : photo 720 x 520 collée au bord gauche, texte à droite colonnes 7-11 : demi-écran image, demi texte.
9. **« Chef's room »** : titre centré cuivre 47 px, phrase centrée, puis une bande de cinq photos noir et blanc de hauteurs
   alternées (330 et 420 px) qui sort des deux bords.
10. **Plaque du contact** : panneau #223b3b plus clair, largeur du conteneur (1 140 px), monogramme rond à cheval sur son bord
   haut ; titre centré, adresse, horaires en capitales larges cuivre sur deux colonnes, bouton « Reservieren ».
11. **Pied** : nom à gauche, e-mail et adresse au centre, mentions à droite ; fond identique à la page.
Échelle : le nom fait 6 fois le texte courant, les chiffres 8 fois ; les titres de section 2,6 fois. Vide : 240 px entre blocs à
l'ordinateur, 130 au téléphone. Fond : un seul vert très sombre partout, un halo vert-olive flou qui dérive derrière (refusé).
Au téléphone : la salle passe à 500 px de haut avec le nom à 40 px ; tout s'empile, les photos gardent leur débord.

Ce que l'usine en fait (style `bouteille`, seconde reprise du 29 oct 2026) : hero `bouteille` = blocs 1 à 3 (la salle tient
l'écran, barre transparente posée dessus ; les distinctions deviennent des emblèmes : logos du client, sinon ses certifications
entre deux filets, la note Google et « Depuis », montés sur le bas de la photo) ; `about/bouteille` = bloc 4 (portrait noir et
blanc devant un cadre décalé) ; `services/bouteille` = blocs 5 et 6, une scène par prestation, le nom qui mord la photo 3:2 et
la verticale qui la chevauche et sort à droite, puis l'année d'ouverture en chiffre géant sur le rail ; `proof/bouteille` = la
bande du bloc 9 qui sort des deux bords, avec les avis ; `contact/bouteille` = plaque du bloc 10 ; pied `liens`. Modèle
`presets/bouteille.json`.
Comparaison : `captures/bouteille-source.jpg` (source) et `captures/bouteille-essai.jpg` (site jetable avec photos d'illustration).

## Ce qu'on garde / ce qu'on refuse
Garde : la salle plein cadre avec le nom seul dessus, le h1 sous la photo, les titres géants en surplomb sur le coin des photos,
les photos qui sortent de l'écran, le rail à points, un seul fond sombre, cuivre rare, boutons plaque à 4 px.
Refuse : le halo vert qui dérive au fond (GOUT § 2, halo), le diaporama automatique (rien ne tourne tout seul, GOUT § 4), les bandes
de photo révélées en volets, le curseur à deux points qui suit la souris, les logos de guides (on n'affiche que les distinctions
réelles du client, en texte). Polices « IA » : aucune ; boutons pilule : 0 ; vidéo en premier écran : non ; couche bloquante : non.

## Reprise du 29 oct, tour 18

Reproches du juge neuf (tour 17) : manquaient le chiffre géant comme preuve, le rail à points visible et l'élégance des
vides ; photo d'escalier en biais ; et, comme les deux autres styles, la fin d'usine (communes, bandeau d'appel,
questions, formulaire, pied sombre, barre basse à trois boutons) que la source n'a pas.
Ce qui a changé :
- **Le chiffre géant** (`services/bouteille`) : après la première scène, une scène de preuve au dessin de « 5 TISCHE » :
  le nombre d'avis Google du client en très grand (30 vw au téléphone, 15 rem à l'ordinateur) avec « avis Google » en
  petit sur la ligne de base, à cheval sur une photo de `proof.gallery`, la note et deux avis recopiés, « Lire les avis » ;
  sinon l'année d'ouverture ; aucune des deux = pas de scène (jamais un chiffre calculé ou arrondi).
- **Le rail cuivre à points** se voit aussi au téléphone (marge gauche des scènes B et du chiffre), filet de 1,5 px.
- **Les vides** : 15 rem entre scènes à l'ordinateur, 8 au téléphone (la source : 240 et 130 px) ; chaque scène est une
  `<section>` sœur dans l'enveloppe `#services`.
- **Fin de page d'après la source** (`presets/bouteille.json`) : `about/portrait` (le chef, bloc 4) → `services/bouteille`
  → `proof/gallery` (la bande de photos, bloc 9) → `contact/bouteille` (nouveau : la plaque un ton plus clair, monogramme
  à cheval sur son bord haut, adresse et plan, horaires et coordonnées en petites capitales très larges sur deux colonnes,
  Réserver, « Écrire un message » replié, dans un grand vide, bloc 10) ; pied `liens` (nouveau, sur le même fond que la
  page, bloc 11). `actionBar: false` : le numéro devient la première ligne sous la photo de salle (premier écran du
  téléphone, GOUT § 0).
- Photo : jetable refait sur une table gastronomique (photos de salle aux bougies, assiettes, cave à barriques), plus
  d'escalier en biais.
- Écart assumé : la salle tient 56 % de l'écran à l'ordinateur (88 % sur la source) ; à 88 % puis 64 %, `ff ressemblance`
  donnait 0,72 puis 0,66 contre maison-aurore (famille « photo plein écran »). Au téléphone, 62 % comme avant.
Preuve : jetable `_essai-reprise-bouteille` (restaurant inventé, `// DEMO`, 9 photos `ff photos-demo`), comparaison
[source au-dessus, nouvel essai dessous](captures/bouteille-essai.jpg). `ff verifier` vert hors données de test, a11y
sans violation, `ff ia` sans signe bloquant ; `ff ressemblance` : téléphone 0,62 au plus (maison-aurore), ordinateur 0,61
(maison-aurore, lemaire-avocats), déroulé 0,54 au plus.
Reste : le nom posé sur une salle plus basse paraît serré à l'ordinateur ; les photos d'illustration ne sont pas celles
d'une seule maison ; la page de prestation (gabarit `fiche`) garde son bandeau d'appel générique.

## Seconde reprise du 29 oct, tour 18

Reproches du juge neuf après la première reprise : le geste signature réduit à de petites photos isolées sous un mot cuivre ;
la salle qui ne tient pas l'écran à l'ordinateur (56 %), des blocs sombres à plat sans profondeur ; au téléphone, le nom mal lu
sur une photo chargée ; « 164 avis Google » mis en scène comme un chiffre de chef ; pas de portrait au bloc chef ; les
distinctions en lignes de texte ; la bande de photos remplacée par une grille de trois vignettes.
Ce qui a changé :
- **La salle tient l'écran** : 86 % de la hauteur à l'ordinateur (source 89 %), la barre transparente (nav `minimal`) posée sur
  la photo, le bas fondu dans le vert, et le téléphone et les distinctions MONTÉS sur ce bas (deux plans), le h1 au pied du
  premier écran. Pour `ff ressemblance` (0,72 contre maison-aurore à 86 %), la différence vient de là et d'un nom sur deux
  lignes (un mot par ligne, jamais coupé) au lieu de rapetisser la photo ; et la photo n'a plus de parallaxe : son image
  débordait de la salle de 12 % et la mesure la comptait sur tout l'écran.
- **Voile au téléphone** : une ellipse d'encre dense sous le nom, en plus du dégradé.
- **Distinctions en emblèmes** : logos du client (`proof.logos`) s'il en a, sinon chaque certification en capitales évasées
  entre deux filets cuivre, la note et « Depuis » au même dessin (chiffre dessus, précision en petites capitales dessous),
  séparés par des filets verticaux.
- **Le chef** : `about/bouteille` (nouvelle variante), portrait noir et blanc 2:3 colonnes 2 à 5 devant un cadre au filet
  cuivre décalé, phrase d'ouverture en petites capitales cuivre, texte courant ; sans portrait, texte centré.
- **Le geste signature** : la verticale de la scène A chevauche le bord droit de la photo 3:2 (ombre réelle) et sort de
  l'écran à droite ; le nom de la prestation mord le coin de la photo et passe devant les deux. Sans `services[].images[0]`,
  une photo de la galerie que les scènes ne montrent pas.
- **Le chiffre géant** = l'année d'ouverture seulement (« 2016 OUVERTURE »), avec le second paragraphe de la présentation et
  Réserver ; le nombre d'avis n'est plus mis en scène (les avis vont dans la preuve). Sans année, pas de scène.
- **La bande** : `proof/bouteille` (nouvelle variante), titre et note centrés, deux avis, puis jusqu'à six photos de hauteurs
  alternées plus larges que l'écran, centrées, coupées des deux côtés (au téléphone, à faire défiler au doigt).
Preuve : jetable `_essai-bouteille2-a` (restaurant inventé, `// DEMO`, photos `ff photos-demo`, supprimé), comparaison
[source au-dessus, essai dessous, écrans d'ordinateur et de téléphone](captures/bouteille-essai.jpg). `ff verifier` vert hors
garde données de test, a11y sans violation critique ni sérieuse, `ff ia` sans signe ; `ff ressemblance` : téléphone 0,56 au
plus, ordinateur 0,63 (maison-aurore), 0,62 (lemaire-avocats), déroulé 0,61 au plus (jardins-mael).
Reste : les photos d'illustration ne sont pas celles d'une seule maison (la source a la lumière d'une seule salle) ; la page de
prestation garde son gabarit `fiche`.
