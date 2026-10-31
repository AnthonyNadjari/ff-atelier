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
 *  - fetes           : fêtes datées avec au moins une ligne (fetes[] ; src/lib/fetes.ts, fetesCompletes) ;
 *  - calendrier      : un calendrier qui dit quelque chose (disponibilites.occupe non vide, ou disponibilites.ics) ;
 *                      rien n'est lu sur le réseau ici : l'iCal est lu au build (src/lib/ics-build.ts) ;
 *  - parcours        : barreaux du parcours qui ont au moins une formule (parcours[] ; src/lib/parcours.ts, barreauxComplets) ;
 *  - situations      : situations de la grille qui ont au moins un prix (tarifs.situations[] ; src/lib/tarifs.ts,
 *                      situationsCompletes) ;
 *  - envoi           : étapes du voyage du colis qui disent où est l'objet et ce qui se passe (envoi.etapes[] ;
 *                      src/lib/colis.ts, etapesCompletes) ;
 *  - soins           : soins dont la durée se lit (services[].lignes[].duree : « 1 h 15 », « 40 min » ; src/lib/soins.ts,
 *                      soinsDates) ;
 *  - avantApres      : réalisations qui ont une photo avant ET une photo après (realisations[].avant et photos ;
 *                      src/lib/avantapres.ts, piecesAvantApres) ;
 *  - planning        : cours réguliers dont le jour, les heures et le nom se lisent (planning.cours[] ; src/lib/planning.ts,
 *                      coursValides) ;
 *  - materiels       : matériels de location qui ont au moins un prix (location.materiels[] ; src/lib/location.ts,
 *                      materielsComplets) ;
 *  - estimation      : questions de la demande d'estimation qui se posent (estimation.questions[] : nom, libellé ; un
 *                      choix a deux réponses au moins ; src/lib/estimation.ts, questionsValides) ;
 *  - formules        : formules nommées à prix (formules.liste[] : slug, nom et prix ; src/lib/formules.ts, formulesCompletes) ;
 *  - appareils       : appareils réparés qui ont au moins une panne nommée (appareils.liste[] : slug, nom, pannes ;
 *                      src/lib/appareils.ts, appareilsComplets) ;
 *  - retraits        : points de retrait lisibles (retrait.points[] : slug, nom, commune, jour, heures « HH:MM » ;
 *                      src/lib/retrait.ts, pointsComplets) ;
 *  - cloture         : une clôture des commandes qui se lit (retrait.cloture : jour et heure « HH:MM ») ;
 *  - salles          : salles d'un lieu de réception avec au moins une capacité (salles.liste[] : slug, nom, capacites ;
 *                      src/lib/salles.ts, sallesCompletes) ;
 *  - biens           : biens à vendre ou à louer lisibles (biens.liste[] : slug, titre, projet, commune, prix ;
 *                      src/lib/biens.ts, biensComplets) ;
 *  - revendeurs      : revendeurs d'un producteur lisibles (revendeurs.liste[] : nom, commune, secteur ; src/lib/revendeurs.ts,
 *                      revendeursComplets) ;
 *  - profils         : profils de patients qui ont au moins un motif (profils.liste[] : slug, nom, motifs ;
 *                      src/lib/profils.ts, profilsComplets) ;
 *  - especes         : espèces soignées par une clinique vétérinaire (especes[] : slug, nom ; src/lib/garde.ts, especesCompletes) ;
 *  - garde           : une garde qui se lit (garde.etapes[] avec un titre, ou un numéro de garde propre ; src/lib/garde.ts,
 *                      gardeLisible) ;
 *  - honoraires      : des honoraires qui disent un prix (honoraires.consultation, .decouverte ou .modes[] ; src/lib/honoraires.ts,
 *                      honorairesLisibles) ;
 *  - interventions   : interventions datées et situées (interventions[] : slug, date AAAA-MM-JJ réelle, lieu, titre ;
 *                      src/lib/journal.ts, interventionsCompletes) ;
 *  - trajet          : communes desservies avec un temps de trajet (trajet.communes[] : slug, nom, minutes > 0 ;
 *                      src/lib/trajet.ts, communesCompletes) ;
 *  - directionsTrajet: les mêmes communes dont la direction depuis la base est donnée (placées sur le schéma) ;
 *  - recoltes        : produits du calendrier des récoltes lisibles (recoltes.produits[] : slug, nom, famille, au moins un mois
 *                      de 1 à 12 ; src/lib/recoltes.ts, produitsComplets) ;
 *  - matieres        : matières du nuancier qui ont leur photo (matieres.liste[] : slug, nom, photo ; src/lib/matieres.ts,
 *                      nuancier) ;
 *  - producteurs     : producteurs lisibles (producteurs.liste[] : slug, nom, commune ; src/lib/producteurs.ts,
 *                      producteursComplets) ;
 *  - departs         : trajets lisibles (departs.trajets[] : slug, destination, minutes entières > 0 ; src/lib/departs.ts,
 *                      trajetsComplets) ;
 *  - formations      : formations lisibles (formations.liste[] : slug, nom ; src/lib/sessions.ts, formationsCompletes) ;
 *  - sessions        : sessions datées du jour ou à venir, toutes formations (formations.liste[].sessions[] ; src/lib/sessions.ts,
 *                      sessionsAVenir) ;
 *  - forfaits        : forfaits à prix (forfaits.liste[] : slug, nom, prix ou un tarif par gabarit ; src/lib/forfaits.ts,
 *                      forfaitsComplets) ;
 *  - urgence         : contact.emergency24h VRAI ou un délai d'arrivée donné (tarifs.delai) : l'architecture sert
 *                      l'urgence, à l'inverse de pasUrgence.
 */
