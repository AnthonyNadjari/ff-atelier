// `ff nettoyer-photos <slug> [--angle N] [--duotone [#hexOmbre,#hexLumiere]] [--valider]` : nettoie
// sites/<slug>/raw/*.{jpg,jpeg,png,webp} AVANT `ff images` (qui reste inchange, charge de la sortie
// AVIF/WebP/LQIP). Sharp uniquement, aucune nouvelle dependance — voir docs/veille/redaction-images.md
// §2.6 pour la specification complete et ce que cette commande ne fait volontairement pas (suppression
// de fond, detection d'horizon penche, harmonisation colorimetrique multi-photos).
//
// Pipeline par image : rotation EXIF automatique -> angle fin optionnel (--angle) -> .trim() des
// bordures unies -> recadrage focal 4:3 (portrait) ou 3:2 (paysage) via sharp.strategy.attention ->
// balance des blancs gray-world (calcul des moyennes par canal, egalisation via .linear()) -> duotone
// optionnel (--duotone). Sortie dans sites/<slug>/.ff-tmp/nettoye/ + feuille de contact apercu.html,
// jamais d'ecriture dans raw/ sans --valider explicite.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { SITES_DIR, ROOT, resolveSlug, parseArgs, ok, fail, warn, info, c } from './util.mjs';

const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>'"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&apos;', '"': '&quot;' }[ch]));
}

function normaliserHex(hex) {
  const h = String(hex).trim();
  return h.startsWith('#') ? h : `#${h}`;
}

