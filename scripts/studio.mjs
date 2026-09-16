#!/usr/bin/env node
// `ff studio <slug>` : editeur visuel local du LOOK d'un site, avec previsualisation live.
// Lance `astro dev` sur 4321 + un petit serveur HTTP (sans dependance) sur 4400 qui sert
// scripts/studio/index.html et une API JSON qui lit/ecrit sites/<slug>/look.json.
import { createServer } from 'node:http';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SITES_DIR, resolveSlug, writeFFCurrent, ok, fail, warn, info, c } from './ff/util.mjs';
import { extractTopLevelValue } from './ff/ts-literal.mjs';
import { figerSite, LOOK_KEYS } from './ff/figer.mjs';
import { listPresets, readPreset, VIGNETTES_DIR } from './ff/modele.mjs';

const HTTP_PORT = 4400;
const ASTRO_PORT = 4321;

const slug = resolveSlug(process.argv[2]);
writeFFCurrent(slug);

const SITE_DIR = path.join(SITES_DIR, slug);
const CONFIG_PATH = path.join(SITE_DIR, 'site.config.ts');
const LOOK_PATH = path.join(SITE_DIR, 'look.json');
const SCHEMA_PATH = path.join(ROOT, 'src', 'lib', 'schema.ts');
const FONTS_PATH = path.join(ROOT, 'src', 'lib', 'fonts.ts');
const DIRECTIONS_DIR = path.join(ROOT, 'src', 'directions');
const COMPOSER_PATH = path.join(ROOT, 'scripts', 'ff', 'composer.mjs');
const UI_PATH = path.join(ROOT, 'scripts', 'studio', 'index.html');

// Valeurs par defaut du schema (src/lib/schema.ts .default(...)), dupliquees ici car on ne peut
// pas importer un module TypeScript depuis ce script Node pur. A garder synchronise si le schema
// change ces defauts.
const SCHEMA_DEFAULTS = {
  motion: 'subtle',
  scale: 'normal',
  typography: {},
  layout: {
    nav: 'bar',
    hero: 'split',
    sections: [
      { type: 'services', variant: 'grid' },
      { type: 'about', variant: 'portrait' },
      { type: 'proof', variant: 'google' },
      { type: 'zones', variant: 'list' },
      { type: 'faq', variant: 'accordion' },
      { type: 'cta', variant: 'band' },
      { type: 'contact', variant: 'form-split' },
    ],
    footer: 'columns',
    divider: 'none',
    tone: 'flat',
  },
  wording: {
    devis: 'Demander un devis',
    ctaTitle: 'Un projet, une urgence&nbsp;? <em>Parlons-en.</em>',
    contactTitle: 'Parlons de votre projet',
    contactText: 'Décrivez votre besoin, nous vous rappelons rapidement.',
  },
};

// ---------------------------------------------------------------------------
// Parsing des sources (regex uniquement, jamais d'import TS).
// ---------------------------------------------------------------------------

function extractArrayConst(text, name) {
  const m = text.match(new RegExp(`export const ${name} = \\[([\\s\\S]*?)\\] as const;`));
  if (!m) return [];
  return [...m[1].matchAll(/'([^']*)'/g)].map((x) => x[1]);
}

function extractVariants(text) {
  const m = text.match(/export const VARIANTS = (\{[\s\S]*?\}) as const;/);
  if (!m) return {};
  const body = m[1];
  const out = {};
  const keyRe = /(\w+):\s*\[([^\]]*)\]/g;
  let km;
  while ((km = keyRe.exec(body))) {
    out[km[1]] = [...km[2].matchAll(/'([^']*)'/g)].map((x) => x[1]);
  }
  return out;
}

function readMeta() {
  const schemaText = fs.readFileSync(SCHEMA_PATH, 'utf8');
  const dirKeys = extractArrayConst(schemaText, 'DIRECTIONS');
  const motion = extractArrayConst(schemaText, 'MOTION');
  const scales = extractArrayConst(schemaText, 'SCALES');
  const dividers = extractArrayConst(schemaText, 'DIVIDERS');
  const tones = extractArrayConst(schemaText, 'TONES');
  const variants = extractVariants(schemaText);

  const directions = dirKeys.map((key) => {
    const metaPath = path.join(DIRECTIONS_DIR, key, 'meta.ts');
    let nom = key;
    let ambiance = '';
    let metiers = [];
    if (fs.existsSync(metaPath)) {
      const t = fs.readFileSync(metaPath, 'utf8');
      nom = (t.match(/nom:\s*'([^']*)'/) || [, key])[1];
      ambiance = (t.match(/ambiance:\s*'([^']*)'/) || [, ''])[1];
      const mm = t.match(/metiers:\s*\[([^\]]*)\]/);
      metiers = mm ? [...mm[1].matchAll(/'([^']*)'/g)].map((x) => x[1]) : [];
    }
    return { key, nom, ambiance, metiers };
  });

  const fontsText = fs.readFileSync(FONTS_PATH, 'utf8');
  const fontRe = /(\w+):\s*\{\s*family:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?role:\s*'([^']*)'\s*,\s*mood:\s*'([^']*)'\s*\}/g;
  const fonts = [];
  let fm;
  while ((fm = fontRe.exec(fontsText))) {
    fonts.push({ key: fm[1], family: fm[2], role: fm[3], mood: fm[4] });
  }

  return { directions, fonts, variants, motion, scales, dividers, tones, composerAvailable: fs.existsSync(COMPOSER_PATH) };
}

