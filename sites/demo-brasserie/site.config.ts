// DEMO : client fictif (Brasserie de la Cluse, Oyonnax), brief sites/demo-brasserie/brief.md. Téléphone dans la
// plage fictive de l'ARCEP ; revendeurs, personnes et histoire inventés pour la démonstration, et le site le dit
// (legal.demo). Aucun avis, aucune note. Style experimentalcc en entier (docs/veille/styles/experimentalcc.md, 29 oct 2026) :
// portrait vertical et nom en exclusion, une fiche par revendeur, bande terre cuite ; photos d'illustration (CREDITS.md).
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'demo-brasserie',
  scale: 'display',
  images: {
    hero: {
      src: '/images/hero.webp',
      alt: 'Brauerei Kupferkessel Forsthaus Templin',
    },
    illustration: true,
  },
  direction: 'experimentalcc',
  motion: 'rich',
  layout: {
    nav: 'bar',
    hero: 'portrait-exclusion',
    sections: [
      { type: 'zones', variant: 'fiches' },
      { type: 'custom', variant: 'consigne', label: 'La consigne' },
      { type: 'proof', variant: 'gallery' },
      { type: 'about', variant: 'story' },
      { type: 'services', variant: 'list' },
      { type: 'faq', variant: 'accordion' },
      { type: 'cta', variant: 'band' },
      { type: 'contact', variant: 'simple' },
    ],
    footer: 'minimal',
    divider: 'none',
    tone: 'flat',
    headings: 'center',
  },

  business: {
    name: 'Brasserie de la Cluse',
    trade: 'Brasserie artisanale',
    tagline: 'Nos bières, près de chez vous.',
    description:
      'Une brasserie artisanale dans l’ancien moulin de la famille, à Oyonnax. Quatre bières bio, brassées avec l’eau de la source du moulin.\n\nOn les trouve à la brasserie le jeudi, le vendredi et le samedi matin, et chez une dizaine de commerces du Haut-Bugey et du Jura.',
    since: 2017,
    certifications: ['Bières certifiées bio (AB)'],
  },
  contact: {
    phone: '+33465714802',
    phoneDisplay: '04 65 71 48 02',
    email: 'contact@exemple.fr',
    address: { street: '3 chemin du Moulin', postalCode: '01100', city: 'Oyonnax' },
    hours: [
      { days: 'Jeudi et vendredi', hours: '16 h – 19 h' },
      { days: 'Samedi', hours: '10 h – 13 h' },
      { days: 'Du dimanche au mercredi', hours: 'Fermé' },
    ],
  },
  zones: { cities: ['Oyonnax', 'Nantua', 'Port', 'Saint-Claude', 'Moirans-en-Montagne'] },

  services: [
    { slug: 'blonde-du-moulin', title: 'La Blonde du Moulin', short: 'Blonde légère, 4,8 %, houblon d’Alsace.', featured: true },
    { slug: 'ambree-de-la-cluse', title: 'L’Ambrée de la Cluse', short: 'Ambrée ronde, 5,6 %, malt caramel.' },
    { slug: 'la-noire', title: 'La Noire', short: 'Stout sec, 6 %, des notes de café torréfié.' },
    { slug: 'la-saison', title: 'La Saison', short: 'Bière de saison, du printemps à l’automne, 5,2 %.' },
  ],

  revendeurs: {
    liste: [
      { nom: 'Cave du Lac', type: 'Caviste', commune: 'Nantua', secteur: 'Haut-Bugey', consigne: true },
      { nom: 'Bar Le Comptoir', type: 'Bar', commune: 'Oyonnax', secteur: 'Haut-Bugey', pression: true },
      { nom: 'Épicerie Vrac & Co', type: 'Épicerie', commune: 'Oyonnax', secteur: 'Haut-Bugey' },
      { nom: 'Café de la Place', type: 'Bar', commune: 'Nantua', secteur: 'Haut-Bugey', pression: true },
      { nom: 'Biocoop des Monts', type: 'Épicerie', commune: 'Oyonnax', secteur: 'Haut-Bugey', consigne: true },
      { nom: 'Restaurant L’Écluse', type: 'Restaurant', commune: 'Port', secteur: 'Haut-Bugey' },
      { nom: 'Cave des Coteaux', type: 'Caviste', commune: 'Saint-Claude', secteur: 'Jura', consigne: true },
      { nom: 'Le Bistrot du Pont', type: 'Bar', commune: 'Saint-Claude', secteur: 'Jura', pression: true },
      { nom: 'Épicerie La Halle', type: 'Épicerie', commune: 'Moirans-en-Montagne', secteur: 'Jura' },
    ],
    surPlace: 'Boutique et visite de la brasserie le samedi matin, sans réserver. Fûts de 20 litres pour les fêtes, à réserver une semaine avant : la tireuse est prêtée avec le fût.',
    consigne: 'Bouteilles de 75 cl consignées : 20 centimes rendus par bouteille, à la brasserie et chez les revendeurs marqués « reprend la consigne ».',
    pros: 'Vous tenez un bar, une cave ou une épicerie ? Appelez Camille au 04 65 71 48 02.',
  },

  about: {
    title: 'Le moulin',
    story:
      'Julien Arnaud était chaudronnier. En 2017, il a monté la brasserie dans l’ancien moulin de son grand-père, chemin du Moulin, et brassé le premier brassin avec l’eau de la source, analysée chaque année.\n\nLes bières sont bio depuis 2020. En 2023, une nouvelle salle de brassage de 10 hectolitres. Camille tient la boutique et s’occupe des revendeurs.',
    values: [],
  },
  proof: {
    gallery: [
      {
        src: '/images/galerie-1.webp',
        alt: 'Beck & Co. Bremen, Sudhaus-2',
      },
      {
        src: '/images/galerie-2.webp',
        alt: 'GER, BY – Oberbayern, München, Hochstraße 77 (Paulaner am Nockherberg, Rotunde) 2020',
      },
      {
        src: '/images/galerie-3.webp',
        alt: 'Beer bottles 2018 G1',
      },
      {
        src: '/images/galerie-4.webp',
        alt: 'Munkhenskoye Beer bottle',
      },
      {
        src: '/images/galerie-5.webp',
        alt: 'Humulus lupulus, Montour Trail, 2024-09-19-1',
      },
    ],
  },

  faq: [
    { q: 'Peut-on visiter la brasserie ?', a: 'Oui, le samedi matin pendant l’ouverture de la boutique, sans réserver.' },
    { q: 'Comment réserver un fût ?', a: 'Par téléphone, une semaine avant. La tireuse est prêtée avec le fût.' },
    { q: 'Où rapporter les bouteilles ?', a: 'À la brasserie, ou chez les revendeurs marqués « reprend la consigne ».' },
  ],

  wording: {
    revendeurs: 'Où trouver nos bières',
    trouver: 'Où trouver nos bières ?',
    servicesNav: 'Nos bières',
    devis: 'Nous écrire',
    ctaTitle: 'Une question, une commande&nbsp;?',
    ctaText: 'Un appel suffit, on vous répond dans la journée.',
    contactTitle: 'Nous joindre',
  },
  form: { provider: 'mailto' },
  seo: { keywords: ['brasserie artisanale Oyonnax', 'bière bio Haut-Bugey', 'où acheter bière Oyonnax'] },
  legal: { owner: 'Julien Arnaud', demo: true },
});
