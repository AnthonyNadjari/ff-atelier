# Folk Kombucha — https://www.folkkombucha.dk/
Titre « Organic Raw Kombucha from Copenhagen | Folk Kombucha », `lang="en"`, description « Contemporary Copenhagen brewery crafting organic, raw, unpasteurized kombucha using traditional fermentation techniques blended with science. Shop living tea b… », technologie lue : Shopify, Webflow, jQuery. Démontage automatique du 2026-10-17 (`ff demonter`, mesures brutes dans `folk-kombucha.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « ORGANIC, LIVING KOMBUCHA » ; vidéo plein écran (100 % de l'écran) ; bouton principal « [ 0 ] » en bas à droite (1369, 811 px, dans une barre fixe) ; 24 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « ORGANIC, LIVING KOMBUCHA » ; vidéo plein écran (100 % de l'écran) ; bouton principal « JOIN REWARDS » en bas à gauche (20, 776 px, dans une barre fixe) ; 17 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 2 lien(s) — home, SHOP ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.landing-header-new` (0,9 écran, 15 mots, 1 img) → `div.home-content` « ORGANIC, LIVING KOMBUCHA » (6,5 écrans, 924 mots, 38 img). Calques hors flux (fixes/absolus) : `div.nav` (sticky, 72 px, 4 mots), `div.footer-new` (sticky, 495 px, collé en bas, 130 mots), `div#charm-loyalty-widget` (fixed, 48 px, 2 mots).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/folk-kombucha-d.webp` (mesuré : fond du premier écran #ffffff, 1 image(s) et 24 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Abcdiatype**, 32 px / 32 px téléphone, graisse 400, interlignage 1,19, capitales, interlettrage 1px ; h2 : non mesuré ; corps **Abcdiatype**, 16 px / 16 px téléphone, graisse 400, interlignage 1,30, interlettrage 0.2px ; boutons **Abcdiatypesemi mono**, 11 px / 11 px téléphone, graisse 400, interlignage 1,82 ; nav : non mesuré.
Sources `@font-face` : inline (data:) (webflow-icons) ; auto-hébergée (Abcdiatype, Abcdiatypesemi mono, ABC Diatype, ABC Diatype Semi Mono) ; fichiers chargés : https://www.folkkombucha.dk/cdn/shop/t/69/assets/abcdiatype-regular.woff2?v=181639434809830309811790182454, https://www.folkkombucha.dk/cdn/shop/t/69/assets/abcdiatypesemi-mono-regular.woff2?v=71914972326623696651790182459, https://www.folkkombucha.dk/cdn/shop/t/69/assets/abcdiatype-bold.woff2?v=145534163992947058171790182450, https://fonts.googleapis.com/, https://fonts.googleapis.com/css?family=Righteous:regular%7CNunito:200,300,regular,600,700,800,900%7CQuestrial:regular. Familles en usage sur le texte visible : Abcdiatype ×94, Abcdiatypesemi mono ×38, Arial ×2. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #333333 (contraste 12,63:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (60 %), #003db7 (31 %), #ebebeb (4 %), #dcdcdc (4 %), #0057b8 (0 %) ; textes par nombre de caractères : #003db7 (62 %), #ffffff (36 %), #333333 (1 %). Images : 38 `<img>` visibles, 18 fond(s) en image, 4 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : GSAP (window.gsap), Swiper (window.Swiper), jQuery (window.jQuery), Webflow (window.Webflow), Shopify (window.Shopify). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `opacity 0.4s ease` ×8, `none 0.4s ease-in-out` ×8, `background 0.2s ease` ×4, `animation marquee-horizontal 50s linear infinite` ×3, `background-color 0.4s ease-in-out` ×1, `opacity 0.15s ease` ×1, `width 0.3s cubic-bezier(0.22, 1, 0.36, 1)` ×1, `opacity 0.16s ease` ×1, `opacity 0.12s ease` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 2 bloc(s) de plus d'un écran (`div.nav` 8,0 écrans, `div.footer-new` 8,0 écrans). Attributs de mouvement : `data-animation` ×3, `data-no-scroll` ×1. Ce qui bouge réellement à l'écran : à juger sur `captures/folk-kombucha-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.home-content` « ORGANIC, LIVING KOMBUCHA » (6,5 écrans, 924 mots, 38 image(s)).
2. L'élément le plus animé : `div#back-to-top` (attributs data-animation, data-no-scroll).
3. Le bloc le plus singulier par sa structure : `div.home-content` « ORGANIC, LIVING KOMBUCHA » (seule à contenir <form>, <select>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : rien de mesurable.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 3/12 ordinateur, 3/12 téléphone ; vidéo en premier écran : oui ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu pour l'usine : direction `labo` (17 oct 2026)

Fermentation artisanale nordique : blanc, bleu roi en aplats pleine largeur et pour le texte, fins filets gris qui découpent la page en cases, titres en capitales légères, boutons en mono.

- **Polices** : ABC Diatype (titres en capitales légères, texte) -> Work Sans ; Diatype Semi Mono (boutons) -> Intel One Mono.
- **Couleurs** : #ffffff 60 %, #003db7 bleu roi 31 % des fonds et 62 % des textes, #ebebeb, #dcdcdc filets ; #333333 texte courant. Tokens : fond `#ffffff`, fond 2 `#ebebeb`, texte `#1f2a44`, secondaire `#4a5163`, filets `#dcdcdc`, accent `#003db7` (survol `#002c85`), bloc contraste `#003db7` / `#ffffff`.
- **Titres** : graisse 350, interlettrage 0.01em, casse `uppercase`.
- **Rayons et ombres** : boutons 4px, cartes 0px, ombre des cartes `none`.
- **Respiration** : `--section-y: clamp(4rem, 9vw, 7rem)`. **Mouvement** : 0.5s en mise en scène, 0.2s au survol, courbe `cubic-bezier(0, 0, 0.58, 1)` (relevées dans les transitions de la source).
- **Fichiers** : `src/directions/labo/index.css`, `meta.ts`, modèles `presets/labo-cases.json` et `presets/labo-bleu.json`.
- **Comparaison** : [`captures/labo-comparaison.jpg`](captures/labo-comparaison.jpg) (source à gauche, `_exemple` habillé à droite).
- **Repris** : le style seulement. **Jamais** : textes, images, logo, code, nom de la source.
