# Vistamare — https://vistamare.com/
Titre « Vistamare — Art Gallery », `lang="it-IT"`, description « Vistamare è una galleria d'arte con sede a Milano e Pescara. », technologie lue : Nuxt. Démontage automatique du 2026-10-31 (`ff demonter`, mesures brutes dans `vistamare.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; pas de média plein écran (2 image(s) dans l'écran) ; bouton principal « cookie policy » en bas à gauche (234, 716 px, dans une barre fixe) ; 200 mots visibles au-dessus du pli ; bannière cookies 7 % de l'écran, non bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; pas de média plein écran (2 image(s) dans l'écran) ; bouton principal « cookie policy » en bas au centre (12, 632 px, dans une barre fixe) ; 163 mots visibles au-dessus du pli ; bannière cookies 31 % de l'écran, non bloquante ; rien ne bouge tout seul.
Nav : 10 lien(s) — Exhibitions, Artists, Fairs, About, Contact, [Italian], [English], Home, Instagram (opens in new tab), Facebook (opens in new tab) ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `header` (3,2 écrans, 20 mots, 0 img) → `main.m:py-0` « IMMAGINI DEL VUOTO: dalla camera oscura… » (3,2 écrans, 366 mots, 16 img). Calques hors flux (fixes/absolus) : `div#iubenda-cs-banner` (fixed, 229 px, collé en bas, 67 mots).
Pied de page : 6 lien(s) — Vistamare Milano, Vistamare Pescara, [Iscriviti], Cookie Policy, Privacy Policy (opens in new tab), Website by Giga (opens in new tab). Téléphone cliquable : non. Formulaire : 1 (1 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Facebook (opens in new tab) » (https://www.facebook.com/galleriavistamare/).
En 3 secondes : à juger sur `captures/vistamare-d.webp` (mesuré : fond du premier écran #f8f8f8, 2 image(s) et 200 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 **Neue Montreal**, 20 px / 18 px téléphone, graisse 400, interlignage 1,10, interlettrage 0.4px ; corps **Neue Montreal**, 20 px / 18 px téléphone, graisse 400, interlignage 1,10, interlettrage 0.4px ; boutons **Neue Montreal**, 14 px / 15 px téléphone, graisse 400, interlignage 1,20, interlettrage 0.42px ; nav **Neue Montreal**, 14 px / 15 px téléphone, graisse 400, interlignage 1,20, interlettrage 0.42px.
Sources `@font-face` : auto-hébergée (Neue Montreal) ; fichiers chargés : https://vistamare.com/fonts/NeueMontreal-Regular.woff2. Familles en usage sur le texte visible : Neue Montreal ×88. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #f8f8f8, texte #000000 (contraste 19,77:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #f8f8f8 (98 %), #ffffff (2 %) ; textes par nombre de caractères : #484848 (51 %), #aaaaaa (24 %), #1f219b (22 %), #c4c4c4 (3 %). Images : 8 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s), `mask-image`/`clip-path` sur 8 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : aucune détectée (window.* et noms de scripts). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `background-color 0.2s ease` ×7, `outline-color 0.2s ease` ×7, `color 0.15s ease` ×5, `animation banner-slide-up 0.3s ease-out` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 1 bloc(s) de plus d'un écran (`div.m:sticky` 3,2 écrans). Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/vistamare-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `header` (3,2 écrans, 20 mots, 0 image(s)).
2. L'élément le plus animé : `div#iubenda-cs-banner` (animation animation banner-slide-up 0.3s ease-out).
3. Le bloc le plus singulier par sa structure : `header` (seule à contenir <svg>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« Facebook (opens in new tab) »), formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/6 ordinateur, 0/8 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
