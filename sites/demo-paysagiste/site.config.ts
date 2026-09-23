/**
 * Demo Finck & Fisch : Les Jardins de Lise — paysagiste a Rennes.
 * Site fictif de demonstration. Donnees marquees DEMO : fictives, jamais utilisees pour un vrai client.
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'demo-paysagiste',
  direction: 'terre',
  motion: 'rich',
  layout: {
    nav: 'split',
    hero: 'stacked',
    sections: [
      { type: 'services', variant: 'alternating' },
      { type: 'about', variant: 'story' },
      { type: 'proof', variant: 'before-after' },
      { type: 'zones', variant: 'map' },
      { type: 'process', variant: 'timeline' },
      { type: 'cta', variant: 'card' },
      { type: 'contact', variant: 'form-split' },
    ],
    footer: 'columns',
  },

  business: {
    name: 'Les Jardins de Lise',
    trade: 'Paysagiste',
    tagline: 'Un jardin qui vous ressemble, <em>qui pousse avec le temps.</em>',
    description:
      'Les Jardins de Lise conçoivent, plantent et entretiennent des jardins à Rennes et alentours, pour les particuliers comme pour les petits collectifs.\n\nCréation de jardins, entretien régulier, taille et arrosage automatique : chaque projet part du terrain, de son sol et de son exposition, pas d’un catalogue de plantes.',
    since: 2013,
    legalForm: 'EURL',
    insurance: 'Assurance décennale Groupama n° 552 019 887',
  },

  contact: {
    phone: '+33639984054',
    phoneDisplay: '06 39 98 40 54',
    email: 'contact@exemple.fr',
    address: { street: '5 rue de la Chalotais', postalCode: '35000', city: 'Rennes' },
    mapsUrl: 'https://maps.google.com/?q=5+rue+de+la+Chalotais+Rennes',
    mapsEmbed: 'https://www.google.com/maps?q=Rennes&output=embed',
    hours: [
      { days: 'Lundi – vendredi', hours: '8 h – 17 h 30' },
      { days: 'Samedi', hours: 'Sur rendez-vous, période haute (mars – octobre)' },
    ],
    emergency24h: false,
  },

  zones: {
    cities: ['Rennes', 'Cesson-Sévigné', 'Saint-Grégoire', 'Bruz', 'Chantepie', 'Pacé', 'Betton'],
    label: 'Rennes et sa périphérie',
  },

  services: [
    {
      slug: 'creation-jardins',
      title: 'Création de jardins',
      short: 'Conception et plantation d’un jardin pensé pour votre terrain et votre usage.',
      icon: 'Leaf',
      featured: true,
      image: { src: '/images/service-1.webp', alt: 'Création d’un jardin par Les Jardins de Lise' },
      bullets: ['Visite et étude du sol', 'Plan de plantation', 'Choix d’essences adaptées au climat breton'],
      description:
        'Un jardin réussi commence par une bonne lecture du terrain : exposition, nature du sol, vis-à-vis. On en tire un plan de plantation qui privilégie des essences adaptées au climat breton, moins gourmandes en entretien.\n\nLa plantation se fait par étapes si le budget le demande, avec un ordre de priorité établi ensemble.',
    },
    {
      slug: 'entretien',
      title: 'Entretien des espaces verts',
      short: 'Tonte, désherbage, entretien régulier pour un jardin qui reste beau toute l’année.',
      icon: 'Sparkles',
      image: { src: '/images/service-2.webp', alt: 'Entretien d’un espace vert' },
      bullets: ['Passages réguliers ou ponctuels', 'Tonte, désherbage, ramassage', 'Contrat annuel possible'],
      description:
        'Un jardin demande un entretien régulier pour rester agréable : tonte, désherbage, nettoyage des massifs. On propose des passages ponctuels ou un contrat annuel, avec une fréquence adaptée à la saison.',
    },
    {
      slug: 'taille-elagage',
      title: 'Taille et élagage',
      short: 'Taille de haies, d’arbustes et élagage d’arbres jusqu’à taille moyenne.',
      icon: 'TreePine',
      featured: true,
      image: { src: '/images/service-3.webp', alt: 'Taille d’une haie par Les Jardins de Lise' },
      bullets: ['Taille de formation ou d’entretien', 'Élagage raisonné', 'Évacuation des déchets verts'],
      description:
        'La taille d’une haie ou d’un arbuste se fait au bon moment de l’année pour ne pas compromettre la floraison suivante. Pour les arbres de taille moyenne, on élague dans le respect de leur forme naturelle.\n\nLes déchets verts sont évacués ou broyés sur place selon votre préférence.',
    },
    {
      slug: 'terrasses-allees',
      title: 'Terrasses et allées',
      short: 'Création de terrasses en bois ou pierre naturelle, allées en gravier ou pas japonais.',
      icon: 'Ruler',
      image: { src: '/images/service-4.webp', alt: 'Terrasse en bois aménagée dans un jardin' },
      bullets: ['Terrasse bois ou pierre naturelle', 'Allées gravier ou pas japonais', 'Intégration au jardin existant'],
      description:
        'Une terrasse ou une allée s’intègre au reste du jardin plutôt que de s’y imposer. On travaille le bois, la pierre naturelle et le gravier selon le style recherché et le budget disponible.',
    },
    {
      slug: 'arrosage',
      title: 'Arrosage automatique',
      short: 'Installation d’un système d’arrosage automatique, programmé selon vos plantations.',
      icon: 'Droplets',
      bullets: ['Étude du réseau existant', 'Programmateur et zones différenciées', 'Économie d’eau à la clé'],
      description:
        'Un système d’arrosage automatique bien conçu évite le gaspillage d’eau : zones différenciées selon les besoins des plantations, programmateur réglé selon la saison.',
    },
  ],

  about: {
    title: 'L’atelier',
    story:
      'Lise Quéré a débuté comme apprentie chez un pépiniériste avant de passer son CAP puis son BTS Aménagements paysagers. Elle crée son entreprise en 2013, seule d’abord, avec une camionnette et un carnet de clients qui se construit de bouche à oreille.\n\nAujourd’hui elle est accompagnée de deux ouvriers paysagistes. L’équipe reste volontairement petite : c’est elle qui rencontre chaque client et qui dessine chaque projet.',
    milestones: [
      { year: '2013', text: 'Création de l’entreprise, premiers chantiers chez des particuliers rennais.' },
      { year: '2016', text: 'Premier chantier d’envergure : le jardin d’une résidence à Cesson-Sévigné.' },
      { year: '2019', text: 'Arrivée du premier ouvrier paysagiste, l’équipe passe à deux.' },
      { year: '2023', text: 'Installation dans un nouvel atelier avec serre de production, rue de la Chalotais.' },
    ],
    portrait: { src: '/images/portrait.webp', alt: 'Lise Quéré, paysagiste, Les Jardins de Lise' },
  },

  proof: {
    beforeAfter: [
      {
        before: { src: '/images/avant.webp', alt: 'Jardin avant intervention, pelouse et massifs négligés' },
        after: { src: '/images/apres.webp', alt: 'Même jardin après création de massifs et allée en gravier' },
        caption: 'Création de jardin à Cesson-Sévigné, 2024',
      },
    ],
  },

  process: [
    { title: 'Visite du terrain', text: 'On regarde le sol, l’exposition, l’existant à conserver ou non.' },
    { title: 'Proposition et devis', text: 'Un plan et un chiffrage détaillé, par étapes si besoin.' },
    { title: 'Plantation et travaux', text: 'Réalisation selon le calendrier le plus favorable aux végétaux.' },
    { title: 'Suivi', text: 'Conseils d’entretien, et contrat de suivi si vous le souhaitez.' },
  ],

  social: { instagram: 'https://www.instagram.com/lesjardinsdelise', facebook: 'https://www.facebook.com/lesjardinsdelise' },

  form: { provider: 'mailto' },
  images: {
    hero: { src: '/images/hero.webp', alt: 'Jardin aménagé par Les Jardins de Lise à Rennes' },
  },
  seo: { keywords: ['paysagiste Rennes', 'création jardin Rennes', 'entretien jardin Rennes', 'élagage Rennes'] },
  legal: { owner: 'Lise Quéré' },
});
