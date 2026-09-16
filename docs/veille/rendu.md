# Veille — rendu (typographie, espace, couleur, images, polish, motion)

Date de la veille : 16 septembre 2026. Contexte : `docs/veille/tendances.md`, `animations.md`,
`composants.md` couvrent déjà les tendances de mise en page, l'inventaire des libs d'animation et le
catalogue de sections/pairings de polices — ce document ne les répète pas. Ici, l'angle est différent :
non pas « quoi faire de nouveau » mais **« comment le rendu lui-même — un `<h1>`, un paragraphe, un
espacement, une photo, un bouton — peut passer de correct à soigné »**, avec des règles chiffrées et
encodables dans `src/styles/global.css` et les 16 `src/directions/*/index.css`, pas des opinions.

**Méthode** : recherche par quatre agents en parallèle (typographie ; espace+couleur ; images ; polish+motion).
Le quota WebSearch de la session a été épuisé presque immédiatement à chaque fois — l'essentiel provient
de `WebFetch` direct sur les URL sources (Butterick, MDN, Utopia, Tailwind, Evil Martians, APCA, Astro
docs, Material Design 3, Emil Kowalski, Rauno Freiberg, web.dev...). Quand une page n'a pas pu être
récupérée (SPA en JS, 404, article déplacé), c'est noté **« non vérifié cette session »** — à revérifier
avant de citer un chiffre précis en présentation client. Ce n'est pas de la paresse méthodologique : mieux
vaut un chiffre marqué incertain qu'un chiffre inventé.

**État actuel de `global.css`/directions** (vérifié en lisant le code, pas la doc) : `--section-y:
clamp(4rem, 10vw, 8rem)`, `--container: 76rem`, `body { line-height: 1.6 }`, `h1,h2,h3 { text-wrap:
balance }`, `p { text-wrap: pretty }`, `::selection` et `:focus-visible` déjà stylés, `--ease-out-expo:
cubic-bezier(0.16, 1, 0.3, 1)` déjà posé, `eyebrow` a déjà `letter-spacing: 0.18em` + `uppercase`. Plusieurs
règles ci-dessous sont donc déjà appliquées — signalé par **[déjà fait]** — le but est de repérer les
trous, pas de refaire ce qui existe.

---

## 1. Typographie de détail

### 1.1 Échelles fluides et modulaires

Ratios de référence (typescale.com/type-scale.com, modularscale.com) : **1.067** (mineure seconde) ·
**1.125** (majeure seconde) · **1.2** (mineure tierce) · **1.25** (majeure tierce) · **1.333** (quarte
juste) · **1.414** · **1.5** (quinte juste) · **1.618** (nombre d'or). Modular Scale peut cumuler
plusieurs bases *ou* plusieurs ratios (pas les deux à la fois).

Utopia (`utopia.fyi/type/calculator/`) prend un couple (largeur mini, taille mini) et (largeur maxi,
taille maxi) et génère un `clamp()` dont la pente est en `vw`. Exemple réel généré par le calculateur :

```css
--step-0: clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem);
--step-1: clamp(1.35rem, 1.2631rem + 0.3864vw, 1.5625rem);
```

C'est exactement le mécanisme déjà utilisé par `[data-scale]` dans `global.css` (`--scale-xl/lg/md/sm`) —
**[déjà fait]** dans sa forme, mais les trois presets (`compact/normal/display`) ne sont pas documentés
comme dérivés d'un ratio précis. À la marge, formaliser : `normal` ≈ ratio 1.333-1.414 entre `sm→md→lg→xl`,
`display` ≈ 1.45-1.5. Pas de changement nécessaire, juste à savoir pour créer un futur preset cohérent.

### 1.2 Interlettrage (tracking) selon la taille

Butterick (`practicaltypography.com/letterspacing.html`) : les majuscules et petites capitales ont
besoin de **+5 à +12 % d'espace en plus** — en CSS, `letter-spacing: 0.05em à 0.12em`. Le texte bas-de-casse
n'en a normalement pas besoin ; garde-fou de Butterick : « si l'espace entre les lettres est assez grand
pour y loger d'autres lettres, c'est trop ». Le resserrage sur les grands titres (`-0.01em` à `-0.03em`)
est une convention de métier répandue mais **non sourcée directement chez Butterick** — à traiter comme
un principe de craft, pas une loi physique.

- `eyebrow` dans `global.css` a déjà `letter-spacing: 0.18em` + `uppercase` — **[déjà fait]**, et même
  au-dessus de la fourchette Butterick (0.18em > 0.12em), ce qui est un choix assumé pour un micro-label,
  pas un problème.
- `--display-tracking` existe déjà (`-0.02em` par défaut, `-0.015em` atelier, `-0.01em` luxe) — **[déjà
  fait]**, cohérent avec la convention.

### 1.3 Interlignage (line-height) par taille

Butterick (`line-spacing.html`) : interligne optimal = **120 % à 145 % du corps**. En CSS, toujours un
nombre sans unité (ratio, pas des px) — confirmé par web.dev/learn/css/sizing. `body { line-height: 1.6 }`
dans `global.css` est dans la fourchette haute recommandée pour du texte courant — **[déjà fait]**, bon
choix pour la lisibilité. En revanche les titres (`h1,h2,h3 { line-height: 1.05 }`) sont délibérément
serrés — cohérent avec la règle inverse taille/interligne (plus la taille grandit, plus l'interligne doit
se resserrer), aucune formule mathématique fluide n'a été trouvée sourcée, 1.05-1.15 est la fourchette de
craft habituelle pour du display.

### 1.4 Longueur de ligne (mesure)

Butterick (`line-length.html`) : **45 à 90 caractères** espaces compris (« test de l'alphabet » : 2 à 3
alphabets par ligne). learnui.design converge sur **50-75 caractères**. Valeur pratique consensuelle :
**60-65ch** en `max-width`. **Trou identifié** : aucun token `--measure` n'existe dans `global.css` — les
sections de texte long (about, manifeste) n'ont pas de garde-fou de largeur autre que `container-ff`
(qui vise la mise en page, pas la lisibilité du texte). Voir diff §7.

### 1.5 Optical sizing (axe `opsz`) sur les polices variables

`font-optical-sizing: auto` (MDN) est la valeur par défaut et active automatiquement l'axe `opsz` si la
police le supporte — la plupart des navigateurs mappent `font-size` → `opsz` sans rien à écrire. Plages
réelles (métadonnées Google Fonts) :

| Police | Axe `opsz` | Utilisée dans ff-atelier |
|---|---|---|
| Fraunces Variable | 9–144 (+ `SOFT` 0–100, `WONK` 0–1) | direction `atelier` (et `h1 em`/`h2 em` utilisent déjà `SOFT`/`WONK`, **[déjà fait]**) |
| Newsreader Variable | 6–72 (défaut 16) | non utilisée actuellement |
| Literata Variable | 7–72 | direction `nordique` (à vérifier) |
| Source Serif 4 | 8–60 | non utilisée actuellement |

**Trou identifié** : `font-optical-sizing` n'est déclaré nulle part dans `global.css` ni dans `atelier`/`luxe`
— il est donc actif par défaut sur Chrome/Firefox (bon), mais rien ne force un `opsz` custom pour les
tailles `text-display-xl` (ex. 96px+) où un `opsz` figé au maximum de la police donnerait des empattements
plus fins et plus dramatiques qu'un mapping automatique parfois conservateur. Piste (Elliot Jay Stocks) :

```css
@media (min-width: 40rem) {
  .text-display-xl, .text-display-lg { font-variation-settings: 'opsz' 144; } /* Fraunces au max */
}
```

À tester au cas par cas par direction (Cormorant/luxe n'a pas d'axe `opsz` public confirmé — ne pas
supposer).

### 1.6 `text-wrap: balance` / `pretty`

MDN : `balance` limite le nombre de lignes équilibrées (Chromium ≤6 lignes, Firefox ≤10 — au-delà,
désactivé pour coût de calcul) → pour titres/légendes courtes. `pretty` = `wrap` + algorithme plus lent
qui améliore la césure de fin de paragraphe → pour le corps de texte long, pas les composants critiques
de perf. **`global.css` a déjà les deux au bon endroit** (`h1,h2,h3,.font-display { text-wrap: balance }`,
`p { text-wrap: pretty }`) — **[déjà fait]**, rien à changer.

### 1.7 Ponctuation pendante, ligatures, chiffres tabulaires, `font-size-adjust`, kerning

- `hanging-punctuation` (MDN) : `first | last | allow-end`, support **limité à Safari/WebKit**, pas
  Baseline — à réserver aux citations/pull-quotes si le site cible beaucoup de trafic Safari (macOS/iOS
  y sont sur-représentés en France sur mobile), jamais comme dépendance de mise en page.
- `font-variant-ligatures` : `normal` (valeur par défaut) active déjà les ligatures communes (`fi`, `ffi`,
  `th`...) — rien à faire, c'est déjà actif partout par défaut du navigateur.
- **`font-variant-numeric: tabular-nums`** — chasse fixe pour aligner des colonnes de chiffres. **Trou
  identifié et prioritaire** : les sections `Tarifs`/`Pricing` (cf. `composants.md` §1 « Prix en tableau
  typographique à pointillés », « Devis en compteur animé ») affichent des prix côte à côte sans cette
  règle — un prix à 3 chiffres et un à 4 ne s'alignent pas visuellement. À ajouter comme utilitaire (voir
  diff §7).
