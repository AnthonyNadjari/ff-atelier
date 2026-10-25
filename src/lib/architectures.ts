/**
 * Registre des ARCHITECTURES (docs/veille/architectures/INDEX.md, docs/GOUT.md § 0 « le déroulé change d'un site à
 * l'autre ») : une architecture = un site entier tiré d'un vrai site (coquille, ordre des blocs de l'accueil, place du
 * contact, gabarit des pages intérieures). `layout.architecture` (src/lib/schema.ts) l'applique : chaque réglage de
 * `layout` que le site NE PRÉCISE PAS prend la valeur de l'architecture (coquille, nav, hero, pied, ordre des
 * sections, tiroir de contact, gabarit de page service…) ; un réglage écrit dans site.config.ts ou look.json gagne
 * toujours (completerLayout).
 *
 * Le SOCLE de docs/GOUT.md § 0 reste dû dans chaque architecture, même si la source ne l'a pas : téléphone visible
 * sans défiler, métier + ville au premier écran, avis s'il y en a, photos du client, plusieurs pages. Chaque coquille
 * le porte elle-même (voir son en-tête).
 *
 * `requis` dit les DONNÉES sans lesquelles l'architecture tourne à vide (« Convient à » des fiches) ;
 * donneesManquantes() les vérifie sur un site, sans rien deviner. Choisir une architecture sur les données du client,
 * jamais deux fois de suite (INDEX.md, règle d'usage).
 *
 * Module pur (seuls des `import type`, effacés par le type-stripping) : importé par schema.ts (defineSite applique
 * completerLayout), re-exporté par site.ts, testé par tests/architectures.test.mjs via scripts/ff/ts-loader.mjs.
 */

/** Une section du layout, comme dans `layout.sections`. */
export interface SectionArchi {
  type: 'services' | 'about' | 'proof' | 'zones' | 'process' | 'faq' | 'cta' | 'contact';
  variant: string;
}

/** Réglages de `layout` posés par l'architecture (seulement quand le site ne les précise pas). */
export interface LayoutArchi {
  shell: string;
  nav: string;
  hero: string;
  footer: string;
  sections: SectionArchi[];
  contactDrawer?: boolean;
  actionBar?: boolean;
  servicePage?: string;
  pageAPropos?: boolean;
}

/**
 * Une donnée exigée. `mesure` nomme ce que donneesManquantes() compte sur le site :
 *  - photos          : photos du client (images.hero, services[].image, proof.gallery, about.portrait, réalisations) ;
 *  - services        : nombre de services (min / max) ;
 *  - servicesPhoto   : services qui ont une photo (services[].image) ;
 *  - realisations    : réalisations (realisations[], sinon proof.gallery) ;
 *  - types           : types distincts de réalisations (`kind`) ;
 *  - horaires        : lignes de contact.hours ;
 *  - rue             : contact.address.street (un lieu où l'on vient) ;
 *  - lignesPrix      : services qui ont des lignes à prix (services[].lignes) ;
 *  - pasUrgence      : contact.emergency24h faux (architecture où l'on n'appelle pas en urgence) ;
 *  - histoire        : paragraphes de about.story (du vrai texte, un écran par paragraphe) ;
 *  - agenda          : rendez-vous datés (agenda[]) ; les dates passées tombent au build (src/lib/agenda.ts) ;
 *  - produits        : produits de la gamme (produits[], chacun avec sa photo détourée ; src/lib/produits.ts) ;
 *  - espaces         : espaces du lieu qu'on visite (about.espaces[] : nom, phrase, photo et couleur optionnelles) ;
 *  - lieux           : adresses complètes (lieux[] avec une rue ET des horaires ; src/lib/lieux.ts, lieuxComplets) ;
 *  - saisons         : saisons qui ont au moins 2 activités (services[].saison ; src/lib/sorties.ts, saisonsCompletes) ;
 *  - sorties         : sorties datées et cotées (sorties[] : période obligatoire, durée, niveau, prix si donnés) ;
 *  - programme       : entrées de programme aux jours distincts (services[].programme avec au moins une ligne ;
 *                      src/lib/ardoise.ts, entreesDistinctes) ;
 *  - etapes          : étapes de tournée complètes (tournee[] avec jour, commune et heures ; src/lib/tournee.ts) ;
 *  - artistes        : artistes avec une photo et au moins un style (artistes[] ; src/lib/artistes.ts, artistesComplets) ;
 *  - fetes           : fêtes datées avec au moins une ligne (fetes[] ; src/lib/fetes.ts, fetesCompletes).
 */
export interface Exigence {
  mesure: 'photos' | 'services' | 'servicesPhoto' | 'realisations' | 'types' | 'horaires' | 'rue' | 'lignesPrix' | 'pasUrgence' | 'histoire' | 'agenda' | 'produits' | 'espaces' | 'lieux' | 'saisons' | 'sorties' | 'programme' | 'etapes' | 'artistes' | 'fetes';
  min?: number;
  max?: number;
  /** Ce qui manque, dit au studio en une phrase. */
  libelle: string;
}

export interface Architecture {
  id: string;
  /** Le modèle en une phrase. */
  modele: string;
  /** Fiches sources (docs/veille/architectures/), la principale d'abord ; une seconde source si elle a servi. */
  sources: { fiche: string; site: string }[];
  layout: LayoutArchi;
  requis: Exigence[];
  /** À quels clients (selon leurs données). */
  convientA: string;
}

export const ARCHITECTURE_IDS = [
  'carte-de-visite',
  'accueil-portes',
  'index-projets',
  'lieu-fixe',
  'panneaux-tranche',
  'livre-ecrans',
  'cartes-empilees-agenda',
  'carnet-horizontal',
  'gamme-vitrine',
  'cadre-couleur',
  'scenes-epinglees',
  'pages-adresses',
  'saisons-sorties',
  'ardoise-du-jour',
  'tournee-semaine',
  'artistes-residents',
  'calendrier-fetes',
] as const;
export type ArchitectureId = (typeof ARCHITECTURE_IDS)[number];

