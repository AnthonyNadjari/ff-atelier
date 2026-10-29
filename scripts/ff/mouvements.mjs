// Profils de MOUVEMENT : des façons distinctes de faire bouger une page, chacune relevée sur un vrai site
// (fiche de démontage ou veille d'animation), avec les attributs du moteur qui la réalisent. Catalogue lisible :
// docs/veille/styles/MOUVEMENTS.md (mêmes ids, testé par tests/melanger.test.mjs).
//
// Pourquoi (fondateur, 18 oct 2026, sur L'Épi d'Or b, c, d) : « beaucoup plus de pluralité : animations, même des
// vidéos en fond ». L'atome `mouvement` ne portait que des durées et une courbe : trois mélanges différents bougeaient
// pareil (fondu au défilement, même bouton). Chaque atome `mouvement` du registre nomme désormais son `profil`, et
// `ff melanger` tire le profil avec l'atome : entrée du premier écran, apparition au défilement, survol, fond.
//
// Module PUR (aucune lecture de fichier) : le catalogue et les contraintes qui en découlent (`refusProfil`).

/**
 * Un profil :
 * - `entree` : comment le premier écran arrive ; `apparition` : ce qui se passe au défilement ; `survol` : la réponse
 *   au geste ; `fond` : ce qui bouge derrière le contenu. Deux pistes d'un même client ne partagent jamais `entree` ni
 *   `apparition` (docs/GOUT.md § 4) ; la valeur « aucune » ne compte pas comme partagée.
 * - `regime` / `defilement` : mêmes valeurs que l'atome (ATOMES.md) ; `calme` : permis pour un client dont
 *   l'aiguillage dit « calme » (motion: 'subtle', rien qui suit le défilement).
 * - `poids` : `nul` (CSS seul), `leger` (moteur sans dépendance), `moyen` (GSAP chargé à la demande), `lourd` (vidéo ou
 *   séquence d'images : des mégaoctets).
 * - `exige` : `video` (une vraie vidéo du client, ou `ff animer` / `ff video` prévu et déclaré par `--video`),
 *   `sequence` (une vidéo, ou une photo du client de 1 920 px pour `ff sequence-photo`).
 * - `attributs` : ce que le moteur sait faire (docs/ANIMATIONS.md) ; `manque` : ce qu'il faut écrire dans un bloc sur
 *   mesure, faute d'attribut.
 */