function hexToRgb(hex) {
  let h = String(hex).replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((ch) => ch + ch).join('');
  const num = parseInt(h.slice(0, 6), 16) || 0;
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/** hsl(h, s%, l%) -> "#rrggbb" (memes conventions que --accent-h/--accent-s/--accent-l des directions). */
function hslToHex(h, s, l) {
  const sN = s / 100;
  const lN = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = sN * Math.min(lN, 1 - lN);
  const f = (n) => lN - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x) => Math.round(255 * x).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

/** Lit `direction` dans sites/<slug>/site.config.ts, puis --ink/--accent dans src/directions/<direction>/index.css
 * (regex, pas d'import TS — meme approche que readTradeFromConfig() dans verifier.mjs). */
function lireCouleursDirection(slug) {
  const configPath = path.join(SITES_DIR, slug, 'site.config.ts');
  if (!fs.existsSync(configPath)) return null;
  const cfg = fs.readFileSync(configPath, 'utf8');
  const dirMatch = cfg.match(/direction\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/);
  if (!dirMatch) return null;
  const direction = dirMatch[2];
  const cssPath = path.join(ROOT, 'src', 'directions', direction, 'index.css');
  if (!fs.existsSync(cssPath)) return null;
  const css = fs.readFileSync(cssPath, 'utf8');

  const inkMatch = css.match(/--ink\s*:\s*(#[0-9a-fA-F]{3,8})/);
  const ink = inkMatch ? inkMatch[1] : null;

  const hMatch = css.match(/--accent-h\s*:\s*([\d.]+)/);
  const sMatch = css.match(/--accent-s\s*:\s*([\d.]+)%/);
  const lMatch = css.match(/--accent-l\s*:\s*([\d.]+)%/);
  const accentHexMatch = css.match(/--accent\s*:\s*(#[0-9a-fA-F]{3,8})/);
  let accent = null;
  if (hMatch && sMatch && lMatch) accent = hslToHex(Number(hMatch[1]), Number(sMatch[1]), Number(lMatch[1]));
  else if (accentHexMatch) accent = accentHexMatch[1];

  if (!ink || !accent) return null;
  return { direction, ink, accent };
}

/** Recadrage focal : 4:3 si l'image est portrait (h > w), 3:2 si paysage — sans jamais agrandir
 * au-dela de la resolution source. Strategie `attention` de sharp/libvips (aucune dependance IA). */
async function recadrerAttention(buf) {
  const meta = await sharp(buf).metadata();
  const w = meta.width;
  const h = meta.height;
  if (!w || !h) return buf;
  const isPortrait = h > w;
  let targetW;
  let targetH;
  if (isPortrait) {
    targetW = w;
    targetH = Math.round((w * 4) / 3);
    if (targetH > h) {
      targetH = h;
      targetW = Math.round((h * 3) / 4);
    }
  } else {
    targetH = h;
    targetW = Math.round((h * 3) / 2);
    if (targetW > w) {
      targetW = w;
      targetH = Math.round((w * 2) / 3);
    }
  }
  return sharp(buf)
    .resize({ width: targetW, height: targetH, fit: 'cover', position: sharp.strategy.attention })
    .toBuffer();
}

/** Balance des blancs gray-world : sous-echantillonne, calcule la moyenne par canal R/G/B, en deduit un
 * gain par canal pour egaliser les trois moyennes, applique ce gain a l'image pleine resolution via
 * .linear(). Gains bornes [0.5, 2] pour eviter une correction extreme sur une image deja neutre. */
async function balanceBlancsGrisMonde(buf) {
  const { data, info } = await sharp(buf)
    .removeAlpha()
    .toColourspace('srgb')
    .resize(64, 64, { fit: 'inside' })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const channels = info.channels;
  const pixelCount = info.width * info.height;
  if (pixelCount === 0 || channels < 3) return buf;
  const sums = [0, 0, 0];
  for (let i = 0; i < data.length; i += channels) {
    sums[0] += data[i];
    sums[1] += data[i + 1];
    sums[2] += data[i + 2];
  }
  const means = sums.map((s) => s / pixelCount);
  const grayMean = (means[0] + means[1] + means[2]) / 3;
  const gains = means.map((m) => (m > 0 ? Math.min(Math.max(grayMean / m, 0.5), 2) : 1));
  return sharp(buf).linear(gains, [0, 0, 0]).toBuffer();
}

/** Duotone en JS pur sur les pixels niveaux de gris (pas de recombine() : semantique moins previsible
 * que le calcul direct). ombre = ton fonce (0), lumiere = ton clair (255). */
async function appliquerDuotone(buf, hexOmbre, hexLumiere) {
  const [r0, g0, b0] = hexToRgb(hexOmbre);
  const [r1, g1, b1] = hexToRgb(hexLumiere);
  const { data, info } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 3);
  for (let i = 0, p = 0; i < data.length; i += channels, p += 3) {
    const v = data[i] / 255;
    out[p] = Math.round(r0 + (r1 - r0) * v);
    out[p + 1] = Math.round(g0 + (g1 - g0) * v);
    out[p + 2] = Math.round(b0 + (b1 - b0) * v);
  }
  return sharp(out, { raw: { width, height, channels: 3 } }).png().toBuffer();
}

async function nettoyerImage(buf, { angle }) {
  let out = await sharp(buf).rotate().toBuffer(); // 1. orientation EXIF
  if (angle) out = await sharp(out).rotate(Number(angle), { background: '#ffffff' }).toBuffer(); // angle fin
  out = await sharp(out).trim().toBuffer(); // 2. bordures unies
  out = await recadrerAttention(out); // 3. recadrage focal 4:3/3:2
  out = await balanceBlancsGrisMonde(out); // 4. balance des blancs gray-world
  return out;
}

async function ecrireFormat(buf, outPath, ext) {
  let img = sharp(buf);
  if (ext === '.png') img = img.png();
  else if (ext === '.webp') img = img.webp({ quality: 85 });
  else img = img.jpeg({ quality: 90 }); // .jpg / .jpeg
  await img.toFile(outPath);
}

function ecrireApercu(outDir, rawDir, items) {
  const cartes = items
    .map((it) => {
      const avant = path.relative(outDir, path.join(rawDir, it.file)).split(path.sep).join('/');
      return `
      <figure>
        <div class="paire">
          <div class="vignette"><span class="etiquette">Avant</span><img src="${escapeHtml(avant)}" alt="Avant : ${escapeHtml(it.file)}" loading="lazy" /></div>
          <div class="vignette"><span class="etiquette">Apres</span><img src="${escapeHtml(it.file)}" alt="Apres : ${escapeHtml(it.file)}" loading="lazy" /></div>
        </div>
        <figcaption>${escapeHtml(it.file)} — ${it.largeur}×${it.hauteur}</figcaption>
      </figure>`;
    })
    .join('\n');
  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>Apercu photos nettoyees</title>
<style>
  body { font-family: system-ui, sans-serif; background: #111; color: #eee; margin: 0; padding: 2rem; }
  h1 { font-weight: 600; }
  .grille { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.5rem; }
  figure { margin: 0; background: #1c1c1c; border-radius: 8px; overflow: hidden; }
  .paire { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
  .vignette { position: relative; }
  .etiquette { position: absolute; top: 0.4rem; left: 0.4rem; z-index: 1; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.15rem 0.4rem; background: rgb(0 0 0 / 0.6); border-radius: 4px; }
  img { width: 100%; height: 220px; object-fit: cover; display: block; }
  figcaption { padding: 0.5rem 0.75rem; font-size: 0.8rem; }
</style>
</head>
<body>
  <h1>Feuille de contact — photos nettoyees</h1>
  <p>Avant / apres pour chaque photo de <code>raw/</code>. Valide avec <code>ff nettoyer-photos &lt;slug&gt; --valider</code> une fois satisfait — les originaux vont dans <code>raw/originaux/</code>, les versions nettoyees dans <code>raw/</code>.</p>
  <div class="grille">
    ${cartes}
  </div>
</body>
</html>`;
  fs.writeFileSync(path.join(outDir, 'apercu.html'), html);
}

export async function cmdNettoyerPhotos(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const rawDir = path.join(SITES_DIR, slug, 'raw');
  if (!fs.existsSync(rawDir)) {
    fail(`sites/${slug}/raw introuvable. Depose les photos originales dedans d'abord.`);
    process.exit(1);
  }
  const files = fs
    .readdirSync(rawDir)
    .filter((f) => EXTS.has(path.extname(f).toLowerCase()))
    .sort();
  if (files.length === 0) {
    warn(`Aucune image (jpg/jpeg/png/webp) dans sites/${slug}/raw/.`);
    return;
  }

  let angle = 0;
  if (flags.angle !== undefined) {
    angle = Number(flags.angle);
    if (!Number.isFinite(angle)) {
      fail(`--angle invalide : "${flags.angle}".`);
      process.exit(1);
    }
  }

  let couleurs = null;
  if (flags.duotone) {
    if (typeof flags.duotone === 'string' && /^#?[0-9a-f]{3,8}\s*,\s*#?[0-9a-f]{3,8}$/i.test(flags.duotone)) {
      const [a, b] = flags.duotone.split(',').map((s) => s.trim());
      couleurs = { ombre: normaliserHex(a), lumiere: normaliserHex(b) };
      info(`Duotone : couleurs fournies en argument (${couleurs.ombre} -> ${couleurs.lumiere}).`);
    } else {
      const dir = lireCouleursDirection(slug);
      if (dir) {
        couleurs = { ombre: dir.ink, lumiere: dir.accent };
        info(`Duotone : couleurs de la direction "${dir.direction}" (--ink ${dir.ink} -> --accent ${dir.accent}).`);
      } else {
        warn("--duotone demande mais aucune couleur fournie et direction du site introuvable/non lisible (site.config.ts ou src/directions/<direction>/index.css) : duotone ignore.");
      }
    }
  }

  const outDir = path.join(SITES_DIR, slug, '.ff-tmp', 'nettoye');
  fs.mkdirSync(outDir, { recursive: true });

  info(`Nettoyage de ${files.length} photo(s) depuis sites/${slug}/raw/ :`);
  info('');

  const items = [];
  for (const file of files) {
    const srcPath = path.join(rawDir, file);
    const ext = path.extname(file).toLowerCase();
    try {
      const buf = fs.readFileSync(srcPath);
      let out = await nettoyerImage(buf, { angle });
      if (couleurs) out = await appliquerDuotone(out, couleurs.ombre, couleurs.lumiere);
      const outPath = path.join(outDir, file);
      await ecrireFormat(out, outPath, ext);
      const meta = await sharp(out).metadata();
      items.push({ file, largeur: meta.width, hauteur: meta.height });
      ok(`${file} -> .ff-tmp/nettoye/${file} (${meta.width}x${meta.height})`);
    } catch (e) {
      fail(`${file} : echec (${e.message})`);
    }
  }

  if (items.length === 0) {
    fail('Aucune photo nettoyee avec succes.');
    process.exit(1);
  }

  ecrireApercu(outDir, rawDir, items);
  info('');
  ok(`Feuille de contact : sites/${slug}/.ff-tmp/nettoye/apercu.html`);

  if (flags.valider) {
    const origDir = path.join(rawDir, 'originaux');
    fs.mkdirSync(origDir, { recursive: true });
    let n = 0;
    for (const it of items) {
      const src = path.join(rawDir, it.file);
      const dest = path.join(origDir, it.file);
      if (fs.existsSync(src)) fs.renameSync(src, dest);
      const nettoye = path.join(outDir, it.file);
      fs.copyFileSync(nettoye, path.join(rawDir, it.file));
      n++;
    }
    info('');
    ok(`${n} photo(s) validee(s) : originaux deplaces vers sites/${slug}/raw/originaux/, versions nettoyees copiees dans sites/${slug}/raw/.`);
    info(`Lance ensuite : ${c.cyan(`ff images ${slug}`)}`);
  } else {
    info('');
    info(`Regarde la feuille de contact, puis relance avec les memes options + ${c.cyan('--valider')} pour promouvoir le resultat dans raw/.`);
  }
}
