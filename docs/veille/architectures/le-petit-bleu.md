# Le Petit Bleu — architecture « écran partagé : le lieu reste à l'écran, la carte défile à côté »

- Source : https://www.lepetitbleucafe.com/ (démonté le 17 oct 2026). Une seule page à ancres (Menu, About, Contact) ; les commandes partent vers un outil externe (Toast).
- Métier : café-crêperie, 1427 Washington Ave, La Nouvelle-Orléans (par la maison Commander's Palace). Trouvé sur One Page Love (catégorie restaurant).
- Mesures : `le-petit-bleu-demontage.md`, `.json`, `-style.json`, captures `captures/le-petit-bleu-*`.
- Remplace le modèle « plan et lieu d'abord » : le lieu n'est pas un plan en tête de page, il est **fixé** à l'écran pendant toute la visite, ce qui est plus singulier.

## Le modèle en une phrase

À l'ordinateur, l'écran est coupé en deux colonnes de 720 px : à droite, un panneau **fixe** (photos du lieu en diaporama, avec posées dessus une étiquette « We're open! 7:00 AM – 7:00 PM » et une carte « Find us » avec l'adresse) ; à gauche, une colonne qui défile en cartes arrondies (commander, horaires, carte des plats en accordéons à prix pointillés, histoire, contact) ; au téléphone, le panneau du lieu passe en tête puis tout s'empile.

## Schéma de l'accueil (5,7 écrans ordinateur dans la colonne gauche ; 4,7 au téléphone)

```
COLONNE GAUCHE (défile)                                   | COLONNE DROITE (fixe, 720 x 900)
[nav : burger | logo manuscrit | ORDER]                    | [diaporama de photos du café (3 vues, points)]
[carte : h1 « A café by Commander's Palace »               |   étiquette « We're open! 7:00 AM – 7:00 PM » en haut
   + LOCAL PICKUP & DELIVERY « prêt en 15 min » [ORDER ONLINE] |   carte « FIND US » + adresse en bas à droite
   + CATERING « prêt en 48 h » [ORDER CATERING]]           |
[2 cartes : dessin de la devanture | OPEN DAILY 7–19 h + adresse]
[bande défilante de texte (offres de la semaine)]
[bande défilante de photos carrées]
[MENU en lettres géantes + 7 accordéons (Crêpes, Sunrise, Soupes…) ; dedans : plat, prix, ligne pointillée, ingrédients]
[ABOUT en lettres géantes + histoire en 3 paragraphes centrés + photo des deux associées + rangée Instagram]
[CONTACT en lettres géantes + e-mail + téléphone + dessin]
[pied : © | Instagram | retour en haut]
```

Page intérieure : aucune (une page à ancres). Le menu plein écran de la nav liste Order, Menu, About, Contact, Shop gifts, Order online, Order catering, Order holiday pickup.

## Navigation, contact, preuves, téléphone

- Navigation : burger qui ouvre une liste en capitales géantes (56 px ordinateur, 40 px téléphone) ; trois portes de commande nommées par intention (en ligne, traiteur, fêtes) + boutique de cadeaux.
- Contact : horaires et adresse **toujours visibles** à l'ordinateur (panneau fixe) ; téléphone cliquable et e-mail en fin de page ; lien carte sur l'adresse.
- Preuves : la maison mère (Commander's Palace) citée, la photo des associées ; aucun avis.
- Téléphone : le diaporama du lieu occupe 69 % du premier écran avec le h1 et les deux boutons de commande posés dessus, puis la carte horaires + dessin, puis le reste en cartes arrondies ; nav fixe de 85 px.

## Rythme, texte et images, profondeur

Moyen : 475 mots pour la carte (dans des accordéons fermés), 245 pour l'histoire. Peu d'images dans la colonne (vignettes carrées), beaucoup dans le panneau fixe. Profondeur par **deux vitesses** (une moitié fixe, une moitié qui défile) et cartes arrondies posées sur un fond papier.

## Style (à réappliquer tel quel)

- **Polices** (quatre voix) : titres et texte d'accroche en *Self Modern* (serif de caractère) 400 : h1 48 px / 29 px téléphone, interlignage 1,3, interlettrage -1,44 px ; corps 18 / 16 px, interlignage 1,5. Titres de rubriques géants (MENU, ABOUT, CONTACT) en serif condensé capitales pleine largeur de colonne. Libellés d'accordéons et nav en *Archive Mono Pro* (machine à écrire) capitales, nav 56 / 40 px. Texte de service en *Matter SQ* (grotesque). Une signature manuscrite (*Selva Script*) pour le logo et « follow us ».
- **Couleurs** (rôles) : papier `#fcfbf7` (75 % des surfaces) ; bleu canard `#13a7b2` = TOUT le texte, les filets et les boutons (une seule couleur d'encre) ; bleu très pâle `#d6edf0` = filets des cartes et fond des pastilles ; gris `#c4c4c4` = pointillés de la carte ; vert foncé `#103330` ponctuel.
- **Espacements** : cartes séparées de 10 px (gouttière étroite, effet de mosaïque) ; texte centré de 520 px (~58 caractères), 350 px au téléphone.
- **Rayons et bordures** : cartes à 20 px (15 sur l'accueil), vignettes à 8 à 12 px ; filets de 2 px bleu pâle en haut de chaque accordéon ; points du diaporama ronds.
- **Ombres** : aucune.
- **Photos** : carrées (11) et portraits très hauts (8) ; le panneau fixe en plein cadre ; photos de façade, de salle carrelée, de crêpes ; dessins au trait bleu de la devanture et d'un cycliste.
- **Boutons et liens** : boutons rectangulaires cerclés bleu (« ORDER ONLINE »), texte capitales ; liens soulignés bleus dans le texte ; prix alignés à droite avec ligne de points.
- **Icônes** : 9 à 10 (plus des accordéons, flèches).
- **Animations** : `transform 0.2s ease`, bandes défilantes (`scroll 15s linear infinite`), défilement lissé (Lenis), diaporama.
- **Textures** : aucune ; le carrelage et les rayures des photos donnent la matière.

## Ce qui le rend différent de notre déroulé

L'adresse et les horaires ne sont pas « en bas, dans le contact » : ils restent à l'écran du début à la fin. La carte des plats est le cœur de la page (accordéons à prix pointillés), les commandes sont des portes séparées par délai (15 min, 48 h).

## Ce qu'il faudrait à l'usine

- **Coquille** : `split` existe (panneau fixe à gauche avec nom, nav, téléphone, horaires) ; il faut une variante **inversée et photographique** : panneau fixe à droite = photos du client + état « ouvert / fermé » + adresse (`src/lib/horaires.ts` sait déjà calculer la ligne du jour). Soit une option `layout.shellSide`, soit une coquille `src/shells/vitrine-fixe.astro`.
- **Section** : carte des plats ou tarifs en accordéons avec prix et pointillés (`services/accordion` existe sans prix par ligne ; il faut des lignes `{ nom, prix, détail }` par rubrique : nouveau champ `menu[]` ou `services[].lignes[]`).
- Portes de commande par délai : `contact.orderUrl` existe (une seule) ; il en faudrait plusieurs nommées.

Coût : **moyen** (variante de coquille + section carte à prix + champ).

## Convient à (selon les données du client)

Commerce **où l'on vient** (adresse et horaires sont l'information n° 1) avec **une carte ou des tarifs détaillés** et de **bonnes photos du lieu** : café, crêperie, boulangerie, salon de thé, coiffeur, barbier, institut, fromagerie, caviste. Inadapté aux artisans qui se déplacent chez le client (le lieu fixe n'a pas de sens).

## Signes IA à NE PAS reprendre (GOUT § 2)

- **Bandes défilantes** de texte et de photos (deux en cascade) : au plus une, et pas de texte qui tourne en boucle.
- Cartes à **grand rayon** (20 px) partout : prendre 8 à 12 px si le système est à 4 px.
- Couche de chargement couvrant 100 % de l'écran à l'arrivée (mesurée).
- Contraste du bleu canard `#13a7b2` sur papier : 2,8:1 sur du texte courant, illisible ; à foncer pour le texte, garder le bleu clair pour les filets.
- Libellés en capitales machine à écrire espacées partout.
