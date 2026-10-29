# rayon-trajet : le site d'un artisan qui se déplace part de « vient-il jusque chez moi, et en combien de temps ? »

Volet 2a ter de `/veille`, tour 18 du 29 oct 2026. Relevé au `curl` (HTML servi) des accueils de Colson Elec et de Concept Froid
Centre (démontés aux tours 15 et 16, `marche/colson-elec.md`, `marche/concept-froid-centre.md`), plus une capture pleine page de
Colson Elec au téléphone (Chromium 390 px ; gardée : `captures/rayon-trajet-source.jpg`). On reprend la construction, jamais les
textes, images, logos ou code des sources.

Comme `carnet-interventions`, une construction qui n'est pas « onglets et listes » (journal du tour 16) : **l'espace**.
L'accueil est le territoire vu de l'atelier.

## Sources

- **Colson Elec**, électricien à Bellevigny (Vendée) : [colson-elec.fr](https://colson-elec.fr/), lu le jeudi 29 oct 2026.
  Bloc « **Je ne suis jamais loin.** » : « J'interviens dans un rayon de 40 km autour de Bellevigny », **l'atelier au centre**
  (le nom et le numéro sur un panneau) et cinq communes autour, chacune avec ses **kilomètres et ses minutes** (Le Poiré-sur-Vie
  10 km 10 min, Rocheservière 12 km 15 min, La Roche-sur-Yon 18 km 20 min, Aizenay 21 km 25 min, Montaigu 30 km 30 min), puis
  « Et aussi : » une liste, et « **Votre commune n'est pas citée ? Appelez quand même.** » ; plus bas « Votre commune, ce besoin »,
  les communes en pages.
- **Concept Froid Centre**, frigoriste à Suèvres (Loir-et-Cher) : [conceptfroid.fr](https://conceptfroid.fr/) et sa
  [zone d'intervention](https://conceptfroid.fr/zone-d-intervention/), lus le même jour. Juste sous les quatre métiers :
  « Zone d'intervention, 200 km autour de Suèvres. **Temps de trajet depuis notre base de Suèvres (41), en conditions
  normales.** Voici les huit pôles départementaux ; 25 communes ont leur page » : Blois ~25 min, Vendôme ~35 min, Orléans
  ~50 min, Romorantin ~50 min, Tours ~1 h, Châteauroux ~1 h 20, Chartres ~1 h 30, Bourges ~1 h 30 ; **une page par pôle**
  (`/frigoriste-blois/`…). La même idée chez All'Eau Plombier (Cannes, communes en minutes, `marche/alleau-plombier.md`).

## Pages

Colson Elec : accueil, prestations, réalisations, une page par commune. Concept Froid Centre : 4 métiers, 8 pôles + 25 communes,
réalisations, entreprise, contact.

## Navigation

Colson Elec : « Disponible cette semaine », le numéro, Devis gratuit / Appeler. Concept Froid Centre : un lien par métier,
« Zone d'intervention », le numéro ; barre basse Appeler / Devis au téléphone.

## Ordre de l'accueil (construction gardée)

1. h1 (métier à la ville), ancienneté, note, téléphone ; à côté « **Combien de temps pour venir chez vous ?** » : on tape sa
   commune (liste proposée), la réponse vient dans le navigateur (« Billom : environ 35 min depuis Issoire, 30 km », le point
   marqué sur le schéma et la ligne dans le tableau) ; sans script, la fourchette (« de 12 min pour… à 1 h 05 pour… ») et le
   lien vers le tableau.
2. La photo du client en bande pleine largeur (le camion, l'atelier).
3. **Le territoire** : « Depuis <base> », le schéma des temps (la base au centre, des cercles de 15, 30, 45, 60, 90 min ;
   chaque commune posée sur son temps **dans la direction donnée par l'artisan**, vers sa page ; au téléphone des numéros, ceux
   du tableau) et à côté le tableau des communes de la plus proche à la plus loin (trajet, distance), la phrase pour une
   commune absente et le numéro.
4. Les avis s'il y en a ; « La base » (adresse, téléphone, horaires) ; le pied avec les pages des services.

Page d'une commune : « <métier> à <commune> », « Environ 35 min depuis Issoire, 30 km », la ligne de trajet (la base, la
commune à sa part du temps le plus long), la phrase de l'artisan, ce qu'il vient y faire (les pages des services), l'appel, les
communes à un temps proche. `/trajet` : toutes les communes par cercle de temps, puis les questions.

## Ce qui fait vendre

« Délai d'arrivée chiffré par commune » : 2 sites sur 90 au marché (`marche/CE-QUI-VEND.md`), et les deux sont parmi les plus
vendeurs de leur tour. Le client d'un artisan qui se déplace pose d'abord une question de distance ; une liste de communes ne
dit ni « oui » ni « combien de temps ». Le schéma le dit d'un coup d'œil, la question tapée le dit pour lui, et chaque commune
a sa page (le référencement local que les deux sources cherchent).

## Signes à NE PAS reprendre

Carte Google en iframe (traceur), Inter et tirets cadratins (Concept Froid), « 200 km » en chiffre géant de tableau de bord,
panneaux routiers dessinés, la carte de consentement qui couvre le tiers du téléphone.

## Codée dans l'usine (29 oct 2026)

`layout: { architecture: 'rayon-trajet' }` (`src/lib/architectures.ts`) : coquille `trajet` (`src/shells/trajet.astro`),
`trajet` dans le schéma (`base`, `conditions`, `rayonKm`, `ailleurs`, `communes[]` : slug, nom, minutes, km, direction parmi les
huit, texte), `src/lib/trajet.ts` (`communesCompletes`, `dureeLisible`, `anneaux`, `rayonSchema` en racine carrée pour que les
communes proches ne s'entassent pas, `placer` avec le côté de chaque étiquette choisi pour ne pas en chevaucher une autre,
`chercher` sans accent ni casse, « st » = « saint », `voisinesDe`, `lienTrajet`), pages `/trajet` (avec les questions, FAQPage)
et `/trajet/<slug>` (Service, `areaServed`), `wording.trajet`, mesures `trajet` (4 communes) et `directionsTrajet` (3 placées),
nav « Temps de trajet » en tête, sections : avis seulement, pied `liens`, tiroir de contact. **Une commune sans direction n'est
jamais placée au hasard** : elle est dans le tableau, pas sur le schéma ; le schéma dit « pas une carte ». Restent : un fond de
plan fourni par le client (les vraies routes), la zone en polygone, le « disponible cette semaine » de Colson.

`ff ressemblance` ne voyait pas l'espace (le territoire classé « à propos », modèle « plusieurs pages ») : nouveau modèle de
navigation **« plan ou schéma »** (`scripts/ff/deroule.mjs`) : au moins quatre liens posés en position absolue sur un plan
d'au moins la moitié de l'écran.

Preuve : site jetable (ramoneur d'essai à Issoire, direction `labo`, onze communes d'essai avec des temps et directions
plausibles non mesurés, aucun avis ; photos d'illustration Wikimedia marquées ; supprimé), `ff verifier` vert hors téléphone et
e-mail de test (`ff a11y`, `ff typo`, `ff ia` compris), `ff nettete` vert (un avertissement : bande photo à 2 400 px pour 2 800
demandés), `ff ressemblance` contre tout le registre : au plus 0,63 au téléphone (finck-fisch), 0,61 à l'ordinateur
(studio-ambre), 0,63 au déroulé (fromagerie-ravanel-d) ; déroulé héros, à propos (le territoire), lieu, pied ; modèle « plan ou
schéma ». Essais refusés : schéma à rayon proportionnel (les communes à moins de 20 min illisibles autour de la base) ; noms
au téléphone (onze étiquettes se chevauchaient dans 320 px : des numéros à la place) ; services et questions sur l'accueil
(déroulé 0,84 contre demo-plomberie). Les directions `sapin` (Space Mono, signe IA de `ff ia`) et `cobalt` (pied et bandeau
d'appel en `text-on-ink/80` sous 4,5:1) ont été écartées pour l'essai : défauts de ces directions, à reprendre. Capture :
`captures/rayon-trajet-essai.jpg` (téléphone en deux colonnes, ordinateur, page d'une commune).
