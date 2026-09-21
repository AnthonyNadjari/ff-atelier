/**
 * Site du studio Finck & Fisch — dogfooding : notre propre site, construit avec notre fabrique.
 * Téléphone et adresse ci-dessous sont des placeholders à remplacer avant mise en ligne
 * (voir résumé de livraison) — Paris/75000 n'est pas une adresse réelle du studio.
 *
 * Relecture « moins IA, plus pro » du 20 sept 2026 : textes réécrits sans tirets cadratins en
 * rafale ni triptyques, phrases courtes ; FAQ ramenée à cinq questions ; contact sur mesure
 * (sections/Contact.astro) pour ne pas empiler deux eyebrows de suite (FAQ + contact partagés).
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'finck-fisch',
  domain: 'finckfisch.fr',

  // Direction eclipse (noir encre, filets d'argent, grand vide) + titres en Cormorant : la charte
  // du studio (repo F-F) veut un serif haut de gamme pour le nom — les titres tout en Space Grotesk
  // donnaient un rendu « template SaaS sombre », exactement ce qu'on vend de ne pas faire. Le corps
  // reste en Instrument Sans (lisible, neutre) : le contraste serif/sans fait le cachet.
  direction: 'eclipse',
  motion: 'rich',
  // Scroll inertiel (Lenis) : vitrine riche, le defilement natif de la molette Windows paraissait
  // « ultra vite » et saccade sur les sequences (20 sept 2026). Coupe automatiquement sous automate.
  smoothScroll: true,
  // Transitions de page (ClientRouter) : fondu 0,3 s entre l'accueil et /services/<slug>, la nav reste
  // en place, le hero s'efface ; scripts inline et moteur rearmes a chaque navigation (docs/ANIMATIONS.md).
  transitions: true,
  scale: 'display',
  typography: { display: 'cormorant' },
  layout: {
    nav: 'custom/nav',
    hero: 'custom/hero',
    sections: [
      // Cinq blocs entre le hero et le contact, pas un de plus. Le manifeste (bloc encre inverse,
      // signe) est la seule section qui inverse noir/blanc : il casse le rythme uniforme de la page.
      { type: 'custom', variant: 'realisations', label: 'Réalisations' },
      { type: 'custom', variant: 'manifeste' },
      { type: 'custom', variant: 'commentcasepasse' },
      { type: 'custom', variant: 'offre', label: 'Offre' },
      { type: 'faq', variant: 'two-columns' },
      { type: 'custom', variant: 'contact', label: 'Contact' },
    ],
    footer: 'minimal',
    divider: 'rule',
    tone: 'flat',
  },

  business: {
    name: 'Finck & Fisch',
    trade: 'Studio de sites pour artisans',
    tagline: 'Un site dessiné pour vous, <em>livré en 72 heures.</em>',
    description:
      'Finck & Fisch dessine des sites vitrines pour des artisans, des commerces et des indépendants. Chaque site part de trois propositions visuelles, jamais d’un modèle décliné par ville. Il est payé une fois et il vous appartient dès la mise en ligne, du code au nom de domaine.\n\nLe studio est tenu par deux associés. Vous parlez à la même personne du premier appel à la livraison.',
    certifications: [],
  },

  contact: {
    phone: '+33600000000',
    phoneDisplay: '06 00 00 00 00',
    email: 'contact@finckfisch.fr',
    address: { postalCode: '75000', city: 'Paris' },
    hours: [{ days: 'Lundi – vendredi', hours: '9h – 19h', opens: '09:00', closes: '19:00' }],
    emergency24h: false,
  },

  zones: { label: 'Toute la France, à distance', cities: [] },

  services: [
    {
      slug: 'site-vitrine',
      title: 'Site vitrine clé en main',
      short: 'Un site de 1 à 6 pages, pensé pour votre activité et livré en une fois.',
      icon: 'Layout',
      featured: true,
      image: { src: '/images/service-1.webp', alt: 'Composition graphique abstraite noir et blanc, image de démonstration' },
      bullets: ['1 à 6 pages', 'Formulaire de contact', 'SEO local', 'Mentions légales', 'Hébergement sans frais mensuels', 'Nom de domaine à votre nom'],
      description:
        'Le site présente votre activité sans détour : ce que vous faites, où vous intervenez, comment vous joindre. Un formulaire permet de vous contacter directement.\n\nIl est optimisé pour le référencement local et comprend vos mentions légales. Il ne génère aucun frais mensuel : l’hébergement est inclus et le nom de domaine est à votre nom.',
    },
    {
      slug: 'refonte',
      title: 'Refonte de site existant',
      short: 'Votre site actuel repris de fond en comble, sans repartir de zéro sur le contenu.',
      icon: 'RefreshCw',
      image: { src: '/images/service-2.webp', alt: 'Composition graphique abstraite noir et blanc, image de démonstration' },
      bullets: ['Reprise des textes et photos existants', 'Mise à jour du contenu', 'Site plus rapide sur mobile'],
      description:
        'Un site vieillissant ou mal ficelé peut être repris intégralement. Nous gardons vos textes et vos photos utilisables, et nous reconstruisons le reste.\n\nLe résultat est un site plus rapide, lisible sur mobile, et à jour sur ce qui compte pour un client : vos services, votre zone et vos coordonnées.',
    },
    {
      slug: 'identite-visuelle',
      title: 'Signature e-mail et identité visuelle légère',
      short: 'Un logo simple, une signature e-mail et une palette de couleurs cohérente.',
      icon: 'PenTool',
      image: { src: '/images/service-3.webp', alt: 'Composition graphique abstraite noir et blanc, image de démonstration' },
      bullets: ['Logo simple', 'Signature e-mail', 'Palette de couleurs'],
      description:
        'Il n’est pas toujours nécessaire de repartir sur une identité de marque complète. Un logo simple, une signature e-mail soignée et une palette cohérente suffisent souvent à donner une image sérieuse.\n\nCette prestation peut accompagner la création d’un site ou être commandée seule.',
    },
    {
      slug: 'visibilite-locale',
      title: 'Fiche Google et visibilité locale',
      short: 'Votre fiche Google tenue à jour, pour apparaître quand on vous cherche.',
      icon: 'MapPin',
      image: { src: '/images/service-4.webp', alt: 'Composition graphique abstraite noir et blanc, image de démonstration' },
      bullets: ['Création ou correction de la fiche', 'Horaires, photos, catégorie à jour', 'Cohérence avec le site'],
      description:
        'Une fiche Google complète et à jour change ce qui apparaît quand un client cherche votre métier dans votre ville : horaires, photos, catégorie d’activité, zone d’intervention.\n\nNous créons ou corrigeons votre fiche, en cohérence avec les informations de votre site.',
    },
  ],

  about: {
    title: 'Le studio',
    story:
      'Finck & Fisch est un studio à deux. L’une rencontre les clients, prend le brief et écrit les textes. L’autre construit les sites avec un outil maison qui associe du code et de l’intelligence artificielle, ce qui permet d’aller vite sans bâcler le détail.\n\nNous pensons qu’un artisan mérite un vrai site, pas un gabarit ni un abonnement de plus. Un prix, une livraison, et le site est à vous.',
    values: [
      { title: 'Vous possédez tout', text: 'Le code, les textes et le nom de domaine vous reviennent à la livraison. Aucun abonnement à reconduire.' },
      { title: 'Deux clients, deux sites différents', text: 'Chaque site a sa direction et sa typographie. Aucun modèle recopié d’un client à l’autre.' },
      { title: 'Un seul interlocuteur', text: 'Du premier appel à la mise en ligne, vous parlez toujours à la même personne.' },
    ],
  },

  process: [
    { title: 'Appel de 15 minutes', text: 'Un échange court pour comprendre votre activité et ce que le site doit faire pour vous.' },
    { title: 'Brief et photos', text: 'Vous nous envoyez vos informations, vos textes et vos photos. Si vous n’en avez pas, nous vous aidons à les réunir.' },
    { title: 'Trois propositions en 48 à 72 h', text: 'Vous recevez trois directions visuelles construites sur votre contenu. Vous en choisissez une.' },
    { title: 'Mise en ligne et remise des clés', text: 'Le site est publié sur votre nom de domaine. Tout vous est transmis, accès compris.' },
  ],

  // Cinq questions, celles qu'un artisan pose vraiment au téléphone. Les autres (agence locale,
  // « deux associés c'est risqué », 72 h trop rapide) argumentaient plus qu'elles ne répondaient.
  faq: [
    {
      q: 'Faut-il fournir des photos ?',
      a: 'C’est mieux, mais pas obligatoire. Nous pouvons monter une première version avec des visuels neutres et les remplacer dès que vos photos sont prêtes.',
    },
    {
      q: 'Est-ce que je vais apparaître sur Google ?',
      a: 'Nous ne promettons pas de première place, personne ne peut la garantir. Nous livrons un site rapide et bien structuré, avec votre ville et votre métier aux bons endroits. Le reste se construit dans le temps, avec ou sans nous.',
    },
    {
      q: 'Pourquoi pas un abonnement à 30 € par mois ?',
      a: 'Sur trois ans, un abonnement coûte souvent plus cher qu’un site payé une fois. Et à la fin, il ne vous appartient pas. Ici, le site est à vous dès la mise en ligne.',
    },
    {
      q: 'Et si je veux changer un texte dans deux ans ?',
      a: 'Vous pouvez repasser par nous, ou par n’importe quel autre développeur. Le code est à vous et ne dépend d’aucun logiciel propriétaire.',
    },
    {
      q: 'À qui appartient le nom de domaine ?',
      a: 'À vous. Il est enregistré à votre nom dès le départ, ou transféré à votre nom si vous en avez déjà un. Jamais au nom du studio.',
    },
  ],

  proof: {
    // Galerie de démonstration : aperçus des directions visuelles utilisées pour nos sites clients.
    gallery: [
      { src: '/images/galerie-1.webp', alt: 'Aperçu de la direction signal, utilisée pour un site de plomberie (démonstration)', caption: 'Direction signal, plomberie (démonstration)' },
      { src: '/images/galerie-2.webp', alt: 'Aperçu de la direction luxe, utilisée pour un site de salon de coiffure (démonstration)', caption: 'Direction luxe, salon de coiffure (démonstration)' },
      { src: '/images/galerie-3.webp', alt: 'Aperçu de la direction journal, utilisée pour un site d’architecture d’intérieur (démonstration)', caption: 'Direction journal, architecture d’intérieur (démonstration)' },
      { src: '/images/galerie-4.webp', alt: 'Aperçu de la direction brut, utilisée pour un site d’électricien (démonstration)', caption: 'Direction brut, électricité (démonstration)' },
      { src: '/images/galerie-5.webp', alt: 'Aperçu de la direction terre, utilisée pour un site de paysagiste (démonstration)', caption: 'Direction terre, paysagisme (démonstration)' },
      { src: '/images/galerie-6.webp', alt: 'Aperçu de la direction clair, utilisée pour un site de boulangerie (démonstration)', caption: 'Direction clair, boulangerie (démonstration)' },
    ],
  },

  social: {},

  form: { provider: 'mailto' },

  wording: {
    devis: 'Parler de votre projet',
    ctaTitle: 'Dites-nous ce que vous <em>faites.</em>',
    ctaText: 'Un appel de quinze minutes suffit pour savoir si nous pouvons vous aider.',
    contactTitle: 'Parlons de votre projet',
    contactText: 'Décrivez votre activité en deux lignes, nous vous rappelons.',
  },

  images: {
    hero: { src: '/images/hero.webp', alt: 'Composition graphique abstraite noir et blanc, image de démonstration' },
  },

  seo: {
    keywords: ['création site vitrine artisan', 'site internet artisan pas cher sans abonnement', 'site web indépendant'],
  },

  legal: { owner: 'Finck & Fisch' },
});
