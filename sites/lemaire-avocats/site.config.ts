// DEMO : client inventé
/**
 * Cabinet Lemaire Avocats — avocates à Montpellier (Maître Claire Lemaire, Maître Inès Dahmani),
 * depuis 2014. Droit du travail, droit de la famille, droit immobilier, droit des affaires (TPE).
 * Site sur mesure : nav + hero + cinq blocs custom (Domaines, Consultation, Honoraires, Avocates,
 * Contact). Voir sections/ pour le detail de chaque composition.
 *
 * Direction : `ff composer lemaire-avocats --metier "Avocat"` proposait "industriel" (beton/acier,
 * ecarte explicitement du mandat de conception a cause d'un probleme d'accent connu — voir
 * DIRECTIONS non utilisees listees dans le mandat). Choix retenu a la place : "nuit" (bleu nuit
 * calme, blanc chaud, Newsreader serif, accent ambre discret) — inutilisee par un site dessine a
 * la main, colle exactement au mandat (serieux, calme, lisible, jamais vendeur) et son accent ambre
 * par defaut (hsl(36 70% 58%)) est deja tres proche du placeholder demande (#c9b27c), donc aucune
 * surcharge `accent` necessaire. Police display (Newsreader, serif) gardee telle quelle : c'est
 * elle qui porte la longue phrase du hero (data-text-fill).
 *
 * motion: 'rich' (necessaire pour data-accordion="single" [GSAP Flip], data-tilt-glare,
 * data-blur-scrub, data-text-fill — tous utilises ci-dessous — et, depuis le 20 sept. 2026, pour
 * le fond data-shader="mesh" du hero : fond WebGL lent aux couleurs de la direction, seul feu
 * d'artifice de la page, voir sections/Hero.astro et docs/ANIMATIONS.md).
 *
 * Cinq effets ci-dessous verifies par grep comme les moins utilises du moteur avant ce tour
 * (`grep -rl data-<effet> sites/<slug>/sections/<Nom>.astro`, hors sites/_effets) : data-accordion (1 usage
 * avant ce tour, studio-ambre/Methode.astro), data-count-bar (1, studio-ambre/Methode.astro),
 * data-blur-scrub (1, studio-ambre/CaseStudy.astro), data-tilt-glare (1, maison-roux/Carte.astro) —
 * plus data-scroll-progress/data-spotlight/data-text-fill (3 chacun), tous largement sous
 * data-reveal (38) et data-stagger (31). Dépasse le minimum de cinq demandé.
 *
 * Régles CNB respectées (docs/veille/redaction-images.md §1.3-1.4) : mention "Avocats au Barreau de
 * Montpellier", aucune comparaison, aucune promesse de résultat, "spécialiste" jamais employé (aucune
 * des deux avocates ne détient de certificat de spécialisation dans ce brief), ton sobre partout,
 * convention d'honoraires citée (Consultation + Honoraires), médiateur de la consommation de la
 * profession d'avocat cité en legal.mediator. Section `proof` absente du layout : aucun avis inventé
 * (le brief n'en fournit pas, et un témoignage mis en avant comme argument commercial est de toute
 * façon déconseillé pour une profession réglementée — §1.3).
 *
 * Hero sans photo (option explicitement permise par le mandat : "no image or a dark abstract image
 * at low contrast") : aucune photo du cabinet n'est fournie par le brief, et générer une fausse photo
 * de bureau serait la pratique commerciale trompeuse documentée en §2.3 de la même veille — le ciel
 * étoilé très discret de la direction "nuit" (body::before, déjà dans le token système) donne toute
 * la texture nécessaire sans rien inventer.
 *
 * Squelette (21 sept 2026) : coquille `sidebar` — rail vertical fixe (monogramme, compteur de
 * position, sommaire actif) à gauche, contenu pleine largeur décalé. Les quatre domaines de
 * compétence (Domaines, Consultation, Honoraires, Avocates, zones, FAQ, CTA, Contact) deviennent le
 * sommaire du rail. Nav sur mesure gardée pour le mobile uniquement (le rail remplace la nav sur
 * desktop, comme documenté dans docs/CONVENTIONS.md § Coquilles) ; aucune section n'est retirée, le
 * hero garde son data-shader="mesh" et son data-text-fill (le rail ne restyle jamais une section).
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'lemaire-avocats',
  direction: 'nuit',
  motion: 'rich',
  scale: 'normal',

  layout: {
    nav: 'custom/nav',
    hero: 'custom/hero',
    sections: [
      { type: 'custom', variant: 'Domaines', label: 'Domaines' },
      { type: 'custom', variant: 'Consultation', label: 'La consultation' },
      { type: 'custom', variant: 'Honoraires', label: 'Honoraires' },
      { type: 'custom', variant: 'Avocates', label: 'Les avocates' },
      { type: 'zones', variant: 'chips' },
      { type: 'faq', variant: 'accordion' },
      { type: 'cta', variant: 'card' },
      { type: 'custom', variant: 'Contact', label: 'Contact' },
    ],
    footer: 'minimal',
    divider: 'none',
    tone: 'alternate',
    shell: 'sidebar',
  },

  business: {
    name: 'Cabinet Lemaire Avocats',
    trade: 'Avocat',
    // Pas de <em> ici (contrairement a la convention habituelle) : le hero applique data-text-fill
    // sur cette phrase, et motion.ts la reduit a `textContent` avant de la decouper mot par mot —
    // toute balise imbriquee (<em>) y serait detruite au montage JS (rich). Texte brut donc, l'accent
    // <em> du mandat est porte par wording.ctaTitle (rendu via set:html, jamais decoupe).
    tagline: 'Le droit du travail, de la famille, de l’immobilier et des TPE, expliqué clairement.',
    description:
      'Le cabinet Lemaire Avocats réunit deux avocates inscrites au Barreau de Montpellier, Maître Claire Lemaire et Maître Inès Dahmani. Depuis 2014, il accompagne particuliers et petites entreprises en droit du travail, droit de la famille, droit immobilier et droit des affaires.\n\nLes consultations se tiennent sur rendez-vous, au cabinet du 5 rue Foch à Montpellier. L’aide juridictionnelle est acceptée en droit de la famille.',
    since: 2014,
    schemaType: 'LegalService',
  },

  contact: {
    phone: '+33639988012',
    phoneDisplay: '06 39 98 80 12',
    email: 'contact@exemple.fr',
    address: { street: '5 rue Foch', postalCode: '34000', city: 'Montpellier' },
    mapsUrl: 'https://maps.google.com/?q=5+rue+Foch+34000+Montpellier',
    hours: [{ days: 'Lundi – vendredi', hours: '9h – 18h, sur rendez-vous' }],
    emergency24h: false,
  },

  zones: {
    cities: ['Montpellier', 'Castelnau-le-Lez', 'Lattes', 'Sète', 'Nîmes'],
    label: 'Montpellier et sa métropole',
  },

  services: [
    {
      slug: 'droit-travail',
      title: 'Droit du travail',
      short: 'Licenciement, rupture conventionnelle, litiges avec l’employeur.',
      description:
        'Salariés et employeurs nous consultent pour un licenciement contesté, une rupture conventionnelle à négocier, ou un différend qui s’aggrave.\n\nNous étudions le dossier, expliquons les options et, si besoin, vous représentons devant le conseil de prud’hommes.',
      bullets: ['Licenciement contesté', 'Rupture conventionnelle', 'Harcèlement ou discrimination au travail'],
      icon: 'Briefcase',
      featured: true,
    },
    {
      slug: 'droit-famille',
      title: 'Droit de la famille',
      short: 'Divorce, garde d’enfants, pension alimentaire, succession.',
      description:
        'Un divorce, une séparation, une question de garde ou une succession touchent à ce qu’il y a de plus personnel. Nous prenons le temps d’écouter la situation avant d’évoquer une procédure.\n\nL’aide juridictionnelle est acceptée pour les dossiers de droit de la famille qui y sont éligibles.',
      bullets: ['Divorce et séparation', 'Garde d’enfants et pension alimentaire', 'Succession et partage'],
      icon: 'Users',
      featured: true,
    },
    {
      slug: 'droit-immobilier',
      title: 'Droit immobilier',
      short: 'Baux, copropriété, litiges de voisinage, vente immobilière.',
      description:
        'Un bail contesté, un désaccord en copropriété, une vente qui se complique : le droit immobilier touche autant les particuliers que les petites entreprises propriétaires de leurs murs.\n\nNous intervenons en conseil comme en contentieux, à Montpellier et dans les communes voisines.',
      bullets: ['Litige de bail ou de copropriété', 'Vente ou achat immobilier', 'Conflit de voisinage'],
      icon: 'Home',
      featured: false,
    },
    {
      slug: 'droit-affaires',
      title: 'Droit des affaires',
      short: 'Conseil aux TPE : contrats, création d’entreprise, litiges commerciaux.',
      description:
        'Les petites entreprises ont rarement un juriste sur place. Nous intervenons en amont, sur un contrat ou une création de structure, comme en aval, lorsqu’un différend commercial survient.\n\nNous restons le même interlocuteur du conseil initial jusqu’à la résolution du litige.',
      bullets: ['Rédaction et relecture de contrats', 'Création ou cession d’entreprise', 'Litige commercial ou avec un fournisseur'],
      icon: 'Building2',
      featured: false,
    },
  ],

  about: {
    title: 'Les avocates',
    story:
      'Claire Lemaire et Inès Dahmani ont fondé le cabinet à Montpellier en 2014. Chacune suit ses dossiers du premier rendez-vous jusqu’à leur résolution, sans les transmettre à un confrère en cours de route.\n\nLe cabinet reçoit sur rendez-vous, du lundi au vendredi, au 5 rue Foch.',
    team: [
      { name: 'Maître Claire Lemaire', role: 'Avocate associée — Barreau de Montpellier depuis 2009' },
      { name: 'Maître Inès Dahmani', role: 'Avocate associée — Barreau de Montpellier depuis 2015' },
    ],
  },

  process: [
    { title: 'Prise de contact', text: 'Vous décrivez votre situation par téléphone ou via le formulaire. Nous fixons ensemble un premier rendez-vous.' },
    { title: 'Premier rendez-vous — 45 minutes', text: 'Nous étudions votre dossier et vous exposons les options possibles. Tarif à titre indicatif : 90 € TTC.' },
    { title: 'Convention d’honoraires', text: 'Si vous nous confiez votre dossier, une convention d’honoraires écrite est signée avant toute intervention, comme l’exige la réglementation de la profession d’avocat.' },
    { title: 'Suivi du dossier', text: 'L’avocate qui a ouvert le dossier le suit jusqu’à sa résolution, avec un point régulier sur son avancement.' },
  ],

  faq: [
    { q: 'Faut-il prendre rendez-vous ?', a: 'Oui, le cabinet reçoit uniquement sur rendez-vous, du lundi au vendredi de 9h à 18h.' },
    { q: 'Combien coûte la première consultation ?', a: 'La première consultation dure 45 minutes et est facturée 90 € TTC, à titre indicatif. Toute mission ultérieure fait l’objet d’une convention d’honoraires signée au préalable.' },
    { q: 'L’aide juridictionnelle est-elle possible ?', a: 'Oui, en droit de la famille, pour les situations qui y sont éligibles. Nous vérifions votre éligibilité dès le premier échange.' },
    { q: 'Le cabinet intervient-il en dehors de Montpellier ?', a: 'Oui, à Castelnau-le-Lez, Lattes, Sète et Nîmes, ainsi que dans les communes voisines.' },
  ],

  form: { provider: 'mailto' },

  wording: {
    devis: 'Prendre rendez-vous',
    ctaTitle: 'Une question juridique&nbsp;? <em>Un premier rendez-vous pour y voir clair.</em>',
    contactTitle: 'Prendre rendez-vous',
    contactText: 'Exposez votre situation en quelques lignes ; nous vous rappelons pour fixer un rendez-vous.',
  },

  images: {
    logo: { src: '/logo.svg', alt: 'Cabinet Lemaire Avocats' },
  },

  seo: {
    keywords: ['avocat Montpellier', 'avocat droit du travail Montpellier', 'avocat droit de la famille Montpellier', 'avocat droit immobilier Montpellier'],
  },

  legal: {
    owner: 'Claire Lemaire',
    mediator: 'En cas de litige non résolu directement avec le cabinet, vous pouvez saisir le Médiateur de la consommation de la profession d’avocat, dont les coordonnées sont disponibles auprès du Conseil national des barreaux (cnb.avocat.fr).',
  },
});
