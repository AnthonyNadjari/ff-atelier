// DEMO : client inventé (Forge Delacroix). Coordonnées fictives (plage 06 39 98). Aucun avis affiché :
// un site d’exemple ne montre pas de faux retours clients (9 oct 2026, les deux témoignages fictifs ont
// été retirés au profit d’une FAQ). Hero et blocs principaux dessinés à la main : sites/forge-delacroix/sections/.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'forge-delacroix',
  direction: 'nuit',
  accent: { h: 22, s: 88, l: 52 },
  typography: { display: 'bebas', body: 'archivo' },
  motion: 'rich',
  // Scroll inertiel (Lenis) : vitrine riche, le defilement natif de la molette Windows paraissait
  // « ultra vite » et saccade sur les sequences (20 sept 2026). Coupe automatiquement sous automate.
  smoothScroll: true,
  scale: 'display',
  layout: {
    shell: 'sidebar',
    nav: 'minimal',
    hero: 'custom/hero',
    // 9 oct 2026 : le geste (séquence) est devenu le premier écran ; « Le feu en quatre temps » (gros
    // numéros) remplacé par « L’atelier » (histoire + faits) ; témoignages fictifs et bande CTA retirés,
    // FAQ avec les vraies questions d’un client à la place ; le nom en très grand ferme la page.
    sections: [
      { type: 'custom', variant: 'atelier', label: 'Atelier' },
      { type: 'custom', variant: 'pieces', label: 'Pièces' },
      { type: 'services', variant: 'list' },
      { type: 'faq', variant: 'accordion' },
      { type: 'contact', variant: 'simple' },
    ],
    footer: 'big-name',
    divider: 'none',
    tone: 'flat',
  },

  business: {
    name: 'Forge Delacroix',
    trade: 'Ferronnerie d’art',
    tagline: 'Le fer, forgé <em>à la main.</em>',
    description:
      'Ferronnerie d’art à Toulouse, impasse des Forges, depuis 1987. On y fait des portails, des garde-corps, des escaliers, du mobilier.\n\nNous sommes deux. La forge est au charbon. Et rien ne sort d’un catalogue : chaque pièce est dessinée pour un endroit précis avant d’être mise au feu.',
    since: 1987,
    legalForm: 'SARL',
    insurance: 'Assurance décennale Groupama n° 000 000',
    certifications: ['Entreprise du Patrimoine Vivant'],
  },
  contact: {
    phone: '+33639984412',
    phoneDisplay: '06 39 98 44 12',
    email: 'contact@exemple.fr',
    address: { street: '4 impasse des Forges', postalCode: '31200', city: 'Toulouse' },
    hours: [
      { days: 'Lundi – vendredi', hours: '8 h – 17 h' },
      { days: 'Samedi', hours: 'Sur rendez-vous' },
    ],
  },
  zones: { cities: ['Toulouse', 'Blagnac', 'Colomiers', 'Balma', 'Castanet-Tolosan', 'Montauban'], radiusKm: 80 },

  services: [
    { slug: 'portails', title: 'Portails et grilles', short: 'Battant ou coulissant, motorisé ou non. On relève les cotes chez vous avant de dessiner.', icon: 'DoorOpen', featured: true, bullets: ['Relevé des cotes chez vous', 'Dessin à l’échelle, validé avant la forge', 'Galvanisation et thermolaquage'] },
    { slug: 'garde-corps', title: 'Garde-corps et rampes', short: 'Dedans ou dehors, en fer forgé ou en plat. La norme NF P01-012 n’est pas négociable.', icon: 'Fence', featured: true, bullets: ['Norme NF P01-012', 'Fixation sur béton, pierre ou bois'] },
    { slug: 'escaliers', title: 'Escaliers métalliques', short: 'Droit, quart tournant ou hélicoïdal. La structure tient seule : c’est elle qui porte les marches.', icon: 'Layers', bullets: ['Structure autoportante', 'Marches en chêne, en hêtre ou en acier'] },
    { slug: 'mobilier', title: 'Mobilier et pièces uniques', short: 'Des tables, des consoles, des luminaires, des enseignes. Une pièce, un dessin, pas de série.', icon: 'Hammer', bullets: ['Acier brut, ciré ou patiné', 'Particuliers, restaurants, boutiques'] },
  ],

  about: {
    title: 'L’atelier',
    story:
      'Michel Delacroix a allumé la forge en 1987, dans une ancienne écurie du quartier Bonnefoy. Antoine, son fils, est arrivé en 2012. Depuis, ils sont deux devant le feu.\n\nL’acier se travaille à chaud, au marteau et à la presse. C’est lent. Et ça ne se rattrape pas : ce qui est raté repart au feu. Ce qui sort d’ici a été dessiné pour un endroit précis, pas pour un catalogue.',
    values: [],
  },

  faq: [
    { q: 'Combien coûte un portail en fer forgé ?', a: 'Ça dépend de la largeur, du dessin et de la motorisation. On ne donne pas de prix au mètre : on vient relever les cotes, on dessine, et le devis qui suit est ferme.' },
    { q: 'Quel délai entre le devis et la pose ?', a: 'Il est écrit sur le devis. Il dépend du carnet de l’atelier et du passage chez le galvaniseur, et on vous le dit avant que vous signiez.' },
    { q: 'Le fer forgé demande-t-il de l’entretien ?', a: 'Dehors, une pièce galvanisée puis thermolaquée ne demande rien pendant des années. Dedans, l’acier ciré se contente d’un chiffon huilé une fois l’an.' },
    { q: 'Pouvez-vous restaurer une grille ancienne ?', a: 'Oui, c’est une part du travail. On refait à la forge les volutes manquantes, à l’identique, et on traite la rouille avant de repeindre.' },
    { q: 'Vous déplacez-vous en dehors de Toulouse ?', a: 'Jusqu’à Montauban, environ 80 km autour de la forge. Au-delà, on en parle au téléphone.' },
    { q: 'Peut-on venir voir l’atelier ?', a: 'Le samedi, sur rendez-vous. On vous montre les pièces en cours et les dessins.' },
  ],

  wording: {
    devis: 'Décrire votre projet',
    ctaTitle: 'Un portail à remplacer, une rampe à poser ? <em>Ça commence par un dessin.</em>',
    ctaText: 'On passe prendre les cotes, on dessine à l’échelle, on chiffre. Le devis est ferme.',
    contactTitle: 'Venir à la forge',
    contactText: 'Un appel, d’abord. On passe prendre les cotes, on dessine à l’échelle, on chiffre. Ensuite vous venez impasse des Forges voir ce qui sort du feu.',
  },
  form: { provider: 'mailto' },
  images: {
    hero: { src: '/images/hero.webp', alt: 'Forgeron martelant une pièce d’acier rougie' },
  },
  seo: { keywords: ['ferronnerie d’art Toulouse', 'portail fer forgé Toulouse', 'garde-corps acier sur mesure'] },
  legal: { owner: 'Michel Delacroix' },
});
