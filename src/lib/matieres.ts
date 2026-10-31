/**
 * Le nuancier des matières d'un artisan (site.matieres) : architecture `nuancier-matieres` (src/lib/architectures.ts ;
 * sources Menuiserie et ébénisterie Pipault, Yonne : « Essence bois » dans la barre, dix essences avec leur photo, aubier,
 * grain, densité, dureté, durabilité et usages ; Boud'bOis, bois massif local : « 19 essences disponibles », chaque essence
 * avec sa fiche, son usage et son prix moyen ; docs/veille/architectures/nuancier-matieres.md). Le client se demande « en
 * quoi ? » avant « combien ? » : l'accueil est le nuancier de l'atelier.
 *
 *   - matieresCompletes() : matières avec slug et nom, slugs uniques, dans l'ordre du client (la page existe même sans photo) ;
 *   - nuancier()          : celles qui ont une photo (la pastille EST la photo de la matière : sans photo, pas de pastille ;
 *                           mesure `matieres`) ;
 *   - surEchelle()        : celles qui ont une valeur sur l'échelle du client (dureté, densité…), de la plus basse à la plus
 *                           haute, avec leur part de la plus haute (pour la barre) ; une matière sans valeur n'est jamais
 *                           placée au hasard ;
 *   - parUsage()          : l'index « pour quel usage ? » : chaque usage (dans l'ordre de première apparition, sans doublon
 *                           de casse ni d'accent) et ses matières ;
 *   - colonnes()          : les caractéristiques nommées par au moins deux matières (le tableau comparatif), dans l'ordre ;
 *   - voisinesSurEchelle(): les matières juste en dessous et au-dessus sur l'échelle ;
 *   - lienMatieres()      : entrée de nav (/matieres dès 3 matières).
 *
 * Module pur, sans import. Testé par tests/architectures-recoltes.test.mjs via scripts/ff/ts-loader.mjs (loadMatieresModule).
 */

export const MATIERES_MIN = 3;

export interface MatiereNuancier {
  slug: string;
  nom: string;
  photo?: unknown;
  valeur?: number;
  usages?: string[];
  caracteristiques?: { nom: string; valeur: string }[];
}

const net = (t: string | undefined) => (t ?? '').trim();
const cle = (t: string) => net(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function matieresCompletes<M extends MatiereNuancier>(liste: readonly M[] | undefined): M[] {
  const vus = new Set<string>();
  return (liste ?? []).filter((m) => {
    const slug = net(m.slug);
    if (!slug || !net(m.nom) || vus.has(slug)) return false;
    vus.add(slug);
    return true;
  });
}

export function nuancier<M extends MatiereNuancier>(liste: readonly M[] | undefined): M[] {
  return matieresCompletes(liste).filter((m) => Boolean(m.photo));
}

export function surEchelle<M extends MatiereNuancier>(liste: readonly M[] | undefined): { matiere: M; part: number }[] {
  const avec = matieresCompletes(liste)
    .map((m, i) => ({ m, i }))
    .filter((e) => typeof e.m.valeur === 'number' && Number.isFinite(e.m.valeur) && e.m.valeur > 0)
    .sort((a, b) => a.m.valeur! - b.m.valeur! || a.i - b.i);
  const max = Math.max(...avec.map((e) => e.m.valeur!), 0);
  return avec.map((e) => ({ matiere: e.m, part: max > 0 ? Math.round((e.m.valeur! / max) * 1000) / 10 : 0 }));
}

export function parUsage<M extends MatiereNuancier>(liste: readonly M[] | undefined): { usage: string; matieres: M[] }[] {
  const out: { usage: string; cle: string; matieres: M[] }[] = [];
  for (const m of matieresCompletes(liste)) {
    for (const u of m.usages ?? []) {
      const k = cle(u);
      if (!k) continue;
      let g = out.find((x) => x.cle === k);
      if (!g) out.push((g = { usage: net(u), cle: k, matieres: [] }));
      if (!g.matieres.includes(m)) g.matieres.push(m);
    }
  }
  return out.map(({ usage, matieres }) => ({ usage, matieres }));
}

export function colonnes(liste: readonly MatiereNuancier[] | undefined, max = 6): string[] {
  const compte = new Map<string, { nom: string; n: number }>();
  for (const m of matieresCompletes(liste)) {
    const vus = new Set<string>();
    for (const c of m.caracteristiques ?? []) {
      const k = cle(c.nom);
      if (!k || !net(c.valeur) || vus.has(k)) continue;
      vus.add(k);
      const e = compte.get(k) ?? { nom: net(c.nom), n: 0 };
      e.n += 1;
      compte.set(k, e);
    }
  }
  return [...compte.values()].filter((e) => e.n >= 2).slice(0, max).map((e) => e.nom);
}

/** La valeur d'une caractéristique nommée `nom` (sans casse ni accent), ou ''. */
export function valeurDe(m: MatiereNuancier, nom: string): string {
  return net((m.caracteristiques ?? []).find((c) => cle(c.nom) === cle(nom))?.valeur);
}

export function voisinesSurEchelle<M extends MatiereNuancier>(liste: readonly M[] | undefined, slug: string): { dessous?: M; dessus?: M } {
  const e = surEchelle(liste);
  const i = e.findIndex((x) => x.matiere.slug === slug);
  if (i === -1) return {};
  return { dessous: e[i - 1]?.matiere, dessus: e[i + 1]?.matiere };
}

export function lienMatieres(liste: readonly MatiereNuancier[] | undefined, label: string): { href: string; label: string } | undefined {
  return matieresCompletes(liste).length >= MATIERES_MIN ? { href: '/matieres', label } : undefined;
}
