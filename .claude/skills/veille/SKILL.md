---
name: veille
description: Tour d'entretien et d'apprentissage de l'usine, à lancer à la main ou en routine (tous les 3 jours) - techniques web, sites de référence, skills, sources d'images, polices, santé des tests, redondances de la bibliothèque. Produit une amélioration concrète testée par tour et un journal, sans jamais toucher au site du studio ni à un site client.
---

# veille

Ce que le fondateur a demandé (14 oct 2026) : « un truc qui tourne en continu, tous les X jours ou
manuellement, pour que Claude peaufine, apprenne des designs, sources d'images, etc. Pas sectoriser
par métier : parser des techniques, des sites, d'autres skills, éviter la redondance. »

Utilisation : `/veille` (tour complet, ~1 h), `/veille rapide` (santé + journal, 15 min),
`/veille techniques` / `/veille outils` / `/veille bibliotheque` (un seul volet).

Contraintes : jamais plus de 2-3 agents à la fois ; un seul navigateur à la fois (PC à 2 Go de RAM
libre) ; rien ne tourne sur le PC du fondateur en continu (une routine tourne dans Claude Code en
ligne) ; une seule branche `main` ; jamais de donnée inventée ; jamais afficher `.env`.

## Garde-fous (non négociables)

- **Jamais** `sites/finck-fisch` ni un site client (`sites-en-ligne.json`) sans un fondateur. Les
  démos (`demo-*`, sites marqués `// DEMO`) peuvent être retouchées si `ff ia`/`ff verifier` restent verts.
- **Jamais** `ff deploy` / `ff vercel` / `ff domaine` depuis la veille.
- Ne part sur `main` que ce qui est vert : `npm test` (ou les 3 blocs `node --test`), `ff verifier` sur
  tout site touché. Le reste reste en proposition dans le journal.
- Chaque fichier de veille cite ses sources (lien lu) ; une affirmation sans source est retirée.
- Une seule « grosse » amélioration par tour. Mieux vaut une variante testée que cinq idées.

## 0. Lire

`docs/GOUT.md`, `CLAUDE.md`, les trois derniers journaux (`docs/veille/journal.md`), `docs/veille/marche/CE-QUI-VEND.md`
(la synthèse du marché, ce qui fait signer un artisan), et les fichiers de veille existants pour **ne pas répéter** : `techniques-2026-10.md`, `outils-2026-10.md`,
`redondances.md`, `references.md` § 5, `tendances.md`, `signes-ia.md`.

## 1. Santé (toujours)

