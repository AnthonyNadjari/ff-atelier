# Veille — performance (Core Web Vitals, budget, 100/100 mobile)

Date de la veille : 17 septembre 2026. Contexte : après le correctif du jour, la feuille de style
principale pèse ~105 Ko pour un site dont la police display est Dela Gothic One (fontsource statique,
125 `@font-face` avec sous-ensembles `unicode-range`, seul le latin est réellement téléchargé), GSAP
(chunk paresseux ~70 Ko quand `motion: 'rich'`), images AVIF/WebP pré-générées par sharp. Lighthouse
mobile 94, desktop 100. But : 100/100 mobile + un budget de performance reproductible.

**Méthode** : le quota WebSearch de la session était déjà épuisé (0 requête dépensée par moi, quota
grillé par une session précédente) — confirmé en tentant une recherche, qui a échoué immédiatement.
Toutes les sources externes ci-dessous viennent donc de `WebFetch` direct sur la doc officielle (Astro,
Cloudflare, MDN/web.dev, GitHub). En complément, et c'est la partie la plus fiable : **mesure directe
dans ce repo** — tailles réelles des packages fontsource dans `node_modules`, tailles réelles des CSS
buildés dans `dist/`, contenu des fichiers HTML générés. Les chiffres mesurés localement sont signalés
**[mesuré]** ; ceux qui viennent d'une page non récupérable (404, contenu non trouvé) sont signalés
**[non vérifié cette session]**.

**Lu avant de commencer** : `scripts/vite-ff-look.mjs`, `src/layouts/Base.astro`,
`src/scripts/motion.ts`, `scripts/ff/images.mjs`, `src/components/Img.astro`, `astro.config.mjs`,
`src/lib/fonts.ts`, `src/styles/global.css`.

---

## État mesuré (ligne de base, avant toute action)

**[mesuré]** Build réel de `toits-cie` (`typography: { display: 'delaGothic', body: 'redHat' }`,
`motion: 'rich'`), fichier `dist/toits-cie/_astro/confidentialite.*.css` :

| | Valeur |
|---|---|
| Taille brute | 260 095 o (254 Ko) |
| Gzip | 91 771 o (89,6 Ko) |
| Brotli | 68 816 o (67,2 Ko) |
| `@font-face` (nombre de règles) | 153 |
| Octets occupés par les `@font-face` | 162 613 o = **62,5 % du fichier** |

`@fontsource/dela-gothic-one` seul, à la racine du package : `index.css` (importé aujourd'hui par
`src/lib/fonts.ts` via `pkg: '@fontsource/dela-gothic-one'`) pèse **108,2 Ko à lui seul, pour 123
`@font-face`** (6 sous-ensembles : `latin`, `latin-ext`, `cyrillic`, `greek`, `japanese`,
`vietnamese` — cf. `metadata.json` du package). Le même package expose `latin.css` : **294 octets,
1 seule règle `@font-face`, sans `unicode-range`** (donc valable pour tout le texte, y compris les
accents français é/à/ç/ê qui sont dans la plage Latin-1, incluse par défaut dans le sous-ensemble
"latin" de Google Fonts). C'est la source quasi exclusive du problème : le navigateur ne télécharge
déjà qu'un seul fichier de police (celui que `unicode-range` sélectionne), mais le CSS, lui, embarque
les 122 autres règles pour rien — c'est du poids de fichier, pas du poids de police téléchargée.

Comparaison, un site sans Dela Gothic One (`anna-vidal`, `typography: { display: 'playfair', body:
'instrumentSans' }`, deux polices variables) : CSS buildé = 110 451 o brut / 21 912 o gzip / 17 917 o
brotli, 35 `@font-face` = 12 253 o (11 % du fichier). Le plancher Tailwind + tokens de direction est
donc déjà autour de **90-100 Ko brut / ~18-22 Ko compressé**, même sans le problème de police — c'est
la vraie ligne de base à battre, pas zéro.

**Point de cadrage important pour tout le reste du document** : Cloudflare Pages sert du Brotli
automatiquement (§5). Le chiffre qui compte pour Lighthouse et pour l'utilisateur est le **poids sur
le fil** (67-89 Ko compressé aujourd'hui pour `toits-cie`), pas le poids brut (260 Ko) — mais le poids
brut reste ce qu'il faut regarder pour un budget mesurable sans navigateur (§6), et il conditionne le
temps de compression/décompression et le CPU mobile de bas de gamme.

**[mesuré]** Aucun fichier `_headers` ni `_redirects` n'existe dans le repo (racine, `sites/*/public`,
`scripts/ff*`) — Cloudflare Pages tourne donc uniquement sur ses réglages par défaut. **[mesuré]**
Le HTML buildé (`dist/toits-cie/index.html`) ne contient **aucun** `<link rel="preload">` ni
`<link rel="modulepreload">` — ni pour la police display, ni pour l'image LCP. `fetchpriority="high"`
existe dans `src/components/Img.astro` (prop `priority`) et dans 4 variantes de `Hero/*.astro`, mais
même quand il est posé sur l'`<img>`, ça ne vaut pas un `<link rel=preload>` dans `<head>` (§4).

---

## 1. Polices

### 1.1 Sous-ensembles fontsource : `index.css` vs `latin.css`

Deux familles de packages, deux mécaniques différentes (vérifié dans `node_modules/@fontsource*`) :

- **Statique** (`@fontsource/<font>`, ex. `dela-gothic-one`, `red-hat-display` n'existe qu'en
  variable ici mais `instrument-serif`, `gloock`, `bebas-neue`... sont statiques) : le package expose
  un fichier **par sous-ensemble** à sa racine — `latin.css`, `latin-ext.css`, `cyrillic.css`,
  `greek.css`, `vietnamese.css`, `japanese.css` selon la police — en plus de l'`index.css` qui les
  importe tous. Importer `@fontsource/dela-gothic-one/latin.css` au lieu de
  `@fontsource/dela-gothic-one` (= `index.css` par le champ `main` du `package.json`) donne
  **294 o au lieu de 108,2 Ko**, sans rien changer au rendu pour un site en français (pas de cyrillique
  ni grec ni vietnamien ni japonais).