export const ARCHITECTURES: Record<ArchitectureId, Architecture> = {
  'carte-de-visite': {
    id: 'carte-de-visite',
    modele:
      "Un seul écran sans défilement : la photo du client posée en carte dans une marge, le salut du moment en grand, et dessus le panneau utile (adresse, appeler, écrire, horaires du jour, avis, pages des services).",
    sources: [{ fiche: 'docs/veille/architectures/nowa.md', site: 'nowa.restaurant' }],
    layout: {
      shell: 'carte',
      // nav et hero ne sont pas rendus par la coquille `carte` (la carte EST le premier écran) ; `fullbleed` garde le
      // préchargement de la photo à la bonne taille (Base.astro, heroSizesFor : 100vw).
      nav: 'minimal',
      hero: 'fullbleed',
      footer: 'minimal',
      sections: [],
      contactDrawer: true,
      actionBar: false,
    },
    requis: [
      { mesure: 'photos', min: 1, libelle: 'une très bonne photo du client (images.hero de préférence) : la carte est une photo' },
      { mesure: 'services', max: 6, libelle: 'peu de services (6 au plus) : le panneau les liste tous' },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : rien n'y est répété à chaque écran" },
    ],
    convientA:
      "Peu de contenu et une très bonne photo : restaurant ou bar qui vit sur Instagram, commerce qui ouvre, artisan d'art qui veut être trouvé et appelé, deuxième adresse d'une maison connue. Pas pour un client aux nombreux services.",
  },
  'accueil-portes': {
    id: 'accueil-portes',
    modele:
      "L'accueil est un sommaire : sous la photo, une grande porte par activité (diptyque photo + aplat, toute la tuile mène à sa page), puis les avis ; chaque porte ouvre une page courte bâtie sur la même grammaire (photo, nom, labels, phrase, photos en grille, bouton, questions de la page, adresse).",
    sources: [
      { fiche: 'docs/veille/architectures/bricourt.md', site: 'maisons-de-bricourt.com' },
      { fiche: 'docs/veille/architectures/carrefour-portes.md', site: 'eatcabalar.com' },
    ],
    layout: {
      shell: 'flow',
      nav: 'split',
      hero: 'stacked',
      footer: 'columns',
      sections: [
        { type: 'services', variant: 'portes' },
        { type: 'proof', variant: 'google' },
      ],
      contactDrawer: true,
      servicePage: 'porte',
    },
    requis: [
      { mesure: 'services', min: 3, max: 6, libelle: '3 à 6 activités ou adresses distinctes (services)' },
      { mesure: 'servicesPhoto', min: 3, libelle: 'une photo par porte (services[].image), au moins 3' },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : l'accueil aiguille, il ne dépanne pas" },
    ],
    convientA:
      'Client aux activités ou adresses distinctes, chacune avec ses photos (services[].images pour sa page) : hôtel-restaurant, domaine (gîtes, salle, cave), boulangerie à plusieurs boutiques, menuisier cuisines / escaliers / dressings, lieu avec horaires et deux activités séparables. Pas pour un client à prestation unique ni sans photos par activité.',
  },
  'index-projets': {
    id: 'index-projets',
    modele:
      "L'accueil est l'index des réalisations, réglable par le visiteur (filtre par type, défilé ou grille) avec en marge l'identité, le téléphone et un compteur réel ; chaque réalisation a sa page (série de photos, lieu, type, texte) ; l'histoire et le contact tiennent sur une seule page À propos.",
    sources: [
      { fiche: 'docs/veille/architectures/mathilde-de-chiara.md', site: 'mathildedechiara.com' },
      { fiche: 'docs/veille/architectures/projets-fiches.md', site: 'houseofhoney.com' },
    ],
    layout: {
      shell: 'index-projets',
      // La nav sert aux pages intérieures (réalisation, À propos, services) ; l'accueil n'a que la marge. Pied en
      // colonnes (House of Honey : les pages, les adresses et leur téléphone).
      nav: 'minimal',
      hero: 'typographic',
      footer: 'columns',
      // Aucune section empilée : la note Google (ou un avis court) est dans la marge, en haut (socle GOUT § 0).
      sections: [],
      contactDrawer: true,
      pageAPropos: true,
    },
    requis: [
      { mesure: 'realisations', min: 15, libelle: '15 réalisations au moins (realisations[], une page chacune ; à défaut proof.gallery)' },
      { mesure: 'types', min: 3, max: 5, libelle: 'des réalisations classables en 3 à 5 types (kind)' },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : on vient voir le travail, pas appeler vite" },
    ],
    convientA:
      "Client dont le travail se montre en photos nombreuses et classables : architecte d'intérieur, agenceur, menuisier-ébéniste, carreleur, paysagiste, ferronnier, photographe, tapissier, fleuriste événementiel. Pas pour qui a peu de photos ou doit être appelé vite.",
  },
  'lieu-fixe': {
    id: 'lieu-fixe',
    modele:
      "Écran partagé : le lieu (photo du client, état ouvert ou fermé, ligne du jour, adresse, téléphone) reste fixé à droite pendant toute la visite ; à gauche défilent la carte d'accueil (h1 et une porte par intention), la carte ou les tarifs en accordéons à prix pointillés, les avis, l'histoire. Au téléphone, l'accueil puis le lieu en tête.",
    sources: [{ fiche: 'docs/veille/architectures/le-petit-bleu.md', site: 'lepetitbleucafe.com' }],
    layout: {
      shell: 'lieu-fixe',
      // nav : seulement au téléphone (à l'ordinateur, la coquille met un en-tête court dans la colonne de gauche) ;
      // hero : non rendu, garde le préchargement de la photo du lieu à la demi-largeur (heroSizesFor('split')).
      nav: 'bar',
      hero: 'split',
      footer: 'minimal',
      sections: [
        { type: 'services', variant: 'carte-prix' },
        { type: 'proof', variant: 'testimonials' },
        { type: 'about', variant: 'story' },
      ],
      contactDrawer: true,
      // Une page par rubrique de la carte (socle : plusieurs pages), nommée dans la nav ; ses lignes à prix y sont.
      servicePage: 'porte',
    },
    requis: [
      { mesure: 'rue', min: 1, libelle: "une adresse où l'on vient (contact.address.street) : le lieu est l'information n° 1" },
      { mesure: 'horaires', min: 1, libelle: "des horaires (contact.hours) : l'état ouvert ou fermé reste à l'écran" },
      { mesure: 'photos', min: 1, libelle: 'une bonne photo du lieu (images.hero de préférence)' },
      { mesure: 'lignesPrix', min: 1, libelle: 'une carte ou des tarifs détaillés (services[].lignes avec prix)' },
    ],
    convientA:
      "Commerce où l'on vient, avec une carte ou des tarifs détaillés et de bonnes photos du lieu : café, crêperie, boulangerie, salon de thé, coiffeur, barbier, institut, fromagerie, caviste. Pas pour un artisan qui se déplace chez le client.",
  },
  'panneaux-tranche': {
    id: 'panneaux-tranche',
    modele:
      "Le site se range comme des chemises : à l'ordinateur, des panneaux pleine hauteur posés côte à côte glissent vers la gauche quand on descend (couverture photo, l'atelier, une réalisation par panneau en photo verticale, le métier, une grande photo, les avis sur l'aplat d'accent), une tranche fixe à droite porte le nom et la progression, un rail à gauche le téléphone et le menu ; une page par réalisation, l'histoire et le contact sur la page À propos. Au téléphone, les panneaux s'empilent.",
    sources: [{ fiche: 'docs/veille/architectures/studio-rhe.md', site: 'studiorhe.com' }],
    layout: {
      shell: 'panneaux',
      // nav : seulement au téléphone (barre avec le menu des pages, le « Menu » du rail de la source) ; à
      // l'ordinateur, le rail et la tranche la remplacent. hero : non rendu, préchargement de la photo de couverture
      // à la demi-largeur (heroSizesFor('split')).
      nav: 'bar',
      hero: 'split',
      footer: 'minimal',
      // Aucune section empilée : chaque panneau a un rôle ; les sections écrites dans le layout descendent sous la bande.
      sections: [],
      contactDrawer: true,
      actionBar: false,
      pageAPropos: true,
    },
    requis: [
      { mesure: 'realisations', min: 6, libelle: '6 réalisations au moins (realisations[], un panneau et une page chacune)' },
      { mesure: 'photos', min: 8, libelle: 'des photos fortes, verticales de préférence (8 au moins) : chaque panneau est une photo' },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : on feuillette un dossier, on n'appelle pas vite" },
    ],
    convientA:
      "Client avec peu de texte et des photos fortes en série (6 réalisations et plus) : architecte, constructeur de maisons, menuisier-agenceur, cuisiniste, tapissier, photographe. Pas pour l'urgence ni pour qui doit être appelé dès l'arrivée.",
  },
  'livre-ecrans': {
    id: 'livre-ecrans',
    modele:
      "Des pages longues composées comme un livre : une couverture photo (h1, métier et ville, téléphone), puis un écran par idée (un paragraphe de 50 signes de large et une photo portrait décalée, un avis en citation sur un aplat, deux photos décalées sans texte, les activités en grands titres à filets vers leurs pages), et un écran de contact à la fin de chaque page ; chaque page d'activité est bâtie de la même façon.",
    sources: [{ fiche: 'docs/veille/architectures/du-pain-et-des-idees.md', site: 'dupainetdesidees.com' }],
    layout: {
      shell: 'livre',
      // nav burger : nom en haut, « Menu » qui ouvre un plein écran aux liens en grand (la nav de la source).
      nav: 'burger',
      hero: 'fullbleed',
      footer: 'columns',
      sections: [
        { type: 'about', variant: 'ecran-texte-photo' },
        { type: 'proof', variant: 'citations' },
        { type: 'services', variant: 'liste-a-filets' },
        { type: 'contact', variant: 'ecran' },
      ],
      contactDrawer: false,
      actionBar: false,
      servicePage: 'livre',
    },
    requis: [
      { mesure: 'photos', min: 10, libelle: 'au moins 10 belles photos (portrait de préférence) : un écran sur deux est une photo' },
      { mesure: 'histoire', min: 2, libelle: 'une histoire en vrai texte (about.story, 2 paragraphes au moins) : un écran par paragraphe' },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : le site se lit lentement" },
    ],
    convientA:
      "Artisan avec une histoire, un lieu, de belles photos verticales et du vrai texte : boulanger, pâtissier, chocolatier, maison ancienne, artisan d'art, restaurant d'auteur, client à plusieurs adresses ou activités (boutique, table, atelier). Pas pour l'urgence ni pour un client sans texte.",
  },
  'cartes-empilees-agenda': {
    id: 'cartes-empilees-agenda',
    modele:
      "Le lieu qui publie : un en-tête où la porte « Agenda » reste toujours en haut, la photo du lieu avec le nom en étiquettes, puis les activités en cartes de couleur pleine largeur qui se recouvrent au défilement (une couleur par activité, chacune vers sa page), puis le site devient un journal : les prochains rendez-vous en cartes datées (page /agenda filtrable), les avis, les nouvelles.",
    sources: [{ fiche: 'docs/veille/architectures/groene-afslag.md', site: 'degroeneafslag.nl' }],
    layout: {
      shell: 'cartes-agenda',
      // nav : sert aux pages intérieures (services, agenda, conseils) ; l'accueil a son propre en-tête à porte Agenda.
      nav: 'bar',
      hero: 'fullbleed',
      footer: 'columns',
      sections: [
        { type: 'services', variant: 'cartes-empilees' },
        { type: 'proof', variant: 'testimonials' },
      ],
      contactDrawer: true,
      actionBar: false,
    },
    requis: [
      { mesure: 'services', min: 3, max: 6, libelle: '3 à 6 activités très différentes (services) : une carte de couleur chacune' },
      { mesure: 'agenda', min: 3, libelle: 'des rendez-vous datés à venir (agenda[], 3 au moins) : stages, marchés, dégustations, soirées' },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : on vient pour un rendez-vous" },
    ],
    convientA:
      "Client qui organise des choses datées et les met à jour : ferme avec marchés et visites, librairie, caviste avec dégustations, atelier avec stages et cours, salle de réception, restaurant avec soirées, tiers-lieu. Pas pour qui ne publiera rien.",
  },
  'carnet-horizontal': {
    id: 'carnet-horizontal',
    modele:
      "L'accueil se feuillette de gauche à droite comme un carnet : à l'ordinateur, une bande de chapitres de largeurs inégales, posés en couches (présentation et photo, une réalisation étiquetée, la liste des réalisations, la méthode, les avis, les artisans partenaires, le contact en bout de bande) glisse quand on descend, un rail fixe à gauche porte le nom, le téléphone et le menu ; une page par réalisation et une page qui les liste. Au téléphone, la bande devient une page verticale.",
    sources: [{ fiche: 'docs/veille/architectures/gingko.md', site: 'gingko.pro' }],
    layout: {
      shell: 'carnet',
      // nav : seulement au téléphone (logo et menu) ; à l'ordinateur, le rail. hero : non rendu, préchargement de la
      // photo de présentation à la demi-largeur (heroSizesFor('split')).
      nav: 'bar',
      hero: 'split',
      footer: 'minimal',
      sections: [],
      contactDrawer: true,
      actionBar: false,
    },
    requis: [
      { mesure: 'realisations', min: 6, libelle: '6 réalisations nommées au moins (realisations[] avec lieu), une page chacune' },
      { mesure: 'photos', min: 6, libelle: 'des photos de chantiers (6 au moins) : chaque chapitre en pose une' },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : on feuillette, on n'appelle pas vite" },
    ],
    convientA:
      "Métier de conception avec des réalisations nommées (6 et plus, avec lieu) et, idéalement, des artisans partenaires à citer : paysagiste, architecte d'intérieur, menuisier-agenceur, ferronnier d'art, céramiste. Pas pour l'urgence ni pour qui n'a qu'une poignée de photos.",
  },
  'gamme-vitrine': {
    id: 'gamme-vitrine',
    modele:
      "Catalogue d'abord : l'accueil tient en un écran et n'est rien d'autre que la gamme, les produits détourés sur une piste horizontale qu'on fait glisser à la main (chacun pivote un peu selon sa place, chacun ouvre sa page), sous une barre fixe (nom, téléphone, bouton Menu qui ouvre le reste du site en plein écran) avec le h1, le métier et la ville, la note Google ; chaque produit a sa page (titre géant, le produit posé par-dessus les lettres, fiche technique à filets, photos d'ambiance en piste aimantée, les autres produits), la liste /produits les regroupe par famille ; l'histoire et le contact sur la page À propos.",
    sources: [{ fiche: 'docs/veille/architectures/agrumea.md', site: 'agrumeafarm.it' }],
    layout: {
      shell: 'vitrine',
      // nav : seulement les pages intérieures (produits, activités, À propos) ; l'accueil a sa barre fixe à bouton Menu.
      // hero : non rendu (la gamme EST le premier écran) ; fullbleed garde le préchargement de images.hero s'il y en a une.
      nav: 'minimal',
      hero: 'fullbleed',
      footer: 'columns',
      // Aucune section sur l'accueil (un écran) : les sections écrites dans le layout du site descendent sous la vitrine.
      sections: [],
      contactDrawer: true,
      actionBar: false,
      pageAPropos: true,
    },
    requis: [
      { mesure: 'produits', min: 6, max: 20, libelle: '6 à 20 produits avec une photo détourée chacun (produits[]) : la gamme est l’accueil' },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : on regarde la gamme, on n'appelle pas vite" },
    ],
    convientA:
      "Producteur ou artisan à gamme courte et photogénique (6 à 20 produits) avec de bonnes photos détourables : confiturier, savonnier, brasseur, chocolatier, torréfacteur, coutelier, céramiste, boulangerie à gamme fixe. Pas pour un métier de service (plombier, couvreur), ni l'urgence, ni sans photos de produits.",
  },
  'cadre-couleur': {
    id: 'cadre-couleur',
    modele:
      "Tout le site posé dans un cadre de couleur fixe (une marge de 24 px tout autour, 16 au téléphone) : le premier écran reste collé au fond (h1 géant et métier à ville sur le papier, téléphone et note Google à côté, la photo du client dessous), le contenu monte dessus comme une feuille avec une seule ombre (les activités en cartes de couleur, une couleur par activité donnée par le client, les avis, l'histoire), le contact en tiroir et au pied, qui ferme la page dans le cadre ; chaque activité a sa page, coiffée de sa couleur.",
    sources: [{ fiche: 'docs/veille/architectures/meyers.md', site: 'meyers.dk' }],
    layout: {
      shell: 'cadre',
      // nav minimale rentrée dans le cadre (nom + portes d'action, aucun lien : la nav à étages de Meyers « n'est utile
      // qu'au-delà de 3 activités », fiche ; les pages sont dans les cartes et au pied) ; hero : non rendu (la coquille
      // fait le premier écran : h1 sur le papier, téléphone à côté, photo dessous), `fullbleed` garde le préchargement.
      nav: 'minimal',
      hero: 'fullbleed',
      footer: 'columns',
      // La feuille s'ouvre sur la maison (l'histoire, courte), puis les activités en cartes de couleur, puis ce qu'on en
      // dit (avis) ; pas de section de contact sur l'accueil (« Service client » en porte chez Meyers) : le contact est
      // en tiroir, et au pied. Un ordre que le déroulé long (services, avis, à propos, contact) n'a pas.
      sections: [
        { type: 'about', variant: 'story' },
        { type: 'services', variant: 'cartes-couleur' },
        { type: 'proof', variant: 'testimonials' },
      ],
      contactDrawer: true,
      actionBar: false,
      // Une page par activité, nommée dans la nav (les rubriques de Meyers), coiffée de la couleur de l'activité.
      servicePage: 'porte',
    },
    requis: [
      { mesure: 'photos', min: 1, libelle: 'une photo de héros forte (images.hero) : la feuille monte dessus' },
      { mesure: 'services', min: 2, max: 6, libelle: '2 à 6 activités (services) à colorer, une carte chacune' },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : on feuillette, on n'appelle pas vite" },
    ],
    convientA:
      "Client à identité de couleur forte (devanture peinte, logo, emballage) et plusieurs activités à colorer différemment (services[].couleur) : boulangerie-pâtisserie-traiteur, épicerie fine avec cours, restaurant avec boutique, fromager avec plateaux et ateliers. Le cadre seul convient à tout client qui a une couleur ; la feuille qui monte demande une photo de héros forte. Pas pour l'urgence.",
  },
  'scenes-epinglees': {
    id: 'scenes-epinglees',
    modele:
      "On traverse le lieu pièce par pièce : sous une barre fixe (nom, téléphone), un premier écran typographique (h1, métier et ville, téléphone, note), puis une scène épinglée à étapes où chaque espace du lieu est un panneau de couleur (nom, phrase, photo) qui pousse le précédent, l'équipe en cartes qui arrivent de côté, les avis, le contact ; au plus 8 écrans sur l'accueil, une page par activité.",
    sources: [{ fiche: 'docs/veille/architectures/tab-kitchen.md', site: 'tabkitchenbakery.com' }],
    layout: {
      // Coquille `scenes`, dérivée de `slides` (chaque bloc occupe un écran, défilement aimanté en proximity) : la barre
      // fine fixe (nom, métier à ville, téléphone, menu) et la scène d'ouverture sont rendues par la coquille ; la scène
      // épinglée (data-pin) y tient ses étapes. nav : pages intérieures seulement ; hero : non rendu (`typographic`,
      // sans photo, en garde l'équivalent pour le préchargement).
      shell: 'scenes',
      nav: 'bar',
      hero: 'typographic',
      footer: 'minimal',
      sections: [
        { type: 'about', variant: 'espaces' },
        { type: 'about', variant: 'equipe-cartes' },
        { type: 'proof', variant: 'testimonials' },
        { type: 'contact', variant: 'simple' },
      ],
      contactDrawer: false,
      actionBar: false,
    },
    requis: [
      { mesure: 'espaces', min: 3, libelle: '3 espaces du lieu au moins (about.espaces : nom, phrase, photo) : un panneau chacun' },
      { mesure: 'photos', min: 3, libelle: 'des photos du lieu (3 au moins) : les espaces se visitent en photo' },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : on visite, on n'appelle pas vite" },
    ],
    convientA:
      "Lieu qu'on visite avec plusieurs espaces ou ateliers à montrer (3 au moins) et, idéalement, une équipe qui pose (about.team) : café, boulangerie avec salle, restaurant, tiers-lieu, atelier visitable, ferme. Client qui veut séduire plus qu'informer. Pas pour l'urgence ni les clients pressés.",
  },
  'pages-adresses': {
    id: 'pages-adresses',
    modele:
      "Le site se range par adresse : l'accueil est court (la photo, le h1, le métier à la ville et le téléphone principal, puis dès le deuxième bloc le bandeau des adresses, une rangée par lieu avec sa rue, l'état du jour, son numéro et l'itinéraire, puis l'histoire et les avis) ; chaque lieu a sa page, une fiche pratique qui répond en un écran (photo, horaires de CE lieu, adresse, téléphone, règles, ce qu'on y trouve, les autres adresses) ; les savoir-faire sont décrits une seule fois pour toutes les adresses ; les professionnels ont leur page à part.",
    sources: [{ fiche: 'docs/veille/architectures/pages-adresses.md', site: 'tenbelles.com' }],
    layout: {
      // Coquille `adresses` : le premier écran EST le carnet d'adresses (h1, téléphone principal, note Google à gauche ;
      // une colonne par lieu à droite). Essai du 23 oct 2026 en `flow` + bandeau zones/adresses sous une photo : déroulé
      // à 0,67-0,71 de sept sites (héros, lieu, à propos, pied) et premier écran à 0,76 de lemaire-avocats (h1 sur la
      // photo) ; le bandeau seul reste une variante pour d'autres déroulés.
      shell: 'adresses',
      // nav bar : à deux adresses, leurs deux noms ; à trois et plus, « Nos adresses » (navLinks, src/lib/lieux.ts) ; le
      // numéro principal reste en haut (socle), ceux des lieux sur leurs pages, jamais une liste de numéros en en-tête.
      nav: 'bar',
      // hero : non rendu (la coquille fait le premier écran) ; fullbleed garde le préchargement de images.hero.
      hero: 'fullbleed',
      // Pied en colonnes : les adresses y reviennent, chacune vers sa page avec son numéro (la source les répète au pied).
      footer: 'columns',
      // Aucune section : les savoir-faire, communs à toutes les adresses, sont nommés dans l'intro (une page chacun) ;
      // l'histoire (le manifeste de la source) sur /a-propos ; le formulaire sur /adresses et dans le tiroir ; les pros
      // en bandeau vers /professionnels. Les sections écrites dans le layout du site descendent sous le carnet. Essais du
      // 23 oct 2026 : avec les savoir-faire en liste et l'histoire sur l'accueil, déroulé à 0,65-0,71 de neuf sites
      // (héros, services, à propos, pied) ; en un écran et demi, à 0,81 des accueils-menus (anna-vidal, borie-des-chenes).
      sections: [],
      contactDrawer: true,
      actionBar: false,
      pageAPropos: true,
    },
    requis: [
      { mesure: 'lieux', min: 2, libelle: '2 adresses au moins, chacune avec sa rue et ses horaires (lieux[] : une page par lieu)' },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : un seul numéro doit alors être partout" },
    ],
    convientA:
      "Commerce à deux adresses ou plus, chacune avec ses horaires et, si possible, son numéro : boulangerie à deux boutiques, coiffeur ou barbier à deux salons, fromager avec boutique et marché, caviste à deux caves, garage à deux ateliers, institut à deux cabinets ; mieux encore avec une clientèle professionnelle séparable (site.pros, /professionnels). Pas pour une seule adresse, ni l'artisan qui se déplace (zones), ni l'urgence.",
  },
  'saisons-sorties': {
    id: 'saisons-sorties',
    modele:
      "Le temps range le site : la nav n'a qu'une entrée par saison ; l'accueil est un diptyque (h1 métier et lieu, diplômes, téléphone, note en tête, puis une colonne par saison côte à côte : sa photo, son nom en très grand, ses activités vers leur page, ses sorties à la une) ; chaque activité liste ses sorties datées et cotées (période, durée, niveau, prix), filtrables par niveau sans script ; chaque sortie a sa page (programme, inclus, à prévoir en <details>, prix, condition, Réserver) ; une page par public ; le formulaire du tiroir demande la sortie et les dates ; l'histoire sur la page À propos.",
    sources: [{ fiche: 'docs/veille/architectures/saisons-sorties.md', site: 'guidelagrave.com' }],
    layout: {
      // Coquille `saisons` : le diptyque des saisons EST l'accueil. Essai du 23 oct 2026 en `flow` + `hero/stacked` +
      // services/saisons + avis + histoire + formulaire : premier écran à plus de 0,65 de trois démos et déroulé à plus
      // de 0,65 de vingt-deux sites (le déroulé long) ; services/saisons reste une variante pour d'autres déroulés.
      shell: 'saisons',
      nav: 'bar',
      // hero : non rendu (la coquille fait le premier écran) ; stacked garde le préchargement de images.hero.
      hero: 'stacked',
      footer: 'minimal',
      // Aucune section : la note Google est en tête (socle), le formulaire qualifié (sortie + dates) dans le tiroir,
      // l'histoire (diplômes, équipe) sur /a-propos. Les sections écrites dans le layout du site descendent sous les saisons.
      sections: [],
      contactDrawer: true,
      actionBar: false,
      pageAPropos: true,
    },
    requis: [
      { mesure: 'saisons', min: 2, libelle: '2 saisons au moins avec 2 activités chacune (services[].saison)' },
      { mesure: 'sorties', min: 4, libelle: '4 sorties au moins, chacune avec sa période (sorties[] : une page chacune)' },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : on choisit une sortie, on n'appelle pas vite" },
    ],
    convientA:
      "Métier saisonnier dont l'offre change d'une saison à l'autre, avec des sorties ou prestations à période donnée : guide ou accompagnateur, moniteur, loueur de vélos ou de skis, base nautique, centre équestre (stages vacances, cours à l'année), paysagiste et pépiniériste (plantation, taille), apiculteur, ferme ou cueillette, traiteur (mariages l'été, fêtes l'hiver), ramoneur. Pas pour un métier sans saison, ni l'urgence, ni un client à une seule prestation (rester sur accueil-portes).",
  },
  'ardoise-du-jour': {
    id: 'ardoise-du-jour',
    modele:
      "L'accueil est l'ardoise d'aujourd'hui : en tête le h1, le métier à la ville, le téléphone et la note, puis une rangée d'ardoises posée sur la photo du lieu (les horaires d'aujourd'hui avec la date en toutes lettres, ce qui est au programme aujourd'hui, le rendez-vous du jour), choisies dans le navigateur, la semaine entière lisible sans script ; puis les annonces datées et les avis ; le programme de la semaine sur sa page (/programme) et sur la page de chaque activité ; l'histoire sur la page À propos.",
    sources: [{ fiche: 'docs/veille/architectures/ardoise-du-jour.md', site: 'cheeseboardcollective.coop' }],
    layout: {
      // Coquille `ardoise` : l'ardoise du jour EST l'accueil (src/shells/ardoise.astro, src/components/ArdoiseDuJour.astro).
      shell: 'ardoise',
      nav: 'bar',
      // hero : non rendu (la coquille fait le premier écran) ; fullbleed garde le préchargement de la photo du bandeau.
      hero: 'fullbleed',
      footer: 'columns',
      // Les avis (socle) sous les ardoises ; la source n'en a pas.
      sections: [{ type: 'proof', variant: 'testimonials' }],
      contactDrawer: true,
      actionBar: false,
      pageAPropos: true,
    },
    requis: [
      { mesure: 'programme', min: 3, libelle: 'un programme sur 3 jours au moins (services[].programme : 3 entrées aux jours distincts, chacune avec ses lignes)' },
      { mesure: 'horaires', min: 1, libelle: "des horaires (contact.hours) : l'ardoise dit si c'est ouvert aujourd'hui" },
      { mesure: 'rue', min: 1, libelle: "une adresse où l'on vient (contact.address.street)" },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : on vient voir ce qu'il y a aujourd'hui" },
    ],
    convientA:
      "Commerce de bouche dont l'offre tourne selon le jour de la semaine, et qui tiendra son programme à jour : boulangerie (pain du mardi, brioche du dimanche), traiteur ou boucher-traiteur (plat du jour), bistrot à menu du jour, fromager, poissonnier (arrivages), glacier (parfum du jour), pizzeria à pizza du jour. Pas pour une offre qui ne change jamais (lieu-fixe), ni l'itinérant (tournee-semaine), ni l'urgence.",
  },
  'tournee-semaine': {
    id: 'tournee-semaine',
    modele:
      "L'accueil dit où est le camion : en tête le h1, le métier et la région, puis l'étape du moment en grand (aujourd'hui tant que le service n'est pas fini, sinon la prochaine : commune, repère, heures, véhicule, bouton d'appel du véhicule), choisie dans le navigateur, toute la semaine lisible sans script ; puis la semaine (un bloc par jour, une ligne par étape), les avis, la carte ; une page par commune (/tournee/<commune> : jours de passage, repère, itinéraire, heures, téléphone, JSON-LD par étape) et /tournee ; l'histoire sur la page À propos.",
    sources: [
      { fiche: 'docs/veille/architectures/tournee-semaine.md', site: 'pizzaptitlouis.fr' },
      { fiche: 'docs/veille/architectures/tournee-semaine.md', site: 'lecamionapizzas.com' },
    ],
    layout: {
      shell: 'tournee',
      nav: 'bar',
      hero: 'fullbleed',
      footer: 'columns',
      // L'étape du moment (bloc frère du héros, rendu par la coquille), la semaine, la carte, puis les avis (socle ; les
      // sources n'en ont pas) : deux blocs « lieu » de suite, un déroulé qu'aucun site n'a. Essais du 24 oct 2026 :
      // l'étape dans le bloc d'accueil puis semaine, avis, carte (héros, lieu, avis, services, pied) : 0,69 de
      // forge-delacroix ; carte entre l'étape et la semaine : 0,68 de maison-roux.
      sections: [
        { type: 'zones', variant: 'tournee' },
        { type: 'services', variant: 'carte-prix' },
        { type: 'proof', variant: 'testimonials' },
      ],
      contactDrawer: true,
      actionBar: false,
      pageAPropos: true,
    },
    requis: [
      { mesure: 'etapes', min: 3, libelle: '3 étapes de tournée au moins (tournee[] : jour, commune et heures ; une page par commune)' },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : on vient au camion, on n'attend pas un dépannage" },
    ],
    convientA:
      "Métier itinérant à tournée régulière (même commune, même jour, mêmes heures chaque semaine) : camion pizza, rôtisseur, food truck, poissonnier ou boucher ambulant, fromager ou maraîcher de marchés, boulanger en tournée rurale, épicerie itinérante ; mieux avec plusieurs véhicules (un numéro chacun) et une offre événementielle. Pas pour un commerce fixe (pages-adresses, lieu-fixe), ni une zone sans jour fixe (zones.cities), ni une tournée tenue seulement sur les réseaux.",
  },
  'artistes-residents': {
    id: 'artistes-residents',
    modele:
      "L'accueil est le mur des artistes de la maison : en tête le h1, le métier à la ville, l'ancienneté, le téléphone et la note, puis un grand portrait par artiste (son nom, ses styles), filtrable par style sans script ; chaque artiste a sa page (/artistes/<slug> : portrait, styles, présentation, travaux, son e-mail, son Instagram, son lien de rendez-vous) ; la maison (adresse, horaires, téléphone) et les avis ensuite ; l'histoire sur la page À propos.",
    sources: [{ fiche: 'docs/veille/architectures/artistes-residents.md', site: 'mysterytattooclub.com' }],
    layout: {
      // Coquille `artistes` : le mur des artistes EST l'accueil (src/shells/artistes.astro, src/components/MurArtistes.astro).
      shell: 'artistes',
      nav: 'bar',
      // hero : non rendu (la coquille fait le premier écran) ; fullbleed garde le préchargement de la photo.
      hero: 'fullbleed',
      footer: 'columns',
      // Les avis (socle) après la maison ; la source n'a qu'un titre « Témoignages ».
      sections: [{ type: 'proof', variant: 'testimonials' }],
      contactDrawer: true,
      actionBar: false,
      pageAPropos: true,
    },
    requis: [
      { mesure: 'artistes', min: 3, libelle: '3 artistes au moins avec une photo et un style (artistes[] : une page chacun)' },
      { mesure: 'rue', min: 1, libelle: "une adresse où l'on vient (contact.address.street)" },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : on choisit son artiste, on prend rendez-vous" },
    ],
    convientA:
      "Maison de plusieurs artistes ou praticiens qu'on choisit par leur style : salon de tatouage (résidents et invités), salon de coiffure ou barbier à plusieurs fauteuils, atelier collectif (céramistes, bijoutiers), studio de photographes. Chacun avec une photo, des styles et de préférence ses propres contacts. Pas pour un artisan seul (index-projets), ni l'urgence.",
  },
  'calendrier-fetes': {
    id: 'calendrier-fetes',
    modele:
      "L'accueil suit le calendrier des fêtes : en tête le h1, le métier à la ville, le téléphone et la note, puis la fête du moment en grand (en cours, sinon la prochaine, choisie dans le navigateur ; ses dates, la date limite de commande, ce qui est préparé avec les prix, la porte Commander ou Appeler), les occasions (une porte par occasion vers sa page), la livraison (zone, délai, « commandé avant 13 h, livré aujourd'hui » calculé dans le navigateur) ; le calendrier entier sur /fetes et une page par fête ; les avis ensuite.",
    sources: [{ fiche: 'docs/veille/architectures/calendrier-fetes.md', site: 'fleuriste-lemans.fr' }],
    layout: {
      shell: 'fetes',
      nav: 'bar',
      hero: 'fullbleed',
      footer: 'columns',
      sections: [{ type: 'proof', variant: 'testimonials' }],
      contactDrawer: true,
      actionBar: false,
      pageAPropos: true,
    },
    requis: [
      { mesure: 'fetes', min: 2, libelle: '2 fêtes au moins avec leurs dates et ce qui est préparé (fetes[] : du, au, lignes)' },
      { mesure: 'services', min: 2, libelle: '2 occasions au moins (services[] : naissance, mariage, deuil…), une page chacune' },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h)" },
    ],
    convientA:
      "Commerce dont l'année tourne autour des fêtes et qui prend des commandes avant une date : fleuriste (Toussaint, Saint-Valentin, fête des mères), chocolatier (Pâques, Noël), pâtissier (galettes, bûches), boucher-traiteur et poissonnier (fêtes de fin d'année), caviste, primeur ; mieux avec une livraison. Pas pour une offre sans temps forts (lieu-fixe), ni une offre qui change chaque jour (ardoise-du-jour), ni l'urgence.",
  },
};


