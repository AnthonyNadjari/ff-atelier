# catalogue-location : le site d'un loueur est son parc

Volet 2a ter de `/veille`, tour du 27 oct 2026 (tour 11). Démontage automatique de Location Service (`node scripts/ff.mjs
demonter https://www.locationservice.fr/ --dossier <scratch> --nom source-location-service`, captures non versionnées) et
relevé au `curl` (Location Service : accueil et `/produits/gros-oeuvre-terrassement-beton/` ; Deslandes Motoculture :
accueil). On reprend la construction, jamais les textes, images, logos ou code des sources.

## Sources

- **Location Service** (loueur d'outillage à Mulhouse, « à votre service depuis 1998 », bureau et atelier ; site maison).
  URL lues le mardi 27 oct 2026 : [locationservice.fr](https://www.locationservice.fr/),
  [locationservice.fr/produits/gros-oeuvre-terrassement-beton](https://www.locationservice.fr/produits/gros-oeuvre-terrassement-beton/).
- **Deslandes Motoculture** (magasin de motoculture à Mareil-en-Champagne, près de Loué, Sarthe : vente, réparation,
  dépannage, location « demi-journée, journée, week-end ») : [deslandes-motoculture.com](https://www.deslandes-motoculture.com/).
- Trouvées en cherchant « location de matériel particuliers et professionnels demi-journée week-end caution bétonnière ».

## Pages

Location Service : l'accueil, dix catégories (gros œuvre et béton, travaux d'intérieur, perçage et démolition, peinture,
métaux, jardinage, bois, chauffage, réparation, bonnes affaires), une fiche par machine, présentation et plan d'accès,
conditions de vente, mentions. **Chaque catégorie est une liste de machines** : un h3 par machine, « Particuliers
29,00 € TTC / jour, 145,00 € TTC / sem ; Professionnels 24,17 € HT / jour, 96,67 € HT / sem ; Caution : 200 € (par chèque
ou espèces uniquement) ». Deslandes : sept pages (accueil, motoculture, microtracteur et outils, produits, avis, actualités,
contact), la location dite sur l'accueil, les tarifs dans un PDF.

## Navigation

Location Service : en tête l'adresse, le téléphone et « Nous contacter » (fenêtre) ; **« Chercher un outil »** sous le h1 ;
les catégories en liste sur l'accueil et dans le pied. Deslandes : « Une question ? » et le téléphone en tête, barre de
sept entrées.

## Accueil (Location Service, mesuré)

Le h1 « Location de matériel pour Professionnels et Particuliers », « À votre service depuis 1998 », la recherche, « nos
sélections du mois » (six machines et leur prix par jour), les dix catégories, **« Astuce : louer plus longtemps pour le
même prix »** (pris le mardi dès 14 h et rendu le jeudi matin = une journée ; le vendredi soir au lundi matin = une
journée), les services (technicien, vente, révision, affûtage, devis), puis le pied : outils, informations, contacts,
**horaires d'ouverture jour par jour**. Les prix ne sont lisibles qu'une page plus loin, dans chaque catégorie. **C'est la
transposition** : l'usine met le parc et ses prix sur l'accueil, la bascule particulier / professionnel en un geste, et
l'astuce des créneaux devient un bloc.

## Contact et preuves

Le téléphone partout, le comptoir (on vient prendre et rendre la machine) ; pièce d'identité, caution par chèque.
Preuves : l'ancienneté, le technicien ; Deslandes a une page d'avis.

## Style des sources (pour mémoire, non repris)

Location Service : gabarit de boutique, vignettes produits, horodatage « 1 hour ago » sous chaque produit. Deslandes :
gabarit d'agence locale. On ne reprend que l'architecture ; le style vient des atomes (`ff melanger`).

## Ce qu'il faut à l'usine

- `location` : `durees` (colonnes : demi-journée, journée, week-end, semaine), `materiels[]` (slug, nom, catégorie, détail,
  photo du parc, `prix` particulier TTC et `prixPro` HT alignés sur les durées, caution, note), `creneaux[]` (retrait,
  retour, ce qui est compté), `conditions[]`, `livraison`.
- Une coquille dont l'accueil est le parc : recherche, bascule TTC / HT sans script, un onglet par catégorie, chaque machine
  et ses prix ; le bon créneau et le magasin (adresse, horaires, ce qu'il faut apporter) dans le même bloc ; les avis.
- `/materiel` (une table par catégorie, la recherche y mène sans script) et `/materiel/<slug>`.

## Convient à

Loueur dont on choisit une machine, sa durée et son prix : location d'outillage et de matériel BTP, motoculture qui loue,
remorques, vélos, kayaks, matériel de réception ou de sonorisation, costumes ; 6 matériels à prix au moins, des horaires
de retrait. Pas pour une vente sans location (`gamme-vitrine`), ni pour un logement à la nuit (`outil-calendrier`).

## Signes à ne pas reprendre

Formulaire de contact dans une fenêtre surgissante ; texte légal du formulaire répété en tête de chaque page ; « 1 hour
ago » sous chaque produit ; « sélections du mois » en carrousel ; tarifs en PDF (Deslandes) ; photos de catalogue de
marque présentées comme le parc.

## Codée dans l'usine (27 oct 2026)

`layout: { architecture: 'catalogue-location' }` (`src/lib/architectures.ts`) : coquille `location` (`src/shells/location.astro`),
`location` dans le schéma, `src/lib/location.ts` (`materielsComplets`, `categoriesDe`, `prixDuMateriel`, `aPrixPro`,
`premierPrix`, `lienMateriel`), `src/pages/materiel/[...index].astro` et `[slug].astro`, mesure `materiels`,
`wording.materiel` et `wording.chercher`, pied `minimal` ; `ff verifier` n'exige plus de piège à bots sur un formulaire
`role="search"` (il n'envoie rien). Restent : la disponibilité du jour par machine (« en location jusqu'à jeudi ») que la
source n'affiche pas non plus, la réservation en ligne.

Preuve : site jetable (loueur d'essai, huit matériels en trois catégories, quatre durées, prix pro pour quatre machines,
deux créneaux, trois avis d'essai ; copie de `_exemple`, sans photo, supprimé), `ff verifier` vert hors données de test
(`ff a11y`, `ff typo`, `ff ia` compris), `ff ressemblance` contre tous les sites du registre : 0,61 au premier écran
téléphone (fromagerie-ravanel-b), 0,62 ordinateur (jardins-mael), 0,56 au déroulé (prospect-epi-dor-d) ; modèle de
navigation « onglets ». Essais refusés : le parc, puis les créneaux, les avis et le magasin en blocs séparés avec un pied à
colonnes (modèle « plusieurs pages », déroulé 0,70 à 0,80 de huit sites, et 0,70 au premier écran ordinateur de
fromagerie-ravanel-b : h1 en haut sans image, numéro dessous) ; puis créneaux et magasin dans le bloc du parc (déroulé vert
sauf 0,68 de prospect-epi-dor-c, ordinateur toujours 0,70). Passé avec un en-tête plus bas à l'ordinateur (le téléphone à
droite, la recherche en bande sur toute la largeur, le parc visible au premier écran). Entre les deux architectures du
tour : 0,49 / 0,56 / 0,73 (même modèle « onglets », blocs voisins) : ne pas les donner à deux pistes d'un même client.
