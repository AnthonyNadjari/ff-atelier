# Maaemo : https://maaemo.no/

Restaurant gastronomique (Oslo). Veille du 23 oct 2026 (volet 2a quater). Relevé dans le DOM calculé de Chromium à 1440x900 et 390x844 (`ff atomes mesurer`, brut dans `atomes/mesures/maaemo.json`, page intérieure dans `atomes/mesures/maaemo-interieur.json`) ; captures de la source et de l'essai regardées. On reprend un style, jamais les textes, images, logos ou code.

## Le style en une phrase

Noir pur, une linéale maigre en blanc, un seul objet photographié qui sort du noir, et presque rien d'autre : la page se tait.

## Typographie

- Titre : maaemo_regular (graisse 400, interlignage 1.4, casse none, interlettrage 0 em) ; libre : **urbanist**.
- Texte : maaemo_regular (graisse 400, interlignage 1.4) ; libre : **urbanist**.
- Échelle (téléphone / ordinateur, px) : h1 téléphone 28 / ordinateur 45 ; h2 téléphone 28 / ordinateur 45 ; texte téléphone 20 / ordinateur 20.
- maaemo_regular (sans géométrique maigre, dessin maison) : Urbanist, la libre la plus proche à graisse 300-400. Échelle relevée sur /information (le nom de l'accueil fait 45 px à l'ordinateur), texte 20 px partout.

## Couleurs

- Régime : sombre ; fond #000000, texte #ffffff, accent #ffffff, accent2 à juger, surface à juger, encre à juger.
- Fonds mesurés : #000000 (100 %).
- Noir pur et blanc seuls (relevé : fond #000000 100 %, texte #ffffff 100 %) ; aucune couleur d'accent : la couleur vient de la photo de pierre.

## Espacements, formes, matière

- Marge de section : à juger ; gouttière : téléphone 30 / ordinateur 411 ; conteneur 720 ; mesure 76 caractères ; rythme uni.
- Rayons : bouton à juger, carte à juger, image à juger ; bordure à juger ; ombre à juger ; bouton à juger (casse à juger) ; lien couleur.
- Matière : fond uni, filets aucun, texture aucune.

## Photos

- Traitement plein-cadre, superposition texte-sur-photo, rapports 3:2. Une seule photo, pierre sombre en plein cadre, presque noire ; le nom posé au centre.

## Mouvement

- Profil `sortie-du-noir` (calme, défilement aucun) ; interface duree 0.2 / courbe ease-out ; scène duree 0.2 / courbe ease-out ; bibliothèques aucune. Filmé le 23 oct : écran noir, la photo sort du noir en 1,5 s environ, le nom apparaît vers 3 s ; rien au défilement.

## Architecture

Accueil d'un écran : photo, nom, quatre liens aux quatre coins (Informations, Réservations, Cartes cadeaux, Contact) ; pages intérieures en texte seul sur noir, colonne de 720 px.

## Premier écran

Famille `typographique`. Nom centré sur la photo plein cadre, liens dans les angles.

## Verdict (essai du 23 oct 2026)

**Gardé** (atomes typo, couleurs, photos, mouvement, matière, premier écran). Essai `ff melanger demo-boulangerie --style maaemo --essai` (m-cbcd69) : noir, Urbanist maigre, grand vide ; tient la comparaison. Densité et formes restent à juger (accueil sans section ni bouton mesurables). Profil de mouvement nouveau : `sortie-du-noir`.
