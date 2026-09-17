#!/usr/bin/env node
// CLI de l'atelier Finck & Fisch. Voir `node scripts/ff.mjs aide`.
// Usage : node scripts/ff.mjs <commande> [arguments]   |   npm run ff -- <commande> [arguments]
import { cmdNouveau } from './ff/nouveau.mjs';
import { cmdDev, cmdBuild, cmdPreview } from './ff/dev-build-preview.mjs';
import { cmdTous } from './ff/tous.mjs';
import { cmdVerifier } from './ff/verifier.mjs';
import { cmdImages } from './ff/images.mjs';
import { cmdNettoyerPhotos } from './ff/nettoyer-photos.mjs';
import { cmdVariete } from './ff/variete.mjs';
import { cmdExporter } from './ff/exporter.mjs';
import { cmdDeploy } from './ff/deploy.mjs';
import { cmdDomaine } from './ff/domaine.mjs';
import { cmdListe } from './ff/liste.mjs';
import { cmdAide } from './ff/aide.mjs';
import { cmdFiger } from './ff/figer.mjs';
import { cmdComposer } from './ff/composer.mjs';
import { cmdPropositions } from './ff/propositions.mjs';
import { cmdOg } from './ff/og.mjs';
import { cmdMatrice } from './ff/matrice.mjs';
import { cmdVignettes } from './ff/vignettes.mjs';
import { cmdModele, cmdModeles } from './ff/modele.mjs';
import { cmdPhotos } from './ff/photos.mjs';
import { cmdVideo } from './ff/video.mjs';
import { cmdSequence } from './ff/sequence.mjs';
import { cmdAnimer } from './ff/animer.mjs';
import { cmdIllustration } from './ff/illustration.mjs';
import { cmdLighthouse } from './ff/lighthouse.mjs';
import { cmdPerf } from './ff/perf.mjs';
import { cmdSante } from './ff/sante.mjs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const SCRIPTS = dirname(fileURLToPath(import.meta.url));
const runScript = (file) => (args) => { const r = spawnSync(process.execPath, [join(SCRIPTS, file), ...args], { stdio: 'inherit', cwd: dirname(SCRIPTS) }); process.exit(r.status ?? 1); };
import { fail } from './ff/util.mjs';

const [, , cmd, ...rest] = process.argv;

const commands = {
  nouveau: cmdNouveau,
  dev: cmdDev,
  build: cmdBuild,
  preview: cmdPreview,
  tous: cmdTous,
  verifier: cmdVerifier,
  check: cmdVerifier,
  images: cmdImages,
  'nettoyer-photos': cmdNettoyerPhotos,
  variete: cmdVariete,
  exporter: cmdExporter,
  deploy: cmdDeploy,
  domaine: cmdDomaine,
  liste: cmdListe,
  aide: cmdAide,
  captures: runScript('captures.mjs'),
  servir: runScript('serve-all.mjs'),
  generer: runScript('ff-generer.mjs'),
  placeholders: runScript('placeholders.mjs'),
  studio: runScript('studio.mjs'),
  figer: cmdFiger,
  composer: cmdComposer,
  propositions: cmdPropositions,
  og: cmdOg,
  matrice: cmdMatrice,
  vignettes: cmdVignettes,
  modele: cmdModele,
  modeles: cmdModeles,
  photos: cmdPhotos,
  video: cmdVideo,
  sequence: cmdSequence,
  animer: cmdAnimer,
  illustration: cmdIllustration,
  lighthouse: cmdLighthouse,
  perf: cmdPerf,
  sante: cmdSante,
};

async function main() {
  if (!cmd || cmd === 'aide' || cmd === 'help' || cmd === '-h' || cmd === '--help') {
    cmdAide();
    return;
  }
  const fn = commands[cmd];
  if (!fn) {
    fail(`Commande inconnue : "${cmd}".`);
    cmdAide();
    process.exit(1);
  }
  await fn(rest);
}

main();
