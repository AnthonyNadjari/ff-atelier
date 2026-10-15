# Redondances et trous de la bibliothèque — 15 oct 2026

Lecture seule du dépôt (`src/directions`, `src/sections`, `src/shells`, `presets`, `sites`,
`scripts/ff/composer.mjs`, `scripts/ff/ia.mjs`, `src/lib/fonts.ts`), croisée avec `ff variete`,
`ff modeles`, `ff signatures`. Aucun build, aucune capture. Le critère est celui de `docs/GOUT.md` § 1 :
la différence entre deux sites se juge au squelette, à la typo et aux photos, jamais aux couleurs.

Chiffres de départ : 18 directions, 44 variantes de section (11 types), 7 coquilles, 32 presets,
64 polices au registre, 21 sites clients + 7 démos (+ `_exemple`, `_effets`).

Ce que les outils existants ne voient pas et que ce relevé révèle :

- **4 groupes de directions presque interchangeables** (papier chaud + cuivre ; clair + vert minéral ;
  blanc + rouge/orange + capitales ; sombre + or + serif). 10 directions sur 18 vivent dans ces 4 groupes.
- **11 presets sur 32 pointent vers une police bannie** par `ff ia` : `ff modele` puis `ff verifier`
  échouent à coup sûr. Le studio (`ff studio`) propose encore les 21 polices bannies dans son menu.
- **2 paires de sites violent la règle GOÛT « jamais même squelette ET même direction »** :
  `cantine-roulante`/`dubois-plomberie` (signal + flow + même paire de polices) et
  `forge-delacroix`/`lemaire-avocats` (nuit + sidebar).
- `ff composer` **ne choisit jamais** `proof/logos` ni `proof/marquee-quotes`, et les presets ne choisissent
  jamais `zones/chips|map`, `process/timeline|numbered|horizon`, `faq/two-columns`, `shell: index`.
- `faq/accordion` est sur 17 sites sur 21, `footer/columns` sur 12, `contact/form-split` sur 9 : c'est
  la fin de page qui fait « template », pas le hero.

---

## 1. Directions (`src/directions/*/index.css` + `meta.ts`)

### 1.1 Relevé

`accent` = `--accent-h/s/l` ; `bg (T/S/L)` = teinte/saturation/luminosité calculées du `--bg` ;
`r` = `--radius` / `--radius-card` ; `maj.` = `--heading-transform: uppercase`.

| Direction | `--bg` (T/S/L) | `--fg` | accent (T/S/L) | `--accent-2` | r | display / body | motion | ambiance (meta.ts, résumé) |
|---|---|---|---|---|---|---|---|---|
| atelier | `#faf7f2` 38/44/96 | `#1e1a16` | 22/68/39 cuivre | accent −8 % | 6/14 | Domine / Karla | subtle | chaleureux, artisanal, papier chaud |
| brut | `#fcfcf9` 60/33/98 | `#0c0b09` | 48/98/52 jaune | accent −10 % | 0/0 | Chivo / Archivo, maj. | subtle | brutaliste, bordures épaisses |
| clair | `#fafbfd` 220/43/99 | `#101a26` | 208/62/40 bleu | `#3b2d8c` violet | 12/20 | Schibsted Grotesk / Public Sans | subtle | SaaS propre, lumineux |
| eclipse | `#0a0b0d` 220/13/5 | `#f4f6f8` | 210/18/72 argent | accent L 88 % | 3/0 | Familjen Grotesk / Hanken | rich | noir encre, argent, futuriste |
| encre | `#fdfcf9` 45/50/98 | `#101010` | 0/0/8 noir | `hsl(10 80% 44%)` vermillon | 0/0 | Libre Bodoni / Public Sans | subtle | encre sur papier, trait à la main |
| ephemeride | `#f7f7f5` 60/11/96 | `#151515` | 4/63/47 rouge | accent −12 % | 2/0 | Archivo FF / Archivo FF | subtle | carton rouge, feuilles blanches, bleu postal |
| industriel | `#e9e9e7` 60/4/91 | `#151515` | 24/95/34 orange | accent −8 % | 2/2 | Bebas Neue / Red Hat Display, maj. | subtle | béton, acier, orange sécurité |
| journal | `#eff2f1` 160/10/94 | `#14181b` | 237/54/42 bleu | `#8e1f5e` | 0/0 | EB Garamond / Literata | subtle | presse écrite, filets fins |
| luxe | `#0e0d0c` 30/8/5 | `#efe9df` | 42/55/55 or | accent −12 % | 3/2 | Bodoni Moda / Karla | rich (+script) | sombre, or, lent |
| mediterranee | `#fbf6ee` 37/62/96 | `#2a221c` | 14/65/42 terre cuite | `hsl(200 60% 36%)` mer | 10/16 | Gelasio / Hanken | subtle | terre cuite et mer, arches |
| neon | `#07070b` 240/22/4 | `#f2f2ff` | 265/90/66 violet | `hsl(190 95% 55%)` cyan | 12/12 | Unbounded / Rubik | rich | dark tech, dégradés |
| nordique | `#f7f8f4` 75/22/96 | `#1c211e` | 168/32/32 céladon | `#4a3328` | 8/12 | Sora / Literata | subtle | pâle, aérienne, chaux |
| nuit | `#0b1220` 220/49/8 | `#f3efe6` | 36/70/58 ambre | accent −12 % | 10/16 | EB Garamond / Figtree | subtle | bleu nuit, blanc chaud, ciel étoilé |
| pierre | `#f0f1ec` 72/15/94 | `#191c19` | 160/30/27 serpentine | `#7a362a` | 0/0 | Bodoni Moda / Epilogue | subtle | minéral, calcaire, grand vide |
| pop | `#fffdf7` 45/100/98 | `#17120e` | 350/85/46 rose | `hsl(175 70% 28%)` turquoise | 16/24 | Anybody / Work Sans | rich | blocs vifs, ludique |
| retro | `#f6ead8` 36/63/91 | `#3b2418` | 22/80/35 orange brûlé | `hsl(42 75% 28%)` moutarde | 3/18 | Gloock / Josefin Sans | subtle | seventies, crème |
| signal | `#f9fbfc` 200/33/98 | `#12181a` | 8/85/43 rouge-orange | accent −10 % | 4/8 | Archivo Black / Archivo, maj. | none | urgence 24/7, numéro énorme |
| terre | `#f4f1ea` 42/31/94 | `#24301f` | 120/25/32 vert | `hsl(38 60% 48%)` ocre | 20/28 | Bitter / Nunito | subtle | chanvre, vert, ocre, rond |

Répartition : 14 claires (dont 6 « papier chaud », T 36-45), 4 sombres (eclipse, luxe, neon, nuit).
Accents : 6 directions dans la bande 4-24° (rouge → cuivre), 3 dans la bande 120-168° (verts), 2 bleus,
1 jaune, 1 rose, 1 violet, 1 argent, 1 noir, 1 ambre, 1 or.