/** Valeurs de base (site.config.ts fusionne avec les defauts du schema), best-effort. */
function readBase() {
  if (!fs.existsSync(CONFIG_PATH)) return null;
  const text = fs.readFileSync(CONFIG_PATH, 'utf8');
  const direction = extractTopLevelValue(text, 'direction');
  const motion = extractTopLevelValue(text, 'motion') ?? SCHEMA_DEFAULTS.motion;
  const scale = extractTopLevelValue(text, 'scale') ?? SCHEMA_DEFAULTS.scale;
  const accent = extractTopLevelValue(text, 'accent');
  const typography = { ...SCHEMA_DEFAULTS.typography, ...(extractTopLevelValue(text, 'typography') || {}) };
  const layout = { ...SCHEMA_DEFAULTS.layout, ...(extractTopLevelValue(text, 'layout') || {}) };
  const wording = { ...SCHEMA_DEFAULTS.wording, ...(extractTopLevelValue(text, 'wording') || {}) };
  return { direction, motion, scale, accent, typography, layout, wording };
}

/** Meme logique de fusion que src/lib/site.ts (applyLook), en JS pur. */
function mergeLook(base, look) {
  const merged = { ...base };
  for (const k of LOOK_KEYS) {
    if (!look || look[k] === undefined) continue;
    const cur = merged[k];
    merged[k] =
      cur && typeof cur === 'object' && !Array.isArray(cur) && typeof look[k] === 'object' && !Array.isArray(look[k])
        ? { ...cur, ...look[k] }
        : look[k];
  }
  return merged;
}

