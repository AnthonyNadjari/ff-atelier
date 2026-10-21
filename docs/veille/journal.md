# Journal de veille

Une entrée par tour de `/veille` (skill `.claude/skills/veille/SKILL.md`), la plus récente en tête :
fait / proposé / à décider / prochain volet. Le fondateur lit ce fichier (ou l'onglet Notes du doc
partagé) pour savoir où en est l'usine sans relire une conversation.

## 19 oct 2026, tour 4 (routine en ligne) : 5 styles, 2 architectures

**Fait**
- Santé : 65 fichiers de tests verts avant et après (5 blocs de `node --test --test-concurrency=1`). Chromium installé
  par `playwright-core` dans un dossier à part (`PLAYWRIGHT_BROWSERS_PATH`), puis `FF_CHROMIUM=1` : tout a tourné avec navigateur.
- **Styles (2a quater)** : 20 sites jamais étudiés, pris sur [minimal.gallery](https://minimal.gallery/) (rubriques nourriture,
  intérieur, santé, commerce), démontés (`ff demonter` + `ff atomes mesurer`). Chaque style a été essayé sur une copie jetable
  de `demo-boulangerie` (`ff melanger --style <id> --essai`) et posé à côté de la source. **5 gardés** en atomes :
  `kaltpresse` (jus pressés, Cologne), `podiatry` (podologue, Melbourne), `carne` (burgers, Argentine), `joandso` (guide d'hôtels,
  Portugal), `nkora` (cafés, Bristol). Les grands titres de Carne et Kaltpresse ont été relevés une seconde fois dans le DOM : le
  premier relevé prenait une bannière pour le titre. Polices libres : Hanken Grotesk, Spectral, Oswald + Karla, Urbanist. Aucune
  ne vient de la liste IA ; la police de Two Robbers (Instrument Sans) en faisait partie. Registre : 29 sites
  ([styles/INDEX.md](styles/INDEX.md)). Refusés après la comparaison : Florentine, Studio Boum, Two Robbers (sans leurs photos,
  il ne reste rien). Écartés au démontage : 12 sites (écran de chargement, fenêtre cookies, pas de défilement). Raisons dans
  l'index.
- **Mouvement** : 2 profils nouveaux dans [MOUVEMENTS.md](styles/MOUVEMENTS.md) et `scripts/ff/mouvements.mjs` :
  `mots-qui-glissent` (Carne : mots géants qui glissent au défilement derrière un produit détouré) et `ombre-au-survol` (Jo&So :
  les cartes se soulèvent sous le pointeur, calme). Le test qui plafonnait le catalogue à 15 profils accepte désormais 12 et plus.
- **Architectures (2a ter)** : [pages-adresses](architectures/pages-adresses.md) (Ten Belles : une page par boutique avec ses
  horaires et son numéro, une page pour les pros) et [saisons-sorties](architectures/saisons-sorties.md) (Guide La Grave : la nav
  a deux entrées, Été et Hiver, puis des sorties filtrables). Elles sont lues sur le code et ne sont **pas encore implémentées**.
- **Marché (2a)** : 9 sites de plus (agences de Villeurbanne, Brest, Nîmes ; brasserie Strasbourg, boulangerie Rennes,
  couvreur Marseille ; modèles ThemeForest Renovate, Wix Galvanic, Framer PlumFix). [CE-QUI-VEND.md](marche/CE-QUI-VEND.md)
  passe à 36 sites. Aucun levier à 40 % ou plus n'est absent de l'usine. Labels et certifications passent à 36 %, toujours
  absents des premiers écrans. Levier nouveau : **la nouvelle du moment** (bière éphémère, page Noël), vue sur 3 sites sur 9.

**Ressemblance** (`ff ressemblance --registre --tous`) : 263 paires trop proches (46 par le premier écran, 238 par le déroulé,
21 par les deux). Les pires :
- anna-vidal / borie-des-chenes : déroulé 1,00, téléphone 0,81 (accueil-menu sans défilement) ;
- chez-malo / studio-ambre : 0,87 au téléphone, 0,91 à l'ordinateur ;
- demo-informatique / fromagerie-ravanel-d : déroulé 0,90 ;
- prospect-ballay-macon / prospect-epi-dor : déroulé 0,89 ;
- forge-delacroix / studio-ambre : 0,88 à l'ordinateur.

