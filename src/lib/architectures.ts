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
 *  - agenda          : rendez-vous datés (agenda[]) ; les dates passées tombent au build (src/lib/agenda.ts).
 */
export interface Exigence {
  mesure: 'photos' | 'services' | 'servicesPhoto' | 'realisations' | 'types' | 'horaires' | 'rue' | 'lignesPrix' | 'pasUrgence' | 'histoire' | 'agenda';
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
  services?: { image?: unknown; lignes?: unknown[] }[];
  about?: { portrait?: unknown; story?: string };
  proof?: { gallery?: { kind?: string }[] };
  realisations?: { kind?: string; photos?: unknown[] }[];
  contact?: { hours?: unknown[]; address?: { street?: string }; emergency24h?: boolean };
  agenda?: { date: string }[];
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