- **Variable** (`@fontsource-variable/<font>`, la majorité du catalogue `src/lib/fonts.ts`) : pas de
  `latin.css` à la racine. Les fichiers sont `wght.css` (tous les sous-ensembles, un seul par défaut
  variable) et `wght-italic.css`. Mesuré sur `jetbrains-mono` (eyebrow) : `wght.css` = 2,3 Ko pour
  6 sous-ensembles — déjà négligeable, pas la peine d'optimiser plus loin pour les polices
  secondaires/mono. Pour une police display encore en variable (aucune ici, mais utile si le
  catalogue en ajoute), il n'y a pas de raccourci équivalent à `/latin.css` : il faut soit accepter
  les quelques Ko de `wght.css` (souvent minime, cf. JetBrains), soit importer le fichier woff2 latin
  précis (`files/<font>-latin-wght-normal.woff2`) et écrire à la main un `@font-face` minimal.

### 1.2 `unicode-range` : ce qu'il fait vraiment

`unicode-range` ne réduit **pas** le poids du CSS — il dit au navigateur *quand* télécharger *quel*
fichier. Avec `index.css` (tous les sous-ensembles), le navigateur analyse la page, voit qu'elle ne
contient que des caractères latins, et ne télécharge que le fichier `latin`. C'est exactement ce que
décrit le contexte de la tâche (« 125 règles, seul le latin téléchargé ») — et c'est bien pour ça que
le poids de police téléchargée n'était déjà pas le problème. Le problème est le CSS lui-même : 122
règles `@font-face` inutiles, chacune avec ses deux `src: url(...)`, parsées et gardées en mémoire par
le moteur de rendu pour rien. `latin.css` supprime ce bruit à la source en ne livrant que la règle
utile — le navigateur n'a même plus à faire le tri.

### 1.3 Variable vs statique pour la police display

Dela Gothic One n'existe qu'en statique chez Google Fonts (un seul poids, 400) — pas de choix ici.
Mais la règle générale pour tout futur ajout à `src/lib/fonts.ts` : une police statique et sous-
ensable directement (`/latin.css`) est presque toujours plus légère en CSS qu'une variable pour un
usage à poids unique ; une variable ne se justifie que si plusieurs graisses de la même famille sont
réellement utilisées sur le site (ex. `body` en 400 et 600).

### 1.4 `size-adjust` / repli metric-adjusted (déjà fait)

`astro.config.mjs` a déjà `FontaineTransform.vite({ fallbacks: ['Georgia', 'Arial'] })` — Fontaine
génère automatiquement, pour chaque famille `@fontsource-variable/*` chargée, un `@font-face` de repli
avec `size-adjust`/`ascent-override`/`descent-override`/`line-gap-override` ajustés à la métrique de
la police web, pour réduire le CLS pendant le chargement. **[déjà fait]** — rien à changer, mais à
vérifier que Fontaine couvre aussi les familles statiques (`@fontsource/dela-gothic-one`) : Fontaine
travaille sur les déclarations `@font-face` qu'il voit passer dans le CSS transformé par Vite, donc
oui en principe, indépendamment de statique/variable — mais avec `latin.css` (moins de bruit), le
repli généré sera aussi plus simple à vérifier visuellement.

### 1.5 Précharger la police display

Le HTML buildé ne précharge aucune police (**[mesuré]**, §État mesuré). Pour la police display
(rendue dans le hero, donc quasi toujours candidate LCP quand le hero est un titre texte plutôt
qu'une image), un `<link rel="preload" as="font" type="font/woff2" crossorigin>` dans `<head>` évite
l'attente CSS → découverte de la police → téléchargement (le navigateur découvre la police dès le
parsing HTML, en parallèle du CSS). Le fichier woff2 précis se récupère en import Vite typé :

```ts
import delaLatinUrl from '@fontsource/dela-gothic-one/files/dela-gothic-one-latin-400-normal.woff2?url';
```

(chemin exact confirmé par `ls node_modules/@fontsource/dela-gothic-one/files/` — le nom de fichier
suit le motif `<slug>-<subset>-<weight>-<style>.woff2`). Pour une variable, même motif avec `wght` à
la place du poids : `<slug>-latin-wght-normal.woff2`. Comme le choix de police est résolu au build par
`scripts/vite-ff-look.mjs` (module virtuel `virtual:ff-look`), le nom de fichier à précharger n'est
connu qu'à ce moment-là — il faudrait soit exposer l'URL du fichier latin depuis ce plugin (il connaît
déjà `pkg`), soit un petit utilitaire qui, à partir de `fontFamilies`/`look.typography.display`,
résout dynamiquement le chemin `files/...` correspondant.

### 1.6 `font-display: optional` vs `swap`

`latin.css` embarque `font-display: swap` en dur (vérifié dans le fichier). Arbitrage LCP :
- **`swap`** (actuel) : texte visible immédiatement avec la police de repli, bascule vers la police
  web dès qu'elle arrive → jamais de texte invisible, mais un saut visuel (déjà atténué par Fontaine,
  §1.4) et le LCP peut être mesuré sur le repli si la police arrive après le paint.
- **`optional`** : la police web ne s'applique que si elle est déjà en cache (mise en cache lors d'une
  visite précédente) ou arrive en moins de ~100 ms ; sinon, le repli reste définitivement affiché pour
  cette navigation. Meilleur pour un LCP stable et prévisible (jamais de re-paint tardif qui pousse le
  LCP), au prix d'un flash de police système sur premières visites si le préchargement (§1.5) n'est
  pas assez rapide. Comme les sites `ff-atelier` sont des vitrines mono-visite pour beaucoup de
  visiteurs (pas d'app à connexions répétées), `optional` + préchargement agressif est un bon
  compromis : le préchargement garantit que la police est quasi toujours prête avant le paint, et
  `optional` évite qu'un réseau mobile lent ne fasse échouer le LCP en le retardant. `swap` reste
  préférable si le site a un texte long en dessous du fold où le flash de police est moins gênant que
  l'absence totale de la police web sur connexion lente.

Comme `font-display` est codé en dur dans le CSS généré par fontsource, changer cette valeur demande
soit d'écrire le `@font-face` à la main (en réutilisant l'URL du fichier latin, §1.5) plutôt que
d'importer `latin.css` tel quel, soit un petit post-traitement du CSS.

### 1.7 Génération de sous-ensembles maison (`glyphhanger` / `pyftsubset`)

