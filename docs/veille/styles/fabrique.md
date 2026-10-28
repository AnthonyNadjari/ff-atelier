# Fabrique Bakery — https://www.fabrique.co.uk/
Titre « Fabrique Bakery », `lang="en-GB"`, technologie lue : generator « WordPress 7.1.3 », WordPress, jQuery. Démontage automatique du 2026-10-28 (`ff demonter`, mesures brutes dans `fabrique.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; fond en image plein écran (100 % de l'écran) ; bouton principal « X » en haut à droite (1419, 0 px, dans une barre fixe) ; 11 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : calque couvrant 100 % de l'écran (« X STOCKHOLM LONDON NEW YORK ») ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; fond en image plein écran (100 % de l'écran) ; bouton principal « X » en haut à droite (369, 0 px, dans une barre fixe) ; 35 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : calque couvrant 100 % de l'écran (« X STOCKHOLM LONDON NEW YORK ») ; rien ne bouge tout seul.
Nav : 6 lien(s) — Fabrique Bakery, LOCATIONS, CRAFTSMANSHIP, OUR STORY, CONTACT, ORDER ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div#av_section_1` (0,9 écran, 2 mots, 1 img) → `div#av_section_2` « BREAD AND BUTTER IS FOREVER » (0,6 écran, 31 mots, 0 img) → `div#av_section_3` « WHERE TO FIND US » (0,8 écran, 21 mots, 1 img) → `div#backgroundbannercontainer` (0,1 écran, 0 mots, 0 img) → `div#footer-page` « CONTACT » (0,8 écran, 26 mots, 4 img). Calques hors flux (fixes/absolus) : `div#storePopup` (fixed, 900 px, 5 mots), `header#header` (absolute, 118 px, 6 mots).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « ORDER » (https://fabrique.slerp.com/).
En 3 secondes : à juger sur `captures/fabrique-d.webp` (mesuré : fond du premier écran #583e36, 3 image(s) et 11 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 **messinasansweb**, 22 px / 22 px téléphone, graisse 700, interlignage 1,25, capitales, interlettrage 2.64px ; corps **courier**, 16 px / 16 px téléphone, graisse 400, interlignage 1,55, interlettrage 0.8px ; boutons **messinasansweb**, 14 px / 14 px téléphone, graisse 400, interlignage 1,43, interlettrage 1.4px ; nav **courier new**, 13 px / 13 px téléphone, graisse 400, interlignage 6,77.
Sources `@font-face` : auto-hébergée (messinasansweb, entypo-fontello) ; fichiers chargés : https://fabrique.co.uk/wp-content/uploads/sites/2/avia_fonts/type_fonts/messinasansweb/messinasansweb-bold.woff2, https://fabrique.co.uk/wp-content/themes/enfold/config-templatebuilder/avia-template-builder/assets/fonts/entypo-fontello.woff2, https://fabrique.co.uk/wp-content/uploads/sites/2/avia_fonts/type_fonts/messinasansweb/messinasansweb-regular.woff2. Familles en usage sur le texte visible : messinasansweb ×14, courier ×11, Arial ×1. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #583e36, texte #444444 (contraste 1,00:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #fff4e0 (36 %), #583e36 (36 %), #000000 (20 %), #5b3e36 (9 %), #ffffff (0 %) ; textes par nombre de caractères : #141414 (54 %), #fff4e0 (46 %), #000000 (0 %). Images : 4 `<img>` visibles, 3 fond(s) en image, 2 vidéo(s), `mask-image`/`clip-path` sur 1 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery), Locomotive Scroll (attribut data-scroll). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.7s ease` ×12, `background-color 0.4s ease-in-out` ×5, `color 0.4s ease-in-out` ×5, `border-color 0.4s ease-in-out` ×5, `opacity 0.4s ease-in-out` ×3, `all 0.4s ease-in-out` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : `data-scroll-offset` ×1. Ce qui bouge réellement à l'écran : à juger sur `captures/fabrique-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div#av_section_1` (0,9 écran, 2 mots, 1 image(s)).
2. L'élément le plus animé : `a` (3 transition(s) : background-color 0.4s ease-in-out ; color 0.4s ease-in-out).
3. Le bloc le plus singulier par sa structure : `div#av_section_1` (seule à contenir <video>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« ORDER »).
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/2 ordinateur, 0/2 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : oui (calque, 100 % de l'écran) ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu (jugé sur les captures, veille du 28 oct 2026, tour 15)

Source : [fabrique.co.uk](https://www.fabrique.co.uk/), captures `captures/fabrique-d.webp`, `-m.webp` (refaites à la main : la
fenêtre plein écran « choisir sa ville » (`#storePopup`) couvrait la page et a été retirée du DOM, rien n'a été accepté ; les
mesures « h1 29 px STOCKHOLM » du relevé automatique venaient d'elle), `-planche.jpg` (prise avec la fenêtre).

- **Polices** : intitulés en Messina Sans Bold (grotesque) en capitales espacées de 0,12 em, 22 px aux deux largeurs, 16 px dans le
  pied ; tout le texte courant, la navigation et les liens en Courier (chasse fixe de machine à écrire), 16 px, interlignage 1,55,
  interlettrage 0,05 em ; le nom est un logo manuscrit (image), la phrase géante en courbe du bas aussi. Libres : Hanken Grotesk
  (intitulés) et Space Mono (texte : aucune machine à écrire libre au registre).
- **Couleurs** : crème beurre #fff4e0 (73 % des fonds), texte #141414 ; pied entier en brun chocolat #5b3e36, tout en crème dessus.
  Régime : coloré doux (bloc d'encre brun, chroma 0,043 ; fond crème chroma 0,029).
- **Espacements** : 120 px de marge de section à l'ordinateur, 52 px au téléphone ; bord de 26 px au téléphone ; deux colonnes
  (texte, photo) entre 122 et 1 383 px ; colonne de texte d'environ 60 caractères.
- **Rayons, bordures, ombres** : angles droits partout ; ni filet ni ombre.
- **Photos** : vidéo du fournil en pleine largeur au premier écran (le geste du boulanger), puis une grande photo verticale 4:5 de la
  boutique à côté du texte ; photos chaudes prises sur le vif.
- **Boutons et liens** : aucun bouton plein ; les portes (« ORDER », « FIND LOCATION ») sont des mots en capitales soulignés sous le
  texte ; courriels du pied soulignés en Courier.
- **Animations** : rien n'entre ni n'apparaît ; seule la vidéo bouge ; couleurs des liens en 0,4 s ease-in-out. Profil : `video-de-fond`.
- **Textures** : aucune.

## Architecture

Une page courte (3,3 écrans) : vidéo plein cadre avec logo et navigation (Locations, Craftsmanship, Our Story, Contact, Order) →
phrase-devise et paragraphe d'accueil centrés, « ORDER » → « Where to find us », texte et grande photo de la boutique côte à côte,
« FIND LOCATION » → phrase géante en courbe (image) → pied brun : contact, presse, blason de fournisseur de la cour, logo manuscrit,
allergènes, emplois. Pas de téléphone.

**Convient à** : boulangerie, pâtisserie, torréfacteur, glacier qui a une vraie vidéo de son geste (ou `ff animer` sur ses photos) et
peu de texte ; le texte en chasse fixe va aux métiers de fabrication.

**Geste signature** : le texte entier en chasse fixe de machine à écrire sous des intitulés grotesques espacés, sur la crème.

**Garde / refuse** : garde la crème et le pied chocolat, la chasse fixe, les portes en mots soulignés ; refuse la fenêtre plein écran à
l'arrivée et la phrase en image (à faire en texte réel si on la reprend).
