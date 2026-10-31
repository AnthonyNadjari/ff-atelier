/**
 * Le calendrier des récoltes d'une ferme, d'une cueillette ou d'un maraîcher (site.recoltes) : architecture
 * `calendrier-recoltes` (src/lib/architectures.ts ; sources Cueillette de Compans, Seine-et-Marne : « Calendrier des
 * récoltes », chaque produit sur les douze mois, « En ce moment » par fruits, légumes et fleurs, une page par produit avec sa
 * « Période de récolte » ; Le Jardin de l'Avenir, Angers : « À cueillir en ce moment », « Calendrier des légumes » et
 * « Avant de venir, le bon réflexe » : le répondeur qui dit la liste du jour ; docs/veille/architectures/calendrier-recoltes.md).
 * Le client se demande « qu'est-ce qu'il y a en ce moment ? » : l'accueil est l'année de la ferme.
 *
 *   - produitsComplets() : produits avec slug, nom, famille et au moins un mois valide (1 à 12), slugs uniques, dans l'ordre
 *                          du client ; les mois triés et dédoublonnés (mesure `recoltes`) ;
 *   - famillesDe()       : les familles dans l'ordre de leur première apparition (« Légumes », « Fruits », « Fleurs ») ;
 *   - duMois()           : les produits récoltés au mois m, par famille ;
 *   - plages()           : les mois d'un produit en plages consécutives, l'hiver d'un seul tenant (11, 12, 1, 2 = une plage) ;
 *   - periodeLisible()   : [6, 7, 8, 9, 10] → « de juin à octobre », [10, 11, 12, 1] → « d’octobre à janvier » ; [5, 9, 10] → « en mai, puis de septembre à octobre » ;
 *                          les douze mois → « toute l'année » ;
 *   - enMemeTemps()      : les produits dont la récolte croise celle d'un produit, du plus long recouvrement au plus court ;
 *   - lienCalendrier()   : entrée de nav (/calendrier dès 4 produits).
 *
 * Rien n'est deviné : un produit sans mois n'est pas dans le calendrier ; le mois « en ce moment » est celui du build dans le
 * HTML, puis celui du visiteur dans le navigateur. Module pur, sans import. Testé par tests/architectures-recoltes.test.mjs via
 * scripts/ff/ts-loader.mjs (loadRecoltesModule).
 */

export const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'] as const;
/** Abréviations de l'Imprimerie nationale (sans point final pour mai, juin, août). */
export const MOIS_COURTS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'] as const;
export const RECOLTES_MIN = 4;

export interface ProduitRecolte {
  slug: string;
  nom: string;
  famille: string;
  mois: number[];
}

const net = (t: string | undefined) => (t ?? '').trim();
const moisValides = (m: readonly number[] | undefined) => [...new Set((m ?? []).filter((x) => Number.isInteger(x) && x >= 1 && x <= 12))].sort((a, b) => a - b);

export function produitsComplets<P extends ProduitRecolte>(liste: readonly P[] | undefined): P[] {
  const vus = new Set<string>();
  const out: P[] = [];
  for (const p of liste ?? []) {
    const slug = net(p.slug);
    const mois = moisValides(p.mois);
    if (!slug || !net(p.nom) || !net(p.famille) || mois.length === 0 || vus.has(slug)) continue;
    vus.add(slug);
    out.push({ ...p, mois });
  }
  return out;
}

export function famillesDe(liste: readonly ProduitRecolte[] | undefined): string[] {
  return [...new Set(produitsComplets(liste).map((p) => net(p.famille)))];
}

/** Les produits récoltés au mois `m` (1 à 12), par famille (familles vides retirées). */
export function duMois<P extends ProduitRecolte>(liste: readonly P[] | undefined, m: number): { famille: string; produits: P[] }[] {
  const tous = produitsComplets(liste);
  return famillesDe(tous)
    .map((famille) => ({ famille, produits: tous.filter((p) => net(p.famille) === famille && p.mois.includes(m)) }))
    .filter((g) => g.produits.length > 0);
}

/** Les mois en plages consécutives ; une plage qui finit en décembre et une qui commence en janvier n'en font qu'une. */
export function plages(mois: readonly number[]): number[][] {
  const m = moisValides(mois);
  if (m.length === 0) return [];
  if (m.length === 12) return [m];
  const out: number[][] = [];
  for (const x of m) {
    const der = out.at(-1);
    if (der && der.at(-1) === x - 1) der.push(x);
    else out.push([x]);
  }
  if (out.length > 1 && out[0][0] === 1 && out.at(-1)!.at(-1) === 12) {
    const fin = out.pop()!;
    out[0] = [...fin, ...out[0]];
  }
  // L'ordre de lecture suit l'année à partir de la première plage qui ne chevauche pas le Nouvel An.
  return out.sort((a, b) => (a[0] > a.at(-1)! ? a[0] - 12 : a[0]) - (b[0] > b.at(-1)! ? b[0] - 12 : b[0]));
}

export function periodeLisible(mois: readonly number[]): string {
  const p = plages(mois);
  if (p.length === 0) return '';
  if (p.length === 1 && p[0].length === 12) return 'toute l’année';
  const de = (m: number) => (/^[aeiouyâàéèêîôû]/.test(MOIS[m - 1]) ? `d’${MOIS[m - 1]}` : `de ${MOIS[m - 1]}`);
  const dire = (x: number[]) => (x.length === 1 ? `en ${MOIS[x[0] - 1]}` : `${de(x[0])} à ${MOIS[x.at(-1)! - 1]}`);
  return p.map((x, i) => (i === 0 ? dire(x) : `puis ${dire(x)}`)).join(', ');
}

export function enMemeTemps<P extends ProduitRecolte>(liste: readonly P[] | undefined, slug: string, n = 6): P[] {
  const tous = produitsComplets(liste);
  const p = tous.find((x) => x.slug === slug);
  if (!p) return [];
  return tous
    .filter((x) => x.slug !== slug)
    .map((x, i) => ({ x, i, commun: x.mois.filter((m) => p.mois.includes(m)).length }))
    .filter((e) => e.commun > 0)
    .sort((a, b) => b.commun - a.commun || a.i - b.i)
    .slice(0, n)
    .map((e) => e.x);
}

export function lienCalendrier(liste: readonly ProduitRecolte[] | undefined, label: string): { href: string; label: string } | undefined {
  return produitsComplets(liste).length >= RECOLTES_MIN ? { href: '/calendrier', label } : undefined;
}
