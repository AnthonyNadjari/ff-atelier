/**
 * Les biens d'une agence immobilière de quartier (site.biens) : architecture `annonces-biens`
 * (src/lib/architectures.ts ; sources Royal Immo, Toulon, agence familiale depuis 2005 : Acheter / Louer par type de
 * bien, « Faites estimer votre bien par un professionnel » sous la recherche, une page par bien avec ses
 * caractéristiques, le prix, qui paie les honoraires et le négociateur ; Giboire, Rennes : « Votre projet commence ici »,
 * Acheter, Louer, Estimer, Faire gérer ; docs/veille/architectures/annonces-biens.md).
 *
 *   - biensComplets() : biens avec slug, titre, projet (vente ou location), commune et prix (mesure `biens`), slugs uniques ;
 *   - projetsDe()     : les projets qui ont un bien, dans l'ordre Acheter puis Louer ;
 *   - typesDe()       : les types de biens d'une liste, dans l'ordre où ils apparaissent ;
 *   - prixLisible()   : 235000 → « 235 000 € », location → « 890 € par mois » ;
 *   - resume()        : « 49 m², 2 pièces, 1 chambre » ;
 *   - echelle()       : les sept classes A à G du DPE ou du GES, celle du bien marquée ;
 *   - mentionsManquantes() : ce que la loi demande dans une annonce et que le client n'a pas donné (classe énergie,
 *                       honoraires d'une vente, surface d'une location) : dit au studio au build, jamais rempli ;
 *   - lienBiens()     : entrée de nav vers /biens, dès 3 biens complets.
 *
 * Module pur, sans import. Testé par tests/architectures-reception.test.mjs via scripts/ff/ts-loader.mjs (loadBiensModule).
 */

export const CLASSES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;
export type Classe = (typeof CLASSES)[number];

export const PROJETS = [
  { cle: 'vente', titre: 'Acheter' },
  { cle: 'location', titre: 'Louer' },
] as const;
export type Projet = (typeof PROJETS)[number]['cle'];

export interface Bien {
  slug: string;
  titre: string;
  projet: Projet;
  type?: string;
  commune: string;
  prix: number;
  surface?: number;
  pieces?: number;
  chambres?: number;
  dpe?: Classe;
  honoraires?: string;
}

export interface Biens<B extends Bien = Bien> {
  liste?: readonly B[];
}

export function biensComplets<B extends Bien>(x: Biens<B> | undefined): B[] {
  const vus = new Set<string>();
  return (x?.liste ?? []).filter((b) => {
    const slug = (b.slug ?? '').trim();
    if (!slug || !(b.titre ?? '').trim() || !(b.commune ?? '').trim() || vus.has(slug)) return false;
    if (!PROJETS.some((p) => p.cle === b.projet) || !(typeof b.prix === 'number' && b.prix > 0)) return false;
    vus.add(slug);
    return true;
  });
}

export function projetsDe<B extends Bien>(x: Biens<B> | undefined): { cle: Projet; titre: string; biens: B[] }[] {
  const ok = biensComplets(x);
  return PROJETS.map((p) => ({ cle: p.cle, titre: p.titre, biens: ok.filter((b) => b.projet === p.cle) })).filter((p) => p.biens.length > 0);
}

export function typesDe(biens: readonly Bien[]): string[] {
  const out: string[] = [];
  for (const b of biens) {
    const t = (b.type ?? '').trim();
    if (t && !out.some((o) => o.toLowerCase() === t.toLowerCase())) out.push(t);
  }
  return out;
}

const nombre = (n: number) => Math.round(n).toLocaleString('fr-FR').replace(/\s/g, ' ');

export function prixLisible(b: Pick<Bien, 'prix' | 'projet'>): string {
  const p = `${nombre(b.prix)} €`;
  return b.projet === 'location' ? `${p} par mois` : p;
}

const surfaceLisible = (n: number) => `${n.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} m²`;

export function resume(b: Pick<Bien, 'surface' | 'pieces' | 'chambres'>): string {
  const out: string[] = [];
  if (b.surface && b.surface > 0) out.push(surfaceLisible(b.surface));
  if (b.pieces && b.pieces > 0) out.push(`${b.pieces} pièce${b.pieces > 1 ? 's' : ''}`);
  if (b.chambres && b.chambres > 0) out.push(`${b.chambres} chambre${b.chambres > 1 ? 's' : ''}`);
  return out.join(', ');
}

export function surface(n: number): string {
  return surfaceLisible(n);
}

export function echelle(classe: Classe | undefined): { lettre: Classe; actif: boolean }[] {
  return CLASSES.map((lettre) => ({ lettre, actif: lettre === classe }));
}

export function mentionsManquantes(b: Bien): string[] {
  const out: string[] = [];
  if (!b.dpe) out.push('classe énergie (DPE)');
  if (b.projet === 'vente' && !(b.honoraires ?? '').trim()) out.push('qui paie les honoraires');
  if (b.projet === 'location' && !(b.surface && b.surface > 0)) out.push('surface habitable');
  return out;
}

export function lienBiens(x: Biens | undefined, label: string): { href: string; label: string } | undefined {
  return biensComplets(x).length >= 3 ? { href: '/biens', label } : undefined;
}
