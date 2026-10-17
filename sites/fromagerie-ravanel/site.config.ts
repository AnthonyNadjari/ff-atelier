// DEMO : fromagerie inventée (Claire Ravanel, fromagère-affineuse à Annecy). Piste A « L'ardoise », refaite le
// 16 oct 2026 au soir après « très similaire sur les animations » (docs/veille/pourquoi-ia-2026-10.md).
// Coordonnées fictives (plage ARCEP réservée à la fiction 04 65 71). Aucun avis, aucune note, aucun chiffre de
// clientèle, aucune photo : la page est l'ardoise du comptoir, écrite à la craie (direction.md).
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'fromagerie-ravanel',
  direction: 'nuit',
  // Craie jaune pour ce qu'on entoure (le geste de l'ardoise) ; le blanc de craie est le --fg de la direction.
  accent: { h: 47, s: 82, l: 70 },
  typography: { display: 'savate', body: 'specialGothic' },
  scale: 'normal',
  motion: 'rich',
  servicePages: false,
  layout: {
    nav: 'custom/nav',
    hero: 'custom/hero',
    sections: [
      { type: 'custom', variant: 'ardoise', label: 'L’ardoise' },
      { type: 'custom', variant: 'reserver', label: 'Réserver' },
      { type: 'custom', variant: 'questions' },
      { type: 'custom', variant: 'venir', label: 'Venir' },
    ],
    footer: 'minimal',
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
    tagline: 'Fromagerie Ravanel',
    description:
      'Fromager-affineur rue de la Gare, à Annecy, depuis 2011. Les fromages de six fermes des Aravis et des Bauges, affinés dans la cave sous la boutique. On goûte avant d’acheter, toujours.',
    since: 2011,
  },

  contact: {
    phone: '+33465712318',
    phoneDisplay: '04 65 71 23 18',
    address: { street: '12 rue de la Gare', postalCode: '74000', city: 'Annecy' },
    hours: [
      { days: 'Mardi à vendredi', hours: '8 h 30 à 12 h 30, 15 h 30 à 19 h' },
      { days: 'Samedi', hours: '8 h à 13 h, 15 h à 19 h' },
      { days: 'Dimanche', hours: '8 h 30 à 12 h 30' },
      { days: 'Lundi', hours: 'Fermé' },
    ],
    emergency24h: false,
  },

  zones: { cities: ['Annecy'], label: 'Annecy et le marché de la vieille ville' },

  services: [
    {
      slug: 'cave',
      title: 'La cave d’affinage',
      short: 'Une cave à 11 °C sous la boutique. Chaque meule porte sa date d’entrée à la craie ; demandez plus jeune ou plus fait.',
      icon: 'Thermometer',
      featured: true,
    },
    {
      slug: 'plateaux',
      title: 'Plateaux sur commande',
      short: 'De 6 à 30 personnes, composés avec vous. À commander 48 heures avant, une semaine avant pour Noël et le Nouvel An.',
      icon: 'ClipboardList',
      priceFrom: 'dès 6 € par personne',
    },
    {
      slug: 'raclette',
      title: 'Raclette et fondue',
      short: 'Le fromage coupé ou râpé à la demande, et l’appareil à raclette (4 ou 8 personnes) prêté contre une caution de 50 €.',
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
    title: 'Claire et Théo',
    story:
      'Claire Ravanel a appris l’affinage chez un affineur de la vallée de Thônes. En 2011, elle a repris une crémerie de quartier rue de la Gare ; en 2014, elle a creusé la cave.\n\nThéo tient la boutique avec elle, et le stand du marché de la vieille ville le mardi et le vendredi matin, depuis 2019.',
  },

  faq: [
    { q: 'Faut-il réserver l’appareil à raclette ?', a: 'Oui, deux jours avant le week-end : il en reste rarement le samedi. Caution de 50 €, rendue au retour de l’appareil.' },
    { q: 'Peut-on commander un plateau le jour même ?', a: 'Non, 48 heures avant. Pour Noël et le Nouvel An, une semaine avant.' },
    { q: 'Avez-vous des fromages qui contiennent peu de lactose ?', a: 'Les fromages affinés longtemps, comme le beaufort de 24 mois ou une vieille tomme, en contiennent très peu. Demandez à Claire, elle vous dira lesquels.' },
  ],

  wording: {
    devis: 'Réserver',
    faqTitle: 'On nous demande souvent',
    contactTitle: 'Rue de la Gare',
    contactText: 'Pour un plateau, dites le nombre de personnes et le jour ; pour la raclette, le jour où vous passez prendre l’appareil.',
  },
  form: { provider: 'none' },
  seo: { keywords: ['fromagerie Annecy', 'fromager affineur Annecy', 'beaufort d’alpage Annecy', 'location appareil raclette Annecy'] },
  legal: { owner: 'Claire Ravanel', demo: true },
});
