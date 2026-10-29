// `ff apercu-rapide <slug> [--pages] [--sans-build]` : voir un site en moins de 3 minutes (29 oct 2026, le
// fondateur : « faut qu'on trouve un moyen d'avoir des rendus bcp plus rapides »). Aucun contrôle long (ni a11y,
// ni audit, ni film) : build silencieux sous le verrou partagé `.ff-tmp/build.lock` (celui de `ff prevol` et
// `ff melanger`), dist servi avec les en-têtes de `_headers` (CSP comprise, scripts/ff/headers-file.mjs), puis UNE
// image JPEG lisible sur un téléphone, `captures/rapide/<slug>.jpg` :
//   - à gauche, en grand : le premier écran au téléphone (390x844, rendu @2x, après 1,5 s d'entrée) ;
//   - à droite : l'accueil entier au téléphone puis à l'ordinateur (1400x900), réduits et coupés en colonnes de la
//     hauteur du premier écran (une page de 12 000 px ne se lit pas en une vignette) ;
//   - avec --pages : la première page de service et une autre page (réalisations, à propos, contact… sinon la
//     première page de contenu), au téléphone.
// Pages entières en `prefers-reduced-motion: reduce` et images paresseuses forcées : rien d'invisible à mi-fondu.
// Navigateur : Chrome, ou le Chromium de Playwright avec `FF_CHROMIUM=1` (comme les autres commandes).
// Mise en page pure (disposerApercuRapide, choisirPages) testée dans tests/apercu-rapide.test.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, DIST_DIR, resolveSlug, runAstro, ok, fail, warn, info, c, parseArgs } from './util.mjs';
import { servir } from './planche.mjs';

const VERROU = path.join(ROOT, '.ff-tmp', 'build.lock');
export const TELEPHONE = { width: 390, height: 844 };
export const ORDINATEUR = { width: 1400, height: 900 };
export const DPR_PREMIER = 2;
export const MARGE = 20;
export const ENTETE = 56;
export const MAX_COLONNES = 4;
/** Largeur d'une colonne de page entière, par appareil (avant réduction si la page est trop longue). */
export const LARGEUR_COLONNE = { telephone: 300, ordinateur: 520 };

/**
 * Pure : disposition de l'aperçu. `premier` = taille affichée du premier écran (px) ; `pages` = [{ w, h, appareil,
 * libelle }] en px CSS. Chaque page est réduite à la largeur de colonne de son appareil puis coupée en tranches de la
 * hauteur du premier écran ; au-delà de MAX_COLONNES tranches, la colonne rétrécit pour tenir en MAX_COLONNES.
 * Renvoie { width, height, premier: { left, top }, blocs: [{ libelle, left, largeur, hauteurReduite, tranches:
 * [{ left, top, haut, hauteur }] }] } (haut = début de la tranche dans l'image réduite).
 */
export function disposerApercuRapide({ premier, pages, maxColonnes = MAX_COLONNES, marge = MARGE, entete = ENTETE }) {
  const H = premier.h;
  let x = marge + premier.w + marge;
  const blocs = pages.map((p) => {
    let largeur = LARGEUR_COLONNE[p.appareil] ?? 300;
    let hr = Math.round((p.h * largeur) / p.w);
    if (Math.ceil(hr / H) > maxColonnes) {
      largeur = Math.max(60, Math.floor((maxColonnes * H * p.w) / p.h));
      hr = Math.round((p.h * largeur) / p.w);
    }
    const n = Math.max(1, Math.ceil(hr / H));
    const tranches = Array.from({ length: n }, (_, i) => ({ left: x + i * (largeur + marge / 2), top: entete, haut: i * H, hauteur: Math.min(H, hr - i * H) }));
    const bloc = { libelle: p.libelle, left: x, largeur, hauteurReduite: hr, tranches };
    x += n * largeur + (n - 1) * (marge / 2) + marge * 2;
    return bloc;
  });
  return { width: blocs.length ? x - marge : x, height: entete + H + marge, premier: { left: marge, top: entete }, blocs };
}

