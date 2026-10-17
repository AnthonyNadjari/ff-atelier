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
 *  - pasUrgence      : contact.emergency24h faux (architecture où l'on n'appelle pas en urgence).
 */
export interface Exigence {
  mesure: 'photos' | 'services' | 'servicesPhoto' | 'realisations' | 'types' | 'horaires' | 'rue' | 'lignesPrix' | 'pasUrgence';
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

export const ARCHITECTURE_IDS = ['carte-de-visite'] as const;
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
};

/** Ce que donneesManquantes() lit d'un site : un sous-ensemble du Site, pour tester sans tout construire. */
export interface SiteArchi {
  images?: { hero?: unknown };
  services?: { image?: unknown; lignes?: unknown[] }[];
  about?: { portrait?: unknown };
  proof?: { gallery?: { kind?: string }[] };
  realisations?: { kind?: string; photos?: unknown[] }[];
  contact?: { hours?: unknown[]; address?: { street?: string }; emergency24h?: boolean };
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
      case 'pasUrgence': if (s.contact?.emergency24h) out.push(e.libelle); continue;
    }
    if (compte(n, e)) out.push(`${e.libelle} (${n} aujourd’hui)`);
  }
  return out;
}
