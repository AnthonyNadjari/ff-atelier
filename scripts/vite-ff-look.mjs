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
import { existsSync, readFileSync, readdirSync } from 'node:fs';
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

/**
 * Resout le fichier woff2 "latin" d'un package fontsource (statique ou variable), pour le precharger
 * (docs/veille/performance.md §1.5/§4). `pkgSpecifier` est tel qu'ecrit dans un `@import`/`fonts.ts`
 * ('@fontsource-variable/fraunces' ou '@fontsource/gloock/latin.css') ; renvoie null si le fichier
 * n'existe pas sur disque (repli silencieux, jamais d'import casse).
 */
function resolveLatinWoff2(root, pkgSpecifier) {
  const isVariable = pkgSpecifier.startsWith('@fontsource-variable/');
  const pkgRoot = pkgSpecifier.replace(/\/latin\.css$/, '');
  const slug = pkgRoot.split('/')[1];
  if (!slug) return null;
  const file = isVariable ? `${slug}-latin-wght-normal.woff2` : `${slug}-latin-400-normal.woff2`;
  const abs = resolve(root, 'node_modules', ...pkgRoot.split('/'), 'files', file);
  if (!existsSync(abs)) return null;
  return { pkgRoot, file };
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
    /** En dev (studio) : look.json, site.config.ts ou le dossier sections/ change => module virtuel invalide + rechargement. */
    configureServer(server) {
      const dir = resolve(root, 'sites', slug);
      server.watcher.add([resolve(dir, 'look.json'), resolve(dir, 'site.config.ts'), resolve(dir, 'sections')]);
      const refresh = (file) => {
        const f = file.replace(/\\/g, '/');
        if (!f.includes(`/sites/${slug}/`)) return;
        if (!/look\.json$|site\.config\.ts$|\/sections\//.test(f)) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('change', refresh);
      server.watcher.on('add', refresh);
      server.watcher.on('unlink', refresh);
    },
    load(id) {
      if (id !== RESOLVED) return null;
      const look = resolveLook({ root, slug, ffLook });
      const dirCss = resolve(root, 'src/directions', look.direction, 'index.css');
      if (!existsSync(dirCss)) throw new Error(`Direction inconnue : ${look.direction} (sites/${slug})`);
      const dirCssText = readFileSync(dirCss, 'utf8');
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

      // Preload (docs/veille/performance.md §1.5/§4/§7 action 4) : la police display de la direction
      // (premier `@import '@fontsource...'` de son index.css — convention : display, puis body, puis
      // mono) et, si `typography.display` la remplace, la police de la surcharge. Les deux peuvent
      // etre chargees en meme temps (la direction importe toujours son CSS ; la surcharge ajoute le
      // sien par-dessus, voir la boucle juste au-dessus) donc les deux sont candidates au preload.
      const displaySpecs = [];
      const dirImportMatch = dirCssText.match(/@import\s+'(@fontsource[^']+)'/);
      if (dirImportMatch) displaySpecs.push(dirImportMatch[1]);
      const overrideKey = look.typography?.display;
      if (overrideKey && fonts[overrideKey]) displaySpecs.push(fonts[overrideKey].pkg);
      const seenPkgRoot = new Set();
      let preloadCount = 0;
      for (const spec of displaySpecs) {
        const pkgRootKey = spec.replace(/\/latin\.css$/, '');
        if (seenPkgRoot.has(pkgRootKey)) continue;
        seenPkgRoot.add(pkgRootKey);
        const resolved = resolveLatinWoff2(root, spec);
        if (!resolved) continue; // fichier absent du package installe : on saute, pas d'import casse
        lines.push(`import fontUrl${preloadCount} from '${resolved.pkgRoot}/files/${resolved.file}?url';`);
        preloadCount++;
      }
      lines.push(`export const preloadFonts = [${Array.from({ length: preloadCount }, (_, i) => `fontUrl${i}`).join(', ')}];`);

      // Sections sur mesure du site courant uniquement (sites/<slug>/sections/*.astro) : les autres sites
      // ne sont jamais compiles ni inclus (un chantier en cours ailleurs ne casse pas ce build).
      const secDir = resolve(root, 'sites', slug, 'sections');
      const customs = existsSync(secDir) ? readdirSync(secDir).filter((f) => f.endsWith('.astro')) : [];
      const entries = [];
      customs.forEach((f, i) => {
        const name = f.replace(/\.astro$/, '');
        lines.push(`import Custom${i} from '/sites/${slug}/sections/${f}';`);
        entries.push(`${JSON.stringify(name.toLowerCase())}: Custom${i}`);
      });
      lines.push(`export const customSections = { ${entries.join(', ')} };`);

      // Config et look.json du site courant uniquement (src/lib/site.ts ne globbe plus tous les sites :
      // une faute de syntaxe dans le config d'un autre site ne casse plus ce build).
      lines.push(`import siteConfig from '/sites/${slug}/site.config.ts';`);
      lines.push(`export const config = siteConfig;`);
      const lookJson = resolve(root, 'sites', slug, 'look.json');
      if (existsSync(lookJson)) {
        lines.push(`import lookJsonRaw from '/sites/${slug}/look.json';`);
        lines.push(`export const lookFile = lookJsonRaw;`);
      } else {
        lines.push(`export const lookFile = undefined;`);
      }
      return lines.join('\n');
    },
  };
}
