# tableau-departs : le site d'un taxi est son tableau des départs

Volet 2a ter de `/veille`, tour du 31 oct 2026. Relevé au `curl` (HTML servi) de l'accueil et de la page « Taxi Annecy aéroport
de Genève » de Taxi Annecy, et de la page des tarifs de VTC Rousseau ; capture Chrome de l'accueil de Taxi Annecy (téléphone page
entière, ordinateur premier écran ; gardée : `captures/tableau-departs-source.jpg`). On reprend la construction, jamais les
textes, images, logos ou code des sources.

Ni onglets ni bandes : **le tableau des départs reste affiché** à côté de la page, comme le panneau d'une gare. C'est l'inverse de
`rayon-trajet` (l'artisan vient chez le client : « combien de temps pour venir chez vous ? ») : ici le client part, d'une base vers
des destinations fixes (aéroports, gares, stations), avec un prix et une heure de départ.

## Sources

- **Taxi Annecy** : [taxi-annecy.fr](https://taxi-annecy.fr/) et la page [Annecy aéroport de Genève](https://taxi-annecy.fr/taxi-annecy-aeroport-geneve/),
  lues le vendredi 31 oct 2026. Barre : « Destinations » (« Au départ d'Annecy : Genève 45 km · 45 min, Lyon 140 km · 1 h 40… Autre
  destination ? »), Services, Actualités, Réserver, le numéro. Sur l'accueil « Départs · Annecy » : une ligne par destination
  (« Aéroport de Genève, Genève-Cointrin, Suisse, 45 km, 40 min, Voir le trajet »), puis « Votre destination n'est pas listée ?
  Demandez un devis ». Chaque trajet a sa page : « Le départ : à quelle heure partir d'Annecy ? » (« pour un vol européen à 7 h,
  avec un enregistrement recommandé deux heures avant, une prise en charge vers 4 h »), un « Repère » (distance, durée, itinéraire,
  à fournir), « Autres trajets en taxi depuis Annecy ».
- **VTC Rousseau**, Les Houches (vallée de Chamonix) : [Tarifs au départ ou à destination de Chamonix](https://taxichamonix.fr/tarifs-transfert-au-depart-ou-a-destination-de-chamonix/),
  lue le même jour. « Nos tarifs s'entendent au départ ou à destination de Chamonix », « Tarifs nuit : de 19 h à 8 h, samedi, dimanche,
  jours fériés et routes enneigées », « Si vous ne trouvez pas votre destination dans cette liste veuillez me contacter par téléphone ».

## Pages

Taxi Annecy : accueil, une page par trajet (aéroport de Genève, Genève, Lyon, Chamonix, Aix-les-Bains, La Clusaz, Le
Grand-Bornand), actualités, mentions. VTC Rousseau : accueil, prestations, tarifs, contact et réservation, partenaires.

## Navigation

« Destinations » en tête (Taxi Annecy), « Tarifs » (Rousseau) ; le numéro toujours dans la barre.

## Ordre de l'accueil (construction gardée)

1. h1, métier à la ville, ancienneté, « jour et nuit » si le client le dit, note, téléphone, « Demander un devis » ; la photo du
   client dessous.
2. **Le tableau des départs** (`id="departs"`) : un vrai tableau, groupé par genre (aéroports, gares, stations), destination et
   précision, distance, durée, prix si le client le publie (sinon « sur devis »), chaque destination vers sa page ; « Votre
   destination n'est pas dans la liste ? Appelez » ; la phrase du client sur les prix. À l'ordinateur il reste collé à droite,
   sous la barre, sur toute la hauteur de la page ; au téléphone il suit le h1.
3. **« À quelle heure partir ? »** (`id="heure"`) : le trajet et l'heure du vol ou du train ; la prise en charge calculée dans le
   navigateur (heure moins l'avance du trajet, la route et la marge du client) ; sans script, la règle de chaque trajet en mots.
4. Les avis en piste horizontale manuelle ; la demande (formulaire), le téléphone, les horaires ; le pied.

`/trajets` : tous les trajets par genre, prix de jour et de nuit, les questions. Page d'un trajet : genre et base, destination,
le repère (distance, durée, itinéraire, à fournir, prix jour et nuit), l'heure de prise en charge, photo, ce que le client en dit,
l'appel, les autres trajets du même genre.

## Ce qui fait vendre

Le client d'un taxi a une heure à tenir : il veut savoir combien de temps, combien, et à quelle heure on passe le prendre. Taxi
Annecy répond aux trois sur l'accueil et dans chaque page de trajet (qui sert aussi le référencement : « taxi Annecy aéroport de
Genève »).

## Signes à NE PAS reprendre

L'horloge en direct (« Taxi disponible · 03:37 » ; `docs/GOUT.md` § 5 : aucune horloge), les coordonnées GPS décoratives, le
deuxième formulaire de devis en tête, les libellés en capitales espacées, les brochures tarifaires en PDF (Rousseau), le
« 0 € pour un devis » en chiffre géant.

## Codée dans l'usine (31 oct 2026)

`layout: { architecture: 'tableau-departs' }` (`src/lib/architectures.ts`) : coquille `departs` (`src/shells/departs.astro` : à
l'ordinateur la page est une grille à deux colonnes, le tableau collé à droite, `sticky` sous la barre de 72 px), `departs` dans
le schéma (`depuis`, `avertissement`, `marge`, `trajets[]` : slug, destination, minutes obligatoires ; précision, type, km, prix,
prixNuit, avance, itinéraire, aFournir, texte, photo optionnels, jamais devinés), `src/lib/departs.ts` (`trajetsComplets`,
`groupesParType`, `dureeDuTrajet`, `avecPrix`, `priseEnCharge`, `autresTrajets`, `lienTrajets`), pages `/trajets` (FAQPage) et
`/trajets/<slug>`, `wording.trajets`, mesure `departs` (4), nav « Les trajets » en tête, aucune section de layout (la coquille rend
tableau, outil, avis et demande), pied `liens`. Restent : les trajets « au départ ou à destination » (retour depuis l'aéroport :
le texte du trajet le dit), les tarifs de nuit par plage horaire.

`ff ressemblance` voyait le tableau comme « contact » dans un site « plusieurs pages » (déroulé 0,71 contre prospect-a-coeur-bois) :
nouveau modèle de navigation **« tableau des départs »** (`scripts/ff/deroule.mjs`) : un tableau à colonnes « Destination » et
« Durée », au moins quatre lignes liées, 15 % de la page au moins. Premier essai avec le tableau dans le bloc d'accueil :
linéarité 0,90 (un tableau à colonnes étroites ne se mesure pas comme une grille), d'où la colonne collée.

Preuve : site jetable (taxi d'essai à Annecy, huit trajets aux distances, durées et prix plausibles non relevés, trois avis marqués
« d'essai », numéro de la tranche réservée à la fiction, photo d'illustration Wikimedia marquée ; supprimé), `ff verifier` vert
(`ff a11y`, `ff typo`, `ff ia` compris), `ff ressemblance` contre tout le registre : premier écran 0,57 au téléphone (atelier-lecerf)
et 0,45 à l'ordinateur (fromagerie-ravanel-b), déroulé 0,52 (toits-cie), **linéarité 0,46**. Entre les deux architectures du jour :
0,46 / 0,42 / 0,50 ; leur disposition se ressemble (0,89 : une colonne collée chacune, à gauche ici, à droite là) : ne pas les
donner à deux pistes d'un même client. Captures : `captures/tableau-departs-source.jpg`, `captures/tableau-departs-essai.jpg`.
