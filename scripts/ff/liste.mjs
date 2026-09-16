// `ff liste` : liste les sites, leur direction, et si le build existe.
import fs from 'node:fs';
import path from 'node:path';
import { SITES_DIR, DIST_DIR, listSites, readFFCurrent, info, c } from './util.mjs';

export function cmdListe() {
  const current = readFFCurrent();
  const slugs = listSites();
  if (slugs.length === 0) {
    info('Aucun site dans sites/.');
    return;
  }

  const width = Math.max(...slugs.map((s) => s.length), 4) + 2;
  info(`  ${c.bold('slug'.padEnd(width) + 'direction'.padEnd(12) + 'dist')}`);
  for (const slug of slugs) {
    const configPath = path.join(SITES_DIR, slug, 'site.config.ts');
    const src = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf8') : '';
    const m = src.match(/direction:\s*'([^']+)'/);
    const direction = m ? m[1] : '?';
    const hasDist = fs.existsSync(path.join(DIST_DIR, slug));
    const marker = slug === current ? c.cyan('*') : ' ';
    info(`${marker} ${slug.padEnd(width)}${direction.padEnd(12)}${hasDist ? 'oui' : 'non'}`);
  }
  if (current) info(`\n(* site courant : ${current})`);
}