/**
 * Variantes de section qui ne vont qu'avec les données de leur architecture (photos par porte, lignes à prix) : jamais
 * tirées dans un modèle (presets/, tests/presets.test.mjs) ; `ff composer` ne les prend que si les données sont là
 * (varianteCompatible).
 */
export const VARIANTES_D_ARCHITECTURE = [
  'services/portes',
  'services/carte-prix',
  'services/cartes-empilees',
  'services/liste-a-filets',
  'about/ecran-texte-photo',
  'proof/citations',
  'contact/ecran',
  'about/espaces',
  'about/equipe-cartes',
  'services/cartes-couleur',
  'zones/adresses',
  'services/saisons',
  'services/programme',
  'zones/tournee',
] as const;

/**
 * Coquilles dont l'accueil renvoie à une page qui liste toutes les réalisations (/realisations, filtrable par type) :
 * « View All Projects » de Studio RHE, « Réalisations » de Gingko. L'index-projets n'en a pas besoin (son accueil EST
 * l'index) ; les autres coquilles n'y mènent pas, la page n'est donc pas construite pour elles.
 */
export const COQUILLES_A_INDEX_REALISATIONS: readonly string[] = ['panneaux', 'carnet'];

/** Ce que donneesManquantes() lit d'un site : un sous-ensemble du Site, pour tester sans tout construire. */
export interface SiteArchi {
  images?: { hero?: unknown };
  services?: { image?: unknown; lignes?: unknown[]; saison?: string; programme?: { jours?: string; lignes?: unknown[] }[] }[];
  about?: { portrait?: unknown; story?: string; espaces?: { photo?: unknown }[] };
  proof?: { gallery?: { kind?: string }[] };
  realisations?: { kind?: string; photos?: unknown[] }[];
  contact?: { hours?: unknown[]; address?: { street?: string }; emergency24h?: boolean };
  agenda?: { date: string }[];
  produits?: { photo?: unknown }[];
  lieux?: { address?: { street?: string }; hours?: unknown[]; photo?: unknown; photos?: unknown[] }[];
  sorties?: { periode?: string; photo?: unknown }[];
  tournee?: { jour?: string; commune?: string; hours?: string }[];
  artistes?: { photo?: unknown; photos?: unknown[]; styles?: string[] }[];
  fetes?: { du?: string; au?: string; lignes?: unknown[]; photo?: unknown }[];
}

