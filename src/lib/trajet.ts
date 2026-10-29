/**
 * Les temps de trajet d'un artisan qui se déplace (site.trajet) : architecture `rayon-trajet` (src/lib/architectures.ts ;
 * sources Colson Elec, électricien à Bellevigny : « Je ne suis jamais loin », l'atelier au centre et les communes autour avec
 * leurs kilomètres et leurs minutes, « Votre commune n'est pas citée ? Appelez quand même » ; Concept Froid Centre, frigoriste
 * à Suèvres : « Temps de trajet depuis notre base de Suèvres, en conditions normales », huit pôles de Blois ~25 min à Bourges
 * ~1 h 30, une page par pôle ; docs/veille/architectures/rayon-trajet.md). Le client se demande « est-ce qu'il vient jusque
 * chez moi, et en combien de temps ? » : l'accueil est le territoire vu de l'atelier.
 *
 *   - communesCompletes() : communes avec slug, nom et des minutes > 0, slugs uniques, de la plus proche à la plus loin
 *                           (mesure `trajet`) ;
 *   - dureeLisible()      : 25 → « 25 min », 60 → « 1 h », 90 → « 1 h 30 » ;
 *   - anneaux()           : les cercles du schéma (15, 30, 45, 60, 90, 120 min…), jusqu'au premier qui contient la plus loin ;
 *   - placer()            : la position de chaque commune sur le schéma, SEULEMENT si le client donne sa direction depuis la
 *                           base (nord, nord-est…) ; sans direction, la commune est dans le tableau, pas sur le dessin (on
 *                           ne place jamais une commune au hasard) ; plusieurs communes dans la même direction s'écartent ;
 *   - chercher()          : la commune tapée par le visiteur (sans accent ni casse, « st » = « saint »), sinon undefined ;
 *   - voisinesDe()        : les communes à un temps proche (± 10 min), pour la page d'une commune ;
 *   - lienTrajet()        : entrée de nav (/trajet dès 3 communes).
 *
 * Module pur, sans import. Testé par tests/architectures-carnet.test.mjs via scripts/ff/ts-loader.mjs (loadTrajetModule).
 */

export const DIRECTIONS_TRAJET = ['nord', 'nord-est', 'est', 'sud-est', 'sud', 'sud-ouest', 'ouest', 'nord-ouest'] as const;
export type DirectionTrajet = (typeof DIRECTIONS_TRAJET)[number];

export interface CommuneTrajet {
  slug: string;
  nom: string;
  minutes: number;
  km?: number;
  direction?: DirectionTrajet;
}

export const TRAJET_MIN = 3;

const net = (t: string | undefined) => (t ?? '').trim();

export function communesCompletes<C extends CommuneTrajet>(liste: readonly C[] | undefined): C[] {
  const vus = new Set<string>();
  const out = (liste ?? []).filter((c) => {
    const slug = net(c.slug);
    if (!slug || !net(c.nom) || !(typeof c.minutes === 'number' && c.minutes > 0) || vus.has(slug)) return false;
    vus.add(slug);
    return true;
  });
  return out.map((c, i) => ({ c, i })).sort((a, b) => a.c.minutes - b.c.minutes || a.i - b.i).map((e) => e.c);
}

export function dureeLisible(minutes: number): string {
  const m = Math.round(minutes);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r === 0 ? `${h} h` : `${h} h ${String(r).padStart(2, '0')}`;
}

const PAS = [15, 30, 45, 60, 90, 120, 150, 180, 240];

/** Les cercles du schéma : ceux de PAS jusqu'au premier qui contient la commune la plus loin (au moins deux). */
export function anneaux(communes: readonly CommuneTrajet[]): number[] {
  const max = Math.max(0, ...communes.map((c) => c.minutes));
  const out: number[] = [];
  for (const p of PAS) {
    out.push(p);
    if (p >= max && out.length >= 2) break;
  }
  return out;
}

/**
 * Rayon d'un temps sur le schéma (côté 100, bord à 46) : racine carrée du rapport au dernier cercle, pour que les communes
 * proches ne s'entassent pas autour de la base (le schéma le dit : « pas à l'échelle »).
 */
export function rayonSchema(minutes: number, bord: number): number {
  return Math.sqrt(Math.min(minutes, bord) / bord) * 46;
}

/**
 * Positions sur un schéma carré de côté 100 (la base au centre, 50/50) : rayon croissant avec les minutes (rayonSchema, le dernier
 * anneau touche le bord, à 46), angle donné par la direction (nord en haut). Les communes d'une même direction s'écartent de 22°
 * de part et d'autre, dans l'ordre des minutes. Une commune sans direction n'est pas placée.
 */
