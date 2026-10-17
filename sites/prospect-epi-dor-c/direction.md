# Direction — L'Épi d'Or, boulangerie-pâtisserie à Orléans, version C (prospect-epi-dor-c)

Démo PRIVÉE pour un vrai commerce prospecté (données publiques du 17 oct 2026, `legal.prospect`), troisième des quatre
versions. Lecture de cette version : **ce que les clients en disent, puis les rayons**. 162 avis à 4,6 sur Google, c'est
ce qui rassure avant de commander une pièce montée ; son site actuel affiche encore 151. On met la note et deux avis
recopiés en tête, puis une porte par rayon qu'on fait glisser comme on longe une vitrine.

Style : mélange <typo:cafebinocle · couleurs:pizza-amici · densite:framer-lintel · formes:monarque · photos:meyers · mouvement:relaisrossar · matiere:coutumes> · Architecture : accueil-portes · PREMIER ÉCRAN — famille : preuve-d-abord

(Tiré par `node scripts/ff.mjs melanger prospect-epi-dor-b --n 3`, mélange 1 de la série, appliqué à cette version avec
tous ses atomes imposés.
Architecture imposée : celle de cette version ; la famille est celle que le mélange avait tirée.)

## Aiguillage
Photos : les photos du client sont la matière (10 reçues) ; au moins une piste bâtie autour de la meilleure : ici le
fraisier au muguet dans son cadre au premier écran, et une photo par porte quand le rayon en a. Écartées : galerie-04,
galerie-05 (prénom d'un enfant), galerie-07 (super-héros), dans `raw/ecartees/`.
Mouvement : calme (le client n'a pas tranché : sur les trois nouvelles versions, B est la vivante, C et D les calmes),
`motion` subtle ; rien ne suit le défilement, rien ne tourne tout seul.

## Socle (docs/GOUT.md § 0)
- Pages : présent. Une porte = une page (gabarit « porte » de l'architecture : photo, nom, phrase, photos du rayon en
  grille, bouton, adresse) pour le pain, les pâtisseries, les pièces montées, les sandwichs, les fêtes ; la nav les nomme.
- Téléphone en haut : présent. « Appeler » dans la barre du haut au téléphone ; à l'ordinateur, bouton plein
  « 02 38 88 30 51 » dans la nav et sous le h1.
- Métier + ville : présent, h1 « Boulangerie-pâtisserie à Orléans », « L'Épi d'Or, 59 rue Maurice Dubois » dessous.
- Avis : présent, c'est le premier écran : 4,6 en très grand, cinq épis remplis à la part près, « sur 5, 162 avis Google »,
  et les deux avis du brief recopiés mot pour mot (Sylvia D., Marie C.).
- Ancienneté : absent : le brief dit « ? à demander avant d'afficher une date ».
- Photos : présent. Le fraisier au muguet dans son cadre au premier écran ; les portes avec photo (pâtisseries, pièces
  montées, fêtes) passent devant ; le pain et les sandwichs, sans photo au brief, montrent leurs noms de produits en grand.
- Portes : présent. Appeler ; Commander un gâteau (tiroir : numéro, e-mail, adresse, horaires) ; une porte par rayon ;
  le pied de chaque page (rue, itinéraire, semaine, numéro), qui porte l'ancre du contact.

## Faits propres (tous tirés du brief)
1. Note Google 4,6 sur 162 avis ; son site affiche encore « 151 avis Google ».
2. Sylvia D. : « Très bon accueil. Sandwich à la commande généreusement garni et de très bonnes pâtisseries. »
3. Marie C. : « Les gâteaux sont excellents et les prix tout à fait raisonnables. »
4. 36 pièces montées au catalogue, « pour toutes les occasions », catégories Baptême, Religieux, Anniversaire, Autre.
5. Baguette 4 Saisons « Que les weekends », Baguette Epi « Sur commande », Blédélice, Fleurisette.
6. Snackerie : Baguette aux Lardons, Baguette Poulet Crème.
7. Bûches de Noël : « Commandez au plus tôt pour vous assurer un Noël gourmand. »
8. Galerie du site : entremets aux fraises décor muguet, cœurs « St Valentin », œuf « Joyeuses Pâques », bûches de Noël.
9. La devanture au 59 rue Maurice Dubois, Orléans ; téléphone 02 38 88 30 51.
10. Horaires : mardi au samedi 6 h 45 – 13 h et 15 h 30 – 19 h 30 ; dimanche 7 h – 12 h 30 ; lundi fermé.

## Phrase-idée
« Sur ce site, la note de 4,6 sur 162 avis devient l'étiquette du comptoir : un chiffre géant, cinq épis remplis à la part
près (le cinquième aux six dixièmes), et les deux avis recopiés posés dessous comme deux tickets décalés. »

## Test du concurrent
Une autre boulangerie bien notée pourrait mettre sa note en grand : l'idée seule est celle du métier. Ce qui la rend à
L'Épi d'Or : SES chiffres exacts (4,6, 162, et le dernier épi à 0,6 plutôt qu'une étoile arrondie), SES deux avis mot pour
mot (le sandwich à la commande, les gâteaux et les prix), et derrière, SES rayons avec SES noms de pains. Résultat : tient,
tant que rien n'est arrondi ni ajouté.

## Contrat (six lignes)
- THÈSE : la preuve d'abord, les rayons ensuite ; refuse la longue page par défaut (photo, avis, services, à propos,
  questions, contact) et la version A (devanture plein cadre et carte posée dessus).
- SQUELETTE : architecture `accueil-portes` (Maisons de Bricourt, Cabalar) : l'accueil est un sommaire. Nav « split » de
  l'architecture (les cinq rayons nommés, numéro, Commander un gâteau), premier écran sur mesure « Note », puis les portes
  (une par rayon, toute la porte est un lien) posées côte à côte qu'on fait glisser au doigt, l'entrée « Les rayons »
  collée à gauche (dos vertical au téléphone, panneau avec deux boutons à l'ordinateur), puis le pied sur mesure (rue en
  grand, itinéraire, semaine, numéro, e-mail, pages légales), le même sur toutes les pages. Pages de rayon au gabarit « porte ». Contact en tiroir. `ff ressemblance` :
  premier écran et déroulé sous 0,65 contre tous les sites ; modèle de navigation « défilement horizontal », celui
  d'aucun autre site du registre.
- PREMIER ÉCRAN — famille : preuve-d-abord ; à l'ordinateur, à gauche le h1 « Boulangerie-pâtisserie à Orléans » (Gloock
  76 px), l'adresse, le numéro en bouton plein et Commander un gâteau, l'état du jour, puis « 4,6 » de 240 px et ses cinq
  épis ; à droite le fraisier dans son cadre, les deux tickets d'avis posés en partie dessus, décalés. Au téléphone, la
  note et les deux tickets AVANT le h1 et les boutons (le numéro reste dans la barre du haut), le fraisier ensuite.
- MOUVEMENT :
  1. Entrée : les cinq épis de la note se remplissent de bas en haut, l'un après l'autre, le dernier aux six dixièmes
     seulement (sec, 0,18 s chacun, 70 ms d'écart, une fois). Raison : croire. On transpose Délice (`delice.md`) :
     l'information qui rassure en tête, montrée par une chose du métier (l'épi), pas par un compteur.
  2. Rythme : le second ticket d'avis glisse sous le premier (lent, 0,9 s, une fois). Raison : lire.
  3. Geste (le feu d'artifice) : on fait glisser les portes des rayons au doigt, elles passent sous l'entrée « Les rayons »
     qui reste collée (deux plans) ; la porte s'accroche en place au lâcher, rien ne défile tout seul. Raison : choisir.
  4. Image : la photo d'une porte s'avance d'un rien quand on la survole à la souris (sec, 0,2 s). Raison : inviter.
  Courbes : SEC = ease-out 0,18 à 0,2 s (épis, survol, boutons) ; LENT = 0,9 s pour le ticket, la seule chose lente.
- REFUSÉ : la devanture plein cadre et sa carte (version A) ; la note arrondie à cinq étoiles ; un compteur qui défile de
  0 à 162 ; l'avis « D comme Découvrir » ; « Depuis 2001 » ; prix ; photos 04, 05, 07 ; une illustration à la place des
  photos de pain absentes ; défilement automatique des portes ; pied en colonnes de l'architecture (il répétait la rue et la semaine : un seul pied, celui de la rue) ; titres qui se lèvent ; rideau.
- FIN : non relu = pas fini ; ce site se termine par le verdict du relecteur.

## Typographie, couleur, images
- Direction générée `m-751d7c` (mélange) : Gloock (titres, d'après Café Binocle) et Karla (texte) ; papier `#f2ede9`,
  bleu nuit `#0f2c56` pour le texte, bleu ciel en surface (portes, tickets), or `#e3af04` en aplat des boutons et des épis
  (assombri en `#745902` quand il sert de texte, calcul AA). Ombre douce et rayon 8 px des cartes (Monarque).
- Images : photo dans une marge (atome photos de Meyers : cadre), jamais à fond perdu ; le fraisier au premier écran, une
  photo par porte. Le pain et les sandwichs n'ont pas de photo au brief : leurs noms en Gloock sur l'or, sans dessin.
- Calibration : pas crème + serif + terracotta (papier froid, bleu nuit, or), pas noir + acide, pas de broadsheet, pas de
  cartes SaaS à grand rayon (8 px).

## Références
- Délice (`docs/veille/demontages/delice.md`) : ce qui rassure en tête de page ; on garde l'idée, montrée par la note.
- Café Binocle (`docs/veille/demontages/cafebinocle.md`) : la typographie de titrage (Gloock) et sa grosseur contre un
  texte simple ; on garde le contraste de tailles.
- Meyers (`docs/veille/demontages/meyers.md`) : la photo dans son cadre ; on garde la marge autour de chaque photo.
- Architecture : Maisons de Bricourt (`docs/veille/architectures/bricourt.md`) et Cabalar (`carrefour-portes.md`).

## Accepté par le fondateur
(rien encore)
