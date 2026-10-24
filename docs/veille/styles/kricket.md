# Kricket : https://www.kricket.co.uk/

Restaurant indien (Londres, plusieurs adresses). Veille du 24 oct 2026 (volet 2a quater). Relevé dans le DOM calculé de Chromium à 1440x900 et 390x844 (`ff atomes mesurer`, brut dans `atomes/mesures/kricket.json`), titre affiché relevé à part, captures et défilement regardés. On reprend un style, jamais les textes, images, logos ou code.

## Le style en une phrase

Papier rosé, une seule encre rouille pour la nav, les titres et le cadre de la vidéo, une slab presque machine à écrire, et des plats vus de dessus qui se posent les uns sur les autres.

## Typographie

- Titre : HalTimezoneItalic (graisse 400, interlignage 1.08, casse none, interlettrage 0 em) ; libre : **bitter**.
- Texte : HalTimezone (graisse 400, interlignage 1.47) ; libre : **bitter**.
- Échelle (px) : h1 telephone 26 / ordinateur 36 ; h2 telephone 26 / ordinateur 36 ; texte telephone 16 / ordinateur 17.
- Hal Timezone (serif à pieds carrés, presque machine à écrire, commerciale) : Bitter, la slab libre la plus proche, une seule famille. Titre affiché : les titres de section en casse de titre (26 / 36 px) ; le h1 du code est la phrase en italique sur la vidéo (16 / 22), non retenue (pas d'italique).

## Couleurs

- Régime : clair ; fond #fef6f4, surface #ffffff, texte #141414, texte2 à juger, accent #a42900, accent2 à juger, bordure #a42900, encre #a42900.
- Papier rosé #fef6f4 (61 % des fonds), une seule encre rouille #a42900 pour les titres, les boutons, la barre de nav et le cadre de la vidéo (19 % des fonds) ; brun #2d1a10 sous la vidéo. Le jaune souci des fleurs vient d'images, pas d'un token.

## Espacements, formes, matière

- Marge de section : telephone 96 / ordinateur 175 ; gouttière : telephone 25 / ordinateur 30 ; conteneur 1360 ; mesure 70 caractères ; rythme alterne. Sections très aérées (96 / 175 px), texte centré dans une colonne étroite.
- Rayons : bouton 0, carte 0, image 0 ; bordure 1 ; ombre aucune ; bouton plein (casse uppercase) ; lien couleur.
- Matière : fond sections-colorees, filets fins, texture aucune.

## Photos

- Traitement detoure, superposition chevauchement, rapports 16:9+, 4:5, 4:3. Plats vus de dessus sur nappe, posés de biais et qui se recouvrent ; trois photos à des hauteurs différentes autour du texte d'accueil ; petites fleurs détourées en ornement. Premier écran : vidéo dans un cadre rouille.

## Mouvement

- Profil `assiettes-qui-se-posent` (vivant, défilement suit-le-defilement) ; interface duree 0.3 / courbe ease ; scène duree 0.5 / courbe ease. Filmé le 24 oct (ordinateur) : vidéo dans un cadre rouille à l'ouverture, nav qui se pose, puis plats vus de dessus qui se posent l'un sur l'autre au défilement ; transitions relevées 0,3 s ease (interface) et 0,5 s ease (scène).

## Architecture

Accueil en long : vidéo encadrée, scène des plats, texte d'accueil entre trois photos, « Nos adresses » (une carte photo par quartier), réservation sur aplat rouille, pied rouille. Une page par adresse, menu, groupes et événements, commande.

## Premier écran

Famille `video-ou-sequence`. Vidéo dans un cadre rouille, phrase d'accroche posée en bas à droite.

## Verdict (essai du 24 oct 2026)

**Gardé** (typo, couleurs, densité, formes, photos, mouvement, matière, premier écran). Essai `ff melanger demo-boulangerie --style kricket --essai` (m-981b94) : papier rosé, encre rouille et Bitter, on reconnaît la source même sans ses photos. Profil de mouvement nouveau : `assiettes-qui-se-posent`.
