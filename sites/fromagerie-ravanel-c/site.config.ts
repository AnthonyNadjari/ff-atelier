// DEMO : fromagerie inventée (Claire Ravanel, fromagère-affineuse à Annecy), piste C « Le comptoir »
// (16 oct 2026) : affiche de marché, aplats francs, nom énorme, plateau qui se règle au doigt. Essai
// complètement différent de la piste A (sites/fromagerie-ravanel) et de la piste B. Coordonnées fictives
// (plage ARCEP réservée à la fiction 04 65 71), mêmes que la piste A. Aucun avis, aucune note, aucun
// chiffre de clientèle ; seul prix : « dès 6 € par personne » (plateaux) et la caution de 50 €.
// Photos : Wikimedia Commons (CREDITS.md), aucune ne prétend montrer la boutique, la cave ou les personnes.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'fromagerie-ravanel-c',
  direction: 'pop',
  // Outremer franc à la place du rose de la direction : ciel et lac, jamais le rouge des nappes à carreaux.
  accent: { h: 226, s: 78, l: 44 },
  typography: { display: 'alfaSlabOne', body: 'karla' },
  scale: 'normal',
  motion: 'rich',
  layout: {
    nav: 'custom/nav',
    hero: 'custom/hero',
    sections: [
      { type: 'custom', variant: 'plateau', label: 'Plateaux' },
      { type: 'custom', variant: 'raclette', label: 'Raclette' },
      { type: 'custom', variant: 'beaufort', label: 'Beaufort' },
      { type: 'custom', variant: 'cave', label: 'La cave' },
      { type: 'faq', variant: 'two-columns' },
      { type: 'custom', variant: 'contact', label: 'Venir' },
    ],
    footer: 'custom/pied',
    shell: 'sticky-hero',
    divider: 'none',
    tone: 'flat',
    headings: 'left',
    contactDrawer: false,
  },

  business: {
    name: 'Fromagerie Ravanel',
    trade: 'Fromager-affineur',
    tagline: 'Les fromages de six fermes des Aravis et des Bauges, affinés dans la cave sous la boutique.',
    description:
      'Fromagerie rue de la Gare, à Annecy. Les tommes et les reblochons fermiers de six fermes des Aravis et des Bauges finissent de s’affiner dans la cave, sous la boutique.\n\nOn goûte avant d’acheter, toujours. Plateaux de 6 à 30 personnes, appareil à raclette prêté, beaufort d’alpage de 12, 18 ou 24 mois.',
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
      short: 'Le fromage coupé ou râpé à la demande, et l’appareil à raclette prêté, pour 4 ou 8 personnes, contre une caution de 50 €.',
      icon: 'Flame',
      image: { src: '/images/raclette.webp', alt: 'Tranches de fromage à raclette sur une assiette' },
    },
    {
      slug: 'cave',
      title: 'La cave d’affinage',
      short: 'Une cave à 11 °C sous la boutique. Chaque meule porte sa date d’entrée à la craie : demandez-la plus jeune ou plus faite.',
      icon: 'Thermometer',
      image: { src: '/images/cave.webp', alt: 'Meules de fromage sur des planches de bois dans une cave d’affinage' },
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
      'Claire Ravanel a appris l’affinage chez un affineur de la vallée de Thônes. En 2011, elle a repris une crémerie de quartier rue de la Gare ; en 2014, elle a creusé la cave.\n\nThéo tient la boutique avec elle, et le stand du marché de la vieille ville le mardi et le vendredi matin, depuis 2019.',
  },

  faq: [
    { q: 'Faut-il réserver l’appareil à raclette ?', a: 'Oui, deux jours avant le week-end : il en reste rarement le samedi. Caution de 50 €.' },
    { q: 'Peut-on commander un plateau le jour même ?', a: 'Non, 48 heures avant. Pour Noël et le Nouvel An, une semaine avant.' },
    { q: 'Avez-vous des fromages qui contiennent peu de lactose ?', a: 'Les fromages affinés longtemps, comme le beaufort de 24 mois ou une vieille tomme, en contiennent très peu. Demandez à Claire, elle vous dira lesquels.' },
  ],

  wording: {
    devis: 'Réserver',
    faqTitle: 'Ce qu’on nous demande au comptoir',
    contactTitle: 'Tout se réserve au téléphone.',
    contactText: 'Aux heures d’ouverture. Pour un plateau, dites le nombre de personnes et le jour ; pour la raclette, le jour où vous passez prendre l’appareil.',
  },
  form: { provider: 'none' },
  images: {
    hero: { src: '/images/cave.webp', alt: 'Meules de fromage sur des planches de bois dans une cave d’affinage' },
  },
  seo: { keywords: ['fromagerie Annecy', 'plateau de fromages Annecy', 'location appareil raclette Annecy', 'beaufort d’alpage Annecy'] },
  legal: { owner: 'Claire Ravanel', demo: true },
});
