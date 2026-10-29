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
import { siteHasCredits } from './astro-credits-integration.mjs';
import { directionBg, iconesDisponibles } from './ff/icones.mjs';

const VIRTUAL = 'virtual:ff-look';
const RESOLVED = '\0' + VIRTUAL;

/** Variantes de layout lues dans le texte du config (coquille, architecture, nav/hero/footer + sections[]). */
export function parseLayoutVariants(text) {
  const out = { shell: null, architecture: null, servicePage: null, nav: null, hero: null, footer: null, sections: [] };
  const block = text.match(/\blayout:\s*\{([\s\S]*?)\n\s{2}\},/);
  const src = block ? block[1] : text;
  const shell = src.match(/\bshell:\s*'([^']+)'/); if (shell) out.shell = shell[1];
  const archi = src.match(/\barchitecture:\s*'([^']+)'/); if (archi) out.architecture = archi[1];
  const sp = src.match(/\bservicePage:\s*'([^']+)'/); if (sp) out.servicePage = sp[1];
  const nav = src.match(/\bnav:\s*'([^']+)'/); if (nav) out.nav = nav[1];
  const hero = src.match(/\bhero:\s*'([^']+)'/); if (hero) out.hero = hero[1];
  const footer = src.match(/\bfooter:\s*'([^']+)'/); if (footer) out.footer = footer[1];
  const re = /\{\s*type:\s*'([a-z]+)'\s*,\s*variant:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src))) out.sections.push({ type: m[1], variant: m[2] });
  return out;
}

