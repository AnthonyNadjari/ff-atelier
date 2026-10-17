// `ff pistes <slug> [<slug-b> <slug-c> …] [--sans-film] [--seuil 0.09]`
// Compare les pistes d'un même client (défaut : <slug>, <slug>-b, <slug>-c… qui existent) sur les sept axes de
// /site-final § 1bis : squelette, direction/couleur, typographie, rythme, mécanisme du geste, entrée du premier
// écran, manière d'apparaître au défilement. Deux pistes qui partagent l'entrée ou l'apparition échouent ; deux
// pistes qui partagent plus d'un axe échouent (la plus faible est à réinventer).
//
// Deux sources : les fichiers (site.config.ts, direction.md, sections sur mesure, CSS de la direction) pour les
// axes statiques, et un FILM comparé (Chrome, téléphone 390x844) pour l'entrée : premier écran de chaque piste à
// 0, 150, 400, 800 et 1 500 ms côte à côte, puis la première section sous le hero à +250 ms. La ressemblance
// de deux colonnes à 400 ms est mesurée (distance moyenne des pixels en gris 32x32) : sous le seuil, même entrée.
//
// Pourquoi (16 oct 2026) : les trois premières pistes de la fromagerie étaient jugées « très similaires » par
// le fondateur alors que chacune avait sa direction et sa police. La ressemblance était dans le mouvement, que
// ni `ff variete` ni une planche fixe ne voient. Sortie : captures/planches/<slug>-pistes.jpg et
// captures/<slug>-pistes.json (locaux, jamais commités).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { ROOT, SITES_DIR, DIST_DIR, resolveSlug, ok, fail, info, warn, parseArgs, listSites } from './util.mjs';
import { effectiveLook } from './look-data.mjs';
import { loadHeadersRules, headersForPath } from './headers-file.mjs';

export const AXES = ['squelette', 'couleur', 'typographie', 'rythme', 'geste', 'entree', 'apparition'];
const SEUIL_IMAGE = 0.09;

/* ---------- lecture des fichiers ---------- */

/** Pistes par défaut : <slug> puis <slug>-b, -c, … qui existent dans sites/. */
export function pistesParDefaut(slug, existantes) {
  const out = existantes.includes(slug) ? [slug] : [];
  for (const l of 'bcdefgh') if (existantes.includes(`${slug}-${l}`)) out.push(`${slug}-${l}`);
  return out;
}

function lire(p) { return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : ''; }