export const PROFILS_MOUVEMENT = {
  'fondu-sobre': {
    nom: 'Fondu sobre', sources: ['studenterkilden'],
    entree: 'aucune', apparition: 'fondu', survol: 'couleur', fond: 'aucun',
    regime: 'calme', defilement: 'apparitions', calme: true, poids: 'leger', motion: 'subtle',
    attributs: ['data-reveal (opacité seule)', 'data-accordion ou <details> natif', '--ease-brand osmo'],
    manque: null, exige: {},
  },
  'ressort-au-survol': {
    nom: 'Ressort au survol', sources: ['relaisrossar'],
    entree: 'aucune', apparition: 'montee-lente', survol: 'ressort', fond: 'aucun',
    regime: 'calme', defilement: 'apparitions', calme: true, poids: 'nul', motion: 'subtle',
    attributs: ['data-reveal="up" sur un groupe par section', '--ease-ressort (linear(), global.css) sur les :hover'],
    manque: null, exige: {},
  },
  'glisse-a-la-main': {
    nom: 'Glisse à la main', sources: ['coutumes', 'meyers'],
    entree: 'aucune', apparition: 'aucune', survol: 'couleur', fond: 'aucun',
    regime: 'calme', defilement: 'apparitions', calme: true, poids: 'nul', motion: 'subtle',
    attributs: ['piste scroll-snap native (overflow-x: auto, scroll-snap-type: x mandatory, touch-action: pan-y)', 'data-drag-grid en rich'],
    manque: null, exige: {},
  },
  'plans-au-chargement': {
    nom: 'Plans au chargement', sources: ['meyers', 'coquelicots'],
    entree: 'plans', apparition: 'fondu', survol: 'couleur', fond: 'aucun',
    regime: 'calme', defilement: 'apparitions', calme: true, poids: 'nul', motion: 'subtle',
    attributs: ['data-entree="plans" sur le premier écran, enfants data-plan="fond" (image qui se resserre, lent) et data-plan="texte" (sec)'],
    manque: null, exige: {},
  },
  'photo-qui-respire': {
    nom: 'Photo qui respire', sources: ['theirnibs'],
    entree: 'derive', apparition: 'aucune', survol: 'couleur', fond: 'photo-animee',
    regime: 'calme', defilement: 'aucun', calme: true, poids: 'nul', motion: 'subtle',
    attributs: ['data-derive sur le cadre d\'UNE photo du client (premier écran ou bloc signature), bouton pause du moteur'],
    manque: null, exige: {},
  },
  'video-de-fond': {
    nom: 'Vidéo de fond', sources: ['lesaintgeorges', 'artisansdegeneve'],
    entree: 'video', apparition: 'aucune', survol: 'couleur', fond: 'video',
    regime: 'calme', defilement: 'apparitions', calme: true, poids: 'lourd', motion: 'subtle',
    attributs: ['hero video (images.heroVideo + images.heroVideoPoster) ou data-video-fond sur une grande carte : poster obligatoire, pause du moteur, lecture seulement à l\'écran'],
    manque: null, exige: { video: true },
  },
  'sequence-au-defilement': {
    nom: 'Séquence au défilement', sources: ['trionn'],
    entree: 'aucune', apparition: 'sequence', survol: 'couleur', fond: 'sequence',
    regime: 'vivant', defilement: 'suit-le-defilement', calme: false, poids: 'lourd', motion: 'rich',
    attributs: ['data-frames + data-pin (100 % par étape + 100 %), data-frames-lerp', 'ff sequence (vidéo) ou ff sequence-photo (photo fixe de 1 920 px)'],
    manque: null, exige: { sequence: true },
  },
  'chapitres-epingles': {
    nom: 'Chapitres épinglés', sources: ['latabledejoakim', 'caffegilli'],
    entree: 'aucune', apparition: 'epinglage', survol: 'couleur', fond: 'aucun',
    regime: 'vivant', defilement: 'suit-le-defilement', calme: false, poids: 'moyen', motion: 'rich',
    attributs: ['data-pin + data-pin-step (ordinateur ; au téléphone rien d\'épinglé, comme La Table de Joakim)'],
    manque: 'fond de section qui change de couleur à chaque chapitre : CSS du bloc sur mesure sur [data-pin-step].is-active', exige: {},
  },
  'piste-horizontale': {
    nom: 'Piste horizontale', sources: ['odysseeclinic', 'caffegilli'],
    entree: 'aucune', apparition: 'piste', survol: 'couleur', fond: 'aucun',
    regime: 'vivant', defilement: 'suit-le-defilement', calme: false, poids: 'moyen', motion: 'rich',
    attributs: ['data-horizontal + .h-track (ordinateur ≥ 64rem) ; au téléphone, la même piste glisse au doigt'],
    manque: 'compteur « 2 / 6 » qui suit la piste (Odyssée) : bloc sur mesure', exige: {},
  },
  'texte-qui-se-remplit': {
    nom: 'Texte qui se remplit', sources: ['caffegilli', 'coutumes'],
    entree: 'aucune', apparition: 'remplissage', survol: 'couleur', fond: 'aucun',
    regime: 'vivant', defilement: 'suit-le-defilement', calme: false, poids: 'moyen', motion: 'rich',
    attributs: ['data-text-fill sur UNE phrase du client (sa règle, sa promesse), jamais sur un titre de section (GOUT § 4)'],
    manque: null, exige: {},
  },
  'parallaxe-et-aimant': {
    nom: 'Parallaxe et aimant', sources: ['monarque'],
    entree: 'aucune', apparition: 'parallaxe', survol: 'aimant', fond: 'aucun',
    regime: 'vivant', defilement: 'suit-le-defilement', calme: false, poids: 'moyen', motion: 'rich',
    attributs: ['data-parallax="0.2" sur un portrait ou un objet', 'data-magnetic="0.3" sur le bouton principal (pointeur fin)'],
    manque: null, exige: {},
  },
  'rebond-et-inclinaison': {
    nom: 'Rebond et inclinaison', sources: ['pizza-amici'],
    entree: 'aucune', apparition: 'inclinaison', survol: 'rebond', fond: 'aucun',
    regime: 'vivant', defilement: 'suit-le-defilement', calme: false, poids: 'moyen', motion: 'rich',
    attributs: ['data-scrub="rotate=-6,y=24" sur des objets du métier (tickets, étiquettes)', '--ease-brand back-out sur les boutons (0,35 s)'],
    manque: null, exige: {},
  },
  'bandes-croisees': {
    nom: 'Bandes croisées', sources: ['paputmenorca'],
    entree: 'aucune', apparition: 'aucune', survol: 'couleur', fond: 'aucun',
    regime: 'vivant', defilement: 'aucun', calme: false, poids: 'leger', motion: 'subtle',
    attributs: ['deux data-marquee, la seconde avec data-marquee-sens="inverse", texte plein et texte en contour'],
    manque: 'inclinaison des deux bandes (rotate en CSS du bloc sur mesure)', exige: {},
  },
  'objet-qui-tourne': {
    nom: 'Objet qui tourne', sources: ['cafebinocle', 'toutbienpils'],
    entree: 'aucune', apparition: 'fondu', survol: 'couleur', fond: 'aucun',
    regime: 'vivant', defilement: 'apparitions', calme: false, poids: 'nul', motion: 'subtle',
    attributs: ['data-reveal'],
    manque: 'le sceau qui tourne en 30 s ou l\'objet qui se balance : @keyframes dans le bloc sur mesure (objet du métier, jamais un titre), coupé par prefers-reduced-motion', exige: {},
  },
  'chiffres-qui-comptent': {
    nom: 'Chiffres qui comptent', sources: ['framer-lintel', 'ksarchitectes'],
    entree: 'compteur', apparition: 'fondu', survol: 'couleur', fond: 'aucun',
    regime: 'calme', defilement: 'apparitions', calme: true, poids: 'leger', motion: 'subtle',
    attributs: ['data-counter ou data-counter-flip (rouleaux de chiffres) sur un VRAI chiffre du brief (nombre d’avis Google, fournées par jour, kilos), jamais « X ans d\'expérience » calculé'],
    manque: null, exige: { chiffre: true },
  },
  'mots-qui-glissent': {
    nom: 'Mots qui glissent', sources: ['carne'],
    entree: 'aucune', apparition: 'glissement', survol: 'couleur', fond: 'aucun',
    regime: 'vivant', defilement: 'suit-le-defilement', calme: false, poids: 'moyen', motion: 'rich',
    attributs: ['data-scrub="x=-30" puis data-scrub="x=30" sur deux lignes d\'un mot géant du client (son nom, un produit), sens opposés'],
    manque: null, exige: {},
  },
  'ombre-au-survol': {
    nom: 'Ombre au survol', sources: ['joandso'],
    entree: 'aucune', apparition: 'aucune', survol: 'ombre', fond: 'aucun',
    regime: 'calme', defilement: 'aucun', calme: true, poids: 'nul', motion: 'subtle',
    attributs: ['box-shadow 0,4-0,6 s ease sur les cartes (photo + aplat), dans @media (hover: hover) and (pointer: fine), :active au toucher'],
    manque: 'la règle :hover de la carte (CSS de la section ou du bloc), jamais transition: all', exige: {},
  },
  'sortie-du-noir': {
    nom: 'Sortie du noir', sources: ['maaemo'],
    entree: 'sortie-du-noir', apparition: 'aucune', survol: 'couleur', fond: 'aucun',
    regime: 'calme', defilement: 'aucun', calme: true, poids: 'nul', motion: 'subtle',
    attributs: ['animation CSS du premier écran : fond noir, la photo passe de opacity 0 à 1 en 1,5 s ease-out, le texte suit à +1,2 s en 0,8 s ; rien sous prefers-reduced-motion'],
    manque: 'les deux @keyframes du premier écran (photo puis texte) dans la section ou le bloc ; pas d\'attribut du moteur, et jamais un écran de chargement', exige: {},
  },
  'portes-qui-s-eclairent': {
    nom: 'Portes qui s\'éclairent', sources: ['kadeau'],
    entree: 'aucune', apparition: 'aucune', survol: 'devoile', fond: 'aucun',
    regime: 'calme', defilement: 'aucun', calme: true, poids: 'nul', motion: 'subtle',
    attributs: ['deux (ou trois) portes en photo plein cadre côte à côte, voilées (filter: blur + voile de couleur) ; la porte survolée ou touchée (:hover, :focus-visible, :active) se dévoile nette en 0,8 s cubic-bezier(0.61, 1, 0.88, 1)'],
    manque: 'la règle de survol des portes (bloc sur mesure ou variante de portes) ; au téléphone, les portes s\'empilent et sont nettes d\'office', exige: {},
  },
  'assiettes-qui-se-posent': {
    nom: 'Assiettes qui se posent', sources: ['kricket'],
    entree: 'aucune', apparition: 'pose-par-etapes', survol: 'couleur', fond: 'aucun',
    regime: 'vivant', defilement: 'suit-le-defilement', calme: false, poids: 'leger', motion: 'rich',
    attributs: ['data-pin sur la scène et data-pin-step par photo (étapes, jamais de calage image par image) : à chaque étape, une photo du plat vue de dessus se pose sur la précédente, légèrement tournée (transform + opacity, 0,5 s ease)'],
    manque: 'la scène des plats (bloc sur mesure) : photos vues de dessus, détourées ou sur nappe, sans bord blanc (pas de polaroid, GOUT § 2) ; empilées sans épinglage au téléphone étroit et en mouvement réduit', exige: {},
  },
  'nom-qui-s-efface': {
    nom: 'Nom qui s\'efface sur le motif', sources: ['ikoyi'],
    entree: 'fond-puis-motif', apparition: 'monte-sur-le-motif', survol: 'couleur', fond: 'motif-fixe',
    regime: 'calme', defilement: 'suit-le-defilement', calme: false, poids: 'nul', motion: 'subtle',
    attributs: ['couche position: fixed (jamais background-attachment: fixed, ignoré par Safari iOS) portant le motif de la direction ; le nom au centre du premier écran perd son opacité au défilement (animation-timeline: scroll(), repli : nom immobile) ; les photos pleine largeur montent par-dessus le motif'],
    manque: 'le motif (SVG de la direction ou du client, jamais un grain) et la règle d\'opacité du nom dans le premier écran', exige: {},
  },
  'soulignement-qui-se-dessine': {
    nom: 'Soulignement qui se dessine', sources: ['hisafranko'],
    entree: 'aucune', apparition: 'aucune', survol: 'soulignement', fond: 'aucun',
    regime: 'calme', defilement: 'aucun', calme: true, poids: 'nul', motion: 'subtle',
    attributs: ['liens et boutons-texte soulignés par un dégradé de currentColor dont background-size passe de 0 à 100 % en 0,5 s cubic-bezier(.455,.03,.515,.955), dans @media (hover: hover) and (pointer: fine) ; au toucher le soulignement est déjà tracé'],
    manque: 'la règle CSS du lien (section ou direction), jamais transition: all', exige: {},
  },
  'fil-qui-mene': {
    nom: 'Fil qui mène', sources: ['kilchoman'],
    entree: 'aucune', apparition: 'fil', survol: 'couleur', fond: 'aucun',
    regime: 'calme', defilement: 'apparitions', calme: true, poids: 'nul', motion: 'subtle',
    attributs: ['un trait fin (SVG, 1 px, couleur d\'accent) part du bouton du premier écran et serpente jusqu\'au lieu du client dans la section suivante (carte dessinée, adresse) ; sur la source il est fixe, il se lit au défilement ; en mouvement réduit il reste fixe'],
    manque: 'le tracé SVG du fil et la carte ou le plan d\'arrivée (bloc sur mesure), jamais un tracé calé image par image sur iPhone', exige: {},
  },
  'nom-en-lettres-geantes': {
    nom: 'Nom en lettres géantes', sources: ['lune'],
    entree: 'aucune', apparition: 'parallaxe-lettre', survol: 'couleur', fond: 'aucun',
    regime: 'vivant', defilement: 'suit-le-defilement', calme: false, poids: 'leger', motion: 'rich',
    attributs: ['une lettre du nom du client par section (L, U, N, E chez Lune), capitale géante au trait fin (SVG ou texte en -webkit-text-stroke, couleur de bordure) posée derrière les photos, avec data-parallax="0.12" (translation simple, jamais de calage image par image) ; immobile en mouvement réduit'],
    manque: 'la lettre de fond par section (règle de la direction ou bloc sur mesure) : le nom doit avoir au moins autant de lettres que la page a de sections, sinon une lettre par grande section', exige: {},
  },
  'fond-qui-change-de-teinte': {
    nom: 'Fond qui change de teinte', sources: ['attica'],
    entree: 'aucune', apparition: 'teinte-du-fond', survol: 'souligne', fond: 'teinte-par-section',
    regime: 'vivant', defilement: 'suit-le-defilement', calme: false, poids: 'nul', motion: 'rich',
    attributs: ['chaque section annonce sa teinte (data-teinte="#7fb89b", couleur prise dans la palette ou dans la photo de la section) ; quand elle passe au milieu de l\'écran, la couleur de fond du document glisse vers cette teinte en 1 s cubic-bezier(.25,1,.5,1) (IntersectionObserver, transition sur background-color, jamais calée image par image) ; en mouvement réduit, changement immédiat'],
    manque: 'le déclencheur data-teinte (petit script de section ou de direction) et la règle de contraste : le texte de chaque section doit tenir sur sa teinte (4,5) ; jamais plus de 4 teintes ni un aplat vif (garde de beauté)', exige: {},
  },
  'photos-a-plusieurs-vitesses': {
    nom: 'Photos à plusieurs vitesses', sources: ['brae'],
    entree: 'aucune', apparition: 'parallaxe-decalee', survol: 'souligne', fond: 'aucun',
    regime: 'vivant', defilement: 'suit-le-defilement', calme: false, poids: 'leger', motion: 'rich',
    attributs: ['photos posées en quinconce dans une grille éditoriale, chacune avec sa propre data-parallax entre 0.09 et 0.12 à l\'ordinateur (0.07 à 0.09 au téléphone) : elles partent décalées de 110 à 180 px et rejoignent leur place chacune à son rythme (translation simple, tient sur iPhone) ; immobiles en mouvement réduit'],
    manque: 'des vitesses différentes d\'une photo à l\'autre (une valeur par photo, jamais la même deux fois de suite) et le décalage de départ borné à la marge de la section, pour que la photo ne recouvre jamais le texte', exige: {},
  },
  'photos-qui-flottent': {
    nom: 'Photos qui flottent', sources: ['nishiyama'],
    entree: 'aucune', apparition: 'fondu', survol: 'couleur', fond: 'flottement',
    regime: 'vivant', defilement: 'apparitions', calme: false, poids: 'nul', motion: 'rich',
    attributs: ['photos détourées ou en masque souple (galets) qui flottent de 0 à 10 px en hauteur, animation CSS translateY en boucle, ease-out, durées décalées 1,5, 2,5 et 3 s pour que jamais deux ne bougent ensemble (transform seul : tient sur iPhone) ; titres de section en fondu 0,9 s (data-reveal opacité) ; arrêtées en mouvement réduit'],
    manque: 'la règle de flottement (keyframes et trois durées) dans la direction ou le bloc ; seulement sur un objet du métier découpé (tissu, pièce, produit), jamais sur un portrait ni un cadre rectangulaire', exige: {},
  },
  'deuxieme-vue-au-survol': {
    nom: 'Deuxième vue au survol', sources: ['poterieravel'],
    entree: 'aucune', apparition: 'aucune', survol: 'seconde-vue', fond: 'aucun',
    regime: 'calme', defilement: 'aucun', calme: true, poids: 'leger', motion: 'subtle',
    attributs: ['carte produit ou service à deux photos superposées du même objet : au survol ou au focus (:hover dans @media (hover: hover) and (pointer: fine), :focus-visible), la première passe de opacity 1 à 0 et la seconde de 0 à 1 en fondu enchaîné de 0,5 s ease-in-out ; retour identique à la sortie ; au toucher la première vue reste'],
    manque: 'la variante de carte à deux photos (un champ « seconde photo » par service ou produit) ; aucune information ne dépend de la seconde vue', exige: {},
  },
  'legende-fixe-qui-change': {
    nom: 'Légende fixe qui change', sources: ['studiomondine'],
    entree: 'aucune', apparition: 'legende-fixe', survol: 'souligne', fond: 'aucun',
    regime: 'calme', defilement: 'apparitions', calme: true, poids: 'leger', motion: 'subtle',
    attributs: ['photos bord à bord rangées par projet (diptyques ou une photo par écran) ; le nom du projet en cours est posé au centre de l\'écran en position fixe, en blanc sur les photos, et change d\'un coup quand le projet suivant passe le milieu de l\'écran (IntersectionObserver, une seule légende visible à la fois, opacité seule, rien ne glisse : tient sur iPhone) ; aucune légende sur le premier écran ni sur le pied ; en mouvement réduit, même chose (aucun mouvement)'],
    manque: 'le déclencheur (une légende par groupe de photos, data-legende sur le groupe, petit script de bloc) et la garde de lisibilité : la légende est blanche sur photo, seulement sur des photos assez sombres au centre (contraste mesuré), sinon un voile sous la légende', exige: {},
  },
  'photo-qui-s-approche': {
    nom: 'Photo qui s\'approche', sources: ['mariongraux'],
    entree: 'aucune', apparition: 'aucune', survol: 'approche', fond: 'aucun',
    regime: 'calme', defilement: 'aucun', calme: true, poids: 'nul', motion: 'subtle',
    attributs: ['photos carrées dans un cadre à overflow: hidden ; au survol de la carte, la photo grandit de 1 à 1,03 en 0,3 s ease (transform seul), retour identique à la sortie ; seulement sous @media (any-pointer: fine) and (prefers-reduced-motion: no-preference) : au toucher et en mouvement réduit, rien ne bouge'],
    manque: 'la règle de survol des cartes dans la direction (jamais plus de 1,05 : au-delà la pièce est rognée ; le cadre garde ses angles et sa taille)', exige: {},
  },
  'legende-qui-se-leve': {
    nom: 'Légende qui se lève', sources: ['couteauxdeva'],
    entree: 'aucune', apparition: 'aucune', survol: 'legende', fond: 'aucun',
    regime: 'calme', defilement: 'aucun', calme: true, poids: 'nul', motion: 'subtle',
    attributs: ['tuiles photo bord à bord, le nom de la pièce posé sur la photo ; au survol (:hover dans @media (hover: hover) and (pointer: fine), et :focus-visible), la photo perd son contraste renforcé (filter: contrast(1.15) vers 1) pendant que le nom passe de 70 % à 100 % d\'opacité et monte de 7 px, 0,3 s ease, retour identique ; au toucher et en mouvement réduit, le nom est déjà à 100 % et rien ne bouge'],
    manque: 'la règle de survol des tuiles dans la direction ou le bloc ; le nom reste lisible sans survol (contraste mesuré à 70 % compris, sinon il part de 100 %)', exige: {},
  },
  'volet-a-l-entree': {
    nom: 'Volet à l\'entrée', sources: ['bourkestreet'],
    entree: 'aucune', apparition: 'volet', survol: 'couleur', fond: 'aucun',
    regime: 'calme', defilement: 'apparitions', calme: true, poids: 'leger', motion: 'subtle',
    attributs: ['une ou deux photos de la page (jamais toutes) se dévoilent une seule fois par un volet clip-path de 1 s, cubic-bezier(0.57, 0.18, 0, 0.92), à leur entrée à l\'écran : data-reveal="clip" ou "wipe" du moteur ; aucun zoom ensuite ; visibles d\'emblée en mouvement réduit'],
    manque: 'rien dans le moteur ; la garde : deux photos au plus par page, jamais sur un titre, jamais suivi d\'un zoom (GOUT § 2 refuse « volet puis zoom à chaque section »)', exige: {},
  },
  'filet-qui-se-trace': {
    nom: 'Filet qui se trace', sources: ['wingonwoand'],
    entree: 'aucune', apparition: 'filet', survol: 'couleur', fond: 'aucun',
    regime: 'calme', defilement: 'apparitions', calme: true, poids: 'leger', motion: 'subtle',
    attributs: ['sous chaque titre de bloc, un filet court (3 px, couleur du texte, 36 px de long, 7 px sous le titre) se trace de gauche à droite de 0 à sa longueur en 1,2 s cubic-bezier(0.13, 0.88, 0.62, 1) après 0,7 s, une seule fois, quand le titre entre à l\'écran : data-draw du moteur sur un <span> sous le h2 ; le titre lui-même ne bouge pas ; en mouvement réduit, le filet est déjà tracé'],
    manque: 'le filet sous le h2 dans la section ou la direction (un élément, pas un ::after, pour que data-draw le prenne) ; jamais plus long que le premier mot du titre, jamais sur le h1', exige: {},
  },
  'citation-en-fondu': {
    nom: 'Citation en fondu', sources: ['corapearl'],
    entree: 'aucune', apparition: 'fondu', survol: 'fondu-enchaine', fond: 'aucun',
    regime: 'calme', defilement: 'apparitions', calme: true, poids: 'leger', motion: 'subtle',
    attributs: ['premier écran (ou bloc des avis) en diptyque bord à bord : une photo d\'un côté, une citation de l\'autre (un avis recopié ou une ligne de presse, avec sa source), empilés en couches ; flèches Précédent / Suivant (boutons, étiquetés) et glisser au doigt (touch-action: pan-y) font passer au couple suivant : la photo ET la citation se fondent ensemble, opacité seule, 1,5 s ease (la source : opacity 2s ease, Slick fade) ; jamais de rotation automatique (GOUT § 4) ; les blocs suivants apparaissent une fois en fondu (data-reveal, opacité seule) ; en mouvement réduit, bascule sans fondu'],
    manque: 'la pile des couples photo / citation et ses deux boutons (bloc sur mesure ou variante, script court) ; au moins deux vraies citations du brief (avis recopiés ou presse, jamais inventées) et une photo par citation, sinon ne pas tirer ce profil', exige: {},
  },
  'silhouettes-en-fond': {
    nom: 'Silhouettes en fond', sources: ['pastamansi'],
    entree: 'photo-qui-monte', apparition: 'aucune', survol: 'couleur', fond: 'silhouettes-qui-tournent',
    regime: 'vivant', defilement: 'aucun', calme: false, poids: 'nul', motion: 'subtle',
    attributs: ['derrière le contenu, une silhouette géante d\'une chose du métier (une pâte, un pain, une feuille, une clé ; SVG en aplat de l\'accent 2, 440 à 460 px, jamais une photo) par hauteur d\'écran, à demi hors du bord ou dans la marge, alternée gauche / droite, qui tourne sur elle-même en 85 à 115 s par tour, linear, une sur deux dans l\'autre sens (@keyframes rotate, transform seul : tient sur iPhone) ; la première photo du premier écran monte de 60 px en fondu, 1,4 s cubic-bezier(0.23, 1, 0.32, 1) après 1,2 s ; arrêtées et posées en mouvement réduit'],
    manque: 'les silhouettes SVG dessinées d\'après le métier du client (deux à quatre formes, jamais le logo ni un titre) et leur règle de rotation dans la direction ou le bloc ; toujours derrière le texte (z-index), jamais sous une ligne de texte courant (contraste mesuré sur l\'aplat), pause hors écran (animation-play-state par IntersectionObserver)', exige: {},
  },
  'bloc-qui-s-avance': {
    nom: 'Bloc qui s\'avance', sources: ['barkumiko'],
    entree: 'montee', apparition: 'avancee', survol: 'couleur', fond: 'aucun',
    regime: 'vivant', defilement: 'apparitions', calme: false, poids: 'leger', motion: 'rich',
    attributs: ['le h1 et sa phrase montent de 26 px en apparaissant, 0,9 s, la phrase 150 ms après (data-stagger sur le bloc du premier écran) ; chaque bloc de texte monte en apparaissant (opacité 1,2 s cubic-bezier(0.22, 1, 0.36, 1), transform 2 s cubic-bezier(0.18, 0.6, 0.18, 1) : data-reveal="up") ; à l\'ordinateur seulement, le bloc de texte qui arrive au milieu de l\'écran s\'avance (scale 1 → 1,06 en 0,6 s cubic-bezier(0.22, 1, 0.36, 1), origine au centre) et revient à 1 quand il quitte cette zone : une classe posée par un IntersectionObserver (rootMargin -40 % en haut et en bas), une transition en temps, rien de calé sur --p ; au téléphone et en mouvement réduit, la montée seule (la source ne fait pas s\'avancer au téléphone)'],
    manque: 'l\'avancée du bloc au centre de l\'écran (attribut à écrire dans le moteur, ex. data-avance, ou script court de bloc) ; deux ou trois blocs de texte courts par page au plus (une phrase d\'accueil, une adresse), jamais une photo ni une grille, jamais au-delà de 1,06', exige: {},
  },
  'bandeau-des-adresses': {
    nom: 'Bandeau des adresses', sources: ['redclay'],
    entree: 'aucune', apparition: 'aucune', survol: 'couleur', fond: 'bandeau-lent',
    regime: 'vivant', defilement: 'aucun', calme: false, poids: 'leger', motion: 'subtle',
    attributs: ['une seule bande pleine largeur, sur l\'aplat de l\'accent, entre deux traits épais ondulés (SVG, couleur du texte) : les vrais noms des lieux où l\'on trouve le client (restaurants, épiceries, marchés, communes de la tournée), chacun suivi de sa ville, en capitales condensées 64 à 110 px, défilent très lentement de droite à gauche (data-marquee="100s", linear, une boucle sur toute la longueur) ; pause au survol et au focus ; arrêtée en mouvement réduit (la bande devient une liste qu\'on fait glisser) ; le reste de la page change en 0,3 s ease'],
    manque: 'les deux traits ondulés au-dessus et au-dessous de la bande (SVG du bloc) ; au moins quatre vrais lieux du brief (revendeurs, tables qui servent le produit, marchés, communes desservies), jamais inventés ni des logos de presse ; une seule bande par page', exige: {},
  },
  'annonce-qui-defile': {
    nom: 'Annonce qui défile', sources: ['rochechouart'],
    entree: 'aucune', apparition: 'aucune', survol: 'couleur', fond: 'annonce-qui-defile',
    regime: 'vivant', defilement: 'aucun', calme: false, poids: 'nul', motion: 'subtle',
    attributs: ['juste sous le premier écran, une bande fine (une ligne de texte courant ou de petites capitales, entre deux filets de --line) : l\'annonce du client (champ annonce, Annonce.astro, fenêtre du / au) défile de droite à gauche, data-marquee="20s" (linear, contenu dupliqué) ; la nav transparente sur la photo prend l\'aplat de l\'encre dès qu\'on défile (.is-scrolled après 40 px, background-color 0,3 s ease) ; rien d\'autre n\'entre ni n\'apparaît'],
    manque: 'la variante défilante d\'Annonce.astro (bande fine entre deux filets), pause au survol et au focus (WCAG 2.2.2), arrêtée et lisible d\'un bloc en mouvement réduit ; une seule phrase vraie du brief (fermeture, saison, offre datée), jamais un slogan ni des mots-clés ; aucune bande si le client n\'a pas d\'annonce', exige: {},
  },
  'nom-en-marge': {
    nom: 'Nom en marge', sources: ['cosme'],
    entree: 'aucune', apparition: 'aucune', survol: 'souligne', fond: 'nom-fixe',
    regime: 'calme', defilement: 'aucun', calme: true, poids: 'nul', motion: 'subtle',
    attributs: ['le nom du client, en très grand et à la verticale (writing-mode: vertical-rl ou rotation de 90°, encre du texte, toute la hauteur de l\'écran moins l\'en-tête), posé en position fixe dans une colonne de marge à droite (143 px à l\'ordinateur, environ 75 px au téléphone) ; toute la page défile à sa gauche, rien d\'autre ne bouge (aucune entrée, aucune apparition) ; menu en panneau qui arrive de la gauche (transform 0,4 s ease) ; liens soulignés 0,1 s ; identique en mouvement réduit (rien n\'est animé)'],
    manque: 'la colonne de marge et le nom vertical en texte réel (jamais une image : lisible, traduisible), dans un bloc de coquille ou une section sur mesure ; garde : un nom court (12 lettres au plus) qui tient sur la hauteur d\'un téléphone sans descendre sous 56 px de corps, jamais une phrase ni le métier ; la colonne du nom est retirée de la largeur du conteneur (aucun texte dessous) ; au téléphone, le nom peut être coupé en bas de l\'écran, jamais le texte de la page', exige: {},
  },
  'nom-en-exclusion': {
    nom: 'Nom en exclusion', sources: ['experimentalcc'],
    entree: 'aucune', apparition: 'aucune', survol: 'couleur', fond: 'nom-en-exclusion',
    regime: 'vivant', defilement: 'suit-le-defilement', calme: false, poids: 'leger', motion: 'subtle',
    attributs: ['data-parallax (0,35 environ) sur le nom pour qu\'il descende au tiers de la vitesse du défilement, sur environ 450 px à l\'ordinateur et 175 px au téléphone, puis s\'arrête ; un mix-blend-mode: exclusion (ou difference) sur le nom et sur le fond de la barre de navigation, encre blanche sur fond noir : le nom s\'inverse là où il passe sur la photo verticale du premier écran (portrait 446 x 610 px centré, 256 x 500 au téléphone) puis sur les blocs qui défilent dessous ; rien n\'entre au chargement ; un deuxième intitulé arrive en opacité 0,8 s ease au premier cran'],
    manque: 'le nom du client en texte réel (jamais une image) posé en position fixe par-dessus la photo verticale du premier écran, avec mix-blend-mode: exclusion, dans un bloc de coquille ou une section sur mesure ; garde : seulement sur un fond noir ou blanc pur (sur un fond teinté, l\'exclusion donne une couleur au hasard), une seule chose en exclusion avec la barre de navigation, le métier et la ville restent lisibles en texte normal dans le h1 ou juste dessous (GOUT § 0) ; en mouvement réduit le nom reste fixe à sa place, sans parallaxe ; contraste vérifié sur la photo et sur le fond', exige: {},
  },
  'photo-qui-se-pose': {
    nom: 'Photo qui se pose', sources: ['paradero'],
    entree: 'aucune', apparition: 'photo-qui-se-pose', survol: 'couleur', fond: 'aucun',
    regime: 'vivant', defilement: 'suit-le-defilement', calme: false, poids: 'leger', motion: 'rich',
    attributs: ['data-scrub="scale=1.04" sur la photo d\'un grand panneau (cadre à overflow: hidden) : elle entre agrandie à 1,04 et se pose à 1 pendant que le haut du panneau monte du bas de l\'écran à son tiers haut (environ 600 px de défilement, décélération), avec data-parallax très faible (0,03 : 30 à 48 px de dérive sur tout le passage) ; le texte posé sur la photo (surtitre, titre, phrase, bouton) arrive en data-reveal="up" + data-stagger="100" quand le panneau atteint le bas de l\'écran : montée de 24 px et fondu en 0,8 s ease-out, une ligne toutes les 0,1 s ; rien n\'entre au chargement'],
    manque: 'une amplitude de data-reveal="up" réglable (le moteur monte de 12 px, la source de 24) ; garde : deux grands panneaux photo par page au plus (jamais à chaque section : photo qui zoome au défilement partout = signe IA, GOUT § 2), jamais avec un volet ni un masque, échelle de départ 1,06 au plus ; texte sur la photo seulement sur un voile mesuré (contraste AA) ; en mouvement réduit la photo est posée à 1 et le texte visible d\'emblée', exige: {},
  },
  'enseigne-qui-se-resserre': {
    nom: 'Enseigne qui se resserre', sources: ['bouteille'],
    entree: 'enseigne', apparition: 'titre-en-surplomb', survol: 'couleur', fond: 'aucun',
    regime: 'vivant', defilement: 'suit-le-defilement', calme: false, poids: 'moyen', motion: 'rich',
    attributs: ['Hero bouteille : au chargement, le NOM du commerce posé sur la photo de salle resserre son interlettrage de 0,34 em à 0,08 em en 1,6 s cubic-bezier(.25,.1,.25,1) (opacité 0 -> 1 au premier tiers) pendant que la photo se pose (scale 1,06 et -1,5 % -> 1, 2,4 s cubic-bezier(.2,.6,.2,1)), CSS seul, une fois (data-entree-jouee) ; Services bouteille : le titre géant de chaque prestation porte data-parallax="0.5" et glisse plus lentement que la page sur le coin haut gauche de sa photo (translation seule, tenable sur iPhone), la photo arrive en data-reveal (opacité seule) ; boutons 0,25 s ease (régime sec)'],
    manque: null, exige: {},
  },
  'film-au-clic': {
    nom: 'Page posée, film au clic', sources: ['lin'],
    entree: 'aucune', apparition: 'aucune', survol: 'filets-qui-s-emplissent', fond: 'film-au-clic',
    regime: 'calme', defilement: 'aucun', calme: true, poids: 'nul', motion: 'subtle',
    attributs: ['Hero lin : rien n\'entre au chargement ni au défilement (la source, fraher.co, ne bouge pas : opacité 1 et transform none mesurés tous les 100 px) ; si le client a une vidéo (images.heroVideo + poster), la bande photo pleine largeur montre le poster et un lien « Voir le film » : la vidéo (preload="none") ne se charge et ne joue qu\'au toucher, avec ses commandes natives (data-film, data-film-lancer ; lecture déclenchée par le geste, permise sur iPhone même en économie d\'énergie) ; Services lin et direction lin : les liens entre deux filets (.btn-ghost) s\'emplissent d\'encre au survol en 0,1 s linéaire (mesuré sur la source : background-color 0,1 s linear) ; la barre de nav se resserre au premier cran (nav minimal, .is-scrolled)'],
    manque: null, exige: {},
  },
  'bandes-au-pinceau': {
    nom: 'Bandes au pinceau', sources: ['pinceau'],
    entree: 'enseigne-qui-s-allume', apparition: 'bord-qui-se-brosse', survol: 'aplat-qui-change', fond: 'aucun',
    regime: 'calme', defilement: 'apparitions', calme: true, poids: 'leger', motion: 'subtle',
    attributs: ['Hero pinceau : l\'enseigne (h1 puis la ligne métier à ville, 0,2 s plus tard) s\'allume en fondu lent, opacité seule, 1,2 s ease, CSS seul (mesuré sur la source : fadeIn 1,25 s) ; BordPinceau (Hero et Services pinceau) : la frontière entre deux bandes de couleur est un coup de pinceau dessiné, immobile, dont les éclats et traits détachés se brossent de gauche à droite à leur entrée à l\'écran (data-reveal="wipe" du moteur, clip-path, 0,6 s, une fois) ; la plaque des horaires se pose sur la bande terracotta (data-reveal="up") ; boutons qui changent d\'aplat en 0,15 s linéaire (régime sec) ; les titres ne bougent pas'],
    manque: null, exige: {},
  },
  'cellules-qui-s-ouvrent': {
    nom: 'Cellules qui s\'ouvrent', sources: ['calque'],
    entree: 'aucune', apparition: 'aucune', survol: 'cellule-qui-s-eclaire', fond: 'aucun',
    regime: 'calme', defilement: 'aucun', calme: true, poids: 'nul', motion: 'subtle',
    attributs: ['Services calque : les étapes ou prestations sont des cellules de plan empilées (filet 1 px, carré plein de 5 px à chaque angle) ; un seul <details name> ouvert à la fois, natif (accordéon exclusif sans script, tient sur iPhone), la première ouverte ; la cellule ouverte montre SA photo dans sa moitié droite, qui entre en fondu (opacité 0 → 1, 0,5 s linéaire, mesuré sur tekt.com.au : opacity 0.5s linear), le texte reste immobile ; Proof calque : la liste des réalisations en cellules posée sur la photo pleine largeur, la cellule touchée change la photo en fondu croisé 0,5 s (script onPage, sans script la première photo) ; au survol une cellule s\'éclaire (fond qui passe à la surface en 0,5 s ease) ; rien n\'apparaît ni ne bouge au défilement ; en mouvement réduit, aucun fondu'],
    manque: null, exige: {},
  },
  'chapitre-qui-s-ouvre': {
    nom: 'Chapitre qui s\'ouvre', sources: ['chapitre'],
    entree: 'nom-qui-monte', apparition: 'regle-de-chapitre', survol: 'couleur', fond: 'aucun',
    regime: 'calme', defilement: 'apparitions', calme: true, poids: 'leger', motion: 'subtle',
    attributs: ['Hero chapitre : le nom géant en capitales fines monte de sous sa ligne au chargement (translateY 100 % → 0 dans un cadre overflow hidden, 1 s cubic-bezier(0.25, 1, 0.5, 1), mesuré sur 23gradicoffee.com : transform 1s cubic-bezier(0.25, 1, 0.5, 1) ×44), CSS seul, une fois ; Chapitre (composant de chaque section) : la règle de chapitre (étiquette à gauche, numéro 001 à droite, deux traits verticaux au quart et aux trois quarts) se trace de gauche à droite à son entrée à l\'écran (data-reveal="wipe" du moteur sur la règle : clip-path, une fois) ; Services chapitre : le produit posé sur son nom géant, un à la fois, dans une piste scroll-snap native (flèches qui font défiler d\'une case, smooth natif ; au doigt sur iPhone), liste à points de tous les services dessous ; liens et flèches qui changent de couleur en 0,3 s ; en mouvement réduit, le nom est déjà en place'],
    manque: null, exige: {},
  },
  'index-qui-change-la-photo': {
    nom: 'Index qui change la photo', sources: ['enduit'],
    entree: 'aucune', apparition: 'nom-en-tranches', survol: 'ligne-qui-montre-sa-photo', fond: 'aucun',
    regime: 'calme', defilement: 'apparitions', calme: true, poids: 'nul', motion: 'subtle',
    attributs: ['Services enduit : l\'index des prestations (une ligne par service sur un filet, numéro, nom, prix) avec, au milieu de la liste et par-dessus, une photo verticale 4:5 ; au survol ou au focus clavier d\'une ligne, sa photo remplace la précédente en fondu (opacité 0,4 s cubic-bezier(0.25, 0.46, 0.45, 0.94), mesuré sur bcgbuildingdesign.com.au : transform 0.4s et opacity 0.2-0.3s), la ligne passe à l\'encre pleine et son filet se trace de gauche à droite (scaleX 0 -> 1, 0,8 s) ; au téléphone rien ne se survole : chaque ligne sous sa photo, aucun script ; About enduit : le nom du client en lettres géantes sur la bande brune monte lettre par lettre de sous sa ligne quand la bande arrive à l\'écran (translateY 105 % -> 0 dans un cadre overflow hidden, 0,8 s, 40 ms entre deux lettres, une fois, IntersectionObserver) ; liens sur filet dont la flèche avance de 4 px en 0,4 s ; rien ne suit le défilement ; en mouvement réduit, la photo change sans fondu et le nom est en place'],
    manque: null, exige: {},
  },
  'nom-qui-defile-au-pied': {
    nom: 'Nom qui défile au pied', sources: ['ocre'],
    entree: 'aucune', apparition: 'aucune', survol: 'souligne-qui-se-colore', fond: 'nom-qui-defile',
    regime: 'vivant', defilement: 'aucun', calme: false, poids: 'nul', motion: 'subtle',
    attributs: ['Contact ocre : au pied de la page, une seule bande pleine largeur sur l\'encre rouille (--ink) où le NOM du client, en capitales géométriques géantes (9vw, 8,5rem au plus) répété, défile lentement de droite à gauche (data-marquee="40s" du moteur, linéaire, contenu dupliqué ; mesuré sur lrnce.com : animation move-background 40s linear infinite), arrêtée au survol (règle [data-marquee]:hover du moteur) et posée en mouvement réduit ; décorative (aria-hidden), le nom est lu ailleurs ; tout le reste de la page est immobile : photos en diptyques, lettre, colonnes ; les liens soulignés et les boutons prennent le rouille en 0,3 s ease (mesuré : color, background, border 0,3 s ease)'],
    manque: null, exige: {},
  },
};

