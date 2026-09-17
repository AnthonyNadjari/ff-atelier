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
    sections: [
      { type: 'custom', variant: 'Rituels', label: 'Rituels' },
      { type: 'custom', variant: 'CarteDesSoins', label: 'Carte des soins' },
      { type: 'custom', variant: 'Espace', label: 'L’espace' },
      { type: 'custom', variant: 'Offrir', label: 'Offrir' },
      { type: 'custom', variant: 'Contact', label: 'Réserver' },
    ],
    footer: 'minimal',
    divider: 'none',
    tone: 'flat',
    shell: 'flow',
  },

  business: {
    name: 'Maison Aurore',
    trade: 'Institut de beauté et spa',
    tagline: 'Un institut au Carré d’Or, <em>un soin à la fois</em>.',
    description:
      'Maison Aurore est un institut de beauté et spa installé au Carré d’Or, à Nice, depuis 2016. Quatre praticiennes y prennent soin du visage, du corps, jusqu’au bout des ongles.\n\nSoins du visage, massages, hammam, épilation, onglerie — et un rituel signature de 90 minutes, pensé comme une parenthèse entière plutôt qu’un soin de plus.',
    since: 2016,
  },

  contact: {
    phone: '+33639982561',
    phoneDisplay: '06 39 98 25 61',
    email: 'contact@exemple.fr',
    address: { street: '12 rue Alphonse-Karr', postalCode: '06000', city: 'Nice' },
    mapsUrl: 'https://maps.google.com/?q=12+rue+Alphonse-Karr+06000+Nice',
    coordinates: { lat: 43.7102, lng: 7.262 },
    hours: [{ days: 'Lundi – samedi', hours: '10h – 20h' }],
    emergency24h: false,
  },

  services: [
    {
      slug: 'soin-visage',
      title: 'Soin du visage',
      short: 'Nettoyage, exfoliation et soin adapté à votre peau.',
      icon: 'Sparkles',
      priceFrom: '75 € (indicatif)',
      featured: true,
    },
    {
      slug: 'massages',
      title: 'Massages',
      short: 'Californien, aux pierres chaudes, ou pensé pour la femme enceinte.',
      bullets: ['Massage californien', 'Massage aux pierres chaudes', 'Massage pour femme enceinte'],
      icon: 'Hand',
      priceFrom: '85 € (indicatif) — 60 min',
    },
    {
      slug: 'hammam',
      title: 'Hammam',
      short: 'Un moment de vapeur douce, seul ou avant un soin.',
      icon: 'Droplets',
    },
    {
      slug: 'epilation',
      title: 'Épilation',
      short: 'Épilation soignée, à la cire.',
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
      short: 'Notre rituel signature, pour le visage et le corps.',
      icon: 'Flower2',
      priceFrom: '140 € (indicatif) — 90 min',
      featured: true,
    },
  ],

  about: {
    title: 'Quatre praticiennes, une adresse',
    story:
      'Maison Aurore a ouvert au Carré d’Or en 2016. Quatre praticiennes s’y relaient, chacune avec son geste, toutes formées aux mêmes soins.\n\nIci, un rendez-vous n’est jamais pris à la légère : la cabine se prépare avant chaque cliente, le rythme reste celui de la personne allongée, pas celui de l’agenda.',
  },

  form: { provider: 'mailto' },

  wording: {
    devis: 'Réserver un soin',
    ctaTitle: 'Une heure pour vous&nbsp;? <em>Nous gardons la place.</em>',
    ctaText: 'Un appel suffit, nous nous occupons du reste.',
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
