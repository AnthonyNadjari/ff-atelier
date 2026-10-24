# Signori&Figli (https://traiteur-italien94.fr/)
Titre « Signori&Figli – Traiteur italien traditionnel et artisanal », `lang="fr-FR"`, technologie lue : WordPress 6.0.9, WooCommerce 7.0.0, Elementor, Optimole (images) ; aucun traceur ni outil de bannière cookies relevé dans le HTML. `curl` reçoit un 403 sans en-têtes `Accept` ; HTML lu avec un User-Agent et des en-têtes de navigateur ordinaires. Démontage à la main du 2026-10-24 : **mesuré sur le code, pas sur capture** ; l'ordre du premier écran est celui du HTML.

## Squelette
Premier écran (ordre du HTML) : barre haute avec adresse (Saint-Maur-des-Fossés) et téléphone **en texte, sans lien** ; nav (Accueil, À propos, Boutique avec 11 catégories, **« Les clients en parlent »**, Contact, panier) ; photo ; h1 « traiteur italien traditionnel et artisanal » (aucune ville) ; bouton « NOS PRODUITS ».
Ordre : 3 promesses (qualité artisanale, fromages et charcuterie, épicerie fine) → présentation → **3 compteurs à 0 dans le HTML** (Epicerie, Vins, Pates) → « Depuis 20 ans, dénicheurs enthousiastes… » → « Les nouveautés du mois » : 18 produits avec prix (« € 35 », « € 39 »…) et boutons **« Order Now »** en anglais, dont des fiches restées du thème (« National dish of Malaysia: coconut rice, fried anchovies, cucumber », « description description description », « Discription ») → **équipe de 3 personnes en photo, prénom et rôle** (vendeuse, directeur, responsable) → service traiteur : carrousel de 18 photos de plats nommés (lasagnes maison, risotto aux cèpes…) → Instagram → contact (téléphone et e-mail sans lien, horaires mardi-samedi 10 h - 19 h 30).
Structure : boutique WooCommerce (catégories, panier), page À propos, page d'avis (3 avis signés, sans note ni date), contact. Téléphone cliquable : **aucun lien `tel:`**. Formulaire : aucun sur l'accueil.

## Typographie
Lue dans le HTML : Alata, Open Sans, Cookie (Google Fonts).

## Couleur et matière
Non mesurée. 83 `<img>` (doublées par le lazy-load) : photos de plats prises au téléphone (`IMG_0349.jpeg`, `IMG_2601.jpeg`…), 3 portraits d'équipe (`MG_0896.jpg`…), visuels de produits de fournisseurs (bouteilles, bocaux).

## Mouvement
Carrousel des plats (Précédent / Suivant) et compteurs animés ; non mesuré à l'écran.

## Le geste signature
Aucun geste visuel. Le geste commercial : **l'équipe en photo, prénom et rôle**, au milieu de la vitrine des produits.

## Ce qu'on garde / ce qu'on refuse
Garde : vraies photos de plats, équipe nommée, prix affichés, page d'avis dans la nav, horaires.
Refuse : téléphone et e-mail sans lien, aucune ville dans le h1 ni le titre, boutons et fiches restés du thème en anglais et en faux texte, compteurs à 0, « nouveautés du mois » qui datent de 2021-2022 (dates des fichiers).

## Verdict marché (veille du 24 oct 2026, tour 6)
Source : agence Redcat Studio (Saint-Denis, rue Francis de Pressensé), page projet https://redcat-studio.fr/projet-signorifigli.html (« Site internet, Référencement SEO », année 2024). Tirage : `$RANDOM` 29846 mod 15 = 11 → Saint-Denis ; sur les 6 projets de l'agence, R2G (opérateur télécom), Azul Services (nettoyage de bureaux), Imagine Décor (boutique de décoration en ligne), Europbots (robotique) ne sont pas des artisans, Myriam Driouch est un cabinet d'avocat (métier déjà étudié au tour 5) ; Signori&Figli retenu (traiteur-épicier, le seul artisan du portfolio). URL lue : https://traiteur-italien94.fr/ (HTML 165 Ko, premier octet 3,8 s depuis le proxy, le plus lent du tour).

**Un artisan paierait-il 1 200 € pour ça ?** Pour les photos et l'équipe, oui ; en l'état, non : on ne peut pas appeler d'un geste, la ville n'est dite nulle part en haut, et les « Order Now » ou le plat malaisien montrent un thème mal rempli. Exemple parfait de ce que le client voit comme « pas fini ».

**Leviers vus** : Photos réelles : oui, une vingtaine de plats et 3 portraits. Premier écran : h1 métier sans ville, téléphone non cliquable, « NOS PRODUITS ». Preuves : « depuis 20 ans », 3 avis sur une page dédiée, équipe nommée. Structure : boutique + 4 pages. Appels : « NOS PRODUITS », « Order Now » (×14), « NOUS CONTACTER ». Vitesse : HTML 165 Ko, premier octet 3,8 s. Mobile : balise viewport présente (avec `maximum-scale=1`, qui bloque le zoom) ; rendu non mesuré.
