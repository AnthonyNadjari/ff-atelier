// DEMO : client inventé (Barbier Kessler, Krutenau, Strasbourg). Coordonnées fictives (plage 06 39 98),
// aucun avis inventé (proof.google/testimonials volontairement absents : le brief n'en fournit pas).
//
// `ff composer barbier-kessler --metier "Barbier"` propose la direction "retro" (crème/orange/moutarde,
// delaGothic) : c'est déjà la palette seventies de moteur-fils, et le mandat de ce site demande
// explicitement d'éviter le "seventies garage". On part donc de la direction "atelier" (chaleureuse,
// papier chaud — le plus proche du "masculin, warm" demandé) avec :
//  - un accent vert sombre surchargé (même famille que #123524, la couleur utilisée pour les
//    placeholders, éclairci à l:34% pour rester lisible aussi bien en texte sur le hero sombre
//    qu'en texte sur les fonds clairs) au lieu de l'orange-brun par défaut d'atelier ;
//  - une typographie condensée (Oswald, "condensé, affiche") + un corps humaniste (Cabin, "humaniste,
//    doux") à la place de Fraunces/Inter, pour une enseigne de barbier plutôt qu'un atelier de bois.
// Hero et quatre blocs dessinés pour ce client : sites/barbier-kessler/sections/.
//
// Squelette (21 sept 2026) : nav `burger` partagée (menu plein écran, liens numérotés) + contact en
// tiroir (`contactDrawer: true`) — la section contact finale sort du layout, le tiroir est la seule
// porte : « Prendre rendez-vous » (hero, bandeau CTA, menu plein écran) l'ouvre sans descendre en bas
// de page, exactement ce qu'un barbier vend (un créneau, tout de suite). La nav sur mesure d'origine
// (Nav.astro : nom en data-split, pastille enseigne, fil de lecture) est retirée au profit du burger ;
// la bande data-marquee du hero devient une ligne fixe : le seul geste riche reste la traînée d'images
// de la galerie (data-trail).
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'barbier-kessler',
  direction: 'atelier',
  motion: 'rich',
  scale: 'display',
  accent: { h: 150, s: 45, l: 32 },
  typography: { display: 'oswald', body: 'cabin' },
  layout: {
    shell: 'flow',
    nav: 'burger',
    hero: 'custom/hero',
    contactDrawer: true,
    sections: [
      { type: 'custom', variant: 'tarifs', label: 'Tarifs' },
      { type: 'custom', variant: 'equipe', label: 'Équipe' },
      { type: 'custom', variant: 'galerie', label: 'Galerie' },
      { type: 'custom', variant: 'infos', label: 'Infos pratiques' },
      { type: 'faq', variant: 'accordion' },
      { type: 'cta', variant: 'band' },
    ],
    footer: 'minimal',
    divider: 'rule',
    tone: 'alternate',
  },

  business: {
    name: 'Barbier Kessler',
    trade: 'Barbier',
    tagline: 'Trois fauteuils dans la Krutenau. <em>Le samedi, sans rendez-vous.</em>',
    description:
      '9 rue de Zurich, dans la Krutenau, depuis 2017. Trois fauteuils et trois barbiers : Jonas, Malik et Théo. On coupe au ciseau, on taille à la lame.\n\nEn semaine, réservez en ligne. Le samedi, non : vous poussez la porte et vous attendez votre tour.',
    since: 2017,
  },

  contact: {
    phone: '+33639982973',
    phoneDisplay: '06 39 98 29 73',
    email: 'contact@exemple.fr',
    address: { street: '9 rue de Zurich', postalCode: '67000', city: 'Strasbourg' },
    mapsUrl: 'https://maps.google.com/?q=9+rue+de+Zurich+67000+Strasbourg',
    mapsProvider: 'osm',
    coordinates: { lat: 48.578, lng: 7.756 },
    hours: [
      { days: 'Mardi – vendredi', hours: '10 h – 19 h' },
      { days: 'Samedi', hours: '9 h – 18 h, sans rendez-vous' },
    ],
    emergency24h: false,
  },

  services: [
    {
      slug: 'coupe',
      title: 'Coupe',
      short: 'Classique ou dégradé. Ciseau, tondeuse, 28 €.',
      icon: 'Scissors',
      priceFrom: '28 €',
    },
    {
      slug: 'barbe',
      title: 'Barbe',
      short: 'On taille, on dessine, on finit à la lame. 18 €.',
      icon: 'Sparkles',
      priceFrom: '18 €',
    },
    {
      slug: 'coupe-barbe',
      title: 'Coupe + barbe',
      short: 'Les deux dans le même fauteuil, en un rendez-vous. 42 €.',
      icon: 'ScissorsLineDashed',
      priceFrom: '42 €',
      featured: true,
    },
    {
      slug: 'rasage',
      title: 'Rasage à l’ancienne',
      short: 'Serviette chaude, blaireau, lame, baume. Le rasage à l’ancienne ne se fait pas vite.',
      icon: 'MirrorRound',
      priceFrom: '30 €',
    },
    {
      slug: 'enfant',
      title: 'Coupe enfant',
      short: 'Pour les moins de 12 ans. 20 €, même fauteuil.',
      icon: 'Baby',
      priceFrom: '20 €',
    },
  ],

  about: {
    title: 'Depuis 2017',
    story:
      'Jonas Kessler a ouvert son premier fauteuil dans la Krutenau en 2017. Malik est arrivé, puis Théo. Ils sont trois aujourd’hui.\n\nOn coupe au ciseau, on rase au blaireau. Et le samedi, on ne prend pas de rendez-vous : on reçoit dans l’ordre d’arrivée, et le salon ne désemplit pas.',
    team: [
      { name: 'Jonas Kessler', role: 'Fondateur, barbier' },
      { name: 'Malik', role: 'Barbier' },
      { name: 'Théo', role: 'Barbier' },
    ],
  },

  proof: {
    gallery: [
      { src: '/images/galerie-1.webp', alt: 'Un des trois fauteuils du salon' },
      { src: '/images/galerie-2.webp', alt: 'Blaireaux du salon, prêts pour le rasage' },
      { src: '/images/galerie-3.webp', alt: 'Lavabos et fauteuils, intérieur du salon' },
      { src: '/images/galerie-4.webp', alt: 'Blaireaux et bols à raser sur le plan de travail' },
    ],
  },

  faq: [
    { q: 'Faut-il réserver ?', a: 'Du mardi au vendredi, oui, en ligne. Le samedi, non.' },
    { q: 'Le samedi, comment ça marche sans rendez-vous ?', a: 'Vous venez au 9 rue de Zurich et vous attendez. Premier arrivé, premier servi.' },
    { q: 'Accueillez-vous les enfants ?', a: 'La coupe enfant est prévue pour les moins de 12 ans.' },
    { q: 'Comment réserver en semaine ?', a: 'En ligne, ou au 06 39 98 29 73 si vous préférez parler à quelqu’un.' },
  ],

  form: { provider: 'mailto' },

  wording: {
    devis: 'Prendre rendez-vous',
    ctaTitle: 'En semaine, on réserve. <em>Le samedi, on vient.</em>',
    ctaText: 'Trois fauteuils, 9 rue de Zurich, dans la Krutenau.',
    contactTitle: 'Prendre rendez-vous',
    contactText: 'Du mardi au vendredi, réservez en ligne. Le samedi, passez : on vous prendra dans l’ordre.',
  },

  images: {
    hero: { src: '/images/hero.webp', alt: 'Intérieur du salon Barbier Kessler' },
    logo: { src: '/logo.svg', alt: 'Barbier Kessler' },
  },

  seo: {
    keywords: ['barbier Strasbourg', 'barbershop Krutenau', 'coiffeur homme Strasbourg', 'rasage à l’ancienne Strasbourg'],
  },

  legal: { owner: 'Jonas Kessler' },
});
