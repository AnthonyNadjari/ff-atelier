# Relecture — fromagerie-ravanel-d (piste D « Le comptoir »)

Relecture dégradée : un seul contexte (démo de comparaison demandée en une passe, pas de relecteurs DA et
rédacteur lancés). Planche téléphone et ordinateur, film d'entrée et du geste, captures de l'accueil et de la page
raclette regardés à l'œil.

## Tour 0 — 17 oct 2026, construction

### Ce qui est fait
- Socle (GOUT § 0) : accueil + cinq pages d'offre (`/services/cave-affinage`, `beaufort`, `raclette`, `plateaux`,
  `comptoir`), chacune avec le texte du brief, ses points, la photo quand il y en a une, le téléphone et « Venir ».
- Coquille `split` (aucune piste ne l'avait) : sur ordinateur, panneau collé à gauche (nom, « Fromager-affineur à
  Annecy », nav, gros bouton téléphone toujours visible) ; sur téléphone, barre du haut avec « Appeler » et barre
  d'actions en bas (Appeler, Venir).
- Premier écran (sur mesure, parce que les heros partagés mettent un surtitre au-dessus du h1 et le révèlent par
  lignes) : h1 « Fromager-affineur rue de la Gare, à Annecy » (3 lignes téléphone, 2 ordinateur, mesuré), phrase
  « Depuis 2011… On goûte avant d'acheter, toujours. », numéro en grand, pancarte Ouvert / Ouvre à / Fermé + horaires
  du jour, marché du mardi et du vendredi avec Théo (« Ce matin, Théo est au marché » ces matins-là), trois portes :
  Réserver l'appareil à raclette (appel), Commander un plateau (vers le bloc), Venir rue de la Gare. Mesuré : le
  lien tel: est dans le premier écran à 390x844 et 1400x900.
- Bloc sur mesure « Le plateau » : curseur 6 à 30 (et boutons moins / plus, clavier), les parts se posent sur la
  planche, prix de départ (n × 6 €, le seul prix du brief), « prêt au plus tôt » calculé (48 h après l'appel,
  lundi fermé, horaires réels : samedi 17 oct 16 h → mardi 20 octobre), rappel des fêtes, bouton d'appel.
- Sections partagées : services/list, about/timeline (Claire et Théo, 2011, 2014, 2019), faq/two-columns (les
  trois questions du brief), contact/simple sans formulaire (pas d'e-mail au brief), pied columns.
- Mouvement : pancarte qui se retourne (lent à rebond 0,7 s), parts posées en série quand la planche arrive (sec,
  0,16 s), part ajoutée qui tombe avec rebond (0,45 s) / retirée sèche (0,12 s), photo de cave qui glisse dans son
  cadre. Moteur à `none` : aucun titre ni section partagée ne bouge.
- Aucun avis, aucune note. Démo signalée (`legal.demo`). Photos libres créditées (/credits), sans légende.
- `ff prevol` tout vert ; `ff pistes` (A, B, C, D) : D ne partage aucun axe avec A et C, la couleur claire avec B.

### Corrigé pendant le tour (vu sur la planche et le film)
- Horaires du widget partagé : « Mardi à vendredi » n'était pas lu comme une plage (mercredi et jeudi affichés
  « Fermé ») ; écrit « Du mardi au vendredi ». Piège de `src/lib/horaires.ts` (`joursDe` ne connaît pas « à ») :
  à signaler, les pistes A, B et C écrivent « Mardi à vendredi » (sans effet visible tant que leurs sections ne passent pas par `semaine()`).
- Ligne « Plateaux » de la liste : « 48 heures avant. , dès 6 € » (gabarit qui colle `priceFrom` après le point) :
  prix passé dans la phrase.
- Bandeau d'appel des pages d'offre : « Un projet, une urgence ? Parlons-en. » (titre par défaut du gabarit) :
  remplacé par « Un plateau, une raclette ? Appelez Claire. ».
- Planche du plateau trop pâle (parts blanches sur beige) : bois et croûtes foncés.
- h1 sur 4 lignes à l'ordinateur : colonne de texte élargie, 2 lignes.

