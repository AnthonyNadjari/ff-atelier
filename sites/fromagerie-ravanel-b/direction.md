# Direction — Fromagerie Ravanel, piste B « La cave » (fromagerie-ravanel-b)

Contrat écrit avant de toucher au site (refonte du 16 oct 2026, soir, après « très similaires sur les
animations » et « aucune que je ne trouve pas IA generated »). Jamais publié.

## Faits propres (tous tirés du brief)
1. Une cave d'affinage à 11 °C, sous la boutique, creusée par Claire en 2014.
2. Les tommes et les reblochons fermiers y finissent de s'affiner.
3. Chaque meule porte sa date d'entrée à la craie.
4. On peut demander « plus jeune » ou « plus fait ».
5. Le beaufort d'alpage se vend à l'âge voulu : 12, 18 ou 24 mois.
6. Six fermes des Aravis et des Bauges.
7. On goûte avant d'acheter, toujours.
8. Raclette : fromage coupé ou râpé, appareil prêté (4 ou 8 personnes), caution de 50 €, réserver deux jours
   avant le week-end.
9. Plateaux de 6 à 30 personnes, dès 6 € par personne, 48 h avant (une semaine pour Noël et le Nouvel An).
10. Comptoir : beurre de baratte, crème crue, yaourts de la ferme, vins de Savoie.
11. 12 rue de la Gare, Annecy ; marché de la vieille ville mardi et vendredi matin (Théo).
12. Claire (affinage, commandes), Théo (boutique, marché). Reprise en 2011, cave 2014, marché 2019.

## Phrase-idée
« Sur ce site, la cave à 11 °C creusée sous la boutique devient un escalier qu'on descend : la lumière de la
rue de la Gare baisse à chaque marche, et en bas les meules se posent sur leurs planches. »

## Test du concurrent
La crémerie d'à côté a des fromages, un comptoir, peut-être des plateaux ; elle n'a pas de cave creusée sous
la boutique, ni de meules datées à la craie, ni le beaufort à trois âges. L'escalier qui descend sous la rue
de la Gare et l'étagère des âges ne marchent que pour Ravanel. La ligne « on goûte avant d'acheter » est du
métier : elle reste, mais ne porte rien.

## Contrat (six lignes)
- THÈSE : la page est une descente. On arrive à la lumière de la rue, on descend des marches qui
  s'assombrissent, on est dans la cave. Refuse l'arrangement du métier (photo d'étal + « nos fromages » en
  cartes + bouton appeler) et la photo de banque : aucune photo, les meules sont dessinées en CSS, avec leurs
  étiquettes en mono.
- SQUELETTE : une seule colonne étroite (34 rem au plus) qui se décale d'une marche vers la droite à chaque
  section sur ordinateur, comme un escalier ; les planches (étagères) débordent la colonne vers la droite.
  Nav sur mesure fine et claire en haut (la porte sur la rue reste en haut quand on est en bas). Ordre : la
  rue (premier écran) → l'escalier → la cave à 11 °C (tommes, reblochons) → l'étagère des âges (beaufort) →
  ce qui se réserve (raclette, plateaux, comptoir) → Demandez à Claire (FAQ) → 12 rue de la Gare (venir, le
  plus sombre) → pied. Contact au pouce dans la nav sur téléphone. Écart avec `ff variete` : pierre n'est
  porté que par studio-ambre (coquille flow, colonnes larges) ; ici colonne en escalier, aucune section partagée
  sauf le schéma.
- PREMIER ÉCRAN — famille : objet-du-metier (attribuée le 17 oct 2026, après coup) ; téléphone : nav (nom + « Appeler »), h1 « Fromagerie Ravanel » en serif condensée grasse
  sur deux lignes (≈ 4 rem), deux phrases (cave à 11 °C, six fermes, on goûte), le numéro en mono en gros
  comme lien d'appel, l'horaire du jour ; en bas de l'écran, les premières marches de l'escalier commencent
  et s'assombrissent. Ordinateur : même colonne à gauche, h1 plus grand (≈ 8 rem sur une ligne), l'escalier
  prend toute la largeur sous le texte et descend vers la droite.
