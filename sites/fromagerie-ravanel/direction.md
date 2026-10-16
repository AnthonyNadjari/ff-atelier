# Direction — Fromagerie Ravanel (fromagerie-ravanel)

Démo fictive, 16 oct 2026, premier test de `/site-final` v3.

## Faits propres (tirés du brief)
1. Une cave à 11 °C creusée en 2014 sous la boutique, où tommes et reblochons fermiers finissent de s'affiner.
2. Chaque meule porte sa date d'entrée en cave, écrite à la craie.
3. On peut demander un fromage « plus jeune » ou « plus fait ».
4. Le beaufort d'alpage se vend à l'âge choisi : 12, 18 ou 24 mois.
5. Six fermes des Aravis et des Bauges, nommées sur l'ardoise du comptoir.
6. On goûte avant d'acheter, toujours.
7. L'appareil à raclette se prête (4 ou 8 personnes), caution 50 €, à réserver deux jours avant le week-end.
8. Plateaux de 6 à 30 personnes, dès 6 € par personne, commandés 48 h avant (une semaine pour les fêtes).
9. Le stand au marché de la vieille ville, mardi et vendredi matin, depuis 2019.
10. 12 rue de la Gare, Annecy ; fermé le lundi ; ouvert le dimanche matin.
11. Claire (affinage, commandes) et Théo (boutique, marché).

## Phrase-idée
« Sur ce site, l'ardoise du comptoir devient la page : écrite à la craie, elle dit ce qui se réserve cette
semaine, et le beaufort se choisit à son âge en faisant glisser 12, 18, 24 mois. »

## Test du concurrent
Une autre fromagerie d'Annecy a aussi une ardoise. Ce qu'elle n'a pas : la cave sous la boutique avec les dates
à la craie, le beaufort vendu à trois âges, le prêt de l'appareil à raclette contre caution. L'ardoise seule ne
tient pas ; l'ardoise qui porte ces trois faits-là tient. Retenu : le bloc signature est « l'âge du beaufort »
(choix à la main, faits du brief), l'ardoise est le premier écran.

## Contrat
- THÈSE : le premier écran est l'ardoise du comptoir (ce qui se réserve, horaires, téléphone), pas une photo de
  plateau ; le défaut du métier (photo de fromages en grand + « Bienvenue ») est refusé.
- SQUELETTE : coquille `flow` (famille alimentation, `sticky-hero` déjà porté par 3 sites), nav `bar` (dock
  refusé : barre en pilule), contact en fin de page + téléphone dans l'ardoise ; ordre : ardoise (hero sur
  mesure) → l'âge du beaufort (signature) → la cave (photo + faits) → réserver (raclette, plateaux) → FAQ →
  contact. Direction `terre` déjà portée par atelier-lecerf (custom) et demo-paysagiste (split) : écart par le
  squelette, la typo et le premier écran sombre.
- PREMIER ÉCRAN : fond ardoise (`--ink`), titre à la craie en grande taille (« Fromager-affineur, rue de la
  Gare »), trois lignes d'ardoise (raclette à réserver, plateaux 48 h, marché mardi/vendredi), horaires du jour,
  téléphone en bouton. Lisible sans défiler sur un iPhone.
- MOUVEMENT (ajouté le 16 oct après « pourquoi y'a aucune animation ? ») : entrée = titre par lignes et trait
  de craie qui se trace ; rythme = lignes de l'ardoise et bons qui apparaissent l'un après l'autre ; feu
  d'artifice = l'âge du beaufort, bande qu'on fait glisser à la main, le chiffre suivant pâle au bord grandit en
  arrivant, la bande s'entrouvre une fois pour montrer qu'elle glisse ; image = la cave qui recule au défilement.
- REFUSÉ : nav `dock` du composer (pilule), `about/timeline` (trois dates déjà dites dans la cave), carreaux
  rouges et bois verni (le client n'aime pas), crème + serif + terracotta (grappe dépensée), toute photo qui
  prétendrait montrer Claire, Théo ou la boutique.
- FIN : non relu = pas fini ; ce site se termine par le verdict du relecteur.

## Typographie, couleur, images
- Direction `terre` (fromager dans ses métiers) ; titres en **Savate** (grotesque vive, dessinée à la main :
  la craie sans pastiche de craie), texte en **Hanken Grotesk**. Paire inédite dans l'usine.
- Ardoise = `--ink` de la direction (vert très sombre) ; accent : celui de terre (vert sapin) ; pas de crème
  ajoutée : le fond clair reste celui de la direction.
- Rayons : ceux de terre (20 / 28 px) sont trop ronds pour la charte ; les blocs sur mesure utilisent
  `rounded-ui` sur les boutons seulement, cartes à angles nets.
- Photos libres (Openverse / Wikimedia, crédits) : une cave d'affinage, une meule de beaufort entamée. Aucune ne
  prétend montrer la boutique.

## Références
- `dentaire-morvan` (usine) : l'état du jour calculé à partir des horaires, repris en version « ardoise ».
- Démontages en cours (`docs/veille/demontages/`) : à compléter quand l'INDEX existe.

## Accepté par le fondateur
(rien pour l'instant)
