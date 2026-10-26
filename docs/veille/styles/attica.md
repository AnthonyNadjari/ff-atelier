# Attica : https://www.attica.com.au/

Restaurant gastronomique (Melbourne). Veille du 26 oct 2026 (volet 2a quater). Relevé dans le DOM calculé de Chromium à 1440x900 et 390x844 (`ff atomes mesurer`, brut dans `atomes/mesures/attica.json`), planche de défilement ordinateur et téléphone regardée. On reprend un style, jamais les textes, images, logos ou code.

## Le style en une phrase

Noir, serif éditoriale fine, assiettes en grands rectangles, et le fond de la page qui prend la teinte de chaque assiette.

## Typographie

- Titre : Rhymes (graisse 400, interlignage 1.25, casse none, interlettrage 0 em) ; libre : **spectral**.
- Texte : Rhymes (graisse 400, interlignage 1.3) ; libre : **spectral**.
- Échelle (px) : h1 téléphone 32 / ordinateur 48 ; h2 téléphone 18 / ordinateur 24 ; texte téléphone 14 / ordinateur 18.
- Rhymes (serif contemporaine à fort contraste, payante) partout : Spectral, serif éditoriale libre la plus proche, une seule famille en graisse normale ; aucun gras, aucune capitale hors boutons.

## Couleurs

- Régime : sombre ; fond #000000, surface #3b4043, texte #ffffff, texte2 #c8c8c8, accent #7fb89b, accent2 à juger, bordure #ffffff, encre #272b12.
- Noir #000000 au repos ; la couleur de fond de la page (html) change par section en 1 s cubic-bezier(.25,1,.5,1) : vert d'eau #7fb89b, rose très pâle #fff4f4, ardoise #3b4043, olive nuit #272b12 au pied (relevé à 14 hauteurs). Palette gardée : noir, ardoise en surface, vert d'eau en accent, olive en encre ; gris #c8c8c8 relevé à l'œil pour le texte secondaire.

## Espacements, formes, matière

- Marge de section : téléphone 62 / ordinateur 184 ; gouttière : téléphone 24 / ordinateur 44 ; conteneur à juger ; mesure 59 caractères ; rythme uni.
- Rayons : bouton 145, carte 0, image 0 ; bordure 1 ; ombre aucune ; bouton contour (casse uppercase) ; lien souligne.
- Matière : fond uni, filets aucun, texture aucune.

## Photos

- Traitement vignette, superposition aucune, rapports 4:5, 3:2, 16:9+. Assiettes vues de dessus ou de trois quarts sur fond gris, en grand rectangle centré ou décalé ; le portrait du chef sur fond sombre ; la couleur de l'assiette décide de la couleur du fond de la section.

## Mouvement

- Profil `fond-qui-change-de-teinte` (vivant, défilement suit-le-defilement) ; interface 0.3 s / ease ; scène 1 s / cubic-bezier(0.25, 1, 0.5, 1). Mesuré le 26 oct à 14 hauteurs : la couleur de fond du document passe d'une teinte à l'autre quand une nouvelle assiette arrive (1 s cubic-bezier(.25,1,.5,1)) ; GSAP et ScrollTrigger chargés pour le déclenchement ; rien d'autre ne bouge.

## Architecture

Restaurant : mains dans le jardin, mot d'accueil, une assiette par écran (le fond change de teinte), réservation, portrait du chef, pied olive avec adresse, horaires, contacts par service et inscription.

## Premier écran

Famille `editorial`. Photo de cueillette en grand, une seconde plus petite dessous, sur noir ; navigation en une ligne de liens.

## Verdict (essai du 26 oct 2026)

**Gardé**. Essai m-5a2699 : noir, Spectral et vert d'eau sobres et nets. Profil de mouvement nouveau `fond-qui-change-de-teinte` (à écrire dans le bloc sur mesure : le moteur n'a pas encore le déclencheur). Boutons pilule de la source rendus à 6 px.
