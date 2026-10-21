// Tests du CLI (scripts/ff.mjs) : aide, variete, cycle nouveau -> verifier.
// Les commandes attendues sont decouvertes dynamiquement en parsant `const commands = {...}`
// dans scripts/ff.mjs (regex), jamais une liste codee en dur — d'autres agents ajoutent des
// commandes en parallele (ex: studio, figer, composer, propositions, og).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FF = path.join(ROOT, 'scripts', 'ff.mjs');
const SLUG = '_test-cli-x';
const SITE_DIR = path.join(ROOT, 'sites', SLUG);
const DIST_DIR = path.join(ROOT, 'dist', SLUG);
const FF_CURRENT = path.join(ROOT, '.ff-current');
const lireCourant = () => (fs.existsSync(FF_CURRENT) ? fs.readFileSync(FF_CURRENT, 'utf8') : null);
// .ff-current d'avant les tests, remis en place a la fin : `ff verifier` (build) l'ecrit.
const courantAvant = lireCourant();

function run(args, opts = {}) {
  return spawnSync(process.execPath, [FF, ...args], { cwd: ROOT, encoding: 'utf8', ...opts });
}

/** Parse les cles de `const commands = { ... };` dans scripts/ff.mjs. */
function registeredCommandNames() {
  const src = fs.readFileSync(FF, 'utf8');
  const block = src.match(/const commands = \{([\s\S]*?)\n\};/);
  assert.ok(block, 'bloc `const commands = { ... };` introuvable dans scripts/ff.mjs (le script a-t-il change de forme ?)');
  return [...block[1].matchAll(/^\s*(\w+)\s*:/gm)].map((m) => m[1]);
}

function cleanup() {
  fs.rmSync(SITE_DIR, { recursive: true, force: true });
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}

after(() => {
  cleanup();
  if (courantAvant == null) fs.rmSync(FF_CURRENT, { force: true });
  else fs.writeFileSync(FF_CURRENT, courantAvant);
});

test('ff aide sort en 0 et mentionne chaque commande enregistree dans scripts/ff.mjs', () => {
  const names = registeredCommandNames();
  assert.ok(names.length > 0);
  const res = run(['aide']);
  assert.equal(res.status, 0, `stderr: ${res.stderr}`);
  const missing = names.filter((name) => !res.stdout.includes(name));
  assert.deepEqual(missing, [], `Commandes enregistrees mais absentes de la sortie de \`ff aide\` : ${missing.join(', ')}`);
});

test('ff variete sort en 0 ou 1 sans lever d\'exception', () => {
  const res = run(['variete']);
  assert.ok([0, 1].includes(res.status), `code de sortie inattendu : ${res.status}\nstderr: ${res.stderr}`);
  assert.doesNotMatch(res.stderr, /\bThrowError\b|at file:|Error:\s/i, `une exception semble etre remontee :\n${res.stderr}`);
});

test('ff nouveau puis ff verifier : cycle complet sur un site jetable', { timeout: 180_000 }, () => {
  cleanup();

  const created = run(['nouveau', SLUG, '--direction', 'atelier']);
  assert.equal(created.status, 0, `\`ff nouveau ${SLUG}\` a echoue :\n${created.stdout}\n${created.stderr}`);
  assert.ok(fs.existsSync(path.join(SITE_DIR, 'site.config.ts')), 'sites/_test-cli-x/site.config.ts non cree');
  // Test reel du 17 oct 2026 : `ff nouveau` ne change plus le site courant (agents en parallele).
  assert.equal(lireCourant(), courantAvant, '`ff nouveau` ne doit pas ecrire .ff-current');

  const verified = run(['verifier', SLUG]);
  // Attendu : le site cree depuis _exemple garde des placeholders (ex: "Prenom Nom", numeros bidon) ->
  // `ff verifier` doit donc echouer (code 1), c'est le comportement voulu, pas un bug de notre test.
  assert.equal(verified.status, 1, `\`ff verifier ${SLUG}\` aurait du echouer (placeholders attendus) mais a rendu ${verified.status}\n${verified.stdout}`);

  for (const label of ['alt', 'title', 'canonical', 'ld+json']) {
    assert.match(
      verified.stdout,
      new RegExp(`✓[^\\n]*${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'),
      `\`ff verifier\` devrait afficher un ✓ mentionnant "${label}"\n--- sortie ---\n${verified.stdout}`,
    );
  }
});

// `ff tous --depuis` (22 oct 2026) : selection pure des sites a reconstruire d'apres les fichiers modifies.
test('sitesAReconstruire : fichier partage = tout, fichiers de site = ces slugs + _exemple, docs = rien', async () => {
  const { sitesAReconstruire } = await import('../scripts/ff/tous.mjs');
  const slugs = ['_exemple', 'chez-malo', 'dubois-plomberie'];
  assert.deepEqual(sitesAReconstruire(['src/lib/site.ts'], slugs), { tous: true, cause: 'src/lib/site.ts' });
  assert.deepEqual(sitesAReconstruire(['package-lock.json'], slugs), { tous: true, cause: 'package-lock.json' });
  assert.deepEqual(sitesAReconstruire(['sites/chez-malo/site.config.ts', 'docs/GOUT.md'], slugs), { tous: false, slugs: ['_exemple', 'chez-malo'] });
  assert.deepEqual(sitesAReconstruire(['sites/chez-malo/brief.md', 'studio/A-FAIRE.md', 'CLAUDE.md'], slugs), { tous: false, slugs: ['_exemple'] });
  assert.deepEqual(sitesAReconstruire(['sites/inconnu/site.config.ts'], slugs), { tous: false, slugs: ['_exemple'] }, 'un site supprime ou _test n est pas construit');
  assert.deepEqual(sitesAReconstruire([], slugs), { tous: false, slugs: ['_exemple'] });
});
