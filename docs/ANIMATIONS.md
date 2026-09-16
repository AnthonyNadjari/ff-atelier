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

## Effets non retenus pour l'instant

Le reste du tableau `animations.md` § 3 (`data-lenis`, `data-hover-distort`, `data-draw-svg`,
`data-accordion`, `data-drag-grid`, `data-lottie`, `data-curtain-nav`, `data-confetti`,
`data-view-transition`, `data-reveal-native`) n'est pas implémenté : dépendances supplémentaires
(Lenis, OGL, dotLottie, canvas-confetti) ou portée plus large (routeur, accordéon Flip) qui
dépassent cette itération. À reprendre au besoin, un par un, en suivant le même patron (`rich()`
avec garde `querySelector`, repli reduced-motion).
