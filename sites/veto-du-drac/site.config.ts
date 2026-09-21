// DEMO : client inventé
/**
 * Clinique vétérinaire du Drac — Grenoble / Saint-Martin-d'Hères. `ff composer veto-du-drac
 * --metier "Vétérinaire"` propose la direction `industriel` (béton/acier/orange sécurité, Bebas,
 * garages/métallerie/BTP) — écartée : le mandat de ce site demande une clinique rassurante et
 * chaleureuse pour des propriétaires anxieux, l'exact opposé du registre chantier d'`industriel`
 * (qui porte de plus un problème de contraste d'accent connu, cf. `docs/OBJECTIF.md`). Direction
 * retenue à la place : `clair` (blanc, Manrope/DM Sans, arrondis généreux, ombres douces, « tech
 * propre ») — inutilisée par tout site dessiné à la main jusqu'ici (seul `demo-boulangerie`, un
 * site généré, s'en sert), et sa propreté SaaS se lit aussi bien comme propreté clinique moderne.
 * Deux écarts au reste de la proposition, notés ici : accent surchargé en vert d'eau profond
 * (proche de `#2a6f62`, la couleur des placeholders) à la place du bleu SaaS par défaut — chaleur
 * plutôt que froideur technique ; `typography.display: gelasio` (serif « classique, chaud » du
 * catalogue) à la place de Manrope pour le titre du hero — le mandat demande un « grand titre
 * serif amical », gardé nulle part ailleurs comme override de `clair`. Composer proposait aussi
 * nav `burger`/hero `marquee`/shell `split` : tous les trois écartés au profit d'un nav et d'un
 * hero dessinés pour ce site (voir sections/Nav.astro, sections/Hero.astro).
 *
 * Cinq sections sur mesure (`sites/veto-du-drac/sections/`) : Urgence (carte de checklist
 * numérotée en `position: sticky` CSS pur — pas `data-sticky-stack`, le mandat demande
 * explicitement « sticky, pas GSAP »), Equipe (portraits en grille 3 colonnes, `data-reveal`
 * `mask`), PreparerVisite (conseils en `data-flip-card`), Nav et Hero (scène de formes abstraites
 * `data-parallax-depth`, aucune photo d'animal — le mandat interdit les photos de mignons animaux
 * de stock, les placeholders restent abstraits). Contact est également sur mesure (halo
 * `data-spotlight` sur la carte de coordonnées, bande `data-marquee` des espèces reçues), ce qui
 * porte le compte à six blocs sur mesure. Neuf effets `data-*` utilisés en tout ; cinq comptaient
 * ≤ 2 usages avant ce tour (grep `sites/<slug>/sections/<Nom>.astro`, hors `_effets`) : `data-parallax-depth`
 * (1), `data-blur-scrub` (1), `data-counter` (1), `data-flip-card` (2), `data-draw-svg` (2) — les
 * quatre autres (`data-reveal="mask"`, `data-scroll-progress`, `data-spotlight`, `data-marquee`)
 * sont explicitement demandés par le mandat malgré un usage plus courant. Aucune barre de temps
 * d'attente inventée (`data-count-bar` explicitement écarté par le mandat : « no invented
 * stats »). `data-smooth` (Lenis) volontairement pas activé : casse les captures pleine page sur
 * les `data-scrub`/`data-reveal`, déjà documenté par `sites/studio-ambre`.
 * 20 sept. 2026 : fond `data-shader="silk"` essayé sur le hero puis retiré (deux effets riches au
 * même endroit avec la scène `data-parallax-depth`, règle 16) ; tranché : la scène reste, le shader
 * vit sur `lemaire-avocats`.
 *
 * Vétérinaire = profession réglementée (Ordre des vétérinaires) : communication informative
 * sobre, aucune comparaison avec un confrère, aucune promesse de guérison, aucun tarif
 * promotionnel — une seule ligne de prix indicatif est affichée (consultation, avec la mention
 * « à titre indicatif », un devis étant remis avant tout acte), conforme à
 * `docs/veille/redaction-images.md` § 1.3. Urgences : prises en charge sur place aux horaires
 * d'ouverture, puis renvoi honnête vers un service de garde de démonstration (numéro fictif,
 * explicitement marqué comme tel dans le texte affiché) — jamais présenté comme une disponibilité
 * 24h/24 réelle (`contact.emergency24h: false`). Aucun avis inventé (le brief n'en fournit pas,
 * section `proof` absente du layout).
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'veto-du-drac',
  direction: 'clair',
  motion: 'rich',
  accent: { h: 169, s: 45, l: 32 },
  typography: { display: 'gelasio' },
  layout: {
    nav: 'custom/Nav',
    hero: 'custom/Hero',
    sections: [
      { type: 'services', variant: 'list' },
      { type: 'custom', variant: 'Urgence', label: 'Urgence' },
      { type: 'custom', variant: 'Equipe', label: 'L’équipe' },
      { type: 'custom', variant: 'PreparerVisite', label: 'Préparer la visite' },
      { type: 'zones', variant: 'chips' },
      { type: 'faq', variant: 'accordion' },
      { type: 'cta', variant: 'band' },
      { type: 'custom', variant: 'Contact', label: 'Contact' },
    ],
    footer: 'minimal',
    shell: 'flow',
  },

  business: {
    name: 'Clinique vétérinaire du Drac',
    trade: 'Vétérinaire',
    tagline: 'Chiens, chats, NAC : <em>la même équipe depuis 2009.</em>',
    description:
      'Depuis 2009, la Clinique vétérinaire du Drac soigne les chiens, les chats et les nouveaux animaux de compagnie (lapins, rongeurs) à Saint-Martin-d’Hères, à la limite de Grenoble.\n\nTrois vétérinaires se relaient pour les consultations, la chirurgie, la dentisterie et l’imagerie. Aux heures d’ouverture, les urgences sont prises en charge sur place ; en dehors, un service de garde de l’agglomération prend le relais.',
    since: 2009,
    legalForm: 'SELARL',
    schemaType: 'VeterinaryCare',
  },

  contact: {
    phone: '+33639989005',
    phoneDisplay: '06 39 98 90 05',
    email: 'contact@exemple.fr',
    address: { street: '18 avenue Gabriel-Péri', postalCode: '38400', city: 'Saint-Martin-d’Hères' },
    mapsUrl: 'https://maps.google.com/?q=18+avenue+Gabriel-Peri+38400+Saint-Martin-d-Heres',
    mapsProvider: 'osm',
    coordinates: { lat: 45.1745, lng: 5.7649 },
    hours: [
      { days: 'Lundi – vendredi', hours: '8h30 – 19h' },
      { days: 'Samedi', hours: '9h – 13h' },
    ],
    emergency24h: false,
  },

  zones: {
    cities: ['Grenoble', 'Saint-Martin-d’Hères', 'Échirolles', 'Meylan', 'Gières', 'Eybens'],
    label: 'Grenoble et son agglomération',
  },

  services: [
    {
      slug: 'consultations',
      title: 'Consultations',
      short: 'Examen clinique, conseil et suivi, pour chiens, chats et NAC.',
      description:
        'La consultation commence toujours par une observation et des questions sur l’animal et son quotidien.\n\nUn devis est remis avant tout acte complémentaire. Consultation : 36 €, à titre indicatif.',
      icon: 'Stethoscope',
      featured: true,
      priceFrom: '36 € (indicatif)',
    },
    {
      slug: 'vaccinations',
      title: 'Vaccinations',
      short: 'Primo-vaccination et rappels, carnet de santé tenu à jour.',
      icon: 'Syringe',
      bullets: ['Rappel annuel', 'Carnet de santé à jour', 'Conseil selon le mode de vie de l’animal'],
    },
    {
      slug: 'chirurgie-de-convenance',
      title: 'Chirurgie de convenance',
      short: 'Stérilisations et interventions courantes, sous anesthésie surveillée.',
      icon: 'Scissors',
      bullets: ['Animal à jeun depuis la veille au soir', 'Suivi post-opératoire'],
    },
    {
      slug: 'dentisterie',
      title: 'Dentisterie',
      short: 'Détartrage et soins dentaires, sous anesthésie contrôlée.',
      icon: 'Toothbrush',
    },
    {
      slug: 'imagerie',
      title: 'Imagerie',
      short: 'Radiographie et échographie sur place, pour un diagnostic plus précis.',
      icon: 'Scan',
    },
    {
      slug: 'urgences',
      title: 'Urgences',
      short: 'Prises en charge sur place aux heures d’ouverture ; le reste du temps, un service de garde prend le relais.',
      icon: 'PhoneForwarded',
      featured: true,
    },
  ],

  about: {
    story:
      'La clinique a ouvert ses portes en 2009, avenue Gabriel-Péri, à quelques mètres de la limite entre Saint-Martin-d’Hères et Grenoble.\n\nSophie Barral, Karim Ouali et Léa Fontaine se partagent aujourd’hui les consultations, la chirurgie et le suivi des animaux du quartier. Chacun garde ses propres dossiers en tête : c’est un choix, pour qu’un animal soit suivi par la même équipe d’une visite à l’autre.',
    team: [
      { name: 'Dr Sophie Barral', role: 'Vétérinaire — chirurgie et médecine générale' },
      { name: 'Dr Karim Ouali', role: 'Vétérinaire — dentisterie et imagerie' },
      { name: 'Dr Léa Fontaine', role: 'Vétérinaire — consultations et NAC' },
    ],
  },

  process: [
    { title: 'Restez calme, observez', text: 'Notez ce que vous voyez : symptôme, comportement, depuis combien de temps.' },
    { title: 'Appelez avant de vous déplacer', text: 'On vous dit si ça peut attendre un rendez-vous ou s’il faut venir tout de suite.' },
    { title: 'Aux heures d’ouverture', text: 'La clinique répond directement et vous reçoit dès que possible.' },
    { title: 'En dehors des horaires', text: 'Un service de garde de l’agglomération prend le relais — voir le numéro ci-contre.' },
    { title: 'Le jour de la visite', text: 'Apportez le carnet de santé si vous l’avez, et le nom des traitements en cours.' },
  ],

  faq: [
    { q: 'Faut-il un rendez-vous pour une vaccination ?', a: 'Oui, les vaccinations se font sur rendez-vous, comme les consultations.' },
    { q: 'Recevez-vous les NAC (lapins, rongeurs) ?', a: 'Oui, en plus des chiens et des chats. Précisez l’espèce lors de la prise de rendez-vous.' },
    { q: 'Que se passe-t-il si j’appelle en dehors des horaires ?', a: 'La ligne de la clinique vous oriente vers le service de garde de l’agglomération, qui prend le relais jusqu’à la réouverture.' },
    { q: 'Le prix de la consultation est-il fixe ?', a: 'La consultation est à 36 € à titre indicatif. Tout acte complémentaire fait l’objet d’un devis avant réalisation.' },
    { q: 'Comment transporter mon chat pour la visite ?', a: 'En caisse de transport, avec un linge qui sent son environnement habituel : cela le rassure pour le trajet et la salle d’attente.' },
  ],

  form: { provider: 'mailto' },

  wording: {
    devis: 'Prendre rendez-vous',
    ctaTitle: 'Un doute sur votre animal ? <em>Appelez, on vous dit quoi faire.</em>',
    ctaText: 'Aux heures d’ouverture, on décroche. En dehors, le service de garde de l’agglomération prend le relais.',
    contactTitle: 'Prendre rendez-vous',
    contactText: 'Décrivez votre besoin et l’animal concerné, nous vous rappelons rapidement.',
  },

  images: {},

  seo: {
    keywords: ['vétérinaire Saint-Martin-d’Hères', 'vétérinaire Grenoble', 'clinique vétérinaire NAC Grenoble'],
  },

  legal: { owner: 'Sophie Barral' },
});
