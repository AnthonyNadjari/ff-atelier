# Hodinkee — https://hodinkee.com/
Titre « Hodinkee », `lang="en"`, description « Wristwatch News, Reviews, & Original Stories », technologie lue : Shopify, Tailwind. Démontage automatique du 2026-10-23 (`ff demonter`, mesures brutes dans `hodinkee.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; pas de média plein écran (3 image(s) dans l'écran) ; bouton principal « Manage preferences » en bas à droite (855, 839 px, dans une barre fixe) ; 180 mots visibles au-dessus du pli ; bannière cookies 25 % de l'écran, non bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; pas de média plein écran (8 image(s) dans l'écran) ; bouton principal « Manage preferences » en bas au centre (20, 832 px, dans une barre fixe) ; 184 mots visibles au-dessus du pli ; bannière cookies 33 % de l'écran, non bloquante ; rien ne bouge tout seul.
Nav : 12 lien(s) — [CANCEL], [Log In Sign Up], Stories, [What's New], Videos, [Videos], Magazine, [Magazine], Insurance, [Insurance], Shop, [Shop] ; boutons entre crochets. **Barre fixe en bas de l'écran (téléphone)** : Accept Essential Cookies, Accept All.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.homepage-billboard-container` (0,3 écran, 0 mots, 0 img) → `header#navigation` (0,2 écran, 112 mots, 2 img) → `div.homepage-modules` « AuctionsMonaco Legend Group's Fall Auct… » (1,6 écran, 142 mots, 7 img) → `div` « Talking WatchesWith Pusha T – On Rolex,… » (8,4 écrans, 970 mots, 9 img) → `div.footer__last-week-top-stories` « LAST WEEK'S TOP STORIES » (0,4 écran, 69 mots, 5 img) → `footer.footer-light` (0,4 écran, 51 mots, 5 img). Calques hors flux (fixes/absolus) : `a.skip-link` (absolute, 24 px, 5 mots).
Pied de page : 14 lien(s) — Our Story, Press, Careers, Privacy Policy, Terms of Service, Contact Us, Advertise, Press Releases, Image Licensing, Instagram, Opens a new window (+4). Téléphone cliquable : non. Formulaire : 1 (2 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/hodinkee-d.webp` (mesuré : fond du premier écran #ffffff, 3 image(s) et 180 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 **Portrait Inline**, 51 px / 32 px téléphone, graisse 400, interlignage 1,50 ; corps **Portrait Text**, 18 px / 18 px téléphone, graisse 400, interlignage 1,20 ; boutons **Proxima Nova**, 16 px / 16 px téléphone, graisse 400, interlignage 1,50 ; nav **Hodinkee Social**, 14 px / 12 px téléphone, graisse 400, interlignage 1,20.
Sources `@font-face` : auto-hébergée (BrownPro Web Regular, DecimaMonoPro-Bold, GT America, Hodinkee Social, Hodinkee Social Mono, Ivar Headline, Ivar Text, Portrait Headline, Portrait Headline Italics, Portrait Text) ; tiers (static.klaviyo.com) (Poppins-Klaviyo-Hosted) ; tiers (cdn.shopify.com) (Proxima Nova) ; fichiers chargés : https://cdn.hodinkee.com/packs/media/fonts/BrownPro-Bold-7e12df86.woff, https://cdn.hodinkee.com/packs/media/fonts/BrownPro-Bold-04c24e3f.woff2, https://cdn.hodinkee.com/packs/media/fonts/BrownPro-Regular-d459912f.woff, https://cdn.hodinkee.com/packs/media/fonts/BrownPro-Regular-250139ea.woff2, https://cdn.hodinkee.com/packs/media/fonts/BrownStd-Light-91ace493.woff, https://cdn.hodinkee.com/packs/media/fonts/DinNextMedium-66a7ad1f.woff2. Familles en usage sur le texte visible : Brown ×88, Portrait Inline ×78, Portrait ×63, Portrait Text ×28, Hodinkee Social ×18, Proxima Nova ×12. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #000000 (contraste 21,00:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (84 %), #222222 (12 %), #f5f7f7 (2 %), #f5f5f5 (2 %), #0c0c0c (0 %) ; textes par nombre de caractères : #000000 (36 %), #ffffff (25 %), #222222 (10 %), #464848 (8 %), #666666 (8 %). Images : 22 `<img>` visibles, 45 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `color 0.3s cubic-bezier(0.4, 0, 0.2, 1)` ×14, `opacity 0.2s ease` ×7, `all 0.075s cubic-bezier(0.4, 0, 0.2, 1)` ×6, `all 0.2s cubic-bezier(0.4, 0, 0.2, 1)` ×5, `transform 0.2s ease` ×5, `background-color 0.2s ease-in-out` ×3, `border-color 0.2s ease-in-out` ×3, `all 0.3s ease` ×2. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/hodinkee-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div` « Talking WatchesWith Pusha T – On Rolex,… » (8,4 écrans, 970 mots, 9 image(s)).
2. L'élément le plus animé : `a.btn` (2 transition(s) : background-color 0.2s ease-in-out ; border-color 0.2s ease-in-out).
3. Le bloc le plus singulier par sa structure : `div.homepage-billboard-container` (seule à contenir <iframe>, <canvas>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : barre d'actions fixe en bas sur téléphone, formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/13 ordinateur, 0/19 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
