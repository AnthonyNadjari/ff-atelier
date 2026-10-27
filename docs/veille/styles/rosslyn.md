# Rosslyn Coffee — https://rosslyncoffee.com/
Titre « Rosslyn Coffee », `lang="en"`, description « Established in 2018, Rosslyn is a collection of award-winning, high volume specialty coffee shops located within the City of London. Not concerned with trends,… », technologie lue : Shopify, jQuery. Démontage automatique du 2026-10-27 (`ff demonter`, mesures brutes dans `rosslyn.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; image plein écran (62 % de l'écran) ; bouton principal « Skip to content » en haut à gauche (-1, -1 px) ; 40 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; pas de média plein écran (6 image(s) dans l'écran) ; bouton principal « Skip to content » en haut à gauche (-1, -1 px) ; 31 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 15 lien(s) — Coffee for home, Gift Subscriptions, Mugs, Vouchers, Locations, About us, Our Suppliers, Brew guides, Off menu coffees, Work with us, Contact, [Search] (+3) ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div#shopify-section-sections--25587308626299__announcement-bar` (0,0 écran, 7 mots, 0 img) → `main#MainContent` « Coffee for home » (3,0 écrans, 171 mots, 8 img) → `div#shopify-section-sections--25587308659067__footer` « About » (0,7 écran, 49 mots, 0 img). Calques hors flux (fixes/absolus) : `a.skip-to-content-link` (absolute, 47 px, 3 mots), `div#shopify-section-sections--25587308626299__header` (sticky, 85 px, 6 mots).
Pied de page : 18 lien(s) — Our Story, Our Locations, Work with us, Our Suppliers, Rosslyn App, Withdrawal Contract, Wholesale Enquiries, Eu Withdrawal Form, Manage Subscription, Contact (+8). Téléphone cliquable : non. Formulaire : 2 (1 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Gift Subscriptions » (/collections/gift-subscriptions), « Off menu coffees » (/pages/luc-off-menu-coffees).
En 3 secondes : à juger sur `captures/rosslyn-d.webp` (mesuré : fond du premier écran #fffcf3, 6 image(s) et 40 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Figgins Sans**, 40 px / 30 px téléphone, graisse 400, interlettrage 0.6px ; h2 **Figgins Sans**, 24 px / 20 px téléphone, graisse 400, interlignage 1,30, interlettrage 0.6px ; corps **Figgins Sans**, 16 px / 15 px téléphone, graisse 400, interlignage 1,80, interlettrage 0.6px ; boutons **Figgins Sans**, 15 px / 15 px téléphone, graisse 400, interlignage 1,20, interlettrage 1px ; nav **Figgins Sans**, 14 px / 14 px téléphone, graisse 400, interlignage 1,30, interlettrage 0.4px.
Sources `@font-face` : auto-hébergée (Assistant, Figgins Sans) ; fichiers chargés : https://www.rosslyncoffee.com/cdn/fonts/assistant/assistant_n4.9120912a469cad1cc292572851508ca49d12e768.woff2, https://www.rosslyncoffee.com/cdn/shop/files/Figgins.woff2?v=1784214138. Familles en usage sur le texte visible : Figgins Sans ×69, Assistant ×5. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #fffcf3, texte #323131 (contraste 12,64:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #fffcf3 (98 %), #242833 (1 %), #323131 (1 %), #e9ddb9 (0 %), #000000 (0 %) ; textes par nombre de caractères : #323131 (95 %), #ffffff (3 %), #fffcf3 (3 %). Images : 9 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : Shopify (window.Shopify). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `animation slideIn 0.6s cubic-bezier(0, 0, 0.3, 1)` ×16, `box-shadow 0.1s ease` ×7, `background-color 0.3s ease` ×5, `transform 0.3s ease` ×5, `animation fadeIn 0.6s cubic-bezier(0, 0, 0.3, 1)` ×4, `opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)` ×4, `transform 0.5s ease` ×4, `text-decoration 0.1s ease` ×3, `opacity 0.2s ease` ×2, `transform 0.2s ease` ×2. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 1 bloc(s) de plus d'un écran (`div#shopify-section-sections--25587308626299__header` 3,8 écrans). Attributs de mouvement : `data-sticky-type` ×1. Ce qui bouge réellement à l'écran : à juger sur `captures/rosslyn-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `main#MainContent` « Coffee for home » (3,0 écrans, 171 mots, 8 image(s)).
2. L'élément le plus animé : `div#Banner-template--25587308167547__image_banner` (animation animation fadeIn 0.6s cubic-bezier(0, 0, 0.3, 1)).
3. Le bloc le plus singulier par sa structure : `div#shopify-section-sections--25587308659067__footer` « About » (seule à contenir <form>, <svg>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« Gift Subscriptions », « Off menu coffees »), formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/8 ordinateur, 0/8 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu (jugé sur les captures, veille du 27 oct 2026)

- **Polices** : Figgins Sans (sans humaniste fine) partout, 400 ; titres de section en casse normale, 20 px au téléphone, 24 px à l'ordinateur (« Our story » à 40 px) ; texte 15-16 px, interlignage 1,8, interlettrage 0,04 em. Le logo ROSSLYN (capitales serif espacées) est une image. Libre : Hanken Grotesk.
- **Couleurs** : crème #fffcf3 (fond sur 99 % de la page, pied compris ; chroma 0,012) ; anthracite #323131 (texte, boutons pleins) ; bleu nuit #242833 (bandeau d'annonce, seul bloc contrasté). Régime : clair teinté doux.
- **Espacements** : sections très aérées (154 px au téléphone, 183 px à l'ordinateur) ; conteneur 1 100 px ; gouttière 55 px au téléphone.
- **Formes** : angles droits ; boutons pleins anthracite en casse normale ; aucune ombre ; liens soulignés.
- **Photos** : la façade du café en plein cadre au premier écran, sans texte dessus ; sachets de café détourés sur le crème en rangée de quatre ; photos de salle larges avec une carte crème « Our story » qui chevauche la photo.
- **Mouvement** : apparitions du thème Shopify Dawn : chaque bloc monte et se dévoile en entrant (slideIn 0,6 s cubic-bezier(0, 0, 0.3, 1)) ; survols 0,1 à 0,3 s ease. Profil `fondu-sobre`.
- **Architecture** : boutique de cafés : bandeau, logo centré et menu court (Shop, Locations, About), façade, cafés pour la maison, abonnements cadeaux, histoire, citation de presse, tasses de céramiste, pied crème à trois colonnes avec lettre.
- **Geste signature** : la façade, photographiée de la rue avec ses passants, tient lieu de titre : on voit le café avant de lire son nom.
