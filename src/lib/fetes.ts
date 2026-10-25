/**
 * Calendrier des fêtes (site.fetes, site.livraison) : architecture `calendrier-fetes` (src/lib/architectures.ts ;
 * source Touchard Fleurs, Sarthe, docs/veille/architectures/calendrier-fetes.md). Le commerce vit au rythme des fêtes
 * (Toussaint, Noël, Saint-Valentin, fête des mères) : la question n° 1 est « qu'est-ce que vous préparez pour
 * dimanche, et jusqu'à quand je peux commander ? ». Toutes les fêtes à venir sont rendues au build ; le NAVIGATEUR
 * garde en tête celle du moment (fuseau Europe/Paris, src/components/FeteDuMoment.astro). Sans script, toutes se lisent.
 *
 *   - fetesAVenir()        : fêtes dont la fin n'est pas passée, triées par début ;
 *   - feteDuMoment()       : la fête en cours (début <= aujourd'hui <= fin), sinon la prochaine, avec son index dans
 *                            la liste donnée et le nombre de jours avant son début ;
 *   - etatCommande()       : « ouverte » jusqu'à la date limite comprise, « close » après ; undefined sans date limite ;
 *   - joursEntre()         : jours calendaires de a à b (AAAA-MM-JJ) ;
 *   - dateFete() / periodeFete() : « 1er novembre », « du 25 octobre au 1er novembre », « le 1er novembre » ;
 *   - formatHeure()        : « 13:00 » → « 13 h », « 08:30 » → « 8 h 30 » ;
 *   - livraisonDuMoment()  : avant l'heure limite du client « aujourdhui », après « suivant » ; undefined sans heure ;
 *   - libelleDuMoment()    : « En ce moment », « Demain », « Dans 12 jours » ;
 *   - lienFetes()          : { href: '/fetes', label } dès une fête à venir, sinon null ;
 *   - fetesCompletes()     : fêtes avec des dates valides et au moins une ligne (mesure `fetes` de donneesManquantes).
 *
 * Module pur, sans import : la date du jour est passée en paramètre (isoDuJour de src/lib/agenda.ts au build et dans
 * le navigateur). Testé par tests/architectures-maison.test.mjs via scripts/ff/ts-loader.mjs (loadFetesModule).
 */

export interface Fete {
  slug: string;
  nom: string;
  du: string;
  au: string;
  commanderAvant?: string;
  lignes?: unknown[];
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export function fetesAVenir<T extends Pick<Fete, 'du' | 'au'>>(fetes: readonly T[], aujourdhui: string): T[] {
  return fetes
    .filter((f) => ISO.test(f.au) && f.au >= aujourdhui)
    .map((f, i) => ({ f, i }))
    .sort((a, b) => (a.f.du === b.f.du ? a.i - b.i : a.f.du < b.f.du ? -1 : 1))
    .map((x) => x.f);
}

export function joursEntre(a: string, b: string): number {
  const t = (iso: string) => Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)));
  return Math.round((t(b) - t(a)) / 86_400_000);
}

export function feteDuMoment(fetes: readonly Pick<Fete, 'du' | 'au'>[], aujourdhui: string): { index: number; enCours: boolean; joursAvant: number } | undefined {
  const enCours = fetes.findIndex((f) => f.du <= aujourdhui && aujourdhui <= f.au);
  if (enCours !== -1) return { index: enCours, enCours: true, joursAvant: 0 };
  let best = -1;
  fetes.forEach((f, i) => {
    if (f.du > aujourdhui && (best === -1 || f.du < fetes[best].du)) best = i;
  });
  return best === -1 ? undefined : { index: best, enCours: false, joursAvant: joursEntre(aujourdhui, fetes[best].du) };
}

export function etatCommande(f: Pick<Fete, 'commanderAvant'>, aujourdhui: string): 'ouverte' | 'close' | undefined {
  if (!f.commanderAvant) return undefined;
  return aujourdhui <= f.commanderAvant ? 'ouverte' : 'close';
}

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

export function dateFete(iso: string): string {
  const j = Number(iso.slice(8, 10));
  return `${j === 1 ? '1er' : j} ${MOIS[Number(iso.slice(5, 7)) - 1]}`;
}

export function periodeFete(du: string, au: string): string {
  return du === au ? `le ${dateFete(au)}` : `du ${dateFete(du)} au ${dateFete(au)}`;
}

export function formatHeure(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  return m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`;
}

export function livraisonDuMoment(heureLimite: string | undefined, minutes: number): 'aujourdhui' | 'suivant' | undefined {
  if (!heureLimite) return undefined;
  const [h, m] = heureLimite.split(':').map(Number);
  return minutes < h * 60 + m ? 'aujourdhui' : 'suivant';
}

export function libelleDuMoment(m: { enCours: boolean; joursAvant: number }): string {
  if (m.enCours) return 'En ce moment';
  if (m.joursAvant === 1) return 'Demain';
  return `Dans ${m.joursAvant} jours`;
}

export function lienFetes(fetes: readonly Pick<Fete, 'du' | 'au'>[], label: string, aujourdhui: string): { href: string; label: string } | null {
  return fetesAVenir(fetes, aujourdhui).length > 0 ? { href: '/fetes', label } : null;
}

export function fetesCompletes(fetes: readonly Partial<Fete>[]): number {
  return fetes.filter((f) => ISO.test(f.du ?? '') && ISO.test(f.au ?? '') && (f.du ?? '') <= (f.au ?? '') && (f.lignes ?? []).length > 0).length;
}
