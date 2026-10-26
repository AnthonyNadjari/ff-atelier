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
même famille de premier écran ni la même architecture, et dont les palettes sont de **régimes différents** (§ Régimes
de palette) ; la commande imprime les trois lignes à lancer (une par piste, tous les atomes imposés). `--essai` : les
trois mélanges appliqués à des copies jetables `sites/_essai-melange-<k>` (direction, ET architecture : `layout` complet
du registre dans le `look.json` de la copie, ET famille de premier écran quand une variante de hero partagée la rend :
`typographique` → `typographic`, `diptyque` → `split`, `video-ou-sequence` → `video` avec une vraie vidéo), construites
(verrou `.ff-tmp/build.lock`), contrôlées (le `<html>` construit porte la direction et la coquille voulues), capturées
côte à côte dans `captures/planches/<slug>-melanges.jpg` (en-tête : régime, architecture, premier écran appliqué ou
non), puis copies et directions supprimées.

**Architectures** : seulement celles que l'usine sait construire, lues au moment du tirage dans
`src/lib/architectures.ts` (entrée du registre ET coquille `src/shells/<shell>.astro` existante), pas prises par les 4
derniers sites ni les pistes sœurs, et dont le client a les données (`donneesManquantes`). Les fiches de
`docs/veille/architectures/INDEX.md` pas encore codées ne sont jamais tirées (la commande les liste) ;
`--architecture <id>` non codée = erreur. Plus d'architecture libre pour une piste : « à choisir ».

