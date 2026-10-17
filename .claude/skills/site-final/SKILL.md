---
name: site-final
description: Mène un site (client ou démo) jusqu'à l'état « à montrer » en une seule passe sans allers-retours avec les fondateurs - réponses du client transformées en cadre (ff aiguillage), sites aimés démontés (ff demonter), contrat de direction vérifié (ff contrat) puis attaqué, N pistes inventées depuis le brief et mesurées différentes (ff pistes), tous les contrôles en une commande (ff prevol), planche et film regardés en passes, relecture adverse notée par deux agents (DA, rédacteur) avec barème de confiance et grille à plafonds, passes de verdict jusqu'aux seuils, UN SEUL compte rendu, puis ff choisir et /retouche après le retour du fondateur.
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
- Jamais plus de 2 agents à la fois ; les commandes qui ouvrent Chrome (`prevol`, `planche`, `captures`, `film`,
  `pistes`, `demonter`, `a11y`, `audit-motion`, `nettete`, `tuiles`) se lancent l'une après l'autre, jamais en
  parallèle (PC à 2 Go de RAM libre). Les agents relecteurs n'ouvrent aucun navigateur : ils lisent les captures.
- **Tout ce qui peut se vérifier à la machine se vérifie à la machine**, avant qu'un œil ne regarde :
  `ff contrat` (le contrat), `ff prevol` (le site), `ff pistes` (la diversité). Un relecteur ne redit jamais
  ce qu'un contrôle a déjà dit ; un constat de relecteur qui vient de `src/` devient un contrôle (§ 10).
- Jamais de donnée inventée. Jamais `ff deploy` depuis cette skill.

## 0. Lire (dans l'ordre, sans sauter)

1. `docs/GOUT.md` : la charte, **§ 0 d'abord (le socle qui fait acheter)**. Chaque ligne est un motif de refus,
   pas une opinion. Puis `docs/veille/marche/CE-QUI-VEND.md` : ce que les sites qui vendent ont en commun.
2. `CLAUDE.md` (règles dures, pièges), `docs/CONVENTIONS.md`, `docs/REDACTION.md` § 11.
3. Le brief `sites/<slug>/brief.md` (seule source des faits) et `site.config.ts` s'il existe. Puis
   `.claude/skills/site-final/aiguillage.md` : les réponses « photos » et « ambiance » du client fixent le cadre
   (photos ou non, liste de prises, calme ou vivant) AVANT toute idée. On l'applique, on ne le rediscute pas.
   `node scripts/ff.mjs aiguillage <slug>` calcule la décision et imprime les deux lignes du contrat ; `ff verifier`
   la contrôle ensuite sur le site construit (une piste « calme » qui suit le défilement échoue).
   Si le brief vient de `ff refonte` (en tête : « REFONTE de … »), lire l'annexe « Textes du site actuel » et
   réécrire, jamais recopier tel quel un texte creux ; on en garde les faits (noms, années, produits, horaires),
   pas les phrases. Les photos de `raw/` viennent de son site (`raw/SOURCES.md`) ; les slugs de services de
   `redirects.json` restent ceux de `site.config.ts`.
4. `docs/veille/demontages/INDEX.md` (gestes à transposer), `docs/veille/redondances.md` (ce qui est déjà
   trop vu), et `node scripts/ff.mjs variete` + `node scripts/ff.mjs signatures`.
5. Les sites que le client aime (brief § 12) : `node scripts/ff.mjs demonter <url> --slug <slug>` pour chacun
   (fiche mesurée dans `sites/<slug>/references/`, captures à côté) ; lire la fiche et REGARDER les captures
   avant d'écrire le contrat. On y prend un geste, jamais une maquette.

## 1. Contrat de direction (avant de toucher au site)

