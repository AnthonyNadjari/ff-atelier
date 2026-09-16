#!/usr/bin/env node
/**
 * Genere des images de substitution abstraites (pas des photos, pas de texte "placeholder") :
 * degrades doux + grande forme geometrique + bruit subtil, dans les couleurs fournies.
 *
 * Usage : node scripts/placeholders.mjs <slug> <hexA> <hexB>
 * Ecrit dans sites/<slug>/public/images/ :
 *   hero.webp (1600x1200), portrait.webp (1000x1250),
 *   service-1..4.webp (1200x900), galerie-1..6.webp (1200x900),
 *   avant.webp / apres.webp (1200x900, tons visiblement differents)
 * Et sites/<slug>/public/ :
 *   logo.svg (monogramme), favicon.svg (monogramme, 64x64)
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , slug, hexA, hexB] = process.argv;
if (!slug || !hexA || !hexB) {
  console.error('usage: node scripts/placeholders.mjs <slug> <hexA> <hexB>');
  process.exit(1);
}

// ---- couleurs ----
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: s * 100, l: l * 100 };
}
function hslToRgb({ h, s, l }) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}
function mix(hex1, hex2, t) {
  const a = hexToRgb(hex1), b = hexToRgb(hex2);
  return rgbToHex({ r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t });
}
function desaturate(hex, amount) {
  const hsl = rgbToHsl(hexToRgb(hex));
  hsl.s = hsl.s * (1 - amount);
  return rgbToHex(hslToRgb(hsl));
}
function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

// ---- alea deterministe (par nom de fichier) ----
function seedFrom(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

// ---- formes geometriques ----
function shapeSvg(kind, w, h, rand, fill, opacity) {
  const cx = w * (0.25 + rand() * 0.5);
  const cy = h * (0.25 + rand() * 0.5);
  const size = Math.max(w, h) * (0.45 + rand() * 0.3);
  switch (kind) {
    case 'circle':
      return `<circle cx="${cx}" cy="${cy}" r="${size / 2}" fill="${fill}" fill-opacity="${opacity}"/>`;
    case 'ellipse':
      return `<ellipse cx="${cx}" cy="${cy}" rx="${size / 2}" ry="${size / 3}" fill="${fill}" fill-opacity="${opacity}" transform="rotate(${Math.round(rand() * 40 - 20)} ${cx} ${cy})"/>`;
    case 'rect':
      return `<rect x="${cx - size / 2}" y="${cy - size / 2}" width="${size}" height="${size}" rx="${size * 0.12}" fill="${fill}" fill-opacity="${opacity}" transform="rotate(${Math.round(rand() * 30 - 15)} ${cx} ${cy})"/>`;
    case 'triangle': {
      const p1 = `${cx},${cy - size / 2}`;
      const p2 = `${cx - size / 2},${cy + size / 2}`;
      const p3 = `${cx + size / 2},${cy + size / 2}`;
      return `<polygon points="${p1} ${p2} ${p3}" fill="${fill}" fill-opacity="${opacity}" transform="rotate(${Math.round(rand() * 360)} ${cx} ${cy})"/>`;
    }
    case 'blob': {
      const r = size / 2;
      const pts = 6;
      let d = '';
      for (let i = 0; i <= pts; i++) {
        const a = (i / pts) * Math.PI * 2;
        const rr = r * (0.75 + rand() * 0.35);
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr;
        d += i === 0 ? `M ${x} ${y} ` : `L ${x} ${y} `;
      }
      d += 'Z';
      return `<path d="${d}" fill="${fill}" fill-opacity="${opacity}"/>`;
    }
    default:
      return `<circle cx="${cx}" cy="${cy}" r="${size / 2}" fill="${fill}" fill-opacity="${opacity}"/>`;
  }
}

const SHAPES = ['circle', 'ellipse', 'rect', 'triangle', 'blob'];

function gradientDef(id, x1, y1, x2, y2, colorA, colorB) {
  return `<linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%"><stop offset="0%" stop-color="${colorA}"/><stop offset="100%" stop-color="${colorB}"/></linearGradient>`;
}

/** Construit le SVG complet d'une image de fond abstraite. */
function buildBackgroundSvg({ name, w, h, colorA, colorB, mood }) {
  const rand = seedFrom(name);
  const angle = Math.round(rand() * 360);
  const rad = (angle * Math.PI) / 180;
  const x1 = 50 - Math.cos(rad) * 50;
  const y1 = 50 - Math.sin(rad) * 50;
  const x2 = 50 + Math.cos(rad) * 50;
  const y2 = 50 + Math.sin(rad) * 50;

  const shapeCount = 2 + Math.floor(rand() * 2);
  let shapes = '';
  for (let i = 0; i < shapeCount; i++) {
    const kind = SHAPES[Math.floor(rand() * SHAPES.length)];
    const fill = i % 2 === 0 ? mix(colorA, colorB, 0.35 + rand() * 0.3) : mix(colorB, '#ffffff', 0.15 + rand() * 0.2);
    const opacity = (mood === 'muted' ? 0.1 : 0.16) + rand() * 0.1;
    shapes += shapeSvg(kind, w, h, rand, fill, opacity.toFixed(2));
  }

  const noiseFreq = (0.75 + rand() * 0.3).toFixed(2);
  const noiseAlpha = mood === 'muted' ? 0.03 : 0.045;

  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${gradientDef('bg', x1, y1, x2, y2, colorA, colorB)}
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="${noiseFreq}" numOctaves="2" seed="${Math.floor(rand() * 100)}" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${noiseAlpha} 0"/>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  ${shapes}
  <rect width="${w}" height="${h}" filter="url(#grain)"/>
</svg>`;
}

async function renderWebp(svg, w, h, outPath) {
  await sharp(Buffer.from(svg), { density: 144 })
    .resize(w, h)
    .webp({ quality: 84 })
    .toFile(outPath);
}

function monogramSvg({ size, radius, colorBg, colorText, initials, fontSize }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${colorBg}"/><text x="${size / 2}" y="${size / 2 + fontSize * 0.36}" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" fill="${colorText}" text-anchor="middle">${initials}</text></svg>`;
}

