# Carl Hansen & Søn — https://www.carlhansen.com/
Titre « Carl Hansen & Søn - Danish design since 1908 », `lang="en"`, description « Discover more than 100 years of furniture history with respect and passion for craftsmanship. », technologie lue : generator « Episerver Commerce », Next.js, Tailwind. Démontage automatique du 2026-10-22 (`ff demonter`, mesures brutes dans `carlhansen.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « Select country and language » ; image plein écran (86 % de l'écran) ; bouton principal « Show details » à mi-hauteur au centre (460, 384 px, dans une barre fixe) ; 96 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : bannière cookies couvrant 100 % de l'écran (« The website uses cookies Some are used for statistical purp… ») ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « A Celebration of Form, Colour and Craftsmanship » ; pas de média plein écran (1 image(s) dans l'écran) ; bouton principal « Show details » en bas à gauche (55, 714 px, dans une barre fixe) ; 68 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : bannière cookies couvrant 100 % de l'écran (« The website uses cookies Some are used for statistical purp… ») ; bouge tout seul sans défilement : 5 élément(s) (`img`, `div.relative`, `h1.mb-8`, `div.RichText`, `a.flex`).
Nav : 6 lien(s) — About cookies, Google privacy policy, [Show details], [DECLINE ALL], [ACCEPT ALL], Cookie Information ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `main.DefaultLayout` « A Celebration of Form, Colour and Craft… » (5,3 écrans, 594 mots, 8 img) → `div.DynamicFooter` « Inspiration » (1,0 écran, 58 mots, 5 img). Calques hors flux (fixes/absolus) : `a.absolute` (absolute, 24 px, 3 mots).
Pied de page : aucun pied de page lu. Téléphone cliquable : oui (1, tel:+45 66 12 14 04). Formulaire : 1 (7 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Delivery » (/en/en/delivery2).
En 3 secondes : à juger sur `captures/carlhansen-d.webp` (mesuré : fond du premier écran #ffffff, 1 image(s) et 96 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **BasisGrotesquePro**, 36 px / 36 px téléphone, graisse 700, interlignage 1,11 ; h2 **BasisGrotesquePro**, 27 px / 18 px téléphone, graisse 500, interlignage 1,20 ; corps **BasisGrotesquePro**, 16 px / 16 px téléphone, graisse 300, interlignage 1,70 ; boutons **BasisGrotesquePro**, 15 px / 15 px téléphone, graisse 300 ; nav : non mesuré.
Sources `@font-face` : auto-hébergée (BasisGrotesquePro) ; fichiers chargés : https://www.carlhansen.com/_next/static/media/basis-grotesque-regular-pro.1e211fad.woff2. Familles en usage sur le texte visible : BasisGrotesquePro ×85. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #1a202c (contraste 16,32:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (41 %), #000000 (32 %), #f5f5f5 (19 %), #f6f6f6 (8 %), #2c622c (0 %) ; textes par nombre de caractères : #1a202c (64 %), #222222 (12 %), #ffffff (11 %), #000000 (4 %), #234923 (3 %). Images : 8 `<img>` visibles, 0 fond(s) en image, 1 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : React (window.__NEXT_DATA__). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.2s ease` ×7, `all 0.3s ease` ×6, `all 1s cubic-bezier(0.1, 0.6, 0.4, 1)` ×3, `all 0.5s cubic-bezier(0.4, 0, 0.2, 1)` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/carlhansen-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `main.DefaultLayout` « A Celebration of Form, Colour and Craft… » (5,3 écrans, 594 mots, 8 image(s)).
2. L'élément le plus animé : `button#declineButton` (1 transition(s) : all 0.3s ease).
3. Le bloc le plus singulier par sa structure : `main.DefaultLayout` « A Celebration of Form, Colour and Craft… » (seule à contenir <video>, <form>, <select>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : téléphone cliquable, portes d'action nommées (« Delivery »), formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/13 ordinateur, 0/10 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : oui (bannière cookies, 100 % de l'écran) ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
