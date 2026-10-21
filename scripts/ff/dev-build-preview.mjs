// `ff dev|build|preview [slug]` : lance astro avec SITE=<slug>.
// `ff build` ajoute une etape post-build : quand form.provider vaut 'cloudflare' dans
// site.config.ts, le gabarit src/worker/contact.js est copie (placeholders remplaces) vers
// dist/<slug>/_worker.js — mode avance de Cloudflare Pages Functions, voir
// docs/DEPLOIEMENT.md § Formulaire Cloudflare Workers + Email Routing et src/worker/contact.js.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SITES_DIR, DIST_DIR, resolveSlug, runAstro, warn, ok, info } from './util.mjs';
import { hoteParDefaut } from './hebergement.mjs';

function run(astroCmd, args) {
  const slug = resolveSlug(args[0]);
  const status = runAstro(astroCmd, slug);
  process.exit(status);
}

export function cmdDev(args) {
  run('dev', args);
}

/** Lit une valeur 'cle: "..."' simple dans site.config.ts (regex, pas d'import TS, cf. verifier.mjs). */
function readConfigField(src, key) {
  const m = src.match(new RegExp(`\\b${key}\\s*:\\s*(['"\`])((?:\\\\.|(?!\\1).)*)\\1`));
  return m ? m[2] : '';
}

/**
 * Copie src/worker/contact.js vers dist/<slug>/_worker.js quand form.provider: 'cloudflare',
 * avec le destinataire (contact.email), l'adresse d'expedition et le nom affiche remplaces.
 * Sans effet (silencieux) pour tout autre provider.
 */
function copierWorkerCloudflareSiBesoin(slug) {
  const configPath = path.join(SITES_DIR, slug, 'site.config.ts');
  if (!fs.existsSync(configPath)) return;
  const src = fs.readFileSync(configPath, 'utf8');
  if (!/\bprovider\s*:\s*['"]cloudflare['"]/.test(src)) return;

  const destEmail = readConfigField(src, 'email') || 'contact@exemple.fr';
  const businessName = readConfigField(src, 'name') || slug;

  const domainFile = path.join(SITES_DIR, slug, 'domain.txt');
  const domain = fs.existsSync(domainFile) ? fs.readFileSync(domainFile, 'utf8').trim() : hoteParDefaut(slug);
  const fromEmail = `formulaire@${domain}`;

  const workerTemplatePath = path.join(ROOT, 'src', 'worker', 'contact.js');
  if (!fs.existsSync(workerTemplatePath)) {
    warn('form.provider "cloudflare" mais src/worker/contact.js est introuvable : _worker.js non genere.');
    return;
  }
  let worker = fs.readFileSync(workerTemplatePath, 'utf8');
  worker = worker
    .replaceAll('__FF_DEST_EMAIL__', destEmail.replace(/'/g, "\\'"))
    .replaceAll('__FF_FROM_EMAIL__', fromEmail.replace(/'/g, "\\'"))
    .replaceAll('__FF_FROM_NAME__', businessName.replace(/'/g, "\\'"));

  const distDir = path.join(DIST_DIR, slug);
  if (!fs.existsSync(distDir)) {
    warn(`dist/${slug} introuvable : impossible de deposer _worker.js.`);
    return;
  }
  fs.writeFileSync(path.join(distDir, '_worker.js'), worker);
  ok(`_worker.js genere (formulaire Cloudflare -> ${destEmail}, expediteur ${fromEmail}).`);
  info('  Bindings a configurer dans le dashboard Cloudflare Pages : voir docs/DEPLOIEMENT.md § Formulaire Cloudflare Workers + Email Routing.');
}

export function cmdBuild(args) {
  const slug = resolveSlug(args[0]);
  const status = runAstro('build', slug);
  if (status === 0) copierWorkerCloudflareSiBesoin(slug);
  process.exit(status);
}

export function cmdPreview(args) {
  run('preview', args);
}
