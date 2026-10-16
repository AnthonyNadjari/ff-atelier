# Direction — Fromagerie Ravanel, piste A « L'ardoise » (fromagerie-ravanel)

Démo fictive. Refaite de zéro le 16 oct 2026 au soir, après « très similaire sur les animations » et « toutes
IA generated » (`docs/veille/pourquoi-ia-2026-10.md`). Contrat écrit avant la construction, lu par le relecteur DA.

## Faits propres (tous tirés du brief)
1. Les fromages viennent de six fermes des Aravis et des Bauges, que Claire nomme sur l'ardoise (les noms ne
   sont PAS dans le brief : le site dit « une des six fermes », jamais un nom).
2. On goûte avant d'acheter, toujours.
3. Le beaufort d'alpage se vend à l'âge choisi : 12, 18 ou 24 mois.
4. Tommes et reblochons fermiers finissent de s'affiner dans une cave à 11 °C sous la boutique ; date d'entrée à
   la craie ; « plus jeune » ou « plus fait » sur demande.
5. Beaufort 24 mois et vieille tomme : très peu de lactose, « demandez à Claire ».
6. Appareil à raclette prêté (4 ou 8 personnes), caution 50 €, deux jours avant le week-end, il en reste rarement
   le samedi ; fromage coupé ou râpé à la demande.
7. Plateaux de 6 à 30 personnes, dès 6 € par personne, 48 h avant, une semaine pour Noël et le Nouvel An.
8. Claire : affinage et commandes. Théo : boutique et marché.
9. Marché de la vieille ville mardi et vendredi matin, depuis 2019 ; reprise en 2011 ; cave en 2014 ; apprentissage
   dans la vallée de Thônes.
10. Le client aime les ardoises écrites à la craie ; n'aime pas le chalet de station ni le luxe doré.

## Phrase-idée
« Sur ce site, l'ardoise du comptoir devient la page : tout y est écrit à la craie, et toucher un fromage
l'entoure comme Claire le ferait, en disant d'où il vient. »

## Test du concurrent
Une autre fromagerie d'Annecy a une ardoise. Ce qui reste à Ravanel : les six fermes des Aravis et des Bauges
nommées au comptoir, le « goûtez d'abord », le beaufort à trois âges, l'appareil prêté contre caution. L'ardoise
seule ne tient pas ; l'ardoise qui porte CES lignes et CE geste (entourer, dire la ferme) tient.

## Contrat
- THÈSE : la page est une ardoise, pas une vitrine. Refusé : la grande photo de plateau + « Bienvenue », et toute
  photo (aucune n'est du client). Tout ce qui n'est pas du texte est dessiné à la craie : la meule, l'appareil à
  raclette, le plateau.
- SQUELETTE : coquille `flow`, l'ardoise en premier écran. Nav sur mesure (nom à la craie, trois ancres,
  « Appeler » toujours visible). Ordre : premier écran (nom écrit + meule dessinée + Claire + téléphone) →
  L'ardoise (signature) → Une raclette samedi ? (ce qui se réserve, dessins) → On nous demande souvent → Rue de la
  Gare (adresse, horaires du jour, marché, Claire et Théo) → pied `minimal`. Aucune section partagée animée : la
  FAQ est réécrite pour ne pas lever son titre.
- PREMIER ÉCRAN : téléphone, « Fromagerie Ravanel » à la craie sur deux lignes (≈ 17 vw), soulignée en jaune ;
  une phrase grotesque (métier, rue, depuis 2011, six fermes) SOUS le titre, jamais au-dessus ; « Goûtez d'abord.
  On coupe après. », signé Claire ; bouton « Appeler le 04 65 71 23 18 » + horaire du jour. Ordinateur : la meule
  dessinée à droite, 5/12 de la largeur, sa part coupée en jaune.
