#!/usr/bin/env node
/**
 * Génère sites/<slug>/site.config.ts depuis sites/<slug>/brief.md, sans passer par Claude Code.
 * Même logique que la compétence .claude/skills/nouveau-site, mais pilotée par l'API Anthropic
 * directement — pour une automatisation complète (ex. appelé depuis scrapping_artisans).
 *
 * Usage : node scripts/ff-generer.mjs <slug>
 *
 * Lit ANTHROPIC_API_KEY dans l'environnement, sinon dans .env (parsé à la main, sans dépendance).
 * Écrit sites/<slug>/site.config.ts (l'ancien fichier, s'il existe, est sauvegardé en .bak).
 * Lance ensuite `node scripts/ff.mjs build <slug>` ; en cas d'échec, renvoie l'erreur au modèle
 * une fois pour correction, puis rapporte le résultat final.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, copyFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const MODEL = 'claude-sonnet-5';
const MAX_TOKENS = 16000;
const TEMPERATURE = 0.7;

function erreur(message) {
  console.error(`Erreur : ${message}`);
  process.exit(1);
}

// ---- 1. Argument ----
const slug = process.argv[2];
if (!slug) {
  erreur('slug manquant. Usage : node scripts/ff-generer.mjs <slug>');
}
if (!/^_?[a-z0-9-]+$/.test(slug)) {
  erreur(`slug "${slug}" invalide. Attendu : lettres minuscules, chiffres, tirets (ex. plomberie-martin).`);
}

// ---- 2. Brief ----
const briefPath = resolve('sites', slug, 'brief.md');
if (!existsSync(briefPath)) {
  erreur(
    `brief introuvable : sites/${slug}/brief.md. Copie docs/BRIEF.md à cet emplacement et remplis-le d'abord.`,
  );
}
const brief = readFileSync(briefPath, 'utf8');

// ---- 3. Clé API : environnement, sinon .env parsé à la main ----
function parseDotEnv(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const rawLine of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

const dotEnv = parseDotEnv(resolve('.env'));
const apiKey = process.env.ANTHROPIC_API_KEY || dotEnv.ANTHROPIC_API_KEY;
if (!apiKey) {
  erreur(
    "ANTHROPIC_API_KEY absente. Ajoute-la dans .env (copie .env.example) ou exporte-la dans l'environnement avant de relancer.",
  );
}
process.env.ANTHROPIC_API_KEY = apiKey;

// ---- 4. SDK Anthropic (import dynamique pour un message propre s'il manque) ----
let Anthropic;
try {
  ({ default: Anthropic } = await import('@anthropic-ai/sdk'));
} catch {
  erreur("le paquet @anthropic-ai/sdk n'est pas installé. Lance `npm install @anthropic-ai/sdk` puis relance.");
}
const client = new Anthropic();

// ---- 5. Contexte : schéma, guide de directions, sites existants, exemple ----
const schemaSource = readFileSync(resolve('src/lib/schema.ts'), 'utf8');
const directionsGuide = readFileSync(resolve('docs/DIRECTIONS.md'), 'utf8');
const exempleConfig = readFileSync(resolve('sites/_exemple/site.config.ts'), 'utf8');

function runNode(args) {
  const r = spawnSync(process.execPath, args, { encoding: 'utf8', cwd: process.cwd() });
  return { status: r.status ?? 1, out: `${r.stdout || ''}${r.stderr || ''}`.trim() };
}

const variete = runNode(['scripts/ff.mjs', 'variete']);
const varieteTexte =
  variete.status === 0 && variete.out
    ? variete.out
    : "(commande `ff variete` indisponible ou sans sortie pour le moment — choisis la direction sans référence aux sites existants, en le signalant dans le résumé)";

const imagesDir = resolve('sites', slug, 'public', 'images');
const imagesDisponibles = existsSync(imagesDir) ? readdirSync(imagesDir) : [];
const imagesTexte =
  imagesDisponibles.length > 0
    ? imagesDisponibles.map((f) => `/images/${f}`).join(', ')
    : "aucune — laisse tous les champs image absents";

// ---- 6. Prompt ----
const systemPrompt = `Tu génères le fichier sites/${slug}/site.config.ts pour un site vitrine d'artisan (studio Finck & Fisch), en français, à partir d'un brief client.

Règles impératives :
- Réponds UNIQUEMENT avec le contenu complet du fichier TypeScript. Pas de markdown, pas de \`\`\`, pas de commentaire avant ou après, pas d'explication.
- Le fichier doit commencer par : import { defineSite } from '@/lib/schema';
- Utilise exactement les noms de DIRECTIONS, MOTION et VARIANTS définis dans le schéma ci-dessous. Toute variante inconnue fait planter le build.
- N'invente JAMAIS un chiffre, un avis, une note Google, un nombre d'années : si le brief ne le donne pas, omets le champ (ne mets pas de valeur plausible à sa place). Un faux avis est une pratique commerciale trompeuse illégale (art. L121-2 du Code de la consommation) — proof.testimonials doit rester vide si le brief n'a pas d'avis réel avec sa source.
- Textes en français, vouvoiement (jamais le tutoiement), registre concret et local, sans cliché marketing ("votre satisfaction est notre priorité", etc.).
- business.tagline peut contenir un seul <em>...</em> autour du mot à accentuer.
- Les champs texte long (description, story, services[].description, faq[].a) séparent leurs paragraphes par une ligne vide.
- Un champ image (img : { src, alt, caption? }) ne doit être rempli QUE si le fichier existe réellement. Images disponibles dans sites/${slug}/public/images/ : ${imagesTexte}. Pour toute autre image, laisse le champ absent.
- Applique la règle de variété : ne choisis pas la même direction + le même hero qu'un site existant du même métier ou de la même ville (voir la sortie de \`ff variete\` ci-dessous).

--- src/lib/schema.ts (schéma complet, source de vérité) ---
${schemaSource}

--- docs/DIRECTIONS.md (guide de choix de direction et de variantes) ---
${directionsGuide}

--- sortie de \`node scripts/ff.mjs variete\` (combinaisons déjà utilisées par les sites existants) ---
${varieteTexte}

--- sites/_exemple/site.config.ts (référence de structure et de style, chiffres fictifs à ne pas réutiliser) ---
${exempleConfig}`;

const userPrompt = `Voici le brief du client, rempli depuis docs/BRIEF.md. Génère sites/${slug}/site.config.ts en respectant toutes les règles du message système. Le slug est "${slug}".

--- brief ---
${brief}`;

// ---- 7. Appel API ----
function texteDe(message) {
  const bloc = message.content.find((b) => b.type === 'text');
  return bloc ? bloc.text : '';
}

function extraireCode(texte) {
  const t = texte.trim();
  if (t.startsWith('```')) {
    const lignes = t.split('\n');
    lignes.shift();
    if (lignes[lignes.length - 1].trim().startsWith('```')) lignes.pop();
    return lignes.join('\n');
  }
  return t;
}

async function demanderAuModele(messages) {
  try {
    return await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      system: systemPrompt,
      messages,
    });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      erreur("clé ANTHROPIC_API_KEY invalide ou refusée par l'API.");
    } else if (err instanceof Anthropic.RateLimitError) {
      erreur("limite de débit atteinte sur l'API Anthropic. Réessaie dans quelques instants.");
    } else if (err instanceof Anthropic.APIError) {
      erreur(`l'API Anthropic a répondu une erreur (${err.status ?? '?'}) : ${err.message}`);
    }
    throw err;
  }
}

console.log(`Génération de sites/${slug}/site.config.ts...`);
const messages = [{ role: 'user', content: userPrompt }];
const premiereReponse = await demanderAuModele(messages);
const premierTexte = texteDe(premiereReponse);
if (!premierTexte) {
  erreur("réponse vide du modèle (peut-être un refus ou un appel d'outil inattendu).");
}

// ---- 8. Écriture (avec sauvegarde) ----
const configPath = resolve('sites', slug, 'site.config.ts');
if (existsSync(configPath)) {
  copyFileSync(configPath, `${configPath}.bak`);
  console.log(`Ancien fichier sauvegardé : sites/${slug}/site.config.ts.bak`);
}
writeFileSync(configPath, extraireCode(premierTexte));
console.log(`Écrit : sites/${slug}/site.config.ts`);

// ---- 9. Build, avec une correction possible ----
console.log('Build...');
let build = runNode(['scripts/ff.mjs', 'build', slug]);

if (build.status !== 0) {
  console.log("Le build a échoué. Renvoi de l'erreur au modèle pour une correction...");
  messages.push({ role: 'assistant', content: premierTexte });
  messages.push({
    role: 'user',
    content: `Le build de sites/${slug}/site.config.ts a échoué avec l'erreur suivante. Corrige-la et renvoie le fichier TypeScript complet, toujours sans markdown ni commentaire.\n\n--- erreur de build ---\n${build.out}`,
  });
  const deuxiemeReponse = await demanderAuModele(messages);
  const deuxiemeTexte = texteDe(deuxiemeReponse);
  if (deuxiemeTexte) {
    writeFileSync(configPath, extraireCode(deuxiemeTexte));
    console.log(`Réécrit après correction : sites/${slug}/site.config.ts`);
    console.log('Nouveau build...');
    build = runNode(['scripts/ff.mjs', 'build', slug]);
  }
}

// ---- 10. Rapport final ----
if (build.status === 0) {
  console.log(`\nSite "${slug}" généré et buildé avec succès.`);
  console.log('Relis sites/BRIEF.md et le résumé de site.config.ts avant de livrer : les avis, notes');
  console.log("Google et images non fournies dans le brief ont été laissés vides, pas inventés.");
} else {
  console.error(`\nLe build échoue encore pour "${slug}" après une tentative de correction automatique.`);
  console.error('Sortie du build :\n' + build.out);
  console.error(`Corrige sites/${slug}/site.config.ts à la main, ou relance node scripts/ff-generer.mjs ${slug}.`);
  process.exit(1);
}
