/**
 * Le catalogue de location (site.location) : architecture `catalogue-location` (src/lib/architectures.ts ; source
 * Location Service, Mulhouse : « Chercher un outil », dix catégories, chaque machine avec « Particuliers 29,00 € TTC /
 * jour, 145,00 € TTC / sem ; Professionnels 24,17 € HT / jour ; Caution : 200 € », et « Louer plus longtemps pour le
 * même prix » ; seconde source Deslandes Motoculture, Sarthe : demi-journée, journée, week-end ;
 * docs/veille/architectures/catalogue-location.md). Un loueur se choisit sur la machine, son prix pour la durée qu'on
 * veut et sa caution : le site est son parc.
 *
 *   - materielsComplets() : les matériels qui ont un nom, un slug et au moins un prix (mesure `materiels`) ;
 *   - categoriesDe()      : les catégories dans l'ordre du client (sans catégorie : « Autres matériels », en dernier) ;
 *   - prixDuMateriel()    : les couples durée / prix (particulier, et pro s'il est donné), durées sans prix sautées ;
 *   - aPrixPro()          : vrai si un matériel au moins a un prix pro (la bascule particulier / professionnel) ;
 *   - premierPrix()       : le premier prix donné (« 29 € la journée ») pour la ligne du catalogue ;
 *   - lienMateriel()      : entrée de nav vers /materiel, dès 4 matériels complets.
 *
 * Module pur, sans import. Testé par tests/architectures-semaine.test.mjs via scripts/ff/ts-loader.mjs (loadLocationModule).
 */

export interface Materiel {
  slug: string;
  nom: string;
  categorie?: string;
  prix?: readonly string[];
  prixPro?: readonly string[];
}

export interface Location<T extends Materiel = Materiel> {
  durees?: readonly string[];
  materiels?: readonly T[];
}

export const SANS_CATEGORIE = 'Autres matériels';

export function materielsComplets<T extends Materiel>(l: Location<T> | undefined): T[] {
  const n = (l?.durees ?? []).length;
  if (n === 0) return [];
  return (l?.materiels ?? []).filter((m) => (m.nom ?? '').trim() && (m.slug ?? '').trim() && (m.prix ?? []).slice(0, n).some((p) => (p ?? '').trim()));
}

export function categoriesDe<T extends Materiel>(materiels: readonly T[]): { nom: string; materiels: T[] }[] {
  const out = new Map<string, T[]>();
  for (const m of materiels) {
    const c = (m.categorie ?? '').trim();
    if (!c) continue;
    if (!out.has(c)) out.set(c, []);
    out.get(c)!.push(m);
  }
  const sans = materiels.filter((m) => !(m.categorie ?? '').trim());
  const groupes = [...out.entries()].map(([nom, ms]) => ({ nom, materiels: ms }));
  if (sans.length > 0) groupes.push({ nom: SANS_CATEGORIE, materiels: sans });
  return groupes;
}

export function prixDuMateriel(m: Materiel, durees: readonly string[]): { duree: string; prix: string; pro?: string }[] {
  const out: { duree: string; prix: string; pro?: string }[] = [];
  durees.forEach((duree, i) => {
    const prix = (m.prix?.[i] ?? '').trim();
    const pro = (m.prixPro?.[i] ?? '').trim();
    if (prix) out.push(pro ? { duree, prix, pro } : { duree, prix });
  });
  return out;
}

export function aPrixPro(l: Location | undefined): boolean {
  const durees = l?.durees ?? [];
  return materielsComplets(l).some((m) => prixDuMateriel(m, durees).some((x) => x.pro));
}

export function premierPrix(m: Materiel, durees: readonly string[]): { duree: string; prix: string; pro?: string } | undefined {
  return prixDuMateriel(m, durees)[0];
}

export function lienMateriel(l: Location | undefined, label: string): { href: string; label: string } | undefined {
  return materielsComplets(l).length >= 4 ? { href: '/materiel', label } : undefined;
}
