# Bar Kumiko — https://barkumiko.com/
Titre « Bar Kumiko — Japanese Dining Bar in Chicago's West Loop », `lang="en"`, description « Kumiko is a Japanese dining bar in Chicago's West Loop where food, drink, and hospitality are treated with equal reverence. Open Wednesday–Sunday, 5:30pm–12am. », technologie lue : generator « Webflow », Webflow, jQuery. Démontage automatique du 2026-10-28 (`ff demonter`, mesures brutes dans `barkumiko.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « kumiko » ; image plein écran (90 % de l'écran) ; bouton principal « Show photo 1 » en bas au centre (618, 852 px) ; 25 mots visibles au-dessus du pli ; aucune couche bloquante ; bouge tout seul sans défilement : 1 élément(s) (`section#welcome`).
Téléphone (390x844) : h1 « kumiko » ; image plein écran (91 % de l'écran) ; bouton principal « Show photo 1 » en bas à gauche (93, 796 px) ; 19 mots visibles au-dessus du pli ; aucune couche bloquante ; bouge tout seul sans défilement : 1 élément(s) (`section#welcome`).
Nav : 7 lien(s) — [SKIP TO MAIN CONTENT], Kumiko home, SHOP, ABOUT, CONTACT, CAFÉ, [RESERVE] ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `main#main` « kumiko » (3,0 écrans, 86 mots, 7 img) → `footer.footer-bar` (0,5 écran, 57 mots, 1 img). Calques hors flux (fixes/absolus) : `nav.nav-bar` (sticky, 88 px, 10 mots).
Pied de page : 10 lien(s) — Menu, Reserve, About, Our Story, Contact, Café, Bottled Cocktails, For the Home, Gift Cards, hospitality@barkumiko.com. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « RESERVE » (/reserve), « Menu » (/dining-room-and-bar), « Gift Cards » (/shop#shop-sec-gift-cards).
En 3 secondes : à juger sur `captures/barkumiko-d.webp` (mesuré : fond du premier écran #142d38, 8 image(s) et 25 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Vinter**, 112 px / 56 px téléphone, graisse 300, interlignage 1,00, lowercase, interlettrage 6.72px ; h2 **Vinter**, 36 px / 36 px téléphone, graisse 300, interlignage 1,10 ; corps **Vinter**, 24 px / 24 px téléphone, graisse 300, interlignage 1,80 ; boutons **Vinter**, 16 px / 14 px téléphone, graisse 800, interlignage 1,40, capitales, interlettrage 3.84px ; nav **Vinter**, 16 px / 14 px téléphone, graisse 500, interlignage 1,40, capitales, interlettrage 2.24px.
Sources `@font-face` : inline (data:) (webflow-icons) ; tiers (cdn.prod.website-files.com) (Baskervville, Vinter) ; auto-hébergée (Roboto) ; fichiers chargés : https://cdn.prod.website-files.com/69f3d799bbc59d8dea247a53/69f45e255c3e2061d65a19d7_Vinter-Medium.otf, https://cdn.prod.website-files.com/69f3d799bbc59d8dea247a53/69f45e259e6e4324385fdb46_Vinter-Light.otf, https://cdn.prod.website-files.com/69f3d799bbc59d8dea247a53/69f45e250420ba257a7dbbc3_Vinter-Regular.otf. Familles en usage sur le texte visible : Vinter ×35, Arial ×1. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #f7f4ee (premier écran #142d38), texte #333333 (contraste 11,51:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #f7f4ee (64 %), #142d38 (25 %), #ede7d9 (11 %), #d4a882 (0 %) ; textes par nombre de caractères : #f7f4ee (37 %), #333333 (30 %), #3a3a36 (13 %), #18181a (8 %), #b98f6b (6 %). Images : 9 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery), Webflow (window.Webflow). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `color 0.12s cubic-bezier(0.22, 1, 0.36, 1)` ×18, `opacity 1.2s cubic-bezier(0.65, 0, 0.35, 1)` ×7, `background-color 0.2s cubic-bezier(0.22, 1, 0.36, 1)` ×7, `background-color 0.12s cubic-bezier(0.22, 1, 0.36, 1)` ×4, `border-color 0.12s cubic-bezier(0.22, 1, 0.36, 1)` ×4, `transform 0.12s cubic-bezier(0.22, 1, 0.36, 1)` ×4, `box-shadow 0.12s cubic-bezier(0.22, 1, 0.36, 1)` ×4, `animation kRiseHero 0.9s cubic-bezier(0.22, 1, 0.36, 1)` ×2, `transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)` ×2, `background-color 0.25s ease` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 1 bloc(s) de plus d'un écran (`nav.nav-bar` 3,6 écrans). Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/barkumiko-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `main#main` « kumiko » (3,0 écrans, 86 mots, 7 image(s)).
2. L'élément le plus animé : `div#w-dropdown-toggle-0` (5 transition(s) : background-color 0.12s cubic-bezier(0.22, 1, 0.36, 1) ; color 0.12s cubic-bezier(0.22, 1, 0.36, 1)).
3. Le bloc le plus singulier par sa structure : aucune section ne contient de balise rare (table, details, canvas, video, svg, form, dl…).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« RESERVE », « Menu », « Gift Cards »).
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/4 ordinateur, 0/4 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu (jugé sur les captures, veille du 28 oct 2026)

- **Polices** : une seule famille, Vinter (sans à empattements évasés, à la Optima) en maigre 300 : le nom « kumiko » en bas de casse espacé, 112 px à l'ordinateur, 56 px au téléphone, posé sur la photo ; titres de bloc 36 px en casse normale ; chapô 24 px (interlignage 1,8), texte 19 px ; boutons et menu en capitales de 16 px très espacées. Libres : Marcellus (titres) et Josefin Sans maigre (texte).
- **Couleurs** : papier de riz #f7f4ee, bloc lin #ede7d9 pour le café, pied bleu d'encre #142d38, texte charbon #333333, boutons pleins cuivre clair #d4a882 à texte noir, sur-titres cuivre #b98f6b. Régime : clair neutre (fond de chroma 0,009).
- **Espacements** : très aérés, 196 px (téléphone) et 218 px (ordinateur) du bord au texte, une colonne centrée de 760 px.
- **Formes** : angles droits, boutons pleins cuivre sans bordure, capitales espacées ; grille de photos carrées serrées ; aucune ombre ; liens en couleur.
- **Photos** : diaporama plein cadre de salle et de bar en lumière basse, voilé, nom et phrase en blanc dessus ; grille de 6 photos carrées (cocktails, plats vus de dessus).
- **Mouvement** : le nom et la phrase montent à l'entrée (0,9 s) ; chaque bloc de texte monte en apparaissant (1,2 s / 2 s) ; à l'ordinateur, le bloc arrivé au milieu de l'écran s'avance (scale 1,06 en 0,6 s) et revient quand on le quitte ; diaporama en fondu 1,2 s avec bouton pause. Profil NOUVEAU : `bloc-qui-s-avance` (MOUVEMENTS.md).
- **Architecture** : diaporama + nom, phrase d'accueil centrée et « Discover Kumiko », grille de photos (Instagram), le café du jour en bloc lin, pied bleu d'encre (menus, réserver, adresse, horaires, e-mail).
- **Geste signature** : le paragraphe qu'on lit qui vient doucement vers soi.
- **Garde / refuse** : garde la page lente et aérée, le cuivre en aplat ; refuse la rotation automatique du diaporama (GOUT § 4 : à la main), le texte gris maigre sous 16 px.
