/**
 * Les producteurs d'un magasin de producteurs, d'une épicerie ou d'un restaurant en circuit court (site.producteurs) :
 * architecture `mur-producteurs` (src/lib/architectures.ts ; sources Le Comboire Paysan, Échirolles : « Les producteurs »
 * dans la barre, l'accueil rangé par produit avec la ferme de chacun, une fiche par producteur ; Dose Épicerie,
 * Nort-sur-Erdre : « Nos producteurs », la carte des producteurs présents à la boutique ;
 * docs/veille/architectures/mur-producteurs.md). Le client se demande « d'où ça vient, et qui le fait ? ».
 *
 *   - producteursComplets() : producteurs avec slug, nom et commune, slugs uniques, dans l'ordre du client (mesure
 *                             `producteurs`) ;
 *   - parDistance()         : ceux dont le client donne la distance, du plus proche au plus loin, puis les autres dans
 *                             son ordre ;
 *   - quiFaitQuoi()         : les rayons dans l'ordre de leur première apparition, chacun avec ses producteurs (un
 *                             producteur sans rayon n'est pas dans l'index) ;
 *   - distanceLisible()     : 12 → « à 12 km », 1.5 → « à 1,5 km » ;
 *   - plusLoin()            : la plus grande distance donnée (« le plus loin est à 74 km »), jamais estimée ;
 *   - voisins()             : les producteurs du même rayon, puis les plus proches en distance ;
 *   - lienProducteurs()     : entrée de nav (/producteurs dès 4 producteurs).
 *
 * Rien n'est deviné : une distance absente n'est jamais calculée, un producteur sans rayon reste hors de l'index.
 * Module pur, sans import. Testé par tests/architectures-fermiers.test.mjs via scripts/ff/ts-loader.mjs
 * (loadProducteursModule).
 */

export const PRODUCTEURS_MIN = 4;

export interface Producteur {
  slug: string;
  nom: string;
  commune: string;
  km?: number;
  rayon?: string;
}

const net = (t: string | undefined) => (t ?? '').trim();
const kmValide = (k: number | undefined) => typeof k === 'number' && Number.isFinite(k) && k > 0;

export function producteursComplets<P extends Producteur>(liste: readonly P[] | undefined): P[] {
  const vus = new Set<string>();
  const out: P[] = [];
  for (const p of liste ?? []) {
    const slug = net(p.slug);
    if (!slug || !net(p.nom) || !net(p.commune) || vus.has(slug)) continue;
    vus.add(slug);
    out.push(p);
  }
  return out;
}

export function parDistance<P extends Producteur>(liste: readonly P[] | undefined): P[] {
  const tous = producteursComplets(liste);
  const avec = tous.filter((p) => kmValide(p.km)).sort((a, b) => a.km! - b.km!);
  return [...avec, ...tous.filter((p) => !kmValide(p.km))];
}

export function quiFaitQuoi<P extends Producteur>(liste: readonly P[] | undefined): { rayon: string; producteurs: P[] }[] {
  const out: { rayon: string; producteurs: P[] }[] = [];
  for (const p of producteursComplets(liste)) {
    const r = net(p.rayon);
    if (!r) continue;
    const g = out.find((x) => x.rayon.toLowerCase() === r.toLowerCase());
    if (g) g.producteurs.push(p);
    else out.push({ rayon: r, producteurs: [p] });
  }
  return out;
}

export function distanceLisible(km: number | undefined): string {
  if (!kmValide(km)) return '';
  const n = Math.round(km! * 10) / 10;
  return `à ${n.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km`;
}

export function plusLoin(liste: readonly Producteur[] | undefined): number | undefined {
  const k = producteursComplets(liste).filter((p) => kmValide(p.km)).map((p) => p.km!);
  return k.length > 0 ? Math.max(...k) : undefined;
}

export function voisins<P extends Producteur>(liste: readonly P[] | undefined, slug: string, n = 3): P[] {
  const tous = producteursComplets(liste);
  const p = tous.find((x) => x.slug === slug);
  if (!p) return [];
  const r = net(p.rayon).toLowerCase();
  const autres = tous.filter((x) => x.slug !== slug);
  const memeRayon = r ? autres.filter((x) => net(x.rayon).toLowerCase() === r) : [];
  const proches = kmValide(p.km)
    ? autres.filter((x) => kmValide(x.km) && !memeRayon.includes(x)).sort((a, b) => Math.abs(a.km! - p.km!) - Math.abs(b.km! - p.km!))
    : [];
  return [...memeRayon, ...proches].slice(0, n);
}

export function lienProducteurs(liste: readonly Producteur[] | undefined, label: string): { href: string; label: string } | undefined {
  return producteursComplets(liste).length >= PRODUCTEURS_MIN ? { href: '/producteurs', label } : undefined;
}
