// DEMO : client inventé
/**
 * La Cantine Roulante — food truck et traiteur basque à Bayonne (métier 17, trade 18 du mandat).
 * Direction "signal" (grep sur `direction:` dans chaque site.config.ts au 17 sept 2026 : neon x1, terre x1, signal x2
 * avant ce site — candidates du mandat) plutôt que "neon" (dark tech, aucun métier de bouche dans
 * meta.ts, palette imposée #d1262b/#fff4d6 ne colle pas à un fond noir) : blanc + rouge-orange franc +
 * Archivo Black massif, executé pour l'appétit et la rue plutôt que l'urgence — accent recalé sur le
 * rouge du client (proche de #d1262b) plutôt que le rouge-orange par défaut de la direction, comme
 * dubois-plomberie l'a fait avec un bleu nuit. Voir sections/ pour le détail de chaque composition.
 *
 * Squelette (21 sept 2026) : la tournée de la semaine passe de la section sur mesure `Semaine`
 * (bande de sept colonnes) à la variante partagée `process/horizon` (chapitre épinglé qui défile
 * horizontalement, une étape par écran) — jamais les deux à la fois, `Semaine.astro` reste dans
 * `sections/` mais sort du layout. Contact en tiroir (`contactDrawer: true`) avec le CTA « Demander
 * un devis traiteur » déjà en place (`wording.devis`) : la remorque vend aussi bien un plat à la
 * volée qu'un devis traiteur, le tiroir raccourcit le geste sans faire disparaître la section
 * contact finale. La bande `data-marquee-velocity` des quatre plats du hero devient une ligne fixe
 * (comme barbier-kessler) : le chapitre horizontal de la tournée est désormais le seul geste riche
 * de la page (CONVENTIONS.md règle 16).
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'cantine-roulante',
  direction: 'signal',
  motion: 'rich',
  // Rouge du client (#d1262b converti en HSL) plutôt que le rouge-orange par défaut de "signal" (h8) :
  // même famille, teinte plus proche de la charte fournie pour ce client.
  accent: { h: 358, s: 70, l: 46 },
  scale: 'display',

  layout: {
    nav: 'custom/nav',
    hero: 'custom/hero',
    contactDrawer: true,
    sections: [
      { type: 'process', variant: 'horizon' },
      { type: 'custom', variant: 'Carte', label: 'La carte' },
      { type: 'custom', variant: 'Traiteur', label: 'Traiteur' },
      { type: 'custom', variant: 'Remorque' },
      { type: 'zones', variant: 'chips' },
      { type: 'faq', variant: 'accordion' },
      { type: 'cta', variant: 'band' },
      { type: 'contact', variant: 'form-split' },
    ],
    footer: 'columns',
    divider: 'none',
    tone: 'alternate',
  },

  business: {
    name: 'La Cantine Roulante',
    trade: 'Food truck et traiteur',
    tagline: 'Axoa, talos, piperade. <em>Servis depuis la remorque.</em>',
    description:
      'Cuisine basque maison depuis 2019 : axoa de veau, talos, piperade, txistorra. Deux personnes à bord, qui cuisinent et qui servent.\n\nLe mardi à Bayonne, le jeudi à Anglet, le vendredi à Biarritz, le samedi à Saint-Jean-de-Luz. Le mercredi, le dimanche et le lundi, la remorque ne sort pas.\n\nEn traiteur, on se déplace jusqu’à 200 convives, dans tout le Pays basque et jusqu’à Pau.',
    since: 2019,
  },

  contact: {
    phone: '+33639983478',
    phoneDisplay: '06 39 98 34 78',
    email: 'contact@exemple.fr',
    address: { street: '3 chemin de Marracq', postalCode: '64100', city: 'Bayonne' },
    mapsUrl: 'https://maps.google.com/?q=3+chemin+de+Marracq+64100+Bayonne',
    mapsProvider: 'osm',
    coordinates: { lat: 43.4933, lng: -1.4748 },
    hours: [],
    emergency24h: false,
  },

  zones: {
    cities: ['Bayonne', 'Anglet', 'Biarritz', 'Saint-Jean-de-Luz', 'Hendaye', 'Pau'],
    label: 'Le Pays basque, et jusqu’à Pau en traiteur',
  },

  services: [
    { slug: 'talos-jambon', title: 'Talos garni, jambon de Bayonne', short: 'La galette de maïs, garnie de jambon de Bayonne.', icon: 'Sandwich', priceFrom: '6 €' },
    { slug: 'talos-fromage', title: 'Talos garni, fromage de brebis', short: 'La même galette, au fromage de brebis des Pyrénées. 6 €, comme la première.', icon: 'Sandwich', priceFrom: '6 €' },
    { slug: 'talos-axoa', title: 'Talos garni, axoa de veau', short: 'Le talos garni de l’axoa, au piment d’Espelette. 7 €.', icon: 'Sandwich', priceFrom: '7 €', featured: true },
    { slug: 'plat-axoa', title: 'Axoa de veau, riz basquaise', short: 'Du veau mijoté au piment d’Espelette, avec un riz basquaise.', icon: 'Soup', priceFrom: '13 €', featured: true },
    { slug: 'plat-piperade', title: 'Piperade et txistorra grillée', short: 'Poivrons, tomates, oignons mijotés longtemps. La txistorra passe à la plancha.', icon: 'Flame', priceFrom: '12 €' },
    { slug: 'plat-txistorra-frites', title: 'Txistorra-frites', short: 'La saucisse basque à la plancha. Frites maison, 9 €.', icon: 'UtensilsCrossed', priceFrom: '9 €' },
    { slug: 'dessert-gateau-basque', title: 'Gâteau basque, crème pâtissière', short: 'Le gâteau basque, celui à la crème pâtissière, pas celui à la cerise.', icon: 'Cookie', priceFrom: '5 €' },
  ],

  // La tournée de la semaine (process/horizon) : mêmes jours/villes que le planning d'origine
  // (sections/Semaine.astro, hors layout désormais), aucune ville ni horaire inventé — les jours
  // sans marché (mercredi, dimanche, lundi) ne sont pas des étapes, comme "Semaine" les marquait
  // "Repos" plutôt que d'inventer une ville.
  process: [
    { title: 'Mardi — Bayonne', text: 'Jour de marché : la remorque s’installe à Bayonne pour la matinée.' },
    { title: 'Jeudi — Anglet', text: 'La cantine roulante retrouve son emplacement habituel à Anglet.' },
    { title: 'Vendredi — Biarritz', text: 'Direction Biarritz pour la fin de semaine.' },
    { title: 'Samedi — Saint-Jean-de-Luz', text: 'Dernier arrêt de la semaine, à Saint-Jean-de-Luz.' },
  ],

  // Pas de section "about" dans le layout (le récit tient déjà dans business.description et dans
  // le hero) : about.story reste un champ requis par le schéma (src/lib/schema.ts), utilisé pour
  // le JSON-LD/la méta description, même sans bloc visuel dédié.
  about: {
    story:
      'La remorque a pris la route en 2019, sur les marchés du Pays basque. Deux personnes à bord, qui cuisinent et qui servent, chaque semaine.',
  },

  faq: [
    { q: 'Où vous trouve-t-on cette semaine ?', a: 'Le mardi à Bayonne, au marché. Le jeudi à Anglet, le vendredi à Biarritz, le samedi à Saint-Jean-de-Luz. Et le mercredi, le dimanche et le lundi, nulle part.' },
    { q: 'Jusqu’à combien de convives pour un mariage ou une fête d’entreprise ?', a: 'Jusqu’à 200 personnes, en buffet ou en service à table, dans tout le Pays basque.' },
    { q: 'Intervenez-vous en dehors du Pays basque ?', a: 'En traiteur, oui, jusqu’à Pau. La remorque, elle, ne quitte pas Bayonne, Anglet, Biarritz, Saint-Jean-de-Luz et Hendaye.' },
    { q: 'Comment réserver la remorque pour un événement privé ?', a: 'Par téléphone ou par le formulaire, avec trois informations : la date, le lieu, le nombre de convives. Le devis part sous 48 h.' },
  ],

  form: { provider: 'mailto' },
  images: {},

  wording: {
    devis: 'Demander un devis traiteur',
    ctaTitle: 'Un mariage, une fête d’entreprise ? <em>On vient avec la remorque.</em>',
    ctaText: 'Devis sous 48 h. Le menu s’ajuste à l’événement, et la remorque va partout dans le Pays basque.',
    contactTitle: 'Réserver la cantine',
    contactText: 'Dites-nous la date, le lieu et le nombre de convives. On rappelle pour parler du menu.',
  },

  seo: { keywords: ['food truck Bayonne', 'traiteur basque Bayonne', 'axoa Bayonne', 'traiteur mariage Pays basque'] },
  legal: {},
});
