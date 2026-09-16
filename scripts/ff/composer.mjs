// `ff composer <slug> [--metier "..."] [--graine N] [--ecrire]` : propose un LOOK (direction,
// polices, variantes, echelle, ton, separateur) adapte au metier et a la variete deja utilisee par
// les sites existants. N'ecrit sites/<slug>/look.json que si --ecrire est passe.
import fs from 'node:fs';
import path from 'node:path';
import { SITES_DIR, siteExists, parseArgs, ok, fail, info, c } from './util.mjs';
import {
  mulberry32,
  seedFromString,
  pickLeastUsed,
  rankWithTies,
  listDirectionMetas,
  parseDirectionCss,
  parseFonts,
  primaryFamily,
  parseSchemaConstants,
  readConfigParts,
  usageStats,
} from './look-data.mjs';

// Mots-cles de metier -> directions favorisees (+1), au-dela du croisement direct avec meta.metiers.
const HEURISTIQUES = [
  [['urgence', 'depannage', 'dépannage', 'panne'], ['signal', 'industriel']],
  [['luxe', 'beaute', 'beauté', 'coiffure', 'coiffeur'], ['luxe', 'nuit', 'pierre']],
  [['enfant', 'boulangerie', 'fete', 'fête', 'anniversaire'], ['pop', 'retro']],
  [['jardin', 'bio', 'nature'], ['terre', 'nordique']],
];

const DIVIDER_FITS = [
  ['wave', ['terre', 'pop', 'mediterranee']],
  ['diagonal', ['signal', 'industriel', 'brut']],
  ['curve', ['clair', 'nordique', 'nuit']],
  ['rule', ['journal', 'pierre', 'encre', 'atelier']],
  ['zigzag', ['retro', 'pop']],
  ['none', ['luxe', 'neon']],
];

