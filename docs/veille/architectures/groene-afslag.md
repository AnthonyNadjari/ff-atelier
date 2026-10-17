# De Groene Afslag — architecture « le lieu qui publie : cartes de couleur empilées par activité, puis agenda et journal »

- Source : https://www.degroeneafslag.nl/ ; pages intérieures lues : `/agenda`, `/over-ons/gebouw` (démontées le 17 oct 2026). Fiche de goût antérieure : `docs/veille/demontages/degroeneafslag.md`.
- Métier : tiers-lieu à Bussum (Pays-Bas) : restaurant, hôtel, salles, école, atelier, programmation culturelle.
- Mesures : `groene-afslag-demontage.md`, `.json`, `-style.json`, captures `captures/groene-afslag-*`.

## Le modèle en une phrase

L'accueil empile les activités du lieu comme des **cartes de couleur qui se recouvrent** au défilement (chaque carte reste collée en haut pendant que la suivante monte dessus, une couleur franche par activité), puis bascule en **magazine** : l'agenda des prochains rendez-vous en cartes datées, et les nouvelles ; le site vit de ses publications (85 liens internes), avec un bouton « Agenda » toujours en haut.

## Schéma de l'accueil (12,4 écrans ordinateur, 12,8 téléphone)

```
[nav fixe à droite : « Agenda » (noir) | recherche | Menu (vert)] ; logo en lettres en désordre en haut à gauche
[photo du bâtiment plein écran, le nom posé dessus en étiquettes de couleur, mot tourné à la verticale sur le bord]
[h1 long : « De Groene Afslag est la maison du changement avec salles, restaurant, hôtel, programmation, atelier… »]
[vidéo de présentation dans une vieille télé posée de travers]
CARTE VERTE  « Restaurant » : titre-étiquette noir | accroche avec un mot en italique | texte | bouton | photo + objet détouré + bulle de texte
CARTE ROSE   « Hotel » (même grammaire)
CARTE JAUNE  « Zalen » (salles)
CARTE ORANGE « School »
CARTE BLEUE  « Werkplaats » (atelier)
   (chaque carte colle en haut, 5,3 écrans de course, le titre-étiquette va se ranger à côté du logo)
[« Agenda » : 3 à 4 rendez-vous en cartes datées + lien]
[« Nieuws » : articles en cartes (1 030 mots, 37 images)]
[newsletter, pied]
```

## Schéma d'une page intérieure

`/agenda` (11,7 écrans) : `[en-tête bleu nuit « Agenda vol impact. » + phrase] → [recherche + tri par date + filtres par catégorie en étiquettes (théâtre, dehors, anglais, gratuit, manger & boire, film…)] → [grille de 3 colonnes de cartes : photo, date en gros chiffres dans un carré blanc (jour, mois), étiquettes de catégorie, titre, horaire, lieu] × 50 → [newsletter]`.
`/over-ons/gebouw` (5 écrans) : page courte d'article sur le bâtiment (texte + photos).

## Navigation, contact, preuves, téléphone

- Pages : agenda, à propos (bâtiment, histoire, emplois), une page par activité, inspiration, questions, nouvelles ; réservation de l'hôtel vers un outil externe (Mews). Menu en panneau ; « Agenda » est la seule porte toujours affichée.
- Contact : téléphone et e-mail cliquables (pied et pages) ; réservation par activité.
- Preuves : l'agenda rempli (50 rendez-vous visibles), les nouvelles datées ; aucun avis.
- Téléphone : cartes de couleur empilées en une colonne, titre-étiquette collé en haut (48 px) ; agenda en une colonne ; bannière cookies couvrant 61 % de l'écran à l'arrivée.

## Rythme, texte et images, profondeur

