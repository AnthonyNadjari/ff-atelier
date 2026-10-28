# commande-retrait : le site d'un producteur en vente directe est le rythme de sa semaine

Volet 2a ter de `/veille`, tour du 28 oct 2026 (tour 13). Relevé au `curl` (HTML servi) de l'accueil et de la page des
points des deux sources, plus un démontage automatique de l'accueil de Riedoasis (`ff demonter`, Chromium 390x844, capture
gardée : `commande-retrait-source.jpg`). On reprend la construction, jamais les textes, images, logos ou code des sources.

## Sources

- **Riedoasis** (coopérative de maraîchage biologique à Obenheim, Bas-Rhin) : [riedoasis.fr](https://riedoasis.fr/) et
  [riedoasis.fr/les-points-de-retrait](https://riedoasis.fr/les-points-de-retrait), lus le mercredi 28 oct 2026.
  **« 3 façons d'acheter nos produits »** (l'abonnement aux paniers, le drive sur mesure, la vente à la ferme le vendredi
  de 17 h à 19 h), **« Passez commande AVANT MARDI MIDI pour une livraison dans la semaine »**, « Pourquoi choisir
  RiedOasis ? », puis **une vingtaine de points de retrait** chez des boucheries, épiceries, boulangeries, crèches, filtrés
  par jour (jeudi, vendredi, samedi), chacun avec son adresse, ses heures de distribution, à qui il est réservé (« Point de
  dépôt réservé aux parents des enfants inscrits ») et **une page à lui**.
- **Au temps de la source** (maraîcher bio à Raon-aux-Bois, Vosges) :
  [autempsdelasource.fr/points-de-vente](https://autempsdelasource.fr/points-de-vente/), lu le même jour. Un onglet par
  point (à la ferme, Remiremont, Arches), pour chacun le **jour de retrait**, « Retrait de commande : Oui », **« Vente
  directe : Oui / Non »**, l'adresse, la précision (« Apportez votre cabas », « le paiement doit être réglé avant le
  retrait »).

## Pages

Riedoasis : une vingtaine plus une par point (accueil ; qui sommes-nous en cinq pages ; paniers bio ; drive ; lieux de
livraison ; marché ; chroniques maraîchères ; contact ; FAQ ; compte). Au temps de la source : six (commande de légumes,
points de vente, la ferme, gîte, contact, compte).

## Navigation

Riedoasis : neuf entrées dont « Paniers Bio », « Drive Bio », **« Lieux de livraison »**, « Marché », « FAQ ». Au temps de la
source : « Commande de légumes », **« Points de vente »**, « La ferme », le numéro en tête.

## Accueil (Riedoasis, mesuré)

Le h1 « maraîchage biologique à Obenheim », une phrase, « 3 façons d'acheter », la règle de la commande (avant mardi midi,
une vingtaine de points), « Pourquoi choisir RiedOasis ? » (l'équipe, les sols), « Nos points de retrait » filtrés par jour,
le pied. **C'est la transposition** : le producteur ne tient pas boutique ; ce que le visiteur doit savoir, c'est jusqu'à
quand il commande et où il retire. L'usine met la règle en grand juste sous le premier écran, sur l'encre, avec la
prochaine clôture calculée dans le navigateur (« Prochaine clôture demain à 12 h, premier retrait ensuite jeudi »), puis
les façons d'acheter, l'histoire à la place de Riedoasis, les points en onglets par jour (le jour du prochain retrait
ouvert) et la question sur une commande ; les avis ensuite.

## Page intérieure (un point)

Riedoasis : le nom du point, son adresse, ses heures, ce qu'il faut savoir. L'usine : `/retrait/<slug>` : la commune, le
nom, le jour et les heures, l'adresse, à qui il est réservé, la vente sur place, la précision, la photo du client ; la règle
de la semaine et le report ; Appeler ; les autres points du même jour puis des autres jours. `/retrait` : tous les points par
jour, sans onglets, puis les questions du client.

## Contact et preuves

Riedoasis : formulaire de connexion dans la colonne de l'accueil, aucun avis, contact sur une page. Au temps de la source :
le numéro en tête. L'usine : le téléphone en tête (socle), la note, « Une question sur votre commande ? » sous la liste des
points, les avis.

## Style des sources (pour mémoire, non repris)

Riedoasis : majuscules criées dans le texte (« AVANT LE MARDI MIDI »), émojis, « /!\ » dans les fiches de points, carte à
épingles porteuse de l'information, formulaire de connexion sur l'accueil, bannière cookies sur un tiers du téléphone. Au
temps de la source : titres de point en capitales, onglets à pictogrammes. Le style vient des atomes (`ff melanger`).

## Ce qu'il faut à l'usine

- `retrait` dans le schéma : `cloture` (jour, heure « HH:MM »), `report`, `facons[]` (nom, texte, lien), `points[]` (slug,
  nom, commune, adresse, jour, début et fin « HH:MM », `vente`, `reserve`, `note`, photo).
- Une coquille dont l'accueil est la règle et les points ; la prochaine clôture calculée dans le navigateur (jamais au
  build : la page est statique) ; `/retrait` et `/retrait/<slug>`.

## Convient à

Producteur ou artisan qui vend sur commande et fait retirer à jour fixe, à la ferme ou chez des partenaires : maraîcher,
éleveur en colis de viande, apiculteur, fromager fermier, boulanger au levain ou boucher sur commande, AMAP ; 2 points de
retrait et une heure de clôture. Pas pour une boutique ouverte tous les jours (`lieu-fixe`, `pages-adresses`), ni pour un
camion qui vend à chaque étape (`tournee-semaine`).

## Signes à ne pas reprendre

Majuscules criées, « /!\ », émojis, carte seule porteuse de l'information, connexion sur l'accueil, « livraison gratuite » ou
« sans engagement » écrits sans que le client l'ait dit.

## Codée dans l'usine (28 oct 2026)

`layout: { architecture: 'commande-retrait' }` (`src/lib/architectures.ts`) : coquille `retrait` (`src/shells/retrait.astro`,
les sections `about` du layout rendues entre les façons et les points, les autres après), `retrait` dans le schéma,
`src/lib/retrait.ts` (`indexJour`, `heureLisible`, `pointsComplets`, `pointsParJour`, `clotureValide`, `phraseDuCycle`,
`prochainCycle`, `libelleDecalage`, `lienRetrait`), `src/pages/retrait/[...index].astro` et `[slug].astro`,
`wording.retrait`, mesures `retraits` et `cloture`, pied `minimal`, tiroir de contact ; la FAQ du site passe sur `/retrait`.
Restent : la boutique en ligne (le client garde la sienne, `facons[].lien`), une carte des points, les fermetures datées
d'un point.

Preuve : site jetable (maraîcher d'essai près de Tours, clôture le mardi à 12 h, trois façons, six points sur trois jours,
deux avis d'essai ; sans photo, supprimé), `ff verifier` vert hors téléphone et e-mail de test, `ff ia` vert,
`ff ressemblance` contre les 39 sites du registre 0,57 / 0,55 / 0,63 (téléphone / ordinateur / déroulé ; longue page à
ancres, déroulé héros, outil, bandeau d'appel, à propos, outil, avis). Capture téléphone : `commande-retrait-essai.jpg` ;
source : `commande-retrait-source.jpg`.
