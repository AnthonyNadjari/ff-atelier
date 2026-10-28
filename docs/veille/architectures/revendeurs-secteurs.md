# revendeurs-secteurs : le site d'un producteur répond à « où en trouver près de chez moi ? »

Volet 2a ter de `/veille`, tour du 28 oct 2026 (tour 15). Relevé au `curl` (HTML servi) de l'accueil et de la page « Points
de vente (Gard, Hérault) » de la Brasserie des Garrigues, de l'accueil, de « Nos bières » et de « La consigne » de la
Brasserie Bendorf, plus un démontage automatique de la page des points de vente des Garrigues (`ff demonter`, Chromium
390x844 ; la bannière de cookies couvre le bas du premier écran, capture gardée telle quelle : `revendeurs-secteurs-source.jpg`).
On reprend la construction, jamais les textes, images, logos ou code des sources.

## Sources

- **Brasserie des Garrigues** (bières artisanales bio et sans gluten, Sommières, Gard) : [brasseriedesgarrigues.fr](https://brasseriedesgarrigues.fr/),
  [points de vente Gard, Hérault](https://brasseriedesgarrigues.fr/points-de-vente-gard-herault/), lus le mercredi 28 oct 2026.
  Le téléphone en haut de chaque page ; « Points de vente » dans la barre ; la page part de **« Trouvez la boutique la plus
  proche de chez vous »** et de deux boutons, **Gard / Hérault** et **Autres départements** (une page chacun), puis une carte et
  la **liste des points de vente par département** (une quarantaine dans l'Hérault, vingt-cinq dans le Gard), chacun avec son
  **genre** (caviste, bar, épicerie bio, restaurant, magasin bio). Sur l'accueil : « Vente sur place, accueil et visite de la
  brasserie pendant les heures d'ouverture », les bières (une page par famille : bières, sans alcool, barrique, sodas,
  spiritueux), la location de tireuse, les avis Google, les horaires en pied.
- **Brasserie Bendorf** (brasserie artisanale à Neudorf, Strasbourg, depuis 2013) : [brasserie-bendorf.fr](https://brasserie-bendorf.fr/),
  [la consigne](https://brasserie-bendorf.fr/la-consigne/), [nos bières](https://brasserie-bendorf.fr/nos-bieres/), lus le même
  jour. h1 « Brasserie artisanale à Neudorf, Strasbourg » ; les bières permanentes et l'éphémère du moment ; **les growlers
  remplis à la brasserie** (six bières au choix chaque jour) ; « Où rapporter les bouteilles ? » : **à la brasserie, chez les
  revendeurs de Strasbourg et de l'Eurométropole, puis hors de l'Eurométropole**, un nom par ligne ; « 94 % de nos bières sont
  vendues dans un rayon de 200 km ».

## Pages

Brasserie des Garrigues : une douzaine (accueil, la brasserie, cinq familles de produits, location de tireuse, **deux pages de
points de vente par secteur**, contact, blog). Bendorf : accueil, nos bières, présentation, la consigne, projet, louer une
tireuse, contact.

## Navigation

Garrigues : Accueil, La brasserie (et les familles de produits), Location tireuse, **Points de vente**, Contact ; le téléphone
au-dessus de la barre. Bendorf : Accueil, Nos bières, La brasserie (Présentation, La consigne), Louer une tireuse, Contact.

## Ordre de la page des points de vente (Garrigues)

1. Photo du bar, h1 « Trouvez la boutique la plus proche de chez vous ! », boutons des deux secteurs.
2. Carte, puis « Liste des points de vente » : un département, puis l'autre ; chaque point avec son nom et son genre.
3. Pied : téléphone, adresse, horaires d'ouverture de la brasserie.

## Ce qui fait vendre

Le client d'un producteur vendu chez d'autres (brasseur, vigneron, cidrier, torréfacteur, chocolatier en dépôts) ne se demande
pas « que faites-vous ? » mais « où en acheter près de chez moi ? ». Les deux sources y répondent sur une page à part, loin de
l'accueil, en liste longue. L'usine en fait l'accueil : les secteurs en boutons dès le premier écran (Garrigues), les communes
de A à Z, le genre de chaque revendeur et un filtre (« Chez qui ? » : caviste, bar, épicerie) qui marque dans le navigateur les
adresses qui conviennent, « À la pression » et « Reprend la consigne » quand le client le dit (Bendorf) ; puis la vente sur
place avec les horaires et la porte des pros (« Vous tenez un commerce ? ») dans le même bloc ; la gamme ensuite, une page par
famille.

## Signes à NE PAS reprendre

Titres en capitales de machine à écrire, carte Google chargée d'office (traceur avant consentement), bannière de cookies qui
couvre le premier écran, émoji dans les noms de bières, compteurs qui partent de zéro, liste sans commune (Bendorf : on ne sait
pas où est chaque revendeur).

## Codée dans l'usine (28 oct 2026)

`layout: { architecture: 'revendeurs-secteurs' }` (`src/lib/architectures.ts`) : coquille `revendeurs`
(`src/shells/revendeurs.astro`), `revendeurs` dans le schéma (`liste[]` : nom, genre, commune, secteur, adresse, lien,
`pression`, `consigne` ; `surPlace`, `consigne`, `pros`), `src/lib/revendeurs.ts` (`revendeursComplets`, `slugSecteur`,
`secteursDe`, `typesDe`, `phraseSecteur`, `pourType`, `lienRevendeurs`), `src/pages/ou-trouver/[...index].astro` (tous les
secteurs) et `[slug].astro` (une page par secteur dès deux secteurs), `wording.revendeurs` et `wording.trouver`, mesure
`revendeurs` (6 au moins), pied `minimal`, tiroir de contact ; la gamme est faite des services (une page chacun). En tête le
h1, « métier à ville », les secteurs en boutons (posés par le script, ils ouvrent le secteur et y mènent), le téléphone,
« Venir sur place », la note ; un seul bloc `id="revendeurs"` : sur l'encre le titre, le compte et le filtre par genre ; les
secteurs (sans script l'un sous l'autre), communes de A à Z ; chez le producteur (`id="sur-place"`) ; la porte des pros
(`id="contact"`) ; puis la gamme, l'histoire, les avis. Restent : la carte des revendeurs (sans traceur, `contact.mapsProvider`
par revendeur), un flux tenu par le client (tableur), le remplissage de growlers du jour.

Preuve : site jetable (brasserie d'essai à Clermont-Ferrand, 14 revendeurs de démonstration sur trois secteurs, trois familles,
aucun avis ; sans photo, supprimé), `ff verifier` vert hors téléphone et e-mail de test (`ff a11y`, `ff typo`, `ff ia`
compris), `ff ressemblance` contre les 39 sites du registre : au plus 0,56 au téléphone (prospect-ballay-macon), 0,56 à
l'ordinateur (jardins-mael), 0,60 au déroulé (prospect-epi-dor-b) ; modèle « onglets », déroulé héros, outil, services, à
propos. Essais refusés : deux secteurs seulement (les onglets ne comptent qu'à partir de trois : « longue page à ancres »,
déroulé 0,77 de prospect-epi-dor-b) ; sur place sorti du bloc après la gamme (bloc « lieu/horaires », déroulé 0,69 à 0,75 de
quatre sites) ; secteurs dans le bloc sur l'encre (premier écran 0,66 à 0,68 de fromagerie-ravanel-d : « h1 en haut hors de
l'image, numéro sous le h1 ») : les secteurs passent dans l'en-tête, comme les deux boutons des Garrigues. Capture téléphone :
`revendeurs-secteurs-essai.jpg` ; source : `revendeurs-secteurs-source.jpg`.
