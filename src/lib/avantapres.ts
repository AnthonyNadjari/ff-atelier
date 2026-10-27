/**
 * Le mur des pièces restaurées (realisations[].avant) : architecture `avant-apres` (src/lib/architectures.ts ; source
 * Assise Autrement, tapissière à Joinville-le-Pont, secondes sources La Petite Remise, Cabasse, et atelier.b,
 * Saint-Amand-les-Eaux ; docs/veille/architectures/avant-apres.md). La source vend par la transformation : « Retrouvez en
 * images à quoi ressemblaient les chaises, fauteuils et autres sièges avant leur restauration ». Chaque pièce y est un
 * titre, deux ou trois photos (avant, pendant, après) et ce qui a été fait.
 *
 *   - piecesAvantApres() : réalisations qui ont une photo avant ET une photo après (mesure `avantApres`) ;
 *   - paireDe()          : la paire du curseur (avant[0], photos[0]) ;
 *   - typesDePieces()    : types distincts des pièces (kind), dans l'ordre du client ; moins de deux = pas d'onglets ;
 *   - groupesDePieces()  : les pièces rangées par type (un onglet chacun).
 *
 * Module pur, sans import. Testé par tests/architectures-soins.test.mjs via scripts/ff/ts-loader.mjs (loadAvantApresModule).
 */

export interface Photo {
  src: string;
  alt: string;
}

export interface Piece {
  slug: string;
  title: string;
  kind?: string;
  photos?: readonly Photo[];
  avant?: readonly Photo[];
}

export function piecesAvantApres<T extends Piece>(realisations: readonly T[] | undefined): T[] {
  return (realisations ?? []).filter((r) => (r.avant ?? []).length > 0 && (r.photos ?? []).length > 0);
}

export function paireDe(r: Piece): { avant: Photo; apres: Photo } | undefined {
  const avant = r.avant?.[0];
  const apres = r.photos?.[0];
  return avant && apres ? { avant, apres } : undefined;
}

export function typesDePieces(pieces: readonly Piece[]): string[] {
  const vus: string[] = [];
  for (const p of pieces) {
    const k = (p.kind ?? '').trim();
    if (k && !vus.includes(k)) vus.push(k);
  }
  return vus.length >= 2 ? vus : [];
}

/**
 * Pièces rangées par type, dans l'ordre du client (onglets du mur de la coquille `avant-apres`) ; une pièce sans type va
 * au groupe « Autres pièces ». Moins de deux types = un seul groupe sans nom (pas d'onglets).
 */
export function groupesDePieces<T extends Piece>(pieces: readonly T[]): { type?: string; pieces: T[] }[] {
  const types = typesDePieces(pieces);
  if (types.length === 0) return pieces.length > 0 ? [{ pieces: [...pieces] }] : [];
  const groupes: { type?: string; pieces: T[] }[] = types.map((type) => ({ type, pieces: pieces.filter((p) => (p.kind ?? '').trim() === type) }));
  const sans = pieces.filter((p) => !(p.kind ?? '').trim());
  if (sans.length > 0) groupes.push({ type: 'Autres pièces', pieces: sans });
  return groupes;
}
