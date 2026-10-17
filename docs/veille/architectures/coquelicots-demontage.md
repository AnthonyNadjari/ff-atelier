# coquelicots — https://coquelicots.nl/
Titre non mesuré, `lang="?"`, technologie lue : Nuxt. Démontage automatique du 2026-10-17 (`ff demonter`, mesures brutes dans `coquelicots.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; image plein écran (72 % de l'écran) ; bouton principal « Boeken » en haut à droite (1104, 35 px, dans une barre fixe) ; 48 mots visibles au-dessus du pli ; aucune couche bloquante ; bouge tout seul sans défilement : 13 élément(s) (`span.cursor-dot`).
Téléphone (390x844) : h1 absent ; pas de média plein écran (1 image(s) dans l'écran) ; bouton principal « Boeken » en haut à droite (217, 35 px, dans une barre fixe) ; 44 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : non mesuré.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div` « We werden verliefd op de Franse Dordogne » (5,2 écrans, 1474 mots, 8 img) → `footer.footer` (1,2 écran, 11 mots, 2 img). Calques hors flux (fixes/absolus) : `a.router-link-active` (fixed, 35 px), `div.mobile-menu` (fixed, 880 px, 13 mots), `div.mobile-menu__after` (fixed, 900 px), `div.menu` (fixed, 45 px, 2 mots), `div#cursor` (fixed, 900 px).
Pied de page : 6 lien(s) — Informatie, Foto's, Reviews, Contact, Privacyverklaring, Anne Noteboom. Téléphone cliquable : non. Formulaire : 1 (0 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/coquelicots-d.webp` (mesuré : fond du premier écran #fdf8f5, 1 image(s) et 48 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 **Laca Semibold**, 70 px / 42 px téléphone, graisse 400, interlignage 0,85 ; corps **Laca**, 24 px / 20 px téléphone, graisse 300, interlignage 1,50 ; boutons **Laca**, 16 px / 16 px téléphone, graisse 400 ; nav : non mesuré.
Sources `@font-face` : auto-hébergée (Laca, Laca Medium, Laca Semibold, Cormorant Garamond, Poppins) ; fichiers chargés : https://coquelicots.nl/_nuxt/Laca-Semibold.BSThHuF3.otf, https://coquelicots.nl/_nuxt/Laca-Medium.DWMJKYhZ.otf, https://coquelicots.nl/_nuxt/Laca-Book.DJtrFk2d.otf. Familles en usage sur le texte visible : Laca ×115, Laca Medium ×76, Laca Semibold ×36, Cormorant Garamond ×3. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #fdf8f5, texte #121d5e (contraste 14,62:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #fdf8f5 (71 %), #add5c0 (17 %), #121d5e (10 %), #e8c4bf (1 %), #1c402d (1 %) ; textes par nombre de caractères : #1c402d (89 %), #121d5e (8 %), #ffffff (3 %), #655100 (1 %). Images : 7 `<img>` visibles, 1 fond(s) en image, 1 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : GSAP (window.gsap), Vue (window.__NUXT__). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `color 0.3s ease-in-out` ×282, `all 0.3s ease-in-out` ×175, `transform 0.6s cubic-bezier(0.625, 0.05, 0, 1)` ×29, `transform 0.3s ease-in-out` ×25, `all 0.55s ease-in-out` ×25, `opacity 0.18s ease` ×20, `background-color 0.3s ease-in-out` ×6, `animation loadMenu 3s ease-in-out` ×3, `animation loadHeroMedia 3s ease-in-out` ×2, `padding 0.3s ease-in-out` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : `data-button-animate-chars` ×3. Ce qui bouge réellement à l'écran : à juger sur `captures/coquelicots-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div` « We werden verliefd op de Franse Dordogne » (5,2 écrans, 1474 mots, 8 image(s)).
2. L'élément le plus animé : `a.router-link-active` (animation animation loadMenu 3s ease-in-out ; 3 transition(s) : padding 0.3s ease-in-out ; width 0.3s ease-in-out).
3. Le bloc le plus singulier par sa structure : `div` « We werden verliefd op de Franse Dordogne » (seule à contenir <svg>, <video>, <form>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : Cormorant Garamond ; boutons pilule : 0/2 ordinateur, 0/2 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
