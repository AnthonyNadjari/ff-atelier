# Direction — L'Épi d'Or, boulangerie-pâtisserie à Orléans, version B (prospect-epi-dor-b)

Démo PRIVÉE pour un vrai commerce prospecté (données publiques du 17 oct 2026, `legal.prospect`), deuxième des quatre
versions (A = `prospect-epi-dor`, la devanture plein cadre et sa carte posée dessus). Lecture de cette version : **une
boutique où l'on vient**. Ce qu'un client cherche avant de passer, c'est le lieu, l'heure et ce qu'il trouvera au
comptoir ce jour-là ; la devanture reste donc à l'écran pendant toute la visite, et la page se lit comme la carte
d'un café posée à côté.

Style : mélange <typo:relaisrossar · couleurs:studenterkilden · densite:coutumes · formes:cafebinocle · photos:pizza-amici · mouvement:cafebinocle · matiere:odysseeclinic> · Architecture : lieu-fixe · PREMIER ÉCRAN — famille : diptyque

(Tiré par `node scripts/ff.mjs melanger prospect-epi-dor-b --n 3`, mélange 2 de la série, appliqué avec tous ses atomes
imposés (un premier passage avait vu l'atome matière retiré en silence : `--matiere` était lu comme le drapeau booléen
de `ff vitrine` ; corrigé dans `scripts/ff/melanger.mjs`, testé). Architecture et famille imposées : celles de cette version.)

## Aiguillage
Photos : les photos du client sont la matière (10 reçues) ; au moins une piste bâtie autour de la meilleure : ici la
devanture du soir, fixée à l'écran, et les gâteaux de la galerie en vitrine. Écartées : galerie-04 et galerie-05 (prénom
d'un enfant), galerie-07 (motif de super-héros), dans `raw/ecartees/`, jamais copiées dans `public/`.
Mouvement : vivant (le client n'a pas tranché : sur les trois nouvelles versions, B est la vivante, C et D les calmes),
`motion` subtle pour le moteur (les arches de la vitrine seulement) ; le reste est dessiné dans les sections sur mesure.

## Socle (docs/GOUT.md § 0)
- Pages : présent. Une page par famille du brief (le pain, pâtisseries et entremets, pièces montées, sandwichs, fêtes de
  l'année), ouvertes depuis la carte et depuis la vitrine. La nav, elle, est à ancres, comme la source (Le Petit Bleu :
  une page, Menu, About, Contact).
- Téléphone en haut : présent. Bouton « Appeler » dans la barre du téléphone ; à l'ordinateur, numéro dans l'en-tête de
  la colonne et dans le panneau « Nous trouver », toujours à l'écran.
- Métier + ville : présent, « Boulangerie-pâtisserie à Orléans. » juste sous le h1 « L'Épi d'Or ».
- Avis : présent. Juste sous l'accueil : 4,6 sur 5 sur Google, 162 avis (relevé du 17 oct 2026), puis les deux avis du
  brief signés d'un prénom, mot pour mot (Sylvia D., Marie C.).
- Ancienneté : absent : le brief dit « ? à demander avant d'afficher une date » (registre : 2001).
- Photos : présent. La devanture en grand, fixe ; huit gâteaux de la galerie en arches dans la vitrine ; une photo par
  page de rayon quand le brief en a. Aucune photo de pain : le pain se lit sur la carte.
- Portes : présent. Appeler ; Commander un gâteau (tiroir : numéro, e-mail, adresse, horaires ; la commande se fait au
  téléphone, aucun lien de commande au brief) ; Quel jour (le comptoir du jour) ; la carte vers les pages.

## Faits propres (tous tirés du brief)
1. La devanture « L'ÉPI D'OR » au 59 rue Maurice Dubois, Orléans ; téléphone 02 38 88 30 51.
2. Horaires : mardi au samedi 6 h 45 – 13 h et 15 h 30 – 19 h 30 ; dimanche 7 h – 12 h 30 ; lundi fermé ; « Fermé les
   après-midi des jours fériés ».
3. Baguette 4 Saisons « Que les weekends », Baguette Epi « Sur commande », Blédélice, Fleurisette, Baguette aux Noix Raisins.
4. 36 pièces montées au catalogue, « pour toutes les occasions », catégories Baptême, Religieux, Anniversaire, Autre.
5. Snackerie : Baguette aux Lardons, Baguette Poulet Crème (« couverte d'une fine couche d'emmental »).
6. Bûches de Noël : « Commandez au plus tôt pour vous assurer un Noël gourmand. »
7. Xavier, maître boulanger, formé à Blois, Souillac et même en Russie, des terres australes aux cuisines raffinées.
8. Miroslava, « Créatrice de Douceurs » ; Christelle, « Hôtesse des Délices » ; Pauline, « experte en café ».
9. Galerie du site : cœurs « St Valentin », œuf « Joyeuses Pâques », entremets aux fraises décor muguet, bûches de Noël.
10. Note Google 4,6 sur 162 avis ; Sylvia D. : « Sandwich à la commande généreusement garni ».

## Phrase-idée
« Sur ce site, la Baguette 4 Saisons qui ne se fait “que les weekends” devient un comptoir qu'on interroge jour par jour :
on touche samedi, la 4 Saisons est là, avec les heures du jour ; on touche lundi, la boutique dit qu'elle est fermée. »

## Test du concurrent
La boulangerie d'à côté a aussi des horaires : un sélecteur de jour seul serait l'idée du métier. Ce qui la rend à
L'Épi d'Or : SA règle de pain (la 4 Saisons du week-end, l'épi sur commande), SES horaires coupés (6 h 45 – 13 h, 15 h 30 –
19 h 30, dimanche matin seulement, lundi fermé), SA devanture fixée à côté. Sans ces trois faits il ne reste qu'un
calendrier. Résultat : l'idée tient, à condition que le comptoir ne dise rien qui ne vienne pas de la carte du brief.

## Contrat (six lignes)
- THÈSE : la boulangerie se visite comme un lieu, sa devanture toujours à l'écran pendant qu'on lit sa carte ; refuse le
  déroulé par défaut du métier (photo, avis, services, à propos, contact sur une longue page qui fait défiler la
  boutique hors de l'écran) et la version A (devanture plein cadre et carte posée dessus).
- SQUELETTE : architecture `lieu-fixe` (Le Petit Bleu) : à l'ordinateur deux moitiés, la devanture fixe à droite (état
  ouvert ou fermé, ligne du jour, « Nous trouver »), la colonne qui défile à gauche ; au téléphone l'accueil, puis le lieu,
  puis la colonne. Ordre : accueil (h1, métier à ville, Appeler, Commander un gâteau), avis, « Quel jour passez-vous ? »
  (le bloc), la carte en accordéons (`services/carte-prix`, lignes du brief sans prix), la vitrine en arches, l'histoire,
  pied d'une ligne. Navigation à ancres (modèle de la source) ; les pages des rayons s'ouvrent depuis la carte et la
  vitrine (gabarit fiche). Contact en tiroir. `ff ressemblance` : premier écran et déroulé sous 0,65 contre tous les sites.
- PREMIER ÉCRAN — famille : diptyque ; à l'ordinateur, texte à gauche, composé à fer à gauche sur le blanc (« L'Épi d'Or »
  en Bodoni de 96 px, métier à ville, deux portes : Appeler en aplat sable, Commander un gâteau en contour) et la devanture
  à droite sur toute la hauteur, vue par une grande ARCHE de vitrine (le masque des gâteaux de la vitrine), l'étiquette du
  jour dans l'arche, « Nous trouver » (adresse, numéro) en bas ; au téléphone, l'accueil puis la devanture en arche de
  62 % d'écran DESSOUS, jamais de texte posé sur la photo hors des deux étiquettes du lieu. (Planche des quatre versions,
  17 oct 2026 : la devanture en rectangle sous une carte d'accueil centrée rappelait trop la version A ; l'arche et
  l'accueil sans carte sont la correction.)
