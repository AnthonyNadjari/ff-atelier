// Cartes de visite Finck & Fisch : trois modèles, recto + verso, PDF prêts pour l'imprimeur.
//
//   node studio/marque/cartes-de-visite/build.mjs                 (coordonnées d'exemple)
//   node studio/marque/cartes-de-visite/build.mjs moi.json        (ses vraies coordonnées)
//
// Format fini 85 × 55 mm, fond perdu 3 mm (page de 91 × 61 mm), texte à 5 mm minimum du bord fini.
// Sortie : dist/<modele>.pdf (page 1 = recto, page 2 = verso) et dist/apercu.html pour tout voir.
// Couleurs et polices = celles du site du studio (sites/finck-fisch/sections/ff.css).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const RACINE = path.resolve(ICI, '../../..');
const SORTIE = path.join(ICI, 'dist');
const PERDU = 3; // mm
const L = 85 + 2 * PERDU;
const H = 55 + 2 * PERDU;

const fichier = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ICI, 'coordonnees.exemple.json');
const c = JSON.parse(fs.readFileSync(fichier, 'utf8'));

const NUIT = '#15120f';
const PAPIER = '#f0e8db';
const CUIVRE = '#d39a6a';
const CUIVRE_FONCE = '#8a5a33';
const GRIS_NUIT = '#aaa49a';
const GRIS_PAPIER = '#5b5750';

const police = (pkg, f) => fs.readFileSync(path.join(RACINE, 'node_modules/@fontsource-variable', pkg, 'files', f)).toString('base64');
const POLICES = `
@font-face { font-family: 'Bodoni'; font-weight: 400 900; src: url(data:font/woff2;base64,${police('bodoni-moda', 'bodoni-moda-latin-wght-normal.woff2')}) format('woff2'); }
@font-face { font-family: 'Hanken'; font-weight: 100 900; src: url(data:font/woff2;base64,${police('hanken-grotesk', 'hanken-grotesk-latin-wght-normal.woff2')}) format('woff2'); }`;

const svg = (nom, couleur) =>
  fs.readFileSync(path.join(RACINE, 'studio/marque/logo/export', nom), 'utf8')
    .replace(/<\?xml[^>]*>/, '')
    .replace('color="#111111"', `color="${couleur}"`)
    .replace(/<title>.*?<\/title>/s, '');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
// Numéro : espaces insécables, jamais coupé en fin de ligne.
const tel = (s) => esc(s).replace(/ /g, ' ');

const infos = (texte, discret, accent) => `
  <div class="infos" style="color:${texte}">
    <p class="nom">${esc(c.nom)}</p>
    <p class="role" style="color:${discret}">${esc(c.role)}</p>
    <span class="filet" style="background:${accent}"></span>
    <p>${tel(c.telephone)}</p>
    <p>${esc(c.email)}</p>
    <p>${esc(c.site)}</p>
  </div>`;

const MODELES = {
  nuit: {
    titre: 'Nuit',
    note: 'Fond encre des deux côtés, monogramme crème au recto. Le plus proche du site.',
    recto: `<div class="face" style="background:${NUIT}"><div class="centre mono">${svg('monogram.svg', PAPIER)}</div></div>`,
    verso: `<div class="face" style="background:${NUIT}">${infos(PAPIER, GRIS_NUIT, CUIVRE)}<div class="coin">${svg('monogram.svg', CUIVRE)}</div></div>`,
  },
  papier: {
    titre: 'Papier',
    note: 'Fond crème, logo complet à l’encre. Le plus classique, lisible partout.',
    recto: `<div class="face" style="background:${PAPIER}"><div class="centre horizontal">${svg('logo-horizontal.svg', NUIT)}</div></div>`,
    verso: `<div class="face" style="background:${PAPIER}">${infos(NUIT, GRIS_PAPIER, CUIVRE_FONCE)}<div class="coin">${svg('monogram.svg', CUIVRE_FONCE)}</div></div>`,
  },
  monogramme: {
    titre: 'Grand monogramme',
    note: 'Recto encre avec un monogramme cuivre géant qui sort du cadre ; verso crème. Le plus marquant.',
    recto: `<div class="face" style="background:${NUIT}"><div class="geant">${svg('monogram.svg', CUIVRE)}</div></div>`,
    verso: `<div class="face" style="background:${PAPIER}">${infos(NUIT, GRIS_PAPIER, CUIVRE_FONCE)}</div>`,
  },
};

