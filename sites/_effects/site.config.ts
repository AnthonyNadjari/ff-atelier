/**
 * Site d'exemple : sert de reference pour le schema et de fumigene pour les builds.
 * Copier ce fichier pour demarrer un client (`npm run ff -- nouveau <slug>` le fait).
 * Chiffres et avis ci-dessous sont fictifs : c'est un exemple, pas un client.
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: '_effects',
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
  },

  business: {
    name: 'Menuiserie Vasseur',
    trade: 'Menuisier-ébéniste',
    tagline: 'Du bois, des mains, <em>et le temps qu’il faut.</em>',
    description:
      'Atelier de menuiserie à Roubaix depuis 2009. Escaliers, cuisines, bibliothèques et agencements sur mesure, en bois massif, dessinés avec vous et fabriqués ici.\n\nNous travaillons pour les particuliers et les architectes de la métropole lilloise.',
    since: 2009,
    legalForm: 'EURL',
    insurance: 'Assurance décennale MAAF n° 000 000',
    certifications: ['Qualibat', 'Artisan d’art'],
  },

  contact: {
    phone: '+33600000000',
    phoneDisplay: '06 00 00 00 00',
    email: 'contact@exemple.fr',
    whatsapp: '33600000000',
    address: { street: '12 rue de l’Épeule', postalCode: '59100', city: 'Roubaix' },
    mapsUrl: 'https://maps.google.com/?q=Roubaix',
    hours: [
      { days: 'Lundi – vendredi', hours: '8h – 18h' },
      { days: 'Samedi', hours: 'Sur rendez-vous' },
    ],
    emergency24h: false,
  },

  zones: { cities: ['Roubaix', 'Tourcoing', 'Lille', 'Villeneuve-d’Ascq', 'Marcq-en-Barœul', 'Wattrelos'], label: 'Métropole lilloise' },

  services: [
    { slug: 'cuisines', title: 'Cuisines sur mesure', short: 'Dessinée pour votre pièce, fabriquée en chêne ou en frêne massif.', icon: 'CookingPot', featured: true, bullets: ['Plan 3D avant fabrication', 'Bois massif ou plaqué', 'Pose comprise'], description: 'Une cuisine sur mesure commence par une visite chez vous. Nous mesurons, nous écoutons, puis nous dessinons.\n\nLa fabrication se fait à l’atelier, la pose par nos soins. Comptez six à dix semaines entre la validation du plan et la pose.' },
    { slug: 'escaliers', title: 'Escaliers', short: 'Droits, quart tournant ou hélicoïdaux, en bois massif.', icon: 'Layers', featured: true, bullets: ['Relevé sur place', 'Garde-corps assortis', 'Rénovation d’escaliers existants'] },
    { slug: 'agencement', title: 'Bibliothèques et agencements', short: 'Bibliothèques, dressings, meubles TV : le meuble qui épouse le mur.', icon: 'LayoutPanelLeft', bullets: ['Sous pente, alcôve, angle', 'Finitions huilées ou laquées'] },
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
  },

  faq: [
    { q: 'Quel délai pour une cuisine ?', a: 'Six à dix semaines entre la validation du plan et la pose, selon la saison.' },
    { q: 'Vous déplacez-vous pour un devis ?', a: 'Oui, la visite et le devis sont gratuits dans la métropole lilloise.' },
  ],

  form: { provider: 'mailto' },
  images: {},
  seo: { keywords: ['menuisier Roubaix', 'cuisine sur mesure Lille', 'escalier bois Roubaix'] },
  legal: { owner: 'Julien Vasseur' },
});
