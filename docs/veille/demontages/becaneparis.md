# Bécane — https://www.becaneparis.com/
Marque indépendante de vêtements de moto pour femmes, Paris (pied de page : « Born on the road, made for the city… unapologetically feminine »). Awwwards Site of the Day du 26 janvier 2026 (awwwards.com/sites/becane-paris). Shopify en mode « headless » : front Next.js (`/_next/static/`), vidéos `cdn.shopify.com`.

## Squelette
Aucune page d'accueil classique : l'accueil **est** la collection. Cartouche blanc en haut à gauche (logo, « All 27 », « Stories 04 », « Cart 00 »), cartouche en haut à droite (« Collection 01 / 01 » + pictogramme d'une silhouette), barre noire en bas à gauche (« 14 products / Discover »). Au centre : **14 femmes détourées, en pied, alignées de dos et de profil**, chacune portant une tenue de la collection. Téléphone : les mêmes silhouettes disposées **en cercle**. Plus bas, un seul bloc : le manifeste en capitales larges, puis un pied minuscule (`hello@becaneparis.com`, conditions, Instagram). Page de 1 657 px de haut en tout.
En 3 secondes : un défilé de silhouettes, la marque, un compteur.

## Typographie
Lue dans le CSS : **Eurostile** LT Std, deux coupes (`EurostileLTStd-Demi`, `EurostileLTStd-BoldEx2`, déclarées sous le nom « Eurostile Becane »), H1 « Collection » 30 px ordinateur / 20 px téléphone, graisse 700, capitales, interlignage 1 ; corps 12 px ordinateur / 14 px téléphone. Rare : une seule famille, la « Bold Extended » très large qui évoque les carénages et les plaques moto, utilisée avec retenue (titres de 30 px, pas de display géant).

## Couleur et matière
Fond gris clair `rgb(246,246,246)`, texte `#0A0A0A`, cartouches blancs `#FFF`, barre noire. Couleurs de produits dans le CSS (`#89756C`, `#C44E3A`, `#889FC3`, `#DBB8A6`…) : ce sont les pastilles de coloris, pas une palette de site. Photos réelles de mannequins détourées sur fond blanc, identiques en échelle ; fonds de section gris moyen (planche).

## Mouvement
Pas de GSAP ni Lenis. Un `<canvas>` sur l'accueil. CSS lu : `transform .3s`, `height .3s cubic-bezier(.23,1,.32,1)`, un `@keyframes header_shine` 0,7 s en boucle (chargement). Sur téléphone, les silhouettes (12 visibles) sont posées en cercle sous les cartouches, le titre « Collection » et « 14 products / Discover » en bas d'écran (capture téléphone).

## Le geste signature
La gamme montrée comme un alignement de personnes à la même échelle, chacune = un produit cliquable, avec le compteur « 14 products ». Chez nous : bloc sur mesure « alignement » (photos détourées même hauteur, `display: flex; align-items: end`, défilement horizontal manuel sur téléphone, `scroll-snap` + `touch-action: pan-y`, A3) ; pour un tailleur, un cordonnier (paires alignées) ou un fabricant de vélos.

## Ce qu'on garde / ce qu'on refuse
Garde : l'accueil qui montre directement ce qu'on vend ; les compteurs factuels dans la nav (27 articles, 4 histoires) ; une seule famille typographique à deux coupes ; le pied réduit à l'e-mail.
Refuse : corps à 12 px sur ordinateur (lisibilité) ; un manifeste en capitales larges sur 14 lignes étroites (GOUT § 1) ; aucune adresse ni téléphone pour un commerce (inadapté à nos artisans, qui vivent du téléphone).
