// DEMO : client inventé
/**
 * Ampère & Fils — électricien à Villeurbanne, entreprise familiale (père et fille) depuis 2001.
 * Mandat de design : « précision technique, chaleur discrète » — esprit schéma électrique en
 * lumière, jamais atelier sombre ni signalétique de chantier. Direction "clair" (blanc, Manrope/DM
 * Sans, arrondis doux) : jamais utilisée par un site dessiné à la main (le composer proposerait
 * "signal" — Archivo Black, gros numéro d'urgence — écarté par consigne explicite du mandat, qui
 * exclut aussi "brut" et "industriel"). Accent surchargé en bleu profond (proche de #1f3a93,
 * couleur des placeholders générés) à la place du bleu franc par défaut de "clair" (hsl 220 85% 54%)
 * : plus proche d'un bleu de plan électrique que d'un bleu SaaS. Nav et hero sur mesure, quatre
 * blocs sur mesure (sites/ampere-fils/sections/) : TableauElectrique (grille de disjoncteurs
 * retournables, data-flip-card), BorneRecharge (puissances 7/11/22 kW en data-count-bar), Normes
 * (NF C 15-100 / Qualifelec / IRVE en data-sticky-stack), Contact (panneau data-spotlight). Le
 * quadrillage "papier millimétré" du mandat est posé par bloc (dans chaque section sur mesure, via
 * color-mix() sur les tokens --line/--accent) plutôt que sur <body> : les directions et le layout
 * partagé (src/) ne sont pas modifiés pour ce site (consigne explicite de la tâche), donc pas de
 * texture globale possible sans y toucher — écart documenté ici plutôt que silencieux.
 * `ff placeholders`/`ff images --depuis-public` exécutés (logo.svg/favicon.svg utilisés,
 * sites/ampere-fils/public/images/*.webp + images.json générés) mais `images: {}` : comme
 * sites/dubois-plomberie, aucune photo n'habille ce site — le mandat est un vocabulaire de
 * schémas/diagrammes (câblage, disjoncteurs, courbes), une photo abstraite de substitution
 * y aurait fait doublon plutôt que du sens ; les fichiers générés restent disponibles si de
 * vraies photos client arrivent un jour.
 *
 * Squelette (21 sept 2026) : coquille `split` — panneau fixe à gauche (enseigne, sommaire actif
 * numéroté, horaires, téléphone), contenu qui défile à droite. Un électricien vend un numéro
 * toujours visible et un sommaire court (tableau électrique, bornes, engagements, zones, contact) :
 * le panneau le porte en permanence sur desktop, la nav sur mesure ne sert plus qu'en mobile.
 * Aucun effet riche (marquee/frames/shader/horizontal/drag-grid) sur ce site avant comme après ce
 * changement — rien à retirer côté motion.
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'ampere-fils',
  direction: 'clair',
  motion: 'rich',
  // Bleu profond façon schéma électrique (proche de #1f3a93) plutôt que le bleu franc par défaut de "clair".
  accent: { h: 226, s: 65, l: 35 },
  scale: 'compact',

  layout: {
    shell: 'split',
    nav: 'custom/nav',
    hero: 'custom/hero',
    sections: [
      { type: 'custom', variant: 'TableauElectrique', label: 'Services' },
      { type: 'custom', variant: 'BorneRecharge', label: 'Bornes de recharge' },
      { type: 'about', variant: 'story' },
      { type: 'custom', variant: 'Normes', label: 'Engagements' },
      { type: 'zones', variant: 'chips' },
      { type: 'faq', variant: 'accordion' },
      { type: 'custom', variant: 'Contact', label: 'Contact' },
    ],
    footer: 'columns',
    divider: 'none',
    tone: 'alternate',
  },

  business: {
    name: 'Ampère & Fils',
    trade: 'Électricien',
    tagline: 'Électricien à Villeurbanne, <em>père et fille depuis 2001.</em>',
    description:
      'Ampère & Fils est une entreprise familiale d’électricité à Villeurbanne. Le père a fondé l’atelier en 2001, sa fille a repris le tableau à ses côtés — même exigence, deux générations.\n\nMise aux normes NF C 15-100, dépannage, bornes de recharge IRVE et domotique KNX, pour les particuliers et les professionnels de l’agglomération lyonnaise.',
    since: 2001,
    certifications: ['Qualifelec', 'IRVE'],
  },

  contact: {
    phone: '+33639986630',
    phoneDisplay: '06 39 98 66 30',
    email: 'contact@exemple.fr',
    address: { street: '41 rue Francis-de-Pressensé', postalCode: '69100', city: 'Villeurbanne' },
    mapsUrl: 'https://maps.google.com/?q=41+rue+Francis-de-Pressensé+69100+Villeurbanne',
    mapsProvider: 'osm',
    coordinates: { lat: 45.7647, lng: 4.894 },
    hours: [{ days: 'Lundi – vendredi', hours: '8h – 18h' }],
    emergency24h: false,
  },

  zones: { cities: ['Villeurbanne', 'Lyon 3e', 'Lyon 6e', 'Vaulx-en-Velin', 'Bron', 'Caluire'], label: 'Villeurbanne et périphérie' },

  services: [
    {
      slug: 'mise-aux-normes',
      title: 'Mise aux normes NF C 15-100',
      short: 'Tableau électrique vérifié et remis en conformité, pièce par pièce.',
      description:
        'Un tableau électrique vieillit mal : fils qui se détendent, disjoncteurs qui ne protègent plus rien. La mise aux normes commence par un diagnostic complet du tableau et du circuit, puis une remise en conformité avec la norme NF C 15-100.\n\nUn rapport détaillé est remis à la fin de l’intervention, avec ce qui a été vérifié et ce qui a été changé.',
      bullets: ['Diagnostic complet du tableau', 'Mise en conformité NF C 15-100', 'Rapport détaillé remis au client'],
      icon: 'ShieldCheck',
      featured: true,
    },
    {
      slug: 'depannage',
      title: 'Dépannage électrique',
      short: 'Panne, disjonction, court-circuit : intervention sous 24 h.',
      description:
        'Un disjoncteur qui saute sans raison, une prise qui ne répond plus, un court-circuit : on cherche la vraie cause, pas juste le fusible à remettre.\n\nDevis communiqué avant toute intervention facturée.',
      bullets: ['Recherche de panne', 'Intervention sous 24 h', 'Devis avant travaux'],
      icon: 'Zap',
      featured: true,
    },
    {
      slug: 'bornes-recharge',
      title: 'Bornes de recharge (IRVE)',
      short: 'Installation de borne 7, 11 ou 22 kW, maison ou copropriété.',
      description:
        'La pose d’une borne de recharge pour véhicule électrique demande une qualification IRVE, obligatoire dès 3,7 kW. Ampère & Fils étudie la puissance disponible sur votre installation avant de proposer la borne adaptée.\n\nCompatible avec la plupart des marques de véhicules et de bornes.',
      bullets: ['Qualification IRVE', 'Étude de la puissance disponible', 'Copropriété ou maison individuelle'],
      icon: 'BatteryCharging',
      featured: true,
    },
    {
      slug: 'domotique-knx',
      title: 'Domotique KNX',
      short: 'Éclairage, volets et chauffage pilotés depuis un seul système.',
      description:
        'KNX est un protocole standard, pas une marque propriétaire : ce qui est installé aujourd’hui reste compatible avec ce qui s’ajoutera demain.\n\nProgrammation sur mesure, pièce par pièce, en partant des usages réels du logement plutôt que d’un catalogue de scénarios.',
      bullets: ['Protocole KNX standard', 'Programmation sur mesure', 'Installation évolutive'],
      icon: 'Cpu',
    },
    {
      slug: 'renovation-electrique',
      title: 'Rénovation électrique',
      short: 'Remise à neuf complète d’une installation vieillissante.',
      bullets: ['Tableau, câblage, prises', 'Logement occupé ou vide', 'Coordination avec les autres corps de métier'],
      icon: 'Home',
    },
    {
      slug: 'eclairage-prises',
      title: 'Éclairage et prises',
      short: 'Ajout de points lumineux, prises et interrupteurs.',
      bullets: ['Extension de circuit', 'Éclairage extérieur', 'Finitions soignées'],
      icon: 'Lightbulb',
    },
  ],

  about: {
    title: 'L’atelier',
    story:
      'Le père a fondé Ampère & Fils en 2001, seul, avec une camionnette et un carnet d’adresses à Villeurbanne. Sa fille l’a rejoint après son BTS électrotechnique et sa qualification Qualifelec — elle s’occupe aujourd’hui des bornes de recharge et de la domotique, deux métiers qui n’existaient pas encore en 2001.\n\nDeux électriciens, un seul numéro : celui qui décroche est celui qui vient.',
    values: [
      { title: 'NF C 15-100', text: 'La norme électrique française, vérifiée et appliquée sur chaque tableau, ancien ou neuf.' },
      { title: 'Qualifelec', text: 'La qualification reconnue de la profession, vérifiée chaque année.' },
      { title: 'IRVE', text: 'Qualifiés pour l’installation de bornes de recharge, obligatoire dès 3,7 kW.' },
    ],
  },

  process: [
    { title: 'Diagnostic', text: 'Le tableau et l’installation sont vérifiés sur place avant tout devis.' },
    { title: 'Devis', text: 'Un prix clair, détaillé, remis avant le début des travaux.' },
    { title: 'Intervention', text: 'Les travaux sont réalisés par la même personne qui a établi le devis.' },
    { title: 'Rapport', text: 'Ce qui a été vérifié et changé est consigné et remis au client.' },
  ],

  faq: [
    { q: 'Intervenez-vous la nuit ou le week-end ?', a: 'Non : nos horaires sont du lundi au vendredi, 8h – 18h. En cas de panne, nous nous engageons à intervenir sous 24 h.' },
    { q: 'La mise aux normes est-elle obligatoire ?', a: 'Elle est fortement recommandée dès qu’un tableau électrique date de plus de 15-20 ans, et obligatoire en cas de vente ou de gros travaux. Un diagnostic sur place permet de savoir précisément ce qui doit être fait.' },
    { q: 'Quelle puissance de borne choisir pour mon véhicule ?', a: 'Cela dépend du véhicule et de la puissance disponible sur votre installation. Nous faisons l’étude avant de proposer une puissance de 7, 11 ou 22 kW.' },
    { q: 'Le devis est-il gratuit ?', a: 'Oui, le diagnostic et le devis sont gratuits et sans engagement, à Villeurbanne et dans les communes voisines.' },
  ],

  form: { provider: 'mailto' },

  wording: {
    devis: 'Décrire votre projet',
    ctaTitle: 'Un tableau à refaire, une borne à poser&nbsp;? <em>On chiffre sous 48 h.</em>',
    contactTitle: 'Décrire votre projet',
  },

  images: {},
  seo: { keywords: ['électricien Villeurbanne', 'mise aux normes NF C 15-100', 'borne de recharge IRVE Villeurbanne', 'domotique KNX Lyon'] },
  legal: { owner: 'Ampère & Fils' },
});
