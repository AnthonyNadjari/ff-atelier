/**
 * Demo Finck & Fisch : Boulangerie Petit Pain — Marseille.
 * Site fictif de demonstration. Donnees marquees DEMO : fictives, jamais utilisees pour un vrai client.
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'demo-boulangerie',
  direction: 'clair',
  motion: 'subtle',
  layout: {
    nav: 'bar',
    hero: 'stacked',
    sections: [
      { type: 'services', variant: 'grid' },
      { type: 'about', variant: 'portrait' },
      { type: 'zones', variant: 'list' },
      { type: 'cta', variant: 'card' },
      { type: 'contact', variant: 'simple' },
    ],
    footer: 'columns',
  },

  business: {
    name: 'Boulangerie Petit Pain',
    trade: 'Boulanger-pâtissier',
    tagline: 'Le pain du matin, <em>pétri avant l’aube.</em>',
    description:
      'La Boulangerie Petit Pain fabrique chaque jour son pain, ses viennoiseries et ses pâtisseries dans le quartier du Camas à Marseille, au levain naturel et à la farine locale.\n\nOuvert tous les jours sauf le lundi, avec une deuxième fournée de pain en fin d’après-midi.',
    since: 2008,
    legalForm: 'EURL',
  },

  contact: {
    phone: '+33639987087',
    phoneDisplay: '06 39 98 70 87',
    email: 'contact@exemple.fr',
    address: { street: '19 rue Sylvabelle', postalCode: '13006', city: 'Marseille' },
    mapsUrl: 'https://maps.google.com/?q=19+rue+Sylvabelle+Marseille',
    hours: [
      { days: 'Mardi – dimanche', hours: '6h30 – 20h' },
      { days: 'Lundi', hours: 'Fermé' },
    ],
    emergency24h: false,
  },

  zones: {
    cities: ['Marseille 6e', 'Marseille 5e', 'Marseille 1er', 'Marseille 8e', 'Marseille 4e'],
    label: 'Quartiers du Camas, Baille et alentours',
  },

  services: [
    {
      slug: 'pains-traditionnels',
      title: 'Pains traditionnels',
      short: 'Pain au levain naturel, tradition, campagne, cuits deux fois par jour.',
      icon: 'Wheat',
      featured: true,
      image: { src: '/images/service-1.webp', alt: 'Pains traditionnels au levain naturel' },
      bullets: ['Levain naturel entretenu chaque jour', 'Farine de meunier local', 'Deuxième fournée en fin d’après-midi'],
      description:
        'Le levain est nourri chaque matin avant la première fournée. La farine vient d’un meunier des Alpes-de-Haute-Provence, pour un pain qui se conserve mieux et se digère plus facilement.\n\nUne deuxième fournée de pain tradition est faite en fin d’après-midi, pour ceux qui passent après le travail.',
    },
    {
      slug: 'viennoiseries',
      title: 'Viennoiseries',
      short: 'Croissants, pains au chocolat et chaussons, au beurre, façonnés à la main.',
      icon: 'Croissant',
      featured: true,
      image: { src: '/images/service-2.webp', alt: 'Viennoiseries façonnées à la main' },
      bullets: ['Beurre AOP Charentes-Poitou', 'Façonnage manuel', 'Cuisson à la commande le matin'],
      description:
        'Croissants et pains au chocolat sont façonnés à la main chaque matin, au beurre AOP, sans étape industrielle. Les derniers fournées sortent en milieu de matinée pour ceux qui passent plus tard.',
    },
    {
      slug: 'patisseries',
      title: 'Pâtisseries',
      short: 'Tartes de saison, flans, entremets simples, préparés à l’atelier.',
      icon: 'Sparkles',
      image: { src: '/images/service-3.webp', alt: 'Pâtisseries de saison en vitrine' },
      bullets: ['Fruits de saison', 'Pâtisseries individuelles et à partager', 'Commande possible pour un anniversaire'],
      description:
        'Les pâtisseries changent avec les saisons : tartes aux fruits, flans, quelques entremets simples. Pour un anniversaire ou un repas de famille, une commande peut être passée quelques jours à l’avance.',
    },
    {
      slug: 'snacking',
      title: 'Sandwichs et snacking',
      short: 'Sandwichs préparés sur pain maison, pour le déjeuner sur le pouce.',
      icon: 'ShoppingBag',
      image: { src: '/images/service-4.webp', alt: 'Sandwichs préparés sur pain maison' },
      bullets: ['Pain maison du jour', 'Formule sandwich et boisson', 'À emporter'],
      description:
        'Les sandwichs sont préparés sur le pain du jour, avec des garnitures simples renouvelées régulièrement. Une formule avec boisson est proposée pour le déjeuner.',
    },
    {
      slug: 'commande',
      title: 'Pain sur commande',
      short: 'Grandes pièces de pain pour un repas de famille ou un événement.',
      icon: 'Flame',
      bullets: ['Grandes pièces sur commande', 'Délai de deux à trois jours', 'Idéal pour un repas nombreux'],
      description:
        'Pour un repas de famille ou un petit événement, une grande pièce de pain peut être commandée à l’avance, avec un délai de deux à trois jours selon la période.',
    },
  ],

  about: {
    title: 'La boulangerie',
    story:
      'Nadia Selim a repris la boulangerie familiale en 2008, après avoir travaillé plusieurs années aux côtés de son père. Elle est passée au levain naturel dès la reprise, un choix qui a demandé deux ans d’ajustements avant de trouver le bon équilibre.\n\nL’équipe compte aujourd’hui quatre personnes : deux en fournil, deux en vente, pour une boulangerie qui reste ouverte six jours sur sept.',
    portrait: { src: '/images/portrait.webp', alt: 'Devanture de la Boulangerie Petit Pain, rue Sylvabelle' },
  },

  social: { instagram: 'https://www.instagram.com/boulangeriepetitpain' },

  wording: {
    devis: 'Passer commande',
    ctaTitle: 'Une commande, un événement&nbsp;? <em>On prépare ça.</em>',
    ctaText: 'Gâteaux, pièces montées, pains spéciaux : appelez-nous ou passez à la boutique.',
    contactTitle: 'Commander ou nous écrire',
    contactText: 'Le plus simple : un appel ou un passage à la boutique.',
  },
  form: { provider: 'none' },
  images: {
    hero: { src: '/images/hero.webp', alt: 'Pains et viennoiseries de la Boulangerie Petit Pain' },
  },
  seo: { keywords: ['boulangerie Marseille', 'pain au levain Marseille', 'boulangerie Camas', 'viennoiserie Marseille 6e'] },
  legal: { owner: 'Nadia Selim' },
});
