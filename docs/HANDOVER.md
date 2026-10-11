# HANDOVER — ff-atelier & finckfisch.fr

Document de passation pour une session d'agent IA (Claude Code, Kimi, Cursor...).
Tu reprends le repo **ff-atelier** (`C:\Users\nadja\ff-atelier`) et le site du studio
**Finck & Fisch** (`sites/finck-fisch/`). Lis ce fichier EN ENTIER avant de toucher au code.
Référence permanente : `CLAUDE.md` (règles du repo) + `AGENTS.md` (résumé multi-agents).

---

## 1. Le projet en 30 secondes

- **ff-atelier** = fabrique de sites vitrines pour artisans (studio Finck & Fisch, 2 associés).
  Un seul projet Astro 5 + Tailwind 4 + zod, N sites clients dans `sites/<slug>/`.
  Un site = un fichier `sites/<slug>/site.config.ts` validé par `src/lib/schema.ts` (zod).
- **finck-fisch** = le site du studio lui-même (dogfooding), dans `sites/finck-fisch/`.
- Tout se pilote par `node scripts/ff.mjs <commande>` (alias `npm run ff -- <commande>`).
  Commandes : `node scripts/ff.mjs aide`.

## 2. État des lieux — ce qui est FAIT (ne pas refaire)

Session du 18 sept 2026. Tout est commité localement ? NON — vérifier `git status` et
committer si demandé. Tests : **385/385 verts** (`npm test`). Verifier finck-fisch : vert
sauf placeholders (voir §4 P0).

