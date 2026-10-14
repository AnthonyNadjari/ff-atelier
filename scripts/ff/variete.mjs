// `ff variete` : lit le look effectif de chaque site (site.config.ts + look.json), compare direction/nav/hero/sections/footer.
import { effectiveLook } from './look-data.mjs';
import { listSites, fail, warn, info, c } from './util.mjs';

// Lecture par effectiveLook (look-data.mjs) : la regex d'avant ratait les sections écrites par `ff figer`
// et `ff-generer` (virgule finale, `label:` des sections sur mesure) et ignorait look.json (audit du 14 oct 2026).
function parseConfig(slug) {
  const look = effectiveLook(slug);
  if (!look) return null;
  const sections = (look.sections || []).map((s) => ({ type: s.type, variant: s.variant }));
  return { slug, direction: look.direction, nav: look.nav, hero: look.hero, footer: look.footer, sections };
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
  // Sans _exemple ni _effets : un site tout juste cree par `ff nouveau` est encore une copie de _exemple et
  // faisait sortir variete en erreur avant le moindre choix (rodage du 13 oct 2026).
  const slugs = listSites({ excludeUnderscore: true });
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
    // Un hero sur mesure (`custom/...`) est propre a son site : deux sites en `custom/hero` ne partagent
    // rien, le doublon direction+hero n'a pas de sens (faux echec repere au rodage du 13 oct 2026).
    if (!r.direction || !r.hero || /^custom\//i.test(r.hero)) continue;
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
