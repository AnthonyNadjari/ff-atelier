# Pizza Amici — https://www.pizza-amici.nl/
Pizzas napolitaines en foodtruck pour événements, Den Haag (Pays-Bas). Awwwards Honorable Mention du 5 juillet 2026 (awwwards.com/sites/pizza-amici). Webflow (variables `--_colors---swatch--*`), GSAP + ScrollTrigger + Lenis + Swiper.

## Squelette
Bandeau bleu marine au sommet (« 3000+ cateringen », note Google 4.6, « 480-600 pizza's per uur »), puis nav en étiquette blanche à coins encochés avec le gros bouton jaune « Boek een truck » détaché à droite ; sur téléphone : trois étiquettes « Boeken / logo / Menu ». Ordre : photo de l'équipe derrière le comptoir du camion (cadrée plein large, sous l'auvent rayé) avec le H1 dans une **étiquette hexagonale** posée dessus, photos à bord dentelé (timbres) à gauche, carte bleue de texte + bouton à droite → logos clients → « Ciao! » (histoire des trois amis, signée) → **une carte par camion** : nom, photo, pizzas par heure, dimensions (« 275 pizza's per uur », « 7 x 2,5 m ») → « Hoe het werkt » : 4 étapes en tickets inclinés sur un fil → rubans de distinctions (« Delftse ondernemersprijs 2025 ») → avis → avantages en liste → recrutement (« 97 teamleden », « SBB erkend leerbedrijf ») → pied marine.
Contact : tel, mailto, itinéraire Google Maps vers l'adresse, dans le pied ; le premier écran pousse « Boek een truck ».
En 3 secondes : cinq types en marinière devant leur camion, « Huur een pizza foodtruck op locatie », 4.6 étoiles.

## Typographie
Lues dans le CSS : titres **salo-variable** (Adobe Fonts, kit `rkx3xqp`), H1 66 px ordinateur / 48,9 px téléphone, interlignage 0,78, interlettrage -0,015 em, capitales, condensée. Corps **Azeret Mono** 12-13 px. Boutons **Awesome Serif** Italic Extra Tall (`AwesomeSerifItalic-BdExraTall.woff2`). Apartés manuscrits **La Belle Aurore** (« De snelste foodtruck van Nederland! »). Quatre familles, chacune avec un rôle fixé dans les variables (`--_fonts---fonts--heading/paragraph/button/handwritten`).

## Couleur et matière
Variables lues : fond `#F2EDE9` (off-white), marine `#0F2C56` (texte, bandeau, pied), bleu clair `#C0DEEE` (cartes), or `#E3AF04` (boutons), brun `#4F3C2C` et `#2F241A` (section étapes), vert `#128643` et rouge `#C72531` (le drapeau du logo). Thèmes de section par variable (`--_theme---background`). Photos réelles de l'équipe et des camions, bords de timbre dentelés, pizza détourée dans un plat à bord en damier, tickets en SVG (`tag-card-border`, `section-border-svg` 1920×31 pour les ruptures de section).

## Mouvement
GSAP + ScrollTrigger + Lenis (scripts lus), Swiper pour les camions. Courbes CSS lues : `cubic-bezier(.175,.885,.32,1.275)` ×11 (rebond « back-out » sur les boutons, `transform .35s`), `cubic-bezier(.19,1,.22,1)` ×9 (expo-out), `cubic-bezier(.525,0,0,1)` 0,45 s. Les étapes en tickets bougent au défilement (inclinaison différente sur deux vignettes de la planche) ; vidéo HLS (bunny CDN) plus bas.

## Le geste signature
La fiche technique de chaque camion (pizzas par heure, dimensions au sol) en carte d'étiquette : le client sait si ça rentre dans sa cour. Chez nous : bloc sur mesure `Camions.astro` (ou `Services/cards-hover` étendu d'un `<dl>` de mesures), bordure ticket en SVG ou `corner-shape: notch` (A11) ; pas d'animation.

## Ce qu'on garde / ce qu'on refuse
Garde : les chiffres d'exploitation vrais en bandeau (cadence, nombre de prestations) quand le client les fournit ; une carte par équipement avec ses mesures ; un rôle par police déclaré en variables ; les ruptures de section en SVG pleine largeur.
Refuse : photos en timbres inclinés (proches des polaroids inclinés, GOUT § 2) ; quatre polices dont un mono à 12 px pour le corps (lisibilité téléphone) ; le rebond `back-out` sur chaque bouton ; badges « 3000+ » en hexagone (badge de chiffre, GOUT § 2).
