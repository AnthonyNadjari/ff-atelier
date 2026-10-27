/**
 * La carte des soins (services[].lignes[].duree) : architecture `carte-des-soins` (src/lib/architectures.ts ; source
 * Institut La Douce Heure, Saint-Sébastien-sur-Loire, seconde source Beauty Elite, Nantes ;
 * docs/veille/architectures/carte-des-soins.md). Sur la source, chaque soin dit « 40min | 45€ » et « C'est parti » :
 * on choisit un soin par le temps qu'on a autant que par la famille. Le site range donc les soins par durée.
 *
 *   - minutesDeDuree() : « 1 h 15 », « 1h15 », « 40 min », « 1 h », « 90 minutes » → minutes ; illisible → NaN ;
 *   - soinsDates()     : les lignes de toutes les familles qui ont une durée lisible (mesure `soins` de donneesManquantes) ;
 *   - tranches()       : les tranches de durée qui ont au moins un soin (moins de 30 min, de 30 min à 1 h, plus d'une
 *                        heure) ; moins de deux tranches = pas d'onglets (un seul onglet ne trie rien).
 *
 * Module pur, sans import. Testé par tests/architectures-soins.test.mjs via scripts/ff/ts-loader.mjs (loadSoinsModule).
 */

export interface LigneSoin {
  nom: string;
  prix?: string;
  detail?: string;
  duree?: string;
}

export interface FamilleSoins {
  slug: string;
  title: string;
  lignes?: readonly LigneSoin[];
}

export interface SoinDate extends LigneSoin {
  minutes: number;
  famille: string;
  slug: string;
}

export interface Tranche {
  id: string;
  label: string;
  soins: SoinDate[];
}

export function minutesDeDuree(d: string | undefined): number {
  const t = (d ?? '').toLowerCase().replace(/\s+/g, '');
  let m = /^(\d{1,2})h(\d{1,2})?(?:min)?$/.exec(t);
  if (m) return Number(m[1]) * 60 + Number(m[2] ?? 0);
  m = /^(\d{1,3})(?:min|mn|minutes?)$/.exec(t);
  if (m) return Number(m[1]);
  return NaN;
}

export function soinsDates(familles: readonly FamilleSoins[]): SoinDate[] {
  const out: SoinDate[] = [];
  for (const f of familles) {
    for (const l of f.lignes ?? []) {
      const minutes = minutesDeDuree(l.duree);
      if (Number.isFinite(minutes) && minutes > 0) out.push({ ...l, minutes, famille: f.title, slug: f.slug });
    }
  }
  return out;
}

const BORNES = [
  { id: 'court', label: 'Moins de 30 min', max: 30 },
  { id: 'moyen', label: 'De 30 min à 1 h', max: 60 },
  { id: 'long', label: 'Plus d’une heure', max: Infinity },
];

export function tranches(soins: readonly SoinDate[]): Tranche[] {
  const out: Tranche[] = [];
  let min = 0;
  for (const b of BORNES) {
    const lo = min;
    const dedans = soins.filter((s) => s.minutes > lo && s.minutes <= b.max).sort((a, c) => a.minutes - c.minutes);
    if (dedans.length > 0) out.push({ id: b.id, label: b.label, soins: dedans });
    min = b.max;
  }
  return out.length >= 2 ? out : [];
}
