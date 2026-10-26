/**
 * actions(site) : les portes d'action par intention (docs/veille/demontages/INDEX.md, geste 2 :
 * Délice, Relais Rossàr, Meyers, KS). Un visiteur vient réserver, commander, offrir, demander un prix
 * ou appeler : chaque porte est un lien de premier niveau dans la nav (src/sections/Nav/*.astro) et,
 * sur téléphone, dans la barre d'actions (src/components/BarreActions.astro, layout.actionBar).
 *
 * Ordre fixe, du plus engageant au plus générique :
 *   1. Réserver   — contact.bookingUrl ; sans lui, l'outil de disponibilités de l'accueil (/#disponibilites,
 *                   site.disponibilites, architecture outil-calendrier : « Boeken » de Coquelicots saute à l'outil)
 *   2. Commander  — contact.orderUrl
 *   3. Bon cadeau — contact.giftCardUrl
 *   4. Appeler    — tel:contact.phone (toujours présent : le téléphone est obligatoire). Avant le devis :
 *                   pour un artisan, l'appel est la porte principale (urgence, devis au téléphone), et
 *                   `ff verifier` exige un tel: au premier écran ; sans lien de réservation, le bouton de la
 *                   barre téléphone reste « Appeler ».
 *   5. Devis      — /#contact (absolu : marche depuis toute page), seulement s'il existe une porte contact sur la page : tiroir
 *                   (layout.contactDrawer) ou section contact dans layout.sections
 * Une porte sans donnée n'existe pas (rien n'est deviné : pas de lien de réservation = pas de bouton).
 * Libellés surchargeables par wording.actions.{booking,order,giftCard,quote} ; « Devis » prend
 * wording.devis par défaut, comme le bouton historique des navs.
 *
 * Module pur (aucune dépendance runtime) : re-exporté par src/lib/site.ts, testé par
 * tests/actions.test.mjs via scripts/ff/ts-loader.mjs sans passer par Vite/Astro.
 */
import type { Site } from './schema';

export type ActionKind = 'booking' | 'order' | 'giftCard' | 'quote' | 'call';

export interface Action {
  /** Libellé visible (« Réserver », « Commander », « Bon cadeau », wording.devis, « Appeler »). */
  label: string;
  href: string;
  kind: ActionKind;
  /** true = lien sortant (outil de réservation, de commande…) : target _blank + rel noopener. */
  external: boolean;
  /** Icône lucide (PascalCase) pour les rendus qui en veulent une (dock, barre d'actions). */
  icon: string;
}

export const ACTION_LABELS: Record<ActionKind, string> = {
  booking: 'Réserver',
  order: 'Commander',
  giftCard: 'Bon cadeau',
  quote: 'Demander un devis',
  call: 'Appeler',
};

export const ACTION_ICONS: Record<ActionKind, string> = {
  booking: 'CalendarCheck',
  order: 'ShoppingBag',
  giftCard: 'Gift',
  quote: 'MessageSquare',
  call: 'Phone',
};

/** Ce que actions() lit dans le site — un sous-ensemble de Site, pour tester sans tout construire. */
export type ActionsInput = {
  contact: Pick<Site['contact'], 'phone'> & Partial<Pick<Site['contact'], 'bookingUrl' | 'orderUrl' | 'giftCardUrl'>>;
  layout: { contactDrawer?: boolean; sections: { type: string }[] };
  wording: { devis?: string; actions?: Partial<Record<Exclude<ActionKind, 'call'>, string | undefined>> };
  /** Calendrier des disponibilités (architecture outil-calendrier) : la porte Réserver y mène sans bookingUrl. */
  disponibilites?: unknown;
};

/** Y a-t-il une porte #contact sur la page (tiroir ou section contact) ? */
export const hasContactDoor = (s: Pick<ActionsInput, 'layout'>): boolean =>
  Boolean(s.layout.contactDrawer) || s.layout.sections.some((x) => x.type === 'contact');

/** Liste ordonnée des portes disponibles pour ce site. Jamais vide : « Appeler » est toujours là. */
export function actions(s: ActionsInput): Action[] {
  const w = s.wording.actions ?? {};
  const out: Action[] = [];
  const push = (kind: ActionKind, href: string | undefined, label: string | undefined, external: boolean) => {
    if (!href) return;
    out.push({ kind, href, label: label || ACTION_LABELS[kind], external, icon: ACTION_ICONS[kind] });
  };
  if (s.contact.bookingUrl) push('booking', s.contact.bookingUrl, w.booking, true);
  else if (s.disponibilites) push('booking', '/#disponibilites', w.booking, false);
  push('order', s.contact.orderUrl, w.order, true);
  push('giftCard', s.contact.giftCardUrl, w.giftCard, true);
  push('call', `tel:${s.contact.phone}`, undefined, false);
  push('quote', hasContactDoor(s) ? '/#contact' : undefined, w.quote || s.wording.devis, false);
  return out;
}
