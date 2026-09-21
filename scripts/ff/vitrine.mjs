// `ff vitrine` : (re)genere les vignettes de la galerie du site Finck & Fisch a partir des captures
// plein-page de captures/<slug>-desktop.png, et met a jour sites/finck-fisch/vitrine.json.
//
// Le choix du cadrage est le coeur du script. Un simple « haut de la page » donne une vignette de
// nav + titre : sur un site au hero typographique, ca ne montre RIEN du travail (reproche du
// fondateur le 18 sept 2026 : « sur les sites en vitrine y'a aucune image, ca rend pas top »). On
// balaie donc la hauteur de la capture par pas de 120 px et on garde la fenetre 14:9 la plus
// « riche » : score = entropie de l'image (matiere, photo, contraste) moins une penalite pour les
// grandes plages uniformes. La nav collante est ignoree (on demarre sous 80 px) et on s'arrete a
// 60 % de la page (au-dela : pied de page, mentions legales).
//
// Sortie par site : <slug>.webp (1400 de large, = la capture desktop, jamais agrandie) et
// <slug>-700.webp, dans sites/finck-fisch/public/images/sites/. `ff images finck-fisch` n'y touche
// pas (deja optimisees). 1400/700 et non 960/480 depuis le 20 sept 2026 : une vignette de 384 px sur
// un ecran @2x demande 768 px, un tiers de 390 px @3x en demande 550 — le srcset/sizes correspondant
// est dans sites/finck-fisch/sections/Realisations.astro (a garder aligne avec LARGEUR/LARGEUR_PETITE).
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ok, fail, info, warn, parseArgs } from './util.mjs';

const VITRINE = path.join(ROOT, 'sites', 'finck-fisch');
const SORTIE = path.join(VITRINE, 'public', 'images', 'sites');
const LARGEUR = 1400;
const LARGEUR_PETITE = 700;
const RATIO = 14 / 9;

/**
 * Cherche le cadrage 14:9 le plus « matiere » (photo, aplat colore, degrade) plutot que le plus
 * charge en texte : un bloc de paragraphes a une entropie tres elevee mais ne montre rien du travail
 * en vignette. Methode : on reduit la capture UNE fois a 240 px de large et on la floute — le texte
 * fond en gris uniforme, une photo garde sa variance. On balaie ensuite cette miniature en memoire
 * (rapide : quelques dizaines de fenetres de ~154x99 px), score = variance + saturation moyenne.
 */
async function meilleurCadrage(sharp, fichier) {
  const meta = await sharp(fichier).metadata();
  const hauteurFenetre = Math.round(meta.width / RATIO);
  const PETIT = 240;
  const echelle = PETIT / meta.width;
  const petitH = Math.round(meta.height * echelle);
  const fenetrePetite = Math.max(8, Math.round(hauteurFenetre * echelle));
  const { data, info } = await sharp(fichier)
    .resize(PETIT, petitH)
    .blur(4)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const canaux = info.channels;

  const scoreA = (top) => {
    let n = 0;
    let sr = 0; let sg = 0; let sb = 0;
    let qr = 0; let qg = 0; let qb = 0;
    const fin = Math.min(petitH, top + fenetrePetite);
    for (let y = top; y < fin; y += 2) {
      for (let x = 0; x < PETIT; x += 2) {
        const i = (y * PETIT + x) * canaux;
        const r = data[i]; const g = data[i + 1]; const b = data[i + 2];
        sr += r; sg += g; sb += b;
        qr += r * r; qg += g * g; qb += b * b;
        n += 1;
      }
    }
    if (n === 0) return -Infinity;
    const mr = sr / n; const mg = sg / n; const mb = sb / n;
    const ec = (Math.sqrt(Math.max(0, qr / n - mr * mr)) + Math.sqrt(Math.max(0, qg / n - mg * mg)) + Math.sqrt(Math.max(0, qb / n - mb * mb))) / 3;
    const saturation = (Math.max(mr, mg, mb) - Math.min(mr, mg, mb)) / 255;
    return ec / 8 + saturation * 4;
  };

  const hautMin = Math.round(80 * echelle);
  const hautMax = Math.max(hautMin, Math.min(petitH - fenetrePetite, Math.round(petitH * 0.6)));
  let best = { top: hautMin, score: -Infinity };
  for (let top = hautMin; top <= hautMax; top += 8) {
    const sc = scoreA(top);
    if (sc > best.score) best = { top, score: sc };
  }
  const topReel = Math.min(Math.max(0, Math.round(best.top / echelle)), Math.max(0, meta.height - hauteurFenetre));
  return { left: 0, top: topReel, width: meta.width, height: hauteurFenetre, score: best.score };
}

export async function cmdVitrine(args) {
  const { positional, flags } = parseArgs(args);
  let sharp;
  try {
    ({ default: sharp } = await import('sharp'));
  } catch (e) {
    fail(`sharp indisponible : ${e.message}`);
    process.exit(1);
  }

  const jsonPath = path.join(VITRINE, 'vitrine.json');
  if (!fs.existsSync(jsonPath)) {
    fail(`${path.relative(ROOT, jsonPath)} introuvable.`);
    process.exit(1);
  }
  const entrees = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const voulus = positional.length ? positional : entrees.map((e) => e.slug);
  fs.mkdirSync(SORTIE, { recursive: true });

  let faites = 0;
  let manquantes = 0;
  for (const entree of entrees) {
    if (!voulus.includes(entree.slug)) continue;
    const capture = path.join(ROOT, 'captures', `${entree.slug}-desktop.png`);
    if (!fs.existsSync(capture)) {
      warn(`${entree.slug} : pas de capture (lance \`ff captures ${entree.slug}\`).`);
      manquantes += 1;
      continue;
    }
    // Par defaut : le premier ecran. Une vignette doit se LIRE comme un site (nav + titre + debut de
    // page) ; un cadrage pris au milieu de la page donne un fragment qu'on ne rattache a rien, meme
    // quand il contient plus de matiere (essaye le 18 sept 2026, rendu pire). `--matiere` garde la
    // recherche automatique du passage le plus photographique, utile pour un site dont le premier
    // ecran est volontairement vide.
    const cadre = flags.matiere
      ? await meilleurCadrage(sharp, capture)
      : await (async () => {
          const m = await sharp(capture).metadata();
          return { left: 0, top: 0, width: m.width, height: Math.round(m.width / RATIO) };
        })();

    const base = sharp(capture).extract(cadre);
    await base.clone().resize({ width: LARGEUR, withoutEnlargement: true }).webp({ quality: 74 }).toFile(path.join(SORTIE, `${entree.slug}.webp`));
    await base.clone().resize({ width: LARGEUR_PETITE, withoutEnlargement: true }).webp({ quality: 72 }).toFile(path.join(SORTIE, `${entree.slug}-${LARGEUR_PETITE}.webp`));
    info(`${entree.slug} : cadrage a ${cadre.top}px${cadre.score ? ` (matiere ${cadre.score.toFixed(2)})` : ' (premier ecran)'}`);
    faites += 1;
  }

  if (faites === 0) {
    fail('Aucune vignette generee.');
    process.exit(1);
  }
  ok(`${faites} vignette(s) ecrites dans ${path.relative(ROOT, SORTIE)}${manquantes ? ` (${manquantes} capture(s) manquante(s))` : ''}.`);
  info('Rebuild ensuite : node scripts/ff.mjs build finck-fisch');
}
