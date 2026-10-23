# ACE Hôtel — https://ace-hotel.com/
Titre « ACE Hôtel, des chambres tout confort au meilleur tarif garanti », `lang="fr"`, description « Retrouvez tous les hôtels ACE. Plus qu'une chaîne hôtelière, ACE Hôtel est un espace dédié à votre bien-être et à votre confort, fidèle à la tradition d'accuei… », technologie lue : generator « Gatsby 5.16.1 », Gatsby. Démontage automatique du 2026-10-23 (`ff demonter`, mesures brutes dans `acehotel.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « Bienvenue chez ACE Hôtel » ; vidéo plein écran (70 % de l'écran) ; bouton principal « RÉSERVER » en bas à droite (1037, 618 px) ; 32 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « Bienvenue chez ACE Hôtel » ; pas de média plein écran (4 image(s) dans l'écran) ; bouton principal « RÉSERVER » à mi-hauteur au centre (0, 512 px) ; 43 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 5 lien(s) — [Menu], ACE Hôtel, Nos hôtels, Offres spéciales, [Compte] ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `section.section` « Bienvenue chez ACE Hôtel » (0,8 écran, 26 mots, 1 img) → `section.section` « Les offres du moment » (0,6 écran, 57 mots, 3 img) → `section.section-clouds` « Accueillant, spacieux et généreux, touj… » (1,0 écran, 52 mots, 10 img) → `section.section-blue` « Nos destinations » (0,6 écran, 77 mots, 65 img) → `footer.footer` (0,4 écran, 36 mots, 0 img). Calques hors flux (fixes/absolus) : `iframe.CybotCookiebotOffscreenIframe` (absolute, 4 px), `div#gatsby-announcer` (absolute, 1 px), `header.header` (sticky, 80 px, 6 mots).
Pied de page : 9 lien(s) — ACE Hôtel, [S’INSCRIRE], [Facebook], [Instagram], Contact, Carrières, Mentions légales, Charte de protection des données personn, Ultro. Téléphone cliquable : non. Formulaire : 2 (4 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Menu » (), « RÉSERVER » ().
En 3 secondes : à juger sur `captures/acehotel-d.webp` (mesuré : fond du premier écran #ffffff, 4 image(s) et 32 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Jost**, 48 px / 24 px téléphone, graisse 500, interlignage 1,20 ; h2 **Jost**, 34 px / 24 px téléphone, graisse 500, interlignage 1,24 ; corps **Jost**, 18 px / 16 px téléphone, graisse 400, interlignage 1,44 ; boutons **Jost**, 18 px / 16 px téléphone, graisse 400, interlignage 1,44 ; nav **Jost**, 16 px / 16 px téléphone, graisse 400, interlignage 1,50.
Sources `@font-face` : Google Fonts (Jost) ; fichiers chargés : https://fonts.gstatic.com/l/font?kit=92z8tBhPNqw79Ij1E865zBUv7myjJWdNHHnUBkLNPUtGJfpmPRTI&skey=4145fd5d1d5ac665&v=v20, https://fonts.googleapis.com/css?family=Jost:400,400i,500,500i,700,700i&display=swap. Familles en usage sur le texte visible : Jost ×82. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #727272 (contraste 4,81:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (50 %), #0b2246 (30 %), #e5f1f4 (8 %), #edbc92 (3 %), #f2967f (3 %) ; textes par nombre de caractères : #ffffff (49 %), #171930 (38 %), #727272 (12 %), #a5a5a5 (2 %). Images : 77 `<img>` visibles, 4 fond(s) en image, 2 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : aucune détectée (window.* et noms de scripts). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `opacity 0.5s linear` ×35, `opacity 0.25s linear` ×35, `transform 0.5s ease` ×33, `border-color 0.2s ease` ×17, `color 0.2s ease` ×9, `background-color 0.2s ease` ×7, `border-color 0.15s ease` ×5, `all 0.1s ease` ×5, `opacity 0.2s ease` ×4, `fill 0.2s ease` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 1 bloc(s) de plus d'un écran (`header.header` 3,6 écrans). Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/acehotel-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `section.section-clouds` « Accueillant, spacieux et généreux, touj… » (1,0 écran, 52 mots, 10 image(s)).
2. L'élément le plus animé : `div.swiper-pagination` (animation animation fade-in 1s ease ; 1 transition(s) : opacity 0.3s ease).
3. Le bloc le plus singulier par sa structure : `section.section` « Bienvenue chez ACE Hôtel » (contient <video>, <form>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« Menu », « RÉSERVER »), formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/5 ordinateur, 0/6 téléphone ; vidéo en premier écran : oui ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
