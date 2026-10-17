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
npm outdated   # lecture seule : on note, on ne met pas à jour sans tour dédié
```
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

D'abord le levier du marché (2a) s'il y en a un au-dessus de 40 % et absent de l'usine. Sinon, le premier point
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

Active depuis le 17 oct 2026 : routine Claude Code en ligne « Veille ff-atelier », tous les 3 jours à 4 h (Paris),
https://claude.ai/code/routines (le fondateur la met en pause ou la supprime là). La session en ligne n'a ni le PC
du fondateur, ni sa mémoire locale, ni forcément Chrome : si `playwright-core` ne trouve pas Chrome, essayer
`npx -y playwright install chromium` puis `FF_CHROMIUM=1` devant chaque commande (Chromium au lieu du Chrome installé) ; sinon, démonter sur le code (2a) et sauter
les étapes avec navigateur en le notant au journal. Elle pousse sur `main` ; si le push est refusé, elle pousse
une branche `veille/<date>` et le journal le dit. Le fondateur peut aussi lancer `/veille` à la main.
