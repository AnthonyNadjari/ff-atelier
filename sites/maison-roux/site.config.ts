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
 *
 * Squelette (21 sept 2026) : nav `burger` partagée (plein écran à l'ouverture, gros liens numérotés,
 * identique desktop/mobile) à la place de la barre "ticket de caisse" sur mesure — `sections/Nav.astro`
 * reste dans le dossier mais sort du layout. Contact en tiroir (`contactDrawer: true`) : « Commander
 * un gâteau » ouvre le tiroir en un geste depuis n'importe quelle page plutôt que de dérouler jusqu'en
 * bas ; la section contact sur mesure (`sections/Contact.astro`) sort du layout mais le fichier reste
 * (il voyage avec le site à l'export). Le tiroir devient la seule porte de contact : navLinks() y
 * ajoute #contact automatiquement.
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
    nav: 'burger',
    hero: 'custom/hero',
    contactDrawer: true,
    // 9 oct 2026 : la fournée devient une ardoise (un bloc encre, le temps fort, juste sous la
    // devanture), la carte et les gâteaux perdent leurs effets, la bande CTA finale saute (deux blocs
    // encre à la suite du pied de page ; le bouton de commande est dans la section gâteaux).
    sections: [
      { type: 'custom', variant: 'Fournee', label: 'Fournée du jour' },
      { type: 'custom', variant: 'Carte', label: 'La carte' },
      { type: 'about', variant: 'story' },
      { type: 'custom', variant: 'CommanderGateau', label: 'Gâteaux' },
      { type: 'faq', variant: 'accordion' },
    ],
    footer: 'columns',
    divider: 'none',
    tone: 'alternate',
    shell: 'flow',
  },

  business: {
    name: 'Maison Roux',
    trade: 'Boulangerie-pâtisserie',
    tagline: 'Première fournée à 6 h 30, <em>et ça recommence à 16 h.</em>',
    description:
      'Le fournil est rue des Pierres Plantées, à la Croix-Rousse, et il n’a pas bougé depuis 1987. Levain naturel, farines de meuniers de Rhône-Alpes. Trois générations de Roux y ont mis les mains.\n\nOn cuit en continu du petit matin jusqu’à la fin de la matinée, puis une dernière fournée part à 16 h. Et le dimanche, ça part vite.',
    since: 1987,
  },

  contact: {
    phone: '+33639987244',
    phoneDisplay: '06 39 98 72 44',
    email: 'contact@exemple.fr',
    address: { street: '8 rue des Pierres Plantées', postalCode: '69001', city: 'Lyon' },
    mapsUrl: 'https://maps.google.com/?q=8+rue+des+Pierres+Plantées+69001+Lyon',
    mapsProvider: 'osm',
    coordinates: { lat: 45.7688, lng: 4.8328 },
    hours: [
      { days: 'Mardi – samedi', hours: '6 h 30 – 19 h 30' },
      { days: 'Dimanche', hours: '6 h 30 – 13 h' },
      { days: 'Lundi', hours: 'Fermé' },
    ],
    emergency24h: false,
  },

  services: [
    {
      slug: 'pain-tradition',
      title: 'Pain tradition',
      short: 'La baguette qu’on prend tous les jours : croûte craquante, mie alvéolée.',
      icon: 'Wheat',
      featured: true,
      priceFrom: '1,30 €',
    },
    {
      slug: 'pain-au-levain',
      title: 'Pain au levain, 500 g',
      short: 'Fermentation longue, levain naturel, croûte épaisse. Un pain de 500 g qui demande du temps.',
      icon: 'Sprout',
      featured: true,
      priceFrom: '4,20 €',
    },
    {
      slug: 'pain-de-seigle',
      title: 'Pain de seigle',
      short: 'Mie dense, un peu acidulé. À prendre si vous mangez du fromage.',
      icon: 'Flame',
      priceFrom: '3,60 €',
    },
    {
      slug: 'pain-epeautre',
      title: 'Pain d’épeautre',
      short: 'Farine d’épeautre de Rhône-Alpes. Mie claire, goût de noisette.',
      icon: 'Wheat',
      priceFrom: '4,50 €',
    },
    {
      slug: 'viennoiseries',
      title: 'Viennoiseries',
      short: 'Croissants, pains au chocolat, chaussons aux pommes. On enfourne jusqu’à 11 h.',
      description:
        'Beurre AOP, feuilletage tourné à la main chaque matin. Prêts dès l’ouverture, cuits en continu jusqu’à 11 h, et après il n’y en a plus.\n\nLe dimanche, ça part vite. Venez tôt.',
      bullets: ['Croissant, pain au chocolat, chausson', 'Beurre AOP', 'Cuits en continu jusqu’à 11 h', 'Jusqu’à épuisement'],
      icon: 'Croissant',
      featured: true,
      priceFrom: 'à partir de 1,30 €',
    },
    {
      slug: 'patisseries-de-saison',
      title: 'Pâtisseries de saison',
      short: 'Tartes, flans, éclairs, entremets. Ce qu’il y a en vitrine dépend des fruits du moment.',
      bullets: ['La recette change avec la saison', 'Fruits de producteurs locaux quand c’est possible'],
      icon: 'CakeSlice',
      priceFrom: 'à partir de 4,50 €',
    },
    {
      slug: 'sandwichs-du-midi',
      title: 'Sandwichs du midi',
      short: 'Faits sur notre pain du jour, prêts à partir de 11 h.',
      bullets: ['Faits sur place, sur notre pain du jour', 'Prêts à partir de 11 h', 'À emporter entre midi et deux'],
      icon: 'Sandwich',
      priceFrom: 'à partir de 5,90 €',
    },
    {
      slug: 'gateaux-sur-commande',
      title: 'Gâteaux sur commande',
      short: 'Dites-nous l’occasion et le nombre de parts. Comptez 48 h, minimum.',
      description:
        'Vous nous dites l’occasion, le nombre de parts et ce que vous aimez. On vous propose une recette et un prix avant de lancer quoi que ce soit.\n\n48 h minimum. Pour un dimanche, il faut commander avant jeudi.',
      bullets: ['Recette classique ou personnalisée', 'Message ou décor sur demande', 'Délai minimum : 48 h'],
      icon: 'Cake',
      featured: true,
    },
  ],

  about: {
    title: 'Trois générations, un fournil',
    story:
      'Le fournil de la rue des Pierres Plantées n’a pas changé d’adresse depuis 1987. On y pétrit encore à la main les petites quantités, et on laisse le levain prendre le temps qu’il lui faut.\n\nLes farines viennent de meuniers de la région, pas d’un fournisseur unique. C’est plus compliqué à gérer. On continue quand même.\n\nCe qui a changé, ce sont les mains : les grands-parents, puis leurs enfants, puis la troisième génération. Le pain, lui, sort du même four.',
  },

  process: [
    { title: '6 h 30, Les pains', text: 'Tradition, levain, seigle et épeautre sortent du four, encore chauds.' },
    { title: '8 h, Les viennoiseries', text: 'Croissants, pains au chocolat, chaussons : feuilletés le matin même, enfournés jusqu’à 11 h.' },
    { title: '11 h, Pâtisseries et sandwichs', text: 'Les tartes et entremets de saison, et les sandwichs du midi sur le pain du jour.' },
    { title: '16 h, La fournée de l’après-midi', text: 'Une dernière fournée de pain pour le dîner, pendant que le fournil prépare déjà demain.' },
  ],

  faq: [
    { q: 'Combien de temps à l’avance dois-je commander un gâteau ?', a: '48 h minimum, par téléphone ou par le formulaire. Pour un dimanche, passez commande avant jeudi.' },
    { q: 'Le pain est-il au levain naturel ?', a: 'Tous, oui. Levain naturel, aucune levure ajoutée.' },
    { q: 'Proposez-vous des sandwichs à emporter ?', a: 'À partir de 11 h, sur notre pain du jour, et jusqu’à épuisement.' },
    { q: 'Puis-je adapter un gâteau à une allergie ou une envie particulière ?', a: 'Dites-le au moment de la commande. Selon la recette, c’est possible ou non, et on vous le dira franchement.' },
    { q: 'Peut-on mettre du pain de côté ?', a: 'Un coup de fil avant 10 h et on vous garde vos pains jusqu’à la fermeture. Pour le dimanche, appelez le samedi.' },
    { q: 'Faites-vous du pain sans gluten ?', a: 'Non. Le fournil travaille le blé, le seigle et l’épeautre dans le même four, on ne peut pas garantir l’absence de traces.' },
  ],

  form: { provider: 'mailto' },

  wording: {
    devis: 'Commander un gâteau',
    ctaTitle: 'Un gâteau pour dimanche ? <em>Il faut nous le dire avant jeudi.</em>',
    ctaText: 'Le nombre de parts, la date, ce que vous aimez. On vous rappelle avec une recette et un prix.',
    contactTitle: 'Passer commande',
    contactText: 'Écrivez-nous ce qu’il vous faut. On répond depuis le fournil, entre deux fournées.',
  },

  images: {
    hero: { src: '/images/galerie-1.webp', alt: 'Baguettes tradition sur la grille de refroidissement, encore farinées' },
  },

  seo: {
    keywords: ['boulangerie Lyon', 'boulangerie Croix-Rousse', 'pain au levain Lyon', 'pâtisserie Lyon', 'gâteau sur commande Lyon'],
  },

  legal: {},
});
