// `ff modele <slug> <nom>` : copie le look d'un modele (presets/<nom>.json) dans sites/<slug>/look.json, apres avoir
// verifie que le site a les donnees que le hero du modele demande (exigenceHero : memes regles que HERO_DE_FAMILLE de
// scripts/ff/melanger.mjs et varianteCompatible de scripts/ff/composer.mjs). Une donnee absente = avertissement clair
// (« le modele demande images.hero >= 1 600 px : absent, hero remplace par typographic ») et le hero `typographic`
// (seul hero sans exigence) a sa place ; rien n'est invente. Depuis le 29 oct 2026 (veille § 2a quater : un style = un
// site entier, `presets/<direction>.json` pose tout d'un coup).
// `ff modeles` : liste les modeles disponibles (titre, direction/hero, metiers, vignette generee ou non).
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SITES_DIR, siteExists, ok, fail, info, warn, c } from './util.mjs';
import { profilClient, donneesDuSite, LARGEUR_PLEIN_CADRE } from './melanger.mjs';
import { varianteCompatible } from './composer.mjs';

export const PRESETS_DIR = path.join(ROOT, 'presets');
export const VIGNETTES_DIR = path.join(PRESETS_DIR, 'vignettes');
/** Hero de repli quand les donnees du hero du modele manquent : le seul sans exigence (ni photo, ni avis, ni horaires). */
export const HERO_DE_REPLI = 'typographic';

/**
 * Ce que chaque hero demande au site (client = profilClient() nourri par donneesDuSite). Vrai si c'est la, sinon la
 * donnee manquante en mots. Un hero absent de la table : aucune exigence connue ici (varianteCompatible tranche).
 */
export const EXIGENCES_HERO = {
  split: (c) => c.couverture || 'images.hero',
  fullbleed: (c) => c.couverture || 'images.hero',
  stacked: (c) => c.couverture || 'images.hero',
  video: (c) => Boolean(c.video) || 'une vraie video (images.video)',
  'carte-sur-photo': (c) => (c.couverture && c.largeurMax >= LARGEUR_PLEIN_CADRE) || `images.hero ≥ ${LARGEUR_PLEIN_CADRE} px`,
  mosaique: (c) => c.photosSite >= 4 || '4 photos declarees (couverture, portrait, galerie, services)',
  'mur-de-photos': (c) => c.photosSite >= 4 || '4 photos declarees (couverture, portrait, galerie, services)',
  'numero-geant': (c) => c.urgence || 'contact.emergency24h',
  'preuve-d-abord': (c) => (c.avis > 0 && c.temoignages >= 2) || 'proof.google et deux proof.testimonials',
  'plan-et-lieu': (c) => (c.adresse && c.horaires > 0) || 'contact.address.street et contact.hours',
};

/**
 * Pure : ce qui manque au site pour le hero `hero`, ou null si rien ne manque. `compatible` (booleen ou null) est le
 * verdict de varianteCompatible('hero', hero, cfg) pour les heros que la table ne connait pas (ceux des autres styles).
 */
export function exigenceHero(hero, client = profilClient(), compatible = null) {
  if (!hero || hero === HERO_DE_REPLI || String(hero).startsWith('custom/')) return null;
  const f = EXIGENCES_HERO[hero];
  if (f) { const r = f(client); return r === true ? null : r; }
  return compatible === false ? `ses donnees (ff composer, varianteCompatible : hero/${hero})` : null;
}

/**
 * Pure : le look d'un modele apres verification du hero : si une donnee manque, hero remplace par `typographic` et
 * l'avertissement en mots ; sinon le look tel quel et avertissement null. Jamais de donnee inventee.
 */
export function lookAvecHeroVerifie(look, client = profilClient(), compatible = null) {
  const hero = look?.layout?.hero;
  const manque = exigenceHero(hero, client, compatible);
  if (!manque) return { look, avertissement: null };
  return {
    look: { ...look, layout: { ...(look.layout || {}), hero: HERO_DE_REPLI } },
    avertissement: `le modele demande ${manque} : absent, hero ${hero} remplace par ${HERO_DE_REPLI}`,
  };
}

/** Plus grande largeur des images du site (manifeste images.json de ff images), 0 sans manifeste. */
export function largeurMaxDuSite(dir) {
  const manifeste = path.join(dir, 'images.json');
  if (!fs.existsSync(manifeste)) return 0;
  try {
    let max = 0;
    for (const e of Object.values(JSON.parse(fs.readFileSync(manifeste, 'utf8')))) max = Math.max(max, ...(e.widths || [0]));
    return max;
  } catch { return 0; }
}

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

/** Le site tel que defineSite le rend (ts-loader), ou null avec la raison : le controle du hero s'en passe en le disant. */
async function lireSite(slug) {
  const T = await import('./ts-loader.mjs');
  try {
    return { site: (await T.loadSiteConfigModule(slug)).default, erreur: null };
  } catch (err) {
    return { site: null, erreur: err.message.split('\n')[0] };
  } finally { T.cleanTmp(); }
}

export async function cmdModele(args) {
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

  // Les donnees que le hero du modele demande sont-elles la ? (memes regles que ff melanger / ff composer)
  let look = preset.look;
  const { site, erreur } = await lireSite(slug);
  if (site) {
    const client = profilClient({ largeurMax: largeurMaxDuSite(path.join(SITES_DIR, slug)), ...donneesDuSite(site) });
    const hero = look.layout?.hero;
    const compatible = hero && !EXIGENCES_HERO[hero] ? varianteCompatible('hero', hero, site) : null;
    const verif = lookAvecHeroVerifie(look, client, compatible);
    look = verif.look;
    if (verif.avertissement) warn(verif.avertissement);
    else if (hero) info(`hero ${hero} : les donnees du site sont la.`);
  } else {
    warn(`site.config.ts illisible (${erreur}) : donnees du hero non verifiees.`);
  }

  const lookPath = path.join(SITES_DIR, slug, 'look.json');
  fs.writeFileSync(lookPath, JSON.stringify(look, null, 2) + '\n');
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
    const entier = p.look?.direction === p.nom ? ' (site entier)' : '';
    info(`  ${String(p.nom).padEnd(width)}${String(p.titre).padEnd(titreWidth)}${dirHero.padEnd(22)}${p.vignette ? 'oui' : 'non'}${entier}`);
    if (p.metiers.length) info(`    ${c.dim(p.metiers.join(', '))}`);
  }
}
