/**
 * Le parcours du client (site.parcours) : architecture `parcours-atelier` (src/lib/architectures.ts ; source Turning
 * Earth, ateliers de céramique à Londres, docs/veille/architectures/parcours-atelier.md). Le site est une ÉCHELLE : on
 * essaie, on apprend, puis on pratique librement à l'atelier ; chaque barreau a ses formules, ce qui est compris ou non,
 * son déroulé, ses dates, et mène au suivant (« From course to studio member »).
 *
 *   - barreauxComplets() : barreaux qui ont au moins une formule (mesure `parcours` de donneesManquantes) ;
 *   - voisins()          : le barreau précédent et le suivant d'un slug, dans l'ordre du client ;
 *   - prixDepuis()       : « dès 45 € » quand au moins un prix des formules se lit en euros, sinon undefined (rien
 *                          n'est calculé d'autre qu'un minimum des prix donnés) ;
 *   - liensParcours()    : une entrée de nav par barreau (/parcours/<slug>, titre), au plus quatre ; aucun barreau = [] ;
 *   - avisDuBarreau()    : les avis rattachés à un barreau (proof.testimonials[].barreau), dans l'ordre du client ;
 *   - avisGeneraux()     : les autres (sans barreau, ou d'un barreau qui n'existe pas).
 *
 * Module pur, sans import. Testé par tests/architectures-sejour.test.mjs via scripts/ff/ts-loader.mjs
 * (loadParcoursModule).
 */

export interface Barreau {
  slug: string;
  niveau: string;
  titre: string;
  formules?: { nom: string; prix?: string }[];
}

export function barreauxComplets(parcours: readonly Partial<Barreau>[]): number {
  return parcours.filter((b) => (b.formules ?? []).length > 0).length;
}

export function voisins<T extends Pick<Barreau, 'slug'>>(parcours: readonly T[], slug: string): { precedent?: T; suivant?: T } {
  const i = parcours.findIndex((b) => b.slug === slug);
  if (i === -1) return {};
  return { precedent: i > 0 ? parcours[i - 1] : undefined, suivant: i < parcours.length - 1 ? parcours[i + 1] : undefined };
}

const EUROS = /^\s*(?:dès\s+|à partir de\s+)?(\d[\d\s  ]*(?:[.,]\d{1,2})?)\s*(?:€|euros?)\s*(?:\/.*|par .*)?$/i;

export function prixDepuis(formules: readonly { prix?: string }[]): string | undefined {
  let min: number | undefined;
  let texte = '';
  for (const f of formules) {
    const m = f.prix ? EUROS.exec(f.prix) : null;
    if (!m) continue;
    const v = Number(m[1].replace(/[\s  ]/g, '').replace(',', '.'));
    if (Number.isFinite(v) && (min === undefined || v < min)) { min = v; texte = m[1].trim(); }
  }
  return min === undefined ? undefined : `dès ${texte} €`;
}

export function liensParcours(parcours: readonly Pick<Barreau, 'slug' | 'titre'>[], max = 4): { href: string; label: string }[] {
  return parcours.slice(0, max).map((b) => ({ href: `/parcours/${b.slug}`, label: b.titre }));
}

export function avisDuBarreau<T extends { barreau?: string }>(avis: readonly T[], slug: string): T[] {
  return avis.filter((a) => a.barreau === slug);
}

export function avisGeneraux<T extends { barreau?: string }>(avis: readonly T[], parcours: readonly Pick<Barreau, 'slug'>[]): T[] {
  const slugs = new Set(parcours.map((b) => b.slug));
  return avis.filter((a) => !a.barreau || !slugs.has(a.barreau));
}
