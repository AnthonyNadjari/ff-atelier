/**
 * DEMO : client inventé. Métier 20 de la liste (docs/OBJECTIF.md) : chambres d'hôtes, Dordogne.
 *
 * `ff composer borie-des-chenes --metier "Chambres d'hôtes"` propose la direction "industriel"
 * (béton/acier/orange sécurité, Bebas, garages/métallerie/BTP) — écartée d'emblée : l'exact
 * opposé d'une maison d'hôtes en pierre, et cette direction a un problème de contraste d'accent
 * déjà signalé à plusieurs reprises dans le journal. Direction retenue à la place : "atelier"
 * (chaleureux, artisanal, papier chaud, serif Fraunces). Grep sur `direction:` dans les 19 sites
 * dessinés à la main avant ce tour : "atelier" n'apparaît qu'une fois, sur `barbier-kessler` — et
 * cet unique usage surcharge entièrement l'accent (vert sombre, hsl(150 45% 34%)) et la
 * typographie (Oswald/Cabin) par défaut de la direction, pour un rendu volontairement éloigné
 * de son ambiance native. La palette chaude d'origine de la direction (papier `#faf7f2`, accent
 * terre cuite hsl(22 68% 39%), Fraunces Variable) n'a donc encore jamais été montrée telle
 * quelle dans ce dépôt — c'est exactement "warm stone, slow" pour une maison en pierre entourée
 * de chênes, donc gardée par défaut, sans surcharge d'accent ni de typographie. Aucune autre
 * direction ne combine mieux chaleur et lenteur pour ce mandat : "terre" (déjà utilisée par
 * atelier-lecerf) penche vert/organique plutôt que pierre ; "mediterranee" (chez-malo) évoque la
 * mer, pas la vallée de la Dordogne ; "pierre" (studio-ambre) est minérale mais délibérément
 * froide et minimale ("grand vide", éviter "ludique") — l'inverse d'une table d'hôtes conviviale.
 *
 * scale "display" pour un nom de maison en serif géant dans le hero ; tone "alternate" et
 * divider "rule" pour un rythme calme de filets fins entre les sections (cohérent avec le
 * meta.ts de la direction : "rule" figure dans ses séparateurs adaptés) ; headings "left" pour
 * un ton éditorial plutôt que centré-brochure. Nav et hero sur mesure, six autres sections sur
 * mesure (voir sites/borie-des-chenes/sections/) : aucune réutilisée d'un autre site du dépôt.
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'borie-des-chenes',
  direction: 'atelier',
  motion: 'rich',
  scale: 'display',

  layout: {
    nav: 'custom/Nav',
    hero: 'custom/Hero',
    sections: [
      { type: 'custom', variant: 'Chambres', label: 'Les chambres' },
      { type: 'custom', variant: 'Table', label: 'La table' },
      { type: 'custom', variant: 'Hotes', label: 'Les hôtes' },
      { type: 'custom', variant: 'Autour', label: 'Autour' },
      { type: 'custom', variant: 'Disponibilites', label: 'Disponibilités' },
      { type: 'custom', variant: 'Reservation', label: 'Réserver' },
    ],
    footer: 'minimal',
    divider: 'rule',
    tone: 'alternate',
    headings: 'left',
  },

  business: {
    name: 'La Borie des Chênes',
    trade: 'Chambres d’hôtes',
    schemaType: 'BedAndBreakfast',
    tagline: 'Chambres d’hôtes en Dordogne depuis 2011, <em>au rythme de la vallée.</em>',
    description:
      'Quatre chambres et un gîte pour six personnes au lieu-dit La Borie, à Saint-Cyprien, au cœur de la vallée de la Dordogne.\n\nAnne et Marc Delpech vous accueillent depuis 2011, avec une piscine, une table d’hôtes le soir sur réservation, et le calme d’un lieu à l’écart de la route.\n\nOuvert d’avril à octobre.',
    since: 2011,
  },

  contact: {
    phone: '+33639985823',
    phoneDisplay: '06 39 98 58 23',
    email: 'contact@exemple.fr',
    address: { street: 'La Borie', postalCode: '24220', city: 'Saint-Cyprien' },
    mapsUrl: 'https://maps.google.com/?q=Saint-Cyprien+Dordogne',
    mapsProvider: 'osm',
    coordinates: { lat: 44.856, lng: 1.043 },
    hours: [{ days: 'Avril – octobre', hours: 'Sur réservation' }],
    emergency24h: false,
  },

  services: [
    {
      slug: 'chambre-noyer',
      title: 'Chambre Noyer',
      short: 'Vue sur la vallée, 18 m².',
      bullets: ['18 m²', 'Vue sur la vallée'],
      priceFrom: '95 €',
      icon: 'BedDouble',
      image: { src: '/images/service-1.webp', alt: 'Chambre Noyer, vue sur la vallée' },
      featured: true,
    },
    {
      slug: 'chambre-chataignier',
      title: 'Chambre Châtaignier',
      short: 'Vue sur le jardin, 16 m².',
      bullets: ['16 m²', 'Vue sur le jardin'],
      priceFrom: '105 €',
      icon: 'BedDouble',
      image: { src: '/images/service-2.webp', alt: 'Chambre Châtaignier, vue sur le jardin' },
    },
    {
      slug: 'chambre-tilleul',
      title: 'Chambre Tilleul',
      short: 'Vue sur la piscine, 20 m².',
      bullets: ['20 m²', 'Vue sur la piscine'],
      priceFrom: '115 €',
      icon: 'BedDouble',
      image: { src: '/images/service-3.webp', alt: 'Chambre Tilleul, vue sur la piscine' },
    },
    {
      slug: 'chambre-vigne',
      title: 'Chambre Vigne',
      short: 'Vue sur les chênes, 22 m².',
      bullets: ['22 m²', 'Vue sur les chênes'],
      priceFrom: '130 €',
      icon: 'BedDouble',
      image: { src: '/images/service-4.webp', alt: 'Chambre Vigne, vue sur les chênes' },
      featured: true,
    },
    {
      slug: 'gite-la-grange',
      title: 'Le gîte — La Grange',
      short: 'Pour six personnes, à la semaine.',
      bullets: ['6 personnes', 'À la semaine'],
      priceFrom: '850 €',
      icon: 'Home',
    },
  ],

  about: {
    title: 'Anne et Marc',
    story:
      'Anne et Marc Delpech ont ouvert La Borie des Chênes en 2011, dans cette maison en pierre entourée des chênes qui lui donnent son nom.\n\nAnne s’occupe de la table d’hôtes, Marc du jardin et de la piscine. Ils reçoivent leurs hôtes comme on reçoit des amis — quelques familles à la fois, jamais plus.\n\nLa maison ouvre ses portes d’avril à octobre, le temps que la vallée se prête à la lenteur.',
    portrait: { src: '/images/portrait.webp', alt: 'Anne et Marc Delpech, devant La Borie des Chênes' },
  },

  form: { provider: 'mailto' },

  images: {
    hero: { src: '/images/hero.webp', alt: 'La terrasse de La Borie des Chênes au soir, table dressée pour la table d’hôtes' },
  },

  wording: {
    devis: 'Demander une disponibilité',
    ctaTitle: 'Une chambre, un gîte, une table d’hôtes&nbsp;? <em>Écrivez-nous, on vous répond le jour même.</em>',
    ctaText: 'Anne et Marc répondent eux-mêmes — pas de centrale de réservation.',
    contactTitle: 'Demander une disponibilité',
    contactText: 'Dites-nous vos dates et le nombre de nuits — et si vous souhaitez la table d’hôtes le soir.',
  },

  seo: {
    keywords: ['chambres d’hôtes Dordogne', 'gîte Saint-Cyprien', 'chambre d’hôtes vallée de la Dordogne', 'table d’hôtes Périgord'],
  },

  legal: { owner: 'Anne et Marc Delpech' },
});
