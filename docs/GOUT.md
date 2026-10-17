# GOÛT — la charte des fondateurs

Ce fichier dit ce que Finck & Fisch aime, refuse et exige d'un site. **Tout agent qui dessine, écrit ou
relit un site le lit avant de commencer**, avec `docs/CONVENTIONS.md` (le code) et `docs/REDACTION.md`
(les textes). Il remplace la mémoire éparpillée des conversations : un retour des fondateurs qui n'est
pas ici n'existe pas pour l'usine.

Règle d'entretien : **chaque « non » d'un fondateur devient une ligne ici**, datée, avec l'exemple qui l'a
provoquée. On n'enlève une ligne que si un fondateur revient dessus, et on note la date. Une règle sans
date ni exemple est une opinion, pas une règle.

Contrôles automatiques qui en découlent : `ff ia` (signes IA), `ff typo`, `ff verifier` (mots creux,
données inventées), `ff audit-motion`, `ff a11y`, `ff detect`. Ce que ces outils ne voient pas est marqué
« à l'œil » : la skill `/site-final` le fait relire par un agent avant de montrer quoi que ce soit.

## 0. D'abord, ce qui fait acheter (17 oct 2026)

Le fondateur sur les trois pistes de la fromagerie : « est-ce qu'un client en achèterait vraiment un des trois ?
Moi, très honnêtement, je pense pas », « c'est un peu tout le temps la même chose ». La veille du marché
(`docs/veille/marche/CE-QUI-VEND.md`, sites qui vendent vraiment) répond : ce qui fait signer un artisan est
simple, et nos démos l'avaient sacrifié à l'originalité. **Le socle passe avant le style.** Chaque site a, sauf
donnée absente du brief :

1. **Plusieurs pages** : une par service (ou par offre, chambre, produit phare), pas une seule longue page.
2. **Le téléphone en haut**, cliquable, sur téléphone ET ordinateur, sans défiler.
3. **Le métier et la ville** dans le h1 ou la phrase juste dessous (« Fromager-affineur à Annecy »).
4. **Les avis** du client (Google ou recopiés), dès qu'il y en a, haut dans la page.
5. **L'ancienneté** en texte (« Depuis 2011 »), dès que le brief la donne.
6. **Ses vraies photos** : le travail, le lieu, les gens. Sans photo, on le dit au client (aiguillage), on ne
   remplace pas l'absence par de l'art.
7. **Une porte par intention** (Appeler, Devis, Réserver, Commander) plutôt qu'un formulaire en bas de page.

L'originalité (bloc sur mesure, mouvement, idée du contrat) se met **sur ce socle**, sur un ou deux éléments
propres au client, jamais à sa place. Une démo sans avis ni photo n'est pas une démo qui vend : on le dit, et on
préfère une démo bâtie sur un vrai commerce (fiche Google publique, démo privée) à une démo inventée.

## 1. Ce qui fait qu'un site est « à nous »

- **La différence vient du squelette, pas des couleurs.** Coquille, place de la nav, où vit le contact,
  ordre des blocs. « Exactement le genre de différence qui fait la diff » (anna-vidal, 21 sept 2026).
  Deux sites de l'usine ne partagent jamais le même squelette ET la même direction.
- **Chaque site a au moins un bloc sur mesure** (`sites/<slug>/sections/`), tiré d'un fait du métier :
  l'arrivage du jour, la fournée de 17 h, le devis avant couronne. Le bloc montre le mécanisme, il ne le
  décrit pas (13 oct 2026, carte des exemples : « un vrai détail du site », pas une phrase générique).
- **Un seul feu d'artifice par page.** Un effet riche, le reste calme (`docs/ANIMATION-PAR-METIER.md`).
- **Du flashy, oui, si sobre et si ça rend bien en vrai** (11 oct 2026). Montrer en vrai, jamais décrire.
  Aimé : le mur 3D d'écrans de démos en perspective. Refusé : chrome, métal, reflets, halo, grain.