export const IDS_PROFILS = Object.keys(PROFILS_MOUVEMENT);

/** Complément transversal (pas un profil : il se combine avec tous) : transitions de page natives. */
export const TRANSITIONS_DE_PAGE = {
  sources: ['estudioniksen', 'delice', 'relaisrossar'],
  attributs: ['site.transitions: true (ClientRouter, fondu 0,3 s, nav et hero persistants)'],
  quand: 'site à plusieurs pages (une par service), quel que soit le profil ; jamais un rideau',
};

/**
 * Pure : le profil convient-il au client ? `client` = profilClient de melanger.mjs (+ `video` : 'client' | 'animer' |
 * 'banque' | null, `avis` : nombre d'avis Google, `chiffres` : autres vrais chiffres du brief). Renvoie la raison du
 * refus, ou null.
 */
export function refusProfil(id, client = {}) {
  const p = PROFILS_MOUVEMENT[id];
  if (!p) return `profil de mouvement inconnu : ${id}`;
  if (client.mouvement === 'calme' && !p.calme) return `client « calme » : profil ${id} (${p.regime}, ${p.defilement})`;
  // Fond vidéo : seulement si le client a une vraie vidéo, ou si ff animer (sa photo animée) ou ff video (vidéo de
  // banque, ambiance créditée, jamais présentée comme la sienne) est prévu. Jamais par défaut.
  if (p.exige.video && !client.video) return `${id} demande une vidéo du client (ou --video animer|banque si ff animer / ff video est prévu)`;
  if (p.exige.sequence && !client.video && (client.largeurMax || 0) < 1920) return `${id} demande une vidéo ou une photo du client de 1 920 px (ff sequence-photo)`;
  // Un vrai chiffre : le nombre d'avis Google du client, ou des chiffres du brief déclarés (`chiffres`).
  if (p.exige.chiffre && !(client.avis > 0 || client.chiffres > 0)) return `${id} demande un vrai chiffre du brief (aucun chiffre inventé)`;
  return null;
}

