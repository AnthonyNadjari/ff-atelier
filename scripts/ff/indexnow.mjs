// IndexNow (scripts/ff/indexnow.mjs) : notification instantanée des URLs du site à Bing (et aux
// moteurs participants — Yandex, Naver, Seznam partagent les soumissions). ChatGPT Search et
// Copilot puisent dans l'index Bing : être indexé vite, c'est être cité plus tôt par les
// réponses IA. Appelé par `ff deploy` quand le site a un domaine, ou directement :
// `ff indexnow <slug> [--simuler]`. Module sans dépendance, testé par tests/indexnow.test.mjs.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { SITES_DIR, DIST_DIR, resolveSlug, parseArgs, ok, fail, warn, info, c } from './util.mjs';

const KEY_RE = /^indexnow-([0-9a-f]{32})\.txt$/;

/**
 * Retrouve (ou crée) la clé IndexNow du site : un fichier `indexnow-<cle>.txt` dans
 * sites/<slug>/public/, servi à la racine du domaine — Bing vérifie la clé à cette URL avant
 * d'accepter les soumissions. Le fichier se commit avec le site.
 */
export function ensureIndexNowKey(slug) {
  const publicDir = path.join(SITES_DIR, slug, 'public');
  if (fs.existsSync(publicDir)) {
    for (const name of fs.readdirSync(publicDir)) {
      const m = name.match(KEY_RE);
      if (m) return { key: m[1], file: name, created: false };
    }
  }
  const key = crypto.randomBytes(16).toString('hex');
  fs.mkdirSync(publicDir, { recursive: true });
  const file = `indexnow-${key}.txt`;
  fs.writeFileSync(path.join(publicDir, file), `${key}\n`);
  return { key, file, created: true };
}

/**
 * Extrait les URLs du sitemap buildé (dist/<slug>/sitemap-index.xml -> sitemap-*.xml).
 * Renvoie une liste dédupliquée de <loc>.
 */
export function sitemapUrls(distDir) {
  const dist = distDir ?? '';
  const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');
  const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

  const indexXml = read(path.join(dist, 'sitemap-index.xml'));
  if (!indexXml) return [];
  const urls = [];
  // Les enfants sont les <loc> pointant vers d'autres sitemaps (.xml) ; si l'index contient
  // directement des pages (pas d'enfant .xml), on retombe sur ses propres <loc>.
  const children = locs(indexXml).filter((u) => u.endsWith('.xml'));
  for (const child of children) {
    const childFile = path.join(dist, child.replace(/^https?:\/\/[^/]+\//, ''));
    urls.push(...locs(read(childFile)));
  }
  if (urls.length === 0) urls.push(...locs(indexXml));
  return [...new Set(urls)];
}

/**
 * Soumet les URLs à api.indexnow.org. Avec simuler=true, n'envoie rien et décrit l'appel.
 * Renvoie { ok, status?, detail } — ne lance jamais (le déploiement ne doit pas échouer pour ça).
 */
export async function submitIndexNow({ host, key, urls, simuler = false }) {
  const keyLocation = `https://${host}/indexnow-${key}.txt`;
  const body = { host, key, keyLocation, urlList: urls };
  if (simuler) return { ok: true, detail: `POST https://api.indexnow.org/indexnow — ${urls.length} URL(s), clé ${keyLocation}` };
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    // 200/202 = accepté ; 422 = clé non encore vérifiable (fraîchement déployée) — à retenter.
    return res.ok
      ? { ok: true, status: res.status, detail: `${urls.length} URL(s) soumise(s)` }
      : { ok: false, status: res.status, detail: `api.indexnow.org a répondu ${res.status}` };
  } catch (err) {
    return { ok: false, detail: `IndexNow injoignable : ${err.message}` };
  }
}

/**
 * Enchaînement complet pour un slug : clé + domaine + URLs du build. Renvoie null avec une
 * raison si IndexNow ne s'applique pas (pas de domaine, pas de build, sitemap vide).
 */
export async function indexNowForSlug(slug, { simuler = false, distDir } = {}) {
  const domainFile = path.join(SITES_DIR, slug, 'domain.txt');
  if (!fs.existsSync(domainFile)) return { skipped: "pas de domaine (sites/<slug>/domain.txt absent)" };
  const host = fs.readFileSync(domainFile, 'utf8').trim();
  if (!host) return { skipped: 'domain.txt vide' };

  const dist = distDir ?? path.join(DIST_DIR, slug);
  const urls = sitemapUrls(dist);
  if (urls.length === 0) return { skipped: 'sitemap introuvable ou vide — lance `ff build` avant' };

  const { key, created } = ensureIndexNowKey(slug);
  const result = await submitIndexNow({ host, key, urls, simuler });
  return { host, key, keyCreated: created, count: urls.length, ...result };
}

/** `ff indexnow <slug> [--simuler]` : soumet les URLs du site à IndexNow (Bing -> ChatGPT/Copilot). */
export async function cmdIndexNow(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const simuler = Boolean(flags.simuler);

  const result = await indexNowForSlug(slug, { simuler });
  if (result.skipped) {
    warn(`IndexNow ignoré : ${result.skipped}.`);
    return;
  }
  if (result.keyCreated) ok(`Clé IndexNow créée : sites/${slug}/public/indexnow-${result.key}.txt (servie à la racine du domaine).`);
  if (result.ok) {
    ok(`IndexNow (${result.host}) : ${result.detail}.`);
    info(c.dim('  Bing répercute sur Yandex/Naver/Seznam ; ChatGPT Search et Copilot puisent dans l\'index Bing.'));
  } else {
    warn(`IndexNow (${result.host}) : ${result.detail}.`);
    if (result.status === 422) info(c.dim('  422 = clé pas encore vérifiable (fichier fraîchement déployé) — relance `ff indexnow` dans quelques minutes.'));
  }
}
