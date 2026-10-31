# mandl.design — https://mandl.design/
Titre « Christoph Mandl | Product Design, UX & Branding | Regensburg, Germany », `lang="en"`, description « Christoph Mandl designs digital products, websites, and brands in Regensburg, Germany. Selected work for StärkenEffekt, Thann Bioleder, and Brenner Cycles. », technologie lue : aucune reconnue. Démontage automatique du 2026-10-31 (`ff demonter`, mesures brutes dans `mandl.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « CHRISTOPH MANDL » ; pas de média plein écran (0 image(s) dans l'écran) ; bouton principal « Pause animations » en haut à droite (1404, 20 px, dans une barre fixe) ; 6 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « CHRISTOPH MANDL » ; pas de média plein écran (0 image(s) dans l'écran) ; bouton principal « Pause animations » en haut à droite (369, 20 px, dans une barre fixe) ; 6 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 2 lien(s) — [DE], [EN] ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.hero` (1,0 écran, 2 mots, 0 img) → `section.about` « CHRISTOPH MANDL » (0,9 écran, 19 mots, 1 img) → `section.episode` « STÄRKENEFFEKT » (5,2 écrans, 70 mots, 9 img) → `section.episode` « THANN BIOLEDER » (6,8 écrans, 113 mots, 11 img) → `section.episode` « BRENNER CYCLES » (3,5 écrans, 43 mots, 7 img) → `div.outro` (0,9 écran, 0 mots, 0 img) → `footer.site-footer` (0,1 écran, 9 mots, 0 img). Calques hors flux (fixes/absolus) : `button.motion-toggle` (fixed, 1 px, 2 mots), `nav.language-switch` (absolute, 24 px, 2 mots), `div.logomark-track` (absolute, 16064 px).
Pied de page : 4 lien(s) — christoph@mandl.design, +49 941 290 233 23, [Legal notice], [Privacy]. Téléphone cliquable : oui (3, tel:+4994129023323). Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/mandl-d.webp` (mesuré : fond du premier écran #b6bc94, 0 image(s) et 6 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Basier Circle Mono**, 16 px / 16 px téléphone, graisse 400, interlignage 1,00, capitales, interlettrage 1.92219px ; h2 **Basier Circle Mono**, 16 px / 16 px téléphone, graisse 700, interlignage 1,00, capitales, interlettrage 1.92219px ; corps **Basier Circle Mono**, 42 px / 24 px téléphone, graisse 400, interlignage 1,25, interlettrage -0.84096px ; boutons **Basier Circle Mono**, 13 px / 13 px téléphone, graisse 400, interlignage 1,50 ; nav **Basier Circle Mono**, 13 px / 13 px téléphone, graisse 400, interlignage 1,30.
Sources `@font-face` : auto-hébergée (Basier Circle Mono) ; fichiers chargés : https://mandl.design/font/basier-circle-mono-regular.woff2, https://mandl.design/font/basier-circle-mono-bold.woff2. Familles en usage sur le texte visible : Basier Circle Mono ×76. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #b5bc95 (premier écran #b6bc94), texte #45260e (contraste 6,89:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #b5bc95 (94 %), #ebe7e4 (1 %), #faf9f7 (1 %), #1d2331 (1 %), #17405c (1 %) ; textes par nombre de caractères : #d3ceba (60 %), #45260e (28 %), #17405c (5 %), #d0d0d0 (4 %), #f9f7f3 (4 %). Images : 28 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s), `mask-image`/`clip-path` sur 20 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : aucune détectée (window.* et noms de scripts). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `opacity 0.3s ease-out` ×29, `animation logo-type 0.001s ease` ×12, `opacity 0.2s ease` ×5, `animation logo-appear 0.6s cubic-bezier(0.22, 1, 0.36, 1)` ×3, `opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1)` ×2, `animation logo-cursor 2s steps(1)` ×2, `animation uncover 1.1s cubic-bezier(0.87, 0, 0.13, 1)` ×2, `animation info-reveal 0.7s ease-in-out` ×2, `transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)` ×1, `opacity 1s ease` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 1 bloc(s) de plus d'un écran (`svg.logomark` 17,8 écrans). Attributs de mouvement : `data-reveal` ×10, `data-typing` ×2, `data-animated` ×1, `data-cursor` ×1. Ce qui bouge réellement à l'écran : à juger sur `captures/mandl-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `section.episode` « THANN BIOLEDER » (6,8 écrans, 113 mots, 11 image(s)).
2. L'élément le plus animé : `div.wall__info` (animation animation info-reveal 0.7s ease-in-out ; attributs data-reveal).
3. Le bloc le plus singulier par sa structure : `footer.site-footer` (seule à contenir <dl>, <address>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : téléphone cliquable.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/2 ordinateur, 0/3 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
