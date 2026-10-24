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
