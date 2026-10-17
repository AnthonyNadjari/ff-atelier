/**
 * Les photos de chantier d'Alain Ballay (raw/SOURCES.md : sa page Réalisations), prises au téléphone, presque toutes
 * en hauteur. Textes alternatifs : ce qu'on voit (brief § 8), sans lieu ni client (absents du brief).
 * Les matériaux de l'échantillonnier sont ceux qu'on voit sur ces photos (brief § 8), rien de plus.
 */
export type Photo = { src: string; alt: string; w: number; h: number };
const p = (nom: string, w: number, h: number, alt: string): Photo => ({ src: `/images/${nom}.webp`, alt, w, h });

export const PHOTOS = {
  'accueil-01': p('accueil-01', 640, 1316, 'Terrasse en cours de carrelage, croisillons dans les joints'),
  'realisation-01': p('realisation-01', 4032, 3024, 'Barbecue maçonné en pierre avec un plan de travail et des portes en bois'),
  'realisation-06': p('realisation-06', 3024, 4032, 'Allée en préparation : natte orange posée, seau de mortier'),
  'realisation-12': p('realisation-12', 3024, 4032, 'Salle de bain en préparation, projecteur de chantier'),
  'realisation-18': p('realisation-18', 528, 960, 'Chape fraîche devant une baie vitrée'),
  'realisation-24': p('realisation-24', 2320, 4128, 'Marche et terrasse en cours, seaux de chantier'),
  'realisation-30': p('realisation-30', 1952, 4032, 'Carrelage effet bois posé jusqu’à la plinthe, dans un angle'),
  'realisation-36': p('realisation-36', 1952, 4032, 'Terrasse en grands carreaux en cours de pose, croisillons dans les joints, devant une porte bleue'),
  'realisation-42': p('realisation-42', 1952, 4032, 'Enduit en cours sur un ancien carrelage'),
  'realisation-48': p('realisation-48', 1952, 4032, 'Entrée de maison avec un mur habillé de pierre de parement et un sol carrelé'),
  'realisation-54': p('realisation-54', 3088, 4128, 'Allée carrelée en cours de pose'),
  'realisation-60': p('realisation-60', 3088, 4128, 'Cuisine d’été en brique en cours de construction'),
  'realisation-66': p('realisation-66', 3096, 4128, 'Dallage en opus incertum, pierres plates irrégulières jointoyées'),
  'realisation-72': p('realisation-72', 3096, 4128, 'Cour carrelée devant une porte de garage'),
  'realisation-78': p('realisation-78', 3096, 4128, 'Jardinière en pierre de parement sur un sol en ardoise'),
} as const;
export type NomPhoto = keyof typeof PHOTOS;

/** Photos de chaque travail (la première ouvre sa page). Démoussage et façades : aucune photo au brief. */
export const PAR_TRAVAIL: Record<string, NomPhoto[]> = {
  carrelage: ['realisation-36', 'realisation-54', 'realisation-72', 'realisation-30', 'realisation-42', 'realisation-12'],
  parement: ['realisation-48', 'realisation-78'],
  'cuisines-d-ete': ['realisation-01', 'realisation-60'],
  // La chape (realisation-18) fait 528 px : trop petite pour la galerie pleine largeur, laissée de côté.
  maconnerie: ['realisation-66', 'realisation-06', 'realisation-24'],
  demoussage: [],
  facades: [],
};

/**
 * L'échantillonnier : un matériau = un échantillon découpé dans SA photo (point de mire x / y en %, zoom), qui ouvre
 * le chantier en grand et la page du travail qui le pose.
 */
export const MATERIAUX: { nom: string; photo: NomPhoto; x: number; y: number; travail: string }[] = [
  { nom: 'Pierre de parement', photo: 'realisation-48', x: 62, y: 40, travail: 'parement' },
  { nom: 'Opus incertum', photo: 'realisation-66', x: 45, y: 55, travail: 'maconnerie' },
  { nom: 'Grands carreaux', photo: 'realisation-72', x: 50, y: 62, travail: 'carrelage' },
  { nom: 'Effet bois', photo: 'realisation-30', x: 55, y: 82, travail: 'carrelage' },
  { nom: 'Brique', photo: 'realisation-60', x: 45, y: 38, travail: 'cuisines-d-ete' },
  { nom: 'Ardoise', photo: 'realisation-78', x: 50, y: 62, travail: 'parement' },
];

/** Libellé de porte, dit comme au téléphone. */
export const PORTE: Record<string, string> = {
  carrelage: 'Une terrasse, une salle de bain',
  parement: 'Un mur en pierre',
  'cuisines-d-ete': 'Un barbecue',
  maconnerie: 'Un mur, une fissure, une allée',
  demoussage: 'Un toit à démousser',
  facades: 'Une façade à nettoyer',
};

/** Image dérivée (images-derivees.cjs) : ech-, carte-, vue-, cours- + nom de la photo. */
export const derivee = (prefixe: string, nom: NomPhoto) => `/images/${prefixe}-${nom}.webp`;

export const lienTravail = (slug: string) => `/${slug}`;
