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
