// Helpers partages par les commandes de scripts/ff/*.mjs.
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

// scripts/ff/util.mjs -> racine du projet = deux niveaux au-dessus.
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SITES_DIR = path.join(ROOT, 'sites');
export const DIST_DIR = path.join(ROOT, 'dist');
export const FF_CURRENT = path.join(ROOT, '.ff-current');

const supportsColor = Boolean(process.stdout.isTTY);
function wrap(code) {
  return (s) => (supportsColor ? `\x1b[${code}m${s}\x1b[0m` : String(s));
}
export const c = {
  red: wrap(31),
  green: wrap(32),
  yellow: wrap(33),
  blue: wrap(34),
  cyan: wrap(36),
  bold: wrap(1),
  dim: wrap(2),
};

export function ok(msg) {
  console.log(`${c.green('✓')} ${msg}`);
}
export function fail(msg) {
  console.log(`${c.red('✗')} ${msg}`);
}
export function warn(msg) {
  console.log(`${c.yellow('!')} ${msg}`);
}
export function info(msg = '') {
  console.log(msg);
}

export function readFFCurrent() {
  return fs.existsSync(FF_CURRENT) ? fs.readFileSync(FF_CURRENT, 'utf8').trim() : '';
}
export function writeFFCurrent(slug) {
  fs.writeFileSync(FF_CURRENT, slug);
}

/** Liste les dossiers de sites/, tries. */
export function listSites({ excludeTestPrefix = false, excludeUnderscore = false } = {}) {
  if (!fs.existsSync(SITES_DIR)) return [];
  return fs
    .readdirSync(SITES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => !(excludeTestPrefix && name.startsWith('_test')))
    .filter((name) => !(excludeUnderscore && name.startsWith('_')))
    .sort();
}

export function siteExists(slug) {
  return Boolean(slug) && fs.existsSync(path.join(SITES_DIR, slug, 'site.config.ts'));
}

/** Resout le slug a utiliser : argument explicite, sinon .ff-current. Quitte le process si introuvable. */
export function resolveSlug(argSlug, { mustExist = true } = {}) {
  const slug = argSlug || readFFCurrent();
  if (!slug) {
    fail("Aucun site precise et aucun site courant (.ff-current). Indique un slug, ex : `ff dev mon-site`.");
    process.exit(1);
  }
  if (mustExist && !siteExists(slug)) {
    fail(`Site introuvable : sites/${slug}. Lance \`ff nouveau ${slug}\` d'abord.`);
    process.exit(1);
  }
  return slug;
}

/** Lance `node node_modules/astro/astro.js <cmd>` avec SITE=<slug>, sans quitter le process. */
export function runAstro(cmd, slug, extraArgs = [], extraEnv = {}, { silencieux = false } = {}) {
  writeFFCurrent(slug);
  const env = { ...process.env, SITE: slug, ...extraEnv };
  const astroJs = path.join(ROOT, 'node_modules', 'astro', 'astro.js');
  const r = spawnSync(process.execPath, [astroJs, cmd, ...extraArgs], {
    stdio: silencieux ? 'pipe' : 'inherit',
    cwd: ROOT,
    env,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  // Silencieux : la centaine de lignes de Vite ne s'affiche qu'en cas d'echec (la fin, la ou est l'erreur).
  if (silencieux && r.status !== 0) process.stdout.write(`${r.stdout || ''}${r.stderr || ''}`.split(/\r?\n/).slice(-60).join('\n') + '\n');
  return r.status ?? 1;
}

// ---- .env (cle API) ----
function parseDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const rawLine of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}
let _dotEnvCache = null;
/** Lit une cle : environnement d'abord, sinon .env a la racine (parse a la main, sans dependance). */
export function envKey(name) {
  if (process.env[name]) return process.env[name];
  if (_dotEnvCache === null) _dotEnvCache = parseDotEnv(path.join(ROOT, '.env'));
  return _dotEnvCache[name] || '';
}

/** Slug simple (minuscules, sans accents, tirets) pour un nom de fichier derive d'un texte libre. */
export function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'sans-titre';
}

/** Ajoute une entree au manifeste d'attribution sites/<slug>/CREDITS.md (cree l'entete si absent). */
export function appendCredits(slug, block) {
  const dest = path.join(SITES_DIR, slug, 'CREDITS.md');
  if (!fs.existsSync(dest)) {
    fs.writeFileSync(
      dest,
      '# Crédits\n\n' +
        "Origine, licence et attribution des visuels tiers utilisés sur ce site — généré par " +
        '`ff photos` / `ff video` / `ff illustration`. Ne pas supprimer une entrée tant que le fichier ' +
        "qu'elle décrit reste utilisé sur le site.\n",
    );
  }
  fs.appendFileSync(dest, `\n${block.trim()}\n`);
}

/** Parseur d'arguments minimal : positionnels + --flag valeur / --flag=valeur / --flag (booleen). */
export function parseArgs(argv) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq !== -1) {
        flags[a.slice(2, eq)] = a.slice(eq + 1);
      } else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
        flags[a.slice(2)] = argv[++i];
      } else {
        flags[a.slice(2)] = true;
      }
    } else {
      positional.push(a);
    }
  }
  return { positional, flags };
}