### Ce qui reste faible
- Titre « Nos services » et phrase « Fromager-affineur à Annecy et alentours. » imposés par `services/list`
  (aucun champ de libellé) : générique, et « et alentours » n'est pas du brief. À ouvrir dans `src/` (un
  `wording.servicesTitle`), pas fait ici (consigne : ne pas toucher `src/`).
- Panneau `split` : sommaire numéroté 1 à 5 (numérotation décorative, GOUT § 2) et une seule ligne d'horaires
  (`hours[0]`, le matin du mardi au vendredi) : défauts de la coquille.
- Page /credits : deux tirets cadratins visibles venant du gabarit (`ff verifier` l'avertit).
- Page « Le comptoir » mince (le brief n'a que quatre produits) ; page « Plateaux » sans photo.
- Pas de photo du lieu ni des gens, pas d'avis : les deux leviers les plus forts du marché manquent, faute de
  données. Les photos sont de banque, et le contrôle d'aiguillage le dit.
- La planche du plateau range les parts en grille : lisible, pas encore un vrai plateau composé.
- Non vérifié : iPhone en ligne (non déployé), rendu un jour fermé (lundi) en vrai.

### Un fromager paierait-il 1 200 € pour ça, et pourquoi ?
Plus près du oui que les pistes A, B, C, mais pas encore franchement. Oui pour ce qui se voit en trois secondes :
son métier et sa ville en titre, son numéro en grand partout, « ouvert / fermé » et ses horaires du jour, son
marché, une page par chose qu'il vend (ce qui le fait trouver sur Google), et un outil qui lui ramène des
commandes de plateaux au téléphone en répondant seul à « combien ça coûte, pour quand ». C'est ce qu'il paierait.
Ce qui le retiendrait : sans ses photos et ses avis, le site ressemble à n'importe quelle fromagerie sérieuse ; il
faut ses vraies photos (cave, comptoir, Claire, Théo au marché) et ses avis Google pour qu'il dise « c'est moi ».
Sur un vrai commerce avec ces deux données, oui.

## Tour 1 — 17 oct 2026 : profondeur

Verdict du fondateur sur le tour 0 : « un peu mieux déjà. Perso je l'achèterais pas. Trop 2D, pas beau ». Le fond
(socle, textes, plateau et son calcul) ne bouge pas ; l'habillage est refait (GOUT § 0, « le socle doit être beau »).
Référence de profondeur : le site du studio (mur d'écrans en perspective, téléphone posé sur une grande photo).
Relecture dégradée, un seul contexte : captures, planches à la molette (téléphone et ordinateur) et film regardés.

### Avant / après
| | Avant (tour 0) | Après (tour 1) |
|---|---|---|
| Premier écran téléphone | texte sur fond blanc froid, photo de cave en vignette arrondie sous les portes | photo de cave plein cadre sous la barre, texte posé dessus sur une carte (tranche couleur croûte, ombre portée en quatre couches), pancarte « Ouvert » pendue à un clou planté dans la photo, devant le bord de la carte |
| Premier écran ordinateur | texte à gauche, photo en vignette 3:4 à droite | photo plein cadre sur toute la colonne de droite (100svh), carte posée en bas à gauche, qui déborde de 24 à 36 px sur la section suivante ; h1 sur 2 lignes |
| Offres | liste à plat, « Nos services » + surtitre | « À la cave et au comptoir » (`wording.servicesTitle`) ; cinq cartes : photo (cave, beaufort, raclette) ou objet dessiné (planche des plateaux, étiquette du comptoir), plaque de texte qui déborde sur le bas de la photo, ombre ; rangée qu'on fait glisser sur téléphone |
| Entre les sections | rien, blocs empilés sur fond uni | bande pleine largeur du beaufort (la planche du plateau la chevauche) ; bande du bas de la cave avant les questions |
| Le plateau | planche plate, grille de parts | planche de noyer vue en perspective (rotateX 20°), tranche épaisse, ombre portée sur la page et sur la photo, parts couleur pâte et croûte avec leur ombre ; 5 parts par rang à l'ordinateur |
| Couleur | `nordique` (blanc froid, vert sapin) | `terre` (chanvre, vert mousse, ocre de croûte), couleurs des photos ; ombres tirées de `--ink` |
| Défilement | photo de cave qui glisse dans sa vignette | trois plans : photos derrière (plus lentes), cartes avec la page, pancarte devant (un peu plus rapide), translations seules bornées (`sections/plans.ts`) |

Mesuré (playwright, `dist/`) : 1400x900, h1 2 lignes, numéro en bas à 760 px, horaires 799, portes 899 ; 1280x800
portes 793 ; 1024x768 portes 761 ; 390x844 numéro 613, horaires 657 ; 375x667 numéro 512, horaires 578 (au-dessus
de la barre d'actions, règle « petit téléphone » ajoutée). Texte de la carte : `--muted` sur `--surface`, AA (axe
dans `ff verifier`). Pancarte, entrée et geste du plateau vérifiés au film (13 personnes, 78 €).

### Contrôles
- `ff prevol` : tout vert (contrat, aiguillage, build, verifier avec a11y, audit-motion, netteté, detect, perf,
  signatures). Corrigé en route : grille d'images aux ratios « incohérents » (classe `object-cover` manquante pour
  le contrôle), raclette floue en bande pleine largeur, HTML de l'accueil à 141,5 Ko pour 140 (styles des sections
  sur mesure passés en global préfixé, semaines du premier écran et du plateau encodées en texte compact, rang des
  parts posé par le script) : 138 Ko, marge faible.
- `ff pistes` A, B, C, D (`--sans-film`) : vert, D ne partage aucun axe avec A, B, C.
- Piège noté : `craft.css` impose `display: inline-flex` à tout `button[aria-label]` (plus spécifique qu'une classe
  de section) : les boutons moins et plus du plateau avaient leur signe collé à gauche depuis le tour 0 ; centrés.

### Ce qui reste plat
- Claire et Théo (about/timeline), questions (faq/two-columns), 12 rue de la Gare (contact/simple) et le pied :
  sections partagées, blocs à plat sur le fond ; les rendre profondes demande des variantes dans `src/` ou des
  sections sur mesure de plus (budget HTML déjà au bord).
- Panneau de la coquille `split` (ordinateur) : aplat `--bg-2` à côté de la photo ; la coquille est dans `src/`.
- Pages d'offre (`/services/*`) : photo en vignette 4:3 arrondie à droite du texte. Le gabarit
  `src/pages/services/[slug].astro` est partagé et sans variante : pas d'image en grand possible sans toucher `src/`.
  À ouvrir : une variante de page d'offre « photo plein cadre + carte posée ».
- La raclette n'a pas sa bande : source de 1 000 px (original Wikimedia compris), floue en pleine largeur
  (`ff nettete`) ; remplacée par le bas de la photo de cave. Un vrai client fournit ses photos en grand.
- La carte du premier écran ne déborde que de 24 à 36 px à l'ordinateur : plus, et les portes passent sous le pli.
- Réglage du plateau (curseur, prix, jour) posé à plat à côté de la planche ; grand vide sous la planche à
  l'ordinateur.
- Non vérifié : iPhone en ligne (pas de déploiement demandé), un jour fermé en vrai.

### Plus beau qu'avant ?
Oui. Le premier écran montre enfin une cave (on sent le fromage avant de lire), le texte a un support qui a du
poids, la pancarte pend devant, et la page alterne photo, cartes et planche au lieu d'empiler des blocs blancs.
Ce n'est pas encore le niveau du site du studio : la moitié basse de l'accueil (Claire et Théo, questions, contact)
reste plate, et les photos sont de banque, sans la boutique ni les gens.

## Tour 2 — premier écran (17 oct 2026, soir)

Verdict du fondateur sur les quatre sites du jour : « encore une fois ils sont très similaires… c'est ça qui
m'angoisse ». Cause : la recette « photo plein cadre, texte posé sur une carte », retirée de GOUT § 0. Famille
imposée : `bande-defilante` (aucune piste sœur ni site récent ne l'a ; `ff contrat` vert). Le socle, le plateau et
son calcul ne bougent pas. Relecture dégradée, un seul contexte : captures, film (entrée, section, glissé de la
bande), sonde Chrome de l'entrée et d'un petit téléphone (375x667) regardés.

### Avant / après
| | Avant (tours 0 et 1, `carte-sur-photo`) | Après (tour 2, `bande-defilante`) |
|---|---|---|
| Construction | photo de cave plein cadre, carte crème posée dessus avec h1, numéro, horaires, trois portes ; pancarte au clou | en haut, sur le papier, sans photo : h1, phrase « Depuis 2011 », numéro, état du moment + horaires (ou ceux de la prochaine ouverture), adresse ; dessous, pleine largeur, le comptoir vert-noir et son rebord de noyer, les produits debout dessus en une rangée qu'on fait glisser |
| Produits | dans une section Offres plus bas (cinq cartes) + bande du beaufort | dans le premier écran : beaufort, tommes et reblochons, raclette et fondue (photos), l'appareil à raclette (étiquette « 4 ou 8 personnes », porte : appel), le plateau (planche dessinée, porte : le bloc), le comptoir (beurre, crème, yaourts, vins), le marché ; chaque fiche = sa page |
| Portes | rangée de trois liens dans la carte + barre basse Appeler / Venir | les fiches elles-mêmes, le numéro, l'adresse ; plus de barre basse (`actionBar: false`) |
| Entrée | la pancarte se retourne | la rangée glisse une fois sur son rebord depuis la droite et s'arrête en rebond (0,7 s), lancée quand la première photo est là (sonde : de 650 à 1 150 ms) |
| Image qui bouge | photos plus lentes que la page | photo de chaque fiche plus lente que sa fiche quand on fait glisser, rebord fixe ; bande du bas de la cave inchangée |
| Accueil | Comptoir, Offres, bande beaufort, Plateau, Claire et Théo, bande cave, questions, contact | Comptoir, Plateau (sa planche se pose sur le bas du comptoir), Claire et Théo, bande cave, questions, contact |

Ordinateur : panneau de la coquille à gauche ; à droite l'en-tête en deux colonnes (h1 | numéro, état, adresse) et
le comptoir jusqu'au bas de l'écran, flèches précédent / suivant et glisser à la souris (un glisser n'ouvre pas la
fiche lâchée). Mesuré au téléphone 390x844 : rebord à 717 px, la planche du plateau dépasse en dessous ; à 375x667,
numéro, état et adresse visibles sans défiler, les fiches commencent dans l'écran.

### Contrôles
- `ff contrat` vert (famille `bande-defilante`) ; `ff prevol` tout vert, ressemblance comprise ;
  `ff ressemblance` : aucun site au-dessus de 0,65, le plus proche prospect-ballay-macon (tél. 0,49, ordi. 0,39).
- `ff captures` sans erreur ni débordement ; film regardé (le film prend sa première vue trop tard pour voir
  l'entrée : vérifiée à la sonde, transform de 214 px à 0 avec rebond).
- Corrigé en route : fiches de hauteurs inégales (un trou au-dessus des photos : étiquette de l'appareil et planche
  raccourcies, fiches photo à hauteur égale) ; « Fermé. Aujourd'hui samedi : … » le soir (dit maintenant la prochaine
  ouverture) ; heure coupée en fin de ligne (« 12 / h 30 ») ; flèches visibles au téléphone dans la capture.

### À côté de L'Épi d'Or, est-ce le même gabarit ?
Non. L'Épi d'Or : photo en haut, carte crème posée dessus, h1 au milieu de l'image, barre basse à trois boutons.
Ici : aucune photo derrière le texte, le titre en haut sur le papier, puis un bandeau sombre de produits qui sort
de l'écran à droite, pas de barre basse. Ce qui reste commun, c'est le socle (« Appeler » dans la barre du haut,
numéro en grand, horaires du jour) : voulu.

### Ce qui reste faible
- L'en-tête est tout en texte : honnête pour une démo sans photo du lieu, mais un vrai client y gagnerait une
  vraie photo de comptoir comme première fiche de la rangée.
- Les étiquettes (appareil, comptoir, marché) sont typographiques ; sans photo du client, c'est voulu (GOUT § 2).
- Non vérifié : iPhone en ligne (pas de déploiement), glisser au doigt réel, un jour ouvert (la sonde a tourné un
  samedi soir : « Fermé. Demain dimanche »).