```
F=($(ls tests/*.test.mjs)); for r in "0 15" "15 15" "30 15" "45 40"; do set -- $r; node --test --test-concurrency=1 "${F[@]:$1:$2}"; done
node scripts/ff.mjs variete
node scripts/ff.mjs signatures
node scripts/ff.mjs ressemblance --tous   # sans Chrome ni dist : --registre --tous
npm outdated   # lecture seule : on note, on ne met pas à jour sans tour dédié
```
`ff ressemblance --tous` recalcule l'empreinte du premier écran (téléphone et ordinateur) de chaque site construit,
met à jour `docs/empreintes/` et liste les paires de sites trop proches par la mise en page, avec ce qui est pareil.
Chaque paire trop proche se signale (journal du tour : les deux sites, le score, la phrase « ce qui est pareil »), et **une
paire par tour se corrige** quand l'un des deux est une démo (`demo-*`, `// DEMO`) : on reconstruit sa page d'accueil d'après
un site de référence entier (§ 2a quater, même méthode), jusqu'à passer sous 0,65 ; `ff verifier` et `ff ia` verts. Un site
client ou prospect ne se touche jamais ici : on écrit au journal ce qu'il faudrait refaire. Le 29 oct 2026, 263 paires étaient
signalées depuis des jours sans qu'aucune ne soit corrigée : signaler sans corriger ne sert à rien.
Puis un site d'exemple au hasard (pas finck-fisch) : build, `verifier`, `ia`, `planche` regardée.
Tout rouge se corrige dans ce tour (c'est prioritaire sur le reste).

## 2. Apprendre (agents de lecture seule, 2 en parallèle au plus)

### 2a. Le marché, À CHAQUE TOUR (le volet qui compte le plus)

Le fondateur, 17 oct 2026 : les démos « ne feraient pas acheter », « c'est toujours la même chose », « est-ce que
tu as scrappé assez de sites qui marchent ? ». Les 25 démontages d'octobre venaient surtout d'Awwwards : des sites
qui plaisent aux designers. Ce volet étudie **ce qui fait signer un artisan**, tous métiers confondus (jamais
métier par métier : on tire au hasard, on cherche ce qui revient partout).

Par tour, **9 sites qui vendent**, trois de chaque source, jamais déjà dans `docs/veille/marche/` (grep l'URL) :
1. **Agences qui ont des clients artisans** : portfolios d'agences web françaises de petite taille (recherche
   « création site artisan » + une ville tirée au hasard parmi les 30 plus grandes de France ; on ouvre la page
   réalisations d'une agence, on prend 1 site client récent).
2. **Classés sur Google** : une recherche locale « <métier> <ville> » avec un métier tiré au hasard dans
   `docs/OBJECTIF.md` et une ville tirée au hasard ; le premier site d'artisan indépendant des résultats (pas
   un annuaire, pas une plateforme, pas une franchise nationale).
3. **Modèles qui se vendent** : les modèles les plus populaires des places de marché (Framer Marketplace trié par
   popularité, Squarespace et Wix catégories services locaux, ThemeForest « local business » trié par ventes).

Pour chacun : `node scripts/ff.mjs demonter <url> --dossier docs/veille/marche` (sans navigateur disponible :
récupérer le HTML et le CSS, et remplir la fiche à la main avec le même format, en écrivant « mesuré sur le code,
pas sur capture »). Puis juger, dans la fiche, avec **la seule question du fondateur** : « un artisan paierait-il
1 200 € pour ça, et pourquoi ? » ; et noter les **leviers de vente** vus : photos réelles (combien, de quoi),
premier écran (quoi / où / téléphone), preuves (avis, années, réalisations chiffrées, labels), structure (une page
ou plusieurs, où est le contact), appels à l'action (combien, lesquels), vitesse, mobile.

Ensuite, mettre à jour `docs/veille/marche/CE-QUI-VEND.md` : un tableau des leviers avec **le compte** (« photo
du gérant au premier écran : 7 sites sur 27 »), les sites qui l'illustrent, et ce que l'usine fait ou ne fait pas
encore. Un levier vu sur au moins 40 % des sites et absent de l'usine devient le premier point « à implémenter »
du tour (étape 3), avant tout autre volet. On ne copie jamais une maquette : on transpose un levier.

### 2a quater. Les STYLES : des sites ENTIERS, construits, pas des polices (réécrit le 29 oct 2026)

Le fondateur, 18 oct 2026 : « pourquoi tu ne scrapes pas des centaines de sites pour connaître les styles, et qu'on les
applique juste aux clients ? ». Puis, 29 oct 2026, devant la démo brasserie : « C'est normal que ça soit si monotone ? Toujours
la même disposition ? », « on a encore des sites si génériques alors qu'on scrape les meilleurs sites ». Diagnostic, mesuré ce
jour-là : en onze jours l'usine a relevé 425 sites et n'en a appliqué que la **peinture** (polices, couleurs, marges, rayons) ;
la **construction** (où est la photo, à quelle taille, ce qui chevauche quoi, le rythme des blocs, le geste signature) restait
une phrase dans une fiche, « à faire dans une section sur mesure », jamais faite. `ff atomes` : « architecture 0 » tirable.
Mélangés sept par sept, les atomes donnaient une moyenne ; posés sur toujours les mêmes sections (listes, grilles), ils
donnaient le même squelette repeint. C'est un studio qui vend des sites à 1 200 € : un style qui ne change que les couleurs ne
vaut rien au client.

**Scanner large, garder peu, être strict** (31 oct 2026, le fondateur : « je préfère scanner beaucoup plus de sites par jour
et en sélectionner moins, mais être plus strict et avoir des trucs vraiment différents » ; et devant `dune` : « la
disposition très linéaire, est-ce que c'est pas un peu similaire ? »). Le tour 19 avait construit 10 styles et en gardait 5,
dont 4 « de justesse », presque tous en blocs empilés l'un sous l'autre : une manie de l'usine, pas un choix.

**Un style = un site entier, et il n'est « gardé » que construit.** Par tour, **40 candidats au moins scannés**, puis **3
sites au plus** construits, chacun poussé jusqu'au bout :

0. **Scanner** : `node scripts/ff.mjs tri --fichier <liste>` sur 40 URL ou plus (galeries ci-dessous, sites du marché,
   catégories et métiers variés ; une liste par tour dans `docs/veille/styles/tri/`). `ff tri` mesure chaque site en ligne
   (premier écran, déroulé, disposition des blocs, linéarité), le compare à toute l'usine et à toutes les sources déjà
   triées, et le refuse s'il est linéaire (blocs empilés) ou trop proche de ce qu'on a. On ne regarde à l'œil que ses
   meilleurs. Un tour qui scanne moins de 40 candidats le dit au journal, avec la raison.
1. **Choisir** parmi les meilleurs du tri : petites structures, faites par des humains ; jamais déjà dans
   `docs/veille/styles/INDEX.md`. Priorité à ce que l'usine ne sait pas encore faire (une disposition absente : grille
   éclatée, colonne fixe, piste, chevauchement, page-menu), puis aux régimes de palette en besoin (`ff atomes`) et aux
   métiers de `docs/OBJECTIF.md`. Question de tri : « un artisan paierait-il 1 200 € pour ÇA, et est-ce que ça ne
   ressemble à RIEN de ce que l'usine fait déjà ? » ; sinon on passe.
2. **Relever la construction, pas seulement la peinture** : `ff demonter` + `ff atomes mesurer` comme avant, PUIS, en
   regardant les captures (outil Read, obligatoire), une section « ## Construction » dans la fiche `<id>.md` : pour chaque
   bloc de l'accueil, dans l'ordre, sa grille (colonnes, part de l'écran), la part et la place de l'image (plein cadre,
   décalée, qui chevauche, verticale), ce qui est posé sur quoi (carte, plaque, voile, ombre réelle), l'échelle du titre
   par rapport au texte, le vide autour, et le geste signature décrit assez précisément pour être codé. Une fiche sans
   « Construction » n'est pas une fiche.
3. **Construire dans l'usine** ce que le relevé décrit : le premier écran (variante `src/sections/Hero/<id>.astro` ou
   famille de `premiers-ecrans.md` existante quand elle correspond vraiment) et le geste signature (section partagée
   `src/sections/<Type>/<id>.astro` ou coquille), enregistrés dans `VARIANTS`/`SHELLS`, documentés dans
   `docs/DIRECTIONS.md`, testés ; la direction entière `src/directions/<id>/` (polices libres, jamais de la liste IA) ;
   et un **modèle de site entier** `presets/<id>.json` qui pose tout d'un coup (direction, hero, ordre des sections,
   mouvement), appliqué par `ff modele <slug> <id>` (il existe déjà : il copie le modèle dans `look.json`). Le croisement
   d'atomes (`ff melanger`) ne se fait plus que sur demande explicite (`--typo`, `--couleurs`… ou `--hasard`), jamais par
   défaut : sans rien, la commande liste les styles qui ont un modèle entier. Depuis le 29 oct 2026 (soir), `--style <id>`
   lit `presets/<id>.json` quand il existe et l'applique en entier (direction, coquille, hero, sections, mouvement) ;
   sans modèle, atomes seuls et hero de famille, en le disant.
