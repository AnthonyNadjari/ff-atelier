/**
 * Les formules à prix nommées (site.formules) : architecture `formules-comparees` (src/lib/architectures.ts ; source
 * Micka photographe, Le Mans : quatre forfaits côte à côte, nom, prix et prix en semaine, ce qu'ils couvrent, « Chaque
 * forfait inclut mon déplacement » au-dessus, « Vérifiez la disponibilité » sous chacun ; seconde source GreenCraft,
 * modèle de paysagiste : « Everything in Essential » puis ce qui s'ajoute ; docs/veille/architectures/formules-comparees.md).
 * Le visiteur compare quelques forfaits et en choisit un : le site est ce choix.
 *
 *   - formulesCompletes() : les formules qui ont un slug, un nom et un prix (mesure `formules`), slugs uniques ;
 *   - reprise()           : la formule qu'une autre reprend (« Tout ce que comprend Essentielle, plus : »), si elle existe
 *                           et n'est pas elle-même ;
 *   - lignesComparees()   : les lignes du tableau de /formules : chaque élément compris dans au moins une formule (reprises
 *                           dépliées), dans l'ordre d'apparition, avec pour chaque formule vrai / faux ;
 *   - lienFormules()      : entrée de nav vers /formules, dès 2 formules complètes ;
 *   - formuleDe()         : le slug lu dans ?formule= s'il existe (la porte d'une formule).
 *
 * Module pur, sans import. Testé par tests/architectures-devis.test.mjs via scripts/ff/ts-loader.mjs (loadFormulesModule).
 */

export interface Formule {
  slug: string;
  nom: string;
  prix: string;
  inclus?: readonly string[];
  reprend?: string;
}

export interface Formules<F extends Formule = Formule> {
  liste?: readonly F[];
}

export function formulesCompletes<F extends Formule>(f: Formules<F> | undefined): F[] {
  const vus = new Set<string>();
  return (f?.liste ?? []).filter((x) => {
    const slug = (x.slug ?? '').trim();
    if (!slug || !(x.nom ?? '').trim() || !(x.prix ?? '').trim() || vus.has(slug)) return false;
    vus.add(slug);
    return true;
  });
}

export function reprise<F extends Formule>(x: F, toutes: readonly F[]): F | undefined {
  if (!x.reprend || x.reprend === x.slug) return undefined;
  return toutes.find((y) => y.slug === x.reprend);
}

/** Tout ce que comprend une formule, reprises dépliées (sans boucle), sans doublon. */
export function inclusDeplies<F extends Formule>(x: F, toutes: readonly F[]): string[] {
  const out: string[] = [];
  const vus = new Set<string>();
  let cur: F | undefined = x;
  while (cur && !vus.has(cur.slug)) {
    vus.add(cur.slug);
    for (const i of cur.inclus ?? []) if (i.trim() && !out.includes(i.trim())) out.push(i.trim());
    cur = reprise(cur, toutes);
  }
  return out;
}

export function lignesComparees<F extends Formule>(toutes: readonly F[]): { element: string; dans: boolean[] }[] {
  const deplies = toutes.map((x) => inclusDeplies(x, toutes));
  const elements: string[] = [];
  for (const d of deplies) for (const e of d) if (!elements.includes(e)) elements.push(e);
  return elements.map((element) => ({ element, dans: deplies.map((d) => d.includes(element)) }));
}

export function lienFormules(f: Formules | undefined, label: string): { href: string; label: string } | undefined {
  return formulesCompletes(f).length >= 2 ? { href: '/formules', label } : undefined;
}

export function formuleDe(recherche: string, slugs: readonly string[]): string | undefined {
  const m = /[?&]formule=([a-z0-9-]+)/.exec(recherche ?? '');
  return m && slugs.includes(m[1]) ? m[1] : undefined;
}
