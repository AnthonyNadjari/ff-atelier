// DEMO : cabinet inventé (Élise Morvan, chirurgien-dentiste à Rennes), pour la galerie du studio.
// Coordonnées fictives (plage ARCEP réservée à la fiction 02 61 91). Aucun avis, aucune note, aucun
// chiffre de patientèle : une profession de santé n'en affiche pas, et rien n'est inventé.
// Photos : banques libres (CREDITS.md), aucune ne prétend montrer la praticienne.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'dentaire-morvan',
  typography: {
    display: 'redHat',
    body: 'schibsted',
  },
  scale: 'normal',
  direction: 'nordique',
  motion: 'subtle',
  layout: {
    nav: 'bar',
    hero: 'custom/hero',
    sections: [
      {
        type: 'services',
        variant: 'bento',
      },
      {
        type: 'custom',
        variant: 'remboursement',
        label: 'Remboursement',
      },
      {
        type: 'about',
        variant: 'portrait',
      },
      {
        type: 'process',
        variant: 'numbered',
      },
      {
        type: 'faq',
        variant: 'accordion',
      },
      {
        type: 'cta',
        variant: 'phone-giant',
      },
      {
        type: 'contact',
        variant: 'form-split',
      },
    ],
    footer: 'big-name',
    shell: 'flow',
    divider: 'none',
    tone: 'alternate',
    headings: 'left',
    contactDrawer: false,
  },

  business: {
    name: 'Cabinet dentaire Morvan',
    trade: 'Chirurgien-dentiste',
    tagline: 'Dentiste à Rennes, <em>sans attendre trois mois.</em>',
    description:
      'Cabinet dentaire à Rennes, rue de Paris, à deux pas du Thabor. Élise Morvan soigne les adultes et les enfants dès trois ans : soins, détartrage, couronnes, gencives.\n\nUn créneau d’urgence est gardé chaque jour. Avant toute prothèse, vous repartez avec un devis écrit et le temps d’y réfléchir.',
    since: 2014,
    certifications: ['Inscrite à l’Ordre des chirurgiens-dentistes', 'Conventionnée secteur 1'],
  },

  contact: {
    phone: '+33261914752',
    phoneDisplay: '02 61 91 47 52',
    email: 'contact@exemple.fr',
    address: { street: '18 rue de Paris', postalCode: '35000', city: 'Rennes' },
    hours: [
      { days: 'Lundi – jeudi', hours: '8 h 30 – 19 h', opens: '08:30', closes: '19:00' },
      { days: 'Vendredi', hours: '8 h 30 – 17 h', opens: '08:30', closes: '17:00' },
      { days: 'Samedi', hours: 'Fermé' },
    ],
    emergency24h: false,
  },

  zones: { cities: ['Rennes', 'Cesson-Sévigné', 'Saint-Grégoire', 'Thorigné-Fouillard', 'Chantepie'] },

  services: [
    { slug: 'soins', title: 'Soins et détartrage', short: 'Caries, détartrage, dévitalisation : les soins courants, expliqués avant d’être faits.', icon: 'Sparkles', featured: true, image: { src: '/images/instruments.webp', alt: 'Instruments rotatifs rangés sur l’unit de soin' } },
    { slug: 'enfants', title: 'Enfants', short: 'Dès trois ans. Le premier rendez-vous sert surtout à faire connaissance.', icon: 'Baby', image: { src: '/images/soin.webp', alt: 'Enfant installé dans le fauteuil pendant un examen' } },
    { slug: 'protheses', title: 'Couronnes et bridges', short: 'Devis écrit remis avant toute prothèse, avec la part remboursée.', icon: 'Crown' },
    { slug: 'gencives', title: 'Gencives', short: 'Gencives qui saignent, dents qui bougent : un bilan, puis un traitement par étapes.', icon: 'HeartPulse' },
    { slug: 'urgences', title: 'Urgences du jour', short: 'Une rage de dents ? Appelez avant 10 h : un créneau est gardé chaque jour.', icon: 'Clock' },
  ],

  about: {
    title: 'Le cabinet',
    portrait: { src: '/images/salle.webp', alt: 'Salle de soin du cabinet, fauteuil et unit devant la fenêtre' },
    story:
      'Élise Morvan a fait ses études à la faculté d’odontologie de Rennes. Elle a repris le cabinet de la rue de Paris en 2014.\n\nUne salle de soin, une assistante, des rendez-vous qui commencent à l’heure. Elle prend le temps d’expliquer ce qu’elle voit sur la radio avant de proposer quoi que ce soit.',
    values: [
      { title: 'Le devis avant', text: 'Rien n’est commencé sans que vous sachiez ce que cela coûte.' },
      { title: 'Un créneau par jour', text: 'Gardé pour les urgences, jamais donné à l’avance.' },
      { title: 'Accessible', text: 'Cabinet de plain-pied, accessible en fauteuil roulant.' },
    ],
  },

  process: [
    { title: 'Vous appelez', text: 'Le secrétariat répond de 8 h 30 à 12 h et de 14 h à 18 h.' },
    { title: 'Premier rendez-vous', text: 'Examen, radio si besoin, et un plan de soins écrit.' },
    { title: 'Les soins', text: 'Dans l’ordre convenu, avec un devis signé pour toute prothèse.' },
  ],

  faq: [
    { q: 'Le cabinet est-il conventionné ?', a: 'Oui, secteur 1. Le tiers payant est pratiqué sur la part de l’Assurance maladie ; apportez votre carte Vitale.' },
    { q: 'Prenez-vous de nouveaux patients ?', a: 'Oui. Le délai pour un premier rendez-vous est donné au téléphone, il dépend de la saison.' },
    { q: 'Et pour les enfants ?', a: 'Dès trois ans. Les examens de prévention M’T dents (de 3 à 24 ans) sont entièrement pris en charge, sans avance de frais.' },
    { q: 'J’ai mal un dimanche, que faire ?', a: 'Le dimanche et les jours fériés, appelez le 15 : il vous oriente vers le chirurgien-dentiste de garde.' },
  ],

  wording: {
    devis: 'Prendre rendez-vous',
    ctaTitle: 'Une dent qui fait mal ? <em>Appelez avant 10 h.</em>',
    contactTitle: 'Prendre rendez-vous',
    contactText: 'Par téléphone de préférence. Ou laissez un message avec vos disponibilités, le secrétariat vous rappelle.',
  },
  form: { provider: 'mailto' },
  images: {
    hero: { src: '/images/hero.webp', alt: 'Salle de soin claire, fauteuil dentaire et unit de soin' },
  },
  seo: { keywords: ['dentiste Rennes', 'chirurgien-dentiste Rennes', 'dentiste enfant Rennes', 'urgence dentaire Rennes'] },
  legal: { owner: 'Élise Morvan' },
});
