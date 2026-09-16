/** Charge le site courant (import.meta.env.SITE, pose par astro.config.mjs). */
import type { Site } from './schema';

import { siteSchema } from './schema';

const modules = import.meta.glob<{ default: Site }>('/sites/*/site.config.ts', { eager: true });
const looks = import.meta.glob<{ default: Record<string, unknown> }>('/sites/*/look.json', { eager: true });
const slug = import.meta.env.SITE as string;
const key = `/sites/${slug}/site.config.ts`;
const mod = modules[key];
if (!mod) throw new Error(`Config introuvable : ${key}`);

/**
 * look.json (optionnel, ecrit par `ff studio`) : surcharge uniquement le LOOK
 * (direction, motion, scale, accent, typography, layout, wording) sans toucher au contenu.
 * Permet de changer d'apparence sans editer le TypeScript ; `ff studio --figer` le fusionne dans site.config.ts.
 */
const LOOK_KEYS = ['direction', 'motion', 'scale', 'accent', 'typography', 'layout', 'wording'] as const;
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
const fileLook = looks[`/sites/${slug}/look.json`]?.default;

export const site: Site = applyLook(mod.default, envLook ?? fileLook);
export const lookActif = Boolean(envLook ?? fileLook);
export const slugCourant = slug;

/** Helpers partages par les sections. */
export const tel = (s: Site = site) => `tel:${s.contact.phone}`;
export const mailto = (s: Site = site) => `mailto:${s.contact.email}`;
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
  return s.layout.sections
    .filter((x) => x.type !== 'cta' && !seen.has(x.type) && seen.add(x.type))
    .map((x) => ({ href: `#${x.type}`, label: labels[x.type] ?? x.type }));
};
