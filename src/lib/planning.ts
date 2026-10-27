/**
 * Le planning de la semaine (site.planning) : architecture `planning-semaine` (src/lib/architectures.ts ; source Danse
 * Germain Blanchet, Rouen : « Planning rive droite », un jour par titre, chaque cours « 18:10 – 19:10, Barre au sol,
 * Niveau Tous niveaux, Salle Grande salle, Prof Catherine, Cours 1h » ; seconde source Ell'Zi-Danse, Saintes : la
 * semaine en colonnes, filtrée par cours ; docs/veille/architectures/planning-semaine.md). Une école se choisit sur le
 * créneau qu'on peut tenir : le site est son planning.
 *
 *   - coursValides()      : les cours dont le jour, les heures (fin après début) et le nom se lisent (mesure `planning`) ;
 *   - joursDuPlanning()   : les jours qui ont au moins un cours, du lundi au dimanche, chaque jour rangé par heure ;
 *   - disciplines()       : les disciplines du filtre (service du cours, sinon son nom), dans l'ordre d'apparition ;
 *   - dureeDuCours()      : « 1 h 30 », « 45 min », tirée des heures (jamais devinée) ;
 *   - heureLisible()      : « 18:10 » → « 18 h 10 » (espaces insécables) ;
 *   - coursDuService()    : les créneaux d'une discipline (sa page) ;
 *   - indexDuJour()       : rang du jour (0 = lundi) d'un nom de jour ;
 *   - lienPlanning()      : entrée de nav vers /planning, dès 6 cours sur 2 jours au moins.
 *
 * Module pur, sans import. Testé par tests/architectures-semaine.test.mjs via scripts/ff/ts-loader.mjs (loadPlanningModule).
 */

export const JOURS_PLANNING = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const;
export type JourPlanning = (typeof JOURS_PLANNING)[number];

const NBSP = ' ';

export interface Cours {
  jour: string;
  debut: string;
  fin: string;
  nom: string;
  service?: string;
  niveau?: string;
  salle?: string;
  lieu?: string;
  prof?: string;
  note?: string;
}

export interface Planning {
  cours?: readonly Cours[];
}

export interface JourDuPlanning<T extends Cours = Cours> {
  jour: JourPlanning;
  index: number;
  label: string;
  cours: T[];
}

const minutes = (hhmm: string) => {
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm ?? '');
  if (!m) return NaN;
  const h = Number(m[1]);
  const mn = Number(m[2]);
  return h < 24 && mn < 60 ? h * 60 + mn : NaN;
};

export function indexDuJour(jour: string): number {
  return JOURS_PLANNING.indexOf((jour ?? '').trim().toLowerCase() as JourPlanning);
}

export function coursValides<T extends Cours>(p: { cours?: readonly T[] } | undefined): T[] {
  return (p?.cours ?? []).filter((c) => indexDuJour(c.jour) !== -1 && (c.nom ?? '').trim() && minutes(c.fin) > minutes(c.debut));
}

export function joursDuPlanning<T extends Cours>(p: { cours?: readonly T[] } | undefined): JourDuPlanning<T>[] {
  const valides = coursValides(p);
  const out: JourDuPlanning<T>[] = [];
  JOURS_PLANNING.forEach((jour, index) => {
    const cours = valides.filter((c) => indexDuJour(c.jour) === index).sort((a, b) => minutes(a.debut) - minutes(b.debut) || minutes(a.fin) - minutes(b.fin));
    if (cours.length > 0) out.push({ jour, index, label: jour.charAt(0).toUpperCase() + jour.slice(1), cours });
  });
  return out;
}

/** Clé du filtre d'un cours : son service s'il en a un, sinon son nom (minuscules, sans espaces doublés). */
export function cleDiscipline(c: Cours): string {
  return (c.service ?? '').trim() || (c.nom ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

export function disciplines(cours: readonly Cours[], titres: Record<string, string> = {}): { cle: string; label: string; n: number }[] {
  const out = new Map<string, { cle: string; label: string; n: number }>();
  for (const c of cours) {
    const cle = cleDiscipline(c);
    const d = out.get(cle);
    if (d) d.n += 1;
    else out.set(cle, { cle, label: (c.service && titres[c.service]) || c.nom.trim(), n: 1 });
  }
  return [...out.values()];
}

export function dureeDuCours(c: Pick<Cours, 'debut' | 'fin'>): string {
  const d = minutes(c.fin) - minutes(c.debut);
  if (!(d > 0)) return '';
  const h = Math.floor(d / 60);
  const m = d % 60;
  if (h === 0) return `${m}${NBSP}min`;
  return m ? `${h}${NBSP}h${NBSP}${String(m).padStart(2, '0')}` : `${h}${NBSP}h`;
}

export function heureLisible(hhmm: string): string {
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm ?? '');
  if (!m) return hhmm;
  const h = Number(m[1]);
  return m[2] === '00' ? `${h}${NBSP}h` : `${h}${NBSP}h${NBSP}${m[2]}`;
}

export function coursDuService<T extends Cours>(p: { cours?: readonly T[] } | undefined, slug: string): JourDuPlanning<T>[] {
  return joursDuPlanning({ cours: coursValides(p).filter((c) => c.service === slug) });
}

export function lienPlanning(p: Planning | undefined, label: string): { href: string; label: string } | undefined {
  return coursValides(p).length >= 6 && joursDuPlanning(p).length >= 2 ? { href: '/planning', label } : undefined;
}
