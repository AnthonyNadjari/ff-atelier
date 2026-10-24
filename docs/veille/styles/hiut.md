# HiutDenim : https://hiutdenim.co.uk/

Atelier de jeans (Cardigan, pays de Galles). Veille du 24 oct 2026 (volet 2a quater). Relevé dans le DOM calculé de Chromium à 1440x900 et 390x844 (`ff atomes mesurer`, brut dans `atomes/mesures/hiut.json`), titre affiché relevé à part, captures et défilement regardés. On reprend un style, jamais les textes, images, logos ou code.

## Le style en une phrase

Écru, noir et un seul rouge, une grotesque en capitales espacées, et des diptyques photo bord à bord (le jean porté en noir et blanc, la matière en couleur).

## Typographie

- Titre : Founders Grotesk (graisse 600, interlignage 1.11, casse uppercase, interlettrage 0.15 em) ; libre : **hanken**.
- Texte : Founders Grotesk (graisse 400, interlignage 1.5) ; libre : **hanken**.
- Échelle (px) : h1 telephone 30 / ordinateur 36 ; h2 telephone 24 / ordinateur 24 ; texte telephone 16 / ordinateur 16.
- Founders Grotesk (grotesque à la Akzidenz, commerciale) : Hanken Grotesk, la libre la plus proche à 600 en capitales espacées (0,15 em) pour les titres, 400 pour le texte. Titre AFFICHÉ = le nom du produit posé sur le diptyque (30 / 36 px, relevé dans le DOM le 24 oct), le h1 du code est un petit titre de 20 px.

## Couleurs

- Régime : clair ; fond #f5f4f0, surface #ffffff, texte #000000, texte2 à juger, accent #000000, accent2 #c00000, bordure à juger, encre #000000.
- Écru #f5f4f0 sur toute la page, noir pur pour le texte et les boutons, un seul rouge #c00000 (onglet « inscription » sur le bord droit, mesuré dans les fonds). Rien d'autre : la couleur vient des photos (herbes, indigo).

## Espacements, formes, matière

- Marge de section : telephone 48 / ordinateur 64 ; gouttière : telephone 16 / ordinateur 16 ; conteneur 1440 ; mesure 69 caractères ; rythme uni. Marges de section non relevées par l'outil (texte porté par les enfants) : 48 / 64 px lus sur les captures (écart entre le diptyque et le texte produit). Pleine largeur avec 16 px de bord.
- Rayons : bouton 0, carte 0, image 0 ; bordure 0 ; ombre aucune ; bouton plein (casse uppercase) ; lien souligne.
- Matière : fond uni, filets aucun, texture aucune.

## Photos

- Traitement plein-cadre, superposition texte-sur-photo, rapports 4:5, 1:1. Diptyque bord à bord : une photo noir et blanc (le jean porté) à côté d'une photo couleur de matière (herbes sèches), le nom du produit posé à cheval sur les deux. Puis portraits produits 4:5 sur fond clair.

## Mouvement

- Profil à juger (pas filmé assez longtemps pour le nommer) ; transitions relevées : interface duree 0.4 / courbe ease-in-out, scène à juger. Transitions courtes (0,15-0,4 s) ; une fenêtre d'inscription couvre la page au défilement (non reprise).

## Architecture

Boutique : diptyque d'ouverture, produits en portraits 4:5, histoire de l'atelier, guides ; onglet rouge « inscription » collé au bord droit.

## Premier écran

Famille `diptyque`. Diptyque photo bord à bord, nom du produit à cheval sur les deux.

## Verdict (essai du 24 oct 2026)

**Gardé** (typo, couleurs, densité, formes, photos, matière, premier écran). Premier essai m-b9c2ba : h1 cassé en six lignes par l'espacement de 0,15 em ; règle apprise `interlettrageTitre` (plafond 0,06 em). Second essai (m-b9c2ba, règle appliquée) : le h1 tient en quatre lignes au téléphone, écru, noir et capitales grotesques : tient la comparaison.
