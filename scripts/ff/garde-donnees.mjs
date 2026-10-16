// Garde « données de test » avant mise en ligne : un site buildé (dist/<slug>) ne doit montrer ni le
// téléphone de test de sites/_exemple (06 00 00 00 00, +33600000000, wa.me/33600000000, quel que soit
// l'espacement), ni le code postal 75000 (n'existe pas : Paris va de 75001 à 75020 + 75116), ni des
// mentions légales vides d'identité (ni SIRET/RCS/RM/RNE, ni avis « en cours de création »).
// `src/layouts/Base.astro` retire déjà ces deux données de test du JSON-LD (même repères que
// scripts/ff/kit.mjs) ; ici on bloque la page visible elle-même.
//
// Bloquant dans `ff verifier`, `ff deploy` et `ff vercel`, SAUF pour un site de démonstration
// (estSiteDemo : slug en `_…` ou `demo-…`, ou en-tête « DEMO » dans site.config.ts, la convention des
// sites fictifs de la vitrine) : là, les échecs deviennent des avertissements, une démo reste
// déployable. Fonctions pures (controlerDonneesTest, estSiteDemo) testées dans tests/garde-donnees.test.mjs.
import fs from 'node:fs';
import path from 'node:path';

// 06 00 00 00 00 sous toutes ses formes : 0600000000, 06.00.00.00.00, 06-00-…, +33 6 00 00 00 00,
// +33 (0)6 00 00 00 00, 0033 6…, 33600000000 (wa.me), tel:+33600000000.
export const RE_TEL_TEST = /(?<!\d)(?:\+\s?33|0033|33|0)[\s.\-]?(?:\(0\)\s?)?6(?:[\s.\-  ]?0){8}(?!\d)/;
// 75000 employé comme code postal (texte visible) — pas un montant (« 75000 € ») ni un nombre plus long.
export const RE_CP_TEST = /(?<![\d.,])\b75000\b(?![\d.,]|\s?(?:€|euros?\b|EUR\b|km\b|m²|habitants\b))/i;
const RE_CP_JSONLD = /"postalCode"\s*:\s*"75000"/;
// Mentions légales : une identité d'entreprise, ou l'avis honnête qu'elle n'existe pas encore.
const RE_IDENTITE_LEGALE = /\bSIRE[NT]\b|\bR\.?C\.?S\b|\bRNE\b|r[ée]pertoire des m[ée]tiers|registre du commerce|en cours (?:de |d['’])?(?:cr[ée]ation|immatriculation)|site de d[ée]monstration/i;

/** Textes propres au modèle sites/_exemple, qui ne doivent jamais sortir d'un autre site. */
// + l'e-mail et l'adresse du modèle : `ff nouveau` les laisse, et un formulaire mailto vers
// contact@exemple.fr part dans le vide (avant le 14 oct 2026, seul `ff verifier` le voyait, pas `ff deploy`).
export const RE_DONNEES_EXEMPLE = [/Claire D\./, /Marc & Sophie/, /Menuiserie Vasseur/, /Julien Vasseur/, /MAAF n°\s?000 000/, /exactement le dessin validé/, /Escalier en chêne posé en une journée/, /@exemple\.fr\b/, /rue de l['’]Épeule/];

/** HTML sans <style>, sans scripts (sauf JSON-LD), sans attributs de style ni géométrie SVG (faux positifs numériques). */
function htmlUtile(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/\s(?:style|d|points|viewBox|transform|srcset|sizes)\s*=\s*("[^"]*"|'[^']*')/gi, ' ');
}

function texteVisible(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ');
}

/**
 * Contrôle pur. `pages` = [{ chemin: 'index.html', html }], chemins relatifs à dist/<slug> (séparateur
 * `/`). Renvoie des checks { pass, label } au format de `ff verifier`.
 */
export function controlerDonneesTest(pages) {
  const checks = [];
  const tel = pages.filter((p) => RE_TEL_TEST.test(htmlUtile(p.html))).map((p) => p.chemin);
  checks.push(tel.length
    ? { pass: false, label: `Téléphone de test (06 00 00 00 00 / +33600000000) dans : ${tel.join(', ')} — mettre le vrai numéro (contact.phone, phoneDisplay, whatsapp)` }
    : { pass: true, label: 'Pas de téléphone de test (06 00 00 00 00)' });

  const cp = pages.filter((p) => RE_CP_TEST.test(texteVisible(p.html)) || RE_CP_JSONLD.test(p.html)).map((p) => p.chemin);
  checks.push(cp.length
    ? { pass: false, label: `Code postal de test 75000 dans : ${cp.join(', ')} — mettre la vraie adresse (contact.address)` }
    : { pass: true, label: 'Pas de code postal de test (75000)' });

  // Contenu du modèle sites/_exemple resté dans un site : ses avis (« Claire D. », « Marc & Sophie »),
  // sa note Google 4,9 sur 37 avis et son identité sont FICTIFS. `ff nouveau` copiait tout cela dans
  // chaque nouveau site (rodage du 13 oct 2026) : publier ces avis serait une pratique commerciale
  // trompeuse (art. L121-2 du Code de la consommation). Bloquant sauf sur un site de démonstration
  // (garderDonneesTest passe alors tout en avertissement).
  const exemple = pages
    .filter((p) => { const t = htmlUtile(p.html).replace(/&amp;/g, '&'); return RE_DONNEES_EXEMPLE.some((re) => re.test(t)); })
    .map((p) => p.chemin);
  checks.push(exemple.length
    ? { pass: false, label: `Contenu fictif du modèle _exemple (avis, note Google 4,9/37, Menuiserie Vasseur, contact@exemple.fr, rue de l’Épeule) dans : ${exemple.join(', ')} — tout remplacer par les données du brief, ou supprimer (proof, insurance, legal)` }
    : { pass: true, label: 'Aucun contenu fictif du modèle _exemple' });

  const ml = pages.find((p) => p.chemin === 'mentions-legales.html' || p.chemin === 'mentions-legales/index.html');
  if (!ml) {
    checks.push({ pass: false, label: 'Mentions légales absentes (mentions-legales.html) : obligatoires (LCEN art. 6)' });
  } else if (!RE_IDENTITE_LEGALE.test(texteVisible(ml.html))) {
    checks.push({
      pass: false,
      label: 'Mentions légales sans identité : ni SIRET/RCS/RM, ni avis « en cours de création » — renseigner business.siret (et legalForm), ou un texte sur mesure sites/<slug>/legal/MentionsLegales.astro (docs/CONVENTIONS.md § Pages légales)',
    });
  } else {
    checks.push({ pass: true, label: 'Mentions légales : identité de l’éditeur (SIRET ou avis « en cours de création »)' });
  }
  return checks;
}

/** Site de démonstration : slug `_…`/`demo-…`, ou « DEMO » dans les premières lignes de site.config.ts. */
export function estSiteDemo(slug, configSrc = '') {
  if (slug.startsWith('_') || slug.startsWith('demo-')) return true;
  return /\bDEMO\b/.test(configSrc.split(/\r?\n/).slice(0, 8).join('\n')) || /\bdemo\s*:\s*true\b/.test(configSrc);
}

function listerHtml(dir, base = dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listerHtml(p, base));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

/**
 * Wrapper disque : lit dist/<slug>/**\/*.html et sites/<slug>/site.config.ts. Renvoie
 * { demo, checks, warnings, ok } — sur un site de démo, les échecs passent en warnings et ok reste vrai.
 */
export function garderDonneesTest({ slug, distDir, sitesDir }) {
  const configPath = path.join(sitesDir, slug, 'site.config.ts');
  const demo = estSiteDemo(slug, fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf8') : '');
  const pages = fs.existsSync(distDir)
    ? listerHtml(distDir).map((f) => ({ chemin: path.relative(distDir, f).split(path.sep).join('/'), html: fs.readFileSync(f, 'utf8') }))
    : [];
  const bruts = controlerDonneesTest(pages);
  if (!demo) return { demo, checks: bruts, warnings: [], ok: bruts.every((x) => x.pass) };
  return {
    demo,
    checks: bruts.filter((x) => x.pass),
    warnings: bruts.filter((x) => !x.pass).map((x) => `${x.label} (site de démonstration : non bloquant)`),
    ok: true,
  };
}
