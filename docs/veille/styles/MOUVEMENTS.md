# Profils de mouvement : quarante-huit façons de faire bouger une page, relevées sur de vrais sites

Le fondateur, 18 oct 2026, sur L'Épi d'Or b, c, d : « beaucoup plus de pluralité : animations, même des vidéos en
fond ». L'atome `mouvement` (ATOMES.md) ne portait que des durées et une courbe : trois mélanges différents bougeaient
pareil (fondu au défilement, même bouton). Chaque atome `mouvement` du registre nomme maintenant son **profil**
(champ `profil`, requis pour être tirable) et `ff melanger` tire le profil avec l'atome.

- Code (pur, testé) : `scripts/ff/mouvements.mjs` (`PROFILS_MOUVEMENT`, `refusProfil`, `profilsTropProches`,
  `consignesProfil`). Ce fichier et le code ont les mêmes ids (`tests/melanger.test.mjs`).
- Attributs du moteur : `docs/ANIMATIONS.md` ; vitrine : `sites/_effets/`.
- Chaque profil vient d'un vrai site (fiche de `docs/veille/demontages/` ou veille `docs/veille/animations-2.md`) ; on
  reprend le **mécanisme**, jamais la forme exacte, et toujours sur une chose du métier du client (GOUT § 4).

## Ce que le moteur savait faire (inventaire du 18 oct 2026)

