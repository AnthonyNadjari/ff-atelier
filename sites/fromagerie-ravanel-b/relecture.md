# Relecture — fromagerie-ravanel-b, piste B « La cave » (jamais publié)

Piste B refaite le 16 oct 2026 au soir (direction.md : la page est une descente d'escalier, colonne de 34 rem
qui se décale d'une marche par section, lumière qui baisse). Deux agents neufs (DA, rédacteur), prompts de
`.claude/skills/site-final/relecteurs/`, barème de confiance et grille à plafonds.

## Tour 1 — 17 oct 2026 — verdict DA : corriger / rédacteur : corriger
Notes DA : composition 6,5 (plafond « deux écrans d'ordinateur presque vides »).
Constat DA : sur ordinateur (1400 px), cinq écrans où un seul h2, ou trois lignes de FAQ, tiennent dans la
colonne de 34 rem sur un mur sombre, autant de vide au-dessus et au-dessous qu'à gauche ; les planches de la
cave font à peine la largeur de la colonne alors que le contrat promet qu'elles « débordent la colonne vers la
droite » ; les trois planches de « Vous serez combien ? » s'empilent sur deux écrans. Le site se lit comme la
version téléphone collée sur un mur noir ; le décalage `--pas` n'est pas perçu comme une marche mais comme une
dérive dans le vide.

Constats appliqués (escalier, lumière qui baisse, étagère des âges inchangés ; le téléphone ne change pas) :
- Rédacteur 1 (appliqué avant ce tour, par le parent) : Cave.astro sans redite du premier écran (il reste la
  cave creusée en 2014, la date à la craie, la parole de Claire et « chaque fromage a sa ferme »).
- Rédacteur 2 (appliqué avant ce tour) : Pied.astro ne dit plus deux fois « Finck & Fisch ».
- DA 1, la marche dessinée dans le vide (Porte.astro, style global, ≥ 72 rem) : à chaque section, un giron de
  1 px du bord gauche de la colonne précédente au bord gauche de la nouvelle (`--marche`, le même pas que
  `--gauche`), puis la contremarche verticale de 1 px qui descend jusqu'au h2 ; au pied de la contremarche,
  dans le vide de gauche, l'étiquette mono de la section peinte sur le mur, un fait du brief et rien d'autre :
  « cave, 11 °C », « beaufort, 12 / 18 / 24 mois », « 4 ou 8 personnes, 50 € », « mardi et vendredi, marché »
  (Demandez à Claire garde sa marche sans étiquette). Couleur : `--croute-tomme-dessus`, aucun hex.
- DA 2, la verticale resserrée (≥ 72 rem) : `.palier` passe de 8 rem + 8 rem à 4 rem avant le h2 et 2 rem
  après la section (6 rem entre la fin d'une section et le h2 suivant) ; le numéro de « réserver » et la
  rangée des planches à 3 rem. Page : 5 498 → 4 489 px de défilement.
- DA 3, la promesse des planches : `.cave-planches` en `width: min(60vw, 52rem)` (mesuré 832 px pour une
  colonne de 544 px : les cinq tommes et les huit reblochons remplissent le bois) ; `.reserver-planche` sur
  une rangée de trois à partir de 72 rem (raclette, plateaux, comptoir côte à côte, `minmax(0, 22rem)` chacune,
  mesuré 3 × 271 px à 1400 px : la marche 3 ne laisse que 894 px), bois aligné sur une même ligne.
- Non nécessaire : colonne à 44 rem (option d). La marche dessinée suffit à l'œil, la colonne reste à 34 rem.

Sur la planche (`captures/planches/fromagerie-ravanel-b-d-0.jpg`, 1400 × 900, une vignette tous les 300 px) :
- Avant : 1500 (planches de la cave, meules sur les deux tiers gauches, rien à droite) ; 2100 et 2400
  (« L'étagère des âges » seul au milieu, deux vignettes de suite) ; 2700-3000 (« Vous serez combien ? » seul,
  deux fois) ; 3300-3900 (les trois planches empilées sur deux écrans) ; 4200 (« Demandez à Claire » seul en
  bas) ; 4800 (trois lignes de FAQ seules en haut, « 12 rue de la Gare » seul en bas) ; 5100 (h2 seul).
- Après : 600 (bas de l'escalier, giron + « cave, 11 °C » + h2 en bas d'écran) ; 1500 (planches pleines,
  parole de Claire sous les reblochons) ; 1800 (parole de Claire, marche « beaufort, 12 / 18 / 24 mois »,
  « L'étagère des âges » avec son texte) ; 2400 (étagère + fiche, marche « 4 ou 8 personnes, 50 € », « Vous serez
  combien ? » avec son texte) ; 3000-3300 (les trois planches sur une rangée, le numéro) ; 3600 (numéro, marche,
  « Demandez à Claire » et ses trois questions) ; 4200 (fin de la FAQ, marche « mardi et vendredi, marché »,
  « 12 rue de la Gare » et la semaine). Plus aucun écran d'ordinateur avec un h2 seul au milieu du vide.

Contrôles : `ff build` ok ; `ff verifier --sans-build --sans-a11y` sans ✗ (deux avertissements attendus :
tirets de /credits, aucune phrase orale) ; `ff ia` sans échec ; `ff captures` : aucune erreur console, aucun
débordement (largeur de défilement 1400 px) ; téléphone inchangé (390 px, aucune marche dessinée sous 72 rem).

Reste faible : les objets de « Vous serez combien ? » sont petits sur des planches de 271 px (la marche 3 mange
490 px à gauche ; 22 rem pleins seulement au-delà de 1 650 px) ; l'étiquette mono de 13 px est discrète sur un
écran de 1400 px, voulu (peinte sur le mur), à confirmer par le fondateur ; sur « L'étagère des âges », le vide
à droite du texte d'intro reste (le meuble et la fiche le remplissent dessous).
Constats écartés : aucun.
Décisions prises pour le fondateur : aucune (colonne, escalier et lumière tels quels).
