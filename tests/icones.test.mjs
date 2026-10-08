// Tests du pack d'icones (scripts/ff/icones.mjs, utilise par scripts/astro-icons-integration.mjs et
// scripts/vite-ff-look.mjs) : couleur de fond lue dans le token --bg de chaque direction, manifeste,
// conteneur ICO. Aucun build, aucun navigateur.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { ROOT } from '../scripts/ff/util.mjs';
import { parseDirectionBg, directionBg, parseBusinessName, nomCourt, construireManifest, pngVersIco, FICHIERS_ICONES } from '../scripts/ff/icones.mjs';

const DIRECTIONS_DIR = path.join(ROOT, 'src', 'directions');

test('parseDirectionBg : lit --bg du bloc de la direction (et pas --bg-2), normalise le hex', () => {
  const css = "@import 'x';\n[data-direction='demo'] {\n  --bg-2: #000000;\n  --bg: #FAF;\n}\n[data-direction='autre'] {\n  --bg: #123456;\n}\n";
  assert.equal(parseDirectionBg(css, 'demo'), '#ffaaff');
  assert.equal(parseDirectionBg(css, 'autre'), '#123456');
  assert.equal(parseDirectionBg(css, 'absente'), null);
  assert.equal(parseDirectionBg("[data-direction='x'] {\n  --bg: hsl(0 0% 100%);\n}\n", 'x'), null);
});

test('chaque direction declare un --bg hexadecimal lisible (theme-color + fond de l\'apple-touch-icon)', () => {
  const dirs = fs.readdirSync(DIRECTIONS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory() && fs.existsSync(path.join(DIRECTIONS_DIR, d.name, 'index.css')));
  assert.ok(dirs.length > 0);
  for (const d of dirs) {
    const bg = parseDirectionBg(fs.readFileSync(path.join(DIRECTIONS_DIR, d.name, 'index.css'), 'utf8'), d.name);
    assert.match(bg ?? '', /^#[0-9a-f]{6}$/, `${d.name} : --bg illisible (${bg})`);
  }
  assert.equal(directionBg(ROOT, 'direction-inexistante'), '#ffffff');
});

test('parseBusinessName / nomCourt', () => {
  assert.equal(parseBusinessName("export default defineSite({\n  business: {\n    name: 'L\\'Atelier & Fils',\n    trade: 'x',\n  },\n});"), "L'Atelier & Fils");
  assert.equal(parseBusinessName(''), '');
  assert.equal(nomCourt('Finck & Fisch'), 'Finck & Fisch');
  assert.equal(nomCourt('Plomberie Dubois et associes'), 'Plomberie');
});

test('construireManifest : icones 192/512, couleurs, display browser', () => {
  const m = construireManifest({ nom: 'Maison Roux', couleur: '#faf7f2' });
  assert.equal(m.name, 'Maison Roux');
  assert.equal(m.display, 'browser');
  assert.equal(m.theme_color, '#faf7f2');
  assert.equal(m.background_color, '#faf7f2');
  assert.deepEqual(m.icons.map((i) => i.sizes), ['192x192', '512x512']);
  for (const i of m.icons) assert.ok(FICHIERS_ICONES.includes(i.src.slice(1)), `${i.src} doit etre genere`);
});

test('pngVersIco : en-tete ICO valide autour d\'un PNG 32x32', async () => {
  const png = await sharp({ create: { width: 32, height: 32, channels: 4, background: '#ff0000' } }).png().toBuffer();
  const ico = pngVersIco([{ taille: 32, png }]);
  assert.equal(ico.readUInt16LE(0), 0);
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 1);
  assert.equal(ico.readUInt8(6), 32);
  assert.equal(ico.readUInt32LE(6 + 8), png.length);
  assert.equal(ico.readUInt32LE(6 + 12), 22);
  assert.ok(ico.subarray(22).equals(png));
});
