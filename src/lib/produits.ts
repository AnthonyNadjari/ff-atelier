/**
 * Gamme du client (site.produits) : architecture `gamme-vitrine` (src/lib/architectures.ts ; source Agrumea Farm,
 * docs/veille/architectures/agrumea.md). L'accueil de la coquille vitrine (src/shells/vitrine.astro) est la gamme en
 * piste horizontale manuelle, chaque produit a sa page /produits/<slug> (src/pages/produits/[slug].astro), la liste
 * /produits les regroupe par famille (src/pages/produits/[...index].astro), lien « Produits » dans la nav (navLinks).
 *
 *   - categoriesProduits() : familles distinctes, dans l'ordre d'apparition (la liste les regroupe dès deux) ;
 *   - autresProduits()     : les n produits qui suivent celui-ci dans l'ordre du site, en boucle (« les autres produits ») ;
 *   - lienProduits()       : l'entrée de nav { href: '/produits', label } ou null sans produit ;
 *   - prixEnOffre()        : « 6,50 € » → { price: '6.50', priceCurrency: 'EUR' } pour le JSON-LD Product, sinon le
 *                            texte tel quel en description d'offre ; rien n'est deviné (absent = pas d'offre).
 *
 * Module pur (seul un `import type`) : re-exporté par src/lib/site.ts, testé par tests/architectures.test.mjs via
 * scripts/ff/ts-loader.mjs (loadProduitsModule).
 */
import type { Site } from './schema';

type Produit = Pick<Site['produits'][number], 'slug'> & { categorie?: string };

export function categoriesProduits(produits: readonly Produit[]): string[] {
  const out: string[] = [];
  for (const p of produits) {
    const c = (p.categorie ?? '').trim();
    if (c && !out.includes(c)) out.push(c);
  }
  return out;
}

export function autresProduits<T extends Produit>(produits: readonly T[], slug: string, n = 4): T[] {
  const i = produits.findIndex((p) => p.slug === slug);
  const autres = produits.filter((p) => p.slug !== slug);
  if (i < 0) return autres.slice(0, n);
  // Les suivants d'abord, puis le début de la gamme : chaque fiche propose des voisins différents.
  const apres = produits.slice(i + 1).filter((p) => p.slug !== slug);
  const avant = produits.slice(0, i);
  return [...apres, ...avant].slice(0, n);
}

export function lienProduits(produits: readonly Produit[], label: string): { href: string; label: string } | null {
  return produits.length > 0 ? { href: '/produits', label } : null;
}

export function prixEnOffre(prix: string | undefined): Record<string, string> | undefined {
  if (!prix || !prix.trim()) return undefined;
  const m = /^\s*(\d+(?:[.,]\d{1,2})?)\s*(?:€|EUR|euros?)\s*$/i.exec(prix);
  if (m) return { '@type': 'Offer', price: m[1].replace(',', '.'), priceCurrency: 'EUR' };
  return { '@type': 'Offer', description: prix.trim() };
}
