/// <reference types="astro/client" />
declare module 'virtual:ff-look' {
  export const direction: string;
  export const fontFamilies: Record<string, string>;
  export const customSections: Record<string, any>;
  export const config: unknown;
  export const lookFile: unknown;
  export const preloadFonts: string[];
  export const hasCredits: boolean;
  export const themeColor: string;
  export const icons: { svg: boolean; ico: boolean; apple: boolean; manifest: boolean };
}
