# Their Nibs — https://www.theirnibs.com/
Pyjamas et vêtements de nuit à motifs, « women-led design duo » (texte du site), Royaume-Uni (livraison « UK orders over £60 »). Awwwards Honorable Mention du 23 août 2026 (awwwards.com/sites/their-nibs). Shopify, thème du commerce (sections `slideshow`, `featured_collection_slider`, `shoppable_feature`), Locomotive Scroll repéré (`data-scroll-container`).

## Squelette
Bandeau rose en haut (livraison, don de 20 % des bénéfices de la collection enfants, en carrousel à flèches), nav sur la photo : logo manuscrit avec couronne, 7 rubriques à menus déroulants, recherche / favoris / compte / panier. Ordre : diaporama plein écran (collaboration avec une chanteuse, « Sleepwear with star quality », « Shop now ») → carrousel « New in / Best sellers » → « Shop our collections » (4 cartes portrait) → diptyque « New in » / « Dressing gowns & robes » → texte « Our story » en grand serif → **« Shop gingham »** : photo portée à gauche + fiche produit à droite (vignette, nom, prix 46 £, « Choose options ») → grille Hommes / Enfants → « We are a women-led design duo » (photo des deux fondatrices) → communauté → bande de 4 garanties avec pictos (retours, livraison, qualité, paiement fractionné) → pied rose. Onglet latéral « Commentaires » et pastille « Enjoy 10% off » flottants.
En 3 secondes : une photo de mode chargée de couleurs, un nom connu, un bouton.

## Typographie
Lues : titres **Instrument Serif** 400 (Google, via Shopify), 66,7 px ordinateur / 52,2 px téléphone, interlignage 1,1, interlettrage -0,025 em, casse normale ; corps **Poppins** 17 px. Mirage, Work Sans, Avenir Next, Tenor Sans déclarées (widgets et kits Adobe `obn8wtx`, `jpt2buo`, `zac3lye`). Rien de rare : couple de thème Shopify.

## Couleur et matière
Fond blanc, texte `#1D1D1B`, rose saumon `#F2C1AE` (bandeau, pied, pastilles, ×33), crème rosé `#F9EEE6`, bleu nuit `#142438`. Les photos font la couleur : décors chargés (velours, parquet, tourne-disque), motifs des produits. Photos réelles de campagne et des deux fondatrices.

## Mouvement
Courbe unique et omniprésente : `cubic-bezier(.33,0,0,1)` ×254 (out très doux), `transform .5s` + `opacity .5s`, `--duration-slow` 1,2 s ; `@keyframes scale 1.2s` sur le diaporama (zoom lent de l'image active). Swiper. Pas de GSAP.

## Le geste signature
La photo portée à côté de la fiche produit achetable (« Shop gingham ») : on voit le vêtement en situation et on choisit la taille sans changer de page. Chez nous : transposable à un artisan qui vend quelques pièces (céramiste, maroquinier) en `Services/alternating` avec un `<dl>` prix + lien de commande ; CSS pur.

## Ce qu'on garde / ce qu'on refuse
Garde : la photo des fondatrices avec « We are… » ; les garanties concrètes en bande (retours 30 jours, délais) ; une seule courbe d'animation pour tout le site (cohérence).
Refuse : Instrument Serif et Poppins (polices IA, GOUT § 2) ; deux éléments flottants qui couvrent le contenu (onglet avis, pastille promo) ; le bandeau qui tourne seul (GOUT § 4) ; le diaporama de hero à flèches.
