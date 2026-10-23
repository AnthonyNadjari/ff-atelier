# Blackbird Bakery — https://blackbirdbakery.com/
Titre « Welcome to Blackbird Bakery on Bainbridge Island », `lang="en-US"`, description « An artisan bakery serving sweet and savory treats made from scratch and local ingredients. », technologie lue : WordPress, jQuery. Démontage automatique du 2026-10-23 (`ff demonter`, mesures brutes dans `blackbird.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « Hello and Welcome to Blackbird Bakery on Bainbridge Island » ; pas de média plein écran (3 image(s) dans l'écran) ; bouton principal « Search » en haut à droite (1375, 0 px, dans la nav) ; 32 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « Hello and Welcome to Blackbird Bakery on Bainbridge Island » ; pas de média plein écran (3 image(s) dans l'écran) ; bouton principal « Toggle Navigation » en haut à droite (320, 10 px, dans la nav) ; 88 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 1 lien(s) — [Search] ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.fusion-tb-header` (0,6 écran, 6 mots, 2 img) → `main#main` « Hello and Welcome to Blackbird Bakery o… » (1,5 écran, 136 mots, 4 img) → `div.fusion-tb-footer` (0,1 écran, 9 mots, 0 img). Calques hors flux (fixes/absolus) : `a.skip-link` (absolute, 1 px, 3 mots), `div.widget_shopping_cart_live_region` (absolute, 1 px, collé en bas).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « MENU » (https://blackbirdbakery.com/menu/).
En 3 secondes : à juger sur `captures/blackbird-d.webp` (mesuré : fond du premier écran #ffffff, 3 image(s) et 32 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Fondamento**, 42 px / 34 px téléphone, graisse 400, interlignage 1,19 ; h2 : non mesuré ; corps **Poppins**, 18 px / 18 px téléphone, graisse 400, interlignage 1,67 ; boutons **Poppins**, 16 px / 20 px téléphone, graisse 500, interlignage 1,88 ; nav **Poppins**, 20 px / 16 px téléphone, graisse 500, interlignage 1,30, capitales.
Sources `@font-face` : Google Fonts (Fondamento, Poppins) ; auto-hébergée (awb-icons, Font Awesome 5 Brands, Font Awesome 5 Free, Inter, Cardo) ; fichiers chargés : https://fonts.gstatic.com/s/fondamento/v22/4UaHrEJGsxNmFTPDnkaJ96rp5w.woff2, https://fonts.gstatic.com/s/poppins/v24/pxiEyp8kv8JHgFVrJJfecg.woff2, https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2, https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2, https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2, https://blackbirdbakery.com/wp-content/themes/Avada/includes/lib/assets/fonts/icomoon/awb-icons.woff. Familles en usage sur le texte visible : Poppins ×26, Fondamento ×2. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #000000 (contraste 21,00:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (100 %), #000000 (0 %), #ba6607 (0 %) ; textes par nombre de caractères : #000000 (69 %), #ffffff (17 %), #ba6607 (14 %). Images : 6 `<img>` visibles, 1 fond(s) en image, 0 vidéo(s), `mask-image`/`clip-path` sur 8 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : GSAP (window.gsap), ScrollTrigger (window.ScrollTrigger), Swiper (window.Swiper), jQuery (window.jQuery), Locomotive Scroll (attribut data-scroll). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `opacity 0.3s cubic-bezier(0.42, 0.01, 0.58, 1)` ×16, `transform 0.3s ease` ×14, `filter 0.3s ease` ×14, `-webkit-backdrop-filter 0.3s ease` ×14, `backdrop-filter 0.3s ease` ×14, `background-color 0.3s ease` ×14, `border-color 0.3s ease` ×14, `color 0.2s linear` ×12, `color 0.3s cubic-bezier(0.42, 0.01, 0.58, 1)` ×8, `all 0.3s cubic-bezier(0.42, 0.01, 0.58, 1)` ×7. Scroll lié : ScrollTrigger oui ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : `data-scroll-devices` ×5. Ce qui bouge réellement à l'écran : à juger sur `captures/blackbird-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `main#main` « Hello and Welcome to Blackbird Bakery o… » (1,5 écran, 136 mots, 4 image(s)).
2. L'élément le plus animé : `div#LogoCol` (6 transition(s) : transform 0.3s ease ; filter 0.3s ease ; attributs data-scroll-devices).
3. Le bloc le plus singulier par sa structure : `div.fusion-tb-header` (seule à contenir <form>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« MENU »).
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/4 ordinateur, 0/6 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
