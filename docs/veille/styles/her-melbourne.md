# Her — https://her.melbourne/
Titre « HER Melbourne - Dining, Immersive Art & Music », `lang="en"`, description « Food, Drinks, Music & Art Collide In This Multi-Storey Venue with Four Spaces to Explore. In a World of Its Own, Meet Friends, Sip Sundowners & Kiss The Night … », technologie lue : Nuxt, Sanity, Tailwind. Démontage automatique du 2026-10-19 (`ff demonter`, mesures brutes dans `her-melbourne.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; canvas plein écran (100 % de l'écran) ; bouton principal « MUSIC ROOM RADIO » en bas à gauche (16, 846 px, dans une barre fixe) ; 9 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; canvas plein écran (100 % de l'écran) ; bouton principal « HER ROOFTOP » à mi-hauteur au centre (96, 307 px, dans une barre fixe) ; 12 mots visibles au-dessus du pli ; aucune couche bloquante ; bouge tout seul sans défilement : 1 élément(s) (`div`).
Nav : 6 lien(s) — [BOOKINGS], [EVENTS], [INFO], [FUNCTIONS], [HER], [NEWSLETTER] ; boutons entre crochets.
Sections de premier niveau : non mesuré. Calques hors flux (fixes/absolus) : `header.fixed` (fixed, 110 px, 6 mots), `footer.fixed` (fixed, 70 px, collé en bas, 3 mots).
Pied de page : 1 lien(s) — [MUSIC ROOM RADIO]. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « BOOKINGS » (/bookings).
En 3 secondes : à juger sur `captures/her-melbourne-d.webp` (mesuré : fond du premier écran #000000, 0 image(s) et 9 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 : non mesuré ; corps : non mesuré ; boutons **NeueHaasGrotesk**, 18 px / 18 px téléphone, graisse 500, interlignage 1,00, capitales, interlettrage 0.44px ; nav **NeueHaasGrotesk**, 18 px / 18 px téléphone, graisse 500, interlignage 1,00, capitales, interlettrage 0.44px.
Sources `@font-face` : auto-hébergée (NeueHaasGrotesk) ; fichiers chargés : https://www.her.melbourne/fonts/nhaasgrotesk/NHaasGroteskDSStd-Regular.woff2, https://www.her.melbourne/fonts/nhaasgrotesk/NHaasGroteskDSStd-Medium.woff2. Familles en usage sur le texte visible : NeueHaasGrotesk ×7. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff (premier écran #000000), texte #000000 (contraste 21,00:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (50 %), #000000 (50 %) ; textes par nombre de caractères : #ffffff (95 %), #000000 (5 %). Images : 0 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : Vue (window.__NUXT__). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `color 0.2s cubic-bezier(0.4, 0, 0.2, 1)` ×9, `color 0.3s cubic-bezier(0.4, 0, 0.2, 1)` ×1, `opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/her-melbourne-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : non mesuré.
2. L'élément le plus animé : `header.fixed` (1 transition(s) : color 0.3s cubic-bezier(0.4, 0, 0.2, 1)).
3. Le bloc le plus singulier par sa structure : non mesuré.

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« BOOKINGS »).
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 7/9 ordinateur, 7/7 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