- **Le téléphone est le premier écran.** Tout se juge d'abord sur un iPhone, en ligne (pas en local :
  CSP + HSTS faussent WebKit). Le texte doit se lire sans effort sur fond animé (13 oct 2026 : « le texte
  est pas ultra lisible », puis « on voit pas trop le côté gauche »).

## 2. Signes « fait par une IA » : interdits

Origine : « ça se voit que tu l'as fait avec Claude » (6 oct 2026). Liste complète et sources dans
`docs/veille/signes-ia.md`. En résumé, jamais :

- gros titre en **serif italique**, emphase en italique ;
- polices par défaut des IA (Cormorant, Instrument, Inter, Playfair, Fraunces, Space Grotesk, DM, Outfit,
  Plus Jakarta, Syne, Newsreader, Lora, Crimson, IBM Plex, Geist, Source Serif, Manrope) ;
- **tiret cadratin** et **point médian** dans le texte visible ;
- **pilules** (boutons, badges, étiquettes à 999 px), **coches** façon tarif de logiciel, **capitales
  espacées** (eyebrows, « 4 ÉTAPES »), **numérotation décorative** 01/02/03 ;
- **halo** radial, **grain**, reflet, projecteur qui suit la souris, dégradés « aurora » ;
- **faux navigateur** à trois points autour d'une capture ;
- titres en cadence de trois (« Trois sites. Un seul contenu. »), séries de trois partout ;
- « X ans d'expérience » calculé, badge « depuis 1998 » : on écrit « Depuis 1998 » en texte.
- Vignettes polaroid inclinées, cartes à grand rayon (20-28 px) sur un système à 4 px (13 oct 2026).
- Titres de section révélés ligne par ligne sous masque, sur toute la page ; rideau plein écran qui se lève à
  l'ouverture ; photo qui se découvre par volet puis zoome au défilement, à chaque section (16 oct 2026,
  fromagerie A/B/C).
- Surtitre gris « métier, rue, ville » au-dessus du h1 : c'est l'eyebrow en casse normale (16 oct 2026).
- Photo de banque légendée « photo d'illustration » : sans photo du client, on dessine, on compose en typo ou on
  montre un objet (ardoise, étiquette, ticket), on n'illustre pas (16 oct 2026).
- Une seule police de titre à une seule graisse pour h1, h2, h3 ; un h2 plus grand que le h1.

## 3. Démos et captures (site du studio, propositions aux clients)

- **Toujours l'écran entier, net**, jamais recadré ni zoomé (10 oct 2026, « désobligeant » que ça
  revienne). Téléphone 390:844, ordinateur 16:10.
- **Pas de vidéo** : iOS en économie d'énergie bloque tout autoplay (11 oct 2026). Captures en 4 tuiles
  (`ff tuiles`) animées en CSS, toutes en même temps, décalées. Ne pas revenir aux `<video>`.
- **Pas de bascule de thème** noir → blanc au défilement. **Pas de caret** dans le texte.
- Capturer les démos à une heure où le site dit « Ouvert » si le site affiche son état (14 oct 2026).
- Avant de dire « rien de cassé » : **filmer à la molette** (`planche.mjs`), pas une capture fixe
  (13 oct 2026, le scroll de la forge ne s'animait qu'à la fin du pin).

## 4. Mouvement

- Sur iPhone, Safari défile hors du fil principal : une animation calée image par image sur `--p`
  saccade. **Étapes** (`data-etapes` → `data-etape`) + transitions en temps pour le riche ; `--p` seulement
  pour une translation simple (12 oct 2026 : « pas fluide », « toujours trop galère »).
- **Mais** un rideau joué d'un coup au premier cran n'est pas « homogène » non plus (14 oct 2026) : ce
  qui suit le doigt doit suivre le doigt (`data-scene-suivi`). Règle : le mouvement principal suit le
  défilement linéairement, les ornements sont en étapes.