**[non vérifié cette session — dépôts GitHub non récupérables via WebFetch, connaissance générale]**
Pour aller plus loin que les sous-ensembles fixes de fontsource (utile si un futur besoin exige un
alphabet précis, ex. juste les caractères du logo/titre) :
- `pyftsubset` (fait partie de `fonttools`, `pip install fonttools[woff]`) : extrait un sous-ensemble
  précis d'un `.ttf`/`.otf` vers `.woff2`, avec `--unicodes=` ou `--text=` pour ne garder que les
  glyphes réellement utilisés.
- `glyphhanger` (`npm i -g glyphhanger`, Filament Group) : scanne les pages réellement rendues (via
  Puppeteer) pour lister les caractères utilisés, puis appelle `pyftsubset` pour chaque police.
  Pratique pour un site figé (peu de texte, alphabet connu) — moins pour `ff-atelier` où chaque site
  client a un contenu différent généré depuis un brief, donc l'alphabet change par client.
- **Licence** : Dela Gothic One est sous SIL Open Font License 1.1 (`LICENSE` du package, vérifié
  localement) — l'OFL autorise explicitement la modification et la redistribution de sous-ensembles
  (interdiction seulement de vendre la police *seule* et d'utiliser le nom réservé sans autorisation).
  Les polices Google Fonts embarquées par fontsource sont quasi toutes en OFL — à vérifier police par
  police si une nouvelle famille non-Google est ajoutée à `src/lib/fonts.ts`.
- Pour ce repo, le sous-ensemble fontsource (`/latin.css`) suffit largement et coûte zéro tuyauterie
  supplémentaire : `pyftsubset`/`glyphhanger` ne se justifient que si le poids d'un fichier latin
  fontsource lui-même devient un problème (rare, ~10-20 Ko par police).

### 1.8 Budget

Cible : **≤ 60 Ko de police par site** (CSS `@font-face` + fichiers woff2 réellement téléchargés,
mesurés ensemble). Avec `/latin.css` partout : 1 fichier display (~10-20 Ko woff2) + 1 fichier body
(~10-20 Ko) + 1 fichier mono eyebrow (~5-10 Ko, souvent déjà chargé en petite quantité de texte) tient
confortablement sous 60 Ko, CSS `@font-face` compris (quelques centaines d'octets par police avec
`/latin.css` contre 100+ Ko avec l'`index.css` complet d'une police statique multi-sous-ensembles).

---

## 2. CSS

### 2.1 Tailwind v4 — sortie déjà plutôt légère par défaut

**[WebFetch — tailwindcss.com/blog/tailwindcss-v4]** Tailwind v4 (moteur Oxide, déjà en place ici via
`@tailwindcss/vite`) détecte automatiquement les fichiers sources (pas de `content: []` à maintenir),
compile en `@layer` CSS natif (`properties`/`theme`/`base`/`components`/`utilities` — visibles dans le
CSS buildé, §État mesuré) et supprime le besoin d'une étape de purge séparée : seules les classes
réellement utilisées dans les fichiers scannés sont générées. **Mesuré** : sur `anna-vidal` (site sans
le problème de police), le CSS hors `@font-face` pèse ~98 Ko brut / ~10 Ko compressé — déjà raisonnable
pour un design system à tokens avec 16 directions possibles + toutes les variantes de sections
(chaque site ne charge que les classes qu'il utilise réellement, Tailwind v4 fait ce tri). Pas
d'action requise ici au-delà de garder les scans `@source` par défaut (aucun ajouté dans
`global.css`, donc scan automatique du repo — correct).

### 2.2 `inlineStylesheets` : `'auto'` vs `'always'`, seuil réel

**[WebFetch — docs.astro.build]** `build.inlineStylesheets` a 3 valeurs : `'always'` (tout en
`<style>` inline), `'auto'` (défaut, **déjà utilisé** dans `astro.config.mjs` :
`build: { inlineStylesheets: 'auto' }`), `'never'` (toujours en fichier externe). `'auto'` inline
uniquement les feuilles **plus petites que `ViteConfig.build.assetsInlineLimit`**, dont la valeur par
défaut Vite est **4 Ko**. Avec un CSS principal de 90-260 Ko (§État mesuré), il est très loin sous ce
seuil — `'auto'` charge donc aujourd'hui la feuille en **fichier externe bloquant le rendu** (une
requête synchrone avant le premier paint). Deux leviers combinables :
1. Une fois `/latin.css` appliqué (§1.1), le CSS restant tombe à l'ordre de ~10-25 Ko brut selon le
   site — encore au-dessus de 4 Ko, donc `'auto'` continuera de l'externaliser. C'est correct pour du
   CSS de cette taille (l'inline gonflerait le HTML de chaque page, coût répété à chaque navigation
   sans cache, alors qu'un fichier externe est mis en cache une fois pour tout le site).
2. Ce qui manque vraiment : un **preload** de ce fichier externe (`<link rel="preload" as="style">`
   ou, plus simple, s'assurer qu'Astro l'injecte tôt et sans bloquer — à vérifier au cas par cas) et/ou
   une extraction de CSS critique (au-dessus du fold) inliné en plus du fichier externe non bloquant —
   Astro n'a pas d'extracteur de critical CSS intégré au-delà de `inlineStylesheets`, donc ce serait un
   outil tiers (ex. `critters`/`beasties`) à évaluer séparément si le score mobile ne suffit pas après
   les autres actions.

### 2.3 Retirer les `@font-face` inutiles des packages fontsource statiques (le vrai levier)

C'est la reformulation CSS du §1.1 : remplacer, dans `src/lib/fonts.ts`, chaque `pkg:
'@fontsource/<slug>'` (statique) par `pkg: '@fontsource/<slug>/latin.css'`, et documenter que les
imports fontsource-variable restent inchangés (déjà légers, §1.1). C'est un changement d'une ligne par
police statique du catalogue, sans toucher à `vite-ff-look.mjs` (qui fait déjà `import '${f.pkg}';` —
`f.pkg` peut être n'importe quel chemin d'import valide, y compris `.../latin.css`).

### 2.4 Isolation CSS par direction (déjà fait)

**[déjà fait]** `scripts/vite-ff-look.mjs` résout au build une seule direction (`src/directions/<nom>/
index.css`) et n'injecte que les imports de police réellement utilisés par `typography.display` /
`typography.body` — c'est exactement le mécanisme qui a ramené la feuille de 550 Ko (16 directions +
toutes leurs polices) à ~100-260 Ko aujourd'hui (commentaire en tête du fichier). Rien à changer.

### 2.5 Coût des textures en data-URI

Les seules data-URI trouvées dans le CSS buildé mesuré sont le LQIP (§4.5, 16px encodé en base64, ~30
à 100 o par image, injecté en `style` inline sur chaque `<img>`, pas dans la feuille CSS globale — donc
hors sujet ici). Aucune texture de fond en data-URI dans les directions au moment de la mesure. Si une
future direction en ajoute une (bruit, grain), la règle générale : une image SVG/PNG en data-URI dans
le CSS gonfle le fichier de ~33 % par rapport au binaire (encodage base64) et n'est jamais mise en
cache indépendamment du CSS — préférer un fichier statique référencé par `url()` classique (mis en
cache séparément, compressible indépendamment) au-delà de quelques centaines d'octets.

---

## 3. JS

### 3.1 GSAP — déjà chargé à la demande, granularité déjà fine

**[mesuré]** `src/scripts/motion.ts` importe GSAP et ses plugins **uniquement en `await import(...)`
dans chaque fonction d'effet** (`splitText`, `stickyStack`, `scrambleRich`, `drawLines`,
`accordionFlip`, `smoothScroll`...) — jamais d'import statique en tête de fichier. C'est déjà la bonne
pratique : le cœur GSAP + `ScrollTrigger` ne sont téléchargés que si `motion === 'rich'` *et* qu'un
effet qui en a besoin est présent sur la page. Tailles mesurées dans `node_modules/gsap` (non
minifiées, avant tree-shaking Vite) : `gsap-core.js` 171,7 Ko brut / 50,2 Ko gzip ;
`ScrollTrigger.js` 112,6 Ko brut / 32,2 Ko gzip. Le chunk de build final sera plus petit (minification
+ tree-shaking Rollup), cohérent avec le ~70 Ko déjà observé en prod pour un site `motion: 'rich'`.
Deux pistes marginales, pas prioritaires vu que le chargement est déjà paresseux et scindé par effet :
- Certains effets importent `gsap` + `ScrollTrigger` séparément à plusieurs endroits (`splitText`,
  `stickyStack`, `drawLines`, `smoothScroll`...) — Vite/Rollup déduplique automatiquement les imports
  du même spécificateur dans un chunk partagé, donc pas de doublon réel, juste à garder en tête si un
  futur refactor casse cette hypothèse (vérifier le graphe de chunks au build si le poids JS dérive).
  smoothScroll` charge aussi `gsap`+`ScrollTrigger` (redondant avec les effets qui les chargent déjà)
  — fondu dans le même chunk partagé au build, donc sans coût réel supplémentaire tant que les
  spécificateurs restent identiques.
- `gsap.registerPlugin(...)` explicite est déjà fait à chaque `await import` (nécessaire, sinon le
  tree-shaking Rollup peut supprimer un plugin jamais référencé statiquement).

### 3.2 `modulepreload`

Astro injecte déjà des `<script type="module">` pour ses scripts hydratés/inline (§État mesuré :
`Base.astro_astro_type_script_index_0_lang.*.js`), mais aucun `<link rel="modulepreload">` n'a été
trouvé dans le HTML buildé de `toits-cie`. Pour le petit script d'init (`initMotion`, toujours chargé,
`motion: 'subtle'` ou `'rich'`), un `modulepreload` permettrait au navigateur de le télécharger et
compiler en parallèle du HTML plutôt que de découvrir le module puis ses dépendances en cascade. Gain
probablement faible ici (le script est petit, `motion: 'subtle'` n'a aucune dépendance externe) — plus
utile si `motion: 'rich'` et qu'un effet critique above-the-fold (ex. `splitText` sur le H1 hero)
dépend de GSAP dès le premier paint, auquel cas préconnecter/`modulepreload` le chunk GSAP réduirait la
fenêtre où le texte animé est invisible/non splitté.

### 3.3 `astro:page-load`

**[déjà fait, comportement correct]** `Base.astro` n'attache `initMotion` à `astro:page-load` que si
`data-transitions` est posé (donc `site.transitions` actif, `<ClientRouter />` présent) ; sinon appel
direct — évite une double init et évite de payer le coût de l'event listener sur les sites qui n'ont
pas de transitions (la majorité, vu le commentaire « à réserver pour l'instant à des sites
mono-page/landing » dans `Base.astro`).

### 3.4 Speculation Rules API pour le préchargement

**[WebFetch — MDN]** API native pour préconnecter/pré-rendre les navigations suivantes, sans lib :
`<script type="speculationrules">{"prefetch":[{"where":{"href_matches":"/*"},"eagerness":"moderate"}]}
</script>`. Limité à Chrome/Edge (pas de Baseline, Firefox/Safari sans support) — dégradation
silencieuse, sans risque sur les navigateurs non supportés. Cloudflare propose une version automatique
de ceci (Speed Brain, §5.7) qui évite d'avoir à l'écrire/maintenir à la main. Attention si utilisé : ne
jamais prérendre une URL à effet de bord (formulaire de contact, liens de désinscription) — les sites
`ff-atelier` n'ont a priori que `POST /` de formulaire (pas d'URL GET à effet de bord), donc risque
faible, mais à vérifier avant activation large.

### 3.5 Coût de View Transitions / `ClientRouter`

**[WebFetch — docs.astro.build, contenu peu quantitatif]** La doc Astro ne donne pas de poids en Ko
précis pour `<ClientRouter />`. Comportement confirmé : sans transitions, chaque navigation est un
rechargement complet de page (tous les scripts se ré-exécutent, CSS et DOM entièrement rechargés) —
c'est le comportement actuel de la majorité des sites (`site.transitions` non activé par défaut,
d'après le commentaire dans `Base.astro`). Avec transitions actives, Astro intercepte la navigation,
réutilise le DOM/CSS existants et ne ré-exécute jamais un script de module déjà exécuté — MAIS le
`<ClientRouter />` lui-même ajoute un runtime JS embarqué sur *toutes* les pages du site dès qu'il est
activé, même sur les pages où la transition n'apporte pas grand-chose. Comme `ff-atelier` fait des
sites vitrines à faible profondeur de navigation (accueil, services, mentions légales...), le coût
fixe de `ClientRouter` par page vue dépasse probablement le bénéfice pour la majorité des sites —
cohérent avec le fait que ce ne soit pas la valeur par défaut. Ne pas l'activer par réflexe ; seulement
si un client a un vrai parcours multi-pages où l'animation de transition est un argument de vente
(ex. portfolio photographe).

---

## 4. Images

### 4.1 Préchargement de l'image LCP

**[mesuré]** `src/components/Img.astro` pose déjà `fetchpriority="high"` + `loading="eager"` sur
l'`<img>` quand `priority` est vrai (utilisé dans 4 variantes de `Hero/*.astro`), mais **aucun**
`<link rel="preload" as="image">` n'existe dans le `<head>` — confirmé sur le HTML buildé de
`toits-cie`. Différence importante : `fetchpriority="high"` sur l'`<img>` dit au navigateur de
prioriser le téléchargement *une fois qu'il a découvert la balise* (donc après le parsing HTML jusqu'à
cet endroit, et après avoir choisi la bonne entrée du `srcset`) ; un `<link rel="preload">` dans `<head>`
est découvert *avant* le corps du HTML, donc plus tôt. **[WebFetch — web.dev, preload-responsive-images]**
Pour une image responsive avec `srcset`/`sizes`, le preload doit répéter la même logique de sélection :