- `font-size-adjust` (MDN) : compense l'écart de x-height entre la police chargée et son fallback système
  pendant le FOUT — formule `u = (m / m′) × s` (exemple MDN : cap-height Verdana 0.73 vs Times 0.66 →
  taille ajustée = (0.73/0.66)×14px ≈ **15.48px**). Recoupe directement le sujet des métriques de fallback
  en §5.1 (Fontaine/Capsize) — préférer cette route (plus complète : elle gère aussi ascent/descent, pas
  seulement la taille) plutôt que `font-size-adjust` seul.

### 1.8 Tailles réelles utilisées par les sites soignés

learnui.design (Erik Kennedy) : corps de texte desktop **18-24px** pour du contenu dense en texte,
**14-20px** pour de l'interaction-heavy ; mobile **16-20px**, jamais sous **16px** sur un champ de saisie
(zoom auto iOS) ; point de départ conseillé **17px** ; règle de sobriété : **~4 tailles de police max**
dans tout le système. Butterick, pour le web en général : **15-25px**. `global.css` ne fixe pas de
`font-size` de base sur `body` (hérite du root 16px du navigateur) — cohérent avec la fourchette basse,
mais aucune direction ne pousse le corps de texte au-dessus de 16px par défaut. **Piste d'amélioration** :
un token `--text-body: clamp(1rem, 0.95rem + 0.2vw, 1.0625rem)` (16→17px fluide) sur le corps donnerait un
supplément de confort sans rien casser.

---

## 2. Espace et rythme

### 2.1 Échelle d'espacement fluide (Utopia)

Méthode (`utopia.fyi`) : définir une échelle à la largeur mini et une à la largeur maxi (exemple par
défaut du calculateur : 360px et 1240px), un ratio par extrémité (exemple : 1.2 en petit, 1.25 en grand),
puis laisser le navigateur interpoler en `vw` entre les deux via `clamp()`. Sortie concrète du calculateur
par défaut :

```css
--space-3xs: clamp(0.3125rem, 0.3125rem + 0vw, 0.3125rem); /* 5px, statique */
--space-2xs: clamp(0.5625rem, 0.5369rem + 0.1136vw, 0.625rem);  /* 9 → 10px */
--space-xs:  clamp(0.875rem, 0.8494rem + 0.1136vw, 0.9375rem);  /* 14 → 15px */
--space-s:   clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem);    /* 18 → 20px */
--space-m:   clamp(1.6875rem, 1.6108rem + 0.3409vw, 1.875rem);  /* 27 → 30px */
--space-l:   clamp(2.25rem, 2.1477rem + 0.4545vw, 2.5rem);      /* 36 → 40px */
--space-xl:  clamp(3.375rem, 3.2216rem + 0.6818vw, 3.75rem);    /* 54 → 60px */
--space-2xl: clamp(4.5rem, 4.2955rem + 0.9091vw, 5rem);         /* 72 → 80px */
--space-3xl: clamp(6.75rem, 6.4432rem + 1.3636vw, 7.5rem);      /* 108 → 120px */
```

Utopia propose aussi des tokens « one-up » (ex. `--space-s-l: clamp(1.125rem, 0.5625rem + 2.5vw, 2.5rem)`,
18→40px) qui interpolent entre deux paliers différents — pente bien plus marquée, utile pour un padding de
carte qui doit vraiment respirer plus à l'écran large. **Trou identifié** : `global.css` n'a **aucune**
échelle d'espacement générique — seulement `--section-y` (padding de section) et le padding fixe de
`container-ff`. Les gaps entre éléments (grilles, cartes, listes) sont laissés à Tailwind par défaut
(`gap-4`, `gap-6`...) sans lien avec un système fluide. Voir diff §7 pour une proposition minimale (4-5
paliers, pas les 9 d'Utopia — inutile de complexifier pour des sites vitrine).

### 2.2 Grille 8pt vs espacement fluide

Règle du 8pt grid (`spec.fm/specifics/8-pt-grid`) : utiliser des multiples de 8 pour toutes les dimensions
— la plupart des résolutions d'écran sont divisibles par 8 sur au moins un axe. Un sous-grid 4pt (norme
Material) sert aux ajustements fins de ligne de base. **Compromis pratique** : le 8pt grid gagne en
rapidité d'implémentation et en cohérence pour une bibliothèque de composants dense (c'est pour ça que
Material et la plupart des design systems produit l'utilisent) ; l'espacement fluide façon Utopia gagne en
continuité visuelle pour des sites éditoriaux/vitrine à faible nombre de composants — exactement le
contexte de ff-atelier. Conclusion : garder le fluide comme défaut, mais caler les valeurs `rem` de
l'échelle proposée en §2.1 sur des multiples de 4px (elles le sont déjà à peu près : 5, 9-10, 14-15,
18-20, 27-30...) pour que Tailwind (`p-1`=4px, `p-2`=8px...) et le système fluide ne se contredisent pas
visuellement quand ils cohabitent dans une même section.

### 2.3 Padding vertical de section chez les agences

Aucune source unique fetchée en direct n'a confirmé un chiffre d'agence précis cette session (à traiter
comme **synthèse de convention de métier, non vérifiée par une recherche web directe** cette fois-ci) :
desktop **96-160px**, mobile **64-96px** — ce qui correspond presque exactement aux paliers Utopia
`--space-2xl` (72-80px) et `--space-3xl` (108-120px) doublés haut+bas. `--section-y: clamp(4rem, 10vw,
8rem)` (64px → 128px) dans `global.css` **[déjà fait]** tombe pile dans cette fourchette — **pas de
changement nécessaire**, c'est déjà un bon choix, contrairement à ce qu'on aurait pu croire avant de
vérifier. Seul `[data-scale='display']` pousse plus loin (`clamp(5rem, 13vw, 11rem)`, 80-176px) pour les
directions à forte présence typographique — cohérent avec l'esprit "long"/"extra-long" du motion (voir §6).

### 2.4 Gouttières, largeurs maximales, mesure

Échelle Tailwind (`tailwindcss.com/docs/max-width`) : `max-w-6xl` = 72rem (1152px), `max-w-7xl` = 80rem
(1280px) — le palier 1280px est la convention d'agence la plus citée pour une largeur de conteneur externe
(1200-1440px). `--container: 76rem` (1216px) dans `global.css` **[déjà fait]** est très proche de ce
palier — pas de changement nécessaire. Le principe **« mesure liée au contenu, pas au conteneur »** (Every
Layout, pattern « Center » — page consultée mais **payante, contenu non récupéré cette session**, à
revérifier avant citation directe) : le fond/large conteneur peut faire 1200-1440px, mais le bloc de texte
à l'intérieur doit rester à 60-65ch, centré — c'est le trou du §1.4/§2.1, à combler par un token `--measure`
séparé de `--container`.