Rien n'a été corrigé : la veille ne touche à aucun site.

**Proposé** :
- un champ « nouvelle du moment », daté, qui disparaît seul à la date de fin (levier du marché à 33 %) ;
- `business.certifications` dans les premiers écrans, avant que ce levier passe 40 % ;
- implémenter `pages-adresses` (`lieux[]`, `/adresses/<slug>`), qui sert aussi aux boulangeries à plusieurs boutiques ;
- quand `ff melanger --essai` copie un site, prendre aussi ses photos : sur `demo-boulangerie`, les photos sont
  remplacées par un dégradé, et un style qui vit de ses photos se juge mal.

**À décider** : les 5 styles (`ff melanger <slug> --style kaltpresse` les applique) ; les paires trop proches autour de
studio-ambre et des prospects de l'Épi d'Or.

## 17 oct 2026, tour 3 (routine en ligne) : 9 styles réels, 2 architectures

**Fait**
- Santé : 62 fichiers de tests verts avant et après (4 blocs), `ff signatures` vert (177 blocs, aucune copie).
  Chromium installé par `playwright-core` puis `FF_CHROMIUM=1` : tout a tourné avec navigateur.
- **Styles (2a quater), l'amélioration du tour** : 16 sites jamais étudiés pris sur [minimal.gallery](https://minimal.gallery/)
  (rubriques nourriture, intérieur, hôtels, ateliers), démontés par `ff demonter` dans `docs/veille/styles/`. 13 jugés,
  **9 gardés et devenus des directions** de l'usine, chacune avec ses deux modèles et leurs vignettes :
  `cobalt` (boulangerie Union), `sapin` (Cabalar), `affiche` (Matheson), `prune` (House of Honey), `huile` (Anècdota),
  `releve` (Roxoseco), `arche` (Anuc Home), `labo` (Folk Kombucha), `citron` (Pimpinella). Couleurs relevées en hex,
  polices libres les plus proches (Gilda Display et Marcellus ajoutées au registre ; Instrument Serif et Sans, de la
  liste IA, remplacées), contrastes AA vérifiés (trois rouges de source assombris, notés dans les fiches).
  Preuve : `_exemple` habillé de chaque style, posé à côté de la source (`docs/veille/styles/captures/<direction>-comparaison.jpg`),
  regardé. Refusés : `velours` (Durup, style tout en photo, capture floue : essayé puis retiré), Hyll (bannières
  bloquantes), Uneven Objects et Grace Walker (pas de défilement). Celtic Sea Salt, Oma Appel, Onoera démontés, en réserve.
  Index : [styles/INDEX.md](styles/INDEX.md).
- **Architectures (2a ter)** : registre créé, [architectures/INDEX.md](architectures/INDEX.md), deux fiches :
  [carrefour-portes](architectures/carrefour-portes.md) (Cabalar : accueil aiguillage, trois portes vers des pages,
  contact à part) et [projets-fiches](architectures/projets-fiches.md) (House of Honey : une page par chantier avec sa
  série de photos). Fiches seulement : **pas encore implémentées** dans l'usine (voir « proposé »).
- **Marché (2a)** : 9 sites de plus (agences de Bordeaux, Perpignan, Dijon ; Google : architecte d'intérieur Rouen,
  dentiste Lille, traiteur Le Havre ; Framer Refit, Wix, ThemeForest Constructo), mesurés sur le code (agent sans
  navigateur), [CE-QUI-VEND.md](marche/CE-QUI-VEND.md) sur 27 sites. Aucun levier ≥ 40 % absent de l'usine ; labels
  au premier écran retombent à 30 %.
- Tests des modèles : les comptes fixes de variété (8/14/10 échelles, 12 alternances sur 32 modèles) deviennent des
  proportions (`tests/presets.test.mjs`), la veille ajoutant des modèles à chaque tour. Deux directions qui listaient
  « fleuriste » l'ont retiré (le test du composeur veut qu'une fleuriste tombe sur `atelier`).

