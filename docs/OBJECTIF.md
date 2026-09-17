# Objectif de l'atelier

À partir d'un brief de 15 minutes, produire en moins de deux heures un site unique, vérifié, mis en ligne,
que le client possède, et que personne ne peut confondre avec un autre site de l'atelier ; avec une
bibliothèque et des tests qui grandissent à chaque site.

Ce fichier est la mémoire de la boucle autonome. Chaque tour met à jour l'état ci-dessous.
Ne jamais cocher un critère sans l'avoir vérifié par une commande ou une capture.

## Critères de « fini »

| # | Critère | État | Vérification |
|---|---|---|---|
| 1 | 20 sites de démonstration dessinés à la main, 20 métiers, chacun avec hero + nav + ≥ 2 blocs sur mesure, aucun bloc copié d'un site à l'autre | 12 / 20 | `ls sites/*/sections/` ; comparaison manuelle des compositions |
| 2 | Chaque site : build ✓, `ff verifier` ✓ (sauf téléphone fictif), captures sans erreur ni débordement, mobile relu, Lighthouse ≥ 90 (perf, a11y, SEO) | build/captures ✓ ; accessibilité 100/100 (desktop+mobile, accueil + page service + confidentialité) sur `_exemple` et `dubois-plomberie` depuis le 17 sept (voir journal : couche partagée corrigée — contraste `.eyebrow`/`--accent`/`--muted` dans `src/directions/*/index.css` + `global.css` bascule `.eyebrow` sur `--on-ink` attenue en contexte `bg-ink`) ; SEO 58 sur mentions-legales = noindex voulu | `ff tous`, `ff captures`, `node scripts/ff.mjs lighthouse <slug> --detail` |
| 3 | Moteur d'animation : ≥ 15 effets documentés, chacun utilisé dans ≥ 2 sites, sans bug connu | 16 effets ; usage ×2 à vérifier ; 3 bugs corrigés le 16 sept | `grep -l data-<effet> sites/*/sections/*.astro` |
| 4 | Chaîne de bout en bout sur un vrai brief : formulaire → `/nouveau-site` → `ff propositions` → `ff deploy` → `ff exporter` | non prouvée (deploy nécessite `npx wrangler login`, action humaine) | exécuter la chaîne sur un slug de test |
| 5 | Tests + CI verts à chaque commit ; matrice couvrant directions, coquilles, navs | tests 142 ✓ ; CI : à vérifier sur GitHub ; matrice : directions ✓, coquilles ✓, navs ✗ | `npm test`, `ff matrice --rapide`, onglet Actions |
| 6 | Docs à jour : PROCESS, compétences, CONVENTIONS, chaque motif documenté le jour où il naît | à relire après chaque tour | relecture |
| 7 | Premier site client réel livré et payé | action humaine | — |
| 8 | Veille intégrée (`docs/veille/SYNTHESE.md`) : actions B1-B6 (livrable conforme : verifier étendu, schemaType par métier, page confidentialité, carte sans cookie, provider cloudflare, lighthouse) | 6 / 6 — B1-B4 faits le 17 sept 2026 (voir détail plus bas dans le journal) ; B5 (provider `cloudflare` : `src/worker/contact.js` copié en `dist/<slug>/_worker.js` par `ff build`, mode avancé Cloudflare Pages Functions, `env.EMAIL.send()`/Resend, wording `confidentialite.astro`, `docs/DEPLOIEMENT.md` § 2.5) et B6 (`ff lighthouse [slug] [--mobile] [--seuil 90]`, intégré à `ff verifier --lighthouse`) faits le 16 sept 2026 | `ff verifier` sur un site ; `npm test` (tests/schema.test.mjs, tests/legal.test.mjs, tests/form-cloudflare.test.mjs) |
| 9 | Matière première : `ff photos`, `ff video`, `ff illustration`, +30 polices (C1-C4) | 4 / 4 | commandes existantes et testées ; clés API absentes de cet environnement → échec propre vérifié (`node --check` + essais sans clé), pas testées en conditions réelles |
| 10 | Moteur : les 25 effets de `animations.md` § 3 ajoutés à `motion.ts` avec repli reduced-motion et tests (D1-D3) | 23 / 25 (effets 1-18, 20-23, 25 du tableau ; lignes 19 `data-curtain-nav` et 24 `data-view-transition` restantes — l'infrastructure `site.transitions`/`<ClientRouter />` est posée mais l'audit des scripts inline des sections/composants ne l'est pas, voir `docs/ANIMATIONS.md` § Transitions de page ; +3 effets CSS bonus hors tableau : `data-duotone`, `data-grain`, `data-border-beam` ; nouvelles dépendances lazy `lenis`/`ogl`/`@lottiefiles/dotlottie-web`/`canvas-confetti` ; tests `tests/motion.test.mjs` + vitrine `sites/_effets`) | `grep data-<effet>`, `npm test` |
| 11 | Réserve de compositions : chaque site dessiné introduit un motif de `tendances.md` § 4-5 ou `composants.md` § 3 non encore utilisé (E1) ; procédure de portage dans `/nouvelle-variante` (E2) | E2 fait le 16 sept 2026 — section « Porter depuis une source externe » ajoutée à `.claude/skills/nouvelle-variante/SKILL.md` (14 étapes résumées de `composants.md` § 5, règles de licence MIT-copiable vs GPL/Webflow/Framer/Figma-composition-seule) | relecture de `.claude/skills/nouvelle-variante/SKILL.md` |
| 12 | Offre et discours (A1-A4) : grille de prix, garantie de délai, page finck-fisch avec objections | A3 fait le 16 sept (section `Offre.astro` deux formules, section `Propositions.astro` avec vraies vignettes, 8 objections de `concurrents.md` § 4 dans `faq`, description/tagline repositionnées, layout réordonné) ; A1/A2 (montants définitifs, texte de garantie final) en attente de décision des fondateurs — prix actuels marqués `// PRIX PROVISOIRES` dans `sites/finck-fisch/sections/Offre.astro`, faciles à remplacer ; A4 (formulaire `brief-client.html`) non fait | `ff verifier finck-fisch`, `ff captures finck-fisch`, relecture des captures |
| 13 | Rendu : filière images AVIF/srcset/LQIP, polices sans saut, checks rendu dans `verifier` | fait le 16 sept 2026 — `ff images <slug>` (`--depuis-public` pour les sites sans `raw/`) émet AVIF (qualité 60) + WebP aux largeurs 480/800/1200/1600 et écrit `sites/<slug>/images.json` (widths/formats/ratio/LQIP) ; `src/components/Img.astro` (nouveau) rend `<picture>` AVIF+WebP avec width/height/LQIP, repli `<img>` simple si pas de manifeste ; sections partagées et pages migrées (`src/sections/{About,Hero,Nav,Proof,Services}/*.astro`, `src/pages/services/[slug].astro}` — pas `sites/*/sections`, propriété des designers) ; documenté dans `docs/CONVENTIONS.md` § Images ; polices : plugin Vite `fontaine` (MIT) branché dans `astro.config.mjs` (fallbacks `['Georgia','Arial']`) pour générer les `@font-face` de repli metric-adjusted des ~90 familles `@fontsource-variable/*` chargées à la demande (`src/lib/fonts.ts`) — API expérimentale Astro Fonts écartée (vérifiée par WebFetch : config statique par famille, non compatible avec le chargement dynamique par site) ; `font-display: swap` déjà garanti par Fontsource ; préchargement `<link rel="preload">` du woff2 hero non fait (nom de fichier haché par Vite, pas trivial) ; `ff verifier` : nouveau bloc « Rendu » séparé (`scripts/ff/verifier.mjs`) — fail si grille `<ul>`/`<ol>` de ≥ 3 `<img>` aux ratios intrinsèques incohérents, warn si `<p>` > 400 caractères sans classe `measure`/`max-w-prose`, warn si < 2 familles de police dans le CSS livré, warn si `text-underline-offset` absent du CSS (3 points de la checklist déjà couverts par des checks plus anciens, rappelés en commentaire plutôt que dupliqués : `<img>` sans dimension, `<a href="#">` vide, `font-display` absent) ; build `_exemple`/`demo-plomberie`/`finck-fisch` verts, `<picture>`+avif+width/height confirmés dans `dist/demo-plomberie/services/*.html` | `npm test` (nouveau `tests/images.test.mjs`), `node scripts/ff.mjs images demo-plomberie --depuis-public`, `node scripts/ff.mjs verifier demo-plomberie`/`finck-fisch`, `grep '<picture' dist/demo-plomberie/services/*.html` |

## Métiers couverts (sites dessinés à la main)

1. Ferronnerie d'art — `forge-delacroix` (Toulouse)
2. Ostéopathe — `osteo-marchand` (Annecy)
3. Tatoueur — `encre-noire` (Lille)
4. Restaurant — `chez-malo` (Marseille)
5. Couvreur — `toits-cie` (Rouen)
6. Photographe de mariage — `anna-vidal` (Bordeaux)
7. Garage — `moteur-fils` (Nancy)
8. Plombier-chauffagiste (urgence) — `dubois-plomberie` (Nantes)
9. Salon de coiffure / barbier — `barbier-kessler` (Strasbourg)
10. Paysagiste — `jardins-mael` (Rennes / Cesson-Sévigné)
11. Boulangerie-pâtisserie — `maison-roux` (Lyon)
12. Architecte d'intérieur — `studio-ambre` (Paris)

## Métiers à couvrir (un par tour, dans cet ordre, ville différente à chaque fois)

12. Électricien / domotique — Villeurbanne
13. Cabinet d'avocat — Montpellier
14. Vétérinaire — Grenoble
15. Menuisier-ébéniste — Roubaix
16. Institut de beauté / spa — Nice
17. Food truck / traiteur — Bayonne
18. Auto-école — Tours
19. Chambres d'hôtes — Dordogne
20. Coach sportif / studio de yoga — Lille
21. Serrurier (urgence) — Marseille
22. Fleuriste — Bordeaux
23. Maçon / rénovation — Metz
24. Dentiste — Reims
25. Brasserie artisanale — Clermont-Ferrand
26. Agence immobilière de quartier — Toulon

Règle : les démos existantes `demo-*` (générées, non dessinées) ne comptent pas pour le critère 1.
Elles restent comme exemples du mode « permutation ».

## Ordre des tours après la veille (17 sept 2026)

Tour 1 : B1 + B2 + B3 (verifier, schemaType, confidentialité). Tour 2 : D1 première moitié (13 effets).
Tour 3 : site métier 8. Tour 4 : B4 + B5 + C1. Tour 5 : D1 seconde moitié. Tour 6 : site métier 9.
Ensuite alterner : deux sites, un tour de robustesse ou d'intégration de la veille. Lire
`docs/veille/SYNTHESE.md` au début de chaque tour de robustesse.

## Procédure d'un tour

1. Lire ce fichier, `CLAUDE.md`, `docs/PROCESS.md`, `.claude/skills/nouveau-site/SKILL.md`.
2. Prendre le prochain métier. Inventer un client crédible (nom, ville, 4-6 services, horaires, histoire),
   numéros en 06 39 98 xx xx, e-mail `contact@exemple.fr`, en-tête `// DEMO : client inventé`.
3. `ff nouveau <slug>` puis `ff composer <slug> --metier "<métier>"` : partir de sa proposition.
4. Dessiner : hero sur mesure, nav sur mesure, deux blocs sur mesure minimum, composition et animations
   choisies pour ce client (voir la liste des effets dans `src/styles/global.css`). Jamais la même
   composition qu'un site existant : relire `sites/*/sections/*.astro` avant de dessiner.
5. `ff build`, `ff verifier`, `ff captures`. Regarder les deux captures avec l'outil de lecture d'image.
   Corriger. Recommencer jusqu'à propre.
6. Mettre à jour la table et la liste ci-dessus. Commit + push.
7. Un tour sur trois, à la place d'un site : robustesse. `npm test`, `ff matrice --rapide`, relire les
   bugs signalés dans les rapports précédents, extraire dans `src/sections/` tout motif sur mesure
   apparu trois fois (via `/nouvelle-variante`), ajouter les outils manquants du critère 2 et 5
   (`ff lighthouse` via playwright + lighthouse npm si absent ; matrice des navs).

## Arrêt

S'arrêter et le dire quand : les sept critères sont cochés ; ou un critère dépend d'une action humaine
(login Cloudflare, achat de domaine, vrai client) et tout le reste est fait.

## Journal

- 17 sept 2026 : site métier 11 (Architecte d'intérieur), Studio Ambre — Léa Bonnet, Paris 10e
  (rue des Vinaigriers, depuis 2015, solo + un collaborateur, appartements haussmanniens, boutiques,
  cabinets) — `sites/studio-ambre/`. `ff composer studio-ambre --metier "Architecte d'intérieur"`
  propose la direction `pierre` (gris minéral, Bodoni Moda, angles droits — confirmé libre, aucun
  site dessiné à la main ne l'utilisait) : suivie, colle exactement au mandat « quiet luxury,
  éditorial ». Écarts documentés dans l'en-tête de `site.config.ts` : accent surchargé en ambre
  (hsl(28 55% 46%), proche du placeholder `#b8763b`) au lieu du gris minéral par défaut (mandat :
  un seul accent chaud nommé « ambre ») ; `motion: 'rich'` (au lieu de `subtle`) pour les effets
  palier rich du mandat ; shell `magazine` (numéros de section en filigrane, grille asymétrique) —
  seul avec `split` encore inutilisé parmi les six coquilles, retenu plutôt que `split` car il
  laisse la nav sur mesure piloter tout le rendu desktop (la coquille `split` réserve la nav
  desktop à son propre panneau latéral) ; typographie par défaut de `pierre` (Bodoni Moda/Epilogue)
  gardée plutôt que la paire `delaGothic`/`domine` proposée, plus cohérente avec un hero où le nom
  du studio est traité en petites capitales. Nav et hero sur mesure, quatre sections sur mesure
  (`sites/studio-ambre/sections/` : `Hero` — image plein cadre seule, nom du studio en petites
  capitales `mix-blend-mode: difference` qui se décode au chargement (`data-scramble`, pas le hero
  épinglé géant d'`anna-vidal`), légende fine sous l'image, grain léger (`data-grain`) ; `CaseStudy`
  — trois typologies de lieux en pile (`data-stack`), un plan au trait dessiné pour chacune (SVG
  inline sur mesure, `data-draw-svg`) — présentées comme des typologies représentatives, jamais
  comme des réalisations chiffrées ou des avis (le brief ne fournit pas de portfolio réel) ;
  `Materiaux` — carnet d'échantillons en piste glissable (`data-drag-grid`), textures 100 % CSS
  (`color-mix`/dégradés à partir des tokens, aucune photo de matière fournie) ; `Methode` — les
  quatre prestations du brief (conseil, conception, suivi de chantier, aménagement de boutique)
  présentées comme les quatre phases d'une mission en accordéon (`data-accordion="single"`), durée
  indicative en semaines par phase (`data-count-bar`, valeurs de démonstration marquées comme
  telles) ; `Contact` — halo qui suit le curseur sur le panneau de coordonnées (`data-spotlight`) et
  filet doré tournant autour de la carte de formulaire (`data-border-beam`), `<ContactForm />` et
  `<Carte />` partagés réutilisés tels quels, aucune logique dupliquée, carte en `data-reveal`
  classique (voir plus bas pourquoi pas `data-reveal-native` ici). Premier grep « effets à 0 usage »
  fait tôt dans ce tour (avant que `jardins-mael`/`maison-roux` ne soient terminés par un autre agent
  en parallèle) avait fait retenir `data-scramble`/`data-border-beam`/`data-grain` comme inédits ;
  les deux tours voisins les ont consommés entre-temps (concurrence entre agents sur le même dépôt,
  pas une erreur de lecture) — restés utilisés (imposés par le mandat sur le hero et la carte
  contact) mais ne comptent plus parmi les inédits. Grep refait, cinq effets réellement à 0 usage
  ailleurs (`sites/{...9 sites...,jardins-mael,maison-roux}/sections`) retenus à la place :
  `data-accordion`, `data-count-bar`, `data-hover-distort` (image qui flotte au survol du texte de
  chaque typologie dans "Projets", repli `data-hover-img` si WebGL indisponible), `data-blur-scrub`
  (sur les plans SVG du même bloc, cumulé avec `data-draw-svg` — flou réglé bas, `="5"`, après un
  essai à 14 qui rendait les plans illisibles dans leur état "avant scroll") et `data-reveal-native`
  (petit indice « Faites glisser » du bloc "Matériaux" uniquement — pas la carte du bloc contact,
  écartée de cette variante : `animation-timeline: view()` n'acquiert pas la révélation, l'élément se
  recache si on remonte au-dessus, inadapté pour une information fonctionnelle mais sans conséquence
  pour un indice décoratif). `data-smooth` (Lenis) essayé puis retiré (pas retenu dans les cinq) : il
  désynchronise le `window.scrollTo()` programmatique de `scripts/captures.mjs` (qui simule un
  défilement pour déclencher les reveals avant de reprendre en haut de page) — les `data-scrub`
  restaient figés dans leur état de départ sur la capture avec Lenis actif, y compris sur des
  éléments proches du haut de page qui s'en tiraient bien sans lui. Aucun avis inventé (pas de
  `proof.google`/`testimonials`, absents du brief). Wording exact du mandat respecté
  (`devis: 'Prendre rendez-vous'`, `ctaTitle`/`contactTitle`). Trois bugs réels trouvés et corrigés
  en cours de route (pas des faux positifs connus) : (1) `Button.astro` pose `inline-flex` en classe
  de base non conditionnelle — lui ajouter `hidden sm:inline-flex` ne le cache pas (`inline-flex`
  généré après `hidden` dans la feuille Tailwind, gagne la cascade à toutes les tailles) : corrigé
  en enveloppant le bouton dans un conteneur `hidden sm:block` plutôt que de poser les classes de
  visibilité sur le composant partagé ; (2) la nav (sept liens numérotés) en simple
  `flex justify-between` sans `shrink-0`/`whitespace-nowrap` se comprimait lettre par lettre (nom du
  studio, numéro de téléphone) dès que la largeur se resserrait — corrigé en grille
  `grid-cols-[auto_1fr_auto]` avec colonnes latérales figées, nav repoussée à `xl` (pas `lg`, zone
  1024-1280px trop juste pour sept liens même compacts) et menu plein écran en relais ; (3) `data-smooth`
  (Lenis) fige les `data-scrub` sur les captures pleine page (détaillé plus haut) — retiré. `ff build`/
  `ff verifier studio-ambre` verts (seuls échecs attendus : faux positif préexistant « 100 % » sur
  le CSS de coquille `[data-shell=slides]`, `exemple.fr` imposé par le brief ; avertissements
  attendus : SIRET absent, paragraphe long de `confidentialite.html` sans `measure`, page partagée
  hors scope). `ff captures studio-ambre` sans erreur console ni débordement, desktop et mobile
  relus à l'œil après les deux corrections de nav. Build temporairement bloqué à plusieurs reprises
  par des fichiers partagés en cours d'édition par un autre agent (`astro.config.mjs`,
  `src/styles/global.css`, `sites/jardins-mael/sections/Services.astro`) — non modifiés par ce tour,
  résolus en relançant après coup. Critère 1 : 11 → 12 / 20.

- 17 sept 2026 : site métier 12, Maison Roux (boulangerie-pâtisserie, Lyon/Croix-Rousse, troisième
  génération, depuis 1987, levain naturel, farines de Rhône-Alpes) — `sites/maison-roux/`. `ff composer
  maison-roux --metier "Boulangerie"` propose la direction `pop` (attendue : seule direction du schéma
  associée explicitement à « boulangerie/pâtisserie ») — suivie, cohérente avec le mandat (joyeux,
  chaleureux, appétit ; direction `pop` jusqu'ici inutilisée par un site dessiné à la main, `clair` à
  éviter). Écarts documentés dans l'en-tête de `site.config.ts` : typographie par défaut de `pop`
  (Anybody Variable) gardée plutôt que la proposition `delaGothic` du composer (déjà `toits-cie` ;
  `bricolage` déjà `moteur-fils` — Anybody est la seule des trois encore inutilisée) ; accent surchargé
  en ambre chaud (proche de `#f4c95d`, couleur des placeholders) plutôt que le rose par défaut, pour
  l'appétit plutôt que le ludique pur ; shell `flow` plutôt que `sidebar` proposé (la nav sur mesure est
  une barre en haut, pas un rail latéral) ; `scale: 'display'` pour un hero très grand format. Nav et
  hero sur mesure, quatre sections sur mesure (`sites/maison-roux/sections/` : `Nav` — barre « ticket de
  caisse » en papier, chaque lien traité comme une ligne de ticket à filet pointillé + icône, grain de
  papier ; `Hero` — nom en typographie ultra-grasse (`data-split`), étiquettes de prix collées en biais,
  bande `data-marquee-velocity` des pains du jour (`site.services`, pas un texte détaché) ; `Fournee` —
  les 4 temps de `site.process` (6h30/8h/11h/16h) en panneaux `data-sticky-stack` + `data-scroll-progress`
  (composition différente de `sites/dubois-plomberie/sections/Urgence.astro` : horloge circulaire par
  panneau, grain de papier sur le panneau final) ; `Carte` — liste typographique à filets pointillés +
  `tabular-nums` groupée par catégorie (composition différente de `sites/barbier-kessler/sections/Tarifs.astro`,
  liste plate unique), prix en `data-scramble`, spécialité maison encadrée d'un `data-border-beam`, trois
  cartes-photo « coups de cœur » en `data-tilt`/`data-tilt-glare` ; `CommanderGateau` — grille
  `data-flip-card` (recto photo, verso description + délai 48 h réel du brief) ; `Contact` — custom,
  formulaire + coordonnées présentées en second ticket (police mono, horaires en `tabular-nums`,
  « code-barres » décoratif), `data-confetti` posé sur la section (écoute `ff:form-success`, actif dès
  qu'une vraie clé web3forms/cloudflare sera renseignée). Six effets jusqu'ici à 0 usage dans un site
  dessiné à la main utilisés pour la première fois : `data-grain`, `data-border-beam`, `data-scramble`,
  `data-confetti`, `data-tilt`/`data-tilt-glare` (`data-scroll-progress`, `data-sticky-stack` et
  `data-marquee-velocity` déjà utilisés ailleurs, repris ici pour le mandat). Aucun avis inventé (le
  brief n'en fournit pas, section proof absente du layout) ; le catalogue de 4 styles de gâteau et le
  rythme horaire des fournées sont un contenu générique de métier (comme
  `sites/dubois-plomberie/sections/Diagnostic.astro`), pas une donnée client chiffrée. Bug réel trouvé et
  corrigé en cours de route : lien `tel:` hors des 1500 premiers caractères du corps à cause des six
  liens de nav (icônes SVG inline) avant le bouton d'appel — corrigé par réordonnancement `order-*` (même
  correctif que `barbier-kessler`/`dubois-plomberie`), sans changer la disposition visuelle. Autre defaut
  latent identifié en le corrigeant pour ce site seulement (pas retouché ailleurs, hors scope) :
  `&nbsp;` en toutes lettres dans un champ affiché par interpolation simple (pas `set:html`, ex.
  `faq.q`/`wording.ctaText`) s'affiche littéralement dans le HTML au lieu d'une espace insécable — au
  moins `sites/barbier-kessler` a le même défaut latent dans son `faq`/`about.story`/`contactText`
  (confirmé par `grep nbsp dist/barbier-kessler/index.html`, non corrigé ici, hors scope de ce tour) ;
  pour `maison-roux`, remplacé par l'échappement Unicode ` ` dans les champs non `set:html`, gardé
  en entité `&nbsp;` seulement dans `business.tagline`/`wording.ctaTitle` (rendus via `set:html`,
  HTML autorisé par le schéma). `ff build`/`ff verifier` verts (seuls échecs attendus : faux positif
  préexistant « 100 % » et `exemple.fr` imposé par le brief ; avertissements attendus : SIRET absent,
  paragraphe long de `confidentialite.html` sans `measure`) ; `ff captures maison-roux` sans erreur
  console ni débordement, desktop et mobile relus à l'œil. Build temporairement bloqué deux fois pendant
  ce tour par des fichiers partagés en cours d'édition par d'autres agents (`astro.config.mjs`, puis
  `src/styles/global.css`) — non modifiés par ce tour, résolus par les agents concernés. Critère 1 :
  10 → 11 / 20. Numérotation de la liste « métiers à couvrir » décalée en conséquence (l'architecte
  d'intérieur, en cours ailleurs, passe du repère 11 à 12 dans cette liste — un simple numéro d'ordre,
  pas un identifiant, à corriger sans casse par le prochain tour qui y touche).

- 17 sept 2026 : site métier 10, Les Jardins de Maël (paysagiste, Rennes/Cesson-Sévigné, création,
  entretien à l'année, terrasses bois, arrosage automatique, élagage, Qualipaysage) —
  `sites/jardins-mael/`. Mandat de conception : « les saisons ». `ff composer jardins-mael --metier
  "Paysagiste"` propose la direction `terre` (attendu : c'est la direction « métier typique » du
  paysagiste dans `src/lib/schema.ts`) et le hero `marquee` — écart volontaire imposé par le mandat
  (éviter `terre` et le hero `stacked` pour ne pas ressembler à `sites/demo-paysagiste`, même métier
  et même ville, direction `terre` + hero `stacked`). Direction retenue à la place : `journal`
  (off-white, Playfair Display, filets fins) — jamais utilisée par un site dessiné à la main,
  raison notée dans l'en-tête de `site.config.ts` : le concept « une année en quatre chapitres »
  porte bien la retenue éditoriale de cette direction, avec un accent qui vire au vert/or/rouille/
  ardoise dans les quatre panneaux saisonniers plutôt qu'un rouge profond fixe. Nav et hero sur
  mesure (`sections/Nav.astro` — masthead éditorial en deux lignes, bandeau d'ours qui se replie au
  défilement ; `sections/Hero.astro` — mot serif géant « Jardin. » en h1, à droite une scène à trois
  profondeurs `data-parallax-depth` : photo en duotone, branche dessinée à la main en SVG inline qui
  se trace au scroll `data-draw-svg`, carte de faits au premier plan), plus quatre blocs sur mesure :
  `sections/Services.astro` (piste glissable `data-drag-grid`, repli `overflow-x:auto` en
  `prefers-reduced-motion` puisque la règle globale `[data-drag-grid]{overflow:hidden}` suppose le
  JS de glisser-déposer), `sections/Saisons.astro` (cœur du mandat : quatre panneaux plein cadre en
  `data-sticky-stack`, chacun avec sa propre teinte d'accent posée en variable CSS inline —
  héritée à la fois par le filtre `data-duotone` de sa photo et par les pastilles de prestations),
  `sections/Calendrier.astro` (grille typographique des 12 mois, `tabular-nums`, survol coloré,
  chaque tâche reliée à une prestation réelle du site) et `sections/Cta.astro` (carte à
  `data-border-beam`). Six effets encore inutilisés par un site dessiné à la main (grep sur les neuf
  sites précédents) : `data-draw-svg`, `data-parallax-depth` (+ `data-depth`), `data-duotone`,
  `data-drag-grid`, `data-border-beam`, en plus de `data-sticky-stack` réemployé (déjà dans
  `dubois-plomberie`) — dépasse le minimum de cinq demandé. `<Img>` utilisé pour les photos de
  services et le portrait équipe (générées par `ff images jardins-mael --depuis-public`) ; `<img>`
  brut conservé sur les trois photos en `data-duotone` (hero, quatre panneaux Saisons) — le
  sélecteur CSS `[data-duotone] > img` cible un enfant direct, que le `<picture>` de `<Img>` casse.
  Aucun avis inventé (le brief n'en fournit pas, section `proof` absente du layout). Deux bugs
  corrigés en cours de route : une duplication « Cesson-Sévigné & Cesson-Sévigné » dans l'eyebrow du
  nav/hero (la ville de l'adresse est déjà Cesson-Sévigné, le texte visait la paire Rennes/Cesson-
  Sévigné) ; le lien `tel:` hors des 1500 premiers caractères du corps à cause du bandeau d'ours
  placé avant la ligne principale — corrigé en écrivant la ligne principale (logo + tel) en premier
  dans le DOM et en la replaçant visuellement en second rang par `order-*` sur un `header` en
  `flex-col`, sans changer la disposition visuelle. En cours de route, deux bugs préexistants et
  partagés par tous les sites ont bloqué tous les builds du dépôt (pas seulement celui-ci) :
  `astro.config.mjs` contenait un retour à la ligne littéral non échappé dans un `.join('...')`
  (`Expected ";" but found ")"` dans esbuild) et `scripts/vite-ff-look.mjs` appelait `readdirSync`
  sans l'importer de `node:fs` — les deux visiblement laissés par une édition en cours d'un autre
  agent au même moment ; corrigés par un correctif d'une ligne chacun (le second déjà corrigé par
  l'autre agent au moment de la nouvelle tentative). `ff build`/`ff verifier`/`ff captures` verts
  (seuls échecs attendus : faux positif « 100 % », `exemple.fr` imposé par le brief, SIRET absent) ;
  captures desktop et mobile relues, aucune erreur console, aucun débordement. Critère 1 : 9 → 10/20.

- 17 sept 2026 : bug de performance trouve par Lighthouse (perf mobile 70) : Astro regroupait le CSS des 16 directions et des 63 polices (feuille 568 Ko). Correction : plugin `scripts/vite-ff-look.mjs` (direction + polices resolues au build, module virtuel), catalogue `fonts.ts` sans import() ; feuille 105 Ko, perf mobile 94, desktop 100.

- 16 sept 2026 : site métier 9, Barbier Kessler (barbier, Strasbourg/Krutenau, sans rendez-vous le
  samedi) — `sites/barbier-kessler/`. `ff composer barbier-kessler --metier "Barbier"` propose la
  direction `retro` (crème/orange/moutarde, `delaGothic`) : déjà la palette seventies de
  `moteur-fils`, et le mandat de ce site demandait explicitement d'éviter le « seventies garage ».
  Écart documenté dans l'en-tête de `site.config.ts` : direction `atelier` (chaleureuse, papier
  chaud) gardée comme base, avec un accent vert sombre surchargé (famille de `#123524`, la couleur
  des placeholders, éclairci à l:34% pour rester lisible en texte sur fond sombre et sur fond clair)
  et une typographie condensée (`oswald`) + corps humaniste (`cabin`) à la place de Fraunces/Inter —
  aucune des deux polices déjà utilisée par un autre site dessiné. Nav et hero sur mesure, quatre
  blocs sur mesure (`sites/barbier-kessler/sections/` : `Nav`, `Hero`, `Tarifs` — menu typographique à
  filet pointillé et `tabular-nums`, `Equipe` — trois barbiers en `data-stack`, `Galerie` — photos du
  salon en `data-trail`, `Infos` — horaires/adresse sur panneau `data-spotlight`), plus une signature
  « enseigne de barbier » en CSS pur (rayures diagonales dérivées des tokens accent/bg, `Nav.astro` +
  `Hero.astro`, aucune couleur en dur). Cinq effets de `docs/ANIMATIONS.md` (§ Nouveaux effets),
  jusqu'ici à 0 usage dans un site dessiné à la main, utilisés pour la première fois : `data-stack`,
  `data-marquee-velocity`, `data-spotlight`, `data-trail`, `data-scroll-progress` (+ `data-split="chars"`,
  `data-draw`, `data-counter`, `data-stagger`, `data-magnetic` pour le reste). Aucun avis inventé
  (`proof.google`/`testimonials` absents, le brief n'en fournit pas). `ff build`, `ff verifier`
  (seuls échecs : faux positifs déjà présents sur les autres sites — « 100 % », `exemple.fr` — et
  l'avertissement SIRET absent, attendu ; un vrai défaut corrigé en cours de route : le lien `tel:`
  n'apparaissait pas dans les 1500 premiers caractères du corps à cause d'un `<nav>` trop verbeux avant
  le bouton téléphone — réordonné en DOM avec `order-*` Tailwind) et `ff captures barbier-kessler`
  verts (aucune erreur console, aucun débordement, desktop et mobile relus à l'œil).
- 17 sept 2026 : Tour 3 — site métier 8, Dubois Plomberie (plombier-chauffagiste, Nantes, urgences 24h/24)
  — `sites/dubois-plomberie/`. Direction `signal` (seule direction associée au métier « plombier » dans
  `src/lib/schema.ts`) mais accent surchargé en bleu nuit (`accent: {h:210,s:72,l:17}`, proche de
  `#0b2545`) plutôt que le rouge-orange par défaut : confiance plutôt qu'alarme, pour rester « studio
  premium » sans perdre la lisibilité d'urgence — raison notée dans le rapport de tour, composer non
  suivi à la lettre sur ce point précis. Nav et hero sur mesure (`sections/Nav.astro`, `Hero.astro`) +
  trois sections sur mesure : `Diagnostic.astro` (grille de cartes retournables, symptôme → cause
  probable → geste), `Urgence.astro` (les 4 étapes de `site.process` en panneaux sticky empilés),
  `Tarifs.astro` (prix « à partir de » en typographie à pointillés dans un bloc à halo suivant le
  curseur + avant/après salle de bain en curseur glissant). Composition volontairement différente de
  `toits-cie` (même famille « urgence » : pas de plein écran accent + mot géant + marquee, pas de
  bandes penchées ni de damier — ici deux colonnes sur fond bleu nuit, cartes de faits, sections
  empilées). 7 effets neufs utilisés : `data-split="chars"`, `data-scroll-progress`, `data-flip-card`,
  `data-sticky-stack`, `data-spotlight`, `data-compare`, `data-counter-flip` (ancienneté réelle,
  `yearsSince()`, pas un chiffre inventé). Téléphone en barre fixe basse sur mobile (`.call-bar`),
  tabular-nums sur les prix, `measure` sur les textes longs. Aucun avis client (absent du brief, aucun
  avis inventé) : section `proof` retirée du layout plutôt que remplie à vide. Assets générés par
  `scripts/placeholders.mjs` (dégradés abstraits bleu nuit/bleu pâle, pas de photos), `robots.txt`
  copié depuis `sites/_exemple/public/`. `ff build`/`ff verifier` verts (seuls échecs attendus : faux
  positif préexistant « 100 % » sur `width:100%` du CSS de coquille, `exemple.fr` — e-mail imposé par le
  brief — et l'avertissement SIRET absent, non fourni) ; un vrai défaut trouvé et corrigé en cours de
  route (lien `tel:` hors des 1500 premiers caractères du corps à cause de l'ordre DOM de la nav —
  corrigé par réordonnancement CSS `order-*` sans changer la disposition visuelle). `ff captures` sans
  erreur console ni débordement ; les deux captures relues, un chevauchement visible entre la carte de
  faits du hero et la barre d'appel fixe mobile est un artefact connu des captures pleine page sur les
  éléments `position: fixed` (déjà présent sur `sites/chez-malo` avec son nav `dock`, vérifié par
  comparaison), pas un bug réel du site. Étapes de `Urgence.astro` resserrées (70vh → 52vh par panneau)
  après relecture des captures pour une pagination plus dense. Critère 1 : 7 → 8 / 20.
- 16 sept 2026 : D1 seconde moitié — 10 effets restants de `animations.md` § 3 (lignes 1, 2, 3, 12, 16,
  18, 19, 21, 24, 25) ajoutés à `motion.ts`/`global.css` : `data-smooth` (Lenis, synchronisé
  `ScrollTrigger`, ancres via `lenis.scrollTo`, posé par `Base.astro` depuis le nouveau champ
  `site.smoothScroll`), `data-hover-distort` (OGL, distorsion WebGL au survol, repli `data-hover-img`
  si WebGL indisponible), `data-draw-svg[="scrub"]` (GSAP DrawSVGPlugin), `data-accordion[="single"]`
  (GSAP Flip sur des `<details>`), `data-drag-grid` (GSAP Draggable + InertiaPlugin, enroulement
  infini), `data-lottie` (`@lottiefiles/dotlottie-web`, repli `data-lottie-fallback` ou texte),
  `data-confetti` (canvas-confetti sur l'évènement `ff:form-success`, dispatché par
  `ContactForm.astro` dans ses deux branches de succès), `data-reveal-native`
  (`animation-timeline: view()` + repli IO). +3 bonus CSS purs hors tableau : `data-duotone` (filtre
  SVG `#ff-duotone` posé une fois dans `Base.astro` + `mix-blend-mode: color`, docs/veille/rendu.md
  § 4.1), `data-grain` (grain `feTurbulence`, généralisation du motif de la direction `atelier`),
  `data-border-beam` (bordure conique tournante, `@property`). Nouvelles dépendances `lenis`, `ogl`,
  `@lottiefiles/dotlottie-web`, `canvas-confetti` — toutes chargées en `import()` seulement si
  l'attribut correspondant est présent dans le DOM (même garde que `rich()`), aucune en chemin
  critique. Infrastructure `site.transitions` (`<ClientRouter />`, `astro:page-load`) posée pour une
  itération future mais volontairement pas poussée jusqu'à `data-curtain-nav`/`data-view-transition` :
  l'audit des `<script>` inline des sections/composants pour une ré-init propre à chaque navigation
  n'a pas été fait dans ce tour (voir `docs/ANIMATIONS.md` § Transitions de page) — 23/25 effets du
  tableau, ces deux lignes restent donc ouvertes. `sites/_effets/sections/Effets.astro` complétée
  (blocs 29-38) ; `docs/ANIMATIONS.md` et l'en-tête de `motion.ts` mis à jour. Vérifié : `npm test`
  (motion.test.mjs vert, générique par grep donc couvre chaque nouvel attribut + sa règle
  reduced-motion sans modification du fichier de test), `SITE=_effets` puis `SITE=_exemple`
  `astro build` verts. Budget vérifié sur `dist/_effets/_astro/*.js` : seul
  `Base.astro_..._lang.*.js` (~22 Ko) est chargé au chargement de page (`<script type="module">`
  dans le HTML) ; `gsap-core`, `ScrollTrigger`, `Draggable`, `InertiaPlugin`, `Flip`,
  `DrawSVGPlugin`, `ScrambleTextPlugin`, `lenis`, `ogl` (~133 Ko, le plus gros) et `dotlottie-web`
  (~62 Ko + WASM ~500 Ko servi depuis jsdelivr/unpkg à l'usage réel) sont tous des chunks séparés,
  jamais référencés par `index.html`, chargés uniquement à l'exécution par les `import()` gardés —
  conforme au budget de `docs/veille/animations.md` § 5. Chunk `ClientRouter` présent dans
  `dist/_astro/` mais non référencé par le HTML tant que `site.transitions` est `false` (défaut) :
  artefact de build inoffensif, pas chargé par le navigateur.
- 16 sept 2026 : A3 de l'offre et du discours (`docs/veille/SYNTHESE.md`) — `sites/finck-fisch/sections/Offre.astro`
  (deux formules Essentiel/Complet, prix `// PRIX PROVISOIRES` à partir de 1 200 €/1 800 €, ce qui n'est jamais
  facturé, garantie de délai provisoire, chèque France Num, maintenance optionnelle 25 €/mois) et
  `sites/finck-fisch/sections/Propositions.astro` (process en 3 étapes, vraies vignettes
  `propositions/demo-boulangerie/prop-{1,2,3}-desktop.png` redimensionnées en `/images/prop-{1,2,3}.webp`,
  légendes nommant les 3 directions atelier/clair/rétro) ajoutées au layout ; `faq` remplacée par les 8
  objections de `concurrents.md` § 4 (réécrites dans notre voix) + 2 questions pratiques non redondantes
  gardées (photos, nom de domaine) ; `business.tagline`/`description` repositionnées (dessiné à la main,
  trois propositions, propriété réelle, « deux associés » sans nom inventé) ; layout réordonné
  (manifeste → offre → propositions → services → process → faq → cta → contact, `about`/`proof` retirés
  car redondants avec manifeste/propositions). `ff build`/`ff verifier`/`ff captures finck-fisch` verts
  (seuls échecs : téléphone placeholder `06 00 00 00 00`, attendu, et un faux positif préexistant du
  contrôle « 100 % » sur `width:100%` dans le CSS de coquille `[data-shell=slides]`, indépendant de ce
  tour). A1/A2 (prix définitifs, texte de garantie final) restent une décision des fondateurs.
- 17 sept 2026 : B1-B4 de la veille (`docs/veille/SYNTHESE.md`) faits — `business.schemaType` +
  `schemaTypeForTrade` (`src/lib/schemaType.ts`, testé), `aggregateRating` retiré du JSON-LD partout,
  page `/confidentialite` générée et liée (pied de page, formulaire), `contact.mapsProvider`/
  `coordinates` + composant `<Carte />` (tuiles OSM statiques sans traceur par défaut, façade
  cliquable pour Google Maps, plus aucune iframe brute dans `Zones/map.astro` ni `Contact/full.astro`),
  `ff verifier` étendu (9 nouveaux contrôles + 4 avertissements). `npm test` vert (156 tests),
  `ff tous`/`ff verifier` relancés sur `demo-plomberie` et `finck-fisch` sans régression imputable à
  ce tour.
- 17 sept 2026 : veille en six dossiers (`docs/veille/`), synthèse et plan d'action A-F ; critères 8 à 12 ajoutés.
- 16 sept 2026 : fondation, 16 directions, 44 variantes, CLI, studio, 32 modèles, coquilles, moteur
  d'animation enrichi, 7 sites dessinés à la main. Critères 1 à 6 en cours, 7 non commencé.
