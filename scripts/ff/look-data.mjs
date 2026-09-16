// Lecture des sources de verite pour `ff composer`/`ff propositions`/`ff og` : directions (meta.ts),
// polices (fonts.ts), variantes (schema.ts), et usage actuel des sites existants (site.config.ts + look.json).
// Parse tout par regex/eval controle sur le texte du projet (jamais de compilation TS), comme le reste
// de l'atelier (voir variete.mjs, ts-literal.mjs).
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SITES_DIR, listSites } from './util.mjs';
import { extractTopLevelValue } from './ts-literal.mjs';

const DIRECTIONS_DIR = path.join(ROOT, 'src', 'directions');
const SCHEMA_PATH = path.join(ROOT, 'src', 'lib', 'schema.ts');
const FONTS_PATH = path.join(ROOT, 'src', 'lib', 'fonts.ts');

/** PRNG deterministe (mulberry32) a partir d'une graine entiere. */
export function mulberry32(seed) {
  let t = seed >>> 0;
  return function rng() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFromString(s) {
  let h = 2166136261;
  for (const ch of String(s)) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Choisit, parmi `candidates`, celui utilise le moins souvent (compteur `counts`) ; depart des ex-aequo par `rng`. */
export function pickLeastUsed(candidates, counts, rng) {
  if (candidates.length === 0) return undefined;
  let min = Infinity;
  for (const cand of candidates) min = Math.min(min, counts.get(cand) || 0);
  const tied = candidates.filter((cand) => (counts.get(cand) || 0) === min);
  return tied[Math.floor(rng() * tied.length) % tied.length];
}

/** Trie `items` par score decroissant ; depart des ex-aequo par `rng` (deterministe pour une graine donnee). */
export function rankWithTies(items, scoreFn, rng) {
  const withKey = items.map((it) => ({ it, score: scoreFn(it), key: rng() }));
  withKey.sort((a, b) => b.score - a.score || b.key - a.key);
  return withKey.map((w) => w.it);
}

/**
 * Liste les directions disponibles (dossiers de src/directions/ ayant un meta.ts valide).
 * Ne jamais figer cette liste ailleurs : certaines directions n'ont pas encore leur meta.ts.
 */
export function listDirectionMetas() {
  if (!fs.existsSync(DIRECTIONS_DIR)) return [];
  return fs
    .readdirSync(DIRECTIONS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
    .map((name) => {
      const metaPath = path.join(DIRECTIONS_DIR, name, 'meta.ts');
      if (!fs.existsSync(metaPath)) return null;
      const src = fs.readFileSync(metaPath, 'utf8');
      const body = src.replace(/^[\s\S]*?export default\s*/, '').replace(/;\s*$/, '');
      try {
        const obj = new Function(`"use strict"; return (${body});`)();
        return { dir: name, metiers: [], eviter: [], motionParDefaut: 'subtle', ...obj };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

/** Tokens CSS de la direction (couleurs + polices par defaut), parses depuis index.css. */
export function parseDirectionCss(dir) {
  const cssPath = path.join(DIRECTIONS_DIR, dir, 'index.css');
  if (!fs.existsSync(cssPath)) return null;
  const src = fs.readFileSync(cssPath, 'utf8');
  const one = (re) => {
    const m = src.match(re);
    return m ? m[1].trim() : undefined;
  };
  return {
    bg: one(/--bg:\s*([^;]+);/),
    fg: one(/--fg:\s*([^;]+);/),
    accentH: one(/--accent-h:\s*([^;]+);/),
    accentS: one(/--accent-s:\s*([^;]+);/),
    accentL: one(/--accent-l:\s*([^;]+);/),
    fontDisplay: one(/--font-display:\s*([^;]+);/),
    fontBody: one(/--font-body:\s*([^;]+);/),
  };
}

/** Catalogue des polices (src/lib/fonts.ts) : { key, family, role, mood }[]. */
export function parseFonts() {
  const src = fs.readFileSync(FONTS_PATH, 'utf8');
  const re = /(\w+):\s*\{\s*family:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'),[\s\S]*?role:\s*'([^']+)',\s*mood:\s*'([^']+)'\s*\}/g;
  const out = [];
  for (const m of src.matchAll(re)) {
    out.push({ key: m[1], family: m[2].slice(1, -1), role: m[3], mood: m[4] });
  }
  return out;
}

/** Premier nom de police d'une valeur `font-family` CSS (ex: "'Fraunces Variable', Georgia, serif" -> "Fraunces Variable"). */
export function primaryFamily(familyStr) {
  if (!familyStr) return undefined;
  const m = familyStr.match(/'([^']+)'|"([^"]+)"/);
  return (m ? m[1] || m[2] : familyStr).trim();
}

/** Extrait VARIANTS, DIRECTIONS, SCALES, DIVIDERS, TONES de src/lib/schema.ts (jamais code en dur ici). */
export function parseSchemaConstants() {
  const src = fs.readFileSync(SCHEMA_PATH, 'utf8');
  const strings = (block) => [...block.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  const variantsBlock = (src.match(/export const VARIANTS = \{([\s\S]*?)\}\s*as const;/) || [])[1] || '';
  const variants = {};
  for (const m of variantsBlock.matchAll(/(\w+):\s*\[([^\]]*)\]/g)) {
    variants[m[1]] = strings(m[2]);
  }
  const grab = (name) => strings((src.match(new RegExp(`export const ${name} = \\[([\\s\\S]*?)\\]\\s*as const;`)) || [])[1] || '');
  return {
    VARIANTS: variants,
    DIRECTIONS: grab('DIRECTIONS'),
    SCALES: grab('SCALES'),
    DIVIDERS: grab('DIVIDERS'),
    TONES: grab('TONES'),
  };
}

/** Lit les champs utiles d'un site.config.ts par cle top-level (reutilise ts-literal.mjs, gere les objets imbriques). */
export function readConfigParts(slug) {
  const cfgPath = path.join(SITES_DIR, slug, 'site.config.ts');
  if (!fs.existsSync(cfgPath)) return null;
  const text = fs.readFileSync(cfgPath, 'utf8');
  return {
    text,
    direction: extractTopLevelValue(text, 'direction'),
    motion: extractTopLevelValue(text, 'motion'),
    scale: extractTopLevelValue(text, 'scale'),
    typography: extractTopLevelValue(text, 'typography') || {},
    layout: extractTopLevelValue(text, 'layout') || {},
    business: extractTopLevelValue(text, 'business') || {},
    contact: extractTopLevelValue(text, 'contact') || {},
    zones: extractTopLevelValue(text, 'zones') || {},
    proof: extractTopLevelValue(text, 'proof') || {},
    faq: extractTopLevelValue(text, 'faq') || [],
    process: extractTopLevelValue(text, 'process') || [],
    images: extractTopLevelValue(text, 'images') || {},
  };
}

/** look.json (s'il existe), parse en JSON simple. */
export function readLookJson(slug) {
  const lookPath = path.join(SITES_DIR, slug, 'look.json');
  if (!fs.existsSync(lookPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(lookPath, 'utf8'));
  } catch {
    return null;
  }
}

const LAYOUT_DEFAULTS = { nav: 'bar', hero: 'split', footer: 'columns', divider: 'none', tone: 'flat' };

/** Le look effectivement affiche pour `slug` : site.config.ts fusionne avec look.json (comme src/lib/site.ts). */
export function effectiveLook(slug) {
  const cfg = readConfigParts(slug);
  if (!cfg) return null;
  const base = {
    direction: cfg.direction,
    motion: cfg.motion,
    scale: cfg.scale,
    typography: { ...cfg.typography },
    nav: cfg.layout.nav || LAYOUT_DEFAULTS.nav,
    hero: cfg.layout.hero || LAYOUT_DEFAULTS.hero,
    footer: cfg.layout.footer || LAYOUT_DEFAULTS.footer,
    divider: cfg.layout.divider || LAYOUT_DEFAULTS.divider,
    tone: cfg.layout.tone || LAYOUT_DEFAULTS.tone,
    sections: cfg.layout.sections || [],
  };
  const look = readLookJson(slug);
  if (!look) return base;
  const merged = { ...base };
  if (look.direction) merged.direction = look.direction;
  if (look.motion) merged.motion = look.motion;
  if (look.scale) merged.scale = look.scale;
  if (look.typography) merged.typography = { ...base.typography, ...look.typography };
  if (look.layout) {
    if (look.layout.nav) merged.nav = look.layout.nav;
    if (look.layout.hero) merged.hero = look.layout.hero;
    if (look.layout.footer) merged.footer = look.layout.footer;
    if (look.layout.divider) merged.divider = look.layout.divider;
    if (look.layout.tone) merged.tone = look.layout.tone;
    if (look.layout.sections) merged.sections = look.layout.sections;
  }
  return merged;
}

function bump(map, key) {
  if (!key) return;
  map.set(key, (map.get(key) || 0) + 1);
}

/**
 * Statistiques d'usage sur tous les sites existants (hors `excludeSlug`) : compteur par direction,
 * paires direction+hero deja utilisees, compteur par variante (tous types de section confondus),
 * paires de polices (typography.display+body) deja utilisees.
 */
export function usageStats(excludeSlug) {
  const slugs = listSites().filter((s) => s !== excludeSlug);
  const directionCounts = new Map();
  const dirHeroUsed = new Set();
  const variantCounts = {};
  const typoPairsUsed = new Set();

  for (const s of slugs) {
    const look = effectiveLook(s);
    if (!look) continue;
    bump(directionCounts, look.direction);
    if (look.direction && look.hero) dirHeroUsed.add(`${look.direction}|${look.hero}`);
    variantCounts.nav ??= new Map();
    variantCounts.hero ??= new Map();
    variantCounts.footer ??= new Map();
    bump(variantCounts.nav, look.nav);
    bump(variantCounts.hero, look.hero);
    bump(variantCounts.footer, look.footer);
    for (const sec of look.sections || []) {
      variantCounts[sec.type] ??= new Map();
      bump(variantCounts[sec.type], sec.variant);
    }
    if (look.typography?.display && look.typography?.body) {
      typoPairsUsed.add(`${look.typography.display}|${look.typography.body}`);
    }
  }
  return { directionCounts, dirHeroUsed, variantCounts, typoPairsUsed };
}
