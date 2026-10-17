/**
 * Les quinze photos de Guy Andries (raw/SOURCES.md : son site, meilleure taille servie), avec leur largeur réelle.
 * Elles font 283 à 800 px : aucune ne tient seule un premier écran. Règle de tout le site (direction.md) : une photo
 * ne s'affiche jamais à plus de 1,25 fois sa taille, densité d'écran comprise (`ff nettete`). D'où les plafonds :
 * ordinateur (DPR 2) largeur × 0,62 ; téléphone (DPR 3) largeur × 0,41.
 *   800 px : 496 px CSS sur ordinateur, 330 sur téléphone ;
 *   600 px : 372 / 246 ;  450 px : 279 / 184 ;  336 px : 208 / 138 ;  283 px : 175 / 116.
 * Textes alternatifs : ce qu'on voit sur la photo (brief § 8), sans lieu ni client (absents du brief).
 */
export type Photo = { src: string; alt: string; w: number; h: number };

const p = (nom: string, w: number, h: number, alt: string): Photo => ({ src: `/images/${nom}.webp`, alt, w, h });

export const PHOTOS = {
  'cuisine-01': p('cuisine-01', 794, 600, 'Cuisine aux façades en bois foncé, table haute en bois clair et tabourets'),
  'cuisine-02': p('cuisine-02', 794, 600, 'Cuisine aux façades en bois clair, crédence en inox devant un mur orange'),
  'cuisine-03': p('cuisine-03', 336, 448, 'Îlot de cuisine à plateau brun et façades blanches'),
  'cuisine-04': p('cuisine-04', 336, 448, 'Îlot en bois brut et plan de travail cuivré devant une baie vitrée'),
  'meuble-01': p('meuble-01', 450, 600, 'Table en bois et chaises jaunes devant un mur en mosaïque de bois'),
  'meuble-02': p('meuble-02', 795, 600, 'Buffet en bois clair à portes et tiroirs'),
  'meuble-03': p('meuble-03', 794, 600, 'Grande table en chêne entourée de chaises'),
  'bibliotheque-01': p('bibliotheque-01', 337, 600, 'Bibliothèque d’angle anthracite, du sol au plafond'),
  'bibliotheque-02': p('bibliotheque-02', 450, 600, 'Meuble bas en bois sous des niches cintrées blanches'),
  'bibliotheque-03': p('bibliotheque-03', 600, 600, 'Bibliothèque-cloison blanche ouverte, étagères garnies de livres et de plantes'),
  'agencement-01': p('agencement-01', 800, 378, 'Salon avec une bibliothèque murale en bois et des boiseries peintes'),
  'agencement-02': p('agencement-02', 450, 600, 'Placards blancs en cours de pose dans un couloir'),
  'agencement-03': p('agencement-03', 800, 599, 'Mur habillé de bois clair dans une salle de sport'),
  'menuiserie-01': p('menuiserie-01', 283, 600, 'Portillon en bois sous un porche'),
  'menuiserie-02': p('menuiserie-02', 452, 600, 'Fenêtre et volets en bois sur une façade de pierre'),
} as const;

export type NomPhoto = keyof typeof PHOTOS;

/** Photos de chaque rubrique (dans l'ordre d'affichage : la plus grande d'abord). */
export const PAR_RUBRIQUE: Record<string, NomPhoto[]> = {
  cuisines: ['cuisine-01', 'cuisine-04', 'cuisine-02', 'cuisine-03'],
  meubles: ['meuble-03', 'meuble-01', 'meuble-02'],
  bibliotheques: ['bibliotheque-03', 'bibliotheque-01', 'bibliotheque-02'],
  agencement: ['agencement-03', 'agencement-02', 'agencement-01'],
  menuiseries: ['menuiserie-02', 'menuiserie-01'],
};

/** Libellé de porte, dit comme le client le dirait au téléphone. */
export const PORTE: Record<string, string> = {
  cuisines: 'Votre cuisine',
  meubles: 'Un meuble',
  bibliotheques: 'Une bibliothèque',
  agencement: 'Une pièce à agencer',
  menuiseries: 'Fenêtres, volets, terrasse',
};

/** Route de chaque page de rubrique (sites/prospect-a-coeur-bois/pages/<slug>.astro). */
export const lienRubrique = (slug: string) => `/${slug}`;
