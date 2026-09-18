// `ff archiver <slug>` : sauvegarde ponctuelle hors depot d'un site — zippe sites/<slug> (contenu,
// photos, look) + dist/<slug> (dernier build, si present) dans archives/<slug>-<date>.zip. Complement
// de `ff exporter` (qui prepare une remise CLIENT, avec README/commit git) : `ff archiver` est plus
// simple et plus frequent, pense pour une sauvegarde locale avant une manipulation risquee (edition
// en masse, mise a jour de dependance) ou un point de sortie rapide sans toucher a git.
// Windows : PowerShell Compress-Archive (deja present sur tout poste Windows). Linux/macOS : commande
// `zip` (souvent deja installee ; sinon message clair + dossier pret a compresser a la main).
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { ROOT, resolveSlug, ok, fail, warn, info, c, parseArgs } from './util.mjs';

function dateStr() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Compresse le CONTENU de stagingDir (pas le dossier lui-meme) dans zipPath. Renvoie true si reussi. */
function zipStagingDir(stagingDir, zipPath) {
  if (process.platform === 'win32') {
    const r = spawnSync('powershell.exe', [
      '-NoProfile', '-NonInteractive', '-Command',
      `Compress-Archive -Path (Join-Path '${stagingDir}' '*') -DestinationPath '${zipPath}' -Force`,
    ], { stdio: 'inherit' });
    return r.status === 0;
  }
  const hasZip = spawnSync('sh', ['-c', 'command -v zip']).status === 0;
  if (!hasZip) return false;
  const r = spawnSync('sh', ['-c', `cd "${stagingDir}" && zip -rq "${zipPath}" .`], { stdio: 'inherit' });
  return r.status === 0;
}

export function cmdArchiver(args) {
  const { positional } = parseArgs(args);
  const slug = resolveSlug(positional[0]);

  const archivesDir = path.join(ROOT, 'archives');
  fs.mkdirSync(archivesDir, { recursive: true });
  const zipPath = path.join(archivesDir, `${slug}-${dateStr()}.zip`);

  const stagingDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ff-archiver-'));
  const included = [];

  const sitesSrc = path.join(ROOT, 'sites', slug);
  const distSrc = path.join(ROOT, 'dist', slug);
  if (fs.existsSync(sitesSrc)) {
    fs.cpSync(sitesSrc, path.join(stagingDir, 'sites', slug), { recursive: true });
    included.push(`sites/${slug}`);
  }
  if (fs.existsSync(distSrc)) {
    fs.cpSync(distSrc, path.join(stagingDir, 'dist', slug), { recursive: true });
    included.push(`dist/${slug}`);
  } else {
    warn(`dist/${slug} absent (site non construit) : archive sans le build. \`ff build ${slug}\` d'abord si tu veux l'inclure.`);
  }

  if (!included.length) {
    fail(`Rien a archiver : ni sites/${slug} ni dist/${slug} n'existent.`);
    fs.rmSync(stagingDir, { recursive: true, force: true });
    process.exit(1);
  }

  const created = zipStagingDir(stagingDir, zipPath);
  if (!created) {
    fail(
      "Aucun outil de compression trouve : PowerShell Compress-Archive a echoue (ou pas Windows) et la commande " +
        "`zip` est introuvable. Installe `zip` (`apt install zip` / `brew install zip` / paquet equivalent) puis " +
        're-lance `ff archiver ' + slug + '`.',
    );
    info(`Dossier pret a compresser toi-meme (${included.join(', ')}) : ${c.cyan(stagingDir)}`);
    process.exit(1);
  }

  fs.rmSync(stagingDir, { recursive: true, force: true });
  ok(`Archive creee : ${c.cyan(path.relative(ROOT, zipPath))} (${included.join(', ')})`);
}
