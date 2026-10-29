/**
 * La garde et les espèces d'une clinique vétérinaire (site.garde, site.especes) : architecture `garde-especes`
 * (src/lib/architectures.ts ; sources Clinique vétérinaire Les Quais, Saumur et Bourgueil : « URGENCES » en dernier
 * lien de la barre et au pied, qui ouvre « Que faire en cas d'urgence vétérinaire ? » en trois temps (garder son calme,
 * téléphoner au vétérinaire de garde et laisser un message, ne jamais donner un médicament humain), les conseils rangés
 * par espèce (chiens, chats, NAC) ; Clinique vétérinaire Saint-Max : sous le h1 qui nomme les espèces, « Prendre RDV en
 * ligne » et « En cas d'urgence » côte à côte, une page Urgence (garde en rotation, régulation, ce qu'on y soigne) ;
 * docs/veille/architectures/garde-especes.md). Le maître se demande d'abord « est-ce une urgence, qui appeler
 * maintenant ? », puis « soignez-vous mon animal ? » : le site part de là.
 *
 *   - especesCompletes() : espèces avec slug et nom, slugs uniques (mesure `especes`) ;
 *   - etapesGarde()      : temps de la conduite à tenir qui ont un titre ;
 *   - signesGarde()      : signes d'urgence non vides, dans l'ordre du vétérinaire ;
 *   - numeroDeGarde()    : le numéro à appeler hors des heures d'ouverture (celui de la garde s'il diffère, sinon celui
 *                          de la clinique : jamais un numéro deviné) ;
 *   - numeroDuMoment()   : ouvert → la clinique, fermé → la garde (état calculé dans le navigateur, horaires.ts) ;
 *   - gardeLisible()     : la garde dit quelque chose (au moins un temps, ou un numéro propre) — mesure `garde` ;
 *   - lienEspeces() / lienUrgences() : entrées de nav (/animaux dès 2 espèces, /urgences dès que la garde se lit).
 *
 * Module pur, sans import. Testé par tests/architectures-garde.test.mjs via scripts/ff/ts-loader.mjs (loadGardeModule).
 */

export interface Espece {
  slug: string;
  nom: string;
}

export interface EtapeGarde {
  titre: string;
  texte?: string;
}

export interface Garde {
  telephone?: string;
  telephoneAffiche?: string;
  etapes?: readonly EtapeGarde[];
  signes?: readonly string[];
}

export interface Numero {
  href: string;
  affiche: string;
  /** Vrai si c'est un numéro de garde distinct de celui de la clinique. */
  garde: boolean;
}

const net = (t: string | undefined) => (t ?? '').trim();

export function especesCompletes<E extends Espece>(liste: readonly E[] | undefined): E[] {
  const vus = new Set<string>();
  return (liste ?? []).filter((e) => {
    const slug = net(e.slug);
    if (!slug || !net(e.nom) || vus.has(slug)) return false;
    vus.add(slug);
    return true;
  });
}

export function etapesGarde<T extends EtapeGarde>(g: { etapes?: readonly T[] } | undefined): T[] {
  return (g?.etapes ?? []).filter((e) => net(e.titre));
}

export function signesGarde(g: Garde | undefined): string[] {
  return (g?.signes ?? []).map(net).filter(Boolean);
}

/** Numéro propre à la garde (E.164 et affichage donnés), sinon celui de la clinique. */
export function numeroDeGarde(g: Garde | undefined, contact: { phone: string; phoneDisplay: string }): Numero {
  const t = net(g?.telephone).replace(/[^+\d]/g, '');
  const a = net(g?.telephoneAffiche);
  if (t && a && t !== contact.phone.replace(/[^+\d]/g, '')) return { href: `tel:${t}`, affiche: a, garde: true };
  return { href: `tel:${contact.phone.replace(/[^+\d]/g, '')}`, affiche: contact.phoneDisplay, garde: false };
}

/** Le numéro du moment : la clinique quand elle est ouverte, la garde sinon. */
export function numeroDuMoment(ouvert: boolean, g: Garde | undefined, contact: { phone: string; phoneDisplay: string }): Numero {
  if (ouvert) return { href: `tel:${contact.phone.replace(/[^+\d]/g, '')}`, affiche: contact.phoneDisplay, garde: false };
  return numeroDeGarde(g, contact);
}

export function gardeLisible(g: Garde | undefined): boolean {
  if (!g) return false;
  return etapesGarde(g).length > 0 || (Boolean(net(g.telephone)) && Boolean(net(g.telephoneAffiche)));
}

export function lienEspeces(liste: readonly Espece[] | undefined, label: string): { href: string; label: string } | undefined {
  return especesCompletes(liste).length >= 2 ? { href: '/animaux', label } : undefined;
}

export function lienUrgences(g: Garde | undefined, label: string): { href: string; label: string } | undefined {
  return gardeLisible(g) ? { href: '/urgences', label } : undefined;
}
