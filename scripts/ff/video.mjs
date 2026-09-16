// `ff video <slug> "<requete>"` : cherche une video libre de droit sur Pexels, telecharge le fichier
// HD le plus leger, puis (si ffmpeg est present) genere webm VP9 + mp4 H.264 + poster.jpg dans
// public/videos/. Sans ffmpeg, garde le mp4 source et affiche les commandes a lancer a la main.
//
// Usage : ff video <slug> "<requete>" [--source pexels] [--max-mo 2] [--duree 8]
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { SITES_DIR, resolveSlug, parseArgs, envKey, appendCredits, ok, fail, warn, info, c } from './util.mjs';

function failNoKey() {
  fail('Aucune cle API Pexels disponible pour la recherche de video.');
  info('');
  info("Ajoute la cle suivante dans .env (copie .env.example a la racine) :");
  info('  PEXELS_API_KEY=...  (https://www.pexels.com/api/ -> creer un compte, cle fournie immediatement)');
  info('');
  info('Puis relance la commande.');
  process.exit(1);
}

async function chercherVideo(requete) {
  const key = envKey('PEXELS_API_KEY');
  const params = new URLSearchParams({ query: requete, per_page: '10' });
  const url = `https://api.pexels.com/videos/search?${params.toString()}`;
  const res = await fetch(url, { headers: { Authorization: key } });
  if (!res.ok) throw new Error(`Pexels a repondu ${res.status} (${res.statusText}).`);
  const data = await res.json();
  return data.videos || [];
}

/** Choisit le plus petit fichier HD (repli sur SD, puis sur n'importe quel fichier) parmi video_files. */
function choisirFichier(video) {
  const files = video.video_files || [];
  const parQualite = (q) => files.filter((f) => f.quality === q).sort((a, b) => (a.width || 0) - (b.width || 0));
  return parQualite('hd')[0] || parQualite('sd')[0] || files.sort((a, b) => (a.width || 0) - (b.width || 0))[0];
}

