/**
 * Schema du site client — source de verite unique.
 * Un site = un fichier sites/<slug>/site.config.ts qui exporte `defineSite({...})`.
 * Tout ce qui est affiche vient d'ici. Rien n'est invente par les composants :
 * pas de faux chiffres, pas de faux avis. Si une donnee manque, la section s'adapte ou disparait.
 */
import { z } from 'zod';
import { FONT_NAMES } from './fonts';

export const DIRECTIONS = [
  'atelier', // chaleureux, artisanal, serif Fraunces, papier
  'brut', // brutaliste, noir/blanc, Space Grotesk, traits epais, marquee
  'luxe', // sombre, or, Cormorant, lent, precieux
  'journal', // editorial, Playfair, colonnes, filets fins
  'neon', // sombre, degrades lumineux, Unbounded/Syne, tres anime
  'clair', // blanc, Manrope, arrondi, ombres douces, tech propre
  'terre', // vert/ocre, Lora/Nunito, formes organiques
  'signal', // couleur franche, Archivo Black, urgence, gros numero de telephone
  'nuit', // bleu nuit + blanc chaud, calme, hotels/restaurants/bien-etre
  'pop', // blocs de couleurs vives, ludique, boulangerie/enfants/evenementiel
  'pierre', // gris mineral, minimal, Bodoni, architectes/macons/pierre
  'retro', // creme/orange/brun seventies, arrondi, barbiers/vintage/cafes
  'nordique', // pale, aere, beaucoup de blanc, scandinave, decoration/menuiserie
  'encre', // noir encre sur papier, trait dessine, tatoueurs/illustrateurs/artisans d art
  'industriel', // beton, acier, orange securite, Bebas, garages/metallerie/BTP
  'mediterranee', // terracotta, bleu mer, blanc chaux, restaurants/ceramistes/immobilier sud
  'eclipse', // noir encre, blanc froid, argent, Space Grotesk serre, epure futuriste, studios/horlogers/opticiens
] as const;
export type Direction = (typeof DIRECTIONS)[number];

export const MOTION = ['none', 'subtle', 'rich'] as const;
export const SCALES = ['compact', 'normal', 'display'] as const;
export const DIVIDERS = ['none', 'wave', 'diagonal', 'curve', 'rule', 'zigzag'] as const;
export const TONES = ['flat', 'alternate'] as const;
// Coquille de page : la disposition globale, independante des sections.
export const SHELLS = [
  'flow', // colonne classique : nav en haut, hero, sections empilees
  'split', // panneau lateral fixe (nom, nav, telephone) + contenu qui defile a droite
  'sidebar', // rail vertical etroit a gauche, contenu large
  'slides', // chaque section occupe l ecran, defilement aimante
  'magazine', // largeurs et decalages alternes, grille asymetrique
  'sticky-hero', // hero epingle, les sections glissent par-dessus
  'index', // site-index : le menu EST la page, liste geante d entrees depliables, hero reduit a une ligne d identite
] as const;
export const HEADINGS = ['auto', 'center', 'left'] as const;

