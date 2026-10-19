# Brasserie Bendorf — https://brasserie-bendorf.fr/
Titre « Brasserie Bendorf, brasserie artisanale au Neudorf à Strasbourg », `lang="fr-FR"`, pas de description, technologie lue : WordPress, thème Total 5.4.5, Google Analytics (`gtag`), reCAPTCHA ; aucune bannière cookies repérée dans le HTML. Démontage à la main du 2026-10-19 : **mesuré sur le code, pas sur capture** (HTML récupéré par `curl`, aucun navigateur) ; l'ordre du premier écran est celui du HTML.

## Squelette
Premier écran (ordre du HTML) : nav (Accueil, Nos bières, La brasserie : présentation, consigne, Projet B ; Louer une tireuse ; Contact) ; **vidéo en fond** (`Video-Site-Web-1.mp4`, une version dédiée au téléphone `Video-Site-Web-pour-mobile.mp4`, lecture automatique muette) ; h1 « Brasserie artisanale à Neudorf, Strasbourg » ; « Passionné·e·s de bière, nous brassons avec amour depuis 2013 » et la liste des styles (« de sans alcool à 18 % »).
Ordre : « La dernière bière éphémère » (nom, description, illustrateur de l'étiquette crédité) → « Nos bières » (« 7 bières permanentes, 1 nouvelle bière éphémère tous les 15 jours ») → « Les bébés fûts sont nés ! » (location de fûts de 5 L) → « Les growlers » (remplissage à la brasserie, **6 bières du moment** avec style et degré) → « La brasserie » en 8 chiffres animés → pied (adresse, téléphone, e-mail, crédits).
Chiffres lus dans le code (compteurs animés, à 0 dans le HTML) : 120 000 bouteilles consignées réemployées par an, 89 % de l'eau réutilisée, 23 t de drêches données à un éleveur nommé (« Jean-Louis… ses moutons »), 100 % d'ingrédients bio, 13 ans, 6 personnes, 174 bières sorties, 94 % vendues à moins de 200 km.
Structure : plusieurs pages (bières, présentation, consigne, Projet B, location de tireuse, contact). Téléphone : « 09.53.79.76.70 » écrit en pied, **sans lien `tel:`**. Formulaire : aucun sur l'accueil. Horaires : aucun sur l'accueil.

## Typographie
Lue dans le HTML : Clarendon et LemonMilk, plus deux polices d'icônes maison (« bendorficons », « iconben »). Hors liste « IA ».

## Couleur et matière
Non mesurée. 6 `<img>` : logo, bouteille de la bière éphémère, visuels bières, fût et growler, **photo d'équipe** en pied (alt « L'équipe de la Brasserie Bendorf »). Vidéo de fond : contenu non vu (pas de navigateur), probablement la brasserie (nommée « Video Site Web »), non vérifié.

## Mouvement
Vidéo de fond en boucle, compteurs qui défilent au défilement (`animateOnScroll`).

## Le geste signature
**La bière éphémère en tête de page**, renouvelée tous les quinze jours, et la carte des growlers « du moment » : la page d'accueil change avec la production.

## Ce qu'on garde / ce qu'on refuse
Garde : la nouveauté en tête (une raison de revenir), la carte du moment avec style et degré, des chiffres vrais et concrets (bouteilles, drêches, rayon de vente), l'éleveur nommé, l'équipe en photo, le ton.
Refuse : téléphone sans lien et aucun horaire sur l'accueil pour un lieu où l'on vient remplir des growlers, compteurs à 0 sans JavaScript, vidéo pour le premier écran (iPhone en économie d'énergie : rien ne joue).

## Verdict marché (veille du 19 oct 2026, tour 4)
Source : recherche « brasserie artisanale Strasbourg » dans l'outil de recherche de la session. Recherche simple : aucun site de brasserie (annuaires, offices de tourisme, billetterie) ; recherche étendue : rang 1 boutique en ligne d'un revendeur, rang 2 article de blog, **rang 3 brasserie-bendorf.fr**. Tirage : métier `$RANDOM` 15262 mod 18 = 16 → brasserie artisanale ; ville `$RANDOM` mod 30 = 6 → Strasbourg. URL lue : https://brasserie-bendorf.fr/ (HTML 301 Ko, premier octet 0,5 s depuis le proxy ; images de septembre 2026 dans les chemins). Site fait par deux indépendants crédités en pied.

**Un artisan paierait-il 1 200 € pour ça ?** Oui, et c'est le plus « vivant » des neuf : la page dit ce qu'il y a à boire cette semaine, et les chiffres racontent la maison mieux qu'un texte. Il manque les deux choses qui font venir : un numéro qui compose et des horaires.

**Leviers vus** : Photos réelles : 1 photo d'équipe, visuels de produits, une vidéo (contenu non vu). Premier écran : vidéo, métier + quartier + ville dans le h1, « depuis 2013 » ; pas de téléphone, pas de bouton. Preuves : 8 chiffres concrets, 100 % bio (sans label nommé) ; pas d'avis. Structure : plusieurs pages, une par offre (bières, consigne, location de tireuse) ; contact sur une page à part. Appels : « Voir toutes les bières » (×2), « En savoir plus » ; aucun appel téléphonique. Vitesse : 16 feuilles CSS, deux vidéos. Mobile : vidéo dédiée au téléphone ; reste non mesuré.
