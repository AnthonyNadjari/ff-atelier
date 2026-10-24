/**
 * Tournée de la semaine (site.tournee) : architecture `tournee-semaine` (src/lib/architectures.ts ; sources Pizza P'tit
 * Louis et Le Camion à Pizzas, docs/veille/architectures/tournee-semaine.md). Le client se déplace : la question n° 1
 * est « où êtes-vous ce soir ». L'unité du site est l'ÉTAPE (un jour, une commune, un repère, des heures, un véhicule,
 * un numéro). La semaine entière est rendue au build ; le NAVIGATEUR garde en tête l'étape du moment (fuseau
 * Europe/Paris, src/components/EtapeDuJour.astro). Sans script, toute la semaine se lit.
 *
 *   - slugCommune()     : « Fontaines-lès-Dijon » → « fontaines-les-dijon » (route /tournee/<commune>) ;
 *   - etapesParJour()   : les 7 jours (lundi → dimanche) et leurs étapes, triées par heure d'arrivée quand elle est
 *                         donnée ; les étapes aux jours illisibles à part (listées telles quelles) ;
 *   - communesDe()      : une entrée par commune (ordre de la tournée), ses étapes et ses jours ;
 *   - telDeLEtape()     : { href, affiche, propre } du véhicule, sinon le numéro principal (jamais deviné) ;
 *   - etapeDuMoment()   : le jour à montrer en tête (aujourd'hui tant qu'une étape n'est pas finie, sinon le
 *                         prochain jour qui a une étape) et son décalage (0 = aujourd'hui, 1 = demain…) ;
 *   - libelleDuMoment() : « Aujourd’hui », « Demain », « Samedi » ;
 *   - lienTournee()     : { href: '/tournee', label } dès une étape, sinon null ;
 *   - etapesCompletes() : étapes avec jour, commune et heures (mesure `etapes` de donneesManquantes).
 *
 * La lecture des jours est celle de contact.hours (`joursDe` de src/lib/horaires.ts), passée en paramètre (`lire`)
 * pour que ce module reste pur (scripts/ff/ts-loader.mjs, loadTourneeModule ; tests/architectures-jour.test.mjs).
 */

export interface Etape {
  jour: string;
  moment?: string;
  commune: string;
  repere?: string;
  hours: string;
  opens?: string;
  closes?: string;
  vehicule?: string;
  phone?: string;
  phoneDisplay?: string;
  mapsUrl?: string;
  coordinates?: { lat: number; lng: number };
}
export type LireJours = (jours: string) => number[] | undefined;

export const JOURS_TOURNEE = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] as const;

export function slugCommune(commune: string): string {
  return commune
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const minutesDe = (hhmm?: string) => {
  if (!hhmm) return undefined;
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export interface JourTournee<T extends Etape = Etape> {
  index: number;
  jour: (typeof JOURS_TOURNEE)[number];
  etapes: T[];
}

export function etapesParJour<T extends Etape>(tournee: readonly T[], lire: LireJours): { jours: JourTournee<T>[]; illisibles: T[] } {
  const jours: JourTournee<T>[] = JOURS_TOURNEE.map((jour, index) => ({ index, jour, etapes: [] }));
  const illisibles: T[] = [];
  for (const e of tournee) {
    const js = lire(e.jour);
    if (!js || js.length === 0) { illisibles.push(e); continue; }
    for (const j of js) jours[j].etapes.push(e);
  }
  for (const d of jours) {
    // Tri stable : par heure d'arrivée quand les deux la donnent, sinon l'ordre du client.
    d.etapes = d.etapes
      .map((e, i) => ({ e, i }))
      .sort((a, b) => {
        const ma = minutesDe(a.e.opens), mb = minutesDe(b.e.opens);
        return ma !== undefined && mb !== undefined && ma !== mb ? ma - mb : a.i - b.i;
      })
      .map((x) => x.e);
  }
  return { jours, illisibles };
}

export function communesDe<T extends Etape>(tournee: readonly T[], lire: LireJours): { commune: string; slug: string; etapes: T[]; jours: number[] }[] {
  const out: { commune: string; slug: string; etapes: T[]; jours: number[] }[] = [];
  for (const e of tournee) {
    const slug = slugCommune(e.commune);
    if (!slug) continue;
    let c = out.find((x) => x.slug === slug);
    if (!c) { c = { commune: e.commune.trim(), slug, etapes: [], jours: [] }; out.push(c); }
    c.etapes.push(e);
    for (const j of lire(e.jour) ?? []) if (!c.jours.includes(j)) c.jours.push(j);
  }
  for (const c of out) c.jours.sort((a, b) => a - b);
  return out;
}

export function telDeLEtape(e: Pick<Etape, 'phone' | 'phoneDisplay'>, contact: { phone: string; phoneDisplay: string }): { href: string; affiche: string; propre: boolean } {
  if (e.phone) return { href: `tel:${e.phone}`, affiche: e.phoneDisplay ?? e.phone, propre: true };
  return { href: `tel:${contact.phone}`, affiche: contact.phoneDisplay, propre: false };
}

/**
 * Jour à montrer en tête. `jours` : les 7 jours (seuls `etapes[].closes` sont lus) ; `jour` : 0 = lundi ;
 * `minutes` : minutes écoulées depuis minuit. Aujourd'hui tant qu'une étape du jour n'est pas finie (une étape sans
 * heure de départ compte toute la journée) ; sinon le prochain jour qui a une étape, dans les 7 jours. undefined si
 * la tournée est vide.
 */
export function etapeDuMoment(jours: readonly { etapes: readonly Pick<Etape, 'closes'>[] }[], jour: number, minutes: number): { index: number; decalage: number } | undefined {
  for (let d = 0; d < 7; d++) {
    const index = (jour + d) % 7;
    const etapes = jours[index]?.etapes ?? [];
    if (etapes.length === 0) continue;
    if (d === 0 && !etapes.some((e) => { const c = minutesDe(e.closes); return c === undefined || c > minutes; })) continue;
    return { index, decalage: d };
  }
  // Toutes les étapes de la semaine sont aujourd'hui et finies : la semaine prochaine, même jour.
  return (jours[jour]?.etapes ?? []).length > 0 ? { index: jour, decalage: 7 } : undefined;
}

export function libelleDuMoment(decalage: number, index: number): string {
  if (decalage === 0) return 'Aujourd’hui';
  if (decalage === 1) return 'Demain';
  return JOURS_TOURNEE[index];
}

export function lienTournee(tournee: readonly unknown[], label: string): { href: string; label: string } | null {
  return tournee.length > 0 ? { href: '/tournee', label } : null;
}

export function etapesCompletes(tournee: readonly { jour?: string; commune?: string; hours?: string }[]): number {
  return tournee.filter((e) => (e.jour ?? '').trim() && (e.commune ?? '').trim() && (e.hours ?? '').trim()).length;
}