Lire `.claude/skills/site-final/premiers-ecrans.md` (familles de premier écran). Copier
`.claude/skills/site-final/direction-modele.md` en `sites/<slug>/direction.md` et le remplir :
le **Socle** (GOUT § 0 : ce qui fait acheter, point par point, présent ou absent faute de donnée), 8 à 12 faits propres tirés du brief, la phrase-idée, le test du concurrent, le contrat en six lignes
(thèse, squelette, premier écran, feu d'artifice, refusé, fin), typo/couleur/images, deux références
démontées. Point de départ des réglages : `node scripts/ff.mjs composer <slug>` ; on s'en écarte avec une
raison du brief, écrite dans le contrat.

## 1 ter. On applique un style réel, on ne l'invente pas (18 oct 2026)

Le design de chaque piste vient d'un STYLE de `docs/veille/styles/INDEX.md` (un vrai site étudié, devenu direction
de l'usine) et d'une ARCHITECTURE de `docs/veille/architectures/INDEX.md`, choisis selon les données du client
(photos, produits, lieu, urgence). On applique le style tel quel : polices, couleurs, espacements, traitement des
photos, boutons, mouvement ; on adapte le contenu, pas le style. Trois pistes = trois styles et trois architectures
différents ; ni l'un ni l'autre ne reprend ceux des 4 derniers sites. L'invention reste pour le seul bloc sur
mesure. Écrire au contrat : « Style : <id> (source) · Architecture : <id> (source) ».

Le style d'une piste vient d'un **MÉLANGE d'atomes** ou d'un **style entier** (18 oct 2026, fondateur : « faut faire
des cross »). Les atomes (typo, couleurs, densité, formes, photos, mouvement, matière, architecture, premier écran)
sont ceux de vrais sites, `docs/veille/styles/atomes/` (format : `docs/veille/styles/ATOMES.md`). D'abord
`node scripts/ff.mjs melanger <slug> --n 3 --hasard --essai` : trois mélanges compatibles avec les données du client
(contraste, polices, photos de 1 600 px pour un plein cadre, aiguillage calme), regardés côte à côte sur
`captures/planches/<slug>-melanges.jpg` ; puis chaque piste reçoit le sien (`ff melanger <slug>[-b|-c] --typo … --couleurs …`,
la ligne exacte est imprimée), ou un style entier (`--style <id>`). **Trois pistes = trois mélanges qui ne partagent
pas plus de 2 atomes** deux à deux (la commande le garantit) ; aucun mélange ne partage plus de 3 atomes avec un site
existant (`docs/empreintes/melanges.json`). On peut imposer un atome pour une raison du brief (« la typo de
studenterkilden parce que le client veut du classique ») et laisser tirer le reste. Recopier au contrat la ligne
« Style : mélange <typo:… · couleurs:… · …> » que la commande imprime.

## 1bis. Plusieurs pistes, inventées depuis le brief (jamais des modèles écrits d'avance)

Le studio vend plusieurs versions de la page d'accueil, et une piste unique finit « assez monotone » (fondateur,
16 oct 2026). Mais les pistes ne sont **jamais des archétypes écrits à l'avance** (« la sombre, la claire, la
colorée ») : le fondateur veut un outil « ultra flexible ».

- **Combien** : `--pistes N` (défaut 3 ; 1 = `--une-piste`). Le nombre se règle selon le client et le temps.
- **Le cadre d'abord** : toutes les pistes respectent l'aiguillage (`aiguillage.md`). Client « calme » : N pistes
  calmes, différentes autrement. Client « je ne sais pas » ou sans réponse : au moins une piste calme et une vivante.
  Client sans photo : aucune piste n'en dépend. Le cadre réduit l'espace, jamais la diversité des idées.
- **D'où viennent les idées** : chaque piste est inventée à partir des faits propres du brief, de son ressenti
  (adjectifs, sites aimés et détestés, contraintes) et des gestes de `docs/veille/demontages/`. Chaque piste
  pousse au bout UNE lecture différente du client (un fait, une humeur, un usage), écrite dans son contrat.
