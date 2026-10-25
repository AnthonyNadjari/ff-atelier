/**
 * Artistes du salon (site.artistes) : architecture `artistes-residents` (src/lib/architectures.ts ; source Mystery
 * Tattoo Club, Paris 10e, docs/veille/architectures/artistes-residents.md). Le client n'est pas une personne mais une
 * maison de plusieurs artistes : la question n° 1 est « avec qui ? », et la réponse passe par le style. L'unité du
 * site est l'ARTISTE (un portrait, des styles, des travaux, son propre e-mail, son Instagram, son lien de rendez-vous).
 *
 *   - slugStyle()          : « Néo-trad » → « neo-trad » (valeur du filtre par style) ;
 *   - stylesDe()           : les styles distincts (casse et espaces ignorés), dans l'ordre d'apparition, avec le
 *                            nombre d'artistes de chacun ;
 *   - artistesDuStyle()    : les artistes qui pratiquent un style (par son slug) ;
 *   - autresArtistes()     : tous sauf celui de la page ;
 *   - contactsDeLArtiste() : ses portes, dans l'ordre rendez-vous, e-mail, Instagram ; l'e-mail retombe sur celui du
 *                            commerce (marqué `propre: false`), rien d'autre n'est deviné ;
 *   - residentsEtInvites() : les résidents (sans période) puis les invités (avec période) ;
 *   - lienArtistes()       : { href: '/artistes', label } dès un artiste, sinon null ;
 *   - artistesComplets()   : artistes avec une photo (portrait ou travaux) ET au moins un style (mesure `artistes`
 *                            de donneesManquantes) ;
 *   - enumerer()           : « A, B et C ».
 *
 * Module pur, sans import (scripts/ff/ts-loader.mjs, loadArtistesModule ; tests/architectures-maison.test.mjs).
 */

export interface Artiste {
  slug: string;
  nom: string;
  role?: string;
  depuis?: number;
  styles?: string[];
  texte?: string;
  photo?: unknown;
  photos?: unknown[];
  jours?: string;
  periode?: string;
  email?: string;
  instagram?: string;
  rdvUrl?: string;
}

export function slugStyle(style: string): string {
  return style
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function stylesDe(artistes: readonly Pick<Artiste, 'styles'>[]): { nom: string; slug: string; n: number }[] {
  const out: { nom: string; slug: string; n: number }[] = [];
  for (const a of artistes) {
    const vus = new Set<string>();
    for (const brut of a.styles ?? []) {
      const nom = brut.trim();
      const slug = slugStyle(nom);
      if (!slug || vus.has(slug)) continue;
      vus.add(slug);
      const s = out.find((x) => x.slug === slug);
      if (s) s.n += 1;
      else out.push({ nom, slug, n: 1 });
    }
  }
  return out;
}

export function artistesDuStyle<T extends Pick<Artiste, 'styles'>>(artistes: readonly T[], slug: string): T[] {
  return artistes.filter((a) => (a.styles ?? []).some((s) => slugStyle(s) === slug));
}

export function autresArtistes<T extends Pick<Artiste, 'slug'>>(artistes: readonly T[], slug: string): T[] {
  return artistes.filter((a) => a.slug !== slug);
}

export interface PorteArtiste {
  type: 'rdv' | 'email' | 'instagram';
  href: string;
  label: string;
  propre: boolean;
}

export function contactsDeLArtiste(a: Pick<Artiste, 'nom' | 'email' | 'instagram' | 'rdvUrl'>, contact: { email?: string }): PorteArtiste[] {
  const out: PorteArtiste[] = [];
  if (a.rdvUrl) out.push({ type: 'rdv', href: a.rdvUrl, label: `Prendre rendez-vous avec ${a.nom}`, propre: true });
  const email = a.email ?? contact.email;
  if (email) {
    const sujet = encodeURIComponent(`À l’attention de ${a.nom}`);
    out.push({ type: 'email', href: `mailto:${email}?subject=${sujet}`, label: `Écrire à ${a.nom}`, propre: Boolean(a.email) });
  }
  if (a.instagram) out.push({ type: 'instagram', href: a.instagram, label: `${a.nom} sur Instagram`, propre: true });
  return out;
}

export function residentsEtInvites<T extends Pick<Artiste, 'periode'>>(artistes: readonly T[]): { residents: T[]; invites: T[] } {
  return {
    residents: artistes.filter((a) => !(a.periode ?? '').trim()),
    invites: artistes.filter((a) => (a.periode ?? '').trim()),
  };
}

export function lienArtistes(artistes: readonly unknown[], label: string): { href: string; label: string } | null {
  return artistes.length > 0 ? { href: '/artistes', label } : null;
}

export function artistesComplets(artistes: readonly Pick<Artiste, 'photo' | 'photos' | 'styles'>[]): number {
  return artistes.filter((a) => (a.photo || (a.photos ?? []).length > 0) && (a.styles ?? []).some((s) => s.trim())).length;
}

export function enumerer(xs: readonly string[]): string {
  return xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} et ${xs[xs.length - 1]}`;
}
