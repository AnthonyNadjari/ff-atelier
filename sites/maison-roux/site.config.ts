// DEMO : client inventé
/**
 * Maison Roux — boulangerie-pâtisserie à Lyon (Croix-Rousse), troisième génération, depuis 1987.
 * Site sur mesure : hero + nav dessinés pour ce client, direction "pop" (proposée par
 * `ff composer --metier "Boulangerie"`, cohérente avec le mandat : joyeux, chaleureux, appétit —
 * voir src/directions/pop/meta.ts, métiers "boulangerie/pâtisserie" explicitement listés).
 * Typographie : garder la police d'affichage par défaut de "pop" (Anybody Variable, extra-gras) —
 * ni bricolage (déjà `moteur-fils`) ni delaGothic (déjà `toits-cie`/proposition du composer écartée
 * pour cette raison), Anybody est la seule des trois encore inutilisée par un site dessiné à la main.
 * Accent : surchargé en ambre chaud (host de la teinte des placeholders, proche de #f4c95d) plutôt
 * que le rose par défaut de "pop" — "appétit" avant "ludique pur", la teinte accent-2 turquoise de
 * la direction reste le contrepoint joyeux. Shell "flow" (pas "sidebar" proposé par le composer) :
 * la nav sur mesure est une barre "ticket de caisse" en haut de page, pas un rail latéral.
 * Écart avec la proposition composer sur les sections : "services" devient la section sur mesure
 * "Carte" (liste typographique à filets pointillés + tabular-nums, différente de la composition de
 * `barbier-kessler/sections/Tarifs.astro` — ici groupée par catégorie, chiffres en data-scramble,
 * pas un simple `data-reveal`), pas de "proof" (aucun avis fourni par le brief, aucun avis inventé),
 * pas de "zones" (commerce de quartier, pas une activité itinérante avec rayon d'intervention).
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'maison-roux',
  direction: 'pop',
  motion: 'rich',
  scale: 'display',
  // Ambre chaud (pain/miel) au lieu du rose par defaut de "pop" : chaleur et appetit plutot que
  // ludique pur ; accent-2 turquoise (fixe dans src/directions/pop/index.css) reste le contrepoint.
  accent: { h: 32, s: 86, l: 34 },

  layout: {
    nav: 'custom/nav',
    hero: 'custom/hero',
    sections: [
      { type: 'custom', variant: 'Fournee', label: 'Fournées' },
      { type: 'custom', variant: 'Carte', label: 'La carte' },
      { type: 'about', variant: 'story' },
      { type: 'custom', variant: 'CommanderGateau', label: 'Gâteaux' },
      { type: 'faq', variant: 'accordion' },
      { type: 'cta', variant: 'band' },
      { type: 'custom', variant: 'Contact', label: 'Contact' },
    ],
    footer: 'columns',
    divider: 'none',
    tone: 'alternate',
    shell: 'flow',
  },

  business: {
    name: 'Maison Roux',
    trade: 'Boulangerie-pâtisserie',
    tagline: 'Le pain sort du four <em>toute la matinée</em>.',
    description:
      'Depuis 1987, la famille Roux pétrit et cuit son pain dans le même fournil de la Croix-Rousse. Levain naturel, farines de meuniers de Rhône-Alpes, et des fournées qui se succèdent du petit matin jusqu’en fin de matinée.\n\nTroisième génération aux commandes : le tour de main se transmet, le pain reste le même.',
    since: 1987,
  },

  contact: {
    phone: '+33639987244',
    phoneDisplay: '06 39 98 72 44',
    email: 'contact@exemple.fr',
    address: { street: '8 rue des Pierres Plantées', postalCode: '69001', city: 'Lyon' },
    mapsUrl: 'https://maps.google.com/?q=8+rue+des+Pierres+Plantées+69001+Lyon',
    mapsProvider: 'osm',
    coordinates: { lat: 45.7688, lng: 4.8328 },
    hours: [
      { days: 'Mardi – samedi', hours: '6h30 – 19h30' },
      { days: 'Dimanche', hours: '6h30 – 13h' },
      { days: 'Lundi', hours: 'Fermé' },
    ],
    emergency24h: false,
  },

  services: [
    {
      slug: 'pain-tradition',
      title: 'Pain tradition',
      short: 'La baguette de tous les jours, croûte craquante, mie alvéolée.',
      icon: 'Wheat',
      featured: true,
      priceFrom: '1,30 €',
    },
    {
      slug: 'pain-au-levain',
      title: 'Pain au levain, 500 g',
      short: 'Levain naturel, fermentation longue, croûte épaisse.',
      icon: 'Sprout',
      featured: true,
      priceFrom: '4,20 €',
    },
    {
      slug: 'pain-de-seigle',
      title: 'Pain de seigle',
      short: 'Mie dense, léger goût acidulé, parfait avec un fromage.',
      icon: 'Flame',
      priceFrom: '3,60 €',
    },
    {
      slug: 'pain-epeautre',
      title: 'Pain d’épeautre',
      short: 'Farine d’épeautre de Rhône-Alpes, mie claire, goût de noisette.',
      icon: 'Wheat',
      priceFrom: '4,50 €',
    },
    {
      slug: 'viennoiseries',
      title: 'Viennoiseries',
      short: 'Croissants, pains au chocolat, chaussons aux pommes, feuilletés dans la matinée.',
      description:
        'Beurre AOP, feuilletage tourné à la main chaque matin. Prêts dès l’ouverture, jusqu’à épuisement — comptez pour un dimanche, ça part vite.',
      bullets: ['Croissant, pain au chocolat, chausson', 'Beurre AOP', 'Cuits en continu jusqu’à 11h'],
      icon: 'Croissant',
      featured: true,
      priceFrom: 'à partir de 1,30 €',
    },
    {
      slug: 'patisseries-de-saison',
      title: 'Pâtisseries de saison',
      short: 'Tartes, flans, éclairs et entremets, selon les fruits du moment.',
      bullets: ['Recettes qui changent avec la saison', 'Fruits de producteurs locaux quand c’est possible'],
      icon: 'CakeSlice',
      priceFrom: 'à partir de 4,50 €',
    },
    {
      slug: 'sandwichs-du-midi',
      title: 'Sandwichs du midi',
      short: 'Préparés sur notre pain, à emporter entre midi et deux.',
      bullets: ['Faits sur place, sur notre pain du jour', 'Prêts à partir de 11h'],
      icon: 'Sandwich',
      priceFrom: 'à partir de 5,90 €',
    },
    {
      slug: 'gateaux-sur-commande',
      title: 'Gâteaux sur commande',
      short: 'Anniversaire, baptême, réunion de famille : un gâteau sur mesure, pensé avec vous.',
      description:
        'Décrivez l’occasion, le nombre de parts et vos goûts : nous vous proposons une recette et un prix avant de lancer la commande.\n\nDélai minimum 48 h — pour un dimanche, commandez avant jeudi.',
      bullets: ['Recette classique ou personnalisée', 'Message ou décor sur demande', 'Délai minimum : 48 h'],
      icon: 'Cake',
      featured: true,
    },
  ],

  about: {
    title: 'Trois générations, un fournil',
    story:
      'Le fournil de la rue des Pierres Plantées n’a pas changé d’adresse depuis 1987. On y pétrit toujours à la main les petites quantités, on y laisse le levain travailler son temps, et on y fait toujours confiance aux farines des meuniers de la région plutôt qu’à un fournisseur unique.\n\nCe qui a changé, ce sont les mains : après les grands-parents, puis leurs enfants, la troisième génération de la famille Roux est aujourd’hui aux fourneaux — avec la même envie que le pain d’aujourd’hui donne autant de plaisir que celui d’hier.',
  },

  process: [
    { title: '6h30 — Première fournée', text: 'Les pains tradition, levain, seigle et épeautre sortent du four, encore chauds.' },
    { title: '8h — Viennoiseries', text: 'Croissants, pains au chocolat et chaussons, feuilletés et cuits dans la matinée.' },
    { title: '11h — Pâtisseries et sandwichs', text: 'Les pâtisseries de saison et les sandwichs du midi sont prêts pour la pause déjeuner.' },
    { title: '16h — Fournée de l’après-midi', text: 'Une nouvelle fournée de pain pour le dîner, pendant que le fournil prépare déjà demain.' },
  ],

  faq: [
    { q: 'Combien de temps à l’avance dois-je commander un gâteau ?', a: 'Au moins 48 h à l’avance, par téléphone ou via le formulaire. Pour un dimanche, commandez avant jeudi.' },
    { q: 'Le pain est-il au levain naturel ?', a: 'Oui, tous nos pains sont fermentés au levain naturel, sans levure ajoutée.' },
    { q: 'Proposez-vous des sandwichs à emporter ?', a: 'Oui, préparés sur notre pain, disponibles à partir de 11h jusqu’à épuisement.' },
    { q: 'Puis-je adapter un gâteau à une allergie ou une envie particulière ?', a: 'Parlez-nous de votre demande au moment de la commande, nous vous dirons ce qui est possible selon la recette.' },
  ],

  form: { provider: 'mailto' },

  wording: {
    devis: 'Commander un gâteau',
    ctaTitle: 'Un gâteau pour dimanche&nbsp;? <em>Commandez avant jeudi.</em>',
    ctaText: 'Anniversaire, baptême ou simple envie du dimanche : dites-nous ce qu’il vous faut, on s’occupe du reste.',
    contactTitle: 'Commander ou nous écrire',
    contactText: 'Décrivez votre gâteau ou votre question, nous vous répondons rapidement.',
  },

  images: {},

  seo: {
    keywords: ['boulangerie Lyon', 'boulangerie Croix-Rousse', 'pain au levain Lyon', 'pâtisserie Lyon', 'gâteau sur commande Lyon'],
  },

  legal: {},
});
