/**
 * DEMO : cliente inventee.
 * Institut de beaute / spa (metier 16 du tableau docs/OBJECTIF.md), Nice, Carre d'Or.
 *
 * Mandat de conception : lenteur, sensorialite, silence. `ff composer maison-aurore --metier
 * "Institut de beaute"` propose la direction "industriel" (beton/acier/orange securite, Bebas) —
 * ecartee d'emblee : c'est l'oppose exact d'un institut de soin, et cette direction a un probleme
 * de contraste d'accent deja documente ailleurs dans le depot. Direction retenue a la place :
 * "luxe" (sombre, or fin, Cormorant, mouvement lent) — encore inutilisee par un site dessine a la
 * main (verifie par grep sur "direction:" dans tous les sites/<slug>/site.config.ts). La consigne
 * envisageait une variante "luxe claire" ; ecartee : la tache interdit de toucher src/, et
 * src/directions/luxe/index.css fige --bg/--fg en sombre (seul --accent-h/s/l est surchargeable
 * depuis un site.config.ts). La lenteur et la penombre de "luxe" servent au contraire tres
 * directement le mandat ("hero de quasi-silence") : un institut ferme sur rue, une cabine
 * tamisee, un rituel du soir plutot qu'une vitrine eclairee. Accent surcharge en corail-or chaud
 * (hsl(24 42% 58%), proche du placeholder #d9c3b0) plutot que l'or plus jaune par defaut de
 * "luxe" — plus mediterraneen, moins "bijouterie".
 *
 * Squelette (21 sept 2026) : coquille `sticky-hero` — le hero reste épinglé en fond, les rituels et
 * soins glissent par-dessus comme une feuille. Contact en tiroir (`contactDrawer: true`) : un
 * institut de soin vend un créneau, pas une page de défilement de plus — la section contact finale
 * sur mesure sort du layout (le tiroir devient la seule porte, `wording.devis` « Réserver un soin »
 * y ouvre directement). La ligne data-marquee du hero (les soins en italique) devient une ligne
 * fixe : le chapitre `data-horizontal` de « L'espace » reste le seul geste riche de la page
 * (CONVENTIONS.md règle 16).
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'maison-aurore',
  direction: 'luxe',
  motion: 'rich',
  accent: { h: 24, s: 42, l: 58 },

  layout: {
    nav: 'custom/Nav',
    hero: 'custom/Hero',
    contactDrawer: true,
    sections: [
      { type: 'custom', variant: 'Rituels', label: 'Rituels' },
      { type: 'custom', variant: 'CarteDesSoins', label: 'Carte des soins' },
      { type: 'custom', variant: 'Espace', label: 'L’espace' },
      { type: 'custom', variant: 'Offrir', label: 'Offrir' },
    ],
    footer: 'minimal',
    divider: 'none',
    tone: 'flat',
    shell: 'sticky-hero',
  },

  business: {
    name: 'Maison Aurore',
    trade: 'Institut de beauté et spa',
    tagline: 'Un institut rue Alphonse-Karr, <em>un soin à la fois.</em>',
    description:
      'Institut de beauté et spa au 12 rue Alphonse-Karr, à Nice, depuis 2016. Quatre praticiennes y prennent soin du visage, du corps, jusqu’au bout des ongles.\n\nSoins du visage, massages, hammam, épilation, onglerie. Et un rituel de 90 minutes, le Rituel Aurore, pensé comme une parenthèse plutôt que comme un soin de plus.\n\nDu lundi au samedi, 10 h – 20 h. Le dimanche, l’institut est fermé.',
    since: 2016,
  },

  contact: {
    phone: '+33639982561',
    phoneDisplay: '06 39 98 25 61',
    email: 'contact@exemple.fr',
    address: { street: '12 rue Alphonse-Karr', postalCode: '06000', city: 'Nice' },
    mapsUrl: 'https://maps.google.com/?q=12+rue+Alphonse-Karr+06000+Nice',
    coordinates: { lat: 43.7102, lng: 7.262 },
    hours: [{ days: 'Lundi – samedi', hours: '10 h – 20 h' }],
    emergency24h: false,
  },

  services: [
    {
      slug: 'soin-visage',
      title: 'Soin du visage',
      short: 'Nettoyage, exfoliation, puis le soin choisi après avoir regardé votre peau.',
      icon: 'Sparkles',
      priceFrom: '75 € (indicatif)',
      featured: true,
    },
    {
      slug: 'massages',
      title: 'Massages',
      short: 'Au choix : californien, pierres chaudes, ou adapté à la grossesse. 60 minutes.',
      bullets: ['Le californien, pour commencer', 'Aux pierres chaudes', 'Adapté à la grossesse'],
      icon: 'Hand',
      priceFrom: '85 € (indicatif), 60 min',
    },
    {
      slug: 'hammam',
      title: 'Hammam',
      short: 'Vapeur douce, seul ou juste avant un soin.',
      icon: 'Droplets',
    },
    {
      slug: 'epilation',
      title: 'Épilation',
      short: 'Épilation à la cire.',
      icon: 'Feather',
    },
    {
      slug: 'onglerie',
      title: 'Onglerie',
      short: 'Manucure et pose de vernis.',
      icon: 'Gem',
    },
    {
      slug: 'rituel-aurore',
      title: 'Rituel Aurore',
      short: 'Le visage et le corps, en 90 minutes. Et la cabine est à vous pendant tout ce temps.',
      icon: 'Flower2',
      priceFrom: '140 € (indicatif), 90 min',
      featured: true,
    },
  ],

  about: {
    title: 'Quatre praticiennes, une adresse',
    story:
      'Maison Aurore a ouvert rue Alphonse-Karr en 2016. Quatre praticiennes s’y relaient. Chacune a son geste, toutes ont la même formation.\n\nLa cabine se prépare avant chaque cliente. Le rythme est celui de la personne allongée, pas celui de l’agenda. Et c’est pour ça qu’un rendez-vous ne se prend jamais à la légère.',
  },

  form: { provider: 'mailto' },

  wording: {
    devis: 'Réserver un soin',
    ctaTitle: 'Une heure pour vous ? <em>Nous gardons la place.</em>',
    ctaText: 'Le soin, le jour, l’heure qui vous arrange. Du lundi au samedi, 10 h – 20 h.',
    contactTitle: 'Réserver un soin',
    contactText: 'Décrivez le soin souhaité, nous vous rappelons pour fixer l’heure.',
  },

  images: {
    hero: { src: '/images/hero.webp', alt: 'Vue en duotone de l’institut Maison Aurore, ambiance calme et feutrée' },
  },

  seo: {
    keywords: ['institut de beauté Nice', 'spa Carré d’Or Nice', 'massage Nice', 'rituel spa Nice'],
  },
});
