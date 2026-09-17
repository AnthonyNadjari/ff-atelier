// `ff sequence <slug> <video.mp4|.mov> [--n 60] [--largeur 1280] [--nom montre]` : extrait N frames
// espacees regulierement d'une video SANS ffmpeg (aucun ffmpeg sur ce poste) : Chrome
// (playwright-core, channel 'chrome', headless) decode la video via un <video> HTML, chaque frame est
// dessinee sur un <canvas> puis exportee en webp (toDataURL) ; sharp reencode ensuite chaque frame aux
// formats desktop (--largeur) et mobile (largeur/2) dans sites/<slug>/public/anim/<nom>/ et
// .../anim/<nom>-mobile/, prets a coller comme data-frames/data-frames-mobile (voir docs/ANIMATIONS.md).
//
// La video est copiee dans sites/<slug>/.ff-tmp/sequence/<nom>/ puis servie en HTTP local (comme
// scripts/captures.mjs) plutot qu'en file:// : Chrome refuse parfois file:// pour un .mov, http est
// plus fiable (voir docs/ANIMATIONS.md § data-frames).
//
// Si Chrome ne sait pas decoder le codec (HEVC .mov issu d'iPhone, typiquement), la commande affiche
// la commande ffmpeg de repli exacte a lancer une fois ffmpeg installe.
//
// Usage : ff sequence <slug> <video.mp4|.mov> [--n 60] [--largeur 1280] [--nom montre] [--qualite 70]
import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'node:http';
import sharp from 'sharp';
import { SITES_DIR, resolveSlug, parseArgs, ok, fail, warn, info, c, slugify } from './util.mjs';

/** rmSync avec quelques tentatives : sur Windows (OneDrive/antivirus), un fichier tout juste ecrit ou
 * lu peut rester verrouille un moment, rmSync leve alors EBUSY/EPERM. Best-effort : le nettoyage du
 * dossier temporaire ne doit jamais faire planter la commande apres que le resultat utile (les frames
 * dans public/anim/<nom>/) a deja ete ecrit — on avertit et on continue plutot que de lever. */
async function rmSyncRetry(dir, tries = 10) {
  for (let i = 0; i < tries; i++) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      return;
    } catch (e) {
      if (i === tries - 1) {
        warn(`Nettoyage de ${dir} impossible (${e.message}) — dossier temporaire laisse en place, sans consequence.`);
        return;
      }
      await new Promise((r) => setTimeout(r, 300));
    }
  }
}

const MIME = { '.mp4': 'video/mp4', '.mov': 'video/quicktime', '.webm': 'video/webm', '.html': 'text/html; charset=utf-8' };