function initialsFromSlug(s) {
  const words = s.split('-').filter((w) => w && w !== 'demo');
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return s.slice(0, 2).toUpperCase();
}

async function main() {
  const outDir = resolve('sites', slug, 'public', 'images');
  const publicDir = resolve('sites', slug, 'public');
  mkdirSync(outDir, { recursive: true });

  const jobs = [
    { name: 'hero', w: 1600, h: 1200, mood: 'vivid' },
    { name: 'portrait', w: 1000, h: 1250, mood: 'vivid' },
    { name: 'service-1', w: 1200, h: 900, mood: 'vivid' },
    { name: 'service-2', w: 1200, h: 900, mood: 'vivid' },
    { name: 'service-3', w: 1200, h: 900, mood: 'vivid' },
    { name: 'service-4', w: 1200, h: 900, mood: 'vivid' },
    { name: 'galerie-1', w: 1200, h: 900, mood: 'vivid' },
    { name: 'galerie-2', w: 1200, h: 900, mood: 'vivid' },
    { name: 'galerie-3', w: 1200, h: 900, mood: 'vivid' },
    { name: 'galerie-4', w: 1200, h: 900, mood: 'vivid' },
    { name: 'galerie-5', w: 1200, h: 900, mood: 'vivid' },
    { name: 'galerie-6', w: 1200, h: 900, mood: 'vivid' },
  ];

  for (const job of jobs) {
    const svg = buildBackgroundSvg({ name: `${slug}-${job.name}`, w: job.w, h: job.h, colorA: hexA, colorB: hexB, mood: job.mood });
    await renderWebp(svg, job.w, job.h, resolve(outDir, `${job.name}.webp`));
  }

  // avant / apres : tons visiblement differents (avant = terne/desature, apres = vif)
  const avantA = desaturate(mix(hexA, '#808080', 0.35), 0.5);
  const avantB = desaturate(mix(hexB, '#808080', 0.35), 0.5);
  const avantSvg = buildBackgroundSvg({ name: `${slug}-avant`, w: 1200, h: 900, colorA: avantA, colorB: avantB, mood: 'muted' });
  await renderWebp(avantSvg, 1200, 900, resolve(outDir, 'avant.webp'));

  const apresSvg = buildBackgroundSvg({ name: `${slug}-apres`, w: 1200, h: 900, colorA: hexA, colorB: hexB, mood: 'vivid' });
  await renderWebp(apresSvg, 1200, 900, resolve(outDir, 'apres.webp'));

  // logo.svg + favicon.svg : monogramme simple
  const initials = initialsFromSlug(slug);
  const bgLum = luminance(hexA);
  const textColor = bgLum > 0.55 ? '#1a1a1a' : '#faf9f6';

  const logo = monogramSvg({ size: 160, radius: 28, colorBg: hexA, colorText: textColor, initials, fontSize: 72 });
  writeFileSync(resolve(publicDir, 'logo.svg'), logo);

  const favicon = monogramSvg({ size: 64, radius: 12, colorBg: hexA, colorText: textColor, initials, fontSize: 30 });
  writeFileSync(resolve(publicDir, 'favicon.svg'), favicon);

  console.log(`OK : images generees pour ${slug} (${jobs.length + 2} webp, logo.svg, favicon.svg)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