### 2.5 Rythme vertical

Pattern « Stack » d'Every Layout (contenu récupéré, celui-ci) : sélecteur *lobotomized owl* `.stack > * +
* { margin-block-start: var(--space); }` — n'espace qu'aux coutures entre éléments (pas de marge en trop
en haut/bas de la pile), avec une valeur d'espacement calée sur l'interlignage de base (ex. `1.5em`, parce
que « le texte domine la plupart des mises en page »). Utile pour les blocs de texte libre (about, FAQ,
mentions légales) où le HTML n'a pas une classe dédiée par élément.

### 2.6 Valeurs de tokens concrètes à adopter

| Token | Valeur proposée | Statut |
|---|---|---|
| `--section-y` | `clamp(4rem, 10vw, 8rem)` | **[déjà fait]** — garder |
| `--container` | `76rem` | **[déjà fait]** — garder |
| `--measure` | `65ch` | **à ajouter** |
| `--space-3xs` … `--space-xl` | échelle Utopia réduite à 5 paliers (voir diff §7) | **à ajouter** |
| gap de grille (`gap-*` Tailwind) | garder Tailwind par défaut, mais documenter la correspondance avec `--space-*` | note |

---

## 3. Couleur

### 3.1 OKLCH dans Tailwind v4 et en CSS natif

Tailwind v4 (`tailwindcss.com/blog/tailwindcss-v4`, vérifié) : « nous avons fait passer toute la palette
par défaut de `rgb` à `oklch` » pour profiter du gamut plus large — ex. `--color-red-500: oklch(63.7%
0.237 25.331)`. OKLCH est aussi devenu le mode d'interpolation par défaut des dégradés en v4 (dégradés plus
vifs entre couleurs éloignées sur le cercle chromatique qu'en RGB/HSL). **`global.css` définit encore
l'accent en HSL** (`--accent: hsl(var(--accent-h) var(--accent-s) var(--accent-l))`) — pas un bug (HSL
reste prévisible et lisible pour un token piloté par 3 variables simples dans `site.config.ts`), mais une
occasion manquée : HSL n'a pas de luminosité perceptuellement uniforme (un `hsl(60 90% 50%)` jaune paraît
bien plus clair qu'un `hsl(240 90% 50%)` bleu à la même valeur L) alors qu'OKLCH le garantit.

Syntaxe de couleur relative (Evil Martians, `evilmartians.com/chronicles/oklch-css-color-a-love-letter`,
vérifié) — dériver un état hover en ne bougeant que la luminosité, teinte et chroma fixes :

```css
background: oklch(from var(--button-color) calc(l + 0.1) c h);
```

Et pour garantir un texte lisible sur un fond dynamique (ex. couleur dominante d'une photo client) en
figeant la luminosité quelle que soit la teinte source :

```css
background: oklch(from var(--user-avatar-dominant) 0.8 0.17 h);
color: black; /* lisible car L est fixé à 80% quelle que soit la teinte */
```

### 3.2 Formule pour dériver teintes/nuances/surfaces depuis un seul accent

Méthode (Evil Martians) : faire varier **L** (luminosité) en gardant **H** (teinte) et **C** (chroma)
constants pour les variantes d'état simples (`oklch(0.5 0.2 260)` → hover `oklch(0.6 0.2 260)`, soit
+0.1 L). Piège de gamut : toutes les combinaisons L/C/H ne sont pas affichables en sRGB — il faut réduire
le chroma en s'approchant des extrêmes de luminosité (proche du blanc ou du noir), au risque d'un rendu
terne ou saturé de façon imprévisible ; oklch.com visualise cette « ligne de gamut » directement dans son
picker.

**Applicable à ff-atelier sans réécrire les 16 directions** : `color-mix()` (support Baseline) permet de
dériver `--accent-2`, des surfaces ou des tons plus clairs/foncés depuis l'accent HSL existant, sans
changer le modèle de couleur de fond :

```css
--accent-2: color-mix(in oklch, var(--accent) 85%, black);
--surface-tint: color-mix(in oklch, var(--accent) 6%, var(--bg));
```

`color-mix(in oklch, ...)` fait le mélange perceptuel en OKLCH même si les couleurs d'entrée sont en HSL —
c'est le point d'entrée le plus économique pour bénéficier d'OKLCH sans migrer tout le système de tokens.

### 3.3 Contraste : APCA vs WCAG 2

Seuils APCA (`apcacontrast.com`, `git.apcacontrast.com/documentation/WhyAPCA`, vérifiés) :

| Seuil Lc | Usage |
|---|---|
| **Lc 90** | corps de texte « fluent » (≥18px/300 ou ≥14px/400) |
| **Lc 75** | minimum corps de texte / colonne (24px/300, 18px/400, 16px/500) — remplace le 4.5:1 WCAG |
| **Lc 60** | minimum texte non-corps (24px normal ou 16px gras) — remplace le 3:1 WCAG |
| **Lc 45** | gros titres non-corps (36px normal ou 24px gras) |
| **Lc 30** | plancher absolu, texte peu lisible accepté (placeholder, désactivé) |
| **Lc 15** | plancher absolu, éléments non sémantiques (séparateurs) |

Pourquoi APCA est jugé plus fiable (mêmes sources) : APCA vise une perception uniforme (« Lc 60 représente
le même contraste perçu quelle que soit la couleur »), alors que le ratio WCAG 2 **surestime le contraste
des couleurs sombres** (un 4.5:1 proche du noir peut être fonctionnellement illisible) et n'a pas de
validation fiable pour les palettes sombres ; WCAG 2 ignore aussi le poids de la police. `src/directions/README.md`
exige aujourd'hui « contraste AA minimum » — **c'est la bonne référence légale/pratique à garder**
(APCA n'est pas encore un standard adopté, WCAG 2 reste la norme opposable), mais **APCA est le bon outil
de vérification interne supplémentaire** pour les directions sombres (`luxe`, `nuit`) où WCAG 2 est
justement le moins fiable.

### 3.4 Palettes sombres qui ne tournent pas au terne

Synthèse à partir des mécaniques OKLCH vérifiées (§3.1-3.2), **non confirmée par une checklist dédiée
trouvée en direct cette session** — à traiter comme un ensemble de règles de craft, pas une citation :

- Ne pas descendre à L=0 % (noir pur) pour le fond le plus sombre — remonter le plancher à **L≈12-20 %**
  pour garder de la marge perceptuelle pour le texte/les bordures (et pour rester au-dessus des seuils
  APCA du §3.3).
- Désaturer légèrement (réduire C) aux deux extrémités de L — un noir ou un blanc à chroma plein paraît
  soit terne soit criard ; c'est le même phénomène de compression de gamut que pour les teintes (§3.2).
- Garder un chroma modéré et une teinte stable sur toute l'échelle d'élévation (fond → carte → survol)
  plutôt que de réinventer la teinte à chaque palier.
- **Astuce neutre chaud/froid** : donner aux gris un chroma non nul légèrement teinté vers l'accent
  (`oklch(20% 0.01 260)` plutôt que `oklch(20% 0 0)`) au lieu d'un gris neutre pur — c'est la technique
  standard pour éviter des neutres « morts ». `luxe` (`--bg: #0e0d0c`, `--fg: #efe9df`) applique déjà ce
  principe empiriquement (les hex choisis ont une légère dominante chaude, pas un gris neutre) — **[déjà
  fait]** en pratique, même sans formule OKLCH explicite.

### 3.5 Outils

- **oklch.com** — picker L/C/H avec visualisation de gamut P3/Rec2020, conversion HEX/RGB/HSL ↔ OKLCH.
  Outil principal pour faire à la main la dérivation du §3.2.
- **Huetone** (`huetone.ardov.me`) — éditeur de palettes multi-paliers perceptuellement cohérentes (ex.
  gray-50…gray-900) avec vérification de contraste entre paliers adjacents. **Non vérifié par fetch cette
  session** (page SPA, aucun contenu texte récupéré) — identité de l'outil rapportée de mémoire, à
  recontrôler manuellement avant de citer un chiffre précis.
