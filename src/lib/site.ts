/** Charge le site courant (import.meta.env.SITE, pose par astro.config.mjs). */
import type { Site } from './schema';

import { siteSchema } from './schema';
export { schemaTypeForTrade } from './schemaType';

import { config as siteConfig, lookFile, hasCredits } from 'virtual:ff-look';

export { hasCredits };

// Le config et le look.json du site courant sont resolus au build par scripts/vite-ff-look.mjs :
// les autres sites ne sont jamais lus (isolation : un site casse n'en bloque aucun autre).
const slug = import.meta.env.SITE as string;
const mod = { default: siteConfig as Site };

/**
 * look.json (optionnel, ecrit par `ff studio`) : surcharge uniquement le LOOK
 * (direction, motion, scale, accent, typography, layout, wording) sans toucher au contenu.
 * Permet de changer d'apparence sans editer le TypeScript ; `ff studio --figer` le fusionne dans site.config.ts.
 */
const LOOK_KEYS = ['direction', 'motion', 'smoothScroll', 'transitions', 'scale', 'accent', 'typography', 'layout', 'wording'] as const;
function applyLook(base: Site, look: Record<string, unknown> | undefined): Site {
  if (!look) return base;
  const merged: Record<string, unknown> = { ...base };
  for (const k of LOOK_KEYS) {
    if (look[k] === undefined) continue;
    const cur = merged[k];
    merged[k] = cur && typeof cur === 'object' && !Array.isArray(cur) && typeof look[k] === 'object' && !Array.isArray(look[k])
      ? { ...(cur as object), ...(look[k] as object) }
      : look[k];
  }
  const parsed = siteSchema.safeParse(merged);
  if (!parsed.success) {
    console.warn(`look.json ignore (invalide) : ${parsed.error.issues.map((i) => i.path.join('.') + ' ' + i.message).join(' ; ')}`);
    return base;
  }
  return parsed.data;
}

// FF_LOOK (variable d'environnement, posee par `ff propositions` / `ff matrice`) prime sur look.json
// et ne touche jamais au dossier du site : un build interrompu ne laisse aucune trace.
const envLookRaw = (import.meta.env.FF_LOOK as string | undefined) || '';
const envLook = envLookRaw ? (JSON.parse(envLookRaw) as Record<string, unknown>) : undefined;
const fileLook = lookFile as Record<string, unknown> | undefined;

export const site: Site = applyLook(mod.default, envLook ?? fileLook);
export const lookActif = Boolean(envLook ?? fileLook);
export const slugCourant = slug;

/** Helpers partages par les sections. */
export const tel = (s: Site = site) => `tel:${s.contact.phone}`;
export const mailto = (s: Site = site) => (s.contact.email ? `mailto:${s.contact.email}` : undefined);
export const whatsapp = (s: Site = site) => (s.contact.whatsapp ? `https://wa.me/${s.contact.whatsapp}` : undefined);
export const fullAddress = (s: Site = site) =>
  [s.contact.address.street, `${s.contact.address.postalCode} ${s.contact.address.city}`].filter(Boolean).join(', ');
export const yearsSince = (s: Site = site) => (s.business.since ? new Date().getFullYear() - s.business.since : undefined);
export const featuredServices = (s: Site = site) => s.services.filter((x) => x.featured);
export const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/** Slug d'une ville pour /zones/<slug> : minuscules, accents retires, non-alphanumerique -> '-'. */
export const citySlug = (city: string) =>
  city
    .replace(/œ/g, 'oe').replace(/Œ/g, 'Oe').replace(/æ/g, 'ae').replace(/Æ/g, 'Ae')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Ancres de navigation : seulement les sections presentes dans le layout. */
export const navLinks = (s: Site = site) => {
  const labels: Record<string, string> = {
    services: 'Services',
    about: 'À propos',
    proof: 'Avis',
    zones: 'Zones',
    process: 'Méthode',
    faq: 'FAQ',
    contact: 'Contact',
  };
  const seen = new Set<string>();
  const links = s.layout.sections
    .filter((x) => x.type !== 'cta')
    .filter((x) => (x.type === 'custom' ? Boolean(x.label) : !seen.has(x.type) && seen.add(x.type)))
    .map((x) => x.type === 'custom'
      ? { href: `#${x.variant.toLowerCase()}`, label: x.label as string }
      : { href: `#${x.type}`, label: labels[x.type] ?? x.type });
  // Contact en tiroir (layout.contactDrawer) sans section contact dans le layout : le tiroir est la
  // seule porte, la nav recoit donc une ancre #contact que ContactDrawer.astro intercepte.
  if (s.layout.contactDrawer && !links.some((l) => l.href === '#contact')) links.push({ href: '#contact', label: labels.contact });
  return links;
};
