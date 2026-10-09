/**
 * Lecteur de sites/finck-fisch/preuves.json (preuve vivante, plan-site-ff.html v2 § 7), au build.
 * Renvoie null — et la section n'affiche pas le fait — si le fichier manque, est illisible, si la
 * mesure a plus de 30 jours ou si la performance est sous 95.
 */
export type Preuves = {
  url: string;
  source?: string;
  date: string; // AAAA-MM-JJ
  appareil: 'mobile';
  performance: number;
  accessibilite: number;
  bonnesPratiques: number;
  seo: number;
  lcp?: number;
  cls?: number;
  inp?: number;
  tbt?: number;
};

export const SEUIL_PERF = 95;
export const AGE_MAX_JOURS = 30;

const fichiers = import.meta.glob<{ default: Preuves }>('../preuves.json', { eager: true });

/** Fonction pure : décide si une mesure peut être affichée à la date `maintenant`. */
export function preuvesAffichables(p: Partial<Preuves> | null | undefined, maintenant = new Date()): p is Preuves {
  if (!p || typeof p.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(p.date)) return false;
  for (const k of ['performance', 'accessibilite', 'bonnesPratiques', 'seo'] as const) {
    if (typeof p[k] !== 'number' || p[k]! < 0 || p[k]! > 100) return false;
  }
  if (p.performance! < SEUIL_PERF) return false;
  const age = (maintenant.getTime() - new Date(`${p.date}T00:00:00Z`).getTime()) / 86_400_000;
  return age >= -1 && age <= AGE_MAX_JOURS;
}

export function lirePreuves(maintenant = new Date()): Preuves | null {
  const p = Object.values(fichiers)[0]?.default;
  return preuvesAffichables(p, maintenant) ? p : null;
}
