/**
 * Disponibilités d'un séjour (site.disponibilites) : architecture `outil-calendrier` (src/lib/architectures.ts ; source
 * Coquelicots, gîte en Dordogne, docs/veille/architectures/coquelicots.md). L'accueil mène à un OUTIL : le calendrier
 * des nuits libres et prises, le choix des dates, puis la demande envoyée par le formulaire existant (aucun paiement).
 *
 * Une période occupée { du, au } se lit comme une réservation : arrivée le `du`, départ le `au` ; les NUITS prises vont
 * du `du` à la veille du `au` (le jour du départ est libre pour une arrivée). C'est la convention des iCal exportés par
 * Airbnb, Booking, Gîtes de France (DTSTART = arrivée, DTEND = départ, exclu).
 *
 *   - ajouterJours()         : AAAA-MM-JJ + n jours ;
 *   - nuitsEntre()           : nuits d'une arrivée à un départ ;
 *   - nuitPrise()            : la nuit du jour `iso` est-elle prise ?
 *   - sejourLibre()          : aucune nuit prise de l'arrivée à la veille du départ (et arrivée < départ) ;
 *   - departMax()            : dernier départ possible après une arrivée (la première nuit prise, sinon la limite) ;
 *   - fusionnerPeriodes()    : périodes triées, chevauchements et contiguïtés fusionnés, dates invalides écartées ;
 *   - periodesAVenir()       : périodes dont le départ n'est pas passé ;
 *   - moisDuCalendrier()     : n mois à partir du mois d'un jour, semaines du lundi au dimanche (null hors du mois) ;
 *   - lireIcs()              : périodes lues dans le texte d'un iCal (VEVENT, dates seules ou dates-heures, lignes
 *                              repliées, événements annulés écartés) ;
 *   - dateSejour() / libelleSejour() : « samedi 4 juillet », « du samedi 4 au samedi 11 juillet, 7 nuits » ;
 *   - nuitsLibres()          : nuits libres sur une plage (pour dire « 12 nuits libres en novembre ») ;
 *   - calendrierConnu()      : le calendrier dit-il quelque chose ? (des périodes listées ou un iCal lu) ;
 *   - lienDisponibilites()   : { href: '/disponibilites', label } dès qu'il y a un calendrier, sinon null.
 *
 * Module pur, sans import : la date du jour est passée en paramètre (isoDuJour de src/lib/agenda.ts au build et dans
 * le navigateur). Testé par tests/architectures-sejour.test.mjs via scripts/ff/ts-loader.mjs (loadSejourModule).
 */

export interface Periode {
  du: string;
  au: string;
  libelle?: string;
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const t = (iso: string) => Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)));
const iso = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export function ajouterJours(jour: string, n: number): string {
  return iso(t(jour) + n * 86_400_000);
}

export function nuitsEntre(arrivee: string, depart: string): number {
  return Math.round((t(depart) - t(arrivee)) / 86_400_000);
}

export function nuitPrise(periodes: readonly Periode[], jour: string): boolean {
  return periodes.some((p) => p.du <= jour && jour < p.au);
}

export function sejourLibre(periodes: readonly Periode[], arrivee: string, depart: string): boolean {
  if (!ISO.test(arrivee) || !ISO.test(depart) || arrivee >= depart) return false;
  return !periodes.some((p) => p.du < depart && arrivee < p.au);
}

/** Dernier départ possible pour une arrivée : le début de la première période prise après elle, sinon `limite`. */
export function departMax(periodes: readonly Periode[], arrivee: string, limite: string): string {
  let max = limite;
  for (const p of periodes) if (p.du >= arrivee && p.du < max) max = p.du;
  return max;
}

export function fusionnerPeriodes(periodes: readonly Periode[]): Periode[] {
  const ok = periodes.filter((p) => ISO.test(p.du) && ISO.test(p.au) && p.du < p.au).map((p) => ({ ...p })).sort((a, b) => (a.du < b.du ? -1 : a.du > b.du ? 1 : 0));
  const out: Periode[] = [];
  for (const p of ok) {
    const der = out[out.length - 1];
    if (der && p.du <= der.au) {
      if (p.au > der.au) der.au = p.au;
      if (!der.libelle && p.libelle) der.libelle = p.libelle;
    } else out.push(p);
  }
  return out;
}

export function periodesAVenir(periodes: readonly Periode[], aujourdhui: string): Periode[] {
  return periodes.filter((p) => p.au > aujourdhui);
}

