// `ff nouveau <slug>` : cree sites/<slug>/ a partir d'un modele.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SITES_DIR, ok, fail, warn, info, c, siteExists, parseArgs } from './util.mjs';

const SLUG_RE = /^_?[a-z0-9-]+$/;

/**
 * Retire du modèle copié ce qui est FICTIF et ne doit jamais survivre à une réécriture partielle :
 * les avis et la note Google (`proof`), le n° d'assurance, le responsable légal. Rodage du 13 oct
 * 2026 : `ff nouveau` recopiait les avis « Claire D. » / « Marc & Sophie » et la note 4,9 sur 37 de
 * l'exemple ; oubliés dans site.config.ts, ils partaient en ligne (pratique commerciale trompeuse,
 * art. L121-2 du Code de la consommation). Un vrai avis du brief se rajoute à la main dans `proof`.
 * Le reste du contenu de l'exemple (textes, services) sert de gabarit et se réécrit entièrement.
 */
export function retirerDonneesFictives(cfg) {
  let out = cfg;
  const i = out.search(/\n {2}proof:\s*\{/);
  if (i !== -1) {
    // Bloc `proof: {...}` à accolades équilibrées, virgule finale comprise.
    let j = out.indexOf('{', i);
    for (let prof = 0; j < out.length; j++) {
      if (out[j] === '{') prof++;
      else if (out[j] === '}' && --prof === 0) break;
    }
    const fin = out[j + 1] === ',' ? j + 2 : j + 1;
    out = out.slice(0, i) + '\n  // proof : uniquement les avis réels du brief (auteur, texte tel quel, source). Aucun avis = pas de bloc.' + out.slice(fin);
  }
  out = out.replace(/\n\s*insurance:\s*'[^'\n]*',?/, '');
  out = out.replace(/legal:\s*\{\s*owner:\s*'[^']*'\s*\}/, 'legal: {}, // owner : le gérant (brief § 1)');
  return out;
}

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
  cfg = retirerDonneesFictives(cfg);
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

  // Plus d'ecriture de .ff-current ici (test reel du 17 oct 2026) : `ff nouveau` changeait le site courant
  // sous les pieds des agents qui travaillent en parallele sur d'autres sites. Le site courant change
  // seulement par `ff dev <slug>` (ou un autre choix explicite).

  info('');
  ok(`sites/${slug} créé (gabarit : ${depuis} ; avis, note Google et assurance fictifs retirés).`);
  info('');
  info(c.bold('Prochaines étapes (chaîne client, docs/PROCESS.md) :'));
  info(`  1. Remplis ${c.cyan(`sites/${slug}/brief.md`)} pendant l'appel ; envoie au client ${c.cyan('studio/commercial/guide-photos.html')}.`);
  info(`  2. Dans Claude Code : ${c.cyan(`/nouveau-site ${slug}`)} (données du brief, puis ${c.cyan('ff composer')}, textes, build).`);
  info(`  3. Photos reçues : dans ${c.cyan(`sites/${slug}/raw/`)}, puis ${c.cyan(`ff images ${slug}`)}.`);
  info(`  4. ${c.cyan(`ff propositions ${slug}`)} pour montrer 3 looks au client, ${c.cyan(`--appliquer <n>`)} pour garder le choisi.`);
  info(`  5. ${c.cyan(`ff verifier ${slug}`)} doit être vert avant toute livraison.`);
  info(`Site courant inchangé : ${c.cyan(`ff dev ${slug}`)} pour travailler dessus sans répéter le slug.`);
}
