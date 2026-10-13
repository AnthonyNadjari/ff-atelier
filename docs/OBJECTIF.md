# Objectif de l'atelier

À partir d'un brief de 15 minutes, produire en moins de deux heures un site unique, vérifié, mis en ligne,
que le client possède, et que personne ne peut confondre avec un autre site de l'atelier ; avec une
bibliothèque et des tests qui grandissent à chaque site.

Ce fichier est la mémoire de la boucle autonome. Chaque tour met à jour l'état ci-dessous.
Ne jamais cocher un critère sans l'avoir vérifié par une commande ou une capture.

## Critères de « fini »

| # | Critère | État | Vérification |
|---|---|---|---|
| 1 | 20 sites de démonstration dessinés à la main, 20 métiers, chacun avec hero + nav + ≥ 2 blocs sur mesure, aucun bloc copié d'un site à l'autre | 20 / 20 ✓ (17 sept 2026) | `ls sites/*/sections/` ; comparaison manuelle des compositions |
| 2 | Chaque site : build ✓, `ff verifier` ✓ (sauf téléphone fictif), captures sans erreur ni débordement, mobile relu, Lighthouse ≥ 90 (perf, a11y, SEO) | build/captures ✓ ; `ff lighthouse` 17 sept 15h30 (site le plus lourd, toits-cie, mobile) : accueil perf 91 / a11y 100 / bp 100 / seo 92 ; dubois-plomberie mobile 94, desktop 100 ; `ff perf` vert sur toits-cie (css 51 Ko, polices 128 Ko) | `ff tous`, `ff captures`, `node scripts/ff.mjs lighthouse <slug> --detail` |
| 3 | Moteur d'animation : ≥ 15 effets documentés, chacun utilisé dans ≥ 2 sites, sans bug connu | 16 effets ; usage ×2 à vérifier ; 3 bugs corrigés le 16 sept | `grep -l data-<effet> sites/*/sections/*.astro` |
| 4 | Chaîne de bout en bout sur un vrai brief : formulaire → `/nouveau-site` → `ff propositions` → `ff deploy` → `ff exporter` | non prouvée (deploy nécessite `npx wrangler login`, action humaine) | exécuter la chaîne sur un slug de test |
| 5 | Tests + CI verts à chaque commit ; matrice couvrant directions, coquilles, navs | tests ✓ (dont `tests/headers.test.mjs`, `tests/captures-compare.test.mjs` ajoutés le 17 sept 2026) ; CI complétée le 17 sept 2026 (`.github/workflows/ci.yml`) — job `test` : `npm ci` → `npm test` → `ff tous` → Chrome du runner localisé dynamiquement (`CHROME_PATH`, `command -v google-chrome-stable`) → `ff captures` (échoue sur erreur console/débordement, CSP comprise) → `ff audit-motion` (guardé par `test -f`, livré en parallèle par un autre agent) → `ff lighthouse _exemple --mobile` → `captures/` uploadé en artefact ; job `sante-hebdomadaire` (cron lundi) : `ff sante` sur chaque slug de `sites-en-ligne.json`, ouvre une issue (`actions/github-script`) si échec ; matrice : directions ✓, coquilles ✓, navs ✗ | `npm test`, `ff matrice --rapide`, onglet Actions |
| 6 | Docs à jour : PROCESS, compétences, CONVENTIONS, chaque motif documenté le jour où il naît | à relire après chaque tour | relecture |
| 7 | Premier site client réel livré et payé | action humaine | — |
| 8 | Veille intégrée (`docs/veille/SYNTHESE.md`) : actions B1-B6 (livrable conforme : verifier étendu, schemaType par métier, page confidentialité, carte sans cookie, provider cloudflare, lighthouse) | 6 / 6 — B1-B4 faits le 17 sept 2026 (voir détail plus bas dans le journal) ; B5 (provider `cloudflare` : `src/worker/contact.js` copié en `dist/<slug>/_worker.js` par `ff build`, mode avancé Cloudflare Pages Functions, `env.EMAIL.send()`/Resend, wording `confidentialite.astro`, `docs/DEPLOIEMENT.md` § 2.5) et B6 (`ff lighthouse [slug] [--mobile] [--seuil 90]`, intégré à `ff verifier --lighthouse`) faits le 16 sept 2026 | `ff verifier` sur un site ; `npm test` (tests/schema.test.mjs, tests/legal.test.mjs, tests/form-cloudflare.test.mjs) |
| 9 | Matière première : `ff photos`, `ff video`, `ff illustration`, +30 polices (C1-C4) | 4 / 4 | commandes existantes et testées ; clés API absentes de cet environnement → échec propre vérifié (`node --check` + essais sans clé), pas testées en conditions réelles |
| 10 | Moteur : les 25 effets de `animations.md` § 3 ajoutés à `motion.ts` avec repli reduced-motion et tests (D1-D3) | 23 / 25 (effets 1-18, 20-23, 25 du tableau ; lignes 19 `data-curtain-nav` et 24 `data-view-transition` restantes — l'infrastructure `site.transitions`/`<ClientRouter />` est posée mais l'audit des scripts inline des sections/composants ne l'est pas, voir `docs/ANIMATIONS.md` § Transitions de page ; +3 effets CSS bonus hors tableau : `data-duotone`, `data-grain`, `data-border-beam` ; nouvelles dépendances lazy `lenis`/`ogl`/`@lottiefiles/dotlottie-web`/`canvas-confetti` ; tests `tests/motion.test.mjs` + vitrine `sites/_effets`) | `grep data-<effet>`, `npm test` |
| 11 | Réserve de compositions : chaque site dessiné introduit un motif de `tendances.md` § 4-5 ou `composants.md` § 3 non encore utilisé (E1) ; procédure de portage dans `/nouvelle-variante` (E2) | E2 fait le 16 sept 2026 — section « Porter depuis une source externe » ajoutée à `.claude/skills/nouvelle-variante/SKILL.md` (14 étapes résumées de `composants.md` § 5, règles de licence MIT-copiable vs GPL/Webflow/Framer/Figma-composition-seule) | relecture de `.claude/skills/nouvelle-variante/SKILL.md` |
| 12 | Offre et discours (A1-A4) : grille de prix, garantie de délai, page finck-fisch avec objections | A3 fait le 16 sept (section `Offre.astro` deux formules, section `Propositions.astro` avec vraies vignettes, 8 objections de `concurrents.md` § 4 dans `faq`, description/tagline repositionnées, layout réordonné) ; A1/A2 (montants définitifs, texte de garantie final) en attente de décision des fondateurs — prix actuels marqués `// PRIX PROVISOIRES` dans `sites/finck-fisch/sections/Offre.astro`, faciles à remplacer ; A4 (formulaire `brief-client.html`) non fait | `ff verifier finck-fisch`, `ff captures finck-fisch`, relecture des captures |
| 13 | Rendu : filière images AVIF/srcset/LQIP, polices sans saut, checks rendu dans `verifier` | fait le 16 sept 2026 — `ff images <slug>` (`--depuis-public` pour les sites sans `raw/`) émet AVIF (qualité 60) + WebP aux largeurs 480/800/1200/1600 et écrit `sites/<slug>/images.json` (widths/formats/ratio/LQIP) ; `src/components/Img.astro` (nouveau) rend `<picture>` AVIF+WebP avec width/height/LQIP, repli `<img>` simple si pas de manifeste ; sections partagées et pages migrées (`src/sections/{About,Hero,Nav,Proof,Services}/*.astro`, `src/pages/services/[slug].astro}` — pas `sites/*/sections`, propriété des designers) ; documenté dans `docs/CONVENTIONS.md` § Images ; polices : plugin Vite `fontaine` (MIT) branché dans `astro.config.mjs` (fallbacks `['Georgia','Arial']`) pour générer les `@font-face` de repli metric-adjusted des ~90 familles `@fontsource-variable/*` chargées à la demande (`src/lib/fonts.ts`) — API expérimentale Astro Fonts écartée (vérifiée par WebFetch : config statique par famille, non compatible avec le chargement dynamique par site) ; `font-display: swap` déjà garanti par Fontsource ; **préchargement fait le 17 sept 2026 (tour perf)** : `scripts/vite-ff-look.mjs` (`virtual:ff-look`) résout au build le woff2 latin de la police display réellement utilisée (premier `@import` de la direction + surcharge `typography.display`) et exporte `preloadFonts` (URLs Vite `?url`) ; `Base.astro` pose un `<link rel="preload" as="font" type="font/woff2" crossorigin>` par police, plus un `<link rel="preload" as="image" fetchpriority="high">` pour `site.images.hero` sur la page d'accueil (`imagesrcset`/`imagesizes` AVIF quand `images.json` a l'entrée, repli simple `href` sinon) — logique de manifeste extraite dans `src/lib/images.ts`, partagée avec `Img.astro` ; `fetchpriority="high"` sur l'`<img>` sécurisé pour ne dépendre que de la prop `priority` (les 4 variantes `Hero/{fullbleed,split,stacked,video}.astro` passent maintenant `priority` au lieu de `loading="eager" fetchpriority="high"` en dur) ; confirmé sur `dist/toits-cie/index.html` : 2 `<link rel="preload" as="font">` (direction `brut` + surcharge `delaGothic`) + 1 `<link rel="preload" as="image" fetchpriority="high">` ; `ff perf` (nouveau, voir critère 8) sert de garde-fou anti-régression pour ce budget ; `ff verifier` : nouveau bloc « Rendu » séparé (`scripts/ff/verifier.mjs`) — fail si grille `<ul>`/`<ol>` de ≥ 3 `<img>` aux ratios intrinsèques incohérents, warn si `<p>` > 400 caractères sans classe `measure`/`max-w-prose`, warn si < 2 familles de police dans le CSS livré, warn si `text-underline-offset` absent du CSS (3 points de la checklist déjà couverts par des checks plus anciens, rappelés en commentaire plutôt que dupliqués : `<img>` sans dimension, `<a href="#">` vide, `font-display` absent) ; build `_exemple`/`demo-plomberie`/`finck-fisch` verts, `<picture>`+avif+width/height confirmés dans `dist/demo-plomberie/services/*.html` | `npm test` (nouveau `tests/images.test.mjs`), `node scripts/ff.mjs images demo-plomberie --depuis-public`, `node scripts/ff.mjs verifier demo-plomberie`/`finck-fisch`, `grep '<picture' dist/demo-plomberie/services/*.html` |
| 14 | Rédaction : règles dans la compétence, contrôle des superlatifs, `ff nettoyer-photos` | fait le 17 sept 2026 — `docs/REDACTION.md` créé (règles opérationnelles distillées de `docs/veille/redaction-images.md` §1 : mots interdits, professions réglementées, ton par métier, test du hero, longueurs, structure problème→geste→preuve→appel, 60 phrases d'accroche, lexique de 25 métiers, micro-copie boutons/formulaires/erreurs, checklist « textes livrables » 20 points), lié depuis `CLAUDE.md` et `.claude/skills/nouveau-site/SKILL.md` §4 (rédaction) et §5 (étape « Photos » : shot list 8 photos + règle IA interdite sur `portrait`/`team`/`gallery`/`beforeAfter`) ; `ff verifier` bloc « Textes » (`scripts/ff/verifier.mjs`) — échec sur "meilleur"/"leader"/"n°1"/"numéro 1"/"garantie de résultat"/"satisfaction garantie"/"100 % satisfait", avertissement sur "unique"/"révolutionnaire"/"le plus"/tutoiement/`<h1>` > 14 mots/`<p>` > 120 mots ; `ff nettoyer-photos <slug> [--angle N] [--duotone] [--valider]` (`scripts/ff/nettoyer-photos.mjs`, sharp seul) — rotation EXIF+angle, `.trim()`, recadrage focal 4:3/3:2 (`sharp.strategy.attention`), balance des blancs gray-world (`.linear()`), duotone optionnel (couleurs de la direction ou deux hex), sortie `.ff-tmp/nettoye/` + `apercu.html`, `--valider` déplace vers `raw/originaux/` et promeut dans `raw/` ; testé sur une image synthétique 1200×900 (dégradé + dominante verte + bordure blanche) dans un site jetable `sites/_test-photos` (copie de `_exemple`, supprimé après test) — trim, recadrage 3:2, balance des blancs et duotone (couleurs de la direction `atelier`) vérifiés visuellement et par `sharp().stats()`, puis `--valider` + `ff images` enchaînés sans erreur ; checklists « textes livrables »/« images livrables » ajoutées à `docs/PROCESS.md` § définition de fait | `npm test`, `node scripts/ff.mjs verifier finck-fisch`, `node scripts/ff.mjs aide` |
| 15 | Documents contractuels du studio : devis, contrat de prestation (cession des droits d'auteur L131-3 CPI, RGPD sous-traitance, réversibilité), CGV, facture — conformes au droit applicable à la vente de sites vitrines à des artisans/TPE (B2B majoritaire, exception L221-3 Code conso pour les clients ≤ 5 salariés) | fait le 17 sept 2026 — `studio/juridique/JURIDIQUE.md` créé (devis, facture, CGV, contrat de prestation, délai de rétractation dont l'exception L221-3 Code conso pour les clients artisans ≤ 5 salariés hors champ de leur activité principale, acompte vs arrhes, pénalités de retard + indemnité forfaitaire 40 € B2B art. L441-10 Code de commerce, médiation de la consommation, assurance RC pro, TVA art. 293 B, calendrier facturation électronique 2026-2027 ; 10 points laissés à trancher par les fondateurs, notamment la tension forme juridique — micro-entreprise = entreprise individuelle, incompatible avec deux associés à parts égales, la SAS est la forme structurellement adaptée à deux co-fondateurs) ; 4 modèles complets dans `studio/juridique/modeles/` (`devis-modele.md`, `contrat-modele.md`, `cgv-modele.md`, `facture-modele.md`), placeholders `{{...}}` + variantes A/B selon la forme juridique et l'exception de rétractation, clauses relues une à une contre la liste des clauses abusives DGCCRF (aucune reprise) ; parcours documentaire ajouté à `docs/PROCESS.md` § 9 (quel document à quelle étape, règle dure : jamais de production sans devis signé + acompte reçu avant l'étape § 4) — **relecture par un professionnel du droit = action humaine, non faite, marquée en tête de chaque modèle et de `studio/juridique/JURIDIQUE.md`** ; deux points non re-vérifiés par recherche web cette session (quota épuisé en cours de route, échecs HTTP 403/404 sur economie.gouv.fr/impots.gouv.fr/bpifrance-creation.fr) et signalés ⚠ dans `studio/juridique/JURIDIQUE.md` : calendrier exact de la facturation électronique au-delà de ce qu'a confirmé `entreprendre.service-public.gouv.fr`, seuils 2026 de la franchise en base de TVA | relecture de `studio/juridique/JURIDIQUE.md` et `studio/juridique/modeles/*.md` ; relecture professionnelle externe (action humaine, à planifier) |
| 16 | Playbook commercial : cadre légal de la prospection B2B (e-mail, SMS/WhatsApp, téléphone, démarchage physique, RGPD registre prospects, LinkedIn), ciblage (métiers, signaux, volume, cadence), 12 templates de messages, script d'appel de 15 minutes avec les 8 objections, CRM minimal + KPI hebdomadaires, procédure propositions/devis/signature | fait le 17 sept 2026 — `studio/commercial/COMMERCIAL.md` créé : § 1 cadre légal (CNIL e-mail B2B confirmé par `WebFetch` direct, reste marqué ⚠ non re-vérifié cette session — budget `WebSearch` épuisé à 200/200 avant la section) ; § 2 ciblage (métiers prioritaires par registre `docs/REDACTION.md` § 4, signaux de bon prospect, volume/cadence — benchmarks chiffrés de cold outreach non trouvés/vérifiés cette session, signalé explicitement plutôt que comblé) ; § 3 douze templates (3 WhatsApp + 3 e-mail + 6 relances/étapes, ≤ 400 caractères pour WhatsApp, changements vs `scrapping_artisans/templates_whatsapp.txt` documentés un par un) ; § 4 script d'appel aligné `docs/BRIEF.md` avec les 8 objections de `docs/veille/concurrents.md` § 4 réécrites à l'oral ; § 5 CRM minimal en tableur (colonnes, statuts, KPI) en pont avec `scrapping_artisans/whatsapp_database` ; § 6 propositions/devis/acompte/signature par e-mail (art. 1366-1367 Code civil, ⚠ non re-vérifié en direct) ; § 7 sources — **action humaine non faite** : choisir la cadence hebdomadaire réelle (le § 2.4 propose ~100 contacts/semaine à ajuster) et acheter un numéro WhatsApp Business dédié à l'atelier (pas le numéro personnel d'un fondateur, § 1.2) | relecture de `studio/commercial/COMMERCIAL.md` |
| 17 | Méthode quoi animer par métier : la question « comment on sait quoi animer, si c'est un dentiste, je fais comment ? » doit avoir une réponse écrite, pas seulement dans la tête de Claude | fait le 17 sept 2026 — `docs/ANIMATION-PAR-METIER.md` créé : méthode en 5 questions (geste/objet montrable sans mentir, émotion+rythme, preuve à rendre tangible, règle du « seul feu d'artifice », interdits par famille de métier — santé/réglementé : pas de compteur/confetti/marquee ; urgence : rien qui retarde le numéro), sourcée sur `rauno.me/craft` (fetché) et `docs/veille/references.md` (30 teardowns déjà présents, dont Tend/hellotend.com — studio dentaire — et Six Physio, Clinique La Prairie, Dr Sebagh pour le registre santé/rassurer) ; principes Material Design/Apple HIG/NN Group cités mais **non revérifiés par fetch cette session** (pages JS non récupérables en contenu, quota WebSearch à 200/200 avant d'y arriver) et marqués ⚠ en tête de la § 0 du document ; table des 27 métiers de la liste ci-dessous (émotion, rythme, objet central, bloc signature + `data-*` précis, 2 effets secondaires max, interdits, référence en ligne quand trouvée) ; fiche dentiste complète (hero + 3 blocs, textes d'exemple) en démonstration de bout en bout ; intégré à `.claude/skills/nouveau-site/SKILL.md` (sous-étape « Choisir quoi animer » aux étapes 3 et 7), `docs/BRIEF.md` § 12 (2 questions client ajoutées : « filmable en 5 secondes », « ce qui rassure »), `CLAUDE.md` § Où sont les choses. Recherche de références dentiste/santé sur les galeries premium (Awwwards Health, Siteinspire, lapa.ninja) infructueuse cette session — ces galeries indexent surtout des plateformes santé B2B/SaaS, pas des cabinets de quartier ; la référence la plus pertinente (Tend) provenait déjà de `docs/veille/references.md` § 2.5 | relecture de `docs/ANIMATION-PAR-METIER.md`, `.claude/skills/nouveau-site/SKILL.md`, `docs/BRIEF.md` § 12, `CLAUDE.md` |
| 18 | Sécurité et robustesse (CSP, Turnstile, Dependabot, régression visuelle, archivage) | fait le 17 sept 2026 — **CSP** : `scripts/ff/csp.mjs` (`buildCsp`/`readSiteSecurityConfig`, testés par `tests/headers.test.mjs`) construit une Content-Security-Policy par site à partir de `site.config.ts` (lu par regex, même motif que `verifier.mjs`), écrite dans `_headers` par `astro.config.mjs` (intégration `ff-headers`) ; origines ajoutées seulement si utilisées (Plausible/Umami/Cloudflare Insights, Turnstile, web3forms, carte Google) ; `script-src`/`style-src` gardent `'unsafe-inline'` (documenté : pas de nonce possible en build 100 % statique) ; `font-src` a du ajouter `data:` après un vrai test (`ff captures` sur `maison-aurore` bloquait un `@font-face` de repli Fontaine inliné par Vite) — violation trouvée et corrigée en conditions réelles, pas seulement en théorie ; **testé pour de vrai** : `scripts/ff/headers-file.mjs` applique `_headers` dans les serveurs locaux (`ff captures`, `ff servir`) — `ff captures _exemple dubois-plomberie chez-malo maison-aurore` : zéro erreur console CSP après le correctif `font-src`. **Turnstile** : `form.turnstileSiteKey` (schéma) affiche le widget dans `ContactForm.astro` (script `challenges.cloudflare.com` chargé seulement si la clé est définie) ; `src/worker/contact.js` vérifie le jeton côté serveur via `siteverify` quand `env.TURNSTILE_SECRET` est configuré (provider `cloudflare` uniquement — documenté que web3forms ne vérifie que hCaptcha, pas Turnstile). **Dependabot** : `.github/dependabot.yml`, npm groupé mensuel (majeures astro/tailwindcss ignorées, ~90 dépendances fontsource sinon ingérable), + actions GitHub. **Régression visuelle** : `ff captures --comparer` (diff pixel par pixel via sharp, `scripts/ff/compare-images.mjs`, testé par `tests/captures-compare.test.mjs`, seuil 0,5 %, avertit sans faire échouer) / `--figer` (nouvelle référence dans `captures/base/`, local, jamais commité). **Archivage** : `ff archiver <slug>` zippe `sites/<slug>` + `dist/<slug>` dans `archives/<slug>-<date>.zip` (`Compress-Archive` PowerShell / `zip`), testé sur `_exemple`. **CI** : job `test` étendu (Chrome localisé dynamiquement sur le runner, captures + lighthouse + audit-motion réels, plus d'étape sautée), job `sante-hebdomadaire` planifié (`sites-en-ligne.json`, ouvre une issue si échec). Docs : `docs/DEPLOIEMENT.md` § 5-6 (Sécurité, Suivi automatisé), `docs/PROCESS.md` § 7bis/7ter, `CLAUDE.md` | `node --test tests/headers.test.mjs tests/captures-compare.test.mjs`, `node scripts/ff.mjs captures _exemple dubois-plomberie chez-malo maison-aurore`, `node scripts/ff.mjs archiver _exemple`, relecture de `.github/workflows/ci.yml` et `.github/dependabot.yml` |

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
13. Électricien / domotique — `ampere-fils` (Villeurbanne)
14. Vétérinaire — `veto-du-drac` (Grenoble / Saint-Martin-d'Hères)
15. Cabinet d'avocat — `lemaire-avocats` (Montpellier)
16. Menuisier-ébéniste — `atelier-lecerf` (Roubaix)
17. Institut de beauté / spa — `maison-aurore` (Nice)
18. Food truck / traiteur — `cantine-roulante` (Bayonne)

19. Auto-école — `auto-ecole-rabelais` (Tours)
20. Chambres d'hôtes — `borie-des-chenes` (Saint-Cyprien, Dordogne)

## Métiers à couvrir (un par tour, dans cet ordre, ville différente à chaque fois)

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

- 21 sept 2026 : **vraies photos sur les 20 démos** (Wikimedia Commons et Openverse sans clé, licences
  CC0/BY/BY-SA, crédits dans `sites/<slug>/CREDITS.md`) — jusqu'ici toutes les images étaient des
  dégradés synthétiques, cause première du « ça fait IA » et du « flou » vus par le fondateur.
  Onze sites par agent, neuf par script (`ff photos --source wikimedia --auto 1 --nom <slot>`),
  ~70 photos posées. **Régime des apparitions** par script : 275 → 88 `data-reveal` (titres, figures
  et groupes gardés, texte courant et listes libérés), plus aucun avertissement « > 16 apparitions ».
  30 sites construits, audit-motion vert partout, 432 tests. Reste : attribution CC BY à afficher
  côté site (pied de page) quand le schéma le permettra ; un vrai client apporte ses propres photos.

- 20 sept 2026 : deep dive « factory opérationnelle en quelques jours, site le moins IA possible »,
  cinq agents en parallèle. **Site F&F** : tells IA retirés (nom trois fois au-dessus du pli,
  11 tirets cadratins, 6 triptyques, FAQ de 10 → 5, slogans → phrases parlées), galerie rendue
  honnête (« douze sites de démonstration », plus de villes fictives ni de jargon technique),
  contact sur mesure, page 8 953 → 7 382 px ; `ff detect` sans règle dure. Étalon fetché (Hello
  Monday, Basic, Instrument) : nous sommes dans leur fourchette de mots au-dessus du pli ; l'écart
  restant est l'absence de vrais clients. **Shaders** (question du fondateur) : lib `shaders`
  (shaders.com) évaluée et écartée (WebGPU sans repli, dépend de three, 18 Mo, licence propriétaire
  payante pour usage commercial — `docs/veille/shaders.md`) ; à la place, effet maison `data-shader`
  (mesh/silk/aurora/grain-gradient, `src/scripts/shader.ts`, ogl déjà présent, 7 Ko de chunk,
  couleurs lues dans les tokens, pause hors écran, repli dégradé CSS sans WebGL ou en reduced-motion,
  contrôle dédié dans `ff audit-motion`). Appliqué sur `lemaire-avocats` ; essayé puis retiré sur
  `veto-du-drac` (deux effets riches au même endroit, règle 16). **Répétition générale** du process
  par un agent jouant l'associée non technique (`docs/veille/repetition-generale.md`) : pipeline
  solide, trois pièges corrigés dans la foulée — `ff composer` pouvait choisir une direction hors
  sujet pour le métier (fleuriste → industriel) : paliers métier avant le score, raisons affichées,
  avertissement explicite ; `ff audit-motion` prenait le menu burger fermé pour une animation
  bloquée ; `ff servir` renvoyait 200 sur /404 (faux échec `ff sante`). Verdict de l'agent avant ces
  correctifs : « pas opérationnel sans supervision » ; après, le point restant est humain : sans
  Claude Code, aucun moyen non technique d'écrire `site.config.ts` (`ff-generer` existe mais aucune
  clé API dans `.env`). **Autres** : `ff sante` lisait mal le nouveau JSON-LD `@graph` (test rouge
  corrigé) ; `&nbsp;` s'affichait en clair sur trois sites (18 occurrences, contrôle ajouté au
  vérificateur) ; CSP ouverte au CDN WASM de dotLottie seulement pour les sites qui posent
  `data-lottie` (captures `_effets` rouges) ; trois heros qui paraissaient vides au premier écran
  (studio-ambre, maison-aurore, anna-vidal) repris. Références du reel du fondateur : contentcore.xyz
  (outil payant de contenu pour réseaux, hors sujet), is.graphics (domaine expiré).

