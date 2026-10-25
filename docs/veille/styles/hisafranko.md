# Hisa Franko : https://www.hisafranko.com/

Restaurant gastronomique (vallée de la Soča, Slovénie). Veille du 25 oct 2026 (volet 2a quater). Relevé dans le DOM calculé de Chromium à 1440x900 et 390x844 (`ff atomes mesurer`, brut dans `atomes/mesures/hisafranko.json`), captures et défilement regardés. On reprend un style, jamais les textes, images, logos ou code.

## Le style en une phrase

Blanc, noir, un rose bonbon pour les boutons, une machine à écrire maigre pour les titres et les menus, photos de gens et de cueillette en quinconce.

## Typographie

- Titre : ABC Gaisyr Mono (graisse 300, interlignage 1.4, casse uppercase, interlettrage 0 em) ; libre : **fragmentMono**.
- Texte : ABC Diatype (graisse 400, interlignage 1.5) ; libre : **karla**.
- Échelle (px) : h1 téléphone 16.4 / ordinateur 20 ; h2 téléphone 16.4 / ordinateur 20 ; texte téléphone 12.2 / ordinateur 14.
- ABC Gaisyr Mono (machine à écrire maigre, en capitales) pour titres et menus, ABC Diatype (grotesque) en texte : Fragment Mono et Karla, libres. Titres à 16-20 px, presque de la taille du texte : la typo sort du tirage (règle 1,2 fois), le reste du style reste.

## Couleurs

- Régime : clair ; fond #ffffff, surface #ffaabb, texte #000000, texte2 #333333, accent #ffaabb, accent2 à juger, bordure #000000, encre #6d071a.
- Blanc, noir, un rose bonbon #ffaabb pour les boutons et les bandes (25 % des fonds), lie-de-vin #6d071a en pied. Le rose en bouton porte un texte noir (contraste AA).

## Espacements, formes, matière

- Marge de section : téléphone 48 / ordinateur 64 ; gouttière : téléphone 32 / ordinateur 88 ; conteneur 1376 ; mesure 81 caractères ; rythme uni. Photos décalées en hauteur d'une colonne à l'autre, texte étroit à côté, beaucoup de blanc.
- Rayons : bouton 0, carte 0, image 0 ; bordure 0 ; ombre aucune ; bouton plein (casse lowercase) ; lien couleur.
- Matière : fond uni, filets fins, texture aucune.

## Photos

- Traitement vignette, superposition aucune, rapports 3:2, 4:5, 4:3. Photos de gens, de cueillette et d'assiettes, de formats différents, posées en quinconce sans cadre.

## Mouvement

- Profil `soulignement-qui-se-dessine` (calme, défilement apparitions) ; interface 0.1 s / ease-out ; scène 0.5 s / cubic-bezier(0.455, 0.03, 0.515, 0.955). Filmé le 25 oct : rien au défilement ; soulignement qui se trace au survol (background-size 0,5 s cubic-bezier(.455,.03,.515,.955)), photos voilées 0,1 s ; premier écran en fondu enchaîné de deux photos plein cadre.

## Architecture

Accueil : diaporama en fondu de deux photos plein cadre, citation en machine à écrire, texte du lieu à côté d'une photo d'équipe, « ce qui nous guide » avec photos décalées, menus, chambres, pied lie-de-vin. Pages : menu, chambres, philosophie, contact, questions.

## Premier écran

Famille `plein-cadre`. Photos plein cadre (assiette vue de dessus, puis cueillette) en fondu enchaîné, nom en machine à écrire au centre de la nav.

## Verdict (essai du 25 oct 2026)

**Gardé**. `ff melanger demo-boulangerie --style hisafranko --essai`, planche posée à côté des captures de la source. Essai m-8c463a : blanc, bouton rose, emphase lie-de-vin ; on reconnaît la source. Typo non tirable (titres de 16-20 px, presque la taille du texte) : la machine à écrire reste à reprendre en bloc sur mesure. Profil nouveau : `soulignement-qui-se-dessine`.
