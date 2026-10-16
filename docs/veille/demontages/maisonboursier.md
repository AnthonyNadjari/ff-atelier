# Maison Boursier — https://www.maisonboursier.com/
Graveur héraldique (chevalières, armoiries, médailles, timbales), Louis Boursier, Meilleur Ouvrier de France (texte du site), boutique à Paris (photo « La boutique Maison Bovrsier »), site en français. Awwwards Honorable Mention du 3 avril 2026 (awwwards.com/sites/maison-boursier). WordPress (thème `solanum`), Lenis.

## Squelette
Nav réduite à deux mots sur la vidéo : « Journal » (avec un pictogramme gravé) à gauche, « Contact & Devis » à droite, emblème au centre ; ensuite une **barre verticale fine collée à gauche** avec le burger (planche) ; sur téléphone, le burger est **en bas à droite**, dans une barre basse (`nav` sticky à 766 px du haut sur 844). Le contact est un seul e-mail (`boursiergraveur@gmail.com`, ×4), pas de téléphone. Ordre : vidéo macro plein écran **du burin qui grave une chevalière**, « Maison Bovrsier » en capitales lapidaires (V pour U) → « Gravez votre histoire » + texte MOF + photos d'atelier → bibliothèque et boutique → « Portez vos armoiries » (7 976 px, la plus longue) : la chevalière portée, sections Chevalière / Vos armoiries, notre savoir-faire / Tous vos projets personnalisés / Nos médailles gravées, chacune avec **un pictogramme gravé en taille-douce au-dessus du titre** → « Des chevalières uniques » : réalisations en carrousel (Chevalière iconique, Gravure en taille-douce…) → « Nos dessins et peintures » (gouache du blason) → « Le guide de l'initié » (journal) → pied.
En 3 secondes : la pointe d'un burin dans le métal, un nom gravé.

## Typographie
Lues dans le CSS (fichiers variables auto-hébergés dans le thème) : titres **Cormorant** (variable, romain et italique), H1 « Gravez votre histoire » 128 px ordinateur / 56 px téléphone, graisse 500, interlignage 1, capitales avec **les petits mots en italique bas-de-casse** (« Gravez *votre* histoire », « Portez *vos* armoiries », « Le guide *de* l'initié ») ; texte **Bricolage Grotesque** (variable) 16 px, graisse 300. Le logotype « BOVRSIER » est dessiné (V romain).

## Couleur et matière
Fond gris clair `#F1F1F1` (`rgb(241,241,241)`) et `#EBEBEB`, texte `#0B0B0B`, blanc, aucun accent. Photos et vidéos réelles en gros plan : mains, burin, cire, chevalières en or et argent, médailles dans une paume, timbale qui déborde d'eau ; gouache de blason. Pictogrammes gravés (main, rouleau, outils) en noir.

## Mouvement
Lenis. CSS lu : `transform .4s ease-out`, `opacity 1s` et `color .4s` sur une courbe nommée `--ease-by-thomas` = `cubic-bezier(.6,0,.2,1)` (×6), `clip-path .3s ease-out` (×6), `position: sticky` ×54 (colonnes de texte qui restent pendant que les photos défilent, planche). Un écran de chargement « (100 %) » et un rideau de transition (`.transition`). 5 `<canvas>`. Notre navigateur sans GPU a planté au défilement à la molette (deux fois) ; la planche a été faite par `scrollTo`.

## Le geste signature
Un pictogramme gravé dans la technique même du métier (taille-douce) au-dessus de chaque titre de section : la signature de l'atelier sert de séparateur. Chez nous : SVG fourni ou vectorisé depuis un poinçon / tampon du client, posé en `mask-image` coloré par `currentColor` (technique A14), une taille fixe, aucune animation ; transposable au boulanger (marque de grigne), au menuisier (marque au fer).

## Ce qu'on garde / ce qu'on refuse
Garde : la vidéo macro du geste remplacée chez nous par une séquence d'images (`data-frames`, CLAUDE.md : pas de vidéo essentielle) ; « Contact & Devis » comme seul bouton de nav ; le titre MOF en texte, pas en badge ; les pictogrammes d'atelier ; la gouache du blason montrée comme une étape du travail.
Refuse : Cormorant et l'emphase en italique des petits mots (GOUT § 2) ; un seul e-mail Gmail sans téléphone ni adresse de boutique au premier écran ; l'écran de chargement à pourcentage ; une page de 17 000 px qui fait planter un navigateur sans GPU.
