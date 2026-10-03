/**
 * Demo Finck & Fisch : Maison Aurel — coiffeur-coloriste a Bordeaux (Chartrons).
 * Site fictif de demonstration. Donnees marquees DEMO : fictives, jamais utilisees pour un vrai client.
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'demo-coiffure',
  direction: 'luxe',
  motion: 'rich',
  layout: {
    nav: 'minimal',
    hero: 'fullbleed',
    sections: [
      { type: 'services', variant: 'bento' },
      { type: 'about', variant: 'portrait' },
      { type: 'proof', variant: 'gallery' },
      { type: 'process', variant: 'steps' },
      { type: 'cta', variant: 'card' },
      { type: 'contact', variant: 'form-card' },
    ],
    footer: 'big-name',
  },

  business: {
    name: 'Maison Aurel',
    trade: 'Coiffeur-coloriste',
    tagline: 'La couleur prend le temps qu’il faut. <em>Ici, on le lui donne.</em>',
    description:
      'Maison Aurel est un salon de coiffure et de coloration dans les Chartrons, à Bordeaux. Coupe, coloration végétale et chimique, balayage : chaque rendez-vous commence par une vraie conversation, pas un catalogue.\n\nSur rendez-vous uniquement, pour garder le temps que demande un bon travail de couleur.',
    since: 2017,
    legalForm: 'SASU',
  },

  contact: {
    phone: '+33639982032',
    phoneDisplay: '06 39 98 20 32',
    email: 'contact@exemple.fr',
    address: { street: '22 rue Notre-Dame', postalCode: '33000', city: 'Bordeaux' },
    mapsUrl: 'https://maps.google.com/?q=22+rue+Notre-Dame+Bordeaux',
    hours: [
      { days: 'Mardi – vendredi', hours: '10 h – 19 h' },
      { days: 'Samedi', hours: '9 h – 17 h' },
      { days: 'Dimanche – lundi', hours: 'Fermé' },
    ],
    emergency24h: false,
  },

  zones: { cities: [], label: 'Chartrons, Bordeaux' },

  services: [
    {
      slug: 'coupe',
      title: 'Coupe',
      short: 'Coupe femme, homme, enfant : un diagnostic avant chaque ciseau.',
      icon: 'Scissors',
      featured: true,
      image: { src: '/images/service-1.webp', alt: 'Coupe de cheveux au salon Maison Aurel' },
      bullets: ['Diagnostic cheveux et visage', 'Coiffage compris', 'Conseils d’entretien au quotidien'],
      description:
        'Une coupe commence toujours par une discussion : ce que vous voulez garder, ce que vous voulez changer, ce que vos cheveux permettent réellement.\n\nLe coiffage fait partie du rendez-vous, pour repartir avec une coupe qui se tient sans y passer vingt minutes chaque matin.',
    },
    {
      slug: 'coloration',
      title: 'Coloration',
      short: 'Coloration végétale ou chimique, formulée pour votre couleur de base.',
      icon: 'Palette',
      featured: true,
      image: { src: '/images/service-2.webp', alt: 'Application d’une coloration en salon' },
      bullets: ['Formulation sur mesure', 'Option coloration végétale', 'Retouche racines possible entre deux visites'],
      description:
        'Chaque couleur est formulée pour la base de cheveux qui se présente, pas reproduite d’une photo. On propose aussi la coloration végétale pour celles qui veulent s’éloigner des produits chimiques.\n\nLe résultat est discuté avant de commencer, avec des exemples concrets plutôt que des promesses.',
    },
    {
      slug: 'balayage',
      title: 'Balayage et mèches',
      short: 'Balayage main levée pour un dégradé naturel, sans démarcation.',
      icon: 'Sparkles',
      image: { src: '/images/service-3.webp', alt: 'Balayage main levée réalisé au salon' },
      bullets: ['Technique main levée', 'Éclaircissement progressif', 'Soin post-décoloration inclus'],
      description:
        'Le balayage est fait à main levée, mèche par mèche, pour un résultat qui pousse sans démarcation nette. La technique et le nombre de mèches s’adaptent à la longueur et à la densité de vos cheveux.\n\nUn soin réparateur est systématiquement appliqué après toute décoloration.',
    },
    {
      slug: 'soin',
      title: 'Soin capillaire',
      short: 'Rituel de soin ciblé pour des cheveux fragilisés ou secs.',
      icon: 'Droplets',
      image: { src: '/images/service-4.webp', alt: 'Soin capillaire en cabine' },
      bullets: ['Diagnostic du cuir chevelu', 'Massage et soin en cabine', 'Protocole à poursuivre à la maison'],
      description:
        'Avant une couleur ou simplement pour réparer des cheveux fatigués, le soin capillaire cible ce dont vos cheveux ont besoin : hydratation, réparation de la fibre, ou apaisement du cuir chevelu.\n\nVous repartez avec un protocole simple à suivre entre deux visites.',
    },
  ],

  about: {
    title: 'Le salon',
    story:
      'Aurel Mercier a ouvert son salon en 2017 après dix ans passés dans des maisons de coiffure parisiennes, spécialisé en coloration. L’idée : ramener ce savoir-faire à Bordeaux, dans un salon à taille humaine.\n\nAujourd’hui l’équipe compte trois personnes, chacune avec sa spécialité — coupe, couleur, soin — mais toujours un seul binôme par client du début à la fin du rendez-vous.',
    portrait: { src: '/images/portrait.webp', alt: 'Intérieur du salon Maison Aurel, quartier des Chartrons' },
    team: [
      { name: 'Aurel Mercier', role: 'Fondateur, coloriste' },
      { name: 'Inès Cabral', role: 'Coiffeuse, spécialiste coupe' },
      { name: 'Simon Retif', role: 'Coiffeur, spécialiste balayage' },
    ],
  },

  proof: {
    gallery: [
      { src: '/images/galerie-1.webp', alt: 'Intérieur du salon, espace coloration' },
      { src: '/images/galerie-2.webp', alt: 'Poste de coupe, salon Maison Aurel' },
      { src: '/images/galerie-3.webp', alt: 'Nuancier et produits de coloration' },
      { src: '/images/galerie-4.webp', alt: 'Espace d’accueil du salon' },
      { src: '/images/galerie-5.webp', alt: 'Bac à shampoing' },
      { src: '/images/galerie-6.webp', alt: 'Vitrine du salon rue Notre-Dame' },
    ],
  },

  process: [
    { title: 'Diagnostic', text: 'On observe vos cheveux et on écoute ce que vous voulez, sans a priori.' },
    { title: 'Formulation', text: 'La couleur ou la coupe est pensée pour votre base, pas pour une tendance.' },
    { title: 'Réalisation', text: 'Le rendez-vous prend le temps nécessaire, sans enchaîner les clients.' },
    { title: 'Suivi', text: 'Conseils d’entretien et, si besoin, retouche racines entre deux visites.' },
  ],

  social: { instagram: 'https://www.instagram.com/maisonaurel' },

  wording: {
    devis: 'Prendre rendez-vous',
    ctaTitle: 'Une envie de changement ? <em>Prenons rendez-vous.</em>',
    ctaText: 'Premier échange au salon ou par téléphone, sans engagement.',
    contactTitle: 'Prendre rendez-vous',
    contactText: 'Dites-nous ce que vous voulez, nous vous rappelons pour caler un créneau.',
  },
  form: { provider: 'web3forms', accessKey: 'A-REMPLACER', subject: 'Nouvelle demande — Maison Aurel' },
  images: {
    hero: { src: '/images/hero.webp', alt: 'Intérieur du salon Maison Aurel, quartier des Chartrons' },
  },
  seo: { keywords: ['coiffeur Bordeaux', 'coloriste Chartrons', 'balayage Bordeaux', 'salon coiffure Chartrons'] },
  legal: { owner: 'Aurel Mercier' },
});