/** Architecture d'id `id`, ou undefined. */
export function architecture(id: string | undefined): Architecture | undefined {
  return id && Object.prototype.hasOwnProperty.call(ARCHITECTURES, id) ? ARCHITECTURES[id as ArchitectureId] : undefined;
}

/**
 * Applique l'architecture de `layout.architecture` à un layout d'entrée (avant zod) : chaque réglage absent (undefined)
 * prend la valeur de l'architecture ; un réglage présent n'est jamais remplacé. Sans architecture (ou id inconnu,
 * que zod refusera ensuite), le layout revient tel quel.
 */
export function completerLayout<T extends Record<string, unknown> | undefined>(layout: T): T {
  if (!layout || typeof layout !== 'object') return layout;
  const a = architecture(layout.architecture as string | undefined);
  if (!a) return layout;
  const out: Record<string, unknown> = { ...layout };
  for (const [k, v] of Object.entries(a.layout)) {
    if (out[k] === undefined) out[k] = Array.isArray(v) ? v.map((x) => ({ ...x })) : v;
  }
  return out as T;
}

const compte = (n: number, e: Exigence) => (e.min !== undefined && n < e.min) || (e.max !== undefined && n > e.max);

/** Nombre de photos du client que le site déclare (rien n'est vérifié sur le disque ici). */
export function photosDuClient(s: SiteArchi): number {
  return (
    (s.images?.hero ? 1 : 0) +
    (s.services ?? []).filter((x) => x.image).length +
    (s.proof?.gallery ?? []).length +
    (s.about?.portrait ? 1 : 0) +
    (s.about?.espaces ?? []).filter((e) => e.photo).length +
    (s.lieux ?? []).reduce((n, l) => n + (l.photo ? 1 : 0) + (l.photos?.length ?? 0), 0) +
    (s.sorties ?? []).filter((x) => x.photo).length +
    (s.artistes ?? []).reduce((n, a) => n + (a.photo ? 1 : 0) + (a.photos?.length ?? 0), 0) +
    (s.fetes ?? []).filter((x) => x.photo).length +
    (s.realisations ?? []).reduce((n, r) => n + (r.photos?.length ?? 0), 0)
  );
}

