// `ff liste` : liste les sites, leur direction, si le build existe, et où ils sont en ligne
// (sites/<slug>/hebergement.json écrit par `ff deploy`, sites/<slug>/domain.txt, sites-en-ligne.json).
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SITES_DIR, DIST_DIR, listSites, readFFCurrent, info, c } from './util.mjs';
import { stripComments } from './ts-literal.mjs';
import { lireHebergement } from './hebergement.mjs';

/** Colonne « en ligne » d'un site : domaine ou URL du dernier déploiement, mode et date ; vide sinon. */
export function etatEnLigne(slug, { sitesDir = SITES_DIR, livres = [] } = {}) {
  const h = lireHebergement(slug, sitesDir);
  const domainFile = path.join(sitesDir, slug, 'domain.txt');
  const domaine = fs.existsSync(domainFile) ? fs.readFileSync(domainFile, 'utf8').trim() : '';
  if (!h && !domaine) return '';
  const ou = domaine || (h?.url ? h.url.replace(/^https?:\/\//, '') : '');
  const parts = [ou, h ? `${h.mode} ${h.date ?? ''}`.trim() : 'non deploye'];
  if (livres.includes(slug)) parts.push('livre');
  return parts.filter(Boolean).join(' · ');
}

function lireLivres() {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(ROOT, 'sites-en-ligne.json'), 'utf8'));
    return Array.isArray(j) ? j : [];
  } catch {
    return [];
  }
}

export function cmdListe() {
  const current = readFFCurrent();
  const slugs = listSites();
  if (slugs.length === 0) {
    info('Aucun site dans sites/.');
    return;
  }
  const livres = lireLivres();

  const width = Math.max(...slugs.map((s) => s.length), 4) + 2;
  info(`  ${c.bold('slug'.padEnd(width) + 'direction'.padEnd(12) + 'dist  ' + 'en ligne')}`);
  for (const slug of slugs) {
    const configPath = path.join(SITES_DIR, slug, 'site.config.ts');
    const src = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf8') : '';
    const m = stripComments(src).match(/direction:\s*'([^']+)'/);
    const direction = m ? m[1] : '?';
    const hasDist = fs.existsSync(path.join(DIST_DIR, slug));
    const marker = slug === current ? c.cyan('*') : ' ';
    info(`${marker} ${slug.padEnd(width)}${direction.padEnd(12)}${(hasDist ? 'oui' : 'non').padEnd(6)}${etatEnLigne(slug, { livres })}`);
  }
  if (current) info(`\n(* site courant : ${current})`);
  const enLigne = slugs.filter((s) => lireHebergement(s)).length;
  info(`\n${slugs.length} site(s), ${enLigne} deploye(s) par ff deploy, ${livres.length} livre(s) (sites-en-ligne.json).`);
}
