// `ff og <slug>` : genere sites/<slug>/public/og.webp (1200x630, image de partage) a partir des
// tokens de la direction (fond, accent) et du contenu du site (nom, metier, ville, telephone).
// Configure ensuite automatiquement images.og dans site.config.ts si le bloc images existe deja.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { SITES_DIR, siteExists, parseArgs, ok, fail, warn, info, c } from './util.mjs';
import { readConfigParts, parseDirectionCss } from './look-data.mjs';
import { extractTopLevelValue, setTopLevelValue } from './ts-literal.mjs';

const W = 1200;
const H = 630;

function escapeXml(s) {
  return String(s ?? '').replace(/[&<>'"]/g, (c2) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&apos;', '"': '&quot;' }[c2]));
}

function pct(v) {
  const s = String(v ?? '').trim();
  if (!s) return '0%';
  return s.endsWith('%') ? s : `${s}%`;
}

function nameFontSize(name) {
  const len = String(name || '').length;
  if (len > 28) return 52;
  if (len > 20) return 62;
  if (len > 14) return 72;
  return 84;
}

function buildSvg({ bg, fg, accent, name, tradeCity, phone }) {
  const fSize = nameFontSize(name);
  const nameY = 300;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${bg}"/>
  <rect x="0" y="0" width="20" height="${H}" fill="${accent}"/>
  <text x="96" y="${nameY}" font-family="Georgia, 'Times New Roman', serif" font-size="${fSize}" font-weight="700" fill="${fg}">${escapeXml(name)}</text>
  ${tradeCity ? `<text x="96" y="${nameY + 56}" font-family="Arial, Helvetica, sans-serif" font-size="32" fill="${accent}">${escapeXml(tradeCity)}</text>` : ''}
  ${phone ? `<text x="96" y="${H - 70}" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="${fg}">${escapeXml(phone)}</text>` : ''}
</svg>`;
}

export async function cmdOg(args) {
  const { positional } = parseArgs(args);
  const slug = positional[0];
  if (!slug) {
    fail('Usage : ff og <slug>');
    process.exit(1);
  }
  if (!siteExists(slug)) {
    fail(`Site introuvable : sites/${slug}. Lance \`ff nouveau ${slug}\` d'abord.`);
    process.exit(1);
  }

  const cfg = readConfigParts(slug);
  const direction = cfg.direction;
  if (!direction) {
    fail(`Impossible de lire la direction de sites/${slug}/site.config.ts.`);
    process.exit(1);
  }
  const css = parseDirectionCss(direction);
  if (!css || !css.bg) {
    fail(`Impossible de lire src/directions/${direction}/index.css (--bg introuvable).`);
    process.exit(1);
  }

  const bg = css.bg;
  const fg = css.fg || '#1a1a1a';
  const accentH = css.accentH || '0';
  const accentS = pct(css.accentS ?? '60%');
  const accentL = pct(css.accentL ?? '45%');
  const accent = `hsl(${accentH}, ${accentS}, ${accentL})`;

  const name = cfg.business?.name || slug;
  const trade = cfg.business?.trade || '';
  const city = cfg.contact?.address?.city || '';
  const tradeCity = [trade, city].filter(Boolean).join(' — ');
  const phone = cfg.contact?.phoneDisplay || cfg.contact?.phone || '';

  const svg = buildSvg({ bg, fg, accent, name, tradeCity, phone });

  const publicDir = path.join(SITES_DIR, slug, 'public');
  fs.mkdirSync(publicDir, { recursive: true });
  const outPath = path.join(publicDir, 'og.webp');
  await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(outPath);
  ok(`Écrit : sites/${slug}/public/og.webp (${W}x${H})`);

  // Configure automatiquement images.og si le bloc images: {...} existe deja dans site.config.ts.
  const currentImages = extractTopLevelValue(cfg.text, 'images');
  if (currentImages === undefined) {
    info('');
    warn(`Bloc "images:" introuvable dans sites/${slug}/site.config.ts.`);
    info(`  Ajoute a la main : ${c.cyan("images: { og: '/og.webp' }")}`);
    process.exit(0);
  }
  if (currentImages.og) {
    info('');
    ok(`images.og deja configure (${currentImages.og}).`);
    process.exit(0);
  }
  const merged = { ...currentImages, og: '/og.webp' };
  const newText = setTopLevelValue(cfg.text, 'images', merged, 'slug');
  const configPath = path.join(SITES_DIR, slug, 'site.config.ts');
  fs.writeFileSync(configPath, newText);
  info('');
  ok(`images.og = '/og.webp' ajoute dans sites/${slug}/site.config.ts.`);
  process.exit(0);
}
