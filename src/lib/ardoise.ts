/**
 * Ardoise du jour (services[].programme, services[].tousLesJours, site.ardoise) : architecture `ardoise-du-jour`
 * (src/lib/architectures.ts ; source The Cheese Board Collective, docs/veille/architectures/ardoise-du-jour.md).
 * L'offre tourne selon le jour de la semaine (le pain du mardi, la pizza du jour) ; l'accueil montre celle
 * d'aujourd'hui. Un site statique n'est pas reconstruit chaque matin : la semaine entière est rendue au build et le
 * NAVIGATEUR garde visible le jour courant (fuseau Europe/Paris, src/components/ArdoiseDuJour.astro). Sans script, en
 * capture ou pour un moteur, toute la semaine se lit : jamais un « aujourd'hui » deviné au build.
 *
 *   - programmeDeLaSemaine() : les 7 jours (lundi → dimanche), pour chacun les activités qui ont une entrée ce jour-là
 *                              et leurs lignes ; les entrées aux jours illisibles à part (affichées telles quelles) ;
 *   - avecProgramme()        : les activités qui ont un programme ;
 *   - joursCouverts()        : nombre de jours de la semaine couverts par au moins une entrée ;
 *   - entreesDistinctes()    : entrées de programme aux jours distincts (mesure `programme` de donneesManquantes) ;
 *   - exceptionsAVenir()     : exceptions datées d'aujourd'hui et à venir, triées (les passées tombent au build) ;
 *   - dateLongue()           : « vendredi 23 octobre » (AAAA-MM-JJ, sans fuseau : la date du client) ;
 *   - lienProgramme()        : { href: '/programme', label } dès qu'une activité a un programme, sinon null.
 *
 * La lecture des jours (« Mardi », « Du mardi au vendredi ») est celle de contact.hours : `joursDe` de
 * src/lib/horaires.ts, passé en paramètre (`lire`) pour que ce module reste pur et chargeable seul
 * (scripts/ff/ts-loader.mjs, loadArdoiseModule ; tests/architectures-jour.test.mjs).
 */

export interface LigneArdoise {
  nom: string;
  detail?: string;
  prix?: string;
}
export interface EntreeProgramme {
  jours: string;
  lignes: LigneArdoise[];
  note?: string;
}
export interface ServiceProgramme {
  slug: string;
  title: string;
  programme?: EntreeProgramme[];
  tousLesJours?: LigneArdoise[];
}
export interface ExceptionArdoise {
  date: string;
  service?: string;
  titre?: string;
  lignes?: LigneArdoise[];
  texte?: string;
  ferme?: boolean;
}
export type LireJours = (jours: string) => number[] | undefined;

export const JOURS_ARDOISE = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] as const;
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

export interface ActiviteDuJour {
  slug: string;
  title: string;
  lignes: LigneArdoise[];
  notes: string[];
}
export interface JourProgramme {
  /** 0 = lundi … 6 = dimanche. */
  index: number;
  jour: (typeof JOURS_ARDOISE)[number];
  activites: ActiviteDuJour[];
}

export function avecProgramme<T extends ServiceProgramme>(services: readonly T[]): T[] {
  return services.filter((s) => (s.programme ?? []).length > 0);
}

export function programmeDeLaSemaine(
  services: readonly ServiceProgramme[],
  lire: LireJours,
): { jours: JourProgramme[]; illisibles: { slug: string; title: string; entree: EntreeProgramme }[] } {
  const jours: JourProgramme[] = JOURS_ARDOISE.map((jour, index) => ({ index, jour, activites: [] }));
  const illisibles: { slug: string; title: string; entree: EntreeProgramme }[] = [];
  for (const s of services) {
    for (const e of s.programme ?? []) {
      const js = lire(e.jours);
      if (!js || js.length === 0) {
        illisibles.push({ slug: s.slug, title: s.title, entree: e });
        continue;
      }
      for (const j of js) {
        const d = jours[j];
        let a = d.activites.find((x) => x.slug === s.slug);
        if (!a) {
          a = { slug: s.slug, title: s.title, lignes: [], notes: [] };
          d.activites.push(a);
        }
        for (const l of e.lignes) if (!a.lignes.some((x) => x.nom === l.nom)) a.lignes.push(l);
        if (e.note && !a.notes.includes(e.note)) a.notes.push(e.note);
      }
    }
  }
  return { jours, illisibles };
}

export function joursCouverts(services: readonly ServiceProgramme[], lire: LireJours): number {
  return programmeDeLaSemaine(services, lire).jours.filter((j) => j.activites.length > 0).length;
}

/** Entrées de programme (avec au moins une ligne) aux libellés de jours distincts, toutes activités confondues. */
export function entreesDistinctes(services: readonly { programme?: { jours?: string; lignes?: unknown[] }[] }[]): number {
  const vus = new Set<string>();
  for (const s of services) for (const e of s.programme ?? []) {
    const k = (e.jours ?? '').trim().toLowerCase();
    if (k && (e.lignes ?? []).length > 0) vus.add(k);
  }
  return vus.size;
}

export function exceptionsAVenir<T extends Pick<ExceptionArdoise, 'date'>>(ardoise: readonly T[], aujourdhui: string): T[] {
  return ardoise.filter((x) => x.date >= aujourdhui).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

export function dateLongue(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  // Jour de la semaine calculé en UTC sur la date du client (aucun décalage de fuseau possible).
  const jour = JOURS_ARDOISE[(new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7].toLowerCase();
  return `${jour} ${d === 1 ? '1er' : d} ${MOIS[m - 1]}`;
}

export function lienProgramme(services: readonly ServiceProgramme[], label: string): { href: string; label: string } | null {
  return avecProgramme(services).length > 0 ? { href: '/programme', label } : null;
}
