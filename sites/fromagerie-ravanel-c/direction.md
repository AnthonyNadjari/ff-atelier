# Direction — Fromagerie Ravanel, piste C « Le comptoir » (fromagerie-ravanel-c)

Contrat écrit AVANT de toucher au site (étape 1 de `/site-final`), attaqué (étape 2), puis lu par le
relecteur DA : il juge le site CONTRE ce contrat. Jamais publié (ni dans `dist/`, ni en commentaire HTML).

## Faits propres (8 à 12, tous tirés du brief)
1. Fromagerie Ravanel, fromager-affineur, 12 rue de la Gare, 74000 Annecy, depuis 2011 (reprise d'une crémerie de quartier).
2. Plateaux de 6 à 30 personnes, composés avec le client, dès 6 € par personne, à commander 48 heures avant ; une semaine avant pour Noël et le Nouvel An. C'est la SEULE donnée de prix.
3. Appareil à raclette prêté, pour 4 ou 8 personnes, contre une caution de 50 €, à réserver deux jours avant le week-end (« il en reste rarement le samedi »).
4. Beaufort d'alpage vendu à l'âge qu'on veut : 12, 18 ou 24 mois ; les fromages affinés longtemps (beaufort 24 mois) contiennent très peu de lactose.
5. La cave d'affinage sous la boutique, à 11 °C, creusée en 2014 ; chaque meule porte sa date d'entrée à la craie ; on peut demander « plus jeune » ou « plus fait ».
6. Six fermes du massif des Aravis et des Bauges, nommées sur l'ardoise (pas dans le brief : on ne les nomme pas).
7. On goûte avant d'acheter, toujours.
8. Stand au marché de la vieille ville le mardi et le vendredi matin, depuis 2019, mêmes fromages.
9. Horaires : mardi à vendredi 8 h 30 à 12 h 30 et 15 h 30 à 19 h ; samedi 8 h à 13 h et 15 h à 19 h ; dimanche 8 h 30 à 12 h 30 ; lundi fermé.
10. Le comptoir : beurre de baratte, crème crue, yaourts de la ferme, quelques vins de Savoie.
11. Claire (affinage, commandes) et Théo (boutique, marché). Téléphone 04 65 71 23 18 (fictif) : tout se réserve par téléphone.

## Phrase-idée
« Sur ce site, le plateau de 6 à 30 personnes à dès 6 € devient une meule qu'on coupe au doigt : on
choisit le nombre de convives, la meule se recoupe en autant de parts, le prix de départ et le délai
s'affichent, et le bouton appelle la boutique. »

## Test du concurrent
La crémerie d'à côté a peut-être des plateaux, mais pas ces bornes (6 à 30), ce prix de départ (6 €),
ce délai (48 h, une semaine pour les fêtes) ni l'appareil à 4 ou 8 personnes contre 50 € : le dispositif
ne marche qu'avec les chiffres de Ravanel. Le premier écran porte le nom, la rue de la Gare, l'horaire du
jour et la bande de ce qui se réserve chez elle : il ne passe pas chez un autre.

## Contrat (six lignes)
- THÈSE : une affiche de marché, pas une vitrine. Le défaut du métier (grande photo de plateau, crème +
  serif, « bienvenue chez nous », ardoise sombre de la piste A) est refusé : de grands aplats francs qui
  changent à chaque section, un nom énorme, et les réservations (plateau, raclette) au premier plan.
- SQUELETTE : coquille `sticky-hero` (le premier écran reste collé, chaque section arrive par-dessus comme
  une nouvelle affiche collée sur la précédente). Nav sur mesure fine, qui prend la couleur de l'affiche
  qu'elle survole. Ordre : affiche-titre + bande défilante, Composer son plateau, l'étiquette raclette,
  le beaufort par âge, la cave, questions, contact en grand numéro, pied de page au nom géant.
  `ff variete` : pop n'a qu'un site (maison-roux, coquille flow/burger) ; pop + sticky-hero n'existe pas ;
  aucun site en Alfa Slab One.
- PREMIER ÉCRAN : fond beurre (--bg-2), « Fromagerie Ravanel » sur toute la largeur en Alfa Slab One
  outremer ; au-dessus, métier et rue de la Gare ; dessous, une phrase (six fermes, cave, on goûte), les
  horaires avec le jour courant en gras, le bouton « Appeler » ; en pied d'écran une bande noire défilante
  des choses à réserver, séparées par un petit sommet (triangle), jamais un point médian.
- MOUVEMENT : (1) entrée : titre par lignes (`data-split="lines"`, courbe pop à rebond), la bande démarre ;
  (2) rythme : un groupe `data-stagger` ou `data-reveal` par section ; (3) feu d'artifice : la meule du
  plateau, qui se recoupe en N parts au curseur ou aux boutons + / − (le but : « choisir ») ; (4) image :
  la photo de la cave en `data-scrub` (zoom qui se pose), la raclette en `data-parallax`, l'étiquette qui
  se redresse au défilement. Plus : chaque affiche glisse sur la précédente (coquille), la nav change de
  couleur avec l'affiche.
- REFUSÉ : ardoise sombre, bande horizontale épinglée des âges (piste A) ; bois, carreaux rouges, chalet,
  or ; terracotta + crème + serif (grappe) ; rangée de trois chiffres identiques (les trois âges sont une
  marche qui grandit, pas trois cartes) ; tout prix autre que « dès 6 € par personne » et la caution.
- FIN : non relu = pas fini ; ce site se termine par le verdict du relecteur.

## Typographie, couleur, images
Direction `pop` (blocs de couleur, courbe à rebond : « joyeux »), accent surchargé en outremer
`hsl(226 78% 44%)` (blanc dessus 7,9:1 ; sur beurre 7,1:1). Aplats : beurre `--bg-2`, outremer `--accent`,
vert sapin `--accent-2`, crème `--bg`, encre `--ink`. Pas de rouge (nappe à carreaux), pas d'or.
Titres : Alfa Slab One (bois d'imprimerie des affiches de foire, poids unique : `--display-weight` ramené
à 400 pour éviter le faux gras). Texte : Karla (grotesque nette et ronde ; la piste B a pris Schibsted). Photos : les trois de Wikimedia
déjà au dossier (cave CC0, beaufort CC BY-SA 4.0 crédité, raclette CC0), présentées comme illustrations.
« Chaleureux, franc, montagnard » : franc par les aplats et le nom énorme, chaleureux par le beurre et le
rebond, montagnard par le vert sapin, l'outremer du ciel et le petit sommet du séparateur, sans chalet.

## Références
- Délice (demontages/delice.md) : une couleur de fond par section, saturée, et les horaires ouverts sur
  le jour même. On prend les aplats qui changent et le jour courant en gras.
- Café Binocle (demontages/cafebinocle.md) : un manifeste en très grand sur toute la largeur. On prend la
  taille du nom, qui remplit l'écran.

## Différence avec la piste A et l'autre piste
- Piste A : coquille flow, ardoise vert sombre, Savate + Hanken, direction terre, âges du beaufort en
  bande horizontale épinglée, bons de commande côte à côte. Ici : coquille sticky-hero (les affiches se
  recouvrent), fond beurre et outremer, Alfa Slab One + Karla, direction pop, âges en marche qui
  grandit, et un plateau qui se règle au doigt au lieu d'un bon de commande à lire.
- Piste B : direction pierre, coquille flow avec panneau fixe, Libre Caslon Condensed, carnet clair et lent.
  Ici tout l’inverse : aplats saturés qui changent, affiches empilées, slab de foire, rebond, geste au doigt.

## Accepté par le fondateur
(vide)
