/**
 * Demo Finck & Fisch : Atelier Roux Architecture — architecte d'interieur a Paris 11e.
 * Site fictif de demonstration. Donnees marquees DEMO : fictives, jamais utilisees pour un vrai client.
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'demo-architecte',
  direction: 'journal',
  motion: 'subtle',
  layout: {
    nav: 'split',
    hero: 'split',
    sections: [
      { type: 'services', variant: 'accordion' },
      { type: 'about', variant: 'timeline' },
      { type: 'proof', variant: 'testimonials' },
      { type: 'process', variant: 'steps' },
      { type: 'faq', variant: 'accordion' },
      { type: 'cta', variant: 'band' },
      { type: 'contact', variant: 'form-card' },
    ],
    footer: 'minimal',
  },

  business: {
    name: 'Atelier Roux Architecture',
    trade: 'Architecte d’intérieur',
    tagline: 'Redessiner un appartement <em>sans en trahir l’âme.</em>',
    description:
      'L’Atelier Roux Architecture conçoit et suit des projets de rénovation et d’agencement d’intérieur à Paris, du studio à l’appartement familial.\n\nChaque projet est mené du premier plan au dernier coup de peinture, avec un interlocuteur unique du début à la fin du chantier.',
    since: 2016,
    legalForm: 'SASU',
    insurance: 'Assurance responsabilité civile professionnelle MAF n° 301 664 5',
  },

  contact: {
    phone: '+33639985065',
    phoneDisplay: '06 39 98 50 65',
    email: 'contact@exemple.fr',
    address: { street: '47 rue de la Roquette', postalCode: '75011', city: 'Paris' },
    mapsUrl: 'https://maps.google.com/?q=47+rue+de+la+Roquette+Paris',
    hours: [{ days: 'Sur rendez-vous', hours: 'Lundi – vendredi, 9h – 18h30' }],
    emergency24h: false,
  },

  zones: { cities: [] },

  services: [
    {
      slug: 'conception',
      title: 'Conception et plans',
      short: 'Relevé, plans d’aménagement et projections pour visualiser l’espace avant travaux.',
      icon: 'PenTool',
      featured: true,
      image: { src: '/images/service-1.webp', alt: 'Plans d’aménagement d’un appartement parisien' },
      bullets: ['Relevé sur place', 'Plusieurs scénarios d’aménagement', 'Plans techniques pour les artisans'],
      description:
        'Un projet commence par un relevé précis du logement, puis plusieurs scénarios d’aménagement sont proposés pour comparer les options avant de s’engager.\n\nUne fois le parti pris choisi, les plans techniques nécessaires aux artisans sont produits : plomberie, électricité, cloisons.',
    },
    {
      slug: 'renovation',
      title: 'Rénovation complète',
      short: 'Pilotage d’une rénovation d’appartement, du gros œuvre aux finitions.',
      icon: 'Ruler',
      featured: true,
      image: { src: '/images/service-2.webp', alt: 'Chantier de rénovation d’appartement suivi par l’agence' },
      bullets: ['Consultation et choix des artisans', 'Planning de chantier', 'Visites de suivi hebdomadaires'],
      description:
        'Pour une rénovation complète, l’agence consulte les artisans, établit le planning et suit le chantier chaque semaine jusqu’à la réception des travaux.\n\nLe client garde un seul interlocuteur, plutôt que de coordonner lui-même plombier, électricien et menuisier.',
    },
    {
      slug: 'agencement',
      title: 'Agencement sur mesure',
      short: 'Rangements, cuisine, bibliothèque : le mobilier dessiné pour l’espace exact.',
      icon: 'House',
      image: { src: '/images/service-3.webp', alt: 'Agencement sur mesure d’un rangement' },
      bullets: ['Dessin technique pour le menuisier', 'Optimisation des volumes atypiques', 'Choix des matériaux et finitions'],
      description:
        'Les volumes parisiens sont rarement simples : sous pente, alcôve, angle mort. L’agencement sur mesure tire parti de ces contraintes plutôt que de les subir, avec un dessin technique transmis au menuisier.',
    },
    {
      slug: 'demarches',
      title: 'Démarches administratives',
      short: 'Déclaration préalable, dossier de copropriété : les papiers nécessaires avant travaux.',
      icon: 'FileText',
      image: { src: '/images/service-4.webp', alt: 'Dossier de démarches administratives pour un projet de rénovation' },
      bullets: ['Déclaration préalable de travaux', 'Dossier technique pour la copropriété', 'Suivi des délais d’instruction'],
      description:
        'Certains travaux demandent une déclaration préalable en mairie, ou l’accord de la copropriété. L’agence prépare le dossier et suit les délais pour que cette étape ne retarde pas le chantier.',
    },
    {
      slug: 'decoration',
      title: 'Décoration et finitions',
      short: 'Choix des matériaux, des couleurs et du mobilier pour finir le projet.',
      icon: 'Sparkles',
      bullets: ['Palette de matériaux et couleurs', 'Sélection de mobilier et luminaires', 'Visite finale avant emménagement'],
      description:
        'Une fois le gros œuvre terminé, restent les choix qui font l’ambiance : peintures, revêtements, luminaires, mobilier. Cette étape est menée avec le client jusqu’à la visite finale.',
    },
  ],

  about: {
    title: 'L’agence',
    story:
      'Camille Roux a fondé son agence en 2016 après six ans passés dans un cabinet d’architecture parisien, sur des projets résidentiels de plus grande échelle. Elle a choisi de se concentrer sur l’appartement parisien, un format qu’elle connaît par cœur.\n\nL’agence reste volontairement petite : deux personnes, pour garder un contact direct avec chaque client et chaque artisan du chantier.',
    milestones: [
      { year: '2016', text: 'Création de l’agence après six ans en cabinet d’architecture.' },
      { year: '2018', text: 'Premier projet publié dans un magazine de décoration.' },
      { year: '2021', text: 'Arrivée d’une seconde architecte d’intérieur dans l’équipe.' },
      { year: '2024', text: 'Cinquantième projet de rénovation livré dans le 11e arrondissement.' },
    ],
    portrait: { src: '/images/portrait.webp', alt: 'Camille Roux, architecte d’intérieur, Atelier Roux Architecture' },
  },

  proof: {
    // DEMO : données fictives
    testimonials: [
      { author: 'Hélène et Marc T.', text: 'Un projet mené avec beaucoup de rigueur, chaque choix expliqué et justifié. Le chantier a tenu le planning annoncé.', source: 'E-mail', city: 'Paris 11e' },
      { author: 'Julien K.', text: 'L’agencement de notre cuisine sous pente a résolu un problème que trois autres professionnels n’avaient pas su traiter.', source: 'Google', city: 'Paris 20e' },
    ],
  },

  process: [
    { title: 'Premier rendez-vous', text: 'Visite du logement, échange sur le projet et le budget envisagé.' },
    { title: 'Esquisses', text: 'Plusieurs scénarios d’aménagement présentés et discutés.' },
    { title: 'Plans et chiffrage', text: 'Plans techniques définitifs et consultation des artisans.' },
    { title: 'Chantier', text: 'Suivi hebdomadaire jusqu’à la réception des travaux.' },
  ],

  faq: [
    { q: 'À partir de quel budget travaillez-vous ?', a: 'Les projets accompagnés démarrent généralement autour de 25 000 € de travaux, hors honoraires.' },
    { q: 'Vos honoraires, comment sont-ils calculés ?', a: 'Un forfait est proposé après le premier rendez-vous, selon la nature et l’ampleur du projet.' },
    { q: 'Faut-il un permis de construire pour une rénovation d’appartement ?', a: 'Rarement à Paris intra-muros, mais une déclaration préalable est souvent nécessaire dès que la façade ou les parties communes sont concernées.' },
    { q: 'Travaillez-vous avec des artisans imposés ?', a: 'Non, l’agence propose des artisans de confiance mais vous restez libre de choisir les vôtres.' },
  ],

  social: { instagram: 'https://www.instagram.com/atelierrouxarchitecture', linkedin: 'https://www.linkedin.com/company/atelier-roux-architecture' },

  form: { provider: 'mailto' },
  images: {
    hero: { src: '/images/hero.webp', alt: 'Intérieur d’un appartement parisien rénové par l’Atelier Roux Architecture' },
  },
  seo: { keywords: ['architecte intérieur Paris', 'rénovation appartement Paris 11', 'agencement sur mesure Paris', 'architecte 11e arrondissement'] },
  legal: { owner: 'Camille Roux' },
});
