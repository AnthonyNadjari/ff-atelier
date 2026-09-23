// DEMO : cliente inventée
// Hero, nav et blocs principaux dessinés à la main pour ce site : sites/anna-vidal/sections/.
//
// Squelette (21 sept 2026) : coquille `index` — le menu EST la page. Ses quatre séries (mariage,
// élopement, famille, portrait = services, chacune avec sa photo) sont les quatre premières entrées,
// en liens réels vers /services/<slug>, photo révélée au survol ; galerie, manifeste, FAQ et contact
// se déroulent sous leur entrée. Un seul geste riche : l'image de survol. Le hero sur mesure
// (sections/Hero.astro, data-pin) n'est plus rendu par cette coquille ; Instants et Formules sortent du
// layout (les séries en liens et les pages de prestation portent déjà photos et contenus) ; Series
// perd son data-horizontal et Manifeste son data-text-fill (effets pilotés par le scroll, incompatibles
// avec un panneau <details> fermé).
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'anna-vidal',
  direction: 'nuit',
  typography: { display: 'playfair', body: 'instrumentSans' },
  motion: 'rich',
  scale: 'display',
  layout: {
    shell: 'index',
    nav: 'custom/nav',
    hero: 'custom/hero',
    sections: [
      { type: 'custom', variant: 'series', label: 'Galerie' },
      { type: 'custom', variant: 'manifeste', label: 'Manifeste' },
      { type: 'faq', variant: 'accordion' },
      { type: 'contact', variant: 'form-card' },
    ],
    footer: 'minimal',
    divider: 'none',
    tone: 'flat',
  },

  business: {
    name: 'Anna Vidal',
    trade: 'Photographe de mariage et de famille',
    tagline: 'Vos journées, <em>racontées sans les rejouer.</em>',
    description:
      'Photographe de mariage et de famille à Bordeaux depuis 2013. Argentique pour la cérémonie, numérique pour le reste, toujours dans la discrétion. Déplacements en Nouvelle-Aquitaine et au-delà.',
    since: 2013,
  },

  contact: {
    phone: '+33639985226',
    phoneDisplay: '06 39 98 52 26',
    email: 'contact@exemple.fr',
    address: { postalCode: '33000', city: 'Bordeaux' },
    hours: [],
  },

  zones: { label: 'Nouvelle-Aquitaine et au-delà' },

  services: [
    {
      slug: 'mariage',
      title: 'Mariage',
      short: 'Journée complète, des préparatifs à l’ouverture du bal.',
      icon: 'Camera',
      featured: true,
      bullets: [
        'Préparatifs jusqu’à l’ouverture du bal',
        'Reportage discret, aucune pose imposée',
        'La cérémonie en argentique',
        'Galerie numérique privée sous 6 semaines',
      ],
      image: { src: '/images/service-1.webp', alt: 'Préparatifs de mariée, lumière du matin' },
    },
    {
      slug: 'elopement',
      title: 'Élopement',
      short: 'Un jour, deux personnes, un lieu choisi ensemble.',
      icon: 'Heart',
      featured: true,
      bullets: [
        'Un jour, deux personnes, un lieu choisi ensemble',
        'Repérage et lumière pensés en amont',
        'Reportage libre, sans mise en scène',
        'Galerie complète sous 3 semaines',
      ],
      image: { src: '/images/service-2.webp', alt: 'Couple en élopement, lumière naturelle' },
    },
    {
      slug: 'famille',
      title: 'Famille',
      short: 'Une séance chez vous ou dehors, au rythme des enfants.',
      icon: 'Users',
      featured: true,
      bullets: [
        'Séance d’une heure, chez vous ou dehors',
        'Enfants et animaux bienvenus, rythme libre',
        'Une trentaine de photos sélectionnées',
        'Tirages sur demande',
      ],
      image: { src: '/images/service-3.webp', alt: 'Famille en extérieur, lumière naturelle' },
    },
    {
      slug: 'portrait',
      title: 'Portrait',
      short: 'Une courte séance en lumière naturelle, à Bordeaux.',
      icon: 'Aperture',
      bullets: [
        'Séance courte en lumière naturelle',
        'Studio ou extérieur à Bordeaux',
        'Une dizaine de photos retouchées',
        'Livraison sous 2 semaines',
      ],
      image: { src: '/images/service-4.webp', alt: 'Portrait en lumière naturelle' },
    },
  ],

  about: {
    story:
      'Anna Vidal photographie des mariages et des familles à Bordeaux depuis 2013, en argentique et en numérique.\n\nElle se déplace en Nouvelle-Aquitaine et au-delà, et travaille en retrait, sans mise en scène.',
  },

  faq: [
    {
      q: 'Sous combien de temps est-ce que je reçois mes photos ?',
      a: 'Pour un mariage, comptez environ 6 semaines : le temps de développer et scanner l’argentique de la cérémonie, puis de trier l’ensemble. Pour une famille, un portrait ou un élopement, la galerie est prête sous 2 à 3 semaines.',
    },
    {
      q: 'Combien de photos vais-je recevoir ?',
      a: 'Cela dépend de la durée de la séance et de ce qu’il s’y passe, pas d’un chiffre fixé à l’avance. Pour un mariage, comptez plusieurs centaines de photos ; pour une séance famille ou portrait, quelques dizaines, sélectionnées.',
    },
    {
      q: 'Vous déplacez-vous en dehors de Bordeaux ?',
      a: 'Oui, régulièrement, en Nouvelle-Aquitaine et au-delà. Les frais de déplacement au-delà d’un certain rayon autour de Bordeaux sont ajoutés au devis, en toute transparence.',
    },
    {
      q: 'Puis-je utiliser mes photos comme je le souhaite ?',
      a: 'Les photos livrées sont à vous, pour un usage personnel et privé : tirages, albums, partage à vos proches. Pour tout usage commercial ou publication professionnelle, on en parle avant, simplement.',
    },
  ],

  wording: {
    devis: 'Raconter votre journée',
    ctaTitle: 'Une date ? <em>Écrivez-la moi.</em>',
    contactTitle: 'Raconter votre journée',
    contactText: 'La date, le lieu, ce que vous imaginez. Je réponds sous 48 h.',
  },
  form: { provider: 'mailto' },
  images: {
    hero: { src: '/images/hero.webp', alt: 'Mariés au lever du jour, campagne bordelaise' },
  },
  seo: {
    keywords: ['photographe de mariage Bordeaux', 'photographe élopement Nouvelle-Aquitaine', 'photographe famille Bordeaux'],
  },
  legal: { owner: 'Anna Vidal' },
});
