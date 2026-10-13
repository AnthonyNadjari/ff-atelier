/**
 * Site du studio Finck & Fisch — dogfooding : notre propre site, construit avec notre fabrique.
 * Téléphone et adresse ci-dessous sont des placeholders à remplacer avant mise en ligne
 * (voir résumé de livraison) — Paris/75000 n'est pas une adresse réelle du studio.
 *
 * Relecture « moins IA, plus pro » du 20 sept 2026 : textes réécrits sans tirets cadratins en
 * rafale ni triptyques, phrases courtes ; FAQ ramenée à cinq questions ; contact sur mesure
 * (sections/Contact.astro) pour ne pas empiler deux eyebrows de suite (FAQ + contact partagés).
 *
 * Squelette du 22 sept 2026 — coquille `split` plutôt que `index`, en trois lignes :
 * 1. `index` ne rend pas le hero (src/shells/index.astro) : il aurait supprimé le monogramme animé en
 *    filigrane, seul geste fort de la page et signature de la maison — inacceptable pour notre vitrine.
 * 2. `split` garde ce hero intact et casse quand même le « full scroll down, contact en bas » : panneau
 *    fixe à gauche (nom, une phrase, sommaire actif, téléphone, CTA du tiroir), contenu qui défile à droite.
 * 3. Mobile : le panneau disparaît et la nav sur mesure devient l'en-tête qui porte les mêmes entrées —
 *    dégradation prévue par la coquille, là où l'index mobile n'aurait été qu'une liste de liens de plus.
 *
 * REFONTE DU 22 SEPT 2026 AU SOIR — mandat du fondateur : « méga clean, le moins IA possible, méga
 * beau, super pro, tu peux tout refaire ». Étalonnage de 17 sites de studios dans `ETALON.md` (méthode,
 * relevés, et les 8 décisions qui suivent). Ce qui change ici, et pourquoi :
 *
 * - `split` et `eclipse` sont CONSERVÉS (décisions 2 et 8 de l'étalon) : le panneau fixe est la seule
 *   coquille du repo qui casse le « full scroll down, contact en bas », et aucun autre site ne l'utilise.
 * - Le layout passe de quatre blocs à cinq, et l'ordre change complètement. Les 17 sites étalonnés
 *   montrent le travail juste après le hero ; notre travail, ce n'est pas douze captures, c'est le MÊME
 *   contenu rendu trois fois (`custom/propositions`, décision 3) — notre argument de vente, montré.
 * - `custom/chantier` (décision 4) remplace l'ancienne « Méthode » en cinq étapes : zéro des 17 sites
 *   n'affiche de processus, un seul affiche un délai. Une réglure graduée de 0 à 72 h occupe ce trou
 *   sans tomber dans la frise « 1. Découverte 2. Design 3. Lancement » que tous fuient.
 * - Le manifeste (bloc encre) reste le temps fort et garde sa place entre la moitié et les deux tiers
 *   (règle 19) : 3e des 5 blocs. Il perd sa liste numérotée, parce que Réalisations en a une juste après.
 * - Réalisations passe APRÈS le manifeste : c'est le catalogue, pas la preuve d'entrée.
 * - Aucun eyebrow nulle part sur la page (décision 6, lecture stricte de la règle 13).
 *
 * PLAN V2 DU 9 OCT 2026 (docs/veille/benchmark-2026-10/plan-site-ff.html, validé : ambiance A
 * « Atelier de nuit », signatures S1 à S4, formulaire maison, réponse sous 48 h ouvrées). Le site
 * n'a plus qu'un objectif : donner envie de l'audit gratuit (/audit, page sur mesure dans pages/).
 * - Ordre : hero, preuve vivante, exemples, avant/après, 72 h, deux personnes, tarifs, audit (bascule
 *   crème), FAQ, pied. Propositions, Chantier, Fin et le contact en tiroir sont retirés ; le film
 *   a été retiré du dépôt le 13 oct 2026 (historique git).
 * - Système de design et moteur de mouvement propres au site : sections/ff.css, sections/motion-ff.ts
 *   (gsap.matchMedia, Lenis molette seule). motion « subtle » et smoothScroll false : le moteur de la
 *   factory n'a plus rien à faire ici (aucun data-* animé), ses GSAP et Lenis ne sont pas chargés.
 * - Pages /services/* supprimées (servicePages: false) : 301 vers /audit (redirects.json).
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'finck-fisch',
  domain: 'finckfisch.fr',

  // Direction eclipse (noir encre, filets d'argent, grand vide) + titres en Cormorant : la charte
  // du studio (repo F-F) veut un serif haut de gamme pour le nom — les titres tout en Space Grotesk
  // donnaient un rendu « template SaaS sombre », exactement ce qu'on vend de ne pas faire. Le corps
  // reste en Instrument Sans (lisible, neutre) : le contraste serif/sans fait le cachet.
  direction: 'eclipse',
  motion: 'subtle',
  // Scroll inertiel (Lenis) : vitrine riche, le defilement natif de la molette Windows paraissait
  // « ultra vite » et saccade sur les sequences (20 sept 2026). Coupe automatiquement sous automate.
  smoothScroll: false,
  // Transitions de page (ClientRouter) : fondu 0,3 s entre l'accueil et /services/<slug>, la nav reste
  // en place, le hero s'efface ; scripts inline et moteur rearmes a chaque navigation (docs/ANIMATIONS.md).
  transitions: true,
  // Une seule conversion : l'audit. /services/* redirige vers /audit (redirects.json), aucune page service.
  servicePages: false,
  scale: 'display',
  // Polices (6 oct 2026, « ça se voit que c'est fait par Claude ») : Cormorant et Instrument Sans sont
  // dans toutes les listes de polices par défaut des IA. Bodoni Moda (Didone, la famille du monogramme
  // F&F) pour les titres, Hanken Grotesk pour le texte.
  typography: { display: 'bodoni', body: 'hanken' },
  layout: {
    shell: 'flow',
    // Contact en tiroir : plus de section contact finale dans le layout (sections/Contact.astro reste
    // dans le dossier, hors layout). navLinks() ajoute alors « Contact » au sommaire du panneau, et
    // ContactDrawer.astro intercepte l'ancre #contact sur toutes les pages, page service comprise.
    contactDrawer: false,
    nav: 'custom/nav',
    hero: 'custom/hero',
    sections: [
      // Refonte du 9 oct 2026 (benchmark docs/veille/benchmark-2026-10/) : le travail juste après le
      // premier écran (qui en montre déjà un), puis les deux associés, le choix sur pièce, le prix, la
      // fin. Le film sort de l'accueil : il montrait l'ancienne version du site (fichier gardé).
      { type: 'custom', variant: 'preuve' },
      { type: 'custom', variant: 'realisations', label: 'Exemples' },
      { type: 'custom', variant: 'avantapres' },
      { type: 'custom', variant: 'process72h' },
      { type: 'custom', variant: 'humains' },
      { type: 'custom', variant: 'offre', label: 'Tarifs' },
      { type: 'custom', variant: 'audit' },
      { type: 'custom', variant: 'questions' },
      { type: 'custom', variant: 'fin' },
    ],
    // Pied de page sur mesure : footer/minimal affichait le téléphone placeholder (voir sections/Pied.astro).
    footer: 'custom/pied',
    divider: 'none',
    tone: 'flat',
  },

  business: {
    name: 'Finck & Fisch',
    trade: 'Studio de sites pour artisans',
    // JSON-LD (plan v2 § 6 SEO) : un studio de services, pas un commerce local.
    schemaType: 'ProfessionalService',
    tagline: 'Nous faisons des sites pour les artisans.',
    description:
      'Finck & Fisch dessine des sites vitrines pour des artisans, des commerces et des indépendants. Chaque site part de trois propositions visuelles, jamais d’un modèle décliné par ville. Il est payé une fois et il vous appartient dès la mise en ligne, du code au nom de domaine.\n\nLe studio est tenu par deux associés. Vous parlez à la même personne du premier appel à la livraison.',
    certifications: [],
  },

  contact: {
    phone: '+33600000000',
    phoneDisplay: '06 00 00 00 00',
    email: 'contact@finckfisch.fr',
    address: { postalCode: '75000', city: 'Paris' },
    hours: [{ days: 'Lundi – vendredi', hours: '9 h – 19 h', opens: '09:00', closes: '19:00' }],
    emergency24h: false,
  },

  zones: { label: 'Toute la France, à distance', cities: [] },

  services: [
    {
      slug: 'site-vitrine',
      // « clé en main » est un mot-valise de docs/REDACTION.md §14 R3, signalé par `ff verifier` et
      // affiché sur l'accueil (ligne de liens sous le tableau de l'offre). Remplacé par le fait.
      title: 'Création de site vitrine',
      short: 'Un site de 1 à 6 pages, pensé pour votre activité et livré en une fois.',
      icon: 'Layout',
      featured: true,
      image: { src: '/images/service-1.webp', alt: 'Composition graphique abstraite noir et blanc, image de démonstration' },
      bullets: ['1 à 6 pages', 'Formulaire de contact', 'SEO local', 'Mentions légales', 'Hébergement sans frais mensuels', 'Nom de domaine à votre nom'],
      description:
        'Le site présente votre activité sans détour : ce que vous faites, où vous intervenez, comment vous joindre. Un formulaire permet de vous contacter directement.\n\nIl est optimisé pour le référencement local et comprend vos mentions légales. Il ne génère aucun frais mensuel : l’hébergement est inclus et le nom de domaine est à votre nom.',
    },
    {
      slug: 'refonte',
      title: 'Refonte de site existant',
      short: 'Votre site actuel repris de fond en comble, sans repartir de zéro sur le contenu.',
      icon: 'RefreshCw',
      image: { src: '/images/service-2.webp', alt: 'Composition graphique abstraite noir et blanc, image de démonstration' },
      bullets: ['Reprise des textes et photos existants', 'Mise à jour du contenu', 'Site plus rapide sur mobile'],
      description:
        'Un site vieillissant ou mal ficelé peut être repris intégralement. Nous gardons vos textes et vos photos utilisables, et nous reconstruisons le reste.\n\nLe résultat est un site plus rapide, lisible sur mobile, et à jour sur ce qui compte pour un client : vos services, votre zone et vos coordonnées.',
    },
    {
      slug: 'identite-visuelle',
      title: 'Signature e-mail et identité visuelle légère',
      short: 'Un logo simple, une signature e-mail et une palette de couleurs cohérente.',
      icon: 'PenTool',
      image: { src: '/images/service-3.webp', alt: 'Composition graphique abstraite noir et blanc, image de démonstration' },
      bullets: ['Logo simple', 'Signature e-mail', 'Palette de couleurs'],
      description:
        'Il n’est pas toujours nécessaire de repartir sur une identité de marque complète. Un logo simple, une signature e-mail soignée et une palette cohérente suffisent souvent à donner une image sérieuse.\n\nCette prestation peut accompagner la création d’un site ou être commandée seule.',
    },
    {
      slug: 'visibilite-locale',
      title: 'Fiche Google et visibilité locale',
      short: 'Votre fiche Google tenue à jour, pour apparaître quand on vous cherche.',
      icon: 'MapPin',
      image: { src: '/images/service-4.webp', alt: 'Composition graphique abstraite noir et blanc, image de démonstration' },
      bullets: ['Création ou correction de la fiche', 'Horaires, photos, catégorie à jour', 'Cohérence avec le site'],
      description:
        'Une fiche Google complète et à jour change ce qui apparaît quand un client cherche votre métier dans votre ville : horaires, photos, catégorie d’activité, zone d’intervention.\n\nNous créons ou corrigeons votre fiche, en cohérence avec les informations de votre site.',
    },
  ],

  about: {
    title: 'Le studio',
    story:
      'Finck & Fisch est un studio à deux. L’une rencontre les clients, prend le brief et écrit les textes. L’autre construit les sites avec un outil maison qui associe du code et de l’intelligence artificielle, ce qui permet d’aller vite sans bâcler le détail.\n\nNous pensons qu’un artisan mérite un vrai site, pas un gabarit ni un abonnement de plus. Un prix, une livraison, et le site est à vous.',
    values: [
      { title: 'Vous possédez tout', text: 'Le code, les textes et le nom de domaine vous reviennent à la livraison. Aucun abonnement à reconduire.' },
      { title: 'Deux clients, deux sites différents', text: 'Chaque site a sa direction et sa typographie. Aucun modèle recopié d’un client à l’autre.' },
      { title: 'Un seul interlocuteur', text: 'Du premier appel à la mise en ligne, vous parlez toujours à la même personne.' },
    ],
  },

  process: [
    { title: 'Appel de 15 minutes', text: 'Un échange court pour comprendre votre activité et ce que le site doit faire pour vous.' },
    { title: 'Brief et photos', text: 'Vous nous envoyez vos informations, vos textes et vos photos. Si vous n’en avez pas, nous vous aidons à les réunir.' },
    { title: 'Trois propositions en 48 à 72 h', text: 'Vous recevez trois directions visuelles construites sur votre contenu. Vous en choisissez une.' },
    { title: 'Mise en ligne et remise des clés', text: 'Le site est publié sur votre nom de domaine. Tout vous est transmis, accès compris.' },
  ],

  // Cinq questions, celles qu'un artisan pose vraiment au téléphone. Les autres (agence locale,
  // « deux associés c'est risqué », 72 h trop rapide) argumentaient plus qu'elles ne répondaient.
  // Plan v2 : six questions, dont deux sur l'audit ; « changer un texte dans deux ans » retirée (la
  // réponse est déjà dans « à qui appartient le nom de domaine » et dans les jours 2-3 du process).
  faq: [
    {
      q: 'L’audit est-il vraiment gratuit ?',
      a: 'Oui. Vingt minutes au téléphone ou en visio, et vous gardez les cinq points, même si vous ne travaillez pas avec nous. Pas de relance commerciale ensuite.',
    },
    {
      q: 'Que faut-il préparer pour l’audit ?',
      a: 'Rien. Donnez-nous l’adresse de votre site si vous en avez un, sinon le nom sous lequel vos clients vous cherchent sur Google.',
    },
    {
      q: 'Faut-il fournir des photos ?',
      a: 'C’est mieux, mais pas obligatoire. Nous pouvons monter une première version avec des visuels neutres, puis les remplacer dès que vous avez les vôtres.',
    },
    {
      q: 'Est-ce que je vais apparaître sur Google ?',
      a: 'Nous ne promettons pas de première place, personne ne peut la garantir. Nous livrons un site rapide et bien structuré, avec votre ville et votre métier aux bons endroits. Le reste se construit dans le temps, avec ou sans nous.',
    },
    {
      q: 'Pourquoi pas un abonnement à 30 € par mois ?',
      a: 'Sur trois ans, un abonnement coûte souvent plus cher qu’un site payé une fois. Et à la fin, il ne vous appartient pas. Ici, le site est à vous dès la mise en ligne.',
    },
    {
      q: 'À qui appartient le nom de domaine ?',
      a: 'À vous. Il est enregistré à votre nom dès le départ, ou transféré à votre nom si vous en avez déjà un. Jamais au nom du studio.',
    },
  ],

  proof: {
    // Galerie de démonstration : aperçus des directions visuelles utilisées pour nos sites clients.
    gallery: [
      { src: '/images/galerie-1.webp', alt: 'Aperçu de la direction signal, utilisée pour un site de plomberie (démonstration)', caption: 'Direction signal, plomberie (démonstration)' },
      { src: '/images/galerie-2.webp', alt: 'Aperçu de la direction luxe, utilisée pour un site de salon de coiffure (démonstration)', caption: 'Direction luxe, salon de coiffure (démonstration)' },
      { src: '/images/galerie-3.webp', alt: 'Aperçu de la direction journal, utilisée pour un site d’architecture d’intérieur (démonstration)', caption: 'Direction journal, architecture d’intérieur (démonstration)' },
      { src: '/images/galerie-4.webp', alt: 'Aperçu de la direction brut, utilisée pour un site d’électricien (démonstration)', caption: 'Direction brut, électricité (démonstration)' },
      { src: '/images/galerie-5.webp', alt: 'Aperçu de la direction terre, utilisée pour un site de paysagiste (démonstration)', caption: 'Direction terre, paysagisme (démonstration)' },
      { src: '/images/galerie-6.webp', alt: 'Aperçu de la direction clair, utilisée pour un site de boulangerie (démonstration)', caption: 'Direction clair, boulangerie (démonstration)' },
    ],
  },

  social: {},

  form: { provider: 'mailto' },

  wording: {
    devis: 'Parler de votre projet',
    ctaTitle: 'Racontez-nous votre métier.',
    ctaText: 'Deux lignes suffisent : ce que vous faites, où, et si vous avez déjà un site. On vous répond nous-mêmes, avec une première idée et le prix.',
    contactTitle: 'Parlons de votre projet',
    contactText: 'Décrivez votre activité en deux lignes, nous vous rappelons.',
  },

  // Plus d'images.hero : le hero sur mesure n'en affiche pas, et Base.astro préchargeait cette image
  // pour rien (concurrence avec Bodoni, l'élément LCP étant le titre). Elle reste l'image Open Graph.
  // TODO(fondateurs) : une vraie image OG 1200×630 (ff og finck-fisch).
  images: {
    og: '/images/hero.webp',
  },

  seo: {
    // Title ~52 caractères, description ~160 : calibrés pour ne pas être tronqués dans Google.
    title: 'Finck & Fisch | Site vitrine pour artisan, livré en 72 h',
    description:
      'Finck & Fisch dessine des sites vitrines pour artisans, commerces et indépendants. Trois propositions visuelles, livraison en 72 h, site payé une fois et à vous.',
    keywords: [
      'création site vitrine artisan',
      'site internet artisan sans abonnement',
      'site web indépendant',
      'refonte site vitrine',
      'site internet commerce local',
      'studio création site artisan',
      'fiche Google établissement',
      'site vitrine livré en 72 heures',
    ],
  },

  legal: { owner: 'Finck & Fisch' },
});
