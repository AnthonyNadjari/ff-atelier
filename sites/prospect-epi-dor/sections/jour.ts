/**
 * L'état du moment de L'Épi d'Or, pour l'enseigne, la devanture et la page Venir. Lit la semaine compacte posée
 * au build dans `data-epi-semaine` (lundi d'abord, « 06:45-13:00 15:30-19:30 » par jour, vide si fermé) : rien
 * d'autre que les horaires du brief. Une règle de plus, celle du brief : « Fermé les après-midi des jours fériés »
 * (fériés de France calculés, Pâques comprise) : un jour férié, les créneaux qui commencent après midi sautent.
 * Heure de Paris, jamais l'heure de l'appareil.
 */
import { maintenant } from '@/lib/horaires';

export type Creneau = { o: number; f: number };
export const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const NBSP = ' ';

const min = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** « 06:45-13:00 15:30-19:30|…» → sept listes de créneaux en minutes. */
export function lireSemaine(data: string): Creneau[][] {
  return data.split('|').map((j) => (j ? j.split(' ').map((c) => { const [o, f] = c.split('-'); return { o: min(o), f: min(f) }; }) : []));
}

/** 405 → « 6 h 45 », 780 → « 13 h ». */
export function heure(m: number): string {
  const h = Math.floor(m / 60);
  const r = m % 60;
  return `${h}${NBSP}h${r ? `${NBSP}${String(r).padStart(2, '0')}` : ''}`;
}

/** Dimanche de Pâques (algorithme de Meeus), mois 1-12. */
export function paques(an: number): { m: number; j: number } {
  const a = an % 19, b = Math.floor(an / 100), c = an % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mois = Math.floor((h + l - 7 * m + 114) / 31);
  return { m: mois, j: ((h + l - 7 * m + 114) % 31) + 1 };
}

/** Date du jour à Paris (an, mois 1-12, jour). */
export function dateParis(d: Date): { an: number; m: number; j: number } {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  const [an, m, j] = p.split('-').map(Number);
  return { an, m, j };
}

const decaler = (an: number, m: number, j: number, n: number) => {
  const t = new Date(Date.UTC(an, m - 1, j + n));
  return { m: t.getUTCMonth() + 1, j: t.getUTCDate() };
};

/** Jour férié en France (fixes, lundi de Pâques, Ascension, lundi de Pentecôte). */
export function ferie(an: number, m: number, j: number): boolean {
  const fixes = ['1-1', '5-1', '5-8', '7-14', '8-15', '11-1', '11-11', '12-25'];
  if (fixes.includes(`${m}-${j}`)) return true;
  const p = paques(an);
  return [1, 39, 50].some((n) => { const x = decaler(an, p.m, p.j, n); return x.m === m && x.j === j; });
}

export type Etat = { ouvert: boolean; titre: string; detail: string; jour: number };

/** L'état à dire maintenant : « Ouvert jusqu'à 13 h » ou « Fermé, rouvre demain à 6 h 45 ». */
export function etat(sem: Creneau[][], d: Date): Etat {
  const { jour, minutes } = maintenant(d);
  const { an, m, j } = dateParis(d);
  const duJour = (k: number) => {
    const x = decaler(an, m, j, k);
    const f = ferie(an, x.m, x.j);
    return sem[(jour + k) % 7].filter((c) => !(f && c.o >= 12 * 60));
  };
  const auj = duJour(0);
  const plage = (cs: Creneau[]) => cs.map((c) => `${heure(c.o)} à ${heure(c.f)}`).join(', ');
  const detail = auj.length ? `Aujourd’hui ${JOURS[jour]}${NBSP}: ${plage(auj)}` : `Aujourd’hui ${JOURS[jour]}${NBSP}: fermé`;
  const enCours = auj.find((c) => minutes >= c.o && minutes < c.f);
  if (enCours) return { ouvert: true, titre: `Ouvert jusqu’à ${heure(enCours.f)}`, detail, jour };
  const plusTard = auj.find((c) => c.o > minutes);
  if (plusTard) return { ouvert: false, titre: `Fermé, rouvre à ${heure(plusTard.o)}`, detail, jour };
  for (let k = 1; k < 8; k++) {
    const cs = duJour(k);
    if (cs.length) {
      const quand = k === 1 ? 'demain' : JOURS[(jour + k) % 7];
      return { ouvert: false, titre: `Fermé, rouvre ${quand} à ${heure(cs[0].o)}`, detail, jour };
    }
  }
  return { ouvert: false, titre: 'Fermé', detail, jour };
}
