// DEMO : fromagerie inventée (Claire Ravanel, fromagère-affineuse à Annecy), piste D « Le comptoir »
// (17 oct 2026) : le socle d'abord (GOUT § 0). Accueil + une page par offre, téléphone toujours visible (panneau
// collé à gauche sur ordinateur, barre du haut et barre d'actions sur téléphone), métier + ville dans le h1,
// « Depuis 2011 » en texte, état et horaires du jour au premier écran, portes par intention. UN bloc sur mesure :
// le plateau qu'on remplit en disant combien on sera à table (prix de départ et jour de retrait calculés depuis
// les règles du brief). Coordonnées fictives (plage ARCEP réservée à la fiction 04 65 71), mêmes que les pistes
// A, B, C. Aucun avis, aucune note, aucun chiffre de clientèle ; seuls prix du brief : « dès 6 € par personne »
// et la caution de 50 €. Trois photos libres (Wikimedia, CREDITS.md, page /credits), sans légende, qui ne
// prétendent montrer ni la boutique ni les personnes. Pas de formulaire : le brief n'a pas d'e-mail.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'fromagerie-ravanel-d',
  direction: 'terre',
  typography: { display: 'epundaSlab', body: 'hanken' },
  scale: 'normal',
  // Le moteur ne fait rien bouger (aucun titre, aucune section partagée ne se lève) ; le mouvement vient des deux
  // sections sur mesure : la pancarte du premier écran, la photo de cave, le plateau (direction.md, MOUVEMENT).
  motion: 'none',
  servicePages: true,
  layout: {
    nav: 'bar',
    hero: 'custom/Comptoir',
    // Tour 1 (17 oct 2026, « trop 2D, pas beau ») : services/list (liste à plat) remplacée par des cartes avec photo
    // (custom/Offres) ; deux bandes photo pleine largeur entre les sections (beaufort, que la planche du plateau
    // chevauche ; le bas de la cave, avant les questions : la raclette, 1 000 px à la source, serait floue en pleine largeur).
    sections: [
      { type: 'custom', variant: 'Offres', label: 'Cave et comptoir' },
      { type: 'custom', variant: 'BandeBeaufort' },
      { type: 'custom', variant: 'Plateau', label: 'Le plateau' },
      { type: 'about', variant: 'timeline' },
      { type: 'custom', variant: 'BandeCave' },
      { type: 'faq', variant: 'two-columns' },
      { type: 'contact', variant: 'simple' },
    ],
    footer: 'columns',
    shell: 'split',
    divider: 'none',
    tone: 'flat',
    headings: 'left',
    curtain: false,
    contactDrawer: false,
    actionBar: true,
  },

  business: {
    name: 'Fromagerie Ravanel',
    trade: 'Fromager-affineur',
    tagline: 'Fromager-affineur rue de la Gare, à Annecy',
    description:
      'Depuis 2011, Claire Ravanel affine dans sa cave, sous la boutique, les tommes et les reblochons de six fermes des Aravis et des Bauges. On goûte avant d’acheter, toujours.\n\nBeaufort d’alpage de 12, 18 ou 24 mois, plateaux de 6 à 30 personnes, appareil à raclette prêté. Le mardi et le vendredi matin, Théo tient le stand au marché de la vieille ville.',
    since: 2011,
  },

  contact: {
    phone: '+33465712318',
    phoneDisplay: '04 65 71 23 18',
    address: { street: '12 rue de la Gare', postalCode: '74000', city: 'Annecy' },
    hours: [
      { days: 'Du mardi au vendredi', hours: '8 h 30 à 12 h 30', opens: '08:30', closes: '12:30' },
      { days: 'Du mardi au vendredi', hours: '15 h 30 à 19 h', opens: '15:30', closes: '19:00' },
      { days: 'Samedi', hours: '8 h à 13 h', opens: '08:00', closes: '13:00' },
      { days: 'Samedi', hours: '15 h à 19 h', opens: '15:00', closes: '19:00' },
      { days: 'Dimanche', hours: '8 h 30 à 12 h 30', opens: '08:30', closes: '12:30' },
      { days: 'Lundi', hours: 'Fermé' },
    ],
    mapsProvider: 'none',
    emergency24h: false,
  },

  zones: { cities: [], label: 'Annecy et le bassin annécien' },

  services: [
    {
      slug: 'cave-affinage',
      title: 'La cave et l’affinage',
      short: 'Sous la boutique, une cave à 11 °C où les tommes et les reblochons fermiers finissent de s’affiner.',
      description:
        'Claire a creusé la cave en 2014, sous la boutique de la rue de la Gare. Il y fait 11 °C. Les tommes et les reblochons fermiers de six fermes des Aravis et des Bauges y finissent de s’affiner.\n\nChaque meule porte sa date d’entrée à la craie. Au comptoir, demandez « plus jeune » ou « plus fait » : on va chercher celle qui vous va, et vous la goûtez avant qu’on la coupe.',
      bullets: ['Cave à 11 °C, creusée en 2014', 'Date d’entrée à la craie sur chaque meule', '« Plus jeune » ou « plus fait », sur demande', 'On goûte avant d’acheter, toujours'],
      icon: 'Warehouse',
      featured: true,
      image: { src: '/images/cave.webp', alt: 'Meules de fromage posées sur des planches dans une cave d’affinage' },
    },
    {
      slug: 'beaufort',
      title: 'Le beaufort à 12, 18 ou 24 mois',
      short: 'Le beaufort d’alpage, vendu à l’âge que vous voulez : 12, 18 ou 24 mois.',
      description:
        'Le beaufort d’alpage se vend ici à l’âge que vous voulez : 12, 18 ou 24 mois. Comme pour le reste, vous goûtez avant de choisir.\n\nLe beaufort de 24 mois, comme la vieille tomme, contient très peu de lactose. Si vous l’évitez, demandez à Claire : elle vous dira lesquels prendre.',
      bullets: ['Beaufort d’alpage', 'À l’âge choisi : 12, 18 ou 24 mois', 'Goûté avant d’être coupé', 'Très peu de lactose à 24 mois'],
      icon: 'Mountain',
      image: { src: '/images/beaufort.webp', alt: 'Meule de beaufort posée sur une planche, d’autres meules en rangs derrière' },
    },
    {
      slug: 'raclette',
      title: 'Raclette et appareil prêté',
      short: 'Le fromage coupé ou râpé à la demande, et l’appareil à raclette prêté pour 4 ou 8 personnes, contre une caution de 50 €.',
      description:
        'Le fromage à raclette et à fondue est coupé ou râpé à la demande, pour le nombre que vous êtes.\n\nL’appareil à raclette est prêté, pour 4 ou 8 personnes, contre une caution de 50 €. Réservez-le par téléphone deux jours avant le week-end : il en reste rarement le samedi.',
      bullets: ['Appareil pour 4 ou 8 personnes', 'Caution de 50 €', 'À réserver deux jours avant le week-end', 'Fromage coupé ou râpé à la demande'],
      icon: 'Flame',
      image: { src: '/images/raclette.webp', alt: 'Tranches de fromage à raclette disposées sur une assiette' },
    },
    {
      slug: 'plateaux',
      title: 'Plateaux sur commande',
      short: 'Pour 6 à 30 personnes, dès 6 € par personne, composés avec vous et à commander 48 heures avant.',
      description:
        'Un plateau se compose avec vous, au téléphone : combien vous serez, ce que vous aimez. Pour 6 à 30 personnes, à partir de 6 € par personne.\n\nCommandez-le 48 heures avant. Pour Noël et le Nouvel An, une semaine avant.',
      bullets: ['De 6 à 30 personnes', 'Dès 6 € par personne', 'Composé avec vous', '48 heures avant', 'Une semaine avant pour Noël et le Nouvel An'],
      icon: 'UtensilsCrossed',
    },
    {
      slug: 'comptoir',
      title: 'Le comptoir',
      short: 'Beurre de baratte, crème crue, yaourts de la ferme, et quelques vins de Savoie pour aller avec.',
      description:
        'À côté des fromages, le comptoir de la rue de la Gare a le beurre de baratte, la crème crue et les yaourts de la ferme.\n\nEt quelques vins de Savoie, pour aller avec ce que vous emportez.',
      bullets: ['Beurre de baratte', 'Crème crue', 'Yaourts de la ferme', 'Quelques vins de Savoie'],
      icon: 'ShoppingBasket',
    },
  ],

  about: {
    title: 'Claire et Théo',
    story:
      'Claire Ravanel a appris l’affinage chez un affineur de la vallée de Thônes. En 2011, elle a repris une crémerie de quartier rue de la Gare, à Annecy ; en 2014, elle a creusé la cave sous la boutique.\n\nClaire s’occupe de l’affinage et des commandes. Théo tient la boutique et, le mardi et le vendredi matin, le stand du marché de la vieille ville.',
    team: [
      { name: 'Claire Ravanel', role: 'Affinage et commandes' },
      { name: 'Théo', role: 'Boutique et marché' },
    ],
    milestones: [
      { year: '2011', text: 'Claire reprend la crémerie de la rue de la Gare.' },
      { year: '2014', text: 'La cave d’affinage est creusée sous la boutique.' },
      { year: '2019', text: 'Le stand au marché de la vieille ville, le mardi et le vendredi matin.' },
    ],
  },

  faq: [
    { q: 'Faut-il réserver l’appareil à raclette ?', a: 'Oui, deux jours avant le week-end : il en reste rarement le samedi.' },
    { q: 'Peut-on commander un plateau le jour même ?', a: 'Non, 48 heures avant ; une semaine avant pour les fêtes.' },
    {
      q: 'Faites-vous des fromages sans lactose ?',
      a: 'Les fromages affinés longtemps (beaufort 24 mois, vieille tomme) en contiennent très peu ; demandez à Claire, elle vous dira lesquels.',
    },
  ],

  wording: {
    devis: 'Venir',
    servicesTitle: 'À la cave et au comptoir',
    ctaTitle: 'Un plateau, une raclette ? Appelez Claire.',
    ctaText: 'Plateaux 48 heures avant, appareil à raclette deux jours avant le week-end. Du mardi au samedi, et le dimanche matin.',
    faqTitle: 'Ce qu’on nous demande au comptoir',
    contactTitle: '12 rue de la Gare',
    contactText: 'À Annecy. Le mardi et le vendredi matin, Théo est aussi au marché de la vieille ville, avec les mêmes fromages.',
  },
  form: { provider: 'none' },
  images: {
    hero: { src: '/images/cave.webp', alt: 'Meules de fromage posées sur des planches dans une cave d’affinage' },
  },
  seo: {
    title: 'Fromagerie Ravanel, fromager-affineur à Annecy',
    description:
      'Fromager-affineur rue de la Gare à Annecy depuis 2011 : cave d’affinage, beaufort de 12 à 24 mois, plateaux de 6 à 30 personnes, appareil à raclette prêté. 04 65 71 23 18.',
    keywords: ['fromagerie Annecy', 'fromager affineur Annecy', 'plateau de fromages Annecy', 'raclette Annecy'],
  },
  legal: { owner: 'Claire Ravanel', demo: true },
});
