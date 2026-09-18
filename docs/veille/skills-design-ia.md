# Veille — deux skills anti-slop open source (Impeccable, taste-skill)

Comparaison factuelle de deux dépôts clonés avec nos propres docs (`docs/CONVENTIONS.md`,
`docs/ANIMATIONS.md`, `docs/ANIMATION-PAR-METIER.md`, `docs/REDACTION.md`, `docs/veille/rendu.md`,
`.claude/skills/nouveau-site/SKILL.md`). Racines des deux clones (chemins raccourcis dans ce document) :

- **Impeccable** = `impeccable/` (clone de Paul Bakaus, `github.com/pbakaus/impeccable` d'après `CLAUDE.md`
  du clone)
- **taste-skill** = `taste-skill/` (clone de Leon Lin/Leonxlnx, `github.com/Leonxlnx/taste-skill`)

Chaque affirmation ci-dessous est sourcée par un chemin relatif à l'une de ces deux racines, ou à
ff-atelier quand la comparaison porte sur notre propre code.

---

## 1. Ce que fait chaque outil

### Impeccable

Skill Claude Code unique (`/impeccable <commande>`) qui regroupe **24 commandes** de design UI —
`critique`, `audit`, `polish`, `animate`, `colorize`, `typeset`, `layout`, `distill`, `bolder`,
`quieter`, `harden`, `onboard`, `delight`, `overdrive`, `clarify`, `adapt`, `optimize`, `live`,
`generate`, `init`, `document`, `extract`, `shape`, `craft` (`impeccable/skill/SKILL.src.md` § Commands,
`impeccable/README.md` § 24 Commands). Chaque commande charge un fichier `impeccable/skill/reference/
<commande>.md` qui définit une méthode (diagnostic en deux passes séparées — jugement humain puis scan
mécanique — puis vérification) plutôt qu'une simple liste de règles. Le tout s'appuie sur un moteur
Rust compilé (`impeccable/crates/`) qui exécute **61 règles de détection déterministes** sans LLM
(`impeccable detect`, CLI ou extension navigateur) — voir §4 ci-dessous pour la liste. Licence Apache
2.0 (`impeccable/LICENSE`), sauf les fichiers `skill/reference/ios.md`/`android.md` distillés du dépôt
MIT `ehmo/platform-design-skills` (`impeccable/NOTICE.md`).

Installation : `npx impeccable install` puis `/impeccable init` dans l'agent (`impeccable/README.md`
ligne 5). `init` écrit un `PRODUCT.md` (contexte produit durable) et un `DESIGN.md` (système visuel
constaté ou choisi) que les 24 commandes relisent ensuite.

### taste-skill

Pas un moteur : un (ou plusieurs) fichier **SKILL.md** de ~1200 lignes d'instructions pour un agent de
code, ciblé sur une stack précise — **React/Next.js + Tailwind v4 + Motion (ex-Framer Motion)/GSAP +
Radix/shadcn** (`taste-skill/skills/taste-skill/SKILL.md` §3.A). Contenu : lecture du brief avant tout
code (« Design Read » en une phrase), trois curseurs numériques 1-10 (`DESIGN_VARIANCE`,
`MOTION_INTENSITY`, `VISUAL_DENSITY`, §1), une table brief → système de design officiel à installer
(Fluent, Material, Carbon, Polaris, GOV.UK, USWDS, shadcn... §2.A), une longue liste de règles très
prescriptives avec valeurs chiffrées (typographie, couleur, layout, formulaires, hero, marquee...,
§4), deux squelettes de code GSAP canoniques (sticky-stack, horizontal-pan, §5.A-B), un protocole de
redesign (§11) et une checklist de pré-vol avant livraison (§14). Le dépôt propose aussi des variantes
du même squelette avec un curseur esthétique différent : `minimalist-skill`, `soft-skill`,
`brutalist-skill`, `redesign-skill`, `gpt-tasteskill` (`taste-skill/README.md` § Skills, tableau).
Licence MIT (`taste-skill/LICENSE`).

