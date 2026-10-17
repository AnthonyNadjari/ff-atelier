/**
 * Site d'exemple : sert de reference pour le schema et de fumigene pour les builds.
 * Copier ce fichier pour demarrer un client (`npm run ff -- nouveau <slug>` le fait).
 * Chiffres et avis ci-dessous sont fictifs : c'est un exemple, pas un client.
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: '_exemple',
  direction: 'atelier',
  motion: 'rich',
  layout: {
    nav: 'bar',
    hero: 'split',
    sections: [
      { type: 'services', variant: 'grid' },
      { type: 'cta', variant: 'band' },
      { type: 'contact', variant: 'form-split' },
    ],
    footer: 'columns',
    // Barre d'actions collée en bas sur téléphone (2 à 4 portes de actions()) — voir docs/DIRECTIONS.md.
    actionBar: true,
  },

  business: {
    name: 'Menuiserie Vasseur',
    trade: 'Menuisier-ébéniste',
    tagline: 'Du bois, des mains, <em>et le temps qu’il faut.</em>',
    description:
      'Atelier de menuiserie à Roubaix depuis 2009. Escaliers, cuisines, bibliothèques et agencements sur mesure, en bois massif, dessinés avec vous et fabriqués ici.\n\nNous travaillons pour les particuliers et les architectes de la métropole lilloise.',
    since: 2009,
    legalForm: 'EURL',
    insurance: 'Assurance décennale MAAF n° 000 000',
    certifications: ['Qualibat', 'Artisan d’art'],
  },

  contact: {
    phone: '+33600000000',
    phoneDisplay: '06 00 00 00 00',
    email: 'contact@exemple.fr',
    whatsapp: '33600000000',
    address: { street: '12 rue de l’Épeule', postalCode: '59100', city: 'Roubaix' },
    mapsUrl: 'https://maps.google.com/?q=Roubaix',
    // Portes d'action (actions()) : URLs d'exemple pour exercer le schéma — un vrai client ne les a que
    // si son brief les donne (jamais devinées).
    bookingUrl: 'https://exemple.fr/reserver',
    giftCardUrl: 'https://exemple.fr/bon-cadeau',
    // opens/closes HH:MM : JSON-LD structuré + état « Ouvert / Fermé / Ouvre à 14 h » du composant Horaires
    // (src/components/Horaires.astro) ; deux lignes pour les mêmes jours = deux créneaux.
    hours: [
      { days: 'Lundi – vendredi', hours: '8 h – 12 h', opens: '08:00', closes: '12:00' },
      { days: 'Lundi – vendredi', hours: '14 h – 18 h', opens: '14:00', closes: '18:00' },
      { days: 'Samedi', hours: 'Sur rendez-vous' },
    ],
    emergency24h: false,
  },

  zones: { cities: ['Roubaix', 'Tourcoing', 'Lille', 'Villeneuve-d’Ascq', 'Marcq-en-Barœul', 'Wattrelos'], label: 'Métropole lilloise' },

  services: [
    { slug: 'cuisines', title: 'Cuisines sur mesure', short: 'Dessinée pour votre pièce, fabriquée en chêne ou en frêne massif.', icon: 'CookingPot', featured: true, bullets: ['Plan 3D avant fabrication', 'Bois massif ou plaqué', 'Pose comprise'], description: 'Une cuisine sur mesure commence par une visite chez vous. Nous mesurons, nous écoutons, puis nous dessinons.\n\nLa fabrication se fait à l’atelier, la pose par nos soins. Comptez six à dix semaines entre la validation du plan et la pose.' },
    { slug: 'escaliers', title: 'Escaliers', short: 'Droits, quart tournant ou hélicoïdaux, en bois massif.', icon: 'Layers', featured: true, bullets: ['Relevé sur place', 'Garde-corps assortis', 'Rénovation d’escaliers existants'] },
    { slug: 'agencement', title: 'Bibliothèques et agencements', short: 'Bibliothèques, dressings, meubles TV : le meuble qui épouse le mur.', icon: 'LayoutPanelLeft', bullets: ['Sous pente, alcôve, angle', 'Finitions huilées ou laquées'] },
  ],

  about: {
    title: 'L’atelier',
    story:
      'Julien Vasseur a appris le métier chez un compagnon du devoir avant d’ouvrir son atelier en 2009. Aujourd’hui ils sont trois à l’établi.\n\nOn aime le chêne, le frêne et le noyer. On aime surtout qu’un meuble dure plus longtemps que la maison.',
    values: [
      { title: 'Bois massif', text: 'Sourcé en France, séché à l’atelier.' },
      { title: 'Sur mesure, vraiment', text: 'Aucun catalogue. Chaque pièce est dessinée pour vous.' },
      { title: 'Un seul interlocuteur', text: 'Celui qui dessine fabrique et pose.' },
    ],
  },

  proof: {
    google: { rating: 4.9, count: 37, url: 'https://maps.google.com/?q=Roubaix' },
    testimonials: [
      { author: 'Claire D.', text: 'Une cuisine magnifique, exactement le dessin validé. Pose propre, délais tenus.', source: 'Google', city: 'Lille' },
      { author: 'Marc & Sophie', text: 'Escalier en chêne posé en une journée. Le résultat est superbe.', source: 'Google', city: 'Tourcoing' },
    ],
    // Réalisations avec métadonnées (geste 5, src/lib/galerie.ts) : lieu, type (= filtre de proof/gallery dès
    // deux types distincts), mesure, client en initiales avec son accord. Tout vient du brief (§ 8), rien n'est
    // deviné : un champ absent n'est pas affiché. Les fichiers n'existent pas ici (_exemple n'a aucune photo,
    // pas plus de hero) : ces entrées servent de référence de schéma et au fumigène tests/galerie.test.mjs.
    gallery: [
      { src: '/images/realisation-cuisine.webp', alt: 'Cuisine en chêne massif, façades lisses, plan de travail bois', place: 'Roubaix', kind: 'Cuisine', size: '14 m²', client: 'Claire D.' },
      { src: '/images/realisation-escalier.webp', alt: 'Escalier quart tournant en chêne, garde-corps à barreaux plats', place: 'Tourcoing', kind: 'Escalier', size: '2 jours de pose' },
      { src: '/images/realisation-bibliotheque.webp', alt: 'Bibliothèque sous pente en frêne, du sol au plafond', place: 'Vieux-Lille', kind: 'Agencement', size: '4 m de linéaire' },
      { src: '/images/realisation-cuisine-2.webp', alt: 'Cuisine en frêne huilé avec îlot central', place: 'Marcq-en-Barœul', kind: 'Cuisine', size: '18 m²' },
    ],
  },

  faq: [
    { q: 'Quel délai pour une cuisine ?', a: 'Six à dix semaines entre la validation du plan et la pose, selon la saison.' },
    { q: 'Vous déplacez-vous pour un devis ?', a: 'Oui, la visite et le devis sont gratuits dans la métropole lilloise.' },
  ],

  wording: { actions: { booking: 'Prendre rendez-vous' } },
  form: { provider: 'mailto' },
  images: {},
  seo: { keywords: ['menuisier Roubaix', 'cuisine sur mesure Lille', 'escalier bois Roubaix'] },
  legal: { owner: 'Julien Vasseur' },
});
