// DEMO : client inventé
/**
 * Dubois Plomberie — plombier-chauffagiste à Nantes, urgences 24h/24.
 * Site sur mesure : hero + nav dessinés pour ce client, direction "signal" (seule direction
 * associée au métier "plombier" dans src/lib/schema.ts) mais executée avec retenue — un seul
 * accent bleu nuit (au lieu du rouge-orange par défaut de la direction) plutôt que le rouge
 * d'alarme, pour rester "premium" sans perdre la lisibilité d'urgence. Voir sections/ pour le
 * detail de chaque composition sur mesure.
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'dubois-plomberie',
  direction: 'signal',
  motion: 'subtle',
  // Transitions de page (ClientRouter) : fondu 0,3 s accueil <-> pages services ; nav, tiroir de contact,
  // formulaire et reveals rearmes a chaque navigation (docs/ANIMATIONS.md § Transitions de page).
  transitions: true,
  // Accent bleu nuit (proche de #0b2545) au lieu du rouge-orange par defaut de "signal" :
  // confiance plutot qu'alarme, cf. mandat de design (studio premium, pas panneau de chantier).
  accent: { h: 210, s: 72, l: 17 },
  scale: 'normal',

  layout: {
    nav: 'custom/nav',
    hero: 'custom/hero',
    sections: [
      { type: 'custom', variant: 'Urgence', label: 'En urgence' },
      { type: 'services', variant: 'grid' },
      { type: 'custom', variant: 'Diagnostic', label: 'Diagnostic' },
      { type: 'custom', variant: 'Confiance', label: 'Confiance' },
      { type: 'custom', variant: 'Tarifs', label: 'Tarifs' },
      { type: 'zones', variant: 'chips' },
      { type: 'faq', variant: 'accordion' },
      { type: 'about', variant: 'story' },
      { type: 'contact', variant: 'form-split' },
    ],
    footer: 'columns',
    divider: 'none',
    tone: 'flat',
    // Contact en tiroir : urgence = le formulaire s'ouvre depuis n'importe ou (nav, call-bar mobile,
    // bandeau) sans descendre en bas de page ; la section contact finale reste en plus.
    contactDrawer: true,
  },

  business: {
    name: 'Dubois Plomberie',
    trade: 'Plombier-chauffagiste',
    tagline: 'Une fuite&nbsp;? <em>On décroche, jour et nuit.</em>',
    description:
      'Plombier-chauffagiste à Nantes depuis 2008. Deux plombiers, un seul numéro : fuites, débouchages, chauffe-eau, chaudières gaz et salles de bain, dans Nantes et sa périphérie.\n\nUrgences 24h/24, assurance décennale, certifiés RGE pour les chaudières.',
    since: 2008,
    insurance: 'Assurance décennale',
    certifications: ['RGE'],
  },

  contact: {
    phone: '+33639981402',
    phoneDisplay: '06 39 98 14 02',
    email: 'contact@exemple.fr',
    address: { street: '15 rue de la Fosse', postalCode: '44000', city: 'Nantes' },
    mapsUrl: 'https://maps.google.com/?q=15+rue+de+la+Fosse+44000+Nantes',
    mapsProvider: 'osm',
    coordinates: { lat: 47.2133, lng: -1.5561 },
    hours: [],
    emergency24h: true,
  },

  zones: {
    cities: ['Nantes', 'Rezé', 'Saint-Herblain', 'Orvault', 'Vertou', 'Bouguenais', 'Carquefou', 'Sainte-Luce-sur-Loire'],
    label: 'Nantes et périphérie',
  },

  services: [
    {
      slug: 'fuite-depannage',
      title: 'Fuite & dépannage',
      short: 'Fuite, canalisation percée, robinet bloqué : intervention en urgence, jour et nuit.',
      description:
        'Une fuite ne prévient pas. On se déplace pour localiser la fuite, couper l’arrivée si besoin, et réparer ou poser une solution provisoire propre en attendant la pièce.\n\nDevis oral sur place avant toute intervention.',
      bullets: ['Intervention 24h/24, 7j/7', 'Recherche de fuite', 'Devis avant intervention'],
      icon: 'Droplet',
      featured: true,
      priceFrom: 'à partir de 89 €',
    },
    {
      slug: 'debouchage',
      title: 'Débouchage',
      short: 'Évier, WC, douche ou canalisation bouchée : débouchage mécanique ou haute pression.',
      bullets: ['Furet ou haute pression selon le cas', 'Camion équipé', 'Canalisations enterrées possibles'],
      icon: 'Waves',
      featured: true,
      priceFrom: 'à partir de 120 €',
    },
    {
      slug: 'chauffe-eau',
      title: 'Chauffe-eau',
      short: 'Chauffe-eau électrique ou thermodynamique en panne, à remplacer ou à entretenir.',
      bullets: ['Dépannage ou remplacement', 'Toutes marques', 'Mise en service comprise'],
      icon: 'Flame',
      featured: true,
    },
    {
      slug: 'chaudiere-gaz',
      title: 'Chaudière gaz',
      short: 'Installation et entretien annuel de chaudière gaz, par un plombier certifié RGE.',
      bullets: ['Installation neuve ou remplacement', 'Entretien annuel obligatoire', 'Certifié RGE'],
      icon: 'Thermometer',
      featured: true,
    },
    {
      slug: 'salle-de-bain',
      title: 'Salle de bain',
      short: 'Rénovation complète ou partielle : douche, baignoire, sanitaires, robinetterie.',
      bullets: ['Douche à l’italienne', 'Remplacement baignoire par douche', 'Plomberie et pose comprises'],
      icon: 'ShowerHead',
      featured: false,
    },
  ],

  about: {
    title: 'L’équipe',
    story:
      'Dubois Plomberie intervient à Nantes depuis 2008. L’équipe compte deux plombiers-chauffagistes, l’un plutôt sur les urgences et les dépannages, l’autre sur les chantiers de chaudière et de salle de bain.\n\nMême numéro pour tout : une fuite le dimanche soir ou une chaudière à changer, c’est nous qui répondons.',
  },

  process: [
    { title: 'Vous appelez', text: 'Un numéro, une adresse. On évalue tout de suite si c’est une urgence.' },
    { title: 'On se déplace', text: 'Un plombier arrive avec le matériel courant pour une première intervention.' },
    { title: 'On répare ou on stoppe la casse', text: 'Réparation définitive si possible, solution provisoire propre sinon.' },
    { title: 'On chiffre le reste', text: 'Devis écrit si des travaux plus lourds sont nécessaires, sans obligation.' },
  ],

  faq: [
    { q: 'Intervenez-vous vraiment la nuit et le week-end ?', a: 'Oui, le numéro affiché sur le site est celui des urgences, 24h/24 et 7j/7, pas un simple répondeur.' },
    { q: 'Le devis est-il gratuit ?', a: 'Le diagnostic sur place et le devis sont communiqués avant toute intervention facturée.' },
    { q: 'Intervenez-vous en dehors de Nantes ?', a: 'Oui, dans Nantes et les communes limitrophes : Rezé, Saint-Herblain, Orvault, Vertou, Bouguenais, Carquefou, Sainte-Luce-sur-Loire.' },
    { q: 'Êtes-vous assurés pour les gros travaux ?', a: 'Oui, Dubois Plomberie est couvert par une assurance décennale et certifié RGE pour les chaudières.' },
  ],

  form: { provider: 'mailto' },

  wording: {
    devis: 'Décrire la panne',
    ctaTitle: 'Une urgence&nbsp;? <em>On répond, le plus vite possible.</em>',
    ctaText: 'Fuite, panne de chauffe-eau, chaudière en rade : un seul numéro, jour et nuit, à Nantes et alentours.',
    contactTitle: 'Décrire la panne',
    contactText: 'Décrivez ce qui se passe, on vous rappelle rapidement pour évaluer l’urgence.',
  },

  images: {},

  seo: {
    keywords: ['plombier Nantes', 'plombier urgence Nantes', 'chauffagiste Nantes', 'débouchage Nantes', 'chaudière gaz Nantes'],
  },

  legal: {},
});
