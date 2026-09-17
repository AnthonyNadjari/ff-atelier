// Tests de l'effet "page produit" (data-frames) : src/scripts/motion.ts + src/styles/global.css le
// gerent (poster/reduced-motion), sites/_effets build avec le canvas + le poster de la demo, et le
// pipeline de reencodage frame -> webp de scripts/ff/sequence.mjs fonctionne seul (sans Chrome ni
// video), sur une sequence synthetique. Voir docs/ANIMATIONS.md § data-frames.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { reencodeSequence } from '../scripts/ff/sequence.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MOTION_TS = path.join(ROOT, 'src', 'scripts', 'motion.ts');
const GLOBAL_CSS = path.join(ROOT, 'src', 'styles', 'global.css');
const ASTRO = path.join(ROOT, 'node_modules', 'astro', 'astro.js');
const TEST_OUT = 'dist/_test-frames';
// Hors du depot (donc hors OneDrive, qui verrouille brievement les fichiers tout juste crees/supprimes
// sur ce poste) : os.tmpdir() plutot qu'un dossier local au repo, pour un nettoyage fiable et rapide.
const TMP_DIR = path.join(os.tmpdir(), 'ff-atelier-test-frames');

const motionSrc = fs.readFileSync(MOTION_TS, 'utf8');
const cssSrc = fs.readFileSync(GLOBAL_CSS, 'utf8');

/** rmSync avec quelques tentatives : sur Windows, un fichier webp tout juste ecrit par sharp peut
 * rester verrouille (antivirus). Best-effort : un echec de NETTOYAGE apres coup ne doit pas faire
 * echouer un test dont les assertions ont deja toutes reussi — on avertit au lieu de lever. */
async function rmSyncRetry(dir, tries = 10) {
  for (let i = 0; i < tries; i++) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      return;
    } catch (e) {
      if (i === tries - 1) {
        console.warn(`(nettoyage best-effort) impossible de supprimer ${dir} : ${e.message}`);
        return;
      }
      await new Promise((r) => setTimeout(r, 500));
    }
  }
}

after(async () => {
  const dir = path.join(ROOT, TEST_OUT);
  if (fs.existsSync(dir)) await rmSyncRetry(dir);
  if (fs.existsSync(TMP_DIR)) await rmSyncRetry(TMP_DIR);
});

/** Le bloc @media (prefers-reduced-motion: reduce) { ... } de global.css (meme logique que motion.test.mjs). */
function reducedMotionBlock(css) {
  const start = css.indexOf('@media (prefers-reduced-motion: reduce)');
  assert.ok(start !== -1, 'global.css doit avoir un bloc @media (prefers-reduced-motion: reduce)');
  const braceStart = css.indexOf('{', start);
  let depth = 0;
  for (let i = braceStart; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}') {
      depth--;
      if (depth === 0) return css.slice(braceStart, i + 1);
    }
  }
  throw new Error('bloc reduced-motion non ferme dans global.css');
}

const reduced = reducedMotionBlock(cssSrc);

test('motion.ts documente et gere data-frames (+ sous-attributs)', () => {
  const attrs = ['data-frames', 'data-frames-canvas', 'data-frames-count', 'data-frames-ext', 'data-frames-pad', 'data-frames-mobile', 'data-frames-poster'];
  for (const attr of attrs) {
    assert.ok(motionSrc.includes(attr), `motion.ts ne mentionne jamais "${attr}"`);
  }
  assert.match(motionSrc, /function frameSequences/, 'motion.ts doit definir frameSequences()');
  assert.match(motionSrc, /frameSequences\(motion, reduced\)/, 'initMotion() doit appeler frameSequences() (poster meme hors motion="rich")');
});

test('data-frames a une regle explicite dans le bloc reduced-motion de global.css (canvas masque)', () => {
  assert.ok(reduced.includes('data-frames-canvas'), 'le bloc reduced-motion doit mentionner data-frames-canvas');
  assert.match(reduced, /\[data-frames\]\s*\[data-frames-canvas\]\s*\{[^}]*display:\s*none/, 'le canvas doit etre masque en reduced-motion');
});

