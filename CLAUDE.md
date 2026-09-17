# ff-atelier — instructions pour Claude Code

Studio Finck & Fisch : sites vitrines pour artisans. Un seul projet Astro, plusieurs sites
(`sites/<slug>/site.config.ts`). Toute session Claude Code dans ce repo doit suivre ce fichier.

## Le repo en une phrase

Un site = un fichier `sites/<slug>/site.config.ts` qui exporte `defineSite({...})` (schéma zod dans
`src/lib/schema.ts`). Les sections (`src/sections/<Type>/<variante>.astro`) et les directions
(`src/directions/<nom>/`) lisent ce fichier via `site` (`src/lib/site.ts`) et n'affichent que ce qu'il
contient. Rien n'est codé en dur côté contenu, rien n'est inventé côté données.

## Workflows en une commande

| Commande | Ce qu'elle fait |
|---|---|
| `node scripts/ff.mjs nouveau <slug>` | Crée `sites/<slug>/` à partir de `sites/_exemple`, prêt pour un brief. |
| `/nouveau-site <slug>` (Claude Code) | Lit `sites/<slug>/brief.md`, choisit direction/variantes, rédige les textes en français, écrit `site.config.ts`, build et vérifie. Voir `.claude/skills/nouveau-site/SKILL.md`. |
| `node scripts/ff-generer.mjs <slug>` | Même résultat que `/nouveau-site`, mais sans Claude Code : appelle l'API Anthropic directement (pour l'automatisation, ex. depuis `scrapping_artisans`). |
| `node scripts/ff.mjs build <slug>` | Build statique du site dans `dist/<slug>`. |
| `node scripts/ff.mjs verifier <slug>` | Contrôle qualité avant livraison (voir `docs/PROCESS.md` § définition de fait). |
| `node scripts/ff.mjs variete` | Liste les combinaisons direction + variantes déjà utilisées par les sites existants — à consulter avant de choisir une direction pour un nouveau client. |
| `node scripts/ff.mjs images <slug>` | Optimise/redimensionne les photos déposées dans `sites/<slug>/public/images/`. |
| `node scripts/ff.mjs nettoyer-photos <slug> [--angle N] [--duotone] [--valider]` | Nettoie `sites/<slug>/raw/*` avant `ff images` (sharp seul) : rotation EXIF + angle fin, recadrage des bordures unies, recadrage focal 4:3/3:2 (`sharp.strategy.attention`), balance des blancs gray-world, duotone optionnel (couleurs de la direction du site ou deux hex en argument). Sortie dans `.ff-tmp/nettoye/` + feuille de contact `apercu.html` ; `--valider` déplace les originaux dans `raw/originaux/` et copie les fichiers nettoyés dans `raw/`. Voir `docs/veille/redaction-images.md` §2.6. |
| `node scripts/ff.mjs photos <slug> "<requête>"` | Cherche des photos libres (Unsplash/Pexels, clés dans `.env`), feuille de contact `.ff-tmp/photos/apercu.html` ; `--choisir 1,3` copie les choisies dans `public/images/photo-<n>.webp` et journalise `CREDITS.md`. |
| `node scripts/ff.mjs video <slug> "<requête>"` | Cherche une vidéo Pexels, génère `public/videos/hero.webm` + `hero.mp4` + `poster.jpg` via ffmpeg (ou garde le mp4 source si ffmpeg absent) et journalise `CREDITS.md`. |
| `node scripts/ff.mjs illustration <slug> "<thème>"` | Tente une illustration unDraw recolorée (`--couleur`) ; sans API disponible, affiche la procédure manuelle. |
| `node scripts/ff.mjs deploy <slug>` | Déploie le site buildé sur Cloudflare Pages (voir `docs/DEPLOIEMENT.md`). |
| `node scripts/ff.mjs domaine <slug> <domaine> [--zone-id X] [--email-vers adresse] [--www] [--simuler]` | Branche un site déjà déployé sur un domaine personnalisé en une commande : projet Pages, DNS (CNAME proxifié, idempotent), et avec `--email-vers`, Email Routing (`contact@domaine` → l'adresse donnée). Écrit `sites/<slug>/domain.txt` et affiche une checklist finale. `--simuler` affiche les appels API sans les exécuter. Voir `docs/DEPLOIEMENT.md` § 2.2bis. |
| `node scripts/ff.mjs exporter <slug>` | Prépare la livraison finale au client (repo + domaine au nom du client). |
| `node scripts/ff.mjs composer <slug>` | Propose automatiquement un look (direction, variantes, typographie...) à partir de `site.config.ts`, écrit dans `look.json` sans toucher au contenu. |
| `node scripts/ff.mjs propositions <slug>` | Construit N looks différents avec captures d'écran, un par `propositions/<slug>/index.html`, pour comparer avant de choisir. |
| `node scripts/ff.mjs studio <slug>` | Éditeur visuel du look sur `http://127.0.0.1:4400` (direction, polices, échelle, tone, séparateur, libellés), écrit dans `look.json`. Onglet « Modèles » en haut du panneau pour appliquer un preset en un clic. |
| `node scripts/ff.mjs figer <slug>` | Fusionne `look.json` dans `site.config.ts` (le look choisi devient définitif) et supprime `look.json`. |
| `node scripts/ff.mjs modeles` | Liste les modèles (`presets/*.json`) : titre, direction/hero, métiers, vignette générée ou non. |
| `node scripts/ff.mjs modele <slug> <nom>` | Applique un modèle : copie son look dans `sites/<slug>/look.json` (remplacement complet). |
| `node scripts/ff.mjs vignettes [nom ...] [--forcer]` | Génère/rafraîchit `presets/vignettes/<nom>.webp` (capture du modèle sur `sites/_exemple`). |
| `node scripts/ff.mjs og <slug>` | Génère l'image Open Graph du site (`images.og`). |
| `node scripts/ff.mjs captures <slug>` | Prend des captures d'écran du site buildé (desktop/mobile). |
| `node scripts/ff.mjs lighthouse [slug] [--mobile] [--seuil 90] [--detail]` | Audite performance/accessibilité/bonnes pratiques/SEO (Lighthouse) sur l'accueil + une page service + mentions légales, desktop et mobile par défaut ; écrit `captures/<slug>-lighthouse.json`, sort en erreur si l'accueil est sous le seuil. `--detail` : imprime chaque audit en échec (les quatre catégories, pas seulement l'accessibilité) avec les extraits de noeuds fautifs (snippet/sélecteur), pour corriger sans deviner. Aussi disponible via `ff verifier <slug> --lighthouse`. |
| `node scripts/ff.mjs perf <slug> [--build] [--lighthouse]` | Budget de performance **sans navigateur** (rapide) : construit `dist/<slug>` seulement s'il est absent (ou avec `--build`), somme les octets bruts par catégorie (html, css, js-initial, js-lazy, fonts, images-home) référencés par `index.html`/le CSS livré, compare à `perf-budget.json` (racine du repo), table `✓`/`✗`, sort en erreur si une catégorie dépasse son budget ; écrit `captures/<slug>-perf.json`. `--lighthouse` enchaîne `ff lighthouse` (score + LCP réel, plus lent). Voir `docs/veille/performance.md` §6.3. |
| `node scripts/ff.mjs sante <slug|url> [--domaine x]` | Bilan de santé d'un site **déjà en ligne** (pas un build local) : HTTP 200 (accueil, sitemap, mentions légales, confidentialité), vrai 404 sur `/404`, redirection HTTP→HTTPS, canonical, `Cache-Control` d'un asset `/_astro`, `robots.txt`, title/description/JSON-LD/`tel:`/formulaire, temps de réponse, validité du certificat TLS, expiration du domaine (RDAP), DNS, MX. Accepte un slug connu (lit `sites/<slug>/domain.txt`) ou une URL directe (utile pour tester un `ff servir` local : TLS/RDAP/DNS alors ignorés). Écrit `captures/<slug>-sante.json`. À lancer à J+1 de la mise en ligne puis une fois par mois — voir `docs/PROCESS.md`. |
| `node scripts/ff.mjs servir <slug>` | Sert le build statique de `dist/<slug>` en local. |

Tous ces sous-commandes passent par `scripts/ff.mjs` (voir son en-tête : `Etendu par scripts/ff/*.mjs`).

## Règles dures

1. **Uniquement les tokens.** Jamais de couleur, police ou rayon en dur dans une section ou une
   direction — voir `docs/CONVENTIONS.md` § Règles des sections / des directions.
2. **Jamais de donnée inventée.** Pas de faux avis, pas de faux chiffres, pas de "+500 clients". Une
   donnée absente du brief laisse le champ absent dans `site.config.ts` ; la section correspondante
   s'adapte ou disparaît — elle ne se remplit jamais d'un placeholder. Un avis client inventé est une
   pratique commerciale trompeuse illégale (art. L121-2 du Code de la consommation) : voir
   l'avertissement dans `docs/BRIEF.md`.
3. **Une section lit `site` directement.** Frontmatter `import { site, ... } from '@/lib/site'`,
   aucune prop. Jamais de logique métier dans un composant partagé qui devine des données.
4. **Toute variante doit être enregistrée dans `VARIANTS`** (`src/lib/schema.ts`). `defineSite` rejette
   toute variante absente de cette liste — c'est voulu, ne pas contourner.
5. **Le schéma est la seule source de vérité du contenu.** N'ajoute jamais un champ affiché par une
   section sans l'ajouter d'abord à `src/lib/schema.ts` (avec son `.describe()`).

## Sections sur mesure et croissance de la bibliothèque

- Bloc unique à un client → `sites/<slug>/sections/<Nom>.astro` + `{ type: 'custom', variant: '<nom>', label }`
  dans le layout. Jamais dans `src/`.
- Composition réutilisable qui manque → `/nouvelle-variante`. Ambiance qui manque → `/nouvelle-direction`.
  La bibliothèque grandit avec les clients ; chaque ajout passe par `VARIANTS`/`DIRECTIONS`, la doc et `npm test`.

## Où sont les choses

- `src/lib/schema.ts` — schéma zod complet (`DIRECTIONS`, `MOTION`, `VARIANTS`, `SHELLS`,
  `HEADINGS`, `siteSchema`). `business.schemaType` (sous-type schema.org, ex. `Plumber`) et
  `contact.mapsProvider`/`contact.coordinates` (carte sans traceur, voir `docs/DIRECTIONS.md` § Carte)
  sont optionnels — ne jamais les deviner pour un client, laisser absent si le brief ne les fournit pas.
- `src/lib/site.ts` — `site` courant + helpers (`tel`, `mailto`, `whatsapp`, `fullAddress`,
  `yearsSince`, `paragraphs`, `navLinks`, `schemaTypeForTrade` — déduit un sous-type schema.org depuis
  `business.trade` en français, repli `LocalBusiness` ; implémenté dans `src/lib/schemaType.ts`,
  module pur re-exporté par `site.ts`, utilisé par `src/layouts/Base.astro` pour le JSON-LD quand
  `business.schemaType` n'est pas renseigné). Le JSON-LD ne contient jamais d'`aggregateRating` (avis
  self-serving interdit par Google) : la note Google reste affichée uniquement dans les sections
  (`proof/google`).
- `src/shells/<nom>.astro` — coquille de page (`layout.shell`) : rearrange nav/hero/sections/footer
  autour de la mise en page, ne restyle jamais une section (voir `docs/CONVENTIONS.md` § Coquilles).
- `src/sections/<Type>/<variante>.astro` — une section, une variante, un fichier.
- `src/directions/<nom>/` — `index.css` (tokens + polices) + `meta.ts` (ambiance, métiers, à éviter).
- `sites/<slug>/site.config.ts` — le contenu d'un client. `sites/<slug>/public/images/` — ses photos.
- `sites/_exemple/` — référence de schéma et fumigène de build. Ne pas y toucher pour un client.
- `docs/BRIEF.md` — brief à remplir pendant l'appel client. `docs/DIRECTIONS.md` — guide de choix de
  direction et de variantes. `docs/PROCESS.md` — processus client complet, de la prospection à la
  livraison. `docs/REDACTION.md` — règles opérationnelles de rédaction (mots interdits, professions
  réglementées, ton par métier, test du hero, 60 phrases d'accroche, lexique, micro-copie, checklist
  « textes livrables »), distillées de `docs/veille/redaction-images.md` §1. `docs/CONVENTIONS.md` —
  règles de code des sections et directions. `docs/ANIMATIONS.md`
  — liste complète des attributs `data-*` du moteur d'animation (`src/scripts/motion.ts`), un par
  ligne, quand les utiliser ; vitrine de tous les effets : `sites/_effets/`.
- `.claude/skills/nouveau-site/` — compétence `/nouveau-site` (génération de `site.config.ts` par
  Claude Code). `scripts/ff-generer.mjs` — équivalent en automatisation pure (API Anthropic).

## Quand tu ajoutes une variante

Trois choses, dans l'ordre, jamais une seule :

1. Le fichier `src/sections/<Type>/<nouvelle-variante>.astro` (respecte les règles de
   `docs/CONVENTIONS.md` : tokens uniquement, `id` correct, pas de donnée inventée, accessibilité).
2. L'entrée dans `VARIANTS.<Type>` (`src/lib/schema.ts`) — sinon `defineSite` la rejette.
3. Une ligne dans le tableau correspondant de `docs/DIRECTIONS.md` (variante + quand l'utiliser).

Une direction fonctionne pareil : dossier `src/directions/<nom>/` (`index.css` + `meta.ts`) + une ligne
dans la table des 8 directions de `docs/DIRECTIONS.md`.

## Ne pas toucher sans raison

`sites/_exemple/` est la référence de schéma pour tous les agents qui travaillent sur ce repo — un
changement y casse le fumigène de build de tout le monde. Modifie-le seulement si la demande porte
explicitement dessus.
