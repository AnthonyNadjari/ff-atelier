# Bars Around the World — https://www.experimentalcocktailclub.com/
Titre « Experimental Cocktail Club | Bars Around the World », `lang="en"`, description « Since Paris in 2007, discover Experimental Cocktail Clubs behind discreet doors, from New York to London, Venice & Verbier. », technologie lue : Webflow, jQuery. Démontage automatique du 2026-10-28 (`ff demonter`, mesures brutes dans `experimentalcc.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « From the beginning » ; pas de média plein écran (6 image(s) dans l'écran) ; bouton principal « BOOK NOW » en haut à droite (1290, 18 px, dans une barre fixe, dans la nav) ; 86 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « From the beginning » ; pas de média plein écran (6 image(s) dans l'écran) ; bouton principal « Toggle attribution » en bas à droite (349, 808 px) ; 72 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : non mesuré.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `section.blend-section` « From the beginning » (0,9 écran, 3 mots, 3 img) → `section.section-template` « A story that began in the summer of 200… » (0,2 écran, 58 mots, 0 img) → `div` (8,3 écrans, 1331 mots, 49 img) → `section.section-template` « Nights tucked away behind hidden doors » (0,8 écran, 38 mots, 1 img) → `section.section-template` « Behind the cocktail bar » (1,1 écran, 77 mots, 1 img) → `section.section-template` « LOCATIONS » (1,0 écran, 91 mots, 1 img) → `section.w-variant-1f8997ac-afd0-7164-bc94-88ca93a4bfc3` (0,1 écran, 0 mots, 0 img) → `section.w-variant-dcc84f22-2e96-548d-78f5-6f5994ec867d` (0,6 écran, 22 mots, 1 img) → `footer.footer` (0,4 écran, 29 mots, 1 img).
Pied de page : 12 lien(s) — Experimental Group on Instagram, Experimental Group on LinkedIn, [About], [Map], [Terms of Use], [Work with us], [Cookies], [Contact], [Legal Notice], [Privacy Policy] (+2). Téléphone cliquable : oui (10, tel:+330145088809). Formulaire : 1 (5 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « BOOK NOW » (#), « reservation@chinatownecc.com » (mailto:reservation@chinatownecc.com), « reservation@experimentalcocktailclubnyc. » (mailto:reservation@experimentalcocktailclubnyc.com).
En 3 secondes : à juger sur `captures/experimentalcc-d.webp` (mesuré : fond du premier écran #000000, 6 image(s) et 86 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Nantes**, 36 px / 20 px téléphone, graisse 400, interlignage 1,20, interlettrage 0.18px ; h2 **Nantes**, 36 px / 20 px téléphone, graisse 400, interlignage 1,20, interlettrage 0.18px ; corps **Nantes**, 18 px / 14 px téléphone, graisse 400, interlignage 1,20, interlettrage 0.18px ; boutons **Linux Biolinum**, 16 px / 24 px téléphone, graisse 400, interlignage 1,50, capitales, interlettrage 0.48px ; nav **Linux Biolinum**, 14 px / 16 px téléphone, graisse 400, interlignage 1,07.
Sources `@font-face` : inline (data:) (webflow-icons) ; tiers (cdn.prod.website-files.com) (Nantes, Linux Biolinum) ; locale (Axeptio CJK Fallback) ; tiers (applepay.cdn-apple.com) (apple-wallet-btn-en-US) ; fichiers chargés : https://cdn.prod.website-files.com/6932dc91bcf2019d2c1c5686/6a3d51583d68eab8a8df5e44_693352cc5577295b3d2a096b_LinBiolinum_R.woff2, https://cdn.prod.website-files.com/6932dc91bcf2019d2c1c5686/69335236769cb384d03da148_NantesWeb-Book.woff2, https://cdn.prod.website-files.com/6932dc91bcf2019d2c1c5686/69335236a947dd2183d3e886_NantesWeb-BookItalic.woff2. Familles en usage sur le texte visible : Linux Biolinum ×177, Nantes ×100, -apple-system ×2. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #000000, texte #ffffff (contraste 21,00:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #000000 (83 %), #ffffff (8 %), #dedede (6 %), #954935 (3 %), #00639a (0 %) ; textes par nombre de caractères : #ffffff (96 %), #000000 (4 %). Images : 58 `<img>` visibles, 5 fond(s) en image, 2 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : GSAP (window.gsap), ScrollTrigger (window.ScrollTrigger), jQuery (window.jQuery), Webflow (window.Webflow), Splide (window.Splide). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `opacity 0.2s ease` ×76, `all 0.2s ease` ×8, `color 0.2s ease` ×8, `background-color 0.2s ease` ×8, `opacity 0.75s ease-in-out` ×2, `opacity 0.8s ease` ×1. Scroll lié : ScrollTrigger oui ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/experimentalcc-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div` (8,3 écrans, 1331 mots, 49 image(s)).
2. L'élément le plus animé : `section.section-template` (2 transition(s) : color 0.2s ease ; background-color 0.2s ease).
3. Le bloc le plus singulier par sa structure : `div` (seule à contenir <canvas>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : téléphone cliquable, portes d'action nommées (« BOOK NOW », « reservation@chinatownecc.com », « reservation@experimentalcocktailclubnyc. »), formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 2/7 ordinateur, 2/3 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu (jugé sur les captures, veille du 28 oct 2026, tour 15)

Source : [experimentalcocktailclub.com](https://www.experimentalcocktailclub.com/), captures `captures/experimentalcc-d.webp`,
`-m.webp`, `-planche.jpg` (bannière cookies non bloquante en bas à gauche, non touchée).

- **Polices** : Nantes (serif contemporaine fine) pour les titres et le texte : « LOCATIONS », « Stay in touch » à 64 px (32 au
  téléphone), « Nights tucked away… » à 48 px (24), chapô d'ouverture à 36 px, texte à 18 px (14 au téléphone), interlignage 1,2 ;
  interface (menu, « Book now », adresses) en Linux Biolinum en capitales ; le nom du premier écran est une image (capitales romaines
  et anglaise). Libre : Spectral, une seule famille. L'emphase en italique (« From the *beginning* ») n'est pas reprise.
- **Couleurs** : noir #000000 presque partout, texte et filets blancs, une bande terre cuite #954935 avant le pied ; la carte du monde
  sur gris clair #dedede et le pied blanc hors palette. Régime : sombre.
- **Espacements** : 68 px de marge de section à l'ordinateur, 48 au téléphone ; bord de 30 px (16) ; adresses en trois colonnes de
  447 px écartées de 20 px dans 1 380 px ; environ 50 caractères par ligne.
- **Rayons, bordures, ombres** : angles droits ; « Book now » en pilule à contour blanc d'un pixel (rendue à 6 px chez nous) ; filet
  blanc fin au-dessus de chaque fiche d'adresse.
- **Photos** : premier écran, un portrait vertical étroit (446 x 610 px, 256 x 500 au téléphone), vidéo du barman, centré sur le noir ;
  ensuite des photos verticales 3:4 des bars, lumière chaude sur noir, sans cadre.
- **Boutons et liens** : boutons à contour blanc en capitales, liens en capitales sans soulignement, téléphone et courriel de chaque
  adresse cliquables.
- **Animations** : le nom, fixe et en mélange d'exclusion, descend au tiers du défilement et s'inverse sur le portrait puis sur ce qui
  passe dessous ; la barre de navigation aussi en exclusion ; un intitulé arrive en opacité 0,8 s ease ; survols 0,2 s ease. Profil :
  `nom-en-exclusion` (nouveau, voir `MOUVEMENTS.md`).
- **Textures** : aucune.

## Architecture

Une longue page (13 écrans à l'ordinateur, 20 au téléphone) : chapô, portrait vidéo et nom en exclusion → paragraphe d'ouverture en grand → carte du
monde des adresses → une fiche par bar (photo 3:4, nom, adresse, téléphone, courriel, quelques lignes, « Discover », « Book now ») →
« Nights tucked away behind hidden doors » → « Behind the cocktail bar » → liste des adresses → bande terre cuite et lettre
d'information → pied blanc. « Book now » toujours en haut à droite.

**Convient à** : bar à cocktails, caviste, restaurant du soir, maison à plusieurs adresses (une fiche chacune, téléphone et courriel),
avec des photos sombres et chaudes ; un portrait vertical ou une vidéo du geste pour le premier écran.

**Geste signature** : le nom en exclusion qui glisse sur le portrait vertical et s'y inverse.

**Garde / refuse** : garde le noir, la serif fine en très grand, le portrait vertical, les fiches d'adresse ; refuse la pilule, l'emphase
en italique, le nom en image (à faire en texte réel).
