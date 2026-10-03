/**
 * DEMO : client invente. Les Jardins de Mael, paysagiste a Rennes (Cesson-Sevigne).
 *
 * Mandat de conception : « les saisons ». Le site raconte une annee de jardin plutot qu'un
 * catalogue de prestations — voir sections/Saisons.astro (quatre panneaux plein cadre, un par
 * saison) et sections/Calendrier.astro (grille typographique des 12 mois).
 *
 * Ecart assume par rapport a `ff composer jardins-mael --metier "Paysagiste"` : la proposition
 * retenait la direction `terre` (attendu : c'est la direction "metier typique" du paysagiste dans
 * src/lib/schema.ts) et le hero `stacked`. Le mandat de ce tour demande explicitement d'eviter les
 * deux, pour ne pas ressembler a sites/demo-paysagiste (direction terre, hero stacked, nav split,
 * shell sidebar, meme ville). Direction retenue a la place : `journal` — off-white, Playfair
 * Display, filets fins — jamais utilisee par un site dessine a la main (seuls avocat/notaire
 * l'utilisent d'ordinaire, mais docs/DIRECTIONS.md § 47 autorise un choix par ambiance plutot que
 * par metier litteral) : elle porte tres bien le concept « une annee en quatre chapitres », feuille
 * de style presse plutot que prospectus horticole, tout en gardant un accent qui vire au vert/or/
 * ambre/ardoise dans les quatre panneaux saisonniers (voir sections/Saisons.astro, variables CSS
 * locales --season-accent). Nav et hero entierement sur mesure ; shell `flow` d'origine (pas
 * `sidebar`) pour laisser les panneaux plein cadre des saisons respirer sans rail lateral permanent.
 *
 * Squelette (21 sept 2026) : coquille `magazine` — grille asymetrique, largeurs et decalages
 * alternes, grands numeros de section en marge sur desktop. Coherent avec l'esprit « feuille de
 * style presse » deja pose par la direction `journal` (voir plus haut) ; `scale: 'normal'` (pas
 * `compact`) garde la mise en marge aeree, comme demande par docs/DIRECTIONS.md. Aucun effet riche
 * a retirer : `Services.astro` garde son unique data-drag-grid (seul geste riche de la page).
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'jardins-mael',
  direction: 'journal',
  motion: 'rich',
  scale: 'normal',
  layout: {
    nav: 'custom/Nav',
    hero: 'custom/Hero',
    shell: 'magazine',
    tone: 'flat',
    divider: 'none',
    sections: [
      { type: 'custom', variant: 'Services', label: 'Prestations' },
      { type: 'custom', variant: 'Saisons', label: 'Saisons' },
      { type: 'custom', variant: 'Calendrier', label: 'Calendrier' },
      { type: 'about', variant: 'story' },
      { type: 'zones', variant: 'chips' },
      { type: 'custom', variant: 'Cta' },
      { type: 'contact', variant: 'form-split' },
    ],
    footer: 'columns',
  },

  business: {
    name: 'Les Jardins de Maël',
    trade: 'Paysagiste',
    tagline: 'Un jardin qui change <em>à chaque saison.</em>',
    description:
      'Les Jardins de Maël créent et entretiennent des jardins à Rennes et Cesson-Sévigné depuis 2012. Quatre personnes, certifiées Qualipaysage, 22 rue du Bourg.\n\nCréation, entretien à l’année, terrasses bois, arrosage automatique, taille et élagage. Le calendrier change à chaque saison, et on ne passe pas seulement au moment de la tonte.',
    since: 2012,
    certifications: ['Qualipaysage'],
  },

  contact: {
    phone: '+33639984119',
    phoneDisplay: '06 39 98 41 19',
    email: 'contact@exemple.fr',
    address: { street: '22 rue du Bourg', postalCode: '35510', city: 'Cesson-Sévigné' },
    mapsUrl: 'https://maps.google.com/?q=22+rue+du+Bourg+35510+Cesson-Sévigné',
    mapsProvider: 'osm',
    coordinates: { lat: 48.1103, lng: -1.6003 },
    hours: [{ days: 'Lundi – vendredi', hours: '8 h – 18 h' }],
    emergency24h: false,
  },

  zones: {
    cities: ['Rennes', 'Cesson-Sévigné', 'Chantepie', 'Bruz', 'Betton', 'Saint-Grégoire', 'Vern-sur-Seiche'],
    label: 'Rennes et son agglomération',
  },

  services: [
    {
      slug: 'creation-de-jardins',
      title: 'Création de jardins',
      short: 'On étudie le sol et l’exposition avant de dessiner quoi que ce soit.',
      icon: 'Sprout',
      featured: true,
      image: { src: '/images/service-1.webp', alt: 'Création d’un jardin par Les Jardins de Maël' },
      bullets: ['Étude du terrain et de l’exposition', 'Plan de plantation par saison', 'Essences adaptées au climat breton'],
      description:
        'Un jardin se dessine sur plusieurs saisons, pas en un week-end. On regarde le sol et l’exposition, puis on propose un plan de plantation.\n\nFloraisons étalées, feuillages persistants, une structure qui se voit encore en janvier : c’est là que se juge un jardin, pas en juin.',
    },
    {
      slug: 'entretien-a-lannee',
      title: 'Entretien à l’année',
      short: 'Tonte, taille, désherbage, ramassage. Au passage, ou au contrat annuel.',
      icon: 'Leaf',
      featured: true,
      image: { src: '/images/service-2.webp', alt: 'Entretien d’un jardin par Les Jardins de Maël' },
      bullets: ['Passages réguliers ou contrat annuel', 'Passages réglés sur la saison, pas sur une fréquence fixe', 'Ramassage et évacuation des déchets verts'],
      description:
        'L’entretien ne fait pas le même métier selon le mois. Tonte et désherbage au printemps et en été. Préparation et protection en automne. En hiver, on travaille la structure.\n\nLe contrat annuel suit ce rythme plutôt qu’une fréquence figée.',
    },
    {
      slug: 'terrasses-bois',
      title: 'Terrasses bois',
      short: 'Bois classe 4, posé au printemps ou à l’automne. Jamais en pleine gelée.',
      icon: 'Ruler',
      image: { src: '/images/service-3.webp', alt: 'Terrasse en bois réalisée par Les Jardins de Maël' },
      bullets: ['Bois classe 4 adapté à l’extérieur', 'Intégration au jardin existant', 'Structure et lambourdage soignés'],
      description: 'Une terrasse bois se pose au printemps ou à l’automne, hors gel et hors grosse chaleur. Le bois a besoin de se stabiliser avant la première saison d’usage. Et quand la demande tombe en pleine canicule, on propose d’attendre.',
    },
    {
      slug: 'arrosage-automatique',
      title: 'Arrosage automatique',
      short: 'Programmation par zone, réglée l’été, coupée l’hiver. Et on repasse à chaque changement de saison.',
      icon: 'Droplets',
      image: { src: '/images/service-4.webp', alt: 'Installation d’arrosage automatique' },
      bullets: ['Programmation par zone', 'Réglages différents été / hiver', 'Économie d’eau'],
      description: 'Un arrosage automatique ne se règle pas une fois pour toutes. Fréquent et court en été, à l’arrêt complet en hiver. On installe le système, zone par zone, puis on repasse ajuster les réglages à chaque changement de saison.',
    },
    {
      slug: 'taille-et-elagage',
      title: 'Taille et élagage',
      short: 'Haies, arbustes, arbres. Le mois compte autant que le geste.',
      icon: 'Scissors',
      image: { src: '/images/galerie-1.webp', alt: 'Taille d’une haie par Les Jardins de Maël' },
      bullets: ['Taille de formation ou d’entretien', 'Élagage raisonné', 'Période choisie pour ne pas nuire à la floraison'],
      description: 'Une haie ou un arbre ne se taille pas n’importe quand : hors période de nidification, au repos végétatif pour la plupart des arbustes. Une taille faite au mauvais mois coûte la floraison de l’année suivante, et c’est pour ça qu’un passage est parfois décalé.',
    },
  ],

  about: {
    title: 'L’équipe',
    story:
      'Les Jardins de Maël existent depuis 2012, 22 rue du Bourg à Cesson-Sévigné. Quatre personnes, de la création à l’entretien, certifiées Qualipaysage.\n\nOn ne travaille pas sur catalogue. Un jardin est suivi dans la durée, avec un calendrier qui change à chaque saison. Pas un seul passage de printemps, puis plus personne jusqu’en mars.',
  },

  form: { provider: 'mailto' },

  wording: {
    devis: 'Parler de votre jardin',
    ctaTitle: 'Un jardin qui vit <em>toute l’année.</em>',
    contactTitle: 'Parler de votre jardin',
  },

  images: {
    hero: { src: '/images/hero.webp', alt: 'Jardin entretenu par Les Jardins de Maël, Rennes' },
  },

  seo: {
    keywords: ['paysagiste Rennes', 'paysagiste Cesson-Sévigné', 'entretien jardin Rennes', 'création jardin Ille-et-Vilaine'],
  },

  legal: { owner: 'Les Jardins de Maël' },
});
