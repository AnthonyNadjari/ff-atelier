// DEMO : cabinet inventé (Léa Marchand, ostéopathe), reprise des données de la démo osteo-marchand (coordonnées
// fictives, plage 06 39 98). Démo du 28 oct 2026 pour montrer l'architecture profils-patients (veille tour 15) :
// les profils, motifs et la durée viennent mot pour mot des services et de la description de osteo-marchand ;
// aucun prix (absent du brief), aucun avis.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'demo-osteopathe',
  typography: {
    display: 'figtree',
    body: 'figtree',
  },
  accent: {
    h: 202,
    s: 45,
    l: 32,
  },
  direction: 'm-56cf76',
  motion: 'subtle',
  layout: {
    shell: 'profils',
    nav: 'bar',
    hero: 'typographic',
    sections: [
      {
        type: 'faq',
        variant: 'accordion',
      },
    ],
    footer: 'minimal',
    tone: 'flat',
  },

  business: {
    name: 'Léa Marchand',
    trade: 'Ostéopathe D.O.',
    tagline: 'Ostéopathe à Annecy, une séance de 45 minutes.',
    description:
      'Ostéopathie à Annecy, avenue des Marquisats. Léa Marchand reçoit les adultes, les sportifs, les femmes enceintes, les nourrissons.\n\nUne séance dure 45 minutes. Un seul praticien, le même d’une fois sur l’autre. Et quand une deuxième séance n’a pas lieu d’être, elle n’est pas programmée.',
    since: 2016,
    certifications: ['Diplômée D.O. (agrément ministériel)', 'Inscrite au RPPS'],
  },
  contact: {
    phone: '+33639987730',
    phoneDisplay: '06 39 98 77 30',
    email: 'contact@exemple.fr',
    address: { street: '12 avenue des Marquisats', postalCode: '74000', city: 'Annecy' },
    hours: [
      { days: 'Lundi, mardi, jeudi', hours: '8 h 30 – 19 h' },
      { days: 'Mercredi', hours: '8 h 30 – 13 h' },
      { days: 'Vendredi', hours: '8 h 30 – 17 h' },
    ],
  },
  zones: { cities: ['Annecy', 'Annecy-le-Vieux', 'Cran-Gevrier', 'Seynod', 'Sevrier'] },


  services: [
    { slug: 'adultes', title: 'Adultes', short: 'Le dos, d’abord. Viennent ensuite le cou, les articulations, les maux de tête, la digestion.', icon: 'Activity', featured: true },
    { slug: 'sportifs', title: 'Sportifs', short: 'Préparation avant l’effort, récupération après. Les gênes qui reviennent toujours au même endroit, aussi.', icon: 'Bike' },
    { slug: 'grossesse', title: 'Femmes enceintes', short: 'Pendant la grossesse, puis après l’accouchement.', icon: 'Baby' },
    { slug: 'nourrissons', title: 'Nourrissons', short: 'Un torticolis qui ne passe pas, des coliques, les suites d’un accouchement difficile.', icon: 'HeartHandshake' },
  ],

  profils: {
    liste: [
      {
        slug: 'nourrissons', nom: 'Nourrissons',
        motifs: ['Un torticolis qui ne passe pas', 'Des coliques', 'Les suites d’un accouchement difficile'],
        praticiens: ['lea'],
      },
      {
        slug: 'femmes-enceintes', nom: 'Femmes enceintes', pour: 'Pendant la grossesse, puis après l’accouchement',
        motifs: ['Pendant la grossesse', 'Après l’accouchement'],
        praticiens: ['lea'],
      },
      {
        slug: 'sportifs', nom: 'Sportifs',
        motifs: ['Préparation avant l’effort', 'Récupération après', 'Les gênes qui reviennent toujours au même endroit'],
        praticiens: ['lea'],
      },
      {
        slug: 'adultes', nom: 'Adultes', phrase: 'Le dos, d’abord.',
        motifs: ['Le dos', 'Le cou', 'Les articulations', 'Les maux de tête', 'La digestion'],
        praticiens: ['lea'],
      },
    ],
    praticiens: [
      {
        slug: 'lea', nom: 'Léa Marchand', titre: 'Ostéopathe D.O.',
        texte: 'Cinq ans d’études à Lyon, diplôme en 2016. Elle travaille en techniques douces et explique ce qu’elle fait pendant qu’elle le fait.',
      },
    ],
    duree: '45 minutes',
    remboursement: 'Certaines mutuelles remboursent une partie des séances : une facture est fournie systématiquement.',
  },

  about: {
    title: 'Léa',
    story:
      'Cinq ans d’études à Lyon, diplôme en 2016. Léa Marchand a exercé en cabinet partagé avant d’ouvrir le sien avenue des Marquisats, en 2020.\n\nElle travaille en techniques douces et explique ce qu’elle fait pendant qu’elle le fait. Une séance suivante ? Seulement si elle sert à quelque chose.',
    values: [],
  },

  faq: [
    { q: 'Faut-il une ordonnance ?', a: 'Non. L’ostéopathie est en accès direct. Certaines mutuelles remboursent une partie des séances : demandez une facture, elle est fournie systématiquement.' },
    { q: 'Combien de séances ?', a: 'Souvent une ou deux. Et si une troisième est utile, on en parle ensemble ; sinon, elle n’est pas programmée.' },
    { q: 'Que dois-je apporter ?', a: 'Vos examens récents s’il y en a (radios, IRM) et une tenue dans laquelle vous êtes à l’aise.' },
  ],

  wording: {
    devis: 'Prendre rendez-vous',
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
