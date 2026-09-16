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
export function runAstro(cmd, slug, extraArgs = [], extraEnv = {}) {
  writeFFCurrent(slug);
  const env = { ...process.env, SITE: slug, ...extraEnv };
  const astroJs = path.join(ROOT, 'node_modules', 'astro', 'astro.js');
  const r = spawnSync(process.execPath, [astroJs, cmd, ...extraArgs], {
    stdio: 'inherit',
    cwd: ROOT,
    env,
  });
  return r.status ?? 1;
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
