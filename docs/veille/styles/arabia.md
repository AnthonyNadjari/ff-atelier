# Iittala — https://arabia.fi/
Titre « Arabia | Osta kauniit Arabia-astiat verkosta | Iittala », `lang="fi-FI"`, description « Arabia on ollut 150 vuoden ajan suomalaisen muotoilun edelläkävijä. Arabian muotoilun lähtökohtina ovat ajaton kauneus, laadukkuus ja käytännöllisyys. », technologie lue : Shopify, Tailwind, jQuery. Démontage automatique du 2026-10-23 (`ff demonter`, mesures brutes dans `arabia.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « ARABIAN TUOTESARJAT » ; image plein écran (88 % de l'écran) ; bouton principal « Evästeasetukset » à mi-hauteur à gauche (237, 390 px, dans une barre fixe) ; 129 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : calque couvrant 99 % de l'écran («  ») ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « ARABIAN TUOTESARJAT » ; image plein écran (82 % de l'écran) ; bouton principal « Sulje » en haut à droite (342, 4 px, dans une barre fixe, dans la nav) ; 57 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 10 lien(s) — Myiittala-päivät: koko valikoima -25 %*, Myiittala-etu: Lahja ostaessasi yli 100 , Liity Myiittala-jäseneksi, [Sulje], [AVAA PÄÄVALIKKO], @2026 Iittala, [Haku], Kirjaudu sisään tai rekisteröidy, Suosikit, [Ostoskori] ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `main#main-content` « ARABIAN TUOTESARJAT » (4,6 écrans, 70 mots, 19 img) → `section#shopify-section-sections--30943543492991__footer` « Asiakaspalvelu » (1,2 écran, 69 mots, 0 img). Calques hors flux (fixes/absolus) : `a#skip-to-main-content` (fixed, 40 px, 2 mots), `header.z-sticky` (fixed, 112 px, 25 mots).
Pied de page : 30 lien(s) — Ota yhteyttä, UKK, Toimitus, Tuotteiden hoito-ohjeet, Myymälät, Tärkeä turvallisuustiedote, Fiskars Group, Uramahdollisuudet, Myiittala, Vastuullisuus (+20). Téléphone cliquable : non. Formulaire : 1 (0 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Facebook » (https://www.facebook.com/Iittala/).
En 3 secondes : à juger sur `captures/arabia-d.webp` (mesuré : fond du premier écran #ffffff, 1 image(s) et 129 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **AINO**, 35 px / 28 px téléphone, graisse 400, interlignage 1,15, capitales ; h2 **AINO**, 24 px / 22 px téléphone, graisse 400, interlignage 1,20, capitales ; corps **AINOBeta**, 16 px / 14 px téléphone, graisse 400, interlignage 1,20 ; boutons **AINO**, 14 px / 14 px téléphone, graisse 700, interlignage 1,43 ; nav **AINO**, 14 px / 14 px téléphone, graisse 400, interlignage 1,35.
Sources `@font-face` : auto-hébergée (AINO) ; fichiers chargés : https://iittala.com/cdn/shop/t/29/assets/AINO-Bold.woff2, https://iittala.com/cdn/shop/t/29/assets/AINO-Regular.woff2. Familles en usage sur le texte visible : AINO ×75, AINOBeta ×7. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #101820 (contraste 17,89:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (73 %), #ffc600 (14 %), #000000 (13 %), #101820 (0 %) ; textes par nombre de caractères : #101820 (54 %), #000000 (40 %), #ffffff (5 %), #000aa0 (1 %), #f4f4f5 (1 %). Images : 19 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s), `mask-image`/`clip-path` sur 7 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : Shopify (window.Shopify), Locomotive Scroll (attribut data-scroll). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `color 0.5s cubic-bezier(0.16, 1, 0.3, 1)` ×17, `color 0.5s ease` ×6, `opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)` ×5, `transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)` ×5, `all 0.35s cubic-bezier(0.4, 0, 0.2, 1)` ×4, `transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)` ×4, `transform 0.1s ease` ×4, `all 0.5s cubic-bezier(0.4, 0, 0.2, 1)` ×2, `transform 0.3s ease-out` ×1, `opacity 0.3s ease-out` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : `data-module` ×16, `data-scroll-animation` ×5, `data-scroll-delta-threshold` ×1, `data-scroll-settings` ×1. Ce qui bouge réellement à l'écran : à juger sur `captures/arabia-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `main#main-content` « ARABIAN TUOTESARJAT » (4,6 écrans, 70 mots, 19 image(s)).
2. L'élément le plus animé : `media-banner-content.absolute` (2 transition(s) : opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1) ; transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) ; attributs data-module, data-scroll-animation).
3. Le bloc le plus singulier par sa structure : `section#shopify-section-sections--30943543492991__footer` « Asiakaspalvelu » (seule à contenir <ol>, <details>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« Facebook »), formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/11 ordinateur, 0/9 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : oui (calque, 99 % de l'écran) ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
