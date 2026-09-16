# Veille — composants et sections open source à porter dans ff-atelier

Recherche du 16 septembre 2026. Objectif : recenser les bibliothèques de composants, thèmes et
plateformes de design du web ouvert susceptibles d'inspirer de nouvelles variantes de section
(`src/sections/<Type>/<variante>.astro`), en vérifiant systématiquement la licence, la portabilité
technique vers notre stack (Astro 5 statique + Tailwind 4 CSS-first, **zéro React**, tokens CSS
uniquement, animations déclaratives `data-*`), et le risque juridique.

**Important** : cette veille date d'un jour donné. Les licences, prix et catalogues des plateformes
commerciales évoluent — avant tout portage réel, revérifier la page de licence de la source au moment
de l'usage, pas seulement ce document.

Vocabulaire d'animation existant (voir `src/scripts/motion.ts` et `docs/CONVENTIONS.md`) :
`data-reveal`, `data-stagger`, `data-parallax`, `data-counter`, `data-split`, `data-marquee`,
`data-magnetic`, `data-tilt`. Deux nouveaux attributs ressortent de la veille comme candidats
(§ 5) : `data-spotlight` (halo qui suit le curseur) et `data-border-beam` (trait lumineux qui tourne
sur une bordure).

---

## 1. Collections : licences, stack, portabilité, sections à porter

Classées en quatre familles : **A.** bibliothèques Tailwind CSS « copier-coller » (HTML/CSS, peu ou
pas de JS) ; **B.** bibliothèques React/animées à fort effet visuel (à porter, jamais à copier) ;
**C.** projets Astro natifs ; **D.** annuaires ; les plateformes à licence restrictive (Webflow,
Framer, Figma, Codrops, CodePen, GitHub) sont traitées à part au § 4 (rappel juridique) car la
question qu'elles posent est d'abord légale.

### A. Bibliothèques Tailwind CSS « copier-coller »

#### Tailwind UI / Tailwind Plus (tailwindcss.com/plus)
- **Licence** : propriétaire, payante. Page officielle <https://tailwindcss.com/plus/license> (non
  consultable sans compte — mur de connexion constaté). Synthèse croisée : autorise de construire un
  site pour un client qui en devient propriétaire, usage illimité pour ses propres projets ; **interdit**
  de redistribuer les composants comme template/thème/UI kit/générateur de site revendu à plusieurs
  clients, ou de créer un produit concurrent de Tailwind Labs. Pas d'obligation d'attribution visible.
- **Stack / portabilité** : HTML, React et Vue fournis. Le HTML/Tailwind statique (hero, footer, stats)
  se porte facilement ; les composants interactifs s'appuient sur Headless UI (React/Vue) → portage
  **moyen à difficile** (réécrire la logique en JS vanilla piloté par `data-*`).
- **Sections à porter** (catalogue non vérifié en direct ce jour, à confirmer manuellement avant usage) :

| Section | Pourquoi | Effort | Animation |
|---|---|---|---|
| Bento Grids (UI Blocks marketing) | grille asymétrique, à comparer au delta réel vs `services:bento` | moyen | `data-reveal`/`data-stagger` |
| Stats sections | grille de chiffres clés pour `proof`/`about:values` | petit | `data-counter` |
| Flyout / mega menus | sous-menu riche absent de `nav` | moyen | `data-reveal` |

#### HyperUI (hyperui.dev)
- **Licence** : **MIT** — <https://github.com/markmead/hyperui/blob/main/LICENSE>. Usage commercial et
  personnel libre, aucune attribution requise, modification/redistribution autorisées.
- **Stack / portabilité** : HTML + classes Tailwind pures, quasiment aucun JS. **Facile** — candidat le
  plus direct pour Astro.
- **Sections à porter** :

| Section | Source | Pourquoi | Effort | Animation |
|---|---|---|---|---|
| Newsletter CTA centré | <https://hyperui.dev/components/marketing/ctas> | absent de `cta` (band/card/phone-giant) | petit | `data-reveal` |
| Contenu image + texte empilement vertical | <https://hyperui.dev/components/marketing/sections> | complète `about:story` | petit | `data-reveal` |
| Footers (24 variantes) | <https://hyperui.dev/components/marketing/footers> | dispositions plus riches que `footer:columns` | petit-moyen | aucune |
| Team Sections | <https://hyperui.dev/components/marketing/team-sections> | mode « équipe multiple » pour `about:portrait` | petit | `data-stagger` |
| Headers | <https://hyperui.dev/components/marketing/headers> | dispositions de nav alternatives | petit | `data-reveal` |

#### Flowbite (flowbite.com)
- **Licence — deux périmètres distincts** : core open source (`/docs/components/...`) en **MIT**
  (<https://flowbite.com/docs/getting-started/license/>) ; **Flowbite Pro** (blocs marketing premium)
  sous EULA propriétaire séparé (<https://flowbite.com/license/>) — ne pas confondre. Doc sous CC BY 3.0.
- **Stack / portabilité** : HTML + Tailwind + **flowbite.js** (JS vanilla, initialisation par attributs
  `data-*`). **Moyen** : retirer flowbite.js et migrer les comportements interactifs vers `motion.ts` ;
  le HTML/Tailwind statique se porte facilement.
- **Sections à porter** (confirmées MIT via `/docs/components/`) :

| Section | Source | Pourquoi | Effort | Animation |
|---|---|---|---|---|
| Device Mockups (iPhone, tablette, iMac...) | <https://flowbite.com/docs/components/device-mockups/> | aucun cadre d'appareil dans notre bibliothèque | petit | `data-tilt`/`data-parallax` |
| Stepper (timeline horizontale/verticale) | <https://flowbite.com/docs/components/stepper/> | enrichit `process:numbered/timeline` | moyen | `data-stagger` |
| Gallery avec filtres par étiquette | <https://flowbite.com/docs/components/gallery/> | filtrage absent de `proof:gallery` | moyen | `data-reveal` |
| Footer plan du site | <https://flowbite.com/docs/components/footer/> | variante plus riche que `footer:columns` | petit | aucune |
| Navbar (rétrécissement au scroll) | <https://flowbite.com/docs/components/navbar/> | aucune variante `nav` ne gère cet état | moyen | — |

#### Preline UI (preline.co)
- **Licence** : double licence **MIT + « Preline UI Fair Use License »** —
  <https://preline.co/docs/license.html>. Gratuit pour usage commercial/client illimité. Interdit de
  créer un produit concurrent de Preline ; attribution exigée pour les œuvres dérivées de type
  outil réutilisable (thèmes/kits) — un site client final qui *utilise* Preline sans le redistribuer
  semble relever du MIT seul (zone à trancher au cas par cas).
- **Stack / portabilité** : HTML + Tailwind + preline.js (JS propre, attributs `data-*`). **Moyen** :
  marquage statique facile, comportements interactifs à réécrire (le marquee CSS pur se porte tel quel).
- **Sections à porter** — <https://preline.co/examples.html> (972+ blocs) :

| Section | Source | Pourquoi | Effort | Animation |
|---|---|---|---|---|
| Vertical Marquee (2 colonnes, sens opposés) | <https://preline.co/blocks/marketing/marquee/> | variante verticale de `proof:marquee-quotes` | petit | `data-marquee` |
| 3D Marquee (cartes en perspective) | <https://preline.co/blocks/marketing/marquee/> | profondeur 3D absente de nos variantes | moyen | `data-marquee` + `data-tilt` |
| Finance Ticker (bandeau une ligne) | <https://preline.co/blocks/marketing/marquee/> | ticker d'annonces/prix en boucle | petit | `data-marquee` |
| Hero fond jour/nuit en fondu | <https://preline.co/blocks/marketing/hero-sections/> | fond dynamique absent de `hero:fullbleed` | moyen | `data-reveal` + boucle CSS |

⚠️ Plusieurs blocs Preline sont marqués **Pro** — vérifier le badge Free/Pro par page avant portage.

#### daisyUI (daisyui.com)
- **Nature** : **pas une bibliothèque de blocs** — un **plugin Tailwind** qui ajoute des classes
  sémantiques (`btn`, `card`, `stat`, `timeline`, `diff`) avec son propre système de thème.
- **Licence** : **MIT** — <https://github.com/saadeghi/daisyui/blob/master/LICENSE>.
- **Stack / portabilité** : **ne pas installer le plugin** — son système de variables de thème entre en
  conflit direct avec la contrainte « tokens CSS uniquement » (double système à maintenir). En
  revanche, **piller la structure HTML/CSS** de composants ciblés, sans le plugin, est facile et vaut
  le coup :

| Section | Source | Pourquoi | Effort | Animation |
|---|---|---|---|---|
| `diff` (avant/après en curseur CSS pur) | <https://daisyui.com/components/diff/> | alternative plus légère (zéro JS, `<input type="range">`) à `proof:before-after` | petit | aucune ou `data-reveal` |
| `stat` (bloc chiffre-clé structuré) | <https://daisyui.com/components/stat/> | structure prête pour tout usage de `data-counter` | petit | `data-counter` |
| `timeline` (`timeline-start/middle/end`) | <https://daisyui.com/components/timeline/> | alternative structurelle à `process:timeline`, bascule horizontal/vertical native | petit-moyen | `data-stagger` |
| `mockup` (browser/phone/window) | <https://daisyui.com/components/> | cadre décoratif CSS-only pour capture d'écran/vidéo | petit | aucune ou `data-tilt` |

---

### A2. Bibliothèques Tailwind CSS moins connues

#### Meraki UI (merakiui.com)
- **Licence** : **MIT** — <https://github.com/merakiuilabs/merakiui/blob/master/LICENSE>. (La page
  `merakiui.com/license` renvoie 404 — se fier au GitHub.) Gratuit intégralement.
- **Stack / portabilité** : Tailwind v4.1, HTML/Tailwind pur, variantes Alpine/Vue/Blade en option.
  **Facile** en choisissant la version HTML.
- **Sections à porter** (catalogue marketing à explorer précisément sur
  <https://merakiui.com/components/marketing>) : hero (split image/texte), pricing (7 variantes —
  aucun type « pricing » chez nous), blog (6 variantes, hors périmètre actuel). Effort petit,
  `data-reveal`/`data-stagger`.

#### Tailblocks (tailblocks.cc, ex mertjf.github.io/tailblocks)
- **Licence** : **MIT** — <https://github.com/mertJF/tailblocks>.
- **Stack / portabilité** : HTML/Tailwind pur, **facile**, mais projet ancien (design potentiellement
  daté) — priorité basse. Catégories historiques : hero, features, testimonials, stats, footer, CTA,
  contact, pricing.

#### Kometa UI Kit
- **Introuvable.** Aucune ressource « Kometa UI » liée à Tailwind CSS localisée (Bing + GitHub).
  À écarter de la veille tant que l'URL exacte n'est pas fournie par la source d'origine.

#### Float UI (floatui.com)
- **Licence** : conditions dédiées <https://floatui.com/license> — autorise la création de « End
  Products » vendus à des utilisateurs finaux (usage commercial client autorisé), pas d'attribution
  requise. Interdit : redistribuer les composants seuls, créer un « website builder », revendre des
  thèmes/kits basés dessus. Dépôt <https://github.com/MarsX-dev/floatui>.
- **Stack / portabilité** : HTML + variantes React/Vue/Svelte. **Facile** en choisissant HTML.
- **Sections à porter** — <https://floatui.com/components> : Hero Sections (petit-moyen,
  `data-reveal`+`data-split`), Stats (petit, `data-counter`), Logo Grid (petit, `data-stagger`, utile
  pour `proof:logos`), FAQs (petit, alternative à `faq:accordion`).

