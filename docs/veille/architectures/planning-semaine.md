# planning-semaine : le site d'une école est son planning de la semaine

Volet 2a ter de `/veille`, tour du 27 oct 2026 (tour 11). Relevé au `curl` (HTML servi) de Danse Germain Blanchet
(`/planning-des-cours/` ; l'accueil répond 406 à `curl` et la page du planning 502 au navigateur sans tête : démontage
automatique refusé, fiche faite à la main) et démontage automatique d'Ell'Zi-Danse (`node scripts/ff.mjs demonter
https://ellzidanse.fr/planning-cours-danse/ --dossier <scratch> --nom source-ellzidanse`, captures non versionnées) avec
relevé au `curl` de son accueil. On reprend la construction, jamais les textes, images, logos ou code des sources.

## Sources

- **Danse Germain Blanchet** (école de danse à Rouen, deux sites : Rive Droite et Rive Gauche ; WordPress). URL lue le
  mardi 27 oct 2026 : [centre-danse-rouen.com/planning-des-cours](https://centre-danse-rouen.com/planning-des-cours/).
- **Ell'Zi-Danse** (école de danse à Saintes, trois professeurs nommés, « l'école a fêté ses 10 ans » ; WordPress,
  MaRecetteWeb). URL lues le 27 oct 2026 : [ellzidanse.fr](https://ellzidanse.fr/),
  [ellzidanse.fr/planning-cours-danse](https://ellzidanse.fr/planning-cours-danse/).
- Trouvées en cherchant « école de danse planning des cours lundi mardi mercredi salle professeur inscription ».

## Pages

Germain Blanchet : une vingtaine (une page par discipline : salsa cubaine, West Coast Swing, rock, modern'jazz, hip-hop,
dancehall, danse orientale, claquettes, Zumba, barre au sol ; stages et pratiques ; **Cours d'essai** ; **Planning** ;
Tarifs ; Événements ; Mariage et EVJF ; vidéo ; galerie ; contact). La page Planning : la saison (« Du lundi 7 septembre
2026 au samedi 26 juin 2027 »), « Pas de cours du 19 décembre au 4 janvier », les disciplines, une FAQ (« un cours
d'essai à 10 € est proposé avant toute inscription »), puis **« Planning rive droite »** : un titre par jour, chaque cours
en une ligne « 18:10 – 19:10, Barre au sol, Niveau Tous niveaux, Salle Grande salle, Prof Catherine, Cours 1h, Tarif C ».
Ell'Zi-Danse : une quinzaine (l'école, professeurs, six disciplines, planning, inscription et tarifs, quatre pages
d'événements, contact) ; son planning est **la semaine en colonnes** (lundi à samedi, une ligne par heure) avec un filtre
« Toutes les danses » et 23 cours nommés (« Eveil 1 "Minnie" (4 ans) »).

## Navigation

Germain Blanchet : barre de neuf entrées, « Cours » déplié en disciplines, **« Planning » et « Cours d'essai » à part**,
un bandeau « À l'affiche » des prochains événements au-dessus. Ell'Zi-Danse : barre de neuf entrées, « Planning » et
« Inscription / Tarifs » à part.

## Accueil (Ell'Zi-Danse, mesuré ; Germain Blanchet non lisible au `curl`)

Le h1 « École Ell'Zi-Danse à Saintes », une vidéo, « Bienvenue », les professeurs nommés et diplômés d'État, quatre portes
vers les danses, l'agenda des stages, le pied. **L'accueil ne montre aucun horaire** : le planning est une page plus loin,
alors que c'est la question de tout nouvel élève (« quel soir ? »). **C'est la transposition** : l'usine met la semaine à
la place de l'accueil, le jour même ouvert.

## Contact et preuves

Téléphone et formulaire ; le cours d'essai comme porte d'entrée (10 € chez Germain Blanchet, déductible à l'inscription
ailleurs) ; « En cas de doute sur une heure précise… contactez-nous ». Preuves : les professeurs nommés, l'ancienneté,
les spectacles et les stages ; aucun avis sur les deux accueils.

## Style des sources (pour mémoire, non repris)

Germain Blanchet : émojis devant chaque danse, rose et noir. Ell'Zi-Danse : vidéo d'intro, titres en capitales, tableau
coloré par cours. On ne reprend que l'architecture ; le style vient des atomes (`ff melanger`).

## Ce qu'il faut à l'usine

- `planning` : `saison`, `pause`, `essai` (texte, prix), `cours[]` (jour, début, fin, nom, `service` = la discipline,
  niveau, salle, lieu, professeur, note). La durée se tire des heures, jamais saisie.
- Une coquille dont l'accueil est la semaine : un onglet par jour au téléphone (le jour même ouvert), les jours en colonnes
  à l'ordinateur, un filtre par discipline ; le premier cours et l'adresse dans le même bloc ; les avis ; un pied court.
- Les créneaux de chaque discipline sur sa page ; `/planning` imprimable avec la saison et les périodes sans cours.

## Convient à

École ou studio à cours réguliers dont on choisit le créneau : école de danse, studio de yoga ou de pilates, boxe, arts
martiaux, école de musique, piscine à leçons, atelier de dessin ou de poterie à séances fixes, club d'escalade ; 6 cours
sur 2 jours au moins, idéalement un cours d'essai. Pas pour des stages datés seulement (`cartes-empilees-agenda`), ni pour
une progression par niveaux sans horaire fixe (`parcours-atelier`).

## Signes à ne pas reprendre

Planning en PDF à télécharger ; émojis devant chaque danse ; texte de référencement répété (« planning cours de danse
Rouen » cinq fois sur la page) ; bandeau d'événements qui s'ouvre seul ; tableau heure par heure plein de cases vides ;
vidéo d'intro en tête.

## Codée dans l'usine (27 oct 2026)

`layout: { architecture: 'planning-semaine' }` (`src/lib/architectures.ts`) : coquille `planning` (`src/shells/planning.astro`),
`planning` dans le schéma, `src/lib/planning.ts` (`coursValides`, `joursDuPlanning`, `disciplines`, `dureeDuCours`,
`heureLisible`, `coursDuService`, `lienPlanning`), `src/components/CreneauxDuCours.astro` (page de discipline et
`/planning`), `src/pages/planning/[...index].astro`, mesure `planning`, `wording.planning` et `wording.essai`, pied
`minimal`. La nav garde « Le planning » seul (les disciplines se trouvent par le planning). Restent : deux sites d'une même
école en onglets (Rive Droite / Rive Gauche : `cours[].lieu` est affiché, pas encore filtrable), la grille des tarifs par
code (« Tarif A », « Tarif C »).

Preuve : site jetable (école de danse d'essai, douze cours sur cinq jours, quatre disciplines, cours d'essai à 10 €, trois
avis d'essai ; copie de `_exemple`, sans photo, supprimée), `ff verifier` vert hors données de test (`ff a11y`, `ff typo`,
`ff ia` compris), `ff ressemblance` contre tous les sites du registre : 0,59 au premier écran téléphone
(fromagerie-ravanel-d), 0,54 ordinateur (jardins-mael), 0,55 au déroulé (prospect-epi-dor-c) ; modèle de navigation
« onglets », aucun autre site du registre. Essais refusés : la semaine seule, puis le premier cours, les avis et l'école
en blocs séparés avec un pied à colonnes (onglets à 18 % de la page : modèle « plusieurs pages », déroulé 0,66 à 0,72 de
huit sites) ; puis le premier cours et l'école à côté de la semaine mais hors du bloc des onglets (26 %, 0,65 à 0,70 de
quatre sites). Passé quand le premier cours et l'école sont entrés dans le bloc de la semaine (la semaine tient 53 % de
la page).
