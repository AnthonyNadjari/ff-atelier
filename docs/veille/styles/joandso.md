# JO&SO — https://joandso.com/
Titre « JO&SO | The Cool Hotels in Portugal by Two Portuguese Sisters », `lang="en"`, description « JO&SO is Portugal's insider boutique hotel guide, curated by two Portuguese sisters. Explore handpicked stays in Lisbon, Porto, Algarve, Comporta & beyond. », technologie lue : Webflow, jQuery. Démontage automatique du 2026-10-19 (`ff demonter`, mesures brutes dans `joandso.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « The cool places to stay in Portugal handpicked by two Portuguese sisters » ; image plein écran (100 % de l'écran) ; bouton principal « VIEW 106 HOTELS » en bas au centre (457, 595 px) ; 64 mots visibles au-dessus du pli ; bannière cookies 8 % de l'écran, non bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « The cool places to stay in Portugal handpicked by two Portuguese sisters » ; image plein écran (66 % de l'écran) ; bouton principal « VIEW 106 HOTELS » à mi-hauteur au centre (87, 340 px) ; 69 mots visibles au-dessus du pli ; bannière cookies 27 % de l'écran, non bloquante ; rien ne bouge tout seul.
Nav : 6 lien(s) — Hotels, Homes, Journal, About, Newsletter, Go to Homepage ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `main.sl-home` « The cool places to stay in Portugal han… » (4,4 écrans, 339 mots, 53 img) → `div.sl-end` (1,4 écran, 9 mots, 4 img) → `section#quotes` (1,0 écran, 32 mots, 0 img) → `footer#Footer` (1,8 écran, 197 mots, 1 img). Calques hors flux (fixes/absolus) : `header#nav` (fixed, 50 px, 6 mots), `div.fs-cc-banner_component` (fixed, 232 px, collé en bas, 38 mots).
Pied de page : 30 lien(s) — [READ OUR STORY], Portugal, Lisbon, Porto, Algarve, Alentejo, North Portugal, Centre of Portugal, Azores, Madeira (+20). Téléphone cliquable : non. Formulaire : 1 (2 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Facebook » (https://facebook.com/joandsocollection).
En 3 secondes : à juger sur `captures/joandso-d.webp` (mesuré : fond du premier écran #ffffff, 4 image(s) et 64 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **SL Twklausanne**, 93 px / 38 px téléphone, graisse 400, interlignage 1,00, interlettrage -1.856px ; h2 **SL Twklausanne**, 11 px / 11 px téléphone, graisse 400, interlignage 1,43, capitales, interlettrage 1.92px ; corps **SL Twklausanne**, 21 px / 18 px téléphone, graisse 200, interlignage 1,31 ; boutons **SL Twklausanne**, 14 px / 14 px téléphone, graisse 400, interlignage 1,50, capitales, interlettrage 1.08px ; nav **SL Twklausanne**, 21 px / 19 px téléphone, graisse 200, interlignage 1,83.
Sources `@font-face` : inline (data:) (webflow-icons) ; tiers (cdn.prod.website-files.com) (SL Twklausanne) ; fichiers chargés : https://cdn.prod.website-files.com/5fecc80e92fcdb7da9d1f0fb/619f9546f0932212b06bad98_TWKLausanne-400.woff2, https://cdn.prod.website-files.com/5fecc80e92fcdb7da9d1f0fb/69e8fdad348abb6b549b3a32_TWKLausanne-200.woff2, https://cdn.prod.website-files.com/5fecc80e92fcdb7da9d1f0fb/619f954673d5e81599937dc6_TWKLausanne-500.woff2. Familles en usage sur le texte visible : SL Twklausanne ×123. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #333333 (contraste 12,63:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (53 %), #e9e9e9 (20 %), #131313 (18 %), #7b756a (3 %), #7a746a (1 %) ; textes par nombre de caractères : #ffffff (90 %), #303030 (5 %), #333333 (3 %), #000000 (1 %), #131313 (1 %). Images : 33 `<img>` visibles, 2 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery), Webflow (window.Webflow). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `opacity 0.4s ease` ×13, `box-shadow 0.6s ease` ×9, `box-shadow 0.4s ease` ×2. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : `data-wf--sticky-nav-hero--variant` ×1. Ce qui bouge réellement à l'écran : à juger sur `captures/joandso-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `main.sl-home` « The cool places to stay in Portugal han… » (4,4 écrans, 339 mots, 53 image(s)).
2. L'élément le plus animé : `header#nav` (attributs data-wf--sticky-nav-hero--variant).
3. Le bloc le plus singulier par sa structure : `div.sl-end` (contient <form>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« Facebook »), formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/11 ordinateur, 0/12 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Verdict de la veille (19 oct 2026)

Gardé en atomes (`atomes/joandso.json`) : essai `ff melanger demo-boulangerie --style joandso --essai` comparé à la source ; voir la ligne de `INDEX.md`.
