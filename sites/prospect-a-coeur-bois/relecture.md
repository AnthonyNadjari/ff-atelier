# Relecture — À cœur bois, Guy Andries (prospect-a-coeur-bois)

Démo privée pour un vrai commerce prospecté (`legal.prospect` : noindex, robots fermé). Jamais publiée.

## Tour 0 — 17 oct 2026 — une piste, relecture dégradée : un seul contexte (pas d'agents relecteurs lancés : consigne « deux passes au plus », jugement fait sur les captures, la planche et le film)

### Ce qui est fait
- Squelette : coquille `flow`, barre du haut sur mesure (nom, cinq rubriques en pages, 06 74 03 78 31 écrit en
  entier sur téléphone et ordinateur), premier écran « Mur », planche des avis qui remonte sur le mur, cinq façades
  de rubrique, l'atelier de Guy Andries, Venir, pied sur mesure. Cinq pages de rubrique sur mesure
  (`pages/cuisines.astro`… gabarit `sections/parts/PageRubrique.astro`) ; les pages service partagées sont coupées
  (`servicePages: false`) parce qu'elles étiraient ses photos de 800 px en pleine largeur sur téléphone.
- Socle GOUT § 0 : plusieurs pages (accueil + 5), téléphone en haut sans défiler, métier + ville dans le h1
  (« Ébéniste et menuisier à Puyricard, Aix-en-Provence »), avis juste sous le premier écran (5,0 sur Google,
  3 avis, Jean Bernard B. et Patrick D. mot pour mot, fautes comprises), « Depuis 2006 » en texte, ses 15 photos,
  portes par projet (Votre cuisine, Un meuble, Une bibliothèque…), barre d'actions en bas sur téléphone (Appeler,
  Écrire, Venir). Pas de formulaire : l'e-mail du brief ouvre la messagerie du visiteur (mailto).
- Élément original : le mur. Ses photos font 283 à 800 px, aucune ne tient un plein cadre ; le plein cadre est
  fait de toutes ses réalisations posées comme des panneaux sur un mur vu de biais (perspective 3D, ombres), qui se
  tourne vers vous quand on descend (suit le défilement, -26° à -8°). Chaque panneau est à une taille que sa photo
  tient (`ff nettete` vert). Le même mur, sans défilement, ouvre chaque page de rubrique.
- Mouvement (piste vivante) : panneaux qui se posent un par un (lent, léger rebond), photos des façades qui
  s'assemblent à l'arrivée (sec, 0,18 s), mur qui tourne au défilement, trois photos de l'atelier en plans à vitesses
  différentes. Aucun titre ne bouge, pas de rideau.
- Matière : planches claires avec un chant brun noyer (épaisseur) et des ombres en quatre couches, caissons des
  rubriques à cadre noyer et joints fins. Direction `nordique` (plâtre pâle, pas de crème), Familjen Grotesk +
  Domine (Literata dépassait le budget de polices).
- `ff prevol` vert (contrat, aiguillage, build, verifier, audit-motion, nettete, detect, perf, signatures).
  `ff variete` : aucun doublon.

### Défauts de l'usine trouvés en route (non corrigés dans `src/` ni `scripts/`, contournés dans le site)
1. `ff images` jette la taille d'origine quand la source tombe entre deux paliers : une photo de 794 px ne sortait
   qu'en 480 px (flou mesuré 1,8 par `ff nettete`). Contournement local : réencodage à pleine taille des 5 photos
   concernées, manifeste complété. À corriger dans `scripts/ff/images.mjs` : ajouter `origWidth` aux candidats
   quand il dépasse le plus grand palier retenu (sous le plafond de 2 400).
2. La règle globale `a[aria-label]:not(.btn):not(.hidden), button[aria-label]` (spécificité 0,3,1) écrase le
   `display` des navs sur mesure : bouton menu visible sur ordinateur, nom centré sur le métier. Contourné par des
   sélecteurs plus forts dans `sections/Nav.astro`.
3. `ff contrat` refuse `servicePages: false` même quand le site a ses pages sur mesure dans `pages/` : il faut une
   phrase « une page seulement » dans le Socle. Écrite (« ce n'est pas un site d'une page seulement »), mais la
   règle devrait compter les pages de `sites/<slug>/pages/`.
4. `ff variete` (look-data.mjs) lit mal un `layout` dont un commentaire contient une apostrophe droite.

### Ce qui reste faible
- Les photos elles-mêmes : 800 px au plus, prises entre 2014 et 2024, lumière inégale, cadrages de chantier.
  Le mur les rend présentables, il ne les rend pas belles une par une ; aucune ne peut être vue en grand.
- Le premier écran sur ordinateur laisse un coin de mur vide en haut à gauche (la perspective fait reculer le côté
  gauche) ; la planche couvre une bonne part du mur.
- Pas de portrait ni de photo de l'atelier : la section « Guy Andries » est faite de texte et de trois réalisations.
- Textes minces par nécessité : le brief n'a ni délais, ni prix, ni zone, ni essences nommées, ni FAQ.
- Captures prises un samedi : la case horaires affiche « Fermé » (GOUT § 3 demande une capture « Ouvert »).
- Non vérifié : iPhone en ligne (pas de déploiement, consigne), fluidité du mur qui tourne sur un vrai iPhone.

### Note honnête : 6 / 10
Il a un site IONOS de 2014 sans texte ni horaires : celui-ci lui montre ses propres meubles en volume, son numéro,
ses avis et une page par métier ; c'est un vrai saut, et le mur est une idée qui vient de son problème (petites
photos), pas d'un gabarit. Mais un artisan paie 1 200 € pour ses photos en grand, et ici on ne peut pas les lui
montrer en grand : tant qu'il n'a pas fourni ses originaux, le site plafonne à « soigné », pas « beau ».

### Ce qui manque du client
- Les originaux de ses photos (le site n'en sert que 800 px) : c'est la première demande, elle change tout.
- Confirmer « Depuis 2006 » (création au registre), la zone d'intervention, les essences qu'il travaille, ses délais
  et si le devis est gratuit ; un portrait et une photo de l'atelier, s'il veut.
- Confirmer Instagram et Facebook (non affichés, pas confirmés) et régler la deuxième fiche Google « Fermé
  temporairement » (autre numéro).
