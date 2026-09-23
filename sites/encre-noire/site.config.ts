// DEMO : client inventé (Encre Noire, studio de tatouage). Coordonnées fictives (plage 06 39 98).
// Nav, hero et blocs principaux dessinés à la main pour ce site : sites/encre-noire/sections/.
//
// Squelette (21 sept 2026) : coquille `index` — le menu EST la page. Les quatre styles (fin trait,
// blackwork, ornemental, floral = site.services) deviennent les premières entrées, en liens réels
// vers /services/<slug> ; « Styles », « Artistes », « Rendez-vous », FAQ et contact se déroulent
// sous leur entrée. `Styles.astro` perd son data-horizontal (grille à deux colonnes plutôt qu'une
// piste plein écran) et `Artistes.astro` son data-hover-img (portrait au survol) : deux effets
// pilotés par le scroll ou le pointeur qui se calculent mal sur un panneau <details> fermé, comme
// fait sur anna-vidal. layout.hero n'est plus rendu par cette coquille (réduit à la ligne
// d'identité + la tagline en pied).
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'encre-noire',
  direction: 'encre',
  motion: 'rich',
  scale: 'normal',
  typography: { display: 'bodoni', body: 'archivo' },
  layout: {
    shell: 'index',
    nav: 'custom/nav',
    hero: 'custom/hero',
    sections: [
      { type: 'custom', variant: 'styles', label: 'Styles' },
      { type: 'custom', variant: 'artistes', label: 'Artistes' },
      { type: 'custom', variant: 'rendezvous', label: 'Rendez-vous' },
      { type: 'faq', variant: 'two-columns' },
      { type: 'contact', variant: 'simple' },
    ],
    footer: 'big-name',
    divider: 'none',
    tone: 'flat',
    headings: 'auto',
  },

  business: {
    name: 'Encre Noire',
    trade: 'Studio de tatouage',
    tagline: 'Le dessin d’abord. <em>L’aiguille ensuite.</em>',
    description:
      'Studio de tatouage à Lille, quartier Wazemmes, depuis 2015. Deux artistes, un seul carnet de rendez-vous, quatre styles travaillés en profondeur : fin trait, blackwork, ornemental, floral.\n\nChaque projet commence par un dessin discuté avec vous, jamais par un catalogue.',
    since: 2015,
  },

  contact: {
    phone: '+33639982107',
    phoneDisplay: '06 39 98 21 07',
    email: 'contact@exemple.fr',
    address: { street: '18 rue Gambetta', postalCode: '59000', city: 'Lille' },
    hours: [{ days: 'Mardi – samedi', hours: '11 h – 19 h, sur rendez-vous' }],
  },

  services: [
    {
      slug: 'fin-trait',
      title: 'Fin trait',
      short: 'Lignes fines, continues, sans remplissage lourd.',
      description:
        'Un trait continu, fin, sans ombrage. Convient aux formats discrets comme aux pièces plus grandes quand la composition le permet. Cicatrise bien si l’épaisseur du trait est pensée dès le dessin.',
      icon: 'PenLine',
      image: { src: '/images/galerie-1.webp', alt: 'Tatouage fin trait sur avant-bras, tracé d’électrocardiogramme et lettrage' },
    },
    {
      slug: 'blackwork',
      title: 'Blackwork',
      short: 'Aplats noirs, contrastes francs, motifs graphiques.',
      description:
        'Aplats noirs pleins, contrastes nets, peu ou pas de dégradés. Les motifs partent d’une base graphique forte : géométrie, lettrage, figures découpées.',
      icon: 'Contrast',
      image: { src: '/images/galerie-2.webp', alt: 'Stencil posé sur un avant-bras, juste avant le tatouage' },
    },
    {
      slug: 'ornemental',
      title: 'Ornemental',
      short: 'Motifs géométriques et symétriques, mandalas, dentelle.',
      description:
        'Motifs répétés et symétriques : mandalas, dentelle, ornements inspirés des arts décoratifs. Le placement suit les lignes du corps — bras, dos ou sternum.',
      icon: 'Shapes',
      image: { src: '/images/galerie-3.webp', alt: 'Dessin préparatoire tracé à la main sur la table de l’artiste' },
    },
    {
      slug: 'floral',
      title: 'Floral',
      short: 'Fleurs et végétaux, du bouton discret à la pièce large.',
      description:
        'Fleurs, feuillages et branches, en noir ou avec un peu de couleur. D’un petit bouton au poignet à une composition qui court sur tout l’avant-bras.',
      icon: 'Flower2',
      image: { src: '/images/galerie-4.webp', alt: 'Manche florale en cours, motifs de feuilles et de fleurs' },
    },
  ],

  about: {
    title: 'Le studio',
    story:
      'Ouvert en 2015 dans le quartier Wazemmes, Encre Noire est un studio à deux artistes, sur rendez-vous uniquement. Chaque tatouage est dessiné pour la personne qui le porte, jamais reproduit à l’identique.',
    team: [
      {
        name: 'Çamille Vasseur',
        role: 'Fin trait & floral',
      },
      {
        name: 'Théo Renard',
        role: 'Blackwork & ornemental',
      },
    ],
  },

  faq: [
    {
      q: 'Est-ce que ça fait mal ?',
      a: 'Oui, la douleur fait partie du tatouage, mais elle varie selon la zone et votre sensibilité. Les zones proches de l’os ou fines en peau (côtes, sternum, tibia) sont plus vives que le bras ou la cuisse. On adapte le rythme de la séance si besoin.',
    },
    {
      q: 'Quel est le prix d’un tatouage ?',
      a: 'Sur devis, après le dessin. Le prix dépend de la taille, du niveau de détail et du temps de pose, pas du style. Le montant est annoncé avant la séance, jamais après.',
    },
    {
      q: 'Quelles sont les règles d’hygiène ?',
      a: 'Matériel à usage unique, aiguilles stérilisées, encres certifiées. Le studio applique les règles d’hygiène et de traçabilité imposées par la réglementation sur le tatouage.',
    },
    {
      q: 'Peut-on tatouer un mineur ?',
      a: 'À partir de 16 ans, seulement avec l’autorisation écrite d’un parent ou tuteur légal, présent le jour du rendez-vous avec une pièce d’identité. En dessous de 16 ans, ce n’est pas possible.',
    },
  ],

  wording: {
    devis: 'Prendre rendez-vous',
    contactTitle: 'Prendre rendez-vous',
    contactText: 'Décrivez votre projet et vos disponibilités, on vous répond avec un créneau.',
  },
  form: { provider: 'mailto' },
  images: {
    og: '/images/galerie-2.webp',
  },
  seo: {
    keywords: ['tatoueur Lille', 'tatouage fin trait Lille', 'tatouage blackwork Lille', 'studio de tatouage Wazemmes'],
  },
});
