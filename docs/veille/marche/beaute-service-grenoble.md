# Institut Beauté Service — https://beaute-service.fr/
Titre « Institut Beauté Service », `lang="fr"`, technologie lue : jQuery. Démontage automatique du 2026-10-30 (`ff demonter`, mesures brutes dans `beaute-service-grenoble.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « L'institut de beauté Grenoblois à la pointe des techniques modernes » ; image plein écran (65 % de l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 70 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « L'institut de beauté Grenoblois à la pointe des techniques modernes » ; pas de média plein écran (2 image(s) dans l'écran) ; bouton principal « Toggle navigation » en haut à droite (346, 28 px, dans une barre fixe, dans la nav) ; 99 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 5 lien(s) — L'institut, Nos soins, Notre marque, Tarifs, Nous contacter ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.welcome` « L'institut de beauté Grenoblois à la po… » (0,7 écran, 10 mots, 1 img) → `div#institut` « Beauté Service Une référence en esthéti… » (0,5 écran, 106 mots, 0 img) → `div#soins` « Des soins complets et personnalisés » (0,8 écran, 95 mots, 0 img) → `div#chiffres` « Quelques chiffres » (0,5 écran, 28 mots, 0 img) → `div#marque` « Notre marque » (1,3 écran, 122 mots, 5 img) → `div.googlemap` « Laissez-nous prendre soin de vous » (0,5 écran, 5 mots, 0 img) → `div#contact` (0,4 écran, 30 mots, 0 img). Calques hors flux (fixes/absolus) : `nav#main-menu` (fixed, 70 px, 8 mots), `footer` (absolute, 69 px, collé en bas, 11 mots).
Pied de page : 1 lien(s) — Mentions Légales. Téléphone cliquable : non. Formulaire : aucun. Horaires : oui (3 jours nommés, 5 heures, ex. « mardi au vendredi 10h 18h30 non stop Le samedi 10h 17h30 n »). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/beaute-service-grenoble-d.webp` (mesuré : fond du premier écran #ffffff, 2 image(s) et 70 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Raleway**, 55 px / 18 px téléphone, graisse 400, interlignage 1,30 ; h2 **Raleway**, 36 px / 36 px téléphone, graisse 400, interlignage 1,10 ; corps **Raleway**, 16 px / 16 px téléphone, graisse 400, interlignage 2,00 ; boutons **Bitter**, 20 px / 16 px téléphone, graisse 400, interlignage 1,43 ; nav **Bitter**, 16 px / 18 px téléphone, graisse 700, interlignage 1,25.
Sources `@font-face` : auto-hébergée (Glyphicons Halflings) ; fichiers chargés : https://fonts.googleapis.com/css?family=Raleway. Familles en usage sur le texte visible : Raleway ×40, Bitter ×7. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #333333 (contraste 12,63:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (71 %), #000000 (15 %), #1e1e1e (14 %), #c25c7d (0 %) ; textes par nombre de caractères : #ffffff (44 %), #333333 (29 %), #000000 (24 %), #c25c7d (3 %). Images : 7 `<img>` visibles, 0 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `animation fadeInUp 0s ease` ×18, `animation fadeIn 0s ease` ×7, `all 0.7s ease` ×4, `all 0.4s ease-in-out` ×1, `animation fadeInDown 0s ease` ×1, `all 1s ease` ×1, `color 0.25s ease` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/beaute-service-grenoble-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div#marque` « Notre marque » (1,3 écran, 122 mots, 5 image(s)).
2. L'élément le plus animé : `h1.wow` (animation animation fadeInDown 0s ease).
3. Le bloc le plus singulier par sa structure : `div.googlemap` « Laissez-nous prendre soin de vous » (seule à contenir <iframe>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : horaires sur l'accueil.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/1 ordinateur, 0/2 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Verdict marché (veille du 30 oct 2026, tour 19)
Source : recherche (moteur de la session, Google refusant les requêtes sans navigateur), métier tiré **institut de beauté** dans `docs/OBJECTIF.md` (tirage `Math.random()` parmi 21 métiers, hors ceux des tours 16 et 18), ville tirée **Grenoble**. « institut de beauté Grenoble » : annuaires seulement (118712, PagesJaunes, Mappy, Planity, Treatwell, Justacote). « institut de beauté Grenoble soins visage épilation site officiel » : **rang 1, Institut Beauté Service**, avenue Alsace-Lorraine, indépendant (dépositaire Thalion) ; Bodysphere (rang 4, plusieurs instituts) et Quick Epil' (réseau) plus bas. URL lue : https://beaute-service.fr/ (HTML fait main, jQuery, « © 2018 », réalisé par Eymel Communication, HTML 6 Ko transférés, premier octet 0,71 s, indicatif). Captures et planche regardées.

**Un artisan paierait-il 1 200 € pour ça ?** Non. Classé premier, mais rien n'y fait signer : un premier écran à photo de visage sous masque (rien n'indique l'institut), « L'institut de beauté Grenoblois à la pointe des techniques modernes », aucun bouton ; puis quatre familles de soins à pictogrammes, « Depuis 20 ans » et des compteurs (« 1000 soins anti-âge… chaque année », « 98 % des clients reviennent », sans source), une longue page sur la marque Thalion avec ses photos de produits, une carte Google, l'adresse, les horaires (« Du mardi au vendredi 10h 18h30 non stop »), **un numéro sans lien `tel:`**. Le bloc « Ils témoignent » est **mis en commentaire dans le code** avec trois noms de remplissage (« Paul Auchon »…) : bonne décision de ne pas l'afficher, mais il ne reste aucun avis. Une page Tarifs, la seule autre page.

**Leviers vus** : Photos réelles : aucune de l'institut (visuel d'accueil, produits de la marque). Premier écran : ville dans le h1, rien d'autre. Preuves : années, chiffres sans source, marque partenaire. Structure : deux pages (accueil à ancres, tarifs) ; contact au pied. Appels : aucun bouton, aucun `tel:`. Vitesse : page légère. Mobile : lisible, sans porte d'action. Signes « IA » : aucun (site de 2018).