Dense et joyeux : beaucoup de texte (1 500 mots et plus sur l'accueil), beaucoup de petites images (58, en 4:3, 20 à 35 % de largeur). Profondeur par **empilement** (cartes collantes qui se recouvrent, ombre portée `0 30px 70px` sous la carte du dessus) et par **collage** (objets détourés, bulles, étiquettes posées de travers).

## Style (à réappliquer tel quel)

- **Polices** : *Helvetica Neue* pour presque tout (h1 40 px / 24 px téléphone, interlignage 1,2 ; texte 16 / 14 px, interlignage 1,3 ; nav 18 / 16 px ; h3 64 / 32 px) ; *Times* romain et italique pour les grands titres et le mot mis en valeur (h2 72 / 40 px, interlignage 1) ; *Courier* pour les bulles et notes. Trois polices système de bureau, pas de police à la mode : c'est le parti pris.
- **Couleurs** (rôles) : grège `#e6e2da` = fond (48 %) ; noir `#1a1a1a` = texte (84 %) et boutons ; une couleur franche par activité : vert `#00a65d` (restaurant), rose `#ff8ac4` / `#ff9bc8` (hôtel), jaune `#f9c314` (salles), orange (école), bleu ciel `#81c5e2` (atelier) ; vert sauge `#72957a` et olive `#3c3f17` pour des boutons ; bleu nuit en en-tête de l'agenda.
- **Espacements** : cartes de couleur pleine largeur moins 8 px de marge ; texte de 410 px (~51 caractères) et 640 px (~71) ; grille d'agenda à 3 colonnes.
- **Rayons et bordures** : cartes de couleur à 20 px ; boutons droits (0 px) ou à 3,75 px ; date de l'agenda dans un carré blanc ; soulignés faits d'une ombre intérieure de 1 ou 2 px.
- **Ombres** : une ombre forte (`0 30px 70px` noir à 30 %) sous la carte qui recouvre.
- **Photos** : 4:3 sans filtre, rectangles nets ; objets détourés (robot, cloche d'hôtel, cerveau, mégaphone) collés autour ; une vidéo dans une télé détourée.
- **Boutons et liens** : boutons noirs rectangulaires 72 à 80 px de haut, texte blanc 18 px, une flèche dans un carré ; survol : `cubic-bezier(1, 0, 0, 1)` en 0,2 s (bascule nette).
- **Icônes** : 65 (catégories d'agenda, flèches, pictos d'activité dessinés en couleur).
- **Animations** : GSAP + ScrollTrigger ; apparitions au défilement (`data-animate` ×62, en cascade ×40) ; cartes collantes ; carrousels (Swiper).
- **Textures** : aucune ; le collage fait la matière.

## Ce qui le rend différent de notre déroulé

Les activités ne sont pas une grille de services mais des **chapitres de couleur** qui se recouvrent, et la deuxième moitié du site est un **journal vivant** (agenda filtrable, nouvelles) : le site change chaque semaine. Notre déroulé est figé et n'a pas de rendez-vous datés.

## Ce qu'il faudrait à l'usine

- **Section** `services/cartes-empilees` : une carte de couleur par service (token de couleur par service, `data-theme`), `position: sticky` en cascade ; le titre de la carte qui se range dans l'en-tête (geste n° 7 de l'INDEX des démontages).
- **Type de contenu** `agenda[]` (date, heure, titre, catégorie, lieu, lien, photo) + page `/agenda` filtrable par catégorie (filtres CSS `:has()` sans JS, comme prévu pour la galerie) + bloc « prochains rendez-vous » sur l'accueil ; masquer les dates passées au build (et reconstruire chaque semaine, ou lire un calendrier public).
- `conseils[]` (articles) existe déjà : il sert de rubrique « nouvelles ».

Coût : **moyen** (une section, un type de contenu et une page ; le blog existe).

## Convient à (selon les données du client)

Client qui **organise des choses datées** et les met à jour : ferme avec marchés et visites, librairie, caviste avec dégustations, atelier avec stages et cours, salle de spectacle ou de réception, restaurant avec soirées, tiers-lieu, association. Les cartes empilées seules conviennent à tout client à **3 à 6 activités** très différentes. Inadapté à qui ne publiera rien.

## Signes IA à NE PAS reprendre (GOUT § 2)

- **Mot en italique** dans chaque accroche (« Voer voor je *brein* en je *buik* ») : l'emphase en italique est refusée.
- Étiquettes de catégorie en **pilules** dans l'agenda.
- Couche de chargement couvrant 100 % de l'écran à l'arrivée et bannière cookies à 61 % au téléphone.
- Accroches en cadence de deux (« Anders leren. Anders doen. »).