```html
<link rel="preload" as="image" href="/images/hero.webp"
  imagesrcset="/images/hero-480.avif 480w, /images/hero-800.avif 800w, ..."
  imagesizes="100vw" fetchpriority="high">
```

Sans `fetchpriority="high"` sur le `<link>` lui-même, une image preload reçoit la priorité *basse* par
défaut (le navigateur suppose que le contenu bloquant le rendu passe avant) — donc les deux attributs
sont nécessaires ensemble, pas l'un ou l'autre. À générer côté `Img.astro` (ou dans `Base.astro` via un
slot dédié) uniquement pour l'image `priority` du hero — jamais pour une image lazy, sous peine de
gaspiller de la bande passante prioritaire sur du contenu hors écran. Un seul preload d'image
prioritaire par page recommandé (au-delà, ça n'aide plus le LCP et retarde d'autres ressources
critiques).

### 4.2 Qualité AVIF

**[mesuré]** `scripts/ff/images.mjs` encode déjà `avif({ quality: 60 })` et `webp({ quality: 80 })`.
Qualité 60 en AVIF correspond visuellement à une qualité bien supérieure en JPEG/WebP classique (AVIF
compresse plus agressivement à qualité perçue égale) — dans la fourchette généralement recommandée
(50-65) pour de la photo web sans artefact visible à taille d'affichage normale. **[déjà fait]**, pas
de changement nécessaire sauf test A/B visuel si un client se plaint de flou sur une photo à fort
contraste (auquel cas remonter à 65-70 pour cette image précise plutôt que globalement).

