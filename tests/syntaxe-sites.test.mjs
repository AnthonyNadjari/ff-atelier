// Chaque sites/<slug>/site.config.ts et le frontmatter de chaque sites/<slug>/sections/*.astro doit
// etre du TypeScript valide. Un commentaire contenant "*/" (ex : "sites/*/sections/*.astro") a deja
// casse le build de tous les sites : ce test nomme le fichier fautif au lieu de laisser Astro echouer.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const esbuild = require(join(ROOT, 'node_modules/astro/node_modules/vite/node_modules/esbuild'));

const sites = readdirSync(join(ROOT, 'sites')).filter((d) => statSync(join(ROOT, 'sites', d)).isDirectory() && !d.startsWith('_test'));

function frontmatter(astroSource) {
  const m = astroSource.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : '';
}

for (const slug of sites) {
  const cfg = join(ROOT, 'sites', slug, 'site.config.ts');
  if (existsSync(cfg)) {
    test(`sites/${slug}/site.config.ts : TypeScript valide`, async () => {
      const src = readFileSync(cfg, 'utf8');
      await assert.doesNotReject(esbuild.transform(src, { loader: 'ts', logLevel: 'silent' }), (e) => {
        throw new Error(`${slug}/site.config.ts : ${e.errors?.[0]?.text ?? e.message} (ligne ${e.errors?.[0]?.location?.line})`);
      });
    });
  }
  const secDir = join(ROOT, 'sites', slug, 'sections');
  if (!existsSync(secDir)) continue;
  for (const f of readdirSync(secDir).filter((x) => x.endsWith('.astro'))) {
    test(`sites/${slug}/sections/${f} : frontmatter valide`, async () => {
      const fm = frontmatter(readFileSync(join(secDir, f), 'utf8'));
      if (!fm.trim()) return;
      await assert.doesNotReject(esbuild.transform(fm, { loader: 'ts', logLevel: 'silent' }), (e) => {
        throw new Error(`${slug}/sections/${f} : ${e.errors?.[0]?.text ?? e.message} (ligne ${e.errors?.[0]?.location?.line})`);
      });
    });
  }
}
