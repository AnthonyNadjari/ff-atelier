# Veille — la couleur

Objet : comprendre ce qui distingue une palette **composée** (choisie, empruntée, irrégulière) d'une
palette **générée** (un fond, un texte, une ligne, un accent décliné par calcul), et en tirer des
règles applicables à nos 17 directions. Relevés faits les 21-22 septembre 2026.

Sommaire : §1 espaces colorimétriques · §2 systèmes de couleur non générés · §3 contraste au-delà de
WCAG 2 · §4 relevé de 15 sites primés (valeurs réelles) · §5 synthèse et verdict sur nos directions ·
§6 sources.

---

## 1. Espaces colorimétriques — ce que OKLCH change vraiment

**Le défaut de HSL.** Le `L` de HSL ne prédit ni la luminance affichée ni la perception. À `L=50%`,
`S=100%` : `hsl(60 100% 50%)` (jaune) a une luminance relative d'environ **0,94** — à six points du
blanc pur — quand `hsl(240 100% 50%)` (bleu) est à environ **0,44**, moins de la moitié. Conséquence
directe chez nous : `calc(var(--accent-l) - 8%)` ne produit pas le même pas perceptuel selon que
l'accent est un orange, un bleu ou un jaune. C'est le cœur de l'argument d'Evil Martians
([oklch-in-css-why-quit-rgb-hsl](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)).

**Dégradés qui virent au gris.** Un `linear-gradient` interpolé en sRGB entre deux teintes vives
traverse une zone désaturée au milieu (les canaux R/G/B sont interpolés séparément). En Lab, c'est
une dérive bleu-violet parasite. OKLab, construit par optimisation numérique sur un jeu de données de
similarité perceptuelle (Björn Ottosson, 2020), corrige les deux. Le bug classique de LCH
non-OK — un bleu qui vire au violet quand on baisse sa chroma de 110 à 40 à teinte constante —
disparaît aussi.

**Syntaxe utile (CSS Color 4/5).**

```css
oklch(L C H / A)                      /* L : 0–1 ou 0–100%, C : 0–0,4 environ, H : degrés */
color(display-p3 r g b)               /* composantes 0.0–1.0 */
color-mix(in oklab, var(--a), var(--b) 40%)
oklch(from var(--accent) calc(l - 0.08) c h)   /* couleur relative : pas perceptuel constant */
light-dark(oklch(43.7% .075 224), oklch(89.2% .069 224))  /* exige color-scheme: light dark */
linear-gradient(in oklch, var(--accent), var(--accent-2)) /* interpolation perceptuelle */
```

**Support en 2026.** `oklch()`/`oklab()` : Baseline « widely available » depuis mai 2023 (Chrome/Edge
119+, Firefox 113+, Safari 16.4+). `color-mix()` : Baseline 2023 (Chrome 111+, Firefox 113+,
Safari 16.2+). `light-dark()` : Baseline « newly available » mai 2024. Syntaxe de couleur relative :
supportée par tous les moteurs majeurs début 2026.

**Repli.** Deux formes, la seconde est celle qu'on utilise ici (elle permet de garder le contrat de
tokens intact dans la déclaration de base) :

```css
.el { background: #2563eb; background: oklch(60% 0.2 255); }   /* repli par surcharge */

@supports (color: oklch(from white l c h)) {                    /* repli par @supports */
  .el { background: oklch(from var(--accent) calc(l - 0.08) c h); }
}
```

**Gamme P3.** Le volume de gamme en unités Lab de la spec CSS Color 4 : sRGB = 0,820,
display-p3 = 1,233 (environ 1,5×), rec2020 = 2,042. `@media (color-gamut: p3)` est Baseline depuis
février 2023. Concerne surtout les écrans Apple récents et le haut de gamme Android. **Verdict pour
nous : pas maintenant.** Nos palettes sont des beiges, des bruns, des bleu-nuit et des gris — aucune
n'est bloquée par la limite sRGB. Le P3 se justifie pour un vert ou un orange fluo, pas pour un
vert-de-gris de zinc. On note la technique, on ne la déploie pas.

