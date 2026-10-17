/**
 * Galerie de réalisations (proof/gallery) : geste 5 des démontages (docs/veille/demontages/INDEX.md —
 * KS Architectes classe ses chantiers par commune et par type, Artisans de Genève signe chaque pièce des
 * initiales du client, Mathilde De Chiara filtre ses projets par typologie, compteur réel « 01 / 30 »).
 *
 * Chaque réalisation porte quatre métadonnées optionnelles (`place`, `kind`, `size`, `client`, voir
 * src/lib/schema.ts) : absente = non affichée, jamais devinée. Ce module ne fait que lire :
 *   - kindsDeGalerie()   : les types distincts, dans l'ordre d'apparition — null s'il y en a moins de deux
 *                          (un seul type = rien à filtrer, pas de rangée de boutons).
 *   - idDeKind()         : identifiant stable d'un type pour `id`/`data-kind` (minuscules, sans accents).
 *   - metaDeRealisation(): la ligne discrète sous la photo, dans l'ordre lieu, type, mesure, client,
 *                          sans les champs absents — à joindre par SEPARATEUR_META (demi-cadratin, jamais
 *                          le point médian : docs/GOUT.md § 2).
 *   - libelleCompteur()  : « 12 réalisations » à partir de COMPTEUR_MIN photos (un chiffre réel ; sous ce
 *                          seuil, le compteur n'apporte rien et ressemble à un badge), sinon null.
 *
 * Module pur (son seul import est un `import type`, effacé par le type-stripping) : re-exporté par
 * src/lib/site.ts, testé par tests/galerie.test.mjs via scripts/ff/ts-loader.mjs sans Vite/Astro.
 */
import type { Realisation } from './schema';

/** Ce que ce module lit d'une réalisation — un sous-ensemble, pour tester sans tout construire. */
export type RealisationMeta = Partial<Pick<Realisation, 'place' | 'kind' | 'size' | 'client'>>;

/** Nombre de photos à partir duquel la section affiche « N réalisations ». */
export const COMPTEUR_MIN = 4;

/** Séparateur de la ligne de métadonnées : espace + tiret demi-cadratin + espace (U+2013). */
export const SEPARATEUR_META = ' – ';

const propre = (v: string | undefined): string | undefined => {
  const t = (v ?? '').trim();
  return t ? t : undefined;
};

/** Types de travaux distincts, dédoublonnés, dans l'ordre d'apparition ; null s'il y en a moins de deux. */
export function kindsDeGalerie(gallery: readonly RealisationMeta[]): string[] | null {
  const out: string[] = [];
  for (const r of gallery) {
    const k = propre(r.kind);
    if (k && !out.includes(k)) out.push(k);
  }
  return out.length >= 2 ? out : null;
}

/** Identifiant d'un type pour les attributs HTML (`k-cuisine`, `data-kind="cuisine"`). */
export function idDeKind(kind: string): string {
  const base = kind
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || 'autre';
}

/** La ligne sous la photo : lieu, type, mesure, client — seulement les champs renseignés. */
export function metaDeRealisation(r: RealisationMeta): string[] {
  return [r.place, r.kind, r.size, r.client].map(propre).filter((x): x is string => Boolean(x));
}

/** « 12 réalisations » dès COMPTEUR_MIN photos, sinon null (pas de compteur pour trois photos). */
export function libelleCompteur(n: number): string | null {
  return n >= COMPTEUR_MIN ? `${n} réalisations` : null;
}
