// `ff couleur [direction...]` : controle de contraste reel des directions.
//
// Pourquoi ce fichier existe : nos 17 directions fixent leurs couleurs a la main dans
// src/directions/<nom>/index.css. Jusqu'ici, chaque ajustement de contraste etait verifie par un
// script jetable, puis le resultat etait recopie dans un commentaire ("52 -> 34 : verifie par
// script"). Le calcul n'etait rejouable par personne. Ici il l'est : on relit le CSS, on resout
// reellement les tokens (var / hsl / calc / rgb+alpha / oklch, y compris la syntaxe relative
// `oklch(from ... l c h)` des blocs @supports), et on calcule les ratios WCAG 2 des paires
// reellement utilisees.
//
// Formule : WCAG 2.x, luminance relative (w3.org/TR/WCAG21/relative-luminance.html) —
// linearisation sRGB au seuil 0.04045 / exposant 2.4, coefficients 0.2126 / 0.7152 / 0.0722,
// ratio (Lclair + 0.05) / (Lsombre + 0.05). C'est la formule qui fait foi juridiquement (RGAA,
// EN 301 549, European Accessibility Act sont tous sur WCAG 2.1 AA) ; APCA n'est toujours pas
// normatif dans WCAG 3 en 2026 (voir docs/veille/couleur.md §3).
//
// Seuils (docs/veille/couleur.md §3, docs/CONVENTIONS.md regles 14/15) :
//   texte    4,5:1 — texte courant, y compris .eyebrow (12 px) et le texte d'un bouton ;
//   grand    3:1   — texte >= 24 px (h1 em / h2 em colores par la direction) ;
//   controle 3:1   — anneau de focus (global.css : outline 2px solid var(--accent)), filets
//                    porteurs de sens ;
//   decor    aucun seuil WCAG — un filet de carte (--line) n'est pas un "composant d'interface"
//                    au sens de WCAG 1.4.11 : il double une frontiere deja visible. On le mesure
//                    et on avertit seulement s'il est invisible (< 1,2:1). `--strict` le promeut
//                    a 3:1 pour qui veut l'exiger.

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, c, info, ok, fail, warn } from './util.mjs';

const DIRECTIONS_DIR = path.join(ROOT, 'src', 'directions');

export const SEUILS = { texte: 4.5, grand: 3, controle: 3, decor: 1.2 };

/* ------------------------------------------------------------------ *
 * 1. Petit evaluateur arithmetique (pour calc())                      *
 * ------------------------------------------------------------------ */

/**
 * Evalue une expression arithmetique simple : nombres, %, + - * /, parentheses.
 * Les identifiants (l, c, h, alpha...) sont fournis par `env`.
 * Renvoie { n, pct } — `pct` indique si le resultat porte une unite %.
 * Pas d'eval/Function : recursive descent, 40 lignes, pas de surprise.
 */
export function evalExpr(src, env = {}) {
  const s = String(src).trim();
  let i = 0;
  const ws = () => {
    while (i < s.length && /\s/.test(s[i])) i++;
  };
  function primary() {
    ws();
    if (s[i] === '(') {
      i++;
      const v = expr();
      ws();
      if (s[i] === ')') i++;
      return v;
    }
    if (s[i] === '-') {
      i++;
      const v = primary();
      return { n: -v.n, pct: v.pct };
    }
    if (s[i] === '+') {
      i++;
      return primary();
    }
    const num = /^[0-9]*\.?[0-9]+(e[-+]?\d+)?/i.exec(s.slice(i));
    if (num) {
      i += num[0].length;
      let pct = false;
      if (s[i] === '%') {
        pct = true;
        i++;
      } else if (/^deg\b/.test(s.slice(i))) {
        i += 3;
      }
      return { n: parseFloat(num[0]), pct };
    }
    const id = /^[a-zA-Z_][\w-]*/.exec(s.slice(i));
    if (id) {
      i += id[0].length;
      if (id[0] === 'calc') {
        ws();
        if (s[i] === '(') {
          i++;
          const v = expr();
          ws();
          if (s[i] === ')') i++;
          return v;
        }
      }
      if (!(id[0] in env)) throw new Error(`identifiant inconnu dans calc() : ${id[0]}`);
      return { n: env[id[0]], pct: false };
    }
    throw new Error(`expression illisible : ${s.slice(i, i + 20)}`);
  }
  function term() {
    let left = primary();
    for (;;) {
      ws();
      const op = s[i];
      if (op !== '*' && op !== '/') return left;
      i++;
      const right = primary();
      left = { n: op === '*' ? left.n * right.n : left.n / right.n, pct: left.pct || right.pct };
    }
  }
  function expr() {
    let left = term();
    for (;;) {
      ws();
      const op = s[i];
      // `-` colle a un chiffre sans espace derriere un operande = soustraction quand meme
      if (op !== '+' && op !== '-') return left;
      i++;
      const right = term();
      left = { n: op === '+' ? left.n + right.n : left.n - right.n, pct: left.pct || right.pct };
    }
  }
  const v = expr();
  ws();
  return v;
}

