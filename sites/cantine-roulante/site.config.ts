// DEMO : client inventé
/**
 * La Cantine Roulante — food truck et traiteur basque à Bayonne (métier 17, trade 18 du mandat).
 * Direction "signal" (grep sur `direction:` dans chaque site.config.ts au 17 sept 2026 : neon x1, terre x1, signal x2
 * avant ce site — candidates du mandat) plutôt que "neon" (dark tech, aucun métier de bouche dans
 * meta.ts, palette imposée #d1262b/#fff4d6 ne colle pas à un fond noir) : blanc + rouge-orange franc +
 * Archivo Black massif, executé pour l'appétit et la rue plutôt que l'urgence — accent recalé sur le
 * rouge du client (proche de #d1262b) plutôt que le rouge-orange par défaut de la direction, comme
 * dubois-plomberie l'a fait avec un bleu nuit. Voir sections/ pour le détail de chaque composition.
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
    sections: [
      { type: 'custom', variant: 'Semaine', label: 'Cette semaine' },
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
    tagline: 'La cuisine basque, du marché de Bayonne <em>à votre table.</em>',
    description:
      'La Cantine Roulante prépare une cuisine basque maison depuis 2019&nbsp;: axoa de veau, talos, piperade et txistorra, cuisinés et servis à la remorque par une équipe de deux personnes.\n\nEn semaine, retrouvez-nous sur les marchés de Bayonne, Anglet, Biarritz et Saint-Jean-de-Luz. Le soir, la remorque se déplace pour vos mariages et fêtes d’entreprise, jusqu’à 200 convives, dans tout le Pays basque et jusqu’à Pau en traiteur.',
    since: 2019,
  },

  contact: {
    phone: '+33639983478',
    phoneDisplay: '06 39 98 34 78',
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
    { slug: 'talos-jambon', title: 'Talos garni, jambon de Bayonne', short: 'La galette de maïs traditionnelle, garnie de jambon de Bayonne.', icon: 'Sandwich', priceFrom: '6 €' },
    { slug: 'talos-fromage', title: 'Talos garni, fromage de brebis', short: 'La même galette, garnie de fromage de brebis des Pyrénées.', icon: 'Sandwich', priceFrom: '6 €' },
    { slug: 'talos-axoa', title: 'Talos garni, axoa de veau', short: 'Le talos garni de notre axoa de veau au piment d’Espelette.', icon: 'Sandwich', priceFrom: '7 €', featured: true },
    { slug: 'plat-axoa', title: 'Axoa de veau, riz basquaise', short: 'Veau mijoté au piment d’Espelette, servi avec un riz basquaise.', icon: 'Soup', priceFrom: '13 €', featured: true },
    { slug: 'plat-piperade', title: 'Piperade et txistorra grillée', short: 'Poivrons, tomates et oignons mijotés, txistorra grillée à la plancha.', icon: 'Flame', priceFrom: '12 €' },
    { slug: 'plat-txistorra-frites', title: 'Txistorra-frites', short: 'La saucisse basque grillée à la plancha, frites maison.', icon: 'UtensilsCrossed', priceFrom: '9 €' },
    { slug: 'dessert-gateau-basque', title: 'Gâteau basque, crème pâtissière', short: 'Le classique pâtissier basque, à la crème pâtissière.', icon: 'Cookie', priceFrom: '5 €' },
  ],

  // Pas de section "about" dans le layout (le récit tient déjà dans business.description et dans
  // le hero) : about.story reste un champ requis par le schéma (src/lib/schema.ts), utilisé pour
  // le JSON-LD/la méta description, même sans bloc visuel dédié.
  about: {
    story:
      'La Cantine Roulante est née en 2019 sur les marchés du Pays basque. Une équipe de deux personnes cuisine et sert, chaque semaine, sur la remorque.',
  },

  faq: [
    { q: 'Où vous trouve-t-on cette semaine ?', a: 'Le mardi à Bayonne (marché), le jeudi à Anglet, le vendredi à Biarritz et le samedi à Saint-Jean-de-Luz. Le programme complet est plus haut sur cette page.' },
    { q: 'Jusqu’à combien de convives pour un mariage ou une fête d’entreprise ?', a: 'Jusqu’à 200 personnes, en buffet ou en service à table, dans tout le Pays basque.' },
    { q: 'Intervenez-vous en dehors du Pays basque ?', a: 'En traiteur, oui&nbsp;: nous nous déplaçons jusqu’à Pau. Le food truck reste sur Bayonne, Anglet, Biarritz, Saint-Jean-de-Luz et Hendaye.' },
    { q: 'Comment réserver la remorque pour un événement privé ?', a: 'Par téléphone ou via le formulaire de contact, avec la date, le lieu et le nombre de convives&nbsp;: nous revenons vers vous avec un devis.' },
  ],

  form: { provider: 'mailto' },
  images: {},

  wording: {
    devis: 'Demander un devis traiteur',
    ctaTitle: 'Un mariage, une fête d’entreprise&nbsp;? <em>On vient avec la remorque.</em>',
    ctaText: 'Devis clair sous 48&nbsp;h, menu adapté à votre événement, partout dans le Pays basque.',
    contactTitle: 'Réserver la cantine',
    contactText: 'Dites-nous la date, le lieu et le nombre de convives&nbsp;: nous vous rappelons rapidement.',
  },

  seo: { keywords: ['food truck Bayonne', 'traiteur basque Bayonne', 'axoa Bayonne', 'traiteur mariage Pays basque'] },
  legal: {},
});
