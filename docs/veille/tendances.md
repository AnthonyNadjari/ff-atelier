# Veille design 2025-2026 — tendances web pour l'atelier

Document de référence pour enrichir le vocabulaire des designers de Finck & Fisch : où regarder chaque
semaine, ce qui se fait de mieux sur le web en 2025-2026, comment le traduire en tokens/variantes pour
notre bibliothèque (`src/sections/`, `src/directions/`), et comment le nourrir avec le moteur d'animation
existant (`src/scripts/motion.ts`, `src/styles/global.css`) plutôt que d'en réinventer un.

Rappel du vocabulaire du moteur d'animation déjà en place, utilisé tout au long de ce document :
`data-reveal` / `data-reveal-delay` / `data-stagger` (apparition au scroll), `data-parallax`,
`data-counter` (compteurs), `data-draw` (trait SVG qui se trace), `data-scrub` (animation liée à la
position de scroll), `data-pin` (section épinglée), `data-horizontal` (défilement horizontal épinglé),
`data-text-fill` (texte qui se colore progressivement), `data-hover-img` (image flottante au survol),
`data-magnetic` (bouton magnétique), `.ff-curtain` (rideau d'entrée), `marquee` natif, trois niveaux de
`data-motion` : `none` / `subtle` / `rich`. Nos 16 directions actuelles (`docs/DIRECTIONS.md`) : atelier,
brut, luxe, journal, neon, clair, terre, signal, nuit, pop, pierre, retro, nordique, encre, industriel,
mediterranee.

Recherche effectuée en septembre 2026 (35+ requêtes web, sources citées à chaque section et regroupées en
§6). Certaines URL de recherches marketing/SEO (ex. "X web design trends 2026") sont citées comme sources
de définitions de tendance, pas comme galeries à suivre — la distinction est faite en §1 vs le reste.

---

## 1. Où regarder chaque semaine

| Site | URL | Idéal pour | API / RSS |
|---|---|---|---|
| **Awwwards** | [awwwards.com](https://www.awwwards.com/) | Sites primés très haut de gamme (Site of the Day), tendances motion et 3D les plus poussées, collections thématiques (ex. [dark mode](https://www.awwwards.com/awwwards/collections/dark-mode/), [marquee](https://www.awwwards.com/awwwards_collections/collections/text-marquee-effect/)) — référence n°1 pour voir « ce qui se fait de mieux » mais souvent trop riche en motion pour un artisan | RSS officiel ([awwwards.com/feed/](https://www.awwwards.com/feed/)) ; pas d'API publique officielle, scrapers tiers existent (ex. [Apify Awwwards Scraper](https://apify.com/solidcode/awwwards-scraper)) |
| **Godly** | [godly.website](https://godly.website/) / [godly.design](https://godly.design/) | Curation typographie-first (pas des captures Dribbble hors contexte), agences et portfolios, bon pour la mise en page et le motion | Pas d'API publique connue ; newsletter |
| **Land-book** | [land-book.com](https://land-book.com/) | Landing pages catégorisées par industrie (SaaS, agence, e-commerce...), utile pour la structure de page plutôt que le style | Pas d'API publique ; mise à jour quasi quotidienne |
| **Siteinspire** | [siteinspire.com](https://www.siteinspire.com/) | Sensibilité européenne, éditoriale, typographiquement soignée ; +8000 sites tagués par style/type/sujet, actif depuis 2010, aucune entrée sponsorisée | Pas d'API publique ; lettre hebdomadaire |
| **Minimal Gallery** | [minimal.gallery](https://minimal.gallery/) | Minimalisme pur, bon réservoir pour les directions clair/pierre/nordique, actif depuis 2013 | Pas d'API publique |
| **Lapa Ninja** | [lapa.ninja](https://www.lapa.ninja/) | +7300 landing pages avec captures vidéo réelles (pas juste des screenshots figés), filtrage par année/catégorie/couleur — très utile pour voir le motion en situation | Pas d'API publique |
| **Dark Mode Design** | [darkmodedesign.com](https://www.darkmodedesign.com/) | Uniquement du dark mode — réservoir direct pour les directions luxe, neon, nuit, encre | Pas d'API publique |
| **One Page Love** | [onepagelove.com](https://onepagelove.com/) | Sites une page ; **+9000 sites ET +8600 sections indexées séparément** ([onepagelove.com/inspiration](https://onepagelove.com/inspiration)) — la ressource la plus directement utile pour enrichir un catalogue de sections comme le nôtre | Pas d'API publique ; newsletter |
| **httpster** | [httpster.net](https://httpster.net/) | Petite galerie indépendante triée par style (minimal, illustratif, interactif) — bon complément rapide | Pas d'API publique |
| **Refero** | [refero.design](https://refero.design/) | Grande bibliothèque de captures UI/UX réelles taguées par type de page, pattern UX et élément UI ; « Refero Styles » ([styles.refero.design](https://styles.refero.design/)) extrait des design systems en DESIGN.md pour agents IA | **MCP dédié** ([refero.design/mcp](https://refero.design/mcp)) ; pas d'API REST classique |
| **Mobbin** | [mobbin.com](https://mobbin.com/) | +400 000 captures d'apps mobiles/web réelles, flux complets avec micro-interactions — utile pour des patterns UI concrets (onboarding, profils, formulaires) plus que pour du style de site vitrine | Pas d'API publique gratuite (offre Pro payante) |
| **Screenlane** (ex-UI Movement) | [screenlane.com](https://www.screenlane.com/) | Captures réelles groupées par pattern précis (pricing, onboarding, empty state...) | Pas d'API publique |
| **Curated (Curated.design)** | [curated.design](https://curated.design/) | Sites réels revus un par un, filtrables par style/industrie, catégories dark/minimal/brutalist | Abonnement payant ; pas d'API |
| **Klart** | [klart.design](https://www.klart.design/) | Galerie généraliste, complément parmi d'autres — informations publiques limitées sur le site lui-même | Pas d'API confirmée |
| **Footer.design** | [footer.design](https://www.footer.design/) | **Le** catalogue dédié aux pieds de page — 11 styles : typographic, small type, illustrative, grid, flat, animated, cards, bright, dark, large type, bold | Pas d'API publique |
| **Nav.gallery / Navbar Gallery** | [navbar.gallery](https://www.navbar.gallery/) | **Le** catalogue dédié aux navigations — 8 types : static/sticky, dropdown/flyout, mega menu, sidebar, search bar, announcement bar, full screen, breadcrumbs, filtrable par style et par plateforme (Webflow, Framer...) | Pas d'API publique |
| **Hero Gallery** | [hero.gallery](https://hero.gallery/) | **Le** catalogue dédié aux hero sections — classé par approche visuelle (vidéo, photo, 3D, illustration, typo, abstrait), layout (split, centré, plein cadre, inset) et structure de CTA | Pas d'API publique ; mise à jour hebdomadaire |
| **Dribbble** (tags) | [dribbble.com/tags/2026-design-trends](https://dribbble.com/tags/2026-design-trends) | Direction artistique rapide, palettes, moodboards ; ce sont des *shots* isolés, pas des sites entiers — à utiliser pour la couleur/texture, pas pour la structure | API officielle (OAuth, accès développeur limité) |
| **Behance** | [behance.net](https://www.behance.net/) | Études de cas complètes (process, système de marque de bout en bout) — utile pour voir la cohérence d'une identité, moins pour des patterns d'interaction | API Adobe/Behance pour développeurs |
| **Are.na** | [are.na](https://www.are.na/) | Recherche visuelle libre en « channels » constitués à la main, sans algorithme — le meilleur outil pour construire un moodboard de matière/couleur/ambiance pour une direction, loin du bruit des galeries commerciales | API REST publique documentée ([are.na/about](https://www.are.na/about)) |

**Usage recommandé pour l'atelier** : Footer.design, Navbar Gallery et Hero Gallery en premier (ils
correspondent exactement à nos unités de section) ; One Page Love pour la richesse de sections indexées ;
Awwwards et Godly pour le motion state-of-the-art à simplifier ; Are.na pour les moodboards de matière par
direction ; Siteinspire et Minimal Gallery pour les directions sobres (clair, pierre, nordique, journal).

---

## 2. Tendances 2025-2026

Pour chaque tendance : définition, 2-3 références, puis verdict pour les métiers locaux (plombier,
salon, restaurant, avocat, garage, etc.) en s'appuyant sur nos 16 directions.

### Bento grids
Grille modulaire en cellules de tailles inégales façon boîte bento japonaise, popularisée par Apple et
généralisée par des produits comme Linear ; en 2026 la « bento grid statique » évolue vers la « active
grid » où les cellules réagissent au survol (vidéo qui se lance, données qui se révèlent).
Réf. : [studiomeyer.io — Bento Grid Layouts 2026](https://studiomeyer.io/en/blog/bento-grid-layouts),
[designmupi.com — Bento Grids 2026](https://designmupi.com/bento-grid-website-ui-design-trend-of-2026/),
[mockuuups.studio — Bento Grid examples](https://mockuuups.studio/blog/post/best-bento-grid-design-examples/).
**Verdict métiers** : très bon pour regrouper note Google + services + zone en un coup d'œil (directions
clair, brut) ; moins pertinent pour un artisan qui n'a qu'une poignée de données réelles à montrer — ne
pas remplir de cellules vides avec du texte inventé (règle dure de l'atelier).

### Brutalisme / néo-brutalisme
Esthétique frontale héritée du brutalisme architectural : bordures épaisses, ombres portées dures,
couleurs saturées, angles droits, refus du raffinement. Le néo-brutalisme 2026 y ajoute de la couleur et
de la lisibilité fonctionnelle plutôt que le noir/blanc pur des origines.
Réf. : [pixso.net — Neo-Brutalism 2026](https://pixso.net/articles/neo-brutalism-design/),
[retroui.dev — 12 Neobrutalist Websites 2026](https://retroui.dev/blogs/12-neobrutalist-websites-you-should-know-in-2026),
[downgraf.com — 20 Neobrutalism examples](https://www.downgraf.com/inspiration/20-neobrutalism-web-design-examples-that-break-all-the-rules/).
**Verdict métiers** : correspond déjà à notre direction `brut` (architecte, studio de skate, agence,
tatoueur, streetwear) ; à proscrire pour les métiers qui doivent rassurer (avocat, notaire, dentiste,
funéraire).

### Typographie cinétique
Le texte comme élément animé : variation de graisse, étirement, réaction au survol/scroll, activée par
les polices variables et l'API CSS Scroll-Driven Animations. La forme la plus répandue : révélation mot
par mot au scroll (utilisée par Apple sur ses pages produit).
Réf. : [studiomeyer.io — Kinetische Typografie 2026](https://studiomeyer.io/en/blog/kinetische-typografie),
[itamde.com — Kinetic typography](https://itamde.com/en/kinetic-typography-is-the-web-design-trend-you-cant-ignore/),
[elements.envato.com — Web design trends 2026](https://elements.envato.com/learn/web-design-trends).
**Verdict métiers** : excellent pour un manifeste ou une accroche forte (avocat, architecte, agence) via
`data-text-fill`/`data-scrub` ; à garder sobre (mode `subtle`) pour les directions signal/urgence où la
lisibilité prime sur l'effet.

### Scroll-driven storytelling (scrollytelling)
Le scroll comme mécanisme narratif : texte, image et motion se révèlent progressivement pour raconter une
histoire pas à pas plutôt que tout montrer d'un coup. En 2026 c'est devenu un standard attendu plus qu'un
avantage compétitif, avec `view-timeline` CSS natif qui remplace le JS pour les cas simples.
Réf. : [scrollytelling.ai — 27 exemples 2026](https://scrollytelling.ai/examples/),
[metabole.studio — Guide scrollytelling](https://metabole.studio/en/blog/scrollytelling),
[maglr.com — Best scrollytelling examples](https://www.maglr.com/blog/best-scrollytelling-examples).
**Verdict métiers** : très bien pour raconter l'histoire d'un artisan (about/story) ou un processus de
rénovation avant/après ; à éviter pour un besoin urgent (plombier 24/7) où l'utilisateur veut le numéro
tout de suite, pas une histoire.

### Scènes épinglées (sticky/pinned)
Une section reste fixe à l'écran pendant que son contenu interne change au fil du scroll (photo qui zoome,
étapes qui s'enchaînent) — le moteur derrière la plupart des scrollytelling. Techniquement porté par
`ScrollTrigger` (GSAP) ou notre `data-pin`/`data-scrub` natifs.
Réf. : [annnimate.com — GSAP pinning](https://annnimate.com/learn/scroll/pinning),
[gsap.com — forum sticky section](https://gsap.com/community/forums/topic/38199-gsap-sticky-section-on-scroll-change-image-according-to-active-content-using-scrolltrigger/),
[freefrontend.com — 60+ ScrollTrigger examples](https://freefrontend.com/scroll-trigger-js/).
**Verdict métiers** : puissant pour un process en 3-4 étapes (devis → intervention → suivi) ou une
timeline d'histoire ; à réserver aux directions `rich` (neon, luxe, pop) et éviter sur signal (priorité à
la vitesse de lecture, pas à la mise en scène).

### Défilement horizontal
Le contenu défile latéralement au lieu de verticalement, souvent combiné à un pin vertical (`data-pin` +
`data-horizontal`). Casse la monotonie du scroll vertical pour une galerie ou une frise.
Réf. : [htmlburger.com — 18 Best Scrolling Websites 2025/2026](https://htmlburger.com/blog/best-scrolling-websites/),
[mockplus.com — Horizontal Scroll examples](https://www.mockplus.com/blog/post/horizontal-scroll-web-design-examples),
[awwwards — Horizontal scrolling timeline](https://www.awwwards.com/inspiration/horizontal-scrolling-timeline-de-ruien).
**Verdict métiers** : très bon pour une galerie de réalisations (menuisier, paysagiste, ébéniste) ou une
frise d'étapes ; à utiliser avec parcimonie sur mobile (le motion 2026 est mobile-first, éviter le
horizontal-only sur petit écran).

### Grain et texture de bruit
Superposition d'un bruit granuleux (filtre SVG `feTurbulence`, 15-30 % d'opacité) sur un aplat pour casser
la perfection numérique et évoquer le papier, le film, la matière — signal d'authenticité « faite main »
en réaction à l'esthétique lisse générée par IA.
Réf. : [kittl.com — Grainy Blur Design 2026](https://www.kittl.com/blogs/grainy-blur-effect-stl/),
[studio2am.co — Naive, grainy, anti-AI aesthetics](https://studio2am.co/blogs/news/naive-grainy-and-blurred-on-purpose-2026s-pushback-against-ai-smooth-design),
[ultimatedesigntools.com — CSS Noise Textures](https://ultimatedesigntools.com/blog/css-noise-textures-guide/).
**Verdict métiers** : excellent pour atelier, encre, terre, nuit (matière chaude, papier, artisanat) ;
inutile voire contradictoire sur clair/signal qui misent sur la netteté digitale.

### Typographie surdimensionnée
Des titres qui occupent une part disproportionnée de l'écran, contrastés avec du texte minuscule pour la
lisibilité secondaire — réponse à des audiences pressées, exposées à un flux visuel saturé.
Réf. : [wix.com — 11 Biggest Web Design Trends 2026](https://www.wix.com/blog/web-design-trends),
[madegooddesigns.com — Font Trends 2026](https://madegooddesigns.com/font-trends-2026/),
[andacademy.com — Typography Trends 2026](https://www.andacademy.com/resources/blog/graphic-design/typography-trends/).
**Verdict métiers** : quasi universel pour un hero (déjà notre variante `hero: typographic`) — utile
partout, du signal (numéro géant) au journal (titre éditorial), à condition de garder une seule idée par
écran.

### Mise en page éditoriale
Grilles asymétriques, hiérarchie typographique marquée (dissonance d'échelle entre corps de texte et
display), grands espaces blancs structurants — retour d'une « confiance éditoriale » proche de la presse
imprimée plutôt que du blog vertical classique.
Réf. : [welovedaily.net — Editorial Design 2026, 30 magazine layouts](https://welovedaily.net/rankings/editorial-design-2026-30-magazine-layouts),
[speckyboy.com — 14 Magazine Layouts](https://speckyboy.com/modern-magazine-web-layouts/),
[fliplink.me — Magazine Layouts 2026](https://fliplink.me/blog/magazine-layouts).
**Verdict métiers** : notre direction `journal` en plein dedans (avocat, notaire, consultant, éditeur) ;
peu adapté aux métiers d'urgence ou très visuels (garage, food truck) qui ont besoin de moins de texte.

### Glassmorphism (retour)
Éléments semi-transparents avec flou d'arrière-plan et bordures fines, simulant du verre dépoli. Revenu en
2026 sous forme « hybride » : design plat en langage principal, verre appliqué seulement sur des éléments
ciblés (cartes tarifaires, popups, widgets).
Réf. : [onyx8agency.com — 10 Glassmorphism examples 2026](https://onyx8agency.com/blog/glassmorphism-inspiring-examples/),
[kreativagroup.com — Glassmorphism for B2B](https://kreativagroup.com/post/glassmorphism-web-design-what-b2b-brands-should-know),
[gezar.dk — 11 Web Design Trends 2026](https://gezar.dk/en/blog/web-design-trends-2026).
**Verdict métiers** : joli sur une photo d'atelier avec bloc de texte en verre dépoli (nuit, luxe) ; à
éviter derrière un texte important sur mobile (contraste souvent insuffisant en plein soleil).

### 3D / heros Spline
Scènes 3D interactives construites sans code via Spline (ou Three.js/WebGL), popularisées pour les hero
sections. Le discours 2026 insiste sur la sélectivité : le 3D est réservé aux marques où l'expérience EST
le produit (agences créatives, mode, portfolios), pas généralisé, car une scène Spline ajoute
0,8-2 Mo de JS avant le premier rendu et casse les Core Web Vitals.
Réf. : [medium.com/@abhinav.dobhal — Spline.design 2026](https://medium.com/@abhinav.dobhal/spline-design-in-2026-the-complete-guide-to-building-immersive-3d-web-experiences-without-code-097f475b3951),
[index.dev — Web Design Trends: AI, 3D, Ambient UI](https://www.index.dev/blog/web-design-trends),
[cubitrek.com — Web Design Trends 2026](https://cubitrek.com/blog/top-10-website-design-trends-for-2026-the-ultimate-guide).
**Verdict métiers** : quasiment jamais justifié pour un artisan local sur une offre one-shot rapide à
livrer — coût de production et de performance disproportionné face au bénéfice ; réserver à un studio
créatif/agence si jamais un client de ce profil arrive.

### Effets de curseur
Curseur personnalisé qui remplace ou complète le curseur système : cercle qui grossit, texte qui suit,
effet magnétique qui « attire » le curseur vers un bouton proche. À utiliser avec parcimonie (accessibilité,
fatigue visuelle).
Réf. : [thinslicedigital.com — Custom Cursors](https://www.thinslicedigital.com/custom-cursors/),
[speckyboy.com — CSS/JS Cursor Effects](https://speckyboy.com/css-javascript-cursor-effects/),
[blog.hubspot.com — Animated cursor UX](https://blog.hubspot.com/website/animated-cursor).
**Verdict métiers** : le `data-magnetic` déjà présent dans notre moteur (bouton) est la bonne dose pour
neon/luxe/pop ; un curseur totalement custom est hors-sujet pour la quasi-totalité de nos clients (métiers
sérieux ou pressés).

### Bandeaux marquee
Texte ou logos qui défilent horizontalement en boucle, souvent combinés au style néo-brutaliste. Efficace
pour capter l'attention (le cerveau repère naturellement le mouvement) mais à utiliser avec un bouton pause
et jamais comme seul porteur d'information critique (accessibilité : lecteurs d'écran, troubles de
l'attention).
Réf. : [awwwards — Text Marquee collection](https://www.awwwards.com/awwwards_collections/collections/text-marquee-effect/),
[finsweet.com — Marquee magic](https://finsweet.com/blog/marquee-magic-fresh-scrolling-effects-with-finsweet-components),
[kineticiris.com — Trends to avoid: Marquee (contrepoint)](https://kineticiris.com/trends-to-avoid-marquee-animation/).
**Verdict métiers** : parfait pour une bande d'avis ou de mots-clés de compétences (restaurant, salon,
garage) ; jamais pour le numéro de téléphone ou une info vitale qui doit rester lisible sans attendre le
bon passage.

### Luxe sombre
Évolution du minimalisme tout-noir vers un noir enrichi d'or par petites touches — la tendance
« Clubroom Contrast » de 2026, signal d'exclusivité et de confiance premium. L'or apparaît mat sur fond
blanc mais devient lumineux sur fond noir, d'où son usage en accent plutôt qu'en fond.
Réf. : [vistaprint.com — Color Trends 2026](https://www.vistaprint.com/hub/color-trends),
[fireart.studio — Web Design Trends 2026](https://fireart.studio/blog/the-best-web-design-trends/),
[muffingroup.com — Black website examples](https://muffingroup.com/blog/black-websites/).
**Verdict métiers** : correspond à notre direction `luxe` (bijoutier, horloger, tailleur, sommelier) ;
totalement contre-indiqué pour signal/urgence et pour tout ce qui doit paraître accessible/abordable
(low-cost, food truck).

### Rétro / Y2K
Retour des couleurs saturées, dégradés bonbon, boutons en relief et polices pixelisées de la fin des
années 90/2000, en réaction à une décennie de sans-serif plats et de palettes muettes qui avaient
uniformisé le web. À utiliser en touches (un bouton, un badge), pas comme fondation complète.
Réf. : [clairemac.co.uk — Y2K for 2026](https://www.clairemac.co.uk/2025/11/y2k-for-2026-the-comeback-that-never-left/),
[palettevault.github.io — Y2K Renaissance](https://palettevault.github.io/blog/y2k-renaissance/),
[setproduct.com — Retro/Brutalist UI 2026](https://www.setproduct.com/blog/retro-brutalist-ui-design-2026).
**Verdict métiers** : bonne base pour notre direction `retro` (barbier, friperie, disquaire, tatoueur
vintage) et `pop` en version édulcorée ; à écarter pour tout métier qui doit paraître fiable et sérieux.

### Fait main / organique
Illustration à la main assumée (traits imparfaits, textures de papier), formes organiques et courbes
irrégulières en réaction à la production visuelle algorithmique — signal explicite de travail humain.
Réf. : [getillustrations.com — Illustration Trends 2026](https://getillustrations.com/blog/emerging-illustration-styles-to-watch-in-2026/),
[craftwork.design — Website Illustration Trends 2026](https://craftwork.design/blog/website-illustration-trends-2026-explained),
[elements.envato.com — 7 illustration trends](https://elements.envato.com/learn/illustration-styles-and-trends).
**Verdict métiers** : cœur de nos directions atelier, encre, terre, nordique (artisanat, bien-être,
nature) ; à éviter pour luxe/pierre qui veulent une précision froide plutôt qu'une chaleur brute.

### Monochrome + un accent
Palette quasi grayscale avec exactement une couleur d'accent utilisée avec parcimonie — « Monochrome Pop ».
Le fond neutre inspire confiance, l'accent unique devient mémorable, sans jamais diluer l'attention.
Réf. : [hostadvice.com — 21 Monochrome Websites 2026](https://nz.hostadvice.com/blog/website-design/monochrome-websites/),
[hookagency.com — 101+ Website Color Schemes 2026](https://hookagency.com/blog/website-color-schemes/),
[gopickcolors.com — 2026 Web Color Trends](https://gopickcolors.com/blog/2026-web-color-trends-predictions).
**Verdict métiers** : excellent pour avocat/notaire/cabinet (rassurant, sobre, un CTA qui ressort) ; à
éviter pour les métiers qui doivent transmettre de la chaleur/joie (boulangerie, garde d'enfants).

### Écran partagé (split-screen)
La page divisée en deux (ou plus) panneaux verticaux, symétriques ou asymétriques, pour opposer deux
messages, deux produits ou texte/image. Se replie en empilement vertical sur mobile.
Réf. : [speckyboy.com — Asymmetrical Split Screens](https://speckyboy.com/asymmetrical-split-screens-web-design/),
[htmlburger.com — Vertical Split-Screen Websites](https://htmlburger.com/blog/vertical-split-screen-websites-examples/),
[designshack.net — Split Screen Web Design](https://designshack.net/articles/trends/split-screen-design/).
**Verdict métiers** : déjà notre variante `hero: split`, très polyvalente (texte + portrait) ; utile aussi
pour un avant/après (rénovation, coiffure) en version « faux split » avec curseur de comparaison.

### Vidéo plein cadre
Vidéo en fond de hero, courte (15-30 s), muette, en boucle, avec image statique de secours sur mobile.
Passage de « l'ère de l'image hero » à « l'ère de la vidéo hero » pour transmettre du mouvement et de
l'émotion plutôt qu'un cliché figé.
Réf. : [medium.com/coverr — Background Videos: Do's, Don'ts, Trends](https://medium.com/coverr/background-videos-dos-dont-s-and-trends-245ec9e1201),
[haleymarketing.com — 5 Background Video Website Examples](https://www.haleymarketing.com/2025/03/03/5-examples-of-background-video-in-websites/),
[herogrids.com — Full-bleed Image hero layouts](https://herogrids.com/layout/full-bleed-image/).
**Verdict métiers** : idéal si le client possède déjà une vidéo courte du geste métier (déjà notre variante
`hero: video`, conditionnée à `images.heroVideo` — jamais inventer une vidéo) ; sinon rester en photo.

### Micro-interactions
Petits retours visuels/sonores/haptiques qui confirment une action (bouton qui réagit, champ qui valide,
icône qui s'anime brièvement). En 2026 le curseur se déplace du décoratif vers l'utilitaire : réduire
l'incertitude plutôt qu'impressionner.
Réf. : [fluid22.com — Micro-Interactions that matter 2026](https://fluid22.com/insights/micro-interactions-that-matter-for-ux-wins-in-2026),
[designstudiouiux.com — 10 Micro-interaction examples](https://www.designstudiouiux.com/blog/micro-interactions-examples/),
[acodez.in — Micro-interactions & Motion Design](https://acodez.in/micro-interactions-motion-design/).
**Verdict métiers** : universel et peu coûteux (mode `subtle` de notre moteur suffit) — un formulaire de
contact avec retour visuel clair réduit les erreurs pour tous les métiers, sans exception de direction.

### Transitions de page
Passage fluide, animé par le navigateur, entre deux pages ou deux états grâce à l'API View Transitions
(native depuis 2025-2026 pour les transitions intra-document sur tous les moteurs majeurs ; les
transitions inter-documents restent partielles, non supportées par Firefox en stable).
Réf. : [developer.mozilla.org — View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API),
[brainstormsandraves.com — View Transitions 2026](https://brainstormsandraves.com/css/view-transitions-2026/),
[frontendhorizon.com — View Transitions API & Scroll-Driven Animations](https://www.frontendhorizon.com/blog/view-transitions-api-and-css-scroll-driven-animations-the-browser-wins-of-2026).
**Verdict métiers** : surtout utile sur un site multi-pages avec navigation fréquente (portfolio de
réalisations, catalogue de services) ; peu d'intérêt sur un site vitrine one-page comme la majorité de nos
livraisons.

### Animation de polices variables
Une police variable contient tous ses états de graisse/largeur dans un seul fichier, ce qui permet
d'animer en CSS pur (`font-variation-settings`) entre deux états sans changer de fichier — support natif
de la typographie cinétique et du survol réactif.
Réf. : [designflea.com — Typography Trends 2026](https://designflea.com/typography-trends-2026/),
[lovable.dev — Website Design Trends 2026](https://lovable.dev/guides/website-design-trends-2026),
[launchnow.design — Best Fonts for Web Design 2026](https://launchnow.design/blog/best-fonts-for-web-design-2026).
**Verdict métiers** : gain de performance (un seul fichier de police) pertinent pour tous les sites, avec
un bonus visuel réservé aux directions animées (neon, brut, pop) sur les titres.

### Dégradés mesh / Aurora UI
Dégradé multi-points qui se fondent organiquement dans l'espace, souvent flous et animés lentement sur
fond sombre (« Aurora UI ») pour une ambiance atmosphérique et onirique — évolution plus douce des
dégradés plats des années précédentes.
Réf. : [colorshunter.com — CSS Gradient Trends 2026](https://colorshunter.com/blog/gradient-design-trends),
[dopelycolors.com — Top 10 CSS Gradient Generators 2026](https://dopelycolors.com/blog/top-10-css-gradient-generators-2026),
[simplythebestdigital.com — 12 Gradient Website Examples](https://simplythebestdigital.com/12-beautiful-examples-of-gradient-websites/).
**Verdict métiers** : bon complément pour neon/luxe/nuit en fond de hero ; à éviter sur les directions
matières (atelier, terre, encre) où la texture doit rester organique, pas numérique.

### Grilles de points / lignes (esthétique « Vercel »)
Trame subtile de points ou de lignes en fond de section, façon papier millimétré ou plan technique — popularisée
par le site Vercel puis reprise par Stripe, Tailwind, Linear. Communique précision et rigueur technique
sans effort apparent.
Réf. : [setproduct.com — Vercel aesthetic / Blueprint Grid Design](https://www.setproduct.com/blog/complete-guide-to-blueprint-grid-design),
[ui.aceternity.com — Grid & Dot Backgrounds](https://ui.aceternity.com/components/grid-and-dot-backgrounds),
[ibelick.com — Crafting Grid/Dot backgrounds CSS](https://ibelick.com/blog/create-grid-and-dot-backgrounds-with-css-tailwind-css).
**Verdict métiers** : très bien pour garage/électricien-domotique/architecte (précision technique) ;
étrange pour un artisanat chaud (boulangerie, fleuriste) où elle contredirait la matière organique voulue.

### Anti-design
Rejet assumé du « bon goût » propre et neutre : grilles volontairement inégales, typographies qui se
heurtent, compositions asymétriques « qui sonnent faux » de façon délibérée — réaction à des années de
minimalisme algorithmique jugé fade. La distinction clé est l'intentionnalité : un anti-design qui se lit
comme négligé est juste un site raté.
Réf. : [builtin.com — Anti-Design is intentionally loud](https://builtin.com/articles/anti-design),
[geekyants.com — Anti-Design through neo-brutalism](https://geekyants.com/blog/exploring-anti-design-through-a-neo-brutalist-product-experience),
[wwwac.ca — Web Design Trends 2026: Anti-Design](https://www.wwwac.ca/en/news/web-design-trends-2026-1-rise-anti-design).
**Verdict métiers** : réservé aux marques qui peuvent se permettre le risque (studio créatif, mode, label
musical, tatoueur) ; formellement à éviter pour santé/juridique/entreprise où le public a besoin d'être
rassuré (cf. notre règle « à éviter » sur les directions luxe/journal/pierre).

---

## 3. Typographie et couleur

### 20 pairings vus sur des sites primés, avec équivalents libres Fontshare/Fontsource

Fontshare (fondry Indian Type Foundry) distribue deux types de licences : **FFL** (« ITF Free Font
License », fermée — usage web/print/app illimité et gratuit, mais interdiction de redistribuer ou revendre
le fichier de police lui-même) et **OFL** (SIL Open Font License, ouverte — modification et redistribution
autorisées tant que le dérivé reste sous OFL). Détail : [fontshare.com/licenses/itf-ffl](https://www.fontshare.com/licenses/itf-ffl)
et [fontshare.com/licenses/sil-ofl](https://fontshare.com/licenses/sil-ofl). Toutes les polices Fontshare
sont gratuites en usage commercial, sans attribution requise. Fontsource distribue des polices Google
Fonts (et assimilées) en paquets npm auto-hébergeables, quasi toutes sous OFL — voir
[fossa.com — SIL OFL expliqué](https://fossa.com/blog/open-source-licenses-101-sil-open-font-license-ofl/)
et [dev.to — Self-host Google Fonts avec Fontsource](https://dev.to/danwalsh/self-host-google-fonts-in-your-next-react-project-with-fontsource-1n07).
Intérêt pour nous : auto-hébergement (pas de requête vers Google/tiers), versions figées en dépendance npm.

Contexte général 2026 : le duo le plus cité par la presse spécialisée est **Instrument Serif (display) +
Inter (texte)** — « la paire libre la plus solide de 2026 : fraîche, éditoriale, bien construite »
(cf. [inspoai.io — Typography Trends 2026](https://www.inspoai.io/blog/typography-trends-2026)). Stripe
reste la référence citée pour l'exécution disciplinée d'un système typographique plutôt qu'un effet de
mode (Inter + réglages custom). Plusieurs des polices ci-dessous sont **déjà utilisées dans nos
directions actuelles** (`docs/DIRECTIONS.md`) — signalé entre parenthèses.

| # | Pairing (mood observé sur sites primés) | Équivalent libre display | Équivalent libre texte | Licence |
|---|---|---|---|---|
| 1 | Grotesque géométrique + serif éditorial élancé (luxe éditorial, presse) | Fraunces *(déjà : direction atelier)* | General Sans (Fontshare) | Fontsource OFL / Fontshare FFL |
| 2 | Display serif fin + sans neutre (la paire la plus citée 2026) | Instrument Serif | Inter | Fontsource OFL |
| 3 | Display ultra-condensé + grotesque suisse (agence créative) | Clash Display | Switzer | Fontshare FFL / Fontshare OFL |
| 4 | Serif casse haute élégante + sans discret (joaillerie, luxe) | Cormorant *(déjà : direction luxe)* | Hanken Grotesk *(déjà : direction mediterranee)* | Fontsource OFL |
| 5 | Slab/serif chaleureux + sans rond (artisanat, boulangerie) | Fraunces *(déjà : direction atelier)* | Cabinet Grotesk (Fontshare) | Fontsource OFL / Fontshare FFL |
| 6 | Display maximaliste gras + mono technique (brutalisme/tech) | Unbounded *(déjà : direction neon)* | Space Mono / JetBrains Mono | Fontsource OFL |
| 7 | Serif de presse + sans texte (journal, cabinet, notaire) | Playfair Display *(déjà : direction journal)* | Hanken Grotesk | Fontsource OFL |
| 8 | Display doux variable + serif littéraire (nordique, bien-être) | Sora *(déjà : direction nordique)* | Literata *(déjà : direction nordique)* | Fontsource OFL |
| 9 | Display rond rétro + sans géométrique (seventies) | Gloock *(déjà : direction retro)* | Poppins | Fontsource OFL |
| 10 | Serif calligraphique/encre + sans strict (tatoueur, graveur) | Instrument Serif *(proche de l'esprit "Instrument Serif géant" déjà en direction encre)* | Zodiak (Fontshare, serif expressive) | Fontsource OFL / Fontshare FFL |
| 11 | Display massif condensé + sans net (industriel, BTP) | Bebas Neue *(déjà : direction industriel)* | Red Hat Display *(déjà : direction industriel)* | Fontsource OFL |
| 12 | Serif bijou fine + mono discret (minéral, luxe froid) | Bodoni Moda *(déjà : direction pierre)* | Ranade (Fontshare, OFL) | Fontsource OFL / Fontshare OFL |
| 13 | Sans arrondi doux + display friendly (SaaS clair) | Cabinet Grotesk (Fontshare) | General Sans (Fontshare) | Fontshare FFL |
| 14 | Display aux courbes organiques + sans humaniste (biophilic, nature) | Gambetta (Fontshare, serif organique) | Supreme (Fontshare) | Fontshare FFL |
| 15 | Serif display dramatique XL + sans grotesque (éditorial maximal) | Melodrama (Fontshare) | Author (Fontshare) | Fontshare FFL |
| 16 | Grotesque suisse strict + serif d'appoint doux (corporate épuré) | Switzer (Fontshare) | Sentient (Fontshare, serif douce) | Fontshare OFL / FFL |
| 17 | Display gras compressé pop/Y2K + sans arrondi bulle | Anybody *(déjà : direction pop, variable)* | Fredoka | Fontsource OFL |
| 18 | Serif chic méditerranéenne + sans grec doux | Gelasio *(déjà : direction mediterranee)* | Hanken Grotesk *(déjà : direction mediterranee)* | Fontsource OFL |
| 19 | Display variable expérimental (axes animés) + sans neutre | Chubbo (Fontshare, variable) | Satoshi (Fontshare, variable) | Fontshare FFL |
| 20 | Serif slab expressif (retour skeuomorphisme doux) + sans grotesque | Boska (Fontshare) | General Sans (Fontshare) | Fontshare FFL |

Réf. générales typographie : [fontshare.com](https://www.fontshare.com/) (catalogue),
[abduzeedo.com — Fontshare, 100 typefaces gratuits](https://abduzeedo.com/fontshare-free-fonts-100-quality-typefaces-designers),
[fontsource.org](https://fontsource.org/) (implicite via paquets npm cités),
[fossa.com — SIL OFL](https://fossa.com/blog/open-source-licenses-101-sil-open-font-license-ofl/).

### Tendances de couleur 2025-2026

- **Cloud Dancer (Pantone Color of the Year 2026, 11-4201)** — un blanc calme et aérien, première fois
  que Pantone choisit un blanc ; symbolise la simplification et la clarté. Bon fond neutre pour clair,
  pierre, nordique. Réf. : [pantone.com — Color of the Year 2026](https://www.pantone.com/na/en-us/articles/color-of-the-year/color-of-the-year-2026-color-palettes).
- **Transformative Teal (WGSN/Coloro, couleur de l'année 2026)** — bleu-vert profond, associé à des
  accents vifs (alexandrite, turquoise, fuchsia) sur neutres naturels (sauge, onyx). Bon pour nuit,
  mediterranee, terre. Réf. : [vistaprint.com — Color Trends 2026](https://www.vistaprint.com/hub/color-trends).
- **Clubroom Contrast (noir + or)** — luxe nocturne, or utilisé en accent sur fond noir profond plutôt
  qu'en fond. Direction luxe. Réf. : [vistaprint.com — Color Trends 2026](https://www.vistaprint.com/hub/color-trends).
- **Monochrome Pop** — grayscale + un seul accent franc. Direction journal, pierre, clair. Réf. :
  [hookagency.com — 101+ Website Color Schemes 2026](https://hookagency.com/blog/website-color-schemes/).
- **Dopamine Y2K** — dégradés bonbon saturés, contrastes fluo, pour cibles jeunes/lifestyle. Direction
  pop, retro. Réf. : [clairemac.co.uk — Y2K for 2026](https://www.clairemac.co.uk/2025/11/y2k-for-2026-the-comeback-that-never-left/).
- **Pastels grainés « naïfs »** — pastels doux associés à du grain, signal anti-IA fait main. Direction
  atelier, terre, nordique. Réf. : [studio2am.co — Naive, grainy aesthetics 2026](https://studio2am.co/blogs/news/naive-grainy-and-blurred-on-purpose-2026s-pushback-against-ai-smooth-design).
- **Dégradés Aurora** — mesh violet/rose/teal flouté sur fond sombre, ambiance onirique. Direction neon,
  nuit. Réf. : [colorshunter.com — CSS Gradient Trends 2026](https://colorshunter.com/blog/gradient-design-trends).

---

## 4. Catalogue de 60 idées de section

Format : **Nom** — description — *animation suggérée (vocabulaire du moteur existant)* — métiers adaptés.

### Prix / offres
1. **Tarifs en tickets** — cartes façon billet de concert avec perforation CSS, prix en très grand,
   légère rotation aléatoire par carte. *`data-reveal` + micro-rotation au survol.* Salon, garage,
   restaurant (formules). Réf. : [footer.design — styles cards](https://www.footer.design/styles/bright) (esprit ticket/carte, à transposer aux blocs de prix).
2. **Prix en tableau typographique à pointillés** — liste « service ..... prix » avec filet pointillé qui
   se dessine entre les deux. *`data-draw` sur le filet + `data-stagger` sur les lignes.* Avocat,
   plombier, coiffeur.
3. **Grille tarifaire en cartes empilées** — 3 formules en pile, celle du milieu ressort au scroll.
   *`data-pin` + `data-scrub`.* Institut de beauté, coach sportif. Réf. : [awwwards — Stacking cards on scroll](https://www.awwwards.com/inspiration/stacking-cards-on-scroll-netgiro).
4. **Comparateur de formules en accordéon horizontal** — colonnes qui s'ouvrent au survol/clic. *transition
   CSS de largeur + `data-reveal`.* Auto-école, assurance, agence immo.
5. **Devis en compteur animé** — montant qui s'incrémente au scroll selon les options visuellement
   cochées. *`data-counter`.* Maçon, rénovation, déménageur.
6. **Étiquette prix suspendue façon marché** — prix sur étiquette carton, légère rotation au survol,
   apparition en cascade. *`data-reveal-delay` en cascade + rotation hover.* Fleuriste, boulangerie.

### Preuve sociale / avis
7. **Bandeau d'avis en marquee vertical** — colonnes de témoignages défilant en sens opposé. *`marquee`
   natif, orientation verticale.* Restaurant, salon, garage.
8. **Mur d'avis Google en grille bento** — note globale en grande cellule, avis individuels en cellules
   secondaires. *`data-stagger` au chargement.* Tout commerce avec avis Google fournis.
9. **Avant/après en curseur glissant** — slider révélant la photo « après » par glissement horizontal.
   *drag JS + `data-parallax` léger.* Couvreur, maçon, paysagiste, coiffeur.
10. **Logos partenaires en marquee, couleur au survol** — bande de logos en niveaux de gris, colorisés
    individuellement au survol. *`marquee` + transition `filter: grayscale`.* Architecte, consultant.
11. **Citation cliente qui se remplit au scroll** — texte gris clair qui se colore mot par mot selon la
    progression. *`data-text-fill` (mode rich).* Avocat, thérapeute, ostéopathe.
12. **Légende de réalisation collée au curseur** — le nom du chantier suit le curseur pendant le survol
    de la miniature. *`data-hover-img`.* Menuisier, architecte d'intérieur, photographe.

### Services / offre
13. **Liste de services avec image flottante au survol** — chaque ligne affiche une photo qui suit le
    curseur. *`data-hover-img`.* Coiffeur, spa, restaurant, menuisier. Réf. : [codrops — On-Scroll Sliced Text (technique voisine, transposable au hover)](https://tympanus.net/codrops/2023/12/05/on-scroll-sliced-text-animation/).
14. **Bento de services avec vidéo en boucle** — cellule principale en vidéo silencieuse, cellules
    secondaires en icônes. *autoplay muted loop + `data-reveal`.* Garage, salle de sport, traiteur.
15. **Services en accordéon avec numéro géant** — chaque service numéroté (01, 02...) en typographie
    énorme, s'ouvre en accordéon. *`data-stagger` + transition hauteur.* Cabinet de conseil, avocat.
16. **Services alternés avec trait qui relie texte et image** — filet SVG entre le texte et la photo.
    *`data-draw`.* Ébéniste, artisan.
17. **Carrousel de services en défilement horizontal épinglé** — section fixe qui libère un scroll
    horizontal des prestations. *`data-pin` + `data-horizontal`.* Institut de beauté, garage.
18. **Grille de services en cartes qui se soulèvent** — ombre portée qui suit l'inclinaison du curseur
    (tilt léger). *mode rich, tilt 3D.* Architecte, agence.
19. **Bande de compétences en ticker vertical** — mots-clés d'intervention qui défilent lentement.
    *`marquee`.* Électricien, serrurier (liste d'interventions).
20. **Menu de prestations façon carte de restaurant** — typographie éditoriale, filets fins, prix aligné à
    droite en pointillés. *`data-draw` + `data-reveal` en cascade.* Restaurant, bar à vin, institut.

### Timeline / process
21. **Timeline horizontale épinglée** — étapes qui défilent horizontalement pendant que la section reste
    fixe. *`data-pin` + `data-horizontal`.* Maçon, rénovation, garage, avocat. Réf. : [awwwards — Horizontal scrolling timeline](https://www.awwwards.com/inspiration/horizontal-scrolling-timeline-de-ruien).
22. **Process en étapes avec trait qui se trace au scroll** — ligne verticale reliant les étapes, tracée
    progressivement. *`data-draw` + `data-scrub`.* Plombier, électricien, notaire.
23. **Frise chronologique verticale à jalons qui s'allument** — chaque jalon s'illumine à son passage.
    *`data-reveal` par jalon.* Entreprise familiale, maison ancienne, restaurant historique.
24. **Étapes en cartes qui glissent latéralement (scroll-snap)** — chaque étape occupe l'écran, défilement
    horizontal saccadé. *CSS `scroll-snap` + `data-horizontal`.* Auto-école, agence immobilière.
25. **Chrono d'intervention en gros chiffre** — délai moyen d'intervention affiché en très grand, qui
    s'incrémente à l'affichage. *`data-counter`.* Plombier/serrurier urgence (direction signal).

### About / équipe
26. **Portrait révélé par bandes au scroll** — photo masquée par des bandes qui s'écartent
    progressivement. *`clip-path` + `data-scrub`.* Artisan solo, avocat, thérapeute.
27. **Biographie en colonnes de presse avec lettrine** — première lettre géante façon magazine.
    *`data-reveal` simple.* Notaire, consultant, historien.
28. **Valeurs en mots-clés géants inversés au survol** — un mot par ligne, couleur qui s'inverse au
    survol. *hover invert + `data-stagger`.* Tous métiers « valeurs », surtout nordique, journal.
29. **Équipe en grille de portraits qui passent en couleur au survol** — photo noir & blanc qui
    s'inverse en couleur. *transition `filter` + `data-reveal`.* Garage, salon, cabinet.
30. **Histoire en scroll narratif avec image qui suit le texte** — chapitres qui s'enchaînent avec fondu
    croisé. *`data-scrub` + fondu.* Restaurant gastronomique, domaine viticole, maison ancienne.
31. **Citation du fondateur en typographie signature** — phrase manuscrite tracée au chargement (SVG
    stroke). *`data-draw` sur tracé SVG.* Artisan, ébéniste, tailleur.

### Zones / carte / contact
32. **Carte des zones avec liste synchronisée** — survoler une ville dans la liste met en surbrillance le
    point sur la carte. *JS hover sync + `data-reveal`.* Plombier, paysagiste, déménageur.
33. **Formulaire de contact en une question à la fois** — une question par écran, barre de progression.
    *transition slide + `data-reveal`.* Avocat, architecte, agence immo (devis qualifié).
34. **Bloc « basé à » avec distance dynamique** — « à X minutes de chez vous » calculé par zone.
    *`data-counter`.* Artisan itinérant (plombier, électricien).
35. **CTA téléphone géant façon panneau d'urgence** — numéro en typographie massive, bouton qui pulse
    doucement. *pulse CSS + `data-reveal`.* Plombier, serrurier, vitrier (direction signal).

### Galerie / portfolio
36. **Galerie en grille inégale avec zoom au clic** — cellules de tailles variées, lightbox au clic.
    *`data-stagger` + transition scale.* Menuisier, photographe, traiteur.
37. **Réalisations en défilement horizontal plein écran** — chaque réalisation prend tout l'écran.
    *`data-horizontal` + `data-pin`.* Architecte, paysagiste, ébéniste.
38. **Avant/après en split vertical qui se déplace au scroll** — ligne de séparation qui glisse selon le
    scroll. *`data-scrub` sur `clip-path`.* Couvreur, rénovation.
39. **Mosaïque de matières avec légende au survol** — gros plans texturés (bois, pierre, métal), nom du
    matériau au survol. *`data-reveal` + fondu.* Ébéniste, marbrier, tailleur de pierre.
40. **Portfolio en liste texte avec vignette au curseur** — liste de projets en texte seul, vignette
    collée au curseur au survol. *`data-hover-img`.* Architecte d'intérieur, graphiste, photographe.

### Footer / fin de page
41. **Footer géant avec heure locale** — « Il est HH:MM à [Ville] » mis à jour en direct, horaires en
    dessous. *JS `setInterval` + `data-reveal`.* Tout commerce avec horaires d'ouverture.
42. **Footer typographique XXL en contour** — nom de l'enseigne en très grand, contour seul, qui se remplit
    au survol. *hover fill (`-webkit-text-stroke`).* Toutes directions, surtout brut/neon. Réf. : [footer.design — styles typographic](https://www.footer.design/styles/typographic).
43. **Footer en grille de liens façon plan de site aéré** — colonnes espacées, filets fins façon presse.
    *`data-draw` sur les filets.* Journal, pierre, nordique. Réf. : [footer.design — styles minimal](https://www.footer.design/styles/minimal).
44. **Footer avec mini-carte statique et pin animé** — carte simplifiée avec un point qui pulse sur
    l'atelier. *pulse CSS.* Artisan avec atelier/boutique physique.
45. **Footer marquee défilant avec CTA répété** — « Réservez maintenant · » en boucle au-dessus des
    colonnes de liens. *`marquee` natif.* Restaurant, salon, événementiel.

### Éditorial / texte fort
46. **Hero à mot unique qui se déchire au scroll** — un mot énorme qui se sépare en deux pour révéler le
    sous-titre. *`data-scrub` sur translations opposées.* Brut, encre, tatoueur, label.
47. **Manifeste en typographie à graisse variable pilotée par le scroll** — axe `font-variation-settings`
    piloté par la position de scroll. *`data-scrub`.* Agence, studio créatif.
48. **Paragraphe en surlignage progressif façon Apple** — texte gris qui se colore ligne par ligne selon
    le scroll. *`data-text-fill`/`data-scrub`.* Cabinet de conseil, notaire, avocat. Réf. : [builder.io — Scroll-driven animations](https://www.builder.io/blog/scroll-driven-animations).
49. **Chiffre clé géant qui compte en scrollant** — « 15 ans d'expérience », donnée réelle uniquement.
    *`data-counter`.* Tous métiers, jamais de chiffre inventé.
50. **Bandeau de mots-clés en marquee inversé au survol** — la bande change de sens au passage du
    curseur. *`marquee` + hover reverse.* Neon, brut, industriel.
51. **Double titre superposé désaligné au scroll** — deux copies du même titre légèrement décalées,
    effet glitch doux. *`data-scrub` sur translate.* Neon, tatoueur, label musical.

### Interaction / structure
52. **Curseur magnétique sur les CTA** — le bouton « attire » légèrement le curseur qui s'en approche.
    *`data-magnetic` (déjà dans `Button.astro`).* Directions animées (neon, luxe, pop).
53. **Grille de points en fond de section technique** — trame subtile façon esthétique Vercel derrière un
    bloc « process » ou « garanties ». *statique ou `data-parallax` léger.* Garage, électricien/domotique,
    architecte.
54. **Rideau d'entrée façon lever de rideau** — un panneau plein écran se retire au chargement pour
    révéler le hero. *`.ff-curtain` (déjà dans le moteur).* Luxe, nuit, direction à forte intention.
55. **Section « carnet d'échantillons » en défilement horizontal** — swatches de couleurs/matières
    alignées, scroll-snap par élément. *`data-horizontal` + scroll-snap.* Peintre décorateur, tapissier,
    marbrier.
56. **Cartes qui s'éventaillent au survol du groupe** — pile de cartes (avis, réalisations) qui se
    décale légèrement au survol de l'ensemble. *hover rotate par carte (custom properties CSS).*
    Photographe, fleuriste, traiteur.
57. **Séparateur de section avec trait qui se dessine et annonce le bloc suivant** — filet tracé + légende
    « Suivant : Tarifs ». *`data-draw`.* Directions éditoriales (journal, pierre).
58. **Overlay de grain léger sur fond sombre** — texture de bruit SVG à faible opacité pour casser l'aplat.
    *statique, filtre `feTurbulence`, aucun JS.* Luxe, nuit, encre.
59. **FAQ en accordéon avec icône qui pivote** — « + » devient croix par rotation fluide, réponse qui se
    déplie avec fondu. *transition rotate + hauteur.* Tous métiers avec FAQ fournie.
60. **Bande de certifications façon tampons encrés** — logos de certifications/assurances légèrement
    inclinés aléatoirement. *rotation aléatoire par item + `data-stagger`.* Garage, plombier, électricien
    (assurance décennale, certifications).

---

## 5. 25 concepts de hero + 15 concepts de navigation

### Hero

1. **Typographique plein écran** — un titre unique en majuscules occupe tout le viewport, sans image.
   [hero.gallery](https://hero.gallery/) (catégorie typographie-first).
2. **Vidéo en boucle silencieuse plein cadre** — geste métier en fond, texte en surimpression.
   [hero.gallery](https://hero.gallery/) (catégorie vidéo).
3. **Split portrait/texte** — portrait à droite, texte + CTA à gauche (notre variante `hero: split`).
   [hero.gallery](https://hero.gallery/) (Split Grid).
4. **Scène 3D interactive (Spline)** — objet du métier qui réagit à la souris ; à réserver aux marques où
   l'expérience prime sur la vitesse de chargement. [medium.com — Spline.design 2026](https://medium.com/@abhinav.dobhal/spline-design-in-2026-the-complete-guide-to-building-immersive-3d-web-experiences-without-code-097f475b3951).
5. **Mot unique géant qui se déchire au scroll** — cf. idée de section 46. [scrollytelling.ai](https://scrollytelling.ai/examples/).
6. **Rideau d'ouverture** — panneau plein écran qui se lève au chargement. [darkmodedesign.com](https://www.darkmodedesign.com/).
7. **Abstrait / mood** — dégradé mesh ou matière en fond, message émotionnel plutôt que produit.
   [colorshunter.com — Gradient Design Trends](https://colorshunter.com/blog/gradient-design-trends).
8. **Marquee derrière le titre** — un mot-clé du métier défile en bandeau derrière l'accroche.
   [awwwards — Text Marquee collection](https://www.awwwards.com/awwwards_collections/collections/text-marquee-effect/).
9. **Avec formulaire de devis intégré** — champ « décrivez votre besoin » directement dans le hero.
   [hero.gallery](https://hero.gallery/) (Interactive Elements).
10. **Centré minimal** — titre + sous-titre + CTA centrés, grand vide, aucune image.
    [siteinspire.com](https://www.siteinspire.com/).
11. **Portrait N&B + un accent couleur** — photo désaturée, un seul élément en couleur d'accent.
    [hookagency.com — Website Color Schemes](https://hookagency.com/blog/website-color-schemes/).
12. **Bento** — cellule d'accroche + cellules note Google/ville/spécialité. [studiomeyer.io — Bento Grid Layouts](https://studiomeyer.io/en/blog/bento-grid-layouts).
13. **Texture de grain/papier en overlay** — fond chaud avec grain léger, typo serif artisanale.
    [kittl.com — Grainy Blur Design](https://www.kittl.com/blogs/grainy-blur-effect-stl/).
14. **Entrée en défilement horizontal** — les mots du titre entrent un par un avant de se figer.
    [mockplus.com — Horizontal Scroll examples](https://www.mockplus.com/blog/post/horizontal-scroll-web-design-examples).
15. **Curseur magnétique sur le CTA seul** — seul le bouton principal réagit, le reste est statique.
    [thinslicedigital.com — Custom Cursors](https://www.thinslicedigital.com/custom-cursors/).
16. **Couverture de magazine** — filet fin, mention date/numéro, titre éditorial avec lettrine.
    [welovedaily.net — Editorial Design 2026](https://welovedaily.net/rankings/editorial-design-2026-30-magazine-layouts).
17. **Compteur de preuve sociale** — nombre de chantiers/clients réels qui s'incrémente sous le titre.
    Donnée interne réelle uniquement, pas de référence externe requise.
18. **Glassmorphism sur photo d'atelier** — bloc de texte en verre dépoli posé sur une photo plein cadre.
    [onyx8agency.com — Glassmorphism examples](https://onyx8agency.com/blog/glassmorphism-inspiring-examples/).
19. **Grille de points animée en fond** — trame façon Vercel qui dérive doucement en parallax.
    [setproduct.com — Blueprint Grid Design](https://www.setproduct.com/blog/complete-guide-to-blueprint-grid-design).
20. **Néo-brutaliste** — bloc de couleur saturée, bordure épaisse noire, titre désaligné volontairement.
    [retroui.dev — 12 Neobrutalist Websites 2026](https://retroui.dev/blogs/12-neobrutalist-websites-you-should-know-in-2026).
21. **Rétro/Y2K** — dégradé bonbon, typo bombée, bouton en relief façon early web.
    [clairemac.co.uk — Y2K for 2026](https://www.clairemac.co.uk/2025/11/y2k-for-2026-the-comeback-that-never-left/).
22. **Illustration dessinée à la main** — croquis du geste métier ou du lieu, trait imparfait assumé.
    [getillustrations.com — Illustration Trends 2026](https://getillustrations.com/blog/emerging-illustration-styles-to-watch-in-2026/).
23. **Luxe sombre or/noir** — fond noir profond, filet or fin, typo serif élancée, CTA discret.
    [vistaprint.com — Color Trends 2026](https://www.vistaprint.com/hub/color-trends).
24. **Vidéo produit en cadre inset** — vidéo dans un cadre arrondi au centre, marge visible autour.
    [hero.gallery](https://hero.gallery/) (catégorie Inset).
25. **Avec transition de sortie en View Transitions** — au clic, la page suivante glisse par-dessus au
    lieu d'un rechargement classique. [developer.mozilla.org — View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API).

### Navigation

1. **Minimaliste flottante qui rétrécit au scroll** — barre fine, se compacte après ~100px de scroll.
   [navbar.gallery](https://www.navbar.gallery/) (Static/Sticky).
2. **Plein écran en colonnes** — overlay avec liens principaux grands, secondaires petits, réparti en
   colonnes. [navbar.gallery](https://www.navbar.gallery/) (Full Screen Menu) + [designmodo.com — Full-Screen Menus](https://designmodo.com/full-screen-menus/).
3. **Dock flottant bas-centré** — barre courte ancrée en bas avec icônes + téléphone (notre variante
   `nav: dock`). [navbar.gallery](https://www.navbar.gallery/).
4. **Mega-menu par univers de service** — survol d'un lien déploie une grille de sous-services illustrée.
   [navbar.gallery](https://www.navbar.gallery/) (Mega Menu).
5. **Latérale fixe (sidebar)** — colonne verticale à gauche, contenu défile à droite, façon portfolio.
   [navbar.gallery](https://www.navbar.gallery/type/side-bar).
6. **Avec bandeau d'annonce au-dessus** — fine bande « Devis gratuit sous 24h » au-dessus de la barre.
   [navbar.gallery](https://www.navbar.gallery/) (Announcement Bar).
7. **Split logo centré** — liens répartis de part et d'autre du logo centré (notre variante `nav: split`).
   [siteinspire.com](https://www.siteinspire.com/).
8. **Burger plein écran, identique mobile/desktop** — pas de barre permanente, un bouton ouvre un plein
   écran fort (notre variante `nav: burger`). [navbar.gallery](https://www.navbar.gallery/) (Full Screen Menu).
9. **Avec recherche intégrée** — champ de recherche visible en permanence, utile si beaucoup de
   prestations. [navbar.gallery](https://www.navbar.gallery/) (Search Bar).
10. **Fil d'Ariane pour parcours multi-étapes** — utile sur un tunnel de devis en plusieurs pages.
    [navbar.gallery](https://www.navbar.gallery/) (Breadcrumbs).
11. **Qui change de thème au scroll (clair → sombre)** — la barre inverse ses couleurs en passant sur une
    section à direction opposée (fonction `navScroll()` déjà dans `motion.ts`). Référence interne au
    moteur existant.
12. **Avec CTA téléphone en couleur signal** — un seul élément coloré dans une nav sinon monochrome, le
    numéro/bouton d'urgence. [hookagency.com — Website Color Schemes](https://hookagency.com/blog/website-color-schemes/).
13. **Avec indicateur de section active (progress dots)** — petits points latéraux indiquant la section en
    cours de scroll. [navbar.gallery](https://www.navbar.gallery/type/side-bar).
14. **Qui devient indicateur de progression en scroll horizontal** — la barre se transforme en jauge
    pendant une section `data-horizontal`. [mockplus.com — Horizontal Scroll examples](https://www.mockplus.com/blog/post/horizontal-scroll-web-design-examples).
15. **Logo qui se redessine au chargement (trait SVG)** — micro-animation d'entrée unique et discrète.
    [acodez.in — Micro-Interactions & Motion Design](https://acodez.in/micro-interactions-motion-design/).

---

## 6. Sources (liste consolidée)

**Galeries et catalogues (§1)** : [Awwwards](https://www.awwwards.com/) · [Godly](https://godly.website/) ·
[Land-book](https://land-book.com/) · [Siteinspire](https://www.siteinspire.com/) ·
[Minimal Gallery](https://minimal.gallery/) · [Lapa Ninja](https://www.lapa.ninja/) ·
[Dark Mode Design](https://www.darkmodedesign.com/) · [One Page Love](https://onepagelove.com/) ·
[httpster](https://httpster.net/) · [Refero](https://refero.design/) · [Mobbin](https://mobbin.com/) ·
[Screenlane](https://www.screenlane.com/) · [Curated.design](https://curated.design/) ·
[Klart](https://www.klart.design/) · [Footer.design](https://www.footer.design/) ·
[Navbar Gallery](https://www.navbar.gallery/) · [Hero Gallery](https://hero.gallery/) ·
[Dribbble](https://dribbble.com/tags/2026-design-trends) · [Behance](https://www.behance.net/) ·
[Are.na](https://www.are.na/).

**Tendances (§2)** — articles cités inline par tendance ; principaux : studiomeyer.io, pixso.net,
retroui.dev, downgraf.com, itamde.com, elements.envato.com, scrollytelling.ai, metabole.studio,
maglr.com, annnimate.com, gsap.com, freefrontend.com, htmlburger.com, mockplus.com, kittl.com,
studio2am.co, ultimatedesigntools.com, wix.com, madegooddesigns.com, andacademy.com, welovedaily.net,
speckyboy.com, fliplink.me, onyx8agency.com, kreativagroup.com, gezar.dk, medium.com (Spline),
index.dev, cubitrek.com, thinslicedigital.com, blog.hubspot.com, awwwards.com (collections),
finsweet.com, kineticiris.com, vistaprint.com, fireart.studio, muffingroup.com, clairemac.co.uk,
palettevault.github.io, setproduct.com, getillustrations.com, craftwork.design, hostadvice.com,
hookagency.com, gopickcolors.com, designshack.net, coverr (medium.com), haleymarketing.com,
herogrids.com, fluid22.com, designstudiouiux.com, acodez.in, developer.mozilla.org, brainstormsandraves.com,
frontendhorizon.com, designflea.com, lovable.dev, launchnow.design, colorshunter.com, dopelycolors.com,
simplythebestdigital.com, ui.aceternity.com, ibelick.com, builtin.com, geekyants.com, wwwac.ca.

**Typographie et couleur (§3)** : [fontshare.com](https://www.fontshare.com/) ·
[fontshare.com/licenses/itf-ffl](https://www.fontshare.com/licenses/itf-ffl) ·
[fontshare.com/licenses/sil-ofl](https://fontshare.com/licenses/sil-ofl) ·
[abduzeedo.com — Fontshare 100 typefaces](https://abduzeedo.com/fontshare-free-fonts-100-quality-typefaces-designers) ·
[fossa.com — SIL OFL expliqué](https://fossa.com/blog/open-source-licenses-101-sil-open-font-license-ofl/) ·
[dev.to — Self-host Google Fonts avec Fontsource](https://dev.to/danwalsh/self-host-google-fonts-in-your-next-react-project-with-fontsource-1n07) ·
[inspoai.io — Typography Trends 2026](https://www.inspoai.io/blog/typography-trends-2026) ·
[pantone.com — Color of the Year 2026](https://www.pantone.com/na/en-us/articles/color-of-the-year/color-of-the-year-2026-color-palettes).

**Catalogue de sections et hero/nav (§4-5)** : en plus des liens ci-dessus, [builder.io — Scroll-driven
animations](https://www.builder.io/blog/scroll-driven-animations) ·
[tympanus.net/codrops — On-Scroll Sliced Text](https://tympanus.net/codrops/2023/12/05/on-scroll-sliced-text-animation/) ·
[awwwards — Stacking cards on scroll](https://www.awwwards.com/inspiration/stacking-cards-on-scroll-netgiro) ·
[designmodo.com — Full-Screen Menus](https://designmodo.com/full-screen-menus/).

**Documents internes de référence** : `docs/DIRECTIONS.md` (16 directions, variantes de section),
`src/scripts/motion.ts` et `src/styles/global.css` (vocabulaire réel du moteur d'animation).
