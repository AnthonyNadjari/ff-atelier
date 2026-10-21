/**
 * Schema du site client — source de verite unique.
 * Un site = un fichier sites/<slug>/site.config.ts qui exporte `defineSite({...})`.
 * Tout ce qui est affiche vient d'ici. Rien n'est invente par les composants :
 * pas de faux chiffres, pas de faux avis. Si une donnee manque, la section s'adapte ou disparait.
 */
import { z } from 'zod';
import { FONT_NAMES } from './fonts';
import { ARCHITECTURE_IDS, completerLayout } from './architectures';

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
  // Styles reels (veille 2a quater, 17 oct 2026) : chaque direction reprend le style complet d'un vrai site,
  // source dans meta.ts et docs/veille/styles/INDEX.md.
  'cobalt', // ivoire, aplats bleu cobalt, capitales serrees, texte machine a ecrire (boulangerie de quartier)
  'sapin', // blanc et un seul vert sapin, capitales condensees grasses (comptoir de boucher)
  'affiche', // rayonnage d'epicerie : filets noirs, rouge etiquette, capitales condensees, zero arrondi
  'prune', // rose poudre et prune en bandes, serif contraste en capitales (decoratrices)
  'huile', // creme et une seule encre rouge, serif de lecture en grand corps (domaine familial)
  'releve', // releve d'architecte : blanc, noir, beton, croix de repere, texte mono
  'arche', // blanc et pierre, grille de quatre colonnes au filet, serif condense fin (studio d'interieur)
  'labo', // blanc et bleu roi, cases filetees, capitales legeres, boutons mono (fermentation)
  'citron', // jaune citron pale en damier avec les photos, serif fin, etiquettes mono (atelier de cuisine)
  // ff melanger : directions générées (src/directions/m-<hash>/), une par site ; écrites et retirées par la commande.
  'm-e7e9e8', // mélange de prospect-epi-dor-b
  'm-751d7c', // mélange de prospect-epi-dor-c
  'm-cca519', // mélange de prospect-epi-dor-d
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
  'carte', // carte de visite d un ecran : photo du client en carte, panneau utile pose dessus (architecture carte-de-visite)
  'index-projets', // l accueil EST l index des realisations : filtres par type, defile ou grille, reglages en marge (architecture index-projets)
  'lieu-fixe', // ecran partage : le lieu (photo, ouvert / ferme, adresse) reste fixe a droite, la carte et l histoire defilent a gauche (architecture lieu-fixe)
  'panneaux', // panneaux pleine hauteur cote a cote qui glissent vers la gauche, tranche fixe (nom + progression) a droite ; vertical au telephone (architecture panneaux-tranche)
  'carnet', // carnet feuillete de gauche a droite : chapitres poses librement sur une bande, rail fixe a gauche ; vertical au telephone (architecture carnet-horizontal)
  'livre', // pages composees comme un livre : couverture photo, puis un ecran par idee (architecture livre-ecrans)
  'cartes-agenda', // en-tete a porte Agenda, cartes de couleur empilees par activite, puis prochains rendez-vous et nouvelles (architecture cartes-empilees-agenda)
  'cadre', // tout le site dans un cadre de couleur fixe : premier ecran colle au fond, feuille qui monte dessus (architecture cadre-couleur)
  'scenes', // slides + barre fine fixe (nom, metier a ville, telephone, menu) et scene d ouverture sur aplat d encre ; scene epinglee des espaces du lieu (architecture scenes-epinglees)
  'vitrine', // accueil d un ecran = la gamme en piste horizontale manuelle, barre fixe a bouton Menu plein ecran, une page par produit (architecture gamme-vitrine)
] as const;
export const HEADINGS = ['auto', 'center', 'left'] as const;