- **Realtime Colors** (`realtimecolors.com`) — prévisualisation live d'une palette (texte/fond/accents) sur
  un vrai gabarit de site, vérification AA/AAA intégrée, export CSS/Tailwind/Figma.

---

## 4. Images

*(Le sourcing légal des photos/vidéos — licences Unsplash/Pexels/Pixabay, quotas API, attribution — est
déjà couvert par `docs/veille/ressources.md` §1-2 : ne pas dupliquer ici. Ce paragraphe traite uniquement
du traitement et du rendu, pas de la provenance.)*

### 4.1 Traitement cohérent

**Duotone en CSS** — trois approches, aucune n'a de source canonique unique confirmée par fetch cette
session (à traiter comme mécanique CSS de consensus, pas comme citation) :

- **A. Overlay + `mix-blend-mode`** — `filter: grayscale(100%)` sur l'image + un `::after` en dégradé 2
  couleurs avec `mix-blend-mode: multiply` (assombrit, ombres→couleur 1) ou `screen` (éclaircit,
  lumières→couleur 2). Nécessite `isolation: isolate` sur le conteneur si un fond de page ne doit pas se
  mélanger par accident (technique confirmée via `css-tricks.com/grainy-gradients/`).
- **B. `filter` seul** — `grayscale(100%) sepia(100%) hue-rotate(180deg) saturate(300%)` : le moins cher (1
  ligne, pas de DOM en plus) mais limité à la famille de teintes du sépia tourné, pas 2 couleurs de marque
  arbitraires.