- **Rien ne tourne tout seul** quand on peut faire glisser à la main (14 oct 2026, Trois jours : « un
  scroll latéral manuel »). Pas d'autoplay de « stories ».
- Pas de défilement bloqué qui surprend (pin trop long, scroll-jacking).
- **Un site doit être vivant** (16 oct 2026, « pourquoi y'a aucune animation ? ») : une entrée du premier écran,
  un rythme au défilement, un feu d'artifice qui répond au doigt ou au défilement, une image qui bouge.
- **Vivant ne veut pas dire « tout se lève »** (16 oct 2026, trois pistes de fromagerie : « très similaire sur
  les animations », « aucun que je ne trouve pas IA generated »). Les quatre moments restent (entrée, rythme,
  feu d'artifice, image), mais aucun n'impose d'outil. Règles :
  - **Ce qui bouge est une chose du métier** (une meule, une ardoise, un ticket, un plat, un outil), pas un titre
    ni un cadre de photo. Un titre de section ne s'anime pas ; seul le h1 peut avoir une entrée, et alors elle
    est propre au client (enseigne, craie, tampon), jamais la montée de lignes sous masque du moteur.
  - **Pas de rideau d'ouverture** générique. L'entrée montre le client ou rien.
  - **Au moins deux régimes** sur la page : un sec (≤ 0,2 s, linéaire ou ease-out court) et un lent ou à rebond,
    choisis pour une raison écrite ; jamais une seule courbe expo-out partout.
  - **Deux pistes d'une même proposition n'ont jamais la même entrée ni le même mécanisme d'apparition** au
    défilement.
- Logo : **aucune animation générée** (Remotion, IA vidéo, 3D, encre au scroll, tout rejeté les 8-9 oct
  2026). Le monogramme reste le SVG tracé en CSS. Ne pas reproposer ; demander des références ou un
  motion designer humain.

## 5. Textes

- **Rien d'inventé** : pas d'avis, pas de chiffres, pas de « +500 clients », pas de lieu non confirmé
  (horloge « à Paris » retirée le 13 oct 2026). Une donnée absente du brief laisse le champ vide.
- Mots creux signalés par `ff verifier` : savoir-faire, passion, sur mesure, expertise, au cœur de,
  clé en main, haut de gamme, univers, à votre écoute, dans les règles de l'art.
- On écrit comme on parle au téléphone au client. « Vous » au lecteur, « nous » pour le studio. Pas de
  jargon d'agence (solution, accompagner).
- Titres : **jamais un fragment creux** (« Humains. »), mais pas non plus une phrase-consigne finie par un point
  à chaque section (16 oct 2026 : 15 titres sur 18 finissaient par un point dans les trois fromageries, 0 sur 26
  chez quatre sites humains). Sur une page : au moins un titre-étiquette de 1 à 4 mots qui nomme une chose du
  client (« L'ardoise », « Beaufort 24 mois »), au plus la moitié des titres finis par un point, des longueurs
  qui varient du simple au triple.
- Une voix par site : au moins une phrase qu'une personne nommée du brief dirait (avec son prénom), une
  question ou une exclamation si le ton le permet, des noms propres (fermes, produits, lieux) plutôt que des
  consignes.
- Typographie française stricte (`ff typo`) : espaces insécables avant `: ; ! ?`, « guillemets »,
  apostrophe ’, 9 h 30, 1 200 €.
- Une seule fois « exemple » par écran ; dire « aucun client derrière » une fois, pas partout.

## 6. Site du studio (finck-fisch), en plus

- Thème **sombre chaud « eclipse »** imposé, à améliorer, jamais à remplacer (6 oct 2026, l'éphéméride
  rejetée : « garder le truc luxueux d'avant »).
- Le **monogramme reste en haut**. Pas de visages ni de prénoms tant que les fondateurs n'ont pas tranché
  (PRODUCT.md dit anonymes le 6 oct ; la section Humains attend leurs prénoms depuis le 13 oct : à confirmer).
- Prix et délai visibles dès le premier écran. Pas de « provisoire » affiché.
- Pas de « pages villes » en contradiction avec « jamais un modèle décliné par ville » (à trancher).
- Aucun changement visible sur ce site sans l'accord d'un fondateur, sauf bug.

## 7. Comment on travaille (pour ne pas refaire les allers-retours d'octobre 2026)

1. Lire ce fichier, puis le brief. Pas l'inverse.
2. `ff composer` donne le point de départ ; on s'en écarte pour une raison du brief, notée.
3. Construire, puis **tout** relire avant de montrer : contrôles automatiques verts, relecture adverse
   (un agent DA, un agent rédacteur, armés de ce fichier), planche à la molette mobile + ordinateur
   regardée à l'œil.
4. Montrer en vrai (lien, captures), une seule fois, avec ce qui a été rejeté en interne.
5. Chaque « non » du fondateur → une ligne ici, datée. Chaque bug payé → `CLAUDE.md` § Pièges.

## 8. Règles empruntées (veille des skills de design, 15 oct 2026)

Tirées de `docs/veille/outils-2026-10.md` § 1.3 (28 règles, source par règle). Les plus utiles ici ;
les autres servent à la relecture adverse et à `ff verifier` (bloc « règles empruntées »).

- **Mouvement** : jamais `transition: all` ; entrée et sortie en `ease-out`, jamais `ease-in` sur un
  élément d'interface ; une animation d'interface reste sous 300 ms, seul le « feu d'artifice » peut
  durer ; la sortie est plus rapide que l'entrée ; un stagger fait 30-80 ms entre éléments avec un
  plafond total ; avant d'animer, dire en un mot à quoi ça sert, sinon pas d'animation.
- **Téléphone** : tout `:hover` qui bouge est dans `@media (hover: hover) and (pointer: fine)`, le retour
  tactile passe par `:active` ; champs à 16 px minimum (sinon iOS zoome), `type="tel"`, `autocomplete` ;
  jamais `user-scalable=no` ; `100svh` plutôt que `100vh` seul ; `touch-action: pan-y` sur un carrousel.
- **Robustesse** : tester une raison sociale longue à diacritiques, 0 / 1 / 12 services, un horaire
  fermé, une photo manquante ; colonnes en `min-width: 0`, e-mails en `overflow-wrap: anywhere`.
- **Composition** : le H1 tient en 2-3 lignes sur ordinateur, on élargit ou on réduit, on ne coupe pas ;
  pas de « Défilez » ni de flèche qui rebondit en bas du hero ; pas de badge « Depuis 1998 », de strip
  ville/heure/météo, de légende photo décorative ; pas de capture bricolée en `<div>` ; pas de cartes
  dans des cartes ; pas de « → » décoratif sur les liens ; pas d'accent sur un seul mot du titre.
- **Propositions** : les trois versions divergent sur un axe nommé (squelette, densité, rythme), jamais
  trois palettes de la même page.
- **Livraison** : un fichier livré est complet, jamais `// ...`.

## Journal des ajouts

- 15 oct 2026 : création, compilation des retours du 6 au 14 oct 2026 (mémoires de session, PRODUCT.md,
  signes-ia.md, commentaires de code du site du studio).
- 16 oct 2026 : § 4 « un site doit être vivant » (démo fromagerie immobile).
- 16 oct 2026, soir : § 2, § 4 et § 5 réécrits d'après `docs/veille/pourquoi-ia-2026-10.md` (trois pistes « très
  similaires », « aucune que je ne trouve pas IA generated ») : on anime les choses du métier, pas les titres ;
  pas de rideau ; deux régimes de courbe ; titres-étiquettes ; une voix signée.
- 15 oct 2026, nuit : § 8 (règles empruntées aux skills de design, veille outils) ; § 2 complété
  (« Depuis 1998 » en badge, polaroid, grands rayons).
