// ff ia [slug ...] [--json] : repère les signes qui font dire « c'est fait par une IA » sur un site
// déjà construit (dist/<slug>/index.html) et dans sa direction / sa typographie.
//
// Pourquoi : le 6 oct 2026, un visiteur du site du studio a dit « ça se voit que c'est fait avec
// Claude ». Les signes relevés par la veille (TeneX, Inspire Studio, 925 Studios, Impeccable) et
// retirés de la factory ce jour-là ne doivent jamais revenir avec un nouveau site ou une nouvelle
// direction. Voir docs/veille/signes-ia.md.
//
//   ✗ (échec)  polices par défaut des IA ; emphase des titres en italique ; tiret cadratin ou point
//              médian comme séparateur dans le texte visible.
//   ⚠ (alerte) boutons pilule (rayon 999px) ; coches façon tarif SaaS ; libellés en capitales
//              espacées (uppercase + tracking) ; halo radial plein écran.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, DIST_DIR, SITES_DIR, c, info, ok, fail, warn } from './util.mjs';

/** Paquets/familles de polices que les IA choisissent par défaut (listes Impeccable + veille). */
export const POLICES_IA = [
  'cormorant', 'instrument-sans', 'instrument-serif', 'inter', 'playfair', 'fraunces', 'space-grotesk',
  'space-mono', 'dm-sans', 'dm-serif', 'outfit', 'plus-jakarta', 'syne', 'newsreader', 'lora', 'crimson',
  'ibm-plex', 'geist', 'general-sans', 'source-serif', 'manrope',
];
export const CLES_IA = ['cormorant', 'instrumentSans', 'instrumentSerif', 'inter', 'playfair', 'fraunces', 'spaceGrotesk', 'dmSans', 'dmSerif', 'outfit', 'plusJakarta', 'syne', 'newsreader', 'lora', 'crimson', 'ibmPlex', 'geist', 'sourceSerif', 'manrope'];

const normaliser = (n) => n.toLowerCase().replace(/[\s_]+/g, '-');
export const estPoliceIa = (nom) => {
  const n = normaliser(nom);
  return POLICES_IA.some((p) => n === p || n.startsWith(p + '-') || n.startsWith(p + '/') || n.includes(`${p} `) || n.includes(`'${p}`) || n.startsWith(p));
};

/** Texte visible d'une page : sans <script>, <style>, commentaires, ni attributs. */
export function texteVisible(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|svg|template)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x2014;|&#8212;|&mdash;/g, '—')
    .replace(/&#xb7;|&#183;|&middot;/g, '·');
}

