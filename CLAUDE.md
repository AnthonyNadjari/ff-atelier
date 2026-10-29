# ff-atelier — instructions pour Claude Code

Studio Finck & Fisch : sites vitrines pour artisans. Un seul projet Astro, plusieurs sites
(`sites/<slug>/site.config.ts`). Toute session Claude Code dans ce repo doit suivre ce fichier.

## Le repo en une phrase

Un site = un fichier `sites/<slug>/site.config.ts` qui exporte `defineSite({...})` (schéma zod dans
`src/lib/schema.ts`). Les sections (`src/sections/<Type>/<variante>.astro`) et les directions
(`src/directions/<nom>/`) lisent ce fichier via `site` (`src/lib/site.ts`) et n'affichent que ce qu'il
contient. Rien n'est codé en dur côté contenu, rien n'est inventé côté données.

## Chaîne client (l'essentiel, dans l'ordre)

1. `node scripts/ff.mjs nouveau <slug>` : dossier du site (gabarit `_exemple`, ses avis fictifs retirés).
2. Brief rempli dans `sites/<slug>/brief.md` ; guide photo envoyé au client (`studio/commercial/guide-photos.html`).
3. `/nouveau-site <slug>` : données du brief dans `site.config.ts`, PUIS `ff composer`, textes, bloc sur mesure, build.
4. Photos reçues : `sites/<slug>/raw/` puis `ff images <slug>`.
5. `ff propositions <slug>` (3 looks à montrer), `--appliquer <n>`, puis `ff figer <slug>`.
6. `ff verifier <slug>` vert (accessibilité, typo, signes IA, données de test), puis, solde payé : `ff deploy <slug>` (Workers), `ff domaine <slug> <domaine> --email-vers <e-mail du client>`, slug dans `sites-en-ligne.json`, ligne dans `studio/juridique/registre-traitements.md`, `ff sante <slug>` à J+1.

Le reste du tableau ci-dessous sert au besoin.

## Workflows en une commande

