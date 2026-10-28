/**
 * Les profils de patients d'un cabinet (site.profils) : architecture `profils-patients` (src/lib/architectures.ts ;
 * sources Ostéopathes à Lyon Préfecture : sous le h1, « Je suis à la recherche d'un ostéopathe pour : femme enceinte,
 * maman allaitante, nourrisson, enfant, adulte et sénior, sportif », une page par profil avec ses motifs et ses
 * questions, les deux praticiens et leur spécialité, l'accès en bus, tram, métro, vélo, le tarif et la prise en charge ;
 * Margot Debayle, ostéopathe à Annecy : « Mes domaines » (séniors, adultes, adolescents, femmes enceintes et nourrissons,
 * sportifs), le tableau prestation, durée, tarif, remboursement ; docs/veille/architectures/profils-patients.md).
 * Le patient se demande d'abord « est-ce pour moi, pour mon bébé ? » : le site part de là.
 *
 *   - profilsComplets()   : profils avec slug, nom et au moins un motif (mesure `profils`), slugs uniques ;
 *   - praticiensComplets(): praticiens avec slug et nom, slugs uniques ;
 *   - praticiensDe()      : les praticiens qui suivent ce profil (profil.praticiens = leurs slugs), dans l'ordre du cabinet ;
 *   - resumeProfil()      : « 45 min, 60 € » (durée et prix du profil, sinon ceux du cabinet ; rien n'est deviné) ;
 *   - lienProfils()       : entrée de nav vers /consulter, dès 2 profils complets.
 *
 * Module pur, sans import. Testé par tests/architectures-producteurs.test.mjs via scripts/ff/ts-loader.mjs
 * (loadProfilsModule).
 */

export interface Profil {
  slug: string;
  nom: string;
  motifs?: readonly string[];
  duree?: string;
  prix?: string;
  praticiens?: readonly string[];
}

export interface Praticien {
  slug: string;
  nom: string;
}

export interface Profils<P extends Profil = Profil, Q extends Praticien = Praticien> {
  liste?: readonly P[];
  praticiens?: readonly Q[];
  duree?: string;
  prix?: string;
}

const net = (t: string | undefined) => (t ?? '').trim();

export function profilsComplets<P extends Profil>(x: Profils<P, Praticien> | undefined): P[] {
  const vus = new Set<string>();
  return (x?.liste ?? []).filter((p) => {
    const slug = net(p.slug);
    if (!slug || !net(p.nom) || vus.has(slug)) return false;
    if (!(p.motifs ?? []).some((m) => net(m))) return false;
    vus.add(slug);
    return true;
  });
}

export function praticiensComplets<Q extends Praticien>(x: Profils<Profil, Q> | undefined): Q[] {
  const vus = new Set<string>();
  return (x?.praticiens ?? []).filter((p) => {
    const slug = net(p.slug);
    if (!slug || !net(p.nom) || vus.has(slug)) return false;
    vus.add(slug);
    return true;
  });
}

export function praticiensDe<Q extends Praticien>(p: Profil, x: Profils<Profil, Q> | undefined): Q[] {
  const voulus = new Set((p.praticiens ?? []).map(net));
  return praticiensComplets(x).filter((q) => voulus.has(q.slug));
}

export function resumeProfil(p: Profil, x?: Pick<Profils, 'duree' | 'prix'>): string {
  return [net(p.duree) || net(x?.duree), net(p.prix) || net(x?.prix)].filter(Boolean).join(', ');
}

export function lienProfils(x: Profils | undefined, label: string): { href: string; label: string } | undefined {
  return profilsComplets(x).length >= 2 ? { href: '/consulter', label } : undefined;
}
