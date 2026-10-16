# Pourquoi les trois fromageries font « IA » (16 oct 2026)

Retour du fondateur sur les trois pistes de la Fromagerie Ravanel (A `fromagerie-ravanel`, B `-b`, C `-c`, en
ligne sur vercel) : « ça a l'air très similaire sur les animations ; il n'y en a aucun que je ne trouve pas IA
generated ». Les relecteurs de `/site-final` les avaient laissées passer.

Méthode : les six pages (3 pistes × téléphone 390×844 et ordinateur 1440×900) filmées en ligne avec
playwright-core (Chrome sans tête, un navigateur à la fois) : premier écran à 0, 150, 400, 800, 1 500 ms, puis
une vue par écran de défilement à la molette (à +250 ms et à +1 150 ms), toutes regardées. Pendant le film, un
`MutationObserver` relève chaque élément dont le style en ligne change (GSAP) et `document.getAnimations()`
relève chaque transition et animation CSS (propriété, durée, courbe). Même chose sur quatre sites démontés,
choisis parce qu'ils sont les plus « faits main » de l'INDEX et proches du métier : **Délice** (pizzeria,
Lévis), **Café Binocle** (torréfacteur), **Pizza Amici** (foodtruck, Den Haag), **Bécane** (vêtements, Paris).
Captures et journaux dans le scratchpad de la session (non versionnés). Code lu : `site.config.ts` et
`sections/*.astro` des trois pistes, `src/scripts/motion.ts`, `src/layouts/Base.astro`, `src/styles/global.css`,
la skill `.claude/skills/site-final/` en entier.

---

## 1. Ce qui rend les trois versions similaires entre elles

Le constat du fondateur est exact, et il se mesure : les trois pistes changent de couleur, de police et de
squelette, mais **elles bougent exactement de la même façon, parce qu'elles bougent avec le même moteur, sur
ordre de la même règle, et sont jugées par une grille qui ne regarde que la présence du mouvement.**

### 1.1 Le moteur : un seul vocabulaire, les mêmes valeurs

| Mesuré en ligne | A (terre) | B (pierre) | C (pop) |
|---|---|---|---|
| Rideau d'entrée `.ff-curtain` (fond `--ink` qui monte + bande `--accent`, 1,1 s) | oui | oui | oui |
| Titres h1/h2 découpés en lignes (`data-split="lines"`) | 4 titres, 13 lignes | 4 titres, 15 lignes | 6 titres, 18 lignes |
| Part des éléments animés en JS qui sont des lignes de titre | 12 sur 13 | 13 sur 19 | 18 sur 22 |
| Valeurs du découpage | `yPercent 110 → 0`, 0,9 s, pas 0,09 s, déclenché à 88 % | idem | idem |
| Courbe de **toutes** les transitions CSS relevées | `cubic-bezier(0.16, 1, 0.3, 1)` | idem | idem |
| Photo révélée par volet (`data-reveal="clip"`/`"wipe"`) | 2 | 2 | 2 |
| Photo qui zoome ou glisse au défilement (`data-scrub`/`data-parallax`) | 1 | 1 | 4 |
| Bloc qui apparaît en cascade (`data-stagger`) | 2 | 1 | 1 |

- **Le rideau est posé d'office** : `src/layouts/Base.astro:170` (`site.motion === 'rich' && <div class="ff-curtain">`)
  et `src/styles/global.css:504-507`. Comme `GOUT.md` § 4 impose `motion: 'rich'` par défaut, **chaque site de
  l'usine s'ouvre sur le même écran plein qui se lève**. Sur les films, les vignettes 0 et 150 ms des six pages
  sont la même image : un aplat sombre, une bande de couleur, puis le site. C'est la première chose qu'on voit,
  et c'est identique.
- **Le titre par lignes est réglé une fois pour toutes** dans `src/scripts/motion.ts:860-875` (`yPercent: 110,
  duration: 0.9, stagger: 0.09, start: 'top 88%'`). Seule la courbe change d'une direction à l'autre, et de
  façon imperceptible : terre `(0.165, 0.84, 0.44, 1)`, pierre `(0.87, 0, 0.13, 1)`, pop à rebond. Une ligne qui
  monte de sous un masque en 0,9 s reste une ligne qui monte de sous un masque.
