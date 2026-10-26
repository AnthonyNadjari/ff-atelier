# Era Ceramics — http://eraceramics.com/
Titre « Era Ceramics », `lang="?"`, description « Ceramics and dinnerware for the modern home and kitchen handmade in Austin, TX. », technologie lue : jQuery. Démontage automatique du 2026-10-26 (`ff demonter`, mesures brutes dans `eraceramics.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; pas de média plein écran (4 image(s) dans l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 0 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; pas de média plein écran (3 image(s) dans l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 0 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 3 lien(s) — Process, Shop, Contact ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div#push-cover` (1,2 écran, 0 mots, 0 img) → `div.content-wrap` « CLIENTS & COLLABORATORS » (6,4 écrans, 179 mots, 3 img). Calques hors flux (fixes/absolus) : `nav#c-menu--slide-bottom` (fixed, 620 px, collé en bas, 13 mots), `div#hero-wrap` (fixed, 900 px).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : 1 (3 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/eraceramics-d.webp` (mesuré : fond du premier écran #ffffff, 4 image(s) et 0 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 : non mesuré ; corps **Cormorant Garamond**, 60 px / 30 px téléphone, graisse 400, interlignage 1,25 ; boutons **ecsans-semi**, 58 px / 32 px téléphone, graisse 400 ; nav **ecsans-semi**, 23 px / 23 px téléphone, graisse 400, interlignage 1,60, interlettrage 1px.
Sources `@font-face` : auto-hébergée (ecsans-light, ecsans-semi) ; fichiers chargés : https://eraceramics.com/font/ecsans-semibold-webfont.woff2, https://eraceramics.com/font/ecsans-light-webfont.woff2. Familles en usage sur le texte visible : Cormorant Garamond ×44, ecsans-semi ×21. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #000000 (contraste 21,00:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (51 %), #f9f9ef (49 %) ; textes par nombre de caractères : #1a1a1a (73 %), #000000 (26 %), #ffffff (1 %). Images : 6 `<img>` visibles, 2 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.3s cubic-bezier(0.39, 0.575, 0.565, 1)` ×1, `background-color 0.4s ease-in-out` ×1, `all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)` ×1, `bottom 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)` ×1, `transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : `data-parallax` ×2, `data-speed` ×2. Ce qui bouge réellement à l'écran : à juger sur `captures/eraceramics-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.content-wrap` « CLIENTS & COLLABORATORS » (6,4 écrans, 179 mots, 3 image(s)).
2. L'élément le plus animé : `img.hero-logo` (attributs data-parallax, data-speed).
3. Le bloc le plus singulier par sa structure : `div.content-wrap` « CLIENTS & COLLABORATORS » (seule à contenir <svg>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : Cormorant Garamond ; boutons pilule : 0/1 ordinateur, 0/1 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu (jugé sur les captures, veille du 26 oct 2026, soir)

- **Polices** : EC Sans demi-gras (géométrique maison) pour les titres (92 px / 46 px) et la nav (23 px) ; texte en Garamond (Cormorant, liste IA) à 60 px ordinateur / 30 px téléphone, clients en italique séparés par des barres obliques. Libres : Urbanist 600 et EB Garamond (texte ramené à 24 px au plus).
- **Couleurs** : blanc d'argile #f9f9ef (fond, chroma 0,013), blanc #ffffff, presque noir #1a1a1a (texte), ocre #d1830d (aperçu de la page suivante et pied, où tout le fond glisse en 0,7 s).
- **Espacements** : texte en colonne de 40 caractères, marges de 180 px ; portraits décalés qui se chevauchent.
- **Formes** : aucun bouton, liens soulignés d'un filet pâle, angles droits ; monogramme fixe en haut à droite.
- **Photos** : deux assiettes vues du dessus côte à côte au premier écran, le nom par-dessus ; portraits des potiers sur fonds sauge et grège.
- **Mouvement** : fond qui glisse de la crème à l'ocre en bas de page (background-color 0,7 s ease-in-out), deux photos en data-parallax, survols à rebond 0,4 s cubic-bezier(.175,.885,.32,1.275).
- **Architecture** : histoire, portraits, clients et collaborateurs, aperçu de la page Procédé, nav Histoire / Procédé / Boutique / Contact.
- **Geste signature** : le texte de présentation en corps énorme, et le fond qui devient ocre pour annoncer la page suivante.
