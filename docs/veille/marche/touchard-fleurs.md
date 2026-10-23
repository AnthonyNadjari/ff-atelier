# Touchard Fleurs (https://fleuriste-lemans.fr/)
Titre « Fleuriste en Sarthe, Livraison de fleurs et de plantes - Touchard Fleurs », `lang="fr-FR"`, description « Touchard Fleurs vous accueille dans l'une de ses 6 boutiques en Sarthe mais vous permet aussi une livraison de fleurs dans toute la région. », technologie lue : WordPress 7.1, Elementor, WooCommerce (boutique en ligne), thème Vamtam, Google Tag Manager, bannière cookies par message. Démontage à la main du 2026-10-23 : **mesuré sur le code, pas sur capture** (HTML récupéré par `curl`, aucun navigateur) ; l'ordre du premier écran est celui du HTML.

## Squelette
Premier écran (ordre du HTML) : nav avec **« Toussaint » en premier lien** (la saison du moment), la boutique, 4 familles, 5 occasions, blog, galerie, professionnels, boutique en ligne, catalogue, contact ; recherche de produits ; panier ; **carrousel de saison daté** : « Toussaint - 2026 », « Halloween - 2026 », chacun avec « Commandez en ligne ». **Aucun h1.**
Ordre : 4 promesses (entreprise familiale, 6 boutiques ; artisans fleuristes ; sur-mesure ; **livraison en 4 h maximum dans 130 communes de Sarthe**) → une vingtaine de bouquets avec photo et **fourchette de prix** (« 33 € – 58 € ») → 4 occasions (naissance, anniversaire, mariage, deuil) → chiffres (« 06 boutiques », « 25 salariés », « 107 références », « 97 % clients satisfaits », « depuis 1986 ») → « Le bouquet du fleuriste » sur mesure (« Demander son bouquet ») → **6 boutiques, chacune avec adresse et horaires du jour par jour** → coups de cœur (bouquets, chocolats, bougie, orchidée) → 3 articles datés (septembre, août, juillet 2026) → 13 avis signés d'un prénom et d'une initiale, avec deux notes qui se contredisent (« Noté 4.3 sur 5 », « 4.1/5 sur 11 avis »).
Structure : environ 65 pages (boutique, catégories, occasions, produits, blog, galerie, professionnels). Téléphone cliquable : **aucun lien `tel:` et aucun numéro sur l'accueil**. Formulaire : aucun formulaire de contact sur l'accueil (recherche de produits seulement).

## Typographie
Lue dans le HTML : Italiana (titres, 12 déclarations), Montserrat (texte, 10).

## Couleur et matière
Non mesurée. 77 `<img>` : une quarantaine de photos de bouquets de la maison (noms de fichiers « touchard »), visuels de saison datés d'octobre 2026, une photo d'équipe, photos d'occasions.

## Mouvement
Carrousel de saison (Swiper) ; non mesuré à l'écran.

## Le geste signature
Aucun geste visuel. Le geste commercial : **la saison en tête** (Toussaint et Halloween 2026 dans la nav et le carrousel, mis à jour en octobre) et **le prix sous chaque bouquet**.

## Ce qu'on garde / ce qu'on refuse
Garde : la saison du moment en premier lien et en premier écran, prix en fourchette sous chaque création, délai de livraison chiffré avec le nombre de communes, une fiche par boutique avec ses horaires, articles récents.
Refuse : aucun h1, aucun numéro de téléphone pour un commerce qu'on appelle, deux notes contradictoires, mots anglais du thème restés dans le menu (« Plants Accesories Gifts Flowers »), « 97 % clients satisfaits » sans source.

## Verdict marché (veille du 23 oct 2026, tour 5)
Source : recherche « fleuriste Le Mans » (recherche étendue ; la recherche simple ne rend que des annuaires) : rangs 1 à 4 plateformes et réseaux (123fleurs, Interflora, Florajet, Monceau Fleurs), rang 5 Mappy, **rang 6 Maison Touchard Fleurs** (résultat sur un article du blog, accueil étudié), première entreprise indépendante (familiale, 6 boutiques en Sarthe, pas un réseau national). Tirage : `$RANDOM` 3972 mod 15 → fleuriste, `$RANDOM` 5303 mod 30 → Le Mans. URL lue : https://fleuriste-lemans.fr/ (HTML 650 Ko, premier octet 3,4 s depuis le proxy, le plus lent du tour).

**Un artisan paierait-il 1 200 € pour ça ?** Oui, et bien plus : c'est une boutique en ligne qui vend (prix, livraison en 4 h, saison du moment, 6 boutiques). Mais un client qui veut appeler ne trouve aucun numéro sur l'accueil, et les deux notes contradictoires se voient.

**Leviers vus** : Photos réelles : une quarantaine (bouquets de la maison, équipe). Premier écran : saison datée (Toussaint 2026) dans la nav et le carrousel, « Commandez en ligne », panier ; pas de téléphone, pas de h1. Preuves : depuis 1986, 6 boutiques, 25 salariés, 13 avis, note 4,1 à 4,3 ; pas de label. Structure : environ 65 pages, une fiche par boutique sur l'accueil, pas de formulaire de contact sur l'accueil. Appels : « Commandez en ligne » (×4), « Demander son bouquet » (×2), « Sélectionner une option » par bouquet. Vitesse : HTML 650 Ko, premier octet 3,4 s. Mobile : balise viewport présente ; rendu non mesuré.
