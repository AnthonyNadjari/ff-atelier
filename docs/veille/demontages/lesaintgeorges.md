# Le Saint Georges — https://lesaintgeorges.ch/
Hôtel-restaurant de 14 chambres (texte du site), Gruyères (Suisse romande). Awwwards Nominee du 25 août 2026 (awwwards.com/sites/le-saint-georges). WordPress + thème Divi (scripts `wp-content/themes/Divi`), vidéo du hero datée `2026/08` dans son chemin.

## Squelette
En-tête fixe sur deux étages : écusson rond à gauche, nom « Le Saint Georges / Gruyères » centré, « Réserver » encadré + langue à droite, puis la ligne des rubriques (Chambres & Suites, Restaurant, Mariages & Occasions, Réunions, Activités, Galerie, Offres) sous un filet. Téléphone : écusson, nom, burger. Le contact est **dans le premier écran** : sous le bouton « Réserver une chambre », le téléphone et l'e-mail en clair (tel:+41269218300, mailto), puis répétés dans le pied. Ordre : vidéo plein écran de la façade → H1 « Le charme d'un séjour authentique à Gruyères » → une rubrique par activité en alternance texte/photo (Chambres, Restaurant, Mariages, Réunions) → offres en cartes photo → « Gruyères » + **plan illustré du village avec légende numérotée** → « Notre fondue moitié-moitié championne du monde » (fromager nommé) → Instagram → frise dessinée du village → pied en 5 colonnes + labels.
En 3 secondes : la vraie façade, le nom de la rue, le téléphone.

## Typographie
Lues dans le CSS : titres en **Lora** Regular (`"Lora Regular"`, auto-hébergée) 36 px ordinateur / 28 px téléphone, graisse 500, interlignage 1,2, casse normale, couleur `#472300`. Corps en **Avenir Next** (Regular/Medium/Demi, auto-hébergées) 18 px. Bellefair déclarée en `@font-face`. Boutons en capitales espacées. Rien de rare côté typo : c'est le contenu qui porte.

## Couleur et matière
Fond blanc `#fff`, texte noir, titres et boutons brun chocolat `#472300` (51 occurrences), bande beige sous les offres (non lu en hex). Photos réelles, nombreuses : chambres, salles, fondue, fromager, terrasse. Frise et plan du village dessinés à la main (illustrations au trait, couleurs douces).

## Mouvement
Presque rien : vidéo MP4 en fond du hero (`video_le-saint-georges_08.2026.mp4`), carrousels Swiper (plugin dg-carousel), transitions Divi (`all .2s ease`, `cubic-bezier(.645,.045,.355,1)` lu). Pas de GSAP, pas de Lenis. Widget Elfsight (chatbot IA + flux Instagram).

## Le geste signature
Le plan illustré du village avec légende numérotée (château, musées, l'hôtel, la chocolaterie, l'office du tourisme, l'arrêt de bus, les parkings) : on sait où garer avant d'arriver. Chez nous : bloc sur mesure `sites/<slug>/sections/Plan.astro` (SVG ou illustration fournie + liste `<ol>` reliée par `aria-describedby`), prolongement de `Zones/map` ; aucune animation nécessaire, `data-draw-svg` au plus pour les chemins.

## Ce qu'on garde / ce qu'on refuse
Garde : téléphone et e-mail lisibles sous le bouton du hero ; le plan du lieu avec parkings et arrêt de bus ; un fait de métier vérifiable en titre (« fondue championne du monde », le fromager nommé) ; la frise dessinée du lieu en pied de page.
Refuse : Lora (police IA, GOUT § 2) ; le chatbot IA flottant et sa pastille rouge (bruit, rien d'humain) ; la vidéo de fond (iOS économie d'énergie, CLAUDE.md § Pièges) ; boutons en capitales espacées (GOUT § 2).
