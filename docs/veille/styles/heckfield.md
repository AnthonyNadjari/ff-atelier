# Heckfield Place : https://www.heckfieldplace.com/

Hôtel et ferme (Hampshire, Angleterre). Veille du 25 oct 2026 (volet 2a quater). Relevé dans le DOM calculé de Chromium à 1440x900 et 390x844 (`ff atomes mesurer`, brut dans `atomes/mesures/heckfield.json`), captures et défilement regardés. On reprend un style, jamais les textes, images, logos ou code.

## Le style en une phrase

Grège en grandes plages, texte prune en capitales espacées, un rouge pour le nom et Réserver, photos de la maison et des bêtes qui se chevauchent en quinconce.

## Typographie

- Titre : johnston-medium (graisse 400, interlignage 1.57, casse uppercase, interlettrage 0.25 em) ; libre : **cabin**.
- Texte : johnston-medium (graisse 400, interlignage 1.53) ; libre : **cabin**.
- Échelle (px) : h1 téléphone 12 / ordinateur 14 ; h2 téléphone 18 / ordinateur 22 ; texte téléphone 15 / ordinateur 15.
- Johnston (humaniste du métro de Londres) en capitales espacées partout, titres de section en rouge : Cabin, humaniste libre. Interlettrage 0,25 em plafonné à 0,06 ; le h1 de 12-14 px est un surtitre, la typo sort du tirage (règle 1,2 fois).

## Couleurs

- Régime : clair ; fond #e3ded7, surface #f8f8f8, texte #614e5d, texte2 #614e5d, accent #cc2a22, accent2 à juger, bordure #cc2a22, encre #614e5d.
- Grège #e3ded7 en grandes plages, texte prune #614e5d (62 % des caractères), un rouge #cc2a22 pour les titres, le logo et Réserver. Le grège est sous le seuil de teinte (chroma 0,011) : régime clair neutre.

## Espacements, formes, matière

- Marge de section : téléphone 250 / ordinateur 231 ; gouttière : téléphone 39 / ordinateur 11 ; conteneur 1140 ; mesure 44 caractères ; rythme uni. Sections de 230 à 250 px de marge, une colonne de texte centrée de 44 caractères.
- Rayons : bouton 2, carte 0, image 0 ; bordure 1 ; ombre aucune ; bouton plein (casse uppercase) ; lien couleur.
- Matière : fond uni, filets aucun, texture aucune.

## Photos

- Traitement vignette, superposition chevauchement, rapports 4:5, 4:3, 3:2. Photos de la maison, des moutons, du jardin en formats différents qui se chevauchent un peu, en quinconce, un mot en capitales blanches posé dessus.

## Mouvement

- Profil `fondu-sobre` (calme, défilement apparitions) ; interface 0.3 s / ease-in-out ; scène 2 s / ease-in-out. Filmé le 25 oct : film sombre au premier écran avec l'emblème et l'initiale en rouge, puis photos en quinconce qui se chevauchent, apparitions en fondu (opacité 0,3 s ease-in-out) ; rien n'est épinglé.

## Architecture

Accueil long : film sombre avec emblème, texte centré entre des photos en quinconce, une entrée par univers (maison, jardins, chambres, ferme, restaurants) avec un mot posé sur la photo, pied. Une page par univers.

## Premier écran

Famille `video-ou-sequence`. Film sombre de la maison derrière un rideau, emblème et initiale en rouge, nav grège.

## Verdict (essai du 25 oct 2026)

**Gardé**. `ff melanger demo-boulangerie --style heckfield --essai`, planche posée à côté des captures de la source. Essai m-fcefdc : grège, rouge et prune tiennent ; typo non tirable (le h1 est un surtitre de 12 px). Capitales espacées de la source plafonnées : on reprend la couleur et la mise en page, pas l'interlettrage.
