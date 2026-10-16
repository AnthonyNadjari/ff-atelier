# Direction — Fromagerie Ravanel, piste B « Carnet de cave » (fromagerie-ravanel-b)

Démo fictive, 16 oct 2026. Deuxième essai demandé par le fondateur, qui trouve la piste A « assez monotone ».

## Faits propres (tous tirés du brief)
1. Une cave à 11 °C, creusée en 2014 sous la boutique, où tommes et reblochons fermiers finissent de s'affiner.
2. Chaque meule porte sa date d'entrée en cave, écrite à la craie.
3. On peut demander un fromage « plus jeune » ou « plus fait ».
4. Le beaufort d'alpage se vend à l'âge choisi : 12, 18 ou 24 mois.
5. Les fromages affinés longtemps (beaufort 24 mois, vieille tomme) contiennent très peu de lactose.
6. Six fermes des Aravis et des Bauges, que Claire nomme sur l'ardoise.
7. On goûte avant d'acheter, toujours.
8. Appareil à raclette 4 ou 8 personnes, caution 50 €, à réserver deux jours avant le week-end (il en reste
   rarement le samedi) ; fromage coupé ou râpé à la demande.
9. Plateaux de 6 à 30 personnes, composés avec vous, dès 6 € par personne, 48 h avant (une semaine pour Noël
   et le Nouvel An).
10. Marché de la vieille ville le mardi et le vendredi matin, mêmes fromages, depuis 2019.
11. 12 rue de la Gare, Annecy ; fermé le lundi ; ouvert le dimanche matin.
12. Claire (affinage, commandes) et Théo (boutique, marché) ; Claire a appris dans la vallée de Thônes.

## Phrase-idée
« Sur ce site, la date d'entrée écrite à la craie sur chaque meule devient un calendrier d'affinage qu'on
parcourt en défilant, de l'entrée en cave à 24 mois, et qui dit à quel moment demander plus jeune ou plus
fait. »

## Test du concurrent
Une autre fromagerie d'Annecy vend aussi du beaufort de plusieurs âges. Ce qu'elle n'a pas : sa propre cave
sous la boutique avec la date à la craie sur chaque meule, et le droit de choisir le moment (plus jeune, plus
fait). Le calendrier part de l'entrée en cave, pas du rayon : il ne marche que pour un affineur qui a une cave.
La piste A montrait les trois âges du beaufort comme trois pages à faire glisser ; ici on montre le temps
lui-même (une règle de 0 à 24 mois que l'aiguille parcourt), et les trois âges ne sont que trois arrêts.

## Contrat (six lignes)
- THÈSE : un carnet tenu par l'affineuse, clair et lent, la photo d'abord. Refuse le défaut du métier (photo de
  plateau en fond + « Bienvenue » posé dessus) et refuse aussi l'ardoise sombre de la piste A.
- SQUELETTE : coquille `flow` détournée par une nav sur mesure : sur ordinateur, un panneau fixe à gauche
  (nom, métier, horaire du jour, téléphone, quatre ancres sans numéro), le contenu défile à droite comme les
  pages d'un carnet ; sur téléphone, une barre fine en haut (nom + Appeler). Ordre : la cave (hero) →
  le calendrier d'affinage (signature, épinglé) → raclette et plateaux (deux colonnes de carnet réglées) →
  FAQ → venir (horaires de la semaine, marché). Écart : ni `bar`+`flow` (piste A), ni la coquille `split`
  (numéros de sommaire), direction `pierre` portée une seule fois (studio-ambre, squelette différent).
- PREMIER ÉCRAN : ordinateur, trois bandes verticales : panneau (nom en grand, horaire du jour, bouton
  téléphone), colonne de texte (titre en 3 lignes, deux phrases), photo de la cave en pleine hauteur, rien
  posé dessus. Téléphone : titre, ligne « Aujourd'hui », bouton Appeler dans le premier écran, la photo
  commence en bas de l'écran.
- MOUVEMENT : entrée = titre par lignes (`data-split="lines"`), la photo se découvre de bas en haut puis
  recule doucement ; rythme = un groupe par section (lignes du carnet en cascade, réponses de FAQ) ; feu
  d'artifice = le calendrier : la piste avance avec le défilement (linéaire, suit le doigt), le trait d'encre
  se trace de 0 à 24 mois, chaque arrêt s'allume quand l'aiguille le touche (étapes, transitions en temps) ;
  image = la cave en léger parallaxe, la raclette révélée par un volet.
- REFUSÉ : fond sombre, terre, Savate/Hanken, bande horizontale manuelle des âges (piste A) ; crème + serif +
  terracotta (grappe dépensée) ; italique ; numéros 01/02/03 ; chiffres d'affinage absents du brief (pas de
  « reblochon 4 semaines ») ; photo qui prétendrait montrer Claire, Théo ou la boutique ; avis.
- FIN : non relu = pas fini ; ce site se termine par le verdict du relecteur.

## Typographie, couleur, images
- Direction `pierre` (gris de pierre tiré au vert : la voûte de la cave), angles droits, grand vide, courbe
  lente in-out : « calme et lent ». Accent remplacé par une encre bleu-noir (celle d'un stylo de carnet), pas
  le vert de la piste A.
- Titres en **Libre Caslon Condensed** (serif condensée d'enseigne, jamais en italique), texte en **Schibsted
  Grotesk** (grotesque de presse, sobre). Paire inédite dans l'usine.
- Photos libres (Wikimedia, CREDITS.md) : la cave en pleine hauteur, la meule de beaufort dans le calendrier,
  la raclette dans le carnet. Crédit CC BY-SA de la photo du beaufort affiché sous la photo.
- Trois adjectifs du brief : chaleureux (le carnet écrit à la main d'une personne nommée), franc (conditions
  exactes, prix, caution), montagnard (pierre de cave, fermes des Aravis et des Bauges).

## Références
- Le Saint Georges (`docs/veille/demontages/lesaintgeorges.md`) : une légende précise qui explique un
  dispositif ; repris : chaque arrêt du calendrier est une légende courte au-dessus de la règle.
- Délice (`docs/veille/demontages/delice.md`) : horaires jour par jour avec le jour courant mis en avant ;
  repris : la ligne « Aujourd'hui » dans le panneau et la semaine complète dans « Venir », jour courant en
  encre.

## Différence avec la piste A et l'autre piste
- Piste A : premier écran ardoise sombre vert, `terre`, Savate + Hanken, coquille `flow` + nav `bar`, bande
  horizontale qu'on fait glisser à la main entre trois chiffres géants. Piste B : clair, `pierre` + encre
  bleu-noir, serif condensée + grotesque de presse, panneau latéral fixe, photo pleine hauteur sans texte
  dessus, calendrier épinglé qui suit le défilement de l'entrée en cave à 24 mois (cinq arrêts, règle graduée).
- Piste C (construite en parallèle, non vue) : la piste B s'interdit tout fond sombre et tout geste manuel
  pour rester sur son axe « lent, éditorial, photo d'abord ».

## Accepté par le fondateur
(rien pour l'instant)
