// DEMO : client inventé (Chez Malo). Coordonnées fictives (plage 06 39 98), aucun avis inventé.
// Nav, hero et blocs principaux dessinés à la main pour ce site : sites/chez-malo/sections/.
//
// 9 oct 2026 : le premier écran montre le poisson (grondin sur la planche, photo du dossier) et non plus
// la vue du Vallon ; l’accroche s’affichait avec ses balises <em> en clair (bug), le badge tournant
// « Réserver », le remplissage du titre au défilement et le duotone sont partis. « L’essentiel »
// (trois cartes à icône sur fond encre), « Une journée » (quatre heures géantes épinglées) et la bande
// d’appel finale sont remplacés par l’ardoise de l’arrivage du jour (bloc signature : ce qui est
// arrivé de la criée, à quel prix, et les heures de service), une carte avec trois photos de plats,
// « Le lieu » avec l’histoire et les faits de la maison sur filets, et une FAQ de vraies questions.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'chez-malo',
  direction: 'mediterranee',
  motion: 'rich',
  scale: 'display',
  typography: { display: 'gelasio', body: 'figtree' },
  layout: {
    shell: 'sticky-hero',
    nav: 'custom/nav',
    hero: 'custom/hero',
    sections: [
      { type: 'custom', variant: 'carte', label: 'La carte' },
      { type: 'custom', variant: 'arrivage', label: 'Arrivage' },
      { type: 'custom', variant: 'lelieu', label: 'Le lieu' },
      { type: 'faq', variant: 'two-columns' },
      { type: 'contact', variant: 'simple' },
    ],
    footer: 'big-name',
    divider: 'none',
    tone: 'flat',
  },

  business: {
    name: 'Chez Malo',
    trade: 'Restaurant de poissons et bouillabaisse',
    tagline: 'La criée le matin, <em>la carte le soir.</em>',
    description:
      'Restaurant de poissons au Vallon des Auffes, face aux barques et aux cabanons de pêcheurs. Malo Ferrer y cuisine depuis 2011 ce qu’il a acheté à la criée le matin même : poissons de roche, loup, daurade, rouget.\n\nTrente-deux couverts, une terrasse sur le port. La bouillabaisse, elle, se commande la veille, et pour deux personnes au minimum. Le lundi, c’est fermé.',
    since: 2011,
  },

  contact: {
    phone: '+33639986340',
    phoneDisplay: '06 39 98 63 40',
    email: 'contact@exemple.fr',
    address: { street: '4 rue du Vallon des Auffes', postalCode: '13007', city: 'Marseille' },
    mapsUrl: 'https://maps.google.com/?q=4+rue+du+Vallon+des+Auffes+13007+Marseille',
    hours: [
      { days: 'Mardi – samedi', hours: '12 h – 14 h et 19 h 30 – 22 h' },
      { days: 'Dimanche', hours: '12 h – 14 h 30' },
      { days: 'Lundi', hours: 'Fermé' },
    ],
    emergency24h: false,
  },

  services: [
    {
      slug: 'bouillabaisse-du-vallon',
      title: 'Bouillabaisse du Vallon',
      short: 'Elle se commande la veille, et jamais pour une seule personne. 84 € pour deux.',
      icon: 'Soup',
      featured: true,
      priceFrom: '84 € pour deux',
    },
    {
      slug: 'poisson-du-jour',
      title: 'Poisson du jour',
      short: 'Loup, daurade ou rouget, arrivé le matin même. Et grillé simplement, parce qu’il n’a pas besoin de plus.',
      icon: 'Fish',
      featured: true,
    },
    {
      slug: 'terrasse-sur-le-port',
      title: 'Terrasse sur le port',
      short: 'Trente-deux couverts en tout. De la table, on voit les barques et les cabanons.',
      icon: 'Sun',
    },
  ],

  about: {
    title: 'Le lieu',
    story:
      'Malo Ferrer a ouvert en 2011, dans une ancienne cabane de pêcheur du Vallon des Auffes, sous le pont de la Corniche. Trente-deux couverts, pas un de plus : la salle est ce qu’elle est, et la terrasse s’ouvre dès les beaux jours, au ras de l’eau.\n\nIl passe à la criée du Vieux-Port chaque matin à six heures. La carte s’écrit après, avec ce qui est arrivé. Certains soirs, il n’y a pas de bouillabaisse ; il y a toujours un poisson entier à partager.',
  },

  faq: [
    { q: 'Faut-il réserver ?', a: 'Le soir et le dimanche midi, oui : trente-deux couverts, c’est vite complet. Un appel suffit, on garde la table un quart d’heure.' },
    { q: 'Comment commander la bouillabaisse ?', a: 'La veille au plus tard, par téléphone, pour deux personnes au minimum. Le fond se prépare la nuit et le poisson est acheté pour vous le matin même. Sans commande, il n’y en a pas.' },
    { q: 'La carte est-elle la même chaque jour ?', a: 'Non. Elle s’écrit à onze heures avec ce que la criée a donné. Les entrées et les desserts changent peu ; les poissons, tous les jours.' },
    { q: 'Peut-on réserver la terrasse ?', a: 'On note votre préférence, mais la terrasse dépend du mistral. S’il souffle, on vous installe en salle, face au port quand même.' },
    { q: 'Y a-t-il un menu pour les enfants ?', a: 'Pas de menu à part : un filet de poisson du jour grillé, des pommes de terre, un dessert, à prix réduit. Dites-le en réservant.' },
    { q: 'Où se garer au Vallon des Auffes ?', a: 'Pas dans le vallon, les rues sont trop étroites. Le parking de la Corniche, à trois minutes à pied, ou le bus 83 qui s’arrête juste au-dessus.' },
  ],

  wording: {
    devis: 'Réserver une table',
    contactTitle: 'Réserver',
    contactText: 'Un appel, et on garde la table. La bouillabaisse se commande la veille.',
  },

  form: { provider: 'mailto' },

  images: {
    hero: { src: '/images/galerie-5.webp', alt: 'Grondins rouges de la criée sur la planche de la cuisine' },
    og: '/images/hero.webp',
  },

  seo: {
    keywords: ['restaurant Vallon des Auffes', 'bouillabaisse Marseille', 'poissons Marseille 7e', 'restaurant terrasse port Marseille'],
  },

  legal: { owner: 'Malo Ferrer' },
});
