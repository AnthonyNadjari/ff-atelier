# Direction — Fromagerie Ravanel, piste D « Le comptoir » (fromagerie-ravanel-d)

Démo fictive, construite le 17 oct 2026 après « est-ce qu'un client en achèterait vraiment un des trois ? » et
« c'est un peu tout le temps la même chose » (GOUT § 0, `docs/veille/marche/CE-QUI-VEND.md`). Les pistes A, B, C
étaient une longue page avec une idée forte et le socle sacrifié. Celle-ci pose d'abord le socle d'un site qui
fait signer (plusieurs pages, téléphone en haut, métier + ville, horaires du jour, portes par intention), puis UN
seul bloc sur mesure. Contrat écrit avant de construire, lu par le relecteur DA. Jamais publié.

## Aiguillage
Photos : le brief n'a pas répondu (`ff aiguillage` : ni « photos » ni « ambiance ») ; démo sans photo du client,
on prend les trois photos libres déjà sourcées pour les pistes (cave, beaufort, raclette, Wikimedia, crédits dans
CREDITS.md et page /credits), sans légende, et le compte rendu dit qu'un vrai client fournit les siennes.
Mouvement : vivant mais sobre, `motion` none pour le moteur (aucun titre ni bloc partagé ne bouge), le mouvement
vient des deux sections sur mesure seulement, parce que le client veut « franc » et que le fondateur a refusé les
titres qui montent.

## Socle (docs/GOUT.md § 0)
- Pages : présent. Accueil + une page par offre du brief (la cave et l'affinage, le beaufort à 12, 18 ou 24 mois,
  raclette et appareil prêté, plateaux sur commande, le comptoir), `servicePages` actif, plus mentions, crédits.
- Téléphone en haut : présent. Ordinateur : panneau de gauche collé (coquille split), numéro en gros bouton,
  toujours visible. Téléphone : bouton « Appeler » dans la barre du haut, numéro en grand dans le premier écran,
  barre d'actions en bas (`layout.actionBar`).
- Métier + ville : présent, dans le h1 (« Fromager-affineur rue de la Gare, à Annecy »).
- Avis : absent : aucun avis au brief. Aucune section avis, aucune note, rien d'inventé.
- Ancienneté : présent, « Depuis 2011 » en texte dans la phrase sous le h1, et les jalons 2011, 2014, 2019.
- Photos : absent côté client (démo) ; trois photos libres créditées (cave, beaufort, raclette), aucune légende.
- Portes : présent. Appeler ; Réserver l'appareil à raclette (appel) ; Commander un plateau (le bloc plateau puis
  appel) ; Venir (adresse, horaires). Pas de formulaire : le brief n'a pas d'e-mail.

## Faits propres (tous tirés du brief)
1. Plateaux pour 6 à 30 personnes, composés avec vous, dès 6 € par personne.
2. Plateau à commander 48 heures avant, une semaine avant pour Noël et le Nouvel An.
3. Appareil à raclette prêté pour 4 ou 8 personnes, caution de 50 €, à réserver deux jours avant le week-end ;
   il en reste rarement le samedi.
4. Cave d'affinage à 11 °C sous la boutique, creusée en 2014 ; date d'entrée de chaque meule à la craie ; « plus
   jeune » ou « plus fait » sur demande.
5. Beaufort d'alpage vendu à 12, 18 ou 24 mois.
6. Six fermes des Aravis et des Bauges, nommées par Claire sur l'ardoise (noms absents du brief : aucun écrit).
7. On goûte avant d'acheter, toujours.
8. 12 rue de la Gare, Annecy ; mardi à vendredi 8 h 30 à 12 h 30 et 15 h 30 à 19 h, samedi 8 h à 13 h et 15 h à
   19 h, dimanche 8 h 30 à 12 h 30, lundi fermé.
9. Marché de la vieille ville le mardi et le vendredi matin (stand depuis 2019), tenu par Théo.
10. Claire Ravanel : affinage et commandes, apprise dans la vallée de Thônes, reprise de la crémerie en 2011.
11. Comptoir : beurre de baratte, crème crue, yaourts de la ferme, quelques vins de Savoie.

## Phrase-idée
« Sur ce site, la règle des plateaux de Claire (6 à 30 personnes, dès 6 € par personne, 48 heures avant) devient
un plateau qu'on remplit en disant combien on sera à table : les parts se posent, le prix de départ et le jour où
il peut être prêt se calculent, et le bouton appelle Claire. »

