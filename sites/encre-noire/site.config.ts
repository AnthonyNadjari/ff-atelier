// DEMO : client inventé (Encre Noire, studio de tatouage). Coordonnées fictives (plage 06 39 98).
// Nav, hero et blocs principaux dessinés à la main pour ce site : sites/encre-noire/sections/.
//
// 9 oct 2026 : la coquille `index` (le menu est la page) est abandonnée : l’accueil ne montrait aucun
// dessin, aucune peau, aucune encre, rien que neuf lignes numérotées. Le premier écran est à présent
// le geste du métier (la main qui dessine, photo du dossier) avec l’accroche posée dessus ; les quatre
// styles se lisent avec leur photo ; le mur de flashs (dessins à prix fixe, tatoués une seule fois)
// est le bloc signature ; « Le studio » réunit l’histoire, les deux artistes et les règles d’hygiène.
// Les numéros décoratifs, les surtitres, l’escalier de trois étapes et le téléphone géant sont partis.
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'encre-noire',
  direction: 'encre',
  motion: 'rich',
  scale: 'normal',
  typography: { display: 'bodoni', body: 'archivo' },
  layout: {
    shell: 'flow',
    nav: 'custom/nav',
    hero: 'custom/hero',
    sections: [
      { type: 'custom', variant: 'styles', label: 'Styles' },
      { type: 'custom', variant: 'flashs', label: 'Flashs' },
      { type: 'custom', variant: 'studio', label: 'Le studio' },
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
      'Studio de tatouage au 18 rue Gambetta, à Wazemmes, depuis 2015. Deux artistes, un seul carnet de rendez-vous. Fin trait, blackwork, ornemental, floral : quatre styles, et rien au-delà.\n\nUn projet commence toujours par un dessin, discuté avec vous. Pas par un catalogue de motifs à choisir sur place.',
    since: 2015,
    certifications: ['Formation hygiène et salubrité (21 h), les deux artistes'],
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
      short: 'Un trait continu, fin, sans ombrage.',
      description:
        'Un trait continu, fin, sans ombrage. Ça tient sur un format discret comme sur une grande pièce, quand la composition le permet.\n\nL’épaisseur du trait se décide au dessin. C’est de là que dépend la bonne cicatrisation, pas du format.',
      icon: 'PenLine',
      image: { src: '/images/galerie-1.webp', alt: 'Tatouage fin trait sur avant-bras, tracé d’électrocardiogramme et lettrage' },
    },
    {
      slug: 'blackwork',
      title: 'Blackwork',
      short: 'Du noir plein, des contrastes nets, et presque aucun dégradé.',
      description:
        'Du noir plein, posé en aplats, avec des contrastes nets et peu de dégradés. La base reste graphique : une géométrie, un lettrage, une figure découpée.',
      icon: 'Contrast',
      image: { src: '/images/galerie-2.webp', alt: 'Stencil posé sur un avant-bras, juste avant le tatouage' },
    },
    {
      slug: 'ornemental',
      title: 'Ornemental',
      short: 'Mandalas, dentelle, ornements qui se répètent et suivent le corps.',
      description:
        'Des motifs qui se répètent et se répondent : mandalas, dentelle, ornements venus des arts décoratifs.\n\nLe placement compte autant que le dessin. Bras, dos, sternum : on suit les lignes du corps plutôt que de les contrarier.',
      icon: 'Shapes',
      image: { src: '/images/galerie-3.webp', alt: 'Dessin préparatoire tracé à la main sur la table de l’artiste' },
    },
    {
      slug: 'floral',
      title: 'Floral',
      short: 'Fleurs, feuillages, branches. Du poignet à tout l’avant-bras.',
      description:
        'Fleurs, feuillages, branches. En noir, ou avec un peu de couleur.\n\nÇa va du petit bouton au poignet à une composition qui court sur tout l’avant-bras.',
      icon: 'Flower2',
      image: { src: '/images/galerie-4.webp', alt: 'Manche florale en cours, motifs de feuilles et de fleurs' },
    },
  ],

  about: {
    title: 'Le studio',
    story:
      'Le studio a ouvert en 2015, 18 rue Gambetta, à Wazemmes, dans une ancienne mercerie. Camille Vasseur y tatoue le fin trait et le floral, Théo Renard le blackwork et l’ornemental. Un seul carnet de rendez-vous, et rien sans rendez-vous.\n\nUn dessin n’est jamais reproduit à l’identique pour quelqu’un d’autre. Il est fait pour la personne qui le porte, et le stencil est détruit après la séance.',
    team: [
      {
        name: 'Camille Vasseur',
        role: 'Fin trait et floral',
      },
      {
        name: 'Théo Renard',
        role: 'Blackwork et ornemental',
      },
    ],
  },

  faq: [
    {
      q: 'Est-ce que ça fait mal ?',
      a: 'Oui. Ça varie selon la zone et selon vous : les côtes, le sternum, le tibia sont plus vifs que le bras ou la cuisse, la peau y est fine et l’os juste dessous. Et on adapte le rythme de la séance si besoin.',
    },
    {
      q: 'Quel est le prix d’un tatouage ?',
      a: 'Les flashs du mur ont un prix fixe, affiché. Tout le reste est sur devis, et seulement après le dessin : ce qui compte, c’est la taille, le détail, le temps de pose. Le montant est annoncé avant la séance, jamais après.',
    },
    {
      q: 'Un flash peut-il être tatoué deux fois ?',
      a: 'Non. Chaque flash du mur est tatoué une seule fois, puis rayé. Si vous aimez un dessin déjà pris, l’artiste vous en propose un autre dans le même esprit.',
    },
    {
      q: 'Quelles sont les règles d’hygiène ?',
      a: 'Aiguilles, cartouches et buses à usage unique, ouvertes devant vous. Encres conformes au règlement européen. Poste désinfecté entre chaque client. Les deux artistes ont suivi la formation hygiène et salubrité obligatoire, et l’activité est déclarée à l’ARS.',
    },
    {
      q: 'Peut-on tatouer un mineur ?',
      a: 'À partir de 16 ans, seulement avec l’autorisation écrite d’un parent ou tuteur légal, présent le jour du rendez-vous avec une pièce d’identité. En dessous de 16 ans, ce n’est pas possible.',
    },
    {
      q: 'Faut-il venir à jeun, ou éviter quelque chose avant ?',
      a: 'Mangez avant, dormez la veille, pas d’alcool ni d’aspirine dans les 24 h : ça fluidifie le sang et gêne la pose. Venez avec des vêtements qui dégagent la zone.',
    },
  ],

  wording: {
    devis: 'Prendre rendez-vous',
    contactTitle: 'Prendre rendez-vous',
    contactText: 'Décrivez votre projet et vos disponibilités, on vous répond avec un créneau.',
  },
  form: { provider: 'mailto' },
  images: {
    hero: { src: '/images/galerie-3.webp', alt: 'Les mains tatouées de l’artiste dessinant un motif dans un carnet' },
    og: '/images/galerie-2.webp',
  },
  seo: {
    keywords: ['tatoueur Lille', 'tatouage fin trait Lille', 'tatouage blackwork Lille', 'studio de tatouage Wazemmes', 'flash tattoo Lille'],
  },
});
