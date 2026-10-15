---
name: site-final
description: Mène un site (client ou démo) jusqu'à l'état « à montrer » en une seule passe sans allers-retours avec les fondateurs : charte GOUT.md, génération, contrôles, relecture adverse par deux agents, planche à la molette regardée, corrections en boucle, puis UN SEUL compte rendu avec captures.
---

# site-final

Pourquoi cette skill existe : le site du studio a demandé une vingtaine d'allers-retours en octobre
2026 (signes IA, texte illisible sur iPhone, défilement cassé, téléphone « avant » à moitié vide,
étiquettes qui cachaient les démos). Chaque fois, un regard honnête sur le résultat avant de le
montrer aurait suffi. Cette skill impose ce regard, **avant** que le fondateur voie quoi que ce soit.

Utilisation : `/site-final <slug>` (site existant ou tout juste créé par `/nouveau-site`), ou
`/site-final <slug> --relecture` pour sauter la génération et ne faire que la boucle de relecture.

Règle d'or : **on ne montre qu'une fois.** Tout ce qui suit se passe sans le fondateur. À la fin, un
compte rendu court, une planche, un lien d'aperçu, et la liste de ce qui a été rejeté en interne.

## 0. Lire, dans l'ordre

1. `docs/GOUT.md` : la charte. Tout ce qu'elle interdit est un échec de relecture, pas une opinion.
2. `CLAUDE.md` (règles dures, pièges), `docs/CONVENTIONS.md`, `docs/REDACTION.md` § 11 (checklist textes).
3. Le brief (`sites/<slug>/brief.md`) et `sites/<slug>/site.config.ts` s'ils existent.
4. `docs/veille/techniques-2026-10.md` § « Les 8 à implémenter » et `docs/veille/redondances.md`
   (ce qui est déjà trop vu dans la bibliothèque), pour le bloc sur mesure.

## 1. Produire (sauf `--relecture`)

- Site neuf : suivre `/nouveau-site` jusqu'à son étape 8 (build vert). Ne pas s'arrêter à son résumé.
- Site existant : `node scripts/ff.mjs build <slug>`.
- Bloc sur mesure obligatoire, tiré d'un **fait du métier** (brief), jamais d'un ornement. Vérifier
  avec `node scripts/ff.mjs signatures` qu'il n'existe pas déjà ailleurs.

## 2. Contrôles automatiques (tout doit être vert avant la relecture humaine)

```
node scripts/ff.mjs verifier <slug> --sans-build     # a11y, typo, ia, données de test, textes
node scripts/ff.mjs ia <slug>
node scripts/ff.mjs typo <slug> --corriger            # puis rebuild si corrigé
node scripts/ff.mjs audit-motion <slug>
node scripts/ff.mjs nettete <slug>
node scripts/ff.mjs detect <slug>
node scripts/ff.mjs perf <slug>
```

Un contrôle rouge se corrige à la source (`site.config.ts`, `sites/<slug>/sections/`), jamais en
assouplissant le contrôle. Rebuild, relance. Sites de démo : les avertissements « données de test »
sont attendus, le reste non.

## 3. Planche à la molette, regardée à l'œil

```
node scripts/ff.mjs planche <slug>            # captures/planches/<slug>-d-0.jpg et -m-0.jpg
node scripts/ff.mjs planche <slug> --debut 24 # la suite, si la page est longue
```

**Ouvrir les deux images avec l'outil Read et les regarder vraiment**, vignette par vignette :
- un bloc qui n'apparaît pas, une section épinglée qui ne bouge pas, un écran vide, un texte qui se
  superpose à une image, un téléphone de démo à moitié vide, une étiquette qui cache un contenu ;
- sur téléphone : texte lisible sur le fond, rien sous la barre basse, pas de débordement.
Tout défaut vu = correction, rebuild, nouvelle planche. Ne pas écrire « rien de cassé » sans avoir
regardé la planche de la version finale.

## 4. Relecture adverse (deux agents, en parallèle, lecture seule)

Lancer deux agents `general-purpose` **en lecture seule** (ils ne modifient rien, ils rapportent),
avec le même préambule : « Lis d'abord `docs/GOUT.md` et `docs/veille/signes-ia.md`. Tu es
adversarial : ton travail est de trouver ce qui fera dire au fondateur "non". Rapporte
`fichier:ligne — problème — correctif proposé`, 25 lignes max, le plus visible d'abord. »

- **Agent DA** : lit `dist/<slug>/index.html` + une page service, les sections sur mesure, la direction
  utilisée ; regarde `captures/planches/<slug>-d-0.jpg` et `-m-0.jpg`. Cherche : signes IA restants,
  redondance avec un autre site de l'usine (même squelette + même direction : `ff variete`),
  effet riche en double, hiérarchie plate, premier écran qui ne dit pas quoi/où/combien/quand.
- **Agent rédacteur** : lit le texte visible (`site.config.ts`, sections). Cherche : mots creux,
  phrases d'agence, titres-fragments, cadences de trois, « exemple » répété, donnée non sourcée par
  le brief, incohérences (un prix à deux endroits, une date qui ne tombe pas le bon jour, un
  quartier qui ne correspond pas à l'adresse), typographie française.

Appliquer **tout** ce qui est fondé. Ce qui est discutable (un choix du brief, une règle absente de
`GOUT.md`) va dans le compte rendu, section « laissé à votre décision ». Puis rebuild et retour à
l'étape 2, jusqu'à : contrôles verts, planche propre, et les deux agents ne trouvent plus rien de
fondé (deux tours en général, trois au plus ; au-delà, livrer avec la liste de ce qui reste).

## 5. Aperçu

Démo ou site du studio : rien à déployer sans accord. Site client : `node scripts/ff.mjs vercel
<slug>` sur un projet d'aperçu si les identifiants existent, sinon captures seulement. Jamais
`ff deploy` (Cloudflare, domaine client) depuis cette skill.

## 6. Compte rendu (une seule fois, en français simple)

Dans l'ordre, court :
1. Le lien (ou « captures seulement ») et les deux planches jointes (SendUserFile si le fondateur est
   sur téléphone).
2. **Ce que vous verrez** : 3 à 6 lignes, du plus visible au moins visible.
3. **Rejeté en interne** : ce que les agents et la planche ont fait retirer (pour que le fondateur
   sache que c'est relu, et ne le redemande pas).
4. **Laissé à votre décision** : au plus 3 points, chacun avec une recommandation.
5. Rien d'autre. Pas de liste de commandes, pas de détails techniques.

## 7. Après le retour du fondateur

Chaque « non » devient une ligne datée de `docs/GOUT.md` (avec l'exemple). Chaque bug payé devient
une ligne de `CLAUDE.md` § Pièges. C'est ce qui fait que la fois suivante demande moins de tours.
