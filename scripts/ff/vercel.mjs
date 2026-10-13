// `ff vercel <slug> [--simuler] [--sans-build]` (alias `ff deploy <slug> --vercel`) : build, garde
// « données de test » (scripts/ff/garde-donnees.mjs, bloquante hors site de démo), puis dans dist/<slug> :
// `_headers` (format Cloudflare Pages, écrit par l'intégration ff-headers d'astro.config.mjs) converti en
// `vercel.json`, + sites/<slug>/redirects.json s'il existe, `.vercelignore`, et `npx -y vercel deploy
// --prod --yes` avec VERCEL_ORG_ID / VERCEL_PROJECT_ID.
//
// `cleanUrls: true` est OBLIGATOIRE : le build est en `format: 'file'` (audit.html, mentions-legales.html)
// et sans cleanUrls Vercel répond 404 sur /audit et /mentions-legales (Cloudflare Pages le fait seul).
//
// Identifiants : variables d'environnement (ou .env) VERCEL_ORG_ID + VERCEL_PROJECT_ID, sinon
// sites/<slug>/vercel-projet.json `{ "orgId": "...", "projectId": "..." }` (mêmes clés que le
// .vercel/project.json écrit par `vercel link`). Jamais d'identifiant en dur dans le code.
//
// Rappel (studio/decisions/hebergement-livraison.md) : Vercel Hobby interdit l'usage commercial ;
// l'hébergement des sites clients reste Cloudflare Pages (`ff deploy`).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { DIST_DIR, SITES_DIR, resolveSlug, runAstro, ok, fail, warn, info, c, parseArgs, envKey } from './util.mjs';
import { parseHeadersFile } from './headers-file.mjs';
import { garderDonneesTest } from './garde-donnees.mjs';

/** Motif `_headers` (`/*`, `/_astro/*`, `/*.html`) -> source Vercel (`*` -> `:path*`). */
export function motifVersSourceVercel(motif) {
  return motif.replace(/\*/g, ':path*');
}

/**
 * Pur : texte `_headers` + redirections (tableau au format Vercel, ou objet `{ redirects: [...] }` tel
 * que sites/<slug>/redirects.json) -> objet vercel.json.
 */
export function headersVersVercel(headersText, redirects = []) {
  const liste = Array.isArray(redirects) ? redirects : (redirects?.redirects ?? []);
  const config = {
    cleanUrls: true,
    headers: parseHeadersFile(headersText || '')
      .filter((r) => r.headers.length > 0)
      .map((r) => ({ source: motifVersSourceVercel(r.pattern), headers: r.headers.map(([key, value]) => ({ key, value })) })),
  };
  if (liste.length) config.redirects = liste;
  return config;
}

export const VERCELIGNORE = '_headers\n.env\n.env.*\n';

/** Identifiants Vercel : env d'abord (paire complète), sinon sites/<slug>/vercel-projet.json. */
export function lireIdsVercel(slug, { env = (k) => envKey(k), sitesDir = SITES_DIR } = {}) {
  const orgId = env('VERCEL_ORG_ID');
  const projectId = env('VERCEL_PROJECT_ID');
  if (orgId && projectId) return { orgId, projectId, source: 'environnement' };
  const p = path.join(sitesDir, slug, 'vercel-projet.json');
  if (fs.existsSync(p)) {
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (j.orgId && j.projectId) return { orgId: j.orgId, projectId: j.projectId, source: `sites/${slug}/vercel-projet.json` };
  }
  return null;
}

/** Écrit vercel.json + .vercelignore dans distDir ; renvoie l'objet écrit. */
export function ecrireConfigVercel(distDir, slug, sitesDir = SITES_DIR) {
  const hp = path.join(distDir, '_headers');
  const headersText = fs.existsSync(hp) ? fs.readFileSync(hp, 'utf8') : '';
  const rp = path.join(sitesDir, slug, 'redirects.json');
  const redirects = fs.existsSync(rp) ? JSON.parse(fs.readFileSync(rp, 'utf8')) : [];
  const config = headersVersVercel(headersText, redirects);
  fs.writeFileSync(path.join(distDir, 'vercel.json'), JSON.stringify(config, null, 2) + '\n');
  fs.writeFileSync(path.join(distDir, '.vercelignore'), VERCELIGNORE);
  return config;
}

/** Garde données de test, imprimée ; renvoie false si elle bloque. Partagée avec `ff deploy`. */
export function garderAvantDeploiement(slug) {
  const r = garderDonneesTest({ slug, distDir: path.join(DIST_DIR, slug), sitesDir: SITES_DIR });
  info(c.bold(`Données de test${r.demo ? ' (site de démonstration)' : ''} :`));
  for (const x of r.checks) (x.pass ? ok : fail)(x.label);
  for (const w of r.warnings) warn(w);
  info('');
  if (!r.ok) fail('Données de test ou mentions légales vides : déploiement annulé (rien n’est inventé, il faut les vraies données).');
  return r.ok;
}

export async function cmdVercel(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const distDir = path.join(DIST_DIR, slug);

  if (!flags['sans-build']) {
    info(`Construction de ${slug}...`);
    if (runAstro('build', slug) !== 0) { fail('Le build a échoué — déploiement annulé.'); process.exit(1); }
    ok('Build réussi.');
    info('');
  } else if (!fs.existsSync(distDir)) {
    fail(`dist/${slug} absent : lance \`ff build ${slug}\` ou retire --sans-build.`);
    process.exit(1);
  }

  if (!garderAvantDeploiement(slug)) process.exit(1);

  const config = ecrireConfigVercel(distDir, slug);
  ok(`dist/${slug}/vercel.json écrit (cleanUrls, ${config.headers.length} règles d'en-têtes, ${config.redirects?.length ?? 0} redirection(s)) + .vercelignore.`);

  const ids = lireIdsVercel(slug);
  if (flags.simuler) {
    info('');
    info(c.bold('--simuler : rien n’est envoyé.'));
    info(`  Identifiants : ${ids ? `trouvés (${ids.source})` : c.yellow('absents (VERCEL_ORG_ID + VERCEL_PROJECT_ID, ou sites/<slug>/vercel-projet.json)')}`);
    info(`  Commande prévue (dans dist/${slug}) : npx -y vercel deploy --prod --yes`);
    return;
  }
  if (!ids) {
    fail('Identifiants Vercel absents.');
    info('  Mets VERCEL_ORG_ID et VERCEL_PROJECT_ID dans .env, ou crée');
    info(`  sites/${slug}/vercel-projet.json : { "orgId": "team_…", "projectId": "prj_…" } (voir docs/DEPLOIEMENT.md § Vercel).`);
    process.exit(1);
  }
  warn('Rappel : Vercel Hobby interdit l’usage commercial (studio/decisions/hebergement-livraison.md) ; les sites clients vont sur Cloudflare (`ff deploy`).');
  info(`Déploiement de dist/${slug} sur Vercel (identifiants : ${ids.source})...`);
  const res = spawnSync('npx', ['-y', 'vercel', 'deploy', '--prod', '--yes'], {
    cwd: distDir,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, VERCEL_ORG_ID: ids.orgId, VERCEL_PROJECT_ID: ids.projectId },
  });
  if (res.status !== 0) { fail('Le déploiement Vercel a échoué.'); process.exit(res.status ?? 1); }
  info('');
  ok('Site déployé sur Vercel. Vérifie iOS sur l’URL https déployée (pas en local : CSP upgrade-insecure-requests + HSTS).');
}
