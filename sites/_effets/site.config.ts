/**
 * Site de demonstration du moteur d'animation (src/scripts/motion.ts) : une seule section sur
 * mesure (sections/Effets.astro) qui utilise chaque data-* du moteur, ancien et nouveau, avec un
 * libelle pour chacun. Sert de test visuel (`ff captures _effets`) et de reference humaine.
 * Ne pas transformer en site client : direction/motion fixes pour que tous les effets soient actifs.
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: '_effets',
  direction: 'clair',
  motion: 'rich',
  layout: {
    nav: 'bar',
    hero: 'typographic',
    sections: [{ type: 'custom', variant: 'effets' }],
    footer: 'minimal',
  },

  business: {
    name: 'Atelier Demo Effets',
    trade: 'Vitrine du moteur d’animation',
    tagline: 'Vingt-cinq effets, <em>un seul moteur.</em>',
    description:
      'Page de démonstration interne : chaque attribut data-* du moteur ff-atelier est présenté ici avec son libellé, pour vérifier visuellement le rendu et détecter tout bug avant de l’utiliser dans un site client.\n\nCe site n’est pas livré à un client : il sert de fumigène pour docs/veille/animations.md.',
    since: 2026,
  },

  contact: {
    phone: '+33600000000',
    phoneDisplay: '06 00 00 00 00',
    email: 'demo@exemple.fr',
    address: { postalCode: '00000', city: 'Démo' },
  },

  services: [
    { slug: 'demo', title: 'Démonstration', short: 'Une seule section : la vitrine du moteur d’animation.', icon: 'Sparkles' },
  ],

  about: { story: 'Site interne, pas de contenu client.' },

  form: { provider: 'none' },
  images: {},
  seo: { keywords: [] },
  legal: { owner: 'Atelier interne' },
});
