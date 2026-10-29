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

/**
 * `sizes` des heros partages (src/sections/Hero/*.astro) — UNE seule source, aussi lue par le preload
 * LCP de src/layouts/Base.astro (imagesizes) : un `sizes` different entre le preload et le <Img> reel
 * ferait telecharger deux candidats. Largeurs reelles d'affichage : le conteneur (--container, 76rem =
 * 1216px) plafonne les heros "split" (6/12 colonnes, gap 2rem = 592px) et "stacked" (1216px) au-dela
 * de 1280px ; fullbleed/video occupent tout le viewport.
 */
export const HERO_SIZES: Record<string, string> = {
  split: '(min-width: 1280px) 592px, (min-width: 1024px) 50vw, 100vw',
  stacked: '(min-width: 1280px) 1216px, 100vw',
  fullbleed: '100vw',
  video: '100vw',
  // Heros de famille (premiers-ecrans.md) : cadre de 112rem au plus ; colonnes 4/12, 7/12 ; photo sous voile.
  'carte-sur-photo': '(min-width: 1792px) 1792px, 100vw',
  mosaique: '(min-width: 64rem) 34vw, 50vw',
  editorial: '(min-width: 1280px) 400px, (min-width: 1024px) 33vw, 90vw',
  'numero-geant': '(min-width: 1280px) 720px, (min-width: 1024px) 58vw, 100vw',
  'preuve-d-abord': '(min-width: 1280px) 1216px, 100vw',
  'plan-et-lieu': '(min-width: 1280px) 700px, (min-width: 1024px) 58vw, 100vw',
  // Style experimentalcc (docs/veille/styles/experimentalcc.md) : portrait vertical etroit centre, 446 px au plus, 66vw au telephone.
  'portrait-exclusion': '(min-width: 44rem) 446px, 66vw',
  // Style frenchette : photo bord à bord sous un panneau coupé en biais.
  'panneaux-biais': '100vw',
  // Style casabonay : mur de photos en deux colonnes à côté de la colonne fixe (coquille split), une colonne au téléphone.
  'mur-de-photos': '(min-width: 64rem) 38vw, 100vw',
  lin: '100vw', // bande pleine largeur sous la phrase (style lin)
  pinceau: '(min-width: 64rem) 560px, 92vw', // photo de la bande terracotta sous l'enseigne (style pinceau, Services/pinceau)
  calque: '100vw', // photo plein écran sous la barre de cellules (style calque)
  enduit: '100vw', // photo plein écran, phrase en bas à gauche (style enduit)
  ocre: '(min-width: 48rem) 50vw, 100vw', // diptyque bord à bord sous la ligne du titre (style ocre)
  chapitre: '100vw', // photo du lieu en plein cadre sous le nom de bord à bord (style chapitre)
};

/** `sizes` d'un hero selon sa variante (`site.layout.hero`) ; toute variante inconnue = pleine largeur. */
export function heroSizesFor(variant: string): string {
  return HERO_SIZES[variant] ?? '100vw';
}

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
