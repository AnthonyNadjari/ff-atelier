# Benchmark : sites modèles, techniques de mouvement (octobre 2026)

Objectif : extraire des **mécanismes concrets** (hero, animations signature, déclencheurs, timings, easing, persistance nav/CTA, micro-interactions, preuve, mobile, perf) de sites réputés pour leur motion, pour le site Finck & Fisch (studio de 2 personnes, thème sombre chaud, Astro + GSAP + Lenis, objectif : réservations d'audit gratuit).

Méthode (9 octobre 2026) : HTML brut récupéré par `curl` et grep des bibliothèques/attributs ; pour Lando Norris, le bundle JS OFF+BRAND (1,4 Mo) a été grep-é pour les valeurs `ease`/`duration`/`stagger`/`start`. Captures Chrome headless 1440x900 (`playwright-core`) : premier écran puis après ~1,2 écran de molette (`modeles/<nn>-<nom>-hero.jpg` et `-scroll.jpg`). Une sonde JS a compté scripts, poids transféré, canvas/vidéos, éléments fixes, attributs `data-*` et classes d'animation. Les durées exactes ne sont lisibles que quand le code est en clair (Lando) ; ailleurs, c'est l'observation du rendu et des classes.

Sites retirés ou remplacés :
- **analogue.agency** : domaine parqué chez GoDaddy (« à vendre, 1 500 $ »). Retiré.
- **bogdan.design** : c'est `&bogdan`, un cabinet d'architecture (WordPress, carrousel de photos de 3 Mo chacune, 11 Mo au chargement, aucune animation). Ce n'est probablement pas le site visé. Gardé comme contre-exemple de poids seulement.
- **apple.com/mac-pro** redirige vers `/mac/` (la page Mac Pro n'existe plus). Remplacé par **apple.com/macbook-pro/** (capture 12), qui porte les mécanismes recherchés (séquences d'images au scroll, sections épinglées).

---

## Fiches

### 01. Lando Norris (OFF+BRAND) : https://landonorris.com
Captures : `01-landonorris-hero.jpg`, `01-landonorris-scroll.jpg`.
- **Stack** : Webflow + bundle maison OFF+BRAND (1,4 Mo, chargé depuis `assets.itsoffbrand.io`) = **GSAP + ScrollTrigger + SplitText + Lenis** (`html.lenis`, `css-lenis`) + **Rive** (17 `data-rive-*`, machines d'état) + WebGL (orbit controls, marquee GL). 6 scripts externes + 4 inline, 21 canvas, 85 SVG. `prefers-reduced-motion` : absent. Un seul `matchMedia("(hover: none), (pointer: coarse)")` : le mobile est traité par **capacité tactile**, pas par largeur.
- **Hero** : portrait plein cadre sur fond crème, casque en **Rive** superposé au visage (le casque réagit au curseur : formes « blob » qui glissent, cf. designrush). Nav : logo à gauche, monogramme au centre, **« STORE » jaune fluo + burger à droite, fixes**. En bas à gauche un **encart « Next race » façon ticket** (Singapore GP, « McLaren F1 since 2019 ») : la preuve est une donnée vivante, pas un slogan.
- **Valeurs mesurées dans le bundle** : `ease:"power2.out"` ×36 (le défaut), `power2.inOut` ×17, `expo.inOut` ×12, `power3.out` ×10, `expo.out/in` ×5, `elastic.out(1, 0.75)` ×5 (boutons/rive), `back.inOut` ×2. Durées : **0,5 s** ×24, **0,6 s** ×14, 0,3 s ×12, 1 s ×8, 2 s ×18 (boucles/marquee), 1,5 s ×6. **Stagger de texte : 0,015 à 0,02 s par caractère** (`char`, `line`, `high-line-reveal`, `text-clip-w`), `stagger:{amount:0.015*B.length}`. Déclencheurs ScrollTrigger : `start:"top bottom"` ×13 (dès l'entrée), `"top 90%"` ×7, `end:"bottom top"` ×7, `"top top"` ×2 (pin). 57 occurrences de `clipPath` : les révélations se font **au masque**, pas à l'opacité.
- **Signatures** : (1) passage **clair → sombre** par section épinglée (`sticky-track-theme-change`, `data-nav-theme-target`) : la nav change de thème en même temps ; (2) **marquee double** serif italique + grotesque (« …OME WE D… / A BRITISH… ») derrière un portrait N&B et une **signature manuscrite fluo** tracée (SVG, `marquee-signature-w`) : le gimmick a une raison (sa signature) ; (3) **pin horizontal** (`horizontal-pin-wrap/spacer/sticky`) pour la grille des casques, `helmet-grid-item-reveal-img`. Marquee à vitesse liée au scroll (`data-marquee-scroll-speed`, `lenis.velocity`).
- **Scroll** : natif + Lenis (scrollY mesuré 1080 après 9 crans). Pas de transition de page visible ; `transitions-rive-isolate.js` sert les transitions Rive isolées.
- **Perf** : hero sans vidéo (0 `<video>`, portrait image + Rive). Streams vidéo `data-video-stream` plus bas, en lazy et au survol (`data-stream-hover`).
- **Gimmicks IA si copiés** : serif italique géante en marquee, signature manuscrite fluo, casque Rive au curseur. Chez lui c'est son identité ; sur un studio, ça sonne faux.

### 04. 27b : https://27-b.com
Captures : `04-27b-hero.jpg`, `04-27b-scroll.jpg`.
- **Stack** : **Framer** (Framer Motion) + **Lenis** (`lenis`, `lenis-autoToggle`), 3 scripts externes. 6 `<video>` (1,3 Mo pour la première), 2,6 Mo au chargement. `prefers-reduced-motion` présent (Framer). `data-framer-cursor`, `data-framer-appear-animation`.
- **Hero** : page blanche, **wordmark « 27b » géant** (≈ 400 px), nav gris clair 5 items en haut, **« Scroll Now. ↓ »** en bas à gauche. Zéro phrase. Le pitch arrive après les deux premiers projets.
- **Signature** : au scroll, chaque projet est une **planche plein écran** (image/vidéo 4:5 centrée, bords noirs) avec logo client en aplat couleur ; les cartes s'enchaînent comme un carrousel vertical. Le texte « 27b is an independent creative studio… Learn more » est intercalé en 3e position.
- **Scroll** natif + Lenis. CTA : « Contact » dans la nav seulement.
- **Preuve** : les projets eux-mêmes (i-D, Warner Bros, A24/NEON), pas de logos.
- **Gimmicks IA** : wordmark géant en hero sans phrase (ne vend rien pour un artisan), « Scroll Now ».

### 05. Trueform : https://trueform.agency
Captures : `05-trueform-hero.jpg`, `05-trueform-scroll.jpg`.
- **Stack** : Framer (Motion), 4 scripts externes, **884 Ko** au total, 0 vidéo, 0 canvas. `prefers-reduced-motion` présent. Seul attribut : `data-framer-appear-animation` (apparitions au chargement/entrée, fade + léger translateY d'après le rendu).
- **Hero** (le plus proche de notre besoin) : badge « Official Pro Agency Partner of Framer » → H1 2 lignes → sous-titre → **2 CTA : « Book an intro call » (plein noir) + « Our Services » (contour)** → filet → **bande de logos « Shipping sites used by millions. »** → grille de cas (grandes vignettes, nom + type de prestation). Tout tient dans le premier écran.
- **Signature** : une **pilule fixe en bas de page « Speak to us / Email or book a call »** avec deux ronds (mail, calendrier) qui reste sur **toute** la page, footer compris (capture scroll). Nav blanche sticky avec « Contact » noir. La réservation est un lien **cal.com 15 min avec le fondateur**.
- **Preuve** : logos + 8 cas + 7 citations nommées + prix Framer 2025 ; footer avec wordmark géant flouté en bas.
- **Scroll** natif. Micro-interactions sobres (survol boutons). Pas de transition de page.
- **Gimmicks IA** : badge-pilule au-dessus du H1, boutons pilule, bande de logos gris. Fonctionnels mais signés « template SaaS ».

### 06. Temper Studio : https://temper.studio
Captures : `06-temper-hero.jpg`, `06-temper-scroll.jpg`.
- **Stack** : Framer, 6 scripts. **Vidéo hero MP4 de 17,7 Mo** (18,5 Mo au chargement) : contre-exemple de perf.
- **Hero** : vidéo plein cadre (mains, bouteille de cidre), **question** en serif centrée (« Ever wondered what cider and… ») + un bouton vert « Let's find out » ; nav en **onglets translucides** à droite (verre dépoli). Une étiquette produit flotte en haut à gauche.
- **Signature** : au scroll, grille produits sur fond crème (3 objets, nom + prix), puis manifeste serif gros corps ; CTA jaune « Read more about us → » **collé en bas** et persistant.
- **Preuve** : aucune, c'est une boutique. Mobile : vidéo probablement remplacée (attribut Framer), non vérifié.
- **Gimmicks IA** : question rhétorique en hero, nav verre dépoli.

### 07. Apple /mac/ (redirection de /mac-pro) et 12. Apple MacBook Pro : https://www.apple.com/macbook-pro/
Captures : `07-apple-macpro-hero.jpg` (page /mac/), `12-apple-macbookpro-hero.jpg`, `12-apple-macbookpro-scroll.jpg`.
- **Stack** : maison (pas de GSAP), 16 scripts externes sur MBP, 4,7 Mo dont **hero MP4 1,6 Mo via hls.js**, 14 `<video>`, page de **42 000 px** de haut. Attributs lisibles : `data-frame-animation`, `data-reverse-frame-animation` (séquences d'images au scroll), `data-anim-keyframe`/`-2`/`-3`, `data-anim-direction`, `data-staggered-item`, `data-anim-lazy-image`, `data-scroll-gallery`, `data-chevron-animate`. Classes : `sticky-container`, `pin-center`, `large-pin-top-left`, `mask-container`, `staggered-start`, `marquee` (ici = le hero, vocabulaire Apple).
- **Hero** : fond noir, portable entrouvert en vidéo lente (≈ 6-8 s, boucle unique), titre 2 lignes avec **dégradé bleu-glacier sur le mot clé**, prix + **« Buy »** dans une capsule. **Local-nav sticky « MacBook Pro | Overview / Tech Specs / Compare / Buy »** dès qu'on passe le hero (capture scroll) : le CTA d'achat ne quitte jamais l'écran.
- **Signatures** : (1) **sections épinglées à séquences d'images** (`data-frame-animation`, scrub) ; (2) **galerie sticky horizontale** avec **pagination à points + bouton pause** (contrôle utilisateur de l'animation, capture scroll) ; (3) fondus échelonnés `StaggeredFadeIn` sur /mac/.
- **Scroll** natif (pas de smooth scroll), tout est scrub. `prefers-reduced-motion` absent du HTML mais bouton pause partout.
- **Gimmicks IA** : dégradé sur mot du titre, capsules de prix, cartes noires arrondies géantes.

### 08. The Boat (SBS) : https://www.sbs.com.au/theboat/
Captures : `08-sbs-theboat-hero.jpg`, `08-sbs-theboat-scroll.jpg` (identiques : rien ne bouge sans clic).
- **Stack** (2015) : **THREE.js + CreateJS/SoundJS + TweenMax** dans un `main.js` de 1,2 Mo, 1 canvas, 5 Mo (dont 2,1 Mo d'audio OGG, images PNG 900 Ko). Modernizr/Detectizr pour la détection.
- **Hero** : écran noir, **pluie en particules dessinées** (canvas), « CLICK TO START » manuscrit, « This site uses audio, headphones are recommended ». **Scroll totalement hijacké** (scrollY reste 0) : c'est une roman graphique chapitré, navigation par scroll/clic à l'intérieur du canvas.
- **Leçons** : seul site avec une **porte d'entrée explicite** (clic) qui justifie l'audio et le mode plein écran ; parallaxe multi-couches dessinée à la main (fog-pot.png, bg.png). Mobile : `user-scalable=no`, `width=device-width` « pour déclencher la rastérisation GPU » (commentaire dans le HTML).
- **À ne pas copier** : scroll hijacké, « click to start », audio. Pour un site d'artisan, c'est un mur.

### 09. Linear : https://linear.app
Captures : `09-linear-hero.jpg`, `09-linear-scroll.jpg`.
- **Stack** : Next.js, **5 scripts externes, 34 Ko transférés au chargement initial** (le plus léger du panel ; tout le reste en lazy). `prefers-reduced-motion` présent. Classes parlantes : `titleLine` (titre révélé ligne par ligne), `grain`/`grainSubtle`/`grainOverlay`, `glow`/`edgeGlow`/`fixedGlowBgRight`, `splitButton`/`splitSegment`/`splitDivider`, `mobileMarqueeWrapper` (marquee **seulement** sur mobile), `keyline`, `gridlines`, `charRemoved`/`charAdded` (diff de code animé).
- **Hero** : fond #08090a, H1 2 lignes révélé ligne par ligne (≈ 0,6 s, décalage ≈ 0,1 s/ligne), sous-titre, **lien « New  Loops → »** à droite au lieu d'un gros CTA ; la **capture produit** en dessous, bord supérieur arrondi, **dégradé de fin de carte** vers le fond (capture scroll : la carte se fond dans le noir). Nav sticky noire avec « Log in / Sign up » (pilule blanche).
- **Signatures** : (1) **halo (glow) fixe en arrière-plan** derrière le produit ; (2) **bande de logos nue** (OpenAI, Vercel, Figma, Cursor…) sous un libellé monospace « POWERING THE COMPANIES BUILDING THE FUTURE » ; (3) titre de section **à deux tons** (blanc puis gris pour la suite de la phrase) ; (4) figures « FIG 0.1 / 0.2 » en filaire isométrique, étiquettes monospace.
- **Scroll** natif (`body overflow hidden` + `html auto`). Transitions de page : non visibles.
- **Gimmicks IA** : grain, glow, libellés monospace en capitales espacées, titre bicolore. C'est **le** vocabulaire que les générateurs recrachent.

### 10. Vercel : https://vercel.com
Captures : `10-vercel-hero.jpg`, `10-vercel-scroll.jpg`.
- **Stack** : Next.js, **76 scripts externes + 30 inline**, 1,7 Mo, 1 canvas. Tailwind : `motion-safe:animate-marquee` avec `[--marquee-speed:50s]` et `[--marquee-gap:48px]` (marquee CSS pur, désactivé en reduced-motion), `ease-linear`, `data-skip-transition`. Nav `sticky top-0`.
- **Hero** : fond blanc, H1 2 mots (« Agentic Infrastructure »), 2 CTA pilule (noir plein + contour), **triangle noir avec halo blanc** au centre : zone **« Drop to deploy »** (on peut y déposer un dossier, texte lu par la sonde), 3 lignes d'arguments à droite. Bande de logos en bas de l'écran (Meta, OpenAI, SpaceX…).
- **Signatures** : (1) **études de cas en bento** : logo client 3D (Notion) + maquette produit + phrase « Notion powers millions of agent conversations daily on Vercel. » avec **mot-clé en noir, reste en gris** + liste de 4 features (capture scroll) ; (2) marquee CSS 50 s ; (3) `passport-book-glow` (dégradé arc-en-ciel sur un objet).
- **Scroll** natif. Micro-interactions : `group-hover:underline`, `focus-visible:outline-2` partout (accessibilité clavier soignée).
- **Gimmicks IA** : triangle à halo, dégradés arc-en-ciel, bento à logos 3D.

### 11. Stripe : https://stripe.com (→ /fr)
Captures : `11-stripe-hero.jpg`, `11-stripe-scroll.jpg`.
- **Stack** : Next.js, **80 scripts** (le plus lourd en nombre), 1,4 Mo, **5 canvas** (le dégradé animé du hero est un canvas WebGL), **barba.js** présent (transitions de page), `lazy-animation` / `lazy-animation--loaded` (les graphiques ne s'animent qu'une fois visibles), `logo-carousel__marquee`, `stats-animation-gradient__gradient--pre-dawn/sunrise/daytime/dusk/sunset/night` (dégradé qui **change de phase avec le scroll**), `bento-dialog-reveal`, `hero-section__fullbleed-line--top/bottom`.
- **Hero** (non capturé : la capture hero montre déjà un **bento ouvert en modale**, « Acceptez et optimisez les paiements… » avec croix, parce que la page a mémorisé un état) : dégradé canvas incliné pleine largeur, H1, formulaire e-mail inline + CTA violet.
- **Signatures** : (1) **cartes bento qui s'ouvrent en modale plein cadre** (`bento-dialog-reveal`) avec maquette téléphone + **chiffre géant en dégradé orange « 3,8 % »** ; (2) **graphiques produit animés à l'entrée** (`fraud-and-risk-graphic__chart-bars`, `authorization-graphic`) ; (3) dégradé « heure du jour » lié au scroll dans la section chiffres ; (4) marquee de logos.
- **Scroll** : `html overflow hidden`, body scrolle (conteneur), natif. **Transitions de page barba.js**.
- **Preuve** : logos en marquee, chiffres (135+ devises, 99,999 %), citations grands comptes.
- **Gimmicks IA** : dégradé violet-orange incliné, chiffre géant en dégradé, coches colorées, bento.

### 03. &bogdan (contre-exemple) : https://www.bogdan.design
Capture : `03-bogdan-hero.jpg`. WordPress, carrousel plein cadre de photos aériennes de **3 Mo chacune**, 11 Mo au chargement, nav fixe blanche, zéro animation. Montre ce qu'un site « beau par les images » coûte en poids quand rien n'est redimensionné.

---

## Synthèse : les 8 techniques à adopter (studio 2 personnes, sombre chaud, Astro + GSAP + Lenis, objectif : réservation d'audit gratuit)

Ordre = rapport bénéfice/risque. Les valeurs viennent de ce qui est lisible (Lando : code en clair ; les autres : rendu + classes).

1. **Le CTA de réservation ne quitte jamais l'écran** (Trueform, Apple MBP, Temper). Trueform : pilule fixe en bas, centrée, « Parlez-nous / Email ou réservez un appel » + 2 icônes, présente **jusque dans le footer**. Apple : local-nav sticky avec « Buy » qui apparaît quand le hero sort (ScrollTrigger `start:"bottom top"` sur le hero, toggleClass). Pour nous : pilule « Réserver mon audit gratuit » qui **apparaît après le hero** (le hero a déjà son bouton), translateY 16 px → 0 + opacité, `power2.out` 0,4 s, cachée quand le formulaire de réservation est visible.
2. **Hero qui tient en un écran et vend** (Trueform) : badge de légitimité (sans pilule) → H1 2 lignes → 1 phrase → **2 CTA (plein + contour)** → filet → preuve. Révélation au chargement par **lignes** (Linear `titleLine`, Lando `line`) : clip-path ou translateY, **0,6 s `power3.out`, décalage 0,08-0,1 s/ligne**, boutons à +0,3 s. Pas de SplitText par caractère (Lando le fait avec stagger 0,015 s, mais c'est le signe « agence motion »).
3. **Révélation au masque plutôt qu'au fondu** (Lando : 57 `clipPath` contre quelques `opacity`). Images : `clip-path: inset(0 0 100% 0)` → `inset(0)`, **0,8-1 s `expo.out`**, `start:"top 90%"`, `once:true`. Texte : overflow hidden + translateY 100 % → 0. Le mouvement a une direction, l'œil suit.
4. **Changement de thème par section épinglée** (Lando `sticky-track-theme-change` + `data-nav-theme`). Une seule section (l'audit, ou le manifeste) passe du sombre chaud à un **crème** et la nav suit : ScrollTrigger `start:"top 50%"`, `toggleClass` sur `html`, transition CSS `background-color 0,6 s power2.inOut`. Un seul « feu d'artifice » par page, comme le recommande `docs/ANIMATION-PAR-METIER.md`.
5. **Preuve par données vivantes, pas par slogan** (Lando « Next race : Singapore GP », Vercel « Notion powers millions… » avec mot-clé en noir et reste en gris, Linear logos nus + libellé). Pour nous : « Dernier site livré : <métier>, <ville>, <date> », « <n> audits réalisés ce mois », tirés de `site.config.ts`, **jamais inventés** (règle dure n° 2). Révélation en stagger 0,06 s par ligne, `power2.out` 0,5 s.
6. **Animations produit à l'entrée, une seule fois** (Stripe `lazy-animation--loaded`, Apple `data-staggered-item`) : nos « avant/après » d'un site d'artisan (capture floue → nette, Lighthouse 42 → 96 avec `data-counter`) se jouent **à l'entrée dans le viewport (`start:"top 75%"`), 1-1,5 s, `power2.out`, jamais en scrub**. Le visiteur voit la transformation, c'est l'argument de l'audit.
7. **Marquee CSS pur, lent, coupé en reduced-motion** (Vercel `motion-safe:animate-marquee`, 50 s, gap 48 px ; Linear marquee **seulement sur mobile**). Pour les logos/métiers servis : `animation: marquee 50s linear infinite`, pause au survol, `@media (prefers-reduced-motion)` → statique. Pas de marquee lié à la vélocité du scroll (Lando) : coûteux et « agence ».
8. **Budget et repli mobile** : Linear = **34 Ko** et 5 scripts au premier rendu ; Trueform 884 Ko sans vidéo ; Temper 17,7 Mo de MP4 (à ne jamais faire). Lando teste `(hover: none), (pointer: coarse)` et non la largeur : nos effets curseur/survol passent par `gsap.matchMedia` sur la même requête. Apple ajoute un **bouton pause** sur toute galerie animée. Objectif : hero image + WebP/AVIF, vidéo seulement en `data-frames` (séquence) ou `<video>` poster + lazy, ≤ 300 Ko au-dessus de la ligne de flottaison.

### À éviter (signes « généré par IA » relevés sur ces sites)
- Grain + glow + libellés monospace en capitales espacées + titre bicolore (Linear) : exactement le kit que recrachent les générateurs ; interdit par `docs/veille/signes-ia.md`.
- Dégradés violet-orange inclinés, chiffre géant en dégradé, coches colorées (Stripe) ; triangle à halo, arc-en-ciel (Vercel).
- Serif italique géante en marquee, signature manuscrite fluo, hero sans phrase + « Scroll Now » (Lando, 27b) : identité d'une star ou d'un studio de mode, pas d'un artisan.
- Badge-pilule au-dessus du H1 et boutons pilule (Trueform) : garder la structure, pas la forme (coins 4-6 px).
- Scroll hijacké, « click to start », audio (SBS) ; question rhétorique en hero (Temper).
- SplitText par caractère, marquee à la vélocité du scroll, WebGL/Rive au curseur (Lando) : coût élevé, signature « agence motion », et un casque Rive n'a pas d'équivalent chez un plombier.
