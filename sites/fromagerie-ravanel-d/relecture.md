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
