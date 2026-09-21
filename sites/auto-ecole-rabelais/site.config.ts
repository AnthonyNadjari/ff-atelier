// DEMO : client inventé
/**
 * Auto-école Rabelais — Tours, quartier Velpeau, depuis 2005.
 * Site sur mesure : hero + 3 sections propres au client (Parcours, Forfaits, Financement),
 * direction "clair" (SaaS propre, lumineux) avec un accent bleu marine fort qui remplace le
 * bleu franc par défaut de la direction — jeune, net, rassurant, sans jamais verser dans
 * l'urgence ou le brutalisme (metiers a eviter par "clair", cf. src/directions/clair/meta.ts).
 * Concept : la route et la progression — voir sections/Hero.astro (route dessinee en SVG,
 * data-draw-svg, point-voiture en CSS), sections/Parcours.astro (les 4 etapes du permis, data-stack),
 * sections/Forfaits.astro (tarifs indicatifs), sections/Financement.astro (CPF / permis a 1 e / 3x,
 * data-flip-card). Aucune donnee inventee : chiffres, prix et labels viennent du brief (voir
 * commentaires dans sections/) ; les prenoms/noms de l'equipe pedagogique sont un exemple de
 * demonstration (site fictif), comme le reste du contenu de ce fichier.
 *
 * Squelette (21 sept 2026) : le parcours de l'élève passe de la section sur mesure `Parcours`
 * (cartes qui s'épinglent, data-stack) à la variante partagée `process/horizon` (chapitre épinglé
 * qui défile horizontalement, une étape par écran, même quatre étapes : Inscription, Code,
 * Conduite, Examen) — jamais les deux à la fois, `Parcours.astro` reste dans `sections/` mais sort
 * du layout. La ligne data-marquee du hero (les familles de formation) devient une ligne fixe
 * (comme barbier-kessler) : le chapitre horizontal du parcours est désormais le seul geste riche
 * de la page (CONVENTIONS.md règle 16).
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'auto-ecole-rabelais',
  direction: 'clair',
  motion: 'rich',
  // Bleu marine fort (#0f3d91) au lieu du bleu SaaS par defaut de "clair" : direction encore
  // inutilisee par aucun site a ce jour pour ce metier, choisie avec un accent qui la distingue
  // nettement des 4 autres sites "clair" de l'atelier (voir docs/OBJECTIF.md, journal du 17 sept).
  accent: { h: 219, s: 81, l: 31 },
  scale: 'normal',

  layout: {
    nav: 'bar',
    hero: 'custom/Hero',
    sections: [
      { type: 'services', variant: 'grid' },
      { type: 'process', variant: 'horizon' },
      { type: 'custom', variant: 'Forfaits', label: 'Tarifs' },
      { type: 'custom', variant: 'Financement', label: 'Financement' },
      { type: 'about', variant: 'story' },
      { type: 'faq', variant: 'accordion' },
      { type: 'cta', variant: 'band' },
      { type: 'contact', variant: 'form-split' },
    ],
    footer: 'columns',
  },

  business: {
    name: 'Auto-école Rabelais',
    trade: 'Auto-école',
    tagline: 'Le permis à Tours, quartier Velpeau, <em>à votre rythme.</em>',
    description:
      'Auto-école à Tours, quartier Velpeau, depuis 2005 : permis B (boîte manuelle ou automatique), conduite accompagnée, code et permis moto A2.\n\nCinq enseignants de la conduite suivent chaque élève du premier cours jusqu’à l’examen, avec un planning adapté à son emploi du temps.',
    since: 2005,
    certifications: ['Qualiopi'],
    schemaType: 'EducationalOrganization',
  },

  contact: {
    phone: '+33639984790',
    phoneDisplay: '06 39 98 47 90',
    email: 'contact@exemple.fr',
    address: { street: '27 rue de la Fuye', postalCode: '37000', city: 'Tours' },
    mapsUrl: 'https://maps.google.com/?q=27+rue+de+la+Fuye+37000+Tours',
    hours: [
      { days: 'Lundi – vendredi', hours: '9h – 12h, 14h – 19h' },
      { days: 'Samedi', hours: '9h – 12h' },
    ],
    emergency24h: false,
  },

  services: [
    {
      slug: 'permis-b-manuelle',
      title: 'Permis B — boîte manuelle',
      short: 'La conduite classique, embrayage compris, pour un permis polyvalent.',
      description:
        'Le permis B en boîte manuelle reste le choix le plus polyvalent : il permet de conduire aussi bien un véhicule à boîte manuelle qu’automatique.\n\nLe forfait de base comprend 20 heures de conduite, ajustables selon le rythme de progression de chaque élève.',
      bullets: ['Évaluation de départ', 'Rythme adapté à chaque élève', 'Code inclus dans le forfait'],
      icon: 'Car',
      featured: true,
    },
    {
      slug: 'permis-b-automatique',
      title: 'Permis B — boîte automatique',
      short: 'Un apprentissage plus direct, pour la ville comme pour la route.',
      bullets: ['Idéal pour une reprise de conduite', 'Passage possible vers la boîte manuelle ensuite'],
      icon: 'Car',
      featured: true,
    },
    {
      slug: 'conduite-accompagnee',
      title: 'Conduite accompagnée (AAC)',
      short: 'Dès 15 ans, avec un accompagnateur, pour arriver plus sereinement à l’examen.',
      bullets: ['Rendez-vous préalable en trois temps', 'Suivi du carnet de route'],
      icon: 'Users',
    },
    {
      slug: 'code-de-la-route',
      title: 'Code de la route',
      short: 'Entraînement en ligne illimité et séances en salle avec un enseignant.',
      bullets: ['Accès en ligne', 'Séances en salle', 'Stage accéléré possible'],
      icon: 'BookOpen',
      priceFrom: 'à partir de 30 €',
    },
    {
      slug: 'permis-moto-a2',
      title: 'Permis moto A2',
      short: 'Code moto, plateau et circulation, pour les deux ou trois-roues.',
      bullets: ['Plateau et circulation', 'Équipement de protection fourni pour les leçons'],
      icon: 'Bike',
    },
    {
      slug: 'stage-code-accelere',
      title: 'Stage de code accéléré',
      short: 'Une formule intensive pour réviser le code sur un temps court.',
      bullets: ['Petit groupe', 'Révision intensive avant l’examen'],
      icon: 'Zap',
    },
  ],

  about: {
    story:
      'Auto-école Rabelais forme des conducteurs dans le quartier Velpeau à Tours depuis 2005 — un premier permis comme une reprise de conduite après plusieurs années sans repasser derrière un volant.\n\nCinq enseignants de la conduite se répartissent les leçons de code et de conduite, en boîte manuelle, automatique et sur moto. Chacun garde le même élève du premier cours jusqu’à l’examen.\n\nL’auto-école est certifiée Qualiopi, la marque qui atteste de la qualité du processus de formation.',
    team: [
      { name: 'Camille Rouault', role: 'Enseignante de la conduite — permis B, boîte manuelle' },
      { name: 'Thomas Guérin', role: 'Enseignant de la conduite — permis B, boîte automatique' },
      { name: 'Nadia Ferreira', role: 'Enseignante de la conduite — conduite accompagnée (AAC)' },
      { name: 'Karim Belaïd', role: 'Enseignant de la conduite — permis moto A2' },
      { name: 'Julien Perrot', role: 'Formateur code de la route — responsable pédagogique' },
    ],
  },

  // Le parcours de l'élève (process/horizon) : mêmes quatre étapes que sections/Parcours.astro
  // (hors layout désormais), même texte, aucune donnée nouvelle.
  process: [
    { title: 'Inscription', text: 'Dossier, numéro NEPH (ANTS), pièce d’identité, ASSR/ASR ou attestation de recensement, justificatif de domicile.' },
    { title: 'Code', text: 'Entraînement en ligne illimité et séances en salle avec un enseignant, jusqu’à l’examen théorique.' },
    { title: 'Conduite', text: 'Le forfait de conduite, en boîte manuelle ou automatique, ajustable selon la progression de chaque élève.' },
    { title: 'Examen', text: 'Présentation organisée par l’auto-école ; la date est fixée par la préfecture.' },
  ],

  faq: [
    {
      q: 'Quel est le taux de réussite à l’examen ?',
      a: 'Taux de réussite communiqué sur demande (chiffres officiels de la préfecture).',
    },
    {
      q: 'Peut-on commencer le code avant la conduite ?',
      a: 'Oui : le code en ligne est accessible dès l’inscription, en complément des séances en salle. La plupart des élèves passent le code avant de commencer les heures de conduite.',
    },
    {
      q: 'La conduite accompagnée (AAC) est-elle possible dès 15 ans ?',
      a: 'Oui, l’AAC est ouverte dès 15 ans, avec un accompagnateur désigné et un rendez-vous préalable à l’auto-école.',
    },
    {
      q: 'Le forfait de 20 heures suffit-il toujours ?',
      a: 'Le forfait B de 20 heures correspond à la durée réglementaire de référence. Le nombre d’heures réellement nécessaire dépend de chaque élève ; les heures supplémentaires sont facturées à l’heure.',
    },
  ],

  form: {
    provider: 'mailto',
    successMessage: 'Merci, votre demande d’inscription est bien reçue — nous revenons vers vous pour convenir d’un premier rendez-vous.',
  },

  images: {
    hero: { src: '/images/hero.webp', alt: 'Composition abstraite bleu marine et jaune, thème de la route' },
  },

  wording: {
    devis: 'S’inscrire ou poser une question',
    ctaTitle: 'Le permis, à votre rythme. <em>On commence quand vous voulez.</em>',
    ctaText: 'Inscriptions toute l’année, à l’auto-école du quartier Velpeau, à Tours.',
    contactTitle: 'S’inscrire',
  },

  seo: {
    keywords: ['auto-école Tours', 'permis Tours Velpeau', 'code de la route Tours', 'permis moto A2 Tours'],
  },

  legal: { owner: 'Julien Perrot' },
});
