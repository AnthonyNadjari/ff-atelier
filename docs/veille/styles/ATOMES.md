# Atomes de style : un vrai site décomposé, pour croiser

Le fondateur, 18 oct 2026 : « il en faut beaucoup plus. Et je veux pas qu'on se limite à ça, faut faire des
cross ». Appliquer « le style du site X » en entier donne autant de looks que de sites étudiés. Décomposer chaque site
en **atomes indépendants** (sa typographie, ses couleurs, sa densité, ses formes, ses photos, son mouvement, sa
matière, son architecture, son premier écran) et les **croiser** (`ff melanger`) donne des combinaisons quasi infinies,
toutes faites de valeurs réelles, jamais deux fois la même.

- Un fichier par site étudié : `docs/veille/styles/atomes/<id>.json` (l'id = le nom du fichier).
- Relevé brut à côté : `docs/veille/styles/atomes/mesures/<id>.json` (`ff atomes mesurer`).
- Validateur pur : `scripts/ff/atomes.mjs` (`validerAtomes`, testé par `tests/atomes.test.mjs`) ; `ff atomes` valide
  tout le registre et dit ce que chaque fichier rend tirable.
- Croisement : `scripts/ff/melanger.mjs` (`ff melanger`, testé par `tests/melanger.test.mjs`).

## Règle d'or : mesuré, ou « à juger »

Une valeur vient du DOM calculé du vrai site (`ff atomes mesurer`, `ff demonter`) ou d'une fiche de démontage qui l'a
lue dans son CSS. Sinon elle vaut la chaîne `"à juger"`. Un atome dont un champ requis est « à juger » n'est **pas
tirable** par `ff melanger` (le fichier reste valide : les autres atomes du site servent). Jamais de valeur au goût.

Le jugement (la police libre la plus proche, le traitement des photos, le régime du mouvement, la famille de premier
écran) se fait en regardant les captures et la fiche, et se justifie dans le champ `remarque` de l'atome.

## Format

```json
{
  "id": "coutumes", "version": 1,
  "source": { "url": "https://coutumes.com/", "nom": "Coutumes", "metier": "bijoux pour homme",
              "fiche": "docs/veille/demontages/coutumes.md", "mesures": "docs/veille/styles/atomes/mesures/coutumes.json",
              "date": "2026-10-18" },
  "typo": { … }, "couleurs": { … }, "densite": { … }, "formes": { … }, "photos": { … },
  "mouvement": { … }, "matiere": { … }, "architecture": null, "premier_ecran": "diptyque"
}
```

Chaque atome peut valoir `"à juger"` en entier. Champs (requis pour être tirable en **gras**) :

### `typo`
- `titre` : `famille` (police mesurée), **`libre`** (clé de `src/lib/fonts.ts` la plus proche ; jamais une clé de
  `CLES_IA`, `scripts/ff/ia.mjs` ; une police de fontsource absente du registre s'y ajoute d'abord, avec son genre dans
  `GENRES` de `atomes.mjs`), `graisse` (100-900), `interlignage` (rapport), `casse` (`none` | `uppercase` | …),
  `interlettrage` (em), `italique`.
- `texte` : `famille`, **`libre`**, `graisse`, `interlignage`.
- `mono` : `{ famille, libre }` ou `null`.
- `echelle` : **`h1`**, `h2`, **`texte`**, chacun `{ telephone, ordinateur }` en px (390 et 1 440 px de large). Le
  « h1 » est le titre AFFICHÉ (le plus gros texte du premier écran) : un h1 caché ou réduit à une ligne de
  référencement n'est pas ce que l'œil voit.
- `remarque` : pourquoi cette police libre.

### `couleurs`
- `principal` : `clair` | `sombre` ; puis `clair` et/ou `sombre` : palettes `{ **fond**, surface, **texte**, texte2,
  **accent**, accent2, bordure, encre }` en hex `#rrggbb` (`encre` = le bloc contrasté : pied, bandeau). Une palette
  absente vaut `null`.

### `densite`
- **`section`** `{ telephone, ordinateur }` : marge verticale d'une section (du bord au premier texte) ;
  **`gouttiere`** `{ telephone, ordinateur }` : bord de l'écran au téléphone, écart entre colonnes à l'ordinateur ;
  **`conteneur`** (px) ; `mesure` (caractères par ligne du texte courant) ; `rythme` (`uni` | `alterne`).

### `formes`
- **`rayon`** (boutons), **`rayonCarte`**, `rayonImage`, `bordure` (px), **`ombre`** (`aucune` | `douce` | `portee`),
  **`bouton`** (`plein` | `contour` | `texte`), `pilule` (booléen mesuré), `casseBouton`, `lien` (`souligne` |
  `couleur` | `aucun`).

### `photos`
- **`traitement`** : `plein-cadre` | `vignette` | `detoure` | `duotone` | `noir-et-blanc` | `cadre` | `masque` ;
  `rapports` (mesurés) ; `superposition` (`aucune` | `voile` | `texte-sur-photo` | `chevauchement`) ; `remarque`.

### `mouvement`
- **`regime`** (`calme` | `vivant`), **`defilement`** (`aucun` | `apparitions` | `suit-le-defilement`),
  **`ui`** et **`scene`** `{ duree (s), courbe (cubic-bezier ou mot-clé) }`, `bibliotheques`.

### `matiere`
- **`fond`** (`uni` | `sections-colorees` | `aplats-francs`), **`filets`** (`aucun` | `fins` | `grille`), `texture`.
  Grain, halo, reflet n'existent pas ici : refusés par `docs/GOUT.md` § 2.

### `architecture`, `premier_ecran`
- `architecture` : id du registre `docs/veille/architectures/INDEX.md`, ou `null`.
- `premier_ecran` : id de famille de `.claude/skills/site-final/premiers-ecrans.md`.

## Ce que `ff melanger` en fait

`node scripts/ff.mjs melanger <slug> [--typo id] [--couleurs id] [--densite id] [--formes id] [--photos id]
[--mouvement id] [--matiere id] [--architecture id] [--premier-ecran famille] [--style id] [--hasard] [--graine n]
[--n 3] [--essai] [--simuler]`

1. Lit le registre (`construireRegistre`) : un atome n'est tirable que s'il est mesuré, valide, et passe ses propres
   règles (polices cohérentes, palette lisible).
2. Lit le client : photos hors banque, plus grande largeur (`images.json`, `raw/`), aiguillage (`ff aiguillage`),
   nombre d'avis, urgence.
3. Tire chaque atome non imposé (`--style id` impose tous les atomes tirables d'un site : un style entier), pondéré
   vers les atomes peu utilisés, sous les contraintes ci-dessous ; recommence jusqu'à 400 fois.
4. Écrit une direction générée `src/directions/m-<hash>/` (index.css : tous les tokens + échelle, boutons, liens,
   cartes, photos, filets ; meta.ts : atomes et sources, `melange: true` pour que `ff composer` ne la propose jamais
   ailleurs), l'enregistre dans `DIRECTIONS` (`src/lib/schema.ts`, sous le marqueur des mélanges), écrit
   `sites/<slug>/look.json` (direction, polices, accent, motion, tone) et la ligne du contrat :
   `Style : mélange <typo:… · couleurs:… · …> · Architecture : … · PREMIER ÉCRAN — famille : …`.
5. Inscrit le site dans `docs/empreintes/melanges.json` (sauf `_…`). Un nouveau mélange du même site remplace
   l'ancien (sa direction est supprimée si aucun autre site ne la porte).

`--n 3` : trois mélanges pour les trois pistes d'un client, qui ne partagent pas plus de 2 atomes deux à deux ni la
même famille de premier écran ; la commande imprime les trois lignes à lancer (une par piste, tous les atomes
imposés). `--essai` : les trois mélanges appliqués à des copies jetables `sites/_essai-melange-<k>`, construites
(verrou `.ff-tmp/build.lock`), capturées côte à côte dans `captures/planches/<slug>-melanges.jpg`, puis copies et
directions supprimées.

Ce que l'usine n'applique pas encore : la `gouttiere` (les sections posent leurs marges latérales en classes Tailwind,
il n'y a pas de token) et l'`architecture` (ordre des blocs, coquille : registre `docs/veille/architectures/` en cours
de remplissage ; le mélange la choisit et l'écrit au contrat, l'agent l'applique). Le traitement `duotone` passe par
`ff nettoyer-photos --duotone` (la commande l'imprime) ; `detoure` se demande au client.

## Contraintes (fonctions pures de `melanger.mjs`, testées)

| Contrainte | Règle |
|---|---|
| Contraste | Texte, texte secondaire et accent ≥ 4,5:1 sur le fond, le fond alterné et la surface ; texte sur l'accent, sur l'aplat et sur l'encre ≥ 4,5:1. Ce qui manque est **ajusté en luminosité, même teinte**, et noté dans le CSS (« Dérivé par calcul ») ; un texte illisible sur son propre fond rend la palette intirable. |
| Aplat de marque | La couleur d'accent MESURÉE reste l'aplat des boutons et de la sélection (`--fill`), même quand elle a dû être assombrie pour servir de texte : le jaune de Paput reste jaune. |
| Polices | Le texte courant n'est jamais une police d'affichage (didone, grasse, condensée, manuscrite) : donc ni deux serif d'affichage ni deux manuscrites. Une chasse fixe en texte est permise (mesurée sur deux sites). Aucune police IA. La paire (titre, texte) n'est jamais celle d'une direction existante. |
| Graisses | Graisse ramenée à la plus proche disponible (`metadata.json` de fontsource) : pas de faux gras synthétisé. |
| Photos | `plein-cadre` exige une photo du client d'au moins 1 600 px. |
| Mouvement | Aiguillage « calme » : régime calme, rien ne suit le défilement, `motion: 'subtle'`. |
| Premier écran | Famille libre (ni pistes sœurs ni 4 derniers sites, comme `ff contrat`, registre des mélanges compris) et dont les données existent (`mosaique` : 8 photos ; `preuve-d-abord` : 50 avis ; `numero-geant` : urgence ; …). |
| Architecture | Libre de la même façon, parmi `docs/veille/architectures/INDEX.md`. |
| Unicité | Plus de 3 atomes partagés avec un site du registre = refusé ; trois pistes = 2 au plus deux à deux. |
| Charte | Texte courant ≥ 16 px au téléphone (24 px au plus à l'ordinateur) ; mesure ramenée entre 45 et 75 caractères ; boutons pilule mesurés rendus à 6 px (signe IA, `docs/GOUT.md` § 2) ; emphase des titres sans italique ; ni grain ni halo. |

## Règles de compatibilité apprises (en regardant des mélanges)

Chaque ligne vient d'un essai regardé, avec le mélange qui l'a provoquée. Une règle sans essai est marquée « a priori ».

- **18 oct 2026, `ff melanger _exemple --n 3 --hasard --essai` (graine 1602220151), mélange m-061ddd** (typo
  pizza-amici, couleurs latabledejoakim) : l'interlignage de 0,78 mesuré sur salo, appliqué à Oswald qui la remplace,
  faisait **se chevaucher les lignes du titre**. Une police libre de remplacement n'a pas les métriques de
  l'originale : plancher d'interlignage 0,9 en capitales, 1 en casse normale.
- **Même essai, m-061ddd** : `--scale-sm` (titres des cartes de services, trois colonnes) dérivé d'un h2 de 96 px coupait
  « BIBLIOTHÈQ-UES » en plein mot. Plafonné à 24 px au téléphone, 30 px à l'ordinateur.
- **Même essai, m-394c01** (couleurs pizza-amici) : l'emphase des titres dans l'accent assombri pour l'AA (or
  #E3AF04 → #745902) donnait un **olive boueux**. Un titre est du grand texte (3:1 suffit) : l'emphase prend la première
  couleur MESURÉE qui tient 3:1 sur les fonds (aplat, puis accent 2 : ici le rouge #C72531), l'accent lisible en
  dernier recours.
- A priori : titre en graisse ≤ 300 sur un contraste texte/fond < 7:1 refusé ; titre de 140 px et plus dans une page
  à marges de section < 64 px refusé. À confirmer ou retirer au premier essai qui les rencontre.

## Remplir les atomes (veille, volet 2a quater)

1. `node scripts/ff.mjs atomes mesurer <url> --id <id> --fiche <fiche.md> --nom "<Nom>"` : relevé (Chrome, un seul à
   la fois) et brouillon où tout ce qui demande un œil est « à juger ». Un brouillon existant n'est jamais écrasé.
2. Regarder les captures et la fiche ; remplir `libre` (police du registre la plus proche, jamais IA), `couleurs.principal`
   et la palette (depuis `couleurs.releve`, puis supprimer `releve`), `photos.traitement`, `mouvement.regime` et
   `defilement`, `premier_ecran` ; corriger ce que le relevé a mal lu (h1 caché, conteneur qui est une piste
   horizontale : « à juger ») ; une `remarque` par choix.
3. `node scripts/ff.mjs atomes` doit être vert ; `ff melanger _exemple --style <id> --simuler` montre ce que le site
   apporte.

Le relevé mesure mal : les marges d'une section dont le texte est porté par un enfant (comptées seulement au-delà de
8 px), les sites dont le contenu vit dans un `<canvas>`, les animations pilotées en JavaScript. Dans le doute,
« à juger ».
