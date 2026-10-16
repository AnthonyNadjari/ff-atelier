# Direction — Fromagerie Ravanel, piste C « La semaine » (fromagerie-ravanel-c)

Contrat écrit AVANT de toucher au site (étape 1 de `/site-final`), refait de zéro le 16 oct 2026 au soir
après « très similaire sur les animations » et « aucun que je ne trouve pas IA generated »
(`docs/veille/pourquoi-ia-2026-10.md`). Jamais publié.

## Faits propres (tous tirés du brief)
1. Boutique 12 rue de la Gare, Annecy : mardi à vendredi 8 h 30 à 12 h 30 et 15 h 30 à 19 h ; samedi 8 h à
   13 h et 15 h à 19 h ; dimanche 8 h 30 à 12 h 30 ; lundi fermé.
2. Stand au marché de la vieille ville le mardi et le vendredi matin, mêmes fromages, depuis 2019.
3. Claire (affinage, commandes) et Théo (boutique, marché) : deux personnes, deux endroits certains matins.
4. Appareil à raclette prêté (4 ou 8 personnes, caution 50 €) : réserver deux jours avant le week-end, « il en
   reste rarement le samedi ».
5. Plateaux de 6 à 30 personnes, dès 6 € par personne, 48 heures avant ; une semaine avant pour Noël et le
   Nouvel An.
6. Cave à 11 °C creusée en 2014 sous la boutique ; date d'entrée de chaque meule à la craie ; « plus jeune »
   ou « plus fait ».
7. Beaufort d'alpage vendu à 12, 18 ou 24 mois.
8. Six fermes des Aravis et des Bauges, nommées sur l'ardoise (le brief ne donne pas leurs noms : on n'en
   écrit aucun).
9. On goûte avant d'acheter, toujours.
10. Comptoir : beurre de baratte, crème crue, yaourts de la ferme, quelques vins de Savoie.
11. Claire a appris l'affinage dans la vallée de Thônes ; 2011 reprise de la crémerie rue de la Gare.

## Phrase-idée
« Sur ce site, la semaine de Claire et Théo (boutique, marché le mardi et le vendredi matin, ce qui se
réserve avant le week-end) devient une barre à tickets : sept talons de jour, et la caisse imprime le
ticket du jour qu'on touche. »

## Test du concurrent
La crémerie d'à côté a des horaires, mais pas un stand au marché deux matins par semaine ni un appareil à
raclette qui part avant le samedi : chez elle, le ticket du mardi et celui du samedi seraient identiques.
Ici, toucher mardi change l'endroit (Théo au marché) et toucher samedi change ce qui reste réservable (la
raclette se réserve le jeudi). La phrase ne marche que pour Ravanel.

## Contrat (six lignes)
- THÈSE : un commerce de bouche se lit d'abord par « quand ? » (est-ce ouvert, est-il au marché, est-ce que
  j'ai encore le temps de commander) ; on refuse l'arrangement du métier « photo de meules + texte
  d'ambiance + horaires en pied de page ». Les horaires ne sont pas en bas : ils SONT le premier écran.
- SQUELETTE : index. Le premier écran EST la semaine (coquille `flow`, hero sur mesure `semaine`), le reste
  en dessous comme des fiches posées sur le comptoir : À réserver (bon de plateau + bon de prêt raclette
  avec la photo agrafée), La cave, 11 °C (plus jeune ou plus fait, beaufort, comptoir), Les questions du
  comptoir, Rue de la Gare (Claire et Théo, trois jalons, coordonnées), pied en bas de ticket. Pas de nav
  en haut sur téléphone : une barre d'actions collée en bas (Appeler, La semaine, Venir), reprise de Délice.
  Sur ordinateur, une ligne d'ancres + le téléphone en haut à droite. Écart avec `ff variete` : aucun site
  n'a un hero-semaine ni une barre basse ; direction `encre` n'est portée que par encre-noire (tatoueur).
