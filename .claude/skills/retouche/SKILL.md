---
name: retouche
description: Applique une phrase du fondateur ou du client (« téléphone en haut », « le titre est trop long », « enlève la section tarifs », « plus calme ») à un site déjà montré, en une passe - la plus petite modification à la source, contrôles, comparaison avant/après, redéploiement, un commit par retouche (annulable), réponse en trois lignes. Jamais de donnée inventée, jamais de question en retour quand la phrase suffit.
---

# retouche

Pourquoi : après `/site-final`, le fondateur regarde et dit des phrases courtes, souvent depuis son téléphone.
Framer et Lovable gagnent là : on tape une phrase, la page change, on voit. Ici, la même phrase doit donner
le même résultat sans ouvrir un fichier, sans casser ce qui marchait, et en restant dans la charte
(`docs/GOUT.md`). Une retouche = un commit, donc « annule la dernière » existe.

Utilisation : `/retouche <slug> "<phrase>"`, ou plusieurs phrases séparées par ` ; ` (une seule passe de
build pour toutes), ou `/retouche <slug> annule` (dernière retouche), ou `/retouche <slug> annule 3`.

Règles d'or :
- **Aucune question en retour** si la phrase se comprend d'une seule façon. Si elle en a deux, on applique
  la plus probable, et la réponse dit l'autre en une ligne (« j'ai mis le téléphone dans la barre du haut ;
  pour la barre du bas, dites "téléphone en bas" »).
- **La plus petite modification possible, à la source** : `site.config.ts`, `look.json`, une section de
  `sites/<slug>/sections/`, `direction.md`. Jamais `dist/`, jamais `src/` partagé pour une demande d'un seul
  site (une demande qui révèle un manque de la bibliothèque va dans `docs/veille/journal.md`, pas dans un
  correctif local du moteur).
- **Jamais de donnée inventée.** « Ajoute des avis », « mets 15 ans d'expérience », « ajoute une photo
  de l'équipe » sans la donnée dans le brief ou le dossier : on ne le fait pas, on répond en une ligne ce
  qu'il faut nous envoyer. On ne négocie pas.
- **La charte reste la charte.** Si la phrase contredit `docs/GOUT.md` (boutons pilule, coches, police IA),
  on l'applique quand même si c'est le fondateur qui parle, et on l'écrit daté dans `direction.md` § Accepté
  par le fondateur ; si c'est un client (phrase transmise), on applique et on signale l'écart en une ligne.
  Dans les deux cas, `ff ia`/`ff verifier` doivent rester verts : si la demande les fait échouer, on
  s'arrête et on dit lequel.
- Pas d'agent pour une retouche : c'est un geste court. Un seul Chrome à la fois.

## 1. Comprendre la phrase (sans demander)

Classer la phrase, dans cet ordre de préférence, et lire seulement ce qui sert :

| Famille | Exemples | Où ça se change |
|---|---|---|
| Contenu | « le titre est trop long », « mets Claire au lieu de l'équipe », « enlève "savoir-faire" », « 9 h 30 au lieu de 9 h » | `site.config.ts` (texte, horaires, prix donnés dans la phrase) |
| Structure | « enlève la section tarifs », « la FAQ avant le contact », « ajoute une section réalisations » (seulement si les données existent) | `site.config.ts` → `layout.sections` |
| Look | « plus sombre », « plus de contraste », « une police plus large », « moins arrondi », « plus aéré » | `site.config.ts` (`direction`, `typography`, `scale`, `layout.tone/divider`) ; `node scripts/ff.mjs composer <slug>` pour voir les options compatibles |
| Contact | « téléphone en haut », « bouton Réserver », « enlève le formulaire » | `site.config.ts` (`contact.*`, `wording.*`, `layout.nav/actionBar/contactDrawer`) |
| Mouvement | « plus calme », « ça bouge trop », « le titre ne doit pas bouger », « plus vivant » | `motion`, la ligne MOUVEMENT de `direction.md` (à mettre à jour), la section sur mesure concernée ; `aiguillage.md` donne les bornes calme/vivant |
| Bloc sur mesure | « le dessin de raclette ressemble à un radiateur », « la bande ne défile pas sur iPhone » | `sites/<slug>/sections/<Nom>.astro` seulement |
| Goût | « non, pas ça » sur un principe (un effet, une famille de police) | la correction + une ligne datée dans `docs/GOUT.md` (§ 10 de `/site-final`) |