### 4.3 Exactitude de `sizes`

**[mesuré]** `Img.astro` a `sizes = '100vw'` par défaut, et c'est aussi la valeur utilisée par tous les
appels qui ne le surchargent pas explicitement. C'est correct pour une image hero pleine largeur, mais
**faux** pour toute image qui n'occupe pas 100 % de la largeur du viewport (ex. une grille 3 colonnes,
une photo à côté d'un texte en 2 colonnes desktop) — dans ce cas le navigateur choisit une variante du
`srcset` plus grande que nécessaire, gaspillant de la bande passante sans bénéfice visuel. À auditer
site par site : chercher les usages de `<Img>` dans `src/sections/*` où l'image n'est pas en pleine
largeur (grilles de services, portraits, galeries) et leur passer un `sizes` correct (ex.
`"(min-width: 768px) 33vw, 100vw"` pour une grille 3 colonnes qui devient 1 colonne en mobile).

### 4.4 Cloudflare Images / Polish / Mirage vs pré-génération

**[WebFetch partiel + connaissance produit]** Cloudflare Images (transformation à la volée, payant au-
delà d'un quota) et Polish/Mirage (optimisation automatique côté edge, Polish sur plans payants,
Mirage limité) sont **inutiles ici** : le pipeline `sharp` (`scripts/ff/images.mjs`) pré-génère déjà
AVIF+WebP à 4 largeurs (480/800/1200/1600) au moment du build, servi statiquement — c'est strictement
équivalent au résultat de ces produits payants, sans coût récurrent ni dépendance à un service tiers,
et sans latence de transformation à la première requête (cache froid sur les produits Cloudflare).
Ne pas activer Polish (payant, `ff-atelier` visant des sites low-cost pour artisans) : aucun gain net
attendu sur des images déjà optimisées côté build.

### 4.5 Coût du LQIP dans le HTML

**[mesuré]** Le LQIP est un WebP 16px de large, qualité 40, encodé en base64 et injecté en
`style="background-image:url(data:...)"` inline sur chaque `<img>` (`scripts/ff/images.mjs` +
`Img.astro`). Poids typique observé pour ce type d'encodage : quelques dizaines à ~150 octets par
image selon le contenu — négligeable même multiplié par une dizaine d'images sur une page (quelques Ko
maximum), et ça évite une requête réseau séparée pour le placeholder. **[déjà fait]**, bon compromis,
rien à changer.

---

## 5. Cloudflare Pages

### 5.1 Early Hints

**[WebFetch — developers.cloudflare.com/pages/configuration/early-hints]** Activé **automatiquement**
sur tous les domaines Pages (`*.pages.dev` et domaines personnalisés), sans configuration. Cloudflare
met en cache les en-têtes `Link` de type `preload`/`preconnect` (qu'ils viennent d'un fichier
`_headers` ou de balises `<link>` HTML) et les renvoie en `103 Early Hints` avant la réponse complète —
gain direct dès que des `<link rel=preload>` existent dans le HTML (§1.5, §4.1). Aucune action
spécifique à part *avoir* des preloads à propager — actuellement aucun (§État mesuré), donc Early
Hints n'apporte rien tant que §1.5/§4.1 ne sont pas faits.

### 5.2 HTTP/3, Brotli