/** Réalisations du site : realisations[] (une page chacune) si le client en a, sinon les photos de proof.gallery. */
export function nombreDeRealisations(s: SiteArchi): number {
  return (s.realisations ?? []).length || (s.proof?.gallery ?? []).length;
}

/**
 * Données exigées par l'architecture `id` et absentes du site, en phrases (vide = rien ne manque). Ne devine rien :
 * compte ce que site.config.ts déclare.
 */
export function donneesManquantes(id: string, s: SiteArchi): string[] {
  const a = architecture(id);
  if (!a) return [`architecture inconnue : ${id}`];
  const out: string[] = [];
  for (const e of a.requis) {
    let n = 0;
    switch (e.mesure) {
      case 'photos': n = photosDuClient(s); break;
      case 'services': n = (s.services ?? []).length; break;
      case 'servicesPhoto': n = (s.services ?? []).filter((x) => x.image).length; break;
      case 'realisations': n = nombreDeRealisations(s); break;
      case 'types': {
        const source = (s.realisations ?? []).length ? s.realisations ?? [] : s.proof?.gallery ?? [];
        n = new Set(source.map((r) => (r.kind ?? '').trim()).filter(Boolean)).size;
        break;
      }
      case 'horaires': n = (s.contact?.hours ?? []).length; break;
      case 'rue': n = s.contact?.address?.street ? 1 : 0; break;
      case 'lignesPrix': n = (s.services ?? []).filter((x) => (x.lignes ?? []).length > 0).length; break;
      case 'histoire': n = (s.about?.story ?? '').split(/\n\s*\n/).filter((p) => p.trim()).length; break;
      case 'agenda': n = (s.agenda ?? []).length; break;
      case 'espaces': n = (s.about?.espaces ?? []).length; break;
      case 'produits': n = (s.produits ?? []).filter((p) => p.photo).length; break;
      // Mêmes comptes que lieuxComplets (src/lib/lieux.ts) et saisonsCompletes (src/lib/sorties.ts), recopiés : ce module
      // reste pur (aucun import d'exécution).
      case 'lieux': n = (s.lieux ?? []).filter((l) => Boolean(l.address?.street) && (l.hours ?? []).length > 0).length; break;
      case 'saisons': {
        const parSaison = new Map<string, number>();
        for (const x of s.services ?? []) {
          const v = (x.saison ?? '').trim();
          if (v) parSaison.set(v, (parSaison.get(v) ?? 0) + 1);
        }
        n = [...parSaison.values()].filter((k) => k >= 2).length;
        break;
      }
      case 'sorties': n = (s.sorties ?? []).filter((x) => (x.periode ?? '').trim()).length; break;
      // Mêmes comptes que entreesDistinctes (src/lib/ardoise.ts) et etapesCompletes (src/lib/tournee.ts), recopiés.
      case 'programme': {
        const vus = new Set<string>();
        for (const x of s.services ?? []) for (const e of x.programme ?? []) {
          const k = (e.jours ?? '').trim().toLowerCase();
          if (k && (e.lignes ?? []).length > 0) vus.add(k);
        }
        n = vus.size;
        break;
      }
      case 'etapes': n = (s.tournee ?? []).filter((e) => (e.jour ?? '').trim() && (e.commune ?? '').trim() && (e.hours ?? '').trim()).length; break;
      // Mêmes comptes que artistesComplets (src/lib/artistes.ts) et fetesCompletes (src/lib/fetes.ts), recopiés.
      case 'artistes': n = (s.artistes ?? []).filter((a) => (a.photo || (a.photos ?? []).length > 0) && (a.styles ?? []).some((x) => x.trim())).length; break;
      case 'fetes': {
        const iso = /^\d{4}-\d{2}-\d{2}$/;
        n = (s.fetes ?? []).filter((f) => iso.test(f.du ?? '') && iso.test(f.au ?? '') && (f.du ?? '') <= (f.au ?? '') && (f.lignes ?? []).length > 0).length;
        break;
      }
      case 'pasUrgence': if (s.contact?.emergency24h) out.push(e.libelle); continue;
    }
    if (compte(n, e)) out.push(`${e.libelle} (${n} aujourd’hui)`);
  }
  return out;
}

