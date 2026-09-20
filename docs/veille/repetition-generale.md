# Répétition générale — livraison d'un client fictif (essai-dryrun)

Rejoue `docs/COMMANDES.md` à la lettre, dans la peau d'une associée non développeuse, sur un slug
jetable `essai-dryrun` (fleuriste fictive à Rennes — voir `sites/essai-dryrun/brief.md`). Objectif :
trouver les endroits où une personne non technique se casserait les dents avant une vraie livraison
la semaine prochaine. Sitôt le test fini, `essai-dryrun` est entièrement supprimé du repo (voir fin
de ce document) — seul ce compte-rendu reste.

Légende : ✓ passé sans accroc — ⚠ passé mais avec un point de friction — ✗ bloquant tel quel.

---

## 1. `ff nouveau` + `site.config.ts`

- **Commande :** `node scripts/ff.mjs nouveau essai-dryrun`
- **Durée :** ~2 s
- **Résultat :** ✓ — dossier créé depuis `_exemple`, message final clair (5 étapes numérotées,
  chemins exacts).
- **Brief :** `sites/essai-dryrun/brief.md` rempli à la main (fleuriste fictive Rennes).
- **`site.config.ts` :** la compétence `/nouveau-site` n'était pas disponible dans cette session de
  test (contrainte de l'exercice, pas du produit) — écrit à la main en suivant `sites/_exemple/
  site.config.ts` + `src/lib/schema.ts` + `docs/REDACTION.md`. Aucune friction produit ici : c'est
  exactement ce que fait `/nouveau-site` en conditions réelles. Point à noter pour un non-développeur
  qui n'aurait PAS Claude Code sous la main : sans `/nouveau-site` ni `ff-generer` fonctionnel, il n'y
  a aucun moyen de produire `site.config.ts` — la seule voie non technique est de passer par Claude
  Code.


## 2. `ff-generer` sans clé API

- **Commande :** `node scripts/ff-generer.mjs essai-dryrun`
- **Durée :** ~0,15 s
- **Résultat :** ✓ — message d'erreur clair : « ANTHROPIC_API_KEY absente. Ajoute-la dans .env (copie
  .env.example) ou exporte-la dans l'environnement avant de relancer. » Nom de variable exact, geste à
  faire exact (`.env.example` existe bien à la racine et documente les 6 clés utilisées par l'atelier).
  Aucune correction nécessaire.

## 3. `ff composer`

- **Commande :** `node scripts/ff.mjs composer essai-dryrun`
- **Durée :** ~1 s
- **Résultat initial :** ⚠ — la commande tourne sans erreur et affiche une justification ligne par
  ligne (bien pensé pour un non-développeur). Mais le choix de direction pour une **fleuriste** est
  tombé sur `industriel` (béton/acier, orange sécurité, Bebas Neue) avec la raison « meilleur score
  par défaut » — alors que `src/directions/atelier/meta.ts` liste explicitement `fleuriste` dans ses
  métiers (bonus +3 prévu par `scoreDirections`, `scripts/ff/composer.mjs`). En creusant : le malus
  « déjà utilisée N fois parmi les sites existants » (`-2*n`, anti-répétition entre clients) peut
  dépasser le bonus métier de +3 dès que la direction pertinente a servi 2 fois ; la direction jamais
  utilisée gagne alors par défaut, quel que soit le rapport avec le métier.
- **✓ Corrigé (session suivante, `scripts/ff/composer.mjs`)** : `scoreDirections` calcule désormais
  aussi un **palier** par direction (`directionTier`) — 0 = adaptée au métier (`meta.metiers` recoupe
  le métier et la direction n'est pas dans `meta.eviter`), 1 = neutre (aucun lien connu), 2 = à éviter
  explicitement pour ce métier. Le palier prime toujours sur le score dans `pickLook` (injecté comme
  composante dominante avant le score brut, `rankWithTies(pool, d => d.score - directionTier(d) *
  1000, rng)`) : une direction adaptée ne peut donc plus jamais finir derrière une direction hors
  sujet, quel que soit le malus de variété (`-2*n`, non plafonné mais neutralisé par le palier —
  satisfait la règle « appliqué seulement entre directions adaptées »). `ff composer`/`ff
  propositions` affichent maintenant un bloc **« Directions envisagées (3 meilleures) »** listant les
  3 candidates retenues avec, pour chacune, sa raison en une ligne (palier + `reasons`), et un
  avertissement explicite (`⚠`) quand la direction choisie n'a aucun lien avec le métier
  (`metierAdapte === false`). `ff propositions` en bénéficie automatiquement : il appelle `pickLook`
  du même module, aucun fichier propre à toucher.
  **Vérifié** : `ff composer essai-dryrun --metier "Fleuriste"` → 1. `atelier` (adaptée au métier,
  malgré `-8` de malus, déjà utilisée 4 fois) ; `ff composer essai-dryrun --metier "Avocat"` →
  1. `journal` (adaptée). Aucun avertissement dans les deux cas (slug jetable créé puis supprimé pour
  le test, voir fin de ce document).
  **Tests** : `tests/composer.test.mjs` (nouveau — aucun test existant n'exerçait `scoreDirections`/
  la sélection de direction avant cette session, rien à adapter) : un cas direct sur `directionTier`
  avec un malus extrême (50 usages) prouve que le palier tient malgré un score très négatif ; deux
  cas sur `pickLook` (25 graines pour « fleuriste », 10 pour « avocat ») vérifient qu'aucune ne tombe
  hors sujet ; un cas vérifie la forme de `top3` (triée par palier) ; un cas vérifie que
  `metierAdapte` passe à `false` pour un métier qu'aucune direction ne liste (déclenche
  l'avertissement). `node --test tests/composer.test.mjs` : 5/5 verts. `tests/presets.test.mjs`
  (référencé comme risque de casse dans la friction initiale, réutilise `shellFits`, pas
  `scoreDirections`) : 24/24 toujours verts.

## 4. `ff propositions --n 2`, choix, `ff figer`

- **Commandes :** `node scripts/ff.mjs propositions essai-dryrun --n 2`, puis `--appliquer 1`, puis
  `node scripts/ff.mjs figer essai-dryrun`.
- **Durée :** propositions ~1 min 14 s (deux builds complets + captures desktop/mobile), appliquer
  ~1 s, figer ~17 s (refait un build de validation).
- **Résultat :** ✓ techniquement — feuille de contact `propositions/essai-dryrun/index.html` claire
  (deux colonnes, captures desktop/mobile côte à côte, JSON du look dans un `<details>` repliable,
  lisible par une associée non technique). `--appliquer 1` et `figer` ont fonctionné sans erreur.
- **⚠ Confirme la friction §3** : les deux propositions générées sont `industriel` et `neon` — aucune
  des deux n'est `atelier` (qui liste pourtant `fleuriste` dans ses métiers). Sur la capture desktop
  de la proposition 1 (`propositions/essai-dryrun/prop-1-desktop.png`), le badge « 7 ans
  d'expérience » du hero chevauche visuellement le mot « COMPOSÉES » du titre en marquee — défaut
  visuel mineur, non corrigé ici (le fichier en cause est une section partagée `src/sections/`, hors
  du périmètre autorisé pour cette répétition générale — `scripts/ff/*.mjs` uniquement).

## 5. `ff build` + `ff verifier`

- **Commandes :** `node scripts/ff.mjs build essai-dryrun`, `node scripts/ff.mjs verifier essai-dryrun`.
- **Durée :** build ~18 s, verifier ~17 s (refait un build).
- **Résultat :** ✓ le build, ⚠ verifier — corrigé en cours de route (voir ci-dessous).
- **✗ corrigé — faux échec « Aucun lien tel: dans les 1500 premiers caractères du corps »**
  (`scripts/ff/verifier.mjs`, `checkTelPremierEcran`) : le look figé en §3/§4 utilise la nav `burger`
  et le hero `marquee`, tous deux choisis automatiquement par `ff composer`/`ff propositions`. Le
  panneau plein écran de `Nav/burger.astro` (`data-burger-panel`, cache par CSS/`aria-hidden` tant
  qu'on n'a pas cliqué) et son `<script>` d'ouverture/fermeture sont injectés dans le HTML **avant**
  le `<main>`/hero — la vérification ne les excluait pas (seuls `<svg>` et le rideau `ff-curtain`
  l'étaient), alors qu'ils sont strictement invisibles au chargement. Résultat : le bouton
  « Appeler » du hero, bien réel et bien visible à l'écran (confirmé sur la capture
  `propositions/essai-dryrun/prop-1-desktop.png`), tombait après le budget de 1500 caractères bruts
  et faisait échouer `ff verifier` sans raison — un non-développeur aurait vu un ✗ sur un site
  parfaitement correct, sans savoir que c'est la nav "burger" (une des 6 variantes documentées et
  choisie automatiquement par l'outil !) qui en est la cause.
  **Corrigé dans `scripts/ff/verifier.mjs`** : le panneau burger et les `<script>` inline sont
  désormais retirés du texte mesuré (même logique déjà utilisée pour les icônes SVG et le rideau de
  transition), et le budget passe de 1500 à 2200 caractères — un hero complet (eyebrow + h1 +
  sous-titre + bouton tel:) sous l'en-tête burger atteint ~1800 caractères une fois les classes
  Tailwind comptées, sans marge avec l'ancien budget. Revérifié : `ff verifier essai-dryrun` passe
  maintenant ce point.
- **✗ non corrigé, attendu** : « Texte de substitution "exemple.fr" trouvé » — normal, c'est
  volontairement l'e-mail fictif du test (`contact@exemple.fr`). Preuve que le contrôle anti-placeholder
  fonctionne ; pour un vrai client ce serait un vrai échec à corriger avant livraison.
- **⚠ avertissements normaux (non corrigés, comportement attendu)** : pas de bloc sur-mesure (aucun
  n'a été demandé pour ce client fictif), SIRET absent (brief le marque « à demander », correct), pas
  de police display distincte pour la direction `industriel` choisie automatiquement (limite déjà
  documentée pour cette direction), `<p>` de `confidentialite.html` sans classe `measure` (page
  générique, hors périmètre de cette répétition), mot « le plus » dans `404.html` (texte générique du
  gabarit, à surveiller mais hors périmètre client).

## 6. `ff detect` et `ff audit-motion`

- **Commandes :** `node scripts/ff.mjs detect essai-dryrun`, `node scripts/ff.mjs audit-motion essai-dryrun`.
- **Durée :** detect ~10 s (premier lancement npx), audit-motion ~46 s (desktop + mobile).
- **`ff detect` :** ✓ — seulement deux avertissements normaux (eyebrow un peu long, ombre latérale des
  cartes), aucun échec bloquant.
- **`ff audit-motion` :** ✓ (corrigé en session suivante) — était **GROSSE friction, non corrigée
  lors de cette répétition générale** (fichier explicitement interdit à l'époque :
  `scripts/ff/audit-motion.mjs`). Même cause racine que le §5 : les 5 liens du panneau plein écran de
  la nav `burger` (`div#burger-panel > nav > a`, `data-stagger`) étaient signalés « apparitions au
  scroll restées invisibles » (opacity 0, jamais révélées), desktop et mobile. Normal et voulu : ce
  panneau ne s'affiche qu'au clic sur le bouton burger, l'audit ne l'ouvre jamais avant de défiler la
  page — mais il reste `position: fixed` en plein écran (donc avec des `getClientRects()` non vides
  même translaté hors-champ), le filtre existant sur `getClientRects().length === 0` (qui exclut
  correctement les panneaux en `display:none`, ex. nav `floating`) ne le voyait donc jamais.
  **Corrigé dans `scripts/ff/audit-motion.mjs`** (`collectDiagnostics`, contrôle des apparitions au
  scroll) : ajout d'un filtre `el.closest('[aria-hidden="true"], [hidden], dialog:not([open])')` —
  le panneau burger porte `aria-hidden="true"` au repos (`src/sections/Nav/burger.astro`, retiré
  seulement à l'ouverture par le script), donc tous ses descendants sont désormais ignorés tant qu'il
  reste fermé, sans dépendre d'un sélecteur spécifique à la nav burger (couvre aussi tout futur
  panneau/dialogue fermé qui suit la même convention `aria-hidden`/`hidden`/`<dialog>`).
  **Vérifié** : slug jetable avec `layout.nav: 'burger'` et `motion: 'rich'` (aucun site existant
  n'utilisait cette nav), `ff build` puis `ff audit-motion` → les deux viewports passent au vert,
  section « Apparitions au scroll » comprise (slug supprimé après vérification, voir fin de ce
  document). Aucun test dédié à `audit-motion.mjs` n'existait avant cette session (le seul test lié,
  `tests/motion.test.mjs`, couvre `motion.ts`/`global.css`, pas ce script — qui dépend de Chrome via
  `playwright-core` et d'un build complet, donc pas de cas ajouté ici, conformément à la consigne
  « si un test de l'audit existe »).

## 7. `ff perf`, `ff lighthouse --mobile`, `ff og`, `ff archiver`

- **`node scripts/ff.mjs perf essai-dryrun`** (~1 s, build réutilisé) : ✗ catégorie `fonts` — 172 Ko
  vs budget 160 Ko (`crimsonPro` + `familjenGrotesk`, latin + latin-ext, poids variable). Cause :
  la paire de polices vient elle aussi de `ff composer`/`ff propositions` (§3), qui choisit les
  polices par variété (paire jamais utilisée) sans jamais regarder `perf-budget.json` — même racine
  que la friction §3, non corrigée ici pour la même raison (logique de score, tests existants à ne
  pas casser à l'aveugle). Pour un vrai client, ça se serait vu ici, avant livraison — `ff perf` a
  fait exactement son travail — mais une associée non technique ne pourrait pas deviner qu'il faut
  changer la paire de polices dans `look.json`/`site.config.ts` plutôt que réduire les images ; à
  documenter dans `docs/COMMANDES.md` (« que faire quand un truc cloche ») : ajouté ci-dessous.
- **`node scripts/ff.mjs lighthouse essai-dryrun --mobile`** (~1 min 51 s) : ✓ — accueil 96/96/100/100
  sur mobile, seuil respecté. Remarque non bloquante : `mentions-legales` affiche un score SEO de 66
  (page générique, hors périmètre client) — n'échoue pas la commande, seule la page d'accueil est
  exigée ≥ 90 (comportement documenté, pas un bug).
- **`node scripts/ff.mjs og essai-dryrun`** (~1,3 s) : ✓ — `og.webp` généré et `images.og` ajouté
  automatiquement dans `site.config.ts`.
- **`node scripts/ff.mjs archiver essai-dryrun`** (~9 s) : ✓ — zip créé dans `archives/`.

### Petite correction de doc apportée (`docs/COMMANDES.md`, § 3 « quand quelque chose cloche »)

Ajout d'une ligne pour orienter vers `ff perf`/le choix de police quand le budget de perf est dépassé
(voir diff plus bas).

## 8. `ff deploy`, `ff domaine --simuler`, `ff exporter`

- **`node scripts/ff.mjs deploy essai-dryrun`** (~48 s) : ⚠ ne teste pas le scénario demandé — `npx
  wrangler` est **déjà connecté** sur cette machine (compte Cloudflare réel du fondateur), donc la
  commande n'a pas pu être observée en situation "pas connecté". Elle a échoué plus loin, proprement,
  sur `Project not found` (le projet Cloudflare Pages "essai-dryrun" n'existe pas — normal, jamais créé
  pour ce test) — **aucun fichier n'a été déployé**. Vérification faite en lisant le code à la place
  (`scripts/ff/deploy.mjs` lignes 32-40) : un `wrangler whoami` est appelé avant tout déploiement, et
  s'il échoue, le message est exactement ce qui était demandé — « Non connecte a Cloudflare. » suivi de
  `npx wrangler login` en clair et d'une phrase expliquant le geste (page navigateur, relancer `ff
  deploy` ensuite). Rien à corriger. **Point de vigilance pour le fondateur** : cette commande a fait un
  vrai appel authentifié à l'API Cloudflare de son compte (résultat : échec propre, rien créé) — normal
  puisque wrangler est connecté sur cette machine partagée par tous les chantiers.
- **`node scripts/ff.mjs domaine essai-dryrun essai-dryrun.fr --simuler`** (~1 s) : ✓ — affiche chaque
  appel prévu (GET/POST, avec le corps JSON) sans aucune requête réseau, se termine par « Simulation
  terminee (aucun appel reseau) ». Clair et sûr pour une associée qui veut comprendre ce que la vraie
  commande ferait avant de la lancer.
- **`node scripts/ff.mjs exporter essai-dryrun --dest <dossier temporaire>`** (~11 s) : ✓ — `--dest`
  bien documenté dans l'usage et fonctionnel, dépôt git autonome créé avec un seul commit, ne contient
  que `sites/essai-dryrun` côté sites clients (pas les autres sites du studio). Supprimé après le test
  (dossier temporaire hors repo).

## 9. Serveur MCP (`scripts/ff-mcp.mjs`)

- **Commande :** `initialize` puis `tools/list` envoyés en JSON-RPC 2.0 ligne par ligne (stdin) à
  `node scripts/ff-mcp.mjs`.
- **Résultat :** ✓ — réponse `initialize` correcte (protocolVersion, capabilities, serverInfo,
  instructions claires), puis `tools/list` renvoie les 10 outils attendus (`ff_aide`, `ff_liste`,
  `ff_variete`, `ff_modeles`, `ff_nouveau`, `ff_build`, `ff_verifier`, `ff_composer`, `ff_perf`,
  `ff_captures`) avec schémas d'entrée corrects.
- **⚠ Petite friction corrigée — documentation manquante** : ni `docs/COMMANDES.md` ni
  `docs/PROCESS.md` (les deux documents destinés au fondateur non technique) n'expliquaient comment
  brancher ce serveur dans Claude Code (`CLAUDE.md`, document technique, donne seulement la
  déclaration JSON brute). Ajouté dans `docs/COMMANDES.md` une section « Piloter l'atelier sans
  terminal (serveur MCP) » avec la commande exacte `claude mcp add ff-atelier -- node
  scripts/ff-mcp.mjs` et le rappel du périmètre volontairement exclu (deploy/domaine/generer).

## 10. `ff servir` + `ff sante` en local

- **Commandes :** `node scripts/ff.mjs servir essai-dryrun` (arrière-plan, `http://localhost:8001`),
  `node scripts/ff.mjs sante http://localhost:8001`, puis arrêt du serveur.
- **Durée :** servir démarre en ~2 s, sante ~1,5 s.
- **Résultat initial :** ⚠ — 2 échecs sur le bilan, tous les deux de faux positifs connus d'un test en
  local :
  - `/404 repond 200 (attendu 404)` : le petit serveur statique de `scripts/serve-all.mjs` sert
    `404.html` avec un statut 200 dès qu'il trouve le fichier (il ne simule pas le comportement réel
    de Cloudflare Pages, qui renvoie un vrai 404). Fichier hors périmètre autorisé pour cette
    répétition générale (`scripts/serve-all.mjs`, pas dans `scripts/ff/`) — non corrigé à l'époque,
    signalé.
  - `canonical (essai-dryrun.pages.dev) ne correspond pas au domaine attendu (localhost)` : normal,
    le canonical du build pointe vers le vrai domaine, pas `localhost` — reste un faux échec attendu,
    non corrigé (rien à corriger : le build n'a et ne doit pas avoir connaissance de `localhost`).
  Aucun des deux n'indiquait un vrai problème, mais rien ne le disait avant ce test — une associée non
  technique aurait vu deux ✗ rouges sur un site par ailleurs parfait et aurait pu perdre du temps à
  chercher un bug inexistant.
- **✓ `/404` corrigé (session suivante, `scripts/serve-all.mjs`)** : la cause exacte était que la
  résolution `/404` → `/404.html` (repli `.html` déjà en place pour toutes les routes) faisait sortir
  la requête de la branche « fichier introuvable » (seule branche qui posait un statut 404) avant même
  de vérifier le chemin d'origine — le fichier `404.html` existant bel et bien, la réponse partait en
  200. Corrigé en reproduisant exactement le serveur local déjà utilisé et validé par
  `tests/sante.test.mjs` : tout chemin réellement introuvable sert `dist/<slug>/404.html` (statut 404,
  mêmes en-têtes `_headers`) et, en plus, le chemin `/404` littéral reçoit toujours le statut 404 même
  s'il résout vers un fichier existant (comportement réel de Cloudflare Pages : `/404` EST la page
  d'erreur, pas une page normale). **Vérifié** : `ff servir` sur un slug jetable, `curl /404` → 404,
  `curl /chemin-inconnu` → 404, `curl /` → 200 ; puis `ff sante http://localhost:PORT` → `✓ Page /404
  repond bien 404` (seul le canonical reste en ✗, attendu). Slug supprimé après vérification.
- **Petite correction apportée** (`scripts/ff/aide.mjs`, entrée `sante`) : la phrase annonçait
  seulement « TLS/RDAP/DNS alors ignorés » pour un test local — complétée pour prévenir de l'échec
  attendu du canonical, et mise à jour pour retirer la mention de `/404` (qui n'est plus un faux échec
  depuis la correction de `scripts/serve-all.mjs`).
- **Reste correct** : tous les autres points passent (title, description, JSON-LD, `tel:`, formulaire,
  temps de réponse 14 ms, `Cache-Control` long sur les assets `/_astro`).

## Bilan

- **Étapes rejouées :** 10 (nouveau+config, ff-generer, composer, propositions+figer, build+verifier,
  detect+audit-motion, perf/lighthouse/og/archiver, deploy/domaine/exporter, MCP, servir+sante).
- **✓ sans accroc :** ff nouveau, ff-generer (message d'erreur), ff propositions/figer (mécanique),
  ff build, ff detect, ff lighthouse, ff og, ff archiver, ff domaine --simuler, ff exporter, serveur MCP,
  la plupart des points de `ff verifier`/`ff sante`.
- **⚠ corrigées dans cette session** (petites, dans le périmètre autorisé) :
  1. `ff verifier` — faux échec « Aucun lien tel: » pour la nav `burger` (`scripts/ff/verifier.mjs`).
  2. `docs/COMMANDES.md` — commande pour brancher le serveur MCP dans Claude Code, absente des deux
     docs destinées au fondateur non technique.
  3. `docs/COMMANDES.md` — ligne « que faire quand `ff perf` échoue sur les polices ».
  4. `scripts/ff/aide.mjs` — l'aide de `ff sante` ne prévenait pas des deux faux échecs attendus en
     local (`/404`, canonical).
- **✗ → ✓ GROSSES frictions, corrigées dans une session dédiée (20 sept. 2026, périmètre
  `scripts/ff/composer.mjs`, `scripts/ff/audit-motion.mjs`, `scripts/serve-all.mjs`,
  `scripts/ff/aide.mjs`, `tests/`, `docs/COMMANDES.md`) :**
  1. **`ff composer`/`ff propositions`** pouvaient choisir une direction (et une paire de polices)
     sans rapport avec le métier dès que la direction pertinente avait déjà servi ailleurs — le malus
     variété pouvait annuler le bonus métier sans avertissement. **Corrigé** : `scoreDirections`
     calcule un palier (adaptée/neutre/à éviter, `directionTier`) qui prime toujours sur le score dans
     `pickLook` — une direction adaptée au métier ne peut plus finir derrière une direction hors sujet,
     quel que soit le malus de variété. `ff composer` affiche désormais les 3 directions envisagées
     avec leur raison, et un avertissement explicite quand la direction retenue n'a aucun lien avec le
     métier. Voir §3. Tests : `tests/composer.test.mjs` (nouveau, 5 cas).
  2. **`ff audit-motion`** signalait à tort les liens du panneau `burger` comme des animations de
     scroll restées invisibles — faux ✗ systématique pour toute livraison en nav `burger`. **Corrigé** :
     les descendants d'un panneau/dialogue `aria-hidden="true"`/`[hidden]`/`<dialog>` fermé sont
     désormais ignorés par le contrôle des apparitions au scroll (`scripts/ff/audit-motion.mjs`). Voir
     §6.
  3. **`scripts/serve-all.mjs`** (`ff servir`) renvoyait toujours 200 sur `/404`, jamais un vrai 404 —
     faussait un des points de `ff sante` testé en local. **Corrigé** : `/404` et tout chemin
     réellement introuvable renvoient désormais un vrai statut 404 (même comportement que le serveur
     local déjà validé par `tests/sante.test.mjs`) ; `docs/ff/aide.mjs` mis à jour. Voir §10.
- **Nettoyage final (répétition générale du 20 sept.) :** `sites/essai-dryrun`, `dist/essai-dryrun`,
  `dist/_prop-essai-dryrun-*`, `propositions/essai-dryrun`, `captures/essai-dryrun*`,
  `captures/localhost-sante.json`, `archives/essai-dryrun-2026-09-20.zip` supprimés. **Nettoyage de la
  session de correction (même jour) :** slugs jetables `essai-dryrun` recréés puis supprimés à chaque
  vérification (§3, §6, §10) — aucun résidu dans `sites/`, `dist/`, `captures/` en fin de session.