// Variantes disponibles par section. Ajouter une variante = ajouter un fichier
// src/sections/<Type>/<variante>.astro ET l'entree ici.
export const VARIANTS = {
  nav: ['bar', 'minimal', 'split', 'floating', 'burger', 'dock'],
  hero: ['split', 'fullbleed', 'typographic', 'stacked', 'marquee', 'video'],
  services: ['grid', 'list', 'alternating', 'accordion', 'cards-hover', 'bento', 'photo-cards', 'portes', 'carte-prix', 'cartes-empilees', 'liste-a-filets', 'cartes-couleur'],
  about: ['portrait', 'story', 'values', 'timeline', 'overlap', 'ecran-texte-photo', 'espaces', 'equipe-cartes'],
  proof: ['google', 'testimonials', 'gallery', 'before-after', 'logos', 'marquee-quotes', 'citations'],
  zones: ['list', 'map', 'chips'],
  process: ['steps', 'timeline', 'numbered', 'horizon'],
  faq: ['accordion', 'two-columns'],
  cta: ['band', 'card', 'phone-giant', 'photo'],
  contact: ['form-split', 'form-card', 'simple', 'full', 'ecran'],
  footer: ['columns', 'minimal', 'big-name'],
} as const;
export type SectionType = keyof typeof VARIANTS;

const img = z.object({
  src: z.string().describe('Chemin public, ex: /images/hero.webp'),
  alt: z.string(),
  caption: z.string().optional(),
});
export type Img = z.infer<typeof img>;

/**
 * Réalisation de la galerie (proof/gallery) : une photo + quatre métadonnées optionnelles, toutes
 * fournies par le client (docs/BRIEF.md § 8), jamais devinées — absente = non affichée. Geste 5 des
 * démontages (docs/veille/demontages/INDEX.md : KS Architectes, Artisans de Genève, Mathilde De Chiara).
 */
const realisation = img.extend({
  place: z.string().optional().describe('Lieu de la réalisation : ville ou quartier (« Roubaix », « Vieux-Lille »). Absent = non affiché.'),
  kind: z
    .string()
    .optional()
    .describe('Type de travaux ou de pièce (« Cuisine », « Escalier ») : sert de filtre dans proof/gallery dès que deux types distincts existent. Absent = non affiché.'),
  size: z.string().optional().describe('Mesure réelle donnée par le client : « 12 m² », « 2 jours », « 4 m de linéaire ». Absent = non affiché.'),
  client: z
    .string()
    .optional()
    .describe('Initiales ou prénom du client (« M. L. », « Sophie »), avec son accord ; jamais un nom complet sans accord écrit. Absent = non affiché.'),
});
export type Realisation = z.infer<typeof realisation>;

const md = z.string().describe('Texte, paragraphes separes par une ligne vide');

/** Article de la rubrique conseils (src/lib/conseils.ts, src/pages/conseils/). */
const conseil = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Date de publication AAAA-MM-JJ, donnée par le client'),
  summary: z.string().describe("Une ou deux phrases : la carte de la liste et la meta description"),
  body: md,
  image: img.optional().describe("Photo du client (chantier, atelier) ; absente = pas d'image, jamais une photo de banque présentée comme la sienne"),
});
export type Conseil = z.infer<typeof conseil>;

