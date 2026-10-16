// DEMO : fromagerie inventée (Claire Ravanel, fromagère-affineuse à Annecy), piste B « La cave », refaite le
// 16 oct 2026 au soir (direction.md). Coordonnées fictives (plage ARCEP réservée à la fiction 04 65 71), les
// mêmes que les pistes A et C. Aucun avis, aucune note, aucun chiffre de clientèle. Aucune photo : meules,
// planches et escalier sont dessinés en CSS dans les sections.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'fromagerie-ravanel-b',
  direction: 'pierre',
  // Ocre de croûte de tomme, à la place du vert serpentine de la direction (le vert est celui de la piste A).
  accent: { h: 34, s: 48, l: 30 },
  typography: { display: 'libreCaslonCondensed', body: 'archivo' },
  scale: 'normal',
  motion: 'rich',
  servicePages: false,
  layout: {
    nav: 'custom/Porte',
    hero: 'custom/Rue',
    sections: [
      { type: 'custom', variant: 'Cave', label: 'La cave' },
      { type: 'custom', variant: 'Etagere', label: 'Le beaufort' },
      { type: 'custom', variant: 'Reserver', label: 'Raclette et plateaux' },
      { type: 'custom', variant: 'Claire', label: 'Questions' },
      { type: 'custom', variant: 'Venir', label: 'Venir' },
    ],
    footer: 'custom/Pied',
    shell: 'flow',
    divider: 'none',
    tone: 'flat',
    headings: 'left',
    curtain: false,
    contactDrawer: false,
  },

  business: {
    name: 'Fromagerie Ravanel',
    trade: 'Fromager-affineur',
    tagline: 'Sous la boutique, une cave à 11 °C où les tommes et les reblochons fermiers finissent de s’affiner.',
    description:
      'Fromagerie rue de la Gare, à Annecy, depuis 2011. Sous la boutique, une cave à 11 °C où les tommes et les reblochons de six fermes des Aravis et des Bauges finissent de s’affiner.\n\nChaque meule porte sa date d’entrée à la craie. On goûte avant d’acheter, toujours.',
    since: 2011,
  },

  contact: {
    phone: '+33465712318',
    phoneDisplay: '04 65 71 23 18',
    address: { street: '12 rue de la Gare', postalCode: '74000', city: 'Annecy' },
    hours: [
      { days: 'Mardi à vendredi', hours: '8 h 30 à 12 h 30, 15 h 30 à 19 h' },
      { days: 'Samedi', hours: '8 h à 13 h, 15 h à 19 h' },
      { days: 'Dimanche', hours: '8 h 30 à 12 h 30' },
      { days: 'Lundi', hours: 'Fermé' },
    ],
    emergency24h: false,
  },

  zones: { cities: ['Annecy'], label: 'Annecy et le marché de la vieille ville' },

  services: [
    {
      slug: 'cave',
      title: 'La cave d’affinage',
      short: 'Une cave à 11 °C sous la boutique. Chaque meule porte sa date d’entrée à la craie ; demandez-la plus jeune ou plus faite.',
      icon: 'Thermometer',
      featured: true,
    },
    {
      slug: 'plateaux',
      title: 'Plateaux sur commande',
      short: 'De 6 à 30 personnes, composés avec vous, à commander 48 heures avant (une semaine avant pour Noël et le Nouvel An).',
      icon: 'ClipboardList',
      priceFrom: 'dès 6 € par personne',
    },
    {
      slug: 'raclette',
      title: 'Raclette et fondue',
      short: 'Le fromage coupé ou râpé à la demande, et le prêt d’un appareil à raclette (4 ou 8 personnes) contre une caution de 50 €, à réserver.',
      icon: 'Flame',
    },
    {
      slug: 'comptoir',
      title: 'Le comptoir',
      short: 'Beurre de baratte, crème crue, yaourts de la ferme, et quelques vins de Savoie pour aller avec.',
      icon: 'Milk',
    },
  ],

  about: {
    title: 'La fromagerie',
    story:
      'Claire Ravanel a appris l’affinage chez un affineur de la vallée de Thônes. En 2011, elle a repris une crémerie de quartier rue de la Gare ; en 2014, elle a creusé la cave.\n\nThéo tient la boutique avec elle, et le stand du marché de la vieille ville, le mardi et le vendredi matin, depuis 2019.',
    team: [
      { name: 'Claire', role: 'Affinage et commandes' },
      { name: 'Théo', role: 'Boutique et marché' },
    ],
  },

  faq: [
    { q: 'Faut-il réserver l’appareil à raclette ?', a: 'Oui, deux jours avant le week-end : il en reste rarement le samedi.' },
    { q: 'Peut-on commander un plateau le jour même ?', a: 'Non, 48 heures avant ; une semaine pour les fêtes.' },
    { q: 'Faites-vous des fromages sans lactose ?', a: 'Les fromages affinés longtemps (beaufort 24 mois, vieille tomme) en contiennent très peu ; demandez à Claire, elle vous dira lesquels.' },
  ],

  wording: {
    devis: 'Appeler',
    faqTitle: 'Demandez à Claire',
    contactTitle: '12 rue de la Gare',
    contactText: 'Pour une raclette ou un plateau, appelez aux heures d’ouverture.',
  },
  form: { provider: 'none' },
  images: {},
  seo: { keywords: ['fromagerie Annecy', 'fromager affineur Annecy', 'beaufort d’alpage Annecy', 'location appareil raclette Annecy'] },
  legal: { owner: 'Claire Ravanel', demo: true },
});
