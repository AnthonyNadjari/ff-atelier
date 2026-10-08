// `ff a11y [slug ...]` : audit d'ACCESSIBILITE axe-core (@axe-core/playwright) d'un ou plusieurs sites
// DEJA CONSTRUITS dans dist/ (lance `ff build <slug>` avant si besoin — meme principe que `ff nettete`
// et `ff audit-motion`, cette commande ne construit rien). Aussi appele par `ff verifier` (etape a11y).
//
// Principe : sert dist/<slug> avec les en-tetes de `_headers` appliques (CSP comprise, voir
// scripts/ff/headers-file.mjs — comme `ff captures`), ouvre CHAQUE page HTML construite en Chrome
// (playwright-core, canal `chrome`) a deux viewports — desktop 1400x900 puis mobile 390x844 — et lance
// axe avec les regles WCAG 2.0 A/AA, 2.1 AA et 2.2 AA (tags wcag2a, wcag2aa, wcag21aa, wcag22aa).
//
// Animations : le contexte emule `prefers-reduced-motion: reduce` (src/scripts/motion.ts et le bloc
// motion de src/styles/global.css affichent alors le texte d'emblee) et on defile la page une fois,
// puis on attend la fin des transitions : sans ca, color-contrast serait calcule sur des elements
// `data-reveal` a moitie fondus (opacite partielle -> faux contrastes insuffisants).
//
// Rapport en francais : ✓ par page/viewport sans violation, ✗ par regle (id, impact, nombre de noeuds,
// premier selecteur fautif + extrait HTML). Ecrit captures/<slug>-a11y.json, sort en erreur
// (process.exit 1) si au moins une violation d'impact critical ou serious. Les impacts moderate/minor
// sont listes (⚠) sans bloquer.
//
// Les fonctions de regroupement/verdict (resumerViolations, estBloquante, fusionnerResultats) sont
// PURES et testees sans navigateur dans tests/a11y.test.mjs.
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { DIST_DIR, ROOT, ok, fail, warn, info, c } from './util.mjs';
import { loadHeadersRules, headersForPath } from './headers-file.mjs';

export const TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];
export const IMPACTS_BLOQUANTS = ['critical', 'serious'];
const ORDRE_IMPACT = { critical: 0, serious: 1, moderate: 2, minor: 3 };

const VIEWPORTS = [
  { name: 'desktop', width: 1400, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const SKIP_PREFIXES = ['_test', '_vignette', '_prop'];

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
};

// ---------------------------------------------------------------------------------------------
// Fonctions pures — exportees pour tests/a11y.test.mjs, sans navigateur.
// ---------------------------------------------------------------------------------------------

/** Une violation axe bloque-t-elle la livraison ? (impact critical ou serious) */
export function estBloquante(violation) {
  return IMPACTS_BLOQUANTS.includes(violation?.impact);
}

/**
 * Reduit les `violations` brutes d'axe (une page, un viewport) a l'essentiel lisible :
 * [{ id, impact, aide, url, nombre, selecteur, extrait }], triees par gravite puis par id.
 * `selecteur`/`extrait` = le PREMIER noeud fautif (assez pour retrouver la section).
 */
export function resumerViolations(violations = []) {
  return violations
    .map((v) => {
      const premier = v.nodes?.[0];
      const cible = premier?.target?.[0];
      return {
        id: v.id,
        impact: v.impact ?? 'minor',
        aide: v.help ?? '',
        url: v.helpUrl ?? '',
        nombre: v.nodes?.length ?? 0,
        selecteur: Array.isArray(cible) ? cible.join(' ') : String(cible ?? ''),
        extrait: String(premier?.html ?? '').replace(/\s+/g, ' ').slice(0, 160),
      };
    })
    .sort((a, b) => (ORDRE_IMPACT[a.impact] ?? 9) - (ORDRE_IMPACT[b.impact] ?? 9) || a.id.localeCompare(b.id));
}

/**
 * Regroupe les resultats de toutes les pages/viewports d'un site par regle :
 * entree = [{ page, viewport, violations: resumerViolations(...) }]
 * sortie = { regles: [{ id, impact, aide, url, nombre, pages: ['/ (desktop)', ...], selecteur, extrait }], bloquant }
 * `nombre` = total des noeuds fautifs sur toutes les pages ; le premier selecteur/extrait rencontre est garde.
 */
export function fusionnerResultats(resultats = []) {
  const parId = new Map();
  for (const r of resultats) {
    for (const v of r.violations) {
      const ou = `${r.page} (${r.viewport})`;
      const e = parId.get(v.id);
      if (!e) parId.set(v.id, { ...v, pages: [ou] });
      else {
        e.nombre += v.nombre;
        e.pages.push(ou);
      }
    }
  }
  const regles = [...parId.values()].sort(
    (a, b) => (ORDRE_IMPACT[a.impact] ?? 9) - (ORDRE_IMPACT[b.impact] ?? 9) || a.id.localeCompare(b.id),
  );
  return { regles, bloquant: regles.some(estBloquante) };
}

/** Chemins d'URL de toutes les pages HTML construites (index.html -> dossier, x.html -> /x). */
export function cheminsPages(fichiersRelatifs) {
  return fichiersRelatifs
    .map((f) => f.split(path.sep).join('/'))
    .filter((f) => f.endsWith('.html'))
    .map((f) => {
      if (f === 'index.html') return '/';
      if (f.endsWith('/index.html')) return `/${f.slice(0, -'index.html'.length)}`;
      return `/${f.slice(0, -'.html'.length)}`;
    })
    .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));
}

// ---------------------------------------------------------------------------------------------
// Cote navigateur.
// ---------------------------------------------------------------------------------------------