**Ressemblance** (`ff ressemblance --registre --tous`) : 46 paires trop proches au premier écran. Les pires :
chez-malo / studio-ambre (0,87 téléphone, 0,91 ordinateur : h1 sur l'image au milieu, numéro sous le h1),
maison-aurore / studio-ambre (0,89), forge-delacroix / studio-ambre (0,88), encre-noire / forge-delacroix (0,88),
demo-coiffure / demo-informatique (0,86). Signalé, pas corrigé (la veille ne touche à aucun site).

**Proposé** : implémenter les deux architectures (route `/realisations/[slug]` avec un champ `realisations[]` ; pages
À propos et Contact à part ; hero avec horaires ; variante « portes ») ; faire choisir les 9 styles par `ff composer`
selon les données du client (photos, produits) ; `ff verifier` devrait repérer un faux numéro de modèle
(`tel:123456789`, vu chez un artisan du marché), la garde ne connaît que 06 00 00 00 00.

**À décider** : regarder les 9 comparaisons et dire lesquelles ne vous plaisent pas (elles sont déjà proposées par
`ff studio` et `ff modele`) ; les 46 paires trop proches, surtout autour de studio-ambre.

## 17 oct 2026, tour 2 (routine en ligne) — trois compositions de modèles Framer : de la profondeur

**Fait**
- Santé : 57 fichiers de tests verts (4 blocs), `ff variete` et `ff signatures` verts (154 blocs, aucune copie),
  `ff verifier demo-paysagiste` vert (avertissements de démo seulement), planche téléphone regardée, rien de cassé.
  Chromium à jour installé par `playwright-core` (`node node_modules/playwright-core/cli.js install chromium
  chromium-headless-shell`) puis `FF_CHROMIUM=1` : tout a tourné avec navigateur.
- Volet 2a bis, **l'amélioration du tour** : les trois modèles les plus populaires de la catégorie
  [Home Services de Framer Marketplace](https://www.framer.com/marketplace/templates/categories/home-services/)
  (PlumFix n° 1, Solshine n° 2, HandGrid n° 3) démontés, pages entières regardées, trois sections recréées en
  variantes partagées : `services/photo-cards` (photo qui remplit la carte, panneau clair posé dessus),
  `about/overlap` (panneau sombre, portrait qui dépasse le haut, seconde photo qui déborde dessous : trois plans),
  `cta/photo` (photo du client en pleine largeur, appel centré). Construction seulement : aucun texte, image, code
  ni identité des sources ; refusés en route : photos inclinées, coches, mot du titre en couleur, chiffres factices.
  Site jetable (copie de `jardins-mael`) : build, `ff verifier` (a11y, typo, `ff ia` verts), `ff audit-motion` vert,
  captures ordinateur et téléphone posées à côté de la source et regardées
  ([services](compositions/handgrid-services-comparaison.jpg), [à propos](compositions/handgrid-about-comparaison.jpg),
  [appel](compositions/plumfix-cta-comparaison.jpg)) ; deux reprises après comparaison (photos de l'à-propos trop
  petites, voile de l'appel trop lourd). Site jetable supprimé.
- `ff composer` choisit désormais ces trois variantes d'office quand leurs photos sont là
  (`COMPOSITIONS_EPROUVEES`, `scripts/ff/composer.mjs`, test dans `tests/composer.test.mjs`) ; six modèles
  (`presets/`) les portent, vignettes régénérées. Lignes dans [DIRECTIONS.md](../DIRECTIONS.md) et
  [compositions/INDEX.md](compositions/INDEX.md).
- Volet 2a : 9 nouveaux sites (agences de Tours, Le Mans, Limoges ; photographe Lyon, plombier Clermont-Ferrand,
  barbier Nice ; ThemeForest BuildPress 7,8 k ventes, Squarespace Sawyer, Webflow Roofex), fiches dans
  `docs/veille/marche/`, comptes sur 18 sites dans [CE-QUI-VEND.md](marche/CE-QUI-VEND.md).

**Appris du marché**
- Plusieurs pages 18/18, avis 14/18, une page par service 13/18, téléphone en haut 12/18 : l'usine fait tout ça.
- Aucun levier ≥ 40 % absent de l'usine. Le plus proche : **labels et certifications au premier écran, 7/18 (39 %)** ;
  nos six heros affichent l'assurance mais pas `business.certifications` (RGE, Qualibat ne se voient qu'en bas).
- Les deux meilleurs premiers écrans d'artisans ajoutent ce que nos heros n'ont pas : les communes desservies en
  liste cliquable et un délai chiffré (« Devis sous 48 h », donné par le client).
- 4 sites sur 18 se cachent derrière une bannière cookies plein écran : notre « zéro traceur » est un argument.
- En recherche locale, l'artisan indépendant n'arrive qu'au 10e rang ou après (annuaires et plateformes devant).

- En fin de tour, la fusion avec `main` a fait tomber deux tests : le commit `da195bf` (démo prospect) écrit
  `noindex, nofollow, noarchive` sur toutes les pages légales et crédits, les tests attendaient `noindex` seul.
  Tests assouplis (noindex reste exigé, `tests/credits.test.mjs`, `tests/legal.test.mjs`), ligne du fondateur intacte.

**Compositions ajoutées** : `services/photo-cards`, `about/overlap`, `cta/photo` (sources et pertes dans l'index).

**Proposé** : prochain tour, `business.certifications` dans les heros (levier à 39 %) ; un hero « nom géant
derrière le gérant détouré » (PlumFix) dès qu'un brief fournit une photo détourée ; `ff detect` signale un faux
contraste sur le titre en italique des bandeaux encre (`cta/band` comme `cta/photo`, axe ne voit rien) : à
filtrer dans `scripts/ff/detect.mjs` ou à corriger.

**À décider** : montrer aux fondateurs les trois comparaisons avant d'en faire le défaut de toutes les démos
(composer les choisit déjà quand les photos sont là).

## 17 oct 2026 (routine en ligne) — premier tour « ce qui se vend » : rubrique Conseils

**Fait**
- Santé : 56 fichiers de tests verts (4 blocs), `ff variete` et `ff signatures` verts (152 blocs, aucune copie),
  `ff verifier ampere-fils` vert (avertissements de démo seulement), planche téléphone regardée, rien de cassé.
  Chromium de la session trop ancien pour `playwright-core` 1.63 : `npx playwright install chromium` puis
  `FF_CHROMIUM=1`, tout a tourné avec navigateur.
- Volet 2a, 9 sites tirés au hasard et démontés (`ff demonter`) : 3 sites clients d'agences (Grenoble, Strasbourg,
  Angers), 3 artisans classés (chambres d'hôtes Marseille, ferronnier d'art Paris, électricien Rennes), 3 modèles
  (ThemeForest 10 654 ventes, Framer, Wix). Fiches et verdicts dans `docs/veille/marche/`, comptes dans
  [CE-QUI-VEND.md](marche/CE-QUI-VEND.md).
- Amélioration du tour, le seul levier ≥ 40 % absent de l'usine : la **rubrique Conseils** (5 sites sur 9).
  Champ `conseils` du schéma (articles du client, jamais écrits à sa place), pages `/conseils` et `/conseils/<article>`
  avec `BlogPosting`, lien de nav avant Contact, sitemap ; rien du tout sans article. `src/lib/conseils.ts`,
  `src/pages/conseils/`, `tests/conseils.test.mjs` (7 tests dont un build), brief § 10bis, `/nouveau-site`.
  Prouvé sur un site jetable (build, `ff ia`, a11y, typo verts, captures liste et article regardées), supprimé.

**Appris du marché**
- Ce qui revient partout est simple : plusieurs pages (9/9), une page par service (7/9), avis (7/9), téléphone en
  haut (6/9), l'année de création (6/9), métier + ville dans le titre (5/9). L'usine fait déjà tout ça.
- Les sites d'agence locale sont techniquement faibles (bannières cookies sur le titre, téléphone absent sur mobile,
  image de banque) : ce qui les fait payer, c'est d'être trouvés et appelés, pas le dessin.
- Le modèle le plus « vendeur » (Framer) aligne des preuves vérifiables : licence, assurance, délais chiffrés,
  note avec nombre d'avis. L'usine sait les afficher, à condition que le brief les demande.

**Proposé** : le formulaire client (`outils/brief-form/`) ne pose pas encore la question 10bis ; vérifier si les heros
partagés montrent les labels (44 %) dès le premier écran.

**À décider** : proposer la rubrique Conseils aux clients (un article par mois écrit avec eux = un service récurrent
à facturer ?) ; le badge « depuis 1998 » reste refusé alors que 6 sites sur 9 mettent l'ancienneté en avant (en texte,
l'usine le fait déjà).

## 17 oct 2026 — « concurrent de Framer / Lovable » : la skill s'outille

**Fait**
- `ff aiguillage <slug>` : les réponses du client (photos : en veut / en a / qui les fait ; ambiance : calme /
  vivant) deviennent une décision calculée, écrite en tête du contrat et contrôlée dans `ff verifier` (client
  « calme » = `subtle`, rien qui suit le défilement). Formulaire brief et brief papier posent les mêmes questions.
- `ff pistes <slug>` : les pistes d'un client comparées sur les sept axes (fichiers + film des premiers écrans
  côte à côte, distance d'image à 400 ms). Les trois pistes de la fromagerie : rythme partagé seulement, images
  à 0,61 / 0,65 / 0,17 ; verdict « différentes ».
- `ff demonter <url>` : fiche de démontage automatique d'un site aimé du brief (polices, couleurs, premier écran,
  mouvement, structure, signes IA), rien d'inventé, ~25 s par site. Testée sur Délice et CRISP : voit juste les
  polices, couleurs, portes d'action, horaires, bibliothèques ; rate le canvas WebGL et la barre d'actions
  téléphone ; le geste signature reste à juger sur les captures.
