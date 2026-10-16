# Monarque Événements — https://monarque-evenements.com/
Maison de création et de production d'événements (corporatifs, galas, privés), Québec (Canada), site en français (`lang="fr-CA"`), fondatrice nommée sur la page. Awwwards Honorable Mention du 25 août 2026 (awwwards.com/sites/monarque-evenements). WordPress (thème `monarque`, Tailwind), Lenis ; animations maison par attributs `data-animate-element="fade|image|split"`, `data-parallax`, `data-magnet`.

## Squelette
Nav fixe minimale : logo centré, « Menu » à droite (À propos / Services / Réalisations dans le menu). Le formulaire « Planifier votre événement » (prénom, nom, adresse…) est dans un panneau caché dès le haut du DOM, ouvert par le seul bouton du hero. Ordre : fond bordeaux plein, **cinq photos de taille différente éparpillées autour du titre** (verre de vin, service, groupe sur scène, fleurs, plateau de fromages) → « À propos » épinglé sur 300vh (`lg:h-[300vh]`) : une phrase-manifeste en capitales sur fond bleu nuit, **le portrait de la fondatrice grandit au centre** à travers le texte → services en 4 colonnes (Événements corporatifs, Galas, Événements privés, Conception et production) → réalisations : titre avec **une photo insérée entre deux mots** (« Expérience [photo] privée ↘ ») et une bande de vignettes à faire défiler → le lieu partenaire (« La Maison Chevalier », Vieux-Québec, « Capacité de 100 personnes ») → logos de collaborateurs → CTA final dans un disque orange dégradé → pied avec le nom en très grand.
En 3 secondes : un titre de deux mots en capitales sur bordeaux, des photos de soirée autour.

## Typographie
Lues dans le CSS : titres **Columbia** (`columbia_serial-regular.ttf`, auto-hébergée), capitales à empattements fins, H1 120 px ordinateur / 50,7 px téléphone, interlignage 1,5 ; corps **Overused Grotesk** Book/Semibold 16 px. Rare : un display classique en capitales à interlignage large (1,5) qui laisse les photos passer entre les lignes.

## Couleur et matière
Bordeaux `#4C181A` (fond du hero, texte ailleurs, ×34), grège `#DED9D7` (fond et texte clair, ×27), bleu nuit `#232E51` / `#1D2642`, bleu gris `#849BB9`, orange `#DF5616` (disque final), vieux rose `#B99184`. Photos réelles d'événements (lumière de scène, buffets, fleurs), photo du lieu partenaire.

## Mouvement
Lenis (`data-lenis-prevent` sur le panneau). Attributs maison : 15 `fade`, 5 `image`, 4 `split` (titres découpés), 2 `parallax`, 2 `magnet` (boutons magnétiques). CSS : `cubic-bezier(.4,0,.2,1)` sur 0,2 à 0,7 s, `transition: all` partout, `@keyframes fadein 1s`. Le portrait qui grandit au centre du manifeste est lié au défilement (planche : petit puis grand sur deux vignettes successives).

## Le geste signature
La photo glissée dans la ligne du titre, entre deux mots, à la hauteur des capitales (« Expérience [photo] privée ») : le titre montre ce qu'il nomme. Chez nous : CSS pur, `<img>` en `display: inline-block; height: 0.8em; vertical-align: baseline` dans le `<h2>`, `alt` descriptif ; marche dans `Hero/typographic` ou un titre de section ; aucune animation nécessaire.

## Ce qu'on garde / ce qu'on refuse
Garde : la photo dans le titre ; le portrait de la personne qui porte l'entreprise au milieu de son texte ; la capacité du lieu en chiffre réel (100 personnes) ; le formulaire de demande derrière un seul bouton.
Refuse : le disque orange en dégradé radial du CTA (halo, GOUT § 2) ; les photos éparpillées qui recouvrent le titre sur téléphone (capture : la photo de fleurs mange « Inoubliable ») ; un pin de 300vh pour une phrase (GOUT § 4) ; boutons magnétiques et `transition: all` (GOUT § 8).
