# vinsurvin — https://www.vinsurvin.com/
Titre « Home », `lang="fr"`, technologie lue : jQuery. Démontage automatique du 2026-10-27 (`ff demonter`, mesures brutes dans `vinsurvin.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « DOMAINE A VENDRE » ; fond en image plein écran (84 % de l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 6 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « DOMAINE A VENDRE » ; fond en image plein écran (85 % de l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 6 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : non mesuré.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div#stickyHeaderSpacer` (0,1 écran, 0 mots, 0 img) → `div#dmFirstContainer` « DOMAINE A VENDRE » (0,8 écran, 4 mots, 0 img) → `div.dmFooterContainer` (0,1 écran, 0 mots, 0 img). Calques hors flux (fixes/absolus) : `div#dmPopup` (fixed, 900 px, 2 mots), `div.dmHeaderContainer` (fixed, 124 px).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/vinsurvin-d.webp` (mesuré : fond du premier écran #ffffff, 1 image(s) et 6 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Libre Baskerville**, 60 px / 60 px téléphone, graisse 400, interlignage 1,50, italique ; h2 : non mesuré ; corps : non mesuré ; boutons : non mesuré ; nav : non mesuré.
Sources `@font-face` : tiers (irp.cdn-website.com) (Libre Baskerville) ; locale (Josefin Slab Fallback, Roboto Fallback, Libre Baskerville Fallback, Josefin Sans Fallback, Oswald Fallback) ; fichiers chargés : https://irp.cdn-website.com/fonts/s/librebaskerville/v14/kmKnZrc3Hgbbcjq75U4uslyuy4kn0qNZaxM.woff2. Familles en usage sur le texte visible : Libre Baskerville ×2, Helvetica ×1. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #eeeeee (premier écran #ffffff), texte #000000 (contraste 18,10:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #eeeeee (35 %), #ffffff (35 %), #f5f5f5 (30 %) ; textes par nombre de caractères : #ffffff (81 %), #999999 (19 %). Images : 0 `<img>` visibles, 1 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery), Locomotive Scroll (attribut data-scroll). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `height 0.2s ease` ×2, `background-color 0.2s ease` ×2, `padding 0.2s ease` ×2, `width 0.2s ease` ×2, `margin 0.2s ease` ×2, `top 0.2s ease` ×2, `transform 0.2s ease` ×2. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : `data-background-parallax-selector` ×1, `data-scrollable-target` ×1, `data-scrollable-target-threshold` ×1, `data-scroll-responder-id` ×1. Ce qui bouge réellement à l'écran : à juger sur `captures/vinsurvin-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div#dmFirstContainer` « DOMAINE A VENDRE » (0,8 écran, 4 mots, 0 image(s)).
2. L'élément le plus animé : `div#hcontainer` (7 transition(s) : height 0.2s ease ; background-color 0.2s ease ; attributs data-scrollable-target, data-scrollable-target-threshold, data-scroll-responder-id).
3. Le bloc le plus singulier par sa structure : aucune section ne contient de balise rare (table, details, canvas, video, svg, form, dl…).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : rien de mesurable.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/0 ordinateur, 0/0 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