/** Pure : deux profils de pistes sœurs qui se ressemblent (même entrée ou même apparition, « aucune » exceptée). */
export function profilsTropProches(a, b) {
  const A = PROFILS_MOUVEMENT[a], B = PROFILS_MOUVEMENT[b];
  if (!A || !B) return null;
  if (a === b) return `même profil de mouvement (${a})`;
  if (A.entree !== 'aucune' && A.entree === B.entree) return `même entrée du premier écran (${A.entree})`;
  if (A.apparition !== 'aucune' && A.apparition === B.apparition) return `même apparition au défilement (${A.apparition})`;
  return null;
}

/**
 * Pure : les consignes à imprimer avec un mélange (attributs, ce qui manque, précautions vidéo). `client.video` dit
 * d'où vient la vidéo, pour ne jamais présenter une vidéo de banque comme celle du client.
 */
export function consignesProfil(id, client = {}) {
  const p = PROFILS_MOUVEMENT[id];
  if (!p) return [];
  const out = [`mouvement : profil ${id} (${p.nom}) : ${p.attributs.join(' ; ')}`];
  if (p.manque) out.push(`  à écrire dans le bloc sur mesure : ${p.manque}`);
  if (p.fond === 'video') {
    out.push('  vidéo : poster obligatoire (images.heroVideoPoster ou images.hero), qui se suffit à lui-même : iPhone en économie d\'énergie bloque tout autoplay, jamais de contenu essentiel dans la vidéo');
    if (client.video === 'banque') out.push('  vidéo de banque (ff video) : ambiance seulement, créditée sur /credits, jamais présentée comme celle du client');
    if (client.video === 'animer') out.push('  photo animée (ff animer) : data-ia="1" et mention visible sur la section (AI Act art. 50)');
  }
  if (p.fond === 'sequence') out.push('  séquence : data-frames-poster obligatoire ; sans vidéo, ff sequence-photo sur une photo du client de 1 920 px');
  return out;
}
