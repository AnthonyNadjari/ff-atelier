# Luxury Hotel on Skye Kinloch Lodge and a world renowned rest — https://www.kinloch-lodge.co.uk/
Titre « Luxury Hotel on Skye Kinloch Lodge and a world renowned restaurant », `lang="?"`, description « Charming and cosy Kinloch Lodge is a hotel and restaurant like no other. Kinloch is a truly unique place in a magical setting, nestled at the foot of Kinloch H… », technologie lue : aucune reconnue. Démontage automatique du 2026-10-28 (`ff demonter`, mesures brutes dans `kinlochlodge.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « Stay » ; vidéo plein écran (100 % de l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 52 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « Stay » ; vidéo plein écran (100 % de l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 49 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : non mesuré.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div#intro` (1,0 écran, 0 mots, 1 img) → `div.topMargin` (1,3 écran, 56 mots, 1 img) → `div.darkGreen` « Stay » (1,3 écran, 38 mots, 1 img) → `div.row` « Dine » (1,5 écran, 68 mots, 2 img) → `div#footer` (0,4 écran, 8 mots, 6 img). Calques hors flux (fixes/absolus) : `div#header` (fixed, 50 px, 38 mots), `div#menu` (fixed, 900 px, 12 mots).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Menu » (#), « Gift Vouchers » (giftvouchers), « Reserve a table » (reserve-table), « Book a room » (https://kinlochios.dbm.guestline.net/availability?hotel=KINLOCHIOS).
En 3 secondes : à juger sur `captures/kinlochlodge-d.webp` (mesuré : fond du premier écran #202723, 3 image(s) et 52 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **latoregular**, 22 px / 22 px téléphone, graisse 400, interlignage 1,18 ; h2 : non mesuré ; corps **latoregular**, 16 px / 16 px téléphone, graisse 400, interlignage 1,25 ; boutons : non mesuré ; nav : non mesuré.
Sources `@font-face` : auto-hébergée (latoregular) ; fichiers chargés : https://kinloch-lodge.co.uk/assets/fonts/lato-regular-webfont.woff2. Familles en usage sur le texte visible : latoregular ×29. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #2b342f (premier écran #202723), texte #ffffff (contraste 12,84:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #2b342f (71 %), #202723 (22 %), #e4e5e5 (7 %), #ad976e (1 %) ; textes par nombre de caractères : #ffffff (76 %), #2c352f (13 %), #808482 (6 %), #202723 (4 %), #959a97 (1 %). Images : 8 `<img>` visibles, 8 fond(s) en image, 1 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : GSAP (window.TweenLite). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `color 0.3s ease-in-out` ×27, `opacity 0.3s ease-in-out` ×4, `right 0.2s ease-in-out` ×4. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/kinlochlodge-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.row` « Dine » (1,5 écran, 68 mots, 2 image(s)).
2. L'élément le plus animé : `a#bannerBtn` (1 transition(s) : color 0.3s ease-in-out).
3. Le bloc le plus singulier par sa structure : `div#intro` (seule à contenir <video>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« Menu », « Gift Vouchers », « Reserve a table », « Book a room »).
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/0 ordinateur, 0/0 téléphone ; vidéo en premier écran : oui ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu (jugé sur les captures, veille du 28 oct 2026, tour 14)

Source : [kinloch-lodge.co.uk](https://www.kinloch-lodge.co.uk/), captures `captures/kinlochlodge-d.webp`, `-m.webp`, `-planche.jpg`.

- **Polices** : une seule famille, Lato Regular 400 (auto-hébergée) ; intitulés « Stay », « Dine », « Experience » 22 px aux deux largeurs, interlignage 1,18, casse normale ; texte 16 px, interlignage 1,25 ; nav 13 px ; monogramme « k » et nom espacé en image. Libre : Cabin pour tout (concordance).
- **Couleurs** : vert de tourbe #2b342f (68 % des fonds), vert plus sombre #202723 en alternance, blanc #ffffff pour le texte, gris lichen #959a97 pour les liens et légendes, ocre de varech #ad976e pour le bandeau d'annonce du bas (texte sombre dessus) ; en-tête blanc cassé #e4e5e5 à l'ordinateur. Régime : sombre (L 0,31).
- **Espacements** : sections de 80 px aux deux largeurs ; bord de 14 px au téléphone (photos presque bord à bord) ; colonnes écartées de 50 px ; conteneur 1 307 px ; paragraphes courts posés à droite d'un intitulé à gauche.
- **Rayons, bordures, ombres** : 0, aucune, aucune.
- **Photos** : vidéo plein écran du loch au premier écran, monogramme blanc centré ; ensuite grandes photos sans cadre en décalé (un portrait vertical à côté d'un paysage, une photo qui déborde d'une section sur la suivante) ; lumière froide et nette.
- **Boutons et liens** : aucun bouton plein ; « More → » en gris, « Reserve a table » et « Book a room » en texte dans l'en-tête ; menu à trois traits qui ouvre un panneau latéral (right 0,2 s).
- **Animations** : photos chargées en différé qui apparaissent en fondu d'opacité 0,3 s ease-in-out ; liens en couleur 0,3 s ease-in-out ; rien ne glisse, rien de calé sur le défilement. Profil : `fondu-sobre`.
- **Textures** : aucune ; deux verts en sections alternées.

## Architecture

Accueil de 4,5 écrans : vidéo plein écran + monogramme → présentation (photo verticale à gauche, paragraphe à droite, « More ») → « Stay » sur vert sombre avec grande photo de la maison → « Dine » et « Experience » en deux colonnes, chacune sa photo → paire de photos (table dressée, guide de pêche) → pied minimal (Instagram, Facebook, crédit). Nav : Gift Vouchers, Packages, Reserve a table, Book a room en haut à droite ; pas de téléphone cliquable sur l'accueil (à ajouter pour un client, GOUT § 0). Bandeau d'annonce ocre fixe en bas, refermable (il ne bloque pas la page).

**Convient à** : gîte, chambre d'hôtes, hôtel-restaurant, table de campagne, guide de pêche ou de montagne, avec des photos de paysage et de lieu nettes ; client « calme ». Le bandeau ocre convient à `annonce` (fermeture de saison).

**Geste signature** : les photos sans cadre posées en décalé qui débordent d'un vert sur l'autre.

**Garde / refuse** : garde les deux verts de tourbe, l'ocre rare, les photos décalées ; refuse l'absence de téléphone et le texte de 13 px de la nav.
