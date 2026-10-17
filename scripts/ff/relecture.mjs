// `ff relecture <slug>` : assemble les deux prompts des relecteurs de /site-final (DA et rédacteur) à partir de
// .claude/skills/site-final/relecteurs/ (prompt + barème de confiance + grille à plafonds + sortie de
// `ff variete`), prêts à donner tels quels à deux agents neufs. Sortie : captures/relecture/<slug>-da.txt et
// <slug>-redacteur.txt (dossier local, jamais commité).
//
// Pourquoi une commande : au premier test de la skill (fromagerie-ravanel, 16 oct 2026), l'assemblage à la main
// (remplacer <slug>, coller trois fichiers et la variété) a pris trois essais. Un prompt mal assemblé donne un
// relecteur qui juge sans grille ou sans la charte : la relecture ne vaut plus rien.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, resolveSlug, ok, fail, parseArgs } from './util.mjs';
import { effectiveLook } from './look-data.mjs';
import { listSites } from './util.mjs';
import { aiguillageDuSite } from './aiguillage.mjs';

const DOSSIER = path.join(ROOT, '.claude', 'skills', 'site-final', 'relecteurs');

/** Tableau texte de la variété (slug, direction, nav, hero, footer, sections), comme `ff variete`. */
export function tableauVariete(rows) {
  const tete = 'slug'.padEnd(22) + 'direction'.padEnd(13) + 'nav'.padEnd(12) + 'hero'.padEnd(14) + 'footer'.padEnd(10) + 'sections';
  return [tete, ...rows.map((r) => (r.slug ?? '?').padEnd(22) + (r.direction ?? '?').padEnd(13) + (r.nav ?? '?').padEnd(12) + (r.hero ?? '?').padEnd(14) + (r.footer ?? '?').padEnd(10) + (r.sections || []).map((s) => `${s.type}:${s.variant}`).join(', '))].join('\n');
}

/** Pure : un prompt de relecteur assemblé. `brut` = contenu du fichier relecteurs/<nom>.md. */
export function assemblerPrompt(brut, { slug, bareme, grille, variete, complement = '' }) {
  const corps = brut.includes('\n---\n') ? brut.split('\n---\n').slice(1).join('\n---\n').trim() : brut.trim();
  const out = corps
    .replaceAll('<slug>', slug)
    .replace('[SORTIE DE ff variete]', variete)
    .replace('[CONTENU DE relecteurs/bareme.md]', bareme.trim())
    .replace('[CONTENU DE relecteurs/grille.md]', grille.trim());
  return `Dépôt : ${ROOT.split(path.sep).join('/')} (chemins relatifs à ce dossier).\n\n${out}\n${complement ? '\n' + complement + '\n' : ''}`;
}

/** Ce que les contrôles mécaniques ont déjà dit de ce site : ff pistes (captures/<base>-pistes.json) et ff aiguillage. */
export function complementMecanique(slug) {
  const lignes = [];
  const base = slug.replace(/-[b-h]$/, '');
  const pj = path.join(ROOT, 'captures', `${base}-pistes.json`);
  if (fs.existsSync(pj)) {
    try {
      const j = JSON.parse(fs.readFileSync(pj, 'utf8'));
      const miennes = (j.paires || []).filter((p) => p.a === slug || p.b === slug);
      if (miennes.length) lignes.push(`ff pistes (${j.film || 'sans film'}) : ` + miennes.map((p) => `${p.a === slug ? p.b : p.a} : ${p.partages.length ? 'partage ' + p.partages.join(', ') : 'aucun axe partagé'}${p.distanceImage != null ? `, image à 400 ms ${p.distanceImage.toFixed(2)}` : ''}`).join(' ; ') + '.');
    } catch {}
  }
  try {
    const a = aiguillageDuSite(slug);
    if (a) lignes.push(`ff aiguillage : photos ${a.decision.photos}, mouvement ${a.decision.mouvement ?? 'non tranché'}${a.decision.ecart ? ' (CONTRAT EN DÉSACCORD avec le client)' : ''}.`);
  } catch {}
  return lignes.length ? 'CONTRÔLES MÉCANIQUES DÉJÀ FAITS (ne pas refaire, mais vérifier sur les captures que le site les respecte) :\n- ' + lignes.join('\n- ') : '';
}

export function cmdRelecture(args) {
  const { positional } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  if (!fs.existsSync(DOSSIER)) {
    fail(`Dossier des relecteurs introuvable : ${path.relative(ROOT, DOSSIER)}`);
    process.exit(1);
  }
  const lire = (f) => fs.readFileSync(path.join(DOSSIER, f), 'utf8');
  const rows = listSites({ excludeUnderscore: true }).map((s) => {
    const l = effectiveLook(s);
    return l ? { slug: s, direction: l.direction, nav: l.nav, hero: l.hero, footer: l.footer, sections: l.sections } : null;
  }).filter(Boolean);
  const commun = { slug, bareme: lire('bareme.md'), grille: lire('grille.md'), variete: tableauVariete(rows), complement: complementMecanique(slug) };
  const dest = path.join(ROOT, 'captures', 'relecture');
  fs.mkdirSync(dest, { recursive: true });
  for (const nom of ['da', 'redacteur']) {
    const sortie = path.join(dest, `${slug}-${nom}.txt`);
    fs.writeFileSync(sortie, assemblerPrompt(lire(`${nom}.md`), commun));
    ok(`Prompt ${nom === 'da' ? 'DA' : 'rédacteur'} : ${path.relative(ROOT, sortie)}`);
  }
}