- Skill `/retouche <slug> "<phrase>"` : une phrase du fondateur, plus petite modification à la source, contrôles,
  comparaison pixel, redéploiement, un commit annulable, réponse en trois lignes, lexique des mots du fondateur.
- Gestes 2, 3 et 4 des démontages : `contact.bookingUrl / orderUrl / giftCardUrl` et `actions()` dans les six
  navs, `BarreActions` collée en bas sur téléphone (`layout.actionBar`), composant `Horaires` avec le jour
  courant et l'état ouvert / fermé (sans JS : la liste).
- Process d'hébergement écrit (`studio/decisions/PROCESS-HEBERGEMENT.md`) et fiche client « votre nom de
  domaine » (`studio/commercial/guide-domaine.html`).
- Après-midi, la skill se mécanise : `ff contrat` (forme du contrat avant de construire), `ff prevol` (tous les
  contrôles en une commande et une table), `ff choisir` (la piste retenue devient le site). Premier essai de
  `/retouche` : 32 s par boucle build + vérification + comparaison.
- Les relecteurs sur les pistes A et B de la fromagerie ont trouvé quatre défauts **de l'usine**, corrigés pour
  tous les sites : le bandeau CTA inventait « intervention sous 48 h » ; les ancres `#contact` ne menaient nulle
  part depuis les pages secondaires (ancres absolues + contrôle `ff verifier`) ; les pages service portaient un
  surtitre gris et des coches ; CREDITS.md créditait des photos jamais affichées (avertissement). Leçon : chaque
  constat d'un relecteur qui vient de `src/` devient un contrôle, pas une retouche.
