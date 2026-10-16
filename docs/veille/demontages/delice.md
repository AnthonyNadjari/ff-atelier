# Délice — https://delice.ca/
Restaurant-pizzeria-bar « depuis 1970 », Lévis (Québec), site en français (`lang="fr"`). Awwwards Nominee du 24 septembre 2026 (awwwards.com/sites/delice). WordPress + thème maison (`wp-content/themes/delice`), modules `data-module-*` (boilerplate Locomotive, lu dans le HTML), transitions de page Swup, Lenis.

## Squelette
Bandeau du haut qui fait défiler les offres du jour (« Happy hour tous les jours de 14 h à 18 h », « Spéciaux du midi », « Fish & chips tous les mardis », « Mercredélice 20 % de rabais ») entre deux doubles filets, puis nav centrée autour du logo (Les menus, Le restaurant / logo / Programmation, Salons privés), en-tête fixe 156 px. **Barre d'actions collée en bas de l'écran** : « Venir au Délice » (Google Maps), « Réserver », « Commander en ligne », « Carte cadeau ». Ordre : hero titre + photo découpée en forme organique → les menus → « Plaisirs du jour » (carrousel d'assiettes rondes, titre sur un arc) → chiffres (160 employés, 1970, 700 places, 300 en terrasse, dans des disques de couleur) → programmation des concerts avec dates → « On engage » + offres d'emploi en accordéon → salons privés → à emporter → pied avec **horaires par jour** (carrousel Flickity ouvert sur le jour courant, une ligne par service : salle, bar, déjeuner, happy hour, à emporter, livraison).
En 3 secondes : un mur rouge, un titre aux lettres dansantes, une assiette, quatre boutons d'action.

## Typographie
Lues dans le CSS (`@font-face` auto-hébergées) : titres **Ivy Mode** SemiBold, corps **Filson Soft** Regular/Medium, accent **Miller Banner** Italic. Le titre du hero n'est pas du texte HTML simple : chaque lettre est posée sur un tracé SVG (`.c-hero_paths`, `<path data-hero="path">`) d'où la ligne de base ondulée et les tailles variables ; H1 réel = « Pizza Délice depuis 1970 » en Filson Soft 18 px capitales. « On engage » 48 px ordinateur / 32 px téléphone, interlignage 1. Ce qui la rend rare : un titre de display qui ondule comme une enseigne peinte, pas un effet de survol.

## Couleur et matière
Fond rouge `#DE2B2B` (couleur du corps lue en `rgb(222,43,43)`), texte crème `#F8EFDC`, bordeaux `#7C2627`, puis sections pleines bleu nuit, vert sapin, turquoise, olive (lues sur la capture, hex non lus). Photos réelles (personnel en cuisine, salle, assiettes vues de dessus), détourées en formes organiques par `mask-image` (61 occurrences dans le CSS). Motifs liquides en fond de section.

## Mouvement
Lenis, Swup (transitions de page), Flickity (carrousels), `data-module-parallax` ×12 (`data-parallax-speed="25"`), `data-module-curved-text` ×3, `data-module-bulge` (un `<canvas>` WebGL sur le hero). Courbe dominante lue : `cubic-bezier(.23,1,.32,1)` ×25 (out-quint), `transform .6s`, `clip-path .4s`. Pas de GSAP.

## Le geste signature
Les horaires en pied de page ouverts sur le jour même, avec une ligne par service (salle, bar, happy hour, emporter, livraison) et des flèches pour changer de jour. Chez nous : bloc `Horaires` sur mesure, CSS pur (piste `scroll-snap` + `::scroll-button`, technique A3 déjà notée), jour courant choisi par un script de 10 lignes ; aucune animation.

## Ce qu'on garde / ce qu'on refuse
Garde : la barre d'actions collée en bas (Venir, Réserver, Commander, Carte cadeau), au-dessus de la barre iPhone (C6) ; le bandeau des offres du jour ; les horaires par service et par jour ; les offres d'emploi sur l'accueil, vrai fait de métier.
Refuse : les chiffres en disques de couleur (160, 700, 300 : badges décoratifs, GOUT § 2 et § 8) ; le titre sur tracés SVG lettre à lettre (illisible pour un lecteur d'écran, coûteux à décliner) ; la déformation WebGL du hero ; le bandeau qui défile tout seul (GOUT § 4 : rien ne tourne tout seul).
