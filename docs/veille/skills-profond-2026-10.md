# Veille profonde : skills et agents de design et de relecture front (octobre 2026)

Veille du 16 octobre 2026, suite de `docs/veille/outils-2026-10.md` (veille rapide du 15). Lecture seule : rien
installé, aucun build, aucun navigateur. Les fichiers ont été lus sur `raw.githubusercontent.com` et l'arbre de
chaque dépôt sur l'API GitHub (`git/trees/main?recursive=1`), pour voir **tous** les fichiers et pas seulement le
README. Pour chaque dépôt, la fiche dit honnêtement ce qui a été lu en entier et ce qui ne l'a pas été.

Ce document ne répète pas `outils-2026-10.md` (verdicts des skills locales, 28 règles empruntées, liste noire) ni
`skills-design-ia.md` (61 détecteurs Impeccable classés). Il cherche autre chose : **les mécanismes** (comment un
relecteur est cadré, comment il note, quand on s'arrête, comment on l'empêche d'être complaisant, comment on
découpe en agents) pour que `/site-final` rende un site « à montrer » en une passe.

## TL;DR

- **Le meilleur matériau est chez Impeccable** (`critique.md`, `audit.md`, agent `impeccable-finish-reviewer`,
  `new-work.md` § 5-7) : relecteur frais **sans navigateur** qui juge sur des captures fournies, contrôle de
  validité des captures avant toute note (« recapture »), verdict en **quatre mots** dérivés et non ressentis,
  passe de verdict qui note chaque correctif résolu/partiel/non résolu **sur les nouvelles captures**, deux tours
  au plus, contrat de direction écrit avant le code, test de mémoire du premier écran.
- **taste-skill v2 a été réécrite** (414 lignes, ≠ la version installée localement) : inventaire de 8-12 faits
  propres au client, phrase-idée, **test du concurrent**, 14 passes de regard sur captures, **note de juré
  pondérée avec plafonds**, format de tour figé, trois tours au plus, « ne pas arrondir ».
