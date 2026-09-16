// `ff nouveau <slug>` : cree sites/<slug>/ a partir d'un modele.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SITES_DIR, ok, fail, warn, info, c, writeFFCurrent, siteExists, parseArgs } from './util.mjs';

const SLUG_RE = /^_?[a-z0-9-]+$/;

export function cmdNouveau(args) {
  const { positional, flags } = parseArgs(args);
  const slug = positional[0];
  if (!slug) {
    fail('Usage : ff nouveau <slug> [--direction X] [--metier "Plombier"] [--depuis _exemple]');
    process.exit(1);
  }
  if (!SLUG_RE.test(slug)) {
    fail(`Slug invalide : "${slug}". Lettres minuscules, chiffres, tirets (ex: menuiserie-vasseur).`);
    process.exit(1);
  }
  if (siteExists(slug)) {
    fail(`sites/${slug} existe deja.`);
    process.exit(1);
  }

  const depuis = flags.depuis || '_exemple';
  if (!siteExists(depuis)) {
    fail(`Site modele introuvable : sites/${depuis}`);
    process.exit(1);
  }
  const srcDir = path.join(SITES_DIR, depuis);
  const destDir = path.join(SITES_DIR, slug);

  fs.cpSync(srcDir, destDir, {
    recursive: true,
    filter: (src) => {
      const rel = path.relative(srcDir, src);
      if (rel === '') return true;
      if (rel === 'raw' || rel.startsWith(`raw${path.sep}`)) return false;
      if (rel === 'domain.txt') return false;
      return true;
    },
  });

  // Reecrit le slug (et direction/metier si fournis) dans site.config.ts par remplacement de texte.
  const configPath = path.join(destDir, 'site.config.ts');
  let cfg = fs.readFileSync(configPath, 'utf8');
  cfg = cfg.replace(/slug:\s*'[^']*'/, `slug: '${slug}'`);
  if (flags.direction) {
    cfg = cfg.replace(/direction:\s*'[^']*'/, `direction: '${String(flags.direction)}'`);
  }
  if (flags.metier) {
    const metier = String(flags.metier).replace(/'/g, "\\'");
    cfg = cfg.replace(/trade:\s*'[^']*'/, `trade: '${metier}'`);
  }
  fs.writeFileSync(configPath, cfg);

  fs.mkdirSync(path.join(destDir, 'raw'), { recursive: true });

  const briefSrc = path.join(ROOT, 'docs', 'BRIEF.md');
  const briefDest = path.join(destDir, 'brief.md');
  if (fs.existsSync(briefSrc)) {
    fs.copyFileSync(briefSrc, briefDest);
    ok('brief.md copie depuis docs/BRIEF.md');
  } else {
    warn("docs/BRIEF.md introuvable pour l'instant — brief.md non cree (l'agent qui redige le brief le fournira, ou cree-le a la main).");
  }

  writeFFCurrent(slug);

  info('');
  ok(`sites/${slug} cree (modele : ${depuis}).`);
  info('');
  info(c.bold('Prochaines etapes :'));
  info(`  1. Remplis ${c.cyan(`sites/${slug}/brief.md`)} (ou attends le brief).`);
  info(`  2. Depose les photos originales dans ${c.cyan(`sites/${slug}/raw/`)}.`);
  info(`  3. Lance ${c.cyan(`ff images ${slug}`)} pour generer les .webp dans public/images/.`);
  info(`  4. Edite ${c.cyan(`sites/${slug}/site.config.ts`)} avec les informations du client.`);
  info(`  5. Lance ${c.cyan(`ff dev ${slug}`)} pour previsualiser.`);
}
