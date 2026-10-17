// `ff choisir <slug> <lettre> [--garder]` : le fondateur (ou le client) a choisi une piste parmi <slug>, <slug>-b,
// <slug>-c… Celle-ci devient LE site (`sites/<slug>/`), les autres sont rangées dans `sites/_pistes/<slug>-<lettre>/`
// (jamais construites, jamais déployées, exclues de `ff tous` et de la variété par le préfixe `_`), ou supprimées
// avec `--supprimer`. `a` = la piste principale (déjà en place : seules les autres sont rangées).
//
// Pourquoi (17 oct 2026) : après /site-final à N pistes, il manquait le geste « on prend la B » ; sans lui, la
// piste choisie restait sous un nom à suffixe et les autres continuaient d'être construites et déployées.
// Le projet Vercel (vercel-projet.json) suit la piste choisie ; `domain.txt` et `relecture.md` aussi.
import fs from 'node:fs';
import path from 'node:path';
import { SITES_DIR, ROOT, ok, fail, info, warn, parseArgs, resolveSlug } from './util.mjs';

/** Pure : plan des déplacements. existantes = dossiers de sites/ ; retourne { gagnante, perdantes, destination }. */
export function planChoix(slug, lettre, existantes) {
  const l = String(lettre || '').toLowerCase();
  if (!/^[a-h]$/.test(l)) throw new Error(`lettre de piste attendue (a, b, c…), reçu « ${lettre} »`);
  const gagnante = l === 'a' ? slug : `${slug}-${l}`;
  if (!existantes.includes(gagnante)) throw new Error(`la piste ${gagnante} n'existe pas`);
  const toutes = [slug, ...'bcdefgh'.split('').map((x) => `${slug}-${x}`)].filter((s) => existantes.includes(s));
  const perdantes = toutes.filter((s) => s !== gagnante);
  const destination = Object.fromEntries(perdantes.map((p) => [p, path.posix.join('_pistes', p === slug ? `${slug}-a` : p)]));
  return { gagnante, perdantes, destination };
}

export function cmdChoisir(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const existantes = fs.readdirSync(SITES_DIR, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  let plan;
  try { plan = planChoix(slug, positional[1], existantes); } catch (e) { fail(e.message); process.exit(1); }
  const { gagnante, perdantes, destination } = plan;
  fs.mkdirSync(path.join(SITES_DIR, '_pistes'), { recursive: true });
  for (const p of perdantes) {
    const de = path.join(SITES_DIR, p);
    if (flags.supprimer) { fs.rmSync(de, { recursive: true, force: true }); ok(`${p} supprimée`); continue; }
    const vers = path.join(SITES_DIR, destination[p]);
    if (fs.existsSync(vers)) { fail(`${destination[p]} existe déjà : range-la ou supprime-la d'abord.`); process.exit(1); }
    fs.renameSync(de, vers);
    ok(`${p} → sites/${destination[p]}`);
  }
  if (gagnante !== slug) {
    fs.renameSync(path.join(SITES_DIR, gagnante), path.join(SITES_DIR, slug));
    ok(`${gagnante} → sites/${slug} (la piste choisie devient le site)`);
    const cfg = path.join(SITES_DIR, slug, 'site.config.ts');
    if (fs.existsSync(cfg)) {
      const t = fs.readFileSync(cfg, 'utf8');
      if (t.includes(`'${gagnante}'`)) warn(`site.config.ts mentionne encore « ${gagnante} » : à relire (slug, URL d'aperçu).`);
    }
  }
  for (const d of ['dist', 'captures']) {
    const p = path.join(ROOT, d, gagnante);
    if (gagnante !== slug && fs.existsSync(p)) { fs.rmSync(path.join(ROOT, d, slug), { recursive: true, force: true }); fs.renameSync(p, path.join(ROOT, d, slug)); }
  }
  info(`Suite : ff build ${slug}, ff verifier ${slug}, puis le déploiement du site sous son nom. Les pistes rangées dans sites/_pistes/ restent lisibles (contrat, sections) mais ne sont plus construites.`);
}
