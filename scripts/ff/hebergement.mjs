// Où un site est hébergé chez Cloudflare : `sites/<slug>/hebergement.json` { mode, projet, url, date }, écrit par
// `ff deploy` à chaque déploiement réussi et lu par `ff domaine` (quel API brancher le domaine), `ff sante` (quelle
// URL vérifier) et `ff build` (domaine par défaut du formulaire). Deux modes :
//
//  - `workers` (défaut pour un site jamais déployé, 22 oct 2026) : Workers static assets, `npx wrangler deploy`
//    avec une config écrite dans .ff-tmp/<slug>/wrangler.json. Tout se déclare dans la config (dossier des
//    fichiers, Worker du formulaire, binding Email Routing `EMAIL`) : aucun clic dans le dashboard par site, c'est
//    ce qui permet de tenir 100 puis 500 sites (Workers Paid, 5 $/mois pour tout le compte) sans oublier une case.
//    Le domaine se branche par l'API « custom domains » des Workers (DNS et certificat posés par Cloudflare).
//  - `pages` (`ff deploy --pages`, ou un site déjà déployé ainsi) : Cloudflare Pages, `wrangler pages deploy`,
//    100 projets par compte (limite non relevée en routine), binding e-mail à cliquer dans le dashboard.
//
// Sources (consultées le 22 oct 2026) : https://developers.cloudflare.com/workers/static-assets/ (assets,
// .assetsignore, _headers et _redirects, html_handling, not_found_handling),
// https://developers.cloudflare.com/workers/wrangler/configuration/ (send_email, assets, main),
// https://developers.cloudflare.com/api/resources/workers/subresources/domains/ (PUT /accounts/{id}/workers/domains).
//
// Module pur sauf lireHebergement / ecrireHebergement (lecture et écriture d'un seul fichier JSON) : testé par
// tests/hebergement.test.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { SITES_DIR } from './util.mjs';

export const MODES = ['workers', 'pages'];
export const MODE_PAR_DEFAUT = 'workers';
/** Version de wrangler appelée par npx (épinglée en majeure : `npx -y wrangler@4`). */
export const WRANGLER = 'wrangler@4';
/** Date de compatibilité du Worker : figée, à avancer à la main après lecture des changements. */
export const COMPATIBILITY_DATE = '2026-09-01';
/** Fichiers de dist/<slug> que Workers ne doit pas servir comme fichiers statiques (le Worker lui-même). */
export const ASSETS_IGNORE = ['_worker.js', '.assetsignore', 'vercel.json', '.vercelignore'];

export const API_BASE = 'https://api.cloudflare.com/client/v4';

/** Chemin de sites/<slug>/hebergement.json. */
export function fichierHebergement(slug, sitesDir = SITES_DIR) {
  return path.join(sitesDir, slug, 'hebergement.json');
}

/** { mode, projet, url, date } ou null si le site n'a jamais été déployé (ou fichier illisible : on repart de zéro). */
export function lireHebergement(slug, sitesDir = SITES_DIR) {
  const f = fichierHebergement(slug, sitesDir);
  if (!fs.existsSync(f)) return null;
  try {
    const j = JSON.parse(fs.readFileSync(f, 'utf8'));
    return MODES.includes(j.mode) ? j : null;
  } catch {
    return null;
  }
}

export function ecrireHebergement(slug, data, sitesDir = SITES_DIR) {
  const f = fichierHebergement(slug, sitesDir);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, JSON.stringify({ mode: data.mode, projet: data.projet, url: data.url, date: data.date }, null, 2) + '\n');
  return f;
}

/**
 * Mode à utiliser pour ce déploiement : le drapeau (--workers / --pages) gagne, sinon le mode du dernier déploiement
 * (on ne change jamais d'hébergeur sans le demander : un site en Pages y reste), sinon le défaut.
 */
export function choisirMode({ flags = {}, existant = null } = {}) {
  if (flags.workers && flags.pages) throw new Error('--workers et --pages sont exclusifs.');
  if (flags.workers) return 'workers';
  if (flags.pages) return 'pages';
  return existant?.mode ?? MODE_PAR_DEFAUT;
}

/** Hôte par défaut d'un site sans domaine : l'URL du dernier déploiement, sinon <slug>.pages.dev (historique). */
export function hoteParDefaut(slug, existant = lireHebergement(slug)) {
  if (existant?.url) {
    try { return new URL(existant.url).host; } catch { /* URL illisible : repli */ }
  }
  return `${slug}.pages.dev`;
}

/**
 * Config wrangler pour un Worker à fichiers statiques. Les chemins sont relatifs au dossier du fichier de config
 * (.ff-tmp/<slug>/), donc `../../dist/<slug>`. `avecWorker` : dist/<slug>/_worker.js existe (form.provider
 * 'cloudflare'), il devient le `main` et reçoit le binding `send_email` nommé EMAIL que src/worker/contact.js attend.
 * Sans Worker : site statique pur, aucun `main`.
 */
export function configWrangler({ projet, slug, avecWorker = false, distRelatif = `../../dist/${slug}` }) {
  const cfg = {
    name: projet,
    compatibility_date: COMPATIBILITY_DATE,
    assets: {
      directory: distRelatif,
      // /services/x servi depuis x.html, /services/x/ redirigé vers /services/x (astro trailingSlash: 'never').
      html_handling: 'auto-trailing-slash',
      // 404.html servi avec un vrai statut 404 (ff sante le vérifie).
      not_found_handling: '404-page',
    },
    // Rien n'est observé : pas de logs ni de traces envoyés à Cloudflare au-delà du strict fonctionnement.
    observability: { enabled: false },
  };
  if (avecWorker) {
    cfg.main = `${distRelatif}/_worker.js`;
    cfg.assets.binding = 'ASSETS';
    cfg.send_email = [{ name: 'EMAIL' }];
  }
  return cfg;
}

/** Ligne de commande wrangler (sans npx) pour un déploiement, selon le mode. */
export function commandeWrangler({ mode, projet, slug, configPath }) {
  if (mode === 'pages') return [WRANGLER, 'pages', 'deploy', `dist/${slug}`, '--project-name', projet, '--branch', 'main'];
  return [WRANGLER, 'deploy', '--config', configPath];
}

/** URL déployée trouvée dans la sortie de wrangler (workers.dev ou pages.dev), ou null. */
export function urlDansSortie(texte) {
  const m = String(texte || '').match(/https:\/\/[a-z0-9.-]+\.(?:workers|pages)\.dev/i);
  return m ? m[0] : null;
}

// ---- Domaine personnalisé d'un Worker (ff domaine, mode workers) ----

/** Attache un hostname à un Worker : Cloudflare pose lui-même l'enregistrement DNS et le certificat. Idempotent (PUT). */
export function reqAttachWorkerDomain(accountId, { zoneId, hostname, service }) {
  return {
    method: 'PUT',
    url: `${API_BASE}/accounts/${accountId}/workers/domains`,
    body: { zone_id: zoneId, hostname, service, environment: 'production' },
  };
}

export function reqListWorkerDomains(accountId, { zoneId, hostname } = {}) {
  const q = new URLSearchParams();
  if (zoneId) q.set('zone_id', zoneId);
  if (hostname) q.set('hostname', hostname);
  const s = q.toString();
  return { method: 'GET', url: `${API_BASE}/accounts/${accountId}/workers/domains${s ? `?${s}` : ''}` };
}
