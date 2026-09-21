// `ff nettete [slug ...]` : audite la NETTETE des images/sequences/videos d'un ou plusieurs sites
// DEJA CONSTRUITS dans dist/ (lance `ff build <slug>` avant si besoin — cette commande ne construit
// rien elle-meme, meme principe que `ff audit-motion`). Nee du 20 sept 2026 : le bloc "Le geste" de
// forge-delacroix (sequence data-frames, 48 images 1280x720 compressees a 5 Ko/image) etiree sur un
// canvas plein ecran DPR 2 rendait une image floue en production, sans qu'aucun outil ne le mesure
// (`ff audit-motion` verifie que le canvas est DESSINE, jamais a quelle resolution).
//
// Principe : ouvre chaque page (accueil + une page service) en Chrome (playwright-core) a deux
// viewports realistes — desktop 1400x900 deviceScaleFactor 2, mobile 390x844 deviceScaleFactor 3 (les
// vrais telephones) — defile lentement (les <img loading="lazy"> ne se chargent qu'au scroll, voir
// scripts/ff/audit-motion.mjs) puis mesure :
//   - chaque <img>/<picture> visible (hors icones < 48px et SVG) : taille AFFICHEE (getBoundingClientRect)
//     x DPR vs taille INTRINSEQUE REELLE de la source choisie par le navigateur (img.currentSrc rechargee
//     dans un Image() nu — `img.naturalWidth` d'un srcset est corrige de la densite, voir collectMesures) ;
//   - chaque [data-frames] (sequence "page produit", voir docs/ANIMATIONS.md § data-frames) : taille du
//     <canvas data-frames-canvas> (deja le vrai buffer pixel, DPR plafonne a 2 par src/scripts/motion.ts)
//     vs taille intrinseque de la frame 0001 reellement servie (desktop ou -mobile selon le viewport),
//     PLUS le poids moyen de 3 frames (premiere/milieu/derniere) ;
//   - chaque <video> : videoWidth/videoHeight vs taille affichee x DPR.
// Le calcul ratio/verdict (verdictAgrandissement) et le calcul de poids (verdictPoidsFrame) sont des
// fonctions PURES exportees, testees sans navigateur dans tests/nettete.test.mjs — le navigateur ne
// sert qu'a RECOLTER les mesures brutes (collectMesures, injectee dans la page).
//
// Rapport en francais (✓ correct / ⚠ limite ou gaspillage / ✗ floue ou compression destructrice), avec
// pour chaque probleme la correction suggeree (`ff images <slug>` ou `ff sequence ... --largeur/--qualite`).
// Ecrit captures/<slug>-nettete.json, sort en erreur (process.exit 1) si au moins un ✗ est releve.
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { DIST_DIR, ROOT, ok, fail, info, c } from './util.mjs';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2',
  '.xml': 'application/xml', '.txt': 'text/plain', '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json',
};

const VIEWPORTS = [
  { name: 'desktop', width: 1400, height: 900, deviceScaleFactor: 2 },
  { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 3 },
];

const SKIP_PREFIXES = ['_test', '_vignette', '_prop'];

// ---------------------------------------------------------------------------------------------
// Fonctions pures (ratio/verdict) — exportees pour tests/nettete.test.mjs, sans dependance DOM.
// ---------------------------------------------------------------------------------------------

/**
 * Compare la taille AFFICHEE (x DPR) d'une image/frame/video a sa taille INTRINSEQUE reelle.
 * ratio = (displayPx * dpr) / naturalPx.
 *   - ratio > seuilFloue (1,25)              -> 'floue' (etiree, visiblement floue)
 *   - 1,0 < ratio <= seuilFloue               -> 'limite' (a la marge)
 *   - naturalPx > seuilSurdimensionnement (2) x displayPx x dpr -> 'surdimensionnee' (gaspillage)
 *   - sinon                                   -> 'ok'
 * `displayPx`/`naturalPx` manquants ou nuls -> 'inconnu' (mesure impossible, pas une verdict de forme).
 */