#### Sailboat UI (sailboatui.com)
- **Licence** : **MIT** — <https://github.com/sailboatui/sailboatui>. Projet actif.
- **Stack / portabilité** : Tailwind + **Alpine.js** pour les composants interactifs (dropdown, tabs).
  **Moyen** pour l'interactif (réécrire en vanilla), **facile** pour le statique.
- **Limite** : centré sur des atomes d'application (avatar, badge, dropdown, pagination — 150+
  composants) ; les « sections marketing » sont annoncées **« soon »** — rien d'exploitable
  aujourd'hui pour des sections hero/nav/footer complètes. À resurveiller.

#### Wicked Blocks (wickedblocks.dev)
- **N'existe plus sous ce nom** : redirige en 308 vers <https://www.shadcnblocks.com> — 2104
  composants bâtis sur **shadcn/ui (React) + Radix UI + Tailwind**. **Inutilisable en copier-coller**
  (viole la contrainte « pas de React ») — à réserver à l'inspiration visuelle redessinée à la main,
  effort systématiquement grand.

#### Mamba UI (mambaui.com)
- **Licence** : **MIT** — <https://github.com/Microwawe/mamba-ui> (« so you can use them in your own
  projects as you wish »). Gratuit intégralement.
- **Stack / portabilité** : Tailwind pur, pas d'Alpine identifié. **Facile**.
- **Sections à porter** (~41 catégories, 150+ blocs) — <https://mambaui.com/components> : Hero (5
  variantes, petit, `data-reveal`+`data-stagger`), CTA (6 variantes, petit, `data-reveal`), Testimonial
  (5 variantes, petit, `data-stagger`), Footer (5 variantes, petit), Team (4 variantes, moyen, hors
  périmètre actuel mais adaptable à `about`).

#### Pagedone (pagedone.io)
- **Licence à deux niveaux** : bibliothèque de base **MIT** (« Pagedone UI is Open Source... licensed
  under MIT »). Tiers payants (Developer Plus 24 $/mois ou 199 $ à vie, Designer Plus 89 $ à vie —
  12 000+ composants) sous EULA distinct <https://pagedone.io/license> : usage commercial autorisé,
  **interdit** de revendre/sous-licencier/distribuer indépendamment, de créer des produits dérivés
  (thèmes, kits, page builders). **Pour notre usage (site client livré, pas de revente de template),
  les deux tiers sont exploitables sans risque.**
- **Stack / portabilité** : Tailwind v4.1, HTML/Tailwind pur. **Facile**.
- **Sections à porter** — <https://pagedone.io/blocks> (1100+ blocs) : hero, témoignages, FAQ (petit,
  `data-reveal`/`data-stagger`), pricing (hors périmètre actuel), équipe (moyen).

#### Tailgrids (tailgrids.com)
- **Licence, précisée par plan** — <https://tailgrids.com/license> : plan gratuit « Essentials »
  100 % gratuit, **MIT**, usage commercial explicitement autorisé (« Allowed to charge clients for your
  work »), aucune attribution obligatoire même en gratuit ; plans payants (199-349 $ à vie) toujours
  « Personal and Commercial Use » illimité. Interdit dans tous les cas : revente/redistribution telle
  quelle, usage comme générateur de sites.
- **Stack / portabilité** : composants disponibles en **React ET HTML** (bascule sur le site).
  **Facile** en choisissant HTML.
- **Sections à porter** — <https://tailgrids.com/blocks> :

| Section | Pourquoi | Effort | Animation |
|---|---|---|---|
| Bento Grids (4 variantes) | correspond à `services:bento`, rare ailleurs | petit-moyen | `data-reveal`+`data-stagger` |
| Mega Menu (4 variantes) | absent de `nav` | moyen | `data-reveal` |
| Contact (7 variantes) | enrichit `contact:form-split/form-card/simple/full` | petit | `data-reveal` |
| Cookies (5 variantes) | hors périmètre des types de section, utilitaire RGPD transversal | petit | aucune |
| Error Page (5 variantes) | hors périmètre, complément technique (404) | petit | aucune |

#### Landwind
- **Introuvable** : le domaine `landwind.dev` ne résout pas, aucun dépôt identifiable sous ce nom
  exact. À écarter. Note : un projet différent, **themesberg/landwind** (GitHub, ~1k★, landing page
  Tailwind + Flowbite, **MIT**) existe et vaut d'être cité comme source alternative — voir § « GitHub
  topics » ci-dessous, à ne pas confondre avec « Landwind » (composants).

---

### B. Bibliothèques React/animées à fort effet visuel (porter en CSS/vanilla, ne jamais copier le React)

