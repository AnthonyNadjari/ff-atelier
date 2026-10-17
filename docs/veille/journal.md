# Journal de veille

Une entrée par tour de `/veille` (skill `.claude/skills/veille/SKILL.md`), la plus récente en tête :
fait / proposé / à décider / prochain volet. Le fondateur lit ce fichier (ou l'onglet Notes du doc
partagé) pour savoir où en est l'usine sans relire une conversation.

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
