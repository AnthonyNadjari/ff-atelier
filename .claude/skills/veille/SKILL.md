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

`docs/GOUT.md`, `CLAUDE.md`, les trois derniers journaux (`docs/veille/journal.md`), et les fichiers
de veille existants pour **ne pas répéter** : `techniques-2026-10.md`, `outils-2026-10.md`,
`redondances.md`, `references.md` § 5, `tendances.md`, `signes-ia.md`.

## 1. Santé (toujours)

```
F=($(ls tests/*.test.mjs)); node --test --test-concurrency=1 "${F[@]:0:13}" ; "${F[@]:13:13}" ; "${F[@]:26:30}"
node scripts/ff.mjs variete
node scripts/ff.mjs signatures
npm outdated   # lecture seule : on note, on ne met pas à jour sans tour dédié
```
Puis un site d'exemple au hasard (pas finck-fisch) : build, `verifier`, `ia`, `planche` regardée.
Tout rouge se corrige dans ce tour (c'est prioritaire sur le reste).

## 2. Apprendre (agents de lecture seule, 2 en parallèle au plus)

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

Format des fiches : voir en tête de chaque fichier. Sources citées en lien. Verdicts nets.

## 3. Améliorer (une par tour, testée)

Prendre le premier point de « à implémenter en premier » du volet du jour qui n'est pas encore fait :
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

Planifiée tous les 3 jours dans Claude Code en ligne (le repo est privé : la session en ligne doit
avoir le droit de pousser sur `main`). Prompt de la routine : « /veille ». Si la planification n'est
pas disponible sur le compte, le fondateur lance `/veille` à la main ; le journal note la date du
dernier tour pour qu'on voie le retard.
