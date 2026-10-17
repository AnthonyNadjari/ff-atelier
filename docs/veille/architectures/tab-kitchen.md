# TAB Kitchen & Bakery — architecture « récit en scènes plein écran épinglées : on traverse le lieu »

- Source : https://tabkitchenbakery.com/ (démonté le 17 oct 2026). Une seule page, aucun lien interne (0 mesuré) ; site fait par le studio liquidink.design (Framer). Trouvé sur One Page Love (catégorie restaurant).
- Métier : café-boulangerie de quartier, JP Nagar, Bangalore (Inde).
- Mesures : `tab-kitchen-demontage.md`, `.json`, `-style.json`, captures `captures/tab-kitchen-*` ; défilement filmé à la molette (16 vues) : `captures/tab-kitchen-roue.jpg`.

## Le modèle en une phrase

La page est une suite de **scènes plein écran épinglées** (4 blocs collants de 3,7 à 4 écrans chacun) : on défile et la scène change sur place au lieu de monter (un titre, puis une illustration de la salle qui s'ouvre, puis un zoom sur un meuble, puis les espaces du café en panneaux de couleur qui glissent, puis l'équipe en cartes) ; une barre fine « TAB KITCHEN/BAKERY | JP NAGAR » reste en haut ; 26 écrans au total.

## Schéma de l'accueil (25,9 écrans ordinateur, 21 téléphone)

```
[barre fixe 70 px : nom à gauche | quartier à droite, en machine à écrire]
SCÈNE 1 (fixe, 1 écran) : aplat terracotta, « Take A Break » + « A cafe rooted in Bengaluru's Memory »
SCÈNE 2 (collante, 3,7 écrans) : « Here stands a Cafe / That Feels Like Home » ; une illustration ovale de la salle apparaît entre les deux lignes, des feuilles entrent par les côtés, puis zoom dans l'illustration jusqu'au buffet
[texte d'histoire en colonne étroite à droite (machine à écrire) + logo en cartouche ; objets dessinés qui tombent (boîte, coffret)]
[« Everyone brings in their story » : titre mêlé de script, photo dans une arche]
[« Memoirs of our 'luru » : guirlande de fanions, texte en colonne]
SCÈNE 3 (collante, 4 écrans, `#tabview`) : les ESPACES en panneaux de couleur qui se poussent :
   « The Outdoor Patch » (olive) → « The Baking Corner » (ocre) → … chacun : titre, phrase, objet dessiné, photo
