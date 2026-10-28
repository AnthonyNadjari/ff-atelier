# Mikkeller Beer — https://mikkeller.com/
Titre « Mikkeller Beer | Founded in Copenhagen in 2006 », `lang="en"`, description « Mikkeller is a Danish world-renowned Copenhagen based craft brewery founded by school teacher Mikkel Borg Bjergsø. It is first and foremost about beer; showcas… », technologie lue : Shopify, Webflow, jQuery. Démontage automatique du 2026-10-28 (`ff demonter`, mesures brutes dans `mikkeller.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « Mikkeller » ; pas de média plein écran (10 image(s) dans l'écran) ; bouton principal « Customize » à mi-hauteur au centre (528, 473 px, dans une barre fixe) ; 107 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : calque couvrant 100 % de l'écran (« Are you 18 years or older? NOT YET YES Remember me on this … ») ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « Mikkeller » ; pas de média plein écran (8 image(s) dans l'écran) ; bouton principal « Customize » à mi-hauteur au centre (24, 379 px, dans une barre fixe) ; 107 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : bannière cookies couvrant 100 % de l'écran (« You control your data We and our business partners use tech… ») ; rien ne bouge tout seul.
Nav : non mesuré.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.page-wrapper` (1,4 écran, 28 mots, 4 img) → `div.footer` (1,2 écran, 140 mots, 3 img). Calques hors flux (fixes/absolus) : `div.cky-consent-container` (fixed, 410 px, 82 mots), `div#age-verification` (fixed, 900 px, 22 mots).
Pied de page : aucun pied de page lu. Téléphone cliquable : oui (1, tel:+4533227997). Formulaire : 1 (3 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Brand Book » (/brand-book-external).
En 3 secondes : à juger sur `captures/mikkeller-d.webp` (mesuré : fond du premier écran #ffffff, 10 image(s) et 107 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 : non mesuré ; corps **gotham**, 14 px / 14 px téléphone, graisse 400, interlignage 1,71 ; boutons **Gothamhtf**, 14 px / 14 px téléphone, graisse 600, interlignage 1,71 ; nav : non mesuré.
Sources `@font-face` : inline (data:) (webflow-icons) ; tiers (cdn.prod.website-files.com) (Mikkelwind, Mbcc 2022 Final, Mbcc 2022) ; tiers (webflow-files-prod.global.ssl.fastly.net) (Windsor) ; Adobe Fonts (gotham) ; fichiers chargés : https://use.typekit.net/cpi6krr.js, https://cdn.prod.website-files.com/64ad1f9e95d96a6e7e92a42a/64ad24bfd4f75b8d294f4800_Mikkelwind.woff2, https://use.typekit.net/af/e0cede/0000000000000000775aa930/31/l?primer=7fa3915bdafdf03041871920a205bef951d72bf64dd4c4460fb992e3ecc3a862&fvd=n4&v=3, https://use.typekit.net/af/aaa6a3/0000000000000000775aa938/31/l?primer=7fa3915bdafdf03041871920a205bef951d72bf64dd4c4460fb992e3ecc3a862&fvd=n7&v=3, https://use.typekit.net/af/4f91c5/0000000000000000775aa92f/31/l?primer=7fa3915bdafdf03041871920a205bef951d72bf64dd4c4460fb992e3ecc3a862&fvd=n5&v=3, https://use.typekit.net/af/f34e19/0000000000000000775aa92e/31/l?primer=7fa3915bdafdf03041871920a205bef951d72bf64dd4c4460fb992e3ecc3a862&fvd=n3&v=3. Familles en usage sur le texte visible : gotham ×40, Mikkelwind ×7, Gothamhtf ×3. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #000000 (contraste 21,00:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (67 %), #f6f2e8 (29 %), #f5f2e9 (4 %), #357c4f (0 %), #487a53 (0 %) ; textes par nombre de caractères : #000000 (50 %), #414040 (29 %), #357c4f (17 %), #ffffff (2 %), #487a53 (2 %). Images : 6 `<img>` visibles, 7 fond(s) en image, 3 vidéo(s), `mask-image`/`clip-path` sur 2 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery), Webflow (window.Webflow). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.2s ease` ×4, `all 0.2s ease-in-out` ×2. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : `data-animation-type` ×1. Ce qui bouge réellement à l'écran : à juger sur `captures/mikkeller-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.page-wrapper` (1,4 écran, 28 mots, 4 image(s)).
2. L'élément le plus animé : `div.henry-animation` (attributs data-animation-type).
3. Le bloc le plus singulier par sa structure : `div.page-wrapper` (seule à contenir <video>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : téléphone cliquable, portes d'action nommées (« Brand Book »), formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 1/11 ordinateur, 0/11 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : oui (calque, 100 % de l'écran) ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
