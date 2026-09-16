// `ff variete` : parse sites/*/site.config.ts par regex (pas d'import TS), compare direction/nav/hero/sections/footer.
import fs from 'node:fs';
import path from 'node:path';
import { SITES_DIR, listSites, fail, warn, info, c } from './util.mjs';

function match1(src, re) {
  const m = src.match(re);
  return m ? m[1] : undefined;
}

function parseConfig(slug) {
  const configPath = path.join(SITES_DIR, slug, 'site.config.ts');
  if (!fs.existsSync(configPath)) return null;
  const src = fs.readFileSync(configPath, 'utf8');
  const direction = match1(src, /direction:\s*'([^']+)'/);
  const nav = match1(src, /nav:\s*'([^']+)'/);
  const hero = match1(src, /hero:\s*'([^']+)'/);
  const footer = match1(src, /footer:\s*'([^']+)'/);
  const sections = [...src.matchAll(/\{\s*type:\s*'([^']+)',\s*variant:\s*'([^']+)'\s*\}/g)].map((m) => ({
    type: m[1],
    variant: m[2],
  }));
  return { slug, direction, nav, hero, footer, sections };
}

function printCounts(values) {
  const counts = new Map();
  for (const v of values) {
    if (!v) continue;
    counts.set(v, (counts.get(v) || 0) + 1);
  }
  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) {
    info('  (aucune)');
    return;
  }
  for (const [k, n] of entries) info(`  ${k.padEnd(14)} ${n}`);
}

export function cmdVariete() {
  const slugs = listSites();
  const rows = slugs.map(parseConfig).filter(Boolean);

  info(
    c.bold('slug'.padEnd(22) + 'direction'.padEnd(12) + 'nav'.padEnd(10) + 'hero'.padEnd(14) + 'footer'.padEnd(10) + 'sections'),
  );
  for (const r of rows) {
    const sectionsStr = r.sections.map((s) => `${s.type}:${s.variant}`).join(', ');
    info(
      (r.slug ?? '?').padEnd(22) +
        (r.direction ?? '?').padEnd(12) +
        (r.nav ?? '?').padEnd(10) +
        (r.hero ?? '?').padEnd(14) +
        (r.footer ?? '?').padEnd(10) +
        sectionsStr,
    );
  }

  info('');
  let hasError = false;
  const byDirHero = new Map();
  for (const r of rows) {
    if (!r.direction || !r.hero) continue;
    const key = `${r.direction}|${r.hero}`;
    if (!byDirHero.has(key)) byDirHero.set(key, []);
    byDirHero.get(key).push(r);
  }

  if (byDirHero.size === 0 || [...byDirHero.values()].every((g) => g.length < 2)) {
    info('Aucun doublon direction+hero.');
  }

  for (const [key, group] of byDirHero) {
    if (group.length < 2) continue;
    const [direction, hero] = key.split('|');
    warn(`direction "${direction}" + hero "${hero}" utilises par : ${group.map((r) => r.slug).join(', ')}`);

    const byServicesVariant = new Map();
    for (const r of group) {
      const svc = r.sections.find((s) => s.type === 'services');
      const svKey = svc ? svc.variant : '(aucun)';
      if (!byServicesVariant.has(svKey)) byServicesVariant.set(svKey, []);
      byServicesVariant.get(svKey).push(r.slug);
    }
    for (const [svKey, slugsGroup] of byServicesVariant) {
      if (slugsGroup.length >= 2) {
        fail(`  + services "${svKey}" identiques : ${slugsGroup.join(', ')}`);
        hasError = true;
      }
    }
  }

  info('');
  info(c.bold('Utilisation par direction :'));
  printCounts(rows.map((r) => r.direction));
  info('');
  info(c.bold('Utilisation par hero :'));
  printCounts(rows.map((r) => r.hero));

  if (hasError) process.exit(1);
}
