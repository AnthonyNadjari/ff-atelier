# Cabalar Meat Co. — https://www.eatcabalar.com/
Titre « Home | Cabalar Meat Co. », `lang="en"`, description « Cabalar Meat Company is a family-owned neighborhood butcher and eatery based in Lancaster, PA serving up the best burgers and sandwiches in Lancaster County. », technologie lue : Next.js, Sanity, Tailwind. Démontage automatique du 2026-10-17 (`ff demonter`, mesures brutes dans `cabalar.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; vidéo plein écran (79 % de l'écran) ; bouton principal « ORDER ONLINE » à mi-hauteur à gauche (32, 369 px, dans une barre fixe) ; 36 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : calque couvrant 100 % de l'écran («  ») ; bouge tout seul sans défilement : 1 élément(s) (`div.flex`).
Téléphone (390x844) : h1 absent ; vidéo plein écran (65 % de l'écran) ; bouton principal « EXPLORE » en haut à droite (252, 19 px, dans une barre fixe, dans la nav) ; 58 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : calque couvrant 100 % de l'écran («  ») ; bouge tout seul sans défilement : 1 élément(s) (`nav.fixed`).
Nav : 9 lien(s) — [EXPLORE], [ORDER ONLINE], [CONTACT], [ABOUT], [FARMS & FRIENDS], [MENU], [FOOD TRUCK], [PRIVATE EVENTS], [FAQS] ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.flex` (1,7 écran, 60 mots, 2 img) → `div` « A GOOD STORY » (4,1 écrans, 161 mots, 17 img) → `section` (1,2 écran, 5 mots, 5 img). Calques hors flux (fixes/absolus) : `div.w-screen` (fixed, 900 px), `nav.fixed` (fixed, 136 px, 14 mots), `div.relative` (sticky, 881 px, 22 mots).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « ORDER ONLINE » (https://www.toasttab.com/cabalar/v3/?mode=fulfillment), « MENU » (/menu), « BOOK OUR TRUCK » (/food-truck), « GIFT CARD » (https://www.toasttab.com/cabalar/giftcards).
En 3 secondes : à juger sur `captures/cabalar-d.webp` (mesuré : fond du premier écran #ffffff, 6 image(s) et 36 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 : non mesuré ; corps **__neueMontreal_870d2a**, 30 px / 19 px téléphone, graisse 400, interlignage 1,20 ; boutons **__neueMontreal_870d2a**, 20 px / 15 px téléphone, graisse 400, interlignage 1,40, capitales ; nav **__neueMontreal_870d2a**, 16 px / 15 px téléphone, graisse 400, interlignage 1,50.
Sources `@font-face` : auto-hébergée (__neueMontreal_870d2a) ; locale (__neueMontreal_Fallback_870d2a) ; inline (data:) (swiper-icons) ; fichiers chargés : https://www.eatcabalar.com/_next/static/media/6bf2ef6fbd7735ea-s.p.otf, https://www.eatcabalar.com/_next/static/media/cb6468dca0919260-s.p.otf, https://www.eatcabalar.com/_next/static/media/b755838d3028ac33-s.p.otf, https://use.typekit.net/len4fxk.css. Familles en usage sur le texte visible : __neueMontreal_870d2a ×33, obviously ×3, obviously-condensed ×3, obviously-narrow ×1. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #025a3c (contraste 8,30:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (90 %), #025a3c (10 %) ; textes par nombre de caractères : #025a3c (92 %), #ffffff (8 %). Images : 28 `<img>` visibles, 0 fond(s) en image, 2 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : aucune détectée (window.* et noms de scripts). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `color 0.15s cubic-bezier(0.4, 0, 0.2, 1)` ×21, `opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1)` ×2. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 1 bloc(s) de plus d'un écran (`div.relative` 8,8 écrans). Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/cabalar-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div` « A GOOD STORY » (4,1 écrans, 161 mots, 17 image(s)).
2. L'élément le plus animé : `nav.fixed` (1 transition(s) : color 0.15s cubic-bezier(0.4, 0, 0.2, 1)).
3. Le bloc le plus singulier par sa structure : `div.flex` (seule à contenir <video>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« ORDER ONLINE », « MENU », « BOOK OUR TRUCK », « GIFT CARD »).
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 8/15 ordinateur, 6/13 téléphone ; vidéo en premier écran : oui ; couche bloquante à l'arrivée : oui (calque, 100 % de l'écran) ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu pour l'usine : direction `sapin` (17 oct 2026)

Comptoir de boucher et snack de quartier : blanc pur, un seul vert sapin pour tout (texte, aplats, pied de page), titres en capitales condensées très grasses, texte courant en grand corps, photos aux coins arrondis.

- **Polices** : Titres condensés gras (non mesurés, lus sur capture) -> Oswald 700 ; Neue Montreal (texte, 30 px à l'ordinateur) -> Urbanist.
- **Couleurs** : #ffffff 90 % des fonds, #025a3c vert 10 % des fonds et 92 % des textes ; rien d'autre. Tokens : fond `#ffffff`, fond 2 `#eef3ef`, texte `#025a3c`, secondaire `#3d6b58`, filets `#bcd2c6`, accent `#025a3c` (survol `#01412b`), bloc contraste `#025a3c` / `#ffffff`.
- **Titres** : graisse 700, interlettrage -0.01em, casse `uppercase`.
- **Rayons et ombres** : boutons 12px, cartes 16px, ombre des cartes `none`.
- **Respiration** : `--section-y: clamp(4.5rem, 10vw, 8.5rem)`. **Mouvement** : 0.5s en mise en scène, 0.15s au survol, courbe `cubic-bezier(0.4, 0, 0.2, 1)` (relevées dans les transitions de la source).
- **Fichiers** : `src/directions/sapin/index.css`, `meta.ts`, modèles `presets/sapin-comptoir.json` et `presets/sapin-tournee.json`.
- **Comparaison** : [`captures/sapin-comparaison.jpg`](captures/sapin-comparaison.jpg) (source à gauche, `_exemple` habillé à droite).
- **Repris** : le style seulement. **Jamais** : textes, images, logo, code, nom de la source.
