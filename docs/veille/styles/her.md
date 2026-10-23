# HER : https://her.melbourne/

Bar et salle de concert (Melbourne). Veille du 23 oct 2026 (volet 2a quater). Relevé dans le DOM calculé de Chromium à 1440x900 et 390x844 (`ff atomes mesurer`, brut dans `atomes/mesures/her.json`, page intérieure dans `atomes/mesures/her-interieur.json`) ; captures de la source et de l'essai regardées. On reprend un style, jamais les textes, images, logos ou code.

## Le style en une phrase

Noir, blanc cassé, une néo-grotesque moyenne en capitales sur la photo rouge du lieu : un bar de nuit sans effet.

## Typographie

- Titre : NeueHaasGrotesk (graisse 500, interlignage 1.0, casse uppercase, interlettrage 0.025 em) ; libre : **hanken**.
- Texte : NeueHaasGrotesk (graisse 500, interlignage 1.5) ; libre : **hanken**.
- Échelle (téléphone / ordinateur, px) : h1 téléphone 36 / ordinateur 36 ; h2 à juger ; texte téléphone 17.6 / ordinateur 17.6.
- Neue Haas Grotesk 500 en capitales : Hanken Grotesk 500 (néo-grotesque libre la plus proche, hors liste IA). Texte relevé sur /info, 17,6 px partout. Interlignage du titre relevé sur /info (1,0) : celui de l'accueil (0,49) est celui d'un lien en une ligne.

## Couleurs

- Régime : sombre ; fond #000000, texte #f7f7f4, accent #ffffff, accent2 à juger, surface à juger, encre à juger.
- Fonds mesurés : #000000 (100 %), #ffffff (0 %).
- Noir, blanc cassé #f7f7f4 ; le rouge vient de la photo du lieu, jamais d'un aplat.

## Espacements, formes, matière

- Marge de section : à juger ; gouttière : téléphone 16 / ordinateur 310 ; conteneur 1320 ; mesure 107 caractères ; rythme uni.
- Rayons : bouton 33554400, carte à juger, image 0 ; bordure 0 ; ombre à juger ; bouton plein (casse uppercase) ; lien à juger ; boutons pilule mesurés, rendus à 6 px par ff melanger (GOUT § 2).
- Matière : fond uni, filets aucun, texture aucune.

## Photos

- Traitement plein-cadre, superposition texte-sur-photo, rapports 3:2. Photo du lieu en plein cadre, lumière rouge de la salle ; les noms des salles posés dessus.

## Mouvement

- Profil `fondu-sobre` (calme, défilement apparitions) ; interface duree 0.2 / courbe cubic-bezier(0.4, 0, 0.2, 1) ; scène duree 0.7 / courbe cubic-bezier(0.4, 0, 0.2, 1) ; bibliothèques aucune. Transitions 0,2 s cubic-bezier(0.4, 0, 0.2, 1) sur les liens ; rien d'autre ne bouge à l'écran.

## Architecture

Accueil photo du lieu avec les noms des salles (Rooftop, BKK, Music Room, Bar) ; liens Réservations, Événements, Infos, Privatisations.

## Premier écran

Famille `carte-sur-photo`. Noms des salles posés sur la photo plein cadre.

## Verdict (essai du 23 oct 2026)

**Gardé** (typo, couleurs, photos, mouvement, matière, premier écran). Premier essai m-e1eaef : les accents des capitales touchaient la ligne du dessus (interlignage 1,0) ; règle apprise (plancher 1,1 en capitales, `interlignageTitre`), second essai propre.
