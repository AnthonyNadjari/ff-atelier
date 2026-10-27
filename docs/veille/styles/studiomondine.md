# Studio Mondine — https://www.studiomondine.com/
Titre « Studio Mondine », `lang="en-US"`, technologie lue : generator « WordPress 7.1.3 », WordPress, jQuery. Démontage automatique du 2026-10-27 (`ff demonter`, mesures brutes dans `studiomondine.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « Our studio is now booking for celebrations worldwide in 2026. Please reach out to begin the conversation. » ; image plein écran (100 % de l'écran) ; bouton principal « ACCEPT AND CLOSE » en haut à droite (1307, 23 px, dans une barre fixe) ; 43 mots visibles au-dessus du pli ; bannière cookies 4 % de l'écran, non bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « Summertime in Montecito » ; image plein écran (100 % de l'écran) ; bouton principal « ACCEPT AND CLOSE » en bas au centre (135, 800 px, dans une barre fixe) ; 36 mots visibles au-dessus du pli ; bannière cookies 17 % de l'écran, non bloquante ; rien ne bouge tout seul.
Nav : non mesuré. **Barre fixe en bas de l'écran (téléphone)** : Cookie Policy, ACCEPT AND CLOSE.
Sections de premier niveau : non mesuré. Calques hors flux (fixes/absolus) : `div.cc-window` (fixed, 34 px, 22 mots), `ul#menu-main-menu` (fixed, 110 px, 5 mots), `div#events-list-scroll-marker` (fixed, 120 px), `div.header-title` (fixed, 62 px, 2 mots), `div.newsletter-popup-modal` (fixed, 338 px, 29 mots), `div.homepage-pager` (fixed, 900 px), `div.footer-wrap` (absolute, 50 px, collé en bas, 11 mots), `div.landing-panel` (sticky, 900 px, 3 mots), `div#panel-1` (sticky, 900 px, collé en bas), `div#panel-2` (sticky, 900 px, collé en bas).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : 1 (3 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Facebook, » (https://www.facebook.com/studiomondine/).
En 3 secondes : à juger sur `captures/studiomondine-d.webp` (mesuré : fond du premier écran #372c04, 9 image(s) et 43 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Fautive-Roman**, 28 px / 22 px téléphone, graisse 300, interlignage 1,25 ; h2 **Fautive-Roman**, 18 px / 22 px téléphone, graisse 400, interlignage 1,30 ; corps : non mesuré ; boutons **rationaltext-book**, 10 px / 11 px téléphone, graisse 400, interlignage 1,20, capitales, interlettrage 0.2px ; nav : non mesuré.
Sources `@font-face` : auto-hébergée (Fautive-Roman, Fautive-Italic, rationaltext-book) ; fichiers chargés : https://studiomondine.com/wp-content/themes/mondine/assets/fonts/fautive-roman-variable-wght.woff2, https://studiomondine.com/wp-content/themes/mondine/assets/fonts/rationaltext-book-webfont.woff2. Familles en usage sur le texte visible : rationaltext-book ×22, Fautive-Roman ×12. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #26290a (premier écran #372c04), texte #26290a (contraste 1,00:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #26290a (81 %), #372c04 (17 %), #ffffff (2 %) ; textes par nombre de caractères : #ffffff (35 %), #26290a (31 %), #fdfcf8 (19 %), #000000 (15 %). Images : 15 `<img>` visibles, 1 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : GSAP (window.gsap), ScrollTrigger (window.ScrollTrigger), Swiper (window.Swiper), Flickity (window.Flickity), Barba (window.barba), jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `opacity 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)` ×20, `color 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)` ×20, `opacity 1.4s cubic-bezier(0.25, 0.1, 0.25, 1)` ×14, `opacity 0.32s cubic-bezier(0.25, 0.1, 0.25, 1)` ×7, `-webkit-transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)` ×5, `opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)` ×5, `opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)` ×3, `opacity 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)` ×3, `transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)` ×1, `-webkit-transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)` ×1. Scroll lié : ScrollTrigger oui ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 5 bloc(s) de plus d'un écran (`div.landing-panel` 5,0 écrans, `div#panel-1` 5,0 écrans, `div#panel-2` 5,0 écrans). Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/studiomondine-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : non mesuré.
2. L'élément le plus animé : `div.cc-window` (2 transition(s) : transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) ; -webkit-transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)).
3. Le bloc le plus singulier par sa structure : non mesuré.

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« Facebook, »), barre d'actions fixe en bas sur téléphone, formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/1 ordinateur, 0/1 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu (jugé sur les captures, veille du 27 oct 2026)

- **Polices** : Fautive 300 (serif de texte contemporaine) en casse normale pour les titres de projet (42 px à l'ordinateur, 21,9 px au téléphone) et la phrase de réservation (28 px) ; Rational Text pour l'en-tête, la nav du pied et les petites capitales (« SCROLL TO BEGIN »), 16 px. Le nom du premier écran est un logo (image de 544 px). Libres : Spectral 300 et Hanken Grotesk.
- **Couleurs** : vert olive nuit #26290a sous toute la page ; bloc final brun d'olive #372c04 ; tout le texte en blanc cassé #fdfcf8 ; voile de chargement des photos blanc cassé à 20 %. La couleur vive vient des photos. Régime : sombre.
- **Espacements** : aucune marge entre les photos : diptyques bord à bord ; seul bloc de texte, la réservation, centré avec de grands vides (85 px de marge relevés à l'ordinateur).
- **Formes** : aucun bouton plein ; liens soulignés ; champ d'inscription à filet bas ; angles droits.
- **Photos** : premier écran plein cadre, une photo différente à chaque visite, logo blanc au centre ; puis un projet par diptyque de deux photos 4:5, le nom du projet en blanc au milieu ; au téléphone, une photo par écran.
- **Mouvement** : le nom du projet est fixe au centre de l'écran et change d'un coup quand le diptyque suivant arrive (opacité sans transition) ; photos sous voile qui s'efface en 1,4 s ; liens 0,25 s. Profil nouveau : `legende-fixe-qui-change` (MOUVEMENTS.md).
- **Architecture** : portfolio d'un fleuriste événementiel : premier écran, trois projets (diptyques), réservation (« now booking… reach out »), liens Events, The Studio, Press ; contact par e-mail en pied ; une petite fenêtre d'inscription glisse en bas à droite (non reprise).
- **Geste signature** : la légende fixe qui change de projet pendant que les photos défilent dessous.