## Test du concurrent
La crémerie d'à côté fait peut-être des plateaux, mais pas avec ces bornes (6 à 30), ce prix de départ (6 € par
personne), ce délai (48 heures, une semaine pour les fêtes) ni ce lundi fermé qui décale le jour de retrait. Le
plateau qui se remplit est un mécanisme de métier ; ce qui le rend à Ravanel, ce sont ses chiffres et ses jours,
qui changent le résultat affiché. Il sert aussi l'achat (une commande au téléphone), ce que les gestes des pistes
A, B, C (entourer un fromage, glisser une meule d'un âge à l'autre, toucher un jour) ne faisaient pas.

## Contrat (six lignes)
- THÈSE : un commerce de bouche qu'on appelle. Le site répond d'abord « est-ce ouvert, où, quel numéro, que
  puis-je réserver », puis laisse choisir une offre et ouvrir sa page. Refusé : la longue page d'ambiance avec le
  formulaire en bas (les trois pistes d'avant), et l'idée qui prend la place du socle.
- SQUELETTE : coquille `split` (aucune piste ne l'a) : sur ordinateur, panneau de gauche collé avec le nom,
  « Fromager-affineur à Annecy », la nav et le téléphone ; le contenu défile à droite. Nav `bar` sur téléphone et
  sur les pages d'offre. Accueil : Comptoir (premier écran, sur mesure) → les cinq offres (Offres, sur mesure depuis
  le tour 1 : une carte par offre, photo ou objet dessiné, une carte = une page) → bande photo du beaufort, pleine
  largeur → Le plateau (bloc sur mesure, sa planche chevauche la bande) → Claire et Théo (about/timeline partagée,
  jalons) → bande photo du bas de la cave → questions (faq/two-columns partagée) → 12 rue de la Gare (contact/simple partagée, sans formulaire) → pied
  `columns`. Cinq pages d'offre (`/services/` puis le nom de l’offre) avec leur photo et le téléphone. Barre d'actions en bas sur
  téléphone : Appeler, Venir.
- PREMIER ÉCRAN : téléphone : barre (nom, bouton Appeler) ; h1 « Fromager-affineur rue de la Gare, à Annecy » en
  slab grasse sur trois lignes ; une phrase (depuis 2011, six fermes, on goûte) ; le numéro en gros chiffres ;
  la pancarte de porte avec l'état du moment et les horaires du jour ; « Marché de la vieille ville : mardi et
  vendredi matin, avec Théo » ; trois portes (Réserver une raclette, Commander un plateau, Venir). Tour 1 (17 oct
  2026, « trop 2D ») : la photo de cave en plein cadre (moitié haute de l'écran sur téléphone, tout l'écran à
  droite du panneau sur ordinateur) et tout ce texte POSÉ dessus sur une carte (tranche couleur croûte, ombre
  portée), qui déborde sur la section suivante à l'ordinateur ; la pancarte pend à un clou planté dans la photo,
  devant le bord de la carte. Ordinateur : panneau de gauche (téléphone dedans).
- MOUVEMENT (rien sur les titres, pas de rideau, aucun outil du moteur) :
  1. Entrée : la pancarte de la porte se retourne une fois à l'arrivée et montre l'état du moment (« Ouvert »,
     « Ouvre à 15 h 30 », « Fermé »), comme Claire la retourne le matin ; lent à léger rebond, 0,7 s. Raison :
     ouvrir. Transposé de Délice (horaires ouverts sur le jour même) : on garde « le jour même d'abord », pas
     leur rouge ni leur carrousel.
  2. Rythme : quand le plateau arrive à l'écran, les parts du nombre de départ se posent une à une sur la planche,
     sec, 0,16 s chacune, 40 ms d'écart. Raison : servir.
  3. Feu d'artifice : on fait glisser le curseur « combien à table » (ou les boutons moins et plus, ou les
     flèches du clavier) : chaque part ajoutée tombe sur la planche avec un rebond (0,45 s), chaque part retirée
     s'efface sec (0,12 s) ; le prix de départ et le jour de retrait changent en même temps, sec. Raison : choisir.
  4. Image qui bouge : trois plans au défilement (tour 1) : les photos (cave du premier écran, bandes du beaufort et
     du bas de la cave) descendent moins vite que la page dans leur cadre fixe, la carte suit la page, la pancarte
     monte un peu plus vite ; translations verticales seules, bornées à ce que la photo dépasse de son cadre.
     Raison : descendre à la cave.
  Courbes : SEC = ease-out court ou linéaire, 0,12 à 0,16 s (parts posées en série, part retirée, chiffres qui
  changent : ce sont des réponses) ; LENT à rebond = `cubic-bezier(0.34, 1.45, 0.6, 1)`, 0,45 à 0,7 s (une
  part qui tombe sur le bois, une pancarte qui tourne sur son clou : des objets qui ont du poids).
