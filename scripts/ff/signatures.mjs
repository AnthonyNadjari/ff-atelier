// `ff signatures [--ecrire]` : registre des blocs signature (les sections sur mesure de chaque site)
// et controle d'unicite. Reponse a la demande du fondateur (21 sept 2026) : « je veux pas que le truc
// des cartes soit reutilise, c'est des designs uniques comme ca que je veux, et avoir la main dessus ».
//
// Deux mecanismes :
//   1. Empreinte de composition : chaque `sites/<slug>/sections/<Nom>.astro` est reduit a son squelette
//      de balises (noms de balises + attributs data-* et classes de structure, sans texte ni valeurs) et
//      hache. Deux sites qui partagent la meme empreinte = un bloc copie-colle d'un client a l'autre :
//      ✗. Un agent qui « s'inspire » d'un bloc en le recopiant se fait prendre ici.
//   2. Reserves declarees a la main dans `reserves.json` (racine du repo) : { "data-flip-card":
//      "dubois-plomberie", "sections/Parcours": "auto-ecole-rabelais" } — un effet du moteur ou un nom
//      de bloc reserve a UN site. Toute apparition ailleurs = ✗. C'est le fichier que le fondateur edite
//      pour proteger ce qu'il aime.
//
// `--ecrire` regenere `docs/SIGNATURES.md` : le catalogue, un site par section, avec pour chaque bloc la
// premiere ligne de son en-tete (l'intention) et ses effets riches. Lu par /nouveau-site avant de
// dessiner un bloc, pour ne pas refaire ce qui existe.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { ROOT, ok, fail, warn, info, parseArgs } from './util.mjs';

const EFFETS_RICHES = ['data-frames', 'data-shader', 'data-horizontal', 'data-marquee', 'data-drag-grid', 'data-flip-card', 'data-compare', 'data-text-fill', 'data-trail', 'data-hover-img', 'data-scramble', 'data-pin', 'data-parallax-depth', 'data-split="lines"'];

/** Squelette de composition : balises + attributs structurants, sans texte, valeurs ni expressions. */
export function empreinte(source) {
  const corps = source.includes('---') ? source.split('---').slice(2).join('---') : source;
  const balises = [...corps.matchAll(/<([a-zA-Z][\w-]*)([^>]*)>/g)].map((m) => {
    const tag = m[1];
    const attrs = [...m[2].matchAll(/\b(data-[\w-]+|class)(?:="([^"]*)")?/g)]
      .map((a) => (a[1] === 'class' ? 'class=' + (a[2] || '').split(/\s+/).filter((c) => /^(grid|flex|sticky|absolute|relative|fixed|columns-|aspect-|rounded|border|overflow)/.test(c)).sort().join(' ') : a[1]))
      .sort()
      .join(' ');
    return `${tag}[${attrs}]`;
  });
  return { hash: createHash('sha1').update(balises.join('\n')).digest('hex').slice(0, 12), taille: balises.length };
}

/** Corps d'un .astro (apres le frontmatter), sans les commentaires JSX ni HTML. */
function corpsSansCommentaires(source) {
  const corps = source.includes('---') ? source.split('---').slice(2).join('---') : source;
  return corps.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/<!--[\s\S]*?-->/g, '');
}

/** Vrai si l'effet est POSE comme attribut (`<x data-frames=` / `data-frames>`), pas seulement cite. */
function utiliseEffet(corps, effet) {
  const nom = effet.replace(/=.*$/, '');
  const re = new RegExp(`\s${nom}(?:=|\s|>|/)`);
  if (effet.includes('=')) return corps.includes(effet);
  return re.test(corps);
}

function intention(source) {
  const m = source.match(/\/\*\*\s*\n\s*\*\s*(.+)/);
  return m ? m[1].replace(/\s+/g, ' ').trim().slice(0, 140) : '';
}

