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
- **`profil`** : id d'un profil de `docs/veille/styles/MOUVEMENTS.md` (entrée, apparition, survol, fond, attributs du
  moteur ; jugé sur la fiche, justifié dans `remarque`) ; **`regime`** (`calme` | `vivant`), **`defilement`** (`aucun` |
  `apparitions` | `suit-le-defilement`), **`ui`** et **`scene`** `{ duree (s), courbe (cubic-bezier ou mot-clé) }`,
  `bibliotheques`.

### `matiere`
- **`fond`** (`uni` | `sections-colorees` | `aplats-francs`), **`filets`** (`aucun` | `fins` | `grille`), `texture`.
  Grain, halo, reflet n'existent pas ici : refusés par `docs/GOUT.md` § 2.

### `architecture`, `premier_ecran`
- `architecture` : id du registre `docs/veille/architectures/INDEX.md`, ou `null`.
- `premier_ecran` : id de famille de `.claude/skills/site-final/premiers-ecrans.md`.

## Ce que `ff melanger` en fait

`node scripts/ff.mjs melanger <slug> [--typo id] [--couleurs id] [--densite id] [--formes id] [--photos id]
[--mouvement id] [--matiere id] [--architecture id] [--premier-ecran famille] [--style id] [--hasard] [--graine n]
[--n 3] [--essai] [--simuler] [--video client|animer|banque]`

1. Lit le registre (`construireRegistre`) : un atome n'est tirable que s'il est mesuré, valide, et passe ses propres
   règles (polices cohérentes, palette lisible).