- `--ease-out` et `--ease-out-expo` valent la même chose (`global.css:37` et `:95`) et habillent tous les
  `data-reveal`, `data-stagger`, volets et rideau : au relevé, **pas une seule transition des trois sites n'a une
  autre courbe**, à part les quelques transitions de la nav (`0.4, 0, 0.2, 1`).

### 1.2 La règle : le mouvement est une liste de quatre cases, et la liste nomme l'outil

- `docs/GOUT.md:70-76` (« un site doit être vivant », 16 oct 2026) ne dit pas seulement « il faut du mouvement » :
  il prescrit l'outil de chaque case. (1) entrée = « titre par lignes, `data-split="lines"` » ; (2) « un groupe
  par section » ; (3) le feu d'artifice ; (4) une image qui bouge « (`data-scrub`, `data-parallax`, révélation
  `clip`/`wipe`) ». Les trois contrats ont rempli les cases avec les attributs cités :
  `fromagerie-ravanel/direction.md` (MOUVEMENT), `fromagerie-ravanel-b/direction.md:46-50`,
  `fromagerie-ravanel-c/direction.md:44-48` commencent tous par « entrée = titre par lignes (`data-split="lines"`) ».
- `docs/ANIMATIONS.md:50` présente `data-split="lines"` comme « **le geste de base d'un hero "cher"** » et
  « pour les `h1`/`h2`, à la place de `data-reveal` ». Les constructeurs l'ont donc mis sur **chaque** h2 écrit à
  la main (les 3 h1 et 11 h2 sur 11 dans les sections sur mesure des trois pistes ; seuls les titres des sections partagées
  FAQ et contact y échappent).
- `.claude/skills/site-final/modeles/consignes-pistes.md:5-6` liste les attributs du moteur à lire avant de
  construire, `data-split="lines"` en tête. Les pistes B et C ont reçu l'ordre d'être « COMPLÈTEMENT
  différentes » sur « squelette, direction, typographie, rythme, geste signature », **jamais sur le mouvement
  d'entrée ni sur la manière de faire apparaître les blocs**.
- `SKILL.md` § 1bis compare les pistes « sur les cinq axes (squelette, direction/couleur, typographie, rythme,
  mécanisme du geste) ». Le vocabulaire de mouvement n'est pas un axe : trois pistes peuvent passer ce test en
  bougeant à l'identique.

### 1.3 La veille : chaque geste humain a été traduit dans nos attributs

`docs/veille/references.md` décrit 40 sites humains, puis **réécrit 60 de leurs gestes en attributs du moteur**
(« → `data-reveal` » ×15, « → `data-split` » ×13, « → `data-stagger` » ×8, « → `data-parallax` » ×6…). Ce que
les humains faisaient de singulier (un titre posé sur un tracé, une liste de pedigree, un guide de
prononciation) devient le même `data-split`. La veille, censée apporter de la variété, la ramène au catalogue.

### 1.4 Le brief, les photos et les blocs communs

- **Les trois mêmes photos** Wikimedia (`public/images/cave`, `beaufort`, `raclette`, identiques dans les trois
  dossiers), chacune avec sa légende « photo d'illustration » visible.
- **Le même surtitre gris** au-dessus du h1 : « Fromager-affineur, 12 rue de la Gare, Annecy »
  (`fromagerie-ravanel/sections/Hero.astro:33`, `-b/sections/Hero.astro:17`, `-c/sections/Hero.astro:39`).
  C'est l'eyebrow retiré le 6 oct, revenu en casse normale.
- **Le même bouton** « Appeler le 04 65 71 23 18 », rectangle plein, sous le titre, dans les trois.
- **Le même âge du beaufort en chiffre géant** : A « 12 » à 15 rem (`Age.astro:89`), B « 0 / 8 / 18 / 21 mois de
  cave » en compteur épinglé, C « 12 18 24 mois » en `data-counter`. Trois pistes, un seul « moment ».