function normalise(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function scoreDirections(dirMetas, metier, directionCounts) {
  const m = normalise(metier);
  return dirMetas.map((d) => {
    let score = 0;
    const reasons = [];
    const metiers = (d.metiers || []).map(normalise);
    const eviter = (d.eviter || []).map(normalise);
    if (m && metiers.some((x) => x && (m.includes(x) || x.includes(m)))) {
      score += 3;
      reasons.push('métier correspond à cette direction');
    }
    const evite = m && eviter.find((x) => x && m.includes(x));
    if (evite) {
      score -= 5;
      reasons.push(`à éviter pour ce métier ("${evite}")`);
    }
    for (const [triggers, targets] of HEURISTIQUES) {
      if (!targets.includes(d.dir)) continue;
      const hit = triggers.find((t) => m.includes(normalise(t)));
      if (hit) {
        score += 1;
        reasons.push(`mot-clé "${hit}" oriente vers cette direction`);
      }
    }
    const n = directionCounts.get(d.dir) || 0;
    if (n > 0) {
      score -= 2 * n;
      reasons.push(`déjà utilisée ${n} fois parmi les sites existants (-${2 * n})`);
    }
    return { ...d, score, reasons };
  });
}

function pickDivider(dir) {
  for (const [name, dirs] of DIVIDER_FITS) if (dirs.includes(dir)) return name;
  return 'none';
}

function pickScale(dir, tagline) {
  if (['luxe', 'pierre', 'encre'].includes(dir)) return 'display';
  if (['signal', 'industriel'].includes(dir)) return 'compact';
  const plain = String(tagline || '').replace(/<[^>]+>/g, '');
  if (plain && plain.length <= 30) return 'display';
  return 'normal';
}

function detectSections(cfg) {
  const types = [{ type: 'services' }, { type: 'about' }];
  const proof = cfg.proof || {};
  let proofVariant = null;
  if (proof.google && proof.google.rating !== undefined) proofVariant = 'google';
  else if (Array.isArray(proof.testimonials) && proof.testimonials.length > 0) proofVariant = 'testimonials';
  else if (Array.isArray(proof.gallery) && proof.gallery.length > 0) proofVariant = 'gallery';
  else if (Array.isArray(proof.beforeAfter) && proof.beforeAfter.length > 0) proofVariant = 'before-after';
  if (proofVariant) types.push({ type: 'proof', forcedVariant: proofVariant });
  if (Array.isArray(cfg.zones?.cities) && cfg.zones.cities.length > 0) types.push({ type: 'zones' });
  if (Array.isArray(cfg.process) && cfg.process.length > 0) types.push({ type: 'process' });
  if (Array.isArray(cfg.faq) && cfg.faq.length > 0) types.push({ type: 'faq' });
  types.push({ type: 'cta' }, { type: 'contact' });
  return types;
}

function pickFontPair(displayCandidates, bodyCandidates, usedPairs, rng) {
  for (let i = 0; i < 60; i++) {
    const d = displayCandidates[Math.floor(rng() * displayCandidates.length)];
    const b = bodyCandidates[Math.floor(rng() * bodyCandidates.length)];
    if (d && b && d !== b && !usedPairs.has(`${d}|${b}`)) return { display: d, body: b };
  }
  for (const d of displayCandidates) {
    for (const b of bodyCandidates) {
      if (d !== b && !usedPairs.has(`${d}|${b}`)) return { display: d, body: b };
    }
  }
  return { display: displayCandidates[0], body: bodyCandidates[0] };
}

/**
 * Calcule une proposition de look pour `slug`, sans rien ecrire. N'accede en lecture qu'a
 * src/directions/*, src/lib/fonts.ts, src/lib/schema.ts et sites/*.
 * opts: { metier, graine, excludeDirections, excludeHeroes }
 */
export function pickLook(slug, opts = {}) {
  const { metier, graine = 1, excludeDirections = [], excludeHeroes = [] } = opts;
  const seed = typeof graine === 'number' && !Number.isNaN(graine) ? graine >>> 0 : seedFromString(graine ?? slug);
  const rng = mulberry32(seed);

  const { VARIANTS } = parseSchemaConstants();
  const dirMetas = listDirectionMetas();
  if (dirMetas.length === 0) {
    throw new Error('Aucune direction avec meta.ts trouvee dans src/directions/.');
  }

  const cfg = readConfigParts(slug) || {
    business: {},
    contact: {},
    zones: {},
    proof: {},
    faq: [],
    process: [],
    layout: {},
  };
  const metierFinal = metier || cfg.business?.trade || '';
  const usage = usageStats(slug);

  const scored = scoreDirections(dirMetas, metierFinal, usage.directionCounts).filter(
    (d) => !excludeDirections.includes(d.dir),
  );
  const pool = scored.length > 0 ? scored : scoreDirections(dirMetas, metierFinal, usage.directionCounts);
  const ranked = rankWithTies(pool, (d) => d.score, rng);
  const chosen = ranked[0];

  // Hero : evite les combinaisons direction+hero deja utilisees, sinon les heros deja forces (propositions).
  let heroCandidates = VARIANTS.hero.filter(
    (h) => !excludeHeroes.includes(h) && !usage.dirHeroUsed.has(`${chosen.dir}|${h}`),
  );
  if (heroCandidates.length === 0) heroCandidates = VARIANTS.hero.filter((h) => !excludeHeroes.includes(h));
  if (heroCandidates.length === 0) heroCandidates = [...VARIANTS.hero];
  const heroCounts = usage.variantCounts.hero || new Map();
  const hero = pickLeastUsed(heroCandidates, heroCounts, rng);

  const nav = pickLeastUsed(VARIANTS.nav, usage.variantCounts.nav || new Map(), rng);
  const footer = pickLeastUsed(VARIANTS.footer, usage.variantCounts.footer || new Map(), rng);

  const sectionDefs = detectSections(cfg);
  const sections = sectionDefs.map(({ type, forcedVariant }) => {
    const variant = forcedVariant || pickLeastUsed(VARIANTS[type] || [], usage.variantCounts[type] || new Map(), rng);
    return { type, variant };
  });

  // Polices : paire differente de la police par defaut de la direction, evite les paires deja utilisees.
  const fonts = parseFonts();
  const dirCss = parseDirectionCss(chosen.dir) || {};
  const dirDisplayName = primaryFamily(dirCss.fontDisplay);
  const dirBodyName = primaryFamily(dirCss.fontBody);
  const dirDisplayKey = fonts.find((f) => primaryFamily(f.family) === dirDisplayName)?.key;
  const dirBodyKey = fonts.find((f) => primaryFamily(f.family) === dirBodyName)?.key;
  let displayCandidates = fonts.filter((f) => (f.role === 'display' || f.role === 'both') && f.key !== dirDisplayKey).map((f) => f.key);
  let bodyCandidates = fonts.filter((f) => (f.role === 'body' || f.role === 'both') && f.key !== dirBodyKey).map((f) => f.key);
  if (displayCandidates.length === 0) displayCandidates = fonts.filter((f) => f.role === 'display' || f.role === 'both').map((f) => f.key);
  if (bodyCandidates.length === 0) bodyCandidates = fonts.filter((f) => f.role === 'body' || f.role === 'both').map((f) => f.key);
  const fontPair = pickFontPair(displayCandidates, bodyCandidates, usage.typoPairsUsed, rng);

  const scale = pickScale(chosen.dir, cfg.business?.tagline);
  const tone = rng() < 0.5 ? 'alternate' : 'flat';
  const divider = pickDivider(chosen.dir);
  const motion = chosen.motionParDefaut || 'subtle';

  const look = {
    direction: chosen.dir,
    motion,
    scale,
    typography: { display: fontPair.display, body: fontPair.body },
    layout: { nav, hero, sections, footer, divider, tone },
  };

  const justification = [
    ['direction', chosen.dir, chosen.reasons.length ? chosen.reasons.join(' ; ') : 'meilleur score par defaut'],
    ['nav', nav, `variante la moins utilisee (${nav} : ${(usage.variantCounts.nav || new Map()).get(nav) || 0} fois)`],
    ['hero', hero, `variante la moins utilisee pour "${chosen.dir}" (${hero} : ${heroCounts.get(hero) || 0} fois)`],
    ...sections.map((s) => [
      s.type,
      s.variant,
      sectionDefs.find((d) => d.type === s.type)?.forcedVariant
        ? 'variante imposee par le type de preuve disponible'
        : `variante la moins utilisee (${(usage.variantCounts[s.type] || new Map()).get(s.variant) || 0} fois)`,
    ]),
    ['footer', footer, `variante la moins utilisee (${footer} : ${(usage.variantCounts.footer || new Map()).get(footer) || 0} fois)`],
    ['typographie', `${fontPair.display} / ${fontPair.body}`, `différente de la police par défaut de "${chosen.dir}", paire inédite`],
    ['echelle', scale, `d'après la direction "${chosen.dir}"${cfg.business?.tagline ? ' et la longueur de l’accroche' : ''}`],
    ['ton', tone, 'alterné 50 % (fond bg-2 une section sur deux)'],
    ['separateur', divider, `adapté à la direction "${chosen.dir}"`],
    ['mouvement', motion, `motionParDefaut de la direction "${chosen.dir}"`],
  ];

  return { slug, direction: chosen.dir, dirMeta: chosen, look, justification, metier: metierFinal };
}

function printProposal(slug, result) {
  info(c.bold(`Proposition de look pour ${slug}`) + (result.metier ? c.dim(`  (métier : ${result.metier})`) : ''));
  info('');
  const width1 = Math.max(...result.justification.map((r) => r[0].length)) + 2;
  const width2 = Math.max(...result.justification.map((r) => String(r[1]).length)) + 2;
  for (const [k, v, why] of result.justification) {
    info(`  ${c.cyan(String(k).padEnd(width1))} ${String(v).padEnd(width2)} ${c.dim(why)}`);
  }
  info('');
  info(JSON.stringify(result.look, null, 2));
}

export function cmdComposer(args) {
  const { positional, flags } = parseArgs(args);
  const slug = positional[0];
  if (!slug) {
    fail('Usage : ff composer <slug> [--metier "..."] [--graine N] [--ecrire]');
    process.exit(1);
  }
  if (!siteExists(slug)) {
    fail(`Site introuvable : sites/${slug}. Lance \`ff nouveau ${slug}\` d'abord.`);
    process.exit(1);
  }
  const graine = flags.graine !== undefined ? Number(flags.graine) : 1;

  let result;
  try {
    result = pickLook(slug, { metier: flags.metier, graine });
  } catch (e) {
    fail(e.message);
    process.exit(1);
  }

  printProposal(slug, result);

  if (flags.ecrire) {
    const dest = path.join(SITES_DIR, slug, 'look.json');
    fs.writeFileSync(dest, JSON.stringify(result.look, null, 2) + '\n');
    info('');
    ok(`Écrit : sites/${slug}/look.json`);
  }
  process.exit(0);
}