function listerHtml(dir, base = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listerHtml(full, base));
    else if (entry.name.endsWith('.html')) out.push(path.relative(base, full));
  }
  return out;
}

function defaultSlugs() {
  if (!fs.existsSync(DIST_DIR)) return [];
  return fs
    .readdirSync(DIST_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => !SKIP_PREFIXES.some((p) => name.startsWith(p)))
    .sort();
}

/** Serveur statique de dist/<slug>, en-tetes de `_headers` appliques (meme logique que scripts/captures.mjs). */
function startStaticServer(distDir) {
  const rules = loadHeadersRules(distDir);
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let f = path.join(distDir, pathname);
      if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
      if (!fs.existsSync(f) && fs.existsSync(`${f}.html`)) f = `${f}.html`;
      const headers = Object.fromEntries(headersForPath(rules, pathname));
      if (!fs.existsSync(f)) {
        res.writeHead(404, headers);
        res.end();
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] ?? 'application/octet-stream', ...headers });
      res.end(fs.readFileSync(f));
    }).listen(0, '127.0.0.1', () => resolve(server));
  });
}

/** Defile la page (declenche reveals/lazy-load), revient en haut, attend la fin des transitions. */
async function preparerPage(page) {
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 600) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  // Attend les animations CSS/WAAPI encore en cours (bornees a 3 s : une animation infinie, ex. marquee, ne bloque pas).
  await page.evaluate(() =>
    Promise.race([
      Promise.all(
        document.getAnimations().filter((a) => a.effect?.getTiming?.().iterations !== Infinity).map((a) => a.finished.catch(() => {})),
      ),
      new Promise((r) => setTimeout(r, 3000)),
    ]),
  );
}

/** Audite un site ; renvoie le rapport (aussi ecrit dans captures/<slug>-a11y.json par l'appelant). */
async function auditSlug(browser, slug) {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const distDir = path.join(DIST_DIR, slug);
  info('');
  info(c.bold(`Accessibilite (axe) : ${slug}`));
  if (!fs.existsSync(distDir)) {
    fail(`dist/${slug} absent — lance \`node scripts/ff.mjs build ${slug}\` d'abord.`);
    return { slug, ok: false, erreur: 'dist absent', regles: [], pages: [] };
  }
  const pages = cheminsPages(listerHtml(distDir));
  const server = await startStaticServer(distDir);
  const base = `http://127.0.0.1:${server.address().port}`;
  const resultats = [];
  try {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      for (const urlPath of pages) {
        try {
          await page.goto(base + urlPath, { waitUntil: 'load', timeout: 30000 });
          await preparerPage(page);
          const res = await new AxeBuilder({ page }).withTags(TAGS).analyze();
          resultats.push({ page: urlPath, viewport: vp.name, violations: resumerViolations(res.violations) });
        } catch (e) {
          resultats.push({ page: urlPath, viewport: vp.name, violations: [], erreur: String(e.message || e).split('\n')[0] });
        }
      }
      await context.close();
    }
  } finally {
    server.close();
  }

  const { regles, bloquant } = fusionnerResultats(resultats);
  const erreurs = resultats.filter((r) => r.erreur);
  info(`  ${pages.length} page(s) x ${VIEWPORTS.length} viewports (${VIEWPORTS.map((v) => `${v.width}x${v.height}`).join(', ')})`);
  for (const e of erreurs) fail(`${e.page} (${e.viewport}) : audit impossible — ${e.erreur}`);
  if (regles.length === 0) ok('Aucune violation WCAG 2.2 AA detectee par axe');
  for (const r of regles) {
    const ligne = `[${r.impact}] ${r.id} — ${r.nombre} noeud(s) — ${r.aide}`;
    if (estBloquante(r)) fail(ligne);
    else warn(ligne);
    info(c.dim(`      ${r.selecteur}`));
    if (r.extrait) info(c.dim(`      ${r.extrait}`));
    const pagesUniques = [...new Set(r.pages)];
    info(c.dim(`      pages : ${pagesUniques.slice(0, 6).join(', ')}${pagesUniques.length > 6 ? ` (+${pagesUniques.length - 6})` : ''}`));
  }
  const okSite = !bloquant && erreurs.length === 0;
  return { slug, ok: okSite, tags: TAGS, pages, regles, resultats };
}

/** Audite les slugs donnes, ecrit les rapports JSON ; renvoie true si aucun site n'a de violation bloquante. */
export async function runA11y(slugs) {
  const capturesDir = path.join(ROOT, 'captures');
  fs.mkdirSync(capturesDir, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const reports = [];
  try {
    for (const slug of slugs) {
      const report = await auditSlug(browser, slug);
      reports.push(report);
      fs.writeFileSync(path.join(capturesDir, `${slug}-a11y.json`), JSON.stringify(report, null, 2));
    }
  } finally {
    await browser.close();
  }
  info('');
  const failed = reports.filter((r) => !r.ok);
  if (failed.length === 0) ok(`Accessibilite : aucune violation critique/serieuse (${reports.length} site(s)).`);
  else fail(`Accessibilite : violation(s) critique(s)/serieuse(s) sur ${failed.map((r) => r.slug).join(', ')} (detail dans captures/<slug>-a11y.json)`);
  return failed.length === 0;
}

export async function cmdA11y(args) {
  const slugs = args.filter((a) => !a.startsWith('--'));
  const cibles = slugs.length ? slugs : defaultSlugs();
  if (!cibles.length) {
    fail("Aucun site construit dans dist/. Lance `node scripts/ff.mjs build <slug>` d'abord.");
    process.exit(1);
  }
  process.exit((await runA11y(cibles)) ? 0 : 1);
}
