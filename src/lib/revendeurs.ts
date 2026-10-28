/**
 * Les revendeurs d'un producteur, rangés par secteur (site.revendeurs) : architecture `revendeurs-secteurs`
 * (src/lib/architectures.ts ; sources Brasserie des Garrigues, Sommières : « Trouvez la boutique la plus proche de chez
 * vous », Gard / Hérault puis autres départements, chaque point de vente avec son genre (caviste, bar, épicerie bio),
 * la vente sur place et la visite, la location de tireuse ; Brasserie Bendorf, Strasbourg : « Où rapporter les
 * bouteilles ? », les revendeurs de Strasbourg et de l'Eurométropole puis hors de l'Eurométropole, les growlers remplis
 * à la brasserie ; docs/veille/architectures/revendeurs-secteurs.md). Le client d'un brasseur, d'un vigneron, d'un
 * producteur vendu en boutiques demande d'abord : « où en trouver près de chez moi ? » ; le site part de là.
 *
 *   - revendeursComplets() : revendeurs avec nom, commune et secteur (mesure `revendeurs`), sans doublon nom + commune ;
 *   - slugSecteur()        : « Strasbourg et Eurométropole » → « strasbourg-et-eurometropole » ;
 *   - secteursDe()         : les secteurs dans l'ordre du client, chacun avec ses communes de A à Z et ses revendeurs ;
 *   - typesDe()            : les genres de revendeurs (caviste, bar…), sans doublon de casse, dans l'ordre d'apparition ;
 *   - phraseSecteur()      : « 12 adresses dans 7 communes » ;
 *   - pourType()           : les revendeurs d'un genre (filtre posé DANS LE NAVIGATEUR ; vide = tous) ;
 *   - lienRevendeurs()     : entrée de nav vers /ou-trouver, dès 6 revendeurs complets.
 *
 * Module pur, sans import. Testé par tests/architectures-producteurs.test.mjs via scripts/ff/ts-loader.mjs
 * (loadRevendeursModule).
 */

export interface Revendeur {
  nom: string;
  commune: string;
  secteur: string;
  type?: string;
}

export interface Revendeurs<R extends Revendeur = Revendeur> {
  liste?: readonly R[];
}

export interface Commune<R extends Revendeur = Revendeur> {
  nom: string;
  revendeurs: R[];
}

export interface Secteur<R extends Revendeur = Revendeur> {
  slug: string;
  nom: string;
  revendeurs: R[];
  communes: Commune<R>[];
}

/** Seuil de la nav et de la page /ou-trouver (et de la mesure `revendeurs` du registre). */
export const REVENDEURS_MIN = 6;

const net = (t: string | undefined) => (t ?? '').trim().replace(/\s+/g, ' ');
const cle = (t: string | undefined) => net(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function slugSecteur(nom: string): string {
  return cle(nom)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function revendeursComplets<R extends Revendeur>(x: Revendeurs<R> | undefined): R[] {
  const vus = new Set<string>();
  return (x?.liste ?? []).filter((r) => {
    if (!net(r.nom) || !net(r.commune) || !slugSecteur(r.secteur ?? '')) return false;
    const k = `${cle(r.nom)}|${cle(r.commune)}`;
    if (vus.has(k)) return false;
    vus.add(k);
    return true;
  });
}

export function secteursDe<R extends Revendeur>(x: Revendeurs<R> | undefined): Secteur<R>[] {
  const out: Secteur<R>[] = [];
  for (const r of revendeursComplets(x)) {
    const slug = slugSecteur(r.secteur);
    let s = out.find((y) => y.slug === slug);
    if (!s) {
      s = { slug, nom: net(r.secteur), revendeurs: [], communes: [] };
      out.push(s);
    }
    s.revendeurs.push(r);
    let c = s.communes.find((y) => cle(y.nom) === cle(r.commune));
    if (!c) {
      c = { nom: net(r.commune), revendeurs: [] };
      s.communes.push(c);
    }
    c.revendeurs.push(r);
  }
  for (const s of out) s.communes.sort((a, b) => cle(a.nom).localeCompare(cle(b.nom), 'fr'));
  return out;
}

export function typesDe(x: Revendeurs | undefined): string[] {
  const out: string[] = [];
  for (const r of revendeursComplets(x)) {
    const t = net(r.type);
    if (t && !out.some((y) => cle(y) === cle(t))) out.push(t);
  }
  return out;
}

export function phraseSecteur(s: Pick<Secteur, 'revendeurs' | 'communes'>): string {
  const n = s.revendeurs.length;
  const c = s.communes.length;
  return `${n} adresse${n > 1 ? 's' : ''} dans ${c} commune${c > 1 ? 's' : ''}`;
}

export function pourType<R extends Revendeur>(liste: readonly R[], type: string): R[] {
  if (!net(type)) return [...liste];
  return liste.filter((r) => cle(r.type) === cle(type));
}

export function lienRevendeurs(x: Revendeurs | undefined, label: string): { href: string; label: string } | undefined {
  return revendeursComplets(x).length >= REVENDEURS_MIN ? { href: '/ou-trouver', label } : undefined;
}