Installation : `npx skills add https://github.com/Leonxlnx/taste-skill` (tout le dépôt), ou
`--skill "design-taste-frontend"` pour ce seul skill (`taste-skill/README.md` § Installing).

---

## 2. Règles concrètes absentes chez nous — à ajouter

Table triée par force de la source (règles confirmées indépendamment par les deux outils en premier).

| # | Règle | Valeur précise | Source | Où l'ajouter chez nous |
|---|---|---|---|---|
| 1 | Un « eyebrow »/kicker (petit label majuscule tracké) au-dessus de **chaque** titre de section est le tell IA le plus cité par les deux outils. Impeccable le bannit purement et simplement ; taste-skill tolère un usage rationné. | Impeccable : **ban total, aucun brief ne le justifie** (« banned outright, repeated or not »). taste-skill : **max 1 eyebrow pour 3 sections**, jamais 2 sections consécutives. | `impeccable/crates/foundation/src/registry.rs` (id `kicker-above-heading`, `hero-eyebrow-chip`) ; `taste-skill/skills/taste-skill/SKILL.md` §4.7 « EYEBROW RESTRAINT (mandatory, the #1 violated rule in production tests) » | `docs/CONVENTIONS.md` § Règles des sections (règle sur `SectionHeading.astro`/prop `eyebrow`) + `scripts/ff/verifier.mjs` (compter les `.eyebrow` par page livrée). **Constat chez nous** : 34 fichiers `src/sections/**` passent un `eyebrow` à `SectionHeading.astro` (`src/components/SectionHeading.astro` ligne 16, `class="eyebrow mb-4"`) — rien n'empêche aujourd'hui un site de l'utiliser sur toutes ses sections. |
| 2 | Familles de police jugées « trop vues » à éviter par défaut | Impeccable : **Inter, Roboto, Fraunces, Geist, Plus Jakarta Sans, Space Grotesk**. taste-skill : bannit spécifiquement **Fraunces** et **Instrument Serif** comme polices display par défaut, et déconseille Inter (sauf brief neutre/public). | `impeccable/crates/foundation/src/registry.rs` (id `overused-font`) ; `taste-skill/skills/taste-skill/SKILL.md` §4.1 | `docs/DIRECTIONS.md` § Polices (guide de choix). **Constat chez nous** : `fraunces`, `inter`, `space-grotesk` et `instrument-sans` (proche d'Instrument Serif) font partie des 16 familles `@fontsource` déjà installées et utilisées par nos directions (`docs/CONVENTIONS.md` § Règles des directions) — un vrai chevauchement avec la liste noire des deux outils, à traiter comme un signal de vigilance plutôt qu'une interdiction (voir §5/§6). |
| 3 | Palette « premium/artisanal » par défaut à éviter : fond crème/beige + accent laiton/argile/ochre + texte quasi-noir chaud | taste-skill donne une liste d'hex bannis précis (ex. fonds `#f5f1ea`/`#fbf8f1`/`#efeae0`, accents `#b08947`/`#9a2436`/`#bc7c3a`, texte `#1a1714`) avec 7 familles alternatives à faire tourner (Cold Luxury, Forest, Black and Tan, Cobalt+Cream, Terracotta+Slate, Olive+Brick, monochrome+pop). Impeccable confirme le même réflexe sous un autre nom. | `taste-skill/skills/taste-skill/SKILL.md` §4.2 « PREMIUM-CONSUMER PALETTE BAN » ; `impeccable/crates/foundation/src/registry.rs` (id `cream-palette` : « a warm cream or beige page background has become the default "tasteful" AI surface ») | `docs/DIRECTIONS.md` § Palette (directions `luxe`, `terre`, `atelier` en particulier) — à vérifier une fois, à la main, sur les hex actuels de ces trois directions (`src/directions/*/index.css`) plutôt qu'à automatiser (palettes fixes, peu de directions). |
| 4 | Saturation d'em-dash (—) dans le corps de texte | **≥ 8 tirets cadratins, à une densité proche de 1 pour 500 caractères de texte visible** — un usage isolé est légitime, seule la saturation est un tell. | `impeccable/crates/foundation/src/registry.rs` (id `em-dash-overuse`) ; convergent avec `impeccable/CLAUDE.md` (le dépôt lui-même bannit l'em-dash dans sa propre prose, § Prose) et `taste-skill/skills/taste-skill/SKILL.md` §9.G « EM-DASH BAN » (interdiction totale côté taste-skill) | `docs/REDACTION.md` § 1 (mots/formules interdits) + `scripts/ff/verifier.mjs` (bloc Textes) : compter les `—` dans le texte visible d'une page, avertir au-delà du seuil. Pertinent pour ff-atelier car les textes sont rédigés par Claude en français — le risque de sur-emploi de l'em-dash existe aussi en français. |
| 5 | Contraste des textes secondaires sur fond coloré : jamais un gris générique | Teinter le texte secondaire depuis la teinte du fond/premier plan, jamais un gris neutre plaqué dessus. | `impeccable/skill/reference/craft-floor.md` ligne 9 (`skill-color-verify-contrast`) ; règle identique `impeccable/crates/foundation/src/registry.rs` (id `gray-on-color`) | `docs/CONVENTIONS.md` § Regles des directions (rappel dans le contrat `src/directions/README.md`) — actuellement nos directions dérivent déjà les couleurs par tokens, mais rien n'interdit explicitement un `text-muted` gris plaqué sur un fond `accent`/`ink` coloré. |
| 6 | Contraste séparé pour les contrôles/icônes/indicateurs de focus | **3:1 minimum**, distinct du texte de corps (4.5:1) et du grand texte (3:1) — trois seuils, pas un seul. | `impeccable/skill/reference/colorize.md` § Contrast and perception (tableau) | `docs/veille/rendu.md` § 7 (checklist 40 points, point 15) — actuellement notre checklist ne distingue que texte/fond, pas contrôles/icônes/focus séparément. |
| 7 | Un seul marqueur d'attention riche par page ("un feu d'artifice") formulé comme règle mécanique, pas seulement éditoriale | taste-skill : **au plus un `marquee` par page** — deux bandes défilantes ou plus = remplissage paresseux. Même logique pour l'alternance zigzag image/texte : **jamais 3 sections consécutives** avec le même schéma gauche-image/droite-texte. | `taste-skill/skills/taste-skill/SKILL.md` §4.7 « MARQUEE MAX-ONE-PER-PAGE » et « ZIGZAG ALTERNATION CAP » | Notre `docs/ANIMATION-PAR-METIER.md` § 1d (« règle du seul feu d'artifice ») dit déjà la même chose en prose ; la nouveauté est la **version mécanique, comptable** — à ajouter à `scripts/ff/verifier.mjs` : compter les `[data-marquee]` par page livrée (avertissement si > 1). |
| 8 | Cap de délai total sur un `stagger` de liste, indépendant du nombre d'éléments | « Cap the total delay » — un stagger sur une longue liste ne doit pas faire attendre la fin de la liste plus qu'un seuil global, contrairement à un délai fixe par élément multiplié par N. | `impeccable/skill/reference/animate.md` ligne 48 | `docs/ANIMATIONS.md` § `data-stagger` + `src/scripts/motion.ts` — actuellement `data-stagger="90"` est un délai fixe par enfant sans plafond documenté ; sur une grille de 12 services ça peut atteindre >1s avant que le dernier élément apparaisse. |
| 9 | Sortie plus rapide que l'entrée (« exit faster than entrance ») | Règle de timing explicite, non chiffrée précisément mais formulée comme principe général de motion. | `impeccable/skill/reference/animate.md` ligne 61 | `docs/veille/rendu.md` § 6 (Principes de motion) — absent de notre § 6.2 (durées M3) qui ne traite que l'entrée. |
| 10 | Clairance des descendantes en italique display (`y g j p q`) | Un mot italique en display avec descendante coupe si `line-height`/`leading` ≤ 1 — imposer **`leading` ≥ 1.1** et une réserve `padding-bottom`/`margin-bottom` sur le conteneur. | `taste-skill/skills/taste-skill/SKILL.md` §4.1 « ITALIC DESCENDER CLEARANCE (mandatory) » | `docs/CONVENTIONS.md` § 12 (le `<em>` dans `business.tagline` et les titres) — pertinent car nos directions stylisent `h1 em` en italique (`src/directions/README.md`) et nos taglines contiennent des mots avec descendantes en français (« géré », « projet », « garantie »...). |
| 11 | Longueur maximale d'un témoignage affiché | **Maximum 3 lignes de citation** (jamais 6) — un témoignage de landing page est un extrait, pas l'avis complet. | `taste-skill/skills/taste-skill/SKILL.md` §4.10 | `docs/REDACTION.md` § 6 (tableau des longueurs cibles) — notre ligne « Avis client (`proof.testimonials`) : texte recopié tel quel, jamais réécrit » ne fixe aucune longueur maximale d'affichage (troncature visuelle possible plutôt que réécriture). |
| 12 | Un seul intitulé de bouton par intention sur toute la page | Deux CTA différents mais de même intention (« Contactez-nous » / « Écrivez-nous » / « Discutons ») sur une même page = échec de pré-vol — un seul libellé par intention, répété partout (nav, hero, footer). | `taste-skill/skills/taste-skill/SKILL.md` §4.5 « NO DUPLICATE CTA INTENT (mandatory) » | `docs/DIRECTIONS.md` § Libellés / `wording.devis` — notre schéma a déjà un wording centralisé par site, mais rien ne vérifie qu'un même site ne mélange pas deux formulations différentes pour la même action. |
| 13 | CTA jamais sur 2 lignes au format desktop | Le texte d'un bouton principal doit tenir sur une ligne au format desktop ; corriger en raccourcissant le libellé (3 mots max, idéalement 1-2) plutôt qu'en élargissant artificiellement. | `taste-skill/skills/taste-skill/SKILL.md` §4.5 « CTA BUTTON WRAP BAN » | `docs/REDACTION.md` § 8 (Micro-copie, boutons) — absent, potentiellement addable en vérif visuelle (`ff captures`/`ff audit-motion`, mesure de hauteur du bouton). |
| 14 | Hauteur de nav plafonnée | **80px maximum au format desktop, 64-72px par défaut.** Nav sur une seule ligne obligatoire à `lg` (1024px) — sinon condenser les libellés ou passer au menu burger. | `taste-skill/skills/taste-skill/SKILL.md` §4.7 | `docs/CONVENTIONS.md` § Coquilles ou `docs/veille/rendu.md` § 7 — mesurable via `ff audit-motion` (hauteur calculée du premier `<nav>`). |
| 15 | Nombre d'éléments texte dans le hero plafonné à 4 | Eyebrow (0 ou 1) + titre (≤ 2 lignes) + sous-titre (≤ 20 mots, ≤ 4 lignes) + CTA (1 primaire + 1 secondaire max) — bannis dans le hero : mini-tagline sous les CTA, bandeau « utilisé par... », teaser de prix, liste de features. | `taste-skill/skills/taste-skill/SKILL.md` §4.7 « HERO STACK DISCIPLINE » | `docs/REDACTION.md` § 5 (test du titre de hero) — notre règle fixe déjà la longueur du titre/sous-titre (6-12 mots / ≤200 caractères) mais pas le nombre d'éléments distincts affichés dans le bloc hero pris comme un tout. |
| 16 | Radius de carte cohérent sur toute la page | Choisir **une seule échelle de rayon** (tout carré / tout doux 12-16px / tout pilule pour l'interactif) et s'y tenir ; un mélange n'est acceptable qu'avec une règle documentée et systématique (ex. « boutons en pilule, cartes en 16px, champs en 8px »). | `taste-skill/skills/taste-skill/SKILL.md` §4.4 « SHAPE CONSISTENCY LOCK » ; recoupé par Impeccable (id `design-system-radius`, `impeccable/crates/foundation/src/registry.rs`) | `docs/CONVENTIONS.md` § Regles des directions — nos tokens (`rounded-ui`, `rounded-card`) imposent déjà une cohérence de fait, mais la règle n'est écrite nulle part comme contrainte explicite contre un mélange manuel. |
| 17 | Bordure fine + ombre large et diffuse sur le même élément = signature IA reconnaissable | Choisir l'un ou l'autre (un bord net **ou** une élévation douce), jamais les deux empilés. | `impeccable/crates/foundation/src/registry.rs` (id `gpt-thin-border-wide-shadow`) | `scripts/ff/verifier.mjs` (CSS livré) — voir §4 (b) ci-dessous, addable par regex. |
| 18 | Rayures/dégradés répétés en fond décoratif, grille de lignes décorative en fond | Les motifs `repeating-linear-gradient` en rayures et les fonds « grille » en dégradés hairline tuilés sont des signatures IA reconnaissables — réserver la texture à un vrai support (photo, plan, carte). | `impeccable/crates/foundation/src/registry.rs` (id `repeating-stripes-gradient`, `codex-grid-background`) | `docs/DIRECTIONS.md` § Textures — à vérifier une fois sur `data-grain`/`body::before` (déjà motivé par une vraie texture de fond, `docs/ANIMATIONS.md` § Nouveaux effets 100% CSS, donc probablement déjà conforme) plutôt qu'à interdire mécaniquement. |

---

## 3. Règles déjà couvertes chez nous

| Règle | Où chez nous |
|---|---|
| `text-wrap: balance` sur les titres, `pretty` sur les paragraphes | `src/styles/global.css` (voir `docs/veille/rendu.md` § 8, diff déjà appliqué) |
| Mesure de lecture 65ch (`--measure`) distincte du conteneur | `src/styles/global.css` `--measure: 65ch` |
| Tracking négatif sur les titres display (`--display-tracking: -0.02em`) | `src/styles/global.css` |
| `text-underline-offset` + épaisseur de soulignement dédiée | `src/styles/global.css` (`a { text-underline-offset: 0.15em; ... }`) |
| `scrollbar-color` lié aux tokens de direction | `src/styles/global.css` |
| Chiffres tabulaires disponibles | `src/styles/global.css` (utilitaire `tabular-nums`, cf. diff `rendu.md` § 8) |
| Contraste 4.5:1 mesuré automatiquement sur `.eyebrow`/`.text-muted` | `scripts/ff/audit-motion.mjs` (fonction `contrastIssues`) |
| `prefers-reduced-motion` neutralise toutes les animations | `src/styles/global.css` bloc motion, documenté `docs/ANIMATIONS.md` en-tête |
| Easing exponentiel par défaut (pas de bounce/élastique) | `src/styles/global.css` `--ease-out-expo`, tokens `MOTION` |
| Aucun avis/chiffre inventé, aucun superlatif sans preuve | `CLAUDE.md` règle 2, `docs/REDACTION.md` § 1, contrôlé par `scripts/ff/verifier.mjs` |
| Vouvoiement obligatoire, tutoiement détecté | `docs/REDACTION.md` § 2, `scripts/ff/verifier.mjs` (`warnTutoiementTextes`) |
| Titre de hero ≤ 12 mots, sous-titre ≤ 200 caractères | `docs/REDACTION.md` § 5, `scripts/ff/verifier.mjs` (`warnHeroTropLongTextes`) |
| Formulaire ≤ 5 champs hors honeypot, honeypot obligatoire | `docs/REDACTION.md` § 8, `scripts/ff/verifier.mjs` (`warnFormulaireTropLong`, `checkHoneypot`) |
| `<img>` sans `alt`, sans dimension/`loading` | `scripts/ff/verifier.mjs` |
| Un seul `<h1>` par page, `<html lang="fr">` | `scripts/ff/verifier.mjs` |
| Grille d'images à ratio cohérent | `scripts/ff/verifier.mjs` (`checkGrilleImagesRatioCoherente`), recoupe `rendu.md` § 7 point 18 |

---

## 4. Les 61 règles de détection Impeccable, classées

Source unique : `impeccable/crates/foundation/src/registry.rs` (liste `ANTIPATTERNS`, 61 entrées entre
`side-tab` et `image-hover-transform`, confirmé par comptage direct dans le fichier).

**(a) Déjà couvertes par `scripts/ff/verifier.mjs` ou `scripts/ff/audit-motion.mjs`** (vérifié par
lecture des deux fichiers en entier) :

| id Impeccable | Détecte | Chez nous |
|---|---|---|
| `broken-image` | `<img>` sans `src`/`src` placeholder | `verifier.mjs` → `checkImagesReferencees` (404 sur toute image/vidéo/anim référencée) |
| `content-hidden-at-rest` | Texte resté invisible après le scroll (reveal cassé) | `audit-motion.mjs` → `revealStuck` |
| `text-overflow` | Contenu qui déborde de son conteneur | `audit-motion.mjs` → `overflowX` |
| `low-contrast` | Contraste texte/fond < seuil WCAG | `audit-motion.mjs` → `contrastIssues` (seuil 4.5:1) |
| `oversized-h1` | Titre en taille display qui domine tout le viewport | `audit-motion.mjs` → `typography` (règle `fontSize > 90% de la largeur d'écran`) |
| `marketing-buzzword` (partiel) | Superlatifs/formules marketing génériques | `verifier.mjs` → `checkMotsInterditsTextes`/`warnMotsASurveillerTextes` (liste différente, orientée droit de la consommation FR plutôt que jargon SaaS anglophone, mais même principe) |

**(b) Ajoutables facilement à notre verifier** (règle regex/DOM, sans navigateur ou avec l'infrastructure
Playwright déjà en place dans `audit-motion.mjs`) :

| id Impeccable | Détecte | Faisabilité chez nous |
|---|---|---|
| `side-tab` / `border-accent-on-rounded` | Bordure colorée épaisse sur un seul côté d'une carte arrondie | Regex CSS livré : `border-(left\|right)\s*:\s*[2-9]px` combiné à `border-radius` non nul sur le même sélecteur — franchement addable à `verifier.mjs` (scan des `.css` de `dist/<slug>`) |
| `gradient-text` | Texte en `background-clip: text` + dégradé | Regex CSS : présence de `background-clip:\s*text` — trivial |
| `gpt-thin-border-wide-shadow` | Bordure fine + ombre large diffuse sur le même élément | Regex CSS plus complexe (repérer un même bloc de règle avec `border: 1px` et `box-shadow` à grand flou) — faisable, moins immédiat |
| `repeating-stripes-gradient` | Rayures décoratives en `repeating-linear-gradient` | Regex CSS : `repeating-linear-gradient` — trivial à repérer, jugement humain ensuite (nos directions en ont-elles un usage volontaire ?) |
| `codex-grid-background` | Fond « grille de lignes » décoratif en dégradés hairline tuilés | Regex CSS plus complexe (plusieurs `linear-gradient` fins + `background-size` en pixels fixes) |
| `dark-glow` / `radial-halo` | Halo `radial-gradient` chromatique décoratif sur fond sombre | Regex CSS : `radial-gradient` saturé combiné à un fond sombre — faisable mais faux positifs probables (notre `data-spotlight` volontaire, voir § 5) |
| `bounce-easing` | Easing élastique/rebond (`cubic-bezier` avec dépassement, mots-clés `elastic`/`bounce`) | Regex CSS/JS sur les valeurs de `transition-timing-function`/GSAP `ease:` — faisable |
| `italic-serif-display` | Serif italique surdimensionné en hero | Détectable en partie : `font-style: italic` sur un sélecteur `h1`/`.text-display-*` avec une police serif — jugement final humain (brief-driven chez nous, cf. § 5) |
| `pulsing-dot` | Petit point avec animation `pulse` décorative | Regex CSS : `animation` contenant `pulse` sur un petit élément (`width`/`height` < 12px) — faisable, faible priorité (pas de pattern « statut en ligne » chez nous) |
| `all-caps-body` | Long passage en majuscules | Detectable via `text-transform: uppercase` sur un sélecteur de paragraphe/texte long — faisable |
| `wide-tracking` | `letter-spacing` > 0.05em sur du texte de corps | Regex CSS sur les déclarations `letter-spacing` en dehors des sélecteurs `.eyebrow`/labels connus — faisable |
| `justified-text` | `text-align: justify` sans césure | Regex CSS trivial |
| `tiny-text` / `undersized-ui-text` | `font-size` < 12px (corps) ou < 11px (UI) | Regex CSS sur les valeurs `font-size` en px/rem — faisable, recoupe `rendu.md` § 7 point 1 |
| `skipped-heading` | Niveaux de titre qui sautent (`h1` puis `h3`) | Faisable en HTML statique : parser la séquence des balises `h1`-`h6` par page dans `dist/<slug>` |
| `design-system-font` / `-color` / `-radius` / `-font-size` | Valeur hors du système de tokens documenté | Chez nous, l'équivalent naturel est un grep de couleurs/tailles/rayons **en dur** dans `src/sections/**/*.astro` (la règle dure « uniquement les tokens », `CLAUDE.md` règle 1) — pas encore un check automatique dans `verifier.mjs`, alors que c'est déjà une règle dure du repo |

**(c) Non pertinentes pour des sites vitrines statiques d'artisans** (nécessitent soit une UI produit
dynamique — dashboards, listes de données, formulaires multi-étapes — soit une analyse visuelle/SVG trop
fine pour un regex, soit ciblent un contexte qu'un site vitrine mono-page n'a pas) :

`monotonous-spacing`, `nested-cards`, `shape-assembled-illustration`, `organic-clip-path`,
`buried-raster`, `blinking-cursor`, `numbered-section-labels`, `aphoristic-cadence`,
`extreme-negative-tracking` (déjà couvert par notre token `--display-tracking` fixe, peu de risque de
dérive), `script-error` (pas de JS dynamique de données côté client sur nos sites statiques, sauf
formulaire/motion déjà testés par `ff captures`), `edge-flush-cards`, `text-occlusion`,
`first-viewport-column-overflow`, `layout-transition` (nos animations passent déjà par `transform`/
`opacity`, cf. `docs/ANIMATIONS.md`), `line-length` / `cramped-padding` / `body-text-viewport-edge` /
`tight-leading` / `heading-rhythm` (couverts en prose par `docs/veille/rendu.md` §§ 1-2 mais pas
automatisés, jugement visuel nécessaire), `clipped-overflow-container`, `image-hover-transform`
(nous avons `data-tilt`/`data-hover-img` volontaires, pas un survol générique à bannir), `theater-slop-
phrase` (spécifique au registre de copy SaaS anglophone), `flat-type-hierarchy` (dépend de l'échelle
`scale` choisie par direction, jugement humain), `ai-color-palette` (nos 8 directions ont des palettes
fixes curées à la main, pas générées à la volée), `marquee`/`icon-tile-stack`/`radial-spotlight-glow`/
`hero-eyebrow-chip` (déplacés en § 5, ce sont des tensions avec nos effets volontaires plutôt que des
règles à importer telles quelles).

---

## 5. Ce qui serait contraire à nos règles dures ou à notre système — à ne pas importer

1. **Stack entière de taste-skill.** React/Next.js, Tailwind + `dark:` variant, Motion/Framer Motion,
   GSAP en dépendance directe, shadcn/Radix (`taste-skill/skills/taste-skill/SKILL.md` §3.A) —
   ff-atelier est Astro statique, zéro JS par défaut, une seule stack CSS-first (`docs/CONVENTIONS.md`
   § Stack, `CLAUDE.md`). Rien de la § 3 « Default Architecture » de taste-skill ne s'applique : pas de
   Server/Client Components, pas de `useState`/Zustand, pas de bibliothèque d'icônes React.
2. **Génération d'images/logos inventés.** taste-skill impose de générer une photo par section via un
   outil d'image IA, ou à défaut des images de banque `picsum.photos`/Unsplash génériques, et même un
   **monogramme SVG inventé** si le nom de marque est fictif (`taste-skill/skills/taste-skill/SKILL.md`
   §4.8 « Priority order for visual assets », « Make-up the brand name? Then make-up an SVG mark too »).
   C'est directement contraire à notre règle dure n°2 (`CLAUDE.md`, « jamais de donnée inventée ») et à
   la règle IA stricte de `.claude/skills/nouveau-site/SKILL.md` étape 5 : une image générée par IA est
   **interdite** sur `portrait`/`team`/`gallery`/`beforeAfter`, ces champs restent absents tant que le
   client n'a pas fourni de vraies photos. Un « logo » ou une photo inventés pour un artisan réel
   seraient une pratique commerciale trompeuse.
3. **Chiffres/specs « esthétiquement précis ».** taste-skill tolère des nombres comme `92%`/`4.1×`/
   `48k` tant qu'ils sont « labellisés mock » (`taste-skill/skills/taste-skill/SKILL.md` §4.9 « Fake-
   precise numbers are flagged »). Chez nous, aucune donnée fictive n'est acceptable même étiquetée
   "exemple" dans un `site.config.ts` livré — `CLAUDE.md` règle 2 est absolue, sans mécanisme
   d'étiquetage "mock" toléré en production.
