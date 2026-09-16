// DEMO : client inventé (Toits & Cie). Coordonnées, personnel et propos inventés pour la démonstration.
// Nav, hero et blocs principaux dessinés à la main pour ce site : sites/toits-cie/sections/.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'toits-cie',
  direction: 'brut',
  accent: { h: 49, s: 100, l: 48 }, // jaune sécurité, plus saturé que le jaune brut par défaut
  typography: { display: 'delaGothic', body: 'redHat' },
  motion: 'rich',
  scale: 'display',
  layout: {
    shell: 'sticky-hero',
    nav: 'custom/nav',
    hero: 'custom/hero',
    sections: [
      { type: 'custom', variant: 'chantiers', label: 'Chantiers' },
      { type: 'custom', variant: 'methode', label: 'Méthode' },
      { type: 'custom', variant: 'garanties', label: 'Garanties' },
      { type: 'cta', variant: 'band' },
      { type: 'contact', variant: 'form-split' },
    ],
    footer: 'minimal',
    divider: 'none',
    tone: 'flat',
    headings: 'auto',
  },

  business: {
    name: 'Toits & Cie',
    trade: 'Couvreur-zingueur',
    tagline: 'Une fuite&nbsp;? <em>On monte aujourd’hui.</em>',
    description:
      'Couvreur-zingueur à Rouen depuis 2004. Trois compagnons, une camionnette équipée, et un téléphone qui répond aussi le dimanche.\n\nRéparation de fuite en urgence, réfection complète, zinguerie, démoussage, pose de velux. Assurance décennale, certifiés Qualibat.',
    since: 2004,
    insurance: 'Assurance décennale',
    certifications: ['Qualibat'],
  },

  contact: {
    phone: '+33639980815',
    phoneDisplay: '06 39 98 08 15',
    email: 'contact@exemple.fr',
    address: { street: '27 rue de Constantine', postalCode: '76000', city: 'Rouen' },
    hours: [
      { days: 'Lundi – samedi', hours: '7h30 – 19h' },
      { days: 'Urgences fuite', hours: '24h/24, 7j/7' },
    ],
    emergency24h: true,
  },

  zones: { cities: ['Rouen', 'Le Grand-Quevilly', 'Mont-Saint-Aignan', 'Bois-Guillaume', 'Elbeuf', 'Barentin'] },

  services: [
    {
      slug: 'reparation-fuite',
      title: 'Réparation de fuite',
      short: 'Intervention en urgence : diagnostic sur le toit, étanchéité rétablie le jour même.',
      description:
        'Une fuite ne prévient pas. On décroche, on prend l’adresse, et un compagnon monte sur le toit le jour même — souvent dans l’heure sur Rouen et les communes proches.\n\nDiagnostic sur place, réparation immédiate quand c’est possible, devis avant toute reprise plus lourde.',
      bullets: ['Intervention 24h/24', 'Diagnostic sur le toit, pas au téléphone', 'Devis avant toute reprise lourde'],
      icon: 'Droplets',
      featured: true,
      image: { src: '/images/service-1.webp', alt: 'Compagnon réparant une fuite sur une toiture' },
    },
    {
      slug: 'refection-toiture',
      title: 'Réfection complète',
      short: 'Toiture reprise entièrement : charpente, couverture, isolation.',
      description:
        'Quand la toiture est trop reprise pour tenir, on refait proprement : charpente vérifiée, couverture neuve, isolation si besoin. Un chantier planifié, pas une succession de rustines.',
      bullets: ['Diagnostic charpente et couverture', 'Devis détaillé poste par poste', 'Chantier suivi par le même compagnon'],
      icon: 'Hammer',
      featured: true,
      image: { src: '/images/service-2.webp', alt: 'Toiture en cours de réfection complète' },
    },
    {
      slug: 'zinguerie',
      title: 'Zinguerie',
      short: 'Gouttières, chéneaux, solins : l’étanchéité qui ne se voit pas.',
      description: 'La zinguerie, c’est ce qui évacue l’eau au lieu de la laisser s’infiltrer. Gouttières, chéneaux, solins et noues, posés ou repris à la demande.',
      bullets: ['Gouttières et descentes', 'Solins et noues', 'Habillages sur mesure'],
      icon: 'Layers',
      featured: true,
      image: { src: '/images/service-3.webp', alt: 'Gouttière en zinc posée en rive de toit' },
    },
    {
      slug: 'demoussage',
      title: 'Démoussage',
      short: 'Toiture nettoyée et traitée avant que la mousse ne s’infiltre sous les tuiles.',
      description: 'La mousse retient l’humidité et finit par soulever les tuiles. On nettoie, on traite, et on vérifie l’état de la couverture pendant qu’on y est.',
      bullets: ['Nettoyage haute pression maîtrisé', 'Traitement anti-mousse', 'Contrôle de la couverture inclus'],
      icon: 'Leaf',
      featured: true,
      image: { src: '/images/service-4.webp', alt: 'Toiture démoussée et traitée' },
    },
    {
      slug: 'velux',
      title: 'Pose de velux',
      short: 'Fenêtre de toit posée et raccordée, sans reprise à refaire dans six mois.',
      description: 'Pose ou remplacement de velux, raccordement à l’étanchéité existante compris. On ne pose pas une fenêtre sans reprendre ce qui l’entoure.',
      bullets: ['Pose neuve ou remplacement', 'Raccordement étanchéité inclus', 'Toutes tailles standards'],
      icon: 'Sun',
      featured: false,
    },
  ],

  about: {
    title: 'L’équipe',
    story:
      'Toits & Cie répare des toitures à Rouen depuis 2004. Trois compagnons, un métier : monter, réparer, refaire, et repartir sans laisser une fuite derrière soi.\n\nOn ne vend pas de contrat d’entretien ni de diagnostic à 200 €. On monte, on regarde, on chiffre.',
    values: [],
  },

  faq: [],

  wording: {
    devis: 'Décrire la fuite',
    ctaTitle: 'Ça coule&nbsp;? <em>On arrive.</em>',
    ctaText: 'Un appel, une adresse, un compagnon sur le toit le jour même — Rouen et les communes alentour.',
    contactTitle: 'Décrire le problème',
    contactText: 'Une photo, une adresse, un numéro : on rappelle dans l’heure.',
  },

  form: { provider: 'mailto' },

  images: {
    hero: { src: '/images/hero.webp', alt: 'Toiture en zinc sous un ciel gris à Rouen' },
  },

  seo: {
    keywords: ['couvreur Rouen', 'fuite toiture urgence Rouen', 'zingueur Rouen', 'réparation toiture Rouen'],
  },
});
