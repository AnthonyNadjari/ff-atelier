# Veille — animations web 2025-2026

Contexte : ff-atelier est un système Astro 5.18 + Tailwind 4.3 générant des sites vitrines
**statiques**. Le moteur d'animation actuel (`src/scripts/motion.ts`, 267 lignes) pilote tout par
attributs `data-*` lus par `src/styles/global.css` :

- **`data-motion="none"`** : aucune animation.
- **`data-motion="subtle"`** (défaut) : `data-reveal` (+ variantes `left/right/scale/blur/clip/wipe/mask`),
  `data-stagger`, `data-counter`, `data-marquee`, `data-draw`, nav au scroll. Zéro dépendance —
  tout en `IntersectionObserver` + CSS.
- **`data-motion="rich"`** : charge GSAP 3.15 + ScrollTrigger **à la demande** (`import()`), ajoute
  `data-parallax`, `data-magnetic`, `data-tilt`, `data-scrub`, `data-pin` (+ `data-pin-step`),
  `data-horizontal`, `data-text-fill`, `data-split` (mots), `data-hover-img`, le rideau d'entrée
  `.ff-curtain`, et un `script.ts` optionnel par direction.

`gsap` est déjà en dépendance (`^3.15.0`), `astro` en `^5.18.2`, `tailwindcss` en `^4.3.3`
(`package.json`). `prefers-reduced-motion` est déjà respecté partout (motion.ts ligne 13-17,
global.css ligne 202-211). Cette veille propose comment étendre ce système sans le dénaturer :
rester statique, léger, mobile-first, et 100 % piloté par `data-*`.

---

## 1. Inventaire des bibliothèques

Légende verdict : **adopter** = mérite d'entrer dans `motion.ts` ou d'être proposé en opt-in par
direction · **optionnel** = utile dans des cas précis, à charger au cas par cas, jamais par défaut ·
**éviter** = redondant avec l'existant, mal maintenu, licence inadaptée, ou trop lourd pour le budget
Lighthouse 90+.

### GSAP et son écosystème

