# forfaits-atelier : le site d'un garage est son comptoir de forfaits

Volet 2a ter de `/veille`, tour 21 du 31 oct 2026. Relevé au `curl` (HTML servi) de l'accueil et de la page Forfaits du Garage
de la Route Nationale (Nouvion, Somme), de l'accueil et de la page Tarifs du Garage de la République (Échirolles) ; capture Chrome
de la page Forfaits de la Route Nationale (gardée : `captures/forfaits-atelier-source.jpg`). On reprend la construction, jamais les
textes, images, logos ou code des sources.

Ni pannes à diagnostiquer appareil par appareil (`appareils-pannes`), ni formules d'un même service comparées (`formules-comparees`),
ni prix par créneau d'urgence (`grille-urgence`) : le client d'un garage demande **combien pour sa voiture, et ce qui est compris**.
Chaque forfait est un ticket : un prix, « Ce prix comprend » ligne à ligne, pour quelles voitures, avec ou sans rendez-vous.

## Sources

- **Garage de la Route Nationale** : [garagedelaroutenationale.fr](https://www.garagedelaroutenationale.fr/), lu le 31 oct 2026.
  Trois pages : Accueil, Forfaits, Contact ; le numéro dans la barre. L'accueil annonce les forfaits à prix (« Distribution à
  partir de 399 € », « Entretien courant (pneus, vidange, freins) avec ou sans RDV », « Forfaits révision à partir de 69 € »). La
  page [Forfaits](https://www.garagedelaroutenationale.fr/forfaits) : pour chaque forfait, « pour tous les véhicules français
  (exemple 208, C4, Clio 4) », « Ce prix comprend : pièces (kit de distribution, pompe à eau, liquide de refroidissement),
  main-d'œuvre incluse », le prix TTC ; « Merci de vous munir de votre carte verte, de la carte grise » ; un véhicule de prêt pendant
  le pare-brise ; le pré-contrôle technique offert avec la révision.
- **Garage de la République**, Échirolles : [Tarifs](https://garagedelarepublique38.fr/tarifs/), lu le même jour. Forfaits « à
  partir de » (vidange, vidange 3 filtres, distribution, disques et plaquettes), tarifs d'atelier, pneumatiques « par pneu », et
  **le prix par gabarit** : « Citadine 20 €, Berline 30 €, Monospace / 4x4 70 € ».

## Pages

Route Nationale : accueil, forfaits, contact, mentions. République : accueil, tarifs, véhicules en vente, mentions.

## Navigation

« Forfaits » (ou « Tarifs ») entre Accueil et Contact, le numéro toujours dans la barre.

## Ordre de l'accueil (construction gardée)

1. h1, métier à la ville, ancienneté, note, téléphone, ce qui se fait sans rendez-vous (« Sans rendez-vous : vidange, plaquettes
   avant, deux pneus ») ; la photo de l'atelier (en tête au téléphone).
2. **Le comptoir** (`id="forfaits"`) : « Votre voiture ? » (un bouton par gabarit ; sans script tous les prix restent écrits) et
   « Votre voiture n'est pas dans la liste ? » avec le numéro, dans une barre collée sous la navigation à l'ordinateur ; dessous les
   **tickets** (bord haut cranté, ombre portée, légèrement de biais) : famille, nom vers la page, prix du gabarit choisi, sans ou
   sur rendez-vous, durée ; « Ce prix comprend » ligne à ligne et « Pour : » de l'autre côté. Piste au doigt au téléphone.
3. **Venir au garage** (`id="venir"`) : les deux files (sans rendez-vous, sur rendez-vous, chaque forfait vers sa page) à côté de
   « À apporter » et du véhicule de prêt.
4. Les avis ; l'adresse, les horaires et la demande ; le pied.

`/forfaits` : le tableau comparé (un forfait par ligne, un gabarit par colonne ou le prix seul, ce qu'il comprend), à apporter,
les questions. Page d'un forfait : famille, nom, prix, prix par gabarit, le ticket « Ce prix comprend », pour quelles voitures, le
rendez-vous et la durée, photo, texte, l'appel, les autres forfaits de la même famille.

## Ce qui fait vendre

La peur du client au garage, c'est la facture. Un prix écrit avant d'apporter les clés, avec ce qu'il comprend et pour quelle
voiture, le fait venir ; « sans rendez-vous » le fait venir le jour même.

## Signes à NE PAS reprendre

Les capitales partout, « le prix imbattable de la région », le « 200 € offert » en chiffre géant, le gras mot à mot, les réseaux
sociaux en tête, la vente de véhicules d'occasion en annonces externes (hors de cette architecture).

## Codée dans l'usine (31 oct 2026)

`layout: { architecture: 'forfaits-atelier' }` (`src/lib/architectures.ts`) : coquille `forfaits` (`src/shells/forfaits.astro` :
à l'ordinateur la barre du comptoir collée sous la navigation, les tickets un par rangée en deux colonnes), `forfaits` dans le
schéma (`gabarits`, `avertissement`, `apporter`, `pret`, `liste[]` : slug, nom et un prix (prix ou un tarif par gabarit)
obligatoires ; famille, comprend, pour, rendezVous `sans`/`sur`, durée, texte, photo, jamais devinés), `src/lib/forfaits.ts`
(`forfaitsComplets`, `gabaritsUtilises`, `prixPour`, `parRendezVous`, `autresForfaits`, `lienForfaits`), pages `/forfaits`
(tableau, FAQPage) et `/forfaits/<slug>`, `wording.forfaits`, mesure `forfaits` (4), nav « Nos forfaits » en tête, aucune
section de layout, pied `liens`. Reste : les véhicules d'occasion (annonces) et la prise de rendez-vous en ligne.

`ff ressemblance` voyait l'accueil comme « plusieurs pages » au déroulé d'usine (0,79 contre demo-boulangerie) : nouveau modèle de
navigation **« comptoir de forfaits »** (`scripts/ff/deroule.mjs`) : au moins quatre éléments de liste qui portent un lien vers une
fiche `/<rubrique>/<slug>`, un prix en euros et leur propre liste d'au moins deux lignes annoncée par « comprend ».

Preuve : site jetable (garage d'essai à Échirolles, six forfaits aux prix plausibles non relevés, trois gabarits, trois avis
marqués « d'essai », numéro de la tranche réservée à la fiction, photo d'illustration Wikimedia marquée ; supprimé), `ff verifier`
vert (`ff a11y`, `ff typo`, `ff ia` compris), `ff ressemblance` contre tout le registre : premier écran 0,62 au téléphone
(anna-vidal) et 0,58 à l'ordinateur (fromagerie-ravanel), déroulé 0,57, **linéarité 0,56** (ordinateur : comptoir collant,
grille ; téléphone : deux pistes). Premiers essais : tickets en grille de trois, linéarité 0,92 ; une piste qui débordait la page
au téléphone (étiquette masquée en `position: absolute` dans la piste). Entre les deux architectures du jour : 0,29 / 0,29 / 0,57.
Captures : `captures/forfaits-atelier-source.jpg`, `captures/forfaits-atelier-essai.jpg`.
