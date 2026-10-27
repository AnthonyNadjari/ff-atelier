// `ff apercu --titre "…" [--phrase "…"] [--date AAAA-MM-JJ] [--hauteur 1300] "Libellé=chemin" "Libellé=chemin" …`
// L'APERÇU DU MEILLEUR d'un tour de veille : une seule image, lisible sur un téléphone, qui montre la meilleure trouvaille
// du tour (un style, une architecture, une animation) à côté de ce que l'usine en fait. Le fondateur la reçoit à la fin
// du tour (SendUserFile + notification) au lieu de lire le journal.
//
// Pourquoi (fondateur, 27 oct 2026) : « avoir un aperçu du meilleur truc de la veille à chaque fois ». Le journal dit tout
// en mots ; un fondateur juge un site en le voyant (docs/GOUT.md § 3 : « montrer en vrai, jamais décrire »).
//
// Entrées : 2 à 4 images (captures de la source, captures de l'usine : téléphone de préférence), chacune avec son
// libellé (« Source : assiseautrement.fr », « Dans l'usine »). Chaque image est mise à la même largeur puis coupée en
// haut à `--hauteur` px (le premier écran et un peu plus : une capture de page entière ne se lit pas en vignette).
// Sortie : docs/veille/apercus/<date>.jpg (versionnée, ~200 Ko : elle reste dans l'historique du journal) et son
// chemin imprimé. Rien n'est inventé : l'image n'assemble que des captures réelles déjà faites par le tour.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ok, fail, parseArgs } from './util.mjs';

export const LARGEUR_COLONNE = 560;
export const MARGE = 24;
export const ENTETE = 150;
export const LEGENDE = 44;

/** Pure : « Libellé=chemin » → { libelle, chemin } ; le premier « = » sépare (un chemin peut en contenir). */
export function lireEntree(s) {
  const i = String(s).indexOf('=');
  if (i <= 0 || i === s.length - 1) return null;
  return { libelle: s.slice(0, i).trim(), chemin: s.slice(i + 1).trim() };
}

/** Pure : positions de n colonnes (largeur fixe, marges) et taille de l'aperçu. */
export function disposerApercu(n, hauteur, largeur = LARGEUR_COLONNE) {
  const colonnes = Array.from({ length: n }, (_, i) => ({ left: MARGE + i * (largeur + MARGE), top: ENTETE + LEGENDE }));
  return { colonnes, width: MARGE + n * (largeur + MARGE), height: ENTETE + LEGENDE + hauteur + MARGE };
}

/** Pure : coupe un texte en lignes d'au plus `max` signes, aux espaces. */
export function couperLignes(texte, max = 70, lignesMax = 2) {
  const mots = String(texte ?? '').split(/\s+/).filter(Boolean);
  const out = [];
  let cur = '';
  for (const m of mots) {
    if ((cur ? `${cur} ${m}` : m).length > max && cur) { out.push(cur); cur = m; } else cur = cur ? `${cur} ${m}` : m;
  }
  if (cur) out.push(cur);
  if (out.length > lignesMax) { out.length = lignesMax; out[lignesMax - 1] = `${out[lignesMax - 1].replace(/[\s,.;:]+$/, '')}…`; }
  return out;
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export async function cmdApercu(args) {
  const { positional, flags } = parseArgs(args);
  const entrees = positional.map(lireEntree);
  if (!flags.titre || entrees.length < 2 || entrees.length > 4 || entrees.some((e) => !e)) {
    fail('Usage : ff apercu --titre "…" [--phrase "…"] [--date AAAA-MM-JJ] [--hauteur 1300] "Libellé=chemin" "Libellé=chemin" (2 à 4 images)');
    process.exit(1);
  }
  for (const e of entrees) {
    const p = path.resolve(ROOT, e.chemin);
    if (!fs.existsSync(p)) { fail(`image introuvable : ${e.chemin}`); process.exit(1); }
    e.chemin = p;
  }
  const { default: sharp } = await import('sharp');
  const hauteur = Number(flags.hauteur) || 1300;
  const date = typeof flags.date === 'string' ? flags.date : new Date().toISOString().slice(0, 10);
  const { colonnes, width, height } = disposerApercu(entrees.length, hauteur);
  const lignes = couperLignes(flags.phrase, Math.round(width / 13), 2);
  const tete = Buffer.from(
    `<svg width="${width}" height="${ENTETE}"><rect width="100%" height="100%" fill="#f4f1ea"/>` +
      `<text x="${MARGE}" y="40" font-size="20" font-family="DejaVu Sans, Arial" fill="#6b655c">Veille du ${esc(date)} : le meilleur du tour</text>` +
      `<text x="${MARGE}" y="80" font-size="32" font-family="DejaVu Sans, Arial" font-weight="bold" fill="#1d1b18">${esc(flags.titre)}</text>` +
      lignes.map((l, i) => `<text x="${MARGE}" y="${112 + i * 26}" font-size="20" font-family="DejaVu Sans, Arial" fill="#3d3a35">${esc(l)}</text>`).join('') +
      `</svg>`,
  );
  const parts = [{ input: tete, left: 0, top: 0 }];
  for (const [i, e] of entrees.entries()) {
    const { left, top } = colonnes[i];
    const img = sharp(e.chemin).resize({ width: LARGEUR_COLONNE });
    const meta = await img.clone().toBuffer({ resolveWithObject: true });
    const h = Math.min(hauteur, meta.info.height);
    const buf = await sharp(meta.data).extract({ left: 0, top: 0, width: LARGEUR_COLONNE, height: h }).toBuffer();
    parts.push({ input: Buffer.from(`<svg width="${LARGEUR_COLONNE}" height="${LEGENDE}"><text x="0" y="30" font-size="20" font-family="DejaVu Sans, Arial" font-weight="bold" fill="#1d1b18">${esc(e.libelle)}</text></svg>`), left, top: top - LEGENDE });
    parts.push({ input: buf, left, top });
  }
  const dossier = path.join(ROOT, 'docs', 'veille', 'apercus');
  fs.mkdirSync(dossier, { recursive: true });
  const sortie = path.join(dossier, `${date}.jpg`);
  await sharp({ create: { width, height, channels: 3, background: '#f4f1ea' } }).composite(parts).jpeg({ quality: 76, mozjpeg: true }).toFile(sortie);
  ok(`aperçu : ${path.relative(ROOT, sortie)} (${Math.round(fs.statSync(sortie).size / 1024)} Ko) : à envoyer au fondateur`);
}
