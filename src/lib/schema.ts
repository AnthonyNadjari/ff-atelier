/**
 * Schema du site client — source de verite unique.
 * Un site = un fichier sites/<slug>/site.config.ts qui exporte `defineSite({...})`.
 * Tout ce qui est affiche vient d'ici. Rien n'est invente par les composants :
 * pas de faux chiffres, pas de faux avis. Si une donnee manque, la section s'adapte ou disparait.
 */
import { z } from 'zod';

export const DIRECTIONS = [
  'atelier', // chaleureux, artisanal, serif Fraunces, papier
  'brut', // brutaliste, noir/blanc, Space Grotesk, traits epais, marquee
  'luxe', // sombre, or, Cormorant, lent, precieux
  'journal', // editorial, Playfair, colonnes, filets fins
  'neon', // sombre, degrades lumineux, Unbounded/Syne, tres anime
  'clair', // blanc, Manrope, arrondi, ombres douces, tech propre
  'terre', // vert/ocre, Lora/Nunito, formes organiques
  'signal', // couleur franche, Archivo Black, urgence, gros numero de telephone
] as const;
export type Direction = (typeof DIRECTIONS)[number];

export const MOTION = ['none', 'subtle', 'rich'] as const;

// Variantes disponibles par section. Ajouter une variante = ajouter un fichier
// src/sections/<Type>/<variante>.astro ET l'entree ici.
export const VARIANTS = {
  nav: ['bar', 'minimal', 'split', 'floating'],
  hero: ['split', 'fullbleed', 'typographic', 'stacked', 'marquee', 'video'],
  services: ['grid', 'list', 'alternating', 'accordion', 'cards-hover', 'bento'],
  about: ['portrait', 'story', 'values', 'timeline'],
  proof: ['google', 'testimonials', 'gallery', 'before-after', 'logos', 'marquee-quotes'],
  zones: ['list', 'map', 'chips'],
  process: ['steps', 'timeline', 'numbered'],
  faq: ['accordion', 'two-columns'],
  cta: ['band', 'card', 'phone-giant'],
  contact: ['form-split', 'form-card', 'simple', 'full'],
  footer: ['columns', 'minimal', 'big-name'],
} as const;
export type SectionType = keyof typeof VARIANTS;

const img = z.object({
  src: z.string().describe('Chemin public, ex: /images/hero.webp'),
  alt: z.string(),
  caption: z.string().optional(),
});
export type Img = z.infer<typeof img>;

const md = z.string().describe('Texte, paragraphes separes par une ligne vide');

const hsl = z.object({
  h: z.number().min(0).max(360),
  s: z.number().min(0).max(100),
  l: z.number().min(0).max(100),
});

