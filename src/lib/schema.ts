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
  'adresses', // premier ecran = le carnet d adresses : h1 et telephone a gauche, une colonne par lieu (photo, etat du jour, telephone) a droite ; une page par lieu (architecture pages-adresses)
  'saisons', // le temps range l accueil : en tete h1, telephone, note ; puis une colonne par saison (photo, nom geant, activites, sorties a la une) cote a cote (architecture saisons-sorties)
  'ardoise', // l accueil est l ardoise du jour : en tete h1, telephone, note ; une rangee d ardoises (horaires, programme, rendez-vous du jour, choisis dans le navigateur) posee sur la photo (architecture ardoise-du-jour)
  'tournee', // l accueil dit ou est le camion : l etape du moment (commune, repere, heures, telephone du vehicule) en tete, puis la semaine ; une page par commune (architecture tournee-semaine)
  'artistes', // l accueil est le mur des artistes du salon : en tete h1, telephone, note ; un grand portrait par artiste, filtre par style sans script ; une page par artiste (architecture artistes-residents)
  'fetes', // l accueil suit le calendrier des fetes : en tete h1, telephone, note ; la fete du moment (choisie dans le navigateur, date limite de commande), les occasions, la livraison ; une page par fete (architecture calendrier-fetes)
  'calendrier', // l accueil mene a l outil : en tete h1, telephone, note, photo ; les hotes, les avis, puis le calendrier des nuits libres lu au build (liste ou iCal) et la demande de dates (architecture outil-calendrier)
  'parcours', // l accueil est une echelle : en tete h1, telephone, note ; « ou en etes-vous ? » en onglets, un barreau par niveau (formules, compris, deroule, la suite) ; une page par barreau (architecture parcours-atelier)
  'grille', // l accueil est la grille de prix publiee : en tete h1, telephone, delai ; « quelle est votre situation ? » en onglets, le prix du creneau de l heure (jour, soiree, nuit), la grille complete, les delais par secteur ; une page par situation et /tarifs (architecture grille-urgence)
  'colis', // l accueil dit les deux chemins vers l atelier : venir ou envoyer ; le voyage du colis en piste horizontale (chez vous, la poste, l atelier, le retour), les prestations a prix, les avis ; /envoyer (architecture atelier-par-colis)
] as const;
export const HEADINGS = ['auto', 'center', 'left'] as const;

