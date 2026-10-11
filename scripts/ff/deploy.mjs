// `ff deploy <slug> [--projet <nom>] [--vercel]` : build, garde « données de test »
// (scripts/ff/garde-donnees.mjs, bloquante hors site de démo), puis `npx wrangler pages deploy`.
// `--vercel` : délègue à `ff vercel` (scripts/ff/vercel.mjs).
// Si le site a un domaine (sites/<slug>/domain.txt), enchaîne avec une soumission IndexNow
// (Bing -> visibilité ChatGPT/Copilot) — jamais bloquante.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, resolveSlug, runAstro, ok, fail, warn, info, c, parseArgs } from './util.mjs';
import { indexNowForSlug, ensureIndexNowKey } from './indexnow.mjs';
import { cmdVercel, garderAvantDeploiement } from './vercel.mjs';

export async function cmdDeploy(args) {
  const { positional, flags } = parseArgs(args);
  if (flags.vercel) return cmdVercel(args.filter((a) => a !== '--vercel'));
  const slug = resolveSlug(positional[0]);
  const projet = flags.projet || slug;

  // Clé IndexNow créée AVANT le build quand le site a un domaine : le fichier de vérification
  // doit être dans dist/ pour que Bing accepte la soumission faite après le déploiement.
  const aUnDomaine = fs.existsSync(path.join(ROOT, 'sites', slug, 'domain.txt'));
  if (aUnDomaine) {
    const { key, created } = ensureIndexNowKey(slug);
    if (created) ok(`Clé IndexNow créée : sites/${slug}/public/indexnow-${key}.txt (vérifiée par Bing à la racine du domaine).`);
  }

  info(`Construction de ${slug}...`);
  const buildStatus = runAstro('build', slug);
  if (buildStatus !== 0) {
    fail('Le build a echoue — deploiement annule.');
    process.exit(1);
  }
  ok('Build reussi.');
  info('');

  if (!garderAvantDeploiement(slug)) process.exit(1);

  const whoami = spawnSync('npx', ['wrangler', 'whoami'], { cwd: ROOT, stdio: 'pipe', shell: true });
  if (whoami.status !== 0) {
    fail('Non connecte a Cloudflare.');
    info('');
    info(c.bold('Avant de deployer, connecte-toi une fois :'));
    info(`  ${c.cyan('npx wrangler login')}`);
    info("Une page s'ouvre dans le navigateur pour autoriser l'acces. Relance ensuite `ff deploy` une fois connecte.");
    process.exit(1);
  }

  info(`Deploiement de dist/${slug} sur le projet Cloudflare Pages "${projet}"...`);
  const deployRes = spawnSync(
    'npx',
    ['wrangler', 'pages', 'deploy', `dist/${slug}`, '--project-name', projet, '--branch', 'main'],
    { cwd: ROOT, stdio: 'inherit', shell: true },
  );
  if (deployRes.status !== 0) {
    fail('Le deploiement a echoue.');
    process.exit(deployRes.status ?? 1);
  }

  info('');
  ok(`Site deploye : projet Cloudflare Pages "${projet}".`);
  info('');

  const domainFile = path.join(ROOT, 'sites', slug, 'domain.txt');
  if (!fs.existsSync(domainFile)) {
    info(c.bold('Domaine personnalise :'));
    info(`  Pas encore de domaine pour ce site. Lance : ${c.cyan(`ff domaine ${slug} <domaine>`)}`);
    info('  (Pages + DNS + Email Routing en une commande, voir docs/DEPLOIEMENT.md § "Domaine en une commande".)');
  } else {
    info(c.bold('Domaine personnalise :'));
    info('  Cloudflare dashboard -> Pages -> ton projet -> Custom domains -> Set up a custom domain.');
    info(`  Le domaine canonique du site vient de ${c.cyan(`sites/${slug}/domain.txt`)} (une ligne, sans https).`);
    info(`  Cree/modifie ce fichier puis relance \`ff build ${slug}\` pour que le sitemap et les balises canonical le refletent.`);

    // IndexNow : le domaine existe, on notifie Bing (visibilité ChatGPT Search / Copilot).
    info('');
    const result = await indexNowForSlug(slug);
    if (result.skipped) {
      warn(`IndexNow ignoré : ${result.skipped}.`);
    } else if (result.ok) {
      ok(`IndexNow : ${result.detail} (${result.host}) — Bing, donc ChatGPT Search et Copilot, apprennent le site tout de suite.`);
    } else {
      warn(`IndexNow : ${result.detail} — non bloquant, relance \`ff indexnow ${slug}\` plus tard.`);
    }
  }
}