export function verdictAgrandissement({ displayPx, dpr = 1, naturalPx, seuilFloue = 1.25, seuilSurdimensionnement = 2 }) {
  if (!displayPx || displayPx <= 0 || !naturalPx || naturalPx <= 0 || !dpr || dpr <= 0) {
    return { ratio: null, verdict: 'inconnu' };
  }
  const ratio = (displayPx * dpr) / naturalPx;
  if (ratio > seuilFloue) return { ratio, verdict: 'floue' };
  if (ratio > 1) return { ratio, verdict: 'limite' };
  if (naturalPx > seuilSurdimensionnement * displayPx * dpr) return { ratio, verdict: 'surdimensionnee' };
  return { ratio, verdict: 'ok' };
}

/**
 * Verdict de poids moyen par frame d'une sequence data-frames. Ne s'applique qu'aux frames assez
 * larges pour que la compression se voie (>= largeurMin, 1280px par defaut) :
 *   - avgBytes non mesure (0/absent)          -> 'inconnu'
 *   - avgBytes < seuilDestructrice (15 Ko)    -> 'destructrice' (compression qui detruit le detail)
 *   - avgBytes < seuilLegere (30 Ko)          -> 'legere' (a surveiller)
 *   - sinon                                   -> 'ok'
 */
export function verdictPoidsFrame({ naturalPx, avgBytes, largeurMin = 1280, seuilDestructrice = 15 * 1024, seuilLegere = 30 * 1024 }) {
  if (!naturalPx || naturalPx < largeurMin) return 'ok';
  if (!avgBytes || avgBytes <= 0) return 'inconnu';
  if (avgBytes < seuilDestructrice) return 'destructrice';
  if (avgBytes < seuilLegere) return 'legere';
  return 'ok';
}

/** Symbole d'affichage pour un verdict de forme (image/frame/video) ou de poids (frame). */
export function symboleVerdict(verdict) {
  if (verdict === 'ok') return '✓';
  if (verdict === 'floue' || verdict === 'destructrice') return '✗';
  return '⚠'; // limite / surdimensionnee / legere / inconnu
}

/** Largeur source "ronde" suggeree (multiple de 100, minimum 480) pour couvrir affiche x dpr. */
function largeurSuggeree(displayPx, dpr) {
  return Math.max(480, Math.ceil((displayPx * dpr) / 100) * 100);
}

function round2(n) {
  return n === null || n === undefined ? null : Math.round(n * 100) / 100;
}

// ---------------------------------------------------------------------------------------------
// Cote navigateur : ne fait que recolter des mesures brutes, aucun calcul de verdict ici.
// ---------------------------------------------------------------------------------------------

function defaultSlugs() {
  if (!fs.existsSync(DIST_DIR)) return [];
  return fs
    .readdirSync(DIST_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => !SKIP_PREFIXES.some((p) => name.startsWith(p)))
    .sort();
}

function startStaticServer(distDir) {
  const server = createServer((req, res) => {
    let f = path.join(distDir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f) && fs.existsSync(`${f}.html`)) f = `${f}.html`;
    if (!fs.existsSync(f)) {
      res.writeHead(404);
      res.end();
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] ?? 'application/octet-stream' });
    res.end(fs.readFileSync(f));
  }).listen(0);
  return server;
}

/** Accueil + une page service (la premiere trouvee), seulement si presente (meme principe que lighthouse.mjs). */
function choisirPages(distDir) {
  const pages = [{ label: 'accueil', urlPath: '/' }];
  const servicesDir = path.join(distDir, 'services');
  if (fs.existsSync(servicesDir)) {
    const first = fs.readdirSync(servicesDir).filter((f) => f.endsWith('.html')).sort()[0];
    if (first) pages.push({ label: `services/${first.replace(/\.html$/, '')}`, urlPath: `/services/${first.replace(/\.html$/, '')}` });
  }
  return pages;
}