---

## 2. Systèmes de couleur qui ne sont PAS des échelles générées

### Radix Colors — 12 pas, 12 rôles nommés

Chaque pas d'une échelle Radix a un **rôle nommé**, pas un numéro : 1-2 fond d'app et fond discret,
3-5 fond de composant (normal / survol / pressé), 6-8 bordures (discrète → marquée), 9-10 « solid »
(le pas 9 est décrit comme *« the purest step, the step mixed with the least amount of white or
black »*), 11-12 texte (contraste bas puis haut). Les pas 11 et 12 sont garantis à **APCA Lc 60 et
Lc 90** contre le pas 2 de la même échelle.

**La preuve que l'échelle n'est pas interpolée** : luminosités HSL des 12 pas du gris pur (#FCFCFC …
#202020) : 98,8 / 97,6 / 94,1 / 90,6 / 87,8 / 85,1 / 80,8 / 73,3 / 55,3 / 51,4 / 39,2 / 12,5.
Écarts successifs : 1,2 · 3,5 · 3,5 · 2,8 · 2,7 · 4,3 · 7,5 · **18,0** · 3,9 · **12,2** · **26,7**.
Les trois sauts énormes tombent exactement aux frontières sémantiques (bordure → solid entre 8 et 9,
texte bas → haut contraste entre 11 et 12). **Une échelle générée n'a pas de sauts à cet endroit-là,
parce qu'elle ne sait pas où sont les frontières.**

Autres points : Radix propose **six gris** (gray, mauve, slate, sage, olive, sand) et un tableau
d'appariements « naturels » (Mauve ↔ rouges/roses/violets, Slate ↔ bleus/cyans, Sage ↔ verts,
Olive ↔ verts-jaunes, Sand ↔ jaunes/ambres/bruns) : le gris est choisi **en fonction de l'accent**,
jamais neutre par défaut. Le dark mode n'est pas une inversion, c'est un mapping échelle par échelle.

### Open Color