export const siteSchema = z.object({
  slug: z.string().regex(/^_?[a-z0-9-]+$/),
  lang: z.string().default('fr'),
  domain: z.string().optional().describe('ex: plomberie-martin.fr, sans https'),

  // ---- Look ----
  direction: z.enum(DIRECTIONS),
  motion: z.enum(MOTION).default('subtle'),
  accent: hsl.optional().describe("Surcharge la couleur d'accent de la direction (HSL)"),
  layout: z
    .object({
      nav: z.enum(VARIANTS.nav).default('bar'),
      hero: z.enum(VARIANTS.hero).default('split'),
      sections: z
        .array(
          z.object({
            type: z.enum(['services', 'about', 'proof', 'zones', 'process', 'faq', 'cta', 'contact']),
            variant: z.string(),
          }),
        )
        .default([
          { type: 'services', variant: 'grid' },
          { type: 'about', variant: 'portrait' },
          { type: 'proof', variant: 'google' },
          { type: 'zones', variant: 'list' },
          { type: 'faq', variant: 'accordion' },
          { type: 'cta', variant: 'band' },
          { type: 'contact', variant: 'form-split' },
        ]),
      footer: z.enum(VARIANTS.footer).default('columns'),
    })
    .default({}),

  // ---- Entreprise ----
  business: z.object({
    name: z.string(),
    trade: z.string().describe('Metier affiche, ex: Plombier-chauffagiste'),
    tagline: z.string().describe('Accroche courte du hero'),
    description: md.describe('2-4 phrases, pour le hero et le SEO'),
    since: z.number().int().optional().describe('Annee de creation — affichee seulement si fournie'),
    legalForm: z.string().optional(),
    siret: z.string().optional(),
    tva: z.string().optional(),
    insurance: z.string().optional().describe('ex: Assurance decennale AXA n 123'),
    certifications: z.array(z.string()).default([]).describe('RGE, Qualibat, ...'),
  }),

  contact: z.object({
    phone: z.string().describe('Format international +33612345678'),
    phoneDisplay: z.string().describe('Format affiche 06 12 34 56 78'),
    email: z.string().email(),
    whatsapp: z.string().optional().describe('Numero international sans +, ex 33612345678'),
    address: z.object({
      street: z.string().optional(),
      postalCode: z.string(),
      city: z.string(),
    }),
    mapsUrl: z.string().url().optional().describe('Lien fiche Google Maps'),
    mapsEmbed: z.string().optional().describe("URL src de l'iframe Google Maps embed"),
    hours: z.array(z.object({ days: z.string(), hours: z.string() })).default([]),
    emergency24h: z.boolean().default(false),
  }),

  zones: z
    .object({
      radiusKm: z.number().optional(),
      cities: z.array(z.string()).default([]),
      label: z.string().optional().describe('ex: Toute la metropole lilloise'),
    })
    .default({}),

  services: z
    .array(
      z.object({
        slug: z.string().regex(/^_?[a-z0-9-]+$/),
        title: z.string(),
        short: z.string().describe('1 phrase pour les cartes'),
        description: md.optional().describe('Texte long pour la page service'),
        bullets: z.array(z.string()).default([]),
        icon: z.string().default('Wrench').describe("Nom d'icone lucide, PascalCase"),
        image: img.optional(),
        featured: z.boolean().default(false),
        priceFrom: z.string().optional().describe('ex: "a partir de 90 EUR" — seulement si le client le veut'),
      }),
    )
    .min(1),

  about: z.object({
    title: z.string().optional(),
    story: md,
    portrait: img.optional(),
    team: z.array(z.object({ name: z.string(), role: z.string(), photo: img.optional() })).default([]),
    values: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
    milestones: z.array(z.object({ year: z.string(), text: z.string() })).default([]),
  }),

  proof: z
    .object({
      google: z.object({ rating: z.number().min(0).max(5), count: z.number().int(), url: z.string().url() }).optional(),
      testimonials: z
        .array(
          z.object({
            author: z.string(),
            text: z.string(),
            source: z.string().describe('Google, Pages Jaunes, e-mail... obligatoire : un avis a une origine'),
            date: z.string().optional(),
            city: z.string().optional(),
          }),
        )
        .default([]),
      logos: z.array(z.object({ name: z.string(), image: img.optional() })).default([]),
      gallery: z.array(img).default([]),
      beforeAfter: z.array(z.object({ before: img, after: img, caption: z.string().optional() })).default([]),
    })
    .default({}),

  process: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
  faq: z.array(z.object({ q: z.string(), a: md })).default([]),

  social: z
    .object({
      instagram: z.string().url().optional(),
      facebook: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      tiktok: z.string().url().optional(),
    })
    .default({}),

  form: z
    .object({
      provider: z.enum(['web3forms', 'mailto', 'none']).default('mailto'),
      accessKey: z.string().optional().describe('Cle Web3Forms (gratuit, 250 mails/mois)'),
      subject: z.string().optional(),
      successMessage: z.string().default('Merci, votre demande est bien envoyee. Nous vous rappelons rapidement.'),
    })
    .default({}),

  images: z
    .object({
      hero: img.optional(),
      heroVideo: z.string().optional().describe("Chemin public d'un mp4 muet, variante hero video"),
      logo: img.optional(),
      og: z.string().optional(),
    })
    .default({}),

  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).default([]),
    })
    .default({}),

  legal: z
    .object({
      owner: z.string().optional().describe('Nom du responsable de publication'),
      host: z.string().default('Cloudflare, Inc. — 101 Townsend St, San Francisco, CA 94107, USA'),
      mediator: z.string().optional(),
    })
    .default({}),

  analytics: z
    .object({
      plausible: z.string().optional().describe('domaine plausible'),
      umami: z.object({ src: z.string().url(), id: z.string() }).optional(),
    })
    .default({}),
});

export type SiteInput = z.input<typeof siteSchema>;
export type Site = z.output<typeof siteSchema>;

/** A utiliser dans sites/<slug>/site.config.ts : `export default defineSite({...})` */
export function defineSite(input: SiteInput): Site {
  const parsed = siteSchema.safeParse(input);
  if (!parsed.success) {
    const lines = parsed.error.issues.map((i) => `  - ${i.path.join('.') || '(racine)'} : ${i.message}`);
    throw new Error(`site.config.ts invalide :\n${lines.join('\n')}`);
  }
  for (const s of parsed.data.layout.sections) {
    const ok = (VARIANTS[s.type] as readonly string[]).includes(s.variant);
    if (!ok) {
      throw new Error(
        `layout.sections : variante "${s.variant}" inconnue pour "${s.type}". Choix : ${VARIANTS[s.type].join(', ')}`,
      );
    }
  }
  return parsed.data;
}
