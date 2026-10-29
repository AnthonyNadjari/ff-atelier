// DEMO : cliente inventée (Studio Ambre, Léa Bonnet, architecte d’intérieur, Paris 10e). Coordonnées
// fictives (plage 06 39 98), aucun avis. Le dossier ne contient qu’une photo libre (intérieur de la
// Farnsworth House, Library of Congress, voir CREDITS.md) : elle sert de premier écran et, en trois
// cadrages (public/images/projet-1/2/3.webp), illustre le projet raconté ; les légendes décrivent ce
// qu’on voit, jamais une adresse.
//
// 9 oct 2026 : coquille `magazine` (numéros géants 01-08 à chaque section) remplacée par `flow` ;
// le hero perd le nom en capitales espacées qui se décode, l’accroche en italique et le voile ; le
// bloc signature est un projet raconté avec ses faits (surface, budget, honoraires, durées, dates) et
// trois photos ; « Méthode » devient quatre phases en texte, avec leur durée écrite, à la place d’un
// accordéon à barres de progression ; les trois cartes de valeurs, la liste de zones en pastilles, la
// carte d’appel finale, le halo et le filet lumineux du contact sont partis. Contact partagé.
//
// 29 oct 2026 (veille, paire trop proche : chez-malo 0,87 / 0,91, encre-noire, forge-delacroix, maison-aurore… « h1 sur
// l'image au milieu, numéro sous le h1 ») : accueil refait sur l'architecture `estimation-etapes` (la demande de première
// visite en étapes sous l'en-tête, questions reprises de wording.contactText) peinte avec le style `lin` (fraher.co :
// direction, panneaux de services, photo en bande pleine largeur sans texte dessus, section `bande`). Rien de retiré.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'studio-ambre',
  direction: 'lin',
  motion: 'subtle',
  accent: { h: 28, s: 55, l: 36 },
  scale: 'normal',
  layout: {
    shell: 'estimation',
    nav: 'bar',
    hero: 'lin',
    sections: [
      {
        type: 'custom',
        variant: 'bande',
      },
      {
        type: 'custom',
        variant: 'projet',
        label: 'Un projet',
      },
      {
        type: 'faq',
        variant: 'two-columns',
      },
      {
        type: 'services',
        variant: 'lin',
      },
      {
        type: 'custom',
        variant: 'methode',
        label: 'Méthode',
      },
      {
        type: 'custom',
        variant: 'materiaux',
        label: 'Matières',
      },
      {
        type: 'custom',
        variant: 'studio',
        label: 'Le studio',
      },
    ],
    footer: 'liens',
    divider: 'none',
    tone: 'alternate',
    headings: 'left',
    actionBar: false,
    contactDrawer: false,
    servicePage: 'fiche',
  },

  business: {
    name: 'Studio Ambre',
    trade: "Architecte d’intérieur",
    tagline: 'Redessiner un lieu <em>sans le trahir.</em>',
    description:
      'Léa Bonnet dessine des appartements, des boutiques et des cabinets depuis le 31 rue des Vinaigriers, dans le 10e. Elle part de ce qui est déjà là : la lumière, les proportions, la matière.\n\nSeule à la conception, avec un collaborateur pour le suivi de chantier. Peu de projets menés à la fois, et c’est un choix : celle qui dessine est aussi celle qui suit le chantier jusqu’à la réception.',
    since: 2015,
    legalForm: 'EURL',
    insurance: 'RC professionnelle, attestation sur demande',
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
      'Léa Bonnet a fondé Studio Ambre en 2015, rue des Vinaigriers, après six ans en agence. Elle dessine seule, avec Karim Haddad pour le suivi de chantier depuis 2019.\n\nPas de catalogue, pas de style maison. Un projet part du lieu tel qu’il est : la lumière à chaque heure, les proportions, ce que la structure autorise. Parfois la bonne réponse consiste à ne presque rien changer, et on le dit.\n\nCinq à six projets par an, pas davantage. Celle qui dessine est celle qui vient sur le chantier, jusqu’à la réception.',
  },

  faq: [
    { q: 'Comment se passe la première visite ?', a: 'Deux heures sur place, chez vous. On regarde, on écoute, on esquisse des pistes. Rien n’est engagé à ce stade.' },
    { q: 'Comment sont calculés les honoraires ?', a: 'En pourcentage du montant des travaux, entre 10 et 14 % selon l’ampleur de la mission, conception et suivi de chantier compris. Le pourcentage est écrit dans le contrat avant de commencer.' },
    { q: 'Combien de temps prend un projet ?', a: 'Comptez deux à trois mois de conception, puis trois à cinq mois de chantier pour un appartement. Les délais réels de chaque phase sont donnés avec le dossier de conception.' },
    { q: 'Travaillez-vous en dehors de Paris ?', a: 'Le studio intervient à Paris et dans les communes limitrophes : Montreuil, Vincennes, Saint-Ouen, Boulogne.' },
    { q: 'Suivez-vous le chantier jusqu’au bout ?', a: 'Jusqu’à la réception des travaux, oui. La coordination des artisans et les visites de suivi font partie de la mission.' },
    { q: 'Faut-il l’accord de la copropriété pour abattre une cloison ?', a: 'Pour une cloison légère, en général non. Pour un mur porteur, une gaine ou une évacuation qui traverse les parties communes, oui, et un ingénieur structure s’en mêle. On regarde le règlement de copropriété à la première visite, avant de dessiner quoi que ce soit.' },
    { q: 'Le studio s’occupe-t-il aussi de boutiques ?', a: 'Oui, des boutiques et des cabinets, en plus des appartements. Et la méthode ne change pas.' },
  ],

  // Architecture estimation-etapes (29 oct 2026) : les questions sont celles que le studio pose déjà (wording.contactText :
  // « Dites-nous le lieu, ce qui ne va plus, et quand vous aimeriez commencer ») ; les genres de lieux viennent de
  // business.description ; « après » reprend la FAQ et le service Conseil, sans promesse ajoutée.
  estimation: {
    questions: [
      { nom: 'lieu', libelle: 'Le lieu', type: 'choix', choix: ['Un appartement', 'Une boutique', 'Un cabinet'] },
      { nom: 'probleme', libelle: 'Ce qui ne va plus', type: 'texte' },
      { nom: 'debut', libelle: 'Quand aimeriez-vous commencer ?', type: 'texte' },
    ],
    apres: [
      'On rappelle pour fixer la première visite.',
      'Deux heures sur place, chez vous : on regarde, on écoute, on esquisse des pistes.',
      'Rien n’est engagé à ce stade : la conception se décide après, ou pas du tout.',
    ],
  },

  form: { provider: 'mailto' },
  images: {
    hero: { src: '/images/hero.webp', alt: 'Séjour vitré toute hauteur, mur de rangements en bois clair, banquette de cuir face au jardin' },
    illustration: true,
  },
  seo: { keywords: ["architecte d'intérieur Paris 10e", 'aménagement appartement haussmannien', 'aménagement boutique Paris'] },
  wording: {
    devis: 'Prendre rendez-vous',
    estimation: 'Demander une première visite',
    ctaTitle: 'Un lieu à repenser ? <em>Commençons par une visite.</em>',
    contactTitle: 'Prendre rendez-vous',
    contactText: 'Dites-nous le lieu, ce qui ne va plus, et quand vous aimeriez commencer. On rappelle pour fixer la première visite.',
  },
  legal: { owner: 'Léa Bonnet' },
});
