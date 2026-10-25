# Kilchoman : https://www.kilchomandistillery.com/

Distillerie-ferme de whisky (Islay, Écosse). Veille du 25 oct 2026 (volet 2a quater). Relevé dans le DOM calculé de Chromium à 1440x900 et 390x844 (`ff atomes mesurer`, brut dans `atomes/mesures/kilchoman.json`), captures et défilement regardés. On reprend un style, jamais les textes, images, logos ou code.

## Le style en une phrase

Bleu nuit en grandes plages, crème pour la carte dessinée de l'île, un fil or qui mène du premier écran jusqu'à la ferme.

## Typographie

- Titre : Source Sans Pro (graisse 700, interlignage 1.33, casse none, interlettrage 0 em) ; libre : **publicSans**.
- Texte : Source Sans Pro (graisse 400, interlignage 1.71) ; libre : **publicSans**.
- Échelle (px) : h1 téléphone 18 / ordinateur 18 ; h2 téléphone 18 / ordinateur 18 ; texte téléphone 14 / ordinateur 14.
- Source Sans (humaniste) partout ; le titre réel est le logo-enseigne : la typo ne domine pas, elle sort du tirage (règle 1,2 fois).

## Couleurs

- Régime : sombre ; fond #283e6c, surface #192341, texte #ffffff, texte2 #f9f2df, accent #e9e0ce, accent2 à juger, bordure #e9e0ce, encre #192341.
- Bleu nuit #283e6c (36 % des fonds) en grandes plages, bleu plus profond #192341 en pied, crème #e9e0ce / #eee9e0 pour la carte de l'île et les sections claires. Le bleu nuit passe la garde (chroma 0,084, sous 0,13 en sombre).

## Espacements, formes, matière

- Marge de section : téléphone 189 / ordinateur 81 ; gouttière : téléphone 25 / ordinateur 67 ; conteneur 1200 ; mesure 69 caractères ; rythme uni. Grandes plages bleues presque vides autour d'une carte dessinée.
- Rayons : bouton 2, carte 6, image 0 ; bordure 2 ; ombre douce ; bouton contour (casse none) ; lien couleur.
- Matière : fond uni, filets aucun, texture aucune.

## Photos

- Traitement plein-cadre, superposition voile, rapports 16:9+, 1:1, 4:5. Mains sur un fût en plein cadre sous un voile bleu, logo au centre ; carte de l'île dessinée en crème sur le bleu.

## Mouvement

- Profil `fil-qui-mene` (calme, défilement apparitions) ; interface 0.1 s / ease ; scène 0.5 s / ease. Filmé le 25 oct : vidéo sous voile, puis un trait or fixe qui part du bouton et serpente jusqu'à la carte de l'île ; transitions 0,1 / 0,5 s ease.

## Architecture

Accueil long : vidéo sous voile avec le nom au centre, fil vers la carte de l'île et le texte de présentation, grand mot « Farm Distillery » sur le ciel, produits, visites, pied bleu profond. Boutique et club à part.

## Premier écran

Famille `video-ou-sequence`. Vidéo des mains sur un fût sous voile bleu, nom au centre, bouton « découvrir » d'où part le fil.

## Verdict (essai du 25 oct 2026)

**Gardé**. `ff melanger demo-boulangerie --style kilchoman --essai`, planche posée à côté des captures de la source. Essai m-37f289 : le bleu nuit et le crème tiennent la page, bouton à contour fin ; typo de la source non tirable (titre réel = logo), la typo tirée est celle d'un autre style. Profil nouveau : `fil-qui-mene`.