function parseConfigLook(text) {
  const look = {};
  const dir = text.match(/\bdirection:\s*'([a-z0-9-]+)'/);
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

/**
 * Pure : la surcharge typography.<slot> désigne-t-elle la police que la direction déclare déjà pour ce rôle
 * (`--font-display` / `--font-body`) ? Cas des mélanges (`ff melanger` écrit les polices de la direction dans le look,
 * pour qu'une surcharge du site.config ne les défasse pas) : il ne faut alors ni retirer l'@import de la direction ni
 * ajouter le paquet entier de src/lib/fonts.ts (L'Épi d'Or D, 17 oct 2026 : Spectral importé deux fois, toutes graisses,
 * 300 Ko de polices au lieu de quatre fichiers). Appliqué aux seules directions de mélange (`m-…`) : une direction écrite
 * à la main garde son comportement.
 */
export function memePoliceQueDirection(dirCssText, slot, family) {
  const role = slot === 'display' ? 'display' : slot === 'body' ? 'body' : null;
  if (!role || !family) return false;
  const m = new RegExp(`--font-${role}:\\s*([^;]+);`).exec(dirCssText || '');
  const norm = (x) => x.replace(/["']/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  return Boolean(m) && norm(m[1]) === norm(family);
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
  // Layout : config puis overlays (look.json / FF_LOOK) ; null si introuvable => on scanne tout src/sections.
  // Memes regles que src/lib/site.ts (applyLook + completerLayout) : a chaque niveau, l'architecture remplit les
  // reglages que CE niveau ne precise pas, puis un overlay remplace ce qu'il precise (y compris ce que son
  // architecture lui a donne : FF_LOOK { layout: { architecture } } change donc coquille ET sections).
  let layout = existsSync(cfg) ? completerParArchitecture(root, parseLayoutVariants(readFileSync(cfg, 'utf8'))) : null;
  for (const o of overlays) {
    if (!o.layout) continue;
    layout ||= { shell: null, architecture: null, servicePage: null, nav: null, hero: null, footer: null, sections: [] };
    const ov = completerParArchitecture(root, {
      shell: o.layout.shell ?? null, architecture: o.layout.architecture ?? null, servicePage: o.layout.servicePage ?? null,
      nav: o.layout.nav ?? null, hero: o.layout.hero ?? null, footer: o.layout.footer ?? null,
      sections: Array.isArray(o.layout.sections) ? o.layout.sections.map((x) => ({ type: x.type, variant: x.variant })) : null,
    });
    for (const k of ['shell', 'architecture', 'servicePage', 'nav', 'hero', 'footer']) if (ov[k]) layout[k] = ov[k];
    if (Array.isArray(ov.sections)) layout.sections = ov.sections;
  }
  look.layout = layout;
  return look;
}

/** completerLayout du plugin : les reglages absents (null) prennent ceux de l'architecture du meme niveau. */
export function completerParArchitecture(root, layout) {
  const a = architectureLayout(root, layout.architecture);
  if (!a) return layout;
  const out = { ...layout };
  for (const k of ['shell', 'servicePage', 'nav', 'hero', 'footer']) if (!out[k] && a[k]) out[k] = a[k];
  if (!Array.isArray(out.sections) || (out.sections.length === 0 && layout.architecture)) out.sections = a.sections;
  return out;
}

/**
 * Reglages de layout poses par une architecture (src/lib/architectures.ts, lu en texte : le plugin tourne hors
 * Vite, sans TS). Memes regles que completerLayout : un reglage ecrit dans le config gagne toujours.
 */
export function architectureLayout(root, id) {
  if (!id) return null;
  const text = readFileSync(resolve(root, 'src/lib/architectures.ts'), 'utf8');
  const start = text.indexOf(`'${id}': {`);
  if (start === -1) return null;
  const from = text.indexOf('layout: {', start);
  const end = text.indexOf('\n    },', from);
  if (from === -1 || end === -1) return null;
  const src = text.slice(from, end);
  const pick = (k) => { const m = src.match(new RegExp(`\\b${k}:\\s*'([^']+)'`)); return m ? m[1] : null; };
  const sections = [];
  const re = /\{\s*type:\s*'([a-z]+)'\s*,\s*variant:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src))) sections.push({ type: m[1], variant: m[2] });
  return { shell: pick('shell'), nav: pick('nav'), hero: pick('hero'), footer: pick('footer'), servicePage: pick('servicePage'), sections };
}

/**
 * Les composants que CE site rend : sa coquille et ses variantes de sections (config, puis architecture, puis defauts
 * du schema), plus celles que des pages demandent par leur nom (cta `band` en repli sur les pages service et conseils,
 * contact `ecran` du gabarit livre). Astro met dans la feuille de chaque page le CSS de TOUT module atteignable, meme
 * par un glob paresseux : ne pas importer les autres variantes est la seule facon de ne pas livrer leur style
 * (26 oct 2026 : 50 Ko de sections jamais rendues sur chaque page de _exemple). `null` (pas de layout lisible) =
 * tout src/sections et toutes les coquilles, comme avant.
 */
export function composantsDuSite(root, look) {
  const l = look.layout;
  if (!l) return null;
  // L'architecture est deja appliquee par niveau dans resolveLook (completerParArchitecture) ; ici, les defauts du schema.
  const defaults = { shell: 'flow', nav: 'bar', hero: 'split', footer: 'columns' };
  const defaultSections = [['services', 'grid'], ['about', 'portrait'], ['proof', 'google'], ['zones', 'list'], ['faq', 'accordion'], ['cta', 'band'], ['contact', 'form-split']]
    .map(([type, variant]) => ({ type, variant }));
  const shell = l.shell || defaults.shell;
  const servicePage = l.servicePage || null;
  const sections = Array.isArray(l.sections) && (l.sections.length || l.architecture) ? l.sections : defaultSections;
  const variants = new Map();
  const add = (type, variant) => {
    if (!variant || variant.startsWith('custom/')) return;
    const dir = type.charAt(0).toUpperCase() + type.slice(1);
    if (existsSync(resolve(root, 'src/sections', dir, `${variant}.astro`))) variants.set(`${type}/${variant}`.toLowerCase(), { dir, variant });
  };
  add('nav', l.nav || defaults.nav);
  add('hero', l.hero || defaults.hero);
  add('footer', l.footer || defaults.footer);
  for (const s of sections) add(s.type, s.variant);
  if (!sections.some((x) => x.type === 'cta')) add('cta', 'band');
  if (shell === 'livre' || servicePage === 'livre') add('contact', 'ecran');
  return { shell, variants };
}

/** Repli sans layout lisible : la coquille flow et TOUTES les variantes de src/sections (l'ancien comportement). */
export function tousLesComposants(root) {
  const variants = new Map();
  const base = resolve(root, 'src/sections');
  for (const dir of readdirSync(base)) {
    const abs = resolve(base, dir);
    let files = [];
    try { files = readdirSync(abs).filter((f) => f.endsWith('.astro')); } catch { continue; }
    for (const f of files) {
      const variant = f.replace(/\.astro$/, '');
      variants.set(`${dir}/${variant}`.toLowerCase(), { dir, variant });
    }
  }
  return { shell: 'flow', variants };
}

/**
 * Lignes `@source` Tailwind pour ce site : src/ sauf src/sections, puis seulement les variantes de
 * sections utilisees (composantsDuSite). Repli : tout src/sections.
 */
function tailwindSources(root, slug, look) {
  const lines = [
    "@source '../components';", "@source '../layouts';", "@source '../pages';", "@source '../shells';",
    "@source '../scripts';", `@source '../directions/${look.direction}';`, `@source '../../sites/${slug}';`,
  ];
  const c = composantsDuSite(root, look);
  if (!c) { lines.push("@source '../sections';"); return lines.join('\n'); }
  for (const { dir, variant } of c.variants.values()) lines.push(`@source '../sections/${dir}/${variant}.astro';`);
  return lines.join('\n');
}

export function ffLookPlugin({ root, slug, ffLook }) {
  return {
    name: 'ff-look',
    enforce: 'pre',
    /** global.css : injecte `@source` vers sites/<slug> (Tailwind 4 ne scanne que src/ + ce site). */
    transform(code, id) {
      const file = id.replace(/\\/g, '/');
      if (file.endsWith('/src/styles/global.css')) {
        const look = resolveLook({ root, slug, ffLook });
        return { code: code.replace('/*@ff-source-site*/', tailwindSources(root, slug, look)), map: null };
      }
      // Direction CSS : si le site surcharge la police display et/ou body, on retire l'@import
      // correspondant de la direction (convention : 1er import = display, 2e = body, 3e = mono),
      // sinon les deux familles sont telechargees pour rien.
      const dirMatch = file.match(/\/src\/directions\/([a-z0-9-]+)\/index\.css$/);
      if (dirMatch) {
        const look = resolveLook({ root, slug, ffLook });
        if (dirMatch[1] !== look.direction || !look.typography) return null;
        const fontsT = parseFonts(root);
        const melange = dirMatch[1].startsWith('m-');
        const remplace = (slot) => Boolean(look.typography[slot]) && !(melange && memePoliceQueDirection(code, slot, fontsT[look.typography[slot]]?.family));
        let index = 0;
        const out = code.replace(/^@import\s+'@fontsource[^']+';\s*$/gm, (line) => {
          const i = index++;
          if ((i === 0 && remplace('display')) || (i === 1 && remplace('body'))) return '/* police remplacee par typography */';
          return line;
        });
        return { code: out, map: null };
      }
      return null;
    },
    resolveId(id) {
      return id === VIRTUAL ? RESOLVED : null;
    },
    /** En dev (studio) : look.json, site.config.ts ou le dossier sections/ change => module virtuel invalide + rechargement. */
    configureServer(server) {
      const dir = resolve(root, 'sites', slug);
      server.watcher.add([resolve(dir, 'look.json'), resolve(dir, 'site.config.ts'), resolve(dir, 'sections'), resolve(dir, 'CREDITS.md')]);
      const refresh = (file) => {
        const f = file.replace(/\\/g, '/');
        if (!f.includes(`/sites/${slug}/`)) return;
        if (!/look\.json$|site\.config\.ts$|\/sections\/|CREDITS\.md$/.test(f)) return;
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
        // Même police que la direction (mélange) : la direction l'importe déjà, graisses choisies.
        if (!(look.direction.startsWith('m-') && memePoliceQueDirection(dirCssText, slot, f.family))) lines.push(`import '${f.pkg}';`);
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
      const overrideKey = look.typography?.display;
      // 9 oct 2026 : quand typography.display remplace la police display de la direction, celle-ci
      // n'est plus utilisee par les titres ; la precharger telechargeait un fichier jamais affiche
      // (finck-fisch : Familjen Grotesk precharge pour rien a cote de Bodoni, LCP retarde).
      if (dirImportMatch && !(overrideKey && fonts[overrideKey])) displaySpecs.push(dirImportMatch[1]);
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

      // Coquille et variantes de sections de CE site seulement (composantsDuSite) : src/lib/sections.ts et
      // src/pages/index.astro les lisent ici au lieu de globber tout src/sections et src/shells.
      // Un `import.meta.glob` cote src, meme dans une branche jamais prise, met tout le dossier dans le graphe : le
      // repli (layout illisible) est donc enumere ICI, sur disque, et src/ n'a plus aucun glob de sections ni de coquilles.
      const comp = composantsDuSite(root, look) ?? tousLesComposants(root);
      lines.push(`import ShellCourante from '/src/shells/${comp.shell}.astro';`);
      lines.push(`export const Shell = ShellCourante;`);
      const secEntries = [];
      let k = 0;
      for (const [key, { dir, variant }] of comp.variants) {
        lines.push(`import Sec${k} from '/src/sections/${dir}/${variant}.astro';`);
        secEntries.push(`${JSON.stringify(key)}: Sec${k}`);
        k++;
      }
      lines.push(`export const sectionModules = { ${secEntries.join(', ')} };`);
      lines.push(`export const sectionsCompilees = ${JSON.stringify(Boolean(composantsDuSite(root, look)))};`);

      // Credits photos (scripts/astro-credits-integration.mjs) : les pieds de page partages
      // (src/sections/Footer/*.astro) n'affichent le lien "Credits photos" que si la route /credits
      // a effectivement ete injectee pour ce site (meme condition, calculee la meme facon).
      lines.push(`export const hasCredits = ${JSON.stringify(siteHasCredits(root, slug))};`);

      // <meta name="theme-color"> et pack d'icones (scripts/astro-icons-integration.mjs) : la couleur est le
      // token `--bg` de la direction (lu dans son index.css, scripts/ff/icones.mjs), `icons` dit quelles
      // balises <link> Base.astro peut poser sans pointer vers un fichier absent.
      lines.push(`export const themeColor = ${JSON.stringify(directionBg(root, look.direction))};`);
      lines.push(`export const icons = ${JSON.stringify(iconesDisponibles(root, slug))};`);

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
