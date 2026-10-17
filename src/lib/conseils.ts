/**
 * Conseils (articles) du client : premier levier du marché relevé par la veille du 17 oct 2026
 * (docs/veille/marche/CE-QUI-VEND.md — 5 sites qui vendent sur 9 ont une rubrique « conseils »,
 * « actualités » ou « journal » : Ouest Car, Villa d'Orient, Maison Stamm, WPCharming, Lintel).
 *
 * Un article vient du client (écrit, dicté, ou tiré d'une réponse qu'il donne souvent au téléphone),
 * jamais rédigé sans sa matière : docs/GOUT.md, règle dure 2 de CLAUDE.md. Pas d'article = pas de
 * page /conseils, pas de lien dans la nav.
 *
 *   - conseilsTries()  : du plus récent au plus ancien (date ISO AAAA-MM-JJ), sans muter l'entrée.
 *   - dateConseil()    : « 1er mars 2026 », « 17 octobre 2026 » (jamais « 01/03/2026 »).
 *   - lienConseils()   : l'entrée de nav { href: '/conseils', label } ou null sans article.
 *
 * Module pur (son seul import est un `import type`) : re-exporté par src/lib/site.ts, testé par
 * tests/conseils.test.mjs via scripts/ff/ts-loader.mjs.
 */
import type { Conseil } from './schema';

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

export function conseilsTries<T extends Pick<Conseil, 'date'>>(conseils: readonly T[]): T[] {
  return [...conseils].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function dateConseil(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const jour = Number(m[3]);
  // Espaces insécables : la date ne se coupe pas en fin de ligne (ff typo).
  return `${jour === 1 ? '1er' : jour} ${MOIS[Number(m[2]) - 1]} ${m[1]}`;
}

export function lienConseils(conseils: readonly unknown[], label: string): { href: string; label: string } | null {
  return conseils.length > 0 ? { href: '/conseils', label } : null;
}