/* ------------------------------------------------------------------ *
 * 2. Espaces colorimetriques                                          *
 * ------------------------------------------------------------------ */

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** sRGB (0..1, gamma) -> lineaire. Seuil 0.04045, exposant 2.4 (WCAG 2.1 / sRGB). */
export const versLineaire = (v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
export const versGamma = (v) => (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055);

/** Luminance relative WCAG 2.1. `rgb` en 0..255. */
export function luminance([r, g, b]) {
  const R = versLineaire(r / 255);
  const G = versLineaire(g / 255);
  const B = versLineaire(b / 255);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/** Ratio de contraste WCAG 2.1 entre deux couleurs opaques, 1..21. */
export function ratio(rgbA, rgbB) {
  const a = luminance(rgbA);
  const b = luminance(rgbB);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** Compose une couleur semi-transparente sur un fond opaque (source-over). */
export function aplatir(couleur, fond) {
  const a = couleur.a ?? 1;
  if (a >= 1) return [couleur.r, couleur.g, couleur.b];
  return [0, 1, 2].map((i) => Math.round(couleur[['r', 'g', 'b'][i]] * a + fond[i] * (1 - a)));
}

function hslVersRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => Math.round(clamp01(v) * 255));
}

/** OKLCH -> sRGB 0..255. L en 0..1, C absolu, H en degres (Bjorn Ottosson, 2020). */
export function oklchVersRgb(L, C, H) {
  const hr = (H * Math.PI) / 180;
  const a = C * Math.cos(hr);
  const b = C * Math.sin(hr);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return [lr, lg, lb].map((v) => Math.round(clamp01(versGamma(v)) * 255));
}

/** sRGB 0..255 -> OKLCH { L (0..1), C, H (deg) }. Inverse de `oklchVersRgb`. */
export function rgbVersOklch([r8, g8, b8]) {
  const r = versLineaire(r8 / 255);
  const g = versLineaire(g8 / 255);
  const b = versLineaire(b8 / 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(A, B);
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}

/* ------------------------------------------------------------------ *
 * 3. Resolution d'une valeur CSS en couleur                           *
 * ------------------------------------------------------------------ */

/** Decoupe les arguments d'une fonction CSS au premier niveau (espaces, virgules, `/`). */
function argsCss(src) {
  const out = [];
  let buf = '';
  let prof = 0;
  for (const ch of src) {
    if (ch === '(') prof++;
    if (ch === ')') prof--;
    if (prof === 0 && (ch === ',' || /\s/.test(ch))) {
      if (buf.trim()) out.push(buf.trim());
      buf = '';
      continue;
    }
    if (prof === 0 && ch === '/') {
      if (buf.trim()) out.push(buf.trim());
      out.push('/');
      buf = '';
      continue;
    }
    buf += ch;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

/** Contenu entre la premiere `(` et sa parenthese fermante. */
function corpsFonction(src, nom) {
  const i = src.indexOf(nom + '(');
  if (i < 0) return null;
  let prof = 0;
  for (let j = i + nom.length; j < src.length; j++) {
    if (src[j] === '(') prof++;
    else if (src[j] === ')') {
      prof--;
      if (prof === 0) return src.slice(i + nom.length + 1, j);
    }
  }
  return null;
}

const NOMMEES = {
  transparent: { r: 0, g: 0, b: 0, a: 0 },
  white: { r: 255, g: 255, b: 255, a: 1 },
  black: { r: 0, g: 0, b: 0, a: 1 },
};

/**
 * Resout une valeur CSS en { r, g, b, a } (0..255, alpha 0..1), ou null si non resoluble.
 * `tokens` : map nom de variable (sans `--`... avec, en fait : `--bg`) -> valeur brute.
 */
export function resoudreCouleur(valeur, tokens, profondeur = 0) {
  if (valeur == null || profondeur > 12) return null;
  let v = String(valeur).trim().replace(/\s*!important$/, '');
  if (!v) return null;
  if (NOMMEES[v.toLowerCase()]) return { ...NOMMEES[v.toLowerCase()] };

  if (v.startsWith('var(')) {
    const corps = corpsFonction(v, 'var');
    if (!corps) return null;
    const virgule = (() => {
      let prof = 0;
      for (let i = 0; i < corps.length; i++) {
        if (corps[i] === '(') prof++;
        else if (corps[i] === ')') prof--;
        else if (corps[i] === ',' && prof === 0) return i;
      }
      return -1;
    })();
    const nom = (virgule < 0 ? corps : corps.slice(0, virgule)).trim();
    const repli = virgule < 0 ? null : corps.slice(virgule + 1).trim();
    if (nom in tokens) return resoudreCouleur(tokens[nom], tokens, profondeur + 1);
    return repli ? resoudreCouleur(repli, tokens, profondeur + 1) : null;
  }

  const hex = /^#([0-9a-f]{3,8})$/i.exec(v);
  if (hex) {
    let h = hex[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((ch) => ch + ch).join('');
    if (h.length !== 6 && h.length !== 8) return null;
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
    };
  }

  /** Resout un composant scalaire (nombre, %, var(), calc()) en nombre. */
  const scalaire = (txt, env = {}) => {
    let t = String(txt).trim();
    // Remplace les var() imbriquees par leur valeur textuelle avant d'evaluer.
    for (let garde = 0; t.includes('var(') && garde < 8; garde++) {
      const corps = corpsFonction(t.slice(t.indexOf('var(')), 'var');
      if (corps == null) break;
      const nom = corps.split(',')[0].trim();
      const repli = corps.includes(',') ? corps.slice(corps.indexOf(',') + 1).trim() : '';
      const remplacement = nom in tokens ? tokens[nom] : repli;
      if (!remplacement) return null;
      const debut = t.indexOf('var(');
      t = t.slice(0, debut) + remplacement + t.slice(debut + 'var('.length + corps.length + 1);
    }
    try {
      return evalExpr(t, env).n;
    } catch {
      return null;
    }
  };

  for (const nom of ['rgb', 'rgba']) {
    if (v.toLowerCase().startsWith(nom + '(')) {
      const parts = argsCss(corpsFonction(v, nom) ?? '').filter((p) => p !== '/');
      const n = parts.map((p) => scalaire(p));
      if (n.slice(0, 3).some((x) => x == null)) return null;
      const alpha = n[3] == null ? 1 : /%$/.test(parts[3]) ? n[3] / 100 : n[3];
      return { r: Math.round(n[0]), g: Math.round(n[1]), b: Math.round(n[2]), a: alpha };
    }
  }

  for (const nom of ['hsl', 'hsla']) {
    if (v.toLowerCase().startsWith(nom + '(')) {
      const parts = argsCss(corpsFonction(v, nom) ?? '').filter((p) => p !== '/');
      const n = parts.map((p) => scalaire(p));
      if (n.slice(0, 3).some((x) => x == null)) return null;
      const [r, g, b] = hslVersRgb(n[0], n[1], n[2]);
      const alpha = n[3] == null ? 1 : /%$/.test(parts[3] ?? '') ? n[3] / 100 : n[3];
      return { r, g, b, a: alpha };
    }
  }

  // color-mix(in <espace>, A p%, B q%) — utilise par `global.css` (eyebrow sur fond accent) et par
  // `craft.css` (anneau de focus). Sans lui, ces couleurs etaient « non resolubles » et leur
  // contraste n'etait jamais mesure : les deux endroits les plus sensibles du site echappaient au
  // controle. Melange en oklab (perceptuel, pas de virage au gris comme en sRGB) ou en sRGB quand
  // l'espace est explicitement srgb ; les autres espaces retombent sur oklab, plus proche du rendu
  // navigateur que sRGB.
  if (v.toLowerCase().startsWith('color-mix(')) {
    const corps = corpsFonction(v, 'color-mix');
    if (!corps) return null;
    // `argsCss` decoupe aussi sur les espaces (il sert a `hsl(8 85% 46%)`) : ici il faut les
    // virgules de premier niveau, et elles seules, sinon « in srgb » compte pour deux arguments.
    const args = [];
    {
      let buf = '';
      let prof = 0;
      for (const ch of corps) {
        if (ch === '(') prof++;
        else if (ch === ')') prof--;
        if (ch === ',' && prof === 0) { args.push(buf.trim()); buf = ''; continue; }
        buf += ch;
      }
      if (buf.trim()) args.push(buf.trim());
    }
    if (args.length < 3) return null;
    const espace = (args[0] || '').trim().replace(/^in\s+/i, '').toLowerCase();
    const lire = (arg) => {
      const m = /^(.*?)(?:\s+([\d.]+)%)?$/s.exec(String(arg).trim());
      if (!m) return null;
      const couleur = resoudreCouleur(m[1].trim(), tokens, profondeur + 1);
      if (!couleur) return null;
      return { couleur, part: m[2] === undefined ? null : Number(m[2]) / 100 };
    };
    const a = lire(args[1]);
    const b = lire(args[2]);
    if (!a || !b) return null;
    // Regle CSS : une seule part donnee, l'autre vaut le complement ; aucune, 50/50.
    let pa = a.part;
    let pb = b.part;
    if (pa == null && pb == null) { pa = 0.5; pb = 0.5; }
    else if (pa == null) pa = 1 - pb;
    else if (pb == null) pb = 1 - pa;
    const somme = pa + pb;
    if (somme <= 0) return null;
    pa /= somme;
    pb /= somme;

    if (espace === 'srgb') {
      return {
        r: a.couleur.r * pa + b.couleur.r * pb,
        g: a.couleur.g * pa + b.couleur.g * pb,
        b: a.couleur.b * pa + b.couleur.b * pb,
        a: (a.couleur.a ?? 1) * pa + (b.couleur.a ?? 1) * pb,
      };
    }
    // oklab : on passe par oklch (deja disponible) puis en coordonnees rectangulaires, seule facon
    // d'interpoler une teinte sans tourner autour du cercle chromatique.
    const versLab = (c) => {
      const { L, C, H } = rgbVersOklch([c.r, c.g, c.b]);
      const rad = (H * Math.PI) / 180;
      return { L, a: C * Math.cos(rad), b: C * Math.sin(rad) };
    };
    const la = versLab(a.couleur);
    const lb = versLab(b.couleur);
    const L = la.L * pa + lb.L * pb;
    const ax = la.a * pa + lb.a * pb;
    const bx = la.b * pa + lb.b * pb;
    const C = Math.sqrt(ax * ax + bx * bx);
    let H = (Math.atan2(bx, ax) * 180) / Math.PI;
    if (H < 0) H += 360;
    const [r, g, bb] = oklchVersRgb(L, C, H);
    return { r, g, b: bb, a: (a.couleur.a ?? 1) * pa + (b.couleur.a ?? 1) * pb };
  }

  if (v.toLowerCase().startsWith('oklch(')) {
    const parts = argsCss(corpsFonction(v, 'oklch') ?? '');
    let env = {};
    let reste = parts;
    if (parts[0] === 'from') {
      const source = resoudreCouleur(parts[1], tokens, profondeur + 1);
      if (!source) return null;
      const { L, C, H } = rgbVersOklch([source.r, source.g, source.b]);
      env = { l: L, c: C, h: H, alpha: source.a ?? 1 };
      reste = parts.slice(2);
    }
    const slash = reste.indexOf('/');
    const comp = (slash < 0 ? reste : reste.slice(0, slash)).slice(0, 3);
    if (comp.length < 3) return null;
    const bruts = comp.map((p) => {
      try {
        return evalExpr(p, env);
      } catch {
        return null;
      }
    });
    if (bruts.some((x) => x == null)) return null;
    // L : 0..1 ou 0%..100%. C : absolu, ou % de 0.4. H : degres.
    const L = bruts[0].pct ? bruts[0].n / 100 : bruts[0].n;
    const C = bruts[1].pct ? (bruts[1].n / 100) * 0.4 : bruts[1].n;
    const H = bruts[2].n;
    const [r, g, b] = oklchVersRgb(L, C, H);
    let a = 1;
    if (slash >= 0 && reste[slash + 1] != null) {
      const av = evalExpr(reste[slash + 1], env);
      a = av.pct ? av.n / 100 : av.n;
    } else if ('alpha' in env) a = env.alpha;
    return { r, g, b, a };
  }

  return null;
}

/* ------------------------------------------------------------------ *
 * 4. Lecture d'une direction                                          *
 * ------------------------------------------------------------------ */

export function listerDirections() {
  if (!fs.existsSync(DIRECTIONS_DIR)) return [];
  return fs
    .readdirSync(DIRECTIONS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(DIRECTIONS_DIR, d.name, 'index.css')))
    .map((d) => d.name)
    .sort();
}

/** Retire les commentaires CSS (ils contiennent nos justifications, parfois avec des accolades). */
export function sansCommentaires(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, ' ');
}

/**
 * Extrait le corps de chaque bloc `<selecteur> { ... }` dont le selecteur correspond a `test`.
 * Le selecteur est ce qui suit la derniere `}` / `;` / `{` : sinon il ramasse tous les @import
 * et les regles precedentes, et plus aucun selecteur ne correspond.
 */
function blocs(css, test) {
  const src = sansCommentaires(css);
  const out = [];
  const re = /([^{}]*)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(src))) {
    const brut = m[1];
    const coupe = Math.max(brut.lastIndexOf('}'), brut.lastIndexOf(';'), brut.lastIndexOf('{'));
    const sel = brut.slice(coupe + 1).trim().replace(/\s+/g, ' ');
    if (sel && test(sel)) out.push({ sel, corps: m[2] });
  }
  return out;
}

