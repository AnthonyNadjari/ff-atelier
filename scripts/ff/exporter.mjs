// `ff exporter <slug> [--dest ../<slug>-site]` : cree un depot autonome pour le client.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, resolveSlug, ok, fail, warn, info, c, parseArgs } from './util.mjs';

// Liste BLANCHE (audit du 14 oct 2026) : la liste noire d'avant envoyait au client les livrables des
// autres clients, propositions/, archives/, captures/, les documents juridiques et commerciaux de
// studio/, .claude, .ff-tmp... Seul ce qui sert à construire et à faire évoluer CE site part.
const INCLUS_RACINE = new Set([
  'src', 'scripts', 'astro.config.mjs', 'package.json', 'package-lock.json', 'tsconfig.json',
  '.gitignore', '.gitattributes', '.env.example', 'perf-budget.json',
]);

function buildReadme(slug) {
  return `# Site ${slug}

Ce depot contient le site web, construit avec Astro. Il est autonome : tout ce dont
vous avez besoin pour le lancer, le modifier et le mettre en ligne est ici.

## Lancer le site en local

\`\`\`
npm install
npm run dev
\`\`\`

Le site est visible sur http://localhost:4321

## Construire le site pour la mise en ligne

\`\`\`
npm run build
\`\`\`

Le resultat est genere dans \`dist/${slug}/\`.

## Ou modifier le contenu

Tout le contenu (textes, coordonnees, services, avis, horaires...) se trouve dans :

- \`sites/${slug}/site.config.ts\` — toutes les informations du site, en un seul fichier.
- \`sites/${slug}/public/images/\` — les images utilisees par le site.
- \`sites/${slug}/domain.txt\` — le nom de domaine (une ligne, sans https), utilise pour
  les URLs canoniques et le plan du site.

## Deploiement

Ce site est prevu pour Cloudflare Pages (hebergement statique, gratuit dans la
grande majorite des cas). Voir la documentation fournie par votre prestataire
d'origine (Finck & Fisch), ou tout developpeur habitue a Astro et Cloudflare Pages.
`;
}

export function cmdExporter(args) {
  const { positional, flags } = parseArgs(args);
  const slug = positional[0];
  if (!slug) {
    fail('Usage : ff exporter <slug> [--dest ../<slug>-site]');
    process.exit(1);
  }
  resolveSlug(slug); // valide que le site existe

  const destArg = flags.dest || `../${slug}-site`;
  const destDir = path.resolve(ROOT, destArg);

  if (fs.existsSync(destDir)) {
    warn(`${destDir} existe deja — export ignore.`);
    return;
  }

  fs.mkdirSync(destDir, { recursive: true });

  fs.cpSync(ROOT, destDir, {
    recursive: true,
    filter: (src) => {
      const rel = path.relative(ROOT, src);
      if (rel === '') return true;
      const parts = rel.split(path.sep);
      if (parts[0] === 'sites') {
        if (parts.length === 1) return true;
        if (parts[1] !== slug) return false; // autres sites (et _exemple : .ff-current pointe sur le slug)
        if (parts.length >= 3 && ['raw', 'brief.md', 'look.json', 'direction.md', 'relecture.md', 'references'].includes(parts[2])) return false; // originaux, notes d'appel, contrat et journal de /site-final, demontages des sites aimes (ff demonter --slug)
        return true;
      }
      return INCLUS_RACINE.has(parts[0]);
    },
  });

  const pkgPath = path.join(destDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.name = slug;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  fs.writeFileSync(path.join(destDir, '.ff-current'), slug);
  fs.writeFileSync(path.join(destDir, 'README.md'), buildReadme(slug));

  const git = (a) => spawnSync('git', a, { cwd: destDir, stdio: 'inherit' });
  git(['init']);
  git(['add', '-A']);
  const commit = git(['commit', '-m', `Site initial — ${slug}`]);
  if (commit.status !== 0) {
    warn("git commit a echoue (identite git non configuree ?). Configure `git config user.name` / `user.email` dans ce depot puis commite manuellement.");
  } else {
    ok('Commit initial cree.');
  }

  info('');
  ok(`Export cree dans ${c.cyan(destDir)}`);
}