Lire `sites/<slug>/direction.md` (le contrat) avant de toucher au mouvement ou au bloc sur mesure : une
retouche ne doit pas tuer l'idée ; si elle le ferait (« enlève l'ardoise » sur la piste ardoise), on
l'applique mais la réponse le dit en une ligne.

Mots du fondateur déjà traduits (à enrichir à chaque retouche, ici même) :
- « téléphone en haut » = `layout.nav` avec bouton Appeler visible (première porte de `actions()`), pas la
  barre basse ; « en bas » = `layout.actionBar: true`.
- « plus calme » = `motion: 'subtle'`, rien qui suit le défilement (`ff aiguillage` le vérifie) ;
  « plus vivant » = `rich` + une ligne MOUVEMENT de plus dans le contrat, sur une chose du métier.
- « trop de texte » = raccourcir les paragraphes de la section visée à 2 phrases, jamais retirer une donnée
  du brief (horaires, prix, conditions).
- « ça fait IA » = lancer `node scripts/ff.mjs ia <slug>` et appliquer ses alertes, puis relire
  `docs/veille/pourquoi-ia-2026-10.md` ; si rien ne sort, c'est le mouvement : refaire la ligne MOUVEMENT.
- « plus pro » / « plus sérieux » = `scale: 'normal'`, `tone: 'flat'`, une seule couleur d'accent, titres en
  étiquettes ; jamais une police de la liste IA.

## 2. Appliquer

1. Noter l'état avant : `node scripts/ff.mjs captures <slug> --figer` si `captures/base/<slug>-*.png`
   n'existe pas encore (référence pour la comparaison).
2. Modifier la source (étape 1). Plusieurs phrases = toutes les modifications, puis un seul build.
3. Verrou : attendre que `.ff-tmp/build.lock` n'existe pas, le créer, `node scripts/ff.mjs build <slug>`,
   le supprimer.
4. `node scripts/ff.mjs verifier <slug> --sans-build` (a11y, typo, ia, aiguillage, données). Rouge =
   corriger à la source, jamais assouplir ; si la demande elle-même est la cause, s'arrêter et le dire.
5. `node scripts/ff.mjs captures <slug> --comparer` : le pourcentage de pixels qui changent, desktop et
   mobile. Une retouche de texte qui change 40 % de la page = quelque chose d'autre a bougé : regarder
   `captures/diff/` avant de continuer.
6. Si la retouche touche la structure, le mouvement ou un bloc sur mesure : `node scripts/ff.mjs planche
   <slug> --mobile-seul`, et la regarder (outil Read) ; `node scripts/ff.mjs audit-motion <slug>` si le
   mouvement a changé.
7. Démo (`legal.demo`) : `node scripts/ff.mjs vercel <slug> --sans-build`. Site client : `node
   scripts/ff.mjs deploy <slug>` (Cloudflare) seulement si le site est déjà en ligne ; sinon l'aperçu
   Vercel de démo.
8. Puis `node scripts/ff.mjs captures <slug> --figer` (la nouvelle référence).

## 3. Garder la trace

- `sites/<slug>/relecture.md`, section `## Retouches` (créée au besoin) : une ligne datée par phrase :
  la phrase telle quelle, ce qui a été changé (fichier), le pourcentage de la comparaison, la décision
  prise s'il y avait deux lectures.
- Un commit par appel de `/retouche`, message `retouche <slug> : <phrase ou phrases>`, suivi du trailer
  habituel. Pas de push (le fondateur pousse quand il veut).
- `annule` = `git revert --no-edit <dernier commit « retouche <slug> »>` (ou les N derniers), puis build,
  déploiement, et la ligne « annulé » dans `relecture.md`. Jamais `git reset`.
- Un mot nouveau du fondateur compris de travers une fois → l'ajouter à la liste « Mots du fondateur » ci-dessus
  avec sa bonne lecture.

## 4. Répondre (trois lignes, pas plus)

1. Ce qui a changé, en mots simples, et le lien.
2. Ce qui a bougé en plus (« 1,2 % de la page ordinateur, rien sur téléphone », ou « la section du dessous
   est remontée »).
3. S'il y a lieu : l'autre lecture possible et la phrase pour l'obtenir ; ou ce qu'il faut nous envoyer
   (une donnée manquante) ; ou l'écart à la charte accepté.

Rien d'autre : pas de « je peux aussi », pas de liste d'options.

## Journal des tests de la skill

- (à remplir au premier essai réel : phrase, famille, fichiers touchés, % de comparaison, temps)