- `ff prevol` sur les trois pistes (2 min par piste) révèle ce que personne n'avait lancé : `perf` (polices 192 Ko
  sur A, 179 Ko sur B : fausse alerte, `ff perf` comptait les sous-ensembles latin-ext que le navigateur ne
  télécharge que si la page contient œ ou Œ ; corrigé, les trois pistes font 102 à 111 Ko),
  `detect` sur A (contraste), et sur B la nav sur mesure en ancres `#cave` mortes depuis la 404. À traiter avec les
  démos ; `ff ia` sait maintenant voir un surtitre au-dessus du h1.
- Après-midi, la skill se mécanise : `ff contrat` (forme du contrat avant de construire), `ff prevol` (tous les
  contrôles en une commande et une table), `ff choisir` (la piste retenue devient le site). Premier essai de
  `/retouche` : 32 s par boucle build + vérification + comparaison.
- Les relecteurs sur les pistes A et B de la fromagerie ont trouvé quatre défauts **de l'usine**, corrigés pour
  tous les sites : le bandeau CTA inventait « intervention sous 48 h » ; les ancres `#contact` ne menaient nulle
  part depuis les pages secondaires (ancres absolues + contrôle `ff verifier`) ; les pages service portaient un
  surtitre gris et des coches ; CREDITS.md créditait des photos jamais affichées (avertissement). Leçon : chaque
  constat d'un relecteur qui vient de `src/` devient un contrôle, pas une retouche.
