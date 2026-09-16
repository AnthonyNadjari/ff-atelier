// `ff tous` : construit tous les sites (hors _test*), avec un resume ok/erreur.
import { listSites, runAstro, ok, fail, info, c } from './util.mjs';

export function cmdTous() {
  const slugs = listSites({ excludeTestPrefix: true });
  if (slugs.length === 0) {
    info('Aucun site dans sites/.');
    return;
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
