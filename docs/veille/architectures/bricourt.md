# Maisons de Bricourt — architecture « accueil-portes : chaque activité est une grande porte »

- Source : https://www.maisons-de-bricourt.com/fr/ ; page intérieure lue : https://www.maisons-de-bricourt.com/fr/page/chateau-richeux (démontées le 17 oct 2026).
- Métier : maison familiale Roellinger à Cancale (hôtels, gîtes, deux tables, soins, pâtisseries, un livre).
- Mesures : `bricourt-demontage.md`, `.json`, `-style.json`, captures `captures/bricourt-*`.

## Le modèle en une phrase

L'accueil ne raconte rien : sous une photo de paysage, il aligne cinq grandes portes (une par activité), chacune un diptyque photo + aplat gris avec le nom de l'activité et ses sous-pages ; on choisit une porte, et chaque porte mène à une page courte (3,5 écrans) bâtie sur la même grammaire : nom, labels, phrase, photos en grille de deux, bouton Réserver, adresse.

## Schéma de l'accueil (3,7 écrans ordinateur, 4,1 téléphone)

```
[en-tête : FR/EN + réseaux à gauche | MAISONS DE BRICOURT en capitales espacées au centre | RÉSERVER (noir) à droite]
[nav : 6 rubriques en capitales (Hébergements, Tables, Bien-être, Pâtisseries, Livre, Bon cadeau), menus déroulants à vignettes]
[photo de paysage par la fenêtre, 65 % d'un écran, dans la colonne]
[PORTE 1 : photo à gauche | aplat gris « HÉBERGEMENTS » + 4 maisons]
[PORTE 2 : aplat « TABLES » + 2 tables | photo à droite]   (le côté de la photo alterne)
[PORTE 3 : photo | « BIEN-ÊTRE » + 3 soins]
[PORTE 4 : « PÂTISSERIES » + 2 boutiques | photo]
[PORTE 5 : photo | « CORRESPONDANCES » (le livre)]
[pied : nom en filigrane, plan du site en 4 colonnes, nous trouver (lien carte), nous contacter (téléphone, e-mail), labels Relais & Châteaux, newsletter]
```
Chaque porte fait 0,4 écran ; toute la tuile est cliquable (mesuré : liens de 344 à 387 px de haut).

## Schéma d'une page intérieure (Château Richeux, 3,5 écrans)

```
[même en-tête et nav]
[grande photo du lieu, pleine colonne]
[nom du lieu en capitales espacées, centré | logos des labels (Relais & Châteaux, Michelin) | une phrase]
[grille de 2 photos] → [une phrase + bouton RÉSERVER] → [grille 2 x 2 photos]
[une phrase de lieu | adresse et accès en deux lignes centrées]
[pied]
```

## Navigation, contact, preuves, téléphone

- Pages : une par lieu ou activité (22 liens internes : 4 hébergements, 2 tables, 3 soins, 2 pâtisseries, livre, réserver, recrutement, actualités…). Menus déroulants avec vignette photo par sous-page.
- Contact : bouton RÉSERVER toujours en haut à droite (page de réservation), bon cadeau en premier niveau, téléphone et e-mail seulement dans le pied (téléphone non cliquable mesuré).
- Preuves : labels (Relais & Châteaux, étoiles Michelin) en logos sous le nom de chaque lieu ; aucun avis.
- Téléphone : nav en burger ; les portes deviennent photo pleine largeur au-dessus, aplat gris dessous (empilées) ; RÉSERVER disparaît de l'en-tête (seul le burger reste).

## Rythme, texte et images, profondeur

Court et calme : 4 à 10 mots par porte, une phrase par écran dans les pages. Images et aplats à parts égales. Profondeur à plat (aucune ombre ni superposition), assumée : c'est le registre de l'hôtellerie classique.

## Style (à réappliquer tel quel)

- **Polices** : une seule famille serif de titrage, graisse 500 ; h2 35 px / 22 px téléphone, capitales, interlettrage +3,5 px, interlignage 1,1 ; h3 22 / 16 px capitales ; texte 16 / 15 px, interlignage 1,4 ; nav 18 / 16 px capitales ; bouton 14 px 700 capitales. (La famille mesurée, Cormorant Garamond, est sur la liste IA : la remplacer par un autre serif de titrage à capitales larges.)
- **Couleurs** (rôles) : gris clair `#f2f2f2` = fond (70 %) ; gris moyen `#dfdfdf` = aplats des portes (28 %) ; noir `#000000` = texte (92 %) et boutons ; blanc pour le texte des boutons. Aucune couleur d'accent : le site est en niveaux de gris, la couleur vient des photos.
- **Espacements** : colonne centrée d'environ 1 000 px (à juger sur capture) ; portes séparées de ~30 px ; pied en 4 colonnes à filets verticaux.
- **Rayons et bordures** : tout à angle droit ; seuls les boutons réseaux sont ronds ; filets de 1 px noirs (pied) ou `#dfdfdf` (téléphone).
- **Ombres** : aucune.
- **Photos** : paysage 3:2 et très larges, sans filtre ; dans les portes, 35 à 60 % de la largeur ; dans les pages, grille de deux colonnes égales ; vignettes du pied en niveaux de gris qui reprennent leur couleur au survol (`filter: grayscale`).
- **Boutons et liens** : bouton rectangle noir plein, texte blanc 14 à 16 px capitales grasses, 36 à 41 px de haut ; liens en capitales noires sans soulignement.
- **Icônes** : 5 (réseaux, repère de carte) seulement.
- **Animations** : quasi aucune : `color 0.2s ease-in-out`, `background-size 0.3s ease` (zoom léger de la photo au survol des portes).
- **Textures** : aucune.

## Ce qui le rend différent de notre déroulé

L'accueil est un **sommaire** : il ne contient ni présentation, ni avis, ni questions, ni formulaire, seulement des portes vers des pages. Notre déroulé met tout sur l'accueil et traite les pages services comme un complément.

## Ce qu'il faudrait à l'usine

- **Une section** `services/portes` : une tuile par service (photo + aplat, côté alterné, toute la tuile cliquable vers `/services/<slug>`, sous-titres courts). `services/alternating` en est proche mais ce n'est pas un lien plein et il porte du texte.
- **Une coquille courte** ou simplement un layout d'accueil réduit à `hero` + `services/portes` + pied (aucune autre section) : faisable avec `flow` et un layout minimal ; pas de nouvelle coquille.
- **Le gabarit de page service** à la même grammaire (photo, nom, labels, phrase, grille 2 x 2 photos, bouton, adresse) : demande des photos par service (`services[].image` n'en prend qu'une : il faut `services[].images[]`).
- Labels en logos (`business.certifications` existe ; afficher leurs logos sous le titre de la page service).

Coût : **faible à moyen** (une section, un champ `images[]`, un gabarit de page).

## Convient à (selon les données du client)

Client aux **activités ou adresses distinctes** (3 à 6), chacune avec **ses photos** : hôtel-restaurant, domaine (gîtes, salle, cave), boulangerie avec plusieurs boutiques, artisan qui fait du neuf ET de la restauration, menuisier (cuisines, escaliers, dressings). Inadapté au client à service unique ou sans photos par activité.

## Signes IA à NE PAS reprendre (GOUT § 2)

- La police (Cormorant Garamond, liste IA).
- Les titres en **capitales espacées** partout (+3,5 px) : garder les capitales sur le nom seulement, ou un interlettrage nul.
- Le bandeau cookies animé à mascotte qui couvre le coin de l'écran.
