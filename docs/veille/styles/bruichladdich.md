# Bruichladdich : https://www.bruichladdich.com/

Distillerie de whisky (Islay, Écosse). Veille du 25 oct 2026 (volet 2a quater). Relevé dans le DOM calculé de Chromium à 1440x900 et 390x844 (`ff atomes mesurer`, brut dans `atomes/mesures/bruichladdich.json`), captures et défilement regardés. On reprend un style, jamais les textes, images, logos ou code.

## Le style en une phrase

Anthracite et noir en bandes, une serif tranchante en capitales pour tout, une seule touche cuivre, et les paysages de l'île en plein cadre.

## Typographie

- Titre : Bianco Serif (graisse 500, interlignage 1, casse uppercase, interlettrage 0.025 em) ; libre : **spectral**.
- Texte : Bianco Serif (graisse 400, interlignage 1.6) ; libre : **spectral**.
- Échelle (px) : h1 téléphone 27.7 / ordinateur 32.3 ; h2 téléphone 25.6 / ordinateur 40 ; texte téléphone 13.8 / ordinateur 15.
- Bianco Serif (serif tranchante, commerciale) en capitales pour les titres ET le texte : Spectral, serif libre de même coupe, une seule famille. Texte mesuré à 13,8 px, ramené à 16 par la charte.

## Couleurs

- Régime : sombre ; fond #0f0f10, surface #000000, texte #ffffff, texte2 #9f9f9f, accent #c48a59, accent2 à juger, bordure #3c3c43, encre #000000.
- Anthracite #0f0f10 (62 % des fonds) et noir pur en bandes, texte blanc et gris #858586 ; une seule touche cuivre #c48a59 (couleur du whisky) gardée en accent. Le cyan du bloc B Corp est un logo, pas un token.

## Espacements, formes, matière

- Marge de section : téléphone 67 / ordinateur 147 ; gouttière : téléphone 20 / ordinateur 106 ; conteneur 1340 ; mesure 98 caractères ; rythme uni. Bandes noires très hautes, texte en colonnes de trois sous les noms des gammes.
- Rayons : bouton 4, carte 0, image 0 ; bordure 1 ; ombre aucune ; bouton plein (casse uppercase) ; lien couleur.
- Matière : fond uni, filets fins, texture aucune.

## Photos

- Traitement plein-cadre, superposition texte-sur-photo, rapports 3:2, 1:1. Paysage d'Islay et portraits d'exploitants en plein cadre, titre en capitales posé dessus en bas à gauche.

## Mouvement

- Profil `video-de-fond` (calme, défilement apparitions) ; interface 0.2 s / ease-in-out ; scène 1 s / cubic-bezier(0.165, 0.84, 0.44, 1). Film d'ouverture plein cadre (poster obligatoire chez nous), puis blocs qui apparaissent en fondu ; courbe de scène 1 s cubic-bezier(.165,.84,.44,1).

## Architecture

Accueil après un contrôle d'âge : film plein cadre, trois gammes en colonnes, film du lieu, philosophie à côté d'un portrait d'exploitant, inscription, pied noir. Une page par gamme, boutique, visites.

## Premier écran

Famille `video-ou-sequence`. Film plein cadre du lieu sous la nav, titre en capitales posé en bas à gauche.

## Verdict (essai du 25 oct 2026)

**Gardé**. `ff melanger demo-boulangerie --style bruichladdich --essai`, planche posée à côté des captures de la source. Essai m-2bda93 : anthracite, capitales Spectral blanches, cuivre sur le bouton d'appel ; on reconnaît la source sans ses photos. Le contrôle d'âge et la fenêtre de cookies ne sont pas repris.
