/**
 * Horaires par jour (docs/veille/demontages/INDEX.md, geste 4 : Délice, Odyssée, Niksen) : à partir des
 * lignes libres de contact.hours (« Lundi – vendredi », « 8 h – 18 h », opens/closes HH:MM optionnels),
 * la semaine complète lundi → dimanche, et l'état du moment (« Ouvert », « Fermé », « Ouvre à 9 h »)
 * calculé dans le fuseau Europe/Paris — jamais d'horloge affichée.
 *
 * Rien d'inventé : un jour qu'aucune ligne ne couvre est « Fermé » (un commerce qui liste ses horaires
 * et omet un jour est fermé ce jour-là) ; une ligne dont les jours ne se lisent pas (« Sur rendez-vous
 * le soir », « Dimanche et jours fériés » : lecture stricte, un seul mot inconnu suffit) rend semaine()
 * indéfinie et le composant affiche alors la liste telle quelle, jamais un « Fermé » deviné ; un jour
 * sans opens/closes (« Sur rendez-vous ») n'a pas d'état.
 *
 * Module pur, sans dépendance : utilisé par src/components/Horaires.astro (au build et dans son script
 * client), testé par tests/horaires.test.mjs via scripts/ff/ts-loader.mjs.
 */

export const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] as const;

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
  /** Les `hours` des lignes qui couvrent ce jour, une par ligne, dans l'ordre du client ([] si aucune). */
  libelles: string[];
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

/** Mot (sans accents, minuscules, sans point final) → jour : nom complet, pluriel (« samedis ») ou abréviation courante. */
const MOTS_JOURS: Record<string, number> = {
  lundi: 0, lun: 0, lu: 0,
  mardi: 1, mar: 1, ma: 1,
  mercredi: 2, mer: 2, me: 2, merc: 2,
  jeudi: 3, jeu: 3, je: 3,
  vendredi: 4, ven: 4, ve: 4, vend: 4,
  samedi: 5, sam: 5, sa: 5,
  dimanche: 6, dim: 6, di: 6,
};
/** Mots de liaison sans effet (« Du mardi au vendredi », « Le samedi », « De lundi à jeudi »). */
const MOTS_NEUTRES = new Set(['du', 'de', 'le', 'les', 'jusqu']);
/** Mots qui font d'une paire de jours une plage (« à », « au » ; « jusqu'au » se lit « jusqu » neutre puis « au »). */
const MOTS_PLAGE = new Set(['a', 'au']);

const jourDuMot = (mot: string): number | undefined => {
  if (mot in MOTS_JOURS) return MOTS_JOURS[mot];
  if (mot.endsWith('s') && mot.slice(0, -1) in MOTS_JOURS && mot.length > 4) return MOTS_JOURS[mot.slice(0, -1)];
  return undefined;
};

/** Jours de a à b inclus, en franchissant le dimanche si besoin (« Vendredi – lundi » = 4, 5, 6, 0). */
const plageDe = (a: number, b: number): number[] => {
  const out: number[] = [];
  for (let d = a; ; d = (d + 1) % 7) {
    out.push(d);
    if (d === b) break;
  }
  return out;
};

/**
 * Lecture stricte d'une liste de jours : chaque mot doit être un jour, un mot de liaison, un séparateur
 * de liste (« , », « et », « & », « / ») ou de plage (« - », « – », « — », « à », « au », « jusqu'au »).
 * Un seul mot inconnu (« matin », « fériés », « Urgences », « Avril ») et la lecture échoue : undefined.
 */
function lireListe(t: string): number[] | undefined {
  if (/^\s*(tous les jours|7\s*j(ours)?\s*(\/|sur)\s*7)\s*$/.test(t)) return [0, 1, 2, 3, 4, 5, 6];
  const jetons = t.match(/[a-z]+|[,&/]|[-–—−]|\S/g) ?? [];
  const out: number[] = [];
  let enAttente: number | undefined; // dernier jour lu, qui peut ouvrir une plage
  let plage = false;
  const pousser = (js: number[]) => js.forEach((j) => { if (!out.includes(j)) out.push(j); });
  for (const jeton of jetons) {
    const jour = jourDuMot(jeton);
    if (jour !== undefined) {
      if (plage) {
        if (enAttente === undefined) return undefined;
        pousser(plageDe(enAttente, jour));
        enAttente = undefined;
        plage = false;
      } else {
        if (enAttente !== undefined) pousser([enAttente]);
        enAttente = jour;
      }
    } else if (/^[-–—−]$/.test(jeton) || MOTS_PLAGE.has(jeton)) {
      if (enAttente === undefined || plage) return undefined;
      plage = true;
    } else if (/^[,&/]$/.test(jeton) || jeton === 'et') {
      if (plage) return undefined;
      if (enAttente !== undefined) pousser([enAttente]);
      enAttente = undefined;
    } else if (MOTS_NEUTRES.has(jeton) || jeton === '.' || jeton === "'" || jeton === '’') {
      // « Lun. », « jusqu'au » : sans effet.
    } else {
      return undefined;
    }
  }
  if (plage) return undefined;
  if (enAttente !== undefined) pousser([enAttente]);
  return out.length > 0 ? out : undefined;
}

