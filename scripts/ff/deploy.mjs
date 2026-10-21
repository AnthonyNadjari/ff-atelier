// `ff deploy <slug> [--projet <nom>] [--workers|--pages] [--simuler] [--vercel]` : build, garde « données de test »
// (scripts/ff/garde-donnees.mjs, bloquante hors site de démo), puis déploiement chez Cloudflare :
//  - mode `workers` (défaut d'un site jamais déployé, 22 oct 2026) : Workers static assets, `npx wrangler deploy`
//    avec une config écrite dans .ff-tmp/<slug>/wrangler.json (fichiers, Worker du formulaire, binding EMAIL) ;
//  - mode `pages` (--pages, ou site déjà déployé ainsi) : `npx wrangler pages deploy` (100 projets par compte).
// Le mode retenu est mémorisé dans sites/<slug>/hebergement.json (scripts/ff/hebergement.mjs), lu ensuite par
// `ff domaine` et `ff sante`. `--simuler` : affiche la config et la commande, n'appelle rien (ni build).
// `--vercel` : délègue à `ff vercel` (scripts/ff/vercel.mjs), réservé aux démos.
// Si le site a un domaine (sites/<slug>/domain.txt), enchaîne avec une soumission IndexNow (Bing -> visibilité
// ChatGPT/Copilot), jamais bloquante.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, DIST_DIR, resolveSlug, runAstro, ok, fail, warn, info, c, parseArgs } from './util.mjs';
import { indexNowForSlug, ensureIndexNowKey } from './indexnow.mjs';
import { cmdVercel, garderAvantDeploiement } from './vercel.mjs';
import {
  ASSETS_IGNORE, WRANGLER, lireHebergement, ecrireHebergement, choisirMode, configWrangler, commandeWrangler, urlDansSortie,
} from './hebergement.mjs';

/** Écrit .ff-tmp/<slug>/wrangler.json et dist/<slug>/.assetsignore ; renvoie le chemin de la config (relatif à ROOT). */
export function preparerWorkers({ slug, projet, distDir = path.join(DIST_DIR, slug) }) {
  const avecWorker = fs.existsSync(path.join(distDir, '_worker.js'));
  const dossier = path.join(ROOT, '.ff-tmp', slug);
  fs.mkdirSync(dossier, { recursive: true });
  const cfg = configWrangler({ projet, slug, avecWorker });
  const configPath = path.join(dossier, 'wrangler.json');
  fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2) + '\n');
  // Le Worker n'est pas un fichier à servir ; Vercel non plus (démos).
  if (fs.existsSync(distDir)) fs.writeFileSync(path.join(distDir, '.assetsignore'), ASSETS_IGNORE.join('\n') + '\n');
  return { cfg, configPath: path.relative(ROOT, configPath).split(path.sep).join('/'), avecWorker };
}