function declarations(corps) {
  const out = {};
  for (const ligne of corps.split(';')) {
    const i = ligne.indexOf(':');
    if (i < 0) continue;
    const nom = ligne.slice(0, i).trim();
    const val = ligne.slice(i + 1).trim();
    if (!nom || !val) continue;
    out[nom] = val;
  }
  return out;
}

/**
 * Lit src/directions/<nom>/index.css et renvoie :
 *   tokens      — variables du bloc principal (le contrat de global.css) ;
 *   tokensModernes — memes variables une fois les blocs @supports appliques (ce que voit un
 *                    navigateur recent : c'est la valeur reellement rendue aujourd'hui) ;
 *   eyebrow / emphase — couleur effective du petit label et des <em> de titre, en tenant compte
 *                    des surcharges de la direction (defaut global.css : var(--accent)).
 */
export function lireDirection(nom) {
  const fichier = path.join(DIRECTIONS_DIR, nom, 'index.css');
  const css = sansCommentaires(fs.readFileSync(fichier, 'utf8'));
  const estRacine = (sel) => new RegExp(`^\\[data-direction=(['"])${nom}\\1\\]$`).test(sel);

  // Le bloc principal = le premier bloc racine hors @supports. On coupe le CSS a la premiere
  // at-rule @supports pour ne pas confondre les deux.
  const iSupports = css.indexOf('@supports');
  const base = iSupports < 0 ? css : css.slice(0, iSupports);
  const principal = blocs(base, estRacine)[0];
  if (!principal) throw new Error(`bloc [data-direction='${nom}'] introuvable dans ${fichier}`);

  const tokens = {};
  for (const [k, v] of Object.entries(declarations(principal.corps))) if (k.startsWith('--')) tokens[k] = v;

  const tokensModernes = { ...tokens };
  if (iSupports >= 0) {
    for (const b of blocs(css.slice(iSupports), estRacine)) {
      for (const [k, v] of Object.entries(declarations(b.corps))) if (k.startsWith('--')) tokensModernes[k] = v;
    }
  }

  // --- Regles reellement ecrites par la direction -------------------------------------------
  // On ne suppose pas quelle couleur va sur quel fond : on le LIT. `--on-accent` sur `--accent-2`,
  // par exemple, n'est vrai que pour les directions qui l'ecrivent ; terre met `--ink` au survol
  // du bouton et `--on-accent` sur ::selection — deux paires differentes pour le meme fond.
  const prefixe = `[data-direction='${nom}']`;
  /**
   * Couleur de texte + fond effectifs d'une regle, en cascade : les selecteurs simples d'abord,
   * puis les etats (`:hover`, `:focus`). Les blocs destines a un fond encre/accent sont exclus :
   * global.css les traite separement et ils ne concernent pas le fond de page.
   */
  const regle = (motif, def = {}) => {
    const pertinent = (sel) =>
      sel.startsWith(prefixe) && motif.test(sel) && !/\.bg-ink|\.bg-accent|\.text-on-ink/.test(sel);
    let color = def.color ?? null;
    let fond = def.fond ?? null;
    let clipText = false;
    let degrade = null;
    for (const etat of [false, true]) {
      for (const b of blocs(css, (sel) => pertinent(sel) && /:hover|:focus/.test(sel) === etat)) {
        const d = declarations(b.corps);
        if (d.color) color = d.color;
        const bg = d.background ?? d['background-color'] ?? null;
        if (bg) {
          if (/gradient\(/.test(bg)) degrade = bg;
          // `background: transparent` (eclipse : .btn-primary:hover) = l'element laisse voir la
          // page : la reference redevient --bg, pas le fond precedent de la regle.
          else if (/^(none|transparent)$/.test(bg.trim())) fond = 'var(--bg)';
          else fond = bg;
        }
        if (/text/.test(d['background-clip'] ?? d['-webkit-background-clip'] ?? '')) clipText = true;
      }
    }
    return { color, fond, clipText, degrade };
  };

  const regles = {
    eyebrow: regle(/\.eyebrow\b/, { color: 'var(--accent)' }), // defaut global.css
    em: regle(/\bh[12] em\b/, { color: 'var(--accent)' }),
    btnPrimaire: regle(/\.btn-primary(?!:)/, { color: 'var(--on-accent)', fond: 'var(--accent)' }),
    btnPrimaireSurvol: regle(/\.btn-primary:hover/, { color: 'var(--on-accent)', fond: 'var(--accent)' }),
    btnFantome: regle(/\.btn-ghost(?!:)/, { color: 'var(--fg)', fond: 'var(--bg)' }),
    selection: regle(/::selection/, { color: 'var(--on-accent)', fond: 'var(--accent)' }), // defaut global.css
  };
  // `.btn-primary:hover` herite de `.btn-primary` quand il ne redefinit qu'une propriete.
  regles.btnPrimaireSurvol.color ??= regles.btnPrimaire.color;
  regles.btnPrimaireSurvol.fond ??= regles.btnPrimaire.fond;

  return { nom, fichier, css, tokens, tokensModernes, regles };
}

/** Couleurs d'arret d'un degrade CSS (on ignore angles, positions et mots-cles d'interpolation). */
export function arretsDegrade(valeur) {
  const corps = corpsFonction(valeur, valeur.slice(0, valeur.indexOf('(')));
  if (!corps) return [];
  return argsCss(corps).filter(
    (a) => a !== '/' && !/^(to|in|at|circle|ellipse|closest|farthest|oklab|oklch|srgb|longer|shorter|increasing|decreasing|hue)/i.test(a) && !/^[\d.]+(deg|%|px|rem|vmax|vw|vh|turn|rad)?$/i.test(a),
  );
}

/* ------------------------------------------------------------------ *
 * 5. Les paires controlees                                            *
 * ------------------------------------------------------------------ */

/**
 * Paires reellement utilisees par nos sections (src/sections/**, src/styles/global.css) :
 *   texte    — .text-fg / .text-muted sur .bg-bg, .bg-bg-2, .card (--surface) ; le texte d'un
 *              bouton primaire (--on-accent sur --accent) ; le texte d'un bloc encre ;
 *              .eyebrow (0,75rem, donc texte courant) sur les trois fonds clairs ;
 *   grand    — h1 em / h2 em, colores par la direction, toujours au-dessus de 24 px ;
 *   controle — l'anneau de focus (global.css : `outline: 2px solid var(--accent)`) ;
 *   decor    — --line, filet de carte.
 */
export function pairesDe(dir) {
  const P = [];
  const add = (libelle, avant, fond, role) => {
    if (avant && fond) P.push({ libelle, avant, fond, role });
  };
  const r = dir.regles;

  // Contrat de tokens (src/directions/README.md regle 3, src/styles/global.css).
  add('fg / bg', 'var(--fg)', 'var(--bg)', 'texte');
  add('fg / bg-2', 'var(--fg)', 'var(--bg-2)', 'texte');
  add('fg / surface', 'var(--fg)', 'var(--surface)', 'texte');
  add('muted / bg', 'var(--muted)', 'var(--bg)', 'texte');
  add('muted / bg-2', 'var(--muted)', 'var(--bg-2)', 'texte');
  add('muted / surface', 'var(--muted)', 'var(--surface)', 'texte');
  add('on-accent / accent', 'var(--on-accent)', 'var(--accent)', 'texte');
  add('on-ink / ink', 'var(--on-ink)', 'var(--ink)', 'texte');

  // Paires telles que la direction les ecrit vraiment.
  add('eyebrow / bg', r.eyebrow.color, r.eyebrow.fond ?? 'var(--bg)', 'texte');
  add('eyebrow / bg-2', r.eyebrow.color, r.eyebrow.fond ?? 'var(--bg-2)', 'texte');
  add('eyebrow / surface', r.eyebrow.color, r.eyebrow.fond ?? 'var(--surface)', 'texte');
  add('bouton primaire', r.btnPrimaire.color, r.btnPrimaire.fond, 'texte');
  add('bouton primaire :hover', r.btnPrimaireSurvol.color, r.btnPrimaireSurvol.fond, 'texte');
  add('bouton fantome', r.btnFantome.color, r.btnFantome.fond ?? 'var(--bg)', 'texte');
  add('::selection', r.selection.color, r.selection.fond ?? 'var(--accent)', 'texte');

  // h1 em / h2 em : toujours au-dessus de 24 px, donc « grand texte » (3:1).
  // Cas du texte peint par un degrade (`background-clip: text`, direction neon) : la couleur
  // declaree vaut `transparent`, ce n'est pas elle qu'on voit — on controle chaque arret.
  if (r.em.clipText && r.em.degrade) {
    for (const [i, arret] of arretsDegrade(r.em.degrade).entries())
      add(`h1 em (degrade ${i + 1}) / bg`, arret, 'var(--bg)', 'grand');
  } else {
    add('h1 em / bg', r.em.color, r.em.fond ?? 'var(--bg)', 'grand');
  }

  // Anneau de focus. ATTENTION : ce n'est PAS `var(--accent)`. `src/styles/craft.css` pose
  // `--ff-focus: color-mix(in oklab, var(--accent) 62%, var(--fg))` — l'accent tire de 38 % vers la
  // couleur du texte, precisement pour qu'un accent clair (le jaune de `brut`, 1,47:1 sur son fond)
  // reste visible. Mesurer l'accent brut donnait un echec permanent sur toutes les directions a
  // accent clair : un controle qu'on apprend a ignorer ne sert plus a rien (corrige le 23 sept 2026).
  // Indicateur d'etat d'interface : 3:1 contre le fond adjacent (WCAG 1.4.11).
  const ANNEAU = 'color-mix(in oklab, var(--accent) 62%, var(--fg))';
  add('anneau de focus / bg', ANNEAU, 'var(--bg)', 'controle');
  add('anneau de focus / bg-2', ANNEAU, 'var(--bg-2)', 'controle');

  // Filets de carte : mesures, sans seuil WCAG (voir l'entete du fichier).
  add('line / bg', 'var(--line)', 'var(--bg)', 'decor');
  add('line / surface', 'var(--line)', 'var(--surface)', 'decor');
  return P;
}

/* ------------------------------------------------------------------ *
 * 6. Analyse                                                          *
 * ------------------------------------------------------------------ */

/** Analyse une direction. Fonction pure : ne lit que le disque, n'ecrit rien, n'imprime rien. */
export function analyserDirection(nom, { strict = false, moderne = true } = {}) {
  const dir = lireDirection(nom);
  const tokens = moderne ? dir.tokensModernes : dir.tokens;
  const seuils = { ...SEUILS };
  if (strict) seuils.decor = 3;

  const lignes = [];
  for (const paire of pairesDe(dir)) {
    const fondBrut = resoudreCouleur(paire.fond, tokens);
    if (!fondBrut) {
      lignes.push({ ...paire, etat: 'inconnu', raison: `fond non resoluble (${paire.fond})` });
      continue;
    }
    // Un fond semi-transparent se pose lui-meme sur --bg (cas --line: rgba(...)).
    const bgPage = resoudreCouleur('var(--bg)', tokens);
    const fond = aplatir(fondBrut, bgPage ? [bgPage.r, bgPage.g, bgPage.b] : [255, 255, 255]);
    const avantBrut = resoudreCouleur(paire.avant, tokens);
    if (!avantBrut) {
      lignes.push({ ...paire, etat: 'inconnu', raison: `couleur non resoluble (${paire.avant})` });
      continue;
    }
    const avant = aplatir(avantBrut, fond);
    const r = ratio(avant, fond);
    const seuil = seuils[paire.role];
    const etat = r + 1e-9 >= seuil ? 'ok' : paire.role === 'decor' ? 'avert' : 'echec';
    lignes.push({ ...paire, ratio: r, seuil, etat, avantHex: hexDe(avant), fondHex: hexDe(fond) });
  }
  return { nom: dir.nom, fichier: dir.fichier, lignes, echecs: lignes.filter((l) => l.etat === 'echec') };
}

export function hexDe([r, g, b]) {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
}

/* ------------------------------------------------------------------ *
 * 7. Commande                                                         *
 * ------------------------------------------------------------------ */

export function cmdCouleur(args = []) {
  const strict = args.includes('--strict');
  const json = args.includes('--json');
  const base = args.includes('--base'); // audite les valeurs de repli (vieux navigateurs)
  const noms = args.filter((a) => !a.startsWith('--'));
  const connues = listerDirections();
  const cibles = noms.length ? noms : connues;

  const inconnues = cibles.filter((n) => !connues.includes(n));
  if (inconnues.length) {
    fail(`Direction inconnue : ${inconnues.join(', ')}. Connues : ${connues.join(', ')}`);
    process.exit(1);
  }

  const rapports = cibles.map((n) => analyserDirection(n, { strict, moderne: !base }));

  if (json) {
    info(JSON.stringify(rapports, null, 2));
    process.exit(rapports.some((r) => r.echecs.length) ? 1 : 0);
  }

  info(c.bold(`ff couleur — contraste WCAG 2.1 des directions (${base ? 'valeurs de repli' : 'valeurs rendues'})`));
  info(c.dim('  texte 4,5:1 · grand texte 3:1 · controle (focus) 3:1 · filet decoratif : mesure seule'));
  info('');

  let totalEchecs = 0;
  for (const rapport of rapports) {
    const pires = rapport.lignes.filter((l) => l.etat !== 'ok');
    const entete = pires.some((l) => l.etat === 'echec') ? c.red(rapport.nom) : c.green(rapport.nom);
    info(`${c.bold(entete)}`);
    const largeur = Math.max(...rapport.lignes.map((l) => l.libelle.length)) + 2;
    for (const l of rapport.lignes) {
      if (l.etat === 'inconnu') {
        info(`  ${c.yellow('?')} ${l.libelle.padEnd(largeur)} ${c.dim(l.raison)}`);
        continue;
      }
      const marque = l.etat === 'ok' ? c.green('✓') : l.etat === 'avert' ? c.yellow('!') : c.red('✗');
      const chiffre = `${l.ratio.toFixed(2)}:1`.padStart(8);
      const attendu = l.role === 'decor' ? c.dim('  (decor)') : c.dim(`  (>= ${l.seuil})`);
      const couleurs = c.dim(`  ${l.avantHex} sur ${l.fondHex}`);
      info(`  ${marque} ${l.libelle.padEnd(largeur)}${chiffre}${attendu}${couleurs}`);
    }
    if (rapport.echecs.length) totalEchecs += rapport.echecs.length;
    info('');
  }

  if (totalEchecs) {
    fail(`${totalEchecs} paire(s) sous le seuil. Corrige la direction concernee (src/directions/<nom>/index.css).`);
    process.exit(1);
  }
  ok(`${rapports.length} direction(s) : toutes les paires de texte tiennent 4,5:1, les controles 3:1.`);
  if (!strict) warn('Filets decoratifs (--line) mesures sans seuil WCAG : `--strict` les exige a 3:1.');
}
