// DEMO : client inventé (Chez Malo). Coordonnées fictives (plage 06 39 98), aucun avis inventé.
// Nav, hero et blocs principaux dessinés à la main pour ce site : sites/chez-malo/sections/.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'chez-malo',
  direction: 'mediterranee',
  motion: 'rich',
  scale: 'display',
  typography: { display: 'gelasio', body: 'figtree' },
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
    tagline: 'La criée le matin, <em>la carte le soir.</em>',
    description:
      'Restaurant de poissons au Vallon des Auffes, face aux barques et aux cabanons de pêcheurs. Malo Ferrer y cuisine depuis 2011 ce qu’il a acheté à la criée le matin même : poissons de roche, loup, daurade, rouget.\n\nTrente-deux couverts, une terrasse sur le port. La bouillabaisse, elle, se commande la veille, et pour deux personnes au minimum. Le lundi, c’est fermé.',
    since: 2011,
  },

  contact: {
    phone: '+33639986340',
    phoneDisplay: '06 39 98 63 40',
    email: 'contact@exemple.fr',
    address: { street: '4 rue du Vallon des Auffes', postalCode: '13007', city: 'Marseille' },
    mapsUrl: 'https://maps.google.com/?q=4+rue+du+Vallon+des+Auffes+13007+Marseille',
    hours: [
      { days: 'Mardi – samedi', hours: '12 h – 14 h et 19 h 30 – 22 h' },
      { days: 'Dimanche', hours: '12 h – 14 h 30' },
      { days: 'Lundi', hours: 'Fermé' },
    ],
    emergency24h: false,
  },

  services: [
    {
      slug: 'bouillabaisse-du-vallon',
      title: 'Bouillabaisse du Vallon',
      short: 'Elle se commande la veille, et jamais pour une seule personne. 84 € pour deux.',
      icon: 'Soup',
      featured: true,
      priceFrom: 'à partir de 84 € pour deux',
    },
    {
      slug: 'poisson-du-jour',
      title: 'Poisson du jour',
      short: 'Loup, daurade ou rouget, arrivé le matin même. Et grillé simplement, parce qu’il n’a pas besoin de plus.',
      icon: 'Fish',
      featured: true,
    },
    {
      slug: 'terrasse-sur-le-port',
      title: 'Terrasse sur le port',
      short: 'Trente-deux couverts en tout. De la table, on voit les barques et les cabanons.',
      icon: 'Sun',
    },
  ],

  about: {
    story:
      'Malo Ferrer a ouvert en 2011, dans une ancienne cabane de pêcheur du Vallon des Auffes. Trente-deux couverts, pas un de plus : la salle est ce qu’elle est.\n\nIl passe à la criée chaque matin. La carte s’écrit après, avec ce qui est arrivé. Et certains soirs, il n’y a pas de bouillabaisse.',
  },

  wording: {
    devis: 'Réserver une table',
    ctaTitle: 'Une table sur le port ? <em>Appelez, on garde la place.</em>',
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
