# Comment on sait quoi animer — méthode par métier

> Question du fondateur : « comment on sait quoi animer ? si c'est un dentiste, je fais comment ? »
> Jusqu'ici la réponse vivait dans la tête de Claude, refaite à chaque site. Ce document la rend
> explicite : une méthode en 5 questions, applicable à n'importe quel métier, une table de référence
> pour les 27 métiers de `docs/OBJECTIF.md`, et une fiche dentiste traitée de bout en bout comme
> démonstration. Il s'appuie sur `docs/ANIMATIONS.md` (le vocabulaire `data-*` disponible),
> `docs/veille/references.md` (30 teardowns de sites réels) et les journaux de tour de
> `docs/OBJECTIF.md` (ce qui a déjà été dessiné, effet par effet).

## 0. Le principe derrière la méthode

Un site de l'atelier a un moteur de ~45 effets `data-*` (`docs/ANIMATIONS.md`) mais la règle de fond
n'a jamais été « utiliser le plus d'effets possible » — c'est l'inverse. Trois idées reviennent dans
toutes les sources consultées, internes et externes :

- **L'animation communique, elle ne décore pas.** Rauno Freiberg (designer d'interface, ancien Vercel)
  résume le critère de qualité d'une interface animée par la **restriction** : le mouvement suit une
  hiérarchie — l'élément principal reçoit le geste le plus marqué, tout le reste reste discret, sinon
  le mouvement devient du bruit visuel plutôt qu'un guide d'attention (source : `rauno.me/craft`,
  consulté par WebFetch le 17 sept 2026 — page à rendu dynamique, contenu confirmé par extraction
  automatisée plutôt que lecture directe du HTML, à recouper si une citation exacte est nécessaire).
