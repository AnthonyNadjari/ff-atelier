/**
 * Données structurées JSON-LD générées depuis le contenu du site (module pur, sans dépendance
 * au runtime Astro — testé par tests/jsonld.test.mjs via scripts/ff/ts-loader.mjs).
 *
 * Pourquoi : les moteurs de réponse IA (ChatGPT via Bing, Perplexity, Google AI Overviews) citent
 * prioritairement du contenu structuré — questions/réponses explicites (FAQPage), entités Service,
 * horaires normalisés. Règle d'or : ne jamais émettre un schéma pour du contenu qui n'est pas
 * affiché sur la page (Google le sanctionne) — c'est l'appelant qui conditionne, pas ici.
 */
import type { Site } from './schema';
import { schemaTypeForTrade } from './schemaType';

type Json = Record<string, unknown>;

/** Jours de la semaine : regex du nom français -> nom schema.org, dans l'ordre lundi..dimanche. */
const JOURS: [RegExp, string][] = [
  [/\blundi\b/i, 'Monday'],
  [/\bmardi\b/i, 'Tuesday'],
  [/\bmercredi\b/i, 'Wednesday'],
  [/\bjeudi\b/i, 'Thursday'],
  [/\bvendredi\b/i, 'Friday'],
  [/\bsamedi\b/i, 'Saturday'],
  [/\bdimanche\b/i, 'Sunday'],
];

/**
 * Traduit le champ libre `days` (« Lundi – vendredi », « Samedi », « Mardi, jeudi ») en URLs de
 * jours schema.org. Une plage (tiret entre deux jours) est étendue aux jours intermédiaires.
 * Renvoie undefined si aucun jour n'est reconnu — l'appelant retombe alors sur le texte libre.
 */
export function daysOfWeek(days: string): string[] | undefined {
  const hits = JOURS.map(([re], i) => (re.test(days) ? i : -1)).filter((i) => i >= 0);
  if (hits.length === 0) return undefined;
  const isRange = /[–—-]/.test(days) && hits.length >= 2;
  const first = hits[0];
  const last = hits[hits.length - 1];
  const indexes = isRange
    ? Array.from({ length: last - first + 1 }, (_, k) => first + k)
    : hits;
  return [...new Set(indexes)].map((i) => `https://schema.org/${JOURS[i][1]}`);
}

/**
 * Horaires structurés (OpeningHoursSpecification) — émis seulement quand opens/closes (HH:MM)
 * sont renseignés dans site.config.ts ; sinon Base.astro garde l'ancien `openingHours` texte libre.
 */
export function openingHoursSpecification(hours: Site['contact']['hours']): Json[] | undefined {
  const specs: Json[] = [];
  for (const h of hours) {
    if (!h.opens || !h.closes) continue;
    const dayOfWeek = daysOfWeek(h.days);
    if (!dayOfWeek) continue;
    specs.push({ '@type': 'OpeningHoursSpecification', dayOfWeek, opens: h.opens, closes: h.closes });
  }
  return specs.length > 0 ? specs : undefined;
}

/** FAQPage : une Question par entrée de site.faq — n'émettre que si une section faq est affichée. */
export function faqPageLd(faq: Site['faq']): Json | undefined {
  if (faq.length === 0) return undefined;
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** Service schema.org pour une page /services/<slug> : provider, zone desservie, prix si affiché. */
export function serviceLd(site: Site, service: Site['services'][number], pageUrl: string): Json {
  return {
    '@type': 'Service',
    name: service.title,
    description: service.short,
    url: pageUrl,
    provider: {
      '@type': site.business.schemaType || schemaTypeForTrade(site.business.trade),
      name: site.business.name,
    },
    areaServed:
      site.zones.cities.length > 0
        ? site.zones.cities.map((c) => ({ '@type': 'City', name: c }))
        : { '@type': 'City', name: site.contact.address.city },
    ...(service.priceFrom ? { offers: { '@type': 'Offer', description: service.priceFrom } } : {}),
  };
}

/** BlogPosting d'un article de la rubrique conseils (src/pages/conseils/[slug].astro). */
export function conseilLd(site: Site, conseil: Site['conseils'][number], pageUrl: string, imageUrl?: string): Json {
  return {
    '@type': 'BlogPosting',
    headline: conseil.title,
    description: conseil.summary,
    datePublished: conseil.date,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    inLanguage: 'fr-FR',
    ...(imageUrl ? { image: imageUrl } : {}),
    author: { '@type': site.business.schemaType || schemaTypeForTrade(site.business.trade), name: site.business.name },
    publisher: { '@type': site.business.schemaType || schemaTypeForTrade(site.business.trade), name: site.business.name },
  };
}

/**
 * Product d'une fiche /produits/<slug> (architecture gamme-vitrine, src/pages/produits/[slug].astro) : nom, photo,
 * famille et description SI le client les donne ; `offers` seulement avec un prix (prixEnOffre de
 * src/lib/produits.ts : « 6,50 € » devient un prix numérique en EUR, un prix en texte reste une description d'offre).
 * Jamais de prix deviné, jamais de note (aggregateRating) : voir CLAUDE.md § Où sont les choses.
 */
export function produitLd(site: Site, produit: Site['produits'][number], pageUrl: string, imageUrl: string, offre?: Record<string, string>): Json {
  return {
    '@type': 'Product',
    name: produit.nom,
    url: pageUrl,
    image: imageUrl,
    ...(produit.description ? { description: produit.description } : {}),
    ...(produit.categorie ? { category: produit.categorie } : {}),
    brand: { '@type': 'Brand', name: site.business.name },
    manufacturer: { '@type': site.business.schemaType || schemaTypeForTrade(site.business.trade), name: site.business.name },
    ...(offre ? { offers: offre } : {}),
  };
}
