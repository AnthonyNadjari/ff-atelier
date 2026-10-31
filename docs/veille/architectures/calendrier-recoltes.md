# calendrier-recoltes : le site d'une ferme ou d'une cueillette est son année

Volet 2a ter de `/veille`, tour 19 du 30 oct 2026. Relevé au `curl` (HTML servi) de l'accueil, de « En ce moment », du
calendrier et d'une page produit de la Cueillette de Compans, et des pages « À cueillir en ce moment » et « Calendrier des
légumes » du Jardin de l'Avenir ; capture pleine page du calendrier de Compans au téléphone (Chromium 390 px ; gardée :
`captures/calendrier-recoltes-source.jpg`). On reprend la construction, jamais les textes, images, logos ou code des sources.

Comme `carnet-interventions` et `rayon-trajet`, une construction qui n'est pas « onglets et listes » : **le temps long de la
saison**. L'accueil répond à « qu'est-ce qu'il y a en ce moment ? », et l'année entière se lit d'un coup d'œil.

## Sources

- **Cueillette de Compans** (réseau Chapeau de Paille), Seine-et-Marne : [cueillettedecompans.fr](https://www.cueillettedecompans.fr/),
  son [calendrier des récoltes](https://www.cueillettedecompans.fr/calendrier-fruits-legumes-fleurs-recoltes-cueillette-compans-77.html),
  sa page [En ce moment](https://www.cueillettedecompans.fr/en_ce_moments-cueillette-compans-77.html) et une
  [page produit](https://www.cueillettedecompans.fr/fruits-legumes-fleurs-cueillette-compans-77/courges.html), lus le vendredi 30 oct
  2026. « Calendrier des récoltes » dans la barre haute ; le calendrier : « En fonction des conditions climatiques, ces dates sont
  susceptibles de changer », filtres Tous / Fruits / Légumes / Fleurs et En ce moment / Année entière, une rangée par produit
  (46 : légumes, fruits, fleurs), les mois en barres de couleur ; « En ce moment » : la recette du moment, « OUVERT LE DIMANCHE
  1 novembre, tomates 1 €/kg », puis Fruits, Légumes, Fleurs ; chaque produit a sa page : « Période de récolte : avril … nov. »,
  « Particularités », « Astuces : conservation, dégustation ».
- **Le Jardin de l'Avenir**, libre cueillette bio à Sainte-Gemmes-sur-Loire (Angers) : [jardindelavenir.fr](https://www.jardindelavenir.fr/),
  [À cueillir en ce moment](https://www.jardindelavenir.fr/libre-cueillette/infos-pratiques/a-cueillir-en-ce-moment.html) et
  [Calendrier des légumes](https://www.jardindelavenir.fr/libre-cueillette/infos-pratiques/calendrier-des-legumes.html), lus le même
  jour. « Interrogez le message répondeur “Liste des légumes à cueillir” en appelant le 02 41 66 64 08 », puis « Plan du
  26/10/2026 » ; le calendrier est une image, sous « Avant de venir, le bon réflexe » et le numéro du répondeur.

## Pages

Compans : accueil, accès et horaires, en ce moment, calendrier, une page par produit, pratiques de culture, recettes, visites
scolaires, boutique. Jardin de l'Avenir : libre cueillette (comment ça se passe, à cueillir en ce moment, calendrier), la ferme,
magasin bio, restaurant, contact.

## Navigation

Compans : barre « Accueil, Horaires, À cueillir, Actualités », menu en tiroir. Jardin de l'Avenir : trois portes (cueillette,
magasin, restaurant), réserver par téléphone.

## Ordre de l'accueil (construction gardée)

1. h1, métier à la ville, ancienneté, note, téléphone ; à côté **« En ce moment, en octobre »** : les produits du mois rangés
   par famille, chacun vers sa page ; les douze mois sont dans le HTML, celui du build visible, celui du visiteur choisi dans le
   navigateur ; la phrase sur la météo ; **le répondeur de la liste du jour** s'il existe (jamais le numéro principal présenté
   comme un répondeur).
2. La photo du client en bande.
3. **Le calendrier** : un vrai tableau (une rangée par produit, rangées par famille, douze colonnes de mois, initiales au téléphone,
   abréviations à l'ordinateur), les mois de récolte en barre continue, la colonne du mois courant marquée.
4. Les avis s'il y en a ; « Venir » (adresse, horaires, téléphone) ; le pied avec les pages des services.

`/calendrier` : l'année mois par mois (le mois du visiteur marqué), le répondeur, les questions. Page d'un produit : famille,
nom, période en mots (« de juin à octobre, à cueillir »), la rangée des douze mois, photo, ce que le client en dit, conserver et
cuisiner, prix s'il le publie, ce qui se récolte en même temps, l'appel.

## Ce qui fait vendre

Le client d'une ferme se demande avant de prendre la voiture ce qu'il trouvera ; les deux sources y répondent par deux moyens (la
liste du moment, le répondeur) et par l'année entière. Une liste de produits sans mois ne dit pas quand venir ; le calendrier le
dit pour toute l'année, et chaque produit a sa page (« fraises cueillette Loiret »).

## Signes à NE PAS reprendre

Bannière « Installer l'application » et demande de notifications (Compans), filtres en boutons qui cachent la moitié de l'année,
calendrier publié en image (illisible au lecteur d'écran et au téléphone), familles en capitales, couleur différente par
produit (arc-en-ciel sans sens).

## Codée dans l'usine (30 oct 2026)

`layout: { architecture: 'calendrier-recoltes' }` (`src/lib/architectures.ts`) : coquille `recoltes` (`src/shells/recoltes.astro`),
`recoltes` dans le schéma (`avertissement`, `repondeur`, `produits[]` : slug, nom, famille, mois de 1 à 12, photo, texte, conseils,
prix, où), `src/lib/recoltes.ts` (`produitsComplets`, `famillesDe`, `duMois`, `plages` avec l'hiver d'un seul tenant,
`periodeLisible` « d'octobre à mars », `enMemeTemps`, `lienCalendrier`), pages `/calendrier` (FAQPage) et `/recoltes/<slug>`,
`wording.calendrier`, mesures `recoltes` (6 produits) et `pasUrgence`, nav « Calendrier des récoltes » en tête, sections : avis
seulement, pied `liens`, tiroir de contact. Aucun onglet : tout se lit sans script. Restent : le plan daté du jardin, la nouvelle de
la semaine (« ouvert le dimanche », prix du jour : `annonce` sait le faire), les recettes par produit.

`ff ressemblance` ne voyait pas le calendrier (bloc « autre », modèle « plusieurs pages », déroulé 0,78 contre anna-vidal) : nouveau
modèle de navigation **« calendrier annuel »** (`scripts/ff/deroule.mjs`) : un tableau dont l'en-tête a douze colonnes de mois, au
moins 25 % de la page.

Preuve : site jetable (cueillette d'essai à Saint-Cyr-en-Val, direction `terre`, quinze produits d'essai aux mois plausibles non
relevés, aucun avis ; photos d'illustration Wikimedia marquées ; supprimé), `ff verifier` vert hors téléphone et e-mail de test
(`ff a11y`, `ff typo`, `ff ia` compris), `ff ressemblance` contre tout le registre : aucune mesure au-dessus de 0,61 (déroulé contre
anna-vidal et demo-osteopathe ; premier écran au plus proche 0,59 au téléphone, cantine-roulante) ; modèle « calendrier annuel ». Capture :
`captures/calendrier-recoltes-essai.jpg` (premier écran et accueil au téléphone, ordinateur, page d'un service, /calendrier).