#### Aceternity UI (ui.aceternity.com)
- **Licence** : type Envato regular — <https://ui.aceternity.com/licence> : produits finaux illimités
  pour soi ou pour un client, vente/distribution du produit fini libre, modification/combinaison
  autorisée. **Interdit** : redistribuer en tant qu'image de stock/fichiers sources, vendre/revendre/
  distribuer sur une marketplace, créer des thèmes/templates dérivés à vendre. Tarifs
  (169 $/an, 199 $ à vie, 1590 $/10 places équipe — <https://ui.aceternity.com/pricing>) semblent
  couverts par la même licence. **Verdict : safe pour livrer des sites clients**, tant qu'on ne
  redistribue pas le code Aceternity en tant que librairie/thème.
- **Stack** : React + Tailwind + Framer Motion, Canvas/SVG pour les effets de fond les plus lourds.
- **Effets à porter** :

| Effet | Source | Portage CSS/vanilla | Effort | Animation |
|---|---|---|---|---|
| 3D Card Effect (tilt souris) | <https://ui.aceternity.com/components/3d-card-effect> | `mousemove` → `transform: rotateX/rotateY` via custom properties | petit | `data-tilt` (existant) |
| Text Generate / Typewriter Effect | <https://ui.aceternity.com/components/text-generate-effect>, <https://ui.aceternity.com/components/typewriter-effect> | découpage en `<span>` + IntersectionObserver + délai stagger | petit | `data-split` (existant) |
| Spotlight (halo suit le curseur) | <https://ui.aceternity.com/components/spotlight> | `mousemove` → `--x/--y` → `radial-gradient(circle at var(--x) var(--y), …)` | petit-moyen | **nouveau `data-spotlight`** |
| Infinite Moving Cards / 3D Marquee | <https://ui.aceternity.com/components/infinite-moving-cards>, <https://ui.aceternity.com/components/3d-marquee> | `@keyframes translateX` en boucle, pause au survol | petit | `data-marquee` (existant) |
| Container Scroll Animation / Macbook Scroll | <https://ui.aceternity.com/components/container-scroll-animation>, <https://ui.aceternity.com/components/macbook-scroll> | `animation-timeline: scroll()` natif (vérifier support navigateur) ou fallback JS scroll/IO + transform 3D | grand | proche `data-parallax`, effet plus riche |
| Animated Testimonials | <https://ui.aceternity.com/components/animated-testimonials> | transition fondu/glissement entre témoignages | moyen | `data-reveal`+`data-stagger` |

Autres pistes repérées (non détaillées) : Aurora Background, Background Beams, Bento Grid, Sticky
Scroll Reveal.

#### Magic UI (magicui.design)
- **Licence** : **MIT** — <https://github.com/magicuidesign/magicui/blob/main/LICENSE.md>. Entièrement
  gratuit et open source, 150+ composants — la plus simple sur le plan légal de cette famille.
- **Stack** : React + TypeScript + Tailwind + « Motion » (successeur de Framer Motion).
- **Effets à porter** :

| Effet | Source | Portage CSS/vanilla | Effort | Animation |
|---|---|---|---|---|
| Marquee | <https://magicui.design/docs/components/marquee> | correspond 1:1 | petit | `data-marquee` (existant) |
| Number Ticker | <https://magicui.design/docs/components/number-ticker> | `requestAnimationFrame` count-up + IntersectionObserver | petit | `data-counter` (existant) |
| Text Animate / Text Reveal | <https://magicui.design/docs/components/text-animate>, <https://magicui.design/docs/components/text-reveal> | découpage + transition par mot | petit-moyen | `data-split`/`data-reveal` |
| Border Beam (trait lumineux tournant sur une bordure) | <https://magicui.design/docs/components/border-beam> | `@property` + `conic-gradient` animé en rotation, ou `offset-path` | petit-moyen | **nouveau `data-border-beam`** |
| Dock (magnification au survol façon macOS) | <https://magicui.design/docs/components/dock> | `mousemove` → distance au curseur → `scale()` progressif | moyen | proche `data-magnetic` |

Mention à part : Globe et Particles (Canvas/WebGL) sont visuellement forts mais contraires à l'esprit
« zéro JS par défaut » — à réserver à des pages hero spécifiques si un budget JS ponctuel est accepté.

#### Cult UI (cult-ui.com)
- **Licence** : **MIT** — <https://github.com/nolly-studio/cult-ui>.
- **Confiance réduite** : site en rate-limit (429) répété lors de la recherche — noms de composants ci-
  dessous **non re-vérifiés cette session**, à recontrôler manuellement avant citation finale dans un
  livrable client :
  - Family Button (bouton flottant qui se déploie en sous-boutons) — proche `data-magnetic`, effort moyen.
  - Direction Aware Tabs (contenu qui glisse selon le sens du clic) — nouvel attribut envisageable, effort moyen.
  - BG Animate Button (dégradé animé au survol) — CSS pur probable, effort petit.
- **Stack** : React + Next.js + Framer Motion, composants souvent fortement stateful (hooks/contexte)
  → portage **moyen à élevé**, plus coûteux que Magic UI/Aceternity.

#### Uiverse (uiverse.io)
- **Licence** : le dépôt curé officiel **uiverse-io/galaxy** (<https://github.com/uiverse-io/galaxy>)
  indique « All UI elements... available under the MIT License ». Attention : ce sont des
  **soumissions communautaires individuelles** — la licence exacte peut varier par snippet, **à
  vérifier au cas par cas sur la page de chaque élément** avant intégration (accès au site bloqué en
  403 pendant cette session, non re-confirmé).
- **Stack / portabilité** : HTML + CSS pur, souvent **zéro JS** — la bibliothèque techniquement la plus
  proche nativement de notre stack. **Facile** : le travail consiste surtout à retokeniser les
  couleurs/rayons/ombres codés en dur vers nos tokens CSS.
- **Pistes** (catégories connues, URLs de snippet précis à confirmer manuellement) : Cards (glow/tilt
  CSS pur → `data-tilt`, petit), Buttons (effets liquides/magnétiques, filtre SVG « goo » → `data-
  magnetic`, petit-moyen), Loaders (spinners CSS purs, trivial).

#### shadcn/ui « blocks » (ui.shadcn.com/blocks)
- **Licence** : **MIT** — <https://github.com/shadcn-ui/ui/blob/main/LICENSE.md>.
- **Constat** : pas une bibliothèque d'effets visuels — fondation structurelle React + Radix UI +
  Tailwind, sans Framer Motion. Blocks vérifiés (dashboard-01, sidebar-07/03, login-03/04, signup)
  statiques, sans animation avancée.
- **Portage** : facile mais peu pertinent pour des effets. Utile comme **référence de mise en page**
  (ex. login-04 en split image+formulaire ≈ `contact:form-split` existant) plutôt que comme source
  d'inspiration animation ; le travail réel consiste à remplacer les primitives Radix
  (accordéon/dialog/dropdown) par des équivalents HTML natifs (`<details>/<summary>`, `<dialog>`,
  Popover API).

#### Origin UI (originui.com → redirige vers coss.com/ui)
- **Redirection** : originui.com redirige (301) vers <https://coss.com/ui> — le projet a fusionné/
  évolué vers « coss ui ».
- **Licence** : **MIT** — <https://github.com/origin-space/originui> (« apps/origin/ and apps/ui/
  directories are licensed under their original MIT license »).
- **Stack / portabilité** : React + Radix UI + Tailwind + TypeScript, orienté formulaires stylés plutôt
  qu'effets spectaculaires. **Facile à moyenne** (surtout du CSS + remplacement des primitives Radix).
- **Pistes** : inputs avancés (OTP, force du mot de passe, dropzone) pour `contact:form-split/form-
  card` (petit, `data-reveal` sur les messages de validation) ; comparison slider avant/après —
  correspond à `proof:before-after` existant (moyen, `<input type="range">` + `clip-path` CSS, nouvel
  attribut `data-compare` envisageable si on veut le rendre déclaratif).

#### 21st.dev
- **Modèle économique** — <https://21st.dev/pricing> : freemium, plan Free = navigation + copie/
  installation illimitée ; plans Builder (6-80 $/mois) = surtout l'outil de génération IA, pas un
  déblocage de composants premium au sens strict ; certains templates complets sont vendus séparément
  par leur auteur.
- **Conditions** — <https://21st.dev/terms> : usage via la plateforme autorisé, y compris commercial
  sur site client livré. Redistribution hors plateforme encadrée : lien visible vers la page d'origine
  du composant exigé. **21st.dev est un agrégateur, pas une licence unique** — beaucoup de composants
  sont des remix d'Aceternity/Magic UI/shadcn ; la licence réelle dépend du composant précis, **à
  vérifier au cas par cas**.
- **Stack** : hétérogène, majoritairement React + Tailwind + Framer Motion hérité des sources.
- **Usage recommandé** : moteur de recherche visuel façon Pinterest de composants, jamais une source de
  licence en soi — retracer chaque trouvaille à sa licence d'auteur/source avant portage.

#### Once UI (once-ui.com)
- **Licence** : **MIT (core)** + abonnement Pro pour templates/blocs — confirmé en page d'accueil
  once-ui.com. Le core (`@once-ui-system/core`, 100+ composants) est MIT et gratuit ; l'offre Pro
  payante couvre des templates prêts-à-déployer et des blocs additionnels, séparés du core.
- **Stack** : React + Next.js, « component-first design system ».
- **Intérêt principal** : philosophie de tokens de design stricte, cohérente avec notre contrainte
  « aucune couleur/police/rayon codé en dur » — référence de méthode plutôt que source d'effets à
  copier. `/docs` inaccessible (404) lors de cette recherche — noms précis de composants d'effets
  (RevealFx, GlitchFx, TiltFx...) non re-vérifiés, à confirmer manuellement.

---

### C. Projets Astro natifs (zéro conversion React nécessaire)

#### Galerie officielle astro.build/themes
- **Constat** : la page est aujourd'hui dominée par des **bundles marketplace payants**
  (Astro Themes All-Access Pass, Stella, Veltro, Shadcnblocks Astro Themes, Foxi Pro — Astro+Tailwind
  confirmé pour ce dernier...), sans licence individuelle vérifiable (pas de repo public). **Pas
  exploitable pour du portage de code** — inspiration visuelle éventuelle seulement.

#### Astroship (github.com/surjithctly/astroship)
- **Licence** : **GPL-3.0** (version gratuite) — <https://github.com/surjithctly/astroship/blob/main/LICENSE>.
  Copyleft : réutilisable commercialement, mais toute œuvre dérivée distribuée doit rester GPL-3.0 avec
  code source accessible. **Risque juridique réel pour un studio qui livre des sites clients fermés**
  — à écarter en l'état, sauf réécriture complète à partir de la seule structure visuelle. Version Pro
  payante distincte non vérifiée en détail.
- **Stack** : Astro v3 (pas v5) + Tailwind (version probablement 3, projet ancien). Portabilité
  structurelle correcte, CSS à réécrire en v4.
- **Verdict** : composants (`hero.astro`, `logos.astro`, `pricing.astro`) intéressants comme structure
  seulement, jamais comme code à copier.

#### AstroWind (github.com/onwidget/astrowind)
- **Licence** : **MIT** — confirmé sur <https://raw.githubusercontent.com/onwidget/astrowind/main/LICENSE.md>.
  Usage commercial client libre, seule obligation = conserver la mention de copyright.
- **Stack** : **Astro v7 + Tailwind CSS v4 CSS-first** — confirmé explicitement par le README. **Seul
  projet de cette veille qui matche exactement notre stack cible → portabilité maximale.**
- **37 widgets** dans <https://github.com/onwidget/astrowind/tree/main/src/components/widgets>. Les 5
  prioritaires :

| Widget | Correspond à | Pourquoi | Effort | Animation |
|---|---|---|---|---|
| Bento.astro | `services:bento` | implémentation Tailwind déjà écrite, gain de temps | petit | `data-reveal`+`data-stagger` |
| Comparison.astro | rien d'équivalent | tableau de comparaison, type de section réellement nouveau | moyen | `data-reveal` |
| FeatureTabs.astro | proche `services:accordion` | onglets horizontaux, complémentaire | moyen | `data-reveal` (vérifier faisabilité `:checked`/`:target` pour rester zéro-JS) |
| StickyCTA.astro | nouveau pattern `cta` | barre CTA collante au scroll, absent de band/card/phone-giant | petit | `position: sticky`, pas de JS |
| Stats.astro | `data-counter` | chiffres clés animés, cohérent avec notre système existant | petit | `data-counter` |

Doc widgets complète mentionnée dans le repo : `.agents/skills/use-widgets.md` (à consulter avant
portage pour les props exactes).

#### Accessible Astro Starter (github.com/incluud/accessible-astro-starter)
- **Licence** : **MIT**.
- **Stack** : Astro 6.1.1+ + **Tailwind CSS 4.1+** (CSS-first) + SCSS utilitaire, TypeScript. Système de
  couleurs **OKLCH** avec génération automatique de palettes — cohérent avec notre contrainte de tokens.
- **Ce n'est pas une lib de sections marketing** mais une base de patterns transverses (WCAG 2.2 AA +
  European Accessibility Act) :