- MOUVEMENT (ce qu'on voit ; l'outil vient après, lib/craie.ts, rien du moteur) :
  1. Entrée : le nom de la boutique s'écrit à la craie, lettre après lettre dans l'ordre du tracé (85 ms par
     lettre, linéaire), puis un trait jaune le souligne ; la meule se dessine en même temps. Raison : montrer.
     C'est la seule entrée du h1, propre à ce client (une ardoise qu'on écrit) ; transposée de Délice (le titre
     qui se pose comme une enseigne peinte, puis la photo) : on garde « le titre est un objet du lieu qui se
     fait sous les yeux », pas le tracé SVG lettre à lettre.
  2. Rythme au défilement : chaque ligne d'ardoise (fromages, conditions, horaires) s'écrit de gauche à droite
     en 180 ms, 70 ms d'écart. Raison : lire. Les titres de section ne bougent pas.
  3. Feu d'artifice : toucher un fromage l'entoure d'un cercle de craie jaune tracé à la main (0,62 s) et écrit
     dessous sa ferme d'origine ; sur le beaufort, la ligne « Beaufort d'alpage, 18 mois » s'efface au chiffon
     (120 ms) et se réécrit à l'âge touché. Raison : choisir.
  4. Image qui bouge : la part de beaufort se détache de la meule à mesure qu'on descend (translation seule,
     calée sur le défilement) ; l'appareil à raclette et le plateau se dessinent quand ils arrivent. Raison :
     la marchandise.
  Courbes : SEC = linéaire, 85 à 180 ms (écrire, effacer, boutons) ; LENT = main `cubic-bezier(0.45, 0.05, 0.3,
  1)`, 0,42 à 0,82 s (tout ce qui se dessine). Rien d'autre, aucune courbe expo-out du moteur.
- REFUSÉ : rideau ; data-split, data-reveal, data-stagger ; photos de banque (cave réservée à B, raclette à C,
  beaufort à personne) ; surtitre « métier, rue, ville » au-dessus du h1 ; tableau à filets « Pour / Prix /
  Commander » ; chiffre géant de l'âge du beaufort ; texture d'ardoise, grain, cadre en bois (chalet) ; police
  « craie » de fantaisie (pastiche).
- FIN : non relu = pas fini.

## Typographie, couleur, images
- Direction `nuit` (sombre), poussée vers l'ardoise : fond = mélange des tokens `--bg` et `--muted` de la
  direction (gris ardoise bleuté), ciel étoilé retiré. Blanc de craie = `--fg`. Craie jaune = accent
  `hsl(47 82% 70%)`, réservé à ce qu'on entoure, souligne ou réserve.
- **Savate** (grotesque dessinée à la main) = l'écriture de craie : h1, fromages, conditions, horaires, citations.
  **Special Gothic** (gothique américaine, franche) = l'imprimé : titres de section (750), texte. Deux rôles, pas
  une police de titre unique ; h2 toujours plus petit que le h1.
- Images : aucune photo. Dessins au trait, en SVG, tracés à la craie.
- Adjectifs : chaleureux (la main, la voix de Claire), franc (gothique, phrases courtes, prix écrits), montagnard
  (Aravis, Bauges, beaufort d'alpage), sans chalet ni dorure.

## Titres
« Fromagerie Ravanel » (h1), « L'ardoise », « Une raclette samedi ? », « On nous demande souvent », « Rue de la
Gare » ; h3 « Au comptoir aussi », « L'appareil à raclette », « Les plateaux », « Horaires », « Au marché »,
« Claire et Théo ». Aucun ne finit par un point ; une question ; Claire et Théo nommés.

## Différence avec les pistes B et C (tableau du parent, 16 oct 2026 soir)
| Axe | A « L'ardoise » (ici) | B « La cave » | C « La semaine » |
|---|---|---|---|
| Couleur | sombre, ardoise d'un bout à l'autre | clair qui s'assombrit | papier blanc + une couleur |
| Typo | Savate (craie) + Special Gothic | serif condensée + mono | grotesque large/slab + mono |
| Entrée | le nom s'écrit à la craie, lettre à lettre, la meule se dessine | la lumière baisse en descendant | ticket qui sort / bande de jours |
| Apparition | lignes écrites de gauche à droite, sec | meules posées, lent, rebond | fiches posées en paquet |
| Geste | entourer un fromage, dire sa ferme | glisser une meule d'une planche à l'autre | toucher un jour |
| Squelette | flow, ardoise en premier écran | colonne étroite en escalier | index, la semaine en premier |

## Références
- Délice (`docs/veille/demontages/delice.md`) : le titre du premier écran est un objet du lieu qui se pose sous
  les yeux (là, une enseigne peinte ; ici, la craie). Ensuite, plus aucun titre ne bouge.
- Pizza Amici (`docs/veille/demontages/pizza-amici.md`) : une voix manuscrite pour l'aparté et une signature
  (« Chef Gianluca ») ; ici « Goûtez d'abord. On coupe après. », Claire. Et des chiffres d'exploitation dits en
  grand (4 ou 8 personnes, 50 €, 48 heures) plutôt que des consignes.

## Accepté par le fondateur
(rien pour l'instant)