2. Lit le client : photos hors banque, plus grande largeur (`images.json`, `raw/`), ton de ses photos (clarté L* et
   chaleur, `raw/`), vidéo (sa vidéo dans `raw/`, ou `public/videos/` créditée Pexels = banque, `ff animer` = animée ;
   `--video` déclare ce qui est prévu), aiguillage (`ff aiguillage`), nombre d'avis, urgence.
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
| Mouvement | Aiguillage « calme » : régime calme, rien ne suit le défilement, profil marqué calme, `motion: 'subtle'`. Profil (`MOUVEMENTS.md`) : fond vidéo seulement avec une vraie vidéo ou `--video animer\|banque` prévu (jamais une vidéo de banque présentée comme celle du client ; poster obligatoire) ; séquence avec une vidéo ou une photo de 1 920 px ; compteur avec un vrai chiffre. Trois pistes : ni la même entrée ni la même apparition. Le profil donne `motion` du look et ses consignes sont imprimées avec le mélange. |
| Beauté | Voir § Garde de beauté : fond vif, capitales condensées sur fond coloré, aplats vifs concurrents, vibration, trop de teintes, accord de polices en conflit, photos sombres nues sur blanc froid. |
| Premier écran | Famille libre (ni pistes sœurs ni 4 derniers sites, comme `ff contrat`, registre des mélanges compris) et dont les données existent (`mosaique` : 8 photos ; `preuve-d-abord` : 50 avis ; `numero-geant` : urgence ; …). |
| Architecture | Libre de la même façon, parmi `docs/veille/architectures/INDEX.md`. |
| Unicité | Plus de 3 atomes partagés avec un site du registre = refusé ; trois pistes = 2 au plus deux à deux. |
| Charte | Texte courant ≥ 16 px au téléphone (24 px au plus à l'ordinateur) ; mesure ramenée entre 45 et 75 caractères ; boutons pilule mesurés rendus à 6 px (signe IA, `docs/GOUT.md` § 2) ; emphase des titres sans italique ; ni grain ni halo. |

## Garde de beauté (fonctions pures de `melanger.mjs`, testées)

Née de L'Épi d'Or d (m-cca519, 18 oct 2026 : « juste un peu moche ») : fond jaune d'or plein sur toute la page, Bebas
Neue en capitales, encre brune, boutons rouge-orangé, vert en second accent. Chaque couleur passait l'AA : le mélange
était lisible, et laid. La garde refuse ce qui est laid, pas seulement ce qui est illisible. Les couleurs se mesurent en
**OKLCH** (`hexVersOklch`, `atomes.mjs`) : la chroma y est perçue de la même façon quelle que soit la teinte, ce que la
saturation HSL ne garantit pas (un jaune HSL 100 % paraît bien plus vif qu'un bleu HSL 100 %). Seuils (`BEAUTE`) calés
sur les palettes mesurées du registre : tous les fonds de vrais sites sont sous 0,04 de chroma (le kraft de Meyers,
0,036, est le plus coloré), sauf celui de Café Binocle (0,14).

| Règle | Refus | Raison |
|---|---|---|
| B1 Fond vif | Fond de page de chroma ≥ 0,08 (clair) ou ≥ 0,13 (sombre : bleu nuit, vert bouteille passent) | La direction peint `--bg` sous toute la page : la couleur dominante (le « 60 » de la règle 60-30-10) doit être un neutre, au plus teinté ; une couleur saturée en grande surface fatigue l'œil et écrase les photos (Itten, contraste de quantité). La vive se garde aux petites surfaces. |
| B2 Capitales condensées sur fond coloré | Titre condensé (Bebas, Oswald, « Condensed ») en capitales sur un fond de chroma ≥ 0,045 | Une condensée en capitales est une voix d'affiche ; sur un fond qui a une couleur, la page devient une affiche de foire. Sur blanc ou crème (Coutumes, Pizza Amici, les sites d'où elles viennent), elle garde sa tenue. |
| B3 Aplats vifs concurrents | Plus de 2 aplats vifs parmi fond, surface, bouton (accent mesuré) et second accent (chroma ≥ 0,12) ; ou un fond vif plus une autre vive | Une page a une couleur forte, deux au plus ; trois vives n'ont plus de hiérarchie, l'œil ne sait plus où aller (règle 60-30-10). |
| B4 Vibration | Deux vives de même clarté (ΔL < 0,1) et de teintes à 40° ou plus | Deux couleurs saturées de même valeur vibrent à leur frontière (Albers, *Interaction of Color*) : le bouton rouge-orangé contre le vert de m-cca519 (ΔL 0,01). |
| B5 Trop de teintes | Plus de 3 familles de teintes actives (chroma ≥ 0,04, regroupées à 30° près) dans la palette | Au-delà de trois rôles colorés (dominante, secondaire, accent), la page n'a plus de dominante. |
| B6 Accord en conflit | Deux polices DIFFÉRENTES du même genre : deux serifs (serif, serif d'affichage, slab), deux sans de texte, deux chasses fixes (`controlerPolices`, `atomes.mjs`) | Bringhurst (*Elements of Typographic Style* § 6.5) et Butterick (*Practical Typography*, « font pairing ») : on accorde par contraste (une serif et une sans, une sans d'affichage et une sans de texte) ou par concordance (une seule famille), jamais par quasi-ressemblance, qui a l'air d'une erreur. Deux polices d'affichage étaient déjà refusées (le texte n'est jamais une police d'affichage). |
| B7 Photos sombres nues sur blanc froid | Photos du client sombres et chaudes (L* médiane < 55, R - B > 15, mesurées par `ff melanger` sur `raw/`) en vignettes sans ombre ni filet, sur un fond quasi blanc et froid (L ≥ 0,97, chroma < 0,015) | Contraste simultané : un blanc pur autour d'une photo sombre l'assombrit encore, elle fait un trou dans la page. Les encadreurs posent un passe-partout ; ici : cadre, fond chaud, plein cadre ou noir et blanc (masque, cadre et plein cadre passent). |

B1, B3, B4 et B5 ne dépendent que des couleurs : un atome `couleurs` qui les viole est écarté dès la lecture du registre
(`ff atomes` l'affiche, « écarté : … (garde de beauté) ») ; aujourd'hui, la palette de Café Binocle (fond jaune d'or
plein, bouton rouge-orangé et vert vifs qui vibrent). B2 et B7 croisent typo, couleurs, photos et client : vérifiés à
chaque tirage (`refusBeaute`, appelé par `refusCroises`) ; quand plus aucune combinaison ne passe, l'erreur dit les refus
les plus fréquents.

**Verdict sur L'Épi d'Or** (`tests/melanger.test.mjs`, photos réelles de la boulangerie : L* 48, chaudes) :
- **d, m-cca519 : refusé** quatre fois (B1 fond #ffe26e chroma 0,14 ; B3 trois aplats vifs fond / bouton #ef5b34 /
  second accent #00a881 ; B4 bouton et vert qui vibrent ; B2 Bebas en capitales sur fond coloré).
- **b, m-e7e9e8 : passe** (fond #fdfdfd neutre, une seule vive #ff4c24, Bodoni + Urbanist, photos en masque).
- **c, m-751d7c : passe** (fond #f2ede9 neutre, deux vives or #e3af04 et rouge #c72531 de clartés éloignées, ΔL 0,24 ;
  trois familles de teintes ; Gloock + Karla ; photos en cadre).

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
   et la palette (depuis `couleurs.releve`, puis supprimer `releve`), `photos.traitement`, `mouvement.regime`,
   `defilement` et `profil` (MOUVEMENTS.md), `premier_ecran` ; corriger ce que le relevé a mal lu (h1 caché, conteneur qui est une piste
   horizontale : « à juger ») ; une `remarque` par choix.
3. `node scripts/ff.mjs atomes` doit être vert ; `ff melanger _exemple --style <id> --simuler` montre ce que le site
   apporte.

Le relevé mesure mal : les marges d'une section dont le texte est porté par un enfant (comptées seulement au-delà de
8 px), les sites dont le contenu vit dans un `<canvas>`, les animations pilotées en JavaScript. Dans le doute,
« à juger ».
