# carnet-interventions : le site d'un artisan qui intervient chez les gens est son carnet de bord

Volet 2a ter de `/veille`, tour 18 du 29 oct 2026. Relevé au `curl` (HTML servi) de l'accueil et du blog de Monsieur Boris
(25 cartes datées, un récit lu en entier) et de l'accueil de L'Atelier Bois Acier (démonté le 23 oct, `marche/atelier-bois-acier.md`),
plus une capture pleine page du blog de Monsieur Boris au téléphone (Chromium 390 px ; gardée : `captures/carnet-interventions-source.jpg`).
On reprend la construction, jamais les textes, images, logos ou code des sources.

Le journal du tour 16 l'a noté : les architectures récentes (revendeurs, profils, salles, garde, honoraires) ont toutes la même
grammaire, des onglets et des listes. Celle-ci a une autre construction : **le temps**. L'accueil est un fil daté, du plus
récent au plus ancien, rangé par mois.

## Sources

- **Monsieur Boris**, serrurier à Nîmes : [serrurier-nimes30.fr](https://www.serrurier-nimes30.fr/), le
  [blog](https://www.serrurier-nimes30.fr/blog/) et un récit
  ([clé cassée dans un bureau de tabac](https://www.serrurier-nimes30.fr/blog/cle-cassee-serrure-commerce-bureau-tabac-nimes/)),
  lus le jeudi 29 oct 2026. Le « Blog » est en fait un **carnet d'interventions** : 24 cartes, chacune datée (`<time
  datetime="2026-10-24">`), rangée (Dépannage, Sécurité, Clés), **située par quartier** (Castanet, Vacquerolles, Mont Duplan,
  l'Écusson, Courbessac, Milhaud), titrée par ce qui s'est passé (« portail vandalisé : remplacement sur mesure et
  motorisation neuve en moins de 24 heures », « remplacement d'une serrure après le squat d'un appartement »). Un récit se lit
  **en temps** : l'appel (« une clé cassée dans le cylindre »), le démontage, la reproduction à l'atelier, le remontage et
  les essais, puis les questions propres à ce cas. L'accueil : le gérant devant sa boutique, le numéro partout, services,
  tarifs, avis, questions.
- **L'Atelier Bois Acier**, ébéniste à Amiens : [atelier-bois-acier.fr](https://atelier-bois-acier.fr/) (fiche de marché
  `marche/atelier-bois-acier.md`, 23 oct 2026). « **En direct de l'atelier** » sur l'accueil : les réalisations publiées comme
  des articles, chacune une courte histoire localisée (la banque d'accueil d'une auto-école amiénoise, le bureau d'une artiste,
  l'essence de bois nommée).

## Pages

Monsieur Boris : 35 (services, 4 prestations, boutique, tarifs, contact, blog de 25 récits, mentions). L'Atelier Bois Acier :
5 pages de nav + une par réalisation.

## Navigation

Monsieur Boris : numéro en barre haute, « Accueil, Services, Boutique, Tarifs, Blog, Contact, Secteurs, FAQ, Appeler », un
bouton « Appel 24/7 » collé en bas au téléphone. L'Atelier Bois Acier : À propos, Prestations, Réalisations, Contact, « DEVIS ».

## Ordre de l'accueil (construction gardée)

1. h1 (métier à la ville), ancienneté, note, le téléphone en grand ; à côté **la dernière intervention** : le jour en grand,
   « il y a 3 jours » (calculé dans le navigateur), le lieu, ce qui s'est passé, sa photo.
2. **Le carnet** : les interventions du plus récent au plus ancien, rangées par mois ; le mois reste collé (en tête au
   téléphone, en marge à l'ordinateur) pendant qu'on lit ses interventions ; chaque ligne : le jour, le lieu, le titre (vers
   sa page), l'appel, les temps en flèches, la durée, le prix si l'artisan le publie, le service dont elle relève, la photo.
3. **Où nous sommes intervenus** : les lieux du carnet, du plus fréquent au moins fréquent (comptés, jamais déclarés).
4. Les avis s'il y en a ; puis « Un problème chez vous ? » (téléphone, adresse, horaires) ; le pied avec les pages des services.

Page d'une intervention : le jour et le lieu, le titre, « L'appel », « Ce que nous avons fait » (temps numérotés), durée et
prix, la photo, l'appel, **la plus récente et la plus ancienne autour d'elle** (on se promène dans le temps), « Aussi à
<lieu> ». `/carnet` : tout le carnet par mois, puis par lieu, puis les questions.

## Ce qui fait vendre

Le client d'un serrurier, d'un plombier ou d'un maçon a peur de tomber sur une plateforme d'urgence ou un inconnu. Un carnet
daté et situé répond sans un mot de promesse : **il travaille, cette semaine, dans mon quartier**. C'est la preuve la plus
forte de Monsieur Boris (« un artisan local, pas une plateforme »), et la plus rare : les sites d'artisans ont des
« réalisations » sans date ni lieu, ou un blog arrêté depuis un an (contre-levier relevé au marché). Le levier « journal » du
marché (47,9 % des sites) devient ici la structure du site, pas une rubrique au fond de la nav.

## Signes à NE PAS reprendre

Playfair Display, Lora et Inter (polices « IA »), « 5 sur 5 » sans nom ni date, « plus de 100 clients satisfaits », cartes de
blog en grille à trois colonnes, catégories en pastilles, titres répétant « Serrurier Nîmes : » pour le référencement.

## Codée dans l'usine (29 oct 2026)

`layout: { architecture: 'carnet-interventions' }` (`src/lib/architectures.ts`) : coquille `interventions`
(`src/shells/interventions.astro`), `interventions[]` dans le schéma (slug, date AAAA-MM-JJ, lieu, titre, situation, étapes,
durée, prix, service, photo), `src/lib/journal.ts` (`interventionsCompletes`, `parMois`, `lieuxDuCarnet`, `dateLongue`, `ilYA`,
`voisines`, `lienCarnet`), pages `/carnet` (avec les questions, FAQPage) et `/carnet/<slug>` (Article), `wording.carnet`, mesure
`interventions` (4 au moins ; une date qui n'existe pas ne compte pas), nav « Le carnet » en tête et plus d'ancres vers des
blocs absents, sections : avis seulement, pied `liens` (les pages des services), barre d'actions, tiroir de contact. Restent : le
filtre par catégorie (Dépannage, Sécurité, Clés), les questions propres à une intervention, un flux RSS du carnet.

`ff ressemblance` ne voyait pas le temps : le carnet était classé « réalisations » dans une « page à plusieurs pages », comme
tous les sites à réalisations. Nouveau modèle de navigation **« journal daté »** (`scripts/ff/deroule.mjs`) : un bloc qui porte
au moins quatre `<time datetime>` du plus récent au plus ancien et tient au moins 35 % de la page (un agenda, qui va vers
l'avenir, ne compte pas).

Preuve : site jetable (maçon de rénovation d'essai à Metz, direction `releve`, six interventions d'essai de septembre et
octobre 2026, aucun avis ; photos d'illustration Wikimedia marquées ; supprimé), `ff verifier` vert hors téléphone et e-mail
de test (`ff a11y`, `ff typo`, `ff ia` compris), `ff nettete` vert, `ff ressemblance` contre tout le registre : au plus 0,63 au
téléphone (prospect-epi-dor-b), 0,55 à l'ordinateur (cantine-roulante), 0,61 au déroulé (prospect-epi-dor) ; déroulé héros,
réalisations (le carnet), lieu (les lieux), lieu (contact), pied ; modèle « journal daté ». Essais refusés : avec services et
questions sur l'accueil (déroulé 0,81 contre quinze sites : « héros, services, questions, lieu, pied ») ; premier écran h1 à
gauche et photo à droite (0,68 à l'ordinateur contre fromagerie-ravanel) : la dernière intervention passe sous le titre comme
une ligne du carnet (le jour, le récit, la photo). Capture : `captures/carnet-interventions-essai.jpg` (téléphone en deux
colonnes, ordinateur, page d'une intervention).