function lancerWrangler(argsSansNpx) {
  // Sortie capturée ET réaffichée : on y lit l'URL déployée (hebergement.json), wrangler reste lisible.
  const r = spawnSync('npx', ['-y', ...argsSansNpx], { cwd: ROOT, stdio: ['inherit', 'pipe', 'pipe'], shell: true, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  const sortie = `${r.stdout || ''}${r.stderr || ''}`;
  process.stdout.write(sortie);
  return { status: r.status, sortie };
}

export async function cmdDeploy(args) {
  const { positional, flags } = parseArgs(args);
  if (flags.vercel) return cmdVercel(args.filter((a) => a !== '--vercel'));
  const slug = resolveSlug(positional[0]);
  const projet = typeof flags.projet === 'string' ? flags.projet : slug;
  const existant = lireHebergement(slug);
  let mode;
  try {
    mode = choisirMode({ flags, existant });
  } catch (e) {
    fail(e.message);
    process.exit(1);
  }
  if (existant && existant.mode !== mode) warn(`Ce site était déployé en mode ${existant.mode} (${existant.url || 'URL inconnue'}) : il part maintenant en ${mode}. L'ancien déploiement reste en place, pense à le supprimer dans le dashboard.`);
  const simuler = Boolean(flags.simuler);

  if (simuler) {
    info(c.bold(`Simulation — ff deploy ${slug} (mode ${mode}${existant ? ', déjà déployé le ' + existant.date : ', premier déploiement'})`));
    info('Aucun build, aucun appel : voici ce qui serait fait.');
    if (mode === 'workers') {
      const { cfg, configPath, avecWorker } = preparerWorkers({ slug, projet });
      info(`  config : ${configPath}${avecWorker ? ' (Worker du formulaire + binding EMAIL)' : ' (site statique pur, aucun Worker)'}`);
      info('  ' + JSON.stringify(cfg));
      info(`  commande : npx -y ${commandeWrangler({ mode, projet, slug, configPath }).join(' ')}`);
    } else {
      info(`  commande : npx -y ${commandeWrangler({ mode, projet, slug }).join(' ')}`);
    }
    info(`  puis : sites/${slug}/hebergement.json { mode: "${mode}", projet: "${projet}" }`);
    return;
  }

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

  // Jeton API dans l'environnement (CI, .env) : wrangler l'utilise sans `wrangler login`.
  const whoami = spawnSync('npx', ['-y', WRANGLER, 'whoami'], { cwd: ROOT, stdio: 'pipe', shell: true, encoding: 'utf8' });
  if (whoami.status !== 0 || /not authenticated|You are not logged in/i.test(`${whoami.stdout}${whoami.stderr}`)) {
    fail('Non connecte a Cloudflare.');
    info('');
    info(c.bold('Avant de deployer, connecte-toi une fois :'));
    info(`  ${c.cyan(`npx -y ${WRANGLER} login`)}`);
    info("Une page s'ouvre dans le navigateur pour autoriser l'acces (ou pose CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID dans .env). Relance ensuite `ff deploy`.");
    process.exit(1);
  }

  let sortie = '';
  if (mode === 'workers') {
    const { configPath, avecWorker } = preparerWorkers({ slug, projet });
    info(`Deploiement de dist/${slug} en Worker "${projet}" (fichiers statiques${avecWorker ? ' + formulaire, binding EMAIL' : ''})...`);
    const r = lancerWrangler(commandeWrangler({ mode, projet, slug, configPath }));
    sortie = r.sortie;
    if (r.status !== 0) {
      fail('Le deploiement a echoue.');
      process.exit(r.status ?? 1);
    }
  } else {
    info(`Deploiement de dist/${slug} sur le projet Cloudflare Pages "${projet}"...`);
    const r = lancerWrangler(commandeWrangler({ mode, projet, slug }));
    sortie = r.sortie;
    if (r.status !== 0) {
      fail('Le deploiement a echoue.');
      process.exit(r.status ?? 1);
    }
  }

  const url = urlDansSortie(sortie) || existant?.url || (mode === 'pages' ? `https://${projet}.pages.dev` : undefined);
  ecrireHebergement(slug, { mode, projet, url, date: new Date().toISOString().slice(0, 10) });
  info('');
  ok(`Site deploye (${mode}, "${projet}")${url ? ` : ${url}` : ''}. Memorise dans sites/${slug}/hebergement.json.`);
  info('');

  const domainFile = path.join(ROOT, 'sites', slug, 'domain.txt');
  if (!fs.existsSync(domainFile)) {
    info(c.bold('Domaine personnalise :'));
    info(`  Pas encore de domaine pour ce site. Lance : ${c.cyan(`ff domaine ${slug} <domaine> --email-vers <adresse du client>`)}`);
    info('  (domaine + DNS + Email Routing en une commande, voir docs/DEPLOIEMENT.md § "Domaine en une commande".)');
  } else {
    info(c.bold('Domaine personnalise :'));
    info(`  Le domaine canonique du site vient de ${c.cyan(`sites/${slug}/domain.txt`)} (une ligne, sans https).`);
    if (mode === 'workers' && existant?.mode !== 'workers') info(`  Premier deploiement Workers avec un domaine : relance ${c.cyan(`ff domaine ${slug} ${fs.readFileSync(domainFile, 'utf8').trim()}`)} pour l'attacher au Worker.`);

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
