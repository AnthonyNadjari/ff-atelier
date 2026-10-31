# sessions-places : le site d'une auto-école est son guichet des sessions

Volet 2a ter de `/veille`, tour 21 du 31 oct 2026. Relevé au `curl` (HTML servi) de l'accueil de MAP, Moto-Auto-Pédagogie
(Annecy et Seynod), des pages Auto, 2 roues et « Permis B conduite traditionnelle boîte automatique » des deux agences ;
capture Chrome de la page Auto d'Annecy (téléphone et ordinateur, page entière ; gardée : `captures/sessions-places-source.jpg`).
On reprend la construction, jamais les textes, images, logos ou code de la source.

Ni planning de la semaine ni parcours en marches : une auto-école vend des **formations à prix** et des **sessions datées à places
comptées** (stage, passerelle, formation 125). Le visiteur cherche la prochaine date et s'il reste de la place. C'est l'inverse de
`planning-semaine` (des cours qui reviennent chaque semaine) et de `parcours-atelier` (des étapes sans date), et ce n'est pas
`cartes-empilees-agenda` (des événements où l'on vient, sans inscription ni places).

## Sources

- **MAP, Moto-Auto-Pédagogie** : [moto-auto-ecole.com](https://www.moto-auto-ecole.com/), lu le samedi 31 oct 2026. L'accueil est
  une porte « Choisissez votre agence » (Annecy, Seynod), chaque agence a sa vitrine. Barre : téléphone, Contact, Recrutement,
  « Aller sur MAP Seynod », puis Accueil, Code, Auto, 2 roues, Accessoires, Outils. La page
  [Auto d'Annecy](https://www.moto-auto-ecole.com/annecy/auto/) aligne les formations en fiches à prix (« Permis B conduite
  supervisée boîte automatique, 1 120 € », « accompagnée, 1 396 € », « traditionnelle, 979 € ») et une session datée : « Mercredi
  25 novembre 2026, 9 h à 13 h et 14 h à 17 h, Formation B78 vers B, 499 €, plus qu'une seule place ». Chaque formation a sa page :
  ce qu'il faut avant (16 ans révolus, l'ASSR2, le code obtenu, qui n'est pas inclus), l'heure d'évaluation sur simulateur, le cours
  de sécurité routière, le livret numérique, la liste des documents d'inscription, le centre d'examen.

## Pages

MAP : porte des agences ; par agence, accueil, Code (inscriptions), Auto, 2 roues, une page par formation, accessoires, outils,
labellisation, contact, CGV, mentions.

## Navigation

Par discipline (Code, Auto, 2 roues), le téléphone en tête de la barre.

## Ordre de l'accueil (construction gardée)

1. h1, métier à la ville, ancienneté, note, téléphone, la phrase d'inscription du client ; la photo du client et, posé à cheval
   sur son bord bas (débordant sur le bloc suivant), le billet de **la toute prochaine session**.
2. **Les prochaines sessions** (`id="sessions"`) : toutes formations confondues, de la plus proche à la plus lointaine, en billets
   (talon daté, formation, jour en toutes lettres, horaires, lieu, prix, places restantes en mots : « Plus qu'une place »,
   « Complet » barré) ; un filtre par catégorie dans le navigateur ; une session passée tombe au build et, le jour venu, dans le
   navigateur. Piste au doigt, au téléphone comme à l'ordinateur.
3. **Les formations** (`id="formations"`) : une colonne par catégorie (Voiture, Deux-roues, Code ; piste au téléphone), chacune
   avec son prix, sa durée et sa prochaine date (« Toute l'année, à votre rythme » sans session).
4. Les avis en quinconce ; l'agence, les horaires, le centre d'examen et la demande ; le pied.

`/formations` : toutes les formations par catégorie (prix, durée, prérequis, prochaine session), le centre d'examen, les
questions. Page d'une formation : catégorie, prix, durée, photo, texte, **ses sessions** (date longue, horaires, lieu, places,
« S'inscrire à cette session » sauf complet), « Avant de commencer », « Le prix comprend », « Pièces à fournir », l'appel.

## Ce qui fait vendre

L'élève (ou son parent) a une date à tenir : vacances, examen, travail. Une date et un nombre de places écrits valent mieux qu'un
« contactez-nous » ; « plus qu'une place » fait appeler. Les prérequis et les pièces évitent un aller-retour à l'agence.

## Signes à NE PAS reprendre

Le panier et « Acheter maintenant » (aucun paiement en ligne : la demande part au client), les titres en capitales, le carrousel
de formations à flèches, les visuels « Promotion auto » en aplats, la bannière cookies qui couvre l'offre, « ANNEE 2026 » en
bandeau sur chaque fiche.

## Codée dans l'usine (31 oct 2026)

`layout: { architecture: 'sessions-places' }` (`src/lib/architectures.ts`) : coquille `sessions` (`src/shells/sessions.astro`),
`formations` dans le schéma (`intro`, `inscription`, `examen`, `liste[]` : slug et nom obligatoires ; catégorie, prix, durée,
prérequis, comprend, documents, texte, photo, `sessions[]` : début AAAA-MM-JJ obligatoire, fin, horaires, places, lieu ; jamais
devinés), `src/lib/sessions.ts` (`formationsCompletes`, `sessionsAVenir`, `sessionsDe`, `placesEnMots`, `dateDeSession`,
`parCategorie`, `lienFormations`, `isoDuJour`), pages `/formations` (FAQPage) et `/formations/<slug>`, `wording.formations`,
mesures `formations` (3) et `sessions` (2), nav « Les formations » en tête, aucune section de layout, pied `liens`. Reste : la
porte des agences (deux agences = `pages-adresses` à combiner), l'inscription réglée sur une session (`?session=`).

Preuve : site jetable (auto-école d'essai à Annecy, six formations, huit sessions aux dates, prix et places plausibles non
relevés, trois avis marqués « d'essai », numéro de la tranche réservée à la fiction, photo d'illustration Wikimedia marquée ;
supprimé), `ff verifier` vert (`ff a11y`, `ff typo`, `ff ia` compris), `ff ressemblance` contre tout le registre : premier écran
0,60 au téléphone (demo-informatique) et 0,40 à l'ordinateur, déroulé 0,49, **linéarité 0,49** (téléphone : chevauchement, trois
pistes ; ordinateur : chevauchement, piste). Premier essai en grille de billets : linéarité 0,94 (des billets étroits ne se
mesurent pas comme une grille), d'où la piste et le billet qui déborde. Captures : `captures/sessions-places-source.jpg`,
`captures/sessions-places-essai.jpg`.