/** Pure : pages de --pages parmi les chemins HTML de dist (« services/x/index.html »…) -> URL de la 1re page de service (dans l'ordre des liens `ordre` de l'accueil s'il est donné) et d'une autre. */
export function choisirPages(chemins, ordre = []) {
  const url = (p) => '/' + p.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');
  const exclus = /^(index|404|credits|mentions-legales|confidentialite|plan-du-site|merci)(\.html|\/index\.html)$/;
  const tries = [...chemins].sort();
  const services = tries.filter((p) => /^services\/[^/]+(\.html|\/index\.html)$/.test(p));
  // `ordre` = liens de l'accueil dans l'ordre de la page : la première page de service est celle du site, pas l'alphabet.
  const service = ordre.map((u) => services.find((p) => url(p) === u.replace(/\/$/, ''))).find(Boolean) ?? services[0];
  const preferes = ['realisations', 'a-propos', 'atelier', 'contact', 'produits', 'tarifs', 'carte', 'conseils'];
  const autres = tries.filter((p) => !exclus.test(p) && !p.startsWith('services/') && !/^_|\/_/.test(p));
  const autre = preferes.map((n) => autres.find((p) => p === `${n}.html` || p === `${n}/index.html`)).find(Boolean) ?? autres.find((p) => !p.includes('/')) ?? autres[0];
  return [service, autre].filter(Boolean).map(url);
}

function listerHtml(dir, base = dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !['_astro', 'images', 'videos', 'fonts'].includes(e.name)) out.push(...listerHtml(p, base));
    else if (e.name.endsWith('.html')) out.push(path.relative(base, p).split(path.sep).join('/'));
  }
  return out;
}

function attendreVerrou() {
  const t0 = Date.now();
  while (fs.existsSync(VERROU)) {
    if (Date.now() - t0 > 10 * 60 * 1000) { warn('verrou de build présent depuis 10 min : on passe outre'); break; }
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000);
  }
}

function construire(slug) {
  attendreVerrou();
  fs.mkdirSync(path.dirname(VERROU), { recursive: true });
  fs.writeFileSync(VERROU, String(process.pid));
  try {
    return runAstro('build', slug, [], {}, { silencieux: true });
  } finally {
    fs.rmSync(VERROU, { force: true });
  }
}

/** Page entière, images paresseuses forcées et chargées, sans mouvement. */
async function pageEntiere(page, url) {
  await page.goto(url, { waitUntil: 'load', timeout: 60_000 }).catch(() => {});
  await page.evaluate(async () => {
    for (const img of document.querySelectorAll('img[loading="lazy"]')) img.loading = 'eager';
    await Promise.race([
      Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; }))),
      new Promise((r) => setTimeout(r, 4000)),
    ]);
  }).catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(300);
  return page.screenshot({ fullPage: true, type: 'png' });
}

function echapper(s) {
  return String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
}