export interface Exigence {
  mesure: 'photos' | 'services' | 'servicesPhoto' | 'realisations' | 'types' | 'horaires' | 'rue' | 'lignesPrix' | 'pasUrgence' | 'histoire' | 'agenda' | 'produits' | 'espaces' | 'lieux' | 'saisons' | 'sorties' | 'programme' | 'etapes' | 'artistes' | 'fetes' | 'calendrier' | 'parcours' | 'situations' | 'envoi' | 'urgence' | 'soins' | 'avantApres' | 'planning' | 'materiels' | 'estimation' | 'formules' | 'appareils' | 'retraits' | 'cloture' | 'salles' | 'biens' | 'revendeurs' | 'profils' | 'especes' | 'garde' | 'honoraires' | 'interventions' | 'trajet' | 'directionsTrajet' | 'recoltes' | 'matieres' | 'producteurs' | 'departs' | 'formations' | 'sessions' | 'forfaits';
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
  'outil-calendrier',
  'parcours-atelier',
  'grille-urgence',
  'atelier-par-colis',
  'carte-des-soins',
  'avant-apres',
  'planning-semaine',
  'catalogue-location',
  'estimation-etapes',
  'formules-comparees',
  'appareils-pannes',
  'commande-retrait',
  'salles-capacites',
  'annonces-biens',
  'revendeurs-secteurs',
  'profils-patients',
  'garde-especes',
  'honoraires-domaines',
  'carnet-interventions',
  'rayon-trajet',
  'calendrier-recoltes',
  'nuancier-matieres',
  'mur-producteurs',
  'tableau-departs',
  'sessions-places',
  'forfaits-atelier',
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
  'outil-calendrier': {
    id: 'outil-calendrier',
    modele:
      "Un site court dont l'accueil mène à un outil : en tête le h1, le métier à la ville, la capacité, le téléphone, la note et la porte « Voir les dates libres » ; la photo du lieu en grand ; les hôtes et leur histoire ; les avis ; puis l'outil, le calendrier des nuits libres et prises (lu au build dans la liste du client ou son iCal, lisible sans script) avec la sélection, les tarifs et la demande de dates par le formulaire existant, sans paiement ; les logements en pages ; le bouton Réserver de la nav saute à l'outil.",
    sources: [{ fiche: 'docs/veille/architectures/coquelicots.md', site: 'coquelicots.nl' }],
    layout: {
      // Coquille `calendrier` (src/shells/calendrier.astro, src/components/Disponibilites.astro).
      shell: 'calendrier',
      nav: 'bar',
      hero: 'fullbleed',
      footer: 'columns',
      // Les avis notés de la source viennent avant l'outil (« Ce qu'en ont pensé nos visiteurs »).
      sections: [{ type: 'proof', variant: 'testimonials' }],
      contactDrawer: false,
      actionBar: false,
    },
    requis: [
      { mesure: 'calendrier', min: 1, libelle: 'un calendrier : des périodes déjà réservées (disponibilites.occupe) ou l’adresse iCal du client (disponibilites.ics)' },
      { mesure: 'services', min: 1, max: 4, libelle: '1 à 4 logements ou offres (services[] : la maison, la chambre, la salle), une page chacun' },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : on choisit des dates, on ne dépanne pas" },
    ],
    convientA:
      "Qui vend des nuits, des jours ou des créneaux longs et tient un calendrier : gîte, chambre d'hôtes, cabane, salle de réception, location de matériel à la journée, atelier ou stage à dates fixes ; mieux avec l'iCal d'Airbnb, Booking ou Gîtes de France, des tarifs et une photo du lieu. Pas pour un commerce à horaires simples (lieu-fixe), ni un artisan qui se déplace, ni l'urgence.",
  },
  'parcours-atelier': {
    id: 'parcours-atelier',
    modele:
      "Le site est une échelle, du premier essai à la pratique libre : en tête le h1, le métier à la ville, l'ancienneté, le téléphone et la note ; puis « Où en êtes-vous ? » en onglets, un barreau par niveau (sans script, l'échelle entière) qui dit ses formules et leurs prix, ce qui est compris ou non, comment ça se passe, les prochaines dates, les avis de ceux qui y sont passés et le barreau suivant ; les autres avis ; l'atelier (adresse, horaires du jour, téléphone) ; une page par barreau, que la nav nomme.",
    sources: [{ fiche: 'docs/veille/architectures/parcours-atelier.md', site: 'turningearth.uk' }],
    layout: {
      // Coquille `parcours` (src/shells/parcours.astro).
      shell: 'parcours',
      nav: 'bar',
      hero: 'fullbleed',
      // Pied court : la nav nomme déjà chaque barreau et l'adresse de l'atelier est juste au-dessus (id="contact").
      footer: 'minimal',
      // Les avis sont rendus par la coquille : sous leur barreau (proof.testimonials[].barreau, « What our students say »
      // sur la page des cours de la source, « What our members say » sur celle de l'adhésion), les autres après l'échelle.
      sections: [],
      contactDrawer: true,
      actionBar: false,
    },
    requis: [
      { mesure: 'parcours', min: 2, libelle: '2 barreaux au moins avec leurs formules (parcours[] : niveau, titre, formules), une page chacun' },
      { mesure: 'rue', min: 1, libelle: "une adresse où l'on vient (contact.address.street) : l'atelier" },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : on vient apprendre" },
    ],
    convientA:
      "Atelier qui transmet son métier par étapes et qu'on peut ensuite fréquenter librement : céramiste ou atelier de poterie (cours, stages, adhésion), école de cuisine ou de pâtisserie, atelier de couture, menuiserie ou bois partagée, caviste qui forme (dégustation, cours, club), école de musique ; 2 à 4 barreaux avec des formules et des prix. Pas pour un artisan qui vend ses pièces sans enseigner (index-projets, gamme-vitrine), ni des rendez-vous ponctuels sans suite (cartes-empilees-agenda), ni l'urgence.",
  },
  'grille-urgence': {
    id: 'grille-urgence',
    modele:
      "Le site d'un métier d'urgence est sa grille de prix publiée : en tête le h1, le métier à la ville, le téléphone en grand et le délai d'arrivée ; puis « Quelle est votre situation ? » en onglets (porte claquée, fermée à clé…), chaque situation avec le test qui la reconnaît, son prix pour chaque créneau (journée, soirée, nuit) et celui de l'heure marqué dans le navigateur, ce que comprend le forfait, comment ça se passe, ce qu'il faut savoir avant d'appeler ; sous les onglets la grille complète, les engagements et les délais par secteur ; les avis ; l'atelier ; une page par situation et /tarifs.",
    sources: [{ fiche: 'docs/veille/architectures/grille-urgence.md', site: 'serrure-ouest.com' }],
    layout: {
      // Coquille `grille` (src/shells/grille.astro).
      shell: 'grille',
      nav: 'bar',
      hero: 'typographic',
      footer: 'columns',
      // Les avis viennent après l'outil (« 5,0 sur 5 » de la source est juste sous le premier écran : la note est dans
      // l'en-tête de la coquille, les avis recopiés ensuite).
      sections: [{ type: 'proof', variant: 'testimonials' }],
      contactDrawer: true,
      // Métier d'urgence : la barre d'appel en bas au téléphone (« Appeler », « Devis WhatsApp » de la source).
      actionBar: true,
    },
    requis: [
      { mesure: 'situations', min: 2, libelle: '2 situations au moins avec leurs prix (tarifs.situations[] : nom et prix par créneau), une page chacune' },
      { mesure: 'urgence', min: 1, libelle: "un métier où l'on appelle vite : contact.emergency24h ou un délai d'arrivée donné (tarifs.delai)" },
    ],
    convientA:
      "Métier d'urgence qui accepte de publier ses prix et dont le prix dépend de la situation et de l'heure : serrurier, plombier (fuite, débouchage), vitrier, dépanneur électricien, dépannage auto, garde d'animaux en urgence ; mieux avec un délai par secteur. Pas pour un artisan qui ne donne que des devis (index-projets, accueil-portes), ni pour un commerce où l'on vient (lieu-fixe).",
  },
  'atelier-par-colis': {
    id: 'atelier-par-colis',
    modele:
      "Deux chemins vers l'atelier : en tête le h1, le métier à la ville, l'ancienneté, le téléphone, la note et le message du moment ; puis deux portes, Venir à l'atelier (adresse, horaires du jour) et Envoyer par colis (délai) ; le voyage du colis en piste horizontale qu'on fait glisser à la main (chez vous, la poste, l'atelier, le retour : une carte par étape, frais de retour et fiche à joindre au bout) ; les prestations et leurs prix, une page chacune ; les avis ; l'atelier ; la marche à suivre entière sur /envoyer.",
    sources: [
      { fiche: 'docs/veille/architectures/atelier-par-colis.md', site: 'lacordonneriealpine.fr' },
      { fiche: 'docs/veille/architectures/atelier-par-colis.md', site: 'agh-atelier-horloger.com' },
      { fiche: 'docs/veille/architectures/atelier-par-colis.md', site: 'eb-ressemelage.com' },
    ],
    layout: {
      // Coquille `colis` (src/shells/colis.astro).
      shell: 'colis',
      nav: 'bar',
      hero: 'typographic',
      footer: 'minimal',
      // Les prestations à prix (une rubrique par type d'objet, ses lignes « 35 € / paire » ; la page de chaque rubrique
      // de la source), puis l'atelier et ceux qui y travaillent (« Robin, le fondateur… Noémie, apprentie », les
      // machines), puis les avis : l'ordre de l'accueil de la source. Les questions d'avant l'envoi (« Avant de commander :
      // ce qu'il faut savoir », « Conseil avant envoi » de la seconde lecture, EB Ressemelage) suivent les prix : faq[]
      // du client, absente = rien.
      sections: [
        { type: 'services', variant: 'carte-prix' },
        { type: 'faq', variant: 'accordion' },
        { type: 'about', variant: 'story' },
        { type: 'proof', variant: 'testimonials' },
      ],
      contactDrawer: true,
      actionBar: false,
      servicePage: 'porte',
    },
    requis: [
      { mesure: 'envoi', min: 3, libelle: "3 étapes au moins du voyage du colis (envoi.etapes[] : où est l'objet, ce qui se passe)" },
      { mesure: 'lignesPrix', min: 1, libelle: 'des prestations à prix (services[].lignes) : on envoie quand on connaît le prix' },
      { mesure: 'rue', min: 1, libelle: "l'adresse de l'atelier (contact.address.street) : on y vient ou on y envoie" },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : un colis met des jours" },
    ],
    convientA:
      "Atelier de réparation dont les clients viennent de loin et peuvent envoyer l'objet : cordonnier (ressemelage de chaussons d'escalade, de chaussures de montagne), horloger, luthier, réparateur de stylos, de poupées, d'appareils photo, affûteur, relieur, restaurateur de bijoux ; prix par pièce connus, délai donné. Pas pour l'urgence, ni pour un métier qui se déplace chez le client.",
  },
  'carte-des-soins': {
    id: 'carte-des-soins',
    modele:
      "Le site d'un institut est sa carte des soins : en tête le h1, le métier à la ville, l'ancienneté, le téléphone, la porte Réserver (le lien du client) et le bon cadeau ; puis « Combien de temps avez-vous ? » en onglets de durée (moins de 30 min, de 30 min à 1 h, plus d'une heure ; sans script, tous les soins), chaque soin avec sa famille, sa durée, son prix et sa porte ; la carte entière par famille, une page par famille ; les avis ; l'institut et ses horaires.",
    sources: [
      { fiche: 'docs/veille/architectures/carte-des-soins.md', site: 'institutladouceheure.fr' },
      { fiche: 'docs/veille/architectures/carte-des-soins.md', site: 'beauty-elite.fr' },
    ],
    layout: {
      // Coquille `soins` (src/shells/soins.astro).
      shell: 'soins',
      nav: 'bar',
      hero: 'typographic',
      footer: 'columns',
      // La carte entière par famille (« Soins visage », « Épilation », « Beauté des mains et des pieds » : une page par
      // famille sur la source, « Soins et tarifs » sur la seconde), puis les avis (« Voir ou laisser un témoignage »).
      // L'équipe (« Céline, Emeline, Aurélie et Emmy, esthéticiennes diplômées ») est dite dans le bloc de l'institut,
      // avec l'adresse et les horaires : pas de section « à propos » à part (le déroulé long de l'usine, GOUT § 0).
      sections: [
        { type: 'services', variant: 'carte-prix' },
        { type: 'proof', variant: 'testimonials' },
      ],
      contactDrawer: false,
      // « Réserver » et « Chèque cadeau » dans la barre de la source : au téléphone, la barre d'actions en bas.
      actionBar: true,
      servicePage: 'porte',
    },
    requis: [
      { mesure: 'soins', min: 4, libelle: '4 soins au moins avec leur durée (services[].lignes[].duree : « 1 h 15 », « 40 min »)' },
      { mesure: 'rue', min: 1, libelle: "l'adresse de l'institut (contact.address.street) : on y vient" },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : on réserve un moment" },
    ],
    convientA:
      "Commerce de soin où l'on choisit une prestation par sa durée et son prix : institut de beauté, spa de quartier, masseur, prothésiste ongulaire, barbier ou coiffeur à prestations minutées, sophrologue ou réflexologue à séances ; 4 soins datés au moins, idéalement 2 familles et un lien de réservation. Pas pour un artisan sur devis (index-projets, avant-apres), ni l'urgence (grille-urgence).",
  },
  'avant-apres': {
    id: 'avant-apres',
    modele:
      "Le site d'un atelier de restauration est le mur de ses pièces transformées : en tête le h1, le métier à la ville, l'ancienneté, le téléphone et « envoyez une photo de votre pièce » ; puis chaque pièce en curseur avant / après qu'on tire à la main (son nom, son type, ce qui a été fait), un filtre par type sans script dès deux types, chaque pièce menant à sa page ; les niveaux de travaux et leurs prix ; l'atelier ; les avis ; /realisations.",
    sources: [
      { fiche: 'docs/veille/architectures/avant-apres.md', site: 'assiseautrement.fr' },
      { fiche: 'docs/veille/architectures/avant-apres.md', site: 'lapetiteremise.fr' },
      { fiche: 'docs/veille/architectures/avant-apres.md', site: 'atelier-b-tapissier.fr' },
    ],
    layout: {
      // Coquille `avant-apres` (src/shells/avant-apres.astro).
      shell: 'avant-apres',
      nav: 'bar',
      hero: 'typographic',
      footer: 'columns',
      // Les avis juste sous le mur (la transformation, puis ceux qui l'ont reçue). Les niveaux de travaux (« réfection
      // légère, rénovation ou restauration totale de votre fauteuil », Assise Autrement ; « Le tarif d'une réfection
      // légère sera aussi plus doux ») ont chacun leur page, nommée par la nav ; l'accueil ne les répète pas. La personne (« Je m'appelle Julie Maurin… CAP Tapissier », La Petite
      // Remise) a sa page (/a-propos) : pas de section « à propos » sur l'accueil.
      sections: [{ type: 'proof', variant: 'testimonials' }],
      contactDrawer: true,
      actionBar: false,
      servicePage: 'porte',
      // « Mon Histoire » est une page de la source (Assise Autrement), comme « Une créatrice diplômée » chez La Petite
      // Remise : l'histoire de l'atelier sur /a-propos, l'accueil reste au mur.
      pageAPropos: true,
    },
    requis: [
      { mesure: 'avantApres', min: 3, libelle: '3 pièces au moins avec une photo avant et une photo après (realisations[].avant et photos)' },
      { mesure: 'rue', min: 1, libelle: "l'adresse de l'atelier (contact.address.street) : on y dépose la pièce" },
    ],
    convientA:
      "Atelier dont le travail se voit à la transformation d'une pièce : tapissier, ébéniste restaurateur, rempailleur, doreur, carrossier, cordonnier, relieur, restaurateur de luminaires ou de vélos anciens, nettoyage de façade ou de toiture ; 3 pièces au moins photographiées avant et après. Pas pour un métier sans objet à montrer (carte-des-soins, grille-urgence), ni pour des chantiers photographiés seulement à la fin (index-projets).",
  },
  'planning-semaine': {
    id: 'planning-semaine',
    modele:
      "Le site d'une école ou d'un studio est son planning de la semaine : en tête le h1, le métier à la ville, l'ancienneté, le téléphone et la porte « Cours d'essai » ; puis la semaine, un onglet par jour (le jour même ouvert dans le navigateur ; à l'ordinateur, les jours côte à côte en colonnes), un filtre par discipline, chaque cours avec ses heures, sa durée, son niveau, sa salle et son professeur ; le premier cours (essai, prix) ; les avis ; l'école (adresse, saison, périodes sans cours) ; une page par discipline avec ses créneaux et /planning.",
    sources: [
      { fiche: 'docs/veille/architectures/planning-semaine.md', site: 'centre-danse-rouen.com' },
      { fiche: 'docs/veille/architectures/planning-semaine.md', site: 'ellzidanse.fr' },
    ],
    layout: {
      // Coquille `planning` (src/shells/planning.astro).
      shell: 'planning',
      nav: 'bar',
      hero: 'typographic',
      // Un pied d'une ligne : l'adresse, le premier cours et les disciplines sont dans le bloc de la semaine.
      footer: 'minimal',
      // Les avis juste après le premier cours : ceux qui sont venus essayer. Les disciplines sont des pages (« Cours » de
      // la barre de Germain Blanchet : Salsa cubaine, West Coast Swing, Rock…), nommées dans le planning et par le filtre :
      // pas de grille de services sur l'accueil.
      sections: [{ type: 'proof', variant: 'testimonials' }],
      contactDrawer: false,
      actionBar: false,
      servicePage: 'porte',
    },
    requis: [
      { mesure: 'planning', min: 6, libelle: '6 cours réguliers au moins avec jour, heures et nom (planning.cours[])' },
      { mesure: 'rue', min: 1, libelle: "l'adresse de l'école ou du studio (contact.address.street) : on y vient chaque semaine" },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : on vient à heure fixe" },
    ],
    convientA:
      "École ou studio à cours réguliers dont on choisit le créneau : école de danse, studio de yoga ou de pilates, salle de boxe ou d'arts martiaux, école de musique, piscine à leçons, atelier de dessin ou de poterie à séances fixes, club d'escalade ; 6 cours au moins sur 2 jours, idéalement un cours d'essai. Pas pour des stages datés seulement (cartes-empilees-agenda), ni pour une progression par niveaux sans horaire fixe (parcours-atelier).",
  },
  'catalogue-location': {
    id: 'catalogue-location',
    modele:
      "Le site d'un loueur est son parc : en tête le h1, le métier à la ville, l'ancienneté, le téléphone en grand et « Chercher un outil » ; puis le catalogue, un onglet par catégorie, chaque matériel avec ses prix par durée (demi-journée, journée, week-end, semaine), la bascule particulier TTC / professionnel HT sans script et la caution, chacun menant à sa page ; les créneaux de retrait et de retour qui ne comptent qu'une journée ; les avis ; le magasin (adresse, horaires, ce qu'il faut apporter) ; une page par matériel et /materiel.",
    sources: [
      { fiche: 'docs/veille/architectures/catalogue-location.md', site: 'locationservice.fr' },
      { fiche: 'docs/veille/architectures/catalogue-location.md', site: 'deslandes-motoculture.com' },
    ],
    layout: {
      // Coquille `location` (src/shells/location.astro).
      shell: 'location',
      nav: 'bar',
      hero: 'typographic',
      // Un pied d'une ligne : le magasin, ses horaires et ses autres services sont dans le bloc du parc.
      footer: 'minimal',
      // Les avis après les créneaux (« Astuce : louer plus longtemps pour le même prix ») : la machine, son prix, la façon
      // de payer moins, puis ceux qui ont loué. Les services du client (vente, réparation, affûtage : « Nos services » de
      // la source) restent des pages, nommées dans le pied du magasin.
      sections: [{ type: 'proof', variant: 'testimonials' }],
      contactDrawer: false,
      actionBar: false,
      servicePage: 'fiche',
    },
    requis: [
      { mesure: 'materiels', min: 6, libelle: '6 matériels au moins avec un prix (location.durees et location.materiels[].prix)' },
      { mesure: 'rue', min: 1, libelle: "l'adresse du magasin (contact.address.street) : on y prend et on y rend le matériel" },
      { mesure: 'horaires', min: 1, libelle: 'les horaires du magasin (contact.hours) : le retrait et le retour en dépendent' },
    ],
    convientA:
      "Loueur dont on choisit une machine, sa durée et son prix : location d'outillage et de matériel BTP, motoculture qui loue tondeuses et broyeurs, location de remorques, de vélos ou de kayaks, de matériel de réception ou de sonorisation, de costumes ; 6 matériels à prix au moins, des horaires de retrait. Pas pour une vente sans location (gamme-vitrine), ni pour un logement à la nuit (outil-calendrier).",
  },
  'estimation-etapes': {
    id: 'estimation-etapes',
    modele:
      "Le site d'un déménageur ou d'un artisan sur devis commence par la demande : en tête le h1, le métier à la ville, l'ancienneté, le téléphone et la note, et juste dessous (sa première étape visible sans défiler) la demande d'estimation en bande sur toute la largeur : le projet (les prestations du client en grandes cases), les questions qu'il pose au téléphone (départ, arrivée, date, volume, surface), les coordonnées, « Étape 1 sur 3 », et ce qui se passe après ; puis le dépôt et les communes desservies, les avis, les prestations (une page chacune, qui rouvre la demande réglée sur elle) ; /estimation.",
    sources: [
      { fiche: 'docs/veille/architectures/estimation-etapes.md', site: 'movers.framer.media' },
      { fiche: 'docs/veille/architectures/estimation-etapes.md', site: 'demenagement-rigoulet.com' },
      { fiche: 'docs/veille/architectures/estimation-etapes.md', site: 'les-artisans-du-batiment.com' },
    ],
    layout: {
      // Coquille `estimation` (src/shells/estimation.astro).
      shell: 'estimation',
      nav: 'bar',
      hero: 'typographic',
      footer: 'columns',
      // Movers : les prestations en vignettes, les témoignages, les régions ; Rigoulet : les prestations, les avis Google
      // recopiés. Ici la coquille pose la demande (sa propre section, sous l'en-tête), puis le dépôt et les communes ; les
      // sections suivent : les avis (la note est déjà en tête, à côté du numéro), puis les prestations en liste pour finir
      // (elles sont déjà la première étape de la demande, la barre, la ligne de liens sous le formulaire ; chaque page
      // rouvre la demande réglée sur elle). Pas de section contact en bas : la demande est en haut.
      sections: [
        { type: 'proof', variant: 'testimonials' },
        { type: 'services', variant: 'liste-a-filets' },
      ],
      contactDrawer: false,
      actionBar: false,
      servicePage: 'fiche',
    },
    requis: [
      { mesure: 'estimation', min: 2, libelle: "2 questions au moins pour la demande (estimation.questions[] : celles que le client pose au téléphone)" },
      { mesure: 'services', min: 2, libelle: '2 prestations au moins (services[]) : la première étape est le choix du projet' },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : en urgence on appelle, on ne remplit pas trois étapes" },
    ],
    convientA:
      "Métier où l'on demande un prix avant tout et où quelques réponses suffisent à le chiffrer : déménageur, couvreur, paysagiste (création), poseur de clôtures, de fenêtres ou de cuisines, ravalement, élagage, débarras, nettoyage de fin de chantier ; 2 prestations au moins et 2 questions que le client pose déjà au téléphone. Pas pour l'urgence (grille-urgence), ni pour un prix connu d'avance (formules-comparees, carte-des-soins).",
  },
  'formules-comparees': {
    id: 'formules-comparees',
    modele:
      "Le site d'un prestataire à forfaits est le choix de sa formule : en tête le h1, le métier à la ville, l'ancienneté, le téléphone et la note ; juste dessous les formules nommées côte à côte (en piste au téléphone), chacune avec son prix (et le prix en semaine), à qui elle s'adresse, sa durée, ce qu'elle comprend (« tout ce que comprend Souvenir, plus : ») et sa porte « Vérifier la disponibilité » ; ce qui est commun à toutes et les conditions ; puis les avis, l'histoire, les questions ; une page par formule avec la demande réglée sur elle, /formules en tableau.",
    sources: [
      { fiche: 'docs/veille/architectures/formules-comparees.md', site: 'micka-photographe.fr' },
      { fiche: 'docs/veille/architectures/formules-comparees.md', site: 'greencraft.framer.website' },
    ],
    layout: {
      // Coquille `formules` (src/shells/formules.astro).
      shell: 'formules',
      nav: 'bar',
      hero: 'typographic',
      footer: 'minimal',
      // Micka : sous les forfaits, la galerie, un texte long (« Vivre pleinement votre journée »), la FAQ ; GreenCraft : les
      // réalisations, les questions de facturation. Les avis d'abord (socle GOUT § 0), puis l'histoire, puis les questions.
      sections: [
        { type: 'proof', variant: 'testimonials' },
        { type: 'about', variant: 'story' },
        { type: 'faq', variant: 'accordion' },
      ],
      contactDrawer: true,
      actionBar: false,
      servicePage: 'fiche',
    },
    requis: [
      { mesure: 'formules', min: 2, libelle: '2 formules au moins avec un nom et un prix (formules.liste[])' },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : on choisit une formule à l'avance" },
    ],
    convientA:
      "Prestataire qui vend des forfaits nommés à prix fixes : photographe (mariage, séances), paysagiste ou jardinier d'entretien, pisciniste, laveur de vitres, nettoyage, ramoneur, entretien de chaudière ou de climatisation, auto-école, toiletteur, traiteur à menus, DJ ; 2 formules à prix au moins. Pas pour un chantier sur devis (estimation-etapes), ni pour une carte de soins à la minute (carte-des-soins), ni pour des cours en barreaux (parcours-atelier).",
  },
  'appareils-pannes': {
    id: 'appareils-pannes',
    modele:
      "Le site d'un réparateur part de l'appareil en panne : en tête le h1, le métier à la ville, l'ancienneté, le téléphone, la note et ce que comprend le forfait ; juste dessous « Quel appareil est en panne ? », un onglet par famille (lavage, cuisson, froid) avec son forfait, chaque appareil vers sa page et ses pannes nommées comme au téléphone (« Ne vidange plus ») vers leur ancre ; dans le même bloc, comment se passe une intervention, les communes, les marques de A à Z et « votre appareil n'est pas dans la liste ? » ; puis les avis ; une page par appareil (ses pannes et leurs causes, ses marques, le prix, Appeler), /appareils avec les questions.",
    sources: [
      { fiche: 'docs/veille/architectures/appareils-pannes.md', site: 'satisfix.fr' },
      { fiche: 'docs/veille/architectures/appareils-pannes.md', site: 'lavoiserie.fr' },
    ],
    layout: {
      // Coquille `appareils` (src/shells/appareils.astro).
      shell: 'appareils',
      nav: 'bar',
      hero: 'typographic',
      footer: 'minimal',
      // Satisfix : sous les appareils et les forfaits, les quatre étapes, les avis Google, les zones (Lyon, Saint-Étienne,
      // Ain), la FAQ. Les étapes, les communes et les marques sont DANS le bloc des appareils (on les lit une fois
      // l'appareil trouvé ; le bloc à onglets tient la moitié de la page, modèle « onglets » de ff ressemblance), le
      // contact aussi, sous la liste ; suivent les avis. Les questions passent sur /appareils (la FAQ de chaque page
      // d'appareil chez Satisfix) : à 0,46 de la page avec elles, le bloc ne tenait plus la moitié.
      sections: [
        { type: 'proof', variant: 'testimonials' },
      ],
      contactDrawer: true,
      actionBar: false,
      servicePage: 'fiche',
    },
    requis: [
      { mesure: 'appareils', min: 3, libelle: '3 appareils au moins avec leurs pannes (appareils.liste[] : les pannes que le client prend en charge)' },
    ],
    convientA:
      "Réparateur qu'on appelle pour un objet en panne, dont le client nomme les pannes : électroménager, chaudières et pompes à chaleur par appareil, vélos et trottinettes électriques, téléphones et ordinateurs, machines à café, motoculture, volets roulants et portails ; 3 appareils avec leurs pannes. Pas pour un chantier sur devis (estimation-etapes), ni pour l'envoi par colis sans déplacement (atelier-par-colis), ni pour la seule urgence à toute heure (grille-urgence).",
  },
  'commande-retrait': {
    id: 'commande-retrait',
    modele:
      "Le site d'un producteur en vente directe est le rythme de sa semaine : en tête le h1, le métier à la ville, l'ancienneté, le téléphone et la note ; juste dessous, sur l'encre, « Commandez avant le mardi à 12 h, retirez le jeudi ou le vendredi », la prochaine clôture et le prochain retrait calculés dans le navigateur ; les façons d'acheter (panier, commande sur mesure, vente à la ferme) ; l'histoire de la ferme ; puis les points de retrait, un onglet par jour, chacun avec sa commune, ses heures, à qui il est réservé et la vente sur place, et l'appel sous la liste ; puis les avis ; une page par point, /retrait avec les questions.",
    sources: [
      { fiche: 'docs/veille/architectures/commande-retrait.md', site: 'riedoasis.fr' },
      { fiche: 'docs/veille/architectures/commande-retrait.md', site: 'autempsdelasource.fr' },
    ],
    layout: {
      // Coquille `retrait` (src/shells/retrait.astro).
      shell: 'retrait',
      nav: 'bar',
      hero: 'typographic',
      footer: 'minimal',
      // Riedoasis : « 3 façons d'acheter », puis « Pourquoi choisir RiedOasis ? » (l'équipe, les sols), puis la liste des
      // points. La coquille rend les sections « about » à cette place (entre les façons et les points), les autres après
      // les points : les avis (socle GOUT § 0). Les questions sont sur /retrait : avec elles sur l'accueil, le déroulé
      // finissait comme celui d'une longue page à ancres (« à propos, questions, appel, pied », 0,67 de demo-architecte).
      // L'appel est dans le bloc des points, sous la liste.
      sections: [
        { type: 'proof', variant: 'testimonials' },
        { type: 'about', variant: 'story' },
      ],
      contactDrawer: true,
      actionBar: false,
      servicePage: 'fiche',
    },
    requis: [
      { mesure: 'retraits', min: 2, libelle: '2 points de retrait au moins avec leur jour et leurs heures (retrait.points[])' },
      { mesure: 'cloture', min: 1, libelle: 'la clôture des commandes (retrait.cloture : jour et heure, « avant mardi 12 h »)' },
    ],
    convientA:
      "Producteur ou artisan qui vend sur commande et fait retirer à jour fixe, à la ferme ou chez des partenaires : maraîcher, éleveur en colis de viande, apiculteur, fromager fermier, boulanger au levain sur commande, boucher ou traiteur à la commande, AMAP ; 2 points de retrait et une heure de clôture. Pas pour une boutique ouverte tous les jours (lieu-fixe, pages-adresses), ni pour un camion qui vend à chaque étape (tournee-semaine).",
  },
  'salles-capacites': {
    id: 'salles-capacites',
    modele:
      "Le site d'un lieu de réception part du nombre d'invités : en tête le h1, le métier à la ville, l'ancienneté, le téléphone, la note et « Réserver une visite » ; juste dessous « Combien serez-vous ? », le tableau des salles et de leurs capacités par configuration (assis, cocktail, théâtre), lisible sans script, un nombre d'invités et une configuration qui marquent dans le navigateur les salles qui conviennent ; puis les salles en grandes photos, chacune avec sa surface, ses capacités, ses équipements, vers sa page ; puis ce que le lieu met à disposition (couchages, cuisine, parking, mobilier), la règle du traiteur et l'option sur la date, et l'appel ; puis l'histoire et les avis ; une page par salle, /salles avec les questions, une page par occasion (les services).",
    sources: [
      { fiche: 'docs/veille/architectures/salles-capacites.md', site: 'domainedelatouche.fr' },
      { fiche: 'docs/veille/architectures/salles-capacites.md', site: 'domainedelachanterelle.fr' },
    ],
    layout: {
      // Coquille `salles` (src/shells/salles.astro).
      shell: 'salles',
      nav: 'bar',
      hero: 'typographic',
      footer: 'minimal',
      // Domaine de la Touche : sous le premier écran, « Découvrez nos différents espaces » (chaque salle, sa surface, ses
      // personnes assises ou en cocktail), puis les produits de la ferme, puis l'accès et le contact ; les occasions
      // (Réceptions, Séminaires) ont chacune leur page, les questions aussi (FAQ). La coquille rend l'histoire sous les
      // salles (« Un ancien corps de ferme »), les avis après le lieu ; les questions sont sur /salles.
      sections: [
        { type: 'about', variant: 'story' },
        { type: 'proof', variant: 'testimonials' },
      ],
      contactDrawer: true,
      actionBar: false,
      servicePage: 'fiche',
    },
    requis: [
      { mesure: 'salles', min: 2, libelle: '2 salles ou espaces au moins avec leurs capacités (salles.liste[] : personnes assises, en cocktail…)' },
    ],
    convientA:
      "Lieu qu'on loue pour un événement et dont le client compte les invités : domaine ou salle de réception, salle des fêtes privée, grange aménagée, château, restaurant qui privatise ses salles, traiteur avec lieu, gîte de groupe pour séminaires et retraites ; 2 espaces avec leurs capacités. Pas pour une chambre d'hôtes à la nuit (outil-calendrier), ni pour un café qui montre ses espaces sans les louer (panneaux-tranche).",
  },
  'annonces-biens': {
    id: 'annonces-biens',
    modele:
      "Le site d'une agence immobilière de quartier est sa vitrine : en tête le h1, le métier à la ville, l'ancienneté, le téléphone et la note ; juste dessous les biens, Acheter et Louer en onglets (sans script l'un sous l'autre), chaque bien en photo avec sa commune, son type, sa surface, ses pièces, son prix et sa classe énergie, « Exclusivité » quand l'agence l'a, vers sa page ; puis « Faire estimer votre bien », la porte du vendeur, avec le téléphone et la demande ; puis l'agence (l'histoire) et les avis ; une page par bien (photos, prix, qui paie les honoraires, caractéristiques, DPE et GES en échelle, charges, le négociateur à appeler), /biens rangé par projet et par type, /honoraires (le barème, obligatoire).",
    sources: [
      { fiche: 'docs/veille/architectures/annonces-biens.md', site: 'royal-immo.fr' },
      { fiche: 'docs/veille/architectures/annonces-biens.md', site: 'giboire.com' },
    ],
    layout: {
      // Coquille `biens` (src/shells/biens.astro).
      shell: 'biens',
      nav: 'bar',
      hero: 'typographic',
      footer: 'minimal',
      // Royal Immo : la recherche, « Faites estimer votre bien par un professionnel », puis la présentation de l'agence
      // familiale (« depuis 2005 »), puis les biens « coup de cœur » ; Giboire : Acheter, Louer, Estimer, Faire gérer en
      // tête. Ici la vitrine vient d'abord (c'est ce qu'on vient voir), l'estimation ensuite, l'agence et les avis après.
      sections: [
        { type: 'about', variant: 'story' },
        { type: 'proof', variant: 'testimonials' },
      ],
      contactDrawer: true,
      actionBar: false,
      servicePage: 'fiche',
    },
    requis: [
      { mesure: 'biens', min: 3, libelle: '3 biens au moins à vendre ou à louer (biens.liste[] : titre, projet, commune, prix)' },
    ],
    convientA:
      "Agence immobilière indépendante ou mandataire de quartier qui tient elle-même une vingtaine d'annonces : transaction, location, terrains, garages, immobilier de loisir ; 3 biens avec leur prix. Au-delà d'une trentaine de biens, les annonces viennent du logiciel de l'agence (flux à brancher, pas encore fait). Pas pour un promoteur de programmes neufs, ni pour un loueur de matériel (catalogue-location).",
  },
  'revendeurs-secteurs': {
    id: 'revendeurs-secteurs',
    modele:
      "Le site d'un producteur vendu chez d'autres répond à « où en trouver près de chez moi ? » : en tête le h1, le métier à la ville, l'ancienneté, le téléphone, la note et « Venir à la brasserie » ; juste dessous les revendeurs, un onglet par secteur (département, agglomération), rangés par commune de A à Z, chacun avec son genre (caviste, bar, épicerie), « À la pression », « Reprend la consigne », un filtre par genre dans le navigateur ; dans le même bloc la vente sur place (adresse, horaires), la règle de la consigne et la porte des pros ; puis la gamme (les services, une page chacun), l'histoire et les avis ; /ou-trouver et une page par secteur.",
    sources: [
      { fiche: 'docs/veille/architectures/revendeurs-secteurs.md', site: 'brasseriedesgarrigues.fr' },
      { fiche: 'docs/veille/architectures/revendeurs-secteurs.md', site: 'brasserie-bendorf.fr' },
    ],
    layout: {
      // Coquille `revendeurs` (src/shells/revendeurs.astro).
      shell: 'revendeurs',
      nav: 'bar',
      hero: 'typographic',
      footer: 'minimal',
      // Brasserie des Garrigues : « Points de vente » dans la barre, la page part de « Trouvez la boutique la plus proche de
      // chez vous », Gard / Hérault puis autres départements, chaque point avec son genre ; la gamme a ses pages (Bières,
      // Sans alcool, Barrique), la vente sur place et la visite sont à l'accueil. Bendorf : les revendeurs de Strasbourg puis
      // hors Eurométropole. La coquille rend la gamme sous les revendeurs, l'histoire puis les avis.
      sections: [
        { type: 'about', variant: 'story' },
        { type: 'proof', variant: 'testimonials' },
      ],
      contactDrawer: true,
      actionBar: false,
      servicePage: 'fiche',
    },
    requis: [
      { mesure: 'revendeurs', min: 6, libelle: '6 revendeurs au moins avec leur commune et leur secteur (revendeurs.liste[])' },
    ],
    convientA:
      "Producteur dont les clients achètent chez d'autres : brasserie artisanale, vigneron, cidrerie, distillerie, torréfacteur, chocolatier ou biscuiterie en dépôts, fromager fermier en crèmeries, savonnier en boutiques, maraîcher en épiceries ; 6 revendeurs sur un ou plusieurs secteurs. Pas pour des points de retrait à jour fixe (commande-retrait), ni pour les boutiques du client lui-même (pages-adresses).",
  },
  'profils-patients': {
    id: 'profils-patients',
    modele:
      "Le site d'un cabinet de santé part du patient : en tête le h1, le métier à la ville, l'ancienneté, le téléphone, la note et « Prendre rendez-vous » ; juste dessous « Vous consultez pour », un onglet par profil (nourrisson, femme enceinte, sportif, adulte, sénior), chacun avec ses motifs de consultation, sa durée et son prix, le praticien qui le suit et sa porte vers sa page ; dans le même bloc les temps de la séance, le tarif, la prise en charge par les mutuelles, les praticiens et leurs spécialités, l'appel ; puis l'accès au cabinet et les horaires, les avis et les questions ; une page par profil (motifs, séance, questions, rendez-vous) et /consulter.",
    sources: [
      { fiche: 'docs/veille/architectures/profils-patients.md', site: 'osteopathe-lyon.fr' },
      { fiche: 'docs/veille/architectures/profils-patients.md', site: 'osteopathe-annecy.fr' },
    ],
    layout: {
      // Coquille `profils` (src/shells/profils.astro).
      shell: 'profils',
      nav: 'bar',
      hero: 'typographic',
      footer: 'minimal',
      // Ostéopathes à Lyon Préfecture : sous le h1, « Je suis à la recherche d'un ostéopathe pour » et six profils, puis
      // les praticiens, l'accès, les avis, les questions ; une page par profil, « Infos pratiques » (tarif, déroulé,
      // accès). Margot Debayle : le tableau prestation, durée, tarif, remboursement juste sous le premier écran. La
      // coquille rend la séance et les praticiens dans le bloc des profils, puis l'accès ; ensuite les avis et les
      // questions, comme à Lyon (pas d'histoire : un cabinet se présente par ses praticiens).
      sections: [
        { type: 'proof', variant: 'testimonials' },
        { type: 'faq', variant: 'accordion' },
      ],
      contactDrawer: true,
      actionBar: false,
      servicePage: 'fiche',
    },
    requis: [
      { mesure: 'profils', min: 3, libelle: '3 profils de patients au moins, chacun avec ses motifs de consultation (profils.liste[])' },
      { mesure: 'pasUrgence', libelle: 'pas l’urgence 24 h (contact.emergency24h) : un cabinet sur rendez-vous' },
    ],
    convientA:
      "Cabinet de santé ou de soin sur rendez-vous dont les patients se reconnaissent à un profil : ostéopathe, kinésithérapeute, sage-femme, psychomotricien, podologue, diététicien, orthophoniste, sophrologue ; 3 profils avec leurs motifs. Pas pour un soin minuté à la carte (carte-des-soins), ni pour des cours collectifs (planning-semaine).",
  },
  'garde-especes': {
    id: 'garde-especes',
    modele:
      "Le site d'une clinique vétérinaire part de « qui appeler maintenant ? » : en tête le bandeau Urgences, le h1, le métier à la ville, l'ancienneté, la note ; deux portes côte à côte, « Prendre rendez-vous » avec les horaires du jour et « Une urgence ? » avec le numéro du moment (la clinique ouverte, la garde fermée, calculé dans le navigateur) ; puis UN bloc à onglets, « Urgences » (la conduite à tenir en temps numérotés, les signes qui n'attendent pas, la garde) et une espèce par onglet (soins, conseils, rendez-vous), ouvert d'office sur l'urgence quand la clinique est fermée ; venir, les services et les questions dans le même bloc ; les avis, le dernier appel ; /urgences, /animaux et une page par espèce.",
    sources: [
      { fiche: 'docs/veille/architectures/garde-especes.md', site: 'clinique-les-quais.fr' },
      { fiche: 'docs/veille/architectures/garde-especes.md', site: 'vetosaintmax.fr' },
    ],
    layout: {
      // Coquille `garde` (src/shells/garde.astro).
      shell: 'garde',
      nav: 'bar',
      hero: 'typographic',
      footer: 'minimal',
      // Les Quais : « URGENCES » en dernier lien de la barre et au pied, « Que faire en cas d'urgence vétérinaire ? » en
      // trois temps, les conseils par espèce. Saint-Max : sous le h1, « Prendre RDV en ligne » et « En cas d'urgence » côte
      // à côte ; la page Urgence. La coquille rend un bloc à onglets (l'urgence, puis une espèce par onglet ; venir et les
      // services dans le même bloc) ; ensuite les avis et les questions (« FAQ » de Saint-Max).
      sections: [
        { type: 'proof', variant: 'testimonials' },
        { type: 'faq', variant: 'accordion' },
      ],
      contactDrawer: true,
      actionBar: false,
      servicePage: 'fiche',
    },
    requis: [
      { mesure: 'garde', min: 1, libelle: 'la conduite à tenir en cas d’urgence (garde.etapes[]) ou un numéro de garde propre' },
      { mesure: 'especes', min: 2, libelle: '2 espèces soignées au moins (especes[] : slug, nom)' },
    ],
    convientA:
      "Clinique ou cabinet vétérinaire de quartier ou de campagne qui reçoit sur rendez-vous et assure (ou organise) une garde : canine, mixte, NAC, équine ; 2 espèces et la conduite à tenir en urgence dans ses mots. Aussi un maréchal-ferrant ou un ostéopathe animalier avec une permanence. Pas pour un cabinet de santé humaine (profils-patients), ni pour un dépanneur à l'heure (grille-urgence).",
  },
  'honoraires-domaines': {
    id: 'honoraires-domaines',
    modele:
      "Le site d'un cabinet d'avocat dit combien et comment ça commence : en tête le h1, le métier à la ville, l'ancienneté, où consulter ; à côté le premier échange en temps (l'appel découverte, la première consultation avec sa durée et son prix), « Prendre rendez-vous » et le téléphone ; puis UN bloc à onglets, un domaine par onglet avec ses procédures et leur « à partir de » et sa page ; dans le même bloc les façons de fixer l'honoraire (forfait, temps passé, résultat), la convention, la prise en charge (protection juridique, aide juridictionnelle), le cabinet et les questions ; l'avocat ensuite ; /nos-honoraires.",
    sources: [
      { fiche: 'docs/veille/architectures/honoraires-domaines.md', site: 'faltot-avocat.fr' },
      { fiche: 'docs/veille/architectures/honoraires-domaines.md', site: 'judisis.fr' },
    ],
    layout: {
      // Coquille `honoraires` (src/shells/honoraires.astro).
      shell: 'honoraires',
      nav: 'bar',
      hero: 'typographic',
      footer: 'minimal',
      // Faltot : sous le nom, les six domaines en pictogrammes vers « Nos activités », « Contactez-nous » et le numéro, les
      // actualités ; la page Honoraires (taux, forfait, convention, résultat, première consultation, appel découverte,
      // protection juridique, aide juridictionnelle, médiateur). Judisis : domaines dépliés en procédures, « à partir de »
      // par procédure, « Consultation en ligne ». La coquille rend les domaines en onglets, les honoraires, le cabinet et
      // les questions dans un seul bloc ; ensuite l'avocat.
      sections: [
        { type: 'about', variant: 'story' },
        { type: 'faq', variant: 'accordion' },
      ],
      contactDrawer: true,
      actionBar: false,
      servicePage: 'fiche',
    },
    requis: [
      { mesure: 'honoraires', min: 1, libelle: 'un prix dit par le cabinet (honoraires.consultation, .decouverte ou .modes[] avec prix)' },
      { mesure: 'lignesPrix', min: 2, libelle: '2 domaines au moins avec leurs procédures (services[].lignes, prix « à partir de » si le cabinet les donne)' },
    ],
    convientA:
      "Avocat ou petit cabinet (deux à cinq avocats) qui travaille pour des particuliers et annonce ses prix : famille et divorce, travail, pénal routier, baux, consommation ; aussi un notaire qui publie ses émoluments, un médiateur familial, un commissaire de justice. 2 domaines avec leurs procédures et un prix de première consultation. Pas pour un cabinet d'affaires sans prix publics, ni pour des formules de prestations comparées (formules-comparees).",
  },
  'carnet-interventions': {
    id: 'carnet-interventions',
    modele:
      "Le site d'un artisan qui intervient chez les gens est son carnet de bord : en tête le h1, le métier à la ville, l'ancienneté, le téléphone en grand, et à côté la dernière intervention (le jour, le lieu, « il y a 3 jours » calculé dans le navigateur, ce qui s'est passé) ; puis le carnet lui-même, les interventions du plus récent au plus ancien rangées par mois, le mois collé en marge pendant qu'on descend, chacune datée, située (quartier ou commune), racontée en temps (l'appel, ce qui a été fait, la durée) avec sa photo ; les lieux du carnet, du plus fréquent au moins fréquent ; les avis, venir ou appeler ; les services en pages (la barre y mène) ; /carnet (avec les questions) et une page par intervention, avec la plus récente et la plus ancienne pour se promener dans le temps.",
    sources: [
      { fiche: 'docs/veille/architectures/carnet-interventions.md', site: 'serrurier-nimes30.fr' },
      { fiche: 'docs/veille/architectures/carnet-interventions.md', site: 'atelier-bois-acier.fr' },
    ],
    layout: {
      // Coquille `interventions` (src/shells/interventions.astro).
      shell: 'interventions',
      nav: 'bar',
      hero: 'typographic',
      footer: 'liens',
      // Monsieur Boris : le h1 et le gérant devant sa boutique, le numéro partout, puis services, tarifs, avis, questions ;
      // le blog = 25 récits datés et situés (« Castanet », « Vacquerolles »), chacun en temps et suivi de ses questions.
      // L'Atelier Bois Acier : « En direct de l'atelier », trois réalisations racontées, sur l'accueil. La coquille met le
      // carnet en tête (c'est la preuve que l'artisan est du coin et travaille), puis les lieux et les avis ; les services sont
      // des pages (la barre y mène), les questions sont sur /carnet : pas de fin de page d'usine (communes, bandeau, questions).
      sections: [
        { type: 'proof', variant: 'testimonials' },
      ],
      contactDrawer: true,
      actionBar: true,
      servicePage: 'fiche',
    },
    requis: [
      { mesure: 'interventions', min: 4, libelle: '4 interventions datées et situées au moins (interventions[] : slug, date, lieu, titre)' },
    ],
    convientA:
      "Artisan qui intervient chez les gens et peut raconter ses interventions : serrurier, plombier, électricien, vitrier, ramoneur, élagueur, dératiseur, chauffagiste, maçon de petite rénovation ; aussi un ébéniste ou un ferronnier qui publie ses pièces au fil de l'atelier. 4 interventions datées et situées, idéalement une par semaine. Pas pour un artisan qui ne montre que de grands chantiers finis (index-projets, avant-apres), ni pour un commerce à adresse fixe.",
  },
  'rayon-trajet': {
    id: 'rayon-trajet',
    modele:
      "Le site d'un artisan qui se déplace part de « est-ce qu'il vient jusque chez moi, et en combien de temps ? » : en tête le h1, le métier à la ville, le téléphone, et à côté « Combien de temps pour venir chez vous ? » (on tape sa commune, la réponse vient dans le navigateur ; sans script, le tableau) ; puis le territoire vu de l'atelier : la base au centre, des cercles de 15, 30, 60 minutes, les communes posées sur le cercle de leur temps dans leur direction, chacune vers sa page ; à côté, le tableau des communes de la plus proche à la plus loin (minutes, kilomètres) et la phrase pour une commune absente ; les avis, la base ; les services en pages (la barre y mène) ; /trajet (avec les questions) et une page par commune avec son temps et ses voisines.",
    sources: [
      { fiche: 'docs/veille/architectures/rayon-trajet.md', site: 'colson-elec.fr' },
      { fiche: 'docs/veille/architectures/rayon-trajet.md', site: 'conceptfroid.fr' },
    ],
    layout: {
      // Coquille `trajet` (src/shells/trajet.astro).
      shell: 'trajet',
      nav: 'bar',
      hero: 'typographic',
      footer: 'liens',
      // Colson Elec : « Je ne suis jamais loin », l'atelier au centre et cinq communes autour (km, minutes), « Votre commune
      // n'est pas citée ? Appelez quand même ». Concept Froid Centre : « Zone d'intervention, 200 km autour de Suèvres »,
      // huit pôles en temps de trajet juste sous les métiers, une page par pôle. La coquille met le territoire en tête, puis
      // les avis et la base ; les services sont des pages (la barre y mène, comme les métiers de Concept Froid), les questions
      // sont sur /trajet : pas de fin de page d'usine.
      sections: [
        { type: 'proof', variant: 'testimonials' },
      ],
      contactDrawer: true,
      actionBar: false,
      servicePage: 'fiche',
    },
    requis: [
      { mesure: 'trajet', min: 4, libelle: '4 communes au moins avec leur temps de trajet (trajet.communes[] : slug, nom, minutes)' },
      { mesure: 'directionsTrajet', min: 3, libelle: '3 communes au moins avec leur direction depuis la base (trajet.communes[].direction), pour le schéma' },
    ],
    convientA:
      "Artisan ou dépanneur qui se déplace depuis une base et dont le client demande d'abord « vous venez jusqu'ici ? » : électricien, frigoriste, chauffagiste, plombier de campagne, ramoneur, élagueur, piscinier, réparateur à domicile, laveur de vitres ; 4 communes avec leur temps de trajet, dont 3 avec leur direction. Pas pour une tournée à jours fixes (tournee-semaine), ni pour un commerce où l'on vient (pages-adresses).",
  },
  'calendrier-recoltes': {
    id: 'calendrier-recoltes',
    modele:
      "Le site d'une ferme ou d'une cueillette est son année : en tête le h1, le métier à la ville, le téléphone, et à côté « En ce moment » (les produits du mois du visiteur, choisi dans le navigateur, rangés par famille, chacun vers sa page ; sans script le mois du build) avec la phrase sur la météo et le répondeur de la liste du jour ; puis le calendrier des récoltes, chaque produit sur une rangée de douze mois, rangé par famille, le mois courant marqué ; les avis ; venir (adresse, saison d'ouverture, horaires) ; /calendrier mois par mois (avec les questions) et une page par produit avec sa période de récolte et ce qui se récolte en même temps.",
    sources: [
      { fiche: 'docs/veille/architectures/calendrier-recoltes.md', site: 'cueillettedecompans.fr' },
      { fiche: 'docs/veille/architectures/calendrier-recoltes.md', site: 'jardindelavenir.fr' },
    ],
    layout: {
      // Coquille `recoltes` (src/shells/recoltes.astro).
      shell: 'recoltes',
      nav: 'bar',
      hero: 'typographic',
      footer: 'liens',
      // Compans : « Calendrier des récoltes » dans la barre haute, « En ce moment » par fruits, légumes et fleurs, une page par
      // produit avec sa période de récolte. Le Jardin de l'Avenir : « À cueillir en ce moment », le plan daté du jardin et le
      // répondeur. La coquille met l'année en tête, puis les avis et l'accès ; les questions sont sur /calendrier : pas de fin
      // de page d'usine.
      sections: [
        { type: 'proof', variant: 'testimonials' },
      ],
      contactDrawer: true,
      actionBar: false,
      servicePage: 'fiche',
    },
    requis: [
      { mesure: 'recoltes', min: 6, libelle: '6 produits au moins avec leurs mois de récolte (recoltes.produits[] : slug, nom, famille, mois)' },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : on vient à la ferme, on n'y appelle pas la nuit" },
    ],
    convientA:
      "Ferme en vente directe, cueillette, maraîcher, arboriculteur, horticulteur ou pépiniériste dont l'offre change avec les mois : fruits, légumes, fleurs coupées, plants, sapins ; aussi un apiculteur (miels par floraison) ou un fromager fermier (fromages de saison). 6 produits avec leurs mois de récolte. Pas pour une gamme stable (gamme-vitrine), ni pour des paniers à commander avant un jour fixe (commande-retrait).",
  },
  'nuancier-matieres': {
    id: 'nuancier-matieres',
    modele:
      "Le site d'un artisan qui travaille une matière se choisit par la matière : en tête le h1, le métier à la ville, le téléphone, et à côté « Pour quel usage ? » (chaque usage et ses matières, chacune vers sa page) ; puis le nuancier, le mur des matières en grands carrés (la photo du fil, du grain ou de la trame, le nom, l'origine) ; l'échelle du client (dureté, densité) en barres, chaque matière à sa vraie valeur ; les avis ; l'atelier et ses échantillons ; /matieres en tableau comparé (avec les questions) et une page par matière (photo en grand, fiche à filets, usages, prix, voisines sur l'échelle).",
    sources: [
      { fiche: 'docs/veille/architectures/nuancier-matieres.md', site: 'menuiserie-pipault-89.com' },
      { fiche: 'docs/veille/architectures/nuancier-matieres.md', site: 'boudbois.fr' },
    ],
    layout: {
      // Coquille `matieres` (src/shells/matieres.astro).
      shell: 'matieres',
      nav: 'bar',
      hero: 'typographic',
      footer: 'liens',
      // Pipault : « Essence bois » dans la barre, dix essences en fiches (photo, aubier, grain, densité, dureté, durabilité,
      // usages). Boud'bOis : « Nos essences disponibles » sur l'accueil, une fiche par essence avec usage et prix moyen. La
      // coquille met le nuancier en tête, puis l'échelle, les avis et l'atelier ; les questions sont sur /matieres.
      sections: [
        { type: 'proof', variant: 'testimonials' },
      ],
      contactDrawer: true,
      actionBar: false,
      servicePage: 'fiche',
    },
    requis: [
      { mesure: 'matieres', min: 4, libelle: '4 matières au moins avec leur photo en gros plan (matieres.liste[] : slug, nom, photo)' },
    ],
    convientA:
      "Artisan dont le client choisit d'abord la matière : menuisier, ébéniste, parqueteur, marbrier, tailleur de pierre, tapissier (tissus), sellier (cuirs), carreleur, scierie ou négoce de bois local, potier (terres et émaux). 4 matières avec leur photo en gros plan, idéalement une valeur comparable (dureté, densité). Pas pour une gamme de produits finis (gamme-vitrine), ni pour des réalisations à montrer d'abord (index-projets, avant-apres).",
  },
  'mur-producteurs': {
    id: 'mur-producteurs',
    modele:
      "Le site d'un magasin de producteurs est le mur de ses producteurs : à l'ordinateur, une colonne collée à gauche tient le magasin (h1, métier à la ville, ancienneté, note, téléphone, horaires du jour, adresse) et « Qui fait quoi » (chaque rayon et ses producteurs, chacun vers sa fiche), pendant que le mur défile à côté : les producteurs en grille, portrait, ferme, commune, « à 12 km » s'il est donné, ce qu'ils apportent ; puis les avis et venir ; au téléphone la colonne passe en tête ; /producteurs du plus proche au plus loin (avec les questions) et une page par producteur (personnes, ferme, labels, présence au magasin, voisins du même rayon).",
    sources: [
      { fiche: 'docs/veille/architectures/mur-producteurs.md', site: 'comboirepaysan.fr' },
      { fiche: 'docs/veille/architectures/mur-producteurs.md', site: 'dose-epicerie.com' },
    ],
    layout: {
      // Coquille `producteurs` (src/shells/producteurs.astro).
      shell: 'producteurs',
      nav: 'bar',
      hero: 'typographic',
      footer: 'liens',
      // Comboire Paysan : « Les producteurs » dans la barre, l'accueil rangé par produit avec la ferme de chacun, une fiche
      // par producteur ; Dose : « Nos producteurs » et leur carte. La coquille tient le magasin dans une colonne collée et
      // le mur à côté ; les avis suivent, les questions sont sur /producteurs : pas de fin de page d'usine.
      sections: [
        { type: 'proof', variant: 'testimonials' },
      ],
      contactDrawer: true,
      actionBar: false,
      servicePage: 'fiche',
    },
    requis: [
      { mesure: 'producteurs', min: 4, libelle: '4 producteurs au moins (producteurs.liste[] : slug, nom, commune)' },
      { mesure: 'pasUrgence', libelle: "pas un métier d'urgence (contact.emergency24h) : on vient au magasin, on n'y appelle pas la nuit" },
    ],
    convientA:
      "Magasin de producteurs, épicerie en circuit court, crèmerie, primeur, boucherie qui nomme ses éleveurs, cave qui nomme ses vignerons, restaurant locavore : le client demande d'où viennent les produits et qui les fait. 4 producteurs avec leur commune, idéalement leur distance et un portrait. Pas pour un seul producteur qui vend sa récolte (calendrier-recoltes), ni pour un producteur qui liste ses revendeurs (revendeurs-secteurs).",
  },
  'tableau-departs': {
    id: 'tableau-departs',
    modele:
      "Le site d'un taxi ou d'un transporteur est son tableau des départs : en tête le h1, le métier à la ville, le téléphone, et à côté le tableau des trajets au départ de la base, rangés par genre (aéroports, gares, stations), chaque destination avec sa distance, sa durée et son prix s'il le publie, chacune vers sa page ; « Votre destination n'est pas listée ? » et le téléphone ; « À quelle heure partir ? » (l'heure du vol ou du train, la prise en charge calculée dans le navigateur avec l'avance et la marge du client) ; les avis en piste ; la demande ; /trajets (avec les questions) et une page par trajet (repère : distance, durée, itinéraire, à fournir ; prix jour et nuit ; l'heure de prise en charge ; les autres trajets).",
    sources: [
      { fiche: 'docs/veille/architectures/tableau-departs.md', site: 'taxi-annecy.fr' },
      { fiche: 'docs/veille/architectures/tableau-departs.md', site: 'taxichamonix.fr' },
    ],
    layout: {
      // Coquille `departs` (src/shells/departs.astro).
      shell: 'departs',
      nav: 'bar',
      hero: 'typographic',
      footer: 'liens',
      // Taxi Annecy : « Départs · Annecy », une ligne par destination (distance, durée, « Voir le trajet »), une page par
      // trajet ; VTC Rousseau : tarifs au départ ou à destination de Chamonix, jour et nuit. La coquille rend le tableau, l'outil,
      // les avis en piste et la demande elle-même : aucune section de fin de page d'usine.
      sections: [],
      contactDrawer: false,
      actionBar: false,
      servicePage: 'fiche',
    },
    requis: [
      { mesure: 'departs', min: 4, libelle: '4 trajets au moins avec leur durée (departs.trajets[] : slug, destination, minutes)' },
    ],
    convientA:
      "Taxi, VTC, navette, ambulance ou transport de personnes, déménageur ou coursier à destinations fixes : le client demande d'abord combien de temps, combien, et à quelle heure on vient le chercher. 4 trajets avec leur durée, idéalement la distance, le prix et l'avance à prévoir. Pas pour un artisan qui vient chez le client (rayon-trajet), ni pour une tournée à jours fixes (tournee-semaine).",
  },
  'sessions-places': {
    id: 'sessions-places',
    modele:
      "Le site d'une auto-école est son guichet des sessions : en tête le h1, le métier à la ville, l'ancienneté, la note, le téléphone, l'inscription ; puis les prochaines sessions de toutes les formations en billets datés (le jour, la formation, les horaires, le prix, les places qui restent ou « Complet »), chacun vers sa formation, les sessions passées retirées au build et dans le navigateur ; puis les formations en colonnes par catégorie (voiture, deux-roues, code), chacune avec son prix et sa prochaine date ; les avis ; l'agence, les horaires, le centre d'examen et la demande ; /formations (avec les questions) et une page par formation (prérequis, ce qui est compris, pièces à fournir, toutes ses sessions, « S'inscrire »).",
    sources: [
      { fiche: 'docs/veille/architectures/sessions-places.md', site: 'moto-auto-ecole.com' },
    ],
    layout: {
      // Coquille `sessions` (src/shells/sessions.astro).
      shell: 'sessions',
      nav: 'bar',
      hero: 'typographic',
      footer: 'liens',
      // MAP : chaque agence a sa vitrine de formations à prix, chaque formation sa fiche (prérequis, pièces, évaluation de
      // départ, centre d'examen) et ses sessions datées à places comptées. La coquille rend billets, formations, avis et
      // demande : aucune section de fin de page d'usine.
      sections: [],
      contactDrawer: false,
      actionBar: false,
      servicePage: 'fiche',
    },
    requis: [
      { mesure: 'formations', min: 3, libelle: '3 formations au moins (formations.liste[] : slug, nom)' },
      { mesure: 'sessions', min: 2, libelle: '2 sessions datées à venir au moins (formations.liste[].sessions[] : debut AAAA-MM-JJ)' },
    ],
    convientA:
      "Auto-école, moto-école, bateau-école, centre de formation (secourisme, CACES, habilitations), stage de récupération de points, école de cuisine ou atelier à stages datés : le client demande d'abord quand est la prochaine session et s'il reste de la place. 3 formations et 2 sessions datées, idéalement les prix, les places restantes et les prérequis. Pas pour des cours chaque semaine (planning-semaine), ni pour un parcours à étapes sans dates (parcours-atelier), ni pour des événements sans inscription (cartes-empilees-agenda).",
  },
  'forfaits-atelier': {
    id: 'forfaits-atelier',
    modele:
      "Le site d'un garage est son comptoir de forfaits : en tête le h1, le métier à la ville, l'ancienneté, la note, le téléphone, ce qui se fait sans rendez-vous ; puis « Votre voiture ? » (le gabarit choisi au doigt, sans script tous les prix) et les forfaits en tickets : le prix pour cette voiture, « Ce prix comprend » ligne à ligne (pièces, main-d'œuvre), pour quelles voitures, sans ou sur rendez-vous, chacun vers sa page ; puis ce qu'il faut apporter et le véhicule de prêt à côté des deux files (sans rendez-vous, sur rendez-vous) ; les avis ; l'adresse, les horaires et la demande ; /forfaits en tableau comparé (forfait par gabarit, avec les questions) et une page par forfait (le ticket, les autres forfaits).",
    sources: [
      { fiche: 'docs/veille/architectures/forfaits-atelier.md', site: 'garagedelaroutenationale.fr' },
      { fiche: 'docs/veille/architectures/forfaits-atelier.md', site: 'garagedelarepublique38.fr' },
    ],
    layout: {
      // Coquille `forfaits` (src/shells/forfaits.astro).
      shell: 'forfaits',
      nav: 'bar',
      hero: 'typographic',
      footer: 'liens',
      // Route Nationale : Accueil, Forfaits, Contact, le numéro dans la barre, les forfaits à prix dès l'accueil ; République :
      // forfaits, tarifs d'atelier, prix par gabarit. La coquille rend le comptoir, les deux files, les avis et la demande.
      sections: [],
      contactDrawer: false,
      actionBar: false,
      servicePage: 'fiche',
    },
    requis: [
      { mesure: 'forfaits', min: 4, libelle: '4 forfaits à prix au moins (forfaits.liste[] : slug, nom, prix ou tarifs par gabarit)' },
    ],
    convientA:
      "Garage, centre auto, carrossier, réparateur de pare-brise, station de lavage, mécanicien moto ou vélo, ramoneur à prix fixes : le client demande d'abord combien pour sa voiture et ce qui est compris. 4 forfaits à prix, idéalement ce que chacun comprend, le prix par gabarit et le rendez-vous. Pas pour des pannes à diagnostiquer appareil par appareil (appareils-pannes), ni pour des formules d'un même service (formules-comparees), ni pour des prix par créneau d'urgence (grille-urgence).",
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
export const COQUILLES_A_INDEX_REALISATIONS: readonly string[] = ['panneaux', 'carnet', 'avant-apres'];

/** Ce que donneesManquantes() lit d'un site : un sous-ensemble du Site, pour tester sans tout construire. */
export interface SiteArchi {
  images?: { hero?: unknown };
  services?: { image?: unknown; lignes?: { duree?: string }[]; saison?: string; programme?: { jours?: string; lignes?: unknown[] }[] }[];
  about?: { portrait?: unknown; story?: string; espaces?: { photo?: unknown }[] };
  proof?: { gallery?: { kind?: string }[] };
  realisations?: { kind?: string; photos?: unknown[]; avant?: unknown[] }[];
  contact?: { hours?: unknown[]; address?: { street?: string }; emergency24h?: boolean };
  agenda?: { date: string }[];
  produits?: { photo?: unknown }[];
  lieux?: { address?: { street?: string }; hours?: unknown[]; photo?: unknown; photos?: unknown[] }[];
  sorties?: { periode?: string; photo?: unknown }[];
  tournee?: { jour?: string; commune?: string; hours?: string }[];
  artistes?: { photo?: unknown; photos?: unknown[]; styles?: string[] }[];
  fetes?: { du?: string; au?: string; lignes?: unknown[]; photo?: unknown }[];
  disponibilites?: { occupe?: unknown[]; ics?: string };
  parcours?: { formules?: unknown[]; photo?: unknown }[];
  tarifs?: { situations?: { prix?: string[] }[]; delai?: string };
  envoi?: { etapes?: { ou?: string; titre?: string }[] };
  planning?: { cours?: { jour?: string; debut?: string; fin?: string; nom?: string }[] };
  location?: { durees?: string[]; materiels?: { slug?: string; nom?: string; prix?: string[] }[] };
  estimation?: { questions?: { nom?: string; libelle?: string; type?: string; choix?: string[] }[] };
  formules?: { liste?: { slug?: string; nom?: string; prix?: string }[] };
  appareils?: { liste?: { slug?: string; nom?: string; pannes?: { nom?: string }[] }[] };
  retrait?: { cloture?: { jour?: string; heure?: string }; points?: { slug?: string; nom?: string; commune?: string; jour?: string; debut?: string; fin?: string }[] };
  salles?: { liste?: { slug?: string; nom?: string; capacites?: Record<string, number | undefined> }[] };
  biens?: { liste?: { slug?: string; titre?: string; projet?: string; commune?: string; prix?: number }[] };
  revendeurs?: { liste?: { nom?: string; commune?: string; secteur?: string }[] };
  profils?: { liste?: { slug?: string; nom?: string; motifs?: string[] }[] };
  especes?: { slug?: string; nom?: string }[];
  garde?: { telephone?: string; telephoneAffiche?: string; etapes?: { titre?: string }[] };
  honoraires?: { decouverte?: { prix?: string; duree?: string }; consultation?: { prix?: string; duree?: string }; modes?: { nom?: string; prix?: string }[] };
  interventions?: { slug?: string; date?: string; lieu?: string; titre?: string; photo?: unknown }[];
  trajet?: { communes?: { slug?: string; nom?: string; minutes?: number; direction?: string }[] };
  recoltes?: { produits?: { slug?: string; nom?: string; famille?: string; mois?: number[]; photo?: unknown }[] };
  matieres?: { liste?: { slug?: string; nom?: string; photo?: unknown }[] };
  producteurs?: { liste?: { slug?: string; nom?: string; commune?: string; photo?: unknown }[] };
  departs?: { trajets?: { slug?: string; destination?: string; minutes?: number; photo?: unknown }[] };
  formations?: { liste?: { slug?: string; nom?: string; photo?: unknown; sessions?: { debut?: string; fin?: string }[] }[] };
  forfaits?: { liste?: { slug?: string; nom?: string; prix?: string; tarifs?: { gabarit?: string; prix?: string }[]; photo?: unknown }[] };
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

// Lecture des jours et heures de site.retrait (mêmes règles que src/lib/retrait.ts, recopiées : module pur).
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
const JOURS_MIN = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const sansAccent = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '');

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
    (s.parcours ?? []).filter((x) => x.photo).length +
    (s.realisations ?? []).reduce((n, r) => n + (r.photos?.length ?? 0), 0) +
    (s.interventions ?? []).filter((x) => x.photo).length +
    (s.recoltes?.produits ?? []).filter((x) => x.photo).length +
    (s.matieres?.liste ?? []).filter((x) => x.photo).length +
    (s.producteurs?.liste ?? []).filter((x) => x.photo).length +
    (s.departs?.trajets ?? []).filter((x) => x.photo).length +
    (s.formations?.liste ?? []).filter((x) => x.photo).length +
    (s.forfaits?.liste ?? []).filter((x) => x.photo).length
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
      // Même règle que lienDisponibilites (src/lib/sejour.ts), recopiée.
      case 'calendrier': n = s.disponibilites && ((s.disponibilites.occupe ?? []).length > 0 || s.disponibilites.ics) ? 1 : 0; break;
      // Même compte que barreauxComplets (src/lib/parcours.ts), recopié.
      case 'parcours': n = (s.parcours ?? []).filter((b) => (b.formules ?? []).length > 0).length; break;
      // Mêmes comptes que situationsCompletes (src/lib/tarifs.ts) et etapesCompletes (src/lib/colis.ts), recopiés.
      case 'situations': n = (s.tarifs?.situations ?? []).filter((x) => (x.prix ?? []).some((p) => p.trim())).length; break;
      case 'envoi': n = (s.envoi?.etapes ?? []).filter((x) => (x.ou ?? '').trim() && (x.titre ?? '').trim()).length; break;
      // Mêmes comptes que soinsDates (src/lib/soins.ts, minutesDeDuree) et piecesAvantApres (src/lib/avantapres.ts), recopiés.
      case 'soins': {
        const minutes = (d = '') => {
          const t = d.toLowerCase().replace(/\s+/g, '');
          const h = /^(\d{1,2})h(\d{1,2})?(?:min)?$/.exec(t);
          if (h) return Number(h[1]) * 60 + Number(h[2] ?? 0);
          const m = /^(\d{1,3})(?:min|mn|minutes?)$/.exec(t);
          return m ? Number(m[1]) : 0;
        };
        const lisible = (d?: string) => minutes(d) > 0;
        n = (s.services ?? []).reduce((k, x) => k + (x.lignes ?? []).filter((l) => lisible(l.duree)).length, 0);
        break;
      }
      case 'avantApres': n = (s.realisations ?? []).filter((r) => (r.avant ?? []).length > 0 && (r.photos ?? []).length > 0).length; break;
      // Mêmes comptes que coursValides (src/lib/planning.ts) et materielsComplets (src/lib/location.ts), recopiés.
      case 'planning': {
        const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
        const mn = (h = '') => { const m = /^(\d{2}):(\d{2})$/.exec(h); return m && Number(m[1]) < 24 && Number(m[2]) < 60 ? Number(m[1]) * 60 + Number(m[2]) : NaN; };
        n = (s.planning?.cours ?? []).filter((c) => jours.includes((c.jour ?? '').trim().toLowerCase()) && (c.nom ?? '').trim() && mn(c.fin) > mn(c.debut)).length;
        break;
      }
      case 'materiels': {
        const k = (s.location?.durees ?? []).length;
        n = k === 0 ? 0 : (s.location?.materiels ?? []).filter((m) => (m.nom ?? '').trim() && (m.slug ?? '').trim() && (m.prix ?? []).slice(0, k).some((p) => (p ?? '').trim())).length;
        break;
      }
      // Mêmes comptes que questionsValides (src/lib/estimation.ts) et formulesCompletes (src/lib/formules.ts), recopiés.
      case 'estimation': {
        const vus = new Set<string>();
        n = (s.estimation?.questions ?? []).filter((q) => {
          const nom = (q.nom ?? '').trim();
          if (!nom || !(q.libelle ?? '').trim() || vus.has(nom)) return false;
          if ((q.type ?? 'texte') === 'choix' && (q.choix ?? []).filter((c) => c.trim()).length < 2) return false;
          vus.add(nom);
          return true;
        }).length;
        break;
      }
      case 'formules': {
        const vus = new Set<string>();
        n = (s.formules?.liste ?? []).filter((x) => {
          const slug = (x.slug ?? '').trim();
          if (!slug || !(x.nom ?? '').trim() || !(x.prix ?? '').trim() || vus.has(slug)) return false;
          vus.add(slug);
          return true;
        }).length;
        break;
      }
      // Mêmes comptes que appareilsComplets (src/lib/appareils.ts), pointsComplets et clotureValide (src/lib/retrait.ts), recopiés.
      case 'appareils': {
        const vus = new Set<string>();
        n = (s.appareils?.liste ?? []).filter((a) => {
          const slug = (a.slug ?? '').trim();
          if (!slug || !(a.nom ?? '').trim() || !(a.pannes ?? []).some((p) => (p.nom ?? '').trim()) || vus.has(slug)) return false;
          vus.add(slug);
          return true;
        }).length;
        break;
      }
      case 'retraits': {
        const vus = new Set<string>();
        n = (s.retrait?.points ?? []).filter((p) => {
          const slug = (p.slug ?? '').trim();
          if (!slug || !(p.nom ?? '').trim() || !(p.commune ?? '').trim() || vus.has(slug)) return false;
          if (!JOURS_MIN.includes(sansAccent((p.jour ?? '').trim().toLowerCase())) || !HHMM.test(p.debut ?? '') || !HHMM.test(p.fin ?? '')) return false;
          vus.add(slug);
          return true;
        }).length;
        break;
      }
      case 'cloture': {
        const c = s.retrait?.cloture;
        n = c && JOURS_MIN.includes(sansAccent((c.jour ?? '').trim().toLowerCase())) && HHMM.test(c.heure ?? '') ? 1 : 0;
        break;
      }
      // Mêmes comptes que sallesCompletes (src/lib/salles.ts) et biensComplets (src/lib/biens.ts), recopiés.
      case 'salles': {
        const vus = new Set<string>();
        n = (s.salles?.liste ?? []).filter((x) => {
          const slug = (x.slug ?? '').trim();
          if (!slug || !(x.nom ?? '').trim() || vus.has(slug)) return false;
          if (!Object.values(x.capacites ?? {}).some((c) => typeof c === 'number' && c > 0)) return false;
          vus.add(slug);
          return true;
        }).length;
        break;
      }
      case 'biens': {
        const vus = new Set<string>();
        n = (s.biens?.liste ?? []).filter((b) => {
          const slug = (b.slug ?? '').trim();
          if (!slug || !(b.titre ?? '').trim() || !(b.commune ?? '').trim() || vus.has(slug)) return false;
          if ((b.projet !== 'vente' && b.projet !== 'location') || !(typeof b.prix === 'number' && b.prix > 0)) return false;
          vus.add(slug);
          return true;
        }).length;
        break;
      }
      // Mêmes comptes que revendeursComplets (src/lib/revendeurs.ts) et profilsComplets (src/lib/profils.ts), recopiés.
      case 'revendeurs': {
        const vus = new Set<string>();
        const k = (x?: string) => (x ?? '').trim().replace(/\s+/g, ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        n = (s.revendeurs?.liste ?? []).filter((r) => {
          if (!k(r.nom) || !k(r.commune) || !k(r.secteur).replace(/[^a-z0-9]+/g, '')) return false;
          const c = `${k(r.nom)}|${k(r.commune)}`;
          if (vus.has(c)) return false;
          vus.add(c);
          return true;
        }).length;
        break;
      }
      case 'profils': {
        const vus = new Set<string>();
        n = (s.profils?.liste ?? []).filter((p) => {
          const slug = (p.slug ?? '').trim();
          if (!slug || !(p.nom ?? '').trim() || vus.has(slug) || !(p.motifs ?? []).some((m) => m.trim())) return false;
          vus.add(slug);
          return true;
        }).length;
        break;
      }
      // Mêmes comptes que especesCompletes, gardeLisible (src/lib/garde.ts) et honorairesLisibles (src/lib/honoraires.ts), recopiés.
      case 'especes': {
        const vus = new Set<string>();
        n = (s.especes ?? []).filter((x) => {
          const slug = (x.slug ?? '').trim();
          if (!slug || !(x.nom ?? '').trim() || vus.has(slug)) return false;
          vus.add(slug);
          return true;
        }).length;
        break;
      }
      case 'garde': {
        const g = s.garde;
        n = g && ((g.etapes ?? []).some((x) => (x.titre ?? '').trim()) || ((g.telephone ?? '').trim() && (g.telephoneAffiche ?? '').trim())) ? 1 : 0;
        break;
      }
      case 'honoraires': {
        const h = s.honoraires;
        const pas = [h?.decouverte, h?.consultation].some((p) => (p?.prix ?? '').trim());
        n = h && (pas || (h.modes ?? []).some((m) => (m.nom ?? '').trim() && (m.prix ?? '').trim())) ? 1 : 0;
        break;
      }
      // Mêmes comptes que interventionsCompletes (src/lib/journal.ts) et communesCompletes (src/lib/trajet.ts), recopiés.
      case 'interventions': {
        const vus = new Set<string>();
        const iso = (d = '') => {
          const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d.trim());
          if (!m) return false;
          const x = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
          return x.getUTCMonth() === Number(m[2]) - 1 && x.getUTCDate() === Number(m[3]);
        };
        n = (s.interventions ?? []).filter((x) => {
          const slug = (x.slug ?? '').trim();
          if (!slug || !iso(x.date) || !(x.lieu ?? '').trim() || !(x.titre ?? '').trim() || vus.has(slug)) return false;
          vus.add(slug);
          return true;
        }).length;
        break;
      }
      case 'trajet':
      case 'directionsTrajet': {
        const vus = new Set<string>();
        n = (s.trajet?.communes ?? []).filter((c) => {
          const slug = (c.slug ?? '').trim();
          if (!slug || !(c.nom ?? '').trim() || !(typeof c.minutes === 'number' && c.minutes > 0) || vus.has(slug)) return false;
          vus.add(slug);
          return e.mesure === 'trajet' || Boolean(c.direction);
        }).length;
        break;
      }
      // Mêmes comptes que produitsComplets (src/lib/recoltes.ts) et nuancier (src/lib/matieres.ts), recopiés.
      case 'recoltes': {
        const vus = new Set<string>();
        n = (s.recoltes?.produits ?? []).filter((p) => {
          const slug = (p.slug ?? '').trim();
          const mois = (p.mois ?? []).filter((m) => Number.isInteger(m) && m >= 1 && m <= 12);
          if (!slug || !(p.nom ?? '').trim() || !(p.famille ?? '').trim() || mois.length === 0 || vus.has(slug)) return false;
          vus.add(slug);
          return true;
        }).length;
        break;
      }
      case 'matieres': {
        const vus = new Set<string>();
        n = (s.matieres?.liste ?? []).filter((m) => {
          const slug = (m.slug ?? '').trim();
          if (!slug || !(m.nom ?? '').trim() || vus.has(slug)) return false;
          vus.add(slug);
          return Boolean(m.photo);
        }).length;
        break;
      }
      // Mêmes comptes que producteursComplets (src/lib/producteurs.ts) et trajetsComplets (src/lib/departs.ts), recopiés.
      case 'producteurs': {
        const vus = new Set<string>();
        n = (s.producteurs?.liste ?? []).filter((p) => {
          const slug = (p.slug ?? '').trim();
          if (!slug || !(p.nom ?? '').trim() || !(p.commune ?? '').trim() || vus.has(slug)) return false;
          vus.add(slug);
          return true;
        }).length;
        break;
      }
      case 'departs': {
        const vus = new Set<string>();
        n = (s.departs?.trajets ?? []).filter((t) => {
          const slug = (t.slug ?? '').trim();
          if (!slug || !(t.destination ?? '').trim() || !(typeof t.minutes === 'number' && Number.isInteger(t.minutes) && t.minutes > 0) || vus.has(slug)) return false;
          vus.add(slug);
          return true;
        }).length;
        break;
      }
      // Mêmes comptes que formationsCompletes, sessionsAVenir (src/lib/sessions.ts) et forfaitsComplets (src/lib/forfaits.ts),
      // recopiés ; « aujourd'hui » en UTC (le build retire les sessions passées à l'heure de Paris).
      case 'formations':
      case 'sessions': {
        const vus = new Set<string>();
        const fs = (s.formations?.liste ?? []).filter((f) => {
          const slug = (f.slug ?? '').trim();
          if (!slug || !(f.nom ?? '').trim() || vus.has(slug)) return false;
          vus.add(slug);
          return true;
        });
        const jour = new Date().toISOString().slice(0, 10);
        const iso = (x: string | undefined) => /^\d{4}-\d{2}-\d{2}$/.test(x ?? '');
        n = e.mesure === 'formations' ? fs.length : fs.reduce((k, f) => k + (f.sessions ?? []).filter((x) => iso(x.debut) && ((iso(x.fin) && x.fin! >= x.debut! ? x.fin! : x.debut!) >= jour)).length, 0);
        break;
      }
      case 'forfaits': {
        const vus = new Set<string>();
        n = (s.forfaits?.liste ?? []).filter((f) => {
          const slug = (f.slug ?? '').trim();
          const prix = (f.prix ?? '').trim() !== '' || (f.tarifs ?? []).some((t) => (t.gabarit ?? '').trim() && (t.prix ?? '').trim());
          if (!slug || !(f.nom ?? '').trim() || !prix || vus.has(slug)) return false;
          vus.add(slug);
          return true;
        }).length;
        break;
      }
      case 'urgence': n = s.contact?.emergency24h || (s.tarifs?.delai ?? '').trim() ? 1 : 0; break;
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
