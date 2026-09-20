// `ff audit-motion [slug ...]` : audite les animations (moteur src/scripts/motion.ts + bloc motion de
// src/styles/global.css) d'un ou plusieurs sites DEJA CONSTRUITS dans dist/ (lance `ff build <slug>`
// avant si besoin — cette commande ne construit rien elle-meme). Ouvre chaque site dans Chrome
// (playwright-core), viewport desktop (1400x900) puis mobile (390x844) : defile lentement jusqu'en bas
// par pas de 300px/120ms (laisse le temps aux IntersectionObserver et au scrub GSAP de se declencher),
// remonte en haut, redescend une seconde fois, puis inspecte le DOM pour reperer les animations
// bloquees ou cassees :
//   - [data-reveal]/[data-stagger] > */.split-word > span/.fill-word encore invisibles apres le scroll ;
//   - [data-pin]/[data-frames]/[data-horizontal] : spacer ScrollTrigger demesure (> 400vh, fin cassee),
//     [data-pin-step] dont aucun n'est jamais devenu .is-active ;
//   - [data-frames-canvas] jamais dessine (pixel central transparent) ;
//   - [data-shader] (fond WebGL, src/scripts/shader.ts) : canvas .ff-shader-canvas present mais jamais
//     dessine (data-shader-state != "drawn"), ou repli sans degrade — un canvas WebGL ne se lit pas
//     par getContext('2d') (contexte deja pris), d'ou l'etat pose par le moteur plutot qu'un pixel ;
//   - [data-marquee] dont .marquee-track n'a pas ete dupliquee (< 2 enfants) ;
//   - [data-counter] reste a "0" ou vide ;
//   - debordement horizontal (scrollWidth > clientWidth) hors pistes volontairement plus larges
//     (data-horizontal, marquee, drag-grid, frames) ;
//   - erreurs console et requetes en echec ;
//   - typographie demesuree / titre coupe au milieu d'un mot (h1) ;
//   - contraste insuffisant (< 4.5:1) sur .eyebrow/.text-muted vs fond effectif (parents remontes).
// Rapport en francais (✓/✗) par site, ecrit captures/<slug>-motion.json, sort en erreur (process.exit 1)
// si un site echoue sur au moins un des deux viewports. Voir docs/ANIMATIONS.md et
// src/scripts/motion.ts pour le detail des attributs testes.
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { DIST_DIR, ROOT, ok, fail, warn, info, c } from './util.mjs';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2',
  '.xml': 'application/xml', '.txt': 'text/plain', '.mp4': 'video/mp4', '.json': 'application/json',
};

