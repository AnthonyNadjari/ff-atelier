#!/usr/bin/env node
/**
 * Génère sites/<slug>/site.config.ts depuis sites/<slug>/brief.md, sans passer par Claude Code.
 * Même logique que la compétence .claude/skills/nouveau-site, mais pilotée par l'API Anthropic
 * directement — pour une automatisation complète (ex. appelé depuis scrapping_artisans).
 *
 * Usage : node scripts/ff-generer.mjs <slug>
 *
 * Sortie STRUCTURÉE (depuis sept. 2026) : le modèle ne rédige plus du TypeScript libre. Il remplit
 * un objet JSON via l'outil `ecrire_site_config`, dont le schéma d'entrée EST le schéma zod du site
 * (z.toJSONSchema, src/lib/schema.ts) — descriptions de champs comprises. Le JSON est ensuite
 * validé par siteSchema (scripts/ff/ts-loader.mjs) puis sérialisé en TypeScript de façon
 * déterministe (toTs, scripts/ff/ts-literal.mjs). Résultat : plus de markdown résiduel, plus
 * d'erreur de syntaxe, et toute incohérence est renvoyée au modèle AVANT le build, pas après.
 *
 * Lit ANTHROPIC_API_KEY dans l'environnement, sinon dans .env (parsé à la main, sans dépendance).
 * Écrit sites/<slug>/site.config.ts (l'ancien fichier, s'il existe, est sauvegardé en .bak).
 * Lance ensuite `node scripts/ff.mjs build <slug>` ; en cas d'échec, renvoie l'erreur au modèle
 * une fois pour correction, puis rapporte le résultat final.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, copyFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadSchemaModule, cleanTmp } from './ff/ts-loader.mjs';
import { toTs } from './ff/ts-literal.mjs';

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

// ---- 5. Schéma : zod -> JSON Schema pour l'outil, module zod pour la validation ----
let siteSchema;
let toolInputSchema;
try {
  const { siteSchema: schema } = await loadSchemaModule();
  siteSchema = schema;
  const { z } = await import('zod');
  const js = z.toJSONSchema(siteSchema, { io: 'input' });
  delete js.$schema;
  toolInputSchema = js;
} catch (err) {
  erreur(`impossible de préparer le schéma zod -> JSON Schema : ${err.message}`);
}

const TOOL = {
  name: 'ecrire_site_config',
  description:
    "Écrit le contenu structuré du site (équivalent JSON du defineSite({...}) de sites/<slug>/site.config.ts). " +
    "Chaque champ est décrit dans le schéma. N'inclus que les champs justifiés par le brief : les absents prennent leur défaut.",
  input_schema: toolInputSchema,
};

// ---- 6. Contexte : guide de directions, sites existants, exemple ----
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

// ---- 7. Prompt ----
const systemPrompt = `Tu génères le contenu de sites/${slug}/site.config.ts pour un site vitrine d'artisan (studio Finck & Fisch), en français, à partir d'un brief client.

Tu NE rédiges PAS de TypeScript : tu appelles l'outil \`ecrire_site_config\` avec l'objet JSON du site (les champs et leurs descriptions sont dans le schéma de l'outil — c'est exactement le schéma zod que defineSite() valide). N'inclus que les champs justifiés par le brief ; les champs absents prennent leur valeur par défaut, c'est voulu.

Règles impératives :
- slug : "${slug}". direction, motion, variantes : utilise exactement les noms de l'énumération du schéma. Toute variante inconnue fait planter le build.
- N'invente JAMAIS un chiffre, un avis, une note Google, un nombre d'années : si le brief ne le donne pas, omets le champ (ne mets pas de valeur plausible à sa place). Un faux avis est une pratique commerciale trompeuse illégale (art. L121-2 du Code de la consommation) — proof.testimonials doit rester vide si le brief n'a pas d'avis réel avec sa source.
- conseils (articles) : seulement les articles que le brief donne (section 10bis, texte du client) ; sinon laisse le champ absent. N'écris jamais un article à la place du client.
- Textes en français, vouvoiement (jamais le tutoiement), registre concret et local, sans cliché marketing ("votre satisfaction est notre priorité", etc.).
- business.tagline peut contenir un seul <em>...</em> autour du mot à accentuer.
- Les champs texte long (description, story, services[].description, faq[].a) séparent leurs paragraphes par une ligne vide.
- Un champ image (img : { src, alt, caption? }) ne doit être rempli QUE si le fichier existe réellement. Images disponibles dans sites/${slug}/public/images/ : ${imagesTexte}. Pour toute autre image, laisse le champ absent.
- Applique la règle de variété : ne choisis pas la même direction + le même hero qu'un site existant du même métier ou de la même ville (voir la sortie de \`ff variete\` ci-dessous).
- Rythme de page (docs/CONVENTIONS.md règle 19) : la liste layout.sections ne doit pas aligner trois blocs au même squelette — varie les variantes, et n'inclus une section que si le brief a la donnée correspondante.

--- docs/DIRECTIONS.md (guide de choix de direction et de variantes) ---
${directionsGuide}

--- sortie de \`node scripts/ff.mjs variete\` (combinaisons déjà utilisées par les sites existants) ---
${varieteTexte}

--- sites/_exemple/site.config.ts (référence de structure et de style — version TS de l'objet que tu remplis en JSON ; chiffres fictifs à ne pas réutiliser) ---
${exempleConfig}`;

const userPrompt = `Voici le brief du client, rempli depuis docs/BRIEF.md. Appelle \`ecrire_site_config\` avec le contenu du site en respectant toutes les règles du message système.

--- brief ---
${brief}`;

// ---- 8. Appels API (tool use forcé) ----
async function demanderAuModele(messages) {
  try {
    return await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      system: systemPrompt,
      tools: [TOOL],
      tool_choice: { type: 'tool', name: TOOL.name },
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

function toolUseDe(message) {
  const bloc = message.content.find((b) => b.type === 'tool_use' && b.name === TOOL.name);
  return bloc || null;
}

/**
 * Enchaîne un tour de correction : l'API exige un bloc tool_result après un tool_use, c'est lui
 * qui porte la consigne de correction (validation zod ou erreur de build).
 */