- MOUVEMENT (rien sur les titres, aucun `data-split`, pas de rideau) :
  1. Entrée : les marches de l'escalier apparaissent l'une après l'autre en descendant (on descend), puis la
     lumière baisse avec le défilement : chaque marche est plus sombre que la précédente et le fond passe du
     clair de la rue au noir de cave, en suivant le doigt (pas d'étape, pas de script). Raison : descendre.
  2. Rythme : les meules se posent sur les planches l'une après l'autre quand la planche arrive à l'écran
     (cave, ce qui se réserve). Raison : ranger.
  3. Feu d'artifice : l'étagère des âges : trois planches 12, 18, 24 mois ; on fait glisser la meule de
     beaufort d'une planche à l'autre (au doigt, ou en touchant une planche, ou aux flèches du clavier), la
     fiche dit ce que cet âge change et la phrase à dire au comptoir. Raison : choisir.
  4. Image qui bouge : la porte de la rue (rectangle de jour en haut de l'escalier) rapetisse et s'éloigne
     quand on descend l'escalier. Raison : s'éloigner.
  Courbes : régime sec ≤ 0,15 s linéaire (chaque marche qui apparaît, le changement de la fiche, les retours
  de bouton : ce sont des réponses, elles ne se font pas attendre) ; régime lent à léger rebond, 0,75 s,
  `cubic-bezier(0.3, 1.4, 0.55, 1)` (la meule qui se pose sur la planche : une chose lourde qui touche le bois
  et se tasse). Démontage transposé : Agrumea Farm (les produits dessinés à la même échelle, chacun à sa place,
  qu'on fait passer à la main ; on garde l'objet manipulé, on refuse la molette détournée) et Pizza Amici
  (ce qui bouge est l'objet du métier, les fiches techniques chiffrées : on garde les mesures du brief en
  mono, 4 ou 8 personnes, 50 €, 48 h).
- REFUSÉ : la photo de la cave de Herve (une cave belge présentée sans le dire, ou légendée « d'illustration » :
  les deux sont refusés) ; l'ardoise et la craie qui s'écrit (piste A) ; ticket et semaine (piste C) ;
  rideau ; titres qui montent ; bouton « Appeler le … » rectangle plein sous le h1 (les trois pistes d'avant) ;
  surtitre gris au-dessus du h1 ; bois verni, carreaux rouges, doré (le client n'aime pas) ; dates de meules
  inventées (les étiquettes portent « entrée » et un trait de craie illisible, pas une date) ; toute
  description de goût autre que générale du métier.
- FIN : non relu = pas fini ; ce site se termine par le verdict du relecteur.

## Typographie, couleur, images
- Direction `pierre` (pierre de cave, gris de calcaire tiré au vert, angles droits). Accent surchargé en ocre
  de croûte de tomme (h 34, s 48 %, l 30 %) à la place du vert serpentine.
- Couleur : clair qui s'assombrit en descendant. Tous les tons sont des mélanges de `--bg` et `--ink` de la
  direction (`color-mix`), aucun hex dans les sections : rue = `--bg`, escalier = dégradé jusqu'à 78 % d'encre,
  cave = 78 %, puis 84 %, 88 %, 92 % ; pied = `--ink`.
- Polices, trois rôles : Libre Caslon Condensed (h1 en 700, h2 en 500), Archivo pour le texte (franc,
  direct), JetBrains Mono de la direction pour les étiquettes de meules, les âges, les prix, les heures et les
  h3. Aucune police de la liste IA.
- Images : aucune photo. Meules, planches, escalier et porte dessinés en CSS. `public/images` gardé (la photo
  de cave est réservée à cette piste), non utilisé.

## Références
- Agrumea Farm (`docs/veille/demontages/agrumeafarm.md`) : la gamme qu'on fait passer à la main, chaque
  produit dessiné à la même échelle → l'étagère des âges, une seule meule déplacée d'une planche à l'autre.
- Pizza Amici (`docs/veille/demontages/pizza-amici.md`) : ce qui bouge est l'objet, les fiches chiffrées en
  mono → les étiquettes de meules (raclette 4 ou 8 personnes, caution 50 €, plateaux 6 à 30, 48 h).

## Différence avec la piste A et la piste C
| Axe | A « L'ardoise » | B « La cave » (ici) | C « La semaine » |
|---|---|---|---|
| Lecture | ardoise du comptoir | cave à 11 °C sous la boutique, meules datées | semaine de Claire et Théo |
| Couleur | sombre ardoise | clair qui s'assombrit en descendant | papier blanc + couleur franche |
| Typo | craie + grotesque | serif condensée + mono d'étiquettes | grotesque large/slab + mono de ticket |
| Entrée | la craie s'écrit | les marches apparaissent en descendant, la lumière baisse au défilement | ticket qui sort / bande de jours |
| Apparition | lignes écrites de gauche à droite (sec) | meules qui se posent sur les planches (lent, rebond) | tickets posés en paquet (sec) |
| Geste | toucher un fromage de l'ardoise | faire glisser la meule de beaufort d'une planche d'âge à l'autre | toucher un jour de la semaine |
| Squelette | flow, ardoise en premier écran | colonne étroite en escalier | index, la semaine en premier écran |

## Accepté par le fondateur
(rien encore)
