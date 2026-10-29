/**
 * Les honoraires d'un cabinet d'avocat (site.honoraires) et les forfaits de ses domaines (services[].lignes) :
 * architecture `honoraires-domaines` (src/lib/architectures.ts ; sources Cabinet Marilyne Faltot, Forbach : la barre
 * Présentation, Nos activités (huit domaines), Honoraires, Actualités, FAQ, Contact, « Prendre RDV » à part ; la page
 * Honoraires : taux horaire, travail au forfait, convention d'honoraires signée pour chaque dossier, honoraire de résultat
 * jamais seul, première consultation à prix et durée annoncés, rendez-vous découverte gratuit de 15 min par téléphone,
 * protection juridique, aide juridictionnelle, médiateur de la consommation ; Judisis, Pontoise : « Domaines de
 * compétence » dépliés en procédures, « Honoraires » et « Consultation en ligne » dans la barre, les trois façons de fixer
 * l'honoraire puis un « à partir de » par procédure de divorce ; docs/veille/architectures/honoraires-domaines.md).
 * Le client d'un avocat se demande « combien ça va me coûter, et comment ça commence ? » : le site part de là.
 *
 *   - premiersPas()      : le premier échange en temps (découverte, consultation), seulement ceux qui disent un prix ou
 *                          une durée ;
 *   - modesComplets()    : façons de fixer l'honoraire qui ont un nom ;
 *   - domainesAPrix()    : domaines (services) qui ont au moins une procédure à prix (lignes[].prix) ;
 *   - resumePas()        : « 40 min, 255 € TTC » (rien n'est deviné) ;
 *   - honorairesLisibles(): le cabinet dit au moins un prix (premier échange ou mode) — mesure `honoraires` ;
 *   - lienHonoraires()   : entrée de nav vers /nos-honoraires (la route /honoraires est celle des agences immobilières).
 *
 * Module pur, sans import. Testé par tests/architectures-garde.test.mjs via scripts/ff/ts-loader.mjs
 * (loadHonorairesModule).
 */

export interface Pas {
  titre?: string;
  duree?: string;
  prix?: string;
  texte?: string;
}

export interface Mode {
  nom: string;
  prix?: string;
  texte?: string;
}

export interface Honoraires {
  decouverte?: Pas;
  consultation?: Pas;
  modes?: readonly Mode[];
}

export interface Domaine {
  slug: string;
  title: string;
  lignes?: readonly { nom: string; prix?: string; detail?: string }[];
}

const net = (t: string | undefined) => (t ?? '').trim();

/** Le premier échange : la découverte puis la consultation, chacune seulement si elle dit un prix ou une durée. */
export function premiersPas(h: Honoraires | undefined): (Pas & { cle: 'decouverte' | 'consultation'; titre: string })[] {
  const out: (Pas & { cle: 'decouverte' | 'consultation'; titre: string })[] = [];
  const d = h?.decouverte;
  if (d && (net(d.prix) || net(d.duree))) out.push({ ...d, cle: 'decouverte', titre: net(d.titre) || 'Premier appel' });
  const c = h?.consultation;
  if (c && (net(c.prix) || net(c.duree))) out.push({ ...c, cle: 'consultation', titre: net(c.titre) || 'Première consultation' });
  return out;
}

export function modesComplets<M extends Mode>(h: { modes?: readonly M[] } | undefined): M[] {
  return (h?.modes ?? []).filter((m) => net(m.nom));
}

export function domainesAPrix<D extends Domaine>(services: readonly D[]): D[] {
  return services.filter((s) => (s.lignes ?? []).some((l) => net(l.nom) && net(l.prix)));
}

export function resumePas(p: Pas): string {
  return [net(p.duree), net(p.prix)].filter(Boolean).join(', ');
}

export function honorairesLisibles(h: Honoraires | undefined): boolean {
  if (!h) return false;
  return premiersPas(h).some((p) => net(p.prix)) || modesComplets(h).some((m) => net(m.prix));
}

export function lienHonoraires(h: Honoraires | undefined, label: string): { href: string; label: string } | undefined {
  return honorairesLisibles(h) || modesComplets(h).length >= 2 ? { href: '/nos-honoraires', label } : undefined;
}
