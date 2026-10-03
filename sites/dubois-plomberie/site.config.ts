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
    tagline: 'Ça fuit ? <em>On décroche, même la nuit.</em>',
    description:
      'Plombier-chauffagiste à Nantes depuis 2008. On est deux. Fuites, débouchages, chauffe-eau, chaudières gaz, salles de bain : c’est le même numéro pour tout, dans Nantes et sa périphérie.\n\nLe numéro tourne 24h/24. Assurance décennale, certification RGE pour les chaudières. Et si ce n’est pas une urgence, on vous le dit au téléphone plutôt que de se déplacer pour rien.',
    since: 2008,
    insurance: 'Assurance décennale',
    certifications: ['RGE'],
  },

  contact: {
    phone: '+33639981402',
    phoneDisplay: '06 39 98 14 02',
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
      short: 'Ça coule, ça goutte, ça ne s’arrête plus. On se déplace, de jour comme de nuit.',
      description:
        'On localise, on coupe l’arrivée s’il le faut, on répare. Quand la pièce manque, on pose une solution provisoire propre plutôt que de vous laisser sans eau.\n\nLe prix est annoncé sur place, avant qu’on touche à quoi que ce soit. À partir de 89 €.',
      bullets: ['Intervention 24h/24, 7j/7', 'Recherche de fuite', 'Prix annoncé avant de commencer'],
      icon: 'Droplet',
      featured: true,
      priceFrom: 'à partir de 89 €',
    },
    {
      slug: 'debouchage',
      title: 'Débouchage',
      short: 'Évier, WC, douche. Le furet d’abord, la haute pression si le furet ne suffit pas.',
      bullets: ['Furet ou haute pression selon le cas', 'Camion équipé', 'Canalisations enterrées possibles'],
      icon: 'Waves',
      featured: true,
      priceFrom: 'à partir de 120 €',
    },
    {
      slug: 'chauffe-eau',
      title: 'Chauffe-eau',
      short: 'Plus d’eau chaude ce matin ? On regarde d’abord s’il se répare, avant de parler de remplacement.',
      bullets: ['Dépannage d’abord, remplacement ensuite', 'Toutes marques', 'Mise en service comprise'],
      icon: 'Flame',
      featured: true,
    },
    {
      slug: 'chaudiere-gaz',
      title: 'Chaudière gaz',
      short: 'L’entretien annuel est obligatoire. On le fait, et on installe aussi, certification RGE à l’appui.',
      bullets: ['Installation neuve ou remplacement', 'Entretien annuel obligatoire', 'Certifié RGE'],
      icon: 'Thermometer',
      featured: true,
    },
    {
      slug: 'salle-de-bain',
      title: 'Salle de bain',
      short: 'Remplacer une baignoire par une douche, ou refaire la pièce entière. Plomberie et pose comprises.',
      bullets: ['Douche à l’italienne', 'Remplacement baignoire par douche', 'Plomberie et pose comprises'],
      icon: 'ShowerHead',
      featured: false,
    },
  ],

  about: {
    title: 'L’équipe',
    story:
      'Dubois Plomberie intervient à Nantes depuis 2008. L’équipe, c’est deux plombiers-chauffagistes : l’un part plutôt sur les urgences et les dépannages, l’autre suit les chantiers de chaudière et de salle de bain.\n\nMême numéro pour tout. Une fuite un dimanche soir, une chaudière à changer au printemps : c’est nous qui répondons, pas un répondeur.',
  },

  process: [
    { title: 'Vous appelez', text: 'Un numéro, une adresse. On évalue tout de suite si c’est une urgence.' },
    { title: 'On se déplace', text: 'Un plombier arrive avec le matériel courant pour une première intervention.' },
    { title: 'On répare ou on stoppe la casse', text: 'Réparation définitive si possible, solution provisoire propre sinon.' },
    { title: 'On chiffre le reste', text: 'Devis écrit si des travaux plus lourds sont nécessaires, sans obligation.' },
  ],

  faq: [
    { q: 'Intervenez-vous vraiment la nuit et le week-end ?', a: 'Le numéro affiché est celui des urgences, 24h/24 et 7j/7. Ce n’est pas un répondeur : quelqu’un décroche.' },
    { q: 'Le devis est-il gratuit ?', a: 'Le diagnostic se fait sur place et le prix est annoncé avant l’intervention. Rien n’est facturé sans que vous l’ayez entendu d’abord.' },
    { q: 'Intervenez-vous en dehors de Nantes ?', a: 'Dans Nantes et les communes limitrophes : Rezé, Saint-Herblain, Orvault, Vertou, Bouguenais, Carquefou, Sainte-Luce-sur-Loire.' },
    { q: 'Êtes-vous assurés pour les gros travaux ?', a: 'Assurance décennale pour les travaux, certification RGE pour les chaudières.' },
  ],

  form: { provider: 'mailto' },

  wording: {
    devis: 'Décrire la panne',
    ctaTitle: 'Une panne maintenant ?<em>Le numéro marche aussi la nuit.</em>',
    ctaText: 'Un seul numéro, à Nantes et en périphérie. Si ça peut attendre demain, on vous le dira.',
    contactTitle: 'Décrire la panne',
    contactText: 'Dites ce qui se passe, et depuis quand. On rappelle pour trier ce qui est urgent de ce qui ne l’est pas.',
  },

  images: {},

  seo: {
    keywords: ['plombier Nantes', 'plombier urgence Nantes', 'chauffagiste Nantes', 'débouchage Nantes', 'chaudière gaz Nantes'],
  },

  legal: {},
});
