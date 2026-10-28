# Medical Plus — https://demo.goodlayers.com/medicalplus/
Titre « Medical Plus », `lang="en-US"`, technologie lue : WordPress, jQuery. Démontage automatique du 2026-10-28 (`ff demonter`, mesures brutes dans `tf-medical-plus.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; pas de média plein écran (26 image(s) dans l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 119 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; pas de média plein écran (23 image(s) dans l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 67 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : non mesuré.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.top-navigation-wrapper` (0,0 écran, 5 mots, 6 img) → `div.header-wrapper` (0,5 écran, 4 mots, 3 img) → `div.gdl-navigation-wrapper` (0,1 écran, 12 mots, 0 img) → `div.page-container` « Medical WP Theme » (1,9 écran, 301 mots, 10 img) → `div.footer-container` « Recent Comments » (0,5 écran, 70 mots, 3 img).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : 1 (3 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/tf-medical-plus-d.webp` (mesuré : fond du premier écran #476f94, 26 image(s) et 119 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Lato**, 33 px / 33 px téléphone, graisse 100, interlignage 1,00 ; h2 **Lato**, 25 px / 19 px téléphone, graisse 100, interlignage 1,00 ; corps **Lato**, 12 px / 14 px téléphone, graisse 400, interlignage 1,65 ; boutons **Lato**, 12 px / 12 px téléphone, graisse 400, interlignage 1,65 ; nav : non mesuré.
Sources `@font-face` : feuilles d'origine croisée non lisibles (fonts.googleapis.com) ; fichiers chargés : https://fonts.googleapis.com/, https://fonts.googleapis.com/css?family=Droid+Serif:subset=latin:n,i,b,bi|Lato:subset=latin:n,i,b,bi|&ver=6bce218e98ec41f2213caae801c6a932. Familles en usage sur le texte visible : Lato ×92, Arial ×1. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #eaeaea (premier écran #476f94), texte #828282 (contraste 3,19:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #eaeaea (47 %), #ffffff (31 %), #476f94 (9 %), #f7f7f7 (6 %), #f9f9f9 (3 %) ; textes par nombre de caractères : #828282 (50 %), #41607d (13 %), #a7a7a7 (6 %), #909090 (6 %), #8b8b8b (5 %). Images : 6 `<img>` visibles, 26 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `color 0.3s ease` ×36, `background-color 0.3s ease` ×36, `all 0.3s ease` ×2. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/tf-medical-plus-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.page-container` « Medical WP Theme » (1,9 écran, 301 mots, 10 image(s)).
2. L'élément le plus animé : `a` (2 transition(s) : color 0.3s ease ; background-color 0.3s ease).
3. Le bloc le plus singulier par sa structure : `div.gdl-navigation-wrapper` (seule à contenir <select>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/3 ordinateur, 0/3 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Verdict marché (veille du 28 oct 2026, tour 13)
Source : ThemeForest, recherche « local business » triée par ventes (https://themeforest.net/search/local%20business?sort=sales, lue par WebFetch : Chromium tombe sur la vérification Cloudflare) : rangs 1 à 9 annuaires, petites annonces, constructeurs de pages et thèmes d'entreprise ; rang 10 Bodega toujours injoignable depuis le proxy ; CarPress (rang 11) déjà fiché ; **rang 13 Medical Plus** (GoodLayers, 2 817 ventes, mis à jour le 13 oct 2026, [page du modèle](https://themeforest.net/item/medical-plus-responsive-medical-and-health-theme/3015457)), cabinet médical, le plus proche du dentiste de `docs/OBJECTIF.md`. URL lue : https://demo.goodlayers.com/medicalplus/ (HTML 13 Ko, premier octet 0,92 s, indicatif). Captures et planche regardées.

**Un artisan paierait-il 1 200 € pour ça ?** Non : un vieux thème (encore mis à jour en 2026) qui se vend encore pour son plan, pas pour son allure. Au téléphone : réseaux sociaux, logo, **« Call Us : 1800-4353-4454 » en gros sous le logo** (sans lien `tel:`), un menu en liste déroulante native, un diaporama de photos de banque (famille et blouses blanches), « What we do? » en six services, « Why you need to choose us? », visite en vidéo YouTube, FAQ, témoignages, « Meet the Doctors » nommés par spécialité, « Make an Appointment » (téléphone, e-mail, horaires, formulaire), derniers commentaires du blog en pied. Défauts : **tout en lorem ipsum**, témoignage signé « David Beckham, Footballer », aucun h1, numéro sans lien, Google Analytics chargé sans bannière, aucun prix.

**Leviers vus** : Photos : banque. Premier écran : numéro en grand au-dessus de tout. Preuves : témoignages et médecins factices. Structure : plusieurs pages (blog, portfolio, personnel, FAQ, contact). Appels : rendez-vous (formulaire en bas), téléphone écrit. Vitesse : HTML 13 Ko. Mobile : menu en `<select>`, colonnes empilées.
