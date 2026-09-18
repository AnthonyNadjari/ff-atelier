/**
 * Site du studio Finck & Fisch — dogfooding : notre propre site, construit avec notre fabrique.
 * Téléphone et adresse ci-dessous sont des placeholders à remplacer avant mise en ligne
 * (voir résumé de livraison) — Paris/75000 n'est pas une adresse réelle du studio.
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'finck-fisch',
  domain: 'finckfisch.fr',

  // Direction luxe : noir profond, or fin, Cormorant. Sobre et precieux plutot qu'off-white +
  // rouge vif — c'est notre vitrine, elle doit ressembler a ce qu'on vend, pas a une landing page
  // generique. Pas de `typography` : les polices de la direction (Cormorant / Instrument Sans)
  // sont exactement le registre voulu.
  direction: 'luxe',
  motion: 'rich',
  scale: 'display',
  layout: {
    nav: 'custom/nav',
    hero: 'custom/hero',
    sections: [
      { type: 'custom', variant: 'realisations', label: 'Réalisations' },
      { type: 'custom', variant: 'manifeste' },
      { type: 'custom', variant: 'commentcasepasse' },
      { type: 'custom', variant: 'propositions' },
      { type: 'custom', variant: 'offre', label: 'Offre' },
      { type: 'faq', variant: 'two-columns' },
      { type: 'contact', variant: 'form-card' },
    ],
    footer: 'minimal',
    divider: 'rule',
    tone: 'flat',
  },

  business: {
    name: 'Finck & Fisch',
    trade: 'Studio de sites vitrines pour artisans',
    tagline: 'Un site dessiné pour vous, <em>livré en 72 heures.</em>',
    description:
      'Finck & Fisch dessine des sites vitrines à la main, un par un — jamais un modèle décliné par ville. Chaque projet part de trois propositions de direction visuelle, pas d’une seule maquette imposée. Livré en 72 heures et payé en une seule fois : pas d’abonnement, pas de frais cachés, le site vous appartient — du code au nom de domaine — dès la mise en ligne.\n\nDeux associés, un seul interlocuteur du premier appel à la livraison : nous travaillons avec des artisans, des commerces et des indépendants qui veulent une présence en ligne sérieuse, sans passer par une agence ni gérer un chantier numérique au long cours.',
    certifications: [],
  },

  contact: {
    phone: '+33600000000',
    phoneDisplay: '06 00 00 00 00',
    email: 'contact@finckfisch.fr',
    address: { postalCode: '75000', city: 'Paris' },
    hours: [{ days: 'Lundi – vendredi', hours: '9h – 19h' }],
    emergency24h: false,
  },

  zones: { label: 'Toute la France, à distance', cities: [] },

  services: [
    {
      slug: 'site-vitrine',
      title: 'Site vitrine clé en main',
      short: 'Un site de 1 à 6 pages, pensé pour votre activité et livré en une fois.',
      icon: 'Layout',
      featured: true,
      image: { src: '/images/service-1.webp', alt: 'Composition graphique abstraite noir et blanc, image de démonstration' },
      bullets: ['1 à 6 pages', 'Formulaire de contact', 'SEO local', 'Mentions légales', 'Hébergement sans frais mensuels', 'Nom de domaine à votre nom'],
      description:
        'Le site est conçu pour présenter clairement votre activité : vos services, votre zone d’intervention, vos coordonnées, et un formulaire pour être contacté sans détour.\n\nIl est optimisé pour le référencement local, comprend vos mentions légales, et ne génère aucun frais mensuel : l’hébergement est inclus et le nom de domaine est à votre nom.',
    },
    {
      slug: 'refonte',
      title: 'Refonte de site existant',
      short: 'Votre site actuel repensé : plus clair, plus rapide, plus proche de ce que vous faites vraiment.',
      icon: 'RefreshCw',
      image: { src: '/images/service-2.webp', alt: 'Composition graphique abstraite noir et blanc, image de démonstration' },
      bullets: ['Reprise des textes et photos existants', 'Mise à jour du contenu', 'Site plus rapide sur mobile'],
      description:
        'Un site vieillissant ou mal ficelé peut être repris intégralement, sans repartir de zéro sur le contenu que vous avez déjà réuni. Nous reprenons vos textes et vos photos utilisables, et reconstruisons le reste.\n\nLe résultat est un site plus rapide, plus lisible sur mobile, et à nouveau à jour sur les informations qui comptent : services, zone d’intervention, coordonnées.',
    },
    {
      slug: 'identite-visuelle',
      title: 'Signature e-mail et identité visuelle légère',
      short: 'Un logo simple, une signature e-mail et une palette de couleurs cohérente.',
      icon: 'PenTool',
      image: { src: '/images/service-3.webp', alt: 'Composition graphique abstraite noir et blanc, image de démonstration' },
      bullets: ['Logo simple', 'Signature e-mail', 'Palette de couleurs'],
      description:
        'Sans repartir sur une identité de marque complète, un logo simple, une signature e-mail soignée et une palette de couleurs cohérente suffisent souvent à donner une image professionnelle.\n\nCette prestation peut accompagner la création d’un site ou être commandée seule, pour qui a déjà un site mais pas encore d’identité visuelle claire.',
    },
    {
      slug: 'visibilite-locale',
      title: 'Fiche Google et visibilité locale',
      short: 'Votre fiche Google tenue à jour, pour apparaître quand on vous cherche.',
      icon: 'MapPin',
      image: { src: '/images/service-4.webp', alt: 'Composition graphique abstraite noir et blanc, image de démonstration' },
      bullets: ['Création ou correction de la fiche', 'Horaires, photos, catégorie à jour', 'Cohérence avec le site'],
      description:
        'Une fiche Google complète et à jour — horaires, photos, catégorie d’activité, zone d’intervention — change ce qui apparaît quand un client potentiel cherche votre métier dans votre ville.\n\nNous mettons en place ou corrigeons votre fiche, en cohérence avec les informations de votre site.',
    },
  ],

  about: {
    title: 'Le studio',
    story:
      'Finck & Fisch est un studio à deux : l’une rencontre les clients, prend le brief, écrit les textes ; l’autre construit les sites, avec un système qui mêle code et intelligence artificielle mis au point pour notre atelier — ce qui permet d’aller vite sans sacrifier le soin apporté à chaque détail.\n\nNous pensons qu’un artisan mérite un vrai site, pas un gabarit générique ni un abonnement mensuel qui s’ajoute à toutes les autres charges. Un prix, une livraison, et le site vous appartient.',
    values: [
      { title: 'Vous possédez tout', text: 'Le code, les textes, le nom de domaine : tout vous revient à la livraison, sans abonnement à reconduire.' },
      { title: 'Vite, mais pas pareil', text: 'Chaque site a sa propre direction, sa typographie et sa composition — aucun modèle recopié d’un client à l’autre.' },
      { title: 'Un seul interlocuteur', text: 'De l’appel initial à la mise en ligne, vous parlez toujours à la même personne.' },
    ],
  },

  process: [
    { title: 'Appel de 15 minutes', text: 'Un échange rapide pour comprendre votre activité et ce que le site doit accomplir.' },
    { title: 'Brief et photos', text: 'Vous nous transmettez vos informations, vos textes et vos photos, ou nous vous aidons à les réunir.' },
    { title: 'Production en 48–72 h', text: 'Le site est construit avec trois propositions de look différentes, pour choisir celle qui vous ressemble.' },
    { title: 'Mise en ligne et remise des clés', text: 'Le site est publié et tout vous est transmis : accès, code, nom de domaine.' },
  ],

  faq: [
    {
      q: 'Un abonnement à 30 ou 90 € par mois, ce n’est pas plus simple qu’un prix en une fois ?',
      a: 'Sur deux ou trois ans, un abonnement revient souvent plus cher qu’un tarif fixe payé une seule fois — et à la fin, vous ne possédez toujours rien. Chez nous, le site est à vous dès la mise en ligne, et il n’y a rien à surveiller ensuite.',
    },
    {
      q: 'Comment je sais que ça va bien référencer sur Google ?',
      a: 'Nous ne promettons pas une première place : personne ne peut la garantir légalement. Nous livrons un site techniquement propre — vitesse, structure, référencement local — et le reste se pilote dans la durée, avec ou sans nous.',
    },
    {
      q: 'Vous n’êtes que deux associés, c’est risqué si vous arrêtez ?',
      a: 'Le site est un fichier standard, hébergeable n’importe où, sans dépendance à une plateforme à nous. Contrairement à un site construit sur un abonnement, il continue d’exister même si vous ne nous recontactez jamais.',
    },
    {
      q: 'Pourquoi pas un outil comme Wix ou Hostinger, à quelques euros par mois ?',
      a: 'Ces outils vendent un logiciel, pas un résultat : il faut apprendre à s’en servir pour obtenir un site qui ressemble à des milliers d’autres. Nous livrons le résultat fini, dessiné pour votre activité, en 72 heures.',
    },
    {
      q: '72 heures, c’est trop rapide pour être vraiment sur mesure — c’est un modèle recyclé ?',
      a: 'C’est un système de composants que nous assemblons et adaptons à votre contenu, pas un thème universel — d’où trois directions visuelles différentes proposées dès le départ, pas une seule maquette.',
    },
    {
      q: 'Et si je veux changer quelque chose dans deux ans, il faut repasser par vous ?',
      a: 'Non. Le code vous appartient et n’est lié à aucun logiciel propriétaire : n’importe quel développeur peut le reprendre, y compris sans nous.',
    },
    {
      q: 'Vous garantissez quoi si je ne suis pas satisfait ?',
      a: 'Une garantie de délai, pas une promesse de résultat : livré sous 72 h après réception de vos éléments, ou remise de 10 % (engagement provisoire, à confirmer avant signature). Vous disposez ensuite de deux semaines pour les corrections.',
    },
    {
      q: 'Pourquoi pas une agence locale, au moins j’ai quelqu’un à voir en vrai ?',
      a: 'Nous pouvons échanger en visio ou nous déplacer, comme une agence locale — sans la structure de réunions et d’intermédiaires qui fait grimper le prix pour un site vitrine simple.',
    },
    {
      q: 'Faut-il fournir des photos ?',
      a: 'C’est préférable, mais pas obligatoire : nous pouvons composer une première version avec des visuels neutres, à remplacer dès que vos photos sont prêtes.',
    },
    {
      q: 'Que se passe-t-il avec le nom de domaine ?',
      a: 'Il est enregistré à votre nom dès le départ, ou transféré à votre nom si vous en avez déjà un — jamais au nom du studio.',
    },
  ],

  proof: {
    // Galerie de démonstration : aperçus des directions visuelles utilisées pour nos sites clients.
    gallery: [
      { src: '/images/galerie-1.webp', alt: 'Aperçu de la direction signal, utilisée pour un site de plomberie (démonstration)', caption: 'Direction signal — plomberie (démonstration)' },
      { src: '/images/galerie-2.webp', alt: 'Aperçu de la direction luxe, utilisée pour un site de salon de coiffure (démonstration)', caption: 'Direction luxe — salon de coiffure (démonstration)' },
      { src: '/images/galerie-3.webp', alt: 'Aperçu de la direction journal, utilisée pour un site d’architecture d’intérieur (démonstration)', caption: 'Direction journal — architecture d’intérieur (démonstration)' },
      { src: '/images/galerie-4.webp', alt: 'Aperçu de la direction brut, utilisée pour un site d’électricien (démonstration)', caption: 'Direction brut — électricité (démonstration)' },
      { src: '/images/galerie-5.webp', alt: 'Aperçu de la direction terre, utilisée pour un site de paysagiste (démonstration)', caption: 'Direction terre — paysagisme (démonstration)' },
      { src: '/images/galerie-6.webp', alt: 'Aperçu de la direction clair, utilisée pour un site de boulangerie (démonstration)', caption: 'Direction clair — boulangerie (démonstration)' },
    ],
  },

  social: {},

  form: { provider: 'mailto' },

  wording: {
    devis: 'Parler de votre projet',
    ctaTitle: 'Un site, un prix, <em>vos clés.</em>',
    ctaText: 'Un appel de quinze minutes suffit pour savoir si nous pouvons vous aider.',
    contactTitle: 'Parlons de votre projet',
    contactText: 'Décrivez votre activité en deux lignes, nous vous rappelons.',
  },

  images: {
    hero: { src: '/images/hero.webp', alt: 'Composition graphique abstraite noir et blanc, image de démonstration' },
  },

  seo: {
    keywords: ['création site vitrine artisan', 'site internet artisan pas cher sans abonnement', 'site web indépendant'],
  },

  legal: { owner: 'Finck & Fisch' },
});