const VIEWPORTS = [
  { name: 'desktop', width: 1400, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const SKIP_PREFIXES = ['_test', '_vignette', '_prop'];

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

/** Defile lentement jusqu'en bas de page, par pas de 300px toutes les 120ms (laisse le temps aux
 * IntersectionObserver et au scrub GSAP ScrollTrigger de se declencher au fil du scroll). */
async function scrollSlowlyToBottom(page) {
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 300) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(120);
}

/** Le gros de l'audit : execute dans la page (DOM only, aucune dependance externe). */
function collectDiagnostics() {
  /* eslint-disable no-undef */
  const results = {
    revealStuck: [],
    pinIssues: [],
    framesCanvasBlank: [],
    marqueeBroken: [],
    counterStuck: [],
    overflowX: [],
    typography: [],
    contrastIssues: [],
  };

  function cssPath(el, maxDepth = 5) {
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
      const parent = node.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter((c2) => c2.tagName === node.tagName);
        if (siblings.length > 1) sel += `:nth-of-type(${siblings.indexOf(node) + 1})`;
      }
      parts.unshift(sel);
      node = node.parentElement;
    }
    return parts.join(' > ');
  }

  function snippet(el) {
    const t = (el.textContent || '').trim().replace(/\s+/g, ' ');
    return t.length > 60 ? `${t.slice(0, 60)}…` : t;
  }

  // ---- 1. data-reveal / data-stagger > * / .split-word > span / .fill-word encore invisibles ----
  // Note : getComputedStyle() rend "matrix(1, 0, 0, 1, 0, 0)" (identite) au lieu du mot-cle "none" des
  // qu'une regle CSS pose transform:translateY(0) plutot que transform:none (cas de .split-word/
  // .split-char apres reveal) — DOMMatrixReadOnly.isIdentity evite un faux positif sur ces elements.
  function isIdentityTransform(str) {
    if (!str || str === 'none') return true;
    try {
      return new DOMMatrixReadOnly(str).isIdentity;
    } catch {
      return false;
    }
  }
  document.querySelectorAll('[data-reveal], [data-stagger] > *, .split-word > span, .fill-word').forEach((el) => {
    // Ignore ce qui n'est pas rendu du tout (menu plein ecran ferme par defaut, onglet inactif...) :
    // un panneau garde `hidden`/`display:none` tant qu'il n'a pas ete ouvert au clic — normal, ce
    // n'est pas le scroll qui doit le reveler. getClientRects() reste fiable meme en position:fixed
    // (contrairement a offsetParent, toujours null pour du fixed).
    if (el.getClientRects().length === 0) return;
    // Ignore aussi ce qui EST rendu (a des client rects) mais reste cache derriere un panneau/dialogue
    // FERME : la nav "burger" (src/sections/Nav/burger.astro) est `position: fixed` en plein ecran,
    // donc garde des client rects meme translatee hors-champ (opacity:0, transform:translateY(-100%),
    // pointer-events:none) — seul son `aria-hidden="true"` (pose au repos, retire au clic) dit qu'il
    // est ferme. Meme logique pour tout `[hidden]` ou `<dialog>` non ouvert : ce n'est pas le scroll
    // qui doit les reveler, l'audit ne clique jamais sur le bouton d'ouverture.
    if (el.closest('[aria-hidden="true"], [hidden], dialog:not([open])')) return;
    const cs = getComputedStyle(el);
    const opacity = parseFloat(cs.opacity);
    const transform = cs.transform;
    const clip = cs.clipPath;
    const clipOk = clip === 'none' || /^inset\(0(px)?(\s+0(px)?){0,3}\)$/.test(clip);
    // Un element qui porte AUSSI un effet continu pilote par le scroll (parallaxe, profondeur,
    // scrub) garde en permanence un transform non identitaire pose par GSAP : c'est voulu, pas un
    // reveal bloque. On ne juge alors que l'opacite et le clip (maison-aurore : image de hero en
    // data-reveal="blur" + data-parallax="0.15", translateY de 54px au repos).
    const transformPilote = el.matches('[data-parallax], [data-depth], [data-scrub], [data-parallax-depth]');
    if (opacity < 0.9 || (!transformPilote && !isIdentityTransform(transform)) || !clipOk) {
      results.revealStuck.push({ selector: cssPath(el), text: snippet(el), opacity, transform, clip });
    }
  });

  // ---- 2. data-pin / data-frames(+data-pin) / data-horizontal : spacer et pin-step ----
  // Le seuil "> 400vh = fin probablement cassee" ne vaut que pour data-pin/data-frames, dont la
  // longueur est un pourcentage d'ecran fixe pose par l'auteur (data-pin="120", defaut 100). Pour
  // data-horizontal, la longueur du pin depend de la largeur reelle de la piste (nombre de
  // panneaux x largeur), donc proportionnelle au contenu par design : un long spacer y est normal
  // (une piste de 5 panneaux larges peut legitimement depasser 450vh) — seuil beaucoup plus large.
  document.querySelectorAll('[data-pin]').forEach((el) => {
    const spacer = el.closest('.pin-spacer');
    if (spacer) {
      const heightVh = (spacer.getBoundingClientRect().height / window.innerHeight) * 100;
      if (heightVh > 400) {
        results.pinIssues.push({ selector: cssPath(el), type: 'spacer-demesure', heightVh: Math.round(heightVh) });
      }
    }
    const steps = el.querySelectorAll('[data-pin-step]');
    if (steps.length > 0 && !Array.from(steps).some((s) => s.classList.contains('is-active'))) {
      results.pinIssues.push({ selector: cssPath(el), type: 'aucune-etape-active' });
    }
  });
  document.querySelectorAll('[data-horizontal]').forEach((el) => {
    const spacer = el.closest('.pin-spacer');
    if (spacer) {
      const heightVh = (spacer.getBoundingClientRect().height / window.innerHeight) * 100;
      if (heightVh > 1200) {
        results.pinIssues.push({ selector: cssPath(el), type: 'spacer-horizontal-demesure', heightVh: Math.round(heightVh) });
      }
    }
  });

  // ---- 3. data-frames-canvas jamais dessine ----
  document.querySelectorAll('[data-frames-canvas]').forEach((canvas) => {
    const cs = getComputedStyle(canvas);
    if (cs.display === 'none' || canvas.offsetParent === null) return; // repli poster actif, canvas masque : normal
    try {
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) {
        results.framesCanvasBlank.push({ selector: cssPath(canvas), reason: 'dimensions nulles' });
        return;
      }
      const px = ctx.getImageData(Math.floor(w / 2), Math.floor(h / 2), 1, 1).data;
      if (px[3] === 0) results.framesCanvasBlank.push({ selector: cssPath(canvas), reason: 'pixel central transparent (jamais dessine)' });
    } catch (e) {
      results.framesCanvasBlank.push({ selector: cssPath(canvas), reason: `lecture impossible : ${e.message}` });
    }
  });

  // ---- 3bis. data-shader : fond WebGL dessine (data-shader-state="drawn") ou repli pose ----
  // Un canvas de shader est "dessine" des que shader.ts a rendu une frame (etat pose par le moteur) :
  // il ne passe jamais par le test du pixel 2D ci-dessus (getContext('2d') rend null sur un canvas
  // WebGL, ce qui serait un faux positif "lecture impossible"). Le repli (subtle/reduced/WebGL absent,
  // data-shader-state="fallback") est OK s'il a bien pose un background-image.
  document.querySelectorAll('[data-shader]').forEach((el) => {
    if (el.getClientRects().length === 0) return;
    const state = el.getAttribute('data-shader-state') || '';
    const canvas = el.querySelector(':scope > canvas.ff-shader-canvas');
    if (state === 'drawn') {
      if (canvas && (!canvas.width || !canvas.height)) results.framesCanvasBlank.push({ selector: cssPath(el), reason: 'canvas de shader a dimensions nulles' });
      return;
    }
    if (state === 'fallback') {
      const bg = getComputedStyle(el).backgroundImage;
      if (!bg || bg === 'none') results.framesCanvasBlank.push({ selector: cssPath(el), reason: 'repli data-shader sans background-image' });
      return;
    }
    if (canvas && getComputedStyle(canvas).display !== 'none') {
      results.framesCanvasBlank.push({ selector: cssPath(el), reason: `canvas de shader jamais dessine (data-shader-state="${state || '(absent)'}")` });
    } else if (!state) {
      results.framesCanvasBlank.push({ selector: cssPath(el), reason: 'data-shader sans canvas ni repli (moteur non execute ?)' });
    }
  });

  // ---- 4. data-marquee : .marquee-track dupliquee (>= 2 enfants) ----
  document.querySelectorAll('[data-marquee]').forEach((el) => {
    const track = el.querySelector('.marquee-track');
    if (!track) {
      results.marqueeBroken.push({ selector: cssPath(el), reason: 'aucune .marquee-track trouvee' });
      return;
    }
    if (track.children.length < 2) {
      results.marqueeBroken.push({ selector: cssPath(el), reason: `.marquee-track avec seulement ${track.children.length} enfant(s) (duplication ratee)` });
    }
  });

  // ---- 5. data-counter reste a "0" ou vide ----
  document.querySelectorAll('[data-counter]').forEach((el) => {
    const txt = (el.textContent || '').trim();
    if (txt === '0' || txt === '') results.counterStuck.push({ selector: cssPath(el), text: txt || '(vide)' });
  });

  // ---- 6. debordement horizontal (hors pistes volontairement plus larges que l'ecran) ----
  const vw = document.documentElement.clientWidth;
  const seenOverflow = new Set();
  document.querySelectorAll('body *').forEach((el) => {
    if (results.overflowX.length >= 15) return;
    if (el.closest('[data-horizontal], .marquee-track, [data-drag-grid], [data-frames]')) return;
    if (el.clientWidth <= 0 || el.scrollWidth <= el.clientWidth + 4) return;
    // Texte pour lecteurs d'ecran (.sr-only : 1x1 px, overflow hidden, clip) : deborde par construction.
    if (el.clientWidth <= 1 && el.clientHeight <= 1 && getComputedStyle(el).overflow === 'hidden') return;
    const rect = el.getBoundingClientRect();
    if (rect.right <= vw + 2 && rect.left >= -2) return;
    const key = `${el.tagName}.${el.className || ''}`;
    if (seenOverflow.has(key)) return;
    seenOverflow.add(key);
    results.overflowX.push({ selector: cssPath(el), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth });
  });

  // ---- 7. typographie : taille demesuree ou titre (h1) coupe au milieu d'un mot ----
  document.querySelectorAll('h1').forEach((el) => {
    const cs = getComputedStyle(el);
    const fontSize = parseFloat(cs.fontSize) || 0;
    const text = (el.textContent || '').trim();
    const words = text.split(/\s+/).filter(Boolean);
    const lineHeight = (() => {
      if (cs.lineHeight === 'normal') return fontSize * 1.2;
      const n = parseFloat(cs.lineHeight);
      return Number.isNaN(n) ? fontSize * 1.2 : n;
    })();
    if (fontSize > 0.9 * window.innerWidth) {
      results.typography.push({ selector: cssPath(el), text: snippet(el), reason: `taille de police ${Math.round(fontSize)}px > 90% de la largeur d'ecran (${window.innerWidth}px)` });
    } else if (words.length === 1 && el.clientHeight > lineHeight * 2 + 4) {
      results.typography.push({ selector: cssPath(el), text: snippet(el), reason: `mot unique mais hauteur ${Math.round(el.clientHeight)}px (~${Math.round(el.clientHeight / lineHeight)} lignes) : coupe au milieu du mot` });
    }
  });

  // ---- 8. contraste .eyebrow / .text-muted vs fond effectif ----
  function parseColor(str) {
    const m = /rgba?\(([^)]+)\)/.exec(str || '');
    if (!m) return null;
    const parts = m[1].split(',').map((s) => parseFloat(s));
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  }
  function luminance({ r, g, b }) {
    const a = [r, g, b].map((v) => {
      const vv = v / 255;
      return vv <= 0.03928 ? vv / 12.92 : ((vv + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }
  function effectiveBackground(startEl) {
    let node = startEl;
    while (node) {
      const bg = parseColor(getComputedStyle(node).backgroundColor);
      if (bg && bg.a > 0.01) {
        if (bg.a < 1) return { r: bg.r * bg.a + 255 * (1 - bg.a), g: bg.g * bg.a + 255 * (1 - bg.a), b: bg.b * bg.a + 255 * (1 - bg.a) };
        return bg;
      }
      node = node.parentElement;
    }
    return { r: 255, g: 255, b: 255 };
  }
  document.querySelectorAll('.eyebrow, .text-muted').forEach((el) => {
    if (el.offsetParent === null) return; // masque : rien a evaluer visuellement
    const text = (el.textContent || '').trim();
    if (!text) return;
    const fg = parseColor(getComputedStyle(el).color);
    if (!fg) return;
    const bg = effectiveBackground(el.parentElement || el);
    const contrast = (Math.max(luminance(fg), luminance(bg)) + 0.05) / (Math.min(luminance(fg), luminance(bg)) + 0.05);
    if (contrast < 4.5) {
      results.contrastIssues.push({ selector: cssPath(el), text: snippet(el), contrast: Math.round(contrast * 100) / 100 });
    }
  });

  return results;
}

/** Audite une page deja chargee (scroll + collecte), pour un viewport donne. */
async function auditPage(page) {
  await scrollSlowlyToBottom(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
  await scrollSlowlyToBottom(page);
  await page.waitForTimeout(300);
  return page.evaluate(collectDiagnostics);
}

const SECTIONS = [
  ['revealStuck', 'Apparitions au scroll (data-reveal/data-stagger/split/fill-word)'],
  ['pinIssues', 'Sections epinglees (data-pin/data-horizontal)'],
  ['framesCanvasBlank', "Canvas (data-frames-canvas, data-shader)"],
  ['marqueeBroken', 'Bandeau defilant (data-marquee)'],
  ['counterStuck', 'Compteurs (data-counter)'],
  ['overflowX', 'Debordement horizontal'],
  ['typography', 'Typographie (titres)'],
  ['contrastIssues', 'Contraste (.eyebrow / .text-muted)'],
];

function detailLine(section, item) {
  switch (section) {
    case 'revealStuck':
      return `${item.selector} — opacity=${item.opacity} transform=${item.transform} clip-path=${item.clip} — "${item.text}"`;
    case 'pinIssues':
      if (item.type === 'spacer-demesure') return `${item.selector} — spacer de ${item.heightVh}vh (probablement une fin cassee)`;
      if (item.type === 'spacer-horizontal-demesure') return `${item.selector} — spacer horizontal de ${item.heightVh}vh (verifier la largeur de la piste)`;
      return `${item.selector} — aucune [data-pin-step] jamais active`;
    case 'framesCanvasBlank':
      return `${item.selector} — ${item.reason}`;
    case 'marqueeBroken':
      return `${item.selector} — ${item.reason}`;
    case 'counterStuck':
      return `${item.selector} — texte : "${item.text}"`;
    case 'overflowX':
      return `${item.selector} — scrollWidth=${item.scrollWidth}px clientWidth=${item.clientWidth}px`;
    case 'typography':
      return `${item.selector} — ${item.reason} — "${item.text}"`;
    case 'contrastIssues':
      return `${item.selector} — contraste ${item.contrast}:1 — "${item.text}"`;
    default:
      return JSON.stringify(item);
  }
}

async function auditSlug(browser, slug) {
  const distDir = path.join(DIST_DIR, slug);
  if (!fs.existsSync(distDir)) {
    fail(`${slug} : dist/${slug} introuvable — lance \`node scripts/ff.mjs build ${slug}\` d'abord.`);
    return { slug, ok: false, viewports: [] };
  }

  const server = startStaticServer(distDir);
  const port = server.address().port;

  info('');
  info(c.bold(`— ${slug} —`));

  const report = { slug, generatedAt: new Date().toISOString(), viewports: [] };
  let siteOk = true;

  for (const viewport of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });
    const consoleErrors = [];
    const failedRequests = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push(e.message));
    page.on('requestfailed', (r) => failedRequests.push(r.url()));

    await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
    const diagnostics = await auditPage(page);
    diagnostics.consoleErrors = consoleErrors;
    diagnostics.failedRequests = failedRequests;
    await page.close();

    const vpOk = SECTIONS.every(([key]) => diagnostics[key].length === 0) && consoleErrors.length === 0 && failedRequests.length === 0;
    siteOk = siteOk && vpOk;

    info(`  ${c.bold(viewport.name)} (${viewport.width}x${viewport.height}) :`);
    for (const [key, label] of SECTIONS) {
      const items = diagnostics[key];
      if (items.length === 0) {
        ok(`  ${label}`);
      } else {
        fail(`  ${label} (${items.length})`);
        for (const item of items.slice(0, 8)) info(`      ${detailLine(key, item)}`);
        if (items.length > 8) info(`      … +${items.length - 8}`);
      }
    }
    if (consoleErrors.length === 0) ok('  Console (aucune erreur)');
    else {
      fail(`  Console (${consoleErrors.length} erreur(s))`);
      for (const e of consoleErrors.slice(0, 5)) info(`      ${e}`);
    }
    if (failedRequests.length === 0) ok('  Requetes (aucun echec)');
    else {
      fail(`  Requetes en echec (${failedRequests.length})`);
      for (const u of failedRequests.slice(0, 5)) info(`      ${u}`);
    }

    report.viewports.push({ name: viewport.name, width: viewport.width, height: viewport.height, ok: vpOk, diagnostics });
  }

  server.close();
  report.ok = siteOk;
  if (siteOk) ok(`${slug} : animations OK sur les deux viewports.`);
  else fail(`${slug} : au moins un probleme releve ci-dessus.`);
  return report;
}

export async function cmdAuditMotion(args) {
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
      fs.writeFileSync(path.join(capturesDir, `${slug}-motion.json`), JSON.stringify(report, null, 2));
    }
  } finally {
    await browser.close();
  }

  info('');
  const failed = reports.filter((r) => !r.ok);
  if (failed.length === 0) {
    ok(`Tous les sites audites (${reports.length}) sont verts sur les deux viewports.`);
    process.exit(0);
  } else {
    fail(`${failed.length}/${reports.length} site(s) avec au moins un probleme : ${failed.map((r) => r.slug).join(', ')}`);
    process.exit(1);
  }
}