- MOUVEMENT :
  1. Entrée : la devanture recule doucement dans son cadre à l'ouverture, comme quand on s'écarte de la vitrine pour la
     voir entière (lent, 1,4 s, une fois). Raison : arriver. On transpose Relais Rossàr (`relaisrossar.md`) : le lieu
     d'abord, posé, sans effet sur le texte.
  2. Rythme : en arrivant à la vitrine, les arches de gâteaux se posent l'une après l'autre (sec, 0,2 s, 60 ms d'écart,
     une fois). Raison : regarder.
  3. Geste (le feu d'artifice) : on touche un jour de la semaine, le comptoir de ce jour se pose dessous (sec, 0,15 s) :
     ses heures, et le samedi et le dimanche la Baguette 4 Saisons ; le lundi, « fermé ». Raison : choisir. Aujourd'hui
     est choisi à l'arrivée (heure de Paris).
  4. Image : à l'ordinateur, la devanture reste fixe pendant que la carte défile à côté (deux vitesses, aucun calcul au
     défilement). Raison : profondeur.
  Courbes : SEC = ease-out 0,15 à 0,2 s (jour touché, arches, accordéons) ; LENT = ease-out 1,4 s pour la seule devanture.
- REFUSÉ : la devanture plein cadre avec une carte posée dessus (version A) ; une longue page « héros, avis, services, à
  propos, contact » ; « Depuis 2001 » ; prix (aucun au brief) ; vignettes rondes à initiale pour l'équipe (l'équipe est
  dite dans l'histoire) ; avis « D comme Découvrir » (pas un prénom) ; photos 04, 05, 07 ; capitales espacées hors des
  boutons du mélange ; titres qui se lèvent ; rideau.
- FIN : non relu = pas fini ; ce site se termine par le verdict du relecteur.

## Typographie, couleur, images
- Direction générée `m-e7e9e8` (mélange) : Bodoni Moda (titres, d'après Relais Rossàr) et Urbanist (texte) ; blanc
  `#fdfdfd`, encre presque noire `#161513`, sable doré `#ebbf7d` en aplat des boutons et de la carte d'accueil (assombri
  en `#8d5e16` quand il sert de texte, calcul AA de la commande). Boutons en capitales légèrement espacées (mesurés
  sur Relais Rossàr, 0,04 em) : seulement les boutons.
- Images : la devanture fixe ; huit photos de la galerie découpées en arches de vitrine (atome photos de pizza-amici :
  masque et chevauchement, une arche sur deux descend et passe devant avec une ombre portée). Jamais étirées.
- Calibration : pas crème + serif + terracotta (blanc, Bodoni, sable), pas noir + acide, pas de broadsheet, pas de cartes
  SaaS (rayon 8 px, aucune ombre hors des arches du devant).

## Références
- Relais Rossàr (`docs/veille/demontages/relaisrossar.md`) : la typographie (Bodoni maigre, texte clair) et l'entrée
  posée du lieu ; on garde la retenue, pas les photos plein écran.
- Pizza Amici (`docs/veille/demontages/pizza-amici.md`) : les photos découpées et qui se chevauchent ; on garde le
  masque (ici l'arche de vitrine) et le chevauchement d'une rangée sur l'autre.
- Architecture : Le Petit Bleu (`docs/veille/architectures/le-petit-bleu.md`) : le lieu fixe, la carte en accordéons,
  une page à ancres.

## Accepté par le fondateur
(rien encore)
