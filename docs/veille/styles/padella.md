# Padella : https://www.padella.co/

Restaurant de pâtes fraîches (Londres, trois adresses). Veille du 24 oct 2026 (volet 2a quater). Relevé dans le DOM calculé de Chromium à 1440x900 et 390x844 (`ff atomes mesurer`, brut dans `atomes/mesures/padella.json`), titre affiché relevé à part, captures et défilement regardés. On reprend un style, jamais les textes, images, logos ou code.

## Le style en une phrase

Noir pur et blanc, capitales condensées Oswald, la carte du jour datée dans un cadre blanc épais, prix alignés.

## Typographie

- Titre : Oswald (graisse 500, interlignage 1.2, casse uppercase, interlettrage 0 em) ; libre : **oswald**.
- Texte : Roboto Condensed (graisse 300, interlignage 1.28) ; libre : **archivo**.
- Échelle (px) : h1 à juger ; h2 telephone 24 / ordinateur 24 ; texte telephone 22 / ordinateur 22.
- Oswald est la police même du site (titres en capitales). Texte en Roboto Condensed 300 : une condensée ne peut pas porter le texte courant dans l'usine, Archivo (qui a une chasse étroite) la remplace. Titres de 24 px pour un texte relevé à 22 (lignes de carte) : rien ne domine, h1 à juger.

## Couleurs

- Régime : sombre ; fond #000000, surface #000000, texte #ffffff, texte2 #aaaaaa, accent #ffffff, accent2 à juger, bordure #ffffff, encre #ffffff.
- Noir pur et blanc (88 % des caractères), gris #aaaaaa pour les notes de carte ; la carte du jour dans un cadre blanc de 3 px. La couleur vient des photos du lieu (bois, cuivre).

## Espacements, formes, matière

- Marge de section : telephone 100 / ordinateur 100 ; gouttière : telephone 36 / ordinateur 28 ; conteneur 1300 ; mesure 76 caractères ; rythme uni.
- Rayons : bouton 0, carte 4, image 0 ; bordure 3 ; ombre aucune ; bouton contour (casse uppercase) ; lien couleur. Cadre blanc épais autour de la carte du jour ; vignettes de lieux à 4 px de rayon (mesuré).
- Matière : fond uni, filets fins, texture aucune.

## Photos

- Traitement plein-cadre, superposition texte-sur-photo, rapports 4:5, 3:2, 16:9+. Photo plein écran de la vitrine où l'on roule les pâtes, nom de chaque adresse en capitales sur sa photo.

## Mouvement

- Profil à juger (pas filmé assez longtemps pour le nommer) ; transitions relevées : interface duree 0.15 / courbe ease-in-out, scène duree 0.8 / courbe ease. La page s'ouvre sur du noir puis la photo apparaît ; une fenêtre « réservations de groupe » couvre la page (non reprise).

## Architecture

Une page : photo de la vitrine où l'on roule les pâtes, les trois adresses en photos titrées, la carte du jour datée (onglets Plats / Boissons), pied. La carte du jour est l'architecture `ardoise-du-jour` (fiche du même tour).

## Premier écran

Famille `plein-cadre`. Photo plein écran de la vitrine, nom en haut.

## Verdict (essai du 24 oct 2026)

**Gardé** (couleurs, densité, formes, photos, matière, premier écran ; typo non tirable : titres de 24 px pour des lignes de carte de 22). Essai m-69a183 : noir et blanc nets ; seul, c'est un noir de plus, le cadre de la carte du jour fait la différence et se reprend dans un bloc.
