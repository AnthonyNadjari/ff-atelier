// `ff composer <slug> [--metier "..."] [--graine N] [--ecrire]` : propose un LOOK (direction,
// polices, variantes, echelle, ton, separateur) adapte au metier et a la variete deja utilisee par
// les sites existants. N'ecrit sites/<slug>/look.json que si --ecrire est passe.
import fs from 'node:fs';
import path from 'node:path';
import { SITES_DIR, siteExists, parseArgs, ok, fail, warn, info, c } from './util.mjs';
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

// Poids de base (points sur 100) pour le tirage pondere de layout.shell / layout.headings.
const SHELL_WEIGHTS = { flow: 30, split: 15, sidebar: 12, slides: 12, magazine: 16, 'sticky-hero': 15 };
const HEADINGS_WEIGHTS = { auto: 60, center: 25, left: 15 };

/** Une coquille convient-elle au contexte (nav/hero/echelle/mouvement/nombre de sections) ? `flow` convient toujours. */
// Coquille `index` (le menu est la page, docs/veille/squelettes.md § 3b n°1) : reservee aux metiers
// de portfolio, ou le visiteur vient VOIR des pieces — pas a un plombier qu'on appelle en urgence.
const METIERS_INDEX = ['photograph', 'artiste', 'architect', 'tatou', 'illustrat', 'galerie', 'design', 'decorat', 'ceramist', 'ebenist', 'sculpt', 'peintre'];

function shellFits(shell, { sectionsCount, motion, nav, hero, scale, metier = '' }) {
  if (shell === 'index') {
    const m = String(metier).toLowerCase();
    return sectionsCount <= 8 && METIERS_INDEX.some((k) => m.includes(k));
  }
  if (shell === 'slides') return sectionsCount <= 6 && motion !== 'rich';
  if (shell === 'sticky-hero') return ['fullbleed', 'typographic', 'video'].includes(hero);
  if (shell === 'split' || shell === 'sidebar') return nav !== 'floating';
  if (shell === 'magazine') return scale !== 'compact';
  return true;
}

/**
 * Table des squelettes conseilles par famille de metier (docs/veille/squelettes.md § 3a, croisee avec
 * les 20 sites re-squelettes a la main par le fondateur : sites/anna-vidal, moteur-fils/ampere-fils,
 * osteo-marchand/veto-du-drac, atelier-lecerf, cantine-roulante, auto-ecole-rabelais, barbier-kessler,
 * maison-roux, dubois-plomberie, toits-cie, lemaire-avocats, forge-delacroix, jardins-mael,
 * studio-ambre, chez-malo, maison-aurore). `ff composer` choisissait jusqu'ici une AMBIANCE (direction)
 * mais laissait la coquille au tirage pondere generique — un plombier pouvait retomber sur `flow` sans
 * tiroir, un ostéopathe sur `magazine`. Chaque famille impose desormais une coquille (parmi deux, la
 * seconde servant de repli au malus de reutilisation ci-dessous), et pour certaines : la nav, le
 * `contactDrawer`, le mouvement, ou la variante `process` conseillee.
 */
const SQUELETTES_PAR_METIER = [
  {
    id: 'portfolio',
    metiers: ['photograph', 'tatou', 'chambre', 'artiste', 'galerie', 'portfolio'],
    shells: ['index', 'sticky-hero'],
    nav: null,
    contactDrawer: false,
    processVariant: null,
    motion: null,
    label: "métier portfolio → l'accueil devient l'index (le menu est la page)",
  },
  {
    id: 'urgence',
    metiers: ['plomb', 'couvreur', 'couverture', 'serrurier', 'electricien', 'depannage', 'chauffagiste', 'urgence'],
    shells: ['flow', 'split'],
    nav: 'bar',
    contactDrawer: true,
    processVariant: null,
    motion: null,
    label: 'métier urgence → contact en tiroir, nav bar',
  },
  {
    id: 'sante',
    metiers: ['osteo', 'veto', 'veterinaire', 'dentist', 'avocat', 'notaire', 'medecin', 'kine'],
    shells: ['slides', 'sidebar'],
    nav: null,
    contactDrawer: false,
    processVariant: null,
    motion: 'subtle',
    label: 'métier réglementé → sobriété (slides/sidebar), mouvement discret',
  },
  {
    id: 'atelier',
    metiers: ['menuisier', 'ebenist', 'forge', 'ferronni', 'auto-ecole', 'auto ecole', 'traiteur'],
    shells: ['flow', 'sidebar'],
    nav: null,
    contactDrawer: false,
    processVariant: 'horizon',
    motion: null,
    label: 'métier avec étapes → chapitre horizontal du savoir-faire (process/horizon)',
  },
  {
    id: 'hospitalite',
    metiers: ['restaurant', 'hotel', 'institut', 'spa', 'beaute', 'coiffure', 'boulanger'],
    shells: ['sticky-hero', 'index'],
    nav: null,
    contactDrawer: false,
    processVariant: null,
    motion: null,
    label: 'métier accueil/plaisir → hero épinglé immersif (sticky-hero)',
  },
  {
    id: 'creation',
    metiers: ['architect', 'paysagist', 'decorat', 'design'],
    shells: ['magazine', 'split'],
    nav: null,
    contactDrawer: false,
    processVariant: null,
    motion: null,
    label: 'métier création/espace → mise en page éditoriale (magazine)',
  },
];

