# BCG Building Design — https://bcgbuildingdesign.com.au/
Titre « Building Designer Gold Coast | BCG Building Design », `lang="en"`, description « Boutique building design studio in Gold Coast crafting high-end custom homes and major renovations, personally led from concept to construction. », technologie lue : generator « Webflow », Webflow, jQuery. Démontage automatique du 2026-10-29 (`ff demonter`, mesures brutes dans `enduit.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « Building Designer Gold Coast » ; image plein écran (100 % de l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 23 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : calque couvrant 98 % de l'écran («  ») ; bouge tout seul sans défilement : 6 élément(s) (`div.nav-logo-el`, `div.text-size-tiny`, `div.preloader`, `div.line`).
Téléphone (390x844) : h1 « Building Designer Gold Coast » ; image plein écran (100 % de l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 23 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : calque couvrant 56 % de l'écran («  ») ; bouge tout seul sans défilement : 4 élément(s) (`div.nav-logo-el`, `div.preloader`, `div.line`).
Nav : 5 lien(s) — go to home page , Studio, Process, Projects, Project Enquiry ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `section.section` « Building Designer Gold Coast » (1,0 écran, 14 mots, 1 img) → `section.section-brown` (1,1 écran, 70 mots, 1 img) → `section.section-beidge` « Featured Works » (1,3 écran, 30 mots, 1 img) → `section.section_approach` « Thoughtful home design requires everyon… » (1,1 écran, 66 mots, 1 img) → `section.section_words` « Client Words » (1,1 écran, 88 mots, 2 img) → `footer#w-node-cd50c325-c607-fb29-48f4-1b9a966a37a0-966a37a0` « Tell us about your project » (0,6 écran, 43 mots, 0 img). Calques hors flux (fixes/absolus) : `div.page-transition-overlay` (fixed, 900 px), `nav.navbar` (fixed, 40 px, 9 mots), `section.section` (sticky, 2250 px, collé en bas, 53 mots).
Pied de page : 14 lien(s) — Instagram, Facebook, Linkedin, ArchiPro, 0409 970 841, enquiries@bcgbuildingdesign.com.au, [Enquire about your project here Enquire ], Home, Studio, Projects (+4). Téléphone cliquable : oui (1, tel:0409970841). Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Facebook » (https://www.facebook.com/BCGBuildingDesign).
En 3 secondes (vu sur `captures/enduit-d.webp` et `-m.webp`) : une maison blanche enduite au crépuscule en plein écran, une phrase blanche en bas à gauche, une barre de 40 px presque invisible ; on sait qu'on est chez un concepteur de maisons haut de gamme avant d'avoir lu un mot. Le calque bloquant mesuré est le préchargement (logo et filet qui se remplit), refusé.

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **NeueHaasDisplay Pro**, 16 px / 14 px téléphone, graisse 500, interlignage 0,90 ; h2 **NeueHaasDisplay Pro**, 40 px / 20 px téléphone, graisse 600, interlignage 1,00 ; corps **NeueHaasDisplay Pro**, 16 px / 14 px téléphone, graisse 600, interlignage 1,20 ; boutons **NeueHaasDisplay Pro**, 16 px / 14 px téléphone, graisse 600, interlignage 1,20 ; nav **NeueHaasDisplay Pro**, 14 px / 14 px téléphone, graisse 600, interlignage 1,20.
Sources `@font-face` : inline (data:) (webflow-icons) ; tiers (cdn.prod.website-files.com) (NeueHaasDisplay Pro, Neuehaasgrottext 65 Trial, Neuehaasgrottext 75 Trial, Neuehaasgrottext 55 Roman Trial) ; fichiers chargés : https://cdn.prod.website-files.com/6a794e5aeebba97e3ac774ae/6a7ab661fa9b2e29fc329308_NeueHaasDisplayMediu.ttf, https://cdn.prod.website-files.com/6a794e5aeebba97e3ac774ae/6a7ab661ad134627fc9c80ef_NeueHaasDisplayBold.ttf. Familles en usage sur le texte visible : NeueHaasDisplay Pro ×97. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #f3efe8, texte #3a3028 (contraste 11,22:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #f3efe8 (54 %), #3a3028 (25 %), #000000 (15 %), #0a0a0a (6 %), #fffdf8 (0 %) ; textes par nombre de caractères : #3a3028 (74 %), #fffdf8 (26 %). Images : 7 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s), `mask-image`/`clip-path` sur 3 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : GSAP (window.gsap), ScrollTrigger (window.ScrollTrigger), Lenis (window.Lenis), Barba (window.barba), jQuery (window.jQuery), Webflow (window.Webflow). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `opacity 0.2s ease` ×32, `transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)` ×20, `opacity 0.3s ease` ×17, `transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)` ×8, `transform 0.3s ease` ×1. Scroll lié : ScrollTrigger oui ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 2 bloc(s) de plus d'un écran (`section.section` 8,8 écrans, `div.horiz_sticky` 2,5 écrans). Attributs de mouvement : `data-split` ×4, `data-hero-split` ×1, `data-horiz-split` ×1. Ce qui bouge réellement à l'écran : à juger sur `captures/enduit-planche.jpg`.

## Construction

Relevé sur les captures pleine page (1 440 et 390 px, regardées le 29 oct 2026 avec l'outil Read : `captures/enduit-planche.jpg`,
`enduit-d.webp`, `enduit-m.webp`, plus une série de captures à la molette tous les 700 px) et sur le DOM calculé. Fond crème
#f3efe8 partout sauf une bande brune #3a3028 ; une seule grotesque en graisse moyenne ; aucun rayon, aucune ombre, aucune
carte ; **pas de conteneur** : tout va de bord à bord avec une gouttière de 22 px. Accueil, dans l'ordre :

1. **Barre** (40 px, fixe, transparente sur la photo puis sur le crème) : le monogramme « BCG® » à gauche, l'heure locale et
   « Gold Coast, AU », trois liens (Studio, Process, Projects) au centre, « Project Enquiry » à droite, tout en 14 px. Au
   téléphone : le monogramme et une petite plaque brune « Menu » (rayon 4 px).
2. **Premier écran, la photo** : la maison au crépuscule **plein écran** (100 % de l'écran, téléphone et ordinateur), sans
   voile ; en bas à gauche, à 22 px des bords, la phrase en grotesque 500 de 40 px (26 px au téléphone), blanche, deux lignes,
   interlignage 1,0. Rien d'autre : ni bouton, ni numéro, ni note.
3. **La phrase et sa photo** : une ligne d'étiquettes en 14 px (« Our Studio » à gauche, « BCG » à droite) puis deux moitiés
   d'écran : à gauche la phrase de l'agence (34 px, centrée dans sa moitié, colonne de ~22 caractères), à droite une photo
   d'intérieur **bord à bord jusqu'au bord droit de l'écran**, sur toute la hauteur du bloc (un écran). La source fait ensuite
   glisser ce bloc à l'horizontale au défilement (piste épinglée de 2,5 écrans) pour découvrir un paragraphe ; refusé (déjà
   `piste-horizontale`, et lourd sur iPhone).
4. **La bande brune au nom géant** (1,1 écran) : petite photo verticale en haut à gauche (3/12), deux paragraphes de 16 px dans
   la colonne de droite (de 8 à 11 sur 12) et « Learn More » posé sur un filet crème avec une flèche ; en bas, le monogramme
   « BCG® » en lettres crème de ~320 px de haut, collé au bord gauche, qui monte lettre par lettre de sous sa ligne à l'entrée.
5. **« Featured Works », l'index** (1,3 écran, le geste signature) : étiquette en 14 px, puis six lignes pleine largeur sur des
   filets (numéro 01 à 06, nom de la maison à gauche, type « Renovation » / « New Build » à droite) ; les lignes inactives sont
   à 40 % d'opacité ; **au milieu de la liste et par-dessus les filets**, une photo verticale 4:5 (~28 % de la largeur) qui
   déborde la liste en haut et en bas : survoler une ligne montre SA photo et trace son filet actif. Au téléphone : une photo
   pleine largeur par réalisation, avec sa ligne dessous, en pile.
6. **« Our Approach »** : grand titre de deux lignes (34 px) à gauche, sous lui une photo d'intérieur sur 2/3 de la largeur, et
   dans la colonne de droite un paragraphe et « Learn More » sur son filet.
7. **« Client Words »** : petite photo verticale à gauche (3/12, posée en bas), au milieu l'avis en 16 px et son auteur (nom,
   ville en second plan), « View Project », le compteur « 01 / 02 » et « Prev / Next » ; à droite une grande photo verticale
   (5/12) qui monte plus haut que le texte.
8. **Pied sur le crème** : sous un filet, réseaux, téléphone et e-mail en 14 px, « Tell us about your project » (28 px) avec
   « Enquire about your project here » sur un filet ; puis le monogramme **brun géant** sur le crème (~360 px), la nav et la
   ville à droite, la ligne des mentions.

Échelles : phrase du premier écran 40 / texte 16 px (2,5) ; nom géant ~20 fois le texte. Le vide est horizontal (colonnes
étroites dans toute la largeur), jamais une marge de conteneur. Au téléphone tout s'empile dans le même ordre.

## Le geste signature

**L'index dont la ligne survolée montre sa photo** : une liste pleine largeur de lignes filetées (numéro, nom, type) avec,
au milieu et par-dessus, une photo verticale qui change selon la ligne survolée ; la ligne active passe à l'encre pleine et
son filet se trace. Codé : `src/sections/Services/enduit.astro` (une ligne par service : numéro, `title`, `priceFrom` ou
« Voir » ; la photo du milieu = `services[].image`, fondu 0,4 s à la courbe de la source ; au téléphone, chaque ligne sous SA
photo, sans script ; sous l'index, le bloc « approche » avec la prestation phare `featured` qui a une photo et un texte long).
Profil de mouvement `index-qui-change-la-photo` (MOUVEMENTS.md), qui porte aussi le nom géant qui monte lettre par lettre
(`src/sections/About/enduit.astro`).

## Ce qu'on garde / ce qu'on refuse
Garde : la photo plein cadre et la phrase seule en bas à gauche, la phrase centrée à côté de sa photo bord à bord, la bande
brune au nom géant, l'index à photo centrale, l'avis entre deux photos, le pied crème au nom géant brun, l'absence de
conteneur, la grotesque unique en graisse moyenne, les liens sur filet à flèche. Mesuré et utile à l'usine : téléphone
cliquable (pied).
Refuse : le préchargement plein écran (calque à 98 % de l'écran à l'arrivée), la section qui glisse à l'horizontale au
défilement (GSAP épinglé), l'heure locale dans la barre (gadget), les lignes à 40 % d'opacité (sous AA : l'usine prend
`--muted`), le premier écran sans téléphone (socle GOUT § 0 : nav `minimal` avec la porte, « Appeler le … » posé sur la
photo avec la porte Devis), la barre basse (`actionBar: false`).
Polices : Neue Haas Display (non libre) -> Host Grotesk (une seule famille, comme la source).
Régime de palette : crème #f3efe8 mesuré (chroma OKLCH 0,010, au bord du neutre) réchauffé à #f3ede4 (0,014) ; un seul brun
#3a3028 en bande et en texte : clair teinté doux.

## Preuve (29 oct 2026)

Site jetable `_essai-styleb-enduit` (copie de `_exemple`, `// DEMO`, « Maisons Vasseur, constructeur de maisons », trois
prestations, photos d'illustration `ff photos-demo` : Wikimedia, faibles pour des maisons), `ff melanger --style enduit` :
comparaison [source](captures/enduit-source.jpg) / [essai, source à gauche](captures/enduit-essai.jpg). Tient : la photo plein
cadre et la phrase en bas à gauche, la phrase centrée à côté de sa photo bord à bord, la bande brune et le nom géant (deux
lignes pour un nom de deux mots), l'index à photo centrale (pile de photos au téléphone), le bloc approche, l'avis entre
deux photos, le pied crème au nom géant brun, toute la largeur avec 16 à 28 px de gouttière. Écarts voulus : le premier écran
ne tient que les deux tiers de l'écran à l'ordinateur et les trois quarts au téléphone (tout en photo, il était à 0,73 et
0,89 de forge-delacroix, chez-malo et maison-aurore au `ff ressemblance`), et porte « Appeler » et Devis (socle). `ff verifier`
vert hors données de test (a11y sans violation), `ff ia` sans signe bloquant (numérotation 01 à 03 de l'index signalée, celle
de la source), `ff nettete` vert ; `ff ressemblance` : téléphone 0,57, ordinateur 0,63, déroulé 0,62 au plus (avec trois
prestations ; à quatre, le déroulé dépassait 0,65 contre neuf sites : le poids « site » du déroulé, déjà relevé au tour 17).
