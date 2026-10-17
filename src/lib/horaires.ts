/**
 * Horaires par jour (docs/veille/demontages/INDEX.md, geste 4 : Délice, Odyssée, Niksen) : à partir des
 * lignes libres de contact.hours (« Lundi – vendredi », « 8 h – 18 h », opens/closes HH:MM optionnels),
 * la semaine complète lundi → dimanche, et l'état du moment (« Ouvert », « Fermé », « Ouvre à 9 h »)
 * calculé dans le fuseau Europe/Paris — jamais d'horloge affichée.
 *
 * Rien d'inventé : un jour qu'aucune ligne ne couvre est « Fermé » (un commerce qui liste ses horaires
 * et omet un jour est fermé ce jour-là) ; une ligne dont les jours ne se lisent pas (« Sur rendez-vous
 * le soir ») rend semaine() indéfinie et le composant affiche alors la liste telle quelle ; un jour
 * sans opens/closes (« Sur rendez-vous ») n'a pas d'état.
 *
 * Module pur, sans dépendance : utilisé par src/components/Horaires.astro (au build et dans son script
 * client), testé par tests/horaires.test.mjs via scripts/ff/ts-loader.mjs.
 */

export const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] as const;
const JOURS_RE = [/\blundi\b/, /\bmardi\b/, /\bmercredi\b/, /\bjeudi\b/, /\bvendredi\b/, /\bsamedi\b/, /\bdimanche\b/];

/** Espace insécable (U+00A0) : « 9 h 30 », « 14 h – 19 h ». */
export const NBSP = ' ';

export interface Creneau {
  opens: string; // HH:MM
  closes: string; // HH:MM
}
export interface LigneHoraire {
  days: string;
  hours: string;
  opens?: string;
  closes?: string;
}
export interface JourSemaine {
  /** 0 = lundi … 6 = dimanche. */
  index: number;
  jour: (typeof JOURS)[number];
  /** Texte affiché (les `hours` des lignes qui couvrent ce jour, « Fermé » si aucune). */
  libelle: string;
  creneaux: Creneau[];
  ferme: boolean;
}
export interface Etat {
  /** Jour courant, 0 = lundi … 6 = dimanche. */
  jour: number;
  ouvert: boolean;
  /** « Ouvert », « Fermé », « Ouvre à 9 h » — absent quand les horaires du jour n'ont pas d'opens/closes. */
  texte?: string;
}

const sansAccents = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Jours (0 = lundi … 6 = dimanche) désignés par un champ `days` libre : « Lundi – vendredi »,
 * « Du lundi au samedi », « Mardi, jeudi », « Samedi », « Tous les jours ». Une plage (tiret ou « au »
 * entre deux jours) est étendue aux jours intermédiaires. undefined si aucun jour n'est reconnu.
 */
export function joursDe(days: string): number[] | undefined {
  const t = sansAccents(days);
  if (/\btous les jours\b|\b7\s?j\s?\/\s?7\b/.test(t)) return [0, 1, 2, 3, 4, 5, 6];
  // Jours trouvés, dans l'ordre où ils apparaissent dans le texte (« Vendredi – lundi » = 4 puis 0).
  const hits = JOURS_RE.map((re, i) => ({ i, at: t.search(re) }))
    .filter((h) => h.at >= 0)
    .sort((x, y) => x.at - y.at)
    .map((h) => h.i);
  if (hits.length === 0) return undefined;
  const plage = hits.length >= 2 && /[–—-]|\bau\b/.test(t);
  if (!plage) return hits;
  const [a, b] = [hits[0], hits[hits.length - 1]];
  const out: number[] = [];
  for (let d = a; ; d = (d + 1) % 7) {
    out.push(d);
    if (d === b || out.length > 7) break;
  }
  return out;
}

/** Les 7 jours dans l'ordre, ou undefined si une ligne a des jours illisibles (rendu brut à la place). */
export function semaine(hours: LigneHoraire[]): JourSemaine[] | undefined {
  if (hours.length === 0) return undefined;
  const parJour = JOURS.map((jour, index) => ({ index, jour, libelles: [] as string[], creneaux: [] as Creneau[] }));
  for (const h of hours) {
    const js = joursDe(h.days);
    if (!js) return undefined;
    for (const j of js) {
      const d = parJour[j];
      if (!d.libelles.includes(h.hours)) d.libelles.push(h.hours);
      if (h.opens && h.closes) d.creneaux.push({ opens: h.opens, closes: h.closes });
    }
  }
  return parJour.map((d) => ({
    index: d.index,
    jour: d.jour,
    libelle: d.libelles.join(', ') || 'Fermé',
    creneaux: d.creneaux,
    ferme: d.libelles.length === 0 || d.libelles.every((l) => /^ferm/i.test(l.trim())),
  }));
}

/** « 09:30 » → « 9 h 30 », « 18:00 » → « 18 h » (espaces insécables). */
export function formatHeure(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  return m ? `${h}${NBSP}h${NBSP}${String(m).padStart(2, '0')}` : `${h}${NBSP}h`;
}

/** « 14 h – 19 h » : demi-cadratin entre deux espaces insécables. */
export function formatPlage(opens: string, closes: string): string {
  return `${formatHeure(opens)}${NBSP}–${NBSP}${formatHeure(closes)}`;
}

const minutesDe = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Jour (0 = lundi) et minute du jour à `date`, dans le fuseau donné (Europe/Paris par défaut). */
export function maintenant(date: Date, timeZone = 'Europe/Paris'): { jour: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const jour = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday'));
  return { jour, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

/**
 * État du moment pour la semaine de semaine() : « Ouvert » si dans un créneau du jour, « Ouvre à … »
 * si un créneau du jour commence plus tard, « Fermé » sinon (jour fermé compris). Un créneau dont
 * closes <= opens franchit minuit. Pas de texte si le jour a des horaires sans opens/closes.
 */
export function etatDuJour(sem: Pick<JourSemaine, 'creneaux' | 'ferme'>[], date: Date, timeZone = 'Europe/Paris'): Etat {
  const { jour, minutes } = maintenant(date, timeZone);
  const d = sem[jour];
  if (!d) return { jour, ouvert: false };
  for (const c of d.creneaux) {
    const o = minutesDe(c.opens);
    const f = minutesDe(c.closes);
    const fin = f <= o ? f + 24 * 60 : f;
    if (minutes >= o && minutes < fin) return { jour, ouvert: true, texte: 'Ouvert' };
  }
  const prochain = d.creneaux.map((c) => c.opens).filter((o) => minutesDe(o) > minutes).sort()[0];
  if (prochain) return { jour, ouvert: false, texte: `Ouvre à ${formatHeure(prochain)}` };
  if (d.creneaux.length > 0 || d.ferme) return { jour, ouvert: false, texte: 'Fermé' };
  return { jour, ouvert: false };
}
