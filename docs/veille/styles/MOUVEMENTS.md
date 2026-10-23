# Profils de mouvement : dix-sept façons de faire bouger une page, relevées sur de vrais sites

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

## Complément transversal : transitions de page

Estudio Niksen (`view-transition` natives), Délice (Swup), Relais Rossàr (Barba). Pas un profil : il se combine avec
tous. `site.transitions: true` (ClientRouter, fondu 0,3 s, nav et hero persistants) dès que le site a plusieurs pages
(une par service, GOUT § 0). Jamais un rideau.

## Écartés (vus, pas repris)

- Couches qui suivent la souris (Agrumea Farm) : rien au téléphone, qui est le premier écran (GOUT § 1).
- Nom de section qui se range dans l'en-tête (De Groene Afslag) : beau, mais demande un en-tête sur mesure ; à faire
  dans un bloc si un client s'y prête.
- Rideau de transition, écran de chargement « 100 % » (Maison Boursier, Odyssée) : refusés (GOUT § 2).