/** Page HTML minimale : <video> + <canvas>, deux fonctions exposees a page.evaluate (loadedmetadata + seek/grab). */
function grabPageHtml(fichierVideo) {
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8" /></head>
<body>
<video id="v" src="${fichierVideo}" muted playsinline preload="auto"></video>
<canvas id="c"></canvas>
<script>
  window.ffReady = new Promise((resolve, reject) => {
    const v = document.getElementById('v');
    v.addEventListener('loadedmetadata', () => resolve({ duration: v.duration, width: v.videoWidth, height: v.videoHeight }), { once: true });
    v.addEventListener('error', () => reject(new Error('decode-error : ' + (v.error ? v.error.message : 'inconnue'))), { once: true });
    setTimeout(() => reject(new Error('timeout-loadedmetadata (15s)')), 15000);
  });
  window.ffSeekAndGrab = (t, largeur) => new Promise((resolve) => {
    const v = document.getElementById('v');
    let done = false;
    const grab = () => {
      if (done) return;
      done = true;
      v.removeEventListener('seeked', onSeeked);
      const ratio = (v.videoHeight && v.videoWidth) ? v.videoHeight / v.videoWidth : 9 / 16;
      const c = document.getElementById('c');
      c.width = largeur;
      c.height = Math.max(1, Math.round(largeur * ratio));
      const ctx = c.getContext('2d');
      ctx.drawImage(v, 0, 0, c.width, c.height);
      resolve(c.toDataURL('image/webp', 0.8));
    };
    const onSeeked = () => grab();
    v.addEventListener('seeked', onSeeked);
    const before = v.currentTime;
    v.currentTime = t;
    // Si le temps demande est deja le temps courant, 'seeked' ne se declenche pas forcement : filet.
    if (Math.abs(before - t) < 0.001) setTimeout(grab, 50);
    setTimeout(grab, 4000);
  });
</script>
</body></html>`;
}

function afficherRepliFfmpeg({ videoAbs, n, largeur, slug, nom }) {
  info('');
  warn("Chrome n'a pas su decoder ce fichier (souvent un .mov HEVC issu d'iPhone). Commande ffmpeg de repli :");
  info('');
  info(c.cyan(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${videoAbs}"`));
  info(c.cyan(`ffmpeg -i "${videoAbs}" -vf "fps=${n}/<DUREE_SECONDES_CI_DESSUS>,scale=${largeur}:-2" -frames:v ${n} "sites/${slug}/public/anim/${nom}/%04d.webp"`));
  info('(remplace <DUREE_SECONDES_CI_DESSUS> par le resultat de la commande ffprobe.) Puis genere le jeu mobile :');
  info(c.cyan(`ffmpeg -i "${videoAbs}" -vf "fps=${n}/<DUREE_SECONDES_CI_DESSUS>,scale=${Math.round(largeur / 2)}:-2" -frames:v ${n} "sites/${slug}/public/anim/${nom}-mobile/%04d.webp"`));
}

/**
 * Reencode un lot de frames brutes (chemins de fichiers ou Buffers, dans l'ordre) en deux jeux WebP
 * (desktop --largeur, mobile --largeurMobile), qualite fixe. Utilisee par cmdSequence ; testable seule
 * (tests/frames.test.mjs) sur une sequence synthetique, sans Chrome ni video.
 */
export async function reencodeSequence(frames, { outDir, outDirMobile, largeur, largeurMobile, qualite = 70, pad = 4 }) {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(outDirMobile, { recursive: true });
  let octets = 0;
  for (let i = 0; i < frames.length; i++) {
    const src = frames[i];
    const name = `${String(i + 1).padStart(pad, '0')}.webp`;
    const destDesktop = path.join(outDir, name);
    const destMobile = path.join(outDirMobile, name);
    await sharp(src).resize({ width: largeur, withoutEnlargement: true }).webp({ quality: qualite }).toFile(destDesktop);
    await sharp(src).resize({ width: largeurMobile, withoutEnlargement: true }).webp({ quality: qualite }).toFile(destMobile);
    octets += fs.statSync(destDesktop).size + fs.statSync(destMobile).size;
  }
  return { count: frames.length, octets };
}

