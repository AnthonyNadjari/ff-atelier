---
name: site-final
description: Mène un site (client ou démo) jusqu'à l'état « à montrer » en une seule passe sans allers-retours avec les fondateurs - contrat de direction écrit et attaqué avant de construire, contrôles automatiques, planche à la molette validée puis regardée en passes, relecture adverse notée par deux agents (DA, rédacteur) avec barème de confiance et grille à plafonds, passes de verdict jusqu'aux seuils, puis UN SEUL compte rendu.
---

# site-final

Pourquoi : le site du studio a demandé une vingtaine d'allers-retours en octobre 2026. Deux causes : un
premier jet générique (on corrigeait la forme d'un site sans idée), et des défauts visibles qu'un regard
honnête aurait vus avant de montrer. Cette skill attaque les deux : **une idée écrite et attaquée avant de
construire**, puis **un regard noté et impitoyable avant de montrer**.

Sources des mécanismes (lus en entier, licences et détails) : `docs/veille/skills-profond-2026-10.md`
(Impeccable, taste-skill v2, Anthropic frontend-design et code-review, Emil Kowalski, wshobson, jschulte,
gstack). Gestes de sites réels : `docs/veille/demontages/`.

Utilisation : `/site-final <slug> [--pistes N]` (défaut 3 : `<slug>`, `<slug>-b`, `<slug>-c`…) ; `--une-piste` ;
`/site-final <slug> --relecture` (site déjà construit : étapes 4 à 9, en lisant d'abord `sites/<slug>/relecture.md`).

Règles d'or :
- **On ne montre qu'une fois.** Pendant toute la passe, on ne pose aucune question au fondateur : on
  décide, on note la décision dans `relecture.md`, on continue. Le compte rendu est l'endroit où il peut
  nous contredire.
- Jamais plus de 2 agents à la fois ; les commandes qui ouvrent Chrome (`planche`, `captures`, `a11y`,
  `audit-motion`, `nettete`, `tuiles`) se lancent l'une après l'autre, jamais en parallèle (PC à 2 Go de
  RAM libre). Les agents relecteurs n'ouvrent aucun navigateur : ils lisent les captures.
- Jamais de donnée inventée. Jamais `ff deploy` depuis cette skill.

## 0. Lire (dans l'ordre, sans sauter)

1. `docs/GOUT.md` : la charte. Chaque ligne est un motif de refus, pas une opinion.
2. `CLAUDE.md` (règles dures, pièges), `docs/CONVENTIONS.md`, `docs/REDACTION.md` § 11.
3. Le brief `sites/<slug>/brief.md` (seule source des faits) et `site.config.ts` s'il existe.
4. `docs/veille/demontages/INDEX.md` (gestes à transposer), `docs/veille/redondances.md` (ce qui est déjà
   trop vu), et `node scripts/ff.mjs variete` + `node scripts/ff.mjs signatures`.

## 1. Contrat de direction (avant de toucher au site)

Copier `.claude/skills/site-final/direction-modele.md` en `sites/<slug>/direction.md` et le remplir :
8 à 12 faits propres tirés du brief, la phrase-idée, le test du concurrent, le contrat en six lignes
(thèse, squelette, premier écran, feu d'artifice, refusé, fin), typo/couleur/images, deux références
démontées. Point de départ des réglages : `node scripts/ff.mjs composer <slug>` ; on s'en écarte avec une
raison du brief, écrite dans le contrat.

## 1bis. Plusieurs pistes, inventées depuis le brief (jamais des modèles écrits d'avance)

Le studio vend plusieurs versions de la page d'accueil, et une piste unique finit « assez monotone » (fondateur,
16 oct 2026). Mais les pistes ne sont **jamais des archétypes écrits à l'avance** (« la sombre, la claire, la
colorée ») : le fondateur veut un outil « ultra flexible ».

- **Combien** : `--pistes N` (défaut 3 ; 1 = `--une-piste`). Le nombre se règle selon le client et le temps.
- **D'où viennent les idées** : chaque piste est inventée à partir des faits propres du brief, de son ressenti
  (adjectifs, sites aimés et détestés, contraintes) et des gestes de `docs/veille/demontages/`. Chaque piste
  pousse au bout UNE lecture différente du client (un fait, une humeur, un usage), écrite dans son contrat.
- **La diversité se vérifie, elle ne se décrète pas** : après les N contrats, comparer deux à deux sur les sept axes (squelette, direction/couleur, typographie, rythme,
  mécanisme du geste, **entrée du premier écran**, **manière d'apparaître au défilement**). Deux pistes qui
  partagent l'entrée ou la manière d'apparaître échouent, même si tout le reste diffère. Deux pistes qui partagent plus
  d'un axe : réinventer la plus faible. Écrire le tableau de comparaison dans le contrat de chaque piste.
- **Fabrication** : la piste principale par soi-même, les autres par des agents `general-purpose` (deux au plus
  à la fois), chacun avec le contrat de SA piste et les consignes communes
  (`.claude/skills/site-final/modeles/consignes-pistes.md` : lectures, périmètre `sites/<slug>-x/`, verrou de
  build `.ff-tmp/build.lock`, boucle de qualité). Le constructeur ne reçoit pas l'idée des autres pistes à imiter,
  seulement ce qu'il ne doit pas refaire.
- Chaque piste passe les étapes 4 à 7. Le compte rendu donne les N liens et le classement d'un agent neuf qui note
  toutes les pistes avec la même grille, avec une phrase par piste : l'idée, et pour qui elle est faite.

## 2. Attaquer le contrat (avant de construire)

Relire le contrat comme quelqu'un qui veut le rejeter :
- refaire mentalement le contrat pour le concurrent le plus proche : si on arrive au même endroit, la
  ligne est celle du métier, pas du client ; la réécrire et noter dans REFUSÉ ce qui a changé ;
- une ligne qui décrit une ambiance (« chaleureux et authentique ») n'est pas une décision ;
- ni le squelette + la direction, ni la paire de polices, ni le geste ne sont déjà portés par un site de
  `ff variete` / `ff signatures` ;
- rien ne contredit une ligne de `docs/GOUT.md`.
Pour un contrat de site client (pas une démo), un agent neuf peut faire cette attaque (lecture seule :
GOUT.md, INDEX des démontages, brief, direction.md ; 10 lignes). Changer une idée coûte une minute ici,
une heure après.

## 3. Construire

- Site neuf : `/nouveau-site <slug>` étapes 1 à 7, en suivant le contrat (pas son résumé final).
  Site existant : `node scripts/ff.mjs build <slug>`.
- Bloc sur mesure obligatoire, conforme à la phrase-idée ; un seul feu d'artifice par page, **mais un site
  vivant ET humain** : les quatre lignes MOUVEMENT du contrat animent des choses du métier, pas les titres
  (`docs/GOUT.md` § 2 et § 4), sans rideau, avec deux régimes de courbe.
- **Calibration** : les pages générées tombent dans cinq grappes quel que soit le sujet : fond crème + serif
  + terracotta ; noir + un accent acide ; broadsheet à filets et petites capitales ; cartes SaaS identiques à
  grand rayon et ombre grise ; chrome de gabarit (eyebrow, « A · B · C », flèche « → »). Pour un métier
  « chaleureux » (boulangerie, fromagerie, librairie, ébéniste), le premier réflexe crème + serif + lumière
  de lampe est **déjà dépensé**. Tomber dans une grappe sans qu'une ligne du brief l'ait demandé est un échec
  de relecture, pas un style.
- **Données « pire cas »** pour une démo : raison sociale longue à diacritiques, horaire fermé, une photo
  absente, 1 et 12 services. Le site ne doit pas casser (essayer sur une copie jetable, pas sur la démo).

## 4. Contrôles automatiques (tout vert avant de regarder)

```
node scripts/ff.mjs build <slug>
node scripts/ff.mjs verifier <slug> --sans-build     # a11y, typo, ia, données de test, textes, règles empruntées
node scripts/ff.mjs typo <slug> --corriger            # si besoin, puis rebuild
node scripts/ff.mjs audit-motion <slug>
node scripts/ff.mjs nettete <slug>
node scripts/ff.mjs detect <slug>
node scripts/ff.mjs perf <slug>
node scripts/ff.mjs signatures
```

Rouge = correction à la source (`site.config.ts`, `sites/<slug>/sections/`), jamais en assouplissant le
contrôle. Les alertes `ff ia` et « Règle empruntée » se corrigent aussi, sauf raison écrite. Démos :
« données de test » attendu, rien d'autre.

**Mouvement, avant de corriger** : dans l'ordre, (1) supprimer l'animation si son but ne tient pas en un
mot, (2) la réduire (durée, distance, propriétés), (3) l'easing (`ease-out`, jamais `ease-in`), (4)
l'origine, (5) l'interruptibilité. Suspect n° 1 d'une saccade iPhone : une variable CSS animée sur un
**parent** (`--p`, `--a`) lue par des enfants, qui recalcule le style de tout le sous-arbre à chaque image.
Poser la valeur sur l'élément qui bouge, ou passer en étapes (`data-etapes`, `GOUT.md` § 4).

## 5. Captures, validées puis regardées en passes

```
node scripts/ff.mjs captures <slug>      # captures/<slug>-desktop.png et -mobile.png (pleine page)
node scripts/ff.mjs planche <slug>       # captures/planches/<slug>-d-0.jpg et -m-0.jpg (molette)
```

**Valider la preuve avant de juger.** Une planche n'est une preuve que si : chaque vignette montre du
contenu (une bande vide là où un `data-reveal` aurait dû jouer est un DÉFAUT à corriger, pas une capture à
refaire) ; la première vignette montre le haut de page et la dernière atteint le pied de page (sinon
`--debut 24`, puis `--debut 48`) ; si le site affiche « Ouvert / Fermé », l'heure de capture le montre
« Ouvert ». Une planche invalide se refait avant toute relecture ; on ne passe jamais une planche invalide
à un agent.

Pour une proposition à plusieurs pistes, faire **une seule planche comparée** : les premiers écrans des N pistes
à 0, 150, 400, 800, 1 500 ms côte à côte, puis la première section sous le hero de chacune à +250 ms. Si deux
colonnes se ressemblent à 400 ms (même aplat, même titre coupé à mi-hauteur), les pistes ne sont pas
différentes. Ajouter à côté les mêmes vignettes d'un démontage de `docs/veille/demontages/` du même métier.

Le mouvement ne se voit pas sur une planche fixe : **le filmer** (premier écran image par image à 100, 300,
600, 1 000 ms, puis le feu d'artifice en action) dans `captures/planches/<slug>-film.jpg`, avec un petit script
playwright (modèle : `scripts/outils/film-fromagerie.mjs`). Au test du 16 oct 2026, c'est le film qui a
montré que le chiffre suivant de la bande restait invisible au bord.

Puis ouvrir chaque image avec l'outil Read et faire **ces passes, une par une**, sur les images seulement
(on a écrit le code, on y lirait ses intentions) :
1. **Une seconde** : première vignette téléphone, détourner les yeux ; une seule réponse (un mot, un objet).
2. **Mémoire** : après le premier écran, que décrirait-on une heure plus tard ? Quoi, où, combien ou quand.
3. **Trois regards** : où va l'œil en 1, 2, 3 sur le premier écran ordinateur ? Dans l'ordre du contrat ?
4. **Cacher le nom** : ce premier écran pourrait-il être celui du concurrent ? L'idée atteint-elle la FAQ,
   le contact, le pied de page ?
5. **Plisser les yeux** : deux ou trois masses de tailles nettement différentes ?
6. **Un mot par section** (partagé, liste, pleine largeur, grille, phrase, tableau) : le même mot deux fois
   de suite, ou trois fois sur la page = le gabarit se voit.
7. **Bords** : le bord gauche des textes tient sur deux ou trois positions, pas six.
8. **Collisions** : rien ne couvre un titre, un texte, un bouton ; rien ne déborde ; aucun grand texte
   épinglé plus de deux vignettes d'écran.
9. **Plein et vide** : au plus un écran presque vide par page ; aucun trou à côté d'une colonne courte.
10. **Téléphone d'abord** : texte lisible sur fond animé, rien sous la barre basse, contact au pouce.
11. **Test du tronc** sur une page service : sans contexte, sait-on quel site, quelle page, comment revenir
    et appeler ?
Chaque défaut se note avec sa vignette (`m-0, vignette 7`) et se corrige avant la relecture des agents.

## 6. Relecture adverse notée (deux agents neufs, en parallèle, lecture seule)

`node scripts/ff.mjs relecture <slug>` assemble les deux prompts (charte, barème, grille, variété) dans
`captures/relecture/<slug>-da.txt` et `-redacteur.txt`. Lancer **dans le même message** deux agents
`general-purpose` (jamais en `fork`) dont la consigne est : « Lis en entier le fichier
captures/relecture/<slug>-da.txt (ou -redacteur.txt) et exécute-le à la lettre ; ta réponse finale est
exactement la SORTIE qu'il demande. »
Ne pas résumer les prompts (leur dureté est voulue), ne pas y coller les sorties de `ff detect`, `ff ia`,
`ff audit-motion` (elles ancrent le regard). Garder l'identifiant de l'agent DA pour la passe de verdict.
Pendant qu'ils lisent, ne pas modifier le site.

Si les agents ne peuvent pas être lancés : faire les deux relectures soi-même après une relecture à froid
de la planche, et écrire en tête de `relecture.md` et du compte rendu « Relecture dégradée : un seul
contexte (raison) ». Sans planche : « Relecture sur code seulement : visuel non évalué », et jamais de
verdict « montrer ».

## 7. Corriger, puis faire noter les correctifs

1. Appliquer **tous** les constats ≥ 75 en un seul lot, dans cet ordre : idée et bloc sur mesure → premier
   écran et hiérarchie → squelette et composition → typographie → images → couleur → textes → détails et
   états → mouvement (supprimer d'abord).
2. Verdict `refaire` : ne pas retoucher ; refaire le bloc ou le premier écran nommé, puis relecture
   **complète** (étape 6).
3. Rebuild, étape 4, nouvelles captures **aux mêmes chemins**, validées (étape 5). **Une correction de mise en
   page se mesure avant d'être annoncée** (petit script playwright : nombre de lignes du titre, position du
   bouton, `display` calculé). Au premier test (fromagerie-ravanel, 16 oct 2026), deux correctifs en classes
   Tailwind (`hidden`, `lg:max-w-*`) étaient sans effet, battus par le `<style>` de la section : la passe de
   verdict l'a vu, pas le constructeur. Corriger dans le style de la section, puis mesurer.
4. **Passe de verdict** : renvoyer au même agent DA (SendMessage avec son identifiant ; sinon un agent neuf
   qui reçoit la liste du tour précédent) : « Voici les planches après correction, aux mêmes chemins. Tu
   notes, tu ne cherches pas de nouveaux défauts. Pour chaque constat du tour précédent : résolu, partiel
   ou non résolu, d'après les nouvelles captures uniquement. Mon récit des corrections n'est pas une
   preuve : un correctif que tu ne vois pas est non résolu ; déplacé sans la qualité demandée = partiel.
   Puis au plus trois régressions causées par ces corrections. Recalcule notes et verdict. Forme : verdict /
   tableau résolu-partiel-non résolu / régressions / notes. » Même chose pour le rédacteur si des textes ont
   changé.
5. **Arrêt** : deux tours de correction au plus après la première relecture. On s'arrête plus tôt dès que
   les seuils « montrer » de la grille sont atteints, **ou dès qu'un tour ne résout rien**. Un partiel ne
   devient jamais « montrer ». Sous le seuil après deux tours : le compte rendu le dit en tête (« pas encore
   à montrer : global 6,8, idée 6, voici les trois blocages »). On n'arrondit pas.
6. Le parent n'adoucit jamais un verdict. Il peut écarter un constat (choix du brief, règle absente de
   `GOUT.md`) en l'écrivant dans `relecture.md` avec la raison ; s'il touche au goût, il va dans les
   décisions du compte rendu.

**Garde-fous** : on corrige dans `sites/<slug>/` ; toucher `src/` seulement pour un vrai bug commun, puis
`npm test` et `node scripts/ff.mjs build _exemple`. Une correction qui fait régresser (débordement, contrôle
rouge, note en baisse) est annulée tout de suite. Plus de 20 corrections dans un tour, ou plus de deux
fichiers de `src/` touchés : s'arrêter et le dire, la page a un problème de fond, pas de finition.

**Journal** `sites/<slug>/relecture.md` (jamais publié), un bloc par tour :

    ## Tour n — <date> — verdict DA : … / rédacteur : …
    Notes : composition _ · usage _ · idée _ · textes _ → global _,_ (tour précédent : _,_)
    Plafonds actifs : …
    Constats appliqués : …
    Constats écartés, avec la raison : …
    Décisions prises pour le fondateur : …

## 8. Aperçu

Démo ou site du studio : captures seulement, pas de mise en ligne sans accord. Site client : `node
scripts/ff.mjs vercel <slug>` sur un projet d'aperçu si les identifiants existent, sinon captures.

## 9. Compte rendu (une seule fois, en français simple, sans jargon)

1. **Le lien** ou les captures (premier écran téléphone + planche ; SendUserFile si le fondateur est sur
   téléphone). Si le seuil n'est pas atteint, la première ligne le dit.
2. **Ce que vous verrez** : 3 à 6 lignes, du plus visible au moins visible, dont l'idée en mots simples.
3. **Rejeté en interne** : ce que relecteurs et planche ont fait retirer, ce que le contrat a refusé, et
   les notes finales (« global 7,8 : composition 8, usage 8, idée 7, textes 8 »).
4. **Décisions que j'ai prises pour vous** : au plus 3, chacune avec l'autre option et ce qu'il faut dire
   pour basculer (« téléphone dans la barre du bas ; pour l'inverse, dites "téléphone en haut" »).
5. **Non vérifié** : ce qui n'a pas pu l'être (iPhone en ligne, heure d'ouverture…).
6. Rien d'autre : pas de « pistes », pas de « à envisager ».

## 10. Après le retour du fondateur

- Un « non » → une ligne datée de `docs/GOUT.md` avec l'exemple, et si possible un contrôle (`ff ia`,
  `ff verifier`) ou une question de plus dans `relecteurs/da.md` ou `relecteurs/redacteur.md`.
- Un « oui » sur un écart signalé → `sites/<slug>/direction.md`, section « Accepté par le fondateur »,
  daté ; les relectures suivantes de ce site ne le resignalent pas.
- Un bug payé → une ligne de `CLAUDE.md` § Pièges. Un constat du DA qu'un contrôle aurait dû attraper →
  une ligne dans `docs/veille/journal.md` (piste pour améliorer le contrôle).

## Journal des tests de la skill

- 16 oct 2026, fromagerie-ravanel (démo, brief fictif, nouvelle famille « alimentation ») : tour 1 global
  6,55 (composition 6,5 plafonnée, textes 3 plafonnés) → tour 2 7,35 → tour 3 **7,6, montrer**. 15 constats
  appliqués, 0 écarté. Le test a fait corriger 5 défauts de l'usine elle-même : e-mail obligatoire (devenu
  facultatif), pas d'avis de démo (`legal.demo`), titre de FAQ figé (`wording.faqTitle`), rayons de terre
  (20 / 28 px → 4 px), deux faux positifs (`ff ia` lisait le CSS, `ff verifier` voyait « tes » dans
  « fêtes »). Leçons intégrées : `ff relecture`, correction mesurée avant d'être annoncée.
  Retour du fondateur sur le lien en ligne : « pourquoi y'a aucune animation ? ». Les relecteurs l'avaient laissé
  passer (planches fixes, aucune exigence de mouvement). Corrigé : GOUT § 4 « un site doit être vivant », ligne
  MOUVEMENT du contrat, question et plafond « site immobile » chez le DA, film du mouvement.

## 11. Vérifier que la skill marche (une fois par mois, ou après une grosse modification)

Deux briefs de démo. Pour chacun : une passe `/site-final` complète et une passe `/nouveau-site` seule.
Faire noter les deux planches par un agent neuf qui ne sait pas laquelle est laquelle, avec
`relecteurs/grille.md` et `GOUT.md`. Noter l'écart dans `docs/veille/journal.md`. Si `/site-final` ne gagne
pas d'au moins un point global, revoir l'étape qui coûte le plus. Une passe à la fois, un navigateur.