/** Couleur ecrite par le client : hex #rrggbb ou oklch(L C H) (meme expression que COULEUR_RE de src/lib/couleur.ts, qui en choisit l'encre). */
const couleur = z.string().regex(/^(#[0-9a-f]{6}|oklch\(\s*\d*\.?\d+%?\s+\d*\.?\d+\s+\d*\.?\d+(?:deg)?\s*\))$/i, 'couleur : hex #rrggbb ou oklch(L C H)');

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
      architecture: z
        .enum(ARCHITECTURE_IDS)
        .optional()
        .describe(
          "Architecture entiere tiree d'un vrai site (src/lib/architectures.ts, docs/veille/architectures/INDEX.md) : coquille, nav, hero, pied, ordre des sections de l'accueil, tiroir de contact, gabarit des pages. Chaque reglage de layout que le site ne precise pas en prend la valeur ; un reglage ecrit gagne toujours. Se choisit sur les DONNEES du client (donneesManquantes), jamais deux fois de suite. Absent = reglages par defaut du schema (le deroule long, a eviter : docs/GOUT.md § 0).",
        ),
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
      pageAPropos: z
        .boolean()
        .default(false)
        .describe("Page /a-propos a deux colonnes (portrait + contact | nom, metier, histoire, valeurs ; src/pages/a-propos/[...index].astro), liee depuis la coquille index-projets : l'histoire et le contact sortent de l'accueil. false = pas de page."),
      servicePage: z
        .enum(['fiche', 'porte', 'livre'])
        .default('fiche')
        .describe(
          "Gabarit des pages /services/<slug>. 'fiche' (defaut) : texte et photo cote a cote, autres services en carte. 'porte' (architecture accueil-portes, src/components/ServicePorte.astro) : page courte a la meme grammaire pour chaque activite, grande photo, nom, labels (business.certifications), phrase, photos du service en grille (services[].images), bouton, questions de la page (faq[].service), adresse et horaires. 'livre' (architecture livre-ecrans, src/components/ServiceLivre.astro) : la page en ecrans successifs, en-tete d'un ecran sur la photo, texte et photo decales, photos du service, lignes, questions, puis le contact de la page.",
        ),
      curtain: z.boolean().default(false).describe("Rideau plein écran à l'ouverture (motion 'rich'). Désactivé par défaut depuis le 16 oct 2026 : signe IA générique (docs/GOUT.md § 2) ; ff ia alerte quand il est actif."),
      contactDrawer: z
        .boolean()
        .default(false)
        .describe(
          "Contact en tiroir : un dialog natif (formulaire + coordonnées) ouvert par tout lien href=\"#contact\" (nav, CTA, bandeau). La section contact finale reste possible en plus ; sans section contact dans le layout, le tiroir est la seule porte et la nav reçoit un lien Contact. Métiers d'urgence (plombier, couvreur, serrurier) — voir docs/CONVENTIONS.md § Coquilles",
        ),
      actionBar: z
        .boolean()
        .default(false)
        .describe(
          "Barre d'actions collée en bas de l'écran sur téléphone (< 768 px) : 2 à 4 portes de actions() (Réserver, Commander, Bon cadeau, Devis, Appeler), au-dessus de la barre iPhone (safe-area), cachée quand le pied de page est visible. src/components/BarreActions.astro, rendue par Base.astro. Commerces et restaurants. Ignorée avec nav 'dock' (déjà une barre basse) pour qu'un look dock reste applicable par ff modele/propositions.",
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
    email: z.string().email().optional().describe("E-mail de contact. Absent = rien d’affiché (pas d’adresse inventée) ; obligatoire si form.provider vaut 'mailto'."),
    whatsapp: z.string().optional().describe('Numero international sans +, ex 33612345678'),
    address: z.object({
      street: z.string().optional(),
      postalCode: z.string(),
      city: z.string(),
    }),
    mapsUrl: z.string().url().optional().describe('Lien fiche Google Maps'),
    // Portes d'action par intention (docs/veille/demontages/INDEX.md geste 2) : lues par actions()
    // (src/lib/actions.ts) pour les navs et la barre d'actions. Jamais devinées : un lien absent du brief
    // reste absent, la porte n'apparaît pas.
    bookingUrl: z
      .string()
      .url()
      .optional()
      .describe("Lien de réservation en ligne du client (Zenchef, TheFork, Planity, son propre outil…). Porte « Réserver » dans la nav et la barre d'actions. Jamais deviné : absent si le brief ne le donne pas."),
    orderUrl: z
      .string()
      .url()
      .optional()
      .describe("Lien de commande en ligne / click & collect. Porte « Commander ». Jamais deviné : absent si le brief ne le donne pas."),
    giftCardUrl: z
      .string()
      .url()
      .optional()
      .describe("Lien d'achat d'un bon cadeau en ligne. Porte « Bon cadeau ». Jamais deviné : absent si le brief ne le donne pas."),
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
        images: z
          .array(img)
          .default([])
          .describe("Photos supplementaires de ce service fournies par le client (chantiers, lieu, produits) : grille de sa page en gabarit 'porte' (layout.servicePage). Vide = pas de grille ; jamais une photo de banque presentee comme la sienne."),
        lignes: z
          .array(
            z.object({
              nom: z.string().describe('Intitule de la ligne de carte ou de tarif (« Crepe beurre sucre », « Coupe homme »)'),
              prix: z.string().optional().describe('Prix tel que le client le donne (« 6,50 € », « a partir de 25 € ») ; absent = ligne sans prix, jamais devine'),
              detail: z.string().optional().describe('Ingredients, duree ou precision courte donnee par le client'),
            }),
          )
          .default([])
          .describe("Lignes a prix de cette rubrique (carte d'un cafe, tarifs d'un salon) : services/carte-prix les aligne avec des pointilles. Vide = la rubrique montre ses bullets. Jamais un prix invente."),
        featured: z.boolean().default(false),
        priceFrom: z.string().optional().describe('ex: "a partir de 90 EUR" — seulement si le client le veut'),
        couleur: couleur
          .optional()
          .describe("Couleur de cette activite, donnee par le client (devanture, logo, emballage ; architecture cadre-couleur, docs/veille/architectures/meyers.md) : hex #rrggbb ou oklch(L C H). Posee sur sa carte (services/cartes-couleur) et sur l'en-tete de sa page, avec une encre choisie par contraste (src/lib/couleur.ts). Absente = tokens de la direction, rien ne change. Jamais devinee."),
      }),
    )
    .min(1),

  about: z.object({
    title: z.string().optional(),
    story: md,
    portrait: img.optional(),
    team: z.array(z.object({ name: z.string(), role: z.string(), photo: img.optional() })).default([]),
    espaces: z
      .array(
        z.object({
          nom: z.string().describe('Nom de l’espace tel que le client le dit (« La terrasse », « Le fournil », « L’atelier de finition »)'),
          phrase: z.string().describe('Une phrase sur cet espace, ecrite depuis le brief'),
          photo: img.optional().describe('Photo de cet espace, celle du client ; absente = panneau de couleur seul, jamais une photo de banque'),
          couleur: couleur.optional().describe('Couleur du panneau de cet espace (hex #rrggbb ou oklch(L C H)), si le client en a une ; absente = teintes des tokens de la direction'),
        }),
      )
      .default([])
      .describe("Espaces du lieu qu'on visite (salle, terrasse, fournil, atelier ; architecture scenes-epinglees, docs/veille/architectures/tab-kitchen.md) : un panneau de couleur par espace dans la scene epinglee about/espaces. Vide = pas de scene. Jamais un espace invente."),
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
      gallery: z.array(realisation).default([]).describe('Photos de réalisations avec lieu / type / mesure / client optionnels (proof/gallery filtre par `kind`)'),
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
  faq: z
    .array(
      z.object({
        q: z.string(),
        a: md,
        service: z
          .string()
          .optional()
          .describe("Slug du service auquel la question se rattache : elle s'affiche aussi sur sa page en gabarit 'porte' (layout.servicePage). Absent = question generale seulement."),
      }),
    )
    .default([]),

  realisations: z
    .array(
      z.object({
        slug: z.string().regex(/^[a-z0-9-]+$/),
        title: z.string().describe('Nom du chantier donne par le client (« Maison de ville, Croix »)'),
        place: z.string().optional().describe("Ville ou quartier du chantier, jamais l'adresse d'un particulier. Absent = non affiche."),
        kind: z.string().optional().describe("Type de projet (« Cuisine », « Escalier ») : filtre de l'index (coquille index-projets) des deux types distincts. Absent = non affiche."),
        size: z.string().optional().describe('Mesure reelle donnee par le client (« 14 m² », « 3 semaines »). Absent = non affiche.'),
        year: z.string().optional().describe('Annee du chantier, donnee par le client. Absent = non affichee.'),
        text: md.optional().describe('Quelques lignes du client : la demande, ce qui a ete fait. Absent = page sans texte, jamais un texte invente.'),
        photos: z.array(img).min(1).describe('Serie de photos du chantier, celles du client ; la premiere sert de vignette dans l index.'),
        credit: z.string().optional().describe('Photographe a crediter si le client le demande. Absent = non affiche.'),
      }),
    )
    .default([])
    .describe(
      "Realisations du client, une page chacune (/realisations/<slug>, src/pages/realisations/[slug].astro) : l'index de la coquille index-projets en fait ses vignettes, filtrables par kind. Vide = pas de page ; l'index retombe sur proof.gallery (photos sans page). Jamais un chantier invente.",
    ),

  conseils: z
    .array(conseil)
    .default([])
    .describe(
      "Articles du client (conseils, actualités du métier) : page /conseils + une page par article + lien dans la nav, seulement s'il y en a. Vu sur 5 sites qui vendent sur 9 (docs/veille/marche/CE-QUI-VEND.md). Matière du client uniquement (écrite, dictée, réponse qu'il donne souvent au téléphone) : jamais un article rédigé sans elle.",
    ),

  agenda: z
    .array(
      z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Date du rendez-vous AAAA-MM-JJ, donnee par le client'),
        heure: z.string().optional().describe('Horaire tel que le client le donne (« 18 h – 20 h », « à partir de 10 h »). Absent = non affiche.'),
        titre: z.string().describe('Nom du rendez-vous donne par le client (« Atelier fabrication d’un tabouret », « Marché de Noël »)'),
        categorie: z.string().optional().describe('Categorie du rendez-vous (« Stage », « Dégustation », « Marché ») : filtre de la page /agenda des deux categories distinctes. Absente = non affichee.'),
        lieu: z.string().optional().describe('Lieu si ce n’est pas l’adresse du client. Absent = non affiche.'),
        texte: z.string().optional().describe('Une ou deux phrases du client sur le rendez-vous. Absent = non affiche.'),
        lien: z.string().url().optional().describe('Lien d’inscription ou de billetterie du client. Absent = « Réserver » mène au contact.'),
        image: img.optional().describe('Photo du client pour ce rendez-vous ; absente = carte sans image.'),
      }),
    )
    .default([])
    .describe(
      "Rendez-vous dates du client (stages, marches, degustations, soirees ; architecture cartes-empilees-agenda, docs/veille/architectures/groene-afslag.md) : bloc « prochains rendez-vous » de l'accueil + page /agenda filtrable par categorie + lien « Agenda » dans la nav. Les dates passees sont retirees au build (src/lib/agenda.ts) : reconstruire le site quand l'agenda change. Vide (ou tout passe) = ni bloc, ni page, ni lien. Jamais un rendez-vous invente.",
    ),

  produits: z
    .array(
      z.object({
        slug: z.string().regex(/^[a-z0-9-]+$/),
        nom: z.string().describe('Nom du produit tel que le client le vend (« Confiture d’abricot », « Savon au lait d’ânesse »)'),
        photo: img.describe('Photo du produit, celle du client, detouree de preference (fond transparent ou uni) : la vitrine la pose sur le fond de la direction, la fiche sur les lettres du titre. Jamais une photo de banque.'),
        detoure: z.boolean().default(false).describe("La photo est detouree (fond transparent) : la vitrine l'incline et lui donne une ombre portee, la fiche la pose devant les lettres. Faux (defaut) = photo rectangulaire : posee droite, sans ombre, sous le titre (une photo rectangulaire inclinee avec une ombre est la vignette polaroid refusee par docs/GOUT.md § 2)."),
        categorie: z.string().optional().describe('Famille du produit (« Confitures », « Pestos ») : regroupe la liste /produits des deux familles distinctes. Absente = non affichee.'),
        formats: z.array(z.string()).default([]).describe('Formats ou poids proposes (« 250 g », « 1 kg ») : pastilles rondes de la fiche. Vide = non affiches.'),
        composition: z.string().optional().describe('Ingredients ou composition tels que le client les donne. Absente = non affichee, jamais devinee.'),
        conservation: z.string().optional().describe('Conservation donnee par le client (« 36 mois a l’abri de la lumiere », « 5 jours au frais »). Absente = non affichee.'),
        conseils: z.string().optional().describe('Conseils d’usage ou de degustation du client (« a tartiner sur du pain grille »). Absents = colonne absente de la fiche.'),
        prix: z.string().optional().describe('Prix tel que le client le donne (« 6,50 € », « a partir de 4 € ») ; absent = fiche sans prix et JSON-LD Product sans offre, jamais devine.'),
        description: z.string().optional().describe('Une ou deux phrases du client sur le produit. Absente = non affichee.'),
        photos: z.array(img).default([]).describe('Photos d’ambiance du client (le produit en situation, l’atelier) : piste aimantee de la fiche. Vide = pas de piste.'),
      }),
    )
    .default([])
    .describe(
      "Gamme du client (architecture gamme-vitrine, docs/veille/architectures/agrumea.md) : l'accueil de la coquille vitrine EST cette gamme en piste horizontale manuelle, chaque produit a sa page /produits/<slug> (JSON-LD Product), la liste /produits les regroupe par famille, lien « Produits » dans la nav. Vide = ni accueil-gamme (la coquille le dit au build), ni page, ni lien. Jamais un produit invente.",
    ),

  partenaires: z
    .array(
      z.object({
        metier: z.string().describe('Métier du partenaire (« Céramiste », « Ferronnier »)'),
        nom: z.string().describe('Nom du partenaire tel que le client le donne'),
        lien: z.string().url().optional().describe('Site du partenaire, avec son accord. Absent = nom sans lien.'),
      }),
    )
    .default([])
    .describe(
      "Artisans avec qui le client travaille (« autour de moi », architecture carnet-horizontal, docs/veille/architectures/gingko.md) : chapitre de la coquille carnet. Vide = pas de chapitre. Noms donnes par le client, jamais devines.",
    ),

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
      ctaText: z.string().optional().describe('Phrase sous le titre du CTA. Par défaut, une phrase sans donnée (le téléphone seulement) : le « intervention sous 48 h » d’avant le 17 oct 2026 était un délai que le brief ne donnait pas. Écrire la vraie phrase du client.'),
      faqTitle: z.string().optional().describe('Titre de la section FAQ, propre au client (ex. « Avant de passer à la boutique »). Absent = titre par défaut de la variante, générique : à éviter (docs/GOUT.md § 5).'),
      servicesTitle: z.string().default('Nos services').describe('Titre de la section services (src/sections/Services/*), propre au client (ex. « Au comptoir », « Ce qu’on répare »). Le défaut « Nos services » est générique : à remplacer (docs/GOUT.md § 5).'),
      processTitle: z.string().default('Notre méthode').describe('Titre de la section process (src/sections/Process/*), propre au client (ex. « Du devis au chantier »). Défaut générique « Notre méthode » : à remplacer.'),
      galleryTitle: z.string().default('En images').describe('Titre de la galerie (proof/gallery), ex. « L’atelier, la cave ». Défaut générique « En images ».'),
      beforeAfterTitle: z.string().default('La transformation').describe('Titre de la section avant/après (proof/before-after), ex. « Salle de bains, rue Nationale ». Défaut générique « La transformation ».'),
      logosTitle: z.string().default('Certifications et garanties').describe('Titre de la rangée de labels (proof/logos), ex. « Qualibat, RGE ». Défaut « Certifications et garanties ».'),
      contactTitle: z.string().default('Parlons de votre projet'),
      agenda: z.string().default('Agenda').describe('Libellé de la porte et de la page des rendez-vous (site.agenda) : « Agenda », « Les rendez-vous de l’atelier »'),
      produits: z.string().default('Produits').describe('Libellé du lien de nav et titre de la page /produits (site.produits) : « Produits », « La gamme », « Nos confitures »'),
      conseils: z.string().default('Conseils').describe('Libellé de la rubrique articles dans la nav et titre de /conseils (« Conseils », « Le carnet de l’atelier »)'),
      contactText: z.string().default('Décrivez votre besoin, nous vous rappelons rapidement.'),
      actions: z
        .object({
          booking: z.string().optional().describe('Libellé de la porte « Réserver » (contact.bookingUrl), ex. « Réserver une table »'),
          order: z.string().optional().describe('Libellé de la porte « Commander » (contact.orderUrl), ex. « Click & collect »'),
          giftCard: z.string().optional().describe('Libellé de la porte « Bon cadeau » (contact.giftCardUrl)'),
          quote: z.string().optional().describe('Libellé de la porte « Devis » (#contact) ; absent = wording.devis'),
        })
        .prefault({})
        .describe("Libellés des portes d'action rendues par actions() (src/lib/actions.ts) : nav et barre d'actions (layout.actionBar)"),
    })
    .prefault({}),

  images: z
    .object({
      hero: img.optional(),
      heroVideo: z.string().optional().describe("Chemin public d'un mp4 muet, variante hero video"),
      heroVideoPoster: z.string().optional().describe("Chemin public de l'image affichée avant et à la place de heroVideo (poster.jpg de ff video) ; à défaut images.hero. Sans aucun des deux, la vidéo n'est pas rendue (iPhone en économie d'énergie bloque l'autoplay)"),
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
      host: z
        .string()
        .default('Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis, +1 (650) 319-8930')
        .describe("Hébergeur affiché dans les mentions légales : nom, adresse ET téléphone (LCEN art. 1-1). Défaut = Cloudflare, coordonnées relevées sur cloudflare.com/website-terms le 20 oct 2026."),
      mediator: z.string().optional(),
      prospect: z.boolean().default(false).describe("Démo PRIVÉE faite pour un vrai commerce qu’on prospecte (ses données publiques, ses photos) : tout le site est en noindex, robots.txt interdit tout, rien n’entre dans un sitemap. Jamais montrée à un autre que lui ; supprimée s’il dit non (17 oct 2026)."),
      demo: z.boolean().default(false).describe("Site de démonstration (client inventé) : l’avis « aucun client derrière » s’affiche une fois en pied de page et remplace l’identité légale dans les mentions légales (relecture /site-final du 16 oct 2026 : une démo qui ne le dit pas a l’air d’un vrai commerce)."),
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
  // layout.architecture : les reglages de layout absents prennent ceux de l'architecture (src/lib/architectures.ts).
  const parsed = siteSchema.safeParse(input && input.layout ? { ...input, layout: completerLayout(input.layout as Record<string, unknown>) } : input);
  if (!parsed.success) {
    const lines = parsed.error.issues.map((i) => `  - ${i.path.join('.') || '(racine)'} : ${i.message}`);
    throw new Error(`site.config.ts invalide :\n${lines.join('\n')}`);
  }
  if (parsed.data.form.provider === 'mailto' && !parsed.data.contact.email) {
    throw new Error("site.config.ts invalide :\n  - contact.email : obligatoire avec form.provider 'mailto' (sinon form: { provider: 'none' })");
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
