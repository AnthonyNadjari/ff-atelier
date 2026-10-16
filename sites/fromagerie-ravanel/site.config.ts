// DEMO : fromagerie inventée (Claire Ravanel, fromagère-affineuse à Annecy), premier test de la skill
// /site-final (16 oct 2026). Coordonnées fictives (plage ARCEP réservée à la fiction 04 65 71). Aucun avis,
// aucune note, aucun chiffre de clientèle. Photos : Wikimedia Commons (CREDITS.md), aucune ne prétend
// montrer la boutique, la cave de la rue de la Gare ou les personnes.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'fromagerie-ravanel',
  direction: 'terre',
  typography: { display: 'savate', body: 'hanken' },
  scale: 'normal',
  motion: 'rich',
  layout: {
    nav: 'bar',
    hero: 'custom/hero',
    sections: [
      { type: 'custom', variant: 'age', label: 'Le beaufort' },
      { type: 'custom', variant: 'cave', label: 'La cave' },
      { type: 'custom', variant: 'reserver', label: 'Réserver' },
      { type: 'faq', variant: 'accordion' },
      { type: 'contact', variant: 'simple' },
    ],
    footer: 'minimal',
    shell: 'flow',
    divider: 'none',
    tone: 'flat',
    headings: 'left',
    contactDrawer: false,
  },

  business: {
    name: 'Fromagerie Ravanel',
    trade: 'Fromager-affineur',
    tagline: 'Ici, les fromages des Aravis et des Bauges <em>s’affinent sous la boutique.</em>',
    description:
      'Fromagerie rue de la Gare, à Annecy. Les tommes et les reblochons fermiers de six fermes des Aravis et des Bauges finissent de s’affiner dans la cave, sous la boutique.\n\nOn goûte avant d’acheter, toujours. Et on vous le coupe plus jeune ou plus fait, comme vous l’aimez.',
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
      short: 'Une cave à 11 °C sous la boutique. Chaque meule porte sa date d’entrée à la craie.',
      icon: 'Thermometer',
      featured: true,
      image: { src: '/images/cave.webp', alt: 'Meules de fromage sur des planches de bois dans une cave d’affinage' },
    },
    {
      slug: 'plateaux',
      title: 'Plateaux sur commande',
      short: 'De 6 à 30 personnes, composés avec vous. À commander 48 heures avant.',
      icon: 'ClipboardList',
      priceFrom: 'dès 6 € par personne',
    },
    {
      slug: 'raclette',
      title: 'Raclette et fondue',
      short: 'Le fromage coupé ou râpé à la demande, et l’appareil à raclette prêté contre caution.',
      icon: 'Flame',
      image: { src: '/images/raclette.webp', alt: 'Tranches de fromage à raclette sur une assiette' },
    },
    {
      slug: 'comptoir',
      title: 'Le comptoir',
      short: 'Beurre de baratte, crème crue, yaourts de la ferme, et quelques vins de Savoie.',
      icon: 'Milk',
    },
  ],

  about: {
    title: 'La fromagerie',
    story:
      'Claire Ravanel a appris l’affinage chez un affineur de la vallée de Thônes. En 2011, elle a repris une crémerie de quartier rue de la Gare ; en 2014, elle a creusé la cave.\n\nThéo tient la boutique avec elle et le stand du marché de la vieille ville, le mardi et le vendredi matin, depuis 2019.',
  },

  faq: [
    { q: 'Faut-il réserver l’appareil à raclette ?', a: 'Oui, deux jours avant le week-end : il en reste rarement le samedi. Caution de 50 €, rendue au retour de l’appareil.' },
    { q: 'Peut-on commander un plateau le jour même ?', a: 'Non, 48 heures avant. Pour Noël et le Nouvel An, une semaine avant.' },
    { q: 'Avez-vous des fromages qui contiennent peu de lactose ?', a: 'Les fromages affinés longtemps, comme le beaufort de 24 mois ou une vieille tomme, en contiennent très peu. Demandez à Claire, elle vous dira lesquels.' },
  ],

  wording: {
    devis: 'Réserver',
    faqTitle: 'Ce qu’on nous demande au comptoir',
    contactTitle: 'Pour réserver, appelez la boutique.',
    contactText: 'Aux heures d’ouverture. Pour un plateau, dites le nombre de personnes et le jour ; pour la raclette, le jour où vous passez la prendre.',
  },
  form: { provider: 'none' },
  images: {
    hero: { src: '/images/cave.webp', alt: 'Meules de fromage sur des planches de bois dans une cave d’affinage' },
  },
  seo: { keywords: ['fromagerie Annecy', 'fromager affineur Annecy', 'beaufort d’alpage Annecy', 'location appareil raclette Annecy'] },
  legal: { owner: 'Claire Ravanel', demo: true },
});
