// DEMO : cliente inventée (Léa Marchand, ostéopathe). Coordonnées fictives (plage 06 39 98).
// Hero et blocs principaux dessinés à la main pour ce site : sites/osteo-marchand/sections/.
//
// Squelette (21 sept 2026) : coquille `slides` — chaque chapitre occupe un écran, défilement
// aimanté (proximity, jamais piégeant), motion `subtle`. Un cabinet d'ostéo a peu à dire et doit le
// dire calmement : cinq écrans (le cabinet, pour quoi consulter, la séance, FAQ, rendez-vous), pas
// un de plus. Retiré pour tenir dans les cinq : `about/story` (le parcours de Léa — diplôme 2016,
// cabinet ouvert en 2020 — n'a plus de bloc dédié ; la page reste sans donnée inventée). Le
// séparateur `curve` disparaît aussi : entre deux écrans aimantés, un motif décoratif casse l'aimant.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'osteo-marchand',
  direction: 'nordique',
  motion: 'subtle',
  scale: 'normal',
  layout: {
    shell: 'slides',
    nav: 'bar',
    hero: 'custom/hero',
    headings: 'center',
    sections: [
      { type: 'custom', variant: 'cabinet' },
      { type: 'custom', variant: 'motifs', label: 'Consultations' },
      { type: 'custom', variant: 'seance', label: 'La séance' },
      { type: 'faq', variant: 'accordion' },
      { type: 'contact', variant: 'form-card' },
    ],
    footer: 'minimal',
    divider: 'none',
    tone: 'flat',
  },

  business: {
    name: 'Léa Marchand',
    trade: 'Ostéopathe D.O.',
    tagline: 'Ostéopathe à Annecy, <em>une séance de 45 minutes.</em>',
    description:
      'Ostéopathie à Annecy, avenue des Marquisats. Léa Marchand reçoit les adultes, les sportifs, les femmes enceintes, les nourrissons.\n\nUne séance dure 45 minutes. Un seul praticien, le même d’une fois sur l’autre. Et quand une deuxième séance n’a pas lieu d’être, elle n’est pas programmée.',
    since: 2016,
    certifications: ['Diplômée D.O. (agrément ministériel)', 'Inscrite au RPPS'],
  },
  contact: {
    phone: '+33639987730',
    phoneDisplay: '06 39 98 77 30',
    email: 'contact@exemple.fr',
    address: { street: '12 avenue des Marquisats', postalCode: '74000', city: 'Annecy' },
    hours: [
      { days: 'Lundi, mardi, jeudi', hours: '8 h 30 – 19 h' },
      { days: 'Mercredi', hours: '8 h 30 – 13 h' },
      { days: 'Vendredi', hours: '8 h 30 – 17 h' },
    ],
  },
  zones: { cities: ['Annecy', 'Annecy-le-Vieux', 'Cran-Gevrier', 'Seynod', 'Sevrier'] },

  services: [
    { slug: 'adultes', title: 'Adultes', short: 'Le dos, d’abord. Viennent ensuite le cou, les articulations, les maux de tête, la digestion.', icon: 'Activity', featured: true },
    { slug: 'sportifs', title: 'Sportifs', short: 'Préparation avant l’effort, récupération après. Les gênes qui reviennent toujours au même endroit, aussi.', icon: 'Bike' },
    { slug: 'grossesse', title: 'Femmes enceintes', short: 'Pendant la grossesse, puis après l’accouchement.', icon: 'Baby' },
    { slug: 'nourrissons', title: 'Nourrissons', short: 'Un torticolis qui ne passe pas, des coliques, les suites d’un accouchement difficile.', icon: 'HeartHandshake' },
  ],

  about: {
    title: 'Léa',
    story:
      'Cinq ans d’études à Lyon, diplôme en 2016. Léa Marchand a exercé en cabinet partagé avant d’ouvrir le sien avenue des Marquisats, en 2020.\n\nElle travaille en techniques douces et explique ce qu’elle fait pendant qu’elle le fait. Une séance suivante ? Seulement si elle sert à quelque chose.',
    values: [],
  },

  faq: [
    { q: 'Faut-il une ordonnance ?', a: 'Non. L’ostéopathie est en accès direct. Certaines mutuelles remboursent une partie des séances : demandez une facture, elle est fournie systématiquement.' },
    { q: 'Combien de séances ?', a: 'Souvent une ou deux. Et si une troisième est utile, on en parle ensemble ; sinon, elle n’est pas programmée.' },
    { q: 'Que dois-je apporter ?', a: 'Vos examens récents s’il y en a (radios, IRM) et une tenue dans laquelle vous êtes à l’aise.' },
  ],

  wording: {
    devis: 'Prendre rendez-vous',
    ctaTitle: 'Une gêne qui dure ? <em>Parlons-en.</em>',
    contactTitle: 'Prendre rendez-vous',
    contactText: 'Par téléphone, ou laissez un message avec vos disponibilités.',
  },
  form: { provider: 'mailto' },
  images: {
    hero: { src: '/images/hero.webp', alt: 'Salle de soin lumineuse, table de traitement et rideaux clairs' },
  },
  seo: { keywords: ['ostéopathe Annecy', 'ostéopathe nourrisson Annecy', 'ostéopathe femme enceinte Annecy'] },
  legal: { owner: 'Léa Marchand' },
});
