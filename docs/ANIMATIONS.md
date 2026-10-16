# Moteur d'animation — attributs `data-*`

Référence complète des attributs pilotés par `src/scripts/motion.ts` (voir aussi l'en-tête du
fichier et le bloc motion de `src/styles/global.css`). Chaque effet a un repli
`prefers-reduced-motion` (bloc `@media` dans `global.css`) et suit `docs/veille/animations.md` § 5
(performance). Vitrine complète, un humain qui fait défiler une page : `sites/_effets/`
(`SITE=_effets node node_modules/astro/astro.js build` puis `node scripts/ff.mjs captures _effets`).

`site.motion` : `none` (rien), `subtle` (défaut, zéro dépendance), `rich` (+ GSAP chargé à la
demande, seulement si un `data-*` correspondant est présent dans le DOM de la page).

## Durées et courbes (tokens, `global.css`) — règles R1/R2 de `docs/veille/animations-2.md`

Deux régimes de durée, trois courbes. Un bouton qui change de fond en 1,4 s, c'est « pas fluide » ;
un reveal qui monte de 24 px en 0,9 s sur chaque paragraphe, c'est « IA ».

| Token | Défaut | Rôle | Qui le pose |
|---|---|---|---|
| `--motion-ui` | `0.22s` | Tout ce qui répond à un **geste** : hover, focus, bouton, champ, image flottante. 0,15 s (brut, signal, industriel) à 0,32 s (luxe). Jamais `--motion-duration` sur un `:hover`/`.btn` (testé par `tests/motion.test.mjs`). | `global.css`, surchargé par la direction |
| `--motion-duration` | `0.9s` | **Mise en scène** : reveals avec déplacement, split mots/caractères, traits. 0,5 s (brut, signal) à 1 s (plafond : luxe/nuit/eclipse étaient à 1,1–1,4 s). | direction |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Ce qui **apparaît** (reveal, stagger). | `global.css` |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Ce qui **se déplace ou se transforme** (fondu croisé `data-pin-step`, flip-card, rideau). | `global.css` |
| `--ease-brand` | osmo `cubic-bezier(0.625, 0.05, 0, 1)` | **Courbe signature** de la direction, ce qui donne une « main » à chaque site : titres `data-split="lines"`, bouton pop. Chaque `src/directions/<nom>/index.css` la redéfinit (brut `(0.8,0,0,1)`, pop back-out `(0.34,1.56,0.64,1)`, nuit expo-out, pierre `(0.87,0,0.13,1)`…). | direction |

Valeurs par défaut changées le 20 sept. 2026 : `data-reveal` = opacité seule 0,5 s (était fondu +
24 px sur `--motion-duration`) ; `data-stagger` 60 ms (était 90) ; `data-reveal-delay` plafonné à
400 ms ; scrub 1 partout (était 0,5–0,8 ou `true`) ; `data-parallax` 0,5 (était `true`) ; tilt 0,3 s /
retour 0,25 s (était 0,5 / 0,8).

## Attributs existants

