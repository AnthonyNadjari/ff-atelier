// `ff contrat <slug> [<slug-b> …]` : contrôle de forme du contrat de direction (sites/<slug>/direction.md,
// modèle .claude/skills/site-final/direction-modele.md) AVANT de construire. Ce qui se vérifie à la machine
// (sections présentes, faits sourcés dans le brief, quatre lignes MOUVEMENT sans attribut du moteur, deux régimes,
// références réelles, polices hors liste IA, accord avec l'aiguillage) ne mobilise plus l'étape 2 de /site-final
// (« attaquer le contrat »), qui garde le jugement : l'idée est-elle celle du client ou du métier ?
//
// Pourquoi (17 oct 2026) : la skill doit produire le résultat final en moins d'itérations ; un contrat bancal se
// paie une heure plus tard, au build. Rouge = corriger le contrat, jamais assouplir la règle.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SITES_DIR, resolveSlug, ok, fail, warn, info, parseArgs } from './util.mjs';
import { CLES_IA } from './ia.mjs';
import { aiguillageDuSite, mouvementDuContrat } from './aiguillage.mjs';

const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’ʼ]/g, "'");

/** Pure : sections `## Titre` → texte. */
export function sections(md) {
  const out = {};
  const parts = (md || '').replace(/\r/g, '').split(/^## +/m).slice(1);
  for (const p of parts) {
    const i = p.indexOf('\n');
    out[norm(p.slice(0, i).replace(/\s*\(.*$/, '').trim())] = p.slice(i + 1).trim();
  }
  return out;
}

/** Pure : lignes `- CLÉ :` du contrat (THÈSE, SQUELETTE, PREMIER ÉCRAN, MOUVEMENT, REFUSÉ, FIN). */
export function lignesContrat(texte) {
  const out = {};
  const re = /^- ([A-ZÉÈÀ][A-ZÉÈÀ ]{2,})\s*(?:\([^)]*\))?\s*:/gm;
  const m = [...(texte || '').matchAll(re)];
  m.forEach((x, i) => {
    const fin = i + 1 < m.length ? m[i + 1].index : texte.length;
    out[norm(x[1]).trim()] = texte.slice(x.index + x[0].length, fin).trim();
  });
  return out;
}

/** Pure : les faits numérotés (« 1. … ») d'une section. */
export function faits(texte) {
  return [...(texte || '').matchAll(/^\s*\d+\.\s+(.+(?:\n(?!\s*\d+\.)\s+.+)*)/gm)].map((m) => m[1].replace(/\s+/g, ' ').trim()).filter((f) => f.length > 3);
}

/** Pure : un fait est « sourcé » si un de ses nombres, ou un de ses mots de 5 lettres et plus, est dans le brief. */
export function faitSource(fait, brief) {
  const b = norm(brief);
  const nombres = fait.match(/\d[\d  ]*\d|\d/g) || [];
  if (nombres.some((n) => b.includes(norm(n).replace(/\s+/g, ' ')) || b.includes(norm(n).replace(/\s+/g, '')))) return true;
  const mots = (norm(fait).match(/[a-z]{5,}/g) || []).filter((w) => !MOTS_COMMUNS.has(w));
  const trouves = mots.filter((w) => b.includes(w));
  return mots.length > 0 && trouves.length >= Math.min(2, mots.length);
}
const MOTS_COMMUNS = new Set('client clients boutique atelier maison metier depuis toujours jamais chaque comme aussi avant apres entre autre autres notre votre leurs cette celle celui faire monde chose choses encore'.split(' '));

const ATTRIBUTS_MOTEUR = /\bdata-(?:split|reveal|stagger|scrub|parallax|pin|horizontal|frames|draw|counter|marquee|text-fill|stack)\b|\bgsap\b|scrolltrigger|\blenis\b|splittext/i;

/** Pure : analyse d'un contrat. `fiches` = noms (sans .md) des démontages disponibles. */
export function analyserContrat({ contrat, brief, fiches = [], directions = [], decision = null }) {
  const echecs = [], alertes = [];
  contrat = (contrat || '').replace(/\r/g, '');
  const sec = sections(contrat);
  if (!contrat?.trim()) return { echecs: ['direction.md absent ou vide'], alertes: [] };
  if (/<[a-zé ]+>|\[un fait de la liste\]|\[le dispositif/i.test(contrat)) echecs.push('des crochets ou chevrons du modèle sont restés (« <…> », « [un fait…] ») : le contrat n\'est pas rempli');
  for (const s of ['faits propres', 'phrase-idee', 'test du concurrent', 'contrat', 'typographie', 'references']) {
    if (!Object.keys(sec).some((k) => k.startsWith(s))) echecs.push(`section « ${s} » absente`);
  }
  const f = faits(sec[Object.keys(sec).find((k) => k.startsWith('faits propres')) || '']);
  if (f.length < 8) echecs.push(`${f.length} fait(s) propre(s), il en faut 8 à 12`);
  else if (f.length > 12) alertes.push(`${f.length} faits propres (12 au plus : garder les plus singuliers)`);
  const sansSource = f.filter((x) => !faitSource(x, brief));
  if (sansSource.length) echecs.push(`fait(s) introuvable(s) dans le brief : ${sansSource.map((x) => `« ${x.slice(0, 60)}${x.length > 60 ? '…' : ''} »`).join(' ; ')}`);
  const idee = sec[Object.keys(sec).find((k) => k.startsWith('phrase-idee')) || ''] || '';
  if (idee.replace(/[«»"]/g, '').trim().length < 30) echecs.push('phrase-idée vide ou trop courte');
  const test = sec[Object.keys(sec).find((k) => k.startsWith('test du concurrent')) || ''] || '';
  if (test.trim().length < 40 || /^le concurrent le plus proche \(la boutique/i.test(test.trim())) echecs.push('test du concurrent non écrit (il faut le résultat, pas la consigne)');
  const lc = lignesContrat(sec.contrat || '');
  for (const cle of ['these', 'squelette', 'premier ecran', 'mouvement', 'refuse', 'fin']) {
    const k = Object.keys(lc).find((x) => x.startsWith(cle));
    if (!k) echecs.push(`ligne ${cle.toUpperCase()} absente du contrat`);
    else if (cle !== 'fin' && lc[k].length < (cle === 'refuse' ? 20 : 40)) echecs.push(`ligne ${cle.toUpperCase()} trop courte pour être une décision`);
  }
  const mouv = lc[Object.keys(lc).find((x) => x.startsWith('mouvement')) || ''] || '';
  if (mouv) {
    const n = (mouv.match(/^\s*[1-4]\.\s/gm) || []).length;
    if (n < 4) echecs.push(`MOUVEMENT : ${n} ligne(s) numérotée(s), il en faut quatre (entrée, rythme, geste, image)`);
    const attr = ATTRIBUTS_MOTEUR.exec(mouv);
    if (attr) echecs.push(`MOUVEMENT nomme un outil (« ${attr[0]} ») : on décrit ce qu'on voit, l'outil vient après`);
    const m = norm(mouv);
    if (!/\bsec\b/.test(m) || !/\blent|rebond/.test(m)) echecs.push('MOUVEMENT : les deux régimes de courbe (sec / lent ou à rebond) ne sont pas nommés');
    if (/titre[^.]{0,40}(monte|se leve|ligne par ligne|par lignes)/.test(m)) alertes.push('MOUVEMENT fait bouger un titre : on anime une chose du métier (GOUT § 4)');
    if (/rideau/.test(m) && !/pas de rideau|sans rideau|aucun rideau/.test(m)) alertes.push('MOUVEMENT parle d\'un rideau (signe IA, GOUT § 2)');
  }
  const refs = sec[Object.keys(sec).find((k) => k.startsWith('references')) || ''] || '';
  const citees = fiches.filter((n) => norm(refs).includes(norm(n)));
  if (fiches.length && citees.length < 2) alertes.push(`références : ${citees.length} fiche(s) de démontage citée(s) (il en faut deux, avec le geste repris)`);
  const typo = sec[Object.keys(sec).find((k) => k.startsWith('typographie')) || ''] || '';
  const ia = CLES_IA.filter((c) => new RegExp(`\\b${c}\\b`, 'i').test(typo));
  if (ia.length) echecs.push(`typographie : police de la liste IA (${ia.join(', ')})`);
  if (directions.length) {
    const dir = directions.find((d) => new RegExp(`\\b${d}\\b`, 'i').test(typo));
    if (!dir) alertes.push('typographie : aucune direction connue nommée (ff composer <slug> en propose)');
  }
  if (decision) {
    const mc = mouvementDuContrat(contrat);
    if (decision.mouvement && !mc) echecs.push(`aiguillage : le client a répondu « ${decision.mouvement} », la ligne « Mouvement : … » manque en tête du contrat`);
    else if (decision.ecart) echecs.push(`aiguillage : le contrat dit « ${mc} », le client a répondu « ${decision.mouvement} »`);
    if (decision.photos === 'liste-de-prises' && !/liste de prises|prises? :|photos? à (?:prendre|faire)/i.test(contrat)) echecs.push('aiguillage : le client veut des photos sans en avoir, le contrat n\'écrit pas la liste de prises');
  }
  return { echecs, alertes, nFaits: f.length };
}

export function cmdContrat(args) {
  const { positional } = parseArgs(args);
  const slugs = positional.length ? positional.map(resolveSlug) : [resolveSlug()];
  const fiches = fs.existsSync(path.join(ROOT, 'docs/veille/demontages')) ? fs.readdirSync(path.join(ROOT, 'docs/veille/demontages')).filter((f) => f.endsWith('.md') && f !== 'INDEX.md').map((f) => f.replace(/\.md$/, '')) : [];
  const directions = fs.existsSync(path.join(ROOT, 'src/directions')) ? fs.readdirSync(path.join(ROOT, 'src/directions'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name) : [];
  let rouge = false;
  for (const slug of slugs) {
    const dir = path.join(SITES_DIR, slug);
    const lire = (f) => (fs.existsSync(path.join(dir, f)) ? fs.readFileSync(path.join(dir, f), 'utf8') : '');
    const brief = lire('brief.md');
    if (!brief) { fail(`${slug} : brief.md absent, impossible de sourcer les faits.`); rouge = true; continue; }
    const r = analyserContrat({ contrat: lire('direction.md'), brief, fiches, directions, decision: aiguillageDuSite(slug)?.decision ?? null });
    info(`Contrat de ${slug} (${r.nFaits ?? 0} faits propres)`);
    for (const e of r.echecs) fail(`  ${e}`);
    for (const a of r.alertes) warn(`  ${a}`);
    if (!r.echecs.length) ok(`  forme du contrat correcte ; reste l'attaque (SKILL.md § 2) : l'idée est-elle celle du client ?`);
    rouge ||= r.echecs.length > 0;
  }
  if (rouge) process.exitCode = 1;
}
