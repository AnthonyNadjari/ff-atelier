// `ff brief <numéro> [slug]` : lit un ticket « brief » ouvert par le formulaire client (outils/brief-form, GitHub
// Issues du dépôt) avec la CLI `gh`, crée le site s'il n'existe pas (`ff nouveau`), et écrit sites/<slug>/brief.md.
// `ff brief --liste` : les tickets « brief » ouverts. Le brief reste celui du client, mot pour mot : la suite est
// `/site-final <slug>`.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { SITES_DIR, ROOT, ok, fail, info, parseArgs } from './util.mjs';

const gh = (args) => spawnSync('gh', args, { cwd: ROOT, encoding: 'utf8' });

/** Pure : le slug proposé que le formulaire écrit dans le brief (« Slug proposé : `x` »). */
export function slugDuBrief(corps) {
  return /Slug proposé : `([a-z0-9-]+)`/.exec(corps || '')?.[1] ?? null;
}

export function cmdBrief(args) {
  const { positional, flags } = parseArgs(args);
  if (flags.liste || positional.length === 0) {
    const r = gh(['issue', 'list', '--label', 'brief', '--state', 'open', '--json', 'number,title,createdAt', '--jq', '.[] | "#\\(.number)  \\(.createdAt[:10])  \\(.title)"']);
    if (r.status !== 0) { fail(`gh issue list a échoué : ${r.stderr.trim()}`); process.exit(1); }
    info(r.stdout.trim() || 'Aucun brief en attente.');
    if (positional.length === 0) info('Usage : ff brief <numéro> [slug]');
    return;
  }
  const numero = String(positional[0]).replace(/^#/, '');
  const r = gh(['issue', 'view', numero, '--json', 'body,title,labels']);
  if (r.status !== 0) { fail(`Ticket #${numero} illisible : ${r.stderr.trim()}`); process.exit(1); }
  const ticket = JSON.parse(r.stdout);
  if (!ticket.labels?.some((l) => l.name === 'brief')) { fail(`Le ticket #${numero} n'a pas l'étiquette « brief ».`); process.exit(1); }
  const slug = positional[1] || slugDuBrief(ticket.body);
  if (!slug) { fail('Aucun slug : donne-le en second argument.'); process.exit(1); }
  const dossier = path.join(SITES_DIR, slug);
  if (!fs.existsSync(dossier)) {
    const n = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'ff.mjs'), 'nouveau', slug], { cwd: ROOT, stdio: 'inherit' });
    if (n.status !== 0) process.exit(n.status ?? 1);
  }
  const dest = path.join(dossier, 'brief.md');
  fs.writeFileSync(dest, ticket.body.endsWith('\n') ? ticket.body : `${ticket.body}\n`);
  ok(`Brief du ticket #${numero} écrit dans ${path.relative(ROOT, dest)}. Suite : /site-final ${slug}`);
}
