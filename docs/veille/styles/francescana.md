# Francescana : https://www.osteriafrancescana.it/

Restaurant gastronomique (Modène). Veille du 25 oct 2026 (volet 2a quater). Relevé dans le DOM calculé de Chromium à 1440x900 et 390x844 (`ff atomes mesurer`, brut dans `atomes/mesures/francescana.json`), captures et défilement regardés. On reprend un style, jamais les textes, images, logos ou code.

## Le style en une phrase

Anthracite, texte grège, capitales très espacées, didone en texte courant, un seul bouton framboise, photos en damier jointif.

## Typographie

- Titre : Roboto (graisse 700, interlignage 1.13, casse none, interlettrage 0.06 em) ; libre : **hanken**.
- Texte : Bodoni Moda (graisse 500, interlignage 1.6) ; libre : **bodoni**.
- Échelle (px) : h1 téléphone 22 / ordinateur 30 ; h2 téléphone 22 / ordinateur 30 ; texte téléphone 15 / ordinateur 18.
- Roboto gras en capitales très espacées (0,33 em relevé, noté 0,06 : plafond de la règle apprise du 24 oct) pour les titres, Bodoni Moda (libre, gardée) en texte : contraste sans / didone. Titre écrit en capitales dans le texte source.

## Couleurs

- Régime : sombre ; fond #202123, surface #000000, texte #f7f6f5, texte2 #bcb5b1, accent #cb334f, accent2 à juger, bordure #77726c, encre #000000.
- Anthracite #202123 et noir, texte grège #bcb5b1 (56 % des caractères), bouton framboise #cb334f (Réserver) ; une bande blanc cassé #f7f6f5 et un taupe #77726c entre les photos.

## Espacements, formes, matière

- Marge de section : téléphone 76 / ordinateur 60 ; gouttière : téléphone 30 / ordinateur 10 ; conteneur 900 ; mesure 111 caractères ; rythme alterne. Photos jointives en damier, sans gouttière ; texte centré dans une colonne de 900 px.
- Rayons : bouton 0, carte 0, image 0 ; bordure 0 ; ombre aucune ; bouton plein (casse none) ; lien couleur.
- Matière : fond sections-colorees, filets aucun, texture aucune.

## Photos

- Traitement plein-cadre, superposition aucune, rapports 16:9+, 2:3-, 3:2. Salle et portrait du chef en photo sombre, plats sur fond blanc, juxtaposés en damier sans marge.

## Mouvement

- Profil `fondu-sobre` (calme, défilement apparitions) ; interface 0.3 s / ease ; scène 0.6 s / ease. GSAP et ScrollTrigger chargés, mais à l'œil seuls des fondus ; transitions 0,3 / 0,6 s ease.

## Architecture

Accueil : photo de salle, histoire en texte centré, damier de photos (chef, plats sur blanc, tableaux), menus, réservation. Peu de pages, réservation en bouton fixe.

## Premier écran

Famille `plein-cadre`. Photo de la salle plein cadre sous une nav en bande sombre, bouton Réserver framboise.

## Verdict (essai du 25 oct 2026)

**Gardé**. `ff melanger demo-boulangerie --style francescana --essai`, planche posée à côté des captures de la source. Essai m-f3ad2d : anthracite et framboise reconnaissables, cartes de services sur fond lie-de-vin ; typo non tirée (Bodoni en texte refusée : une didone n'est pas une police de texte), interlettrage plafonné à 0,06 em (capitales espacées = signe IA au-delà).