- **Anti-complaisance** : wshobson `ui-visual-validator` (« par défaut, l'objectif n'est PAS atteint »),
  Emil `review-animations` (« approbation méritée », hiérarchie de remède qui commence par **supprimer**),
  gstack (« deux agents d'accord = une seule donnée »), Anthropic `code-review` (**barème de confiance 0-100,
  seuil 80**), jschulte `health-audit-ux` (règle de preuve en quatre points, « ce qui n'a pas été retenu »).
- **Une passe sans fondateur** : jschulte `deliver-me` (« décider, noter, continuer » ; compte rendu « décisions
  prises pour vous, avec l'alternative et comment basculer ») et `whats-left` (pas de queue de suggestions :
  chaque point est fait, consigné ou abandonné).
- **Découverte technique utile tout de suite** : Emil `animation-performance` explique notre piège iPhone
  (`--p`) : une variable CSS animée sur un parent recalcule le style de **tous** les descendants à chaque image.
- **Refusé au nom de `GOUT.md`** : données d'exemple inventées (taste, Impeccable), plancher de mouvement
  « 8 éléments qui bougent, une entrée par section » (taste), « fond uni interdit, mettre une texture » (gstack),
  génération d'images IA en priorité (Impeccable comp-first), questions posées à l'utilisateur en cours de route
  (Impeccable, wshobson, ui-design), cinq agents en parallèle (Anthropic code-review), voix externe Codex (gstack).
- **REA et le « reverse-engineer » de jschulte ne sont pas des outils de design** : REA fait de la
  rétro-ingénierie de binaires ; StackShift a été retiré du dépôt jschulte (dépôt `jschulte/stackshift` : 404).
- Section 2 : **17 changements** prêts à coller dans `.claude/skills/site-final/SKILL.md`, dont les deux prompts
  complets des relecteurs, une grille chiffrée à seuils, le format de tour et les critères d'arrêt.

---

## 1. Fiches par dépôt

### 1.1 anthropics/skills (frontend-design, webapp-testing, brand-guidelines, theme-factory)

- **Lien** : <https://github.com/anthropics/skills>. **Licence** : Apache 2.0 (`LICENSE.txt` par skill).
- **Lu en entier** : oui pour `frontend-design/SKILL.md`, `webapp-testing/SKILL.md`, `brand-guidelines/SKILL.md`,
  `theme-factory/SKILL.md`. Non lus : `webapp-testing/examples/*.py` et `scripts/with_server.py` (la skill dit
  elle-même de les utiliser en boîte noire), les 10 thèmes de `theme-factory/themes/`, `canvas-design` et
  `algorithmic-art` (affiches et art génératif, hors sujet).
- **Ce que ça fait vraiment** : `frontend-design` a changé depuis la veille rapide. Il nomme désormais **cinq
  grappes** de pages générées (fond crème `#F4F1EA` + serif + terracotta `#D97757` ; noir + accent acide ;
  broadsheet à filets ; kit de cartes SaaS ; chrome de gabarit : eyebrow, « A · B · C », « MOT — fragment »,
  `#111`, mono pour petites données, « → »). Il impose **deux passes** : un plan compact (4-6 couleurs nommées,
  polices et rôles, maquette ASCII, principes), puis **relire le plan contre le brief** avant le code (« refais un
  prompt similaire : si tu arrives au même endroit, c'est un défaut, change-le et dis pourquoi »). Il demande de se
  critiquer sur captures (« une image vaut 1 000 jetons ») et de **noter ce qu'on a déjà essayé** pour ne pas se
  répéter. `webapp-testing` : « reconnaissance puis action » (attendre `networkidle`, capturer, puis choisir les
  sélecteurs). `brand-guidelines` et `theme-factory` : application de palettes, sans mécanisme de relecture.
- **Mécanismes réutilisables** : relecture du plan contre le brief **avant** de construire ; « dépense ton audace
  à un seul endroit » ; « avant de sortir, enlève un accessoire » (Chanel) ; journal de ce qui a été essayé.
- **On prend** : la relecture du plan avant le code (changement 2), le journal d'essais (= `docs/SIGNATURES.md` +
  `relecture.md`, changement 15), la liste des cinq grappes comme calibration (changement 3).
- **On refuse** : « confirme le sujet avec le client » (pas d'aller-retour : le brief fait foi) ;
  `theme-factory` (10 thèmes figés = l'inverse de la variété par squelette).

### 1.2 anthropics/claude-plugins-official (frontend-design, code-review, pr-review-toolkit, ralph-loop, playground)

- **Lien** : <https://github.com/anthropics/claude-plugins-official>. **Licence** : par plugin (`LICENSE`),
  Apache 2.0 pour ceux lus.
- **Lu en entier** : `plugins/code-review/commands/code-review.md`, `plugins/pr-review-toolkit/agents/code-reviewer.md`.
  Partiel : `ralph-loop/README.md` (120 premières lignes), `playground/.../design-playground.md` (80 lignes).
  `plugins/frontend-design/skills/frontend-design/SKILL.md` comparé par `diff` à celui d'anthropics/skills :
  **identique**. Aucun plugin « design review » officiel n'existe dans la liste des 53 plugins.
- **Ce que ça fait vraiment** : `code-review` lance un agent d'éligibilité, un agent qui liste les `CLAUDE.md`, un
  agent de résumé, **5 relecteurs en parallèle** sur des angles distincts (conformité `CLAUDE.md`, bugs, historique
  git, anciennes PR, commentaires du code), puis **un agent noteur par constat** avec un barème de confiance
  donné **mot pour mot** (0 faux positif, 25 incertain, 50 réel mais mineur, 75 vérifié et important, 100
  certain), et **jette tout ce qui est sous 80**. Liste explicite de faux positifs (préexistant, ce qu'un linter
  attrape, pinaillage qu'un senior ne relèverait pas). `pr-review-toolkit/code-reviewer` : même barème, « ne
  rapporte que ≥ 80 », regroupe Critique 90-100 / Important 80-89. `ralph-loop` : un hook Stop renvoie le même
  prompt jusqu'à une **promesse de fin** (`<promise>COMPLETE</promise>`) et `--max-iterations`.
- **Mécanismes réutilisables** : barème de confiance verbatim et seuil ; liste des faux positifs ; constat lié à
  une règle écrite = confiance haute seulement si la règle le dit **explicitement** ; critère d'achèvement écrit
  à l'avance + plafond d'itérations.
- **On prend** : le barème (changement 6), la liste de faux positifs adaptée (changement 6), la « promesse de
  fin » sous forme de critères d'arrêt écrits (changement 10).
- **On refuse** : 5 relecteurs + N noteurs en parallèle (mémoire `feedback-limite-agents-paralleles` : 2-3 au
  plus) ; on garde **deux** relecteurs et le parent applique le seuil lui-même ; la boucle Stop-hook infinie
  (on plafonne à deux tours).

### 1.3 Impeccable (pbakaus/impeccable)

- **Lien** : <https://github.com/pbakaus/impeccable>. **Licence** : Apache 2.0. Version lue : 4.6.0 (dépôt
  poussé le 16 oct 2026).
- **Lu en entier** : `SKILL.md`, `reference/critique.md` (819 l.), `audit.md`, `polish.md`, `craft-floor.md`,
  `init.md`, `component-review.md`, `region-map.md`, `routing.md`, `.claude/agents/impeccable-finish-reviewer.md`.
  Partiel : `new-work.md` (§ 4 à 7 en entier, § 1 à 3 en diagonale). Non lus : les 30 autres références
  (`bolder`, `typeset`, `quieter`…), le binaire `scripts/impeccable`, les agents `documenter`/`asset-producer`.
  `ff detect` utilise déjà ses 61 règles (voir `skills-design-ia.md`).
- **Ce que ça fait vraiment** :
  - `critique` : **deux évaluations isolées en sous-agents parallèles**, A (regard de directeur artistique) et B
    (détecteur + navigateur), qui ne voient pas la sortie l'une de l'autre ; « A doit finir avant que les
    constats du détecteur n'entrent dans la synthèse : un détecteur déterministe ancre quand même le jugement ».
    Un passage en un seul contexte est un **mode dégradé** qui doit s'annoncer en première ligne. Note Nielsen
    10 × 0-4 avec `n/a` renormalisé (« la plupart des interfaces font 20-32/40 ; un 4 veut dire vraiment
    excellent »), P0-P3, **personas** choisis par type de page (vitrine : Jordan qui découvre, Riley qui pousse
    aux limites, Casey sur téléphone d'une main), instantané persistant et **tendance** sur 5 passages, fichier
    `ignore.md` qui fait taire les constats acceptés.
  - Agent `finish-reviewer` : **pas de navigateur**, juge sur les captures que le parent lui passe ; **contrôle 0
    « preuve »** : si une capture manque ou est invalide (zone noire, mauvaise section, haut de page absent), il
    renvoie `disposition: recapture` et **rien d'autre** (« un verdict tiré d'une capture cassée blanchit la
    casse en approbation »). Il inventorie d'abord ce qu'il voit **avant** de lire le contrat du constructeur.
    Verdict en **quatre mots** (`recapture`, `rebuild`, `fix`, `ship`) « dérivé, jamais ressenti » ; « tu es le
    dernier barrage, pas un collègue qui adoucit » ; « le parent rapporte ton mot tel quel et n'a pas autorité
    pour l'adoucir ». Au plus 8 corrections matérielles + une ligne `keep` (ce qu'il ne faut pas diluer). Budget
    de lecture : « vers le dixième tour, arrête de lire et écris ». **Passe de verdict** : sur les nouvelles
    captures, chaque correctif est `resolved`/`partial`/`unresolved` ; « le récit du parent n'est pas une preuve »
    ; au plus 3 régressions ; jamais `ship` avec un partiel ouvert.
  - `new-work.md` § 5 : **contrat de direction** écrit avant le code (THESIS, OWN-WORLD, STORY, FIRST VIEWPORT,
    FORM, FINISH), jamais copié dans le code livré. § 6 : « le premier écran est une thèse, pas un en-tête » ;
    **test de mémoire** (« si quelqu'un part après un écran, que décrira-t-il une heure plus tard ? Si c'est une
    ambiance, le concept n'est pas engagé »). § 4 : « ton **a priori de rendu** mesuré : sujets chaleureux,
    familiaux, livresques → fond crème, serif à italique, lumière de lampe. Considère cette première palette comme
    déjà dépensée. » § 7 : **deux tours d'inspection au plus**, corrections groupées entre les tours ;
    « le relecteur ne s'exécute jamais dans le fil de construction et n'en hérite jamais : un relecteur qui hérite
    de ton historique hérite de ton cadrage, ton optimisme et tes abstractions » ; s'arrêter **dès qu'un tour ne
    résout rien**.
  - `audit` : 5 dimensions 0-4 (/20, bandes), P0-P3, « garde peu de P3 : une longue traîne enterre ce qui
    compte ». `polish` : ordre de triage (bloquant → états manquants → hiérarchie/responsive → visuel/mouvement →
    nettoyage). `craft-floor` : liste « Refuse » (eyebrow = interdit absolu, numéros 01/02/03, texte en dégradé,
    bordure gauche colorée > 1 px, ombre décalée dure, mono costume, glyphes à la place d'icônes) et « Browser
    surfaces » (sélection, caret, barres de défilement, anneau de focus, soulignement : « le signal le moins cher
    qu'une page a été construite et pas assemblée »).
- **Mécanismes réutilisables** : isolation A/B ; relecteur frais sans navigateur sur captures fournies ;
  contrôle de validité des captures ; inventaire avant contrat ; verdict en mots dérivés ; passe de verdict ;
  plafond de deux tours ; arrêt quand un tour ne résout rien ; contrat de direction ; test de mémoire ; a priori de
  rendu ; fichier d'acceptations ; tendance.
- **On prend** : presque tout l'appareil de relecture (changements 1, 4, 5, 7, 8, 9, 10, 11, 14, 15, 16).
- **On refuse** : la voie « comp-first » (générer une image de maquette puis la reproduire : règle dure n° 2 et
  `GOUT.md` § 1) ; « Demonstration data authored and labeled synthetic » pour un client réel (`GOUT.md` § 5 :
  rien d'inventé ; toléré seulement sur une démo qui dit « aucun client derrière ») ; « Reach past transform:
  blur, backdrop-filter » (halo, verre : `GOUT.md` § 2) ; les questions `AskUserQuestion` en fin de critique et
  pendant `init` (une passe, pas d'aller-retour) ; le tirage au dé `concept-seed` (notre variété vient de
  `ff composer` / `ff variete`).

### 1.4 Vercel Web Interface Guidelines (vercel-labs/web-interface-guidelines)

- **Lien** : <https://github.com/vercel-labs/web-interface-guidelines>. **Licence** : MIT.
- **Lu en entier** : oui, les deux fichiers de règles (`command.md`, 191 l. ; `AGENTS.md`, 156 l.). Non lu :
  `install.sh`.
- **Ce que ça fait vraiment** : une commande de relecture « lis les fichiers, vérifie contre les règles, sortie
  `fichier:ligne`, sans préambule, ✓ pass par fichier propre ». `AGENTS.md` est la version MUST/SHOULD/NEVER,
  plus riche : « vérifier mobile, portable, **ultra-large (simuler à 50 % de zoom)** », « contraste : préférer
  APCA à WCAG 2 », « augmenter le contraste au `:hover`/`:active`/`:focus` », « rayons imbriqués : enfant ≤
  parent », « ombres en couches (ambiante + directe) », « tester iOS en économie d'énergie et Safari macOS »,
  « pas d'impasse : toujours une suite ».
- **Mécanismes réutilisables** : sortie terse et cliquable ; « ✓ pass » explicite par fichier (un relevé vide se
  dit) ; règles à trois forces (MUST/SHOULD/NEVER).
- **On prend** : le format `fichier:ligne` (déjà dans la skill) et le « ✓ rien à signaler » explicite
  (changement 6) ; la vérification « ultra-large » ajoutée aux passes de regard (changement 5, passe 10).
- **On refuse** : la partie React/hydratation, « Title Case » (anglais), « URL reflète l'état » (sites
  vitrines). Les contrôles mécaniques sont déjà listés pour `ff verifier` dans `outils-2026-10.md` § 2.2.

### 1.5 taste-skill v2 (Leonxlnx/taste-skill, skill `design-taste-frontend`)

- **Lien** : <https://github.com/Leonxlnx/taste-skill>. **Licence** : MIT.
- **Lu en entier** : `skills/taste-skill/SKILL.md` (414 l.), `references/critique.md` (171 l.),
  `references/tells.md` (115 l.), `evals/evals.json`. Partiel : `scripts/inspect.mjs` (boucle principale et
  règles de défilement). Téléchargés mais non lus : `copy.md`, `type.md`, `colour.md`, `layout.md`, `motion.md`,
  `imagery.md`, `research.md`, `lib/probe.mjs`, `lib/rules.mjs`, `lint.mjs`. Attention : la skill installée
  localement (`~/.claude/skills/design-taste-frontend`, 1 206 l.) est l'ancienne v2 expérimentale ; la v2 du
  dépôt est une **réécriture** avec scripts et bibliothèque (247 sites étudiés).
- **Ce que ça fait vraiment** :
  - **Inventaire du sujet** : 8 à 12 choses qui appartiennent à ce client et à aucun concurrent (nom et sens,
    rue et numéro, ce qu'on voit dans la rue, chiffres du brief, contrainte « une fournée par jour », matières,
    rituels et horaires « le four allumé à 5 h », imprimés du métier). « Dans les tests à l'aveugle, la page
    gagnante sortait d'un élément de cette liste. »
  - **La phrase-idée** : « Sur cette page, **[quelque chose du sujet]** devient **[le dispositif]** », et le
    **test du concurrent** : mettre le concurrent le plus proche dans la phrase ; « si elle marche encore, l'idée
    est celle du métier : une miche de pain, c'est toutes les boulangeries ; les sept portes de la rue qui donne
    son nom à celle-ci, c'est elle seule ».
  - **« Une chose vivante »** : une seule chose que le visiteur peut faire, tirée de l'idée (le poêle est-il
    allumé, combien de temps avant le dernier ferry) ; marche au pouce, repli sans script, ne bloque pas la
    lecture.
  - **Regarder** (`critique.md`) : « juge seulement les images ; tu as écrit le code, tu y lirais tes
    intentions ». 14 passes séparées (une seconde, plisser les yeux, cacher le logo, bords gauches, espace,
    typo, couleur, images, uniformité « un mot par section », téléphone, plein/vide, contenu complet,
    collisions, concurrent + chose vivante). **Note de juré** pondérée design 40 / usage 30 / créativité 20 /
    contenu 10, ancres par palier, **calibration** (« un vrai Site of the Day fait 7,5-8,0 ; si ta première note
    est 9, renote comme le juré qui ne l'a pas construit »). **Plafonds** qui priment sur l'arithmétique (un FAIL
    restant → 6,0 ; un eyebrow visible → 6,5 ; page qui pourrait être à n'importe qui → créativité ≤ 6 ; bande
    vide où un reveal n'a pas joué → usage ≤ 5…). **Format de tour figé** (ROUND n, vu en une seconde, idée,
    chose vivante, un mot par section, notes, plafonds, trois problèmes avec la capture où ils se voient).
    **Ordre de correction** (idée > hiérarchie > composition > typo > images > couleur > détail > mouvement ;
    « les suivants ne rattrapent pas les précédents »). **Arrêt** : trois tours au plus, plus tôt si un tour ne
    trouve rien qu'un inconnu remarquerait ; sous 7,5 au troisième tour, « dis-le, ne l'arrondis pas ».
  - `inspect.mjs` : défile **écran par écran** à 1440/768/390, photographie chaque écran et mesure ce qui ne se
    voit qu'en défilant : **texte couvert** par un autre élément à une position de défilement (FAIL), **texte
    rogné** en haut (FAIL), **écrans presque vides** (< 20 % de surface occupée, FAIL à partir de deux),
    **même grand texte trois écrans de suite** (pin trop long, WARN), page immobile.
  - `evals.json` : 6 briefs, un agent avec la skill contre un sans, **juge à l'aveugle** sur captures.
- **Mécanismes réutilisables** : inventaire + phrase-idée + test du concurrent ; passes de regard séparées ;
  note pondérée à plafonds ; format de tour ; ordre de correction ; arrêt à seuil sans arrondi ; mesures au
  défilement ; évaluation à l'aveugle.
- **On prend** : changements 1, 3, 5, 6, 9, 10 ; les mesures « texte couvert / écran vide / pin long » comme
  passes à l'œil sur `ff planche` (et piste d'outil pour `planche.mjs`, hors de cette veille).
- **On refuse** : « Sample details are expected where the brief leaves gaps (dish names, room names and rates) »
  (`GOUT.md` § 5 et règle dure n° 2) ; le **plancher de mouvement** (« échoue sous 8 éléments qui bougent, une
  entrée pour les parties de chaque section ») contredit « un seul feu d'artifice » et `CONVENTIONS.md`
  règle 21 ; « au moins quatre vraies images, souvent 6 à 12 » (un artisan sans photos ne doit pas être comblé
  de banque d'images ; archives seulement pour un bloc patrimoine, cf. `outils-2026-10.md` § 3) ; le tirage de
  direction par script (`ff composer` existe) ; l'interdiction générale des filets fins et des ombres (pas dans
  `GOUT.md`, nos directions utilisent `divider: rule`).

### 1.6 Emil Kowalski (emilkowalski/skills)

- **Lien** : <https://github.com/emilkowalski/skills>. **Licence** : MIT.
- **Lu en entier** : `review-animations/SKILL.md`, `improve-animations/AUDIT.md`. Presque entier :
  `animation-performance/SKILL.md` (l. 22-222). En-têtes seulement : `review-animations/STANDARDS.md`. Les autres
  (`animate`, `break-ui`, `mobile-native`, `prototype`…) ont été lus dans leur copie locale par la veille du 15.
- **Ce que ça fait vraiment** : `review-animations` : « Default to flagging. Approval is earned. » Dix normes non
  négociables, **déclencheurs d'escalade** à relever à vue, **hiérarchie de remède** dont le premier échelon est
  **supprimer l'animation**, puis réduire, puis corriger l'easing, l'origine, l'interruptibilité, le GPU.
  Sortie : un seul tableau Avant/Après/Pourquoi, puis un verdict **Bloquer / Approuver** avec critères écrits.
  `animation-performance` : « ne conclus jamais "ça va" depuis une machine rapide ; dis ce qui est vérifié dans le
  code et ce qui demande un enregistrement sur un vrai appareil » ; **piège des variables CSS héritées** : « une
  variable changée sur un parent recalcule le style de chaque enfant, à chaque image ; soupçonne-la dès qu'une
  animation `transform` se dégrade quand le contenu grossit » ; budget 8 ms par image sur un écran 120 Hz ;
  `box-shadow` animée → `filter: drop-shadow()` ; `will-change` en dernier recours.
- **Mécanismes réutilisables** : posture « bloquer par défaut » ; remède qui commence par supprimer ; verdict
  binaire à critères ; distinction « vérifié dans le code » / « à vérifier sur appareil ».
- **On prend** : la hiérarchie de remède et le verdict pour la partie mouvement du relecteur DA (changement 12) ;
  le piège des variables héritées, qui explique `GOUT.md` § 4 (12 oct 2026, « pas fluide ») (changement 12).
- **On refuse** : Framer Motion, ressorts JS, `@starting-style` comme règle générale (notre moteur est CSS +
  `motion.ts`) ; `improve-animations` qui lance 4-8 sous-agents.

### 1.7 jschulte/claude-plugins (le « reverse-engineer » n'y est plus)

- **Lien** : <https://github.com/jschulte/claude-plugins>. **Licence** : MIT.
- **Constat** : la skill `reverse-engineer` (StackShift, étape 2 sur 6, 11 fichiers de spécification tirés d'un
  code existant) citée par les annuaires n'existe plus : la place de marché ne déclare que `editor-rescue`,
  `codebase-audit`, `pr-workflow`, `whats-left`, et `jschulte/stackshift` renvoie 404. Les fiches des annuaires
  (vibeindex, claudemarketplaces) sont périmées. Elle ne servait de toute façon pas au design.
- **Lu en entier** : `pr-workflow/skills/deliver-me/SKILL.md`, `whats-left/skills/whats-left/SKILL.md`. Partiel
  (règles, validation, notation, anti-motifs, ~60 %) : `codebase-audit/skills/health-audit-ux/SKILL.md`
  (692 l.). Non lus : `bulletproof` et `gates.md`, `finish-line/references/review-lenses.md`.
- **Ce que ça fait vraiment** :
  - `deliver-me` : « une demande en entrée, une PR relue et vérifiée en sortie, **pas de point d'étape** :
    décider, écrire la décision, continuer ». Compte rendu figé : résultat ; **décisions prises pour vous,
    chacune avec l'alternative et comment basculer** ; nouveaux motifs ; vérifié (à quel échelon : déployé >
    lancé > tests) ; **non vérifié, dit simplement** ; laissé pour vous. Table des drapeaux rouges (« je devrais
    demander avant de continuer » → « décide, note, continue : le compte rendu est l'endroit où ils te
    contredisent »). « Plan, puis attaque ton plan » en relecteur qui veut le rejeter.
  - `whats-left` : « une chose n'est faite que si tu en as vu la preuve » ; **pas de queue de suggestions** :
    chaque point trouvé est fait, consigné en ticket, ou abandonné (et alors on n'en parle pas).
  - `health-audit-ux` : **règle de preuve** (fichier:ligne ; code ou rendu qui le montre ; tort pour
    l'utilisateur et qui ; au moins un signal de corroboration), **paliers de confiance** (Vérifié, Probable,
    Observation, Question), « valider avant d'accuser » (un vrai utilisateur le remarquerait-il ? est-ce une
    variante légitime ?), deux notes jamais mélangées (qualité de construction / tort actuel), « ne pas noter ce
    qu'on n'a pas inspecté », section obligatoire **« Ce qui n'a pas été retenu »**, anti-motif « ne pas
    rembourrer le rapport de petites remarques pour paraître complet ».
- **On prend** : décider-noter-continuer et le compte rendu « décisions prises pour vous » (changement 13) ;
  pas de queue de suggestions (changement 13) ; règle de preuve et « non retenu » (changements 6 et 7).
- **On refuse** : commit et PR à chaque correction (l'usine ne commite pas depuis `/site-final`) ; l'échelle
  de notes en lettres A-F pondérée sur 12 catégories (trop lourde pour une vitrine d'une page).

### 1.8 REA, « Reverse Engineer Anything » (morluto/rea)

- **Lien** : <https://github.com/morluto/rea>. **Licence** : MIT.
- **Lu** : `.agents/skills/reverse-engineer-anything/SKILL.md` (150 premières lignes + passages « Evidence »),
  `references/evidence-workflows.md` en entier.
- **Ce que ça fait vraiment** : serveur MCP et CLI qui pilotent Hopper/Ghidra/IDA, inspectent des APK, ASAR,
  captures réseau HAR/PCAP. Rien sur le design.
- **Un seul mécanisme utile** : « toute conclusion distingue **observations, inférences et inconnues** » ;
  `record_unknown` garde les questions ouvertes avec la preuve qui manque ; « une absence dans une source
  partielle ne prouve pas l'absence ».
- **On prend** : la distinction observé / déduit / inconnu dans la sortie des relecteurs (changement 7 :
  « vu sur capture » / « lu dans le code » / « non vérifiable sans iPhone »).
- **On refuse** : l'outil lui-même (hors sujet ; l'installation modifie la config globale).

### 1.9 wshobson/agents (ui-visual-validator, ui-design)

- **Lien** : <https://github.com/wshobson/agents>. **Licence** : MIT.
- **Lu en entier** : `plugins/accessibility-compliance/agents/ui-visual-validator.md`,
  `plugins/ui-design/commands/design-review.md`. Non lus : les agents `ui-designer`, `accessibility-expert`,
  `design-system-architect` et les 10 skills `ui-design` (catalogues de compétences).
- **Ce que ça fait vraiment** : `ui-visual-validator` est le meilleur cadrage anti-complaisance trouvé :
  « **hypothèse par défaut : l'objectif n'est PAS atteint tant que ce n'est pas prouvé** », « ignore les indices
  du code, juge sur la seule preuve visuelle », « **validation inverse** : cherche activement la preuve que la
  modification a échoué », « commence par "D'après la preuve visuelle, j'observe…" », comportements interdits
  (« supposer qu'un changement de code produit un résultat visuel », « accepter "différent" comme "correct" »).
  `design-review` : interactif (une question par tour), rapport Critique/Majeur/Mineur/Suggestion, état JSON.
- **On prend** : l'hypothèse « pas atteint par défaut », la validation inverse et l'ouverture imposée « Sur les
  captures, je vois… » (changement 7).
- **On refuse** : `design-review` interactif (questions au fondateur) ; « commencer par le positif » (le
  relecteur ne félicite pas : une ligne « à garder » suffit).

### 1.10 Autres dépôts repérés par recherche

**gstack, `/design-review`** (<https://github.com/garrytan/gstack>, MIT). Lu en entier :
`design-review/SKILL.md.tmpl` (344 l.) ; partiel : le `SKILL.md` généré (1 968 l. ; lus « UX Principles »,
phases 1-2, « Trunk test », notation, « Design Hard Rules », début des « Outside Voices »). Mécanismes :
**première impression** imposée avant toute analyse (« Le site communique… », « Les trois premières choses où
va mon œil… : si ce ne sont pas celles voulues, la hiérarchie ment », « en un mot : … », narration à la première
personne : « si tu ne peux pas nommer l'élément, tu ne regardes pas, tu génères des platitudes ») ; **test du
tronc** (sur une page déposée sans contexte : quel site, quelle page, quelles sections ; échec = impact élevé) ;
**7 rejets durs** (grille de cartes SaaS en premier écran, belle image et marque faible, titre fort sans action,
image chargée derrière le texte, sections qui répètent la même phrase d'ambiance, carrousel sans récit, interface
en cartes empilées) et **7 tests oui/non** ; note par catégorie qui **part de A et perd une lettre par constat
élevé** ; boucle de correction **une correction = un avant/après capturé**, classée vérifiée / au mieux /
annulée, **annuler toute correction qui fait régresser** ; **autorégulation** (risque cumulé : +15 % par
annulation, +5 % par composant touché, +20 % pour un fichier sans rapport ; au-delà de 20 %, arrêt ; plafond dur
de 30 corrections) ; « deux agents d'accord, ou deux lectures d'une même source, = **une seule donnée** » ;
« un résultat nul vérifié est un succès ; une affirmation positive sans preuve est pire que le silence ».
**On prend** : première impression, test du tronc pour les pages service, rejets durs, annulation sur régression,
plafond de corrections, « une seule donnée » (changements 5, 7, 11). **On refuse** : « No flat single-color
backgrounds by default: texture from the brand » (`GOUT.md` § 1 : grain refusé), « Hero : full-bleed, jamais
encarté » (nos coquilles varient le hero exprès), la voix externe Codex, un commit par correction.

**OneRedOak, agent `design-review`** (<https://github.com/OneRedOak/claude-code-workflows>, MIT). Lu en entier :
`design-review/design-review-agent.md`, `design-review-claude-md-snippet.md`. Phases 0-7 (flux, responsive
1440/768/375, finition, a11y, robustesse, santé du code, contenu et console), triage Bloquant / Haute / Moyenne
/ « Nit: », fichiers `/context/design-principles.md` et `style-guide.md` lus à chaque relecture (= notre
`GOUT.md`), « vérification visuelle rapide **immédiatement** après tout changement de front ». **On prend** : le
réflexe « contrôle rapide après chaque correction » (déjà notre boucle). **On refuse** : « Problems over
prescriptions » (décrire sans proposer de correctif : chez nous le parent applique, il lui faut le correctif) et
« toujours commencer par un retour positif ».

**Anthropic, `knowledge-work-plugins/design/design-critique`** (<https://github.com/anthropics/knowledge-work-plugins>,
Apache 2.0). Lu en entier. Cadre en 5 temps (première impression en 2 s, usage, hiérarchie, cohérence, a11y),
tableau constat/gravité/recommandation, 3 priorités. Générique ; aucun mécanisme d'arrêt ni d'anti-complaisance.
**On prend** : rien de neuf. **On refuse** : demander le contexte au client.

**ui-craft, `critique` + agent `design-reviewer`** (<https://github.com/educlopez/ui-craft>, MIT). Lus en
entier. **Capture visuelle obligatoire** à trois largeurs avant toute critique ; sinon le rapport porte en tête
`[REVUE SUR CODE SEULEMENT — visuel non évalué]` ; relecteur en lecture seule « fait partie d'une équipe de
vérification parallèle » avec un auditeur a11y ; « **si la cible est propre, rends un tableau vide avec une
ligne ; ne fabrique pas de constats** » ; « s'il te demande de corriger, refuse et note la demande comme
constat critique » ; « Craft Report » final (vérifié, passé, changé, laissé, verdict). **On prend** : l'en-tête
de mode dégradé et l'autorisation du relevé vide (changements 6 et 16). **On refuse** : le curseur
`CRAFT_LEVEL` (notre barre est fixe : `GOUT.md`).

**designer-skills, `design-review`** (<https://github.com/julianoczkowski/designer-skills>, Apache 2.0). Lu :
150 lignes sur 249. Captures obligatoires rangées à côté du brief (`.design/<feature>/screenshots/`, noms qui
disent la largeur), revue écrite dans `DESIGN_REVIEW.md` qui **cite chaque capture par son nom**. **On prend** :
citer la vignette exacte de la planche (changement 7). **On refuse** : demander l'URL ou des captures à
l'utilisateur.

**vibecosystem, `visual-verdict`** (<https://github.com/vibeeval/vibecosystem>, MIT). Lu en entier. 6 dimensions
0-100 pondérées, verdict PASS ≥ 90 / REVISE 60-89 / FAIL < 60, « tentative n/5 », écart avec la note précédente,
escalade après 5 échecs (« bloqueur qui revient, recommandation : clarification ou approche fausse »), « une
vue "presque bonne" cache souvent 3-5 défauts qui s'additionnent : note-la, fais confiance au chiffre ». Pensé
pour reproduire une maquette. **On prend** : afficher l'écart d'un tour à l'autre et l'escalade écrite
(changement 10). **On refuse** : 5 itérations, la comparaison pixel à une maquette (nous n'en avons pas).

---

## 2. Améliorations concrètes de `/site-final`

Chaque changement dit **où** il va dans `.claude/skills/site-final/SKILL.md` et donne **le texte exact** à coller.
Contraintes respectées partout : deux agents au plus en parallèle (jamais un troisième pendant ce temps), **les
agents n'ouvrent aucun navigateur** (ils lisent des captures), le parent lance les commandes qui ouvrent Chrome
(`ff planche`, `ff a11y`, `ff audit-motion`, `ff nettete`, `ff captures`) **l'une après l'autre**, jamais en
parallèle.

### Changement 1. Fiche du client et contrat de direction (nouvelle étape 0bis)

Pourquoi : taste-skill (inventaire, phrase-idée, test du concurrent) et Impeccable (contrat de direction relu par
le relecteur final). Le bloc sur mesure de `GOUT.md` § 1 devient vérifiable.

Où : après « ## 0. Lire, dans l'ordre ».

```markdown
## 0bis. Fiche du client et contrat de direction (avant de toucher au site)

Écrire `sites/<slug>/direction.md` (jamais copié dans `dist/`, jamais dans un commentaire HTML). Sans ce
fichier, la relecture n'a pas de référence et ne peut pas dire « refaire ».

1. **Faits propres** : 8 à 12 choses qui appartiennent à ce client et à aucun concurrent, toutes tirées du brief
   (nom et ce qu'il veut dire, rue, ce qu'on voit devant la porte, chiffres donnés, la contrainte du métier
   « une fournée à 17 h », matières, rituels et horaires, imprimés du métier : ticket, devis, étiquette). Un fait
   absent du brief n'entre pas dans la liste.
2. **Phrase-idée** : « Sur ce site, [un fait de la liste] devient [le dispositif du bloc sur mesure]. »
3. **Test du concurrent** : remplacer le client par le concurrent le plus proche (la boulangerie de la rue
   d'à côté). Si la phrase marche encore, l'idée est celle du métier : en chercher une autre dans la liste.
4. **Contrat** (six lignes, pas plus) :
   - THÈSE : l'idée, et l'arrangement par défaut du métier qu'elle refuse ;
   - SQUELETTE : coquille, place de la nav, où vit le contact, ordre des blocs, et l'écart avec `ff variete` ;
   - PREMIER ÉCRAN : ce qui est où, à quelle taille, où est le bouton ou le téléphone ;
   - FEU D'ARTIFICE : le seul effet riche, son but en un mot ;
   - REFUSÉ : ce qu'on a écarté (et pourquoi), pour le compte rendu ;
   - FIN : « non relu = pas fini : ce site se termine par le verdict du relecteur ».
```

### Changement 2. Relire le plan avant de construire

Pourquoi : `frontend-design` (deux passes), `deliver-me` (« plan, puis attaque ton plan »).

Où : fin de l'étape 0bis.

```markdown
5. **Attaquer le contrat** avant de construire : le relire comme quelqu'un qui veut le rejeter. Si une ligne
   serait la même pour n'importe quel artisan du métier (refaire mentalement le contrat pour un concurrent : on
   arrive au même endroit ?), la réécrire et noter dans REFUSÉ ce qui a changé. Une ligne qui décrit une
   ambiance (« chaleureux et authentique ») n'est pas une décision.
```

### Changement 3. Calibration : ta première idée est déjà dépensée

Pourquoi : Impeccable « rendition prior », `frontend-design` (cinq grappes), gstack (« trois looks »).

Où : étape 1, après « Bloc sur mesure obligatoire… ».

```markdown
- **Calibration** : les pages générées tombent dans cinq grappes quel que soit le sujet : fond crème + serif +
  terracotta ; noir + un accent acide ou néon ; broadsheet à filets et petites capitales ; cartes SaaS
  identiques à grand rayon et ombre grise ; chrome de gabarit (eyebrow, « A · B · C », flèche « → »). Pour un
  métier « chaleureux » (boulangerie, librairie, ébéniste), le premier réflexe est crème + serif + lumière de
  lampe : le considérer comme **déjà dépensé**. Si le résultat tombe dans une grappe sans qu'une ligne du brief
  l'ait demandé, c'est un échec de relecture, pas un style.
```

### Changement 4. Les captures doivent être valides avant d'être jugées

Pourquoi : Impeccable `finish-reviewer` contrôle 0 (« un verdict sur une capture cassée blanchit la casse »),
ui-craft (en-tête « code seulement »), `GOUT.md` § 3 (« Ouvert » à l'heure de la capture).

Où : étape 3, avant « **Ouvrir les deux images… ».

```markdown
**Avant de juger, valider la preuve.** Une planche n'est une preuve que si :
- chaque vignette montre du contenu (aucune vignette entièrement blanche ou noire, aucune bande vide là où un
  `data-reveal` aurait dû jouer : si c'est le cas, c'est un défaut à corriger, pas une capture à refaire) ;
- le haut de page est visible sur la première vignette, et la dernière atteint le pied de page (sinon
  `ff planche <slug> --debut 24`, puis `--debut 48`) ;
- les dimensions sont les bonnes (`-d-` : 1400 × 900, `-m-` : 390 × 844) ;
- si le site affiche un état « Ouvert / Fermé », la capture a été prise à une heure où il dit « Ouvert ».
Une planche invalide se refait **avant** toute relecture. On ne passe jamais une planche invalide à un agent.
Les commandes qui ouvrent Chrome (`planche`, `a11y`, `audit-motion`, `nettete`, `captures`) se lancent l'une
après l'autre, jamais en parallèle.
```

### Changement 5. Regarder en passes séparées, sur les images seulement

Pourquoi : taste `critique.md` (14 passes), gstack (première impression, test du tronc), Impeccable (test de
mémoire), Vercel (ultra-large).

Où : remplacer la liste à puces de l'étape 3 par :

```markdown
Ouvrir chaque planche avec l'outil Read et faire **ces passes, une par une, sans les mélanger**. On juge les
images, pas le code : on a écrit le code, on y lirait ses intentions.

1. **Une seconde** : regarder la première vignette mobile et détourner les yeux. Qu'a-t-on vu ? Il doit y avoir
   une seule réponse (un mot, un objet). « Un site » = pas de point focal.
2. **Mémoire** : si quelqu'un part après le premier écran, que décrit-il une heure plus tard ? Si c'est une
   ambiance, le premier écran n'est pas fini. Il doit dire quoi, où, et combien ou quand, en grand.
3. **Les trois premiers regards** : où va l'œil en 1, 2, 3 sur le premier écran ordinateur ? Si ce n'est pas
   l'ordre voulu par le contrat, la hiérarchie ment.
4. **Cacher le nom** : ce premier écran pourrait-il être celui du concurrent ? Puis défiler : l'idée atteint-elle
   la FAQ, le contact, le pied de page, ou la page redevient-elle des blocs de bibliothèque ?
5. **Plisser les yeux** : la page se réduit-elle à deux ou trois masses de tailles nettement différentes ?
6. **Un mot par section** (partagé, liste, pleine largeur, grille, phrase, tableau…) : le même mot deux fois de
   suite, ou trois fois sur la page, c'est le gabarit qui se voit.
7. **Bords** : suivre le bord gauche des textes ; deux ou trois positions, pas six.
8. **Collisions au défilement** : à aucune vignette un élément ne couvre un titre, un texte ou un bouton ; rien
   ne déborde du téléphone ; un même grand texte ne reste pas épinglé plus de deux vignettes d'écran.
9. **Plein et vide** : pas plus d'un écran presque vide par page (un repos voulu), aucun « trou » à côté d'une
   colonne courte.
10. **Téléphone d'abord** : texte lisible sur le fond animé, rien sous la barre basse, contact atteignable au
    pouce ; puis l'ordinateur ; puis, si le site est sombre ou très large, une pensée pour l'écran très large.
11. **Pages service, test du tronc** : sur `captures/` d'une page service, sans contexte, sait-on quel site,
    quelle page, comment revenir et comment appeler ?
Chaque défaut vu se note avec la vignette (`m-0, vignette 7`) et se corrige avant la relecture des agents.
```

### Changement 6. Barème de confiance et faux positifs, communs aux deux relecteurs

Pourquoi : Anthropic `code-review` (barème donné mot pour mot, seuil 80), jschulte (règle de preuve), ui-craft et
gstack (relevé vide autorisé).

Où : étape 4, juste après le préambule commun (bloc à coller dans le prompt des deux agents, voir changement 7).

```markdown
BARÈME DE CONFIANCE (à appliquer à chaque constat, sans le modifier) :
- 0 : ne tient pas à un examen léger, ou défaut qui existait avant ce site (bibliothèque partagée inchangée).
- 25 : peut-être réel, non vérifié ; ou question de goût qui n'est écrite nulle part dans GOUT.md.
- 50 : réel et vérifié, mais mineur ou rare ; un fondateur ne le remarquerait pas au premier regard.
- 75 : vérifié deux fois, visible au premier regard sur téléphone ou ordinateur, ou contraire à une ligne de
  GOUT.md que tu peux citer mot pour mot.
- 100 : certain, visible sur la planche à l'endroit indiqué, et contraire à une ligne datée de GOUT.md.
Ne rapporte que les constats ≥ 75. Un constat « contraire à GOUT.md » n'est à 75 ou plus que si GOUT.md le dit
explicitement : cite la ligne.

FAUX POSITIFS (ne pas rapporter) : ce que `ff verifier`, `ff ia`, `ff typo`, `ff detect`, `ff a11y` attrapent
déjà ; un choix demandé par le brief ; un défaut de `src/` qui touche tous les sites et que ce site n'a pas
aggravé ; une préférence personnelle sans ligne de GOUT.md ni preuve sur capture ; un pinaillage qu'un
directeur artistique ne relèverait pas.

PREUVE (chaque constat) : (1) où : `fichier:ligne` ou vignette de planche (`d-0, vignette 3`) ; (2) ce qui se
voit ; (3) pourquoi le fondateur dira non (ligne de GOUT.md citée, ou tort pour le visiteur) ; (4) le correctif
précis. Il manque un des quatre : baisse ta confiance.

Si rien ne passe le seuil, écris « Rien à signaler au-dessus de 75 » : un relevé vide vérifié est un succès.
Ne fabrique pas de constats pour paraître complet.
```

### Changement 7. Les deux prompts de relecteurs, prêts à coller

Pourquoi : Impeccable (relecteur frais, sans navigateur, inventaire avant contrat, budget de lecture, verdict
dérivé), wshobson (pas atteint par défaut, validation inverse), REA (observé / déduit / inconnu), gstack (« une
seule donnée »), designer-skills (citer la capture).

Où : remplacer le corps de l'étape 4 par ce qui suit. Lancer les deux agents `general-purpose` **dans le même
message** (parallèle, deux au plus), **jamais en `fork`** : un relecteur qui hérite de la conversation hérite du
cadrage et de l'optimisme du constructeur. Tout ce dont il a besoin passe dans le prompt.

**Prompt de l'agent DA** (remplacer `<slug>` et la liste des planches) :

```text
Tu es le dernier regard avant que le fondateur de Finck & Fisch voie le site <slug>. Tu n'es pas un collègue qui
adoucit : ton travail est de trouver ce qui lui fera dire « non ». Par défaut, le site n'est PAS prêt tant que
les captures ne prouvent pas le contraire.

RÈGLES : lecture seule. Tu n'écris aucun fichier, tu ne lances aucune commande `ff`, tu n'ouvres aucun
navigateur. Tu juges sur les captures fournies ; le code sert seulement à localiser un défaut déjà vu. Ne
suppose jamais qu'une ligne de code produit un effet visible : seul ce qui est sur la capture compte.

ENTRÉES, à lire dans cet ordre :
1. Les captures d'abord, avant tout texte : captures/planches/<slug>-m-0.jpg, <slug>-d-0.jpg [ajouter -m-24,
   -d-24… si présentes], captures/<slug>-desktop.png, captures/<slug>-mobile.png. Note en quelques lignes ce que
   tu vois, élément par élément, AVANT de lire le contrat : sinon tu hériteras de ce que le constructeur a oublié.
2. Puis docs/GOUT.md (la charte : ce qu'elle interdit est un échec, pas une opinion) et docs/veille/signes-ia.md.
3. Puis sites/<slug>/direction.md (le contrat : faits propres, phrase-idée, squelette, premier écran, feu
   d'artifice, refusé).
4. Puis, seulement pour localiser : sites/<slug>/site.config.ts, sites/<slug>/sections/*.astro, et la sortie de
   `node scripts/ff.mjs variete` collée ci-dessous.
[coller ici la sortie de ff variete]
Budget : au plus une dizaine de lectures, groupées. Ensuite, arrête de lire et écris.

CE QUE TU VÉRIFIES :
- Premier écran : dit-il quoi, où, combien ou quand, en grand ? Test de mémoire : après un seul écran, que
  décrirait-on une heure plus tard ? Une ambiance = échec.
- Idée : la phrase-idée du contrat se voit-elle ? Remplace le client par son concurrent le plus proche : le site
  marche-t-il encore ? Le bloc sur mesure montre-t-il le mécanisme du métier ou le décrit-il ?
- Squelette : même squelette ET même direction qu'un autre site de l'usine (sortie ff variete) = échec.
- Signes IA de GOUT.md § 2 visibles sur une capture, un par un.
- Un seul feu d'artifice : un deuxième effet riche est un constat. Pour le mouvement, propose d'abord de
  supprimer, puis de réduire, puis seulement de corriger.
- Téléphone (GOUT.md § 1) : texte lisible sur fond animé, rien sous la barre basse, contact au pouce.
- Collisions et vides à chaque vignette : élément sur un titre, texte rogné, bande vide où un reveal n'a pas
  joué, plus d'un écran presque vide, grand texte épinglé plus de deux écrans.
- Rejets durs : grille de cartes identiques en premier écran ; belle photo et nom du client faible ; titre fort
  sans action ; image chargée derrière du texte ; sections qui répètent la même phrase d'ambiance ; carrousel
  sans récit.
- Deux visiteurs : la cliente pressée sur iPhone d'une main (trouve-t-elle le numéro en 5 secondes ?) et la
  personne qui découvre le métier (comprend-elle ce qui est vendu sans jargon ?).
Cherche activement la preuve que le site a échoué, pas celle qu'il a réussi.

[coller ici le bloc BARÈME / FAUX POSITIFS / PREUVE du changement 6]

NOTATION (grille du changement 8) : donne Composition, Usage, Idée (1-10), les plafonds appliqués, et laisse
Textes au rédacteur.

SORTIE, exactement dans cette forme, rien d'autre :
verdict: <reprendre-captures | refaire | corriger | montrer>
Sur les captures, je vois : <une phrase sur le premier écran mobile>
Vu en une seconde : <un mot ou un objet>
Idée (une phrase) : <…> / Test du concurrent : <tient | ne tient pas, pourquoi>
Un mot par section : hero=… / …=… / …
Notes : composition _ · usage _ · idée _ · plafonds : <…>
Constats (≥ 75, le plus visible d'abord, 12 au plus) :
1. [confiance] où — ce qui se voit — pourquoi non (GOUT.md : « … ») — correctif — (vu sur capture | lu dans le
   code | non vérifiable sans iPhone)
Non retenu : <ce que tu as regardé et écarté, une ligne>
À garder : <une ligne : ce que les corrections ne doivent pas diluer>

Le verdict se DÉDUIT, il ne se ressent pas : reprendre-captures si une capture manque ou est invalide (et alors
ne rends que la liste des captures à refaire) ; refaire si l'idée ne tient pas au test du concurrent, si le
premier écran échoue au test de mémoire, ou si Idée ≤ 6 ; corriger s'il reste au moins un constat ≥ 75 ;
montrer seulement si aucun constat ≥ 75 et les seuils de la grille sont atteints. Deux agents d'accord ne font
pas deux preuves : ne t'appuie que sur ce que tu as vu toi-même.
```

**Prompt de l'agent rédacteur** :

```text
Tu relis tous les textes visibles du site <slug> de Finck & Fisch avant que le fondateur les voie. Tu es
adversarial : trouve ce qui lui fera dire « non ». Par défaut, les textes ne sont PAS prêts.

RÈGLES : lecture seule, aucun fichier écrit, aucune commande `ff`, aucun navigateur.

ENTRÉES : docs/GOUT.md (§ 2 et § 5 surtout), docs/REDACTION.md § 1, § 3, § 4, § 5 et § 11, docs/veille/signes-ia.md,
sites/<slug>/brief.md (la seule source des faits), sites/<slug>/direction.md, sites/<slug>/site.config.ts,
sites/<slug>/sections/*.astro. Au plus une dizaine de lectures, puis écris.

CE QUE TU VÉRIFIES :
- Toute donnée (chiffre, prix, année, horaire, lieu, nom, avis, note) : trouve la ligne du brief qui la donne.
  Absente du brief = constat à 100, même si elle « a l'air vraie ».
- Mots creux et phrases d'agence (GOUT.md § 5, REDACTION.md § 1), superlatifs et garanties interdits.
- Titres : une phrase, pas un fragment ; pas de cadence de trois ; pas d'accent sur un seul mot ; le titre du
  hero, lu seul, dit ce qui est vendu.
- « Exemple » plus d'une fois par écran ; « aucun client derrière » plus d'une fois (démos).
- Incohérences : un prix à deux endroits, une date qui ne tombe pas le bon jour, un quartier qui ne correspond
  pas à l'adresse, un horaire « ouvert » contredit ailleurs, un libellé de bouton qui change dans le parcours.
- Ton : registre du métier (REDACTION.md § 4) tenu partout, pas seulement dans le hero ; vouvoiement ; profession
  réglementée (REDACTION.md § 3).
- Typographie française que `ff typo` ne voit pas (cas dans un attribut `aria-label`, un `alt`, un `title`).
- L'idée du contrat dans les mots : la FAQ, le contact et le pied de page parlent-ils encore de ce client-là ?

[coller ici le bloc BARÈME / FAUX POSITIFS / PREUVE du changement 6]

NOTE Textes (1-10) selon la grille du changement 8, avec ses plafonds.

SORTIE, exactement :
verdict: <corriger | montrer>
Note textes : _ · plafonds : <…>
Constats (≥ 75, le plus visible d'abord, 15 au plus) :
1. [confiance] fichier:ligne — texte fautif entre « » — pourquoi non (GOUT.md ou REDACTION.md cité) — texte
   corrigé proposé (sans inventer de donnée : si le brief ne donne pas l'info, propose de retirer la phrase)
Non retenu : <une ligne>
```

### Changement 8. Grille de notation chiffrée et seuils de montrage

Pourquoi : taste (note de juré pondérée, ancres, plafonds, calibration), Impeccable (`n/a` renormalisé, « un 4
veut dire vraiment excellent »). Plafonds tirés de `GOUT.md`, pas de taste.

Où : nouveau paragraphe à la fin de l'étape 4.

```markdown
### Grille (DA : trois premiers critères ; rédacteur : Textes)

| Critère | Poids | 9-10 | 8 | 7 | 6 ou moins |
|---|---|---|---|---|---|
| Composition et finition | 40 % | chaque écran tient comme une affiche, rien à enlever | sûr et cohérent, un ou deux points faibles qu'un graphiste verrait | propre, un système clair, peu de tension | net mais anonyme, se lit comme un kit |
| Usage, téléphone d'abord | 30 % | on sait quoi, pour qui, comment appeler sans défiler ; parfait au pouce | clair, une petite friction | marche, avec un vrai problème (contraste, mobile serré) | il faut chercher, ou quelque chose casse |
| Idée propre au client | 20 % | idée tirée d'un fait du client, jamais vue appliquée ainsi | une idée claire et un moment mémorable | exécution soignée d'une approche connue | le défaut du métier |
| Textes | 10 % | chaque ligne ne peut parler que de ce client | clair et concret, quelques lignes génériques | correct, quelques formules | slogans, remplissage |

`global = 0,4 × composition + 0,3 × usage + 0,2 × idée + 0,1 × textes`

Calibration : un très bon site primé se note 7,5-8,0 ; un 8,5 honnête est rare. Si ta première note dépasse 9,
renote comme le juré qui n'a pas construit le site.

**Plafonds (priment sur le calcul)** :
- un contrôle `ff` encore rouge : global ≤ 6,0 ;
- un signe IA de `GOUT.md` § 2 visible sur une capture : composition ≤ 6,5 ;
- le site passerait pour celui du concurrent (test du concurrent) : idée ≤ 6 ;
- pas de bloc sur mesure, ou un bloc qui décrit au lieu de montrer : idée ≤ 6 ;
- deux effets riches sur la page : composition ≤ 7 ;
- un élément couvre un titre ou un texte à une position de défilement : usage ≤ 6 ;
- une bande vide où un reveal n'a pas joué, ou un contenu rogné : usage ≤ 5 ;
- texte peu lisible sur fond animé au téléphone (`GOUT.md` § 1) : usage ≤ 6 ;
- le premier écran ne dit pas quoi/où/combien ou quand : usage ≤ 7 ;
- une donnée sans source dans le brief : textes ≤ 3 et constat bloquant ;
- deux écrans d'ordinateur presque vides : composition ≤ 6,5.

**Seuils** :
- **montrer** : global ≥ 7,5, aucun critère < 7, aucun plafond actif, aucun constat ≥ 75 ouvert ;
- **corriger** : tout le reste, tant qu'idée ≥ 7 ;
- **refaire** (le bloc sur mesure ou le premier écran, pas des retouches) : idée ≤ 6, ou global < 6.
```

### Changement 9. Format de tour figé et journal `relecture.md`

Pourquoi : taste (format ROUND figé pour comparer les tours), Impeccable (instantané + tendance), gstack (base de
référence pour mesurer la régression).

Où : étape 4, après la grille.

```markdown
Le parent consigne chaque tour dans `sites/<slug>/relecture.md` (jamais publié), dans cette forme :

    ## Tour n — <date> — verdict DA : … / rédacteur : …
    Notes : composition _ · usage _ · idée _ · textes _ → global _,_ (tour précédent : _,_)
    Plafonds actifs : …
    Constats appliqués : …
    Constats écartés par le parent, avec la raison : …
    Laissé à la décision du fondateur : …

`/site-final <slug> --relecture` lit d'abord ce fichier : les constats encore ouverts du dernier tour sont la
première liste à vérifier, et la tendance des notes s'affiche dans le compte rendu interne.
```

### Changement 10. Boucle, ordre de correction et critères d'arrêt

Pourquoi : Impeccable (deux tours, arrêt quand un tour ne résout rien, jamais `ship` avec un partiel), taste
(ordre de correction, ne pas arrondir), visual-verdict (escalade écrite), ralph-loop (fin écrite d'avance).

Où : remplacer le dernier paragraphe de l'étape 4 (« Appliquer **tout** ce qui est fondé… ») par :

```markdown
### Corriger, puis faire noter les correctifs

1. Appliquer **tous** les constats ≥ 75 en un seul lot, dans cet ordre (un échelon ne rattrape pas le
   précédent) : idée et bloc sur mesure → premier écran et hiérarchie → squelette et composition → typographie →
   images → couleur → textes → détails et états → mouvement (supprimer d'abord, réduire ensuite).
2. Verdict `refaire` : ne pas retoucher, refaire le bloc ou le premier écran nommé, puis relecture **complète**
   (pas une passe de verdict).
3. Rebuild, contrôles de l'étape 2, nouvelle planche **aux mêmes chemins**, validée (changement 4).
4. **Passe de verdict** : renvoyer les nouvelles planches au **même** agent DA (`SendMessage` avec son
   identifiant ; sinon un agent neuf qui reçoit la liste du tour précédent) avec ce message :

   « Voici les planches après correction, aux mêmes chemins. Tu notes, tu ne cherches pas de nouveaux défauts.
   Pour chaque constat du tour précédent : résolu, partiel ou non résolu, d'après ce que montrent les nouvelles
   captures uniquement. Mon récit des corrections n'est pas une preuve : un correctif que tu ne vois pas est non
   résolu ; des éléments déplacés sans que la qualité demandée apparaisse, c'est partiel. Puis au plus trois
   régressions causées par ces corrections. Recalcule les notes et le verdict. Forme : `verdict` / tableau
   résolu-partiel-non résolu / régressions / notes. »

   Même chose pour le rédacteur si des textes ont changé.
5. **Arrêt** : deux tours de correction au plus après la première relecture. On s'arrête plus tôt dès que les
   seuils « montrer » sont atteints, **ou dès qu'un tour ne résout rien** (même liste ouverte que le précédent).
   Un partiel ou un non résolu ne se transforme jamais en « montrer ». Au-delà de deux tours, sous le seuil :
   le compte rendu le dit en tête (« pas encore à montrer : global 6,8, idée 6, voici les trois blocages et ce
   qu'il faudrait décider »). On n'arrondit pas.
6. Le parent n'a pas autorité pour adoucir un verdict. Il peut écarter un constat (choix du brief, règle absente
   de `GOUT.md`), mais l'écrit dans `relecture.md` avec la raison, et le constat va dans « Laissé à votre
   décision » s'il touche au goût.
```

### Changement 11. Garde-fous de correction (autorégulation)

Pourquoi : gstack (annuler toute correction qui régresse, risque cumulé, plafond dur), `CLAUDE.md` (bloc unique
dans `sites/<slug>/`, `_exemple` à ne pas casser).

Où : fin de l'étape 4.

```markdown
**Garde-fous** :
- On corrige dans `sites/<slug>/` (config, sections, `direction.md`). Toucher `src/` (partagé) seulement pour un
  vrai bug commun, puis `npm test` et `node scripts/ff.mjs build _exemple` ; sinon le défaut va dans « Laissé à
  votre décision ».
- Une correction qui fait régresser la planche (nouveau débordement, contrôle qui repasse au rouge, note qui
  baisse) est **annulée** tout de suite et le constat passe en « laissé ».
- Plafond : 20 corrections par tour. Au-delà, ou si plus de deux fichiers de `src/` ont été touchés, s'arrêter
  et le dire dans le compte rendu : la page a un problème de fond, pas de finition.
```

### Changement 12. Mouvement : remède dans l'ordre, et le piège des variables héritées

Pourquoi : Emil `review-animations` (hiérarchie de remède, Bloquer/Approuver) et `animation-performance` (variable
CSS héritée = recalcul de tous les enfants), qui explique `GOUT.md` § 4.

Où : étape 2, sous le bloc de commandes (et à reprendre dans `CLAUDE.md` § Pièges si le fondateur valide).

```markdown
**Mouvement, avant de corriger** : dans l'ordre, (1) supprimer l'animation si elle n'a pas de but nommable en un
mot, (2) la réduire (durée, distance, nombre de propriétés), (3) corriger l'easing (`ease-out`, jamais
`ease-in`), (4) l'origine, (5) l'interruptibilité. Suspect n° 1 d'une saccade iPhone : une variable CSS animée
sur un **parent** (`--p`, `--a`) que lisent des enfants ; chaque changement recalcule le style de tout le
sous-arbre à chaque image, et ça empire avec le contenu. Poser la valeur sur l'élément qui bouge, ou passer en
étapes (`data-etapes`), comme le demande `GOUT.md` § 4. Dire dans le compte rendu interne ce qui est vérifié
dans le code et ce qui reste à voir sur un vrai iPhone en ligne.
```

### Changement 13. Décider, noter, continuer ; compte rendu sans queue de suggestions

Pourquoi : jschulte `deliver-me` (« décisions prises pour vous, avec l'alternative et comment basculer ») et
`whats-left` (chaque point est fait, consigné ou abandonné).

Où : remplacer l'étape 6.

```markdown
## 6. Compte rendu (une seule fois, en français simple)

Pendant toute la passe, on ne pose aucune question au fondateur : on décide, on note la décision dans
`relecture.md`, on continue. Le compte rendu est l'endroit où il peut nous contredire.

Dans l'ordre, court :
1. **Le lien** (ou « captures seulement ») et les deux planches jointes (SendUserFile si le fondateur est sur
   téléphone). Si le seuil n'est pas atteint, la première ligne le dit.
2. **Ce que vous verrez** : 3 à 6 lignes, du plus visible au moins visible, dont la phrase-idée en mots simples.
3. **Rejeté en interne** : ce que les relecteurs et la planche ont fait retirer, et ce que le contrat a refusé
   (ligne REFUSÉ).
4. **Décisions que j'ai prises pour vous** : au plus 3, chacune avec l'autre option et ce qu'il faut dire pour
   basculer (« J'ai mis le téléphone dans la barre du bas plutôt qu'en haut ; pour l'inverse, dites "téléphone
   en haut" »).
5. **Non vérifié** : ce qui n'a pas pu l'être (iPhone en ligne, heure d'ouverture…), dit simplement.
6. Rien d'autre : pas de « pistes », pas de « à envisager ». Chaque point trouvé pendant la passe a été fait,
   écrit dans `relecture.md` comme laissé avec sa raison, ou abandonné (et alors on n'en parle pas).
```

### Changement 14. En-tête de méthode : une passe dégradée se déclare

Pourquoi : Impeccable (« une critique dégradée silencieuse est une critique ratée »), ui-craft (`[CODE-ONLY]`).

Où : début de l'étape 4.

```markdown
Si les agents n'ont pas pu être lancés (outil absent, limite de session), faire les deux relectures soi-même
**après** avoir relu la planche à froid, et l'écrire en première ligne de `relecture.md` et du compte rendu
interne : « Relecture dégradée : un seul contexte (raison) ». Même chose si une planche n'a pas pu être faite :
« Relecture sur code seulement : visuel non évalué » ; dans ce cas, pas de verdict « montrer ».
```

### Changement 15. Fichier d'acceptations par site, et `GOUT.md` comme mémoire

Pourquoi : Impeccable (`ignore.md` : les constats acceptés sont retirés en silence), `frontend-design` (noter ce
qu'on a essayé).

Où : étape 7.

```markdown
Quand le fondateur **accepte** un écart qu'un relecteur avait signalé (« le noir, c'est voulu pour ce
client »), l'écrire dans `sites/<slug>/direction.md`, section « Accepté par le fondateur », daté. Les relectures
suivantes de ce site le reçoivent dans leurs entrées et ne le resignalent pas. Un « non » reste une ligne datée de
`docs/GOUT.md` ; un « oui » sur un écart reste local au site, sauf s'il vaut pour tous.
```

### Changement 16. Isoler le regard du détecteur

Pourquoi : Impeccable (« A doit finir avant que les constats du détecteur n'entrent : un détecteur ancre le
jugement »).

Où : étape 4, consigne au parent.

```markdown
Ne pas coller les sorties de `ff detect`, `ff ia`, `ff audit-motion` dans le prompt de l'agent DA : il les
recevrait comme une liste à cocher et regarderait moins. Ces contrôles sont déjà verts à ce stade (étape 2) ;
le DA juge les captures. Le parent croise ensuite : un constat du DA qu'un contrôle aurait dû attraper est une
piste pour améliorer le contrôle (ligne dans `docs/veille/journal.md`).
```

### Changement 17. Évaluer la skill elle-même, à l'aveugle

Pourquoi : taste `evals.json` (même brief, avec et sans la skill, juge qui ne sait pas lequel est lequel).

Où : nouvelle section en fin de skill (hors du flux client).

```markdown
## 8. Vérifier que la skill marche (une fois par mois, ou après une grosse modification)

Prendre deux briefs de démo (`sites/demo-*`). Pour chacun : une passe `/site-final` complète, et une passe
`/nouveau-site` seule. Faire noter les deux planches par un agent neuf qui ne sait pas laquelle est laquelle,
avec la grille du changement 8 et `GOUT.md`. Noter l'écart dans `docs/veille/journal.md`. Si `/site-final` ne
gagne pas nettement (au moins +1 point global), la skill alourdit sans servir : revoir l'étape qui coûte le plus.
Une seule passe à la fois, un seul navigateur.
```

---

## 3. Sources (fichiers lus)

**anthropics/skills** :
[frontend-design](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md) ·
[webapp-testing](https://raw.githubusercontent.com/anthropics/skills/main/skills/webapp-testing/SKILL.md) ·
[brand-guidelines](https://raw.githubusercontent.com/anthropics/skills/main/skills/brand-guidelines/SKILL.md) ·
[theme-factory](https://raw.githubusercontent.com/anthropics/skills/main/skills/theme-factory/SKILL.md) ·
[arbre](https://api.github.com/repos/anthropics/skills/git/trees/main?recursive=1)

**anthropics/claude-plugins-official** :
[code-review](https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/plugins/code-review/commands/code-review.md) ·
[pr-review-toolkit/code-reviewer](https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/plugins/pr-review-toolkit/agents/code-reviewer.md) ·
[ralph-loop README](https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/plugins/ralph-loop/README.md) ·
[design-playground](https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/plugins/playground/skills/playground/templates/design-playground.md) ·
[frontend-design (plugin)](https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/plugins/frontend-design/skills/frontend-design/SKILL.md)

**Impeccable** (préfixe `https://raw.githubusercontent.com/pbakaus/impeccable/main/.claude/`) :
[SKILL.md](https://raw.githubusercontent.com/pbakaus/impeccable/main/.claude/skills/impeccable/SKILL.md) ·
[critique.md](https://raw.githubusercontent.com/pbakaus/impeccable/main/.claude/skills/impeccable/reference/critique.md) ·
[audit.md](https://raw.githubusercontent.com/pbakaus/impeccable/main/.claude/skills/impeccable/reference/audit.md) ·
[polish.md](https://raw.githubusercontent.com/pbakaus/impeccable/main/.claude/skills/impeccable/reference/polish.md) ·
[craft-floor.md](https://raw.githubusercontent.com/pbakaus/impeccable/main/.claude/skills/impeccable/reference/craft-floor.md) ·
[init.md](https://raw.githubusercontent.com/pbakaus/impeccable/main/.claude/skills/impeccable/reference/init.md) ·
[new-work.md](https://raw.githubusercontent.com/pbakaus/impeccable/main/.claude/skills/impeccable/reference/new-work.md) ·
[component-review.md](https://raw.githubusercontent.com/pbakaus/impeccable/main/.claude/skills/impeccable/reference/component-review.md) ·
[region-map.md](https://raw.githubusercontent.com/pbakaus/impeccable/main/.claude/skills/impeccable/reference/region-map.md) ·
[routing.md](https://raw.githubusercontent.com/pbakaus/impeccable/main/.claude/skills/impeccable/reference/routing.md) ·
[impeccable-finish-reviewer](https://raw.githubusercontent.com/pbakaus/impeccable/main/.claude/agents/impeccable-finish-reviewer.md)

**Vercel** :
[command.md](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) ·
[AGENTS.md](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/AGENTS.md)

**taste-skill** (préfixe `https://raw.githubusercontent.com/Leonxlnx/taste-skill/main/skills/taste-skill/`) :
[SKILL.md](https://raw.githubusercontent.com/Leonxlnx/taste-skill/main/skills/taste-skill/SKILL.md) ·
[critique.md](https://raw.githubusercontent.com/Leonxlnx/taste-skill/main/skills/taste-skill/references/critique.md) ·
[tells.md](https://raw.githubusercontent.com/Leonxlnx/taste-skill/main/skills/taste-skill/references/tells.md) ·
[evals.json](https://raw.githubusercontent.com/Leonxlnx/taste-skill/main/skills/taste-skill/evals/evals.json) ·
[inspect.mjs](https://raw.githubusercontent.com/Leonxlnx/taste-skill/main/skills/taste-skill/scripts/inspect.mjs)

**Emil Kowalski** :
[review-animations](https://raw.githubusercontent.com/emilkowalski/skills/main/skills/review-animations/SKILL.md) ·
[STANDARDS.md](https://raw.githubusercontent.com/emilkowalski/skills/main/skills/review-animations/STANDARDS.md) ·
[improve-animations/AUDIT.md](https://raw.githubusercontent.com/emilkowalski/skills/main/skills/improve-animations/AUDIT.md) ·
[animation-performance](https://raw.githubusercontent.com/emilkowalski/skills/main/skills/animation-performance/SKILL.md)

**jschulte** :
[marketplace.json](https://raw.githubusercontent.com/jschulte/claude-plugins/main/.claude-plugin/marketplace.json) ·
[health-audit-ux](https://raw.githubusercontent.com/jschulte/claude-plugins/main/codebase-audit/skills/health-audit-ux/SKILL.md) ·
[deliver-me](https://raw.githubusercontent.com/jschulte/claude-plugins/main/pr-workflow/skills/deliver-me/SKILL.md) ·
[whats-left](https://raw.githubusercontent.com/jschulte/claude-plugins/main/whats-left/skills/whats-left/SKILL.md) ·
[fiche périmée « reverse engineer »](https://claudemarketplaces.com/skills/jschulte/claude-plugins/reverse-engineer)

**REA** :
[SKILL.md](https://raw.githubusercontent.com/morluto/rea/main/.agents/skills/reverse-engineer-anything/SKILL.md) ·
[evidence-workflows.md](https://raw.githubusercontent.com/morluto/rea/main/.agents/skills/reverse-engineer-anything/references/evidence-workflows.md)

**wshobson/agents** :
[ui-visual-validator](https://raw.githubusercontent.com/wshobson/agents/main/plugins/accessibility-compliance/agents/ui-visual-validator.md) ·
[ui-design/design-review](https://raw.githubusercontent.com/wshobson/agents/main/plugins/ui-design/commands/design-review.md)

**Autres** :
[gstack design-review (modèle)](https://raw.githubusercontent.com/garrytan/gstack/main/design-review/SKILL.md.tmpl) ·
[gstack design-review (généré)](https://raw.githubusercontent.com/garrytan/gstack/main/design-review/SKILL.md) ·
[OneRedOak design-review-agent](https://raw.githubusercontent.com/OneRedOak/claude-code-workflows/main/design-review/design-review-agent.md) ·
[OneRedOak snippet CLAUDE.md](https://raw.githubusercontent.com/OneRedOak/claude-code-workflows/main/design-review/design-review-claude-md-snippet.md) ·
[knowledge-work design-critique](https://raw.githubusercontent.com/anthropics/knowledge-work-plugins/main/design/skills/design-critique/SKILL.md) ·
[ui-craft critique](https://raw.githubusercontent.com/educlopez/ui-craft/main/.agents/skills/critique/SKILL.md) ·
[ui-craft design-reviewer](https://raw.githubusercontent.com/educlopez/ui-craft/main/agents/design-reviewer.md) ·
[designer-skills design-review](https://raw.githubusercontent.com/julianoczkowski/designer-skills/main/design-review/SKILL.md) ·
[vibecosystem visual-verdict](https://raw.githubusercontent.com/vibeeval/vibecosystem/main/skills/visual-verdict/SKILL.md)

**Recherches** (pour repérer les dépôts, non citées comme preuve) :
[horadecodar, design review](https://horadecodar.com.br/design-review-claude-code/) ·
[claudskills, design-review-loop](https://claudskills.com/skills/design-review-loop/) ·
[skills.sh, ui-craft critique](https://skills.sh/educlopez/ui-craft/critique) ·
[pasqualepillitteri, REA vrai/faux](https://pasqualepillitteri.it/fr/news/23846/rea-reverse-engineer-anything-github-vrai-faux)
