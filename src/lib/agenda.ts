/**
 * Agenda du client (site.agenda) : architecture `cartes-empilees-agenda` (src/lib/architectures.ts ; source De Groene
 * Afslag, docs/veille/architectures/groene-afslag.md). Le site vit de ses rendez-vous datés : bloc « prochains
 * rendez-vous » de l'accueil (src/components/ProchainsRendezVous.astro), page /agenda filtrable par catégorie
 * (src/pages/agenda/[...index].astro), lien de nav (navLinks).
 *
 *   - isoDuJour()      : la date du jour AAAA-MM-JJ à Paris (au build).
 *   - agendaAVenir()   : rendez-vous du jour et à venir, du plus proche au plus lointain, sans muter l'entrée ;
 *                        une date passée disparaît au build suivant (rien n'est jamais affiché « passé »).
 *   - dateAgenda()     : { jour: '7', mois: 'nov.', long: 'samedi 7 novembre 2026' } pour la carte datée.
 *   - categoriesAgenda : catégories distinctes, dans l'ordre d'apparition (filtres dès deux).
 *   - lienAgenda()     : l'entrée de nav { href: '/agenda', label } ou null sans rendez-vous à venir.
 *
 * Module pur (seul un `import type`) : re-exporté par src/lib/site.ts, testé par tests/architectures.test.mjs via
 * scripts/ff/ts-loader.mjs (loadAgendaModule).
 */
import type { Site } from './schema';

type RendezVous = Pick<Site['agenda'][number], 'date'> & { categorie?: string };

const MOIS_COURTS = ['janv.', 'févr.', 'mars', 'avril', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

/** Date du jour AAAA-MM-JJ dans le fuseau du client (Europe/Paris par défaut). */
export function isoDuJour(date: Date = new Date(), timeZone = 'Europe/Paris'): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

export function agendaAVenir<T extends RendezVous>(agenda: readonly T[], aujourdhui: string = isoDuJour()): T[] {
  return agenda.filter((r) => r.date >= aujourdhui).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

export function dateAgenda(iso: string): { jour: string; mois: string; long: string } {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return { jour: iso, mois: '', long: iso };
  const [a, mo, j] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const js = new Date(Date.UTC(a, mo - 1, j)).getUTCDay();
  // Espaces insécables : la date ne se coupe pas en fin de ligne (ff typo).
  return { jour: String(j), mois: MOIS_COURTS[mo - 1], long: `${JOURS[js]} ${j === 1 ? '1er' : j} ${MOIS[mo - 1]} ${a}` };
}

export function categoriesAgenda(agenda: readonly RendezVous[]): string[] {
  const out: string[] = [];
  for (const r of agenda) {
    const c = (r.categorie ?? '').trim();
    if (c && !out.includes(c)) out.push(c);
  }
  return out;
}

export function lienAgenda(agenda: readonly RendezVous[], label: string, aujourdhui: string = isoDuJour()): { href: string; label: string } | null {
  return agendaAVenir(agenda, aujourdhui).length > 0 ? { href: '/agenda', label } : null;
}
