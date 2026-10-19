# Grand-Père Jules — https://www.grandperejules-rennes.com/
Titre « GRAND PÈRE JULES - Boulangerie à Rennes », `lang="fr-FR"`, description « Vous recherchez un traiteur pour votre événement spécial ? Contactez le GRAND PÈRE JULES, votre boulangerie à Rennes, au 02 99 30 70 67. », technologie lue : WordPress, thème Avada (« fusion »), Slider Revolution 6.7.25, WooCommerce (chargé), WP Rocket, Matomo, Google Tag Manager, Complianz (bannière cookies, TCF), reCAPTCHA. Auteur WordPress : « Cohérence Communication ». Démontage à la main du 2026-10-19 : **mesuré sur le code, pas sur capture** (HTML récupéré par `curl`, aucun navigateur) ; l'ordre du premier écran est celui du HTML.

## Squelette
Premier écran (ordre du HTML) : bloc d'infos en tête du carrousel où **le téléphone s'affiche « [cstmPhoneNumber] »** (code court du thème non remplacé), puis l'adresse « 21 rue Saint-Hélier » et « Du mardi au samedi : 07h30-19h30 » ; nav (Boulangerie, Pain, Pain pauvre en gluten, Viennoiserie, Pâtisserie, Pâtisseries du moment, Pâtisseries d'événements, **Noël 2026**, Côté snacking, Gâteaux de voyage, Nos engagements, Contact) ; carrousel ; h1 « Grand Père Jules — Vos boulangeries Pâtisseries à Rennes ».
Ordre : « Derrière Grand-Père Jules, il y a Estelle et Kevin, pâtissière et boulanger » (reprise de la Maison Coupel, deux boutiques) → « Nos prestations » (« pains 100 % maison sur levain », « certifiée Bio agrément N°FAB02 depuis 1990 », 5 familles de produits vers leur page) → Facebook, Instagram → formulaire de contact (9 champs dont **« Point de retrait » : Saint-Hélier ou Nemours**) → coordonnées des deux boutiques → galerie de 6 photos en pied.
Structure : environ 12 pages (une par famille de produits, pages d'événements, engagements, contact). Téléphone cliquable : 2 liens `tel:` (un par boutique), **tous deux après le h1, dans la section contact** ; un script répare au chargement des liens `tel:` mal formés (`href="http://<a href=...`). Formulaire : 1 sur l'accueil. Horaires : « Du mardi au samedi : 07h30-19h30 ».

## Typographie
Non mesurée : l'appel Google Fonts charge 12 familles (Bitter, Lato, Libre Baskerville, Montserrat, Pacifico, Sacramento…) à partir d'une URL mal formée (`family=http%3A%2F%2FBitter…`).

## Couleur et matière
Non mesurée. 20 `<img>` et 6 fonds : galerie de 6 photos en pied, fonds de produits (« Pain-biologique », « IM2 », « IM123 », « image_12365029 ») : vraies photos ou banque, à juger, le code ne le dit pas.

## Mouvement
Slider Revolution en premier écran. Rien d'autre de lu.

## Le geste signature
Aucun geste de dessin. Le geste commercial : **les commandes d'événements** (page « Noël 2026 » dans la nav dès octobre, formulaire avec point de retrait).

## Ce qu'on garde / ce qu'on refuse
Garde : les deux artisans nommés juste sous le h1, la certification bio avec son numéro et son année, la page de saison (Noël) en avance, le choix de la boutique de retrait.
Refuse : « [cstmPhoneNumber] » affiché en tête de page, liens téléphone réparés par script, 119 feuilles CSS, 12 polices chargées, téléphone absent du premier écran.

## Verdict marché (veille du 19 oct 2026, tour 4)
Source : recherche « boulangerie Rennes ». Recherche simple : aucun site de boulangerie (blogs de voyage, annuaires, offres d'emploi) ; recherche étendue : rangs 1 à 5 annuaires, rang 6 Maison Lorand **écartée** (« Le Grenier à Pain », réseau de 35 boutiques, son site le dit), rang 7 annuaire, **rang 8 grandperejules-rennes.com**. Tirage : métier `$RANDOM` 960 mod 18 = 6 → boulangerie ; ville `$RANDOM` mod 30 = 10 → Rennes. URL lue : https://www.grandperejules-rennes.com/ (HTML 218 Ko, premier octet 2,4 s depuis le proxy ; images de janvier et mars 2024, page modifiée le 12 octobre 2026).

**Un artisan paierait-il 1 200 € pour ça ?** Pour le contenu, oui (deux artisans nommés, bio certifié, commandes de fêtes, deux boutiques). Pour la finition, non : le premier écran affiche un code de thème à la place du numéro, et il faut descendre jusqu'au formulaire pour trouver un téléphone qui compose.

**Leviers vus** : Photos réelles : à juger (6 en galerie, fonds de produits). Premier écran : adresse et horaires, téléphone cassé (« [cstmPhoneNumber] »), métier + ville dans le h1, carrousel. Preuves : certification bio depuis 1990 (numéro d'agrément), boulangers nommés ; pas d'avis. Structure : environ 12 pages, formulaire sur l'accueil. Appels : « En savoir plus » (×6), formulaire, téléphone (×2, en bas). Vitesse : 119 feuilles CSS, premier octet 2,4 s. Mobile : non mesuré.