/**
 * Jours (0 = lundi … 6 = dimanche) désignés par un champ `days` libre : plages (« Lundi – vendredi »,
 * « Mardi à vendredi », « Lundi au vendredi », « Du mardi au vendredi », « Mar-Ven », « Lun–Sam »), listes
 * (« Mardi, jeudi », « Lundi, mercredi et vendredi »), jour seul, « Tous les jours », « 7j/7 », exclusion
 * (« Tous les jours sauf le lundi », « Du lundi au samedi sauf mercredi »). Abréviations françaises
 * courantes (lun, mar, mer, jeu, ven, sam, dim, avec ou sans point). undefined dès qu'un mot ne se lit pas :
 * le composant affiche alors les lignes du client telles quelles, jamais un « Fermé » deviné.
 */
export function joursDe(days: string): number[] | undefined {
  const t = sansAccents(days).replace(/\s+/g, ' ').trim();
  const [base, ...sauf] = t.split(/\bsauf\b/);
  if (sauf.length > 1) return undefined;
  const inclus = lireListe(base);
  if (!inclus) return undefined;
  if (sauf.length === 0) return inclus;
  const exclus = lireListe(sauf[0]);
  if (!exclus) return undefined;
  const reste = inclus.filter((j) => !exclus.includes(j));
  return reste.length > 0 ? reste : undefined;
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
    libelles: d.libelles,
    creneaux: d.creneaux,
    ferme: d.libelles.length === 0 || d.libelles.every((l) => /^ferm/i.test(l.trim())),
  }));
}

/** « a », « a et b », « a, b et c ». */
const enumerer = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} et ${xs[xs.length - 1]}`);

/**
 * Horaires complets d'un jour en une ligne : « Aujourd’hui mardi : 8 h 30 à 12 h 30 et 15 h 30 à 19 h »,
 * « Aujourd’hui lundi : fermé ». Toutes les lignes du client qui couvrent ce jour, pas seulement la
 * première (panneau de la coquille `split`, 17 oct 2026). `jour` : 0 = lundi … 6 = dimanche.
 */
export function ligneDuJour(sem: Pick<JourSemaine, 'jour' | 'libelles' | 'ferme'>[], jour: number): string | undefined {
  const d = sem[jour];
  if (!d) return undefined;
  const texte = d.ferme ? 'fermé' : enumerer(d.libelles.filter((l) => !/^ferm/i.test(l.trim())));
  return `Aujourd’hui ${d.jour.toLowerCase()}${NBSP}: ${texte}`;
}

/**
 * Lignes de contact.hours regroupées par champ `days` identique, dans l'ordre du client :
 * [« Du mardi au vendredi », « 8 h 30 à 12 h 30 »] + [même jours, « 15 h 30 à 19 h »] →
 * { days: « Du mardi au vendredi », hours: « 8 h 30 à 12 h 30 et 15 h 30 à 19 h » }. Ne lit pas les jours
 * (aucune déduction) : sert de rendu sans script, toutes les lignes, sans répéter les jours.
 */
export function regrouperLignes(hours: Pick<LigneHoraire, 'days' | 'hours'>[]): { days: string; hours: string }[] {
  const groupes: { days: string; hours: string[] }[] = [];
  for (const h of hours) {
    const g = groupes.find((x) => x.days.trim() === h.days.trim());
    if (g) { if (!g.hours.includes(h.hours)) g.hours.push(h.hours); }
    else groupes.push({ days: h.days, hours: [h.hours] });
  }
  return groupes.map((g) => ({ days: g.days, hours: enumerer(g.hours) }));
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