| Pattern | Pourquoi | Effort |
|---|---|---|
| Skip Links | pattern d'accessibilité à intégrer tel quel dans le layout de base | très faible |
| Gestion `prefers-reduced-motion` | point le plus directement réutilisable — à répliquer dans notre système `data-reveal`/`data-parallax`/etc. si pas déjà géré | faible-moyen |
| Système de tokens OKLCH | référence de méthode pour générer des tokens couleur sans valeurs en dur | conception |
| Formulaires accessibles (Form, Input, Fieldset...) | pertinent pour `contact:form-split/form-card/simple/full` | moyen |

#### Odyssey theme
- Nom ambigu (bruit web : film, épopée). Ressource la plus proche identifiée :
  **treefarmstudio/odyssey-theme** — <https://github.com/treefarmstudio/odyssey-theme> (785★, 219
  forks), démo : <https://odyssey-theme.sapling.supply/>.
- **Licence** : **MIT**.
- **Écart de stack important** : Astro ^4.15.9, mais **pas de Tailwind CSS** — utilise **Lit / Lit-HTML**
  (web components) + CSS custom, ce qui contredit « zéro JS par défaut » et notre système de tokens
  Tailwind. Portage « facile » seulement pour la structure du markup, pas pour le CSS ni
  l'interactivité.
- **Sections repérées** (structure seule, à réécrire intégralement en Tailwind 4) :
  `StickyTextImageSection.astro` (pattern texte+image sticky, idée intéressante pour `about:story`,
  effort moyen-élevé, `data-parallax`), `CustomerQuoteSection.astro` (proche `proof:testimonials`,
  moyen), `ThreeColumnTextSection.astro` (proche `services:grid`, moyen). **Intérêt limité** —
  n'utiliser que pour inspiration de structure/layout.

#### Starwind UI (starwind.dev, github.com/starwind-ui/starwind-ui)
- **Licence** : **MIT**.
- **Nature** : bibliothèque de composants copier-coller façon shadcn/ui, générée dans le projet via
  `npx starwind@latest init`, pas un package figé.
- **Stack** : **Astro + Tailwind CSS v4** — confirmé (« Smooth, polished animations out of the box with
  Tailwind CSS v4 »). Stack identique à la cible.
- **91 composants** — **ce n'est pas une lib de « sections »** mais de composants UI atomiques
  (formulaires, navigation, overlays, feedback, layout, contenu). Utile comme brique sous nos sections :

| Composant | Pourquoi | Effort | Point de vigilance |
|---|---|---|---|
| Accordion | réutilisable pour `faq:accordion`/`services:accordion` | petit | vérifier si JS client requis (« runtime » partagé mentionné) |
| Tabs | future variante `services` en onglets | petit-moyen | idem |
| Carousel | enrichit `proof:gallery`/`before-after` | moyen | idem |
| Dialog / Sheet | overlay pour un futur `nav:burger` | petit | idem |
| Progress / Skeleton | peu pertinent pour un site vitrine statique | — | à écarter |

**Point de vigilance majeur** : Starwind est conçu multi-framework avec un « runtime » JS partagé pour
l'accessibilité — à auditer composant par composant avant adoption, pour respecter « zéro JS par
défaut ».

#### Lunaria (lunaria.dev)
- Outil de gestion de **localisation (i18n)** pour projets open source, agnostique de framework — **pas
  une lib de composants ni un starter de site**. **Hors-sujet pour notre besoin de sections
  marketing** : rien à porter.

---

### D. Annuaires

#### Tailwind Awesome (tailwindawesome.com → redirige vers tailawesome.com)
- **Nature** : répertoire curé d'autres bibliothèques Tailwind (gratuites et payantes), pas une
  bibliothèque en soi. Le domaine a changé récemment (redirection 301 constatée) — à noter si le
  studio le connaissait sous l'ancien nom.
- **Catégorisation** : prix (`?price=free|premium`), type (`?type=template|kit`), 18 filtres
  technologiques dont **Astro**.
- **5 pistes non couvertes par cette veille**, repérées via `?price=free&type=kit` sur
  <https://www.tailawesome.com/?price=free&type=kit> (URLs externes précises non confirmées — slugs
  internes uniquement, à vérifier manuellement avant intégration) :
  - **Oxbow UI** — blocs UI Tailwind + Alpine.js open source.
  - **Flowrift** — blocs UI Tailwind CSS.
  - **Tailwind Stamps** — composants réutilisables open source gratuits.
  - **Bearnie** — « Astro component library starter kit built with Tailwind CSS » — particulièrement
    pertinent, Astro natif comme notre stack.
  - **Lofi UI** — composants Tailwind « low fidelity ».

#### DevDojo Tails (devdojo.com/tails, blocks.devdojo.com)
- **Licence** : gratuit = 1 projet, designs limités ; **Pro** = 15-39 $/mois (projets illimités, tous
  les blocs, API illimitée). Accès au code des blocs gratuits nécessite un compte gratuit.
- **Stack / portabilité** : chaque bloc exporté en **HTML / React / Vue / Svelte / Alpine.js** —
  portable en HTML pur. Pour respecter « animations uniquement via `data-*` », retirer les directives
  Alpine (`x-data`, `x-show`) des exports et réimplémenter l'interactivité via nos propres attributs.
- **Catégories confirmées** — <https://blocks.devdojo.com> : Headers, Heros, Titles/Logos, Content/
  Features, Integrations/Teams, Blog, Forms, CTA, Testimonials, **FAQs, Pricing**, Footers.
- **Sections à porter** — <https://blocks.devdojo.com/free> :

| Section | Pourquoi | Effort | Animation |
|---|---|---|---|
| Centered Tiered Pricing Grid | **comble une lacune totale** : aucun type « pricing » chez nous | moyen | `data-stagger`+`data-reveal` |
| Centered Pricing With CTA | variante pricing+CTA intégré, même lacune | moyen | `data-reveal`, `data-counter` sur les montants |
| Split Feature With Signup | hybride features/cta absent de `services` | petit | `data-reveal` |
| Centered FAQs With Highlighted Headers | design distinct de `faq:accordion/two-columns` | petit | `data-reveal`+`data-split` |
| Centered Testimonials With Case Link | variante `proof` avec lien étude de cas, absente actuellement | petit-moyen | `data-reveal`, `data-marquee` en option |

---

## 2. Résumé de priorisation

**Meilleurs candidats (licence sûre + stack proche + effort raisonnable)** : **AstroWind** (MIT, Astro
7 + Tailwind 4 exact), **HyperUI**, **Meraki UI**, **Mamba UI**, **Tailgrids** (version HTML), **Magic
UI** (effets à porter, MIT). **DevDojo Tails** comble une vraie lacune (pricing). **Accessible Astro
Starter** pour les patterns transverses (a11y, `prefers-reduced-motion`, tokens OKLCH).

**À utiliser avec prudence** : Tailwind UI/Plus, Flowbite Pro, Preline (blocs Pro), Pagedone/Tailgrids
payants (licences correctes pour notre usage mais à revérifier au cas par cas), 21st.dev (licence par
composant), Aceternity UI (licence correcte mais gros effort de portage hors React), Cult UI/Uiverse
(accès bloqué cette session, à revérifier), Starwind UI (auditer chaque composant pour dépendance JS).

