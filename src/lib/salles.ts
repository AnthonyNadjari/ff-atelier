/**
 * Les salles d'un lieu de réception et leurs capacités (site.salles) : architecture `salles-capacites`
 * (src/lib/architectures.ts ; sources Domaine de la Touche, Orne : « la Grande Salle, 140 m², 150 personnes assises ou
 * 250 en cocktail », la Petite Salle, la Grange, la cour, le préau, 53 couchages, une page par occasion ; Domaine de la
 * Chanterelle, Lille : deux lieux, la demande de devis toujours dans la barre ; docs/veille/architectures/salles-capacites.md).
 * Le client d'un lieu de réception arrive avec un nombre d'invités : le site part de là.
 *
 *   - CONFIGURATIONS    : les façons de dresser une salle, dans l'ordre d'affichage (assis, cocktail, théâtre, classe, en U) ;
 *   - sallesCompletes() : salles avec slug, nom et au moins une capacité (mesure `salles`), slugs uniques ;
 *   - configurationsDe(): les configurations qu'au moins une salle donne (les colonnes du tableau) ;
 *   - capaciteMax()     : la plus grande capacité d'une salle, toutes configurations ;
 *   - phraseCapacites() : « 150 assis, 250 en cocktail » ;
 *   - sallesPour()      : les salles qui reçoivent n personnes dans une configuration (calculé DANS LE NAVIGATEUR) ;
 *   - phraseReponse()   : « 2 salles pour 120 personnes assises », « Aucune salle pour 400 personnes en cocktail » ;
 *   - lienSalles()      : entrée de nav vers /salles, dès 2 salles complètes.
 *
 * Module pur, sans import. Testé par tests/architectures-reception.test.mjs via scripts/ff/ts-loader.mjs (loadSallesModule).
 */

export const CONFIGURATIONS = [
  { cle: 'assis', titre: 'Assis', phrase: 'assis', pour: 'assises' },
  { cle: 'cocktail', titre: 'Cocktail', phrase: 'en cocktail', pour: 'en cocktail' },
  { cle: 'theatre', titre: 'Théâtre', phrase: 'en théâtre', pour: 'en théâtre' },
  { cle: 'classe', titre: 'Classe', phrase: 'en classe', pour: 'en classe' },
  { cle: 'u', titre: 'En U', phrase: 'en U', pour: 'en U' },
] as const;
export type Configuration = (typeof CONFIGURATIONS)[number]['cle'];

export interface Salle {
  slug: string;
  nom: string;
  capacites?: Partial<Record<Configuration, number>>;
}

export interface Salles<S extends Salle = Salle> {
  liste?: readonly S[];
}

const capa = (s: Salle, c: Configuration) => {
  const n = s.capacites?.[c];
  return typeof n === 'number' && Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
};

export function sallesCompletes<S extends Salle>(x: Salles<S> | undefined): S[] {
  const vus = new Set<string>();
  return (x?.liste ?? []).filter((s) => {
    const slug = (s.slug ?? '').trim();
    if (!slug || !(s.nom ?? '').trim() || vus.has(slug)) return false;
    if (!CONFIGURATIONS.some((c) => capa(s, c.cle) > 0)) return false;
    vus.add(slug);
    return true;
  });
}

export function configurationsDe(x: Salles | undefined): (typeof CONFIGURATIONS)[number][] {
  const ok = sallesCompletes(x);
  return CONFIGURATIONS.filter((c) => ok.some((s) => capa(s, c.cle) > 0));
}

export function capaciteMax(s: Salle): number {
  return Math.max(0, ...CONFIGURATIONS.map((c) => capa(s, c.cle)));
}

export function capacite(s: Salle, c: Configuration): number {
  return capa(s, c);
}

const nombre = (n: number) => n.toLocaleString('fr-FR').replace(/\s/g, ' ');

export function phraseCapacites(s: Salle): string {
  return CONFIGURATIONS.filter((c) => capa(s, c.cle) > 0)
    .map((c) => `${nombre(capa(s, c.cle))} ${c.phrase}`)
    .join(', ');
}

export function sallesPour<S extends Salle>(n: number, c: Configuration, x: Salles<S> | undefined): S[] {
  if (!Number.isFinite(n) || n <= 0) return [];
  return sallesCompletes(x).filter((s) => capa(s, c) >= n);
}

export function phraseReponse(n: number, c: Configuration, x: Salles | undefined): string {
  const conf = CONFIGURATIONS.find((k) => k.cle === c);
  const k = sallesPour(n, c, x).length;
  const pour = `pour ${nombre(n)} personne${n > 1 ? 's' : ''} ${conf?.pour ?? ''}`.trim();
  if (k === 0) return `Aucune salle ${pour}.`;
  return `${k} salle${k > 1 ? 's' : ''} ${pour}.`;
}

export function lienSalles(x: Salles | undefined, label: string): { href: string; label: string } | undefined {
  return sallesCompletes(x).length >= 2 ? { href: '/salles', label } : undefined;
}
