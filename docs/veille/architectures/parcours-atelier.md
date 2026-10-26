# parcours-atelier : le site est une échelle, du premier essai à la pratique libre

Volet 2a ter de `/veille`, tour du 26 oct 2026. Démontage automatique (`node scripts/ff.mjs demonter
https://www.turningearth.uk/ --dossier docs/veille/architectures --nom turning-earth` : fiche
[turning-earth-demontage.md](turning-earth-demontage.md), mesures `turning-earth.json`, captures dans `captures/`, non
versionnées) et relevé au `curl` des pages intérieures (Classes, Membership, Open-Studio Pass, Hoxton). On reprend la
construction, jamais les textes, images, logos ou code de la source.

## Source

- **Turning Earth Ceramics** (ateliers de céramique en entreprise sociale, Londres, depuis 2013 ; trois ateliers :
  Hoxton, Leyton, Highgate, plus des cours au Camden Art Centre). Site Webflow. URL lues le lundi 26 oct 2026 :
  `https://www.turningearth.uk/` (Chrome, 1440x900 et 390x844), `/robots.txt` (tout autorisé), `/classes`,
  `/membership`, `/open-studio-pass`, `/hoxton`.
- Limite : les pages de réservation (cours datés, paiement) sont un outil tiers ; seule l'ossature (barreaux, ce que
  chacun comprend, le passage au suivant, les ateliers) est reprise.

## Pages

Une trentaine : accueil ; **les barreaux** (cours tous niveaux, tour, ateliers et stages, intensifs, intermédiaire,
enfants ; adhésion ; carte de séances libres ; « In Production » pour les céramistes établis) ; une page par atelier
(Hoxton, Leyton, Highgate) ; toutes les classes en une page ; bons cadeaux, location, cours particuliers ; à propos,
actualités, FAQ, contact, contrats et conditions.

## Navigation

Barre en haut à quatre entrées : nos ateliers, **CLASSES**, **MEMBERSHIP**, à propos, actualités, et le bouton « Book a
class ». La nav nomme les BARREAUX de l'échelle (apprendre, pratiquer), pas des services ; au pied, dix-huit liens
rangés en trois colonnes.

## Ordre de l'accueil (mesuré, ordinateur)