- 18 sept 2026 (matin) : second reel envoyé par le fondateur (« Claude builds websites that actually look
  good » : Impeccable + Taste Skill + captures Playwright en boucle). Les deux outils sont open source et
  réels : clonés, lus, comparés à nos docs dans `docs/veille/skills-design-ia.md` (18 règles chiffrées
  absentes chez nous, 61 règles de détection classées, ce qu'il ne faut PAS importer : stack React,
  images inventées). Décision : ne pas installer les skills (contraires à « jamais de donnée inventée »
  et à nos 16 directions), mais **brancher leur détecteur** : `ff detect <slug>` (Impeccable, 61 règles
  déterministes, sans clé) — passé sur les 20 sites, il a trouvé des vrais défauts que nos contrôles
  ne voyaient pas : texte accent à 1,8-3,7:1 sur 10 sites, liens de nav à 10,4-10,9 px, eyebrows de
  60 caractères en capitales. Corrections à la source en cours (token `--color-accent-text`, plancher
  11 px, eyebrows ≤ 40 caractères, deux contrôles ajoutés à `ff verifier`). Règles distillées dans
  `docs/CONVENTIONS.md` 13-18 (eyebrow rationné, texte accent lisible, plancher 11 px, un seul feu
  d'artifice, rayons/ombres cohérents, polices trop vues) et `docs/REDACTION.md` § 6bis (tirets
  cadratins en rafale, un libellé par intention, hero à 4 éléments). `/nouveau-site` étape 8 impose
  maintenant la boucle « capture → regarder les PNG → corriger » que montrait le reel. Moteur :
  `data-stagger` plafonne le délai total à 600 ms. Bugs outils corrigés : `ff sequence` ne savait pas
  se déplacer dans un MP4 de 35 Mo (serveur sans requêtes Range : 30 fois la même image, sans erreur —
  corrigé + garde « images identiques »), `ff perf` comptait AVIF **et** WebP d'un même `<picture>`,
  `ff verifier` voyait « 100 % » dans le CSS inliné de Tailwind, `ff audit-motion` prenait un
  `.sr-only` pour un débordement, `ff aide` oubliait `archiver`.
  Site Finck & Fisch refait (nav trois liens, hero une phrase + bande de 8 vignettes en
  `data-horizontal`, galerie des 20 sites en masonry avec filtre CSS par famille de métier, manifeste
  en liste numérotée sur fond encre, cinq étapes, trois propositions, offre en tableau, FAQ) : budget
  perf vert (Inter → Figtree : polices 253 → 153 Ko ; images 865 → 322 Ko), audit-motion vert,
  captures vertes, `ff detect` sans règle dure. Reste aux fondateurs : numéro de téléphone, prix.

