// DEMO : cliente inventée
// Accueil refait le 29 oct 2026 d'après UN site de référence entier, Casa Bonay (docs/veille/styles/casabonay.md,
// modèle presets/casabonay.json) : la paire anna-vidal / borie-des-chenes était trop proche (ff ressemblance : 0,81 au
// téléphone, 0,75 à l'ordinateur, déroulé 1,00 ; deux accueils-menus sans photo). Désormais la coquille `split` rend la
// colonne fixe de la source (nom, les quatre séries en liens, téléphone, porte rouge « Raconter votre journée » qui ouvre
// le contact en tiroir) et le hero `mur-de-photos` pose huit des onze photos du dossier bord à bord, une haute pour deux
// larges ; sous le mur, le manifeste (bloc propre à ce site, sites/anna-vidal/sections/Manifeste.astro), puis le pied.
// Les séries (mariage, élopement, famille, portrait) ont chacune leur page en gabarit « porte ». Les anciens blocs sur
// mesure de l'accueil-menu (hero épinglé, nav, séries, instants, formules) sont retirés.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'anna-vidal',
  direction: 'casabonay',
  motion: 'subtle',
  scale: 'normal',
  layout: {
    shell: 'split',
    nav: 'bar',
    hero: 'mur-de-photos',
    sections: [
      { type: 'custom', variant: 'manifeste', label: 'Manifeste' },
    ],
    footer: 'minimal',
    divider: 'none',
    tone: 'flat',
    contactDrawer: true,
    servicePage: 'porte',
  },

  business: {
    name: 'Anna Vidal',
    trade: 'Photographe de mariage et de famille',
    tagline: 'Vos journées, <em>racontées sans les rejouer.</em>',
    description:
      'Je photographie des mariages et des familles à Bordeaux depuis 2013. L’argentique est réservé à la cérémonie. Le reste de la journée se fait en numérique.\n\nJe travaille en retrait, sans rien faire rejouer. Et je me déplace en Nouvelle-Aquitaine, parfois plus loin.',
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
      short: 'La journée entière, des préparatifs au bal. Galerie sous 6 semaines.',
      icon: 'Camera',
      featured: true,
      bullets: [
        'Préparatifs jusqu’à l’ouverture du bal',
        'Reportage discret, aucune pose imposée',
        'La cérémonie en argentique',
        'Galerie numérique privée sous 6 semaines',
      ],
      image: { src: '/images/service-1.webp', alt: 'Préparatifs de mariée, lumière du matin' },
      images: [
        { src: '/images/galerie-2.webp', alt: 'La robe dans l’escalier' },
        { src: '/images/galerie-3.webp', alt: 'Le cortège, à pied' },
        { src: '/images/galerie-6.webp', alt: 'La nuit, sur la piste' },
      ],
    },
    {
      slug: 'elopement',
      title: 'Élopement',
      short: 'Une journée à deux, dans un lieu choisi ensemble.',
      icon: 'Heart',
      featured: true,
      bullets: [
        'La date et le lieu se décident ensemble',
        'Repérage et lumière pensés en amont',
        'Reportage libre, sans mise en scène',
        'Galerie complète sous 3 semaines',
      ],
      image: { src: '/images/service-2.webp', alt: 'Couple en élopement, lumière naturelle' },
    },
    {
      slug: 'famille',
      title: 'Famille',
      short: 'Une heure chez vous, ou dehors. Au rythme des enfants, pas du mien.',
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
      short: 'Une séance courte, en lumière naturelle. Une dizaine de photos, livrées sous deux semaines.',
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

  // Le mur de l'accueil : couverture, ces trois photos, puis une par série (8 photos, budget images-home tenu) ; les
  // trois autres photos de mariage sont sur la page Mariage (services[0].images).
  proof: {
    gallery: [
      { src: '/images/galerie-1.webp', alt: 'Les mains, avant la cérémonie' },
      { src: '/images/galerie-5.webp', alt: 'Le premier regard' },
      { src: '/images/galerie-4.webp', alt: 'La table, au soleil couchant' },
    ],
  },

  about: {
    story:
      'Je photographie des mariages et des familles depuis 2013, à Bordeaux. L’argentique pour la cérémonie, le numérique pour le reste de la journée.\n\nJe reste en retrait et je ne fais rien rejouer. Une sortie d’église se passe une fois ; si je l’ai manquée, je l’ai manquée.',
  },

  faq: [
    {
      q: 'Sous combien de temps est-ce que je reçois mes photos ?',
      a: 'Pour un mariage, comptez environ 6 semaines : le temps de développer et scanner l’argentique de la cérémonie, puis de trier l’ensemble. Pour une famille, un portrait ou un élopement, la galerie est prête sous 2 à 3 semaines.',
    },
    {
      q: 'Combien de photos vais-je recevoir ?',
      a: 'Pas de nombre promis à l’avance : ça dépend de la durée et de ce qui s’y passe. Pour un mariage, comptez plusieurs centaines de photos. Pour une famille ou un portrait, quelques dizaines, triées.',
    },
    {
      q: 'Vous déplacez-vous en dehors de Bordeaux ?',
      a: 'Oui, régulièrement, en Nouvelle-Aquitaine et plus loin quand il faut. Et au-delà d’un certain rayon autour de Bordeaux, les frais de déplacement apparaissent sur le devis, en ligne à part.',
    },
    {
      q: 'Puis-je utiliser mes photos comme je le souhaite ?',
      a: 'Elles sont à vous, pour un usage personnel et privé : tirages, albums, partage à vos proches. Pour un usage commercial ou une publication professionnelle, dites-le-moi avant.',
    },
  ],

  wording: {
    devis: 'Raconter votre journée',
    ctaTitle: 'Une date ? <em>Écrivez-la-moi.</em>',
    contactTitle: 'Raconter votre journée',
    contactText: 'La date, le lieu, ce que vous imaginez. Je réponds sous 48 h.',
  },
  form: { provider: 'mailto' },
  images: {
    hero: { src: '/images/hero.webp', alt: 'Mariés au lever du jour, campagne bordelaise' },
    // Démo : photos libres (CREDITS.md), chacune porte la mention « Photo d’illustration ».
    illustration: true,
  },
  seo: {
    keywords: ['photographe de mariage Bordeaux', 'photographe élopement Nouvelle-Aquitaine', 'photographe famille Bordeaux'],
  },
  legal: { owner: 'Anna Vidal' },
});
