// DEMO : client inventé (Forge Delacroix). Coordonnées fictives (plage 06 39 98), avis fictifs.
// Hero et blocs principaux dessinés à la main pour ce site : sites/forge-delacroix/sections/.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'forge-delacroix',
  direction: 'nuit',
  accent: { h: 22, s: 88, l: 52 },
  typography: { display: 'bebas', body: 'archivo' },
  motion: 'rich',
  scale: 'display',
  layout: {
    shell: 'sidebar',
    nav: 'minimal',
    hero: 'custom/hero',
    sections: [
      { type: 'custom', variant: 'geste', label: 'Le geste' },
      { type: 'custom', variant: 'feu', label: 'Le feu' },
      { type: 'custom', variant: 'pieces', label: 'Pièces' },
      { type: 'services', variant: 'list' },
      { type: 'proof', variant: 'testimonials' },
      { type: 'cta', variant: 'band' },
      { type: 'contact', variant: 'simple' },
    ],
    footer: 'minimal',
    divider: 'none',
    tone: 'flat',
  },

  business: {
    name: 'Forge Delacroix',
    trade: 'Ferronnerie d’art',
    tagline: 'Le fer, <em>à la main.</em>',
    description:
      'Atelier de ferronnerie d’art à Toulouse depuis 1987. Portails, garde-corps, escaliers et mobilier en acier forgé, dessinés avec vous et martelés ici, au feu.\n\nDeux forgerons, une forge à charbon, aucune pièce de catalogue.',
    since: 1987,
    legalForm: 'SARL',
    insurance: 'Assurance décennale Groupama n° 000 000',
    certifications: ['Entreprise du Patrimoine Vivant'],
  },
  contact: {
    phone: '+33639984412',
    phoneDisplay: '06 39 98 44 12',
    email: 'contact@exemple.fr',
    address: { street: '4 impasse des Forges', postalCode: '31200', city: 'Toulouse' },
    hours: [
      { days: 'Lundi – vendredi', hours: '8h – 17h' },
      { days: 'Samedi', hours: 'Sur rendez-vous' },
    ],
  },
  zones: { cities: ['Toulouse', 'Blagnac', 'Colomiers', 'Balma', 'Castanet-Tolosan', 'Montauban'], radiusKm: 80 },

  services: [
    { slug: 'portails', title: 'Portails et grilles', short: 'Battants ou coulissants, motorisés ou non, dessinés pour votre entrée.', icon: 'DoorOpen', featured: true, bullets: ['Relevé sur place', 'Dessin à l’échelle validé avec vous', 'Galvanisation et thermolaquage'] },
    { slug: 'garde-corps', title: 'Garde-corps et rampes', short: 'Intérieur ou extérieur, aux normes, en acier forgé ou en plat.', icon: 'Fence', featured: true, bullets: ['Norme NF P01-012', 'Fixation sur béton, pierre ou bois'] },
    { slug: 'escaliers', title: 'Escaliers métalliques', short: 'Droits, quart tournant ou hélicoïdaux, marches bois ou tôle.', icon: 'Layers', bullets: ['Structure autoportante', 'Marches chêne, hêtre ou acier'] },
    { slug: 'mobilier', title: 'Mobilier et pièces uniques', short: 'Tables, consoles, luminaires, enseignes : une pièce, un dessin.', icon: 'Hammer', bullets: ['Acier brut ciré ou patiné', 'Pour particuliers, restaurants, boutiques'] },
  ],

  about: {
    title: 'L’atelier',
    story:
      'Michel Delacroix a allumé la forge en 1987 dans une ancienne écurie du quartier Bonnefoy. Son fils Antoine l’a rejoint en 2012.\n\nOn travaille l’acier à chaud, au marteau et à la presse, sur une forge à charbon. Ce qui sort d’ici a été dessiné pour un lieu précis.',
    values: [],
  },

  // DEMO : données fictives
  proof: {
    testimonials: [
      { author: 'Hélène R.', text: 'Un portail qu’on nous demande de photographier. Le dessin a été repris trois fois jusqu’à ce que ce soit exactement ça.', source: 'Google', city: 'Balma' },
      { author: 'Restaurant Le Quai', text: 'Rampe, enseigne et pieds de table. Tout est arrivé le même jour, posé en une matinée.', source: 'E-mail', city: 'Toulouse' },
    ],
  },

  wording: {
    devis: 'Décrire votre projet',
    ctaTitle: 'Un portail, une rampe, une pièce unique&nbsp;? <em>On dessine ensemble.</em>',
    ctaText: 'Visite sur place à Toulouse et alentours, dessin à l’échelle, devis ferme.',
    contactTitle: 'Venir à la forge',
    contactText: 'Le plus simple : un appel, puis une visite de l’atelier.',
  },
  form: { provider: 'mailto' },
  images: {
    hero: { src: '/images/hero.webp', alt: 'Forgeron martelant une pièce d’acier rougie' },
  },
  seo: { keywords: ['ferronnerie d’art Toulouse', 'portail fer forgé Toulouse', 'garde-corps acier sur mesure'] },
  legal: { owner: 'Michel Delacroix' },
});
