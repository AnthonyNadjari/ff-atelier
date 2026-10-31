/**
 * Les forfaits d'atelier d'un garage (site.forfaits) : architecture `forfaits-atelier` (src/lib/architectures.ts ; sources
 * Garage de la Route Nationale, Nouvion : trois pages, l'accueil annonce les forfaits à prix (« Distribution à partir de
 * 399 € », « Entretien courant avec ou sans RDV »), la page Forfaits dit pour chacun « Ce prix comprend » (pièces, main-d'œuvre),
 * pour quelles voitures, ce qu'il faut apporter et le véhicule de prêt ; Garage de la République, Échirolles : forfaits « à partir
 * de », tarifs d'atelier et prix par gabarit (« Citadine 20 €, Berline 30 €, Monospace / 4x4 70 € ») ;
 * docs/veille/architectures/forfaits-atelier.md).
 * Le client se demande « combien pour ma voiture, qu'est-ce qui est compris, faut-il prendre rendez-vous ? ».
 *
 *   - forfaitsComplets()  : forfaits avec slug, nom et un prix (prix, ou un tarif par gabarit), slugs uniques, dans l'ordre
 *                           du client (mesure `forfaits`) ;
 *   - gabaritsUtilises()  : les gabarits du client (« Citadine », « Berline ») qui ont au moins un prix, dans son ordre ;
 *   - prixPour()          : le prix d'un forfait pour un gabarit (son tarif, sinon son prix unique ; '' si aucun) ;
 *   - parRendezVous()     : les forfaits « sans rendez-vous », « sur rendez-vous », et ceux que le client ne classe pas ;
 *   - autresForfaits()    : les autres forfaits de la même famille, puis les autres ;
 *   - lienForfaits()      : entrée de nav (/forfaits dès 4 forfaits).
 *
 * Rien n'est deviné : un prix absent pour un gabarit s'écrit « sur devis », un forfait sans « comprend » n'a pas de ticket
 * de pièces. Module pur, sans import. Testé par tests/architectures-forfaits.test.mjs via scripts/ff/ts-loader.mjs
 * (loadForfaitsModule).
 */

export const FORFAITS_MIN = 4;

export interface Tarif { gabarit: string; prix: string }
export interface Forfait {
  slug: string;
  nom: string;
  famille?: string;
  prix?: string;
  tarifs?: readonly Tarif[];
  rendezVous?: 'sans' | 'sur';
}

const net = (t: string | undefined) => (t ?? '').trim();
const cle = (t: string | undefined) => net(t).toLowerCase();
const aUnPrix = (f: Forfait) => net(f.prix) !== '' || (f.tarifs ?? []).some((t) => net(t.gabarit) && net(t.prix));

export function forfaitsComplets<T extends Forfait>(liste: readonly T[] | undefined): T[] {
  const vus = new Set<string>();
  const out: T[] = [];
  for (const f of liste ?? []) {
    const slug = net(f.slug);
    if (!slug || !net(f.nom) || !aUnPrix(f) || vus.has(slug)) continue;
    vus.add(slug);
    out.push(f);
  }
  return out;
}

export function gabaritsUtilises(gabarits: readonly string[] | undefined, liste: readonly Forfait[] | undefined): string[] {
  const fs = forfaitsComplets(liste);
  return (gabarits ?? []).map(net).filter((g, i, a) => g && a.findIndex((x) => cle(x) === cle(g)) === i && fs.some((f) => (f.tarifs ?? []).some((t) => cle(t.gabarit) === cle(g) && net(t.prix))));
}

export function prixPour(f: Forfait, gabarit?: string): string {
  if (gabarit) {
    const t = (f.tarifs ?? []).find((x) => cle(x.gabarit) === cle(gabarit) && net(x.prix));
    if (t) return net(t.prix);
  }
  return net(f.prix);
}

export function parRendezVous<T extends Forfait>(liste: readonly T[] | undefined): { sans: T[]; sur: T[]; autres: T[] } {
  const fs = forfaitsComplets(liste);
  return { sans: fs.filter((f) => f.rendezVous === 'sans'), sur: fs.filter((f) => f.rendezVous === 'sur'), autres: fs.filter((f) => f.rendezVous !== 'sans' && f.rendezVous !== 'sur') };
}

export function autresForfaits<T extends Forfait>(liste: readonly T[] | undefined, slug: string, n = 3): T[] {
  const tous = forfaitsComplets(liste);
  const f = tous.find((x) => x.slug === slug);
  if (!f) return [];
  const autres = tous.filter((x) => x.slug !== slug);
  const meme = autres.filter((x) => cle(x.famille) === cle(f.famille));
  return [...meme, ...autres.filter((x) => !meme.includes(x))].slice(0, n);
}

export function lienForfaits(liste: readonly Forfait[] | undefined, label: string): { href: string; label: string } | undefined {
  return forfaitsComplets(liste).length >= FORFAITS_MIN ? { href: '/forfaits', label } : undefined;
}