- 17 sept 2026 (16h) : effet `data-frames` (séquence d'images pilotée par le scroll, façon page produit Apple, vue dans un reel envoyé par le fondateur), `ff sequence` (vidéo -> images sans ffmpeg, via Chrome ; testé sur une vraie capture .mov), `ff animer` (photo -> vidéo via fal.ai, mode simulation, règle : photo réelle du client uniquement, marquage IA). Démo réelle sur forge-delacroix (bloc « Le geste », 48 images, 0,35 Mo) et sur _effets.

- 17 sept 2026 (15h30) : chasse a la performance : Tailwind limite a src/ + site courant + variantes utilisees (CSS 119 -> 51 Ko), feuille inlinee, polices de direction remplacees non chargees, `<img>` -> `<picture>` AVIF/WebP en post-build pour tous les sites, budget `ff perf` ajuste. toits-cie mobile 84 -> 91. Isolation totale des sites par le module virtuel (config, look.json, sections). Test de syntaxe par fichier de site.

- 17 sept 2026 (après-midi) : auto-ecole-rabelais et borie-des-chenes terminés par le coordinateur (agents coupés par la limite de session) : critère 1 = 20/20. Playbook commercial livré. `ff sante`, guide client après livraison, `ff domaine`, documents juridiques.

- 17 sept 2026 : site métier 18 (Food truck / traiteur), La Cantine Roulante — Bayonne (3 chemin de
  Marracq), deux personnes, depuis 2019, cuisine basque (axoa, talos, piperade, txistorra), marchés
  (mardi Bayonne, jeudi Anglet, vendredi Biarritz, samedi Saint-Jean-de-Luz) et traiteur mariages/
  entreprises jusqu'à 200 personnes — `sites/cantine-roulante/`. Grep `direction:` sur les 17 sites
  dessinés à la main avant ce tour : `neon` et `terre` à 1 usage, `signal` déjà à 2 (`demo-plomberie`,
  `dubois-plomberie`) — mandat de conception imposé pour ce tour autorisait explicitement `signal`
  malgré ce deuxième usage (« try signal with a bold accent, or neon in a daytime twist »).
  `neon` écarté malgré son usage unique : fond `#07070b` fixe (aucun token de la direction ne permet
  un twist « jour »), aucun métier de bouche dans son `meta.ts` (« dark tech »). `signal` retenu :
  blanc + rouge-orange franc + Archivo Black massif colle directement à la palette imposée
  (`#d1262b`/`#fff4d6`) et au mandat « street, appetite, movement ». Accent surchargé en
  `hsl(358 70% 46%)` (conversion directe de `#d1262b`) à la place du rouge par défaut de la
  direction (`h8`) ; `scale: 'display'`. Nav et hero sur mesure
  (`sites/cantine-roulante/sections/`) : `Nav` — pastille « Aujourd'hui : <ville> » calculée côté
  client depuis `Date().getDay()` (aucun autre nav de l'atelier n'affiche un état qui dépend du jour
  réel de consultation) ; `Hero` — mot géant unique dérivé de `business.name` (« CANTINE »),
  faussement condensé par `transform: scaleX(0.8)` (Archivo Black n'a pas de coupe condensée
  chargée par la direction), `data-scramble` au chargement, puis bande `data-marquee-velocity` des
  quatre plats du brief. Quatre blocs sur mesure de plus : `Semaine` (« où sommes-nous cette
  semaine » — bande de sept colonnes mardi→lundi, aucun autre site de l'atelier n'a de planning
  hebdomadaire : `jardins-mael/Calendrier.astro` fait douze mois, `chez-malo/Horaires.astro` fait
  quatre temps d'une journée épinglés) ; `Carte` (liste à filets pointillés + tabular-nums, mais
  en-tête de catégorie collé en haut de section au défilement — motif absent des trois précédents
  du dépôt : `chez-malo`/`maison-roux`/`barbier-kessler` n'ont jamais d'en-tête sticky) ; `Traiteur`
  (`data-stack` de trois formats d'événement, chacun avec un `data-count-bar` proportionnel à sa
  capacité sur 200 — jamais combiné à `data-stack` ailleurs dans le dépôt, qui ne sert jusqu'ici que
  des portraits ou des plans) ; `Remorque` (`data-compare` avant/après via le moteur partagé
  `.compare-after`/`.compare-handle` plutôt que le script maison de
  `sites/moteur-fils/sections/AvantApres.astro`, badges horaires « 9 h »/« 12 h 30 » au lieu de
  « Avant »/« Après »). `data-confetti` posé sur `Nav` plutôt que sur la section contact (variante
  partagée `form-split`, non modifiable pour ce client) — l'attribut n'est qu'un drapeau de
  présence pour `motion.ts`, sans lien avec sa position dans le DOM. Six effets vérifiés par grep
  comme les moins utilisés du moteur avant ce tour (hors `sites/_effets`) : `data-confetti` (1),
  `data-marquee-velocity` (2), `data-count-bar` (3), `data-compare` (3), `data-scramble` (4),
  `data-stack` (4) — dépasse le minimum de cinq du mandat. Aucune donnée inventée : pas de section
  `proof` (aucun avis/note au brief), `about.team` vide (« deux personnes » sans nom), les capacités
  par formule traiteur (150/80 convives pour entreprise/anniversaire, seul le mariage à « jusqu'à
  200 » vient du brief) présentées comme des tailles indicatives (« jusqu'à »), jamais comme des
  chiffres du client. Trois bugs trouvés et corrigés en cours de route : (1) même piège récurrent
  qu'`atelier-lecerf`/`veto-du-drac`/`lemaire-avocats` — un `*/` isolé dans un motif
  `sites/*/site.config.ts` refermait le commentaire d'en-tête trop tôt, corrigé par reformulation
  (`` grep sur `direction:` dans chaque site.config.ts ``) ; (2) lien `tel:` hors des 1500 premiers
  caractères du corps à cause du balisage SVG verbeux de l'icône du logo, placée avant lui — corrigé
  en plaçant le lien `tel:` en tout premier dans le DOM (avant le logo), ordre visuel restauré par
  `order-*` ; (3) **bug de rendu réel, nouveau dans ce dépôt** : `src/components/Button.astro` pose
  `inline-flex` sans condition dans sa classe de base — combiner un `<Button>` avec une classe
  `hidden sm:inline-flex` côté appelant ne masque rien sous `sm` (les deux utilitaires sont au même
  niveau de spécificité, sans media query pour les départager, et `inline-flex` l'emportait à la
  capture), le bouton de devis restait visible et débordait à 390px (texte tronqué en bord d'écran,
  vu sur `captures/cantine-roulante-mobile.png` avant correction) — corrigé en n'appliquant plus
  jamais `hidden` directement sur un `<Button>` : le bouton d'appel reste toujours rendu (icône
  seule sous `md`, via un `<span>` interne masqué, pas le bouton) et le bouton de devis est enveloppé
  dans un `<div class="hidden sm:block">` ; lien de devis ajouté au menu mobile en repli. **À noter
  pour les prochains tours** : ne jamais poser `hidden`/`sm:flex` etc. directement sur un `<Button>`
  (`src/components/Button.astro` n'est pas modifiable pour un client, sa base impose déjà
  `inline-flex`) — envelopper dans un conteneur à la place. `ff build`/`ff verifier
  cantine-roulante` verts (mêmes deux échecs préexistants que `dubois-plomberie`, site déjà accepté
  du dépôt, reproduits à l'identique : faux positif « 100 % » venant du CSS de coquille partagé,
  `exemple.fr` imposé par la convention e-mail de démo ; avertissements identiques ou moindres :
  SIRET absent, paragraphe long de `confidentialite.html` sans `measure`, « le plus » résiduel dans
  `404.html` seulement — pages partagées, hors scope). `ff captures cantine-roulante` sans erreur
  console ni débordement après les trois corrections ; desktop et mobile relus à l'œil (recadrages
  ciblés sur Semaine/Carte/Traiteur/Remorque) après chaque correction. Critère 1 : 17 → 18 / 20.

