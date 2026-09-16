// `ff modele <slug> <nom>` : copie le look d'un modele (presets/<nom>.json) dans sites/<slug>/look.json.
// `ff modeles` : liste les modeles disponibles (titre, direction/hero, metiers, vignette generee ou non).
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SITES_DIR, siteExists, ok, fail, info, c } from './util.mjs';

export const PRESETS_DIR = path.join(ROOT, 'presets');
export const VIGNETTES_DIR = path.join(PRESETS_DIR, 'vignettes');

/** Scanne presets/*.json a la demande (jamais de liste figee en dur). */
export function listPresets() {
  if (!fs.existsSync(PRESETS_DIR)) return [];
  return fs
    .readdirSync(PRESETS_DIR, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.json'))
    .map((d) => {
      const nom = path.basename(d.name, '.json');
      try {
        const preset = JSON.parse(fs.readFileSync(path.join(PRESETS_DIR, d.name), 'utf8'));
        return {
          nom: preset.nom || nom,
          titre: preset.titre || nom,
          description: preset.description || '',
          metiers: Array.isArray(preset.metiers) ? preset.metiers : [],
          look: preset.look || {},
          vignette: fs.existsSync(path.join(VIGNETTES_DIR, `${preset.nom || nom}.webp`)),
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => String(a.nom).localeCompare(String(b.nom)));
}

export function readPreset(nom) {
  const p = path.join(PRESETS_DIR, `${nom}.json`);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

export function cmdModele(args) {
  const [slug, nom] = args;
  if (!slug || !nom) {
    fail('Usage : ff modele <slug> <nom-du-modele>');
    process.exit(1);
  }
  if (!siteExists(slug)) {
    fail(`Site introuvable : sites/${slug}. Lance \`ff nouveau ${slug}\` d'abord.`);
    process.exit(1);
  }
  let preset;
  try {
    preset = readPreset(nom);
  } catch (e) {
    fail(`presets/${nom}.json illisible : ${e.message}`);
    process.exit(1);
  }
  if (!preset) {
    fail(`Modele introuvable : presets/${nom}.json`);
    process.exit(1);
  }
  if (!preset.look) {
    fail(`presets/${nom}.json n'a pas de champ "look".`);
    process.exit(1);
  }

  const lookPath = path.join(SITES_DIR, slug, 'look.json');
  fs.writeFileSync(lookPath, JSON.stringify(preset.look, null, 2) + '\n');
  ok(`sites/${slug}/look.json <- presets/${nom}.json (${preset.titre || nom})`);
}

export function cmdModeles() {
  const presets = listPresets();
  if (presets.length === 0) {
    info('Aucun modele dans presets/*.json.');
    return;
  }
  const width = Math.max(...presets.map((p) => String(p.nom).length), 4) + 2;
  const titreWidth = Math.max(...presets.map((p) => String(p.titre).length), 5) + 2;
  info(`  ${c.bold('nom'.padEnd(width) + 'titre'.padEnd(titreWidth) + 'direction/hero'.padEnd(22) + 'vignette')}`);
  for (const p of presets) {
    const dirHero = `${p.look?.direction || '?'}/${p.look?.layout?.hero || '?'}`;
    info(`  ${String(p.nom).padEnd(width)}${String(p.titre).padEnd(titreWidth)}${dirHero.padEnd(22)}${p.vignette ? 'oui' : 'non'}`);
    if (p.metiers.length) info(`    ${c.dim(p.metiers.join(', '))}`);
  }
}