- `ff prevol` sur la piste A révèle ce que personne n'avait lancé : `detect` (contraste de la craie sur fond
  clair ?) et `perf` (polices 192 Ko > 160 Ko). À traiter avec les démos.
- Geste 5 : `proof.gallery[].place / kind / size / client` (optionnels, jamais devinés), ligne lieu – type –
  mesure – client sous chaque photo de `Proof/gallery`, filtres par type en boutons radio + CSS `:has()` sans
  JS, compteur « N réalisations » à partir de 4 (`src/lib/galerie.ts`, `tests/galerie.test.mjs`). Brief § 8 :
  les quatre données demandées par photo.
- Geste 1 : brief § 10 = huit questions logistiques concrètes (parking, délais, devis payant, paiement, zone,
  contraintes du métier, urgences, avant la venue), réponse du client telle quelle, rien si pas de réponse ;
  mêmes huit champs dans le formulaire client et dans la section 10 du brief Markdown ; `/nouveau-site` en fait
  la FAQ sans inventer.

**Proposé** : `ff demonter` sur une page intérieure ; `/retouche` à l'essai sur une vraie phrase du fondateur ;
la piste A de la fromagerie : budget polices et contraste signalés par `ff prevol` ; relecteurs sur la piste C.

**À décider** : compte Cloudflare F&F ; qui achète le domaine ; dépôt commun ; création de la SAS.

## 16 oct 2026 — veille longue + skill /site-final v3 + premier test

**Fait**
- Démontage systématique de 25 sites récents de petites structures (fiche fixe, captures) :
  `docs/veille/demontages/` ; l'INDEX classe 10 gestes à transposer (portes « Réserver / Commander / Bon cadeau »
  dans la nav, barre d'actions en bas sur téléphone, horaires avec le jour courant, réalisations avec métadonnées…).
- Lecture complète de 15 dépôts de skills de design : `docs/veille/skills-profond-2026-10.md`.
- `/site-final` v3 : contrat de direction, captures validées, 11 passes de regard, deux relecteurs neufs avec barème
  de confiance et grille à plafonds, passes de verdict, seuil « montrer » à 7,5.
- Test de bout en bout sur une démo neuve, `fromagerie-ravanel` : 6,55 → 7,35 → **7,6 (montrer)** en trois tours.
- Le test a fait réparer l'usine : e-mail facultatif, `legal.demo`, `wording.faqTitle`, rayons de `terre`, deux
  faux positifs ; nouvelle commande `ff relecture`.

**Proposé** : les gestes 1 à 5 de l'INDEX des démontages (schéma : `bookingUrl` / `orderUrl` / `giftCardUrl`,
barre d'actions, composant Horaires) ; recapturer `atelier-lecerf` (rayons de `terre` changés) si la démo reste
sur le site du studio.

**À décider** : planifier `/veille` en ligne ; montrer la fromagerie sur le site du studio ou la garder comme
référence interne.

## 15-16 oct 2026 — premier tour (nuit, carte blanche du fondateur)

**Fait**
- `docs/GOUT.md` : la charte de goût, compilée de tous les retours d'octobre (signes IA, démos, mouvement,
  textes, site du studio, façon de travailler) + § 8 règles empruntées aux skills de design.
- Skills : `/site-final <slug>` (une passe jusqu'à « à montrer » : contrôles, relecture adverse par deux
  agents, planche regardée, un seul compte rendu) et `/veille` (ce tour, reproductible).
- `ff planche <slug>` : planche-contact du défilement à la molette, ordinateur et téléphone, dans
  `captures/planches/`. Dans la « définition de fait » de `docs/PROCESS.md`.
- Trois veilles écrites, sources citées : `techniques-2026-10.md` (34 fiches de techniques web, 18 sites réels
  lus dans leur CSS, 8 à implémenter), `outils-2026-10.md` (32 skills locales jugées, 28 règles empruntées,
  sources d'images, 18 polices OFL rares), `redondances.md` (directions, variantes, coquilles, presets, sites,
  polices : 5 actions prioritaires, matrice direction × coquille).