| Commande | Ce qu'elle fait |
|---|---|
| `node scripts/ff.mjs nouveau <slug>` | Crée `sites/<slug>/` à partir de `sites/_exemple`, prêt pour un brief. |
| Formulaire client https://ff-brief.vercel.app + `node scripts/ff.mjs brief [numéro] [slug]` | Le client remplit le formulaire (`outils/brief-form/` : page statique + fonction Vercel) ; ses réponses ouvrent un ticket GitHub étiqueté « brief » dans ce dépôt (jeton `FF_BRIEF_TOKEN` côté Vercel, à grain fin, Issues seulement ; sans jeton, la page affiche le brief à copier). `ff brief` sans argument liste les briefs en attente ; `ff brief <numéro>` crée le site si besoin et écrit `sites/<slug>/brief.md`, puis `/site-final <slug>`. |
| `node scripts/ff.mjs refonte <url> [slug] [--max-pages 25] [--sans-photos]` | **Refonte** d'un site existant du client, **sans navigateur** (fetch, User-Agent `FinckFisch-refonte/1.0`, robots.txt respecté, 1 requête / 500 ms, même domaine ; sitemap sinon liens internes) : extrait nom, téléphones, e-mails (protection Cloudflare comprise), adresse, horaires écrits, services, années, réseaux, avis affichés, mentions légales (SIRET, bloc hébergeur écarté) ; télécharge au plus 40 photos utiles dans `raw/` + `raw/SOURCES.md` (logos, icônes < 300 px, banques écartés ; < 1 200 px signalées) ; écrit `brief.md` prérempli (source de chaque info, « ? à demander » sinon, aiguillage photos, annexe « Textes du site actuel ») et `redirects.json` (anciennes URL → nouvelles pages, format `ff vercel`) ; crée le site si besoin ; n'écrase jamais un brief fait à la main. Site en JavaScript seul : le dit. Puis `/site-final <slug>`. Tests `tests/refonte.test.mjs`. |
| `/nouveau-site <slug>` (Claude Code) | Lit `sites/<slug>/brief.md`, choisit direction/variantes, rédige les textes en français, écrit `site.config.ts`, build et vérifie. Voir `.claude/skills/nouveau-site/SKILL.md`. |
| `node scripts/ff-generer.mjs <slug>` | Même résultat que `/nouveau-site`, mais sans Claude Code : appelle l'API Anthropic directement (pour l'automatisation, ex. depuis `scrapping_artisans`). Sortie structurée : le modèle remplit un JSON contraint par le schéma zod (tool use), validé par `siteSchema` avant le build, puis sérialisé en TS de façon déterministe (`toTs`). |
| `node scripts/ff.mjs build <slug>` | Build statique du site dans `dist/<slug>`. |
| `node scripts/ff.mjs verifier <slug> [--sans-a11y] [--sans-build] [--bavard]` | Contrôle qualité avant livraison (voir `docs/PROCESS.md` § définition de fait), audit d'accessibilité `ff a11y` compris (bloquant), typographie française (règles dures de `ff typo`, hors /credits) et signes « fait par une IA » (`ff ia`) compris (bloquants depuis le 13 oct 2026). Build silencieux (sortie de Vite seulement en cas d'échec, `--bavard` pour tout voir) ; `--sans-build` contrôle le `dist/` existant. |
| `node scripts/ff.mjs variete` | Liste les combinaisons direction + variantes déjà utilisées par les sites existants — à consulter avant de choisir une direction pour un nouveau client. |
| `node scripts/ff.mjs images <slug> [--depuis-public]` | Optimise/redimensionne les photos déposées dans `sites/<slug>/raw/` vers `public/images/` (`--depuis-public` : retraite celles déjà dans `public/images/`). |
| `node scripts/ff.mjs nettoyer-photos <slug> [--angle N] [--duotone] [--valider]` | Nettoie `sites/<slug>/raw/*` avant `ff images` (sharp seul) : rotation EXIF + angle fin, recadrage des bordures unies, recadrage focal 4:3/3:2 (`sharp.strategy.attention`), balance des blancs gray-world, duotone optionnel (couleurs de la direction du site ou deux hex en argument). Sortie dans `.ff-tmp/nettoye/` + feuille de contact `apercu.html` ; `--valider` déplace les originaux dans `raw/originaux/` et copie les fichiers nettoyés dans `raw/`. Voir `docs/veille/redaction-images.md` §2.6. |
| `node scripts/ff.mjs photos <slug> "<requête>"` | Cherche des photos libres (Unsplash/Pexels, clés dans `.env`), feuille de contact `.ff-tmp/photos/apercu.html` ; `--choisir 1,3` copie les choisies dans `public/images/photo-<n>.webp` et journalise `CREDITS.md`. |
| `node scripts/ff.mjs photos-demo <slug> "<requête>" ["<requête>" …] [--n 6] [--services "slug=requête;slug2=requête"]` | **Démos seulement** (`legal.demo`, slug `_…`/`demo-…`, `// DEMO` en tête ; refus clair sinon) : photos d'illustration en une commande, sans clé (Wikimedia puis Openverse ; CC0, domaine public, CC BY, CC BY-SA), choisies seules (`scripts/ff/illustrations.mjs` : premier écran paysage ≥ 1 600 px recadré 3:2, galerie ≥ 1 200 px en 4:3 répartie entre les requêtes, une par service avec `--services`, pas de logo ni de texte incrusté détectable, ni noir et blanc, ni flou) → `raw/` → `ff images` → `CREDITS.md` → `images.hero`, `images.illustration: true`, `proof.gallery`, `services[].image` dans `site.config.ts`. Chaque photo porte la mention visible « Photo d’illustration » (`src/components/Img.astro`) et /credits les liste toutes ; `ff verifier` échoue si un site non démo la porte ou si une démo affiche une photo de banque sans elle. Tests `tests/photos-demo.test.mjs`. |
| `node scripts/ff.mjs video <slug> "<requête>"` | Cherche une vidéo Pexels, génère `public/videos/hero.webm` + `hero.mp4` + `poster.jpg` via ffmpeg (ou garde le mp4 source si ffmpeg absent) et journalise `CREDITS.md`. |
| `node scripts/ff.mjs sequence <slug> <video.mp4\|.mov> [--n 60] [--largeur 1280] [--nom montre]` | Extrait N frames espacées régulièrement d'une vidéo **sans ffmpeg** (Chrome via `playwright-core`), réencode en WebP desktop + mobile dans `public/anim/<nom>/` et `<nom>-mobile/`, affiche les attributs `data-frames-*` prêts à coller (voir `docs/ANIMATIONS.md` § data-frames). Repli : commande ffmpeg affichée si Chrome ne décode pas le codec (HEVC `.mov` iPhone, typiquement). |
| `node scripts/ff.mjs sequence-photo <slug> <image> [--nom x] [--n 48] [--largeur 1920] [--qualite 82] [--zoom 1.22] [--chaleur 0.18] [--sombre 0.25]` | Séquence `data-frames` à partir d'**une photo fixe** : mouvement de caméra lent (zoom + dérive), réchauffement et vignette progressifs en option. Recadre sur l'original sans agrandir, 1920 px / qualité 82 (jamais sous 15 Ko par image : la première séquence de la forge, 5 Ko par image, était floue), variante mobile 1080. Pour un client sans vidéo ; avec une vidéo, `ff sequence`. |
| `node scripts/ff.mjs animer <slug> <image> "<prompt>" [--modele minimax\|kling] [--duree 5] [--simuler]` | Anime une **photo réelle** du client (image-to-video, fal.ai) : mp4 dans `.ff-tmp/animer/`, journalise `CREDITS.md`, suggère d'enchaîner avec `ff sequence`. Jamais sur une image générée ou une photo de banque présentée comme "du client" (`docs/veille/redaction-images.md` §2.3) ; marquage AI Act obligatoire (`data-ia="1"` + mention visible) sur la section qui l'utilise. `--simuler` affiche les appels prévus sans clé API. |
| `node scripts/ff.mjs illustration <slug> "<thème>"` | Tente une illustration unDraw recolorée (`--couleur`) ; sans API disponible, affiche la procédure manuelle. |
| `node scripts/ff.mjs deploy <slug> [--workers\|--pages] [--simuler] [--vercel]` | Build, garde « données de test » (`scripts/ff/garde-donnees.mjs` : téléphone 06 00 00 00 00 sous toutes ses formes, code postal 75000, mentions légales sans SIRET ni avis « en cours de création » ; bloquante sauf site de démo `_…`/`demo-…`/`// DEMO`), puis Cloudflare : **Workers static assets** par défaut (config `.ff-tmp/<slug>/wrangler.json` écrite par la commande, Worker du formulaire + binding `EMAIL` déclarés, `scripts/ff/hebergement.mjs`) ou Pages (`--pages`). Mode mémorisé dans `sites/<slug>/hebergement.json`, lu par `ff domaine` et `ff sante`. Voir `docs/DEPLOIEMENT.md` § 2.1. Même garde dans `ff verifier`. |
| `node scripts/ff.mjs vercel <slug> [--simuler] [--sans-build]` | Déploiement Vercel (≡ `deploy --vercel`) : build + garde, `_headers` → `dist/<slug>/vercel.json` (**`cleanUrls: true` obligatoire**, sinon `/audit` et `/mentions-legales` en 404) + `sites/<slug>/redirects.json`, `.vercelignore`, puis `npx -y vercel deploy --prod --yes`. Identifiants : `VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` (env ou `.env`) ou `sites/<slug>/vercel-projet.json`. `--simuler` n'écrit que `vercel.json`. Vercel Hobby interdit l'usage commercial : clients sur Cloudflare. Voir `docs/DEPLOIEMENT.md` § 2.7. |
| `node scripts/ff.mjs planche <slug> [--crans 3] [--n 24] [--debut 0] [--mobile-seul\|--desktop-seul]` | Planche-contact du **défilement à la molette** d'un site déjà construit : une vignette tous les N crans de 100 px, ordinateur (1400x900) puis téléphone (390x844), assemblées en grille dans `captures/planches/<slug>-d|m-<debut>.jpg`, numéro de pixel sur chaque vignette. À **regarder** (outil Read) avant de dire « rien de cassé » : une capture fixe ne voit pas un défilement cassé (forge, 13 oct 2026). Utilisée par `/site-final`. |
| `node scripts/ff.mjs apercu-rapide <slug> [--pages] [--sans-build]` | **Voir un site en moins de 3 minutes**, sans contrôle long (ni a11y, ni audit) : build silencieux sous le verrou `.ff-tmp/build.lock`, `dist/` servi avec `_headers`, UNE image `captures/rapide/<slug>.jpg` lisible sur téléphone : premier écran téléphone (390x844 @2x) en grand à gauche, accueil entier téléphone + ordinateur (1400x900) réduits et coupés en colonnes à droite ; `--pages` ajoute la première page de service et une autre page. Imprime le chemin et la durée (~25 s sur une démo). `FF_CHROMIUM=1` pris en compte. Tests `tests/apercu-rapide.test.mjs`. |
| `node scripts/ff.mjs apercu --titre "…" [--phrase "…"] [--date AAAA-MM-JJ] "Libellé=chemin" …` | **L'aperçu du meilleur** d'un tour de veille : 2 à 4 captures réelles (la source, ce que l'usine en fait) côte à côte sous un titre et une phrase, dans `docs/veille/apercus/<date>.jpg` (versionnée), envoyée au fondateur en fin de tour (`/veille` § 4 bis). Tests `tests/apercu.test.mjs`. |
| `node scripts/ff.mjs demonter <url> [--slug <site>] [--nom <x>] [--dossier <d>]` | **Démonte** automatiquement un site de référence (celui que le client « aime » dans son brief) : Chrome local 1440x900 puis 390x844 (une page à la fois), captures `<nom>-d|m.webp` + planche de 8 vues du défilement, fiche `<nom>.md` au format des fiches de `docs/veille/demontages/` (Squelette, Typographie, Couleur et matière, Mouvement, geste signature, garde/refuse) remplie depuis le DOM calculé (polices `@font-face` et tailles, couleurs par surface avec contraste, transitions/animations dédoublonnées, bibliothèques, sticky/`animation-timeline`, sections avec titre/hauteur/mots/images, nav, pied, téléphone, formulaire, horaires, portes d'action, barre fixe en bas, ce qui bouge tout seul, signes IA : polices IA, pilules, vidéo plein écran, couche bloquante, « X ans ») + `<nom>.json` (mesures brutes). Rien n'est deviné : une mesure absente = « non mesuré », le geste signature reste « à remplir » avec trois candidats factuels. Défaut `docs/veille/demontages/` ; `--slug` → `sites/<slug>/references/` (exclu de `ff exporter`). Bloque les non-http(s), timeout 45 s, bannière cookies mesurée jamais cliquée, site qui refuse les navigateurs sans tête → sortie 1. Tests `tests/demonter.test.mjs`. |
| `node scripts/ff.mjs melanger <slug> [--typo id] [--couleurs id] [--densite id] [--formes id] [--photos id] [--mouvement id] [--matiere id] [--architecture id] [--premier-ecran famille] [--style id] [--hasard] [--n 3] [--essai]` | **CROISE** les atomes de style de vrais sites (`docs/veille/styles/atomes/<id>.json`, format et règles : `docs/veille/styles/ATOMES.md`) : typo d'un site, couleurs d'un autre, photos d'un troisième… Chaque atome non imposé est tiré sous contraintes pures (contraste AA calculé, rôles de polices, pas de plein cadre sans photo de 1 600 px, mouvement calme si l'aiguillage le dit, famille de premier écran et architecture libres ; architectures tirées seulement si l'usine sait les construire, lues dans `src/lib/architectures.ts` avec leur coquille, et si le client en a les données) et jamais deux fois la même combinaison (`docs/empreintes/melanges.json` : plus de 3 atomes partagés = refus). **Garde de beauté** (OKLCH, `ATOMES.md` § Garde de beauté) : refuse aussi le lisible mais laid (fond vif, capitales condensées sur fond coloré, aplats vifs concurrents, vibration, plus de 3 teintes, accord de polices en conflit, photos sombres nues sur blanc froid). Le mouvement tire un **profil** (`docs/veille/styles/MOUVEMENTS.md`, 17 profils de vrais sites, le catalogue grandit à chaque veille) ; fond vidéo seulement avec une vraie vidéo ou `--video animer\|banque` prévu. Écrit `src/directions/m-<hash>/` (enregistrée dans `DIRECTIONS`), `sites/<slug>/look.json` et la ligne « Style : mélange <…> » du contrat. `--n 3` : trois mélanges pour trois pistes (2 atomes partagés au plus, **régimes de palette différents** : clair neutre, clair teinté, sombre, coloré doux, fonds et accents éloignés, `ATOMES.md` § Régimes de palette ; un régime qui manque au registre est noté comme besoin en tête de `docs/veille/journal.md`) ; `--style <id>` avec un modèle `presets/<id>.json` (style construit) : le modèle pose le site entier (direction, premier écran, ordre des sections, mouvement ; architecture du site gardée), sans tirage. `--essai` : appliqués à 3 copies jetables (direction, architecture et famille de premier écran quand l'usine sait la rendre), contrôlées, planche `captures/planches/<slug>-melanges.jpg`, copies supprimées. `ff atomes` valide le registre et compte les palettes par régime ; `ff atomes mesurer <url> --id x` relève un site (typo, couleurs, marges, rayons, boutons, photos, transitions) et écrit un brouillon d'atomes. Tests `tests/atomes.test.mjs`, `tests/melanger.test.mjs`. |
| `node scripts/ff.mjs aiguillage <slug>` | Lit les réponses « photos » et « ambiance » du brief (formulaire ou brief papier), les croise avec les photos du client réellement présentes (hors banque d'images de `CREDITS.md`) et imprime la décision de `.claude/skills/site-final/aiguillage.md` + les deux lignes « Aiguillage » du contrat. Le même contrôle tourne dans `ff verifier` dès que le brief y répond : client « calme » = `motion: 'subtle'`, rien qui suit le défilement. Tests `tests/aiguillage.test.mjs`. |
| `node scripts/ff.mjs contrat <slug> [<slug-b> …]` | Contrôle de forme du contrat de direction (`sites/<slug>/direction.md`) avant de construire : sections du modèle, 8 à 12 faits propres retrouvés dans le brief (nombre ou deux mots de cinq lettres), quatre lignes MOUVEMENT sans attribut du moteur et avec les deux régimes nommés, deux fiches de démontage citées, polices hors liste IA, accord avec `ff aiguillage`. Échoue si un point manque ; l'attaque de fond (`/site-final` § 2) reste à l'œil. Tests `tests/contrat.test.mjs`. |
| `node scripts/ff.mjs choisir <slug> <lettre> [--supprimer]` | Après `/site-final` à plusieurs pistes, la piste choisie (`a` = `<slug>`, `b` = `<slug>-b`…) devient le site `sites/<slug>` ; les autres sont rangées dans `sites/_pistes/<slug>-<lettre>/` (préfixe `_` : plus construites, plus déployées, hors variété) ou supprimées. `dist/` et `captures/` suivent. Tests `tests/choisir.test.mjs`. |
| `node scripts/ff.mjs prevol <slug> [<slug-b> …] [--sans-navigateur] [--sans-build]` | **Tous les contrôles mécaniques de `/site-final` en une commande** : par piste, contrat → aiguillage → build (verrou `.ff-tmp/build.lock`) → verifier → audit-motion → nettete → ressemblance → detect → perf ; puis signatures, puis `ff pistes` (film comparé) s'il y a plusieurs pistes. Un seul Chrome à la fois, table ✓/✗ avec durées et premier échec de chaque étape, `.ff-tmp/prevol-<slug>.json`, sort en erreur si une étape est rouge. `--sans-navigateur` retire a11y, audit-motion, nettete, ressemblance et le film. Tests `tests/prevol.test.mjs`. |
| `node scripts/ff.mjs film <slug> [--geste <sel>] [--toucher <sel>] [--glisser <sel>] [--mobile-seul\|--desktop-seul]` | Filme le **mouvement** d'un site construit sans script par site : entrée du premier écran à 0/150/400/800/1 500/2 400 ms, téléphone (390x844) puis ordinateur (1400x900), première section sous le hero à +250/+900 ms, et le geste signature si on lui donne un sélecteur (`--geste` l'amène à l'écran, `--toucher` le touche, `--glisser` le fait glisser à 25/50/75/100 %). `captures/planches/<slug>-film.jpg` et `-film-d.jpg`, à **regarder**. Utilisé par `/site-final` § 5 et les relecteurs DA. Tests `tests/film.test.mjs`. |
| `node scripts/ff.mjs pistes <slug> [<slug-b> …] [--sans-film] [--seuil 0.65]` | Compare les pistes d'un client (`<slug>`, `<slug>-b`, `-c`… ou la liste donnée) sur les sept axes de `/site-final` § 1bis : squelette, direction/couleur, typographie, rythme, mécanisme du geste (déclencheurs lus dans les sections sur mesure), entrée du premier écran (ligne 1 du contrat, h1 `data-split`, et mise en page du premier écran mesurée par `ff ressemblance`) et apparition au défilement (ligne 2 + attributs du moteur). Filme les premiers écrans téléphone côte à côte à 0/150/400/800/1 500 ms puis la première section (`captures/planches/<slug>-pistes.jpg`), écrit `captures/<slug>-pistes.json`, échoue si deux pistes partagent l'entrée, l'apparition ou plus d'un axe. Tests `tests/pistes.test.mjs`. |
| `node scripts/ff.mjs ressemblance [<slug> …] [--seuil 0.65] [--seuil-deroule 0.65] [--tous] [--registre]` | **Diversité par la mise en page ET par le déroulé, contre TOUS les sites** (pas seulement les pistes). (1) Premier écran (Chrome, téléphone 390x844 puis ordinateur 1400x900, après 1 500 ms) = grille 8x12 des rôles h1 / image / carte / téléphone / actions / barre basse / nav / texte + mesures (h1 sur l'image, position du h1, part d'image, carte, barre basse, numéro sous le h1). (2) Déroulé de l'accueil (téléphone, page défilée jusqu'en bas, `scripts/ff/deroule.mjs`) = suite des blocs de premier niveau classés par rôle (héros, avis, services, réalisations, à propos, questions, contact, lieu/horaires, outil, texte long, bandeau d'appel, pied, autre ; heuristiques documentées en tête du fichier : id/classes, titres, tel:, details, images en grille, form, iframe/carte, blockquote/étoiles…) avec hauteur et part d'image, + empreinte de site (pages HTML de dist/ et pages de contenu, liens du menu et du pied vers des pages ou des ancres, longueur en écrans, modèle de navigation : longue page à ancres / plusieurs pages / accueil-menu / défilement horizontal / onglets). Ressemblance de déroulé = 0,5 x distance d'édition normalisée des suites + 0,5 x accord du site. **Refus si premier écran > 0,65 (téléphone OU ordinateur) OU déroulé > 0,65**, avec ce qui est pareil en mots (« carte posée sur l'image, barre basse à 3 boutons » ; « même ordre : héros, avis, services, à propos, contact ; même navigation : menu vers des pages ; même longueur »). Registre versionné `docs/empreintes/<slug>.json` (premier écran + déroulé + site ; `--registre` reclasse les blocs avec les règles du jour, sans Chrome). Planche `captures/planches/<slug>-ressemblance.jpg` : ce site + les 3 plus proches au téléphone + colonne « déroulé » alignée avec le plus proche par le déroulé. `--tous` recalcule tous les sites construits et liste les paires trop proches (la veille). Seuils calibrés sur les quatre sites jugés pareils par le fondateur les 17 et 18 oct 2026 (scores en tête de `scripts/ff/ressemblance.mjs`). Dans `ff prevol` et l'axe « entrée » de `ff pistes`. Tests `tests/ressemblance.test.mjs`. |
| `node scripts/ff.mjs relecture <slug>` | Assemble les deux prompts des relecteurs de `/site-final` (DA et rédacteur : prompt de `.claude/skills/site-final/relecteurs/`, barème de confiance, grille à plafonds, sortie de `ff variete`) dans `captures/relecture/<slug>-da.txt` et `-redacteur.txt`, à donner tels quels à deux agents neufs. |
| `node scripts/ff.mjs tuiles <slug> [--dest dossier] [--nom x] [--n 4] [--ecrans 3]` | Capture l'accueil d'un site **déjà construit** sur 3 écrans de haut (mobile 390x844 @3 → 900 px, desktop 1440x900 @2 → 1600 px) et le découpe en tuiles webp `<nom>-t-m0..3` (+ `-600` pour les petits téléphones)/`-t-d0..3` (défaut `.ff-tmp/tuiles/<slug>/`), pour une démo défilante nette sur iOS. |
| `node scripts/ff.mjs domaine <slug> <domaine> [--zone-id X] [--email-vers adresse] [--www] [--simuler]` | Branche un site déjà déployé sur un domaine personnalisé en une commande : projet Pages, DNS (CNAME proxifié, idempotent), et avec `--email-vers`, Email Routing (`contact@domaine` → l'adresse donnée). Écrit `sites/<slug>/domain.txt` et affiche une checklist finale. `--simuler` affiche les appels API sans les exécuter. Voir `docs/DEPLOIEMENT.md` § 2.2bis. |
| `node scripts/ff.mjs exporter <slug>` | Prépare la livraison finale au client (repo + domaine au nom du client). |
| `node scripts/ff.mjs composer <slug> [--ecrire]` | Propose automatiquement un look (direction, variantes, typographie...) à partir des données de `site.config.ts` (écarte les variantes sans leurs données : hero photo sans photo, carte sans coordonnées ; jamais de police « signe IA ») ; `--ecrire` l'écrit dans `look.json`, sans toucher au contenu. |
| `node scripts/ff.mjs propositions <slug>` | Construit N looks différents avec captures d'écran, un par `propositions/<slug>/index.html`, pour comparer avant de choisir. |
| `node scripts/ff.mjs studio <slug>` | Éditeur visuel du look sur `http://127.0.0.1:4400` (direction, polices, échelle, tone, séparateur, libellés), écrit dans `look.json`. Onglet « Modèles » en haut du panneau pour appliquer un preset en un clic. |
| `node scripts/ff.mjs figer <slug>` | Fusionne `look.json` dans `site.config.ts` (le look choisi devient définitif) et supprime `look.json`. |
| `node scripts/ff.mjs modeles` | Liste les modèles (`presets/*.json`) : titre, direction/hero, métiers, vignette générée ou non. |
| `node scripts/ff.mjs modele <slug> <nom>` | Applique un modèle : copie son look dans `sites/<slug>/look.json` (remplacement complet). |
| `node scripts/ff.mjs vignettes [nom ...] [--forcer]` | Génère/rafraîchit `presets/vignettes/<nom>.webp` (capture du modèle sur `sites/_exemple`). |
| `node scripts/ff.mjs kit <slug> [--sortie dossier] [--url https://...]` | Livrables **client** tirés de `site.config.ts`, dans `livrables/<slug>/` (jamais commité) : `fiche-google.html` + `.md` (fiche Google Business Profile prête à recopier, un bouton « Copier » par champ : nom exact, catégories suggérées par une table métier → catégorie Google testée, repli « à choisir » adressé au studio, description ≤ 750 caractères faite de phrases du site, services et prix, horaires, adresse ou zone desservie, lien du site, photos converties en JPG dans `photos-google/`, étapes de création et de validation) ; `qr.svg` + `qr.png` (1024 px, `?utm_source=qr&utm_medium=print`, correction M) ; `carte-visite.pdf` (85 × 55 mm recto/verso) et `flyer-a5.pdf`, fond perdu 3 mm, marge sûre 5 mm, dans la direction du site (CSS et polices de `dist/<slug>` : `ff build` avant), aperçus PNG ; `README.txt` (specs d'impression, PDF en RVB). Un champ absent reste absent (« Note atelier » à la place) ; les données de test (06 00 00 00 00, 75000, `exemple.fr`) sont signalées, jamais masquées. `--url` sert tant que le site n'a pas de domaine. Fonctions pures testées dans `tests/kit.test.mjs`. |
| `node scripts/ff.mjs og <slug>` | Génère l'image Open Graph du site (`images.og`). |
| `node scripts/ff.mjs captures [slug ...] [--comparer] [--figer]` | Prend des captures d'écran du site buildé (desktop/mobile), sert `dist/<slug>` avec les en-têtes de `_headers` appliqués (CSP comprise, `scripts/ff/headers-file.mjs`) et échoue si une erreur console/débordement horizontal apparaît. `--comparer` : régression visuelle — compare pixel à pixel à `captures/base/<slug>-*.png` (`scripts/ff/compare-images.mjs`), avertit (sans échouer) si > 0,5 % des pixels diffèrent, écrit une image de diff dans `captures/diff/`. `--figer` : fige les captures actuelles comme nouvelle référence dans `captures/base/` (dossier local, jamais commité). |
| `node scripts/ff.mjs audit-motion [slug ...]` | Audite les animations (`src/scripts/motion.ts` + bloc motion de `src/styles/global.css`) d'un ou plusieurs sites **déjà construits** dans `dist/` (`ff build <slug>` avant si besoin) : défile lentement en desktop (1400x900) puis mobile (390x844), repère les `data-reveal`/`data-stagger`/`split-word`/`fill-word` restés invisibles, les sections épinglées (`data-pin`/`data-horizontal`) cassées (spacer démesuré, aucune étape active), les `data-frames-canvas` jamais dessinés, les `data-marquee` non dupliqués, les `data-counter` restés à 0, les débordements horizontaux, la typographie démesurée et le contraste `.eyebrow`/`.text-muted`. Rapport ✓/✗ en français, écrit `captures/<slug>-motion.json`, sort en erreur si un site échoue. |
| `node scripts/ff.mjs a11y [slug ...]` | Audit d'**accessibilité** axe-core (`@axe-core/playwright`, règles WCAG 2.0 A/AA, 2.1 AA, 2.2 AA) d'un ou plusieurs sites **déjà construits** : sert `dist/<slug>` avec `_headers` appliqués, ouvre **chaque** page HTML en Chrome à 1400x900 puis 390x844, `prefers-reduced-motion: reduce` émulé et page défilée pour que le contraste ne soit pas mesuré sur un élément à mi-fondu. Rapport ✓/✗ en français par règle (id, impact, nombre de nœuds, premier sélecteur fautif + extrait), écrit `captures/<slug>-a11y.json`, sort en erreur sur une violation `critical`/`serious` (`moderate`/`minor` signalées sans bloquer). Appelé par `ff verifier` (`--sans-a11y` pour le sauter). Fonctions pures testées dans `tests/a11y.test.mjs`. |
| `node scripts/ff.mjs nettete [slug ...]` | Audite la netteté des images/séquences `data-frames`/vidéos d'un ou plusieurs sites **déjà construits** dans `dist/` : ouvre l'accueil + une page service en Chrome (1400x900 @2x puis 390x844 @3x, les vrais téléphones), compare la taille affichée × DPR à la taille intrinsèque réelle de la source choisie par le navigateur (`img.currentSrc`/`naturalWidth`, taille du canvas `data-frames-canvas`, `videoWidth`), plus le poids moyen des frames d'une séquence. ✗ si étirée (ratio > 1,25) ou compression destructrice (< 15 Ko/frame pour une frame ≥ 1280 px) ; ⚠ à la marge ou surdimensionnée (gaspillage). Rapport ✓/⚠/✗ en français avec correction suggérée (`ff images`/`ff sequence --largeur/--qualite`), écrit `captures/<slug>-nettete.json`, sort en erreur si un ✗. |
| `node scripts/ff.mjs detect <slug> [--pages] [--tout] [--conseils]` | Regard extérieur automatique sur un site **déjà construit** : les 61 règles déterministes d'Impeccable (`npx -y impeccable detect`, open source Apache 2.0, sans clé ni navigateur) — contraste WCAG réel du texte accent (états `:hover` compris), texte fonctionnel sous 11px, majuscules sur texte long, ombres colorées, eyebrow au-dessus du h1. Échoue sur contraste/taille, avertit pour le reste ; `cramped-padding`/`tight-leading` ignorés (faux positifs connus sur nos classes `.card`/`.section-y`, `--tout` pour les voir). À lancer après `ff verifier`, avant les captures. Voir `docs/veille/skills-design-ia.md`. |
| `node scripts/ff.mjs ia [slug ...] [--json]` | Repère les **signes « fait par une IA »** d'un ou plusieurs sites **déjà construits** : polices par défaut des IA (direction ou `typography` du site), emphase des titres en italique, tiret cadratin ou point médian dans le texte visible (échecs) ; boutons pilule, coches façon tarif SaaS, libellés en capitales espacées (alertes). Né d'un retour réel (« ça se voit que c'est fait avec Claude », 6 oct 2026). Voir `docs/veille/signes-ia.md`, tests `tests/ia.test.mjs`. |
| `node scripts/ff.mjs signatures [--ecrire]` | Registre des **blocs signature** (sections sur mesure) et contrôle d'unicité : échoue si une même composition (empreinte de balises) apparaît sur deux sites, ou si une réserve de `reserves.json` (effet du moteur ou nom de bloc → site propriétaire, fichier édité à la main par le studio pour protéger ce qu'il veut garder unique) est utilisée ailleurs. `--ecrire` régénère `docs/SIGNATURES.md`, à lire avant de dessiner un bloc. |
| `node scripts/ff.mjs typo [slug ...] [--corriger]` | Contrôle la **typographie française** du texte visible d'un ou plusieurs sites **déjà construits** dans `dist/` : espace manquante ou mauvaise avant `; ! ?` (fine insécable U+202F) et `:` (insécable U+00A0), guillemets droits `"` au lieu de `« »`, apostrophe droite `'` au lieu de `’`, `...` au lieu de `…`, `oe` au lieu de `œ`, majuscule non accentuée en tête de mot (`Etat` → `État`), `N°` au lieu de `n°`, `9h30` au lieu de `9 h 30`, téléphone et prix non insécables, `2ème` au lieu de `2e`, `Mr`/`Mme.` au lieu de `M.`/`Mme`, fine **sécable** U+2009 (`&thinsp;`, le piège classique). Rapport ✓/✗/⚠ en français avec la phrase fautive, sort en erreur sur une règle dure. `--corriger` réécrit `sites/<slug>/site.config.ts` et `sites/<slug>/sections/*.astro` — jamais l'intérieur d'une balise, d'un attribut, d'une URL, d'un e-mail ou d'un bloc de code (fonction pure, `tests/typo.test.mjs`). Voir `docs/veille/typographie.md` et `docs/CONVENTIONS.md` règle 22. |
| `node scripts/ff.mjs lighthouse [slug] [--mobile] [--seuil 90] [--detail]` | Audite performance/accessibilité/bonnes pratiques/SEO (Lighthouse) sur l'accueil + une page service + mentions légales, desktop et mobile par défaut ; écrit `captures/<slug>-lighthouse.json`, sort en erreur si l'accueil est sous le seuil. `--detail` : imprime chaque audit en échec (les quatre catégories, pas seulement l'accessibilité) avec les extraits de noeuds fautifs (snippet/sélecteur), pour corriger sans deviner. Aussi disponible via `ff verifier <slug> --lighthouse`. |
| `node scripts/ff.mjs perf <slug> [--build] [--lighthouse]` | Budget de performance **sans navigateur** (rapide) : construit `dist/<slug>` seulement s'il est absent (ou avec `--build`), somme les octets bruts par catégorie (html, css, js-initial, js-lazy, fonts, images-home) référencés par `index.html`/le CSS livré, compare à `perf-budget.json` (racine du repo), table `✓`/`✗`, sort en erreur si une catégorie dépasse son budget ; écrit `captures/<slug>-perf.json`. `--lighthouse` enchaîne `ff lighthouse` (score + LCP réel, plus lent). Voir `docs/veille/performance.md` §6.3. |
| `node scripts/ff.mjs sante <slug|url> [--domaine x]` | Bilan de santé d'un site **déjà en ligne** (pas un build local) : HTTP 200 (accueil, sitemap, mentions légales, confidentialité), vrai 404 sur `/404`, redirection HTTP→HTTPS, canonical, `Cache-Control` d'un asset `/_astro`, `robots.txt`, title/description/JSON-LD/`tel:`/formulaire, temps de réponse, validité du certificat TLS, expiration du domaine (RDAP), DNS, MX. Accepte un slug connu (lit `sites/<slug>/domain.txt`) ou une URL directe (utile pour tester un `ff servir` local : TLS/RDAP/DNS alors ignorés). Écrit `captures/<slug>-sante.json`. À lancer à J+1 de la mise en ligne puis une fois par mois — voir `docs/PROCESS.md`. |
| `node scripts/ff.mjs servir <slug>` | Sert le build statique de `dist/<slug>` en local, en-têtes de `_headers` appliqués (CSP comprise). |
| `node scripts/ff.mjs archiver <slug>` | Sauvegarde ponctuelle : zippe `sites/<slug>` + `dist/<slug>` (s'il existe) dans `archives/<slug>-<date>.zip` (dossier local, jamais commité). PowerShell `Compress-Archive` sur Windows, `zip` ailleurs. |
| `node scripts/ff.mjs indexnow <slug> [--simuler]` | Soumet les URLs du site (sitemap buildé) à IndexNow = Bing + moteurs participants. ChatGPT Search et Copilot puisent dans l'index Bing : être indexé vite, c'est être cité plus tôt par les réponses IA. La clé `sites/<slug>/public/indexnow-<cle>.txt` est créée si absente. Appelé automatiquement par `ff deploy` quand le site a un domaine. |
| `node scripts/ff-mcp.mjs` | Serveur MCP (stdio, sans dépendance) : expose les commandes LOCALES de l'atelier (`build`, `verifier`, `composer`, `captures`, `perf`, `liste`, `variete`, `modeles`, `nouveau`, `aide`) comme outils appelables par un agent IA (Claude Code, Kimi Code, Cursor...) — l'associée non-développeuse pilote l'atelier en langage naturel. Déploiement (`deploy`, `domaine`) et génération (`ff-generer`) volontairement exclus : une action qui publie ou facture ne part pas d'un appel d'outil. Déclaration : `{ "mcpServers": { "ff-atelier": { "command": "node", "args": ["scripts/ff-mcp.mjs"] } } }`. |

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

- `docs/GOUT.md` — **la charte de goût des fondateurs** : ce qu'un site doit être, les signes « fait par une
  IA » interdits, les règles de démo, de mouvement, de texte, et la façon de travailler sans allers-retours.
  Tout agent qui dessine, écrit ou relit un site la lit en premier ; chaque « non » d'un fondateur y
  entre, daté. Skills : `/site-final <slug>` (jusqu'à l'état « à montrer », en une passe), `/retouche <slug>
  "<phrase>"` (une phrase du fondateur appliquée à un site déjà montré : plus petite modification à la source,
  contrôles, comparaison avant/après, redéploiement, un commit annulable) et `/veille`
  (tour d'entretien et d'apprentissage de l'usine, journal dans `docs/veille/journal.md`).
- `docs/COMMANDES.md` — les commandes du quotidien résumées sur une page, pour le fondateur non
  technique : les 6 commandes de base, un chantier client de bout en bout, que faire quand un truc
  cloche, le reste par besoin.
- `src/lib/schema.ts` — schéma zod complet (`DIRECTIONS`, `MOTION`, `VARIANTS`, `SHELLS`,
  `HEADINGS`, `siteSchema`). `layout.contactDrawer` (défaut `false`) — contact en tiroir : `<dialog>`
  natif rendu par `Base.astro` (`src/components/ContactDrawer.astro`), ouvert par tout lien `#contact`,
  pour les métiers d'urgence ; `transitions` (défaut `false`) — transitions de page natives
  (`<ClientRouter />`), tout script inline doit alors passer par `onPage()` (`src/scripts/page.ts`).
  Voir `docs/CONVENTIONS.md` § Coquilles et `docs/ANIMATIONS.md` § Transitions de page.
  `business.schemaType` (sous-type schema.org, ex. `Plumber`) et
  `contact.mapsProvider`/`contact.coordinates` (carte sans traceur, voir `docs/DIRECTIONS.md` § Carte)
  sont optionnels — ne jamais les deviner pour un client, laisser absent si le brief ne les fournit pas.
  `conseils` (défaut `[]`) : articles fournis par le client (brief § 10bis) → `/conseils`, une page par article
  (`BlogPosting`), lien de nav avant Contact ; aucun article = aucune page (`src/lib/conseils.ts`,
  `tests/conseils.test.mjs`, levier du marché `docs/veille/marche/CE-QUI-VEND.md`).
  `annonce` (optionnel) : la nouvelle du moment du client (fermeture, saison, offre datée) → une ligne sous le premier
  écran de l'accueil, fenêtre `du`/`au` lue au build et rejouée dans le navigateur ; pas dans les coquilles à crans
  (`src/lib/annonce.ts`, `src/components/Annonce.astro`, `tests/annonce.test.mjs`).
  `produits` (défaut `[]`) : la gamme du client (architecture `gamme-vitrine`, coquille `vitrine` ; `detoure: true` par produit pour l'inclinaison et l'ombre, sinon photo droite sans ombre) → `/produits` par famille,
  une page par produit (`Product`, sans offre si le prix manque), lien « Produits » en tête de nav ; aucun produit = aucune
  page (`src/lib/produits.ts`, `tests/architectures.test.mjs`).
  `lieux` (défaut `[]`) : les adresses du client (architecture `pages-adresses`, coquille `adresses`) → `/adresses` et
  `/adresses/<slug>` (horaires et téléphone par lieu, `LocalBusiness` par lieu), `pros` → `/professionnels` ; `sorties`
  (défaut `[]`) et `services[].saison` (architecture `saisons-sorties`, coquille `saisons`) → `/sorties/<slug>`,
  `/pour/<public>`, nav d'une entrée par saison ; aucune donnée = aucune page (`src/lib/lieux.ts`, `src/lib/sorties.ts`).
  `services[].programme` / `tousLesJours` et `ardoise` (défaut `[]`, architecture `ardoise-du-jour`, coquille `ardoise`) → l'ardoise du
  jour de l'accueil (jour choisi dans le navigateur, semaine entière sans script), `/programme` ; `tournee` (défaut `[]`, architecture
  `tournee-semaine`, coquille `tournee`) → l'étape du moment, `/tournee`, `/tournee/<commune>` ; aucune donnée = aucune page
  (`src/lib/ardoise.ts`, `src/lib/tournee.ts`, `tests/architectures-jour.test.mjs`).
  `artistes` (défaut `[]`, architecture `artistes-residents`, coquille `artistes`) → un bloc par artiste sous des onglets de
  style, `/artistes`, `/artistes/<slug>` (`Person` par artiste) ; `fetes` (défaut `[]`) et `livraison` (architecture
  `calendrier-fetes`, coquille `fetes`) → la piste des fêtes ouverte sur celle du moment dans le navigateur, date limite de
  commande, heure limite de livraison, `/fetes`, `/fetes/<slug>` ; aucune donnée = aucune page (`src/lib/artistes.ts`,
  `src/lib/fetes.ts`, `tests/architectures-maison.test.mjs`).
  `disponibilites` (optionnel, architecture `outil-calendrier`, coquille `calendrier`) → l'outil des nuits libres et prises
  (liste `occupe` ou iCal lu au build, lisible sans script ; arrivée et départ remplissent la demande, aucun paiement),
  `/disponibilites` ; `parcours` (défaut `[]`, architecture `parcours-atelier`, coquille `parcours`) et
  `proof.testimonials[].barreau` → « Où en êtes-vous ? » en marches (un onglet par barreau), `/parcours/<slug>` ; aucune
  donnée = aucune page (`src/lib/sejour.ts`, `src/lib/ics-build.ts`, `src/lib/parcours.ts`,
  `tests/architectures-sejour.test.mjs`).
  `tarifs` (optionnel, architecture `grille-urgence`, coquille `grille`) → « Quelle est votre situation ? » en onglets, le prix
  de chaque créneau (journée, soirée, nuit) et celui de l'heure marqué dans le navigateur, la grille complète, `/tarifs`,
  `/tarifs/<slug>` ; `envoi` (optionnel, architecture `atelier-par-colis`, coquille `colis`) → les deux chemins Venir / Envoyer,
  le voyage du colis en piste horizontale manuelle, `/envoyer` ; aucune donnée = aucune page (`src/lib/tarifs.ts`,
  `src/lib/colis.ts`, `tests/architectures-atelier.test.mjs`).
  `services[].lignes[].duree` (architecture `carte-des-soins`, coquille `soins`) → « Combien de temps avez-vous ? » en onglets de
  durée, chaque soin avec sa famille, sa durée, son prix et Réserver ; `realisations[].avant` (architecture `avant-apres`, coquille
  `avant-apres`) → le mur des pièces en curseurs avant / après qu'on tire à la main, rangées par type en onglets, le curseur en
  tête de `/realisations/<slug>` ; aucune durée ou photo avant = rien (`src/lib/soins.ts`, `src/lib/avantapres.ts`,
  `src/components/Comparer.astro`, `tests/architectures-soins.test.mjs`).
  `planning` (optionnel, architecture `planning-semaine`, coquille `planning`) → la semaine en onglets par jour (le jour même ouvert
  dans le navigateur, les jours en colonnes à l'ordinateur), un filtre par discipline, le cours d'essai, `/planning`, les créneaux sur
  la page de chaque discipline ; `location` (optionnel, architecture `catalogue-location`, coquille `location`) → le parc en onglets
  par catégorie, prix par durée, bascule particulier TTC / pro HT sans script, caution, « Chercher un outil », les créneaux qui
  comptent moins, `/materiel`, `/materiel/<slug>` ; aucune donnée = aucune page (`src/lib/planning.ts`, `src/lib/location.ts`,
  `src/components/CreneauxDuCours.astro`, `tests/architectures-semaine.test.mjs`).
  `estimation` (optionnel, architecture `estimation-etapes`, coquille `estimation`) → la demande d'estimation en étapes sous l'en-tête
  (le projet parmi les services, les questions du client, les coordonnées ; `ContactForm` prop `etapes`, tout visible sans script),
  ce qui se passe après, `/estimation` (`?projet=<slug>` depuis chaque page de prestation) ; `formules` (optionnel, architecture
  `formules-comparees`, coquille `formules`) → les formules nommées à prix côte à côte (piste au téléphone), chacune avec sa porte,
  `/formules` (comparaison en mots, jamais de coches), `/formules/<slug>` avec la demande réglée sur elle ; aucune donnée = aucune
  page (`src/lib/estimation.ts`, `src/lib/formules.ts`, `tests/architectures-devis.test.mjs`).
  `appareils` (optionnel, architecture `appareils-pannes`, coquille `appareils`) → « Quel appareil est en panne ? » en onglets par
  famille avec son forfait, chaque appareil vers sa page et ses pannes vers leur ancre, les étapes, les communes et les marques de A à Z
  dans le même bloc, `/appareils` (avec les questions), `/appareils/<slug>` ; `retrait` (optionnel, architecture `commande-retrait`,
  coquille `retrait`) → la règle « Commandez avant le mardi à 12 h, retirez le jeudi » et la prochaine clôture calculée dans le
  navigateur, les façons d'acheter, les points de retrait en onglets par jour, `/retrait` (avec les questions), `/retrait/<slug>` ;
  aucune donnée = aucune page (`src/lib/appareils.ts`, `src/lib/retrait.ts`, `tests/architectures-pannes.test.mjs`).
  `salles` (optionnel, architecture `salles-capacites`, coquille `salles`) → « Combien serez-vous ? » : le tableau des capacités par
  configuration (lisible sans script) et les salles qui conviennent marquées dans le navigateur, les salles en onglets, couchages et
  équipements, `/salles` (avec les questions), `/salles/<slug>` ; `biens` (optionnel, architecture `annonces-biens`, coquille `biens`)
  → la vitrine Acheter / Louer en onglets, « Faire estimer votre bien », `/biens`, `/biens/<slug>` (DPE et GES en échelle, honoraires),
  `/honoraires` ; une mention d'annonce absente est signalée au build ; aucune donnée = aucune page (`src/lib/salles.ts`,
  `src/lib/biens.ts`, `tests/architectures-reception.test.mjs`).
  `revendeurs` (optionnel, architecture `revendeurs-secteurs`, coquille `revendeurs`) → « Où trouver nos bières ? » : les secteurs
  en boutons dès l'en-tête, les communes de A à Z, le genre de chaque revendeur et un filtre « Chez qui ? » dans le navigateur, la
  vente sur place et la porte des pros dans le même bloc, la gamme, `/ou-trouver`, `/ou-trouver/<secteur>` ;
  `profils` (optionnel, architecture `profils-patients`, coquille `profils`) → « Vous consultez pour » en onglets (motifs, durée,
  prix, praticien, rendez-vous), la séance, la prise en charge et les praticiens dans le même bloc, l'accès, `/consulter`,
  `/consulter/<slug>` ;
  aucune donnée = aucune page ; une section `proof` sans preuve n'a pas de lien de nav (`src/lib/revendeurs.ts`,
  `src/lib/profils.ts`, `tests/architectures-producteurs.test.mjs`).
- `src/lib/site.ts` — `site` courant + helpers (`tel`, `mailto`, `whatsapp`, `fullAddress`,
  `yearsSince`, `paragraphs`, `navLinks`, `schemaTypeForTrade` — déduit un sous-type schema.org depuis
  `business.trade` en français, repli `LocalBusiness` ; implémenté dans `src/lib/schemaType.ts`,
  module pur re-exporté par `site.ts`, utilisé par `src/layouts/Base.astro` pour le JSON-LD quand
  `business.schemaType` n'est pas renseigné). Le JSON-LD ne contient jamais d'`aggregateRating` (avis
  self-serving interdit par Google) : la note Google reste affichée uniquement dans les sections
  (`proof/google`).
- `src/shells/<nom>.astro` — coquille de page (`layout.shell`) : rearrange nav/hero/sections/footer
  autour de la mise en page, ne restyle jamais une section (voir `docs/CONVENTIONS.md` § Coquilles).
  `sidebar` et `split` ont un sommaire actif (`data-scrollspy`, `src/scripts/scrollspy.ts`).
- `src/sections/<Type>/<variante>.astro` — une section, une variante, un fichier.
- `src/directions/<nom>/` — `index.css` (tokens + polices) + `meta.ts` (ambiance, métiers, à éviter).
- `sites/<slug>/site.config.ts` — le contenu d'un client. `sites/<slug>/public/images/` — ses photos.
- `sites/_exemple/` — référence de schéma et fumigène de build. Ne pas y toucher pour un client.
- `src/pages-optional/credits.astro` (`src/lib/credits.ts` pour le parseur, `scripts/astro-credits-integration.mjs` pour l'injection de route) — page `/credits` : attribution visible des photos CC BY/CC BY-SA de `sites/<slug>/CREDITS.md`, générée au build seulement si ce fichier a au moins une entrée, liée depuis les pieds de page partagés ; voir `docs/veille/redaction-images.md` §2.
- `docs/BRIEF.md` — brief à remplir pendant l'appel client. `docs/DIRECTIONS.md` — guide de choix de
  direction et de variantes. `docs/PROCESS.md` — processus client complet, de la prospection à la
  livraison. `docs/REDACTION.md` — règles opérationnelles de rédaction (mots interdits, professions
  réglementées, ton par métier, test du hero, 60 phrases d'accroche, lexique, micro-copie, checklist
  « textes livrables »), distillées de `docs/veille/redaction-images.md` §1. `docs/CONVENTIONS.md` —
  règles de code des sections et directions. `docs/ANIMATIONS.md`
  — liste complète des attributs `data-*` du moteur d'animation (`src/scripts/motion.ts`), un par
  ligne, quand les utiliser ; vitrine de tous les effets : `sites/_effets/`. `docs/ANIMATION-PAR-METIER.md`
  — méthode en 5 questions pour choisir quoi animer pour un métier donné (geste montrable, émotion/
  rythme, preuve tangible, règle du « seul feu d'artifice », interdits par famille de métier), table
  des 27 métiers de `docs/OBJECTIF.md` avec bloc signature recommandé, fiche dentiste complète en
  démonstration.
- `.claude/skills/nouveau-site/` — compétence `/nouveau-site` (génération de `site.config.ts` par
  Claude Code). `scripts/ff-generer.mjs` — équivalent en automatisation pure (API Anthropic).
- `scripts/astro-icons-integration.mjs` (fonctions pures dans `scripts/ff/icones.mjs`, `tests/icones.test.mjs`) — pack d'icônes généré au build depuis `sites/<slug>/public/favicon.svg` : `favicon.ico` 32x32, `apple-touch-icon.png` 180x180 (fond opaque = token `--bg` de la direction, 12 % de marge), `icon-192.png`, `icon-512.png`, `site.webmanifest` (`display: browser`). Un fichier fourni par le site dans `public/` n'est jamais écrasé. `<meta name="theme-color">` de `Base.astro` = ce même `--bg` (exporté `themeColor` par `virtual:ff-look`).
- `scripts/ff/csp.mjs` — construit la Content-Security-Policy par site (lue par regex dans
  `site.config.ts`), utilisée par `astro.config.mjs` (intégration `ff-headers`, écrit `_headers`) et
  testée par `tests/headers.test.mjs`. `scripts/ff/headers-file.mjs` — applique `_headers` dans les
  serveurs statiques locaux (`ff captures`, `ff servir`), pour révéler une violation CSP avant le
  premier déploiement. Plus de Dependabot (13 oct 2026, une seule branche) : `npm outdated` à la main. Voir
  `docs/DEPLOIEMENT.md` § Sécurité (CSP, Turnstile, Dependabot) et § Suivi automatisé
  (`sites-en-ligne.json`, job planifié `sante-hebdomadaire`).

## Quand tu ajoutes une variante

Trois choses, dans l'ordre, jamais une seule :

1. Le fichier `src/sections/<Type>/<nouvelle-variante>.astro` (respecte les règles de
   `docs/CONVENTIONS.md` : tokens uniquement, `id` correct, pas de donnée inventée, accessibilité).
2. L'entrée dans `VARIANTS.<Type>` (`src/lib/schema.ts`) — sinon `defineSite` la rejette.
3. Une ligne dans le tableau correspondant de `docs/DIRECTIONS.md` (variante + quand l'utiliser).

Une direction fonctionne pareil : dossier `src/directions/<nom>/` (`index.css` + `meta.ts`) + une ligne
dans la table des directions de `docs/DIRECTIONS.md`.

## Pièges déjà payés

Liste complète : `docs/HANDOVER.md` § 5. Leçons d'octobre 2026 (site du studio) :

- `<style is:global>` sans couche bat **toute** classe Tailwind (rangées dans `@layer utilities`) :
  un `.x{aspect-ratio}` global écrasait `md:aspect-*` en silence. Voir `docs/CONVENTIONS.md` § CSS global.
- iPhone en économie d'énergie bloque **tout** autoplay vidéo : jamais de contenu essentiel en vidéo,
  préférer des images fixes animées en CSS.
- Une image très haute animée en `transform` est floue sur iOS (texture GPU) : tuiles ≤ ~1 500 px,
  `ff tuiles`.
- Émulation WebKit/iPhone contre le serveur local = échec (CSP `upgrade-insecure-requests` + HSTS) :
  vérifier iOS sur l'URL https déployée.
- Variable CSS locale d'animation nommée comme un token (`--s1`, `--s2`… = espacements) : elle écrase le token
  dans toute la sous-arborescence, les `calc(var(--s2) + …)` deviennent invalides et les marges tombent à 0.
  Préfixer les variables de scène (`--j2`, `--p`, `--a`).
- Scène collante pilotée au défilement sur iPhone : mesurer la course sur l'enfant `100svh`, pas `innerHeight`
  (qui bouge quand la barre de Safari se replie), et garder les écrans au-dessus de la barre basse (`--barre`).
- Animation riche calée image par image sur `--p` (3D, plusieurs téléphones) : saccadée sur iPhone, Safari
  défile hors du fil principal. Préférer des étapes (`data-etapes` → `data-etape`, scene-ff.ts) et des
  transitions en temps sur transform/opacity ; garder `--p` pour les simples translations.
- Vercel sans `cleanUrls: true` = 404 sur `/audit`, `/mentions-legales` : passer par `ff vercel`.
- Pages légales sur mesure : `sites/<slug>/legal/MentionsLegales.astro` / `Confidentialite.astro`
  (modèle `outils/legal/`), voir `docs/CONVENTIONS.md` § Pages légales.
- Astro met dans la feuille de chaque page le CSS de **tout module atteignable**, même par `import.meta.glob`
  paresseux ou dans une branche jamais exécutée : un glob de `src/sections` ou `src/shells` livrait le style des
  ~75 variantes et 25 coquilles sur chaque page (243 Ko pour l'accueil de `_exemple` le 26 oct 2026, 113 Ko après).
  Les composants du site sont importés un par un par `scripts/vite-ff-look.mjs` (`composantsDuSite`) ; jamais de
  glob de sections ou de coquilles côté `src/`. Une page qui demande une variante par son nom l'ajoute là.

## Ne pas toucher sans raison

`sites/_exemple/` est la référence de schéma pour tous les agents qui travaillent sur ce repo — un
changement y casse le fumigène de build de tout le monde. Modifie-le seulement si la demande porte
explicitement dessus.
