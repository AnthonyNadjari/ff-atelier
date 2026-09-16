// `ff dev|build|preview [slug]` : lance astro avec SITE=<slug>.
import { resolveSlug, runAstro } from './util.mjs';

function run(astroCmd, args) {
  const slug = resolveSlug(args[0]);
  const status = runAstro(astroCmd, slug);
  process.exit(status);
}

export function cmdDev(args) {
  run('dev', args);
}
export function cmdBuild(args) {
  run('build', args);
}
export function cmdPreview(args) {
  run('preview', args);
}
