# mur-producteurs : le site d'un magasin de producteurs est le mur de ses producteurs

Volet 2a ter de `/veille`, tour du 31 oct 2026. Relevé au `curl` (HTML servi) de l'accueil et de la page « Les producteurs » du
Comboire Paysan, et de la page « Nos producteurs » de Dose Épicerie ; captures Chrome de l'accueil du Comboire (téléphone page
entière, ordinateur premier écran ; gardée : `captures/mur-producteurs-source.jpg`). On reprend la construction, jamais les
textes, images, logos ou code des sources.

Une construction qui n'est ni « onglets » ni bandes empilées : **une colonne collée et un mur**. Le magasin (horaires, téléphone,
adresse, qui fait quoi) reste à l'écran à l'ordinateur pendant que les producteurs défilent à côté en grille.

## Sources

- **Le Comboire Paysan**, magasin de producteurs fermiers à Échirolles (Isère) : [comboirepaysan.fr](https://www.comboirepaysan.fr/)
  et sa page [Les producteurs](https://www.comboirepaysan.fr/producteurs-locaux-autour-de-moi/), lues le vendredi 31 oct 2026.
  Barre : « Accueil, Qui sommes nous, Les producteurs, Nos produits, Nos offres, Avis, Blog, Contact ». Sur l'accueil, la carte
  « Magasin Ouvert » (horaires, téléphone, adresse) posée sur le diaporama, puis « Nos produits locaux » rangés par produit avec la
  ferme de chacun (« Fromage de brebis, yaourt : La Bergerie de la Rouye », « Viande de Porc : La Ferme du plumet », « Miel : Les
  Ruchers de Chartreuse »), puis « Les producteurs viennent à vous, Voir la carte des producteurs ». La page des producteurs : « La
  carte des producteurs », « Nos fermes sont situées dans le bassin Grenoblois, en Chartreuse, en Oisans », puis une fiche par
  ferme (commune, altitude, personnes, bêtes, façon de travailler, labels, téléphone et site du producteur, « Télécharger la
  fiche »), puis les avis.
- **Dose Épicerie**, Nort-sur-Erdre (Loire-Atlantique) : [Nos producteurs](https://dose-epicerie.com/nos-producteurs/), lue le même
  jour. « Nos producteurs » dans la barre, entre « Nos produits » et « Le blog » ; « Notre carte interactive vous permet de
  découvrir les producteurs présents à la boutique » ; les horaires jour par jour et l'adresse au pied de chaque page.

## Pages

Comboire : accueil, qui sommes-nous, les producteurs (carte et fiches), nos produits (par rayon), offres, avis, blog, contact.
Dose : accueil, qui, quoi, nos produits, nos producteurs, blog, infos pratiques.

## Navigation

« Les producteurs » ou « Nos producteurs » dans la barre haute, toujours ; les rayons sous « Nos produits ».

## Ordre de l'accueil (construction gardée)

1. **La colonne du magasin** (`id="hero"`) : h1, métier à la ville, ancienneté, note, téléphone, horaires du jour, adresse, et
   **« Qui fait quoi »** (chaque rayon et ses producteurs, chacun vers sa fiche : l'accueil du Comboire rangé par produit). À
   l'ordinateur elle reste collée à gauche, sous la barre, sur toute la page ; au téléphone elle passe en tête.
2. **Le mur** (`id="producteurs"`) : les producteurs en grille (trois ou quatre colonnes à l'ordinateur, deux au téléphone),
   portrait, ferme, personnes, commune, « à 12 km » si le client donne la distance, ce qu'ils apportent ; « 9 producteurs, le plus
   loin à 46 km du magasin » (calculé sur les distances données, jamais estimé).
3. Les avis s'il y en a ; « Venir au magasin » (adresse, téléphone, la semaine) ; le pied avec les pages des services.

`/producteurs` : tous les producteurs du plus proche au plus loin, la distance en barre à sa vraie valeur, ceux sans distance
ensuite ; les questions. Page d'un producteur : rayon, nom, personnes, commune, distance, année d'installation, photo, ce que le
client en dit, ce qu'on trouve au magasin, labels, quand le rencontrer au comptoir, son site, ses voisins du même rayon, l'appel.

## Ce qui fait vendre

Le client d'un magasin de producteurs paie pour savoir d'où vient ce qu'il achète et qui l'a fait ; les deux sources le disent
d'abord dans la barre (« Les producteurs »), le Comboire le redit sur l'accueil produit par produit. Une fiche par ferme sert aussi
le référencement (« fromage de chèvre Chartreuse », nom des fermes).

## Signes à NE PAS reprendre

Diaporama plein écran d'accueil, titres en écriture manuscrite sur photo, carte interactive qui charge une bibliothèque tierce pour
une dizaine de points (Dose), fiches à télécharger en PDF, noms des fermes en capitales, bandeau de cookies qui couvre la page.

## Codée dans l'usine (31 oct 2026)

`layout: { architecture: 'mur-producteurs' }` (`src/lib/architectures.ts`) : coquille `producteurs` (`src/shells/producteurs.astro` :
à l'ordinateur la page est une grille à deux colonnes, la colonne du magasin collée à gauche sur toute la hauteur, `sticky` sous la
barre de 72 px), `producteurs` dans le schéma (`intro`, `liste[]` : slug, nom, commune obligatoires ; qui, km, rayon, produits,
depuis, labels, photo, texte, presence, site optionnels, jamais devinés), `src/lib/producteurs.ts` (`producteursComplets`,
`parDistance`, `quiFaitQuoi`, `distanceLisible`, `plusLoin`, `voisins`, `lienProducteurs`), pages `/producteurs` (FAQPage) et
`/producteurs/<slug>`, `wording.producteurs`, mesures `producteurs` (4) et `pasUrgence`, nav « Nos producteurs » en tête, sections :
avis seulement, pied `liens`, tiroir de contact. Restent : la carte des fermes (seulement avec des coordonnées données par le
client), le « Télécharger la fiche » (pas repris), les offres du moment (`annonce` sait le faire).

`ff ressemblance` voyait le mur comme « services » dans un site « plusieurs pages » (déroulé 0,82 contre prospect-a-coeur-bois) :
nouveau modèle de navigation **« annuaire de fiches »** (`scripts/ff/deroule.mjs`) : au moins six liens vers des pages
`/<rubrique>/<fiche>` dont la rubrique est dans le menu, hors `/services`, deux au moins sur une rangée.

Preuve : site jetable (magasin d'essai à Voiron, neuf fermes d'essai aux communes et distances plausibles non relevées, deux avis
marqués « d'essai », numéro de la tranche réservée à la fiction, photos d'illustration Wikimedia marquées ; supprimé), `ff verifier`
vert (`ff a11y`, `ff typo`, `ff ia` compris), `ff ressemblance` contre tout le registre : premier écran 0,64 au téléphone
(fromagerie-ravanel-b) et 0,42 à l'ordinateur, déroulé 0,63 (prospect-a-coeur-bois), **linéarité 0,50** (ordinateur : colonne fixe
sur toute la page). Captures : `captures/mur-producteurs-source.jpg`, `captures/mur-producteurs-essai.jpg`.
