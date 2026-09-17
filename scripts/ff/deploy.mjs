// `ff deploy <slug> [--projet <nom>]` : build puis `npx wrangler pages deploy`.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, resolveSlug, runAstro, ok, fail, info, c, parseArgs } from './util.mjs';

export function cmdDeploy(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const projet = flags.projet || slug;

  info(`Construction de ${slug}...`);
  const buildStatus = runAstro('build', slug);
  if (buildStatus !== 0) {
    fail('Le build a echoue — deploiement annule.');
    process.exit(1);
  }
  ok('Build reussi.');
  info('');

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
  }
}