export function analyser(root = ROOT) {
  const sitesDir = path.join(root, 'sites');
  const blocs = [];
  for (const slug of fs.readdirSync(sitesDir)) {
    if (slug.startsWith('_')) continue;
    const dir = path.join(sitesDir, slug, 'sections');
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.astro'))) {
      const src = fs.readFileSync(path.join(dir, f), 'utf8');
      const { hash, taille } = empreinte(src);
      // Effets cherches dans le corps seulement : un en-tete qui dit « anciennement data-flip-card »
      // ne doit pas compter.
      const corps = corpsSansCommentaires(src);
      const effets = EFFETS_RICHES.filter((e) => utiliseEffet(corps, e));
      blocs.push({ slug, fichier: f, nom: f.replace(/\.astro$/, ''), hash, taille, effets, intention: intention(src) });
    }
  }
  // Doublons d'empreinte entre sites (ignore les tres petits fichiers : un Nav de 5 balises se ressemble).
  const parHash = new Map();
  for (const b of blocs) {
    if (b.taille < 12) continue;
    if (!parHash.has(b.hash)) parHash.set(b.hash, []);
    parHash.get(b.hash).push(b);
  }
  const doublons = [...parHash.values()].filter((g) => new Set(g.map((b) => b.slug)).size > 1);
  // Reserves.
  const reservesPath = path.join(root, 'reserves.json');
  const reserves = fs.existsSync(reservesPath) ? JSON.parse(fs.readFileSync(reservesPath, 'utf8')) : {};
  const violations = [];
  for (const [cle, proprietaire] of Object.entries(reserves)) {
    if (cle.startsWith('_')) continue; // commentaire du fichier
    if (cle.startsWith('sections/')) {
      const nom = cle.slice('sections/'.length);
      for (const b of blocs) if (b.nom === nom && b.slug !== proprietaire) violations.push({ cle, proprietaire, slug: b.slug, fichier: b.fichier });
    } else {
      for (const b of blocs) if (b.effets.includes(cle) && b.slug !== proprietaire) violations.push({ cle, proprietaire, slug: b.slug, fichier: b.fichier });
      for (const f of ['src/sections', 'src/components']) {
        const d = path.join(root, f);
        if (!fs.existsSync(d)) continue;
        for (const sub of fs.readdirSync(d, { recursive: true })) {
          const p = path.join(d, String(sub));
          if (!p.endsWith('.astro') || !fs.statSync(p).isFile()) continue;
          if (utiliseEffet(corpsSansCommentaires(fs.readFileSync(p, 'utf8')), cle)) violations.push({ cle, proprietaire, slug: 'bibliotheque partagee', fichier: path.relative(root, p) });
        }
      }
    }
  }
  return { blocs, doublons, violations, reserves };
}

function catalogue({ blocs, reserves }) {
  const parSite = new Map();
  for (const b of blocs) {
    if (!parSite.has(b.slug)) parSite.set(b.slug, []);
    parSite.get(b.slug).push(b);
  }
  const lignes = ['# Blocs signature — catalogue genere par `ff signatures --ecrire`', '',
    '> Un bloc signature est une section dessinee pour UN site. Ce catalogue sert a ne pas refaire ce qui existe',
    '> (`/nouveau-site` le lit avant de dessiner) et a proteger ce que le studio veut garder unique : les',
    '> reserves de `reserves.json` (effet ou nom de bloc -> site proprietaire) sont controlees par `ff signatures`',
    '> et `ff verifier`. Editer `reserves.json` a la main pour reserver un bloc que vous aimez.', ''];
  const cles = Object.keys(reserves).filter((k) => !k.startsWith('_'));
  if (cles.length) {
    lignes.push('## Reserves', '');
    for (const k of cles) lignes.push(`- \`${k}\` -> **${reserves[k]}**`);
    lignes.push('');
  }
  for (const [slug, bs] of [...parSite.entries()].sort()) {
    lignes.push(`## ${slug}`, '');
    for (const b of bs.sort((x, y) => x.nom.localeCompare(y.nom))) {
      lignes.push(`- **${b.nom}** (${b.hash})${b.effets.length ? ' — ' + b.effets.join(', ') : ''}${b.intention ? ' — ' + b.intention : ''}`);
    }
    lignes.push('');
  }
  return lignes.join('\n');
}

export async function cmdSignatures(args) {
  const { flags } = parseArgs(args);
  const r = analyser();
  info(`${r.blocs.length} blocs sur mesure dans ${new Set(r.blocs.map((b) => b.slug)).size} sites, ${Object.keys(r.reserves).filter((k) => !k.startsWith('_')).length} reserve(s).`);
  for (const g of r.doublons) fail(`Meme composition sur plusieurs sites : ${g.map((b) => `${b.slug}/${b.fichier}`).join(' = ')}`);
  for (const v of r.violations) fail(`Reserve \`${v.cle}\` (a ${v.proprietaire}) utilisee par ${v.slug}/${v.fichier}`);
  if (flags.ecrire) {
    fs.writeFileSync(path.join(ROOT, 'docs', 'SIGNATURES.md'), catalogue(r));
    ok('docs/SIGNATURES.md regenere.');
  }
  if (r.doublons.length || r.violations.length) process.exit(1);
  ok('Aucune composition copiee entre sites, aucune reserve violee.');
}