[« More than a café, a meeting of flavour, Comfort cuisine » : objets dessinés (verre, assiette)]
[planche façon bande dessinée « quiet corner of Bangalore »]
SCÈNE 4 (collante, 3,5 écrans, `#cardstrigger` 6,5 écrans) : « The people behind the Legacy » ; cartes de l'équipe (prénom, rôle, photo, phrase) qui arrivent par la droite
[fin : adresse (lien carte), pied]
```

Page intérieure : aucune.

## Navigation, contact, preuves, téléphone

- Navigation : aucune (pas de menu, pas de lien interne) ; la page se lit d'un bout à l'autre.
- Contact : un lien vers Google Maps en fin de page ; aucun téléphone, aucun horaire mesuré.
- Preuves : l'équipe nommée avec photos ; les espaces photographiés ; aucun avis.
- Téléphone : mêmes scènes épinglées (3 blocs collants), barre de 55 px ; titres 72 px.

## Rythme, texte et images, profondeur

Très long et lent (26 écrans pour 618 mots) : le défilement sert à mettre en scène, pas à lire. 59 images (photos + illustrations), 110 éléments masqués (`clip-path`). Profondeur maximale : illustrations en couches, zoom dans la scène, panneaux qui se recouvrent, cartes qui glissent par-dessus le titre.

## Style (à réappliquer tel quel)

- **Polices** (quatre voix assumées) : titres en *Inria Serif* 400, h1 90 px / 72 px téléphone, interlignage 1,2 ; texte courant en **machine à écrire** *Sometype Mono* 18 / 19 px, interlignage 1,2, en colonnes étroites (220 à 610 px) ; mots d'accent en script calligraphique (*PP Editorial New*, *Ballet*) mêlés au titre (« Legacy », « Baking ») ; affichage condensé *Bayon* pour « THE PEOPLE BEHIND THE » ; *Shrikhand* (rond, gras) ponctuel.
- **Couleurs** (rôles) : sable `#f7e5cd` = fond principal (35 %), crème `#faf2e6` (9 %), blanc (41 % mesuré, écrans de transition) ; terracotta `#9c4f48` (écran d'ouverture, liens) ; ocre `#efb55b` (panneau Baking Corner, 5 %) ; olive (panneau Outdoor Patch) ; brun `#472e1b` et vert nuit `#222b1f` = textes secondaires ; noir = texte machine à écrire (74 %). Chaque espace du café a sa couleur.
- **Espacements** : scènes de 100 vh ; textes en colonnes étroites décalées (24 à 54 caractères) ; aucune grille de cartes avant la scène de l'équipe.
- **Rayons et bordures** : cartes d'équipe à ~26 px, vignettes à ~16 px ; photos en arche ou en ovale ; aucune bordure.
- **Ombres** : aucune ombre CSS ; les cartes d'équipe ont un fond crème posé sur sable.
- **Photos** : peu de photos, cadrées en arche, ovale ou rectangle étroit ; le gros du visuel est **illustré** (dessins à plat de la salle, du buffet, des objets, planche de bande dessinée) dans la palette du site.
- **Boutons et liens** : quasiment aucun (2 liens mesurés) ; curseur personnalisé.
- **Icônes** : 1 ; les objets dessinés en tiennent lieu.
- **Animations** : Framer Motion et Lottie ; tout est lié au défilement dans les scènes collantes (zoom, entrée latérale des feuilles, panneaux qui se poussent, cartes qui arrivent) ; aucune transition CSS mesurée.
- **Textures** : à plat ; motifs indiens (cartouche, fanions, ornements) dessinés.

## Ce qui le rend différent de notre déroulé

Il n'y a pas de sections qui montent, il y a des **scènes** qui changent sur place ; on visite le lieu pièce par pièce (les espaces du café sont des chapitres) et on finit sur l'équipe. Notre déroulé empile des blocs informatifs ; ici, presque rien n'est informatif.

## Ce qu'il faudrait à l'usine

- **Coquille** : `slides` (sections plein écran aimantées) et le moteur `data-pin` + `data-pin-step` (scène épinglée à étapes en fondu croisé) existent déjà ; il manque une **section « espaces »** `about/espaces` : un panneau de couleur par espace ou atelier (nom, phrase, photo), qui se poussent dans une scène épinglée (étapes `data-pin-step`, iPhone : étapes, pas de calage image par image, voir les pièges de `CLAUDE.md`).
- **Section équipe** en cartes arrivant de côté : `about.team` existe (nom, rôle, photo) ; manque la variante.
- Les illustrations : seulement si le client en a (dessinateur, carte illustrée) ; l'usine n'en invente pas.
- Le socle (téléphone, métier + ville, horaires, plusieurs pages) est entièrement absent ici : il faut le reposer (barre fixe avec téléphone, pages services).

Coût : **moyen** (deux sections ; le moteur d'épinglage existe ; la coquille `slides` sert de base).

## Convient à (selon les données du client)

Lieu **qu'on visite** avec **plusieurs espaces ou ateliers** à montrer (au moins 3) et **une équipe qui pose** : café, boulangerie avec salle, restaurant, tiers-lieu, atelier visitable, ferme. Client qui veut séduire plus qu'informer. Inadapté à l'urgence et aux clients pressés.

## Signes IA à NE PAS reprendre (GOUT § 2)

- **Script calligraphique mêlé au titre** pour l'emphase (« Legacy », « Comfort cuisine ») : c'est l'emphase en italique refusée, en plus voyant.
- Quatre ou cinq familles de polices dont deux Google « IA » chargées (Lora, Inter) : en garder deux.
- **26 écrans** pour 600 mots et zéro information pratique (ni téléphone ni horaires) : le défilement doit rester court.
- Curseur personnalisé.
- Photo dans une **arche** répétée : une fois, pas partout.
