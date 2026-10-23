/**
 * Adresses du client (site.lieux) : architecture `pages-adresses` (src/lib/architectures.ts ; source Ten Belles,
 * docs/veille/architectures/pages-adresses.md). Le site se range par lieu : bandeau des adresses sur l'accueil
 * (src/sections/Zones/adresses.astro), une page par lieu (/adresses/<slug>), la page /adresses qui les liste avec le
 * formulaire, les adresses au pied, et le chemin des professionnels à part (site.pros, /professionnels).
 *
 *   - telDuLieu()      : { href: 'tel:+33…', affiche: '01 23 45 67 89' } du lieu, sinon celui du site (contact.phone) ;
 *                        jamais un numéro deviné, un lieu sans numéro propre donne le numéro principal ;
 *   - adresseDuLieu()  : « 12 rue Breguet, 75011 Paris » ;
 *   - autresLieux()    : les autres adresses, dans l'ordre du site ;
 *   - liensLieux()     : entrées de nav ; une ou deux adresses : leur nom, chacune vers sa page ; trois et plus : une
 *                        seule entrée vers /adresses (jamais une liste de numéros ni de lieux dans l'en-tête) ;
 *   - lienPros()       : { href: '/professionnels', label } ou null sans site.pros ;
 *   - lieuxComplets()  : lieux qui ont une rue ET des horaires (mesure `lieux` de donneesManquantes).
 *
 * Module pur (seul un `import type`) : re-exporté par src/lib/site.ts, testé par tests/architectures.test.mjs via
 * scripts/ff/ts-loader.mjs (loadLieuxModule).
 */
import type { Site } from './schema';

type Lieu = Pick<Site['lieux'][number], 'slug' | 'nom' | 'address'> & { phone?: string; phoneDisplay?: string; hours?: unknown[] };
type Contact = { phone: string; phoneDisplay: string };

export function telDuLieu(lieu: Pick<Lieu, 'phone' | 'phoneDisplay'>, contact: Contact): { href: string; affiche: string; propre: boolean } {
  if (lieu.phone) return { href: `tel:${lieu.phone}`, affiche: lieu.phoneDisplay ?? lieu.phone, propre: true };
  return { href: `tel:${contact.phone}`, affiche: contact.phoneDisplay, propre: false };
}

export function adresseDuLieu(lieu: Pick<Lieu, 'address'>): string {
  const a = lieu.address;
  return [a.street, `${a.postalCode} ${a.city}`].filter(Boolean).join(', ');
}

export function autresLieux<T extends Pick<Lieu, 'slug'>>(lieux: readonly T[], slug: string): T[] {
  return lieux.filter((l) => l.slug !== slug);
}

export function liensLieux(lieux: readonly Pick<Lieu, 'slug' | 'nom'>[], label: string): { href: string; label: string }[] {
  if (lieux.length === 0) return [];
  if (lieux.length <= 2) return lieux.map((l) => ({ href: `/adresses/${l.slug}`, label: l.nom }));
  return [{ href: '/adresses', label }];
}

export function lienPros(pros: unknown, label: string): { href: string; label: string } | null {
  return pros ? { href: '/professionnels', label } : null;
}

export function lieuxComplets(lieux: readonly { address?: { street?: string }; hours?: unknown[] }[]): number {
  return lieux.filter((l) => Boolean(l.address?.street) && (l.hours ?? []).length > 0).length;
}