/** Ce que avisDeCarte() lit : la note Google et les avis recopiés (proof). */
export interface PreuveArchi {
  google?: { rating: number; count: number; url?: string };
  testimonials?: { text: string; author: string; source?: string; date?: string }[];
}

/**
 * Avis de la coquille `carte` (architecture carte-de-visite) : la note Google (« 4,6 ») ET les avis recopiés courts
 * (`max` signes au plus, `n` au plus), dans l'ordre du site. Socle docs/GOUT.md § 0 : « les avis du client, dès
 * qu'il y en a, haut dans la page » ; jusqu'au 17 oct 2026 la carte n'en montrait aucun dès qu'une note existait
 * (version D de L'Épi d'Or : la note seule, ses avis absents). Rien n'est recalculé ni coupé : un avis trop long
 * n'est pas tronqué, il n'est pas pris.
 */
export function avisDeCarte(p: PreuveArchi | undefined, max = 160, n = 2): { note?: string; avis: { text: string; author: string; source?: string; date?: string }[] } {
  const note = p?.google ? p.google.rating.toLocaleString('fr-FR', { maximumFractionDigits: 1 }) : undefined;
  const avis = (p?.testimonials ?? []).filter((t) => t.text.length <= max).slice(0, n);
  return { note, avis };
}
