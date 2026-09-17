/**
 * Manifeste images (sites/<slug>/images.json, genere par `ff images <slug>`, voir scripts/ff/images.mjs) :
 * logique partagee entre `src/components/Img.astro` (rendu <picture> AVIF/WebP responsive) et
 * `src/layouts/Base.astro` (preload de l'image LCP du hero, voir docs/veille/performance.md §4.1).
 * Extrait ici pour que les deux consommateurs restent en accord sur le nommage des fichiers generes.
 */

export interface ImageManifestEntry {
  widths: number[];
  formats: string[];
  ratio: number;
  lqip: string;
}

const manifests = import.meta.glob<{ default: Record<string, ImageManifestEntry> }>('/sites/*/images.json', { eager: true });

/** Manifeste complet d'un site (vide si `ff images <slug>` n'a jamais tourne). */
export function getImageManifest(slug: string): Record<string, ImageManifestEntry> {
  return manifests[`/sites/${slug}/images.json`]?.default ?? {};
}

/** "/images/hero.webp" -> { dir: "/images", name: "hero" }. */
export function splitImagePath(src: string): { dir: string; name: string } {
  const match = /^(.*)\/([^/]+)\.[a-zA-Z0-9]+$/.exec(src);
  return { dir: match?.[1] ?? '', name: match?.[2] ?? '' };
}

/** Entree du manifeste pour un `src` donne, ou undefined si l'image n'est pas passee par `ff images`. */
export function lookupImageEntry(slug: string, src: string): ImageManifestEntry | undefined {
  const { name } = splitImagePath(src);
  return name ? getImageManifest(slug)[name] : undefined;
}

/** Nom de fichier genere par `ff images` pour une largeur donnee (sans suffixe pour la plus grande). */
export function imageFilename(dir: string, name: string, width: number, maxWidth: number, ext: string): string {
  return `${dir}/${name}${width === maxWidth ? '' : `-${width}`}.${ext}`;
}

/** `srcset` complet d'une entree de manifeste pour un format (avif|webp). */
export function imageSrcsetFor(entry: ImageManifestEntry, dir: string, name: string, ext: string): string {
  const maxWidth = Math.max(...entry.widths);
  return entry.widths.map((w) => `${imageFilename(dir, name, w, maxWidth, ext)} ${w}w`).join(', ');
}
