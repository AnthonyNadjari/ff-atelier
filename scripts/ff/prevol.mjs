// `ff prevol <slug> [<slug-b> …] [--sans-navigateur] [--sans-build]` : TOUS les contrôles mécaniques de /site-final
// en une commande, dans l'ordre, avec le verrou de build, un seul Chrome à la fois, et une table ✓/✗ à la fin.
// Par piste : contrat → aiguillage → build → verifier (a11y compris) → audit-motion → nettete → ressemblance
// (premier écran ET déroulé de l'accueil contre tous les sites du registre) → detect → perf ; puis signatures ; puis,
// s'il y a plusieurs pistes, pistes (film comparé). Sort en erreur si une étape échoue.
//
// Pourquoi (17 oct 2026) : la skill lançait neuf commandes à la main, piste par piste, et en oubliait ; chaque
// oubli se payait en tour de relecture. Une commande, une table, et on ne regarde les captures que quand tout
// est vert. `.ff-tmp/prevol-<slug>.json` garde le détail pour le compte rendu.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, SITES_DIR, resolveSlug, ok, fail, info, warn, parseArgs } from './util.mjs';

const FF = path.join(ROOT, 'scripts', 'ff.mjs');
const VERROU = path.join(ROOT, '.ff-tmp', 'build.lock');

/** Pure : les étapes d'une piste, dans l'ordre. navigateur=false retire celles qui ouvrent Chrome. */
export function etapes(slug, { navigateur = true, build = true } = {}) {
  const e = [
    { nom: 'contrat', args: ['contrat', slug], navigateur: false },
    { nom: 'aiguillage', args: ['aiguillage', slug], navigateur: false },
    build ? { nom: 'build', args: ['build', slug], navigateur: false, verrou: true } : null,
    { nom: 'verifier', args: ['verifier', slug, '--sans-build', ...(navigateur ? [] : ['--sans-a11y'])], navigateur: false },
    { nom: 'audit-motion', args: ['audit-motion', slug], navigateur: true },
    { nom: 'nettete', args: ['nettete', slug], navigateur: true },
    { nom: 'ressemblance', args: ['ressemblance', slug], navigateur: true },
    { nom: 'detect', args: ['detect', slug], navigateur: false },
    { nom: 'perf', args: ['perf', slug], navigateur: false },
  ].filter(Boolean);
  return navigateur ? e : e.filter((x) => !x.navigateur);
}

/** Pure : la table finale. */
export function tableau(resultats) {
  const l = Math.max(...resultats.map((r) => r.etape.length));
  return resultats.map((r) => `${r.ok ? '✓' : '✗'} ${r.etape.padEnd(l)}  ${r.duree}s${r.detail ? '  ' + r.detail : ''}`).join('\n');
}

function attendreVerrou() {
  const t0 = Date.now();
  while (fs.existsSync(VERROU)) {
    if (Date.now() - t0 > 10 * 60 * 1000) { warn('verrou de build présent depuis 10 min : on passe outre'); break; }
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 2000);
  }
}

function lancer(args, { verrou = false } = {}) {
  if (verrou) { attendreVerrou(); fs.mkdirSync(path.dirname(VERROU), { recursive: true }); fs.writeFileSync(VERROU, String(process.pid)); }
  const t0 = Date.now();
  let r;
  try {
    r = spawnSync(process.execPath, [FF, ...args], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  } finally {
    if (verrou) fs.rmSync(VERROU, { force: true });
  }
  const sortie = `${r.stdout || ''}${r.stderr || ''}`;
  const echecs = sortie.split('\n').filter((l) => /^\s*✗/.test(l)).map((l) => l.replace(/^\s*✗\s*/, '').trim());
  return { ok: r.status === 0, duree: ((Date.now() - t0) / 1000).toFixed(0), detail: echecs[0] ? echecs[0].slice(0, 110) + (echecs.length > 1 ? ` (+${echecs.length - 1})` : '') : '', sortie };
}

export function cmdPrevol(args) {
  const { positional, flags } = parseArgs(args);
  const slugs = positional.length ? positional.map((s) => resolveSlug(s)) : [resolveSlug()];
  const navigateur = !flags['sans-navigateur'];
  const resultats = [];
  for (const slug of slugs) {
    info(`Pré-vol de ${slug}`);
    for (const e of etapes(slug, { navigateur, build: !flags['sans-build'] })) {
      const r = lancer(e.args, { verrou: e.verrou });
      resultats.push({ piste: slug, etape: `${slug} · ${e.nom}`, ...r });
      (r.ok ? ok : fail)(`${e.nom} (${r.duree}s)${r.detail ? ' : ' + r.detail : ''}`);
      if (e.nom === 'build' && !r.ok) { warn('build en échec : les étapes suivantes de cette piste sont sautées'); break; }
    }
  }
  const r = lancer(['signatures']);
  resultats.push({ piste: '*', etape: 'signatures', ...r });
  (r.ok ? ok : fail)(`signatures (${r.duree}s)${r.detail ? ' : ' + r.detail : ''}`);
  if (slugs.length > 1) {
    const p = lancer(['pistes', ...slugs, ...(navigateur ? [] : ['--sans-film'])]);
    resultats.push({ piste: '*', etape: 'pistes', ...p });
    (p.ok ? ok : fail)(`pistes (${p.duree}s)${p.detail ? ' : ' + p.detail : ''}`);
  }
  info('\n' + tableau(resultats));
  fs.mkdirSync(path.join(ROOT, '.ff-tmp'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, '.ff-tmp', `prevol-${slugs[0]}.json`), JSON.stringify(resultats.map(({ sortie, ...x }) => x), null, 2));
  const rouges = resultats.filter((x) => !x.ok);
  if (rouges.length) { fail(`${rouges.length} étape(s) rouge(s) : corriger à la source, puis relancer. Détail : .ff-tmp/prevol-${slugs[0]}.json`); process.exitCode = 1; }
  else ok('Tout est vert : on peut regarder (planche, film, relecteurs).');
}
