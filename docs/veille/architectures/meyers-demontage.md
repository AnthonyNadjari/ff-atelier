# Meyers — https://meyers.dk/
Titre « Ny kogebog på gaden: Meyers Hverdagsgrøntsager | Meyers », `lang="da"`, description « Smag det hele før de andre og få nyheder og skønne opskrifter. Bestil catering til fest og højtider, frokost til firmaer og tag på Madkursus i Meyers », technologie lue : Nuxt, Sanity, Tailwind. Démontage automatique du 2026-10-17 (`ff demonter`, mesures brutes dans `meyers.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « NY KOGEBOG PÅ GADEN: MEYERS HVERDAGSGRØNTSAGER » ; image plein écran (100 % de l'écran) ; bouton principal « Samtykke » à mi-hauteur à gauche (270, 279 px, dans une barre fixe) ; 149 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : bannière cookies couvrant 100 % de l'écran («  ») ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « NY KOGEBOG PÅ GADEN: MEYERS HVERDAGSGRØNTSAGER » ; image plein écran (100 % de l'écran) ; bouton principal « Tillad alle » en bas au centre (23, 631 px, dans une barre fixe) ; 85 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : bannière cookies couvrant 100 % de l'écran («  ») ; rien ne bouge tout seul.
Nav : 14 lien(s) — Gå til forsiden, KANTINE KANTINE KANTINE, FROKOSTORDNING FROKOSTORDNING FROKOSTORD, CATERING CATERING & & EVENTS EVENTS CATE, MADKURSER MADKURSER & & TEAMBUILDING TEA, OPSKRIFTER OPSKRIFTER OPSKRIFTER, RESTAURANTER RESTAURANTER & & BAGERIER B, FOODSERVICE FOODSERVICE FOODSERVICE, DETAIL DETAIL DETAIL, PROJEKTER PROJEKTER & & RÅDGIVNING RÅDGI, EVENTKALENDER EVENTKALENDER EVENTKALENDE, KØB KØB GAVEKORT GAVEKORT KØB GAVEKORT (+2) ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.hero-primary-content` « DET, VI ARBEJDER MED LIGE NU » (7,4 écrans, 1118 mots, 24 img) → `section.bg-theme-distant` « TILMELD DIG VORES NYHEDSBREV » (1,0 écran, 116 mots, 0 img). Calques hors flux (fixes/absolus) : `div#CybotCookiebotDialog` (fixed, 498 px, 78 mots), `div#CybotCookiebotDialogBodyUnderlay` (fixed, 900 px), `iframe.CybotCookiebotOffscreenIframe` (absolute, 1 px), `nav#main-navigation` (fixed, 144 px, 65 mots), `header.relative` (sticky, 900 px, 6 mots).
Pied de page : 2 lien(s) — VILKÅR VILKÅR VILKÅR, TILGÆNGELIGHEDSERKLÆRING TILGÆNGELIGHEDS. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « FACEBOOK FACEBOOK FACEBOOK » (https://www.facebook.com/meyersmad/?locale=da_DK).
En 3 secondes : à juger sur `captures/meyers-d.webp` (mesuré : fond du premier écran #d6ceb4, 3 image(s) et 149 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Meyer Grand**, 128 px / 34 px téléphone, graisse 700, interlignage 0,75, capitales, interlettrage -2.56px ; h2 **Meyer Grand**, 32 px / 24 px téléphone, graisse 700, interlignage 1,00, capitales, interlettrage -0.64px ; corps **Meyer Grand**, 18 px / 14 px téléphone, graisse 300, interlignage 1,30 ; boutons **sans-serif**, 15 px / 15 px téléphone, graisse 600, interlignage 1,60, interlettrage 0.1px ; nav **Meyer Grand**, 18 px / 14 px téléphone, graisse 700, interlignage 1,00, capitales.
Sources `@font-face` : auto-hébergée (Meyer Grand, Graphik, Hatton, Dahlia, Merlod Norme) ; fichiers chargés : https://meyers.dk/_nuxt/MeyerGrandBold.DA-n7oWJ.woff2, https://meyers.dk/_nuxt/MeyerGrandLight.DoBKzsDB.woff2. Familles en usage sur le texte visible : Meyer Grand ×349, sans-serif ×13. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #d6ceb4, texte #291d1a (contraste 10,39:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #d6ceb4 (42 %), #f4f2e0 (35 %), #484c38 (10 %), #e5e0ca (5 %), #000000 (4 %) ; textes par nombre de caractères : #291d1a (62 %), #f4f2e0 (37 %), #bf8f2d (1 %). Images : 25 `<img>` visibles, 25 fond(s) en image, 0 vidéo(s), `mask-image`/`clip-path` sur 121 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : aucune détectée (window.* et noms de scripts). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `transform 0.35s cubic-bezier(0.65, 0, 0.35, 1)` ×142, `transform 0.45s cubic-bezier(0.65, 0, 0.35, 1)` ×63, `opacity 0.25s ease` ×51, `opacity 0.4s cubic-bezier(0.65, 0, 0.35, 1)` ×51, `animation hero-word-reveal-62bb4c3f 0.75s cubic-bezier(0.65, 0, 0.35, 1)` ×6, `color 0.2s ease` ×6, `background-color 0.4s ease` ×4, `opacity 0.3s ease` ×3, `transform 0.55s cubic-bezier(0.33, 1, 0.68, 1)` ×2, `width 0.5s ease` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 1 bloc(s) de plus d'un écran (`header.relative` 8,6 écrans). Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/meyers-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.hero-primary-content` « DET, VI ARBEJDER MED LIGE NU » (7,4 écrans, 1118 mots, 24 image(s)).
2. L'élément le plus animé : `img.hero-image` (animation animation hero-media-zoom-in-load-62bb4c3f 1.75s cubic-bezier(0.75, 0, 0.2, 1)).
3. Le bloc le plus singulier par sa structure : `div.hero-primary-content` « DET, VI ARBEJDER MED LIGE NU » (seule à contenir <dialog>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« FACEBOOK FACEBOOK FACEBOOK »).
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/6 ordinateur, 0/6 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : oui (bannière cookies, 100 % de l'écran) ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