- REFUSÉ : longue page unique ; formulaire (pas d'e-mail au brief) ; section avis ou note (aucune au brief) ;
  craie, ardoise (A), escalier et étagère des âges (B), barre de la semaine et ticket (C) ; hero partagé (surtitre
  « métier à ville » au-dessus du h1 et h1 révélé par lignes : GOUT § 2) ; crème + serif ; badge « Depuis 2011 » ;
  « X ans » ; légende « photo d'illustration » ; noms de fermes inventés ; prix autre que « dès 6 € par
  personne » et la caution de 50 €.
- FIN : non relu = pas fini ; ce site se termine par le verdict du relecteur.

## Typographie, couleur, images
- Direction `terre` depuis le tour 1 (17 oct 2026) : papier chanvre, vert mousse, ocre de croûte (son --accent-2,
  la couleur des meules sur les photos), noyer pour la planche (ocre foncé). `nordique` (blanc froid) était un aplat
  sans matière à côté des photos de cave. Aucune autre piste ne l'a (A nuit, B pierre, C encre ; `ff pistes` vert).
- Polices : Epunda Slab (slab sec, contemporain : l'étiquette imprimée de crémerie) pour h1 et h2, Hanken Grotesk
  pour le texte et les h3 en gras. Deux rôles, h1 nettement plus grand que h2. Aucune police de la liste IA.
- Accent : vert mousse de la direction (contraste vérifié par `ff detect`), réservé au téléphone, aux portes, à la
  pancarte et au bouton du plateau. L'ocre n'est jamais un fond de texte (2,6:1 sous le crème) : tranches des
  cartes, croûtes, bois.
- Images : cave (premier écran plein cadre, carte, bande du bas, page « La cave »), beaufort (carte, bande pleine
  largeur, page beaufort), raclette (carte, page raclette ; 1 000 px à la source, trop petite pour une bande), libres
  de droits, créditées, sans légende. Le plateau est dessiné en CSS (planche, parts), pas en photo ; le comptoir est
  une étiquette posée sur le bois.
- Calibration : pas crème + serif (chanvre + slab), pas noir + acide, pas broadsheet, pas de cartes SaaS (les cartes
  ont une photo ou un objet, une plaque qui déborde, une tranche, pas un rayon de 20 px).

## Références
- Délice (`docs/veille/demontages/delice.md`) : horaires ouverts sur le jour même et barre d'actions en bas sur
  téléphone ; on garde l'état du jour en tête de page (la pancarte) et la barre Appeler / Venir.
- Studenterkilden (`docs/veille/demontages/studenterkilden.md`) : la FAQ de logistique qui répond aux vraies
  questions avant l'appel ; on garde les trois questions du brief (réserver l'appareil, plateau le jour même,
  sans lactose), posées telles quelles, sans en inventer.
- Marché (`docs/veille/marche/framer-lintel.md`, `s-elec.md`, `garage-ouestcar.md`) : téléphone en grand dans le
  premier écran, métier + ville dans le h1, une page par service, portes nommées par intention.

## Différence avec les pistes A, B et C
| Axe | A « L'ardoise » | B « La cave » | C « La semaine » | D « Le comptoir » (ici) |
|---|---|---|---|---|
| Squelette | flow, une page | colonne en escalier, une page | index, une page | split (panneau collé), accueil + 5 pages |
| Couleur | sombre ardoise | clair qui s'assombrit | papier blanc + orange | chanvre + vert mousse + ocre, photos en grand |
| Typo | craie + grotesque | serif condensée + mono | Archivo Black + mono | Epunda Slab + Hanken |
| Entrée | la craie s'écrit | marches, lumière qui baisse | talons, ticket imprimé | la pancarte se retourne sur l'état du moment |
| Apparition | lignes écrites | meules posées (lent) | fiches en paquet | rien n'apparaît ; seules les parts du plateau se posent |
| Geste | entourer un fromage | glisser une meule d'âge | toucher un jour | dire combien à table : le plateau se remplit, prix et jour |

## Accepté par le fondateur
(rien encore)
