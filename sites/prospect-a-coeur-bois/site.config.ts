// PROSPECT (démo privée, jamais indexée) : À cœur bois, Guy Andries, ébéniste et menuisier à Puyricard
// (Aix-en-Provence). Données publiques relevées le 17 oct 2026 (brief.md, sources entre parenthèses) ; rien n’a été
// demandé au commerçant. Photos : celles de son site (raw/SOURCES.md), 283 à 800 px de large, jamais étirées.
// Avis : les deux avis à texte de sa fiche Google, recopiés mot pour mot (fautes comprises), note et nombre réels.
// Contrat : direction.md. Pages service sur mesure dans pages/ (servicePages: false, raison dans direction.md § Socle).
import { defineSite } from '@/lib/schema';

const GOOGLE =
  'https://www.google.com/maps/place/%C3%89b%C3%A9nisterie+Menuiserie+%C3%A0+coeur+bois/data=!4m7!3m6!1s0x12c9f49beead504d:0x20372e7cd3ff7682!8m2!3d43.5935579!4d5.3669724!16s%2Fg%2F11bwhbcfz8';

export default defineSite({
  slug: 'prospect-a-coeur-bois',
  direction: 'nordique',
  accent: { h: 24, s: 48, l: 30 },
  typography: { display: 'familjenGrotesk', body: 'domine' },
  scale: 'normal',
  // Le moteur ne fait rien bouger : le mouvement vient des sections sur mesure (direction.md, MOUVEMENT).
  motion: 'none',
  servicePages: false,
  layout: {
    nav: 'custom/Nav',
    hero: 'custom/Mur',
    sections: [
      { type: 'custom', variant: 'Avis', label: 'Avis' },
      { type: 'custom', variant: 'Rubriques', label: 'Réalisations' },
      { type: 'custom', variant: 'Atelier', label: 'L’atelier' },
      { type: 'custom', variant: 'Venir', label: 'Venir' },
    ],
    footer: 'custom/Pied',
    shell: 'flow',
    divider: 'none',
    tone: 'flat',
    headings: 'left',
    curtain: false,
    contactDrawer: false,
    // Barre d’actions du bas : dessinée dans sections/Nav.astro (Appeler, Écrire, Venir), pas la barre partagée
    // (elle n’offre « Écrire » qu’avec une section contact partagée).
    actionBar: false,
  },

  business: {
    name: 'À cœur bois',
    trade: 'Ébéniste et menuisier',
    tagline: 'Ébéniste et menuisier à Puyricard, Aix-en-Provence',
    description:
      'Guy Andries, ébéniste et menuisier diplômé, fabrique cuisines, meubles, bibliothèques et agencements dans son atelier de la route de Rognes, à Puyricard.\n\nFenêtres, volets, portillons et terrasses aussi. Large choix d’essences de bois et de dérivés du bois.',
    since: 2006,
    legalForm: 'Entreprise individuelle',
    siret: '490 224 615 00024',
    schemaType: 'HomeAndConstructionBusiness',
  },

  contact: {
    phone: '+33674037831',
    phoneDisplay: '06 74 03 78 31',
    email: 'acoeurbois@wanadoo.fr',
    address: { street: '820 route de Rognes, Puyricard', postalCode: '13540', city: 'Aix-en-Provence' },
    mapsUrl: GOOGLE,
    hours: [
      { days: 'Du lundi au vendredi', hours: '9 h à 12 h', opens: '09:00', closes: '12:00' },
      { days: 'Du lundi au vendredi', hours: '14 h à 18 h', opens: '14:00', closes: '18:00' },
      { days: 'Samedi', hours: 'Fermé' },
      { days: 'Dimanche', hours: 'Fermé' },
    ],
    mapsProvider: 'none',
    emergency24h: false,
  },

  zones: { cities: [] },

  services: [
    {
      slug: 'cuisines',
      title: 'Cuisines',
      short: 'La création de votre cuisine, ou son relooking : on change les façades, le plan de travail.',
      description:
        'La création de votre cuisine, ou le relooking de celle que vous avez : changement des façades, du plan de travail.\n\nPour le plan de travail, quatre matières : pierre acrylique naturelle LG HI-MACS, compact stratifié, Dekton, pierre.',
      bullets: ['Création de votre cuisine', 'Relooking : changement des façades', 'Plan de travail en LG HI-MACS, compact stratifié, Dekton ou pierre'],
      icon: 'ChefHat',
      featured: true,
      image: { src: '/images/cuisine-01.webp', alt: 'Cuisine en bois avec une table haute en bois clair et des tabourets' },
    },
    {
      slug: 'meubles',
      title: 'Meubles',
      short: 'La fabrication de vos meubles, de tous styles : tables, buffets, rangements.',
      description:
        'La fabrication de vos meubles uniques, de tous styles : une table, un buffet, un meuble qui n’existe pas en magasin.\n\nLe bois se choisit parmi un large choix d’essences et de dérivés du bois.',
      bullets: ['Tables', 'Buffets', 'Meubles de tous styles', 'Large choix d’essences de bois'],
      icon: 'Armchair',
      image: { src: '/images/meuble-03.webp', alt: 'Grande table en chêne entourée de chaises' },
    },
    {
      slug: 'bibliotheques',
      title: 'Bibliothèques',
      short: 'Bibliothèques murales, d’angle ou en cloison ouverte, meubles bas et niches.',
      description:
        'Une bibliothèque qui prend tout un mur, un angle, ou qui sépare deux espaces sans les fermer.\n\nSur les photos : une bibliothèque d’angle anthracite, une bibliothèque-cloison blanche ouverte, un meuble bas en bois sous des niches cintrées.',
      bullets: ['Bibliothèque murale ou d’angle', 'Bibliothèque-cloison ouverte', 'Meubles bas et niches'],
      icon: 'Library',
      image: { src: '/images/bibliotheque-03.webp', alt: 'Bibliothèque blanche ouverte qui sépare deux espaces, étagères garnies de livres' },
    },
    {
      slug: 'agencement',
      title: 'Agencement d’intérieurs',
      short: 'Salle de bain, dressing, buanderie, placards, habillage mural : toute une pièce.',
      description:
        'Quand ce n’est plus un meuble mais une pièce : salle de bain, dressing, buanderie, placards, habillage de murs en bois.\n\nSur les photos : une bibliothèque murale et des boiseries de salon, des placards blancs en cours de pose, un mur habillé de bois dans une salle de sport.',
      bullets: ['Salle de bain', 'Dressing et placards', 'Buanderie', 'Habillage mural en bois'],
      icon: 'LayoutPanelLeft',
      image: { src: '/images/agencement-01.webp', alt: 'Salon avec une bibliothèque murale en bois et des boiseries peintes' },
    },
    {
      slug: 'menuiseries',
      title: 'Menuiseries et extérieurs',
      short: 'Volets, fenêtres, portillons ; et la pose de terrasse, parquet, bardage.',
      description:
        'La réalisation de vos menuiseries : volets, fenêtres, portillons. Les volets provençaux se font à la mesure de vos ouvertures.\n\nEt la pose de votre terrasse, de votre parquet ou d’un bardage, avec de nombreux choix.',
      bullets: ['Volets provençaux', 'Fenêtres', 'Portillons', 'Terrasse, parquet, bardage'],
      icon: 'DoorOpen',
      image: { src: '/images/menuiserie-02.webp', alt: 'Fenêtre et volets en bois sur une façade de pierre' },
    },
  ],

  about: {
    title: 'Guy Andries',
    story:
      'Guy Andries est ébéniste et menuisier diplômé. Son atelier, à cœur bois, est au 820 route de Rognes, à Puyricard. Il a créé l’entreprise en 2006.\n\nUn large choix d’essences de bois et de dérivés du bois ; pour les cuisines, quatre matières de plan de travail.',
    milestones: [
      { year: '2006', text: 'Création de l’entreprise, à Puyricard.' },
      { year: '2027', text: 'En projet : un stage d’initiation à la menuiserie et à l’ébénisterie, pour particuliers débutants, une semaine (30 h).' },
    ],
  },

  proof: {
    google: { rating: 5, count: 3, url: GOOGLE },
    testimonials: [
      { author: 'Jean Bernard B.', text: 'Artisant professionnels et très sympathique. Je recommande.', source: 'Avis Google', date: 'février 2025' },
      { author: 'Patrick D.', text: 'Du travail de qualité', source: 'Avis Google', date: 'novembre 2019' },
    ],
  },

  wording: {
    devis: 'Écrire',
    servicesTitle: 'Votre projet',
    ctaTitle: 'Un projet en bois ? Appelez Guy Andries.',
    contactTitle: 'Route de Rognes',
    contactText: 'L’atelier est à Puyricard, ouvert du lundi au vendredi.',
  },
  form: { provider: 'none' },
  images: {},
  seo: {
    title: 'À cœur bois, ébéniste et menuisier à Puyricard, Aix-en-Provence',
    description:
      'Guy Andries, ébéniste et menuisier diplômé à Puyricard (Aix-en-Provence) : cuisines, meubles, bibliothèques, agencement, volets et fenêtres. 06 74 03 78 31.',
    keywords: ['ébéniste Aix-en-Provence', 'menuisier Puyricard', 'cuisine bois Aix-en-Provence', 'bibliothèque menuisier Aix'],
  },
  legal: { owner: 'Guy Andries', prospect: true },
});
