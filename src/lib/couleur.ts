/**
 * Couleur par activité ou par espace, déclarée par le client (`services[].couleur`, `about.espaces[].couleur` ;
 * architectures cadre-couleur et scenes-epinglees, docs/veille/architectures/meyers.md « une couleur par activité »,
 * tab-kitchen.md « un panneau de couleur par espace »). Module pur, sans import runtime : lit une couleur écrite en
 * hex (#rrggbb) ou en OKLCH (oklch(L C H), L en 0..1 ou en %), la convertit en sRGB, et choisit l'ENCRE qui se lit
 * dessus (claire ou sombre, de la même teinte) en vérifiant le contraste WCAG 2.1 : jamais une couleur de texte
 * devinée, jamais un texte illisible. Mêmes formules que scripts/ff/couleur.mjs (luminance, ratio, OKLCH de Björn
 * Ottosson) ; testé par tests/architectures.test.mjs via scripts/ff/ts-loader.mjs.
 *
 * Une section pose `styleTeinte(couleur)` sur l'élément coloré (`--teinte`, `--teinte-encre`) et lit ces deux
 * variables dans son CSS ; sans couleur déclarée, styleTeinte renvoie undefined et les tokens de la direction font le
 * travail : rien ne change.
 */

/** Même expression que dans src/lib/schema.ts (champ `couleur`) : hex #rrggbb ou oklch(L C H). */
export const COULEUR_RE = /^(#[0-9a-f]{6}|oklch\(\s*\d*\.?\d+%?\s+\d*\.?\d+\s+\d*\.?\d+(?:deg)?\s*\))$/i;

export type Rgb = [number, number, number];

/** Seuils WCAG 2.1 : texte courant 4,5:1 (scripts/ff/couleur.mjs, SEUILS.texte). */
export const CONTRASTE_TEXTE = 4.5;

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const versLineaire = (v: number) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
const versGamma = (v: number) => (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055);

/** OKLCH -> sRGB 0..255. L en 0..1, C absolu, H en degrés. */
export function oklchVersRgb(L: number, C: number, H: number): Rgb {
  const hr = (H * Math.PI) / 180;
  const a = C * Math.cos(hr);
  const b = C * Math.sin(hr);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return [lr, lg, lb].map((v) => Math.round(clamp01(versGamma(v)) * 255)) as Rgb;
}

/** sRGB 0..255 -> OKLCH { L (0..1), C, H (deg) }. */
export function rgbVersOklch([r8, g8, b8]: Rgb): { L: number; C: number; H: number } {
  const r = versLineaire(r8 / 255);
  const g = versLineaire(g8 / 255);
  const b = versLineaire(b8 / 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(A, B);
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}

/** Couleur écrite par le client -> sRGB 0..255, ou null si la forme n'est pas reconnue. */
export function parseCouleur(valeur: string | undefined): Rgb | null {
  if (!valeur || !COULEUR_RE.test(valeur.trim())) return null;
  const v = valeur.trim();
  if (v.startsWith('#')) {
    return [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16)) as Rgb;
  }
  const [l, c, h] = v.slice(6, -1).trim().split(/\s+/);
  const L = l.endsWith('%') ? parseFloat(l) / 100 : parseFloat(l);
  return oklchVersRgb(clamp01(L), parseFloat(c), parseFloat(h));
}

/** Luminance relative WCAG 2.1. */
export function luminance([r, g, b]: Rgb): number {
  return 0.2126 * versLineaire(r / 255) + 0.7152 * versLineaire(g / 255) + 0.0722 * versLineaire(b / 255);
}

/** Ratio de contraste WCAG 2.1 entre deux couleurs opaques, 1..21. */
export function contraste(a: Rgb, b: Rgb): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const arrondi = (x: number) => Math.round(x * 1000) / 1000;

/**
 * Le fond et l'encre qui se lisent : l'encre est sombre ou claire, de la teinte de la couleur (un peu de chroma, pour
 * que le texte appartienne au panneau au lieu d'y être posé en noir pur), celle des deux qui contraste le plus.
 * Si même la meilleure encre reste sous CONTRASTE_TEXTE (une couleur moyenne, L* autour de 0,55 : ni le blanc ni le
 * noir n'y tiennent 4,5:1), le FOND est creusé pas à pas dans sa propre teinte (plus sombre sous l'encre claire, plus
 * clair sous l'encre sombre) jusqu'à ce que le texte se lise : la couleur du client reste la sienne, à peine
 * approfondie, et jamais un texte illisible n'est livré (vérifié par l'audit a11y de ff verifier). `ajuste` dit si
 * le fond a bougé. Renvoie null si la couleur n'est pas reconnue.
 */
export function teinteLisible(couleur: string | undefined): { fond: string; encre: string; contraste: number; claire: boolean; ajuste: boolean } | null {
  const rgb = parseCouleur(couleur);
  if (!rgb) return null;
  const o = rgbVersOklch(rgb);
  const h = Math.round(o.H);
  const sombre = { css: `oklch(0.2 0.02 ${h})`, rgb: oklchVersRgb(0.2, 0.02, h) };
  const claire = { css: `oklch(0.985 0.008 ${h})`, rgb: oklchVersRgb(0.985, 0.008, h) };
  const cs = contraste(rgb, sombre.rgb);
  const cc = contraste(rgb, claire.rgb);
  const encre = cs >= cc ? sombre : claire;
  const estClaire = encre === claire;
  let ratio = Math.max(cs, cc);
  if (ratio >= CONTRASTE_TEXTE) return { fond: couleur!.trim(), encre: encre.css, contraste: ratio, claire: estClaire, ajuste: false };
  // Creuser le fond par pas de 0,02 de clarté, dans sa teinte et sa chroma, jusqu'à la lisibilité.
  let L = o.L;
  for (let i = 0; i < 40 && ratio < CONTRASTE_TEXTE; i++) {
    L += estClaire ? -0.02 : 0.02;
    ratio = contraste(oklchVersRgb(L, o.C, h), encre.rgb);
  }
  return { fond: `oklch(${arrondi(L)} ${arrondi(o.C)} ${h})`, encre: encre.css, contraste: ratio, claire: estClaire, ajuste: true };
}

/** L'encre seule (voir teinteLisible). */
export function encreSur(couleur: string | undefined): { encre: string; contraste: number; claire: boolean } | null {
  const t = teinteLisible(couleur);
  return t ? { encre: t.encre, contraste: t.contraste, claire: t.claire } : null;
}

/**
 * Attribut `style` à poser sur l'élément coloré : `--teinte` (la couleur du client, approfondie seulement si le texte
 * ne s'y lisait pas) et `--teinte-encre` (l'encre choisie par contraste). Undefined sans couleur valide : l'élément
 * garde les tokens de la direction.
 */
export function styleTeinte(couleur: string | undefined): string | undefined {
  const t = teinteLisible(couleur);
  if (!t) return undefined;
  return `--teinte: ${t.fond}; --teinte-encre: ${t.encre};`;
}
