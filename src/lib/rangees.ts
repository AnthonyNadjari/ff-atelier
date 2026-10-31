/**
 * Rangées du style `rangees` (relevé sur officecommun.com le 31 oct 2026, fiche docs/veille/styles/rangees.md) : l'accueil
 * est un index de chantiers, une RANGÉE par réalisation (ou par prestation), chacune une piste de photos à hauteur
 * constante et de largeurs variées. Module pur (seul un `import type`), lu par Services/rangees, Hero/rangees et
 * About/rangees, testé par tests/style-rangees.test.mjs.
 *
 *   - rangeesDuSite() : une rangée par réalisation (site.realisations : titre, lieu sinon type, ses photos, sa page
 *     /realisations/<slug>) ; sans réalisation, une rangée par prestation (titre, phrase courte, sa photo puis les photos de
 *     proof.gallery dont le type la nomme, sa page /services/<slug>) ; sans l'un ni l'autre, une rangée par type de
 *     proof.gallery (sans page). Une rangée sans photo garde sa ligne (le nom mène à la page), sans piste.
 *   - gabaritsDeRangee() : la largeur de chaque vignette, comme la source : deux gabarits qui s'emboîtent (la grande
 *     16:9 vaut deux carrées 8:9 et l'écart), plus une étroite 5:8 pour casser l'alignement ; le motif change d'une rangée
 *     à l'autre ; une photo debout n'est jamais posée en grande, une photo très large jamais en étroite.
 *   - prestationsCitees() : les prestations du client, citées en liens dans la phrase du premier écran (la source cite
 *     ses projets dans sa phrase d'ouverture) ; la phrase est construite sans « et » final orphelin.
 * Rien n'est inventé : chaque vignette est une photo du client, chaque rangée une de ses réalisations ou prestations.
 */
import type { Site } from './schema';

type Photo = { src: string; alt: string };
export type Gabarit = 'grande' | 'carree' | 'etroite';
export type Rangee = {
  cle: string;
  titre: string;
  /** En gris après le titre : le lieu du chantier (sinon son type), ou la phrase courte de la prestation. */
  detail?: string;
  href?: string;
  photos: Photo[];
};

/** Rapport largeur / hauteur de chaque gabarit (la hauteur de la rangée est fixe). */
export const RAPPORTS: Record<Gabarit, number> = { grande: 16 / 9, carree: 8 / 9, etroite: 5 / 8 };

/** Trois motifs, tirés de la source (Karda : grande, carrée, carrée, grande… ; Premune : grande, carrée, grande…). */
export const MOTIFS: readonly (readonly Gabarit[])[] = [
  ['grande', 'carree', 'carree', 'grande', 'carree', 'etroite'],
  ['carree', 'grande', 'etroite', 'carree', 'grande', 'carree'],
  ['grande', 'etroite', 'carree', 'grande', 'carree', 'carree'],
];

type Entree = Pick<Site, 'realisations' | 'services'> & { proof: Pick<Site['proof'], 'gallery'> };

const normal = (t: string) =>
  t.replace(/œ/g, 'oe').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/<[^>]*>/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
const texteSeul = (html: string) => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

/** Le type d'une photo de galerie nomme-t-il cette prestation ? (« Cuisine » ↔ « Cuisines en chêne », slug « cuisines ») */
export function photoDeLaPrestation(kind: string | undefined, prestation: { slug: string; title: string }): boolean {
  if (!kind) return false;
  const k = normal(kind).replace(/s\b/g, '');
  if (!k) return false;
  const t = normal(texteSeul(prestation.title)).replace(/s\b/g, '');
  const s = prestation.slug.replace(/-/g, ' ').replace(/s\b/g, '');
  return t.split(' ').includes(k) || s.split(' ').includes(k) || t === k || s === k;
}

export function rangeesDuSite(s: Entree): Rangee[] {
  const realisations = s.realisations ?? [];
  if (realisations.length > 0) {
    return realisations.map((r) => ({
      cle: `r-${r.slug}`,
      titre: r.title,
      detail: r.place ?? r.kind,
      href: `/realisations/${r.slug}`,
      photos: r.photos.map((p) => ({ src: p.src, alt: p.alt })),
    }));
  }
  const galerie = s.proof?.gallery ?? [];
  const services = s.services ?? [];
  if (services.length > 0) {
    return services.map((x) => {
      const photos: Photo[] = [];
      const vues = new Set<string>();
      const ajouter = (p?: Photo) => {
        if (p && !vues.has(p.src)) {
          vues.add(p.src);
          photos.push({ src: p.src, alt: p.alt });
        }
      };
      ajouter(x.image);
      for (const g of galerie) if (photoDeLaPrestation(g.kind, x)) ajouter(g);
      return { cle: `s-${x.slug}`, titre: texteSeul(x.title), detail: x.short ? texteSeul(x.short) : undefined, href: `/services/${x.slug}`, photos };
    });
  }
  const parType = new Map<string, Rangee>();
  for (const g of galerie) {
    const titre = g.kind?.trim() || 'Réalisations';
    let r = parType.get(titre);
    if (!r) {
      r = { cle: `g-${normal(titre).replace(/ /g, '-') || 'galerie'}`, titre, photos: [] };
      parType.set(titre, r);
    }
    r.photos.push({ src: g.src, alt: g.alt });
  }
  return [...parType.values()];
}

/**
 * Gabarit de chaque vignette d'une rangée. `rapports[i]` : rapport largeur / hauteur réel de la photo (manifeste de
 * `ff images`), inconnu = undefined. Une photo debout (rapport < 0,85) n'est jamais grande ; une photo très large
 * (rapport > 1,9) n'est jamais étroite.
 */
export function gabaritsDeRangee(rapports: readonly (number | undefined)[], indexRangee: number): Gabarit[] {
  const motif = MOTIFS[((indexRangee % MOTIFS.length) + MOTIFS.length) % MOTIFS.length];
  return rapports.map((r, i) => {
    let g = motif[i % motif.length];
    if (r !== undefined && r < 0.85 && g === 'grande') g = 'etroite';
    if (r !== undefined && r > 1.9 && g === 'etroite') g = 'grande';
    return g;
  });
}

export type Citation = { texte: string; href: string; sep: string };

/** Les prestations citées dans la phrase : « A, B et C » (sep = ce qui suit chaque nom). */
export function prestationsCitees(services: readonly { slug: string; title: string }[], n = 5): Citation[] {
  const liste = services.slice(0, n);
  return liste.map((x, i) => ({
    texte: texteSeul(x.title),
    href: `/services/${x.slug}`,
    sep: i === liste.length - 1 ? '' : i === liste.length - 2 ? ' et ' : ', ',
  }));
}
