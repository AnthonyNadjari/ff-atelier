// DEMO : client inventé (Garage Moteur & Fils). Coordonnées fictives (plage 06 39 98), aucun avis.
// Nav, hero et blocs principaux dessinés à la main pour ce site : sites/moteur-fils/sections/.
//
// Squelette (21 sept 2026) : coquille `split` — panneau fixe à gauche (enseigne, sommaire actif
// numéroté, horaires, téléphone), contenu qui défile à droite. Un garage vend un numéro qu'on voit
// tout le temps et un sommaire court (avant/après, symptômes, services, rendez-vous) : le panneau
// le porte en permanence sur desktop ; la nav sur mesure ne sert plus qu'en mobile. Un seul geste
// riche sur la page : le curseur avant/après (data-compare) — les deux bandes défilantes du hero
// (data-marquee) deviennent une ligne fixe des services.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'moteur-fils',
  direction: 'retro',
  motion: 'rich',
  scale: 'display',
  typography: { display: 'bricolage', body: 'nunito' },
  layout: {
    shell: 'split',
    nav: 'custom/nav',
    hero: 'custom/hero',
    sections: [
      { type: 'custom', variant: 'avantapres', label: 'Avant / après' },
      { type: 'custom', variant: 'symptomes', label: 'Ça fait quel bruit ?' },
      { type: 'custom', variant: 'augarage', label: 'Services' },
      { type: 'custom', variant: 'rendezvous', label: 'Rendez-vous' },
      { type: 'faq', variant: 'accordion' },
      { type: 'contact', variant: 'simple' },
    ],
    footer: 'columns',
    divider: 'none',
    tone: 'flat',
  },

  business: {
    name: 'Garage Moteur & Fils',
    trade: 'Garage indépendant, toutes marques',
    tagline: 'On répare ce qui roule, <em>depuis 1994.</em>',
    description:
      'Garage indépendant à Nancy, 8 rue de la Colline, depuis 1994. Toutes les marques, françaises comme étrangères. Ici, c’est toujours un Moteur qui vous reçoit : André d’abord, Julien aujourd’hui.\n\nRévision, freinage, pneus, diagnostic, climatisation, carrosserie légère. Un seul garage pour (presque) tout. Et un véhicule de courtoisie selon disponibilité, si la voiture doit rester plus d’une journée.',
    since: 1994,
  },

  contact: {
    phone: '+33639983771',
    phoneDisplay: '06 39 98 37 71',
    email: 'contact@exemple.fr',
    address: { street: '8 rue de la Colline', postalCode: '54000', city: 'Nancy' },
    hours: [
      { days: 'Lundi – vendredi', hours: '8 h – 12 h, 14 h – 18 h 30' },
      { days: 'Samedi', hours: '9 h – 12 h' },
    ],
    emergency24h: false,
  },

  services: [
    {
      slug: 'entretien-revision',
      title: 'Entretien et révision',
      short: 'Vidange, filtres, courroie de distribution. Ce qu’on fait avant que ça casse.',
      icon: 'Wrench',
      featured: true,
      image: { src: '/images/service-1.webp', alt: 'Mécanicien penché sur un moteur ouvert, en pleine révision' },
    },
    { slug: 'freinage', title: 'Freinage', short: 'Plaquettes, disques, liquide. On contrôle d’abord, on change ensuite, et pas l’inverse.', icon: 'Disc3' },
    { slug: 'pneus', title: 'Pneus', short: 'Montage, équilibrage, permutation. La pression aussi, si vous passez juste pour ça.', icon: 'CircleDot' },
    { slug: 'diagnostic', title: 'Diagnostic électronique', short: 'Un voyant allumé, un bruit bizarre. On branche la valise, on cherche, on explique.', icon: 'ScanLine' },
    { slug: 'climatisation', title: 'Climatisation', short: 'Recharge et contrôle du circuit. Et mieux vaut y penser au printemps qu’en juillet.', icon: 'Snowflake' },
    { slug: 'carrosserie', title: 'Carrosserie légère', short: 'Rayures, bosses, petits chocs, repris sans passer par l’assurance.', icon: 'PaintBucket' },
  ],

  about: {
    title: 'Le garage',
    story:
      'André Moteur a ouvert le garage en 1994, rue de la Colline. Son fils Julien l’a rejoint quinze ans plus tard. C’est lui qui tient la clé, la plupart du temps.\n\nToutes les marques, françaises comme étrangères, électronique embarquée comprise. On prépare aussi les voitures au contrôle technique, avec un centre agréé tout près. Mais on ne fait pas le contrôle nous-mêmes : ce n’est pas notre métier.',
  },

  faq: [
    { q: 'Quel délai pour un rendez-vous ?', a: 'Ça dépend de la période, mais un appel suffit pour savoir si on peut vous prendre le jour même ou dans la semaine. Pour une urgence, dites-le au téléphone.' },
    { q: 'Le véhicule de courtoisie est-il disponible ?', a: 'Selon disponibilité, et à réserver en même temps que le rendez-vous. Il ne sert vraiment que si la voiture doit rester plus d’une journée.' },
    { q: 'Le devis est-il gratuit ?', a: 'Ce qui doit être fait et ce que ça coûte vous sont dits avant qu’on commence. Rien n’est engagé sans votre accord.' },
    { q: 'Travaillez-vous sur toutes les marques ?', a: 'Oui, toutes marques, françaises comme étrangères, y compris les modèles récents avec électronique embarquée.' },
  ],

  form: { provider: 'mailto' },

  wording: {
    devis: 'Prendre rendez-vous',
    ctaTitle: 'Un bruit bizarre ? <em>Passez, on écoute.</em>',
    contactTitle: 'Prendre rendez-vous',
    contactText: 'Un appel, et on trouve un créneau qui vous arrange.',
  },

  images: {},

  seo: {
    keywords: ['garage Nancy', 'mécanicien Nancy', 'entretien voiture Nancy', 'garage toutes marques Nancy'],
  },

  legal: { owner: 'Famille Moteur' },
});