**À écarter** : Wicked Blocks/shadcnblocks.com (React pur, à ne redessiner qu'à la main), Astroship
(GPL-3.0, copyleft incompatible avec livraison fermée), Kometa UI Kit et Landwind (introuvables),
Odyssey/treefarmstudio (stack Lit, pas Tailwind), astro.build/themes galerie (marketplace fermée),
Lunaria (hors-sujet).

---

## 3. Matrice : 11 types de section × 10 idées de nouvelles variantes

Chaque ligne indique la source réelle consultée et la différence en une phrase avec ce que nous avons
déjà (`VARIANTS` dans `src/lib/schema.ts`). Ce sont des **idées à instruire**, pas des variantes prêtes
à enregistrer telles quelles — chacune suit la procédure du § 5 avant d'entrer dans `VARIANTS`.

### nav (existant : bar, minimal, split, floating, burger, dock)

| # | Idée | Source | Différence en une ligne |
|---|---|---|---|
| 1 | Mega menu multi-colonnes | Tailgrids Mega Menu — <https://tailgrids.com/blocks> | sous-menu structuré par catégories, absent de nos 6 variantes |
| 2 | Nav sticky qui rétrécit au scroll | Flowbite Navbar — <https://flowbite.com/docs/components/navbar/> | aucune variante actuelle ne gère un état de hauteur réduite |
| 3 | Nav avec recherche intégrée | HyperUI Headers — <https://hyperui.dev/components/marketing/headers> | champ de recherche visible en permanence |
| 4 | Nav deux niveaux (bandeau info + nav) | Tailgrids header blocks — <https://tailgrids.com/blocks> | bandeau horaires/urgence au-dessus de la nav principale |
| 5 | Command launcher (Cmd/Ctrl+K) | Accessible Astro Starter — <https://github.com/incluud/accessible-astro-starter> | recherche/nav au clavier, forte accessibilité |
| 6 | Dock à magnification progressive | Magic UI Dock — <https://magicui.design/docs/components/dock> | notre `dock` existe mais sans l'effet de grossissement au curseur (`data-magnetic`) |
| 7 | Nav avec sélecteur de langue/zone | Flowbite navbar variants — <https://flowbite.com/docs/components/navbar/> | utile aux sites bilingues/zones frontalières |
| 8 | Nav flyout avec aperçu riche par lien | Tailwind UI Plus (catégorie navigation) | menu déroulant façon « aperçu » avec description par entrée |
| 9 | Nav avec numéro de téléphone permanent | Tailgrids header CTA — <https://tailgrids.com/blocks> | notre `phone-giant` existe en cta, pas en nav |
| 10 | Nav minimal logo centré, liens de part et d'autre | HyperUI Headers — <https://hyperui.dev/components/marketing/headers> | ni « bar » classique ni « split » à panneau latéral |

### hero (existant : split, fullbleed, typographic, stacked, marquee, video)

| # | Idée | Source | Différence en une ligne |
|---|---|---|---|
| 1 | Photo en tilt 3D au survol | Aceternity 3D Card Effect — <https://ui.aceternity.com/components/3d-card-effect> | réaction dynamique au mouvement de souris (`data-tilt`) |
| 2 | Halo lumineux qui suit le curseur | Aceternity Spotlight — <https://ui.aceternity.com/components/spotlight> | aucun hero actuel n'a d'effet lumière liée au curseur (`data-spotlight`) |
| 3 | Fond jour/nuit en fondu boucle | Preline Day-to-Night Background — <https://preline.co/blocks/marketing/hero-sections/> | transition de fond animée, absente de `fullbleed` |
| 4 | Perspective 3D pilotée par le scroll | Aceternity Container Scroll Animation — <https://ui.aceternity.com/components/container-scroll-animation> | photo/mockup qui bascule en 3D au scroll, gros effort |
| 5 | Composition bento (photo + stats + logo) | AstroWind Bento widget — <https://github.com/onwidget/astrowind> | grille asymétrique plutôt que deux blocs, hybride avec `services:bento` |
| 6 | Titre qui s'écrit lettre par lettre | Aceternity Typewriter Effect — <https://ui.aceternity.com/components/typewriter-effect> | usage marqué de `data-split` plutôt qu'un simple `data-reveal` |
| 7 | Portrait rond + numéro géant | Tailgrids header blocks — <https://tailgrids.com/blocks> | absent de `portrait` (actuellement en about) |
| 8 | Mockup d'appareil encadrant le visuel | Flowbite Device Mockups — <https://flowbite.com/docs/components/device-mockups/> | aucun cadre décoratif d'appareil actuellement |
| 9 | Grille de logos clients dans le hero | HyperUI marketing sections — <https://hyperui.dev/components/marketing/sections> | preuve sociale dès le hero plutôt que dans `proof` séparé |
| 10 | CTA newsletter/capture centré | HyperUI CTAs — <https://hyperui.dev/components/marketing/ctas> | orienté capture de contact dès le hero |

### services (existant : grid, list, alternating, accordion, cards-hover, bento)

| # | Idée | Source | Différence en une ligne |
|---|---|---|---|
| 1 | Carrousel de services | Starwind Carousel — <https://starwind.dev> | défilement horizontal, absent actuellement |
| 2 | Onglets par service | AstroWind FeatureTabs — <https://github.com/onwidget/astrowind> | un service affiché à la fois plutôt qu'une grille complète |
| 3 | Tableau de comparaison de prestations | AstroWind Comparison — <https://github.com/onwidget/astrowind> | tableau comparatif inexistant dans nos variantes |
| 4 | Cartes à bordure lumineuse tournante | Magic UI Border Beam — <https://magicui.design/docs/components/border-beam> | effet visuel enrichissant `cards-hover` (`data-border-beam`) |
| 5 | Mockup d'appareil par service | Flowbite Device Mockups — <https://flowbite.com/docs/components/device-mockups/> | illustration encadrée façon capture d'écran |
| 6 | Chiffre clé animé par service | daisyUI stat — <https://daisyui.com/components/stat/> | délai/garantie affiché en `data-counter` |
| 7 | Filtre par catégorie de service | Flowbite Gallery filtres — <https://flowbite.com/docs/components/gallery/> | possibilité de filtrer par métier, absent actuellement |
| 8 | Grille dense façon mega menu | Tailgrids Mega Menu réappliqué en page — <https://tailgrids.com/blocks> | densité d'information supérieure à `grid` |
| 9 | Citation client intégrée par carte | Mamba UI Testimonial — <https://mambaui.com/components> | preuve sociale directement associée à chaque service |
| 10 | Liste numérotée grand chiffre | Pagedone process blocks — <https://pagedone.io/blocks> | numérotation façon `process:numbered` appliquée aux services |

### about (existant : portrait, story, values, timeline)

| # | Idée | Source | Différence en une ligne |
|---|---|---|---|
| 1 | Photo en parallax au scroll | technique scroll CSS, inspirée Aceternity — <https://ui.aceternity.com/components/container-scroll-animation> | usage de `data-parallax` (existant, pas utilisé sur about actuellement) |
| 2 | Image sticky + texte qui défile | Odyssey StickyTextImageSection (structure seule) — <https://github.com/treefarmstudio/odyssey-theme> | image fixe pendant que le texte défile à côté |
| 3 | Grille de portraits d'équipe | HyperUI Team Sections — <https://hyperui.dev/components/marketing/team-sections> | plusieurs membres plutôt qu'un portrait unique |
| 4 | Chiffres clés animés | daisyUI stat — <https://daisyui.com/components/stat/> | années d'expérience/chantiers réalisés en `data-counter` |
| 5 | Comparateur avant/après en curseur CSS | daisyUI diff — <https://daisyui.com/components/diff/> | version plus légère (zéro JS) appliquée à l'évolution de l'atelier |
| 6 | Mockup d'appareil pour vidéo atelier | Flowbite Device Mockups — <https://flowbite.com/docs/components/device-mockups/> | cadre décoratif autour d'une courte vidéo |
| 7 | Texte qui se révèle mot par mot | Magic UI Text Reveal — <https://magicui.design/docs/components/text-reveal> | usage marqué de `data-split` plutôt que `data-reveal` seul |
| 8 | Cartes de valeurs à bordure animée | Magic UI Border Beam — <https://magicui.design/docs/components/border-beam> | met en avant chaque valeur au survol |
| 9 | Timeline horizontale/verticale automatique | daisyUI timeline — <https://daisyui.com/components/timeline/> | bascule native par breakpoint, alternative structurelle à `timeline` |
| 10 | Bloc « Split Feature With Signup » | DevDojo Tails — <https://blocks.devdojo.com/free> | combine présentation de l'atelier et capture de contact directe |

### proof (existant : google, testimonials, gallery, before-after, logos, marquee-quotes)

| # | Idée | Source | Différence en une ligne |
|---|---|---|---|
| 1 | Marquee vertical à deux colonnes | Preline Vertical Marquee — <https://preline.co/blocks/marketing/marquee/> | variante verticale de `marquee-quotes` |
| 2 | Marquee 3D en perspective | Preline/Aceternity 3D Marquee — <https://preline.co/blocks/marketing/marquee/> | profondeur 3D sur le défilement des avis |
| 3 | Témoignages avec transition animée | Aceternity Animated Testimonials — <https://ui.aceternity.com/components/animated-testimonials> | transition entre témoignages plutôt qu'une grille statique |
| 4 | Avant/après en curseur CSS pur | daisyUI diff — <https://daisyui.com/components/diff/> | implémentation plus légère de `before-after` existant |
| 5 | Témoignage avec lien étude de cas | DevDojo Tails — <https://blocks.devdojo.com/free> | chaque avis renvoie vers un cas détaillé, absent actuellement |
| 6 | Logos filtrés par secteur | Flowbite Gallery filtres — <https://flowbite.com/docs/components/gallery/> | filtrage des logos clients par métier |
| 7 | Stats clés (avis, notes, chantiers) | HyperUI marketing sections — <https://hyperui.dev/components/marketing/sections> | preuve sociale chiffrée en `data-counter` |
| 8 | Galerie en mockup d'appareil | Flowbite Device Mockups — <https://flowbite.com/docs/components/device-mockups/> | photos présentées dans un cadre d'appareil |
| 9 | Ticker défilant façon bourse | Preline Finance Ticker — <https://preline.co/blocks/marketing/marquee/> | bandeau compact une ligne plutôt qu'une grille de cartes |
| 10 | Témoignage vedette à bordure lumineuse | Magic UI Border Beam — <https://magicui.design/docs/components/border-beam> | met en avant un témoignage avec effet de bordure animée |

### zones (existant : list, map, chips)

| # | Idée | Source | Différence en une ligne |
|---|---|---|---|
| 1 | Grille de villes en cartes cliquables | HyperUI marketing sections — <https://hyperui.dev/components/marketing/sections> | carte par ville plutôt qu'une simple puce |
| 2 | Carte + liste synchronisées au survol | Flowbite Gallery/filtres adapté — <https://flowbite.com/docs/components/gallery/> | interaction liste ↔ carte, absente de `map` actuel |
| 3 | Rayon d'intervention en halo pulsé | technique CSS/SVG, inspirée Aceternity Spotlight — <https://ui.aceternity.com/components/spotlight> | visualisation animée plutôt qu'un tracé statique |
| 4 | Zones en accordéon par secteur | pattern `<details>` natif | regroupement des villes par zone plus large, dépliable |
| 5 | Compteur « +X villes couvertes » | daisyUI stat — <https://daisyui.com/components/stat/> | chiffre clé animé en complément de `list`/`chips` |
| 6 | Chips filtrables par distance | Flowbite Gallery filtres adapté — <https://flowbite.com/docs/components/gallery/> | chips interactifs triés plutôt qu'une liste statique |
| 7 | Mini-carte + adresse en carte flottante | pattern HyperUI footers (bloc adresse) — <https://hyperui.dev/components/marketing/footers> | carte compacte façon aperçu plutôt que plein cadre |
| 8 | Grille bento (ville principale + villes secondaires) | AstroWind Bento — <https://github.com/onwidget/astrowind> | hiérarchisation visuelle des villes couvertes |
| 9 | Liste de villes en bandeau défilant | Preline Marquee — <https://preline.co/blocks/marketing/marquee/> | défilement continu (`data-marquee`) plutôt qu'une liste fixe |
| 10 | Carte interactive tuiles OSM (alternative libre à Google Maps) | pattern générique Leaflet/OpenStreetMap (licence libre) | évite l'iframe Google Maps, cohérent avec une direction sobre en données |

### process (existant : steps, timeline, numbered)

| # | Idée | Source | Différence en une ligne |
|---|---|---|---|
| 1 | Stepper horizontal icône + titre + sous-titre | Flowbite Stepper — <https://flowbite.com/docs/components/stepper/> | hybride plus riche que `numbered` |
| 2 | Timeline structurée bascule auto | daisyUI timeline — <https://daisyui.com/components/timeline/> | bascule horizontal/vertical native par breakpoint |
| 3 | Chiffre animé par étape (délai) | daisyUI stat — <https://daisyui.com/components/stat/> | durée chiffrée en `data-counter` à chaque étape |
| 4 | Étape active à bordure lumineuse | Magic UI Border Beam — <https://magicui.design/docs/components/border-beam> | met en avant l'étape en cours |
| 5 | Texte d'étape qui s'écrit à l'arrivée | Aceternity Text Generate Effect — <https://ui.aceternity.com/components/text-generate-effect> | animation plus marquée que `data-reveal` seul |
| 6 | Étapes en accordéon dépliable | pattern `<details>`, inspiré Pagedone FAQ — <https://pagedone.io/blocks> | étapes repliées par défaut, utile pour un process long |
| 7 | Mockup d'appareil par étape | Flowbite Device Mockups — <https://flowbite.com/docs/components/device-mockups/> | illustration encadrée par étape |
| 8 | Grille bento (étape clé mise en avant) | AstroWind Bento — <https://github.com/onwidget/astrowind> | hiérarchisation visuelle d'une étape critique |
| 9 | Marquee de mots-clés entre étapes | Preline Marquee — <https://preline.co/blocks/marketing/marquee/> | bandeau défilant de mots-clés (matériaux, garanties) |
| 10 | Étapes en 3D au scroll | Aceternity Container Scroll Animation — <https://ui.aceternity.com/components/container-scroll-animation> | effet de profondeur, gros effort, fort impact |

### faq (existant : accordion, two-columns)

| # | Idée | Source | Différence en une ligne |
|---|---|---|---|
| 1 | FAQ groupée par catégorie, en-têtes mis en avant | DevDojo Tails — <https://blocks.devdojo.com/free> | titres de catégorie visuellement distincts |
| 2 | FAQ avec recherche/filtre | pattern générique, inspiré Flowbite Gallery — <https://flowbite.com/docs/components/gallery/> | champ de recherche pour filtrer les questions |
| 3 | FAQ en grille de cartes | Float UI FAQs — <https://floatui.com/components> | cartes cliquables plutôt qu'une liste verticale |
| 4 | Compteur « X questions résolues » | daisyUI stat — <https://daisyui.com/components/stat/> | élément de réassurance chiffré en en-tête |
| 5 | Réponse en fondu+glissement plus travaillé | Magic UI Text Animate — <https://magicui.design/docs/components/text-animate> | transition d'ouverture plus riche qu'un `<details>` natif |
| 6 | Icône par catégorie de question | Float UI FAQs — <https://floatui.com/components> | pictogramme associé au thème (technique/tarif/délai) |
| 7 | Colonne de questions sticky | AstroWind FAQs widget — <https://github.com/onwidget/astrowind> | question fixe pendant que la réponse défile, enrichit `two-columns` |
| 8 | Question active à bordure lumineuse | Magic UI Border Beam — <https://magicui.design/docs/components/border-beam> | met en évidence la question ouverte |
| 9 | Mini-FAQ en bandeau marquee | Preline Marquee — <https://preline.co/blocks/marketing/marquee/> | teaser défilant des questions fréquentes |
| 10 | Présentation façon conversation/messagerie | pattern combiné Flowbite Device Mockups + bulles | question/réponse façon échange de messages |

### cta (existant : band, card, phone-giant)

| # | Idée | Source | Différence en une ligne |
|---|---|---|---|
| 1 | Fond dégradé jour/nuit animé | Preline Day-to-Night Background — <https://preline.co/blocks/marketing/hero-sections/> | fond qui évolue en boucle plutôt que fixe |
| 2 | Bordure lumineuse tournante sur le bouton | Magic UI Border Beam — <https://magicui.design/docs/components/border-beam> | met en avant le bouton principal |
| 3 | CTA newsletter/capture centrée | HyperUI CTAs — <https://hyperui.dev/components/marketing/ctas> | orienté capture d'e-mail plutôt que devis/appel |
| 4 | Bandeau sticky au scroll | AstroWind StickyCTA — <https://github.com/onwidget/astrowind> | apparaît après un certain scroll, absent des 3 variantes actuelles |
| 5 | Urgence chiffrée (créneaux disponibles) | daisyUI stat — <https://daisyui.com/components/stat/> | renforce l'urgence par un chiffre animé |
| 6 | Mockup de téléphone (SMS/appel) | Flowbite Device Mockups — <https://flowbite.com/docs/components/device-mockups/> | illustre visuellement l'action « appeler » |
| 7 | Halo lumineux sur le bouton | Aceternity Spotlight — <https://ui.aceternity.com/components/spotlight> | effet de lumière dynamique (`data-spotlight`) |
| 8 | Grille bento (numéro + horaires + bouton) | AstroWind Bento — <https://github.com/onwidget/astrowind> | composition en cellules plutôt qu'un bandeau uniforme |
| 9 | Marquee de mots d'urgence en fond | Preline Finance Ticker — <https://preline.co/blocks/marketing/marquee/> | texte défilant en fond du bandeau |
| 10 | Dock magnétique de raccourcis (appeler/WhatsApp/devis) | Magic UI Dock — <https://magicui.design/docs/components/dock> | icônes qui grossissent au survol, alternative à un groupe de boutons |

### contact (existant : form-split, form-card, simple, full)

| # | Idée | Source | Différence en une ligne |
|---|---|---|---|
| 1 | Formulaire dans un mockup d'appareil | Flowbite Device Mockups — <https://flowbite.com/docs/components/device-mockups/> | cadre décoratif autour du formulaire |
| 2 | Champs avancés (validation visuelle) | Origin UI inputs — <https://coss.com/ui> (ex-originui.com) | retours de validation zod plus travaillés visuellement |
| 3 | Carte + formulaire synchronisés au survol | Flowbite Gallery adapté — <https://flowbite.com/docs/components/gallery/> | interaction carte/formulaire, enrichit `form-split` |
| 4 | Formulaire en plusieurs étapes | Flowbite Stepper adapté — <https://flowbite.com/docs/components/stepper/> | devis détaillé en étapes plutôt qu'un bloc unique |
| 5 | Halo lumineux sur le bouton d'envoi | Aceternity Spotlight — <https://ui.aceternity.com/components/spotlight> | met en avant l'action d'envoi |
| 6 | Disposition alternative (formulaire+carte+horaires) | Tailgrids Contact — <https://tailgrids.com/blocks> | 7 variantes à comparer à nos 4 actuelles |
| 7 | Réassurance chiffrée (délai de réponse) | daisyUI stat — <https://daisyui.com/components/stat/> | « réponse sous 24h » affiché près du formulaire |
| 8 | Sélection de créneau structurée | Starwind Select/Combobox — <https://starwind.dev> | prise de rendez-vous plutôt qu'un champ texte libre |
| 9 | Contact plein écran avec fond parallax | `data-parallax` existant appliqué à `full` | applique un attribut existant non utilisé sur cette variante |
| 10 | Mini-FAQ intégrée avant le formulaire | DevDojo Tails FAQ block — <https://blocks.devdojo.com/free> | répond aux objections courantes juste avant l'envoi |

### footer (existant : columns, minimal, big-name)

| # | Idée | Source | Différence en une ligne |
|---|---|---|---|
| 1 | Footer plan du site (4 colonnes + réseaux) | Flowbite Footer — <https://flowbite.com/docs/components/footer/> | structure plus riche que `columns` |
| 2 | Footer avec newsletter intégrée | HyperUI Footers — <https://hyperui.dev/components/marketing/footers> | capture d'e-mail directement en pied de page |
| 3 | Footer avec mini-carte + adresse | HyperUI Footers — <https://hyperui.dev/components/marketing/footers> | aperçu de localisation dans le footer |
| 4 | Nom géant qui se révèle au scroll | Aceternity Text Generate Effect appliqué au nom — <https://ui.aceternity.com/components/text-generate-effect> | enrichit `big-name` avec apparition progressive (`data-split`) |
| 5 | Marquee de certifications/labels | Preline Marquee — <https://preline.co/blocks/marketing/marquee/> | bandeau défilant de logos (RGE, Qualibat...) |
| 6 | Footer minimal avec sélecteur de langue | Flowbite footer variants — <https://flowbite.com/docs/components/footer/> | enrichit `minimal` pour sites bilingues |
| 7 | Horaires avec statut ouvert/fermé en direct | pattern générique, indicateur type daisyUI stat — <https://daisyui.com/components/stat/> | statut dynamique plutôt qu'une simple liste |
| 8 | Grille bento (colonnes de tailles inégales) | AstroWind Footer widget — <https://github.com/onwidget/astrowind> | hiérarchisation visuelle plutôt que colonnes égales |
| 9 | Aperçu réseaux sociaux en mockup | Flowbite Device Mockups — <https://flowbite.com/docs/components/device-mockups/> | aperçu visuel plutôt que simples icônes |
| 10 | CTA téléphone géant intégré au footer | Tailgrids footer blocks — <https://tailgrids.com/blocks> | fusionne footer et `cta:phone-giant` pour les one-pagers |

---

## 4. Rappel juridique

Recherche menée par un agent dédié — synthèse prudente, **ceci n'est pas un avis juridique** ; à faire
confirmer par un juriste pour tout cas limite.

### Ce que « MIT » autorise pour un site client
La licence MIT (HyperUI, Meraki UI, Tailblocks, Mamba UI, Tailgrids Essentials, Magic UI, shadcn/ui,
Origin UI, AstroWind, Accessible Astro Starter, Starwind UI, daisyUI, Uiverse-galaxy...) autorise
l'usage, la copie, la modification, la distribution et la vente de copies, y compris dans un site livré
à un client final facturé par le studio. **La seule obligation est de conserver la mention de
copyright/licence dans le code source** — pas d'obligation d'affichage visible sur le site public livré
au client. Attention : les licences **GPL** (Astroship gratuit, `cruip/open-react-template`) sont
**copyleft** — toute distribution d'une œuvre dérivée doit rester sous la même licence avec code source
accessible, ce qui est en tension directe avec la livraison d'un site client propriétaire fermé. À
écarter pour du code réellement copié ; seule l'inspiration de composition reste possible (voir
principe ci-dessous).