Ce que l'usine n'applique pas encore : la `gouttiere` (les sections posent leurs marges latérales en classes Tailwind,
il n'y a pas de token) ; hors `--essai`, l'architecture et la famille s'écrivent au contrat et l'agent les applique.
Le traitement `duotone` passe par `ff nettoyer-photos --duotone` (la commande l'imprime) ; `detoure` se demande au
client.

## Régimes de palette (fonctions pures de `melanger.mjs`, testées)

Né de l'essai du 21 oct 2026 (`ff melanger prospect-epi-dor --n 3 --essai`) : trois palettes blanc / gris / noir, trois
pistes qui se ressemblaient. La garde de beauté écarte le vif en fond, et 43 des 64 palettes tirables étaient des
neutres clairs. On ne relâche pas la garde : on cherche la couleur là où elle la permet, et on exige des régimes
différents entre pistes sœurs. Mesures en OKLCH sur la palette principale (`regimePalette`, seuils `DIVERSITE`) :

| Régime | Règle |
|---|---|
| sombre | Fond de clarté < 0,5. |
| coloré doux | Fond clair de chroma ≥ 0,045 (sous B1 : < 0,08), ou surface de chroma ≥ 0,03, ou bloc d'encre (pied, bandeau) de chroma ≥ 0,04, ou deux accents vifs (≥ 0,12) de teintes à 30° ou plus. |
| clair teinté doux | Fond clair de chroma ≥ 0,012 (crème, ivoire, kraft, sauge pâle). |
| clair neutre | Le reste : fond blanc ou gris sans teinte perçue. |

- **Pistes sœurs** (`refusDiversite`) : jamais deux fonds de clarté proche (ΔL ≥ 0,04, jamais relâché) ; régimes
  différents ; teintes d'accent à 45° au moins (deux accents neutres sont trop proches). Si le registre ne le permet
  pas, le tirage descend d'un niveau (`NIVEAUX_DIVERSITE` : accent, puis régime) et le dit.
- **Tirage** : les régimes sont tirés à parts égales (sinon les neutres, majoritaires, sortent presque toujours).
- **Besoins** (`besoinsRegimes`) : un régime sous la moitié de sa part égale des palettes tirables (et sous 3) est un
  besoin de collecte ; `ff atomes` affiche le compte par régime et les besoins, `ff melanger` les écrit en tête de
  `docs/veille/journal.md` (bloc réécrit à chaque tirage, retiré quand il n'y a plus de besoin).
- Compte du 21 oct 2026 : clair neutre 43, clair teinté doux 7, sombre 5, coloré doux 9 ; besoins : palettes sombres
  et teintées.

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
| Architecture | Libre de la même façon, parmi celles que l'usine sait construire (`src/lib/architectures.ts` + coquille) et dont le client a les données. |
| Palette des pistes sœurs | Régimes différents, fonds de clarté éloignée, accents éloignés (§ Régimes de palette). |
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
  l'originale : plancher d'interlignage 0,9 en capitales (1,1 depuis le 23 oct, ligne suivante), 1 en casse normale.
- **Même essai, m-061ddd** : `--scale-sm` (titres des cartes de services, trois colonnes) dérivé d'un h2 de 96 px coupait
  « BIBLIOTHÈQ-UES » en plein mot. Plafonné à 24 px au téléphone, 30 px à l'ordinateur.
- **Même essai, m-394c01** (couleurs pizza-amici) : l'emphase des titres dans l'accent assombri pour l'AA (or
  #E3AF04 → #745902) donnait un **olive boueux**. Un titre est du grand texte (3:1 suffit) : l'emphase prend la première
  couleur MESURÉE qui tient 3:1 sur les fonds (aplat, puis accent 2 : ici le rouge #C72531), l'accent lisible en
  dernier recours.
- **23 oct 2026, `ff melanger demo-boulangerie --style her --essai`, mélange m-e1eaef** (typo her, Hanken Grotesk 500 en
  capitales, interlignage 1,0 mesuré) : les **accents des capitales** (« DEUXIÈME », « À ») touchaient la ligne du
  dessus. En français, le plancher en capitales passe de 0,9 à 1,1 (`interlignageTitre`, testé).
- **Interlignage du titre plafonné à 1,3** (essai du 25 oct 2026, style androuet, m-f5804d) : 1,5 relevé sur Androuet
  (h1 d'une ligne de 16 px, vrais titres en h2) ouvrait un trou entre les trois lignes d'un h1 de 40 px. Le plafond de
  `interlignageTitre` passe de 1,5 à 1,3 (testé).
- **23 oct 2026, `ff melanger demo-boulangerie --n 3 --hasard --essai` (graine 24531909), mélange m-c94c90** (typo loewe) :
  h1 de 18 px pour un texte de 14 porté à 16 : le titre (métier et ville, GOUT § 0) se perd dans le texte au téléphone.
  Une typo n'est tirable que si son h1 fait au moins **1,2 fois** le texte au téléphone (`controlerPolices`,
  `TITRE_DOMINE`, testé) ; 14 typos du registre sortent du tirage (bensimon, cyrillignac, debauve, formafantasma,
  georgjensen, kinto-usa, kvadrat, ladoublej, lobmeyr, loewe, mociun, monbazillac, nomos, perimeter), leurs autres
  atomes restent.
- **24 oct 2026, `ff melanger demo-boulangerie --style blenheim --essai`, mélange m-198731** : la casse `capitalize`
  mesurée sur un site anglais (« title case ») donnait « Le Pain Du Matin, Et Une Deuxième Fournée ». En français, un
  titre ne prend la majuscule qu'au premier mot : `capitalize` devient `none` (`casseTitre`, testé).
- **24 oct 2026, mêmes essais, styles hiut, lyles et wolseley (m-b9c2ba, m-a6a142, m-c479f2)** : des capitales espacées à
  0,10-0,15 em, mesurées sur des titres de deux ou trois mots, cassaient le h1 français (une phrase : métier et ville) en
  cinq ou six lignes. Plafond 0,06 em en capitales, -0,04 à 0,02 em en casse normale (`interlettrageTitre`, testé).
- **26 oct 2026, `ff melanger demo-boulangerie --style <id> --essai`, styles thepalomar, cafedeflore, bobbobricard et
  lesdeuxmagots (m-d5bbb3, m-92c906, m-317021, m-a76889)** : les capitales de ces sites habillent des titres de un à trois
  mots ; sur le h1 français d'une phrase (métier, ville), même resserrées à 0,06 em, elles le cassaient en quatre à six
  lignes à l'ordinateur. Règle `casseH1` (`melanger.mjs`, testée) : le h1 repasse en casse normale, les h2 et h3 gardent
  les capitales du style ; vérifié au second essai de thepalomar (quatre lignes au lieu de six).
- **26 oct 2026, soir, `ff melanger demo-boulangerie --style handsomebrook --essai` (m-bc0514) et `ff melanger _exemple
  --n 3 --hasard --essai` (m-cdbbd5 typo eastfork, m-d11c9b typo ennismore)** : le h2 était copié tel que mesuré, sans
  lien avec le reste de l'échelle. Chez Handsome Brook (h2 = h1 = 97 px), le h1 du premier écran, plafonné par la coquille
  (cadre : 5,5 rem), sortait plus PETIT que « LA BOULANGERIE » (un h2 plus grand que le h1 : signe IA, GOUT § 2). Chez
  East Fork et Ennismore (h2 de 16 à 18 px, des étiquettes sur la source), « L'atelier » et « Nos services » se lisaient
  comme du texte. Règle `echelleH2` (`melanger.mjs`, testée) : le h2 est tenu entre 1,33 fois le texte (`H2_SUR_TEXTE`)
  et 0,75 fois le h1 (`H2_SUR_H1`), le plancher gagnant si les deux se croisent. Vérifié au second essai de handsomebrook
  (titre de section sous le h1) et sur un nouveau tirage au hasard (graine 805782905 : trois h2 au-dessus du texte).
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
