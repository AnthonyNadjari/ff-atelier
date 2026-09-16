/**
 * Demo Finck & Fisch : Plomberie Dumont — plombier-chauffagiste a Nantes.
 * Site fictif de demonstration. Donnees marquees DEMO : fictives, jamais utilisees pour un vrai client.
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'demo-plomberie',
  direction: 'signal',
  motion: 'subtle',
  layout: {
    nav: 'bar',
    hero: 'typographic',
    sections: [
      { type: 'services', variant: 'list' },
      { type: 'proof', variant: 'google' },
      { type: 'zones', variant: 'chips' },
      { type: 'process', variant: 'numbered' },
      { type: 'faq', variant: 'accordion' },
      { type: 'cta', variant: 'phone-giant' },
      { type: 'contact', variant: 'simple' },
    ],
    footer: 'minimal',
  },

  business: {
    name: 'Plomberie Dumont',
    trade: 'Plombier-chauffagiste',
    tagline: 'Une fuite, une chaudière en panne, un WC bouché. <em>On décroche, on vient.</em>',
    description:
      'Plomberie Dumont intervient à Nantes et dans la métropole pour tous les travaux de plomberie et de chauffage : dépannage, installation, rénovation de salle de bain.\n\nAstreinte les soirs, week-ends et jours fériés pour les urgences : fuite, dégât des eaux, panne de chauffage en hiver.',
    since: 2011,
    legalForm: 'EI',
    insurance: 'Assurance décennale MAAF n° 118 227 004',
    certifications: ['RGE'],
  },

  contact: {
    phone: '+33639981021',
    phoneDisplay: '06 39 98 10 21',
    email: 'contact@exemple.fr',
    address: { street: '14 rue de Strasbourg', postalCode: '44000', city: 'Nantes' },
    mapsUrl: 'https://maps.google.com/?q=14+rue+de+Strasbourg+Nantes',
    hours: [
      { days: 'Lundi – samedi', hours: '7h – 20h' },
      { days: 'Urgences', hours: '24h/24, 7j/7' },
    ],
    emergency24h: true,
  },

  zones: {
    cities: ['Nantes', 'Rezé', 'Saint-Herblain', 'Orvault', 'Vertou', 'Bouguenais', 'Carquefou'],
    label: 'Nantes et sa métropole',
  },

  services: [
    {
      slug: 'depannage-fuite',
      title: 'Dépannage fuite d’eau',
      short: 'Fuite visible ou cachée : on localise et on répare le jour même dans la plupart des cas.',
      icon: 'Droplets',
      featured: true,
      priceFrom: 'à partir de 89 €',
      image: { src: '/images/service-1.webp', alt: 'Réparation d’une fuite d’eau sur une canalisation' },
      bullets: ['Recherche de fuite non destructive', 'Réparation ou remplacement de la canalisation', 'Devis avant toute intervention non urgente'],
      description:
        'Une fuite s’aggrave vite : tache au plafond, compteur qui tourne sans raison, odeur d’humidité. On se déplace pour localiser l’origine, sur une canalisation apparente ou encastrée.\n\nSelon les cas, la réparation se fait sur place le jour même. Si la fuite touche une canalisation encastrée, on limite la casse au strict nécessaire pour y accéder.',
    },
    {
      slug: 'debouchage',
      title: 'Débouchage canalisation',
      short: 'Évier, WC, douche ou gouttière bouchés : débouchage mécanique ou par caméra si besoin.',
      icon: 'Wrench',
      image: { src: '/images/service-2.webp', alt: 'Débouchage d’une canalisation' },
      bullets: ['Furet ou hydrocurage selon le bouchon', 'Inspection caméra sur les cas récurrents', 'Conseils pour éviter que ça revienne'],
      description:
        'Un évier qui refuse de s’écouler, des WC qui débordent : on intervient avec le matériel adapté, du furet manuel à l’hydrocurage pour les bouchons anciens.\n\nSi le problème revient souvent, une inspection par caméra permet de voir ce qui se passe réellement dans la canalisation avant de proposer une solution durable.',
    },
    {
      slug: 'chauffe-eau',
      title: 'Chauffe-eau',
      short: 'Installation, remplacement et entretien de chauffe-eau électriques ou thermodynamiques.',
      icon: 'Flame',
      featured: true,
      priceFrom: 'à partir de 450 €',
      image: { src: '/images/service-3.webp', alt: 'Installation d’un chauffe-eau' },
      bullets: ['Chauffe-eau électrique ou thermodynamique', 'Dépose de l’ancien appareil incluse', 'Mise en service et réglages'],
      description:
        'Un chauffe-eau qui ne chauffe plus, ou qui a vingt ans et commence à fuir : on vous conseille sur le remplacement, entre chauffe-eau électrique classique et thermodynamique selon votre logement.\n\nLa dépose de l’ancien appareil, la pose du nouveau et la mise en service sont comprises dans l’intervention.',
    },
    {
      slug: 'salle-de-bain',
      title: 'Rénovation salle de bain',
      short: 'Douche, baignoire, robinetterie : toute la plomberie d’une salle de bain refaite à neuf.',
      icon: 'ShowerHead',
      image: { src: '/images/service-4.webp', alt: 'Rénovation d’une salle de bain' },
      bullets: ['Remplacement baignoire par douche', 'Robinetterie et évacuations', 'Coordination avec carreleur si besoin'],
      description:
        'Remplacer une baignoire par une douche à l’italienne, refaire l’évacuation, changer la robinetterie : on s’occupe de toute la partie plomberie d’une rénovation de salle de bain.\n\nOn travaille seul ou en coordination avec votre carreleur si les travaux sont plus larges.',
    },
    {
      slug: 'chaudiere',
      title: 'Chaudière',
      short: 'Entretien annuel, dépannage et remplacement de chaudières gaz.',
      icon: 'Thermometer',
      bullets: ['Entretien annuel obligatoire', 'Dépannage en cas de panne', 'Remplacement de chaudière gaz'],
      description:
        'L’entretien annuel d’une chaudière gaz est obligatoire et évite la plupart des pannes hivernales. On le réalise avec attestation à l’appui.\n\nEn cas de panne, on intervient rapidement — une chaudière qui lâche en plein hiver ne peut pas attendre.',
    },
  ],

  about: {
    title: 'L’entreprise',
    story:
      'Julien Dumont a repris le métier après huit ans comme salarié chez un chauffagiste nantais. Depuis 2011, l’entreprise porte son nom et son numéro de portable — c’est lui qui décroche, lui qui vient.\n\nAujourd’hui épaulé par un apprenti, il continue à intervenir personnellement sur la plupart des chantiers, du simple joint qui goutte à la chaudière à remplacer.',
    values: [
      { title: 'Réactivité', text: 'Le téléphone est pris directement, pas de standard ni de plateforme.' },
      { title: 'Devis avant travaux', text: 'Sauf urgence, rien n’est fait sans accord préalable sur le prix.' },
      { title: 'Matériel professionnel', text: 'Caméra d’inspection, hydrocureuse : le bon outil pour le bon problème.' },
    ],
    portrait: { src: '/images/portrait.webp', alt: 'Julien Dumont, plombier-chauffagiste, Plomberie Dumont' },
  },

  proof: {
    // DEMO : données fictives
    google: { rating: 4.8, count: 96, url: 'https://maps.google.com/?q=Plomberie+Dumont+Nantes' },
  },

  process: [
    { title: 'Vous appelez', text: 'Décrivez le problème au téléphone, on évalue l’urgence.' },
    { title: 'Diagnostic sur place', text: 'On identifie précisément la panne ou la fuite.' },
    { title: 'Devis clair', text: 'Sauf urgence avérée, aucun travail sans accord sur le prix.' },
    { title: 'Intervention et propreté', text: 'Réparation faite, chantier nettoyé avant de repartir.' },
  ],

  faq: [
    { q: 'Intervenez-vous vraiment la nuit et le week-end ?', a: 'Oui, pour les urgences (fuite, dégât des eaux, panne de chauffage en hiver). Le tarif d’astreinte est indiqué avant l’intervention.' },
    { q: 'Le devis est-il gratuit ?', a: 'Oui pour toute intervention non urgente. En urgence, le prix de la première heure est communiqué par téléphone avant le déplacement.' },
    { q: 'Travaillez-vous aussi pour les professionnels ?', a: 'Oui, syndics et petites copropriétés font partie de la clientèle habituelle.' },
  ],

  social: { facebook: 'https://www.facebook.com/plomberiedumont44' },

  form: { provider: 'mailto' },
  images: {
    hero: { src: '/images/hero.webp', alt: 'Julien Dumont, plombier-chauffagiste, en intervention à Nantes' },
  },
  seo: { keywords: ['plombier Nantes', 'dépannage plomberie Nantes', 'chauffagiste Nantes', 'plombier urgence Nantes'] },
  legal: { owner: 'Julien Dumont' },
});
