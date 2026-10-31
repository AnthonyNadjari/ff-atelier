/**
 * Rayons du style `rayon` (relevé sur blankinside.co.uk le 31 oct 2026, fiche docs/veille/styles/rayon.md) : la gamme du
 * client rangée en étagères qu'on fait glisser au doigt. Module pur (seul un `import type`), lu par Hero/rayon et
 * Services/rayon, testé par tests/style-rayon.test.mjs.
 *
 *   - rayonsDuSite() : un rayon par famille de produits (site.produits[].categorie, dans l'ordre d'apparition ; les
 *     produits sans famille vont dans un rayon nommé comme la page /produits), puis un rayon des prestations
 *     (site.services, vers leurs pages /services/<slug>) ; un rayon vide n'existe pas ;
 *   - selectionDuSite() : « La sélection » du premier écran : les produits pris tour à tour dans chaque rayon (un de
 *     chaque, puis le deuxième de chaque…), sinon les prestations ; n articles au plus.
 * Rien n'est inventé : chaque article vient d'un produit ou d'une prestation du client ; prix et étiquette seulement
 * s'ils sont donnés.
 */
import type { Site } from './schema';

type Photo = { src: string; alt: string };
export type Article = {
  cle: string;
  nom: string;
  href: string;
  photo?: Photo;
  detoure: boolean;
  /** La famille (produit) : écrite en petit au-dessus du nom. */
  etiquette?: string;
  /** Le premier format (« 250 g ») : l'étiquette à contour posée sur la grande case d'un rayon vedette. */
  format?: string;
  prix?: string;
};
export type Rayon = { slug: string; titre: string; articles: Article[]; prestations: boolean };

type Entree = Pick<Site, 'produits' | 'services'> & { wording: Pick<Site['wording'], 'produits' | 'servicesTitle'> };

/** « Pâtes pressées » → « pates-pressees » (ancre #rayon-<slug>). */
export function slugRayon(titre: string): string {
  return titre
    .replace(/œ/g, 'oe').replace(/Œ/g, 'Oe').replace(/æ/g, 'ae')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/<[^>]*>/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'rayon';
}

const texteSeul = (html: string) => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

export function rayonsDuSite(s: Entree): Rayon[] {
  const rayons: Rayon[] = [];
  const parFamille = new Map<string, Rayon>();
  for (const p of s.produits ?? []) {
    const famille = (p.categorie ?? '').trim() || s.wording.produits;
    let r = parFamille.get(famille);
    if (!r) {
      r = { slug: slugRayon(famille), titre: famille, articles: [], prestations: false };
      parFamille.set(famille, r);
      rayons.push(r);
    }
    r.articles.push({
      cle: `p-${p.slug}`,
      nom: p.nom,
      href: `/produits/${p.slug}`,
      photo: p.photo,
      detoure: Boolean(p.detoure),
      etiquette: p.categorie?.trim() || undefined,
      format: p.formats?.[0],
      prix: p.prix,
    });
  }
  const services = s.services ?? [];
  if (services.length > 0) {
    const titre = texteSeul(s.wording.servicesTitle);
    let slug = slugRayon(titre);
    if (rayons.some((r) => r.slug === slug)) slug = `${slug}-prestations`;
    rayons.push({
      slug,
      titre,
      prestations: true,
      articles: services.map((x) => ({
        cle: `s-${x.slug}`,
        nom: x.title,
        href: `/services/${x.slug}`,
        photo: x.image,
        detoure: false,
        prix: x.priceFrom,
      })),
    });
  }
  return rayons;
}

export function selectionDuSite(rayons: readonly Rayon[], n = 10): Article[] {
  const produits = rayons.filter((r) => !r.prestations);
  const sources = produits.length > 0 ? produits : rayons;
  const out: Article[] = [];
  for (let i = 0; out.length < n; i++) {
    let ajoute = false;
    for (const r of sources) {
      if (r.articles[i] && out.length < n) {
        out.push(r.articles[i]);
        ajoute = true;
      }
    }
    if (!ajoute) break;
  }
  return out;
}