- **Le motion design professionnel classe l'animation par fonction, pas par effet de mode** :
  Material Design (Google) distingue une animation *informative* (montre ce qui change), *focalisante*
  (dirige l'œil vers ce qui compte) et *expressive* (porte la personnalité de la marque) ; Apple (HIG)
  et Nielsen Norman Group tiennent la même ligne — l'animation qui n'est ni l'un ni l'autre est un
  coût de charge cognitive et de performance sans bénéfice. **Non revérifié par fetch cette
  session** : le quota WebSearch était épuisé (200/200) et les pages `m3.material.io`,
  `developer.apple.com/design/human-interface-guidelines/motion` et `nngroup.com` n'ont pas pu être
  récupérées en contenu textuel exploitable (rendu JavaScript, ou 404 sur l'URL testée) — reconstitué
  depuis la connaissance générale du sujet, à confirmer avant citation publique exacte.
  `prefers-reduced-motion` (chaque effet du moteur a un repli, voir `docs/ANIMATIONS.md` en-tête) est
  la traduction opérationnelle directe de cette ligne, déjà en place dans `motion.ts`.
- **Un artisan qui anime tout perd la course à celui qui n'anime rien.** Le teardown « Ce que les
  sites français d'artisans font mal » (`docs/veille/references.md` § 6) ne parle pas d'un excès
  d'animation mais d'un défaut d'intention (hiérarchie typographique plate, images mélangées stock/
  réel, preuve sociale absente) — le même défaut d'intention existe côté mouvement : un site qui fait
  clignoter/rebondir tout par réflexe de template est aussi peu crédible qu'un site totalement figé. Le
  contre-exemple SkinSpirit (`references.md` § 2.8) le confirme à l'inverse : ouvrir sur un carrousel
  promotionnel anime beaucoup, communique peu, et dessert le positionnement.

D'où la méthode : cinq questions, dans l'ordre, avant de choisir un seul `data-*`.

## 1. La méthode en 5 questions

Chaque question est illustrée avec le même exemple de bout en bout : **un dentiste**, cabinet
individuel, mandat imposé « rassurer un public qui redoute la visite ». La fiche complète est en § 3.

### (a) Quel est le geste ou l'objet central du métier — ce qu'on peut montrer en mouvement sans mentir ?

Toute animation de contenu (pas de décor) doit représenter quelque chose de vrai chez ce client
précis : un geste qu'il fait réellement, un lieu qu'il occupe réellement, une matière qu'il travaille
réellement. `CLAUDE.md` règle 2 (« jamais de donnée inventée ») s'applique autant au mouvement qu'au
texte : animer un chiffre non fourni par le brief ou une scène qui ne s'est jamais produite est le
même mensonge qu'un faux avis, juste rendu en CSS plutôt qu'en texte.

Deux catégories de métiers se distinguent ici :

- **Le geste est montrable et vend** (ferronnier qui forge, menuisier à l'établi, boulanger qui
  pétrit, tatoueur qui trace) → séquence d'images (`data-frames`), tracé SVG (`data-draw-svg`),
  matière en gros plan (`data-parallax`, `data-duotone`). Le moteur a été construit précisément pour
  ce cas (`data-frames`, ajouté le 17 sept 2026 pour `forge-delacroix`, cf. journal `OBJECTIF.md`).
- **Le geste est anxiogène, intime ou juridiquement délicat à montrer** (un détartrage, une aiguille,
  un dossier de divorce, une manipulation ostéopathique) → on n'anime jamais le geste lui-même. On
  anime ce qui *entoure* le geste et rassure : le lieu, le rituel, la durée, l'équipe, le raisonnement.
  Clinique La Prairie (`references.md` § 2.4) et Tend (`references.md` § 2.5) suivent cette règle à la
  lettre : aucune blouse, aucun instrument, aucune photo de soin.

**Dentiste :** le geste central (détartrage, soin) est explicitement exclu — c'est la source de
l'anxiété que le site doit désamorcer, pas illustrer. L'objet montrable à la place : **la salle
d'attente/le cabinet en lumière naturelle** (ce que le patient voit avant même de s'asseoir dans le
fauteuil) et **le déroulé du rendez-vous** (ce qui le rassure vraiment : savoir à quoi s'attendre).

### (b) Quelle émotion le client vient chercher, et quel rythme va avec ?

Cinq émotions reviennent dans les 27 métiers de l'atelier — chacune appelle un palier de `site.motion`
et un tempo, pas une liste d'effets :

| Émotion | Rythme | Paliers typiques | Métiers |
|---|---|---|---|
| **Rassurer** | lent, ample, peu d'éléments en mouvement simultané | `subtle`, parfois `rich` sur un seul bloc | santé, réglementé, tout ce qui touche à l'intime ou à l'argent lourd |
| **Envie / appétit** | vif, sensoriel, matière en gros plan | `rich` | restaurant, boulangerie, food truck, fleuriste, institut |
| **Urgence** | immédiat, aucun temps mort avant l'action | `none` à `subtle`, jamais `rich` en hero | plombier, serrurier, électricien (dépannage), couvreur |
| **Confiance / preuve** | posé, démonstratif, avant/après | `subtle` | artisans du bâtiment, garage, maçon, agence immobilière |
| **Prestige / envie feutrée** | très lent, un seul mouvement à la fois | `rich`, mais discret | architecte, luxe, spa, avocat, ferronnier d'art |

Ce tableau reprend la logique de classification Material Design citée en § 0 (informatif/focalisant/
expressif), adaptée aux 27 métiers de l'atelier plutôt qu'à une interface logicielle.

**Dentiste :** émotion = rassurer (la peur du dentiste est le frein n°1 de la prise de rendez-vous,
plus que le prix ou la localisation). Rythme = lent, un seul mouvement à l'écran à la fois, jamais deux
`data-*` riches qui se déclenchent en même temps au scroll.

### (c) Quelle est la preuve que le site doit rendre tangible ?

Une émotion ne suffit pas à convaincre — il faut un fait vérifiable qui la soutient. Les 30 teardowns
de `references.md` répètent tous la même famille de preuves, dans cet ordre de force décroissante pour
un artisan/TPE local : **avant/après** (`data-compare`) > **durée réelle d'une prestation**
(`data-count-bar`, `data-counter`) > **équipe nommée** (Six Physio, `references.md` § 2.7 : « les
praticiens sont individuellement présentés... c'est ce qui construit la confiance dans un métier de
relation individuelle ») > **lieu physique** (`data-reveal="mask"`, `data-parallax`) > **matière**
(`data-duotone`, macro-photo). Un chiffre marketing pur (« +500 clients ») n'est pas une preuve : c'est
une allégation, interdite sans preuve chiffrée par `docs/REDACTION.md` § 1.

Nuance à observer pour les chiffres réels et modestes (3 vétérinaires, 17 ans d'activité — cf. journal
`veto-du-drac`, `docs/OBJECTIF.md`) : un fait vrai mais petit n'a pas toujours besoin d'un
`data-counter` qui compte à l'écran — l'effet appelle un temps de lecture que le chiffre ne mérite pas
forcément. Réserver `data-counter`/`data-counter-flip` à un chiffre qui a une vraie valeur
démonstrative (durée, nombre d'options, capacité), pas à décorer un fait déjà court à lire.

**Dentiste :** la preuve n'est pas un chiffre de patients (interdit, jamais vérifiable) ni un avant/
après buccal (anxiogène, limite déontologique) — c'est **la durée réelle d'un rendez-vous** (une
consultation dure X minutes, un détartrage Y minutes : `data-count-bar`) et **le déroulé annoncé à
l'avance** (accueil → explication → soin → conseils : `data-sticky-stack` ou `data-stack`), qui
transforme l'inconnu (source de l'anxiété) en séquence prévisible.

### (d) Où va l'attention — la règle du « seul feu d'artifice » ?

C'est la règle la plus citée dans `docs/OBJECTIF.md` sans jamais avoir été formulée : chaque site
dessiné à la main a **un** bloc qui concentre l'essentiel du budget d'animation riche (le mandat
« dépasse le minimum de cinq effets » est presque toujours atteint par un seul bloc dense, jamais
réparti uniformément) — `Rituels.astro` chez `maison-aurore` (`data-sticky-stack` pur, aucune photo,
trois panneaux), le hero à trois planches de `atelier-lecerf` (`data-horizontal`), la séquence
`data-frames` du « Geste » chez `forge-delacroix`. Le reste du site (nav, footer, sections
courantes) reste en `data-reveal`/`data-stagger` sobres. C'est la version opérationnelle de la
hiérarchie de mouvement décrite par Rauno Freiberg (§ 0) : un site qui anime dix blocs avec la même
intensité n'a pas de hiérarchie, donc pas de signature.

Concrètement, au moment de choisir la composition (étape 3 et 7 de `.claude/skills/nouveau-site/
SKILL.md`) : désigner **un seul** bloc « signature » qui peut porter 2-3 effets `rich` combinés
(`data-sticky-stack` + `data-draw-svg`, `data-frames` + `data-pin-step`...), et garder tous les autres
blocs à 1 effet `subtle` maximum (`data-reveal`, `data-stagger`, `data-count-bar`).

**Dentiste :** le bloc signature est « Le rendez-vous, minute par minute » (§ 3) — seul bloc en
`data-sticky-stack` + `data-count-bar` combinés. Le hero et le bloc équipe restent en `data-reveal`
simple.

**Fond shader (`data-shader`, `docs/ANIMATIONS.md`) :** un fond WebGL lent sur un hero sans photo
**est** le feu d'artifice de la page, même s'il ne bouge presque pas — il occupe le GPU en continu
et concentre le regard sur le premier écran. Un site qui l'utilise garde tous ses autres blocs en
`subtle` (`data-reveal`, `data-stagger`, `data-count-bar`) : jamais `data-shader` + marquee, ni
`data-shader` + `data-frames`/`data-horizontal`/`data-stack` sur la même page.

### (e) Ce qu'il ne faut jamais animer pour ce métier

L'interdiction se lit à trois niveaux, du plus général au plus spécifique :

1. **La règle dure de tout le repo** (`CLAUDE.md` règle 2) : jamais de `data-counter`/
   `data-counter-flip` sur un chiffre non fourni par le brief, jamais de `proof` remplie sans preuve
   réelle — un faux avis animé reste un faux avis (illégal, art. L121-2 Code de la consommation, déjà
   cité dans `docs/BRIEF.md`).
2. **La règle par famille d'émotion** — c'est la formulation demandée par le fondateur :
   - **Santé / réglementé** (dentiste, ostéopathe, vétérinaire, avocat, coach sportif dès qu'il promet
     un résultat corporel) : `data-shader` **recommandé** en hero quand le brief n'apporte aucune photo
     (conseil, santé, studios de création, tech : un fond `mesh`/`silk` lent aux couleurs de la
     direction donne de la matière sans inventer d'image, `docs/veille/shaders.md`) ; jamais `data-confetti` (frivole face à un sujet de santé/argent lourd),
     jamais de `data-marquee`/`data-marquee-velocity` (le défilement vend un catalogue, pas une
     relation de confiance), jamais de compteur qui ressemble à une statistique commerciale même si le
     chiffre est réel (voir nuance en § 1c), jamais de comparaison avec un confrère nommé
     (`docs/REDACTION.md` § 3).
   - **Urgence** (plombier, serrurier, électricien en dépannage) : jamais de séquence qui retarde le
     numéro de téléphone — proscrire `data-frames`, `data-pin` long, `data-smooth` (Lenis) ou un fond
     `data-shader` en hero (un chunk WebGL de plus avant le numéro, et une « ambiance » là où il faut
     une réponse) ;
     le bug déjà documenté sur `dubois-plomberie` (lien `tel:` sorti des 1500 premiers caractères à
     cause d'un badge placé avant le bouton d'appel, corrigé par réordonnancement DOM) est le même
     principe appliqué au HTML plutôt qu'au motion — l'urgence ne tolère aucune friction, animée ou
     non.
   - **Commerce / envie** (boulangerie, food truck, fleuriste, brasserie) : `data-confetti` et
     `data-marquee-velocity` sont au contraire appropriés (succès de commande, carte qui vit) — c'est
     la seule famille où ils sont recommandés plutôt que tolérés.
     `data-shader` n'y a pas sa place non plus, ni chez l'artisan chaleureux (boulanger, ébéniste,
     paysagiste) : la matière vient de la photo du produit ou de l'atelier, `data-grain` suffit sur
     un fond uni — un fond GPU « tech » y sonne faux.
3. **La règle par contrainte réglementaire du métier**, au-delà du motion : brasserie artisanale
   (Loi Évin — jamais associer alcool et image de performance sportive/séduction/jeunesse, quel que
   soit l'effet utilisé), profession réglementée (CNB pour l'avocat, Ordre pour le vétérinaire —
   `docs/veille/redaction-images.md` § 1.3-1.4, déjà appliqué à `lemaire-avocats`/`veto-du-drac`).

**Dentiste :** jamais de compteur de patients, jamais de confetti, jamais de marquee, jamais de photo
de soin/instrument même en fond flou, jamais de comparaison avec un autre cabinet.

## 2. Table des 27 métiers

Colonnes : émotion dominante · rythme (`site.motion` conseillé) · objet central (ce qu'on montre) ·
bloc signature recommandé (composition + `data-*` précis, la règle du § 1d) · 2 effets secondaires max
· effets interdits pour ce métier · référence en ligne trouvée par WebFetch (URL + une ligne), quand
une a pu être vérifiée cette session.

Les 20 premières lignes sont des métiers déjà dessinés à la main (`docs/OBJECTIF.md` § « Métiers
couverts ») — le bloc signature décrit ce qui a réellement été construit, validé par `ff verifier`/
`ff captures`, pas une simple proposition. Les 7 dernières (21-27) sont les métiers encore à couvrir :
propositions à appliquer au prochain tour qui les traite.

| # | Métier (site) | Émotion | Rythme | Objet central | Bloc signature | 2 secondaires max | Interdits | Référence en ligne |
|---|---|---|---|---|---|---|---|---|
| 1 | Ferronnerie d'art (`forge-delacroix`) | Prestige artisanal | lent, ample | le geste de forge, la pièce qui prend forme | « Le geste » : `data-frames` (séquence photo réelle) + `data-pin` | `data-tilt-glare` (reflet du métal), `data-reveal="mask"` | compteur de pièces, confetti, marquee | aucune trouvée précisément ; proche en esprit de Patrick Roger — [patrickroger.com](https://www.patrickroger.com/) (`references.md` § 3.1, sculpteur-artisan, tracking large sur les titres plutôt que la taille pour le ton haut de gamme) |
| 2 | Ostéopathe (`osteo-marchand`) | Rassurer | lent | la salle, jamais la manipulation | `data-reveal="mask"` lent sur la salle + `data-count-bar` durée de séance | `data-draw`, `data-stagger` | compteur de patients, avant/après corporel, confetti, marquee | Six Physio — [sixphysio.com](https://www.sixphysio.com/) (`references.md` § 2.7, praticiens nommés individuellement plutôt qu'une équipe anonyme) |
| 3 | Tatoueur (`encre-noire`) | Envie / prestige artistique | rich, expressif | le trait qui se dessine | `data-draw-svg` (trait qui se trace) + galerie `data-trail` | `data-tilt-glare`, `data-scramble` | confetti (dilue le sérieux artistique), rythme mou | Seven Doors Tattoo — [sevendoorstattoo.com](https://www.sevendoorstattoo.com/) (`references.md` § 3.6, *à éviter* : animations par défaut de plateforme sans direction artistique propre) |
| 4 | Restaurant (`chez-malo`) | Envie / appétit | rich, vif | le plat, la matière | Carte : `data-flip-card` plats + `data-scramble` prix | `data-marquee-velocity`, `data-reveal="blur"` | compteur de couverts inventé | TAB Kitchen & Bakery — [tabkitchenbakery.com](https://tabkitchenbakery.com/) (`references.md` § 1.3) |
| 5 | Couvreur (`toits-cie`) | Confiance / preuve | subtle, direct | le chantier, la charpente | `data-compare` avant/après toiture + `data-count-bar` (garantie décennale) | `data-tilt`, `data-reveal="clip"` | rythme lent qui retarde le devis, confetti | aucune trouvée ; contraste avec `references.md` § 6 (artisans BTP français, avant/après jamais structuré) |
| 6 | Photographe de mariage (`anna-vidal`) | Émotion pure | lent, cinématographique | l'instant capturé | Galerie plein cadre `data-horizontal` + `data-hover-img` | `data-duotone`, `data-grain` | compteur de mariages, marquee, confetti (trop kitsch pour un rendu éditorial) | Christie Hemm Klok — [christiehemmklok.com](https://christiehemmklok.com/) (`references.md` § 3.3) |
| 7 | Garage (`moteur-fils`) | Confiance / proximité | rapide, direct | la voiture, le geste mécanique | `data-compare` avant/après réparation + `data-flip-card` symptôme→cause | `data-tilt`, `data-stagger` | lenteur cinématique, confetti | aucune trouvée précisément ; contraste `references.md` § 6 |
| 8 | Plombier urgence (`dubois-plomberie`) | Urgence | quasi nul | l'intervention, les étapes | `data-flip-card` diagnostic + `data-sticky-stack` (4 étapes courtes) | `data-spotlight` (contact), `data-counter-flip` (ancienneté réelle) | `data-frames`/`data-pin` long en hero, `data-smooth`, confetti | contre-exemple volontaire : Clinique La Prairie — [cliniquelaprairie.com](https://www.cliniquelaprairie.com/) (`references.md` § 2.4, formulaire multi-étapes — le geste inverse de ce qu'il faut faire en urgence) |
| 9 | Coiffure/barbier (`barbier-kessler`) | Envie / style | rich | la coupe, le geste du rasoir | Galerie `data-trail` + équipe `data-stack` | `data-spotlight`, `data-scroll-progress` | compteur inventé, fausse urgence | Ludlow Blunt — [ludlowblunt.com](https://www.ludlowblunt.com/) (`references.md` § 2.1) |
| 10 | Paysagiste (`jardins-mael`) | Rassurer / envie saisonnière | lent, ample | la transformation du jardin dans le temps | 4 saisons en `data-sticky-stack` + `data-draw-svg` (branche) | `data-parallax-depth`, `data-drag-grid` | urgence, confetti | Cinq Mondes — [cinqmondes.com](https://www.cinqmondes.com/) (`references.md` § 2.3, macro-photo du geste avec léger parallax) |
| 11 | Boulangerie-pâtisserie (`maison-roux`) | Envie / chaleur | rich, joyeux | la fournée, le geste du pétrissage | « La fournée » : `data-sticky-stack` horaire + `data-flip-card` (gâteaux) | `data-scramble` (prix), `data-border-beam` (spécialité) | ton réglementé (hors sujet) | Lune Croissanterie — [lunecroissanterie.com](https://lunecroissanterie.com/) (`references.md` § 3.4) |
| 12 | Architecte d'intérieur (`studio-ambre`) | Prestige feutré | très lent | le plan, la matière (échantillons) | Matériaux `data-drag-grid` + plans `data-draw-svg` | `data-stack` (typologies), `data-accordion` (méthode) | confetti, marquee, compteur | Rodolphe Parente — [rodolpheparente.com](https://rodolpheparente.com/) (`references.md` § 4.3, fond papier plutôt que blanc clinique) |
| 13 | Électricien/domotique (`ampere-fils`) | Confiance technique | subtle, rapide | le schéma, le geste de raccordement | Schéma de raccordement `data-draw-svg` + tableau `data-flip-card` | `data-count-bar` (puissances IRVE réelles), `data-sticky-stack` | fausse urgence 24/24, lenteur cinématique en hero | aucune trouvée précisément ; registre proche du BTP, `references.md` § 6 en négatif |
| 14 | Vétérinaire (`veto-du-drac`) | Rassurer (propriétaires anxieux) | lent, calme | la salle, jamais l'animal « mignon » de stock | « Préparer sa visite » `data-flip-card` (6 conseils) + pouls `data-draw-svg` | `data-parallax-depth`, `data-blur-scrub` (léger) | `data-compare` (hors sujet en santé animale), confetti, marquee | aucune trouvée précisément dans les galeries consultées cette session |
| 15 | Cabinet d'avocat (`lemaire-avocats`) | Confiance / sérieux | lent, nul | le mot, le raisonnement — pas de geste filmable | `data-text-fill` (phrase hero) + `data-accordion="single"` (domaines) | `data-count-bar` (durée du rendez-vous), `data-draw` (trait vertical) | compteur de dossiers gagnés, confetti, marquee, comparaison avec un confrère (déontologie CNB) | aucune trouvée précisément ; principe de tagline éditoriale confirmé sur Clinique La Prairie — [cliniquelaprairie.com](https://www.cliniquelaprairie.com/) (`references.md` § 2.4, `data-text-fill`) |
| 16 | Menuisier-ébéniste (`atelier-lecerf`) | Confiance / matière | lent, ample | le bois, le geste de l'établi | Hero 3 essences `data-horizontal` + « Fabrication » `data-stack` (4 étapes) | `data-tilt-glare` (planches), `data-drag-grid` (matières) | compteur, confetti, urgence | Frances Palmer Pottery — [francespalmerpottery.com](https://www.francespalmerpottery.com/) (`references.md` § 3.5) |
| 17 | Institut de beauté/spa (`maison-aurore`) | Rassurer / sensoriel | très lent, quasi-silence | le rituel, pas la vente de produit | « Rituels » : 3 panneaux `data-sticky-stack` purement typographiques | `data-duotone` + `data-parallax` (hero), `data-flip-card` (bons cadeaux) | compteur, confetti, marquee rapide, urgence | Cinq Mondes — [cinqmondes.com](https://www.cinqmondes.com/) et Dr Sebagh — [drsebagh.com](https://www.drsebagh.com/) (`references.md` § 2.3 et § 2.6) |
| 18 | Food truck/traiteur (`cantine-roulante`) | Envie / mouvement | rich, festif | le camion, la semaine, le plat qui bouge | `data-marquee-velocity` (plats du jour) + « Traiteur » `data-stack` + `data-count-bar` (capacité) | `data-confetti` (succès de commande), `data-compare` (avant/après remorque) | ton réglementé (hors sujet) | TAB Kitchen & Bakery — [tabkitchenbakery.com](https://tabkitchenbakery.com/) (`references.md` § 1.3, analogue le plus proche trouvé) |
| 19 | Auto-école (`auto-ecole-rabelais`) | Rassurer (examen stressant) | modéré | le parcours de l'élève, pas la route filmée artificiellement | « Parcours » en étapes (`data-stack`/`data-accordion`) + `data-count-bar` (forfaits/heures) | `data-reveal="mask"`, `data-stagger` | compteur « % de réussite » (invérifiable/trompeur), confetti sur la prise de contact | aucune trouvée dans les galeries consultées cette session |
| 20 | Chambres d'hôtes (`borie-des-chenes`) | Envie / évasion, rassurer | lent, ample | le lieu, la lumière | Chambres `data-flip-card` + `data-count-bar` (disponibilités) | `data-parallax` (hero), `data-reveal="mask"` | compteur artificiel, urgence | Secret Garden Stresa — [secretgardenstresa.com](https://secretgardenstresa.com/) (`references.md` § 1.7) |
| 21 | Coach sportif / yoga (à couvrir, Lille) | Énergie mesurée (coach) ou calme (yoga) — trancher au brief | rich rapide / lent selon sous-type | le mouvement du corps en séance, jamais un « avant/après » corporel | `data-frames` (séquence d'un mouvement réel) ou `data-stack` (étapes de séance) + `data-count-bar` (durée) | `data-tilt`, `data-reveal="scale"` | avant/après corporel, promesse de résultat physique chiffré (allégation santé), confetti | Six Physio — [sixphysio.com](https://www.sixphysio.com/) (`references.md` § 2.7, hero en photo d'action plutôt qu'un intérieur figé) |
| 22 | Serrurier urgence (à couvrir, Marseille) | Urgence pure | nul à rapide | la porte, le délai d'intervention | Numéro géant fixe + `data-count-bar` (délai réel d'intervention) | `data-spotlight` (contact), `data-counter-flip` (ancienneté réelle) | tout ce qui retarde le numéro : `data-frames`, `data-pin` long, `data-smooth`, confetti | contre-exemple volontaire : Ludlow Blunt — [ludlowblunt.com](https://www.ludlowblunt.com/) (`references.md` § 2.1, la friction comme signal de luxe est l'exact inverse de ce que veut un client en détresse) |
| 23 | Fleuriste (à couvrir, Bordeaux) | Envie / délicatesse | lent à moyen, sensoriel | la fleur, le geste du bouquet | Galerie `data-trail`/`data-hover-img` (bouquets) + `data-flip-card` (occasions : mariage, deuil, anniversaire) | `data-parallax`, `data-reveal="blur"` | compteur, urgence dramatisée (même en cas de livraison jour même, rester sobre) | Cinq Mondes — [cinqmondes.com](https://www.cinqmondes.com/) (`references.md` § 2.3, macro-photo du geste) |
| 24 | Maçon/rénovation (à couvrir, Metz) | Confiance / preuve (décision lourde) | modéré, laisse le temps de lire | le chantier avant/après | `data-compare` (gros plan avant/après) + « Étapes de chantier » `data-sticky-stack` | `data-count-bar` (garantie décennale), `data-tilt` | confetti, compteur de chantiers inventé, rythme rapide qui bâcle la lecture | aucune trouvée ; contraste `references.md` § 6 (mélange stock/réel dans les carrousels d'artisans BTP français) |
| 25 | Dentiste (à couvrir, Reims) | Rassurer (anxiété dentaire) | lent, calme | la salle, jamais le soin | « Le rendez-vous, minute par minute » : `data-sticky-stack` (étapes) + `data-count-bar` (durée) — voir fiche § 3 | `data-flip-card` (avant la 1re visite), `data-reveal="mask"` lent (salle) | compteur de patients, confetti, marquee, photo de soin/instrument, comparaison avec un confrère | Tend — [hellotend.com](https://www.hellotend.com/) (`references.md` § 2.5, studio dentaire qui « désinfecte visuellement » le sujet par la couleur et le portrait plutôt que la clinique) |
| 26 | Brasserie artisanale (à couvrir, Clermont-Ferrand) | Envie / authenticité | rich, moyen | le brassage, la matière (houblon, mousse) | Processus de brassage `data-draw-svg`/`data-frames` + `data-marquee-velocity` (bières du moment) | `data-tilt-glare` (reflet du verre), `data-count-bar` (IBU/degré) | ciblage jeunesse/sport/séduction (Loi Évin, au-delà du motion), compteur santé-style | 11 Bar — [11elevenbar.com](https://www.11elevenbar.com/) (`references.md` § 1.6) |
| 27 | Agence immobilière de quartier (à couvrir, Toulon) | Confiance / prestige local | modéré | le bien, le quartier — jamais l'agent en vedette | `data-compare` (bien rénové) + galerie `data-horizontal` (quartier) | `data-flip-card` (biens), `data-count-bar` (délai de vente moyen si réel) | compteur de ventes inventé, confetti, `data-marquee` qui évoque une promotion/solde | contre-exemple volontaire : SkinSpirit — [skinspirit.com](https://www.skinspirit.com/) (`references.md` § 2.8, *à éviter* : ouvrir le hero sur un carrousel promotionnel plutôt qu'un résultat) |

## 3. Fiche dentiste complète — démonstration

Client démonstratif (méthode uniquement, aucun site à générer) : cabinet dentaire individuel, Reims,
mandat imposé « rassurer un public qui redoute la visite » — le métier 25 de la table ci-dessus.
Direction cohérente avec ce mandat, sur le même principe que `veto-du-drac`/`maison-aurore` (santé/
bien-être, jamais `signal`/`brut`/`industriel`) : `clair` ou `nordique`, motion `subtle` avec un seul
bloc `rich`.

### Hero

**Composition :** pas de sourire de stock, pas d'instrument — une photo plein cadre de la salle
d'attente ou du cabinet, lumière naturelle, cadrage large et posé (jamais un gros plan qui pourrait
laisser deviner un fauteuil/une seringue en arrière-plan flou). Texte hero au-dessus, aligné à gauche,
espace généreux.

**Texte d'exemple** (test du hero, `docs/REDACTION.md` § 5 — 6-12 mots, compréhensible seul) :
« Un cabinet dentaire pensé pour vous mettre à l'aise, à Reims. »
Sous-texte court : « Consultations, soins et urgences — chaque étape vous est expliquée avant de
commencer. »

**Effets :** `data-reveal="mask"` (lent) sur la photo, `data-reveal="blur"` + `data-reveal-delay="150"`
sur le texte. Pas de `data-split="chars"` (le bug documenté sur `veto-du-drac` coupe des mots courts
type « NAC » en pleine syllabe — même risque ici sur un texte multi-mots ; `data-split` en mode mots,
sans argument, si une révélation en cascade est voulue).

**Pourquoi :** applique (a) — le geste (le soin) est explicitement absent ; (b) — rythme lent, aucune
urgence de conversion (un patient qui a peur ne se précipite pas, il a besoin de temps) ; (e) — aucun
instrument visible.

### Bloc 1 — « Avant votre première visite »

**Composition :** grille de 4 à 6 cartes `data-flip-card` (recto/verso, hover desktop + tap mobile,
comme `ampere-fils`/`maison-roux`). Recto = une appréhension formulée simplement, à la première
personne du patient. Verso = comment le cabinet y répond concrètement.

**Textes d'exemple :**
- Recto « J'ai peur d'avoir mal. » → Verso « Chaque geste est expliqué avant d'être fait. Vous pouvez
  demander une pause à tout moment. »
- Recto « Je n'y suis pas allé depuis longtemps. » → Verso « Aucun jugement : le premier rendez-vous
  sert à faire un point, pas à tout traiter d'un coup. »
- Recto « Je ne sais pas ce que ça va coûter. » → Verso « Le devis est présenté et expliqué avant tout
  soin, jamais après. »
- Recto « J'ai un enfant à emmener. » → Verso « Les rendez-vous enfants sont pensés pour rassurer
  autant que soigner. » *(uniquement si le cabinet reçoit des enfants — donnée à vérifier au brief,
  sinon cette carte disparaît, `CLAUDE.md` règle 2)*

**Pourquoi :** applique (c) — la preuve n'est pas un chiffre, c'est une réponse à une peur nommée ;
(d) — reste en `subtle` (`data-flip-card` est déjà classé `subtle` dans `docs/ANIMATIONS.md`), ne
concurrence pas le bloc signature suivant.

### Bloc 2 — « Le rendez-vous, minute par minute » (bloc signature)

**Composition :** panneaux empilés `data-sticky-stack` (comme `maison-aurore/Rituels.astro` ou
`ampere-fils/Normes.astro`), un par étape réelle du rendez-vous : accueil → explication du soin →
soin → conseils de suivi. Chaque panneau affiche une durée réelle en `data-count-bar` (ex. « Contrôle :
20 min » / « Détartrage : 30 min » — valeurs à faire confirmer par le cabinet au brief, jamais
inventées) plutôt qu'un chiffre nu, pour rendre visible qu'un rendez-vous a un début et une fin connus
d'avance.

**Texte d'exemple par étape :**
1. « Accueil — on prend le temps de vous installer et de répondre à vos questions. »
2. « Explication — le praticien vous montre et vous explique avant de commencer. »
3. « Soin — vous êtes informé à chaque étape, une pause est toujours possible. »
4. « Conseils — ce qu'il faut faire (ou ne pas faire) après le rendez-vous. »

**Pourquoi c'est le seul bloc riche du site (§ 1d) :** c'est la réponse directe à la peur la plus
citée pour ce métier — l'inconnu. C'est le seul endroit du site qui mérite deux effets combinés
(`data-sticky-stack` + `data-count-bar`) ; hero et bloc 1 restent volontairement plus sobres pour que
celui-ci se détache.

### Bloc 3 — « L'équipe et le cabinet »

**Composition :** portraits du praticien/de l'équipe (si fournis par le brief — sinon le bloc s'adapte
sans portrait, jamais de photo de stock, `docs/BRIEF.md` § 8) en `data-reveal="mask"`, plus une
seconde photo du cabinet (salle de soin vue de loin, pas de gros plan sur le matériel) en
`data-duotone` pour unifier la palette avec le reste du site.

**Texte d'exemple :** « [Prénom], chirurgien-dentiste depuis [année réelle]. » — jamais de « spécialiste »
sans le titre officiel qui le justifie (`docs/REDACTION.md` § 3, professions réglementées).

**Pourquoi :** applique (c) — l'équipe nommée est une preuve de confiance individuelle (même logique
que Six Physio, `references.md` § 2.7) ; reste sobre pour ne pas retirer d'attention au bloc 2.

### Effets écartés pour ce site, et pourquoi

- `data-counter`/`data-counter-flip` sur un nombre de patients : jamais fourni de façon vérifiable,
  et même vérifiable, ressemblerait à une statistique commerciale déplacée en contexte de santé (§ 1e).
- `data-confetti` : aucun moment de « succès » festif à célébrer sur un site de santé — la prise de
  rendez-vous n'est pas un achat impulsif.
- `data-marquee`/`data-marquee-velocity` : évoque un catalogue qui défile (restaurant, boulangerie),
  pas une relation de confiance individuelle.
- `data-frames` (séquence façon Apple) : magnifique pour un geste qu'on veut montrer (voir
  `forge-delacroix`) — mais ici le geste est justement ce qu'on ne montre pas.

## 4. Intégration dans le processus

Trois fichiers mis à jour pour que la méthode soit appliquée à chaque tour, pas seulement lue une fois :

- **`.claude/skills/nouveau-site/SKILL.md`**, étape 3 (choix de la direction/motion) et étape 7 (bloc
  sur mesure) : sous-étape « Choisir quoi animer » qui applique les 5 questions du § 1 ci-dessus et
  renvoie à la table du § 2.
- **`docs/BRIEF.md`**, section 12 (ressenti du client / choix de la direction) : deux questions à poser
  au client pendant l'appel — « Qu'est-ce qu'on pourrait filmer chez vous en 5 secondes ? » et « Quand
  un client hésite, qu'est-ce qui le rassure ? » — pour nourrir directement les questions (a) et (c) de
  la méthode.
- **`docs/OBJECTIF.md`**, critère 17 : « Méthode quoi animer par métier ».
- **`CLAUDE.md`**, § « Où sont les choses » : une ligne pointant vers ce document.