export async function cmdApercuRapide(args) {
  const t0 = Date.now();
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const distDir = path.join(DIST_DIR, slug);

  let tBuild = 0;
  if (!flags['sans-build']) {
    info(c.dim(`build de ${slug} (silencieux)…`));
    const t = Date.now();
    if (construire(slug) !== 0) { fail('build en échec (fin de la sortie ci-dessus).'); process.exit(1); }
    tBuild = (Date.now() - t) / 1000;
  }
  if (!fs.existsSync(path.join(distDir, 'index.html'))) { fail(`dist/${slug}/index.html absent : lancer sans --sans-build.`); process.exit(1); }

  const { chromium } = await import('playwright-core');
  const sharp = (await import('sharp')).default;
  const srv = servir(distDir);
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const navigateur = await chromium.launch({ channel: process.env.FF_CHROMIUM ? undefined : 'chrome', headless: true });
  const captures = [];
  let premier;
  const erreurs = [];
  try {
    // 1. Premier écran au téléphone, avec son entrée (1,5 s), @2x.
    const ctxP = await navigateur.newContext({ viewport: TELEPHONE, deviceScaleFactor: DPR_PREMIER, isMobile: true, hasTouch: true });
    const pP = await ctxP.newPage();
    pP.on('pageerror', (e) => erreurs.push(e.message));
    await pP.goto(`${base}/`, { waitUntil: 'load', timeout: 60_000 }).catch(() => {});
    await pP.waitForTimeout(1500);
    premier = await pP.screenshot({ type: 'png' });
    await ctxP.close();

    // 2. Pages entières, sans mouvement.
    const pages = [{ url: '/', appareil: 'telephone', libelle: 'Accueil, téléphone' }, { url: '/', appareil: 'ordinateur', libelle: 'Accueil, ordinateur' }];
    const ordre = [...fs.readFileSync(path.join(distDir, 'index.html'), 'utf8').matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]);
    if (flags.pages) for (const u of choisirPages(listerHtml(distDir), ordre)) pages.push({ url: u, appareil: 'telephone', libelle: `${u}, téléphone` });
    const ctx = {
      telephone: await navigateur.newContext({ viewport: TELEPHONE, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: 'reduce' }),
      ordinateur: await navigateur.newContext({ viewport: ORDINATEUR, deviceScaleFactor: 1, reducedMotion: 'reduce' }),
    };
    for (const p of pages) {
      const page = await ctx[p.appareil].newPage();
      page.on('pageerror', (e) => erreurs.push(e.message));
      const buf = await pageEntiere(page, `${base}${p.url}`);
      const m = await sharp(buf).metadata();
      captures.push({ ...p, buf, w: m.width, h: m.height });
      await page.close();
    }
    await ctx.telephone.close();
    await ctx.ordinateur.close();
  } finally {
    await navigateur.close();
    srv.close();
  }

  // 3. Assemblage.
  const pm = await sharp(premier).metadata();
  const disp = disposerApercuRapide({ premier: { w: pm.width, h: pm.height }, pages: captures });
  const calques = [{ input: premier, left: disp.premier.left, top: disp.premier.top }];
  const textes = [`<text x="${disp.premier.left}" y="36" font-size="26" font-weight="700">${echapper(slug)} : premier écran, téléphone</text>`];
  for (let i = 0; i < captures.length; i++) {
    const b = disp.blocs[i];
    const reduite = await sharp(captures[i].buf).resize({ width: b.largeur }).png().toBuffer();
    const hReelle = (await sharp(reduite).metadata()).height;
    for (const t of b.tranches) {
      const hauteur = Math.min(t.hauteur, hReelle - t.haut);
      if (hauteur <= 0) continue;
      calques.push({ input: await sharp(reduite).extract({ left: 0, top: t.haut, width: b.largeur, height: hauteur }).toBuffer(), left: t.left, top: t.top });
    }
    textes.push(`<text x="${b.left}" y="36" font-size="22">${echapper(b.libelle)}</text>`);
  }
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${disp.width}" height="${ENTETE}"><g font-family="Arial, Helvetica, sans-serif" fill="#111">${textes.join('')}</g></svg>`);
  calques.push({ input: svg, left: 0, top: 0 });
  const dest = path.join(ROOT, 'captures', 'rapide');
  fs.mkdirSync(dest, { recursive: true });
  const sortie = path.join(dest, `${slug}.jpg`);
  await sharp({ create: { width: disp.width, height: disp.height, channels: 3, background: '#e9e9e6' } })
    .composite(calques)
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(sortie);

  const total = (Date.now() - t0) / 1000;
  if (erreurs.length) warn(`erreurs JS : ${[...new Set(erreurs)].slice(0, 3).join(' | ')}`);
  ok(`${path.relative(ROOT, sortie)} (${disp.width}x${disp.height})`);
  info(`  durée : ${total.toFixed(0)} s${tBuild ? ` (build ${tBuild.toFixed(0)} s, captures et assemblage ${(total - tBuild).toFixed(0)} s)` : ''}${total > 180 ? c.yellow(' : au-delà de l’objectif de 3 min') : ''}`);
}