4. **Bannissement mécanique de `marquee`/`icon-tile-stack`/`radial-spotlight-glow`/`hero-eyebrow-chip`
   comme s'ils étaient toujours décoratifs.** Chez nous, ces quatre motifs sont des effets **documentés
   et intentionnels** de notre propre bibliothèque, pas des réflexes de générateur : `data-marquee`
   (bande défilante logos/villes, `docs/ANIMATIONS.md`), `data-spotlight` (halo CTA en section sombre,
   même doc), l'icône au-dessus d'un titre dans `src/sections/Services/grid.astro` (section de
   référence citée par `docs/CONVENTIONS.md`), et l'eyebrow lui-même comme convention typographique
   documentée (`src/styles/global.css` classe `.eyebrow`, tracking 0.18em). Importer le ban
   « outright » d'Impeccable sur le kicker casserait une convention entière de nos 8 directions sans
   distinguer l'usage volontaire de l'usage réflexe — voir la recommandation nuancée en § 2 ligne 1
   (compter, pas bannir).
5. **Une section qui lit des props au lieu de `site` directement.** Les deux outils raisonnent en
   composants React qui reçoivent des props (`taste-skill/skills/taste-skill/SKILL.md` exemples de
   code) — cela heurte notre règle dure n°3 (`CLAUDE.md`) : une section Astro importe `site` depuis
   `@/lib/site`, jamais de props. Rien à transposer telle quelle depuis les squelettes de code fournis.