| `data-*` | Palier | Quand l'utiliser |
|---|---|---|
| `data-reveal` | subtle | Apparition au scroll : **opacité seule, 0,5 s, `--ease-out`**. Un groupe par section (règle 21), pas sur chaque paragraphe. |
| `data-reveal="up"` (`left/right/scale/blur/clip/wipe/mask`) | subtle | Variante **avec déplacement** (up = 12 px, sur `--motion-duration`) : à réserver au bloc qu'on veut faire remarquer. |
| `data-reveal-delay="120"` | subtle | Décale une apparition individuelle (ms, plafonné à 400). |
| `data-stagger="60"` | subtle | Cascade sur les enfants directs d’un conteneur (grille, liste), 60 ms par défaut (20–50 texte, 60–100 cartes). Délai total plafonné à 600 ms : sur 20 enfants le pas se resserre tout seul. |
| `data-counter="248"` `data-suffix="+"` | subtle | Chiffre clé qui compte au scroll. |
| `data-marquee="30s"` | subtle | Bande défilante infinie (logos, villes, mots-clés). |
| `data-draw` | subtle | Trait (hr/span) qui se trace au scroll. |
| `data-parallax="0.2"` | rich | Déplacement vertical léger d'une image/bloc au scroll (scrub 0,5). |
| `data-magnetic="0.3"` | rich | Bouton qui suit légèrement le curseur. |
| `data-tilt="8"` | rich | Carte inclinée en 3D au survol (0,3 s, retour 0,25 s). |
| `data-scrub="scale=1.15,rotate=4,x=-20,y=10,opacity=0.3,blur=12"` | rich | Anime un état de départ vers l'état normal, piloté par le scroll (scrub 1). |
| `data-scrub-lag="0.3"` (sur tout effet scrollé) | rich | Retard de rattrapage en secondes, à la place du défaut de l'effet (1 ; 0,5 parallax ; 0,3 piles). Jamais sous 0,3. |
| `data-pin="400"` (+ `data-pin-step`) | rich | Épingle une section pendant N % de hauteur d'écran, étapes activées tour à tour (fondu croisé 0,5 s in-out). **Règle de longueur : 100 % par étape + 100 %** (3 étapes = 400) ; sans valeur, le moteur applique cette formule. Une section épinglée dure au moins trois écrans. |
| `data-horizontal` (+ `.h-track`) | rich | Piste qui défile horizontalement pendant le scroll vertical (desktop ≥ 64rem), scrub 1. |
| `data-text-fill` | rich | Texte qui se remplit mot par mot au scroll (scrub 1). |
| `data-split` / `data-split="chars"` | rich | Titre découpé en mots (défaut) ou en caractères, révélé en cascade (CSS maison). |
| `data-split="lines"` (+ `data-split-ease="out"` optionnel) | rich | **Réservé à un h1 au plus, quand le contrat dit pourquoi ; jamais sur les h2** (signe IA, GOUT § 2, 16 oct 2026) : titre révélé par lignes masquées (GSAP SplitText, `mask: "lines"`, gratuit depuis 3.13) — `yPercent 110 → 0`, 0,9 s, stagger 0,09, sur `--ease-brand` (courbe signature de la direction ; `data-split-ease="out"` pour `--ease-out`). Chargé à la demande, attend les polices, re-découpe au resize (`autoSplit`). Repli sans SplitText : découpage mots maison. `prefers-reduced-motion` : texte visible, non découpé. Pour les `h1`/`h2`, à la place de `data-reveal`. |
| `data-hover-img="/images/x.webp"` | rich | Une image flotte près du curseur pendant le survol (pointer fin). |

## Nouveaux effets (docs/veille/animations.md § 3)

| `data-*` | Palier | Quand l'utiliser |
|---|---|---|
| `data-sticky-stack` | subtle (+ assombrissement en rich) | Sections qui se superposent en restant collées (storytelling, étapes de fabrication). |
| `data-stack` | rich | Cartes qui s'épinglent puis se tassent l'une après l'autre (portfolio, process). |
| `data-scramble="900"` | subtle (vanilla) / rich (ScrambleTextPlugin) | Chiffre clé ou accroche qui se "décode" à l'entrée. |
| `data-spotlight` **INTERDIT** (docs/GOUT.md § 2, 15 oct 2026 : signe « fait par une IA » ; `ff ia` alerte ; gardé pour les sites existants) | subtle | Halo lumineux qui suit le curseur dans une section sombre (CTA), pointer fin uniquement. |
| `data-tilt-glare` (sur un `data-tilt`) **INTERDIT** (docs/GOUT.md § 2, 15 oct 2026 : signe « fait par une IA » ; `ff ia` alerte ; gardé pour les sites existants) | rich | Ajoute un reflet lumineux qui suit le curseur sur une carte inclinée. |
| `data-flip-card` (+ `.flip-inner/.flip-front/.flip-back`) | subtle | Carte qui se retourne (équipe : photo → bio), hover desktop + clic/tap mobile, `aria-pressed`. |
| `data-compare` (+ `.compare-before/.compare-after` + `input[type=range]`) | subtle | Slider avant/après (rénovation, chantier), accessible clavier. |
| `data-parallax-depth` (+ enfants `data-depth="0.2"`) | rich | Parallax multi-couches dans un hero (fond/sujet/premier plan). |
| `data-trail="/images/x.webp"` | rich | Traînée de plusieurs images qui suivent le curseur (galerie/portfolio). |
| `data-marquee-velocity="30"` (sur un `data-marquee`) | subtle | Bande dont la vitesse accélère avec la vélocité de scroll. |
| `data-blur-scrub="12"` (ou `data-scrub="...,blur=12"`) | rich | Flou qui se dissipe progressivement au scroll, transition entre deux blocs. |
| `data-counter-flip="1284"` | subtle | Variante "digit flip" du compteur (chiffres qui basculent un par un). |
| `data-count-bar="76"` (+ `.bar-fill`) | subtle | Barre qui se remplit au scroll, à côté d'un chiffre clé. |
| `data-scroll-progress` | subtle (CSS `scroll-timeline`, repli JS) | Barre de progression de lecture fixée en haut de page. |