- **La même FAQ** (les trois questions du brief, mot pour mot, composant partagé), le même titre de FAQ en A et C
  (« Ce qu'on nous demande au comptoir »), la même ligne « Aujourd'hui : 8 h 30 à 12 h 30… » calculée.

### 1.5 La relecture : elle compte le mouvement, elle ne le juge pas

- `relecteurs/da.md` (« Vivant ») demande seulement si « le premier écran a une entrée », si « les sections
  apparaissent au défilement », si « une image bouge », et lit `data-split`, `data-reveal`… **dans le code** pour
  le vérifier. Le plafond de `grille.md` ne punit que le site immobile. Un site où tout bouge pareil coche les
  quatre cases et sort à « montrer ».
- Aucune question ne compare le mouvement d'une piste à celui des autres, ni à celui des démontages.
- Le film (`scripts/outils/film-fromagerie.mjs`) cadre le geste signature, pas l'entrée ni les titres : ce qui se
  répète n'est jamais montré au relecteur côte à côte.

---

## 2. Ce qui fait « IA » (du plus visible au moins visible)

1. **Chaque titre se lève de sous un masque, ligne par ligne, au même tempo.** Vu sur les six films (A-m 400 ms :
   « Ici, les fromages / des Aravis et des » coupés à mi-hauteur ; B-m 800 ms ; C-d 150 ms « Fromagerie »
   tronqué) et à chaque section au défilement. C'est le geste de démonstration de GSAP SplitText, celui de toutes
   les pages générées et de tous les gabarits Webflow « premium » ; répété 4 à 6 fois par page, il devient un tic.
   **Aucun des quatre sites humains ne découpe ses titres de section en lignes** : relevé du `MutationObserver`,
   0 titre animé chez Pizza Amici (33 éléments animés, tous des objets), 0 h2 chez Délice (le seul titre animé
   est le h1, lettre par lettre sur une ligne de base ondulée), un seul titre découpé en mots chez Binocle
   (« Collaboration avec des artistes d'ici »), et chez Bécane le seul titre, « Collection », se décode lettre à
   lettre pendant que les silhouettes arrivent.
2. **Le même rideau à l'ouverture.** 0-150 ms : aplat `--ink` plein écran, bande `--accent` qui se replie, puis
   la page (`global.css:504-507`). C'est un « loader » sans objet : il ne charge rien et ne montre rien du
   client. Les humains ont soit rien (Binocle : fondu du blanc), soit une entrée qui **est** le client : le logo
   Pizza Amici incliné qui tombe puis découvre le camion ; les silhouettes de Bécane qui apparaissent une à une ;
   le titre de Délice qui se pose comme une enseigne peinte pendant que la photo d'assiette se défloute.
3. **Ce qui bouge, ce sont les titres et les cadres, jamais les choses.** Sur les trois pistes, les éléments
   animés sont des lignes de texte, des volets sur photos et des zooms de photo. Chez les humains, ce qui bouge
   est un objet du métier : les tickets d'étapes qui s'inclinent sur un fil et la pizza qui tourne (Amici), les
   assiettes rondes et le fond qui change de couleur avec le plat du jour (Délice, turquoise → olive → marine), le
   sceau qui tourne et les fleurs qui poussent (Binocle), les mannequins (Bécane). Le mouvement IA décore la mise
   en page ; le mouvement humain montre la marchandise.
4. **Une seule courbe, une seule durée, partout.** Toutes les transitions CSS relevées sur les trois sites sont en
   `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out), entre 0,4 et 1,2 s. Rien n'est sec, rien ne rebondit, rien n'est
   linéaire. Les humains mélangent : Délice `.215,.61,.355,1` à 0,2 s sur les boutons et un défilement lissé
   (Lenis) ; Amici un rebond back-out à 0,35 s sur les boutons, `0.625, 0.05, 0, 1` à 0,735 s sur les cartes et du
   linéaire à 0,3 s ; Binocle du linéaire à 30 s (sceau) et 2 s (bulle) ; Bécane `ease` 0,7 s. Chacun a une
   main ; nos trois pistes ont la main du moteur.
5. **Les titres sont des phrases complètes, finies par un point, de même longueur.** Mesuré (h1 + h2 visibles) :
   A 12, 10, 9, 11, 6, 5 mots ; B 12, 10, 10, 8, 7 ; C 8, 11, 8, 11, 6, 5. **15 titres sur 18 finissent par un
   point.** Exemples : « Le beaufort d'alpage se vend à l'âge que vous voulez. » (A), « Le beaufort d'alpage, à
   l'âge que vous voulez. » (C), « Raclette et plateaux, ce qu'il faut savoir avant de réserver. » (B). Chez les
   humains, **0 titre sur 26 finit par un point**, et la moitié font 1 à 3 mots : « Plaisirs du jour », « Un choix
   pour tous les goûts » (Délice) ; « Ciao! », « Hoe het werkt », « Il Bambino » (Amici) ; « Nos cafés »,
   « Greenwashing? » (Binocle) ; « Collection » (Bécane). La règle `GOUT.md:89` (« Titres : une phrase, pas un
   fragment ») née sur le site du studio, appliquée à tout, fabrique ce ton de notice uniforme.
6. **Des textes trop sages, sans voix.** Phrases du corps : 11,8 à 12,6 mots en moyenne, écart 6 à 8, **zéro
   point d'exclamation ou d'interrogation** en A et B (3 en C). Rien qu'une personne dirait à voix haute. Amici :
   8 exclamations, une lettre signée « Chef Gianluca » avec sa signature manuscrite, des apartés écrits à la main
   (« De snelste foodtruck van Nederland! », « Ciao Amici! »). Binocle : « Le café le plus gentil au monde! »,
   « Climatopositi-quoi? ». Délice : des noms de soirées (« Mecredélice », « Funky Lamas Coverband »). Les humains
   ont des noms propres, des blagues, une signature ; nous avons des consignes (« Réservez-le deux jours avant le
   week-end. »).
7. **Trois photos de banque, légendées « photo d'illustration ».** Les trois pistes utilisent les trois mêmes
   images Wikimedia, et l'une d'elles (`cave.webp`) est une cave belge de Herve (« Meule du Plateau… Terre de
   fromages, Herve », `CREDITS.md`). La légende « photo d'illustration » est un aveu visible sous chaque photo
   (`-c/sections/Cave.astro:31`, `Raclette.astro:31`, `Beaufort.astro:37`, `fromagerie-ravanel/sections/Cave.astro:22`).
   Les humains : 32 images chez Délice (l'équipe, la salle, les assiettes, le livreur avec sa pile de boîtes),
   128 chez Amici (l'équipe en marinière devant le camion, chaque camion photographié), illustrations dessinées
   chez Binocle, 14 mannequins détourés chez Bécane. **Une démo sans photo du client devrait le montrer
   autrement (dessin, ardoise, objet typographique), pas avec une photo de banque répétée trois fois.**
8. **Une seule voix typographique par site, une seule graisse.** A : Savate 600 sur tous les titres (h1 78 px,
   h2 44, h3 24, tous à 600) ; B : Libre Caslon Condensed 500 partout, et un h2 (58 px) plus grand que le h1
   (45 px) sur ordinateur ; C : Alfa Slab One partout (h1 188 px). Deux familles par site, chacune dans un seul
   rôle. Les humains distribuent des rôles : Délice = Ivy Mode (titres) + Filson Soft (texte, h1 en petites
   capitales 18 px) + Miller Banner italique (sous-titres) ; Amici = salo condensée + Azeret Mono + Awesome Serif
   (boutons) + La Belle Aurore (manuscrit) ; Binocle = Founders Grotesk + Caprasimo + Cimo, avec des sauts de
   taille de 20 à 152 px. Le contraste vient des **rôles** (un manuscrit, un mono, une enseigne), pas d'un titre
   plus gros.
9. **Le même gabarit de section : titre-phrase en haut à gauche, paragraphe gris en dessous, puis une photo ou
   une liste à filets.** Code : `text-display-md font-display max-w-[18ch]` + `mt-5 max-w-prose text-lg
   text-muted` répété dans `Age.astro:24-25`, `Cave.astro:15-16`, `Reserver.astro:37` (A), `cal-titre` +
   `cal-chapo` (B), `carnet-titre` + `carnet-chapo` (B), `cave-titre` + `cave-corps` (C). Les tableaux
   « Pour / Prix / Commander / Fêtes » à filets fins se retrouvent en A (`Reserver`), B (`Carnet`) et C
   (`Plateau`). Les humains cassent la grille : titre sur un arc au-dessus d'une assiette (Délice), manifeste en
   capitales sur toute la largeur (Binocle), cartes de camion avec deux chiffres énormes (Amici), page sans
   section du tout (Bécane).
10. **Beaucoup de vide, peu de matière par écran (ordinateur).** A-d : premier écran sombre dont le h1 occupe un
    tiers ; écrans 1, 3 et 5 presque vides (un titre et deux lignes). B-d : colonne de texte de 30 % de large
    entre un panneau latéral et le bord. C-d : le h1 « Fromagerie Ravanel » occupe 40 % de l'écran, le reste est
    du crème. Les pages humaines sont **pleines** : Amici et Délice superposent photos, cartes, bandeaux,
    étiquettes et dessins sur chaque écran. Le vide « premium » est le réglage par défaut des générateurs.
11. **Les « gestes de pop » de C sont ceux du néo-brutalisme généré** : boutons à ombre portée dure décalée,
    étiquette inclinée de 7° qui se redresse au défilement (`Raclette.astro:18`, `data-scrub="rotate=-7,y=50"`),
    bandeau défilant noir. Ils sont « osés » mais vus partout en 2025-2026.

---

## 3. Ce que font les sites humains à la place

### Mouvement
- **Ils animent la chose vendue, pas le texte.** Amici : la pizza tourne, les tickets d'étapes s'inclinent sur un
  fil, les cartes de camion empilées se décalent (`stack-cards__item`) ; Délice : les assiettes rondes défilent
  et le fond change de couleur avec le plat du jour ; Bécane : les mannequins entrent un par un.
- **Une seule entrée, propre à la marque, et rien d'autre de « scénarisé ».** Délice : les lettres du titre se
  posent sur une ligne ondulée en 0,4 s puis la photo se défloute ; Amici : le logo incliné tombe au centre puis
  remonte et découvre le camion (0,8 à 1,5 s) ; Bécane : silhouettes + « Collection » qui se décode ; Binocle :
  aucune, la page apparaît. Après l'entrée, **les titres de section ne bougent pas**.
- **Des durées et des courbes mélangées** (voir § 2.4) : une réponse sèche sur les boutons, une lenteur assumée
  sur un ornement (sceau 30 s), un rebond là où c'est drôle (boutons Amici). Pas une courbe unique.
- **Le défilement porte du contenu, pas un effet** : chez Délice, le carrousel « Plaisirs du jour » change la
  couleur de toute la section (turquoise, olive, marine) selon le plat ; chez Amici, la vitesse des photos
  diffère (`data-scroll-speed` ×11) pour créer de la profondeur entre photos et cartes, pas pour zoomer une photo.

### Mise en page
- **Pleine, en couches** : photos découpées en formes (Délice : 61 `mask-image`), photos à bord de timbre,
  cartes-tickets, dessins, rubans (Amici), filets bruns qui quadrillent la page comme un journal (Binocle).
- **Les sections ne se ressemblent pas** : une section carrousel, une section de disques de couleur, une section
  d'agenda avec dates, une section d'offres d'emploi (Délice) ; chez Amici chaque bloc a son objet (lettre
  signée, camion, ticket, ruban, avis).
- **Des portes d'action par intention**, collées en bas sur téléphone (Délice : Venir, Réserver, Commander, Carte
  cadeau) plutôt qu'un seul bouton « Appeler » répété.

### Typographie
- **Plusieurs voix avec un rôle chacune** : manuscrit pour l'aparté, mono pour les fiches techniques, enseigne
  pour le titre, grotesque pour le texte (Amici, Délice, Binocle).
- **Le titre n'est pas toujours du texte** : SVG sur tracé (Délice), mot-symbole ondulé (Binocle). Le h1 peut
  être petit (Délice : 18 px, capitales) quand le visuel est fort.
- **Des écarts de taille brutaux** dans la même vue (Binocle : 20 px et 152 px ; Amici : chiffres « 275 » et
  « 7 × 2,5 m » énormes dans des cartes de texte à 12 px).

### Images
- **Leurs propres photos**, de gens identifiables (le chef, l'équipe, un livreur, des clients en terrasse), du
  lieu, de chaque produit. Aucune légende « photo d'illustration ».
- **Quand il n'y a pas de photo, un dessin maison** (Binocle : fleurs, mascotte-jumelles, globe) plutôt qu'une
  photo de banque.

### Texte
- **Des titres-étiquettes** (« Plaisirs du jour », « Ciao! », « Nos cafés »), des noms propres (« Il Bambino »,
  « Mecredélice »), des questions (« Greenwashing? »), des exclamations.
- **Une personne qui parle et signe** : la lettre du chef Gianluca, signée à la main ; le manifeste de Binocle à
  la première personne du pluriel.
- **Des chiffres d'exploitation** (« 275 pizza's per uur », « 7 x 2,5 m », « 300 g ou 1 kg ») plutôt que des
  consignes.
- Ils écrivent aussi des formules creuses (Délice : « alliant chaleur, grandeur et convivialité ») : ce n'est pas
  la propreté du texte qui les rend humains, c'est la présence d'une voix et de noms propres à côté.

---

## 4. Règles à ajouter

### (a) À `docs/GOUT.md`

À mettre en § 4 (Mouvement), **en remplacement** des parenthèses outillées de la ligne « un site doit être
vivant » (`GOUT.md:70-76`) :

```markdown
- **Vivant ne veut pas dire « tout se lève »** (16 oct 2026, trois pistes de fromagerie : « très similaire sur
  les animations », « aucun que je ne trouve pas IA generated »). Les quatre moments restent (entrée, rythme,
  feu d'artifice, image), mais aucun n'impose d'outil. Règles :
  - **Ce qui bouge est une chose du métier** (une meule, une ardoise, un ticket, un plat, un outil), pas un titre
    ni un cadre de photo. Un titre de section ne s'anime pas ; seul le h1 peut avoir une entrée, et alors elle
    est propre au client (enseigne, craie, tampon), jamais la montée de lignes sous masque du moteur.
  - **Pas de rideau d'ouverture** générique. L'entrée montre le client ou rien.
  - **Au moins deux régimes** sur la page : un sec (≤ 0,2 s, linéaire ou ease-out court) et un lent ou à rebond,
    choisis pour une raison écrite ; jamais une seule courbe expo-out partout.
  - **Deux pistes d'une même proposition n'ont jamais la même entrée ni le même mécanisme d'apparition** au
    défilement.
```

À mettre en § 2 (Signes IA) :

```markdown
- Titres de section révélés ligne par ligne sous masque, sur toute la page ; rideau plein écran qui se lève à
  l'ouverture ; photo qui se découvre par volet puis zoome au défilement, à chaque section (16 oct 2026,
  fromagerie A/B/C).
- Surtitre gris « métier, rue, ville » au-dessus du h1 : c'est l'eyebrow en casse normale (16 oct 2026).
- Photo de banque légendée « photo d'illustration » : sans photo du client, on dessine, on compose en typo ou on
  montre un objet (ardoise, étiquette, ticket), on n'illustre pas (16 oct 2026).
- Une seule police de titre à une seule graisse pour h1, h2, h3 ; un h2 plus grand que le h1.
```

À mettre en § 5 (Textes), **en remplacement** de « Titres : une phrase, pas un fragment » (`GOUT.md:89`) :

```markdown
- Titres : **jamais un fragment creux** (« Humains. »), mais pas non plus une phrase-consigne finie par un point
  à chaque section (16 oct 2026 : 15 titres sur 18 finissaient par un point dans les trois fromageries, 0 sur 26
  chez quatre sites humains). Sur une page : au moins un titre-étiquette de 1 à 4 mots qui nomme une chose du
  client (« L'ardoise », « Beaufort 24 mois »), au plus la moitié des titres finis par un point, des longueurs
  qui varient du simple au triple.
- Une voix par site : au moins une phrase qu'une personne nommée du brief dirait (avec son prénom), une
  question ou une exclamation si le ton le permet, des noms propres (fermes, produits, lieux) plutôt que des
  consignes.
```

### (b) À la skill `/site-final`

**`direction-modele.md`, ligne MOUVEMENT** (remplace la ligne 24) :

```markdown
- MOUVEMENT : quatre lignes (GOUT § 4), chacune avec **l'objet qui bouge** (une chose du métier, pas un titre ni
  un cadre) et **la raison en un mot**. Interdit d'écrire un attribut du moteur dans cette ligne : on décrit ce
  qu'on voit (« la craie s'écrit sur l'ardoise », « les meules s'empilent »), on choisit l'outil après. Dire
  laquelle des entrées des démontages on transpose (fiche + ce qu'on en garde). Courbes : nommer les deux
  régimes (sec / lent ou à rebond) et pourquoi.
```

**`SKILL.md` § 1bis**, remplacer « les cinq axes (squelette, direction/couleur, typographie, rythme, mécanisme du
geste) » par :

```markdown
les sept axes (squelette, direction/couleur, typographie, rythme, mécanisme du geste, **entrée du premier
écran**, **manière d'apparaître au défilement**). Deux pistes qui partagent l'entrée ou la manière d'apparaître
échouent, même si tout le reste diffère.
```

**`SKILL.md` § 5, film du mouvement** : ajouter après « Le mouvement ne se voit pas sur une planche fixe » :

```markdown
Pour une proposition à plusieurs pistes, faire **une seule planche comparée** : les premiers écrans des N pistes
à 0, 150, 400, 800, 1 500 ms côte à côte, puis la première section sous le hero de chacune à +250 ms. Si deux
colonnes se ressemblent à 400 ms (même aplat, même titre coupé à mi-hauteur), les pistes ne sont pas
différentes. Ajouter à côté les mêmes vignettes d'un démontage de `docs/veille/demontages/` du même métier.
```

**`modeles/consignes-pistes.md`**, supprimer de la liste des lectures « (le moteur d'animation :
data-split="lines", data-reveal, …) » et ajouter :

```markdown
Mouvement : tu ne réutilises ni l'entrée ni la manière d'apparaître des autres pistes (lis leurs MOUVEMENT). Tu
n'utilises `data-split` sur aucun h2 ; au plus sur le h1, et seulement si le contrat dit pourquoi cette entrée
est celle de ce client. `motion: 'rich'` sans rideau (`layout.curtain: false` dès qu'il existe). Pas de photo
de banque légendée « photo d'illustration » : à la place, une composition typographique ou un objet du métier.
```

**`relecteurs/da.md`, remplacer le point « Vivant »** par :

```markdown
- Vivant ET humain (GOUT § 2 et § 4) : regarde le film. (1) Qu'est-ce qui bouge : des titres et des cadres de
  photo, ou des choses du métier ? Plus de deux titres de section qui se lèvent ligne par ligne = constat à 80.
  (2) L'entrée montre-t-elle le client, ou un rideau / un titre qui monte que n'importe quel site de l'usine
  aurait ? (3) Une seule courbe et une seule durée partout = constat à 75. (4) Si d'autres pistes existent,
  compare leurs films à 400 ms : même entrée ou même apparition = constat à 85, verdict « refaire » le
  mouvement. (5) Compare à un démontage du même métier : nomme une chose qu'il anime et que nous n'animons pas.
- Typographie : une seule police de titre à une seule graisse pour tous les niveaux, ou un h2 plus grand que le
  h1 = constat à 75. Titres : compte ceux qui finissent par un point ; plus de la moitié = constat (rédacteur).
- Images : photo de banque visible, légendée « d'illustration », ou la même photo dans deux pistes = constat à 80.
```

**`relecteurs/grille.md`, PLAFONDS**, ajouter :

```markdown
- mouvement « moteur » : plus de deux titres h2 animés par lignes, ou rideau d'ouverture, ou une seule courbe
  pour toutes les apparitions : composition ≤ 6,5 (GOUT § 2, 16 oct 2026) ;
- deux pistes avec la même entrée ou la même manière d'apparaître au défilement : idée ≤ 6 pour la plus faible ;
- photo de banque légendée « d'illustration » à la place d'une photo du client : composition ≤ 7 ;
- plus de la moitié des titres sont des phrases finies par un point, ou aucun titre de moins de 5 mots : textes
  ≤ 6 (rédacteur).
```

**`relecteurs/redacteur.md`**, ajouter une question :

```markdown
- Lis les titres à la suite, à voix haute. S'ils ont tous la même forme (phrase de 8 à 12 mots, point final),
  c'est une notice, pas un commerçant. Y a-t-il un nom propre, une phrase signée par une personne du brief, une
  question ? Sinon, constat à 75.
```

### (c) Au moteur et aux contrôles automatiques (`ff ia`, `ff audit-motion`, `ff variete`)

Moteur :

```markdown
- `src/layouts/Base.astro:170` : le rideau `.ff-curtain` ne se pose plus avec `motion: 'rich'` ; il devient
  opt-in (`layout.curtain: true`) et `ff ia` alerte quand il est actif.
- `docs/ANIMATIONS.md:50` : retirer « le geste de base d'un hero "cher" » et « pour les h1/h2, à la place de
  data-reveal ». Écrire : « réservé à un h1 au plus, quand le contrat dit pourquoi ; jamais sur les h2 (signe
  IA, GOUT § 2, 16 oct 2026) ».
- `src/scripts/motion.ts:860-875` : `data-split="lines"` lit `data-split-duree`, `data-split-pas`,
  `data-split-depart` (yPercent) au lieu de 0,9 / 0,09 / 110 figés, pour que deux sites n'aient pas le même tempo
  quand le h1 s'en sert.
- `global.css` : `--ease-out` et `--ease-out-expo` ne doivent plus être la même valeur ; chaque direction
  redéfinit `--ease-out` et ajoute `--ease-sec` (≤ 0,2 s) ; `data-reveal` lit `--ease-out` de la direction.
```

`ff ia` (sur `dist/<slug>/index.html`, comme les règles existantes, sur le balisage seulement) :

```markdown
- ✗ `split-titres` : plus de 2 éléments `h2`/`h3` portant `data-split` (toutes valeurs) sur une page.
- ⚠ `split-h1` : un `h1` avec `data-split="lines"` sans `data-split-raison` (raison écrite au contrat).
- ⚠ `rideau` : présence de `.ff-curtain`.
- ⚠ `reveal-partout` : plus de la moitié des `<section>` contiennent un `data-reveal="clip|wipe|mask"` ou un
  `data-scrub`/`data-parallax` sur une `<img>`.
- ⚠ `surtitre-adresse` : un `<p>` de moins de 80 caractères juste avant le `h1`, contenant la ville ou la rue de
  `site.contact.address` (eyebrow déguisé).
- ⚠ `photo-illustration` : texte visible « photo d'illustration » ou « photo d’illustration ».
- ⚠ `titres-point` : plus de la moitié des h1/h2 visibles finissent par « . », ou aucun h2 de moins de 5 mots.
- ⚠ `une-voix` : tous les h1/h2/h3 dans la même famille ET la même graisse (lu dans les classes ou le CSS
  calculé par `ff audit-motion`), ou un h2 dont la taille calculée dépasse celle du h1.
```

`ff audit-motion` (déjà dans Chrome) :

```markdown
- Relever `document.getAnimations()` et les mutations de style pendant un défilement (comme
  `docs/veille/pourquoi-ia-2026-10.md`, méthode) ; échec si une seule courbe couvre plus de 90 % des transitions,
  alerte si plus de 60 % des éléments animés sont des lignes de titre (`.split-line`).
```

`ff variete` / nouvelle commande `ff pistes <slug>` :

```markdown
- Comparer les pistes d'une proposition (`<slug>`, `<slug>-b`, `<slug>-c`) sur : l'ensemble des `data-*` de
  mouvement utilisés (indice de Jaccard > 0,6 = alerte), la présence du rideau, le nombre de `data-split`, les
  fichiers de `public/images` identiques (même empreinte = alerte « mêmes photos »), le texte du premier `<p>`
  avant le `h1`. Sortie : un tableau à coller dans `direction.md` § 1bis.
```

---

Note honnête : quelques gestes humains relevés sont déjà refusés par `GOUT.md` (polaroids/timbres inclinés et
rebond back-out d'Amici, sceau qui tourne seul chez Binocle, sous-titres en serif italique de Délice). Ce
document ne demande pas de les reprendre. Il demande de reprendre **où** les humains mettent le mouvement (sur
les choses), **comment** ils varient (régimes, rôles typographiques, longueurs de titres) et **ce qu'ils
montrent** (leurs gens, leurs produits, leurs noms), c'est-à-dire tout ce que le moteur et la grille actuels ne
savent ni produire ni mesurer.