**Visibilité IA des sites produits (GEO) :**
- JSON-LD unique par page via `@graph` (`src/layouts/Base.astro`) : LocalBusiness enrichi
  (geo, openingHoursSpecification), FAQPage (accueil), Service (pages /services/*).
  Module pur : `src/lib/jsonld.ts` (+ `tests/jsonld.test.mjs`).
- `robots.txt` dynamique (`src/pages/robots.txt.ts`) : autorise explicitement les bots de
  recherche IA (OAI-SearchBot, PerplexityBot...) + sitemap en URL absolue. Les anciens
  `sites/*/public/robots.txt` statiques sont SUPPRIMÉS volontairement.
- `llms.txt` généré par build (`src/pages/llms.txt.ts`).
- **IndexNow** intégré à `ff deploy` (clé `sites/<slug>/public/indexnow-<cle>.txt` créée
  AVANT le build, soumission Bing après déploiement) + commande `ff indexnow <slug>`.
  Module : `scripts/ff/indexnow.mjs` (+ tests).
- Bloc « visibilité IA » dans `ff verifier` : robots.txt, llms.txt, FAQPage, Service JSON-LD.
- Checklist livraison enrichie (`docs/PROCESS.md` § Définition de fait) : Bing Places,
  Cloudflare AI bots décochés.

**Outillage :**
- `ff-generer` réécrit en **sortie structurée** : le modèle remplit un JSON contraint par
  tool use (schéma = `z.toJSONSchema(siteSchema)`), validé zod, sérialisé en TS par `toTs`.
  ⚠️ Testé jusqu'à l'appel API, JAMAIS bout en bout avec une vraie clé (voir §4 P2).
- **Serveur MCP** `scripts/ff-mcp.mjs` (stdio, zéro dépendance, 5 tests) : expose build,
  verifier, composer, captures... comme outils agent. Deploy/génération exclus volontairement.
- `AGENTS.md` à la racine.

**Refonte anti-« look IA » (site F&F + factory) :**
- F&F : titres en **Cormorant** (`typography.display: 'cormorant'` dans site.config.ts),
  grain photo (`data-grain`) hero + manifeste, manifeste réintégré (bloc encre signé),
  boutons magnétiques, em italique dans le hero.
- **Monogramme réel restauré** : `sites/finck-fisch/public/images/monogramme-clair.png`
  (868×283, recadré depuis `logo-clair.png`). L'ancien était un glyphe générique — ne JAMAIS
  réutiliser `ff logo` pour régénérer ce fichier. Favicon refait (vrai monogramme incrusté).
- Hero : animation d'ouverture CSS (tracé + mise au point), nom en texte Cormorant live.
- Grain `body::before/::after` ajouté aux directions sombres **eclipse** et **luxe**.
- `docs/CONVENTIONS.md` : règles **19** (rythme de page, temps fort) et **20** (matière,
  geste humain) + piège `<script` en commentaire (règle 9). Skill `/nouveau-site` mis à jour.

## 3. Règles NON NÉGOCIABLES (casser l'une = travail à refaire)

1. **Jamais de donnée inventée.** Pas de faux avis, chiffres, horaires, téléphone. Un champ
   sans source reste absent (art. L121-2 Code de la consommation). Le verifier traque les
   placeholders (`06 00 00 00 00` = ÉCHEC voulu tant que le vrai numéro n'est pas là).
2. **Tokens uniquement** dans sections/directions — jamais de couleur/police/rayon en dur.
3. **Toute variante** de section est enregistrée dans `VARIANTS` (`src/lib/schema.ts`) + doc
   `docs/DIRECTIONS.md`. `defineSite` rejette le reste — ne pas contourner.
4. **Marquage AI Act** : tout visuel généré/animé par IA sur un site = `data-ia="1"` +
   mention visible (obligatoire depuis le 2 août 2026). Voir `scripts/ff/animer.mjs`.
5. **`sites/_exemple/` = référence de schéma.** Ne pas modifier sauf demande explicite.
6. **Avant de finir** : `npm test` + `node scripts/ff.mjs verifier <slug>` verts.
7. Après toute modif de `src/` (moteur) : **redémarrer le dev server** (Ctrl+C, relancer).
   Le HMR gère contenu/look, pas les nouveaux modules moteur.

## 4. TRAVAIL À FAIRE — par ordre de priorité

### P0 — Bloquants mise en ligne finckfisch.fr

1. **Coordonnées réelles** (demander au fondateur, NE RIEN INVENTER) :
   `sites/finck-fisch/site.config.ts` → `contact.phone` / `phoneDisplay` (actuellement
   `+33600000000`), `contact.address`, `business.siret` (absent → warning mentions légales).
2. **Formulaire** : `form.provider: 'mailto'` à remplacer. Recommandé : `'cloudflare'`
   (Worker inclus, `docs/DEPLOIEMENT.md` § Formulaire) ou `'web3forms'` (clé gratuite).
3. **Prix** : `sections/Offre.astro` lignes 14-15 — PRIX PROVISOIRES (1 200 / 1 800 €)
   à confirmer par les fondateurs. Idem garantie 72 h (FAQ, `wording`, remise 10 %
   « engagement provisoire, à confirmer avant signature »).

### P0 — Monogramme animé en SVG dans le hero — **FAIT (18 sept 2026)**

Le hero (`sites/finck-fisch/sections/Hero.astro`) affiche le monogramme en **SVG inline animé,
en filigrane géant d'arrière-plan** (droite, saigne hors cadre) : tracé calligraphique
séquentiel des 6 sous-traits (`sections/mono-subpaths.ts`, extraits de
`public/images/monogramme.svg` par `.ff-tmp/vec/extract-subpaths.mjs`), puis le corps reste en
**dégradé perle « lumière tombante » (tokens `--fg`/`--accent`) + filet d'argent persistant
(stroke `--accent` à 22 %) + halo radial** — ne JAMAIS revenir à un blanc plat à faible
opacité (rend gris boueux, « tache »). Lame chrome clippée à la forme, 8 micro-étincelles —
version accélérée (~35 % plus rapide que la vidéo de référence
`~/Downloads/ff-logo-anime-v3.webm`, enregistrée pour les réseaux via
`.ff-tmp/vec/record-v3.mjs`). `prefers-reduced-motion` : monogramme statique. Ne pas régénérer
`monogramme-clair.png` avec `ff logo` (glyphe générique) : la source est `logo-clair.png`.

### P1 — Mise en ligne

4. `node scripts/ff.mjs deploy finck-fisch` (wrangler login requis la 1re fois), puis
   `node scripts/ff.mjs domaine finck-fisch finckfisch.fr --email-vers <adresse> --simuler`
   d'abord, sans `--simuler` ensuite. IndexNow part automatiquement.
5. **Cloudflare dashboard** : vérifier que le blocage bots IA est DÉSACTIVÉ pour les bots
   de recherche (sinon le robots.txt ne sert à rien).
6. **Fiches d'établissement du studio** : Google Business Profile + **Bing Places**
   (import GBP possible) — le studio vend de la visibilité locale, sa propre fiche est la
   preuve n°1. Ajouter la note Google au site (`proof.google`) dès 3-5 avis RÉELS.
7. J+1 : `ff sante finck-fisch`. Ajouter le slug à `sites-en-ligne.json` (suivi hebdo).

### P1 — Contenu

8. **Réalisations** : remplacer les captures « démonstration » par des liens vers les vrais
   sites clients dès qu'ils sont en ligne (`sites/finck-fisch/vitrine.json` + section
   `Realisations.astro`). Ajouter les scores Lighthouse réels des sites livrés comme preuve.
9. Relire FAQ (`site.config.ts`) : 2-3 réponses datent de la rédaction initiale, à valider
   par les fondateurs (garantie, délais, « deux associés »).

### P2 — Factory / robustesse

10. **Tester `ff-generer` bout en bout** avec la vraie clé (`node scripts/ff-generer.mjs
    demo-boulangerie`) : vérifier que le tool use + validation zod + sérialisation passent,
    et que le texte généré respecte `docs/REDACTION.md`. Garder un œil sur le coût/appel.
11. **Brancher le MCP** : `claude mcp add ff-atelier -- node scripts/ff-mcp.mjs`
    (ou config équivalente Cursor/Kimi). Objectif : l'associée non-développeuse pilote
    build/vérif/captures en langage naturel.
12. **Test de fumée dev server** dans `tests/` : démarrer `astro dev` sur _exemple, fetch `/`,
    assert pas de « Failed to scan » + `--bg` appliqué (les 2 bugs du 18 sept : commentaire
    `<script` dans un frontmatter, `:root` vs `:where(:root)` — voir §5).
13. Appliquer conventions 19-20 aux prochains sites clients (temps fort + matière) ; vérifier
    au premier `ff captures`.

## 5. Pièges déjà payés (ne pas les racheter)

- **Jamais `<script` (avec chevron) dans un commentaire de frontmatter .astro** : le scan de
  dépendances Vite le prend pour une vraie balise → build dev à froid cassé → CSS non chargé
  → FOND BLANC. Écrire « balise script » à la place (règle 9 CONVENTIONS).
- **Fallback CSS global** : `src/styles/global.css` utilise `:where(:root)` (spécificité 0)
  pour que la direction gagne quel que soit l'ordre d'injection Vite en dev. Ne JAMAIS
  remettre `:root` nu — sinon fond blanc en dev sur les directions sombres.
- **JSON-LD** : UN SEUL `<script type="application/ld+json">` avec `@graph` dans Base.astro.
  Des balises script dynamiques (`.map()`) cassaient le scan Vite.
- **Dev server fantôme** : un `ff dev` laissé tourner pendant des éditions de `src/` se
  corrompt (fond blanc, erreur esbuild `Unexpected "."`). Toujours redémarrer. Vérifier les
  process orphelins (`netstat -ano | grep 432`) avant de conclure que « le code est cassé ».
- **`ff` global** = junction npm vers le repo (`AppData\Roaming\npm\node_modules\ff-atelier`)
  — même code, pas de copie périmée. `ff dev ...` ≡ `node scripts/ff.mjs dev ...`.
- **Taille réelle du site buildé** : ~0,6 s de chargement, LCP ~0,8 s en local
  (budgets : `ff perf finck-fisch`, tout vert). La lenteur (6 s) n'existe qu'en dev.
- `ff servir <slug>` sert le build avec les en-têtes CSP — c'est LA façon fiable de montrer
  un site. Le dev server est pour développer.

- **Octobre 2026** (global CSS vs Tailwind, autoplay iPhone, image haute floue sur iOS, test iOS
  en https seulement, Vercel `cleanUrls`) : voir `CLAUDE.md` § Pièges déjà payés.

## 6. Carte des fichiers (les plus importants)

```
src/lib/schema.ts            schéma zod (source de vérité du contenu) + DIRECTIONS/VARIANTS
src/lib/jsonld.ts            JSON-LD : FAQPage, Service, horaires, jours FR -> schema.org
src/layouts/Base.astro       layout : tokens, SEO, @graph JSON-LD unique, motion
src/styles/global.css        tokens + utilitaires + data-grain + :where(:root) fallback
src/pages/robots.txt.ts      robots.txt dynamique (bots IA + sitemap absolu)
src/pages/llms.txt.ts        synthèse Markdown du site pour LLM
scripts/ff.mjs               CLI (aide : toutes les commandes)
scripts/ff/indexnow.mjs      IndexNow (clé, sitemap, soumission, ff indexnow)
scripts/ff/verifier.mjs      contrôle qualité (+ bloc visibilité IA)
scripts/ff-generer.mjs       génération de site.config.ts (tool use, JSON structuré)
scripts/ff-mcp.mjs           serveur MCP stdio
sites/finck-fisch/           LE site du studio (config, sections custom, images)
  sections/Hero.astro        hero (anim CSS actuelle, à remplacer par SVG — voir P0)
  public/images/monogramme.svg   monogramme vectorisé (pour l'anim SVG)
  public/images/monogramme-clair.png  monogramme PNG officiel (ne pas régénérer)
docs/CONVENTIONS.md          règles de code (19-20 = anti-« look IA », 9 = piège <script)
docs/PROCESS.md              processus client + checklist livraison (bloc visibilité IA)
tests/                       21 fichiers, 385 tests — `npm test`
```

## 7. Comment vérifier ton travail (obligatoire)

```bash
npm test                                          # 385 tests, doit rester vert
node scripts/ff.mjs verifier finck-fisch          # checklist (+ bloc visibilité IA)
node scripts/ff.mjs captures finck-fisch          # screenshots + erreurs console
node scripts/ff.mjs perf finck-fisch              # budgets de taille
node scripts/ff.mjs servir finck-fisch            # revue manuelle du build réel
```