export interface MoisCalendrier {
  /** « 2026-11 » */
  cle: string;
  /** « Novembre 2026 » */
  nom: string;
  /** Semaines du lundi au dimanche ; null = case hors du mois. */
  semaines: (string | null)[][];
}

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
export const JOURS_COURTS = [
  { court: 'lu', long: 'lundi' },
  { court: 'ma', long: 'mardi' },
  { court: 'me', long: 'mercredi' },
  { court: 'je', long: 'jeudi' },
  { court: 've', long: 'vendredi' },
  { court: 'sa', long: 'samedi' },
  { court: 'di', long: 'dimanche' },
];

export function moisDuCalendrier(depuis: string, n: number): MoisCalendrier[] {
  const out: MoisCalendrier[] = [];
  let a = Number(depuis.slice(0, 4));
  let m = Number(depuis.slice(5, 7)) - 1;
  for (let k = 0; k < n; k++) {
    const premier = Date.UTC(a, m, 1);
    const nbJours = new Date(Date.UTC(a, m + 1, 0)).getUTCDate();
    const decalage = (new Date(premier).getUTCDay() + 6) % 7; // lundi = 0
    const cases: (string | null)[] = Array.from({ length: decalage }, () => null);
    for (let j = 1; j <= nbJours; j++) cases.push(iso(Date.UTC(a, m, j)));
    while (cases.length % 7) cases.push(null);
    const semaines: (string | null)[][] = [];
    for (let i = 0; i < cases.length; i += 7) semaines.push(cases.slice(i, i + 7));
    const nom = `${MOIS[m].replace(/^./, (c) => c.toUpperCase())} ${a}`;
    out.push({ cle: `${a}-${String(m + 1).padStart(2, '0')}`, nom, semaines });
    m += 1;
    if (m === 12) { m = 0; a += 1; }
  }
  return out;
}

/** Date AAAA-MM-JJ lue dans une valeur iCal (« 20260704 », « 20260704T150000Z ») ; undefined si illisible. */
function dateIcs(v: string): string | undefined {
  const m = /^(\d{4})(\d{2})(\d{2})/.exec(v.trim());
  return m ? `${m[1]}-${m[2]}-${m[3]}` : undefined;
}

export function lireIcs(texte: string): Periode[] {
  // Lignes repliées (RFC 5545 : une ligne qui commence par une espace ou une tabulation continue la précédente).
  const lignes = texte.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '').split('\n');
  const out: Periode[] = [];
  let ev: { du?: string; au?: string; annule?: boolean } | null = null;
  for (const l of lignes) {
    if (l === 'BEGIN:VEVENT') { ev = {}; continue; }
    if (l === 'END:VEVENT') {
      if (ev?.du && !ev.annule) out.push({ du: ev.du, au: ev.au && ev.au > ev.du ? ev.au : ajouterJours(ev.du, 1) });
      ev = null;
      continue;
    }
    if (!ev) continue;
    const i = l.indexOf(':');
    if (i === -1) continue;
    const nom = l.slice(0, i).split(';')[0].toUpperCase();
    const val = l.slice(i + 1);
    if (nom === 'DTSTART') ev.du = dateIcs(val);
    else if (nom === 'DTEND') ev.au = dateIcs(val);
    else if (nom === 'STATUS' && /CANCELLED/i.test(val)) ev.annule = true;
  }
  return out;
}

export function dateSejour(jour: string): string {
  const j = Number(jour.slice(8, 10));
  return `${JOURS[new Date(t(jour)).getUTCDay()]} ${j === 1 ? '1er' : j} ${MOIS[Number(jour.slice(5, 7)) - 1]}`;
}

export function libelleSejour(arrivee: string, depart: string): string {
  const n = nuitsEntre(arrivee, depart);
  const memeMois = arrivee.slice(0, 7) === depart.slice(0, 7);
  const debut = memeMois ? dateSejour(arrivee).replace(/ [^ ]+$/, '') : dateSejour(arrivee);
  return `du ${debut} au ${dateSejour(depart)}, ${n} nuit${n > 1 ? 's' : ''}`;
}

export function nuitsLibres(periodes: readonly Periode[], du: string, au: string): number {
  let n = 0;
  for (let j = du; j < au; j = ajouterJours(j, 1)) if (!nuitPrise(periodes, j)) n++;
  return n;
}

export function calendrierConnu(d: { occupe?: readonly unknown[]; ics?: string } | undefined, icsLu: boolean): boolean {
  if (!d) return false;
  return (d.occupe ?? []).length > 0 || (Boolean(d.ics) && icsLu);
}

export function lienDisponibilites(d: { occupe?: readonly unknown[]; ics?: string } | undefined, label: string): { href: string; label: string } | null {
  return d && ((d.occupe ?? []).length > 0 || d.ics) ? { href: '/disponibilites', label } : null;
}