async function telecharger(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Telechargement echoue (${res.status}).`);
  return Buffer.from(await res.arrayBuffer());
}

function ffmpegDisponible() {
  try {
    const r = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return r.status === 0;
  } catch {
    return false;
  }
}

function tailleMo(fichier) {
  return fs.existsSync(fichier) ? fs.statSync(fichier).size / (1024 * 1024) : Infinity;
}

/** Tente plusieurs crf croissants jusqu'a tenir sous maxMo (ou epuise les paliers) ; garde la derniere sortie. */
function encoderAvecBudget({ label, buildArgs, crfs, out, maxMo }) {
  for (let i = 0; i < crfs.length; i++) {
    const args = buildArgs(crfs[i]);
    const r = spawnSync('ffmpeg', args, { stdio: 'ignore' });
    if (r.status !== 0) {
      warn(`${label} : ffmpeg a echoue (crf ${crfs[i]}).`);
      continue;
    }
    const mo = tailleMo(out);
    if (mo <= maxMo || i === crfs.length - 1) {
      return mo;
    }
  }
  return tailleMo(out);
}

function afficherCommandesManuelles({ src, outDir, duree }) {
  info('');
  info("ffmpeg n'est pas installe (ou pas dans le PATH). Le fichier source a ete garde. Une fois ffmpeg installe, lance :");
  info('');
  info(c.cyan(`ffmpeg -i "${src}" -t ${duree} -an -c:v libvpx-vp9 -b:v 0 -crf 32 -vf "scale=1280:-2,fps=24" "${path.join(outDir, 'hero.webm')}"`));
  info(c.cyan(`ffmpeg -i "${src}" -t ${duree} -an -c:v libx264 -preset slow -crf 28 -vf "scale=1280:-2,fps=24" -movflags +faststart "${path.join(outDir, 'hero.mp4')}"`));
  info(c.cyan(`ffmpeg -i "${src}" -vframes 1 -q:v 3 "${path.join(outDir, 'poster.jpg')}"`));
}

export async function cmdVideo(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const requete = positional[1];
  if (!requete) {
    fail('Usage : ff video <slug> "<requete>" [--source pexels] [--max-mo 2] [--duree 8]');
    process.exit(1);
  }

  const sourceFlag = flags.source ? String(flags.source) : 'pexels';
  if (sourceFlag !== 'pexels') {
    fail(`--source invalide : "${sourceFlag}". Seul Pexels est supporte pour l'instant.`);
    process.exit(1);
  }
  if (!envKey('PEXELS_API_KEY')) failNoKey();

  const maxMo = flags['max-mo'] !== undefined ? Number(flags['max-mo']) : 2;
  const duree = flags.duree !== undefined ? Number(flags.duree) : 8;
  if (!Number.isFinite(maxMo) || maxMo <= 0) {
    fail('--max-mo doit etre un nombre positif.');
    process.exit(1);
  }
  if (!Number.isFinite(duree) || duree <= 0) {
    fail('--duree doit etre un nombre positif (secondes).');
    process.exit(1);
  }

  let videos;
  try {
    videos = await chercherVideo(requete);
  } catch (e) {
    fail(`Recherche Pexels echouee : ${e.message}`);
    process.exit(1);
  }
  if (videos.length === 0) {
    fail('Aucun resultat video pour cette requete.');
    process.exit(1);
  }

  const video = videos[0];
  const fichier = choisirFichier(video);
  if (!fichier) {
    fail('Aucun fichier video exploitable dans le resultat Pexels.');
    process.exit(1);
  }

  const tmpDir = path.join(SITES_DIR, slug, '.ff-tmp', 'video');
  fs.mkdirSync(tmpDir, { recursive: true });
  const srcPath = path.join(tmpDir, 'source.mp4');

  info(`Video retenue : #${video.id} — ${video.user?.name || 'inconnu'} (${fichier.quality}, ${fichier.width}x${fichier.height})`);
  try {
    const buf = await telecharger(fichier.link);
    fs.writeFileSync(srcPath, buf);
  } catch (e) {
    fail(`Telechargement echoue : ${e.message}`);
    process.exit(1);
  }

  const outDir = path.join(SITES_DIR, slug, 'public', 'videos');
  fs.mkdirSync(outDir, { recursive: true });

  if (ffmpegDisponible()) {
    const webmOut = path.join(outDir, 'hero.webm');
    const mp4Out = path.join(outDir, 'hero.mp4');
    const posterOut = path.join(outDir, 'poster.jpg');

    const moWebm = encoderAvecBudget({
      label: 'webm',
      out: webmOut,
      maxMo,
      crfs: [32, 36, 40],
      buildArgs: (crf) => ['-y', '-i', srcPath, '-t', String(duree), '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', String(crf), '-vf', 'scale=1280:-2,fps=24', webmOut],
    });
    const moMp4 = encoderAvecBudget({
      label: 'mp4',
      out: mp4Out,
      maxMo,
      crfs: [28, 32, 36],
      buildArgs: (crf) => ['-y', '-i', srcPath, '-t', String(duree), '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-vf', 'scale=1280:-2,fps=24', '-movflags', '+faststart', mp4Out],
    });
    spawnSync('ffmpeg', ['-y', '-i', srcPath, '-vframes', '1', '-q:v', '3', posterOut], { stdio: 'ignore' });

    info('');
    ok(`sites/${slug}/public/videos/hero.webm (${moWebm.toFixed(2)} Mo)`);
    ok(`sites/${slug}/public/videos/hero.mp4 (${moMp4.toFixed(2)} Mo)`);
    ok(`sites/${slug}/public/videos/poster.jpg`);
    if (moWebm > maxMo || moMp4 > maxMo) {
      warn(`Taille au-dessus de --max-mo ${maxMo} malgre les paliers de compression essayes — reduis --duree ou verifie la source.`);
    }
    info('');
    info("A coller dans site.config.ts : images.heroVideo = '/videos/hero.mp4', images.hero.src comme poster de repli.");
  } else {
    fs.copyFileSync(srcPath, path.join(outDir, 'source.mp4'));
    warn('Fichier source garde tel quel : sites/' + slug + '/public/videos/source.mp4 (pas encore compresse).');
    afficherCommandesManuelles({ src: path.join(outDir, 'source.mp4'), outDir, duree });
  }

  appendCredits(
    slug,
    `## public/videos/hero (${video.user?.name || 'inconnu'})\n- Createur : ${video.user?.name || 'inconnu'} (${video.user?.url || ''})\n- Source : Pexels Videos — ${video.url || ''}\n- Licence : Pexels License (https://www.pexels.com/license/) — usage commercial libre, sans attribution obligatoire\n- Date : ${new Date().toISOString().slice(0, 10)}`,
  );
}
