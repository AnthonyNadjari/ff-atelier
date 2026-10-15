# Veille techniques, octobre 2026 : ce que l'usine ne fait pas encore

Veille du 15 octobre 2026, lecture seule. Objectif : repérer des **techniques** de sites web (pas des
styles par métier) absentes de `src/scripts/motion.ts`, de `src/styles/global.css` et des variantes
`src/sections/*`, sans répéter `docs/veille/tendances.md` (§2), `docs/veille/references.md` (§5, les
40 moves) ni `docs/ANIMATIONS.md`. Chaque fiche cite ce qui a été lu ; rien n'est affirmé de mémoire.
Charte impérative pendant toute la lecture : `docs/GOUT.md`.

## 0. Méthode et sources lues

- **Plateforme** : [Chrome, scroll-state queries](https://developer.chrome.com/blog/css-scroll-state-queries),
  [Chrome, carrousels CSS](https://developer.chrome.com/blog/carousels-with-css),
  [Chrome, animer vers `height: auto`](https://developer.chrome.com/docs/css-ui/animate-to-height-auto),
  [Chrome, `text-box`](https://developer.chrome.com/blog/css-text-box-trim),
  [Chrome, scroll-triggered animations](https://developer.chrome.com/blog/scroll-triggered-animations),
  [Chrome, anchor positioning](https://developer.chrome.com/blog/anchor-positioning-api),
  [Chrome, `command`/`commandfor`](https://developer.chrome.com/blog/command-and-commandfor),
  [Chrome, `appearance: base-select`](https://developer.chrome.com/blog/a-customizable-select),
  [WebKit, scroll-driven animations en CSS pur](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/),
  [web.dev, nouveautés de septembre 2025](https://web.dev/blog/web-platform-09-2025),
  [modern-css.com, nouveautés 2025-2026](https://modern-css.com/whats-new/?year=2025) et son
  [journal](https://modern-css.com/changelog/), MDN (pages citées fiche par fiche),
  [una.im, `scroll-state(scrolled)`](https://una.im/scroll-state-scrolled),
  [scroll-driven-animations.style](https://scroll-driven-animations.style/) (démos de Bramus).
- **Blogs** : [Smashing, `corner-shape` (mars 2026)](https://www.smashingmagazine.com/2026/03/beyond-border-radius-css-corner-shape-property-ui/),
  lettres Smashing [n° 553](https://www.smashingmagazine.com/the-smashing-newsletter/smashing-newsletter-issue-553/) et
  [n° 561](https://www.smashingmagazine.com/the-smashing-newsletter/smashing-newsletter-issue-561/),
  [CSS-Tricks, multi-colonnes qui replient](https://css-tricks.com/css-multi-column-layout-wrapping-features/),
  [dbushell, subgrid (avril 2026)](https://dbushell.com/2026/04/02/css-subgrid-is-super-good/),
  [Karl Koch, animations `clip-path`](https://karlkoch.me/writing/on-clip-path-animations),
  [bram.us, `light-dark()` pour les images](https://www.bram.us/2026/03/19/more-easy-light-dark-mode-switching-light-dark-is-about-to-support-images/),
  [ics.media, `display: grid-lanes`](https://ics.media/en/entry/260611/),
  [Polypane, `safe-area-inset`](https://polypane.app/blog/using-safe-area-inset-to-build-mobile-safe-layouts/).
- **Codrops** (le site refuse le fetch, lu via les dépôts MIT) : [liste des dépôts](https://github.com/orgs/codrops/repositories?sort=updated),
  [atelier-north](https://github.com/codrops/atelier-north) (9 oct 2026),
  [ElasticGridScroll](https://github.com/codrops/ElasticGridScroll), [3DCarousel](https://github.com/codrops/3DCarousel),
  [MotionTrailAnimations](https://github.com/codrops/MotionTrailAnimations).
- **Galeries** : [siteinspire](https://www.siteinspire.com/) (25 entrées du 25 sept. au 7 oct. 2026),
  [minimal.gallery](https://minimal.gallery/), [footer.design](https://www.footer.design/),
  [navbar.gallery](https://www.navbar.gallery/), [hero.gallery](https://hero.gallery/) (SaaS surtout, peu utile),
  [onepagelove, sections](https://onepagelove.com/inspiration/sections) (66 catégories de sections).
  godly.website redirige vers recent.design (pas d'URL exploitables) ; land-book refuse le fetch.
- **Tendances à éviter** : [Bubble, trends 2026](https://bubble.io/blog/web-design-trends/),
  [studiomeyer, reality check 2026](https://studiomeyer.io/en/blog/webdesign-trends-2026-reality-check),
  [tinyfrog, trends 2026](https://tinyfrog.com/web-design-trends-2026/),
  [setproduct, liquid glass vs glassmorphism](https://setproduct.com/blog/liquid-glass-vs-glassmorphism),
  [ui-skills, progressive blur](https://www.ui-skills.com/skills/mengto/progressive-blur/).
- **18 sites réels lus dans leur HTML et leur CSS** (curl, pas de navigateur), tous mis en avant entre
  le 25 septembre et le 7 octobre 2026 sur siteinspire ou minimal.gallery :

| Site | Stack lue | Ce qu'on y a trouvé d'utile |
|---|---|---|
| [unionboulangerie.com](https://unionboulangerie.com/) (boulangerie, Montréal) | Shopify, Embla | `data-animate="paragraph-scribble-word"` ×97, `data-letter` ×180 avec `font-variation-settings "wght"`, `data-proximity-*`, `.c-form{container-type:inline-size}`, `text-wrap: balance`, `mask-image` SVG, `field-sizing`, view transitions |
| [carrierescene.ca](https://carrierescene.ca/) | Craft CMS | `*{text-box-trim:trim-both;text-box-edge:cap alphabetic}` posé globalement, `popover` ×54, pointillés dessinés en `mask-image` SVG |
| [boc.studio](https://boc.studio/) | Next, Sanity, Swup, Lenis | `data-marquee-fade` ×16, `@property` ×59, `backdrop-filter` ×31, marquee 50 s, `cubic-bezier(.34,1.56,.64,1)` |
| [drasa.uk](https://drasa.uk/) | Next | `view-transition-name: floating-nav` avec fondu `plus-lighter` 0,32 s, `@property` ×57, `color-mix` ×46 |
| [grndwrk.studio](https://grndwrk.studio/) | Next | `container-type: size` + `@container` avec `cqw`/`cqh` pour un cadre au ratio, `scroll-snap-type: x mandatory` sur une rangée de vidéos |
| [jakobsencopenhagen.com](https://jakobsencopenhagen.com/) (meubles, 1975) | Astro, Sanity, Swup, Lenis | `snap-x` sur mobile, `oklch`, `light-dark`, `hidden=until-found` dans le reset |
| [ogon.es](https://ogon.es/) | Astro (ClientRouter) | transitions de page natives, `.blend{mix-blend-mode:difference}`, `dvh` ×12 |
| [wearebou.com](https://wearebou.com/) | Astro, Sanity, Lenis | `data-lqip` ×49, `data-entry-animation` ×31, `data-theme` ×16 par section, `fetchpriority` ×80, `mask-image` ×18, `popover` ×3, view transitions |
| [aliciadubuis.com](https://aliciadubuis.com/) (photographe) | Astro, Sanity | `content-visibility` ×4, images `w=12&blur=32` en placeholder |
| [felixpeault.com](https://felixpeault.com/) | SvelteKit, Sanity | `transition: translate` (propriété individuelle), `fetchpriority` |
| [samthies.com](https://samthies.com/) | Gatsby, Swiper, Lenis | `scroll-snap-type` ×3, `backdrop-filter` ×4 |
| [nomadlabs.es](https://nomadlabs.es/) | WordPress, GSAP, ScrollTrigger, Swup, Lenis | `data-col-mobile`, vidéos Vimeo à la demande |
| [www.noth.in](https://www.noth.in/) | Webflow, Taxi.js | transitions de page par lib ; dans le CSS généré, `popover` ×19 et un `position-anchor` |
| [how.studio](https://how.studio/) | Next, Prismic | `cubic-bezier(0.285,0.105,0.465,1.015)` maison, `clip-path` ×3 |
| [ol.studio](https://ol.studio/) | Next, Sanity | `cubic-bezier(.19,1,.22,1)` ×14 (expo-out), `transition: flex` (panneaux qui s'élargissent) |
| [www.esrbespoke.au](https://www.esrbespoke.au/), [lagolago.nl](https://lagolago.nl/en), [www.maisonlesgrandschenes.com](https://www.maisonlesgrandschenes.com/) | Next / WordPress | rien de notable côté technique (maison d'hôte en WordPress classique) |

Ce que ces 18 sites disent en bloc : **Lenis dans 5 sites sur 18, Swup/Taxi dans 4, GSAP dans 1
seul** ; le back-out `cubic-bezier(.34,1.56,.64,1)` revient dans 4 sites (boc, drasa, ogon, union) ;
`scroll-snap` sur mobile dans 4 ; `@property` et `color-mix` massifs chez les deux studios les plus
soignés (boc, drasa). Aucun des 18 n'utilise encore `animation-timeline`, `scroll-state` ni
`corner-shape` : les techniques de la section A sont en avance sur le terrain, pas en retard.

Lecture des fiches : **Coût** petit (une règle CSS ou un attribut), moyen (une variante ou un
attribut `data-*` avec repli), gros (nouvelle brique avec JS, tests, démo `_effets`). **iPhone** :
Safari ≥ 26 veut dire iOS 26 (sorti en septembre 2025 d'après web.dev) ; les versions plus anciennes
reçoivent le repli indiqué. Les animations CSS pilotées par le défilement sont annoncées « off the
main thread » par la [page de démos de Bramus](https://scroll-driven-animations.style/) : c'est ce
qui les rend fluides sur iPhone là où une boucle JS sur `--p` saccade (`GOUT.md` §4).

---

## A. CSS pur, sans JS (priorité, fluide sur iPhone)

### A1. Nav : ombre et densification quand elle « colle » (`scroll-state(stuck)`)
- Où vue : [Chrome, scroll-state queries](https://developer.chrome.com/blog/css-scroll-state-queries)
  (Chrome 133, janvier 2025) ; [modern-css.com](https://modern-css.com/sticky-snapped-styling-without-javascript/)
  (« environ 50 % d'usage global, pas Baseline, pas en prod sans repli »).
- Ce que ça fait : `container-type: scroll-state` sur l'élément sticky, puis
  `@container scroll-state(stuck: top)` sur son enfant pour ajouter ombre, fond, padding réduit.
  Zéro écouteur de scroll.
- Dans notre moteur : `Nav/bar.astro` pose `.is-scrolled` en JS (`motion.ts` l. 755). Ajouter la
  version CSS sous `@supports (container-type: scroll-state)` dans `global.css`, garder le JS en repli.
- Coût : petit. Risque IA : non. iPhone : pas de support lu côté Safari → repli JS actuel. À faire
  seulement quand Safari suivra ; aucune urgence.

### A2. Nav qui se cache à la descente, revient à la montée (`scroll-state(scrolled)`)
- Où vue : [una.im](https://una.im/scroll-state-scrolled) (Chrome 144) : `container-type: scroll-state`
  sur `html`, `@container scroll-state(scrolled: bottom)` → `translate: 0 -100%`, `scrolled: top` →
  `translate: 0 0` ; variante sticky avec `(not scroll-state(scrolled: none))`.
- Ce que ça fait : le `data-nav="hide-on-scroll"` actuel, sans JS, et un repli naturel (nav visible).
- Dans notre moteur : déjà `data-nav="hide-on-scroll"` (JS). Même stratégie qu'A1 : couche CSS
  d'abord, JS si non supporté. Una montre aussi un reveal **directionnel** (l'élément glisse depuis le
  sens du scroll) avec la même requête.
- Coût : petit. Risque IA : non. iPhone : Chrome seulement pour l'instant → repli JS.

### A3. Galerie en piste manuelle avec repères et boutons natifs (`::scroll-marker`, `::scroll-button`)
- Où vue : [Chrome, carrousels CSS](https://developer.chrome.com/blog/carousels-with-css) (Chrome 135 ;
  Safari et Firefox non supportés d'après la page) ; sur le terrain, `scroll-snap-type: x mandatory`
  sur des rangées mobiles chez [grndwrk.studio](https://grndwrk.studio/) et
  [jakobsencopenhagen.com](https://jakobsencopenhagen.com/).
- Ce que ça fait : une `<ul>` en `overflow-x: auto; scroll-snap-type: x mandatory` devient un
  carrousel complet : `::scroll-button(left/right)` crée de vrais `<button>`, `li::scroll-marker`
  des liens vers chaque item, `:target-current` marque l'item visible. Le navigateur gère rôles,
  tabulation, clavier ; ça marche sans JS.
- Dans notre moteur : rien de tel (`Proof/gallery` est une grille, `data-horizontal` épingle au scroll
  vertical, `data-drag-grid` demande GSAP Draggable). Nouvelle variante `src/sections/Proof/piste.astro`
  (réalisations ou avis) : piste scroll-snap partout, repères et boutons seulement sous
  `@supports (scroll-marker-group: after)`. Repères carrés 8 px, pas des points-pilules (GOUT §2).
  C'est exactement le « scroll latéral manuel » demandé le 14 oct. (GOUT §4).
- Coût : moyen. Risque IA : non. iPhone : la piste snap marche (scroll-snap ~97 % d'après
  `docs/veille/animations.md` §2), repères et boutons absents → on glisse au doigt, c'est voulu.

### A4. Diapo active mise en valeur sans JS (`scroll-state(snapped)`)
- Où vue : [Chrome, scroll-state queries](https://developer.chrome.com/blog/css-scroll-state-queries)
  (`snapped: x|y|inline|block`) ; [modern-css.com](https://modern-css.com/sticky-snapped-styling-without-javascript/).
- Ce que ça fait : dans la piste d'A3, l'item snappé reçoit un style (opacité 1, légende visible),
  les autres restent en retrait.
- Dans notre moteur : complément d'A3, même `@supports`. Le repli : tous les items au même niveau.
- Coût : petit. Risque IA : non. iPhone : non supporté pour l'instant, repli neutre.

### A5. FAQ : accordéon exclusif et animé, sans JS ni GSAP (`<details name>`, `::details-content`, `interpolate-size`)
- Où vue : [MDN `<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details)
  (attribut `name` : un seul ouvert à la fois, pas besoin d'être adjacents) ;
  [MDN `::details-content`](https://developer.mozilla.org/en-US/docs/Web/CSS/::details-content)
  (Baseline 2025, « newly available » depuis septembre 2025 ; exemple `opacity` +
  `content-visibility 600ms allow-discrete`) ;
  [Chrome, animer vers `height: auto`](https://developer.chrome.com/docs/css-ui/animate-to-height-auto)
  (`interpolate-size: allow-keywords`, Chrome/Edge 129, opt-in parce que ça casserait des feuilles
  existantes).
- Ce que ça fait : `Faq/accordion.astro` garde ses `<details>`, gagne `name="faq"` (exclusif),
  et `details::details-content { block-size: 0; overflow: hidden; transition: block-size .3s,
  content-visibility .3s allow-discrete }` + `details[open]::details-content { block-size: auto }`
  sous `:root { interpolate-size: allow-keywords }`.
- Dans notre moteur : remplace `data-accordion[="single"]` (GSAP Flip, `rich`) pour la FAQ. Garder
  Flip uniquement si on anime le repositionnement des voisins d'une grille.
- Coût : petit. Risque IA : non. iPhone : `::details-content` et `name` oui ; `interpolate-size`
  n'est lu que pour Chrome → sur iOS, fondu d'opacité (toujours fonctionnel, c'est un `<details>`).

### A6. Menu mobile en `popover` natif (+ `command`/`commandfor`)
- Où vue : [MDN `popover`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover)
  (Baseline 2024 depuis avril 2024 : `auto` = fermeture au clic dehors et à Échap, couche
  supérieure, `popovertarget`) ; [Chrome, `command`/`commandfor`](https://developer.chrome.com/blog/command-and-commandfor)
  (Chrome 135 : `toggle-popover`, `show-modal`, `close`, focus et ARIA gérés) ;
  [carrierescene.ca](https://carrierescene.ca/) emploie `popover` ×54 pour ses menus déroulants.
- Ce que ça fait : `Nav/burger`, `Nav/floating`, `Nav/split` ouvrent aujourd'hui leur panneau avec
  des scripts maison (`data-burger-toggle`, Échap sur `body`, `inert`…). Un `<nav popover id="menu">`
  + `<button popovertarget="menu">` fait la même chose sans code, avec `@starting-style` pour
  l'entrée (motif déjà écrit dans `ContactDrawer.astro`).
- Dans notre moteur : réécrire les trois navs à panneau ; `onPage()` n'est alors plus nécessaire pour
  elles. `commandfor` reste un bonus Chrome, `popovertarget` suffit.
- Coût : moyen (trois variantes, tests `squelettes.test.mjs`). Risque IA : non. iPhone : oui (Baseline
  2024).

### A7. Panneau de contact qui s'ouvre en cercle depuis son bouton (`clip-path: circle()`)
- Où vue : [Karl Koch, on clip-path animations](https://karlkoch.me/writing/on-clip-path-animations)
  (relayé par Smashing n° 553) : fermé `circle(0.75rem at 1.25rem calc(100% - 1.25rem))`, ouvert
  `circle(150% at …)` (150 % et non 100 % pour couvrir le coin opposé), `pointer-events` basculé.
- Ce que ça fait : au lieu d'un tiroir qui glisse, le panneau « naît » du bouton flottant et y
  retourne. Lisible, sans lib.
- Dans notre moteur : option de `ContactDrawer.astro` (`layout.contactDrawer`) ou de `Nav/floating`
  : `data-ouverture="cercle"`. Transition sur `clip-path` avec `--motion-ui` × 2 et `--ease-in-out`.
- Coût : petit. Risque IA : non (pas de halo, pas de verre). iPhone : oui, `clip-path` animé est
  composité.

### A8. Infobulle et sous-menu ancrés (anchor positioning)
- Où vue : [MDN, Using anchor positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning/Using)
  (`anchor-name`, `position-anchor`, `position-area: top`, `anchor()`) ;
  [Chrome](https://developer.chrome.com/blog/anchor-positioning-api) (Chrome 125, `position-try-fallbacks:
  flip-block`, marche avec `popover` et `<dialog>`) ; [web.dev](https://web.dev/blog/web-platform-09-2025)
  (Safari 26).
- Ce que ça fait : un élément positionné se colle à son ancre et se retourne tout seul s'il sort de
  l'écran, sans Floating UI.
- Dans notre moteur : `Zones/map` (légende au survol d'un repère), un futur sous-menu « Prestations »
  dans `Nav/bar`, l'aide d'un champ de `ContactForm`. CSS pur, sous `@supports (anchor-name: --a)`.
- Coût : petit à moyen. Risque IA : non. iPhone : iOS 26 ; avant, position absolue classique sous
  l'ancre (repli).

### A9. Cascade sans variables inline (`sibling-index()`)
- Où vue : [MDN `sibling-index()`](https://developer.mozilla.org/en-US/docs/Web/CSS/sibling-index)
  (Baseline 2026 depuis août 2026 ; `animation-delay: calc(60ms * sibling-index())`,
  `animation-fill-mode: backwards`) ; versions lues sur [modern-css.com](https://modern-css.com/whats-new/?year=2025)
  : Chrome 138, Firefox 154, Safari 26.2.
- Ce que ça fait : la cascade de `data-stagger` sans que le JS écrive un délai par enfant.
- Dans notre moteur : `data-stagger` pose aujourd'hui les délais en JS. Ajouter la règle CSS sous
  `@supports (animation-delay: calc(1ms * sibling-index()))` avec le plafond de 600 ms via `min()`,
  le JS restant pour les autres navigateurs. Gain : moins de travail au premier rendu.
- Coût : petit. Risque IA : non. iPhone : iOS 26.2 seulement → JS avant.

### A10. Vrai ressort en CSS (`linear()`)
- Où vue : [MDN `linear()`](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/linear)
  (Baseline « widely available » depuis décembre 2023, valeurs hors 0-1 autorisées pour un
  dépassement). Terrain : le back-out `cubic-bezier(.34,1.56,.64,1)` lu tel quel chez
  [boc.studio](https://boc.studio/), [drasa.uk](https://drasa.uk/), [ogon.es](https://ogon.es/) et
  [unionboulangerie.com](https://unionboulangerie.com/) : c'est devenu la courbe « pop » par défaut.
- Ce que ça fait : `linear(0, 1.2 40%, 0.9 65%, 1.05 82%, 1)` donne deux rebonds décroissants, ce
  qu'un `cubic-bezier` ne sait pas faire.
- Dans notre moteur : `--ease-brand` de `src/directions/pop/index.css` est ce même back-out
  `(0.34,1.56,0.64,1)`. Le remplacer par un `linear()` propre à la direction (et un autre pour
  `signal`) : c'est la « main » de chaque site (`ANIMATIONS.md`, courbes), et ça sort de la courbe
  que tout le monde copie.
- Coût : petit. Risque IA : non, l'inverse. iPhone : oui.

### A11. Coins taillés, biseautés, encochés (`corner-shape`)
- Où vue : [MDN `corner-shape`](https://developer.mozilla.org/en-US/docs/Web/CSS/corner-shape)
  (`squircle`, `bevel`, `scoop`, `notch`, `superellipse(n)`, sans effet sans `border-radius`) ;
  [Smashing, mars 2026](https://www.smashingmagazine.com/2026/03/beyond-border-radius-css-corner-shape-property-ui/)
  (Chrome 139+, Firefox et Safari non ; `bevel` pour badges et étiquettes, `notch` pour un tampon
  « usiné », `scoop` avec des serifs ; démos en trois couches avec `@supports`).
- Ce que ça fait : un bouton à coins coupés (`bevel`) ou encochés (`notch`) avec `border-radius: 6px`
  : la signature des directions `brut`, `industriel`, `signal`, sans image ni `clip-path`.
- Dans notre moteur : token `--corner-shape` par direction (défaut `round`), appliqué à `.btn`,
  `.card`, étiquettes. Respecte GOUT §2 (rayon ≤ 3 px conseillé : un biseau de 6 px sur un angle
  presque droit n'est pas une « carte à grand rayon »).
- Coût : petit. Risque IA : non, à condition d'éviter `squircle` + grand rayon (le look iOS, lisse).
  iPhone : non supporté → coins arrondis normaux, invisible pour le client.

### A12. Ombres de défilement qui disent « il y en a encore » (scroll-timeline + pseudo-éléments)
- Où vue : [démo Scroll Shadows](https://scroll-driven-animations.style/demos/scroll-shadows/css/) :
  `scroll-timeline: --scroll-timeline y` sur le conteneur, `::before`/`::after` en dégradé radial
  animés sur `animation-timeline: --scroll-timeline`, `animation-range: 1em 2em` en haut et
  `calc(100% - 2em) calc(100% - 1em)` (direction `reverse`) en bas ; une keyframe « detect-scroll »
  pose `--can-scroll` pour n'afficher les ombres que s'il y a débordement.
- Ce que ça fait : sur la piste d'A3 (axe `x`), une ombre douce à droite tant qu'il reste des
  items, qui disparaît en bout de piste. Remplace les flèches.
- Dans notre moteur : classe utilitaire `.ff-piste` dans `global.css`. CSS pur.
- Coût : petit. Risque IA : non (c'est une ombre d'ergonomie, pas un halo). iPhone : iOS 26 ;
  avant, pas d'ombre.

### A13. Fondu des bords du marquee (`mask-image`)
- Où vue : [boc.studio](https://boc.studio/) (`data-marquee-fade` ×16) ;
  [MDN `mask-image`](https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image) (Baseline
  « widely available » depuis décembre 2023, `linear-gradient(black, transparent)` accepté).
- Ce que ça fait : les mots qui entrent et sortent de la bande s'estompent au lieu d'être coupés net.
- Dans notre moteur : `[data-marquee]` n'a qu'un `overflow: hidden` (`global.css` l. 444). Ajouter
  `data-marquee-fade` : `mask-image: linear-gradient(90deg, transparent, black 8%, black 92%,
  transparent)`.
- Coût : petit. Risque IA : non. iPhone : oui.

### A14. Trait de séparation « à la main » en masque SVG (`mask-image` + `currentColor`)
- Où vue : [carrierescene.ca](https://carrierescene.ca/) (pointillés : `background: currentColor;
  mask-image: url("data:image/svg+xml,…")`) ; [unionboulangerie.com](https://unionboulangerie.com/)
  (même procédé pour un trait gribouillé sous des mots, `data-animate="paragraph-scribble-word"` ×97).
- Ce que ça fait : un seul SVG monochrome sert de pochoir ; la couleur vient du token, la forme du
  dessin. Pas d'image par couleur de direction.
- Dans notre moteur : `data-separator` existe déjà côté look (`ff studio` : séparateur) ; ajouter une
  valeur « tracé » qui prend le SVG dans `sites/<slug>/public/trait.svg`.
- Coût : petit. Risque IA : **oui si le trait est dessiné par nous** (le gribouillis « fait main »
  générique est un cliché 2026 : Bubble le liste comme « tactile realism », signes-ia.md veut une
  trace humaine réelle). N'utiliser qu'un trait scanné du client (signature, règle de l'atelier,
  coup de pinceau). iPhone : oui.

### A15. Texte lisible sur n'importe quel accent (`contrast-color()`)
- Où vue : [MDN `contrast-color()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/contrast-color)
  (Baseline 2026 depuis avril 2026 ; renvoie blanc ou noir seulement ; les tons moyens posent
  problème) ; [web.dev](https://web.dev/blog/web-platform-09-2025) (Safari 26, Chrome 147, Firefox 146) ;
  Una Kravets relayée par Smashing n° 553.
- Ce que ça fait : `color: contrast-color(var(--accent))` pour un bouton dont l'accent vient du
  client, sans calculer `--on-accent` à la main.
- Dans notre moteur : nos directions posent `--on-accent` à la main (bien). Utile seulement dans
  `ff studio` quand l'accent est modifié par le fondateur : `--on-accent: contrast-color(var(--accent))`
  en repli sous `@supports`.
- Coût : petit. Risque IA : non. iPhone : iOS 26.

### A16. `<select>` stylable (`appearance: base-select`)
- Où vue : [Chrome](https://developer.chrome.com/blog/a-customizable-select) (Chrome 135 ; options
  dans la couche supérieure, `::picker(select)` ; pas de sélecteur natif mobile ; les autres
  navigateurs ignorent le contenu riche).
- Ce que ça fait : le champ « type de demande » de `ContactForm` dans la typographie du site.
- Dans notre moteur : à ne pas faire pour l'instant : sur iPhone, c'est le sélecteur natif qui
  rassure le client, et Chrome seul en bénéficie.
- Coût : petit. Risque IA : non. iPhone : perd le picker natif, donc **non**.

---

## B. Mouvement au défilement

### B1. Parallax en CSS natif (`animation-timeline: view()`)
- Où vue : [WebKit, scroll-driven animations](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/)
  (`scroll()` vs `view()`, `animation-range: 0% 50%`, déclarer `animation` avant
  `animation-timeline`, envelopper dans `@media not (prefers-reduced-motion)`) ;
  [web.dev](https://web.dev/blog/web-platform-09-2025) (Safari 26, Chrome 115) ;
  [MDN `animation-range`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-range)
  (`cover`, `contain`, `entry`, `exit`).
- Ce que ça fait : une image dans un cadre `overflow: clip` glisse de `translateY(-10%)` à `10%`
  sur `animation-range: cover`, calculée par le compositeur, sans GSAP.
- Dans notre moteur : `data-parallax` est GSAP (`rich`). Ajouter `data-parallax-native="0.2"` :
  CSS sous `@supports (animation-timeline: view())`, sinon le même IO/GSAP que `data-parallax`
  (modèle de `data-reveal-native`). Note : `docs/veille/animations.md` §2 indique Safari 18+ pour
  cette API ; les deux sources lues ici (WebKit, web.dev) disent Safari 26. Retenir 26.
- Coût : petit. Risque IA : non (amplitude ≤ 10 %, GOUT §4 : « translation simple »). iPhone :
  **le bon cas** : fluide hors fil principal sur iOS 26, GSAP avant.

### B2. Pile de cartes qui rétrécissent en CSS pur (`view-timeline` + `exit-crossing`)
- Où vue : [démo Stacking Cards](https://scroll-driven-animations.style/demos/stacking-cards/css/) :
  `view-timeline-name` sur le conteneur, `position: sticky` sur l'enfant `.card__content` (pas la
  carte, pour ne pas changer la hauteur de scroll), par carte
  `animation-range: exit-crossing var(--start-range) exit-crossing var(--end-range)` calculé depuis
  `--index`/`--numcards`, keyframe `scale(calc(1.1 - 0.1 * var(--reverse-index)))`.
- Ce que ça fait : la carte du dessous rapetisse à mesure que la suivante la recouvre.
- Dans notre moteur : `data-sticky-stack` (CSS sticky + assombrissement GSAP en `rich`) et
  `data-stack` (GSAP). Ajouter `data-sticky-stack="scale"` : le rétrécissement en CSS sous
  `@supports`, l'assombrissement GSAP devient inutile.
- Coût : petit. Risque IA : non. iPhone : iOS 26 ; avant, pile sticky sans rétrécissement.

### B3. Couverture plein écran qui devient la barre de navigation (`scroll()` + `animation-range: 0 90vh`)
- Où vue : [démo Cover Card to Fixed Header](https://scroll-driven-animations.style/demos/cover-to-fixed-header/css/) :
  en-tête `position: fixed` animé de `height: 100vh; font-size: calc(4vw + 1em)` à `height: 10vh;
  font-size: 2em` sur `animation-timeline: scroll(); animation-range: 0vh 90vh; forwards`, `body {
  padding-top: 100vh }` pour ne pas faire sauter le contenu (fixed plutôt que sticky, sinon la hauteur
  du document change).
- Ce que ça fait : le nom de l'artisan occupe l'écran d'ouverture puis se range en barre fixe. C'est
  un **squelette** différent (GOUT §1 : la différence vient du squelette), pas un effet posé sur une
  section.
- Dans notre moteur : nouvelle coquille `src/shells/couverture.astro` (hero + nav fusionnés), à
  enregistrer dans `SHELLS`. Le hero `typographic` existant reste séparé de la nav. Sans support :
  hero normal puis `Nav/bar`.
- Coût : moyen. Risque IA : non. iPhone : iOS 26, piloté par le compositeur ; mesurer la course sur
  `100svh` (piège `CLAUDE.md`) plutôt que `100vh`.

### B4. Ligne de progression d'une piste horizontale, hors du scroller (`scroll(inline)` + `timeline-scope`)
- Où vue : [MDN `timeline-scope`](https://developer.mozilla.org/en-US/docs/Web/CSS/timeline-scope)
  (un ancêtre commun déclare `timeline-scope: --nom`, le scroller `scroll-timeline-name: --nom`, un
  frère quelconque `animation-timeline: --nom`) ; [démo Carousel Step Indicator](https://scroll-driven-animations.style/demos/horizontal-carousel/css/).
- Ce que ça fait : sous la piste d'A3, un trait de 1 px dont `scaleX` suit le défilement latéral.
  Remplace les points de pagination (pilules, GOUT §2) par une mesure.
- Dans notre moteur : dans `Proof/piste.astro`, `scroll-timeline: --piste inline` sur la piste et
  un `<span class="piste-progres">` frère. `data-scroll-progress` existe mais pour la page entière
  (axe vertical).
- Coût : petit. Risque IA : non. iPhone : iOS 26 ; avant, trait absent.

### B5. Éléments qui entrent et **sortent** (fly-in, fly-out) avec `view()`
- Où vue : [démo Fly-in Fly-out Contact List](https://scroll-driven-animations.style/demos/contact-list/css/) ;
  plages `entry`/`exit` de [MDN `animation-range`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-range).
- Ce que ça fait : une liste longue (zones desservies, horaires par jour, réalisations) dont chaque
  ligne glisse en entrant par le bas et s'efface en sortant par le haut ; la page respire sans
  qu'une section soit épinglée.
- Dans notre moteur : `data-reveal-native` ne joue que l'entrée (`animation-range: entry 0% cover
  30%`, `global.css` l. 600). Ajouter `data-reveal-native="aller-retour"` avec une seconde animation
  sur `exit`.
- Coût : petit. Risque IA : **oui si généralisé** (« le même fade-in sur chaque élément » est le
  signe IA n° 1 côté motion, `animations-2.md` R6). Une liste par page, jamais sur les titres.
  iPhone : iOS 26, composité.

### B6. Colonnes de galerie à vitesses différentes
- Où vue : [démo Reverse-Scrolling Columns](https://scroll-driven-animations.style/demos/reverse-scroll/css/)
  (la colonne centrale défile à l'envers des deux autres, en CSS) ;
  [Codrops ElasticGridScroll](https://github.com/codrops/ElasticGridScroll) (MIT, GSAP ScrollTrigger +
  ScrollSmoother : colonnes qui se décalent avec la vitesse de scroll, images Midjourney dans la démo).
- Ce que ça fait : trois colonnes de photos de chantier, celle du milieu décalée ; l'œil balaie.
- Dans notre moteur : `data-parallax-depth` + enfants `data-depth` fait déjà du multi-vitesse en
  GSAP. Nouvelle variante `Proof/gallery-colonnes.astro` qui pose un `data-depth` par colonne (repli
  GSAP) et, sous `@supports`, `animation-timeline: scroll()` par colonne.
- Coût : moyen. Risque IA : non si les photos sont celles du client (jamais Midjourney, règle 2
  de `CLAUDE.md`). iPhone : CSS sur iOS 26 ; GSAP avant, c'est une translation simple, acceptable
  (GOUT §4).

### B7. Animations **déclenchées** au scroll en CSS (`animation-trigger`, `timeline-trigger`)
- Où vue : [Chrome](https://developer.chrome.com/blog/scroll-triggered-animations) (« landing in
  Chrome 145 » : `timeline-trigger: --t view() …`, `animation-trigger: --t play-forwards
  play-backwards`, `trigger-scope`, repli IntersectionObserver dans la démo) ;
  [lilting.ch](https://lilting.ch/en/articles/chrome-146-scroll-animation-safari-grid-lanes) (source
  secondaire : Chrome 146 stable en mars 2026).
- Ce que ça fait : c'est `data-reveal` sans IntersectionObserver : une animation en temps, jouée une
  fois à l'entrée dans l'écran, déclarée en CSS.
- Dans notre moteur : rien à faire maintenant. Quand Safari suivra, `data-reveal` pourra devenir
  une règle CSS sous `@supports (animation-trigger: none)`. À surveiller sur modern-css.com.
- Coût : nul aujourd'hui. Risque IA : non. iPhone : non supporté.

### B8. Transition « pixel » entre sections (Codrops, Atelier North)
- Où vue : [codrops/atelier-north](https://github.com/codrops/atelier-north) (9 oct 2026, MIT :
  landing minimale d'un studio d'architecture en Astro + GSAP ScrollTrigger + Lenis, transition
  pixelisée entre sections au scroll et révélation « pixel » des images sur canvas ; tutoriel
  `tympanus.net/codrops/?p=123651`, refusé au fetch).
- Ce que ça fait : la frontière entre deux sections se dissout en gros pixels pendant le scroll.
- Dans notre moteur : effet `rich` nouveau (`data-pixel`), canvas piloté par ScrollTrigger. Un seul
  feu d'artifice par page (GOUT §1), directions `retro`/`pop`/`brut` seulement.
- Coût : gros. Risque IA : moyen (le pixel est une esthétique datée, pas un signe IA). iPhone :
  canvas redessiné image par image au scroll = saccade (GOUT §4) → à faire en **étapes**
  (`data-etapes`) ou ne pas faire. Priorité basse.

---

## C. Mises en page et squelettes

### C1. Masonry natif (`display: grid-lanes`)
- Où vue : [ics.media](https://ics.media/en/entry/260611/) (Safari 26.4, mars 2026 : `display:
  grid-lanes; grid-template-columns: repeat(auto-fill, minmax(144px, 1fr))`, chaque item va dans la
  voie la plus courte, `grid-template-rows` à la place donne des « briques » horizontales) ;
  [modern-css.com](https://modern-css.com/changelog/) (Chrome, Edge, Firefox derrière un drapeau) ;
  [lilting.ch](https://lilting.ch/en/articles/chrome-146-scroll-animation-safari-grid-lanes) (Chrome
  140 avait `display: masonry`, migre vers `grid-lanes`).
- Ce que ça fait : galerie de réalisations aux hauteurs libres sans lib ni absolue.
- Dans notre moteur : `Proof/gallery` est une grille régulière. Variante `Proof/gallery-lanes.astro`
  : `columns: 3` (CSS multi-colonnes, partout) et `@supports (display: grid-lanes)` par-dessus,
  qui corrige l'ordre de lecture (les colonnes CSS lisent en colonne, grid-lanes en ligne).
- Coût : petit. Risque IA : non (pas de vignettes inclinées, GOUT §2). iPhone : iOS 26.4 ; avant,
  colonnes CSS.

### C2. Cartes alignées entre elles et éditorial pleine largeur (subgrid)
- Où vue : [dbushell, avril 2026](https://dbushell.com/2026/04/02/css-subgrid-is-super-good/)
  (colonne de lecture `min(45rem, …)` avec lignes nommées, blocs « full-width » qui sortent jusqu'au
  bord de l'écran tout en gardant le texte aligné sur la colonne, sans wrapper ni marge négative ;
  « support suffisant pour n'avoir eu aucune plainte ») ; relayé par Smashing n° 561.
- Ce que ça fait : (a) `Services/grid`, `Services/cards-hover` : titre, prix et bouton de chaque
  carte sur la même ligne horizontale d'une carte à l'autre, quelle que soit la longueur des textes ;
  (b) direction `journal` : une photo qui sort de la colonne de texte pour aller au bord.
- Dans notre moteur : zéro `subgrid` dans `src/`. (a) `grid-template-rows: subgrid; grid-row: span
  3` sur les cartes ; (b) grille nommée dans `src/shells/index.astro` pour `About/story`.
- Coût : petit (a), moyen (b). Risque IA : non. iPhone : oui (`animations.md` §2 ne le liste pas ;
  dbushell le juge acquis).

### C3. Sections qui s'adaptent à leur coquille, pas à l'écran (container queries, `cqi`)
- Où vue : [mattwaler.com](https://mattwaler.com/blog/container-query-typography-systems/)
  (`*:has(.h2) { @container }`, titres en `@md:`/`@lg:` : la même classe dans une colonne ou
  en pleine largeur) ; Smashing n° 561 ; terrain : [unionboulangerie.com](https://unionboulangerie.com/)
  (`.c-form { container-type: inline-size; container-name: form }`),
  [grndwrk.studio](https://grndwrk.studio/) (`container-type: size` puis `width: min(100cqw,
  calc(100cqh * var(--ar-w) / var(--ar-h)))` pour un cadre qui tient dans son conteneur en gardant
  son ratio).
- Ce que ça fait : en coquille `sidebar` ou `split`, une section ne voit que 60 % de l'écran mais
  nos points de rupture lisent le viewport : grilles trop serrées (rodage du 13 oct, `global.css`
  l. 356). Avec `container-type: inline-size` sur `.section`, `Services/grid` passe à deux colonnes
  quand **elle** fait moins de 48rem.
- Dans notre moteur : un seul `container-type` dans `src/` (`:has(> h1.hero-titre)`). Poser
  `container-type: inline-size` sur le conteneur de chaque section (dans `Section.astro` ou
  `global.css`) puis convertir les `md:grid-cols-*` critiques en `@container`. Le motif `cqw/cqh`
  de grndwrk sert aux démos 390:844 du site du studio (GOUT §3, écran entier).
- Coût : moyen (beaucoup de sections, à faire variante par variante). Risque IA : non. iPhone : oui
  (Baseline 2023).

### C4. Ordre de lecture d'un bento (`reading-flow`)
- Où vue : [MDN `reading-flow`](https://developer.mozilla.org/en-US/docs/Web/CSS/reading-flow)
  (`grid-rows`, `grid-columns`, `flex-visual` ; les `tabindex` positifs sont ignorés ; limited
  availability, Chrome 137 d'après modern-css.com).
- Ce que ça fait : quand `Services/bento` réordonne visuellement ses cellules, la tabulation et le
  lecteur d'écran suivent l'ordre visuel.
- Dans notre moteur : une ligne `reading-flow: grid-rows` sur la grille bento. Sans support, rien ne
  change.
- Coût : petit. Risque IA : non. iPhone : sans effet (pas supporté), sans risque.

### C5. Colonnes de journal qui replient (`column-wrap`, `column-height`)
- Où vue : [CSS-Tricks](https://css-tricks.com/css-multi-column-layout-wrapping-features/) (Chrome
  145+ seulement en avril 2026 ; le seul mode qui fragmente un texte continu en colonnes **et** en
  rangées, façon journal).
- Ce que ça fait : un long texte « histoire de la maison » en trois colonnes qui reprennent en
  dessous au lieu de déborder à droite.
- Dans notre moteur : direction `journal`, `About/story`. À suivre, pas avant Safari.
- Coût : petit. Risque IA : non. iPhone : non supporté (une colonne, c'est très bien sur téléphone).

### C6. Barre basse et bouton flottant au-dessus de la barre d'accueil iPhone (`safe-area-inset`)
- Où vue : [Polypane](https://polypane.app/blog/using-safe-area-inset-to-build-mobile-safe-layouts/)
  (`viewport-fit=cover` obligatoire pour aller bord à bord, `bottom: calc(env(safe-area-inset-bottom)
  + 10px)`, les insets peuvent tomber à 0 quand la barre de Safari se replie, l'émulation Chrome
  renvoie toujours 0) ; Smashing n° 561.
- Ce que ça fait : `Nav/dock` et `Cta/phone-giant` (fixés en bas) ne passent pas sous l'indicateur
  d'accueil.
- Dans notre moteur : déjà fait dans `ContactDrawer.astro` (l. 91) et dans la nav sur mesure du site
  du studio (`sites/finck-fisch/sections/Nav.astro`, `--barre`). **Pas généralisé** aux variantes de
  `src/sections/Nav/dock.astro` et `Cta/phone-giant.astro` : à faire, c'est une ligne chacune.
- Coût : petit. Risque IA : non. iPhone : c'est le sujet.

### C7. Hero qui change de ton par section (`data-theme` par section)
- Où vue : [wearebou.com](https://wearebou.com/) (`data-theme` ×16, chaque section porte son thème).
- Déjà couvert : `data-tone="alternate"` et les tokens par section (`references.md` move 19).
  Rien à faire ; noté ici parce que c'est le motif le plus fréquent des sites Astro lus.

---

## D. Typographie et images

### D1. Texte ajusté à la hauteur des capitales (`text-box: trim-both cap alphabetic`)
- Où vue : [Chrome, `text-box`](https://developer.chrome.com/blog/css-text-box-trim) (Chrome 133,
  Safari 18.2, Firefox 154 : retire la demi-interligne au-dessus des capitales et sous la ligne de
  base ; boutons centrés optiquement avec un `padding` égal, images alignées au vrai haut du texte,
  `gap` qui redevient un vrai interlignage) ; terrain :
  [carrierescene.ca](https://carrierescene.ca/) pose `* { text-box-trim: trim-both; text-box-edge:
  cap alphabetic }` sur tout le site.
- Ce que ça fait : le `.btn` dont le texte paraît toujours un peu bas, le `h1` dont le haut ne touche
  jamais la photo d'à côté : réglés par une déclaration, pour toutes les polices.
- Dans notre moteur : absent. Dans `global.css` : `.btn, h1, h2, .hero-titre, .eyebrow { text-box:
  trim-both cap alphabetic }`. Pas sur `*` (ça change tous les `line-height` des paragraphes) ;
  vérifier `ff detect` (cramped-padding) après.
- Coût : petit. Risque IA : non, c'est un détail de typographe. iPhone : oui (Safari 18.2).

### D2. Lettrine (`initial-letter`)
- Où vue : [MDN `initial-letter`](https://developer.mozilla.org/en-US/docs/Web/CSS/initial-letter)
  (`p::first-letter { initial-letter: 3 }` = trois lignes de haut ; `3 2` = trois lignes, enfoncée de
  deux ; « limited availability », pas Baseline).
- Ce que ça fait : la première lettre du récit de l'artisan sur trois lignes, direction `journal` ou
  `encre`. Une lettrine en romain gras, jamais en italique (GOUT §2).
- Dans notre moteur : absent. Classe `.lettrine` dans `src/directions/journal/index.css`, à poser sur
  le premier paragraphe d'`About/story`.
- Coût : petit. Risque IA : non. iPhone : la page MDN ne donne pas les versions ; dégrade en lettre
  normale, donc sans risque.

### D3. Photo découpée par une forme qui dit le métier (`clip-path: shape()`)
- Où vue : [MDN `shape()`](https://developer.mozilla.org/en-US/docs/Web/CSS/basic-shape/shape)
  (Baseline 2026 depuis février 2026 ; commandes `line`, `curve`, `arc`, `close` ; unités `%`, `rem`,
  `calc()` là où `path()` n'accepte que des px) ; versions sur
  [modern-css.com](https://modern-css.com/whats-new/?year=2025) : Chrome 135, Safari 18.4,
  Firefox 148.
- Ce que ça fait : la photo du hero coupée par une pente de toit (couvreur), une arche (tailleur de
  pierre), un angle de 15° (`brut`), qui suit la taille du cadre parce que les unités sont relatives.
- Dans notre moteur : `data-reveal="clip|wipe|mask"` anime un `inset()`, pas une forme. Nouveau token
  `--decoupe` par direction (`none` par défaut), appliqué au conteneur photo de `Hero/split` et
  `Hero/fullbleed`, avec `@supports (clip-path: shape(from 0 0, close))`.
- Coût : petit. Risque IA : **oui pour les formes molles** (« organic blob shapes », recyclage 2024
  d'après [studiomeyer](https://studiomeyer.io/en/blog/webdesign-trends-2026-reality-check)). Droites
  et arcs géométriques seulement. iPhone : oui (iOS 18.4).

### D4. Logo clair/sombre en une règle (`light-dark()` pour les images)
- Où vue : [bram.us](https://www.bram.us/2026/03/19/more-easy-light-dark-mode-switching-light-dark-is-about-to-support-images/)
  (`background-image: light-dark(url(clair.png), url(sombre.png))`, Chrome 150, Firefox 150,
  Safari 27 ; repli `@supports (background-image: light-dark(none, none))`) ;
  [MDN `light-dark()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark)
  (couleurs Baseline 2024 ; images acceptées, pas de mélange des deux).
- Ce que ça fait : un logo client qui s'inverse sur les sections `data-tone` sombres sans deux balises.
- Dans notre moteur : nos sites n'ont pas de mode sombre (une direction = un thème). Non prioritaire ;
  à garder pour le jour où `data-tone` doit inverser un logo bitmap.
- Coût : petit. Risque IA : non. iPhone : iOS 27, donc pas encore.

### D5. Graisse de la police qui réagit à la proximité du curseur (`font-variation-settings` par lettre)
- Où vue : [unionboulangerie.com](https://unionboulangerie.com/) (`data-letter` ×180,
  `data-proximity-from/to/radius`, `font-variation-settings: "wght" var(--t-serial-wght)`).
- Ce que ça fait : chaque lettre du titre s'épaissit quand le pointeur s'approche. Une boulangerie
  primée le fait ; c'est le seul effet « curseur » lu sur un site d'artisan.
- Dans notre moteur : `data-split="chars"` découpe déjà par caractère ; il manque la liaison
  pointeur → axe `wght` (`data-graisse-souris`, `rich`, `pointer: fine`).
- Coût : moyen. Risque IA : **moyen** : « typographie cinétique : un seul moment fort, plus de
  polish que de substance si répétée » ([Bubble](https://bubble.io/blog/web-design-trends/)) ; un
  titre par site, direction `pop`/`retro`. iPhone : inerte sans pointeur (voulu), donc à ne pas
  compter comme le feu d'artifice de la page mobile.

### D6. Placeholder flou inline avant la photo (LQIP)
- Où vue : [wearebou.com](https://wearebou.com/) (`data-lqip` ×49),
  [aliciadubuis.com](https://aliciadubuis.com/) (Sanity `w=12&blur=32` avant la grande taille).
- Déjà documenté : `docs/veille/rendu.md` §4.2 (LQIP/BlurHash/ThumbHash). Pas de fiche nouvelle ;
  le terrain confirme que c'est le standard des sites Astro soignés.

---

## E. À éviter (tendances déjà « slop » ou contraires à GOUT.md)

| Technique | Pourquoi non | Source |
|---|---|---|
| Scroll-jacking, sections épinglées longues | « rarement vaut le compromis », lag sur appareils courants ; GOUT §4 | [Bubble](https://bubble.io/blog/web-design-trends/) |
| Parallax à grande amplitude, zoom au scroll | ralentit, mal des transports ; WebKit : « parallax ou zoom plus gênants qu'une barre de progression » | [tinyfrog](https://tinyfrog.com/web-design-trends-2026/), [WebKit](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/) |
| Verre dépoli / « liquid glass » sous du texte | lisibilité dépend de ce qu'il y a derrière, coût de peinture ; usage durable = barre sticky seulement (ce que `Nav/bar` fait déjà) | [studiomeyer](https://studiomeyer.io/en/blog/webdesign-trends-2026-reality-check), [setproduct](https://setproduct.com/blog/liquid-glass-vs-glassmorphism) |
| Flou progressif empilé (8 couches `backdrop-filter` + masques) | « GPU-heavy », réduire les couches sur bas de gamme ; la spec native n'existe pas encore (proposition CSSWG, janv. 2026) | [ui-skills](https://www.ui-skills.com/skills/mengto/progressive-blur/) ; proposition citée par la recherche W3C |
| Blobs organiques, formes molles | motif 2024 recyclé, « ne sort presque jamais » ; tentation avec `shape()` (D3) | [studiomeyer](https://studiomeyer.io/en/blog/webdesign-trends-2026-reality-check) |
| Hero 3D / WebGL, carrousel 3D au scroll | « underdelivered » sauf configurateur ; sur iPhone, un canvas redessiné au scroll saccade (GOUT §4) | [studiomeyer](https://studiomeyer.io/en/blog/webdesign-trends-2026-reality-check), [codrops/3DCarousel](https://github.com/codrops/3DCarousel) |
| Typographie cinétique répétée, texte qui se « décode » partout | « plus de polish que de substance » hors d'un seul hero ; notre `data-scramble` : zéro ou une fois par site | [Bubble](https://bubble.io/blog/web-design-trends/), [studiomeyer](https://studiomeyer.io/en/blog/webdesign-trends-2026-reality-check) |
| Bento à cellules égales ou remplies pour remplir | « ne fait rien quand toutes les cases ont la même taille » ; rien d'inventé (`CLAUDE.md` règle 2) | [Bubble](https://bubble.io/blog/web-design-trends/) |
| Images IA génériques | « repérées instantanément » ; `REDACTION.md` | [Bubble](https://bubble.io/blog/web-design-trends/) |
| Carrousels automatiques, vidéo autoplay | performent moins que du contenu fixe ; iOS en économie d'énergie bloque l'autoplay (GOUT §3) ; « rien ne tourne tout seul » (GOUT §4) | [tinyfrog](https://tinyfrog.com/web-design-trends-2026/) |
| Néomorphisme sur tout le site | contraste faible, accessibilité | [tinyfrog](https://tinyfrog.com/web-design-trends-2026/) |
| Préchargeur avec compteur | « risque de performance perçue, à éviter mobile » | `references.md` move 37 |
| Back-out `cubic-bezier(.34,1.56,.64,1)` comme courbe maison | lu tel quel dans 4 des 18 sites : ce n'est plus une signature | inventaire §0 ; remplacer par A10 |
| Halo qui suit la souris, grain, reflet, dégradés aurora | interdits par GOUT §2, **alors que le moteur les propose encore** : `data-spotlight`, `data-grain`, `data-tilt-glare`, `data-shader="aurora\|grain-gradient"` | `GOUT.md` §2, `ANIMATIONS.md` |

Deux lignes de `references.md` §5 sont aussi contredites par GOUT §2 depuis le 6 octobre : le move
24 (numérotation éditoriale 01, 02) et le move 27 (emphase italique dans le titre). À retirer de la
liste des moves « quasi gratuits » lors de la prochaine mise à jour de ce fichier.

---

## Les 8 à implémenter en premier (impact / coût)

1. **D1 `text-box: trim-both cap alphabetic`** sur `.btn`, `h1`, `h2` : polish immédiat sur tous les
   sites, une déclaration, iPhone 18.2+. (impact moyen partout / coût petit)
2. **A5 FAQ native** (`name`, `::details-content`, `interpolate-size`) : supprime le chargement de
   GSAP Flip pour la FAQ, accordéon exclusif gratuit. (élevé / petit)
3. **A3 + A12 + B4 `Proof/piste.astro`** : piste manuelle scroll-snap avec ombres de défilement et
   trait de progression ; répond au « scroll latéral manuel » demandé le 14 oct. et retire les
   points-pilules. (élevé / moyen)
4. **B1 `data-parallax-native`** : le parallax passe au compositeur sur iOS 26, GSAP en repli ; c'est
   la réponse technique au « pas fluide » du 12 oct. (élevé / petit)
5. **A13 `data-marquee-fade`** : le marquee cesse de couper les mots net. (moyen / petit)
6. **C2 subgrid sur `Services/grid` et `cards-hover`** : prix et boutons alignés d'une carte à
   l'autre. (moyen / petit)
7. **B3 coquille `couverture`** : un squelette de plus, différent de tout ce qu'on a, piloté par le
   défilement sans JS. (élevé / moyen)
8. **A6 navs en `popover`** : trois scripts maison en moins, Échap et clic dehors gérés par le
   navigateur, moins de cas dans `onPage()`. (moyen / moyen)

Juste derrière : A10 (`linear()` pour `pop` et `signal`), C1 (`grid-lanes`), C3 (container
queries des sections, gros chantier mais structurant), C6 (généraliser `safe-area-inset` à `Nav/dock`
et `Cta/phone-giant`).

## Déjà couvert, ne pas refaire

| Trouvé pendant la veille | Ce que le moteur a déjà |
|---|---|
| Barre de progression de lecture en `scroll-timeline` (démo Bramus) | `data-scroll-progress` (CSS `scroll-timeline` + repli JS) |
| Reveal à l'entrée en `animation-timeline: view()` (démo Image Reveal) | `data-reveal-native` (`global.css` l. 596) ; les variantes `clip/wipe/mask` restent en IO |
| Pile sticky de sections, cartes qui s'empilent | `data-sticky-stack`, `data-stack` (B2 n'ajoute que le rétrécissement CSS) |
| Section horizontale épinglée (démo Horizontal Scroll Section) | `data-horizontal` + `.h-track` |
| Nav qui se cache à la descente, se densifie au scroll | `data-nav="hide-on-scroll"`, `.is-scrolled` (`motion.ts` l. 755) ; A1/A2 = couche CSS future |
| `text-wrap: balance` / `pretty`, `hanging-punctuation`, `tabular-nums` | `global.css` l. 119-121, l. 248 ; 15 usages de `tabular-nums` |
| Césure française (`hyphens: auto`, `hyphenate-limit-chars`, `lang`) | `global.css` l. 181-198 |
| Champs : `field-sizing: content`, `:user-invalid` / `:user-valid` | `craft.css` l. 274-336, `ContactForm.astro` |
| `@starting-style` + `allow-discrete` sur un `<dialog>` | `ContactDrawer.astro` l. 103-126 |
| `scroll-snap` vertical en coquille | `src/shells/slides.astro` (proximity, jamais piégeant) |
| `safe-area-inset-bottom` | `ContactDrawer.astro`, `sites/finck-fisch/sections/Nav.astro` (à généraliser, C6) |
| `scrollbar-gutter: stable`, `overscroll-behavior`, `inert`, `content-visibility` | `craft.css` l. 207, `shells/index.astro`, navs |
| Transitions de page natives, nav qui persiste (`view-transition-name`) | `site.transitions` + `ClientRouter`, groupe `ff-nav`, hero `ff-hero` (drasa.uk fait la même chose sur sa nav) |
| Traînée d'images au curseur (Codrops MotionTrailAnimations, oct. 2026) | `data-trail`, `data-hover-img`, `data-hover-distort` |
| Colonnes à vitesses différentes en GSAP (Codrops ElasticGridScroll) | `data-parallax-depth` + `data-depth`, `data-scrub-lag` (B6 = version CSS + variante) |
| Marquee dont la vitesse suit le scroll | `data-marquee-velocity` |
| Thème par section (`data-theme` chez wearebou) | `data-tone="alternate"` |
| Placeholder flou avant la photo (`data-lqip`) | documenté `rendu.md` §4.2 |
| Scroll fluide Lenis (5 sites sur 18) | `data-smooth` (opt-in, jamais par défaut, jamais sous `pointer: coarse` : `animations-2.md` R5) |
| Avant/après à curseur | `data-compare`, `Proof/before-after` |
| Titre révélé par lignes masquées, split par caractères | `data-split="lines"`, `data-split="chars"` |
| `color-mix()`, `@property`, `font-variation-settings` | `global.css` (surface-tint, border-beam), directions |
| Container query sur le titre du hero | `:has(> h1.hero-titre) { container-type: inline-size }` (`global.css` l. 360), à étendre (C3) |
