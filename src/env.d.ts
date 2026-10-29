/// <reference types="astro/client" />
declare module 'virtual:ff-look' {
  export const direction: string;
  export const fontFamilies: Record<string, string>;
  export const customSections: Record<string, any>;
  /** Coquille et variantes de sections de ce site seulement (scripts/vite-ff-look.mjs, composantsDuSite) ; undefined = repli glob. */
  export const Shell: any;
  export const sectionModules: Record<string, any>;
  export const sectionsCompilees: boolean;
  export const config: unknown;
  export const lookFile: unknown;
  export const preloadFonts: string[];
  export const hasCredits: boolean;
  /** Chemins publics sans extension des photos de banque de CREDITS.md (« /images/hero »). */
  export const photosBanque: string[];
  export const themeColor: string;
  export const icons: { svg: boolean; ico: boolean; apple: boolean; manifest: boolean };
}
