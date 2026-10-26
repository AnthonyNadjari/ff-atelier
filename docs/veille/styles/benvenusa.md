# Benvenusa Italian Wines — https://benvenusa.com/
Titre « Benvenusa Italian Wines », `lang="en-NZ"`, description « We represent a small portfolio of artisanal, truly micro wine producers from Friuli Venezia Giulia, Tuscany, Sicily, Sardinia and Slovenia. », technologie lue : Locomotive (data-module), Tailwind. Démontage automatique du 2026-10-26 (`ff demonter`, mesures brutes dans `benvenusa.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « A HISTORY OF THE FUTURE » ; pas de média plein écran (1 image(s) dans l'écran) ; bouton principal « PRODUCERS » en haut à gauche (0, 0 px, dans une barre fixe, dans la nav) ; 35 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « A HISTORY OF THE FUTURE » ; pas de média plein écran (0 image(s) dans l'écran) ; bouton principal « PRODUCERS » en haut à gauche (0, 0 px, dans une barre fixe, dans la nav) ; 31 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 2 lien(s) — [PRODUCERS], DISTRIBUTORS ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `section.p-section` (0,2 écran, 0 mots, 0 img) → `section.flex` (1,3 écran, 33 mots, 1 img) → `div.pb-[5%]` (0,1 écran, 0 mots, 0 img) → `div.h-[--nav-height]` (0,1 écran, 0 mots, 0 img) → `section.px-section` « A HISTORY OF THE FUTURE » (0,4 écran, 21 mots, 0 img) → `section.border-b` (0,6 écran, 114 mots, 20 img) → `footer.footer` (0,2 écran, 3 mots, 0 img). Calques hors flux (fixes/absolus) : `nav.font-syllabus` (fixed, 135 px, 2 mots).
Pied de page : 2 lien(s) — About Us, Contact. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/benvenusa-d.webp` (mesuré : fond du premier écran #ac00ef, 1 image(s) et 35 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Syllabus**, 77 px / 34 px téléphone, graisse 400, interlignage 1,00, capitales ; h2 : non mesuré ; corps : non mesuré ; boutons : non mesuré ; nav **Syllabus**, 26 px / 18 px téléphone, graisse 400, interlignage 1,00, capitales.
Sources `@font-face` : inline (data:) (swiper-icons) ; auto-hébergée (DieGrotesk, Syllabus) ; fichiers chargés : https://benvenusa.com/dist/Syllabus-Regular-KvIxX-zN.woff2, https://benvenusa.com/dist/die-grotesk-b-regular-DkLgfo_F.woff2. Familles en usage sur le texte visible : Syllabus ×51, DieGrotesk ×2. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff (premier écran #ac00ef), texte #000000 (contraste 21,00:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (70 %), #ac00ef (28 %), #c3c3c3 (2 %) ; textes par nombre de caractères : #000000 (100 %). Images : 21 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : GSAP (script gsap-BB26Ig6N.js), Swiper (script swiper-Eiq5m3Ul.js), Barba (script barba-qmTP3nsC.js). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)` ×45, `opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)` ×21, `opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)` ×2, `color 0.3s cubic-bezier(0.4, 0, 0.2, 1)` ×2. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : `data-module-barba` ×1. Ce qui bouge réellement à l'écran : à juger sur `captures/benvenusa-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `section.flex` (1,3 écran, 33 mots, 1 image(s)).
2. L'élément le plus animé : `main.barba-wrapper` (attributs data-module-barba).
3. Le bloc le plus singulier par sa structure : `section.p-section` (contient <svg>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : rien de mesurable.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/1 ordinateur, 0/1 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
