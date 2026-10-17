// PROSPECT, version B : démo privée pour un vrai commerce (L'Épi d'Or, boulangerie-pâtisserie, 59 rue Maurice Dubois,
// Orléans), refaite le 17 oct 2026 avec ses données publiques (brief.md, sources citées) et les photos de son propre
// site (raw/SOURCES.md). Architecture `lieu-fixe` (Le Petit Bleu) : la boutique reste à l'écran, la carte défile.
// Style : mélange de `ff melanger` (look.json, direction.md). Jamais publiée ni indexée (`legal.prospect`).
// Rien d'inventé : pas de prix, pas d'année d'ouverture (à demander), avis et note recopiés du brief. Photos 04, 05
// (prénom d'un enfant) et 07 (super-héros) écartées dans raw/ecartees/.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'prospect-epi-dor-b',
  direction: 'clair',
  scale: 'normal',
  motion: 'subtle',
  servicePages: true,
  layout: {
    architecture: 'lieu-fixe',
    // Le Petit Bleu : une seule page à ancres (la carte, les avis, l'histoire) ; les pages des rayons existent et
    // s'ouvrent depuis la carte et la vitrine (gabarit « fiche »), pas depuis le menu.
    servicePage: 'fiche',
    sections: [
      { type: 'custom', variant: 'Avis' },
      { type: 'custom', variant: 'Comptoir', label: 'Quel jour ?' },
      { type: 'services', variant: 'carte-prix' },
      { type: 'custom', variant: 'Vitrine', label: 'La vitrine' },
      { type: 'custom', variant: 'Histoire', label: 'L’histoire' },
    ],
    divider: 'none',
    tone: 'flat',
    headings: 'left',
    curtain: false,
  },

  business: {
    name: 'L’Épi d’Or',
    trade: 'Boulangerie-pâtisserie',
    tagline: 'L’Épi d’Or',
    description:
      'Au 59 rue Maurice Dubois, Xavier fait le pain et Miroslava les douceurs. Baguettes, entremets, bûches de Noël, et 36 pièces montées pour toutes les occasions.',
    legalForm: 'Entreprise individuelle',
    siret: '439 648 635 00019',
    tva: 'FR57439648635',
    schemaType: 'Bakery',
  },

  contact: {
    phone: '+33238883051',
    phoneDisplay: '02 38 88 30 51',
    email: 'contact@boulangerielepidor.fr',
    address: { street: '59 rue Maurice Dubois', postalCode: '45000', city: 'Orléans' },
    mapsUrl:
      'https://www.google.com/maps/place/L\'Epi+d\'Or/@47.9220471,1.8918094,17z/data=!3m1!4b1!4m6!3m5!1s0x47e4fadc8c3cb8bd:0x4f06cf85c860caf0!8m2!3d47.9220471!4d1.8918094!16s%2Fg%2F1w04jd9s',
    mapsProvider: 'none',
    hours: [
      { days: 'Lundi', hours: 'Fermé' },
      { days: 'Du mardi au samedi', hours: '6 h 45 à 13 h', opens: '06:45', closes: '13:00' },
      { days: 'Du mardi au samedi', hours: '15 h 30 à 19 h 30', opens: '15:30', closes: '19:30' },
      { days: 'Dimanche', hours: '7 h à 12 h 30', opens: '07:00', closes: '12:30' },
    ],
    emergency24h: false,
  },

  services: [
    {
      slug: 'pains',
      title: 'Le pain',
      short: 'La baguette, et celles qu’on ne trouve pas partout : la 4 Saisons le week-end, l’épi sur commande.',
      description:
        'Le pain de L’Épi d’Or, c’est Xavier. Il a appris le métier à Blois, à Souillac, et jusqu’en Russie.\n\nAu catalogue de la boutique : la baguette, la baguette aux céréales, la baguette aux noix et raisins, le Blédélice, la Fleurisette. La Baguette 4 Saisons ne se fait que le week-end ; la Baguette Épi, sur commande.',
      bullets: ['Baguette', 'Baguette 4 Saisons', 'Baguette aux céréales', 'Baguette noix et raisins', 'Baguette Épi', 'Blédélice', 'Fleurisette'],
      lignes: [
        { nom: 'Baguette' },
        { nom: 'Baguette 4 Saisons', detail: 'Le week-end seulement' },
        { nom: 'Baguette aux céréales' },
        { nom: 'Baguette aux noix et raisins' },
        { nom: 'Baguette Épi', detail: 'Sur commande' },
        { nom: 'Blédélice' },
        { nom: 'Fleurisette' },
      ],
      icon: 'Wheat',
      featured: true,
    },
    {
      slug: 'patisseries',
      title: 'Pâtisseries et entremets',
      short: 'Le fraisier au muguet, la tarte meringuée, l’entremets décor chocolat : la vitrine de pâtisserie de la rue Maurice Dubois.',
      description:
        'La galerie de la boutique est faite presque entièrement de gâteaux : le fraisier au muguet, la tarte meringuée, l’entremets décor chocolat.\n\nAu catalogue, à côté de la pâtisserie : la viennoiserie, la chocolaterie et la sucrerie. Pour un gâteau à une date précise, appelez la boutique.',
      bullets: ['Fraisier', 'Tarte meringuée', 'Entremets', 'Viennoiserie', 'Chocolaterie', 'Sucrerie'],
      lignes: [
        { nom: 'Fraisier', detail: 'Décor de muguet' },
        { nom: 'Tarte meringuée' },
        { nom: 'Entremets', detail: 'Décor chocolat' },
        { nom: 'Viennoiserie' },
        { nom: 'Chocolaterie' },
        { nom: 'Sucrerie' },
      ],
      icon: 'CakeSlice',
      image: { src: '/images/galerie-12.webp', alt: 'Entremets blanc, décor de chocolat et cœur jaune sur le dessus' },
      images: [
        { src: '/images/galerie-01.webp', alt: 'Entremets aux fraises, décor de muguet' },
        { src: '/images/galerie-11.webp', alt: 'Tarte meringuée' },
      ],
    },
    {
      slug: 'pieces-montees',
      title: 'Pièces montées',
      short: '36 pièces montées pour toutes les occasions : baptême, fête religieuse, anniversaire, et les autres.',
      description:
        'La boutique a 36 pièces montées à son catalogue, rangées en quatre familles : baptême, religieux, anniversaire, et autre.\n\nElles se commandent au téléphone, au 02 38 88 30 51.',
      bullets: ['Baptême', 'Religieux', 'Anniversaire', 'Autres occasions'],
      lignes: [
        { nom: 'Baptême' },
        { nom: 'Religieux' },
        { nom: 'Anniversaire' },
        { nom: 'Autres occasions' },
      ],
      icon: 'Cake',
      image: { src: '/images/galerie-02.webp', alt: 'Pièce montée blanche à trois étages, décor de feuilles' },
    },
    {
      slug: 'sandwichs',
      title: 'Sandwichs',
      short: 'La Baguette aux Lardons, la Baguette Poulet Crème, et le sandwich fait à la commande.',
      description:
        'Au rayon snackerie : la Baguette aux Lardons, fourrée aux lardons et aux fromages, et la Baguette Poulet Crème, fourrée au poulet et à la crème, couverte d’une fine couche d’emmental.\n\nLe catalogue a aussi un rayon traiteur et un rayon boissons.',
      bullets: ['Baguette aux Lardons', 'Baguette Poulet Crème', 'Traiteur', 'Boissons'],
      lignes: [
        { nom: 'Baguette aux Lardons', detail: 'Fourrée aux lardons et aux fromages' },
        { nom: 'Baguette Poulet Crème', detail: 'Fourrée au poulet et à la crème, couverte d’une fine couche d’emmental' },
        { nom: 'Traiteur' },
        { nom: 'Boissons' },
      ],
      icon: 'Sandwich',
    },
    {
      slug: 'fetes',
      title: 'Les fêtes de l’année',
      short: 'Galettes en janvier, cœurs de la Saint-Valentin, œuf de Pâques, bûches de Noël : à commander au plus tôt.',
      description:
        'La vitrine suit le calendrier : les galettes en janvier, les cœurs de la Saint-Valentin, l’œuf de Pâques, puis les bûches de Noël.\n\nPour les bûches, la boutique le dit elle-même : « Commandez au plus tôt pour vous assurer un Noël gourmand. »',
      bullets: ['Galettes', 'Saint-Valentin', 'Pâques', 'Bûches de Noël'],
      lignes: [
        { nom: 'Galettes' },
        { nom: 'Cœurs de la Saint-Valentin' },
        { nom: 'Œuf de Pâques' },
        { nom: 'Bûches de Noël', detail: 'Commandez au plus tôt' },
      ],
      icon: 'Sparkles',
      image: { src: '/images/galerie-08.webp', alt: 'Bûche de Noël à la crème, décor de chocolat et de macarons, devant un sapin' },
      images: [
        { src: '/images/galerie-09.webp', alt: 'Bûche de Noël violette' },
        { src: '/images/galerie-10.webp', alt: 'Bûche de Noël jaune' },
        { src: '/images/galerie-03.webp', alt: 'Œuf en chocolat « Joyeuses Pâques »' },
        { src: '/images/galerie-06.webp', alt: 'Cœurs de la Saint-Valentin' },
      ],
    },
  ],

  about: {
    title: 'Xavier et Miroslava',
    // Version B : l'équipe est dite dans l'histoire (Christelle et Pauline au comptoir), sans vignettes à initiale.
    story:
      'Xavier a beaucoup voyagé avant de poser ses valises à Orléans : formé à Blois, à Souillac et même en Russie, il a travaillé des terres australes aux cuisines raffinées. Avec son épouse Miroslava, la « créatrice de douceurs », il a repris L’Épi d’Or.\n\nAu comptoir, Christelle et Pauline, l’experte en café. « Une bonne pâtisserie doit non seulement ravir les papilles mais aussi éveiller les souvenirs et créer des moments de bonheur partagé », dit Xavier.',
    team: [],
  },

  proof: {
    google: {
      rating: 4.6,
      count: 162,
      url: 'https://www.google.com/maps/place/L\'Epi+d\'Or/@47.9220471,1.8918094,17z/data=!3m1!4b1!4m6!3m5!1s0x47e4fadc8c3cb8bd:0x4f06cf85c860caf0!8m2!3d47.9220471!4d1.8918094!16s%2Fg%2F1w04jd9s',
    },
    testimonials: [
      { author: 'Sylvia D.', text: 'Très bon accueil. Sandwich à la commande généreusement garni et de très bonnes pâtisseries.', source: 'Google' },
      {
        author: 'Marie C.',
        text: 'Très bonne boulangerie que je recommande vivement. Les gâteaux sont excellents et les prix tout à fait raisonnables.',
        source: 'Google',
        date: 'avril 2025',
      },
    ],
  },

  social: {
    instagram: 'https://www.instagram.com/boulangerielepidor/',
    facebook: 'https://www.facebook.com/LEpi-dOr-701073616671718',
  },

  wording: {
    devis: 'Commander un gâteau',
    servicesTitle: 'La carte',
    contactTitle: 'Une commande ? Appelez la boutique.',
    contactText: 'Les gâteaux et les pièces montées se commandent au téléphone. Fermé les après-midi des jours fériés.',
    ctaTitle: 'Une commande ? Appelez la boutique.',
    ctaText: 'Du mardi au samedi, et le dimanche matin.',
  },
  form: { provider: 'none' },
  images: {
    hero: { src: '/images/facade.webp', alt: 'La devanture de L’Épi d’Or le soir, vitrines allumées, l’enseigne en lettres rouges sur faïence' },
  },
  seo: {
    title: 'L’Épi d’Or, boulangerie-pâtisserie à Orléans',
    description:
      'Boulangerie-pâtisserie au 59 rue Maurice Dubois à Orléans : pain, entremets, 36 pièces montées, bûches de Noël. Ouvert du mardi au dimanche matin. 02 38 88 30 51.',
    keywords: ['boulangerie Orléans', 'pâtisserie Orléans', 'pièce montée Orléans', 'bûche de Noël Orléans'],
  },
  legal: { owner: 'Xavier Sevot', prospect: true },
});
