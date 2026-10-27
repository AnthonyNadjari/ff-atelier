# Archivist — https://archivistgallery.com/
Titre « Archivist | Letterpress Cards, Luxury Matches & Thoughtful Gifts | Archivist Gallery », `lang="en"`, description « Discover Archivist — Britain’s home of beautifully designed letterpress cards, unique prints, luxury matches and thoughtful gifts, curated with creativity and … », technologie lue : Next.js, Sanity, Tailwind. Démontage automatique du 2026-10-27 (`ff demonter`, mesures brutes dans `archivistgallery.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « Welcome to Archivist US » ; fond en image plein écran (100 % de l'écran) ; bouton principal « SHOP NEW » à mi-hauteur au centre (514, 438 px) ; 16 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « Welcome to Archivist US » ; fond en image plein écran (100 % de l'écran) ; bouton principal « SHOP NEW » à mi-hauteur au centre (18, 280 px) ; 47 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 6 lien(s) — Archivist Logo, NEW, JOURNAL, [ABOUT], [Search], User Avatar ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `section.pt-(--header-height)` « Welcome to Archivist US » (1,6 écran, 11 mots, 1 img) → `section.bg-background` (1,0 écran, 63 mots, 6 img) → `section.bg-background` « Enikő Eged » (1,1 écran, 10 mots, 3 img) → `section.bg-background` (1,1 écran, 49 mots, 49 img) → `section.bg-background` (1,0 écran, 23 mots, 2 img) → `section.bg-background` (2,0 écrans, 36 mots, 5 img) → `section.bg-background` (0,2 écran, 0 mots, 0 img) → `section.bg-background` « Latest from the journal » (1,1 écran, 84 mots, 7 img) → `div.relative` « Never miss a print. » (0,6 écran, 43 mots, 0 img) → `footer.relative` (0,6 écran, 41 mots, 0 img). Calques hors flux (fixes/absolus) : `header.absolute` (absolute, 112 px, 5 mots), `div.bg-repeat` (absolute, 9236 px).
Pied de page : 19 lien(s) — HOME, COLLECTIONS, ARTISTS & DESIGNERS, JOURNAL, BECOME A TRADE CUSTOMER, ABOUT US, CONTACT US, TERMS & CONDITIONS, SHIPPING, PRIVACY POLICY (+9). Téléphone cliquable : non. Formulaire : 1 (1 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/archivistgallery-d.webp` (mesuré : fond du premier écran #dbedf0, 3 image(s) et 16 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Tautz**, 104 px / 49 px téléphone, graisse 500, interlignage 0,95, interlettrage -5.19998px ; h2 **Tautz**, 64 px / 17 px téléphone, graisse 500, interlignage 1,10, interlettrage -3.2px ; corps **Tautz**, 55 px / 28 px téléphone, graisse 500, interlignage 1,30, interlettrage -2.75px ; boutons **GillSansNova**, 16 px / 16 px téléphone, graisse 500, interlignage 1,50 ; nav **GillSansNova**, 16 px / 16 px téléphone, graisse 500, interlignage 1,50.
Sources `@font-face` : auto-hébergée (Tautz, GillSansNova) ; locale (Tautz Fallback, GillSansNova Fallback) ; fichiers chargés : https://archivistgallery.com/_next/static/media/8cd9f181db166625-s.woff2, https://archivistgallery.com/_next/static/media/ceb87d92806871d5-s.woff2, https://archivistgallery.com/_next/static/media/89e311cf5b7ea99d-s.woff2. Familles en usage sur le texte visible : GillSansNova ×105, Tautz ×25. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #dbedf0, texte #125443 (contraste 7,32:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #dbedf0 (100 %), #125443 (0 %), #ffffff (0 %) ; textes par nombre de caractères : #125443 (99 %), #ffffff (1 %). Images : 69 `<img>` visibles, 2 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : aucune détectée (window.* et noms de scripts). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `transform 0.45s cubic-bezier(0.165, 0.84, 0.44, 1)` ×45, `background-size 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)` ×18, `transform 0.2s cubic-bezier(0.165, 0.84, 0.44, 1)` ×16, `color 0.4s cubic-bezier(0.4, 0, 0.2, 1)` ×9, `all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)` ×8, `opacity 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)` ×6, `transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)` ×5, `color 0.2s cubic-bezier(0.165, 0.84, 0.44, 1)` ×4, `all 0.45s cubic-bezier(0.165, 0.84, 0.44, 1)` ×3, `all 0.7s cubic-bezier(0.4, 0, 0.2, 1)` ×3. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/archivistgallery-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `section.bg-background` (2,0 écrans, 36 mots, 5 image(s)).
2. L'élément le plus animé : `div.z-[calc(var(--bg-pattern-layer-image)+1)]` (animation animation ticker 48s linear infinite).
3. Le bloc le plus singulier par sa structure : `section.bg-background` « Latest from the journal » (seule à contenir <time>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/9 ordinateur, 0/9 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu (jugé sur les captures, veille du 27 oct 2026, tour 11)

- **Polices** : Tautz 500 (serif glyphique aux empattements évasés) pour le h1 (104 px à l'ordinateur, 48,8 px au téléphone, interlignage 0,95, interlettrage -0,05 em), les h2 (55 / 30,4 px) et les grands paragraphes d'introduction (55 px) ; Gill Sans Nova 500 pour le texte (18 / 17 px, interlignage 1,6), étiquettes et boutons en capitales 12 à 14 px. Libres : Marcellus et Cabin.
- **Couleurs** : bleu d'eau pâle #dbedf0 (100 % du fond, pied compris ; chroma 0,020) ; une seule encre vert sapin #125443 (texte, filets, cadres, boutons pleins) ; blanc sur les boutons pleins. Régime : clair teinté doux, teinte froide.
- **Espacements** : sections de 106 px (téléphone) à 192 px (ordinateur) ; conteneur 1 168 px ; texte en colonne de 43 caractères.
- **Formes** : boutons en pilule (rendus à 6 px par l'usine), un plein, un à filet ; cadres de filet 1 px vert sapin autour de la nav, des blocs d'artiste et du « Up next » ; photos à angles droits ; aucune ombre.
- **Photos** : produits mis en scène dans un jardin ou un intérieur ; portraits d'artistes dans un cadre de filet qui déborde ; vignettes qui se chevauchent à côté des titres ; rangées de boîtes d'allumettes détourées. Trame de papier moucheté sur le fond : non reprise (grain, GOUT § 2).
- **Mouvement** : deux bandeaux « NEW ☼ NEW » en Tautz géant qui défilent seuls en sens contraires (48 s linéaires) ; images qui grandissent à peine en entrant (scale 0,45 s cubic-bezier(0.165, 0.84, 0.44, 1)) ; soulignements tracés (background-size 0,6 s). Préchargeur (logo image par image, page qui se lève à 2,2 s) non repris : rideau d'ouverture refusé (GOUT § 2). Profil `bandes-croisees`, sans inclinaison.
- **Architecture** : papeterie à presses : nav encadrée, titre centré, photo produit, texte d'introduction où les noms de produits sont des pastilles cliquables, collections, bandeau défilant des nouveautés, artiste mise en avant dans un cadre, l'atelier (presses, mains), journal, lettre, « Up next » encadré.
- **Geste signature** : les noms des produits glissés dans la phrase d'introduction comme des étiquettes surlignées, chacune avec sa vignette.
