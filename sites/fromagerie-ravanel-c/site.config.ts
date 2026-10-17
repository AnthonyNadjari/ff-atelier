// DEMO : fromagerie inventée (Claire Ravanel, fromagère-affineuse à Annecy), piste C « La semaine »
// (refaite le 16 oct 2026 au soir) : le premier écran est la semaine de Claire et Théo, une barre à tickets de
// sept jours ; toucher un jour fait réimprimer le ticket de ce jour (où ils sont, horaires, ce qui se réserve
// encore). Papier blanc, encre noire, un orange franc. Coordonnées fictives (plage ARCEP réservée à la fiction
// 04 65 71), mêmes que la piste A. Aucun avis, aucune note, aucun chiffre de clientèle ; seuls prix du brief :
// « dès 6 € par personne » (plateaux) et la caution de 50 €. Une seule photo (raclette, Wikimedia CC0,
// CREDITS.md), qui ne prétend montrer ni la boutique ni les personnes.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'fromagerie-ravanel-c',
  direction: 'encre',
  // Orange d'étiquette de prix, franc, à la place du noir de la direction : il marque « aujourd'hui », ce qui
  // est encore réservable et l'appel. 4,7:1 sur le papier.
  accent: { h: 20, s: 95, l: 40 },
  typography: { display: 'archivoBlack', body: 'archivo' },
  scale: 'normal',
  motion: 'rich',
  servicePages: false,
  layout: {
    nav: 'custom/barre',
    hero: 'custom/semaine',
    sections: [
      { type: 'custom', variant: 'reserver', label: 'À réserver' },
      { type: 'custom', variant: 'cave', label: 'La cave' },
      { type: 'custom', variant: 'questions', label: 'Questions' },
      { type: 'custom', variant: 'venir', label: 'Venir' },
    ],
    footer: 'custom/pied',
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
    tagline: 'Rue de la Gare à Annecy, et au marché de la vieille ville le mardi et le vendredi matin.',
    description:
      'Fromagerie rue de la Gare, à Annecy, depuis 2011. Les tommes et les reblochons fermiers de six fermes des Aravis et des Bauges finissent de s’affiner dans la cave, sous la boutique. Stand au marché de la vieille ville le mardi et le vendredi matin.\n\nOn goûte avant d’acheter, toujours. Plateaux de 6 à 30 personnes, appareil à raclette prêté, beaufort d’alpage de 12, 18 ou 24 mois.',
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
    mapsProvider: 'none',
    emergency24h: false,
  },

  zones: { cities: ['Annecy'], label: 'Annecy et le marché de la vieille ville' },

  services: [
    {
      slug: 'plateaux',
      title: 'Plateaux sur commande',
      short: 'De 6 à 30 personnes, composés avec vous. À commander 48 heures avant, une semaine avant pour Noël et le Nouvel An.',
      icon: 'ClipboardList',
      featured: true,
      priceFrom: 'dès 6 € par personne',
    },
    {
      slug: 'raclette',
      title: 'Raclette et fondue',
      short: 'Le fromage coupé ou râpé à la demande, et l’appareil à raclette prêté, pour 4 ou 8 personnes, contre une caution de 50 €. À réserver deux jours avant le week-end.',
      icon: 'Flame',
      image: { src: '/images/raclette.webp', alt: 'Fromage à raclette fondu, raclé sur une assiette' },
    },
    {
      slug: 'cave',
      title: 'La cave d’affinage',
      short: 'Une cave à 11 °C sous la boutique, creusée en 2014. Chaque meule porte sa date d’entrée à la craie : demandez-la plus jeune ou plus faite.',
      icon: 'Thermometer',
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
    { q: 'Faut-il réserver l’appareil à raclette ?', a: 'Oui, deux jours avant le week-end : il en reste rarement le samedi. Caution de 50 €.' },
    { q: 'Peut-on commander un plateau le jour même ?', a: 'Non, 48 heures avant. Pour Noël et le Nouvel An, une semaine avant.' },
    { q: 'Avez-vous des fromages sans lactose ?', a: 'Les fromages affinés longtemps, comme le beaufort de 24 mois ou une vieille tomme, en contiennent très peu. Demandez à Claire, elle vous dira lesquels.' },
  ],

  wording: {
    devis: 'Réserver',
    faqTitle: 'Les questions du comptoir',
    contactTitle: 'Rue de la Gare',
    contactText: 'Tout se réserve au téléphone, aux heures d’ouverture.',
  },
  form: { provider: 'none' },
  seo: { keywords: ['fromagerie Annecy', 'plateau de fromages Annecy', 'location appareil raclette Annecy', 'marché vieille ville Annecy fromage'] },
  legal: { owner: 'Claire Ravanel', demo: true },
});
