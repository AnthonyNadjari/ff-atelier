# Veille animations 2 — ce que font les meilleurs sites animés 2025-2026, et ce qu'on en tire

> Déclencheur : le fondateur a regardé nos sites (`captures/forge-delacroix-desktop.png`,
> `captures/finck-fisch-desktop.png`, `captures/lemaire-avocats-desktop.png`) : « animation pas fluide,
> ça scroll ultra vite, ça fait ultra IA ». Il veut « des super rendus ».
> Cette veille (20 septembre 2026) complète `docs/veille/animations.md` (bibliothèques, 25 effets) et
> `docs/veille/references.md` (30 teardowns de sites d'artisans). Ici : les sites **primés** de 2025-2026,
> pour en sortir des règles de rendu chiffrées et les effets qui nous manquent.

## 0. Méthode, et ce qui n'a pas rendu

Trois sources par site, croisées quand c'était possible :

1. **Fiche Awwwards** du site (technologies déclarées, éléments animés mis en avant, note
   « animations/transitions » du Dev Award) — WebFetch.
2. **HTML brut + premiers CSS/JS** (curl, User-Agent Chrome) : bibliothèques présentes (`gsap`,
   `lenis`, `SplitText`, `barba`, `swup`, `taxi`), `cubic-bezier()` et durées de `transition`, options
   `new Lenis({...})`, `scrub:`, `stagger:`, `ease:"..."`, `CustomEase.create(...)`, attributs `data-*`
   maison. Script et sorties dans le scratchpad de session (`analyse.txt`, `deep.txt`, non commités).
3. **Case study Codrops** quand elle existe (les auteurs y donnent durées, easings, lerp, scrub).

Pages qui ne rendent rien en fetch (notées, passées) : Godly (redirige vers recent.design, plus de liste),
Lapa.ninja et Land-book (HTTP 403), One Page Love (8 vignettes sans info animation), Sézane (mur anti-bot,
770 octets), L.I.S.A. (écran de vérification), Léo Parpeix (SPA vide, 3,9 Ko), Resn (page « old browser »),
Active Theory (coquille vide), Cerebrium et Kononenko (curl vide, mais fiche Awwwards + Codrops
exploitables), CodePen Osmo (403, valeurs récupérées via la recherche). Siteinspire, Minimal Gallery et
Dark Mode Design donnent des listes de sites, pas d'analyse : elles ont servi à choisir des cibles.

Faux positifs de grep écartés : `ogl` (matche « google »), `rive` (« drive », « arrive »), `THREE` sans
point (texte courant). Three.js n'est affirmé ci-dessous que si la fiche Awwwards/Codrops le dit ou si
`THREE.` apparaît dans un bundle JS.

Nos valeurs actuelles (lues dans `src/scripts/motion.ts` et `src/styles/global.css`, bloc motion) :
`--motion-duration: 0.9s` par défaut (brut/signal 0,5 s, neon/pop 0,7 s, retro 0,9 s, pierre 1 s, eclipse
1,1 s, nuit 1,2 s, luxe 1,4 s) ; un seul easing d'entrée `--ease-out-expo: cubic-bezier(0.16,1,0.3,1)`
pour reveal, stagger, split, draw, rideau, flip, count-bar ; `--ease-out-quart: cubic-bezier(0.25,1,0.5,1)`
pour les survols ; reveal = `opacity 0 → 1` + `translateY(24px)` (blur 12 px, scale 0,92, clip 99,5 %) ;
stagger par défaut 90 ms, plafonné à 600 ms au total ; `data-split` mots 45 ms / caractères 18 ms, 1 s /
0,7 s ; `data-scrub` scrub 0,6 ; `data-horizontal` scrub 0,5 ; `data-pin` scrub 0,6 ; `data-text-fill`
scrub 0,8 ; `data-parallax` scrub `true`, `yPercent = amount × 40` ; Lenis `lerp 0.09, wheelMultiplier
0.85` ; rideau d'entrée 1,1 s (retiré à 1 400 ms) ; marquee 30 s par défaut (28 s sur Forge) ;
IntersectionObserver `threshold 0.12, rootMargin -8 %` ; tilt 0,5 s `power2.out` ; magnetic 0,4 s.

## 1. Tableau — 62 sites et démos analysés

Colonnes : registre · effet signature (ce qui bouge / déclencheur) · technique probable · valeurs
relevées (≈ quand perçues, exactes quand lues dans le code ou la case study) · chez nous
(`docs/ANIMATIONS.md`).

### 1.1 Sites of the Day et nominés Awwwards, septembre 2026

| # | Site | Registre | Effet signature | Technique probable | Valeurs relevées | Chez nous ? |
|---|---|---|---|---|---|---|
| 1 | [Noho](https://noho.ink/) — [fiche](https://www.awwwards.com/sites/noho) | Mobilier DTC (concept), SOTD 18/09 | Preloader, puis hero chorégraphié ; galerie déclenchée au scroll ; chaise en 3D « Explore in 3D » ; footer qui se révèle | GSAP + ScrollTrigger + SplitText + Observer + **CustomEase**, Lenis, viewer GLB, Webflow | `CustomEase "hero1" M0,0 C0.64,0 0.47,0.57 1,1`, `"hero2" C0.16,0.56 0.44,1`, `"cascade" C0.2,0 0.1,1` ; durées GSAP 0,2 / 0,4 / 0,6 s ; stagger 0,04 et 0,066 ; Lenis `lerp .1`, variante `duration:3, syncTouch, syncTouchLerp .075` ; jury : « silky smooth », 7,34/10 | Partiel : rideau + stagger, mais un seul easing global, pas de courbe maison |
| 2 | [Boc.Studio](https://boc.studio/) — [fiche](https://www.awwwards.com/sites/boc-studio) | Agence branding, SOTD 19/09 | « Structure first, delight throughout » : micro-interactions, marquees, loader | Framer, Lenis ; CSS | `cubic-bezier(.22,1,.36,1)` (quint-out), `(.34,1.56,.64,1)` (back-out) sur les micro-interactions ; 0,4 s dominant, 0,9 s pour les grands mouvements, marquee 50 s | Partiel : `data-marquee`, pas de back-out pour les micro-états |
| 3 | [L.I.S.A.](https://lisa.locomotive.ca/) — [fiche](https://www.awwwards.com/sites/l-i-s-a) | Assistant IA d'agence (Locomotive), SOTD 16/09 | Assistant conversationnel, cercle qui pulse sur la voix (AudioContext) | WebGL, GSAP, Blender ; page non rendue en fetch | Animations 7,8/10, responsive 8,6/10 | Absent (hors périmètre artisan) |
| 4 | [Pensatori Irrazionali](https://www.pensatori-irrazionali.com/) — [fiche](https://www.awwwards.com/sites/pensatori-irrazionali) | Creative house, SOTD 20/09 | Menu à transitions vidéo, loader, galerie « Universe », 404 jeu | Three.js, GSAP, Lenis, Swiper, **View Transitions API** (24 références `view-transition`), `scroll-snap` (14), `font-variation-settings` (21) | `cubic-bezier(.2,0,0,1)` ×9 (« emphasized » Material), 0,15–0,6 s en UI, 2,25–2,65 s pour le 404 ; `prefers-reduced-motion` ×6 ; animations 8,2/10 | Absent : transitions de page (infra partielle), police variable animée |
| 5 | [LxL Creative](https://lxlcreative.co.uk/) — [fiche](https://www.awwwards.com/sites/lxl-creative) | Agence campagnes, SOTD 17/09 | Menu + transitions de page, reveals de projets, micro-interactions | Webflow + GSAP (ScrollTrigger, SplitText, Flip ×14, Observer), **Barba.js**, Lenis | `new Lenis({lerp:.165, wheelMultiplier:1.25})` ; `CustomEase "osmo" 0.625,0.05,0,1` utilisé 43 fois, `"jump" M0,0 C0.35,1.5 0.6,1 1,1` (overshoot) ; durées 0,3–0,75 s ; stagger 0,05 / 0,04 / 0,01 ; `scrub:true` et `scrub:.5` ; animations 8,0/10 | Absent : Barba/transition, courbe osmo, Flip sur listes |
| 6 | [Aspen Search](https://aspensearch.com/) — [fiche](https://www.awwwards.com/sites/aspen-search) | Cabinet de recrutement, SOTD 15/09 | Logo réactif à la souris, intro, confettis, carrousel + modale, thème clair/sombre | Next.js, Three.js, Rive, marquee (`data-marqy`), Framer Motion | `cubic-bezier(.16,1,.3,1)` (= notre expo-out) et `(.34,1.56,.64,1)` ; 0,45 / 0,6 / 0,8 / 1,2 s ; animations 7,6/10 | Partiel : `data-confetti`, `data-marquee`, même expo-out ; pas de logo réactif |
| 7 | [Warm & Fuzzy](https://warmnfuzzy.tv/) — [fiche](https://www.awwwards.com/sites/warm-fuzzy) | Studio créatif, SOTD 12/09 | Survol des projets, intro + transitions de page, **animations idle** | Next.js, Lenis, `data-scroll` | Une seule courbe maison `cubic-bezier(.26,1,.48,1)` ×16, `linear` pour les boucles ; 0,5 s ×15, 0,75 s, 75 ms | Absent : mouvement idle |
| 8 | [White Desert](https://white-desert.com/) — [fiche](https://www.awwwards.com/sites/white-desert) | Voyages de luxe (Antarctique), SOTD 11/09 | Galeries de séjours, sections collantes, parallax photo | Next.js, GSAP, Lenis, `position: sticky` ×12, `data-scroll` | `cubic-bezier(.76,0,.24,1)` (in-out) pour les grands déplacements, `(.16,1,.3,1)` pour les entrées ; 1,4 s ×3, 0,8 s, 0,3 s ; perf 8,0/10, animations 7,8/10 | Partiel : `data-sticky-stack`, `data-parallax` ; pas de courbe in-out |
| 9 | [Cerebrium](https://www.cerebrium.ai/) — [fiche](https://www.awwwards.com/sites/cerebrium), [case study](https://tympanus.net/codrops/2026/07/23/building-cerebrium-making-serverless-infrastructure-tangible/) | Infra IA, SOTD 10/09 | Intro WebGL, globe à champ de force qui « se souvient » du curseur, chemins lumineux pulsés | Three.js r183, GSAP, MeshLine, Lottie ; caméras bakées depuis Cinema 4D | Impulsions = masque d'opacité étroit qui glisse ; persistance du survol (texture temporaire, fondu lent) ; aucune durée publiée | Absent (Three.js refusé) ; la « persistance » du survol est transposable à `data-spotlight` |
| 10 | [USAvionix](https://usavionix.com/) — [fiche](https://www.awwwards.com/sites/usavionix) (basement) | Drones défense, SOTD 09/09 | Séquence de boot, hero 3D, transitions | Next.js, Three.js (`THREE.` ×166 en JS), GSAP Flip, Lenis (`wheelMultiplier:1`) | `cubic-bezier(.4,0,.2,1)` (Material standard) ; 0,15–0,75 s ; animations 8,2/10 | Absent (3D) |
| 11 | [Seasats](https://seasats.com/) — [fiche](https://www.awwwards.com/sites/seasats) | Robotique maritime, SOTD 08/09 | Intro « story », menu rétractable, globe + cas clients | Next.js, GSAP, Lenis, Swiper, Cinema 4D | `cubic-bezier(.215,.61,.355,1)` (cubic-out) ×11, `(.23,1,.32,1)` (quint-out), `(.19,1,.22,1)` (expo-out) ; 0,3 / 0,5 / 0,6 / 0,8 s, 1,6 s pour les grands panneaux | Partiel : mêmes familles out, mais chez nous une seule durée par direction |
| 12 | [United Carriers](https://unitedcarriers.com/) — [fiche](https://www.awwwards.com/sites/united-carriers) | Fret international, SOTD 06/09 | Hero 3D, preloader, révélation des industries au scroll, transitions | Webflow + GSAP + Three.js + **Barba** + Swiper + Lenis | CSS : `cubic-bezier(.445,.05,.55,.95)` (sine in-out) ×26, 0,4 s ×144 ; JS : `power3.inOut` ×17, `circ.inOut`, durées 0,4–1 s, stagger 0,2 (blocs) et 0,05 (texte) ; marquees 12 / 15 / 30 s ; `cursor` ×148 | Absent : in-out sur les transitions, curseur custom |
| 13 | [Gionatan Nese '26](https://www.gionatannese.com/) — [fiche](https://www.awwwards.com/sites/gionatan-nese-26) | Portfolio designer, SOTD 05/09 | Preloader vidéo, transition de page, scroll infini, avatar interactif | WebGL/Three.js, GSAP | `cubic-bezier(0.65,0,0.35,1)` (in-out) ; créativité 7,73/10 | Absent : preloader, scroll infini |
| 14 | [Illoca](https://illoca.unseen.co/) — [fiche](https://www.awwwards.com/sites/illoca) (Unseen) | SaaS architectes, SOTD 04/09 | Motion au scroll de l'accueil, blocs interactifs à la souris, sections qui se chevauchent en pied de page | Nuxt, GSAP (ScrollTrigger, Flip, Observer, **CustomEase « joe »**), Lenis, Three.js (`THREE.` ×89) | `Lenis lerp:.06` ; `stagger:.02` ×44, `.04`, `.05` ; `duration:.6` ×37, 0,4 / 0,8 / 1 / 1,2 ; **`scrub:1.2` et `scrub:1.5`** ; easings `joe.inOut` ×38, `joe.out` ×23, `none` ×18 | Partiel : nos scrubs sont à 0,5–0,6, notre stagger à 90–150 ms |
| 15 | [Trevor Noah](https://www.trevornoah.com/) — [fiche](https://www.awwwards.com/sites/trevor-noah) (OFF+BRAND) | Artiste, SOTD 03/09 | Sections qui « pèlent » au scroll, preloader, marquee | Webflow + **Taxi.js** (transitions), moteur scroll maison par attributs | `data-scroll` ×50, `data-scroll-offset="15%"`, `data-scroll-css-progress` (progression exposée en variable CSS), `data-scroll-speed="±0.05"`, `data-scroll-peel` ; `cubic-bezier(.215,.61,.355,1)` ; 0,5 s ×14 | Partiel : `data-scrub` ; absent : progression scroll exposée en `--progress` CSS |
| 16 | [Paul Kalkbrenner](https://paulkalkbrenner.net/) — [fiche](https://www.awwwards.com/sites/paul-kalkbrenner) (HOLOGRAPHIK) | Musicien, SOTD 02/09 | Intro, galeries multi-layouts, survols, marquee dont la vitesse suit le scroll, transition « pixelisée » | Webflow + GSAP (SplitText, CustomEase, Draggable, Inertia) + Lenis + Barba | `cubic-bezier(.625,.05,0,1)` (osmo) ×6, `(.87,0,.13,1)`, `(.32,.72,0,1)` ; `data-parallax-start="-12" data-parallax-end="8"` ; `data-marquee-speed="25"`, `data-marquee-scroll-speed="10"`, `data-marquee-duplicate="2"` ; `data-cursor-text="play"` ; `data-pixelated-scroll-transition` | Partiel : `data-marquee-velocity`, `data-parallax` ; absent : curseur à texte, transition pixelisée |
| 17 | [Squarespace Foundations](https://brand.squarespace.com/) — [fiche](https://www.awwwards.com/sites/squarespace-foundations) (Resn) | Brand book interactif, SOTD 01/09 | « Tap to explore », progression 0 → 100 %, carrousel de campagne | GSAP, JS maison ; contenu chargé après un loader | Non lisible en fetch (loader seul) ; 7,38/10 | Absent |
| 18 | [Why Zero](https://why.zero.university/) — [fiche](https://www.awwwards.com/sites/why-zero), [case study](https://tympanus.net/codrops/2026/07/17/zero-the-engineering-behind-a-defiant-interactive-narrative/) | Récit interactif (éducation), SOTD 07/09 | Geste « dessine un zéro », maintien 1,4 s pour briser une vitre, argent qui brûle, scroll virtuel | Three.js, GLSL, GSAP, Howler ; **moteur de scroll virtuel** (pas de ScrollTrigger) | Transition de couleur **~200 ms** (« 400 ms était moins percutant ») ; `holdDuration 1.4 s` ; qualité adaptative : upgrade < 12 ms/frame, downgrade > 22 ms ; animations 8,4/10 | Absent (expérience) ; la règle « 200 ms pour un changement d'état » est transposable |
| 19 | [Whiteout · An Ascent](https://whiteout.overvac.com/) — [fiche](https://www.awwwards.com/sites/whiteout-an-ascent) | Expérience Everest, nominé | « Scroll is altitude » : montagne procédurale, rail d'altitude latéral | Three.js (`THREE` ×302), GLSL, `lerp` maison ×123 | `cubic-bezier(.16,.84,.3,1)` ; 0,35 / 0,9 / 1,1 s ; `prefers-reduced-motion` ×2 | Absent : rail de progression / chapitres |
| 20 | [Forge Automotive](https://forgeautomotive.co.uk/) — [fiche](https://www.awwwards.com/sites/forge-automotive) (12 Studio) | Atelier automobile sur mesure (**le plus proche d'un artisan**), nominé | Intro scrubbée, menu en `clip-path`, « faux 3D » par lumière ponctuelle, fumée WebGL sur la 404, scroll infini | Next.js, GSAP, WebGL ; `view-transition` ×2, `position: sticky` ×14, `clip-path` ×13, `mask-image` | `cubic-bezier(0.8,0,0,1)` et `(0.5,0,0,1)` (in-out durs), `(.2,.7,.2,1)` ; 0,3 / 0,5 / 1 s ; marquee 4,5 s | Partiel : `data-reveal="clip"`, `data-sticky-stack` ; absent : menu clip-path, in-out |
| 21 | [Driessen Architectuur](https://driessenarchitectuur.nl/) — [fiche](https://www.awwwards.com/sites/driessen-architectuur) | Architecte, nominé | Reveals au scroll, vidéo, animation de chargement, zoom d'image lié au scroll | WordPress + GSAP (ScrollTrigger, SplitText) + Lenis + **Swup** | `data-scroll-inview` ×36, `data-scroll-speed="-1"` ×6, `"-0.5"`, `"-20"` (vitesses négatives = contre-parallax), `data-scroll-zoom-image` ; CSS 0,45 s ×1630, 0,3 / 0,6 / 0,9 s | Partiel : `data-parallax`, `data-reveal="mask"` ; absent : Swup |
| 22 | [Spyker Cars](https://spykercars.com/) — [fiche](https://www.awwwards.com/sites/spyker-cars) (The Brink) | Constructeur de luxe, nominé | Une journée de propriétaire en 3 temps, révélations photo parallax « éditoriales », heritage gauche/droite | GSAP + ScrollTrigger, Lenis, 3D/WebGL, Lottie ; `will-change` ×25, `mask-image` ×12 | `data-parallax-media-layout="editorial"`, `-grid="12"`, `-side="left/right"`, `-shift` ; `data-racing-heritage-reveal="left/right/center"` ; osmo `(.625,.05,0,1)` ; 8,57/10 communauté | Partiel : `data-reveal="left/right"` ; absent : grille parallax éditoriale à 12 colonnes |
| 23 | [Sedlecky Kaolin](https://sedlecky-kaolin.com/) — [fiche](https://www.awwwards.com/sites/sedlecky-kaolin) (YOLK) | Mine de kaolin (industrie), nominé | Récit du procédé minier au scroll, slider d'applications, timelines | **Vanilla JS + CSS**, Blender ; classes `magnetic` ×13 | HTML 1,5 Mo (SVG inline) ; 6,4/10 (1 vote) | Partiel : `data-magnetic`, `data-pin` |
| 24 | [Maison des Élites](https://www.mdebeauty.com/) — [fiche](https://www.awwwards.com/sites/maison-des-elites) | Skincare premium, nominé | Preloader, marquees, hero produit, sections ingrédients | Lenis, **Splitting.js**, Swiper ; `data-speed` | 0,15 s ×61 (états), 0,3 s, **1,2 s ×31** (entrées), 1,6 s ; 9,28/10 communauté | Partiel : `data-split`, `data-marquee` |
| 25 | [Maison AUGE](https://maisonauge.com/) — [fiche](https://www.awwwards.com/sites/maison-auge) | Studio beauté/luxe, nominé | Tout en vidéo (accueil, projets, détail), curseur | Next.js, Prismic ; `clip-path` ×23, `cursor` ×41 | 0,15 s (UI) ; 0,26 / 0,39 / 0,6 s en JS ; 8,4/10 | Absent : vidéo comme matière première |
| 26 | [LinusBio](https://linusbio.com/) — [fiche](https://www.awwwards.com/sites/linusbio) | Biotech, nominé | Hero vidéo, blocs 3D, timeline extensible | Craft CMS, Tailwind ; peu de JS d'animation | 8,5/10 communauté | Partiel : `data-accordion` |
| 27 | [Door Dennis](https://www.doordennis.nl/) — [fiche](https://www.awwwards.com/sites/door-dennis) | Freelance design, nominé | Hero vidéo au scroll, fond liquide interactif | WordPress, GSAP, Three.js | ~7,4/10 | Partiel : `data-shader` (fond), `data-frames` |
| 28 | [La Dolfina Jumping](https://ladolfinajumping.com/) — [fiche](https://www.awwwards.com/sites/la-dolfina-jumping) | Élevage/équipement équestre, nominé | Loader vidéo, révélations photo en parallax | GSAP, JS | Storytelling photo | Partiel : `data-parallax`, `data-reveal="mask"` |
| 29 | [FORMAT](https://format.obys.agency/) — [fiche](https://www.awwwards.com/sites/format) (Obys × DES) | Projet expérimental, nominé | Loader, transitions, formats manipulables | CSS, GSAP, Matter.js ; preloader | 9,11/10 communauté | Absent (physique) |
| 30 | [Mat Voyce](https://matvoyce.tv/) — [fiche](https://www.awwwards.com/sites/mat-voyce) (Uncommon/Huy Phan/Hon Tran) | Typographe animateur, SOTD 30/01/25 | Typographie cinétique, mega-menu animé | GSAP | 7,59/10 ; créativité 7,95 | Absent : typographie cinétique (police variable) |

### 1.2 Studios et références « craft »

| # | Site | Registre | Effet signature | Technique probable | Valeurs relevées | Chez nous ? |
|---|---|---|---|---|---|---|
| 31 | [Obys](https://obys.agency/) — [case study](https://tympanus.net/codrops/2026/05/14/designing-ourselves-the-new-obys-identity-and-website/) | Agence design | Logotype qui se réorganise (vertical / horizontal / grille) selon la mise en page, preloader | **rAF + Web Animations API maison**, WebGL natif, CSS pur, Bun | « Le mouvement explique l'idée, il ne décore pas » ; « ajustements constants » des timings ; aucune valeur publiée | Absent : logo qui se recompose |
| 32 | [Unseen Studio](https://unseen.co/) | Studio branding/digital | « Enter with/without audio », « Click & Hold », « Drag to explore our world » | WebGL, GSAP | JS : `expo.out` ×45, `power2.out` ×29, `expo.inOut` ×24, `power4.out` ×11 ; `duration:1` ×59, 0,5 / 0,8 / 1,5 / 2 s ; stagger 0,03 ; loader ×77 ; `(.34,1.56,.64,1)` | Partiel : `data-drag-grid` ; absent : hold-to-enter |
| 33 | [Locomotive](https://locomotive.ca/) — [case study SOTM](https://www.awwwards.com/locomotive-by-locomotive-wins-site-of-the-month-june-a-case-study.html) | Agence Montréal | Drapeau fluide en shader, grille « Play » à glisser, preloader | locomotive-scroll v5 (`data-scroll` ×22), canvas natif | `cubic-bezier(0.215,0.61,0.355,1)` ×43, `(.23,1,.32,1)` ×9 ; 0,15 / 0,25 / 0,3 s ; JS `power1.inOut` ×12, `power4.out` | Partiel : `data-drag-grid` |
| 34 | [Immersive Garden](https://www.immersive-g.com/) | Studio luxe (LV, Cartier, Dior) | « Scroll down », loader, toggle On/Off, canvas multiples | Lenis, Lottie, WebGL (6 canvas), `will-change` ×21 | `cubic-bezier(.445,.05,.55,.95)` (sine) ×8, `(.165,.84,.44,1)` (quart-out), `(.77,0,.175,1)` ; 0,5 s ×38 ; JS `sine.inOut` ×75, ease maison `circleDraw` ×13, durées 0,5 / 1 / 2,25 / 3 s | Partiel : `data-draw-svg` ; absent : courbe maison |
| 35 | [darkroom.engineering](https://darkroom.engineering/) (ex-Studio Freight, auteurs de Lenis) | Studio dev | Site vitrine des outils Satus/Lenis/Hamo/Tempus, WebGL | GSAP + ScrollTrigger, Lenis, Three.js | 0,5 / 0,6 / 1 / 1,2 s | — (référence outillage) |
| 36 | [basement.studio](https://basement.studio/) — [fiche](https://www.awwwards.com/sites/basement-studio-1) | Studio (Argentine) | Menu plein écran, transitions « scribble » sur les images, loader | Next.js, Three.js | `cubic-bezier(.4,0,.6,1)` ×39 ; 0,15 s ×13 (UI) ; animations 8,6/10 (2022) | Absent : menu overlay plein écran (référence : `references.md` move 35) |
| 37 | [Huy Phan](https://huyml.co/) (GSAP showcase) | Portfolio dev | Survols, `mix-blend-mode` généralisé, curseur | GSAP ; `mix-blend-mode` ×264, `will-change` ×69 | `cubic-bezier(0.22,1,0.36,1)` ×25 (quint-out), `(0.22,0.61,0.36,1)` ×12 ; **320 ms ×33**, 220 ms, 0,45 s, 520 ms | Absent : `mix-blend-mode: difference` (move 40 de `references.md`) |
| 38 | [Revelatio Studio](https://revelatio.studio/) — [fiche](https://www.awwwards.com/sites/revelatio-studio) | Studio branding/code, SOTD 12/08 | Preloader + hero vidéo, gros chiffres au scroll, ville pilotée à la souris | Webflow + GSAP (ScrollTrigger, SplitText) + Lenis + Swiper | osmo `(0.625,0.05,0,1)` ×5, `(0.625,0,0.875,0)` (in) ; 0,4 s ; animations 7,6/10 | Partiel : `data-counter`, `data-split` |
| 39 | [Emotion Agency](https://emotion-agency.com/) — [fiche](https://www.awwwards.com/sites/emotion-agency) | Agence (Nuxt) | Transitions, 404, police variable animée | GSAP, Three.js, GLSL, Nuxt ; `font-variation-settings` ×25, `backdrop-filter` ×12, `mask-image` | `(.16,1,.3,1)` ×9, `(.33,1,.68,1)`, `(.36,0,.66,-.56)` (back-in), `(.34,1.56,.64,1)` ; 0,2 / 0,3 / 0,4 s ; JS `power2.out` ×27, `power2.inOut` ×22, `back.out(1.7)` ×3 | Absent : axe de police variable animé |
| 40 | [12 Studio](https://12studio.agency/) (auteurs de Forge Automotive) | Agence | Transitions transform, keyframes lents | Gatsby, Lenis | `cubic-bezier(0.8,0,0,1)` ×54 (in-out dur), `(0.43,0.195,0.02,1)` ×9 ; `transform 0.5s` et `1.2s`, keyframes 5,4 / 6 s | Absent : in-out signature |
| 41 | [House of Yellow](https://houseofyellow.nl/) — [case study](https://tympanus.net/codrops/2026/09/16/house-of-yellow/), [fiche](https://www.awwwards.com/sites/house-of-yellow) | Agence contenu (HM Awwwards 22/07/26) | Logo qui interagit avec la vidéo, 4 marquees autour du bouton Play, formes SVG qui morphent entre sections | Lenis, GSAP (ScrollTrigger, SplitText, **MorphSVG**), **Swup**, lecteurs Vimeo custom | `data-marquee-speed="30/45/60/90"`, `data-marquee-direction`, `data-scroll-speed="2/4/15/-2/-4"` ; CSS `transition: transform .45s .15s, opacity .45s .15s` (cascade par délais 0,15 / 0,3 / 0,45 / 0,6 s), `opacity .3s ease-out` ; `position: sticky` ×283 | Partiel : marquee, sticky ; absent : morph SVG entre sections |
| 42 | [Goodside](https://goodside.studio/) | Agence | Marquee, soleil qui tourne, curseur | IntersectionObserver + rAF maison (zéro lib) | `--ease: cubic-bezier(0.22,1,0.36,1)` ; `transition: opacity 0.9s ease, transform 1s var(--ease)` ; `sunspin 16s linear infinite` ; 0,45 / 0,5 / 0,6 s | Partiel : même famille que nous, mais **opacity et transform sur deux durées différentes** |
| 43 | [Lambert | Lambert](https://lambert-lambert.com/) | Agence (Siteinspire) | Parallax, entrées | CSS, `will-change` ×7 | `(.16,1,.3,1)` ×7 ; 0,4 / 0,5 / 0,6 / 0,8 / 1,2 s | Partiel |
| 44 | [Love and Money](https://loveandmoney.com/) | Agence (Siteinspire) | Curseur, entrées lentes | GSAP ; `will-change` ×12 | `cubic-bezier(.32,.72,0,1)` (idem Vercel), `(.4,0,.2,1)` ; **700 ms ×9**, 400 ms ; JS stagger 0,04, durée 1,4 / 0,6, `power3.out` | Partiel |
| 45 | [Trionn](https://trionn.com/) — [case study](https://tympanus.net/codrops/2026/07/15/the-architecture-behind-trionn-coordinating-gsap-three-js-lenis-and-web-audio/) | Studio | Titre blur → net par caractère, séquence de 371 WebP scrubbée, galerie éparpillée, rideau physique | GSAP (SplitText, ScrollTrigger, DrawSVG), Three.js, Lenis sur `gsap.ticker`, Web Audio | Titre : `blur(12px)→0`, **0,8 s `power2.out`, stagger 0,08, délai initial 1,2 s** ; frames : **lerp 0,12 vers la frame cible** ; DrawSVG 1,5 s stagger 0,04 ; entrée galerie stagger 0,34/image ; `will-change: filter, opacity` posé pendant l'anim, retiré après ; rendu piloté par ScrollTrigger, pas de boucle continue | Partiel : `data-frames` (sans lerp de frame), `data-reveal="blur"`, `data-draw-svg` |
| 46 | [Kononenko Architectural Bureau](https://kononenkogroup.com/) — [case study](https://tympanus.net/codrops/2026/09/18/kononenko-architectural-bureau/) | Bureau d'architecture | Projets qui arrivent « de différents bords », survol = un projet net, les autres en contours ; portraits d'équipe qui changent de forme au scroll ; galerie infinie à glisser ; images = plans WebGL | Nuxt 4, GSAP (SplitText pour **tous** les textes, ScrollTrigger scrub), Lenis alimente ScrollTrigger, boucle WebGL sur `gsap.ticker`, Three.js | « L'interaction est bien plus forte entourée de simplicité » ; tout est interruptible (« spammable ») ; aucune durée publiée | Partiel : `data-hover-img`, `data-split` ; absent : split par lignes, survol qui « éteint » les voisins |
| 47 | [Flim](https://flim.ai/) — [case study](https://tympanus.net/codrops/2026/01/14/a-site-for-sore-eyes-combining-gsap-and-webflow-to-showcase-flim/) (ToyFight) | SaaS créatif | Transition de page masquée, lignes qui glissent, yeux qui suivent le curseur, formes qui tombent (physique), porte 3D en pied de page | Webflow + GSAP (SplitText, ScrollTrigger, Flip) + Lenis + Lottie + Rapier | Lignes : `yPercent 100→0`, **0,8 s, stagger 0,1, `power3.inOut`, déclenchement à 90 %** ; transition de page **0,5 s `power2.inOut`** ; marquee 10 s `linear` ; Flip 1 s `power2.inOut` ; scroll horizontal **`scrub: 1`** ; hero : durée 0,7 s, stagger `floor(i/3)*0.3+0.3` ; survol bouton : caractères 0,1 s ×2, stagger 0,2 | Partiel : `data-horizontal` (scrub 0,5), `data-split` (mots) ; absent : transition de page, lignes |
| 48 | [MERSI](https://www.mersi-architecture.com/) — [case study](https://tympanus.net/codrops/2026/07/27/between-print-and-digital-the-making-of-mersis-website/) | Architecture | Slider split-screen en `clip-path`, couverture qui **se retourne et glisse** vers la page projet (Flip), scroll horizontal épinglé, grille qui se réorganise | Webflow + Vite, GSAP (ScrollTrigger, SplitText, Flip), Lenis, **Taxi.js**, Splide | Flip cover **1,2 s `expo.inOut`** (mobile : rideau clip-path à la place) ; grille : **2 s `expo.inOut` aller / 1,2 s `power4.inOut` retour, stagger 0,05** ; slider clip-path sans scrub (float entre index) | Partiel : `data-horizontal`, `data-compare` (clip-path) ; absent : Flip liste → page |
| 49 | [Dash Creative](https://www.dashcreative.co/) — [case study](https://tympanus.net/codrops/2026/07/21/magnetic-commerce-building-the-dash-creative-website/) | Agence e-commerce | Logo 3D attiré par le curseur, vidéo de fond « tirée » par le curseur avec inertie, cartes façon notifications iOS | Webflow + GSAP + fragment shader maison (un quad, une texture vidéo) | Shader : `radius .41, amplitude .082, frequency 13, speed .98, speedDecay .86, motionGain 220` ; « les petits réglages de timing et d'easing ont plus d'impact que de nouveaux effets » | Partiel : `data-shader-pointer`, `data-hover-distort` |
| 50 | [Horeca](https://www.horeca-social.com/en) — [case study](https://tympanus.net/codrops/2026/06/10/building-horeca-advanced-motion-design-in-webflow-without-the-performance-trade-offs/) | Agence CHR (**métier proche des nôtres**) | Texte qui grossit ×2,25 pivoté sur une lettre, pile de cartes sticky (rotation/échelle/fondu), accordéon collé en bas, mega-menu caractère par caractère | Webflow + GSAP (ScrollTrigger, SplitText) + Lenis **desktop seulement** ; `position: sticky` + GSAP transforms | Pile de cartes : **scrub 0,3** (0,1 abandonné, trop sec) ; échelle 2,25 desktop / 2,95 mobile ; stagger ±0,05, menu −0,03 (ordre inverse) ; « la performance, c'est surtout ne pas animer » ; Lenis coupé sur mobile | Partiel : `data-stack`/`data-sticky-stack` (sans rotation), `data-accordion` |
| 51 | [Yestalgia (Decathlon)](https://decathlonyestalgia.com/) — [case study](https://tympanus.net/codrops/2026/09/12/yestalgia-bringing-decathlons-90s-spirit-to-life-through-a-playful-digital-experience/) | Marque grand public | Menu-walkman (cassettes qui glissent), titres à fausse épaisseur 3D (caractères dupliqués et décalés), satellites idle, carrousel infini | GSAP (ScrollTrigger, Draggable, SplitText), Lenis, Rive, **Tempus** (une seule boucle rAF), piecesjs (web components) | Composant déclaratif `<c-timeline data-timeline-from/-to>` ; mobile : split par **mots** au lieu de caractères ; reduced-motion : durées/stagger/délais **à zéro** ; Rive en pause hors viewport | Partiel : `data-split="chars"` ; absent : fausse extrusion, idle |
| 52 | [PX PUSH](https://pxpush.com/) — [case study](https://tympanus.net/codrops/2026/08/07/the-department-is-open-building-the-px-push-website/) | Studio | Overlay CRT permanent, logo chromé qui tourne avec la vélocité du scroll, titres-marquee dont les mots arrivent en Z, séquence photo pilotée par la vélocité | Nuxt 3, GSAP + ScrollTrigger, Lenis « tické » sur l'horloge GSAP, Three.js ×3, Splitting.js | Titres : Z −100 px → 0, **stagger 0,03, `scrub: true`, `"top 90%" → "top 0%"`**, sortie fade + blur 20 px `"top 5%" → "top -30%"` ; logo : `target *= 0.9`, lerp 0,16 ; scanlines 8 s ; attributs déclaratifs `effect__titleRandom`, `effect__fadeOut` | Partiel : `data-scrub`, `data-blur-scrub` ; absent : effet piloté par la vélocité |
| 53 | [Goodgrowth](https://goodgrowth.com/) — [case study](https://tympanus.net/codrops/2026/08/27/goodgrowth-boot-sequences-spinning-discs-and-the-art-of-the-portfolio/) | Portfolio | Boot-screen (disque qui tourne), compteur de chargement, miniatures en spirale, CD qui tourne au scroll + auto-rotation idle, transition en 5 bandes | Three.js, GSAP, Lenis, Web Audio, Vite, vanilla | Compteur ~1,3 s ; spirale stagger 0,09, +140° ; **bande de transition 0,6 s** ; traînée shader ×0,94/frame ; audio idle après 220 ms sans wheel ; timeout transition 4 000 ms max | Absent : idle, transition en bandes |
| 54 | [HAOQI.DESIGN](https://haoqi.design/) — [case study](https://tympanus.net/codrops/2026/08/15/inside-haoqi-design-letting-dom-and-webgl-share-a-retro-futurist-stage/) | Portfolio design/eng | Images qui se « développent » comme une photo argentique à l'entrée, **flexion des images selon la vélocité de scroll**, texte décodé, transition plein écran en masque radial | Next.js, Lenis (`autoRaf: false`, dans la boucle R3F), Motion, Three.js/R3F | Développement image **0,8 s** ; curl : attaque tau 0,025 s, relâche tau 0,175 s, normalisé à **800 px/s**, force max 0,06 × vélocité ; décodage texte ticker 40 ms ; refresh des rects lointains 1 frame sur 12 | Absent : effet de vélocité, « développement photo » |
| 55 | [Thibault Guignand](https://www.thibaultguignand.com/) — [case study](https://tympanus.net/codrops/2026/05/06/from-shader-uniforms-to-clip-path-wipes-how-gsap-drives-my-portfolio/) | Portfolio dev (**OGL, pas Three.js**) | Carrousel vidéo en masque pixelisé + aberration chromatique, texte « flowmap » au curseur, section « projet suivant » qui se déploie au scroll, transitions View Transitions + clip-path | GSAP (SplitText, ScrambleText, ScrollTrigger), Lenis sur `gsap.ticker`, **OGL**, View Transitions API | Reveal texte : scramble + `clip-path inset(0 0% 0 0)` **0,6 s `power2.out`** ; morph scroll **`scrub: 1`**, `bgScale 1.3→1`, `inset 20%/40% → 0` ; transition : fade 0,3 s + contenu 0,35 s à T+0,25 (`power2.inOut`) ; flowmap suspendu après 90 frames sans souris ; reduced-motion = **version parallèle conçue**, pas un fallback | Partiel : `data-scramble`, `data-hover-distort` (OGL) ; absent : wipe clip-path + scale scrubbé |
| 56 | [Podium](https://podium.global/) — [case study](https://tympanus.net/codrops/2026/06/23/podium-building-a-website-where-running-becomes-storytelling/) | Production de films (sport) | Hero à grain qui réagit au curseur, texte caractère par caractère en ordre aléatoire, image de grille qui s'étend vers le hero projet | Zustand, GSAP (ScrollTrigger, Flip), Lenis sur ticker GSAP, R3F | Trail : `maxAge 600, radius .095, intensity .1, minForce .5` ; « slowing down is what creates impact » ; transitions verticales simples | Partiel : `data-spotlight` ; absent : Flip image → hero |
| 57 | [Vivid](https://viivid.webflow.io/) — [case study](https://tympanus.net/codrops/2026/09/15/vivid-turning-a-visual-experiment-into-an-interactive-webflow-experience/) (BL/S) | Expérience Webflow | Scroll converti en intentions avancer/reculer (machine d'états), traînée de curseur à 30 points, transition pixelisée en bande diagonale, morph vidéo → logo | GSAP ×180, Three.js, Swiper, SplitType | JS : `duration:.6` ×6, 1, 0,5, 0,9, 2,4 ; stagger 0,015 / 0,02 / 0,06 / 0,15 ; `power2.out` ×11, `power1.inOut`, `power3.inOut` ; CSS `cubic-bezier(.8,0,.2,1)` ×12 ; `prefers-reduced-motion` ×4 | Absent (expérience) |
| 58 | [Chems.Studio](https://www.chems.studio/) — [case study](https://tympanus.net/codrops/2026/08/08/designing-a-flexible-digital-archive-for-chems-studios-creative-practice/) | Archive créative | Transitions « presque invisibles », scramble discret sur la navigation, images qui apparaissent « sans urgence » | Webflow + Swup + Vimeo | « Rien ne boucle pour décorer » | Partiel : `data-scramble` (entrée seulement, pas au survol/nav) |
| 59 | [4WIDE](https://4wide.jp/) — [case study](https://tympanus.net/codrops/2026/04/23/building-4wide-turning-distortion-blur-and-motion-into-a-coherent-experience/) | Studio (**Astro**, comme nous) | Distorsion courbe + flou synchronisés au scroll, mode « focus » sur la vidéo | Astro, GSAP, Three.js, Swup, WordPress headless | Focus : **1,4 s `power4.out`**, filtre 0,3→0,9, distorsion 0→0,7, `playbackRate 1→0.6` ; mobile : flou coupé, géométrie −50 %, `scrub: true` sur l'offset | Absent : ralenti vidéo au focus |
| 60 | [Roman Jean-Elie](https://www.romanjeanelie.com/) — [case study](https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/) | Portfolio | Texte étiré par la vélocité de scroll, lignes de profondeur, morph rectangle → lettres, page qui se plie | Next.js, R3F, GSAP MorphSVG (rendu canvas) | Amplitude stretch `0.009 × uScaleY` ; blur des lignes `0.2 + |v| × 0.2` ; `power3.out`, `power2.out`, `back.out(1.2)`, `expo.inOut` ; contact en 3 phases 0,5 / 0,6 / 0,4 | Absent : vélocité |
| 61 | [Martin Laxenaire](https://www.martin-laxenaire.fr/) — [case study](https://tympanus.net/codrops/2025/10/06/self-doubt-and-the-quest-for-fun-how-i-ended-up-turning-my-portfolio-into-a-game/) | Portfolio (WebGPU) | 4 scènes WebGPU, site « jeu » qui débloque le thème | gpu-curtains, GSAP, Lenis, Nuxt 3 | `QualityManager` 0–10 piloté par FPS ; `prefers-reduced-motion` | Absent |
| 62 | [Shopify Editions Spring '26](https://www.shopify.com/editions/spring2026) — [case study](https://tympanus.net/codrops/2026/06/26/engineering-the-web-experience-behind-shopifys-spring-26-edition-everywhere/) | Produit (grande marque) | Lumière volumétrique depuis vidéo, nuages de points, vidéos transparentes, fluide au curseur | Three.js/R3F, Rive, KTX2, WebGL2 | **4 tiers GPU** (tier 0 = pas de WebGL), DPR clampé sur mobile, scènes montées uniquement près du viewport ; reduced-motion supprime les splats | Partiel : `data-shader` (DPR ≤ 1,5, pause hors écran) |

### 1.3 Grands comptes design-driven (Linear, Vercel, Stripe, Apple)

| # | Site | Registre | Effet signature | Technique probable | Valeurs relevées | Chez nous ? |
|---|---|---|---|---|---|---|
| 63 | [Linear](https://linear.app/) | SaaS produit | Grille de points qui « clignote » (steps), très peu de motion continue ; marquee de logos | CSS `@keyframes` ×150, `steps(1,end)` ; aucune lib d'animation, pas de smooth scroll | `grid-dot-* 1600ms / 2800ms / 3200ms steps(1,end) infinite` ; UI 160 ms / 480 ms | Absent : animation « pas à pas » (`steps()`) |
| 64 | [Vercel](https://vercel.com/home) | Plateforme | Micro-états rapides, marquee, aucun scroll-jacking | CSS + rAF (×10), `mix-blend-mode`, `will-change` ×7 | `cubic-bezier(.4,0,.2,1)` ×8, **`(.32,.72,0,1)` ×4**, `(.4,.04,.04,1)`, `(.455,.03,.515,.955)` ; **0,2 s ×16, 0,15 s ×13**, 0,4 / 0,5 / 0,35 s ; grands mouvements 1–2,5 s | Partiel : nos survols sont à 0,35–0,7 s |
| 65 | [Stripe](https://stripe.com/) | Paiement | Dégradé maillé WebGL (minigl, ~10 Ko, skewY −12°), bento, accordéons | Canvas WebGL maison ([analyse](https://kevinhufnagl.com/how-to-stripe-website-gradient-effect/)), `clip-path` ×57 | **`cubic-bezier(.25,1,.5,1)` ×40 (= notre `--ease-out-quart`)**, `(.4,0,.2,1)`, `(.33,1,.68,1)`, `(.16,1,.3,1)` ; 0,3 s ×24, 0,5 s ×16, 0,15 s | Partiel : `data-shader="mesh"` ; même quart-out |
| 66 | [Apple — MacBook Pro](https://www.apple.com/macbook-pro/) et [iPhone 17 Pro](https://www.apple.com/iphone-17-pro/) | Pages produit | Fondu en cascade des blocs, galeries scroll, **product viewer en vidéo** (`data-video-id`), sticky ×22 | Composants maison : `data-component-list="StaggeredFadeIn"` ×19, `"ScrollGallery WillChange"`, `data-anim-keyframe` ×8 ; passage des séquences d'images au **video scrubbing** ([analyse](https://www.brad-holmes.co.uk/web-performance-ux/why-most-scroll-animations-miss-what-apple-gets-right/)) | **`cubic-bezier(.4,0,.6,1)` ×122** (in-out doux), `(.25,.1,.3,1)`, `(.28,.11,.32,1)` ; **320 ms ×59**, 240 ms ×26, 160 / 120 ms ; grands panneaux 0,8–1 s | Partiel : `data-frames` (images, pas vidéo) ; absent : in-out 320 ms pour les micro-états |

### 1.4 Tutoriels et démos avec valeurs (Codrops, GSAP, Osmo)

| # | Source | Effet | Valeurs |
|---|---|---|---|
| 67 | [Sticky Grid Scroll — Codrops](https://tympanus.net/codrops/2026/03/02/sticky-grid-scroll-building-a-scroll-driven-animated-grid/) | Grille épinglée qui se révèle en 4 phases | **Lenis `lerp: 0.08`, `wheelMultiplier: 1.4`** ; `scrub: true` ; bloc **425 vh** ; stagger 0,06 ; titre 0,7 s `power2.inOut` ; zoom 1 s `power3.inOut`, échelle 2,05 |
| 68 | [Infinite GSAP scroll gallery — Codrops](https://tympanus.net/codrops/2026/07/30/building-an-infinite-gsap-scroll-gallery-with-parallax-and-flip-transitions/) | Galerie infinie, parallax par vignette, Flip vers plein écran | **scrub 0,75 `power3.out`** ; Flip **1,2 s ouverture / 1 s fermeture `power4.inOut`** ; caractères stagger 0,01 (0,025 en galerie), lignes 0,06 ; vitesses parallax 0,8 / 1,15 / 1,3 |
| 69 | [Never Ending Story — Codrops](https://tympanus.net/codrops/2026/05/28/the-never-ending-story-building-a-seamless-infinite-scroll-experience-with-gsap-lenis/) | Scroll infini + snap | Lenis `infinite: true` ; snap `mandatory`, **0,9 s, easing `1 - (1-t)^4`** ; parallax −50 % → 50 % `scrub: true` ; `100svh` |
| 70 | [Thumbnail flow MotionPath — Codrops](https://tympanus.net/codrops/2026/06/04/creating-a-thumbnail-flow-animation-with-gsap-motionpath/) | Vignettes qui se déploient sur une courbe | 1,2 s `expo.inOut` ; stagger 0,02 (vignettes) / 0,045 (labels) ; `curviness 0.45` ; bouton 0,5 s |
| 71 | [Animated testimonial hero — Codrops](https://tympanus.net/codrops/2026/08/18/building-an-animated-testimonial-hero-using-the-gsap-timeline-and-dynamic-cms-data/) | Compteur « slot machine », collage de portraits, boucle 3D | `rotateX -90° → 0`, scale 0,7 → 1, perspective 1000 ; stagger images 0,08 / texte 0,035 ; `elastic.out` ; texte `y 110%` ; « don't count, slide » |
| 72 | [Good Fella Lab — guide SplitText 2026](https://lab.good-fella.com/blog/gsap-text-animation-splittext-guide) | 5 patterns texte | Caractères : 0,6 s, stagger 0,02, `expo.out`, y 40 ; **lignes masquées : 1 s, stagger 0,1, `expo.out`, `yPercent 110`** ; mots : 0,5 s, stagger 0,04, `power3.out`, y 20 + blur 4 px (pas sur mobile) ; scrubbé : `scrub: 1`, `ease: none` ; stagger total > 1 s = « on attend » |
| 73 | [Osmo — Masked Text Reveal](https://osmo-masked-text-reveal.webflow.io/) ([CodePen](https://codepen.io/osmosupply/pen/pvvKezw), valeurs via recherche) | Reveal masqué par lignes | **`CustomEase "osmo-ease" 0.625, 0.05, 0, 1` ; lignes 0,8 s, stagger 0,08** — la courbe osmo est celle qu'on retrouve chez LxL, Paul Kalkbrenner, Revelatio, Spyker |
| 74 | [GSAP SplitText — docs](https://gsap.com/docs/v3/Plugins/SplitText/) | Option `mask`, `autoSplit`, `onSplit` | Splitter après chargement des polices ; `aria-label` parent + `aria-hidden` enfants par défaut ; `revert()` |
| 75 | [GSAP ScrollTrigger — docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | scrub, pin | `scrub: 1` = « takes 1 second to catch up » ; `anticipatePin: 1` sur les grandes sections ; scroll lissé via `scrollerProxy` ou ScrollSmoother |
| 76 | [Lenis — README](https://github.com/darkroomengineering/lenis/blob/main/README.md) | Défauts | **`lerp 0.1`, `duration 1.2`, easing `1.001 - 2^(-10t)`, `wheelMultiplier 1`, `touchMultiplier 1`, `syncTouch false`, `syncTouchLerp 0.075`** ; intégration : `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add` + `lagSmoothing(0)` |
| 77 | [DEV — « Your scroll animations look amateur »](https://dev.to/thebitforge/your-scroll-animations-look-amateur-heres-the-gsap-lenis-setup-that-fixes-it-48ni) | Erreurs classiques | Deux boucles rAF séparées ; `smoothWheel` desktop seulement ; **`scrub: 1` plutôt que `true`** ; `ScrollTrigger.refresh()` après chargement ; ancres via `lenis.scrollTo` |

### 1.5 Références de principes (pas de site à analyser, mais des règles)

| # | Source | Ce qu'on retient |
|---|---|---|
| 78 | [Rauno Freiberg — Novelty](https://rauno.me/craft/novelty) | Règle **90/10** : 90 % familier, 10 % nouveau ; la nouveauté s'use avec la fréquence (l'animation d'un onboarding ne se rejoue pas) |
| 79 | [Rauno Freiberg — Invisible details of interaction design](https://rauno.me/craft/interaction-design) | Répondre pendant le geste, pas après un seuil ; interruptible ; pas d'animation sur ce qu'on fait 100 fois par jour |
| 80 | [Emil Kowalski — 7 practical animation tips](https://emilkowal.ski/ui/7-practical-animation-tips) / [Great animations](https://emilkowal.ski/ui/great-animations) | **< 300 ms** en UI, `ease-out` pour entrées/sorties, jamais depuis `scale(0)` (partir de 0,93+), `:active { scale: .97 }`, `blur(2px)` pour lisser un cross-fade, 180 ms paraît plus réactif que 400 ms, `transform`/`opacity` seulement |
| 81 | [Vercel — web-animation-design skill](https://github.com/vercel-labs/open-agents/blob/main/.agents/skills/web-animation-design/SKILL.md) | Micro 100–150 ms, UI 150–250 ms, modales 200–300 ms, **max 300 ms en UI**, sorties ~20 % plus courtes ; table d'easings (`expo-out (0.19,1,0.22,1)`, `quart-out (0.165,0.84,0.44,1)`, `cubic-in-out (0.645,0.045,0.355,1)`) ; spring bounce 0,1–0,3 ; blur ≤ 20 px |
| 82 | [Brad Holmes — What Apple gets right](https://www.brad-holmes.co.uk/web-performance-ux/why-most-scroll-animations-miss-what-apple-gets-right/) | Séparer motion de contenu (CSS léger) et motion graphique (vidéo) ; timing calé sur le récit, pas sur la hauteur des assets ; « si vous le remarquez, c'est gênant » |
| 83 | [Hon Tran — Best award-winning websites 2026](https://www.hontran.dev/blog/best-award-winning-websites-2026) | Trois piliers : direction artistique (un point de vue, pas un template décoré), motion chorégraphiée, **60 fps sur mobile milieu de gamme** ; « mid-7 » = plafond sans les trois |
| 84 | [925 Studios — AI slop web design guide](https://www.925studios.co/blog/ai-slop-web-design-guide) | Tells : Inter + dégradé violet, **« le même fade-in générique sur chaque élément »**, cartes identiques (padding, radius 16 px, hauteur), titres vagues, images trop lisses |
| 85 | [Annnimate — State of web animation 2026](https://annnimate.com/state-of-web-animation) | 91,7 % des pages mobiles ont une transition CSS, 18,4 % une lib JS ; 40 % des pages mobiles ont des animations non composées (saccades) ; `prefers-reduced-motion` > 50 % des sites mobiles |
| 86 | [MotionKit — Web animation trends 2026](https://motionkit.io/blog/web-animation-trends-2026) | Dépassé : entrées automatiques sur tout, smooth scroll qui « détourne » le scroll, preloaders décoratifs, vidéo hero par défaut ; 43 % des sites ratent l'INP 200 ms |
| 87 | [Josh W. Comeau — Scroll-driven animations](https://www.joshwcomeau.com/animation/scroll-driven-animations/) | `animation-range: entry / cover / contain`, `animation-fill-mode: backwards`, ~85 % de support, `linear()` pour des springs |
| 88 | [Utsubo — Best Three.js websites 2026](https://www.utsubo.com/blog/best-threejs-websites-2026) | Un seul objet hero rendu « avec du poids » (Oryzo), scroll = séquencement narratif (Cartier W&W, Shopify) ; discipline : instancing, lumière bakée |

**Total : 66 sites analysés (dont 30 SOTD/nominés de septembre 2026 et 22 case studies Codrops avec
valeurs), 11 tutoriels/docs chiffrés, 11 références de principes.**

## 2. Les 10 règles de rendu qui séparent « fluide et cher » de « IA et cheap »

Chaque règle : constat sourcé → nos valeurs → quoi changer.

**R1. Deux régimes de durée, pas un.** Les sites primés ont un régime **UI** à 150–320 ms (Apple 320 ms
×59, Vercel 150–200 ms, Huy Phan 320 ms, Stripe 300 ms, Emil/Vercel skill « max 300 ms ») et un régime
**mise en scène** à 0,6–1,2 s (illoca 0,6 s ×37, Flim/Osmo/Trionn 0,8 s, Good Fella lignes 1 s, MDE 1,2 s,
Unseen 1 s ×59). Chez nous, une seule variable `--motion-duration` (0,5–1,4 s selon la direction) sert
aux reveals **et** aux boutons/liens/cartes (`luxe` : `transition: background 1.4s`, `nuit` : 1,2 s sur
les fonds de boutons). Un bouton qui met 1,2 s à changer de couleur, c'est ça « pas fluide ».
→ Ajouter `--motion-ui: 0.22s` (0,18 s brut/signal, 0,32 s luxe) et l'utiliser pour tout ce qui répond à
un geste ; garder `--motion-duration` pour les entrées, plafonnée à **1 s** (luxe 1,4 s → 1 s, nuit 1,2 s
→ 1 s : Podium « ralentir » se fait par le scrub et les délais, pas par des transitions de 1,4 s).

**R2. Une courbe d'entrée, une courbe de déplacement, une courbe maison.** Les sites qu'on a lus
combinent une **out** pour ce qui apparaît (`(.16,1,.3,1)` chez Aspen/Lambert/Emotion/White Desert/
Stripe, `(.22,1,.36,1)` chez Huy Phan/Goodside/Boc, `(.25,1,.5,1)` ×40 chez Stripe) avec une **in-out**
pour ce qui se déplace ou se transforme (`(.4,0,.6,1)` ×122 chez Apple, `(.76,0,.24,1)` White Desert,
`(0.8,0,0,1)` ×54 chez 12 Studio, `power3.inOut` ×17 United Carriers, `expo.inOut` ×24 Unseen, MERSI
`expo.inOut`), et souvent une **courbe signature** (`osmo 0.625,0.05,0,1` chez LxL ×43 / Paul K / Revelatio
/ Spyker, `joe` ×61 chez illoca, `hero1/hero2/cascade` chez Noho, `circleDraw` chez Immersive Garden,
`(.26,1,.48,1)` unique chez Warm & Fuzzy). Chez nous : `--ease-out-expo` pour **tout** (reveal, stagger,
split, draw, rideau, flip-card, count-bar, digit-flip), et zéro in-out.
→ Ajouter `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)` (rideau, `data-horizontal`, accordéon Flip,
transitions) et `--ease-brand` **par direction** (ex. brut `(0.8,0,0,1)`, luxe `(0.625,0.05,0,1)`, pop
`(0.34,1.56,0.64,1)`, nuit `(0.16,1,0.3,1)`), utilisée par les reveals de titres. C'est ce qui donne à
chaque site une « main ».

**R3. Le scroll-lié se lisse à 1 s, pas à 0,5 s.** Les sections cinématiques tournent à `scrub: 1`
(Flim horizontal, Guignand, Good Fella) et jusqu'à 1,2–1,5 (illoca) ; le tuto galerie Codrops à 0,75 ;
la seule valeur basse observée est Horeca 0,3 pour une pile sticky (0,1 jugé trop sec) ; les docs GSAP
présentent `scrub: 1` comme la valeur type. Chez nous : 0,5 (`data-horizontal`), 0,6 (`data-scrub`,
`data-pin`, `data-draw-svg`), 0,8 (`data-text-fill`), `true` (`data-parallax`, `data-sticky-stack`).
→ `data-scrub`/`data-pin`/`data-horizontal`/`data-blur-scrub` à **1** par défaut (attribut
`data-scrub-lag="0.3"` pour les piles sticky), `data-parallax` à **0,5** (le `true` donne le côté
« collé à la molette » que le fondateur lit comme saccadé). Rien de scroll-lié sous 0,3.

**R4. Une section épinglée dure au moins 3 écrans.** Sticky Grid Scroll : 425 vh pour 4 phases ; Trionn :
371 frames pour une section services ; PX PUSH : un titre entre `top 90%` et `top 0%` ; Whiteout : le
scroll entier = l'altitude. Chez nous, `Geste.astro` (Forge) épingle **220 %** de hauteur pour 3 étapes
**et** 48 frames : chaque étape vit sur ~0,7 écran, la séquence défile deux fois plus vite qu'à Trionn
(qui, en plus, **lisse la frame courante à lerp 0,12** — nous dessinons la frame exacte, d'où l'effet
« ça saute »). C'est le « ça scroll ultra vite ».
→ `data-pin` ≥ **100 % par étape + 100 %** (3 étapes = 400 %), `data-frames` avec lissage de frame (voir
effet E5), et `data-pin-step` avec un fondu croisé 0,5 s in-out plutôt que le switch d'opacité actuel.

**R5. Lenis : lerp 0,06–0,1, molette ≤ 1 sur Windows, jamais sur mobile.** Valeurs lues : illoca 0,06,
Sticky Grid 0,08 (mais `wheelMultiplier 1.4` pour compenser), Noho 0,1, LxL 0,165 + 1,25, défaut 0,1 /
durée 1,2 s. Horeca et le guide DEV coupent Lenis sur tactile ; le README documente `syncTouch false`
par défaut. Nos valeurs (`lerp 0.09, wheelMultiplier 0.85`) sont dans la fourchette — le problème de
vitesse n'est donc **pas** Lenis mais R3/R4 (sections trop courtes, scrub trop sec) et R6.
→ Garder 0,09 / 0,85 ; vérifier que Lenis n'est jamais instancié sous `pointer: coarse` (il tourne
aujourd'hui dès que `data-smooth` est posé, hors `navigator.webdriver`) ; ajouter `autoToggle`/pause
quand un `<dialog>` ou le menu mobile est ouvert.

**R6. Reveal = masque de ligne pour les titres, fondu court pour le reste, jamais « tout monte de
24 px ».** Le 925 Studios liste « le même fade-in générique sur chaque élément » comme tell IA n° 1 côté
motion. Les sites primés révèlent les **titres** par lignes masquées (`yPercent 100–110`, 0,8–1 s, stagger
0,08–0,1 : Flim, Osmo, Good Fella, Kononenko « SplitText drives all text reveals », Driessen, HoY,
Revelatio) et le **corps** par une simple opacité 0,3–0,5 s (HoY `opacity .3s ease-out`, Goodside
`opacity 0.9s` séparé du `transform 1s`, Apple `StaggeredFadeIn`). Chez nous : Forge 33 `data-reveal`,
Finck & Fisch 51, Lemaire 52 — quasi tous en `translateY(24px)` + expo 0,9–1,2 s, plus 9–13 `data-stagger`.
→ `data-reveal` par défaut = **opacité seule, 0,5 s** ; `translateY` réservé à `data-reveal="up"` (12 px,
pas 24) ; titres `h1/h2` en `data-split="lines"` masqué (effet E1). Une section = **un** groupe animé
(titre + un bloc), pas cinq.

**R7. Stagger : 20–50 ms par élément de texte, 60–100 ms par carte, total ≤ 600 ms.** Valeurs : illoca
0,02 ×44 / 0,04 / 0,05 ; LxL 0,05 / 0,04 ; Noho 0,04 ; Love and Money 0,04 ; MERSI grille 0,05 ; Sticky
Grid 0,06 ; Flim lignes 0,1 ; Trionn images 0,08 ; Good Fella « > 1 s total = attente ». Chez nous : défaut
90 ms mais les sites posent 120–150 ms (Forge `data-stagger="150"`, `"130"`, `"120"` ×5 ; Lemaire 120 ×3,
140), et Finck & Fisch pose des `data-reveal-delay` de **1 100, 1 300, 1 500 ms**.
→ Défaut à **60 ms**, plafond total 600 ms conservé (déjà en place), `data-reveal-delay` plafonné à
**400 ms** (au-delà, l'élément arrive après que l'œil est parti — Vercel skill, Good Fella).

**R8. Survol : 150–320 ms, retour 20 % plus court, jamais > 1 s sauf zoom photo (0,8–1,2 s).** Apple
320 ms, Vercel 150–200 ms, Huy Phan 220–320 ms, Stripe 300 ms, Emil « 180 ms paraît plus réactif que
400 ms », sorties −20 % (Vercel skill). Chez nous : `.ff-hover-img` 0,35 s (bien), tilt 0,5 s aller / 0,8 s
retour (inversé : le retour devrait être plus court), `Pieces.astro` zoom image **1,4 s** et trait de
carte 700 ms, `Feu.astro` barre 700 ms.
→ Tilt 0,3 s / retour 0,25 s ; zooms photo ≤ 1 s `--ease-out-quart` ; tout autre survol ≤ 0,3 s.

**R9. Une seule boucle continue par écran, à vitesse lente (≥ 8 s par cycle, marquee 25–60 px/s).** HoY
`data-marquee-speed 30/45/60/90`, Paul K 25, Flim 10 s/boucle, United Carriers 12–30 s, Goodside soleil
16 s, Linear points 1,6–3,2 s en `steps()` (donc immobiles entre deux pas), Chems « rien ne boucle pour
décorer ». Chez nous : marquee 30 s par défaut (correct) mais **dans le hero** de Forge sur fond
`backdrop-blur`, en même temps que le parallax hero, le split et le bouton magnétique.
→ Un marquee n'est jamais dans le hero avec un autre effet continu ; `data-marquee` ralentit à 50 % au
survol plutôt que de s'arrêter net (pause = à-coup) ; vitesse exprimée en px/s (`data-marquee="40"`)
pour qu'un texte long et un texte court aillent à la même vitesse.

**R10. Reduced-motion et mobile sont des versions conçues, pas des `!important`.** Guignand « version
parallèle conçue », Yestalgia « durées/stagger/délais à zéro » + split par mots sur mobile, Good Fella
« pas de filtre blur sur Android », 4WIDE flou coupé et géométrie −50 % sur mobile, Horeca Lenis desktop
seulement, Shopify 4 tiers GPU, Hon Tran « 60 fps sur mobile milieu de gamme, sinon plafond ». Chez nous
le bloc `@media (prefers-reduced-motion)` est complet (bien), mais **mobile = desktop** : mêmes `data-tilt`
×8, `data-scrub` ×6, `blur(12px)` de `data-reveal="blur"`, `data-split="chars"`.
→ Sous 768 px : `data-reveal="blur"` → opacité, `data-split="chars"` → mots, `data-tilt`/`data-magnetic`/
`data-spotlight` inertes (déjà `pointer:fine` pour certains, à généraliser), `data-parallax` amplitude
÷ 2. Mesurer avec `ff lighthouse --mobile` avant/après.

Synthèse « à changer » dans `global.css` / `motion.ts` (ordre de gain) : R6 (reveal opacité + titres par
lignes), R3 (scrub 1), R4 (pin ≥ 400 % pour 3 étapes, lerp de frame), R1 (`--motion-ui`), R2
(`--ease-in-out` + `--ease-brand`), R7 (stagger 60 ms, delay ≤ 400), R8 (survols), R10 (mobile).

## 3. Les 12 effets absents ou partiels chez nous qui reviennent le plus

Par fréquence décroissante dans le tableau. Contraintes : GSAP + plugins gratuits, Lenis, OGL, dotLottie ;
pas de Three.js ni de lib payante.

**E1. Reveal de titre par lignes masquées** (lignes 1, 21, 38, 41, 45, 46, 47, 50, 51, 67, 72, 73 — 12
sites). Chaque ligne dans un conteneur `overflow: hidden`, `yPercent: 110 → 0`, 0,8–1 s, stagger 0,08–0,1,
`expo.out` ou courbe maison ; déclenché à `top 85–90%`. Technique : GSAP **SplitText** (gratuit, option
`mask: "lines"`, `autoSplit: true`, `onSplit`) ; repli subtle = notre découpage mots actuel. Coût : petit
(le plugin est déjà dans notre bundle rich). Métiers : tous — c'est le geste de base d'un hero
« cher » ; particulièrement ébéniste, architecte d'intérieur, avocat, photographe. Attribut :
`data-split="lines"` (+ `data-split-ease="brand"`).

**E2. Transitions de page continues** (lignes 4, 5, 12, 13, 15, 16, 21, 41, 47, 48, 55, 56, 58, 59 — 14
sites : Swup ×4, Taxi ×2, Barba ×3, View Transitions ×3, Flip image → hero ×3). Le geste le plus fréquent
après E1 : rideau/masque 0,5 s `power2.inOut` (Flim) ou la photo de la liste qui **devient** le hero de
la page projet (MERSI Flip 1,2 s `expo.inOut`, Podium, Codrops galerie 1,2 s `power4.inOut`). Technique :
Astro `<ClientRouter />` (déjà câblé par `site.transitions`) + `view-transition-name` pour le morph
d'image, + GSAP Flip pour le repli ; audit des `<script>` inline des sections requis (limite déjà notée
dans `docs/ANIMATIONS.md`). Coût : **gros** (l'audit), puis petit par effet. Métiers : ceux qui ont des
pages de réalisations (menuisier, paysagiste, tatoueur, photographe, architecte). Attributs :
`data-view-transition="hero"` (déjà proposé) et `data-transition="wipe|fade"` sur `<html>`.

**E3. Curseur custom avec étiquette** (lignes 12, 16, 25, 32, 34, 37, 38, 41, 44 — `cursor` ×40 à ×161
dans le CSS de 9 sites ; Paul K `data-cursor-text="play"`). Un point qui suit le pointeur (lerp 0,15),
qui grossit sur les liens et affiche un mot (« Voir », « Lire », « Jouer ») sur les médias. Technique :
un `<div>` fixe + `pointermove` passif + `gsap.quickTo` ; `pointer: fine` seulement ; `cursor: none` sur
le body uniquement quand l'élément est visible. Coût : petit. Métiers : galerie/portfolio, restaurant
(menu), tatoueur, photographe, vidéaste ; jamais sur un site « service » (plombier, avocat). Attributs :
`data-cursor` sur `<html>`, `data-cursor-text="Voir"` sur les cibles.

**E4. Effets pilotés par la vélocité de scroll** (lignes 16, 52, 54, 60 + notre `data-marquee-velocity` —
skew/étirement/flexion des images et titres, rotation du logo). HAOQI : attaque 25 ms, relâche 175 ms,
normalisé à 800 px/s, force max 0,06 ; Roman J-E : amplitude 0,009 ; PX PUSH : `target *= 0.9`, lerp 0,16.
Technique : `lenis.on('scroll', ({velocity}) => …)` → `gsap.quickTo(el, 'skewY')` avec clamp ±4°, retour
à 0 quand la vélocité tombe. Coût : petit. Métiers : directions brut/pop/neon (galerie de réalisations,
bandeau de mots) ; à proscrire en luxe/pierre. Attribut : `data-velocity-skew="4"` (degrés max).

**E5. Séquence produit lissée et longue (frames avec lerp, ou vidéo scrubbée)** (lignes 45, 52, 66, 82 +
Whiteout). Trionn lisse la frame courante (`lerp 0.12` vers la cible) ; Apple est passé au **video
scrubbing** (`data-video-id`, un seul fichier compressé, `currentTime` lié au scroll, image fixe sur
petits écrans — Brad Holmes). Chez nous `data-frames` dessine la frame exacte à chaque tick (d'où les
sauts) sur un pin trop court (R4). Technique : ajouter un lerp de frame dans `frameSequences()` (une valeur
flottante suivie en rAF, arrondie au dessin), et une variante `data-video-scrub="/anim/x.mp4"` (vidéo
`muted playsinline preload="auto"`, `currentTime = progress × duration` en rAF, poster en repli et sous
`pointer: coarse`). Coût : moyen. Métiers : ferronnier, ébéniste, horloger, couvreur (pièce qui tourne ou
qui se monte) — déjà la cible de `ff sequence`/`ff animer`. Attributs : `data-frames-lerp="0.12"`,
`data-video-scrub`.

**E6. Grille parallax « éditoriale » à vitesses signées** (lignes 8, 15, 21, 22, 28, 41, 43 — Driessen
`data-scroll-speed -1/-0.5/-20`, HoY 2/4/15/−2/−4, Trevor Noah ±0,05, Spyker `data-parallax-media-*` sur
12 colonnes, Paul K `-12 → 8`). Deux ou trois photos d'un même bloc qui glissent à des vitesses
différentes, dont une **à contresens**. Chez nous `data-parallax` accepte un coefficient positif et
`data-parallax-depth` est réservé au hero. Technique : autoriser les valeurs négatives et une plage en
pourcentage (`data-parallax="-12,8"` = de −12 % à +8 % de la hauteur de l'élément) ; scrub 0,5 (R3).
Coût : petit. Métiers : paysagiste, photographe, architecte, boulangerie (duo ensemble + détail, move 25
de `references.md`). Attribut : `data-parallax="-12,8"`.

**E7. Wipe scrubbé avec échelle (image ou section qui « s'ouvre » au scroll)** (lignes 20, 25, 48, 55, 65
— Guignand `inset 20%/40% → 0` + `scale 1.3 → 1` à `scrub: 1`, Forge Automotive `clip-path` ×13, MERSI
slider `clip-path: inset()`, Stripe `clip-path` ×57). Chez nous `data-reveal="mask"` fait ce mouvement
**une fois, au seuil**, en 0,9 s ; la version scrubbée (l'image se découvre à mesure qu'on descend) n'existe
pas. Technique : étendre `data-scrub` avec `clip=20/40` (inset vertical/horizontal de départ) — même code
que `scale=`/`blur=`. Coût : petit. Métiers : rénovation, paysagiste, architecte (la réalisation qui se
dévoile), restaurant (la salle). Attribut : `data-scrub="clip=20/40,scale=1.3"`.

**E8. Intro chorégraphiée avec courbe maison** (lignes 1, 4, 6, 11, 12, 13, 16, 24, 38, 45, 53 — 11 sites
avec preloader/intro ; Noho `hero1/hero2`, Trionn délai 1,2 s puis stagger 0,08, Goodgrowth compteur
~1,3 s). Ce n'est pas le preloader qui compte (MotionKit le classe « dépassé ») mais la **timeline** :
rideau → titre par lignes → sous-titre → CTA à des offsets fixes (0 / 0,25 / 0,45 / 0,6 s) sur une courbe
signature. Chez nous : `.ff-curtain` 1,1 s puis `data-stagger="120"` linéaire sur le hero. Technique :
une timeline GSAP `data-intro` lue sur le hero, offsets en attribut, `--ease-brand` (R2) ; sans GSAP
(subtle), les mêmes offsets en `transition-delay`. Coût : petit-moyen. Métiers : tous en `rich`. Attribut :
`data-intro="0,0.25,0.45,0.6"` sur le hero, les enfants dans l'ordre du DOM.

**E9. Pile sticky avec rotation et scrub court** (lignes 8, 20, 41, 50 + Horeca comme référence chiffrée :
scrub 0,3, cartes qui tournent de ±2° et rétrécissent, fondu à la sortie ; HoY sticky ×283). Chez nous
`data-stack` fait scale 0,94 / y −3 % / brightness sans rotation ni fondu, en `scrub: true`. Technique :
paramètres `data-stack="rotate=2,scale=0.94,fade=1"` et `data-scrub-lag="0.3"`. Coût : petit. Métiers :
process en 3–5 étapes (auto-école, ostéo, dentiste — cf. `ANIMATION-PAR-METIER.md`), offres/tarifs.

**E10. Scramble/décodage au survol et sur la navigation** (lignes 52, 54, 55, 58, 47 — Chems sur la nav,
Guignand scramble + wipe 0,6 s, HAOQI ticker 40 ms, Flim caractères qui clignotent 0,1 s ×2 au survol,
Bisous lettres aléatoires). Chez nous `data-scramble` ne joue qu'à l'entrée. Technique : mode
`data-scramble="hover"` (ScrambleText en rich, la fonction vanilla existante en subtle, 300–400 ms, jeu de
caractères = majuscules + ponctuation comme Guignand). Coût : petit. Métiers : directions signal/neon/brut
(informaticien, électricien, studio) ; à proscrire pour les professions réglementées.

**E11. Mouvement idle (respiration, rotation lente, points en `steps()`)** (lignes 7, 42, 45, 51, 53, 63
— Warm & Fuzzy « idle animations », Goodside soleil 16 s, Goodgrowth CD auto-rotation, Yestalgia
satellites, Trionn dérive sinusoïdale, Linear points 1,6–3,2 s `steps(1,end)`). Un seul élément (sceau,
badge « depuis 1987 », pictogramme) qui vit quand la page est immobile — c'est ce qui fait « vivant » sans
faire « animé ». Technique : CSS `@keyframes` 8–20 s, `animation-play-state` piloté par IntersectionObserver
(pause hors écran), `steps()` pour un rendu « mécanique ». Coût : très petit. Métiers : boulangerie
(sceau), horloger, brasseur, tatoueur, ferronnier (étincelle), garage (voyant). Attribut :
`data-idle="spin|float|breathe|steps"` (+ `data-idle-duration="12s"`).

**E12. Rail de chapitres / progression latérale** (lignes 19, 55, 63, 66, 69 — Whiteout « altitude rail »,
Guignand cercle SVG 0 → 100 %, Apple `chapternav`, Never Ending Story snap 0,9 s). Une colonne fixe qui
indique où on en est dans le récit, à la place de la barre de progression en haut. Technique : `data-chapters`
sur `<main>` → liste des `<section id>` avec `aria-label`, état actif par IntersectionObserver (threshold
0,5), trait qui se remplit via `animation-timeline: scroll()` là où supporté ; option `data-snap="proximity"`
(CSS `scroll-snap-type: y proximity`, jamais `mandatory` sur un site vitrine — Never Ending Story le
réserve à une expérience). Coût : petit (chapitres), moyen (snap + Lenis). Métiers : landing mono-page à
5–7 sections (le format standard de l'atelier), ostéo/dentiste « le rendez-vous minute par minute ».

Bonus hors top 12, à garder en tête : transition **pixelisée/dither** (Paul K, PX PUSH, Goodgrowth,
Guignand, Vivid) faisable avec notre chunk OGL (`data-hover-distort="pixel"`) ; logo qui se **recompose**
selon la mise en page (Obys) ; **fausse extrusion** de titre par duplication de caractères (Yestalgia, CSS
pur) ; police **variable** animée (Pensatori, Emotion — `font-variation-settings` au survol, 320 ms).

## 4. Ce qu'on fait mal aujourd'hui — trois constats

**1. Tout bouge, donc rien ne bouge.** Sur nos trois captures, chaque bloc porte un `data-reveal` ou un
`data-stagger` : 33 + 13 sur Forge, 51 + 9 sur Finck & Fisch, 52 + 11 sur Lemaire, tous en fondu + montée
de 24 px sur la même courbe expo, plus 7–8 `data-tilt`, 6 `data-scrub`, 3 `data-text-fill`, 6–7 marquees.
Forge cumule dans **un seul écran de hero** un parallax d'image, un split de titre, un stagger, un bouton
magnétique et un marquee sur fond flouté, puis enchaîne une séquence d'images épinglée, une section
`data-text-fill` et un collage `mask` + `tilt` + `scrub` — quatre « feux d'artifice » là où
`docs/CONVENTIONS.md` règle 16 en tolère un. C'est exactement le tell n° 1 du guide 925 Studios (« le
même fade-in générique sur chaque élément ») et l'inverse de Kononenko (« l'interaction est bien plus
forte entourée de simplicité »), de Rauno (90 % familier / 10 % nouveau) et d'Obys (« le mouvement
explique, il ne décore pas »). Chez les SOTD, la fiche Awwwards met en avant **3 à 6 éléments animés** par
site ; nous en avons 3 à 6 par section. Correctif : R6 + R7 (opacité seule par défaut, un groupe par
section, titres par lignes), et une passe sur `sites/*/sections/*.astro` pour retirer tout `data-reveal`
posé sur un paragraphe, une puce ou un pied de carte.

**2. Le scroll est mécaniquement trop court et trop sec.** `Geste.astro` épingle 220 % de hauteur pour
trois étapes et 48 frames dessinées frame exacte à chaque tick, `data-horizontal` lisse à 0,5, `data-scrub`
à 0,6, `data-parallax` à `true` : chaque cran de molette Windows (100 px) déplace la scène d'un coup, et
la séquence entière est consommée en trois crans. Les références font l'inverse : 425 vh pour quatre
phases (Sticky Grid), lerp 0,12 sur la frame courante (Trionn), `scrub: 1` à 1,5 (Flim, Guignand,
illoca), snap à 0,9 s (Never Ending Story), Podium « ralentir, c'est ce qui crée l'impact ». Sur la
capture Forge, le spacer du pin apparaît comme ~2 000 px de fond noir vide entre « On chauffe. » et « Le
feu en quatre temps » : même en capture statique, la section signature ressemble à un trou. Nos valeurs
Lenis (0,09 / 0,85) sont bonnes ; ce sont R3 et R4 qui manquent. Correctif : scrub 1, pin ≥ 400 % pour
trois étapes, lerp de frame, fondu croisé des `data-pin-step`.

**3. Une seule courbe, une seule durée, et un « premium sombre » de série.** Toute l'animation partage
`--ease-out-expo` et `--motion-duration` (0,9–1,4 s), y compris les survols : un bouton `luxe` change de
fond en 1,4 s, un tilt revient en 0,8 s, une photo de `Pieces.astro` zoome en 1,4 s, Finck & Fisch pose des
délais de 1,1 à 1,5 s. Apple règle ses micro-états à 320 ms sur une in-out, Vercel à 150–200 ms, Emil et
le skill Vercel plafonnent l'UI à 300 ms ; les sites primés ont chacun une courbe **maison** (osmo, joe,
hero1/hero2) qu'on ne retrouve nulle part ailleurs — c'est leur signature, et nous n'en avons aucune par
direction. À cela s'ajoute, sur Lemaire et Finck & Fisch, la recette que les guides 2026 décrivent comme
« template IA » : fond bleu nuit/noir, accent doré/beige, eyebrows mono en capitales centrées au-dessus de
chaque titre (10 sur Lemaire — règle « eyebrow au-dessus du h1 » d'Impeccable), cartes identiques en
grille, titre blanc + mot-clé coloré ; l'animation uniforme vient confirmer l'impression de série.
Correctif : R1 (`--motion-ui` 0,2–0,3 s), R2 (`--ease-in-out` + `--ease-brand` par direction), R8
(survols ≤ 300 ms), et côté design, réserver l'eyebrow à un titre sur trois et varier la hauteur des
cartes — hors périmètre de ce document mais indissociable du « ça fait IA ».

## 5. Sources consultées

Galeries : [Awwwards animation](https://www.awwwards.com/websites/animation/), [Awwwards scrolling](https://www.awwwards.com/websites/scrolling/),
[Awwwards Sites of the Day](https://www.awwwards.com/websites/sites_of_the_day/), [Awwwards Three.js](https://www.awwwards.com/websites/three-js/),
[Awwwards GSAP](https://www.awwwards.com/websites/gsap-animation/), [Siteinspire](https://www.siteinspire.com/), [Minimal Gallery](https://minimal.gallery/),
[Dark Mode Design](https://www.darkmodedesign.com/), [One Page Love](https://onepagelove.com/), [GSAP showcase](https://gsap.com/showcase/),
[Lenis](https://lenis.dev/), [Codrops case studies](https://tympanus.net/codrops/tag/case-study/), [Codrops tutorials](https://tympanus.net/codrops/category/tutorials/).
Non exploitables : Godly (→ recent.design), Lapa.ninja (403), Land-book (403).

Toutes les URL de sites, fiches et case studies sont dans les tableaux ci-dessus (une par ligne). Relevés
bruts (HTML/CSS/JS, easings, durées, options Lenis/GSAP) dans le scratchpad de session, non commités.

*Recherche effectuée le 20 septembre 2026. Les valeurs lues dans des bundles minifiés sont celles
présentes dans le code livré ce jour-là ; les fiches Awwwards et les case studies Codrops sont datées dans
chaque ligne.*
