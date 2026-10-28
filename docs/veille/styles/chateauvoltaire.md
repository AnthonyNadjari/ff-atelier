# Château Voltaire — https://chateauvoltaire.com/
Titre « Château Voltaire | Hôtel 5 étoiles 1er Arrondissement Paris », `lang="fr"`, description « Découvrez le Château Voltaire, un hôtel 5 étoiles confidentiel au cœur du 1er arrondissement de Paris. Une adresse mêlant luxe discret et art de vivre. », technologie lue : Tailwind. Démontage automatique du 2026-10-28 (`ff demonter`, mesures brutes dans `chateauvoltaire.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « CHÂTEAU VOLTAIRE » ; image plein écran (100 % de l'écran) ; bouton principal « Fermer » en haut à droite (1372, 20 px, dans une barre fixe) ; 46 mots visibles au-dessus du pli ; aucune couche bloquante ; bouge tout seul sans défilement : 4 élément(s) (`div.justify-self-start`, `div.justify-self-end`, `ul.flex`).
Téléphone (390x844) : h1 « CHÂTEAU VOLTAIRE » ; image plein écran (80 % de l'écran) ; bouton principal « RÉSERVER » en bas au centre (0, 796 px, dans une barre fixe) ; 46 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 20 lien(s) — [MENU], CONTACT, WHATSAPP, [FR], [EN], [KO], [RÉSERVER], [RÉSERVER UNE CHAMBRE], [RÉSERVER UNE TABLE], [RÉSERVER LE SPA], [FERMER], ACCUEIL (+8) ; boutons entre crochets. **Barre fixe en bas de l'écran (téléphone)** : RÉSERVER, RÉSERVER UNE CHAMBRE.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.hero` (1,0 écran, 0 mots, 12 img) → `section.max-w-[820px]` « CHÂTEAU VOLTAIRE » (0,2 écran, 8 mots, 0 img) → `section.[&_img]:h-[290px]` « L’ÂME DES LIEUX » (0,6 écran, 159 mots, 2 img) → `section.max-w-screen-xl` « UNE ADRESSE » (0,7 écran, 152 mots, 6 img) → `section.lazy-slider-full-width` « ESPACE BIEN-ÊTRE » (0,9 écran, 3 mots, 2 img) → `section` « BRASSERIE L'EMIL » (0,8 écran, 82 mots, 14 img) → `section` « BAR LA COQUILLE D'OR » (0,8 écran, 53 mots, 12 img) → `div.lazy-social-wall-line` (0,1 écran, 0 mots, 0 img) → `section.text-text` (0,6 écran, 70 mots, 10 img). Calques hors flux (fixes/absolus) : `header#main-nav` (fixed, 90 px, 46 mots), `div#booking-table` (fixed, 900 px).
Pied de page : 21 lien(s) — [Français], [English], [한국어], 55-57, Rue Saint-Roch 75001 Paris, Franc, +33 (0)1 53 45 91 00, +33 (0) 6 43 75 74 96, +33 (0)1 53 45 91 01, +33 (0)7 88 25 80 61, commercial@hotelchateauvoltaire.com, contact@hotelchateauvoltaire.com (+11). Téléphone cliquable : oui (2, tel:+33153459100). Formulaire : aucun. Horaires : oui (3 jours nommés, 14 heures, ex. « lundi au samedi de 7h à 10h30 et jusqu'à 11h le dimanche. — »). Portes d'action : « MENU » (), « RÉSERVER » (), « RÉSERVER UNE CHAMBRE » (javascript:;), « RÉSERVER UNE TABLE » (https://bookings.zenchef.com/results?rid=356873&fullscreen=1&lang=fr), « RÉSERVER LE SPA » (mailto:contact@hotelchateauvoltaire.com), « FACEBOOK » (https://www.facebook.com/hotelchateauvoltaire#).
En 3 secondes : à juger sur `captures/chateauvoltaire-d.webp` (mesuré : fond du premier écran #fff4dd, 8 image(s) et 46 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Sanzettica Ultra**, 40 px / 27 px téléphone, graisse 900, interlignage 1,00 ; h2 **Sanzettica Ultra**, 20 px / 20 px téléphone, graisse 900, interlignage 1,00 ; corps **Bradfort**, 13 px / 16 px téléphone, graisse 400, interlignage 1,50 ; boutons **Sanzettica Ultra**, 20 px / 20 px téléphone, graisse 400, interlignage 1,40, capitales ; nav **Sanzettica Ultra**, 24 px / 20 px téléphone, graisse 400, interlignage 1,33.
Sources `@font-face` : inline (data:) (swiper-icons) ; tiers (next360-api-dev.agencewebcom.com) (Bradfort, Sanzettica Ultra) ; tiers (applepay.cdn-apple.com) (apple-wallet-btn-en-US) ; fichiers chargés : https://next360-api-dev.agencewebcom.com/uploads/86832-chateau-voltaire/be6f44d8-0698-4f8a-b77c-0e9b4066214c.woff, https://next360-api-dev.agencewebcom.com/uploads/86832-chateau-voltaire/5ba52375-6762-40d7-85c6-02497e806388.woff. Familles en usage sur le texte visible : Bradfort ×51, Sanzettica Ultra ×38. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #fff4dd, texte #000000 (contraste 19,24:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #fff4dd (84 %), #ffffff (15 %), #fef4de (1 %), #000000 (0 %) ; textes par nombre de caractères : #000000 (75 %), #fff4dd (24 %), #333333 (1 %), #ffffff (0 %), #ff7634 (0 %). Images : 27 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s), `mask-image`/`clip-path` sur 1 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : Swiper (window.Swiper). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `color 0.3s cubic-bezier(0.4, 0, 0.2, 1)` ×35, `transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)` ×16, `border 0.3s ease` ×7, `background 0.3s ease` ×7, `opacity 0.2s ease` ×7, `box-shadow 0.4s ease` ×7, `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` ×5, `opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)` ×5, `color 0.5s cubic-bezier(0.4, 0, 0.2, 1)` ×2, `transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)` ×2. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/chateauvoltaire-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.hero` (1,0 écran, 0 mots, 12 image(s)).
2. L'élément le plus animé : `div#tac_title` (4 transition(s) : border 0.3s ease ; background 0.3s ease).
3. Le bloc le plus singulier par sa structure : `div.hero` (contient <svg>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : téléphone cliquable, horaires sur l'accueil, portes d'action nommées (« MENU », « RÉSERVER », « RÉSERVER UNE CHAMBRE », « RÉSERVER UNE TABLE », « RÉSERVER LE SPA », « FACEBOOK »), barre d'actions fixe en bas sur téléphone.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/25 ordinateur, 0/25 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu (jugé sur les captures, veille du 28 oct 2026)

- **Polices** : grotesque très large et très noire, Sanzettica Ultra, pour le nom, les titres et les boutons (saisis en capitales) : 40 px (27 px au téléphone), titres de bloc 20 px, boutons 12 px ; texte en serif de livre, Bradfort, 16 px au téléphone, 13 px à l'ordinateur, interlignage 1,5. Libres : Archivo Black et Literata.
- **Couleurs** : crème beurre #fff4dd sur toute la page, texte, filets et contours noirs #000000, une seule encre ; orange #ff7634 rarissime. Régime : clair teinté doux (chroma 0,032).
- **Espacements** : 84 px (téléphone), 213 px (ordinateur) ; page de 1 240 px, texte à 67 caractères à côté des photos ; barre « Réserver » fixe en bas au téléphone.
- **Formes** : boutons à contour noir de 1 px, angles droits ; seul rond : la pastille de langue ; liens soulignés.
- **Photos** : diaporama plein cadre de salons ; pour la brasserie et le bar, une photo rectangulaire chevauchée par une seconde découpée en ARCHE (plein cintre) ; dessin au trait de l'immeuble à côté du texte.
- **Mouvement** : rien au défilement ; diaporama qui glisse seul et flèche qui rebondit (refusés) ; liens 0,3 s. Profil : `fondu-sobre`.
- **Architecture** : photo + dessin de la façade, nom et « Un hôtel 5 étoiles à Paris », l'âme des lieux, une adresse / chambres / suite, bien-être, brasserie (horaires), bar (horaires), mur de photos, pied (adresse, téléphones cliquables, e-mails).
- **Geste signature** : la photo découpée en arche qui chevauche la grande photo, et la façade dessinée comme un tampon.
- **Garde / refuse** : garde le crème avec une seule encre noire, l'arche, la barre Réserver en bas ; refuse la rotation automatique et la flèche en boucle.
