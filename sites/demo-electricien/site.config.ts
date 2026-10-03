/**
 * Demo Finck & Fisch : Volt & Fils — electricien a Lyon (Villeurbanne).
 * Site fictif de demonstration. Donnees marquees DEMO : fictives, jamais utilisees pour un vrai client.
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'demo-electricien',
  direction: 'brut',
  motion: 'subtle',
  layout: {
    nav: 'floating',
    hero: 'marquee',
    sections: [
      { type: 'services', variant: 'cards-hover' },
      { type: 'about', variant: 'values' },
      { type: 'proof', variant: 'marquee-quotes' },
      { type: 'zones', variant: 'list' },
      { type: 'faq', variant: 'two-columns' },
      { type: 'cta', variant: 'band' },
      { type: 'contact', variant: 'full' },
    ],
    footer: 'columns',
  },

  business: {
    name: 'Volt & Fils',
    trade: 'Électricien',
    tagline: 'Le courant qui passe, <em>le reste qui suit.</em>',
    description:
      'Volt & Fils intervient à Villeurbanne et dans l’agglomération lyonnaise pour l’installation électrique, la mise aux normes et le dépannage. Entreprise familiale, deux électriciens qualifiés Qualifelec.\n\nInstallation de bornes de recharge pour véhicules électriques (IRVE) en plus des chantiers électriques classiques.',
    since: 2015,
    legalForm: 'SARL',
    insurance: 'Assurance décennale AXA n° 447 812 003',
    certifications: ['Qualifelec', 'IRVE'],
  },

  contact: {
    phone: '+33639983043',
    phoneDisplay: '06 39 98 30 43',
    email: 'contact@exemple.fr',
    address: { street: '8 cours Émile Zola', postalCode: '69100', city: 'Villeurbanne' },
    mapsUrl: 'https://maps.google.com/?q=8+cours+Emile+Zola+Villeurbanne',
    hours: [
      { days: 'Lundi – vendredi', hours: '7 h 30 – 18 h' },
      { days: 'Samedi', hours: 'Sur rendez-vous' },
    ],
    emergency24h: false,
  },

  zones: {
    cities: ['Villeurbanne', 'Lyon', 'Vaulx-en-Velin', 'Bron', 'Vénissieux', 'Caluire-et-Cuire', 'Rillieux-la-Pape'],
    label: 'Lyon et agglomération',
  },

  services: [
    {
      slug: 'installation-electrique',
      title: 'Installation électrique',
      short: 'Câblage complet pour une construction neuve ou une extension.',
      icon: 'Zap',
      featured: true,
      image: { src: '/images/service-1.webp', alt: 'Installation électrique sur un chantier neuf' },
      bullets: ['Plan de câblage avec vous', 'Tableau électrique neuf', 'Conformité Consuel'],
      description:
        'Sur une construction neuve ou une extension, l’installation électrique se pense avant les cloisons : emplacement des prises, des points lumineux, du tableau.\n\nLe chantier se termine par la mise en conformité et le passage du Consuel, obligatoire pour le raccordement définitif.',
    },
    {
      slug: 'mise-aux-normes',
      title: 'Mise aux normes',
      short: 'Tableau électrique vétuste, absence de disjoncteur différentiel : mise en conformité.',
      icon: 'Shield',
      featured: true,
      image: { src: '/images/service-2.webp', alt: 'Remplacement d’un tableau électrique vétuste' },
      bullets: ['Diagnostic de l’installation existante', 'Remplacement du tableau', 'Attestation de conformité'],
      description:
        'Une installation ancienne présente souvent les mêmes défauts : pas de disjoncteur différentiel, tableau saturé, fils sous-dimensionnés. On diagnostique et on met aux normes NF C 15-100.\n\nUtile avant une vente, une location, ou simplement pour dormir tranquille.',
    },
    {
      slug: 'depannage',
      title: 'Dépannage électrique',
      short: 'Panne, disjoncteur qui saute, prise qui ne fonctionne plus.',
      icon: 'Wrench',
      image: { src: '/images/service-3.webp', alt: 'Dépannage électrique chez un particulier' },
      bullets: ['Recherche de panne', 'Réparation le jour même si possible', 'Devis avant intervention'],
      description:
        'Un disjoncteur qui saute sans raison apparente, une pièce sans courant : on cherche l’origine du problème plutôt que de simplement réarmer le disjoncteur.\n\nLa plupart des pannes se règlent dans la journée.',
    },
    {
      slug: 'irve',
      title: 'Bornes de recharge IRVE',
      short: 'Installation de borne de recharge pour véhicule électrique, à domicile ou en copropriété.',
      icon: 'PlugZap',
      image: { src: '/images/service-4.webp', alt: 'Borne de recharge pour véhicule électrique installée' },
      bullets: ['Certification IRVE', 'Étude de faisabilité', 'Dossier copropriété si besoin'],
      description:
        'L’installation d’une borne de recharge demande une certification IRVE, que l’entreprise détient. On étudie la puissance disponible sur votre installation avant de proposer la borne adaptée.\n\nEn copropriété, on peut monter le dossier technique nécessaire à la demande auprès du syndic.',
    },
    {
      slug: 'eclairage',
      title: 'Éclairage',
      short: 'Rénovation ou création d’éclairage, intérieur comme extérieur.',
      icon: 'Lightbulb',
      bullets: ['Spots, appliques, éclairage extérieur', 'Détecteurs de mouvement', 'Passage en LED'],
      description:
        'Refaire l’éclairage d’une pièce, ajouter un détecteur de mouvement sur une entrée, passer en LED pour réduire la facture : on intervient sur l’ensemble du circuit d’éclairage.',
    },
  ],

  about: {
    title: 'L’entreprise',
    story:
      'Fondée en 2015 par Kevin Rota, Volt & Fils est rejointe par son frère Anthony en 2019. Le nom garde une part de clin d’œil familial, même si l’équipe ne se limite plus à la famille.\n\nQualifiés Qualifelec et certifiés IRVE, ils interviennent aussi bien chez les particuliers que sur de petits chantiers professionnels.',
    values: [
      { title: 'Qualifelec', text: 'Qualification vérifiée chaque année, gage de compétence technique.' },
      { title: 'Devis avant travaux', text: 'Le prix est connu avant que la première vis soit posée.' },
      { title: 'Chantier propre', text: 'Gaines cachées, finitions soignées, rien qui traîne en repartant.' },
    ],
    portrait: { src: '/images/portrait.webp', alt: 'Kevin Rota, électricien, Volt & Fils' },
  },

  proof: {
    // DEMO : données fictives
    testimonials: [
      { author: 'Nadia B.', text: 'Tableau électrique refait en une journée, travail impeccable et explications claires.', source: 'Google', city: 'Villeurbanne' },
      { author: 'Thomas L.', text: 'Installation de la borne de recharge sans accroc, dossier copropriété géré par eux.', source: 'Google', city: 'Lyon' },
      { author: 'Camille R.', text: 'Dépannage un samedi matin, rappelés dans l’heure.', source: 'Pages Jaunes', city: 'Bron' },
    ],
  },

  faq: [
    { q: 'Intervenez-vous en urgence le week-end ?', a: 'Sur demande, selon disponibilité — contactez par téléphone pour connaître les conditions.' },
    { q: 'La mise aux normes est-elle obligatoire pour vendre un bien ?', a: 'Un diagnostic électrique est obligatoire pour toute vente d’un logement dont l’installation a plus de quinze ans.' },
    { q: 'Combien de temps pour installer une borne IRVE ?', a: 'Selon la puissance disponible et la distance au tableau, comptez une demi-journée à une journée complète.' },
    { q: 'Faites-vous les petits dépannages ?', a: 'Oui, une prise qui ne fonctionne plus ou un interrupteur cassé font partie des interventions courantes.' },
  ],

  social: { linkedin: 'https://www.linkedin.com/company/volt-et-fils' },

  form: { provider: 'mailto' },
  images: {
    hero: { src: '/images/hero.webp', alt: 'Électricien de Volt & Fils en intervention à Villeurbanne' },
  },
  seo: { keywords: ['électricien Villeurbanne', 'électricien Lyon', 'borne recharge IRVE Lyon', 'mise aux normes électrique Lyon'] },
  legal: { owner: 'Kevin Rota' },
});