### Ce que les licences Webflow / Framer / Figma interdisent
- **Webflow Cloneables** : chaque template a son propre « Marketplace Creator Agreement » distinct des
  CGU générales (<https://webflow.com/legal/terms>, section 3.1) — pas de règle unique, à lire au cas
  par cas au moment du clone. Les CGU générales interdisent la sous-licence/revente de l'accès à la
  plateforme (section 4.3) et la copie/reproduction/republication de la propriété intellectuelle
  Webflow (section 6.1).
- **Framer Templates** (<https://www.framer.com/legal/community-terms/>) : contenu **gratuit** — usage
  et modification en projets commerciaux autorisés (7.3.1), mais **interdit** de revendre/redistribuer/
  republier l'asset lui-même en tant que tel, ou de créer un produit concurrent du marketplace Framer.
  Contenu **payant** (« Licensed Content », 7.3.2) — usage limité à **un seul projet** (« Permitted
  Project ») ; livrer le même template payant à plusieurs clients sans licences multiples sort du
  cadre autorisé ; revente/redistribution et création de gabarits concurrents interdites.
- **Figma Community** (<https://help.figma.com/hc/en-us/articles/360042296374-Figma-Community-copyright-and-licensing>) :
  fichiers **gratuits** sous **CC BY 4.0** — copie, redistribution, transformation et usage commercial
  autorisés, **attribution au créateur d'origine requise**. Fichiers **payants** — partage limité à 5
  éditeurs, revente interdite, et **le livrable final doit être « significativement différent »** du
  fichier original (<https://www.figma.com/legal/community-terms/>).

### Codrops et CodePen
- **Codrops** (<https://tympanus.net/codrops/licensing/>) : code des démos téléchargeables en **MIT par
  défaut** sauf mention contraire sur une démo précise — usage commercial explicitement autorisé,
  vérifier la licence individuelle du repo GitHub associé pour les démos anciennes/sponsorisées.
  Design freebies : usage personnel/commercial ok, mais interdiction de redistribuer/revendre l'élément
  lui-même. Contenu éditorial : citation ok, republication intégrale interdite.
- **CodePen — idée reçue à corriger** : **il n'existe pas de licence MIT « par défaut »** appliquée
  automatiquement à chaque Pen. CodePen déclare seulement que « la plupart des créations sont publiques
  et open source » (<https://codepen.io/about>), une formulation volontairement vague. La licence est
  un champ **configurable par l'auteur** dans les réglages du Pen (MIT est une option parmi d'autres :
  GPL, Apache, Unlicense...), et peut être absente. **En l'absence de licence explicite, ne pas
  présumer qu'un Pen est libre d'usage commercial** — vérifier manuellement l'onglet Settings > Info >
  License de chaque Pen avant réutilisation.

### GitHub — exemples vérifiés
`onwidget/astrowind` (MIT), `StartBootstrap/startbootstrap-agency` (MIT),
`tailwindtoolbox/Landing-Page` (MIT), `themesberg/landwind` (MIT, ~1k★, à ne pas confondre avec le
« Landwind » composants introuvable) — sûrs pour du code copié ou fortement dérivé. À l'inverse,
`cruip/open-react-template` (GPLv3) illustre un repo où seule l'inspiration visuelle doit être retenue.

### Comment créditer quand c'est nécessaire
- **CC BY (Figma Community gratuit)** : mentionner le nom du créateur d'origine et un lien vers le
  fichier source — une ligne dans la documentation interne du site suffit, pas nécessairement visible
  sur le site public sauf si la licence spécifique l'exige.
- **Preline « Fair Use License »** : attribution (« Preline UI » + lien) exigée seulement pour les
  œuvres dérivées de type outil réutilisable (thème/kit), pas nécessairement pour un simple usage sur
  un site client — zone à trancher au cas par cas selon le texte exact au moment de l'usage.
- **MIT** : la mention de copyright reste dans le code source (commentaire ou fichier LICENCE interne
  du studio), pas d'affichage public obligatoire.
- **21st.dev (redistribution hors plateforme)** : lien visible vers la page d'origine du composant
  exigé si le composant est republié tel quel ailleurs.

### Principe juridique transversal : « copier du code » vs « s'inspirer d'une composition »
Le droit d'auteur protège une œuvre dans sa **forme concrète d'expression** (le code, les textes, les
images) — c'est ce que couvrent les licences ci-dessus. Les **idées et principes de mise en page**
(grille 3 colonnes, hero pleine largeur avec CTA centré, header sticky, reveal au scroll) relèvent en
principe du fonds commun, « de libre parcours » (théorie de la dichotomie idée/expression ; en droit
français, art. L112-1 du Code de la propriété intellectuelle et jurisprudence constante). **Un studio
peut légalement observer une composition en ligne, en tirer des principes de mise en page, et les
recoder entièrement à la main avec son propre balisage/CSS**, même si le site source est protégé —
c'est exactement ce que fait notre contrainte technique (pas de React, tokens propres, recréation à la
main via `data-*`), qui constitue en soi une bonne pratique de réduction de risque.

**Limites** : si la composition est reproduite avec une fidélité telle qu'elle constitue une copie
quasi identique de l'expression visuelle (mêmes proportions exactes, même typographie propriétaire,
mêmes textes, mêmes images), le risque de contrefaçon redevient réel — la sécurité juridique croît avec
la distance créative prise (c'est la logique de la clause Figma « output significativement différent »).
Le **trade dress**/l'apparence commerciale distinctive d'une marque très identifiable peut aussi relever
de la concurrence déloyale/parasitisme même sans copie de code — risque faible pour des templates
génériques, réel pour une source de marque reconnaissable. Enfin, **jamais** reprendre des marques/logos
visibles dans une source d'inspiration dans un livrable client.

---

## 5. Procédure de portage (compatible `/nouvelle-variante`)

Cette procédure s'insère **avant** l'étape 1 de `.claude/skills/nouvelle-variante/SKILL.md` et
alimente ses étapes existantes ; elle ne les remplace pas.

1. **Vérifier la licence à la source, maintenant, pas seulement dans ce document.** Les prix,
   catalogues et textes de licence évoluent (ex. Tailwind UI a changé de nom en Tailwind Plus pendant
   cette veille, Origin UI a redirigé vers coss.com/ui, Wicked Blocks a disparu). Ouvrir la page de
   licence de la source au moment du portage.
2. **Décider : code copiable ou composition à redessiner ?**
   - Licence MIT/CC BY/permissive et stack HTML+Tailwind (ou Astro+Tailwind) → le HTML/CSS peut servir
     de brouillon de départ, à retokeniser immédiatement (tokens `bg-bg`/`text-fg`/`bg-accent`... à la
     place des couleurs/classes en dur de la source).
   - Licence GPL/copyleft, plateforme à licence restrictive (Webflow/Framer/Figma payant), ou stack
     React/Vue/Lit → **ne jamais copier le code** : n'observer que la composition visuelle (rythme,
     hiérarchie, proportions) et réécrire entièrement à la main en Astro/Tailwind. C'est aussi ce
     qu'exige notre contrainte « pas de React ».
3. **Vérifier qu'aucune variante existante ne couvre déjà le besoin** dans `VARIANTS`
   (`src/lib/schema.ts`) — cf. § 2 de `SKILL.md`.
4. **Lire `docs/CONVENTIONS.md` et deux variantes existantes du même type** dans `src/sections/<Type>/`
   pour reprendre la structure (frontmatter, id, tokens, `data-reveal`) — étape 1 de `SKILL.md`.
5. **Choisir un nom kebab-case explicite** et vérifier qu'il n'existe pas déjà — étape 2 de `SKILL.md`.
6. **Écrire `src/sections/<Type>/<nom>.astro`** en respectant toutes les règles de `docs/CONVENTIONS.md`
   (tokens uniquement, `import { site } from '@/lib/site'` sans props, aucune donnée inventée, français,
   mobile d'abord, `data-*` pour l'animation) — étape 3 de `SKILL.md`. **Ne jamais coller les valeurs
   de couleur/police/rayon de la source** : toujours passer par les tokens de `global.css`.
7. **Si l'effet nécessite un nouvel attribut d'animation** (ex. `data-spotlight` pour un halo qui suit
   le curseur, `data-border-beam` pour une bordure lumineuse tournante — voir § 1.B) :
   - documenter l'attribut en tête de `src/scripts/motion.ts` et dans `global.css`, sur le modèle des
     8 attributs existants, **avant** de l'utiliser dans une variante ;
   - vérifier qu'aucun des 8 attributs existants ne couvre déjà le besoin (ex. un simple halo qui suit
     le curseur pourrait parfois se satisfaire de `data-magnetic` selon l'intensité voulue).
8. **Ajouter le nom dans `VARIANTS.<type>`** (`src/lib/schema.ts`) — étape 4 de `SKILL.md`.
9. **Ajouter une ligne dans `docs/DIRECTIONS.md`** (variante + quand l'utiliser) — étape 5.
10. **Vérifier** : copier `sites/_exemple` en `sites/_test-variante`, appliquer la variante dans le
    layout, `node scripts/ff.mjs build _test-variante` puis `node scripts/ff.mjs captures
    _test-variante`, comparer les captures desktop/mobile, tester avec une direction sombre (`luxe` ou
    `neon`) — étape 6. Supprimer la copie ensuite.
11. **`npm test` doit rester vert** — étape 7.
12. **Ajouter aux `presets/` si la variante mérite d'être proposée d'office**, régénérer les vignettes —
    étape 8.
13. **Documenter la source dans le commit** (nom de la collection, URL, licence, date de consultation —
    en plus du résumé attendu par `SKILL.md`), pour la traçabilité interne recommandée par le § 4 : « ce
    que la variante apporte que les autres n'ont pas » **et** « d'où vient l'inspiration, sous quelle
    licence ».
14. **Ne jamais committer d'assets de la source** (images, icônes, textes protégés) — recréer la
    structure uniquement, avec le contenu propre du client.

---

## 6. Sources

### A. Bibliothèques Tailwind CSS
- Tailwind UI/Plus : <https://tailwindcss.com/plus/license>, <https://www.licenseorg.com/guide/code/tailwind-ui>
- HyperUI : <https://github.com/markmead/hyperui/blob/main/LICENSE>, <https://hyperui.dev/components/marketing/ctas>, </sections>, </footers>, </team-sections>, </testimonials>, </headers>
- Flowbite : <https://flowbite.com/docs/getting-started/license/>, <https://flowbite.com/license/>, <https://flowbite.com/docs/components/device-mockups/>, </stepper/>, </gallery/>, </footer/>, </navbar/>
- Preline UI : <https://preline.co/docs/license.html>, <https://preline.co/blocks/marketing/marquee/>, </hero-sections/>, <https://preline.co/examples.html>
- daisyUI : <https://github.com/saadeghi/daisyui/blob/master/LICENSE>, <https://daisyui.com/components/diff/>, </stat/>, </timeline/>
- Meraki UI : <https://github.com/merakiuilabs/merakiui/blob/master/LICENSE>, <https://merakiui.com/components/marketing>
- Tailblocks : <https://github.com/mertJF/tailblocks>, <https://tailblocks.cc/>
- Float UI : <https://floatui.com/license>, <https://github.com/MarsX-dev/floatui>, <https://floatui.com/components>
- Sailboat UI : <https://github.com/sailboatui/sailboatui>, <https://sailboatui.com/>
- Wicked Blocks / shadcnblocks.com : <https://www.shadcnblocks.com>
- Mamba UI : <https://github.com/Microwawe/mamba-ui>, <https://mambaui.com/components>
- Pagedone : <https://pagedone.io/license>, <https://pagedone.io/blocks>
- Tailgrids : <https://tailgrids.com/license>, <https://tailgrids.com/pricing>, <https://tailgrids.com/blocks>
- Landwind (introuvable), themesberg/landwind (alternative trouvée) : <https://github.com/themesberg/landwind>

### B. Bibliothèques React/animées
- Aceternity UI : <https://ui.aceternity.com/licence>, </pricing>, </components/3d-card-effect>, </text-generate-effect>, </typewriter-effect>, </spotlight>, </infinite-moving-cards>, </3d-marquee>, </container-scroll-animation>, </macbook-scroll>, </animated-testimonials>
- Magic UI : <https://github.com/magicuidesign/magicui/blob/main/LICENSE.md>, <https://magicui.design/docs/components/marquee>, </number-ticker>, </text-animate>, </text-reveal>, </border-beam>, </dock>
- Cult UI : <https://github.com/nolly-studio/cult-ui>, <https://cult-ui.com> (accès rate-limité)
- Uiverse : <https://github.com/uiverse-io/galaxy>, <https://uiverse.io> (accès 403 cette session)
- shadcn/ui : <https://github.com/shadcn-ui/ui/blob/main/LICENSE.md>, <https://ui.shadcn.com/blocks>
- Origin UI : <https://github.com/origin-space/originui>, <https://coss.com/ui>
- 21st.dev : <https://21st.dev/pricing>, <https://21st.dev/terms>, <https://21st.dev/s/hero>
- Once UI : <https://once-ui.com>

### C. Projets Astro natifs
- astro.build/themes : <https://astro.build/themes/>
- Astroship : <https://github.com/surjithctly/astroship>, </blob/main/LICENSE>
- AstroWind : <https://github.com/onwidget/astrowind>, <https://raw.githubusercontent.com/onwidget/astrowind/main/LICENSE.md>, </tree/main/src/components/widgets>
- Accessible Astro Starter : <https://github.com/incluud/accessible-astro-starter>
- Odyssey (treefarmstudio) : <https://github.com/treefarmstudio/odyssey-theme>, <https://odyssey-theme.sapling.supply/>
- Starwind UI : <https://starwind.dev>, <https://github.com/starwind-ui/starwind-ui>
- Lunaria : <https://lunaria.dev>, <https://github.com/yassinedoghri/lunaria>

### D. Annuaires
- Tailwind Awesome : <https://www.tailawesome.com/>, </?price=free&type=kit>
- DevDojo Tails : <https://devdojo.com/tails>, <https://tails.devdojo.com>, <https://blocks.devdojo.com>, </free>, <https://devdojo.com/pricing>

### E. Plateformes et licences (rappel juridique)
- Webflow : <https://webflow.com/legal/terms>
- Framer : <https://www.framer.com/legal/terms-of-service/>, <https://www.framer.com/legal/community-terms/>
- Figma : <https://help.figma.com/hc/en-us/articles/360042296374-Figma-Community-copyright-and-licensing>, <https://www.figma.com/legal/community-terms/>, <https://www.figma.com/legal/creator-agreement/>
- Codrops : <https://tympanus.net/codrops/licensing/>
- CodePen : <https://codepen.io/about>
- GitHub : <https://github.com/onwidget/astrowind>, <https://github.com/cruip/open-react-template>, <https://github.com/StartBootstrap/startbootstrap-agency>, <https://github.com/tailwindtoolbox/Landing-Page>, <https://github.com/themesberg/landwind>, <https://github.com/topics/landing-page?l=html>

### Fichiers internes consultés
- `C:\Users\nadja\ff-atelier\docs\CONVENTIONS.md`
- `C:\Users\nadja\ff-atelier\src\lib\schema.ts` (`VARIANTS`, `DIRECTIONS`)
- `C:\Users\nadja\ff-atelier\.claude\skills\nouvelle-variante\SKILL.md`

---

*Limites méthodologiques signalées par les agents de recherche : le quota WebSearch de la session
était épuisé avant plusieurs recherches, menées alors via WebFetch direct (pages officielles, GitHub,
proxy de lecture) — précision légèrement réduite sur certains catalogues dynamiques (Tailwind Plus
derrière mur de connexion, Cult UI et Uiverse rate-limités/bloqués, pages `/blocks` de Flowbite non
rendues en fetch statique). Ces points sont signalés section par section ci-dessus ; aucune URL n'a été
inventée — celles non vérifiées par fetch direct sont explicitement marquées comme telles.*