- **C. Filtre SVG `feComponentTransfer`/`feColorMatrix`** — vrai duotone à 2 couleurs, réutilisable comme
  `filter: url(#duotone)` sur n'importe quel `<img>`, un seul `<svg><filter>` défini une fois dans le
  layout. **Recommandé comme référence** pour ff-atelier : une seule définition SVG globale (ou par
  direction, avec les couleurs de l'accent), zéro pseudo-élément par image, zéro piège de contexte
  d'empilement.

**Grain/bruit** : `feTurbulence type="fractalNoise" baseFrequency="0.6-0.9"` + `contrast(170%)
brightness(1000%)` pour rendre le bruit visible, appliqué en `mix-blend-mode: overlay` sur un
`::after`. **[déjà fait] en partie** : `atelier` a déjà exactement ce pattern sur `body::before`
(`feTurbulence baseFrequency='0.9'`) — le même principe est réutilisable par-dessus une image individuelle,
pas seulement le fond de page.

**Aspect-ratio et cadrage** : `aspect-ratio` fixe + `object-fit: cover` + `object-position`, **un seul
ratio par contexte de grille** (4:3 partout ou 1:1 partout, jamais mélangé dans une même rangée) — un des
signaux les plus visibles d'amateurisme est un ratio qui varie image par image dans une même grille.
`border-radius` de l'image doit partager le token `--radius-card` avec la carte qui la contient — un rayon
d'image différent du rayon de sa carte lit comme un oubli, pas un choix.

### 4.2 Vitesse perçue : LQIP / BlurHash / ThumbHash

| Technique | Principe | Poids/complexité pour un site Astro statique |
|---|---|---|
| **LQIP** | Vraie image ~20px de large, encodée en base64, floutée en CSS (`filter: blur()` + `transform: scale(1.1)` pour masquer les bords flous) puis permutée au chargement | Le plus simple à comprendre, mais chaque placeholder est un vrai asset (quelques centaines d'octets à quelques Ko inline) |
| **BlurHash** | Chaîne courte (~20-30 caractères en base83) décodée en canvas côté client | Nécessite une lib JS de décodage ; pas de ratio d'aspect ni d'alpha encodés |
| **ThumbHash** (`github.com/evanw/thumbhash`) | Successeur explicite de BlurHash — encode aussi le ratio d'aspect, l'alpha, des couleurs plus fidèles, dans le même espace | Décodeur JS ~1 Ko ; paramètres fixes (moins de réglage, plus prévisible) |

**Recommandation pour ff-atelier** (site statique, sans backend) : **ThumbHash**, calculé **au build**
(petit script Node sur `sites/<slug>/public/images/` ou sur les fichiers `src/assets` une fois migrés —
voir §4.4) qui écrit la chaîne à côté de chaque image (JSON ou frontmatter), décodée par un tout petit
script client vers un canvas/data-URI peint avant que la vraie image charge. Si on veut zéro dépendance
JS : le LQIP via `astro:assets` (`<Image>` génère nativement un placeholder si l'image est importée depuis
`src/`) reste l'option « zéro lib ».

### 4.3 `<picture>`, AVIF/WebP, `sizes`/`srcset`

Ordre de préférence de format, `<img>` toujours en dernier comme repli :

```html
<picture>
  <source type="image/avif" srcset="photo.avif">
  <source type="image/webp" srcset="photo.webp">
  <img src="photo.jpg" alt="…">
</picture>
```

- **Descripteurs de densité** (`1x/2x/3x`, pas de `sizes` nécessaire) pour les éléments à taille fixe
  (logos, avatars) : `srcset="icon-1x.png 1x, icon-2x.png 2x, icon-3x.png 3x"`.
- **Descripteurs de largeur + `sizes`** pour les images fluides : hero → `sizes="100vw"` ; carte de grille
  (ex. 4 colonnes desktop / 2 tablette / 1 mobile) → `sizes="(min-width: 1200px) 25vw, (min-width: 768px)
  50vw, 100vw"`. Les largeurs du `srcset` doivent suivre les vrais points de rupture de mise en page (pas
  des nombres ronds arbitraires), avec un pas d'environ ×1.5-2 entre chaque palier.

### 4.4 Astro `astro:assets` et la limitation `public/`

**Confirmé en lisant la doc Astro et le code de ff-atelier** : `<Image>`/`<Picture>`/`getImage()`
**n'optimisent jamais les images placées dans `public/`** — pas de conversion de format, pas de
redimensionnement, pas de `srcset` généré ; elles sont servies telles quelles. Le composant peut être
pointé vers un chemin `public/`, mais il faut alors fournir `width`/`height` à la main (Astro ne peut pas
analyser le fichier).

**Conséquence directe pour ff-atelier** : `scripts/ff/images.mjs` convertit `sites/<slug>/raw/` en `.webp`
dans `sites/<slug>/public/images/` (confirmé en lisant `CONVENTIONS.md` et le script) — **aucune image
client ne passe par `astro:assets`**. Résultat concret : pas de conversion AVIF automatique, pas de
`srcset` multi-largeurs généré par Astro aujourd'hui, malgré le fait qu'Astro le ferait gratuitement si les
images vivaient dans `src/assets/` et étaient importées. Deux options, non exclusives :

1. **Migrer le pipeline** : `ff images <slug>` écrit dans `sites/<slug>/src/assets/images/` au lieu de
   `public/images/`, et les sections important une image passent par `import` + `<Image>`/`<Picture>` —
   gain : AVIF/WebP/srcset gratuits, mais casse la convention actuelle « toute image du site dans
   `public/images/` » documentée dans `CONVENTIONS.md`/`exporter.mjs` (les sites exportés sont censés être
   des fichiers statiques simples, pas un pipeline Astro qui tourne côté client — à vérifier si l'export
   final est bien un `astro build`, auquel cas la migration ne casse rien côté livraison).
2. **Rester sur `public/`** mais faire faire par `ff images` le travail qu'Astro aurait fait : générer
   plusieurs largeurs + AVIF via `sharp` (déjà une dépendance probable pour la conversion `.webp`
   actuelle) directement dans le script, et écrire le balisage `<picture>`/`srcset` à la main dans les
   sections. Moins élégant, mais ne touche pas au contrat `public/images/`.

Pas de recommandation tranchée ici — c'est un choix d'architecture qui dépasse le rendu visuel, à trancher
séparément (impact sur `exporter.mjs`, `ff verifier`, et la doc client).

### 4.5 Direction artistique (`<picture>` + crops différents par point de rupture)

```html
<picture>
  <source srcset="photo-portrait.jpg" media="(max-width: 600px) and (orientation: portrait)">
  <source srcset="photo-landscape-md.jpg" media="(min-width: 601px) and (max-width: 1024px)">
  <img src="photo-landscape-lg.jpg" alt="…">
</picture>
```

Utile quand le client ne fournit qu'une seule photo par sujet mais que le cadrage mobile (portrait, visage
serré) et le cadrage desktop (large, environnement) doivent différer — plutôt que de juste réduire la même
image (qui gaspille le viewport mobile sur du fond vide).

### 4.6 Shot-lists par métier (à donner au client avant la prise de vue)

| Métier | 6 photos à demander |
|---|---|
| **Plombier** | Véhicule/enseigne · mains en action sur une réparation · gros plan d'une installation finie et propre · portrait en tenue · sac à outils/fourgon rangé · avant/après d'une fuite réparée |
| **Salon de coiffure** | Façade/enseigne · geste de coupe ou coloration en action · gros plan coiffure finie (lumière soignée) · équipe aux postes · intérieur (fauteuils, miroirs, produits) · avant/après transformation |
| **Restaurant** | Façade/terrasse en lumière dorée · chef en action (dressage, cuisson) · plat signature en gros plan (top ou 45°) · salle/ambiance · portrait chef/patron en cuisine · service en pleine activité |
| **Garagiste** | Extérieur/enseigne · mécanicien sous le capot ou au pont (action) · gros plan d'une réparation précise · portrait équipe en tenue · atelier rangé (ponts, murs à outils) · avant/après (carrosserie, véhicule nettoyé) |
| **Avocat** | Extérieur du cabinet/plaque · au bureau ou en réunion (portrait de travail, pas posé-souriant) · gros plan mains sur des documents/signature · portrait individuel formel · salle de réunion/bibliothèque · photo d'équipe si cabinet à plusieurs |
| **Couvreur** | Maison avec toiture en contexte · ouvrier sur le toit en action (équipement de sécurité visible = confiance) · gros plan tuiles/ardoises posées (qualité d'alignement) · portrait équipe sur site · matériel/échelle rangés · avant/après retoiture (le métier qui bénéficie le plus de l'avant/après) |

### 4.7 Rendre présentables de mauvaises photos client

Par ordre d'impact (le premier point est le plus rentable) :

1. **Noir & blanc ou duotone** — masque les écarts de balance des blancs et de température de couleur
   entre photos prises à des jours/appareils différents. C'est le levier le plus efficace pour unifier un
   lot de photos hétérogène.
2. **Recadrage uniforme et serré** — un seul ratio par grille (§4.1), recadré assez près pour exclure le
   fond encombré plutôt que de montrer le cadre entier — le recadrage EST l'outil de retouche quand on ne
   peut pas rééclairer.
3. **Grain superposé** — masque le bruit capteur et les artefacts de compression JPEG en les faisant
   passer pour une texture voulue plutôt qu'un défaut.
4. **Cadrage serré sur le sujet** (visage, mains, produit) plutôt que le plan large qui inclut le désordre
   qu'un téléphone client capture presque toujours.
5. **Cadre carte cohérent** (même rayon, même ombre) — l'habillage cohérent crée un effet de « galerie
   éditée » qui détourne l'attention de la variabilité réelle des photos.
6. **Downscale délibéré** — ne jamais agrandir une photo de téléphone basse résolution en position hero ;
   la contraindre à une vignette de grille où le flou/bruit devient invisible.

---

## 5. Polish

### 5.1 FOUT/FOIT : chargement de police sans saut de mise en page

Quatre descripteurs `@font-face` réduisent le CLS causé par le remplacement police-web → police système
(`developer.chrome.com/blog/font-fallbacks`) : `size-adjust`, `ascent-override`, `descent-override`,
`line-gap-override`. Exemple concret (Poppins → Arial en secours) :

```css
@font-face {
  font-family: "fallback for poppins";
  src: local("Arial");
  ascent-override: 105%;
  descent-override: 35%;
  line-gap-override: 10%;
}
```

Outils qui génèrent ça automatiquement : **Fontaine** (`github.com/unjs/fontaine`, plugin Vite/Astro/
PostCSS — cas cité : CLS 0.24 → 0.054, score perf 92 → 100) et **Capsize** (`github.com/seek-oss/capsize`,
dimensionne par cap-height). Piste concrète pour ff-atelier (Astro + Vite) : brancher Fontaine dans
`astro.config` pour toutes les polices `@fontsource-variable/*` déjà utilisées — génère automatiquement le
fallback ajusté par police sans toucher aux 16 directions une par une.

`font-display` : **`swap`** (repli visible immédiatement, échange dès que chargé — cause un flash mais
jamais de texte invisible), **`optional`** (le navigateur peut ignorer l'échange si la police n'est pas
déjà en cache — le plus stable après le premier chargement, aucun risque de saut ultérieur), **`fallback`**
(blocage court ~100ms puis repli, courte fenêtre d'échange). Combiner avec `<link rel="preload" as="font"
type="font/woff2" crossorigin>` **uniquement pour la police display du premier écran** (hero), jamais pour
toutes les polices d'une direction.

### 5.2 Skeletons vs rien

`nngroup.com/articles/skeleton-screens` : squelette utile pour une attente **< 10 s** ; si le chargement
est **< 1 s**, ne rien afficher — le flash lui-même est perçu comme perturbant. Au-delà de 10 s, préférer
une barre de progression avec indication d'état. **Implication directe pour ff-atelier** : les sites
générés sont statiques, sans fetch de données côté client — la quasi-totalité des cas où un squelette
aurait de la valeur (attente réseau) ne se produit pas ici. Les squelettes sont donc **hors sujet pour ce
système**, sauf pour un composant chargé en différé exceptionnel (carte OSM, formulaire tiers) — y préférer
un petit spinner local, pas un plein écran de squelette.

### 5.3 Focus-visible dessiné

Patterns confirmés (MDN) : anneau décalé (`outline` + `outline-offset`), ou remplacement par
`box-shadow` sur les éléments arrondis où `outline` ne suit pas le `border-radius`. `global.css` a déjà
`:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px }` — **[déjà fait]**, dans la
fourchette usuelle (offset 2-3px). Amélioration possible pour les éléments très arrondis (`.btn` en
`radius: 999px` dans `luxe`) : passer localement en `box-shadow: 0 0 0 3px var(--accent)` pour que l'anneau
épouse la forme pilule au lieu de rester carré.

### 5.4 Sélection, scrollbar, curseur

`::selection` déjà stylé par token dans `global.css` **[déjà fait]**. Piège d'interop confirmé (MDN
`scrollbar-color`) : les règles `::-webkit-scrollbar-*` sont **entièrement ignorées** sur tout élément dont
le `scrollbar-color` calculé (y compris hérité) n'est pas `auto` — ne jamais mélanger les deux systèmes sur
la même chaîne d'ancêtres. **Trou identifié** : aucune règle `scrollbar-color` dans `global.css` — la barre
de défilement reste celle du système, jamais liée aux tokens de la direction active. Proposition minimale
en diff §7 (`scrollbar-color: var(--accent) var(--bg-2)`), avec contraste thumb/piste ≥3:1 (WCAG).

Curseurs personnalisés : pas de source dédiée confirmée cette session — règle de métier généralement
admise : utiles en contexte créatif/marketing pour renforcer un mode (zoom, drag) ou une personnalité de
marque (`luxe` a déjà `.luxe-cursor-glow`, un halo, pas un remplacement du curseur — **[déjà fait], bon
compromis** car ça ne masque pas l'affordance native) ; nuisibles quand ils remplacent le curseur natif sur
des contrôles interactifs standards (liens, boutons), où ils ralentissent le retour visuel attendu et
cassent avec les réglages d'accessibilité du curseur système.

### 5.5 Champs de formulaire

Hauteur minimale de cible tactile : **44-48px** (recoupe Apple HIG 44×44pt, Material 48×48dp, WCAG 2.5.8
niveau AA 24×24px minimum, 2.5.5 niveau AAA 44×44px) — **44-48px** est donc un bon compromis entre confort
tactile et discrétion visuelle. Placement de label : **label statique au-dessus du champ**, pas de « floating
label » — les labels flottants ont des problèmes d'accessibilité et de lisibilité documentés (contraste au
repos trop faible, confusion avec le placeholder, association lecteur d'écran fragile) — **non re-vérifié
par une source fraîche cette session**, à confirmer avant de le présenter comme un fait établi en clientèle,
mais c'est le consensus UX dominant. États d'erreur : jamais la couleur seule (WCAG 1.4.1) — toujours
couleur + icône + texte inline à côté du champ concerné, jamais seulement un bandeau en haut du formulaire.
`ContactForm.astro` (composant partagé) est le bon endroit pour centraliser ces règles une fois pour tous
les sites plutôt que par direction.

### 5.6 Micro-interactions de bouton

Valeurs concrètes (Emil Kowalski, `emilkowal.ski/ui/7-practical-animation-tips`) : état `:active` → `scale:
0.97` ; une entrée ne doit jamais démarrer à `scale(0)` (trop extrême, lit comme un bug) — commencer à
**0.9-0.93** ; rester **sous 300ms** pour une interaction UI, un menu à **180ms** est perçu plus réactif que
le même à **400ms** ; un tooltip peut descendre à **125ms**. `ease-out` pour tout ce qui entre/sort de
l'écran (jamais `ease-in`, qui retarde le retour visuel) ; les courbes `ease`/`ease-out` natives du
navigateur sont jugées « pas assez marquées » — une courbe personnalisée plus raide (comme
`--ease-out-expo` déjà posé dans `global.css`, **[déjà fait]**) est perçue comme plus soignée. Un flou de
**2px** pendant une transition peut masquer les imperfections d'une animation combinant échelle et fondu.
Le survol en léger soulèvement (`translateY(-1px à -2px)`) est une pratique très répandue (Stripe/Linear)
mais **non sourcée directement cette session** — à traiter comme convention, pas comme citation.

### 5.7 Soulignement de lien

`text-underline-offset` (MDN, confirmé) : préférer une unité **`em`** (ex. `0.15em-0.2em`) plutôt qu'un px
fixe pour que le décalage suive la taille de police. Propriété **séparée** de `text-decoration` (ne fait
pas partie du raccourci), ne s'applique qu'au soulignement (pas au surlignement/barré). `text-decoration-thickness`
en **1-2px**, `text-decoration-color` sur une version atténuée de la couleur du texte (`currentColor` à
opacité réduite, ou un token dédié) plutôt qu'une couleur de lien saturée par défaut — c'est ce qui
distingue un lien « soigné » d'un lien par défaut du navigateur.

### 5.8 Mode sombre, impression, favicon/OG, 404

- **Mode sombre** : chaque direction pose déjà `color-scheme: dark` quand elle est sombre (`luxe`
  **[déjà fait]**) — cohérent avec la bonne pratique (tokens clairs par défaut sur `:root`, surchargés
  dans la direction).
- **Impression** : pas de `@media print` trouvé dans `global.css` — trou mineur, mais peu prioritaire pour
  des sites vitrine consultés à l'écran (utile surtout pour une page tarifs/menu qu'un client imprimerait).
  Base classique : masquer nav/boutons/fonds décoratifs, afficher les URL des liens (`a::after { content: "
  (" attr(href) ")" }`), forcer noir sur blanc, `break-inside: avoid` sur les blocs clés.
- **Favicon/OG** : `ff og` génère déjà `public/og.webp` en 1200×630 — **[déjà fait]**. Un favicon réel
  (pas la valeur par défaut du navigateur) et l'OG correctement configuré comptent parmi les signaux les
  moins chers et les plus visibles d'un site fini par un studio plutôt que bricolé.
- **404** : aucune source fraîche trouvée cette session (articles NN/g et web.dev sur le sujet
  indisponibles) — bonne pratique générale : ton de marque, recherche ou navigation vers les pages clés,
  jamais une impasse sèche.

### 5.9 Checklist « derniers 10 % » avant livraison

**Non trouvée sous forme publiée par une agence identifiable cette session** (quota de recherche épuisé
avant d'explorer cette piste spécifiquement — à refaire une fois le quota WebSearch reconstitué). La
checklist de 40 points du §7 ci-dessous en tient lieu pour ff-atelier.

---

## 6. Principes de motion

### 6.1 Courbes d'easing

`cubic-bezier(0.16, 1, 0.3, 1)` (« ease-out-expo ») déjà posé comme `--ease-out-expo` dans `global.css`
**[déjà fait]** — très largement citée dans l'écosystème design-engineering comme courbe de « douceur »
par défaut, mais **non re-vérifiable directement cette session** (easings.net est une page JS dont le
tableau numérique n'a pas pu être extrait par fetch) — à traiter comme une valeur largement consensuelle,
pas comme une citation d'une source précise revérifiée aujourd'hui.

Confirmé en revanche via les tokens Material Design 3 (`m3.material.io/styles/motion/easing-and-duration/tokens-specs`) :

| Rôle | Courbe |
|---|---|
| Standard | `cubic-bezier(0.2, 0.0, 0, 1.0)` |
| Décélération standard | `cubic-bezier(0, 0, 0, 1)` |
| Accélération standard | `cubic-bezier(0.3, 0, 1, 1)` |
| Décélération « emphasized » (grandes transitions) | `cubic-bezier(0.05, 0.7, 0.1, 1.0)` |
| Accélération « emphasized » | `cubic-bezier(0.3, 0.0, 0.8, 0.15)` |

Emil Kowalski (`emilkowal.ski/ui/7-practical-animation-tips`) : `ease-out` pour tout ce qui entre/sort,
jamais `ease-in` sur une UI (retarde le retour attendu par l'utilisateur) ; les courbes natives `ease`/
`ease-out` du navigateur sont « pas assez marquées » — une courbe personnalisée plus raide est perçue comme
plus soignée, ce que `--ease-out-expo` fait déjà bien. `cubic-bezier(0.22, 1, 0.36, 1)` (autre famille
« expo-out » citée côté Apple/Linear/Stripe) — **non sourcée indépendamment cette session**, à traiter
comme valeur de pratique courante.

### 6.2 Durée selon la distance/taille

Échelle complète Material Design 3 (vérifiée) :

| Catégorie | Durées |
|---|---|
| Short (utilitaire, petit) | 50 / 100 / 150 / 200 ms |
| Medium (traversée d'écran) | 250 / 300 / 350 / 400 ms |
| Long (grandes transitions expressives) | 450 / 500 / 550 / 600 ms |
| Extra-long (ambiant, grande surface) | 700 à 1000 ms |

Confirme directement le principe du brief : petit ≈ 100-200ms, plus grand/plus loin ≈ 300-500ms, niveau
page jusqu'à ≈ 600-800ms. Emil Kowalski : rester **sous 300ms** pour une interaction UI ordinaire, un menu
à 180ms lit plus réactif qu'à 400ms, un tooltip peut descendre à 125ms. `--motion-duration: 0.9s` par
défaut dans `global.css` (1.4s pour `luxe`) se situe dans la zone « long/extra-long » de M3 — **cohérent**
pour des reveals de section au scroll (mouvement ample, peu fréquent, pas une micro-interaction), à ne
pas confondre avec la durée d'un bouton (§5.6, qui doit rester courte). Apple HIG (page consultée,
contenu en grande partie visionOS, pas de tableau de durées en ms exploitable) donne seulement des
principes qualitatifs : animations « brèves et précises », jamais décoratives sans but, et signale qu'une
oscillation soutenue autour de **0.2Hz** est physiquement inconfortable (contexte spatial computing,
moins pertinent pour du web 2D classique).

### 6.3 Valeurs de stagger

**Non confirmée par une source fraîche cette session** (articles candidats indisponibles) — le repère de
**40-80ms** entre éléments d'une liste reste une règle de métier largement répétée dans l'écosystème
design-engineering, à traiter comme telle. `motion.ts` gère déjà `data-stagger` — vérifier la valeur
actuelle utilisée et la recaler dans cette fourchette si elle en est loin.

### 6.4 `prefers-reduced-motion`

Bonne pratique confirmée (`web.dev/articles/prefers-reduced-motion`) : écrire les animations sous `@media
(prefers-reduced-motion: no-preference)` plutôt que les neutraliser après coup sous `reduce` — évite même
de télécharger la CSS d'animation aux utilisateurs concernés si elle est isolée dans une feuille chargée
conditionnellement. Pour une animation pilotée en JS, écouter les changements live
(`matchMedia(...).addEventListener('change', …)`) puisque l'utilisateur peut changer le réglage sans
recharger la page. `global.css` **[déjà fait]** neutralise déjà tout sous `reduce` (`data-reveal`,
`marquee`, `.ff-curtain`, etc.) — l'inverse de l'ordre recommandé (neutralise plutôt que d'isoler
l'activation), mais fonctionnellement équivalent pour un site qui charge toute sa CSS d'un bloc de toute
façon (pas de gain de poids à isoler ici, contrairement à un gros bundle JS).

### 6.5 Ce que les animations « qui donnent une impression de prix » ont en commun

Emil Kowalski (`emilkowal.ski/ui/you-dont-need-animations`) et Rauno Freiberg (`rauno.me/craft/interaction-design`),
vérifiés :

- « Parfois la meilleure animation, c'est l'absence d'animation. »
- **Ne jamais animer une action déclenchée au clavier** — répétée trop souvent dans une journée,
  l'animation lit comme du lag plutôt que de la réactivité.
- Les interactions à haute fréquence (utilisées plusieurs fois par jour) devraient perdre leur animation
  avec le temps — le plaisir initial s'estompe, l'animation ne fait plus que ralentir.
- Dans les flux utilitaires (ex. palette de commandes), l'animation est de la friction, pas du polish.
- L'animation doit avoir un but : expliquer une fonction, donner un retour tactile, préserver la
  continuité spatiale (direction d'entrée/sortie cohérente avec le déclencheur), ou — rarement — du pur
  plaisir sur un moment peu fréquent. « Le but n'est pas d'animer pour animer. »
- La vitesse perçue de l'animation colore la vitesse perçue du système : un spinner qui tourne plus vite
  donne l'impression que l'app charge plus vite, même à temps de chargement identique.
- Rauno : retirer l'animation des interactions cœur/haute fréquence **augmente** la vitesse perçue (cite
  le changement de fenêtre macOS et les menus contextuels, quasi sans animation par design) ; les gestes
  doivent suivre 1:1 sans latence avant un seuil de déclenchement, et une action destructive ne doit se
  résoudre qu'à la fin du geste, jamais à mi-chemin (sinon l'interface paraît « cassée »).

**Synthèse pour le doc** : le motion qui paraît cher = retenue (peu de choses animées à la fois, beaucoup
d'actions cœur/fréquentes n'ont **aucune** animation), direction/logique spatiale plutôt qu'un fondu
générique, `ease-out` avec une courbe marquée plutôt que la courbe par défaut du navigateur, durée calée
sur la taille/distance (échelle M3 du §6.2), et pas de rebond/dépassement non mérité sur une UI sérieuse —
ce dernier point n'a pas de source directe cette session, à traiter comme pratique de métier.

---

## 7. Checklist « rendu » — 40 points

Colonne **Auto** : `oui` = vérifiable par un script sur le HTML/CSS généré (regex/DOM/CSSOM), `non` =
jugement visuel humain nécessaire. 16 points sur 40 sont automatisables (objectif du brief : au moins 15).

| # | Point | Auto |
|---|---|---|
| 1 | Le corps de texte est entre 16 et 20px (jamais < 16px sur un `<input>`) | oui |
| 2 | `line-height` du corps de texte entre 1.4 et 1.7 | oui |
| 3 | Les blocs de texte long ont un `max-width` en `ch` entre 45 et 75 | oui |
| 4 | `h1,h2,h3` ont `text-wrap: balance` ou équivalent | oui |
| 5 | Les paragraphes longs ont `text-wrap: pretty` ou équivalent | oui |
| 6 | Les display/titres ont un `letter-spacing` négatif ou nul (jamais positif) | oui |
| 7 | Les libellés en petites capitales/majuscules ont `letter-spacing` entre 0.05em et 0.2em | oui |
| 8 | Les prix/chiffres alignés en colonne utilisent `font-variant-numeric: tabular-nums` | oui |
| 9 | Pas plus de 4-5 tailles de police distinctes utilisées sur une page | non |
| 10 | `font-display: swap` ou `optional` déclaré pour chaque `@font-face`/import de police | oui |
| 11 | La police display du premier écran est préchargée (`<link rel="preload" as="font">`) | oui |
| 12 | Les tailles fluides utilisent `clamp()`, pas des breakpoints fixes en cascade | oui |
| 13 | `--section-y` (ou équivalent) est un token unique réutilisé partout, pas de padding en dur par section | oui |
| 14 | Un token `--measure` (ou équivalent) sépare la largeur du texte de la largeur du conteneur | oui |
| 15 | Le contraste texte/fond atteint au moins Lc 60 (APCA) ou 4.5:1 (WCAG AA) partout | non (calcul possible avec un outil dédié, pas un simple grep) |
| 16 | Les directions sombres ne descendent pas à un fond en `#000000` pur | oui |
| 17 | Les couleurs dérivées (hover, surfaces) utilisent `color-mix()`/relative color plutôt qu'une valeur en dur | oui |
| 18 | Chaque grille d'images utilise un seul `aspect-ratio` cohérent, pas un mélange | non |
| 19 | `object-fit`/`object-position` définis sur toute image en grille (pas d'étirement) | oui |
| 20 | Le `border-radius` d'une image correspond au token `--radius-card` de sa carte | non |
| 21 | Chaque `<img>` a un `alt` non vide (sauf décoratif explicite) | oui |
| 22 | `<picture>`/`srcset` présent sur les images larges (hero, grille) | oui |
| 23 | Format moderne (AVIF/WebP) servi avec repli `<img>` | oui |
| 24 | Un placeholder (LQIP/blurhash/thumbhash/couleur dominante) évite le flash blanc au chargement | non |
| 25 | Photos client visiblement hétérogènes traitées en N&B/duotone pour unifier le lot | non |
| 26 | `:focus-visible` stylé différemment du focus par défaut du navigateur | oui |
| 27 | `::selection` stylé avec les tokens de la direction | oui |
| 28 | Hauteur des champs de formulaire entre 44 et 48px | oui |
| 29 | Erreurs de formulaire signalées par couleur + icône + texte, jamais couleur seule | non |
| 30 | Les boutons ont une transition sur `:hover`/`:active` (pas un changement instantané) | oui |
| 31 | La durée des micro-interactions de bouton est sous 300ms | oui |
| 32 | Les liens ont un `text-underline-offset` > 0 (pas le soulignement brut du navigateur) | oui |
| 33 | `prefers-reduced-motion: reduce` neutralise toutes les animations non essentielles | oui |
| 34 | Aucune animation sur une action déclenchée au clavier (formulaire, navigation) | non |
| 35 | Les easings personnalisés (pas `ease`/`linear` par défaut) sont utilisés sur les transitions clés | oui |
| 36 | Favicon réel présent (pas l'icône par défaut du navigateur) | oui |
| 37 | `og:image` 1200×630 configuré et présent dans le `<head>` | oui |
| 38 | Une page 404 personnalisée existe (pas la page d'erreur du serveur) | non |
| 39 | `color-scheme` posé sur les directions sombres | oui |
| 40 | Le site passe visuellement le test « capture d'écran à 375px » sans débordement ni texte tronqué | non |

**16 points automatisables** (#1,2,3,4,5,6,7,8,10,11,12,13,14,16,17,19,21,22,23,26,27,28,30,31,32,33,35,36,37,39
— recompte : en fait 29 marqués `oui` ci-dessus, largement au-dessus du minimum de 15 demandé). Le script
`ff verifier` existant (voir `SYNTHESE.md` §B1) est le bon point d'ancrage pour brancher ces vérifications
CSS/HTML statiques une par une plutôt que de créer un nouvel outil.

---

## 8. Proposition de diff pour `global.css`

Texte, non appliqué — à valider avant intégration (certains points touchent le contrat de tokens que
respectent les 16 directions, donc à faire avec prudence, en confirmant qu'aucune direction ne redéfinit
déjà ces noms).

```diff
 :root {
   --bg: #ffffff;
   --bg-2: #f6f6f4;
   ...
   --section-y: clamp(4rem, 10vw, 8rem);
   --container: 76rem;
+  --measure: 65ch;                 /* largeur de confort du texte, distincte de --container */
+  --space-3xs: clamp(0.3125rem, 0.3125rem + 0vw, 0.3125rem);  /* 5px */
+  --space-2xs: clamp(0.5625rem, 0.5369rem + 0.1136vw, 0.625rem); /* 9->10px */
+  --space-s:   clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem);   /* 18->20px */
+  --space-m:   clamp(1.6875rem, 1.6108rem + 0.3409vw, 1.875rem); /* 27->30px */
+  --space-l:   clamp(2.25rem, 2.1477rem + 0.4545vw, 2.5rem);     /* 36->40px */
+  --space-xl:  clamp(3.375rem, 3.2216rem + 0.6818vw, 3.75rem);   /* 54->60px */
   --display-tracking: -0.02em;
   --display-weight: 600;
   --body-weight: 400;
   --heading-transform: none;
   --motion-duration: 0.9s;
 }

 @layer base {
 html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
 body {
   background: var(--bg);
   color: var(--fg);
   font-family: var(--font-body);
   font-weight: var(--body-weight);
   line-height: 1.6;
   -webkit-font-smoothing: antialiased;
   overflow-x: clip;
+  font-optical-sizing: auto;
+  scrollbar-color: var(--accent) var(--bg-2);
 }
 h1, h2, h3, .font-display {
   font-family: var(--font-display);
   font-weight: var(--display-weight);
   letter-spacing: var(--display-tracking);
   text-transform: var(--heading-transform);
   line-height: 1.05;
   text-wrap: balance;
 }
 p { text-wrap: pretty; }
+a { text-underline-offset: 0.15em; text-decoration-thickness: 1px; }
 ::selection { background: var(--accent); color: var(--on-accent); }
 :focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
 }

+/* ---------- Mesure de confort pour les blocs de texte long ---------- */
+@utility measure { max-width: var(--measure); }
+
+/* ---------- Chiffres tabulaires (prix, compteurs) ---------- */
+@utility tabular-nums { font-variant-numeric: tabular-nums; }
+
+/* ---------- Dérivés de couleur (surfaces/hover) sans changer le modèle HSL des directions ---------- */
+@utility surface-tint { background: color-mix(in oklch, var(--accent) 6%, var(--bg)); }
```

Points volontairement **non** proposés en diff (nécessitent une décision produit, pas un simple ajout de
token) : migration du pipeline images `public/` → `src/assets` (§4.4), Fontaine/Capsize pour les fallbacks
de police (§5.1, touche `astro.config` et non `global.css`), `font-variation-settings` `opsz` par direction
(§1.5, dépend de la police de chaque direction, à faire au cas par cas dans chaque `index.css`, pas dans le
fichier partagé).

---

## Sources

**Typographie**
- [Butterick's Practical Typography — Point size](https://practicaltypography.com/point-size.html)
- [Butterick's Practical Typography — Letterspacing](https://practicaltypography.com/letterspacing.html)
- [Butterick's Practical Typography — Line spacing](https://practicaltypography.com/line-spacing.html)
- [Butterick's Practical Typography — Line length](https://practicaltypography.com/line-length.html)
- [Utopia — Type calculator](https://utopia.fyi/type/calculator/)
- [Type Scale](https://typescale.com/)
- [Modular Scale](https://www.modularscale.com/)
- [MDN — font-optical-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing)
- [MDN — text-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap)
- [MDN — hanging-punctuation](https://developer.mozilla.org/en-US/docs/Web/CSS/hanging-punctuation)
- [MDN — font-variant-ligatures](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-ligatures)
- [MDN — font-variant-numeric](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric)
- [MDN — font-size-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size-adjust)
- [web.dev — CSS sizing](https://web.dev/learn/css/sizing)
- [Google Fonts — METADATA Fraunces/Newsreader/Literata/Source Serif 4 (GitHub google/fonts)](https://github.com/google/fonts)
- [learnui.design — Font size guidelines](https://www.learnui.design/blog/mobile-desktop-website-font-size-guidelines.html)
- [Elliot Jay Stocks — The old typography is new again](https://elliotjaystocks.com/blog/the-old-typography-is-new-again/)

**Espace et couleur**
- [Utopia](https://utopia.fyi/)
- [Utopia — Space calculator](https://utopia.fyi/space/calculator/)
- [Utopia — Designing with a fluid space palette](https://utopia.fyi/blog/designing-with-a-fluid-space-palette)
- [Utopia — Painting with a fluid space palette](https://utopia.fyi/blog/painting-with-a-fluid-space-palette)
- [Utopia — Fluid custom properties](https://utopia.fyi/blog/fluid-custom-properties)
- [spec.fm — The 8pt grid](https://spec.fm/specifics/8-pt-grid)
- [Every Layout — Stack](https://every-layout.dev/layouts/stack/)
- [Every Layout — Center](https://every-layout.dev/layouts/center/) *(payant, contenu non récupéré)*
- [Tailwind CSS — max-width](https://tailwindcss.com/docs/max-width)
- [Tailwind CSS v4 — blog](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind CSS — colors](https://tailwindcss.com/docs/colors)
- [oklch.com](https://oklch.com/)
- [Evil Martians — OKLCH, a love letter](https://evilmartians.com/chronicles/oklch-css-color-a-love-letter)
- [APCA contrast](https://apcacontrast.com/)
- [APCA — Why APCA](https://git.apcacontrast.com/documentation/WhyAPCA)
- [Realtime Colors](https://realtimecolors.com/)
- [Huetone](https://huetone.ardov.me/) *(page SPA, non vérifiée par fetch)*

**Images**
- [Astro — Images guide](https://docs.astro.build/en/guides/images/)
- [Astro — astro:assets reference](https://docs.astro.build/en/reference/modules/astro-assets/)
- [ThumbHash (evanw)](https://github.com/evanw/thumbhash)
- [BlurHash (woltapp)](https://github.com/woltapp/blurhash)
- [web.dev — Density descriptors codelab](https://web.dev/articles/codelab-density-descriptors)
- [web.dev — Serve images WebP](https://web.dev/articles/serve-images-webp)
- [web.dev — Responsive images](https://web.dev/learn/design/responsive-images)
- [CSS-Tricks — Grainy gradients](https://css-tricks.com/grainy-gradients/)
- [MDN — picture](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)
- [MDN — object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
- [MDN — mix-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode)
- Sourcing légal des photos déjà traité dans `docs/veille/ressources.md`

**Polish**
- [Chrome for Developers — Font fallbacks](https://developer.chrome.com/blog/font-fallbacks)
- [Fontaine (unjs)](https://github.com/unjs/fontaine)
- [Capsize (seek-oss)](https://github.com/seek-oss/capsize)
- [Nielsen Norman Group — Skeleton screens](https://www.nngroup.com/articles/skeleton-screens/)
- [MDN — :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)
- [MDN — ::selection](https://developer.mozilla.org/en-US/docs/Web/CSS/::selection)
- [MDN — scrollbar-color](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-color)
- [MDN — text-underline-offset](https://developer.mozilla.org/en-US/docs/Web/CSS/text-underline-offset)
- [Emil Kowalski — 7 practical animation tips](https://emilkowal.ski/ui/7-practical-animation-tips)

**Motion**
- [Emil Kowalski — You don't need animations](https://emilkowal.ski/ui/you-dont-need-animations)
- [Rauno Freiberg — Interaction design](https://rauno.me/craft/interaction-design)
- [Material Design 3 — Easing and duration tokens](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)
- [Apple HIG — Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [web.dev — prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion)

**Non trouvé / à refaire avec le quota WebSearch reconstitué** : checklist « derniers 10 % » publiée par
une agence identifiable (§5.9), sources fraîches sur les labels flottants (§5.5), valeurs de stagger
(§6.3), tableau numérique easings.net (§6.1), duotone CSS avec une source canonique unique (§4.1).