- **La diversité se vérifie, elle ne se décrète pas** : après les N contrats, comparer deux à deux sur les sept axes (squelette, direction/couleur, typographie, rythme,
  mécanisme du geste, **entrée du premier écran**, **manière d'apparaître au défilement**). Deux pistes qui
  partagent l'entrée ou la manière d'apparaître échouent, même si tout le reste diffère. Deux pistes qui partagent plus
  d'un axe : réinventer la plus faible. Écrire le tableau de comparaison dans le contrat de chaque piste.
  Mécanique : `node scripts/ff.mjs pistes <slug>` lit les contrats, les sections et les builds, filme les premiers
  écrans côte à côte (`captures/planches/<slug>-pistes.jpg`) et échoue sur une entrée ou une apparition partagée
  (texte du contrat, h1 révélé par lignes des deux côtés, ou même mise en page du premier écran). On le lance après les
  contrats (`--sans-film`, sur le texte) puis après les builds (avec le film). Un échec se corrige dans la piste, pas
  dans le seuil. **La diversité se mesure contre TOUS les sites, sur la PAGE ENTIÈRE** : chaque piste construite passe
  `ff ressemblance <piste>` (premier écran téléphone et ordinateur ET déroulé de l'accueil comparés au registre
  `docs/empreintes/` de tous les sites, pas seulement aux pistes sœurs) ; quatre sites « photo, carte crème posée
  dessus, numéro en grand, barre de trois boutons » avaient passé `ff pistes` le 17 oct 2026, puis, premier écran
  corrigé, restaient pareils « dans leur déroulé » (18 oct : même ordre héros, avis, services, à propos, venir,
  pied ; même menu vers des pages de services ; même longueur). Une piste se pense donc aussi par son ordre de
  sections, sa navigation (une longue page, plusieurs pages, un accueil-menu, des onglets, un défilement
  horizontal) et sa longueur, tirés du brief, pas du gabarit « héros, avis, services, à propos, contact ».
- **Fabrication** : la piste principale par soi-même, les autres par des agents `general-purpose` (deux au plus
  à la fois), chacun avec le contrat de SA piste et les consignes communes
  (`.claude/skills/site-final/modeles/consignes-pistes.md` : lectures, périmètre `sites/<slug>-x/`, verrou de
  build `.ff-tmp/build.lock`, boucle de qualité). Le constructeur ne reçoit pas l'idée des autres pistes à imiter,
  seulement ce qu'il ne doit pas refaire.
- Chaque piste passe les étapes 4 à 7. Le compte rendu donne les N liens et le classement d'un agent neuf qui note
  toutes les pistes avec la même grille, avec une phrase par piste : l'idée, et pour qui elle est faite.

## 2. Attaquer le contrat (avant de construire)

D'abord la forme, à la machine : `node scripts/ff.mjs contrat <slug>` (sections, 8 à 12 faits retrouvés dans le
brief, quatre lignes MOUVEMENT sans attribut du moteur et avec deux régimes, deux fiches de démontage citées,
polices hors liste IA, accord avec l'aiguillage). Rouge = corriger le contrat. Puis le fond, à l'œil :

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
- **Le socle d'abord** (GOUT § 0) : plusieurs pages, téléphone en haut, métier + ville, avis, ancienneté, vraies
  photos, portes par intention. Le socle dit QUOI ; la construction du premier écran vient de la famille choisie au
  contrat (`premiers-ecrans.md`), différente des pistes sœurs et des 4 derniers sites. Une piste qui sacrifie le
  socle au style est refusée, même belle ; une piste qui ressemble à un autre site (`ff ressemblance`) aussi.
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
node scripts/ff.mjs prevol <slug> [<slug-b> <slug-c>]   # tout, dans l'ordre, une table à la fin
```

`ff prevol` enchaîne contrat, aiguillage, build (verrou), verifier (a11y, typo, ia, ancres, crédits, données de
test, textes, règles empruntées), audit-motion, nettete, ressemblance (la diversité se mesure sur la page entière :
premier écran ET déroulé de l'accueil + navigation du site, contre tous les sites du registre ; refus si l'un ou
l'autre dépasse 0,65 ; planche `captures/planches/<slug>-ressemblance.jpg` avec la colonne « déroulé »), detect,
perf, signatures, puis `ff pistes`
(film comparé) s'il y a plusieurs pistes ; un seul Chrome à la fois. Une étape rouge se corrige à la source (`ff typo <slug>
--corriger` pour la typographie, puis relancer). Détail dans `.ff-tmp/prevol-<slug>.json`.

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

Pour une proposition à plusieurs pistes, `ff pistes <slug>` produit **la planche comparée** (et son verdict) : les premiers écrans des N pistes
à 0, 150, 400, 800, 1 500 ms côte à côte, puis la première section sous le hero de chacune à +250 ms. Si deux
colonnes se ressemblent à 400 ms (même aplat, même titre coupé à mi-hauteur), les pistes ne sont pas
différentes. Ajouter à côté les mêmes vignettes d'un démontage de `docs/veille/demontages/` du même métier.

Le mouvement ne se voit pas sur une planche fixe : **le filmer** avec `node scripts/ff.mjs film <slug> --toucher
"<sélecteur du geste>"` (ou `--glisser`, `--geste`) : l'entrée du premier écran image par image, téléphone PUIS
ordinateur (`captures/planches/<slug>-film.jpg` et `-film-d.jpg`), la première section sous le hero, et le geste.
Au test du 16 oct 2026, c'est le film qui a montré que le chiffre suivant de la bande restait invisible au bord ;
le 17, que la meule de la piste A était finie avant que le nom commence sur ordinateur (personne n'avait filmé
l'ordinateur).

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

`node scripts/ff.mjs relecture <slug>` assemble les deux prompts (charte, barème, grille, variété, et ce que
`ff pistes` et `ff aiguillage` ont déjà établi) dans `captures/relecture/<slug>-da.txt` et `-redacteur.txt`. Lancer **dans le même message** deux agents
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

Démo (`legal.demo`) : `node scripts/ff.mjs vercel <slug> --sans-build` sur son projet de démo
(`sites/<slug>/vercel-projet.json`, créé au premier déploiement) : le fondateur regarde sur son téléphone. Site du
studio : jamais sans accord. Site client : un projet d'aperçu Vercel si les identifiants existent, sinon captures ;
la mise en ligne réelle (Cloudflare, domaine du client) n'est jamais faite par cette skill.

## 9. Compte rendu (une seule fois, en français simple, sans jargon)

1. **Le lien** ou les captures (premier écran téléphone + planche ; SendUserFile si le fondateur est sur
   téléphone). Si le seuil n'est pas atteint, la première ligne le dit.
2. **Ce que vous verrez** : 3 à 6 lignes, du plus visible au moins visible, dont l'idée en mots simples.
3. **Rejeté en interne** : ce que relecteurs et planche ont fait retirer, ce que le contrat a refusé, et
   les notes finales (« global 7,8 : composition 8, usage 8, idée 7, textes 8 »).
4. **Décisions que j'ai prises pour vous** : au plus 3, chacune avec l'autre option et ce qu'il faut dire
   pour basculer (« téléphone dans la barre du bas ; pour l'inverse, dites "téléphone en haut" »).
5. **Ce qu'il manque du client** (seulement si l'aiguillage l'a noté) : photos attendues, ou la liste de prises
   (3 à 6 photos, sujet, cadrage, section) avec les deux options : il les fait au téléphone avec le guide photo,
   ou on vient. Et, pour « je ne sais pas », laquelle des pistes est calme et laquelle est vivante.
6. **Non vérifié** : ce qui n'a pas pu l'être (iPhone en ligne, heure d'ouverture…).
7. Rien d'autre : pas de « à envisager ».

## 10. Après le retour du fondateur

- « On prend la B » → `node scripts/ff.mjs choisir <slug> b` : la piste devient `sites/<slug>`, les autres sont
  rangées dans `sites/_pistes/` (plus construites ni déployées), puis build, vérification, déploiement sous le
  vrai nom. Les retouches suivantes passent par `/retouche <slug> "<phrase>"`.

- Un « non » → une ligne datée de `docs/GOUT.md` avec l'exemple, et si possible un contrôle (`ff ia`,
  `ff verifier`) ou une question de plus dans `relecteurs/da.md` ou `relecteurs/redacteur.md`.
- Un « oui » sur un écart signalé → `sites/<slug>/direction.md`, section « Accepté par le fondateur »,
  daté ; les relectures suivantes de ce site ne le resignalent pas.
- Un bug payé → une ligne de `CLAUDE.md` § Pièges. Un constat de relecteur dont la cause est dans `src/`
  (un défaut par défaut du moteur, une ancre morte, un texte inventé par un gabarit) → on corrige `src/` pour
  tous les sites ET on ajoute le contrôle qui l'aurait vu (`ff verifier`, `ff ia`, `ff contrat`), avec son
  test ; une ligne dans `docs/veille/journal.md`. Le 17 oct 2026, quatre constats sur la fromagerie sont
  devenus quatre contrôles.

## Journal des tests de la skill

- 17 oct 2026 : la skill s'outille pour tenir en moins de tours. Avant de construire : `ff aiguillage`
  (réponses du client → cadre), `ff demonter` (sites aimés → fiches mesurées), `ff contrat` (forme du contrat).
  Avant de regarder : `ff prevol` (tout en une commande), `ff pistes` (diversité mesurée, film comparé). Après le
  fondateur : `ff choisir`, `/retouche`. Les relecteurs du jour (fromagerie A et B) ont trouvé quatre défauts de
  l'usine, devenus des contrôles : une relecture qui ne produit pas un contrôle est une relecture perdue.

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

Et, sans brief ni agent, les contrôles mécaniques de la skill se vérifient en une minute :
`node --test tests/aiguillage.test.mjs tests/pistes.test.mjs tests/contrat.test.mjs tests/prevol.test.mjs
tests/film.test.mjs tests/choisir.test.mjs tests/ia.test.mjs tests/brief-form.test.mjs`, puis
`node scripts/ff.mjs contrat fromagerie-ravanel fromagerie-ravanel-b fromagerie-ravanel-c` (trois contrats verts),
`node scripts/ff.mjs pistes fromagerie-ravanel --sans-film` (les trois pistes de la démo doivent rester
différentes) et `node scripts/ff.mjs aiguillage fromagerie-ravanel` (lit le brief, imprime la décision).
