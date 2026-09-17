# Moteur d'animation — attributs `data-*`

Référence complète des attributs pilotés par `src/scripts/motion.ts` (voir aussi l'en-tête du
fichier et le bloc motion de `src/styles/global.css`). Chaque effet a un repli
`prefers-reduced-motion` (bloc `@media` dans `global.css`) et suit `docs/veille/animations.md` § 5
(performance). Vitrine complète, un humain qui fait défiler une page : `sites/_effets/`
(`SITE=_effets node node_modules/astro/astro.js build` puis `node scripts/ff.mjs captures _effets`).

`site.motion` : `none` (rien), `subtle` (défaut, zéro dépendance), `rich` (+ GSAP chargé à la
demande, seulement si un `data-*` correspondant est présent dans le DOM de la page).

## Attributs existants

| `data-*` | Palier | Quand l'utiliser |
|---|---|---|
| `data-reveal` (`left/right/scale/blur/clip/wipe/mask`) | subtle | Apparition au scroll d'un bloc, titre ou image. |
| `data-reveal-delay="120"` | subtle | Décale une apparition individuelle (ms). |
| `data-stagger="90"` | subtle | Cascade sur les enfants directs d'un conteneur (grille, liste). |
| `data-counter="248"` `data-suffix="+"` | subtle | Chiffre clé qui compte au scroll. |
| `data-marquee="30s"` | subtle | Bande défilante infinie (logos, villes, mots-clés). |
| `data-draw` | subtle | Trait (hr/span) qui se trace au scroll. |
| `data-parallax="0.2"` | rich | Déplacement vertical léger d'une image/bloc au scroll. |
| `data-magnetic="0.3"` | rich | Bouton qui suit légèrement le curseur. |
| `data-tilt="8"` | rich | Carte inclinée en 3D au survol. |
| `data-scrub="scale=1.15,rotate=4,x=-20,y=10,opacity=0.3,blur=12"` | rich | Anime un état de départ vers l'état normal, piloté par le scroll. |
| `data-pin="120"` (+ `data-pin-step`) | rich | Épingle une section pendant N % de hauteur d'écran, étapes activées tour à tour. |
| `data-horizontal` (+ `.h-track`) | rich | Piste qui défile horizontalement pendant le scroll vertical (desktop ≥ 64rem). |
| `data-text-fill` | rich | Texte qui se remplit mot par mot au scroll. |
| `data-split` / `data-split="chars"` | rich | Titre découpé en mots (défaut) ou en caractères, révélé en cascade. |
| `data-hover-img="/images/x.webp"` | rich | Une image flotte près du curseur pendant le survol (pointer fin). |

## Nouveaux effets (docs/veille/animations.md § 3)

| `data-*` | Palier | Quand l'utiliser |
|---|---|---|
| `data-sticky-stack` | subtle (+ assombrissement en rich) | Sections qui se superposent en restant collées (storytelling, étapes de fabrication). |
| `data-stack` | rich | Cartes qui s'épinglent puis se tassent l'une après l'autre (portfolio, process). |
| `data-scramble="900"` | subtle (vanilla) / rich (ScrambleTextPlugin) | Chiffre clé ou accroche qui se "décode" à l'entrée. |
| `data-spotlight` | subtle | Halo lumineux qui suit le curseur dans une section sombre (CTA), pointer fin uniquement. |
| `data-tilt-glare` (sur un `data-tilt`) | rich | Ajoute un reflet lumineux qui suit le curseur sur une carte inclinée. |
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

## Nouveaux effets 100 % CSS (docs/veille/rendu.md § 4.1 et bonus)

| `data-*` | Palier | Quand l'utiliser |
|---|---|---|
| `data-duotone` | subtle | Unifie des photos client hétérogènes : filtre SVG `#ff-duotone` (défini une fois dans `Base.astro`, `feColorMatrix` niveaux de gris) + dégradé `mix-blend-mode: color` (`--ink` → `--accent`). |
| `data-grain` | subtle | Grain de bruit (`feTurbulence`) en overlay sur n'importe quel bloc/image — généralisation du motif déjà utilisé par la direction `atelier` (fond de page). |
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
| `data-pin="180"` (même élément) | recommandé | Épingle la section pendant le scrub ; ses `[data-pin-step]` s'activent avec la même progression (voir `data-pin` ci-dessus). |

Comportement : le poster se dessine immédiatement (aucune attente réseau visible). Le préchargement
des frames suivantes ne démarre **jamais avant l'événement `load` de la fenêtre**, puis seulement quand
la section entre à moins d'une hauteur d'écran (`IntersectionObserver`), par priorité première/dernière/
milieu puis le reste dans l'ordre. Le canvas est DPR-aware (plafonné à 2) et dessine en `cover` ; le
dessin est throttlé en `requestAnimationFrame`. Le tactile fonctionne via le défilement natif
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

## Transitions de page (opt-in, infrastructure partielle)

`site.transitions: boolean` (schéma, défaut `false`) ajoute `<ClientRouter />` (`astro:transitions`) dans
`Base.astro` et fait écouter l'init du moteur d'animation sur `astro:page-load` plutôt que de l'appeler
une seule fois au chargement (cet événement se déclenche au chargement initial **et** après chaque
navigation côté client quand `<ClientRouter />` est présent — pas de double-init).

**Limite connue, assumée** : cette itération pose l'infrastructure (schéma, `LOOK_KEYS`, `ClientRouter`,
ré-écoute de `initMotion`) mais n'audite pas les `<script>` inline des sections/composants (nav, formulaire,
compare slider...) qui attachent leurs écouteurs une seule fois au chargement — une navigation côté client
ne les ré-exécute pas. `data-curtain-nav` et `data-view-transition` (docs/veille/animations.md § 3, lignes
19 et 24) restent donc non implémentés : ils dépendent de cet audit. À réserver pour l'instant aux sites
mono-page/landing (une seule route réelle, comme la plupart des sites `ff-atelier`), où l'absence de
navigation interne rend la limite sans effet ; à compléter avant d'activer `transitions` sur un site
multi-pages (`seo.cityPages`, `/services/<slug>`...).