/** Analyse le HTML construit. Retourne { echecs: [...], alertes: [...] } (messages avec extraits). */
export function analyserHtml(html) {
  const echecs = [];
  const alertes = [];
  const texte = texteVisible(html);
  const extraits = (re) => [...texte.matchAll(re)].map((m) => texte.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, ' ').trim());
  const tirets = extraits(/\s—\s|—/g);
  if (tirets.length) echecs.push({ regle: 'tiret-cadratin', n: tirets.length, exemples: tirets.slice(0, 3) });
  const medians = extraits(/\s·\s/g);
  if (medians.length) echecs.push({ regle: 'point-median', n: medians.length, exemples: medians.slice(0, 3) });
  const coches = (html.match(/d="M20 6 9 17l-5-5"|lucide-check\b|data-lucide="check"/g) || []).length;
  if (coches) alertes.push({ regle: 'coches', n: coches });
  const capitales = (html.match(/class="[^"]*\buppercase\b[^"]*\btracking-\[0\.[1-9]/g) || []).length;
  if (capitales) alertes.push({ regle: 'capitales-espacees', n: capitales });
  // 15 oct 2026 : effets du moteur interdits par docs/GOUT.md § 2 (grain, halo qui suit la souris, reflet,
  // dégradés aurora) ; et numérotation décorative « 01 02 03 » dans le texte visible (≥ 3 occurrences).
  // Sur le balisage seulement : le CSS en ligne (inlineStylesheets) contient les sélecteurs [data-grain] du
  // moteur même quand aucun bloc ne s'en sert (faux positif vu au test /site-final du 16 oct 2026).
  const balisage = html.replace(/<(style|script)\b[\s\S]*?<\/\1>/gi, ' ');
  const effets = (balisage.match(/\bdata-(?:grain|spotlight|tilt-glare)\b|data-shader="(?:aurora|grain-gradient)"/g) || []).length;
  if (effets) alertes.push({ regle: 'effets-interdits', n: effets });
  const numeros = new Set((texte.match(/(?:^|\s)0[1-9](?=\s|$)/g) || []).map((s) => s.trim()));
  if (numeros.has('01') && numeros.has('02') && numeros.has('03')) alertes.push({ regle: 'numerotation-decorative', n: numeros.size });
  // 16 oct 2026 (docs/veille/pourquoi-ia-2026-10.md : trois pistes « toutes IA ») : le mouvement du moteur
  // appliqué partout trahit la machine. Titres de section révélés par lignes = échec ; le reste, alertes.
  const titresSplit = (balisage.match(/<h[23]\b[^>]*\bdata-split\b/gi) || []).length;
  if (titresSplit > 2) echecs.push({ regle: 'split-titres', n: titresSplit, exemples: ['plus de deux h2/h3 révélés ligne par ligne (GOUT § 2 et § 4)'] });
  // Surtitre gris « métier, rue, ville » juste au-dessus du h1 (GOUT § 2, 16 oct 2026) : l'eyebrow en casse normale.
  // Trouvé le 17 oct sur les pages service de l'usine par un relecteur ; depuis, la machine le voit.
  const surtitre = balisage.match(/<p\b[^>]*class="[^"]*\beyebrow\b[^"]*"[^>]*>([^<]{3,120})<\/p>\s*(?:<[^h][^>]*>\s*)*<h1\b/i);
  if (surtitre) echecs.push({ regle: 'surtitre-h1', n: 1, exemples: [surtitre[1].trim()] });
  if (/class="[^"]*\bff-curtain\b/.test(balisage)) alertes.push({ regle: 'rideau', n: 1 });
  const sections = balisage.split(/<section\b/i).slice(1);
  if (sections.length >= 4) {
    const animees = sections.filter((s) => /data-reveal="(?:clip|wipe|mask)"|<img\b[^>]*\bdata-(?:scrub|parallax)\b|\bdata-(?:scrub|parallax)\b[^>]*>\s*<(?:img|picture)/i.test(s)).length;
    if (animees * 2 > sections.length) alertes.push({ regle: 'reveal-partout', n: animees });
  }
  if (/photo d[’']illustration/i.test(texte)) alertes.push({ regle: 'photo-illustration', n: 1 });
  const titres = [...balisage.matchAll(/<h([12])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean);
  if (titres.length >= 4) {
    const point = titres.filter((x) => /\.$/.test(x)).length;
    const courts = titres.filter((x) => x.split(' ').length < 5).length;
    if (point * 2 > titres.length || courts === 0) alertes.push({ regle: 'titres-point', n: point });
  }
  return { echecs, alertes };
}

/** Analyse la feuille d'une direction. */
export function analyserDirection(css) {
  const echecs = [];
  const alertes = [];
  const imports = [...css.matchAll(/@import '@fontsource(?:-variable)?\/([^/']+)/g)].map((m) => m[1]);
  const familles = [...css.matchAll(/--font-(?:display|body):\s*'([^']+)'/g)].map((m) => m[1]);
  const ia = [...new Set([...imports, ...familles].filter(estPoliceIa))];
  if (ia.length) echecs.push({ regle: 'polices-ia', n: ia.length, exemples: ia });
  if (/(?:h1|h2)\s+em[^{]*\{[^}]*font-style:\s*italic/.test(css)) echecs.push({ regle: 'titre-italique', n: 1 });
  if (/--radius:\s*999px/.test(css)) alertes.push({ regle: 'boutons-pilule', n: 1 });
  return { echecs, alertes };
}

/** Typographie forcée par un site (site.config.ts : typography: { display, body }). */
export function analyserTypographie(config) {
  const m = config.match(/typography:\s*\{([^}]*)\}/);
  if (!m) return { echecs: [], alertes: [] };
  const cles = [...m[1].matchAll(/(?:display|body):\s*'([^']+)'/g)].map((x) => x[1]);
  const ia = cles.filter((k) => CLES_IA.includes(k));
  return { echecs: ia.length ? [{ regle: 'polices-ia', n: ia.length, exemples: ia }] : [], alertes: [] };
}

export function analyserSite(slug) {
  const config = fs.readFileSync(path.join(SITES_DIR, slug, 'site.config.ts'), 'utf8');
  const direction = (config.match(/direction:\s*'([^']+)'/) || [])[1];
  const typo = analyserTypographie(config);
  // La typographie du site remplace celle de la direction : on ne reproche à la direction que la
  // famille qui reste réellement affichée.
  const forcee = (config.match(/typography:\s*\{([^}]*)\}/) || [])[1] || '';
  const cssPath = direction ? path.join(ROOT, 'src/directions', direction, 'index.css') : null;
  let dir = { echecs: [], alertes: [] };
  if (cssPath && fs.existsSync(cssPath)) {
    let css = fs.readFileSync(cssPath, 'utf8');
    if (/display:/.test(forcee)) css = css.replace(/--font-display:[^;]+;/, '');
    if (/body:/.test(forcee)) css = css.replace(/--font-body:[^;]+;/, '');
    dir = analyserDirection(css);
    if (/display:/.test(forcee) && /body:/.test(forcee)) dir.echecs = dir.echecs.filter((e) => e.regle !== 'polices-ia');
  }
  // Polices importées directement par les sections sur mesure du site (contournent la direction).
  const dossierSections = path.join(SITES_DIR, slug, 'sections');
  if (fs.existsSync(dossierSections)) {
    const imports = fs.readdirSync(dossierSections).filter((f) => f.endsWith('.astro'))
      .flatMap((f) => [...fs.readFileSync(path.join(dossierSections, f), 'utf8').matchAll(/@fontsource(?:-variable)?\/([^/'"]+)/g)].map((m) => `${m[1]} (${f})`));
    const ia = imports.filter((x) => estPoliceIa(x.split(' ')[0]));
    if (ia.length) typo.echecs.push({ regle: 'polices-ia-sections', n: ia.length, exemples: ia });
  }
  const htmlPath = path.join(DIST_DIR, slug, 'index.html');
  const page = fs.existsSync(htmlPath) ? analyserHtml(fs.readFileSync(htmlPath, 'utf8')) : null;
  return {
    slug,
    direction,
    construit: Boolean(page),
    echecs: [...typo.echecs, ...dir.echecs, ...(page ? page.echecs : [])],
    alertes: [...dir.alertes, ...(page ? page.alertes : [])],
  };
}

export function cmdIa(args = []) {
  const json = args.includes('--json');
  const noms = args.filter((a) => !a.startsWith('--'));
  const tous = fs.readdirSync(SITES_DIR).filter((s) => !s.startsWith('_') && fs.existsSync(path.join(SITES_DIR, s, 'site.config.ts')));
  const cibles = noms.length ? noms : tous;
  const rapports = cibles.map(analyserSite);
  if (json) {
    info(JSON.stringify(rapports, null, 2));
    process.exit(rapports.some((r) => r.echecs.length) ? 1 : 0);
  }
  info(c.bold('ff ia — signes « fait par une IA » (veille du 6 oct 2026, docs/veille/signes-ia.md)'));
  info('');
  for (const r of rapports) {
    const tete = `${r.slug} (${r.direction})${r.construit ? '' : c.dim(' — non construit : texte non vérifié')}`;
    if (!r.echecs.length && !r.alertes.length) { ok(tete); continue; }
    (r.echecs.length ? fail : warn)(tete);
    for (const e of r.echecs) info(`    ✗ ${e.regle} (${e.n})${e.exemples ? ' : ' + e.exemples.join(' | ') : ''}`);
    for (const a of r.alertes) info(`    ⚠ ${a.regle} (${a.n})`);
  }
  const nEchecs = rapports.filter((r) => r.echecs.length).length;
  info('');
  if (nEchecs) { fail(`${nEchecs}/${rapports.length} site(s) avec au moins un signe bloquant.`); process.exit(1); }
  ok(`Aucun signe bloquant sur ${rapports.length} site(s).`);
}
