/**
 * Nouvelle du moment (site.annonce) : une ligne datée du client en tête de page, sous le premier écran
 * (docs/veille/marche/CE-QUI-VEND.md : « nouvelle du moment en tête de page ou dans la nav », 10 sites sur 63 ;
 * DSD Rénov : bandeau sous le premier écran, Colson Elec : barre haute). Fermeture pour congés, produit de
 * saison, offre datée : des faits du client, jamais une promotion inventée.
 *
 * La fenêtre `du` / `au` (AAAA-MM-JJ, bornes incluses, jour civil Europe/Paris) se lit deux fois : au build
 * (une annonce finie n'est pas dans le HTML) et dans le navigateur (un site n'est pas reconstruit chaque jour :
 * src/components/Annonce.astro cache la ligne quand la date est passée ou pas encore venue).
 *
 * Coquilles à défilement par crans (scroll-snap) : chaque section y est un écran ; une ligne ne peut pas y
 * être un écran. L'accueil n'y rend pas l'annonce (src/pages/index.astro), la liste est tenue ici et
 * vérifiée par tests/annonce.test.mjs contre les coquilles qui déclarent `scroll-snap-type`.
 *
 * Module pur, sans dépendance : testé par tests/annonce.test.mjs via scripts/ff/ts-loader.mjs.
 */

export interface Annonce {
  texte: string;
  lien?: string;
  lienTexte?: string;
  du?: string;
  au?: string;
}

/** Coquilles où chaque section est un écran à cran : pas de place pour une ligne d'annonce. */
export const COQUILLES_SANS_ANNONCE = ['carnet', 'panneaux', 'scenes', 'slides', 'vitrine'] as const;

/** Jour civil « AAAA-MM-JJ » de `date` dans le fuseau donné (Europe/Paris par défaut). */
export function jourCivil(date: Date, timeZone = 'Europe/Paris'): string {
  // fr-CA donne nativement AAAA-MM-JJ.
  return new Intl.DateTimeFormat('fr-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

/** Vrai si l'annonce doit s'afficher à `date` : texte non vide, et le jour civil dans [du, au] (bornes incluses). */
export function annonceVisible(a: Annonce | undefined, date: Date, timeZone = 'Europe/Paris'): boolean {
  if (!a || !a.texte || !a.texte.trim()) return false;
  const jour = jourCivil(date, timeZone);
  if (a.du && jour < a.du) return false;
  if (a.au && jour > a.au) return false;
  return true;
}

/** Vrai si la coquille peut recevoir la ligne d'annonce sous son premier écran. */
export function coquilleAcceptAnnonce(shell: string): boolean {
  return !(COQUILLES_SANS_ANNONCE as readonly string[]).includes(shell);
}
