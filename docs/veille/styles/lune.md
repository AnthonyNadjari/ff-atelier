# Lune : https://www.lunecroissanterie.com/

Croissanterie (Melbourne, plusieurs boutiques). Veille du 26 oct 2026 (volet 2a quater). Relevé dans le DOM calculé de Chromium à 1440x900 et 390x844 (`ff atomes mesurer`, brut dans `atomes/mesures/lune.json`), planche de défilement ordinateur et téléphone regardée. On reprend un style, jamais les textes, images, logos ou code.

## Le style en une phrase

Noir pur, grotesque industrielle grasse et serrée, viennoiseries photographiées sur noir, une lettre géante du nom au trait derrière chaque section.

## Typographie

- Titre : DIN Next LT W01 Bold (graisse 400, interlignage 0.65, casse none, interlettrage -0.05 em) ; libre : **chivo**.
- Texte : DIN Next LT W01 Regular (graisse 400, interlignage 1.93) ; libre : **publicSans**.
- Échelle (px) : h1 téléphone 64 / ordinateur 115.2 ; h2 à juger ; texte téléphone 12 / ordinateur 14.
- DIN Next Bold et Regular (grotesque industrielle, payante) : Chivo pour les titres (grotesque robuste, serrée en gras) et Public Sans pour le texte, la plus proche de DIN en lecture ; titres très gras serrés, texte petit et espacé.

## Couleurs

- Régime : sombre ; fond #000000, surface #111111, texte #ffffff, texte2 #9b9b9b, accent #ffffff, accent2 à juger, bordure #333333, encre #000000.
- Noir pur #000000 partout (100 % des fonds mesurés), texte blanc ; la seule couleur vient des viennoiseries photographiées sur noir. Gris #9b9b9b et #333333 relevés à l'œil sur les paragraphes et les lettres au trait (à re-mesurer).

## Espacements, formes, matière

- Marge de section : à juger ; gouttière : téléphone 20 / ordinateur 254 ; conteneur à juger ; mesure 47 caractères ; rythme uni.
- Rayons : bouton 0, carte 0, image 0 ; bordure 1 ; ombre aucune ; bouton contour (casse none) ; lien aucun.
- Matière : fond uni, filets aucun, texture aucune.

## Photos

- Traitement detoure, superposition chevauchement, rapports 1:1, 4:5, 16:9+. Croissants et feuilletés photographiés sur fond noir, sans bord, posés en biais à droite ; mains au travail en vignettes décalées qui se chevauchent ; une lettre géante du nom au trait passe derrière.

## Mouvement

- Profil `nom-en-lettres-geantes` (vivant, défilement suit-le-defilement) ; interface 0.4 s / cubic-bezier(0.25, 0.46, 0.45, 0.94) ; scène 1.6 s / cubic-bezier(0.215, 0.61, 0.355, 1). Mesuré le 26 oct à la molette : chaque section porte une lettre du nom (L, U, N, E) en capitale géante au trait fin (SVG), décalée en translateY d'environ 0,125 px par px défilé, donc plus lente que la page ; transitions du site 0,4 s cubic-bezier(.25,.46,.45,.94) et 1,6 s cubic-bezier(.215,.61,.355,1) relevées dans le CSS (aucune entrée visible au chargement).

## Architecture

Accueil en sections plein écran sur noir : produit vedette détouré et « commander », manifeste court, gros plans, mains au travail en vignettes décalées, liste des boutiques avec adresse ; menu latéral vertical ; une page commande à part.

## Premier écran

Famille `objet-du-metier`. Le croissant détouré à droite sur noir, deux mots d'action en très grand à gauche, menu vertical replié au bord gauche.

## Verdict (essai du 26 oct 2026)

**Gardé**. `ff melanger demo-boulangerie --style lune --essai` (m-381706), planche posée à côté de la source : le noir, Chivo grasse et le texte petit tiennent ; sans photo du client l'essai est vide de matière (la source vit de ses photos produit sur noir) : à ne tirer que pour un client qui a des produits photographiés sur fond uni. Profil de mouvement nouveau `nom-en-lettres-geantes`.
