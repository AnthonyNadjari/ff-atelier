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
La veille ne touche à aucun site : chaque paire trop proche se **signale** (journal du tour et Notes du doc
partagé : les deux sites, le score, la phrase « ce qui est pareil »), elle ne se corrige pas ici.
Puis un site d'exemple au hasard (pas finck-fisch) : build, `verifier`, `ia`, `planche` regardée.
Tout rouge se corrige dans ce tour (c'est prioritaire sur le reste), sauf `ressemblance` qui se signale.

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

### 2a quater. Les STYLES, À CHAQUE TOUR, en volume (le volet qui compte le plus)

Le fondateur, 18 oct 2026 : « ce n'est pas juste une question de disposition, mais de design. Pourquoi tu ne
scrapes pas des dizaines et des centaines de sites pour connaître les techniques, les styles, et qu'on les applique
juste à des clients ? ». Jusque-là l'usine étudiait peu de sites (une cinquantaine) et INVENTAIT le design de chaque
client : le goût de la machine revenait partout. Désormais on **applique** des styles réels, on n'en invente plus.

Par tour, **10 styles nouveaux** tirés de 10 vrais sites jamais étudiés (galeries : Awwwards, godly.website,
siteinspire, minimal.gallery, onepagelove, Framer Marketplace, Webflow showcase ; tous métiers, petites structures de
préférence, faits par des humains, qui donnent envie) :
1. `node scripts/ff.mjs demonter <url> --dossier docs/veille/styles --nom <id>` (ou sur le code si pas de navigateur).
2. Fiche `docs/veille/styles/<id>.md` : le STYLE COMPLET, assez précis pour le réappliquer : polices (familles,
   graisses, tailles h1/h2/texte au téléphone et à l'ordinateur, interlignage, casse), couleurs en hex avec leur rôle,
   espacements, rayons, bordures, ombres, traitement des photos, boutons et liens, icônes, animations (quoi, durées,
   courbes), textures ; plus son architecture (pages, navigation, ordre des blocs, contact). Captures à côté.
3. Le site devient des **ATOMES** (18 oct 2026, fondateur : « faut faire des cross ») :
   `node scripts/ff.mjs atomes mesurer <url> --id <id> --fiche docs/veille/styles/<id>.md --nom "<Nom>"` relève
   typo, couleurs, marges, rayons, boutons, photos, transitions et écrit le brouillon `docs/veille/styles/atomes/<id>.json` ;
   on remplit ses « à juger » en regardant les captures (police libre la plus proche, jamais IA ; palette ; traitement
   des photos ; régime du mouvement ; famille de premier écran ; une `remarque` par choix), puis `ff atomes` vert.
   Format et règles : `docs/veille/styles/ATOMES.md`. C'est ce qui sert le plus : chaque site ajouté multiplie les
   croisements de `ff melanger`. Une **direction entière** reste possible quand le style tient d'un bloc
   (`/nouvelle-direction` : `src/directions/<id>/`, polices libres les plus proches, jamais IA ; `meta.ts` avec la
   source) ; `ff melanger <slug> --style <id>` applique déjà tous les atomes d'un site sans direction écrite à la main.
   Son architecture devient une entrée de `docs/veille/architectures/` si elle est nouvelle.
3 bis. Après 5 sites ajoutés : `node scripts/ff.mjs melanger _exemple --n 3 --hasard --essai` et regarder la planche ;
   un mélange laid devient une **règle de compatibilité apprise** (ATOMES.md § Règles apprises, et la fonction pure de
   `scripts/ff/melanger.mjs` avec son test), jamais un atome retiré en silence.
4. Preuve : `_exemple` habillé du style (FF_LOOK), capture posée à côté de la source ; on ne garde que ce qui tient
   la comparaison.
5. Une ligne dans `docs/veille/styles/INDEX.md` : id, source, style en une phrase, architecture, convient à quels
   clients (selon leurs données : photos, produits, lieu, urgence) ; la colonne « Direction » dit `atomes` quand le
   site n'existe qu'en atomes.

Ce volet passe AVANT tous les autres. Un tour qui n'ajoute pas au moins 5 styles gardés est un tour raté (le
journal dit pourquoi).

**Mouvement, à chaque tour aussi** (18 oct 2026, fondateur : « plus de pluralité : animations, même des vidéos en
fond » ; « le catalogue doit s'agrandir avec les veilles »). Parmi les sites étudiés, **au moins 2 profils de
mouvement nouveaux** par tour (entrée du premier écran, apparition au défilement, survol, transitions de page, fond
vidéo ou séquence d'images, défilement horizontal, texte qui se remplit…) : une entrée dans
`docs/veille/styles/MOUVEMENTS.md` (ce qu'il fait, durées et courbes mesurées, attributs du moteur qui le réalisent
ou ce qui manque, quand il convient selon l'aiguillage, poids) et l'atome `mouvement` correspondant pour
`ff melanger`. Si le moteur ne sait pas le faire et que c'est simple : l'ajouter à `src/scripts/motion.ts` avec son
test et sa ligne dans `docs/ANIMATIONS.md`, preuve sur `sites/_effets/`. Un profil qui ne tient pas sur iPhone
(autoplay bloqué en économie d'énergie, saccades) n'entre pas. Fond vidéo : seulement avec la vraie vidéo du client
ou `ff animer`/`ff sequence-photo` sur ses photos, poster obligatoire.

### 2a ter. Les architectures, À CHAQUE TOUR (ce qui rend les sites différents)

Le fondateur, 18 oct 2026 : « il y a une infinité de sites internet différents, chacun pourrait représenter une
catégorie, tu aurais des dizaines de catégories et tu pourrais juste les reprendre ». Par tour, **2 architectures
nouvelles** de sites ENTIERS (nombre de pages, navigation, ordre des blocs, place du contact, téléphone), tirées de
vrais sites dont l'architecture n'est pas encore dans `docs/veille/architectures/INDEX.md`, tous métiers confondus :
fiche `docs/veille/architectures/<id>.md` (méthode et format : voir les fiches existantes), puis implémentation dans
l'usine (coquille `src/shells/`, sections manquantes, entrée dans le registre des architectures), preuve sur un
site jetable comparé à la source en page entière, `ff ressemblance` vert contre tous les sites. Ce volet passe
AVANT les compositions (2a bis) : des sections nouvelles dans un même déroulé ne rendent pas les sites différents.

### 2a bis. Les compositions, À CHAQUE TOUR (ce qui rend un site beau)

Le fondateur, 17 oct 2026, sur une démo juste mais plate : « trop 2D, pas beau » ; et : « je vois pas pourquoi
on peut pas faire pareil [que les modèles Framer] si tu scrapes des centaines de sites ». Mesurer des sites
(polices, couleurs, leviers) ne rend pas beau : la beauté est dans la composition. Ce volet **recrée des
compositions** de ce qui se fait de mieux, section par section, à partir de captures, dans la bibliothèque.

Par tour, **3 sections nouvelles** :
1. Sources, en tournant : les modèles les plus vendus ou les mieux notés (Framer Marketplace trié par popularité,
   puis Webflow, puis Squarespace, puis les sites primés de petits commerces) ; jamais une source déjà dans
   `docs/veille/compositions/INDEX.md`. Les sites que le fondateur dit aimer passent en premier.
2. Capturer la page (`node scripts/ff.mjs demonter <url> --dossier docs/veille/compositions`), choisir les sections
   qui ont de la profondeur (image en grand, plans superposés, rythme), de préférence d'un type où la bibliothèque est
   pauvre (`docs/DIRECTIONS.md`, `ff variete`).
3. Recréer chaque section comme **variante partagée** (`/nouvelle-variante` : fichier dans `src/sections/<Type>/`,
   `VARIANTS`, ligne de `docs/DIRECTIONS.md`, test) : même construction, mêmes proportions, même profondeur, mêmes
   rapports de taille ; contenu tiré de `site` (rien d'inventé, la section disparaît si la donnée manque), tokens
   seulement, aucune police de la liste IA, aucun signe de GOUT § 2. **On reprend une construction, jamais les
   textes, les images, le code, le nom ou l'identité visuelle de la source.**
4. Prouver : site jetable (copie de `_exemple`) qui utilise les 3 variantes, `ff prevol`, captures téléphone et
   ordinateur posées À CÔTÉ de la capture de la source (`docs/veille/compositions/<nom>-comparaison.jpg`), regardées :
   la recréation tient-elle la comparaison ? Sinon on la reprend ou on ne la garde pas.
5. Une ligne par variante dans `docs/veille/compositions/INDEX.md` : source (URL), section, variante créée, ce qui
   a été gardé, ce qui s'est perdu.

Ces variantes deviennent le choix par défaut de `ff composer` quand elles conviennent aux données du site (photos
présentes, nombre de services…) : la bibliothèque se remplit de compositions éprouvées au lieu de dessins de l'usine.

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

Les styles (2a quater) sont l'amélioration du tour ; puis les architectures (2a ter) ; les compositions (2a bis) si le temps le permet. En plus, si le temps le permet : le levier du marché (2a)
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

## 5. Journal et sauvegarde

- `docs/veille/journal.md` : en tête, une entrée datée de 10-20 lignes : fait / proposé / à décider /
  prochain volet. Toujours un lien vers les fichiers modifiés.
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
