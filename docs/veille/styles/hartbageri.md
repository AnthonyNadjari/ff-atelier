# Hart Bageri — https://hart-bageri.dk/
Titre « Hart Bageri », `lang="en-US"`, description « Bread and pastries, baked daily in our Copenhagen shops. Order ahead and pick up. », technologie lue : WordPress, Tailwind, jQuery. Démontage automatique du 2026-10-28 (`ff demonter`, mesures brutes dans `hartbageri.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; vidéo plein écran (100 % de l'écran) ; bouton principal « Fresh Out The Oven ApS » en bas à gauche (66, 872 px, dans une barre fixe) ; 75 mots visibles au-dessus du pli ; bannière cookies 3 % de l'écran, non bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; vidéo plein écran (100 % de l'écran) ; bouton principal « Open every day » en bas à gauche (14, 788 px, dans une barre fixe) ; 6 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 13 lien(s) — Go home, LOCATIONS, ABOUT, [CONTACT], PRE-ORDER, GIFT CARDS, View cart, 0 items, info@hartbageri.com, [Copy info@hartbageri.com to clipboard], here, wholesale@hartbageri.com, [Copy wholesale@hartbageri.com to clipboa] (+1) ; boutons entre crochets.
Sections de premier niveau : non mesuré. Calques hors flux (fixes/absolus) : `header.fixed` (fixed, 72 px, 58 mots), `div.absolute` (absolute, 1170 px), `div.fixed` (fixed, 900 px), `footer.fixed` (fixed, 29 px, 17 mots).
Pied de page : 6 lien(s) — [Fresh Out The Oven ApS], PRIVACY POLICY, TERMS & CONDITIONS, SITE CREDITS, COOKIES, SMILEY REPORT. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « PRE-ORDER » (/pre-order), « GIFT CARDS » (https://order.lifepeaks.dk/en/hart-bageri).
En 3 secondes : à juger sur `captures/hartbageri-d.webp` (mesuré : fond du premier écran #0b0b0b, 2 image(s) et 75 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 : non mesuré ; corps **Graphik**, 14 px, graisse 535, interlignage 1,50 ; boutons **Basel Grotesk Mono**, 14 px / 14 px téléphone, graisse 535, capitales ; nav **Basel Grotesk Mono**, 14 px / 14 px téléphone, graisse 535.
Sources `@font-face` : auto-hébergée (star, WooCommerce, Basel Grotesk Mono, Graphik) ; fichiers chargés : https://hartbageri.com/wp-content/themes/hartbageri-2.0/react-app/dist/fonts/Basel-Grotesk-Mono/Basel-Grotesk-Mono-Medium/Basel-Grotesk-Mono-Medium.woff2, https://hartbageri.com/wp-content/themes/hartbageri-2.0/react-app/dist/fonts/Graphik/Graphik-Regular.ttf. Familles en usage sur le texte visible : Basel Grotesk Mono ×17, Graphik ×8. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #0b0b0b, texte #000000 (contraste 1,07:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #0b0b0b (100 %) ; textes par nombre de caractères : non mesuré. Images : 0 `<img>` visibles, 0 fond(s) en image, 1 vidéo(s), `mask-image`/`clip-path` sur 1 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1)` ×7, `background-color 0.3s ease` ×1, `color 0.3s cubic-bezier(0.4, 0, 0.2, 1)` ×1, `opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/hartbageri-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : non mesuré.
2. L'élément le plus animé : `div.relative` (1 transition(s) : background-color 0.3s ease).
3. Le bloc le plus singulier par sa structure : non mesuré.

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« PRE-ORDER », « GIFT CARDS »).
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/3 ordinateur, 0/1 téléphone ; vidéo en premier écran : oui ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
