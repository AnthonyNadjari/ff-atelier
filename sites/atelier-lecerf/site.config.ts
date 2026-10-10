// DEMO : client inventé (Atelier Lecerf, Roubaix). Coordonnées fictives (plage 06 39 98), prénoms
// fictifs, aucun avis ni chiffre de clientèle. Prix tous suffixés « (indicatif) ».
/**
 * 10 oct 2026, refonte d'après le benchmark (même méthode que forge-delacroix et encre-noire) :
 * - premier écran = le croquis (planche de chêne en grand), titre, une phrase avec les noms, l'adresse ;
 * - « L'atelier » ajouté : histoire + faits sur des filets (about.story n'était affiché nulle part) ;
 * - FAQ avec les vraies questions d'un client d'ébéniste ;
 * - retirés : reflet au survol des essences, décodage des prix, halo du contact, pastilles de villes,
 *   badge « depuis 1998 » de la nav, et le faux avant/après de la restauration (deux images sans
 *   rapport) remplacé par le geste en texte.
 * Direction `terre` (Bitter + Nunito), accent brun noyer, chapitre process/horizon gardés.
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'atelier-lecerf',
  direction: 'terre',
  motion: 'rich',
  accent: { h: 28, s: 42, l: 34 },
  scale: 'display',

  layout: {
    nav: 'custom/Nav',
    hero: 'custom/Hero',
    sections: [
      { type: 'custom', variant: 'Atelier', label: 'L’atelier' },
      { type: 'process', variant: 'horizon' },
      { type: 'custom', variant: 'Matieres', label: 'Matières' },
      { type: 'custom', variant: 'Restauration', label: 'Restauration' },
      { type: 'custom', variant: 'Estimation', label: 'Tarifs' },
      { type: 'faq', variant: 'accordion' },
      { type: 'custom', variant: 'Contact', label: 'Contact' },
    ],
    footer: 'columns',
  },

  business: {
    name: 'Atelier Lecerf',
    trade: 'Menuisier-ébéniste',
    tagline: 'Chêne, frêne, noyer. <em>Massifs, jamais plaqués.</em>',
    description:
      'Atelier de menuiserie et d’ébénisterie à Roubaix, 14 rue de l’Alma, dans une ancienne filature. Depuis 1998. Ils sont deux : le dessin, le choix du bois et la fabrication restent dans les mêmes mains.\n\nChêne, frêne, noyer. Massifs, et jamais de panneau plaqué. Cuisines, bibliothèques, escaliers, restauration de meubles anciens, pour Roubaix et la métropole lilloise.',
    since: 1998,
    legalForm: 'SARL',
    insurance: 'Assurance décennale MAAF n° 000 000',
  },

  contact: {
    phone: '+33639981357',
    phoneDisplay: '06 39 98 13 57',
    email: 'contact@exemple.fr',
    address: { street: '14 rue de l’Alma', postalCode: '59100', city: 'Roubaix' },
    mapsUrl: 'https://maps.google.com/?q=14+rue+de+l%27Alma+59100+Roubaix',
    mapsProvider: 'osm',
    coordinates: { lat: 50.6942, lng: 3.1746 },
    hours: [
      { days: 'Lundi – vendredi', hours: '8 h – 18 h' },
      { days: 'Samedi', hours: 'Sur rendez-vous' },
    ],
    emergency24h: false,
  },

  zones: { cities: ['Roubaix', 'Tourcoing', 'Lille', 'Croix', 'Wasquehal', 'Marcq-en-Barœul'], label: 'Métropole lilloise' },

  services: [
    {
      slug: 'cuisines-sur-mesure',
      title: 'Cuisines sur mesure',
      short: 'Relevé chez vous, croquis validé, puis la coupe. À partir de 8 000 € (indicatif).',
      description:
        'Une cuisine sur mesure commence chez vous, mètre en main. On relève les cotes, on regarde comment la pièce est vraiment utilisée, puis on parle du bois.\n\nLe dessin est validé avant la moindre coupe. Fabrication à l’atelier, pose comprise. À partir de 8 000 €, à titre indicatif.',
      bullets: ['Croquis validé avant fabrication', 'Bois massif, jamais de panneau plaqué', 'Pose comprise'],
      icon: 'ChefHat',
      featured: true,
      priceFrom: 'à partir de 8 000 € (indicatif)',
    },
    {
      slug: 'bibliotheques-sur-mesure',
      title: 'Bibliothèques sur mesure',
      short: 'Sous pente, en alcôve, d’angle. Et toujours dessinée pour le mur qu’elle occupe.',
      description:
        'Une bibliothèque se dessine pour le mur qu’elle occupe. Sous pente, en alcôve, d’angle : le relevé se fait sur place.\n\nAssemblages traditionnels. Finition huilée ou cirée, selon l’essence.',
      bullets: ['Relevé sur place', 'Sous pente, alcôve, angle', 'Finitions huilées ou cirées'],
      icon: 'BookOpen',
      featured: true,
      priceFrom: 'à partir de 2 500 € (indicatif)',
    },
    {
      slug: 'escaliers-bois-massif',
      title: 'Escaliers en bois massif',
      short: 'Droit ou quart tournant, avec garde-corps assorti si vous le voulez.',
      description:
        'La cage d’escalier se relève au millimètre avant qu’on dessine quoi que ce soit. La fabrication vient après, à l’atelier.\n\nGarde-corps assorti si vous le souhaitez. Et un escalier existant peut être rénové plutôt que remplacé.',
      bullets: ['Relevé sur place', 'Garde-corps assortis', 'Rénovation d’escaliers existants'],
      icon: 'DoorStairwell',
      priceFrom: 'à partir de 4 500 € (indicatif)',
    },
    {
      slug: 'restauration-meubles-anciens',
      title: 'Restauration de meubles anciens',
      short: 'Décapage, recollage, pièces manquantes refaites dans une essence compatible.',
      description:
        'Commodes, armoires, chaises anciennes. Décapage, recollage, remplacement des pièces manquantes dans une essence compatible, finition à l’huile ou à la cire.\n\nC’est le même geste qu’en fabrication neuve. Et un meuble ancien ne doit pas ressortir d’ici comme s’il était neuf.',
      bullets: ['Décapage et recollage', 'Remplacement de pièces manquantes', 'Finition huile ou cire'],
      icon: 'Hammer',
      priceFrom: 'à partir de 250 € (indicatif)',
    },
  ],

  about: {
    title: 'L’atelier',
    story:
      'Thomas Lecerf a ouvert l’atelier en 1998 au rez-de-chaussée d’une ancienne filature, rue de l’Alma. Il sortait de huit ans chez un ébéniste de Lille. Hugo Desmet, son ancien apprenti, est resté : ils sont deux depuis 2009.\n\nLe lieu a gardé ses hauts plafonds et sa lumière du nord. On y débite des planches de quatre mètres, on y laisse sécher le bois plusieurs mois avant de le travailler. Thomas dessine et vient chez vous relever les cotes ; Hugo tient l’établi. La pose, ils la font à deux.\n\nPas de panneau plaqué, pas de catalogue. Une pièce est dessinée pour l’endroit où elle va vivre.',
    values: [
      { title: 'Bois massif', text: 'Chêne, frêne, noyer. Jamais de panneau plaqué.' },
      { title: 'Le croquis avant l’établi', text: 'Chaque pièce est dessinée avec vous avant d’être coupée.' },
      { title: 'Neuf et ancien', text: 'Le sur-mesure et la restauration de meubles anciens, avec le même geste.' },
    ],
    milestones: [{ year: '1998', text: 'Ouverture de l’atelier, dans une ancienne filature de Roubaix.' }],
  },

  process: [
    { title: 'Le croquis', text: 'On discute du projet, on prend les mesures, on dessine ensemble la pièce avant tout achat de bois.' },
    { title: 'Le choix du bois', text: 'Chêne, frêne ou noyer massif, choisi selon l’usage de la pièce et la lumière qui l’éclaire.' },
    { title: 'La fabrication', text: 'Débit, assemblage, finition à l’huile ou à la cire. Tout se fait à l’atelier de Roubaix.' },
    {
      title: 'La pose',
      text: 'Installation chez vous, réglages sur place, et les conseils d’entretien du bois massif.',
    },
  ],

  faq: [
    { q: 'Combien coûte une cuisine en bois massif ?', a: 'Les cuisines partent d’environ 8 000 €, pose comprise, mais le prix dépend surtout du linéaire, de l’essence et du plan de travail. On vient relever les cotes, on dessine, et le devis qui suit est ferme.' },
    { q: 'Quel délai entre le croquis et la pose ?', a: 'Il est écrit sur le devis. Il dépend du carnet de l’atelier et du séchage du bois choisi. On vous le donne avant que vous signiez, pas après.' },
    { q: 'Pourquoi jamais de panneau plaqué ?', a: 'Un meuble massif se ponce, se répare et se reprend dans vingt ans. Un plaqué abîmé se remplace. C’est plus cher au départ, et c’est le seul argument qu’on ait.' },
    { q: 'Pouvez-vous restaurer un meuble que je vous apporte ?', a: 'Oui. Apportez-le rue de l’Alma, ou envoyez des photos d’abord. On vous dit ce qui se sauve, ce qui se refait et combien, avant de toucher à quoi que ce soit.' },
    { q: 'Travaillez-vous en dehors de Roubaix ?', a: 'Dans toute la métropole lilloise : Tourcoing, Lille, Croix, Wasquehal, Marcq-en-Barœul. Au-delà, on en parle au téléphone.' },
    { q: 'Peut-on venir voir l’atelier ?', a: 'Le samedi, sur rendez-vous. On vous montre les bois en séchage et les pièces en cours.' },
  ],

  form: { provider: 'mailto' },

  wording: {
    devis: 'Dessiner votre projet',
    ctaTitle: 'Un meuble qui n’existe pas encore ? <em>Dessinons-le ensemble.</em>',
    contactTitle: 'Dessiner votre projet',
    contactText: 'Dites ce que vous cherchez : une cuisine, une bibliothèque, un escalier, un meuble à restaurer. On rappelle pour en parler.',
  },

  images: {},

  seo: {
    keywords: ['menuisier Roubaix', 'ébéniste Roubaix', 'cuisine sur mesure bois massif', 'escalier bois Roubaix', 'restauration meubles anciens Lille'],
  },
});