/** Defile lentement jusqu'en bas (les <img loading="lazy"> ne se chargent qu'au scroll), meme logique qu'audit-motion.mjs. */
async function scrollSlowlyToBottom(page) {
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 300) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(100);
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(150);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(100);
}

/** Recolte les mesures brutes (DOM only) : aucun verdict calcule ici, voir verdictAgrandissement/verdictPoidsFrame. */
async function collectMesures() {
  /* eslint-disable no-undef */
  function estVisible(el) {
    if (typeof el.checkVisibility === 'function') {
      try {
        if (!el.checkVisibility()) return false;
      } catch {
        /* repli sur le rect ci-dessous */
      }
    }
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function cssPath(el, maxDepth = 4) {
    const parts = [];
    let node = el;
    let depth = maxDepth;
    while (node && node.nodeType === 1 && depth-- > 0) {
      let sel = node.tagName.toLowerCase();
      if (node.id) {
        sel += `#${node.id}`;
        parts.unshift(sel);
        break;
      }
      const cls = (node.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.');
      if (cls) sel += `.${cls}`;
      parts.unshift(sel);
      node = node.parentElement;
    }
    return parts.join(' > ');
  }

  const dpr = window.devicePixelRatio || 1;

  // ---- <img>/<picture> visibles, hors icones (< 48px) et SVG ----
  // PIEGE : pour une image choisie dans un srcset a descripteurs `w`, `img.naturalWidth` n'est PAS
  // la largeur en pixels du fichier mais la largeur "corrigee de la densite" (spec HTML : intrinsic /
  // (largeur du candidat / largeur calculee par `sizes`)) — soit, en pratique, la valeur de `sizes`
  // en px CSS. Mesuree ainsi, une image parfaitement servie affiche un ratio egal au DPR (les faux
  // "x3 sur mobile" des rapports du 20 sept 2026). On recharge donc l'URL reellement choisie
  // (currentSrc) dans un Image() nu, sans srcset : la, naturalWidth = vrais pixels (fichier en cache,
  // aucun telechargement supplementaire).
  const images = [];
  const tailleReelle = new Map();
  function pixelsReels(url) {
    if (!tailleReelle.has(url)) {
      tailleReelle.set(
        url,
        new Promise((resolve) => {
          const im = new Image();
          im.onload = () => resolve({ w: im.naturalWidth, h: im.naturalHeight });
          im.onerror = () => resolve(null);
          im.src = url;
        }),
      );
    }
    return tailleReelle.get(url);
  }
  for (const img of document.querySelectorAll('img')) {
    if (!estVisible(img)) continue;
    const src = img.currentSrc || img.src || '';
    if (!src || /\.svg(\?|#|$)/i.test(src)) continue;
    const rect = img.getBoundingClientRect();
    if (rect.width < 48 || rect.height < 48) continue;
    if (!img.naturalWidth) continue;
    const reel = (await pixelsReels(src)) || { w: img.naturalWidth, h: img.naturalHeight };
    if (!reel.w) continue;
    images.push({
      selector: cssPath(img),
      src,
      displayW: rect.width,
      displayH: rect.height,
      naturalW: reel.w,
      naturalH: reel.h,
    });
  }

  // ---- <video> visibles ----
  const videos = [];
  for (const video of document.querySelectorAll('video')) {
    if (!estVisible(video)) continue;
    if (video.readyState < 1) {
      try {
        video.load();
      } catch {
        /* ignore */
      }
      await Promise.race([
        new Promise((resolve) => video.addEventListener('loadedmetadata', resolve, { once: true })),
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ]);
    }
    if (!video.videoWidth) continue;
    const rect = video.getBoundingClientRect();
    videos.push({
      selector: cssPath(video),
      src: video.currentSrc || video.src || '',
      displayW: rect.width,
      displayH: rect.height,
      naturalW: video.videoWidth,
      naturalH: video.videoHeight,
    });
  }

  // ---- [data-frames] : taille du canvas (deja le vrai buffer pixel, DPR inclus/plafonne par le
  // moteur) vs taille intrinseque de la frame 0001 reellement servie, + poids moyen de 3 frames ----
  const frames = [];
  for (const el of document.querySelectorAll('[data-frames]')) {
    const canvas = el.querySelector('[data-frames-canvas]');
    if (!canvas) continue;
    // Canvas masque (repli poster, motion != rich ou reduced-motion) : le poster est un <img> normal,
    // deja mesure par le passage <img> ci-dessus — rien de plus a faire ici.
    if (canvas.hidden || getComputedStyle(canvas).display === 'none') continue;
    if (!canvas.width || !canvas.height) continue;

    const pad = Number(el.getAttribute('data-frames-pad')) || 4;
    const ext = el.getAttribute('data-frames-ext') || 'webp';
    const mobileBase = el.getAttribute('data-frames-mobile');
    const isMobile = Boolean(mobileBase) && window.matchMedia('(max-width: 47.9375rem)').matches;
    const base = isMobile && mobileBase ? mobileBase : el.getAttribute('data-frames') || '';
    const count = Math.max(1, Number(el.getAttribute('data-frames-count')) || 1);
    const framePath = (i) => `${base}${String(i).padStart(pad, '0')}.${ext}`;

    let naturalW = 0;
    let naturalH = 0;
    try {
      const img = await new Promise((resolve, reject) => {
        const im = new Image();
        im.onload = () => resolve(im);
        im.onerror = () => reject(new Error('frame illisible'));
        im.src = framePath(1);
      });
      naturalW = img.naturalWidth;
      naturalH = img.naturalHeight;
    } catch {
      continue; // sequence illisible : rien a mesurer, pas de faux ✗
    }

    // Poids moyen sur 3 frames (premiere/milieu/derniere, dedupliquees si count < 3).
    const indices = [...new Set([1, Math.max(1, Math.round(count / 2)), count])];
    let totalBytes = 0;
    let framesChecked = 0;
    for (const i of indices) {
      try {
        const res = await fetch(framePath(i));
        const blob = await res.blob();
        totalBytes += blob.size;
        framesChecked++;
      } catch {
        /* frame injoignable : ignoree du calcul de moyenne */
      }
    }
    const avgBytes = framesChecked ? totalBytes / framesChecked : 0;

    frames.push({
      selector: cssPath(el),
      base,
      isMobile,
      canvasW: canvas.width,
      canvasH: canvas.height,
      naturalW,
      naturalH,
      avgBytes,
      framesChecked,
      framesTotal: indices.length,
    });
  }

  return { dpr, images, videos, frames };
}

// ---------------------------------------------------------------------------------------------
// Cote Node : applique les verdicts (fonctions pures ci-dessus) aux mesures brutes recoltees.
// ---------------------------------------------------------------------------------------------

function evaluerPage(mesures, slug) {
  const { dpr, images, videos, frames } = mesures;
  const items = [];

  for (const img of images) {
    const { ratio, verdict } = verdictAgrandissement({ displayPx: img.displayW, dpr, naturalPx: img.naturalW });
    if (verdict === 'ok' || verdict === 'inconnu') continue;
    const suggestion =
      verdict === 'surdimensionnee'
        ? `source ${img.naturalW}px bien plus grande que necessaire (affichee ${Math.round(img.displayW)}px x ${dpr}dpr) — resservir une largeur plus petite avec \`ff images ${slug}\`.`
        : `regenerer avec \`ff images ${slug}\` en ${largeurSuggeree(img.displayW, dpr)}px minimum (affichee ${Math.round(img.displayW)}px x ${dpr}dpr, source actuelle ${img.naturalW}px).`;
    items.push({
      type: 'image',
      selector: img.selector,
      fichier: img.src,
      affiche: `${Math.round(img.displayW)}x${Math.round(img.displayH)}`,
      dpr,
      naturel: `${img.naturalW}x${img.naturalH}`,
      ratio: round2(ratio),
      verdict,
      symbole: symboleVerdict(verdict),
      suggestion,
    });
  }

  for (const vid of videos) {
    const { ratio, verdict } = verdictAgrandissement({ displayPx: vid.displayW, dpr, naturalPx: vid.naturalW });
    if (verdict === 'ok' || verdict === 'inconnu') continue;
    const suggestion =
      verdict === 'surdimensionnee'
        ? `video source ${vid.naturalW}px bien plus grande que necessaire (affichee ${Math.round(vid.displayW)}px x ${dpr}dpr) — reexporter plus legere.`
        : `video source (${vid.naturalW}px) trop petite pour l'affichage (${Math.round(vid.displayW)}px x ${dpr}dpr) — reexporter en plus grande resolution.`;
    items.push({
      type: 'video',
      selector: vid.selector,
      fichier: vid.src,
      affiche: `${Math.round(vid.displayW)}x${Math.round(vid.displayH)}`,
      dpr,
      naturel: `${vid.naturalW}x${vid.naturalH}`,
      ratio: round2(ratio),
      verdict,
      symbole: symboleVerdict(verdict),
      suggestion,
    });
  }

  for (const fr of frames) {
    const { ratio, verdict } = verdictAgrandissement({ displayPx: fr.canvasW, dpr: 1, naturalPx: fr.naturalW });
    if (verdict !== 'ok' && verdict !== 'inconnu') {
      const suggestion =
        verdict === 'surdimensionnee'
          ? `frames sources (${fr.naturalW}px) bien plus grandes que le canvas affiche (${fr.canvasW}px) — reencoder avec \`ff sequence <slug> <video.mp4> --largeur ${Math.max(480, Math.ceil(fr.canvasW / 100) * 100)}\` pour alleger.`
          : `regenerer avec \`ff sequence <slug> <video.mp4> --largeur ${Math.max(480, Math.ceil(fr.canvasW / 100) * 100)} --nom <nom>\` (canvas ${fr.canvasW}x${fr.canvasH}px, frame source actuelle ${fr.naturalW}x${fr.naturalH}px).`;
      items.push({
        type: 'frames-taille',
        selector: fr.selector,
        fichier: fr.base,
        affiche: `${fr.canvasW}x${fr.canvasH} (canvas, DPR deja inclus)`,
        dpr: 1,
        naturel: `${fr.naturalW}x${fr.naturalH}`,
        ratio: round2(ratio),
        verdict,
        symbole: symboleVerdict(verdict),
        suggestion,
      });
    }

    const poidsVerdict = verdictPoidsFrame({ naturalPx: fr.naturalW, avgBytes: fr.avgBytes });
    if (poidsVerdict !== 'ok' && poidsVerdict !== 'inconnu') {
      const qualiteSuggeree = poidsVerdict === 'destructrice' ? 82 : 76;
      items.push({
        type: 'frames-poids',
        selector: fr.selector,
        fichier: fr.base,
        affiche: `${Math.round(fr.avgBytes / 1024)} Ko/frame (moyenne sur ${fr.framesChecked}/${fr.framesTotal} frames)`,
        naturel: `${fr.naturalW}x${fr.naturalH}`,
        verdict: poidsVerdict,
        symbole: symboleVerdict(poidsVerdict),
        suggestion: `compression ${poidsVerdict === 'destructrice' ? 'destructrice' : 'limite'} (${Math.round(fr.avgBytes / 1024)} Ko/frame) — regenerer avec \`ff sequence <slug> <video.mp4> --largeur ${fr.canvasW} --qualite ${qualiteSuggeree}\`.`,
      });
    }
  }

  const echec = items.some((i) => i.symbole === '✗');
  return { items, ok: !echec };
}

function detailLine(item) {
  const largeurs = item.type.startsWith('frames') ? '' : ` ratio=${item.ratio}`;
  return `${item.selector} — ${item.fichier} — affiche=${item.affiche}${item.dpr ? ` dpr=${item.dpr}` : ''} naturel=${item.naturel}${largeurs} — ${item.suggestion}`;
}

async function auditPage(browser, url, viewport) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.deviceScaleFactor,
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await scrollSlowlyToBottom(page);
  const mesures = await page.evaluate(collectMesures);
  await page.close();
  return mesures;
}

async function auditSlug(browser, slug) {
  const distDir = path.join(DIST_DIR, slug);
  if (!fs.existsSync(distDir)) {
    fail(`${slug} : dist/${slug} introuvable — lance \`node scripts/ff.mjs build ${slug}\` d'abord.`);
    return { slug, ok: false, pages: [] };
  }

  const server = startStaticServer(distDir);
  const port = server.address().port;
  const pages = choisirPages(distDir);

  info('');
  info(c.bold(`— ${slug} —`));

  const report = { slug, generatedAt: new Date().toISOString(), pages: [] };
  let siteOk = true;

  for (const pageDef of pages) {
    info(`  ${c.bold(pageDef.label)} :`);
    const pageReport = { label: pageDef.label, path: pageDef.urlPath, viewports: [] };
    let pageOk = true;

    for (const viewport of VIEWPORTS) {
      const url = `http://localhost:${port}${pageDef.urlPath}`;
      const mesures = await auditPage(browser, url, viewport);
      const { items, ok: vpOk } = evaluerPage(mesures, slug);
      pageOk = pageOk && vpOk;

      const label = `${viewport.name} (${viewport.width}x${viewport.height} @${viewport.deviceScaleFactor}x)`;
      if (items.length === 0) {
        ok(`  ${label} : nettete correcte (${mesures.images.length} image(s), ${mesures.frames.length} sequence(s), ${mesures.videos.length} video(s) verifiees).`);
      } else {
        const nbEchecs = items.filter((i) => i.symbole === '✗').length;
        const nbWarns = items.length - nbEchecs;
        if (nbEchecs > 0) fail(`  ${label} : ${nbEchecs} probleme(s) net (${nbWarns} avertissement(s))`);
        else info(`  ${c.yellow('⚠')} ${label} : ${nbWarns} avertissement(s)`);
        for (const item of items.slice(0, 12)) {
          const line = detailLine(item);
          if (item.symbole === '✗') fail(`      ${line}`);
          else info(`      ${c.yellow('⚠')} ${line}`);
        }
        if (items.length > 12) info(`      … +${items.length - 12}`);
      }

      pageReport.viewports.push({
        name: viewport.name,
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: viewport.deviceScaleFactor,
        ok: vpOk,
        items,
      });
    }

    pageReport.ok = pageOk;
    siteOk = siteOk && pageOk;
    report.pages.push(pageReport);
  }

  server.close();
  report.ok = siteOk;
  if (siteOk) ok(`${slug} : nettete OK sur toutes les pages/viewports audites.`);
  else fail(`${slug} : au moins un probleme de nettete releve ci-dessus.`);
  return report;
}

export async function cmdNettete(args) {
  const slugs = args.length ? args : defaultSlugs();
  if (!slugs.length) {
    fail('Aucun site construit dans dist/. Lance `node scripts/ff.mjs build <slug>` d\'abord.');
    process.exit(1);
  }

  const capturesDir = path.join(ROOT, 'captures');
  fs.mkdirSync(capturesDir, { recursive: true });

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const reports = [];
  try {
    for (const slug of slugs) {
      const report = await auditSlug(browser, slug);
      reports.push(report);
      fs.writeFileSync(path.join(capturesDir, `${slug}-nettete.json`), JSON.stringify(report, null, 2));
    }
  } finally {
    await browser.close();
  }

  info('');
  const failed = reports.filter((r) => !r.ok);
  if (failed.length === 0) {
    ok(`Tous les sites audites (${reports.length}) ont une nettete correcte.`);
    process.exit(0);
  } else {
    fail(`${failed.length}/${reports.length} site(s) avec au moins un probleme de nettete : ${failed.map((r) => r.slug).join(', ')}`);
    process.exit(1);
  }
}
