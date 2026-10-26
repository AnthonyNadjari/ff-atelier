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

/**
 * LocalBusiness d'une adresse (architecture pages-adresses, src/pages/adresses/[slug].astro) : le type du site, le nom
 * « Maison, lieu », l'adresse, le téléphone et les horaires de CE lieu (openingHoursSpecification des lignes à
 * opens/closes), geo si donné, rattaché à la maison (parentOrganization). Les données de test (06 00 00 00 00, 75000)
 * ne partent jamais : l'appelant passe `test` (même règle que Base.astro).
 */
export function lieuLd(site: Site, lieu: Site['lieux'][number], pageUrl: string, imageUrl?: string, test: { tel?: boolean; adresse?: boolean } = {}): Json {
  const type = site.business.schemaType || schemaTypeForTrade(site.business.trade);
  const ohs = openingHoursSpecification(lieu.hours);
  return {
    '@type': type,
    name: `${site.business.name}, ${lieu.nom}`,
    url: pageUrl,
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(!test.tel ? { telephone: lieu.phone ?? site.contact.phone } : {}),
    ...(!test.adresse
      ? { address: { '@type': 'PostalAddress', streetAddress: lieu.address.street, postalCode: lieu.address.postalCode, addressLocality: lieu.address.city, addressCountry: 'FR' } }
      : {}),
    ...(lieu.coordinates ? { geo: { '@type': 'GeoCoordinates', latitude: lieu.coordinates.lat, longitude: lieu.coordinates.lng } } : {}),
    ...(ohs ? { openingHoursSpecification: ohs } : lieu.hours.length > 0 ? { openingHours: lieu.hours.map((h) => `${h.days} ${h.hours}`) } : {}),
    ...(lieu.since ? { foundingDate: String(lieu.since) } : {}),
    parentOrganization: { '@type': type, name: site.business.name },
  };
}

/**
 * Une étape de tournée (site.tournee, architecture tournee-semaine, src/pages/tournee/[commune].astro) : le commerce,
 * sans adresse fixe, avec une `Place` par étape de CETTE commune (repère, commune, coordonnées) et ses horaires
 * (openingHoursSpecification des étapes qui donnent opens/closes). Jamais d'aggregateRating ; jamais un téléphone de
 * test (`test.tel`, mêmes repères que Base.astro).
 */
export function tourneeLd(site: Site, commune: string, etapes: Site['tournee'], pageUrl: string, test: { tel?: boolean } = {}): Json {
  const type = site.business.schemaType || schemaTypeForTrade(site.business.trade);
  const ohs = openingHoursSpecification(etapes.map((e) => ({ days: e.jour, hours: e.hours, opens: e.opens, closes: e.closes })));
  const tel = etapes.find((e) => e.phone)?.phone ?? site.contact.phone;
  return {
    '@type': type,
    name: `${site.business.name}, ${commune}`,
    url: pageUrl,
    ...(!test.tel ? { telephone: tel } : {}),
    areaServed: { '@type': 'City', name: commune },
    location: etapes.map((e) => ({
      '@type': 'Place',
      name: e.repere ? `${e.repere}, ${commune}` : commune,
      address: { '@type': 'PostalAddress', addressLocality: commune, addressCountry: 'FR' },
      ...(e.coordinates ? { geo: { '@type': 'GeoCoordinates', latitude: e.coordinates.lat, longitude: e.coordinates.lng } } : {}),
    })),
    ...(ohs ? { openingHoursSpecification: ohs } : { openingHours: etapes.map((e) => `${e.jour} ${e.hours}`) }),
    parentOrganization: { '@type': type, name: site.business.name },
  };
}

/**
 * Un artiste du salon (site.artistes, architecture artistes-residents, src/pages/artistes/[slug].astro) : une `Person`
 * qui travaille pour le commerce (worksFor), ses styles en knowsAbout, son Instagram en sameAs, son portrait si donné.
 * Rien qui ne soit sur la page ; jamais de note agrégée.
 */
export function artisteLd(site: Site, a: Site['artistes'][number], pageUrl: string, imageUrl?: string): Json {
  const type = site.business.schemaType || schemaTypeForTrade(site.business.trade);
  return {
    '@type': 'Person',
    name: a.nom,
    url: pageUrl,
    ...(a.role ? { jobTitle: a.role } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(a.styles.length > 0 ? { knowsAbout: a.styles } : {}),
    ...(a.instagram ? { sameAs: [a.instagram] } : {}),
    worksFor: { '@type': type, name: site.business.name },
  };
}

/**
 * Une fête du calendrier (site.fetes, architecture calendrier-fetes, src/pages/fetes/[slug].astro) : un `OfferCatalog`
 * des lignes de la fête, chaque ligne une `Offer` (prix structuré seulement s'il est donné en euros, sinon en texte,
 * jamais deviné), avec la période de validité (validFrom / validThrough) ; proposé par le commerce.
 */
export function feteLd(site: Site, f: Site['fetes'][number], pageUrl: string): Json {
  const type = site.business.schemaType || schemaTypeForTrade(site.business.trade);
  return {
    '@type': 'OfferCatalog',
    name: `${f.nom}, ${site.business.name}`,
    url: pageUrl,
    itemListElement: f.lignes.map((l) => {
      const m = l.prix ? /^\s*(\d+(?:[.,]\d{1,2})?)\s*(?:€|EUR|euros?)\s*$/i.exec(l.prix) : null;
      return {
        '@type': 'Offer',
        itemOffered: { '@type': 'Product', name: l.nom, ...(l.detail ? { description: l.detail } : {}) },
        ...(m ? { price: m[1].replace(',', '.'), priceCurrency: 'EUR' } : l.prix ? { description: l.prix } : {}),
        validFrom: f.du,
        validThrough: f.au,
      };
    }),
    provider: { '@type': type, name: site.business.name },
  };
}

/**
 * Un barreau du parcours (site.parcours, architecture parcours-atelier, src/pages/parcours/[slug].astro) : un `Service`
 * proposé par le commerce, ses formules en `OfferCatalog` (prix structuré seulement s'il est donné en euros, sinon en
 * texte, jamais deviné). Rien qui ne soit sur la page ; jamais de note agrégée.
 */
export function barreauLd(site: Site, b: Site['parcours'][number], pageUrl: string): Json {
  const type = site.business.schemaType || schemaTypeForTrade(site.business.trade);
  return {
    '@type': 'Service',
    name: b.titre,
    url: pageUrl,
    ...(b.phrase ? { description: b.phrase } : {}),
    provider: { '@type': type, name: site.business.name },
    areaServed: site.contact.address.city,
    ...(b.formules.length > 0
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: b.titre,
            itemListElement: b.formules.map((f) => {
              const m = f.prix ? /^\s*(\d+(?:[.,]\d{1,2})?)\s*(?:€|EUR|euros?)\s*$/i.exec(f.prix) : null;
              return {
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: f.nom, ...(f.detail ? { description: f.detail } : {}) },
                ...(m ? { price: m[1].replace(',', '.'), priceCurrency: 'EUR' } : f.prix ? { description: f.prix } : {}),
              };
            }),
          },
        }
      : {}),
  };
}