### 1.2 Paires et groupes trop proches

Proximité = fond (clair/sombre + teinte) + teinte d'accent + famille de police display. Quand deux
directions ne diffèrent que par la couleur, le fondateur ne voit pas la différence.

**Groupe A — papier chaud + accent cuivre/terre cuite + serif de texte : `atelier`, `retro`, `mediterranee`
(et `terre` en bordure).**

| Paire | Ce qui est identique | Ce qui diffère vraiment |
|---|---|---|
| `atelier` ↔ `retro` | accent 22/68/39 vs 22/80/35 (même teinte, 4 points de L) ; fond papier chaud ; serif display + sans humaniste ; motion subtle | `retro` a un fond plus crème (`#f6ead8`), Gloock (gras seventies) vs Domine, `--radius-card` 18 vs 14, double filet sous les titres |
| `atelier` ↔ `mediterranee` | fond 38/44/96 vs 37/62/96 (quasi identique) ; accent 22° vs 14° ; serif Domine vs Gelasio (deux serifs de labeur à l'œil proches) ; body Karla vs Hanken (deux grotesques neutres) | `mediterranee` a un `--accent-2` bleu mer, radius 10/16 vs 6/14 |
| `retro` ↔ `mediterranee` | accents orange brûlé / terre cuite, fonds crème | Gloock vs Gelasio |

Fichiers : `src/directions/atelier/index.css`, `src/directions/retro/index.css`,
`src/directions/mediterranee/index.css` + leurs `meta.ts`.

ACTION : garder les trois, mais **écarter par un seul token chacune**, pour que le squelette typographique
change : `retro` passe `--heading-transform: uppercase` + Gloock en `--display-weight` plein et garde le
double filet (le seventies est une affiche, pas un livre) ; `mediterranee` abandonne le serif display et prend
une **sans large chaude** (`Bricolage Grotesque`, déjà au registre, déjà sur `moteur-fils`/`pop-evenement`, ou
`Anybody` étirée) avec `--accent` basculé sur le **bleu mer** (`hsl(200 60% 36%)`) et la terre cuite en
`--accent-2` ; `atelier` reste le serif de labeur sur papier. Trois directions, trois squelettes typo :
livre / affiche / grotesque large.

**Groupe B — clair + vert gris minéral : `nordique` ↔ `pierre` (+ `terre`).**

- `nordique` : bg `#f7f8f4` (75/22/96), accent 168/32/32. `pierre` : bg `#f0f1ec` (72/15/94), accent
  160/30/27. Même fond, même accent à 8° et 5 points de L près. Seule différence réelle : Sora (géométrique)
  vs Bodoni Moda (didone), radius 8/12 vs 0/0.
- `terre` : accent 120/25/32 (vert aussi), fond papier chaud 42/31/94, Bitter/Nunito, radius 20/28.

ACTION : `pierre` (`src/directions/pierre/index.css`) change de teinte d'accent, pas de police :
`--accent-h: 160` → `--accent-h: 20`/`--accent-s: 30%`/`--accent-l: 35%` (ocre-brun de la pierre de Bourgogne,
`--accent-2 #7a362a` existe déjà dans cette gamme) ou gris chaud pur (accent = `--fg` comme `encre`). Le
« minéral » n'a pas besoin de vert, `nordique` si. `terre` est assez loin (fond chaud, radius 20) : on ne touche
pas.

**Groupe C — blanc + rouge/orange + grotesque lourde en capitales : `signal`, `industriel`, `brut`, `ephemeride`.**

| Paire | Identique | Diffère |
|---|---|---|
| `signal` ↔ `ephemeride` | fond quasi blanc, accent rouge (8/85/43 vs 4/63/47), **même famille Archivo** (Archivo Black + Archivo vs Archivo FF ×2), radius 4/8 vs 2/0 | `ephemeride` n'a pas de capitales, a un bleu postal en second |
| `signal` ↔ `industriel` | capitales, grotesque condensée/massive, accent 8° vs 24°, scale compact imposé par `pickScale` aux deux | fond blanc vs gris `#e9e9e7`, Bebas vs Archivo Black, motion none vs subtle |
| `brut` ↔ `signal` | **body Archivo** aux deux, capitales, radius 0 vs 4, fond blanc | accent jaune vs rouge, Chivo vs Archivo Black |

Fichiers : `src/directions/signal`, `industriel`, `brut`, `ephemeride`.

Constat supplémentaire : `ephemeride` n'est utilisée par **aucun site ni aucun preset** (la seule direction
dans ce cas avec `industriel` côté sites). C'était la direction du site du studio, rejetée le 6 oct 2026
(`docs/GOUT.md` § 6 : eclipse gardé). `industriel` : 0 site, 2 presets.

