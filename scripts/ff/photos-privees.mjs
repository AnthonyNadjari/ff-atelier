// Démo privée d'un prospect sans ses photos : `.gitignore` garde `sites/prospect-*/public/images/` en local (droits du
// commerce, pas les nôtres). En CI, ses images répondent 404 et Chrome écrit « Failed to load resource » dans la console.
// Ces erreurs-là, et seulement elles, ne sont pas une panne (scripts/captures.mjs, scripts/ff/audit-motion.mjs).
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Vrai si le site est une démo prospect-* dont les photos ne sont pas sur ce poste (CI, clone neuf). */
export function photosPriveesAbsentes(slug, racine = '.') {
  return slug.startsWith('prospect-') && !existsSync(join(racine, 'sites', slug, 'public', 'images'));
}

/**
 * Erreurs console à garder : si les photos privées manquent ET que tous les 404 de la page sont sous /images/, on retire
 * les « Failed to load resource » ; sinon tout reste. Retourne { gardees, ignorees }.
 */
export function filtrerErreursPhotosPrivees(erreurs, absents, photosAbsentes) {
  const seulementPhotos = photosAbsentes && absents.length > 0 && absents.every((u) => u.startsWith('/images/'));
  if (!seulementPhotos) return { gardees: [...erreurs], ignorees: [] };
  const ignorees = erreurs.filter((t) => t.startsWith('Failed to load resource'));
  return { gardees: erreurs.filter((t) => !t.startsWith('Failed to load resource')), ignorees };
}
