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
import { cmdPhotosDemo } from './ff/photos-demo.mjs';
import { cmdApercuRapide } from './ff/apercu-rapide.mjs';
import { cmdVideo } from './ff/video.mjs';
import { cmdSequence } from './ff/sequence.mjs';
import { cmdAnimer } from './ff/animer.mjs';
import { cmdIllustration } from './ff/illustration.mjs';
import { cmdLighthouse } from './ff/lighthouse.mjs';
import { cmdPerf } from './ff/perf.mjs';
import { cmdSante } from './ff/sante.mjs';
import { cmdArchiver } from './ff/archiver.mjs';
import { cmdDetect } from './ff/detect.mjs';
import { cmdVitrine } from './ff/vitrine.mjs';
import { cmdLogo } from './ff/logo.mjs';
import { cmdSequencePhoto } from './ff/sequence-photo.mjs';
import { cmdSignatures } from './ff/signatures.mjs';
import { cmdCouleur } from './ff/couleur.mjs';
import { cmdAuditMotion } from './ff/audit-motion.mjs';
import { cmdNettete } from './ff/nettete.mjs';
import { cmdIndexNow } from './ff/indexnow.mjs';
import { cmdTypo } from './ff/typo.mjs';
import { cmdIa } from './ff/ia.mjs';
import { cmdA11y } from './ff/a11y.mjs';
import { cmdKit } from './ff/kit.mjs';
import { cmdVercel } from './ff/vercel.mjs';
import { cmdTuiles } from './ff/tuiles.mjs';
import { cmdPlanche } from './ff/planche.mjs';
import { cmdApercu } from './ff/apercu.mjs';
import { cmdRelecture } from './ff/relecture.mjs';
import { cmdBrief } from './ff/brief.mjs';
import { cmdAiguillage } from './ff/aiguillage.mjs';
import { cmdPistes } from './ff/pistes.mjs';
import { cmdContrat } from './ff/contrat.mjs';
import { cmdChoisir } from './ff/choisir.mjs';
import { cmdPrevol } from './ff/prevol.mjs';
import { cmdFilm } from './ff/film.mjs';
import { cmdDemonter } from './ff/demonter.mjs';
import { cmdRefonte } from './ff/refonte.mjs';
import { cmdRessemblance } from './ff/ressemblance.mjs';
import { cmdMelanger } from './ff/melanger.mjs';
import { cmdAtomes } from './ff/atomes-mesurer.mjs';
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
  'photos-demo': cmdPhotosDemo,
  video: cmdVideo,
  sequence: cmdSequence,
  animer: cmdAnimer,
  illustration: cmdIllustration,
  lighthouse: cmdLighthouse,
  perf: cmdPerf,
  sante: cmdSante,
  'audit-motion': cmdAuditMotion,
  archiver: cmdArchiver,
  detect: cmdDetect,
  vitrine: cmdVitrine,
  logo: cmdLogo,
  'sequence-photo': cmdSequencePhoto,
  signatures: cmdSignatures,
  couleur: cmdCouleur,
  nettete: cmdNettete,
  indexnow: cmdIndexNow,
  typo: cmdTypo,
  ia: cmdIa,
  a11y: cmdA11y,
  kit: cmdKit,
  vercel: cmdVercel,
  tuiles: cmdTuiles,
  planche: cmdPlanche,
  apercu: cmdApercu,
  'apercu-rapide': cmdApercuRapide,
  relecture: cmdRelecture,
  brief: cmdBrief,
  aiguillage: cmdAiguillage,
  pistes: cmdPistes,
  contrat: cmdContrat,
  choisir: cmdChoisir,
  prevol: cmdPrevol,
  film: cmdFilm,
  demonter: cmdDemonter,
  refonte: cmdRefonte,
  ressemblance: cmdRessemblance,
  melanger: cmdMelanger,
  atomes: cmdAtomes,
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
