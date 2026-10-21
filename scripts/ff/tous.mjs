// `ff tous [--depuis <ref git>]` : construit tous les sites (hors _test*), avec un resume ok/erreur.
// `--depuis <ref>` (CI, 22 oct 2026) : seulement les sites touches depuis cette revision — a 200 sites, construire
// tout a chaque push coute une heure. Un changement hors sites/ (gabarit, scripts, dependances) reconstruit tout ;
// _exemple est toujours construit (c'est le temoin). Pur : sitesAReconstruire(fichiers) est teste par tests/cli.test.mjs.
import { spawnSync } from 'node:child_process';
import { ROOT, listSites, runAstro, ok, fail, info, c, parseArgs } from './util.mjs';

/** Dossiers dont un changement n'affecte aucun build (docs, captures, studio, veille, tests). */
const SANS_EFFET = /^(docs|studio|tests|captures|propositions|archives|livrables|outils|\.claude|\.github\/ISSUE_TEMPLATE)\//;
const SANS_EFFET_FICHIER = /^(README\.md|CLAUDE\.md|sites-en-ligne\.json|\.gitignore|\.gitattributes|\.env\.example)$|\.md$/;

/**
 * Sites a reconstruire d'apres une liste de fichiers modifies (chemins relatifs a la racine, / comme separateur) :
 * { tous: true } si un fichier partage a change, sinon { tous: false, slugs: [...] } (les slugs touches + _exemple).
 */
export function sitesAReconstruire(fichiers, tousLesSlugs) {
  const slugs = new Set();
  for (const f of fichiers) {
    if (!f) continue;
    if (SANS_EFFET.test(f) || SANS_EFFET_FICHIER.test(f)) continue;
    const m = f.match(/^sites\/([^/]+)\//);
    if (m) {
      // Un fichier de site qui ne change pas le build (brief, contrat de direction, raw/) n'y oblige pas.
      if (/^sites\/[^/]+\/(brief\.md|CONTRAT\.md|CREDITS\.md|raw\/|hebergement\.json|vercel-projet\.json)/.test(f)) continue;
      if (tousLesSlugs.includes(m[1])) slugs.add(m[1]);
      continue;
    }
    return { tous: true, cause: f };
  }
  if (tousLesSlugs.includes('_exemple')) slugs.add('_exemple');
  return { tous: false, slugs: [...slugs].sort() };
}

function fichiersModifiesDepuis(ref) {
  const r = spawnSync('git', ['diff', '--name-only', `${ref}...HEAD`], { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) {
    // Revision inconnue (premier push d'une branche, historique tronque) : on ne devine pas, on construit tout.
    return null;
  }
  return r.stdout.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
}

export function cmdTous(args = []) {
  const { flags } = parseArgs(args);
  let slugs = listSites({ excludeTestPrefix: true });
  if (slugs.length === 0) {
    info('Aucun site dans sites/.');
    return;
  }

  if (typeof flags.depuis === 'string' && flags.depuis) {
    const fichiers = fichiersModifiesDepuis(flags.depuis);
    if (!fichiers) {
      info(c.dim(`--depuis ${flags.depuis} : revision inconnue de git, tous les sites sont construits.`));
    } else {
      const sel = sitesAReconstruire(fichiers, slugs);
      if (sel.tous) {
        info(c.dim(`--depuis ${flags.depuis} : ${sel.cause} a change (fichier partage), tous les sites sont construits.`));
      } else {
        slugs = sel.slugs;
        info(c.dim(`--depuis ${flags.depuis} : ${fichiers.length} fichier(s) modifie(s), ${slugs.length} site(s) a construire : ${slugs.join(', ')}.`));
      }
    }
  }

  const results = [];
  for (const slug of slugs) {
    info(c.dim(`— build ${slug}...`));
    const status = runAstro('build', slug);
    results.push({ slug, status });
  }

  info('');
  info(c.bold('Resume :'));
  const width = Math.max(...results.map((r) => r.slug.length), 4) + 2;
  for (const r of results) {
    const label = r.slug.padEnd(width);
    if (r.status === 0) ok(`${label}ok`);
    else fail(`${label}erreur (code ${r.status})`);
  }

  const nbErr = results.filter((r) => r.status !== 0).length;
  info('');
  if (nbErr > 0) {
    fail(`${nbErr} site(s) en erreur sur ${results.length}.`);
    process.exit(1);
  } else {
    ok(`Les ${results.length} site(s) ont ete construits avec succes.`);
  }
}
