# Ekstedt : https://www.ekstedt.nu/

Restaurant au feu de bois (Stockholm). Veille du 23 oct 2026 (volet 2a quater). Relevé dans le DOM calculé de Chromium à 1440x900 et 390x844 (`ff atomes mesurer`, brut dans `atomes/mesures/ekstedt.json`) ; captures de la source et de l'essai regardées. On reprend un style, jamais les textes, images, logos ou code.

## Le style en une phrase

Ivoire chaud, anthracite en en-tête et en pied, une vidéo de feu en plein cadre : la chaleur vient de l'image, pas d'un aplat.

## Typographie

- Titre : Playfair (graisse 400, interlignage 1.63, casse uppercase, interlettrage 0.15 em) ; libre : **à juger**.
- Texte : Source Sans 3 (graisse 400, interlignage à juger) ; libre : **à juger**.
- Échelle (téléphone / ordinateur, px) : h1 téléphone 32 / ordinateur 32 ; h2 téléphone 32 / ordinateur 45.2 ; texte téléphone 16 / ordinateur 19.
- Titres en Playfair (liste IA) en capitales espacées de 0,15 em : à l'essai du 23 oct (Libre Bodoni + Cabin), ff melanger garde l'interlettrage mesuré et la page lit comme un faux luxe d'IA (capitales espacées, GOUT § 2). Typo non reprise : à juger ; les couleurs, la densité et les photos servent.

## Couleurs

- Régime : clair ; fond #f2eee2, texte #222221, accent #222221, accent2 à juger, surface à juger, encre #222221.
- Fonds mesurés : #f2eee2 (94 %), #222221 (6 %).
- Ivoire #f2eee2 (94 % des fonds), anthracite #222221 pour le texte, l'en-tête et le pied ; la chaleur vient de la vidéo du feu.

## Espacements, formes, matière

- Marge de section : téléphone 114 / ordinateur 222 ; gouttière : téléphone 20 / ordinateur 83 ; conteneur 1440 ; mesure 119 caractères ; rythme uni.
- Rayons : bouton 0, carte à juger, image 0 ; bordure 1 ; ombre à juger ; bouton contour (casse uppercase) ; lien à juger.
- Matière : fond uni, filets aucun, texture aucune.

## Photos

- Traitement plein-cadre, superposition texte-sur-photo, rapports 3:2, 1:1, 16:9+. Vidéo du four à bois en plein cadre, phrase et bouton contour posés dessus.

## Mouvement

- Profil `video-de-fond` (calme, défilement apparitions) ; interface duree 0.25 / courbe ease-in-out ; scène duree 0.25 / courbe ease-in-out ; bibliothèques aucune. Vidéo de fond au premier écran (le feu), transitions 0,25 s ease-in-out ; demande la vraie vidéo du client.

## Architecture

Barre sombre avec nav filetée et bouton Réservation contour ; vidéo plein écran, phrase et bouton ; puis menu, événements, galerie, histoire, questions.

## Premier écran

Famille `video-ou-sequence`. Vidéo plein cadre (demande la vraie vidéo du client).

## Verdict (essai du 23 oct 2026)

**Gardé en partie** (couleurs, densité, photos, mouvement, matière, premier écran). Essai m-7c1faf (avec `--video animer`) : la palette ivoire et anthracite tient ; la typo (Playfair, liste IA, en capitales espacées de 0,15 em) donnait un faux luxe d'IA : non reprise.
