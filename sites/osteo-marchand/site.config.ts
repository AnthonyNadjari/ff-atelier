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
    tagline: 'Retrouver un corps <em>qui ne se fait plus remarquer.</em>',
    description:
      'Cabinet d’ostéopathie à Annecy, quartier des Marquisats. Adultes, sportifs, femmes enceintes, nourrissons.\n\nUne séance de 45 minutes, un seul praticien, un suivi dans la durée quand il est utile, pas plus.',
    since: 2016,
    certifications: ['Diplômée D.O. (agrément ministériel)', 'Inscrite au RPPS'],
  },
  contact: {
    phone: '+33639987730',
    phoneDisplay: '06 39 98 77 30',
    email: 'contact@exemple.fr',
    address: { street: '12 avenue des Marquisats', postalCode: '74000', city: 'Annecy' },
    hours: [
      { days: 'Lundi, mardi, jeudi', hours: '8h30 – 19h' },
      { days: 'Mercredi', hours: '8h30 – 13h' },
      { days: 'Vendredi', hours: '8h30 – 17h' },
    ],
  },
  zones: { cities: ['Annecy', 'Annecy-le-Vieux', 'Cran-Gevrier', 'Seynod', 'Sevrier'] },

  services: [
    { slug: 'adultes', title: 'Adultes', short: 'Dos, cou, articulations, maux de tête, troubles digestifs.', icon: 'Activity', featured: true },
    { slug: 'sportifs', title: 'Sportifs', short: 'Préparation, récupération, gênes récurrentes à l’effort.', icon: 'Bike' },
    { slug: 'grossesse', title: 'Femmes enceintes', short: 'Accompagnement pendant la grossesse et après l’accouchement.', icon: 'Baby' },
    { slug: 'nourrissons', title: 'Nourrissons', short: 'Suites d’un accouchement difficile, torticolis, coliques.', icon: 'HeartHandshake' },
  ],

  about: {
    title: 'Léa',
    story:
      'Diplômée en 2016 après cinq ans d’études à Lyon, Léa Marchand a d’abord exercé en cabinet partagé avant d’ouvrir le sien aux Marquisats en 2020.\n\nElle travaille en techniques douces, explique ce qu’elle fait pendant qu’elle le fait, et ne programme une séance suivante que si elle sert à quelque chose.',
    values: [],
  },

  faq: [
    { q: 'Faut-il une ordonnance ?', a: 'Non. L’ostéopathie est en accès direct. Certaines mutuelles remboursent une partie des séances : demandez une facture, elle est fournie systématiquement.' },
    { q: 'Combien de séances ?', a: 'Souvent une ou deux. Si une troisième est utile, on en parle ensemble ; sinon, on ne la programme pas.' },
    { q: 'Que dois-je apporter ?', a: 'Vos examens récents s’il y en a (radios, IRM) et une tenue dans laquelle vous êtes à l’aise.' },
  ],

  wording: {
    devis: 'Prendre rendez-vous',
    ctaTitle: 'Une gêne qui dure&nbsp;? <em>Parlons-en.</em>',
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
