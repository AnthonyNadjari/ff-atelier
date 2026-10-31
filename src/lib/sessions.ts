/**
 * Les formations d'une auto-école ou d'un centre de formation et leurs sessions datées (site.formations) : architecture
 * `sessions-places` (src/lib/architectures.ts ; source MAP, Moto-Auto-Pédagogie, Annecy et Seynod : chaque formation est
 * une fiche à prix (« Permis B conduite traditionnelle, 979 € »), ce qu'il faut avant (âge, ASSR2, le code), les pièces à
 * fournir, et les sessions datées à places comptées (« Mercredi 25 novembre 2026, 9 h à 13 h et 14 h à 17 h, plus qu'une
 * seule place ») ; docs/veille/architectures/sessions-places.md).
 * Le client se demande « quand est la prochaine session, reste-t-il de la place, combien, et qu'est-ce qu'il me faut ? ».
 *
 *   - formationsCompletes() : formations avec slug et nom, slugs uniques, dans l'ordre du client (mesure `formations`) ;
 *   - sessionsAVenir()      : toutes les sessions du jour et à venir, toutes formations, de la plus proche à la plus
 *                             lointaine, chacune avec sa formation (mesure `sessions`) ; une session passée tombe au build ;
 *   - sessionsDe()          : les sessions à venir d'une formation ;
 *   - placesEnMots()        : 0 → « Complet », 1 → « Plus qu’une place », 4 → « 4 places » ; absent → '' (jamais deviné) ;
 *   - dateDeSession()       : « mer. 25 nov. » ou « du 7 au 9 juil. » ; jour, mois et texte long pour le billet ;
 *   - parCategorie()        : les catégories dans l'ordre de première apparition (« Voiture », « Deux-roues »), les
 *                             formations sans catégorie en dernier sous « Autres formations » ;
 *   - lienFormations()      : entrée de nav (/formations dès 3 formations).
 *
 * Rien n'est deviné : un prix absent s'écrit « sur demande », des places absentes ne s'écrivent pas. Module pur, sans
 * import. Testé par tests/architectures-sessions.test.mjs via scripts/ff/ts-loader.mjs (loadSessionsModule).
 */

export const FORMATIONS_MIN = 3;
export const SESSIONS_MIN = 2;
export const AUTRES_FORMATIONS = 'Autres formations';

export interface Session {
  debut: string;
  fin?: string;
  places?: number;
}
export interface Formation {
  slug: string;
  nom: string;
  categorie?: string;
  sessions?: readonly Session[];
}

const MOIS_COURTS = ['janv.', 'févr.', 'mars', 'avril', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const JOURS_COURTS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;
const net = (t: string | undefined) => (t ?? '').trim();

/** Date du jour AAAA-MM-JJ à Paris (au build ; le navigateur refait le tri). */
export function isoDuJour(date: Date = new Date(), timeZone = 'Europe/Paris'): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

export function formationsCompletes<T extends Formation>(liste: readonly T[] | undefined): T[] {
  const vus = new Set<string>();
  const out: T[] = [];
  for (const f of liste ?? []) {
    const slug = net(f.slug);
    if (!slug || !net(f.nom) || vus.has(slug)) continue;
    vus.add(slug);
    out.push(f);
  }
  return out;
}

const finDe = (s: Session) => (s.fin && ISO.test(s.fin) && s.fin >= s.debut ? s.fin : s.debut);

export function sessionsDe<S extends Session>(f: { sessions?: readonly S[] }, aujourdhui: string = isoDuJour()): S[] {
  return (f.sessions ?? []).filter((s) => ISO.test(s.debut) && finDe(s) >= aujourdhui).slice().sort((a, b) => (a.debut < b.debut ? -1 : a.debut > b.debut ? 1 : 0));
}

export function sessionsAVenir<T extends Formation>(liste: readonly T[] | undefined, aujourdhui: string = isoDuJour()): { formation: T; session: NonNullable<T['sessions']>[number] }[] {
  const out: { formation: T; session: NonNullable<T['sessions']>[number] }[] = [];
  for (const f of formationsCompletes(liste)) for (const s of sessionsDe(f, aujourdhui)) out.push({ formation: f, session: s as NonNullable<T['sessions']>[number] });
  return out.sort((a, b) => (a.session.debut < b.session.debut ? -1 : a.session.debut > b.session.debut ? 1 : 0));
}

export function placesEnMots(places: number | undefined): string {
  if (typeof places !== 'number' || !Number.isInteger(places) || places < 0) return '';
  if (places === 0) return 'Complet';
  if (places === 1) return 'Plus qu’une place';
  return `${places} places`;
}

function parts(iso: string) {
  const m = ISO.exec(iso);
  if (!m) return undefined;
  const [a, mo, j] = [Number(m[1]), Number(m[2]), Number(m[3])];
  return { a, mo, j, js: new Date(Date.UTC(a, mo - 1, j)).getUTCDay() };
}

/** « mer. 25 nov. » ; « du 7 au 9 juil. » ; « du 30 juin au 2 juil. » ; jour et mois du billet ; texte long. */
export function dateDeSession(s: Session): { court: string; jour: string; mois: string; long: string } {
  const d = parts(s.debut);
  if (!d) return { court: s.debut, jour: s.debut, mois: '', long: s.debut };
  const f = s.fin && s.fin > s.debut ? parts(s.fin) : undefined;
  const j1 = d.j === 1 ? '1er' : String(d.j);
  const long1 = `${JOURS[d.js]} ${j1} ${MOIS[d.mo - 1]} ${d.a}`;
  if (!f) return { court: `${JOURS_COURTS[d.js]} ${d.j} ${MOIS_COURTS[d.mo - 1]}`, jour: String(d.j), mois: MOIS_COURTS[d.mo - 1], long: long1 };
  const memeMois = f.mo === d.mo && f.a === d.a;
  const court = memeMois ? `du ${d.j} au ${f.j} ${MOIS_COURTS[f.mo - 1]}` : `du ${d.j} ${MOIS_COURTS[d.mo - 1]} au ${f.j} ${MOIS_COURTS[f.mo - 1]}`;
  return { court, jour: memeMois ? `${d.j}-${f.j}` : String(d.j), mois: MOIS_COURTS[d.mo - 1], long: `du ${long1} au ${JOURS[f.js]} ${f.j === 1 ? '1er' : f.j} ${MOIS[f.mo - 1]} ${f.a}` };
}

export function parCategorie<T extends Formation>(liste: readonly T[] | undefined): { categorie: string; formations: T[] }[] {
  const out: { categorie: string; formations: T[] }[] = [];
  const sans: T[] = [];
  for (const f of formationsCompletes(liste)) {
    const c = net(f.categorie);
    if (!c) { sans.push(f); continue; }
    const g = out.find((x) => x.categorie.toLowerCase() === c.toLowerCase());
    if (g) g.formations.push(f);
    else out.push({ categorie: c, formations: [f] });
  }
  if (sans.length > 0) out.push({ categorie: AUTRES_FORMATIONS, formations: sans });
  return out;
}

export function lienFormations(liste: readonly Formation[] | undefined, label: string): { href: string; label: string } | undefined {
  return formationsCompletes(liste).length >= FORMATIONS_MIN ? { href: '/formations', label } : undefined;
}
