# Hotel Sanders — https://hotelsanders.com/
Titre « Hotel Sanders », `lang="en-US"`, description « Hotel Sanders is a design hotel on Tordenskjoldsgade in Copenhagen, with rooms, Sanders Kitchen and TATA Cocktail Bar. », technologie lue : WordPress, jQuery. Démontage automatique du 2026-10-28 (`ff demonter`, mesures brutes dans `hotelsanders.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; vidéo plein écran (100 % de l'écran) ; bouton principal « Guests » en bas au centre (820, 755 px) ; 166 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; vidéo plein écran (100 % de l'écran) ; bouton principal « Guests » en bas au centre (40, 634 px) ; 120 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 8 lien(s) — [BOOK TABLE], [BOOK ROOM], SANDERS KITCHEN, TATA COCKTAIL BAR, SANDERS ROOFTOP, MEETINGS & EVENTS, CHRISTMAS & NEW YEAR’S EVE, [Open Off-Canvas Panel] ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div#page` (3,7 écrans, 25 mots, 13 img) → `footer.custom-footer` (0,9 écran, 78 mots, 8 img) → `button.caspeco-booking-button` (0,0 écran, 2 mots, 0 img). Calques hors flux (fixes/absolus) : `a.screen-reader-text` (absolute, 1 px, 3 mots), `header#masthead` (fixed, 221 px, 20 mots), `nav#generate-slideout-menu` (fixed, 900 px, 56 mots), `div#a11y-speak-assertive` (absolute, 1 px, collé en bas), `div#a11y-speak-polite` (absolute, 1 px, collé en bas).
Pied de page : 24 lien(s) — + 45 46 40 00 40, reservations@hotelsanders.com, + 45 46 40 00 40, residence@hotelsanders.com, About, Contact, Events, Press, Gift cards, Management (+14). Téléphone cliquable : oui (4, tel:+4546400040). Formulaire : 4 (5 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « BOOK TABLE » (https://booking.caspeco.net/dk_hotehot02/13/experience-view?lang=en-GB&experienceView=true), « BOOK ROOM » (https://book.hotelsanders.com?gc=bbc25f072cb59451824f048e4788b370), « GIFTCARDS » (https://order.lifepeaks.dk/en/sanders), « reservations@hotelsanders.com » (mailto:reservations@hotelsanders.com), « Gift cards » (https://order.lifepeaks.dk/en/sanders), « Facebook » (https://www.facebook.com/hotelsanders), « Booking terms » (https://hotelsanders.com/booking-terms/).
En 3 secondes : à juger sur `captures/hotelsanders-d.webp` (mesuré : fond du premier écran #eeebe3, 1 image(s) et 166 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 **Darby Sans Poster**, 25 px / 20 px téléphone, graisse 400, interlignage 1,20, capitales ; corps **Kohinoor Bangla**, 16 px / 16 px téléphone, graisse 400 ; boutons **Kohinoor Bangla**, 16 px / 14 px téléphone, graisse 400, capitales ; nav **Kohinoor Bangla**, 16 px / 26 px téléphone, graisse 400, capitales.
Sources `@font-face` : auto-hébergée (Darby Sans Poster, Kohinoor Bangla, Impact Label reversed, Impact Label, Amanda Signature, slick, GeneratePress, Font Awesome 6 Free, Font Awesome 6 Brands, GP Premium) ; inline (data:) (swiper-icons) ; fichiers chargés : https://hotelsanders.com/wp-content/plugins/gp-premium/general/icons/gp-premium.woff, https://hotelsanders.com/wp-content/themes/hotelsanders/assets/scss/import/fonts/DarbySansPoster-Medium.otf, https://fonts.googleapis.com/, https://fonts.googleapis.com/css?family=Open+Sans:300,300italic,regular,italic,600,600italic,700,700italic,800,800italic|Roboto+Condensed:300,300italic,regular,italic,700,700italic&display=swap. Familles en usage sur le texte visible : Kohinoor Bangla ×74, Darby Sans Poster ×39, Open Sans ×4. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #eeebe3, texte #001d13 (contraste 14,87:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #eeebe3 (82 %), #011a11 (18 %), #d3bb7b (0 %) ; textes par nombre de caractères : #001d13 (45 %), #d3bb7b (34 %), #000000 (20 %), #ffffff (1 %). Images : 20 `<img>` visibles, 0 fond(s) en image, 2 vidéo(s), `mask-image`/`clip-path` sur 10 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : Swiper (window.Swiper), jQuery (window.jQuery), Slick (script slick.min.js). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `color 0.1s ease-in-out` ×75, `background-color 0.1s ease-in-out` ×75, `line-height 0.3s ease` ×31, `all 0.4s ease-in-out` ×14, `all 1s ease` ×13, `all 0.6s ease` ×5, `all 0.4s ease` ×2, `all 0.8s ease` ×2, `all 0.3s ease` ×2, `all 1s ease-out` ×2. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/hotelsanders-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div#page` (3,7 écrans, 25 mots, 13 image(s)).
2. L'élément le plus animé : `a.screen-reader-text` (2 transition(s) : color 0.1s ease-in-out ; background-color 0.1s ease-in-out).
3. Le bloc le plus singulier par sa structure : `div#page` (seule à contenir <video>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : téléphone cliquable, portes d'action nommées (« BOOK TABLE », « BOOK ROOM », « GIFTCARDS », « reservations@hotelsanders.com », « Gift cards », « Facebook », « Booking terms »), formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/21 ordinateur, 0/20 téléphone ; vidéo en premier écran : oui ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu (jugé sur les captures, veille du 28 oct 2026)

- **Polices** : Darby Sans Poster (sans fine à pleins et déliés) en capitales pour les intitulés, 25 à 26 px ; texte en humaniste (Kohinoor Bangla déclarée) 16 px ; boutons en capitales de 16 px. Pas de h1. Libres : Marcellus (titres) et Hanken Grotesk (texte).
- **Couleurs** : vert bouteille presque noir #011a11 (en-tête, bandeau de réservation), or pâle #d3bb7b (boutons pleins à texte vert, filets, intitulés à contour), lin #eeebe3 et vert #001d13 pour le pied et les pages. Régime : sombre.
- **Espacements** : photos bord à bord sans marge ; marges seulement dans l'en-tête et le pied (40 / 64 px).
- **Formes** : angles droits, boutons or pleins, intitulés à contour or de 1 px en bas de chaque photo ; filet or sous l'en-tête ; aucune ombre.
- **Photos** : vidéo plein cadre au premier écran avec le formulaire de réservation dessus ; mosaïque de photos bord à bord en rangées de 2 et 3, lumière chaude et basse, quelques natures mortes en noir et blanc.
- **Mouvement** : vidéo en fondu à l'entrée (0,6 s), photos de la mosaïque en fondu et glissement 1 s à leur arrivée ; colonnes du pied qui montent. Profil : `video-de-fond` (tiré seulement avec une vraie vidéo).
- **Architecture** : vidéo + réservation, mosaïque de portes (la maison, chambres, cuisine, cour, bar, toit, offres, résidence, réunions, galerie, conciergerie), pied lin en quatre colonnes et lettre.
- **Geste signature** : l'intitulé doré à contour posé au bas de chaque photo de la mosaïque, comme une plaque de porte.
- **Garde / refuse** : garde le vert bouteille et l'or, la mosaïque de portes ; refuse la vidéo sans poster et le bandeau « navigateur obsolète » vu au relevé.
