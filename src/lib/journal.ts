/**
 * Le carnet d'interventions d'un artisan (site.interventions) : architecture `carnet-interventions` (src/lib/architectures.ts ;
 * sources Monsieur Boris, serrurier à Nîmes : 25 récits d'intervention datés et situés par quartier, « portail vandalisé,
 * Castanet », « squat à Vacquerolles », chacun raconté en temps (la clé cassée, le démontage, la reproduction à l'atelier, le
 * remontage) ; L'Atelier Bois Acier, Amiens : « En direct de l'atelier », les réalisations racontées comme de courtes histoires
 * localisées, publiées comme des articles ; docs/veille/architectures/carnet-interventions.md). Le client se demande « est-ce
 * qu'il est vraiment du coin, et est-ce qu'il travaille en ce moment ? » : le site est son carnet de bord, daté, du plus récent
 * au plus ancien, rangé par mois.
 *
 *   - interventionsCompletes() : interventions qui ont un slug, une date AAAA-MM-JJ réelle, un lieu et un titre ; slugs
 *                                uniques ; triées de la plus récente à la plus ancienne (mesure `interventions`) ;
 *   - parMois()                : les mêmes, rangées par mois (« octobre 2026 »), le mois le plus récent d'abord ;
 *   - lieuxDuCarnet()          : les lieux, du plus fréquent au moins fréquent (à égalité, l'ordre alphabétique) ;
 *   - dateLongue()             : « 24 octobre 2026 » (sans jour de semaine : rien de deviné) ;
 *   - ilYA()                   : « aujourd'hui », « hier », « il y a 3 jours », « il y a 2 semaines » (calculé dans le
 *                                navigateur : une date de build vieillit) ;
 *   - voisines()               : l'intervention plus récente et la plus ancienne autour d'une autre (la navigation du carnet) ;
 *   - lienCarnet()             : entrée de nav (/carnet dès 3 interventions complètes).
 *
 * Module pur, sans import. Testé par tests/architectures-carnet.test.mjs via scripts/ff/ts-loader.mjs (loadJournalModule).
 */

export interface Intervention {
  slug: string;
  date: string;
  lieu: string;
  titre: string;
}

export const CARNET_MIN = 3;

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;
const net = (t: string | undefined) => (t ?? '').trim();

/** Vrai si `d` est une date AAAA-MM-JJ qui existe (pas de 31 février). */
export function dateValide(d: string | undefined): boolean {
  const m = ISO.exec(net(d));
  if (!m) return false;
  const [a, mo, j] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const x = new Date(Date.UTC(a, mo - 1, j));
  return x.getUTCFullYear() === a && x.getUTCMonth() === mo - 1 && x.getUTCDate() === j;
}

export function interventionsCompletes<I extends Intervention>(liste: readonly I[] | undefined): I[] {
  const vus = new Set<string>();
  const out = (liste ?? []).filter((x) => {
    const slug = net(x.slug);
    if (!slug || !dateValide(x.date) || !net(x.lieu) || !net(x.titre) || vus.has(slug)) return false;
    vus.add(slug);
    return true;
  });
  // Tri stable : à date égale, l'ordre du client.
  return out.map((x, i) => ({ x, i })).sort((a, b) => (a.x.date === b.x.date ? a.i - b.i : a.x.date < b.x.date ? 1 : -1)).map((e) => e.x);
}

export function dateLongue(d: string): string {
  const m = ISO.exec(net(d));
  if (!m) return d;
  const j = Number(m[3]);
  return `${j === 1 ? '1er' : j} ${MOIS[Number(m[2]) - 1]} ${m[1]}`;
}

export function moisDe(d: string): { cle: string; libelle: string } {
  const m = ISO.exec(net(d))!;
  return { cle: `${m[1]}-${m[2]}`, libelle: `${MOIS[Number(m[2]) - 1]} ${m[1]}` };
}

export function parMois<I extends Intervention>(liste: readonly I[] | undefined): { cle: string; libelle: string; interventions: I[] }[] {
  const out: { cle: string; libelle: string; interventions: I[] }[] = [];
  for (const x of interventionsCompletes(liste)) {
    const m = moisDe(x.date);
    const dernier = out[out.length - 1];
    if (dernier && dernier.cle === m.cle) dernier.interventions.push(x);
    else out.push({ ...m, interventions: [x] });
  }
  return out;
}

/** Slug d'un lieu (ancre, filtre) : minuscules, sans accent, tirets. */
export function slugLieu(lieu: string): string {
  return net(lieu).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function lieuxDuCarnet(liste: readonly Intervention[] | undefined): { lieu: string; slug: string; n: number }[] {
  const compte = new Map<string, { lieu: string; slug: string; n: number }>();
  for (const x of interventionsCompletes(liste)) {
    const slug = slugLieu(x.lieu);
    const c = compte.get(slug);
    if (c) c.n += 1;
    else compte.set(slug, { lieu: net(x.lieu), slug, n: 1 });
  }
  return [...compte.values()].sort((a, b) => b.n - a.n || a.lieu.localeCompare(b.lieu, 'fr'));
}

/** Écart en jours entre une date AAAA-MM-JJ et `maintenant` (jour local), dit en mots. Date future ou illisible = ''. */
export function ilYA(d: string, maintenant: Date): string {
  const m = ISO.exec(net(d));
  if (!m) return '';
  const jour = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const auj = Date.UTC(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate());
  const n = Math.round((auj - jour) / 86_400_000);
  if (n < 0) return '';
  if (n === 0) return 'aujourd’hui';
  if (n === 1) return 'hier';
  if (n < 14) return `il y a ${n} jours`;
  if (n < 60) return `il y a ${Math.floor(n / 7)} semaines`;
  if (n < 365) return `il y a ${Math.floor(n / 30)} mois`;
  const a = Math.floor(n / 365);
  return a === 1 ? 'il y a un an' : `il y a ${a} ans`;
}

/** Les voisines dans le carnet trié : `plusRecente` (au-dessus) et `plusAncienne` (au-dessous). */
export function voisines<I extends Intervention>(liste: readonly I[] | undefined, slug: string): { plusRecente?: I; plusAncienne?: I } {
  const t = interventionsCompletes(liste);
  const i = t.findIndex((x) => x.slug === slug);
  if (i === -1) return {};
  return { plusRecente: t[i - 1], plusAncienne: t[i + 1] };
}

export function lienCarnet(liste: readonly Intervention[] | undefined, label: string): { href: string; label: string } | undefined {
  return interventionsCompletes(liste).length >= CARNET_MIN ? { href: '/carnet', label } : undefined;
}