export async function cmdSequence(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const videoPath = positional[1];
  if (!videoPath) {
    fail('Usage : ff sequence <slug> <video.mp4|.mov> [--n 60] [--largeur 1280] [--nom montre]');
    process.exit(1);
  }
  const videoAbs = path.resolve(videoPath);
  if (!fs.existsSync(videoAbs)) {
    fail(`Fichier introuvable : ${videoAbs}`);
    process.exit(1);
  }

  const n = flags.n !== undefined ? Number(flags.n) : 60;
  const largeur = flags.largeur !== undefined ? Number(flags.largeur) : 1280;
  const qualite = flags.qualite !== undefined ? Number(flags.qualite) : 70;
  const nom = flags.nom ? slugify(String(flags.nom)) : 'sequence';
  if (!Number.isInteger(n) || n < 2) {
    fail('--n doit etre un entier >= 2.');
    process.exit(1);
  }
  if (!Number.isFinite(largeur) || largeur <= 0) {
    fail('--largeur doit etre un nombre positif.');
    process.exit(1);
  }

  const tmpDir = path.join(SITES_DIR, slug, '.ff-tmp', 'sequence', nom);
  const rawDir = path.join(tmpDir, 'raw');
  await rmSyncRetry(tmpDir);
  fs.mkdirSync(rawDir, { recursive: true });

  const ext = path.extname(videoAbs) || '.mp4';
  const localVideoName = `source${ext}`;
  fs.copyFileSync(videoAbs, path.join(tmpDir, localVideoName));
  fs.writeFileSync(path.join(tmpDir, 'grab.html'), grabPageHtml(localVideoName));

  const server = createServer((req, res) => {
    const f = path.join(tmpDir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!fs.existsSync(f) || !f.startsWith(tmpDir)) {
      res.writeHead(404);
      return res.end();
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    res.end(fs.readFileSync(f));
  }).listen(0);
  const port = server.address().port;

  let chromium;
  try {
    ({ chromium } = await import('playwright-core'));
  } catch (e) {
    server.close();
    fail(`playwright-core indisponible : ${e.message}`);
    process.exit(1);
  }

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  let meta;
  try {
    await page.goto(`http://localhost:${port}/grab.html`, { waitUntil: 'load' });
    meta = await page.evaluate(() => window.ffReady);
  } catch (e) {
    await browser.close();
    server.close();
    fail(`Chrome n'a pas pu decoder la video (${e.message}).`);
    afficherRepliFfmpeg({ videoAbs, n, largeur, slug, nom });
    process.exit(1);
  }

  info(`Video decodee par Chrome : ${meta.width}x${meta.height}, ${meta.duration.toFixed(2)}s.`);
  if (!meta.width || !meta.height || !Number.isFinite(meta.duration) || meta.duration <= 0) {
    await browser.close();
    server.close();
    fail("Metadonnees video invalides (largeur/hauteur/duree) — codec probablement non decode par Chrome.");
    afficherRepliFfmpeg({ videoAbs, n, largeur, slug, nom });
    process.exit(1);
  }

  const frames = [];
  for (let i = 0; i < n; i++) {
    const t = n > 1 ? (meta.duration * i) / (n - 1) : 0;
    const tSur = Math.min(Math.max(t, 0), Math.max(0, meta.duration - 0.05));
    let dataUrl;
    try {
      dataUrl = await page.evaluate(([tArg, largeurArg]) => window.ffSeekAndGrab(tArg, largeurArg), [tSur, largeur]);
    } catch (e) {
      warn(`Frame ${i + 1}/${n} : capture echouee (${e.message}), ignoree.`);
      continue;
    }
    const buf = Buffer.from(dataUrl.split(',')[1] || '', 'base64');
    if (!buf.length) {
      warn(`Frame ${i + 1}/${n} : donnees vides, ignoree.`);
      continue;
    }
    const rawPath = path.join(rawDir, `${String(i + 1).padStart(4, '0')}.webp`);
    fs.writeFileSync(rawPath, buf);
    frames.push(rawPath);
  }

  await browser.close();
  server.close();

  if (frames.length === 0) {
    fail('Aucune frame capturee.');
    process.exit(1);
  }

  const outDir = path.join(SITES_DIR, slug, 'public', 'anim', nom);
  const outDirMobile = path.join(SITES_DIR, slug, 'public', 'anim', `${nom}-mobile`);
  const resultat = await reencodeSequence(frames, {
    outDir,
    outDirMobile,
    largeur,
    largeurMobile: Math.max(1, Math.round(largeur / 2)),
    qualite,
  });

  await rmSyncRetry(tmpDir);

  info('');
  ok(`${resultat.count} frames -> sites/${slug}/public/anim/${nom}/ (+ ${nom}-mobile/), ${(resultat.octets / 1024 / 1024).toFixed(2)} Mo au total.`);
  if (resultat.count !== n) warn(`${n - resultat.count} frame(s) manquante(s) (captures ignorees ci-dessus) — data-frames-count doit valoir ${resultat.count}, pas ${n}.`);
  info('');
  info('A coller dans la section (voir docs/ANIMATIONS.md § data-frames) :');
  info(
    c.cyan(
      `data-frames="/anim/${nom}/" data-frames-count="${resultat.count}" data-frames-ext="webp" data-frames-pad="4" data-frames-mobile="/anim/${nom}-mobile/" data-frames-poster="/anim/${nom}/0001.webp" data-pin="180"`,
    ),
  );
}
