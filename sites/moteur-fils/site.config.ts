// DEMO : client inventé (Garage Moteur & Fils). Coordonnées fictives (plage 06 39 98), aucun avis.
// Nav, hero et blocs principaux dessinés à la main pour ce site : sites/moteur-fils/sections/.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'moteur-fils',
  direction: 'retro',
  motion: 'rich',
  scale: 'display',
  typography: { display: 'bricolage', body: 'nunito' },
  layout: {
    shell: 'flow',
    nav: 'custom/nav',
    hero: 'custom/hero',
    sections: [
      { type: 'custom', variant: 'augarage', label: 'Services' },
      { type: 'custom', variant: 'avantapres', label: 'Avant / après' },
      { type: 'custom', variant: 'rendezvous', label: 'Rendez-vous' },
      { type: 'faq', variant: 'accordion' },
      { type: 'contact', variant: 'simple' },
    ],
    footer: 'columns',
    divider: 'none',
    tone: 'flat',
  },

  business: {
    name: 'Garage Moteur & Fils',
    trade: 'Garage indépendant, toutes marques',
    tagline: 'On répare ce qui roule, <em>depuis 1994.</em>',
    description:
      'Garage Moteur & Fils entretient et répare toutes les marques à Nancy depuis 1994. Ici, c’est toujours un Moteur qui vous reçoit : le père, puis le fils.\n\nRévision, freinage, pneus, diagnostic électronique, climatisation, carrosserie légère : un seul garage pour (presque) tout, avec un véhicule de courtoisie si besoin.',
    since: 1994,
  },

  contact: {
    phone: '+33639983771',
    phoneDisplay: '06 39 98 37 71',
    email: 'contact@exemple.fr',
    address: { street: '8 rue de la Colline', postalCode: '54000', city: 'Nancy' },
    hours: [
      { days: 'Lundi – vendredi', hours: '8h – 12h, 14h – 18h30' },
      { days: 'Samedi', hours: '9h – 12h' },
    ],
    emergency24h: false,
  },

  services: [
    {
      slug: 'entretien-revision',
      title: 'Entretien et révision',
      short: 'Vidange, filtres, courroies : la révision qui évite la panne.',
      icon: 'Wrench',
      featured: true,
      image: { src: '/images/service-1.webp', alt: 'Mécanicien penché sur un moteur ouvert, en pleine révision' },
    },
    { slug: 'freinage', title: 'Freinage', short: 'Plaquettes, disques, liquide de frein : contrôlés et changés si besoin.', icon: 'Disc3' },
    { slug: 'pneus', title: 'Pneus', short: 'Montage, équilibrage, permutation, pression : on s’occupe de tout.', icon: 'CircleDot' },
    { slug: 'diagnostic', title: 'Diagnostic électronique', short: 'Un voyant allumé, un bruit bizarre : on branche, on cherche, on explique.', icon: 'ScanLine' },
    { slug: 'climatisation', title: 'Climatisation', short: 'Recharge et contrôle du circuit, avant que la chaleur n’arrive.', icon: 'Snowflake' },
    { slug: 'carrosserie', title: 'Carrosserie légère', short: 'Rayures, bosses, petits chocs : remis en forme sans détour par l’assurance.', icon: 'PaintBucket' },
  ],

  about: {
    title: 'Le garage',
    story:
      'André Moteur a ouvert le garage en 1994, à deux pas de la Colline. Son fils Julien l’a rejoint quinze ans plus tard, et c’est aujourd’hui lui qui tient la clé la plupart du temps.\n\nOn travaille sur toutes les marques, on prépare aussi les véhicules au contrôle technique en partenariat avec un centre agréé tout proche.',
  },

  faq: [
    { q: 'Quel délai pour un rendez-vous ?', a: 'Ça dépend de la période, mais un appel suffit pour savoir si on peut vous prendre le jour même ou dans la semaine. Pour une urgence, dites-le au téléphone.' },
    { q: 'Le véhicule de courtoisie est-il disponible ?', a: 'Nous proposons un véhicule de courtoisie selon disponibilité, à réserver au moment de la prise de rendez-vous si votre voiture doit rester plus d’une journée.' },
    { q: 'Le devis est-il gratuit ?', a: 'Nous vous expliquons toujours ce qui doit être fait et son coût avant de commencer. Aucune réparation n’est engagée sans votre accord.' },
    { q: 'Travaillez-vous sur toutes les marques ?', a: 'Oui, toutes marques, françaises comme étrangères, y compris les modèles récents avec électronique embarquée.' },
  ],

  form: { provider: 'mailto' },

  wording: {
    devis: 'Prendre rendez-vous',
    ctaTitle: 'Un bruit bizarre&nbsp;? <em>Passez, on écoute.</em>',
    contactTitle: 'Prendre rendez-vous',
    contactText: 'Un appel, et on trouve un créneau qui vous arrange.',
  },

  images: {},

  seo: {
    keywords: ['garage Nancy', 'mécanicien Nancy', 'entretien voiture Nancy', 'garage toutes marques Nancy'],
  },

  legal: { owner: 'Famille Moteur' },
});
