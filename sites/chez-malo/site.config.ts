// DEMO : client inventé (Chez Malo). Coordonnées fictives (plage 06 39 98), aucun avis inventé.
// Nav, hero et blocs principaux dessinés à la main pour ce site : sites/chez-malo/sections/.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'chez-malo',
  direction: 'mediterranee',
  motion: 'rich',
  scale: 'display',
  typography: { display: 'playfair', body: 'figtree' },
  layout: {
    shell: 'sticky-hero',
    nav: 'custom/nav',
    hero: 'custom/hero',
    sections: [
      { type: 'custom', variant: 'lelieu', label: 'Le lieu' },
      { type: 'custom', variant: 'essentiels', label: 'L’essentiel' },
      { type: 'custom', variant: 'carte', label: 'Carte' },
      { type: 'custom', variant: 'horaires', label: 'Horaires' },
      { type: 'cta', variant: 'band' },
      { type: 'contact', variant: 'simple' },
    ],
    footer: 'big-name',
    divider: 'none',
    tone: 'flat',
  },

  business: {
    name: 'Chez Malo',
    trade: 'Restaurant de poissons et bouillabaisse',
    tagline: 'La mer arrive le matin. Le soir, on la sert telle qu’elle est.',
    description:
      'Restaurant de poissons au Vallon des Auffes, face aux barques et aux cabanons de pêcheurs. Le chef Malo Ferrer cuisine depuis 2011 ce qui arrive de la criée le matin même : poissons de roche, loup, daurade, et la bouillabaisse les jours où elle se prépare.\n\nTrente-deux couverts, une terrasse sur le port, aucune improvisation sur le produit.',
    since: 2011,
  },

  contact: {
    phone: '+33639986340',
    phoneDisplay: '06 39 98 63 40',
    email: 'contact@exemple.fr',
    address: { street: '4 rue du Vallon des Auffes', postalCode: '13007', city: 'Marseille' },
    mapsUrl: 'https://maps.google.com/?q=4+rue+du+Vallon+des+Auffes+13007+Marseille',
    hours: [
      { days: 'Mardi – samedi', hours: '12h – 14h et 19h30 – 22h' },
      { days: 'Dimanche', hours: '12h – 14h30' },
      { days: 'Lundi', hours: 'Fermé' },
    ],
    emergency24h: false,
  },

  services: [
    {
      slug: 'bouillabaisse-du-vallon',
      title: 'Bouillabaisse du Vallon',
      short: 'La bouillabaisse traditionnelle, sur commande la veille, pour deux personnes minimum.',
      icon: 'Soup',
      featured: true,
      priceFrom: 'à partir de 84 € pour deux',
    },
    {
      slug: 'poisson-du-jour',
      title: 'Poisson du jour',
      short: 'Le loup, la daurade ou le rouget arrivés le matin même, grillés simplement.',
      icon: 'Fish',
      featured: true,
    },
    {
      slug: 'terrasse-sur-le-port',
      title: 'Terrasse sur le port',
      short: 'Trente-deux couverts, vue sur les barques et les cabanons du Vallon des Auffes.',
      icon: 'Sun',
    },
  ],

  about: {
    story:
      'Malo Ferrer a ouvert son restaurant en 2011, dans une ancienne cabane de pêcheur du Vallon des Auffes. Il achète à la criée chaque matin et compose la carte selon ce qui est arrivé.',
  },

  wording: {
    devis: 'Réserver une table',
    ctaTitle: 'Une table sur le port&nbsp;? <em>Appelez, on garde la place.</em>',
    contactTitle: 'Réserver',
  },

  form: { provider: 'mailto' },

  images: {
    hero: { src: '/images/hero.webp', alt: 'Vue en surplomb du Vallon des Auffes, barques de pêcheurs amarrées au pied des façades' },
  },

  seo: {
    keywords: ['restaurant Vallon des Auffes', 'bouillabaisse Marseille', 'poissons Marseille 7e', 'restaurant terrasse port Marseille'],
  },

  legal: { owner: 'Malo Ferrer' },
});