// Variantes disponibles par section. Ajouter une variante = ajouter un fichier
// src/sections/<Type>/<variante>.astro ET l'entree ici.
export const VARIANTS = {
  nav: ['bar', 'minimal', 'split', 'floating', 'burger', 'dock'],
  hero: ['split', 'fullbleed', 'typographic', 'stacked', 'marquee', 'video'],
  services: ['grid', 'list', 'alternating', 'accordion', 'cards-hover', 'bento', 'photo-cards', 'portes', 'carte-prix', 'cartes-empilees', 'liste-a-filets', 'cartes-couleur', 'saisons', 'programme'],
  about: ['portrait', 'story', 'values', 'timeline', 'overlap', 'ecran-texte-photo', 'espaces', 'equipe-cartes'],
  proof: ['google', 'testimonials', 'gallery', 'before-after', 'logos', 'marquee-quotes', 'citations'],
  zones: ['list', 'map', 'chips', 'adresses', 'tournee'],
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

/** Une ligne d'horaires (contact.hours, lieux[].hours) : jours et heures libres, opens/closes HH:MM optionnels. */
const ligneHoraire = z.object({
  days: z.string(),
  hours: z.string(),
  opens: z.string().regex(/^\d{2}:\d{2}$/).optional().describe("Heure d'ouverture HH:MM (ex: 08:00) — avec closes, le JSON-LD émet openingHoursSpecification structuré au lieu du texte libre (mieux lu par les moteurs IA)"),
  closes: z.string().regex(/^\d{2}:\d{2}$/).optional().describe('Heure de fermeture HH:MM (ex: 18:00)'),
});

/** Une ligne de carte (programme du jour, produits de tous les jours, exceptions datees ; architecture ardoise-du-jour). */
const ligneCarte = z.object({
  nom: z.string().describe('Intitule tel que le client le donne (« Pain de seigle », « Pizza du jour : poireau et chèvre »)'),
  detail: z.string().optional().describe('Garniture, ingredients ou precision courte du client. Absent = non affiche.'),
  prix: z.string().optional().describe('Prix tel que le client le donne ; absent = ligne sans prix, jamais devine'),
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
    hours: z.array(ligneHoraire).default([]),
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
        saison: z
          .string()
          .optional()
          .describe("Saison de cette activite, telle que le client la nomme (« Été », « Hiver », « Printemps ») : architecture saisons-sorties (docs/veille/architectures/saisons-sorties.md). Des deux saisons distinctes, services/saisons range les activites par saison et la nav n'a plus qu'une entree par saison. Absente = activite de toute l'annee ; aucune saison = rien ne change. Jamais devinee."),
        couleur: couleur
          .optional()
          .describe("Couleur de cette activite, donnee par le client (devanture, logo, emballage ; architecture cadre-couleur, docs/veille/architectures/meyers.md) : hex #rrggbb ou oklch(L C H). Posee sur sa carte (services/cartes-couleur) et sur l'en-tete de sa page, avec une encre choisie par contraste (src/lib/couleur.ts). Absente = tokens de la direction, rien ne change. Jamais devinee."),
        programme: z
          .array(
            z.object({
              jours: z.string().describe("Jour(s) de la semaine, tels que le client les ecrit et lus comme contact.hours (« Mardi », « Mercredi et samedi », « Du mardi au vendredi ») ; des jours illisibles = entree affichee telle quelle dans la semaine, jamais placee sur un jour devine"),
              lignes: z.array(ligneCarte).min(1).describe('Ce qui est propose ces jours-la (pains, plat du jour, pizza du jour)'),
              note: z.string().optional().describe('Precision du client (« jusqu’à épuisement », « le midi seulement »). Absente = non affichee.'),
            }),
          )
          .default([])
          .describe("Programme de la semaine de cette activite (architecture ardoise-du-jour, docs/veille/architectures/ardoise-du-jour.md) : ce qui change selon le jour (pain du mardi, plat du jour, pizza du jour). L'ardoise de l'accueil montre celui du jour, choisi DANS LE NAVIGATEUR (fuseau Europe/Paris) ; sans script, toute la semaine se lit. Page /programme et bloc sur la page de l'activite. Vide = rien. Jamais un programme invente."),
        tousLesJours: z
          .array(ligneCarte)
          .default([])
          .describe("Ce qui est propose tous les jours d'ouverture, a cote du programme (« Baguette », « Croissant ») : liste sous le programme du jour. Vide = non affichee."),
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
            barreau: z.string().optional().describe("Slug du barreau du parcours (parcours[]) dont parle l'avis, si le client le sait (« après l'initiation », « adhérente depuis trois ans ») : l'avis est montré sous ce barreau (architecture parcours-atelier). Absent = avis général."),
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

  lieux: z
    .array(
      z.object({
        slug: z.string().regex(/^[a-z0-9-]+$/).describe('Slug de la page /adresses/<slug> (« rue-breguet », « gare »)'),
        nom: z.string().describe('Nom court du lieu tel que le client le dit (« Rue Breguet », « La boutique de la gare »)'),
        address: z.object({ street: z.string().optional(), postalCode: z.string(), city: z.string() }).describe('Adresse de ce lieu (meme forme que contact.address)'),
        phone: z.string().optional().describe('Telephone propre a ce lieu, format international +33612345678 ; absent = contact.phone (jamais devine)'),
        phoneDisplay: z.string().optional().describe('Format affiche de phone (06 12 34 56 78) ; absent avec phone = phone tel quel'),
        hours: z.array(ligneHoraire).default([]).describe("Horaires de CE lieu (meme forme que contact.hours) : etat ouvert ou ferme de sa page et du bandeau des adresses (src/lib/horaires.ts). Vide = pas d'horaires affiches pour ce lieu."),
        since: z.number().int().optional().describe("Annee d'ouverture de ce lieu, donnee par le client. Absente = non affichee."),
        texte: z.string().optional().describe('Une ou deux phrases de faits propres au lieu (quartier, ce qu’on y trouve, terrasse, parking). Absent = non affiche, jamais invente.'),
        regles: z.array(z.string()).default([]).describe('Regles pratiques du lieu (« Sans réservation », « Parking dans la cour ») donnees par le client. Vide = non affichees.'),
        photo: img.optional().describe('Photo de ce lieu, celle du client ; absente = page sans photo, jamais une photo de banque'),
        photos: z.array(img).default([]).describe('Photos supplementaires du lieu (salle, comptoir, facade) : grille de sa page. Vide = pas de grille.'),
        mapsUrl: z.string().url().optional().describe('Lien Google Maps ou itineraire de ce lieu ; absent = pas de lien « Itinéraire »'),
        coordinates: z.object({ lat: z.number(), lng: z.number() }).optional().describe('Latitude/longitude du lieu (JSON-LD geo). Absentes = non emises.'),
      }),
    )
    .default([])
    .describe(
      "Adresses du client, une page chacune (/adresses/<slug>, src/pages/adresses/[slug].astro ; architecture pages-adresses, docs/veille/architectures/pages-adresses.md) : bandeau des adresses de l'accueil (zones/adresses), page /adresses qui les liste avec le formulaire, adresses au pied, nav (deux liens a deux adresses, « Nos adresses » au-dela), un LocalBusiness JSON-LD par lieu. Vide = ni page, ni bandeau, ni lien : le site garde contact.address. Jamais une adresse inventee.",
    ),

  pros: z
    .object({
      titre: z.string().describe('Titre de la page professionnels, dans les mots du client (« Restaurants et entreprises »)'),
      texte: md.describe('Ce que le client propose aux professionnels, en 2 a 4 phrases de faits (livraison, volumes, facturation)'),
      offres: z
        .array(z.object({ nom: z.string(), detail: z.string().optional() }))
        .default([])
        .describe('Offres pro en lignes (« Pain livré avant 7 h », « Café en grain, sacs de 1 kg »). Vide = pas de liste.'),
      email: z.string().email().optional().describe('E-mail dedie aux professionnels ; absent = contact.email'),
      phone: z.string().optional().describe('Telephone dedie aux pros, format international ; absent = contact.phone'),
      phoneDisplay: z.string().optional().describe('Format affiche de pros.phone'),
    })
    .optional()
    .describe(
      "Chemin des professionnels (architecture pages-adresses, la « vente aux pros » de Ten Belles) : page /professionnels et lien discret en fin de nav, dans le meme site (jamais un sous-domaine). Absent = ni page ni lien. Jamais rempli sans donnees du client.",
    ),

  sorties: z
    .array(
      z.object({
        slug: z.string().regex(/^[a-z0-9-]+$/).describe('Slug de la page /sorties/<slug>'),
        service: z.string().optional().describe("Slug du service (l'activite) auquel la sortie appartient : listee sur sa page, filtrable par niveau. Absent = sortie hors activite (accueil et pages par public seulement)."),
        titre: z.string().describe('Nom de la sortie, du stage ou de la prestation datee, tel que le client le donne'),
        resume: z.string().describe('Une phrase du client : pour qui, ce qu’on y fait'),
        periode: z.string().describe('Periode telle que le client la donne (« de juin à septembre », « juillet et août », « avant l’hiver »)'),
        duree: z.string().optional().describe('Duree donnee par le client (« 1 journée », « 3 jours », « 2 h »). Absente = non affichee.'),
        niveau: z.string().optional().describe('Niveau ou difficulte en mots (« Découverte », « Confirmé ») : filtre de la page de l’activite des deux niveaux distincts. Absent = non affiche.'),
        prix: z.string().optional().describe('Prix tel que le client le donne (« 65 € par personne », « à partir de 120 € ») ; absent = pas de prix affiche, jamais devine.'),
        condition: z.string().optional().describe('Condition de depart donnee par le client (« 4 participants minimum »). Absente = non affichee.'),
        public: z.array(z.string()).default([]).describe('Publics vises (« Familles », « Scolaires », « Entreprises ») : une page /pour/<public> des trois sorties pour un meme public. Vide = aucune.'),
        programme: z.array(z.object({ titre: z.string(), texte: z.string() })).default([]).describe('Deroule jour par jour ou etape par etape, donne par le client. Vide = pas de bloc Programme.'),
        inclus: z.array(z.string()).default([]).describe('Ce qui est compris (encadrement, materiel). Vide = pas de bloc.'),
        aPrevoir: z.array(z.string()).default([]).describe('Ce que le client demande d’apporter ou de prevoir. Vide = pas de bloc.'),
        photo: img.optional().describe('Photo de la sortie, celle du client ; absente = carte sans image'),
        enAvant: z.boolean().default(false).describe("Mise en avant sur l'accueil (« à la une cette saison ») : posee par le studio, changee avec /retouche quand la saison tourne."),
        lien: z.string().url().optional().describe('Lien de reservation en ligne de cette sortie ; absent = « Réserver » mene au formulaire de contact.'),
      }),
    )
    .default([])
    .describe(
      "Sorties, stages ou prestations datees et cotees du client (architecture saisons-sorties, docs/veille/architectures/saisons-sorties.md) : une page chacune (/sorties/<slug>, <details> natifs Programme / Inclus / À prévoir), listees sur la page de leur activite avec un filtre par niveau en CSS (:has()), les sorties enAvant sur l'accueil, une page /pour/<public> par public de trois sorties ou plus, et le choix de la sortie dans le formulaire. Vide = ni page, ni liste. Jamais une sortie, une periode ou un prix inventes.",
    ),

  ardoise: z
    .array(
      z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Date AAAA-MM-JJ donnee par le client'),
        service: z.string().optional().describe("Slug de l'activite concernee ; absent = toute la maison"),
        titre: z.string().optional().describe('Titre court du client (« Fermeture exceptionnelle », « Pizza de la Saint-Martin »). Absent = la date seule.'),
        lignes: z.array(ligneCarte).default([]).describe('Ce qui est propose ce jour-la, a la place du programme de la semaine. Vide = pas de liste.'),
        texte: z.string().optional().describe('Une phrase du client. Absente = non affichee.'),
        ferme: z.boolean().default(false).describe('Ferme ce jour-la (fermeture exceptionnelle) : dit sur l’ardoise du jour, a la place du programme.'),
      }),
    )
    .default([])
    .describe(
      "Exceptions datees de l'ardoise (architecture ardoise-du-jour) : la pizza d'une date, un pain de fete, une fermeture exceptionnelle. Les dates passees tombent au build (src/lib/ardoise.ts) ; l'exception du jour remplace le programme de ce jour dans le navigateur. Vide = le programme de la semaine seul. Jamais une exception inventee.",
    ),

  tournee: z
    .array(
      z.object({
        jour: z.string().describe("Jour(s) de passage tels que le client les ecrit, lus comme contact.hours (« Mardi », « Samedi et dimanche ») ; illisibles = etape listee telle quelle, jamais placee sur un jour devine"),
        moment: z.string().optional().describe('« Midi », « Soir » quand le client fait deux etapes le meme jour. Absent = non affiche.'),
        commune: z.string().describe('Commune de l’etape (« Genlis ») : une page /tournee/<commune> par commune'),
        repere: z.string().optional().describe('Repere sur place donne par le client (« Parking du terrain de rugby », « Place de la mairie »). Absent = non affiche, jamais devine.'),
        hours: z.string().describe('Heures telles que le client les donne (« 17 h – 21 h »)'),
        opens: z.string().regex(/^\d{2}:\d{2}$/).optional().describe("Heure d'arrivee HH:MM : avec closes, l'etape du moment se choisit a l'heure pres (apres closes, la suivante) et le JSON-LD est structure"),
        closes: z.string().regex(/^\d{2}:\d{2}$/).optional().describe('Heure de depart HH:MM'),
        vehicule: z.string().optional().describe('Nom du camion ou du stand quand le client en a plusieurs (« Le camion de Louis »). Absent = non affiche.'),
        phone: z.string().optional().describe("Telephone de ce vehicule, format international ; absent = contact.phone (jamais devine)"),
        phoneDisplay: z.string().optional().describe('Format affiche de phone'),
        mapsUrl: z.string().url().optional().describe('Lien d’itineraire vers l’emplacement ; absent = pas de lien'),
        coordinates: z.object({ lat: z.number(), lng: z.number() }).optional().describe('Latitude/longitude de l’emplacement (JSON-LD geo). Absentes = non emises.'),
      }),
    )
    .default([])
    .describe(
      "Tournee de la semaine d'un metier itinerant (camion pizza, rotisseur, marches ; architecture tournee-semaine, docs/veille/architectures/tournee-semaine.md) : l'etape du moment en tete de l'accueil (choisie DANS LE NAVIGATEUR, fuseau Europe/Paris ; sans script, toute la semaine se lit), la semaine (zones/tournee), une page par commune (/tournee/<commune>, JSON-LD par etape), /tournee, lien de nav. Vide = ni bloc, ni page, ni lien. Jamais une etape, un repere ou un jour inventes.",
    ),

  artistes: z
    .array(
      z.object({
        slug: z.string().regex(/^[a-z0-9-]+$/).describe('Slug de la page /artistes/<slug> (« manon », « gary-burns »)'),
        nom: z.string().describe('Nom ou nom d’artiste tel que la personne le signe (« Manon », « Gary Burns »)'),
        role: z.string().optional().describe('Place dans la maison, dans les mots du client (« Tatoueuse résidente », « Coiffeuse », « Artiste invité »). Absent = non affiche.'),
        depuis: z.number().int().optional().describe('Annee ou la personne a commence le metier (« tatoue depuis 2011 »), donnee par elle. Absente = non affichee.'),
        styles: z.array(z.string()).default([]).describe('Styles ou specialites de la personne (« Japonais », « Blackwork », « Coupe homme ») : filtre par style de l’accueil et de /artistes (sans script) des deux styles distincts. Vide = non affiches.'),
        texte: md.optional().describe('Presentation a la premiere personne ou dans les mots du client, paragraphes separes par une ligne vide. Absente = page sans texte, jamais inventee.'),
        photo: img.optional().describe('Portrait ou piece signature de la personne (photo du client) : carte de l’accueil et tete de sa page. Absente = carte en texte seul, jamais une photo de banque.'),
        photos: z.array(img).default([]).describe('Ses travaux (portfolio), photos du client : grille de sa page. Vide = pas de grille.'),
        jours: z.string().optional().describe('Jours de presence au salon tels que le client les donne (« Du mardi au samedi », « Un samedi sur deux »). Absents = non affiches.'),
        periode: z.string().optional().describe('Pour un artiste invite : periode de passage donnee par le client (« du 3 au 15 novembre »). Absente = artiste resident.'),
        email: z.string().email().optional().describe('E-mail propre a la personne ; absent = contact.email (jamais devine)'),
        instagram: z.string().url().optional().describe('Compte Instagram de la personne (son portfolio). Absent = pas de lien.'),
        rdvUrl: z.string().url().optional().describe('Lien de prise de rendez-vous propre a la personne (Planity, agenda en ligne). Absent = pas de bouton, on ecrit ou on appelle.'),
      }),
    )
    .default([])
    .describe(
      "Artistes ou praticiens du salon, une page chacun (architecture artistes-residents, docs/veille/architectures/artistes-residents.md : salon de tatouage, coiffeurs, barbiers, atelier collectif) : le mur des artistes en tete de l'accueil, filtre par style en CSS (:has()), page /artistes et /artistes/<slug> (portrait, styles, presentation, travaux, son e-mail, son Instagram, son lien de rendez-vous ; JSON-LD Person qui travaille pour le commerce), lien de nav. Vide = ni mur, ni page, ni lien. Jamais un artiste, un style ou une photo inventes.",
    ),

  fetes: z
    .array(
      z.object({
        slug: z.string().regex(/^[a-z0-9-]+$/).describe('Slug de la page /fetes/<slug> (« toussaint-2026 », « noel-2026 »)'),
        nom: z.string().describe('Nom du temps fort tel que le client le dit (« Toussaint », « Fête des mères », « Noël »)'),
        du: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Debut AAAA-MM-JJ : la fete devient « en ce moment » dans le navigateur a cette date'),
        au: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Fin AAAA-MM-JJ (le jour de la fete) : apres, elle tombe de l’accueil'),
        commanderAvant: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('Date limite de commande AAAA-MM-JJ donnee par le client. Absente = rien n’est dit, jamais devinee.'),
        texte: z.string().optional().describe('Une ou deux phrases du client (ce qu’il prepare pour cette fete). Absente = non affichee.'),
        lignes: z.array(ligneCarte).default([]).describe('Ce qui est propose pour cette fete, avec le prix si le client le donne (« Coupe de chrysanthèmes », « 25 € »). Vide = pas de liste.'),
        photo: img.optional().describe('Photo du client pour cette fete. Absente = bloc sans photo, jamais une photo de banque.'),
        service: z.string().optional().describe("Slug de l'occasion (services[]) a laquelle la fete renvoie (Toussaint → deuil). Absent = pas de renvoi."),
      }),
    )
    .default([])
    .describe(
      "Calendrier des fetes du commerce (architecture calendrier-fetes, docs/veille/architectures/calendrier-fetes.md : fleuriste, chocolatier, patissier, boucher-traiteur, caviste) : la fete en cours ou la prochaine en tete de l'accueil, choisie DANS LE NAVIGATEUR (fuseau Europe/Paris ; sans script, toutes les fetes a venir se lisent), avec la date limite de commande ; page /fetes et /fetes/<slug> ; lien de nav. Les fetes passees tombent au build. Vide = ni bloc, ni page, ni lien. Jamais une fete, une date ou un prix inventes.",
    ),

  livraison: z
    .object({
      zone: z.string().optional().describe('Zone livree dans les mots du client (« 130 communes de Sarthe », « Le Mans et 15 km autour »). Absente = non affichee.'),
      delai: z.string().optional().describe('Delai donne par le client (« en 4 h au plus »). Absent = non affiche.'),
      prix: z.string().optional().describe('Prix de la livraison tel que le client le donne (« gratuite », « 8 € »). Absent = non affiche.'),
      heureLimite: z.string().regex(/^\d{2}:\d{2}$/).optional().describe('Heure HH:MM avant laquelle une commande est livree le jour meme, donnee par le client : dans le navigateur, avant cette heure « livree aujourd’hui », apres « le prochain jour de livraison ». Absente = rien n’est dit.'),
      jours: z.string().optional().describe('Jours de livraison tels que le client les donne (« Du mardi au dimanche matin »). Absents = non affiches.'),
    })
    .optional()
    .describe("Livraison du client (architecture calendrier-fetes ; source Touchard Fleurs : « livraison en 4 h dans 130 communes », commande avant 13 h pour le jour meme) : bloc de l'accueil et des pages de fete. Absent = rien n’est dit sur la livraison, jamais devine."),

  parcours: z
    .array(
      z.object({
        slug: z.string().regex(/^[a-z0-9-]+$/).describe('Slug de la page /parcours/<slug> (« decouvrir », « cours-du-soir », « atelier-libre »)'),
        niveau: z.string().describe('Le barreau dit par le visiteur, dans les mots du client (« Je découvre », « J’apprends », « Je pratique seul ») : libellé de l’onglet'),
        titre: z.string().describe('Nom de la formule ou du groupe de formules (« Initiation au tour », « Cours de huit semaines », « Adhésion à l’atelier »)'),
        phrase: z.string().optional().describe('Une ou deux phrases du client sur ce barreau. Absente = non affichée.'),
        pour: z.string().optional().describe('À qui il s’adresse, dans les mots du client (« Sans jamais avoir touché la terre », « Après un cours complet »). Absent = non affiché.'),
        formules: z.array(ligneCarte).default([]).describe('Les formules de ce barreau avec leur prix si le client le donne (« Atelier de trois heures », « 65 € »). Vide = barreau sans formule (il ne compte pas).'),
        compris: z.array(z.string()).default([]).describe('Ce qui est compris (« La terre et deux cuissons », « Le tablier »). Vide = non affiché.'),
        nonCompris: z.array(z.string()).default([]).describe('Ce qui ne l’est pas, dit franchement (« Les cuissons supplémentaires »). Vide = non affiché.'),
        deroule: z.array(z.string()).default([]).describe('Comment ça se passe, dans l’ordre (« On réserve sa séance », « On vient avec des vêtements qui ne craignent rien »). Vide = non affiché.'),
        dates: z.array(z.string()).default([]).describe('Prochaines dates ou rythme tels que le client les donne (« Mardis de 19 h à 21 h », « Session du 6 janvier »). Vide = non affichées.'),
        questions: z.array(z.object({ q: z.string(), a: z.string() })).default([]).describe('Questions propres à ce barreau (sa page). Vide = pas de bloc.'),
        photo: img.optional().describe('Photo du client pour ce barreau (les mains dans la terre, l’atelier). Absente = barreau sans photo, jamais une photo de banque.'),
      }),
    )
    .default([])
    .describe(
      "Le parcours du client, du premier essai a la pratique libre (architecture parcours-atelier, docs/veille/architectures/parcours-atelier.md, source Turning Earth : cours puis adhesion a l'atelier) : poterie, cuisine, couture, menuiserie partagee, oenologie, musique. L'accueil demande « Où en êtes-vous ? » : un onglet par barreau (sans script, l'echelle entiere), chaque barreau dit ses formules, ce qui est compris ou non, le deroule, les dates, et le barreau suivant ; une page par barreau (/parcours/<slug>) ; la nav nomme les barreaux. Vide = ni echelle, ni page. Jamais une formule, un prix ou une date inventes.",
    ),

  disponibilites: z
    .object({
      occupe: z
        .array(
          z.object({
            du: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Arrivee AAAA-MM-JJ : premiere nuit prise'),
            au: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Depart AAAA-MM-JJ (exclu) : ce jour-la est libre pour une arrivee'),
            libelle: z.string().optional().describe('Pour le studio seulement (« Fermeture annuelle », « Famille D. ») : jamais affiche sur le site.'),
          }),
        )
        .default([])
        .describe("Periodes deja reservees ou fermees, telles que le client les donne (nuits du `du` a la veille du `au`). Les periodes passees tombent au build. Vide et sans iCal = aucun calendrier affiche (jamais « tout est libre » par defaut)."),
      ics: z.string().url().optional().describe("Adresse d'export iCal du client (Airbnb, Booking, Gites de France, Abritel, agenda partage), https seulement, lue AU BUILD (src/lib/ics-build.ts, 8 s au plus) et ajoutee aux periodes listees ; illisible = calendrier non affiche et avertissement au build. Reconstruire le site pour rafraichir."),
      mois: z.number().int().min(2).max(18).default(12).describe('Nombre de mois montres sur la page /disponibilites (l’accueil en montre deux).'),
      nuitsMin: z.number().int().min(1).optional().describe('Nombre minimal de nuits donne par le client (« 2 nuits minimum », « la semaine en juillet-août » = 7). Absent = rien n’est dit.'),
      arrivee: z.string().optional().describe('Heure ou jour d’arrivee dans les mots du client (« à partir de 16 h », « le samedi en été »). Absent = non affiche.'),
      depart: z.string().optional().describe('Heure ou jour de depart dans les mots du client (« avant 10 h »). Absent = non affiche.'),
      capacite: z.string().optional().describe('Capacite dans les mots du client (« 8 personnes, 4 chambres »). Absente = non affichee.'),
      tarifs: z.array(ligneCarte).default([]).describe('Tarifs donnes par le client (« Juillet-août, la semaine », « 1 450 € »). Vide = pas de tarifs affiches, jamais devines.'),
    })
    .optional()
    .describe(
      "Calendrier des disponibilites d'un hebergement ou d'une salle (architecture outil-calendrier, docs/veille/architectures/coquelicots.md : gite, chambre d'hotes, salle de reception, location) : les nuits libres et prises, lues AU BUILD dans la liste `occupe` et l'iCal du client, rendues sans script (un tableau par mois) ; dans le navigateur, le choix de l'arrivee et du depart remplit la demande (formulaire existant, aucun paiement). Accueil (#disponibilites), page /disponibilites, porte « Réserver » vers l'outil. Absent = ni outil, ni page. Jamais une disponibilite inventee.",
    ),

  tarifs: z
    .object({
      creneaux: z
        .array(
          z.object({
            nom: z.string().describe('Nom du creneau dans les mots du client (« Journée », « Soirée », « Nuit, dimanche et férié »)'),
            heures: z.string().describe('Heures affichees (« 8 h – 18 h »)'),
            de: z.string().regex(/^\d{2}:\d{2}$/).describe('Debut HH:MM (fuseau Europe/Paris) : sert a marquer le creneau de l’heure dans le navigateur'),
            a: z.string().regex(/^\d{2}:\d{2}$/).describe('Fin HH:MM (exclue) ; une fin avant le debut franchit minuit (« 22:00 » a « 02:00 »)'),
            jours: z.enum(['tous', 'semaine', 'week-end']).default('tous').describe("Jours ou le creneau s'applique : 'semaine' (lundi a vendredi), 'week-end' (samedi, dimanche), 'tous'"),
          }),
        )
        .default([])
        .describe('Les creneaux du client, dans son ordre (colonnes de la grille). Vide = une seule colonne « Prix ».'),
      situations: z
        .array(
          z.object({
            slug: z.string().regex(/^[a-z0-9-]+$/).describe('Slug de la page /tarifs/<slug> (« porte-claquee », « fuite-sous-evier »)'),
            nom: z.string().describe('La situation dans les mots du visiteur (« Porte claquée », « Porte fermée à clé », « Fuite sous l’évier ») : libellé de l’onglet'),
            test: z.string().optional().describe('Comment savoir que c’est bien cette situation, dit par le client (« Vous avez seulement tiré la porte, sans tour de clé »). Absent = non affiché.'),
            phrase: z.string().optional().describe('Une ou deux phrases du client sur cette intervention. Absente = non affichée.'),
            prix: z.array(z.string()).default([]).describe('Prix de cette situation, un par creneau dans l’ordre de `creneaux` (« 100 € », « 165 € », « 230 € ») ; chaine vide = pas de prix pour ce creneau. Jamais un prix devine.'),
            delai: z.string().optional().describe('Delai d’arrivee annonce par le client pour cette situation (« Sur place en 15 à 20 min »). Absent = celui de tarifs.delai.'),
            compris: z.array(z.string()).default([]).describe('Ce que comprend le forfait (« Déplacement inclus », « Facture pour l’assurance »). Vide = non affiché.'),
            deroule: z.array(z.string()).default([]).describe('Comment ça se passe, dans l’ordre (« Vous appelez, le prix est confirmé avant le départ »). Vide = non affiché.'),
            conseil: z.string().optional().describe('Ce qu’il faut savoir avant d’appeler (« Ne forcez pas la porte »). Absent = non affiché.'),
            questions: z.array(z.object({ q: z.string(), a: z.string() })).default([]).describe('Questions propres a cette situation (sa page). Vide = pas de bloc.'),
          }),
        )
        .default([])
        .describe('Les situations urgentes, dans l’ordre du client : un onglet chacune sur l’accueil, une page /tarifs/<slug>. Une situation sans aucun prix ne compte pas.'),
      autres: z.array(ligneCarte).default([]).describe('Prestations a prix hors creneaux (« Changement de cylindre », « dès 200 € ») : bas de la grille complete. Vide = rien.'),
      notes: z.array(z.string()).default([]).describe('Engagements dits par le client sous la grille (« Aucun déplacement facturé si vous refusez le devis »). Vide = rien.'),
      delai: z.string().optional().describe('Delai d’arrivee general du client (« Sur place en 15 à 20 min dans l’arrondissement »). Absent = rien n’est promis.'),
      secteurs: z
        .array(z.object({ nom: z.string().describe('Quartier ou commune'), delai: z.string().optional().describe('Delai annonce pour ce secteur (« 10 min »). Absent = non affiché.'), rues: z.string().optional().describe('Rues ou reperes donnes par le client. Absent = non affiché.') }))
        .default([])
        .describe('Secteurs desservis avec leur delai, sous la grille. Vide = pas de bloc.'),
    })
    .optional()
    .describe(
      "Grille de prix publiee d'un metier d'urgence (architecture grille-urgence, docs/veille/architectures/grille-urgence.md, source Serrure Ouest : « douze prestations, douze prix », jour, soiree, nuit) : l'accueil demande « Quelle est votre situation ? » (un onglet par situation, sans script toutes les situations), le prix du creneau de l'heure marque dans le navigateur (fuseau Europe/Paris ; sans script, tous les creneaux), le delai, ce que comprend le forfait ; la grille complete et les secteurs ; une page par situation (/tarifs/<slug>) et /tarifs. Absent = ni grille, ni page. Jamais un prix, un delai ou un creneau inventes.",
    ),

  envoi: z
    .object({
      etat: z.string().optional().describe('Message du moment donne par le client (« En ce moment l’atelier limite les envois : écrivez avec des photos avant d’envoyer »). Absent = rien.'),
      delai: z.string().optional().describe('Delai de reparation annonce par le client (« 10 à 15 jours »). Absent = rien n’est promis.'),
      etapes: z
        .array(
          z.object({
            ou: z.string().describe('Ou est l’objet a cette etape (« Chez vous », « À la poste », « À l’atelier », « De retour chez vous »)'),
            titre: z.string().describe('Ce qui se passe (« Vous nous écrivez avec deux photos »)'),
            texte: z.string().optional().describe('Precision du client. Absente = non affichée.'),
          }),
        )
        .default([])
        .describe('Le voyage de l’objet, dans l’ordre du client : une carte chacune sur la piste de l’accueil et sur /envoyer. Moins de 3 etapes = pas de piste.'),
      retour: z.array(ligneCarte).default([]).describe('Frais de port retour donnes par le client (« 1 paire », « 10 € »). Vide = rien n’est dit.'),
      conditions: z.array(z.string()).default([]).describe('A faire avant d’envoyer (« Joindre la fiche au colis », « Envoyer des photos d’abord »). Vide = rien.'),
      fiche: z
        .object({ href: z.string().describe('Fichier du client dans public/ (« /fiches/fiche-envoi.pdf »)'), label: z.string().describe('« La fiche à joindre au colis »') })
        .optional()
        .describe('Fiche a imprimer et joindre au colis, fournie par le client. Absente = pas de lien.'),
      adresse: z.string().optional().describe('Adresse d’envoi si elle differe de contact.address (boite postale). Absente = l’adresse de l’atelier.'),
    })
    .optional()
    .describe(
      "Reparation par colis d'un atelier (architecture atelier-par-colis, docs/veille/architectures/atelier-par-colis.md, source La Cordonnerie Alpine : venir a l'atelier ou envoyer ; seconde source AGH, horloger) : l'accueil dit les deux chemins, le voyage du colis en piste horizontale manuelle (scroll-snap, jamais la molette detournee), le delai, l'etat du moment, les frais de retour ; page /envoyer. Absent = ni piste, ni page. Jamais un delai, un frais ou une etape inventes.",
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
      dates: z
        .boolean()
        .optional()
        .describe("Champ « Dates souhaitées » dans le formulaire (demande qualifiee, architecture saisons-sorties). true = affiche (sixieme champ : ff verifier avertit au-dela de cinq) ; absent ou false = pas de champ, et avec des sorties le message invite a donner la sortie et les dates."),
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
      tournee: z.string().default('Où nous trouver').describe('Libellé du lien de nav et titre de la page /tournee (site.tournee) : « Où nous trouver », « La tournée », « Nos marchés »'),
      artistes: z.string().default('Les artistes').describe('Libellé du lien de nav et titre de la page /artistes (site.artistes) : « Les artistes », « L’équipe », « Les tatoueurs »'),
      fetes: z.string().default('Les fêtes').describe('Libellé du lien de nav et titre de la page /fetes (site.fetes) : « Les fêtes », « Le calendrier », « Les temps forts »'),
      disponibilites: z.string().default('Les dates libres').describe('Libellé du lien de nav et titre de l’outil et de la page /disponibilites (site.disponibilites) : « Les dates libres », « Disponibilités »'),
      parcours: z.string().default('Où en êtes-vous ?').describe('Question posée au-dessus des onglets du parcours (site.parcours) : « Où en êtes-vous ? », « Votre niveau »'),
      tarifs: z.string().default('Les tarifs').describe('Libellé du lien de nav et titre de la page /tarifs (site.tarifs) : « Les tarifs », « Nos prix »'),
      situation: z.string().default('Quelle est votre situation ?').describe('Question posée au-dessus des onglets de la grille (site.tarifs) : « Quelle est votre situation ? », « Que se passe-t-il ? »'),
      envoi: z.string().default('Envoyer par colis').describe('Libellé du lien de nav et titre de la page /envoyer (site.envoi) : « Envoyer par colis », « Réparer à distance »'),
      programme: z.string().default('Le programme').describe('Libellé du lien de nav et titre de la page /programme (architecture ardoise-du-jour) : « Le programme », « Les pains de la semaine »'),
      lieux: z.string().default('Nos adresses').describe('Libellé du lien de nav (trois adresses et plus), du bandeau des adresses et titre de la page /adresses (site.lieux) : « Nos adresses », « Nos boutiques »'),
      pros: z.string().default('Professionnels').describe('Libellé du lien de nav vers /professionnels (site.pros) : « Professionnels », « Vente aux pros »'),
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