/**
 * Choisit le squelette conseillé pour `metier`, sans accéder au contexte du site (pur, testé
 * directement, comme `scoreDirections`). Retourne `null` si aucune famille ne reconnaît ce métier — le
 * reste de `pickLook` garde alors son tirage pondéré générique, inchangé.
 *
 * Malus de réutilisation : si la coquille préférée de la famille est déjà portée par >= 3 sites
 * existants (`shellCounts`), bascule sur la seconde coquille de la famille — jamais un troisième choix
 * inventé, chaque famille n'en propose que deux (voir SQUELETTES_PAR_METIER ci-dessus).
 */
export function pickSquelette(metier, { shellCounts = new Map(), stepsCount = 0 } = {}) {
  const m = normalise(metier);
  if (!m) return null;
  const famille = SQUELETTES_PAR_METIER.find((f) => f.metiers.some((k) => m.includes(normalise(k))));
  if (!famille) return null;

  const [prefere, repli] = famille.shells;
  const usageCount = shellCounts.get(prefere) || 0;
  const reutilise = usageCount >= 3;
  const shell = reutilise ? repli : prefere;
  const alternative = reutilise ? prefere : repli;
  const processVariant = famille.processVariant === 'horizon' && stepsCount >= 3 ? 'horizon' : null;
  const reason = reutilise
    ? `${famille.label} (mais "${prefere}" déjà porté par ${usageCount} sites → repli sur "${repli}")`
    : famille.label;

  return {
    familyId: famille.id,
    shell,
    alternative,
    nav: famille.nav,
    contactDrawer: famille.contactDrawer,
    motion: famille.motion,
    processVariant,
    reason,
  };
}

/**
 * Même logique d'adéquation que `shellFits`, sauf pour `index` : la famille a déjà validé le métier
 * (ex. « chambres d'hôtes » n'est pas dans METIERS_INDEX mais figure dans la famille "portfolio").
 */
function squeletteShellCompatible(shell, ctx) {
  if (shell === 'index') return ctx.sectionsCount <= 8;
  return shellFits(shell, ctx);
}

/** Tirage pondere deterministe (rng) parmi `weighted` : [{ key, weight }], weight > 0. */
function pickWeighted(rng, weighted) {
  const total = weighted.reduce((sum, w) => sum + w.weight, 0);
  if (total <= 0) return weighted[0]?.key;
  let r = rng() * total;
  for (const w of weighted) {
    if (r < w.weight) return w.key;
    r -= w.weight;
  }
  return weighted[weighted.length - 1].key;
}