4. **Prouver avec des photos**, côte à côte avec la source : site jetable (copie de `_exemple`), `ff photos-demo` pour
   avoir de vraies photos d'illustration (jamais une démo sans photo : « ce qui fait vraiment la différence, c'est les
   photos », GOUT § 0), `ff melanger … --style <id>`, `ff apercu-rapide`, et l'image source à côté. Un agent neuf (lecture
   seule, captures + GOUT § 0, et les captures des trois styles de l'usine les plus proches) répond en une ligne : « tient
   la comparaison / ne la tient pas, parce que », et « différent de l'usine / ressemble à <id> ». **« De justesse » ne
   compte pas comme gardé** (31 oct 2026) : on reprend ou on ne garde pas. Puis `ff verifier`, `ff ia`,
   `ff ressemblance <jetable>` < 0,65 contre tous les sites, linéarité sous le seuil de `ff tri`.
   Les captures de l'essai se prennent avant de supprimer le jetable.
5. **Une ligne dans `docs/veille/styles/INDEX.md`** : id, source, construction en une phrase (pas la palette), ce qui est
   codé (hero, section, coquille, modèle), convient à quels clients. La colonne « Direction » dit `atomes` seulement pour
   un relevé partiel, qui ne compte pas comme style gardé.

**Un tour qui ne garde pas au moins 2 styles construits, franchement tenus et différents de l'usine, est un tour raté** (le
journal dit pourquoi). Deux styles vraiment différents valent mieux que cinq gardés de justesse ; dix fiches de polices ne
valent pas un style construit. Le journal donne aussi le chiffre « style maison » de `ff ressemblance --tous` (linéarité
moyenne de l'usine) avant et après le tour : il doit baisser. Le journal donne, par style : la source, ce qui a été codé, l'image de comparaison.

**Équilibrer les régimes de palette** (21 oct 2026 : trois pistes de L'Épi d'Or tiraient trois palettes blanc / gris /
noir). Chaque palette tombe dans un régime (`regimePalette`, ATOMES.md § Régimes de palette) : clair neutre, clair teinté
doux, sombre, coloré doux. `ff atomes` affiche le compte et les besoins ; la collecte commence par les régimes en besoin,
dans la garde de beauté. Le journal donne le compte avant et après.

**Mouvement, à chaque tour aussi** (18 oct 2026 : « plus de pluralité : animations, même des vidéos en fond »). Parmi les
sites construits, **au moins 1 profil de mouvement nouveau** par tour, dans `docs/veille/styles/MOUVEMENTS.md` (durées,
courbes, attributs du moteur ou ce qui manque, quand il convient, poids) et **codé** dans la section ou le hero du style
(un profil « manque : à faire dans une section sur mesure » n'est pas un profil). Un profil qui ne tient pas sur iPhone
n'entre pas. Fond vidéo : seulement avec la vraie vidéo du client ou `ff animer`/`ff sequence-photo`, poster obligatoire.

### 2a ter. Les architectures, À CHAQUE TOUR (ce qui rend les sites différents)

Le fondateur, 18 oct 2026 : « il y a une infinité de sites internet différents, chacun pourrait représenter une
catégorie, tu aurais des dizaines de catégories et tu pourrais juste les reprendre ». Par tour, **2 architectures
nouvelles** de sites ENTIERS (nombre de pages, navigation, ordre des blocs, place du contact, téléphone), tirées de
vrais sites dont l'architecture n'est pas encore dans `docs/veille/architectures/INDEX.md`, tous métiers confondus :
fiche `docs/veille/architectures/<id>.md` (méthode et format : voir les fiches existantes), puis implémentation dans
l'usine (coquille `src/shells/`, sections manquantes, entrée dans le registre des architectures), preuve sur un
site jetable comparé à la source en page entière, `ff ressemblance` vert contre tous les sites. Ce volet passe
AVANT les compositions (2a bis) : des sections nouvelles dans un même déroulé ne rendent pas les sites différents.

**Une fiche n'est « gardée » que codée dans l'usine le même tour** (21 oct 2026 : `ff melanger` tirait des
architectures de la veille que l'usine ne savait pas construire, et l'essai gardait le déroulé du site) : entrée dans
le registre `src/lib/architectures.ts` + coquille `src/shells/` qui existe + preuve (site jetable comparé à la source,
`ff ressemblance` vert). Sinon elle reste « à coder » dans `INDEX.md` et le tour suivant **commence par elle**, avant
toute fiche nouvelle. `ff melanger` ne tire que les architectures du registre dont la coquille existe et dont le client
a les données ; il liste les autres (« au registre de veille, pas encore codées »).

### 2a bis. Les compositions (fusionné dans 2a quater le 29 oct 2026)

Ce volet recréait des sections entières d'après les meilleurs sites ; il était « si le temps le permet » et n'a jamais tourné
(tours 13 à 15). Il est désormais l'étape 3 de 2a quater, obligatoire : un style n'est gardé que si sa construction est codée.
`docs/veille/compositions/INDEX.md` reste le registre des sections recréées (source, section, variante, ce qui est gardé et
perdu) : une ligne par section construite au titre d'un style.

### 2b. Un autre volet, si le temps le permet

Par tour, choisir **un** volet principal (tourner : techniques → outils → bibliothèque → techniques…) :

- **techniques** : galeries et blogs techniques (liste dans `docs/veille/tendances.md` § 1 et
  `techniques-2026-10.md` en tête), 10-15 sites réels lus dans leur HTML/CSS. Fiches courtes
  (nom, où vu, comment dans notre moteur, coût, risque IA, iPhone). Ajouter à `techniques-<année>-<mois>.md`,
  jamais une fiche déjà présente (grep du nom avant).
- **outils** : skills Claude Code locales (`~/.claude/skills`) et publiques, plugins, sources d'images
  (API, licence, qualité), polices nouvelles (OFL, rares, hors `CLES_IA`), versions des dépendances.
  Ajouter à `outils-<année>-<mois>.md`.
- **bibliothèque** : redondances entre directions/variantes/presets/sites d'exemple (palette proche,
  même squelette, même police), trous (un métier sans direction, une variante jamais choisie par
  `composer`), ce que `composer` ne sait pas faire. Mettre à jour `redondances.md`.

Un Chrome à la fois.

Format des fiches : voir en tête de chaque fichier. Sources citées en lien. Verdicts nets.

## 3. Améliorer (une par tour, testée)

Les styles construits (2a quater) sont l'amélioration du tour ; puis les architectures (2a ter) ; puis la paire de démos trop proches (§ 1). En plus, si le temps le permet : le levier du marché (2a)
s'il y en a un au-dessus de 40 % et absent de l'usine. Sinon, le premier point
de « à implémenter en premier » du volet du jour qui n'est pas encore fait :
- nouvelle variante → `/nouvelle-variante` (fichier + `VARIANTS` + `docs/DIRECTIONS.md` + test) ;
- nouvelle direction → `/nouvelle-direction` ;
- nouvelle police → registre + `ff ia` toujours vert ;
- nouvelle source d'images → `scripts/ff/photos.mjs` + `CREDITS.md` + test ;
- règle de goût apprise d'une skill → `docs/GOUT.md` + si possible un check dans `ff verifier`/`ff ia`
  avec son test.
Prouver : build d'un site jetable (`ff nouveau _test-veille-<x>` ou `ff matrice --rapide`), `ff ia`,
`ff verifier`, `ff planche` regardée, capture dans le journal. Supprimer le site jetable après.

## 4. Nettoyer (si temps)

Fusionner un doublon trouvé en 2 (direction ou variante), retirer un preset jamais utilisé, mettre
une doc à jour, un commentaire périmé. Petits commits.

## 4 bis. L'aperçu du meilleur (À CHAQUE TOUR, avant le journal)

Le fondateur, 27 oct 2026 : « avoir un aperçu du meilleur truc de la veille à chaque fois ». Le journal dit tout en mots ;
lui juge en voyant. Chaque tour se termine donc par **une image** : la trouvaille du tour qu'on lui montrerait s'il n'en
voyait qu'une.

1. **Choisir UNE chose**, la plus utile à un futur client parmi ce qui a été gardé ce tour (une architecture codée, un style
   gardé, un profil de mouvement, un levier du marché implémenté). Critère : « laquelle ferait signer un artisan ? », pas
   la plus originale. Dire en une phrase pourquoi elle, dans le journal.
2. **Assembler l'image** à partir des captures déjà faites dans le tour (aucune capture nouvelle n'est obligatoire, rien
   n'est inventé) : la source, puis ce que l'usine en fait au téléphone (et à l'ordinateur si ça aide) :
   `node scripts/ff.mjs apercu --date <AAAA-MM-JJ> --titre "<la chose en mots simples>" --phrase "<ce qu'elle fait, pour
   quel client, la source>" "Source : <domaine>=<capture source>" "Dans l'usine=<capture de l'essai>" [...]`.
   Sortie `docs/veille/apercus/<date>.jpg` (versionnée). Les captures des sites jetables se prennent AVANT de les supprimer.
   Un style se montre avec la planche `ff melanger … --style <id> --essai` à côté de la capture de la source.
3. **La regarder** (outil Read) : lisible sur un téléphone, rien de coupé au mauvais endroit, aucune donnée de test mise en
   avant comme vraie (sinon le libellé dit « essai »). Sinon la refaire.
4. **L'envoyer** au fondateur en fin de tour : `SendUserFile` (status `proactive`, display `render`) avec une légende d'une
   ligne, et la même phrase en tête de la notification (`PushNotification`) ; lien vers l'image dans l'entrée du journal
   et dans les Notes du doc partagé.

## 5. Journal et sauvegarde

- `docs/veille/journal.md` : en tête, une entrée datée de 10-20 lignes : **le meilleur du tour** (une phrase et le lien
  vers `apercus/<date>.jpg`), fait / proposé / à décider / prochain volet. Toujours un lien vers les fichiers modifiés.
- Le doc partagé « Finck & Fisch » (Claude Docs, id `f663772e-bd93-4326-b5e6-ca4f48fdb44f`), onglet
  Notes : les 5 lignes qui comptent pour les fondateurs (ce qui a changé, ce qu'ils doivent décider).
- Mémoire de session (`ff-atelier-repo.md`) : une ligne.
- `git add -A && git commit` (message : « Veille <date> : <l'amélioration du tour> ») puis
  `git push origin main`.

## Routine

Active depuis le 17 oct 2026 : routine Claude Code en ligne « Veille ff-atelier », TOUS LES JOURS à 4 h (Paris) depuis le 18 oct,
https://claude.ai/code/routines (le fondateur la met en pause ou la supprime là). La session en ligne n'a ni le PC
du fondateur, ni sa mémoire locale, ni forcément Chrome : si `playwright-core` ne trouve pas Chrome, essayer
`npx -y playwright install chromium` puis `FF_CHROMIUM=1` devant chaque commande (Chromium au lieu du Chrome installé) ; sinon, démonter sur le code (2a) et sauter
les étapes avec navigateur en le notant au journal. Elle pousse sur `main` ; si le push est refusé, elle pousse
une branche `veille/<date>` et le journal le dit. Le fondateur peut aussi lancer `/veille` à la main.
