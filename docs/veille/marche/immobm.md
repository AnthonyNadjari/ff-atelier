# Immobilier Bordeaux Métropole (https://www.immobm.fr/)
Titre « Agence immobilière Bordeaux – Immobilier Bordeaux Métropole », description « … agence immobilière à Bordeaux : vente, achat et estimation de biens à Bordeaux et sa Métropole. », technologie lue : site de la plateforme La Boîte Immo (images `staticlbi.com`, pied « La boite immo »), Google Analytics, bannière cookies maison (« Ok pour Moi ! »). Démontage à la main du 2026-10-24 : **mesuré sur le code, pas sur capture** (HTML récupéré par `curl`, aucun navigateur) ; l'ordre du premier écran est celui du HTML.

## Squelette
Premier écran (ordre du HTML) : 3 petits formulaires de choix de langue, « votre sélection 0 » ; logos **Interkab, MeilleursAgents et FNAIM dans l'en-tête** ; une citation de Franklin D. Roosevelt sur l'immobilier ; téléphone (portable) **en texte, sans lien**, e-mail, adresse (rue Blanqui) ; nav (Accueil, Nos annonces, Notre agence, Nous Contacter, **« Vous vendez ? »**) ; diaporama.
Ordre : **« Notre coup de coeur » ×10** (chaque bien est un h1 « Notre coup de coeur » + h1 ville + h2 type et surface, extrait, « Voir le bien + » ; 9 biens sur 10 à Bacalan) → texte « Agence immobilière à Bordeaux » (transaction, **estimation offerte**, quartier Bacalan) → 3 blocs (Nos annonces, Vous vendez ?, Contact) → pied (coordonnées, espace propriétaire, logos FNAIM, Galian, Interkab ; Mentions légales, **Nos honoraires**).
Structure : une page par bien, toutes les annonces, notre agence, estimation (`/estimation/bordeaux`), honoraires, contact. Téléphone cliquable : **aucun lien `tel:`**. Formulaire : aucun formulaire de contact ni de recherche sur l'accueil (les 3 `<form>` ne servent qu'à choisir la langue).

## Typographie
Lue dans le HTML : Lora et PT Sans (Google Fonts).

## Couleur et matière
Non mesurée. 26 `<img>` sans `alt` : logos de réseaux, photos des 10 biens (photos d'annonces), 3 visuels de blocs.

## Mouvement
Diaporama en tête ; non mesuré.

## Le geste signature
Aucun geste visuel. Le geste commercial : **le quartier** (Bacalan, Bassins à flot, tram B) répété dans chaque annonce : l'agence du coin.

## Ce qu'on garde / ce qu'on refuse
Garde : les biens tout de suite, le quartier nommé, estimation offerte, FNAIM et garantie financière visibles, honoraires publiés.
Refuse : téléphone sans lien, onze h1 sur la page, citation d'un président américain en tête, images sans `alt`, aucun visage ni avis lisible dans le HTML (MeilleursAgents en logo seulement).

## Verdict marché (veille du 24 oct 2026, tour 6)
Source : recherche « agence immobilière Bordeaux » (métier : troisième tirage sans doublon → agence immobilière ; ville `$RANDOM` 27578 mod 30 = 8 → Bordeaux). La recherche simple ne rend que des réseaux (Orpi, Square Habitat, Human Immobilier) et des annuaires ; recherche étendue : **rang 1 Maison Blanche écarté** (réseau de 6 agences dans 4 départements, lu dans son HTML), rang 2 Superimmo (annuaire), **rang 3 écarté** (« notre réseau d'agences », « le groupe »), **rang 4 retenu**. URL lue : https://www.immobm.fr/ (HTML 70 Ko, premier octet 0,7 s depuis le proxy).

**Un artisan paierait-il 1 200 € pour ça ?** Une agence de quartier, non pour ce site : c'est le gabarit de la plateforme d'annonces, et il ne fait ni appeler ni rencontrer quelqu'un. Ce qu'il fait bien (les biens et le quartier tout de suite) vient du logiciel d'annonces, pas du site.

**Leviers vus** : Photos réelles : oui (photos des biens). Premier écran : labels FNAIM et MeilleursAgents, téléphone sans lien, « Vous vendez ? ». Preuves : FNAIM, Galian, Interkab ; aucun avis lisible. Structure : une page par bien, estimation, honoraires. Appels : « Voir le bien + » (×10), « Vous vendez ? », « Nous Contacter ». Vitesse : HTML 70 Ko, premier octet 0,7 s. Mobile : balise viewport présente ; rendu non mesuré.
