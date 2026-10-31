/**
 * Fiches du style « etabli » (relevé sur agronomywork.shop le 31 oct 2026, fiche docs/veille/styles/etabli.md) : l'accueil
 * est une suite de FICHES d'objet (l'objet en grand, à côté ce qu'il faut savoir : nom, prix encadré, phrase, vignettes,
 * formats, une porte pleine largeur). Une fiche vient d'abord de la gamme du client (site.produits, page /produits/<slug>),
 * puis de ses prestations (site.services, page /services/<slug>) : un coutelier montre ses couteaux puis son affûtage.
 *
 *   - fichesEtabli(site)   : toutes les fiches, produits puis services, dans l'ordre du client ; rien n'est deviné (un prix
 *                            absent reste absent, une photo absente aussi) ;
 *   - ficheEnTete(fiches)  : l'objet phare du premier écran = la première fiche qui a une photo (sinon aucune) ;
 *   - vuesDeFiche(f)       : les vues de l'objet (sa photo puis ses photos d'ambiance), sans doublon, 4 au plus ;
 *   - volees(liste, n)     : découpe une liste en volées de n (l'escalier des questions, Faq/etabli).
 *
 * Module pur (seul un `import type`) : importé par les sections etabli, testé par tests/style-etabli.test.mjs via
 * scripts/ff/ts-loader.mjs.
 */
import type { Site } from './schema';

type Image = { src: string; alt: string };

export interface FicheEtabli {
  cle: string;
  genre: 'produit' | 'service';
  nom: string;
  prix?: string;
  texte?: string;
  photo?: Image;
  detoure: boolean;
  photos: Image[];
  formats: string[];
  href: string;
}

type SiteFiches = Pick<Site, 'produits' | 'services'>;

export function fichesEtabli(s: SiteFiches): FicheEtabli[] {
  const produits: FicheEtabli[] = s.produits.map((p) => ({
    cle: `p-${p.slug}`,
    genre: 'produit',
    nom: p.nom,
    prix: p.prix,
    texte: p.description,
    photo: p.photo,
    detoure: p.detoure,
    photos: p.photos,
    formats: p.formats,
    href: `/produits/${p.slug}`,
  }));
  const services: FicheEtabli[] = s.services
    .filter((x) => !x.slug.startsWith('_'))
    .map((x) => ({
      cle: `s-${x.slug}`,
      genre: 'service',
      nom: x.title,
      prix: x.priceFrom,
      texte: x.short,
      photo: x.image,
      detoure: false,
      photos: x.images,
      formats: [],
      href: `/services/${x.slug}`,
    }));
  return [...produits, ...services];
}

export function ficheEnTete(fiches: readonly FicheEtabli[]): FicheEtabli | undefined {
  return fiches.find((f) => f.photo);
}

export function vuesDeFiche(f: Pick<FicheEtabli, 'photo' | 'photos'>, max = 4): Image[] {
  const out: Image[] = [];
  for (const p of [f.photo, ...f.photos]) {
    if (p && !out.some((o) => o.src === p.src)) out.push(p);
  }
  return out.slice(0, max);
}

export function volees<T>(liste: readonly T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < liste.length; i += n) out.push(liste.slice(i, i + n));
  return out;
}
