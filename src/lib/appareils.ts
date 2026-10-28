/**
 * Les appareils qu'un réparateur remet en marche et leurs pannes (site.appareils) : architecture `appareils-pannes`
 * (src/lib/architectures.ts ; sources Satisfix et Lavoiserie, réparateurs d'électroménager à Lyon : les appareils rangés
 * par famille, lavage, cuisson, froid, un forfait par famille, une page par appareil qui liste les pannes prises en charge
 * et les marques ; docs/veille/architectures/appareils-pannes.md). Le visiteur ne cherche pas « un réparateur » : il a
 * un lave-linge qui ne vidange plus. Le site part de l'appareil, puis de la panne.
 *
 *   - appareilsComplets() : les appareils qui ont un slug, un nom et au moins une panne nommée (mesure `appareils`),
 *                           slugs uniques ;
 *   - famillesDe()        : les appareils rangés par famille, dans l'ordre des familles du client puis de première
 *                           apparition ; les appareils sans famille à part, en dernier (« Autres appareils ») ;
 *   - prixDe()            : le prix de l'appareil s'il en a un, sinon celui de sa famille, sinon rien (jamais deviné) ;
 *   - marquesDe()         : les marques propres à l'appareil, sinon la liste commune ;
 *   - slugPanne()         : « Ne vidange plus » → « ne-vidange-plus » (ancre de la page de l'appareil) ;
 *   - marquesParLettre()  : les marques groupées par initiale (sans accent), triées à la française ;
 *   - lienAppareils()     : entrée de nav vers /appareils, dès 2 appareils complets.
 *
 * Module pur, sans import. Testé par tests/architectures-pannes.test.mjs via scripts/ff/ts-loader.mjs
 * (loadAppareilsModule).
 */

export interface Panne {
  nom: string;
  causes?: string;
}

export interface Appareil {
  slug: string;
  nom: string;
  famille?: string;
  prix?: string;
  pannes?: readonly Panne[];
  marques?: readonly string[];
}

export interface Famille {
  nom: string;
  prix?: string;
  note?: string;
}

export interface Appareils<A extends Appareil = Appareil> {
  liste?: readonly A[];
  familles?: readonly Famille[];
  marques?: readonly string[];
}

export const SANS_FAMILLE = 'Autres appareils';

const pannesNommees = (a: Appareil) => (a.pannes ?? []).filter((p) => (p.nom ?? '').trim());

export function appareilsComplets<A extends Appareil>(x: Appareils<A> | undefined): A[] {
  const vus = new Set<string>();
  return (x?.liste ?? []).filter((a) => {
    const slug = (a.slug ?? '').trim();
    if (!slug || !(a.nom ?? '').trim() || pannesNommees(a).length === 0 || vus.has(slug)) return false;
    vus.add(slug);
    return true;
  });
}

export function slugPanne(nom: string): string {
  return nom
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface GroupeFamille<A extends Appareil = Appareil> {
  nom: string;
  cle: string;
  prix?: string;
  note?: string;
  appareils: A[];
}

export function famillesDe<A extends Appareil>(x: Appareils<A> | undefined): GroupeFamille<A>[] {
  const complets = appareilsComplets(x);
  const declarees = (x?.familles ?? []).filter((f) => (f.nom ?? '').trim());
  const ordre: string[] = declarees.map((f) => f.nom.trim());
  for (const a of complets) {
    const f = (a.famille ?? '').trim();
    if (f && !ordre.includes(f)) ordre.push(f);
  }
  const groupes: GroupeFamille<A>[] = ordre.map((nom) => {
    const d = declarees.find((f) => f.nom.trim() === nom);
    return { nom, cle: slugPanne(nom), prix: d?.prix?.trim() || undefined, note: d?.note?.trim() || undefined, appareils: complets.filter((a) => (a.famille ?? '').trim() === nom) };
  });
  const sans = complets.filter((a) => !(a.famille ?? '').trim());
  if (sans.length > 0) groupes.push({ nom: SANS_FAMILLE, cle: 'autres', appareils: sans });
  return groupes.filter((g) => g.appareils.length > 0);
}

export function prixDe(a: Appareil, x: Appareils | undefined): string | undefined {
  const propre = (a.prix ?? '').trim();
  if (propre) return propre;
  const f = (a.famille ?? '').trim();
  if (!f) return undefined;
  return (x?.familles ?? []).find((g) => (g.nom ?? '').trim() === f)?.prix?.trim() || undefined;
}

export function marquesDe(a: Appareil, x: Appareils | undefined): string[] {
  const propres = (a.marques ?? []).map((m) => m.trim()).filter(Boolean);
  return propres.length > 0 ? propres : (x?.marques ?? []).map((m) => m.trim()).filter(Boolean);
}

const initiale = (m: string) => m.normalize('NFD').replace(/[̀-ͯ]/g, '').charAt(0).toUpperCase();

export function marquesParLettre(marques: readonly string[]): { lettre: string; marques: string[] }[] {
  const uniques = [...new Set(marques.map((m) => m.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
  const out: { lettre: string; marques: string[] }[] = [];
  for (const m of uniques) {
    const l = /[A-Z]/.test(initiale(m)) ? initiale(m) : '0-9';
    const g = out.find((x) => x.lettre === l);
    if (g) g.marques.push(m);
    else out.push({ lettre: l, marques: [m] });
  }
  return out;
}

/** Toutes les marques du site : la liste commune puis celles des appareils, sans doublon. */
export function toutesLesMarques(x: Appareils | undefined): string[] {
  const out: string[] = [];
  for (const m of [...(x?.marques ?? []), ...appareilsComplets(x).flatMap((a) => a.marques ?? [])]) {
    const t = m.trim();
    if (t && !out.some((y) => y.localeCompare(t, 'fr', { sensitivity: 'base' }) === 0)) out.push(t);
  }
  return out;
}

export function lienAppareils(x: Appareils | undefined, label: string): { href: string; label: string } | undefined {
  return appareilsComplets(x).length >= 2 ? { href: '/appareils', label } : undefined;
}