ACTION : **retirer `ephemeride`** de `DIRECTIONS` (`src/lib/schema.ts`), du dossier, de `docs/DIRECTIONS.md`
et du test `presets.test.mjs` « 2 presets par direction » (elle n'en a aucun : le test ne la compte pas
puisqu'il part des presets, mais la doc la liste). Si on veut garder l'idée « carton rouge + feuilles », la
reverser dans `signal` comme réglage de `tone`. Puis écarter `industriel` de `signal` par le **fond** : passer
`industriel` en sombre (béton mouillé `#2a2a28`, `color-scheme: dark`, orange sécurité qui ressort) ; l'usine
n'a que 4 directions sombres et aucune sombre froide-industrielle. Enfin, `brut` quitte Archivo en body
(→ `Work Sans` ou `Karla`) pour que `signal` soit la seule direction Archivo.

**Groupe D — sombre + or/ambre + serif : `luxe` ↔ `nuit`.**

- `luxe` : `#0e0d0c` (noir chaud), accent 42/55/55 or, Bodoni Moda/Karla, rich + curseur lumineux.
- `nuit` : `#0b1220` (bleu nuit), accent 36/70/58 ambre, EB Garamond/Figtree, subtle.
- Même geste : serif élancé clair sur noir, accent doré. Le bleu du fond de `nuit` est la seule chose que l'on
  voit, et c'est une couleur.

ACTION : `nuit` (`src/directions/nuit/index.css`) change d'**accent de teinte** : `--accent-h: 36` →
`--accent-h: 200`/`--accent-s: 40%`/`--accent-l: 70%` (bleu pâle de la lune sur le bleu nuit, ton sur ton) et
garde l'ambre en `--accent-2` pour le survol. La paire devient or-sur-noir-chaud vs pâle-sur-bleu : deux
squelettes de contraste, pas deux teintes.

**Singletons sains** (aucune action) : `clair` (bleu SaaS, grotesque), `journal` (serif + bleu
imprimerie sur gris), `encre` (noir/vermillon, didone), `pop`, `neon`, `eclipse`.

Note `clair` ↔ `signal` : `--bg` `#fafbfd` vs `#f9fbfc` (identiques) mais typo et accent opposés ; le fond
blanc-bleuté n'est pas distinctif, c'est la typo qui l'est. Rien à faire.

### 1.3 Polices partagées entre directions (contre `src/directions/README.md` règle 5)

La règle dit « jamais la même paire ». Aucune paire n'est dupliquée, mais des **familles display** le sont,
ce qui est ce que l'œil voit :

| Police | Directions | Sites qui l'héritent ou la forcent |
|---|---|---|
| Bodoni Moda (+ Libre Bodoni) | `luxe`, `pierre`, `encre` | `maison-aurore`, `studio-ambre`, `encre-noire`, `finck-fisch`, `demo-coiffure`, `anna-vidal` (Libre) |
| EB Garamond | `journal`, `nuit` | `jardins-mael`, `lemaire-avocats`, `demo-architecte` |
| Archivo (body) | `brut`, `signal`, `ephemeride` | `cantine-roulante`, `dubois-plomberie`, `forge-delacroix`, `encre-noire`, `demo-electricien`, `demo-plomberie` (6 sites) |
| Literata (body) | `journal`, `nordique` | 3 sites |
| Hanken Grotesk (body) | `eclipse`, `mediterranee` | 2 sites |
| Karla (body) | `atelier`, `luxe` | 3 sites |
| Public Sans (body) | `clair`, `encre` | 4 sites |

ACTION : étendre la règle 5 à « jamais la même **display** entre deux directions » et la tester dans
`tests/directions.test.mjs` (parse `--font-display` par `parseDirectionCss`, `scripts/ff/look-data.mjs`).
Corrections minimales : `nuit` → `Spectral` en display (jamais utilisée, serif contemporaine, role both) ;
`encre` → `Zilla Slab` (jamais utilisée, slab encrée, role both) ; Bodoni Moda reste le didone de `luxe` +
`pierre` (un sombre, un clair : acceptable tant que § 1.2 B écarte `pierre` par l'accent). Archivo en body :
voir § 1.2 C (`brut` et `ephemeride` la quittent).

### 1.4 Métadonnées périmées (`meta.ts`, `src/lib/schema.ts`, `docs/DIRECTIONS.md`)

Les polices ont été remplacées le 6 oct 2026 (signes IA) mais les textes d'ambiance lus par `ff composer`
(`listDirectionMetas`), par `/nouveau-site` et par `ff-generer` citent encore les anciennes :

| Direction | `meta.ts` dit | la CSS a |
|---|---|---|
| atelier | « serif Fraunces » | Domine |
| eclipse | « Space Grotesk très serré » | Familjen Grotesk |
| encre | « Instrument Serif géant » | Libre Bodoni |
| journal | « Playfair Display » | EB Garamond |
| luxe | « Cormorant élancé » | Bodoni Moda |
| nuit | « Newsreader élégant » | EB Garamond |
| retro | « boutons en pilule » | pilules interdites (`docs/GOUT.md` § 2) |

Même chose dans les commentaires de `DIRECTIONS` (`src/lib/schema.ts` l. 10-28 : brut « Space Grotesk »,
clair « Manrope », terre « Lora/Nunito », neon « Unbounded/Syne ») et dans la table de `docs/DIRECTIONS.md`.

ACTION : réécrire les 7 `ambiance` + les commentaires de `schema.ts` + la table de `docs/DIRECTIONS.md` à
partir de la CSS réelle (un petit script `node` qui lit `parseDirectionCss` suffit pour vérifier). Ajouter un
test dans `tests/directions.test.mjs` : aucun nom de police de `CLES_IA` dans `meta.ts`.

---

## 2. Variantes de section (`src/sections/<Type>/*.astro`, 44)

Usage réel = sites hors `_*`, démos comprises (`ff variete` + lecture des `site.config.ts`). « Composer »
= ce que `pickLook` (`scripts/ff/composer.mjs`, `varianteCompatible` l. 266, `detectSections` l. 295) peut
produire.

### 2.1 Hero (6)

| Variante | Usage | Composition |
|---|---|---|
| split | 1 (demo-architecte) | texte 6 col + photo 4/5 à droite + badge « Basé à » |
| fullbleed | 1 (demo-coiffure) | photo plein écran, dégradé, texte en bas à gauche |
| video | 1 (demo-informatique) | **= fullbleed** avec `<video>` ; « sans vidéo, rendu fullbleed à l'identique » (en-tête du fichier) |
| stacked | 2 (demo-boulangerie, demo-paysagiste) | texte centré + image 16/9 dessous |
| marquee | 1 (demo-electricien) | **= split** côté texte, colonne de 4 cartes-repères à droite, 2 bandes défilantes |
| typographic | 1 (demo-plomberie) | h1 géant, téléphone géant, pas d'image |

21 sites clients sur 21 ont un hero `custom/` : les 6 variantes partagées ne servent plus qu'aux démos et aux
presets. Cinq des six (toutes sauf `typographic`) partagent **mot pour mot** le même bloc texte : `hero-metier`,
h1 `data-split`, intro, bouton téléphone + bouton devis, puis la même `<ul>` de 4 faits (depuis, 24 h, décennale,
note Google). Seule la place de l'image change.

ACTION : fusionner `video` dans `fullbleed` (`video` = `fullbleed` + `images.heroVideo` renseigné ; GOÛT § 3
interdit de toute façon la vidéo autoplay sur iPhone, et `varianteCompatible` n'autorise `video` que si une
vidéo existe). Retirer `video` de `VARIANTS.hero`, mettre à jour les 4 presets qui l'utilisent
(`luxe-nocturne`, `mediterranee-atelier`, `neon-code`, `nuit-serenite` → `fullbleed`) et le test « chaque hero
≥ 4 fois ». Ensuite, **séparer les squelettes de texte** : `stacked` perd la `<ul>` de faits et les deux boutons
(un seul CTA centré), `marquee` perd l'intro (titre + cartes + bandes), pour que trois heros ne soient plus
« le même paragraphe avec l'image ailleurs ».

### 2.2 Nav (6)

| Variante | Usage | Composition |
|---|---|---|
| bar | 6 | barre fixe, nom à gauche, liens, bouton tél. |
| split | 2 | **même barre**, logo centré, liens de part et d'autre, filet bas |
| floating | 1 | **même barre** dans une pilule flottante (`rounded-ui`, `max-w-4xl`) |
| minimal | 2 | nom + téléphone, aucun lien, se masque au scroll |
| burger | 2 | pas de barre, bouton rond, plein écran bg-ink |
| dock | 0 | nom en haut, dock bas-centre 4 liens + tél. |

`bar`/`split`/`floating` sont trois barres horizontales fixes avec liens + téléphone : même squelette, trois
placements du logo. `dock` : jamais choisi par un site ; `ff composer` le prend par « moins utilisé » mais
`docs/DIRECTIONS.md` le déconseille avec `hero: split` et les presets ne l'ont que 2 fois.

ACTION : retirer `split` de `VARIANTS.nav` (2 démos + 6 presets à passer en `bar`), c'est la variante la
moins différenciante. Garder `floating` uniquement pour les directions `neon`/`pop` (ajouter dans
`varianteCompatible` : `nav/floating` ⇒ direction ∈ {neon, pop, brut}, comme la doc le dit). Pour `dock`,
soit le mettre dans la famille « hospitalité » de `SQUELETTES_PAR_METIER` (restaurant, food truck : un dock
bas-centre est la nav d'appli de commande), soit le retirer : à 0 usage, c'est l'un ou l'autre.

### 2.3 Services (6)

| Variante | Usage | Composer | Composition |
|---|---|---|---|
| grid | 4 | toujours | cartes 3 col : icône, titre, phrase, prix, « En savoir plus » |
| cards-hover | 1 | si ≥ ½ des services ont une image | cartes 3 col pleine image, texte sur dégradé |
| bento | 2 | si images | grille 6 col ; **sans image vedette, chaque tuile = la carte de `grid`** (icône, titre, phrase, prix, lien) |
| list | 3 | toujours | lignes numérotées, filets, flèche |
| accordion | 1 | toujours | `<details>` à droite d'un `SectionHeading` collant |
| alternating | 1 | si images | rangées image/texte alternées |

`grid` ↔ `bento` ↔ `cards-hover` : trois grilles de cartes avec le même contenu ; `bento` sans images
dégénère en `grid` 2 colonnes. `list` ↔ `accordion` : deux listes verticales à filets, l'une avec un
`SectionHeading` collant à gauche (même squelette que `process/numbered`).

ACTION : fusionner `cards-hover` dans `bento` (la tuile vedette de `bento` *est* la carte pleine image de
`cards-hover` ; ajouter un mode « toutes en image » quand toutes les prestations en ont une). Retirer
`cards-hover` de `VARIANTS.services`, des 4 presets (`clair-agence`, `luxe-precieux`, `neon-arcade`,
`nuit-serenite`) et de `varianteCompatible`. Reste 5 : grille (grid), bento (images), liste, accordéon,
alterné.

### 2.4 Proof (6)

| Variante | Usage | Composer | Composition |
|---|---|---|---|
| google | 1 | forcé si `proof.google.rating` | note géante + 3 avis en cartes |
| testimonials | 1 | forcé sinon, si avis | masonry de cartes d'avis + badge Google |
| marquee-quotes | 1 | **jamais** (`detectSections` force `testimonials` avant) | bande défilante des **mêmes cartes** |
| gallery | 1 | forcé si galerie et rien d'autre | grille 4 col, 1re image double |
| before-after | 1 | forcé si avant/après et rien d'autre | curseur de comparaison |
| logos | 1 | **jamais** (`detectSections` ne regarde ni `proof.logos` ni `business.certifications`) | rangée de certifications |

La carte d'avis (`<figure class="card"> blockquote + figcaption auteur, ville, via source`) est copiée
**trois fois** (`google`, `testimonials`, `marquee-quotes`). `marquee-quotes` contredit GOÛT § 4 (« rien ne
tourne tout seul quand on peut faire glisser à la main »).

ACTION : (1) retirer `marquee-quotes` (`VARIANTS.proof`, 3 presets : `luxe-nocturne`, `neon-arcade`,
`pop-evenement` → `testimonials`) ; (2) extraire la carte d'avis en `src/components/Avis.astro` utilisé par
`google` et `testimonials` ; (3) dans `detectSections`, ajouter `proof/logos` quand `proof.logos.length > 0 ||
business.certifications.length > 0` **en plus** de la preuve principale (une page peut porter deux preuves :
note + garanties, c'est le cas réel d'un couvreur ou d'un électricien) ; (4) `detectSections` doit aussi
proposer `gallery` quand il y a *et* des avis *et* une galerie (aujourd'hui la galerie disparaît dès qu'il y
a un avis).

### 2.5 Contact (4)

| Variante | Usage | Composition |
|---|---|---|
| form-split | 9 | coordonnées + horaires à gauche (5 col), formulaire en carte à droite (7 col) |
| full | 1 | formulaire en carte à gauche (7 col), carte + coordonnées + réseaux à droite (5 col) |
| form-card | 4 | formulaire en carte centré, coordonnées en ligne dessous |
| simple | 6 | deux tuiles Appeler / Écrire, formulaire replié |

`form-split` et `full` sont le même écran en miroir ; `form-card` est `form-split` sans la colonne. Trois
variantes sur quatre = « formulaire dans une `.card` + liste d'icônes téléphone/mail/adresse ».

ACTION : fusionner `full` dans `form-split` (option : `<Carte />` rendue quand `contact.coordinates` existe,
comme `zones/map` le fait déjà). Retirer `full` de `VARIANTS.contact` et des 8 presets. Il manque en revanche
une composition **sans formulaire** autre que `simple` : un contact « horaires + plan + téléphone » pour les
commerces où l'on vient (boulanger, barbier, restaurant : 5 sites clients ont dû écrire un
`sections/Contact.astro`/`Infos.astro` sur mesure pour ça : `ampere-fils`, `atelier-lecerf`, `lemaire-avocats`,
`maison-roux`, `veto-du-drac`, `barbier-kessler/Infos`). Ajouter `contact/comptoir` : adresse en grand,
horaires en table, plan, téléphone ; pas de formulaire.

### 2.6 About (4), Process (4), Cta (3), Faq (2), Zones (3), Footer (3)

- **About** : `portrait`, `values`, `timeline` = « h2 + paragraphes » à gauche avec quelque chose à droite
  (photo / cartes 2×2 / frise). `story` est le seul centré. Usage : story 6, portrait 3, values 2, timeline 1.
  `portrait` affiche encore « {years} ans d'expérience » calculé (`src/sections/About/portrait.astro` l. 34-37)
  et `typographic.astro`/`video.astro` aussi (« {years} ans d'expérience ») : interdit par GOÛT § 2 (on écrit
  « Depuis 1998 »). ACTION : corriger les trois fichiers ; fusionner `timeline` dans `values` (quand
  `about.milestones` existe, `values` rend la frise ; `timeline` retombe déjà sur les valeurs à défaut :
  c'est le même fichier avec un `if`).
- **Process** : `steps`, `numbered`, `timeline` = numéro dans un cercle accent + titre + texte ; horizontal /
  liste / zigzag. `steps` écrit `01`, `02` (padStart) et `horizon` un numéro géant « 01 » : numérotation
  décorative interdite par GOÛT § 2 (et `ff ia` ne la détecte pas). `numbered` a le même squelette que
  `services/accordion` (heading collant 4 col + liste 8 col). Usage : horizon 3, steps 2, numbered 2,
  timeline 1 ; presets : **steps 16/16**. ACTION : `steps` et `horizon` passent aux chiffres simples
  (`1`, `2`) ou à aucun chiffre (le titre de l'étape suffit) ; retirer `timeline` (1 usage, zigzag = frise
  d'`about/timeline`) ; dans les presets, répartir `numbered`/`horizon` (jamais utilisés par un preset).
- **Cta** : `band` (bg-ink) et `card` (carte sur bg-2) = même contenu (titre, texte, tél., devis) ; usage
  band 6, card 4, phone-giant 3 ; presets band 15 / card 15 / phone-giant 2. Pas de fusion : le fond ink vs
  carte est une vraie rupture de rythme. ACTION : rien, sauf que `phone-giant` devrait être imposé par la
  famille `urgence` de `SQUELETTES_PAR_METIER` (comme `contactDrawer`) ; aujourd'hui il sort du tirage « moins
  utilisé ».
- **Faq** : `accordion` **17 sites** sur 21 (+ 28 presets sur 28), `two-columns` 4 (0 preset). C'est la
  variante la plus répétée de toute l'usine. `varianteCompatible` n'autorise `two-columns` qu'avec ≥ 4
  questions ; `pickLeastUsed` devrait la favoriser mais les presets l'ignorent totalement. ACTION : mettre
  `two-columns` dans la moitié des presets ; ajouter une 3e composition **sans** `<details>` ni colonnes : la
  FAQ en « une question par ligne, réponse en marge » façon notice (`faq/notice`), ou intégrer les questions
  au bloc sur mesure quand il y en a moins de 4.
- **Zones** : `chips` 7, `list` 2, `map` 1 ; presets **list 24/24**. `map` = `list` + `<Carte />` (déjà la
  bonne mécanique : une variante = une donnée). ACTION : les presets doivent utiliser `chips` et `map` ;
  fusionner `list` dans `map` (sans `coordinates`, `map` rend la liste seule) pour tomber à 2.
- **Footer** : `columns` 12, `minimal` 10, `big-name` 6. `columns` et `big-name` sont tous deux sur bg-ink ;
  `minimal` sur bg. Pas de fusion. ACTION : rien.

### 2.7 Variantes que `ff composer` ne choisit jamais ou presque

| Variante | Pourquoi | Correction |
|---|---|---|
| `proof/logos` | `detectSections` ne lit ni `proof.logos` ni `certifications` | § 2.4 (3) |
| `proof/marquee-quotes` | `testimonials` forcé avant | retirer |
| `proof/gallery` quand il y a des avis | une seule preuve par page | § 2.4 (4) |
| `hero/video` | exige `images.video` ; GOÛT interdit la vidéo | fusionner dans fullbleed |
| `hero/fullbleed`, `split`, `stacked` | exigent `images.hero` : un client sans photo n'a que `typographic` et `marquee` | ajouter `hero/comptoir` sans image : nom, horaires, adresse, téléphone (la composition de 6 heros sur mesure : dentaire-morvan, maison-roux, barbier-kessler, dubois-plomberie, veto-du-drac, lemaire-avocats) |
| `shell: index` | poids absent de `SHELL_WEIGHTS` (⇒ 10) et `METIERS_INDEX` ≠ famille portfolio (`illustrat`, `design`, `decorat`, `ceramist`, `ebenist`, `sculpt`, `peintre` sont dans `METIERS_INDEX` mais pas dans `SQUELETTES_PAR_METIER.portfolio`) | aligner les deux listes (§ 3) |
| `nav/dock` | sort du « moins utilisé » sans règle d'adéquation | § 2.2 |

---

## 3. Coquilles (`src/shells/*.astro`) et squelettes (`SQUELETTES_PAR_METIER`)

### 3.1 Ce que fait vraiment chaque coquille

| Coquille | Mécanique réelle | Usage sites (clients + démos) | Presets |
|---|---|---|---|
| flow | nav / hero / sections / footer | **17** (10 clients, 7 démos) | 18 |
| sticky-hero | flow + hero `position: sticky` sous une feuille | 3 (chez-malo, maison-aurore, toits-cie) | 3 |
| split | panneau latéral large fixe (nom, sommaire numéroté actif, tél.) + colonne de contenu | 2 (ampere-fils, moteur-fils) | 3 |
| sidebar | rail étroit fixe (monogramme, compteur « 02 / 06 », liens verticaux) + contenu pleine largeur | 2 (forge-delacroix, lemaire-avocats) | 2 |
| slides | flow + `scroll-snap` + `min-height: 100svh` par section | 2 (osteo-marchand, veto-du-drac) | 3 |
| magazine | flow + largeurs de conteneur alternées + **numéro décoratif « 01 » en marge** | 1 (jardins-mael) | 3 |
| index | le menu est la page : entrées `<details>`, hero non rendu, pas de nav | 2 (anna-vidal, borie-des-chenes) | **0** |

Constat : 4 coquilles sur 7 (`sticky-hero`, `slides`, `magazine`, et dans une moindre mesure `split`)
sont `flow` + une règle CSS ; `split` et `sidebar` sont la même idée (rail gauche + scrollspy) en deux
largeurs. Seule `index` change l'ordre de lecture. Le numéro « 01 » de `magazine` et le compteur « 02 / 06 »
de `sidebar`, les liens numérotés de `split` et de `nav/burger` sont la « numérotation décorative » bannie par
GOÛT § 2.

ACTION : (1) `magazine` perd son `::before` numéroté (`src/shells/magazine.astro` l. 36-40), `sidebar` son
compteur, `split` ses « 01 » devant les liens (la typo du sommaire suffit) ; (2) `split` et `sidebar` ne
sont pas fusionnées : chacune a 2 sites et un squelette visible différent (panneau avec nom et métier vs
rail de monogramme), mais une même famille de métier ne doit plus proposer les deux comme préférée/repli
(`sante` → `slides` / `split`, `atelier` → `flow` / `sidebar`) ; (3) il manque la coquille qui, selon
`docs/veille/squelettes.md` § 3a, revient chez 27 % des sites primés : la **mosaïque** (grille régulière de
tuiles plein écran, chaque tuile = une section ou une page service). `index` en est la version liste ;
ajouter `shell: mosaique` (grille 2-3 col, chaque cellule `<a>` vers `#section` ou `/services/<slug>`,
image de la section en fond) pour photographe, menuisier (pièces), paysagiste (avant/après), restaurateur
(carte). C'est la seule vraie rupture de squelette que la bibliothèque ne sait pas faire.

### 3.2 Familles de métiers (`SQUELETTES_PAR_METIER`, `scripts/ff/composer.mjs` l. 71-139)

| Famille | Mots-clés | Coquilles | Sites existants qui y tombent |
|---|---|---|---|
| portfolio | photograph, tatou, chambre, artiste, galerie, portfolio | index / sticky-hero | anna-vidal (index), borie-des-chenes (index), encre-noire (tatoueur : **flow**, hors règle) |
| urgence | plomb, couvreur, serrurier, electricien, depannage, chauffagiste, urgence | flow / split | dubois-plomberie (flow), toits-cie (**sticky-hero**, hors règle), ampere-fils (split), demo-electricien, demo-plomberie, demo-informatique (« dépannage ») |
| sante | osteo, veto, dentist, avocat, notaire, medecin, kine… | slides / sidebar | osteo-marchand (slides), veto-du-drac (slides), dentaire-morvan (**flow**), lemaire-avocats (sidebar) |
| atelier | menuisier, ebenist, forge, ferronni, auto-ecole, traiteur | flow / sidebar | atelier-lecerf (flow), forge-delacroix (sidebar), auto-ecole-rabelais (flow), cantine-roulante (traiteur : flow) |
| hospitalite | restaurant, hotel, institut, spa, beaute, coiff, barbier, esthetic, patiss, chambre, boulanger | sticky-hero / index | chez-malo, maison-aurore (sticky-hero), barbier-kessler (**flow**), maison-roux (**flow**) |
| creation | architect, paysagist, decorat, design | magazine / split | jardins-mael (magazine), studio-ambre (**flow**), demo-architecte (flow), demo-paysagiste (flow) |

Trous (métiers de `docs/OBJECTIF.md` et des `meta.ts` qu'aucune famille ne reconnaît, donc tirage
pondéré générique = `flow` 30 points) :

- **Automobile** : garagiste, carrossier, mécanicien (`moteur-fils` a été re-squeletté à la main en `split`).
- **Bâtiment hors urgence** : maçon, carreleur, peintre en bâtiment, plaquiste, charpentier, zingueur
  (pourtant listés dans `industriel/meta.ts`).
- **Alimentation / producteurs** : fromager, vigneron, maraîcher, apiculteur, pépiniériste, fleuriste,
  glacier, food truck (`cantine-roulante` n'est reconnu que par « traiteur »).
- **Commerce de détail** : friperie, brocante, disquaire, librairie, papeterie, imprimeur.
- **Bien-être / sport** : coach, salle de sport, yoga, masseur (« institut »/« spa » seulement).
- **Numérique / agences** : agence web, développeur, graphiste, illustrateur (tous dans `clair`/`neon`/
  `encre/meta.ts`, et `illustrat`/`design` sont dans `METIERS_INDEX` sans famille).
- **Formation** : école de musique, professeur, cours (seule « auto-ecole » est reconnue).

Deux incohérences : `chambre` est dans `portfolio` **et** `hospitalite` (le premier gagne : une chambre
d'hôtes est traitée comme un photographe) ; `boulanger` est en `hospitalite` → `sticky-hero`, mais les deux
boulangeries réelles (`maison-roux`, `demo-boulangerie`) sont en `flow`.

ACTION : ajouter 4 familles à `SQUELETTES_PAR_METIER` avec les coquilles **les moins portées** pour
équilibrer la matrice (§ 8) : `automobile` (garag, carross, mecani, pneu) → `split` / `magazine` ;
`batiment` (macon, carrel, peintre en bat, plaquist, charpent, zingu, platr) → `magazine` / `flow`, variante
`process/horizon` comme `atelier` ; `producteur` (fromag, vign, maraich, apicult, pepini, fleur, glac, food
truck, cantine) → `mosaique` (quand elle existe) / `slides` ; `boutique` (friper, brocant, disqu, librair,
papet, imprim, boutique) → `index` / `split`. Retirer `chambre` de `portfolio` (reste en `hospitalite`).
Aligner `METIERS_INDEX` sur `portfolio.metiers` (une seule liste). Enfin, le malus de réutilisation
(`>= 3 sites` → repli) ne compte aujourd'hui que `shellCounts` toutes directions confondues ; il devrait
compter `direction|shell` (la règle GOÛT), c'est `usage.dirHeroUsed` étendu à la coquille.

---

## 4. Presets (`presets/*.json`, 32)

### 4.1 Doublons structurels

Aucun : `tests/presets.test.mjs` interdit le trio direction + hero + services, et chaque paire d'une même
direction diffère sur 9 à 11 réglages. Les doublons sont **typographiques** et de **fin de page** :

| Paire de polices | Presets |
|---|---|
| delaGothic / manrope | `industriel-chantier`, `neon-code`, `signal-standby` (3 directions, même typo) |
| bodoni / epilogue | `encre-papier`, `luxe-nocturne`, `pierre-minerale` (direction `pierre` par défaut + 2 forçages) |
| epilogue / figtree | `brut-signal`, `nordique-atelier` |
| playfair / dmSans | `atelier-vitrine`, `nuit-serenite` |
| josefin / lora | `retro-vinyle`, `terre-ferme` |

Monocultures sur 32 presets : `zones/list` **24/24**, `faq/accordion` **28/28**, `process/steps` **16/16**,
`about/story` 15, `cta` band 15 / card 15, `shell: flow` 18, `shell: index` **0**, `nav/burger` 2,
`nav/dock` 2, `cta/phone-giant` 2.

### 4.2 Presets pointant vers une police bannie (`CLES_IA`, `scripts/ff/ia.mjs` l. 23)

| Preset | Police bannie | Remplacement proposé (même rôle, jamais ou peu utilisée) |
|---|---|---|
| atelier-vitrine | display `playfair`, body `dmSans` | `gelasio` / `cabin` |
| clair-agence | display `outfit` | `urbanist` (jamais utilisée) |
| industriel-chantier | body `manrope` | `redHat` (déjà body de la direction : donc **supprimer** le forçage) |
| journal-chronique | body `inter` | `literata` → mais display est déjà `literata` : prendre `lexend` (jamais utilisée) |
| neon-code | body `manrope` | `rubik` (supprimer le forçage) |
| nuit-serenite | display `playfair`, body `dmSans` | `spectral` / `figtree` |
| pierre-taillee | display `syne` | `zillaSlab` (jamais utilisée) |
| pop-evenement | body `instrumentSans` | `workSans` (supprimer le forçage) |
| retro-vinyle | body `lora` | `cabin` |
| signal-standby | body `manrope` | `archivo` (supprimer le forçage) |
| terre-ferme | body `lora` | `nunito` (supprimer le forçage) |

11 presets sur 32 : `ff modele <slug> <nom>` puis `ff verifier` **échoue** (`ff ia`, bloquant depuis le
13 oct). Les vignettes `presets/vignettes/*.webp` ont été capturées avec ces polices.

ACTION : corriger les 11 JSON (table ci-dessus), relancer `ff vignettes --forcer` pour ces 11, et ajouter à
`tests/presets.test.mjs` : « aucune clé de `look.typography` dans `CLES_IA` ». Même filtre dans
`scripts/studio.mjs` (l. 123-131 : le menu des polices de `ff studio` liste les 64 clés, bannies comprises).

### 4.3 Variantes supprimées

Aucun preset ne référence une variante absente de `VARIANTS` (vérifié). Si les fusions du § 2 sont faites,
à réécrire : `video` (4 presets), `cards-hover` (4), `marquee-quotes` (3), `full` (8), `nav/split` (6),
`about/timeline` (4), `process/timeline` (0), `zones/list` (24).

ACTION : profiter de cette réécriture pour **imposer dans les presets ce que le composer ne tire jamais** :
2 presets `shell: index`, 8 en `zones/chips`, 6 en `zones/map`, 10 en `faq/two-columns`, 6 en
`process/numbered`, 4 en `process/horizon`, 4 en `cta/phone-giant` (les 2 `signal` + `industriel-atelier` +
`brut-signal`).

---

## 5. Sites d'exemple (`sites/*` hors `_*` et `demo-*`, 21)

### 5.1 Même direction + même coquille (règle GOÛT § 1 : interdit)

| Paire | Direction | Coquille | Aussi en commun |
|---|---|---|---|
| `cantine-roulante` ↔ `dubois-plomberie` | signal | flow | **même paire de polices** (Archivo Black / Archivo, héritée), `contactDrawer: true`, hero `custom`, `zones/chips` + `faq/accordion` + `contact/form-split`, footer `columns`, nav `custom` |
| `forge-delacroix` ↔ `lemaire-avocats` | nuit | sidebar | hero `custom`, `faq/accordion`, footer big-name / minimal, nav minimal / custom |

La première paire est la plus grave : un food truck et un plombier sur le même squelette, la même direction,
la même typo et la même fin de page. Un food truck en `signal` (direction « urgence 24/7 ») est un choix
discutable en soi : `pop`, `retro` ou `mediterranee` sont dans `meta.ts` pour « food truck »/« restaurateur ».

ACTION : `cantine-roulante` → direction `pop` (0 doublon, `pop/meta.ts` liste « food truck ») avec
`shell: slides` ou la future `mosaique` (la carte de la semaine en tuiles) ; sa police display Archivo Black
condensée par `scaleX` (hero sur mesure) devient `Anybody` dont la largeur variable est faite pour ça.
`lemaire-avocats` → `shell: split` (le panneau latéral porte le sommaire des domaines, c'est le squelette
d'un cabinet) ; `nuit|sidebar` reste à `forge-delacroix` cité en référence par le fondateur.

### 5.2 Même paire de polices (effective : forçage `typography` sinon défaut de la direction)

| Paire | Sites |
|---|---|
| schibsted / publicSans (défaut `clair`) | `ampere-fils`, `auto-ecole-rabelais`, `demo-boulangerie` |
| archivoBlack / archivo (défaut `signal`) | `cantine-roulante`, `dubois-plomberie`, `demo-plomberie` |
| bitter / nunito (défaut `terre`) | `atelier-lecerf`, `demo-paysagiste` |
| ebGaramond / literata (défaut `journal`) | `jardins-mael`, `demo-architecte` |
| bodoni / karla (défaut `luxe`) | `maison-aurore`, `demo-coiffure` |

Dans tous les cas, c'est le **défaut de la direction** non forcé : 9 sites clients sur 21 n'ont pas de
`typography`. Le composer propose toujours une paire « différente de la police par défaut de la direction »
(`pickFontPair`), mais les sites faits à la main ne passent pas par lui.

ACTION : `ff verifier` (ou `ff variete`) avertit quand deux sites partagent direction + paire effective ;
forcer une `typography` sur `auto-ecole-rabelais` (ex. `urbanist` / `publicSans`) et sur `atelier-lecerf`
(ex. `zillaSlab` / `nunito`), les deux doublons clients-clients.

### 5.3 Même direction + coquille + hero

Les 21 heros clients sont `custom/`, donc aucun doublon nominal ; `ff signatures` confirme qu'aucune
composition de bloc n'est copiée. Mais les en-têtes des `Hero.astro` décrivent **la même composition** à
plusieurs reprises :

- « photo du dossier plein cadre, accroche en bas à gauche, phrase qui dit qui/quoi/où/depuis quand, puis
  adresse et téléphone » : `chez-malo`, `encre-noire`, `studio-ambre` (textes d'en-tête quasi identiques,
  9 oct 2026), et `forge-delacroix` (même chose + séquence).
- « photo plein écran épinglée `data-pin="200"`, trois légendes qui se succèdent » : `anna-vidal`,
  `borie-des-chenes` (le second en-tête reconnaît lui-même la parenté).
- « ni eyebrow, ni sous-titre, ni bouton : une phrase + une donnée » : `lemaire-avocats`, `osteo-marchand`,
  `veto-du-drac`, `auto-ecole-rabelais`, `moteur-fils`, `dubois-plomberie`, `jardins-mael`, `ampere-fils`
  (série du même auteur : la donnée change, le squelette non).

ACTION : la première famille (photo plein cadre + légende bas-gauche) est exactement `hero/fullbleed` ; ces
4 sites devraient revenir à la variante partagée (avec le texte réduit) et consacrer leur bloc sur mesure à
autre chose, ou bien `fullbleed` doit être modifié pour être leur composition (texte en 3 tailles, pas de
boutons). Pour la troisième famille, créer `hero/comptoir` (§ 2.7) et laisser 2 ou 3 sites dessus : un hero
sur mesure qui est le même partout n'est plus sur mesure.

---

## 6. Polices (`src/lib/fonts.ts`, 64 clés ; lu par `parseFonts` de `scripts/ff/look-data.mjs`)

### 6.1 Au registre mais bannies par `CLES_IA` (21)

`fraunces, cormorant, cormorantGaramond, playfair, lora, newsreader, instrumentSerif, sourceSerif4,
crimsonPro, inter, manrope, dmSans, instrumentSans, outfit, spaceGrotesk, syne, geist, ibmPlexSans,
plusJakartaSans, geistMono, ibmPlexMono`. Le composer les filtre (`pasIa`, l. 403) ; `ff studio` (menu de polices lu tel quel dans `fonts.ts`) et
`scripts/ff-generer.mjs` (aucune référence à `CLES_IA`) non.

ACTION : les **retirer de `FONTS`** (et des `@fontsource` de `package.json` qui ne servent plus) : une clé
qu'aucun chemin ne doit choisir ne doit pas exister ; `CLES_IA` reste pour attraper une CSS de section sur
mesure.

### 6.2 Jamais utilisées (ni direction, ni site, ni preset), hors bannies

Display/both : `zillaSlab`, `abrilFatface`, `yesevaOne`, `spectral`, `alfaSlabOne`, `bungee`,
`urbanist`, `lexend`. Mono : `spaceMono`, `dmMono`, `fragmentMono` (toutes les directions sauf
`ephemeride` importent `jetbrains-mono` : 17 directions, une seule mono).

ACTION : garder `zillaSlab`, `spectral`, `urbanist`, `lexend`, `alfaSlabOne` (elles servent aux
remplacements des § 1.3 et 4.2) ; retirer `abrilFatface`, `yesevaOne` (« féminin, décoratif » : hors
charte), `bungee` ; retirer `spaceMono`, `dmMono`, `fragmentMono` ou donner une mono différente à 3-4
directions (`neon` → Space Mono, `brut` → Fragment Mono) : aujourd'hui les compteurs « 02 / 06 », les prix
et les horaires de tous les sites sont dans la même JetBrains Mono.

### 6.3 Utilisées par 4 sites ou plus (à rationner)

| Police | Sites (effectif) | Directions | Presets |
|---|---|---|---|
| archivo (body) | 6 : cantine-roulante, dubois-plomberie, encre-noire, forge-delacroix, demo-electricien, demo-plomberie | brut, signal, (ephemeride) | 1 |
| bodoni (display) | 5 : encre-noire, finck-fisch, maison-aurore, studio-ambre, demo-coiffure | luxe, pierre | 2 |
| schibsted | 4 : ampere-fils, auto-ecole-rabelais, dentaire-morvan (body), demo-boulangerie | clair | 1 |
| publicSans (body) | 4 : ampere-fils, auto-ecole-rabelais, veto-du-drac, demo-boulangerie | clair, encre | 0 |

ACTION : plafond « 3 sites par police display, 4 par body » vérifié par `ff variete` (nouveau tableau
« polices effectives ») ; `encre-noire` quitte Bodoni (c'est la 3e direction à didone) pour `zillaSlab` ou
`Libre Bodoni` de sa direction ; `forge-delacroix` quitte Archivo pour `redHat` ; `brut` quitte Archivo
(§ 1.2 C).

---

## 7. Les 5 actions à faire en premier (gain de variété / coût)

1. **Corriger les 11 presets à police bannie + filtrer `CLES_IA` dans `ff studio` + test** (§ 4.2, § 6.1).
   Gain : `ff modele` redevient utilisable sur un tiers des modèles ; coût : une heure, 11 JSON, 2 lignes de
   test, `ff vignettes --forcer`.
2. **Écarter les 4 groupes de directions par un token chacun** (§ 1.2) : `pierre` accent brun, `nuit` accent
   bleu pâle, `mediterranee` grotesque large + bleu mer, `industriel` fond sombre, `retro` capitales ; retirer
   `ephemeride`. Gain : 18 directions dont 10 interchangeables → 17 directions distinctes à la typo et au
   contraste ; coût : 5 fichiers CSS, 5 `meta.ts`, la table de `docs/DIRECTIONS.md`.
3. **`detectSections` : deux preuves par page, `logos` et `gallery` enfin atteignables ; `hero/comptoir` et
   `contact/comptoir` sans photo ni formulaire** (§ 2.4, § 2.5, § 2.7). Gain : le composer cesse de produire
   « hero typographic + proof google + contact form-split » pour tout client sans photo ; coût : 2 nouvelles
   variantes + 20 lignes dans `composer.mjs` + 2 lignes dans `VARIANTS` + doc.
4. **Casser les deux paires de sites en doublon et les trois paires de polices par défaut** (§ 5.1, § 5.2) :
   `cantine-roulante` → pop, `lemaire-avocats` → split, `typography` forcée sur `auto-ecole-rabelais` et
   `atelier-lecerf`. Gain : la règle GOÛT « jamais même squelette ET même direction » est vraie sur les 21
   sites ; coût : 4 `site.config.ts`, rebuild, planches à regarder (le hero sur mesure de cantine-roulante
   dépend d'Archivo Black : à retoucher).
5. **4 familles de métiers de plus dans `SQUELETTES_PAR_METIER` + malus par `direction|shell`** (§ 3.2) et
   fusions de variantes jumelles (`video`→`fullbleed`, `cards-hover`→`bento`, `full`→`form-split`,
   `marquee-quotes` retirée, `nav/split` retirée : 44 → 39 variantes, § 2). Gain : garage, maçon, fromager,
   friperie ne tombent plus sur `flow` ; les tirages « moins utilisé » portent sur des variantes qui
   diffèrent vraiment ; coût : une demi-journée, `tests/composer.test.mjs` et `tests/presets.test.mjs` à
   mettre à jour, 25 presets à réécrire.

Après ces cinq : la coquille `mosaique` (§ 3.1), seule rupture de squelette que la bibliothèque ne sait pas
faire et la 2e famille chez les sites primés.

---

## 8. Matrice direction × coquille (sites existants)

Clients en clair, démos préfixées `d:`. « · » = case vide.

| direction | flow | split | sidebar | slides | magazine | sticky-hero | index |
|---|---|---|---|---|---|---|---|
| atelier | barbier-kessler | · | · | · | · | · | borie-des-chenes |
| brut | d:electricien | · | · | · | · | toits-cie | · |
| clair | auto-ecole-rabelais, d:boulangerie | ampere-fils | · | veto-du-drac | · | · | · |
| eclipse | finck-fisch | · | · | · | · | · | · |
| encre | encre-noire | · | · | · | · | · | · |
| ephemeride | · | · | · | · | · | · | · |
| industriel | · | · | · | · | · | · | · |
| journal | d:architecte | · | · | · | jardins-mael | · | · |
| luxe | d:coiffure | · | · | · | · | maison-aurore | · |
| mediterranee | · | · | · | · | · | chez-malo | · |
| neon | d:informatique | · | · | · | · | · | · |
| nordique | dentaire-morvan | · | · | osteo-marchand | · | · | · |
| nuit | · | · | forge-delacroix, **lemaire-avocats** | · | · | · | anna-vidal |
| pierre | studio-ambre | · | · | · | · | · | · |
| pop | maison-roux | · | · | · | · | · | · |
| retro | · | moteur-fils | · | · | · | · | · |
| signal | cantine-roulante, **dubois-plomberie**, d:plomberie | · | · | · | · | · | · |
| terre | atelier-lecerf, d:paysagiste | · | · | · | · | · | · |

126 cases, 24 remplies, 2 doublons (en gras). `flow` porte 17 sites sur 28 ; `magazine` 1, `index` 2.
Colonnes `split`, `sidebar`, `slides`, `magazine` : 2, 2, 2, 1. Directions sans aucun site : `ephemeride`,
`industriel`. Cases à viser pour les 5 prochains clients (coquille sous-portée × direction peu portée) :
`terre|magazine`, `pop|slides`, `encre|split`, `retro|index` (friperie, disquaire), `industriel|split` (garage).