- Polices : 21 polices « par défaut des IA » retirées du registre (`ff studio` et 11 presets les proposaient
  encore) ; 6 nouvelles, OFL, rares : Ancizar Serif, Libre Caslon Condensed, Epunda Slab, Savate, Special
  Gothic, Intel One Mono. 11 presets corrigés.
- Direction `ephemeride` retirée (rejetée le 6 oct, 0 site, 0 preset). 17 directions.
- Numérotation décorative « 01 02 03 » retirée des sections et coquilles communes (process, index, magazine,
  sidebar, split, panneau du burger) ; « X ans d'expérience » calculé remplacé par l'année de création partout.
- `ff composer` : six familles de métiers de plus (automobile, bâtiment, alimentation, commerce, bien-être,
  numérique) ; `proof/logos` enfin proposé quand il y a des logos.
- Techniques implémentées (CSS pur) : FAQ native exclusive et animée (`<details name>`, `::details-content`),
  fondu des bords de marquee (`data-marquee-fade`), bouton ajusté aux capitales (`text-box` sur `.btn`).
- `ff ia` : alertes « effets interdits » (grain, spotlight, reflet, aurora) et « numérotation décorative ».
  `ff verifier` : bloc « règles empruntées » (`transition: all`, `100vh` seul, `user-scalable=no`, « Défilez »,
  flèches décoratives). Faux positifs du site du studio réglés (tuiles décoratives, téléphone de test).
- Deux sites jumeaux séparés par leur typographie (dubois-plomberie, lemaire-avocats).
- Docs : effets interdits marqués dans `ANIMATIONS.md`, moves 24/27 de `references.md` barrés, Safari 26 pour les
  scroll-driven animations.

**Proposé (pas fait, attend un fondateur)**
- Écarter les quatre groupes de directions trop proches par un seul token (`redondances.md` § 1) : touche des
  démos visibles sur le site du studio (chez-malo, studio-ambre).
- Fusions de variantes 44 → 39 (`hero/video`=`fullbleed`, `cards-hover`⊂`bento`, `contact/full`, `marquee-quotes`,
  `nav/split`, `about/timeline`) : des sites d'exemple les utilisent, à faire site par site.
- Techniques suivantes : piste `Proof/piste` (scroll-snap manuel), `data-parallax-native`, subgrid sur
  `Services/grid`, coquille `couverture`, navs en `popover`.
- Sources d'images : Flickr (clé gratuite) en priorité 3 de `ff photos`, Paris Musées en option.
- Dépendances : Astro 7 disponible (nous : 5.18), mineures à jour à faire dans un tour dédié.

**À décider (fondateurs)**
- Les décisions ouvertes du site du studio (prénoms/photo, 72 h et week-end, Essentiel/Complet, pages villes).
- Planifier `/veille` tous les 3 jours dans Claude Code en ligne (droit de pousser sur `main` à donner).

**Prochain volet** : bibliothèque (écarter les directions, fusionner les variantes), puis techniques (piste
manuelle, parallax natif).

Collecte 2026-10-18 : 9 styles (14 démontés sur 23 essayés ; navigateur Playwright 1194 relié à la version attendue, `FF_CHROMIUM=1`).

Collecte 2026-10-19 : 10 styles (16 démontés sur 31 essayés ; Awwwards/land-book bloqués, sites choisis à la main ; navigateur Playwright 1243 relié à la version 1194 par lien, `FF_CHROMIUM=1` ; 6 fiches trop maigres écartées : cosmos, monopo, nobu, casalupo, chateaumarmont, borgobrufa ; 10 atomes valides, champs non mesurés laissés « à juger »).
- Collecte 2026-10-20 : 22 styles (atomes mesurés ; 12 sites refusés par le réseau ou bloquant les navigateurs sans tête : farmgirlflowers, bluebottle, sezane, sanjosehotel, bakerandspice, vitra, atelierdeschefs, cabanes-lesbains, andtheregoes, leclairieur, maisonmargiela, maisonsimons, mariagefreres).
- Collecte 2026-10-21 : 20 styles (atomes mesurés ; svenskttenn refusé par le réseau (429) ; navigateur Playwright 1243 relié à la version 1194 par lien, `FF_CHROMIUM=1` ; mouvement, premier écran et traitement des photos laissés « à juger » quand non mesurés).
