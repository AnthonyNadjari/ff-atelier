/**
 * La commande de la semaine et ses points de retrait (site.retrait) : architecture `commande-retrait`
 * (src/lib/architectures.ts ; sources Riedoasis, maraîchage bio à Obenheim : « 3 façons d'acheter », « commande AVANT
 * MARDI MIDI », vingt points de retrait en boucheries, épiceries, crèches, filtrés par jour, une page par point ; Au
 * temps de la source, Vosges : un onglet par point, jour de retrait, vente directe oui / non ;
 * docs/veille/architectures/commande-retrait.md). Le producteur ne tient pas boutique : on commande avant une heure
 * fixe et on retire chez un partenaire un jour fixe. Le site est ce rythme et cette liste.
 *
 *   - indexJour()       : « mardi », « Mardi » → 1 (lundi = 0) ; undefined si le jour ne se lit pas ;
 *   - heureLisible()    : « 12:00 » → « 12 h », « 09:30 » → « 9 h 30 » ;
 *   - pointsComplets()  : points avec slug, nom, commune, jour lisible et heures « HH:MM » (mesure `retraits`), slugs
 *                         uniques ;
 *   - pointsParJour()   : les jours qui ont un point (lundi → dimanche), points triés par heure d'ouverture ;
 *   - phraseDuCycle()   : « Commandez avant le mardi à 12 h, retirez le jeudi, le vendredi ou le samedi. » (sans
 *                         script, la règle elle-même) ;
 *   - prochainCycle()   : à partir de maintenant (jour, minutes), la prochaine clôture et les retraits qui la suivent,
 *                         en jours d'écart (0 = aujourd'hui) ; calculé DANS LE NAVIGATEUR, jamais au build ;
 *   - libelleDecalage() : 0 → « aujourd’hui », 1 → « demain », sinon le jour (« jeudi ») ;
 *   - lienRetrait()     : entrée de nav vers /retrait, dès 2 points complets.
 *
 * Module pur, sans import. Testé par tests/architectures-retrait.test.mjs via scripts/ff/ts-loader.mjs
 * (loadRetraitModule).
 */

export const JOURS_RETRAIT = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] as const;

export interface Cloture {
  jour: string;
  heure: string;
}

export interface Point {
  slug: string;
  nom: string;
  commune: string;
  jour: string;
  debut: string;
  fin: string;
}

export interface Retrait<P extends Point = Point> {
  cloture?: Cloture;
  points?: readonly P[];
}

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
const sansAccents = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

export function indexJour(jour: string | undefined): number | undefined {
  const t = sansAccents((jour ?? '').trim().toLowerCase());
  const i = JOURS_RETRAIT.findIndex((j) => sansAccents(j.toLowerCase()) === t);
  return i === -1 ? undefined : i;
}

export function heureLisible(hhmm: string): string {
  const m = HHMM.exec(hhmm ?? '');
  if (!m) return hhmm;
  const [h, mn] = hhmm.split(':');
  return mn === '00' ? `${Number(h)} h` : `${Number(h)} h ${mn}`;
}

const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export function pointsComplets<P extends Point>(r: Retrait<P> | undefined): P[] {
  const vus = new Set<string>();
  return (r?.points ?? []).filter((p) => {
    const slug = (p.slug ?? '').trim();
    if (!slug || !(p.nom ?? '').trim() || !(p.commune ?? '').trim() || vus.has(slug)) return false;
    if (indexJour(p.jour) === undefined || !HHMM.test(p.debut ?? '') || !HHMM.test(p.fin ?? '')) return false;
    vus.add(slug);
    return true;
  });
}

export function pointsParJour<P extends Point>(r: Retrait<P> | undefined): { index: number; jour: (typeof JOURS_RETRAIT)[number]; points: P[] }[] {
  const ok = pointsComplets(r);
  return JOURS_RETRAIT.map((jour, index) => ({
    index,
    jour,
    points: ok
      .map((p, i) => ({ p, i }))
      .filter((x) => indexJour(x.p.jour) === index)
      .sort((a, b) => minutes(a.p.debut) - minutes(b.p.debut) || a.i - b.i)
      .map((x) => x.p),
  })).filter((d) => d.points.length > 0);
}

/** La clôture si elle se lit (jour connu, heure « HH:MM »), sinon undefined. */
export function clotureValide(c: Cloture | undefined): { jour: number; minutes: number; heure: string } | undefined {
  const j = indexJour(c?.jour);
  if (j === undefined || !HHMM.test(c?.heure ?? '')) return undefined;
  return { jour: j, minutes: minutes(c!.heure), heure: c!.heure };
}

const liste = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ou ${xs[xs.length - 1]}`);

export function phraseDuCycle(r: Retrait | undefined): string | undefined {
  const c = clotureValide(r?.cloture);
  const jours = pointsParJour(r).map((d) => `le ${d.jour.toLowerCase()}`);
  if (!c || jours.length === 0) return undefined;
  return `Commandez avant le ${JOURS_RETRAIT[c.jour].toLowerCase()} à ${heureLisible(c.heure)}, retirez ${liste(jours)}.`;
}

export interface Cycle {
  cloture: { decalage: number; jour: number; heure: string };
  retraits: { decalage: number; jour: number }[];
}

/**
 * Prochaine clôture à partir de `maintenant` (jour 0 = lundi, minutes depuis minuit, fuseau du navigateur réglé par
 * l'appelant) : aujourd'hui si l'heure n'est pas passée, sinon le prochain jour de clôture ; puis chaque jour de retrait
 * qui suit cette clôture (le même jour que la clôture compte pour la semaine suivante).
 */
export function prochainCycle(maintenant: { jour: number; minutes: number }, r: Retrait | undefined): Cycle | undefined {
  const c = clotureValide(r?.cloture);
  const jours = pointsParJour(r).map((d) => d.index);
  if (!c || jours.length === 0) return undefined;
  let k = (c.jour - maintenant.jour + 7) % 7;
  if (k === 0 && maintenant.minutes >= c.minutes) k = 7;
  const retraits = jours
    .map((j) => ({ jour: j, decalage: k + (((j - c.jour + 7) % 7) || 7) }))
    .sort((a, b) => a.decalage - b.decalage);
  return { cloture: { decalage: k, jour: c.jour, heure: c.heure }, retraits };
}

export function libelleDecalage(decalage: number, jour: number): string {
  if (decalage === 0) return 'aujourd’hui';
  if (decalage === 1) return 'demain';
  const nom = (JOURS_RETRAIT[jour] ?? '').toLowerCase();
  return decalage >= 7 ? `${nom} prochain` : nom;
}

export function lienRetrait(r: Retrait | undefined, label: string): { href: string; label: string } | undefined {
  return pointsComplets(r).length >= 2 ? { href: '/retrait', label } : undefined;
}