export function placer<C extends CommuneTrajet>(liste: readonly C[] | undefined): { commune: C; x: number; y: number; angle: number; cote: 'droite' | 'gauche' }[] {
  const t = communesCompletes(liste);
  const bord = anneaux(t).at(-1) ?? 60;
  const parDir = new Map<string, C[]>();
  for (const c of t) {
    if (!c.direction || !DIRECTIONS_TRAJET.includes(c.direction)) continue;
    parDir.set(c.direction, [...(parDir.get(c.direction) ?? []), c]);
  }
  const out: { commune: C; x: number; y: number; angle: number }[] = [];
  for (const [dir, cs] of parDir) {
    const base = DIRECTIONS_TRAJET.indexOf(dir as DirectionTrajet) * 45;
    cs.forEach((c, i) => {
      const ecart = (i - (cs.length - 1) / 2) * 22;
      const angle = base + ecart;
      const r = rayonSchema(c.minutes, bord);
      const rad = (angle * Math.PI) / 180;
      out.push({ commune: c, angle, x: Math.round((50 + r * Math.sin(rad)) * 10) / 10, y: Math.round((50 - r * Math.cos(rad)) * 10) / 10 });
    });
  }
  out.sort((a, b) => a.commune.minutes - b.commune.minutes);
  // Côté de l'étiquette (nom + temps) : à droite du point si le point est à droite de la base, à gauche sinon ; si elle
  // chevauche une étiquette déjà posée (ou le nom de la base), l'autre côté. Boîtes estimées en unités du schéma (un signe
  // ≈ 1,5, une ligne de 16 signes au plus ; deux lignes ≈ 6), pour un schéma d'environ 40rem.
  const boites: { x0: number; x1: number; y0: number; y1: number }[] = [{ x0: 43, x1: 57, y0: 50, y1: 56 }];
  const touche = (b: { x0: number; x1: number; y0: number; y1: number }) => boites.some((o) => b.x0 < o.x1 && b.x1 > o.x0 && b.y0 < o.y1 && b.y1 > o.y0);
  // Du plus loin au plus près : les étiquettes du bord sont posées d'abord, celles du centre trouvent la place qui reste.
  const cotes = new Map<string, 'droite' | 'gauche'>();
  for (const p of [...out].reverse()) {
    const l = Math.max(Math.min(p.commune.nom.length, 16), 6) * 1.5 + 2;
    const boite = (cote: 'droite' | 'gauche') => (cote === 'droite' ? { x0: p.x + 1, x1: p.x + 1 + l, y0: p.y - 3, y1: p.y + 3 } : { x0: p.x - 1 - l, x1: p.x - 1, y0: p.y - 3, y1: p.y + 3 });
    const prefere: 'droite' | 'gauche' = p.x >= 50 ? 'droite' : 'gauche';
    const autre = prefere === 'droite' ? 'gauche' : 'droite';
    const cote = touche(boite(prefere)) && !touche(boite(autre)) ? autre : prefere;
    boites.push(boite(cote));
    cotes.set(p.commune.slug, cote);
  }
  return out.map((p) => ({ ...p, cote: cotes.get(p.commune.slug) ?? 'droite' }));
}

/** Clé de recherche : minuscules, sans accent, « st » / « ste » = « saint » / « sainte », tirets et apostrophes en espaces. */
export function cleCommune(t: string): string {
  return net(t)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’\-]+/g, ' ')
    .replace(/\bste\b/g, 'sainte')
    .replace(/\bst\b/g, 'saint')
    .replace(/\s+/g, ' ')
    .trim();
}

/** La commune que le visiteur a tapée : nom exact d'abord, sinon début de nom s'il n'y en a qu'une. */
export function chercher<C extends CommuneTrajet>(liste: readonly C[] | undefined, saisie: string): C | undefined {
  const k = cleCommune(saisie);
  if (k.length < 2) return undefined;
  const t = communesCompletes(liste);
  const exacte = t.find((c) => cleCommune(c.nom) === k);
  if (exacte) return exacte;
  const debut = t.filter((c) => cleCommune(c.nom).startsWith(k));
  return debut.length === 1 ? debut[0] : undefined;
}

export function voisinesDe<C extends CommuneTrajet>(liste: readonly C[] | undefined, slug: string, ecart = 10): C[] {
  const t = communesCompletes(liste);
  const c = t.find((x) => x.slug === slug);
  if (!c) return [];
  return t.filter((x) => x.slug !== slug && Math.abs(x.minutes - c.minutes) <= ecart);
}

export function lienTrajet(liste: readonly CommuneTrajet[] | undefined, label: string): { href: string; label: string } | undefined {
  return communesCompletes(liste).length >= TRAJET_MIN ? { href: '/trajet', label } : undefined;
}
