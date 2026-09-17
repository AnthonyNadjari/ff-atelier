/**
 * Plugin Vite `virtual:ff-look` : resout AU BUILD la direction et les polices du site courant, et ne met
 * dans le graphe de modules QUE celles-la.
 *
 * Pourquoi : Astro regroupe dans la feuille de style de la page le CSS de tous les modules atteignables,
 * y compris ceux charges par `import()` / `import.meta.glob` paresseux. Avec un glob des 16 directions,
 * chaque site embarquait les 16 CSS et toutes leurs polices (feuille de 550 Ko, LCP mobile 4,8 s).
 *
 * Le look vient de : sites/<slug>/site.config.ts (regex), puis sites/<slug>/look.json, puis FF_LOOK.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const VIRTUAL = 'virtual:ff-look';
const RESOLVED = '\0' + VIRTUAL;

function parseConfigLook(text) {
  const look = {};
  const dir = text.match(/\bdirection:\s*'([a-z-]+)'/);
  if (dir) look.direction = dir[1];
  const typo = text.match(/\btypography:\s*\{([^}]*)\}/);
  if (typo) {
    const d = typo[1].match(/\bdisplay:\s*'(\w+)'/);
    const b = typo[1].match(/\bbody:\s*'(\w+)'/);
    look.typography = {};
    if (d) look.typography.display = d[1];
    if (b) look.typography.body = b[1];
  }
  return look;
}

/** Catalogue src/lib/fonts.ts lu en texte : cle -> { family, pkg }. */
function parseFonts(root) {
  const text = readFileSync(resolve(root, 'src/lib/fonts.ts'), 'utf8');
  const map = {};
  const re = /^\s*(\w+):\s*\{\s*family:\s*"([^"]+)",\s*pkg:\s*'([^']+)'/gm;
  let m;
  while ((m = re.exec(text))) map[m[1]] = { family: m[2], pkg: m[3] };
  return map;
}

export function resolveLook({ root, slug, ffLook }) {
  const siteDir = resolve(root, 'sites', slug);
  let look = {};
  const cfg = resolve(siteDir, 'site.config.ts');
  if (existsSync(cfg)) look = parseConfigLook(readFileSync(cfg, 'utf8'));
  const lookFile = resolve(siteDir, 'look.json');
  const overlays = [];
  if (existsSync(lookFile)) {
    try { overlays.push(JSON.parse(readFileSync(lookFile, 'utf8'))); } catch { /* ignore : site.ts previent */ }
  }
  if (ffLook) overlays.push(JSON.parse(ffLook));
  for (const o of overlays) {
    if (o.direction) look.direction = o.direction;
    if (o.typography) look.typography = { ...(look.typography ?? {}), ...o.typography };
  }
  look.direction ||= 'atelier';
  return look;
}

export function ffLookPlugin({ root, slug, ffLook }) {
  return {
    name: 'ff-look',
    resolveId(id) {
      return id === VIRTUAL ? RESOLVED : null;
    },
    load(id) {
      if (id !== RESOLVED) return null;
      const look = resolveLook({ root, slug, ffLook });
      const dirCss = resolve(root, 'src/directions', look.direction, 'index.css');
      if (!existsSync(dirCss)) throw new Error(`Direction inconnue : ${look.direction} (sites/${slug})`);
      const fonts = parseFonts(root);
      const lines = [`import '/src/directions/${look.direction}/index.css';`];
      const families = {};
      for (const [slot, key] of Object.entries(look.typography ?? {})) {
        if (!key) continue;
        const f = fonts[key];
        if (!f) throw new Error(`Police inconnue dans typography.${slot} : ${key} (voir src/lib/fonts.ts)`);
        lines.push(`import '${f.pkg}';`);
        families[slot] = f.family;
      }
      lines.push(`export const direction = ${JSON.stringify(look.direction)};`);
      lines.push(`export const fontFamilies = ${JSON.stringify(families)};`);
      return lines.join('\n');
    },
  };
}