6. **`DESIGN_VARIANCE`/`MOTION_INTENSITY`/`VISUAL_DENSITY` comme dials globaux par projet.** Chez nous
   la variété vient du couple direction + variantes + `ff variete` (sélecteur qui maximise la distance
   avec les sites déjà livrés, `.claude/skills/nouveau-site/SKILL.md` étape 2) et de la méthode en 5
   questions par métier (`docs/ANIMATION-PAR-METIER.md`) — un système à 3 curseurs numériques
   dupliquerait un mécanisme qui existe déjà sous une autre forme, plus fine (par métier, pas par
   défaut global).

---

## 6. Recommandation finale

**Ne pas installer les deux skills tels quels.** Impeccable cible une stack React/Next générique avec
un moteur propriétaire externe (binaire Rust téléchargé) inadapté à un pipeline Astro statique
mono-repo ; taste-skill est explicitement câblé sur React/Motion/GSAP et impose la génération d'images
et de logos inventés, contraire à notre règle dure n°2. **Distiller, pas plaquer** : les deux tableaux
§2 (eyebrow rationné, familles de police à surveiller, longueur de témoignage, cap marquee/zigzag,
clairance des descendantes italiques) valent la peine d'être ajoutés à `docs/CONVENTIONS.md`,
`docs/REDACTION.md` et `docs/DIRECTIONS.md`, et une dizaine de règles de la colonne (b) du §4 (bordure
accent + coin arrondi, texte en dégradé, majuscules longues, titres qui sautent un niveau, tailles hors
tokens) sont des ajouts mécaniques peu coûteux à `scripts/ff/verifier.mjs`. Le vrai signal utile n'est
pas le code des deux dépôts mais leur **convergence indépendante** sur l'eyebrow, les polices trop vues
et les palettes crème/laiton — ces trois points méritent une vraie décision de studio, pas juste une
ligne de doc.