| Moment | Ce qui existe | Où |
|---|---|---|
| Entrée du premier écran | `data-split` (mots, caractères ; `lines` réservé à un h1), `data-stagger` sur le bloc du hero, rideau `.ff-curtain` (**refusé**, GOUT § 2) | `motion.ts`, `global.css` |
| Apparition au défilement | `data-reveal` (opacité seule, ou up/left/right/scale/blur/clip/wipe/mask), `data-reveal-native`, `data-stagger`, `data-draw`, `data-draw-svg`, `data-counter`, `data-counter-flip`, `data-count-bar` | idem |
| Suit le défilement | `data-parallax`, `data-parallax-depth`, `data-scrub`, `data-blur-scrub`, `data-pin` + `data-pin-step`, `data-horizontal`, `data-text-fill`, `data-stack`, `data-sticky-stack`, `data-scroll-progress` ; scènes à étapes `data-etapes` (site du studio, `scene-ff.ts`) | idem |
| Survol, geste | `data-magnetic`, `data-tilt`, `data-hover-img`, `data-hover-distort`, `data-trail`, `data-flip-card`, `data-compare`, `data-drag-grid`, `data-accordion` ; `--motion-ui`, `--ease-brand` par direction | idem |
| Fond qui bouge | `data-shader` (mesh, silk), `data-frames` (séquence d'images au défilement), Hero `video` (`images.heroVideo`, autoplay HTML nu, ni pause ni garde) | `shader.ts`, `Hero/video.astro` |
| Produire les images | `ff video` (Pexels : banque), `ff animer` (photo du client animée, fal.ai, AI Act), `ff sequence` (vidéo → frames), `ff sequence-photo` (photo fixe → frames, caméra lente) | `scripts/ff/` |
| Entre les pages | `site.transitions` (ClientRouter, fondu 0,3 s, nav et hero persistants) | `Base.astro`, `global.css` |

Ce qui manquait le plus : une **entrée du premier écran** qui ne soit ni la montée de lignes ni le rideau ; une **image
qui bouge sans vidéo** (le piège iPhone de CLAUDE.md conseille « des images fixes animées en CSS », rien ne le faisait) ;
une **vidéo de fond correcte** (poster garanti, pause, rien sous « réduire les animations », pas de lecture hors écran).
Ajoutés le 18 oct 2026 : `data-entree="plans"`, `data-derive`, `data-video-fond` (+ `--ease-ressort`,
`data-marquee-sens="inverse"`).

## Aiguillage

- Client « calme » (`ff aiguillage`) : seulement les profils marqués **calme : oui** (rien ne suit le défilement,
  `motion: 'subtle'`). `ff melanger` refuse les autres.
- Fond vidéo : seulement si le client a une **vraie vidéo** (dans `raw/`), ou si `ff animer` (sa photo animée) ou
  `ff video` (vidéo de banque) est **prévu** et déclaré : `ff melanger <slug> --video client|animer|banque`. Une vidéo
  de banque est une ambiance créditée sur `/credits`, **jamais présentée comme celle du client**. Poster obligatoire, qui
  se suffit à lui-même : iPhone en économie d'énergie bloque tout autoplay, jamais de contenu essentiel dans la vidéo.
- Séquence : une vidéo du client, ou une photo de 1 920 px pour `ff sequence-photo`.
- Trois pistes : jamais la même **entrée** ni la même **apparition** (GOUT § 4) ; `ff melanger --n 3` l'impose.
- Un seul feu d'artifice par page (GOUT § 1) : le profil donne le mouvement principal ; le reste reste calme.
- Poids : `nul` = CSS seul ; `leger` = moteur sans dépendance ; `moyen` = GSAP chargé à la demande ; `lourd` = vidéo ou
  séquence (des mégaoctets : budget `ff perf`, `ff nettete`).

## Les profils

Colonnes de chaque fiche : ce qu'il fait ; entrée / apparition / survol / fond ; attributs du moteur ; ce qui manque ;
quand ; poids.

### `fondu-sobre`
Studenterkilden (`studenterkilden.md`). Rien n'est épinglé ; les blocs apparaissent en fondu, les questions s'ouvrent en
`grid-template-rows` 0,6 s sur la courbe « osmo » `cubic-bezier(.625,.05,0,1)`.
- Entrée aucune · apparition fondu · survol couleur · fond aucun.
- Moteur : `data-reveal` (opacité seule, un groupe par section), `data-accordion` ou `<details>` natif, `--ease-brand` osmo.
- Quand : le défaut d'un client calme, d'un métier réglementé, d'une page dense en texte. Calme : oui. Poids : léger.

### `ressort-au-survol`
Relais Rossàr (`relaisrossar.md`). Les apparitions montent lentement (transform 1 s, quart-out), les survols répondent par
un **ressort** en CSS `linear()` (dépassement à 1,084 puis retour).
- Entrée aucune · apparition montée lente · survol ressort · fond aucun.
- Moteur : `data-reveal="up"` sur un groupe par section ; `--ease-ressort` (global.css, ajouté le 18 oct 2026) sur les
  `:hover` / `:active`, en `--motion-ui`.
- Quand : hôtellerie, restaurant, artisan d'art ; le mouvement est dans la main, pas dans la page. Calme : oui. Poids : nul.

### `glisse-a-la-main`
Coutumes et Meyers (`coutumes.md`, `meyers.md` : Swiper, `scroll-snap` ×13). Rien ne bouge seul : une piste de cartes
qu'on fait glisser au doigt.
- Entrée aucune · apparition aucune · survol couleur · fond aucun.
- Moteur : piste native `overflow-x: auto; scroll-snap-type: x mandatory; touch-action: pan-y` (bloc ou variante) ;
  `data-drag-grid` en rich.
- Quand : catalogue, produits, réalisations nombreuses ; GOUT § 4 (« rien ne tourne tout seul quand on peut faire
  glisser à la main »). Calme : oui. Poids : nul.

### `plans-au-chargement`
Meyers (`hero-media-zoom-in-load` 1,75 s `cubic-bezier(.75,0,.2,1)`), Coquelicots (entrée orchestrée menu, hero, média).
L'image du premier écran se **resserre** lentement, le texte arrive ensuite, sec.
- Entrée plans · apparition fondu · survol couleur · fond aucun.
- Moteur : `data-entree="plans"` sur le premier écran, `data-plan="fond"` sur l'image (1,6 s, lent), `data-plan="texte"`
  sur le bloc de texte (0,2 s après 0,55 s, sec) : les deux régimes de GOUT § 4. CSS seul, rien sous « réduire les
  animations », pas rejouée après une navigation (ajouté le 18 oct 2026).
- Quand : client avec une photo forte du lieu ou du geste ; remplace la montée de lignes. Calme : oui. Poids : nul.

### `photo-qui-respire`
Their Nibs (`theirnibs.md` : zoom lent de l'image active). Une photo fixe du client glisse et se resserre lentement
**dans son cadre**, qui ne bouge pas.
- Entrée dérive · apparition aucune · survol couleur · fond photo animée.
- Moteur : `data-derive[="24"]` sur le cadre (aller-retour 12-60 s, à l'écran seulement, bouton pause WCAG 2.2.2 ; ajouté
  le 18 oct 2026). Une ou deux photos par page, jamais à chaque section.
- Quand : client sans vidéo qui veut « une image qui bouge » ; l'alternative sûre à la vidéo sur iPhone. Calme : oui.
  Poids : nul.

### `video-de-fond`
Le Saint Georges (`lesaintgeorges.md` : vidéo MP4 en fond du premier écran, presque rien d'autre), Artisans de Genève
(vidéos en boucle dans les grandes cartes).
- Entrée vidéo · apparition aucune · survol couleur · fond vidéo.
- Moteur : Hero `video` (`images.heroVideo` + `images.heroVideoPoster`) ou `data-video-fond` sur une grande carte :
  poster obligatoire (sans lui, rien n'est rendu), pas d'autoplay HTML, lecture seulement à l'écran, pause hors écran et
  onglet caché, bouton pause, rien sous `motion: 'none'`, « réduire les animations » ou économie de données ; iPhone en
  économie d'énergie : poster + bouton « Lire » (ajouté le 18 oct 2026).
- Quand : seulement avec une vraie vidéo, ou `ff animer` / `ff video` prévu (`--video`). Calme : oui (c'est le seul
  mouvement de la page). Poids : lourd.

### `sequence-au-defilement`
Trionn (`animations-2.md` ligne 45 : 371 WebP scrubbées, frame lissée par lerp 0,12).
- Entrée aucune · apparition séquence · survol couleur · fond séquence.
- Moteur : `data-frames` + `data-pin` (100 % par étape + 100 %), `data-frames-lerp`, `data-frames-poster` ; frames par
  `ff sequence` (vidéo) ou `ff sequence-photo` (photo fixe de 1 920 px).
- Quand : un objet ou un geste qui se déplie (montre, meuble, plat dressé) ; le feu d'artifice de la page. Calme : non.
  Poids : lourd.

### `chapitres-epingles`
La Table de Joakim (`latabledejoakim.md` : section épinglée sur ordinateur, fond qui change à chaque chapitre ; rien
d'épinglé au téléphone), Caffè Gilli (chapitres épinglés `scrub`).
- Entrée aucune · apparition épinglage · survol couleur · fond aucun.
- Moteur : `data-pin` + `data-pin-step`. Manque : le fond qui change de couleur par chapitre (CSS du bloc sur mesure sur
  `[data-pin-step].is-active`).
- Quand : un récit en étapes (fabrication, saisons, menu). Calme : non. Poids : moyen.

### `piste-horizontale`
Odyssée (`odysseeclinic.md` : le compteur « 2 : 4 » suit la piste), Caffè Gilli (piste horizontale épinglée, scrub 0,5).
- Entrée aucune · apparition piste · survol couleur · fond aucun.
- Moteur : `data-horizontal` + `.h-track` (ordinateur ≥ 64rem ; au téléphone la piste glisse au doigt). Manque : le
  compteur qui suit la piste (bloc sur mesure).
- Quand : une série (réalisations, chambres, soins) qu'on parcourt dans l'ordre. Calme : non. Poids : moyen.

### `texte-qui-se-remplit`
Caffè Gilli (le titre de chapitre passe de gris pâle à bleu nuit en entrant), Coutumes (texte variable piloté au
défilement sur ordinateur).
- Entrée aucune · apparition remplissage · survol couleur · fond aucun.
- Moteur : `data-text-fill` sur **une** phrase du client (sa règle, sa promesse), jamais un titre de section (GOUT § 4).
- Quand : une phrase forte et vraie du brief, dite par une personne nommée. Calme : non. Poids : moyen.

### `parallaxe-et-aimant`
Monarque (`monarque.md` : portrait lié au défilement, parallaxe ×2, boutons magnétiques).
- Entrée aucune · apparition parallaxe · survol aimant · fond aucun.
- Moteur : `data-parallax="0.2"` sur un portrait ou un objet, `data-magnetic="0.3"` sur le bouton principal (pointeur fin).
- Quand : événementiel, traiteur, métier de la mise en scène ; de la profondeur (GOUT § 0). Calme : non. Poids : moyen.

### `rebond-et-inclinaison`
Pizza Amici (`pizza-amici.md` : rebond back-out 0,35 s sur les boutons, tickets qui s'inclinent au défilement).
- Entrée aucune · apparition inclinaison · survol rebond · fond aucun.
- Moteur : `data-scrub="rotate=-6,y=24"` sur des objets du métier (tickets, étiquettes, menus), `--ease-brand` back-out.
- Quand : restauration rapide, épicerie, métier joyeux ; jamais un notaire. Calme : non. Poids : moyen.

### `bandes-croisees`
Paput Menorca (`paputmenorca.md` : deux bandes croisées en diagonale qui défilent en sens contraires, texte plein et
texte en contour).
- Entrée aucune · apparition aucune · survol couleur · fond aucun.
- Moteur : deux `data-marquee`, la seconde avec `data-marquee-sens="inverse"` (ajouté le 18 oct 2026). Manque :
  l'inclinaison des bandes (CSS du bloc sur mesure). Atome pas encore tirable (durée de scène non mesurée).
- Quand : une devise, des noms de produits ; une seule fois par page. Calme : non (bouge seul). Poids : léger.

### `objet-qui-tourne`
Café Binocle (`cafebinocle.md` : sceau qui tourne en 30 s, bulle qui flotte), Tout Bien (`toutbienpils.md` : balancement
1,2 s).
- Entrée aucune · apparition fondu · survol couleur · fond aucun.
- Moteur : `data-reveal`. Manque : le `@keyframes` de l'objet (sceau, tampon, étiquette) dans le bloc sur mesure, coupé
  par `prefers-reduced-motion` ; jamais un titre, jamais le logo (GOUT § 4).
- Quand : un objet du métier qui a une forme ronde ou suspendue (sceau, enseigne). Calme : non. Poids : nul.

### `chiffres-qui-comptent`
Framer Lintel (compteurs qui bougent au premier écran), KS Architectes (`ksarchitectes.md` : rouleaux de chiffres 0-9).
- Entrée compteur · apparition fondu · survol couleur · fond aucun.
- Moteur : `data-counter` ou `data-counter-flip` sur un **vrai** chiffre (nombre d'avis Google, fournées par jour,
  kilos), jamais « X ans d'expérience » calculé (GOUT § 2). `ff melanger` le refuse sans avis ni chiffre.
- Quand : urgence, artisan du bâtiment, commerce qui a des chiffres vrais. Calme : oui. Poids : léger.

### `mots-qui-glissent`
Carne (`carne.md`, [carnehamburguesas.com](https://carnehamburguesas.com/en), veille du 19 oct 2026 : GSAP ScrollTrigger,
`fadeInLeft` / `fadeInRight` 2 s ease). Des mots géants en capitales condensées traversent l'écran latéralement au
défilement, deux lignes en sens opposés, derrière un produit détouré qui ne bouge pas.
- Entrée aucune · apparition glissement · survol couleur · fond aucun.
- Moteur : `data-scrub="x=-30"` et `data-scrub="x=30"` sur deux lignes d'un mot du client (son nom, un produit phare) ;
  le produit détouré reste fixe (profondeur : deux plans, GOUT § 0). Jamais un titre de section.
- Quand : restauration, commerce de bouche joyeux, produit unique photographié détouré. Calme : non. Poids : moyen.

### `ombre-au-survol`
Jo&So (`joandso.md`, [joandso.com](https://joandso.com/), veille du 19 oct 2026 : `box-shadow 0.6s ease` sur les cartes,
`opacity 0.4s ease`). Rien ne bouge au défilement ; les cartes (photo + aplat de couleur) se soulèvent lentement sous le
pointeur par une ombre qui s'élargit.
- Entrée aucune · apparition aucune · survol ombre · fond aucun.
- Moteur : CSS seul, `box-shadow` 0,4-0,6 s ease dans `@media (hover: hover) and (pointer: fine)`, `:active` au toucher.
  Manque : la règle de la carte (section ou bloc), jamais `transition: all`.
- Quand : catalogue de chambres, de réalisations, de produits en cartes ; client calme. Calme : oui. Poids : nul.

### `sortie-du-noir`
Maaemo (`maaemo.md`, [maaemo.no](https://maaemo.no/), veille du 23 oct 2026, filmé à 300, 900, 1 800 et 3 500 ms) : la
page s'ouvre sur du noir, la photo (une pierre sombre) en sort lentement, le nom n'apparaît qu'ensuite, vers 3 s. Rien
ne bouge au défilement.
- Entrée sortie du noir · apparition aucune · survol couleur · fond aucun.
- Moteur : rien à ajouter ; deux `@keyframes` du premier écran (photo `opacity` 0 → 1 en 1,5 s ease-out, texte à
  +1,2 s en 0,8 s), coupés sous `prefers-reduced-motion`. Manque : ces règles dans la section ou le bloc. Jamais un
  écran de chargement (GOUT § 2) : le texte reste dans le DOM et lisible dès que l'animation finit, 3 s au plus.
- Quand : restaurant du soir, bar, cave, métier de nuit, client aux photos sombres ; palette sombre. Calme : oui. Poids : nul.

### `portes-qui-s-eclairent`
Kadeau (`kadeau.md`, [kadeau.dk](https://www.kadeau.dk/), veille du 23 oct 2026, filmé au survol) : l'accueil est deux
portes, une par adresse, chacune une photo plein cadre voilée de flou ; la porte survolée se dévoile nette, l'autre
reste voilée (scène relevée : 0,8 s cubic-bezier(0.61, 1, 0.88, 1)).
- Entrée aucune · apparition aucune · survol dévoile · fond aucun.
- Moteur : CSS seul (`filter: blur()` + voile de couleur sur chaque porte, levés sur `:hover`, `:focus-visible`,
  `:active`). Manque : la règle des portes dans le bloc ou la variante ; au téléphone les portes s'empilent, nettes.
- Quand : deux adresses, deux activités ou deux publics (architecture `accueil-portes`, `pages-adresses`) avec une bonne
  photo par porte. Calme : oui. Poids : nul.

### `assiettes-qui-se-posent`
Kricket (`kricket.md`, [kricket.co.uk](https://www.kricket.co.uk/), veille du 24 oct 2026, filmé à la molette à
l'ordinateur et au téléphone) : sous la vidéo d'ouverture, une scène où les plats, photographiés de dessus sur une nappe,
se posent l'un sur l'autre à mesure qu'on défile, chacun un peu tourné, des fleurs de souci détourées autour ; puis trois
photos à des hauteurs différentes encadrent le texte d'accueil. Transitions relevées : 0,5 s ease (14 éléments), 0,75 s
ease (8).
- Entrée aucune · apparition pose par étapes · survol couleur · fond aucun.
- Moteur : `data-pin` sur la scène, `data-pin-step` par photo (étapes, GOUT § 4 : jamais un calage image par image sur
  iPhone), transform + opacity 0,5 s ease. Manque : la scène elle-même (bloc sur mesure). Les photos sont des plats ou des
  objets du métier vus de dessus, sans bord blanc ni ombre de tirage : jamais des polaroids inclinés (GOUT § 2). Au
  téléphone étroit et en mouvement réduit, les photos s'empilent sans épinglage.
- Quand : restaurant, traiteur, pâtissier, fromager : un client qui a au moins 4 belles photos de plats vues de dessus.
  Pas un client calme. Calme : non. Poids : léger.

### `nom-qui-s-efface`
Ikoyi (`ikoyi.md`, [ikoyilondon.com](https://www.ikoyilondon.com/), veille du 24 oct 2026, filmé à 300, 900, 1 800 et
3 500 ms puis à la molette) : la page s'ouvre sur un aplat brun tabac, le motif de traits fins apparaît en moins d'une
seconde ; le nom reste au centre de l'écran et pâlit à mesure qu'on défile ; le texte puis les photos pleine largeur
montent par-dessus le motif, qui ne bouge pas.
- Entrée fond puis motif · apparition monte sur le motif · survol couleur · fond motif fixe.
- Moteur : une couche `position: fixed` derrière le contenu porte le motif (jamais `background-attachment: fixed`,
  ignoré par Safari iOS) ; l'opacité du nom suit le défilement par `animation-timeline: scroll()` (repli : le nom reste
  immobile, rien ne casse). Manque : le motif (un SVG tiré du métier ou de la devanture, jamais un grain ni un halo,
  GOUT § 2) et la règle du nom dans le premier écran.
- Quand : restaurant du soir, cave, bar, artisan dont la devanture, le carrelage ou l'emballage ont un motif ; palette
  sombre. Pas l'urgence (le premier écran ne montre que le nom : téléphone dans la barre). Calme : non (suit le
  défilement), mais aucune animation qui part seule. Poids : nul.

### `soulignement-qui-se-dessine`
Hiša Franko (`hisafranko.md`, [hisafranko.com](https://www.hisafranko.com/), veille du 25 oct 2026, filmé à 0, 400 et
2 000 ms puis à la molette, transitions relevées dans le DOM) : rien n'apparaît au défilement, la page est posée ; la vie
est dans le geste. Les liens et les boutons-texte portent un soulignement qui se trace de gauche à droite au survol
(`background-size` 0,5 s `cubic-bezier(.455,.03,.515,.955)`, 14 éléments), les photos se voilent à peine (filtre et
opacité 0,1 s ease-out, 20 éléments), les questions s'ouvrent en `grid-template-rows` 0,35 s.
- Entrée aucune · apparition aucune · survol soulignement · fond aucun.
- Moteur : CSS seul (dégradé de `currentColor` en `background-image`, `background-size` animé), dans
  `@media (hover: hover) and (pointer: fine)` ; au téléphone le soulignement est déjà tracé (le lien se reconnaît sans
  survol). Manque : la règle du lien dans la section ou la direction.
- Quand : client calme, page dense en texte, métier réglementé, restaurant du soir ; avec une typo machine à écrire ou
  une grotesque sobre. Calme : oui. Poids : nul.

### `fil-qui-mene`
Kilchoman (`kilchoman.md`, [kilchomandistillery.com](https://www.kilchomandistillery.com/), veille du 25 oct 2026, filmé
à la molette à l'ordinateur) : un trait fin couleur or part du bouton du premier écran, descend sur la vidéo, serpente
sur le bleu nuit et arrive au point de la distillerie sur la carte dessinée de l'île. Sur la source le fil est fixe ;
c'est le défilement qui le fait suivre.
- Entrée aucune · apparition fil · survol couleur · fond aucun.
- Moteur : un SVG de 1 px en couleur d'accent dans un bloc sur mesure, du premier écran au lieu du client (carte, plan,
  adresse) ; fixe en mouvement réduit. Manque : le tracé et la carte d'arrivée (bloc sur mesure) ; jamais un tracé calé
  image par image sur `--p` (saccade sur iPhone, GOUT § 4).
- Quand : un client dont le lieu compte (ferme, domaine, distillerie, gîte, producteur) et qui a une carte ou un plan à
  montrer. Calme : oui. Poids : nul.

### `nom-en-lettres-geantes`
Lune (`lune.md`, [lunecroissanterie.com](https://www.lunecroissanterie.com/), veille du 26 oct 2026, mesuré à la molette à
l'ordinateur, position des SVG relevée à 8 hauteurs de défilement) : tout est noir, les viennoiseries sont photographiées sur
noir ; chaque section porte derrière ses photos une lettre du nom (L, U, N, E) en capitale géante dessinée au trait fin. La
lettre glisse en `translateY` d'environ 0,125 px par px défilé : plus lente que la page, elle donne la profondeur sans rien
qui bouge tout seul.
- Entrée aucune · apparition parallaxe d'une lettre · survol couleur · fond aucun.
- Moteur : `data-parallax="0.12"` sur la lettre (translation simple, tient sur iPhone) ; lettre en SVG ou en texte
  `-webkit-text-stroke` couleur de bordure. Manque : la lettre de fond par section (règle de direction ou bloc sur mesure).
- Quand : un nom court (3 à 6 lettres) et un produit photographié sur fond uni (boulangerie, chocolatier, glacier,
  torréfacteur) ; sur fond sombre de préférence. Jamais sur un métier réglementé. Calme : non. Poids : léger.

### `fond-qui-change-de-teinte`
Attica (`attica.md`, [attica.com.au](https://www.attica.com.au/), veille du 26 oct 2026, couleur de fond du document relevée à
14 hauteurs de défilement) : la page est noire au repos ; quand une assiette arrive, tout le fond prend la teinte de cette
assiette (vert d'eau #7fb89b, rose très pâle #fff4f4, ardoise #3b4043, olive nuit #272b12 au pied) par une transition de
`background-color` de 1 s `cubic-bezier(.25,1,.5,1)` sur l'élément `html`. Les photos ne bougent pas : c'est la lumière
de la salle qui change.
- Entrée aucune · apparition teinte du fond · survol soulignement · fond teinte par section.
- Moteur : `data-teinte` par section + IntersectionObserver qui pose la teinte sur le document ; transition CSS en temps
  (pas de calage sur `--p`, tient sur iPhone). Manque : le déclencheur (script court de direction) et le contrôle de
  contraste du texte sur chaque teinte.
- Quand : un client aux produits très colorés et bien photographiés (restaurant, pâtissier, fleuriste, glacier) ; teintes
  prises dans la palette ou les photos, jamais vives (garde de beauté). Pas pour un client « calme » (aiguillage).
  Distinct de la bascule de thème noir → blanc refusée (GOUT § 3) : ici le noir revient entre deux teintes, rien ne
  s'inverse. Calme : non. Poids : nul.

### `photos-a-plusieurs-vitesses`
Brae (`brae.md`, [braerestaurant.com](https://braerestaurant.com/), veille du 26 oct 2026, soir ; `transform` de chaque photo
relevé tous les 250 px de défilement, de 0 à 4 000 px, à 1 440 et 390 px de large) : après la vidéo du domaine, les photos sont
posées en quinconce dans une grille éditoriale très aérée. Chaque photo arrive décalée de 116 à 177 px vers le haut et
rejoint sa place à sa propre vitesse : 0,096, 0,115, 0,122 et 0,094 px par px défilé à l'ordinateur, 0,07 à 0,09 au
téléphone (GSAP ScrollTrigger). Deux photos voisines ne glissent jamais ensemble : la page prend de l'épaisseur sans rien
qui bouge tout seul. Survols de liens 0,3 s ease.
- Entrée aucune · apparition parallaxe décalée · survol soulignement · fond aucun.
- Moteur : `data-parallax` par photo (0,09 à 0,12 ; translation simple, tient sur iPhone), valeur différente d'une photo à
  l'autre ; immobile en mouvement réduit. Manque : la règle qui varie les vitesses et borne le décalage à la marge de la
  section (la photo ne recouvre jamais le texte).
- Quand : un lieu qui a beaucoup de bonnes photos de formats mêlés (restaurant, ferme, gîte, domaine, architecte) ; pas
  pour un client « calme » (aiguillage). Distinct de `parallaxe-et-aimant` (une couche, aimant au survol) et de
  `nom-en-lettres-geantes` (une lettre derrière les photos). Calme : non. Poids : léger.

### `photos-qui-flottent`
Nishiyama Silk (`nishiyama.md`, [nishiyamasilk.com](https://nishiyamasilk.com/), veille du 26 oct 2026, soir ; état relevé
à 0, 400, 1 500 et 3 000 ms puis après chaque cran) : les photos de soie, de cocons et d'artisans sont découpées en galets
aux bords souples et **flottent** sur place : `translateY` de 0 à 10 px environ, animation `levitation` en boucle,
`ease-out`, durées 1,5, 2,5 et 3 s selon le galet (jamais deux en phase). Les titres de section apparaissent en fondu en
0,9 s environ quand ils entrent. Le tissu paraît léger, posé sur l'air ; rien ne suit le défilement.
- Entrée aucune · apparition fondu · survol couleur · fond flottement.
- Moteur : keyframes CSS sur `transform` seul (tient sur iPhone, rien sur le fil principal), trois durées décalées ;
  `data-reveal` (opacité) pour les titres ; arrêt sous `prefers-reduced-motion`. Manque : la règle de flottement dans la
  direction ou le bloc sur mesure.
- Quand : un objet du métier découpé (tissu, céramique, fleur, pâtisserie, pièce d'horlogerie) ; jamais sur un portrait ni
  sur une photo rectangulaire (l'effet devient un cadre qui tremble). Pas pour un client « calme » : ça bouge tout seul,
  doucement. Calme : non. Poids : nul.

### `deuxieme-vue-au-survol`
Poterie Ravel (`poterieravel.md`, [poterie-ravel.com](https://www.poterie-ravel.com/), veille du 27 oct 2026 ; opacité des
deux images relevée à 50, 100, 250, 500 et 800 ms après l'entrée puis la sortie du pointeur sur une carte produit, à 1 440 et
390 px de large) : chaque carte produit (photo 4:5, nom en capitales, prix) porte deux photos du même produit superposées.
Au survol, la première s'efface pendant que la seconde apparaît, en fondu enchaîné de 0,5 s `ease-in-out` (opacités 0,44 /
0,56 à 250 ms, échange complet à 500 ms) ; à la sortie, retour identique. Rien ne bouge au défilement. On voit l'objet seul,
puis l'objet sous un autre angle, sans clic ni carrousel.
- Entrée aucune · apparition aucune · survol seconde vue · fond aucun.
- Moteur : CSS seul (deux `<img>` superposées dans la carte, `opacity` en transition 0,5 s ease-in-out sur `:hover` et
  `:focus-visible`) ; tient sur iPhone (opacité seulement). Au toucher, la première vue reste : aucune information ne doit
  dépendre de la seconde. Manque : la variante de carte à deux photos (un champ « seconde photo » par service ou produit).
- Quand : un artisan à catalogue qui a deux bonnes photos par pièce (potier, céramiste, ébéniste, sellier) ; compatible avec
  un client « calme » (rien ne bouge sans geste). Distinct de `ombre-au-survol` (la carte se soulève) et de
  `portes-qui-s-eclairent` (flou qui se lève). Calme : oui. Poids : une image de plus par carte.

### `legende-fixe-qui-change`
Studio Mondine (`studiomondine.md`, [studiomondine.com](https://www.studiomondine.com/), veille du 27 oct 2026 ; état des
légendes relevé à la molette, cran de 450 px, à 100, 300 et 700 ms après chaque cran, à 1 440 et 390 px de large) : la page
n'est faite que de photos bord à bord, un projet par diptyque. Le nom du projet en cours (Fautive 300, 42 px, blanc) est
posé au centre de l'écran en position fixe ; quand le diptyque suivant passe le milieu de l'écran, la légende change
d'un coup (opacité 0 → 1, durée de transition 0 s, une seule légende visible à la fois), et disparaît sur le premier écran
et sur le bloc final. Les photos, elles, ne bougent pas : elles entrent sous un voile blanc cassé à 20 % qui s'efface en
1,4 s `cubic-bezier(.25,.1,.25,1)` ; liens 0,25 s.
- Entrée aucune · apparition légende fixe · survol soulignement · fond aucun.
- Moteur : une légende par groupe de photos, IntersectionObserver sur le groupe (seuil au milieu de l'écran), bascule
  d'opacité sans transition ; rien ne glisse, rien n'est calé sur `--p` (tient sur iPhone) ; identique en mouvement
  réduit. Manque : le déclencheur (`data-legende` sur le groupe, script court de bloc sur mesure) et la garde de
  lisibilité (légende blanche seulement sur une photo assez sombre au centre, contraste mesuré ; sinon un voile).
- Quand : un client qui montre ses réalisations par projet ou par événement avec beaucoup de bonnes photos (fleuriste
  événementiel, décorateur, paysagiste, menuisier, traiteur de mariage) ; le nom du projet et le lieu suffisent, aucun
  texte long. Compatible avec un client « calme » (rien ne glisse, rien ne part seul). Distinct de `chapitres-epingles`
  (des étapes épinglées) et de `nom-qui-s-efface` (le nom du client pâlit au défilement). Calme : oui. Poids : léger.

### `photo-qui-s-approche`
Marion Graux (`mariongraux.md`, [mariongraux.com](https://www.mariongraux.com/), veille du 27 oct 2026 ; `transform` de la
photo relevé à 50, 150, 300 et 600 ms après l'entrée du pointeur sur une carte, puis à 400 ms après la sortie, à 1 440 px de
large ; règle CSS lue dans la feuille du thème) : la page est posée, rien n'apparaît au défilement. Les pièces sont en photos
carrées, deux par rangée, dans un cadre qui rogne (`overflow: hidden`) ; au survol, la photo s'approche d'un rien dans son
cadre : `scale` de 1 à 1,03 en 0,3 s `ease` (1,007 à 50 ms, 1,022 à 150 ms, 1,03 à 300 ms), retour identique à la sortie.
Le cadre ne bouge pas, ni ombre ni soulèvement : c'est l'œil qui se penche sur l'assiette.
- Entrée aucune · apparition aucune · survol approche · fond aucun.
- Moteur : CSS seul (transition de `transform` sur l'image, cadre en `overflow: hidden`), uniquement sous
  `@media (any-pointer: fine) and (prefers-reduced-motion: no-preference)` comme la source : au toucher et en mouvement
  réduit, rien ne bouge (tient sur iPhone, rien sur le fil principal). Manque : la règle de survol des cartes dans la
  direction ; jamais plus de 1,05 (au-delà la pièce est rognée).
- Quand : un artisan qui vend des pièces photographiées une à une (potier, céramiste, ébéniste, maroquinier, fleuriste,
  pâtissier) avec des photos nettes d'au moins 1,5 fois la taille affichée ; compatible avec un client « calme ». Distinct
  de `ombre-au-survol` (la carte se soulève), de `deuxieme-vue-au-survol` (une autre photo) et de `photo-qui-respire`
  (zoom lent qui part seul). Calme : oui. Poids : nul.

### `legende-qui-se-leve`
Couteaux Deva (`couteauxdeva.md`, [couteauxdeva.com](https://couteauxdeva.com/), veille du 27 oct 2026, tour 11 ; transitions
lues à 150 et 650 ms après l'entrée du pointeur sur une tuile, à 1 440 px de large) : rien n'apparaît au défilement, rien ne
tourne seul. Les pièces sont en tuiles photo bord à bord, le nom posé sur la photo à 70 % d'opacité ; au survol, la photo perd
son contraste renforcé (`filter: contrast(1.15)` vers 1) pendant que le nom passe à 100 % et monte de 7 px, 0,3 s `ease`.
- Entrée aucune · apparition aucune · survol légende · fond aucun.
- Moteur : CSS seul, dans `@media (hover: hover) and (pointer: fine)` (et `:focus-visible`) ; au toucher le nom est déjà à
  100 %. Manque : la règle de survol des tuiles dans la direction ou le bloc.
- Quand : pièces uniques bien photographiées sur un même fond (coutelier, forgeron, ébéniste, maroquinier) ; compatible
  avec un client « calme ». Distinct de `photo-qui-s-approche` (la photo grandit) et de `deuxieme-vue-au-survol` (une autre
  photo). Calme : oui. Poids : nul.

### `volet-a-l-entree`
Bourke Street Bakery (`bourkestreet.md`, [bourkestreetbakery.com.au](https://bourkestreetbakery.com.au/), veille du 27 oct
2026, tour 11 ; `document.getAnimations()` relevé à la molette) : quelques photos seulement se dévoilent une fois par un volet
`clip-path` de 1 s, `cubic-bezier(0.57, 0.18, 0, 0.92)`, au chargement et à l'entrée de l'image. Le reste est posé.
- Entrée aucune · apparition volet · survol couleur · fond aucun.
- Moteur : `data-reveal="clip"` ou `wipe` existe déjà ; visibles d'emblée en mouvement réduit (tient sur iPhone).
- Garde : deux photos au plus par page, jamais un titre, jamais suivi d'un zoom (GOUT § 2 refuse « photo qui se découvre
  par volet puis zoome au défilement, à chaque section »).
- Quand : boulangerie, épicerie, traiteur avec deux ou trois belles photos de la boutique ; client « calme » permis. Calme :
  oui. Poids : léger.

### `filet-qui-se-trace`
Wing On Wo & Co. (`wingonwoand.md`, [wingonwoand.co](https://wingonwoand.co/), veille du 27 oct 2026, soir ; pseudo-élément
`::after` du titre relevé à 100, 400, 900, 1 600 et 2 500 ms après l'entrée du titre à l'écran, à 390 et 1 440 px de large) :
la page est posée, les titres de bloc (« Our Origins », 29 px) ne bougent pas. Sous chacun, un filet noir de 3 px, 7 px sous
la ligne, se trace de gauche à droite de 0 à 36 px en 1,2 s `cubic-bezier(.13,.88,.62,1)` après 0,7 s (0 px à 400 ms,
20 px à 900 ms, 35 px à 1 600 ms), une seule fois. Les photos entrent en fondu 0,8 s `ease` à leur chargement ; liens 0,15 s.
- Entrée aucune · apparition filet · survol couleur · fond aucun.
- Moteur : `data-draw` existe (trait qui se trace au défilement, subtle) ; le poser sur un `<span>` court sous le h2.
  Manque : le filet dans la section ou la direction ; en mouvement réduit il est déjà tracé (tient sur iPhone : une largeur
  sur un trait de 3 px, rien de calé sur `--p`).
- Garde : un trait court (la longueur du premier mot au plus), jamais sous le h1, jamais une ligne pleine largeur qui
  souligne toute la page ; pas un titre révélé (GOUT § 2 : le titre est là d'emblée, seul le trait arrive).
- Quand : boutique ou artisan à la page posée qui veut une ponctuation discrète à chaque bloc (porcelaine, épicerie,
  librairie, mercerie) ; compatible avec un client « calme ». Distinct de `fil-qui-mene` (un fil qui traverse la page) et de
  `soulignement-qui-se-dessine` (au survol d'un lien). Calme : oui. Poids : léger.

### `citation-en-fondu`
Cora Pearl (`corapearl.md`, [corapearl.co.uk](https://www.corapearl.co.uk/), veille du 27 oct 2026, soir, moitié A ; opacité
des diapositives relevée toutes les 500 ms pendant 12 s à 1 440 px de large, captures à 0,5, 2,5, 5, 8 et 12 s) : le premier
écran est un diptyque bord à bord, une photo à gauche (l'enseigne, un plat, un dessin à l'encre), une citation de presse à
droite en capitales (« 'THE NEW DARLING OF COVENT GARDEN' », sa source dessous). Le couple photo + citation passe au suivant
en **fondu enchaîné** : opacités 1 → 0,74 → 0,27 → 0,07 → 0 d'une relève à l'autre, soit 1,5 à 2 s (`opacity 2s ease`,
Slick en mode fondu), la photo et la citation ensemble ; rien ne glisse. La source tourne seule toutes les 5 s environ ;
flèches et glisser au doigt existent aussi. Les blocs suivants apparaissent une fois (`all 1s ease`).
- Entrée aucune · apparition fondu · survol fondu enchaîné (au geste) · fond aucun.
- Moteur : `data-reveal` (opacité seule) pour les blocs suivants ; le diptyque lui-même manque : une pile de couples photo /
  citation, deux boutons étiquetés « Citation précédente / suivante » et le glisser au doigt (`touch-action: pan-y`), fondu
  d'opacité 1,5 s `ease` sur le couple entier, script court de bloc. **Sans rotation automatique** (GOUT § 4 : rien ne tourne
  tout seul quand on peut le faire à la main ; WCAG 2.2.2) ; en mouvement réduit, bascule sans fondu. Tient sur iPhone
  (opacité seule, rien de calé sur `--p`).
- Garde : au moins deux vraies citations du brief (avis Google recopiés, ligne de presse), chacune avec sa source et une
  photo du client ; jamais une citation inventée ni un avis sans auteur (GOUT § 0, `docs/BRIEF.md`) ; sinon ce profil ne se
  tire pas.
- Quand : restaurant, hôtel, traiteur, artisan cité par la presse ou aux avis forts, qui veut la preuve haut dans la page
  (GOUT § 0, point 4) sans bandeau d'étoiles ; compatible avec un client « calme ». Distinct de `legende-fixe-qui-change`
  (le nom du projet bascule sans fondu au défilement) et de `glisse-a-la-main` (une piste de cartes qui glisse). Calme : oui.
  Poids : léger.

### `silhouettes-en-fond`
Pastificio Mansi (`pastamansi.md`, [pastamansi.com](http://pastamansi.com/), veille du 28 oct 2026, moitié B ;
`getComputedStyle` des `.pasta` et `@keyframes` relevés à 1 440 px, captures à deux visites) : derrière le texte et les
photos, une **silhouette de pâte** géante (gnocco, raviolo, maccheroni, agnolo ; SVG en aplat jaune d'œuf #fbcd37, 440 à
460 px, `scale(0.8)`) par tranche de 766 px de page, à demi hors du bord gauche ou au milieu, qui **tourne sur elle-même**
en 85 à 115 s par tour, `linear infinite`, une sur deux dans l'autre sens : on ne la voit pas tourner, on la retrouve
autrement posée. La forme change d'une visite à l'autre. À l'entrée, le cadre de la première photo monte de 60 px en
fondu (`comeIn` 1,4 s `cubic-bezier(0.23, 1, 0.32, 1)` après 1,2 s) ; liens 0,2 s, menu 0,62 s `cubic-bezier(0.86, 0, 0.07, 1)`.
- Entrée photo qui monte · apparition aucune · survol couleur · fond silhouettes qui tournent.
- Moteur : rien d'existant (le sceau d'`objet-qui-tourne` est un objet au premier plan, 30 s). Manque : deux à quatre
  silhouettes SVG dessinées d'après le métier du client (pâte, pain, feuille, clé, bobine), un `@keyframes` de rotation
  (transform seul, tient sur iPhone), arrêté en mouvement réduit et mis en pause hors écran ; `data-reveal="up"` pour la
  première photo.
- Garde : une chose du métier, jamais le logo ni un titre (GOUT § 4) ; derrière le texte, jamais sous une ligne de texte
  courant ; aplat de l'accent 2, pas de dégradé ni de grain ; une silhouette par écran au plus.
- Quand : fabricant ou commerce de bouche à la page posée et typographique (pâtes fraîches, boulangerie, biscuiterie,
  confiserie, fleuriste, pépinière) dont le produit a une forme reconnaissable. Distinct d'`objet-qui-tourne` (un objet au
  premier plan qui tourne en 30 s) et de `photos-qui-flottent` (des photos détourées qui montent et descendent). Calme :
  non (ça bouge seul, même lentement). Poids : nul.

### `bloc-qui-s-avance`
Kumiko (`barkumiko.md`, [barkumiko.com](https://barkumiko.com/), veille du 28 oct 2026, moitié A ; `document.getAnimations()`
et classes `k-pre`, `k-in`, `k-focus` relevées à chaque cran de 250 px à 1 440 et 390 px de large, règles lues dans la
feuille de style) : le nom et la phrase du premier écran **montent** en apparaissant (`kRiseHero` 0,9 s, la phrase 150 ms
après). Chaque bloc de texte entre en montant de 26 px (opacité 1,2 s `cubic-bezier(.22,1,.36,1)`, transform 2 s
`cubic-bezier(.18,.6,.18,1)`). À l'ordinateur, le bloc qui arrive **au milieu de l'écran s'avance** : `scale(1.06)` en
0,6 s `cubic-bezier(.22,1,.36,1)`, origine au centre (1,04 pour un titre de section), et revient à 1 quand on le quitte ;
on lit une page dont le paragraphe en cours vient à soi. Au téléphone, la source garde la montée seule. Diaporama du
premier écran en fondu 1,2 s `cubic-bezier(.65,0,.35,1)`, avec un bouton pause et des points.
- Entrée montée · apparition avancée · survol couleur · fond aucun.
- Moteur : `data-stagger` (premier écran) et `data-reveal="up"` (montée) existent. Manque : l'avancée au centre de
  l'écran, une classe posée par un `IntersectionObserver` (`rootMargin` -40 % en haut et en bas) et une transition en
  temps sur `transform` ; rien de calé sur `--p` (tient sur iPhone, GOUT § 4) ; ordinateur seulement, comme la source ;
  rien en mouvement réduit.
- Garde : deux ou trois blocs de texte courts par page (la phrase d'accueil, l'adresse et les horaires), jamais une photo,
  une grille ou un titre seul ; jamais au-delà de 1,06 (au-delà le texte se floute et déborde) ; un seul bloc avancé à la
  fois.
- Quand : bar, restaurant du soir, salon de thé, hôtel, artisan à la page posée et aérée (texte centré, grandes marges)
  qui veut un mouvement de lecture sans effet de scène. Distinct de `photo-qui-s-approche` (une photo grandit au survol
  dans son cadre) et de `parallaxe-et-aimant` (des plans qui glissent avec le défilement). Calme : non (le bloc réagit à
  la position). Poids : léger.

### `bandeau-des-adresses`
Red Clay (`redclay.md`, [redclayhotsauce.com](https://redclayhotsauce.com/), veille du 28 oct 2026, moitié B ;
`getComputedStyle` des `.marquee__content` relevé à 1 440 px, page défilée) : la page est posée (tout change en 0,3 s
`ease`), sauf **une bande** pleine largeur sur l'aplat corail, tenue entre deux traits noirs épais et ondulés : les noms des
restaurants qui servent la sauce, chacun suivi de sa ville (« Babas, Charleston, SC », « Queen Street, Los Angeles,
CA »…), en capitales serif condensées, défilent de droite à gauche en **100 s** par boucle, `linear infinite` (11 000 px de
piste) : on lit un nom, il est encore là. C'est la preuve du produit, posée en mouvement.
- Entrée aucune · apparition aucune · survol couleur · fond bandeau lent.
- Moteur : `data-marquee="100s"` existe (une bande, sens normal). Manque : les deux traits ondulés (SVG du bloc), la pause
  au survol et au focus si le moteur ne l'a pas (WCAG 2.2.2) ; en mouvement réduit, la bande s'arrête et devient une liste
  qu'on fait glisser à la main (GOUT § 4).
- Garde : au moins quatre vrais lieux du brief (revendeurs, tables qui servent le produit, marchés, communes desservies),
  jamais inventés, jamais des logos de presse ; une seule bande par page.
- Quand : producteur ou artisan de bouche vendu ailleurs que chez lui (sauces, confitures, fromages, bières, cafés,
  boulangerie qui livre des restaurants), artisan qui tourne sur des communes. Distinct de `bandes-croisees` (deux bandes
  inclinées en sens contraires, une devise). Calme : non (bouge seul). Poids : léger.

### `annonce-qui-defile`
Hôtel Rochechouart (`rochechouart.md`, [hotelrochechouart.com](https://www.hotelrochechouart.com/), veille du 28 oct 2026,
moitié B ; sonde `document.getAnimations()` et styles en ligne à 0, 200, 700 et 1 500 ms puis à chaque cran de 700 px, à
1 440 et 390 px de large) : une page d'hôtel posée, où **rien n'entre et rien n'apparaît**. Deux choses seulement bougent :
juste sous le premier écran, une **bande fine** (une ligne de texte de 14 px, sur l'ivoire, entre deux filets) répète
l'annonce du moment (« Réservez en direct pour bénéficier de -10 % sur votre réservation ») et défile de droite à gauche,
animation `scroll` **20 s `linear` infinite** ; et la barre de navigation, transparente sur la photo, prend l'aplat
bordeaux dès qu'on défile (`background-color` 0,3 s `ease`). C'est l'annonce du commerçant, dite une fois, qui passe
sans crier ; le reste de la page ne bouge pas.
- Entrée aucune · apparition aucune · survol couleur · fond annonce qui défile.
- Moteur : `data-marquee="20s"` existe (contenu dupliqué, `linear`) ; `.is-scrolled` posé sur la nav après 40 px existe
  (`motion.ts`), la direction lui donne l'aplat de l'encre en 0,3 s ; le texte vient du champ `annonce` du site
  (`src/components/Annonce.astro`, fenêtre `du` / `au`) : l'annonce existante devient une bande qui défile. Manque : la
  variante défilante d'`Annonce.astro` (une ligne en petites capitales ou en texte courant, entre deux filets de
  `--line`), pause au survol et au focus (WCAG 2.2.2), arrêtée et lisible d'un bloc en mouvement réduit.
- Garde : une seule phrase vraie du brief (fermeture, saison, offre datée, « Réservez en direct »), jamais un slogan ni
  une liste de mots-clés ; une seule bande, fine (une ligne de texte courant, jamais des capitales géantes) ; absente si
  le client n'a pas d'annonce.
- Quand : hôtel, restaurant, salon, boutique qui a une nouvelle du moment et une page calme par ailleurs. Distinct de
  `bandeau-des-adresses` (une bande géante de vrais lieux entre deux vagues, preuve du produit) et de `bandes-croisees`
  (deux bandes inclinées, une devise). Calme : non (la bande bouge seule, lentement). Poids : nul (CSS seul).

### `nom-en-marge`
Cosme (`cosme.md`, [cosmenyc.com](https://www.cosmenyc.com/), veille du 28 oct 2026, tour 14, moitié A ; position, classes
et `transform` relevés à la molette par crans de 400 px et à 0, 400, 1 000, 2 000 et 3 500 ms après le chargement, à 1 440 et
390 px de large) : le **nom du restaurant**, en capitales géantes posées **à la verticale** (`svg#hero_logo.is-fixed`, 143 x
820 px, gris clair #dbdbdb sur le sang-de-bœuf), tient toute la hauteur de l'écran dans une colonne de marge à droite, en
position fixe : la page entière (photo de la salle en noir et blanc, carte, galerie, événements, contact) défile à sa
gauche et il ne bouge jamais. Rien n'entre, rien n'apparaît au défilement ; la seule chose animée est le menu, un panneau
de 420 px qui arrive de la gauche (`transform` 0,4 s `ease`) ; liens soulignés 0,1 s. GSAP et ScrollTrigger sont chargés
sans déclencheur actif. Le mouvement est celui de la page contre un nom immobile : deux plans, sans rien d'animé.
- Entrée aucune · apparition aucune · survol soulignement · fond nom fixe.
- Moteur : rien à ajouter dans `motion.ts` (rien n'est animé). Manque : la colonne de marge et le nom vertical en texte
  réel (`writing-mode: vertical-rl` ou rotation, jamais une image), retirée de la largeur du conteneur, dans une coquille
  ou une section sur mesure ; identique en mouvement réduit.
- Garde : un nom court (12 lettres au plus) qui tient sur la hauteur d'un téléphone sans descendre sous 56 px, jamais une
  phrase ni le métier (le métier et la ville restent dans le h1, GOUT § 0) ; aucun texte sous la colonne ; au téléphone,
  le nom peut être coupé en bas de l'écran, jamais le texte de la page ; contraste du nom sur le fond mesuré (grand texte,
  3:1).
- Quand : restaurant, bar, caviste, boutique au nom court qui sonne, à la page longue et posée (une seule page à ancres ou
  des pages courtes) ; compatible avec un client « calme » (rien ne bouge seul). Distinct de `nom-qui-s-efface` (le nom
  au centre pâlit au défilement), de `nom-en-lettres-geantes` (une lettre géante par section, qui glisse plus lentement que la page) et de `legende-fixe-qui-change`
  (une légende fixe qui change par projet). Calme : oui. Poids : nul.
### `nom-en-exclusion`
Experimental Cocktail Club (`experimentalcc.md`, [experimentalcocktailclub.com](https://www.experimentalcocktailclub.com/), veille du
28 oct 2026, tour 15, moitié A ; `getComputedStyle` (mix-blend-mode, transform, opacité) relevé à 100, 600, 1 500 et 3 000 ms puis à
200, 450 et 900 px de défilement, à 1 440 et 390 px de large) : le premier écran est un **portrait vertical étroit** (une vidéo du
barman, 446 x 610 px centré sur le noir, 256 x 500 au téléphone) et le **nom en très grand** posé en travers, en position fixe, avec
`mix-blend-mode: exclusion` : blanc sur le noir, il s'inverse là où il passe sur le portrait. Rien n'entre au chargement. Au
défilement, le nom **descend au tiers de la vitesse de la page** (translateY 84, 160, 305 px pour 200, 450, 900 px à l'ordinateur ;
104, 157, 175 px au téléphone, puis il s'arrête) : la page glisse dessous et il s'inverse sur chaque photo qui passe. La barre de
navigation est aussi en exclusion. Un intitulé arrive en opacité 0,8 s `ease` ; survols 0,2 s `ease`.
- Entrée aucune · apparition aucune · survol couleur · fond nom en exclusion.
- Moteur : `data-parallax` (0,6 : la dérive de ±24 % de sa hauteur) sur le nom pour la descente lente ; le reste est du CSS
  (`mix-blend-mode: exclusion`, `position: sticky` dans un rail qui couvre le portrait et l'ouverture, à la place du `fixed` de la
  source : le nom quitte l'écran avec le premier écran, il n'a pas à passer sur toute la page). **Codé** le 29 oct 2026 dans
  `src/sections/Hero/portrait-exclusion.astro` (style entier `experimentalcc`, `presets/experimentalcc.json`) : le nom en texte réel
  (jamais une image) posé sur le portrait vertical du premier écran ; en mouvement réduit, nom posé sans parallaxe ni collage.
- Garde : seulement sur un fond noir ou blanc pur (sur un fond teinté, l'exclusion donne une couleur au hasard) ; une seule chose en
  exclusion avec la barre de navigation ; le métier et la ville restent en texte normal dans le h1 ou juste dessous (GOUT § 0) ;
  contraste vérifié sur la photo et sur le fond ; la photo verticale est une vraie photo ou vidéo du client (pas d'exigence de vidéo).
- Quand : bar à cocktails, caviste, restaurant du soir, barbier, tatoueur, au nom court qui sonne, avec un portrait vertical fort
  (le geste, la personne). Distinct de `nom-en-marge` (le nom vertical immobile dans une colonne de marge), de `nom-qui-s-efface` (le
  nom pâlit au défilement) et de `nom-en-lettres-geantes` (une lettre par section derrière les photos). Calme : non (suit le
  défilement). Poids : léger.
### `photo-qui-se-pose`
Paradero (`paradero.md`, [paraderohotels.com](https://www.paraderohotels.com/), veille du 28 oct 2026, tour 15, moitié B ;
`transform` calculé de la photo d'un panneau relevé tous les 100 px de défilement, puis celui du texte toutes les 45 ms après
un saut de défilement, à 1 440 et 390 px de large ; GSAP et ScrollTrigger) : la page alterne des blocs de texte sur le sable
et de grands panneaux photo voilés de noir (30 à 45 %) portant un surtitre, un titre, une phrase et un bouton. Quand un panneau
monte du bas de l'écran, sa photo entre **agrandie à 1,04 et se pose à 1** pendant les 600 premiers pixels (1,04 ; 1,024 ;
1,013 ; 1,006 ; 1,002 ; 1 : une décélération liée au défilement, mêmes valeurs au téléphone), avec une dérive verticale de 2,5
à 3 px par 100 px (30 à 48 px sur tout le passage). Au moment où le panneau atteint le bas de l'écran, les lignes de texte
posées dessus **montent de 24 px en fondu**, 0,8 s ease-out, une ligne toutes les 0,1 s. Rien n'entre au chargement ; la barre
de navigation prend le sable en 0,4 s ease au premier cran.
- Entrée aucune · apparition photo qui se pose · survol couleur · fond aucun.
- Moteur : `data-scrub="scale=1.04"` sur la photo dans un cadre à `overflow: hidden`, `data-parallax="0.03"` pour la dérive ;
  `data-reveal="up"` + `data-stagger="100"` sur le bloc de texte du panneau. Manque : une amplitude réglable pour
  `data-reveal="up"` (le moteur monte de 12 px, la source de 24).
- Garde : deux grands panneaux photo par page au plus, jamais à chaque section (une photo qui zoome au défilement partout est un
  signe IA, GOUT § 2) ; jamais avec un volet ni un masque ; échelle de départ 1,06 au plus ; texte sur la photo seulement sur un
  voile dont le contraste est mesuré (AA) ; en mouvement réduit, la photo est posée à 1 et le texte visible d'emblée.
- Quand : gîte, hôtel, domaine, restaurant ou artisan avec deux ou trois très bonnes photos de lieu en grand format, qui veut
  de la profondeur sans effet voyant. Distinct de `plans-au-chargement` (le premier écran se resserre au chargement), de
  `photo-qui-s-approche` (zoom au survol d'une carte), de `photos-a-plusieurs-vitesses` (décalages de vitesse entre photos en
  quinconce) et de `bloc-qui-s-avance` (un bloc qui grandit puis revient). Calme : non (suit le défilement). Poids : léger.

### `enseigne-qui-se-resserre`
Zimmerl (`bouteille.md`, [restaurantzimmerl.at](https://www.restaurantzimmerl.at/), veille du 29 oct 2026, style construit
`bouteille` ; animations calculées relevées par `ff demonter` : `kenburnsDown 1s ease-out` sur le diaporama de la salle,
transitions d'interface `0.25s cubic-bezier(.25,.1,.25,1)`, GSAP et ScrollTrigger sur les blocs « 23 Gänge » et « 5 Tische »
vus en défilant à la molette tous les 800 px). Le premier écran est la salle en plein cadre avec le nom du restaurant en très
grandes capitales cuivre ; la photo descend et se pose (Ken Burns vers le bas). Plus bas, chaque grand chiffre (« 23 GÄNGE »,
« 5 TISCHE ») surplombe le coin d'une grande photo et se décale par rapport à elle pendant le défilement. Ce qu'on code (le
diaporama automatique de la source ne l'est pas : rien ne tourne tout seul, GOUT § 4) :
- Entrée enseigne · apparition titre en surplomb · survol couleur · fond aucun.
- Moteur : CSS du hero `bouteille` (le nom resserre son interlettrage 0,34 em -> 0,08 em en 1,6 s, la photo se pose de 1,06 à
  1 en 2,4 s, une fois, rien sous « réduire les animations ») ; `data-parallax="0.5"` sur le titre géant de chaque scène de
  `services/bouteille` (translation seule : tenable sur iPhone, GOUT § 4) ; `data-reveal` (opacité) sur la photo ; boutons
  0,25 s (régime sec). Deux régimes : lent à l'entrée, sec au geste.
- Garde : le nom en texte réel (jamais une image), le h1 et « métier à ville » juste sous la photo en texte normal (GOUT § 0) ;
  un titre géant par scène, jamais sur tous les titres de la page ; en mouvement réduit, nom et photo immobiles.
- Quand : restaurant, bar à vin, caviste, chambre d'hôtes, chocolatier au nom court qui sonne, avec une belle photo de salle et
  une photo par prestation. Distinct de `plans-au-chargement` (photo qui se resserre sans enseigne), de `nom-en-exclusion` (nom
  fixe en exclusion) et de `photo-qui-se-pose` (zoom lié au défilement sur de grands panneaux). Calme : non (suit le
  défilement). Poids : moyen (GSAP pour la parallaxe, chargé à la demande en rich).

### `film-au-clic`
Fraher (`lin.md`, [fraher.co](http://fraher.co/), veille du 29 oct 2026, style construit `lin` ; opacité et `transform` des
11 blocs `data-animation` relevés tous les 100 px de défilement à 1 440 px de large, puis tous les 60 ms après un saut :
1 et `none` partout, aucune apparition ; boutons `background-color 0.1s linear, color 0.1s linear` ; en-tête qui passe en
`shrink` au premier cran, `padding 0.14s ease-in-out`). La page ne bouge pas : c'est le choix. Le seul mouvement est un film
que le visiteur lance lui-même (« Click for FRAHER Film » sur une bande pleine largeur, lecture avec commandes natives).
- Entrée aucune · apparition aucune · survol filets qui s'emplissent · fond film au clic.
- Moteur : hero `lin` : bande photo pleine largeur ; avec `images.heroVideo` et un poster, lien « Voir le film » posé en bas
  de la bande, vidéo `preload="none"` cachée qui ne se charge et ne joue qu'au toucher (`data-film`, `data-film-lancer`,
  script `onPage`), commandes natives, aucun autoplay ; `.btn-ghost` de la direction `lin` (texte entre deux filets) qui
  s'emplit d'encre en 0,1 s linéaire ; nav `minimal` qui se resserre au premier cran (`.is-scrolled`). Aucun `data-reveal`
  posé par le hero ni par `services/lin`.
- Garde : jamais d'autoplay (lecture au geste seulement : tient sur iPhone en économie d'énergie, où tout autoplay est
  bloqué) ; poster obligatoire, sinon pas de film ; le film est celui du client (son chantier, son atelier), jamais une
  vidéo de banque présentée comme la sienne ; sans vidéo, la bande reste une photo immobile.
- Quand : architecte, constructeur, menuisier, cabinet de soin, gîte : un client « calme » (aiguillage) qui veut une page
  sérieuse et lisible, avec de grandes photos et éventuellement un film de chantier. Distinct de `fondu-sobre` (apparitions
  en fondu), de `video-de-fond` (vidéo muette qui joue seule derrière le texte) et de `photo-qui-respire` (photo qui dérive).
  Calme : oui. Poids : nul (la vidéo n'est téléchargée qu'au clic).

### `bandes-au-pinceau`
Coyot Bar (`pinceau.md`, [pickyjoe.com](https://pickyjoe.com/), veille du 29 oct 2026, style construit `pinceau` ; réglages
Elementor lus dans le HTML : `fadeIn` sur l'enseigne du premier écran, 1,25 s ; `fadeInUp` ×12 avec 200 ms de retard sur
les blocs ; un `motion_fx` d'échelle au défilement ; transitions de boutons 0,3 s ease ; séparateurs de bande en forme de
coup de brosse, immobiles). On garde l'enseigne qui s'allume et le bord brossé ; on refuse la montée de tous les blocs
(GOUT § 4 : « tout se lève ») et l'échelle au défilement.
- Entrée enseigne qui s'allume · apparition bord qui se brosse · survol aplat qui change · fond aucun.
- Moteur : hero `pinceau` : h1 et ligne métier à ville en fondu lent (opacité, 1,2 s ease, la ligne 0,2 s après), CSS
  seul, jamais avec `motion: none` ni `prefers-reduced-motion` ; `src/components/BordPinceau.astro` (hero et
  `services/pinceau`) : les éclats et traits détachés du bord se brossent de gauche à droite à l'entrée
  (`data-reveal="wipe"`, 0,6 s, une fois) ; plaque des horaires en `data-reveal="up"` ; `.btn` de la direction `pinceau`
  qui change d'aplat en 0,15 s linéaire. Deux régimes : sec (boutons) et lent (enseigne, brossé).
- Garde : rien ne suit le défilement (tient sur iPhone : transitions en temps, une fois) ; le bord lui-même ne bouge
  jamais, seuls ses éclats ; les titres de section ne s'animent pas ; en mouvement réduit tout est posé d'emblée.
- Quand : bar, restaurant, food truck, brasserie, pizzeria, guinguette : un lieu joyeux avec une carte et des horaires du
  soir. Distinct de `fondu-sobre` (fondu de blocs entiers), de `filet-qui-se-trace` (un filet droit qui se dessine) et de
  `enseigne-qui-se-resserre` (interlettrage sur photo, parallaxe).
  Calme : oui. Poids : léger (CSS et moteur sans dépendance).

### `index-qui-change-la-photo`
BCG Building Design (`enduit.md`, [bcgbuildingdesign.com.au](https://bcgbuildingdesign.com.au/), veille du 29 oct 2026, style
construit `enduit` ; DOM du bloc « Featured Works » lu à 1 440 px : chaque ligne porte sa photo cachée
(`.featured-image`, `display: none`) et deux filets, `featured-divider` et `featured-divider-active` ; transitions relevées
`opacity 0.2s ease` ×32, `transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)` ×20, `transform 0.8s` même courbe ×8 ; au
téléphone, une photo par ligne, pile sans survol, 390 px). La page ne bouge presque pas ; le mouvement est dans la liste des
réalisations : survoler une ligne montre sa photo au milieu de l'index, la ligne passe à l'encre et son filet se trace. On
garde l'index et le nom géant qui monte ; on refuse le préchargement plein écran (calque à 98 % de l'écran à l'arrivée) et la
section qui glisse à l'horizontale au défilement (piste épinglée de 2,5 écrans : déjà `piste-horizontale`).
- Entrée aucune · apparition nom en tranches · survol ligne qui montre sa photo · fond aucun.
- Moteur : `services/enduit` : photos des services superposées dans un cadre 4:5 posé au milieu de la liste (ordinateur),
  `pointerenter` et `focusin` sur la ligne (script `onPage`) : la photo de la ligne passe à l'opacité 1 en 0,4 s
  `--ease-brand` (courbe de la source), la ligne passe de `--muted` à `--fg`, son filet brun `scaleX(0)` → `scaleX(1)` en
  0,8 s ; au téléphone la photo du milieu est cachée, chaque ligne a la sienne au-dessus d'elle (aucun script). `about/enduit` :
  le nom en lettres géantes sur la bande brune, une lettre par cadre `overflow: hidden`, `translateY(105 %)` → 0 en 0,8 s,
  40 ms de décalage par lettre, déclenché une fois par `IntersectionObserver` (seuil 0,3) ; l'état caché n'existe que sous la
  classe posée par le script (sans script, le nom est en place). `.btn-ghost` de la direction `enduit` : texte sur un filet,
  flèche qui avance de 4 px en 0,4 s.
- Garde : rien n'est calé sur le défilement (transform et opacité en temps, une fois : tient sur iPhone) ; au toucher, aucune
  information ne dépend du survol (chaque service a sa photo et sa page) ; un seul nom géant animé par page (celui du pied ne
  bouge pas) ; en mouvement réduit, la photo change sans fondu et le nom est posé d'emblée.
- Quand : maçon, façadier, constructeur de maisons, paysagiste, piscinier, architecte : un client calme qui a une belle photo
  par prestation ou par réalisation. Distinct de `deuxieme-vue-au-survol` (deux vues d'une même carte), de
  `legende-fixe-qui-change` (légende fixe au défilement) et de `cellules-qui-s-ouvrent` (accordéon de cellules sur une photo
  pleine largeur). Calme : oui. Poids : nul (CSS et un script de quelques lignes).

### `cellules-qui-s-ouvrent`
Tekt (`calque.md`, [tekt.com.au](https://tekt.com.au/), veille du 29 oct 2026, style construit `calque` ; transitions relevées
dans le CSS calculé : `opacity 0.5s linear` ×29, `opacity 0.25s linear` ×29, `all 0.5s ease` ×33 ; aucune apparition au
défilement). La page ne bouge pas en défilant : ce sont les listes qui répondent. Les étapes, les engagements, les séries sont
des cellules de plan empilées ; on en touche une, elle s'ouvre (la première l'est déjà) et sa photo entre en fondu.
- Entrée aucune · apparition aucune · survol cellule qui s'éclaire · fond aucun.
- Moteur : rien du moteur ; `Services/calque` et `About/calque` en `<details name>` natif (accordéon exclusif sans script,
  Safari 17.2+, ailleurs plusieurs restent ouvertes), photo de la cellule ouverte en `@keyframes` opacité 0 → 1, 0,5 s
  linéaire ; `Proof/calque` : la cellule touchée change la photo pleine largeur (fondu croisé 0,5 s linéaire, script `onPage`,
  sans script la première photo) ; fond de cellule `--bg` → `--bg-2` au survol en 0,5 s ease (`src/styles/cellules.css`).
  Mouvement réduit : aucun fondu. Tient sur iPhone (aucun calage sur le défilement).
- Quand : constructeur, menuisier, agenceur, architecte : un client « calme » qui a des étapes ou des prestations à dérouler
  et une photo par étape. Distinct de `index-qui-change-la-photo` (liste fixe, photo qui change au survol) et de
  `legende-fixe-qui-change`. Calme : oui. Poids : nul.

### `chapitre-qui-s-ouvre`
23° Monorigine (`chapitre.md`, [23gradicoffee.com](https://www.23gradicoffee.com/), veille du 29 oct 2026, style construit
`chapitre` ; transitions relevées : `transform 1s cubic-bezier(0.25, 1, 0.5, 1)` ×44 ; GSAP, Lenis et Swiper chargés). Le
nom de la marque monte de sous sa ligne à l'arrivée ; chaque chapitre s'ouvre sur une règle fine numérotée ; les produits
défilent un à un, chacun posé sur son nom géant.
- Entrée nom qui monte · apparition règle de chapitre · survol couleur · fond aucun.
- Moteur : `Hero/chapitre` : le nom (h1) dans un cadre `overflow: hidden`, `@keyframes` translateY 100 % → 0, 1 s
  cubic-bezier(0.25, 1, 0.5, 1), une fois, CSS seul ; `Chapitre.astro` : la règle (filet, deux traits au quart et aux trois
  quarts, intitulé et numéro 001) en `data-reveal="wipe"` du moteur (clip-path de gauche à droite, une fois) ;
  `Services/chapitre` : piste scroll-snap native, flèches qui avancent d'une case (`scrollTo` smooth, saut en mouvement
  réduit), liste à points qui suit. On refuse le défilement lissé (Lenis) et le mot géant piloté au défilement.
- Quand : torréfacteur, caviste, chocolatier, épicerie fine : un produit qu'on raconte en chapitres, avec des photos d'objets.
  Distinct de `filet-qui-se-trace` (trait court sous un titre), de `nom-en-lettres-geantes` (lettre en parallaxe) et de
  `mots-qui-glissent` (mots pilotés au défilement). Calme : oui. Poids : léger.

### `nom-qui-defile-au-pied`
LRNCE (`ocre.md`, [lrnce.com](https://lrnce.com/), veille du 29 oct 2026, style construit `ocre` ; animations du DOM calculé
relevées à 1 440 px, puis captures du premier écran à 0, 5 et 10 s : une seule animation sur toute la page,
`move-background 40s linear infinite`, sur la bande rouille du pied qui porte le logotype « LRNCE » répété ; transitions de
`background`, `border`, `color` 0,3 s ease ×77 sur les cartes et les liens ; rien n'apparaît au défilement, le premier
écran est immobile). La page entière se tient tranquille, faite de photos posées et de filets ; seul le nom glisse, tout en
bas, comme une enseigne peinte sur un auvent.
- Entrée aucune · apparition aucune · survol souligné qui prend le rouille · fond nom qui défile.
- Moteur : `contact/ocre` : bande pleine largeur `bg-ink`, `data-marquee="40s"` du moteur sur une `.marquee-track` qui porte
  deux fois le nom du client (dupliquée par le moteur : enroulement sans couture), capitales géométriques en graisse 800,
  `clamp(3.2rem, 9vw, 8.5rem)`, interlettrage 0,06 em ; pause au survol (règle `[data-marquee]:hover` de `global.css`) ;
  `aria-hidden` (le nom est déjà dans la barre, le titre et le pied). Direction `ocre` : liens soulignés et boutons qui
  passent au rouille en 0,3 s ease.
- Garde : une seule bande par page, au pied, jamais au premier écran ; le nom du client seulement (jamais un slogan, des
  mots-clés ou des villes : c'est `bandeau-des-adresses` ou `annonce-qui-defile`) ; translation seule, en temps (tient sur
  iPhone, piste courte : deux occurrences du nom) ; arrêtée en mouvement réduit ; rien d'essentiel dedans.
- Quand : potier, céramiste, tisserand, fleuriste, tapissier, créateur : un atelier au nom court (4 à 14 lettres) qui
  montre ses pièces en grandes photos. Distinct de `nom-en-lettres-geantes` (lettre de fond en parallaxe par section), de
  `bandeau-des-adresses` (les lieux de vente) et de `annonce-qui-defile` (la nouvelle du moment sous le premier écran).
  Calme : non (une chose bouge seule). Poids : nul (CSS du moteur).

### `mots-sous-la-photo`
Impasto Forno Antico (`farine.md`, [impastofornoantico.com](https://www.impastofornoantico.com/), veille du 30 oct 2026, tour 19,
style construit `farine` ; premier écran relevé à 5, 6,5, 8 et 10 s après le chargement à 1 440 px : la vidéo en noir et
blanc paraît seule, puis « FOCACCIA / CIABATTA / SOURDOUGH » en Aaux Next de 168 px montent ligne à ligne autour d'elle et
passent en clair là où ils la traversent ; transitions relevées `0.375s cubic-bezier(0.625, 0.05, 0, 1)` et
`0.7s cubic-bezier(0.5, 0.5, 0, 1)` ; GSAP, ScrollTrigger, Lenis). On garde l'ordre (la photo, puis les mots), la montée en
cadre et la double bande des noms ; on refuse le préchargement plein écran (« Sourdough » sur brun) et la vidéo (une photo).
- Entrée mots qui montent · apparition fondu · survol souligné · fond bandes qui défilent.
- Moteur : `hero/farine` en CSS seul (`@keyframes farine-monte` translateY 102 % → 0 dans un cadre `overflow: hidden`,
  0,7 s `--ease-brand`, 450 ms puis 120 ms par ligne ; `farine-parait` opacité de la photo) ; `services/farine` :
  `data-reveal` sur les photos, `data-reveal="up"` + `data-stagger="120"` sur les morceaux de la phrase éclatée,
  `data-marquee="48s"` sur deux bandes dont la seconde `data-marquee-sens="inverse"`.
- Garde : transform et opacité en temps, une fois (tient sur iPhone) ; les bandes s'arrêtent au survol et sont posées en
  mouvement réduit (décoratives, `aria-hidden`, les noms sont lus au-dessus) ; un seul premier écran animé.
- Quand : boulanger, pâtissier, pizzeria, traiteur : un client qui a trois produits aux noms courts et une belle photo de
  travail (mains, pâte, four). Distinct de `mots-qui-glissent` (titre qui glisse au défilement) et de `bandes-croisees`
  (bandes de mots seules, sans la montée autour de la photo). Calme : oui. Poids : nul (CSS et le moteur).

### `heures-ecrites-a-la-main`
Haven (`pochoir.md`, [haven-annecy.fr](https://haven-annecy.fr/), veille du 30 oct 2026, tour 19, style construit `pochoir` ;
accueil relevé à 1 440 et 390 px : « BRUNCH » en DIN noir pâle de bord à bord barré de « 9am - 2pm » en script terre cuite,
« COFFEE » barré de « All day » ; aucune bibliothèque, transitions `0.5s ease`). Le geste est un mot qu'on écrit sur un
autre : on le rend visible en découvrant le script de gauche à droite à son arrivée.
- Entrée aucune · apparition écriture · survol flèche · fond aucun.
- Moteur : `data-reveal="wipe"` (clip-path, une fois) sur le `<p>` des heures dans `services/pochoir`, porté par un parent
  `.pochoir-heures` qui fait l'inclinaison (-3 degrés) et la position (la règle du moteur remet `transform: none` sur
  l'élément révélé : jamais d'inclinaison sur l'élément qui porte `data-reveal`) ; même attribut sur la phrase écrite
  d'`about/pochoir` et de `contact/pochoir`.
- Garde : le script ne porte que des mots courts (heures, une phrase) ; il n'est jamais le seul titre lisible (le nom de
  l'offre est un h2 caché lu par les lecteurs d'écran, la phrase du pied est un vrai h2) ; tient sur iPhone (clip-path en
  temps) ; en mouvement réduit, tout est écrit.
- Quand : café, brunch, salon de thé, crêperie, glacier : un commerce aux offres datées par l'heure (« 9 h – 14 h »,
  « Toute la journée »). Distinct de `soulignement-qui-se-dessine` (un trait sous un mot) et de `filet-qui-se-trace` (trait
  court sous un titre). Calme : oui. Poids : nul.

### `filet-tremble-qui-se-trace`
Flora Café (`buvard.md`, [florawellnesscafe.com](https://www.florawellnesscafe.com/), veille du 30 oct 2026, tour 19, style
construit `buvard` ; accueil relevé à 1 440 et 390 px : les blocs séparés par un trait d'encre ondulé tiré à la main, sur
toute la largeur ; transitions `0.4s linear` ×113 (étiquettes, liens), aucune bibliothèque). Sur la source, le trait est
posé ; on le fait se tracer une fois à son arrivée, la seule chose qui bouge sur la page.
- Entrée aucune · apparition filet tremblé · survol couleur · fond aucun.
- Moteur : `src/components/FiletTremble.astro` (SVG maison, trois ondulations, `pathLength="1"`,
  `vector-effect: non-scaling-stroke`) : `stroke-dashoffset` 1 → 0 en 1,2 s linéaire quand il entre à l'écran
  (`IntersectionObserver`, une fois, classe posée par le script : sans script il est tracé) ; `data-reveal` +
  `data-stagger="60"` sur les rubriques de `services/buvard` ; étiquettes `.btn` de la direction en 0,4 s linéaire.
- Garde : un trait fin, décoratif (`aria-hidden`), jamais plus d'un entre deux blocs ; pas de grain de papier (GOUT § 2) ;
  tient sur iPhone (un trait, rien de calé sur le défilement) ; en mouvement réduit, il est tracé d'emblée.
- Quand : café, salon de thé, épicerie fine, cave, fleuriste, librairie : une page qui doit sentir l'imprimé (carte,
  étiquette) sans décor. Distinct de `filet-qui-se-trace` (trait court de 36 px sous un titre, Wing On Wo) : ici le
  trait sépare les blocs, pleine largeur, ondulé. Calme : oui. Poids : nul (un composant de quelques lignes).

### `plaques-qui-s-empilent`
Labor of Love Studio (`barbotine.md`, [laboroflovestudio.com](https://laboroflovestudio.com/), atelier de céramique, site
Framer, veille du 30 oct 2026, tour 19, style construit `barbotine` ; DOM lu à 1 440 px : 4 blocs `position: sticky` de 3,2
écrans dans « Classes », une plaque de couleur par cours ; Framer Motion, aucune transition CSS lue ; captures à la molette
regardées). La page est joyeuse mais tranquille : deux plaques de couleur se posent sur la photo de l'atelier à l'arrivée,
puis les cours, chacun sur son émail (vert, brique, cobalt, charbon), collent en haut de l'écran et se recouvrent l'un
l'autre comme des carreaux qu'on empile ; les avis glissent à la main dans une rangée aux bords fondus.
- Entrée plaques qui se posent · apparition aucune · survol point qui grossit · fond aucun · défilement collage natif.
- Moteur : `hero/barbotine` en CSS seul (`@keyframes barbotine-pose` translateY -14 px → 0 et opacité, 0,6 s
  `--ease-brand` = cubic-bezier(0.22, 1, 0.36, 1), la seconde plaque 120 ms après, une fois) ; `services/barbotine` : chaque
  `<li>` en `position: sticky; top: calc(6rem + rang × 14px)`, ombre `--shadow-lift` portée vers le haut sur les plaques qui
  montent, sans script ; liens à point (`::before` rond jaune `--email-signal`, `scale(1.6)` en 0,3 s au survol et au focus) ;
  `contact/barbotine` : piste `scroll-snap` native pour les avis, bords en `mask-image` à l'ordinateur.
- Garde : collage seulement à l'ordinateur (≥ 48 rem) sur un écran d'au moins 44 rem de haut (une plaque plus haute que
  l'écran cacherait sa fin) et hors mouvement réduit ; au téléphone, pile simple, texte puis photo. Rien n'est calé image
  par image : le collage est natif (tient sur iPhone, Safari défile hors du fil principal sans saccade). Aucun défilement
  automatique de la rangée d'avis.
- Quand : atelier de poterie, céramiste, atelier créatif, tapissier, encadreur : un client qui vend 3 à 6 cours, stages ou
  prestations, chacun avec une photo, et qui veut un site gai. Distinct de `cartes-empilees` (architecture
  `cartes-empilees-agenda` : chapitres pleine largeur aux couleurs des tokens, étiquette et lignes) par la plaque arrondie
  dans la colonne centrale, le nom géant en serif, les faits à point et la photo à droite ; distinct de
  `chapitres-epingles` (scène épinglée pilotée au défilement). Calme : non (le collage suit le défilement). Poids : nul.

### `aile-qui-s-entrouvre`
Haus Steuermann (`dune.md`, [steuermann.haus](https://steuermann.haus/), veille du 30 oct 2026, tour 19, style construit
`dune` ; DOM lu à 1 440 px : deux déclencheurs `trigger_west` et `trigger_east` (« West », « Ost ») à mi-hauteur, à 50 px du
bord, fixes sur toute la page, et une lisière de la page de l'autre maison qui dépasse du bord gauche ; transitions relevées
`opacity 0.6s linear` ×87, `transform 0.4s cubic-bezier(0.18, 0.08, 0.26, 1.01)` ×3, `transform 0.7s` même courbe ×2,
`transform 0.9s cubic-bezier(0.07, 0.28, 0.22, 1.01)` ×2 ; au téléphone, les deux mots à la verticale contre les bords).
Une page qui ne bouge pas, sauf au bord : les deux maisons attendent de chaque côté de l'écran, on en voit la lisière, et
la photo de l'une glisse quand on approche la souris de son nom.
- Entrée aucune · apparition aucune · survol aile qui glisse du bord · fond aucun.
- Moteur : `hero/dune` en CSS seul : `<nav aria-label="Nos hébergements">` de deux liens `position: fixed; top: 50%` aux
  bords ; la photo de l'aile (cadre `.dune-lavis` 22vw × 60svh) est découpée par `clip-path: inset(0 calc(100% - 2.5vw) 0 0)`
  (lisière) et passe à `inset(0)` au `:hover` et au `:focus-visible` en 0,4 s `--ease-brand` (courbe de la source) ; le nom
  passe à `--on-ink`. Au téléphone (< 64 rem) : `writing-mode: vertical-rl`, pas de photo.
- Garde : aucun contenu ne dépend du survol (chaque hébergement a sa page, nommée aussi dans les services) ; rien n'est calé
  sur le défilement ; seulement si le client a au moins deux services à photo (sinon pas d'ailes) ; en mouvement réduit, la
  transition est coupée.
- Quand : gîte à deux maisons, chambres d'hôtes à deux ou trois chambres, hôtel de quelques chambres, spa à deux espaces :
  un client calme qui a deux lieux à montrer et de belles photos. Distinct de `index-qui-change-la-photo` (la photo change
  au milieu d'une liste) et de `deuxieme-vue-au-survol` (deux vues d'une même carte) : ici la photo vient du bord de l'écran.
  Calme : oui. Poids : nul (CSS seul).

### `escalier-qui-se-rejoint`
TaylorHare Architects (`talus.md`, [taylorhare.com](https://taylorhare.com/), agence d'architectes du Kent et du Danemark, via
siteinspire, veille du 30 oct 2026, tour 19, style construit `talus` ; DOM lu à 1 440 px : GSAP, ScrollTrigger,
ScrollSmoother, Barba ; transitions relevées `opacity 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)` ×15, `opacity 1.2s` même courbe
×5, `width 0.9s` et `height 0.9s` même courbe ×5 sur le bouton rond du menu ; captures à la molette regardées). Une page posée
qui bouge à peine : les photos des réalisations, sur une grille de six colonnes, arrivent en fondu et se rejoignent par les
coins en descendant ; le disque terre cuite du coin bas droit s'ouvre quand on l'approche. On refuse l'ouverture en vidéo au
logo (calque bloquant) et le point olive qui suit la souris.
- Entrée aucune · apparition photo qui rejoint son coin · survol disque qui s'ouvre · fond aucun.
- Moteur : `services/talus` (script `onPage` de quelques lignes) : `IntersectionObserver` (seuil 0,15, marge basse −12 %)
  pose `est-posee` sur la rangée qui arrive ; sous `.talus-pret` (posée par le script seulement), la photo part de
  `translateX(3rem)` (rangée à droite) ou `translateX(-3rem)` (rangée à gauche) et d'opacité 0, et revient en place en
  `--motion-duration` 1 s (transform ; 1,2 s sur la source, ramené au plafond R1) et 0,6 s (opacité), `--ease-brand` = cubic-bezier(0.25, 0.1, 0.25, 1) (la courbe de la
  source, écrite en entier) ; les rangées déjà à l'écran au chargement sont posées d'emblée. `nav/talus` : `.talus-rond`
  fixé au coin bas droit, 3,5 rem, `width` → 16,5 rem en 0,9 s au `:hover` et au `:focus-visible` (seulement sur un écran qui
  survole), le texte « Appeler le … » à l'opacité 1 avec 0,3 s de retard ; au toucher, il appelle. `.btn-ghost` de la
  direction : lien souligné dont le trait passe à 2 px en 0,25 s.
- Garde : transform et opacité en temps, une fois (tient sur iPhone) ; rien n'est calé sur le défilement ; aucune information
  ne dépend du survol (le disque porte une icône de téléphone et un `aria-label`) ; en mouvement réduit, tout est en place.
- Quand : architecte, paysagiste, constructeur de maisons, rénovation de fermes, charpentier : un client calme qui a une belle
  photo par prestation ou par réalisation, et du texte court. Distinct de `index-qui-change-la-photo` (liste fixe, photo qui
  change au survol), de `photo-qui-respire` et de `fondu-sobre` (apparition sur place, sans direction). Calme : oui. Poids : nul.

### `cartes-qui-se-rebattent`
FizioPont (`baume.md`, [fiziopont.hu](https://www.fiziopont.hu/), cabinet de kinésithérapie à Budapest, Webflow showcase,
veille du 30 oct 2026, tour 19, style construit `baume` ; DOM lu à 1 440 px : `div.about-us_services_content` en
`position: sticky` sur 3 écrans, interactions Webflow, transitions relevées `transform 0.5s ease` ×25, `opacity 0.2s ease`
×10, `all 0.7s ease-in-out` ×4 ; le bandeau du nom `div.section-marquee-scroll-row` bouge tout seul ; captures à la molette
regardées). Une page douce et vivante : la photo du soin se pose sur sa plaque sauge, le nom du cabinet défile en deux
couleurs, et les étapes du soin arrivent une à une sur une pile de cartes tournées pendant que le texte reste collé à gauche.
- Entrée photo qui se pose sur sa plaque · apparition carte qui se pose sur la pile · survol carte qui monte · fond nom qui
  défile.
- Moteur : `process/baume` : le bloc fait `n × 45svh + 60svh`, son contenu est `position: sticky; top: 0` sur 100svh (au
  téléphone, seule la pile colle sous la barre : le titre et les portes passent une fois) ; un repère invisible de 45svh par étape, `IntersectionObserver` (`rootMargin: -50% 0px -50% 0px`) : le repère qui croise le milieu
  de l'écran pose les cartes jusqu'à la sienne (classe `est-posee`), et au retour vers le haut la carte repart ; les cartes
  partagent une même case de grille ; non posée : `translate(rang × 6px, 110svh) rotate(angle × 3)`, opacité 0 ; posée :
  `translate(rang × 6px, rang × −6px) rotate(angle)` en 0,7 s `--ease-brand` = cubic-bezier(0.22, 1.2, 0.36, 1) (dépassement
  léger), opacité 0,2 s linéaire. `hero/baume` : classe `baume-depart` posée puis retirée au chargement (deux
  `requestAnimationFrame`), la photo revient de `translate(-1,5rem, 1,5rem)` et la plaque de `translate(1rem, -1rem)` en 0,7 s ;
  le nom en deux couleurs en `data-marquee="45s"` (moteur, `.marquee-track`). `services/baume` : carte qui monte de 4 px au
  survol en 0,2 s linéaire.
- Garde : le pas change par seuils, jamais image par image (GOUT § 4 : Safari défile hors du fil principal) ; un demi-écran
  par étape (pas de scroll-jacking : on peut défiler au travers d'un geste) ; sans script ou en mouvement réduit, rien ne
  colle et les cartes sont posées l'une sous l'autre, tournées et lisibles ; le nom qui défile est décoratif (`aria-hidden`)
  et s'arrête au survol ; un seul feu d'artifice (la pile).
- Quand : kinésithérapeute, ostéopathe, sage-femme, orthophoniste, diététicien, coach : un cabinet qui explique son
  parcours en trois à cinq étapes (bilan, séances, point d'étape). Distinct de `plaques-qui-s-empilent` (plaques pleine
  largeur collées l'une sur l'autre, CSS seul, chaque plaque garde sa photo) et de `cartes-empilees` (chapitres pleine
  largeur) : ici le texte reste fixe et ce sont de petites cartes tournées qui se posent sur un paquet. Calme : non (le bloc
  colle). Poids : nul (CSS et un script de quelques lignes).

### `titre-qui-se-floute-en-sortant`
Holographik Space (`rideau.md`, [holographik.space](https://holographik.space/), veille du 30 oct 2026, tour 19, style
construit `rideau` ; script de la page lu : chaque `.screen .center-title` reçoit `--mag` (flou, jusqu'à 16 px) et `--vid`
(opacité, jusqu'à 0,2) quand le haut de son titre passe au-dessus de 20 % de l'écran, et jusqu'à sa sortie ; CSS relevé :
`.center-title h2 { font-size: clamp(29px, 4.8vw, 90px); font-weight: 500; letter-spacing: -0.022em; line-height: 0.95;
transition: opacity .2s }`, `.screen-link:hover h2 { opacity: .72 }`, `.screen { height: 100svh }`, téléphone
`height: 133.333vw`, voile `.vid-tone` noir à 0,2). Une page faite d'écrans pleins de photo : le titre de chacun reste net
tant qu'on le lit, puis se dissout en montant, comme une lumière qu'on éteint en quittant la salle.
- Entrée aucune · apparition flou en sortant · survol titre qui pâlit · fond aucun.
- Moteur : `hero/rideau`, `services/rideau`, `proof/rideau` : `[data-rideau-flou]` sous `@supports (animation-timeline:
  view())` et `prefers-reduced-motion: no-preference` : `animation: rideau-flou linear both; animation-timeline: view();
  animation-range: exit 10% exit 100%` (`to { filter: blur(16px); opacity: 0.2 }`) ; aucun script. `.rideau-ecran:hover`
  → titre à 0,72 en 0,2 s `--ease-brand` (la courbe `ease` de la source écrite en clair).
- Garde : seulement à la sortie (on ne lit jamais un titre flou) ; animation liée à la vue gérée par le navigateur (hors du
  fil principal quand il le peut, aucun calcul au défilement) ; un navigateur qui ne la connaît pas montre des titres nets ;
  le flou porte sur un titre de quelques mots, pas sur une photo (léger sur iPhone).
- Quand : salle de réception, lieu événementiel, barbier, tatoueur, studio photo : un client qui a une photo forte par
  prestation et veut une page sombre et spectaculaire. Distinct de `sortie-du-noir` (la photo sort du noir à l'entrée) et
  de `portes-qui-s-eclairent` (portes qui s'éclairent au survol). Calme : non (suit le défilement). Poids : nul (CSS seul).

### `cartouche-qui-se-pose`
Hotel Gilbert (`cartouche.md`, [hotel-gilbert.at](https://www.hotel-gilbert.at/), veille du 30 oct 2026, tour 19, style
construit `cartouche` ; transitions relevées dans le CSS calculé : `transform 0.3s ease` ×46, `transform 0.4s ease` ×18,
`color 0.4s cubic-bezier(0.4, 0, 0.2, 1)` ×8, `border 0.3s`, `background 0.3s` ; liens encadrés à longue flèche au trait ;
aucune bibliothèque d'animation, `data-speed` ×1). Une page de papeterie qui ne bouge presque pas : les plaques posées sur
le bas des photos arrivent en se posant, les flèches des liens s'allongent sous la souris.
- Entrée aucune · apparition plaque qui se pose · survol flèche qui s'allonge · fond aucun.
- Moteur : `services/cartouche` : `[data-cartouche]` reçoit `.cartouche-attend` (opacité 0, `translate: 0 24px`) puis
  `.cartouche-pose` à l'entrée dans l'écran (IntersectionObserver, seuil 0,25, une fois, script `onPage`), transition
  0,4 s `--ease-brand` = cubic-bezier(0.4, 0, 0.2, 1) (courbe de la source) ; `.cartouche-lien::after` et `.btn-ghost::after`
  de la direction : trait de 1 px qui passe de 2,25 à 3,25 rem en 0,3 s.
- Garde : sans script ou en mouvement réduit, les cartouches sont en place ; une seule apparition par cartouche, aucune au
  premier écran ; rien n'est calé sur le défilement (transform et opacité en temps : tient sur iPhone).
- Quand : hôtel, chambres d'hôtes, barbier, coiffeur, institut, fleuriste, pâtissier : un client calme avec une photo par
  prestation et l'envie d'un site qui a de l'esprit. Distinct de `photo-qui-se-pose` (la photo se pose) et de
  `legende-qui-se-leve` (légende sous la photo) : ici la plaque à filet se pose à cheval sur le bord de la photo. Calme :
  oui. Poids : léger (quelques lignes de script).

## Complément transversal : transitions de page

Estudio Niksen (`view-transition` natives), Délice (Swup), Relais Rossàr (Barba). Pas un profil : il se combine avec
tous. `site.transitions: true` (ClientRouter, fondu 0,3 s, nav et hero persistants) dès que le site a plusieurs pages
(une par service, GOUT § 0). Jamais un rideau.

## Écartés (vus, pas repris)

- Couches qui suivent la souris (Agrumea Farm) : rien au téléphone, qui est le premier écran (GOUT § 1).
- Nom de section qui se range dans l'en-tête (De Groene Afslag) : beau, mais demande un en-tête sur mesure ; à faire
  dans un bloc si un client s'y prête.
- Rideau de transition, écran de chargement « 100 % » (Maison Boursier, Odyssée) : refusés (GOUT § 2).