function readLook() {
  if (!fs.existsSync(LOOK_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(LOOK_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function writeLook(obj) {
  const filtered = {};
  for (const k of LOOK_KEYS) if (obj[k] !== undefined) filtered[k] = obj[k];
  fs.writeFileSync(LOOK_PATH, JSON.stringify(filtered, null, 2) + '\n');
  return filtered;
}

// ---------------------------------------------------------------------------
// Astro dev (previsualisation) en sous-processus.
// ---------------------------------------------------------------------------

const astroJs = path.join(ROOT, 'node_modules', 'astro', 'astro.js');
const astro = spawn(process.execPath, [astroJs, 'dev', '--port', String(ASTRO_PORT), '--host', '127.0.0.1'], {
  cwd: ROOT,
  env: { ...process.env, SITE: slug },
  stdio: ['ignore', 'pipe', 'pipe'],
});
const pipeLines = (buf) => {
  for (const line of String(buf).split(/\r?\n/)) {
    if (line.length) console.log(`${c.dim('[astro]')} ${line}`);
  }
};
astro.stdout.on('data', pipeLines);
astro.stderr.on('data', pipeLines);
astro.on('error', (e) => fail(`Impossible de lancer astro dev : ${e.message}`));

// ---------------------------------------------------------------------------
// Serveur HTTP studio (UI + API).
// ---------------------------------------------------------------------------

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(data) });
  res.end(data);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 5_000_000) req.destroy();
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://127.0.0.1:${HTTP_PORT}`);
    const p = url.pathname;

    if (req.method === 'GET' && (p === '/' || p === '/index.html')) {
      const html = fs.readFileSync(UI_PATH, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    if (req.method === 'GET' && p === '/api/meta') {
      sendJson(res, 200, readMeta());
      return;
    }

    if (req.method === 'GET' && p === '/api/look') {
      const base = readBase();
      if (!base) {
        sendJson(res, 404, { error: `site.config.ts introuvable pour ${slug}` });
        return;
      }
      const look = readLook();
      sendJson(res, 200, { slug, base, look, effective: mergeLook(base, look), composerAvailable: fs.existsSync(COMPOSER_PATH) });
      return;
    }

    if (req.method === 'POST' && p === '/api/look') {
      const raw = await readBody(req);
      let body;
      try {
        body = JSON.parse(raw || '{}');
      } catch {
        sendJson(res, 400, { error: 'JSON invalide.' });
        return;
      }
      if (!body || typeof body !== 'object' || Array.isArray(body)) {
        sendJson(res, 400, { error: 'Le corps doit etre un objet.' });
        return;
      }
      const unknown = Object.keys(body).filter((k) => !LOOK_KEYS.includes(k));
      const filtered = writeLook(body);
      const base = readBase();
      sendJson(res, 200, { ok: true, saved: filtered, ignored: unknown, effective: base ? mergeLook(base, filtered) : null, savedAt: new Date().toISOString() });
      return;
    }

    if (req.method === 'DELETE' && p === '/api/look') {
      fs.rmSync(LOOK_PATH, { force: true });
      const base = readBase();
      sendJson(res, 200, { ok: true, effective: base });
      return;
    }

    if (req.method === 'POST' && p === '/api/figer') {
      const result = figerSite(slug);
      if (!result.ok) {
        sendJson(res, 400, result);
        return;
      }
      const base = readBase();
      sendJson(res, 200, { ok: true, base, look: {}, effective: base });
      return;
    }

    if (req.method === 'POST' && p === '/api/composer') {
      if (!fs.existsSync(COMPOSER_PATH)) {
        sendJson(res, 404, { ok: false, error: 'scripts/ff/composer.mjs absent : commande "composer" indisponible.' });
        return;
      }
      const graine = String(Math.floor(Math.random() * 1_000_000));
      const ffJs = path.join(ROOT, 'scripts', 'ff.mjs');
      const r = spawnSync(process.execPath, [ffJs, 'composer', slug, '--ecrire', '--graine', graine], {
        cwd: ROOT,
        encoding: 'utf8',
      });
      if (r.status !== 0) {
        sendJson(res, 400, { ok: false, error: `${r.stdout || ''}\n${r.stderr || ''}`.trim() });
        return;
      }
      const base = readBase();
      const look = readLook();
      sendJson(res, 200, { ok: true, base, look, effective: mergeLook(base, look), graine });
      return;
    }

    if (req.method === 'GET' && p === '/api/modeles') {
      sendJson(res, 200, { modeles: listPresets() });
      return;
    }

    if (req.method === 'POST' && p === '/api/modele') {
      const raw = await readBody(req);
      let body;
      try {
        body = JSON.parse(raw || '{}');
      } catch {
        sendJson(res, 400, { error: 'JSON invalide.' });
        return;
      }
      const nom = body && body.nom;
      if (!nom || typeof nom !== 'string') {
        sendJson(res, 400, { error: 'Champ "nom" manquant.' });
        return;
      }
      let preset;
      try {
        preset = readPreset(nom);
      } catch (e) {
        sendJson(res, 400, { error: `presets/${nom}.json illisible : ${e.message}` });
        return;
      }
      if (!preset) {
        sendJson(res, 404, { error: `Modele introuvable : presets/${nom}.json` });
        return;
      }
      if (!preset.look) {
        sendJson(res, 400, { error: `presets/${nom}.json n'a pas de champ "look".` });
        return;
      }
      // Remplacement complet (pas de fusion) : le look.json existant est ecrase par les 7 cles du modele.
      const filtered = writeLook(preset.look);
      const base = readBase();
      sendJson(res, 200, { ok: true, saved: filtered, nom, titre: preset.titre || nom, effective: base ? mergeLook(base, filtered) : null });
      return;
    }

    if (req.method === 'GET' && p.startsWith('/api/vignette/')) {
      const nom = decodeURIComponent(p.slice('/api/vignette/'.length));
      if (!/^[a-zA-Z0-9_-]+$/.test(nom)) {
        sendJson(res, 400, { error: 'Nom de modele invalide.' });
        return;
      }
      const vignettePath = path.join(VIGNETTES_DIR, `${nom}.webp`);
      if (!fs.existsSync(vignettePath)) {
        sendJson(res, 404, { error: 'Vignette introuvable.' });
        return;
      }
      const data = fs.readFileSync(vignettePath);
      res.writeHead(200, { 'Content-Type': 'image/webp', 'Content-Length': data.length, 'Cache-Control': 'no-cache' });
      res.end(data);
      return;
    }

    if (req.method === 'POST' && p === '/api/vignettes') {
      const ffJs = path.join(ROOT, 'scripts', 'ff.mjs');
      const r = spawnSync(process.execPath, [ffJs, 'vignettes'], { cwd: ROOT, encoding: 'utf8' });
      if (r.status !== 0) {
        sendJson(res, 400, { ok: false, error: `${r.stdout || ''}\n${r.stderr || ''}`.trim() });
        return;
      }
      sendJson(res, 200, { ok: true, output: (r.stdout || '').trim() });
      return;
    }

    sendJson(res, 404, { error: 'Route inconnue.' });
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
});

server.listen(HTTP_PORT, '127.0.0.1', () => {
  info('');
  ok(`Studio : ${c.cyan(`http://127.0.0.1:${HTTP_PORT}`)}  (aperçu Astro : ${c.cyan(`http://127.0.0.1:${ASTRO_PORT}`)})`);
  info('');
});
server.on('error', (e) => {
  fail(`Serveur studio : ${e.message}`);
  shutdown(1);
});

// ---------------------------------------------------------------------------
// Arret propre (Ctrl+C) : tue astro dev (taskkill sur Windows) et le serveur HTTP.
// ---------------------------------------------------------------------------

let shuttingDown = false;
function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  info('\nArret du studio...');
  try {
    server.close();
  } catch {}
  if (astro.pid) {
    if (process.platform === 'win32') {
      spawnSync('taskkill', ['/pid', String(astro.pid), '/T', '/F']);
    } else {
      try {
        astro.kill('SIGTERM');
      } catch {}
    }
  }
  process.exit(code);
}
process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
