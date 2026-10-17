/**
 * Images dérivées d'Alain Ballay (17 oct 2026), à rejouer après `ff images prospect-ballay-macon` :
 *   node sites/prospect-ballay-macon/images-derivees.cjs
 * Pourquoi : ses photos de téléphone (2 000 à 4 000 px, très texturées) pèsent 200 à 300 Ko dès 800 px ; l'accueil les
 * chargeait en entier pour un échantillon de 104 px ou une carte (budget images de `ff perf` : 1,8 Mo pour 600).
 * On découpe donc, dans ses photos (raw/), ce que la page affiche vraiment :
 *   ech-<photo>   l'échantillon de l'échantillonnier (carré autour du matériau, 330 px) ;
 *   carte-<photo> la photo d'une carte de travail (3:4, 480 et 720 px) ;
 *   vue-<photo>   la grande vue de l'échantillonnier (4:5, 480 et 960 px) ;
 *   cours-<photo> les photos « en cours de chantier » (3:4, 480 px) ;
 *   mos-<photo>   les carreaux de la mosaïque du premier écran (17 oct 2026, famille `mosaique`) : en hauteur 1:2
 *                 (340 x 680) ou carrés (340), une seule largeur : 170 px CSS sur ordinateur (DPR 2), 94 sur
 *                 téléphone (DPR 3).
 * Aucun agrandissement : chaque découpe est plus petite que la région prise dans la source. Écrit les fichiers dans
 * public/images/ et leurs entrées dans images.json (lu par <Img>). Ne lit que des images (sharp), n'exécute rien de raw/.
 */
const path = require('node:path');
const fs = require('node:fs');
const sharp = require(path.join(__dirname, '../../node_modules/sharp'));

const SITE = __dirname;
const OUT = path.join(SITE, 'public/images');
const manifestPath = path.join(SITE, 'images.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Matériaux : point de mire (x, y en %) et zoom, comme sections/photos.ts (MATERIAUX).
const ECH = { 'realisation-48': [62, 40], 'realisation-66': [45, 55], 'realisation-72': [50, 62], 'realisation-30': [55, 82], 'realisation-60': [45, 38], 'realisation-78': [50, 62] };
const ZOOM = 2.6;
const CARTES = ['realisation-36', 'realisation-48', 'realisation-01', 'realisation-66'];
const VUES = ['realisation-48', 'realisation-66', 'realisation-72', 'realisation-30', 'realisation-60', 'realisation-78'];
const COURS = ['realisation-06', 'realisation-12', 'accueil-01'];
// Mosaïque : forme du carreau sur ordinateur (sections/Mosaique.astro) ; le barbecue garde ses tailles d'origine.
const MOS_HAUT = ['realisation-36', 'realisation-78', 'realisation-72', 'realisation-66', 'realisation-30', 'realisation-54', 'realisation-24'];
const MOS_CARRE = ['realisation-48', 'realisation-60', 'accueil-01', 'realisation-06', 'realisation-12', 'realisation-42', 'realisation-18'];

async function decoupe(nom, prefixe, ratio, largeurs, mire = [50, 50], zoom = 1) {
  const src = path.join(SITE, 'raw', `${nom}.jpg`);
  const img = sharp(src).rotate();
  const { width: W, height: H } = await img.metadata();
  // Plus grande région au bon ratio, réduite par le zoom, centrée sur la mire (bornée à l'image).
  let w = Math.min(W, H * ratio) / zoom;
  let h = w / ratio;
  const left = Math.round(Math.max(0, Math.min(W - w, (mire[0] / 100) * W - w / 2)));
  const top = Math.round(Math.max(0, Math.min(H - h, (mire[1] / 100) * H - h / 2)));
  w = Math.round(w); h = Math.round(h);
  const region = await sharp(src).rotate().extract({ left, top, width: w, height: h }).toBuffer();
  const tailles = largeurs.filter((l) => l <= w);
  if (!tailles.length) tailles.push(w);
  const max = Math.max(...tailles);
  const base = `${prefixe}-${nom}`;
  for (const l of tailles) {
    const suffixe = l === max ? '' : `-${l}`;
    const r = sharp(region).resize({ width: l });
    await r.clone().avif({ quality: 50 }).toFile(path.join(OUT, `${base}${suffixe}.avif`));
    await r.clone().webp({ quality: 72 }).toFile(path.join(OUT, `${base}${suffixe}.webp`));
  }
  const lqip = await sharp(region).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
  manifest[base] = { widths: tailles.sort((a, b) => a - b), formats: ['avif', 'webp'], ratio: +(ratio).toFixed(4), lqip: `data:image/webp;base64,${lqip.toString('base64')}` };
  console.log(base, tailles.join(','), `région ${w}x${h}`);
}

(async () => {
  for (const [nom, mire] of Object.entries(ECH)) await decoupe(nom, 'ech', 1, [330], mire, ZOOM);
  for (const nom of CARTES) await decoupe(nom, 'carte', 3 / 4, [480, 720]);
  for (const nom of VUES) await decoupe(nom, 'vue', 4 / 5, [480, 960]);
  for (const nom of COURS) await decoupe(nom, 'cours', 3 / 4, [480]);
  for (const nom of MOS_HAUT) await decoupe(nom, 'mos', 1 / 2, [340]);
  for (const nom of MOS_CARRE) await decoupe(nom, 'mos', 1, [340]);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
})();