Quatre principes affichés, dont : *« at the same brightness level, the perceived brightness will be
constant »*. 13 familles × 10 pas. Les « gris » ne sont pas neutres : `oc-gray-0` = #f8f9fa
(R248/G249/**B250**) et `oc-gray-9` = #212529 (R33/G37/**B41**) — B > G > R sur toute l'échelle, un
biais froid constant et mesurable. La saturation n'est pas constante non plus : sur l'échelle rouge,
`oc-red-0` #fff5f5 ≈ S 2 %, `oc-red-5` #ff6b6b ≈ S 41 %, `oc-red-9` #c92a2a ≈ S 65 %.

### Tailwind v4 — le contre-exemple utile

La palette par défaut (11 pas, 50→950) est reconstruite en OKLCH : teinte tenue constante par
famille, chroma réduite jusqu'à la limite du gamut sRGB plutôt que clippée, lightness calée pour que
le même numéro corresponde à la même luminosité perçue d'une famille à l'autre. Techniquement
excellent — et c'est précisément le problème. La critique dominante
([opentailwind.dev](https://opentailwind.dev/blog/why-tailwind-sites-look-the-same/)) :
*« the framework isn't the problem — the lack of intentional design decisions is »*. `slate-800`,
`indigo-600`, `gray-500` sont si bien calibrés que personne ne les change.

### Stripe et Linear — ce qu'ils font d'inhabituel

**Stripe** travaille en **CIELAB**, pas en OKLCH (antérieur). Règle chiffrée publiée : deux couleurs
doivent être séparées d'au moins **5 niveaux** d'échelle pour du petit texte, **4 niveaux** pour
icônes et grand texte. Ils refusent d'éclaircir/assombrir en RGB (*« simply darkening or lightening
can result in dull or muted colors »*). Découverte notable : certaines combinaisons sont
physiquement hors gamut — *« there's no such thing as "very colorful dark yellow" »* — ce qui a
contraint la palette plutôt que de viser des cibles inatteignables. Relevé sur le site : blurple
#635bff, navy #0a2540, texte #425466, et un système décoratif multi-teintes (jaune #ffd601, magenta
#ee30fb, orange #ff6118, vert #00d66f).

**Linear** travaille en **LCH** et a réduit son thème de **98 variables à 3** (couleur de base,
couleur d'accent, contraste). Choix esthétique explicite : limiter le bleu injecté dans les calculs
pour un rendu « plus neutre et intemporel » — pas un gris neutre au sens Material. Relevé réel de
leurs quatre niveaux de fond, tous teintés froid avec un écart B−R constant de 2 points :
`#08090a` (L 4) → `#0f1011` (L 6) → `#141516` (L 8) → `#191a1b` (L 10). Écart total sur quatre
niveaux : **6 points de luminosité**. Marque violette #5e6ad2 / #7170ff / #828fff réutilisée pour
marque + liens + accent, plus trois couleurs de statut séparées (#56cdff, #ff7236, #f34f52).

### Le contre-argument, à garder en tête

Matt Ström-Awn soutient que la sélection manuelle est *« practically impossible »* à l'échelle d'un
design system multi-thèmes, et que la formule outille le jugement plutôt qu'elle ne le remplace.
C'est juste — pour un produit à 40 composants et 6 thèmes. Nous faisons 17 palettes fixes de 11
tokens : le coût du choix à la main est dérisoire, le gain de singularité est tout le produit.

---

## 3. Le contraste au-delà de WCAG 2

**APCA** (Myndex / Andrew Somers) rend un score **Lc** sur une échelle ~0 à ±106, pas un ratio, et
il est **polarisé** : Lc positif = texte plus sombre que le fond, Lc négatif = l'inverse. La
perception du contraste n'est pas symétrique (Helmholtz-Kohlrausch, adaptation de l'œil), ce que
WCAG 2 ignore entièrement — d'où sa mauvaise prédiction en mode sombre. Table de référence :

| Lc | usage |
|---|---|
| 90 | corps de texte préféré, ≥ 14 px / 400 |
| 75 | minimum corps de texte, ≥ 18 px / 400 |
| 60 | texte qu'on veut faire lire, ≈ 24 px / 400 ou 16 px / 700 |
| 45 | grand texte / titres, ≈ 36 px / 400 ou 24 px / 700 |
| 30 | désactivé, placeholder |
| 15 | élément non-texte différenciable |

**Les critiques de 4,5:1.** La formule `(L1+0,05)/(L2+0,05)` a été calibrée pour du noir/blanc pur.
Elle **surestime** le contraste sous environ #aaa (deux gris sombres passent 4,5:1 en étant
illisibles — problème direct du dark mode) et produit des **faux négatifs** sur du texte sombre sur
fond clair. Exemple cité par Myndex : noir sur bleu ciel #72C0FC donne 10,7:1 en WCAG 2, environ
4,2:1 en contraste perceptuel réel. Contesté au W3C depuis avril 2019 (w3c/wcag#695, puis
w3c/wcag3#192).

**Où en est WCAG 3 en 2026.** Toujours Working Draft (Editor's Draft du 8 avril 2026), pas de
Recommendation attendue avant ~2029-2030. Le contraste visuel a été **retiré du texte normatif en
juillet 2023** : APCA n'a jamais obtenu le consensus du groupe de travail. Le draft dit :
*« The contrast algorithm used in WCAG 3 is yet to be determined. »*

**Conséquence pour l'atelier.** RGAA, EN 301 549 et l'European Accessibility Act sont tous ancrés sur
**WCAG 2.1 AA**. C'est ce qui nous engage devant un client. `ff couleur` calcule donc le ratio
WCAG 2.1, pas le Lc APCA — APCA reste un raffinement de lisibilité qu'on consulte à la main sur
[oklch.com](https://oklch.com) ou [apcacontrast.com](https://apcacontrast.com), pas un critère de
livraison. Bridge-PCA existe pour traduire APCA vers les seuils familiers, à surveiller.

**La formule exacte réimplémentée dans `scripts/ff/couleur.mjs`** (w3.org/TR/WCAG21/relative-luminance) :
linéarisation sRGB au seuil **0,04045** avec exposant **2,4** (`c/12,92` en dessous), coefficients
**0,2126 / 0,7152 / 0,0722**, ratio `(Lclair + 0,05) / (Lsombre + 0,05)`, de 1:1 à 21:1.

**Trois seuils, pas un.** 4,5:1 texte courant · 3:1 grand texte (≥ 24 px, ou ≥ 18,66 px gras) · 3:1
composants d'interface et indicateurs d'état (WCAG 1.4.11). Un **filet décoratif de carte n'est pas
un composant d'interface** : il double une frontière déjà visible et n'a pas de seuil WCAG. Nos
`--line` tiennent entre 1,23:1 (clair) et 1,43:1 (atelier) — c'est normal, et c'est aussi le cas chez
Radix (pas 6-8). `ff couleur` les mesure sans les sanctionner ; `--strict` les promeut à 3:1.

---

## 4. Relevé de 15 sites primés — valeurs réelles extraites du CSS servi

Méthode : `curl` sur la page, extraction des `<link rel=stylesheet>` et des `<style>` inline, fetch
des chunks CSS, parsing des variables et des couleurs littérales. Aucune valeur devinée.

> Note de lecture : pour un fond quasi-blanc ou quasi-noir, le **%S de HSL explose artificiellement**
> (artefact du modèle près de L=0 et L=100). L'écart RVB brut entre canaux est la mesure fiable.
> `#fef5f9` affiche S=82 % pour un écart réel de 9 points.

| Site | Fond | Fond 2 | Accent(s) | Teintes | Fond neutre ? | ΔL fond→fond 2 |
|---|---|---|---|---|---|---|
| obys.agency | `#fff` | — | — | 0 | pur (0) | — |
| locomotive.ca | `#fff` | `#312DFB` / `#DA382E` (bascule) | thème seul | 2 | pur (0) | 100 |
| basement.studio | `#000` | `#171717` | `#ff4d00` | 1 | pur (0) | 9 |
| darkroom.engineering | `#fff` ⇄ `#000` | `#e5e5e5` / `#262626` | `#e71419`, `#00d9ff` | 2 | pur (0) | 100 |
| goodside.studio | `#fff` | `#d9d9d9` | `#ffffd0` (menu mobile seul) | 1 | pur (0) | 15 |
| boc.studio | `#181d21` | `#111314` | `#ff4421` (+ `#b53219` statut) | 1 | **teinté bleu (9)** | 4 |
| sedlecky-kaolin.com | `#fff` | `#f0e1d0` | `#886e52`, `#3b41b4` / `#0b5cb9` | 2 | pur (0) | 12 |
| maisonauge.com | `#fef5f9` | — | `#dccbc3`, texte `#222a36` | 2-3 | **teinté rose (9)** | — |
| driessenarchitectuur.nl | `#fff` | `#faf6f2` | `#719067` (vert sauge) | 2 | pur (0) | 4 |
| trionn.com | `#040508` | `#111214` (lit comme ligne) | `#d9432b` / `#ff4b2f` / `#ff6b50` | 1 | **teinté bleu (4)** | 3 |
| linear.app | `#08090a` | `#0f1011` → `#191a1b` | `#5e6ad2` + 3 statuts | 4 | **teinté bleu (2)** | 2 par niveau |
| stripe.com | `#f8fafd` | `#061b31` (sections) | `#635bff` + 4 décoratives | 6 | **teinté bleu (5)** | 87 |
| emotion-agency.com | `#fff` | — | `#9047ff`, `#226d7a`, statuts | 4 | pur (0) | — |
| this.design | `#f2f2f0` | `#2b2b2b` | `#19f` | 1 | teinté marginal (2) | 78 |
| kommakomma.is | `#131313` | `#1f1f1f` / `#363636` | `#eb4b3d` | 1 | pur (0) | 5 |

**Ce que ça dit.**

1. **9 sites sur 15 ont un fond neutre pur** (R=G=B strict). Le fond teinté n'est donc *pas* le
   marqueur du site primé. Ce qui l'est : quand il est teinté, l'écart reste **entre 2 et 9 points
   RVB** — jamais un fond franchement coloré. C'est un soupçon, pas une couleur.
2. **Médiane de 1 à 2 teintes distinctes par site**, moyenne ≈ 2. Les studios créatifs purs (obys,
   basement, goodside, kommakomma) tiennent sur **0 ou 1 teinte**. Seuls les design systems produit
   (linear 4, stripe 6, emotion 4) empilent des teintes sémantiques.
3. **L'accent sert à une seule chose sur la moitié des sites** (basement, goodside, driessen,
   kommakomma, this.design, locomotive) — rare, saturé, jamais un système. Sur l'autre moitié il
   cumule marque + lien + statut, et ce sont les sites « produit ».
4. **Les écarts de luminosité fond → fond secondaire ne sont jamais réguliers** : 2 points chez
   Linear (empilement fin de surfaces), 9 chez basement, 15 chez goodside, 78-100 chez ceux qui
   basculent de section complète. Personne n'a un pas constant.
5. Chez les teintés, **le bleu froid domine largement** (boc, trionn, linear, stripe, this.design) ;
   maisonauge est la seule exception en rose.

---

## 5. Synthèse

### (a) Ce qui distingue une palette composée d'une palette générée

| | Générée | Composée |
|---|---|---|
| Fond | neutre pur (R=G=B) ou teinté par formule | neutre pur **ou** teinté de 2 à 9 points RVB, choisi |
| Nombre de teintes | 1, déclinée | 1 à 2, **non voisines** (violet + cyan, terracotta + mer) |
| Second accent | `calc(--accent-l − 8%)` | couleur empruntée, hex écrit à la main, **un seul emploi** |
| Écarts de luminosité | constants (le même pas partout) | irréguliers, les sauts tombent aux frontières de rôle (Radix : 1,2 → 18,0 → 26,7) |
| Emploi de l'accent | partout (eyebrow, em, bouton, filet, focus) | une chose nommée ; les autres rôles prennent `--fg` |
| Gris | neutre plaqué | teinté par l'accent (Radix : 6 gris appariés ; Open Color : B > G > R constant) |
| Justification | aucune, ou « ça va bien ensemble » | une matière, un objet, un métier — nommable en une phrase |

Le test en une question : **d'où vient cette couleur ?** Une palette générée ne peut répondre que
« de la précédente, moins 8 % ». Une palette composée répond « du vert-de-gris d'un zinc de toiture ».

### (b) Nos 17 directions — verdict

Mesures faites par `scripts/ff/couleur.mjs` sur les valeurs réellement résolues. « écart RVB » = max
− min des canaux de `--bg` (0 = neutre pur). « ΔL » = luminosité HSL `--bg` moins `--bg-2`.
« teintes » = tokens de couleur à S > 18 % de teintes distinctes.

| Direction | Teintes | Fond (écart RVB) | ΔL bg→bg-2 | `--accent-2` | Accent sert à | Verdict |
|---|---|---|---|---|---|---|
| **atelier** | 1 (orange 22°) | #faf7f2 — teinté (8) | 4,7 | `calc(l − 8 %)` | em + eyebrow + bouton | **générée** (fond sauvé) |
| **brut** | 1 (jaune 48°) | #ffffff — **neutre pur (0)** | 5,9 | `calc(l − 10 %)` | surlignage em + selection | **générée** |
| **clair** | 1 (bleu 220°) | #ffffff — **neutre pur (0)** | 2,9 | `calc(l − 10 %)` | em + eyebrow + bouton + glow + focus (5×) | **générée** |
| **eclipse** | 0 (monochrome assumé) | #0a0b0d — teinté (3) | 2,7 | fixé à L 88 % | filets et survols seuls | **composée** |
| **encre** | 2 (papier 45° / vermillon 10°) | #fdfcf9 — teinté (4) | 4,7 | hex main, autre teinte | vermillon = em + eyebrow + selection | **composée** |
| **industriel** | 1 (orange 24°) | #e9e9e7 — teinté (2) | 5,3 | `calc(l − 8 %)` | em + bouton + carte + filet (6×) | **générée** (accent emprunté) |
| **journal** | 1 (rouge 355°) | #f7f5f0 — teinté (7) | 4,5 | `calc(l − 10 %)` | em + eyebrow + bouton | **générée** |
| **luxe** | 1 (or 42°) | #0e0d0c — teinté (2) | 2,0 | `calc(l − 12 %)` | em + bouton + filet + lueur (6×) | mi-chemin — **validée, intouchable** |
| **mediterranee** | 2 (terracotta 14° / mer 200°) | #fbf6ee — teinté (13) | 6,9 | hex main, autre teinte | mer = em + eyebrow + fantôme | **composée** |
| **neon** | 2 (violet 265° / cyan 190°) | #07070b — teinté (4) | 2,5 | hex main, autre teinte | dégradé em + halo | **composée** |
| **nordique** | 1 (teal 176°) | #fbfbfa — quasi neutre (1) | 3,7 | même H/S, L fixée | em + bouton + fantôme + focus (5×) | **générée** |
| **nuit** | 2 (nuit 220° / ambre 36°) | #0b1220 — **teinté (21)** | 4,1 | `calc(l − 12 %)` | em + eyebrow + bouton (6×) | mi-chemin |
| **pierre** | 0 saturée (accent = brun S 8 %) | #f2f1ee — teinté (4) | 4,5 | même H/S, L 35 % | em + bouton — mais invisible | **générée** |
| **pop** | 2 (rose 350° / teal 175°) | #fffdf7 — teinté (8) | 6,5 | hex main, autre teinte | teal = em + ombres portées | **composée** |
| **retro** | 2 voisines (orange 22° / moutarde 42°) | #f6ead8 — **teinté (30)** | 6,1 | hex main | em + soleil + double filet | mi-chemin (palette bannie §2 skills-design-ia) |
| **signal** | 1 (rouge 8°) | #ffffff — **neutre pur (0)** | 3,1 | `calc(l − 10 %)` **et `--ink` = `calc(l − 18 %)`** | tout, y compris le noir de la page | **générée — la pire** |
| **terre** | 2 (vert 120° / ocre 38°) | #f4f1ea — teinté (10) | 6,1 | hex main, autre teinte | ocre = em + selection + halo | **composée** (palette bannie) |

Bilan : **7 générées** (atelier, brut, clair, industriel, journal, nordique, pierre, signal — 8 en
comptant signal), **6 composées** (eclipse, encre, mediterranee, neon, pop, terre), **3 à mi-chemin**
(luxe, nuit, retro).

### (c) Priorités de retouche

**Les six à retoucher, dans l'ordre :**

1. **signal** — fond blanc pur, gris neutres purs sur toute la ligne (#f7f7f7, #5a5a5a, #e5e5e5), et
   `--ink` lui-même calculé depuis l'accent. Trois tokens dérivés d'un seul HSL : c'est la
   définition du générateur.
2. **brut** — fond et fond-2 parfaitement neutres, une teinte, `--accent-2` calculé. En prime, un
   vrai bug : l'anneau de focus (`outline: 2px solid var(--accent)`, `global.css`) est un jaune à
   **1,51:1 sur blanc** — invisible au clavier.
3. **clair** — le plus proche du défaut Tailwind (blanc pur + `slate-50` + `blue-600`), accent
   employé cinq fois, ΔL de 2,9 le plus faible des directions claires.
4. **nordique** — fond quasi neutre (écart 1), `--accent-2` = même teinte et même saturation à L
   fixée, accent employé cinq fois. Rien n'y est emprunté.
5. **pierre** — l'accent est un brun désaturé à S 8 % : ce n'est pas une couleur, c'est un deuxième
   texte. La direction n'a aucune teinte réelle et les `h1 em` y sont invisibles.
6. **journal** — accent #b1253a et fond #f7f5f0 tombent tous deux dans la palette bannie par
   Impeccable et taste-skill (crème + brique, hex bannis #f5f1ea et #9a2436, voir
   `docs/veille/skills-design-ia.md` §2 règle 3).

**Juste derrière, non retouchées cette fois** (plafond de six) : `atelier` (même profil que journal
mais c'est la direction de référence du dépôt, on y touchera séparément), `industriel` (mécanique
générée, mais son orange sécurité est déjà une couleur empruntée au métier), `retro` et `terre`
(composées, mais dans la palette crème/ocre bannie). `luxe` et `eclipse` sont validées par le
fondateur : hors périmètre.

**Deux corrections de contraste hors périmètre de composition**, imposées par `ff couleur` :
`brut` (anneau de focus, 1,51:1) et `terre` (`::selection` : crème sur ocre, **2,63:1**).

---

## 6. Sources

**Espaces colorimétriques**
1. https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
2. https://evilmartians.com/chronicles/exploring-the-oklch-ecosystem-and-its-tools
3. https://evilmartians.com/chronicles/oklch-a-color-picker-made-to-help-think-perceptively
4. https://evilmartians.com/opensource/oklch-color-picker
5. https://evilmartians.com/chronicles/better-dynamic-themes-in-tailwind-with-oklch-color-magic
6. https://web.dev/articles/baseline-in-action-color-theme
7. https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
8. https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark
9. https://developer.mozilla.org/en-US/docs/Web/CSS/@media/color-gamut
10. https://www.w3.org/TR/css-color-4/#predefined-display-p3
11. https://dev.to/ivan_kulkin_1522025957eee/why-oklch-css-variables-need-supports-for-a-real-fallback-2fgp

**Systèmes de couleur**
12. https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
13. https://www.radix-ui.com/colors/docs/palette-composition/composing-a-palette
14. https://www.radix-ui.com/colors/docs/palette-composition/scales
15. https://github.com/radix-ui/colors/issues/20
16. https://yeun.github.io/open-color/
17. https://github.com/yeun/open-color/blob/master/README.md
18. https://github.com/yeun/open-color/blob/master/open-color.css
19. https://opentailwind.dev/blog/why-tailwind-sites-look-the-same/
20. https://stripe.com/blog/accessible-color-systems
21. https://linear.app/now/how-we-redesigned-the-linear-ui
22. https://mattstromawn.com/writing/generating-color-palettes/

**Contraste**
23. https://git.apcacontrast.com/documentation/APCAeasyIntro.html
24. https://apcacontrast.com/
25. https://github.com/Myndex/SAPC-APCA
26. https://github.com/w3c/wcag3/issues/192
27. https://github.com/Myndex/SAPC-APCA/discussions/58
28. https://adrianroselli.com/2026/04/wcag3-contrast-as-of-april-2026.html
29. https://www.w3.org/TR/WCAG21/relative-luminance.html
30. https://developer.chrome.com/docs/devtools/accessibility/contrast
31. https://www.siegemedia.com/contrast-ratio

**Sites relevés (§4)**
32. https://obys.agency/ · 33. https://locomotive.ca/ · 34. https://basement.studio/ ·
35. https://darkroom.engineering/ · 36. https://goodside.studio/ · 37. https://boc.studio/ ·
38. https://sedlecky-kaolin.com/ · 39. https://maisonauge.com/ · 40. https://driessenarchitectuur.nl/ ·
41. https://trionn.com/ · 42. https://linear.app/ · 43. https://stripe.com/ ·
44. https://emotion-agency.com/ · 45. https://this.design/ · 46. https://kommakomma.is/

**Interne** — `docs/veille/skills-design-ia.md` §2 (règle 3 : palette crème/beige + laiton/ocre
bannie par Impeccable `cream-palette` et taste-skill §4.2 ; règle 5 : jamais de gris générique sur un
fond coloré ; règle 6 : trois seuils de contraste distincts).