## Effets avec dépendance supplémentaire (docs/veille/animations.md § 3, chargés à la demande)

Chaque lib n'est importée (`import()`) que si l'attribut correspondant est présent dans le DOM de la
page (même garde que `rich()`), jamais en `<script>` statique. Nouvelles dépendances : `lenis`, `ogl`,
`@lottiefiles/dotlottie-web`, `canvas-confetti` (toutes en dépendance directe de `package.json`).

| `data-*` | Palier | Lib | Quand l'utiliser |
|---|---|---|---|
| `data-smooth` (sur `<html>`, posé par `Base.astro` depuis `site.smoothScroll`) | rich | Lenis (~3 Ko) | Scroll fluide opt-in pour une direction premium/éditoriale. Jamais par défaut (coûte en INP). Synchronisé avec `ScrollTrigger.update` ; les ancres `#id` utilisent `lenis.scrollTo`. |
| `data-hover-distort="/images/x.webp"` | rich | OGL (~8 Ko) | Distorsion WebGL (ripple) de l'image au survol, `pointer:fine` uniquement. Repli automatique = comportement `data-hover-img` si WebGL indisponible (`try/catch`). |
| `data-draw-svg[="scrub"]` | rich | GSAP DrawSVGPlugin | Trace un `<svg>` inline (logo, schéma, signature) au scroll (une fois) ou en scrub continu (`data-draw-svg="scrub"`). |
| `data-accordion[="single"]` | rich | GSAP Flip | Groupe de `<details>` dont l'ouverture/fermeture anime la hauteur et repositionne les voisins en douceur. `data-accordion="single"` ferme les autres à l'ouverture d'un item. `<details>/<summary>` natif reste le repli sans JS. |
| `data-drag-grid` (+ `.drag-track`) | rich | GSAP Draggable + InertiaPlugin | Piste `.drag-track` glissable, enroulement horizontal infini (contenu dupliqué, même principe que `data-marquee`), tactile. |
| `data-lottie="/anim/x.lottie"` (+ `data-lottie-fallback="/img/x.webp"` optionnel) | rich | `@lottiefiles/dotlottie-web` (WASM, ~500 Ko, jamais sur le chemin critique) | Micro-illustration/loader animé. Repli automatique sur `data-lottie-fallback` (image) ou un texte si le fichier est absent ou ne charge pas (`loadError`). |
| `data-confetti` | subtle + rich | canvas-confetti (~13 Ko) | Confettis au succès d'un formulaire : écoute l'événement `ff:form-success`, déclenché par `ContactForm.astro` dans sa branche succès. Chargé uniquement au moment du déclenchement, jamais préchargé. |
| `data-shader="mesh\|silk\|aurora\|grain-gradient"` (**aurora et grain-gradient INTERDITS**, docs/GOUT.md § 2, `ff ia` alerte) | rich | OGL (même chunk que `data-hover-distort`) + `src/scripts/shader.ts` (~7 Ko, chargé par `import()`, jamais dans `js-initial`) | Fond WebGL lent (période 20-40 s), peu contrasté, aux couleurs de la direction, pour un hero **sans photo** (avocat, ostéo, studio, auto-école… — convention 20, matière sans inventer d'image). Le canvas est créé par le moteur (`position:absolute; inset:0; z-index:0`), la section passe en `position:relative` par CSS, le contenu au-dessus. Couleurs lues uniquement dans `--bg`, `--bg-2`, `--accent`, `--accent-2`, `--fg` (`getComputedStyle`), jamais en dur. Démarre à l'entrée dans l'écran, en pause hors écran et onglet caché, DPR ≤ 1,5, largeur ≤ 1280 px. Repli (`subtle`, `none`, `prefers-reduced-motion`, WebGL absent, contexte perdu) : dégradé CSS statique équivalent posé en `background-image`. **Compte comme le seul feu d'artifice de la page** (`CONVENTIONS.md` règle 16) : jamais avec un marquee, un `data-frames` ou un `data-horizontal`. Veille : `docs/veille/shaders.md`. |
| `data-shader-speed="0.5"` (sur un `data-shader`) | rich | — | Vitesse relative du fond (défaut `1` ; `0.5` = deux fois plus lent, jamais au-dessus de `1` en production). |
| `data-shader-pointer="1"` (sur un `data-shader`) | rich | — | Dérive très douce du motif vers le pointeur (interpolée, `pointer:fine` uniquement, inactive au tactile). |

## Nouveaux effets 100 % CSS (docs/veille/rendu.md § 4.1 et bonus)

| `data-*` | Palier | Quand l'utiliser |
|---|---|---|
| `data-duotone` | subtle | Unifie des photos client hétérogènes : filtre SVG `#ff-duotone` (défini une fois dans `Base.astro`, `feColorMatrix` niveaux de gris) + dégradé `mix-blend-mode: color` (`--ink` → `--accent`). |
| `data-grain` **INTERDIT** (docs/GOUT.md § 2, 15 oct 2026 : signe « fait par une IA » ; `ff ia` alerte ; gardé pour les sites existants) | subtle | Grain de bruit (`feTurbulence`) en overlay sur n'importe quel bloc/image — généralisation du motif déjà utilisé par la direction `atelier` (fond de page). |
| `data-border-beam` | subtle | Bordure conique tournante (`@property --border-beam-angle`), 100 % CSS, pour une carte/CTA qui doit attirer l'œil. |
| `data-reveal-native` | subtle | Variante de `data-reveal` via `animation-timeline: view()` (`@supports`) : zéro JS là où supporté, repli automatique sur le même `IntersectionObserver` que `data-reveal` sinon. Opt-in, ne remplace pas `data-reveal` par défaut. |

## Sequence d'images "page produit" (`data-frames`, effet Apple)

`data-frames="/anim/x/"` (rich, GSAP ScrollTrigger scrub) : une image sequence (WebP) est dessinée
frame par frame sur un `<canvas>`, pilotée par la progression du scroll — l'effet vu sur les pages
produit Apple/luxe (une montre qui tourne, un objet qui se déplie). Markup minimal :

```html
<section
  data-frames="/anim/montre/"
  data-frames-count="60"
  data-frames-ext="webp"
  data-frames-pad="4"
  data-frames-mobile="/anim/montre-mobile/"
  data-frames-poster="/anim/montre/0001.webp"
  data-pin="180"
>
  <canvas data-frames-canvas></canvas>
  <div class="container-ff relative z-[1] h-full flex flex-col justify-center">
    <p data-pin-step>Étape un.</p>
    <p data-pin-step>Étape deux.</p>
  </div>
</section>
```

| Attribut | Obligatoire | Rôle |
|---|---|---|
| `data-frames="/anim/x/"` | oui | Dossier des frames (`ff sequence`/`ff animer` les génèrent). |
| `data-frames-count="60"` | oui | Nombre de frames dans le dossier. |
| `data-frames-ext="webp"` | non (défaut `webp`) | Extension des fichiers. |
| `data-frames-pad="4"` | non (défaut `4`) | Chiffres du nom de fichier (`0001.webp`...). |
| `data-frames-mobile="/anim/x-mobile/"` | non | Dossier de frames plus légères, utilisé sous 767 px. |
| `data-frames-poster="/anim/x/0001.webp"` | non (défaut : frame 1 du dossier actif) | Affichée instantanément, avant tout chargement. |
| `data-frames-lerp="0.12"` | non (défaut `0.12`) | Lissage de la frame courante vers la frame cible, par `requestAnimationFrame` (Trionn) : la séquence « rattrape » la molette au lieu de sauter d'une frame à l'autre à chaque cran. `1` = frame exacte (ancien comportement). |
| `data-pin="400"` (même élément) | recommandé | Épingle la section pendant le scrub ; ses `[data-pin-step]` s'activent avec la même progression. Longueur : 100 % par étape + 100 % (voir `data-pin` ci-dessus) — 48 frames sur 220 % défilaient en trois crans de molette. |

Comportement : le poster se dessine immédiatement (aucune attente réseau visible). Le préchargement
des frames suivantes ne démarre **jamais avant l'événement `load` de la fenêtre**, puis seulement quand
la section entre à moins d'une hauteur d'écran (`IntersectionObserver`), par priorité première/dernière/
milieu puis le reste dans l'ordre. Le canvas est DPR-aware (plafonné à 2) et dessine en `cover` ; la
frame dessinée suit la frame cible par lerp (`data-frames-lerp`) dans une boucle `requestAnimationFrame`
qui s'arrête d'elle-même une fois la cible atteinte. Dans une capture pleine page (`ff captures`), la
piste d'épinglage (`.pin-spacer`) est repliée avant la photo : c'est une longueur de scroll, pas un
visuel. Le tactile fonctionne via le défilement natif
(`ScrollTrigger` le gère déjà, aucun code dédié). Hors `motion="rich"` ou `prefers-reduced-motion` :
**aucune frame n'est préchargée**, seul le poster reste visible via un `<img class="ff-frames-fallback">`
créé en JS (le `<canvas>` est masqué). Démo complète : `sites/_effets/sections/Effets.astro` (bloc
`data-frames`, séquence synthétique 1280/640 px dans `sites/_effets/public/anim/demo(-mobile)/`).

**Production des frames** (`scripts/ff/sequence.mjs`, `scripts/ff/animer.mjs`) :

- `ff sequence <slug> <video.mp4|.mov> [--n 60] [--largeur 1280] [--nom montre]` — extrait N frames
  espacées régulièrement d'une vidéo **sans ffmpeg** (Chrome via `playwright-core`), réencode en WebP
  (desktop + mobile) dans `sites/<slug>/public/anim/<nom>/` et `.../anim/<nom>-mobile/`, affiche la
  taille totale et les attributs `data-frames-*` prêts à coller. Si Chrome ne sait pas décoder le
  fichier (HEVC `.mov` d'iPhone typiquement), affiche la commande `ffmpeg` de repli.
- `ff animer <slug> <image> "<prompt>" [--modele minimax|kling] [--duree 5] [--simuler]` — anime une
  **photo réelle du client** (image-to-video, fal.ai) et suggère d'enchaîner avec `ff sequence` sur la
  vidéo produite. **Règle stricte** (`docs/veille/redaction-images.md` §2.3, `docs/REDACTION.md`) :
  n'anime jamais une image générée ou une photo de banque présentée comme "du client" — uniquement une
  vraie photo de son produit/lieu/réalisation. Marquage AI Act (art. 50) obligatoire sur la section
  qui utilise le résultat : attribut `data-ia="1"` + mention visible ("animation générée à partir d'une
  photo").

## Transitions de page (opt-in, `site.transitions`)

`site.transitions: boolean` (schéma, défaut `false`) ajoute `<ClientRouter />` (`astro:transitions`) dans
`Base.astro` : les navigations internes (accueil ↔ `/services/<slug>`, `/zones/<ville>`, mentions…) se font
sans rechargement, avec l'API View Transitions native (aucune librairie, contrairement à Barba/Swup chez
9 des 41 sites primés de `docs/veille/squelettes.md`). Actif sur `finck-fisch`, `dubois-plomberie` et
`toits-cie` (vérifiés en Chrome : accueil → page service → retour, desktop et mobile, zéro erreur console).

**Transition par défaut** (`global.css`, bloc « Transitions de page ») : fondu 0,3 s sur `--ease-out` ;
la nav (`header[data-nav]`/`nav[data-nav]`, `view-transition-name: ff-nav`) forme son propre groupe et
reste donc en place d'une page à l'autre ; le hero (`#hero`, `ff-hero`) persiste par morph quand la page
cible en a un, sinon il s'efface avec l'ancienne page. `prefers-reduced-motion` : aucune animation
(`::view-transition-*` à `animation: none`). Un seul élément par nom et par page, sinon le navigateur
annule la transition — une nav par page, un hero par page, c'est déjà la règle. Le rideau d'entrée
(`.ff-curtain`, rich) ne joue qu'au premier chargement, jamais à une navigation côté client.

**Ré-armement, sans doublon** — `astro:page-load` se déclenche au chargement initial (sur `load`, après
l'exécution des modules) **et** après chaque navigation ; le document persiste, seul le `<body>` change.
- `motion.ts` (`initMotion`, appelé par `Base.astro` sur cet événement) : chaque page ouvre un
  `AbortController` ; tout écouteur `window`/`document` (scroll de nav, marquee-velocity, scroll-progress,
  `ff:form-success`, resize des séquences et drag-grid, visibilité des shaders) reçoit `{ signal }` et
  est annulé à l'init suivante ; les `ScrollTrigger` de l'ancienne page sont tués (`getAll().kill()`) ;
  Lenis n'est créé qu'une fois par session, seules ses ancres sont re-liées ; les
  `IntersectionObserver` et écouteurs posés sur des éléments partent avec l'ancien body.
- **Scripts inline** (audit du 21 sept. 2026) : Astro regroupe les `<script>` des sections/composants en
  modules exécutés **une fois** par chargement complet — après une navigation, leurs écouteurs ne sont pas
  ré-attachés aux nouveaux éléments. Tous passent donc par `onPage(fn)` (`src/scripts/page.ts` : appel
  direct sans ClientRouter, `astro:page-load` avec) : `Nav/bar`, `Nav/burger` (Escape sur `body`, pas
  `document`), `Nav/floating`, `Nav/split`, `ContactForm`, `ContactDrawer`, `Carte` (façade Google Maps),
  `Proof/before-after`, les coquilles `sidebar`/`split` (sommaire actif), et les navs sur mesure de
  `dubois-plomberie`/`toits-cie`. **Règle** (`docs/CONVENTIONS.md` § Coquilles) : tout nouveau `<script>`
  inline de `src/` ou d'une section sur mesure passe par `onPage()` — `tests/squelettes.test.mjs` échoue
  sinon pour `src/`.
- Sans `transitions`, rien ne change : `onPage` appelle directement, comme avant.

Reste à faire (hors périmètre) : `data-curtain-nav` et `data-view-transition` par élément
(docs/veille/animations.md § 3, lignes 19 et 24) ; avant d'activer `transitions` sur un site à nav sur
mesure qui porte un `<script>`, l'envelopper dans `onPage()`.

## iPhone : vidéo autoplay et images hautes (leçons de sites/finck-fisch, oct. 2026)

- **Mode économie d'énergie = plus aucun autoplay.** `play()` est rejeté ou la vidéo ne démarre jamais,
  même `muted playsinline`. Une démo, une preuve ou un hero qui doit être vu ne repose jamais sur une
  vidéo : images fixes animées en CSS (ou `data-frames`, qui dessine des images dans un canvas), la
  vidéo n'étant qu'un bonus derrière un `poster` qui se suffit à lui-même.
- **Une seule image très haute translatée (`transform`) est floue sur iOS** : la texture GPU est
  plafonnée, Safari la rééchantillonne. Empiler des tuiles de ~1 500 px de haut au plus :
  `ff tuiles <slug>` (`scripts/ff/tuiles.mjs`, 4 tuiles mobile 900 px + 4 desktop 1600 px).
- **Tester iOS sur l'URL https déployée** : contre `ff servir` (http), la CSP
  (`upgrade-insecure-requests`) + HSTS font échouer l'émulation WebKit.
