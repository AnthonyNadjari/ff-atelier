# Nishiyama — https://nishiyamasilk.com/
Titre « Home | Nishiyama », `lang="en"`, technologie lue : jQuery. Démontage automatique du 2026-10-26 (`ff demonter`, mesures brutes dans `nishiyama.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; pas de média plein écran (6 image(s) dans l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 3 mots visibles au-dessus du pli ; aucune couche bloquante ; bouge tout seul sans défilement : 1 élément(s) (`img.levitation`).
Téléphone (390x844) : h1 absent ; pas de média plein écran (1 image(s) dans l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 1 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : non mesuré.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.panels-flexible-row-homepage-17` (1,1 écran, 3 mots, 6 img) → `div.panels-flexible-row-homepage-main-row` (0,1 écran, 5 mots, 0 img) → `div.panels-flexible-row-homepage-1` « Region & History » (0,7 écran, 155 mots, 2 img) → `div.panels-flexible-row-homepage-8` (1,1 écran, 0 mots, 1 img) → `div.panels-flexible-row-homepage-9` « The Company » (0,4 écran, 116 mots, 0 img) → `div.panels-flexible-row-homepage-10` (0,9 écran, 0 mots, 1 img) → `div.panels-flexible-row-homepage-11` (0,8 écran, 0 mots, 1 img) → `div.panels-flexible-row-homepage-12` « The Product » (0,9 écran, 252 mots, 2 img) → `div.panels-flexible-row-homepage-13` « Our Clients » (2,2 écrans, 145 mots, 4 img).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/nishiyama-d.webp` (mesuré : fond du premier écran #f1ead8, 6 image(s) et 3 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 **Pathway Gothic One**, 42 px / 42 px téléphone, graisse 400, interlignage 1,40 ; corps **Karla**, 14 px / 14 px téléphone, graisse 400, interlignage 1,29 ; boutons : non mesuré ; nav : non mesuré.
Sources `@font-face` : feuilles d'origine croisée non lisibles (). Familles en usage sur le texte visible : Karla ×18, Pathway Gothic One ×8. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff (premier écran #f1ead8), texte #222222 (contraste 15,91:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (86 %), #f1ead8 (10 %), #222222 (4 %) ; textes par nombre de caractères : #434242 (78 %), #ffffff (18 %), #000000 (3 %), #222222 (1 %), #475885 (0 %). Images : 15 `<img>` visibles, 1 fond(s) en image, 2 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : GSAP (window.TweenMax), jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `animation levitation 2.5s ease-out infinite` ×3, `animation levitation 3s ease-out infinite` ×1, `animation levitation 1.5s ease-out infinite` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/nishiyama-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.panels-flexible-row-homepage-13` « Our Clients » (2,2 écrans, 145 mots, 4 image(s)).
2. L'élément le plus animé : `img.levitation` (animation animation levitation 2.5s ease-out infinite).
3. Le bloc le plus singulier par sa structure : `div.panels-flexible-row-homepage-17` (seule à contenir <iframe>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : rien de mesurable.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/0 ordinateur, 0/0 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu (jugé sur les captures, veille du 26 oct 2026, soir)

- **Polices** : Pathway Gothic One (grotesque très condensée, casse normale) 42 px pour les titres de section, 18 px en capitales pour la nav (Oswald) ; Karla 14 px pour le texte en colonne étroite centrée.
- **Couleurs** : blanc #ffffff (sections de texte), écru #f1ead8 (premier écran), anthracite #222222 (bandes entre les photos), gris #434242 (texte), indigo #475885 (liens rares).
- **Espacements** : texte centré en colonne étroite, grandes photos plein cadre entre les chapitres.
- **Formes** : aucune carte, aucun bouton plein ; liens soulignés.
- **Photos** : tissus, cocons et artisans découpés en galets aux bords souples qui débordent et se chevauchent ; photos d'atelier et de village enneigé en plein cadre.
- **Mouvement** : les galets flottent (translateY 0 à 10 px, animation levitation 1,5 / 2,5 / 3 s ease-out en boucle) ; titres en fondu d'environ 0,9 s. Profil nouveau `photos-qui-flottent` (MOUVEMENTS.md).
- **Architecture** : une longue page : région et histoire, procédé, citation, clients, collection, contact.
- **Geste signature** : la soie découpée en galets qui flotte.
