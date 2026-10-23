/**
 * Saisons et sorties du client (services[].saison, site.sorties) : architecture `saisons-sorties`
 * (src/lib/architectures.ts ; source Bureau des guides de La Grave, docs/veille/architectures/saisons-sorties.md). Le
 * temps range le site : la nav n'a qu'une entrée par saison, l'accueil range les activités par saison
 * (src/sections/Services/saisons.astro) et met en avant les sorties de la saison, chaque sortie datée et cotée a sa page
 * (/sorties/<slug>), la page d'une activité liste ses sorties filtrables par niveau, une page par public (/pour/<public>).
 *
 *   - slugTexte()          : « Été » → « ete », « Scolaires et centres » → « scolaires-et-centres » ;
 *   - saisonsDe()          : saisons distinctes des services, dans l'ordre du site ;
 *   - groupesParSaison()   : [{ saison, slug, services }] dès deux saisons, plus « Toute l'année » pour les activités
 *                            sans saison (seulement s'il y en a) ; sinon [] (rien ne change) ;
 *   - saisonsCompletes()   : saisons qui ont au moins `min` activités (mesure `saisons` de donneesManquantes) ;
 *   - sortiesDuService()   : sorties rattachées à une activité, dans l'ordre du site ;
 *   - niveauxDe()          : niveaux distincts (filtre dès deux) ;
 *   - sortiesEnAvant()     : sorties `enAvant` (« à la une cette saison »), au plus n ;
 *   - publicsDe()          : publics qui ont au moins `min` sorties → une page /pour/<slug> chacun ;
 *   - liensSaisons()       : entrées de nav, une par saison, vers l'ancre de l'accueil (/#saison-<slug>).
 *
 * Module pur (seul un `import type`) : re-exporté par src/lib/site.ts, testé par tests/architectures.test.mjs via
 * scripts/ff/ts-loader.mjs (loadSortiesModule).
 */
import type { Site } from './schema';

type Service = Pick<Site['services'][number], 'slug'> & { saison?: string };
type Sortie = Pick<Site['sorties'][number], 'slug'> & { service?: string; niveau?: string; enAvant?: boolean; public?: string[] };

/** Libellé du groupe des activités sans saison, quand les autres en ont une. */
export const TOUTE_L_ANNEE = 'Toute l’année';

export function slugTexte(t: string): string {
  return t
    .replace(/œ/g, 'oe').replace(/Œ/g, 'Oe').replace(/æ/g, 'ae').replace(/Æ/g, 'Ae')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function saisonsDe(services: readonly Service[]): string[] {
  const out: string[] = [];
  for (const s of services) {
    const v = (s.saison ?? '').trim();
    if (v && !out.includes(v)) out.push(v);
  }
  return out;
}

export function groupesParSaison<T extends Service>(services: readonly T[]): { saison: string; slug: string; services: T[] }[] {
  const saisons = saisonsDe(services);
  if (saisons.length < 2) return [];
  const groupes = saisons.map((saison) => ({ saison, slug: slugTexte(saison), services: services.filter((s) => (s.saison ?? '').trim() === saison) }));
  const sans = services.filter((s) => !(s.saison ?? '').trim());
  if (sans.length > 0) groupes.push({ saison: TOUTE_L_ANNEE, slug: 'toute-l-annee', services: sans });
  return groupes;
}

export function saisonsCompletes(services: readonly Service[], min = 2): number {
  return saisonsDe(services).filter((saison) => services.filter((s) => (s.saison ?? '').trim() === saison).length >= min).length;
}

export function sortiesDuService<T extends Sortie>(sorties: readonly T[], slug: string): T[] {
  return sorties.filter((x) => x.service === slug);
}

export function niveauxDe(sorties: readonly Sortie[]): string[] {
  const out: string[] = [];
  for (const x of sorties) {
    const n = (x.niveau ?? '').trim();
    if (n && !out.includes(n)) out.push(n);
  }
  return out;
}

export function sortiesEnAvant<T extends Sortie>(sorties: readonly T[], n = 3): T[] {
  return sorties.filter((x) => x.enAvant).slice(0, n);
}

export function publicsDe(sorties: readonly Sortie[], min = 3): { public: string; slug: string; n: number }[] {
  const compte = new Map<string, number>();
  for (const x of sorties) for (const p of x.public ?? []) {
    const v = p.trim();
    if (v) compte.set(v, (compte.get(v) ?? 0) + 1);
  }
  return [...compte.entries()].filter(([, n]) => n >= min).map(([p, n]) => ({ public: p, slug: slugTexte(p), n }));
}

export function liensSaisons(services: readonly Service[]): { href: string; label: string }[] {
  return groupesParSaison(services).filter((g) => g.saison !== TOUTE_L_ANNEE).map((g) => ({ href: `/#saison-${g.slug}`, label: g.saison }));
}