| Lib | Rôle | Taille (gzip) | Licence | Compat Astro | Maintenance | Verdict |
|---|---|---|---|---|---|---|
| **GSAP core** | Moteur de tweens/timelines | ~23-27 Ko selon config de build | **100 % gratuite depuis le 30 avril 2025** (Webflow a racheté GreenSock fin 2024 et a rendu GSAP + tous les plugins gratuits, y compris en usage commercial) [Webflow blog](https://webflow.com/blog/gsap-becomes-free), [CSS-Tricks](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/), [GSAP 3.13 release](https://gsap.com/blog/3-13/) | Import ESM natif, déjà utilisé en `import()` différé | Très active (Webflow finance l'équipe GreenSock) | **adopter** (déjà en place) |
| **ScrollTrigger** | Scroll-linked (pin, scrub, parallax) | +~7 Ko | Gratuit (idem) | OK | Active | **adopter** (déjà en place) |
| **ScrollSmoother** | Smooth-scroll intégré GSAP (remplace Lenis dans l'écosystème GSAP) | +~10 Ko | Gratuit depuis 2025 | OK mais nécessite un wrapper DOM (`#smooth-wrapper`/`#smooth-content`), moins trivial en Astro islands multiples | Active | **optionnel** — Lenis reste plus simple à brancher en `data-*` |
| **SplitText** | Découpe mots/lignes/caractères, réécrite en 2025 (-50 % de poids, accessibilité clavier/lecteur d'écran native, masking intégré) | ~4 Ko | Gratuit depuis 2025 | OK | Active | **adopter** — remplace avantageusement le découpage mot-par-mot fait à la main dans `splitText()` (motion.ts l.154-181) si on veut aller au caractère |
| **Flip** | Transitions FLIP (avant/après DOM) | petit | Gratuit | OK | Active | **adopter** — parfait pour accordéons, cartes qui s'agrandissent, grilles qui se réordonnent |
| **MorphSVG** | Morph entre tracés SVG | petit | Gratuit | OK | Active | **optionnel** — usage ponctuel (logos, icônes animées) |
| **DrawSVG** | Trace de tracés SVG complexes (multi-path) | petit | Gratuit | OK | Active | **optionnel** — le `data-draw` maison (scaleX CSS) suffit pour un simple trait ; DrawSVG vaut le coup pour des tracés multi-segments (signatures, cartes, schémas) |
| **Observer** | Détection unifiée wheel/touch/pointer | petit | Gratuit | OK | Active | **optionnel** — utile pour des interactions type slideshow plein écran |
| **ScrambleText** | Effet de texte qui « décode » lettre par lettre | petit | Gratuit | OK | Active | **adopter** — cf. proposition `data-scramble` en section 3 |

Restriction à connaître : la licence standard GSAP interdit un seul usage — construire *un outil
no-code qui laisse des utilisateurs tiers composer des animations visuellement*, en concurrence avec
le constructeur visuel de Webflow. Un usage normal (sites clients avec animations codées) est couvert
sans réserve ; le studio n'a rien à changer. [GSAP Standard License](https://gsap.com/community/standard-license/)

### Smooth scroll

| Lib | Rôle | Taille | Licence | Maintenance | Verdict |
|---|---|---|---|---|---|
| **Lenis** | Smooth-scroll (roue de souris, inertie), pilote aussi ScrollTrigger/WebGL depuis une seule boucle rAF | **~3 Ko gzip** (sous les 5 Ko) | MIT | Très active (darkroom.engineering), testée sur Lenis 1.3.x + GSAP 3.12+ en 2026 [lenis.dev](https://lenis.dev/), [GitHub](https://github.com/darkroomengineering/lenis) | **adopter en opt-in** (`data-lenis`, jamais par défaut — voir section 3) |
| **Locomotive Scroll** | Smooth-scroll + détection viewport + parallax data-attributes | plus lourd que Lenis | MIT | Ambiguë : le paquet historique `@studio-freight/locomotive-scroll` est **déprécié** (« Package no longer supported »). Le paquet `locomotive-scroll` (v5.0.1) reçoit encore des mises à jour occasionnelles (~14 k téléchargements/semaine) mais des utilisateurs le signalent comme quasi à l'arrêt [npm](https://www.npmjs.com/package/locomotive-scroll), [GitHub issues](https://github.com/locomotivemtl/locomotive-scroll/issues) | **éviter** — Lenis fait la même chose, plus léger, mieux maintenu |

### Animation générale (alternatives à GSAP)

| Lib | Rôle | Taille | Licence | Maintenance | Verdict |
|---|---|---|---|---|---|
| **Motion** (motion.dev, ex-Framer Motion) | Moteur d'animation, cœur vanilla JS framework-agnostic depuis la v11 | Core vanilla **~12 Ko gzip** (version mini HTML/SVG : 2,3 Ko) ; build React (`framer-motion`) ~31 Ko | MIT | Active, éditeur dédié (motion.dev) | **optionnel** — n'apporte rien que GSAP ne fasse déjà ; seul intérêt : bundle plus petit pour un site n'utilisant *que* des animations DOM simples sans scroll-trigger. Redondant ici puisque GSAP est déjà en place et gratuit |
| **anime.js v4** | Moteur d'animation léger, API simple | **6,2 Ko** (vs ~27 Ko pour GSAP core) ; split-text intégré au cœur depuis juillet 2025 ; anime des scènes three.js depuis 4.5.0 | MIT | Active | **éviter** dans ce projet — doublon fonctionnel de GSAP (déjà en dépendance), n'apporte pas de fonctionnalité manquante |

### Carrousels / sliders

| Lib | Rôle | Taille | Licence | Maintenance | Verdict |
|---|---|---|---|---|---|
| **Swiper** | Carrousel touch complet (le plus riche en features) | Cœur modulaire, tree-shakable ; v14.2.0 (août 2026) | MIT | Très active [swiperjs.com](https://swiperjs.com/) | **optionnel** — à réserver aux sites avec vraie galerie/portfolio ; trop de features pour un simple carrousel d'avis |
| **Splide** | Carrousel accessible, TypeScript, zéro dépendance | ~27 Ko | MIT | Active (v4) [GitHub](https://github.com/Splidejs/splide) | **optionnel** — bon compromis accessibilité/poids si Embla ne suffit pas |
| **Embla Carousel** | Carrousel minimaliste, agnostique de framework | **~7 Ko gzip** | MIT | Très active (~800 k téléchargements/semaine, v9 en RC en 2026) [embla-carousel.com](https://www.embla-carousel.com/) | **adopter en opt-in** — le meilleur rapport poids/contrôle pour une galerie ou un carrousel de témoignages piloté en `data-*` |
| **Keen Slider** | Carrousel avec drag natif, léger | ~14 Ko gzip (~26 Ko min) | MIT | Active | **optionnel** — alternative à Embla, moins populaire |

### Lottie / animations vectorielles design

| Lib | Rôle | Taille | Licence | Maintenance | Verdict |
|---|---|---|---|---|---|
| **lottie-web** | Lecteur Lottie classique (JSON After Effects/Bodymovin) | ~130 Ko gzip (connu, pas de source 2026 exacte) | MIT | Toujours maintenu, mais successeur = dotLottie | **optionnel** — préférer dotLottie pour tout nouveau projet |
| **dotLottie** (`@lottiefiles/dotlottie-web`) | Lecteur Lottie/dotLottie nouvelle génération, moteur Rust+WASM (ThorVG), rendu Software/WebGL2/WebGPU | Format `.lottie` compressé (zip) plus petit que le JSON brut ; moteur WASM ~500 Ko (chargé une fois, mis en cache CDN) | MIT | Très active, mise à jour début septembre 2026 [dotlottie.io](https://dotlottie.io/), [GitHub](https://github.com/lottiefiles/dotlottie-web) | **adopter en opt-in** pour un loader ou une micro-illustration animée (`data-lottie`, chargement paresseux) — jamais pour un hero critique (poids WASM) |

### Rive / Three.js / Spline / 3D-WebGL générique

| Lib | Rôle | Taille | Licence | Maintenance | Verdict |
|---|---|---|---|---|---|
| **Rive** | Runtime pour animations interactives (state machines), fichiers `.riv` très compacts | Fichiers `.riv` << vidéo/GIF/Lottie JSON ; runtime web = API JS haut niveau + WASM bas niveau | MIT (runtimes) [GitHub rive-app/rive-runtime](https://github.com/rive-app/rive-runtime) | Active, roadmap 2026 orientée doc/onboarding | **optionnel** — excellent si un client a un budget motion-design dédié (mascotte interactive, micro-états) ; sinon trop de mise en place pour un site vitrine |
| **Three.js** | Moteur WebGL 3D complet | Modulaire (tree-shakable), r180 en 2026 | MIT | Extrêmement active | **optionnel** — uniquement pour un hero 3D signature, chargé en île isolée, jamais dans le bundle global. Astro s'y prête bien (hydrater seulement le canvas) [threejsresources.com](https://threejsresources.com/frameworks/three-js-astro) |
| **Spline runtime** (`@splinetool/runtime`) | Lecture de scènes 3D créées dans l'éditeur Spline | Package npm dédié (`@splinetool/runtime`, v1.12.x) | Non confirmée avec certitude via la doc publique — à vérifier au cas par cas avant usage commercial (le player `<spline-viewer>` charge du code tiers hébergé par Spline) [npm](https://www.npmjs.com/package/@splinetool/runtime) | Active | **éviter en défaut** — dépendance à l'éditeur propriétaire Spline, poids et gouvernance de licence moins clairs que Three.js ; à réserver à une demande client explicite avec vérification de licence au moment T |
| **Vanta.js** | Fonds animés WebGL/three.js ou p5.js prêts à l'emploi (vagues, réseau de points, brouillard...) | **~120 Ko gzip additionnels** (essentiellement le poids de three.js) | MIT | Active (mise à jour août 2026) [vantajs.com](https://www.vantajs.com/) | **optionnel** — sympa pour un hero, mais 120 Ko pour un fond animé est cher sur mobile ; réserver aux directions où l'identité visuelle le justifie, avec garde `pointer:fine`/`prefers-reduced-motion` |
| **tsParticles** | Particules configurables (confettis, réseaux, neige...) | Modulaire (`slim`, `basic`...), bundle complet ~209 Ko zip, mais les bundles allégés sont bien plus petits | MIT | Très active (v4.4.0, fin août 2026) [GitHub releases](https://github.com/matteobruni/tsparticles/releases) | **optionnel** — à charger uniquement en preset `slim`/`basic` et en lazy, jamais le bundle complet |

### Transitions de page

| Lib | Rôle | Taille | Licence | Maintenance | Verdict |
|---|---|---|---|---|---|
| **Barba.js** | Transitions de page AJAX (SPA-like sur site MPA) | ~10 Ko | MIT | **v1 non maintenue** ; v2 vit surtout via sponsoring, activité faible [GitHub issues](https://github.com/barbajs/barba/issues) | **éviter** — remplacé par la solution native ci-dessous |
| **Astro View Transitions / `<ClientRouter />`** | Routeur client natif Astro : intercepte les liens, échange le DOM, transitions CSS/View-Transitions-API, événements `astro:after-swap` / `astro:page-load` | Intégré à Astro, poids marginal | MIT (Astro) | Très active, cœur du framework [docs Astro](https://docs.astro.build/en/guides/view-transitions/) | **adopter** — c'est la bonne réponse 2026 à ce que Barba.js faisait en 2018, sans dépendance externe, et compatible SSG stricte |

### Texte / typographie animée

| Lib | Rôle | Taille | Licence | Maintenance | Verdict |
|---|---|---|---|---|---|
| **SplitType** | Découpe texte en lignes/mots/caractères pour animation | Très léger (~3 Ko) | MIT, maintenu par lukePeavey [GitHub](https://github.com/lukePeavey/SplitType) | Active mais discrète | **éviter** — redondant : GSAP SplitText fait strictement mieux et est gratuit depuis 2025 ; garder la découpe maison en `data-split` pour le tier "subtle" |
| **Typed.js** | Effet machine à écrire | Léger | ⚠️ **MIT jusqu'à la v2**, mais **la v3.0.0 (janvier 2026) introduit une double licence GPL / commerciale** — à vérifier avant tout usage client payant [SourceForge/npm mirrors](https://sourceforge.net/projects/typed-js.mirror/) | Active (mise à jour janv. 2026) | **éviter** en dépendance — le changement de licence est un risque pour un studio qui livre du code à des clients ; réimplémenter l'effet typewriter en 20 lignes JS natif si demandé |

### Reveal-on-scroll (redondants avec l'existant)

| Lib | Rôle | Taille | Licence | Maintenance | Verdict |
|---|---|---|---|---|---|
| **Rellax.js** | Parallax léger par `data-rellax-speed` | **~1 Ko gzip** (1021 octets) | MIT [dixonandmoe.com/rellax](https://dixonandmoe.com/rellax/) | Stable, peu de changements nécessaires | **éviter** — `data-parallax` (GSAP/ScrollTrigger) fait déjà ça avec plus de contrôle ; ajouter Rellax dupliquerait la responsabilité |
| **AOS** (Animate On Scroll) | Reveal au scroll par attributs | — | MIT | **Quasi à l'arrêt** depuis 2018-2024, alternatives plus récentes recommandées (Trig.js ~4 Ko, Sal.js ~9 Ko, Usal.js) [sources 2026](https://cssauthor.com/best-javascript-scroll-animation-scrollytelling-libraries/) | **éviter** — fonctionnalité déjà couverte nativement par `data-reveal`/`IntersectionObserver` |
| **ScrollReveal.js** | Reveal au scroll, v4 en dev actif | — | **GPL + licence commerciale** (22,5 k ⭐) [scrollrevealjs.org](https://scrollrevealjs.org/) | Active | **éviter** — licence copyleft à double titre non désirable pour du code livré à des clients, et fonctionnalité déjà native ici |

### Effets de survol / carte 3D

| Lib | Rôle | Taille | Licence | Maintenance | Verdict |
|---|---|---|---|---|---|
| **Atropos** | Tilt 3D + parallax multi-couches au survol, tactile | Léger | MIT, par l'auteur de Swiper (nolimits4web) [atroposjs.com](https://atroposjs.com/) | Active | **optionnel** — surclasse le `data-tilt` maison pour un effet multi-couches (glare, profondeur par élément enfant) ; à envisager comme évolution de `data-tilt` (section 3) plutôt qu'en dépendance ajoutée |

### Dessin / texte manuscrit / sketch

| Lib | Rôle | Taille | Licence | Maintenance | Verdict |
|---|---|---|---|---|---|
| **Vara.js** | Simule une écriture manuscrite en SVG | Léger | Licence permissive (npm `vara`) | ⚠️ v1 (SVG) va être remplacée par une v2 (canvas), changements de rupture annoncés [akzhy.com](https://akzhy.com/shelf/vara/) | **optionnel**, niche — utile uniquement pour une signature/logo manuscrit ponctuel ; vérifier la version avant usage |
| **Rough.js** | Graphismes « esquissés » à la main (Canvas/SVG) | **< 9 Ko** | MIT [roughjs.com](https://roughjs.com/) | Publications espacées mais dispo sur JSR en 2026 | **optionnel**, niche — pertinent seulement pour une direction visuelle "atelier/croquis" explicite |

### Physique / creative coding

| Lib | Rôle | Taille | Licence | Maintenance | Verdict |
|---|---|---|---|---|---|
| **Matter.js** | Moteur physique 2D (corps rigides) | 0 dépendance | MIT [brm.io/matter-js](https://brm.io/matter-js/) | Active | **éviter** par défaut — hors budget perf d'un site vitrine ; réservé à une expérience interactive demandée explicitement |
| **p5.js** | Creative coding (canvas génératif) | — | **LGPL v2.1** (maintenu par des bénévoles) [p5js.org](https://p5js.org/) | Active | **éviter** — licence LGPL moins simple à concilier avec du code client livré tel quel, API pensée pour l'apprentissage plus que pour la prod, canvas peu accessible |
| **Paper.js** | Scripting vectoriel (Canvas) | — | MIT [paperjs.org/license](http://paperjs.org/license/) | Active (mises à jour juin 2026) | **optionnel**, niche — pour un éditeur vectoriel interactif, pas pour une animation de section |

### Distorsion d'image / WebGL "curseur"

| Lib | Rôle | Taille | Licence | Maintenance | Verdict |
|---|---|---|---|---|---|
| **curtains.js** | Transforme des éléments DOM (image/vidéo) en plans WebGL texturés, shaders custom | Léger, vanilla | MIT, par Martin Laxenaire [curtainsjs.com](https://www.curtainsjs.com/) | Toujours documentée/maintenue | **optionnel** — bonne base pour un effet de distorsion image au survol si on veut éviter Three.js complet |
| **OGL** | Micro-librairie WebGL (API proche de Three.js, zéro dépendance) | **~8 Ko gzip** | Permissive (dépôt `oframe/ogl`) [GitHub](https://github.com/oframe/ogl) | Maintenue par la communauté (fork TS actif) | **adopter en opt-in** — le meilleur choix poids/contrôle pour implémenter soi-même `data-hover-distort` (section 3) sans charger Three.js entier |
| **hover-effect** (robin-dela) | Effet de distorsion au survol prêt à l'emploi (image displacement) | Dépendances embarquées : **three.js + TweenMax (GSAP v2, obsolète)** | MIT [GitHub](https://github.com/robin-dela/hover-effect) | Peu de mises à jour, dépendances datées | **éviter tel quel** — la technique (displacement map) vaut le coup, mais le code doit être réécrit avec OGL/Three.js actuel + GSAP 3 plutôt qu'installé tel quel |

### Effets "showcase" / curseur / texte / chiffres

| Lib | Rôle | Taille | Licence | Maintenance | Verdict |
|---|---|---|---|---|---|
| **Shery.js** | Effets « waouh » clé-en-main (masking, distorsion 3D, curseur) construits sur Three.js | Dépend de Three.js en interne | MIT [GitHub sheryianscodingschool/sheryjs](https://github.com/sheryianscodingschool/sheryjs) | Communauté restreinte (projet pédagogique) | **éviter** — utile pour s'inspirer/apprendre, pas assez éprouvé en prod pour un livrable client ; préférer réimplémenter le sous-ensemble utile avec GSAP+OGL |
| **Blobity** | Curseur personnalisé "blob" animé | Petit | Licence ouverte (dépôt `gmrchk/blobity`, v0.2.4) [blobity.gmrchk.com](https://blobity.gmrchk.com/) | Activité faible | **éviter en dépendance** — un curseur spotlight/magnétique (`data-spotlight`, section 3) se code en ~30 lignes vanilla ; pas besoin d'une lib dédiée |
| **Odometer** | Chiffres qui "roulent" comme un compteur mécanique | — | MIT (HubSpot) | **Maintenance faible**, manipule lourdement le DOM | **éviter** — `data-counter` existe déjà (motion.ts l.103-126) ; l'étendre pour un rendu "digit flip" en CSS (section 3) plutôt qu'ajouter une dépendance |
| **Vivus.js** | Dessin de tracés SVG animés | — | MIT | **Non maintenue** (dernière version il y a ~5 ans) [SourceForge/npm mirror](https://www.npmjs.com/package/vivus) | **éviter** — remplacé par `data-draw` (CSS) pour les cas simples et par GSAP DrawSVG (gratuit) pour les tracés complexes |
| **canvas-confetti** | Confettis performants (Canvas) | **~13 Ko** | ISC (permissive, proche MIT) [GitHub catdad/canvas-confetti](https://github.com/catdad/canvas-confetti) | Maintenue, dernières releases fin 2025 | **optionnel** — parfait en chargement paresseux pour un micro-moment (succès de formulaire), jamais préchargé |

---

## 2. Plateforme web native 2025-2026 : ce qui remplace du JS

Le CSS natif a rattrapé une bonne partie de ce que motion.ts fait aujourd'hui en JS. Résumé des
fonctionnalités et de leur support navigateur réel (pas la promesse marketing) :

| Fonctionnalité | Support 2026 | Remplace | Notes |
|---|---|---|---|
| **`animation-timeline: scroll()` / `view()`** (scroll-driven animations) | Chrome/Edge 115+, Safari 26+ (vérifié le 15 oct 2026 sur webkit.org : pas 18). **Firefox encore derrière un flag en version stable** mi-2026 (actif seulement dans Nightly) — pas encore Baseline "Widely available" | `data-parallax`, `data-scrub`, une partie de `data-reveal` | Utilisable en *progressive enhancement* via `@supports (animation-timeline: scroll())`, avec le comportement actuel (IntersectionObserver/GSAP) en repli. Zéro JS, tourne sur le compositeur → excellent pour l'INP. [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations), [Chrome blog](https://developer.chrome.com/blog/scroll-triggered-animations) |
| **View Transitions API (cross-document)** | Chrome 126+, Safari 18.2+ (macOS/iOS). **Firefox toujours derrière un flag** en 2026, y compris pour les transitions same-document dans les versions plus anciennes (same-document dispo depuis Firefox 144) | Barba.js et équivalents | Astro `<ClientRouter />` s'appuie déjà dessus avec repli automatique — aucune raison de l'implémenter à la main. MDN qualifie explicitement le cross-document de non-Baseline. [caniuse](https://caniuse.com/cross-document-view-transitions), [MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) |
| **`@starting-style`** | Baseline "Widely available" depuis août 2024 (Chrome 117+, support large ensuite) | Animer un `display:none → block` ou un élément fraîchement monté (popover, modales) sans JS | Bon candidat pour un futur `data-mount-in` sur les popovers |
| **`popover` (attribut HTML + API)** | **Baseline "Widely available" depuis avril 2025** (Chrome/Edge depuis 2023, Safari 17.4+, Firefox 125+) | Petites libs de dropdown/tooltip maison | Fiable en prod pour menus, tooltips légers |
| **CSS anchor positioning** (`anchor()`, `position-anchor`, `@position-try`) | **Baseline depuis janvier 2026**, ~81 % de couverture globale. Firefox 132+, Safari le cœur depuis 18.2 (le flip auto `@position-try` demande 18.4+) | Popper.js / Floating UI pour tooltips et menus positionnés | Encore des nuances Safari (18.2-18.3 : positionnement correct mais pas de flip auto) — tester avant de retirer tout JS de positionnement |
| **`text-wrap: balance` / `pretty`** | `balance` : Safari 17.5+, Firefox 121+, Chrome/Edge 130+ (déjà utilisé en dur dans `global.css` l.84 pour les titres). `pretty` : Chrome/Edge/Opera seulement, **pas encore Firefox** en 2026 | Équilibrage manuel des titres | Déjà en place pour `h1/h2/h3` ; `pretty` (l.86, sur `p`) reste une amélioration progressive silencieuse en cas de non-support |
| **Container queries** (`container-type`, `cqw`...) | **Baseline depuis 2023** pour les size queries, ~90 % de couverture. Les *style queries* restent partielles (Firefox à la traîne) | Media queries pour composants réutilisables (sections) | Directement utile pour les composants `src/sections/**` qui doivent s'adapter à leur conteneur (shell) plutôt qu'au viewport |
| **`:has()`** | Support large depuis décembre 2023 (Chrome/Edge 105+, Firefox 121+, Safari 15.4+) | Petits scripts de détection d'état parent | Peut simplifier des sélecteurs actuellement gérés en JS (ex. `nav:has(.is-open)`) |
| **`color-mix()`** | Chrome/Edge 111+, Firefox 113+, Safari 16.2+, ~94 % de couverture globale | Pré-calcul de teintes accent/hover en JS/build-time | Utile pour dériver `--accent-2` dynamiquement plutôt que de le figer par direction |
| **`linear()` easing** | Baseline "Widely available" depuis décembre 2023 | Certaines easings custom GSAP simples | Permet des courbes d'accélération multi-segments en CSS pur, sans lib |
| **`scroll-snap-*`** | Très large support, **~97 % de couverture globale**, supporté depuis Chrome 69/Safari 11/Firefox 68 | Une partie des carrousels JS | Combiné à `scroll-timeline`, permet des carrousels CSS purs pour les cas simples |
| **`@property`** | **~95 % de couverture**, Chrome 85+, Firefox 128+, Safari 16.4+ | Interpolation de gradients/angles custom | Permet d'animer des `--custom-properties` typées (angle, couleur) en CSS pur — utile pour un `data-spotlight` 100 % CSS |

**Lecture pour ff-atelier** : les scroll-driven animations et les cross-document view transitions ne
sont *pas encore* assez universelles pour remplacer entièrement ScrollTrigger/`ClientRouter` — Firefox
reste le point de blocage sur les deux. En revanche `:has()`, `color-mix()`, `linear()`, container
queries, `@property` et `text-wrap` sont déjà solides et peuvent réduire le JS "subtle" dès
maintenant. Stratégie recommandée : offrir les deux chemins via `@supports (animation-timeline:
scroll())`, CSS natif si dispo, fallback IntersectionObserver/GSAP sinon — exactement le modèle déjà
en place avec `prefers-reduced-motion`.

---

## 3. Proposition concrète : 25 effets à ajouter à `motion.ts`

Convention conservée : chaque effet est un `data-*`, "subtle" reste zéro dépendance / CSS pur,
"rich" peut s'appuyer sur GSAP (déjà chargé en `import()` dans `rich()`, motion.ts l.183) ou sur une
micro-lib chargée à la demande **uniquement si l'attribut est présent dans le DOM** (même pattern que
`rich()` l.184 : `document.querySelector('[data-x]')` avant d'importer quoi que ce soit).

| # | `data-*` | Effet | Implémentation | Coût | Quand l'utiliser | Repli `reduced-motion` |
|---|---|---|---|---|---|---|
| 1 | `data-lenis` (sur `<html>` ou un conteneur) | Smooth-scroll opt-in | Lib **Lenis** (~3 Ko), importée dynamiquement seulement si l'attribut est posé ; câblée sur `ScrollTrigger.update` pour rester synchro avec le pin/scrub existant | +3 Ko, en tier "rich" seulement | Direction "premium"/éditorial qui veut un scroll plus doux ; jamais par défaut (coûte en INP sur bas de gamme) | Lenis désactivé si `reduced` ; scroll natif du navigateur |
| 2 | `data-hover-distort="/images/x.webp"` | Distorsion WebGL de l'image au survol (displacement map) | **OGL** (~8 Ko) : plan texturé + shader de displacement, mêmes events que `hoverImages()` existant (l.56-76) | +8 Ko, "rich", `pointer:fine` uniquement | Hero produit/portfolio artisanal (photo de pièce, matière) | Fallback = `data-hover-img` existant (image flottante simple, déjà en place) |
| 3 | `data-draw-svg` | Trace un `<svg>` multi-tracés (logo, carte, schéma) au scroll | GSAP **DrawSVG** (gratuit), `scrollTrigger` scrub | +petit, "rich" | Logo animé, schéma d'atelier, signature vectorielle complexe | `data-draw` CSS existant reste pour les traits simples ; sinon tracé affiché plein d'emblée |
| 4 | `data-scramble` | Le texte "se décode" lettre par lettre avant de se stabiliser | GSAP **ScrambleText** (gratuit) si `rich`, sinon petite fonction vanilla (setInterval sur caractères aléatoires, ~15 lignes, tier "subtle") | quasi nul en subtle | Chiffre clé, accroche, nombre d'années d'expérience | Texte final affiché directement, sans scramble |
| 5 | `data-counter-flip` | Variante "digit flip" (odomètre) du `data-counter` existant | Étendre `counters()` (motion.ts l.103-126) : au lieu de `textContent`, wrap chaque chiffre dans `<span>` et anime `translateY` en CSS/GSAP | quasi nul | Stat clé (nombre de clients, années) avec un rendu plus "mécanique" | Identique à `data-counter` : valeur finale affichée directement |
| 6 | `data-stack` | Cartes qui s'empilent en scrollant (chacune se pose sur la précédente) | ScrollTrigger avec `pin` par carte + `scale`/`y` progressifs (variante de `data-pin`, l.228-236) | inclus (déjà GSAP) | Étapes d'un process, portfolio de réalisations | Cartes affichées en liste verticale classique |
| 7 | `data-sticky-stack` | Sections sticky qui se superposent (chaque section reste collée pendant que la suivante arrive par-dessus) | `position: sticky` CSS pur + `z-index` croissant (zéro JS) ; amélioration "rich" optionnelle avec assombrissement au scroll via `data-scrub` existant | quasi nul (CSS pur) | Storytelling en sections (savoir-faire, étapes de fabrication) | Comportement sticky reste identique (pas d'animation liée au motion) |
| 8 | `data-split="chars"` | Variante caractère-par-caractère du split existant (aujourd'hui mot-par-mot, l.154-181) | Ajouter un mode dans `splitText()` : découpage par caractère au lieu de mot, même mécanisme `--i-delay` | quasi nul | Gros titres courts (logo-type, mot d'accroche) | Repli sur texte plein (identique à l'existant) |
| 9 | `data-blur-scrub` | Flou qui se dissipe progressivement au fil du scroll (au lieu d'un seuil binaire comme `data-reveal="blur"`) | `data-scrub` existant (l.208-215) avec `filter: blur()` ajouté à la liste de props interpolées | quasi nul (déjà GSAP) | Transition douce entre deux blocs de contenu | `filter: none` directement (déjà couvert par la règle `reduced-motion` globale l.202-211) |
| 10 | `data-tilt-glare` | Extension de `data-tilt` (l.246-256) : ajoute un reflet lumineux qui suit le curseur | Un `<span class="tilt-glare">` positionné en `background-position` calculé sur `px/py` déjà calculés dans le handler existant | quasi nul (même handler) | Cartes produits/service avec un rendu premium | Carte statique, sans glare ni tilt |
| 11 | `data-flip-card` | Carte qui se retourne (recto/verso) au survol ou au clic (mobile) | CSS pur : `transform-style: preserve-3d` + `rotateY` sur `:hover`/`.is-flipped`, JS minime pour le toggle tactile | quasi nul | Équipe (photo → bio), avantage → détail | Contenu verso affiché en accordéon sous le recto (pas de rotation 3D) |
| 12 | `data-accordion` | Accordéon dont l'ouverture/fermeture anime hauteur ET réordonnancement du contenu autour | GSAP **Flip** (mesure avant/après, anime la différence) | inclus (GSAP gratuit) | FAQ, détails de prestations | `<details>/<summary>` natif déjà utilisé dans le repo (global.css l.213-215) sans animation Flip |
| 13 | `data-parallax-depth` | Parallax multi-couches : plusieurs enfants `[data-depth="0.2"]` bougent à des vitesses différentes | Étendre `rich()` : au lieu d'un seul `data-parallax` par élément, itérer les enfants `[data-depth]` avec des coefficients différents | quasi nul (même bloc GSAP) | Hero avec plusieurs plans (fond/sujet/premier plan) | Tous les plans figés (aucun déplacement) |
| 14 | `data-spotlight` | Halo lumineux radial qui suit le curseur dans une section | CSS pur : `@property --x`/`--y` (support ~95 %) + `radial-gradient(circle at var(--x) var(--y), ...)`, mis à jour via un seul listener `pointermove` global (throttlé en rAF) | quasi nul | Section CTA, fond sombre | Halo fixe centré, pas de suivi curseur |
| 15 | `data-trail` | Traînée de plusieurs images qui suivent le curseur (portfolio) | Étendre `hoverImages()` (l.56-76) : pool de N `<img>` réutilisées avec décalage temporel au lieu d'une seule image lissée | +léger (même pattern) | Galerie/portfolio artisanal, une image par élément survolé | Comportement `data-hover-img` simple (une seule image) |
| 16 | `data-drag-grid` | Grille d'images en glisser-déplacer infini (façon mood board) | GSAP **Draggable** + `Observer` (gratuits), wrap modulo pour l'effet infini | +léger (plugins GSAP gratuits) | Page "univers"/inspiration d'un artisan (matériaux, réalisations) | Grille statique scrollable normalement (CSS grid + overflow) |
| 17 | `data-compare` | Slider avant/après (rénovation, avant/après chantier) | CSS pur : deux images superposées + `clip-path: inset()` piloté par un `<input type="range">` natif (accessible clavier) | quasi nul | Artisan bâtiment/rénovation, avant/après très parlant | Slider toujours utilisable (c'est un `<input>` natif, pas une animation) |
| 18 | `data-lottie="/anim/loader.lottie"` | Anime une micro-illustration Lottie/dotLottie (loader, icône animée) | `@lottiefiles/dotlottie-web` (MIT), chargé en `import()` seulement si l'attribut existe, monte un `<canvas>` | +poids WASM (~500 Ko, mais mis en cache, jamais sur le chemin critique) | Loader de page, icône de section animée, jamais le hero principal | Image statique de repli (`data-lottie-fallback="/img/static.webp"`) |
| 19 | `data-curtain-nav` | Rideau de transition entre pages internes (pas seulement à l'entrée comme `.ff-curtain` actuel) | S'appuie sur Astro `<ClientRouter />` : anime le rideau dans les hooks `astro:before-swap`/`astro:after-swap` plutôt que de réimplémenter un routeur | quasi nul (Astro déjà présent) | Site avec plusieurs pages (pas juste une landing) | `<ClientRouter />` dégrade nativement en navigation classique si JS coupé |
| 20 | `data-marquee-velocity` | Bande défilante dont la vitesse réagit à la vélocité de scroll (accélère quand on scrolle vite) | Étendre `marquee()` (l.128-136) : lire le delta de `window.scrollY` par frame, moduler `--marquee-speed` | quasi nul | Bandeau de mots-clés/savoir-faire en bas de hero | Vitesse fixe actuelle (comportement déjà existant) |
| 21 | `data-confetti` | Déclenche des confettis à un événement (succès de formulaire) | **canvas-confetti** (ISC, ~13 Ko), importé uniquement au moment du déclenchement (jamais au chargement de page) | +13 Ko, chargé à la demande seulement | Confirmation de formulaire de contact/devis | Aucun confetti, juste le message de confirmation (déjà suffisant) |
| 22 | `data-scroll-progress` | Barre de progression de lecture en haut de page | **CSS pur** via `animation-timeline: scroll(root)` là où supporté (`@supports`), sinon petit listener scroll throttlé en rAF | quasi nul | Articles longs, pages de process détaillé | Barre statique à 0 ou masquée |
| 23 | `data-count-bar` | Barres de stats qui se remplissent au scroll (compétences, répartition) | Extension de `counters()` : anime `width`/`scaleX` en même temps que le chiffre, `transform-origin: left` | quasi nul (même IO) | Bloc "chiffres clés" avec visualisation | Barres affichées pleines directement (pas d'animation de remplissage) |
| 24 | `data-view-transition="hero"` | Morph d'image partagée entre page liste et page détail (ex. galerie → fiche réalisation) | `view-transition-name` CSS posé dynamiquement + `<ClientRouter />` (déjà natif Astro, same-document bien supporté) | quasi nul | Portfolio avec pages de détail par réalisation | Navigation classique sans morph (déjà le comportement hors support) |
| 25 | `data-reveal-native` | Variante 100 % CSS de `data-reveal` via `animation-timeline: view()`, sans `IntersectionObserver` | `@supports (animation-timeline: view())` → keyframes CSS pures ; sinon fallback automatique sur le `data-reveal` IO existant (aucun changement de markup) | **zéro JS** là où supporté | Pages à très fort volume d'éléments `data-reveal` (listes longues) où on veut sortir l'IO du main thread | Repli natif = comportement `data-reveal` actuel (IO), donc déjà "reduced-motion"-safe par la règle globale existante |

Principe transverse : tout nouvel effet "rich" doit suivre le pattern déjà en place dans `rich()`
(motion.ts l.183-186) — un seul `document.querySelector('[data-x]')` de garde avant tout `import()`,
pour que le coût ne soit payé que par les pages qui utilisent réellement l'effet.

---

## 4. Dépôts et collections à explorer (avec licences)

| Source | Contenu | Licence / condition d'usage |
|---|---|---|
| **Codrops (tympanus.net)** | Démos d'interactions primées (WebGL, scroll, texte) | Code des démos téléchargeables sous **licence MIT** — réutilisable en projet commercial (attention : les "design freebies" séparés ont des restrictions différentes, pas de revente) [tympanus.net/codrops/licensing](https://tympanus.net/codrops/licensing/) |
| **Aceternity UI** | 200+ composants React/Next.js + Tailwind + Framer Motion, copier-coller | Bibliothèque gratuite en libre accès + palier payant "All-Access Pass" pour du contenu premium ; usage commercial autorisé pour le contenu gratuit d'après leur FAQ — vérifier la page licence dédiée avant réutilisation intensive [ui.aceternity.com](https://ui.aceternity.com/) |
| **Magic UI** | 150+ composants animés React/TS/Tailwind/Motion, compagnon de shadcn/ui | **Gratuit et open source** (dépôt GitHub, 22,3 k ⭐) [magicui.design](https://magicui.design/) |
| **Uiverse.io** | Snippets CSS/Tailwind créés par la communauté (boutons, cartes, loaders) | Utilisation communément admise en libre usage personnel/commercial sans attribution obligatoire — **à revérifier au cas par cas sur la page de chaque snippet**, le site n'a pas pu être consulté directement pendant cette veille |
| **CSS-Tricks** | Articles techniques + snippets de démonstration | Pas de licence globale affichée : traiter le code d'exemple comme pédagogique, le réécrire plutôt que le copier tel quel dans un livrable client |
| **Hover.css** | Bibliothèque CSS de micro-interactions au survol (boutons) | MIT, par Ian Lunn — **non maintenue depuis ~2017**, mais CSS pur donc toujours fonctionnelle ; utile comme catalogue d'idées à transposer en `@utility` Tailwind plutôt qu'à importer telle quelle |
| **Animista** | Générateur de `@keyframes` CSS prêtes à copier | Gratuit pour usage personnel et commercial (pas de compte requis) |
| **LottieFiles (marketplace gratuit)** | Animations Lottie prêtes à l'emploi | **Licence par fichier** — certains éléments "gratuits" sont limités à un usage personnel, d'autres sont libres commercialement ; vérifier la mention de licence affichée sur chaque animation avant de l'intégrer à un livrable client (page de licence non accessible directement pendant cette veille — à revalider à l'usage) |
| **Rive community** | Fichiers `.riv` publics partagés par la communauté | Le **runtime** est MIT, mais chaque fichier communautaire garde les conditions fixées par son créateur — à vérifier fichier par fichier avant usage commercial |
| **Spline community** | Scènes 3D publiques remixables | Idem Rive : le runtime est un outil, mais chaque scène communautaire a ses propres conditions de réutilisation — ne pas embarquer une scène de la communauté dans un livrable client sans vérification explicite |
| **Awwwards ("Elements" / catégories d'interactions)** | Inspiration organisée par type d'effet (hero, transition, curseur...) | Pas de code — sert uniquement de référence visuelle pour cadrer une direction, jamais de source de code |
| **GSAP showcase / CodePen GSAP** | Démos officielles et communautaires GSAP | GSAP lui-même est gratuit depuis 2025 ; les Pens individuels suivent la licence CodePen par défaut sauf mention contraire — vérifier chaque Pen avant copie intégrale |
| **Olivier Larose (tutoriels GSAP/Three.js)** | Tutoriels vidéo + dépôts GitHub d'accompagnement | Licence à vérifier par dépôt (pas de politique globale) — bon niveau pédagogique pour comprendre des techniques (parallax, WebGL hover) à réimplémenter proprement |
| **Jesper Landberg** | Portfolio/démos WebGL avancées, inspiration technique | Projets personnels, pas de licence de réutilisation globale — source d'inspiration technique, pas de code à copier tel quel |
| **Chris Gannon** | Spécialiste animation SVG (tutoriels DrawSVG/MorphSVG) | Contenu pédagogique CodePen — vérifier chaque Pen ; utile pour maîtriser DrawSVG/MorphSVG maintenant gratuits dans GSAP |

**Règle studio** : aucune ressource de cette section n'est à copier telle quelle dans `src/` sans
vérifier sa licence individuelle et sans la réécrire aux tokens du projet (règle CLAUDE.md "jamais de
couleur/police en dur"). Ces sources servent à identifier des *techniques*, pas à embarquer du code
tiers non audité.

---

## 5. Règles de performance

- **Mobile d'abord, WebGL en dernier recours.** Tout effet WebGL (`data-hover-distort`, Vanta,
  Spline, Three.js) doit être gardé par `window.matchMedia('(pointer: fine)').matches` — même logique
  que `hoverImages()` aujourd'hui (motion.ts l.57) — et idéalement aussi par une détection de contexte
  WebGL disponible avant d'importer quoi que ce soit.
- **Budget par page.** Le tier "rich" charge déjà GSAP core + ScrollTrigger (~30 Ko gzip). Toute
  addition à ce tier (Lenis, OGL, dotLottie, canvas-confetti...) doit rester strictement liée à la
  présence du `data-*` correspondant dans le DOM de la page — jamais un import global. Objectif :
  qu'une page qui n'utilise que `data-reveal`/`data-counter`/`data-marquee` reste à 0 Ko de JS
  d'animation (tier "subtle" actuel), et qu'une page "rich" avec 1-2 effets avancés reste sous
  ~60-80 Ko gzip de JS d'animation au total.
- **Lazy par construction.** Le pattern déjà en place — `rich()` ne fait `import('gsap')` que si un
  sélecteur `[data-x]` existe (l.184-186) — doit être répliqué pour chaque nouvelle lib : un seul
  garde-fou `querySelector` avant tout `import()` dynamique, jamais de `<script>` statique pour une
  lib optionnelle.
- **Hygiène `will-change`.** Ne jamais le poser en CSS statique sur une classe utilisée partout
  (ex. `.split-word > span` ou `.ff-hover-img`, qui l'ont déjà en dur, l.194 de global.css — à
  surveiller si le nombre d'éléments grandit). Le poser en JS juste avant le début d'une animation
  (`mouseenter`/entrée IO) et le retirer juste après (`transitionend`/`onComplete`), jamais sur plus
  de quelques éléments visibles simultanément — un `will-change` sur toute une grille de cartes tilt
  coûte cher en mémoire GPU sur mobile bas de gamme.
- **INP avant tout.** Préférer les animations pilotées par le compositeur (`transform`/`opacity`,
  scroll-driven CSS natif) à tout ce qui force du recalcul de layout par frame. Tout listener
  `pointermove`/`scroll` doit être `{ passive: true }` et throttlé en `requestAnimationFrame` (déjà le
  cas pour `hoverImages()` et `navScroll()`) — jamais de lecture de `getBoundingClientRect()` dans une
  boucle non batchée (déjà correct aujourd'hui : `data-tilt`/`data-magnetic` lisent le rect une fois
  par event, pas par frame).
- **`prefers-reduced-motion` = contrat, pas option.** Chaque nouvel effet de la section 3 doit avoir
  sa ligne dans le bloc `@media (prefers-reduced-motion: reduce)` de global.css (l.202-211), sur le
  modèle des entrées déjà présentes pour `data-draw`, `data-text-fill`, `data-pin-step`, `.split-word`.
  Aucun effet ne doit dépendre uniquement du JS pour se neutraliser (le garde en tête de `initMotion()`,
  l.14-17, retire l'exécution JS, mais le CSS doit rester le filet de sécurité en cas de contenu déjà
  rendu avant hydratation).
- **Poids des assets tiers.** Vanta (~120 Ko), dotLottie (~500 Ko WASM), Spline runtime : jamais sur
  le chemin critique (hero above-the-fold d'une page qui doit scorer 90+ Lighthouse). Réserver ces
  libs à des sections secondaires, chargées en `IntersectionObserver` (n'importer qu'au moment où la
  section approche du viewport), pas au `DOMContentLoaded`.

---

## 6. Sources

- [Webflow makes GSAP 100% free — Webflow Blog](https://webflow.com/blog/gsap-becomes-free)
- [GSAP is Now Completely Free, Even for Commercial Use! — CSS-Tricks](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/)
- [GSAP 3.13 release notes](https://gsap.com/blog/3-13/)
- [GSAP Standard License](https://gsap.com/community/standard-license/)
- [GSAP Plugins — documentation officielle](https://gsap.com/docs/v3/Plugins/)
- [From SplitText to MorphSVG — Codrops](https://tympanus.net/codrops/2025/05/14/from-splittext-to-morphsvg-5-creative-demos-using-free-gsap-plugins/)
- [Lenis — site officiel](https://lenis.dev/)
- [Lenis — GitHub (darkroomengineering)](https://github.com/darkroomengineering/lenis)
- [Locomotive Scroll — npm](https://www.npmjs.com/package/locomotive-scroll)
- [Locomotive Scroll — issues GitHub](https://github.com/locomotivemtl/locomotive-scroll/issues)
- [Motion (motion.dev) — site officiel](https://motion.dev/)
- [Motion.dev devient indépendant et vanilla JS — forum Tumult](https://forums.tumult.com/t/motion-dev-now-becomes-independent-and-uses-vanilla-javascript/24256)
- [anime.js — npm](https://www.npmjs.com/package/animejs)
- [Anime.js v4 — CodingMart](https://codingmart.com/the-new-era-of-lightweight-animations-anime-js-v4/)
- [Swiper — site officiel](https://swiperjs.com/)
- [Swiper — LICENSE (GitHub)](https://github.com/nolimits4web/swiper/blob/master/LICENSE)
- [Splide — site officiel](https://splidejs.com/) / [GitHub](https://github.com/Splidejs/splide)
- [Embla Carousel — site officiel](https://www.embla-carousel.com/)
- [Keen Slider — docs](https://keen-slider.io/docs)
- [dotLottie — site officiel](https://dotlottie.io/) / [dotlottie-web GitHub](https://github.com/lottiefiles/dotlottie-web)
- [Rive runtime — GitHub](https://github.com/rive-app/rive-runtime)
- [Three.js + Astro — threejsresources.com](https://threejsresources.com/frameworks/three-js-astro)
- [Spline runtime — npm](https://www.npmjs.com/package/@splinetool/runtime)
- [Vanta.js — site officiel](https://www.vantajs.com/)
- [tsParticles — releases GitHub](https://github.com/matteobruni/tsparticles/releases)
- [Barba.js — issues GitHub](https://github.com/barbajs/barba/issues)
- [Astro — View Transitions (docs officielles)](https://docs.astro.build/en/guides/view-transitions/)
- [SplitType — GitHub](https://github.com/lukePeavey/SplitType)
- [Typed.js — mirror SourceForge](https://sourceforge.net/projects/typed-js.mirror/)
- [Rellax.js — site officiel](https://dixonandmoe.com/rellax/)
- [Meilleures libs scroll animation 2026 — cssauthor.com](https://cssauthor.com/best-javascript-scroll-animation-scrollytelling-libraries/)
- [ScrollReveal.js — site officiel](https://scrollrevealjs.org/)
- [Atropos.js — site officiel](https://atroposjs.com/)
- [Vara.js — akzhy.com](https://akzhy.com/shelf/vara/)
- [Rough.js — site officiel](https://roughjs.com/)
- [Matter.js — brm.io](https://brm.io/matter-js/)
- [p5.js — site officiel](https://p5js.org/)
- [Paper.js — licence officielle](http://paperjs.org/license/)
- [curtains.js — site officiel](https://www.curtainsjs.com/)
- [hover-effect — GitHub (robin-dela)](https://github.com/robin-dela/hover-effect)
- [OGL — GitHub (oframe)](https://github.com/oframe/ogl)
- [Shery.js — GitHub](https://github.com/sheryianscodingschool/sheryjs)
- [Blobity — site officiel](https://blobity.gmrchk.com/)
- [canvas-confetti — GitHub (catdad)](https://github.com/catdad/canvas-confetti)
- [Vivus.js — npm](https://www.npmjs.com/package/vivus)
- [MDN — CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations)
- [Chrome for Developers — CSS scroll-triggered animations](https://developer.chrome.com/blog/scroll-triggered-animations)
- [caniuse — View Transitions cross-document](https://caniuse.com/cross-document-view-transitions)
- [MDN — View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [MDN — @starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@starting-style)
- [Smashing Magazine — Popover API (2026)](https://www.smashingmagazine.com/2026/03/getting-started-popover-api/)
- [Josh W. Comeau — CSS Anchor Positioning](https://www.joshwcomeau.com/css/anchor-positioning/)
- [caniuse — text-wrap: balance](https://caniuse.com/css-text-wrap-balance)
- [LogRocket — Container queries en 2026](https://blog.logrocket.com/container-queries-2026/)
- [MDN — :has()](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)
- [caniuse — color-mix()](https://caniuse.com/mdn-css_types_color_color-mix)
- [MDN — fonction d'easing linear()](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/linear)
- [caniuse — CSS Scroll Snap](https://caniuse.com/css-snappoints)
- [caniuse — @property](https://caniuse.com/mdn-css_at-rules_property)
- [Codrops — politique de licence](https://tympanus.net/codrops/licensing/)
- [Aceternity UI — site officiel](https://ui.aceternity.com/)
- [Magic UI — site officiel](https://magicui.design/)
- Fichiers du projet consultés : `src/scripts/motion.ts`, `src/styles/global.css`, `package.json`
  (versions installées : `astro@5.18.2`, `gsap@3.15.0`, `tailwindcss@4.3.3`).

*Recherche effectuée le 16 septembre 2026. Les statuts de maintenance et pourcentages de support
navigateur évoluent vite : revérifier avant une adoption en production, en particulier pour Typed.js
(changement de licence récent) et les licences par fichier (LottieFiles, Rive community, Spline
community, Uiverse).*