test('sites/_effets/sections/Effets.astro utilise data-frames avec un canvas et un poster', () => {
  const src = fs.readFileSync(path.join(ROOT, 'sites', '_effets', 'sections', 'Effets.astro'), 'utf8');
  assert.match(src, /data-frames="\/anim\/demo\/"/);
  assert.match(src, /data-frames-canvas/);
  assert.match(src, /data-frames-poster="\/anim\/demo\/0001\.webp"/);
});

test('la sequence synthetique de demo existe et reste legere (< 1.5 Mo au total)', () => {
  const desktop = path.join(ROOT, 'sites', '_effets', 'public', 'anim', 'demo');
  const mobile = path.join(ROOT, 'sites', '_effets', 'public', 'anim', 'demo-mobile');
  assert.ok(fs.existsSync(path.join(desktop, '0001.webp')), 'sites/_effets/public/anim/demo/0001.webp manquant');
  assert.ok(fs.existsSync(path.join(mobile, '0001.webp')), 'sites/_effets/public/anim/demo-mobile/0001.webp manquant');
  const total = [desktop, mobile]
    .flatMap((d) => fs.readdirSync(d).map((f) => fs.statSync(path.join(d, f)).size))
    .reduce((a, b) => a + b, 0);
  assert.ok(total < 1.5 * 1024 * 1024, `sequence de demo trop lourde : ${(total / 1024 / 1024).toFixed(2)} Mo`);
});

test(
  'sites/_effets build sans erreur (SITE=_effets, FF_OUT isole) et le HTML contient le canvas + le poster',
  { timeout: 120 * 1000 },
  () => {
    const res = spawnSync(process.execPath, [ASTRO, 'build'], {
      cwd: ROOT,
      encoding: 'utf8',
      env: { ...process.env, SITE: '_effets', FF_OUT: TEST_OUT },
    });
    if (res.status !== 0) {
      console.log(res.stdout);
      console.log(res.stderr);
    }
    assert.equal(res.status, 0, '`astro build` a echoue pour sites/_effets (voir la sortie ci-dessus)');
    const html = fs.readFileSync(path.join(ROOT, TEST_OUT, 'index.html'), 'utf8');
    assert.match(html, /data-frames-canvas/, 'index.html doit contenir <canvas data-frames-canvas>');
    assert.match(html, /data-frames="\/anim\/demo\/"/, 'index.html doit contenir la section data-frames de la demo');
    assert.ok(fs.existsSync(path.join(ROOT, TEST_OUT, 'anim', 'demo', '0001.webp')), 'le poster de la demo doit etre copie dans le build (anim/demo/0001.webp)');
  },
);

test('pipeline sequence -> webp (scripts/ff/sequence.mjs, reencodeSequence) sur des frames synthetiques', async () => {
  if (fs.existsSync(TMP_DIR)) await rmSyncRetry(TMP_DIR);
  const rawDir = path.join(TMP_DIR, 'raw');
  fs.mkdirSync(rawDir, { recursive: true });

  const couleurs = [
    { r: 200, g: 40, b: 40 },
    { r: 40, g: 200, b: 40 },
    { r: 40, g: 40, b: 200 },
  ];
  const frames = [];
  for (let i = 0; i < couleurs.length; i++) {
    const buf = await sharp({ create: { width: 64, height: 36, channels: 3, background: couleurs[i] } }).png().toBuffer();
    const p = path.join(rawDir, `${String(i + 1).padStart(4, '0')}.png`);
    fs.writeFileSync(p, buf);
    frames.push(p);
  }

  const outDir = path.join(TMP_DIR, 'out');
  const outDirMobile = path.join(TMP_DIR, 'out-mobile');
  const resultat = await reencodeSequence(frames, { outDir, outDirMobile, largeur: 64, largeurMobile: 32, qualite: 70 });

  assert.equal(resultat.count, 3);
  assert.ok(resultat.octets > 0);
  for (let i = 1; i <= 3; i++) {
    const name = `${String(i).padStart(4, '0')}.webp`;
    const desktopFile = path.join(outDir, name);
    const mobileFile = path.join(outDirMobile, name);
    assert.ok(fs.existsSync(desktopFile), `${name} manquant cote desktop`);
    assert.ok(fs.existsSync(mobileFile), `${name} manquant cote mobile`);
    const meta = await sharp(desktopFile).metadata();
    assert.equal(meta.width, 64);
    const metaMobile = await sharp(mobileFile).metadata();
    assert.equal(metaMobile.width, 32);
  }

  await rmSyncRetry(TMP_DIR);
});
