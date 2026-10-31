/**
 * Le tableau des départs d'un taxi, d'un VTC ou d'un transporteur (site.departs) : architecture `tableau-departs`
 * (src/lib/architectures.ts ; sources Taxi Annecy : « Départs · Annecy », chaque destination avec sa distance et sa durée,
 * « Voir le trajet », une page par trajet avec « à quelle heure partir » et ce qu'il faut fournir ; VTC Rousseau, Les
 * Houches : les tarifs au départ ou à destination de Chamonix, jour et nuit ; docs/veille/architectures/tableau-departs.md).
 * Le client se demande « combien de temps, combien, et à quelle heure vous venez me chercher ? ».
 *
 *   - trajetsComplets()    : trajets avec slug, destination et une durée entière > 0, slugs uniques, dans l'ordre du client
 *                            (mesure `departs`) ;
 *   - groupesParType()     : les genres de destination dans l'ordre de leur première apparition (« Aéroports », « Gares »),
 *                            les trajets sans genre en dernier sous « Autres trajets » ;
 *   - dureeDuTrajet()      : 40 → « 40 min », 100 → « 1 h 40 », 60 → « 1 h » ;
 *   - avecPrix()           : vrai si un trajet au moins a son prix (la colonne Prix n'existe qu'alors) ;
 *   - priseEnCharge()      : l'heure du vol ou du train moins l'avance du trajet, la route et la marge du client, en
 *                            « HH:MM » (et `veille` si elle tombe la veille) ; undefined sans avance ou sans marge ;
 *   - autresTrajets()      : les autres trajets du même genre, puis les autres, dans l'ordre du client ;
 *   - lienTrajets()        : entrée de nav (/trajets dès 4 trajets).
 *
 * Rien n'est deviné : un prix absent s'écrit « sur devis », une avance ou une marge absente retire l'outil. Module pur,
 * sans import. Testé par tests/architectures-departs.test.mjs via scripts/ff/ts-loader.mjs (loadDepartsModule).
 */

export const DEPARTS_MIN = 4;
export const AUTRES_TRAJETS = 'Autres trajets';

export interface Trajet {
  slug: string;
  destination: string;
  minutes: number;
  type?: string;
  prix?: string;
  avance?: number;
}

const net = (t: string | undefined) => (t ?? '').trim();
const entier = (n: number | undefined, min = 1) => typeof n === 'number' && Number.isInteger(n) && n >= min;

export function trajetsComplets<T extends Trajet>(liste: readonly T[] | undefined): T[] {
  const vus = new Set<string>();
  const out: T[] = [];
  for (const t of liste ?? []) {
    const slug = net(t.slug);
    if (!slug || !net(t.destination) || !entier(t.minutes) || vus.has(slug)) continue;
    vus.add(slug);
    out.push(t);
  }
  return out;
}

export function groupesParType<T extends Trajet>(liste: readonly T[] | undefined): { type: string; trajets: T[] }[] {
  const out: { type: string; trajets: T[] }[] = [];
  const sans: T[] = [];
  for (const t of trajetsComplets(liste)) {
    const ty = net(t.type);
    if (!ty) { sans.push(t); continue; }
    const g = out.find((x) => x.type.toLowerCase() === ty.toLowerCase());
    if (g) g.trajets.push(t);
    else out.push({ type: ty, trajets: [t] });
  }
  if (sans.length > 0) out.push({ type: AUTRES_TRAJETS, trajets: sans });
  return out;
}

export function dureeDuTrajet(minutes: number): string {
  if (!entier(minutes)) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, '0')}`;
}

export function avecPrix(liste: readonly Trajet[] | undefined): boolean {
  return trajetsComplets(liste).some((t) => net(t.prix) !== '');
}

/** « 07:00 », trajet de 40 min, avance 120, marge 30 → « 03:50 » ; « 01:00 » → veille. */
export function priseEnCharge(heure: string, t: Pick<Trajet, 'minutes' | 'avance'>, marge: number | undefined): { heure: string; veille: boolean } | undefined {
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(net(heure));
  if (!m || !entier(t.avance, 0) || !entier(marge, 0) || !entier(t.minutes)) return undefined;
  let x = Number(m[1]) * 60 + Number(m[2]) - t.avance! - t.minutes - marge!;
  const veille = x < 0;
  x = ((x % 1440) + 1440) % 1440;
  return { heure: `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`, veille };
}

export function autresTrajets<T extends Trajet>(liste: readonly T[] | undefined, slug: string, n = 3): T[] {
  const tous = trajetsComplets(liste);
  const t = tous.find((x) => x.slug === slug);
  if (!t) return [];
  const ty = net(t.type).toLowerCase();
  const autres = tous.filter((x) => x.slug !== slug);
  const meme = autres.filter((x) => net(x.type).toLowerCase() === ty);
  return [...meme, ...autres.filter((x) => !meme.includes(x))].slice(0, n);
}

export function lienTrajets(liste: readonly Trajet[] | undefined, label: string): { href: string; label: string } | undefined {
  return trajetsComplets(liste).length >= DEPARTS_MIN ? { href: '/trajets', label } : undefined;
}
