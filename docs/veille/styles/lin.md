# Fraher — http://fraher.co/
Titre « Fraher », `lang="en-GB"`, description « RIBA-chartered architects with in-house construction and bespoke joinery. Whole-house refurbishments, heritage projects and new builds across London. », technologie lue : Squarespace, jQuery. Démontage automatique du 2026-10-29 (`ff demonter`, mesures brutes dans `lin.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « We are architects, designers, builders and you are » ; pas de média plein écran (2 image(s) dans l'écran) ; bouton principal « Skip to Content » en haut à gauche (-16000, 24 px, dans une barre fixe, dans la nav) ; 14 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « We are architects, designers, builders and you are » ; pas de média plein écran (2 image(s) dans l'écran) ; bouton principal « Play » en bas à droite (306, 763 px) ; 15 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 2 lien(s) — [Skip to Content], [Open Menu] ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `section.white-bold` « We are architects, designers, builders … » (0,8 écran, 9 mots, 0 img) → `section.page-section` (1,2 écran, 7 mots, 1 img) → `section.dark` « The buildings and structures you see on… » (0,8 écran, 52 mots, 0 img) → `section.page-section` (0,1 écran, 113 mots, 0 img) → `section.white-bold` « We have designed homes for many familie… » (1,2 écran, 33 mots, 1 img) → `section.page-section` (0,1 écran, 113 mots, 0 img) → `section.black-bold` « We roll up our sleeves, we strive for e… » (0,8 écran, 38 mots, 1 img) → `section.page-section` (0,1 écran, 113 mots, 0 img) → `section.page-section` « We understand that the design of workpl… » (0,9 écran, 35 mots, 1 img) → `section.page-section` (0,1 écran, 113 mots, 0 img) → `footer#footer-sections` (0,3 écran, 9 mots, 2 img). Calques hors flux (fixes/absolus) : `header#header` (fixed, 146 px, 5 mots).
Pied de page : 6 lien(s) — Privacy Policy, Cookie, Instagram, Facebook, LinkedIn, YouTube. Téléphone cliquable : oui (1, tel:+4402083145221). Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Open Menu » (), « Facebook » (https://www.facebook.com/fraherco/).
En 3 secondes : à juger sur `captures/lin-d.webp` (mesuré : fond du premier écran #3d3d3f, 2 image(s) et 14 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **LEKISKAL-REGULAR**, 45 px / 33 px téléphone, graisse 400, interlignage 1,26 ; h2 **LEKISKAL-REGULAR**, 35 px / 27 px téléphone, graisse 400, interlignage 1,29 ; corps **BOLTON**, 23 px / 20 px téléphone, graisse 400, interlignage 1,30 ; boutons **BOLTON**, 16 px / 16 px téléphone, graisse 400 ; nav **BOLTON**, 16 px / 16 px téléphone, graisse 400.
Sources `@font-face` : tiers (file.squarespace-cdn.com) (Roboto) ; fichiers chargés : https://file.squarespace-cdn.com/content/v2/namespaces/fonts/libraries/sqsp/assets/74534a3f-2c12-4fac-b36b-7d5fffdca709/latin.woff2. Familles en usage sur le texte visible : BOLTON ×16, LEKISKAL-REGULAR ×8, Clarkson ×7. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #3d3d3f, texte #f4f4ee (contraste 9,82:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #3d3d3f (48 %), #f4f4ee (36 %), #a9c2bb (10 %), #e8dbc0 (6 %), #000000 (0 %) ; textes par nombre de caractères : #3d3d3f (89 %), #000000 (5 %), #e7e7e7 (3 %), #ffffff (2 %), #a9c2bb (1 %). Images : 5 `<img>` visibles, 1 fond(s) en image, 1 vidéo(s), `mask-image`/`clip-path` sur 5 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.3s ease` ×5, `background-color 0.1s linear` ×4, `color 0.1s linear` ×4, `box-shadow 0.3s ease` ×2, `background 0.14s ease-in-out` ×1, `transform 0.14s ease-in-out` ×1, `padding 0.14s ease-in-out` ×1, `opacity 0.5s ease` ×1, `all 0.8s ease` ×1, `opacity 0.4s ease-in-out` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : `data-animation-role` ×11, `data-animation` ×11. Ce qui bouge réellement à l'écran : à juger sur `captures/lin-planche.jpg`.

## Construction

Relevé sur captures pleine page (1 440 et 390 px, regardées le 29 oct 2026) et sur le DOM calculé. Fond de page papier
#f4f4ee, texte #3d3d3f partout, aucun rayon, aucune ombre, aucune carte : la page est faite de bandes pleine largeur
empilées, et de texte posé dans du vide. Accueil, dans l'ordre :

1. **Barre** (146 px, fixe, papier) : monogramme au trait à gauche, trois traits de menu à droite, rien d'autre ; elle se
   resserre au premier cran (classe `shrink`, padding 0,14 s). Ni téléphone ni bouton.
2. **Premier écran, la phrase** : une seule phrase de quatre lignes courtes, **centrée**, serif de livre 45 px (33 px au
   téléphone), interlignage 1,26, graisse normale, colonne de ~20 caractères ; la dernière ligne est le nom en grotesque
   capitale espacée, plus petite. Elle flotte seule au milieu d'un vide de papier qui tient **720 px sur 900** à
   l'ordinateur (80 % de l'écran ; 675 sur 844 au téléphone). Échelle titre / texte : 45 / 23 px, soit 2 : le titre n'est
   pas « gros », c'est le vide qui le fait lire.
3. **Bande film** : vidéo pleine largeur 16:9 (1 440 × 810), sans marge ni voile, dont on ne voit au chargement que le
   haut (180 px) ; monogramme blanc au centre et « Click for FRAHER Film » en serif italique en bas ; la lecture se lance
   au clic, avec les commandes natives (barre de progression, son, plein écran). Rien ne joue tout seul.
4. **Panneau sable** (#e8dbc0, pleine largeur, ~0,8 écran) : deux paragraphes en serif 23 px (20 px téléphone)
   interlignage 1,3, dans la **colonne gauche de 37 %** (marge gauche 100 px) ; la moitié droite du panneau reste
   **vide**. Pas de titre : le texte est le manifeste.
5. **Bloc métier 1, sur le papier** : grille 12 colonnes ; à gauche (5/12) une **étiquette en petite grotesque sur deux
   lignes** (« House Design / Residential », 16 px), un vide de ~80 px, un paragraphe serif 23 px, puis le **lien entre
   deux filets** (texte capitale 12,5 px, filet 1 px dessus et dessous, aucun bord de côté, 196 px de large) ; à droite
   (6/12, collée au bord droit du cadre), une **photo verticale 2:3** de 620 × 970 px qui dépasse la hauteur du texte de
   moitié. Photo nue : ni cadre, ni ombre, ni arrondi.
6. **Bloc métier 2, panneau sauge** (#a9c2bb, pleine largeur) : même colonne gauche (étiquette, paragraphe, lien), mais la
   photo est **paysage 16:9 posée dans le panneau**, centrée verticalement sur le texte (7/12 à droite).
7. **Bloc métier 3, sur le papier** : comme le bloc 1 (photo verticale à droite).
8. **Pied** : trois colonnes de liens en grotesque 16 px (politique, réseaux), « ©FRAHER 2009–26 », les deux labels
   professionnels à droite ; aucun bandeau sombre.

Au téléphone, tout s'empile dans l'ordre : étiquette, paragraphe, photo à la largeur du cadre (marge 23 px), lien centré
sous la photo. Le rythme est celui des **fonds de bande** (papier, film, sable, papier, sauge, papier), jamais de cartes.

## Le geste signature

**Les bandes de métier en panneaux de couleur pleine largeur** : chaque offre est une bande de bord à bord dont le fond
tourne entre le papier, le sable et la sauge ; l'offre se dit en une phrase de grand corps, sous une étiquette de deux
lignes en petite grotesque, avec un seul lien entre deux filets, et SA photo prend la moitié droite (verticale sur le
papier, paysage dans la sauge). Codé : `src/sections/Services/lin.astro` (un panneau par service : papier, sable `bg-2`,
sauge = accent fondu dans le papier ; étiquette = nom du service + prix « à partir de » ; phrase = `short` ; photo =
`services[].image`). Le premier écran (phrase seule dans le vide, bande photo qui monte du bas) : `src/sections/Hero/lin.astro`.

## Ce qu'on garde / ce qu'on refuse
Garde : le vide de premier écran (la phrase seule), la bande photo pleine largeur sans voile, les panneaux de couleur
pleine largeur par offre, le serif de lecture en grand corps pour le texte, le lien entre deux filets, la page immobile
et le film lancé par le visiteur. Mesuré et utile à l'usine : téléphone cliquable (pied), aucun autoplay.
Refuse : l'emphase en italique (« and *you* are », « *You.* ») et le nom en capitales espacées (signes IA, GOUT § 2 : le
nom devient « métier à ville » en grotesque, casse normale) ; la barre sans téléphone (socle GOUT § 0 : nav `minimal`
avec la porte Appeler, et « Appeler le … » sous la phrase) ; les liens en capitales espacées (casse normale).
Polices : Lekiskal et Bolton (non libres) -> Literata ; Clarkson -> Hanken Grotesk.
Régime de palette : papier mesuré #f4f4ee (chroma OKLCH 0,008, au bord du neutre), réchauffé à #f3f1e7 (0,013) dans la
direction ; sable #e8dbc0 et sauge #a9c2bb en bandes : clair teinté doux.

## Preuve (29 oct 2026)

Site jetable `_test-style-lin` (copie de `_exemple`, photos d'illustration `ff photos-demo`), `ff melanger --style lin` :
comparaison [source](captures/lin-source.jpg) / [essai](captures/lin-essai.jpg). La construction tient : phrase seule
centrée dans le vide, bande photo qui monte du bas du premier écran, présentation sur sable, panneaux de service papier /
sable / sauge avec photo verticale ou paysage à droite, liens entre deux filets. `ff verifier` vert hors données de test,
`ff ia` vert, `ff ressemblance` 0,63 au plus (déroulé, demo-coiffure), premier écran 0,46 au plus. Ajustements faits à
l'essai : encre #3d3d3f foncée en #2a2a2c et bande d'encre #242426 (horaires à 72 % d'opacité sous AA), accent sauge
assombri (lien « Voir sur Google Maps » sur sable), ordre du modèle (galerie avant zones, appel puis contact, questions
en dernier) pour sortir du déroulé de forge-delacroix et demo-boulangerie.