// Variantes disponibles par section. Ajouter une variante = ajouter un fichier
// src/sections/<Type>/<variante>.astro ET l'entree ici.
export const VARIANTS = {
  nav: ['bar', 'minimal', 'split', 'floating', 'burger', 'dock'],
  hero: ['split', 'fullbleed', 'typographic', 'stacked', 'marquee', 'video'],
  services: ['grid', 'list', 'alternating', 'accordion', 'cards-hover', 'bento'],
  about: ['portrait', 'story', 'values', 'timeline'],
  proof: ['google', 'testimonials', 'gallery', 'before-after', 'logos', 'marquee-quotes'],
  zones: ['list', 'map', 'chips'],
  process: ['steps', 'timeline', 'numbered', 'horizon'],
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
  smoothScroll: z.boolean().default(false).describe('Active Lenis (scroll fluide, data-smooth), tier motion "rich" uniquement — jamais par defaut (voir docs/veille/animations.md §3 #1)'),
  servicePages: z
    .boolean()
    .default(true)
    .describe("Genere une page /services/<slug> par service (defaut). false : aucune page service n'est construite (les services restent dans le contenu), ni listee par llms.txt ou la 404 — pour un site a une seule conversion (ex. finck-fisch : /services/* redirige vers /audit)."),
  transitions: z.boolean().default(false).describe('Active <ClientRouter /> (astro:transitions) pour des transitions de page douces — opt-in, audit des scripts inline non complet (voir docs/ANIMATIONS.md § Transitions de page)'),
  accent: hsl.optional().describe("Surcharge la couleur d'accent de la direction (HSL)"),
  typography: z
    .object({
      display: z.enum(FONT_NAMES as [string, ...string[]]).optional().describe('Police des titres, remplace celle de la direction (voir src/lib/fonts.ts)'),
      body: z.enum(FONT_NAMES as [string, ...string[]]).optional().describe('Police du texte courant'),
    })
    .prefault({}),
  scale: z.enum(SCALES).default('normal').describe('compact = dense, display = titres enormes et grandes respirations'),
  layout: z
    .object({
      nav: z
        .string()
        .default('bar')
        .refine((v) => (VARIANTS.nav as readonly string[]).includes(v) || v.startsWith('custom/'), { message: `nav : variante inconnue. Choix : ${VARIANTS.nav.join(', ')} ou "custom/<nom>"` }),
      hero: z
        .string()
        .default('split')
        .refine((v) => (VARIANTS.hero as readonly string[]).includes(v) || v.startsWith('custom/'), {
          message: `hero : variante inconnue. Choix : ${VARIANTS.hero.join(', ')} ou "custom/<nom>" (sites/<slug>/sections/<Nom>.astro)`,
        })
        .describe("Variante de hero, ou 'custom/<nom>' pour un hero dessine pour ce site"),
      sections: z
        .array(
          z.object({
            type: z.enum(['services', 'about', 'proof', 'zones', 'process', 'faq', 'cta', 'contact', 'custom']),
            variant: z.string().describe("Variante partagee, ou pour type 'custom' : nom du fichier sites/<slug>/sections/<variant>.astro"),
            label: z.string().optional().describe("Libelle dans la navigation (custom uniquement) ; absent = pas d'ancre"),
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
      footer: z
        .string()
        .default('columns')
        .refine((v) => (VARIANTS.footer as readonly string[]).includes(v) || v.startsWith('custom/'), { message: `footer : variante inconnue. Choix : ${VARIANTS.footer.join(', ')} ou "custom/<nom>"` }),
      divider: z.enum(DIVIDERS).default('none').describe('Separateur decoratif entre les sections'),
      shell: z.enum(SHELLS).default('flow').describe('Disposition globale de la page (voir SHELLS)'),
      headings: z.enum(HEADINGS).default('auto').describe('Alignement force des en-tetes de section'),
      tone: z.enum(TONES).default('flat').describe('alternate = une section sur deux sur fond bg-2'),
      contactDrawer: z
        .boolean()
        .default(false)
        .describe(
          "Contact en tiroir : un dialog natif (formulaire + coordonnées) ouvert par tout lien href=\"#contact\" (nav, CTA, bandeau). La section contact finale reste possible en plus ; sans section contact dans le layout, le tiroir est la seule porte et la nav reçoit un lien Contact. Métiers d'urgence (plombier, couvreur, serrurier) — voir docs/CONVENTIONS.md § Coquilles",
        ),
    })
    .prefault({}),

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
    schemaType: z
      .string()
      .optional()
      .describe(
        "Sous-type schema.org pour le JSON-LD (ex: 'Plumber', 'HairSalon'). Absent = deduit du metier via schemaTypeForTrade(), repli 'LocalBusiness'.",
      ),
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
    mapsProvider: z
      .enum(['osm', 'google', 'none'])
      .default('osm')
      .describe("Fournisseur de carte (src/components/Carte.astro). 'osm' = tuiles OpenStreetMap statiques sans traceur (besoin de coordinates). 'google' = facade cliquable qui charge mapsEmbed au clic. 'none' = bloc adresse seul."),
    coordinates: z.object({ lat: z.number(), lng: z.number() }).optional().describe('Latitude/longitude, necessaire pour mapsProvider "osm"'),
    hours: z
      .array(
        z.object({
          days: z.string(),
          hours: z.string(),
          opens: z.string().regex(/^\d{2}:\d{2}$/).optional().describe("Heure d'ouverture HH:MM (ex: 08:00) — avec closes, le JSON-LD émet openingHoursSpecification structuré au lieu du texte libre (mieux lu par les moteurs IA)"),
          closes: z.string().regex(/^\d{2}:\d{2}$/).optional().describe('Heure de fermeture HH:MM (ex: 18:00)'),
        }),
      )
      .default([]),
    emergency24h: z.boolean().default(false),
  }),

  zones: z
    .object({
      radiusKm: z.number().optional(),
      cities: z.array(z.string()).default([]),
      label: z.string().optional().describe('ex: Toute la metropole lilloise'),
    })
    .prefault({}),

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
    .prefault({}),

  process: z
    .array(
      z.object({
        title: z.string(),
        text: z.string(),
        image: img.optional().describe("Photo de l'etape (process/horizon l'affiche a cote du numero geant) — absente = etape sans image"),
      }),
    )
    .default([]),
  faq: z.array(z.object({ q: z.string(), a: md })).default([]),

  social: z
    .object({
      instagram: z.string().url().optional(),
      facebook: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      tiktok: z.string().url().optional(),
    })
    .prefault({}),

  form: z
    .object({
      provider: z.enum(['web3forms', 'mailto', 'none', 'cloudflare']).default('mailto'),
      accessKey: z.string().optional().describe('Cle Web3Forms (gratuit, 250 mails/mois)'),
      subject: z.string().optional(),
      successMessage: z.string().default('Merci, votre demande est bien envoyee. Nous vous rappelons rapidement.'),
      turnstileSiteKey: z
        .string()
        .optional()
        .describe(
          "Cle publique Cloudflare Turnstile (dashboard Cloudflare -> Turnstile -> Add site). Affiche le widget " +
            "dans ContactForm.astro et l'autorise dans la CSP (script-src/frame-src challenges.cloudflare.com). " +
            "Verifie server-side (siteverify) uniquement par provider 'cloudflare' (env.TURNSTILE_SECRET dans " +
            'src/worker/contact.js) — avec web3forms, le jeton est soumis mais jamais verifie (web3forms sait ' +
            'valider hCaptcha, pas Turnstile) : voir docs/DEPLOIEMENT.md § Anti-spam.',
        ),
    })
    .prefault({})
    .describe(
      "provider 'cloudflare' : le formulaire poste en JSON vers /api/contact (meme origine), servi par le " +
        'Worker dist/<slug>/_worker.js (voir src/worker/contact.js, copie au build par `ff build` — ' +
        'docs/DEPLOIEMENT.md § Formulaire Cloudflare Workers + Email Routing). Aucune cle a renseigner ici : ' +
        "les bindings (EMAIL, RESEND_API_KEY) se configurent dans le dashboard Cloudflare Pages du projet.",
    ),

  wording: z
    .object({
      devis: z.string().default('Demander un devis').describe('Libelle du bouton secondaire : "Réserver", "Commander", "Prendre rendez-vous"...'),
      ctaTitle: z.string().default('Un projet, une urgence ? <em>Parlons-en.</em>').describe('Titre du bandeau CTA (HTML autorise)'),
      ctaText: z.string().optional().describe('Phrase sous le titre du CTA ; par defaut une phrase generique avec la ville'),
      contactTitle: z.string().default('Parlons de votre projet'),
      contactText: z.string().default('Décrivez votre besoin, nous vous rappelons rapidement.'),
    })
    .prefault({}),

  images: z
    .object({
      hero: img.optional(),
      heroVideo: z.string().optional().describe("Chemin public d'un mp4 muet, variante hero video"),
      logo: img.optional(),
      og: z.string().optional(),
    })
    .prefault({}),

  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).default([]),
      cityPages: z.boolean().default(false).describe('Genere une page /zones/<ville> par ville de zones.cities (SEO local)'),
    })
    .prefault({}),

  legal: z
    .object({
      owner: z.string().optional().describe('Nom du responsable de publication'),
      host: z.string().default('Cloudflare, Inc. — 101 Townsend St, San Francisco, CA 94107, USA'),
      mediator: z.string().optional(),
    })
    .prefault({}),

  analytics: z
    .object({
      plausible: z.string().optional().describe('domaine plausible'),
      umami: z.object({ src: z.string().url(), id: z.string() }).optional(),
      cloudflare: z
        .string()
        .optional()
        .describe(
          'Jeton Cloudflare Web Analytics (Cloudflare dashboard -> Analytics & Logs -> Web Analytics -> Add a site -> "beacon token"). Gratuit, sans cookie, exemption CNIL mesure d\'audience — voir docs/veille/performance.md §5.5.',
        ),
    })
    .prefault({}),
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
    if (s.type === 'custom') continue; // section propre au site, verifiee au build par le registre
    const ok = (VARIANTS[s.type] as readonly string[]).includes(s.variant);
    if (!ok) {
      throw new Error(
        `layout.sections : variante "${s.variant}" inconnue pour "${s.type}". Choix : ${VARIANTS[s.type].join(', ')}`,
      );
    }
  }
  return parsed.data;
}