1. Premier écran : photo de l'atelier en grand, le h1 posé dessus, les trois ateliers en boutons.
2. **Les quatre portes de l'échelle** : Classes, Membership, Open Studio Pass, In Production (photo, deux lignes).
3. Les ateliers (trois photos, un nom chacune).
4. La carte de séances libres sur un aplat ocre (« sans engagement, juste du temps d'atelier »).
5. **La montée d'un barreau** : l'adhésion étudiante ajoutée à un cours (« Student Membership Upgrade »).
6. Les cours en texte (pour qui, combien, quel niveau, ce qui vient après).
7. L'atelier partagé (« Reinventing the maker-space »), l'adhésion (« Join our studio community »).
8. Pourquoi pratiquer, les actualités, une carte, le formulaire de contact, les partenaires, le pied.

## Page interne type

- **Membership** : à qui c'est destiné, ce qui est compris, choisir sa formule, puis les objections en questions
  (« Is it worth it? », « Can I actually afford this? », « What if I'm not good enough? »), les avis des membres, les
  trois ateliers, **comment commencer** en quatre étapes (prendre un cours, choisir sa formule, réserver sa prise en main,
  venir), une FAQ.
- **Open-Studio Pass** : deux formules (5 ou 10 séances), « compris » et « **pas compris** » côte à côte, comment ça se
  passe en quatre étapes, choisir son atelier, les questions avant la première séance.
- **Classes** : chaque famille de cours, « From course to studio member » (le passage au barreau suivant dit en clair),
  les avis des élèves, les questions avant le premier cours.

## Contact et téléphone

Aucun téléphone cliquable (mesuré) ; un e-mail ; formulaire en bas de l'accueil ; horaires d'accueil dans le JSON-LD.
L'usine garde le socle : téléphone dans la nav et sous les marches, adresse et état du jour de l'atelier.

## Preuves

Les avis rangés PAR barreau (« What our students say » sur Classes, « What our members say » sur Membership) ;
l'ancienneté (2013) ; « une communauté de plus de 500 céramistes » ; entreprise sociale.

## Style relevé (DOM calculé)

Titres **Lora** (h1 56 px, graisse 400, interlettrage 6 px ; h2 27 px gras en capitales espacées), texte **Source Sans 3**
18 px, boutons **Rubik** 13 px en capitales espacées ; fond blanc (94 %), brun très sombre `#3a3330` (aplats et pied),
ocre `#d18822` (la carte de séances) ; photos d'atelier chaudes, sans filtre ; cartes à coins légèrement arrondis ;
transitions de 0,2 à 0,3 s, GSAP chargé, rien ne bouge seul.

## Ce qui la rend différente du déroulé réflexe

- **Le visiteur se situe avant de lire** : la question n'est pas « que faites-vous ? » mais « où en suis-je ? » ; la
  réponse ouvre la formule qui lui va, et dit la suivante. Aucune architecture du registre ne range l'offre par le
  NIVEAU du visiteur.
- **Ce qui est compris ET ce qui ne l'est pas**, dit franchement, à côté du prix : l'objection est traitée avant d'être
  posée.
- Différence avec `saisons-sorties` : là le temps (été, hiver) range des activités et des sorties datées ; ici la
  progression du visiteur. Avec `cartes-empilees-agenda` : là des rendez-vous ponctuels ; ici un chemin qui continue.
  Avec `accueil-portes` : là une porte par activité, côte à côte, sans ordre ; ici des marches dans un ordre, et
  chacune mène à la suivante.

## À quels clients elle convient (selon leurs données)

- Atelier de poterie ou céramiste qui enseigne (initiation, cours du trimestre, adhésion à l'atelier), école de cuisine
  ou de pâtisserie (découverte, cycle, cours avancés), atelier de couture ou de tapisserie, menuiserie partagée ou
  fablab, caviste qui forme (dégustation, cours, club), école de musique.
- Données nécessaires : **au moins 2 barreaux avec des formules** (mieux 3 : l'onglet compte trois marches), une
  adresse où l'on vient ; mieux avec les prix, compris / pas compris, le déroulé, les dates, et des avis rattachés à
  leur barreau.
- Ne convient pas : un artisan qui vend ses pièces sans enseigner (`index-projets`, `gamme-vitrine`), des rendez-vous
  sans suite (`cartes-empilees-agenda`), l'urgence.

## Comment l'usine la réalise

- Coquille **`parcours`** : en tête le h1, le métier à la ville et l'ancienneté ; puis « Où en êtes-vous ? » dès le
  premier écran : **les marches** (un onglet par barreau posé par le script ; au téléphone une marche par ligne, chacune
  décalée vers la droite comme un escalier ; à l'ordinateur côte à côte, chacune plus haute que la précédente), le
  téléphone et la note ; sous l'onglet, le barreau entier : son nom, « dès 65 € » (le plus petit des prix donnés), sa
  phrase, à qui il s'adresse, la photo, les formules à filets, compris / pas compris, comment ça se passe, les dates,
  ses questions en `<details>`, les avis de ceux qui y sont passés, « Tout sur … » et « Et après : … » qui ouvre le
  barreau suivant. Sans script, l'échelle entière, un barreau sous l'autre. Puis les autres avis, l'adresse de
  l'atelier sur l'encre (`id="contact"`), un pied court.
- Pages `/parcours/<slug>` : h1 « titre chez commerce », niveau, métier à la ville, « dès … », portes (Réserver si
  `contact.bookingUrl`, Appeler, Écrire), formules, compris, déroulé, dates, questions, précédent et suivant ;
  JSON-LD `Service` et ses offres.
- La nav nomme les barreaux (au plus quatre) en tête.

## Ce qui manquait (dit précisément)

1. `parcours[]` dans le schéma (slug, niveau, titre, phrase, pour, formules à prix, compris, pas compris, déroulé, dates,
   questions, photo).
2. `proof.testimonials[].barreau` : l'avis rangé sous son barreau.
3. Coquille `parcours`, route `/parcours/<slug>`, liens de nav, `wording.parcours`.
4. Module pur `src/lib/parcours.ts` (barreaux complets, voisins, « dès … », liens, avis du barreau et avis généraux).
5. JSON-LD `barreauLd` (`src/lib/jsonld.ts`), mesure `parcours` de `donneesManquantes`.

## Signes IA à NE PAS reprendre

- Capitales espacées sur les h2, les boutons et la nav (6 px d'interlettrage sur le h1).
- Les quatre « offres » en cartes égales façon grille de tarifs de logiciel.
- « A community of 500+ makers » : un chiffre rond mis en avant (seulement s'il est donné et vrai).
- La carte Google chargée d'office et le carrousel d'actualités.

## Codée dans l'usine (26 oct 2026)

`layout: { architecture: 'parcours-atelier' }` (`src/lib/architectures.ts`). Les cinq manques sont faits. Restent : une
page par atelier quand le client en a plusieurs (`lieux[]` existe, non branché ici), la carte de séances (une formule
comme une autre pour l'instant), le passage d'un barreau au suivant proposé dans le formulaire.

Preuve : site jetable (atelier de poterie, trois barreaux, avis rattachés, copie de `_exemple` sans photo, supprimé),
`ff verifier` vert hors données de test (`ff a11y`, `ff typo`, `ff ia` compris), `ff ressemblance` contre tous les sites
du registre : 0,54 au premier écran téléphone (anna-vidal), 0,64 ordinateur (cantine-roulante), 0,59 au déroulé
(prospect-a-coeur-bois ; modèle de navigation « onglets », aucun autre site). Essais refusés : l'échelle sous un en-tête
classique, pied en colonnes (déroulé 0,65 à 0,77 de sept sites : la part des onglets restait sous la moitié de la page) ;
la question sous le h1 avec le téléphone en tête (0,67 au premier écran téléphone de fromagerie-ravanel-d).
