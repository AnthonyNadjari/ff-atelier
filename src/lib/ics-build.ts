/**
 * Lecture AU BUILD de l'iCal du client (site.disponibilites.ics : l'adresse d'export d'Airbnb, Booking, Gîtes de France,
 * Abritel ou d'un agenda partagé) pour l'architecture `outil-calendrier`. Rien n'est lu dans le navigateur (pas de
 * requête vers un tiers, la CSP reste fermée) : les disponibilités affichées sont celles du dernier build, et la page
 * le dit (« calendrier mis à jour le … »). Reconstruire le site pour le rafraîchir.
 *
 * Sûr par construction : https seulement, 8 s au plus, 2 Mo au plus, une lecture par build (mémoire du module). Si la
 * lecture échoue, on le dit au build et le calendrier N'EST PAS montré comme libre : periodes vaut null, la page garde la
 * demande de dates sans tableau (un calendrier faux est pire qu'aucun).
 */
import { lireIcs, type Periode } from './sejour';

const memo = new Map<string, Promise<Periode[] | null>>();

async function lire(url: string): Promise<Periode[] | null> {
  if (!/^https:\/\//i.test(url)) {
    console.warn(`[disponibilites] iCal ignoré (https seulement) : ${url}`);
    return null;
  }
  const ctrl = new AbortController();
  const minuterie = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'text/calendar, text/plain' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const texte = await res.text();
    if (texte.length > 2_000_000) throw new Error('fichier trop gros');
    if (!/BEGIN:VCALENDAR/.test(texte)) throw new Error('ce n’est pas un iCal');
    return lireIcs(texte);
  } catch (e) {
    console.warn(`[disponibilites] iCal illisible (${(e as Error).message}) : le calendrier n’est pas affiché, seule la demande de dates reste.`);
    return null;
  } finally {
    clearTimeout(minuterie);
  }
}

/** Périodes de l'iCal (null si absent ou illisible). */
export function periodesIcs(url: string | undefined): Promise<Periode[] | null> {
  if (!url) return Promise.resolve(null);
  if (!memo.has(url)) memo.set(url, lire(url));
  return memo.get(url)!;
}
