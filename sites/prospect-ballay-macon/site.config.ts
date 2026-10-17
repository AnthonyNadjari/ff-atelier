// PROSPECT (démo privée, jamais indexée) : Alain Ballay, artisan maçon carreleur à Perpignan. Données publiques
// relevées le 17 oct 2026 (brief.md, sources entre parenthèses) ; rien n’a été demandé à l’artisan. Photos : celles de
// sa page Réalisations (raw/SOURCES.md), jamais les photos Pexels de son site. Avis : deux avis Google recopiés mot
// pour mot ; l’avis de MARI Electricité, replié par Google, est écarté (brief : à relire avant usage).
// Contrat : direction.md. Pages de travaux sur mesure dans pages/ (servicePages: false, raison dans direction.md § Socle).
import { defineSite } from '@/lib/schema';

const GOOGLE =
  'https://www.google.com/maps/place/Artisan+Ma%C3%A7on+Carreleur+Ballay+Alain/@42.6972563,2.9329372,17z/data=!3m1!4b1!4m6!3m5!1s0x12b06f88d6e178d7:0x9838c769dffc1bfb!8m2!3d42.6972563!4d2.9329372!16s%2Fg%2F1tfsvykz';

export default defineSite({
  slug: 'prospect-ballay-macon',
  direction: 'mediterranee',
  typography: { display: 'specialGothic', body: 'karla' },
  scale: 'normal',
  // Client calme (direction.md, Aiguillage) : rien ne suit le défilement ; le geste répond au doigt.
  motion: 'subtle',
  servicePages: false,
  layout: {
    nav: 'custom/Nav',
    // Premier écran famille `mosaique` (direction.md) : ses quinze photos en calepinage, le texte en carreaux.
    hero: 'custom/Mosaique',
    sections: [
      { type: 'custom', variant: 'Avis', label: 'Avis' },
      { type: 'custom', variant: 'Travaux', label: 'Travaux' },
      { type: 'custom', variant: 'Materiaux', label: 'Matériaux' },
      { type: 'custom', variant: 'Alain', label: 'Alain Ballay' },
      { type: 'custom', variant: 'Estimation', label: 'Contact' },
    ],
    footer: 'custom/Pied',
    shell: 'flow',
    divider: 'none',
    tone: 'flat',
    headings: 'left',
    curtain: false,
    contactDrawer: false,
    // Pas de barre d’actions de trois boutons : un seul carreau « Appeler » (sections/Nav.astro).
    actionBar: false,
  },

  business: {
    name: 'Alain Ballay',
    trade: 'Maçon carreleur',
    tagline: 'Maçon carreleur à Perpignan',
    description:
      'Alain Ballay, artisan maçon carreleur à Perpignan depuis septembre 2000, ancien maître ouvrier dans les monuments historiques.\n\nTerrasses, salles de bain, carrelage et faïence, pierres de parement, cuisines d’été et barbecues, maçonnerie générale, démoussage de toitures, nettoyage de façades. Estimation gratuite.',
    since: 2000,
    legalForm: 'Entreprise individuelle',
    siret: '432 766 582 00014',
    schemaType: 'GeneralContractor',
  },

  contact: {
    phone: '+33688707235',
    phoneDisplay: '06 88 70 72 35',
    email: 'ballayalain66@gmail.com',
    address: { street: '5 rue Étienne-Louis Boullée', postalCode: '66000', city: 'Perpignan' },
    mapsUrl: GOOGLE,
    hours: [
      { days: 'Du lundi au vendredi', hours: '8 h à 18 h', opens: '08:00', closes: '18:00' },
      { days: 'Samedi', hours: 'Fermé' },
      { days: 'Dimanche', hours: 'Fermé' },
    ],
    mapsProvider: 'none',
    emergency24h: false,
  },

  zones: { cities: [], label: 'Perpignan et ses alentours' },

  services: [
    {
      slug: 'carrelage',
      title: 'Carrelage et faïence',
      short: 'Salle de bain, cuisine, sol ou terrasse : on change le carrelage pour donner un coup de frais.',
      description:
        'Besoin de rénover votre salle de bain, votre cuisine, un sol ou une terrasse ? Alain Ballay change le carrelage et la faïence pour leur donner un coup de frais.\n\nSur ses chantiers : de grands carreaux posés sur une terrasse, une allée carrelée, une cour, un carrelage effet bois jusqu’à la plinthe, un enduit repris sur un ancien carrelage.',
      bullets: ['Salles de bain', 'Terrasses et allées', 'Sols et cuisines', 'Faïence murale'],
      icon: 'Grid3x3',
      featured: true,
      image: { src: '/images/realisation-36.webp', alt: 'Terrasse en grands carreaux en cours de pose, croisillons dans les joints, devant une porte bleue' },
    },
    {
      slug: 'parement',
      title: 'Pierres de parement',
      short: 'Mur intérieur, mur de clôture ou jardinière, habillés de pierre, style rustique ou contemporain.',
      description:
        'Que ce soit sur un mur intérieur, un mur de clôture ou une jardinière, les pierres de parement habillent vos façades d’un style rustique ou contemporain, selon la pierre choisie.\n\nSur ses chantiers : une entrée habillée de pierre, une jardinière en parement sur un sol en ardoise.',
      bullets: ['Murs intérieurs', 'Murs de clôture', 'Jardinières', 'Rustique ou contemporain, selon la pierre'],
      icon: 'BrickWall',
      image: { src: '/images/realisation-48.webp', alt: 'Entrée de maison avec un mur habillé de pierre de parement et un sol carrelé' },
    },
    {
      slug: 'cuisines-d-ete',
      title: 'Cuisines d’été et barbecues',
      short: 'Le barbecue, le four à pizza ou la cuisine d’été, construits ensemble selon vos besoins et vos goûts.',
      description:
        'En fonction de vos besoins, et avec son expérience, Alain Ballay réalise avec vous le barbecue qui vous ressemble : en pierre, en brique, avec un four à pizza.\n\nSur ses chantiers : un barbecue maçonné en pierre avec ses portes en bois, une cuisine d’été en brique en cours de construction.',
      bullets: ['Barbecues maçonnés', 'Fours à pizza', 'Cuisines d’été'],
      icon: 'Flame',
      image: { src: '/images/realisation-01.webp', alt: 'Barbecue maçonné en pierre avec un plan de travail et des portes en bois' },
    },
    {
      slug: 'maconnerie',
      title: 'Maçonnerie générale',
      short: 'Briques et parpaings, réparation de fissures, d’affaissements et de fuites, dallages et allées.',
      description:
        'Des projets en briques et en parpaings, des réparations de fissures, d’affaissements et de fuites, et des maçonneries à votre idée.\n\nSur ses chantiers : un dallage en opus incertum, une allée en préparation, une marche et une terrasse en cours, une chape fraîche.',
      bullets: ['Briques et parpaings', 'Fissures, affaissements, fuites', 'Dallages, allées, chapes'],
      icon: 'Hammer',
      image: { src: '/images/realisation-66.webp', alt: 'Dallage en opus incertum, pierres plates irrégulières jointoyées' },
    },
    {
      slug: 'demoussage',
      title: 'Démoussage de toitures',
      short: 'Le démoussage de votre toiture, avec des produits biodégradables.',
      description: 'Le démoussage de votre toiture, avec des produits biodégradables : c’est garanti.',
      bullets: ['Produits biodégradables'],
      icon: 'House',
    },
    {
      slug: 'facades',
      title: 'Nettoyage de façades',
      short: 'Un nettoyage avec des produits adaptés, pour donner une seconde vie à votre mur.',
      description: 'Un nettoyage de façade avec des produits spécifiques peut facilement donner une seconde vie à votre mur.',
      bullets: ['Produits spécifiques'],
      icon: 'Building',
    },
  ],

  about: {
    title: 'Alain Ballay',
    story:
      'Avant de s’installer à son compte en septembre 2000, Alain Ballay a été maître ouvrier dans les monuments historiques.\n\nLa maçonnerie et le carrelage, par la même entreprise : le mur, la chape, puis le carreau.',
    milestones: [{ year: '2000', text: 'À son compte, en septembre, à Perpignan.' }],
  },

  proof: {
    google: { rating: 5, count: 5, url: GOOGLE },
    testimonials: [
      {
        author: 'Julien D.',
        text: 'Je recommande ! Travail de qualité, la rénovation de ma terrasse s’est super bien passée et la pose du carrelage de ma SdB aussi ! Merci encore',
        source: 'Avis Google',
        date: 'août 2023',
      },
      {
        author: 'Nonam Tattoo',
        text: 'Excellent professionnel, réalisation de ma magnifique salle de bain avec un travail de grande qualité ! Je vous le recommande les yeux fermés :)',
        source: 'Avis Google',
        date: 'mai 2023',
      },
    ],
  },

  faq: [
    { q: 'L’estimation est-elle payante ?', a: 'Non : contactez-le pour discuter de votre projet, l’estimation est gratuite.' },
    { q: 'Où intervient-il ?', a: 'À Perpignan et dans ses alentours.' },
    { q: 'Avec quels produits démousse-t-il ?', a: 'Des produits biodégradables, c’est garanti.' },
  ],

  wording: {
    devis: 'Estimation gratuite',
    servicesTitle: 'Les travaux',
    ctaTitle: 'Un projet ? L’estimation est gratuite.',
    contactTitle: 'Estimation gratuite',
    contactText: 'Contactez Alain Ballay pour discuter de votre projet : l’estimation est gratuite.',
  },
  form: { provider: 'none' },
  images: {
    hero: { src: '/images/realisation-01.webp', alt: 'Barbecue maçonné en pierre avec un plan de travail et des portes en bois' },
  },
  seo: {
    title: 'Alain Ballay, maçon carreleur à Perpignan',
    description:
      'Artisan maçon carreleur à Perpignan depuis 2000, ancien maître ouvrier des monuments historiques : terrasses, salles de bain, parement, barbecues, maçonnerie. Estimation gratuite, 06 88 70 72 35.',
    keywords: ['maçon Perpignan', 'carreleur Perpignan', 'terrasse carrelage Perpignan', 'barbecue maçonné Perpignan'],
  },
  legal: { owner: 'Alain Ballay', prospect: true },
});
