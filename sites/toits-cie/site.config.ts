// DEMO : client inventé (Toits & Cie). Coordonnées, personnel et propos inventés pour la démonstration.
// Nav, hero et blocs principaux dessinés à la main pour ce site : sites/toits-cie/sections/.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'toits-cie',
  direction: 'brut',
  accent: { h: 49, s: 100, l: 48 }, // jaune sécurité, plus saturé que le jaune brut par défaut
  typography: { display: 'delaGothic', body: 'redHat' },
  motion: 'rich',
  // Transitions de page (ClientRouter) : fondu 0,3 s accueil <-> pages services ; nav, tiroir de contact,
  // formulaire, marquee et reveals rearmes a chaque navigation (docs/ANIMATIONS.md § Transitions de page).
  transitions: true,
  scale: 'display',
  layout: {
    shell: 'sticky-hero',
    nav: 'custom/nav',
    hero: 'custom/hero',
    sections: [
      { type: 'custom', variant: 'garanties', label: 'Garanties' },
      { type: 'custom', variant: 'chantiers', label: 'Chantiers' },
      { type: 'custom', variant: 'secteur', label: 'Secteur' },
      { type: 'custom', variant: 'methode', label: 'Méthode' },
      { type: 'cta', variant: 'band' },
      { type: 'contact', variant: 'form-split' },
    ],
    footer: 'minimal',
    divider: 'none',
    tone: 'flat',
    headings: 'auto',
    // Contact en tiroir : urgence = le formulaire s'ouvre depuis la nav ("Écrire") et le bandeau
    // CTA sans quitter l'ecran ; la section contact finale reste en plus.
    contactDrawer: true,
  },

  business: {
    name: 'Toits & Cie',
    trade: 'Couvreur-zingueur',
    tagline: 'Une fuite ? <em>On monte aujourd’hui.</em>',
    description:
      'Couvreur-zingueur à Rouen depuis 2004, rue de Constantine. Trois compagnons, une camionnette équipée, et un téléphone qui répond aussi le dimanche.\n\nFuite en urgence, réfection complète, zinguerie, démoussage, pose de velux. Assurance décennale, certifiés Qualibat. Et le diagnostic se fait sur le toit, pas au téléphone.',
    since: 2004,
    insurance: 'Assurance décennale',
    certifications: ['Qualibat'],
  },

  contact: {
    phone: '+33639980815',
    phoneDisplay: '06 39 98 08 15',
    email: 'contact@exemple.fr',
    address: { street: '27 rue de Constantine', postalCode: '76000', city: 'Rouen' },
    hours: [
      { days: 'Lundi – samedi', hours: '7 h 30 – 19 h' },
      { days: 'Urgences fuite', hours: '24h/24, 7j/7' },
    ],
    emergency24h: true,
  },

  zones: { cities: ['Rouen', 'Le Grand-Quevilly', 'Mont-Saint-Aignan', 'Bois-Guillaume', 'Elbeuf', 'Barentin'] },

  services: [
    {
      slug: 'reparation-fuite',
      title: 'Réparation de fuite',
      short: 'Un appel, une adresse. Et un compagnon sur le toit le jour même.',
      description:
        'Une fuite ne prévient pas. On décroche, on prend l’adresse, et un compagnon monte le jour même. Sur Rouen et les communes proches, c’est souvent dans l’heure.\n\nLe diagnostic se fait sur le toit, pas au téléphone. Réparation tout de suite quand c’est possible, devis écrit avant toute reprise plus lourde.',
      bullets: ['Intervention 24h/24', 'Diagnostic sur le toit, pas au téléphone', 'Devis avant toute reprise lourde'],
      icon: 'Droplets',
      featured: true,
      image: { src: '/images/service-1.webp', alt: 'Compagnon réparant une fuite sur une toiture' },
    },
    {
      slug: 'refection-toiture',
      title: 'Réfection complète',
      short: 'Charpente vérifiée, couverture neuve, isolation si besoin.',
      description:
        'Il arrive qu’une toiture ait été trop souvent reprise pour tenir encore. On refait alors proprement : la charpente est contrôlée, la couverture remplacée, l’isolation reprise si elle le mérite.\n\nUn chantier planifié, avec un devis poste par poste. Pas une succession de rustines.',
      bullets: ['Diagnostic charpente et couverture', 'Devis détaillé poste par poste', 'Chantier suivi par le même compagnon'],
      icon: 'Hammer',
      featured: true,
      image: { src: '/images/service-2.webp', alt: 'Toiture en cours de réfection complète' },
    },
    {
      slug: 'zinguerie',
      title: 'Zinguerie',
      short: 'Gouttières, chéneaux, solins, noues.',
      description: 'La zinguerie, c’est ce qui évacue l’eau au lieu de la laisser s’infiltrer. Gouttières et descentes, chéneaux, solins, noues : posés neufs, ou repris là où ça fuit.',
      bullets: ['Gouttières et descentes', 'Solins et noues', 'Habillages sur mesure'],
      icon: 'Layers',
      featured: true,
      image: { src: '/images/service-3.webp', alt: 'Gouttière en zinc posée en rive de toit' },
    },
    {
      slug: 'demoussage',
      title: 'Démoussage',
      short: 'La mousse retient l’humidité et finit par soulever les tuiles.',
      description: 'On nettoie, on traite, et on profite d’être en haut pour regarder l’état de la couverture. Ce qu’on voit, on le dit, même si ça n’entrait pas dans la commande.',
      bullets: ['Nettoyage haute pression', 'Traitement anti-mousse', 'Contrôle de la couverture inclus'],
      icon: 'Leaf',
      featured: true,
      image: { src: '/images/service-4.webp', alt: 'Toiture démoussée et traitée' },
    },
    {
      slug: 'velux',
      title: 'Pose de velux',
      short: 'Pose ou remplacement, étanchéité reprise autour.',
      description: 'Pose neuve ou remplacement d’un velux existant, raccordement à l’étanchéité compris. On ne pose pas une fenêtre sans reprendre ce qui l’entoure : c’est là que ça refuit, six mois plus tard.',
      bullets: ['Pose neuve ou remplacement', 'Raccordement étanchéité inclus', 'Toutes tailles standards'],
      icon: 'Sun',
      featured: false,
    },
  ],

  about: {
    title: 'L’équipe',
    story:
      'Toits & Cie répare des toitures à Rouen depuis 2004, rue de Constantine. Trois compagnons, une camionnette, un métier.\n\nOn ne vend pas de contrat d’entretien, ni de diagnostic à 200 €. On monte, on regarde, on chiffre. Et si le toit peut attendre, on le dit plutôt que de vendre un chantier.',
    values: [],
  },

  faq: [],

  wording: {
    devis: 'Décrire la fuite',
    ctaTitle: 'Ça coule ? <em>On arrive.</em>',
    ctaText: 'Un appel, une adresse. Et un compagnon sur le toit le jour même, à Rouen comme dans les communes alentour.',
    contactTitle: 'Décrire le problème',
    contactText: 'Une photo, une adresse, un numéro : on rappelle dans l’heure.',
  },

  form: { provider: 'mailto' },

  images: {
    hero: { src: '/images/hero.webp', alt: 'Toiture en zinc sous un ciel gris à Rouen' },
  },

  seo: {
    keywords: ['couvreur Rouen', 'fuite toiture urgence Rouen', 'zingueur Rouen', 'réparation toiture Rouen'],
  },
});
