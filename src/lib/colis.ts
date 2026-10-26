/**
 * La réparation par colis (site.envoi) : architecture `atelier-par-colis` (src/lib/architectures.ts ; source La
 * Cordonnerie Alpine, Albertville, seconde source AGH, horloger à Lectoure ; docs/veille/architectures/atelier-par-colis.md).
 * Deux chemins vers l'atelier : on vient, ou on envoie ; l'objet voyage (chez vous, la poste, l'atelier, le retour) et
 * le site suit ce voyage.
 *
 *   - etapesCompletes() : étapes qui disent où est l'objet et ce qui se passe (mesure `envoi` de donneesManquantes) ;
 *   - pisteDEnvoi()     : vrai dès 3 étapes complètes (en dessous, pas de piste : une liste ne voyage pas) ;
 *   - adresseDEnvoi()   : l'adresse donnée pour les colis, sinon celle de l'atelier (jamais devinée) ;
 *   - lienEnvoi()       : entrée de nav vers /envoyer, seulement avec une piste.
 *
 * Module pur, sans import. Testé par tests/architectures-atelier.test.mjs via scripts/ff/ts-loader.mjs (loadColisModule).
 */

export interface EtapeEnvoi {
  ou?: string;
  titre?: string;
  texte?: string;
}

export interface Envoi {
  etapes?: EtapeEnvoi[];
  adresse?: string;
}

export function etapesCompletes<T extends EtapeEnvoi>(e: { etapes?: readonly T[] } | undefined): T[] {
  return (e?.etapes ?? []).filter((x) => (x.ou ?? '').trim() && (x.titre ?? '').trim());
}

export function pisteDEnvoi(e: Envoi | undefined): boolean {
  return etapesCompletes(e).length >= 3;
}

export function adresseDEnvoi(e: Envoi | undefined, nom: string, adresseAtelier: string): string[] {
  const a = (e?.adresse ?? '').trim();
  return [nom, ...(a ? a.split(/\n|,\s*(?=\d)/) : adresseAtelier.split(/,\s*(?=\d)/)).map((x) => x.trim()).filter(Boolean)];
}

export function lienEnvoi(e: Envoi | undefined, label: string): { href: string; label: string } | undefined {
  return pisteDEnvoi(e) ? { href: '/envoyer', label } : undefined;
}
