/**
 * Demo Finck & Fisch : Pixel Depannage — depannage informatique et reseau a Toulouse.
 * Site fictif de demonstration. Donnees marquees DEMO : fictives, jamais utilisees pour un vrai client.
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'demo-informatique',
  direction: 'neon',
  motion: 'rich',
  accent: { h: 190, s: 95, l: 55 },
  // Architecture « appareils-pannes » (docs/veille/architectures/appareils-pannes.md) : l'accueil part de l'appareil en
  // panne, un onglet par famille, chaque panne vers son ancre sur la page de l'appareil. Premier écran : famille
  // `typographique` (rendu par la coquille `appareils`).
  layout: {
    architecture: 'appareils-pannes',
    sections: [{ type: 'custom', variant: 'Etabli' }],
    pageAPropos: true,
  },

  business: {
    name: 'Pixel Dépannage',
    trade: 'Dépannage informatique et réseau',
    tagline: 'Un ordinateur qui bloque, un réseau qui rame\u202f?',
    description:
      'Pixel Dépannage intervient à Toulouse pour les particuliers et les petites entreprises : dépannage d’ordinateur, installation de réseau, sécurisation et sauvegarde de données.\n\nIntervention à domicile, en atelier ou à distance selon la nature du problème.',
    since: 2018,
    legalForm: 'EI',
    certifications: [],
  },

  contact: {
    phone: '+33639986076',
    phoneDisplay: '06 39 98 60 76',
    email: 'contact@exemple.fr',
    address: { street: '31 rue du Taur', postalCode: '31000', city: 'Toulouse' },
    mapsUrl: 'https://maps.google.com/?q=31+rue+du+Taur+Toulouse',
    hours: [
      { days: 'Lundi – vendredi', hours: '9 h – 19 h' },
      { days: 'Samedi', hours: '10 h – 16 h' },
    ],
    emergency24h: false,
  },

  zones: {
    cities: ['Toulouse', 'Blagnac', 'Colomiers', 'Tournefeuille', 'Balma', 'Muret', 'L’Union'],
    label: 'Toulouse et agglomération',
  },

  services: [
    {
      slug: 'depannage-ordinateur',
      title: 'Dépannage ordinateur et Mac',
      short: 'Lenteur, écran bleu, panne matérielle : diagnostic et réparation.',
      icon: 'Monitor',
      featured: true,
      priceFrom: 'à partir de 39 €',
      image: {
        src: '/images/galerie-3.webp',
        alt: 'Unité centrale ouverte : carte mère, câbles et ventilateur',
      },
      bullets: [
        'Diagnostic gratuit si réparation acceptée',
        'PC et Mac',
        'Remplacement de pièces si nécessaire',
      ],
      description: 'Un ordinateur lent, un écran bleu récurrent, une panne matérielle : le diagnostic permet d’identifier si le problème vient du logiciel, du disque, ou d’un composant à remplacer.\n\nLe devis est communiqué avant toute réparation payante.',
    },
    {
      slug: 'reseau-wifi',
      title: 'Réseau et Wifi',
      short: 'Installation et optimisation de réseau domestique ou de petit bureau.',
      icon: 'Router',
      featured: true,
      image: {
        src: '/images/galerie-4.webp',
        alt: 'Câbles réseau branchés sur un switch Ethernet',
      },
      bullets: [
        'Installation de box, routeur, répéteurs',
        'Réseau filaire pour les zones mal couvertes',
        'Configuration Wifi sécurisée',
      ],
      description: 'Un Wifi qui ne couvre pas toute la maison, un réseau de bureau mal configuré : on installe et on règle box, répéteurs ou réseau filaire pour une couverture stable.',
    },
    {
      slug: 'securite',
      title: 'Sécurité et antivirus',
      short: 'Suppression de virus, configuration d’un antivirus, sécurisation des accès.',
      icon: 'Shield',
      priceFrom: 'à partir de 49 €',
      image: {
        src: '/images/service-securite.webp',
        alt: 'Clavier d’ordinateur posé sur un bureau en bois',
      },
      bullets: [
        'Suppression de virus et logiciels malveillants',
        'Installation et configuration d’antivirus',
        'Sécurisation des mots de passe et accès',
      ],
      description: 'Un ordinateur infecté demande souvent plus qu’un simple scan antivirus : nettoyage complet, vérification des programmes installés, puis mise en place d’une protection durable.',
    },
    {
      slug: 'sauvegarde',
      title: 'Sauvegarde de données',
      short: 'Mise en place d’une sauvegarde automatique, locale ou dans le cloud.',
      icon: 'HardDrive',
      image: {
        src: '/images/service-sauvegarde.webp',
        alt: 'Toshiba 1 TB External USB Hard Drive',
      },
      bullets: [
        'Sauvegarde automatique programmée',
        'Disque externe ou cloud',
        'Récupération de données après panne',
      ],
      description: 'Perdre ses photos ou ses documents à cause d’un disque dur qui lâche arrive plus souvent qu’on ne le pense. Une sauvegarde automatique, locale ou dans le cloud, évite ce risque.\n\nEn cas de panne déjà survenue, une tentative de récupération de données est proposée avant tout remplacement de disque.',
    },
    {
      slug: 'intervention-express',
      title: 'Intervention express à domicile',
      short: 'Déplacement rapide à Toulouse pour les pannes bloquantes.',
      icon: 'Zap',
      bullets: [
        'Créneau sous 24 h en semaine',
        'Diagnostic sur place',
        'Intervention à distance possible ensuite',
      ],
      description: 'Pour une panne qui bloque le travail ou les études, un déplacement rapide est possible dans Toulouse et proche agglomération, avec un créneau généralement sous 24 h en semaine.',
    },
  ],

  about: {
    title: 'L’activité',
    story:
      'Pixel Dépannage est né en 2018, quand Léo Fabre a quitté un poste de technicien réseau en entreprise pour se mettre à son compte. L’idée : proposer aux particuliers et petites structures le même niveau de service qu’en entreprise.\n\nAujourd’hui il intervient seul, à domicile, en atelier ou à distance selon ce que la panne exige.',
    values: [
      { title: 'Diagnostic honnête', text: 'Si la réparation coûte plus cher qu’un remplacement, c’est dit clairement.' },
      { title: 'Données respectées', text: 'Aucune donnée personnelle n’est consultée au-delà de ce que la réparation exige.' },
      { title: 'Explications claires', text: 'Ce qui a été fait est expliqué, pas juste facturé.' },
    ],
  },
  proof: {
    gallery: [
      {
        src: '/images/galerie-1.webp',
        alt: 'Réparation d’un ordinateur portable, disques et outils sur la table',
      },
      {
        src: '/images/galerie-3.webp',
        alt: 'Unité centrale ouverte : carte mère, câbles et ventilateur',
      },
      {
        src: '/images/galerie-4.webp',
        alt: 'Câbles réseau branchés sur un switch Ethernet',
      },
      {
        src: '/images/galerie-5.webp',
        alt: 'Disque dur branché en USB à un ordinateur portable',
      },
    ],
  },

  // DEMO : appareils et pannes repris des services ci-dessus (mêmes mots), rien d'ajouté.
  appareils: {
    forfait: 'Diagnostic gratuit si la réparation est acceptée, devis communiqué avant toute réparation payante',
    garantie: 'Garantie de trois mois sur la main-d’œuvre, selon le fabricant sur les pièces remplacées',
    familles: [
      { nom: 'Ordinateurs', prix: 'à partir de 39 €', note: 'PC et Mac, à domicile, en atelier ou à distance.' },
      { nom: 'Réseau et Wifi', note: 'Box, routeur, répéteurs, réseau filaire, chez vous ou au bureau.' },
      { nom: 'Données', note: 'Disque dur, disque externe ou cloud.' },
    ],
    liste: [
      {
        slug: 'pc',
        nom: 'PC',
        famille: 'Ordinateurs',
        photo: { src: '/images/galerie-3.webp', alt: 'Unité centrale ouverte : carte mère, câbles et ventilateur' },
        pannes: [
          { nom: 'Ordinateur lent', causes: 'Logiciel, disque ou composant à remplacer : le diagnostic dit d’où vient le problème.' },
          { nom: 'Écran bleu à répétition', causes: 'Le diagnostic identifie si le problème vient du logiciel, du disque ou d’un composant.' },
          { nom: 'Panne matérielle', causes: 'Remplacement de pièces si nécessaire, devis avant réparation.' },
          { nom: 'Virus ou logiciel malveillant', causes: 'Nettoyage complet, vérification des programmes installés, puis protection durable (à partir de 49 €).' },
        ],
      },
      {
        slug: 'mac',
        nom: 'Mac',
        famille: 'Ordinateurs',
        photo: { src: '/images/hero.webp', alt: 'Ordinateur portable démonté sur l’établi, carte mère à nu' },
        pannes: [
          { nom: 'Mac lent', causes: 'Logiciel, disque ou composant à remplacer : le diagnostic dit d’où vient le problème.' },
          { nom: 'Panne matérielle', causes: 'Remplacement de pièces si nécessaire, devis avant réparation.' },
          { nom: 'Logiciel malveillant', causes: 'Nettoyage complet, vérification des programmes installés, puis protection durable (à partir de 49 €).' },
        ],
      },
      {
        slug: 'box-routeur-wifi',
        nom: 'Box, routeur et Wifi',
        famille: 'Réseau et Wifi',
        photo: { src: '/images/galerie-4.webp', alt: 'Câbles réseau branchés sur un switch Ethernet' },
        pannes: [
          { nom: 'Le Wifi ne couvre pas toute la maison', causes: 'Répéteurs ou réseau filaire pour les zones mal couvertes.' },
          { nom: 'Le réseau rame', causes: 'Box, répéteurs ou réseau filaire réglés pour une couverture stable.' },
          { nom: 'Wifi mal sécurisé', causes: 'Configuration Wifi sécurisée, mots de passe et accès revus.' },
        ],
      },
      {
        slug: 'reseau-bureau',
        nom: 'Réseau de petit bureau',
        famille: 'Réseau et Wifi',
        pannes: [
          { nom: 'Réseau de bureau mal configuré', causes: 'Installation et réglage du réseau, configuration des postes.' },
          { nom: 'Postes à configurer', causes: 'Configuration de postes et maintenance ponctuelle.' },
        ],
      },
      {
        slug: 'disque-dur-sauvegarde',
        nom: 'Disque dur et sauvegarde',
        famille: 'Données',
        photo: { src: '/images/galerie-5.webp', alt: 'Disque dur branché en USB à un ordinateur portable' },
        pannes: [
          { nom: 'Le disque dur a lâché', causes: 'Une tentative de récupération de données est proposée avant tout remplacement de disque.' },
          { nom: 'Aucune sauvegarde de vos photos et documents', causes: 'Sauvegarde automatique programmée, sur disque externe ou dans le cloud.' },
        ],
      },
    ],
    etapes: [
      'Vous appelez ou écrivez en décrivant la panne',
      'Diagnostic à distance, en atelier ou chez vous selon la panne',
      'Devis communiqué avant toute réparation payante',
      'Ce qui a été fait est expliqué, pas juste facturé',
    ],
  },

  faq: [
    { q: 'Intervenez-vous à distance ?', a: 'Pour de nombreuses pannes logicielles, oui, avec votre accord et votre présence devant l’écran.' },
    { q: 'Mes données sont-elles en sécurité ?', a: 'Aucune donnée personnelle n’est consultée au-delà de ce que la réparation nécessite, et rien n’est conservé après l’intervention.' },
    { q: 'Proposez-vous une garantie sur les réparations ?', a: 'Oui, trois mois sur la main-d’œuvre et selon le fabricant sur les pièces remplacées.' },
    { q: 'Travaillez-vous avec les petites entreprises ?', a: 'Installation de réseau, configuration de postes et maintenance ponctuelle font partie des interventions courantes.' },
  ],

  social: { instagram: 'https://www.instagram.com/pixeldepannage', facebook: 'https://www.facebook.com/pixeldepannagetoulouse' },

  form: { provider: 'mailto' },
  images: {
    hero: {
      src: '/images/hero.webp',
      alt: 'Ordinateur portable démonté sur l’établi, carte mère à nu',
    },
    illustration: true,
  },
  seo: { keywords: ['dépannage informatique Toulouse', 'réparation ordinateur Toulouse', 'installation réseau Toulouse', 'technicien informatique Toulouse'] },
  legal: { owner: 'Léo Fabre' },
});
