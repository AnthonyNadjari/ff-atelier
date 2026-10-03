// DEMO : cliente inventée
/**
 * Studio Ambre — Léa Bonnet, architecte d'intérieur, Paris 10e.
 * Site sur mesure : nav + hero + quatre blocs dessinés pour ce site (sites/studio-ambre/sections/).
 *
 * Ecarts assumés par rapport à la proposition de `ff composer` (direction "pierre" gardée : Bodoni
 * Moda + gris minéral colle exactement au mandat « quiet luxury, éditorial », voir
 * src/directions/pierre/) :
 *  - accent surchargé en ambre (hsl(28 55% 36%), proche du placeholder #b8763b assombri) au lieu du
 *    gris minéral par défaut de "pierre" — le mandat demande un unique accent chaud nommé "ambre".
 *    Luminosité 46 -> 36 (rapport impeccable) : à 46 %, l'ambre tombe dans la zone morte du contraste
 *    pour ses deux usages — texte clair (--on-accent, fixe par la direction "pierre" à #f2f1ee) sur
 *    fond accent (3.4:1) ET accent utilisé comme couleur de texte sur --surface (3.7:1). --on-accent
 *    n'étant pas surchargeable par site (schema.ts), seule la luminosité de l'accent peut résoudre les
 *    deux a la fois ; 36 les satisfait toutes deux (>= 4.5:1, calcul WCAG) en restant un ambre franc.
 *  - motion "rich" (au lieu de "subtle") : plusieurs effets du mandat sont palier rich
 *    (data-stack, data-draw-svg, data-accordion, data-drag-grid).
 *  - shell "magazine" plutôt que "sidebar" proposé : les 8 autres sites dessinés à la main se
 *    répartissent déjà sur flow/sidebar/sticky-hero — magazine et split restent inutilisés
 *    (voir docs/OBJECTIF.md, critère 1). Magazine choisi plutôt que split car il laisse la nav
 *    sur-mesure piloter tout le rendu (desktop compris), split réserve la nav desktop au panneau
 *    latéral de la coquille elle-même.
 *  - typographie par défaut de "pierre" conservée (Bodoni Moda / Epilogue) plutôt que la paire
 *    proposée (delaGothic/domine) : Bodoni Moda porte particulièrement bien le nom du studio en
 *    grand format sur le hero (mandat), une police géométrique aurait affaibli l'effet.
 *  - `smoothScroll` (Lenis) essayé puis retiré : synchronisé avec ScrollTrigger via ses propres
 *    évènements de scroll, il n'a pas suivi le `window.scrollTo()` programmatique du script de
 *    captures (`scripts/captures.mjs`, qui simule un défilement pour déclencher les reveals avant
 *    de reprendre en haut) — les effets `data-scrub` (ici `data-blur-scrub` sur les plans de
 *    "Projets") restaient figés dans leur état de départ sur la capture. Laissé à sa valeur par
 *    défaut `false` : pas de gain assez net pour ce site pour justifier ce risque d'incompatibilité
 *    avec l'outil de vérification.
 *
 * Les quatre services (conseil, conception, suivi de chantier, aménagement de boutique) sont
 * présentés dans la section "Méthode" (sur mesure, data-accordion) plutôt que dans une grille de
 * services séparée : ils sont autant des phases de la mission que des prestations, l'accordéon
 * évite la redite. Les pages /services/<slug> restent générées normalement.
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'studio-ambre',
  direction: 'pierre',
  motion: 'rich',
  accent: { h: 28, s: 55, l: 36 },
  scale: 'display',
  layout: {
    shell: 'magazine',
    nav: 'custom/nav',
    hero: 'custom/hero',
    sections: [
      { type: 'custom', variant: 'casestudy', label: 'Projets' },
      { type: 'about', variant: 'values' },
      { type: 'custom', variant: 'materiaux', label: 'Matériaux' },
      { type: 'custom', variant: 'methode', label: 'Méthode' },
      { type: 'zones', variant: 'list' },
      { type: 'faq', variant: 'two-columns' },
      { type: 'cta', variant: 'card' },
      { type: 'custom', variant: 'contact', label: 'Contact' },
    ],
    footer: 'columns',
    divider: 'rule',
    tone: 'alternate',
    headings: 'left',
  },

  business: {
    name: 'Studio Ambre',
    trade: "Architecte d’intérieur",
    tagline: 'Redessiner un lieu <em>sans le trahir.</em>',
    description:
      'Léa Bonnet dessine des appartements, des boutiques et des cabinets depuis le 31 rue des Vinaigriers, dans le 10e. Elle part de ce qui est déjà là : la lumière, les proportions, la matière.\n\nSeule à la conception, avec un collaborateur pour le suivi de chantier. Peu de projets menés à la fois, et c’est un choix : celle qui dessine est aussi celle qui suit le chantier jusqu’à la réception.',
    since: 2015,
  },

  contact: {
    phone: '+33639985508',
    phoneDisplay: '06 39 98 55 08',
    email: 'contact@exemple.fr',
    address: { street: '31 rue des Vinaigriers', postalCode: '75010', city: 'Paris' },
    mapsUrl: 'https://maps.google.com/?q=31+rue+des+Vinaigriers+75010+Paris',
    mapsProvider: 'osm',
    coordinates: { lat: 48.8722, lng: 2.3616 },
    hours: [{ days: 'Du lundi au vendredi', hours: 'Sur rendez-vous' }],
    emergency24h: false,
  },

  zones: {
    cities: ['Paris', 'Montreuil', 'Vincennes', 'Saint-Ouen', 'Boulogne'],
    label: 'Paris et communes limitrophes',
  },

  services: [
    {
      slug: 'conseil',
      title: 'Conseil',
      short: 'Deux heures sur place, avant tout engagement.',
      description:
        'La première rencontre a lieu chez vous. Deux heures. On regarde la lumière, les volumes, ce que le bâti autorise, et on écoute ce que vous attendez de la pièce.\n\nÀ la fin, vous repartez avec des pistes. Rien n’est engagé pour autant : la conception se décide après, ou pas du tout.',
      bullets: ['Visite sur place, deux heures', 'Lecture de la lumière et des volumes', 'Premières pistes concrètes'],
      icon: 'Compass',
      featured: true,
    },
    {
      slug: 'conception',
      title: 'Conception',
      short: 'Le dossier avec lequel on consulte les artisans : plans, 3D, matériaux.',
      description:
        'Plans à l’échelle, volumes en 3D, palette de matériaux. Le dossier sert deux fois : à se projeter avant les travaux, puis à consulter les artisans sur une base précise.\n\nUn devis d’artisan ne vaut que ce que vaut le dessin qu’on lui donne.',
      bullets: ['Plans et implantation', 'Volumes 3D', 'Sélection des matériaux'],
      icon: 'PenTool',
      featured: true,
    },
    {
      slug: 'suivi-chantier',
      title: 'Suivi de chantier',
      short: 'Un seul interlocuteur sur le chantier, jusqu’à la réception.',
      description:
        'Les artisans sont coordonnés par le studio, pas par vous. Visites régulières, un seul interlocuteur, jusqu’à la réception des travaux.\n\nCelle qui a dessiné le projet est celle qui vient sur le chantier.',
      bullets: ['Coordination des artisans', 'Visites régulières', 'Réception des travaux'],
      icon: 'HardHat',
      featured: true,
    },
    {
      slug: 'amenagement-boutique',
      title: 'Aménagement de boutique',
      short: 'Même méthode pour un commerce : vitrine, circulation, éclairage, caisse.',
      description:
        'Même méthode pour les lieux qui reçoivent du public. La vitrine, le sens de circulation, l’éclairage, le poste de caisse ou d’accueil.\n\nUn commerce se juge à l’usage avant de se juger en photo.',
      bullets: ['Vitrine et circulation', 'Éclairage et matériaux', 'Poste de caisse ou d’accueil'],
      icon: 'Store',
      featured: false,
    },
  ],

  about: {
    title: 'Une manière de travailler',
    story:
      'Léa Bonnet a fondé Studio Ambre en 2015, rue des Vinaigriers. Elle dessine seule, avec un collaborateur pour le suivi de chantier.\n\nPas de catalogue, pas de style maison. Un projet part du lieu tel qu’il est, et parfois la bonne réponse consiste à ne presque rien changer.',
    values: [
      { title: 'Le lieu avant le style', text: "La lumière, les proportions et la structure existante orientent chaque décision, avant toute question de tendance." },
      { title: 'Peu de projets, beaucoup d’attention', text: "Un nombre de dossiers volontairement limité, pour rester présente du premier croquis à la réception du chantier." },
      { title: 'Un interlocuteur, du début à la fin', text: "Celle qui dessine le projet suit aussi le chantier, aux côtés d’un collaborateur unique." },
    ],
  },

  faq: [
    { q: 'Comment se passe la première visite ?', a: 'Deux heures sur place, chez vous. On regarde, on écoute, on esquisse des pistes. Rien n’est engagé à ce stade.' },
    { q: 'Travaillez-vous en dehors de Paris ?', a: 'Le studio intervient à Paris et dans les communes limitrophes : Montreuil, Vincennes, Saint-Ouen, Boulogne.' },
    { q: 'Suivez-vous le chantier jusqu’au bout ?', a: 'Jusqu’à la réception des travaux, oui. La coordination des artisans et les visites de suivi font partie de la mission de conception.' },
    { q: 'Le studio s’occupe-t-il aussi de boutiques ?', a: 'Oui, des boutiques et des cabinets, en plus des appartements. Et la méthode ne change pas.' },
  ],

  form: { provider: 'mailto' },
  images: {
    hero: { src: '/images/hero.webp', alt: 'Intérieur baigné de lumière, matières brutes et proportions généreuses' },
  },
  seo: { keywords: ["architecte d'intérieur Paris 10e", 'aménagement appartement haussmannien', 'aménagement boutique Paris'] },
  wording: {
    devis: 'Prendre rendez-vous',
    ctaTitle: 'Un lieu à repenser ? <em>Commençons par une visite.</em>',
    contactTitle: 'Prendre rendez-vous',
  },
  legal: { owner: 'Léa Bonnet' },
});