- PREMIER ÉCRAN : téléphone : « Fromagerie Ravanel » en grotesque large noire (2 lignes), une phrase, la
  barre à tickets (7 talons, aujourd'hui en orange), puis le ticket imprimé du jour sous la fente de la
  caisse ; « Appeler » dans la barre basse. Ordinateur : à gauche le nom (≈ 5 rem), la phrase, le
  téléphone en gros chiffres mono ; à droite (60 %) la barre à tickets et le ticket imprimé.
- MOUVEMENT (rien sur les titres, aucun `data-split`, pas de rideau, aucun attribut du moteur) :
  1. Entrée : les sept talons de jour se posent sur la barre l'un après l'autre (sec, 0,14 s chacun, 45 ms
     d'écart), puis le ticket du jour s'imprime sous la fente de la caisse, de haut en bas, par à-coups,
     comme une imprimante thermique (12 crans linéaires). Raison : imprimer. Transposé de Pizza Amici (tickets d'étapes sur un fil :
     on garde l'objet ticket suspendu, pas l'inclinaison permanente).
  2. Rythme : en descendant, les fiches de chaque bloc (bons, étiquettes, jalons, questions) arrivent en paquet,
     posées d'un coup sec sur le comptoir (0,16 s, ombre qui se resserre, 50 ms entre deux). Raison : poser.
  3. Feu d'artifice : toucher un talon : il se balance sur la barre (lent, rebond amorti 0,9 s) et la caisse
     réimprime le ticket de ce jour-là (où sont Claire et Théo, horaires, ce qu'on peut encore réserver,
     calculé depuis aujourd'hui). Raison : choisir.
  4. Image : la seule photo (raclette, réservée à cette piste) est agrafée au bon de prêt et arrive avec son
     paquet ; aucune légende « d'illustration ». Raison : montrer le fromage à racler.
  Courbes : régime sec = `steps(12)` linéaire pour l'impression, `cubic-bezier(.3,.7,.4,1)` 0,14 à 0,16 s pour
  poser ; régime lent = balancier amorti 0,9 s (keyframes 5°, -3°, 1,5°, -0,6°, 0). Un ticket qu'on pose ne
  traîne pas ; un ticket suspendu qu'on touche oscille.
- REFUSÉ : rideau ; titres qui montent ligne par ligne ; photo de cave (piste B) et beaufort (personne) ;
  chiffre géant de l'âge du beaufort (les trois pistes l'avaient) ; surtitre « métier, rue, ville » ; FAQ
  partagée (même composant dans les trois anciennes pistes) ; tickets inclinés en permanence (polaroid) ;
  bandeau qui défile tout seul (ancienne piste C) ; crème + serif ; prénom de ferme inventé.
- FIN : non relu = pas fini ; ce site se termine par le verdict du relecteur.

## Typographie, couleur, images
Direction `encre` (papier blanc #fdfcf9, encre #101010, filets noirs, rayon 0) + UNE couleur franche :
orange de caisse `hsl(20 95% 40%)` (contraste 4,7:1 sur le papier), réservée à « aujourd'hui », à ce qui est
encore réservable et au bouton d'appel. Polices, une par rôle : Archivo Black (enseigne : le h1 seul),
Archivo 800 (étiquettes h2), JetBrains Mono (le ticket : h3, horaires, délais, prix), Archivo (texte). Aucune
police de la liste IA. Images : une photo (raclette, Wikimedia CC0), le reste est typographique (tickets,
talons, étiquettes). Calibration : pas crème + serif, pas noir + acide, pas broadsheet ; le papier blanc et le
mono viennent du ticket de caisse, l'orange de l'étiquette de prix.

## Références
- Pizza Amici (`docs/veille/demontages/pizza-amici.md`) : tickets d'étapes suspendus à un fil qui bougent ;
  un rôle par police (mono pour les fiches techniques). On garde le ticket-objet et le mono, pas le rebond
  sur chaque bouton ni les timbres inclinés.
- Délice (`docs/veille/demontages/delice.md`) : horaires par jour ouverts sur le jour même ; barre d'actions
  collée en bas sur téléphone. On garde les deux, sans carrousel automatique.

## Différence avec la piste A et la piste B
| Axe | A « L'ardoise » | B « La cave » | C « La semaine » |
|---|---|---|---|
| Lecture | l'ardoise du comptoir | la cave à 11 °C | la semaine de Claire et Théo |
| Couleur | sombre (ardoise) | clair qui s'assombrit | papier blanc + orange franc |
| Typo | craie + grotesque | serif condensée + mono | grotesque large (Archivo Black) + mono de ticket |
| Entrée | la craie qui s'écrit | la lumière qui baisse | les talons se posent, le ticket sort de la caisse |
| Apparition | lignes écrites de gauche à droite | meules posées sur les étagères (lent) | fiches posées en paquet (sec) |
| Geste | toucher un fromage de l'ardoise | glisser une meule d'âge en âge | toucher un jour : où, quand, quoi réserver |
| Squelette | flow, ardoise en premier écran | colonne étroite en escalier | index : la semaine en premier écran |

## Accepté par le fondateur
(rien encore)