function normalise(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export function scoreDirections(dirMetas, metier, directionCounts) {
  const m = normalise(metier);
  return dirMetas.map((d) => {
    let score = 0;
    const reasons = [];
    const metiers = (d.metiers || []).map(normalise);
    const eviter = (d.eviter || []).map(normalise);
    const metierMatch = Boolean(m && metiers.some((x) => x && (m.includes(x) || x.includes(m))));
    if (metierMatch) {
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
    return { ...d, score, reasons, metierMatch, eviterMatch: Boolean(evite) };
  });
}

/**
 * Palier d'une direction pour un metier donne : 0 = adaptee (metier reconnu et pas "a eviter"),
 * 1 = neutre (ni l'un ni l'autre — aucune donnee sur ce metier dans meta.ts), 2 = a eviter
 * explicitement. Le palier prime TOUJOURS sur le score (donc sur le malus de variete "-2*n
 * deja utilisee") : une direction adaptee ne peut jamais finir derriere une direction hors sujet,
 * quel que soit le nombre de fois qu'elle a deja servi. Voir docs/veille/repetition-generale.md,
 * friction #3 (fleuriste -> industriel/neon sans avertissement).
 */
export function directionTier(d) {
  if (d.eviterMatch) return 2;
  if (d.metierMatch) return 0;
  return 1;
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

  const { VARIANTS, SHELLS, HEADINGS } = parseSchemaConstants();
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
  const stepsCount = Array.isArray(cfg.process) ? cfg.process.length : 0;
  const squelette = pickSquelette(metierFinal, { shellCounts: usage.shellCounts || new Map(), stepsCount });

  const scored = scoreDirections(dirMetas, metierFinal, usage.directionCounts).filter(
    (d) => !excludeDirections.includes(d.dir),
  );
  const pool = scored.length > 0 ? scored : scoreDirections(dirMetas, metierFinal, usage.directionCounts);
  // Palier d'abord (directionTier), score ensuite : voir directionTier ci-dessus. rankWithTies ne
  // compare que par score, donc le palier est injecte comme composante dominante (poids 1000, bien
  // au-dela de tout score possible ici) plutot que par un second critere de tri separe — garde le
  // depart des ex-aequo par rng existant intact au sein d'un meme palier.
  const ranked = rankWithTies(pool, (d) => d.score - directionTier(d) * 1000, rng);
  const chosen = ranked[0];
  const top3 = ranked.slice(0, 3);
  const metierAdapte = directionTier(chosen) === 0;

  // Hero : evite les combinaisons direction+hero deja utilisees, sinon les heros deja forces (propositions).
  let heroCandidates = VARIANTS.hero.filter(
    (h) => !excludeHeroes.includes(h) && !usage.dirHeroUsed.has(`${chosen.dir}|${h}`),
  );
  if (heroCandidates.length === 0) heroCandidates = VARIANTS.hero.filter((h) => !excludeHeroes.includes(h));
  if (heroCandidates.length === 0) heroCandidates = [...VARIANTS.hero];
  const heroCounts = usage.variantCounts.hero || new Map();
  const hero = pickLeastUsed(heroCandidates, heroCounts, rng);

  let nav = pickLeastUsed(VARIANTS.nav, usage.variantCounts.nav || new Map(), rng);
  if (squelette?.nav) nav = squelette.nav;
  const footer = pickLeastUsed(VARIANTS.footer, usage.variantCounts.footer || new Map(), rng);

  const sectionDefs = detectSections(cfg);
  const sections = sectionDefs.map(({ type, forcedVariant }) => {
    if (type === 'process' && squelette?.processVariant) return { type, variant: squelette.processVariant };
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
  let motion = chosen.motionParDefaut || 'subtle';
  if (squelette?.motion) motion = squelette.motion;

  // Coquille (layout.shell) : tirage pondere parmi les coquilles compatibles avec le contexte deja
  // choisi (nav, hero, echelle, mouvement, nombre de sections), penalise de -1 point par usage
  // existant (meme logique que les directions, en moins agressif). Remplacee par le choix de la famille
  // de metier (SQUELETTES_PAR_METIER) quand une famille reconnait le metier ET que sa coquille
  // conseillee (ou son repli) reste compatible avec ce contexte.
  const shellCounts = usage.shellCounts || new Map();
  const shellCtx = { sectionsCount: sections.length, motion, nav, hero, scale, metier: metierFinal };
  const eligibleShells = SHELLS.filter((s) => shellFits(s, shellCtx));
  const shellWeighted = eligibleShells.map((s) => ({
    key: s,
    weight: Math.max(0.5, (SHELL_WEIGHTS[s] ?? 10) - (shellCounts.get(s) || 0)),
    used: shellCounts.get(s) || 0,
  }));
  let shell = pickWeighted(rng, shellWeighted) || 'flow';
  let squeletteApplied = null;
  if (squelette) {
    const preferred = squeletteShellCompatible(squelette.shell, shellCtx)
      ? squelette.shell
      : squeletteShellCompatible(squelette.alternative, shellCtx)
        ? squelette.alternative
        : null;
    if (preferred) {
      shell = preferred;
      squeletteApplied = { ...squelette, shell: preferred };
    }
  }
  const contactDrawer = squelette ? squelette.contactDrawer : false;

  // En-tetes (layout.headings) : tirage pondere simple, aucune regle d'adequation ni penalite d'usage.
  const headingsWeighted = HEADINGS.map((h) => ({ key: h, weight: HEADINGS_WEIGHTS[h] ?? 10 }));
  const headings = pickWeighted(rng, headingsWeighted) || 'auto';

  const look = {
    direction: chosen.dir,
    motion,
    scale,
    typography: { display: fontPair.display, body: fontPair.body },
    layout: { nav, hero, sections, footer, divider, tone, shell, headings, contactDrawer },
  };

  const shellEntry = shellWeighted.find((w) => w.key === shell);
  const justification = [
    ['direction', chosen.dir, chosen.reasons.length ? chosen.reasons.join(' ; ') : 'meilleur score par defaut'],
    [
      'nav',
      nav,
      squelette?.nav
        ? `imposée par la famille métier "${squelette.familyId}" (${squelette.reason})`
        : `variante la moins utilisee (${nav} : ${(usage.variantCounts.nav || new Map()).get(nav) || 0} fois)`,
    ],
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
    [
      'mouvement',
      motion,
      squelette?.motion
        ? `imposé par la famille métier "${squelette.familyId}" (jamais "rich")`
        : `motionParDefaut de la direction "${chosen.dir}"`,
    ],
    [
      'disposition (shell)',
      shell,
      squeletteApplied
        ? squeletteApplied.reason
        : `tirage pondéré (${SHELL_WEIGHTS[shell] ?? 10} pts de base${shellEntry?.used ? `, -${shellEntry.used} déjà utilisée` : ''}) parmi ${eligibleShells.join(', ')}`,
    ],
    [
      'contact',
      contactDrawer ? 'tiroir (contactDrawer: true)' : 'section finale uniquement',
      squelette ? squelette.reason : 'défaut : aucune famille métier détectée pour ce métier',
    ],
    ['en-têtes', headings, `tirage pondéré (${HEADINGS_WEIGHTS[headings] ?? 10} pts de base)`],
  ];

  const squeletteResult = squelette ? { ...squelette, shell, applied: Boolean(squeletteApplied) } : null;

  return {
    slug,
    direction: chosen.dir,
    dirMeta: chosen,
    look,
    justification,
    metier: metierFinal,
    top3,
    metierAdapte,
    squelette: squeletteResult,
  };
}

const TIER_LABELS = { 0: 'adaptée au métier', 1: 'neutre (pas de lien connu avec ce métier)', 2: 'à éviter pour ce métier' };

function printProposal(slug, result) {
  info(c.bold(`Proposition de look pour ${slug}`) + (result.metier ? c.dim(`  (métier : ${result.metier})`) : ''));
  info('');

  // Les 3 directions retenues (palier puis score, voir directionTier) : toujours affichees avant le
  // detail du look, pour qu'une personne non technique voie IMMEDIATEMENT pourquoi telle direction a
  // gagne sur les deux suivantes, sans avoir a lire scripts/ff/composer.mjs.
  info(c.bold('Directions envisagées (3 meilleures) :'));
  for (const [i, d] of result.top3.entries()) {
    const label = TIER_LABELS[directionTier(d)];
    const why = d.reasons.length ? d.reasons.join(' ; ') : 'aucun critère particulier';
    info(`  ${i + 1}. ${c.cyan(d.dir.padEnd(12))} ${c.dim(`(${label})`)}  ${why}`);
  }
  if (!result.metierAdapte) {
    warn(
      `Aucune direction adaptée au métier "${result.metier || '(non renseigné)'}" trouvée : "${result.direction}" est un choix par défaut, sans lien connu avec ce métier — vérifie docs/DIRECTIONS.md avant de livrer.`,
    );
  }
  info('');

  // Squelette (layout.shell + nav/contactDrawer/mouvement conseillés) choisi par metier, distinct de
  // l'ambiance (direction) ci-dessus — voir SQUELETTES_PAR_METIER dans composer.mjs.
  if (result.squelette) {
    info(
      c.bold('Squelette retenu : ') +
        c.cyan(result.squelette.shell) +
        c.dim(`  (alternative : ${result.squelette.alternative})`),
    );
    info(`  ${result.squelette.reason}`);
    info('');
  }

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