async function corriger(messages, reponsePrecedente, toolUse, consigne) {
  messages.push({ role: 'assistant', content: reponsePrecedente.content });
  messages.push({
    role: 'user',
    content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: consigne }],
  });
  const reponse = await demanderAuModele(messages);
  return { reponse, toolUse: toolUseDe(reponse) };
}

/** Valide l'objet JSON du modèle avec le schéma zod réel. Renvoie '' si valide, sinon les erreurs. */
function erreursZod(input) {
  const parsed = siteSchema.safeParse(input);
  if (parsed.success) return '';
  return parsed.error.issues.map((i) => `  - ${i.path.join('.') || '(racine)'} : ${i.message}`).join('\n');
}

console.log(`Génération de sites/${slug}/site.config.ts (sortie structurée, validation zod)...`);
const messages = [{ role: 'user', content: userPrompt }];
let reponse = await demanderAuModele(messages);
let toolUse = toolUseDe(reponse);
if (!toolUse) {
  erreur("le modèle n'a pas appelé l'outil ecrire_site_config (réponse inattendue).");
}

// Validation zod AVANT tout build : une correction ici coûte un aller-retour, pas un build raté.
let zodErrors = erreursZod(toolUse.input);
if (zodErrors) {
  console.log('Objet invalide selon le schéma zod. Renvoi des erreurs au modèle...');
  ({ reponse, toolUse } = await corriger(
    messages,
    reponse,
    toolUse,
    `L'objet a été refusé par la validation zod (celle de defineSite). Corrige ces erreurs et rappelle l'outil :\n${zodErrors}`,
  ));
  if (!toolUse) erreur("le modèle n'a pas rappelé l'outil après la demande de correction.");
  zodErrors = erreursZod(toolUse.input);
  if (zodErrors) {
    erreur(`l'objet reste invalide après correction :\n${zodErrors}\nRelance la commande, ou corrige à la main.`);
  }
}

// ---- 9. Écriture (avec sauvegarde) : sérialisation TS déterministe ----
const configPath = resolve('sites', slug, 'site.config.ts');
if (existsSync(configPath)) {
  copyFileSync(configPath, `${configPath}.bak`);
  console.log(`Ancien fichier sauvegardé : sites/${slug}/site.config.ts.bak`);
}

function rendreFichier(input) {
  return (
    `/**\n * Généré par scripts/ff-generer.mjs — relire avant livraison.\n` +
    ` * Règle d'or : aucune donnée inventée (avis, notes, chiffres) — un champ sans source dans le\n` +
    ` * brief reste absent, la section correspondante s'adapte ou disparaît.\n */\n` +
    `import { defineSite } from '@/lib/schema';\n\n` +
    `export default defineSite(${toTs(input, 0)});\n`
  );
}

writeFileSync(configPath, rendreFichier(toolUse.input));
console.log(`Écrit : sites/${slug}/site.config.ts`);

// ---- 10. Build, avec une correction possible ----
console.log('Build...');
let build = runNode(['scripts/ff.mjs', 'build', slug]);

if (build.status !== 0) {
  console.log("Le build a échoué. Renvoi de l'erreur au modèle pour une correction...");
  ({ reponse, toolUse } = await corriger(
    messages,
    reponse,
    toolUse,
    `L'objet a été enregistré mais le build du site a échoué avec l'erreur suivante. Corrige-la et rappelle l'outil avec l'objet complet corrigé.\n\n--- erreur de build ---\n${build.out}`,
  ));
  if (toolUse) {
    const errs = erreursZod(toolUse.input);
    if (!errs) {
      writeFileSync(configPath, rendreFichier(toolUse.input));
      console.log(`Réécrit après correction : sites/${slug}/site.config.ts`);
      console.log('Nouveau build...');
      build = runNode(['scripts/ff.mjs', 'build', slug]);
    } else {
      console.error(`La correction proposée est elle-même invalide :\n${errs}`);
    }
  }
}

// ---- 11. Rapport final ----
cleanTmp();
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