Standards, actifs par défaut sur Cloudflare (pas de configuration Pages spécifique connue nécessaire).
**[mesuré localement, pas via l'edge Cloudflare]** Le CLI `brotli` donne 68,8 Ko pour le CSS de 260 Ko
de `toits-cie` — Cloudflare compresse en Brotli à la volée pour les clients qui l'acceptent
(`Accept-Encoding: br`, la quasi-totalité du trafic mobile moderne), donc ce chiffre est représentatif
de ce qui transite réellement, même si l'edge Cloudflare peut utiliser un niveau de compression
légèrement différent de la CLI locale.

### 5.3 En-têtes de cache via `_headers`

**[WebFetch — developers.cloudflare.com/pages/configuration/headers]** Fichier `_headers` à la racine
de `dist/<slug>` (donc à écrire dans `sites/<slug>/public/_headers` pour qu'Astro le copie tel quel au
build, comme n'importe quel asset de `publicDir`). Syntaxe bloc :

```
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/
  Cache-Control: public, max-age=0, must-revalidate
```

Les fichiers sous `/_astro/*` (CSS, JS, polices bundlées par Vite) ont un hash dans leur nom de
fichier (confirmé : `confidentialite.Cjxl3KQv.css`) — `immutable` + 1 an est donc sûr (un contenu
changé produit un nouveau nom de fichier, jamais une collision). Le HTML ne doit **jamais** être mis en
cache longtemps (`max-age=0, must-revalidate` ou `no-cache`) puisque son contenu change à chaque
déploiement sans changer d'URL. Limites : 100 règles max, 2000 caractères par ligne — largement
suffisant pour ce cas (2-3 règles). **Ceci est le gap le plus simple à combler** : le fichier n'existe
nulle part dans le repo actuellement (§État mesuré), donc Cloudflare tourne sur ses réglages par défaut
(généralement raisonnables mais non garantis `immutable`).

### 5.4 `_redirects`

**[WebFetch — developers.cloudflare.com/pages/configuration/redirects]** Format `source destination
code`, jusqu'à 2000 redirections statiques + 100 dynamiques (splats `*`/`:placeholder`), 301/302/303/
307/308 supportés (302 par défaut). Pas de besoin identifié aujourd'hui dans `ff-atelier` (pas de
migration d'URL connue) — à garder pour plus tard si un client change de structure d'URL ou si un
domaine legacy doit rediriger vers le nouveau site.

### 5.5 Web Analytics (alternative à Plausible)

**[WebFetch partiel — la doc overview ne détaille pas cookies/script]** Cloudflare Web Analytics est
disponible sur tous les plans (donc gratuit), positionné « sans compromis sur la vie privée du
visiteur » et ne nécessite pas de proxifier le DNS par Cloudflare pour fonctionner sur un site qui y
est déjà hébergé. **[non vérifié cette session]** l'absence de cookies et le poids exact du script
d'analytics n'ont pas pu être confirmés par la page récupérée (la doc technique détaillée n'était pas
accessible dans le contenu retourné) — à vérifier avant de remplacer Plausible partout, notamment côté
RGPD (bannière de consentement nécessaire ou non). `Base.astro` a déjà un point d'intégration prêt
(`site.analytics.plausible` / `site.analytics.umami`, chargés en `defer`) — ajouter une 3ᵉ option
`site.analytics.cloudflare` suivrait le même patron une fois la vérification faite. Intérêt principal
pour `ff-atelier` : zéro script tiers à charger si Cloudflare fait l'analytics côté edge/log plutôt que
par script JS (à confirmer) — potentiellement plus léger que n'importe quelle option actuelle.

### 5.6 Turnstile pour le formulaire de contact

**[WebFetch — developers.cloudflare.com/turnstile]** Alternative à reCAPTCHA : défis JS non-interactifs
(preuve de travail + analyse comportementale), 3 modes (Managed/Non-Interactive/Invisible). Ne
transmet pas les données du formulaire lui-même (page de doc : « n'accède pas, ne stocke pas et ne
transmet pas les entrées de formulaire »), et peut fonctionner sans faire transiter le trafic par
Cloudflare (site pas forcément proxifié par Cloudflare). **[non vérifié cette session]** Gratuité non
confirmée par le contenu récupéré (renvoie vers une page plans non fetchée), mais connue comme gratuite
pour un usage standard de ce type de site. Pertinent pour `ContactForm.astro` si le spam devient un
problème sur un site client — coût JS a priori faible (widget invisible), à mesurer une fois intégré
plutôt qu'à activer partout par défaut (chaque script tiers, même léger, a un coût mobile).

### 5.7 Speed Brain

**[non vérifié cette session — page produit non trouvée (404) au moment du fetch]** Connu (changelog
Cloudflare public, hors fetch de cette session) comme une fonctionnalité qui injecte automatiquement
des règles Speculation Rules API (§3.4) pour prérécupérer les liens visibles, sans code à écrire, sur
option à activer dans le dashboard Cloudflare (zone → Speed). À vérifier dans le dashboard du compte
`ff-atelier` avant de considérer comme actif ou non — ne pas l'assumer activé.

---

## 6. Mesure

### 6.1 Lighthouse CI — seuils et budgets

**[WebFetch — github.com/GoogleChrome/lighthouse-ci]** Deux mécanismes distincts, combinables :
- **Assertions** (`.lighthouserc.json`, format eslint-style) : `"categories:performance": ["error",
  {"minScore": 1}]` pour un score, ou `"largest-contentful-paint": ["error", {"maxNumericValue":
  2500}]` pour une métrique précise en ms. Niveaux `off`/`warn`/`error` (`error` fait échouer le run,
  utile en CI).
- **`budgets.json`** (format standard, indépendant de LHCI) : budgets par type de ressource en **Ko**
  (`resource-summary:font:size`, `:script:size`, `:image:size`...) — attention, si combiné avec une
  assertion LHCI équivalente, celle-ci attend des **octets**, pas des Ko (conversion à faire).
- Ce repo a déjà `node scripts/ff.mjs lighthouse [slug] [--mobile] [--seuil 90]` qui échoue si
  l'accueil est sous le seuil — un bon point d'ancrage pour ajouter un budget de ressources en plus du
  score global (voir `ff perf`, §6.3), sans dépendre de `lhci` comme outil séparé si le script maison
  suffit.

### 6.2 WebPageTest / CrUX

- **WebPageTest** : utile ponctuellement pour un waterfall détaillé (ordre de requêtes, blocage
  render) sur une connexion simulée précise (3G lent, CPU throttling) — pas d'automatisation prévue
  ici, à utiliser manuellement avant une livraison client si Lighthouse seul ne suffit pas à diagnostiquer
  un problème.
- **[WebFetch — developer.chrome.com/docs/crux/api]** CrUX API donne les métriques **réelles**
  utilisateurs (LCP, CLS, INP, FCP, TTFB) en moyenne glissante sur 28 jours, par `origin` ou `url`,
  jusqu'à 150 requêtes/minute gratuites (clé API Google Cloud). Utile seulement une fois un site
  client en prod depuis quelques semaines avec du trafic réel — Lighthouse (labo) et CrUX (terrain)
  divergent souvent sur mobile bas de gamme réel vs le mobile simulé de Lighthouse ; CrUX est la seule
  façon de savoir si le 100/100 labo se traduit en Core Web Vitals réels "Good" pour un client donné.
  À ajouter comme vérification post-livraison (30 jours après déploiement), pas comme gate de build.

### 6.3 Spécification `ff perf`

Objectif : un budget vérifiable **sans navigateur** (rapide, exécutable en pré-commit ou CI) +
un mode complet avec Lighthouse (plus lent, réservé à `ff verifier --lighthouse` existant).

**`perf-budget.json`** (à la racine du repo, un seul budget partagé par tous les sites — cohérent avec
« un seul projet Astro, plusieurs sites ») :

```json
{
  "fonts": { "maxKB": 60 },
  "css": { "maxKB": 30 },
  "js": { "maxKB": 90 },
  "images": { "maxKB": 400, "perImageMaxKB": 150 },
  "lcp": { "maxMs": 2500 }
}
```

(Tailles en Ko **compressé** — brotli si présent en local, sinon gzip — puisque c'est ce que le
navigateur transfère réellement, §État mesuré.)

**`node scripts/ff.mjs perf <slug>`** — nouvelle sous-commande, deux phases :
1. **Phase tailles** (sans navigateur, rapide) : build le site (ou lit `dist/<slug>` s'il existe déjà),
   pour chaque catégorie (`fonts` = fichiers `.woff2`/`.woff` référencés + CSS `@font-face` ; `css` =
   fichiers `.css` sous `_astro/` ; `js` = fichiers `.js` sous `_astro/` ; `images` = `_astro/*` +
   `public/images/*` réellement référencés par le HTML de la page d'accueil), compresse chaque fichier
   en mémoire (`zlib.brotliCompressSync`) et compare au budget. Sort en erreur (comme `ff lighthouse
   --seuil`) si un budget est dépassé, avec le détail des fichiers en cause (permet de voir tout de
   suite si un client a ajouté une police display supplémentaire qui fait exploser le budget `fonts`).
2. **Phase Lighthouse** (optionnelle, `--lighthouse`, appelle en fait `ff lighthouse` existant) : score
   perf + métrique LCP réelle depuis un Lighthouse local, comparée à `lcp.maxMs`.

Écrit `captures/<slug>-perf.json` (même dossier que `<slug>-lighthouse.json` existant), pour permettre
un suivi dans le temps (diff entre deux runs, alerte de régression). Intégrable à `ff verifier <slug>`
comme une vérification de plus, avant livraison — cohérent avec le reste des workflows en une commande
du repo (`docs/PROCESS.md` § définition de fait).

---

## 7. Plan d'action (12 étapes, ordonnées par ratio impact/effort)

| # | Action | Fichier(s) | Impact estimé |
|---|---|---|---|
| 1 | Remplacer `pkg: '@fontsource/<slug>'` par `'@fontsource/<slug>/latin.css'` pour toutes les polices **statiques** de `src/lib/fonts.ts` (dela-gothic-one, instrument-serif, gloock, spectral, zilla-slab, abril-fatface, yeseva-one, archivo-black, bebas-neue, alfa-slab-one, bungee, dm-mono, ibm-plex-mono, space-mono, fragment-mono) | `src/lib/fonts.ts` | **Le plus gros levier mesuré** : -108 Ko brut / -~30 Ko brotli rien que sur `dela-gothic-one` pour un site qui l'utilise ; -162,6 Ko de `@font-face` en tout sur `toits-cie` (62,5 % du CSS actuel). CSS de `toits-cie` : 260 Ko → ~100 Ko brut estimé, ~25-30 Ko brotli. |
| 2 | Ajouter un `_headers` (`sites/<slug>/public/_headers` ou un template commun copié au build) avec cache `immutable` 1 an sur `/_astro/*`, `no-cache`/`must-revalidate` sur le HTML | nouveau `_headers` | Gain surtout en **visites répétées** (revisite d'un client au design, changement de page) ; zéro coût, zéro risque, 10 min de travail. Active aussi Early Hints (§5.1) pour ce qui est préchargé. |
| 3 | Générer un `<link rel="preload" as="image" imagesrcset imagesizes fetchpriority="high">` pour l'image `priority` du hero, dans `<head>` (`Base.astro` slot `head` ou logique dédiée dans `Img.astro`/`Hero/*.astro`) | `src/layouts/Base.astro`, `src/components/Img.astro` | Découverte de l'image LCP avant le parsing du corps HTML au lieu d'après — souvent le plus gros gain de LCP mesuré en pratique pour un hero avec grande image. |
| 4 | Précharger le woff2 latin de la police display (`<link rel=preload as=font type=font/woff2 crossorigin>`), résolu depuis `virtual:ff-look` | `scripts/vite-ff-look.mjs`, `src/layouts/Base.astro` | Réduit le délai police-repli → police-web ; combiné à l'action 1 (CSS `@font-face` déjà minimal), le navigateur télécharge le bon fichier immédiatement au lieu d'attendre le CSS externe. |
| 5 | Auditer et corriger `sizes` sur les usages de `<Img>` qui ne sont pas en pleine largeur (grilles de services, portraits, galeries) | `src/sections/**/*.astro` | Évite de télécharger une variante d'image plus grande que nécessaire sur mobile ; impact variable selon le nombre d'images non pleine-largeur par site, potentiellement plusieurs centaines de Ko sur une page riche en photos. |
| 6 | Écrire `scripts/ff/perf.mjs` + `perf-budget.json` (§6.3), brancher sur `ff verifier` | nouveau `scripts/ff/perf.mjs`, `perf-budget.json` | Pas un gain direct de score, mais rend les 5 actions précédentes **non régressives** — un futur ajout de police/lib ne repasse pas discrètement au-dessus du budget. |
| 7 | Considérer `font-display: optional` pour la police display uniquement (nécessite d'écrire le `@font-face` à la main plutôt que d'importer `latin.css` tel quel, §1.6) | `src/lib/fonts.ts` ou nouveau helper | Stabilise le LCP (pas de re-paint tardif) sur les visiteurs dont la police n'arrive pas à temps ; dépend de l'action 4 (préchargement) pour ne pas dégrader l'expérience de première visite. |
| 8 | Activer/vérifier Cloudflare Speed Brain dans le dashboard (prefetch automatique via Speculation Rules, §5.7) | dashboard Cloudflare (hors repo) | Gain sur la navigation interne (accueil → service) si le site n'a pas de transitions ; à vérifier que rien n'est prérécupéré sur une URL à effet de bord (POST formulaire exclu par nature, GET uniquement). |
| 9 | `modulepreload` sur le chunk `initMotion` (et le chunk GSAP si un effet above-the-fold en dépend en `motion: 'rich'`) | `src/layouts/Base.astro` | Gain modeste isolé, mais combiné à Early Hints (action 2), le navigateur peut le récupérer en `103` avant même la fin du HTML. |
| 10 | Décider Web Analytics Cloudflare vs Plausible/Umami après vérification RGPD (§5.5) — si cookie-free confirmé et sans bannière requise, migrer par défaut sur les nouveaux sites | `src/lib/site.ts`, `Base.astro`, `sites/*/site.config.ts` | Potentiellement -quelques Ko de script tiers par page si le tracking est fait côté edge plutôt que par script JS chargé ; à chiffrer une fois vérifié. |
| 11 | Ajouter Turnstile sur `ContactForm.astro` si le spam devient un problème réel sur un site client (pas par défaut partout — chaque script a un coût) | `src/components/ContactForm.astro` (à confirmer chemin exact) | Coût mobile faible (widget invisible) contre un vrai problème opérationnel ; pas un levier de performance en soi, à ne déclencher que sur besoin. |
| 12 | Explorer une extraction de critical CSS (ex. `beasties`) seulement si le score mobile reste sous 100 après les 11 actions précédentes | `astro.config.mjs` ou plugin build | Dernier recours : plus complexe à maintenir (double CSS à synchroniser), donc seulement si les leviers plus simples et plus sûrs ne suffisent pas à atteindre 100/100. |

**Priorité immédiate** : actions 1-4 concentrent l'essentiel du gain mesuré (réduction CSS de 60 %+
sur les sites avec une police display statique multi-sous-ensembles, LCP découvert plus tôt) pour un
risque de régression très faible (aucune ne change le rendu visuel, juste ce qui est chargé et quand).

---

## 8. Sources

Recherche web (`WebSearch`) indisponible sur toute la session (quota épuisé avant le premier appel,
confirmé par un essai qui a échoué immédiatement) — sources ci-dessous obtenues via `WebFetch` direct,
sauf mention contraire.

- [Astro — configuration reference, `build.inlineStylesheets`](https://docs.astro.build/en/reference/configuration-reference/#buildinlinestylesheets) — valeurs, seuil `assetsInlineLimit` (4 Ko par défaut Vite).
- [Cloudflare Pages — fichier `_headers`](https://developers.cloudflare.com/pages/configuration/headers/) — syntaxe, exemple `immutable`, limites (100 règles, 2000 caractères/ligne).
- [Cloudflare Pages — Early Hints](https://developers.cloudflare.com/pages/configuration/early-hints/) — activation automatique, propagation des `Link: preload/preconnect`.
- [MDN — Speculation Rules API](https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API) — syntaxe prefetch/prerender, support navigateur, précautions (URLs à effet de bord).
- [Cloudflare Pages — fichier `_redirects`](https://developers.cloudflare.com/pages/configuration/redirects/) — syntaxe, codes supportés, limites (2000 statiques + 100 dynamiques).
- [Cloudflare — Web Analytics (overview)](https://developers.cloudflare.com/web-analytics/) — disponibilité tous plans ; détails cookies/script **non vérifiés cette session** (contenu technique non retourné par le fetch).
- [Cloudflare — Turnstile (overview)](https://developers.cloudflare.com/turnstile/) — modes, non-transmission des données de formulaire ; gratuité **non confirmée par le fetch** (page plans non récupérée).
- [Chrome for Developers — CrUX API](https://developer.chrome.com/docs/crux/api) — endpoint, métriques (LCP/CLS/INP), quota gratuit 150 req/min.
- [web.dev — Preload responsive images](https://web.dev/articles/preload-responsive-images) — syntaxe `imagesrcset`/`imagesizes`, nécessité de `fetchpriority="high"` sur le `<link>` lui-même.
- [Lighthouse CI — configuration (GitHub)](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md) — assertions, niveaux `off/warn/error`, `budgets.json`, unités Ko vs octets.
- [Astro — View Transitions / `<ClientRouter />`](https://docs.astro.build/en/guides/view-transitions/) — comportement scripts/CSS entre navigations ; poids en Ko **non donné par la doc**.
- [Tailwind CSS — annonce v4](https://tailwindcss.com/blog/tailwindcss-v4) — moteur Oxide, détection automatique du contenu, configuration CSS-first.
- Cloudflare Speed Brain : page produit retournée en 404 au moment du fetch — **non vérifié cette session**, à confirmer dans le dashboard du compte.
- `fontsource.org/docs/getting-started/subsetting` et `/install` : pages retournées 404 ou sans le détail recherché — remplacé par une **inspection directe des packages installés** (`node_modules/@fontsource*`, plus fiable qu'une doc générale pour les chiffres exacts de ce repo).
- GSAP (tailles `gsap-core.js`/`ScrollTrigger.js`) : mesurées directement dans `node_modules/gsap`, pas via `gsap.com/docs` (page sans chiffres précis retournés).
- Licence Dela Gothic One : `node_modules/@fontsource/dela-gothic-one/LICENSE` — SIL Open Font License 1.1, lu directement dans le repo.
- Toute donnée marquée **[mesuré]** : lecture directe des fichiers du repo (`node_modules/@fontsource*`, `dist/*/​_astro/*.css`, `dist/*/index.html`) au cours de cette session, le 17 septembre 2026.
