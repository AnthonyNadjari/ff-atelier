// `ff figer <slug>` : fusionne sites/<slug>/look.json (ecrit par `ff studio`) dans site.config.ts
// de facon permanente, puis supprime look.json. Valide le resultat par un build ; si le build
// echoue, restaure site.config.ts et recree look.json, sans rien casser.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, SITES_DIR, resolveSlug, ok, fail, info } from './util.mjs';
import { extractTopLevelValue, setTopLevelValue } from './ts-literal.mjs';

export const LOOK_KEYS = ['direction', 'motion', 'scale', 'accent', 'typography', 'layout', 'wording'];

/**
 * Fusionne look.json dans site.config.ts pour `slug`. Ne quitte jamais le process : retourne
 * { ok: true } ou { ok: false, error }. Utilise a la fois par la commande CLI et par l'API studio.
 */
export function figerSite(slug) {
  const siteDir = path.join(SITES_DIR, slug);
  const configPath = path.join(siteDir, 'site.config.ts');
  const lookPath = path.join(siteDir, 'look.json');
  const backupPath = path.join(siteDir, 'site.config.ts.bak');

  if (!fs.existsSync(configPath)) {
    return { ok: false, error: `site.config.ts introuvable pour ${slug}.` };
  }
  if (!fs.existsSync(lookPath)) {
    return { ok: false, error: 'Aucun look.json a figer (rien a faire).' };
  }

  let look;
  try {
    look = JSON.parse(fs.readFileSync(lookPath, 'utf8'));
  } catch (e) {
    return { ok: false, error: `look.json illisible : ${e.message}` };
  }

  const originalConfig = fs.readFileSync(configPath, 'utf8');
  fs.writeFileSync(backupPath, originalConfig);

  // Comme applyLook() dans src/lib/site.ts : pour les cles objet (layout, typography, wording,
  // accent), on fusionne avec la valeur existante au lieu de l'ecraser — look.json ne contient
  // souvent qu'une surcharge partielle (ex: { layout: { hero: 'typographic' } }).
  let text = originalConfig;
  for (const key of LOOK_KEYS) {
    if (look[key] === undefined) continue;
    const current = extractTopLevelValue(text, key);
    const incoming = look[key];
    const isMergeable = (v) => v && typeof v === 'object' && !Array.isArray(v);
    const merged = isMergeable(current) && isMergeable(incoming) ? { ...current, ...incoming } : incoming;
    text = setTopLevelValue(text, key, merged, 'slug');
  }
  fs.writeFileSync(configPath, text);
  fs.rmSync(lookPath, { force: true });

  const astroJs = path.join(ROOT, 'node_modules', 'astro', 'astro.js');
  const build = spawnSync(process.execPath, [astroJs, 'build'], {
    cwd: ROOT,
    env: { ...process.env, SITE: slug },
    encoding: 'utf8',
  });

  if (build.status !== 0) {
    // Restaure l'etat d'avant figer : site.config.ts d'origine + look.json recree.
    fs.writeFileSync(configPath, originalConfig);
    fs.writeFileSync(lookPath, JSON.stringify(look, null, 2) + '\n');
    fs.rmSync(backupPath, { force: true });
    const output = `${build.stdout || ''}\n${build.stderr || ''}`.trim();
    return { ok: false, error: `Le build a echoue apres fusion, site.config.ts restaure.\n${output}` };
  }

  fs.rmSync(backupPath, { force: true });
  return { ok: true };
}

export function cmdFiger(args) {
  const slug = resolveSlug(args[0]);
  info(`Figer le look de ${slug} dans site.config.ts...`);
  const result = figerSite(slug);
  if (!result.ok) {
    fail(result.error);
    process.exit(1);
  }
  ok(`look.json fusionne dans sites/${slug}/site.config.ts et supprime. Build valide.`);
}
