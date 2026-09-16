/** Charge le site courant (import.meta.env.SITE, pose par astro.config.mjs). */
import type { Site } from './schema';

const modules = import.meta.glob<{ default: Site }>('/sites/*/site.config.ts', { eager: true });
const slug = import.meta.env.SITE as string;
const key = `/sites/${slug}/site.config.ts`;
const mod = modules[key];
if (!mod) throw new Error(`Config introuvable : ${key}`);

export const site: Site = mod.default;
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
