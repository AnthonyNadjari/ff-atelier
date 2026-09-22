/**
 * Parseur de sites/<slug>/CREDITS.md (module pur, aucune dependance — meme convention que
 * schemaType.ts/jsonld.ts, teste hors contexte Vite via scripts/ff/ts-loader.mjs).
 *
 * Format ecrit par appendCredits() (scripts/ff/util.mjs) + blocCredits() (scripts/ff/photos.mjs) /
 * les blocs equivalents de video.mjs et animer.mjs : un titre "## <cible>" suivi de lignes
 * "- Cle : valeur". Les cles reconnues ici : Titre, Auteur/Createur, Source, Licence,
 * "Attribution a afficher (obligatoire)", Recadrage. Toute autre ligne (Modele, Prompt, Marquage
 * AI Act...) est ignoree sans erreur — un bloc `ff animer`/`ff video` reste parsable, juste sans
 * attribution a afficher sur /credits (src/pages-optional/credits.astro filtre sur `attribution`).
 */

export interface CreditEntry {
  /** Texte apres "## " (ex: "raw/hero.jpg -> public/images/hero.webp (via ff images)"). */
  target: string;
  title: string | null;
  author: string | null;
  authorUrl: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  licenceLabel: string | null;
  licenceUrl: string | null;
  /** Texte exact entre « » de la ligne "Attribution a afficher (obligatoire)" ; null si absente
   *  (licence sans attribution requise, ex. CC0/domaine public/Unsplash/Pexels). */
  attribution: string | null;
  /** Presence d'une ligne "Recadrage :" (adaptation de l'image d'origine). */
  cropped: boolean;
}

const FIELD_RE = /^-\s*([^:]+?)\s*:\s*(.*)$/;
// "Nom (https://...)" -> [nom, url] ; le nom peut lui-meme contenir des parentheses (ex. sources
// composees "Openverse (wikimedia)"), seule la DERNIERE parenthese contenant une URL http(s) compte.
const TRAILING_URL_RE = /^(.*?)\s*\((https?:\/\/[^)]+)\)\s*$/;
const QUOTED_RE = /«\s*(.*?)\s*»/;

function splitTrailingUrl(value: string): { label: string; url: string | null } {
  const m = TRAILING_URL_RE.exec(value);
  return m ? { label: m[1].trim(), url: m[2].trim() } : { label: value.trim(), url: null };
}

/** Premier segment avant un tiret cadratin " — " (ex. "CC BY-SA 3.0 — CC BY-SA — ..." -> "CC BY-SA 3.0"). */
function firstSegment(value: string): string {
  return value.split(/\s+—\s+/)[0].trim();
}

/**
 * Parse le contenu de CREDITS.md en une entree par bloc "## ...". Ne leve jamais : un champ
 * manquant ou une ligne inattendue reste simplement absent/ignoree.
 */
export function parseCredits(md: string): CreditEntry[] {
  if (!md || !md.trim()) return [];
  const blocks = md.split(/\n(?=##[ \t])/).filter((b) => /^##[ \t]/.test(b.trim()));
  const entries: CreditEntry[] = [];
  for (const block of blocks) {
    const lines = block
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) continue;
    const target = lines[0].replace(/^##[ \t]*/, '').trim();
    if (!target) continue;
    const entry: CreditEntry = {
      target,
      title: null,
      author: null,
      authorUrl: null,
      sourceName: null,
      sourceUrl: null,
      licenceLabel: null,
      licenceUrl: null,
      attribution: null,
      cropped: false,
    };
    for (const line of lines.slice(1)) {
      const m = FIELD_RE.exec(line);
      if (!m) continue;
      const key = m[1].trim().toLowerCase();
      const value = m[2].trim();
      if (!value) continue;
      if (key === 'titre') {
        entry.title = value;
      } else if (key === 'auteur' || key === 'createur' || key === 'créateur') {
        const { label, url } = splitTrailingUrl(value);
        entry.author = label;
        entry.authorUrl = url;
      } else if (key === 'source') {
        const [name, url] = value.split(/\s+—\s+/);
        entry.sourceName = (name ?? value).trim();
        entry.sourceUrl = url ? url.trim() : null;
      } else if (key === 'licence') {
        const { label, url } = splitTrailingUrl(value);
        entry.licenceLabel = firstSegment(label);
        entry.licenceUrl = url;
      } else if (key.startsWith('attribution')) {
        const q = QUOTED_RE.exec(value);
        entry.attribution = (q ? q[1] : value).trim();
      } else if (key === 'recadrage') {
        entry.cropped = true;
      }
    }
    entries.push(entry);
  }
  return entries;
}

/** Vrai si l'entree porte une mention d'attribution obligatoire (CC BY / CC BY-SA en pratique). */
export function requiresAttribution(entry: CreditEntry): boolean {
  return Boolean(entry.attribution);
}

/** Sous-ensemble des entrees a afficher sur /credits : celles qui exigent une attribution visible. */
export function entriesRequiringAttribution(entries: CreditEntry[]): CreditEntry[] {
  return entries.filter(requiresAttribution);
}