/** Pure : les quatre lignes MOUVEMENT du contrat (1 entrée, 2 rythme, 3 geste, 4 image), texte brut. */
export function lignesMouvement(contrat) {
  const i = contrat.search(/^- MOUVEMENT/m);
  if (i < 0) return {};
  const bloc = contrat.slice(i).split(/\n- (?=[A-ZÉ]{3,})/)[0];
  const out = {};
  for (const [cle, re] of [['entree', /^\s*1\.\s*(.*?)(?=^\s*2\.|\s*Courbes|$)/ms], ['apparition', /^\s*2\.\s*(.*?)(?=^\s*3\.|\s*Courbes|$)/ms], ['geste', /^\s*3\.\s*(.*?)(?=^\s*4\.|\s*Courbes|$)/ms], ['image', /^\s*4\.\s*(.*?)(?=\s*Courbes|$)/ms]]) {
    const m = re.exec(bloc);
    if (m) out[cle] = m[1].replace(/\s+/g, ' ').replace(/^(?:Entrée|Rythme(?: au défilement)?|Feu d'artifice|Image(?: qui bouge)?)\s*:\s*/i, '').trim();
  }
  return out;
}

const VIDES = new Set('le la les un une des du de d l et ou à a au aux en sur sous dans par pour avec sans qui que quoi dont où ce cette ces se sa son ses leur leurs on il elle ils elles est sont puis quand comme plus moins très tout toute tous chaque même autre raison sec lent ms s'.split(' '));
/** Pure : mots-clés d'une ligne de contrat (racines de 4 lettres, sans mots vides ni chiffres). */
export function motsCles(texte) {
  return new Set((texte || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[a-z]{4,}/g)?.filter((w) => !VIDES.has(w)).map((w) => w.slice(0, 5)) || []);
}
/** Pure : Jaccard de deux ensembles. */
export function jaccard(a, b) {
  if (!a.size && !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

/** Pure : ce que les sections sur mesure font bouger et comment on les déclenche. */
export function analyserSources(sources) {
  // Sans les commentaires : « aucun data-split » dans un en-tête de section n'est pas un data-split.
  const s = (sources || '').replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*(?:\/\/|\*).*$/gm, '');
  const declencheurs = new Set();
  if (/pointerdown|touchstart|mousedown|dragstart|type="range"|addEventListener\(\s*['"](?:click|input|change)['"]/.test(s)) declencheurs.add('doigt');
  if (/animation-timeline|view-timeline|scroll-timeline|\sdata-(?:scrub|parallax|pin|horizontal|frames|text-fill|stack)\b|addEventListener\(\s*['"]scroll['"]/.test(s)) declencheurs.add('defilement');
  if (/IntersectionObserver|\sdata-(?:reveal|stagger|draw|counter)\b/.test(s)) declencheurs.add('arrivee');
  const reveals = new Set([...s.matchAll(/\sdata-reveal="([^"]+)"/g)].map((m) => m[1]));
  for (const m of s.matchAll(/\sdata-(split|stagger|draw|draw-svg|counter|marquee|frames|scrub|parallax|pin|horizontal|text-fill)\b/g)) reveals.add(m[1]);
  const defilement = new Set([...s.matchAll(/\sdata-(pin|horizontal|stack|sticky-stack)\b/g)].map((m) => m[1]));
  if (/position:\s*sticky/.test(s)) defilement.add('sticky');
  return { declencheurs, reveals, defilement };
}

/** Pure : hex → luminance relative (0 sombre … 1 clair), null si illisible. */
export function luminance(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex || '').trim());
  if (!m) return null;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Profil d'une piste depuis ses fichiers (sans navigateur). */
export function profilDepuisFichiers({ slug, look, contrat, sources, dirCss, html }) {
  const mouv = lignesMouvement(contrat);
  const src = analyserSources(sources);
  const bg = (/--bg:\s*(#[0-9a-f]{6})/i.exec(dirCss) || [])[1];
  const accentH = Number((/--accent-h:\s*([\d.]+)/.exec(dirCss) || [])[1]);
  const sections = (look?.sections || []).map((s) => `${s.type}/${s.variant}`);
  const h1 = (/<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(html || '') || [])[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || '';
  return {
    slug,
    squelette: { shell: look?.shell, nav: look?.nav, hero: look?.hero, sections },
    couleur: { direction: look?.direction, bg, sombre: luminance(bg) != null ? luminance(bg) < 0.35 : null, accentH: Number.isFinite(accentH) ? accentH : null },
    typographie: { display: look?.typography?.display || null, body: look?.typography?.body || null },
    rythme: { nSections: sections.length, defilement: [...src.defilement].sort(), motion: look?.motion },
    geste: { declencheurs: [...src.declencheurs].sort(), mots: [...motsCles(mouv.geste)] },
    entree: { mots: [...motsCles(mouv.entree)], h1Split: /<h1\b[^>]*\bdata-split\b/i.test(html || ''), h1 },
    apparition: { reveals: [...src.reveals].sort(), mots: [...motsCles(mouv.apparition)] },
  };
}

const memeListe = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const ecartTeinte = (a, b) => (a == null || b == null ? 999 : Math.min(Math.abs(a - b), 360 - Math.abs(a - b)));

/** Pure : axes partagés par deux profils (+ distance d'image à 400 ms si connue). */
export function axesPartages(p, q, distanceImage = null, seuil = SEUIL_IMAGE) {
  const partages = [];
  const s = p.squelette, t = q.squelette;
  if (s.shell === t.shell && s.nav === t.nav && s.hero === t.hero && memeListe(s.sections, t.sections)) partages.push('squelette');
  const c = p.couleur, d = q.couleur;
  if (c.direction && c.direction === d.direction) partages.push('couleur');
  else if (c.sombre != null && c.sombre === d.sombre && ecartTeinte(c.accentH, d.accentH) <= 20) partages.push('couleur');
  if (p.typographie.display && p.typographie.display === q.typographie.display) partages.push('typographie');
  if (Math.abs(p.rythme.nSections - q.rythme.nSections) <= 1 && memeListe(p.rythme.defilement, q.rythme.defilement) && p.rythme.motion === q.rythme.motion) partages.push('rythme');
  if (memeListe(p.geste.declencheurs, q.geste.declencheurs) && jaccard(new Set(p.geste.mots), new Set(q.geste.mots)) >= 0.5) partages.push('geste');
  const entreeTexte = jaccard(new Set(p.entree.mots), new Set(q.entree.mots)) >= 0.5;
  const entreeMoteur = p.entree.h1Split && q.entree.h1Split;
  const entreeImage = distanceImage != null && distanceImage < seuil;
  if (entreeTexte || entreeMoteur || entreeImage) partages.push('entree');
  const a = p.apparition, b = q.apparition;
  const memesReveals = a.reveals.length > 0 && memeListe(a.reveals, b.reveals);
  if (memesReveals || jaccard(new Set(a.mots), new Set(b.mots)) >= 0.5) partages.push('apparition');
  return partages;
}

/** Pure : verdict d'un ensemble de profils. */
export function comparer(profils, distances = {}, seuil = SEUIL_IMAGE) {
  const paires = [];
  for (let i = 0; i < profils.length; i++) for (let j = i + 1; j < profils.length; j++) {
    const cle = `${profils[i].slug}|${profils[j].slug}`;
    const partages = axesPartages(profils[i], profils[j], distances[cle] ?? null, seuil);
    const echec = partages.includes('entree') || partages.includes('apparition') || partages.length > 1;
    paires.push({ a: profils[i].slug, b: profils[j].slug, partages, distanceImage: distances[cle] ?? null, echec });
  }
  return { paires, echec: paires.some((p) => p.echec) };
}

/* ---------- film comparé ---------- */

/** Pure : distance moyenne (0…1) entre deux tableaux de gris de même taille. */
export function distanceGris(a, b) {
  if (!a?.length || a.length !== b?.length) return null;
  let somme = 0;
  for (let i = 0; i < a.length; i++) somme += Math.abs(a[i] - b[i]);
  return somme / a.length / 255;
}

function servir(root) {
  const { createServer } = createRequire(import.meta.url)('node:http');
  const regles = loadHeadersRules(root);
  const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json', '.mp4': 'video/mp4', '.webm': 'video/webm' };
  return createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let f = path.join(root, pathname);
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f) && fs.existsSync(`${f}.html`)) f = `${f}.html`;
    const entetes = Object.fromEntries(headersForPath(regles, pathname));
    if (!fs.existsSync(f)) { res.writeHead(404, entetes); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] ?? 'application/octet-stream', ...entetes });
    fs.createReadStream(f).pipe(res);
  });
}

const TEMPS = [0, 150, 400, 800, 1500];
const VW = 390, VH = 844, LARG = 180;

async function filmer(slugs) {
  const require = createRequire(import.meta.url);
  const { chromium } = require('playwright-core');
  const sharp = require('sharp');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const colonnes = [];
  try {
    for (const slug of slugs) {
      const srv = servir(path.join(DIST_DIR, slug));
      await new Promise((r) => srv.listen(0, r));
      const page = await browser.newPage({ viewport: { width: VW, height: VH }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
      const vues = [];
      try {
        const t0 = Date.now();
        await page.goto(`http://127.0.0.1:${srv.address().port}/`, { waitUntil: 'commit' });
        for (const t of TEMPS) {
          const reste = t - (Date.now() - t0);
          if (reste > 0) await page.waitForTimeout(reste);
          // À 0 ms, Chrome peut refuser la capture (page pas encore composée) : un second essai suffit.
          vues.push({ label: `${t} ms`, png: await page.screenshot().catch(() => page.screenshot()) });
        }
        await page.waitForTimeout(600);
        // Première section sous le hero : le 2e enfant de <main> (ou la 2e section), amenée en haut.
        await page.evaluate(() => {
          const blocs = [...document.querySelectorAll('main > *, main > * > section')].filter((e) => e.getBoundingClientRect().height > 80);
          const cible = blocs.find((e) => e.getBoundingClientRect().top > window.innerHeight * 0.6) || blocs[1];
          cible?.scrollIntoView({ block: 'start' });
        });
        await page.waitForTimeout(250);
        vues.push({ label: 'section +250 ms', png: await page.screenshot() });
      } finally {
        await page.close();
        srv.close();
      }
      const gris400 = await sharp(vues[2].png).resize(32, 32, { fit: 'fill' }).grayscale().raw().toBuffer();
      const vignettes = [];
      for (const v of vues) {
        const buf = await sharp(v.png).resize(LARG).composite([{ input: Buffer.from(`<svg width="${LARG}" height="16"><rect width="${LARG}" height="16" fill="#ff0"/><text x="3" y="12" font-size="10" font-family="Arial">${slug} · ${v.label}</text></svg>`), top: 0, left: 0 }]).png().toBuffer();
        vignettes.push(buf);
      }
      colonnes.push({ slug, vignettes, gris400: [...gris400] });
    }
  } finally {
    await browser.close();
  }
  return { colonnes, sharp };
}

async function assembler(colonnes, sharp, sortie) {
  const h = Math.round(LARG * VH / VW) + 4, w = LARG + 4;
  const rows = TEMPS.length + 1;
  const composites = [];
  colonnes.forEach((c, i) => c.vignettes.forEach((input, j) => composites.push({ input, left: i * w, top: j * h })));
  await sharp({ create: { width: colonnes.length * w, height: rows * h, channels: 3, background: '#777' } }).composite(composites).jpeg({ quality: 78 }).toFile(sortie);
}

export async function cmdPistes(args) {
  const { positional, flags } = parseArgs(args);
  const existantes = listSites({ excludeUnderscore: true });
  const slugs = positional.length > 1 ? positional.map(resolveSlug) : pistesParDefaut(resolveSlug(positional[0]), existantes);
  if (slugs.length < 2) { fail(`Il faut au moins deux pistes (trouvé : ${slugs.join(', ') || 'aucune'}).`); process.exit(1); }
  const seuil = Number(flags.seuil) || SEUIL_IMAGE;
  const profils = [];
  for (const slug of slugs) {
    const dir = path.join(SITES_DIR, slug);
    const look = effectiveLook(slug);
    if (!look) { fail(`${slug} : site.config.ts illisible.`); process.exit(1); }
    const sectionsDir = path.join(dir, 'sections');
    const sources = fs.existsSync(sectionsDir) ? fs.readdirSync(sectionsDir).filter((f) => f.endsWith('.astro')).map((f) => lire(path.join(sectionsDir, f))).join('\n') : '';
    const dirCss = lire(path.join(ROOT, 'src', 'directions', look.direction || '', 'index.css'));
    const html = lire(path.join(DIST_DIR, slug, 'index.html'));
    if (!html) warn(`${slug} : dist absent, l'entrée ne sera pas filmée (ff build ${slug}).`);
    profils.push(profilDepuisFichiers({ slug, look, contrat: lire(path.join(dir, 'direction.md')), sources, dirCss, html }));
  }
  const distances = {};
  let film = null;
  const filmables = slugs.filter((s) => fs.existsSync(path.join(DIST_DIR, s, 'index.html')));
  if (!flags['sans-film'] && filmables.length >= 2) {
    const { colonnes, sharp } = await filmer(filmables);
    for (let i = 0; i < colonnes.length; i++) for (let j = i + 1; j < colonnes.length; j++) distances[`${colonnes[i].slug}|${colonnes[j].slug}`] = distanceGris(colonnes[i].gris400, colonnes[j].gris400);
    fs.mkdirSync(path.join(ROOT, 'captures', 'planches'), { recursive: true });
    film = path.join('captures', 'planches', `${slugs[0]}-pistes.jpg`);
    await assembler(colonnes, sharp, path.join(ROOT, film));
  }
  const r = comparer(profils, distances, seuil);
  info(`Pistes : ${slugs.join(', ')}`);
  for (const p of profils) info(`  ${p.slug.padEnd(24)} ${p.couleur.direction}/${p.couleur.sombre ? 'sombre' : 'clair'}  ${p.typographie.display}+${p.typographie.body}  ${p.squelette.shell}/${p.squelette.nav}/${p.squelette.hero}  ${p.rythme.nSections} sections  geste:${p.geste.declencheurs.join('+') || '?'}  apparition:${p.apparition.reveals.join(',') || 'sur mesure'}`);
  for (const pr of r.paires) {
    const d = pr.distanceImage == null ? '' : `, image à 400 ms : ${pr.distanceImage.toFixed(3)}${pr.distanceImage < seuil ? ' (même entrée)' : ''}`;
    (pr.echec ? fail : ok)(`${pr.a} / ${pr.b} : ${pr.partages.length ? 'partagent ' + pr.partages.join(', ') : 'aucun axe partagé'}${d}`);
  }
  if (film) info(`Film comparé : ${film} (à regarder : deux colonnes qui se ressemblent à 400 ms = même entrée).`);
  fs.mkdirSync(path.join(ROOT, 'captures'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'captures', `${slugs[0]}-pistes.json`), JSON.stringify({ profils, ...r, seuil, film }, null, 2));
  if (r.echec) { fail('Deux pistes se ressemblent : réinventer la plus faible (SKILL.md § 1bis).'); process.exitCode = 1; }
  else ok('Les pistes sont différentes sur les sept axes.');
}