- 17 sept 2026 : site métier 17 (Institut de beauté / spa), Maison Aurore — Nice, Carré d'Or (12 rue
  Alphonse-Karr), quatre praticiennes, depuis 2016, soins visage/massages (californien, pierres
  chaudes, femme enceinte)/hammam/épilation/onglerie, rituel signature « Aurore » 90 min —
  `sites/maison-aurore/`. Mandat de conception imposé pour ce tour (pas `ff composer` en premier
  réflexe) : « slow, sensorial, quiet — a hero of near-silence ». `ff composer maison-aurore
  --metier "Institut de beauté"` propose la direction `industriel` (béton/acier/orange sécurité,
  Bebas) — écartée d'emblée : l'exact opposé d'un institut de soin, et déjà signalée à plusieurs
  reprises dans ce journal comme ayant un problème de contraste d'accent connu. Direction retenue à
  la place : `luxe` (sombre, or fin, Cormorant, mouvement lent) — encore inutilisée par un site
  dessiné à la main (vérifié par `grep -h "direction:" sites/*/site.config.ts` sur les 16 sites
  précédents : `clair`×2, `nuit`×3, `atelier`, `mediterranee`, `signal`, `encre`, `journal`, `pop`,
  `retro`, `nordique`, `pierre`, `brut` — ni `luxe`, ni `terre`, ni `industriel`, ni `neon`). Le
  mandat envisageait une « luxe claire » — écartée : la tâche interdit de toucher `src/`, et
  `src/directions/luxe/index.css` fige `--bg`/`--fg` en sombre (seul `--accent-h/s/l` est
  surchargeable depuis un site.config.ts) ; la pénombre de `luxe` sert au contraire très
  directement le mandat de quasi-silence, documenté en tête de `sites/maison-aurore/site.config.ts`.
  Accent surchargé en corail-or chaud (`hsl(24 42% 58%)`, proche du placeholder `#d9c3b0`) plutôt
  que l'or plus jaune par défaut de `luxe`, pour un ton plus méditerranéen. Nav et hero sur mesure,
  cinq sections sur mesure (`sites/maison-aurore/sections/`) : `Nav` — une ligne fine (nom en
  petites capitales, un bouton texte « Réserver un soin »), sans burger ni panneau plein écran
  (contrairement à `lemaire-avocats`) : les ancres n'apparaissent qu'au clic sur un petit mot
  « Sommaire » (liste déroulée), fil de lecture `data-scroll-progress` en hairline ; `Hero` — pas de
  grand titre display : une petite ligne serif (`business.tagline`), une bande `data-marquee="8s"`
  des soins en italique (police italique réelle de Cormorant importée directement dans le fichier,
  `@fontsource-variable/cormorant/wght-italic.css` — la direction `luxe` n'importe que le poids
  normal), une image plein cadre en duotone (`data-duotone`) qui se déflote et glisse au scroll
  (`data-reveal="blur"` + `data-parallax`), puis un court paragraphe éditorial (`site.about.story`) ;
  `Rituels` — cœur du mandat : trois panneaux plein cadre empilés (`data-sticky-stack`), grand
  numéro romain, durée/prix en `tabular-nums`, une phrase de promesse, purement typographiques
  (aucune photo, à la différence de `sites/jardins-mael/sections/Saisons.astro`, même effet) ;
  `CarteDesSoins` — liste typographique à filets pointillés groupée par famille (`data-hover-img`
  au survol de chaque ligne), composition à une colonne centrée en italique, différente des deux
  cartes déjà dessinées (`chez-malo` : trois colonnes toujours prixées ; `maison-roux` : deux
  colonnes avec `data-scramble`) — certaines familles (hammam, épilation, onglerie) n'ont aucun prix
  donné par le brief, la ligne reste donc sans filet plutôt que d'inventer un tarif ; `Espace` —
  bande de cinq photos au défilement horizontal (`data-horizontal`), cartes de ratio uniforme (4:5,
  sans rotation), composition plus posée que `sites/anna-vidal/sections/Series.astro` (tailles/
  rotations variées) ; `Offrir` — bons cadeaux en une seule carte `data-flip-card` (recto : les
  soins qu'on peut offrir, les trois prix réels déjà affichés ailleurs sur le site en suggestion de
  montant ; verso : « commander par téléphone ») ; `Contact` — bandeau `wording.ctaTitle` puis carte
  de réservation `data-border-beam` (formulaire à gauche, coordonnées + carte OSM à droite — ordre
  inverse de `sites/studio-ambre/sections/Contact.astro`, sans `data-spotlight` : plus sobre).
  Neuf effets `data-*` mobilisés, cinq comptaient parmi les moins utilisés avant ce tour (grep sur
  les 16 sites précédents, hors `sites/_effets`) : `data-horizontal` (3), `data-hover-img` (3),
  `data-flip-card` (4), `data-border-beam` (4), `data-sticky-stack` (5) — dépasse le minimum de
  cinq demandé par le mandat ; `data-marquee`, `data-parallax`, `data-duotone`, `data-scroll-progress`
  également utilisés (déjà connus, imposés par le mandat). Aucun avis inventé (`proof` absent du
  brief et du layout) ; les trois seuls prix du brief (soin visage 75 €, massage 60 min 85 €, rituel
  90 min 140 €) marqués « indicatif » à chaque affichage (`Rituels`, `CarteDesSoins`, `Offrir`) —
  jamais un tarif pour les prestations sans prix donné (hammam, épilation, onglerie, massages
  individuels californien/pierres chaudes/femme enceinte). Coordonnées `contact.coordinates` posées
  au centre-ville de Nice (même convention que les 8 autres sites du dépôt qui renseignent ce champ :
  coordonnées de ville, pas un géocodage d'adresse précis). Un vrai bug trouvé et corrigé en cours
  de route, plus sérieux que les habituels réordonnancements `tel:` — **inédit dans le dépôt** :
  `global.css` pose `[data-duotone] { position: relative; ... }` en CSS « nue », hors `@layer` ; dans
  Tailwind v4 (cascade layers natives), une règle hors couche gagne toujours sur une règle de la
  couche `utilities` (`.absolute`), quel que soit l'ordre des règles. Poser `data-duotone`
  directement sur l'élément `class="absolute inset-0"` — le markup calqué sur
  `sites/jardins-mael/sections/Saisons.astro` — le repasse donc en `position: relative`, un élément
  de flux normal : l'image plein cadre (ratio natif ~4:3) se met à pousser la hauteur du hero bien
  au-delà de `100svh`, faisant sortir le petit titre serif de l'écran (confirmé par un script
  Playwright direct : hauteur réelle 1138 px au lieu de 900, `<h1>` à `y=1173`, jamais dans le
  viewport initial — donc jamais révélé par l'`IntersectionObserver` de `reveal()` avant un scroll
  qui ne se produit jamais dans ce cas, hero toujours au sommet). Corrigé en ajoutant un conteneur
  `absolute inset-0` **sans** `data-duotone` autour d'un second niveau `data-duotone` en
  `h-full w-full` : celui-ci reste `position: relative` (voulu par la règle globale) mais n'affecte
  plus la mise en page, son parent absolu le sortant déjà du flux — probablement le même piège
  latent dans `sites/jardins-mael/sections/Saisons.astro` (même markup), non corrigé ici (fichier
  d'un autre tour, hors périmètre). Deux bugs mineurs supplémentaires corrigés : (1) lien `tel:`
  hors des 1500 premiers caractères du corps à cause du menu « Sommaire » (cinq ancres) placé avant
  les actions en DOM — réordonné (même famille de correctif que six sites précédents, mais ici entre
  actions et menu, pas entre nom et actions) ; (2) `<Img>` avec `alt=""` : Astro sérialise une chaîne
  vide en attribut « nu » (`alt` sans `=`), ce que le regex `\balt\s*=` de `ff verifier` ne reconnaît
  pas comme un attribut présent — corrigé en donnant un vrai texte alternatif à la photo d'ambiance
  du bon cadeau plutôt qu'un alt vide, plus cohérent avec la règle « alt obligatoire » de toute façon.
  `ff build`/`ff verifier maison-aurore` verts (seuls échecs attendus : faux positif préexistant
  « 100 % » sur le CSS de coquille `[data-shell=slides]`, `exemple.fr` imposé par le mandat ;
  avertissements attendus : SIRET absent, paragraphe long de `confidentialite.html` sans `measure`,
  « le plus » résiduel dans `404.html` — pages partagées, hors scope). `ff captures maison-aurore`
  sans erreur console ni débordement ; desktop et mobile relus à l'œil après les trois corrections
  (titre du hero et bande défilante bien dans l'écran, nav mobile sur une seule ligne après réglage
  du tracking/`whitespace-nowrap`, filet tournant visible sur la carte de réservation). Critère 1 :
  16 → 17 / 20.

- 17 sept 2026 : site métier 16 (Menuisier-ébéniste), Atelier Lecerf — Roubaix (14 rue de l'Alma,
  ancienne filature), deux personnes à l'établi, depuis 1998, bois massif (chêne, frêne, noyer),
  cuisines/bibliothèques/escaliers/restauration de meubles anciens — `sites/atelier-lecerf/`.
  Mandat de conception imposé pour ce tour (pas `ff composer` en premier réflexe) : « material and
  process », direction interdite `atelier`/`encre` (`sites/_exemple` est déjà une menuiserie en
  `atelier`, à ne pas confondre). Grep `direction:` sur les 16 sites dessinés à la main confirme
  `terre`/`luxe`/`neon`/`industriel` encore inutilisés : `luxe` (bijoutier/horloger, « éviter
  low-cost ») et `neon` (« éviter artisanat traditionnel ») écartés d'emblée par leur propre
  `meta.ts` ; `industriel` (béton/acier, « éviter délicat ») est l'exact opposé d'un travail de
  précision au bois. Direction retenue : `terre` (organique, Lora/Nunito, formes rondes) — seule
  cohérente, ambiance « nature » qui colle au bois massif. Accent surchargé en brun noyer/chêne
  (hsl(28 42% 34%), proche de `#7a4c26`) à la place du vert par défaut, pour un accent qui se lit
  comme du bois plutôt que comme un jardin ; `scale: 'display'` pour le titre géant demandé.
  Typographie par défaut de `terre` (Lora Variable) gardée : déjà la serif chaleureuse voulue.
  Nav et hero sur mesure (`sites/atelier-lecerf/sections/`) : `Nav` — plaque d'atelier, filet bas
  = barre de progression (`data-scroll-progress`), badge statique « Atelier depuis 1998 » (aucune
  fausse urgence, ce n'est pas un métier d'urgence) ; `Hero` — titre serif géant puis les trois
  essences (chêne/frêne/noyer) en piste horizontale plein cadre (`data-horizontal` + `.h-track`),
  chaque planche teintée par sa propre couleur d'accent posée en style inline et héritée par le
  filtre `data-duotone` de sa photo — jamais fait en hero dans ce dépôt (`data-horizontal` n'était
  utilisé qu'en galerie médiane par `anna-vidal`/`encre-noire`). Quatre blocs sur mesure de plus :
  `Fabrication` (« du croquis à la pose », `data-stack` des quatre étapes réelles de `site.process`,
  esquisse de chaise en SVG inline tracée par `data-draw-svg` sur la seule première carte — à la
  différence de `sites/studio-ambre/sections/CaseStudy.astro`, même `data-stack`, qui trace un plan
  sur chacune de ses trois cartes) ; `Matieres` (`data-drag-grid` des trois essences, textures 100 %
  CSS à nœuds — aucune photo, comme demandé — `data-tilt`/`data-tilt-glare` sur chaque planche,
  absent de `sites/studio-ambre/sections/Materiaux.astro`, seul précédent CSS+drag-grid du dépôt) ;
  `Restauration` (`data-compare` avant/après d'un meuble ancien, volontairement sans liste de prix
  ni spotlight accolés — `sites/dubois-plomberie/sections/Tarifs.astro` combine déjà les trois dans
  un seul bloc) ; `Estimation` (grille de prix indicatifs en tabular-nums, lignes bordées plutôt que
  les pointillés de `dubois-plomberie`, montants suffixés « (indicatif) » — seule exception à la
  règle des données inventées, explicitement autorisée par le mandat pour cette démo) ; `Contact`
  (halo `data-spotlight`, mandat explicite, zones d'intervention affichées en puces). Cinq effets à
  ≤ 8 usages dans un site dessiné à la main avant ce tour (grep sur `sites/<slug>/sections/*.astro`,
  hors `sites/_effets`) : `data-compare` (7), `data-stack` (8), `data-tilt-glare` (6),
  `data-scramble` (7), `data-reveal-native` (6) — atteint le minimum de cinq demandé par le mandat.
  Aucun avis inventé (`proof` absent du brief et du layout) ; aucun prénom inventé (le brief donne
  « deux personnes » sans nom — `about.team` reste vide plutôt que d'inventer des prénoms, à la
  différence de la plupart des tours précédents où le brief fournissait déjà des noms). Deux vrais
  bugs trouvés et corrigés en cours de route : (1) un `*/` isolé dans le commentaire d'en-tête de
  mon propre `site.config.ts` (motif `sites/*/sections/*.astro`) refermait le bloc JSDoc trop tôt
  (`sections is not defined` au build, même piège que `sites/veto-du-drac`/`sites/lemaire-avocats`
  lors de tours précédents) — corrigé par reformulation (`sites/<slug>/sections/*.astro`) ; (2) le
  lien `tel:` hors des 1500 premiers caractères du corps (badge « Atelier depuis 1998 » et son icône
  SVG placés avant le bouton d'appel dans le DOM) — corrigé par réordonnancement `order-*`, même
  correctif que sur de nombreux tours précédents. Un défaut de composition (pas un bug de build)
  repéré en lisant `captures/atelier-lecerf-desktop.png` : les trois planches du hero en pleine
  largeur de viewport (`md:w-screen`) créaient un vide massif dans la capture pleine page (la
  distance de scroll réservée par le pin GSAP grandit avec la largeur totale de la piste) — réduit
  à `md:w-[60vw]` par planche, vide toujours présent mais ramené à un ordre de grandeur comparable
  à celui déjà visible sur `captures/anna-vidal-desktop.png` (même mécanique `data-horizontal`,
  déjà acceptée dans ce dépôt). `ff build`/`ff verifier atelier-lecerf` verts (seuls échecs
  attendus : faux positif préexistant « 100 % » sur le CSS de coquille, `exemple.fr` imposé par le
  mandat ; avertissements attendus : SIRET absent, paragraphe long de `confidentialite.html` sans
  `measure`, « le plus » résiduel dans `404.html` — pages partagées, hors scope). `ff captures
  atelier-lecerf` sans erreur console ni débordement ; desktop et mobile relus à l'œil après les
  deux corrections. Critère 1 : 15 → 16 / 20.

- 17 sept 2026 : site métier 15 (Cabinet d'avocat), Cabinet Lemaire Avocats — Montpellier (5 rue
  Foch), Maître Claire Lemaire et Maître Inès Dahmani, depuis 2014, droit du travail/famille/
  immobilier/affaires (TPE) — `sites/lemaire-avocats/`. `ff composer lemaire-avocats --metier
  "Avocat"` propose la direction `industriel` (béton/acier, Bebas) — écartée d'emblée : figurait
  explicitement dans la liste des directions à éviter fournie par la tâche (problème de contraste
  d'accent connu). Direction retenue à la place : `nuit` (bleu nuit calme, blanc chaud, Newsreader
  serif, accent ambre discret) — inutilisée par un site dessiné à la main, colle exactement au
  mandat (« serious, calm, legible, never salesy ») ; accent ambre par défaut de la direction déjà
  très proche du placeholder demandé (`#c9b27c`), aucune surcharge nécessaire. Nav (burger minimal :
  seuls un nom et deux boutons ronds — appel + menu — en barre, tout le reste dans un panneau plein
  écran à l'ouverture) et hero (aucune photo — option explicitement permise par le mandat ; une
  seule longue phrase serif en `data-text-fill` énonçant les quatre domaines et le public visé, sur
  le ciel étoilé déjà fourni par la direction `nuit`) sur mesure, plus cinq blocs custom
  (`sites/lemaire-avocats/sections/` : `Domaines` — index typographique à deux colonnes, grands
  numéros, chaque ligne en `<details>` group `data-accordion="single"` révélant trois situations
  typiques par domaine (`services[].bullets`, aucune donnée inventée) ; `Consultation` — les quatre
  étapes réelles du brief en colonne verticale numérotée reliée par un trait qui se trace
  (`data-draw`, réorienté en vertical par un `<style>` scopé au fichier — `global.css` ne code que
  la variante horizontale d'un `<hr>`, non modifié), durée du rendez-vous (45 min, donnée réelle)
  visualisée par `data-count-bar` ; `Honoraires` — les trois modes de rémunération expliqués sans
  aucun chiffre (seule exception, explicitement autorisée par le mandat : la première consultation,
  « à titre indicatif ») ; `Avocates` — deux portraits (placeholders abstraits `ff placeholders`,
  aucune photo au brief) en `data-reveal="mask"` + `data-tilt`/`data-tilt-glare`, année d'inscription
  au barreau affichée telle quelle ; `Contact` — `ContactForm`/`Carte` partagés réutilisés tels
  quels, halo `data-spotlight` sur le panneau de coordonnées (mandat explicite). Six effets vérifiés
  par grep comme les moins utilisés du moteur avant ce tour (`data-accordion`, `data-count-bar`,
  `data-blur-scrub`, `data-tilt-glare` : 1 usage chacun ; `data-scroll-progress`/`data-spotlight`/
  `data-text-fill` : 3 chacun, très en dessous de `data-reveal` 38/`data-stagger` 31) — dépasse le
  minimum de cinq demandé. Règles CNB respectées (`docs/veille/redaction-images.md` §1.3-1.4) :
  mention « Avocats au Barreau de Montpellier », aucune comparaison, aucune promesse de résultat,
  « spécialiste » jamais employé, convention d'honoraires citée deux fois, médiateur de la
  consommation de la profession d'avocat cité en `legal.mediator`. Section `proof` absente du
  layout : aucun avis inventé (le brief n'en fournit pas ; les témoignages sont de toute façon
  déconseillés pour une profession réglementée). Deux vrais bugs trouvés et corrigés en cours de
  route : (1) lien `tel:` hors des 1500 premiers caractères du corps (nav minimale + logo SVG
  inline verbeux avant le bouton d'appel) — corrigé par réordonnancement DOM `order-*`, même
  correctif que `dubois-plomberie`/`barbier-kessler`/`jardins-mael` ; (2) plus sérieux — les deux
  portraits d'`Avocates.astro` restaient invisibles (`clip-path` bloqué à 99,5 %) : l'IntersectionObserver
  générique de `reveal()` (`src/scripts/motion.ts`) observe l'élément `data-reveal="mask"`
  lui-même, or son propre `clip-path` initial réduit son aire peinte à ~0,5 % — le ratio
  d'intersection calculé par le navigateur reste sous le seuil (0.12) et `.is-visible` n'est jamais
  posé (confirmé par un `IntersectionObserver` de test isolé renvoyant `ratio: 0` alors que
  l'élément était centré dans le viewport). Corrigé en observant un ancêtre non masqué
  (`.avocate-card`) et en posant `.is-visible` à la main sur le masque, même stratégie que
  `sites/encre-noire/sections/Styles.astro` — qui documente déjà un contournement voisin — et
  `sites/anna-vidal/sections/Hero.astro` ; `sites/forge-delacroix/sections/Pieces.astro` combine
  aussi `data-tilt` + `data-reveal="mask"` sans aucun des deux correctifs et est probablement
  affecté par le même bug, non corrigé (hors scope, site d'un autre tour). Bug bloquant partagé
  rencontré et corrigé en cours de route, hors périmètre du site mais cassait le build de tout le
  dépôt (`import.meta.glob` charge tous les `site.config.ts` avec avidité) : un `*/` isolé dans un
  commentaire JSDoc de `sites/veto-du-drac/site.config.ts` (motif `sites/*/sections/*.astro`)
  refermait le bloc de commentaire trop tôt, laissant `sections;` comme instruction JS orpheline
  (`ReferenceError: sections is not defined` au build) — une variante du même piège signalée par le
  superviseur sur mon propre fichier ; corrigé par un reformulation d'une ligne (`sites/<slug>/
  sections/<Nom>.astro`), aucune autre modification de ce fichier d'un autre tour. `ff build`/
  `ff verifier lemaire-avocats` verts (seuls échecs attendus : faux positif « 100 % », `exemple.fr`
  imposé par le brief ; avertissements attendus : SIRET absent, paragraphe long de
  `confidentialite.html` sans `measure`, « le plus » dans `404.html` — pages partagées hors scope).
  `ff captures lemaire-avocats` sans erreur console ni débordement ; desktop et mobile relus à
  l'œil après les deux corrections, accordéon et menu plein écran vérifiés par interaction
  automatisée (Playwright) en plus des captures statiques. Critère 1 : 14 → 15 / 20.

- 17 sept 2026 : site métier 14 (Vétérinaire), Clinique vétérinaire du Drac — Grenoble/Saint-
  Martin-d'Hères, 3 vétérinaires (Sophie Barral, Karim Ouali, Léa Fontaine), depuis 2009, chiens/
  chats/NAC — `sites/veto-du-drac/`. `ff composer veto-du-drac --metier "Vétérinaire"` propose la
  direction `industriel` (béton/acier/orange sécurité, Bebas, garages/métallerie/BTP) — écartée :
  mandat « rassurant, propre, un peu de chaleur » pour des propriétaires anxieux, l'exact opposé
  du registre chantier, et `industriel` a un problème de contraste d'accent connu (liste des
  directions inutilisées fournie par la tâche). Direction retenue à la place : `clair` (blanc,
  Manrope/DM Sans, arrondis, ombres douces, « tech propre ») — explicitement suggérée par le
  mandat pour « une clinique moderne », inutilisée par tout site dessiné à la main jusqu'ici (seul
  `demo-boulangerie`, généré, s'en sert). Deux écarts notés dans l'en-tête de `site.config.ts` :
  accent surchargé en vert d'eau profond (`hsl(169 45% 32%)`, proche de `#2a6f62`, couleur des
  placeholders) à la place du bleu SaaS par défaut ; `typography.display: gelasio` (serif
  « classique, chaud ») à la place de Manrope pour le titre du hero — le mandat demande
  explicitement un « grand titre serif amical ». Nav et hero sur mesure, quatre autres sections sur
  mesure (`sites/veto-du-drac/sections/`) : `Urgence` — checklist numérotée (`site.process`) en
  carte `position: sticky` **CSS pur, pas `data-sticky-stack`/GSAP** (mandat explicite), téléphone
  de la clinique et numéro de garde en `tabular-nums` grande taille, numéro de garde marqué
  « (démonstration) » directement dans le texte affiché, pas seulement en commentaire ;
  `Equipe` — trois portraits (placeholders abstraits, aucun vrai visage) en grille 3 colonnes,
  `data-reveal="mask"`, bios courtes dérivées de `about.team[].role` ; `PreparerVisite` — six
  conseils pratiques en `data-flip-card` (chat en caisse, chien à jeun avant chirurgie, NAC, carnet
  de santé, traitements en cours, questions à noter), intro portant la seule ligne de prix
  indicatif demandée (« Consultation : 36 €, à titre indicatif ») ; `Contact` — custom, halo
  `data-spotlight` sur la carte de coordonnées + bande `data-marquee` des espèces reçues (chiens/
  chats/lapins/rongeurs). `Hero` — titre serif centré au-dessus d'une scène de formes abstraites
  100 % CSS (`data-parallax-depth` + enfants `data-depth`, `color-mix` sur les tokens accent),
  aucune photo d'animal (mandat : pas de mignons animaux de stock), un pouls dessiné au chargement
  (`data-draw-svg`, signal de soin sobre, combiné à `data-blur-scrub="6"` — se défloute en se
  traçant, flou faible comme `sites/studio-ambre/sections/CaseStudy.astro` pour rester visible
  dans son état « avant scroll ») et deux chiffres réels flottants (`data-counter` : 3
  vétérinaires, `yearsSince(2009)`). Neuf effets `data-*` au total ; cinq comptaient ≤ 2 usages
  avant ce tour (grep `sites/*/sections/*.astro`, hors `_effets`) : `data-parallax-depth` (1),
  `data-blur-scrub` (1), `data-counter` (1), `data-flip-card` (2), `data-draw-svg` (2) — dépasse
  le minimum de cinq. `data-count-bar` volontairement écarté (mandat explicite : « no invented
  stats », pas de temps d'attente inventé). Vétérinaire = profession réglementée (Ordre des vétérinaires,
  `docs/veille/redaction-images.md` § 1.3) : aucune comparaison avec un confrère, aucune promesse
  de guérison, aucun tarif promotionnel — une seule ligne de prix indicative. Aucun avis inventé
  (`proof` absent du brief et du layout). Trois bugs réels trouvés et corrigés en cours de route
  (vérifiés en instrumentant Playwright directement sur `dist/veto-du-drac`, pas des suppositions) :
  (1) lien `tel:` hors des 1500 premiers caractères du corps à cause d'un badge d'horaires placé
  avant le bouton d'appel dans le DOM — réordonné (même correctif que sur cinq sites précédents) ;
  (2) `data-reveal="mask"` sur les portraits `Equipe` ne se révélait jamais : au-delà des deux
  pièges déjà documentés ailleurs (cascade CSS `global.css` — même bug que
  `sites/encre-noire/sections/Styles.astro` ; `<Img>` insère un `<picture>` qui casse le sélecteur
  `> img`, même piège que `data-duotone` dans `sites/jardins-mael/sections/Hero.astro`), un
  troisième piège **inédit dans le repo** : l'état fermé du masque (`clip-path: inset(99.5% ...)`)
  réduit la zone peinte à ~0,5 % avant révélation, et l'`IntersectionObserver` générique de
  `reveal()` calcule son ratio sur la zone *visible après clip-path*, pas sur la boîte de mise en
  page — avec `threshold: 0.12`, un élément masqué à 99,5 % ne peut structurellement jamais
  atteindre 12 % visible : un verrou circulaire, jamais résolu par un simple correctif CSS.
  Contourné comme `encre-noire` (observateur local dédié sur la `<section>`, jamais clippée,
  plutôt que sur chaque figure) — à garder en tête pour tout futur usage de `data-reveal="mask"` en
  dehors d'un hero plein écran ou d'une piste horizontale (les deux seuls contextes déjà couverts
  par les correctifs existants) ; (3) `data-split="chars"` sur une tagline longue multi-mots
  coupait des mots en deux (« NAC » → « N »/« AC », « même » → « m »/« ême »), en desktop et en
  mobile — chaque caractère devient un `<span>` `display: inline-block` indépendant, sans point
  d'espace entre eux pour empêcher la coupure ; remplacé par `data-split` (mode mots, coupe
  uniquement aux espaces réelles). Les deux derniers bugs concernent des effets déjà utilisés
  ailleurs dans le repo (`data-reveal="mask"`, `data-split="chars"`) mais pas forcément
  déclenchés dans les mêmes conditions (portraits en grille normale plutôt que hero plein écran ;
  tagline longue à plusieurs mots plutôt qu'un seul mot géant) — signalés ici pour qu'un futur tour
  qui réutilise ces effets dans un contexte similaire les évite d'emblée. `ff build`/`ff verifier`
  verts (seuls échecs attendus : faux positif préexistant « 100 % » sur le CSS de coquille
  `[data-shell=slides]`, `exemple.fr` imposé par le mandat ; avertissements attendus : SIRET
  absent, paragraphe long de `confidentialite.html` sans `measure`, « le plus » résiduel dans
  `404.html` — page partagée, hors scope). `ff captures veto-du-drac` sans erreur console ni
  débordement ; desktop et mobile relus à l'œil après les trois corrections (portraits visibles,
  titre du hero qui ne coupe plus de mot, compteurs « 3 vétérinaires »/« 17 ans » corrects).
  Critère 1 : 13 → 14 / 20.

- 17 sept 2026 : site métier 13 (Électricien / domotique), Ampère & Fils — Villeurbanne, entreprise
  familiale père/fille, depuis 2001, Qualifelec, IRVE, domotique KNX, mises aux normes NF C 15-100,
  dépannage sous 24 h (jamais 24h/24) — `sites/ampere-fils/`. `ff composer ampere-fils --metier
  "Électricien"` propose la direction `signal` (couleur franche, Archivo Black, gros numéro
  d'urgence) — écartée par consigne explicite du mandat de conception (« précision technique,
  chaleur discrète », `brut`/`signal`/`industriel` tous à éviter). Direction retenue à la place :
  `clair` (blanc, Manrope/DM Sans, arrondis doux) — jamais utilisée par un site dessiné à la main
  jusqu'ici, cohérente avec le mandat « tech propre » ; accent surchargé en bleu profond (hsl(226
  65% 35%), proche de `#1f3a93`, couleur des placeholders) à la place du bleu franc par défaut de
  `clair`, pour un bleu de schéma électrique plutôt qu'un bleu SaaS. `scale: 'compact'` pour la
  densité technique. Écart documenté dans l'en-tête de `site.config.ts` : le « papier millimétré »
  du mandat (`repeating-linear-gradient` à 4 % via `color-mix(in oklch, var(--fg) 4%, transparent)`,
  tokens uniquement) est posé par section (Hero, TableauElectrique, BorneRecharge, Contact) plutôt
  que sur `<body>`, faute de pouvoir toucher `src/directions`/`global.css` pour ce tour (consigne
  explicite de la tâche : ne pas modifier `src/`). Nav et hero sur mesure, quatre blocs sur mesure
  (`sites/ampere-fils/sections/` : `Nav` — filet fin en pied de barre qui EST la barre de
  progression de lecture (`data-scroll-progress`), étiquette statique « Intervention sous 24 h »
  (aucune pastille clignotante — mandat explicite : pas de fausse urgence) ; `Hero` — la tagline se
  lit normalement en `<h1>`, puis un schéma de raccordement en dessous : cinq bornes (Villeurbanne,
  père & fille, ancienneté réelle via `yearsSince()`, Qualifelec, IRVE·KNX) reliées par un tracé à
  angles droits façon circuit imprimé (`data-draw-svg`, tracé au chargement) ; `TableauElectrique` —
  les six prestations (`site.services`) en tuiles « disjoncteur » (petit interrupteur dessiné en CSS
  pur, tokens uniquement) qui se retournent (`data-flip-card`) pour révéler ce qui est inclus ;
  `BorneRecharge` — les trois puissances IRVE réelles (7/11/22 kW, classes de produit, pas une
  donnée client inventée) en `data-count-bar` ; `Normes` — les trois garanties (`site.about.values` :
  NF C 15-100, Qualifelec, IRVE — seule source de vérité, lue directement, pas un texte détaché) en
  trois panneaux empilés (`data-sticky-stack`) ; `Contact` — panneau sombre `data-spotlight` +
  petit tracé `data-draw-svg` en coin, combinaison inédite (spotlight seul sur barbier-kessler/
  dubois-plomberie/studio-ambre), `<ContactForm />`/`<Carte />` partagés réutilisés tels quels. Six
  effets `data-*` mobilisés dont un rare avant ce tour (`data-count-bar`, 3 sites) et cinq peu
  fréquents (`data-draw-svg` 4, `data-flip-card` 4, `data-sticky-stack` 5, `data-spotlight` 6,
  `data-scroll-progress` 6, comptés avant ce tour, hors `sites/_effets`) — dépasse le minimum de
  cinq demandé par le mandat. `ff placeholders`/`ff images --depuis-public` exécutés (logo.svg/
  favicon.svg utilisés) mais `images: {}` au final, comme `dubois-plomberie` : le mandat est un
  vocabulaire de schémas, pas de photographie, une image abstraite de substitution aurait fait
  doublon. Aucun avis inventé (`proof` absent du brief, absent du layout). Wording exact du mandat
  respecté (`devis: 'Décrire votre projet'`, `ctaTitle`/`contactTitle`). Un vrai bug corrigé en
  cours de route dans mon propre fichier : commentaire contenant `sites/*/sections` dont le
  sous-texte `*/` fermait prématurément le bloc de commentaire JS (`Expected ";" but found ")"`) —
  reformulé pour l'éviter. Un second bug du même type, dans `sites/lemaire-avocats/site.config.ts`
  (site d'un autre agent en cours dans ce même tour), bloquait tous les builds du dépôt via le glob
  partagé de `src/lib/site.ts` — signalé par message à l'agent principal plutôt que corrigé
  directement (fichier d'un autre agent), résolu entre-temps par cet agent. Un avertissement
  « mot à surveiller "le plus" » (`docs/REDACTION.md` §1) trouvé et corrigé en reformulant une
  phrase de `BorneRecharge.astro` (« le plus courant » → « fréquent »). `ff build`/`ff verifier`/
  `ff captures ampere-fils` verts (seuls échecs attendus : faux positif préexistant « 100 % » sur le
  CSS de coquille, `exemple.fr` imposé par le mandat ; avertissements attendus : SIRET absent,
  paragraphe long de `confidentialite.html` sans `measure`, « le plus » résiduel dans `404.html`
  — page partagée, hors scope). Desktop et mobile relus à l'œil (captures recadrées section par
  section) : schéma de câblage du hero lisible aux deux formats, tuiles disjoncteur et barres de
  puissance nettes, sticky-stack et contact sans chevauchement, aucun débordement. Critère 1 :
  12 → 13 / 20.

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
