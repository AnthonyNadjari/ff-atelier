/**
 * La grille de prix publiée (site.tarifs) : architecture `grille-urgence` (src/lib/architectures.ts ; source Serrure
 * Ouest, serrurier à Paris 16e, docs/veille/architectures/grille-urgence.md). Le site d'un métier d'urgence est sa
 * grille : chaque situation a son prix PAR CRÉNEAU (journée, soirée, nuit), dit avant l'appel ; « Porte claquée ou
 * fermée à clé ? » est la question qui change le prix.
 *
 *   - situationsCompletes() : situations qui ont au moins un prix (mesure `situations` de donneesManquantes) ;
 *   - minutesDe()           : « 08:30 » → 510 ;
 *   - creneauDuMoment()     : index du créneau de l'heure (jour 0 = lundi, minutes depuis minuit, fuseau du client),
 *                             -1 hors créneau ; un créneau dont la fin précède le début franchit minuit (il appartient
 *                             au jour où il commence) ;
 *   - prixDes()             : les prix d'une situation alignés sur les créneaux (« » quand le client n'en donne pas) ;
 *   - prixLePlusBas()       : « dès 100 € » = le plus petit prix lisible en euros, sinon undefined (rien d'autre
 *                             n'est calculé) ;
 *   - lienTarifs()          : entrée de nav vers /tarifs, seulement s'il y a une situation complète.
 *
 * Module pur, sans import. Testé par tests/architectures-atelier.test.mjs via scripts/ff/ts-loader.mjs
 * (loadTarifsModule).
 */

export interface Creneau {
  nom: string;
  heures?: string;
  de: string;
  a: string;
  jours?: 'tous' | 'semaine' | 'week-end';
}

export interface Situation {
  slug: string;
  nom: string;
  prix?: string[];
}

export interface Tarifs {
  creneaux?: Creneau[];
  situations?: Situation[];
}

export function situationsCompletes<T extends Partial<Situation>>(t: { situations?: readonly T[] } | undefined): T[] {
  return (t?.situations ?? []).filter((s) => (s.prix ?? []).some((p) => p.trim()));
}

export function minutesDe(hhmm: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  return m ? Number(m[1]) * 60 + Number(m[2]) : NaN;
}

const JOURS_OK = (jours: Creneau['jours'], jour: number) =>
  !jours || jours === 'tous' || (jours === 'semaine' ? jour >= 0 && jour <= 4 : jour >= 5 && jour <= 6);

export function creneauDuMoment(creneaux: readonly Creneau[], moment: { jour: number; minutes: number }): number {
  const { jour, minutes } = moment;
  const veille = (jour + 6) % 7;
  for (let i = 0; i < creneaux.length; i++) {
    const c = creneaux[i];
    const de = minutesDe(c.de), a = minutesDe(c.a);
    if (!Number.isFinite(de) || !Number.isFinite(a) || de === a) continue;
    if (de < a) {
      if (minutes >= de && minutes < a && JOURS_OK(c.jours, jour)) return i;
    } else {
      // Franchit minuit : avant minuit le jour même, après minuit le créneau a commencé la veille.
      if (minutes >= de && JOURS_OK(c.jours, jour)) return i;
      if (minutes < a && JOURS_OK(c.jours, veille)) return i;
    }
  }
  return -1;
}

export function prixDes(s: Pick<Situation, 'prix'>, creneaux: readonly unknown[]): string[] {
  const n = Math.max(1, creneaux.length);
  return Array.from({ length: n }, (_, i) => (s.prix ?? [])[i]?.trim() ?? '');
}

const EUROS = /^\s*(?:dès\s+|à partir de\s+)?(\d[\d\s  ]*(?:[.,]\d{1,2})?)\s*(?:€|euros?)\s*$/i;

export function prixLePlusBas(prix: readonly string[]): string | undefined {
  let min: number | undefined;
  let texte = '';
  for (const p of prix) {
    const m = EUROS.exec(p ?? '');
    if (!m) continue;
    const v = Number(m[1].replace(/[\s  ]/g, '').replace(',', '.'));
    if (Number.isFinite(v) && (min === undefined || v < min)) { min = v; texte = m[1].trim(); }
  }
  return min === undefined ? undefined : `dès ${texte} €`;
}

export function lienTarifs(t: Tarifs | undefined, label: string): { href: string; label: string } | undefined {
  return situationsCompletes(t).length > 0 ? { href: '/tarifs', label } : undefined;
}