const CSS = `${POLICES}
@page { size: ${L}mm ${H}mm; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: #777; }
.face { width: ${L}mm; height: ${H}mm; position: relative; overflow: hidden; break-after: page; font-family: 'Hanken', sans-serif; }
.face svg { display: block; width: 100%; height: auto; }
.centre { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); }
.mono { width: 21mm; }
.horizontal { width: 54mm; }
.geant { position: absolute; width: 60mm; right: -9mm; top: 50%; transform: translateY(-50%); }
.coin { position: absolute; width: 9mm; right: ${PERDU + 6}mm; bottom: ${PERDU + 6}mm; }
.infos { position: absolute; left: ${PERDU + 7}mm; top: ${PERDU + 7}mm; font-size: 7.6pt; line-height: 1.5; font-weight: 400; }
.nom { font-family: 'Bodoni', serif; font-weight: 500; font-size: 14pt; line-height: 1.1; }
.role { margin-top: 1mm; }
.filet { display: block; width: 10mm; height: 0.3mm; margin: 4.5mm 0 3.5mm; }
`;

fs.mkdirSync(SORTIE, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const MM = 96 / 25.4;
const cartes = [];
const problemes = [];
for (const [cle, m] of Object.entries(MODELES)) {
  const html = `<!doctype html><html lang="fr"><meta charset="utf-8"><style>${CSS}</style><body>${m.recto}${m.verso}</body></html>`;
  const page = await browser.newPage({ viewport: { width: Math.ceil(L * MM), height: Math.ceil(H * MM) }, deviceScaleFactor: 4 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  // Zone sûre : tout texte à 5 mm au moins du bord fini (donc 8 mm du bord de la page).
  const hors = await page.evaluate((marge) => {
    const mm = 96 / 25.4;
    return [...document.querySelectorAll('.infos p')].flatMap((p, i) => {
      const f = p.closest('.face').getBoundingClientRect();
      const r = p.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(p);
      const t = range.getBoundingClientRect();
      return t.right > f.right - marge * mm || r.left < f.left + marge * mm || r.bottom > f.bottom - marge * mm ? [p.textContent] : [];
    });
  }, PERDU + 5);
  for (const t of hors) problemes.push(`${cle} : « ${t} » trop près du bord`);
  await page.pdf({ path: path.join(SORTIE, `${cle}.pdf`), preferCSSPageSize: true, printBackground: true });
  const faces = page.locator('.face');
  for (const [i, cote] of ['recto', 'verso'].entries()) {
    const box = await faces.nth(i).boundingBox();
    await page.screenshot({
      path: path.join(SORTIE, `${cle}-${cote}.png`),
      clip: { x: box.x + PERDU * MM, y: box.y + PERDU * MM, width: box.width - 2 * PERDU * MM, height: box.height - 2 * PERDU * MM },
      fullPage: true,
    });
  }
  await page.close();
  cartes.push({ cle, ...m });
}
await browser.close();

fs.writeFileSync(path.join(SORTIE, 'apercu.html'), `<!doctype html><html lang="fr"><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Cartes de visite</title>
<style>${POLICES}
body { margin: 0; padding: 32px 16px; background: #2a2622; color: ${PAPIER}; font-family: 'Hanken', sans-serif; }
main { max-width: 980px; margin: 0 auto; }
h1 { font-family: 'Bodoni', serif; font-weight: 500; font-size: 2rem; margin: 0 0 8px; }
h2 { font-family: 'Bodoni', serif; font-weight: 500; font-size: 1.4rem; margin: 40px 0 4px; }
p { color: ${GRIS_NUIT}; margin: 0 0 16px; max-width: 60ch; }
.paire { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
img { width: 100%; height: auto; display: block; border-radius: 3px; box-shadow: 0 18px 40px -18px #000; }
a { color: ${CUIVRE}; }
</style><main>
<h1>Cartes de visite</h1>
<p>Format 85 × 55 mm, rendu au massicot (sans le fond perdu). Coordonnées : ${esc(path.basename(fichier))}.</p>
${cartes.map((m) => `<h2>${m.titre}</h2><p>${m.note} <a href="${m.cle}.pdf">PDF pour l’imprimeur</a></p>
<div class="paire"><img src="${m.cle}-recto.png" alt="${m.titre}, recto"><img src="${m.cle}-verso.png" alt="${m.titre}, verso"></div>`).join('\n')}
</main></html>`);

console.log(`✓ ${cartes.length} modèles dans ${path.relative(RACINE, SORTIE)} (PDF + aperçus PNG + apercu.html)`);
if (problemes.length) {
  console.log(problemes.map((p) => `✗ ${p}`).join('\n'));
  process.exitCode = 1;
}
